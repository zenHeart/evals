#!/usr/bin/env bash
# gate.sh : 对 status=pass 且未处理的 id 做 check-one + reverify，结果写 gate.tsv（accept/reject）
R=/workspace/rollout; cd $R; touch gate.tsv
for id in $(awk -F'\t' '$2=="pass"{print $1}' status.tsv); do
  awk -F'\t' -v id="$id" '$1==id && ($2=="accept"||$2=="reject"){found=1} END{exit !found}' gate.tsv && continue
  if [ ! -f out/$id.json ]; then echo "$(date '+%F %T') gate skip $id: missing out/$id.json" >> logs/gate-missing.log; continue; fi
  W=$(mktemp -d); mkdir -p $W/data/benchmarks; ln -s /workspace/evals/scripts $W/scripts; cp out/$id.json $W/data/benchmarks/
  c=$(node check-one.mjs $W/data/benchmarks/$id.json | head -1); rm -rf $W
  v=$(timeout 900 python3 reverify.py out/$id.json 2>/dev/null)
  verdict=$(python3 - "$c" "$v" <<'PY'
import json,sys
c=json.loads(sys.argv[1]); v=json.loads(sys.argv[2] or '{}')
f,m,u=v.get('found',0),v.get('missing',0),v.get('unverified',0)
ok = c.get('errors')==0 and f>=10 and m <= max(3, 0.1*(f+m)) and f >= 0.5*(f+m+u)
print(('accept' if ok else 'reject')+f"\tcheck_err={c.get('errors')} quotes={c.get('quotes_ok')} fresh_found={f} fresh_missing={m} unverified={u} unfetch={len(v.get('unfetchable_sources',[]))}")
PY
)
  printf '%s\t%s\t%s\n' "$id" "$verdict" "$(date '+%F %T')" >> gate.tsv
  echo "$v" > logs/$id.reverify.json
done
cut -f1,2,3 gate.tsv | tail -60
