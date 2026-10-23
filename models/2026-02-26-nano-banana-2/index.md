---
vendor: google
model: Nano Banana 2
release: nano-banana-2
date: 2026-02-26
source: https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/
fetched_at: 2026-10-23
---

# Nano Banana 2（Gemini 3.1 Flash Image，Google，2026-02-26）

> 归档说明：`page.html` = 官方发布文原始存档（https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/），抓取于 2026-10-23。
> 发布日证据：页面 HTML 的 `article:published_time` 元数据为 `2026-02-26`，JSON-LD 的 `datePublished` 为 `2026-02-26T16:00:00+00:00`；同一 JSON-LD 的 `dateModified` 为 `2026-03-19T17:48:15.796286+00:00`，说明该页此后经过编辑，归档页不是发布当日的快照。

## 发布要点（转录）

- 官方定位原文：「Introducing Nano Banana 2 (Gemini 3.1 Flash Image), our latest state-of-the-art image model」——把 Nano Banana Pro 具备的世界知识、质量与推理带到 Flash 速度上。
- 官方口径的核心变化：过去只有 Pro 档才有的能力（真实世界知识、精确文字渲染与翻译）下沉到 Flash 档，官方称之为「让快速编辑与迭代成为可能」。
- 官方给出的产品分工：Nano Banana Pro 用于「需要最高事实准确度的高保真任务」，Nano Banana 2 用于「快速生成、精确指令遵循与内置图像搜索接地」。

## 官方明示的能力项（逐条转录）

| 能力 | 官方明示内容 |
|---|---|
| Advanced world knowledge（世界知识） | 取材自 Gemini 的真实世界知识库，并由实时信息与图像搜索提供的图片支撑；官方称有助于画信息图、把笔记转成图表、生成数据可视化 |
| Precision text rendering and translation（文字渲染与翻译） | 可生成准确、可读的文字（营销样机、贺卡），并可在图内翻译与本地化文字 |
| Subject consistency（主体一致性） | 单个工作流内保持最多 **5 个**角色的相似度，以及最多 **14 个**物体的保真度 |
| Precise instruction following（指令遵循） | 官方称对复杂请求的遵循更严格，能捕捉想法中的具体细节 |
| Production-ready specs（生产级规格） | 多种宽高比，分辨率从 **512px 到 4K** |
| Visual fidelity upgrade（视觉保真升级） | 官方称在 Flash 速度下带来更亮的光照层次、更丰富的纹理与更锐利的细节 |

## 铺开渠道（官方逐项列出）

| 渠道 | 官方说明 |
|---|---|
| Gemini app | 取代 Nano Banana Pro，覆盖 Fast、Thinking、Pro 三个模型档；Google AI Pro / Ultra 订阅者可经三点菜单重新生成继续使用 Nano Banana Pro |
| Search | AI Mode 与 Lens（Google app、移动端与桌面浏览器）；官方称新增 141 个国家和地区、8 种语言 |
| AI Studio + Gemini API | 预览可用；页面把定价指向 `https://ai.google.dev/gemini-api/docs/pricing#gemini-3.1-flash-image-preview`（本页未印出价格） |
| Google Cloud | Vertex AI 通过 Gemini API 预览可用 |
| Flow | 成为 Flow 的**新默认**图像生成模型，所有 Flow 用户零积分可用 |
| Google Ads | 已上线，在创建广告活动时提供素材建议 |

## 来源标识与核验（provenance）

- 官方称把 SynthID 与可互操作的 **C2PA Content Credentials** 结合起来：不仅标出「是否用了 AI」，还说明「怎么用的」。
- 官方称自 11 月上线以来，Gemini app 里的 SynthID 验证功能已被使用 **超过 2000 万次**（跨多种语言），用于识别 Google AI 生成的图像、视频与音频；C2PA 验证将随后进入 Gemini app。

## 评测数据：本页未给出任何可机读的评测数值

- 通读全页：**没有出现任何评测（benchmark）名称、任何分数、任何对比表格**。页面中的全部图片都是能力与产品演示素材（如信息图、角色一致性示例、Gemini app 模板界面、AI Mode 与 Flow 的产品截图）。
- 因此按抽取口径**不建任何 evidence 行**（数值缺失不臆造，且无评测名称可挂），账本 `benchmark_evidence` 为空数组、release `status` 记 `pending`。
- 唯一可量化的数字是 SynthID 验证的使用次数（超过 2000 万次），那是**产品功能用量**而非模型评测成绩，只在此备查，不进 evidence。

## 归档图片（均为官方原图下载）

| 文件 | 内容 |
|---|---|
| `images/fig1-nano-banana-2-hero.webp` | 页面头图（Nano Banana 2 Hero） |
| `images/fig2-nano-banana-2-subject-consistency.webp` | 主体一致性演示：农场里 14 个角色与物体的稳定保真（官方 caption：Joyful characters and items at a farm） |
| `images/fig3-nano-banana-2-asset-demo.webp` | 生产级资产演示（官方 caption：16:9 分镜、雾气山谷俯瞰等生成样例） |
| `images/fig4-nano-banana-2-social-card.png` | 官方社交分享卡（`og:image`） |

## 归档说明与已知缺口

- `page.html` 为官方页面的原始 HTTP 抓取存档（服务端渲染，无需 JS 渲染即可读到正文与元数据）。
- **参数量、上下文长度、API 定价**：本页未明示，账本一律记 `null`；定价另见页面外链的官方定价页。
- **评测证据缺口**：本页无任何评测数据，本档只能作为「发布事实与能力描述」的一级来源，评测证据需等待官方后续页面或模型卡补充。
- 页面于 2026-03-19 被编辑过（`dateModified`），归档页反映的是 2026-10-23 抓取时的页面状态。
