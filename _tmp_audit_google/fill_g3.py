import json

PATH = r"C:\Users\cheng\code\github\evals\data\model-releases\official\google\gemini-3.json"
FIG = "gemini_3_table_final_HLE_Tools_on.gif"
SRC = "https://blog.google/products-and-platforms/products/gemini/gemini-3/"

def entry(eid, bench, variant, value, display, unit, metric, row, snippet, notes, tools=None, judge=None, aggregation=None, protocol_extra=None):
    return {
        "id": eid,
        "benchmark_id": bench,
        "benchmark_variant": variant,
        "vendor_id": "google",
        "release_id": "gemini-3",
        "model_id": "gemini-3-pro",
        "model_variant": None,
        "source_url": SRC,
        "source_kind": "official_release_blog",
        "source_tier": "A",
        "attribution_type": "vendor_reported",
        "evidence_type": "figure",
        "locator": {
            "heading": "Build anything",
            "table": None,
            "row": row,
            "figure": f"{FIG} — {row} row, Gemini 3 Pro column",
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
            "aggregation": aggregation,
            "judge": judge,
        },
        "comparison_scope": "only_same_protocol",
        "retrieved_at": "2026-09-01",
        "last_verified_at": "2026-09-01",
        "status": "verified",
        "archive_url": None,
        "notes": notes,
    }

V = "Verified visually 2026-09-01 by reading the archived GIF (models/2025-11-18-gemini-3/images/03.gif)"
new = [
    entry(
        "google-gemini-3--hlehle-search-code", "hlehle", "with search and code execution",
        45.8, "45.8% (with search and code execution)", "percent", None,
        "Humanity's Last Exam — With search and code execution",
        "Humanity's Last Exam: 37.5% no tools / 45.8% with search and code execution",
        "Second protocol row of the HLE pair on the launch table. " + V + ": Gemini-only row — the 2.5 Pro / Claude Sonnet 4.5 / GPT-5.1 cells are em-dash. Not comparable to the no-tools hlehle row of the same release.",
        tools=["search", "code execution"],
    ),
    entry(
        "google-gemini-3--arc-agi-pro", "arc-agi", "2 (ARC Prize Verified)",
        31.1, "31.1% (ARC Prize Verified)", "percent", None,
        "ARC-AGI-2 — ARC Prize Verified",
        "ARC-AGI-2: visual reasoning puzzles, ARC Prize Verified",
        "Maps to existing benchmark arc-agi, variant 2. " + V + ": Gemini 2.5 Pro 4.9% / Claude Sonnet 4.5 13.6% / GPT-5.1 17.6%; the Deep Think chart (final_dt_blog_evals_2.gif) additionally shows GPT-5 Pro 15.8%. Same protocol family as the Deep Think 45.1% row (code execution + ARC Prize Verified).",
        judge="ARC Prize Verified",
    ),
    entry(
        "google-gemini-3--aime-25-pro", "aime-25", "no tools",
        95.0, "95.0% (no tools)", "percent", None,
        "AIME 2025 — No tools",
        "AIME 2025: mathematics",
        V + ": Gemini 2.5 Pro 88.0% / Claude Sonnet 4.5 87.0% / GPT-5.1 94.0%. Distinct protocol from the with-code-execution row of the same release.",
    ),
    entry(
        "google-gemini-3--aime-25-pro-codeexec", "aime-25", "with code execution",
        100, "100% (with code execution)", "percent", None,
        "AIME 2025 — With code execution",
        "AIME 2025: mathematics, with code execution",
        V + ": Claude Sonnet 4.5 also 100%; Gemini 2.5 Pro and GPT-5.1 cells are em-dash. Not comparable to the no-tools row.",
        tools=["code execution"],
    ),
    entry(
        "google-gemini-3--screenspot-pro", "screenspot-pro", None,
        72.7, "72.7%", "percent", None,
        "ScreenSpot-Pro — Screen understanding",
        "ScreenSpot-Pro: screen understanding",
        "new-benchmark: screenspot-pro already in data/benchmarks/. " + V + ": Gemini 2.5 Pro 11.4% / Claude Sonnet 4.5 36.2% / GPT-5.1 3.5%.",
    ),
    entry(
        "google-gemini-3--charxiv-pro", "charxiv-reasoning", None,
        81.4, "81.4%", "percent", None,
        "CharXiv Reasoning — Information synthesis from complex charts",
        "CharXiv Reasoning: information synthesis from complex charts",
        "Maps to existing benchmark charxiv-reasoning. " + V + ": Gemini 2.5 Pro 69.6% / Claude Sonnet 4.5 68.5% / GPT-5.1 69.5%.",
    ),
    entry(
        "google-gemini-3--omnidocbench-pro", "omnidocbench", "1.5 (Overall Edit Distance, lower is better)",
        0.115, "0.115 (Overall Edit Distance, lower is better)", "edit_distance", "overall_edit_distance",
        "OmniDocBench 1.5 — OCR (Overall Edit Distance, lower is better)",
        "OmniDocBench 1.5: OCR",
        "Maps to existing benchmark omnidocbench. " + V + ": Gemini 2.5 Pro 0.145 / Claude Sonnet 4.5 0.145 / GPT-5.1 0.147. Lower is better, so higher-is-better cross-model comparisons must not be drawn against percent rows.",
    ),
    entry(
        "google-gemini-3--lcb-pro", "lcb", "Pro (Codeforces/ICPC/IOI), Elo",
        2439, "2,439 Elo (LiveCodeBench Pro)", "elo", "elo",
        "LiveCodeBench Pro — Competitive coding problems from Codeforces, ICPC, and IOI (Elo Rating, higher is better)",
        "LiveCodeBench Pro: Elo rating, higher is better",
        "LiveCodeBench Pro subset (Elo) — distinct from the v5 pass@1 windows used elsewhere; not comparable across variants. " + V + ": Gemini 2.5 Pro 1,775 / Claude Sonnet 4.5 1,418 / GPT-5.1 2,243.",
    ),
    entry(
        "google-gemini-3--tau2-bench-pro", "tau2-bench", None,
        85.4, "85.4%", "percent", None,
        "τ2-bench — Agentic tool use",
        "τ2-bench: agentic tool use",
        "Maps to existing benchmark tau2-bench. " + V + ": Gemini 2.5 Pro 54.9% / Claude Sonnet 4.5 84.7% / GPT-5.1 80.2%.",
    ),
    entry(
        "google-gemini-3--facts-suite-pro", "facts-suite", None,
        70.5, "70.5%", "percent", None,
        "FACTS Benchmark Suite — Held out internal grounding, parametric, MM, and search retrieval benchmarks",
        "FACTS Benchmark Suite: held out internal grounding, parametric, MM, and search retrieval benchmarks",
        "new-benchmark: facts-suite not yet in data/benchmarks/. Distinct from factsg (FACTS Grounding, a single grounding eval): this row is Google's internal multi-capability FACTS suite aggregate. " + V + ": Gemini 2.5 Pro 63.4% / Claude Sonnet 4.5 50.4% / GPT-5.1 50.8%.",
    ),
    entry(
        "google-gemini-3--mmmlu-pro", "mmmlu", None,
        91.8, "91.8%", "percent", None,
        "MMMLU — Multilingual Q&A",
        "MMMLU: multilingual Q&A",
        "Maps to existing benchmark mmmlu. " + V + ": Gemini 2.5 Pro 89.5% / Claude Sonnet 4.5 89.1% / GPT-5.1 91.0%.",
    ),
    entry(
        "google-gemini-3--global-piqa-pro", "global-piqa", None,
        93.4, "93.4%", "percent", None,
        "Global PIQA — Commonsense reasoning across 100 Languages and Cultures",
        "Global PIQA: commonsense reasoning across 100 languages and cultures",
        "Maps to existing benchmark global-piqa. " + V + ": Gemini 2.5 Pro 91.5% / Claude Sonnet 4.5 90.1% / GPT-5.1 90.9%.",
    ),
    entry(
        "google-gemini-3--mrcr-128k-pro", "mrcr", "v2 (8-needle), 128k (average)",
        77.0, "77.0% (v2 8-needle, 128k average)", "percent", None,
        "MRCR v2 (8-needle) — 128k (average)",
        "MRCR v2 (8-needle): long context performance, 128k average",
        V + ": Gemini 2.5 Pro 58.0% / Claude Sonnet 4.5 47.1% / GPT-5.1 61.6%. Same MRCR v2 8-needle methodology as the June 2.5 family table.",
        aggregation="cumulative score at 128k (average)",
    ),
    entry(
        "google-gemini-3--mrcr-1m-pro", "mrcr", "v2 (8-needle), 1M (pointwise)",
        26.3, "26.3% (v2 8-needle, 1M pointwise)", "percent", None,
        "MRCR v2 (8-needle) — 1M (pointwise)",
        "MRCR v2 (8-needle): long context performance, 1M pointwise",
        V + ": Gemini 2.5 Pro 16.4%; Claude Sonnet 4.5 and GPT-5.1 cells read \"not supported\" in the GIF. Separate row from the 128k average because the aggregation differs.",
        aggregation="pointwise value at 1M context",
    ),
]

