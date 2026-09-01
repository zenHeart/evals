---
vendor: meta
model: Llama 4 Maverick / Llama 4 Scout / Llama 4 Behemoth
release: llama-4
date: 2025-04-05
source: https://ai.meta.com/blog/llama-4-multimodal-intelligence/
fetched_at: 2026-09-01
---

# The Llama 4 herd: The beginning of a new era of natively multimodal AI innovation

## 评测数据（转录）

> 来源：`images/06.png`（Scout 基准表）、`images/03.png`（Maverick 基准表）、`images/07.png`（Behemoth 基准表）、`images/04.png`（NiH 长上下文检索热图）、`images/05.png`（代码 NLL 曲线）；备注含「(视觉转写)」的行转录自图片，其余来自页面文本。

### Llama 4 Scout instruction-tuned benchmarks（images/06.png，视觉转写）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| MMMU（Image Reasoning） | 69.4 | Llama 4 Scout (视觉转写) |
| MMMU（Image Reasoning） | — | Llama 3.3 70B（图中标注 No multimodal support）(视觉转写) |
| MMMU（Image Reasoning） | — | Llama 3.1 405B（图中标注 No multimodal support）(视觉转写) |
| MMMU（Image Reasoning） | 64.9 | Gemma 3 27B (视觉转写) |
| MMMU（Image Reasoning） | 62.8 | Mistral 3.1 24B (视觉转写) |
| MMMU（Image Reasoning） | 68.0 | Gemini 2.0 Flash-Lite (视觉转写) |
| MathVista | 70.7 | Llama 4 Scout (视觉转写) |
| MathVista | — | Llama 3.3 70B（图中标注 No multimodal support）(视觉转写) |
| MathVista | — | Llama 3.1 405B（图中标注 No multimodal support）(视觉转写) |
| MathVista | 67.6 | Gemma 3 27B (视觉转写) |
| MathVista | 68.9 | Mistral 3.1 24B (视觉转写) |
| MathVista | 57.6 | Gemini 2.0 Flash-Lite (视觉转写) |
| ChartQA（Image Understanding） | 88.8 | Llama 4 Scout (视觉转写) |
| ChartQA（Image Understanding） | — | Llama 3.3 70B（图中标注 No multimodal support）(视觉转写) |
| ChartQA（Image Understanding） | — | Llama 3.1 405B（图中标注 No multimodal support）(视觉转写) |
| ChartQA（Image Understanding） | 76.3 | Gemma 3 27B (视觉转写) |
| ChartQA（Image Understanding） | 86.2 | Mistral 3.1 24B (视觉转写) |
| ChartQA（Image Understanding） | 73.0 | Gemini 2.0 Flash-Lite (视觉转写) |
| DocVQA (test) | 94.4 | Llama 4 Scout (视觉转写) |
| DocVQA (test) | — | Llama 3.3 70B（图中标注 No multimodal support）(视觉转写) |
| DocVQA (test) | — | Llama 3.1 405B（图中标注 No multimodal support）(视觉转写) |
| DocVQA (test) | 90.4 | Gemma 3 27B (视觉转写) |
| DocVQA (test) | 94.1 | Mistral 3.1 24B (视觉转写) |
| DocVQA (test) | 91.2 | Gemini 2.0 Flash-Lite (视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | 32.8 | Llama 4 Scout (视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | 33.3 | Llama 3.3 70B (视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | 27.7 | Llama 3.1 405B (视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | 29.7 | Gemma 3 27B (视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | — | Mistral 3.1 24B（图中无数据）(视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | 28.9 | Gemini 2.0 Flash-Lite (视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | 74.3 | Llama 4 Scout (视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | 68.9 | Llama 3.3 70B (视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | 73.4 | Llama 3.1 405B (视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | 67.5 | Gemma 3 27B (视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | 66.8 | Mistral 3.1 24B (视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | 71.6 | Gemini 2.0 Flash-Lite (视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 57.2 | Llama 4 Scout (视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 50.5 | Llama 3.3 70B (视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 49.0 | Llama 3.1 405B (视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 42.4 | Gemma 3 27B (视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 46.0 | Mistral 3.1 24B (视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 51.5 | Gemini 2.0 Flash-Lite (视觉转写) |
| MTOB (half book) eng→kgv / kgv→eng（Long Context） | 42.2/36.6 | Llama 4 Scout (视觉转写) |
| MTOB (half book) eng→kgv / kgv→eng（Long Context） | — | Llama 3.3 70B（图中标注 Context window is 128K）(视觉转写) |
| MTOB (half book) eng→kgv / kgv→eng（Long Context） | — | Llama 3.1 405B（图中标注 Context window is 128K）(视觉转写) |
| MTOB (half book) eng→kgv / kgv→eng（Long Context） | — | Gemma 3 27B（图中标注 Context window is 128K）(视觉转写) |
| MTOB (half book) eng→kgv / kgv→eng（Long Context） | — | Mistral 3.1 24B（图中标注 Context window is 128K）(视觉转写) |
| MTOB (half book) eng→kgv / kgv→eng（Long Context） | 42.3/35.1 | Gemini 2.0 Flash-Lite（图中标注脚注 3）(视觉转写) |
| MTOB (full book) eng→kgv / kgv→eng（Long Context） | 39.7/36.3 | Llama 4 Scout (视觉转写) |
| MTOB (full book) eng→kgv / kgv→eng（Long Context） | — | Llama 3.3 70B（图中标注 Context window is 128K）(视觉转写) |
| MTOB (full book) eng→kgv / kgv→eng（Long Context） | — | Llama 3.1 405B（图中标注 Context window is 128K）(视觉转写) |
| MTOB (full book) eng→kgv / kgv→eng（Long Context） | — | Gemma 3 27B（图中标注 Context window is 128K）(视觉转写) |
| MTOB (full book) eng→kgv / kgv→eng（Long Context） | — | Mistral 3.1 24B（图中标注 Context window is 128K）(视觉转写) |
| MTOB (full book) eng→kgv / kgv→eng（Long Context） | 35.1/30.0 | Gemini 2.0 Flash-Lite（图中标注脚注 3）(视觉转写) |

### Llama 4 Maverick instruction-tuned benchmarks（images/03.png，视觉转写）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| 成本（每 1M 输入+输出 token, 3:1 混合） | $0.19–$0.49 | Llama 4 Maverick（图中标注脚注 5）(视觉转写) |
| 成本（每 1M 输入+输出 token, 3:1 混合） | $0.17 | Gemini 2.0 Flash (视觉转写) |
| 成本（每 1M 输入+输出 token, 3:1 混合） | $0.48 | DeepSeek v3.1 (视觉转写) |
| 成本（每 1M 输入+输出 token, 3:1 混合） | $4.38 | GPT-4o (视觉转写) |
| MMMU（Image Reasoning） | 73.4 | Llama 4 Maverick (视觉转写) |
| MMMU（Image Reasoning） | 71.7 | Gemini 2.0 Flash (视觉转写) |
| MMMU（Image Reasoning） | — | DeepSeek v3.1（图中标注 No multimodal support）(视觉转写) |
| MMMU（Image Reasoning） | 69.1 | GPT-4o (视觉转写) |
| MathVista | 73.7 | Llama 4 Maverick (视觉转写) |
| MathVista | 73.1 | Gemini 2.0 Flash (视觉转写) |
| MathVista | — | DeepSeek v3.1（图中标注 No multimodal support）(视觉转写) |
| MathVista | 63.8 | GPT-4o (视觉转写) |
| ChartQA（Image Understanding） | 90.0 | Llama 4 Maverick (视觉转写) |
| ChartQA（Image Understanding） | 88.3 | Gemini 2.0 Flash (视觉转写) |
| ChartQA（Image Understanding） | — | DeepSeek v3.1（图中标注 No multimodal support）(视觉转写) |
| ChartQA（Image Understanding） | 85.7 | GPT-4o (视觉转写) |
| DocVQA (test) | 94.4 | Llama 4 Maverick (视觉转写) |
| DocVQA (test) | — | Gemini 2.0 Flash（图中无数据）(视觉转写) |
| DocVQA (test) | — | DeepSeek v3.1（图中标注 No multimodal support）(视觉转写) |
| DocVQA (test) | 92.8 | GPT-4o (视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | 43.4 | Llama 4 Maverick (视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | 34.5 | Gemini 2.0 Flash (视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | 45.8/49.2 | DeepSeek v3.1（图中标注脚注 3：日期范围未知 49.2，内部复测 45.8）(视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | 32.3 | GPT-4o（图中标注脚注 3，来自 LCB 排行榜）(视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | 80.5 | Llama 4 Maverick (视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | 77.6 | Gemini 2.0 Flash (视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | 81.2 | DeepSeek v3.1 (视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | — | GPT-4o（图中无数据）(视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 69.8 | Llama 4 Maverick (视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 60.1 | Gemini 2.0 Flash (视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 68.4 | DeepSeek v3.1 (视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 53.6 | GPT-4o (视觉转写) |
| Multilingual MMLU | 84.6 | Llama 4 Maverick (视觉转写) |
| Multilingual MMLU | — | Gemini 2.0 Flash（图中无数据）(视觉转写) |
| Multilingual MMLU | — | DeepSeek v3.1（图中无数据）(视觉转写) |
| Multilingual MMLU | 81.5 | GPT-4o (视觉转写) |
| MTOB (half book) eng→kgv / kgv→eng（Long Context） | 54.0/46.4 | Llama 4 Maverick (视觉转写) |
| MTOB (half book) eng→kgv / kgv→eng（Long Context） | 48.4/39.8 | Gemini 2.0 Flash（图中标注脚注 4）(视觉转写) |
| MTOB (half book) eng→kgv / kgv→eng（Long Context） | — | DeepSeek v3.1（图中标注 Context window is 128K）(视觉转写) |
| MTOB (half book) eng→kgv / kgv→eng（Long Context） | — | GPT-4o（图中标注 Context window is 128K）(视觉转写) |
| MTOB (full book) eng→kgv / kgv→eng（Long Context） | 50.8/46.7 | Llama 4 Maverick (视觉转写) |
| MTOB (full book) eng→kgv / kgv→eng（Long Context） | 45.5/39.6 | Gemini 2.0 Flash（图中标注脚注 4）(视觉转写) |
| MTOB (full book) eng→kgv / kgv→eng（Long Context） | — | DeepSeek v3.1（图中标注 Context window is 128K）(视觉转写) |
| MTOB (full book) eng→kgv / kgv→eng（Long Context） | — | GPT-4o（图中标注 Context window is 128K）(视觉转写) |

### Llama 4 Behemoth instruction-tuned benchmarks（images/07.png，视觉转写）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | 49.4 | Llama 4 Behemoth（图中标注脚注 1：当前最佳内部结果）(视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | — | Claude Sonnet 3.7（图中无数据）(视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | 36.0 | Gemini 2.0 Pro（图中标注脚注 3，来自 LCB 排行榜）(视觉转写) |
| LiveCodeBench（Coding, 10/01/2024–02/01/2025） | — | GPT-4.5（图中无数据）(视觉转写) |
| MATH-500（Reasoning & Knowledge） | 95.0 | Llama 4 Behemoth (视觉转写) |
| MATH-500（Reasoning & Knowledge） | 82.2 | Claude Sonnet 3.7 (视觉转写) |
| MATH-500（Reasoning & Knowledge） | 91.8 | Gemini 2.0 Pro (视觉转写) |
| MATH-500（Reasoning & Knowledge） | — | GPT-4.5（图中无数据）(视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | 82.2 | Llama 4 Behemoth (视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | — | Claude Sonnet 3.7（图中无数据）(视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | 79.1 | Gemini 2.0 Pro (视觉转写) |
| MMLU Pro（Reasoning & Knowledge） | — | GPT-4.5（图中无数据）(视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 73.7 | Llama 4 Behemoth (视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 68.0 | Claude Sonnet 3.7 (视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 64.7 | Gemini 2.0 Pro (视觉转写) |
| GPQA Diamond（Reasoning & Knowledge） | 71.4 | GPT-4.5 (视觉转写) |
| Multilingual MMLU (OpenAI) | 85.8 | Llama 4 Behemoth (视觉转写) |
| Multilingual MMLU (OpenAI) | 83.2 | Claude Sonnet 3.7 (视觉转写) |
| Multilingual MMLU (OpenAI) | — | Gemini 2.0 Pro（图中无数据）(视觉转写) |
| Multilingual MMLU (OpenAI) | 85.1 | GPT-4.5 (视觉转写) |
| MMMU（Image Reasoning） | 76.1 | Llama 4 Behemoth (视觉转写) |
| MMMU（Image Reasoning） | 71.8 | Claude Sonnet 3.7 (视觉转写) |
| MMMU（Image Reasoning） | 72.7 | Gemini 2.0 Pro (视觉转写) |
| MMMU（Image Reasoning） | 74.4 | GPT-4.5 (视觉转写) |

### 长上下文检索与 NLL 曲线（视觉转写）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Needle-in-a-haystack (NiH) 文本检索 | — | 图表仅定性展示热图：Maverick 覆盖至 1M token、Scout 覆盖至 10M token，绝大多数格子为检索成功 (视觉转写) |
| Needle-in-a-haystack (NiH) 视频检索 | — | 图表仅定性展示热图：Scout 覆盖最长 20 小时视频（10.4M token），仅少量格子检索失败 (视觉转写) |
| Cumulative average NLL for code | — | 图表仅定性展示随序列位置(10^1–10^7)递减的负对数似然曲线，无数值标注 (视觉转写) |

### 页面文本中的数值与定性描述

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| LMArena ELO | 1417 | Llama 4 Maverick（experimental chat version，页面文本） |
| 争议性政治/社会话题整体拒答率 | 从 7% 降至低于 2% | Llama 3.3 → Llama 4（页面文本） |
| 不均衡拒答（unequal response refusals）比例 | 低于 1% | Llama 4（页面文本） |
| Scout 综合对比 | — | 页面仅定性描述："better results than Gemma 3, Gemini 2.0 Flash-Lite, and Mistral 3.1 across a broad range of widely reported benchmarks" |
| Maverick 综合对比 | — | 页面仅定性描述："beating GPT-4o and Gemini 2.0 Flash ... comparable results to the new DeepSeek v3 on reasoning and coding" |
| Behemoth 综合对比 | — | 页面仅定性描述："outperforms GPT-4.5, Claude Sonnet 3.7, and Gemini 2.0 Pro on STEM-focused benchmarks such as MATH-500 and GPQA Diamond" |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 playwright-rendered。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.png — 1920x1080 | 原URL: https://scontent-hkg4-1.xx.fbcdn.net/v/t39.2365-6/489528324_1866126614188079_2353760794...
- images/02.png — 1920x1308 | 原URL: https://scontent-hkg1-1.xx.fbcdn.net/v/t39.2365-6/488655517_650996354186993_10439421884...
- images/03.png — 1920x1638 | 原URL: https://scontent-hkg1-1.xx.fbcdn.net/v/t39.2365-6/488688605_1406312723692874_1536535503...
- images/04.png — 2096x929 | 原URL: https://scontent-hkg4-1.xx.fbcdn.net/v/t39.2365-6/488955260_630849766606664_49702279152...
- images/05.png — 1920x1137 | 原URL: https://scontent-hkg1-1.xx.fbcdn.net/v/t39.2365-6/488641575_1306808653730812_1227810128...
- images/06.png — 1920x1359 | 原URL: https://scontent-hkg1-1.xx.fbcdn.net/v/t39.2365-6/488658055_1347378876402143_3412007366...
- images/07.png — 1920x1016 | 原URL: https://scontent-hkg1-2.xx.fbcdn.net/v/t39.2365-6/489511937_1627813884508038_4209289296...
- images/08.png — 1920x1080 | 原URL: https://scontent-hkg1-2.xx.fbcdn.net/v/t39.2365-6/480457472_530944076174486_73548259826...
- images/09.png — 1920x1080 | 原URL: https://scontent-hkg1-1.xx.fbcdn.net/v/t39.2365-6/470665849_1620699585191822_2616824612...
- images/10.png — 1920x1080 | 原URL: https://scontent-hkg4-2.xx.fbcdn.net/v/t39.2365-6/470644933_3774351322782456_2883934816...
