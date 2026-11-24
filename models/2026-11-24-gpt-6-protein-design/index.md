---
vendor: openai
model: GPT-6.2 / GPT-6 家族最新内部模型
release: gpt-6-protein-design
date: 2026-11-24
source: https://openai.com/index/gpt-6-models-demonstrate-intrinsic-protein-design-capabilities/
fetched_at: 2026-11-24
---

# GPT-6 models demonstrate intrinsic protein-design capabilities（OpenAI 官方研究文证据归档）

发布日期证据链：官方 RSS `https://openai.com/news/rss.xml` 的 pubDate「Tue, 24 Nov 2026 11:00:00 GMT」，与页面印刷日「November 24, 2026」双源互证，`date_precision=day`。

- 官方发布文：https://openai.com/index/gpt-6-models-demonstrate-intrinsic-protein-design-capabilities/ （`page.html`，原始 HTML 未改动存档）
- 页面分类：Research · Publication；同页链接预印本《GPT-6 as a Universal Foundation Model for Protein Biology: Beyond Specialized Models》

## 官方定位（原文要点）

- 「Our GPT‑6 family of models can design new protein shapes and the sequence of their chemical building blocks using only reasoning and code, without calling specialized biology models to generate those designs.」
- 「An internal research model matched or outperformed specialized models on many protein design tasks.」
- 「In lab tests with Onava, proteins based on GPT‑6.2’s designs showed evidence of binding, or attachment, across five targets.」
- 「Specialized models helped supply sequences and select candidates for testing.」

## 评测转录表（官方发布文正文散文明文，逐句机读）

| 评测 | 分数 | 备注 |
|---|---|---|
| 蛋白质设计同时满足两项标准的比例 | 43.7% | 被评测方为官方未公布型号名的 GPT-6 家族最新内部模型；RFdiffusion 为 27.8% |
| 200 项挑战中的设计通过率 | 18.9% | Proteina 为 17.1% |
| 打分预测中位姿吻合比例 | 96% | GPT-6.2 为 93%；DiffDock-L 为 50% |
| 打分预测中结构吻合比例 | 97% | GPT-6.2 为 92%；DiffDock 为 60% |
| 平均 DockQ（侧链隐藏） | 0.81 | 最新内部模型 0.81、GPT-6.2 0.57、GPT-6 0.28、GPT-5.6 约 0.05；取各型号最高评测算力档位 |
| 平均 DockQ（GPT-6.2） | 0.57 | 同上 |
| 稳定性研究平均分（265 组） | 0.66 | GPT-6.2 0.57、GPT-6 0.52、GPT-5.6 0.41 |
| 稳定性研究平均分（GPT-6.2） | 0.57 | 同上 |
| 目标结合比例（MDM2） | 85%（75/88 个设计） | GPT-6.2 的设计，与 Onava 合作的实验室初筛 |
| 目标结合比例（VEGF-A） | 62%（26/42 个设计） | 同上 |
| 目标结合比例（PD-1） | 14%（8/59 个设计） | 同上 |
| 抗体结合位点重设计保留结合的片段比例 | 66%（179/272 个片段） | 五个治疗性抗体，PD-1 或 PD-L1 |
| 目标结合迹象比例（IL-4Rα） | 70%（128/182 个设计） | 同节实验对象为 GPT-6 家族设计 |

## 未转录区块说明

- 页面「GPT models vs. specialized models」图表的数据未在 RSC 载荷中给出可提取的 values 字段，本批未据该图建行。
