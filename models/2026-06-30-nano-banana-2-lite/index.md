---
vendor: google
model: Nano Banana 2 Lite / Gemini Omni Flash
release: nano-banana-2-lite
date: 2026-06-30
source: https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni-flash-nano-banana-2-lite
fetched_at: 2026-10-23
---

# Nano Banana 2 Lite 与 Gemini Omni Flash（Google，2026-06-30）

> 归档说明：`page.html` = 官方发布文原始存档（https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni-flash-nano-banana-2-lite），抓取于 2026-10-23。本页一次发布两个模型，故两个模型共用同一份归档与同一个账本文件。
> 发布日证据：页面 HTML 的 `article:published_time` 元数据为 `2026-06-30`，JSON-LD 的 `datePublished` 为 `2026-06-30T16:00:00+00:00`、`dateModified` 为 `2026-06-30T16:19:32.696637+00:00`。

## 发布要点（转录）

- **Nano Banana 2 Lite**（API 名 `gemini-3.1-flash-lite-image`）：官方定位「our fastest, most cost-efficient image model in the Nano Banana family yet」，为高吞吐、速度与规模而造。
- **Gemini Omni Flash**（API 名 `gemini-omni-flash-preview`）：官方定位为视频生成与对话式编辑的高质量、高性价比模型，Google I/O 上首次亮相，当天进入开发者公测。

## Nano Banana 2 Lite：官方明示内容

| 项 | 官方明示内容 |
|---|---|
| 定位 | 「Our fastest, most cost-efficient Gemini Image model in the Nano Banana family yet」，为快速构思与高velocity 开发者管线设计 |
| 迁移建议 | 官方推荐用 `gemini-3.1-flash-lite-image` 替换仍在使用初代 Nano Banana（`gemini-2.5-flash-image`）的开发者，官方称可「立即」在关键性能维度上受益 |
| 延迟 | 「Delivers text-to-image outputs in **4 seconds**」（文生图 4 秒出图） |
| 成本 | 「Cost-efficiency (**$0.034 per 1K image**)」（每 1K 张图像 0.034 美元） |
| 能力保留 | 官方称在优先保证速度的同时，仍保留可靠的提示词遵循、强角色一致性与清晰可读的图内文字渲染 |
| 上线渠道 | Google AI Studio、Gemini API、Gemini Enterprise Agent Platform（即时可用）；AI Mode in Search、Gemini app、NotebookLM、Google Photos、Stitch、Google Flow、Google Ads 等消费端产品陆续上线 |
| 来源标识 | 官方称 Nano Banana 2 Lite 与 Gemini Omni 均使用 **SynthID 水印**，可在 Gemini app、Gemini in Chrome 或 Search 中验证 |

## Nano Banana 2 家族的官方定位（同一发布文的对照说明）

- **Nano Banana 2 Lite（Gemini 3.1 Flash Lite Image）**：为速度而生——面向近实时、高吞吐工作流。
- **Nano Banana 2（Gemini 3.1 Flash Image）**：通用主力——更高质量、更低延迟，性能与成本的最佳平衡。
- **Nano Banana Pro（Gemini 3 Pro Image）**：面向复杂专业场景——控制力最强、推理最先进，准确性优先于速度。
- **Nano Banana（Gemini 2.5 Flash Image）**：官方标为旧型号，建议升级到 Nano Banana 2 Lite。

## Gemini Omni Flash：官方明示内容

| 项 | 官方明示内容 |
|---|---|
| 定位 | 「Gemini 的多模态推理遇上视频生成与编辑」；官方称原生支持由文本、图像与视频组合输入的高质量视频生成与对话式编辑 |
| 价格 | 「priced competitively at **$0.10 per second of video output**, which is the same as Veo 3.1 Fast」（每秒视频输出 0.10 美元，与 Veo 3.1 Fast 同价） |
| 时长 | 官方称目前提供 **10 秒**视频生成，更长时长即将支持 |
| 四大卖点 | 对话式视频编辑（自然语言精修）、多模态引用（组合图像/文本/视频保持场景一致）、真实世界知识（历史、生物、叙事逻辑）、文本与动作同步 |
| 官方限制 | 官方称 Gemini API 暂不支持上传音频参考与场景延展；API schema 接受最长 3 秒的视频引用，但模型目前无法正确处理；跨场景切换或平移时的角色一致性仍有局限 |
| 可用性 | 即日起在 Google AI Studio 与 Gemini API **公开预览**；同时进入 Gemini app 与 Google Flow |
| 评测指向 | 官方称完整评测信息请见 Google DeepMind 的 Gemini Omni 专页（本发布文只给示意图） |

