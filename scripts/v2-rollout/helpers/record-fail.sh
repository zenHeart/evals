#!/usr/bin/env bash
# record-fail.sh <id> <step> <error>
# 把一页的失败记进 /workspace/rollout/publish-failed.tsv：id、失败步骤、具体错误、时间。
# 同一页的同一步骤同一条错误只记一次（避免每轮轮询重复刷屏），新错误或新时间照记。
set -uo pipefail
R=/workspace/rollout
F=$R/publish-failed.tsv
id=$1; step=$2; err=$3
[ -n "${id:-}" ] || exit 0
err=$(printf '%s' "$err" | tr '\t\n' '  ' | cut -c1-300)
now=$(date '+%F %T')
mkdir -p "$R/logs"
if [ -f "$F" ] && grep -qF "$id	$step	$err" "$F" 2>/dev/null; then
  exit 0
fi
printf '%s\t%s\t%s\t%s\n' "$id" "$now" "$step" "$err" >> "$F"
echo "$(date '+%F %T') [publish-failed] $id · $step · $err" >> "$R/logs/incremental-publish.log"
