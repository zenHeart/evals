---
vendor: tencent
model: WePM 1.0 家族（2B / 4B）
release: wepocketmodel-1-0
date: 2026-11-23
source: https://huggingface.co/tencent/WePocketModel1.0-4B
fetched_at: 2026-11-25
---

# WePM 1.0 家族（腾讯官方模型卡证据归档）

发布日期证据链：官方 GitHub 仓 Tencent/WePocketModel 的 News 段印刷日期「**2026-11-23** · **WePM 1.0 is now open source.**」；官方模型仓 tencent/WePocketModel1.0-4B 的 lastModified 2026-11-23T11:23:08Z（同日）。两处互证，`date_precision=day`。技术报告 arXiv:2611.27365 的 v1 提交时间为 2026-11-20（论文先于开源），官方模型仓 createdAt 2026-11-17 为发布前预置，故发布日取官方仓印刷日期。

- 官方模型卡（4B）：https://huggingface.co/tencent/WePocketModel1.0-4B （`model-card.md`）
- 官方代码仓：https://github.com/Tencent/WePocketModel （`github-readme.md`）
- 官方技术报告：https://arxiv.org/abs/2611.27365

## 官方定位（原文要点）

- WePM 1.0 是端侧统一多模态模型：用同一个共享的视觉-语言主干同时做嵌入、生成与带类型决策（JEV）三类任务，替代「生成模型 + 嵌入模型 + 决策模型」三模型串联。
- 官方自定义 **HCD（Heterogeneous Capability Density）**：`HCD =（达到可用阈值的能力族数 × 能力总质量）÷ 常驻推理显存`；官方说明「A higher HCD therefore indicates that a model delivers broader and stronger usable intelligence per unit of resident memory」。

## 评测转录表（官方散文明文，机读）

| 指标 | WePM-4B | 备注 |
|---|---|---|
| 30 项嵌入基准平均分 | 72.86 | 官方技术报告摘要 |
| 39 项生成基准平均分 | 62.41 | 官方技术报告摘要 |
| 7 项带类型决策（JEV）基准平均分 | 61.11 | 官方技术报告摘要 |
| Joint 分数（五组联合评测） | 52.74 | 官方技术报告摘要；对照基线 38.15 |
| HCD | 0.244 | 官方代码仓；配 65.1% 调和性能、约 8 GB BF16 权重显存 |
| 调和性能 | 65.1% | 官方代码仓；原文为 approximately |

官方代码仓 HCD 段落对照：六个独立三模型组合需约 21–43 GB 显存、调和性能约 64.2–64.8%、HCD 0.045–0.092，官方称 WePM-4B 相对它们高约 2.7–5.4 倍 HCD；技术报告摘要另给「相对 HCD 最高的独立模型栈少 61.9% 常驻权重显存、HCD 高 2.64 倍」的口径。两处数字出自同一发布的不同段落，差异源于对照集合不同，本仓按各自出处如实记录、不做调和。

## 限制

- 30 / 39 / 7 项基准的逐基准成绩与 HCD 对比图均以位图给出（`assert/wepm_single_results.png` 等），本批不做读图转写、不建逐基准 verified 行。
- 嵌入 / 生成 / 决策三档平均分是多项基准的均值口径，不是单一基准绝对分。
- 官方未印上下文长度，context_window 留 null；未印 temperature / top_p / 运行次数，protocol 对应字段一律 null。
