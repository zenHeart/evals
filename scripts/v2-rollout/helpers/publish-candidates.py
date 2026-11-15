#!/usr/bin/env python3
"""列出当前可增量发布的页面，一行一个：<id>\t<need_reverify>\t<note>

判定（全部满足才列出）：
  1. gate.tsv 判定为 accept
  2. out/<id>.json 存在，且 profile.template == benchmark-profile/v2
  3. check-one.mjs 通过（本地逐字证据 + schema 校验）
  4. 不在 published.tsv（未推送过）
  5. origin/main 上的 data/benchmarks/<id>.json 还不是 v2

need_reverify=1 表示 out 文件是在 gate 判定之后才出现的（典型：recover-out.py 从会话里恢复的
历史 accept 页面），必须重新 check-one + reverify 才能上线，不能凭 gate.tsv 的旧 accept 放行。
regated.tsv 里已有「重新验收 accept」记录、且 out 文件此后未再变化的，算作已复验（need=0）；
复验结果为 reject 的页面直接排除，不上线。

性能：check-one 对 400+ 页逐字核验要跑几十分钟，每轮重跑会让逐页发布饿死。
故按 out 文件的 (mtime+size) 缓存 check-one 结果，命中就不重跑 node；
origin/main 上是否已是 v2 每轮用一次 git archive 批量读出，不按页调 git。
缓存文件：/workspace/rollout/logs/publish-cache.tsv
"""
import json, os, shutil, subprocess, sys, tarfile, tempfile
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path

R = Path("/workspace/rollout")
WT = os.environ.get("PUBLISH_WT", "/workspace/evals-publish")
OUT = R / "out"
CACHE = R / "logs" / "publish-cache.tsv"
WORKERS = int(os.environ.get("CHECK_ONE_WORKERS", "4"))  # 并发 check-one 数（控制内存）


def load_cache():
    c = {}
    if CACHE.exists():
        for line in CACHE.read_text().splitlines():
            parts = line.split("\t")
            if len(parts) == 4:
                c[parts[0]] = (parts[1], parts[2], parts[3])
    return c


def save_cache(c):
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    tmp = CACHE.with_suffix(".tmp")
    tmp.write_text("".join(f"{k}\t{v[0]}\t{v[1]}\t{v[2]}\n" for k, v in sorted(c.items())))
    tmp.replace(CACHE)


def origin_v2_ids():
    """origin/main 上 data/benchmarks/ 里已经是 v2 的 id 集合（一次 git archive 批量读）。"""
    ids = set()
    tmp = tempfile.mkdtemp()
    try:
        p1 = subprocess.Popen(["git", "-C", WT, "archive", "--format=tar", "origin/main",
                               "data/benchmarks"], stdout=subprocess.PIPE)
        p2 = subprocess.Popen(["tar", "-x", "-C", tmp], stdin=p1.stdout, stdout=subprocess.DEVNULL)
        p1.stdout.close()
        p2.wait()
        p1.wait()
        base = Path(tmp) / "data" / "benchmarks"
        if not base.is_dir():
            return ids
        for f in base.glob("*.json"):
            try:
                d = json.loads(f.read_text())
            except Exception:
                continue
            if d.get("profile", {}).get("template") == "benchmark-profile/v2":
                ids.add(f.stem)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    return ids


def run_check_one(f):
    """返回 (ok, 错误摘要)。"""
    w = Path(tempfile.mkdtemp())
    try:
        (w / "data" / "benchmarks").mkdir(parents=True)
        os.symlink("/workspace/evals/scripts", str(w / "scripts"))
        shutil.copy(f, w / "data" / "benchmarks" / f.name)
        r = subprocess.run(["node", str(R / "check-one.mjs"), f"data/benchmarks/{f.name}"],
                           capture_output=True, text=True, cwd=str(w))
        if r.returncode == 0:
            return True, ""
        out = (r.stdout.strip().splitlines() or [r.stderr.strip()])[0]
        return False, " ".join(out.split())[:200]
    finally:
        shutil.rmtree(w, ignore_errors=True)


