#!/usr/bin/env bash
# publisher.sh — 常驻逐页增量发布器（2026-11-14 改为「每页一次发布」）
#
# 轮询 gate.tsv + out/，把「accept + 合格 v2 out + check-one 通过 + 线上还不是 v2 + 未推送过」的
# 页面一页一页地发布：每通过一页就立刻提交、推送、等 GitHub Actions 部署完成、curl 核验线上，
# 再处理下一页。不再攒批（不再 40 页一批、不再 120 秒合并等待）。
#
# 串行：发布动作委托给 publish-batch.sh，由它持 /workspace/rollout/publish.lock；
#       publish-batch.sh 会等到本次 Actions（build + Deploy to GitHub Pages）成功才返回，
#       所以「下一页只在上���页部署成功后才开始」是天然的。
#
# 失败隔离：一页门禁不通过 → 记 publish-failed.tsv（页 id / 失败步骤 / 具体错误 / 时间），
#       换下一页继续，不整批重试、不让好页面被拖住。单页最多自动重试 MAX_ATTEMPTS 次，
#       仍不通过就隔离记因（publish-blocked.tsv），并在 out 文件更新后自动解禁重来。
#
# 状态文件：
#   /workspace/rollout/publisher.pid            本进程 PID（防重复启动）
#   /workspace/rollout/publisher.state          running | drained
#   /workspace/rollout/published.tsv            已上线记账（id、commit、时间、URL、Actions、核验）
#   /workspace/rollout/publish-failed.tsv       失败隔离台账（id、时间、失败步骤、具体错误）
#   /workspace/rollout/publish-retry.tsv        每页重试次数（id、次数、时间、out 指纹）
#   /workspace/rollout/publish-blocked.tsv      已隔离的页（id、原因、时间）
#   /workspace/rollout/regated.tsv              重新验收的结果台账
#   /workspace/rollout/logs/incremental-publish.log   详细日志
set -uo pipefail

R=/workspace/rollout
PIDFILE=$R/publisher.pid
STATE=$R/publisher.state
LOG=$R/logs/incremental-publish.log
POLL=${POLL:-45}                       # 无待发布时的轮询间隔（秒）
STALE_PER_CYCLE=${STALE_PER_CYCLE:-3}   # 每轮最多重新验收几个恢复出来的历史 accept
MAX_BATCH=${MAX_BATCH:-1}              # 单次提交/推送的页数：默认 1（一页一次上线）
MAX_ATTEMPTS=${MAX_ATTEMPTS:-3}        # 单页自动重试上限
MAX_PAGES_PER_CYCLE=${MAX_PAGES_PER_CYCLE:-200}  # 单轮最多发布多少页（之后重列候选、休整一轮）
RETRY_COOLDOWN=${RETRY_COOLDOWN:-240}  # 门禁失败后的退避（秒）
PUSH_RETRY_COOLDOWN=${PUSH_RETRY_COOLDOWN:-600}  # push/Actions 失败后的退避（秒）
GATE_MIN_INTERVAL=${GATE_MIN_INTERVAL:-600}      # 主动跑 gate.sh 的最小间隔（秒）
RECONCILE_EVERY=${RECONCILE_EVERY:-600}          # 台账对账的最小间隔（秒）

ts(){ date '+%F %T'; }
log(){ echo "$(ts) [publisher] $*" >> "$LOG"; echo "$(ts) [publisher] $*"; }
mkdir -p "$R/logs"
cd "$R" || exit 1

# ---------- 防重复启动 ----------
if [ -f "$PIDFILE" ]; then
  old=$(cat "$PIDFILE" 2>/dev/null)
  if [ -n "$old" ] && kill -0 "$old" 2>/dev/null; then
    echo "$(ts) [publisher] 已有实例 PID=$old 在跑，退出" >> "$LOG"
    exit 0
  fi
fi
echo $$ > "$PIDFILE"
trap 'rm -f "$PIDFILE"; log "退出，清理 pidfile"' EXIT
echo running > "$STATE"
log "启动 PID=$$ POLL=${POLL}s MAX_BATCH=${MAX_BATCH} MAX_ATTEMPTS=${MAX_ATTEMPTS} STALE_PER_CYCLE=${STALE_PER_CYCLE}"
if [ "$MAX_BATCH" != "1" ]; then
  log "WARN: 本发布器固定「一页一提交一部署」，MAX_BATCH=$MAX_BATCH 不生效"
