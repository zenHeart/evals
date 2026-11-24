---
vendor: microsoft
model: Aion 1.0 Instruct
release: aion-1-0-instruct
date: 2026-11-18
source: https://huggingface.co/microsoft/Aion-1.0-Instruct-2.3B
fetched_at: 2026-11-24
---

# Aion 1.0 Instruct（微软官方模型卡证据归档）

发布日期证据链：微软官方 Hugging Face 仓 microsoft/Aion-1.0-Instruct-2.3B 的公开日（2026-11-18，同仓另有 Aion-1.0-Instruct-2.3B-ONNX-WebGPU 同日），并与模型卡自述「Windows OS SLM 计划于 2027 年 1 月底前上线」的时间线互证，`date_precision=day`。

- 官方模型卡：https://huggingface.co/microsoft/Aion-1.0-Instruct-2.3B （`README.md`，官方仓 raw README，原始字节未改动存档）
- 官方示例仓：https://github.com/microsoft/Aion-Instruct-Preview-Sample

## 官方定位（原文要点）

- 「Aion Instruct serves as the foundational Small Language Model (SLM) in the Windows ecosystem, specifically optimized for on-device AI, text and operating system use cases.」
- 模型卡说明这是面向用户透明度与反馈的「introduction to what is coming」，并称先发未量化版本，量化版本随后发布。

## 规格（模型卡明示）

- **参数量**：约 2.29B（输入/输出嵌入绑定；模型卡正文另称 2.3B base model）
- **上下文窗口**：32K tokens
- **语言**：英语、德语、西班牙语、葡萄牙语、意大利语、法语、中文、日语
- **许可**：MIT
- **作者**：Microsoft Windows & Devices / Applied Sciences Group

## 评测转录表（官方模型卡 Evaluation 表，逐格机读）

| 评测 | 分数 | 备注 |
|---|---|---|
| MMLU | 55.15% | Knowledge |
| MMLU-Pro | 33.35% | Knowledge |
| MMMLU | 45.51% | Knowledge；官方备注 Multilingual MMLU |
| GPQA | 28.18% | Knowledge |
| GSM8K | 74.91% | Math；官方备注 Loose matching |
| GSMPlus | 49.56% | Math；new-benchmark: gsmplus |
| MATH-500 | 48.00% | Math |
| IFEval | 83.90% | 官方备注 Mean of prompt-level strict and instruction-level strict |
| IFBench | 32.00% | 官方备注 Prompt-level loose |
| Multi-IF | 64.70% | Instruction following |
| chrF++ | 43.18% | Translation；new-benchmark: chrf |
| 安全基准柱状图 | （未披露逐格数值） | 方向归一化 0–100，越高越好；位图见 `images/aion_safety_bchart.png`，待人工读图核验 |

官方表头说明：所有基准在 EleutherAI lm-evaluation-harness 有官方 task 实现时用该 harness，否则使用各基准官方仓库自带实现；需要 LLM 裁判的基准（官方标注 †）以 GPT-4o 为裁判模型（本表 11 行均未带 † 标记）。分数单位为百分比。
