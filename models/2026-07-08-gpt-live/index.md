---
vendor: openai
model: GPT‑Live
release: gpt-live
date: 2026-07-08
source: https://openai.com/index/introducing-gpt-live/
fetched_at: 2026-11-14
---

# GPT‑Live 官方发布页证据归档

本归档是 **OpenAI《Introducing GPT‑Live》官方发布页**的一级来源快照，用于给 `openai/gpt-live` 建档。

## 来源与日期证据

| 证据 | 位置 | 内容 |
|---|---|---|
| 页面印刷日期 | 页眉类目区 | `July 8, 2026` |
| 页面类目 | 页眉类目区 | `Product Release` |
| 标题 | `<h1>` | `Introducing GPT‑Live` |

发布日期取 **2026-07-08**。页面 JSON-LD / 结构化数据里出现的 `2026-11-09` / `11-10` / `11-13` 等日期经逐条核对均属页脚「Keep reading」区**其它文章**的发布日期，不是本文日期。

## 评测转录表

| 评测 | 分数 | 备注 |
|---|---|---|
| （无） | — | **本发布文正文完全没有出现任何评测基准、分数或评测图表**（全文不含 benchmark / score 等字样）。按「不臆造数值、无数值一律不记」纪律，账本 `benchmark_evidence` 记 0 行、release status 记 `pending`，不拿第三方榜单或二手转写代填 |

## 正文事实要点（无评测数值，供读者理解定位）

- 全双工架构：可同时听与说，会用「mhmm」「yeah」这类短语表示在听，能做快速来回短接，也会在你需要思考时保持安静。
- 面对需要联网检索、更深推理或更复杂工作的问题时，会在幕后委派给最新前沿模型并把结果带回来。
- 2026-07-31 更新：经 ChatGPT Voice 与 OpenAI API 生成的 GPT‑Live 音频已带 **SynthID 水印**；官方公开验证工具可检测 OpenAI 来源信号，并开放验证 API 供开发者接入自有工作流。
- 文中说明 GPT‑Live 在 ChatGPT 里暂不支持语音 + 视频或屏幕共享（官方称正在推进），这些能力在旧版 ChatGPT Voice（Standard / Advanced Voice Mode）中可用。
- 文首提示「This post introduced GPT‑Live. For current capabilities: Explore the model catalog」——本页是**首发介绍文**，当前能力与价格以官方模型目录为准，故参数量、上下文窗口与定价一律留 `null`。

## 抓取与降级路径记录

1. `GET https://openai.com/index/introducing-gpt-live/` → 200，555,982 字节，原样落盘为 `page.html`。
2. 页面共 9 个 `images.ctfassets.net` 图片地址，按原始字节取回并归档 4 张正文配图（`bidi-art-card` 首屏视觉卡 + 3 张 `gpt-live-visual-answer-*` 视觉问答示例：weather / sports / maps）；页脚「Keep reading」区的 5 张其它文章封面与本 release 证据无关，未纳入归档。
3. 本页无评测图表，无需渲染降级；正文未印参数量、上下文窗口与定价。

## 文件清单

见 `manifest.json`（含逐文件 sha256）。
