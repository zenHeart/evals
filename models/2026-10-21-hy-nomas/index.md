---
vendor: tencent
model: Hy-Nomas
release: hy-nomas
date: 2026-10-21
source: https://huggingface.co/tencent/Hy-Nomas
fetched_at: 2026-10-23
---

# Hy-Nomas

发布日期证据：Hugging Face 官方模型仓 `tencent/Hy-Nomas` 的 `createdAt` 为 2026-10-21；官方 GitHub 仓 `Tencent-Hunyuan/Hy-Nomas` 的 `created_at` 为 2026-10-21T03:04:54Z；官方项目站 hy-nomas.hy.tencent.com 同日上线。来源：https://huggingface.co/tencent/Hy-Nomas

腾讯混元发布 **Hy-Nomas**，一个自由形式的交互式视频世界生成模型：按段自回归地一段段生成世界，支持多轮文本指令与相机轨迹控制，用持久化 KV 缓存跨段保持上下文一致。

官方明示规格：

| 项 | 值 |
|---|---|
| 骨干 | 54 个双流 MMDiT 块，隐藏维度 2,048，16 头（每头 128 维），FFN 4×（中间层 8,192） |
| 潜变量 | DCAE-V `f32t4c32`，32 通道，空间 32× 压缩、时间 4× 压缩 |
| 文本编码器 | Qwen/Qwen2.5-VL-7B-Instruct 的语言模型部分，3,584 维隐状态 → 两层 token refiner → 投影到 2,048 维 |
| 解码器 | 微调 PixelUMM：36 层、4,096 维、32 查询头、8 KV 头，1 步解码，tubelet 4×16×16 |
| 位置编码 | 3D RoPE，时间/高/宽维度 `[16, 56, 56]`，theta 256 |
| 蒸馏推理 | 8 步去噪，Euler ODE，720×1280，24 FPS |
| 单卡配置 | 单张 NVIDIA GeForce RTX 4090；INT8 DiT 权重 + INT8 KV cache + FP8 解码器 + CPU offload；历史预算 18 个潜帧 |
| 权重资产 | 蒸馏 DiT（FP32 / INT8）、基座自回归 DiT（FP32）、电影风 / 机器人 LoRA、DCAE-V、PixelUMM（FT / FP8）、Nomas-PE 提示增强服务 |
| 授权 | Apache-2.0 |

官方同时公开评测数据集 **Hy-Nomas-Bench**（4 个子基准、280 个测试用例、220 条参考相机轨迹）：

| Benchmark | Cases | Primary evaluation | Turns / segments | Mean duration |
|---|---:|---|---:|---:|
| Bench-1: Multi-turn text | 60 | Prompt following, physical plausibility | 2–6 | 37.88 s |
| Bench-2: Camera navigation | 100 | Camera control | 4–20 | 27.05 s |
| Bench-3: Interleaved text and camera | 60 | Prompt following, physical plausibility, camera control | 2–7 | 30.59 s |
| Bench-4: Spatial memory | 60 | Memory consistency on revisits | 8 | 18.00 s |

未转录说明：官方模型卡与 GitHub README **均未给出任何评测数值**；官方数据集卡明确写明「Videos, extracted reference/revisit frames, and evaluation scores are not included」，技术报告标注 Coming Soon。因此账本中 4 条 evidence 一律不记分数（`score_status: not_reported`），留待官方公布后补录，不以任何二级来源补数。
