#!/usr/bin/env bash
# stop-glm.sh：干净停掉 GLM 池，把正在做的页面（含半成品 partial）放回 queue2.txt 队头，StepFun 池接着做。
R=/workspace/rollout; cd $R; touch STOPGLM
pkill -f "keeper-glm.sh" 2>/dev/null
for pid in $(pgrep -f "worker3g.sh g[0-9]+$"); do pkill -TERM -P $pid 2>/dev/null; kill $pid 2>/dev/null; done
sleep 3; pkill -f "claude .*cc-speed(45)?-glm.json" 2>/dev/null; sleep 2
for f in pagestate/xg*.cur; do [ -f "$f" ] || continue; read slot id mode t < "$f"
  cp wt/x$slot/data/benchmarks/$id.json partial/$id.json 2>/dev/null
  ( flock 9; grep -qx "$id" queue2.txt || { { echo "$id"; cat queue2.txt; } > queue2.txt.tmp && mv queue2.txt.tmp queue2.txt; } ) 9>queue.lock
  rm -f pagestate/$id.sid pagestate/$id.attempts "$f"; echo "$(date '+%F %T') stop-glm requeued $id from x$slot" >> logs/supervisor.log
done
echo "GLM pool stopped; remove STOPGLM before restarting keeper-glm.sh"
