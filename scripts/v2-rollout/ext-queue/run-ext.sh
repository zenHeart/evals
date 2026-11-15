#!/usr/bin/env bash
# run-ext.sh <provider> <taskfile> <name> [workdir]
# providers: glm-self | minimax-self
# Does not use CC_GLM_TOKEN, Z_AI_API_KEY, CC_STEP_EXPLORE_TOKEN, CC_MINIMAX_TOKEN, or company/home MiniMax keys.
set -u
PROV=$1; TASK=$2; NAME=$3; WD=${4:-/workspace}
Q=/workspace/ext-queue; R=/workspace/rollout
source "$HOME/code/github/workflow/config/env/secrets.zsh" >/dev/null 2>&1 || true
unset ANTHROPIC_AUTH_TOKEN ANTHROPIC_API_KEY ANTHROPIC_BASE_URL ANTHROPIC_MODEL
unset CC_GLM_TOKEN Z_AI_API_KEY CC_STEP_EXPLORE_TOKEN CC_STEP_EXPLORE_STEPFUN_API_KEY
unset CC_MINIMAX_TOKEN MINIMAX_API_KEY MINIMAX_COMPANY_API_KEY MINIMAX_HOME_API_KEY
unset CC_STEPFUN_TOKEN CC_STEPFUN_STEPFUN_API_KEY
export API_TIMEOUT_MS=270000 CLAUDE_STREAM_IDLE_TIMEOUT_MS=180000 CLAUDE_CODE_MAX_RETRIES=6 MCP_CONNECTION_NONBLOCKING=false
case "$PROV" in
  glm-self)
    SETTINGS=/workspace/rollout/cc-speed45-glm.json
    # ensure helper sees CC_GLM_SELF_TOKEN only
    ;;
  minimax-self)
    SETTINGS=$Q/cc-speed-minimax-self.json
    ;;
  *) echo "unknown provider $PROV" >&2; exit 2 ;;
esac
mkdir -p "$Q/logs"
SID=""
for a in 1 2 3; do
  if [ -z "$SID" ]; then args=(-p "$(cat "$TASK")"); else args=(-p "继续完成任务（上次超时被中断）。按原任务说明做完并写状态文件。" --resume "$SID"); fi
  (cd "$WD" && timeout 7200 claude "${args[@]}" --settings "$SETTINGS" --mcp-config "$R/mcp-lean.json" --strict-mcp-config --dangerously-skip-permissions --output-format json --max-turns 400) > "$Q/logs/$NAME.$a.json" 2> "$Q/logs/$NAME.$a.err"
  rc=$?
  s=$(python3 -c "import json,sys;print(json.load(open('$Q/logs/$NAME.$a.json')).get('session_id',''))" 2>/dev/null || true)
  [ -n "$s" ] && SID=$s
  echo "$(date '+%F %T') $PROV $NAME attempt $a rc=$rc sid=$SID" >> "$Q/logs/runs.log"
  [ $rc -ne 124 ] && break
done
exit ${rc:-1}
