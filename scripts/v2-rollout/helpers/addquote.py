#!/usr/bin/env python3
"""一次核验并写入多条逐字摘录。
用法: addquote.py <benchmark-id> <<'Q'
[{"cite":"paper@§3.2","quote":"..."}, {"cite":"repo@README","quote":"..."}]
Q
（也接受每行一个 JSON 对象；或 addquote.py <id> '<cite>' '<quote>' 单条）
规则与 check-one.mjs / reverify.py 相同：规范化后逐字（可用 … 分段，每段 ≥8 字符）出现在 $EVIDENCE_DIR/<id>/<sid>.txt。
通过的追加进 $EVIDENCE_DIR/<id>.evidence.json（自动去重），失败的给出原文附近片段提示，不写入。
来源若不是用 srcfetch.py 抓的，会警告：验收会重新抓原网页，非原样保存的文本大概率被驳回。"""
import sys, os, json, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _rv import EVIDENCE_DIR, VIEW_DIR, norm, hit
def load_items(a):
    if len(a) == 3: return [{'cite': a[1], 'quote': a[2]}]
    raw = sys.stdin.read().strip()
    if not raw: return []
    try:
        d = json.loads(raw); return d if isinstance(d, list) else [d]
    except Exception: return [json.loads(l) for l in raw.splitlines() if l.strip()]
def hint(q, t):
    parts = [p for p in re.split(r'\s*(?:…|\.\.\.)\s*', norm(q)) if len(p) >= 8]
    for p in parts:
        if p in t: continue
        lo, hi = 0, len(p)  # 最长可匹配前缀
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if p[:mid] in t: lo = mid
            else: hi = mid - 1
        if lo >= 12:
            i = t.index(p[:lo]); return f'前 {lo} 字符匹配，之后原文是: «{t[i:i+lo+120]}»'
        return '原文中找不到开头部分；请从 view 文件重新逐字复制（不要带 markdown/表格竖线/链接语法，不要拼接表格行）'
    return ''
def main():
    a = sys.argv[1:]
    if not a or a[0] in ('-h', '--help'): print(__doc__); sys.exit(2)
    bid = a[0]; items = load_items(a)
    evf = f'{EVIDENCE_DIR}/{bid}.evidence.json'
    ev = json.load(open(evf)) if os.path.exists(evf) else {'id': bid, 'quotes': []}
    have = {(q['cite'], q['quote']) for q in ev['quotes']}
    man_p = f'{VIEW_DIR}/{bid}/manifest.json'; man = json.load(open(man_p)) if os.path.exists(man_p) else {}
    cache = {}; ok = bad = 0
    for it in items:
        c, q = str(it.get('cite', '')), str(it.get('quote', ''))
        sid = c.split('@')[0]; p = f'{EVIDENCE_DIR}/{bid}/{sid}.txt'
        if sid not in cache: cache[sid] = norm(open(p, errors='ignore').read()) if os.path.exists(p) else None
        t = cache[sid]
        if t is None: bad += 1; print(f'FAIL [{c}] 证据原文不存在: {p}（先 srcfetch.py {bid} {sid} <url>）'); continue
        if len(norm(q)) < 15: bad += 1; print(f'FAIL [{c}] 摘录过短（需 ≥15 字符，建议 30–300）'); continue
        if not hit(q, t): bad += 1; print(f'FAIL [{c}] {q[:80]!r} — {hint(q, t)}'); continue
        warn = '' if sid in man else '  ⚠ 该来源不是 srcfetch.py 抓取的，验收重抓可能对不上'
        if (c, q) not in have: ev['quotes'].append({'cite': c, 'quote': q}); have.add((c, q))
        ok += 1; print(f'OK   [{c}]{warn}')
    json.dump(ev, open(evf, 'w'), ensure_ascii=False, indent=1)
    print(f'== 写入/已存在 {ok} 条，失败 {bad} 条；证据文件共 {len(ev["quotes"])} 条')
main()
