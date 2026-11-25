---
vendor: microsoft
model: MAI Code 2 / MAI Code 2 Flash
release: mai-code-2
date: 2026-11-17
source: https://microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash/
fetched_at: 2026-11-17
---

# MAI Code 2 and Code 2 Flash: Everyday coding at scalable prices

> 归档说明：`page.html` 为官方发布页 `https://microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash/` 的原始存档（HTTP 200，服务端渲染 HTML，453390 字节），抓取于 2026-11-17，User-Agent 为 macOS Chrome 141 桌面版，未做任何 DOM 改写。页面引用 14 张图片，全部原样下载到 `images/`（WordPress 同名不同尺寸缩略图按「原始尺寸优先」只保留一张原图）。
>
> **关键抓取发现（务必先读）**：该页服务端 HTML 的 `<table>` 计数为 **0**，但这不等于「页面没有跑分表」。全部 7 张评测图都被包在 `<block-widget>` 的 **base64 编码** `<template data-widget-html>` 里，由页面自带脚本在浏览器端渲染成带 `<caption>` 与 `<th scope="row">` 的无障碍数据表。本归档先解 base64 模板，再逐行读取其**发布方自带的数据常量**（`D` / `PANELS` / `SERIES` 等数组），不是读像素、不是 OCR，故按仓库口径「DOM 表机读行」记 `verified`。
>
> 其中第 1、2 张图（MAI Code 2 / MAI Code 2 Flash 编码基准对比）是本次 release 的**两个自家模型**的数据；第 3–7 张图（Excel / PowerPoint / Word / Teams / FabricIQ DAX）测的是 **MAI Work Flash**——原文说明「From Code 2 Flash we further optimized a single model, MAI Work Flash」——它是 Code 2 Flash 的下游再优化变体，**不是本 release 的两个模型之一**，且评测集全部为微软内部未命名套件，故按仓库口径**不建证据行**，仅在本文件转录留证。

## 发布日证据链

| 来源 | 原文 | 说明 |
|---|---|---|
| 发布页 JSON-LD | `"datePublished":"2026-11-17T18:15:16+00:00"` | `<head>` 内 schema.org 节点，UTC 日期即 **2026-11-17** |

> 官方模型页 `https://microsoft.ai/models/mai-code-2/` 的 JSON-LD `datePublished` 为 `2026-08-11T17:00:00+00:00`（模型卡页早于本次发布建档并被复用），**不作为发布日证据**；该页仅用作协议补充来源。`https://microsoft.ai/models/mai-code-2-flash/` 返回 **404**（无独立模型页），故 Code 2 Flash 的规格以发布页为准。

## 发布要点（转录）

- 定位：原文「MAI Code 2 and MAI Code 2 Flash: two new coding models built for the everyday enterprise coding tasks, delivering leading performance at a fraction of the cost of competing models.」
- 能力分工：原文「MAI Code 2 is at the frontier of price-performance for common enterprise coding tasks and excels in taking code to production, deep debugging, multi-file implementation, repo wide reasoning, and UI.」「Meanwhile, MAI Code 2 Flash is designed for high-volume work such as code explanations, targeted edits, routine fixes, and rapid iterations, while bringing quality at a much lower cost.」
- 官方定位边界（重要）：原文「They’re explicitly not yet tuned for harder problems, like fundamental science research and very long horizon agentic work.」
- 上线范围：原文「MAI Code 2 and Code 2 Flash are available in GitHub Copilot, and Code 2 Flash is in limited-access preview in Microsoft Foundry. Soon, we’ll be releasing it on Open Router, Vercel, Hermes, Open Code, and Kilo.」
- 下游变体：原文「From Code 2 Flash we further optimized a single model, MAI Work Flash, to serve multiple Microsoft products across M365 and Fabric IQ.」

## 评测数据

> 说明：该页**没有服务端渲染的 DOM 跑分表**（`<table>` 计数 0），7 张图全部由 base64 编码的 `<block-widget>` 模板在浏览器端渲染为数据表。数值取自发布方自带数据常量（机读、非位图、非 OCR），证据行记 `evidence_type: "table"` / `status: "verified"`，**无 pending 行**。

### 数值全量转录表 —— 本 release 的两个模型

