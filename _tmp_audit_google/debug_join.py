import json, re

exec(open(r"C:\Users\cheng\code\github\evals\_tmp_audit_google\fill_g3f.py", encoding="utf-8").read().split("raw = open")[0])
raw = open(PATH, encoding="utf-8").read()
m = list(re.finditer(r"\n    \}\n  \],", raw))
anchor_span = m[-1].span()
head = raw[: anchor_span[0]]
tail = raw[anchor_span[1]]
out_entries = []
for e in new:
    s = json.dumps(e, ensure_ascii=False, indent=2)
    lines = s.splitlines()
    lines[0] = "    {"
    out_entries.append("\n".join(lines))
newraw = head.rstrip() + ",\n" + ",\n".join(out_entries) + "\n  ]," + tail
ls = newraw.splitlines()
for i in range(258, 278):
    print(i + 1, repr(ls[i]))
try:
    json.loads(newraw)
    print("PARSE OK")
except Exception as ex:
    print("PARSE FAIL:", ex)
