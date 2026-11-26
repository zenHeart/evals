---
vendor: tencent
model: OmniEVIE-4B
release: omnievie-4b
date: 2026-11-24
source: https://huggingface.co/tencent/OmniEVIE-4B
fetched_at: 2026-11-26
---

# OmniEVIE-4B（腾讯官方模型卡 / 官方代码仓 / 官方技术报告 证据归档）

发布日期证据链（三处互证，`date_precision=day`）：

1. 官方模型仓 `tencent/OmniEVIE-4B` 的 `createdAt` = **2026-11-24T03:16:57Z**（Hugging Face API `createdAt` 字段，本批实取）。
2. 官方技术报告 arXiv:2611.32203《OmniEVIE: Evidence-Vector-Informed Embedding for Multi-modal Retrieval》的 `published` = **2026-11-24T08:49:38Z**（arXiv API 实取）。
3. 官方模型卡转录的 **TIGER-Lab/MMEB-Leaderboard 官方榜单快照日期印为 2026-11-24**（模型卡图注原文：`Official TIGER-Lab/MMEB-Leaderboard snapshot (2026-11-24, sorted by Audio-Overall = 0)`）。

逐渠道核查结果（说明「为什么发布日取模型仓/论文日」）：腾讯混元官方发布接口 `api.hunyuan.tencent.com/api/blog/publicList` 最新一条为 `id=100145`（Hy4 flash，2026-11-18），**全站无 OmniEVIE 公告**；`cloud.tencent.com/developer/techpedia/OmniEVIE` 返回 404；`www.tencent.com/zh-cn/tencent-launches-omnievie` 无此通稿。故本条走「官方模型仓 + 官方代码仓 + 官方技术报告」三件套的一级来源路径，发布日期取 2026-11-24。

- 官方模型卡（原文存档）：https://huggingface.co/tencent/OmniEVIE-4B （`model-card.md`）
- 官方代码仓：https://github.com/Tencent/OmniEVIE （`github-readme.md`）
- 官方技术报告：https://arxiv.org/abs/2611.32203

## 官方定位（原文要点）

- 「**OmniEVIE-4B** is a 4.5B-parameter unified multi-modal, multi-vector retrieval model by **Tencent IMA Product Center** and **Tencent Youtu Lab**, ranking **#1 on the MMEB-Leaderboard (excluding audio)**—with `OmniEVIE-4B (Full)` at **60.68** and `OmniEVIE-4B (Compressed)` at **60.06** across 190 tasks (also **#1** in both Text `52.97` and Agent `54.14`).」
- 技术报告摘要：「We present OmniEVIE, a 4.5B multi-vector embedding model covering text, images, visual documents, video, and tools with one compressed index and a three-stage retriever.」
- 架构关键词（模型卡原文）：Built on **Qwen3.5** with bidirectional full-attention layers、**Prefix-MRL** projection、spatio-temporal Ward clustering（**ST-HAC**）、learned query saliency gate（`query_gate.safetensors`）。
- 每条记录最多压成 `128 × 64D int8` 向量（**≤ 9,472 bytes/record**，**8.82 GiB per 1M records**）。

## 官方规格（模型卡规格表原样转录）

| 规格项 | 官方值 |
|---|---|
| Parameters | 4.54B（BF16，`model.safetensors`）+ `query_gate.safetensors` |
| Modalities | Text · Natural Image · Visual Document · Native Video · Agent / Tool / GUI / Memory |
| Elastic Dimensions | Prefix-MRL single head: `{64, 128, 256, 512, 1024, 2048}` |
| Index Footprint | 8.82 GiB / 1M records（`K128×d64 int8`）；2.15 GiB / 1M（`K32×d64 int8`） |
| Search Latency | 54.2 ms（1M）/ 120.2 ms（5M）on a single CPU thread |
| Evidence Localization | Direct page bounding box & video timestamp interval from retrieval `argmax` |
| License | Apache-2.0（`LICENSE.txt`） |

> 正文与论文写「4.5B」，规格表写「4.54B」，两者指同一模型（4,539,207,808 参数量级），账本取规格表的 4.54B。

## 评测转录表 · MMEB-V3（190 任务，官方 Markdown 真表，逐格机读）

官方仓库与模型卡的「MMEB-V3 (190 Tasks)」表逐行原文如下。竞品列一并转录（本仓账本只取自家模型列，竞品值写进 notes）。

