---
vendor: microsoft
model: MAI Code 2 / MAI Code 2 Flash
release: mai-code-2
date: 2026-11-17
source: https://microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash/
fetched_at: 2026-11-22
---

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