def main():
    subprocess.run(["git", "-C", WT, "fetch", "-q", "origin"], capture_output=True)

    published = set()
    p = R / "published.tsv"
    if p.exists():
        for line in p.read_text().splitlines():
            if line.strip():
                published.add(line.split("\t")[0])

    gate = {}
    for line in (R / "gate.tsv").read_text().splitlines():
        parts = line.split("\t")
        # gate.tsv 会因重复验收而出现同一 id 多行；取最后一次有明确判定的结果，
        # 空判定行（旧格式占位）不覆盖已有判定。
        if len(parts) >= 2 and parts[1] in ("accept", "reject"):
            gate[parts[0]] = (parts[1], parts[3] if len(parts) > 3 else "")

    # 复验台账：取每页最后一次 regate 结果
    regated = {}
    rg = R / "regated.tsv"
    if rg.exists():
        for line in rg.read_text().splitlines():
            parts = line.split("\t")
            if len(parts) >= 4 and parts[1] in ("accept", "reject"):
                regated[parts[0]] = (parts[1], parts[3].strip())

    orig_v2 = origin_v2_ids()
    cache = load_cache()
    dirty = False

    # 第一遍：确定候选与哪些需要真跑 check-one（缓存未命中的）
    pending = []   # (bid, f, sig)
    seen = {}      # bid -> (co_ok, co_err)
    for f in sorted(OUT.glob("*.json")):
        bid = f.stem
        verdict, gtime = gate.get(bid, (None, ""))
        if verdict != "accept":
            continue
        if bid in published:
            continue
        try:
            d = json.loads(f.read_text())
        except Exception:
            continue
        if d.get("profile", {}).get("template") != "benchmark-profile/v2":
            continue

        st = f.stat()
        sig = f"{st.st_mtime_ns}:{st.st_size}"
        hit = cache.get(bid)
        if hit and hit[0] == sig:
            seen[bid] = (hit[1], hit[2])
        else:
            pending.append((bid, f, sig))

    # 第二遍：并发跑 check-one（每个 node 进程约 50MB，控制在 4 路）
    if pending:
        def work(item):
            bid, f, sig = item
            co_ok, co_err = run_check_one(f)
            co_ok = "1" if co_ok else "0"
            cache[bid] = (sig, co_ok, co_err)
            return bid, co_ok, co_err

        with ThreadPoolExecutor(max_workers=WORKERS) as ex:
            for bid, co_ok, co_err in ex.map(work, pending):
                seen[bid] = (co_ok, co_err)
        dirty = True

    # 第三遍：按 id 顺序输出候选
    for f in sorted(OUT.glob("*.json")):
        bid = f.stem
        if bid not in seen:
            continue
        if bid in orig_v2:
            continue  # origin/main 上已是 v2
        co_ok, co_err = seen[bid]
        if co_ok != "1":
            print(f"{bid}\t0\tcheck-one FAIL: {co_err}", file=sys.stderr)
            continue
        verdict, gtime = gate.get(bid, (None, ""))

        # out 是否晚于 gate 判定出现 / 是否已复验
        need = 0
        note = "gate accept"
        try:
            st = f.stat()
            mtime = datetime.fromtimestamp(st.st_mtime)
            gt = datetime.strptime(gtime, "%Y-%m-%d %H:%M:%S")
            if mtime > gt:
                rv = regated.get(bid)
                if rv and rv[0] == "accept":
                    rt = datetime.strptime(rv[1], "%Y-%m-%d %H:%M:%S")
                    if rt >= mtime:
                        need = 0
                        note = f"gate accept + 重新验收 accept（{rv[1]}）"
                    else:
                        need = 1
                        note = f"复验后 out 又被改写（{mtime:%F %T}），需再次复验"
                elif rv and rv[0] == "reject":
                    continue  # 复验 reject，不上线，保留线上现版
                else:
                    need = 1
                    note = f"out({mtime:%F %T}) 晚于 gate({gtime}) → 需重新 check-one + reverify"
        except Exception:
            pass
        print(f"{bid}\t{need}\t{note}")

    if dirty:
        save_cache(cache)


if __name__ == "__main__":
    main()
