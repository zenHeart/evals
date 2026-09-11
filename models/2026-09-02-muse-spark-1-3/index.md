---
vendor: meta
model: Muse Spark 1.3
release: muse-spark-1-3
date: 2026-09-02
source: https://research.meta.ai/blog/introducing-muse-spark-1-3
fetched_at: 2026-09-11
---

# Introducing Muse Spark 1.3

## 评测数据（转录）

> 说明：官方博文公布 Muse Spark 1.3 在长程软件工程与智能体基准上的对比数据。

| 评测基准 | 分数 | 协议与对比 |
| --- | --- | --- |
| DeepSWE v1.1 | 75.4% | Muse Code 自研 agentic harness，max reasoning 设置下运行；较 1.2 (59.3%) 显著提升 |
| Terminal-Bench 2.1 | 88.8% | Terminus-2 harness，max reasoning；较 1.2 (82.9%) 提升 5.9pp |
| SWE-Atlas Codebase QnA | 59.4% | 检验大型代码仓深度语义理解与检索问答能力 |
| MRCR v2 (512K-1M) | 98.1% | 在 1M 上下文超长程检索测试中维持高准确率召回 |
| 定价 | $1.25 / $4.25 每 MTok | Meta Model API / OpenRouter 输入 $1.25 / 输出 $4.25 每百万 tokens |
