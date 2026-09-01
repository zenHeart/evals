import fs from 'node:fs';

const SRC = 'https://seed.bytedance.com/en/seed2';
const RET = '2026-08-31', VER = '2026-09-01';
const NEW_IDS = new Set(['superchem','babe','researchrubrics','tob-agent','vibe-coding-human-eval','hipho','medxpertqa-mm','charxiv-descriptive','videosimpleqa','videosimpleqa-v2','scivideo','videoreasonbench','videoholmes','minerva','contphy','morse-500','video-mme-v2','videoeval-pro','odvbench','livesports-3k','vispeak','crossvid','omnivideobench','avmeme','jointavbench','worldsense','mmsu','wildspeech','wenetspeech','librispeech','fleurs']);

function mk(releaseId, modelId, suffix, bench, variant, row, tableLabel, value, display, metric, notes) {
  const nb = NEW_IDS.has(bench) ? `new-benchmark: ${bench} not yet in data/benchmarks/. ` : '';
  return {
    id: `doubao-${releaseId}--${suffix}`,
    benchmark_id: bench, benchmark_variant: variant,
    vendor_id: 'doubao', release_id: releaseId, model_id: modelId, model_variant: null,
    source_url: SRC, source_kind: 'official_model_page', source_tier: 'A',
    attribution_type: 'vendor_reported', evidence_type: 'text',
    locator: {
      heading: 'Model Performance / Evaluation Results',
      table: tableLabel, row, figure: 'images/17.png (full-page raw-scan; values are DOM text in archive page.html)',
      page: null, quote_snippet: null,
    },
    reported_score: { value, display, unit: 'percent', metric, score_status: 'reported' },
    protocol: { harness: null, tools: null, shots: null, reasoning_effort: null, temperature: null, top_p: null, token_budget: null, turn_limit: null, time_limit: null, run_count: null, aggregation: null, judge: null },
    comparison_scope: 'only_same_protocol',
    retrieved_at: RET, last_verified_at: VER, status: 'verified', archive_url: null,
    notes: nb + notes,
  };
}

