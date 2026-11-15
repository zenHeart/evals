---
vendor: openai
model: GPT-5.3-Codex-Spark
release: gpt-5-3-codex-spark
date: 2026-02-12
source: https://openai.com/index/introducing-gpt-5-3-codex-spark/
fetched_at: 2026-11-15
---

# GPT‑5.3‑Codex‑Spark 官方发布页证据归档

本归档是 **OpenAI 官方发布文 `Introducing GPT‑5.3‑Codex‑Spark`** 的一级来源快照，用于给 `openai/gpt-5-3-codex-spark` 建档。该发布属**存量回填**（发布日 2026-02-12，早于本批增量窗口；候选 `openai-4a841ea7ec7c`）。

## 来源与日期证据

| 证据 | 位置 | 内容 |
|---|---|---|
| 页面印刷日期行 | `page.html` 可见文本第 23 行 | `February 12, 2026` |
| 类目标签 | 同页紧随其后 | `Product` / `Release`（即官方「产品发布」类目，非研究文） |
| 页面 H1 | `page.html` | `Introducing GPT‑5.3‑Codex‑Spark` |
| 正文首句 | 「Speed and intelligence」段 | `Today, we're releasing a research preview of GPT‑5.3‑Codex‑Spark, a smaller version of GPT‑5.3‑Codex, and our first model designed for real-time coding.` |

发布日期取 **2026-02-12**（页面自身印刷日，date_precision=day）。

## 取数口径：本次没有位图，全部数值来自页面内嵌数据集

该发布文的评测图表**不是位图**——两张图都是页面内嵌的 vega-lite 组件，数据集以 `vegaLiteSpec.data.values` 的形式直接写在 Next.js RSC 载荷里（`self.__next_f.push` 转义 JSON）。因此这些数值是**逐格机读**的，按契约记 `evidence_type: "text"` / `status: "verified"`，不走「位图 → pending」路径。

载荷中每个对象形如 `{"vegaLiteSpec":{"data":{"values":[...]},"layer":[...]}}`，括号配平后可直接 `JSON.parse`；两处载荷互不重叠：

- **载荷 A** → 图表标题 `SWE-Bench Pro`（散点图：任务耗时 vs 准确率）
- **载荷 B** → 图表标题 `Terminal-Bench 2.0`（柱状图 + 文本层）

## 评测转录表

### 载荷 B · Terminal-Bench 2.0（柱状图，文本层格式 `.1%`）

| 模型 | 分数 | 备注 |
|---|---|---|
| GPT‑5.3‑Codex‑Spark | 58.4% | 自家模型列。原始值 `0.584`，按图表文本层 `format: ".1%"` 渲染为 58.4% |
| GPT‑5.3‑Codex | 77.3% | 竞品列（`0.773`），只进 notes，不单独建行 |
| GPT‑5.1‑Codex‑mini | 46.1% | 竞品列（`0.461`），只进 notes，不单独建行 |

纵轴标题 `Accuracy`；正文对应句：`GPT‑5.2‑Codex… `（本页正文为）`Codex-Spark is a highly capable small model optimized for fast inference. On SWE-Bench Pro and Terminal-Bench 2.0, two benchmarks evaluating agentic software engineering capability, GPT‑5.3‑Codex‑Spark demonstrates strong performance while accomplishing the ta…`（该句在页面上被截断，完整句见 `page.html`）。

### 载荷 A · SWE-Bench Pro（散点图：x=任务耗时(分钟)、y=准确率）

图表标题 `SWE-Bench Pro`；x 轴标题 `Task duration (minutes)`（轴刻度格式 `,.0f`）；y 轴标题 `Accuracy`（轴刻度格式 `.0%`）；tooltip 读数格式 `passrate: ".1%"`、`minutes: ",.2f"`。

**GPT‑5.3‑Codex‑Spark 自家列的四个推理档位**（按 reasoning_effort 拆 variant 行）：

