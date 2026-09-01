import json

PATH = r"C:\Users\cheng\code\github\evals\data\model-releases\official\google\gemini-3-5-flash.json"
FIG = "gemini-3-5__benchmarks__light.gif"
SRC = "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/"

NOTES_LINE = '"notes": "Reuses candidate id charxiv-reasoning (registered batch 2). The Gemini 3.6 model page later splits CharXiv into no-tools 84.2 / with-tools 84.9 for 3.5 Flash — this row\'s condition (likely no-tools) is not stated on this page."'


def entry(eid, bench, variant, value, display, unit, metric, row, snippet, notes, tools=None, judge=None):
    return {
        "id": eid,
        "benchmark_id": bench,
        "benchmark_variant": variant,
        "vendor_id": "google",
        "release_id": "gemini-3-5-flash",
        "model_id": "gemini-3-5-flash",
        "model_variant": None,
        "source_url": SRC,
        "source_kind": "official_release_blog",
        "source_tier": "A",
        "attribution_type": "vendor_reported",
        "evidence_type": "figure",
        "locator": {
            "heading": "3.5 Flash: frontier performance for agents and coding (benchmark table)",
            "table": None,
            "row": row,
            "figure": FIG + " — " + row + " row, Gemini 3.5 Flash column",
            "page": None,
            "quote_snippet": snippet,
        },
        "reported_score": {
            "value": value,
            "display": display,
            "unit": unit,
            "metric": metric,
            "score_status": "reported",
        },
        "protocol": {
            "harness": None,
            "tools": tools,
            "shots": None,
            "reasoning_effort": None,
            "temperature": None,
            "top_p": None,
            "token_budget": None,
            "turn_limit": None,
            "run_count": None,
            "aggregation": None,
            "judge": judge,
        },
        "comparison_scope": "only_same_protocol",
        "retrieved_at": "2026-09-01",
        "last_verified_at": "2026-09-01",
        "status": "verified",
        "archive_url": None,
        "notes": notes,
    }