// ---------------------------------------------------------------- lite (0428 column)
const LITE_TABLE1 = 'seed2 carousel table 1 (columns: Seed2.0 Lite 0428 / Lite 0215 / Pro 0215 / GPT-5.4 Mini / Gemini 3 Flash)';
const T1_COMP = 'Same-table competitors: Lite 0215 / Pro 0215 / GPT-5.4 Mini / Gemini 3 Flash.';
const t1 = [
  ['gpqa-diamond', 'gpqa', 'Diamond', 'GPQA Diamond', 88.4, 'accuracy', 'Knowledge group.'],
  ['supergpqa', 'supergpqa', null, 'SuperGPQA', 69.6, 'accuracy', 'Knowledge group.'],
  ['hle', 'hlehle', 'no tool, text only', 'HLE (no tool, text only)', 25.7, 'accuracy', 'Knowledge group.'],
  ['beyondaime', 'beyondaime', null, 'BeyondAIME', 79.0, 'accuracy', 'Reasoning group.'],
  ['frontier-science-olympiad', 'frontier-science-olympiad', null, 'FrontierSci-olympiad', 72.0, 'accuracy', 'Reasoning group.'],
  ['superchem', 'superchem', 'text-only', 'Superchem (text-only)', 55.0, 'accuracy', 'Reasoning group.'],
  ['babe', 'babe', null, 'BABE', 57.9, 'accuracy', 'Reasoning group.'],
  ['cl-bench', 'cl-bench', null, 'CL-Bench', 20.1, 'score', 'Instruction Following group.'],
  ['multichallenge', 'multichallenge', null, 'MultiChallenge', 69.9, 'score', 'Instruction Following group.'],
  ['widesearch', 'widesearch', null, 'WideSearch', 70.3, 'accuracy', 'SearchAgent group.'],
  ['browsecomp', 'browsecomp', null, 'BrowseComp', 64.0, 'accuracy', 'SearchAgent group.'],
  ['researchrubrics', 'researchrubrics', null, 'ResearchRubrics', 59.2, 'accuracy', 'SearchAgent group.'],
  ['xpertbench', 'xpertbench', null, 'XPert Bench', 56.8, 'accuracy', 'SearchAgent group.'],
  ['skillsbench', 'skillsbench', null, 'SkillsBench', 43.7, 'accuracy', 'Real World group.'],
  ['gdpval', 'gdpval', null, 'GDPval', 53.1, 'accuracy', 'Real World group.'],
  ['finsearchcomp', 'finsearchcomp', null, 'FinSearchComp', 63.8, 'accuracy', 'Real World group.'],
  ['tob-agent', 'tob-agent', null, 'Tob-Agent', 51.4, 'accuracy', 'Real World group.'],
  ['swebench-multilingual', 'swebench-multilingual', null, 'SWE Multilingual', 66.6, 'resolved_rate', 'CodingAgent group.'],
  ['swebench-pro', 'swebench-pro', null, 'SWE-Bench Pro', 46.6, 'resolved_rate', 'CodingAgent group.'],
  ['nl2repo', 'nl2repo', null, 'NL2Repo-Bench', 28.7, 'resolved_rate', 'CodingAgent group.'],
  ['paperbench', 'paperbench', null, 'PaperBench', 52.5, 'score', 'CodingAgent group.'],
  ['terminalbench-2', 'terminalbench', '2.0', 'Terminal Bench 2.0', 43.3, 'pass_rate', 'CodingAgent group.'],
  ['vibe-coding-human-eval', 'vibe-coding-human-eval', 'human evaluation', 'Vibe Coding human evaluation (page: Vibe Coding 人工评估)', 49.4, 'score', 'CodingAgent group; human evaluation row.'],
];
const T2_TABLE = 'seed2 carousel table 2 (columns: Seed2.0 Lite 0428 / Lite 0215 / Pro 0215 / GPT-5.4 High / Gemini 3 Flash / Gemini 3.1 Pro High)';
const T2_COMP = 'Same-table competitors: Lite 0215 / Pro 0215 / GPT-5.4 High / Gemini 3 Flash / Gemini 3.1 Pro High.';
const t2 = [
  ['mathvision', 'mathvision', 'STEM', 'MathVision', 89.8],
  ['mmmu-pro', 'mmmu-pro', 'STEM', 'MMMU_Pro', 78.4],
  ['hipho', 'hipho', 'STEM', 'HiPhO', 83.8],
  ['medxpertqa-mm', 'medxpertqa-mm', 'STEM', 'MedXpertQA-MM', 79.6],
  ['babyvision', 'babyvision', 'Perception', 'BabyVision', 64.7],
  ['vlmsarebiased', 'vlmsarebiased', 'Perception', 'VLMBias (repo id vlmsarebiased)', 80.6],
  ['simplevqa', 'simplevqa', 'Visual Knowledge', 'SimpleVQA', 72.7],
  ['worldvqa', 'worldvqa', 'Visual Knowledge', 'WorldVQA', 50.2],
  ['charxiv-dq', 'charxiv-descriptive', 'InfoGraphics', 'CharXiv-DQ (descriptive query)', 94.5],
  ['charxiv-rq', 'charxiv-reasoning', 'InfoGraphics', 'CharXiv-RQ (reasoning query)', 82.4],
  ['erqa', 'erqa', 'Embodied', 'ERQA', 71.5],
];
const T3_TABLE = 'seed2 carousel table 3 GUI (columns: Seed2.0 Lite 0428 / Seed1.8 / Claude Opus 4.7 / Claude Sonnet 4.6 / Claude Sonnet 4.5 / GPT-5.4 High / Gemini 3.1 Pro)';
const T3_COMP = 'Same-table competitors: Seed1.8 / Opus 4.7 / Sonnet 4.6 / Sonnet 4.5 / GPT-5.4 High / Gemini 3.1 Pro.';
const t3 = [
  ['osworld-verified', 'osworld', 'Verified', 'OSWorld-Verfied (page spelling)', 64.4, 'task_completion_rate'],
  ['mobileworld', 'mobileworld', null, 'MobileWorld', 64.6, 'task_completion_rate'],
];
const T4_TABLE = 'seed2 carousel table 4 video (columns: Seed2.0 Lite 0428 / Lite 0215 / Pro 0215 / Mini 0215 / Gemini 3 Pro High / Gemini 3 Flash High)';
const T4_COMP = 'Same-table competitors: Lite 0215 / Pro 0215 / Mini 0215 / Gemini 3 Pro High / Gemini 3 Flash High (page prints asterisks on several Gemini cells; footnote not captured in archive text).';
const t4 = [
  ['video-mmmu', 'video-mmmu', 'Video Knowledge', 'VideoMMMU', 88.3],
  ['mmvu', 'mmvu', 'Video Knowledge', 'MMVU', 76.7],
  ['videosimpleqa-v2', 'videosimpleqa-v2', 'Video Knowledge', 'VideoSimpleQA-v2', 69.0],
  ['videosimpleqa', 'videosimpleqa', 'Video Knowledge', 'VideoSimpleQA', 71.7],
  ['scivideo', 'scivideo', 'Video Knowledge', 'SciVideo', 70.3],
  ['videoreasonbench', 'videoreasonbench', 'Video Reasoning', 'VideoReasonBench', 59.4],
  ['videoholmes', 'videoholmes', 'Video Reasoning', 'VideoHolmes', 67.4],
  ['minerva', 'minerva', 'Video Reasoning', 'Minerva', 68.5],
  ['tvbench', 'tvbench', 'Motion & Perception', 'TVBench', 80.4],
  ['tomato', 'tomato', 'Motion & Perception', 'TOMATO', 72.5],
  ['egotempo', 'egotempo', 'Motion & Perception', 'EgoTempo', 68.4],
  ['motionbench', 'motionbench', 'Motion & Perception', 'MotionBench', 72.4],
  ['contphy', 'contphy', 'Motion & Perception', 'ContPhy', 62.4],
  ['morse-500', 'morse-500', 'Motion & Perception', 'Morese-500 (page spelling; Morse-500)', 34.6],
  ['video-mme', 'video-mme', 'Long Video', 'VideoMME', 89.0],
  ['video-mme-v2', 'video-mme-v2', 'Long Video', 'VideoMMEv2', 64.9],
  ['cgbench', 'cgbench', 'Long Video', 'CGBench', 65.5],
  ['longvideobench', 'longvideobench', 'Long Video', 'LongVideoBench', 79.0],
  ['lvbench', 'lvbench', 'Long Video', 'LVBench', 76.4],
  ['videoeval-pro', 'videoeval-pro', 'Long Video', 'VideoEval-Pro', 49.5],
  ['ovbench', 'ovbench', 'Streaming Video', 'OVBench', 63.2],
  ['odvbench', 'odvbench', 'Streaming Video', 'ODVBench', 66.0],
  ['livesports-3k', 'livesports-3k', 'Streaming Video', 'LiveSports-3K', 78.1],
  ['ovobench', 'ovobench', 'Streaming Video', 'OVOBench', 75.4],
  ['vispeak', 'vispeak', 'Streaming Video', 'ViSpeak', 87.0],
  ['crossvid', 'crossvid', 'Multi-video', 'CrossVid', 63.7],
  ['omnivideobench', 'omnivideobench', 'Visual-Audio Understanding', 'OmniVideoBench', 61.7],
  ['avmeme', 'avmeme', 'Visual-Audio Understanding', 'AVMeme', 69.5],
  ['jointavbench', 'jointavbench', 'Visual-Audio Understanding', 'JointAVBench', 69.5],
  ['worldsense', 'worldsense', 'Visual-Audio Understanding', 'WorldSense', 67.3],
];
const T5_TABLE = 'seed2 carousel table 5 audio (columns: Seed2.0 Lite 0428 / Gemini-3.1-Pro)';
const T5_COMP = 'Same-table competitor: Gemini-3.1-Pro. Page note: ASR rows use WER/CER, lower is better.';
const t5 = [
  ['mmsu', 'mmsu', 'Audio Understanding', 'MMSU', 86.54, 'accuracy'],
  ['wildspeech', 'wildspeech', 'Audio Understanding', 'WildSpeech', 75.81, 'accuracy'],
  ['wenetspeech-test-net', 'wenetspeech', 'ASR, WenetSpeech test-net', 'WenetSpeech test-net', 4.47, 'wer'],
  ['wenetspeech-test-meeting', 'wenetspeech', 'ASR, WenetSpeech test-meeting', 'WenetSpeech test-meeting', 5.31, 'wer'],
  ['librispeech-test-clean', 'librispeech', 'ASR, LibriSpeech test-clean', 'Librispeech test-clean', 1.07, 'wer'],
  ['librispeech-test-other', 'librispeech', 'ASR, LibriSpeech test-other', 'Librispeech test-other', 2.17, 'wer'],
  ['fleurs-15langs', 'fleurs', 'S2TT, Fleurs 15 langs (zh/en <-> xx)', 'Fleurs (15 langs)', 74.70, 'accuracy'],
];

