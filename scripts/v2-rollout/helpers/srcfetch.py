#!/usr/bin/env python3
"""用法: srcfetch.py <benchmark-id> <source-id> <url>   （可多组: srcfetch.py <id> sid1 url1 sid2 url2 ...）
按验收脚本 reverify.py 完全相同的方式（同一 curl/pdftotext/jina、同一 fresh/ 缓存）抓取来源，
写入证据原文 $EVIDENCE_DIR/<id>/<sid>.txt，并生成便于阅读的 $VIEW_DIR/<id>/<sid>.txt。
从 view 文件里复制的连续句子，验收重新抓取时一定能找到。"""
import sys, os, re, json, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _rv import EVIDENCE_DIR, VIEW_DIR, fetch, jina, cache_path, is_pdfish
def readable(raw):
    t = re.sub(r'[ \t\r\f\v]+', ' ', raw); t = re.sub(r'\n\s*\n+', '\n', t); return t.strip()
def one(bid, sid, url):
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]*', sid): return {'sid': sid, 'error': 'source id 必须是 kebab-case'}
    cp = cache_path(url)
    if os.path.exists(cp) and len(open(cp, errors='ignore').read().strip()) < 300: os.remove(cp)  # 空缓存重抓一次
    t = fetch(url)
    parts = [t]; jt = ''
    if not is_pdfish(url) or len(t.strip()) < 2000:
        jt = jina(url)
        if len(jt.strip()) < 200 and os.path.exists(cache_path(url, True)): os.remove(cache_path(url, True)); jt = jina(url)
        parts.append(jt)
    os.makedirs(f'{EVIDENCE_DIR}/{bid}', exist_ok=True); os.makedirs(f'{VIEW_DIR}/{bid}', exist_ok=True)
    open(f'{EVIDENCE_DIR}/{bid}/{sid}.txt', 'w').write('\n\n'.join(parts))
    # 阅读版：PDF 取非 layout 版正文；HTML 取去标签正文 + jina 版
    if is_pdfish(url):
        view = readable(t)
    else:
        st = re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>', ' ', t); st = html.unescape(re.sub(r'<[^>]+>', ' ', st))
        seen = set(); lines = []
        for ln in readable(st).split('\n'):
            k = ln.strip()
            if len(k) < 3 or k in seen: continue
            seen.add(k); lines.append(k)
        view = '\n'.join(lines) + ('\n\n===== jina 版 =====\n' + readable(jt) if jt else '')
    open(f'{VIEW_DIR}/{bid}/{sid}.txt', 'w').write(view)
    man = f'{VIEW_DIR}/{bid}/manifest.json'
    m = json.load(open(man)) if os.path.exists(man) else {}
    m[sid] = url; json.dump(m, open(man, 'w'), ensure_ascii=False, indent=1)
    return {'sid': sid, 'url': url, 'chars_fetch': len(t), 'chars_jina': len(jt), 'view': f'{VIEW_DIR}/{bid}/{sid}.txt', 'usable': len(t.strip()) + len(jt.strip()) > 500}
if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 3 or len(a) % 2 == 0: print(__doc__); sys.exit(2)
    for i in range(1, len(a), 2): print(json.dumps(one(a[0], a[i], a[i + 1]), ensure_ascii=False))
