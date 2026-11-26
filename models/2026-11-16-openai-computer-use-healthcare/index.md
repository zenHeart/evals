---
vendor: openai
model: GPT-6 Astra（以及 GPT-6.2 Astra）
release: backfill-source
date: 2026-11-16
source: https://openai.com/index/advancing-computer-use-for-healthcare-teams
fetched_at: 2026-11-26
---

# Advancing computer-use agents for healthcare teams（OpenAI 官网产品文章证据归档）

发布日期证据链：OpenAI 官方 RSS（`openai.com/news/rss.xml`）的 `pubDate` 为 **2026-11-16**；正文标题下方印刷日期同为 **November 16, 2026**，两处互证，`date_precision=day`。

本页不是模型发布页——它是 OpenAI 介绍医疗场景 computer-use 智能体（与 Abridge、Ambience、Cigna、CVS Health 等机构合作）的产品文章。本归档只作为**两条新增 evidence 的来源**：官方在「Evaluating helpfulness, safety, and cost」一节给出 GPT‑6 Astra 在自建「EHR Inbox 工作」评测上的两个绝对分值（临床安全 99%、医生评价「非常有帮助/极其有帮助」93%），同一数值同时出现在官方内嵌的 vega-lite 图表载荷里（DOM 机读），两处互证。

- 官方原文页：https://openai.com/index/advancing-computer-use-for-healthcare-teams
- 官方 RSS 条目：`pubDate` 2026-11-16

## 官方评测转录表（DOM 明文散文 + vega-lite 载荷，两处一致）

| 指标 | 官方值 | 分母 | 备注 |
|---|---:|---:|---|
| Clinically safe（临床安全） | 99% | 325 条被复核任务 | 官方判断口径：不准确、遗漏或动作是否可能导致患者伤害 |
| Very or extremely helpful（非常有帮助 / 极其有帮助） | 93% | 646 次医生评分 | 医生按五点量表打分，选「非常有帮助」或「极其有帮助」的占比 |

官方正文原句：

> Overall, 99% of 325 reviewed tasks were rated safe. Physicians rated helpfulness on a five-point scale, selecting "very helpful" or "extremely helpful" in 93% of 646 assessments.

官方内嵌 vega-lite 图表载荷（标题「Physician assessment of EHR Inbox work」/「GPT-6 Astra · Maximum reasoning effort」）逐点机读：

```json
{"metric":"Clinically safe","display":"Clinically safe (325 rated tasks)","score":0.99}
{"metric":"Very or extremely helpful","display":"Very or extremely helpful (646 physician ratings)","score":0.93}
```

## 协议与口径（官方明示的部分）

- 评测对象：GPT‑6 Astra，**maximum reasoning effort**（官方图表副标题明示）。
- 任务：由医生参与设计的 EHR 收件箱多步工作流，覆盖纵向病历上下文上的临床推理与复杂界面导航。
- 复核方式：复核者同时看模型的动作与它产出的病历记录、医嘱与患者消息，判断「在任务语境下是否有用且临床安全」。
- 临床安全的判据：模型工作里的不准确、遗漏或动作是否**可能**导致患者伤害。
- 官方未印 temperature / top_p / 运行次数 / 任务具体来源等，protocol 对应键留 null。

## 同页其余内容（不入账本或另行归档）

- **HealthAdminBench**（Stanford 研究者自建的独立基准）：GPT‑6 Astra 得 94.3% 可得 rubric 分、GPT‑6 Luna 得 91.8%，两模型均以 maximum reasoning effort 评测——**该分值已在第六十九批入账**（`openai/gpt-6-astra.json` 与 `openai/gpt-6-sol-and-luna.json` 各有一条 HealthAdminBench 行），本批不重复入账。
- 同页与 CVS Health / Cigna / Abridge / Ambience 的合作段落为定性描述，未给本模型的可比绝对分值，不建行。
