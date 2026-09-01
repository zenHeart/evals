---
vendor: qwen
model: Qwen3 家族（235B-A22B / 30B-A3B 等）
release: qwen3
date: 2025-04-29
source: https://qwenlm.github.io/blog/qwen3/
fetched_at: 2026-09-01
---

# Qwen3 发布

## 评测数据（转录）

Qwen3-235B-A22B 与 Qwen3-32B（images/03.jpg）

| Benchmark | Qwen3-235B-A22B | Qwen3-32B | OpenAI-o1 | Deepseek-R1 | Grok 3 Beta | Gemini2.5-Pro | OpenAI-o3-mini |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ArenaHard | 95.6 | 93.8 | 92.1 | 93.2 | - | 96.4 | 89.0 |
| AIME'24 | 85.7 | 81.4 | 74.3 | 79.8 | 83.9 | 92.0 | 79.6 |
| AIME'25 | 81.5 | 72.9 | 79.2 | 70.0 | 77.3 | 86.7 | 74.8 |
| LiveCodeBench v5 (24.10-25.02) | 70.7 | 65.7 | 63.9 | 64.3 | 70.6 | 70.4 | 66.3 |
| CodeForces (Elo) | 2056 | 1977 | 1891 | 2029 | - | 2001 | 2036 |
| Aider (Pass@2) | 61.8 | 50.2 | 61.7 | 56.9 | 53.3 | 72.9 | 53.8 |
| LiveBench 2024-11-25 | 77.1 | 74.9 | 75.7 | 71.6 | - | 82.4 | 70.0 |
| BFCL v3 | 70.8 | 70.3 | 67.8 | 56.9 | - | 62.9 | 64.6 |
| MultiIF (8 Languages) | 71.9 | 73.0 | 48.8 | 67.7 | - | 77.8 | 48.4 |

Qwen3-30B-A3B 与 Qwen3-4B（images/04.jpg）

| Benchmark | Qwen3-30B-A3B | QwQ-32B | Qwen3-4B | Qwen2.5-72B | Gemma3-27B | DeepSeek-V3 | GPT-4o |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ArenaHard | 91.0 | 89.5 | 76.6 | 81.2 | 86.8 | 85.5 | 85.3 |
| AIME'24 | 80.4 | 79.5 | 73.8 | 18.9 | 32.6 | 39.2 | 11.1 |
| AIME'25 | 70.9 | 69.5 | 65.6 | 15.0 | 24.0 | 28.8 | 7.6 |
| LiveCodeBench v5 | 62.6 | 62.7 | 54.2 | 30.7 | 26.9 | 33.1 | 32.7 |
| CodeForces (Elo) | 1974 | 1982 | 1671 | 859 | 1063 | 1134 | 864 |
| GPQA | 65.8 | 65.6 | 55.9 | 49.0 | 42.4 | 59.1 | 46.0 |
| LiveBench 2024-11-25 | 74.3 | 72.0 | 63.6 | 51.4 | 49.2 | 60.5 | 52.2 |
| BFCL v3 | 69.1 | 66.4 | 65.9 | 63.4 | 59.1 | 57.6 | 72.5 |
| MultiIF (8 Languages) | 72.2 | 68.3 | 66.3 | 65.3 | 69.8 | 55.6 | 65.6 |

## 协议脚注

- 图内脚注：1) AIME 24/25 每题采样 64 次取平均，AIME'25 为 Part I+II 共 30 题；2) Aider 行 Qwen3 未激活 think 模式；3) BFCL 行 Qwen3 用 FC 格式，基线取 FC/prompt 两格式最高分。

## 图片清单

- images/03.jpg — 3413x1920 | 原URL: https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3/qwen3-235a22.jpg
- images/04.jpg — 3413x1920 | 原URL: https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3/qwen3-30a3.jpg

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
