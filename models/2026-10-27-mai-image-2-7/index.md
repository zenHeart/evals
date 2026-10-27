---
vendor: microsoft
model: MAI-Image-2.7
release: mai-image-2-7
date: 2026-10-27
source: https://microsoft.ai/news/mai-image-2-7-debut/
fetched_at: 2026-10-27
---

# MAI Image 2.7（Microsoft AI 官方发布通告证据归档）

发布日期证据链：官方发布通告页面 JSON-LD `datePublished=2026-10-27T15:10:00+00:00`、`dateModified=2026-10-27T16:39:56+00:00`；页面为 Microsoft AI 官网新闻栏目（microsoft.ai/news/mai-image-2-7-debut/），标题即发布文标题。

## 官方定位（原文要点）

- 标题：*MAI Image 2.7 debuts above GPT Image 2.5 Flare on Artificial Analysis and #3 on Arena*。
- 正文：**MAI-Image-2.7** 在 Artificial Analysis 评测的**全部 10 个使用场景**与**全部 7 类编辑动作**上均优于 MAI-Image-2.6，并在「增强与修复」「推理式编辑」「场景与风格」「文字或符号编辑」四类达到品类前沿。
- 正文：**最强项是「场景与风格」**，比次优模型**领先 24 Elo**。
- 可用性：官方写明可即刻在 **Arena / Artificial Analysis / MAI Playground** 上试用 **图像编辑**能力，**文生图能力稍后开放**（text-to-image generation coming soon）。

## 评测数值转录

正文只给**相对结论与名次**，**没有任何绝对分值**（页面可见文本中百分比命中 0 处、无绝对 Elo 数字）。

| 评测 | 分数 | 备注 |
|---|---|---|
| Artificial Analysis Image Arena（AA-Image-Editing v2.1）总榜 | 第 2 名（全部公开模型中） | **配图柱状图行**（Elo from blind preference votes in the Image Arena），视觉转写：MAI-Image-2.7-Preview 第 2、MAI-Image-2.6 家族在后；图中 Elo 数值只以柱长呈现，**页面未印绝对 Elo** → 记 pending，值留空 |
| Artificial Analysis Image Arena 分类名次：推理式编辑 | 第 7 名 → 第 1 名（上升 6 位） | 配图（chart-category-rank-climb.svg 的 aria-label）视觉转写 |
| Artificial Analysis Image Arena 分类名次：场景与风格 | 第 7 名 → 第 1 名（上升 6 位） | 同上 |
| Artificial Analysis Image Arena 分类名次：文字或符号编辑 | 第 6 名 → 第 1 名（上升 5 位） | 同上 |
| 场景与风格类与次优模型的 Elo 差 | +24 Elo（相对差，非绝对值） | 正文明文，但只有相对差 → 不建行，只写进 notes |
| Arena 图像榜总名次 | 第 3 名 | **仅出现在页面标题**，正文未复述、也未给 Elo 绝对值 → 只写进 notes，不单独建行 |

图表出处（原文脚注）：

- 柱状图：**Source: Artificial Analysis · AA-Image-Editing v2.1**
- 名次爬升图：**Source: Artificial Analysis Image Arena · Evaluated 22 Oct 2026**

未转录说明与口径边界：

1. **无绝对分值**：本页没有印出任何 Elo 数字或百分比，只有名次与相对差；按「无数值不臆造」口径，唯一建的一条 evidence 是**配图行**（`evidence_type: figure`、`reported_score.value: null`、`score_status: not_extracted`、`status: pending`），视觉转写值只进 notes。
2. **两个榜单要分清**：Artificial Analysis Image Arena（AA-Image-Editing v2.1，评测日 2026-10-22，给出「第 2 名」与分类名次）与页面标题里的「#3 on Arena」（arena.ai 图像榜）**不是同一张榜**，不可混读；官方正文未说明标题那一名的具体榜单与 Elo。
3. **图表里的模型名带 Preview**：柱状图标签为 **MAI-Image-2.7-Preview**（送评预览版），官方正文与标题一律称 MAI-Image-2.7；两者是同一发布的前后两个称谓，notes 已注明。
4. **官方未明示规格**：参数量、上下文长度与 API 定价本页均未给，一律记 null；分发信息（AI Playground 可试用、文生图稍后开放）属可用性而非评测协议。
5. **无独立模型页**：microsoft.ai/models/mai-image-2-7/ 当前 404，官方 models 索引页直接链到本发布通告页，故 primary_sources 只有一条官方发布文。
