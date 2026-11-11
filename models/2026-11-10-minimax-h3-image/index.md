---
vendor: minimax
model: MiniMax H3-Image
release: minimax-h3-image
date: 2026-11-10
source: https://www.minimax.io/blog/minimax-h3-image
fetched_at: 2026-11-10
---

# MiniMax H3-Image: Bringing 4K Image Generation into the 10-Second Era

> 归档说明：`page.html` 为官方发布页 `https://www.minimax.io/blog/minimax-h3-image` 的原始存档（HTTP 200，70295 字节，服务端渲染 HTML，单行压缩），抓取于 2026-11-10。页面引用 3 张正文图片（首图 + 延迟对比图 + 定价图）与 4 张站点导航栏图标，全部原样下载到 `images/`；延迟图与定价图另存原始格式（非 webp）版本各一份。

## 发布日证据链（三方互证）

| 来源 | 原文 | 说明 |
|---|---|---|
| 发布页 JSON-LD（`NewsArticle`） | `"datePublished":"2026-11-10T16:23:20.000Z"`，`"dateModified":"2026-11-10T16:23:20.000Z"` | 页面 `<head>` 内 schema.org JSON-LD 的 `@graph` 中 `@type:"NewsArticle"` 节点（`@id` = `https://www.minimax.io/blog/minimax-h3-image#article`） |
| 官方模型发布说明页 | `Nov. 10, 2026` / `MiniMax H3 Image` / `A leading open-weight image model. From ideas to new worlds.` | `https://platform.minimax.io/docs/release-notes/models` 的 `Nov. 10, 2026` 条目卡片（`Heading id="nov-10-2026"`，卡片链接指向 `/guides/image-generation`） |
| 发布页页头日期行 | `<time>2026-11-11</time>` | **与 UTC 日期相差一天**：16:23:20 UTC + 8 小时 = 2026-11-11 00:23:20 CST（UTC+8），即页面渲染的 CST 日期是同一时刻的本地时呈现，非另一次发布。账本按仓库惯例取 UTC 日期 **2026-11-10** |

## 发布要点（转录）

- MiniMax 官方宣布发布 MiniMax H3-Image，定位为开放权重（open-weight）图像生成模型，构建在 H3 之上。原文：「Today, we're releasing MiniMax H3-Image, an open-weight image generation model built on H3. It supports text-to-image generation, reference-based generation, and image editing.」
- 官方称可在 10 秒内生成 4K 图像，并支持最多 16 张参考图。原文：「H3-Image can generate a 4K (4096 × 4096) image in under 10 seconds, with rich, realistic details, strong prompt adherence, the ability to understand and work with up to 16 reference image.」
- 后训练全链路改进：官方称从数据、强化学习，到采样步数削减（sampling-step reduction）、PE（prompt enhancement）与部署优化均有提升，且「No single change made the difference. Together, these improvements allow H3-Image to deliver speed, image quality, and prompt adherence at the same time.」
- 速度主张：原文「MiniMax H3-Image can generate a full-resolution 4K image in under 10 seconds, at up to 5× the speed of mainstream alternatives.」
- 画质主张：官方称产出细节丰富自然、避免 AI 图常见的过度平滑观感，并希望「further narrow the gap between AI-generated images and the real visual world」。
- 提示词遵循：原文「H3-Image delivers state-of-the-art prompt adherence among open-weight models, with support for up to 16 reference images.」——「among open-weight models」限定在开放权重模型范围内，不作跨厂商绝对比较。
- 开放权重：原文「As with H3, we're releasing H3-Image's model weights.」「We want to support open research and give developers and creators the freedom to customize models and build their own tools and workflows.」权重发布于 Hugging Face（`https://huggingface.co/MiniMaxAI/MiniMax-H3-Image`）。
- 上线渠道：MiniMax API Platform、MiniMax Code、Hailuo AI。原文「H3-Image is also available through the MiniMax API Platform, MiniMax Code, and Hailuo AI, providing reliable, high-quality image generation services.」
- 官方给出的三个入口：Hugging Face、API（`https://platform.minimax.io/docs/guides/image-generation`）、MiniMax Code（`https://code.minimax.io/about`）。

## 评测数据

> 说明：发布页**未给出任何标准公开评测的可机读离散分数**（无 DOM 表格、无跑分表、无榜单位次）。页面上的全部数字只有两类来源：(a) 正文散文的工程/规格指标；(b) 两张**位图**内的数值（延迟对比图 `images/h3-image-latency-chart.png`、定价图 `images/h3-image-pricing-chart.png`）。位图数值按仓库口径不得作为唯一证据，故**全部不建证据行**，仅在本文件内完整转录留证。

