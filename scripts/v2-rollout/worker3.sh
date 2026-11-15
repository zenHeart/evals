#!/usr/bin/env bash
# worker3.sh v4 <slot>（2026-11-13 提速版，见 SPEEDUP_NOTES.md）
# - 每页一个 claude 会话、自己直接干活（禁用 Task/Agent 子代理），超时续跑同一会话不丢进度
# - 单次 ≤ ATTEMPT_TIMEOUT(7200s)，每页最多 2 次，仍不过 → status=fail + backlog.tsv
# - API 卡顿快速重试：cc-speed*.json（API_TIMEOUT_MS=270000, 流空闲 180s）
# - 模式 v45（MODE45 全局开关或 trial.x<slot> 试点）：预抓来源 + srcfetch/addquote 助手 + 交付前 selfgate（=验收）
set -u
SLOT=$1; R=/workspace/rollout; BASE=${BASE:-v2-spec}; WT=$R/wt/x$SLOT; MAXA=${MAX_ATTEMPTS:-2}; AT=${ATTEMPT_TIMEOUT:-7200}
source ~/code/github/workflow/config/env/secrets.zsh >/dev/null 2>&1
unset ANTHROPIC_AUTH_TOKEN ANTHROPIC_API_KEY CC_STEP_EXPLORE_TOKEN CC_STEP_EXPLORE_STEPFUN_API_KEY CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS
export EVIDENCE_DIR=$R/evidence MCP_CONNECTION_NONBLOCKING=false CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1
export API_TIMEOUT_MS=270000 CLAUDE_STREAM_IDLE_TIMEOUT_MS=180000 CLAUDE_CODE_MAX_RETRIES=6
[ -d "$WT" ] || git -C /workspace/evals worktree add -q --detach "$WT" "$BASE"
PROJ=~/.claude/projects/$(echo "$WT" | sed 's#[/.]#-#g')
log(){ echo "$(date '+%F %T') x$SLOT $*" >> $R/logs/workers.log; }
pop(){ ( flock 9; if [ -s $R/trial.x$SLOT ]; then head -1 $R/trial.x$SLOT; echo TRIAL > $R/trial.x$SLOT.taken; rm -f $R/trial.x$SLOT; else head -1 $R/queue2.txt; sed -i 1d $R/queue2.txt; fi ) 9>$R/queue.lock; }
while true; do
  [ -f $R/STOP ] || [ -f $R/retire.x$SLOT ] && { log "retire"; rm -f $R/retire.x$SLOT; exit 0; }
  [ -f $R/QUOTA ] && { log "quota flag, exit"; exit 0; }
  id=$(pop | head -1 | tr -d ' \n'); [ -z "$id" ] && { log "queue empty"; exit 0; }
  mode=v13; [ -f $R/MODE45 ] && mode=v45; [ -f $R/trial.x$SLOT.taken ] && { mode=v45; rm -f $R/trial.x$SLOT.taken; echo "$id" >> $R/trial.ids; }
  echo "$SLOT $id $mode $(date +%s)" > $R/pagestate/x$SLOT.cur
  git -C "$WT" reset -q --hard "$BASE" && git -C "$WT" clean -qfd
  mkdir -p $R/evidence/$id
  # 恢复：上次被中断时保存的半成品实体 / 会话
  attempt=0; sid=""; note=""
  [ -f $R/pagestate/$id.attempts ] && attempt=$(cat $R/pagestate/$id.attempts)
  if [ -f $R/partial/$id.json ]; then cp $R/partial/$id.json "$WT/data/benchmarks/$id.json"; note="