| 评测 | MAI Code 2 | MAI Code 2 Flash | 备注 |
|---|---:|---:|---|
| DeepSWE 1.1（pass rate） | 73.2% | 59.9% | MSBench + GitHub Copilot CLI（无 subagents），max reasoning effort |
| Terminal-Bench 2.1（pass rate） | 84.6% | 78.3% | 同上 |
| SWE Atlas（pass rate） | 43.1% | 44.8% | 同上 |
| FrontierCode v1.1（pass rate） | 52.0% | （未测） | 该图只含 Code 2；分数与成本来自 Artificial Analysis |
| 四项平均 pass rate（Code 2）/ 三项平均（Flash） | 63.2% | 61.0% | 图表首行「Average of the four/three benchmarks」，是聚合值而非独立评测，不建行 |
| 每任务平均成本 | $0.309 | $0.052 | 均为**五折促销价**口径；成本属效率对照，不建行 |

### 同图表竞品列（同一表格行，按仓库口径只写入本模型行 notes，不拆独立行）

MAI Code 2 图（表 caption 原文「Pass rate and cost per task at max reasoning effort for MAI Code 2, GPT-6.1 Sol and Claude Opus 5.5. MAI Code 2 cost is at the 50% promotional price.」）：

| Benchmark | MAI Code 2 pass rate | MAI Code 2 cost/task | GPT-6.1 Sol pass rate | GPT-6.1 Sol cost/task | Claude Opus 5.5 pass rate | Claude Opus 5.5 cost/task |
|---|---:|---:|---:|---:|---:|---:|
| Average of the four benchmarks | 63.2% | $0.309 | 64.1% | $0.761 | 65.3% | $6.306 |
| DeepSWE 1.1 | 73.2% | $0.618 | 74.6% | $1.212 | 69.0% | $10.717 |
| Terminal-Bench 2.1 | 84.6% | $0.081 | 85.0% | $0.265 | 78.7% | $1.842 |
| SWE Atlas | 43.1% | $0.228 | 47.4% | $0.605 | 57.5% | $4.234 |
| FrontierCode v1.1 | 52.0% | $0.310 | 49.4% | $0.960 | 56.0% | $8.430 |

MAI Code 2 Flash 图（表 caption 原文「Pass rate and cost per task at max reasoning effort for MAI Code 2 Flash, GPT-6 Luna and Claude Haiku 5.5. MAI Code 2 Flash cost is at the 50% promotional price.」）：

| Benchmark | MAI Code 2 Flash pass rate | MAI Code 2 Flash cost/task | GPT-6 Luna pass rate | GPT-6 Luna cost/task | Claude Haiku 5.5 pass rate | Claude Haiku 5.5 cost/task |
|---|---:|---:|---:|---:|---:|---:|
| Average of the three benchmarks | 61.0% | $0.052 | 55.1% | $0.080 | 53.9% | $0.319 |
| DeepSWE 1.1 | 59.9% | $0.098 | 59.6% | $0.159 | 46.0% | $0.668 |
| Terminal-Bench 2.1 | 78.3% | $0.023 | 69.3% | $0.028 | 73.4% | $0.067 |
| SWE Atlas | 44.8% | $0.034 | 36.4% | $0.051 | 42.1% | $0.223 |

### 正文散文明文（相对口径，按仓库口径不建行）

| 表述 | 原文 | 口径 |
|---|---|---|
| Code 2 ≈ GPT-6.1 Sol 性能、40% 成本 | 「MAI Code 2 gives you 98% of the performance of GPT 6.1 Sol at 40% of the cost, and 96% of Claude Opus 5.5's performance at just 5% of the cost.」 | 相对竞品的性能比例，非绝对分值 |
| 前端盲测偏好 64% | 「In blind frontend app evaluations, reviewers preferred its results over GPT-6 Sol 64% of the time.」 | 相对竞品的偏好胜率；脚注「Blind human side-by-side evaluations … annotated by a total of 258 annotators」 |
| Code 2 Flash ≈ GPT-6 Luna / Claude Haiku 5.5 | 「MAI Code 2 Flash offers comparable performance to GPT-6 Luna and Claude Haiku 5.5 at 65% and 20% of the cost, across three coding benchmarks measuring day-to-day, high-volume routine coding tasks.」 | 相对口径 |

### MAI Work Flash 内部产品评测（非本 release 模型，仅转录留证）

