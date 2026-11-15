#!/usr/bin/env bash
# worker.sh <slot> : 循环从 queue 取 id，在独立 worktree 里跑 claude -p，产出 out/<id>.json
set -u
SLOT=$1; R=/workspace/rollout; BASE=${BASE:-v2-spec}; WT=$R/wt/w$SLOT
source ~/code/github/workflow/config/env/secrets.zsh >/dev/null 2>&1
unset ANTHROPIC_AUTH_TOKEN ANTHROPIC_API_KEY
export EVIDENCE_DIR=$R/evidence MCP_CONNECTION_NONBLOCKING=false
[ -d "$WT" ] || git -C /workspace/evals worktree add -q --detach "$WT" "$BASE"
log(){ echo "$(date '+%F %T') w$SLOT $*" >> $R/logs/workers.log; }
pop(){ ( flock 9; id=$(head -1 $R/queue.txt); [ -n "$id" ] && sed -i 1d $R/queue.txt; echo "$id" ) 9>$R/queue.lock; }
while true; do
  [ -f $R/STOP ] && { log stop; exit 0; }
  id=$(pop); [ -z "$id" ] && { log "queue empty"; exit 0; }
  git -C "$WT" checkout -q --detach "$BASE" && git -C "$WT" reset -q --hard "$BASE" && git -C "$WT" clean -qfd
  f=$WT/data/benchmarks/$id.json; [ -f "$f" ] || { log "$id missing"; continue; }
  mkdir -p $R/evidence/$id; t0=$(date +%s); attempt=0; sid=""
  PROMPT="按 .claude/skills/benchmark-profile-v2/SKILL.md 把 data/benchmarks/$id.json 升级为 benchmark-profile/v2 深度档案。今天是 $(date +%F)。证据目录 EVIDENCE_DIR=$R/evidence。先完整阅读 SKILL.md 与 data/benchmarks/hlehle.json，再做深度搜索。只改这一个文件，不要 git commit。完成前必须运行 node $R/check-one.mjs data/benchmarks/$id.json 并修到通过（或按铁律 5 输出 skip 文件）。"
  while :; do
    attempt=$((attempt+1))
    if [ -z "$sid" ]; then args=(-p "$PROMPT"); else args=(-p --resume "$sid" "$FIX"); fi
    (cd "$WT" && timeout 3600 claude "${args[@]}" --dangerously-skip-permissions --output-format json --max-turns 150) > $R/logs/$id.$attempt.json 2> $R/logs/$id.$attempt.err
    rc=$?
    nsid=$(python3 -c "import json,sys;print(json.load(open('$R/logs/$id.$attempt.json')).get('session_id',''))" 2>/dev/null); [ -n "$nsid" ] && sid=$nsid
    if grep -qiE '429|rate.?limit|overloaded|quota' $R/logs/$id.$attempt.err $R/logs/$id.$attempt.json 2>/dev/null && ! grep -q '"is_error":false' $R/logs/$id.$attempt.json; then
      if grep -qiE 'quota|insufficient|balance|余额|额度' $R/logs/$id.$attempt.err $R/logs/$id.$attempt.json; then log "$id QUOTA?"; touch $R/QUOTA; fi
      log "$id rate-limited rc=$rc attempt=$attempt; backoff"; sleep $((60*attempt)); [ $attempt -lt 6 ] && continue
    fi
    if [ -f $R/evidence/$id.skip.json ]; then res=skip; break; fi
    out=$(cd "$WT" && node $R/check-one.mjs data/benchmarks/$id.json 2>&1); crc=$?
    if [ $crc -eq 0 ]; then res=pass; break; fi
    [ $attempt -ge 3 ] && { res=fail; echo "$out" > $R/logs/$id.check.txt; break; }
    FIX="质检未通过，请逐条修复后再次运行 node $R/check-one.mjs data/benchmarks/$id.json 直到通过（找不到原文支撑的内容改成「未披露」或删除，不要编造摘录）：
$out"
  done
  cp "$f" $R/out/$id.json
  dt=$(( $(date +%s) - t0 ))
  printf '%s\t%s\t%s\t%s\t%s\n' "$id" "$res" "$attempt" "$dt" "$(date '+%F %T')" >> $R/status.tsv
  log "$id $res attempts=$attempt ${dt}s"
done
