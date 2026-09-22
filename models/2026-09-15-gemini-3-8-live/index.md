---
vendor: google
model: Gemini 3.8 Live / Gemini 3.8 Live Extended Thinking
release: gemini-3-8-live
date: 2026-09-15
source: https://blog.google/technology/ai/gemini-3-8-live/
fetched_at: 2026-09-22
---

# Gemini 3.8 Live / Extended Thinking（2026-09-15 Google 原生语音对话与推理模型）

Google DeepMind 于 2026-09-15 在 `https://blog.google/technology/ai/gemini-3-8-live/` 正式发布 **Gemini 3.8 Live** 与 **Gemini 3.8 Live Extended Thinking**，定位为其最先进的原生语音对话与实时智能体模型。

## 模型规格

- 上下文窗口：1M 输入 / 64K 输出
- 模态：文本、音频、图像、视频（端到端原生语音到语音）
- 定价：音频输入 $0.005/min ($0.84/hr)，音频输出 $0.018/min
- 关键特性：异步工具调用、实时视觉对齐、97+ 语言无缝切换、会话中后台深度推理（Extended Thinking）

## 评测数据

| 评测基准 | Gemini 3.8 Live Extended Thinking | 指标类型 | 备注 |
|---|---:|---|---|
| AA Speech-to-Speech Quality Index | 82.6 | quality_index | Artificial Analysis 语音对话评测综合榜首 |
| τ-Voice (Tau-Voice) Agentic Benchmark | 68.6% | task_completion | 语音智能体自主任务完成率 |
| Sierra τ-Voice-Banking Benchmark | 35.1% | task_completion | 银行高合规客服复杂业务场景 |
| Big Bench Audio | 97.7% | accuracy | 复杂音频推理与理解准确率 |
