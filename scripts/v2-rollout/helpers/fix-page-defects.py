#!/usr/bin/env python3
"""修复 v2 页面成品里会让全局 validate-data 门禁失败的两类缺陷。

1) 缺失值写成 "-"：仓库规范（scripts/validate-data.mjs forbidDash）要求缺失一律用 null 或显式状态，
   "-" 不是合法值。official_results 表格里 "-" 一律表示"来源未披露该值"，改成 null。

2) 外键不存在：categories 必须是 data/taxonomy.json 里的 id；related_benchmarks 必须是站内已有页面 id。
   非法值按站内既有分类与既有页面 id 对应关系修正；站内根本没有对应页面的直接删除。

不新增 compare-rules、不改门禁、不编造计分决定；只改被证实错误的字段。
用法：fix-page-defects.py [--dry] [<id> ...]
"""
import json
import os
import sys
from pathlib import Path

R = Path("/workspace/rollout")
OUT = R / "out"
WT = Path(os.environ.get("PUBLISH_WT", "/workspace/evals-publish"))

# 非法类别 → 站内 taxonomy id。
# agentic→agent / instruction-following→preference / math→reasoning / video→multimodal：
#   按站内同类页面的既有归类（cursor-bench=agent 类、ifeval=preference、imo-2025=reasoning、video-mme=multimodal）。
CAT_MAP = {
    "agentic": "agent",
    "instruction-following": "preference",
    "math": "reasoning",
    "video": "multimodal",
    "图像编辑": "multimodal",
    "图像生成": "multimodal",
}

# related_benchmarks 里的站外写法 → 站内已有页面 id（依据站内页面 name 实测对应关系）。
REL_MAP = {
    "swe-bench": "swebench",                    # 站内 id=swebench，name="SWE-bench Verified"
    "swe-bench-verified": "swebench",           # 同上
    "swe-bench-multilingual": "swebench-multilingual",
    "terminal-bench": "terminalbench",          # name="Terminal-Bench"
    "biglawbench": "biglaw-bench",              # name="BigLaw Bench"
}

# 站内没有对应页面的 related id，直接删除（不凭空造页面）。
REL_DROP = {"agieval", "freshqa", "pinchbench", "artificial-analysis-text-to-image-arena"}


def taxonomy_ids():
    tax = json.loads((WT / "data" / "taxonomy.json").read_text())
    return {c["id"] for c in tax["categories"]}


def site_ids():
    return {p.stem for p in (WT / "data" / "benchmarks").glob("*.json")}


def site_categories(bid, cats):
    """站内已有同 id 页面的 categories（站内分类是本站自己的既有结论，优先于本脚本的推断）。"""
    p = WT / "data" / "benchmarks" / f"{bid}.json"
    if not p.exists():
        return None
    try:
        d = json.loads(p.read_text())
    except Exception:
        return None
    c = [x for x in (d.get("categories") or []) if x in cats]
    return c or None


def nullify_dashes(node, path="", hits=None):
    """把值恰为 "-" 的字段就地改成 null（只改整值，不动句子里的短横线）。"""
    if hits is None:
        hits = []
    if isinstance(node, dict):
        for k in list(node):
            v = node[k]
            if v == "-":
                hits.append(f"{path}.{k}" if path else k)
                node[k] = None
            else:
                nullify_dashes(v, f"{path}.{k}" if path else k, hits)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            if v == "-":
                hits.append(f"{path}[{i}]")
                node[i] = None
            else:
                nullify_dashes(v, f"{path}[{i}]", hits)
    return node


def fix_page(bid, cats, sids, dry=False, path=None):
    f = Path(path) if path else OUT / f"{bid}.json"
    raw = f.read_text()
    d = json.loads(raw)
    notes = []

    # --- categories ---
    old_cats = list(d.get("categories") or [])
    # 站内已有同 id 页面时，分类以站内既有结论为准（本站自己的分类是可追溯事实）；
    # 没有站内页面时才用映射表兜底。
    site_cats = site_categories(bid, cats)
    new_cats = []
    for c in old_cats:
        c2 = CAT_MAP.get(c, c)
        if c2 != c:
            notes.append(f"categories: {c!r} → {c2!r}（站内 taxonomy 无 {c!r}）")
        if c2 not in new_cats:
            new_cats.append(c2)
    new_cats = [c for c in new_cats if c in cats]
    if site_cats and any(c not in cats for c in old_cats):
        notes.append(f"categories: 采纳站内既有分类 {site_cats}（本站对该页的既有结论）")
        new_cats = site_cats
    if new_cats != old_cats:
        d["categories"] = new_cats
    elif not new_cats:
        notes.append("categories: 站内既有页面也没有合法分类，需人工归类")
        return None

    # --- related_benchmarks ---
    old_rel = list(d.get("related_benchmarks") or [])
    new_rel = []
    for r in old_rel:
        if r in REL_DROP:
            notes.append(f"related_benchmarks: 删除 {r!r}（站内无对应页面）")
            continue
        r2 = REL_MAP.get(r, r)
        if r2 != r:
            notes.append(f"related_benchmarks: {r!r} → {r2!r}（站内 id 实为 {r2!r}）")
        if r2 not in sids:
            notes.append(f"related_benchmarks: 删除 {r!r}（站内无对应页面）")
            continue
        if r2 not in new_rel:
            new_rel.append(r2)
    if new_rel != old_rel:
        d["related_benchmarks"] = new_rel

    # --- 缺失值 "-" → null ---
    hits = []
    nullify_dashes(d, "", hits)
    if hits:
        notes.append(f'"-" → null 共 {len(hits)} 处')

    if not notes:
        return None
    if not dry:
        f.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n")
    return notes


def main():
    args = sys.argv[1:]
    dry = "--dry" in args
    files = []
    ids = []
    i = 0
    while i < len(args):
        a = args[i]
        if a == "--file":
            i += 1
            files.append(args[i])
        elif a.startswith("--"):
            pass
        else:
            ids.append(a)
        i += 1
    cats, sids = taxonomy_ids(), site_ids()
    if files:
        targets = [(Path(p).stem, Path(p)) for p in files]
    else:
        targets = [(p.stem, p) for p in sorted(OUT.glob("*.json"))]
    changed = 0
    for bid, f in targets:
        if not f.exists():
            print(f"SKIP {bid}: 文件不存在")
            continue
        try:
            d = json.loads(f.read_text())
        except Exception as e:
            print(f"SKIP {bid}: JSON 解析失败 {e}")
            continue
        if (d.get("profile") or {}).get("template") != "benchmark-profile/v2":
            continue
        notes = fix_page(bid, cats, sids, dry=dry, path=f)
        if notes:
            changed += 1
            print(f"{bid}:")
            for n in notes:
                print(f"    {n}")
    print(f"\n{'（dry-run，未落盘）' if dry else ''}共修复 {changed} 页", file=sys.stderr)


if __name__ == "__main__":
    main()
