---
vendor: openai
model: GPT-6 Astra / GPT-5.5
release: gpt-6-astra, gpt-5-5
date: 2026-10-27
source: https://openai.com/index/retell-ai
fetched_at: 2026-10-27
---

# Retell AI 客户案例（Retell vCX 自建评测的明文绝对分值）

发布日期证据：OpenAI 官网该文正文页眉印刷「OpenAI October 27, 2026」；官方新闻 RSS（`https://openai.com/news/rss.xml`）对应条目 `pubDate` 同为 2026-10-27。来源：https://openai.com/index/retell-ai

本页是 OpenAI 官网发布的一篇**客户案例**文章，披露语音 AI 公司 Retell AI 用其自建 **vCX benchmark** 对比数十个模型时，**GPT-6 Astra** 与 **GPT-5.5** 的表现。Retell 的 vCX 基准取自真实生产场景中的高难度多轮对话，考察四件事：是否遵循指令、是否忠于给定信息（grounding）、是否调用正确工具、对话语言是否自然。

页面正文（服务端渲染，DOM 机读）给出的评测数值：

| 评测 | 分数 | 备注 |
|---|---:|---|
| vCX 指令遵循率（Retell 2026-10-13 基准，GPT-6 Astra 排名第一） | 89.7% | 正文明文绝对值；页面未给次优模型分数与样本量 |
| vCX 非幻觉率（GPT-5.5，开推理，GPT-6 Astra 发布前的评测） | 88.0% | 正文明文绝对值 |
| vCX 工具调用正确率（GPT-5.5，开推理，GPT-6 Astra 发布前的评测） | 88.3% | 正文明文绝对值 |

正文原文（数值证据句）：

> Retell built its vCX benchmark to compare dozens of models using difficult, multi-turn conversations drawn from real production scenarios. It tests how well models follow instructions, stay grounded in the information they are given, call the right tools, and use natural conversational language. In Retell's October 13, 2026 benchmark, GPT‑6 Astra ranked first for instruction following at 89.7%.

> Retell also shared evaluations conducted before the launch of the GPT‑6 Astra model that showed GPT‑5.5 ranking highest among models on both non-hallucination rate (88.0%) and tool-call correctness (88.3%) with reasoning enabled, outperforming Gemini‑3.1‑Pro and Claude‑4.6 on both measures. It also led on non-hallucination rate with reasoning off.

评测协议（页面明示项）：

| 项 | 值 |
|---|---|
| 评测方 | 客户 Retell AI 自建 vCX benchmark（自建、自跑、自报），OpenAI 官网客户案例栏目转载 |
| 任务形态 | 真实生产场景改编的高难度多轮语音对话 |
| 评测维度 | 指令遵循、信息 grounding、工具调用正确性、对话语言自然度 |
| 口径快照 | vCX 2026-10-13 基准（GPT-6 Astra 指令遵循率口径）；GPT-5.5 两项为 GPT-6 Astra 发布**前**的评测批次 |
| 推理设置 | GPT-5.5 两项分数明确写「with reasoning enabled」；同页另提「关闭推理时的非幻觉率领先」，但未给数值 |

未转录说明与口径边界：

1. **本页不是模型发布页**，是 OpenAI 官方案例文章；GPT-6 Astra 与 GPT-5.5 本身的发布日期不变（见各自 release 档），本归档只作为新增**证据来源**。
2. **评测由客户 Retell 自建并自报**，OpenAI 转载于官网案例栏目；按「第三方评测方自报、厂商官网转载」口径记 `third_party_reported`，不计厂商自报。
3. **只有 89.7% / 88.0% / 88.3% 是绝对分值**；竞品列（Gemini-3.1-Pro、Claude-4.6）页面只写「在两项上均优于之」，**未给绝对值**，故只写进 evidence 的 notes，不建行。
4. 页面**无评测表格、无图表数值**（数值全在正文段落里），本批 evidence 无需视觉转写、无待人工核验的图表行。
5. **客户运营指标不入账本**：100M+ 月通话量、80%+ 客户解决率、1 万亿 tokens 消耗、每员工 160 万美元年化营收、Anker 80.4% 解决率与 NPS 63 等均为**商业/运营指标而非模型评测分数**，只在本归档备查。
6. **口径边界**：vCX 基准的题目集、样本量、评分细则与运行配置均未公开，外部无法复跑；不同机构自建基准不可横向比较；GPT-6 Astra 的 89.7% 与 GPT-5.5 的两项分数来自**不同批次**的 vCX 评测，不可当作同一张表的同行数字。
