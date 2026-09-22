---
vendor: qwen
model: Qwen3.8-Omni-Flash
release: qwen3-8-omni-flash
date: 2026-09-18
source: https://qwen.ai/blog?id=qwen3.8-omni-flash
fetched_at: 2026-09-22
---

# Qwen3.8-Omni-Flash（2026-09-18 阿里全模态 Agentic 旗舰）

阿里通义千问团队于 2026-09-18 在 `https://qwen.ai/blog?id=qwen3.8-omni-flash` 正式发布 **Qwen3.8-Omni-Flash**，定位为具备 Agentic 交付能力的原生全模态模型。

## 模型规格

- 上下文窗口：1,000,000 Token (1M)
- 模态：文本、图像、音频、视频
- 核心特性：端到端音视频全双工交互、主动规划与工具调用、视频长程创作
- API 成本：音频输入降低 >98%，音视频输入降低 >93%

## 评测数据

| 评测基准 | 得分 | 指标类型 | 备注 |
|---|---:|---|---|
| UniClawBench | 69.6 | score | 原生全模态 Agent 综合任务 |
| OmniVideoBench (Agentic) | 67.8 | accuracy | 智能体交互模式下的长视频理解（节省 45.7% Token） |
| OmniVideoBench (Static) | 63.4 | accuracy | 静态传统单轮评测模式 |
| WildClawBench-MM | +36.5 | gain | 相较 Qwen3.5-Omni-Plus 提升 |
| AgenticVBench | +22.3 | gain | 相较 Qwen3.5-Omni-Plus 提升 |
