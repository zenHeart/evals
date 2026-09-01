---
vendor: deepseek
model: DeepSeek-V3.2
release: deepseek-v3-2
date: 2025-12-01
source: https://api-docs.deepseek.com/zh-cn/news/news251201
fetched_at: 2026-09-01
---

# DeepSeek V3.2 正式版：强化 Agent 能力，融入思考推理

## 评测数据（转录）


### 推理 / 竞赛基准（视觉转写，来源 images/03.webp v3.2_251201_benchmark_table_cn；括号内为平均输出 token）

| Benchmark | GPT-5 High | Gemini-3.0 Pro | Kimi-K2 Thinking | DeepSeek-V3.2 Thinking | DeepSeek-V3.2 Speciale |
|---|---|---|---|---|---|
| AIME 2025（美国数学邀请赛） | 94.6(13k) | 95.0(15k) | 94.5(24k) | 93.1(16k) | 96.0(23k) |
| HMMT Feb 2025（哈佛 MIT 数学竞赛） | 88.3(16k) | 97.5(16k) | 89.4(31k) | 92.5(19k) | 99.2(27k) |
| HMMT Nov 2025（哈佛 MIT 数学竞赛） | 89.2(20k) | 93.3(15k) | 89.2(29k) | 90.2(18k) | 94.4(25k) |
| IMOAnswerBench（国际数学奥林匹克竞赛） | 76.0(31k) | 83.3(18k) | 78.6(37k) | 78.3(27k) | 84.5(45k) |
| LiveCodeBench（世界级编程竞赛） | 84.5(13k) | 90.7(13k) | 82.6(29k) | 83.3(16k) | 88.7(27k) |
| CodeForces（世界级编程竞赛） | 2537(29k) | 2708(22k) | - | 2386(42k) | 2701(77k) |
| GPQA Diamond（理工科博士生测试） | 85.7(8k) | 91.9(8k) | 84.5(12k) | 82.4(7k) | 85.7(16k) |
| HLE（人类全学科前沿难题测试） | 26.3(15k) | 37.7(15k) | 23.9(24k) | 25.1(21k) | 30.6(35k) |

### ToolUse 基准（视觉转写，来源 images/04.webp v3.2_251201_agent_benchmark）

| Benchmark | Claude-4.5-Sonnet | GPT-5 High | Gemini-3.0 Pro | Kimi-K2 Thinking | MiniMax M2 | DeepSeek-V3.2 Thinking |
|---|---|---|---|---|---|---|
| τ²-Bench | 84.7 | 80.2 | 85.4 | 74.3 | 76.9 | 80.3 |
| MCP-Universe | 46.5 | 47.9 | 50.7 | 35.6 | 29.4 | 45.9 |
| MCP-Mark | 33.3 | 50.9 | 43.1 | 20.4 | 24.4 | 38.0 |
| Tool-Decathlon | 38.6 | 29.0 | 36.4 | 17.6 | 16.0 | 35.2 |

## 协议脚注

- 来源：https://api-docs.deepseek.com/zh-cn/news/news251201（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 225x225 | https://cdn.deepseek.com/platform/favicon.png | DeepSeek API ææ¡£ Logo |
| images/02.webp | 1080x602 | https://api-docs.deepseek.com/zh-cn/img/v3.2_251201_benchmark.webp |  |
| images/03.webp | 1080x769 | https://api-docs.deepseek.com/zh-cn/img/v3.2_251201_benchmark_table_cn.webp |  |
| images/04.webp | 1080x228 | https://api-docs.deepseek.com/zh-cn/img/v3.2_251201_agent_benchmark.webp |  |
| images/05.gif | 1079x727 | https://api-docs.deepseek.com/zh-cn/img/v3.2_251201_thinking_with_tools_demo.gif |  |
| images/06.jpg | 1280x695 | https://api-docs.deepseek.com/zh-cn/img/v3.2_thinking_with_tools.jpeg |  |
| images/07.jpg | 800x800 | https://cdn.deepseek.com/official_account.jpg | WeChat QRcode |
| images/08.jpg | 3836x2038 | https://api-docs.deepseek.com/zh-cn/img/deepseek-social-card.jpeg | [og/twitter] |
