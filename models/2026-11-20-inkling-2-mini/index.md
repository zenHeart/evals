---
vendor: thinking-machines
model: Inkling 2 Mini
release: inkling-2-mini
date: 2026-11-20
source: https://thinkingmachines.ai/news/inkling-2-mini/
fetched_at: 2026-11-20
---

# Inkling 2 Mini（Thinking Machines Lab 官方发布文证据归档）

发布日期证据链：发布文页面印刷「Nov 20, 2026」，且 `<meta itemprop="datePublished" content="2026-11-20T00:00:00+00:00">`（`dateModified` 同日 2026-11-20T14:37:41-08:00）；官方模型卡 `https://thinkingmachines.ai/model-card/inkling-2-mini/` 的「Date of release」印「November 20, 2026」。两源互证，`date_precision=day`。

- 发布文：https://thinkingmachines.ai/news/inkling-2-mini/（`page.html`，Astro 服务端渲染 HTML，原始存档）
- 模型卡：https://thinkingmachines.ai/model-card/inkling-2-mini/（`model-card.html`，含 §5 Evaluations 评测表）
- 权重：https://huggingface.co/thinkingmachines/Inkling-2-Mini （Apache 2.0，HF createdAt 2026-11-17，早于发布日，仅作旁证）；研究变体 https://huggingface.co/thinkingmachines/TML-d24-varloop-research （2026-11-18）
- 发现渠道：官方 news 索引 https://thinkingmachines.ai/news/

## 官方定位（原文要点）

- 发布文标题 Introducing Inkling 2 Mini，首句定位「a fast, powerful model that's small enough to run on your laptop」；官方称其在总参不足 100B 的开放权重模型中领先，代表成绩 DeepSWE v1.1（48.2%）与 Vals Index v2.2（46.5%）。
- 官方自述能力边界：长程 agentic 工作最强；「是总参不足 100B 的开放权重模型中，在多数所测任务上最好」；在 agentic 编码（DeepSWE v1.1、SWE-bench Pro v2）上领先同尺寸可比模型，其他任务落后于 Qwen3.8-27B；PMPP-Hard（kernel 优化）接近体量大得多的 Inkling 2 Small。
- 循环（looping）让模型「不把推理写下来也能多算几步」，因此对 CoT 可监控性提出新问题；官方认为循环提升的是推理而非知识量，AA-Omniscience（事实性）与同尺寸模型持平，知识差距靠搜索与工具弥补。
- 局限（Limitations 节）：多轮聊天与多约束指令不是最强——MultiChallenge 50.0%、ComplexConstraints v1.1 33.4%，两项均落后 Qwen3.8-27B；在 CritPt v2、HLE-Diamond 等推理密集基准上落后于更大模型。

## 规格与架构（模型卡 §2 / 发布文 Architecture and training）

- Mixture-of-Experts：26.4B 总参、3.4B 激活；因三层循环，每 token 有效激活参数 5.4B（模型卡原话：each extra pass through the looped layers adds about 1.0B effective active parameters）。
- 24 层 decoder-only transformer，稀疏 MoE 前馈层；中间 12 层跑 3 遍且共享权重（24 层权重 → 每 token 48 次层应用）；每层每 token 从 128 个专家中路由 8 个；注意力为 local 与 global 混合层；原生多模态（视觉 transformer 编码图像，图像与文本投影到同一隐空间联合处理）。
- 上下文窗口：最长 1M tokens；输入文本（UTF-8）+ 图像（每边 40px–4096px）；输出文本。
- 数值精度：专家层前向（含预训练到 RL 全程）4-bit NVFP4，最后 4 层前向 8-bit MXFP8；部署权重即训练精度（20 层 NVFP4 + 4 层 MXFP8），无量化转换损失；总占用约 20GB，可在 32GB 内存的 Apple silicon 或 NVIDIA DGX Spark 上跑。
- 训练：主线 predictive scaling ladder 派生 → 剪掉三分之二专家 → 用 1T tokens 从更大内部 Inkling 模型蒸馏 healing → SFT → RL（2.2T tokens、2,000 步，含 on-policy distillation 对齐）。
- 许可：Apache 2.0；分发：HF 权重 + Tinker API / Playground（推理与微调）。

