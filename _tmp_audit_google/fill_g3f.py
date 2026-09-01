import json

PATH = r"C:\Users\cheng\code\github\evals\data\model-releases\official\google\gemini-3-flash.json"

raw = open(PATH, encoding="utf-8").read()
d = json.loads(raw)
existing_ids = {e["id"] for e in d["benchmark_evidence"]}

# `new` is defined by the exec'd builder section below
exec(open(r"C:\Users\cheng\code\github\evals\_tmp_audit_google\g3f_entries.py", encoding="utf-8").read())

for e in new:
    assert e["id"] not in existing_ids, e["id"]

NOTES_LINE = '"notes": "LMArena Elo named in prose as the performance axis of the Pareto claim; the Elo value itself lives only in the scatter image."'
anchor = NOTES_LINE + "\n    }\n  ],"
assert anchor in raw, "anchor not found"

out_entries = []
for e in new:
    s = json.dumps(e, ensure_ascii=False, indent=2)
    lines = s.splitlines()
    reind = ["    {"]
    for l in lines[1:]:
        reind.append("    " + l if l else l)
    out_entries.append("\n".join(reind))

replacement = NOTES_LINE + "\n    },\n" + ",\n".join(out_entries) + "\n  ],"
newraw = raw.replace(anchor, replacement)
json.loads(newraw)
open(PATH, "w", encoding="utf-8", newline="\n").write(newraw)
print("inserted", len(new), "entries; file now", len(newraw), "bytes")
