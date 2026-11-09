---
vendor: doubao
model: Cola2
release: cola2
date: 2026-11-06
source: https://huggingface.co/ByteDance-Seed/Cola2
fetched_at: 2026-11-07
---

# Cola2（字节跳动 Seed 官方模型卡归档）

本归档是**模型发布页**（官方 Hugging Face 模型卡）的一级来源存档，用于给 Cola2 建档，并补录模型卡表格中的官方明文评测数值。

## 来源与日期证据

- 模型卡：https://huggingface.co/ByteDance-Seed/Cola2 （字节跳动 Seed 官方 Hugging Face 组织 ByteDance-Seed）。原始 README 另存为同目录 `README.md`，渲染页另存为 `page.html`。
- 发布日证据：模型卡**未印发布日期**，取权重仓库公开日——Hugging Face 仓库 createdAt = `2026-11-06T06:59:36Z`，官方 GitHub 仓库 ByteDance-Seed/Cola2 的 created_at = `2026-11-06T03:37:50Z`，两者同日互证，故 `date: 2026-11-06`、`date_precision: day`。
- 佐证：论文 arXiv **2610.31305**（2026-10 预印本，题为《Cola2: Co-Adaptive Hierarchical Language Modeling with Continuous Semantic Compression and Balanced Discrete Generation》）；项目页 https://hongcanguo.github.io/Cola2/ 。

## 模型本体（官方原文要点）

- 官方定位：「Cola2 is a continuous-latent language model that co-adapts semantic compression and discrete text generation.」三件套 = **动态压缩 VAE** + **块因果扩散 Transformer（DiT）** + **带潜变量反馈的 span 因果 token 解码器**。
- 训练：Stage I 联合训练动态压缩编码器与 token 解码器；Stage II 在 token 侧监督下继续适配该 VAE，同时由约 **4B** 的 DiT 以 Flow Matching 学习去耦后的潜变量分布。
- 推理：反复提出一个潜变量块 → 解码 token → 在固定 span 布局下把已提交文本重新编码，使连续历史与离散历史保持对齐。
- 公开形态：**基座模型**（官方明示 not an instruction-tuned chat assistant）；仓库含 8 个分片 safetensors 权重、tokenizer 与生成配置、Transformers remote-code 模块、8 个评测任务的规范化 JSONL 数据与 `SHA256SUMS`；**不含训练代码**。
- 规模：公开 checkpoint 训练于 **346.03B source tokens**；官方自述该 checkpoint 的潜变量 DiT 尚未收敛。

## 评测数据转录表：模型卡「Post-pretraining results」原文

原表含竞品列，一并转录（竞品列不单独建 evidence 行，按口径写入自家模型那一行的 notes）：

| Task | Llama-3-8B | Qwen2.5-7B | Qwen3-8B-Base | LLaDA-8B-Base | **Cola2** | 入账 |
|---|---:|---:|---:|---:|---:|---|
| Pretraining tokens | 15T+ | 18T | ~36T | 2.3T | **346B** | 不建行（规格信息，非基准） |
| RACE | 75.77 | 89.95 | 90.65 | 87.40 | **69.91** | Cola2 列 → evidence 行 |
| NarrativeQA | 42.70 | 32.90 | 37.30 | 36.00 | **32.70** | Cola2 列 → evidence 行 |
| HellaSwag | 39.21 | 75.67 | 68.13 | 69.65 | **41.75** | Cola2 列 → evidence 行 |
| StoryCloze | 79.49 | 95.09 | 97.44 | 95.94 | **80.42** | Cola2 列 → evidence 行 |
| LAMBADA | 75.70 | 71.82 | 71.20 | 67.90 | **63.00** | Cola2 列 → evidence 行 |
| ARC-Easy | 90.86 | 96.00 | 97.35 | 93.85 | **87.62** | Cola2 列 → evidence 行 |
| TruthfulQA | 63.04 | 69.03 | 72.58 | 64.87 | **54.10** | Cola2 列 → evidence 行 |
| MMLU | 63.19 | 70.16 | 72.31 | 61.27 | **51.32** | Cola2 列 → evidence 行 |
| **8-task average** | **66.25** | **75.08** | **75.87** | **72.11** | **60.10** | 不建行（跨评测聚合值，非独立基准） |

表下官方原文：

> Values are accuracies (%) except for the token row. Models use different training recipes, tokenizers, and token-counting conventions, so this table contextualizes capability rather than isolating the generation paradigm. Each Cola2 task value is the mean of three latent-noise sampled evaluations.

即：**除 token 行外均为准确率（%）**；各模型训练配方 / 分词器 / token 计数口径不同，该表用于定位能力而非隔离生成范式；**Cola2 每个任务数值为三次潜噪声采样评测的均值**。

## 默认生成预设（官方明示）

- 8 步低噪偏置 Euler DiT 调度；
- DiT classifier-free-guidance scale **10**；解码器 CFG scale **-0.9**；
- 每个解码块一个潜变量 span；动态时长与潜变量反馈；
- 贪心选 token；`max_new_tokens=32`。

官方同时提醒：贪心选 token **不等于**确定性生成，潜变量生成从高斯噪声起步，比较输出需传种子化 `torch.Generator`。

## 非评测内容（不建 evidence 行）

- 训练 token 量（Cola2 346B，竞品 2.3T–36T）：规格信息，不是基准分数。
- 受控扩展实验（AR / LLaDA / Cola DLM / Cola-MDM / Cola2-MDM 的规模曲线）与解码器 CFG 权重趋势：图示结论无数值表格，不建行。
- 复现说明：官方论文种子未公开，与参考结果存在小幅差异属预期；评测脚本与数据随 GitHub 仓库发布（`scripts/run_benchmark_quick.sh` 为 200 题 smoke 网格）。

## 入账方式

- 新建 release 档案 `data/model-releases/official/doubao/cola2.json`（`id=cola2`、`vendor_id=doubao`）。
- 按「一个 benchmark 行 = 一条 evidence，取自家模型列」，对 8 个任务各建 **1 条** evidence，共 **8 条**（`doubao-cola2--<benchmark>`）；竞品列（Llama-3-8B / Qwen2.5-7B / Qwen3-8B-Base / LLaDA-8B-Base）按口径写入各行 `notes`。
- `attribution_type = vendor_reported`、`source_tier = A`、`source_kind = official_model_card`、`evidence_type = table`；模型卡表格为 Markdown 机读表、非位图，故直接 `verified`。
- 其中 `race` / `narrativeqa` / `storycloze` / `lambada` / `arc-easy` 五个 id 尚无基准实体，按口径在 `notes` 标 `new-benchmark`，由站点兜底页先顶着；`hellaswag` / `truthfulqa` / `mmlu` 复用既有实体。
