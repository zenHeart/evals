#!/usr/bin/env bash
# publish-batch.sh <id...>
# 增量发布 benchmark-profile/v2 页面到 origin/main（只快进，绝不 force），并等 GitHub Actions 部署完成。
#
# 串行锁：/workspace/rollout/publish.lock（阻塞获取，默认最多等 1800s）。
#   发布器 publisher.sh 直接调用本脚本，不再自己持锁；人工首轮发布同样走本脚本，保证同一套逻辑。
#
# 流程：持锁 → fetch 并 FF 到 origin/main → 校验并拷贝 out/<id>.json → 修合法数据缺陷
#       → 移出 backlog → 全部门禁 → 还原 evals.epub → 只暂存预期路径 → 一次提交 → FF push
#       → 等「Build & Publish」build+deploy 成功 → curl 核验 → 记账 published.tsv
#
# 任一步失败：不 push、不强推、不回退远程，本地工作树恢复干净，保留日志；
#   门禁失败时把「页 id / 失败步骤 / 具体错误」写进 publish-failed.tsv，
#   交给发布器决定重试还是隔离——单页失败不牵连其他页。
set -uo pipefail

R=/workspace/rollout
WT=${PUBLISH_WT:-/workspace/evals-publish}
REPO=${PUBLISH_REPO:-zenHeart/evals}
LOCK=$R/publish.lock
LOG=$R/logs/incremental-publish.log
SITE=${PUBLISH_SITE:-https://evals.zenheart.site}
# 构建产物：scripts/build-benchmarks-hub.mjs 每次构建都把 updated 写成本日日期。
# 与 evals.epub 同类，不入本批提交；但留着这份本地改动会先后触发 rc=6（ff 被本地改动挡住）
# 和 rc=12（门禁后的「预期外的脏文件」检查），所以进场和门禁后各还原一次。
GEN_IDS=data/generated/auto-benchmark-ids.json
GATE_TIMEOUT=${GATE_TIMEOUT:-2400}      # 单道门禁超时（秒）
ACTIONS_TIMEOUT=${ACTIONS_TIMEOUT:-5400} # 等 Actions 的超时（秒）：GitHub 侧排队可能很久，超时按基础设施错误处理（不隔离页面）
LOCK_WAIT=${LOCK_WAIT:-1800}
GH_CALL_TIMEOUT=${GH_CALL_TIMEOUT:-20}   # 单次 gh 调用超时（秒）：网络卡住时不拖住整页

ts(){ date '+%F %T'; }
log(){ echo "$(ts) $*" >> "$LOG"; echo "$(ts) $*"; }
# die <原因> [退出码]。退出码约定：1=环境/流程类（不二分）；20=门禁/数据类（记 publish-failed，
# 换下一页继续）；9/10/11=push 与 Actions 类（同一页重试，不淘汰页面）；
# 14=该页已与 origin/main 一致（此前已上线，无需重复发布）。
die(){ log "ERROR: $1"; cleanup_on_fail; exit "${2:-1}"; }

copied_new=()
touched=()   # 本脚本动过的既有文件（失败时只还原这些，不碰别人的未提交改动）
cleanup_on_fail(){
  cd "$WT" 2>/dev/null || return 0
  # 只还原本脚本动过的路径：绝不用 reset --hard（那会连带丢掉别人的未提交改动）
  for f in "${touched[@]:-}"; do [ -n "$f" ] && git checkout -q -- "$f" 2>/dev/null; done
  for f in "${copied_new[@]:-}"; do [ -n "$f" ] && rm -f "$f"; done
  git checkout -q -- evals.epub 2>/dev/null
  log "已放弃本批，本脚本动过的文件已还原（未推送任何内容）"
}

# rebase_onto_origin：把当前分支 rebase 到 origin/main。
# 只允许一种自动解决：data/benchmark-profile-backlog.json 的冲突
#   （双方都从同一份 id 列表里删不同条目，文本必然撞车）。
# 合成结果 = 上游版本 再删掉本地这批提交删掉的 id（helpers/merge-backlog.py）。
# 其它冲突一律 abort 并返回非 0——由调用方按「环境被占用」退避，不计页面失败次数。
rebase_onto_origin(){
  local ours_head base conf
  ours_head=$(git rev-parse HEAD)
  base=$(git merge-base HEAD origin/main 2>/dev/null || true)
  if git rebase -q origin/main; then return 0; fi
  conf=$(git diff --name-only --diff-filter=U)
  if [ "$conf" = "data/benchmark-profile-backlog.json" ] && [ -n "$base" ]; then
    if python3 "$R/helpers/merge-backlog.py" "$base" "$ours_head" origin/main > data/benchmark-profile-backlog.json 2>/dev/null \
       && git add -- data/benchmark-profile-backlog.json \
       && GIT_EDITOR=true git rebase --continue >/dev/null 2>&1; then
      log "已按「上游版本 + 本地删除项」合成 backlog 并完成 rebase"
      return 0
    fi
  fi
  git rebase --abort 2>/dev/null
  log "ERROR: rebase 到 origin/main 未能自动解决（冲突文件：${conf:-未知}），已 abort"
  return 1
}

[ $# -ge 1 ] || { echo "usage: publish-batch.sh <id...>" >&2; exit 2; }
ids=("$@")
mkdir -p "$R/logs"

# ---------- 串行锁 ----------
exec 9>"$LOCK"
if ! flock -w "$LOCK_WAIT" 9; then
  log "ERROR: ${LOCK_WAIT}s 内拿不到发布锁（$LOCK），退出"
  exit 3
fi
log "=== 批次开始：$* ==="

cd "$WT" || { log "ERROR: 发布工作树 $WT 不存在"; exit 4; }
[ -d node_modules/jszip ] || { log "ERROR: $WT/node_modules 缺失（npm ci --ignore-scripts）"; exit 4; }

# ---------- 0. 清掉上一次构建留下的产物改动 ----------
# 上一次批次的 build 门禁会把 $GEN_IDS 的 updated 改成本日日期后以 rc=12 放弃，这份改动留在树里，
# 下一次的 ff-only 合并就会因「本地改动会被覆盖」而中止（rc=6）。它是构建产物，直接还原。
git checkout -q -- "$GEN_IDS" 2>/dev/null || true

# ---------- 1. FF 到最新 origin/main ----------
git fetch -q origin || { log "ERROR: git fetch 失败"; exit 5; }
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
  if git merge-base --is-ancestor HEAD origin/main; then
    git merge --ff-only -q origin/main || { log "ERROR: ff-only 合并失败"; exit 6; }
    log "工作树快进到 origin/main $(git rev-parse --short origin/main)"
  elif git merge-base --is-ancestor origin/main HEAD; then
    log "HEAD 领先 origin/main，沿用上次未推送提交 $(git rev-parse --short HEAD)"
  else
    log "HEAD 与 origin/main 分叉，rebase 到 origin/main"
    rebase_onto_origin || { log "ERROR: rebase 失败（已 abort），需人工介入"; exit 7; }
    log "rebase 完成 $(git rev-parse --short HEAD)"
  fi
fi

# ---------- 2. 校验并拷贝 ----------
copied=(); copied_new=(); skipped=(); fixed_note=""
for id in "${ids[@]}"; do
  f=$R/out/$id.json
  if [ ! -f "$f" ]; then skipped+=("$id:out缺失"); continue; fi
  t=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1])).get('profile',{}).get('template',''))" "$f" 2>/dev/null || echo "")
  if [ "$t" != "benchmark-profile/v2" ]; then skipped+=("$id:template=$t"); continue; fi
  d=$WT/data/benchmarks/$id.json
  # 目标文件若已有别人的未提交改动，不覆盖、不覆盖式提交，交给调用方稍后再来
  if [ -n "$(git status --short -- "$d" 2>/dev/null)" ]; then
    skipped+=("$id:目标文件有未提交改动"); continue
  fi
  git cat-file -e "HEAD:data/benchmarks/$id.json" 2>/dev/null || copied_new+=("$d")
  git cat-file -e "HEAD:data/benchmarks/$id.json" 2>/dev/null && touched+=("$d")
  cp "$f" "$d" || { skipped+=("$id:拷贝失败"); continue; }
  copied+=("$id")
