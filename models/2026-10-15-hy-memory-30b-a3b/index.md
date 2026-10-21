---
vendor: tencent
model: Hy-Memory-30B-A3B
release: hy-memory-30b-a3b
date: 2026-10-15
source: https://huggingface.co/tencent/Hy-Memory-30B-A3B
fetched_at: 2026-10-21
---

# Hy-Memory-30B-A3B

发布日期证据：Hugging Face 官方模型仓创建于 2026-10-15，配套技术报告 arXiv:2610.22196 的提交日为 2026-10-15（Submitted on 15 Oct 2026），官方 GitHub 仓 Tencent-Hunyuan/Hy-Memory 同批开源，三者互证。

腾讯混元发布 **Hy-Memory-30B-A3B** 记忆写入模型，官方模型卡把它定位为在记忆系统中负责「写入」的一环：通过两阶段训练（OPD 阶段提供学生自写状态链的密集教师监督，RL 阶段按 chunk 级信用分配并把选中的记忆库跨窗口传递）学习如何沉淀可复用记忆。

官方明示规格：

| 项 | 值 |
|---|---|
| 参数规模 | 30B 总参数 / 3B 激活（MoE） |
| 角色 | 记忆写入模型（memory writer） |
| 训练 | 两阶段：OPD（密集教师监督）+ RL（chunk 级信用分配） |
| 配套开源 | 官方 GitHub 仓 Tencent-Hunyuan/Hy-Memory、模型权重、配置与技术报告 arXiv:2610.22196 |
| 评估框架 | Mem0、Hy-Memory、MemOS、EverMemOS（后者对模型完全留出） |
| 评估样本 | 主矩阵每项基准固定 20% 子样本；harness 分为六项指标等权平均 |

官方 Table 1（跨 harness 六项指标均值，越高越好）：

| 记忆写入模型 | Mem0 | Hy-Memory | MemOS | EverMemOS | 均值 |
|---|---:|---:|---:|---:|---:|
| **Hy-Memory-30B-A3B** | **54.02** | **60.55** | **50.51** | **56.89** | **55.49** |
| Claude Opus 5 | 53.43 | 60.53 | 50.50 | 54.04 | 54.62 |
| DeepSeek V4.1 Flash | 49.73 | 60.20 | 49.17 | 55.47 | 53.64 |
| Hy3 | 45.99 | 58.06 | 50.19 | 52.30 | 51.63 |
| Qwen3.6-35B-A3B | 47.51 | 55.87 | 47.36 | 50.75 | 50.37 |
| Hy3-A3B Base | 40.20 | 50.39 | 49.05 | 50.98 | 47.66 |
| Qwen3-30B-A3B | 39.81 | 45.67 | 45.44 | 46.57 | 44.37 |

六项指标为 LoCoMo Judge、LongMemEval（LME）、PersonaMem-v2（PM-v2）、Travel SPS、Shopping PS、Code Memory Bench（CMB）；CMB 本身是两个仓库问答子评测的等权平均。四套 harness 下的六项指标明细见官方模型卡 Table 2–5，完整数值已随本档逐行收录。
