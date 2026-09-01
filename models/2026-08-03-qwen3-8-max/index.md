---
vendor: qwen
model: Qwen3.8-Max
release: qwen3-8-max
date: 2026-08-03
source: https://qwen.ai/blog?id=qwen3.8
fetched_at: 2026-09-01
---

# Qwen3.8-Max 发布

## 评测数据（转录）

表 1（Coding Agent / General Agent / General Capabilities，DOM 表格）

| Benchmark | Opus4.8 | Fable5 | GPT5.6 Sol (max) | Qwen3.7-Max | Qwen3.8-Max |
| --- | --- | --- | --- | --- | --- |
| Terminal Bench 2.1 | 84.6 | 84.6 | 88.8 | 74.5 | 86.6 |
| SWE-bench Pro | 69.2 | 80.0 | 64.6 | 60.6 | 67.7 |
| DeepSWE 1.1 | 59.0 | 70.0 | 73.0 | 21.6 | 56.6 |
| NL2Repo-Bench | 69.4 | -- | -- | 47.2 | 55.9 |
| FrontierSWE | 70.0 | 88.8 | -- | 40.7 | 73.5 |
| MLS-Bench-Lite | 42.8 | 49.9 | 46.2 | 31.7 | 41.0 |
| PaperBench | 80.3 | 88.8 | 90.5 | 64.8 | 93.0 |
| AndroidBench | 69.8 | 84.5 | 74.0 | 56.5 | 75.1 |
| QwenSWEBench | 84.0 | 86.3 | 73.5 | 63.4 | 80.7 |
| QwenQoderBench | 62.7 | 63.1 | 53.8 | 36.8 | 58.4 |
| QwenReactBench | 1694 | 1770 | 1564 | 1538 | 1724 |
| QwenSVGBench | 1648 | 1690 | 1758 | 1499 | 1713 |
| CoWorkBench | 72.3 | 75.9 | 71.5 | 64.6 | 74.8 |
| WorkSpaceBench | 66.8 | 68.7 | 65.6 | 61.4 | 67.7 |
| JobBench | 48.4 | 57.4 | 45.4 | 31.3 | 53.4 |
| SkillsBench | 65.1 | 70.9 | 73.5 | 61.2 | 70.2 |
| Agents' Last Exam (Pass / Score) | 27.0 / 45.1 | -- / -- | 30.6 / 53.6 | 11.8 / 31.1 | 27.0 / 52.4 |
| Automation-Bench (Pass@1) | 27.2 | 29.1 | 29.7 | 14.2 | 27.3 |
| Toolathlon Verified (Pass@1) | 76.2 | 77.9 | 74.9 | 49.7 | 72.5 |
| WideSearch | 72.9 | 81.2 | -- | 75.2 | 81.9 |
| HLE w/ tools | 57.9 | 64.5 | 58.0 | 53.5 | 56.2 |
| GPQA Diamond | 92.0 | 92.6 | 94.1 | 92.4 | 92.6 |
| HLE | 45.7 | 53.3 | 47.2 | 41.4 | 43.6 |
| IFBench | 62.2 | 63.5 | 72.7 | 79.1 | 82.8 |
| OneMillion-Bench (expert score) | 41.8 | 55.9 | 53.8 | 44.4 | 52.5 |
| HealthBench | 52.4 | -- | 55.3 | 54.5 | 60.2 |
| PLawBench | 69.6 | 70.2 | 72.3 | 58.9 | 73.2 |
| PRBench-Legal | 52.7 | 57.6 | 57.6 | 48.5 | 57.6 |
| PRBench-Finance | 51.9 | 55.8 | 55.5 | 46.8 | 58.3 |
| MRCR v2 256K (8-needle) | 83.2 | -- | 93.8 | 86.7 | 92.9 |
| LongBench v2 | 69.1 | -- | 67.1 | 65.3 | 66.3 |

表 2（Multimodal，61 个数据点全量转录；列序 Opus4.8 / Fable5 / Gemini3.1-Pro / GPT5.6-Sol / Qwen3.7-Plus / Qwen3.8-Max）