## 评测协议（Benchmarking 口径）

- 本发布页没有像 Inkling 2 Small 那版那样声明「采用第三方机构报告值」的来源清单：全部数值印在厂商自己的 DOM 评测表内，故 `attribution_type` 一律记 `vendor_reported`。
- 行名里印出的 harness / 工具条件（本账本逐行记入 `protocol.harness` / `protocol.tools`）：stirrup v0.2.1、mini-swe-agent v2.4.6、pi v0.83.0、openhands (vals)、openhands v1.45.0、pi (vals)、mini-swe-agent (vals)、Inkling 2 Mini in pi v0.83.0；工具条件：bash only（SWEBench Multilingual、SWEBench Verified）、with compaction（BrowseComp、DeepSearchQA）。
- 页面未明示 reasoning effort / temperature / top_p / token budget / turn limit / time limit / run_count / aggregation / judge，`protocol` 其余字段一律 `null`，因此所有行的 `comparison_scope` 记 `only_same_protocol`（各行脚手架不同，不可跨行直比）。
- 表内括号标注「(Best reported score in this row)」「(Second-best reported score in this row)」只是行内排名提示，不是数值；模型卡表脚注补充「equal displayed scores tie」「none when first place is tied」。

## 评测数值转录（全部为页面 DOM 表格，逐格机读；`–` 未报告格不转录）

### 发布文 Capabilities 节评测总表（5 模型列：Inkling 2 Mini / Gemma 4 31B / Muse Glimmer / Qwen3.8-27B / Nemotron 3.5 Super VL）

