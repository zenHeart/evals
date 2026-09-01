import fs from 'node:fs';
const P = 'data/model-releases/official/minimax/minimax-m2-7.json';
const j = JSON.parse(fs.readFileSync(P, 'utf8'));
const SRC = 'https://www.minimax.io/news/minimax-m27-en';
const RET = '2026-08-31', VER = '2026-09-01';
const ev = j.benchmark_evidence;

const mk = (suffix, benchmark_id, variant, row, fig, value, display, metric, notes, quote) => ({
  id: `minimax-minimax-m2-7--${suffix}`, benchmark_id, benchmark_variant: variant, vendor_id: 'minimax', release_id: 'minimax-m2-7', model_id: 'minimax-m2-7', model_variant: null,
  source_url: SRC, source_kind: 'official_release_blog', source_tier: 'A', attribution_type: 'vendor_reported', evidence_type: 'prose',
  locator: { heading: 'OpenClaw / MM Claw', table: null, row, figure: fig, page: null, quote_snippet: quote },
  reported_score: { value, display, unit: 'percent', metric, score_status: 'reported' },
  protocol: { harness: null, tools: null, shots: null, reasoning_effort: null, temperature: null, top_p: null, token_budget: null, turn_limit: null, time_limit: null, run_count: null, aggregation: null, judge: null },
  comparison_scope: 'only_same_protocol', retrieved_at: RET, last_verified_at: VER, status: 'verified', archive_url: null, notes,
});

const add = [];
add.push(mk('mm-claw-accuracy', 'mm-claw', 'MM-ClawBench', 'MM-ClawBench', 'images/20.jpg (MM-ClawBench panel)', 62.7, '62.7%', 'accuracy',
  'MM Claw accuracy claim ("level close to Sonnet 4.6"). Chart read (vision, 2026-09-01): M2.7 62.7 vs M2.5 57.6 / Gemini 3.1 Pro 61.8 / Sonnet 4.6 64.2 / Opus 4.6 75.4 / GPT 5.4 73.6. Distinct from the 97% skill-adherence entry (40 complex skills).', 'M2.7 achieved a level close to Sonnet 4.6 on this test, with an accuracy of 62.7%'));

// Artificial Analysis panel (chart-only)
add.push({
  id: 'minimax-minimax-m2-7--aa-intelligence-index', benchmark_id: 'aa-intelligence-index', benchmark_variant: 'Artificial Analysis panel (chart)', vendor_id: 'minimax', release_id: 'minimax-m2-7', model_id: 'minimax-m2-7', model_variant: null,
  source_url: SRC, source_kind: 'official_release_blog', source_tier: 'A', attribution_type: 'vendor_reported', evidence_type: 'figure',
  locator: { heading: 'Closing benchmark panel', table: null, row: 'Artificial Analysis', figure: 'images/20.jpg (Artificial Analysis panel)', page: null, quote_snippet: null },
  reported_score: { value: 50, display: '50', unit: 'points', metric: 'intelligence_index', score_status: 'reported' },
  protocol: { harness: null, tools: null, shots: null, reasoning_effort: null, temperature: null, top_p: null, token_budget: null, turn_limit: null, time_limit: null, run_count: null, aggregation: 'Artificial Analysis aggregate (integer scale in chart)', judge: null },
  comparison_scope: 'only_same_protocol', retrieved_at: RET, last_verified_at: VER, status: 'verified', archive_url: null,
  notes: 'Chart-only value (vision read, 2026-09-01): M2.7 50 vs M2.5 42 / Gemini 3.1 Pro 57 / Sonnet 4.6 52 / Opus 4.6 53 / GPT 5.4 57. No prose claim about AA on the M2.7 page.',
});

// gdpval-aa: append chart percent-form reading to notes
const gdp = ev.find(e => e.id.endsWith('--gdpval-aa'));
if (gdp) {
  gdp.locator.figure = 'images/20.jpg (GDPval-AA panel)';
  gdp.notes = (gdp.notes || '') + ' Chart panel (vision, 2026-09-01) prints the same comparison in percent-style bars: M2.7 50 / M2.5 35 / Gemini 3.1 Pro 41 / Sonnet 4.6 57 / Opus 4.6 55 / GPT 5.4 58 - ranking matches the prose (above M2.7: Opus 4.6, Sonnet 4.6, GPT-5.4). ELO 1495 from prose stays the primary record.';
}
for (const e of ev) { if (e.last_verified_at === '2026-08-31') e.last_verified_at = VER; }
j.benchmark_evidence = [...ev, ...add];
j.last_verified_at = VER;
j.notes = (j.notes ? j.notes + ' ' : '') + '2026-09-01 audit: all 8 chart panels of images/20.jpg cross-checked against prose; +2 rows (MM-ClawBench accuracy 62.7, Artificial Analysis 50).';
fs.writeFileSync(P, JSON.stringify(j, null, 1) + '\n');
console.log('m2-7 patched:', ev.length, '->', j.benchmark_evidence.length);
