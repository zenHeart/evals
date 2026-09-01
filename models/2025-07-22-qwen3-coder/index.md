---
vendor: qwen
model: Qwen3-Coder-480B-A35B-Instruct
release: qwen3-coder
date: 2025-07-22
source: https://qwenlm.github.io/blog/qwen3-coder/
fetched_at: 2026-09-01
---

# Qwen3-Coder 发布

## 评测数据（转录）

| Benchmark | Qwen3-Coder-480B-A35B | Kimi-K2-Instruct | DeepSeek-V3-0324 | Claude Sonnet-4 | OpenAI GPT-4.1 |
| --- | --- | --- | --- | --- | --- |
| Terminal-Bench | 37.5 | 30.0 | 2.5 | 35.5 | 25.3 |
| SWE-bench Verified w/ OpenHands, 500 turns | 69.6 | - | - | 70.4 | - |
| SWE-bench Verified w/ OpenHands, 100 turns | 67.0 | 65.4 | 38.8 | 68.0 | 48.6 |
| SWE-bench Verified w/ Private Scaffolding | - | 65.8 | - | 72.7 | 63.8 |
| SWE-bench Live | 26.3 | 22.3 | 13.0 | 27.7 | - |
| SWE-bench Multilingual | 54.7 | 47.3 | 13.0 | 53.3 | 31.5 |
| Multi-SWE-bench mini | 25.8 | 19.8 | 7.5 | 24.8 | - |
| Multi-SWE-bench flash | 27.0 | 20.7 | - | 25.0 | - |
| Aider-Polyglot | 61.8 | 60.0 | 56.9 | 56.4 | 52.4 |
| Spider2 | 31.1 | 25.2 | 12.8 | 31.1 | 16.5 |
| WebArena | 49.9 | 47.4 | 40.0 | 51.1 | 44.3 |
| Mind2Web | 55.8 | 42.7 | 36.0 | 47.4 | 49.6 |
| BFCL-v3 | 68.7 | 65.2 | 64.7 | 73.3 | 62.9 |
| TAU-Bench Retail | 77.5 | 70.7 | 59.1 | 80.5 | - |
| TAU-Bench Airline | 60.0 | 53.5 | 40.0 | 60.0 | - |

## 协议脚注

- 三组分别为 Agentic Coding / Agentic Browser Use / Agentic Tool Use（图内分组标题）。
- SWE-bench Verified 有 OpenHands-500-turns、OpenHands-100-turns、Private Scaffolding 三种 harness 口径，互相不可比；Qwen3-Coder 在 Private Scaffolding 行未报告（'-'）。

## 图片清单

- images/02.jpg — 3184x1817 | 原URL: https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3-Coder/qwen3-coder-main.jpg

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
