---
vendor: tencent
model: Refrain
release: refrain
date: "2026-11-20"
source: https://github.com/Tencent-Hunyuan/Refrain
fetched_at: "2026-11-27"
---

# Refrain（官方归档转录）

发布日期证据：官方 GitHub 仓 `Tencent-Hunyuan/Refrain` 的第 3 次提交「Release Refrain code, benchmark tooling and SDC evaluation」时间戳 **2026-11-20T11:23:30Z**；官方技术报告 arXiv:2611.27806 `published` = **2026-11-20T16:33:43Z**（abs 页印「Submitted on 20 Nov 2026」）；仓库 `created_at` = 2026-11-13T03:55:17Z（仅建仓）。三处互证 → `release_date=2026-11-20`（day）。

来源：https://github.com/Tencent-Hunyuan/Refrain ｜ 论文：https://arxiv.org/abs/2611.27806

官方定位：Refrain 是腾讯混元开源的**多镜头一致视频生成模型**。它把任意来源（文字 / 图像 / 视频）的参考素材按目标时长铺到同一条共享时间轴上，用统一骨干**一次扩散**生成整段多镜头视频——官方称为 **A²O（Any Reference, Any Duration, One Timeline）**。与既有方法靠额外注意力控制或记忆模块维持跨镜头连续性不同，Refrain 通过**自监督重建**学会压制风格冲突：从同一原视频切出的参考片段被各自独立地施加互不相同的视觉扰动（打光、背景、风格迁移、主体外观等），模型必须恢复未编辑的原片。

官方同时提出 **SDC（Shot-Debiased Consistency）** 指标：CLIP / DINO 相似度会把「有意的镜头切换（新角色、新场景）」误读成不一致，也几乎察觉不到真实的风格冲突；SDC 改为先问「两个镜头之间内容变了多少」，再判断风格变化相对真实视频分布是否异常。

## 官方明示规格

| 项 | 值 |
|---|---|
| 模型 | Refrain（统一骨干，一次扩散生成多镜头视频） |
| 骨干 | HunyuanVideo-1.5 DiT（8.49B）——**骨干不变**，条件只经画布 / 掩码 / 位置注入 |
| 参数量 | 8.49B（官方表 Params 列，与 HunyuanVideo1.5 同档） |
| 官方 FLOPs | 324.4P（480×832、241 帧、三镜头视频、三条 49 帧参考的解析式去噪估计，不含编码器与 VAE 解码） |
| 训练三阶段 | `text_to_video` 0→19k 步 → `reference_training` 19k→36k 步 → `variable_duration_training` 36k→45k 步 |
| 训练数据 | DurMix-300K（官方标注未随本批公开） |
| 参考编辑方式 | 61 种编辑指令（FLUX.1 Kontext：打光 / 背景 / 风格迁移 / 主体外观等），片段可裁剪或延长（SkyReels-V3），编辑由深度条件 Wan 模型沿片段传播；Qwen3-VL 与 TransNetV2 过滤退化片段 |
| 镜头切分 | TransNetV2；参考素材经 3D VAE 编码后写到共享时间轴的参考画布，按目标位置稀疏放置（**不做潜变量插值**，保留首尾帧） |
| 文本条件 | 全局共享风格提示 + 每镜头独立描述；参考短于镜头只填部分帧，长于镜头按帧选择映射 |
| 权重状态 | **Refrain DiT（8.49B，45k 步最终模型）/ Refrain 3D VAE（16× 空间 4× 时间）/ 初始化 DiT 三项均 Not released**（官方 `docs/CHECKPOINTS.md` 明写）；已公开：三阶段训练与推理代码、训练与推理配置、评测工具包、Refrain Benchmark、SDC 校准分位数库 |
| 权重兼容性 | 官方明写：公开的 HunyuanVideo-1.5 权重与本架构相关但**不可直接替换**（Refrain VAE 为 48 个潜变量通道且 DiT 针对它训练） |
| 许可 | 官方仓未标许可证（GitHub API `license` 字段为空） |
| API 定价 | 官方未给出（`null`） |

## 官方评测数据逐行转录（Markdown 真表，非位图；加粗为官方标出的最优）

### Refrain Benchmark（300 请求：30 T2V + 30 TI2V + 120 V2V + 120 TIV2V）

| Method | Params (B) | FLOPs (P) ↓ | MAE (s) ↓ | CLIP-T ↑ | TA ↑ | SDC ↑ |
|---|---:|---:|---:|---:|---:|---:|
| HunyuanVideo1.5 | 8.49 | **324.4** | 0.802 | 0.212 | −0.386 | 0.090 |
| Phantom | 14.29 | 648.7 | – | 0.203 | −0.675 | 0.130 |
| RefAlign | 14.29 | 807.7 | – | 0.204 | −0.530 | 0.125 |
| StoryMem | 29.80 | 493.2 | – | 0.197 | −0.679 | 0.175 |
| VACE | 17.34 | 608.9 | – | 0.217 | −0.336 | 0.108 |
| **Refrain** | 8.49 | **324.4** | **0.199** | **0.222** | **−0.221** | **0.315** |

