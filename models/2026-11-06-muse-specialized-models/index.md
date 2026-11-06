---
vendor: meta
model: Muse Specialized Models
release: muse-specialized-models
date: 2026-11-06
source: https://research.meta.ai/blog/specialized-models-for-muse-and-metaai
fetched_at: 2026-11-06
---

# Bringing Specialized Models to Muse and Meta AI（Meta 官方发布文归档）

发布日期证据：官方发布页 JSON-LD `datePublished` = 2026-11-06T00:00:00.000Z；页面可见文字印刷「November 6, 2026」。二者一致。

- 发布文：https://research.meta.ai/blog/specialized-models-for-muse-and-metaai

## 发布内容

> Today, we're introducing specialized versions of our existing models, trained using Muse Wonder, and rolling them out to people who use Muse and Meta AI.

> With Muse Wonder, we introduced Active Memory and Active Focus. We're bringing both of these to our specialized models in Muse and Meta AI.

发布文**未给出 API 模型名字符串**，账本 release id 与 model id 均由发布标题派生（沿用 GPT-6 Cyber 先例）。

## 评测数据转录表：两张官方图表

两图均为页面内联 SVG（`data-visualization-preset="muse-wonder-bar"`），数值取自柱元素的 `aria-label` 与 `data-tooltip-values` JSON 载荷，在 DOM 中逐值可机读；页面另有 sr-only 文本摘要逐字印出同一组数值。官方未发布独立数值数据集，柱标签已是页面侧四舍五入后的整数百分数。

### 表一：Personal Superintelligence Index

> Current and previous Muse models on the Personal Superintelligence Index: 47% and 38%.

| 模型 | Index Score |
|---|---:|
| Current Muse Model（当前 Muse 专用模型） | 47% |
| Previous Muse Model（上一代 Muse 模型，同表基线列，不计入 evidence 行） | 38% |

### 表二：Active Memory Eval

> Current and previous Muse models on the Active Memory eval: 90% and 76%.

| 模型 | Tasks Correctly Using Critical Context |
|---|---:|
| Current Muse Model（当前 Muse 专用模型） | 90% |
| Previous Muse Model（上一代 Muse 模型，同表基线列，不计入 evidence 行） | 76% |

## 非评测内容（不入 evidence）

- 「a 2.4x reduction in forgetting critical information necessary for helping you achieve your goals」——**相对倍数描述**，非独立评测分。
- 「our models show a 67% improvement in completing everyday tasks where unexpected issues arise」——**相对提升描述**，非独立评测分。
- 「Index Score」的题目构成、权重与基线官方均未公开，两个百分比只能在同一次发布内作相对对照。