fi

# ---------- 已隔离的页（门禁反复不过，先隔离；out 更新后自动解禁） ----------
declare -A BLOCKED=()
declare -A BLOCKED_SIG=()
load_blocked(){
  [ -f "$R/publish-blocked.tsv" ] || return 0
  while IFS=$'\t' read -r id why when sig; do
    [ -z "${id:-}" ] && continue
    BLOCKED["$id"]="$why"
    BLOCKED_SIG["$id"]="${sig:-}"
  done < "$R/publish-blocked.tsv"
}
note_blocked(){
  local id=$1 why=$2 sig=${3:-}
  why=$(printf '%s' "$why" | tr '\t' ' ')
  BLOCKED["$id"]="$why"
  BLOCKED_SIG["$id"]="$sig"
  printf '%s\t%s\t%s\t%s\n' "$id" "$why" "$(ts)" "$sig" >> "$R/publish-blocked.tsv"
  echo "$(ts) [publish] $id 隔离（$why），保留线上现版，待 out 更新后自动解禁" >> "$R/progress.md"
  log "$id 隔离（$why），保留线上现版"
}
load_blocked

# ---------- 每页重试次数 ----------
declare -A RETRY=()
declare -A RETRY_WHEN=()
load_retry(){
  [ -f "$R/publish-retry.tsv" ] || return 0
  while IFS=$'\t' read -r id cnt when sig; do
    [ -z "${id:-}" ] && continue
    RETRY["$id"]="$cnt"
    RETRY_WHEN["$id"]="${sig:-}"
  done < "$R/publish-retry.tsv"
}
save_retry(){
  # 循环变量不要用 id：save_retry 在 publish_page 的调用栈里执行，
  # 用 id 会覆盖 publish_page 的 local id，使「下一次重试」去发另一页（已发过的页 → rc=1）。
  local tmp=$R/publish-retry.tmp
  local k
  : > "$tmp"
  for k in "${!RETRY[@]}"; do
    printf '%s\t%s\t%s\t%s\n' "$k" "${RETRY[$k]}" "$(ts)" "${RETRY_WHEN[$k]:-}" >> "$tmp"
  done
  mv -f "$tmp" "$R/publish-retry.tsv"
}
load_retry

out_sig(){ # out 文件指纹：变了说明 worker 又改写了这一页
  local id=$1
  [ -f "$R/out/$id.json" ] || echo "none"
  stat -c '%Y:%s' "$R/out/$id.json" 2>/dev/null || echo "none"
}

