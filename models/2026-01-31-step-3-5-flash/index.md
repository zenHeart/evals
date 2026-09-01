---
vendor: stepfun
model: Step 3.5 Flash
release: step-3-5-flash
date: 2026-01-31
source: https://github.com/stepfun-ai/Step-3.5-Flash
fetched_at: 2026-09-01
---

# Step-3.5-Flash（GitHub 官方仓库）

## 评测数据（转录）

### 表 2（页面 HTML 表格逐行转录）

| Benchmark | Step 3.5 Flash | DeepSeek V3.2 | Kimi K2 Thinking / K2.5 | GLM-4.7 | MiniMax M2.1 | MiMo-V2 Flash |
|---|---|---|---|---|---|---|
| # Activated Params | 11B | 37B | 32B | 32B | 10B | 15B |
| # Total Params (MoE) | 196B | 671B | 1T | 355B | 230B | 309B |
| Est. decoding cost @ 128K context, Hopper GPU** | 1.0x 100 tok/s, MTP-3, EP8 | 6.0x 33 tok/s, MTP-1, EP32 | 18.9x 33 tok/s, no MTP, EP32 | 18.9x 100 tok/s, MTP-3, EP8 | 3.9x 100 tok/s, MTP-3, EP8 | 1.2x 100 tok/s, MTP-3, EP8 |
|  |  |  | Agent |  |  |  |
| τ²-Bench | 88.2 | 80.3 (85.2*) | 74.3*/85.4* | 87.4 | 86.6* | 80.3 (84.1*) |
| BrowseComp | 51.6 | 51.4 | 41.5* / 60.6 | 52.0 | 47.4 | 45.4 |
| BrowseComp (w/ Context Manager) | 69.0 | 67.6 | 60.2/74.9 | 67.5 | 62.0 | 58.3 |
| BrowseComp-ZH | 66.9 | 65.0 | 62.3 / 62.3* | 66.6 | 47.8* | 51.2* |
| BrowseComp-ZH (w/ Context Manager) | 73.7 | — | —/— | — | — | — |
| GAIA (no file) | 84.5 | 75.1* | 75.6*/75.9* | 61.9* | 64.3* | 78.2* |
| xbench-DeepSearch (2025.05) | 83.7 | 78.0* | 76.0*/76.7* | 72.0* | 68.7* | 69.3* |
| xbench-DeepSearch (2025.10) | 56.3 | 55.7* | —/40+ | 52.3* | 43.0* | 44.0* |
| ResearchRubrics | 65.3 | 55.8* | 56.2*/59.5* | 62.0* | 60.2* | 54.3* |
|  |  |  | Reasoning |  |  |  |
| AIME 2025 | 97.3 | 93.1 | 94.5/96.1 | 95.7 | 83.0 | 94.1 (95.1*) |
| HMMT 2025 (Feb.) | 98.4 | 92.5 | 89.4/95.4 | 97.1 | 71.0* | 84.4 (95.4*) |
| HMMT 2025 (Nov.) | 94.0 | 90.2 | 89.2*/— | 93.5 | 74.3* | 91.0* |
| IMOAnswerBench | 85.4 | 78.3 | 78.6/81.8 | 82.0 | 60.4* | 80.9* |
|  |  |  | Coding |  |  |  |
| LiveCodeBench-V6 | 86.4 | 83.3 | 83.1/85.0 | 84.9 | — | 80.6 (81.6*) |
| SWE-bench Verified | 74.4 | 73.1 | 71.3/76.8 | 73.8 | 74.0 | 73.4 |
| Terminal-Bench 2.0 | 51.0 | 46.4 | 35.7*/50.8 | 41.0 | 47.9 | 38.5 |

### 表 3（页面 HTML 表格逐行转录）

| Component | Specification |
|---|---|
| Backbone | 45-layer Transformer (4,096 hidden dim) |
| Context Window | 256K |
| Vocabulary | 128,896 tokens |
| Total Parameters | 196.81B (196B Backbone + 0.81B Head) |
| Active Parameters | ~11B (per token generation) |

## 协议脚注

- 来源：https://github.com/stepfun-ai/Step-3.5-Flash（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 438x438 | https://github.com/stepfun-ai/Step-3.5-Flash/raw/main/assets/stepfun-1.png |  |
| images/11.png | 1808x1486 | https://github.com/stepfun-ai/Step-3.5-Flash/raw/main/assets/step-bar-chart.png |  |
| images/12.png | 800x533 | https://camo.githubusercontent.com/738e88f20da8ffb7abeaa9c7793987bbee3d9384e83c2ba43df00bbfe6f25e4c/68747470733a2f2f6170692e737461722d686973746f72792e636f6d2f696d6167653f7265706f733d7374657066756e2d61692f537465702d332e352d466c61736826747970653d64617465266c6567656e643d746f702d6c656674 | Star History Chart |
| images/13.png | 800x533 | https://camo.githubusercontent.com/9186ac67108af859aa80a6361e7c4ffe2af8968c00d329313fdcf61fa3587ea1/68747470733a2f2f6170692e737461722d686973746f72792e636f6d2f696d6167653f7265706f733d7374657066756e2d61692f537465702d332e352d466c61736826747970653d64617465267468656d653d6461726b266c6567656e643d746f702d6c656674 | [source] |
| images/14.png | 1200x600 | https://opengraph.githubassets.com/0167a8f1d5aa1735bad6d469b04d48b85e92a912ac296f52b1ad27f4d80c4823/stepfun-ai/Step-3.5-Flash | [og/twitter] |