| 产品 / 评测 | MAI Work Flash | 对照模型 | 备注 |
|---|---:|---:|---|
| Excel（关键内部客户场景基准） | 59.4% / 62.9% / 63.3%（解法长度中位数 1320 / 1650 / 2080 token） | GPT-6 Luna 40.1% / 60.1% / 60.8%（700 / 1710 / 3020 token） | 表 caption「Pass rate against median (P50) solution length; token counts are approximate」；散点为多配置点 |
| PowerPoint（高频任务生产基准） | 75.6 / 81.4 / 84.0 / 86.5（6200 / 10300 / 15500 / 20400 token） | GPT-6 Luna 68.5 / 77.0 / 80.4 / 84.0 / 86.7 / 85.2（3400–29300 token） | 表 caption「Quality score against median (P50) solution length; token counts are approximate」 |
| Word（9 项关键内部基准中的 5 项） | Command Bench 57.9 / QA Daily 81.3 / Formatting L2 72.1 / Formatting quality 68.6 / QA Compete 80.4 | GPT-6.1 Sol 57.6 / 84.0 / 74.5 / 71.6 / 86.6 | 表 caption「Performance on 5 of 9 key internal benchmarks (success rate or score, higher is better)」 |
| Teams（按任务计分） | Decision tracking + knowledge gaps（AVG@3）84.6 / 575 token；Adapting custom instructions（Pass@1）73.8 / 590 token；Tool calling（Macro F1）74.0 / 87 token | GPT-6 Luna 78.4 / 542；72.7 / 815；72.5 / 116 | 表 caption「Score by task and tokens used, MAI Work Flash and GPT-6 Luna」 |
| FabricIQ DAX（四个 DAX 基准套件聚合，0–1） | 0.77 | GPT-6 Astra 0.54 / GPT-5.6 Sol 0.45 / Opus 5.5 0.30 | 表 caption「Overall score aggregated across four DAX benchmark suites, 0 to 1, higher is better.」 |

### 官方模型页补充（`https://microsoft.ai/models/mai-code-2/`）

| 项目 | 值 | 原文/属性 |
|---|---|---|
| MAI Code 2 性能—成本定位 | 96% of Opus 5.5 performance at 5% of cost | 计数动画 `data-count-target="96"` |
| 前端 UI 偏好 | 64% of users voted for MAI Code 2's front-end UI, over GPT-6 Sol's | 计数动画 `data-count-target="64"`（与发布页正文 64% 一致） |
| 采样次数 | 3 | 模型页图注原文「All evaluations are averaged over three runs using the same settings.」 |

## 协议与口径说明

