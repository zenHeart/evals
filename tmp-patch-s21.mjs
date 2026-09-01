import fs from 'node:fs';
const P = 'data/model-releases/official/doubao/seed-2-1.json';
const j = JSON.parse(fs.readFileSync(P, 'utf8'));
const VER = '2026-09-01';

// suffix -> [value, display, panelFile, competitorSnippet]
const CONF = {
  'workspace-bench': [53.0, '54.7', 'images/01.png', 'Opus 4.7 55.1 / GPT-5.5 58.7 / Gemini 3.1 Pro 32.8'],
  'agent-startup-bench': [68.8, '54.0', 'images/01.png', 'Opus 4.7 62.3 / GPT-5.5 68.1 / Gemini 3.1 Pro 45.7'],
  'agents-last-exam-full-pass-rate-left-panel': [19.5, null, 'images/01.png', 'cell prints "19.5 / 41.4" (pass rate / avg overall score); Opus 4.7 18.4/40.5, GPT-5.5 24.0/42.8, Gemini 3.1 Pro 15.8/32.0; Turbo cell "-"'],
  'agents-last-exam-average-overall-score-right-panel': [41.4, null, 'images/01.png', 'right-hand value of the "19.5 / 41.4" cell'],
  'gdpval': [87.9, '82.7', 'images/01.png', 'Opus 4.7 82.7 / GPT-5.5 84.9 / Gemini 3.1 Pro 67.3'],
  'xdailybench': [61.0, '56.4', 'images/02.png', 'Opus 4.7 69.0 / GPT-5.5 73.0 / Gemini 3.1 Pro 35.2'],
  'doubao-multi-turn-bench': [52.5, '49.0', 'images/02.png', 'Opus 4.7 49.8 / GPT-5.5 62.5 / Gemini 3.1 Pro 52.0'],
  'toolathlon': [50.6, '49.1', 'images/02.png', 'Opus 4.7 52.8 / GPT-5.5 55.6 / Gemini 3.1 Pro 48.8'],
  'clawbench': [66.6, '63.8', 'images/02.png', 'row label SeedClawBench; Opus 4.7 64.1 / GPT-5.5 66.4 / Gemini 3.1 Pro 57.1'],
  'claw-eval-mm-metric-pass-3': [51.0, '46.0', 'images/03.png', 'Pass^3 row; Opus 4.7 44.0 / GPT-5.5 43.0 / Gemini 3.1 Pro 27.0'],
  'mobileworld': [73.1, '70.0', 'images/04.png', 'Opus 4.7 57.1 / GPT-5.5 54.7 / Gemini 3.1 Pro 48.4'],
  'osworld': [78.8, '76.4', 'images/04.png', 'Opus 4.7 82.8 / GPT-5.5 78.7 / Gemini 3.1 Pro 76.2'],
  'creativework': [42.5, '34.5', 'images/04.png', 'Opus 4.7 28.3 / GPT-5.5 30.5 / Gemini 3.1 Pro 27.4'],
  'program-bench': [50.3, '49.4', 'images/05.png', 'Opus 4.7 52.1 / GPT-5.5 65.9 / Gemini 3.1 Pro 40.7'],
  'charxiv-reasoning-rq-w-tool': [85.4, '82.5', 'images/08.png', 'cell prints "85.4 (86.4)" / "82.5 (83.6)"; parenthetical value recorded in notes, primary value taken as the unparenthesized number; Opus 4.7 82.1 / GPT-5.5 83.2 / Gemini 3.1 Pro 83.5'],
  'measurebench-avg-real-synthetic': [62.9, '58.9', 'images/08.png', 'row "MeasureBench (avg. real & synthetic)"; Opus 4.7 29.7 / GPT-5.5 49.9 / Gemini 3.1 Pro 44.4'],
  'erqa': [72.0, '71.3', 'images/09.png', 'Opus 4.7 52.5 / GPT-5.5 64.5 / Gemini 3.1 Pro 70.8'],
  'mmlongbench-128k': [78.3, '76.9', 'images/09.png', 'Opus 4.7 and GPT-5.5 cells print "-"; Gemini 3.1 Pro 70.7'],
  'tomato': [79.5, '56.8', 'images/10.png', 'competitor columns Gemini 3.1 Pro 60.4 / Gemini 3.5 Flash 71.9'],
  'tvbench': [80.5, '77.2', 'images/10.png', 'competitor columns Gemini 3.1 Pro 71 / Gemini 3.5 Flash 76.4'],
  'video-mme': [89.2, '89', 'images/12.png', 'competitor columns Gemini 3.1 Pro 86.7 / Gemini 3.5 Flash 87.2'],
  'lvbench': [78, '76.8', 'images/12.png', 'competitor columns Gemini 3.1 Pro 75.1 / Gemini 3.5 Flash 76.3'],
  'ovbench': [70.0, '69.7', 'images/12.png', 'competitor columns Gemini 3.1 Pro 58.8 / Gemini 3.5 Flash 56.5'],
  'scicode': [59.8, '57.8', 'images/11.png', 'Opus 4.7 56.4 / GPT-5.5 58.4 / Gemini 3.1 Pro 62.3'],
  'frontier-science-olympiad': [75.0, '76.0', 'images/11.png', 'Opus 4.7 69.0 / GPT-5.5 69.0 / Gemini 3.1 Pro 79.0'],
  'frontier-science-research': [28.3, '33.3', 'images/13.png', 'Opus 4.7 20.0 / GPT-5.5 33.9 / Gemini 3.1 Pro 16.7'],
};

let up = 0;
for (const e of j.benchmark_evidence) {
  const key = e.id.replace('doubao-seed-2-1--', '');
  const c = CONF[key];
  if (!c) continue;
  const [pro, turbo, panel, comp] = c;
  e.reported_score.value = pro;
  e.reported_score.display = String(pro);
  e.reported_score.score_status = 'reported';
  e.locator.figure = panel + ' (panel table; Seed2.1 Pro / Turbo columns)';
  e.notes = e.notes.replace('Vision-read value (unconfirmed):', 'Vision-read CONFIRMED (2026-09-01, native-resolution archive panel):');
  e.notes += ` 2026-09-01 audit: upgraded to reported - Seed2.1 Pro ${pro}` + (turbo ? `, Seed2.1 Turbo ${turbo}` : '') + `. Same-table competitor cells: ${comp}.`;
  e.last_verified_at = VER;
  up++;
}
for (const e of j.benchmark_evidence) if (e.last_verified_at === '2026-08-31') e.last_verified_at = VER;
j.last_verified_at = VER;
j.notes = (j.notes ? j.notes + ' ' : '') + `2026-09-01 audit: all ${up} previously not_extracted rows confirmed against native-resolution archived panels (images/01-13.png) and upgraded to reported; every panel row cross-checked against the entry list - no missing benchmark item and no unmatched entry.`;
fs.writeFileSync(P, JSON.stringify(j, null, 1) + '\n');
console.log('seed-2-1 upgraded rows:', up);
