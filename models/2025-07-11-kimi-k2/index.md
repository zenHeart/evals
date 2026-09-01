---
vendor: kimi
model: Kimi-K2-Instruct
release: kimi-k2
date: 2025-07-11
source: https://www.kimi.ai/blog/kimi-k2
fetched_at: 2026-09-01
---

# Kimi K2: Open Agentic Intelligence

## 评测数据（转录）

### 表 1（页面 HTML 表格逐行转录）

| Benchmark | Intro | Kimi-K2-Instruct | DeepSeek-V3-0324 | Qwen3-235B-A22B (Non-thinking) | Claude Sonnet 4 (w/o extended thinking) | Claude Opus 4 (w/o extended thinking) | GPT-4.1 | Gemini 2.5 Flash Preview (05-20) |
|---|---|---|---|---|---|---|---|---|
| Coding Tasks |  |  |  |  |  |  |  |  |
| LiveCodeBench v6 (Aug 24-May 25) | Pass@1 | 53.7 | 46.9 | 37.0 | 48.5 | 47.4 | 44.7 | 44.7 |
| OJBench | Pass@1 | 27.1 | 24.0 | 11.3 | 15.3 | 19.6 | 19.5 | 19.5 |
| MultiPL-E | Pass@1 | 85.7 | 83.1 | 78.2 | 88.6 | 89.6 | 86.7 | 85.6 |
| SWE-bench Verified (Agentless Coding) | Single Patch without Test (Acc) | 51.8 | 36.6 | 39.4 | 50.2 | 53.0 | 40.8 | 32.6 |
| SWE-bench Verified (Agentic Coding) | Single Attempt (Acc) | 65.8 | 38.8 | 34.4 | 72.7* | 72.5* | 54.6 | — |
| SWE-bench Verified (Agentic Coding) | Multiple Attempts (Acc) | 71.6 | — | — | 80.2* | 79.4* | — | — |
| SWE-bench Multilingual (Agentic Coding) | Single Attempt (Acc) | 47.3 | 25.8 | 20.9 | 51.0 | — | 31.5 | — |
| TerminalBench | Inhouse Framework (Acc) | 30.0 | — | — | 35.5 | 43.2 | 8.3 | — |
| TerminalBench | Terminus (Acc) | 25.0 | 16.3 | 6.6 | — | — | 30.3 | 16.8 |
| Aider-Polyglot | Acc | 60.0 | 55.1 | 61.8 | 56.4 | 70.7 | 52.4 | 44.0 |
| Tool Use Tasks |  |  |  |  |  |  |  |  |
| Tau2 retail | Avg@4 | 70.6 | 69.1 | 57.0 | 75.0 | 81.8 | 74.8 | 64.3 |
| Tau2 airline | Avg@4 | 56.5 | 39.0 | 26.5 | 55.5 | 60.0 | 54.5 | 42.5 |
| Tau2 telecom | Avg@4 | 65.8 | 32.5 | 22.1 | 45.2 | 57.0 | 38.6 | 16.9 |
| AceBench | Acc | 76.5 | 72.7 | 70.5 | 76.2 | 75.6 | 80.1 | 74.5 |
| Math & STEM Tasks |  |  |  |  |  |  |  |  |
| AIME 2024 | Avg@64 | 69.6 | 59.4* | 40.1* | 43.4 | 48.2 | 46.5 | 61.3 |
| AIME 2025 | Avg@64 | 49.5 | 46.7 | 24.7* | 33.1* | 33.9* | 37.0 | 46.6 |
| MATH-500 | Acc | 97.4 | 94.0* | 91.2* | 94.0 | 94.4 | 92.4 | 95.4 |
| HMMT 2025 | Avg@32 | 38.8 | 27.5 | 11.9 | 15.9 | 15.9 | 19.4 | 34.7 |
| CNMO 2024 | Avg@16 | 74.3 | 74.7 | 48.6 | 60.4 | 57.6 | 56.6 | 75.0 |
| PolyMath-en | Avg@4 | 65.1 | 59.5 | 51.9 | 52.8 | 49.8 | 54.0 | 49.9 |
| ZebraLogic | Acc | 89.0 | 84.0 | 37.7* | 79.7 | 59.3 | 58.5 | 57.9 |
| AutoLogi | Acc | 89.5 | 88.9 | 83.3* | 89.8 | 86.1 | 88.2 | 84.1 |
| GPQA-Diamond | Avg@8 | 75.1 | 68.4* | 62.9* | 70.0* | 74.9* | 66.3 | 68.2 |
| SuperGPQA | Acc | 57.2 | 53.7 | 50.2 | 55.7 | 56.5 | 50.8 | 49.6 |
| Humanity's Last Exam (Text Only) | Acc | 4.7 | 5.2 | 5.7 | 5.8 | 7.1 | 3.7 | 5.6 |
| General Tasks |  |  |  |  |  |  |  |  |
| MMLU | EM | 89.5 | 89.4 | 87.0 | 91.5 | 92.9 | 90.4 | 90.1 |
| MMLU-Redux | EM | 92.7 | 90.5 | 89.2* | 93.6 | 94.2 | 92.4 | 90.6 |
| MMLU-Pro | EM | 81.1 | 81.2* | 77.3 | 83.7 | 86.6 | 81.8 | 79.4 |
| IFEval | Prompt Strict | 89.8 | 81.1 | 83.2* | 87.6 | 87.4 | 88.0 | 84.3 |
| Multi-Challenge | Acc | 54.1 | 31.4 | 34.0 | 46.8 | 49.0 | 36.4 | 39.5 |
| SimpleQA | Correct | 31.0 | 27.7 | 13.2 | 15.9 | 22.8 | 42.3 | 23.3 |
| Livebench (2024/11/25) | Pass@1 | 76.4 | 72.4 | 67.6 | 74.8 | 74.6 | 69.8 | 67.8 |

## 协议脚注

- 来源：https://www.kimi.ai/blog/kimi-k2（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 1919x1152 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/4/2026-07-13/d9af7sff2ena62011o2g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 | Training loss vs tokens: Muon vs AdamW |
| images/02.png | 2482x770 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/4/2026-07-13/d9af7svf2ena62011o3g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 | Kimi K2 agentic data synthesis workflow |
| images/03.png | 112x112 | https://statics.kimi.ai/kimi-web-seo/assets/kimi-logo-CegIMkbU.png | [raw-scan] |
