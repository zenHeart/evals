import json

PATH = r"C:\Users\cheng\code\github\evals\data\model-releases\official\google\gemini-3-7-flash.json"
FIG = "gemini-3-7-flash__evals__benchma.width-1200.format-webp.webp"
SRC = "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/"


def entry(eid, bench, variant, value, display, unit, metric, row, snippet, notes, attribution="vendor_reported"):
    return {
        "id": eid,
        "benchmark_id": bench,
        "benchmark_variant": variant,
        "vendor_id": "google",
        "release_id": "gemini-3-7-flash",
        "model_id": "gemini-3-7-flash",
        "model_variant": None,
        "source_url": SRC,
        "source_kind": "official_release_blog",
        "source_tier": "A",
        "attribution_type": attribution,
        "evidence_type": "figure",
        "locator": {
            "heading": "Benchmark table",
            "table": None,
            "row": row,
            "figure": FIG + " — " + row + " row, Gemini 3.7 Flash column",
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
            "tools": None,
            "shots": None,
            "reasoning_effort": None,
            "temperature": None,
            "top_p": None,
            "token_budget": None,
            "turn_limit": None,
            "run_count": None,
            "aggregation": None,
            "judge": None,
        },
        "comparison_scope": "only_same_protocol",
        "retrieved_at": "2026-09-01",
        "last_verified_at": "2026-09-01",
        "status": "verified",
        "archive_url": None,
        "notes": notes,
    }


