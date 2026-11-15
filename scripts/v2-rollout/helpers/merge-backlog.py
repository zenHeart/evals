#!/usr/bin/env python3
"""rebase 冲突时合成 data/benchmark-profile-backlog.json。

语义：backlog 是「还没升级成 v2 的页面 id 列表」，各方只会从中删条目，不会加。
所以 rebase 冲突的正确结果 = 上游版本，再删掉「本地这批提交删掉的那些 id」：
    本地删掉的 id = 共同祖先的列表 − 本地提交的列表
这样既保住上游已删的条目，也不把本地已发布的页重新塞回 backlog。

用法：merge-backlog.py <base-rev> <ours-rev> <upstream-ref> > data/benchmark-profile-backlog.json
退出码：0 成功并输出合成结果；1 上游没有该文件（不处理）；2 参数错。
"""
import json
import subprocess
import sys

PATH = "data/benchmark-profile-backlog.json"


def load(rev):
    out = subprocess.run(["git", "show", f"{rev}:{PATH}"], capture_output=True, text=True)
    if out.returncode != 0:
        return None
    try:
        doc = json.loads(out.stdout)
    except Exception:
        return None
    if isinstance(doc, dict):
        return list(doc.get("ids", [])), doc
    if isinstance(doc, list):
        return list(doc), {"ids": list(doc)}
    return None, None


def main(argv):
    if len(argv) != 4:
        print("usage: merge-backlog.py <base-rev> <ours-rev> <upstream-ref>", file=sys.stderr)
        return 2
    base, ours, upstream = argv[1:4]
    up = load(upstream)
    if not up:
        return 1
    up_ids, up_doc = up
    removed = set()
    b = load(base)
    o = load(ours)
    if b and o:
        removed = set(b[0]) - set(o[0])
    final = [i for i in up_ids if i not in removed]
    doc = dict(up_doc) if isinstance(up_doc, dict) else {"ids": final}
    doc["ids"] = final
    if "count" in doc:
        doc["count"] = len(final)
    json.dump(doc, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
