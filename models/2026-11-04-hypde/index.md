---
vendor: tencent
model: HyPDE
release: hypde
date: 2026-11-04
source: https://github.com/Tencent-Hunyuan/Hyra-results/tree/main/AI4Science/hypde
fetched_at: 2026-11-11
---

# HyPDE（官方归档转录）

发布日期证据：官方仓 `Tencent-Hunyuan/Hyra-results` 的 README「## News」小节写明「**2026-11-04**: 🌊 HyPDE, a 2D foundation model for PDEs, released with weights and code.」（date_precision=day）。来源：https://github.com/Tencent-Hunyuan/Hyra-results/tree/main/AI4Science/hypde

官方定位：给定模拟场（速度、压力、密度、浓度、应力等）的最近 6 帧，预测后续 4 帧；套用自身输出即可预报任意长度轨迹。一套权重覆盖 13 个物理系统（声学散射、可压缩流、活性物质、反应扩散、球面浅水等）。

官方明示规格：

| 项 | 值 |
|---|---|
| 参数量 | 323M |
| 架构 | 24 层 Transformer（宽度 1024、16 头、SwiGLU），每帧按场类型卷积嵌入后切 patch，六帧拼成一个 token；无绝对位置，周期轴用轴向旋转位置编码 |
| 输入 / 输出 | 最近 6 帧 → 后续 4 帧（增量表示） |
| 训练 | 从头训练 27,280 步（9.15 × 10^10 tokens），32 张 NVIDIA H20 |
| 权重 | 官方仓 GitHub Release 资产（FP32，1.3 GB），`weights/download.sh` 下载并校验 sha256 |
| 许可 | Apache-2.0 |
| 上下文窗口 / 价格 | 官方未给出（`null`） |

官方评测数据逐行转录（官方 README「Recorded result」表：每格为 HyPDE / Walrus（比值），越低越好，加粗为该格更优者；本档只取自家列建行，竞品列进备注）：