| Benchmark | Opus4.8 | Fable5 | Gemini3.1-Pro | GPT5.6-Sol | Qwen3.7-Plus | Qwen3.8-Max |
| --- | --- | --- | --- | --- | --- | --- |
| MMMU-Pro | 75.6 | 81.2 | 80.5 | 83.0 | 79.0 | 82.3 |
| MathVision | 87.1 / 97.1 | 92.7 / 98.6 | 87.4 / 95.7 | 90.8 / 97.8 | 90.3 / -- | 95.2 / 97.7 |
| BabyVision | 28.4 / 81.2 | 42.5 / 90.5 | 55.9 / 68.3 | 65.5 / 88.9 | 64.7 / 70.4 | 82.0 / 91.3 |
| HLE-VL (w/ Tools) | -- | -- | 43.9 | 51.2 | 25.6 | 52.2 |
| ZeroBench (Pass@5) | 17.0 / 34.0 | 20.0 / 46.0 | 17.0 / 23.0 | 22.0 / 35.0 | 19.0 / 19.0 | 24.0 / 49.0 |
| ZeroBench-Sub | 31.1 | 37.1 | 36.5 | 46.7 | 41.0 | 48.5 |
| LogicVista | 76.7 | 85.7 | 82.6 | 89.7 | 84.3 | 91.9 |
| HiPhO | 69.3 | 78.6 | 85.4 | 86.8 | 84.1 | 90.0 |
| PhyX | 54.2 | 71.7 | 79.4 | 79.1 | 80.0 | 83.5 |
| SLAKE | 75.9 | 86.6 | 82.9 | 85.1 | 83.2 | 90.8 |
| MedXpertQA-MM | 71.7 | 80.0 | 80.7 | 81.5 | 71.0 | 80.4 |
| PMC-VQA | 59.2 | 63.2 | 62.5 | 62.3 | 63.4 | 66.2 |
| OSWorld-Verified | 83.4 | 85.0 | 76.2 | 83.2 | 73.3 | 86.1 |
| OSWorld 2.0 | 20.6 / 54.8 | -- / 66.1 | 7.8 / 30.6 | -- / 62.6 | 2.8 / 21.5 | 19.4 / 46.7 |
| ScreenSpot Pro | 82.3 | 87.3 | 68.1 | 81.3 | 79.0 | 84.5 |
| WebArena-Verified | 67.9 | 71.3 | 64.3 | 69.7 | 55.3 | 66.8 |
| AndroidWorld | 75.0 | 88.8 | 70.7 | 77.6 | 81.0 | 85.3 |
| MobileWorld | 67.5 | 85.5 | 58.1 | 76.9 | 51.2 | 77.8 |
| ClawEval-MM | 73.3 / 73.8 | 81.2 / 77.5 | 50.5 / 55.2 | 81.2 / 78.9 | 57.4 / 60.1 | 77.2 / 74.8 |
| Vision2Web | 62.4 | 70.5 | -- | 62.1 | 42.1 | 69.0 |
| QwenBlenderBench | 62.4 | 69.5 | 23.0 | 68.6 | 41.5 | 69.9 |
| Parametric CAD Bench | 85.1 | 87.5 | 73.5 | 86.2 | 73.8 | 91.5 |
| RecreationBench | 48.0 | 56.1 | 16.2 | 47.6 | 30.2 | 51.7 |
| PresentBench | 80.9 | 79.8 | 55.4 | 82.9 | 65.7 | 79.6 |
| CharXiv (RQ) | 78.5 / 89.9 | 87.9 / 93.5 | 84.4 / 89.9 | 85.1 / 89.1 | 85.8 / 85.9 | 88.4 / 93.5 |
| OmniDocBench 1.5 | 86.5 | 89.5 | 90.0 | 86.7 | 91.4 | 92.1 |
| OCR-Bench-V2 (EN/ZH) | 53.9 / 55.3 | 65.3 / 58.1 | 64.6 / 58.2 | 69.0 / 57.3 | 70.7 / 67.1 | 74.2 / 68.3 |
| CC-OCR-Bench-V2 | 60.3 | 72.4 | 68.9 | 68.0 | 72.7 | 79.6 |
| MTVQA-Test | 48.1 | 41.6 | 54.3 | 52.7 | 51.2 | 56.6 |
| MADQA | 86.8 | 86.0 | 81.1 | 87.8 | 87.1 | 91.8 |
| QwenVisualOffice | 34.5 | 32.4 | 39.6 | 29.5 | 32.4 | 44.6 |
| RealWorldQA | 76.6 | 85.9 | 83.5 | 83.7 | 86.9 | 88.0 |
| ERQA | 57.2 | 70.0 | 68.0 | 70.0 | 69.8 | 77.8 |
| LingoQA | 73.8 | 77.4 | 66.8 | 72.6 | 83.4 | 84.8 |
| SURDS | 62.2 | 79.4 | 64.0 | 63.0 | 77.2 | 77.8 |
| SimpleVQA | 67.3 | 73.4 | 73.1 | 66.6 | 70.3 | 75.0 |
| WorldVQA | 33.9 | 53.5 | 54.0 | 45.1 | 43.9 | 53.2 |
| MMStar | 76.7 | 80.5 | 84.0 | 82.5 | 83.2 | 85.9 |
| PerceptionBench | 47.2 | 57.2 | 56.2 | 59.7 | 51.1 | 63.5 |
| CountQA | 41.3 | 63.1 | 72.8 | 68.6 | 77.0 | 82.4 |
| RefAdv-S | 61.7 | 68.6 | 71.9 | 69.2 | 73.0 | 80.2 |
| Dense200 | 20.8 | 31.1 | 69.7 | 55.3 | 60.7 | 87.0 |
| COCO | 50.7 | 56.4 | 72.4 | 61.2 | 74.2 | 78.7 |
| VisFactor | 30.1 | 54.5 | 39.8 | 62.8 | 42.8 | 60.8 |
| VLMsAreBiased | 43.8 | 61.2 | 74.1 | 59.8 | 36.6 | 88.3 |
| VideoMME (w/ Sub.) | 85.4 | -- | 86.7 | 89.5 | 88.0 | 90.4 |
| VideoMME v2 (w/ Sub.) | 49.0 | 52.2 | 66.9 | 71.1 | 59.7 | 68.3 |
| VideoMMMU | 75.3 | 81.2 | 85.3 | 85.0 | 85.4 | 88.7 |
| MMVU | 67.4 | 72.0 | 77.9 | 81.2 | 76.6 | 82.4 |
| MLVU (M-Avg) | 53.4 | -- | 84.7 | 87.6 | 87.4 | 90.8 |
| TVBench | 61.5 | -- | 73.0 | 83.2 | 78.2 | 81.9 |
| LVBench | 67.3 | -- | 75.1 | 78.8 | 76.2 | 81.8 |
| LVBench (w/ Mem.) | 84.3 | 90.1 | -- | 84.2 | 74.5 | 85.6 |
| EgoLife (w/ Mem.) | 78.3 | 82.3 | -- | 70.8 | 68.8 | 80.3 |
| VideoDR (w/ Search) | 65.6 | 77.1 | -- | 71.3 | 41.0 | 73.2 |

分组标题：Multimodal Reasoning / Visual Agent & Coding / Document & Office Intelligence / Real-World & Spatial Understanding / Visual Perception & Grounding / Video Intelligence & Agents。

## 协议脚注

- 两张表均为 DOM 表格（机器可读文本），本次转录直接取自归档 page.html，非视觉转写。
- 图 1 脚注：1) Fable5 结果可能包含回退机制；2) Terminal Bench 2.1 用 Claude Code（avg@10）评估、超时 5 小时、max_tokens=131,072，其余模型报告各评测框架已发布最佳分。
- 斜杠值（如 95.2 / 97.7）为 w/o 与 w/ python（或 EN/ZH）双口径；'--' 为未报告。

## 图片清单

- images/03.png — 4364x3211 | rendered page image | 原URL: https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3.8/performance.png

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