### 数值全量转录表

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| 4K 图像生成耗时 | 10 秒以内 | 正文散文明文：「can generate a full-resolution 4K image in under 10 seconds」；工程指标，非评测，无标准公开基准可比 |
| 4K 图像分辨率 | 4096 × 4096 | 正文散文明文「4K (4096 × 4096)」；规格指标，非评测 |
| 4K 图像像素量 | 16MP | 正文散文明文「4K (16MP, 4096 × 4096)」；规格指标，非评测 |
| 生成速度相对主流方案 | 最高 5× | 正文散文明文「at up to 5× the speed of mainstream alternatives」；**相对口径，未建行**（官方未印竞品绝对值与测试协议） |
| Standard 模式速度相对主流方案 | 1.5–2× | 正文散文明文「H3-Image's Standard mode is 1.5–2× as fast as mainstream alternatives」；**相对口径，未建行** |
| Highspeed 模式速度相对主流方案 | 3–4× | 正文散文明文「while Highspeed mode reaches 3–4× the speed」；**相对口径，未建行** |
| 价格相对主流可比方案 | 50–70% | 正文散文明文「Pricing is 50–70% of comparable mainstream offerings」；**相对口径，未建行** |
| 发布周 4K 及以上请求折扣 | 五折 | 正文散文明文「For launch week, we're offering 50% off the standard price for image generation requests at 4K resolution and above」；促销条款，非评测 |
| 参考图数量上限 | 16 张 | 正文散文明文「with support for up to 16 reference images」；规格指标，非评测（官方 API 指南亦载 1–16 张） |
| 常见输出规格对比 | 1K / 2K | 正文散文明文「Compared to the more common 1K or 2K outputs」；规格指标，非评测 |
| 提示词遵循（开放权重模型范围内） | state-of-the-art | 正文散文明文「state-of-the-art prompt adherence among open-weight models」；定性论断，无数值，**未建行** |

### 延迟对比图（位图，视觉转写，不建行）

