---
vendor: meta
model: Muse Spark Open
release: muse-spark-open
date: 2026-10-15
source: https://research.meta.ai/blog/muse-spark-open
fetched_at: 2026-10-18
---

# Muse Spark Open

发布日期来自官方页面正文印刷日「October 15, 2026」，并与页面 JSON-LD `datePublished: 2026-10-15` 一致。

Meta 发布 **Muse Spark Open** 开放权重模型，官方称为「迄今最强的美国开放权重模型」。原生多模态，面向编码与智能体工作，擅长长程任务、复杂软件工程与多步推理。

官方明示规格：

| 项 | 值 |
|---|---|
| 参数规模 | 816B 总参数 / 42B 激活 |
| 上下文长度 | 1M tokens |
| 架构 | 原生多模态（natively multimodal） |
| 端侧部署 | 首批可单机运行的同级别模型；在两台 Apple M5 Ultra Mac Studio（配合最新 MLX 框架）上运行，统一内存最高 512 GB/台，合计 TB 级统一内存 |
| 托管推理 | Baseten、Fireworks AI、Groq、Modal、Nebius、OpenRouter、Together AI |
| 权重分发 | Amazon SageMaker AI、Google Cloud Model Garden、Hugging Face、Microsoft Foundry Models |
| 推理引擎 | SGLang、vLLM、TensorRT-LLM、Hugging Face Transformers、Apple MLX、llama.cpp、Unsloth（对 AMD / Apple / Intel / NVIDIA 硅片均含优化） |
| 许可 | Muse Model License（有限商业条款，多数开发者可免费使用） |

安全：开放权重额外做了安全后训练，按 **Meta Superintelligence Scaling Framework** 评估并达到框架发布阈值；详细结果见官方 model card。

评测部分：正文设有「Key Benchmarks」小节，但**具体分数以图表/表格图片呈现，正文未印离散数字**，依契约保持 pending 证据档，视觉读数未转录。

| 评测 | 分数 | 备注 |
|---|---|---|
| — | — | 页面「Key Benchmarks」小节为图表，未印离散数字，亦未在正文逐项点名基准（视觉转写） |

正文另有非表格的相对表述（原样转录，不作数值证据）：开放权重版本在 SGLang 中附带自定义可自动调谐的 Helion GPU kernel，在 NVIDIA 与 AMD GPU 上取得 1.03–3.95× 的 kernel 级加速，在 AMD MI350 上取得 3% 的端到端加速。端侧实测包括在完全离线的 agentic 工作流中，用 Muse Code 驱动 Muse Spark Open 向开源客户端 Ice Cubes 交付真实 iOS 改动，以及端到端驱动 DaVinci Resolve。
