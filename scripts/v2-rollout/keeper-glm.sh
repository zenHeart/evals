#!/usr/bin/env bash
# keeper-glm.sh：保持 NG 个 GLM-5.3 槽（g1..gNG，worker3g.sh，glm-self 账号）。与 keeper2.sh（StepFun x1..x7）并行，互不干扰。
# 停止 GLM 池：bash stop-glm.sh（会把在做的页面放回队列头）。GLM 额度用尽时 worker 写 QUOTA.glm，本 keeper 随之退出。
R=/workspace/rollout; cd $R; NG=${NG:-4}
while [ ! -f STOP ] && [ ! -f STOPGLM ] && [ ! -f QUOTA.glm ]; do
  g=$(pgrep -fc "worker3g.sh g[0-9]+$"); q=$(wc -l < queue2.txt)
  if [ $q -gt 0 ] && [ $g -lt $NG ]; then
    for s in $(seq 1 $NG); do pgrep -f "worker3g.sh g$s$" >/dev/null || [ -f retire.xg$s ] || { (setsid ./worker3g.sh g$s > logs/xg$s.out 2>&1 &); echo "$(date '+%F %T') keeper-glm start xg$s (NG=$NG)" >> logs/supervisor.log; sleep 20; }; done
  fi
  [ $q -eq 0 ] && [ $g -eq 0 ] && exit 0
  sleep 120
done
