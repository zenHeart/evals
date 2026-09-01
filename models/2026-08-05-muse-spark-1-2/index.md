---
vendor: meta
model: Muse Spark 1.2 / Muse Code
release: muse-spark-1-2
date: 2026-08-05
source: https://research.meta.ai/blog/introducing-muse-code-and-muse-spark-1-2
fetched_at: 2026-09-01
---

# Introducing Muse Code and Muse Spark 1.2

## 评测数据（转录）

> 本页正文无任何 benchmark 分数，数值全部在图片图表中（`images/05.png`–`images/08.png`，与 `images/01.webp`–`images/04.webp` 为同一组图的优化变体），因此全部行均为视觉转写。

### 评测图转录（视觉转写）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Terminal-Bench 2.1（images/05.png） | 86.7% | Opus 5 (max) / Claude Code (视觉转写) |
| Terminal-Bench 2.1（images/05.png） | 82.9% | Muse Spark 1.2 / Muse Code (视觉转写) |
| Terminal-Bench 2.1（images/05.png） | 81.8% | GPT 5.6 Terra (max) / Codex (视觉转写) |
| Terminal-Bench 2.1（images/05.png） | 81.6% | Grok 4.5 (high) / Grok Build (视觉转写) |
| Terminal-Bench 2.1（images/05.png） | 78.9% | Gemini 3.6 Flash (high) / Antigravity CLI (视觉转写) |
| Terminal-Bench 2.1（images/05.png） | 76.2% | Muse Spark 1.1 / mini-swe-agent (视觉转写) |
| DeepSWE 1.1（images/06.png） | 65.0% | Opus 5 (max) / Claude Code (视觉转写) |
| DeepSWE 1.1（images/06.png） | 64.8% | GPT 5.6 Terra (max) / Codex (视觉转写) |
| DeepSWE 1.1（images/06.png） | 59.3% | Muse Spark 1.2 / Muse Code (视觉转写) |
| DeepSWE 1.1（images/06.png） | 56.6% | Grok 4.5 (high) / Grok Build (视觉转写) |
| DeepSWE 1.1（images/06.png） | 53.0% | Muse Spark 1.1 / mini-swe-agent (视觉转写) |
| DeepSWE 1.1（images/06.png） | 40.0% | Gemini 3.6 Flash (high) / Antigravity CLI (视觉转写) |
| Meta Internal Coding Bench（images/07.png） | 79.4% | Opus 5 (max) (视觉转写) |
| Meta Internal Coding Bench（images/07.png） | 70.6% | Muse Spark 1.2 (视觉转写) |
| Meta Internal Coding Bench（images/07.png） | 68.3% | Muse Spark 1.1 (视觉转写) |
| Meta Internal Coding Bench（images/07.png） | 65.4% | GPT 5.6 Terra (max) (视觉转写) |
| Meta Internal Coding Bench（images/07.png） | 63.9% | Gemini 3.6 Flash (high) (视觉转写) |
| KDA 内核优化：Speedup vs Baseline（images/08.png） | +68.7% | Muse Spark 1.2（曲线末端标注）(视觉转写) |
| KDA 内核优化：Speedup vs Baseline（images/08.png） | +71.2% | GPT 5.6 Sol（曲线末端标注）(视觉转写) |
| KDA 内核优化：Speedup vs Baseline（images/08.png） | +65.1% | GPT 5.6 Terra（曲线末端标注）(视觉转写) |
| KDA 内核优化：Speedup vs Baseline（images/08.png） | +62.5% | Gemini 3.6 Flash（曲线末端标注）(视觉转写) |
| KDA 内核优化：Speedup vs Baseline（images/08.png） | +69.6% | Opus 4.8（曲线末端标注）(视觉转写) |
| KDA 内核优化：Speedup vs Baseline（images/08.png） | +74.0% | Opus 5（曲线末端标注）(视觉转写) |

### 页面文本中的定性描述

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| KDA / MLA 内核迭代优化（1000+ 次工具调用，最长 24 小时） | — | 页面仅定性描述："The agent continues to achieve substantial improvements over the provided baseline implementation"（基准环境：PyTorch 参考实现，batch size 1，64 heads，序列长度 8192，latent 维度 512，NVIDIA Hopper GPU） |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 1080x1080 | alt='Bar chart comparing Terminal-Bench 2.1 scores for Muse\xa0Spark\xa01.2 and other coding models.' | 原URL: https://research.meta.ai/_next/image
- images/02.webp — 1080x1080 | alt='Bar chart comparing DeepSWE 1.1 scores for Muse\xa0Spark\xa01.2 and other coding models.' | 原URL: https://research.meta.ai/_next/image
- images/03.webp — 1080x1080 | alt='Bar chart comparing Meta Internal Coding Bench scores for Muse\xa0Spark\xa01.2 and other coding models.' | 原URL: https://research.meta.ai/_next/image
- images/04.webp — 1916x1080 | alt='Chart comparing KDA kernel speedup against the baseline over cumulative tool calls for Muse\xa0Spark\xa01.2 and other models.' | 原URL: https://research.meta.ai/_next/image
- images/05.png — 1080x1080 | 原URL: https://research.meta.ai/articles/introducing-muse-code-and-muse-spark-1-2/evaluations/...
- images/06.png — 1080x1080 | 原URL: https://research.meta.ai/articles/introducing-muse-code-and-muse-spark-1-2/evaluations/...
- images/07.png — 1080x1080 | 原URL: https://research.meta.ai/articles/introducing-muse-code-and-muse-spark-1-2/evaluations/...
- images/08.png — 1916x1080 | 原URL: https://research.meta.ai/articles/introducing-muse-code-and-muse-spark-1-2/kernel-optim...
- images/09.png — 1200x630 | 原URL: https://lookaside.fbsbx.com/elementpath/media/
