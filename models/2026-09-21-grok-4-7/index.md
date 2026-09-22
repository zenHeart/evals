---
vendor: xai
model: Grok 4.7
release: grok-4-7
date: 2026-09-21
source: https://x.ai/news/grok-4-7
fetched_at: 2026-09-22
---

# Grok 4.7（2026-09-21 xAI 旗舰编码与知识工作模型）

xAI 于 2026-09-21 在 `https://x.ai/news/grok-4-7` 正式发布 **Grok 4.7**，定位为其最强编码与知识工作前沿基座。模型基于 2.1T 参数底座，聚焦多小时长程任务强化学习与自校验。

## 模型规格

- 架构参数：2.1T 总参数
- 上下文窗口：500,000 Token (500K)
- 模态：文本、代码、图像
- 定价：输入 $2.00 / M tokens，输出 $6.00 / M tokens（另设 2x 速度的 Fast 变体，价格翻倍）
- 分发方式：xAI API、Cursor、Grok Build、企业级模型路由

## 评测数据

| 评测基准 | Grok 4.7 (High effort) | 指标类型 | 备注 |
|---|---:|---|---|
| CursorBench 4.0 | 46.3% | pass_rate | 长程自主编码与多文件项目编辑 |
| DeepSWE v1.1 | 71.0% | pass_rate | SWE 真实 GitHub Issue 自动化解决 |
| EEBench (电气工程) | 64.0% | accuracy | 领域工程专业推理 |
| AA Briefcase v1.1 | 1,657 | elo | Artificial Analysis 办公智能体综合指数 |
| Terminal-Bench 4.0 | 38.0% | pass_rate | 终端命令行与操作系统复杂交互 |
| HealthBench Professional | 56.7% | accuracy | 专业医学与临床健康推理 |
| Harvey Legal Agent Benchmark | 19.6% | accuracy | 复杂法律工作流与合规智能体评测 |
| LatchBio Biosafety | 62.4% | accuracy | 生物安全基准测试 |
| HackerBench v0.3 Dual-Use | 3.3% | risky_rate | 双重用途网络攻击风险准入率（越低越安全） |
