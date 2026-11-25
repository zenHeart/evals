---
vendor: microsoft
model: MAI Cyber 2 Flash
release: mai-cyber-2-flash
date: 2026-11-17
source: https://microsoft.ai/news/introducing-mai-cyber-2-flash/
fetched_at: 2026-11-17
---

# MAI Cyber 2 Flash: Leading security. Lower cost

> 归档说明：`page.html` 为官方发布页 `https://microsoft.ai/news/introducing-mai-cyber-2-flash/` 的原始存档（HTTP 200，服务端渲染 HTML，234375 字节），抓取于 2026-11-17，User-Agent 为 macOS Chrome 141 桌面版，未做任何 DOM 改写。页面引用 12 张图片，全部原样下载到 `images/`（WordPress 同名不同尺寸缩略图按「原始尺寸优先」只保留一张原图）。
>
> **关键抓取发现（务必先读）**：该页服务端 HTML 的 `<table>` 计数为 **0**，但这不等于「页面没有跑分表」。CyberGym-E2E 对比图被包在 `<block-widget>` 的 **base64 编码** `<template data-widget-html>` 里，由页面自带脚本在浏览器端渲染成带 `<caption>` 与 `<th scope="row">` 的无障碍数据表（表 caption 原文「Task success, output tokens per task and cost per task on CyberGym-E2E, MAI Cyber 2 Flash and GPT-6 Astra」）。本归档先解 base64 模板，再逐行读取其**发布方自带的数据常量**（`PANELS` 数组），不是读像素、不是 OCR，故按仓库口径「DOM 表机读行」记 `verified`。

## 发布日证据链

| 来源 | 原文 | 说明 |
|---|---|---|
| 发布页 JSON-LD | `"datePublished":"2026-11-17T18:15:34+00:00"` | `<head>` 内 schema.org 节点，UTC 日期即 **2026-11-17** |

> 官方模型页 `https://microsoft.ai/models/mai-cyber-2-flash/` 的 JSON-LD `datePublished` 为 `2026-05-06T16:23:00+00:00`（模型卡页早于本次发布建档并被复用），**不作为发布日证据**；该页仅用作规格与数值交叉核对来源。

## 发布要点（转录）

- 定位：原文「Built on Microsoft's decades of proprietary security data and expertise, MAI Cyber 2 Flash is our latest specialist security model. It delivers leading performance on real-world security tasks at a fraction of the cost of larger models. And we're bringing that capability directly into Microsoft's security products.」
- 与竞品的关系：原文「On CyberGym‑E2E, a benchmark measuring real-world vulnerability discovery, MAI Cyber 2 (92.3%) matches GPT 6 Astra (91.5%) at less than 2% of the cost per task. It also outperforms GPT 5.6 Cyber on CyberGym‑E2E and WebExploitBench at the same reasoning budget.」
- 上下文窗口：原文「With a one-million-token context window, four times larger than MAI Cyber 1.1 Flash, it can analyze more of a codebase during complex, multi-step investigations.」
- 内部早测：原文「Early evaluations through Microsoft Perception show performance comparable to leading models on investigation agent and security detection authoring.」
- 客户侧反馈：原文「Insight Enterprises found MAI Cyber models to be 20% more token-efficient than GPT Profile in its evaluations.」
- 上线范围：原文「MAI Cyber 2 Flash is coming exclusively to Microsoft security products, including Codename MDASH, where it will automatically replace the existing model in the MAI profile for eligible customers starting mid-December.」
- 图表标题行：原文「MAI Cyber 2 Flash matches GPT-6 Astra for less than 2% of the cost」

## 评测数据

> 说明：该页**没有服务端渲染的 DOM 跑分表**（`<table>` 计数 0），对比图由 base64 编码的 `<block-widget>` 模板在浏览器端渲染为数据表。图表数值取自发布方自带数据常量（机读、非位图、非 OCR），故证据行记 `evidence_type: "table"` / `status: "verified"`，**无 pending 行**。WebExploitBench 数值来自页脚明文脚注。

### 数值全量转录表