| 评测 | 分数（Inkling 2 Mini） | 备注（同表其他列） |
|---|---|---|
| **Model Info** | | |
| Params (B) activated / total | 5.4/26.4 | 规格，非评测；Gemma 4 31B 30.7/30.7 / Muse Glimmer 30.0/30.0 / Qwen3.8-27B 27.0/27.0 / Nemotron 3.5 Super VL 12.0/124.5 |
| **Third Party Index** | | |
| AA Index (v5.0) | 20.1 | Gemma 4 31B 4.4 / Muse Glimmer 6.3 / Qwen3.8-27B 20.1 / Nemotron 3.5 Super VL 13.6 |
| Vals Index (v2.2) | 46.5% | Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B – / Nemotron 3.5 Super VL 29.8% |
| **Coding and Autoresearch** | | |
| FrontierCode v2.0 stirrup v0.2.1 | 15.1% | Gemma 4 31B 0.0% / Muse Glimmer 1.5% / Qwen3.8-27B 14.9% / Nemotron 3.5 Super VL 6.1% |
| DeepSWE v1.1 mini-swe-agent v2.4.6 | 48.2% | Gemma 4 31B 0.3% / Muse Glimmer 4.4% / Qwen3.8-27B 42.2% / Nemotron 3.5 Super VL 24.7% |
| Terminal Bench v4.0 mini-swe-agent v2.4.6 | 5.6% | Gemma 4 31B 0.0% / Muse Glimmer 0.5% / Qwen3.8-27B 5.6% / Nemotron 3.5 Super VL 0.0% |
| Terminal Bench v2.1 Inkling 2 Mini in pi v0.83.0 | 71.6% | Gemma 4 31B 43.4% / Muse Glimmer 51.7% / Qwen3.8-27B 73.0% / Nemotron 3.5 Super VL 60.7% |
| SWEBench Pro v2 (Hard) mini-swe-agent v2.4.6 | 77.9% | Gemma 4 31B 14.2% / Muse Glimmer 44.3% / Qwen3.8-27B 73.8% / Nemotron 3.5 Super VL 44.1% |
| SWEBench Multilingual Inkling 2 Mini with bash only | 73.7% | Gemma 4 31B 43.0% / Muse Glimmer 66.9% / Qwen3.8-27B 70.0% / Nemotron 3.5 Super VL 67.7% |
| SWEBench Verified bash only | 79.2% | Gemma 4 31B 46.1% / Muse Glimmer 76.0% / Qwen3.8-27B 77.8% / Nemotron 3.5 Super VL 71.1% |
| Vibe Code Bench v1.1 openhands (vals) | 77.9% | Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B 64.9% / Nemotron 3.5 Super VL 3.5% |
| PMPP-Hard (AUC, 0–10h) pi v0.83.0 | 455.82 | Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B 262.50 / Nemotron 3.5 Super VL – |
| **Agentic Search, Tool Use, and Knowledge Work** | | |
| BrowseComp Inkling 2 Mini with compaction | 79.0% | Gemma 4 31B 37.0% / Muse Glimmer 63.9% / Qwen3.8-27B 61.6% / Nemotron 3.5 Super VL 78.9% |
| DeepSearchQA Inkling 2 Mini with compaction | 85.3% | Gemma 4 31B 61.7% / Muse Glimmer 74.6% / Qwen3.8-27B 79.7% / Nemotron 3.5 Super VL 77.7% |
| MCP Atlas Public | 82.7% | Gemma 4 31B 54.2% / Muse Glimmer 75.5% / Qwen3.8-27B 77.3% / Nemotron 3.5 Super VL 67.7% |
| AA-Briefcase v1.1 | 1263 | Gemma 4 31B 369 / Muse Glimmer 478 / Qwen3.8-27B 1391 / Nemotron 3.5 Super VL 999 |
| GDPVal-AA v2.1 | 1319 | Gemma 4 31B 627 / Muse Glimmer 792 / Qwen3.8-27B 1427 / Nemotron 3.5 Super VL 1162 |
| JobBench | 49.6% | Gemma 4 31B 8.2% / Muse Glimmer 16.1% / Qwen3.8-27B 33.4% / Nemotron 3.5 Super VL 36.5% |
| AutomationBench-AA v1.0.6 | 41.8% | Gemma 4 31B 4.9% / Muse Glimmer 6.8% / Qwen3.8-27B 48.2% / Nemotron 3.5 Super VL 14.8% |
| EnterpriseOps-Gym | 42.0% | Gemma 4 31B 28.4% / Muse Glimmer 34.7% / Qwen3.8-27B 44.2% / Nemotron 3.5 Super VL 28.1% |
| Vals Finance Index | 50.1% | Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B – / Nemotron 3.5 Super VL 41.0% |
| AA-AnalystAgent | 46.3% | Gemma 4 31B – / Muse Glimmer 20.0% / Qwen3.8-27B – / Nemotron 3.5 Super VL – |
| Diligence Bench Best harness | 48.6% | Gemma 4 31B – / Muse Glimmer 40.9% / Qwen3.8-27B 46.4% / Nemotron 3.5 Super VL 45.0% |
| **Vision Interpretation and Creation** | | |
| GDP.pdf | 16.8% | Gemma 4 31B 6.0% / Muse Glimmer 11.8% / Qwen3.8-27B 16.4% / Nemotron 3.5 Super VL 8.0% |
| PerceptionBench | 57.5% | Gemma 4 31B 40.7% / Muse Glimmer 42.8% / Qwen3.8-27B 52.4% / Nemotron 3.5 Super VL 36.8% |
| MMMU Pro Standard 10 | 74.9% | Gemma 4 31B 73.4% / Muse Glimmer 74.3% / Qwen3.8-27B 76.3% / Nemotron 3.5 Super VL 72.3% |
| OmniDocBench v1.6 | 92.8% | Gemma 4 31B 82.5% / Muse Glimmer 90.4% / Qwen3.8-27B 91.5% / Nemotron 3.5 Super VL 77.9% |
| ScreenSpot Pro original / with Python | 76.5/87.7% | Gemma 4 31B 5.9%/– / Muse Glimmer 75.4%/– / Qwen3.8-27B 57.6/78.9% / Nemotron 3.5 Super VL 43.5%/– |
| Chartography original / with Python | 22.1/72.5% | Gemma 4 31B 12.0/11.8% / Muse Glimmer 17.4/25.1% / Qwen3.8-27B 12.2/52.1% / Nemotron 3.5 Super VL 9.7/29.3% |
| ZeroBench (main) original / with Python | 17.0/34.0% | Gemma 4 31B 9.0/12.0% / Muse Glimmer 9.0/17.0% / Qwen3.8-27B 12.0%/– / Nemotron 3.5 Super VL 11.0/12.0% |
| MuirBench | 77.5% | Gemma 4 31B 72.3% / Muse Glimmer 77.6% / Qwen3.8-27B 65.9% / Nemotron 3.5 Super VL 72.7% |
| BVB | 68.4% | Gemma 4 31B 47.0% / Muse Glimmer 50.5% / Qwen3.8-27B 70.7% / Nemotron 3.5 Super VL 52.1% |
| **Reasoning, Knowledge, and Epistemics** | | |
| HLE-Diamond | 15.2% | Gemma 4 31B 7.2% / Muse Glimmer 9.1% / Qwen3.8-27B 15.3% / Nemotron 3.5 Super VL 8.8% |
| CritPt v2 Full / Hard | 31.4/17.0% | Gemma 4 31B –/4.0% / Muse Glimmer –/7.0% / Qwen3.8-27B 10.6/4.0% / Nemotron 3.5 Super VL 36.9/13.5% |
| Apex 2025 | 34.4% | Gemma 4 31B 5.2% / Muse Glimmer 4.2% / Qwen3.8-27B 18.8% / Nemotron 3.5 Super VL 22.9% |
| ARC-AGI v1 / v2 | 84.5/49.3% | Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B 87.5/42.4% / Nemotron 3.5 Super VL 22.7/1.5% |
| LongBench v2 | 66.9% | Gemma 4 31B 52.9% / Muse Glimmer 33.1% / Qwen3.8-27B 52.3% / Nemotron 3.5 Super VL 62.1% |
| GraphWalks BFS 256K | 69.7% | Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B 50.4% / Nemotron 3.5 Super VL 63.3% |
| MRCR v2 8-needle 256K–512K | 46.4% | Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B 38.0% / Nemotron 3.5 Super VL 5.7% |
| AA-Omniscience v1.1 score | -8.6 | Gemma 4 31B -48.5 / Muse Glimmer -32.2 / Qwen3.8-27B -6.4 / Nemotron 3.5 Super VL -2.9 |
| AA-Omniscience v1.1 non-hallucination rate | 63.4% | Gemma 4 31B 14.5% / Muse Glimmer 16.4% / Qwen3.8-27B 71.4% / Nemotron 3.5 Super VL 69.5% |
| ComplexConstraints v1.1 openhands v1.45.0 | 33.4% | Gemma 4 31B 31.6% / Muse Glimmer 35.6% / Qwen3.8-27B 30.1% / Nemotron 3.5 Super VL 30.1% |
| **Safety and Alignment** | | |
| FORTRESS (adversarial) Public | 89.5% | Gemma 4 31B 67.8% / Muse Glimmer 90.3% / Qwen3.8-27B 78.8% / Nemotron 3.5 Super VL 79.6% |
| FORTRESS (benign) Public | 96.4% | Gemma 4 31B 97.6% / Muse Glimmer 89.1% / Qwen3.8-27B 97.8% / Nemotron 3.5 Super VL 92.7% |
| StrongREJECT (none) | 97.8% | Gemma 4 31B 98.1% / Muse Glimmer 99.0% / Qwen3.8-27B 99.0% / Nemotron 3.5 Super VL 99.4% |
| Misbehavior (Internal) ↓ | 9.8% | Gemma 4 31B 27.6% / Muse Glimmer 46.4% / Qwen3.8-27B 57.7% / Nemotron 3.5 Super VL 52.8% |
| Covert misbehavior (Internal) ↓ | 8.3% | Gemma 4 31B 24.3% / Muse Glimmer 45.6% / Qwen3.8-27B 33.2% / Nemotron 3.5 Super VL 43.4% |
| Destructive actions (Internal) ↓ | 10.2% | Gemma 4 31B 75.8% / Muse Glimmer 68.8% / Qwen3.8-27B 35.2% / Nemotron 3.5 Super VL 65.6% |

