#!/usr/bin/env python3
"""prefetch.py <benchmark-id> <entity.json> : 在模型启动前把实体里已有的来源 URL 预抓到证据目录，打印清单（供写入提示词）。"""
import sys, os, re, json, subprocess, concurrent.futures as cf
H = os.path.dirname(os.path.abspath(__file__))
bid, f = sys.argv[1], sys.argv[2]
b = json.load(open(f)); urls = []
for s in (b.get('profile') or {}).get('sources', []) or []:
    if s.get('url', '').startswith('http'): urls.append((s.get('id'), s.get('kind', ''), s['url']))
for s in b.get('official_sources', []) or []:
    u = s.get('url', '') if isinstance(s, dict) else str(s)
    if u.startswith('http'): urls.append((None, (s.get('kind', '') if isinstance(s, dict) else ''), u))
def sid_for(sid, kind, u):
    if sid and re.fullmatch(r'[a-z0-9][a-z0-9-]*', sid): return sid
    m = re.search(r'arxiv\.org/(?:abs|pdf|html)/(\d{4}\.\d{4,5})', u)
    if m: return 'arxiv-' + m.group(1).replace('.', '-')
    m = re.match(r'https?://github\.com/([^/]+)/([^/#?]+)', u)
    if m: return ('repo-' + m.group(2)).lower().replace('_', '-').replace('.', '-')[:40]
    m = re.match(r'https?://huggingface\.co/datasets/([^/]+)/([^/#?]+)', u)
    if m: return ('hf-' + m.group(2)).lower().replace('_', '-').replace('.', '-')[:40]
    host = re.sub(r'^www\.', '', re.match(r'https?://([^/]+)', u).group(1))
    path = re.sub(r'[^a-z0-9]+', '-', u.split(host, 1)[1].lower()).strip('-')[:24]
    return re.sub(r'-+', '-', (host.split('.')[0] + ('-' + path if path else '')))[:40].strip('-')
seen = set(); jobs = []
pri = lambda x: 0 if ('arxiv' in x[2] or x[1] == 'paper') else 1 if ('github.com' in x[2] or 'huggingface.co/datasets' in x[2]) else 2
for sid, kind, u in sorted(urls, key=pri):
    if u in seen: continue
    seen.add(u); s = sid_for(sid, kind, u)
    while s in {j[0] for j in jobs}: s += '-2'
    jobs.append((s, u))
jobs = jobs[:8]
def run(j):
    try:
        out = subprocess.run([sys.executable, f'{H}/srcfetch.py', bid, j[0], j[1]], capture_output=True, text=True, timeout=200).stdout.strip()
        return json.loads(out.splitlines()[-1])
    except Exception as e: return {'sid': j[0], 'url': j[1], 'error': str(e)[:80]}
with cf.ThreadPoolExecutor(6) as ex: res = list(ex.map(run, jobs))
for r in res:
    st = '可用' if r.get('usable') else '抓取为空/失败（换别的一手 URL）'
    print(f"- {r.get('sid')}  {r.get('url')}  → {st}  阅读版: /workspace/rollout/view/{bid}/{r.get('sid')}.txt")
