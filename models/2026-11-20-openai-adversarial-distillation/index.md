---
vendor: openai
model: GPT-6 Astra（以及 GPT-6.2 Astra）
release: backfill-source
date: 2026-11-20
source: https://openai.com/index/combatting-adversarial-distillation
fetched_at: 2026-11-26
---

# Combatting adversarial distillation（OpenAI 官网研究文章证据归档）

发布日期证据链：OpenAI 官方 RSS（`openai.com/news/rss.xml`）的 `pubDate` 为 **2026-11-20**；正文页面标题下方的印刷日期同为 **November 20, 2026**，两处互证，`date_precision=day`。

本页不是模型发布页——它讲的是 OpenAI 如何检测与阻断「对抗性蒸馏」，涉及 GPT‑6 Astra 与 GPT‑6.2 Astra / GPT‑6.2 Sol 的**防护措施**。本归档只作为**一条新增 evidence 的来源**：官方在一句明文里给出两个绝对数值——推理护取攻击成功率从 GPT‑6 Astra（原始防护）的 **54.0%** 降到 GPT‑6.2 Astra（更新后防护）的 **0.2%**。

- 官方原文页：https://openai.com/index/combatting-adversarial-distillation
- 官方 RSS 条目：`pubDate` 2026-11-20

## 取数章节（原文明文）

官方页第 11 节「Resistance to reasoning extraction」写明：

> We've strengthened our defenses against protected reasoning extraction in GPT‑6.2 Astra and GPT‑6.2 Sol. In an internal adaptive evaluation using strong automated red-teaming, we tested whether attackers could recover protected reasoning the model had generated while answering an earlier prompt. **The average attack success rate fell from 54.0% against GPT‑6 Astra with its original safeguards to 0.2% against GPT‑6.2 Astra with its updated safeguards.**

该句给出两个绝对分值（54.0% / 0.2%），是 DOM 明文散文（不是位图），故按「DOM 机读行」口径记 `verified`。

## 官方评测转录表

| 模型 | 防护状态 | 平均推理护取攻击成功率 | 备注 |
|---|---|---:|---|
| GPT‑6 Astra | 原始防护（original safeguards） | 54.0% | 本仓既有 release `gpt-6-astra` 的追加行 |
| GPT‑6.2 Astra | 更新后防护（updated safeguards） | 0.2% | 本仓既有 release `gpt-6-2-astra-and-sol` 的追加行（对应模型 gpt-6-2-astra） |

## 协议与口径（官方明示的部分）

- 评测类型：**internal adaptive evaluation**（官方内部自适应评测），攻击方是 **strong automated red-teaming**（强力自动红队）。
- 攻击目标：攻击者尝试从模型对**先前 prompt** 生成的输出里恢复出「受保护的推理」（protected reasoning）。
- 主指标：平均攻击成功率（average attack success rate），**越低越好**。
- 官方未印 temperature / top_p / 推理档位 / 运行次数 / 攻击预算等具体数值，protocol 对应键一律 null。
- 官方未公开该内部评测的题集与判分细则，故本条不建 benchmark 实体，按 `new-benchmark` 由兜底页承载。

## 同页其余内容（不入账本）

- 页面另有一张 ExploitBench 柱状图（官方 RSC vega 载荷可机读），横轴是训练算力预算 4,096–524,288，纵轴是 ExploitBench 得分，分「Reasoning Summaries / Exact Reasoning Traces」两组训练数据 × 「After Fine-tuning / After RL」两个阶段共 32 个数据点。**该图度量的是攻击方蒸馏出的学生模型，不是任何已发布模型**，无法挂到本仓任何 release 的自家模型列，故不建 evidence 行。
- 正文关于「蒸馏是安全议题」「保护精确推理链对网络安全的重要性」的论述为定性说明，不含绝对分值，不建行。
