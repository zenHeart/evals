#!/usr/bin/env python3
"""对账 published.tsv：把「已推送且已部署、但台账漏记」的页补齐，把 pending 行落实。

背景：等 GitHub Actions 期间本机到 api.github.com 的连接可能长时间无响应，
publish-batch.sh 的轮询会一直拿到空状态，35 分钟后按 rc=11 超时退出。此时页面其实
已经 commit、push 并由 Actions 成功部署，但 published.tsv 少了这一行——账目与实际
上线情况对不上。

本脚本以 origin/main 为准做对账：
  1. 取 origin/main 上所有 v2 页面，与 published.tsv 的 id 求差集 → 漏记的页；
  2. 为漏记的页定位「把它变成 v2 的那次提交」（新增提交，或更早的改写提交）；
  3. 按该提交 SHA 找对应的 Build & Publish run（gh api，单次调用有超时）；
  4. curl 线上页面确认含 benchmark-profile/v2；
  5. 把结果写回 published.tsv（pending → ok / failed），补齐漏记行。

只读 origin/main，不改远程、不改仓库文件；只追加/更新 published.tsv。
"""
import importlib.util
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from datetime import datetime
from pathlib import Path

# upsert-published.py 的文件名带连字符，不能直接 import；按路径加载。
_spec = importlib.util.spec_from_file_location(
    "upsert_published", Path(__file__).resolve().parent / "upsert-published.py")
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
upsert_many = _mod.upsert_many

R = Path("/workspace/rollout")
WT = os.environ.get("PUBLISH_WT", "/workspace/evals-publish")
REPO = os.environ.get("PUBLISH_REPO", "zenHeart/evals")
SITE = os.environ.get("PUBLISH_SITE", "https://evals.zenheart.site")
PUB = R / "published.tsv"
GH_TIMEOUT = 25
CURL_TIMEOUT = 45


def git(*args, timeout=120):
    return subprocess.run(["git", "-C", WT, *args], capture_output=True, text=True, timeout=timeout)


def origin_v2():
    """origin/main 上 template == benchmark-profile/v2 的页面 id 集合。"""
    ids = set()
    tmp = tempfile.mkdtemp()
    try:
        p1 = subprocess.Popen(["git", "-C", WT, "archive", "--format=tar", "origin/main",
                               "data/benchmarks"], stdout=subprocess.PIPE)
        p2 = subprocess.Popen(["tar", "-x", "-C", tmp], stdin=p1.stdout, stdout=subprocess.DEVNULL)
        p1.stdout.close()
        p2.wait()
        p1.wait()
        for f in (Path(tmp) / "data" / "benchmarks").glob("*.json"):
            try:
                d = json.loads(f.read_text())
            except Exception:
                continue
            if d.get("profile", {}).get("template") == "benchmark-profile/v2":
                ids.add(f.stem)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    return ids


def add_commits():
    """一次拿到「每个文件是在哪个提交被新增的」。"""
    out = git("log", "--diff-filter=A", "--format=C %H", "--name-only",
              "origin/main", "--", "data/benchmarks").stdout
    res, cur = {}, None
    for line in out.splitlines():
        if line.startswith("C "):
            cur = line[2:].strip()
        elif line.strip() and cur:
            res.setdefault(Path(line.strip()).stem, cur)
    return res


def is_v2_at(sha, bid):
    p = git("show", f"{sha}:data/benchmarks/{bid}.json", timeout=60)
    if p.returncode != 0:
        return False
    try:
        d = json.loads(p.stdout)
    except Exception:
        return False
    return d.get("profile", {}).get("template") == "benchmark-profile/v2"


def publish_commit(bid, adds):
    """定位「把该页变成 v2 的那次提交」：优先新增提交，否则回溯到最早出现的 v2 提交。"""
    a = adds.get(bid)
    if a and is_v2_at(a, bid):
        return a
    hist = git("log", "--format=%H", "origin/main", "--", f"data/benchmarks/{bid}.json").stdout.split()
    for sha in reversed(hist):          # 从最老往最新找，第一个 v2 的就是上线提交
        if is_v2_at(sha, bid):
            return sha
    return a or (hist[-1] if hist else None)


def commit_time(sha):
    out = git("show", "-s", "--format=%ci", sha, timeout=60).stdout.strip()
    try:
        return datetime.strptime(out[:19], "%Y-%m-%d %H:%M:%S").strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def find_run(sha):
    """按 head_sha 找 Build & Publish run：返回 (run_id, conclusion, api_ok)。

    api_ok=False 表示这次 API 调用本身失败（网络/限流），下轮再来；
    api_ok=True 且 run_id 为 None 表示查过了，确实没有这个提交对应的 run。
    """
    try:
        r = subprocess.run(
            ["gh", "api", f"repos/{REPO}/actions/runs?head_sha={sha}&per_page=10"],
            capture_output=True, text=True, timeout=GH_TIMEOUT)
    except subprocess.TimeoutExpired:
        return None, None, False
    if r.returncode != 0:
        return None, None, False
    try:
        runs = json.loads(r.stdout).get("workflow_runs", [])
    except Exception:
        return None, None, False
    for run in runs:
        if run.get("name") == "Build & Publish" and run.get("event") == "push":
            return str(run["id"]), run.get("conclusion"), True
    return None, None, True