图片：`images/h3-image-latency-chart.png`（标题「Model Latency Comparison Across Resolutions」，副标题「P50 (median latency) · Unit: seconds · Lower is faster」，图例 H3 Standard / H3 Highspeed / Other Models）。**官方图注原文**：「Sources: User-provided comparison chart and second-round benchmark table. H3 uses second-round P50 results; other models retain the original data. All y-axes range from 0 to 70 s.」——H3 用第二轮 P50 结果，竞品沿用各自原始数据，两者非同口径，横纵坐标均以秒计。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| 文生图 1K · H3-Image Standard | 10.6 秒 | 位图视觉转写；工程指标（延迟），非评测分数；与其他模型非同口径 |
| 文生图 1K · H3-Image Highspeed | 7.7 秒 | 同上 |
| 文生图 1K · Nano Banana 2.1 thinking·medium | 17.0 秒 | 同上；竞品列，官方称沿用原始数据 |
| 文生图 1K · Nano Banana 2.1 thinking·high | 20.0 秒 | 同上；竞品列 |
| 文生图 1K · GPT-image 2.5 quality·medium | 14.0 秒 | 同上；竞品列 |
| 文生图 1K · GPT-image 2.5 quality·high | 27.0 秒 | 同上；竞品列 |
| 文生图 1K · GPT-image 2.6 medium | 9.0 秒 | 同上；竞品列 |
| 文生图 1K · Seedream 5 Pro | 34.4 秒 | 同上；竞品列 |
| 文生图 2K · H3-Image Standard | 10.5 秒 | 位图视觉转写；工程指标（延迟），非评测分数 |
| 文生图 2K · H3-Image Highspeed | 7.6 秒 | 同上 |
| 文生图 2K · Nano Banana 2.1 thinking·medium | 28.0 秒 | 同上；竞品列 |
| 文生图 2K · Nano Banana 2.1 thinking·high | 31.0 秒 | 同上；竞品列 |
| 文生图 2K · GPT-image 2.5 quality·medium | 21.0 秒 | 同上；竞品列 |
| 文生图 2K · GPT-image 2.5 quality·high | 36.0 秒 | 同上；竞品列 |
| 文生图 2K · GPT-image 2.6 medium | 10.0 秒 | 同上；竞品列 |
| 文生图 2K · Seedream 5 Pro | 54.2 秒 | 同上；竞品列 |
| 文生图 4K (16MP) · H3-Image Standard | 16.0 秒 | 位图视觉转写；工程指标（延迟），非评测分数 |
| 文生图 4K (16MP) · H3-Image Highspeed | 10.3 秒 | 同上 |
| 文生图 4K (16MP) · Nano Banana 2.1 thinking·medium | 50.0 秒 | 同上；竞品列 |
| 文生图 4K (16MP) · Nano Banana 2.1 thinking·high | 51.0 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）1K · H3-Image Standard | 14.2 秒 | 位图视觉转写；工程指标（延迟），非评测分数 |
| 图像编辑（1 张参考图）1K · H3-Image Highspeed | 10.0 秒 | 同上 |
| 图像编辑（1 张参考图）1K · Nano Banana 2.1 thinking·medium | 20.0 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）1K · Nano Banana 2.1 thinking·high | 22.0 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）1K · GPT-image 2.5 quality·medium | 18.0 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）1K · GPT-image 2.5 quality·high | 30.0 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）1K · GPT-image 2.6 medium | 23.0 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）1K · Seedream 5 Pro | 34.6 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）2K · H3-Image Standard | 13.7 秒 | 位图视觉转写；工程指标（延迟），非评测分数 |
| 图像编辑（1 张参考图）2K · H3-Image Highspeed | 10.0 秒 | 同上 |
| 图像编辑（1 张参考图）2K · Nano Banana 2.1 thinking·medium | 29.0 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）2K · Nano Banana 2.1 thinking·high | 31.0 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）2K · GPT-image 2.5 quality·medium | 28.0 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）2K · GPT-image 2.5 quality·high | 36.0 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）2K · GPT-image 2.6 medium | 28.0 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）2K · Seedream 5 Pro | 62.3 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）4K (16MP) · H3-Image Standard | 18.2 秒 | 位图视觉转写；工程指标（延迟），非评测分数 |
| 图像编辑（1 张参考图）4K (16MP) · H3-Image Highspeed | 12.5 秒 | 同上 |
| 图像编辑（1 张参考图）4K (16MP) · Nano Banana 2.1 thinking·medium | 48.0 秒 | 同上；竞品列 |
| 图像编辑（1 张参考图）4K (16MP) · Nano Banana 2.1 thinking·high | 54.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）1K · H3-Image Standard | 17.3 秒 | 位图视觉转写；工程指标（延迟），非评测分数 |
| 图像编辑（3 张参考图）1K · H3-Image Highspeed | 12.0 秒 | 同上 |
| 图像编辑（3 张参考图）1K · Nano Banana 2.1 thinking·medium | 26.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）1K · Nano Banana 2.1 thinking·high | 29.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）1K · GPT-image 2.5 quality·medium | 22.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）1K · GPT-image 2.5 quality·high | 40.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）1K · GPT-image 2.6 medium | 21.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）1K · Seedream 5 Pro | 39.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）2K · H3-Image Standard | 15.8 秒 | 位图视觉转写；工程指标（延迟），非评测分数 |
| 图像编辑（3 张参考图）2K · H3-Image Highspeed | 11.2 秒 | 同上 |
| 图像编辑（3 张参考图）2K · Nano Banana 2.1 thinking·medium | 30.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）2K · Nano Banana 2.1 thinking·high | 40.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）2K · GPT-image 2.5 quality·medium | 30.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）2K · GPT-image 2.5 quality·high | 30.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）2K · GPT-image 2.6 medium | 24.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）2K · Seedream 5 Pro | 55.3 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）4K (16MP) · H3-Image Standard | 21.4 秒 | 位图视觉转写；工程指标（延迟），非评测分数 |
| 图像编辑（3 张参考图）4K (16MP) · H3-Image Highspeed | 14.4 秒 | 同上 |
| 图像编辑（3 张参考图）4K (16MP) · Nano Banana 2.1 thinking·medium | 62.0 秒 | 同上；竞品列 |
| 图像编辑（3 张参考图）4K (16MP) · Nano Banana 2.1 thinking·high | 64.0 秒 | 同上；竞品列 |

### 定价图（位图，视觉转写，不建行）

