---
vendor: microsoft
model: MAI Realtime 1
release: mai-realtime-1
date: 2026-11-17
source: https://microsoft.ai/news/introducing-mai-realtime-1/
fetched_at: 2026-11-17
---

# MAI Realtime 1: Leading voice AI at $0.01 per audio minute

> 归档说明：`page.html` 为官方发布页 `https://microsoft.ai/news/introducing-mai-realtime-1/` 的原始存档（HTTP 200，服务端渲染 HTML，336175 字节），抓取于 2026-11-17，User-Agent 为 macOS Chrome 141 桌面版，未做任何 DOM 改写。页面引用 14 张图片，全部原样下载到 `images/`（WordPress 同名不同尺寸缩略图按「原始尺寸优先」只保留一张原图）。
>
> **关键抓取发现（务必先读）**：该页服务端 HTML 的 `<table>` 计数为 **0**，但这不等于「页面没有跑分表」。两张评测散点图（Big Bench Audio、τ-Voice）被包在 `<block-widget>` 的 **base64 编码** `<template data-widget-html>` 里，由页面自带脚本在浏览器端渲染成带 `<caption>` 与 `<th scope="row">` 的无障碍数据表。本归档先解 base64 模板，再逐行读取其**发布方自带的数据常量**（`PTS` 数组），不是读像素、不是 OCR，故按仓库口径「DOM 表机读行」记 `verified`；同一分值在官方模型页 `https://microsoft.ai/models/mai-realtime-1/` 的 `data-count-target="98.9"` 计数动画属性处二次印证（该模型页静态 HTML 里数字被渲染成 `0`，真实值在 `data-count-target` 属性上）。

## 发布日证据链

| 来源 | 原文 | 说明 |
|---|---|---|
| 发布页 JSON-LD | `"datePublished":"2026-11-17T18:16:17+00:00"` | `<head>` 内 schema.org 节点，UTC 日期即 **2026-11-17** |
| 官方模型页 JSON-LD | `"datePublished":"2026-11-17T18:24:15+00:00"` | `https://microsoft.ai/models/mai-realtime-1/`，与发布页同日（模型页比发布文晚约 8 分钟上线） |

## 发布要点（转录）

- 定位：原文「MAI Realtime 1, our first speech-to-speech model, is built for naturally flowing conversations for real-world enterprise applications starting at $0.01 per audio minute.」
- 与 GPT Realtime 2.1 的关系：原文「Our model outperforms GPT Realtime 2.1 on quality, speed, and price across public benchmarks and Microsoft product evaluations. It sits on the performance-price Pareto frontier for both Big Bench Audio speech reasoning, and Tau-Voice agentic task completion benchmark.」
- 能力要点：原文「Robust understanding: It recognizes requests even with background noise or other people talking」「Real-world action: It takes on complex requests and connects to enterprise systems and tools」「Adaptable personas: It adjusts tone, style, and behavior through prompting to suit different customers, domains, and use cases」
- API 兼容：原文「MAI Realtime 1 is also compatible with the OpenAI Realtime API, making it straightforward for developers to test the model and migrate existing voice applications.」
- 落地渠道：原文「We're also bringing MAI Realtime 1 to Dynamics 365 Contact Center for customer service applications, and to Dragon Copilot, to support AI-simulated patient conversations that help nurses practice clinical interactions.」
- 试用入口：原文「Try out MAI Realtime 1 in MAI Labs or register for the Foundry limited-access preview. Preview customers won't be billed until public preview begins.」
- 定价（页脚「About these results」）：原文「Pricing: Base speech-to-speech usage is priced at $0.01 per minute. Reasoning is billed separately at $1 per million input tokens and $5 per million output tokens.」
- 评测口径声明：原文「Competitive performance: MAI Realtime 1 was evaluated against GPT Realtime 2.1 using public benchmarks including Big Bench Audio and τ-Voice, alongside Dynamics 365 Contact Center evaluations.」

## 评测数据

> 说明：该页**没有服务端渲染的 DOM 跑分表**（`<table>` 计数 0），两张图由 base64 编码的 `<block-widget>` 模板在浏览器端渲染为数据表。图表数值取自发布方自带数据常量（机读、非位图、非 OCR），故本 release 证据行全部记 `evidence_type: "table"` / `status: "verified"`，**无 pending 行**。页面未给出任一评测的脚手架、题目量、采样次数与判官，协议字段除 harness 外一律留 null。

### 数值全量转录表

| 评测 | 分数 | 备注 |
|---|---|---|
| Big Bench Audio（语音推理准确率） | 98.9% | 微软内部评测自报；图表注释原文「MAI Realtime 1 from internal evaluation, 98.9% at $1.3548 per hour」。成本按固定 40 题 Big Bench Audio 子集归一化为「每小时输入音频 $1.3548」 |
| τ-Voice（agentic 任务完成率） | 57.5% | 微软内部评测自报；图表注释原文「MAI Realtime 1 from internal evaluation, 57.5% at $1.3548 per hour」。图表口径「Full-duplex models only」，曲线为性能—价格 Pareto 前沿 |
| Dynamics 365 Contact Center evaluations | （未给数值） | 页脚只点名该微软内部产品评测集并给出与 GPT Realtime 2.1 的相对结论，全站未发布任何绝对分值 |
| 性能—价格 Pareto 前沿 | （未给数值） | 正文只称在 Big Bench Audio 与 τ-Voice 两图上位于 Pareto 前沿，未印坐标值 |

### 同图表竞品列（同一表格行，按仓库口径只写入本模型行的 notes，不拆独立行）

