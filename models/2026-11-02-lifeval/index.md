---
vendor: openai
model: LifeVal
release: lifeval
date: 2026-11-02
source: https://openai.com/index/lifeval/
fetched_at: 2026-11-02
---

# LifeVal（官方发布文归档）

OpenAI 于 2026-11-02 发布《LifeVal: Measuring AI progress on the tasks that matter in everyday life》，
公布日常生活任务评测的官方分值。以下数值全部从页面内嵌 vega-lite 图表 `data.values` 机读得到。

## 官方正文任务分（Individual task examples / 正文表格）

| 任务 | 分数 |
| --- | --- |
| Find the right kindergarten after a move | 93.1% |
| Manage volunteers ahead of a flood | 98.0% |
| Find a new home for my family that fits my budget, has a separate living unit, and keeps my commute short | 100% |
| Fill out my Texas SNAP application and attach the supporting documents so I can review it | 98.7% |
| Use credit card points to book travel to Geneva | 96.7% |
| Watch a game with grandma from far away | 96.3% |
| Help a parent adjust to a diabetes diagnosis | 90.4% |
| Review my LSAT Logical Reasoning answers | 88.7% |

## 官方图表逐模型 × reasoning effort（vega-lite `data.values`，纵轴 Average reward (unweighted)）

| 模型 | reasoning effort | 平均 reward | 平均生成 token | 平均延迟(s) | 估算 API 成本($) |
| --- | --- | --- | --- | --- | --- |
| GPT-5.2 | low | 27.69% | 9182 | 7.1 | 1.19 |
| GPT-5.2 | medium | 37.18% | 27759 | 20.5 | 5.10 |
| GPT-5.2 | high | 45.19% | 82172 | 58.5 | 15.93 |
| GPT-5.2 | xhigh | 49.26% | 202044 | 121.0 | 29.99 |
| GPT-5.4 | low | 62.80% | 9411 | 7.6 | 1.87 |
| GPT-5.4 | medium | 70.14% | 15576 | 10.7 | 2.83 |
| GPT-5.4 | high | 72.00% | 21150 | 13.1 | 3.54 |
| GPT-5.4 | xhigh | 73.05% | 30626 | 16.7 | 4.42 |
| GPT-5.5 | low | 57.08% | 4070 | 4.9 | 1.85 |
| GPT-5.5 | medium | 71.31% | 9694 | 9.3 | 4.55 |
| GPT-5.5 | high | 75.61% | 14887 | 12.1 | 6.32 |
| GPT-5.5 | xhigh | 77.45% | 20507 | 14.7 | 7.77 |
| GPT-5.6 | low | 63.95% | 5137 | 6.9 | 2.17 |
| GPT-5.6 | medium | 75.00% | 9884 | 11.2 | 4.46 |
| GPT-5.6 | high | 78.81% | 14313 | 14.1 | 6.01 |
| GPT-5.6 | xhigh | 79.98% | 20686 | 17.5 | 7.55 |
| GPT-5.6 | max | 82.58% | 29739 | 22.2 | 9.65 |
| GPT-6 Astra | low | 66.59% | 4663 | 6.6 | 5.10 |
| GPT-6 Astra | medium | 77.61% | 8039 | 10.4 | 9.48 |
| GPT-6 Astra | high | 80.72% | 12400 | 13.6 | 13.07 |
| GPT-6 Astra | xhigh | 80.58% | 14500 | 15.0 | 14.30 |
| GPT-6 Astra | max | 82.48% | 26278 | 20.6 | 20.04 |

## 官方 average_reward 汇总图

| 模型 | 官方标注 release_date | average_reward |
| --- | --- | --- |
| GPT-5.2 | 2025-12-11 | 49.26% |
| GPT-5.4 | 2026-03-05 | 73.05% |
| GPT-5.5 | 2026-04-23 | 77.45% |
| GPT-5.6 | 2026-07-09 | 79.98% |
| GPT-6 Astra | 2026-09-03 | 80.58% |

## 官方相对结论（只作 notes，不建行）

- GPT-6 在这些任务上较 GPT-5.6 约快 23%。
- 经 OpenAI API 跑同类生活任务时，GPT-5.6 总体表现与 GPT-6 相近，估算 API 成本约为其一半。

## 本批入库说明

- 本批为该评测建立正式 benchmark 实体 `data/benchmarks/lifeval.json`，并把 GPT-5.4 / GPT-5.5 / GPT-5.6 / GPT-6 Astra 四家模型共 18 条 evidence 行写入对应 release。
- GPT-5.2（官方标注 2025-12-11）在本仓无对应 release 记录，本批不新建 release、不建证据行，其分值仅留档于实体说明与批次报告。
- 官方图表只标注「GPT-5.6」，未区分 Sol/Terra/Luna 分层，相关行的分层归属标为待人工确认。