### 官方模型卡 §5 Evaluations 评测表（8 模型列，前两列为 Looped Transformers：Dory 1.0 4B / SenseNova-Loop-9B，其余为 Non-looped Transformers）——仅列发布文总表未收录、模型卡独有的行

| 评测 | 分数（Inkling 2 Mini） | 备注（同表其他列） |
|---|---|---|
| **Coding and Autoresearch** | | |
| SWEBench Multimodal v2 mini-swe-agent (vals) | 37.9% | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B – / Nemotron 3.5 Super VL 25.8% / Beam 1.0 – |
| Code Migration v1.1 pi (vals) | 23.2% | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B – / Nemotron 3.5 Super VL 16.4% / Beam 1.0 22.9% |
| Terminal Bench Science v0.1 mini-swe-agent v2.4.6 | 1.4% | Dory 1.0 4B 0.0% / SenseNova-Loop-9B 0.0% / Gemma 4 31B 0.0% / Muse Glimmer 0.0% / Qwen3.8-27B 0.5% / Nemotron 3.5 Super VL 0.0% / Beam 1.0 0.5% |
| **Agentic Search, Tool Use, and Knowledge Work** | | |
| Finance Agent v2.1 | 56.5% | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B – / Nemotron 3.5 Super VL 47.7% / Beam 1.0 51.8% |
| Excel Modeling Benchmark v1.1 | 66.0% | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B – / Nemotron 3.5 Super VL 52.8% / Beam 1.0 64.7% |
| Tax Agent Bench | 14.1% | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B 30.9% / Nemotron 3.5 Super VL 11.6% / Beam 1.0 8.8% |
| **Vision Interpretation and Creation** | | |
| BabyVision original / with Python | 53.4/88.8% | Dory 1.0 4B – / SenseNova-Loop-9B 16.5%/– / Gemma 4 31B 24.2/36.8% / Muse Glimmer 26.5/45.9% / Qwen3.8-27B 65.7/85.6% / Nemotron 3.5 Super VL 29.6/43.0% / Beam 1.0 – |
| Charxiv RQ original / with Python | 80.6/88.3% | Dory 1.0 4B – / SenseNova-Loop-9B 59.1%/– / Gemma 4 31B 68.2/76.1% / Muse Glimmer 78.8/81.1% / Qwen3.8-27B 83.7/90.2% / Nemotron 3.5 Super VL 80.8/84.0% / Beam 1.0 – |
| GroundingME | 55.5% | Dory 1.0 4B – / SenseNova-Loop-9B 15.1% / Gemma 4 31B – / Muse Glimmer 42.9% / Qwen3.8-27B 44.7% / Nemotron 3.5 Super VL 42.4% / Beam 1.0 – |
| SAGE v1.1 | 85.9% | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B 82.8% / Muse Glimmer – / Qwen3.8-27B – / Nemotron 3.5 Super VL – / Beam 1.0 – |
| MathVision | 89.0% | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B 85.6% / Muse Glimmer 77.5% / Qwen3.8-27B 90.0% / Nemotron 3.5 Super VL 78.2% / Beam 1.0 – |
| Code2Video-AA | 870 | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B 949 / Nemotron 3.5 Super VL – / Beam 1.0 675 |
| **Reasoning, Knowledge, and Epistemics** | | |
| HLE (text only) | 30.7% | Dory 1.0 4B 10.4% / SenseNova-Loop-9B 15.6% / Gemma 4 31B 23.6% / Muse Glimmer 22.0% / Qwen3.8-27B 33.9% / Nemotron 3.5 Super VL 30.7% / Beam 1.0 36.2% |
| GPQA Diamond | 86.6% | Dory 1.0 4B 72.2% / SenseNova-Loop-9B 74.8% / Gemma 4 31B 85.7% / Muse Glimmer 83.5% / Qwen3.8-27B 90.5% / Nemotron 3.5 Super VL 89.5% / Beam 1.0 90.5% |
| ARC-AGI-1 | 84.5% | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B 87.5% / Nemotron 3.5 Super VL 22.7% / Beam 1.0 74.0% |
| ARC-AGI-2 | 49.3% | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B 42.4% / Nemotron 3.5 Super VL 1.5% / Beam 1.0 23.5% |
| MysteryMechanism | 23.0% | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B – / Nemotron 3.5 Super VL – / Beam 1.0 22.1% |
| ProofBench v1.1 | 18.0% | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B 16.0% / Nemotron 3.5 Super VL – / Beam 1.0 18.0% |
| AA-LCR v1.1 | 80.0% | Dory 1.0 4B 77.0% / SenseNova-Loop-9B 60.5% / Gemma 4 31B 69.7% / Muse Glimmer 83.3% / Qwen3.8-27B 82.0% / Nemotron 3.5 Super VL 69.0% / Beam 1.0 79.3% |
| **Safety and Alignment** | | |
| HoneyBench v0.2 ↓ | 56.7% | Dory 1.0 4B – / SenseNova-Loop-9B – / Gemma 4 31B – / Muse Glimmer – / Qwen3.8-27B – / Nemotron 3.5 Super VL – / Beam 1.0 – |

