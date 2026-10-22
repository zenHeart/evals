---
vendor: doubao
model: Seed GR-RL
release: seed-gr-rl
date: 2025-12-02
source: https://seed.bytedance.com/en/gr_rl
fetched_at: 2026-10-22
---

# Seed GR-RL

发布日期证据：字节跳动 Seed 官方模型页 `https://seed.bytedance.com/en/gr_rl` 页头在模型名旁印出日期行 `December 2, 2025`（页面渲染后 DOM 原文），页面同时给出 Tech report 链接，构成一级来源的日期证据。

字节跳动 Seed 发布 **GR-RL**：一套机器人学习框架，把通用视觉-语言-动作（VLA）策略训练成擅长长时程灵巧操作（long-horizon dexterous manipulation）的专用策略。官方主张「人类演示的最优性」是现有 VLA 策略的核心假设，而 GR-RL 认为在灵巧高精度操作任务里人类演示可能嘈杂且次优。

官方明示规格：

| 项 | 值 |
|---|---|
| 形态 | 机器人强化学习框架 + 专用策略（不是通用对话/文本模型） |
| 训练三阶段 | ① 离线数据过滤 → ② 物理对称性增强 → ③ 在线转向强化学习 |
| 任务 | 穿鞋带（多鞋孔、需要长时程推理 + 毫米级精度 + 柔性物体交互） |
| 配套 | 官方 Tech report 链接（页面提供） |
| 在线 RL 探索量 | 约 150 条真实世界闭环探索与纠错轨迹 |

官方以「穿鞋带任务成功率」为自评指标，正文逐阶段给出明文数值（越高越好）：

| 阶段 | 官方自述成功率 |
|---|---:|
| 行为克隆基线（baseline） | 45.7% |
| 加入基于任务进度的数据过滤 | 61.6% |
| 再加入数据增强（镜像/物理对称性增强） | 72.7% |
| 再做在线强化学习微调（GR-RL 最终） | **83.3%** |

官方原文对最终值的限定：使用增强后的离线模型作为在线强化学习起点，GR-RL 的成功率在约 150 条真实世界闭环探索与纠错轨迹后升至 83.3%。

图片（`images/`）为官方页原图：

- `fig1-hero.jpg` — 官方 hero 图（标题 "GR-RL: Going Dexterous and Precise for Long-Horizon Robotic Manipulation"）
- `fig2-three-stage-pipeline.png` — 三阶段训练流程示意（Offline Filtered Behavior Cloning → Morphological Symmetry Augmentation → Online Reinforcement Learning）
- `fig3-architecture.png` — 架构示意（Vision-Language Model + Action Diffusion Transformer + Critic Transformer）
- `fig4-task-photo-a.jpg` / `fig5-task-photo-b.jpg` — 真实机器人任务实拍

未转录区块（说明）：

- 页面另有三张图表（各阶段成功率柱状图、在线微调逐 episode 成功信号与滑动平均曲线、各中间阶段成功率细分），其数值只存在于图片像素中，本批按纪律不转录为评测行，账本只收录正文明文的 83.3% 与消融链（45.7 → 61.6 → 72.7 → 83.3，消融链写入该行 notes）。
- 官方未给出任何标准公开基准（如 MMLU / SWE-bench）成绩：GR-RL 是具身智能策略模型，官方只自评自建任务的真实世界成功率。
