import fs from 'node:fs';
const P = 'data/model-releases/official/minimax/minimax-m2-5.json';
const j = JSON.parse(fs.readFileSync(P, 'utf8'));
const SRC = 'https://www.minimax.io/news/minimax-m25';
const RET = '2026-08-31', VER = '2026-09-01';
const ev = j.benchmark_evidence;
const find = id => ev.find(e => e.id.endsWith('--' + id));

// --- upgrade vibe-pro (was null, "chart image only")
const vibe = find('vibe-pro');
Object.assign(vibe, {
  evidence_type: 'figure',
  locator: { heading: 'Coding / Appendix further benchmark results', table: null, row: 'VIBE-Pro (AVG)', figure: 'images/20.webp + images/28.webp (M2.5 red bar 54.2; subset panel images/44.webp)', page: null, quote_snippet: null },
  reported_score: { value: 54.2, display: '54.2', unit: 'percent', metric: 'avg_score', score_status: 'reported' },
  last_verified_at: VER, status: 'verified',
  notes: 'new-benchmark: vibe-pro (vendor-upgraded Pro version of VIBE). Value read from appendix chart (vision, 2026-09-01): M2.5 54.2 AVG vs M2.1 42.4 / Opus 4.5 55.2 / Opus 4.6 55.6 / Gemini 3 Pro 36.9. Subset panel (images/44.webp): Web 36.9, Simulation 81.4, Android 50.6, iOS 47.9 - mean of 4 subsets equals 54.2 AVG. Prose itself only claims parity with Opus 4.5.',
});

// --- upgrade rise (was null)
const rise = find('rise');
Object.assign(rise, {
  evidence_type: 'figure',
  locator: { heading: 'Search and Tool calling', table: null, row: 'RISE', figure: 'images/36.webp (M2.5 red bar 50.2)', page: null, quote_snippet: null },
  reported_score: { value: 50.2, display: '50.2', unit: 'percent', metric: 'accuracy', score_status: 'reported' },
  last_verified_at: VER, status: 'verified',
  notes: 'new-benchmark: rise (MiniMax-built realistic interactive search evaluation over professional human-expert tasks) not yet in data/benchmarks/. Value read from chart (vision, 2026-09-01): M2.5 50.2 vs M2.1 34 / Opus 4.5 50.5 / Opus 4.6 62.5 / Gemini 3 Pro 36.8 / GPT-5.2 50. Round-efficiency claim: ~20% fewer rounds than M2.1 across BrowseComp/Wide Search/RISE.',
});

// --- new entries
const mk = (suffix, benchmark_id, variant, row, fig, value, display, metric, notes) => ({
  id: `minimax-minimax-m2-5--${suffix}`, benchmark_id, benchmark_variant: variant, vendor_id: 'minimax', release_id: 'minimax-m2-5', model_id: 'minimax-m2-5', model_variant: null,
  source_url: SRC, source_kind: 'official_release_blog', source_tier: 'A', attribution_type: 'vendor_reported', evidence_type: 'figure',
  locator: { heading: 'Coding / Appendix further benchmark results', table: null, row, figure: fig, page: null, quote_snippet: null },
  reported_score: { value, display, unit: 'percent', metric, score_status: 'reported' },
  protocol: { harness: 'Claude Code (internal infrastructure, default system prompt overridden)', tools: null, shots: null, reasoning_effort: null, temperature: null, top_p: null, token_budget: null, turn_limit: null, time_limit: null, run_count: '4 runs averaged', aggregation: null, judge: null },
  comparison_scope: 'only_same_protocol', retrieved_at: RET, last_verified_at: VER, status: 'verified', archive_url: null, notes,
});