V = "Verified visually 2026-09-01 by reading the archived GIF (models/2026-05-19-gemini-3-5-flash/images/03.gif)"
new = [
    entry(
        "google-gemini-3-5-flash--swebench-pro", "swebench-pro", "Public, single attempt",
        55.1, "55.1% (Public, single attempt)", "percent", None,
        "SWE-Bench Pro (Public) — Diverse agentic coding tasks, single attempt",
        "SWE-Bench Pro (Public): single attempt",
        V + ": Gemini 3 Flash 49.6% / Gemini 3.1 Pro 54.2% / Claude Opus 4.7 64.3% (best in row) / GPT-5.5 58.6%; Sonnet 4.6 em-dash.",
    ),
    entry(
        "google-gemini-3-5-flash--toolathlon", "toolathlon", None,
        56.5, "56.5%", "percent", None,
        "Toolathlon — Real-world general tool use",
        "Toolathlon: real-world general tool use",
        V + ": Gemini 3 Flash 49.4% / GPT-5.5 55.6%; 3.1 Pro, Sonnet 4.6 and Opus 4.7 em-dash. Gemini 3.5 Flash best in row.",
    ),
    entry(
        "google-gemini-3-5-flash--osworld", "osworld", "Verified",
        78.4, "78.4%", "percent", None,
        "OSWorld-Verified — Agentic computer use",
        "OSWorld-Verified: agentic computer use",
        V + ": Gemini 3 Flash 65.1% / Gemini 3.1 Pro 76.2% / Claude Sonnet 4.6 72.5% / Claude Opus 4.7 78.0% / GPT-5.5 78.7% (best in row).",
    ),
    entry(
        "google-gemini-3-5-flash--finance-agent", "finance-agent", "v2",
        57.9, "57.9%", "percent", None,
        "Finance Agent v2 — Financial analysis and decision-making",
        "Finance Agent v2: financial analysis and decision-making",
        V + ": Gemini 3 Flash 42.6% / Gemini 3.1 Pro 43.0% / Claude Sonnet 4.6 51.0% / Claude Opus 4.7 51.5% / GPT-5.5 51.8%. Gemini 3.5 Flash best in row.",
    ),
    entry(
        "google-gemini-3-5-flash--mmmu-pro", "mmmu", "Pro, no tools",
        83.6, "83.6% (no tools)", "percent", None,
        "MMMU-Pro — Multimodal understanding and reasoning, no tools",
        "MMMU-Pro: multimodal understanding and reasoning",
        V + ": Gemini 3 Flash 81.2% / Gemini 3.1 Pro 80.5% / Claude Sonnet 4.6 74.5% / Claude Opus 4.7 75.2% / GPT-5.5 81.2%. Gemini 3.5 Flash best in row.",
    ),
    entry(
        "google-gemini-3-5-flash--blueprint-bench-2", "blueprint-bench-2", "normalized score",
        33.6, "33.6% (normalized score)", "percent", None,
        "Blueprint-Bench 2 — Agentic spatial reasoning, normalized score",
        "Blueprint-Bench 2: agentic spatial reasoning",
        V + ": Gemini 3 Flash 0.0% / Gemini 3.1 Pro 26.5% / Claude Sonnet 4.6 6.7% / Claude Opus 4.7 24.5% / GPT-5.5 36.2% (best in row).",
    ),
    entry(
        "google-gemini-3-5-flash--mrcr-128k", "mrcr", "v2 (8-needle), 128k (average)",
        77.3, "77.3% (v2 8-needle, 128k average)", "percent", None,
        "MRCR v2 (8-needle) — 128k (average)",
        "MRCR v2 (8-needle): long context performance, 128k average",
        V + ": Gemini 3 Flash 67.2% / Gemini 3.1 Pro 84.9% / Claude Sonnet 4.6 84.9% / Claude Opus 4.7 59.3% / GPT-5.5 94.8% (best in row).",
    ),
    entry(
        "google-gemini-3-5-flash--mrcr-1m", "mrcr", "v2 (8-needle), 1M (pointwise)",
        26.6, "26.6% (v2 8-needle, 1M pointwise)", "percent", None,
        "MRCR v2 (8-needle) — 1M (pointwise)",
        "MRCR v2 (8-needle): long context performance, 1M pointwise",
        V + ": Gemini 3 Flash 22.1% / Gemini 3.1 Pro 26.3%; Sonnet 4.6, Opus 4.7 and GPT-5.5 em-dash (no 1M context). Separate row from the 128k average because the aggregation differs.",
    ),
    entry(
        "google-gemini-3-5-flash--hlehle", "hlehle", "full set (text + MM), no tools",
        40.2, "40.2% (full set, text + MM)", "percent", None,
        "Humanity's Last Exam — Academic reasoning, full set (text + MM)",
        "Humanity's Last Exam: academic reasoning, full set",
        V + ": Gemini 3 Flash 33.7% / Gemini 3.1 Pro 44.4% / Claude Sonnet 4.6 33.2% / Claude Opus 4.7 46.9% (best in row) / GPT-5.5 41.4%.",
    ),
    entry(
        "google-gemini-3-5-flash--arc-agi", "arc-agi", "2 (ARC Prize Verified)",
        72.1, "72.1%", "percent", None,
        "ARC-AGI-2 — Abstract reasoning puzzles",
        "ARC-AGI-2: abstract reasoning puzzles",
        V + ": Gemini 3 Flash 33.6% / Gemini 3.1 Pro 77.1% / Claude Sonnet 4.6 58.3% / Claude Opus 4.7 75.8% / GPT-5.5 84.6% (best in row).",
        judge="ARC Prize Verified",
    ),
]

raw = open(PATH, encoding="utf-8").read()
d = json.loads(raw)
existing_ids = {e["id"] for e in d["benchmark_evidence"]}
for e in new:
    assert e["id"] not in existing_ids, e["id"]

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
