---
vendor: tencent
model: HyPLM-Flash
release: hyplm-flash
date: 2026-11-02
source: https://github.com/Tencent-Hunyuan/Hyra-results/tree/main/AI4Science/hyplm_flash
fetched_at: 2026-11-11
---

# HyPLM-Flash（官方归档转录）

发布日期证据：官方仓 `Tencent-Hunyuan/Hyra-results` 的 README「## News」小节写明「**2026-11-02**: 🧬 Two protein models released with weights and code.」（date_precision=day）。来源：https://github.com/Tencent-Hunyuan/Hyra-results/tree/main/AI4Science/hyplm_flash

官方定位：高效开源蛋白质语言模型，由腾讯混元的研究智能体 Hyra 2.0 从头训练；保留 ESM-2 的词表与输出头，可直接替换既有管线里的 ESM-2。

官方明示规格：

| 项 | 值 |
|---|---|
| 参数量 | 650M（技术报告：652 million parameters） |
| 架构 | 32 层、宽 1280、20 头的双向 Transformer（pre-norm RMSNorm + RoPE + per-head QK-norm + SwiGLU），MLM 输出头；词表 33 符号（沿用 ESM-2） |
| 训练数据 | UniRef90 + MGnify90 + UniParc + JGI IMG 非冗余蛋白组；训练用量 7260 亿 token（ESM-2 650M 的 0.73 倍） |
| 单序列长度 | 最长 8,190 残基 |
| 推理引擎 | 无填充批处理 + 融合 Triton kernel + INT8 矩阵乘；单张 H20 约 130,000 残基/秒（INT8）、约 90,000（BF16） |
| 权重 | FP32 两片共 2.6 GB，官方 GitHub Release 资产（`weights/download.sh` 下载并校验） |
| 技术报告 | HyPLM_Technical_Report.pdf（2026-10-12，本目录已归档） |
| 许可 | MIT |
| API 定价 | 官方未给出（`null`） |

官方评测数据逐行转录（官方技术报告 Table 2：冻结表征任务；加粗为该列最优；竞品列只进备注）：

| 评测 | 分数 | 备注 |
|---|---:|---|
| CB513 三态二级结构准确率 | 0.882 | 同列竞品：ESM-2 650M 0.844、ESM C 600M 0.851、E1-600M 0.880、DPLM-650M 0.842、ESM-1b 0.814、AMPLIFY-350M 0.797、ESM3-open 0.896 |
| ProteinNet 长程接触精度（L/5，序列间隔 ≥ 24） | 0.650 | 同列竞品：ESM-2 650M 0.392、ESM C 600M 0.434、E1-600M 0.645、DPLM-650M 0.394、ESM-1b 0.410、AMPLIFY-350M 0.210、ESM3-open 0.568 |
| 折叠预测准确率 | 0.322 | 同列竞品：ESM-2 650M 0.373、ESM C 600M 0.345、E1-600M 0.373、DPLM-650M 0.370、ESM-1b 0.362、AMPLIFY-350M 0.286、ESM3-open 0.408 |
| 酶学委员会（EC）酶功能预测 F max | 0.885 | 同列竞品：ESM-2 650M 0.888、ESM C 600M 0.886、E1-600M 0.881、DPLM-650M 0.882、ESM-1b 0.889、AMPLIFY-350M 0.865、ESM3-open 0.880 |
| GO 分子功能预测 F max | 0.661 | 同列竞品：ESM-2 650M 0.667、ESM C 600M 0.665、E1-600M 0.661、DPLM-650M 0.663、ESM-1b 0.659、AMPLIFY-350M 0.631、ESM3-open 0.664 |
| 10 类细胞定位准确率 | 0.794 | 同列竞品：ESM-2 650M 0.806、ESM C 600M 0.808、E1-600M 0.839、DPLM-650M 0.806、ESM-1b 0.793、AMPLIFY-350M 0.729、ESM3-open 0.750 |
| AAV 适配度（two-vs-many 切分）Spearman ρ | 0.650 | 同列竞品：ESM-2 650M 0.518、ESM C 600M 0.551、E1-600M 0.583、DPLM-650M 0.569、ESM-1b 0.544、AMPLIFY-350M 0.574、ESM3-open 0.551 |
| 淀粉酶适配度（one-to-many 切分）Spearman ρ | 0.696 | 同列竞品：ESM-2 650M 0.640、ESM C 600M 0.681、E1-600M 0.579、DPLM-650M 0.674、ESM-1b 0.653、AMPLIFY-350M 0.592、ESM3-open 0.618 |
| 荧光度适配度 Spearman ρ | 0.669 | 同列竞品：ESM-2 650M 0.664、ESM C 600M 0.663、E1-600M 0.660、DPLM-650M 0.668、ESM-1b 0.659、AMPLIFY-350M 0.660、ESM3-open 0.669 |
| Meltome 适配度（mixed split）Spearman ρ | 0.672 | 同列竞品：ESM-2 650M 0.633、ESM C 600M 0.670、E1-600M 0.690、DPLM-650M 0.623、ESM-1b 0.593、AMPLIFY-350M 0.585、ESM3-open 0.573 |
| 稳定性 Spearman ρ | 0.687 | 同列竞品：ESM-2 650M 0.639、ESM C 600M 0.706、E1-600M 0.712、DPLM-650M 0.746、ESM-1b 0.596、AMPLIFY-350M 0.579、ESM3-open 0.758 |