# ---------- 发布一页（内部含重试；失败不牵连其他页） ----------
# 返回：0=已上线；1=页面本身有问题，已隔离；2=环境占用，稍后再来（不算这页的错）
publish_page(){
  local id=$1 attempt rc env_only=0
  for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
    id=$1   # 每轮重置：被调用的辅助函数可能改动同名变量，不能带着上一轮的 id 去发下一轮
    log "发布 $id（第 $attempt/$MAX_ATTEMPTS 次）"
    bash "$R/publish-batch.sh" "$id" >> "$LOG" 2>&1
    rc=$?
    if [ "$rc" -eq 0 ]; then
      log "$id 上线成功"
      RETRY["$id"]=0
      save_retry
      return 0
    fi
    case "$rc" in
      20)  # 门禁/数据失败：已在 publish-batch.sh 里记 publish-failed.tsv
        log "$id 门禁未通过（rc=20），${RETRY_COOLDOWN}s 后重试这一页"
        sleep "$RETRY_COOLDOWN"
        ;;
      9|10|11)  # push / Actions：基础设施问题，不算页面内容错
        log "$id push/Actions 未成功（rc=$rc），${PUSH_RETRY_COOLDOWN}s 后重试这一页"
        sleep "$PUSH_RETRY_COOLDOWN"
        ;;
      14)  # 该页与 origin/main 已一致：此前已上线，不是页面缺陷
        log "$id 与 origin/main 已一致（此前已上线），无需重复发布"
        RETRY["$id"]=0
        save_retry
        return 0
        ;;
      3|4|5|6|7|8|12|13)  # 环境占用（锁、依赖、fetch、他人未提交改动…）：退避重来
        env_only=1
        log "$id 发布环境未就绪（rc=$rc），${PUSH_RETRY_COOLDOWN}s 后重来"
        sleep "$PUSH_RETRY_COOLDOWN"
        ;;
      *)
        log "$id 发布失败（rc=$rc），${RETRY_COOLDOWN}s 后重试"
        sleep "$RETRY_COOLDOWN"
        ;;
    esac
    RETRY["$id"]=$(( ${RETRY[$id]:-0} + 1 ))
    RETRY_WHEN["$id"]=$(out_sig "$id")
    save_retry
  done
  if [ "$env_only" = 1 ]; then
    # 环境问题不是这一页的错：不隔离，留到后面的轮次再来
    log "$id 因环境占用暂缓（不隔离），留给后续轮次"
    return 2
  fi
  # 重试用尽：记因隔离（out 再被改写会自动解禁）
  local why
  if grep -qF "$id	" "$R/publish-failed.tsv" 2>/dev/null; then
    why="连续 ${MAX_ATTEMPTS} 次未通过：$(grep -F "$id	" "$R/publish-failed.tsv" | tail -1 | cut -f2,4)"
  else
    why="连续 ${MAX_ATTEMPTS} 次发布未成功（详见 logs/incremental-publish.log）"
  fi
  note_blocked "$id" "$why" "$(out_sig "$id")"
  return 1
}

# ---------- 后台重新验收（历史 accept、out 晚于 gate 判定） ----------
REGATE_PID=""
STALE_IDS=()
declare -A REGATED_SIG=()   # 已复验过的 out 指纹；out 再被改写则重新复验
start_regate(){
  local id=$1
  [ -n "$REGATE_PID" ] && kill -0 "$REGATE_PID" 2>/dev/null && return 0
  (
    v=$(bash "$R/helpers/regate.sh" "$id" 2>>"$LOG")
    verdict=$(printf '%s\n' "$v" | head -1 | cut -f1)
    detail=$(printf '%s\n' "$v" | head -1 | cut -f2)
    printf '%s\t%s\t%s\t%s\n' "$id" "${verdict:-reject}" "${detail:-}" "$(ts)" >> "$R/regated.tsv"
    echo "$(ts) [publish] $id 重新验收 ${verdict:-reject}（${detail:-}）" >> "$R/progress.md"
    log "$id 重新验收 ${verdict:-reject}（${detail:-}）"
  ) &
  REGATE_PID=$!
  REGATED_SIG["$id"]=$(out_sig "$id")
  log "后台重新验收 $id（PID=$REGATE_PID）"
}
# 复验链：上一个跑完就接下一个（同一时刻只有一个，不把内存和抓站压力打满）
advance_regate(){
  [ "${#STALE_IDS[@]}" -eq 0 ] && return 0
  if [ -n "$REGATE_PID" ] && kill -0 "$REGATE_PID" 2>/dev/null; then return 0; fi
  REGATE_PID=""
  for id in "${STALE_IDS[@]}"; do
    [ -n "${BLOCKED[$id]:-}" ] && continue
    cur=$(out_sig "$id")
    [ "${REGATED_SIG[$id]:-}" = "$cur" ] && continue   # 这一版 out 已复验过
    start_regate "$id"
    return 0
  done
  return 0
}

last_gate=0
CAND=$R/logs/.candidates.tsv

# ---------- 台账对账（把「已上线但没记账」的页补齐、把 pending 行落实） ----------
RECONCILE_LOCK=$R/reconcile.lock
last_reconcile=0
run_reconcile(){
  # 放后台跑，不阻塞发布主循环；独立锁避免多轮重复触发。
  local now
  now=$(date +%s)
  [ $((now - last_reconcile)) -ge "$RECONCILE_EVERY" ] || return 0
  flock -w 1 "$RECONCILE_LOCK" -c true 2>/dev/null || return 0
  last_reconcile=$now
  ( flock "$RECONCILE_LOCK" python3 "$R/helpers/reconcile-published.py" >>"$LOG" 2>&1 ) &
}

