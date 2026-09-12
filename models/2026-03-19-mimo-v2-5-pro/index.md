---
vendor: xiaomi
model: MiMo-V2.5-Pro
release: mimo-v2-5-pro
date: 2026-03-19
source: https://github.com/XiaomiMiMo/MiMo-V2.5-Pro
fetched_at: 2026-09-12
---

# Xiaomi MiMo-V2.5-Pro — Frontier MoE Foundation Model for Complex Reasoning and Coding

## 评测数据（转录）

### 表 1：语言与通用知识能力

| Benchmark | Setting | MiMo-V2.5-Pro (1.02T-A42B) |
|---|---|---|
| MMLU | 5-shot | 89.4% |
| MMLU-Pro | 5-shot | 68.5% |
| GPQA (Diamond) | 0-shot | 66.7% |
| BBH | 3-shot | 88.4% |
| DROP | 3-shot F1 | 86.3% |
| ARC-Challenge | 25-shot | 97.2% |
| HellaSwag | 10-shot | 89.8% |

### 表 2：数学与逻辑推理

| Benchmark | Setting | MiMo-V2.5-Pro |
|---|---|---|
| GSM8K | 8-shot | 99.6% |
| MATH | 0-shot | 86.2% |
| AIME 24&25 | 0-shot | 37.3% |

### 表 3：代码生成与智能代理

| Benchmark | Setting | MiMo-V2.5-Pro |
|---|---|---|
| HumanEval | pass@1 | 75.6% |
| LiveCodeBench v6 | pass@1 | 39.6% |
| SWE-bench Verified | resolve rate | 78.9% |

### 表 4：中文语言理解

| Benchmark | Setting | MiMo-V2.5-Pro |
|---|---|---|
| C-Eval | 5-shot | 91.5% |
| CMMLU | 5-shot | 90.2% |

## 协议脚注

- 技术报告：arXiv:2603.14201
- 架构：稀疏 MoE，总参数 1.02T，激活 42B，支持 1M token 上下文窗口。
