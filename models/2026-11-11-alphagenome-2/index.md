---
vendor: google
model: AlphaGenome 2
release: alphagenome-2
date: 2026-11-11
source: https://deepmind.google/blog/alphagenome-2-deciphering-how-cells-read-dna-to-better-understand-disease/
fetched_at: 2026-11-13
---

# AlphaGenome 2: Deciphering how cells read DNA to better understand disease

> 归档说明：`page.html` 为官方发布页 `https://deepmind.google/blog/alphagenome-2-deciphering-how-cells-read-dna-to-better-understand-disease/` 的原始存档（HTTP 200，157221 字节，服务端渲染 HTML），抓取于 2026-11-13。页面引用 3 张内容图片，全部原样下载到 `images/`（1 张为模型架构示意图，其 alt 文本为「An isometric grid of glowing, translucent pink cubes on a dark background, showing varying levels of subdivision into smaller blocks.」）。

## 发布日证据链（两源互证）

| 来源 | 原文 | 说明 |
|---|---|---|
| 发布页 JSON-LD | `"datePublished":"2026-11-11T15:00:00+00:00"` | 页面 `<head>` 内 schema.org 节点 |
| Google DeepMind 官方 RSS | `Wed, 11 Nov 2026 15:00:15 +0000` / `AlphaGenome 2: Deciphering how cells read DNA to better understand disease` | `https://deepmind.google/blog/rss.xml` 条目，与 JSON-LD 相差 15 秒，同一篇发布文 |

## 发布要点（转录）

- 定位（副标题原文）：「Our next-generation DNA sequence model bridges single-cell biology and human genetics, predicting how genetic variants affect hundreds of human cell types.」
- 开头原文：「Today, we are announcing AlphaGenome 2, our next-generation model that predicts how DNA sequences and their variations impact specific human cell types, giving scientists a powerful new tool to uncover the cellular drivers of disease.」
- 署名：Adam Gayoso、Natasha Latysheva、Pushmeet Kohli、Žiga Avsec。
- 架构变化：原文「Instead of predicting in parallel, AlphaGenome 2 is a conditional model that predicts DNA effects for one [cellular context] - defined as a tissue, cell type or state - at a time. Alongside the million-letter DNA sequence, it uses the target biological condition as input at every stage of its architecture.」
- 训练数据：原文「We trained AlphaGenome 2 on both bulk and single-cell data from human and mouse samples, including over 107 million individual cell profiles.」另一处口径为「Trained on more than 100 million individual cell profiles across 68 tissues」。
- 预测读出：原文「The model predicts the same core experimental readouts of DNA function as AlphaGenome — such as gene expression, histone modifications and chromatin accessibility — but also DNA methylation, a widely requested readout.」
- 跨模态插补：原文「A conditional model also allows cross-modality imputation, enabling AlphaGenome 2 to predict missing experimental data.」
- 配套平台：原文「We expanded its reach with AlphaGenome Atlas, a platform containing predictions for all 9 billion possible single-letter changes in the human genome.」
- 可用性：原文「AlphaGenome 2 is available today for non-commercial research via the AlphaGenome API, and in private preview for commercial research.」另有「interactive Colab tutorials for expression conditioning」；并预告「soon, we will release AlphaGenome 2 Skills in Google Antigravity」。

## 评测数据

> 说明：发布页**没有 DOM 跑分表**（`<table>` 计数为 0），唯一的量化结论以**正文散文明文**给出，故证据行记 `evidence_type: "text"` / `status: "verified"`。页面无位图形式的评测柱状图（3 张图片为架构示意与配图），因此本 release 无 pending 行。

### 数值全量转录表

| 评测 | 分数 | 备注 |
|---|---|---|
| TenK10K — 因果变异识别率（causal variant identification） | 30% | 对照：初代 AlphaGenome 经单细胞微调 16%；页面称「nearly twice as many」 |
| TenK10K — 方向性基因效应识别率（directional gene effect） | 43% | 对照：初代 AlphaGenome 经单细胞微调 23% |
| 相对前代总体提升 | 近 2 倍 | 散文的定性表述：「identifies nearly twice as many variants that change gene expression in cells, compared to our previous state-of-the-art model」，无数值 |
| 训练规模 | 1.07 亿+ 细胞图谱 / 68 种组织 | 规格指标，非评测分数 |
| TenK10K 数据集规模 | 28 种主要免疫细胞类型 | 评测集规模说明 |

## 协议与口径说明

- 官方**未给出** TenK10K 评测的样本切分、判定阈值、重复次数与对照模型清单的完整设置，协议字段一律留 null；对照口径按正文所写「the original AlphaGenome fine-tuned on single-cell data and other specialized tools」。
- 30% 与 43% 为**自家模型相对自家前代**的对比值，属官方自跑自评，记 `vendor_reported`；页面未给出其他厂商模型在该数据集上的读数。
- TenK10K 为第三方公开单细胞图谱数据集，但评测由 Google 自跑，引用即第三方数据集不改变归属口径。
- 页面未明示参数量；输入为「a million-letter DNA sequence」（一百万字母 DNA 序列），属核苷酸长度而非 token 上下文，故账本 `context_window` 记 null，在 `capability_summary` 与 notes 中写明。
- 页面未印任何公开定价（商业研究为私有预览），`pricing` 记 null。

## 局限与待人工核验

1. 本次发布仅给出 TenK10K 一个数据集上的两组比例值，**没有跨数据集的通用基准**，不具备与其他模型横向比较的条件；引用时须带上对照口径（初代 AlphaGenome 微调版）。
2. 「near twice as many variants」是相对前代的定性表述，不含绝对数，未建行。
3. 官方未公开参数量、推理成本与商用定价；商用仅私有预览。
4. 全部数值为厂商自报，本次未做本地复跑或第三方独立复现。
5. 3 张内容图片中除模型架构示意图外无评测图表，不存在需人工读图的 pending 行。
