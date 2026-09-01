---
vendor: deepseek
model: DeepSeek-V4-Flash-Vision-Exp
release: deepseek-v4-flash-vision-exp
date: 2026-08-21
source: https://api-docs.deepseek.com/zh-cn/news/news260821
fetched_at: 2026-09-01
---

# DeepSeek-V4-Flash-Vision-Exp 上线

## 评测数据（转录）

| Benchmark | V4-Flash-Vision-Exp | V4-Flash-0731 | Opus-4.8 |
| --- | --- | --- | --- |
| Terminal Bench 2.1 | 83.9 | 82.7 | 85.0 |
| NL2Repo | 57.7 | 54.2 | 69.7 |
| Cybergym | 75.3 | 76.7 | 78.3 |
| DeepSWE | 59.3 | 54.4 | 58.0 |
| Toolathlon-Verified | 75.9 | 70.3 | 76.2 |
| DSBench-Hard | 63.6 | 59.6 | 71.7 |
| AutomationBench (Public) | 25.7 | 25.1 | 27.2 |
| ApexBench (Pass@1) | 36.5 | 26.2** | 39.4 |
| Agents' Last Exam | 27.3 | 25.2** | 25.7 |
| Chartography | 64.3 | - | 65.0 |
| ZeroBench (Pass@5) | 35.0 | - | 34.0 |

## 协议脚注

- 上半组为「文本 Agent 能力评测*」，下半组为「多模态 Agent 能力评测」；`**` 为页面原有脚注标记。
- DeepSWE 行为 DeepSeek 自有 harness，与 DeepSWE 官方 mini-SWE-agent 协议不同。
- ZeroBench 为 Pass@5 口径，不与 Pass@1 行混比。

## 图片清单

- images/02.png — 2495x1680 | 原URL: https://api-docs.deepseek.com/zh-cn/img/v4_260821_benchmark_cn.png

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
