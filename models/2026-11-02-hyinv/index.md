---
vendor: tencent
model: HyInv
release: hyinv
date: 2026-11-02
source: https://github.com/Tencent-Hunyuan/Hyra-results/tree/main/AI4Science/hyinv
fetched_at: 2026-11-11
---

# HyInv（官方归档转录）

发布日期证据：官方仓 `Tencent-Hunyuan/Hyra-results` 的 README「## News」小节写明「**2026-11-02**: 🧬 Two protein models released with weights and code.」（date_precision=day）。来源：https://github.com/Tencent-Hunyuan/Hyra-results/tree/main/AI4Science/hyinv

官方定位：蛋白质逆折叠模型——给定目标骨架，生成能折叠成该结构的氨基酸序列；由腾讯混元的研究智能体 Hyra 2.0 从零训练（先随机解码顺序的自回归预训练，再做结构奖励强化学习）。

官方明示规格：

| 项 | 值 |
|---|---|
| 参数量 | 1,96 万（技术报告：1,957,573） |
| 架构 | 4 层编码器 + 3 层解码器（宽度 128），消息传递设计沿用 ProteinMPNN；输入 N / Cα / C / O 四类骨架原子，每个残基连 48 个近邻 |
| 采样 | 「先起草、再改写」：8 轮盲起草（T = 0.6）+ 8 轮分组改写（T = 0.34）；一个编码器前向 + 16 个解码器前向 |
| 训练 | 监督阶段 627,945 条序列（76,787 实验结构 + 551,158 预测结构）、85,000 次更新；强化学习阶段用 50,000 个经同源掩码过滤的骨架，每轮 256 个骨架各采样 32 条候选，奖励 = 0.95 scTM + 0.05 稳定性代理项，最终检查点为 update 640 |
| 推理 | 单张 H20 为 402 残基骨架设计 128 条序列 50.6 ms（BF16） |
| 权重 | model.safetensors（FP32，7.8 MB）+ config.json，随包分发 |
| 技术报告 | HyInv_Technical_Report.pdf（2026-10-14，本目录已归档） |
| 许可 | MIT（模型模块来自 ProteinMPNN，MIT） |
| API 定价 | 官方未给出（`null`） |

官方技术报告 Table 2 逐行转录（五个评测面板；竞品列只进备注）：

| 评测 | 分数 | 备注 |
|---|---:|---|
| CATH4.3 test · scTM（设计序列预测结构与输入骨架的 TM-score，越高越好） | 0.840 | 同列竞品：ProteinZero V2 0.833、ProteinMPNN 0.826；面板规模 1,882 chains |
| CATH4.3 test · 序列多样性（同一目标的设计序列两两平均差异，越高越好） | 0.331 | 同列竞品：ProteinZero V2 0.315、ProteinMPNN 0.314；面板规模 1,882 chains |
| CATH4.3 test · 天然序列回收率（越高越好） | 0.373 | 同列竞品：ProteinZero V2 0.379、ProteinMPNN 0.387；面板规模 1,882 chains |
| CATH4.2 test · scTM（设计序列预测结构与输入骨架的 TM-score，越高越好） | 0.855 | 同列竞品：ProteinZero V2 0.847、ProteinMPNN 0.844；面板规模 1,120 chains |
| CATH4.2 test · 序列多样性（同一目标的设计序列两两平均差异，越高越好） | 0.328 | 同列竞品：ProteinZero V2 0.317、ProteinMPNN 0.312；面板规模 1,120 chains |
| CATH4.2 test · 天然序列回收率（越高越好） | 0.382 | 同列竞品：ProteinZero V2 0.390、ProteinMPNN 0.398；面板规模 1,120 chains |
| TS500 · scTM（设计序列预测结构与输入骨架的 TM-score，越高越好） | 0.899 | 同列竞品：ProteinZero V2 0.895、ProteinMPNN 0.895；面板规模 500 chains |
| TS500 · 序列多样性（同一目标的设计序列两两平均差异，越高越好） | 0.266 | 同列竞品：ProteinZero V2 0.263、ProteinMPNN 0.264；面板规模 500 chains |
| TS500 · 天然序列回收率（越高越好） | 0.458 | 同列竞品：ProteinZero V2 0.460、ProteinMPNN 0.466；面板规模 500 chains |
| TS50 · scTM（设计序列预测结构与输入骨架的 TM-score，越高越好） | 0.920 | 同列竞品：ProteinZero V2 0.913、ProteinMPNN 0.907；面板规模 50 chains |
| TS50 · 序列多样性（同一目标的设计序列两两平均差异，越高越好） | 0.283 | 同列竞品：ProteinZero V2 0.280、ProteinMPNN 0.272；面板规模 50 chains |
| TS50 · 天然序列回收率（越高越好） | 0.440 | 同列竞品：ProteinZero V2 0.435、ProteinMPNN 0.445；面板规模 50 chains |
| RecentPDB · scTM（设计序列预测结构与输入骨架的 TM-score，越高越好） | 0.861 | 同列竞品：ProteinZero V2 0.850、ProteinMPNN 0.842；面板规模 121 chains / 111 entries / 26,766 residues |
| RecentPDB · 序列多样性（同一目标的设计序列两两平均差异，越高越好） | 0.309 | 同列竞品：ProteinZero V2 0.324、ProteinMPNN 0.307；面板规模 121 chains / 111 entries / 26,766 residues |
| RecentPDB · 天然序列回收率（越高越好） | 0.421 | 同列竞品：ProteinZero V2 0.415、ProteinMPNN 0.428；面板规模 121 chains / 111 entries / 26,766 residues |

