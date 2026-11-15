#!/usr/bin/env bash
# worker2.sh <slot> : 精简 MCP（仅 http 搜索），每次取 K 个 id，由一个 claude -p 用并行子代理同时处理
set -u
SLOT=$1; K=${K:-3}; R=/workspace/rollout; BASE=${BASE:-v2-spec}; WT=$R/wt/x$SLOT
source ~/code/github/workflow/config/env/secrets.zsh >/dev/null 2>&1
unset ANTHROPIC_AUTH_TOKEN ANTHROPIC_API_KEY
export EVIDENCE_DIR=$R/evidence MCP_CONNECTION_NONBLOCKING=false CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
[ -d "$WT" ] || git -C /workspace/evals worktree add -q --detach "$WT" "$BASE"
log(){ echo "$(date '+%F %T') x$SLOT $*" >> $R/logs/workers.log; }
pop(){ ( flock 9; head -$K $R/queue2.txt; sed -i 1,${K}d $R/queue2.txt ) 9>$R/queue.lock; }
while true; do
  [ -f $R/STOP ] || [ -f $R/retire.x$SLOT ] && { log "retire"; rm -f $R/retire.x$SLOT; exit 0; }
  [ -f $R/QUOTA ] && { log "quota flag, exit"; exit 0; }
  ids=$(pop | tr '\n' ' '); [ -z "${ids// }" ] && { log "queue empty"; exit 0; }
  git -C "$WT" reset -q --hard "$BASE" && git -C "$WT" clean -qfd
  for id in $ids; do mkdir -p $R/evidence/$id; done
  tag=$(echo $ids | tr ' ' '+'); t0=$(date +%s); attempt=0; sid=""
  list=$(for id in $ids; do echo "- data/benchmarks/$id.json"; done)
  PROMPT="今天是 $(date +%F)。任务：把下列 benchmark 各自升级为 benchmark-profile/v2 深度档案（证据目录 EVIDENCE_DIR=$R/evidence）：
$list
做法：先读 .claude/skills/benchmark-profile-v2/SKILL.md。然后用 Task 工具**在同一条消息里并行**启动 $(echo $ids | wc -w) 个子代理，每个子代理只负责一个 benchmark：完整阅读 SKILL.md 与 data/benchmarks/hlehle.json，按其中流程深度搜索（mcp__web-search__web_search / mcp__web-search-prime__web_search_prime / mcp__web-reader__webReader / curl+pdftotext），只改自己那一个实体文件，并运行 node $R/check-one.mjs data/benchmarks/<id>.json 修到通过，或按铁律 5 写 skip 文件。子代理不得改其他文件、不得 git commit。全部子代理结束后，你逐个运行 check-one 复核，未通过的继续修复（可再派子代理）。最后每个 id 一行汇报结果。"
  while :; do
    attempt=$((attempt+1))
    if [ -z "$sid" ]; then args=(-p "$PROMPT"); else args=(-p --resume "$sid" "$FIX"); fi
    (cd "$WT" && timeout 5400 claude "${args[@]}" --mcp-config $R/mcp-lean.json --strict-mcp-config --dangerously-skip-permissions --output-format json --max-turns 300) > $R/logs/$tag.$attempt.json 2> $R/logs/$tag.$attempt.err
    rc=$?
    nsid=$(python3 -c "import json;print(json.load(open('$R/logs/$tag.$attempt.json')).get('session_id',''))" 2>/dev/null); [ -n "$nsid" ] && sid=$nsid
    if grep -qiE '429|rate.?limit|overloaded' $R/logs/$tag.$attempt.err 2>/dev/null || grep -qiE '"is_error":true' $R/logs/$tag.$attempt.json 2>/dev/null; then
      if grep -qiE 'quota|insufficient|balance|余额|额度' $R/logs/$tag.$attempt.err $R/logs/$tag.$attempt.json 2>/dev/null; then log "$tag QUOTA?"; touch $R/QUOTA; fi
      log "$tag api-error rc=$rc attempt=$attempt; backoff"; echo "$(date +%s)" >> $R/logs/429.ts; sleep $((90*attempt)); [ $attempt -lt 5 ] && continue
    fi
    fails=""; out=""
    for id in $ids; do
      [ -f $R/evidence/$id.skip.json ] && continue
      o=$(cd "$WT" && node $R/check-one.mjs data/benchmarks/$id.json 2>&1) || { fails="$fails $id"; out="$out
### $id
$o"; }
    done
    [ -z "$fails" ] && break
    [ $attempt -ge 4 ] && break
    FIX="以下 benchmark 质检未通过，请（可并行派子代理）逐条修复后再次运行 node $R/check-one.mjs data/benchmarks/<id>.json 直到通过；找不到原文支撑的内容改成「未披露」或删除，绝不编造摘录：$out"
  done
  dt=$(( $(date +%s) - t0 ))
  for id in $ids; do
    if [ -f $R/evidence/$id.skip.json ]; then res=skip
    elif [[ " $fails " == *" $id "* ]]; then res=fail; (cd "$WT" && node $R/check-one.mjs data/benchmarks/$id.json > $R/logs/$id.check.txt 2>&1)
    else res=pass; fi
    cp "$WT/data/benchmarks/$id.json" $R/out/$id.json
    printf '%s\t%s\t%s\t%s\t%s\n' "$id" "$res" "$attempt" "$dt" "$(date '+%F %T')" >> $R/status.tsv
    log "$id $res attempts=$attempt ${dt}s (batch $tag)"
  done
done
