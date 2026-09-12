---
vendor: xiaomi
model: MiMo-V2-Flash
release: mimo-v2-flash
date: 2025-12-18
source: https://github.com/XiaomiMiMo/MiMo-V2-Flash
fetched_at: 2026-09-12
---

# Xiaomi MiMo-V2-Flash — Ultra-Fast Sparse Mixture-of-Experts Model

## 评测数据（转录）

### 表 1：核心基准评测表现

| Benchmark | Metric | MiMo-V2-Flash (309B-A15B) |
|---|---|---|
| MMLU | 5-shot | 82.6% |
| GSM8K | 8-shot | 94.2% |
| MATH-500 | pass@1 | 79.4% |
| HumanEval | pass@1 | 82.5% |

## 协议脚注

- 架构：稀疏混合专家（MoE），总参数 309B，激活 15B，上下文 128K。
- 极速推理与端云协同设计。
