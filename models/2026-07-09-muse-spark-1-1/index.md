---
vendor: meta
model: Muse Spark 1.1
release: muse-spark-1-1
date: 2026-07-09
source: https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/
fetched_at: 2026-09-01
---

# Introducing Muse Spark 1.1

## 评测数据（转录）

> 本页 benchmark 数值全部以图片图表呈现（`images/02.png`–`images/10.png`），因此全部行均为视觉转写；`images/03.png`、`images/04.png` 为 JobBench、MCP Atlas 的条形图渲染，与主表数值一致。

### 主基准表（images/02.png，视觉转写）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| MCP Atlas（Scaled tool use） | 88.1 | Muse Spark 1.1 / Meta (视觉转写) |
| MCP Atlas（Scaled tool use） | 82.2 | Muse Spark / Meta (视觉转写) |
| MCP Atlas（Scaled tool use） | 78.2 | Gemini 3.1 Pro (high) / Google (视觉转写) |
| MCP Atlas（Scaled tool use） | 82.2 | Opus 4.8 (max) / Anthropic (视觉转写) |
| MCP Atlas（Scaled tool use） | 75.3 | GPT 5.5 (xhigh) / OpenAI (视觉转写) |
| JobBench（Professional tool use） | 54.7 | Muse Spark 1.1 / Meta (视觉转写) |
| JobBench（Professional tool use） | 17.0 | Muse Spark / Meta (视觉转写) |
| JobBench（Professional tool use） | 15.9 | Gemini 3.1 Pro (high) / Google (视觉转写) |
| JobBench（Professional tool use） | 48.4 | Opus 4.8 (max) / Anthropic (视觉转写) |
| JobBench（Professional tool use） | 38.3 | GPT 5.5 (xhigh) / OpenAI (视觉转写) |
| Toolathlon-Verified（Personal tool use） | 75.6 | Muse Spark 1.1 / Meta (视觉转写) |
| Toolathlon-Verified（Personal tool use） | 49.4 | Muse Spark / Meta (视觉转写) |
| Toolathlon-Verified（Personal tool use） | 61.1 | Gemini 3.1 Pro (high) / Google (视觉转写) |
| Toolathlon-Verified（Personal tool use） | 76.2 | Opus 4.8 (max) / Anthropic (视觉转写) |
| Toolathlon-Verified（Personal tool use） | 73.5 | GPT 5.5 (xhigh) / OpenAI (视觉转写) |
| OSWorld-Verified（Agentic computer use） | 80.8 | Muse Spark 1.1 / Meta (视觉转写) |
| OSWorld-Verified（Agentic computer use） | 53.3 | Muse Spark / Meta (视觉转写) |
| OSWorld-Verified（Agentic computer use） | 76.2 | Gemini 3.1 Pro (high) / Google (视觉转写) |
| OSWorld-Verified（Agentic computer use） | 83.4 | Opus 4.8 (max) / Anthropic (视觉转写) |
| OSWorld-Verified（Agentic computer use） | 78.7 | GPT 5.5 (xhigh) / OpenAI (视觉转写) |
| Humanity's Last Exam（Multidisciplinary reasoning, w/ tools） | 62.1 | Muse Spark 1.1 / Meta (视觉转写) |
| Humanity's Last Exam（Multidisciplinary reasoning, w/ tools） | 50.4 | Muse Spark / Meta (视觉转写) |
| Humanity's Last Exam（Multidisciplinary reasoning, w/ tools） | 51.4 | Gemini 3.1 Pro (high) / Google (视觉转写) |
| Humanity's Last Exam（Multidisciplinary reasoning, w/ tools） | 57.9 | Opus 4.8 (max) / Anthropic (视觉转写) |
| Humanity's Last Exam（Multidisciplinary reasoning, w/ tools） | 52.2 | GPT 5.5 (xhigh) / OpenAI (视觉转写) |
| Finance Agent v2（Agentic financial anaysis） | 57.2 | Muse Spark 1.1 / Meta (视觉转写) |
| Finance Agent v2（Agentic financial anaysis） | — | Muse Spark / Meta（图中无数据）(视觉转写) |
| Finance Agent v2（Agentic financial anaysis） | 43.0 | Gemini 3.1 Pro (high) / Google (视觉转写) |
| Finance Agent v2（Agentic financial anaysis） | 53.9 | Opus 4.8 (max) / Anthropic (视觉转写) |
| Finance Agent v2（Agentic financial anaysis） | 51.8 | GPT 5.5 (xhigh) / OpenAI (视觉转写) |
| Terminal-Bench 2.1（Agentic terminal coding） | 80.0 | Muse Spark 1.1 / Meta (视觉转写) |
| Terminal-Bench 2.1（Agentic terminal coding） | 67.3 | Muse Spark / Meta (视觉转写) |
| Terminal-Bench 2.1（Agentic terminal coding） | 70.3 | Gemini 3.1 Pro (high) / Google (视觉转写) |
| Terminal-Bench 2.1（Agentic terminal coding） | 82.7 | Opus 4.8 (max) / Anthropic (视觉转写) |
| Terminal-Bench 2.1（Agentic terminal coding） | 83.4 | GPT 5.5 (xhigh) / OpenAI (视觉转写) |
| SWE-Bench Pro（Diverse software engineering） | 61.5 | Muse Spark 1.1 / Meta (视觉转写) |
| SWE-Bench Pro（Diverse software engineering） | 55.0 | Muse Spark / Meta (视觉转写) |
| SWE-Bench Pro（Diverse software engineering） | 54.2 | Gemini 3.1 Pro (high) / Google (视觉转写) |
| SWE-Bench Pro（Diverse software engineering） | 69.2 | Opus 4.8 (max) / Anthropic (视觉转写) |
| SWE-Bench Pro（Diverse software engineering） | 58.6 | GPT 5.5 (xhigh) / OpenAI (视觉转写) |
| DeepSWE 1.1（Long-horizon agentic coding） | 53.3 | Muse Spark 1.1 / Meta (视觉转写) |
| DeepSWE 1.1（Long-horizon agentic coding） | 10.0 | Muse Spark / Meta (视觉转写) |
| DeepSWE 1.1（Long-horizon agentic coding） | 12.0 | Gemini 3.1 Pro (high) / Google (视觉转写) |
| DeepSWE 1.1（Long-horizon agentic coding） | 59.0 | Opus 4.8 (max) / Anthropic (视觉转写) |
| DeepSWE 1.1（Long-horizon agentic coding） | 67.0 | GPT 5.5 (xhigh) / OpenAI (视觉转写) |
| CharXiv Reasoning（Chart QA） | 88.4 | Muse Spark 1.1 / Meta (视觉转写) |
| CharXiv Reasoning（Chart QA） | 88.9 | Muse Spark / Meta (视觉转写) |
| CharXiv Reasoning（Chart QA） | 81.6 | Gemini 3.1 Pro (high) / Google (视觉转写) |
| CharXiv Reasoning（Chart QA） | 89.9 | Opus 4.8 (max) / Anthropic (视觉转写) |
| CharXiv Reasoning（Chart QA） | 84.8 | GPT 5.5 (xhigh) / OpenAI (视觉转写) |
| BabyVision（Visual reasoning） | 76.3 | Muse Spark 1.1 / Meta (视觉转写) |
| BabyVision（Visual reasoning） | 39.9 | Muse Spark / Meta (视觉转写) |
| BabyVision（Visual reasoning） | 51.5 | Gemini 3.1 Pro (high) / Google (视觉转写) |
| BabyVision（Visual reasoning） | 81.2 | Opus 4.8 (max) / Anthropic (视觉转写) |
| BabyVision（Visual reasoning） | 83.6 | GPT 5.5 (xhigh) / OpenAI (视觉转写) |