function disp(v, pct) { return pct ? v.toFixed(1) + '%' : String(v); }

const liteEvidence = [];
for (const [sfx, bench, variant, row, v, metric, extra] of t1)
  liteEvidence.push(mk('seed-2-0-lite', 'seed-2-0-lite', sfx, bench, variant, row, LITE_TABLE1, v, disp(v, true), metric, extra + ' ' + T1_COMP));
for (const [sfx, bench, group, row, v] of t2)
  liteEvidence.push(mk('seed-2-0-lite', 'seed-2-0-lite', sfx, bench, group, row, T2_TABLE, v, String(v), 'accuracy', group + ' group. ' + T2_COMP));
for (const [sfx, bench, variant, row, v, metric] of t3)
  liteEvidence.push(mk('seed-2-0-lite', 'seed-2-0-lite', sfx, bench, variant, row, T3_TABLE, v, v.toFixed(1) + '%', metric, 'GUI group. ' + T3_COMP));
for (const [sfx, bench, group, row, v] of t4)
  liteEvidence.push(mk('seed-2-0-lite', 'seed-2-0-lite', sfx, bench, group, row, T4_TABLE, v, String(v), 'accuracy', group + ' group. ' + T4_COMP));
for (const [sfx, bench, variant, row, v, metric] of t5)
  liteEvidence.push(mk('seed-2-0-lite', 'seed-2-0-lite', sfx, bench, variant, row, T5_TABLE, v, String(v), metric, (metric === 'wer' ? 'WER/CER row, lower is better. ' : 'Audio group. ') + T5_COMP));