## 评测数据（正文明文 + 图表行）

> 说明：本页的可机读数字只在正文散文中出现三处（延迟 4 秒、每 1K 图 0.034 美元、每秒视频 0.10 美元），已逐条转录为 evidence 行；官方自述的**性能对比表（Elo 分数、延迟、每 1K 图成本）是一张 GIF 图片**，按契约记 `pending`，图中数值不做视觉转写、不进数值字段。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Nano Banana 2 Lite 文生图延迟 | 4 秒 | 正文明文：「Delivers text-to-image outputs in 4 seconds」；官方口径为文生图出图时间，越低越好 |
| Nano Banana 2 Lite 每 1K 图成本 | $0.034 | 正文明文：「Cost-efficiency ($0.034 per 1K image)」；按图像计价的成本，越低越好；不是按 token 计价 |
| Nano Banana 2 / 2 Lite 与竞品对比（Elo / 延迟 / 每 1K 图成本） | — | `images/fig2-nano-banana-2-lite-performance-benchmark.gif`；官方图注说明该图比较 Nano Banana 2 与 2 Lite 相对竞品图像模型在生成/编辑质量（Elo 分数）、处理延迟与每 1K 分辨率图像成本上的取舍。**图中数值未转录**，账本记 `not_extracted` + `pending` |
| Nano Banana 家族模型对照表（2 Lite / 2 / Pro / 初代） | — | `images/fig3-nano-banana-family-model-table.gif`；定性定位对照图，无分数，不建 evidence 行，仅归档留证 |
| Gemini Omni 视频编辑对比 | — | `images/fig4-gemini-omni-flash-video-editing-benchmark.webp`；官方原图说明为「a benchmarking chart on video editing」，完整评测官方指向 DeepMind 的 Gemini Omni 专页，本页无任何可机读数值，不建 evidence 行 |

## 官方给出的组合工作流（可直接照做的用法）

- 官方建议串联两个模型：先用 Nano Banana 2 Lite 做高速图像生成，再把该图作为参考交给 Gemini Omni Flash 生成视频。
- 官方称通过 Interactions API 可以在多轮体验中保持会话历史与上下文，用户最多可叠加 **3 次**连续编辑。
- 官方列出三个可改写的 demo app：Anywhere（自拍/上传照片 → 瞬间到访数十个地标 → 点击生成动效片段）、Space Lift（上传房间照片 → 生成室内设计概念 → 观看动态呈现）、Omni product studio（把静态图转为电商短片）。

## 归档图片（均为官方原图下载）

| 文件 | 内容 |
|---|---|
| `images/fig1-nano-banana-2-lite-omni-flash-keyart.png` | 发布页主视觉（官方 `og:image`） |
| `images/fig2-nano-banana-2-lite-performance-benchmark.gif` | 官方性能对比图（Elo / 延迟 / 成本），本档唯一的性能图表来源 |
| `images/fig3-nano-banana-family-model-table.gif` | Nano Banana 家族模型对照表 |
| `images/fig4-gemini-omni-flash-video-editing-benchmark.webp` | Gemini Omni 视频编辑对比图 |

## 归档说明与已知缺口

- `page.html` 为官方页面的原始 HTTP 抓取存档（服务端渲染，正文与元数据均可直读）。
- **参数量与上下文长度**：本页未明示，账本一律记 `null`。
- **定价字段**：Nano Banana 2 Lite 按图像计价（$0.034 / 1K 图），Omni Flash 按视频秒数计价（$0.10 / 秒），两者都不是「每百万 token」定价，与账本 `pricing` 字段的按 token 形状不同，故价格信息记在正文转录与 notes 中。
- **Elo 与竞品分数**：官方性能表是 GIF 图片，图中数值未做视觉转写；官方也未点名所用评测名称，故该行只作 `pending` 留证。
- 页面中另有多个官方 demo 视频（`original_videos/*.mp4`），属演示素材，未下载归档。