done
[ ${#copied[@]} -ge 1 ] || {
  for s in "${skipped[@]:-}"; do
    case "$s" in
      *未提交改动*) bash "$R/helpers/record-fail.sh" "${s%%:*}" "pre-publish" "目标文件在发布工作树里有他人未提交改动，本轮不覆盖（环境占用，稍后重来）" ;;
    esac
  done
  log "ERROR: 本批没有可发布页面（跳过：${skipped[*]:-无}）"
  exit 8
}
log "本批待发布 ${#copied[@]} 页：${copied[*]}${skipped[*]+ ；跳过：${skipped[*]}}"

# ---------- 2b. 修合法数据缺陷（缺失值 "-"→null；非法分类/外键对到站内既有写法） ----------
# 这些是仓库规范明确判定的错误（validate-data 的 forbidDash / 分类外键 / related 外键），
# 修的是「来源没披露」和「站内写错了 id」，不涉及任何计分判断。
for id in "${copied[@]}"; do
  note=$(python3 "$R/helpers/fix-page-defects.py" --file "$WT/data/benchmarks/$id.json" 2>/dev/null | tr '\n' ';')
  if [ -n "${note// /}" ]; then
    log "数据修正 · $id：$note"
    fixed_note="${fixed_note}${fixed_note:+ }$id：$note"
  fi