- **harness**：页脚脚注明示「DeepSWE 1.1, TerminalBench 2.1 and SWE Atlas were run on MSBench (Microsoft's internal eval platform) with the GitHub Copilot CLI without subagents.」→ `protocol.harness` 记 MSBench + GitHub Copilot CLI（无 subagents）；`FrontierCode v1.1` 一行不在该脚注覆盖范围内（分数来自 Artificial Analysis），harness 留 null。
- **reasoning_effort**：脚注明示「All models were run at max reasoning effort.」→ 四个模型的该项统一记 `max`。
- **run_count**：3，来自官方模型页图注「All evaluations are averaged over three runs using the same settings.」（发布页正文未印，复核请看模型卡）。
- **成本口径**：两张图的成本均为**五折促销价**（原文「MAI Code 2 cost is at the 50% promotional price.」），不是长期列表价，与外部 API 报价不可直接对照。
- **归因**：DeepSWE 1.1 / Terminal-Bench 2.1 / SWE Atlas 三项为微软在自建 MSBench 上自跑 → `vendor_reported`；**FrontierCode v1.1 按脚注明示「FrontierCode 1.1 scores and costs are from Artificial Analysis」记 `third_party_reported`**（按仓库口径「厂商注明该行由第三方评测/榜单提供」不计厂商自报）。
- **未明示项**：题目量、判官、温度、top_p、轮数上限全部未写，协议字段留 `null`；官方未披露参数量、上下文窗口与每百万 token 定价，账本 `params` / `context_window` / `pricing` 一律记 `null`。
- **口径落差**：Code 2 内部评测跑在微软自建 MSBench，FrontierCode 数值来自 Artificial Analysis，两者不是同一评测协议，`comparison_scope` 统一记 `only_same_protocol`。

## 局限与待人工核验

1. **一张 release、两个模型**：证据行按 `model_id` 拆成 `mai-code-2` 与 `mai-code-2-flash` 两组，edge id 以后缀 `-code-2` / `-code-2-flash` 区分，避免同基准撞 id。
2. **FrontierCode v1.1 只有 Code 2 有分**：Code 2 Flash 图只含三项基准，无 FrontierCode，账本不补空行。
3. **平均行不是独立评测**：图表首行「Average of the four/three benchmarks」是聚合值，不建行，仅转录。
4. **64% 偏好胜率与 98%/96%/65%/20% 均为相对竞品口径**，按仓库口径不建行；其中 64% 偏好胜率在官方模型页以计数动画属性二次印证。
5. **MAI Work Flash 的五组内部产品评测不建行**：它是 Code 2 Flash 的再优化变体、不是本 release 的两个模型，且评测集全部为微软内部未命名套件（Excel / PowerPoint / Word / Teams / FabricIQ DAX），无法外部复跑、不可跨机构比较。
6. **五折促销价口径**：所有成本数字是促销价下的每任务成本，不是 API 列表价，账本 `pricing` 记 `null`。
7. **官方声明的适用边界**：原文自述「They’re explicitly not yet tuned for harder problems, like fundamental science research and very long horizon agentic work.」，即不面向长程智能体与前沿科研场景。
8. 全部声明为厂商自报（FrontierCode 一项为第三方榜单转述），本次未做本地复跑或第三方独立复现。

---

## 附：另一批次独立归档转录（第七十一~七十六批链路）

> 本节为同一官方发布文的**另一批次独立抓取**转录，原样保留以便交叉核对；上文为基准批次的完整转录。两者取数口径不同（第七十批解出发布方自带数据常量，第七十一~七十六批链路只取正文散文明文），数值差异以本 release 的 evidence 行与 revisions[] 为准。

# MAI Code 2 与 MAI Code 2 Flash（Microsoft 官方发布文证据归档）

发布日期证据链：发布文页头印刷日期「Nov 17, 2026」（分类标记 Ignite · Models），并由 Microsoft Ignite 2026 家族汇总页 `https://microsoft.ai/news/microsoft-ignite-2026/` 同日发布交叉互证，`date_precision=day`。

- 发布文：https://microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash/ （`page.html`，服务端渲染 HTML，原始字节未改动存档）
- 家族汇总页：https://microsoft.ai/news/microsoft-ignite-2026/ （`ignite-2026-hub.html`，同日发布「Seven new world-class models at scalable price-performance」）
- 发现渠道：Microsoft AI 官方新闻索引 https://microsoft.ai/blog/ 与模型页 https://microsoft.ai/models/mai-code-2/

## 官方定位（原文要点）

- 标题「MAI Code 2 and MAI Code 2 Flash: Everyday coding at scalable prices」。
- MAI Code 2 面向「代码上生产、深层调试、多文件实现、仓库级推理、UI」等日常企业编码任务；MAI Code 2 Flash 面向代码解释、定点编辑、常规修复与快速迭代等高吞吐批量任务。
- 官方明示两款模型「尚未针对基础科学研究与超长周期 agentic 任务调优」。
- 官方另称由 Code 2 Flash 进一步优化出 MAI Work Flash 供 Microsoft 365 与 FabricIQ 使用（同为派生产品模型，无评测分，未建账本行）。

## 规格与架构（页面明示内容）

- **参数量**：页面未明示 → `params = null`
- **上下文窗口**：页面未明示 → `context_window = null`
- **API 定价**：页面未印 API 价目（仅脚注称成本按 50% 促销价计）→ `pricing = null`
- **模态**：页面未明示 → `modalities = null`

## 评测协议（Benchmarking 口径）

- 3 条 evidence 全部取自官方发布文正文散文明文（`evidence_type=text`），**不是位图读图、不是 OCR**，故一律记 `verified`。
- 脚注原文：「MAI Code 2 performance and price: All models were run at max reasoning effort. DeepSWE 1.1, TerminalBench 2.1, and SWE Atlas were run on MSBench (Microsoft's internal eval platform) with the GitHub Copilot CLI without subagents. FrontierCode 1.1 scores and costs are from Artificial Analysis; MAI Code 2 cost is shown at its 50% promotional price」。
- **口径隔离（重要）**：MAI Code 2 的 98% / 96% 是四项基准（DeepSWE 1.1、Terminal Bench 2.1、SWE-Atlas、FrontierCode v1.1）的**相对性能指数**，不是任何单一基准的绝对分；MAI Code 2 Flash 官方只给「可比表现 + 成本比」而**未给绝对分**（`score_status=not_extracted`）。两者均禁止与仓内同名基准的绝对分行直接比较。
- 盲测前端偏好行用 new-benchmark id `mai-frontend-blind-eval`（无 benchmark 实体，兜底详情页承载），与仓内 `code-arena-frontend` 不是同一评测。

## 可用性

MAI Code 2 与 Code 2 Flash 已进 GitHub Copilot；Code 2 Flash 在 Microsoft Foundry 限量预览；官方称稍后上 OpenRouter、Vercel、Hermes、OpenCode、Kilo。

## 图表

本批未读图、未做 OCR 视觉转录；页面内嵌位图与字体资源未单独下载存档，本归档的数值一律取自正文散文。
