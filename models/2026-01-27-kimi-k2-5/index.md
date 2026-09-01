---
vendor: kimi
model: Kimi K2.5
release: kimi-k2-5
date: 2026-01-27
source: https://www.kimi.ai/blog/kimi-k2-5
fetched_at: 2026-09-01
---

# Kimi K2.5 发布（Visual Agentic Intelligence）

## 评测数据（转录）

附录 Benchmark table（页面内嵌 JSON 机器可读；列序 K2.5 Thinking / GPT-5.2 xhigh / Claude 4.5 Opus Extend / Gemini 3 Pro High / DeepSeek V3.2 Thinking / Qwen3-VL-235B-A22B Thinking）

| Benchmark | Kimi K2.5 (Thinking) | 备注 |
| --- | --- | --- |
| HLE-Full | 30.1 | w/ tools 50.2 |
| AIME 2025 | 96.1 | avg@32，96k 预算 |
| HMMT 2025 (Feb) | 95.4 | avg@32 |
| IMO-AnswerBench | 81.8 | |
| GPQA-Diamond | 87.6 | avg@8 |
| MMLU-Pro | 87.1 | |
| MMMU-Pro | 78.5 | |
| CharXiv (RQ) | 77.5 | |
| MathVision | 84.2 | |
| MathVista (mini) | 90.1 | |
| ZeroBench | 9 | w/ tools 11 |
| OCRBench | 92.3 | |
| OmniDocBench 1.5 | 88.8 | (1 - 归一化 Levenshtein) x 100 |
| InfoVQA (test) | 92.6 | |
| SimpleVQA | 71.2 | |
| WorldVQA | 46.3 | |
| VideoMMMU | 86.6 | |
| MMVU | 80.4 | |
| MotionBench | 70.4 | |
| VideoMME | 87.4 | |
| LongVideoBench | 79.8 | |
| LVBench | 75.9 | |
| SWE-Bench Verified | 76.8 | in-house 框架，非 thinking 模式最高分 |
| SWE-Bench Pro | 50.7 | |
| SWE-Bench Multilingual | 73.0 | |
| Terminal-Bench 2.0 | 50.8 | 非 thinking 模式（Terminus-2 不兼容上下文管理） |
| PaperBench | 63.5 | |
| CyberGym | 41.3 | |
| SciCode | 48.7 | |
| OJBench (cpp) | 57.4 | |
| LiveCodeBench (v6) | 85.0 | |
| Longbench v2 | 61.0 | ~128k 标准化输入 |
| AA-LCR | 70.0 | |
| BrowseComp | 60.6 | w/ctx mgm 74.9；Agent Swarm 78.4 |
| WideSearch (item-f1) | 72.7 | Agent Swarm 79.0 |
| DeepSearchQA | 77.1 | |
| FinSearchCompT2&T3 | 67.8 | |
| Seal-0 | 57.4 | |
| OSWorld-Verified | 63.3 | |
| WebArena | 58.9 | |

Agent Swarm 对照图（images/05.jpg）：BrowseComp / Wide Search / In-house Bench 对 Claude Opus 4.5。AI Office Bench 相对提升 59.3%（images/07.png）。

## 协议脚注

- 脚注（页面 DOM 文本）：HLE、AIME 2025、HMMT 2025 (Feb)、GPQA-Diamond、IMO-AnswerBench 以 96k completion 预算评估；AIME/HMMT avg@32、GPQA-Diamond avg@8；HLE 报告全量集（text+image）。
- 竞品列带 * 为 Kimi 转引标注；Qwen3-VL 列在多数行未报告。
- 页面正文以图片渲染该表，机器可读 JSON 在归档 page.html payload 中。

## 图片清单

- images/05.jpg — 1732x924 | Benchmark comparison: Kimi K2.5 Agent Swarm outperforming Claude Opus 4.5 on BrowseComp, Wide Search, and In-house Bench | 原URL: https://statics.kimi.ai/blogs/k2-5/20260127-131347.jpeg
- images/07.png — 4652x1084 | Benchmark results: Kimi K2.5 showing significant improvements over K2 Thinking, with 71.2% better performance in AI Offi | 原URL: https://statics.kimi.ai/blog/k2-5/20260127-152311.png

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
