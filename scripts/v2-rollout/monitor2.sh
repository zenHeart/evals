#!/usr/bin/env bash
R=/workspace/rollout; cd $R
while [ ! -f STOP ]; do
  ./gate.sh > /dev/null 2>&1
  p=$(awk -F'\t' '$2=="pass"' status.tsv | wc -l); f=$(awk -F'\t' '$2=="fail"' status.tsv | wc -l); s=$(awk -F'\t' '$2=="skip"' status.tsv | wc -l)
  a=$(awk -F'\t' '$2=="accept"' gate.tsv | wc -l); rj=$(awk -F'\t' '$2=="reject"' gate.tsv | wc -l)
  q=$(wc -l < queue2.txt); x=$(pgrep -fc "worker3.sh [0-9]+$"); g=$(pgrep -fc "worker3g.sh g[0-9]+$"); o=$(pgrep -fc "worker.sh [0-9]+$")
  av=$(awk '/MemAvailable/{print int($2/1024)}' /proc/meminfo); e=$(wc -l < logs/429.ts 2>/dev/null || echo 0)
  echo "$(date '+%F %T') [auto] worker=pass $p/fail $f/skip $s · gate=accept $a/reject $rj · queue $q · slots x=$x glm=$g old=$o · avail ${av}MB · api-errors total $e" >> progress.md
  [ "$q" -eq 0 ] && [ "$x" -eq 0 ] && [ "$g" -eq 0 ] && [ "$o" -eq 0 ] && { ./gate.sh >/dev/null 2>&1; echo "$(date "+%F %T") [auto] ALL WORKERS DONE → finalize" >> progress.md; ./finalize.sh >> logs/finalize.log 2>&1; exit 0; }
  sleep 900
done