官方技术报告 Table 3 逐行转录（掩码残基似然：479 个留出 UniRef 蛋白 + 887 条 2026-09-02 后新增 PDB 链；越低越好）：

| 评测 | 分数 | 备注 |
|---|---:|---|
| 留出 UniRef 蛋白 · 掩码残基负对数似然（nats） | 1.698 | 同列竞品：ESM-2 650M 1.820、ESM C 600M 1.720、E1-600M 1.811、AMPLIFY-350M 1.743、DPLM-650M 1.961、ProtBERT 1.754、ESM-2 3B 1.667、ESM-2 15B 1.561、ESM C 6B 1.414 |
| 留出 UniRef 蛋白 · 困惑度 | 5.46 | 同列竞品：ESM-2 650M 6.17、ESM C 600M 5.59、E1-600M 6.11、AMPLIFY-350M 5.72、DPLM-650M 7.10、ProtBERT 5.77、ESM-2 3B 5.30、ESM-2 15B 4.76、ESM C 6B 4.11 |
| 2026-09-02 后新增 PDB 链 · 掩码残基负对数似然（nats） | 1.148 | 同列竞品：ESM-2 650M 1.591、ESM C 600M 1.478、E1-600M 1.560、AMPLIFY-350M 1.155、DPLM-650M 1.796、ProtBERT 1.105、ESM-2 3B 1.327、ESM-2 15B 1.162、ESM C 6B 1.054 |
| 2026-09-02 后新增 PDB 链 · 困惑度 | 3.15 | 同列竞品：ESM-2 650M 4.91、ESM C 600M 4.39、E1-600M 4.76、AMPLIFY-350M 3.17、DPLM-650M 6.03、ProtBERT 3.02、ESM-2 3B 3.77、ESM-2 15B 3.19、ESM C 6B 2.87 |

官方 README 首段与吞吐表逐行转录：

| 评测 | 分数 | 备注 |
|---|---:|---|
| ProteinGym 零样本 Spearman ρ（217 实验官方聚合） | 0.409 | 官方称与 ESM-2 650M、ESM C 600M、E1-600M 统计上打平（名次口径，只进备注） |
| 单卡 H20 嵌入吞吐（INT8，残基/秒） | about 130,000 | 官方用词 about（约数） |
| 单卡 H20 嵌入吞吐（BF16，残基/秒） | about 90,000 | 官方用词 about（约数） |

未转录 / 未报告说明：

- Figure 1a / 1b / 3a / 3b 为位图，其中的竞品数值无法逐格对应到模型名，按纪律不做视觉转写、不建行；正文的相对结论只写进备注。
- 官方未给出 API 定价。
- 口径差异照录：README 首段写 32 tasks，技术报告 Figure 1 与官方博客写 35 task splits。