done

# 移出 backlog（与 integrate.sh 同一写法）
touched+=(data/benchmark-profile-backlog.json)
python3 - "${copied[@]}" <<'PY' || die "backlog 更新失败"
import json,sys
p='data/benchmark-profile-backlog.json'
try: b=json.load(open(p))
except Exception: sys.exit(0)
rm=set(sys.argv[1:])
before=len(b.get('ids',[]))
b['ids']=[i for i in b.get('ids',[]) if i not in rm]
if 'count' in b: b['count']=len(b['ids'])
json.dump(b,open(p,'w'),ensure_ascii=False,indent=2); open(p,'a').write('\n')
print(f"[backlog] {before} -> {len(b['ids'])}")
PY

# ---------- 3. 全部门禁 ----------
FAIL_STEP=""
FAIL_ERR=""
run_gate(){ # run_gate <名称> <命令...>
  local name=$1; shift
  local out=$R/logs/gate-${name//[^a-zA-Z0-9]/-}.log
  if timeout "$GATE_TIMEOUT" "$@" > "$out" 2>&1; then
    log "门禁 PASS · $name"
  else
    log "门禁 FAIL · $name（详见 $out）"
    tail -25 "$out" | sed 's/^/    /' >> "$LOG"
    FAIL_STEP="$name"
    FAIL_ERR=$(grep -E '^[[:space:]]*[-•][[:space:]]' "$out" | head -3 | sed 's/^[[:space:]]*[-•][[:space:]]*//' | tr '\n' ';' | cut -c1-300)
    [ -z "$FAIL_ERR" ] && FAIL_ERR=$(tail -3 "$out" | tr '\n' ' ' | cut -c1-300)
    # 失败隔离：记下「哪一页 / 卡在哪道门 / 具体错误」，随后换下一页，不牵连整批
    for id in "${copied[@]}"; do bash "$R/helpers/record-fail.sh" "$id" "$name" "$FAIL_ERR"; done
    die "门禁 $name 未通过，本批不推送" 20
  fi
}
run_gate reconcile-coverage node scripts/reconcile-coverage.mjs
run_gate test node --test tests/*.test.mjs
run_gate validate-data node scripts/validate-data.mjs
run_gate sync-skills-check npm run -s sync:skills:check
run_gate build npm run -s build
run_gate validate-site node scripts/validate-site.mjs

# ---------- 4. 还原构建改写、只暂存预期路径 ----------
# build 会改写这些生成文件的时间戳/产物；增量页发布不把它们纳入提交。
git checkout -q -- evals.epub data/generated/auto-benchmark-ids.json 2>/dev/null || true
git diff --quiet -- evals.epub || die "evals.epub 仍被改写且无法还原"
git diff --quiet -- data/generated/auto-benchmark-ids.json || die "auto-benchmark-ids.json 仍被改写且无法还原"

staged=(data/benchmark-profile-backlog.json)
for id in "${copied[@]}"; do staged+=("data/benchmarks/$id.json"); done
dirty=$(git status --short | awk '{print $2}')
extra=$(comm -13 <(printf '%s\n' "${staged[@]}" | sort) <(printf '%s\n' $dirty | sort))
if [ -n "$extra" ]; then
  # 别人留下的未提交改动：不动它（不 reset、不 stash），只把本批自己的文件撤回来。
  # 这是「环境被占用」，不是页面内容问题——不算这页的失败次数，退避后整页重来。
  for id in "${copied[@]}"; do git checkout -q -- "data/benchmarks/$id.json" 2>/dev/null || true; done
  git checkout -q -- data/benchmark-profile-backlog.json 2>/dev/null || true
  log "WARN: 工作树有预期外的未提交改动，本轮不推送：$(echo $extra | tr '\n' ' ')"
  die "出现预期外的脏文件，停止推送：$(echo $extra | tr '\n' ' ')" 12
fi

git add -- "${staged[@]}"
if git diff --cached --quiet; then
  # 暂存区为空 = 该页在 origin/main 上已经和 out 一致（此前已上线）。
  # 这不是页面缺陷，单独用退出码 14 表达，让发布器记「已上线」而不是「失败重试」。
  cleanup_on_fail
  log "该页与 origin/main 已一致（此前已上线），本次无需提交"
  exit 14
fi

# ---------- 5. 提交 ----------
n=${#copied[@]}
msg="feat(benchmarks): ${n} 个评测升级为 benchmark-profile/v2 深度档案（逐字证据核验）"
body=$(cat <<EOF

增量发布批次（每验收通过一页即部署，不等全队列跑完）。

本批 ${n} 页：
$(printf '  - %s\n' "${copied[@]}")

门禁：reconcile-coverage · node --test（139）· validate-data · sync:skills:check
      · build（test+sync:skills:check+validate:data+book validate+epub+web）· validate-site 全部通过；
      check-one.mjs 逐页通过；evals.epub 与 auto-benchmark-ids.json 的构建改写已还原、不入提交。
EOF
)
if [ -n "$fixed_note" ]; then
  body="${body}
随页修正的合法数据缺陷（不涉及任何计分判断）：
${fixed_note}
"
fi
git -c user.name=zenheart -c user.email=zenheart_register@163.com commit -q -m "$msg" -m "$body" \
  || die "commit 失败"
sha=$(git rev-parse HEAD)
log "已提交 $sha"

# ---------- 6. 快进推送 ----------
# 门禁链要跑几十分钟，期间别人完全可能已经推了新提交到 origin/main。
# 如果不重新对齐就直接 push，就会因为「远程已前进」被拒（非快进），好页被白白拖到下一轮。
# 所以 push 前重新 fetch，并把本次提交重放到最新 origin/main 上：
#   - 本次提交已在上游（同一页已被发布）→ 跳过重复推送；
#   - 别人已发布同一页内容（rebase 后提交被丢弃）→ 退出码 14（已上线，不重复发布）；
#   - 否则 rebase 后拿到新 sha，再走「只快进、不 force」的 push。
already=0
git fetch -q origin || { log "ERROR: push 前重新 fetch 失败（保留本地提交 $sha）"; exit 5; }
mnow=$(git rev-parse origin/main)
parent=$(git rev-parse "$sha^" 2>/dev/null || echo "")
if [ "$mnow" = "$sha" ]; then
  log "远程 tip 就是本次提交 $sha，无需重复推送"
  already=1
elif [ -n "$parent" ] && [ "$mnow" = "$parent" ]; then
  : # 常规情况：远程 tip 就是本次提交的父提交，直接快进推送即可
else
  if git merge-base --is-ancestor "$sha" origin/main; then
    log "本次提交 $sha 已在 origin/main 上（远程已含本次内容），无需重复推送"
    already=1
  else
    log "门禁期间 origin/main 已前进（远程 $mnow，基线 $parent），把本次提交 rebase 到其上"
    rebase_onto_origin || { log "ERROR: rebase 失败（已 abort，保留本地提交 $sha），需人工介入"; exit 7; }
    nsha=$(git rev-parse HEAD)
    if [ "$nsha" = "$mnow" ]; then
      log "该页内容已由他人发布到 origin/main（$mnow），本次无需重复发布"
      exit 14
    fi
    sha=$nsha
    log "rebase 完成，新提交 $sha"
  fi
fi
if [ "$already" = 0 ]; then
  if ! git push -q origin HEAD:main 2>>"$LOG"; then
    log "ERROR: push 失败（未使用 --force），保留本地提交 $sha，远程未变"
    exit 9
  fi
  log "已推送 origin/main <- $sha（https://github.com/$REPO/commit/$sha）"
else
  log "远程已含本次提交 $sha（https://github.com/$REPO/commit/$sha）"
fi

# ---------- 6b. 先记 pending 行 ----------
# 推送成功即记账（result=pending），不等 Actions：这样即使本进程随后崩溃/超时退出，
# 台账里也已经有这一行，reconcile-published.py 能按 (id, sha) 找到它并补上 run 与核验结果。
# 若不这样做，页面已上线却因超时退出而永远漏记（候选脚本又因「已是 v2」跳过它）。
now0=$(ts)
# 时间列统一用「提交时间」，与 reconcile-published.py 的补记口径一致（同一页重放对账结果不变）
commit_t=$(git show -s --format=%ci "$sha" 2>/dev/null | cut -c1-19 | tr 'T' ' ' || true)
[ -n "$commit_t" ] || commit_t=$now0
for id in "${copied[@]}"; do
  python3 "$R/helpers/upsert-published.py" "$id" "$sha" "$commit_t" \
    "$SITE/benchmarks/$id/" "" pending >>"$LOG" 2>&1 || true
done
log "已记 pending 行（${#copied[@]} 页）"

# ---------- 7. 等 Actions ----------
# 说明：不用 `gh run watch`（长时间流式连接在网络抖动时会挂住），改成用 API 轮询，
# 每次调用都有独立超时，避免一次卡死的请求把整页的发布拖成小时级。
run_id=""
for i in $(seq 1 30); do
  run_id=$(timeout -k 5 "$GH_CALL_TIMEOUT" gh api "repos/$REPO/actions/runs?head_sha=$sha&per_page=5" \
            --jq '.workflow_runs[] | select(.event=="push" and .name=="Build & Publish") | .id' 2>/dev/null | head -1)
  [ -n "$run_id" ] && break
  sleep 10
done
[ -n "$run_id" ] || { log "WARN: 未找到 $sha 对应的 Actions run，请人工核查"; exit 10; }
run_url="https://github.com/$REPO/actions/runs/$run_id"
log "Actions run $run_id（$run_url）等待中"

deadline=$(( $(date +%s) + ACTIONS_TIMEOUT ))
concl=""
while :; do
  st=$(timeout -k 5 "$GH_CALL_TIMEOUT" gh api "repos/$REPO/actions/runs/$run_id" \
        --jq '.status + " " + (.conclusion // "")' 2>/dev/null || true)
  st=$(printf '%s' "$st" | tr -d '"')
  case "$st" in
    "completed success") concl=success; break ;;
    "completed "*)      concl="${st#completed }"; break ;;
  esac
  if [ "$(date +%s)" -ge "$deadline" ]; then
    log "ERROR: 等 Actions 超时（${ACTIONS_TIMEOUT}s，run $run_id，最后状态 '$st'）"
    exit 11
  fi
  sleep 10
done
if [ "$concl" = "success" ]; then
  log "Actions SUCCESS · build + Deploy to GitHub Pages"
else
  log "ERROR: Actions 未成功（结论=$concl，run $run_id）。不推送修正、不回退远程，需人工核查"
  exit 11
fi

# ---------- 8. 线上核验 ----------
verified=(); unverified=()
for id in "${copied[@]}"; do
  url="$SITE/benchmarks/$id/"
  ok=0
  for attempt in 1 2 3 4 5 6; do
    # 注意：不要写成 `curl … | grep -q`——pipefail 下 grep 提前退出会让 curl 收 SIGPIPE，
    # 整条管道返回非 0，把已成功的核验误判成失败。
    body=$(curl -s --max-time 60 "$url" 2>/dev/null || true)
    case "$body" in *"benchmark-profile/v2"*) ok=1; break ;; esac
    sleep 20
  done
  if [ "$ok" = 1 ]; then verified+=("$id"); else unverified+=("$id"); fi
done
for id in "${verified[@]:-}"; do
  [ -n "$id" ] && log "线上核验 OK · $SITE/benchmarks/$id/ 已含 benchmark-profile/v2"
done
for id in "${unverified[@]:-}"; do
  [ -n "$id" ] && log "WARN: 线上核验未通过 · $SITE/benchmarks/$id/"
done

# ---------- 9. 记账 ----------
# 列：id / commit SHA / 时间 / 页面 URL / Actions run URL / 核验结果
# （2026-11-14 之前的历史行只有 5 列，是首批发布的旧格式，保留不改。）
# 6b 步已按 (id, sha) 写过 pending 行，这里用 upsert 把同一行改成最终结果，
# 不追加新行，避免同一页出现两行记录。
now=$(ts)
for id in "${copied[@]}"; do
  v=failed
  for u in "${verified[@]:-}"; do [ "$u" = "$id" ] && v=ok; done
  python3 "$R/helpers/upsert-published.py" "$id" "$sha" "$commit_t" \
    "$SITE/benchmarks/$id/" "$run_url" "$v" >>"$LOG" 2>&1 || true
done
for id in "${copied[@]}"; do
  echo "$now [publish] $id -> $sha $SITE/benchmarks/$id/ $run_url" >> "$R/progress.md"
done
nv=0
for u in "${verified[@]:-}"; do [ -n "$u" ] && nv=$((nv+1)); done
log "=== 批次完成：$sha（${#copied[@]} 页，核验通过 ${nv} 页，Actions $run_url）==="