# ---------- 收集候选 ----------
collect(){
  FRESH=(); STALE_IDS=()
  python3 "$R/helpers/publish-candidates.py" > "$CAND" 2> "$R/logs/.candidates.err"
  # check-one 不过的页：不上线，保留线上现版，但记下原因（让「为什么没上线」可见）
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    bid=${line%%$'\t'*}
    rest=${line#*$'\t'}
    err=${rest#*check-one FAIL: }
    bash "$R/helpers/record-fail.sh" "$bid" "check-one" "$err"
  done < "$R/logs/.candidates.err"
  while IFS=$'\t' read -r id need note; do
    [ -z "${id:-}" ] && continue
    # 已隔离的页：out 文件若被 worker 改写，则自动解禁重来
    if [ -n "${BLOCKED[$id]:-}" ]; then
      cur=$(out_sig "$id"); old=${BLOCKED_SIG[$id]:-}
      if [ -n "$old" ] && [ "$cur" != "$old" ]; then
        log "$id 的 out 已更新（$old → $cur），解禁重试"
        unset 'BLOCKED[$id]' 'BLOCKED_SIG[$id]'
        RETRY["$id"]=0
      else
        continue
      fi
    fi
    if [ "$need" = "1" ]; then STALE_IDS+=("$id"); else FRESH+=("$id"); fi
  done < "$CAND"
}

while true; do
  # 有新 pass 未过 gate 时主动跑一次 gate.sh，缩短「验收通过 → 可发布」的间隔
  now=$(date +%s)
  pending=$(awk -F'\t' '$2=="pass"{print $1}' "$R/status.tsv" 2>/dev/null | while read -r id; do
      awk -F'\t' -v id="$id" '$1==id && ($2=="accept"||$2=="reject"){f=1} END{exit !f}' "$R/gate.tsv" || echo "$id"
    done | head -1)
  if [ -n "$pending" ] && [ $((now - last_gate)) -ge "$GATE_MIN_INTERVAL" ]; then
    # gate.sh 可能跑很久（逐页 reverify 要重抓网页），放后台，绝不挡住发布主循环。
    # 用锁判断是否已有人在跑，避免和别的会话重复跑 gate。
    if flock -w 1 "$R/gate.lock" -c true 2>/dev/null; then
      log "发现未过 gate 的 pass 页面（$pending…），后台运行 gate.sh"
      ( flock "$R/gate.lock" ./gate.sh > /dev/null 2>&1 ) &
      last_gate=$(date +%s)
    else
      log "gate.sh 正在由别的进程运行，本轮不重复启动"
    fi
  fi

  collect
  advance_regate
  run_reconcile

  if [ "${#FRESH[@]}" -eq 0 ]; then
    echo drained > "$STATE"
    if [ -f "$R/READY_FINAL" ]; then
      log "无可发布页且 READY_FINAL 已出现，发布器退出（后续由最终收尾 taskB 负责）"
      exit 0
    fi
    log "当前无可发布页（待复验 ${#STALE_IDS[@]} 个），${POLL}s 后重查"
    sleep "$POLL"
    continue
  fi

  echo running > "$STATE"
  # ---------- 一页一页地发：每发完一页就重列候选，已上线的自动退出队列 ----------
  cycle_pages=0
  while [ "${#FRESH[@]}" -gt 0 ] && [ "$cycle_pages" -lt "$MAX_PAGES_PER_CYCLE" ]; do
    cycle_pages=$((cycle_pages+1))
    id=${FRESH[0]}
    publish_page "$id"
    rc=$?
    collect
    advance_regate
    if [ "$rc" = "2" ]; then
      # 环境占用：把这一页挪到队尾，先让后面的好页上线
      newf=()
      for x in "${FRESH[@]}"; do [ "$x" = "$id" ] && continue; newf+=("$x"); done
      FRESH=()
      for x in "${newf[@]}"; do FRESH+=("$x"); done
      FRESH+=("$id")
    fi
  done
  log "本轮处理 ${cycle_pages} 页（下轮继续）"
done