| 评测 | 分数 | 备注 |
|---|---|---|
| CyberGym‑E2E（任务成功率） | 92.3% | 微软自跑；页脚脚注原文「CyberGym‑E2E: MAI Cyber 2 Flash achieved 92.3% task success versus 91.5% for GPT‑6 Astra, using half the reasoning budget」。协议：Terminal harness，离线评测 **813/905 题**（剔除 92 题训练数据同源任务） |
| WebExploitBench | 40.4% | 页脚脚注原文「WebExploitBench: MAI Cyber 2 Flash achieved 40.4% versus 38.4% for GPT‑5.6 Cyber at the same reasoning budget」。页面未说明该评测的指标定义与题目集 |
| 输出 token / 任务（CyberGym‑E2E） | 38.7K | 同表 GPT-6 Astra 为 55.2K；属效率对照，按仓库口径不单独建行 |
| 每任务成本（CyberGym‑E2E） | $0.45 | 同表 GPT-6 Astra 为 $34.38；属成本对照，不单独建行 |
| 每任务成本（vs GPT-6 Astra） | ＜ 2% | 相对口径（正文「at less than 2% of the cost per task」），不建行 |
| Insight Enterprises token 效率 | 高 20% | 客户自报、相对口径（vs GPT Profile）；脚注补充「versus GPT 5.4, GPT 5.3 Codex, and GPT 5.4 Mini」，不建行 |
| 上下文窗口 | 1M tokens | 规格项；原文称是 MAI Cyber 1.1 Flash 的 4 倍（相对口径） |
| Microsoft Perception 早期评测 | （未给数值） | 内部评测平台，任务为 investigation agent 与 security detection authoring，只给「comparable to leading models」的相对结论 |
| GPT‑6 Cyber 对比 | （未给数值） | 原文「GPT‑6 Cyber is currently available only to select customers… We plan to share comparative results in the coming weeks」 |

### 同图表竞品列（同一表格行，按仓库口径只写入本模型行 notes，不拆独立行）

| 度量 | MAI Cyber 2 Flash | GPT-6 Astra |
|---|---:|---:|
| Task success（higher is better） | 92.3% | 91.5% |
| Output tokens per task（lower is better） | 38.7K | 55.2K |
| Cost per task（lower is better） | $0.45 | $34.38 |

## 协议与口径说明

- **harness**：图表脚注明示「CyberGym-E2E model-layer evaluations run on the Terminal harness」→ `protocol.harness` 记 Terminal harness。产品侧承载它的多智能体 harness 为 Codename MDASH（模型卡原文「Delivered safely through Codename MDASH — Microsoft's multi-agent harness」），属产品部署口径，不作为基准协议，备注于本节与行 notes。
- **题目集**：图表脚注「Offline evaluation on 813 of 905 tasks」，页脚「Benchmark integrity」脚注给出原因——905 题中有 92 题与部分训练数据共享同一批开源项目与漏洞报告，官方对所有模型统一剔除这 92 题，按剩余 **813 题**计分。
- **推理预算**：脚注明示 MAI Cyber 2 Flash 用「half the reasoning budget」即与 GPT-6 Astra 对齐，而非同预算直接对比；WebExploitBench 一行明示为「same reasoning budget」。对比口径不同，`comparison_scope` 统一记 `only_same_protocol`。
- **成本口径**：图表脚注「Cost per task: Measured on CyberGym‑E2E from all input, cached input and output tokens, priced at list price (MAI Cyber 2 Flash $0.10 / $0.01 / $0.50 per 1M tokens; GPT‑6 Astra Azure OpenAI Global $10 / $1 / $50 per 1M tokens). Reflects offline evaluation cost, not customer spend」。
- **未明示项**：WebExploitBench 的指标定义、题目量、判官、思考档位全部未写，协议字段留 `null`；官方也未披露参数量，账本 `params` 记 `null`。
- **图表刻度**：图表注释「Each panel has its own scale, starting at zero」，三个面板各自独立刻度，视觉柱高不可跨面板比较。

## 局限与待人工核验