| Model | All (190) | Text (53) | T-RR | T-IF | T-LC | T-MC | T-GR | Agent (47) | Tool | GUI | Memory | MCMR |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Qwen3-VL-Embedding-2B | 50.90 | 39.20 | 16.60 | 40.60 | 53.10 | 61.20 | 58.00 | 39.30 | 42.60 | 30.40 | 28.40 | 42.00 |
| Qwen3-VL-Embedding-8B | 53.50 | 42.50 | 18.20 | 44.80 | 58.00 | 61.20 | 61.20 | 38.40 | 41.30 | 33.50 | 22.80 | 38.00 |
| WeMM-Embedding-2B | 55.77 | 45.34 | 26.29 | 49.30 | 61.90 | 59.72 | 58.74 | 44.05 | 46.23 | 38.87 | 35.38 | 42.51 |
| WeMM-Embedding-4B | 57.97 | 47.88 | 30.01 | 52.02 | 62.43 | 60.14 | 61.09 | 48.06 | 50.58 | 41.44 | **39.19** | 41.91 |
| WeMM-Embedding-9B | 59.33 | 48.76 | **31.82** | 52.78 | 64.48 | 58.28 | 61.12 | 50.10 | 52.95 | **43.33** | 38.65 | 49.34 |
| **OmniEVIE-4B（`K128×d64 int8`, 8-fr）** | 59.76 | 51.77 | 26.36 | 69.65 | 70.71 | 67.75 | 63.58 | 54.03 | **58.84** | 41.34 | 37.35 | 47.39 |
| **OmniEVIE-4B（`K128×d64 int8`, 32-fr）** | 60.06 | 51.77 | 26.36 | 69.65 | 70.71 | 67.75 | 63.58 | 54.03 | **58.84** | 41.34 | 37.35 | 47.39 |
| **OmniEVIE-4B（Full Sequence `d=2048`）** | **60.68** | **52.97** | 27.46 | **70.81** | **73.04** | **68.55** | **64.60** | **54.14** | 58.81 | 42.00 | 37.60 | **49.74** |

> 官方表注（模型卡图注原文）：`OmniEVIE-4B (Full, 4.54B)` 与 `OmniEVIE-4B (Compressed, 4.54B)` 在全部非音频模型中排 **#1 与 #2**（含音频的全 190 任务口径为 **#2 与 #4**）。
> 粗体规则：官方用粗体标出「自家行 + 各列最高分」双重含义，故 **T-RR 列最高是 WeMM-Embedding-9B 的 31.82、Tool 列最高是 OmniEVIE 的 58.84、GUI 列最高是 WeMM-Embedding-9B 的 43.33**——**自家行加粗 ≠ 自家每列都最高**。

## 评测转录表 · MMEB-V2（78 任务，官方 Markdown 真表）

| Model | All (78) | Image (36) | Video (18) | VisDoc (24) |
|---|---:|---:|---:|---:|
| Qwen3-VL-Embedding-2B | 73.25 | 74.96 | 61.87 | 79.22 |
| Qwen3-VL-Embedding-8B | 77.82 | 80.12 | 67.15 | 82.36 |
| WeMM-Embedding-2B | 77.94 | 79.63 | 70.82 | 80.75 |
| WeMM-Embedding-4B | 79.19 | 80.84 | 72.11 | 82.04 |
| WeMM-Embedding-9B | **80.58** | **81.87** | **74.31** | 83.34 |
| **OmniEVIE-4B（`K128×d64 int8`, 8-fr）** | 77.24 | 78.09 | 66.49 | 84.02 |
| **OmniEVIE-4B（`K128×d64 int8`, 32-fr）** | 77.96 | 78.09 | 69.62 | 84.02 |
| **OmniEVIE-4B（Full Sequence `d=2048`）** | 78.56 | 78.70 | 70.08 | **84.70** |

> 技术报告摘要引用的 MMEB-V2 成绩为 **77.96**（即 `K128×d64 int8` 32-fr 档），不是 Full 档的 78.56——**同一发布文内两处口径不同**，账本按表逐行记录并在 notes 标注差异。

## 评测转录表 · ViDoRe V3（8 领域 × 6 语言 = 48 任务，graded nDCG@10，官方 Markdown 真表）

| Model | Index Representation | Mean | CS | Energy | Fin (EN) | Fin (FR) | HR | Industrial | Pharma | Physics |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Nemotron-ColEmbed-V2-8B | Full multi-vector | 63.76 | 79.35 | 70.05 | 67.72 | 51.50 | **66.92** | 56.81 | 67.39 | 50.31 |
| Qwen3-VL-Embedding-8B | Single-vector | 59.00 | 75.86 | 64.47 | 60.88 | 44.70 | 58.88 | 47.78 | 66.05 | 48.31 |
| **OmniEVIE-4B（Full Sequence `d=2048`）** | Prefix-MRL upper bound | **64.34** | **79.89** | **71.25** | **67.76** | **53.45** | 66.33 | **57.03** | **68.11** | **50.87** |
| **OmniEVIE-4B（`K128×d64 int8`）** | 7.87 GiB / 1M pages | 62.96 | 78.73 | 69.94 | 66.01 | 52.52 | 64.68 | 55.08 | 66.47 | 50.28 |
| **OmniEVIE-4B（`K32×d64 int8`）** | 2.15 GiB / 1M pages | 61.16 | 78.13 | 68.61 | 64.52 | 49.43 | 60.90 | 51.73 | 65.73 | 50.22 |