| reasoning_effort | 准确率（passrate） | 任务耗时（minutes） | 备注 |
|---|---|---|---|
| low | 46.6% | 1.03 | 原始 `passrate 0.46602761` / `minutes 1.0328008583333335` |
| medium | 49.4% | 1.68 | 原始 `0.49405138` / `1.6761121833333334` |
| high | 50.5% | 2.05 | 原始 `0.50483573` / `2.0506086` |
| xhigh | 51.5% | 2.29 | 原始 `0.51492478` / `2.2867344666666667` |

**竞品列（只进 notes，不建行）**：

| 模型 | low | medium | high | xhigh |
|---|---|---|---|---|
| GPT‑5.3‑Codex | 51.1%（3.13 min） | 53.4%（4.64 min） | 56.0%（8.88 min） | 56.8%（16.29 min） |
| GPT‑5.1‑Codex‑mini | 46.2%（4.61 min） | 48.5%（6.03 min） | 49.0%（7.09 min） | —（该模型无 xhigh 档） |

**口径提醒**：本图 y 轴刻度按整百分比（`.0%`）渲染、tooltip 按一位小数（`.1%`）渲染；散点图**没有印刷在图上的数据标签**，绝对精度只到 tooltip 口径。本账本记 `reported_score.value` 取原始 passrate×100、`display` 按 tooltip 的 `.1%` 格式书写，并在 notes 里附原始浮点值，便于与图上整百分比轴刻度对照。

## 非评测内容转录

| 项 | 页面原文 | 账本处理 |
|---|---|---|
| 上下文窗口 | `At launch, Codex-Spark has a 128k context window and is text-only.` | `context_window: "128K"`、`modalities: ["文本"]` |
| 推理速度 | `delivering more than 1000 tokens per second while remaining highly capable for real-world coding tasks` | 写入 `key_traits`，**不建 evidence 行**（是吞吐性能描述，不是基准分） |
| 硬件 | `Powered by Cerebras` / `Cerebras' Wafer Scale Engine 3` | 写入 `notes` 与 `key_traits` |
| 形态 | `research preview for ChatGPT Pro users`；`Codex-Spark is currently text-only at a 128k context window and is the first in a family of ultra-fast models.` | 写入 `notes` |
| 参数量 / API 定价 | 页面未给出 | 一律 `null` |
| 安全 | `We evaluated Codex-Spark as part of our standard deployment process… determined t…`（页面截断） | 写入 `notes`，不建 evidence 行 |

## 未建行的评测相关表述

- `we also needed to reduce latency across the full request-response pipeline. We implemented end-to-end latency improvements in our harness t…` —— 讲的是自身 harness 的延迟优化（工程改进），没有给出任何基准分，**不建行**。
- `Duration is estimated as the sum of (1) output generation time (output tokens ÷ sampling speed), (2) prefill time (prefill tokens ÷ prefill speed), (3) total tool execution time, and (4) total network overhead.` —— 这是**耗时口径的定义说明**，不是评测分；它解释了散点图 x 轴「Task duration」怎么算，已写进 `protocol` 的 `aggregation` 说明与 notes。
- 图注 `Powered by Cerebras`、`Share` 等 CTA —— 非评测内容。

## 局限与注意

- 本页**没有位图**，两张图都是内嵌数据集，所以不存在「OCR 读图」问题；数值是机读的、可逐格复算。
- 发布文正文对两个基准都只给相对结论（「demonstrates strong performance」），绝对值全部来自图表载荷；因此 evidence 行的 `locator.quote_snippet` 记录正文原句、`locator.figure` 记录图表标题与载荷路径，二者互相印证。
- 官方**未明示评测协议**（harness / 温度 / top_p / 跑次数 / 判分器）——`protocol` 除 `reasoning_effort`（由数据集字段 `reasoning_effort` 直接给出）与 `aggregation`（耗时口径定义）外一律 `null`。
- 页面末尾的「Keep reading」区（Codex app、GPT‑5.3‑Codex、GPT‑5.3‑Codex System Card 等）是站内推荐链接，**不是本发布的一部分**，未取其任何数值。