raw = open(PATH, encoding="utf-8").read()
d = json.loads(raw)
existing_ids = {e["id"] for e in d["benchmark_evidence"]}
for e in new:
    assert e["id"] not in existing_ids, e["id"]

anchor = '''      "notes": "Maps to existing benchmark arc-agi, variant 2. Comparability-critical: code execution enabled and ARC Prize Verified validation; not comparable to tool-free ARC-AGI-2 rows."
    }
  ],'''
assert anchor in raw

blocks = []
for e in new:
    s = json.dumps(e, ensure_ascii=False, indent=2)
    s = "\n".join("    " + line if line else line for line in s.splitlines())
    blocks.append(s)
insert = ",\n" + ",\n".join(b + "," for b in blocks[:-1]).rstrip(",") + ",\n" + blocks[-1] + "\n    }\n  ],"
# simpler: build explicitly
parts = []
for i, e in enumerate(new):
    s = json.dumps(e, ensure_ascii=False, indent=2)
    s = "\n".join("    " + line if line else line for line in s.splitlines())
    parts.append("    {\n" + s[6:] )
# fallback: manual rebuild below
out_entries = []
for e in new:
    s = json.dumps(e, ensure_ascii=False, indent=2)
    lines = s.splitlines()
    lines[0] = "    {"
    out_entries.append("\n".join(lines))
insert_text = ",\n" + ",\n".join(out_entries) + "\n  ],"
raw2 = raw.replace(anchor, anchor[:-len("    }\n  ],")] + "    },\n" + ",\n".join(out_entries) + "\n  ],")

json.loads(raw2)  # sanity parse
open(PATH, "w", encoding="utf-8", newline="\n").write(raw2)
print("inserted", len(new), "entries; file now", len(raw2), "bytes")
