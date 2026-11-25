---
vendor: tencent
model: WeMM-Ecom 家族（0.8B / 2B / 4B / 9B / 35B-A3B）
release: welm-ecom
date: 2026-11-18
source: https://huggingface.co/tencent/WeMM-Ecom-35B-A3B
fetched_at: 2026-11-24
---

# WeMM-Ecom 家族（腾讯官方模型卡证据归档）

发布日期证据链：腾讯官方 Hugging Face 仓 tencent/WeMM-Ecom-35B-A3B（BF16）的公开日 2026-11-18（FP8 同日），与技术报告 arXiv:2611.30662（2026 年 11 月）互证，`date_precision=day`。

- 官方模型卡（旗舰）：https://huggingface.co/tencent/WeMM-Ecom-35B-A3B （`README-35b-a3b.md`）
- 家族各尺寸模型卡：`README-0-8b.md` / `README-2b.md` / `README-4b.md` / `README-9b.md`
- 官方技术报告：https://arxiv.org/abs/2611.30662 ｜ 官方代码仓：https://github.com/Tencent/WeMM-Ecom

## 官方定位（原文要点）

- 「WeMM-Ecom is a mixture-of-experts model in the WeMM-Ecom family developed by WeChat Vision, Tencent. It combines fine-grained e-commerce understanding with broad visual-language and reasoning capabilities and supports hybrid thinking.」
- 官方称该家族在电商理解上领先参数规模大得多的开源模型，同时在通用能力上与同尺寸前沿模型持平。

## 规格（各尺寸模型卡明示）

| 型号 | 架构 | 上下文窗口 | 权重格式 |
|---|---|---|---|
| WeMM-Ecom-0.8B | 0.8B dense | 262,144 tokens | BF16 / FP8 / GPTQ / GGUF |
| WeMM-Ecom-2B | 2B dense | 262,144 tokens | BF16 / FP8 / GPTQ / GGUF |
| WeMM-Ecom-4B | 4B dense | 262,144 tokens | BF16 / FP8 / GPTQ / GGUF |
| WeMM-Ecom-9B | 9B dense | 262,144 tokens | BF16 / FP8 / GPTQ / GGUF |
| WeMM-Ecom-35B-A3B | 35B 总参数 / 约 3B 激活（MoE） | 262,144 tokens | BF16 / FP8 / GPTQ / GGUF |

## 评测转录表（官方模型卡 Highlights 机读散文）

| 评测 | 分数 | 备注 |
|---|---|---|
| 0.8B 电商理解平均分差 | +16.43 分 | new-benchmark: welm-ecom-avg-ecommerce；相对 Qwen3.5-0.8B；MiniCPM-V-4.7-1B 领先 13.03 分 |
| 0.8B 通用能力平均分差 | +6.93 分 | new-benchmark: welm-ecom-avg-general；相对 Qwen3.5-0.8B；MiniCPM-V-4.7-1B 领先 1.09 分 |
| 2B 电商理解平均分差 | +10.59 分 | 相对 Qwen3.5-2B；LFM3-VL-2B 领先 6.16 分 |
| 2B 通用能力平均分差 | +4.45 分 | 相对 Qwen3.5-2B；LFM3-VL-2B 领先 2.43 分 |
| 4B 电商理解平均分差 | +6.47 分 | 相对 Qwen3.5-4B（无其他对比列） |
| 4B 通用能力平均分差 | +0.40 分 | 相对 Qwen3.5-4B（无其他对比列） |
| 9B 电商理解平均分差 | +5.19 分 | 相对 Qwen3.5-9B；Valley3-8B 领先 10.28 分 |
| 9B 通用能力平均分差 | +0.83 分 | 相对 Qwen3.5-9B；Valley3-8B 领先 13.02 分 |
| 35B-A3B 电商理解平均分差 | +3.92 分 | 相对 Qwen3.5-35B-A3B；Qwen3.6-35B-A3B 领先 3.36 分、MiniCPM-V-4.7-35B-A3B 领先 8.22 分 |
| 35B-A3B 通用能力平均分差 | +0.17 分 | 相对 Qwen3.5-35B-A3B；MiniCPM-V-4.7-35B-A3B 领先 5.60 分、Valley3-32B 领先 9.13 分 |

## 未转录区块说明

- 逐基准成绩表（电商 28 项 / 通用 64 项，Instruct 与 Thinking 两模式）官方以位图给出，未做读图转写、未建对应 evidence 行。