| 评测 | 分数 | 备注 |
|---|---:|---|
| Acoustic scattering, discontinuous · One-step | 0.00342 | Walrus 0.00578（原文比值 0.59；本格 HyPDE 为更优者）；测试轨迹数 200 |
| Acoustic scattering, discontinuous · T[1:20] | 0.0164 | Walrus 0.0240（原文比值 0.68；本格 HyPDE 为更优者）；测试轨迹数 200 |
| Acoustic scattering, discontinuous · T[21:60] | 0.0558 | Walrus 0.155（原文比值 0.36；本格 HyPDE 为更优者）；测试轨迹数 200 |
| Acoustic scattering, inclusions · One-step | 0.0111 | Walrus 0.0164（原文比值 0.68；本格 HyPDE 为更优者）；测试轨迹数 400 |
| Acoustic scattering, inclusions · T[1:20] | 0.0501 | Walrus 0.0636（原文比值 0.79；本格 HyPDE 为更优者）；测试轨迹数 400 |
| Acoustic scattering, inclusions · T[21:60] | 0.132 | Walrus 0.169（原文比值 0.78；本格 HyPDE 为更优者）；测试轨迹数 400 |
| Acoustic scattering, maze · One-step | 0.0146 | Walrus 0.0443（原文比值 0.33；本格 HyPDE 为更优者）；测试轨迹数 200 |
| Acoustic scattering, maze · T[1:20] | 0.0556 | Walrus 0.163（原文比值 0.34；本格 HyPDE 为更优者）；测试轨迹数 200 |
| Acoustic scattering, maze · T[21:60] | 0.0894 | Walrus 0.255（原文比值 0.35；本格 HyPDE 为更优者）；测试轨迹数 200 |
| Active matter · One-step | 0.0251 | Walrus 0.0132（原文比值 1.91；本格 Walrus 为更优者）；测试轨迹数 26 |
| Active matter · T[1:20] | 0.460 | Walrus 0.242（原文比值 1.90；本格 Walrus 为更优者）；测试轨迹数 26 |
| Active matter · T[21:60] | 1.41 | Walrus 1.32（原文比值 1.07；本格 Walrus 为更优者）；测试轨迹数 26 |
| Euler multi-quadrants, open · One-step | 0.0200 | Walrus 0.0238（原文比值 0.84；本格 HyPDE 为更优者）；测试轨迹数 500 |
| Euler multi-quadrants, open · T[1:20] | 0.0881 | Walrus 0.106（原文比值 0.83；本格 HyPDE 为更优者）；测试轨迹数 500 |
| Euler multi-quadrants, open · T[21:60] | 0.368 | Walrus 0.442（原文比值 0.83；本格 HyPDE 为更优者）；测试轨迹数 500 |
| Euler multi-quadrants, periodic · One-step | 0.0293 | Walrus 0.0396（原文比值 0.74；本格 HyPDE 为更优者）；测试轨迹数 32 |
| Euler multi-quadrants, periodic · T[1:20] | 0.101 | Walrus 0.147（原文比值 0.69；本格 HyPDE 为更优者）；测试轨迹数 32 |
| Euler multi-quadrants, periodic · T[21:60] | 0.397 | Walrus 0.611（原文比值 0.65；本格 HyPDE 为更优者）；测试轨迹数 32 |
| FlowBench FPO harmonics · One-step | 0.00121 | Walrus 0.00141（原文比值 0.86；本格 HyPDE 为更优者）；测试轨迹数 40 |
| FlowBench FPO harmonics · T[1:20] | 0.0157 | Walrus 0.0201（原文比值 0.78；本格 HyPDE 为更优者）；测试轨迹数 40 |
| FlowBench FPO harmonics · T[21:60] | 0.0618 | Walrus 0.0907（原文比值 0.68；本格 HyPDE 为更优者）；测试轨迹数 40 |
| Gray-Scott reaction-diffusion · One-step | 0.000326 | Walrus 0.000311（原文比值 1.05；本格 Walrus 为更优者）；测试轨迹数 120 |
| Gray-Scott reaction-diffusion · T[1:20] | 0.0196 | Walrus 0.0397（原文比值 0.50；本格 HyPDE 为更优者）；测试轨迹数 120 |
| Gray-Scott reaction-diffusion · T[21:60] | 0.0874 | Walrus 0.211（原文比值 0.41；本格 HyPDE 为更优者）；测试轨迹数 120 |
| Helmholtz staircase · One-step | 0.000352 | Walrus 0.00122（原文比值 0.29；本格 HyPDE 为更优者）；测试轨迹数 48 |
| Helmholtz staircase · T[1:20] | 0.0101 | Walrus 0.00965（原文比值 1.05；本格 Walrus 为更优者）；测试轨迹数 48 |
| Helmholtz staircase · T[21:60] | 0.0230 | Walrus 0.0208（原文比值 1.10；本格 Walrus 为更优者）；测试轨迹数 48 |
| PlanetSWE · One-step | 0.00121 | Walrus 0.000570（原文比值 2.12；本格 Walrus 为更优者）；测试轨迹数 12 |
| PlanetSWE · T[1:20] | 0.0230 | Walrus 0.00715（原文比值 3.21；本格 Walrus 为更优者）；测试轨迹数 12 |
| PlanetSWE · T[21:60] | 0.155 | Walrus 0.0384（原文比值 4.04；本格 Walrus 为更优者）；测试轨迹数 12 |
| Rayleigh-Bénard · One-step | 0.0147 | Walrus 0.0164（原文比值 0.90；本格 HyPDE 为更优者）；测试轨迹数 175 |
| Rayleigh-Bénard · T[1:20] | 0.0281 | Walrus 0.102（原文比值 0.28；本格 HyPDE 为更优者）；测试轨迹数 175 |
| Rayleigh-Bénard · T[21:60] | 0.709 | Walrus 0.686（原文比值 1.03；本格 Walrus 为更优者）；测试轨迹数 175 |
| Shear flow · One-step | 0.00142 | Walrus 0.00152（原文比值 0.94；本格 HyPDE 为更优者）；测试轨迹数 112 |
| Shear flow · T[1:20] | 0.0143 | Walrus 0.0176（原文比值 0.81；本格 HyPDE 为更优者）；测试轨迹数 112 |
| Shear flow · T[21:60] | 0.0708 | Walrus 0.0683（原文比值 1.04；本格 Walrus 为更优者）；测试轨迹数 112 |
| Turbulent radiative layer · One-step | 0.176 | Walrus 0.115（原文比值 1.53；本格 Walrus 为更优者）；测试轨迹数 9 |
| Turbulent radiative layer · T[1:20] | 0.485 | Walrus 0.522（原文比值 0.93；本格 HyPDE 为更优者）；测试轨迹数 9 |
| Turbulent radiative layer · T[21:60] | 0.825 | Walrus 1.05（原文比值 0.79；本格 HyPDE 为更优者）；测试轨迹数 9 |

官方同表末行汇总：one-step 9 of 13、T[1:20] 10 of 13、T[21:60] 8 of 13（胜出计数属相对口径，只写进备注、不另建行）。

未转录 / 未报告说明：

- 官方「Datasets」节的网格尺寸、场清单与边界条件表为数据集元信息，不是评测数值，不转录为分数。
- 官方未给出该模型的评测百分数、上下文长度与定价。
- 「比 Walrus 快 N 倍」一类相对表述只出现在官方博客与官方仓 News 条目里，按纪律不建行。
