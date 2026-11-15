#!/usr/bin/env python3
"""published.tsv 的受锁 upsert：按 (id, commit SHA) 定位行，存在则更新，否则追加。

为什么需要它：
  publish-batch.sh 在「已 push、等 Actions」这段窗口里如果崩掉或超时退出，
  页面其实已经上线了，但台账会漏记这一行；漏记的页又因为「已是 v2」被候选脚本
  永久跳过，于是账目与线上实际状态长期不一致。
  解决办法是：push 成功后立刻写一行 result=pending，等 Actions 与线上核验结束后
  再把同一行改成 ok / failed。定位键用 (id, sha)，所以「先 pending 后 ok」是同一行。

并发安全：
  读—改—写整个过程持有 /workspace/rollout/published.lock，
  publisher.sh（记账）与 reconcile-published.py（对账）共用同一把锁，不会互相覆盖。

用法（CLI）：
  upsert-published.py <id> <sha> <time> <page_url> <run_url> <result>
其中 <result> ∈ {pending, ok, failed}；run_url 未知时可传空串。
"""
import fcntl
import os
import sys
from pathlib import Path

PUB = Path(os.environ.get("PUBLISH_TSV", "/workspace/rollout/published.tsv"))
LOCK = Path(os.environ.get("PUBLISH_TSV_LOCK", "/workspace/rollout/published.lock"))


def _read_rows(path):
    if not path.exists():
        return []
    rows = []
    for line in path.read_text().splitlines():
        if line.strip():
            rows.append(line.split("\t"))
    return rows


def _write_rows(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_text("".join("\t".join(r) + "\n" for r in rows))
    os.replace(str(tmp), str(path))


def upsert_many(updates, path=None, lock=None):
    """updates: [{"id","sha","time","url","run_url","result"}, ...]；返回实际改动的行数。"""
    pub = Path(path) if path else PUB
    lk = Path(lock) if lock else LOCK
    lk.parent.mkdir(parents=True, exist_ok=True)
    with open(lk, "a+") as lf:
        fcntl.flock(lf.fileno(), fcntl.LOCK_EX)
        try:
            rows = _read_rows(pub)
            changed = 0
            for u in updates:
                bid, sha = u["id"], u["sha"]
                row = None
                for r in rows:
                    if len(r) >= 2 and r[0] == bid and r[1] == sha:
                        row = r
                        break
                if row is None:
                    row = [bid, sha]
                    rows.append(row)
                want = [u.get("time", ""), u.get("url", ""), u.get("run_url", ""), u.get("result", "")]
                if len(row) == 5:
                    # 首批发布的旧格式：第 5 列是结果（ok/failed），没有 run URL 列
                    row.append("")
                while len(row) < 6:
                    row.append("")
                row[2], row[3], row[4], row[5] = want
                changed += 1
            if changed:
                _write_rows(pub, rows)
            return changed
        finally:
            fcntl.flock(lf.fileno(), fcntl.LOCK_UN)


def main(argv):
    if len(argv) != 7:
        print("usage: upsert-published.py <id> <sha> <time> <page_url> <run_url> <result>",
              file=sys.stderr)
        return 2
    bid, sha, tm, url, run_url, result = argv[1:7]
    n = upsert_many([{"id": bid, "sha": sha, "time": tm, "url": url,
                       "run_url": run_url, "result": result}])
    print(f"[upsert] {bid} {sha} → {result}（{n} 行）")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
