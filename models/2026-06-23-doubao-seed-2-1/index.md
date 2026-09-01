---
vendor: doubao
model: Seed 2.1（Pro / Turbo）
release: seed-2-1
date: 2026-06-23
source: https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity
fetched_at: 2026-09-01
---

# Seed2.1 发布

## 评测数据（转录）

官方评测表（Seed2.1 Pro / Seed2.1 Turbo 高亮列；对照 Claude Opus 4.7 / GPT-5.5 / Gemini 3.1 Pro）

| 图 | 分组 | Benchmark | Seed2.1 Pro | Seed2.1 Turbo |
| --- | --- | --- | --- | --- |
| 01 | Agentic (工作台) | Workspace Bench | 53.0 | 54.7 |
| 01 | Agentic | PresentBench | 54.6 | 48.3 |
| 01 | Agentic | Agent Startup Bench | 68.8 | 54.0 |
| 01 | Agentic | Agents' Last Exam (Pass/Score) | 19.5 / 41.4 | - |
| 01 | Agentic | OneMillion Bench | 68.8 | 66.6 |
| 01 | Agentic | OfficeQA Pro | 70.9 | 62.8 |
| 01 | Agentic | GDPval | 87.9 | 82.7 |
| 01 | Agentic | Finance Agent v1.1 | 60.7 | 56.0 |
| 01 | Agentic | APEX Agents | 33.8 | 29.2 |
| 02 | Agentic | xDailyBench | 61.0 | 56.4 |
| 02 | Agentic | Doubao Multi-Turn Bench | 52.5 | 49.0 |
| 02 | Agentic | MCP-Atlas | 83.8 | 80.3 |
| 02 | Agentic | Toolathlon | 50.6 | 49.1 |
| 02 | Agentic | SeedClawBench (in-house) | 66.6 | 63.8 |
| 03 | Visual Agent | Claw-Eval (MM, Pass^3) | 51.0 | 46.0 |
| 03 | Visual Agent | OfficeQA Pro (MM, Avg Score) | 72.2 | 71.1 |
| 03 | Visual Agent | WildClawBench | 61.7 | 62.8 |
| 03 | Visual Agent | Image2FloorPlan (Inhouse) | 48.0 | 35.9 |
| 04 | Computer Use | OSWorld | 78.8 | 76.4 |
| 04 | Computer Use | MobileWorld | 73.1 | 70.0 |
| 04 | Computer Use | CreativeWork | 42.5 | 34.5 |
| 04 | Computer Use | GameWorld | 31.2 | 25.9 |
| 05 | Open Benchmarks (Coding) | Terminal-Bench 2.1 | 71.0 | 67.6 |
| 05 | Open Benchmarks (Coding) | SWE-Bench Pro | 57.5 | 57.0 |
| 05 | Open Benchmarks (Coding) | CyberGym | 68.7 | 67.0 |
| 05 | Open Benchmarks (Coding) | ProgramBench | 50.3 | 49.4 |
| 05 | Open Benchmarks (Coding) | NL2Repo-Bench | 47.0 | 43.7 |
| 05 | Open Benchmarks (Coding) | SWE-Atlas | 35.2 | 30.6 |
| 05 | Open Benchmarks (Coding) | DeepSWE | 32.7 | 23.0 |
| 08 | Reasoning (w. Tool) | MathVision | 92.6 (94.5) | 90.1 (92.7) |
| 08 | STEM (w. Tool) | MMMU-Pro | 81.6 (82.7) | 80.1 (82.2) |
| 08 | Puzzle (w. Tool) | ZEROBench | 18.0 (22.0) | 11.0 (20.0) |
| 08 | Perception | RealWorldQA | 86.7 | 86.3 |
| 08 | Perception | BabyVision | 73.7 | 62.9 |
| 08 | Perception | MeasureBench (avg real & synthetic) | 62.9 | 58.9 |
| 08 | Infographics (w. Tool) | CharXiv-RQ | 85.4 (86.4) | 82.5 (83.6) |
| 09 | Spatial Reasoning | ERQA | 72.0 | 71.3 |
| 09 | Spatial Reasoning | EmbSpatial-Bench | 83.4 | 82.5 |
| 09 | Long Context | MMLongBench-128K | 78.3 | 76.9 |
| 11 | Long Video | VideoMME | 89.2 | 89 |
| 11 | Long Video | LVBench | 78 | 76.8 |
| 11 | Streaming | OVOBench | 80.7 | 79.2 |
| 11 | Streaming | OVBench | 70.0 | 69.7 |
| 12 | Knowledge | SuperGPQA | 70.8 | 67.4 |
| 12 | Knowledge | KINA | 48.3 | 46.6 |
| 12 | Knowledge | HLE-Verified | 42.9 | 42.4 |
| 12 | Reasoning | SciCode | 59.8 | 57.8 |
| 12 | Reasoning | FrontierScience-Olympiad | 75.0 | 76.0 |
| 12 | Multilingual | MSQA | 50.2 | 42.0 |
| 12 | Search | HLE-textonly (with Search) | 55.7 | 54.6 |
| 12 | Search | BrowseComp (with Search) | 86.2 | 84.9 |
| 13 | Research | PostTrainBench | 16.5 | 18.3 |
| 13 | Research | FrontierScience-Research | 28.3 | 33.3 |
| 13 | Research | FrontierCS | 46.3 | 50.8 |
| 13 | Research | HorizonMath | 2.0 | 2.0 |
| 10 | Video/Audio | TOMATO | 见 12 行口径 | 见 12 行口径 |

注：图 10（TOMATO/TVBench 音视频组，对照 Gemini 3.1 Pro / Gemini 3.5 Flash）与 JSON 已核行一致。

## 协议脚注

- 全部分数面板为图片，无 DOM 表格；括号第二值为 w. Tool（或第二条）口径，主值为无工具/主口径。
- SeedClawBench 为 Seed 自研 in-house benchmark（OpenClaw 风格真实用户任务）。
- Search 组（HLE-textonly / BrowseComp）为搜索增强口径，与其他行不混比。

## 图片清单

- images/01.png — 1280x850 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4xfa4mqq4u89c.png
- images/02.png — 1280x556 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4xfa4mqq4ujsp.png
- images/03.png — 11208x4481 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4xfa4mqq4v1ol.png
- images/04.png — 11210x4226 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4xfa4mqq4w8x3.png
- images/05.png — 1280x581 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4xfa4mqq4wlbt.png
- images/08.png — 11208x8857 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4xfa4mqq4yer3.png
- images/09.png — 11208x3838 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4xfa4mqq4z2l5.png
- images/11.png — 1280x521 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4xfa4mqq50ia3.png
- images/12.png — 1280x920 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4xfa4mqq510uc.png
- images/13.png — 1280x511 | 原URL: https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4xfa4mqq52cdr.png

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
