---
vendor: minimax
model: MiniMax-M3
release: minimax-m3
date: 2026-06-01
source: https://www.minimax.io/blog/minimax-m3
fetched_at: 2026-09-01
---

# MiniMax M3 发布

## 评测数据（转录）

官方全表（images/19.jpg；列序 M3 / M2.7 / Opus4.7 / GPT5.5 / Gemini3.1Pro / Sonnet4.6 / DSV4Pro / GLM5.1T / K2.6T）

| Group | Benchmark | M3 |
| --- | --- | --- |
| Coding | SWE-Bench Verified | 80.5 |
| Coding | SWE-Bench Pro | 59.0 |
| Coding | Terminal Bench 2.1 | 66.0 |
| Coding | SWE Atlas-QnA | 37.9 |
| Coding | nl2repo | 42.13 |
| Coding | SWE Atlas-Test Writing | 30.83 |
| Coding | SWE-fficiency | 34.8 |
| Coding | LiveSQLBench | 40.17 |
| Coding | CL-bench | 20.48 |
| Coding | VIBE-V2 | 50.12 |
| Coding | SVG-Bench | 63.7 |
| Coding | PostTrainBench | 37.1 |
| Coding | KernelBench Hard | 28.8 |
| Coding | PaperBench | 52.6 |
| Cowork (Agent) | BrowseComp | 83.52 |
| Cowork (Agent) | DRACO | 73.23 |
| Cowork (Agent) | GDPval rubrics | 74.78 |
| Cowork (Agent) | BankerToolBench | 76.12 |
| Cowork (Agent) | OfficeQA Pro | 45.1 |
| Cowork (Agent) | SpreadSheetBench-v1 | 89.35 |
| Cowork (Agent) | YC-Bench | 2.10M |
| Cowork (Agent) | LOCA-Bench (256k) | 49.3 |
| Cowork (Agent) | MCP Atlas | 74.2 |
| Cowork (Agent) | Apex-Agents | 27.7 |
| Cowork (Agent) | Claw-Eval | 74.5 |
| GUI | OSWorld-Verified | 70.06 |
| MultiModal | OmniDocBench | 91.6 |
| MultiModal | MMMU-Pro | 78.1 |
| MultiModal | Video-MMMU | 84.6 |
| MultiModal | VideoMME (w/ sub) | 85.4 |
| Reasoning | IMO 2025 | 35 / 42 |
| Reasoning | USAMO 2026 | 36 / 42 |

竞品列数值见 `data/model-releases/official/minimax/minimax-m3.json` 各行 notes（转录于同一张表）。

## 协议脚注

- 方法论（页面 Evaluation Methodology 节）：sandbox 8C16G、2h 超时、max output 128K、Terminus 2 scaffolding（Terminal Bench）；PostTrainBench 用 Claude Code + Ralph-Loop；KernelBench Hard 在 NVIDIA Blackwell（sm_120）。
- PostTrainBench prose 记 0.37（表内百分数形式 37.1）；Opus 4.7 0.42、GPT-5.5 0.39 取自 prose。
- OSWorld-Verified 页面同时给出 68.70%（100 步）与 70.06%（200 步），表取 200 步终值。
- IMO 2025 / USAMO 2026 为得分/满分（35/42、36/42）。

## 图片清单

- images/19.jpg — 2584x3766 | 原URL: https://filecdn.minimax.chat/public/img_v3_02128_b7726cd8-879a-4b7a-a9da-db4395ea597g-1780272508686.jpg
- images/20.png — 2619x1200 | [og/twitter] | 原URL: https://file.cdn.minimax.io/public/11649e5b-3f76-477e-a73d-2abc4882211c.png

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