> 领域缩写：CS = 客服/通信类文档，Energy = 能源，Fin (EN) / Fin (FR) = 金融（英/法），HR = 人力，Industrial = 工业，Pharma = 医药，Physics = 物理。官方表只印缩写，未给全称与各领域任务数。

## 检索延迟（非评测分，工程指标，原样转录）

| Method | 100K | 1M | 5M | Speedup vs. Full `int8` (1M) |
|---|---:|---:|---:|---:|
| Full `int8` MaxSim | 1,657 | 12,781 | 63,892 | 1.0× |
| Exact Single-Vector (`d=4096`) | 60.9 | 604.0 | 3,039 | 21.2× |
| Exact Single-Vector (`d=2048`) | 34.6 | 331.0 | 1,666 | 38.6× |
| **OmniEVIE-4B Three-Stage（`N1=5000, N2=1000`）** | **41.9** | **54.2** | **120.2** | **236×** |

## 长视频时刻定位（官方散文明文 + 图注）

| 指标 | 官方值 | 出处 |
|---|---|---|
| QVHighlights val 查询数 | 1,083 queries | 模型卡图注 |
| peak 落在标注片段内的查询占比 | 78.0% | 模型卡图注 / 技术报告摘要 |
| 返回片段与标注片段的相交占比 | 94.3%（随机基线 44.9%） | 技术报告摘要 |
| 返回片段占视频长度 | 18% | 模型卡图注 |
| 视频长度 | 150-second clip | 模型卡图注 |

## 官方复现脚本的逐任务记录值（官方代码仓「Reproducing MMEB」表）

| Task | Recorded | `maxsim` | `index` |
|---|---:|---:|---:|
| CIRR | 0.751 | 0.741 | 0.745 |
| MSCOCO_t2i | 0.809 | 0.809 | 0.810 |
| VisDial | 0.900 | 0.911 | 0.901 |
| MSR-VTT | 0.579 | 0.588 | 0.583 |
| DiDeMo | 0.786 | 0.785 | 0.784 |
| MSVD | 0.785 | 0.782 | 0.781 |
| VATEX | 0.588 | 0.595 | — |
| YouCook2 | 0.454 | 0.454 | — |
| UCF101 | 0.942 | 0.942 | 0.944 |
| HMDB51 | 0.850 | 0.845 | 0.852 |
| K700 | 0.727 | 0.724 | — |
| Breakfast | 0.670 | 0.670 | 0.660 |
| SmthSmthV2 | 0.895 | 0.892 | 0.897 |

> 官方说明：`--scoring maxsim` 走 int8 候选向量上的精确 MaxSim；`--scoring index`（默认）走带 QueryGate 的 `ThreeStageIndex`。官方未印这批任务对应的指标名与官方榜单分数的换算关系，账本不据此另建 benchmark 行。

## 图片归档

| 文件 | 内容 |
|---|---|
| `images/hero_banner.png` | 模型卡头图（OmniEVIE 标题图） |
| `images/mmeb_leaderboard.png` | MMEB 官方榜单快照图（2026-11-24，非音频榜第 1） |
| `images/fig1_overview.png` | (a) MMEB-V3 总分跨模型规模对比；(b) 单线程 CPU 检索延迟 100K→5M |
| `images/fig4_sthac.png` | 统一 ST-HAC 压缩流程（球面归一化质心、定标 int8 量化、逐记录字节布局） |
| `images/fig5_three_stage.png` | 三段式检索漏斗与延迟（1M 记录：14.6 ms 粗筛 + 19.7 ms Hamming + 19.9 ms int8 = 54.2 ms 单线程 CPU） |
| `images/fig7_alignment.png` | token 级对齐与 query 显著性门（τ = 0.6、噪声底 θ = 0.38；966 个 patch 压成 128 个 int8 簇） |
| `images/fig8_localization.png` | 页面区域与长视频时间戳定位案例（ViDoRe V3 页面 + 150 秒 QVHighlights 片段） |
| `images/fig9_video_cases.png` | 原生视频时刻定位案例（3 段 150 秒 QVHighlights 视频的返回区间与峰值时间戳） |

> 所有图片均为官方 Hugging Face 仓 `assets/` 下的原图字节直接下载（`resolve/main/assets/*.png`），未做裁剪或再编码。
