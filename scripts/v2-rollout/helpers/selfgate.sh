#!/usr/bin/env bash
# 用法: selfgate.sh <worktree>/data/benchmarks/<id>.json
# 与 gate.sh 完全相同的验收：check-one + reverify.py（重新抓原网页）+ 同一阈值。输出 accept/reject 和需要修的摘录。
R=/workspace/rollout; f=$(realpath "$1"); id=$(basename "$f" .json)
c=$(cd "$(dirname "$f")/../.." && node $R/check-one.mjs "$f"); c1=$(echo "$c" | head -1)
v=$(timeout 900 python3 $R/reverify.py "$f" 2>/dev/null)
python3 - "$c1" "$v" <<'PY'
import json,sys
try: c=json.loads(sys.argv[1])
except Exception: c={'errors':'?'}
v=json.loads(sys.argv[2] or '{}')
f,m,u=v.get('found',0),v.get('missing',0),v.get('unverified',0)
ok = c.get('errors')==0 and f>=10 and m <= max(3, 0.1*(f+m)) and f >= 0.5*(f+m+u)
print(('SELFGATE accept' if ok else 'SELFGATE reject')+f"  check_err={c.get('errors')} fresh_found={f} fresh_missing={m} unverified={u}（验收要求: check_err=0, found≥10, missing≤max(3,10%), found≥50%）")
for x in v.get('unfetchable_sources',[]): print('  无法重抓核验的来源(其摘录全部算 unverified):',x)
for x in v.get('missing_quotes',[])[:40]: print('  重抓原网页找不到:',x)
PY
echo "$c" | tail -n +2 | head -40
