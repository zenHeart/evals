#!/usr/bin/env python3
"""Recover missing rollout/out/*.json from Claude Code session jsonl Write payloads."""
import json
import sys
from pathlib import Path
from datetime import datetime

R = Path("/workspace/rollout")
OUT = R / "out"
LOG = R / "logs" / "recover-out.log"
PROJECTS = Path("/home/box/.claude/projects")
OUT.mkdir(parents=True, exist_ok=True)

def log(msg: str) -> None:
    line = f"{datetime.now():%Y-%m-%d %H:%M:%S} {msg}"
    with LOG.open("a") as f:
        f.write(line + "\n")
    print(line, flush=True)

def passed_ids():
    ids = []
    for line in (R / "status.tsv").read_text().splitlines():
        parts = line.split("\t")
        if len(parts) >= 2 and parts[1] == "pass":
            ids.append(parts[0])
    return ids

def is_usable_profile(text: str, expected_id: str) -> bool:
    try:
        d = json.loads(text)
    except Exception:
        return False
    if not isinstance(d, dict):
        return False
    if d.get("id") and d.get("id") != expected_id:
        return False
    # v2-ish: has profile or is clearly larger/richer than a stub
    if "profile" in d or "official_sources" in d or "content_status" in d:
        return True
    return len(text) >= 4000

def iter_write_payloads(obj, acc, expected_name):
    if isinstance(obj, dict):
        path = obj.get("path") or obj.get("file_path") or obj.get("filePath") or obj.get("file")
        content = obj.get("content") or obj.get("contents")
        if isinstance(path, str) and expected_name in path and isinstance(content, str):
            acc.append((path, content, len(content)))
        for v in obj.values():
            iter_write_payloads(v, acc, expected_name)
    elif isinstance(obj, list):
        for v in obj:
            iter_write_payloads(v, acc, expected_name)

def recover_one(bid: str, jsonl_files: list[Path]) -> tuple[bool, str]:
    dest = OUT / f"{bid}.json"
    if dest.exists() and dest.stat().st_size >= 4000:
        return True, f"already present {dest.stat().st_size}B"
    needle = f"benchmarks/{bid}.json"
    best = None  # (len, content)
    for p in jsonl_files:
        # cheap prefilter
        try:
            # skip files that don't mention the needle at all via a byte scan in chunks
            found = False
            with p.open("rb") as f:
                chunk_prev = b""
                while True:
                    chunk = f.read(8 * 1024 * 1024)
                    if not chunk:
                        break
                    data = chunk_prev + chunk
                    if needle.encode() in data:
                        found = True
                        break
                    chunk_prev = chunk[-200:]
            if not found:
                continue
        except Exception:
            continue
        with p.open() as f:
            for line in f:
                if needle not in line:
                    continue
                try:
                    obj = json.loads(line)
                except Exception:
                    continue
                acc = []
                iter_write_payloads(obj, acc, needle)
                for path, content, n in acc:
                    if is_usable_profile(content, bid):
                        if best is None or n >= best[0]:
                            best = (n, content)
    if not best:
        return False, "no usable session write"
    dest.write_text(best[1] if best[1].endswith("\n") else best[1] + "\n")
    return True, f"recovered {best[0]}B"

def main():
    jsonl_files = sorted(PROJECTS.glob("-workspace-rollout-wt-*/**/*.jsonl"))
    log(f"start: {len(jsonl_files)} session files")
    ids = passed_ids()
    ok = skip = fail = 0
    missing = []
    for bid in ids:
        dest = OUT / f"{bid}.json"
        if dest.exists() and dest.stat().st_size >= 4000:
            skip += 1
            continue
        missing.append(bid)
    log(f"pass={len(ids)} already_in_out={skip} to_recover={len(missing)}")
    for i, bid in enumerate(missing, 1):
        try:
            success, detail = recover_one(bid, jsonl_files)
        except Exception as e:
            success, detail = False, f"error {e}"
        if success:
            ok += 1
        else:
            fail += 1
        if i % 10 == 0 or not success or i == 1:
            log(f"[{i}/{len(missing)}] {bid}: {detail}")
    log(f"done: recovered={ok} already={skip} failed={fail} out_count={len(list(OUT.glob('*.json')))}")

if __name__ == "__main__":
    main()