Big Bench Audio 得分（%，竞品列取自 Artificial Analysis）：

| 模型 | Big Bench Audio 得分 | 每小时输入音频成本 |
|---|---:|---:|
| MAI Realtime 1 | 98.9% | $1.3548 |
| Gemini 3.8 Live | 91.7% | $0.84 |
| GPT-Realtime-2.1 Mini High | 74.7% | $3.45 |
| Gemini 3.8 Live Extended Thinking (High) | 97.7% | $3.50 |
| GPT-Realtime-2 High | 96.6% | $4.14 |
| GPT-Live-1 (Sol, low) | 89% | $4.47 |
| Grok Voice 2.0 | 97.2% | $4.80 |
| Eleven Realtime v1 Max | 98.8% | $4.80 |
| Eleven Realtime v1 Mini | 75.9% | $4.80 |
| GPT-Live-1 (Astra, medium) | 90.1% | $5.83 |
| GPT-Realtime-2.1 High | 95.8% | $10.75 |

τ-Voice 任务完成率（%，竞品列取自 Artificial Analysis）：

| 模型 | τ-Voice 任务完成率 | 每小时输入音频成本 |
|---|---:|---:|
| MAI Realtime 1 | 57.5% | $1.3548 |
| Gemini 3.8 Live | 30.1% | $0.84 |
| GPT-Realtime-2.1 Mini High | 29.4% | $3.45 |
| Gemini 3.8 Live Extended Thinking (High) | 68.6% | $3.50 |
| Phonic 1 (High) | 79.9% | $4.20 |
| Qwen Audio 3.0 Realtime Plus | 54.6% | $4.42 |
| GPT-Live-1 (Sol, low) | 59.3% | $4.47 |
| Qwen Audio 3.0 Realtime Flash | 35.9% | $4.77 |
| Grok Voice 3.0 | 71.6% | $4.80 |
| Eleven Realtime v1 Max | 47.6% | $4.80 |
| Eleven Realtime v1 Mini | 46.8% | $4.80 |
| GPT-Live-1 (Astra, medium) | 74.5% | $5.83 |
| GPT-Realtime-2.1 High | 45.7% | $10.75 |

### 官方模型页补充规格（`https://microsoft.ai/models/mai-realtime-1/`）

| 项目 | 值 | 原文/属性 |
|---|---|---|
| Big Bench Audio | 98.9% | 「Accuracy on spoken reasoning questions from the Big Bench Audio benchmark.」（`data-count-target="98.9"`） |
| 语音基础价 | $0.01 / 分钟 | 「Per minute, with reasoning costs charged separately.」 |
| 首段音频延迟 | 880 ms | 「Time to first audio — P50 Latency on BigBench Audio」（`data-count-target="880"`）；属延迟指标、非基准分值，不建证据行 |

## 协议与口径说明

- **harness**：两张图的自家分值图表注释明示「MAI Realtime 1 from internal evaluation」→ 记微软内部评测；同图竞品列明示「Source: Artificial Analysis (competitor scores and costs)」→ 竞品分值属第三方口径，仅写入本模型行 notes。
- **口径落差（重要）**：同一张表里，自家列是微软内部评测、竞品列是 Artificial Analysis，两者**并非同一评测协议**，故 `comparison_scope` 一律 `only_same_protocol`，不可直接横比。
- **成本口径**：图表 x 轴是「每小时输入音频成本（USD）」，Big Bench Audio 图的成本按**固定 40 题 Big Bench Audio 子集**归一化；τ-Voice 图仅含全双工模型（Full-duplex models only）。成本与 token 属效率对照，按仓库口径不单独建行。
- **未明示项**：脚手架题目量、采样次数、判官模型、思考档位、温度、top_p 全部未写，协议字段一律 `null`；参数量与上下文窗口页面未披露，账本 `params` / `context_window` 记 `null`。
- **归因**：两个带数值的行均为微软自报（`vendor_reported`）；Dynamics 365 Contact Center evaluations 行官方未给任何数值，记 `not_reported` / `value: null`。

## 局限与待人工核验

1. **两行分值的可读路径依赖页面脚本**：Big Bench Audio 98.9% 与 τ-Voice 57.5% 来自 base64 编码的 `<block-widget>` 模板中的数据常量（浏览器端渲染为带 `<caption>` 的数据表），静态抓取 HTML 中不含这两张表；人工复核请用浏览器打开 `page.html` 或直接看官方模型页 `data-count-target` 属性。
2. **自家值与竞品值协议不同**：自家分值为微软内部评测、竞品分值为 Artificial Analysis，两列不可直接横比，`comparison_scope` 已统一为 `only_same_protocol`。
3. **Big Bench Audio 成本归一化用了 40 题固定子集**，页面未说明该分值本身是否也只跑了这 40 题，故 `benchmark_variant` 留 `null`，人工复核时需确认。
4. **Dynamics 365 Contact Center evaluations 无数值**：页脚只点名该内部产品评测集，官方未发布任何绝对分值，按契约记 `not_reported` / `value: null`；若后续官方补数，走 `revisions[]` 追加，不得直接改写。
5. **Pareto 前沿与竞品胜负均为相对论断**（"outperforms GPT Realtime 2.1 on quality, speed, and price"），页面未印对应绝对值，按仓库口径不建行。
6. 页面另有音频演示区块（`.mp3` 样例，非图片），本次未下载，未纳入 `images/`。
7. 全部声明为厂商自报，本次未做本地复跑或第三方独立复现。