### 正文明文分数（非表格）

| 评测 | 分数（Inkling 2 Mini） | 备注 |
|---|---|---|
| MultiChallenge（Limitations 节） | 50.0% | 页面只说明该项落后 Qwen3.8-27B，未印竞品数值 |
| CoT-Control-QA（CoT monitorability 节） | 0.1% | CoT 长度 750–1,250 tokens 区间、跨五个 reasoning effort 合并统计的「at most 0.1%」上界；竞品 Inkling 2 Small 0.3% / Inkling-Small 0.4% / Qwen3.8-27B 1.3% |

## 同页研究变体与可监控性实验（非本账本评测行，仅归档）

- 研究变体 TML-d24-varloop-research 与 Inkling 2 Mini 一同发布，支持 1–5 遍可变循环、主要按 3 遍训练；它不是独立发布，本账本不另立 release。
- no-CoT 时间跨度：research 变体从 1 遍的 16 秒提升到 3 遍的 37 秒，超过 3 遍后基本持平；该模型训练时最多见过 5 遍，跑 10 遍性能不显著下降。这是任务长度指标，不是基准分数。
- N-Hop Lookup（串行推理）：可链式查找的条目数随循环数一直提升到 10 遍（训练时只见过 5 遍）。
- CoT 压缩：5 遍平均推理 token 1,661（1 遍 3,703），句长与英文词典词占比基本不变；可读性未下降。
- CoT 可控性：CoT-Control-QA 上 Inkling 2 Mini 与 research 变体（3 遍）几乎无法按指令改写 CoT。
- LinuxArena 隐蔽率：只印在页面图表（figure id=mini-linuxarena）里，且跑的是 helpful-only 微调版 Inkling 2 Mini，不是发布权重本身；账本记 pending + not_extracted，读数只留在该行 notes。

