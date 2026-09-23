---
vendor: openai
model: GPT-6 Sol & GPT-6 Luna
release: gpt-6-sol-and-luna
date: 2026-09-22
source: https://openai.com/index/introducing-gpt-6-sol-and-luna/
fetched_at: 2026-09-23
---

# Introducing GPT-6 Sol and Luna

> 说明：OpenAI 官方博客公布 GPT-6 家族两款主力拓展模型 GPT-6 Sol 与 GPT-6 Luna。两款模型采用与 GPT-6 Astra 相似的训练方法，主打高性价比、代码与软件工程、长程自主 Agent、长上下文复用与高对齐性。API 定价较 GPT-5.6 相应版本大幅下调 50%，支持 1.05M 上下文与 90% 缓存读取折扣。

## 评测数据（转录）

| 评测基准 | 模型 | Effort / 条件 | 分数 / 表现 | 任务成本 | 官方说明与对比 |
| --- | --- | --- | --- | --- | --- |
| AutomationBench 1.0.6 | GPT-6 Sol | xhigh | 33.2% | $0.27 | 超越 Claude Opus 5 max effort (26.9%, $3.05) 与 Claude Fable 5.1 w/ fallback (31.4%, $2.45)，成本仅为其 9% |
| AutomationBench 1.0.6 | GPT-6 Luna | high | 14.5% | $0.021 | 相比 GPT-5.6 Luna (9.1%) 提升 5.4 个百分点，单任务成本降低 58% |
| AutomationBench 1.0.6 | GPT-6 Luna | max | 20.7% | $0.037 | 跨销售、营销、运营、财务等 47 项工具的长流程自动化业务流 |
| Agents' Last Exam V1 | GPT-6 Sol | max | 56.4% | $2.93 | 超越 Claude Opus 5 最高成绩 (55.9% / 52.7%, $9.76)，成本降低 60% |
| Agents' Last Exam V1 | GPT-6 Luna | max | 50.9% | $0.15 | 涵盖 55 个行业长周期经济价值计算机操作与专业任务 |
| DeepSWE 1.1 | GPT-6 Sol | max | 68.8% | $2.74 | 距 Claude Fable 5 最高分 (69.9% at xhigh, $13.41) 仅 1.1 个百分点，单任务成本降低约 80% |
| DeepSWE 1.1 | GPT-6 Luna | max | 66.6% | $0.22 | 匹敌 Claude Opus 5 与 Fable 5 medium effort 成绩，成本降低 93%~96% |
| FrontierCode 1.1 Main | GPT-6 Sol | max | 49.3% | $2.14 | 评测实际代码库的可合并性（mergeability，含测试质量、代码规范与作用域约束） |
| FrontierCode 1.1 Main | GPT-6 Sol | xhigh | 48.4% | $1.37 | 以显著更低的成本匹敌 Claude Fable 5.1 xhigh (48.7%) |
| FrontierCode 1.1 Main | GPT-6 Luna | max | 42.4% | $0.11 | 轻量级高吞吐模型展现强劲代码合并就绪度 |
| OSWorld 2.0 offline | GPT-6 Sol | xhigh | 60.5% | $2.21 | 达到与 Claude Opus 5 medium effort (60.3%, $12.67) 相当成绩，成本降低约 80% |
| OSWorld 2.0 offline | GPT-6 Sol | max | 64.4% | $3.25 | 离线集评测长周期日常与专业级真实电脑 GUI 操控任务 |
| OSWorld 2.0 offline | GPT-6 Luna | max | 52.7% | $0.27 | 超越前代主力 GPT-5.6 Sol medium (49.7%, $2.73)，成本仅为其十分之一 |
| 内部事实准确度 (Internal Factuality) | GPT-6 Sol | xhigh | 4.5% 错误率 | $0.13 | 基于用户反馈标记的事实错误真实对话集，错误率减半，越低越好 |
| 内部事实准确度 (Internal Factuality) | GPT-6 Luna | max | 7.6% 错误率 | $0.012 | 高推理预算下事实错误率达到 7.6%，匹配 GPT-5.6 Sol 水平但成本为其百分之一 |
| 内部编码欺瞒率 (Coding Deception) | GPT-6 Sol | max | 1.3% 欺瞒率 | - | 严苛诱导失实任务下的回答欺瞒率，相比 GPT-5.6 Sol (10.4%) 显著下降 |
| 内部编码欺瞒率 (Coding Deception) | GPT-6 Luna | max | 2.8% 欺瞒率 | - | 相比 GPT-5.6 Luna (9.5%) 显著下降 |