### 主表之外的评测图（视觉转写）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| DeepSearchQA（images/05.png） | 87.8 | GPT 5.5 (xhigh) (视觉转写) |
| DeepSearchQA（images/05.png） | 84.9 | Muse Spark 1.1 (视觉转写) |
| DeepSearchQA（images/05.png） | 84.3 | Opus 4.8 (max) (视觉转写) |
| DeepSearchQA（images/05.png） | 76.8 | Muse Spark (视觉转写) |
| DeepSearchQA（images/05.png） | 71.3 | Gemini 3.1 Pro (high) (视觉转写) |
| Vibe Code Bench v1.1（images/08.png） | 72.2 | Muse Spark 1.1 (视觉转写) |
| Vibe Code Bench v1.1（images/08.png） | 19.7 | Muse Spark (视觉转写) |
| SWE Atlas – Codebase QnA（images/08.png） | 42.0 | Muse Spark 1.1 (视觉转写) |
| SWE Atlas – Codebase QnA（images/08.png） | 24.2 | Muse Spark (视觉转写) |
| Meta Internal Coding Bench（images/09.png） | 69.0 | Opus 4.8 (max) (视觉转写) |
| Meta Internal Coding Bench（images/09.png） | 68.3 | Muse Spark 1.1 (视觉转写) |
| Meta Internal Coding Bench（images/09.png） | 67.1 | GPT 5.5 (xhigh) (视觉转写) |
| Meta Internal Coding Bench（images/09.png） | 59.2 | Gemini 3.1 Pro (high) (视觉转写) |
| Meta Internal Coding Bench（images/09.png） | 58.8 | Muse Spark (视觉转写) |
| OSWorld 2.0（score vs cost/task, images/07.png） | — | 图表仅定性展示成本-分数曲线：Muse Spark 1.1 约 $2–6/task 达最高约 49 分，优于同价位对照（无逐点数值标注）(视觉转写) |
| WideSearch（multi-agent vs single-agent, images/06.png） | — | 图表仅定性展示：多代理分数（约 73–79）高于单代理（约 68–74），横轴为延迟代理值 5k–20k，无逐点数值标注 (视觉转写) |
| BabyVision（score vs cost/task, images/10.png） | — | 图表仅定性展示成本-分数曲线：Muse Spark 1.1 约 $0.08–0.25/task 达 71–77 分（无逐点数值标注）；数值见主表 BabyVision 行 (视觉转写) |

