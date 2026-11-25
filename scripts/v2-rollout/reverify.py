#!/usr/bin/env python3
"""独立复核：重新抓取每个来源 URL，检查证据摘录是否逐字出现在新抓取的原文里。
用法: reverify.py <out/id.json> ; 输出 JSON 汇总。
环境变量: ROLLOUT_ROOT 扁平数据根（默认 <repo>/data），EVIDENCE_DIR / FRESH_DIR 可分别覆盖。
   缓存: $FRESH_DIR/；证据账本: $EVIDENCE_DIR/<id>.evidence.json"""
import json,sys,re,os,subprocess,hashlib,html,unicodedata
_HERE=os.path.dirname(os.path.abspath(__file__)); _REPO=os.environ.get('EVALS_REPO') or os.path.dirname(os.path.dirname(_HERE))
R=os.environ.get('ROLLOUT_ROOT') or os.path.join(_REPO,'data')
EVIDENCE_DIR=os.environ.get('EVIDENCE_DIR') or os.path.join(R,'evidence')
FRESH_DIR=os.environ.get('FRESH_DIR') or os.path.join(R,'fresh')
os.makedirs(FRESH_DIR,exist_ok=True)
def norm(s):
    s=unicodedata.normalize('NFKC',s).lower()
    s=re.sub(r'[\u2018\u2019\u201c\u201d"\'`]','',s); s=re.sub(r'[\u2010-\u2015\u2212]','-',s)
    s=re.sub(r'-\s*\n\s*','',s); return re.sub(r'\s+',' ',s).strip()
def fetch(url):
    h=hashlib.md5(url.encode()).hexdigest(); p=f'{R}/fresh/{h}.txt'
    if os.path.exists(p): return open(p,errors='ignore').read()
    m=re.match(r'https://arxiv.org/(?:abs|pdf|html)/([\w.]+?)(?:v\d+)?(?:\.pdf)?/?$',url)
    txt=''
    try:
        if m or url.lower().endswith('.pdf'):
            u=f'https://arxiv.org/pdf/{m.group(1)}' if m else url
            subprocess.run(['curl','-sL','--max-time','90','-o',p+'.pdf',u],check=False)
            txt=subprocess.run(['pdftotext','-layout',p+'.pdf','-'],capture_output=True,text=True).stdout
            txt+='\n'+subprocess.run(['pdftotext',p+'.pdf','-'],capture_output=True,text=True).stdout
            if m:
                raw=subprocess.run(['curl','-sL','--max-time','60',f'https://arxiv.org/abs/{m.group(1)}'],capture_output=True).stdout.decode('utf8','ignore')
                txt+='\n'+html.unescape(re.sub(r'<[^>]+>',' ',raw))
        else:
            raw=subprocess.run(['curl','-sL','--max-time','60','-A','Mozilla/5.0',url],capture_output=True).stdout.decode('utf8','ignore')
            raw=re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>',' ',raw) if '<html' in raw[:2000].lower() else raw
            txt=html.unescape(re.sub(r'<[^>]+>',' ',raw))+'\n'+html.unescape(re.sub(r'<[^>]+>','',raw))+'\n'+raw
            gh=re.match(r'https://github.com/([^/]+/[^/#?]+)/?$',url)
            if gh:
                for br in ('main','master'):
                    rd=subprocess.run(['curl','-sL','--max-time','30',f'https://raw.githubusercontent.com/{gh.group(1)}/{br}/README.md'],capture_output=True).stdout.decode('utf8','ignore')
                    if len(rd)>100 and '404' not in rd[:20]: txt+='\n'+rd; break
    except Exception as e: txt=''
    open(p,'w').write(txt); return txt
b=json.load(open(sys.argv[1])); id_=b['id']
src={s['id']:s for s in b['profile']['sources']}
ev=json.load(open(f'{EVIDENCE_DIR}/{id_}.evidence.json'))
res={'id':id_,'found':0,'missing':0,'unverified':0,'unfetchable_sources':[],'missing_quotes':[]}
def jina(url):
    h=hashlib.md5(('jina'+url).encode()).hexdigest(); p=f'{R}/fresh/{h}.txt'
    if not os.path.exists(p):
        t=subprocess.run(['curl','-sL','--max-time','90','https://r.jina.ai/'+url],capture_output=True).stdout.decode('utf8','ignore'); open(p,'w').write(t)
    return open(p,errors='ignore').read()
def hit(q,t):
    parts=[p for p in re.split(r'\s*(?:…|\.\.\.)\s*',norm(q)) if len(p)>=8]
    return bool(parts) and all(p in t for p in parts)
by={}
for q in ev.get('quotes',[]): by.setdefault(q['cite'].split('@')[0],[]).append(q)
for sid,qs in by.items():
    s_=src.get(sid)
    if not s_: continue
    t=norm(fetch(s_['url']))
    hits=[hit(q['quote'],t) for q in qs]
    if sum(hits) < len(qs):
        t2=t+' '+norm(jina(s_['url'])); hits=[hit(q['quote'],t2) for q in qs]
    if sum(hits)==0:
        res['unverified']+=len(qs); res['unfetchable_sources'].append(f"{sid} {s_['url']} ({len(qs)} quotes)"); continue
    for q,h in zip(qs,hits):
        if h: res['found']+=1
        else: res['missing']+=1; res['missing_quotes'].append(f"[{q['cite']}] {q['quote'][:100]}")
print(json.dumps(res,ensure_ascii=False)); sys.exit(0)
cache={}
for q in ev.get('quotes',[]):
    sid=q['cite'].split('@')[0]; s=src.get(sid)
    if not s: continue
    if sid not in cache:
        t=norm(fetch(s['url'])); cache[sid]=t if len(t)>500 else None
        if cache[sid] is None: res['unfetchable_sources'].append(f"{sid} {s['url']}")
    t=cache[sid]
    if t is None: continue
    parts=[p for p in re.split(r'\s*(?:…|\.\.\.)\s*',norm(q['quote'])) if len(p)>=8]
    if parts and all(p in t for p in parts): res['found']+=1
    else: res['missing']+=1; res['missing_quotes'].append(f"[{q['cite']}] {q['quote'][:100]}")
print(json.dumps(res,ensure_ascii=False))
