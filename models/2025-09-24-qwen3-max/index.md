---
vendor: qwen
model: Qwen3-Max（Instruct / Thinking）
release: qwen3-max
date: 2025-09-24
source: https://qwen.ai/blog?id=qwen3-max
fetched_at: 2026-09-01
---

# Qwen3-Max 发布

## 评测数据（转录）

Qwen3-Max-Instruct（images/04.png）

| Benchmark | Qwen3-Max | Qwen3-235B-A22B-Instruct-2507 | Claude Opus 4 (Non-thinking) | DeepSeek-V3.1 (Non-thinking) |
| --- | --- | --- | --- | --- |
| SuperGPQA | 65.1 | 62.6 | 56.5 | 59.8 |
| AIME25 | 81.6 | 70.3 | 33.9 | 49.8 |
| LiveCodeBench v6 (25.02-25.05) | 69.0 | 51.8 | 44.6 | 52.3 |
| tau2-Bench (Weighted) | 74.8 | 52.9 | 67.7 | 46.4 |
| SWE-Bench (Verified) | 69.6 | 52.2 | 72.5 | 66.0 |

Qwen3-Max-Thinking（images/05.jpg，均带 Python 工具）

| Benchmark | Qwen3-Max-Thinking (Heavy) | Qwen3-235B-A22B-Thinking-2507 | Grok4 Heavy | GPT-5 Pro |
| --- | --- | --- | --- | --- |
| AIME25 | 100.0 | 92.3 | 100.0 | 100.0 |
| HMMT25 | 100.0 | 83.9 | 96.7 | 100.0 |
| GPQA | 85.4 | 81.1 | 88.4 | 89.4 |

LMArena Text Arena（images/03.png 截图，Last Updated Sep 18, 2025）

| Rank (UB) | Model | Score | 95% CI | Votes |
| --- | --- | --- | --- | --- |
| 1 | gemini-2.5-pro | 1456 | ±5 | 46,291 |
| 1 | claude-opus-4-1-20250805-thinking-16k | 1449 | ±6 | 14,843 |
| 2 | o3-2025-04-16 | 1441 | ±4 | 46,083 |
| 2 | gpt-5-high | 1440 | ±6 | 17,636 |
| 3 | qwen3-max-preview | 1430 | ±7 | 11,851 |
| 5 | gpt-5-chat | 1430 | ±6 | 14,876 |

## 协议脚注

- Thinking 图三行均为 Heavy / w/ Python 口径；与 Instruct 图的 Non-thinking 口径不混比。
- LMArena 为第三方排行榜快照（Elo），非厂商自跑分数。

## 图片清单

- images/03.png — 2816x1662 | rendered page image | 原URL: https://qianwen-res.oss-accelerate.aliyuncs.com/Qwen3-Max/Qwen3-Max-Instruct-text_arena.png
- images/04.png — 2168x1334 | rendered page image | 原URL: https://qianwen-res.oss-accelerate.aliyuncs.com/Qwen3-Max/Qwen3-Max-Instruct.png
- images/05.jpg — 1920x1080 | rendered page image | 原URL: https://qianwen-res.oss-accelerate.aliyuncs.com/Qwen3-Max/Qwen3-Max-Thinking-blog.jpg

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
