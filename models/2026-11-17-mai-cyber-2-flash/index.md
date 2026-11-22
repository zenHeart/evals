---
vendor: microsoft
model: MAI Cyber 2 Flash
release: mai-cyber-2-flash
date: 2026-11-17
source: https://microsoft.ai/news/introducing-mai-cyber-2-flash/
fetched_at: 2026-11-22
---

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
