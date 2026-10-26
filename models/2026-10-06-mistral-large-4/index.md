---
vendor: mistral
model: Mistral Large 4
release: mistral-large-4
date: 2026-10-06
source: https://mistral.ai/news/mistral-large-4/
fetched_at: 2026-10-12
---

# Introducing Mistral Large 4

发布日期来自官方博客 October 6, 2026。Mistral Large 4（ML4 / le Chonk）是 1 万亿参数（1T）的原生多模态模型，激活参数约 52B。在欧洲自建数据中心的 3,800 张 NVIDIA Grace Blackwell GPU 上从零训练。模型提供编码、智能体工作流、多模态理解与网络安全、金融、法律等行业工作负载。

## 勘误（2026-10-26 第三十七批）

初版归档结论写的是「发布正文评测均为 WebP 图片图表，未在正文中披露离散数字表格，全部评测行记为 pending」。**该结论有误**：本篇原文的正文散文里明文印有多组绝对分值，图片图表只是同时并存的另一种呈现形式。按同一篇已归档原文（`page.html`）复核后，以下 8 组明文分值补录进账本。

## 正文明文绝对分值（散文，非图表）

| 评测 | 分数 | 官方原文 | 备注 |
| --- | --- | --- | --- |
| AA Cyber Index | 82% | "On one of the index's tests, which asks a model to reproduce a real vulnerability in open-source software and then patch it, ML4 scores 82%, the highest of any model." | **指数内的一个分项**，不是指数总分；同页说明多家闭源模型因安全护栏拒答而在该测试上接近零分 |
| Cybench | 93% | "It also solves 93% of the challenges in Cybench, a set of 40 exercises drawn from security competitions, one of the highest scores reported for an open-weight model." | 40 项来自安全竞赛的挑战，解出率 93% |
| DeepSWE v1.1 | 61.7% | "ML4 excels across software engineering, repository understanding, and complex terminal workflows, scoring 61.7% on DeepSWE v1.1, 59.4% on SWE-Atlas-QnA, and 28.3% on Terminal-Bench 4." | 与下两项同句，按「一个 benchmark 行 = 一条 evidence」拆三行 |
| SWE-Atlas-QnA | 59.4% | 同上 | 代码库问答分项 |
| Terminal-Bench 4.0 | 28.3% | 同上 | 官方未明示 harness 与推理强度 |
| Coding Agent Index | 49.8% | "Its combined Coding Agent Index score of 49.8% places it ahead of DeepSeek V4 Pro 0813 and Qwen3.8 Max." | 竞品仅印名次关系，未印数值，不另建行 |
| AutomationBench | 59.9% | "On AutomationBench — 657 business workflows across apps like Gmail, Google Sheets, Slack, and Salesforce — it scores 59.9%, ahead of Kimi K3, MiMo-V2.6-Pro, and DeepSeek V4 Pro." | 657 条业务工作流；竞品未印数值 |
| Dense 200 | 42% | "On visual grounding particularly, we find ML4 to be one of the most capable models we tested, for instance surpassing GPT-6-Astra on Dense 200 (42% vs 41%)." | 同句印出的竞品 GPT-6-Astra 41% 单列为 `comparison_cited` 行 |
| Lakera B3 | 93.3% | "On Lakera's public B3 AI Security Benchmark, ML4 resists 93.3% of attacks – we see no higher scores among competitors." | **分数方向为「攻击抵抗率」越高越好**，勿反读成攻击成功率 |

协议字段（harness / tools / 推理强度 / 温度 / 跑次数）官方在正文均未明示，账本一律记 `null`。

## 仍为图表图片、未转录的评测

CyberGym-E2E、AA-Briefcase、Finance Agent v2（FinWorkBench）、Harvey's Legal Agent、ChartQA Pro、GDP.pdf、Science and Math、以及与 Surge AI 的盲评（编码质量 1–5 分制，正文未印 ML4 数值）——这些只有官方图片或无数值表述，**不做视觉转写、不建行、不填数值**。
