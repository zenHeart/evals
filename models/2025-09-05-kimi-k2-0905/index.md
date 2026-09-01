---
vendor: kimi
model: Kimi-K2-Instruct-0905
release: kimi-k2-0905
date: 2025-09-05
source: https://huggingface.co/moonshotai/Kimi-K2-Instruct-0905
fetched_at: 2026-09-01
---

# Kimi-K2-Instruct-0905（Hugging Face 官方模型卡）

## 评测数据（转录）

### 表 1（页面 HTML 表格逐行转录）

|  |  |
|---|---|
| Architecture | Mixture-of-Experts (MoE) |
| Total Parameters | 1T |
| Activated Parameters | 32B |
| Number of Layers (Dense layer included) | 61 |
| Number of Dense Layers | 1 |
| Attention Hidden Dimension | 7168 |
| MoE Hidden Dimension (per Expert) | 2048 |
| Number of Attention Heads | 64 |
| Number of Experts | 384 |
| Selected Experts per Token | 8 |
| Number of Shared Experts | 1 |
| Vocabulary Size | 160K |
| Context Length | 256K |
| Attention Mechanism | MLA |
| Activation Function | SwiGLU |

### 表 2（页面 HTML 表格逐行转录）

| Benchmark | Metric | K2-Instruct-0905 | K2-Instruct-0711 | Qwen3-Coder-480B-A35B-Instruct | GLM-4.5 | DeepSeek-V3.1 | Claude-Sonnet-4 | Claude-Opus-4 |
|---|---|---|---|---|---|---|---|---|
| SWE-Bench verified | ACC | 69.2 ± 0.63 | 65.8 | 69.6* | 64.2* | 66.0* | 72.7* | 72.5* |
| SWE-Bench Multilingual | ACC | 55.9 ± 0.72 | 47.3 | 54.7* | 52.7 | 54.5* | 53.3* | - |
| Multi-SWE-Bench | ACC | 33.5 ± 0.28 | 31.3 | 32.7 | 31.7 | 29.0 | 35.7 | - |
| Terminal-Bench | ACC | 44.5 ± 2.03 | 37.5 | 37.5* | 39.9* | 31.3* | 36.4* | 43.2* |
| SWE-Dev | ACC | 66.6 ± 0.72 | 61.9 | 64.7 | 63.2 | 53.3 | 67.1 | - |

## 协议脚注

- 来源：https://huggingface.co/moonshotai/Kimi-K2-Instruct-0905（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.webp | 200x200 | https://cdn-avatars.huggingface.co/v1/production/uploads/641c1e77c3983aa9490f8121/X1yT2rsaIbR9cdYGEVu0X.jpeg |  |
| images/02.png | 1097x400 | https://huggingface.co/moonshotai/Kimi-K2-Instruct-0905/resolve/main/figures/kimi-logo.png | Kimi K2: Open Agentic Intellignece |
| images/10.png | 1200x648 | https://cdn-thumbnails.huggingface.co/social-thumbnails/models/moonshotai/Kimi-K2-Instruct-0905.png | [og/twitter] |
