#!/usr/bin/env bash
# StepFun conductor: task A now; then watch rollout -> stall fix (S) or final wrap-up (B)
# 2026-11-14 增量发布模式（任务 I）：taskB 改为「最终收尾」，跑在发布工作树 /workspace/evals-publish，
# 且必须等常驻发布器排空/退出后再启动，避免两个发布方并发推 main。
C=/workspace/sf-conductor; R=/workspace/rollout
cd $C
[ -f reportA.md ] || nohup ./run-sf.sh $C/taskA.md taskA /workspace/evals-fair-tighten-20261113 >/dev/null 2>&1 &
lastacc=""; lastchg=$(date +%s); lastS=0
while true; do
  if grep -q "STATUS: DONE" reportB.md 2>/dev/null; then echo "$(date '+%F %T') B done, conductor exit" >> logs/runs.log; exit 0; fi
  if [ -f $R/READY_FINAL ]; then
    pub_alive=0
    if [ -f $R/publisher.pid ] && kill -0 "$(cat $R/publisher.pid 2>/dev/null)" 2>/dev/null; then pub_alive=1; fi
    pub_state=$(cat $R/publisher.state 2>/dev/null || echo unknown)
    if [ "$pub_alive" = 0 ] || [ "$pub_state" = drained ]; then
      if ! pgrep -f "run-sf.sh $C/taskB.md" >/dev/null; then
        n=$(ls logs/taskB.*.json 2>/dev/null | wc -l)
        if [ "$n" -lt 12 ]; then ./run-sf.sh $C/taskB.md taskB /workspace/evals-publish >/dev/null 2>&1 & fi
      fi
    else
      echo "$(date '+%F %T') READY_FINAL present but publisher still busy (state=$pub_state); defer taskB" >> logs/runs.log
    fi
  else
    acc=$(grep -oE "accept(ed)?[^0-9]{0,4}[0-9]+" $R/progress.md 2>/dev/null | tail -1 | grep -oE "[0-9]+$")
    now=$(date +%s)
    [ "$acc" != "$lastacc" ] && { lastacc=$acc; lastchg=$now; }
    recent=$(find $R/evidence -newermt "-180 min" -type f 2>/dev/null | head -1)
    if [ $((now-lastchg)) -gt 10800 ] && [ -z "$recent" ] && [ $((now-lastS)) -gt 10800 ]; then
      lastS=$now; ./run-sf.sh $C/taskS.md taskS-$(date +%H%M) $R >/dev/null 2>&1 &
    fi
  fi
  date '+%F %T' > logs/heartbeat
  # 发布器守护：没在跑且还没到最终收尾就拉起来（幂等，publisher.sh 自身也有 PID 文件防重入）
  if [ ! -f $R/READY_FINAL ]; then
    pub_alive=0
    if [ -f $R/publisher.pid ] && kill -0 "$(cat $R/publisher.pid 2>/dev/null)" 2>/dev/null; then pub_alive=1; fi
    if [ "$pub_alive" = 0 ] && ! pgrep -f "bash $R/publisher.sh" >/dev/null; then
      echo "$(date '+%F %T') publisher not running -> restart" >> logs/runs.log
      setsid nohup bash "$R/publisher.sh" >> "$R/logs/publisher.out" 2>&1 < /dev/null &
    fi
  fi
  sleep 600
done
