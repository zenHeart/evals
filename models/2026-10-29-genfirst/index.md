---
vendor: doubao
model: GenFirst（字节跳动 Seed 官方端到端潜空间生成研究权重）
release: genfirst
date: 2026-10-29
source: https://huggingface.co/ByteDance-Seed/GenFirst
fetched_at: 2026-11-07
---

# GenFirst（字节跳动 Seed 官方模型卡归档）

本归档是**模型发布页**（官方 Hugging Face 模型卡）的一级来源存档，用于给 GenFirst 建档，并补录模型卡中官方给出明确评测口径的明文数值。

## 来源与日期证据

- 模型卡：https://huggingface.co/ByteDance-Seed/GenFirst （字节跳动 Seed 官方 Hugging Face 组织 ByteDance-Seed）。原始 README 另存为同目录 `README.md`，渲染页另存为 `page.html`。
- 发布日证据：模型卡**未印发布日期**，取权重仓库公开日——Hugging Face 仓库 createdAt = `2026-10-29T03:26:09Z`（北京时间 2026-10-29 11:26），官方 GitHub 仓库 ByteDance-Seed/GenFirst 的 created_at = `2026-10-29T03:00:32Z`（北京时间同日 11:00），两者同日互证，故 `date: 2026-10-29`、`date_precision: day`。
- 佐证：论文 arXiv **2608.29335**（2026-08 预印本，题为《GenFirst: Generation Before Reconstruction for Stable End-to-End Latent Generative Modeling》）；官方代码仓 https://github.com/ByteDance-Seed/GenFirst 。

## 模型本体（官方原文要点）

- 官方定位：「Generation Before Reconstruction for Stable End-to-End Latent Generative Modeling.」把潜 VAE 与生成先验**一起**训练，避免端到端潜空间训练常见的潜坍缩；两阶段权重调度——阶段 1 让先验塑造潜几何，阶段 2 把两个权重各降一个数量级，让解码器恢复细节。
- 发布范围：官方只发布 **EiT**（扩散先验）实例化，论文中的 **EAR 自回归实例未发布**。发布物是两类配套工件：①**端到端 VAE**（编码器/解码器 + 对应潜变量归一化统计量）；②**生成先验**——类条件生成的 SiT 模型与文生图的 MMDiT 模型。
- 规模：SiT-XL 与 MMDiT-XL 均为 **28 blocks / width 1152 / 16 attention heads（约 675M 参数）**；文生图用冻结的 CLIP-L 文本编码器；权重以 fp32 发布，采样在 bf16 下测试。
- 加载方式：这些是原始 `.pt` 检查点，**没有 diffusers 集成、没有 `from_pretrained` 入口**，需配合训练仓库运行；官方同时提醒 `.pt` 即 pickle，加载会执行 Python 代码。
- 许可：**权重 CC BY-NC 4.0（仅非商用研究用途，需署名）**，比代码仓的 MIT 更严格，且是这些工件的实际约束；训练数据与上游模型各自条款继续适用。
- 官方声明的使用边界：仅供研究（复现论文、研究端到端 VAE 与先验训练、潜空间分析、作为非商用研究基线）；**不含安全过滤、水印或内容分类器**，输出为合成图像、无事实依据。

## 官方评测口径（Evaluation 节原文要点）

