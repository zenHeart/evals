#!/usr/bin/env bash
# 稳态：保持 N 个 worker2 槽（StepFun 并发上限 8）；旧 w* 排空后 N=${N2:-5}
R=/workspace/rollout; cd $R
while [ ! -f STOP ] && [ ! -f QUOTA ]; do
  old=$(pgrep -fc "worker.sh [0-9]+$"); x=$(pgrep -fc "worker2.sh [0-9]+$"); q=$(wc -l < queue2.txt)
  N=4; [ $old -eq 0 ] && N=${N2:-5}
  if [ $q -gt 0 ] && [ $x -lt $N ]; then
    for s in $(seq 1 $N); do pgrep -f "worker2.sh $s$" >/dev/null || [ -f retire.x$s ] || { (setsid ./worker2.sh $s > logs/x$s.out 2>&1 &); echo "$(date '+%F %T') keeper start x$s (old=$old N=$N)" >> logs/supervisor.log; break; }; done
  fi
  [ $q -eq 0 ] && [ $x -eq 0 ] && exit 0
  sleep 120
done
