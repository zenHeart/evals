---
vendor: tencent
model: Hy-SimulMT-30B-A3B
release: hy-simulmt
date: 2026-10-26
source: https://huggingface.co/tencent/Hy-SimulMT-30B-A3B
fetched_at: 2026-10-26
---

# Hy-SimulMT-30B-A3B

发布日期证据：官方模型卡 `tencent/Hy-SimulMT-30B-A3B` 的 News 节写明「**2026.10.26 | Release**: Hy-SimulMT is released with bidirectional real-time simultaneous translation between Chinese and English and real-time voice cloning」，`date_precision=day`；权重与代码仓先于发布日落地（Hugging Face 模型仓 `createdAt` = 2026-10-22、GitHub `Tencent-Hunyuan/Hy-SimulMT` `created_at` = 2026-10-22），官方项目页 `hy.tencent.com/model/open-source-model/detail?id=hy-simulmt` 同日上线，三者互证。来源：https://huggingface.co/tencent/Hy-SimulMT-30B-A3B

腾讯混元开源 **Hy-SimulMT**——实时同传模型，支持**中英双向语音到语音**同传：边接收音频边译，同时输出译文文本与译文语音，并用**实时声音克隆**保留说话人音色。

官方明示规格：

| 项 | 值 |
|---|---|
| 官方标题 | A Low-Latency, High-Quality Model for Real-Time Simultaneous Translation |
| 参数量级 | 30B-A3B（MoE；官方模型仓与代码仓命名） |
| 语言方向 | 中文 ↔ 英文，双向 |
| 能力 | 实时同传（译文文本 + 译文语音）、实时声音克隆 |
| 开源许可 | Apache-2.0 |
| 上下文窗口 / 价格 | 官方模型卡未给出（`null`） |
| 发布渠道 | Hugging Face（`tencent/Hy-SimulMT-30B-A3B`）、GitHub（`Tencent-Hunyuan/Hy-SimulMT`）、ModelScope、官方项目页 |

官方四列短音频翻译质量对比表（markdown 表格，DOM 机读，表注：*Higher scores are better*；Hy-SimulMT 整行加粗，其余加粗为该列最高分）：

| API / Model | FLEURS | CoVoST2 | ACL6060 | RealSI-Sentence |
|---|---:|---:|---:|---:|
| Qwen3.8-LiveTranslate | 88.4 | **82.1** | 80.5 | 84.4 |
| **Hy-SimulMT** | **90.3** | **75.5** | **81.2** | **84.7** |
| Gemini3.5-LiveTranslate | **92.4** | 74.4 | **82.6** | 82.2 |
| Confucius4 R2T2 → T3PO | 89.4 | 76.8 | 76.1 | 77.7 |
| Seed-LiveInterpret2.0 | 85.8 | 67.7 | 74.8 | 80.0 |
| SimulS2ST-Omni | 78.6 | 66.6 | 73.1 | 77.4 |
| GPT-Realtime-Translate | 77.7 | 50.8 | 76.4 | 76.7 |
| XunFei-Simult-Interpretation | 73.4 | 57.0 | 57.5 | 70.9 |
| SeamlessStreaming | 72.8 | 60.9 | 49.8 | 56.9 |

官方正文对这张表的判读：「Hy-SimulMT scored higher than the other open-source models in the table on FLEURS, ACL6060, and RealSI-Sentence. Its **84.7** on RealSI-Sentence was the highest among all listed systems.」

RealSI 长音频口径（正文明文 + 官方散点图）：

| 指标 | Hy-SimulMT | 官方表述 |
|---|---:|---|
| StreamLAAL（越低越好） | ≈ **3 秒**（原文 approximately 3 seconds） | 「the lowest among the systems shown」 |
| GEMBA（越高越好） | 绝对值只在散点图里 | 「exceeded those of the compared open-source models and four of the five commercial APIs」 |

官方散点图（`images/realsi_gemba_streamlaal_redstar_logos_v2.png`）横轴 StreamLAAL（秒）、纵轴 GEMBA。图注明确「**StreamLAAL is not the same as the time to first speech output**」。GEMBA 绝对值按纪律**不做视觉转写进数值字段**，本仓只把读图结果写进该 evidence 行的 `notes` 作定位参考，行状态记 `pending` + `score_status: not_extracted`。

官方另有一项**人机对比**（结论在图片里、无绝对分值，按口径不建行）：收集 **18 段 2026 年 9 月后新上线的中英文录音**（各约 6 分钟），覆盖软件与 AI、医疗、制造与能源、自然科学、农业与食品、商业管理、法律、教育、文旅、体育与日常生活共 **10 个领域**，邀请 **6 名**有实务经验的同传译员（3 名 CATTI 一级、3 名 CATTI 二级），每个证书等级取三人中的最高分作对照；官方结论是「翻译质量与专家同传相当，且往往更快（延迟更低）」，并自述该结论只适用于本次样本、译员与评测设置，**不构成**对语音质量、音色相似度等维度的全面评估。

协议口径：官方模型卡全文**未写明** harness、语向构成、跑次数与所用自动指标名称，`protocol` 12 键一律 `null`；四列短音频基准的分数只声明「越高越好」，故 `metric` 只记为 translation quality score，**不臆断**为 BLEU / COMET 一类具体指标。
