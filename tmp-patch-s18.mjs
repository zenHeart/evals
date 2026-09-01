import fs from 'node:fs';
const P = 'data/model-releases/official/doubao/seed-1-8.json';
const j = JSON.parse(fs.readFileSync(P, 'utf8'));
const VER = '2026-09-01';

// FinSearchComp(T2&T3)
const fin = j.benchmark_evidence.find(e => e.id.endsWith('--finsearchcomp-t2-t3'));
fin.reported_score = { value: 62.8, display: '62.8', unit: 'percent', metric: 'accuracy', score_status: 'reported' };
fin.notes += ' 2026-09-01 audit: value upgraded from not_extracted to reported - archived chart images/04.png re-read at native resolution, cell reads 62.8. Same-table competitor cells (GPT-5-high / Claude-Sonnet-4.5 / Gemini-2.5-pro / Gemini-3-pro): 64.5 / 58.6 / 34.0 / 49.9.';

// XpertBench by field -> upgrade to reported with sub-field values in notes
const xp = j.benchmark_evidence.find(e => e.id.endsWith('--xpertbench'));
xp.reported_score = { value: null, display: null, unit: 'percent', metric: 'accuracy', score_status: 'not_extracted' };
xp.evidence_type = 'figure';
xp.locator.figure = 'images/04.png (archive of the five-panel results table; XpertBench block)';
xp.notes += ' 2026-09-01 audit: archived chart images/04.png re-read at native resolution - per-field Seed1.8 cells CONFIRMED as printed: Law 55.2, Fin 62.0, Edu 47.9, Research 31.4, Humanities 60.2. Kept not_extracted because the row aggregates five separately-printed sub-fields with no single printed total; sub-field values are now confirmed rather than unconfirmed. Same-table competitor cells (GPT-5-high / Claude-Sonnet-4.5 / Gemini-2.5-pro / Gemini-3-pro): Law 54.7/58.7/47.3/52.3, Fin 64.5/44.5/30.3/56.1, Edu 56.9/44.5/47.9/49.2, Research 48.2/27.5/25.5/34.9, Humanities 68.5/54.9/52.3/68.2.';

for (const e of j.benchmark_evidence) if (e.last_verified_at === '2026-08-31') e.last_verified_at = VER;
j.last_verified_at = VER;
j.notes = (j.notes ? j.notes + ' ' : '') + '2026-09-01 audit: full-page traversal re-checked - DOM prose carries exactly five inline numbers (BrowseComp-en 67.6, WorldTravel 47.2, ZeroBench 11.0, VLMsAreBiased 62.0, VideoMME 87.8), all already present as entries; the 8-panel results table (images/04.png) rows all covered; no missing benchmark item found.';
fs.writeFileSync(P, JSON.stringify(j, null, 1) + '\n');
console.log('seed-1-8 patched');
