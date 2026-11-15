#!/usr/bin/env bash
# 逐步扩容 worker2：可用内存 >2.2GB 且近 10 分钟无 API 错误时每 4 分钟加 1 槽，上限 MAX；<1.2GB 时退休最新槽
R=/workspace/rollout; MAX=${MAX:-24}; cd $R
while [ ! -f STOP ]; do
  avail=$(awk '/MemAvailable/{print int($2/1024)}' /proc/meminfo)
  running=$(pgrep -fc "worker2.sh [0-9]+$"); old=$(pgrep -fc "worker.sh [0-9]+$")
  now=$(date +%s); errs=$(awk -v n=$now '$1>n-600' logs/429.ts 2>/dev/null | wc -l)
  qn=$(wc -l < queue2.txt)
  echo "$(date '+%F %T') avail=${avail}MB x=$running old=$old err10m=$errs queue=$qn" >> logs/supervisor.log
  [ -f QUOTA ] && { echo "$(date '+%F %T') QUOTA flag — stop ramp" >> logs/supervisor.log; exit 0; }
  if [ "$qn" -gt 0 ] && [ $avail -gt 2200 ] && [ $errs -eq 0 ] && [ $((running+old)) -lt $MAX ]; then
    for s in $(seq 1 40); do pgrep -f "worker2.sh $s$" >/dev/null || { (setsid ./worker2.sh $s > logs/x$s.out 2>&1 &); echo "$(date '+%F %T') start x$s" >> logs/supervisor.log; break; }; done
  elif [ $avail -lt 1200 ] || [ $errs -ge 5 ]; then
    top=$(pgrep -fa "worker2.sh [0-9]+$" | awk '{print $NF}' | sort -n | tail -1); [ -n "$top" ] && [ ! -f retire.x$top ] && touch retire.x$top && echo "$(date '+%F %T') retire x$top (avail=$avail errs=$errs)" >> logs/supervisor.log
  fi
  [ "$qn" -eq 0 ] && [ $running -eq 0 ] && [ $old -eq 0 ] && { echo done >> logs/supervisor.log; exit 0; }
  sleep 240
done
