#!/usr/bin/env bash
# Persistent external-task dispatcher. Starts the next eligible queue row via run-ext.sh.
# Does not launch a second copy of a running task. Does not use Grok.
set -u
Q=/workspace/ext-queue
R=/workspace/rollout
LOG=$Q/logs/dispatcher.log
PIDFILE=$Q/dispatcher.pid
POLL=${POLL:-60}

ts(){ date '+%F %T'; }
log(){ echo "$(ts) [dispatcher] $*" >> "$LOG"; }

if [ -f "$PIDFILE" ]; then
  old=$(cat "$PIDFILE" 2>/dev/null || true)
  if [ -n "${old:-}" ] && kill -0 "$old" 2>/dev/null; then
    echo "$(ts) [dispatcher] already running PID=$old" >> "$LOG"
    exit 0
  fi
fi
echo $$ > "$PIDFILE"
trap 'rm -f "$PIDFILE"; log "exit, pidfile cleared"' EXIT
log "start PID=$$ POLL=${POLL}s"

status_line(){ # file -> DONE|BLOCKED|OTHER|MISSING
  local f=$1
  [ -f "$f" ] || { echo MISSING; return; }
  local last; last=$(tail -1 "$f" 2>/dev/null || true)
  case "$last" in
    "STATUS: DONE"*) echo DONE ;;
    "STATUS: BLOCKED"*) echo BLOCKED ;;
    *) echo OTHER ;;
  esac
}

task_alive(){ # name
  local name=$1
  local pf=$Q/logs/${name}.live.pids
  if [ -f "$pf" ]; then
    local pid
    while read -r pid; do
      [ -n "${pid:-}" ] && kill -0 "$pid" 2>/dev/null && return 0
    done < "$pf"
  fi
  pgrep -f "run-ext.sh .* ${name} " >/dev/null 2>&1 && return 0
  case "$name" in
    ext-pub) pgrep -f "任务 EXT-PUB" >/dev/null 2>&1 && return 0 ;;
    ext-repair) pgrep -f "任务 EXT-REPAIR" >/dev/null 2>&1 && return 0 ;;
    ext-cal) pgrep -f "任务 EXT-CAL" >/dev/null 2>&1 && return 0 ;;
    ext-qa) pgrep -f "任务 EXT-QA" >/dev/null 2>&1 && return 0 ;;
  esac
  return 1
}

# Map queue id -> run-ext name
run_name(){
  case "$1" in
    EXT-PUB) echo ext-pub ;;
    EXT-REPAIR) echo ext-repair ;;
    EXT-CAL) echo ext-cal ;;
    EXT-QA) echo ext-qa ;;
    *) echo "$1" | tr 'A-Z' 'a-z' ;;
  esac
}

qa_ready(){
  [ -f "$R/READY_FINAL" ] || return 1
  local st; st=$(cat "$R/publisher.state" 2>/dev/null || echo unknown)
  [ "$st" = drained ] || [ "$st" = "" ]
}

update_queue_field(){ # id field value
  python3 - "$1" "$2" "$3" "$Q/queue.tsv" << 'PY'
import sys, os, tempfile
qid, field, val, path = sys.argv[1:5]
rows=open(path).read().splitlines()
hdr=rows[0].split('\t')
idx={h:i for i,h in enumerate(hdr)}
out=[rows[0]]
for line in rows[1:]:
    if not line.strip():
        continue
    p=line.split('\t')
    while len(p)<len(hdr): p.append('')
    if p[idx['id']]==qid:
        p[idx[field]]=val
    out.append('\t'.join(p))
fd, tmp=tempfile.mkstemp(dir=os.path.dirname(path) or '.', prefix='queue.tsv.')
try:
    os.write(fd, ('\n'.join(out)+'\n').encode()); os.close(fd); fd=None
    os.replace(tmp, path)
except Exception:
    if fd is not None:
        try: os.close(fd)
        except Exception: pass
    try: os.unlink(tmp)
    except Exception: pass
    raise
PY
}

launch(){
  local id=$1 prov=$2 task=$3 name=$4
  log "launch $id provider=$prov name=$name"
  update_queue_field "$id" status running
  nohup "$Q/run-ext.sh" "$prov" "$task" "$name" /workspace >> "$Q/logs/${name}.launch.out" 2>&1 &
  echo $! > "$Q/logs/${name}.dispatcher.pid"
}

mkdir -p "$Q/logs"
while true; do
  # refresh rows
  python3 - "$Q" "$R" << 'PY' >> "$LOG" 2>&1 || true
import os, sys, subprocess, time
from pathlib import Path
Q=Path(sys.argv[1]); R=Path(sys.argv[2])
# This block only used if needed; main loop stays in bash.
PY

  # Parse queue and act
  while IFS=$'\t' read -r id pr prov st retries maxr taskfile statusfile note; do
    [ "$id" = "id" ] || [ -z "${id:-}" ] && continue
    name=$(run_name "$id")
    sl=$(status_line "$statusfile")
    if [ "$st" = running ]; then
      if [ "$sl" = DONE ]; then
        update_queue_field "$id" status done
        log "$id STATUS: DONE"
        continue
      fi
      if [ "$sl" = BLOCKED ]; then
        if [ "${retries:-0}" -lt "${maxr:-3}" ]; then
          nr=$((retries+1))
          update_queue_field "$id" retries "$nr"
          log "$id BLOCKED, retry $nr/$maxr"
          launch "$id" "$prov" "$taskfile" "$name"
        else
          update_queue_field "$id" status failed
          log "$id failed after $retries retries: see $statusfile"
        fi
        continue
      fi
      # still running: if process died without status, retry
      if ! task_alive "$name" && [ "$sl" = MISSING -o "$sl" = OTHER ]; then
        if [ "${retries:-0}" -lt "${maxr:-3}" ]; then
          nr=$((retries+1))
          update_queue_field "$id" retries "$nr"
          log "$id process gone without DONE, retry $nr/$maxr"
          launch "$id" "$prov" "$taskfile" "$name"
        else
          update_queue_field "$id" status failed
          log "$id process gone, retries exhausted"
        fi
      fi
      continue
    fi
    if [ "$st" = done ] || [ "$st" = failed ]; then
      continue
    fi
    if [ "$st" = blocked ] || [ "$st" = queued ]; then
      # start only if all higher-priority rows are done
      # and conditions met
      if [ "$id" = "EXT-QA" ] && ! qa_ready; then
        [ "$st" = blocked ] || update_queue_field "$id" status blocked
        continue
      fi
      # skip if any earlier priority is not done
      earlier_pending=$(awk -F'\t' -v me="$id" -v myp="$pr" 'NR>1 && $1!=me && $2+0<myp+0 && $4!="done"{c++} END{print c+0}' "$Q/queue.tsv")
      if [ "$earlier_pending" -gt 0 ]; then
        continue
      fi
      # don't launch if already running
      if task_alive "$name"; then
        update_queue_field "$id" status running
        continue
      fi
      launch "$id" "$prov" "$taskfile" "$name"
    fi
  done < "$Q/queue.tsv"

  sleep "$POLL"
done
