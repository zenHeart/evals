---
vendor: tencent
model: HyFF
release: hyff
date: 2026-11-02
source: https://github.com/Tencent-Hunyuan/Hyra-results/tree/main/AI4Science/hyff
fetched_at: 2026-11-11
---

# HyFF（官方归档转录）

发布日期证据：官方仓 `Tencent-Hunyuan/Hyra-results` 的 README「## News」小节写明「**2026-11-02**: ⚛️ HyFF force fields released with weights and code.」（date_precision=day）。来源：https://github.com/Tencent-Hunyuan/Hyra-results/tree/main/AI4Science/hyff

官方定位：五档机器学习原子间势（presto → largo），单结构推理、分子动力学与批量预测共用同一 `hyff` Python 包；覆盖 83 种元素（H→Bi），把总电荷与自旋多重度作为输入，在 OMol25 上训练。

官方明示规格：

| 项 | 值 |
|---|---|
| 五档参数量 | presto 2.31 M / vivace 6.66 M / moderato 34.8 M / andante 175 M / largo 1.20 B |
| 每原子激活参数量 | 0.05 M / 0.16 M / 0.83 M / 5.0 M / 34 M |
| 元素覆盖 | 83 种（H 到 Bi） |
| 训练数据 | OMol25 |
| 架构 | 平滑、保守的消息传递势；原子携带标量/矢量/二阶笛卡尔张量特征（l ≤ 2），按层截断平滑关闭消息，每元素专家网络更新原子特征，力为能量的精确负梯度；andante 与 largo 增加边框架混合块，largo 另加基于注意力的总电荷与自旋嵌入及可学习潜在电荷静电项 |
| 权重体积 | 9.3 MB / 26.7 MB / 139 MB / 700 MB / 4.81 GB（`hyff-v0.2.0` Release 资产） |
| 技术报告 | paper/HyFF_Technical_Report.pdf |
| 许可 | Apache-2.0 |
| 上下文窗口 / 价格 | 官方未给出（`null`） |

官方评测数据逐行转录（官方 README「Recorded result」表：每格为官方自报数值，竞品列与相对结论只进备注）：

| 评测 | 分数 | 备注 |
|---|---:|---|
| 力误差 MAE（meV/Å）· presto | 47.7 | OMol25 全量验证集 2,762,021 个结构；参数量 2.31 M，每原子激活 0.05 M |
| 能量误差 MAE（meV/atom）· presto | 5.78 | 同上验证集与协议 |
| 分子动力学单步耗时（ms/step）· presto | 0.71 | 2,586 原子水溶体系（chorismate in water），单张 NVIDIA H20，1 fs NVE + 键长约束，含邻居表重建 |
| 分子动力学日推进量（ns/day）· presto | 121 | 同上口径；与单步耗时互为换算 |
| 力误差 MAE（meV/Å）· vivace | 33.5 | OMol25 全量验证集 2,762,021 个结构；参数量 6.66 M，每原子激活 0.16 M |
| 能量误差 MAE（meV/atom）· vivace | 4.36 | 同上验证集与协议 |
| 分子动力学单步耗时（ms/step）· vivace | 1.27 | 2,586 原子水溶体系（chorismate in water），单张 NVIDIA H20，1 fs NVE + 键长约束，含邻居表重建 |
| 分子动力学日推进量（ns/day）· vivace | 68 | 同上口径；与单步耗时互为换算 |
| 力误差 MAE（meV/Å）· moderato | 16.5 | OMol25 全量验证集 2,762,021 个结构；参数量 34.8 M，每原子激活 0.83 M |
| 能量误差 MAE（meV/atom）· moderato | 1.36 | 同上验证集与协议 |
| 分子动力学单步耗时（ms/step）· moderato | 4.04 | 2,586 原子水溶体系（chorismate in water），单张 NVIDIA H20，1 fs NVE + 键长约束，含邻居表重建 |
| 分子动力学日推进量（ns/day）· moderato | 21 | 同上口径；与单步耗时互为换算 |
| 力误差 MAE（meV/Å）· andante | 7.65 | OMol25 全量验证集 2,762,021 个结构；参数量 175 M，每原子激活 5.0 M；正文另述 UMA-S-1.2 为 7.55，速度为其 29 倍 |
| 能量误差 MAE（meV/atom）· andante | 0.620 | 同上验证集与协议 |
| 分子动力学单步耗时（ms/step）· andante | 29.5 | 2,586 原子水溶体系（chorismate in water），单张 NVIDIA H20，1 fs NVE + 键长约束，含邻居表重建 |
| 分子动力学日推进量（ns/day）· andante | 2.9 | 同上口径；与单步耗时互为换算 |
| 力误差 MAE（meV/Å）· largo | 5.79 | OMol25 全量验证集 2,762,021 个结构；参数量 1.20 B，每原子激活 34 M；正文另述 DPA4-Pro 为 0.380，速度为其 9.7 倍 |
| 能量误差 MAE（meV/atom）· largo | 0.364 | 同上验证集与协议 |
| 分子动力学单步耗时（ms/step）· largo | 125 | 2,586 原子水溶体系（chorismate in water），单张 NVIDIA H20，1 fs NVE + 键长约束，含邻居表重建 |
| 分子动力学日推进量（ns/day）· largo | 0.69 | 同上口径；与单步耗时互为换算 |

未转录 / 未报告说明：

- 官方「Input format」节的输入字段表为接口说明，不是评测数值，不转录为分数。
- 官方未给出上下文长度与 API 定价。
- 「速度快 N 倍」「帕累托前沿」一类相对与名次口径只进备注、不建行。
- 官方 HyFF 技术报告 PDF 未随本批取回（其数值已在官方 README 表中完整给出），需要逐图复核时再补。
