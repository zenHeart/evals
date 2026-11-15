#!/usr/bin/env bash
# integrate.sh <branch> <id...> : 从 origin/main 建分支，套入 out/<id>.json，移出 backlog，跑全部门禁
set -eu
BR=$1; shift; R=/workspace/rollout; cd /workspace/evals
git fetch -q origin
git reset -q --hard; git checkout -q -B "$BR" origin/main
git -c user.name=zenHeart -c user.email=zenheart@users.noreply.github.com cherry-pick origin/main..v2-spec >/dev/null
for id in "$@"; do cp $R/out/$id.json data/benchmarks/$id.json; done
python3 - "$@" <<'PY'
import json,sys
p='data/benchmark-profile-backlog.json'; b=json.load(open(p))
b['ids']=[i for i in b['ids'] if i not in set(sys.argv[1:])]; b['count']=len(b['ids'])
json.dump(b,open(p,'w'),ensure_ascii=False,indent=2); open(p,'a').write('\n')
PY
node scripts/reconcile-coverage.mjs >/dev/null
node --test tests/*.test.mjs > $R/logs/test-$BR.log 2>&1 || { tail -30 $R/logs/test-$BR.log; exit 1; }; grep -E '^ℹ (pass|fail)' $R/logs/test-$BR.log
node scripts/validate-data.mjs > $R/logs/vd-$BR.log 2>&1 || { tail -30 $R/logs/vd-$BR.log; exit 1; }; tail -2 $R/logs/vd-$BR.log
npm run -s sync:skills:check
npm run -s build > $R/logs/build-$BR.log 2>&1 && echo build-ok || { tail -20 $R/logs/build-$BR.log; exit 1; }
node scripts/validate-site.mjs > $R/logs/vs-$BR.log 2>&1 || { tail -30 $R/logs/vs-$BR.log; exit 1; }; tail -2 $R/logs/vs-$BR.log
git checkout -q -- evals.epub 2>/dev/null || true
git status --short | head