const lite = JSON.parse(fs.readFileSync('data/model-releases/official/doubao/seed-2-0-lite.json', 'utf8'));
lite.release_title = 'Seed 2.0-Lite (official Seed2 series model page, Lite 0428 column)';
lite.models = [{ id: 'seed-2-0-lite', name: 'Seed 2.0-Lite', variant: 'lite tier of the Seed 2.0 generation; omni-modal (video/image/audio/text) after the late-April upgrade; page column Seed2.0 Lite (0428)' }];
lite.status = 'verified';
lite.last_verified_at = VER;
lite.notes = 'Upgrade of the 2026-08-31 placeholder: the shared official Seed2 series page (seed.bytedance.com/en/seed2) carries five "Evaluation Results" carousel tables whose DOM text is machine-readable in the archive page.html; this file transcribes the Seed2.0 Lite (0428) column - 23 text/agent/coding rows, 11 multimodal rows, 2 GUI rows, 30 video/visual-audio rows, 7 audio rows (71 rows total). Column header 0428 + prose "Seed2.0 Lite was upgraded at the end of April" date the evaluated Lite snapshot to 2026-04-28; release_date is left as previously recorded (OpenRouter-derived) pending a dated announcement - the page itself prints no explicit publish date. Seed2.0 Pro and Seed2.0 Mini columns live in the same tables and are recorded in their own release files. primary_sources 由 archiver-cn 探测发现（url_source=discovered）回填。 2026-09-01 audit: values are byte-exact DOM text reads (not vision); tables 1/3 cells print with "%" suffix and display keeps it.';
lite.benchmark_evidence = liteEvidence;
fs.writeFileSync('data/model-releases/official/doubao/seed-2-0-lite.json', JSON.stringify(lite, null, 1) + '\n');
console.log('lite rows:', liteEvidence.length);