注意：这个页面上次做到一半被中断，工作区里的 data/benchmarks/$id.json 已是上次的半成品，$R/evidence/$id/ 与 $id.evidence.json 里已有证据。先读它们，在此基础上补完，不要从头重做搜索。"; fi
  if [ -f $R/pagestate/$id.sid ]; then osid=$(cat $R/pagestate/$id.sid); of=$(ls ~/.claude/projects/*/$osid.jsonl 2>/dev/null | head -1)
    if [ -n "$of" ]; then mkdir -p "$PROJ"; [ -f "$PROJ/$osid.jsonl" ] || cp "$of" "$PROJ/"; sid=$osid; fi; fi
  t0=$(date +%s); turns=0
  if [ $mode = v45 ]; then
    ST=$R/cc-speed45.json
    pf=$(cd "$WT" && timeout 600 python3 $R/helpers/prefetch.py "$id" "data/benchmarks/$id.json" 2>/dev/null)
    EXTRA="
## 提速规则（必须遵守）
1. 已在你启动前按验收方式预抓的来源（证据原文已在 $R/evidence/$id/<source-id>.txt，可直接用这些 source id；没用到的可以不进 profile.sources）：
${pf:-（无）}
2. 需要新来源时一律用：python3 $R/helpers/srcfetch.py $id <source-id> <url> [<source-id2> <url2> ...]（一次可抓多个）。它与最终验收用同一种 curl/pdftotext 方式抓取并原样保存证据原文，同时生成阅读版 $R/view/$id/<source-id>.txt。阅读请用阅读版（Read 带 offset/limit，或 grep -n -E 'kw1|kw2|kw3' 一次查多个关键词）。不要手写、改写或拼接 evidence/$id/*.txt；web-reader / web_fetch 只用来找线索和链接，它们的 markdown 输出不能当证据原文。
3. 逐字摘录只用：python3 $R/helpers/addquote.py $id <<'Q'
[{\"cite\":\"<source-id>@<定位>\",\"quote\":\"<原文连续句子>\"}, ...]
Q
   一次批量提交全部摘录；它逐条核验、通过的自动写入 $id.evidence.json，失败的给出原文附近片段。不要手工编辑 evidence.json。摘录必须是阅读版里原样连续的一句或半句话：不带 markdown 符号（| ** __ # [文字](链接)）、不拼接表格行、不改大小写以外的任何字符。
4. 少轮次：搜索时一次并行发多个查询；先把资料收集齐，再用一次 Write 写出完整实体，再一次批量 addquote，再校验修复。不要逐行 sed/grep 翻文件、不要反复整读同一个大文件。
5. 交付前必须依次运行并都通过：
   node $R/check-one.mjs data/benchmarks/$id.json
   bash $R/helpers/selfgate.sh data/benchmarks/$id.json   （与最终验收完全相同：会重新抓原网页核对摘录）
   selfgate 输出 SELFGATE reject 时：把“重抓原网页找不到”的摘录换成阅读版里的原样句子或删掉对应事实（改「未披露」），把“无法重抓核验”的来源换成能抓到的一手 URL（用 srcfetch.py），直到 SELFGATE accept（至少 15 条摘录能被重抓核验）。
6. 上下文变长（约 12 万 token）时会自动压缩；压缩前把已确认的事实、来源 id、待办写进 /tmp/notes-$id.md，压缩后先读它。"
  else ST=$R/cc-speed.json; EXTRA=""; fi
  PROMPT="今天是 $(date +%F)。任务：把 data/benchmarks/$id.json 升级为 benchmark-profile/v2 深度档案（证据目录 EVIDENCE_DIR=$R/evidence）。
你自己直接完成全部工作，不要使用 Task/Agent 子代理。先读 .claude/skills/benchmark-profile-v2/SKILL.md 与 data/benchmarks/hlehle.json，按其中流程深度搜索（mcp__web-search__web_search / mcp__web-search-prime__web_search_prime / mcp__web-reader__webReader / curl+pdftotext），只改 data/benchmarks/$id.json 这一个实体文件，并运行 node $R/check-one.mjs data/benchmarks/$id.json 修到通过，或按铁律 5 写 skip 文件。不得改其他文件、不得 git commit。最后一行汇报结果。$note$EXTRA"
  res=""; reason=""
  while [ $attempt -lt $MAXA ]; do
    attempt=$((attempt+1)); echo $attempt > $R/pagestate/$id.attempts
    if [ -z "$sid" ]; then sid=$(python3 -c "import uuid;print(uuid.uuid4())"); echo $sid > $R/pagestate/$id.sid; args=(-p "$PROMPT" --session-id "$sid"); else args=(-p --resume "$sid" "${FIX:-上一轮被中断。请继续完成未做完的部分：先看工作区 data/benchmarks/$id.json 与 EVIDENCE_DIR 已有证据，补完并运行 node $R/check-one.mjs data/benchmarks/$id.json 直到通过（或按铁律 5 写 skip）；不要从头重做搜索。}"); fi
    FIX=""
    a0=$(date +%s)
    (cd "$WT" && timeout $AT claude "${args[@]}" --settings $ST --mcp-config $R/mcp-lean.json --strict-mcp-config --disallowedTools Task Agent --dangerously-skip-permissions --output-format json --max-turns 300) > $R/logs/$id.$attempt.json 2> $R/logs/$id.$attempt.err
    rc=$?
    n=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1])).get('num_turns',0))" $R/logs/$id.$attempt.json 2>/dev/null || echo 0); turns=$((turns+${n:-0}))
    # 被中断时把半成品留存，便于重启后续跑
    cp "$WT/data/benchmarks/$id.json" $R/partial/$id.json 2>/dev/null
    if [ $rc -eq 124 ]; then log "$id timeout attempt=$attempt (${AT}s); next attempt resumes same session"; reason="timeout"; continue; fi
    if grep -qiE '429|rate.?limit|overloaded' $R/logs/$id.$attempt.err 2>/dev/null || grep -qiE '"is_error":true' $R/logs/$id.$attempt.json 2>/dev/null; then
      if grep -qiE 'quota|insufficient|balance|余额|额度' $R/logs/$id.$attempt.err $R/logs/$id.$attempt.json 2>/dev/null; then log "$id QUOTA?"; touch $R/QUOTA; fi
      echo "$(date +%s)" >> $R/logs/429.ts
      # 很快就失败的 API 错误不占尝试次数（最多补 2 次）
      if [ $(( $(date +%s) - a0 )) -lt 600 ] && [ ${apierr:-0} -lt 2 ]; then apierr=$(( ${apierr:-0}+1 )); attempt=$((attempt-1)); log "$id api-error rc=$rc; backoff, not counted"; sleep $((120*apierr)); continue; fi
      log "$id api-error rc=$rc attempt=$attempt"; reason="api-error"
    fi
    if [ -f $R/evidence/$id.skip.json ]; then res=skip; break; fi
    o=$(cd "$WT" && node $R/check-one.mjs data/benchmarks/$id.json 2>&1)
    if [ $? -ne 0 ]; then reason="check-one"; FIX="质检未通过，请逐条修复后再次运行 node $R/check-one.mjs data/benchmarks/$id.json 直到通过；找不到原文支撑的内容改成「未披露」或删除，绝不编造摘录：
$o"; continue; fi
    if [ $mode = v45 ]; then
      g=$(cd "$WT" && bash $R/helpers/selfgate.sh data/benchmarks/$id.json 2>&1)
      if ! echo "$g" | head -1 | grep -q "SELFGATE accept"; then
        if [ $attempt -lt $MAXA ]; then reason="selfgate"; FIX="交付前验收自检（与最终验收相同）未通过，请修复到 SELFGATE accept 且 check-one 仍通过：
$g"; continue; fi
        log "$id selfgate reject on last attempt; recording pass, real gate decides"
      fi
    fi
    res=pass; break
  done
  apierr=0
  [ -z "$res" ] && { [ -f $R/evidence/$id.skip.json ] && res=skip || res=fail; }
  dt=$(( $(date +%s) - t0 ))
  [ $res = fail ] && { (cd "$WT" && node $R/check-one.mjs data/benchmarks/$id.json > $R/logs/$id.check.txt 2>&1); printf '%s\t%s\t%s\t%s\t%s\n' "$id" "$reason" "$attempt" "$dt" "$(date '+%F %T')" >> $R/backlog.tsv; }
  mkdir -p $R/out
  cp "$WT/data/benchmarks/$id.json" $R/out/$id.json
  printf '%s\t%s\t%s\t%s\t%s\n' "$id" "$res" "$attempt" "$dt" "$(date '+%F %T')" >> $R/status.tsv
  printf '%s\tx%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$id" "$SLOT" "$mode" "$res" "$attempt" "$dt" "$turns" "$(date '+%F %T')" >> $R/logs/pagemetrics.tsv
  rm -f $R/partial/$id.json $R/pagestate/$id.sid $R/pagestate/$id.attempts $R/pagestate/x$SLOT.cur
  log "$id $res attempts=$attempt ${dt}s turns=$turns mode=$mode"
done
