#!/usr/bin/env bash
# run-glm.sh <taskfile> <name> <workdir> ; runs claude -p on StepFun default token (CC_STEPFUN_TOKEN), resumes on timeout, up to 6 attempts of 2h
TASK=$1; NAME=$2; WD=${3:-/workspace}
R=/workspace/rollout; C=/workspace/sf-conductor
source ~/code/github/workflow/config/env/secrets.zsh >/dev/null 2>&1
unset ANTHROPIC_AUTH_TOKEN ANTHROPIC_API_KEY CC_STEP_EXPLORE_TOKEN CC_STEP_EXPLORE_STEPFUN_API_KEY CC_GLM_TOKEN CC_GLM_SELF_TOKEN Z_AI_API_KEY ANTHROPIC_BASE_URL ANTHROPIC_MODEL
export API_TIMEOUT_MS=270000 CLAUDE_STREAM_IDLE_TIMEOUT_MS=180000 CLAUDE_CODE_MAX_RETRIES=6 MCP_CONNECTION_NONBLOCKING=false
SID=""
for a in 1 2 3 4 5 6; do
  if [ -z "$SID" ]; then args=(-p "$(cat $TASK)"); else args=(-p "继续完成任务（上次超时被中断）。按原任务说明做完并写报告。" --resume "$SID"); fi
  (cd "$WD" && timeout 7200 claude "${args[@]}" --settings $R/cc-speed.json --mcp-config $R/mcp-lean.json --strict-mcp-config --dangerously-skip-permissions --output-format json --max-turns 600) > $C/logs/$NAME.$a.json 2> $C/logs/$NAME.$a.err
  rc=$?
  s=$(python3 -c "import json,sys;print(json.load(open('$C/logs/$NAME.$a.json')).get('session_id',''))" 2>/dev/null)
  [ -n "$s" ] && SID=$s
  [ -z "$SID" ] && SID=$(ls -t ~/.claude/projects/$(echo "$WD" | sed 's#[/.]#-#g')/*.jsonl 2>/dev/null | head -1 | xargs -r basename | sed 's/.jsonl//')
  echo "$(date '+%F %T') $NAME attempt $a rc=$rc sid=$SID" >> $C/logs/runs.log
  [ $rc -ne 124 ] && break
done
