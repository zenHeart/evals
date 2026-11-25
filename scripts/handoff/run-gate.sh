#!/usr/bin/env bash
# t83 内容门禁全量执行记录（干净树、当前 HEAD）
# 用法：bash scripts/handoff/run-gate.sh <日志输出目录>
# 输出：<日志输出目录>/gate-summary.log + 每步一个 <name>.log
# 注意：`npm run build` 会改写 evals.epub 与 auto-benchmark-ids.json，
#       跑完需 `git checkout -- evals.epub data/generated/auto-benchmark-ids.json` 还原。
set -u
export PATH="/usr/local/bin:$PATH"
OUT="${1:?用法: run-gate.sh <日志输出目录>}"
mkdir -p "$OUT"
cd "$(git rev-parse --show-toplevel)" || exit 1

STAMP="$(date -u '+%F %T')"
{
  echo "# t83 内容门禁全量执行记录"
  echo "# 时间(UTC): $STAMP   本地: $(date '+%F %T %Z')"
  echo "# worktree: $(pwd)  branch: $(git rev-parse --abbrev-ref HEAD)  HEAD: $(git rev-parse --short HEAD) ($(git rev-parse HEAD))"
  echo "# node: $(node -v)  npm: $(npm -v)"
  echo "# 领先 origin/main: $(git rev-list --count origin/main..HEAD) 个提交"
} > "$OUT/gate-summary.log"

# run <步骤名> <日志里显示的命令> <实际命令...>
run() {
  local name="$1" disp="$2"; shift 2
  echo "" >> "$OUT/gate-summary.log"
  echo "=======================================================" >> "$OUT/gate-summary.log"
  echo "\$ $disp" >> "$OUT/gate-summary.log"
  echo "-------------------------------------------------------" >> "$OUT/gate-summary.log"
  "$@" > "$OUT/$name.log" 2>&1
  local rc=$?
  echo "[exit=$rc]" >> "$OUT/gate-summary.log"
  echo "[$name] exit=$rc"
  return 0
}

run gate-1-reconcile-coverage   'node scripts/reconcile-coverage.mjs'                    node scripts/reconcile-coverage.mjs
run gate-2-tests-full           'node --test tests/*.test.mjs'                           bash -c 'node --test tests/*.test.mjs'
run gate-2b-release-ingest      'node --test tests/release-ingest.test.mjs'              node --test tests/release-ingest.test.mjs
run gate-3-validate-data        'node scripts/validate-data.mjs'                         node scripts/validate-data.mjs
run gate-3b-model-coverage      'node scripts/validate-model-coverage.mjs'               node scripts/validate-model-coverage.mjs
run gate-4-build                'npm run build'                                          npm run build
run gate-5-sync-skills          'npm run sync:skills:check'                              npm run sync:skills:check
run gate-6-cite-coverage        'node scripts/verify-cite-coverage.mjs'                  node scripts/verify-cite-coverage.mjs

# 汇总（先算完再追加，避免 grep 读自己正在写的文件）
N_OK="$(grep -c '\[exit=0\]' "$OUT/gate-summary.log")"
EXITS="$(grep '\[exit=' "$OUT/gate-summary.log")"
{
  echo ""
  echo "# 汇总"
  echo "exit=0 步数: $N_OK / 8"
  echo "$EXITS"
} >> "$OUT/gate-summary.log"
echo "$EXITS"