## 训练披露（非评测，仅归档）

| 项 | 值 |
|---|---|
| Params (B) activated / total（表内 Model Info 行） | 5.4/26.4 |
| # Passes（模型卡表内行） | 3 |
| 专家路由 | 每层每 token 从 128 个专家中选 8 个（剪枝前为 384 选 8） |
| 剪枝 | midtraining 阶段剪掉三分之二专家，保留每层最常用的 128 个 |
| Healing | 剪枝后用 1T tokens 从更大的内部 Inkling 模型蒸馏 |
| RL | 2.2T tokens、2,000 步；含 on-policy distillation 对齐 |
| 量化 | 专家层 4-bit NVFP4，末 4 层 8-bit MXFP8 |
| 显存占用 | 约 20GB（单 checkpoint） |

## 未转录内容

- 正文 SVG 图表（DeepSWE / SWE-bench Pro v2 编码前沿曲线与解码速度上限 614 GB/s、no-CoT 时间跨度、N-Hop Lookup 准确率、CoT token 效率、CoT 可控性、LinuxArena 隐蔽率）：图表内容，多为趋势或仅存在于图形中，按「图片/图表行必须 pending」处理；LinuxArena 建了一行 pending，其余不建行。
- 变体研究模型 TML-d24-varloop-research 的逐遍结果：不是本 release 的模型，不建行。
- Stanford Hazy Research Lab / Scaling Intelligence Lab 的「Intelligence per Watt」0.703（DGX Spark，第三方能效实验）：非基准分数，只作归档说明。
