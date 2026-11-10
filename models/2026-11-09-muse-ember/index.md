---
vendor: meta
model: Muse Ember
release: muse-ember
date: 2026-11-09
source: https://research.meta.ai/blog/muse-ember
fetched_at: 2026-11-09
---

# Introducing Our Smallest, Most Efficient Model: Muse Ember（Meta 官方发布文归档）

发布日期证据：官方发布页 JSON-LD `datePublished` = 2026-11-09T00:00:00.000Z；页面可见文字印刷「November 9, 2026」。二者一致。

- 发布文：https://research.meta.ai/blog/muse-ember

## 发布内容

> Muse Ember is our smallest and most efficient model, designed for complex reasoning execution and the work agents repeat all day.

> With a 1M-token context window and up to 512K output tokens.

> Muse Ember is available today on the Meta Model API, at $0.10 per million input tokens and $0.50 per million output tokens.

> it matches Haiku's best score at about a third of the cost and beats every Luna setting

## 评测数据转录表：官方 DOM 结果表

页面内 DOM `<table>`（benchmark-table-module），逐格取自单元格文本，DOM 逐值可机读。表头 3 列：**Featured model. Muse Ember (max) | Claude Haiku 5.5 (max) | GPT-6 Luna (max)**。转录**首列**；其余两列为竞品对照，只记入账本 notes。

| 类别 | 基准 | Muse Ember (max) | 同格括注 |
|---|---|---:|---|
| Agents | AutomationBench-AA | 37.8 | E2E business workflows |
| Agents | Agents' Last Exam | 61.6 | End-to-end agent tasks |
| Agents | Personal Superintelligence Index | 46.8 | Internal composite index of personal and knowledge work |
| Coding | Terminal-Bench 4.0 | 40.9 | Agentic terminal coding, best published harness |
| Coding | Coding Agent Index-AA | 46 | Coding in real agent harnesses |
| Coding | FrontierCode 2.0-AA | 27.2 | Real engineering tasks judged on mergeability |
| Multimodal | GDP.pdf-AA | 22.8 | Professional work over long documents |
| Multimodal | OSWorld 2.1 | 69.5 (partial) / 33.8 (binary) | Computer use across desktop apps |
| Multimodal | PerceptionBench (w/ tools) | 80.6 | Fine-grained visual perception |
| General | Artificial Analysis Index | 36 | — |

**来源标注（页面 figcaption 原文）**：

- 「Artificial Analysis | November 9, 2026. Strict pass@1.」——第三方评测机构口径
- 「Meta internal evaluation. Partial-credit reward.」——厂商内部口径
- 「Meta internal evaluation. With tools.」——厂商内部口径
- 「Meta internal evaluation. Linux subset.」——厂商内部口径
- 「Internal composite index of personal and knowledge work.」——厂商内部复合指数
- 「Each model in its best published harness. See footnote 1.」——OSWorld 行脚注口径

**表二：Intelligence Index 与成本（Artificial Analysis 口径）**

| 项目 | Muse Ember (max) | Muse Spark 1.3 (max) |
|---|---:|---:|
| Intelligence Index | 36 | 37 |
| Cost Per Intelligence Index Task | $0.14 | $2.39 |
| Price Per 1M Input / Output Tokens | $0.10 (input) / $0.50 (output) | $1.25 (input) / $4.25 (output) |

表二首列为 Muse Ember，但三行均属价格 / 指数口径而非独立评测分，仅取 Intelligence Index 一行作 evidence，其余两行记 notes。

## 非评测内容（不入 evidence）

- 「matches Haiku's best score at about a third of the cost」——**相对描述**，非独立评测分。
- 「outputs up to 30% fewer tokens」「p95 of 2.2 seconds」——效率描述，非评测分。
- 「36–48% fewer output tokens」（合作方引述）——非基准分。
- Intelligence-vs-Cost 散点图的逐点值未转录（图表）。
