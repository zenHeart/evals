---
vendor: tencent
model: HyCell
release: hycell
date: 2026-11-02
source: https://github.com/Tencent-Hunyuan/Hyra-results/tree/main/AI4Science/hycell
fetched_at: 2026-11-11
---

# HyCell（官方归档转录）

发布日期证据：官方仓 `Tencent-Hunyuan/Hyra-results` 的 README「## News」小节写明「**2026-11-02**: 🧫 HyCell, a single-cell embedding model, released with weights and code.」（date_precision=day）。来源：https://github.com/Tencent-Hunyuan/Hyra-results/tree/main/AI4Science/hycell

官方定位：把人类细胞的原始 counts 映射为 512 维嵌入（冻结编码器），嵌入可用于聚类、跨批次整合、标注迁移与细胞状态比较；模型的解码器可把嵌入还原为基因表达。

官方明示规格：

| 项 | 值 |
|---|---|
| 参数量 | 16.1M |
| 嵌入维度 | 512 |
| 预训练 | CZ CELLxGENE Census 7,950 万个细胞，无细胞类型标签，6.4 × 10^10 tokens（2 张 NVIDIA H20，9.9 小时）；训练用 Census 2025-11-08 版本的人体原代细胞 |
| 词表 | 36,495 个人体基因（Ensembl gene id 优先，其次基因符号） |
| 架构 | 六层 Transformer（宽度 256、四头、SwiGLU、无位置编码）；每细胞最多取 818 个表达基因 + 四分之一量的已测零表达基因 + 一个 [CLS] token；嵌入为 [CLS] 末态的线性投影；训练时用负二项似然的计数解码器重建表达谱 |
| 权重 | 64 MB，随包分发（`src/hycell/checkpoints/hycell-16m/`），`hycell info --verify` 校验 sha256 |
| 评测图谱 | 7 个预训练排除图谱（immune、pancreas、lung、PBMC、prefrontal cortex、跨组织免疫图谱、Asian Immune Diversity Atlas），共 167,804 个细胞 |
| 许可 | Apache-2.0 |
| 上下文窗口 / 价格 | 官方未给出（`null`） |

官方评测数据逐行转录（官方 README「Recorded result」scIB 主表：S = 0.3 Bio + 0.2 Batch + 0.25 LR + 0.25 kNN；竞品列只进备注）：

| 评测 | 分数 | 备注 |
|---|---:|---|
| S（总体分 = 0.3 Bio + 0.2 Batch + 0.25 LR + 0.25 kNN） | 0.735 | 同表竞品：Stack (batch-grouped inference) 0.736、SCimilarity (trained with cell-type labels) 0.726、scFoundation 0.702、UCE 0.694、PCA of the counts 0.676 |
| Bio（生物学保守性） | 0.700 | 同表竞品：Stack (batch-grouped inference) 0.657、SCimilarity (trained with cell-type labels) 0.699、scFoundation 0.655、UCE 0.662、PCA of the counts 0.654 |
| Batch（批次校正） | 0.527 | 同表竞品：Stack (batch-grouped inference) 0.596、SCimilarity (trained with cell-type labels) 0.542、scFoundation 0.436、UCE 0.432、PCA of the counts 0.443 |
| LR（标签迁移 macro-F1） | 0.847 | 同表竞品：Stack (batch-grouped inference) 0.841、SCimilarity (trained with cell-type labels) 0.839、scFoundation 0.849、UCE 0.823、PCA of the counts 0.827 |
| kNN（标签迁移 macro-F1） | 0.833 | 同表竞品：Stack (batch-grouped inference) 0.839、SCimilarity (trained with cell-type labels) 0.791、scFoundation 0.823、UCE 0.814、PCA of the counts 0.738 |

官方「Fine-tune」节标注迁移对照表逐行转录（留出批次 macro-F1，取批次均值）：

| 评测 | 分数 | 备注 |
|---|---:|---|
| Pancreas · 微调标注器 macro-F1 | 0.907 | 冻结嵌入 + 逻辑回归 0.832、冻结嵌入 + kNN 0.838；该图谱共 5 个批次 |
| Lung · 微调标注器 macro-F1 | 0.794 | 冻结嵌入 + 逻辑回归 0.768、冻结嵌入 + kNN 0.758；该图谱共 4 个批次 |
| PBMC · 微调标注器 macro-F1 | 0.966 | 冻结嵌入 + 逻辑回归 0.961、冻结嵌入 + kNN 0.936；该图谱共 2 个批次 |
| Immune · 微调标注器 macro-F1 | 0.877 | 冻结嵌入 + 逻辑回归 0.857、冻结嵌入 + kNN 0.873；该图谱共 9 个批次 |

| 单卡嵌入吞吐（细胞/秒） | about 1,500 | 单张 NVIDIA H20，40,000 细胞图谱，含读文件与分词；CPU 约 13 细胞/秒 |

未转录 / 未报告说明：

- 官方「Inputs」「Examples」节的字段与示例说明不是评测数值，不转录为分数。
- Tahoe-x1、TranscriptFormer、scGPT、Geneformer V2、STATE、scPRINT 的 S 分只以区间（0.607–0.683）出现在正文，完整对照在官方技术报告内，按纪律不建行。
- 官方未给出上下文长度与 API 定价。
