---
vendor: openai
model: GPT‑Live‑1
release: gpt-live-1
date: 2026-09-10
source: https://openai.com/index/introducing-gpt-live-1-in-the-api/
fetched_at: 2026-11-14
---

# GPT‑Live‑1 API 发布页证据归档

本归档是 **OpenAI《Build more natural voice experiences with GPT‑Live‑1 in the API》官方发布页**的一级来源快照，用于给 `openai/gpt-live-1` 建档。

## 来源与日期证据

| 证据 | 位置 | 内容 |
|---|---|---|
| 页面印刷日期 | 页眉类目区 | `September 10, 2026` |
| 页面类目 | 页眉类目区 | `Product Release` |
| 标题 | `<h1>` | `Build more natural voice experiences with GPT‑Live‑1 in the API` |

发布日期取 **2026-09-10**。页面 JSON-LD / 结构化数据里另出现的 `2026-11-09` / `2026-11-10` / `2026-11-11` 经逐条核对均属页脚「Keep reading」区**其它文章**的发布日期，不是本文日期。

## 评测转录表

| 评测 | 分数 | 备注 |
|---|---|---|
| Tau3（τ³-Bench）语音客服任务组（airline / retail / telecom） | #1 | 正文明文排名：`Paired with GPT-6 Astra at medium reasoning effort, it also ranks #1 on Tau3, which measures frontier voice-agent intelligence on end-to-end tasks.` 排名型而非绝对分值，账本记 `unit: rank`、display「#1」；同段图表 `gpt-live-card-1` 给出的 Pass@1 绝对值在客户端渲染，静态 HTML 无数值 |
| Tau3 banking_knowledge 子集（97 条任务） | —（未取数） | 正文给出题量与口径：`Evaluates spoken banking support with knowledge retrieval and account tools. Pass@1 is the fraction of 97 banking_knowledge tasks completed successfully. * GPT Live backend: Astra (medium).` 数值在客户端渲染图表 `gpt-live-card-2` 内，账本记 `pending` + `not_extracted` |
| Full Duplex Bench | —（未取数） | 正文只给**相对增量**：`Across our evaluations, GPT‑Live‑1 improves Full Duplex Bench performance by 30 percentage points over GPT‑Realtime‑2.1, with large gains in turn-taking latency and interactive behavior.` 绝对分值在客户端渲染图表 `gpt-live-card-3 / 4 / 5` 内，账本记 `pending` + `not_extracted`；竞品基线 GPT‑Realtime‑2.1 只进 notes，不另建行 |

## 抓取与降级路径记录

1. `GET https://openai.com/index/introducing-gpt-live-1-in-the-api/` → 200，544,534 字节，原样落盘为 `page.html`。
2. **本页全部评测图表均为客户端渲染**：`data-dotcom-chart` 组件在静态 HTML 中只留下空容器（如 `<div id="gpt-live-card-1" style="height:400px">`），vegaLite / 图表数据数组在页面静态 HTML 中**不存在**。因此绝对分值无法机读、也无法做视觉转写。本机无本地 Playwright / 无头浏览器可用，官方也未在静态 HTML 中提供图表数据的可检索镜像。
3. 页面配图共 15 个 `images.ctfassets.net` 地址，已按原始字节取回并归档：主视觉 `hero-gpt-live-1.png` 与 5 张客户引述卡 `customer-card-*.svg`；页脚「Keep reading」区的 5 张其它文章封面与 5 张卡片选中态副本与本 release 证据无关，未纳入归档。
4. 规格口径：页面未印参数量与上下文窗口（`null`）；定价按**分钟**计（`$0.05 per minute`，仅前端语音层），不是每百万 tokens，故 `pricing.input_per_m` / `output_per_m` 留 `null`、金额写在 `pricing.note`。
5. 客户引述中的数值（Speak 的打断次数下降近 80%、客户代码量减少 23K 行等）属客户内部评测、无官方协议，**不建 evidence 行**。

## 文件清单

见 `manifest.json`（含逐文件 sha256）。