// ---------------------------------------------------------------- mini (0215 column, video table only)
const miniEvidence = [];
for (const [sfx, bench, group, row, v] of t4) {
  const miniVals = { 'video-mmmu': 80.6, 'mmvu': 69.0, 'videosimpleqa-v2': 64.9, 'videosimpleqa': 67.7, 'scivideo': 35.3, 'videoreasonbench': 40.5, 'videoholmes': 58.6, 'minerva': 54.7, 'tvbench': 70.5, 'tomato': 47.4, 'egotempo': 67.2, 'motionbench': 65.1, 'contphy': 55.9, 'morse-500': 32.2, 'video-mme': 81.2, 'longvideobench': 74.8, 'lvbench': 66.6, 'videoeval-pro': 43.7, 'ovbench': 60.1, 'odvbench': 65.1, 'livesports-3k': 73.3, 'ovobench': 70.4, 'vispeak': 77.5, 'crossvid': 58.6, 'omnivideobench': 40.8, 'avmeme': 50.7, 'jointavbench': 52.7, 'worldsense': 52.7 };
  const v4 = miniVals[sfx];
  if (v4 === undefined) continue; // VideoMMEv2 / CGBench print "-" for Mini
  miniEvidence.push(mk('seed-2-0-mini', 'seed-2-0-mini', sfx, bench, group, row, T4_TABLE, v4, String(v4), 'accuracy', group + ' group. Column: Seed2.0 Mini (0215) - the only table on the seed2 page with a Mini column. ' + T4_COMP));
}

const mini = JSON.parse(fs.readFileSync('data/model-releases/official/doubao/seed-2-0-mini.json', 'utf8'));
mini.release_title = 'Seed 2.0-Mini (official Seed2 series model page, Mini 0215 column)';
mini.models = [{ id: 'seed-2-0-mini', name: 'Seed 2.0-Mini', variant: 'smaller tier of the Seed 2.0 generation; page column Seed2.0 Mini (0215), video/visual-audio table only' }];
mini.status = 'verified';
mini.last_verified_at = VER;
mini.notes = 'Upgrade of the 2026-08-31 placeholder: the shared official Seed2 series page (seed.bytedance.com/en/seed2) exposes a Seed2.0 Mini (0215) column in exactly one of its five "Evaluation Results" carousel tables (the video/visual-audio table). This file transcribes those 28 readable Mini cells; the VideoMMEv2 and CGBench cells print "-" for Mini and are not recorded as scores. No Mini column exists in the text/agent, multimodal-still, GUI, or audio tables, so no claims are carried for those groups. Column header 0215 dates the evaluated Mini snapshot to 2026-02-15; release_date is left as previously recorded (OpenRouter-derived) pending a dated announcement - the page itself prints no explicit publish date. 2026-09-01 audit: values are byte-exact DOM text reads (not vision).';
mini.benchmark_evidence = miniEvidence;
fs.writeFileSync('data/model-releases/official/doubao/seed-2-0-mini.json', JSON.stringify(mini, null, 1) + '\n');
console.log('mini rows:', miniEvidence.length);
