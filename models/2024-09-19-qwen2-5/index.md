---
vendor: qwen
model: Qwen2.5 家族（72B / Coder-7B / Math）
release: qwen2-5
date: 2024-09-19
source: https://qwenlm.github.io/blog/qwen2.5/
fetched_at: 2026-09-01
---

# Qwen2.5 发布

## 评测数据（转录）

Qwen2.5-72B-Instruct（images/03.jpg）

| Benchmark | Qwen2.5-72B | Qwen2-72B | Mistral-Large2 | Llama3.1-70B | Llama3.1-405B |
| --- | --- | --- | --- | --- | --- |
| MMLU-Pro | 71.1 | 64.4 | 69.4 | 66.4 | 73.3 |
| MMLU-redux | 86.8 | 81.6 | 83.0 | 83.0 | 86.2 |
| GPQA | 49.0 | 42.4 | 52.0 | 46.7 | 51.1 |
| MATH | 83.1 | 69.0 | 69.9 | 68.0 | 73.8 |
| GSM8K | 95.8 | 93.2 | 92.7 | 95.1 | 96.8 |
| HumanEval | 86.6 | 86.0 | 92.1 | 80.5 | 89.0 |
| MBPP | 88.2 | 80.2 | 80.0 | 84.2 | 84.5 |
| MultiPL-E | 75.1 | 69.2 | 76.9 | 68.2 | 73.5 |
| LiveCodeBench 2305-2409 | 55.5 | 32.2 | 42.2 | 32.1 | 41.6 |
| LiveBench 0831 | 52.3 | 41.5 | 48.5 | 46.6 | 53.2 |
| IFEval strict-prompt | 84.1 | 77.6 | 64.1 | 83.6 | 86.0 |
| Arena-Hard | 81.2 | 48.1 | 73.1 | 55.7 | 69.3 |
| AlignBench v1.1 (1-10) | 8.16 | 8.15 | 7.69 | 5.94 | 5.95 |
| MT-bench (1-10) | 9.35 | 9.12 | 8.61 | 8.79 | 9.08 |

Qwen2.5-Coder-7B-Instruct（images/08.png 环形图；列序 Qwen / DS-Coder-V2-Lite / DS-Coder-33B / CodeStral-22B / DS-Coder-6.7B）

| Benchmark | Qwen2.5-Coder-7B | DS-Coder-V2-Lite | DS-Coder-33B | CodeStral-22B | DS-Coder-6.7B |
| --- | --- | --- | --- | --- | --- |
| HumanEval | 88.4 | 81.1 | 79.3 | 78.6 | 78.1 |
| EvalPlus | 81.9 | 76.8 | 74.9 | 73.5 | 72.6 |
| Aider | 50.4 | 48.9 | 49.6 | 35.3 | 34.6 |
| LiveCodeBench | 35.9 | 24.3 | 27.7 | 32.9 | 20.5 |
| Spider | 82.0 | 74.6 | 73.8 | 76.6 | 70.0 |
| BIRD-SQL | 51.1 | 41.6 | 45.6 | 46.2 | 39.8 |
| BigCodeBench | 33.1 | 28.1 | 32.5 | 34.8 | 24.5 |
| McEval | 60.3 | 54.7 | 54.3 | 50.5 | 46.0 |
| MultiPL-E | 76.5 | 73.2 | 69.2 | 70.2 | 66.1 |
| CRUXEval | 65.9 | 53.0 | 52.8 | 62.2 | 43.9 |
| MBPP | 83.5 | 82.3 | 81.2 | 73.3 | 75.1 |

Qwen2.5-Math（images/09.png，MATH Zero-shot@1 散点标签）

| Model | MATH |
| --- | --- |
| Qwen2.5-Math-72B-Instruct | 85.9 |
| Qwen2-Math-72B-Instruct | 84.0 |
| Qwen2.5-Math-7B-Instruct | 83.6 |
| Qwen2-Math-7B-Instruct | 75.1 |
| Qwen2.5-Math-1.5B-Instruct | 75.8 |
| Qwen2-Math-1.5B-Instruct | 69.4 |

## 协议脚注

- 页面未提供逐项协议脚注；LiveCodeBench 窗口为 2305-2409，LiveBench 为 0831 快照，IFEval 为 strict-prompt。
- AlignBench / MT-bench 为 1-10 分制，不与百分数混比。

## 图片清单

- images/03.jpg — 1920x1080 | Qwen2.5-72B Instruct Performance | 原URL: https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen2.5/Qwen2.5-72B-Instruct-Score.jpg
- images/08.png — 2327x2243 | Qwen2.5-Coder Instruct Performance | 原URL: https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen2.5/Qwen2.5-Coder/coder-main.png
- images/09.png — 1920x1080 | Qwen2.5 Math Performance Across All Sizes | 原URL: http://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen2.5/2024-08-qwen2.5-math-allsize.png

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