V = "Verified visually 2026-09-01 by reading the archived table image (models/2026-08-13-gemini-3-7-flash/images/17.webp)"
new = [
    entry(
        "google-gemini-3-7-flash--aa-intelligence-index", "aa-intelligence-index", None,
        56, "56 (composite model intelligence)", "index", None,
        "Artificial Analysis Intelligence Index — Composite model intelligence",
        "Artificial Analysis Intelligence Index: composite model intelligence",
        "Third-party index (Artificial Analysis) republished on Google's release page: attribution third_party_reported. " + V + ": Gemini 3.6 Flash 52 / Claude Sonnet 5 55 / GPT-5.6 Terra 57 / Muse Spark 1.2 57 (tied best in row).",
        attribution="third_party_reported",
    ),
    entry(
        "google-gemini-3-7-flash--terminalbench-21", "terminalbench", "2.1",
        85.8, "85.8% (Terminal-bench 2.1)", "percent", None,
        "Terminal-bench 2.1 — Agentic terminal coding",
        "Terminal-bench 2.1: agentic terminal coding",
        V + ": Gemini 3.6 Flash 78.0% / Claude Sonnet 5 80.4% / GPT-5.6 Terra 87.4% (best in row) / Muse Spark 1.2 82.9%.",
    ),
    entry(
        "google-gemini-3-7-flash--terminalbench-30", "terminalbench", "3.0",
        14.9, "14.9% (Terminal-bench 3.0)", "percent", None,
        "Terminal-bench 3.0 — General agent capabilities",
        "Terminal-bench 3.0: general agent capabilities",
        V + ": Gemini 3.6 Flash 5.4% / Claude Sonnet 5 14.6% / GPT-5.6 Terra 20.8% (best in row); Muse Spark 1.2 em-dash. Distinct benchmark generation from Terminal-bench 2.1 — not comparable.",
    ),
    entry(
        "google-gemini-3-7-flash--gdpval-aa-v2", "gdpval-aa", "v2",
        1525, "1525 Elo (GDPval-AA v2)", "elo", "elo",
        "GDPval-AA v2 — Knowledge work (Elo)",
        "GDPval-AA v2: knowledge work, Elo",
        V + ": Gemini 3.6 Flash 1422 / Claude Sonnet 5 1598 / GPT-5.6 Terra 1578 / Muse Spark 1.2 1628 (best in row).",
    ),
    entry(
        "google-gemini-3-7-flash--harvey-lab-aa", "harvey-lab", "LAB-AA",
        90.7, "90.7%", "percent", None,
        "Harvey LAB-AA — Complex legal workflows",
        "Harvey LAB-AA: complex legal workflows",
        V + ": Gemini 3.6 Flash 85.1% / Claude Sonnet 5 90.1% / GPT-5.6 Terra 85.2%; Muse Spark 1.2 em-dash. Gemini 3.7 Flash best in row.",
    ),
    entry(
        "google-gemini-3-7-flash--charxiv-no-tools", "charxiv-reasoning", "no tools",
        84.5, "84.5% (no tools)", "percent", None,
        "CharXiv Reasoning — Information synthesis from complex charts, no tools",
        "CharXiv Reasoning: no tools",
        V + ": Gemini 3.6 Flash 85.2% / Claude Sonnet 5 77.0% / GPT-5.6 Terra 85.9% (best in row); Muse Spark 1.2 em-dash.",
    ),
    entry(
        "google-gemini-3-7-flash--charxiv-with-tools", "charxiv-reasoning", "with tools",
        88.7, "88.7% (with tools)", "percent", None,
        "CharXiv Reasoning — Information synthesis from complex charts, with tools",
        "CharXiv Reasoning: with tools",
        V + ": Gemini 3.6 Flash 89.4% (best in row) / Claude Sonnet 5 88.3%; GPT-5.6 Terra and Muse Spark 1.2 em-dash. Distinct tool condition from the no-tools row — not comparable.",
        tools=["chart tools"],
    ),
    entry(
        "google-gemini-3-7-flash--lvbench", "lvbench", None,
        85.4, "85.4%", "percent", None,
        "LVBench — Long video understanding",
        "LVBench: long video understanding",
        V + ": Gemini 3.6 Flash 84.2% / Claude Sonnet 5 68.5% / GPT-5.6 Terra 78.9%; Muse Spark 1.2 em-dash. Gemini 3.7 Flash best in row.",
    ),
    entry(
        "google-gemini-3-7-flash--mrcr-128k", "mrcr", "v2 (8-needle), 128k (average)",
        97.0, "97.0% (v2 8-needle, 128k average)", "percent", None,
        "GDM-MRCR v2 (8-needle) — 128k (average)",
        "GDM-MRCR v2 (8-needle): long context performance, 128k average",
        V + ": Gemini 3.6 Flash 91.8% / Claude Sonnet 5 81.5% / GPT-5.6 Terra 93.5%; Muse Spark 1.2 em-dash. Gemini 3.7 Flash best in row.",
    ),
    entry(
        "google-gemini-3-7-flash--osworld-20", "osworld", "2.0",
        47.9, "47.9% (OSWorld-2.0)", "percent", None,
        "OSWorld-2.0 — Agentic computer use",
        "OSWorld-2.0: agentic computer use",
        V + ": Gemini 3.6 Flash 33.8% / GPT-5.6 Terra 50.2% (best in row); Claude Sonnet 5 and Muse Spark 1.2 em-dash. Distinct from OSWorld-Verified lane used by earlier releases.",
    ),
    entry(
        "google-gemini-3-7-flash--agents-last-exam", "agents-last-exam", "pass rate",
        26.3, "26.3% (pass rate)", "percent", "pass_rate",
        "Agent's Last Exam — Multimodal desktop and OS agent tasks, pass rate",
        "Agent's Last Exam: multimodal desktop/OS agent tasks",
        V + ": Gemini 3.6 Flash 24.2% / Claude Sonnet 5 33.3% (best in row) / GPT-5.6 Terra 28.0%; Muse Spark 1.2 em-dash.",
    ),
    entry(
        "google-gemini-3-7-flash--hlehle-verified", "hlehle", "Verified",
        53.6, "53.6% (HLE-Verified)", "percent", None,
        "HLE-Verified — Multidisciplinary expert reasoning",
        "HLE-Verified: multidisciplinary expert reasoning",
        V + ": Gemini 3.6 Flash 51.2% / Claude Sonnet 5 31.0% / GPT-5.6 Terra 51.1%; Muse Spark 1.2 em-dash. Gemini 3.7 Flash best in row. Distinct lane from the full-set HLE rows of earlier releases (Verified harness).",
    ),
    entry(
        "google-gemini-3-7-flash--biomystery-solvable", "biomysterybench", "human solvable",
        87.1, "87.1% (human solvable)", "percent", None,
        "BioMysteryBench — Bioinformatics research reasoning, human solvable",
        "BioMysteryBench: human solvable split",
        V + ": Gemini 3.6 Flash 80.6% / Claude Sonnet 5 87.5% (best in row) / GPT-5.6 Terra 83.8%; Muse Spark 1.2 em-dash.",
    ),
    entry(
        "google-gemini-3-7-flash--biomystery-difficult", "biomysterybench", "human difficult",
        43.5, "43.5% (human difficult)", "percent", None,
        "BioMysteryBench — Bioinformatics research reasoning, human difficult",
        "BioMysteryBench: human difficult split",
        V + ": Gemini 3.6 Flash 41.2% / Claude Sonnet 5 34.1% / GPT-5.6 Terra 49.4% (best in row); Muse Spark 1.2 em-dash. Distinct split from the human-solvable row.",
    ),
    entry(
        "google-gemini-3-7-flash--labbench2", "labbench2", None,
        82.1, "82.1%", "percent", None,
        "LABBench2 — Biology real-world research tasks",
        "LABBench2: biology real-world research tasks",
        "new-benchmark: labbench2 not yet in data/benchmarks/. " + V + ": Gemini 3.6 Flash 76.1% / Claude Sonnet 5 80.1% / GPT-5.6 Terra 81.2%; Muse Spark 1.2 em-dash. Gemini 3.7 Flash best in row.",
    ),
]

raw = open(PATH, encoding="utf-8").read()
d = json.loads(raw)
existing_ids = {e["id"] for e in d["benchmark_evidence"]}
for e in new:
    assert e["id"] not in existing_ids, e["id"]

last = d["benchmark_evidence"][-1]
import re
m = re.search(r'"notes": "([^"]*)"\n    \}\n  \],', raw)
assert m, "array tail not found"
notes_line = '"notes": "' + m.group(1) + '"'
anchor = notes_line + "\n    }\n  ],"
assert anchor in raw, "anchor mismatch"

out_entries = []
for e in new:
    s = json.dumps(e, ensure_ascii=False, indent=2)
    lines = s.splitlines()
    reind = ["    {"]
    for l in lines[1:]:
        reind.append("    " + l if l else l)
    out_entries.append("\n".join(reind))

replacement = notes_line + "\n    },\n" + ",\n".join(out_entries) + "\n  ],"
newraw = raw.replace(anchor, replacement)
json.loads(newraw)
open(PATH, "w", encoding="utf-8", newline="\n").write(newraw)
print("inserted", len(new), "entries; file now", len(newraw), "bytes")
