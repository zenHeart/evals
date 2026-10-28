---
vendor: google
model: Genie 4
release: genie-4
date: 2026-10-27
source: https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/
fetched_at: 2026-10-27
---

# Genie 4（Google DeepMind 世界模型发布页证据归档）

发布日期证据链（三源互证）：

1. 官方发布文页面页眉印刷日「October 27, 2026」。
2. 页面 JSON-LD 元数据 `datePublished: 2026-10-27T16:13:00+00:00`，`dateModified: 2026-10-27T17:48:44.831076+00:00`。
3. Google DeepMind 官方博客 RSS（`https://deepmind.google/blog/rss.xml`）对应条目 `pubDate` 为 2026-10-27。
4. 旁证：Google 官方博客同日发布《We're announcing Genie 4, our new world model for real-time interactive simulation》，页眉印刷日与 RSS `pubDate` 同为 2026-10-27（见 `page-google-blog.html`）。

来源：https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/

## 官方定位（原文要点）

Genie 4 是 Google DeepMind 的新一代**世界模型**（world model），用于实时交互式模拟。官方在发布文中明确的能力方向：

| 维度 | 官方表述要点 |
|---|---|
| 实时交互 | 可用自然语言实时「造世界」：描述风景与事件、移动镜头、加入新角色、改变天气，并即时看到后续发展 |
| 物理与写实 | 官方称在物理真实度与人物动作自然度上推进（物体碰撞、水流、树木随风摆动、生成角色的行为自然） |
| 原生音频 | 世界模型自带原生音频（native audio）能力 |
| 复杂事件模拟 | 借助 Gemini 系列模型完成复杂事件推演 |
| 模型构成 | 官方写明：Gemini Omni 为模拟提供真实世界外观与行为锚定，其他 Gemini 模型提供维持模拟连贯性与连续性所需的复杂推理 |

## 评测数据转录

| 评测 | 分数 | 备注 |
|---|---|---|
| （页面未给出任何评测名称或分数） | — | 本页**通篇没有出现任何评测基准名称、任何分数、任何百分比、任何对比表格**（全文正则核对：`\d+(\.\d+)?\s*%` 命中 0 处，`<table>` 命中 0 处，图表数值 0 处） |

未转录说明与口径边界：

1. **本页不是量化评测披露页**：官方以能力演示（demo 视频与提示词样例）为主，正文与图注均未给出基准名、分数或对比表；因此按抽取口径「无数值不臆造、无评测名称不硬挂」**不建任何 evidence 行**，release `status` 记 `pending`。
2. **不把产品/可用性信息当评测**：官方提到研究预览（research preview）向受信任测试者开放、并将进入 Project Genie（Google AI Ultra 订阅者）与 Gemini API / AI Studio 早期访问——这些是**分发与可用性信息**，不是评测协议或成绩，不入账本。
3. **参数量 / 上下文长度 / API 定价**：本页与 Google Genie 4 模型页（https://deepmind.google/models/genie/）均未明示，一律记 null。
4. **模型页同样无数值**：Genie 4 模型页全文同样无任何百分比、无表格、无图表数值（正文全为能力演示与提示词样例），两页互证「官方本轮未发布评测数值」。
5. 页面内图片与视频均为能力演示素材（生成世界截图、示例提示词配图），**不含评测图表**，故无视觉转写需求、无待人工核验的图表行。