官方技术报告 Table 1 逐行转录（推理耗时：单张 H20，多次重复取中位数，每请求 128 个设计；10,000 设计档为 250 残基骨架）：

| 评测 | 分数 | 备注 |
|---|---:|---|
| BF16 · 128 个设计 / 402 残基骨架 · 单步耗时（ms） | 50.6 | 同列竞品：ProteinMPNN 2,907、ProteinZero V2 2,918、HyInv, FP32 reference sampler 2,633、HyInv, exact FP32 path 303；官方表该行的相对倍数列为 57 × |
| BF16 · 128 个设计 / 148 残基骨架 · 单步耗时（ms） | 24.7 | 同列竞品：ProteinMPNN 1,071、ProteinZero V2 1,070、HyInv, FP32 reference sampler 999、HyInv, exact FP32 path 130；官方表该行的相对倍数列为 57 × |
| BF16 · 10,000 个设计 / 250 残基骨架 · 耗时（秒） | 2.1 | 同列竞品：ProteinMPNN 142.0、ProteinZero V2 141.4、HyInv, FP32 reference sampler 129.1、HyInv, exact FP32 path 14.5；官方表该行的相对倍数列为 57 × |
| 精确 FP32 路径 · 128 个设计 / 402 残基骨架 · 单步耗时（ms） | 303 | 同列竞品：ProteinMPNN 2,907、ProteinZero V2 2,918、HyInv, FP32 reference sampler 2,633、HyInv (BF16) 50.6；官方表该行的相对倍数列为 9.6 × |
| FP32 参考采样器 · 128 个设计 / 402 残基骨架 · 单步耗时（ms） | 2,633 | 同列竞品：ProteinMPNN 2,907、ProteinZero V2 2,918、HyInv, exact FP32 path 303、HyInv (BF16) 50.6；官方表该行的相对倍数列为 1.1 × |

官方技术报告 §6 应用章节逐行转录（散文中的绝对值）：

| 评测 | 分数 | 备注 |
|---|---:|---|
| de novo 骨架 · 「新颖且可折叠」设计占比（未加组成过滤） | 0.68 | 74 个 de novo 骨架；同口径竞品 ProteinMPNN 0.47、ProteinZero V2 0.45 |
| de novo 骨架 · 「新颖且可折叠」设计占比（加组成过滤） | 0.38 | 同上；同口径竞品 ProteinMPNN 0.05、ProteinZero V2 0.11 |
| pocket 约束文库 · 通过率（12 个 pocket 骨架均值） | 43% | 官方图中单个 148 残基骨架为 384 个设计中 373 个通过；图内数值不做视觉转写 |

未转录 / 未报告说明：

- Figure 1 / 3 / 5 / 6 / 7 / 8 / 9 / 10 / 11 为位图，其中的数值（含 Boltz2 与 Protenix2 下的 RecentPDB scTM、酶催化位点 RMSD、环重设计 scTM 等）按纪律不做视觉转写、不建行。
- 官方「平均 scTM 0.875」「快 57 倍 / 52.1 倍」「七个面板列均最高」为相对与名次口径，只写进备注。
- 官方 README 另给出 bf16 / exact / 参考实现三种路径在 148 与 402 残基下的中位耗时（约 25 / 54 ms、约 119 / 281 ms、999 / 2,633 ms），与技术报告 Table 1 的 24.7 / 50.6 ms 等同源，本档统一以技术报告表格为准，README 的约数进备注。
- 官方未给出 API 定价。
