---
vendor: tencent
model: Hy-MT3 家族（1.8B / 7B / 30B-A3B）
release: hy-mt3
date: 2026-11-24
source: https://huggingface.co/tencent/Hy-MT3-30B-A3B
fetched_at: 2026-11-25
---

# Hy-MT3 家族（腾讯官方模型卡证据归档）

发布日期证据链：官方 Hugging Face 模型卡 News 段印刷日期「2026.11.24 We open-sourced Hy-MT3-1.8B/Hy-MT3-7B/Hy-MT3-30B-A3B on HuggingFace and ModelScope, and released TransRubric on GitHub.」；官方 GitHub 仓 Tencent-Hunyuan/Hy-MT3 的 News 段同样印 2026.11.24；官方模型仓 lastModified 2026-11-24T07:02:57Z。三处互证，`date_precision=day`。技术报告 arXiv:2611.27673 的 v1 提交时间为 2026-11-20（论文先于权重公开），官方模型仓 createdAt 2026-11-17 为发布前预置，故发布日取模型卡与官方仓印刷日期，不取论文日。

- 官方模型卡（旗舰档）：https://huggingface.co/tencent/Hy-MT3-30B-A3B （`model-card.md`）
- 官方代码仓：https://github.com/Tencent-Hunyuan/Hy-MT3 （`github-readme.md`）
- 官方技术报告：https://arxiv.org/abs/2611.27673

## 官方定位（原文要点）

- 「Hy-MT3 is a family of multilingual translation models that is more accurate, more complete, and more faithful to user constraints.」
- 官方称语言覆盖从 Hy-MT2 的 38 种扩展到 102 种；「WildMTBench-202611 is built from the latest real-world scenario data」；「IFMTBench measures translation instruction following」。
- 官方结果图注：「General Translation and WildMTBench-202611 are scored by TransRubric. (T) denotes thinking mode; all other models, including Hy-MT3, are run in non-thinking mode.」

## 规格（模型卡明示）

| 型号 | 架构 | 上下文窗口 | 权重 |
|---|---|---|---|
| Hy-MT3-1.8B | 1.8B dense | 8192 tokens | Apache-2.0 |
| Hy-MT3-7B | 7B dense | 8192 tokens | Apache-2.0 |
| Hy-MT3-30B-A3B | 30B 总参数 / 约 3B 激活（MoE） | 8192 tokens | Apache-2.0 |

## 评测转录表

官方结果图 `images/main_result.png`（Group Translation / WildMTBench-202611 / IFMTBench 三组，每组含 Hy-MT3 三个参数档与竞品柱）柱标签人工视觉转写，按口径记 pending：

| 基准 | Hy-MT3-30B-A3B | Hy-MT3-7B | Hy-MT3-1.8B |
|---|---|---|---|
| General Translation（FLORES-200 / FLORES-200 低资源 / WMT26 / 普通话⇄少数民族语言 的平均） | 88.50 | 86.12 | 75.05 |
| WildMTBench-202611 | 91.30 | 89.09 | 84.45 |
| IFMTBench | 86.66 | 83.66 | 68.34 |

官方散文明文（相对 Hy-MT2 的改进幅度，非绝对分）：

| 指标 | 数值 |
|---|---|
| 有误译样本占比下降 | 43% |
| 漏译 / 增译样本占比下降 | 74% |
| 指令遵循错误下降 | 40% |

## 限制

- 逐基准成绩全部以位图给出，本批只做视觉转写并记 pending，不翻 verified。
- 散文明文的 43% / 74% / 40% 是相对 Hy-MT2 的下降幅度，不是绝对基准分。
- 官方未印 temperature / top_p / 运行次数，protocol 对应字段一律 null。