| Method | Inter-shot Semantic ↑ | Inter-shot Subject ↑ | Inter-shot Scene ↑ | Ref. Semantic ↑ | Ref. Subject ↑ | Ref. Background ↑ |
|---|---:|---:|---:|---:|---:|---:|
| HunyuanVideo1.5 | 0.566 | 0.439 | 0.478 | – | – | – |
| Phantom | 0.491 | 0.345 | 0.385 | 0.556 | 0.450 | 0.376 |
| RefAlign | 0.493 | 0.341 | 0.361 | 0.614 | 0.469 | 0.448 |
| StoryMem | 0.708 | 0.489 | **0.531** | 0.478 | 0.412 | 0.388 |
| VACE | 0.492 | 0.362 | 0.361 | – | – | – |
| **Refrain** | **0.710** | **0.494** | 0.491 | **0.737** | **0.671** | **0.674** |

> 口径要点：官方加粗即最优。**Inter-shot Scene 一列最优是 StoryMem 0.531，Refrain 为 0.491**（非官方自评的全胜）。FLOPs 一列 Refrain 与 HunyuanVideo1.5 同为 324.4P 并列最优——即**同算力档位下取得更高一致性**。「–」表示该方法协议不适用该指标（MAE 列：Phantom / RefAlign / StoryMem / VACE；参考贴合三列：HunyuanVideo1.5 与 VACE 无参考输入协议），按纪律不转录。

### 消融 · 参考编辑监督（SDC）

| Train edits | Test edits | SDC ↑ |
|---|---|---:|
| Independent | Independent | **0.315** |
| Independent | Shared | 0.299 |
| Shared | Independent | 0.301 |
| Shared | Shared | 0.304 |

官方结论：在**独立**扰动各镜头参考上训练，是让模型学会自行消除风格冲突的关键。

### 消融 · 镜头坐标与放置

| Coordinates | Placement | MAE (s) ↓ | SDC ↑ |
|---|---|---:|---:|
| Shot-aware | Sparse | **0.199** | **0.315** |
| Shot-aware | Resample | 0.233 | 0.310 |
| None | Sparse | 0.281 | 0.304 |
| None | Resample | 0.293 | 0.289 |

### 消融 · 纯 T2V（无参考）

| Training | SDC ↑ |
|---|---:|
| T2V pre-training | 0.253 |
| + independent edits | **0.303** |

官方结论：在独立编辑的参考上训练，**同时**让纯文生视频的输出更一致。

### Validating SDC（单镜头风格编辑，108,909 个视频）

| Single-shot style edit (108,909 videos) | Score before → after | Detected @ 5% FPR ↑ |
|---|---|---:|
| CLIP | 0.836 → 0.711 | 48.6% |
| ViCLIP | 0.609 → 0.426 | 38.6% |
| DINO | 0.385 → 0.297 | 10.0% |
| **SDC** | 0.346 → 0.047 | **78.0%** |

### Validating SDC（真实视频库，按内容变化分层）

| Real videos, by content change | DINO | SDC |
|---|---:|---:|
| All (2.14M) | 0.383 | 0.337 |
| DINO < 0.25 | 0.170 | 0.339 |
| Lowest-DINO 10% | 0.117 | 0.322 |

> 这两组表度量的是 **SDC 指标本身**的检出能力，**不是** Refrain 模型的生成质量分；模型读数是上方 Refrain Benchmark 表里的 SDC 0.315。两组在账本中分开建档（`sdc-validation` vs `refrain-benchmark`），不可混读。

### 人工研究

6 名职业评分者评 150 条片段（真实拼接片段、自然多镜头片段与生成片段）：SDC 与平均评分的相关系数 **ρ = 0.68**，区分一致 / 不一致片段的 **AUC = 0.90**（95% CI [0.84, 0.95]）；在真实素材上 **AUC = 0.97**。

### 其它官方数值（不建 evidence 行）

- SDC 校准斜率 **κ ≈ 0.399**，在 1K 至 2.14M 视频规模上稳定。
- SDC 检出一处风格编辑时 **SDC 下降 90–99%**，而 CLIP 与 ViCLIP 几乎不动（定性对比，见 `images/sdc_compare.jpg`）。
- SDC 分位数库大小 4.6 MB（随仓分发，不含视频与嵌入）。

## 未转录 / 未建行区块说明

- **定性对比图**（`assets/comparison/` 下的 gif 与条件图、三组样例视频）属定性展示，无印刷数据标签，不建行。
- **训练方法细节**（三阶段步数、DurMix-300K 构成、61 种编辑指令、切镜与过滤流程、稀疏放置规则、Shot-aware RoPE 的每 token 镜头坐标与 per-shot 偏移）写入本转录表与账本 notes，不建 evidence 行。
- **官方相对结论与名次表述**（如「实现跨镜头一致性的 state-of-the-art」「在镜头节奏、参考贴合与文本对齐上同样出色」）只进 notes，不建行。
- **权重与许可**：官方明写 DiT / VAE 未发布、公开 HunyuanVideo-1.5 权重不可直接替换、仓内未标许可证——均照录，不臆断。

## 本目录文件

| 文件 | 说明 |
|---|---|
| `README.md` | 官方仓 README 原文（全部 Markdown 真表的来源） |
| `images/method.png` | 官方方法图（自监督重建 DurMix + 单时间轴联合生成） |
| `images/sdc_figure.png` | 官方 SDC 示意图（镜头能量、内容—风格校准、κ 稳定性） |
| `images/sdc_compare.jpg` | 官方 SDC 与 CLIP / ViCLIP 对比图（定性） |
| `images/teaser.jpg` | 官方 teaser（T2V / V2V / TI2V / TIV2V 同时间轴） |