### 页面文本中的定性描述

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Meta Internal Coding Bench | — | 页面仅定性描述："Muse Spark 1.1 significantly improves upon Muse Spark and is competitive with leading alternatives"（数值见 images/09.png） |
| 安全评测（Frontier risk categories） | — | 页面仅定性描述："our evaluations show Muse Spark 1.1 operates within safe margins"，含 Chemical & Biological、Cybersecurity、Loss of Control 三类 |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 playwright-rendered。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.png — 2880x1620 | 原URL: https://scontent-hkg1-2.xx.fbcdn.net/v/t39.2365-6/741592324_1015424028134213_6852610220...
- images/02.png — 1620x1620 | alt=Inference-time compute scaling chart for Muse Image | 原URL: https://lookaside.fbsbx.com/elementpath/media/
- images/03.png — 1620x1620 | alt=Text-to-image arena leaderboard chart | 原URL: https://lookaside.fbsbx.com/elementpath/media/
- images/04.png — 1620x1620 | alt=Single-image edit arena leaderboard chart | 原URL: https://lookaside.fbsbx.com/elementpath/media/
- images/05.png — 1620x1620 | alt=Multi-image edit arena leaderboard chart | 原URL: https://lookaside.fbsbx.com/elementpath/media/
- images/06.png — 2880x1620 | alt=Inference-time compute scaling chart for Muse Image | 原URL: https://lookaside.fbsbx.com/elementpath/media/
- images/07.png — 2880x1620 | alt=Inference-time compute scaling chart for Muse Image | 原URL: https://lookaside.fbsbx.com/elementpath/media/
- images/08.png — 2880x1620 | alt=Inference-time compute scaling chart for Muse Image | 原URL: https://lookaside.fbsbx.com/elementpath/media/
- images/09.png — 1620x1620 | alt=Inference-time compute scaling chart for Muse Image | 原URL: https://lookaside.fbsbx.com/elementpath/media/
- images/10.png — 2880x1620 | alt=Inference-time compute scaling chart for Muse Image | 原URL: https://lookaside.fbsbx.com/elementpath/media/
