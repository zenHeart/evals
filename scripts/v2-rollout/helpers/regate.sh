#!/usr/bin/env bash
# regate.sh <id>：对单个页面重跑 check-one + reverify（fresh/ 缓存未命中时会真的重抓原网页）。
# 用途：out 文件是在 gate 判定之后才出现的页面（典型：recover-out.py 从会话里恢复的历史 accept），
#       不能凭 gate.tsv 的旧 accept 放行。判定标准与 gate.sh 完全一致。
# 输出：accept/reject + 明细（tab 分隔）。
set -u
R=/workspace/rollout; id=$1; cd $R
REVERIFY_TIMEOUT=${REVERIFY_TIMEOUT:-900}
[ -f "out/$id.json" ] || { printf 'reject\tmissing out/%s.json\n' "$id"; exit 1; }
W=$(mktemp -d); mkdir -p "$W/data/benchmarks"; ln -s /workspace/evals/scripts "$W/scripts"
cp "out/$id.json" "$W/data/benchmarks/"
c=$(node check-one.mjs "$W/data/benchmarks/$id.json" | head -1); rm -rf "$W"
v=$(timeout "$REVERIFY_TIMEOUT" python3 reverify.py "out/$id.json" 2>/dev/null)
python3 - "$c" "$v" <<'PY'
import json,sys
c=json.loads(sys.argv[1]); v=json.loads(sys.argv[2] or '{}')
f,m,u=v.get('found',0),v.get('missing',0),v.get('unverified',0)
ok = c.get('errors')==0 and f>=10 and m <= max(3, 0.1*(f+m)) and f >= 0.5*(f+m+u)
print(('accept' if ok else 'reject')+f"\tcheck_err={c.get('errors')} quotes={c.get('quotes_ok')} fresh_found={f} fresh_missing={m} unverified={u} unfetch={len(v.get('unfetchable_sources',[]))}")
PY
