---
vendor: kimi
model: Kimi K3
release: kimi-k3
date: 2026-07-01
source: https://www.kimi.ai/blog/kimi-k3
fetched_at: 2026-09-01
---

# Kimi K3 发布（Open Frontier Intelligence）

## 评测数据（转录）

附录 Full Benchmark Table（页面内嵌 JSON 机器可读；列序 Kimi K3 max / Claude Fable 5 / GPT 5.6 Sol / Claude Opus 4.8 / GPT 5.5 xhigh / GLM-5.2）

| Benchmark | Kimi K3 (max) | Harness（列注释） |
| --- | --- | --- |
| DeepSWE | 67.5 | Kimi Code |
| Program Bench | 77.8 | Kimi Code |
| Terminal Bench 2.1 | 88.3 | Kimi Code |
| FrontierSWE (Dominance) | 81.2 | 截至 2026-07-16 |
| SWE Marathon | 42.0 | Claude Code |
| PostTrain Bench | 36.6 | Claude Code |
| MLS Bench (Lite) | 48.3 | Kimi Code |
| Kimi Code Bench 2.0 (Internal) | 72.9 | |
| GDPval-AA v2 (Elo) | 1668 | |
| BrowseComp | 91.2 | |
| DeepSearchQA (f1) | 95.0 | |
| Toolathlon-Verified | 73.2 | |
| MCP Atlas | 84.2 | |
| Automation Bench | 30.8 | |
| Job Bench | 52.9 | |
| AA-Briefcase (Elo) | 1548 | |
| APEX-Agents | 41.0 | |
| Office QA Pro | 63.3 | |
| SpreadsheetBench 2 | 34.8 | |
| DECK-Bench (Internal) | 73.5 | |
| GPQA-Diamond | 93.5 | |
| HLE-Full | 43.5 | w/ tools 56.0 |
| MMMU-Pro | 81.6 | w/ python 83.4 |
| CharXiv (RQ) | 84.8 | w/ python 91.3 |
| MathVision | 94.3 | w/ python 97.8 |
| BabyVision w/ python | 85.7 | |
| ZeroBench main (pass@5) | 23.0 | w/ python 41.0 |
| WorldVQA ForceAnswer | 51.0 | |
| OmniDocBench | 91.1 | |
| PerceptionBench | 58.5 | |

对照脚注行：1M 上下文、无上下文管理条件下 BrowseComp = 90.4（prose）。

## 协议脚注

- 全局脚注：K3 全部结果 reasoning effort = max，temperature=1.0，top-p=1.0；harness 按 benchmark 分为 Kimi Code / Claude Code / Codex。
- DeepSWE 行采用官方 DeepSWE 排行榜 mini-SWE-agent 值 67.3（footnote），表中 67.5 为 Kimi Code harness 值，两值不合并。
- SWE Marathon 为 H20 校准分支；PostTrain Bench 为 Harbor 实现三跑均值（H20）；FrontierSWE 为 dominance 分数；ZeroBench 为 pass@5 五跑。
- 竞品行多为 best-across-harness（GLM-5.2 Claude Code、Opus/Fable Terminus 2、GPT Sol Codex），非同协议。

## 图片清单

- images/06.png — 7110x4308 | Kimi K3 benchmark comparison | 原URL: https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chl6mdcmosb3rnlehg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1
- images/11.png — 7110x4242 | 原URL: https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chlgn6rtp4tqfnnmjg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1
- images/16.png — 7110x5730 | Kimi K3 benchmark comparison | 原URL: https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chkpqav1fc645qbcj0?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1
- images/21.png — 7110x5722 | 原URL: https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chlbnf2ena6205244g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
