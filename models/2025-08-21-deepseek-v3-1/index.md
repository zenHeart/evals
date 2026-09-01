---
vendor: deepseek
model: DeepSeek-V3.1
release: deepseek-v3-1
date: 2025-08-21
source: https://api-docs.deepseek.com/zh-cn/news/news250821
fetched_at: 2026-09-01
---

# DeepSeek V3.1 发布

## 评测数据（转录）

表 1（Coding Agent）

| Benchmark | DeepSeek-V3.1 | DeepSeek-V3-0324 | DeepSeek-R1-0528 |
| --- | --- | --- | --- |
| SWE-bench Verified | 66.0 | 45.4 | 44.6 |
| SWE-bench Multilingual | 54.5 | 29.3 | 30.5 |
| Terminal-Bench | 31.3 | 13.3 | 5.7 |

表 2（Search Agent）

| Benchmark | DeepSeek-V3.1 | DeepSeek-R1-0528 |
| --- | --- | --- |
| Browsecomp | 30.0 | 8.9 |
| Browsecomp_zh | 49.2 | 35.7 |
| HLE | 29.8 | 24.8 |
| xbench-DeepSearch | 71.2 | 55.0 |
| Frames | 83.7 | 82.0 |
| SimpleQA | 93.4 | 92.3 |
| Seal0 | 42.6 | 29.7 |

图 3（Thinking 效率，输出 tokens 与准确率）

| Benchmark | R1-0528 | V3.1-Think |
| --- | --- | --- |
| AIME 2025 | 22,615 (87.5%) | 15,889 (88.4%) |
| GPQA Diamond | 7,678 (81.0%) | 4,122 (80.1%) |
| LiveCodeBench | 19,352 (73.3%) | 13,977 (74.8%) |

## 协议脚注

- V3.1 为混合推理：deepseek-chat 非思考、deepseek-reasoner 思考；128K 上下文。
- 表 2 的 HLE / SimpleQA 与其他厂商的 no-tools 行不同口径，不跨厂商直比。

## 图片清单

- images/02.webp — 1080x495 | 原URL: https://cdn.deepseek.com/api-docs/v3.1_benchmark_1.webp
- images/03.webp — 1080x1027 | 原URL: https://cdn.deepseek.com/api-docs/v3.1_benchmark_2.webp
- images/04.webp — 1080x539 | 原URL: https://cdn.deepseek.com/api-docs/v3.1_benchmark_3.webp

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
