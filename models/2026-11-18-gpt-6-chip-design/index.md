---
vendor: openai
model: GPT-6 Astra / GPT-6.2 Astra
release: gpt-6-chip-design
date: 2026-11-18
source: https://openai.com/index/advancing-chip-design-with-our-models/
fetched_at: 2026-11-24
---

# Advancing chip design with OpenAI models（OpenAI 官方研究文证据归档）

发布日期证据链：官方 RSS `https://openai.com/news/rss.xml` 的 pubDate「Wed, 18 Nov 2026 00:00:00 GMT」，与页面印刷日「November 18, 2026」双源互证，`date_precision=day`。

- 官方发布文：https://openai.com/index/advancing-chip-design-with-our-models/ （`page.html`，原始 HTML 未改动存档）
- 页面分类：Research

## 官方定位（原文要点）

- 「OpenAI’s models are quickly improving the chips that power AI.」
- 官方称在两个开源处理器设计上评测了连续几代模型的能力，并与 Synopsys 合作把前沿智能接入 EDA 工具链。
- RSS 摘要：「OpenAI models optimized circuits used in Jalapeño silicon and improved RISC‑V core designs, showing progress in AI-assisted chip design with GPT‑6 Astra.」

## 评测转录表（官方发布文正文散文明文，逐句机读）

| 评测 | 分数 | 备注 |
|---|---|---|
| 相对重优化基线的 PPA 改进幅度（旗舰 GPU IP） | 最高 14% | new-benchmark: gpt6-chip-ppa-gpu-ip；官方表述为 up to 14%（最高值，非均值） |
| AMD 下一代旗舰 CPU 关键模块的 PPA 提升 | （未披露具体数值） | new-benchmark: gpt6-chip-ppa-cpu-blocks；官方只给定性表述 single-digit percentage gains |
| PicoRV32 内核 RTL 优化 | （图表，待读图核验） | 指标：隐藏工作负载上的 IPC 几何均值 × 最高时钟频率估计 |
| Ibex 内核 RTL 优化 | （图表，待读图核验） | 同上 |
| PicoRV32 由规格生成 RTL | （图表，待读图核验） | 同上 |
| Ibex 由规格生成 RTL | （图表，待读图核验） | 同上 |

## 未转录区块说明

- Jalapeño 芯片的 PPA 改进（乘法器与加法器各约 15% 面积下降、向量单元约 13%、矩阵单元约 10%）官方明确归于 2025 年初启用的 GPT-o3 mini，属另一代次模型，不在本批建档范围，按跳过清单记录，未建 evidence 行。
- 四张 RISC-V 图表的逐点数值只在图表数据系列中，坐标轴与单位未在正文文字声明，本批不据图表推断量纲，对应 4 行记 pending + not_extracted，位图与原始 HTML 已存档。