- **gFID / IS** — 50,000 张生成样本，用 [torch-fidelity](https://github.com/LTH14/torch-fidelity) 对 [MAR](https://github.com/LTH14/mar) 所用参考统计、在所述分辨率下计算；采样为 **SDE、250 步**。guided 行用 [autoguidance](https://arxiv.org/abs/2406.02507)（指向同一次训练的早期检查点）叠加 CFG，**512 档例外，改用普通 CFG**。
- **rFID / PSNR / SSIM / LPIPS** — 在 **50,000 张验证集**上取后验均值重建，按 [latent-diffusion](https://github.com/CompVis/latent-diffusion) 协议；**此处的 rFID 是对验证集本身计算的，不是对训练集参考**，故不能与另一类算法算出的数字比较。
- **GenEval / DPG-Bench** — overall 总分，**Euler 采样 50 步、CFG 7.0（区间 `[0.35, 1.0]`）、不做 prompt rewriting**。
- 数值在 `environment.yml` 锁定的版本下产出；官方自述 **FID 对参考统计与缩放路径敏感**，跨工作比较只在同一协议下有意义。

## 评测数据转录表：模型卡「Class-conditional priors」原文

| Checkpoint | Resolution | VAE | gFID | IS | gFID (guided) | IS (guided) | 入账 |
|---|---:|---|---:|---:|---:|---:|---|
| EiT, 80 epochs | 256x256 | `f16d32` | 2.79 | 175.4 | 1.38 | 271.3 | 4 列 → evidence 行 |
| EiT, 480 epochs | 256x256 | `f16d32` | 1.60 | 216.8 | 0.988 | 270.7 | 4 列 → evidence 行 |
| EiT, 800 epochs | 256x256 | `f16d32` | **1.45** | **226.7** | **0.969** | **283.4** | 4 列 → evidence 行 |
| EiT, 80 epochs | 512x512 | `f16d32` | – | – | 1.63 | 278.9 | 2 列 → evidence 行（原表「–」不转录） |
| EiT, 400 epochs | 512x512 | `f16d32` | – | – | **1.23** | **286.1** | 2 列 → evidence 行（原表「–」不转录） |

512 档复用 256 的 `f16d32` VAE（不变、不再训练），只有先验在 512 上训练；512 两个检查点官方只报 guided 值，unguided 行为未调优。

## 评测数据转录表：文生图 / 共享潜变量 / 统一图文原文

| 表 | 检查点 | 分辨率 | GenEval | DPG-Bench | 入账 |
|---|---|---:|---:|---:|---|
| Text-to-image priors | EiT T2I, variant A（FLUX VAE，SiT-XL 潜空间） | 512x512 | **0.8987** | **82.60** | 2 列 → evidence 行 |
| Text-to-image priors | EiT T2I, variant B（FLUX VAE，MMDiT-L2 潜空间） | 512x512 | 0.8920 | 82.06 | 2 列 → evidence 行 |
| Shared visual latents | `eit-qwenvit-siglip-t2i-512.pt`（SigLIP 监督） | 512x512 | 0.90 | 83.76 | 2 列 → evidence 行 |
| Shared visual latents | `eit-qwenvit-vlm-nll-t2i-512.pt`（VLM-NLL 监督） | 512x512 | 0.89 | 83.49 | 2 列 → evidence 行 |
| Unified text-image modeling | `eit-joint-e2e-text-e2e-img-512-sft.pt`（T2I） | 512x512 | **86.57** | **72.68** | 2 列 → evidence 行 |

⚠ **量纲提示**：前四行的 GenEval 是 **0–1 小数制**，统一图文行的 GenEval 记为 **百分制（86.57）**；DPG-Bench 各行均为 0–100。两者不可直接比较，账本按单位不同分列并在 notes 逐行标注。

统一图文表另有 7 个指标（来自 phase-2 pre-SFT 检查点的 COCO 图生文）：CIDEr 33.28 / BLEU-4 7.76 / METEOR 17.74 / ROUGE-L 34.16 / SPICE 11.81 / CLIPScore 57.97。

## 端到端 VAE 套件（重建质量，本批不入账）

官方以 VAE 重建质量（rFID / PSNR / SSIM / LPIPS）列出 9 个端到端 VAE：

| VAE | 下采样 / 通道 | 初始化自 | rFID | PSNR | SSIM | LPIPS |
|---|---|---|---:|---:|---:|---:|
| `f8d4` | 8x, 4ch | SD-VAE（stabilityai/sd-vae-ft-ema） | 0.57 | 25.13 | 0.71 | 0.14 |
| `f16d32`（decoder-ft, @256） | 16x, 32ch | VA-VAE（LightningDiT） | 0.36 | 25.82 | 0.74 | 0.12 |
| `f16d32`（no dec-ft, @512） | 16x, 32ch | VA-VAE（LightningDiT） | – | – | – | – |
| `f8d16` variant A | 8x, 16ch | FLUX.1 VAE | 0.23 | 29.43 | 0.85 | 0.07 |
| `f8d16` variant B | 8x, 16ch | FLUX.1 VAE | 0.21 | 29.37 | 0.85 | 0.07 |
| `qwenvit-siglip-b256-s2` | 8x, 16ch | Qwen3-VL ViT + ViT 解码器（SigLIP） | 0.39 | 27.64 | – | – |
| `qwenvit-nlltrunk-s2` | 8x, 16ch | Qwen3-VL ViT + ViT 解码器（VLM-NLL） | 0.46 | 27.19 | – | – |
| `e2e-joint-gan-l2-330k` | 8x, 16ch（图像）+ 16d（文本） | FLUX.1 VAE + Cola Text VAE | – | – | – | – |
| `f8d32`（FLUX.2 VAE, @512） | 8x, 32ch | FLUX.2 VAE | **0.041** | **36.46** | **0.953** | **0.026** |

**本批不入账的理由**：官方只说明这些指标在「50,000 张验证集」上计算，**未指明验证集属于哪个数据集**（ImageNet 验证集 / FLUX 验证集 / Qwen3-VL 自建潜空间各不相同），因此无法忠实命名评测对象；按「不臆造」纪律先完整转录在此，留待后续建立对应评测实体后回填。

## 入账方式

- 新建 release 档案 `data/model-releases/official/doubao/genfirst.json`（`id=genfirst`、`vendor_id=doubao`），4 个 model 条目对应四类已发布工件。
- 按「一个 benchmark 行 = 一条 evidence，取自家模型列」，**26 条** evidence：类条件 16 条（5 个检查点 × gFID/IS × unguided/guided，512 档原表「–」不转录）、GenEval 8 条、DPG-Bench 8 条中各 4 条对应文生图先验两行、共享潜变量两行与统一图文一行（按上表两两配对）。
- `attribution_type = vendor_reported`、`source_tier = A`、`source_kind = official_model_card`、`evidence_type = table`；模型卡表格为 Markdown 机读表、非位图，故直接 `verified`。
- 三个 benchmark id 尚无实体，按口径在 `notes` 标 `new-benchmark`：`imagenet`（1000 类标签集的 ImageNet 类条件生成设定）、`geneval`、`dpg-bench`；由站点兜底页先顶着。
- 官方未明示的运行配置（harness / tools / shots / 温度 / top_p / 跑次数 / 判分器）一律 null；评测口径只记官方 Evaluation 节写明的部分（采样步数、CFG、样本数、计算工具与参考统计）。
