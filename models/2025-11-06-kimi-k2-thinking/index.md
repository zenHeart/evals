---
vendor: kimi
model: Kimi K2 Thinking
release: kimi-k2-thinking
date: 2025-11-06
source: https://www.kimi.ai/blog/kimi-k2-thinking
fetched_at: 2026-09-01
---

# Kimi K2 Thinking

## 评测数据（转录）

### 表 1（页面 HTML 表格逐行转录）

| Benchmark | Intro | K2 Thinking | GPT-5 (High) | Claude Sonnet 4.5 (Thinking) | K2 0905 | DeepSeek-V3.2 | Grok-4 |
|---|---|---|---|---|---|---|---|
| Reasoning Tasks |  |  |  |  |  |  |  |
| Humanity's Last Exam (Text-only) | no tools | 23.9 | 26.3 [3.b] | 19.8* | 7.9 | 19.8 | 25.4 [3.b] |
| w/ tools [4] | 44.9 | 41.7 [3.b] | 32.0* | 21.7 | 20.3* | 41.0 [3.b] |  |
| heavy [6] | 51.0 | 42.0 | — | — | — | 50.7 |  |
| AIME 2025 | no tools | 94.5 | 94.6 | 87.0 | 51.0 | 89.3 | 91.7 |
| w/ python | 99.1 | 99.6 | 100.0 | 75.2 | 58.1* | 98.8 |  |
| heavy [6] | 100.0 | 100.0 | — | — | — | 100.0 |  |
| HMMT 2025 | no tools | 89.4 | 93.3 | 74.6* | 38.8 | 83.6 | 90.0 |
| w/ python | 95.1 | 96.7 | 88.8* | 70.4 | 49.5* | 93.9 |  |
| heavy [6] | 97.5 | 100.0 | — | — | — | 96.7 |  |
| IMO-AnswerBench | no tools | 78.6 | 76.0* [3.c] | 65.9* | 45.8 | 76.0* | 73.1 |
| GPQA-Diamond | no tools | 84.5 | 85.7 | 83.4 | 74.2 | 79.9 | 87.5 |
| General Tasks |  |  |  |  |  |  |  |
| MMLU-Pro | no tools | 84.6 | 87.1 | 87.5 | 81.9 | 85.0 | — |
| MMLU-Redux | no tools | 94.4 | 95.3 | 95.6 | 92.7 | 93.7 | — |
| Longform Writing | no tools | 73.8 | 71.4 | 79.8 | 62.8 | 72.5 | — |
| HealthBench | no tools | 58.0 | 67.2 | 44.2 | 43.8 | 46.9 | — |
| Agentic Search Tasks [4] |  |  |  |  |  |  |  |
| BrowseComp | w/ tools | 60.2 | 54.9 | 24.1 | 7.4 | 40.1 | — |
| BrowseComp-ZH | w/ tools | 62.3 | 63.0* | 42.4* | 22.2 | 47.9 | — |
| Seal-0 | w/ tools | 56.3 | 51.4* | 53.4* | 25.2 | 38.5* | — |
| FinSearchComp-T3 | w/ tools | 47.4 | 48.5* | 44.0* | 10.4 | 27.0* | — |
| Frames | w/ tools | 87.0 | 86.0* | 85.0* | 58.1 | 80.2* | — |
| Coding Tasks [5] |  |  |  |  |  |  |  |
| SWE-bench Verified | w/ tools | 71.3 | 74.9 | 77.2 | 69.2 | 67.8 | — |
| SWE-bench Multilingual | w/ tools | 61.1 | 55.3* | 68.0 | 55.9 | 57.9 | — |
| Multi-SWE-bench | w/ tools | 41.9 | 39.3* | 44.3 | 33.5 | 30.6 | — |
| SciCode | no tools | 44.8 | 42.9 | 44.7 | 30.7 | 37.7 | — |
| LiveCodeBench v6 | no tools | 83.1 | 87.0* | 64.0* | 56.1* | 74.1 | — |
| OJ-Bench (cpp) | no tools | 48.7 | 56.2* | 30.4* | 25.5* | 38.2* | — |
| Terminal-Bench | w/ simulated tools (JSON) | 47.1 | 43.8 | 51.0 | 44.5 | 37.7 | — |

## 协议脚注

- 来源：https://www.kimi.ai/blog/kimi-k2-thinking（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 112x112 | https://statics.kimi.ai/kimi-web-seo/assets/kimi-logo-CegIMkbU.png | [raw-scan] |
