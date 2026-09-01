import fs from 'node:fs';
const P = 'data/model-releases/official/doubao/seed-1-6.json';
const j = JSON.parse(fs.readFileSync(P, 'utf8'));
const SRC = 'https://seed.bytedance.com/en/seed1_6';
const RET = '2026-08-31', VER = '2026-09-01';

// rows transcribed from archive images/05.jpg (Seed1.6 Base LLM eval table), vision-read 2026-09-01
const rows = [
  ['mmlu', 'MMLU', 88.83, 'General Knowledge & Reasoning'],
  ['mmlu-pro', 'MMLU-Pro', 69.98, 'General Knowledge & Reasoning'],
  ['supergpqa', 'SuperGPQA', 45.08, 'General Knowledge & Reasoning'],
  ['bbh', 'BBH', 92.08, 'General Knowledge & Reasoning'],
  ['gpqa-diamond', 'GPQA-Diamond', 43.43, 'STEM & Math & Coding'],
  ['gsm8k', 'GSM8k', 93.10, 'STEM & Math & Coding'],
  ['math', 'MATH', 72.86, 'STEM & Math & Coding'],
  ['mbpp', 'MBPP', 83.60, 'STEM & Math & Coding'],
];

const ev = rows.map(([sfx, row, v, group]) => ({
  id: `doubao-seed-1-6--${sfx}`,
  benchmark_id: sfx === 'gpqa-diamond' ? 'gpqa' : sfx,
  benchmark_variant: sfx === 'gpqa-diamond' ? 'Diamond' : null,
  vendor_id: 'doubao', release_id: 'seed-1-6', model_id: 'seed-1-6', model_variant: 'Base',
  source_url: SRC, source_kind: 'official_model_page', source_tier: 'A',
  attribution_type: 'vendor_reported', evidence_type: 'figure',
  locator: {
    heading: 'LLM evaluation table (rendered non-DOM component)',
    table: 'Seed1.6 Base table (groups: General Knowledge & Reasoning / STEM & Math & Coding)',
    row, figure: 'images/05.jpg (native-resolution crop re-read 2026-09-01)',
    page: null, quote_snippet: null,
  },
  reported_score: { value: v, display: v.toFixed(2), unit: 'percent', metric: 'accuracy', score_status: 'reported' },
  protocol: { harness: null, tools: null, shots: null, reasoning_effort: null, temperature: null, top_p: null, token_budget: null, turn_limit: null, time_limit: null, run_count: null, aggregation: null, judge: null },
  comparison_scope: 'only_same_protocol',
  retrieved_at: RET, last_verified_at: VER, status: 'verified', archive_url: null,
  notes: `${group} group. Table columns: Seed1.6 Base / LLaMA-4-Maverick Base / DeepSeek-V3 Base / Qwen3-235B-A22B Base / Seed1.5 Base. Page states external-model columns are sourced from the Qwen Technical Report (second-hand comparison). Same-table competitor cells (LLaMA-4-Maverick / DSV3 / Qwen3-235B / Seed1.5): ${ { mmlu: '85.16/87.19/87.81/88.35', 'mmlu-pro': '63.91/59.84/68.18/66.47', supergpqa: '40.85/41.53/44.06/36.81', bbh: '83.62/86.22/88.87/88.36', 'gpqa-diamond': '43.94/41.92/47.47/45.25', gsm8k: '87.72/87.57/94.39/89.99', math: '63.32/62.62/71.84/66.18', mbpp: '75.40/74.20/81.40/81.40' }[sfx] }. Vision read at native resolution.`,
}));

j.benchmark_evidence = ev;
j.status = 'verified';
j.last_verified_at = VER;
j.notes = (j.notes ? j.notes + ' ' : '') + '2026-09-01 audit UPGRADE: the previously non-DOM evaluation table was captured by the archiver as images/05.jpg; all 8 rows of the Seed1.6 Base column transcribed (MMLU 88.83, MMLU-Pro 69.98, SuperGPQA 45.08, BBH 92.08, GPQA-Diamond 43.43, GSM8k 93.10, MATH 72.86, MBPP 83.60) with model_variant=Base. Images 03.png/04.jpg are decorative hero art; 02.png is the page banner - no other numeric content on the page. The instruct/multimodal Seed1.6 flagship itself still has no published numeric scores on this page; qualitative claims stand as noted above.';
fs.writeFileSync(P, JSON.stringify(j, null, 1) + '\n');
console.log('seed-1-6 rows:', ev.length);
