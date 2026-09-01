---
vendor: deepseek
model: DeepSeek-V3.2 / V3.2-Speciale
release: deepseek-v3-2
date: 2025-12-01
source: https://api-docs.deepseek.com/zh-cn/news/news251201
fetched_at: 2026-09-01
---

# DeepSeek V3.2 正式版（V3.2 + V3.2-Speciale）

## 评测数据（转录）

表 1（Reasoning，单元格括号内为 token 成本）

| Benchmark | GPT-5 High | Gemini-3.0 Pro | Kimi-K2 Thinking | DS-V3.2 Thinking | DS-V3.2 Speciale |
| --- | --- | --- | --- | --- | --- |
| AIME 2025 | 94.6 (13k) | 95.0 (15k) | 94.5 (24k) | 93.1 (16k) | 96.0 (23k) |
| HMMT Feb 2025 | 88.3 (16k) | 97.5 (16k) | 89.4 (31k) | 92.5 (19k) | 99.2 (27k) |
| HMMT Nov 2025 | 89.2 (20k) | 93.3 (15k) | 89.2 (29k) | 90.2 (18k) | 94.4 (25k) |
| IMOAnswerBench | 76.0 (31k) | 83.3 (18k) | 78.6 (37k) | 78.3 (27k) | 84.5 (45k) |
| LiveCodeBench | 84.5 (13k) | 90.7 (13k) | 82.6 (29k) | 83.3 (16k) | 88.7 (27k) |
| CodeForces (Rating) | 2537 (29k) | 2708 (22k) | - | 2386 (42k) | 2701 (77k) |
| GPQA Diamond | 85.7 (8k) | 91.9 (8k) | 84.5 (12k) | 82.4 (7k) | 85.7 (16k) |
| HLE | 26.3 (15k) | 37.7 (15k) | 23.9 (24k) | 25.1 (21k) | 30.6 (35k) |

表 2（ToolUse / Agentic）

| Benchmark | Claude-4.5-Sonnet | GPT-5 High | Gemini-3.0 Pro | Kimi-K2 Thinking | MiniMax M2 | DS-V3.2 Thinking |
| --- | --- | --- | --- | --- | --- | --- |
| tau2-Bench | 84.7 | 80.2 | 85.4 | 74.3 | 76.9 | 80.3 |
| MCP-Universe | 46.5 | 47.9 | 50.7 | 35.6 | 29.4 | 45.9 |
| MCP-Mark | 33.3 | 50.9 | 43.1 | 20.4 | 24.4 | 38.0 |
| Tool-Decathlon | 38.6 | 29.0 | 36.4 | 17.6 | 16.0 | 35.2 |

汇总图（images/02.webp）另列 SWE Verified 73.1 / Terminal Bench 2.0 46.4 / tau2-Bench 80.3 / Tool Decathlon 35.2（V3.2-Thinking 列）。

## 协议脚注

- V3.2 为 thinking 与工具调用融合的正式版；Speciale 为长思考增强的临时研究 API（无工具调用）。
- token 成本为表格单元格括号内数值（Speciale 为 23k-77k 量级）。
- IMO 2025 / CMO 2025 / ICPC WF 2025 / IOI 2025 为 Speciale 奖牌级结论（prose），非百分比。

## 图片清单

- images/02.webp — 1080x602 | 原URL: https://api-docs.deepseek.com/zh-cn/img/v3.2_251201_benchmark.webp
- images/03.webp — 1080x769 | 原URL: https://api-docs.deepseek.com/zh-cn/img/v3.2_251201_benchmark_table_cn.webp
- images/04.webp — 1080x228 | 原URL: https://api-docs.deepseek.com/zh-cn/img/v3.2_251201_agent_benchmark.webp

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
