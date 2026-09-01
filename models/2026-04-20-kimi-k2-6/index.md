---
vendor: kimi
model: Kimi K2.6
release: kimi-k2-6
date: 2026-04-20
source: https://www.kimi.ai/blog/kimi-k2-6
fetched_at: 2026-09-01
---

# Kimi K2.6 发布（Advancing Open-Source Coding）

## 评测数据（转录）

附录 Benchmark table（页面内嵌 JSON 机器可读；Kimi K2.6 列，竞品列 GPT-5.4 xhigh / Claude Opus 4.6 max / Gemini 3.1 Pro thinking high / Kimi K2.5）

| Benchmark | Kimi K2.6 |
| --- | --- |
| HLE-Full w/ tools | 54.0 |
| BrowseComp | 83.2 |
| BrowseComp (agent swarm) | 86.3 |
| DeepSearchQA (f1-score) | 92.5 |
| DeepSearchQA (accuracy) | 83.0 |
| WideSearch (item-f1) | 80.8 |
| Toolathlon | 50.0 |
| MCPMark | 55.9 |
| Claw Eval (pass^3) | 62.3 |
| Claw Eval (pass@3) | 80.9 |
| APEX-Agents | 27.9 |
| OSWorld-Verified | 73.1 |
| Terminal-Bench 2.0 (Terminus-2) | 66.7 |
| SWE-Bench Pro | 58.6 |
| SWE-Bench Multilingual | 76.7 |
| SWE-Bench Verified | 80.2 |
| SciCode | 52.2 |
| OJBench (python) | 60.6 |
| LiveCodeBench (v6) | 89.6 |
| HLE-Full | 34.7 |
| AIME 2026 | 96.4 |
| HMMT 2026 (Feb) | 92.7 |
| IMO-AnswerBench | 86.0 |
| GPQA-Diamond | 90.5 |
| MMMU-Pro | 79.4 |
| MMMU-Pro w/ python | 80.1 |
| CharXiv (RQ) | 80.4 |
| CharXiv (RQ) w/ python | 86.7 |
| MathVision | 87.4 |
| MathVision w/ python | 93.2 |
| BabyVision | 39.8 |
| BabyVision w/ python | 68.5 |
| V* w/ python | 96.9 |

Kimi Code Bench 图（images/06.webp）为发布主图。

## 协议脚注

- 脚注 3a：搜索 + code-interpreter + web-browsing 工具口径用于 HLE w/ tools 等行；BrowseComp 用 discard-all 上下文管理（与 K2.5、DeepSeek-V3.2 一致）。
- DeepSearchQA 同表给 f1 与 accuracy 两个口径；Claw Eval 给 pass^3 与 pass@3 两个口径，互不合并。
- MathVision / CharXiv / MMMU-Pro / BabyVision / V* 均有 w/ python 变体行。

## 图片清单

- images/06.webp — 7680x3496 | Kimi Code Bench | 原URL: https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-04-20/1d7j305qav1fc641b5670?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