def find_run_containing(sha, runs):
    """退化路径：提交的 push 与别的提交合并在一起时，run 的 head_sha 是 push 的 tip。

    这种情况在历史上出现过（一次 push 同时带上试点页与其后续改动），此时按 head_sha
    精确匹配查不到 run。改为在候选 run 里找「head_sha 包含该提交」的最早一个。
    """
    best = None
    for run in runs:
        if run.get("name") != "Build & Publish" or run.get("event") != "push":
            continue
        head = run.get("head_sha")
        if not head or head == sha:
            continue
        p = subprocess.run(["git", "-C", WT, "merge-base", "--is-ancestor", sha, head],
                           capture_output=True, text=True, timeout=60)
        if p.returncode == 0:
            if best is None or run.get("created_at", "") < best.get("created_at", ""):
                best = run
    if best is None:
        return None, None
    return str(best["id"]), best.get("conclusion")


def list_runs(limit=100):
    """拉取最近的 Build & Publish push run 列表（失败返回 None）。"""
    try:
        r = subprocess.run(
            ["gh", "api", f"repos/{REPO}/actions/runs?per_page={limit}&event=push"],
            capture_output=True, text=True, timeout=GH_TIMEOUT)
    except subprocess.TimeoutExpired:
        return None
    if r.returncode != 0:
        return None
    try:
        return json.loads(r.stdout).get("workflow_runs", [])
    except Exception:
        return None


def live_ok(bid):
    try:
        with urllib.request.urlopen(f"{SITE}/benchmarks/{bid}/", timeout=CURL_TIMEOUT) as resp:
            return b"benchmark-profile/v2" in resp.read()
    except Exception:
        return False


def read_rows():
    rows = []
    if not PUB.exists():
        return rows
    for line in PUB.read_text().splitlines():
        if line.strip():
            rows.append(line.split("\t"))
    return rows


def main():
    rows = read_rows()
    by_id = {r[0]: r for r in rows}
    v2 = origin_v2()
    adds = add_commits()
    updates = []

    # --- 1) 已有行里结果不是 ok 的，重新落实 ---
    for r in rows:
        if len(r) < 6 or r[5] in ("ok", "failed"):
            continue
        bid, sha = r[0], r[1]
        run_id, concl, api_ok = find_run(sha)
        if run_id is None and api_ok:
            run_id, concl = find_run_containing(sha, list_runs() or [])
        if run_id is None:
            continue                      # API 还不可用或查无此 run，下轮再来
        if concl is None:
            continue                      # run 还在跑
        ok = live_ok(bid) if concl == "success" else False
        run_url = r[4] if len(r) > 4 and r[4] else f"https://github.com/{REPO}/actions/runs/{run_id}"
        updates.append({"id": bid, "sha": sha, "time": r[2],
                        "url": r[3] if len(r) > 3 else f"{SITE}/benchmarks/{bid}/",
                        "run_url": run_url, "result": "ok" if ok else "failed"})
        print(f"[reconcile] 落实 {bid}：run {run_id} 结论={concl} → {'ok' if ok else 'failed'}")

    # --- 2) origin/main 上是 v2、但台账里没有的页 → 补行 ---
    missing = sorted(v2 - set(by_id))
    runs_cache = None
    for bid in missing:
        sha = publish_commit(bid, adds)
        if not sha:
            print(f"[reconcile] {bid}：找不到上线提交，跳过")
            continue
        run_id, concl, api_ok = find_run(sha)
        if run_id is None and api_ok:
            if runs_cache is None:
                runs_cache = list_runs()
            run_id, concl = find_run_containing(sha, runs_cache or [])
        if run_id is None:
            print(f"[reconcile] {bid}：GitHub API 暂不可用或查无对应 run，下轮再补")
            continue
        if concl is None:
            print(f"[reconcile] {bid}：run {run_id} 尚未结束，下轮再补")
            continue
        ok = live_ok(bid) if concl == "success" else False
        result = "ok" if ok else "failed"
        updates.append({"id": bid, "sha": sha, "time": commit_time(sha),
                        "url": f"{SITE}/benchmarks/{bid}/",
                        "run_url": f"https://github.com/{REPO}/actions/runs/{run_id}",
                        "result": result})
        print(f"[reconcile] 补记 {bid}：{sha} run {run_id} 结论={concl} → {result}")

    if updates:
        n = upsert_many(updates)
        print(f"[reconcile] published.tsv 已更新（{n} 行）")
    else:
        print("[reconcile] 无需变更")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"[reconcile] 异常：{e}", file=sys.stderr)
        sys.exit(1)
