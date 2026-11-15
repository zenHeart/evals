#!/usr/bin/env bash
# 增量发布模式下的收尾（2026-11-14 起，任务 I）。
# 与旧版（finalize.sh.bak-preincremental）的区别：不再对 /workspace/evals 做
# git reset --hard / checkout -B rollout-full / 按全部 accept id 全量 integrate，也不再抢先本地 commit。
# 这里只做：刷新 gate、记账、等增量发布器把「当时已合格」的页面推完，然后打 READY_FINAL 标记。
# 队列空 + worker 全退出时由 monitor2.sh 调用；不会因历史 accept 缺 out 而失败，不会回退任何已上线内容。
R=/workspace/rollout; cd $R
ts(){ date '+%F %T'; }
pub_alive(){ [ -f $R/publisher.pid ] && kill -0 "$(cat $R/publisher.pid 2>/dev/null)" 2>/dev/null; }

./gate.sh > /dev/null 2>&1
a=$(awk -F'\t' '$2=="accept"{n++} END{print n+0}' gate.tsv)
rj=$(awk -F'\t' '$2=="reject"{n++} END{print n+0}' gate.tsv)
echo "$(ts) finalize: gate accept=$a reject=$rj（历史累计，不等于可发布；能否上线由发布器按 out+v2+check-one 逐页判定）" >> progress.md

# 等增量发布器把当时已合格的页面推完；发布器没在跑就直接打标记。
MAXWAIT=${FINALIZE_MAX_WAIT:-5400}; waited=0
while pub_alive; do
  st=$(cat $R/publisher.state 2>/dev/null || echo unknown)
  [ "$st" = drained ] && break
  if [ "$waited" -ge "$MAXWAIT" ]; then
    echo "$(ts) finalize: 等发布器排空超时（${MAXWAIT}s），仍打 READY_FINAL；最终收尾须自行持锁核对" >> progress.md
    break
  fi
  [ $((waited % 300)) -eq 0 ] && echo "$(ts) finalize: 等发布器排空中（state=$st ${waited}s）" >> progress.md
  sleep 60; waited=$((waited+60))
done

touch $R/READY_FINAL
echo "$(ts) finalize: READY_FINAL 已打（队列已空、worker 已退出；后续页面仍由发布器/最终收尾负责，不动线上旧版）" >> progress.md
