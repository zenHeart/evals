---
vendor: doubao
model: Seed 1.8（含 Thinking / 1.5-VL 对照）
release: seed-1-8
date: 2025-12-01
source: https://seed.bytedance.com/en/blog
fetched_at: 2026-09-01
---

# Seed1.8 发布（Generalized Agentic Model）

## 评测数据（转录）

官方评测表（Seed1.8 / Seed1.8-Thinking 高亮列；每张图另含竞品列）

| 图 | 分组 | Benchmark | Seed1.8 / Thinking |
| --- | --- | --- | --- |
| 01 | Computer Use | OSWorld | 61.9 |
| 01 | Browser Use | Realbench | 49.1 |
| 01 | Browser Use | Online-Mind2web | 85.9 |
| 01 | Mobile Use | AndroidWorld | 70.7 |
| 02 | General Agentic Search | BrowseComp-en | 67.6 |
| 02 | General Agentic Search | BrowseComp-zh | 81.3 |
| 02 | General Agentic Search | GAIA | 87.4 |
| 02 | General Agentic Search | WideSearch | 63.8 |
| 02 | General Agentic Search | HLE (text-only) | 40.9 |
| 02 | Visual Search | MM-BrowseComp | 46.3 |
| 02 | Visual Search | HLE-VL | 31.5 |
| 03 | Agentic Coding | SWE-Bench Verified | 72.9 |
| 03 | Agentic Coding | Multi-SWE-Bench | 42.0 |
| 03 | Agentic Coding | Ainstein-SWE-Bench | 36.7 |
| 03 | Agentic Coding | Terminal Bench 2.0 | 45.2 |
| 03 | Agentic Coding | U-Artifacts | 49.2 |
| 04 | Economically Valuable | FinSearchComp(T2&T3) | 62.8 |
| 04 | Economically Valuable | XpertBench (Law/Fin/Edu/Research/Humanities) | 55.2 / 62.0 / 47.9 / 31.4 / 60.2 |
| 04 | Economically Valuable | WorldTravel (multi-modal / text) | 47.2 / 52.1 |
| 06 | Math | AIME-25 | 94.3 |
| 06 | Math | HMMT25 (Feb) | 89.7 |
| 06 | Math | BeyondAIME | 77.0 |
| 06 | Math | AMO-Bench | 60.0 |
| 06 | Math | IMO-AnswerBench w/ code tools | 76.3 |
| 06 | STEM Reasoning | GPQA-Diamond | 83.8 |
| 06 | STEM Reasoning | PHYBench | 41.0 |
| 06 | STEM Reasoning | BIOBench | 42.3 |
| 06 | General Reasoning | KOR-Bench | 76.2 |
| 06 | General Reasoning | ARC-AGI-1 | 67.9 |
| 06 | Knowledge | MMLU | 92.3 |
| 06 | Knowledge | MMLU-pro | 84.9 |
| 06 | Knowledge | SuperGPQA | 64.8 |
| 06 | Knowledge | LPFQA | 49.1 |
| 07 | Complex Instruction Following | Inverse IFEval | 80.3 |
| 07 | Complex Instruction Following | MARS-Bench | 70.1 |
| 07 | Complex Instruction Following | MultiChallenge | 66.7 |
| 07 | Complex Instruction Following | Collie-Hard | 72.6 |
| 07 | Complex Instruction Following | EIFBench | 48.6 |
| 09 | Thinking · Multimodal Reasoning | MMMU | 83.4 |
| 09 | Thinking · Multimodal Reasoning | MMMU-Pro | 73.2 |
| 09 | Thinking · Multimodal Reasoning | MathVista | 87.7 |
| 09 | Thinking · Multimodal Reasoning | MathVision | 81.3 |
| 09 | Thinking · Multimodal Reasoning | DynaMath | 61.5 |
| 09 | Thinking · Multimodal Reasoning | LogicVista | 78.3 |
| 09 | Thinking · Multimodal Reasoning | EMMA | 60.9 |
| 09 | Thinking · Multimodal Reasoning | SFE | 51.2 |
| 09 | Thinking · Multimodal Reasoning | ZeroBench (main) | 11.0 |
| 09 | Thinking · Multimodal Reasoning | VPCT | 61.0 |
| 10 | Thinking · General VQA | VLMsAreBiased | 62.0 |
| 10 | Thinking · General VQA | VLMsAreBlind | 93.0 |
| 10 | Thinking · General VQA | SimpleVQA | 65.4 |
| 10 | Thinking · General VQA | HallusionBench | 63.9 |
| 10 | Thinking · General VQA | MMStar | 79.9 |
| 10 | Thinking · General VQA | MMBench v1.1 EN | 91.6 |
| 10 | Thinking · General VQA | MMBench v1.1 CN | 90.6 |
| 10 | Thinking · General VQA | MME-CC | 43.4 |
| 10 | Thinking · General VQA | MUIRBench | 78.7 |
| 10 | Thinking · General VQA | MMVP | 86.0 |
| 11 | Thinking · 2D&3D Spatial | BLINK | 74.3 |
| 11 | Thinking · 2D&3D Spatial | MMSIBench (circular) | 25.8 |
| 11 | Thinking · 2D&3D Spatial | RefSpatialBench | 56.3 |
| 11 | Thinking · 2D&3D Spatial | ERQA | 58.8 |
| 11 | Thinking · 2D&3D Spatial | DA-2K | 90.7 |
| 11 | Thinking · 2D&3D Spatial | CV-Bench | 88.0 |
| 12 | Motion & Perception | TVBench | 71.5 |
| 12 | Motion & Perception | TempCompass | 86.9 |
| 12 | Motion & Perception | TOMATO | 60.8 |
| 12 | Motion & Perception | EgoTempo | 67.0 |
| 12 | Motion & Perception | MotionBench | 70.6 |
| 12 | Motion & Perception | Countix | 31.0 |
| 13 | Long Video | VideoMME (double-dagger) | 87.8 |
| 13 | Long Video | CGBench | 62.4 |
| 13 | Long Video | LongVideoBench | 77.4 |
| 13 | Long Video | LVBench | 73.0 |

## 协议脚注

- 所有分数均为图片面板，无 DOM 表格；竞品列带 * 表示引自公开技术报告。
- 图 09/10/11 为 Seed1.8-Thinking 列（对照 Claude-Sonnet-4.5 / GPT-5.1-high / Gemini-2.5-pro / Gemini-3-pro / Seed1.5-VL-Thinking）；图 01-04、06、07 为 Seed1.8 列；图 12/13 为 Seed1.8 列（对照 Gemini-2.5-pro / Gemini-3-pro / Seed1.5-VL）。
- 发布日期页面只标注 2025-12（月精度）。

## 图片清单

- images/01.png — 2690x922 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjazfhe8.png
- images/02.png — 2690x1415 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjazm9e9.png
- images/03.png — 2690x1078 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjazoh5x.png
- images/04.png — 2690x1595 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjazrscc.png
- images/06.png — 2690x2012 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb1rshf.png
- images/07.png — 2690x1056 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb1tz3d.png
- images/09.png — 2690x1810 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb22697.png
- images/10.png — 2690x1335 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb24c2n.png
- images/11.png — 2690x1215 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb25ay6.png
- images/12.png — 2690x1203 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb265o8.png
- images/13.png — 2690x952 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb26xj6.png

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
