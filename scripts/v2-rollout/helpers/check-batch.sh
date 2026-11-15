#!/usr/bin/env bash
# check-batch.sh <id...>：按 publish-candidates.py 的同一方式对 out/<id>.json 跑 check-one。
# （check-one.mjs 需要一个把 scripts/ 指到 /workspace/evals/scripts 的临时工作目录。）
set -uo pipefail
R=/workspace/rollout
SCRIPTS_SRC=${SCRIPTS_SRC:-/workspace/evals/scripts}
[ $# -ge 1 ] || { echo "usage: check-batch.sh <id...>" >&2; exit 2; }
fail=0
for id in "$@"; do
  f=$R/out/$id.json
  if [ ! -f "$f" ]; then echo "$id	NO_OUT"; fail=1; continue; fi
  w=$(mktemp -d)
  mkdir -p "$w/data/benchmarks"
  ln -s "$SCRIPTS_SRC" "$w/scripts"
  cp "$f" "$w/data/benchmarks/$id.json"
  out=$(cd "$w" && node "$R/check-one.mjs" "data/benchmarks/$id.json" 2>&1)
  rc=$?
  rm -rf "$w"
  if [ $rc -eq 0 ]; then
    echo "$id	OK	$(echo "$out" | tail -1 | cut -c1-200)"
  else
    echo "$id	FAIL	$(echo "$out" | tail -1 | cut -c1-200)"
    fail=1
  fi
done
exit $fail