图片：`images/h3-image-pricing-chart.png`（标题「H3-Image Pricing / Example Task Costs」，单位「US Dollar · USD」，列头「H3-Image Standard」「H3-Image Highspeed」，表头注明「USD / image」）。**官方脚注原文**：「Notes: 1K / 2K / 4K indicate output resolution. Each reference image is 1K (1024 × 1024). All prices are in USD. Costs are illustrative, not fixed per-image prices or averages. Some 1K/2K examples are adjusted for presentation. Values use 5 decimal places. Actual charges depend on token usage; promotional totals are halved before rounding. 4K offer: 50% off for images ≥16,000,000 pixels until Nov 17, 2026, 16:00 UTC (exclusive). Strikethrough = regular price. Official pricing: platform.minimax.io/docs/pricing/overview」——官方明确写明这些每张单价是示意值、非固定价格，故只作上下文，不建行。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| 文生图 1K (1024 × 1024) · Standard | $0.02179 | 位图视觉转写；官方标注 illustrative 示意单价，非固定每图价格，非评测 |
| 文生图 1K · Highspeed | $0.03529 | 同上 |
| 文生图 2K (2048 × 2048) · Standard | $0.02333 | 同上 |
| 文生图 2K · Highspeed | $0.03622 | 同上 |
| 文生图 4K (4096 × 4096) · Standard | $0.06879（原价）→ $0.03439（发布周五折） | 同上；划线价 = 原价 |
| 文生图 4K · Highspeed | $0.13001（原价）→ $0.06501（发布周五折） | 同上 |
| 图像编辑（1 张参考图）1K · Standard | $0.02654 | 同上 |
| 图像编辑（1 张参考图）1K · Highspeed | $0.04525 | 同上 |
| 图像编辑（1 张参考图）2K · Standard | $0.02658 | 同上 |
| 图像编辑（1 张参考图）2K · Highspeed | $0.04576 | 同上 |
| 图像编辑（1 张参考图）4K · Standard | $0.07312（原价）→ $0.03656（发布周五折） | 同上 |
| 图像编辑（1 张参考图）4K · Highspeed | $0.13673（原价）→ $0.06837（发布周五折） | 同上 |
| 图像编辑（3 张参考图）1K · Standard | $0.03563 | 同上 |
| 图像编辑（3 张参考图）1K · Highspeed | $0.06037 | 同上 |
| 图像编辑（3 张参考图）2K · Standard | $0.04177 | 同上 |
| 图像编辑（3 张参考图）2K · Highspeed | $0.06069 | 同上 |
| 图像编辑（3 张参考图）4K · Standard | $0.07914（原价）→ $0.03957（发布周五折） | 同上 |
| 图像编辑（3 张参考图）4K · Highspeed | $0.15407（原价）→ $0.07703（发布周五折） | 同上 |

### 官方定价页（正文可机读，非发布页）

绝对定价不出现在发布页正文，但官方 API 定价页 `https://platform.minimax.io/docs/pricing/overview` 的 Image Generation 表给出可机读绝对价（账本 `pricing` 字段据此记录）：

| 计价项 | MiniMax-H3-Image（Standard） | MiniMax-H3-Image-Highspeed |
| --- | --- | --- |
| 输入文本（$ / M tokens） | $2.30 | $2.30 |
| 输入图像（$ / M tokens） | $1.50 | $3.00 |
| 输出图像（$ / M tokens） | $3.80 | $7.60 |

发布周优惠条款原文：「Limited-Time Offer: 50% Off 4K Image Generation: From now until November 17, 2026, at 16:00 UTC (exclusive), enjoy 50% off the total request cost for MiniMax-H3-Image and MiniMax-H3-Image-Highspeed when the final delivered image has at least 16,600,000 pixels (width × height).」——注意该页写 **16,600,000** 像素，而发布页定价图脚注写 **≥16,000,000** 像素，两处门槛表述不一致，均保留原样，不做调和。

### 官方 API 指南补充规格（`https://platform.minimax.io/docs/guides/image-generation`）

- 端点：文生图 `POST /v1/images/generations`（仅 prompt）、图像编辑 `POST /v1/images/edits`（prompt + 1 至 16 张参考图）；同步接口，`stream` 开启时逐图推送。
- 提示词长度上限 32000 字符；关闭提示词增强时仅前约 4096 tokens 生效。
- 单次请求出图 1–10 张（默认 1）；输出格式 jpeg（默认）/ png / webp；参考图 1–16 张。
- 输出尺寸：`area` 可取 1K / 2K / 4K（默认 4K），目标面积分别为 1024 × 1024、2048 × 2048、4096 × 4096 像素；或直接给 `WIDTHxHEIGHT`（面积须在 655,360 至 20,000,000 像素之间，宽高比 1:3 至 3:1）；不支持预览图、蒙版编辑与透明背景。
- 高速档 `MiniMax-H3-Image-Highspeed` 参数与限制同 Standard。

## 未明示项（账本记 null 的依据）

- 参数量：官方未给。
- 上下文长度：官方未给（图像模型，无 token 上下文长度说明）。
- 权重许可证：官方称开放权重并已发布到 Hugging Face，但未明示许可证类型与参数档位。
- 评测分数：官方页面无任何标准公开评测的可机读离散分数。

## 归档说明

- `page.html` = 官方发布页原始存档（含完整 JSON-LD 与 `<time>2026-11-11</time>` 日期行）。
- `images/h3-image-cover.jpg` / `.webp`：发布页首图（原图 jpg + 页面实际引用的 webp 变体）。
- `images/h3-image-latency-chart.png` / `.webp`：延迟对比图（位图，数值仅视觉转写，不建行）。
- `images/h3-image-pricing-chart.png` / `.webp`：定价示例图（位图，数值仅视觉转写，不建行）。
- `images/nav-menu-icon-*.png`：页面导航栏引用的 4 张站点图标（filecdn.minimax.chat），非发布内容图片，仅作页面完整性留存。
- 按仓库抽取口径，页面所有数字均属工程/规格指标或相对营销口径，**不构成标准公开评测**，本次 `benchmark_evidence` 记 0 行、release `status` 记 `pending`。