1. **CyberGym‑E2E 数值跨官方页面不一致（需人工裁定）**：发布页与发布页脚注均为 **92.3%**（813 题口径），而官方模型页 `https://microsoft.ai/models/mai-cyber-2-flash/` 的「CyberGym‑E2E」计数动画属性为 `data-count-target="83.2"`（83.2%，Solved tasks, ahead of GPT-5.6 Cyber）。两者相差约 9 个百分点；**较可能的解释是分母不同**（92.3% × 813/905 ≈ 82.9%，与 83.2% 接近，即模型卡可能按全部 905 题计分、把 92 题算作未解），但官方未明说。账本按发布页口径记 92.3%，并在此披露该冲突。
2. **推理预算不对等**：92.3% 一行明示用了 GPT-6 Astra 一半的推理预算，不能当作同预算横比。
3. **WebExploitBench 无独立定义**：页面只印名称与两个百分比，未给指标名、题目集与判官；`benchmark_id` 按三步判定新铸为 `web-exploit-bench`（notes 标 `new-benchmark`）。它与账本内既有的 `web-pentesting`（OpenAI 匿名 web 黑盒渗透评测）**是否同一评测无法从页面确认**，故未合并，人工复核时需回溯原评测出处。
4. **Microsoft Perception 内部评测无数值**：只给「comparable to leading models」的相对结论，且评测集未命名，不建行。
5. **相对口径一律不建行**：每任务成本 < 2%、Insight Enterprises 20% token 效率、上下文窗口 4 倍，均为相对竞品或前代的营销口径，按仓库口径只在本文件转录。
6. 全部声明为厂商自报（Insight Enterprises 一项为客户自报），本次未做本地复跑或第三方独立复现。

---

## 附：另一批次独立归档转录（第七十一~七十六批链路）

> 本节为同一官方发布文的**另一批次独立抓取**转录，原样保留以便交叉核对；上文为基准批次的完整转录。两者取数口径不同（第七十批解出发布方自带数据常量，第七十一~七十六批链路只取正文散文明文），数值差异以本 release 的 evidence 行与 revisions[] 为准。

# MAI Cyber 2 Flash（Microsoft 官方发布文证据归档）

发布日期证据链：发布文页头印刷日期「Nov 17, 2026」（分类标记 Ignite · Models），并由 Microsoft Ignite 2026 家族汇总页 `https://microsoft.ai/news/microsoft-ignite-2026/` 同日发布交叉互证，`date_precision=day`。

- 发布文：https://microsoft.ai/news/introducing-mai-cyber-2-flash/ （`page.html`，服务端渲染 HTML，原始字节未改动存档）
- 家族汇总页：与 mai-code-2 归档同批抓取，存于 `models/2026-11-17-mai-code-2/ignite-2026-hub.html`
- 发现渠道：Microsoft AI 官方新闻索引 https://microsoft.ai/blog/ 与模型页 https://microsoft.ai/models/mai-cyber-2-flash/

## 官方定位（原文要点）

- 标题「MAI Cyber 2 Flash: Leading security. Lower cost」。
- 定位为微软最新安全专用模型，用于全天候漏洞发现、修复建议与威胁调查，建在微软数十年自有安全数据与经验之上。
- 官方明示「MAI Cyber 2 Flash is coming exclusively to Microsoft security products, including Codename MDASH, where it will automatically replace the existing model in the MAI profile for eligible customers starting mid-December.」

## 规格与架构（页面明示内容）

- **参数量**：页面未明示 → `params = null`
- **上下文窗口**：页面未明示 → `context_window = null`
- **定价**：页脚按 list price 给出评测用价 → `$0.10 / $0.01 / $0.50 per 1M tokens`（输入 / 缓存输入 / 输出）
- **模态**：页面未明示 → `modalities = null`

## 评测协议（Benchmarking 口径）

- 2 条 evidence 全部取自官方发布文正文散文明文（`evidence_type=text`），**不是位图读图、不是 OCR**，故一律记 `verified`。
- CyberGym-E2E：92.3% 任务成功率（对照 GPT-6 Astra 91.5%，官方称在 GPT-6 Astra **一半推理预算**下取得，成本不足其 2%）。
- WebExploitBench：40.4%（对照 GPT-5.6 Cyber 38.4%，**相同推理预算**）。
- 同一句里的竞品列按仓库口径只写进本行 `notes`，不另建 comparison_cited 行。
- 页面未明示 reasoning effort 档位、temperature、top_p、shots 与运行次数 → protocol 对应键 `null`，`comparison_scope` 记 `only_same_protocol`。
- new-benchmark: `webexploitbench`（仓内 data/benchmarks/ 尚无实体，判题口径未公开，兜底详情页承载）；与仓内 `exploitbench`（flag 数 0–16 口径）是不同评测，不合并。

## 图表

本批未读图、未做 OCR 视觉转录；页面内嵌位图与字体资源未单独下载存档，本归档的数值一律取自正文散文。