const add = [];
add.push(mk('swebench-pro', 'swebench-pro', 'Pro (2025-09)', 'SWE-Bench Pro', 'images/20.webp + images/28.webp', 55.4, '55.4', 'resolved_rate', 'Chart row read (vision, 2026-09-01): M2.5 55.4 vs M2.1 49.7 / Opus 4.5 56.9 / Opus 4.6 55.4 / Gemini 3 Pro 54.1 / GPT-5.2 55.6.'));
add.push(mk('swebench-multilingual', 'swebench-multilingual', 'v1', 'SWE-Bench Multilingual', 'images/28.webp', 74.1, '74.1', 'resolved_rate', 'Chart row read (vision, 2026-09-01): M2.5 74.1 vs M2.1 71.9 / Opus 4.5 77.5 / Opus 4.6 77.8 / Gemini 3 Pro 65 / GPT-5.2 72.'));
add.push(mk('terminalbench-2', 'terminalbench', '2 (Claude Code 2.0.64 scaffolding, sandbox 8-core/16GB, timeout 7200s)', 'Terminal Bench 2', 'images/28.webp', 51.7, '51.7', 'pass_rate', 'Terminal Bench 2 protocol from appendix: Claude Code 2.0.64 scaffolding, modified Dockerfiles, 4 runs averaged. Chart read (vision, 2026-09-01): M2.5 51.7 vs M2.1 47.9 / Opus 4.5 53.4 / Opus 4.6 55.1 / Gemini 3 Pro 54 / GPT-5.2 54.'));
add.push(mk('bfcl-multi-turn', 'bfcl', 'multi-turn', 'BFCL multi-turn', 'images/20.webp + images/36.webp', 76.8, '76.8', 'accuracy', 'Chart row read (vision, 2026-09-01): M2.5 76.8 vs M2.1 37.4 / Opus 4.5 68 / Opus 4.6 63.3 / Gemini 3 Pro 61.'));
add.push(mk('tau2-telecom', 'tau2-bench', 'Telecom', 'tau2 Telecom', 'images/36.webp', 97.8, '97.8', 'accuracy', 'Chart row read (vision, 2026-09-01): M2.5 97.8 vs M2.1 87 / Opus 4.5 98.2 / Opus 4.6 99.3 / Gemini 3 Pro 98 / GPT-5.2 98.7.'));
add.push(mk('widesearch', 'widesearch', null, 'Wide Search', 'images/36.webp', 70.3, '70.3', 'accuracy', 'Chart row read (vision, 2026-09-01): M2.5 70.3 vs M2.1 63.2 / Opus 4.5 76.2 / Opus 4.6 79.4 / Gemini 3 Pro 57.'));
add.push(mk('mewc', 'mewc', '179 problems, Excel esports 2021-2026', 'MEWC', 'images/20.webp + images/52.webp', 74.4, '74.4', 'score', 'new-benchmark: mewc (MEWC, Microsoft Excel World Championship; 179 problems from main + regional divisions 2021-2026, MiniMax internal) not yet in data/benchmarks/. Chart read (vision, 2026-09-01): M2.5 74.4 vs M2.1 55.6 / Opus 4.5 82.1 / Opus 4.6 89.8 / Gemini 3 Pro 78.7 / GPT-5.2 41.3.'));
add.push(mk('finance-modeling', 'finance-modeling', 'expert rubric, end-to-end research + Excel', 'Finance Modeling', 'images/52.webp', 21.6, '21.6', 'score', 'new-benchmark: finance-modeling (MiniMax internal, expert-built financial modeling rubric, 3 runs averaged) not yet in data/benchmarks/. Chart read (vision, 2026-09-01): M2.5 21.6 vs M2.1 17.3 / Opus 4.5 30.1 / Opus 4.6 33.2 / Gemini 3 Pro 15 / GPT-5.2 20.'));

// AA sub-table (image 84)
const aak = (suffix, benchmark_id, variant, row, value, notes) => mk(suffix, benchmark_id, variant, row, 'images/84.webp (AA Intelligence Index sub-table)', value, String(value), 'accuracy', notes + ' Internal testing per public AA Intelligence Index evaluation methods (appendix). Table read (vision, 2026-09-01); competitors in same table: M2.1 / Claude Sonnet 4.5 / Opus 4.5 / Opus 4.6 / Gemini 3 Pro / GPT-5.2 (thinking).');
add.push(aak('aime-25', 'aime-25', 'AIME25', 'AIME25', 86.3, 'AIME25 row: M2.5 86.3 vs M2.1 83.0 / Sonnet 4.5 88.0 / Opus 4.5 91.0 / Opus 4.6 95.6 / Gemini 3 Pro 96.0 / GPT-5.2 98.0.'));
add.push(aak('gpqa-diamond', 'gpqa', 'GPQA-D', 'GPQA-D', 85.2, 'GPQA-D row: M2.5 85.2 vs M2.1 83.0 / Sonnet 4.5 83.0 / Opus 4.5 87.0 / Opus 4.6 90.0 / Gemini 3 Pro 91.0 / GPT-5.2 90.0.'));
add.push(aak('hle-wo-tools', 'hlehle', 'w/o tools', 'HLE w/o tools', 19.4, 'HLE w/o tools row: M2.5 19.4 vs M2.1 22.2 / Sonnet 4.5 17.3 / Opus 4.5 28.4 / Opus 4.6 30.7 / Gemini 3 Pro 37.2 / GPT-5.2 31.4.'));
add.push(aak('scicode', 'scicode', null, 'SciCode', 44.4, 'SciCode row: M2.5 44.4 vs M2.1 41.0 / Sonnet 4.5 45.0 / Opus 4.5 50.0 / Opus 4.6 52.0 / Gemini 3 Pro 56.0 / GPT-5.2 52.0.'));
add.push(aak('ifbench', 'ifbench', null, 'IFBench', 70.0, 'IFBench row: M2.5 70.0 vs M2.1 70.0 / Sonnet 4.5 57.0 / Opus 4.5 58.0 / Opus 4.6 53.0 / Gemini 3 Pro 70.0 / GPT-5.2 75.0.'));
add.push(aak('aa-lcr', 'aa-lcr', null, 'AA-LCR', 69.5, 'AA-LCR row: M2.5 69.5 vs M2.1 62.0 / Sonnet 4.5 66.0 / Opus 4.5 74.0 / Opus 4.6 71.0 / Gemini 3 Pro 71.0 / GPT-5.2 73.0.'));

// refresh last_verified_at on existing entries verified this pass
for (const e of ev) { if (e.last_verified_at === '2026-08-31') e.last_verified_at = VER; }
j.benchmark_evidence = [...ev, ...add];
j.last_verified_at = VER;
j.notes = (j.notes ? j.notes + ' ' : '') + '2026-09-01 audit: vibe-pro/rise upgraded from chart reads; +14 figure rows (SWE-bench Pro/Multilingual, Terminal Bench 2, BFCL multi-turn, tau2 Telecom, Wide Search, MEWC, Finance Modeling, AIME25, GPQA-D, HLE w/o tools, SciCode, IFBench, AA-LCR) enumerated from appendix charts images/20/28/36/44/52/84.webp.';
fs.writeFileSync(P, JSON.stringify(j, null, 1) + '\n');
console.log('m2-5 patched:', ev.length, '->', j.benchmark_evidence.length, 'entries');
