---
vendor: google
model: Humanity's First Exam（HFE，Google DeepMind 基准）
release: humanitys-first-exam
date: 2026-11-24
source: https://blog.google/innovation-and-ai/models-and-research/google-deepmind/humanitys-first-exam/
fetched_at: 2026-11-25
---

# Humanity's First Exam（Google DeepMind 官方基准与发布文归档）

> 归档说明：`page.html` 为官方博客页 `https://blog.google/innovation-and-ai/models-and-research/google-deepmind/humanitys-first-exam/` 的原始存档（服务端渲染 HTML，原始字节未改动，抓取于 2026-11-25）；`hfe_tech_paper.pdf` 为官方技术报告《Humanity's First Exam: Measuring the Reliability Floor of LLMs》（https://storage.googleapis.com/deepmind-media/papers/hfe_tech_paper.pdf，12.6 MB，署期 2026-11-24）原样存档。本文件是两份原文的转录与取数记录。

## 发布日证据链

| 来源 | 原文 | 说明 |
|---|---|---|
| 官方博客页 JSON-LD | `"datePublished":"2026-11-24T19:30:00+00:00"` | `<head>` 内 schema.org 节点，UTC 日期即 **2026-11-24** |
| 官方博客页印刷日 | 「Nov 24, 2026」（署名 Oran Kelly, Research Scientist, Google DeepMind） | 正文页头印刷日期，与上一行互证 |
| 技术报告 PDF 首页 | 「2026-11-24　Humanity's First Exam: Measuring the Reliability Floor of LLMs」 | 论文首页页眉日期，同日 |

## 基准是什么（博客页正文转录）

- 原文：「Today, we're launching the Humanity's First Exam (HFE) benchmark on Kaggle to measure how reliably LLMs answer straightforward, everyday questions.」
- 原文：「Instead of focusing on whether a model is capable of solving a task once, HFE measures whether models can consistently solve tasks (and slight variations) every single time.」
- 原文：「The dataset consists of 544 elementary text and image prompts across 20 foundational capabilities.」
- 原文：「Over the last 6 months, frontier models have made significant progress on HFE.」
- 原文：「To keep the HFE benchmark dataset up to date, we're inviting the community to help. Join our three-week Kaggle competition through December 15 and submit everyday questions that today's models still get wrong.」
- 公开样例（原文）：「List the color of the third letter of each word in the neon sign in order, separated by a semicolon.」（Answer: green; yellow; white; blue; blue）
- 页内三处官方链接：Kaggle 榜单 `https://www.kaggle.com/benchmarks/deepmind/hfe/leaderboard`、Kaggle 基准页 `https://www.kaggle.com/benchmarks/deepmind/hfe`、技术报告 PDF。

## 评测协议（技术报告 §3.2 / §3.3 转录）

- 原文：「Models are evaluated zero-shot in a single turn with no system prompt and no access to external tools (search, code execution). Multimodal prompts pass raw, uncropped image bytes.」
- 原文：「For each of the 544 prompts, we sample n = 6 rollouts (3,264 per model) using provider-default decoding parameters (e.g., temperature and top-p) at the reasoning effort levels specified in Tables 4 and A1, scoring failed or empty generations as 0.」
- 原文（判分）：「The final answer of each model response is graded against its ground-truth reference, consisting of either a golden answer or a rubric definition, by a deterministic LLM judge (Gemini 3.1 Pro, temperature 0). Internal reasoning traces and control tokens are stripped prior to grading, and empty visible outputs score 0.」
- 原文（判分审计）：「In a cross-provider audit of all 1,492 failed prompt–model pairs across Table 4 using Claude Fable 5.2 (weighted across 5,552 wrong-answer rollouts …), only 3% of wrong-answer rollouts (∼ 0.3% of all 58,752 rollouts) were flagged as potentially correct or defensible, indicating a low false-negative rate.」
- 原文（人类基线，§2.4）：「On the 136 seeds retained in the final benchmark, single-rater accuracy is 90.8% (494/544) … median per-rater solve time is 1.0 minute.」
- 原文（错答分布，§4）：「Remaining failures are heavily concentrated in visual perception (73% of wrong answers), where extra test-time reasoning yields far smaller gains than on text and symbolic tasks.」

## 六个读数的定义（技术报告 Table 3 转录）

| 读数 | 口径 | 含义 |
|---|---|---|
| pass@1 | 单题 | 单次抽样答对概率（c/n，n=6），官方称标准头条指标 |
| pass@4 | 单题 | 4 次抽样至少 1 次答对，能力天花板 |
| pass^4（Rel@4） | 单题 | 同题 4 次抽样全对，重跑一致性 |
| family pass@4 | 四题族 | 同族 4 题 × 4 次抽样共 16 次里至少 1 次答对，族级能力天花板 |
| family pass^4 | 四题族 | 同族 16 次全对才记成功，官方主指标「地板」 |
| Family Reliability Gap | 天花板 − 地板 | family pass@4 − family pass^4，单位百分点（pp） |

## 官方结果全表（技术报告第 23 页 Table A1 逐格转录）

> 表题原文：「Complete HFE results across all 29 models and 52 reasoning-effort configurations (n = 544 prompts, 136 families)」。带 * 号者为上一代模型（官方注明「Prior-generation models, reported for reference」）。

| 模型 | 推理档位 | pass@1 | pass@4 | family pass@4 | family pass^4 | Family Reliability Gap | Avg Thought Tokens |
|---|---|---|---|---|---|---|---|
| GPT-6.2 Astra | xhigh | 97.8% (±1.5) | 97.9% (±1.5) | 100.0% | 92.4% (±4.3) | 7.6 pp | 204 |
| GPT-6.2 Astra | low | 94.9% (±1.9) | 97.9% (±1.5) | 100.0% | 74.3% (±7.0) | 25.7 pp | 14 |
| GPT-6.2 Sol | xhigh | 97.3% (±1.5) | 98.4% (±1.2) | 100.0% | 86.9% (±5.2) | 13.1 pp | 274 |
| GPT-6.2 Sol | low | 93.1% (±2.5) | 96.8% (±1.9) | 100.0% | 68.7% (±7.1) | 31.3 pp | 15 |
| Gemini 4 Neon | xhigh | 96.8% (±1.5) | 97.9% (±1.3) | 100.0% | 85.8% (±5.8) | 14.2 pp | 9,852 |
| Gemini 4 Neon | low | 96.9% (±1.7) | 97.6% (±1.4) | 100.0% | 86.8% (±5.5) | 13.2 pp | 787 |
| GPT-6 Astra | xhigh | 96.8% (±1.6) | 98.0% (±1.4) | 100.0% | 83.4% (±5.8) | 16.6 pp | 382 |
| GPT-6 Astra | low | 96.1% (±1.8) | 97.9% (±1.5) | 100.0% | 80.9% (±6.3) | 19.1 pp | 65 |
| Gemini 4 Carbon | high | 95.6% (±1.7) | 97.0% (±1.3) | 100.0% | 80.5% (±6.4) | 19.5 pp | 6,616 |
| Gemini 4 Carbon | low | 90.9% (±2.5) | 95.6% (±1.8) | 100.0% | 63.1% (±7.7) | 36.9 pp | 29 |
| GPT-6.1 Sol | xhigh | 96.1% (±1.7) | 97.8% (±1.6) | 100.0% | 79.1% (±6.4) | 20.9 pp | 396 |
| GPT-6.1 Sol | low | 94.0% (±2.0) | 96.7% (±1.7) | 100.0% | 67.5% (±7.3) | 32.5 pp | 79 |
| Gemini 4 Argon | high | 94.1% (±2.1) | 96.4% (±1.6) | 100.0% | 76.6% (±6.8) | 23.4 pp | 1,838 |
| Gemini 4 Argon | low | 88.7% (±2.9) | 93.9% (±2.3) | 99.8% | 56.7% (±7.9) | 43.0 pp | 0 |
| GPT-6.1 Terra | xhigh | 94.7% (±2.1) | 96.6% (±1.9) | 100.0% | 76.4% (±6.9) | 23.6 pp | 622 |
| GPT-6.1 Terra | low | 91.3% (±2.5) | 95.2% (±2.1) | 100.0% | 62.1% (±7.7) | 37.9 pp | 89 |
| Claude Fable 5.2 | max | 93.4% (±2.2) | 95.3% (±1.9) | 100.0% | 73.7% (±7.3) | 26.3 pp | 2,951 |
| Claude Fable 5.2 | low | 91.0% (±2.5) | 93.7% (±2.2) | 100.0% | 65.5% (±7.7) | 34.5 pp | 125 |
| Gemini 4 Hydrogen | xhigh | 92.5% (±2.4) | 95.6% (±1.7) | 100.0% | 68.9% (±7.5) | 31.1 pp | 13,775 |
| Gemini 4 Hydrogen | low | 92.9% (±2.3) | 95.6% (±2.0) | 100.0% | 70.2% (±7.4) | 29.8 pp | 601 |
| Claude Sonnet 5.5 | max | 91.7% (±2.4) | 94.5% (±1.9) | 100.0% | 67.6% (±7.7) | 32.4 pp | 6,340 |
| Claude Sonnet 5.5 | low | 79.3% (±3.9) | 86.4% (±3.4) | 99.3% | 35.3% (±7.6) | 63.9 pp | 32 |
| Claude Opus 5.5 | max | 91.2% (±2.6) | 94.2% (±2.3) | 99.3% | 63.0% (±7.6) | 36.2 pp | 5,162 |
| Claude Opus 5.5 | low | 89.3% (±3.0) | 92.5% (±2.5) | 99.8% | 61.1% (±7.9) | 38.7 pp | 252 |
| Gemini 3.8 Flash | high | 87.1% (±3.2) | 91.9% (±2.6) | 100.0% | 56.8% (±8.1) | 43.2 pp | 8,150 |
| Gemini 3.8 Flash | low | 82.2% (±3.6) | 90.0% (±3.0) | 100.0% | 39.6% (±7.7) | 60.4 pp | 861 |
| Claude Fable 5.1 | max | 85.7% (±3.1) | 89.9% (±2.7) | 100.0% | 49.7% (±8.0) | 50.3 pp | 4,665 |
| Claude Fable 5.1 | low | 78.2% (±3.9) | 86.5% (±3.1) | 100.0% | 32.4% (±7.7) | 67.6 pp | 120 |
| Gemini 3.6 Flash | high | 83.8% (±3.4) | 90.9% (±2.7) | 100.0% | 44.7% (±8.0) | 55.3 pp | 3,473 |
| Gemini 3.6 Flash | low | 81.3% (±3.5) | 90.3% (±2.6) | 100.0% | 36.6% (±7.5) | 63.4 pp | 1,000 |
| Gemini 3.6 Flash | minimal | 55.0% (±4.8) | 71.2% (±4.8) | 93.7% | 8.0% (±4.0) | 85.8 pp | 0 |
| Gemini 3.1 Pro* | high | 83.6% (±3.5) | 92.2% (±2.5) | 100.0% | 43.6% (±7.7) | 56.4 pp | 2,834 |
| Gemini 3.1 Pro* | low | 83.3% (±3.6) | 91.6% (±2.5) | 100.0% | 46.1% (±8.0) | 53.9 pp | 1,219 |
| Claude Haiku 5.5 | max | 83.6% (±3.3) | 89.4% (±2.8) | 99.8% | 41.6% (±7.9) | 58.1 pp | 13,351 |
| Claude Haiku 5.5 | low | 68.7% (±3.8) | 81.2% (±3.5) | 99.0% | 10.9% (±4.5) | 88.1 pp | 752 |
| GPT-6 Luna | xhigh | 74.8% (±4.1) | 85.4% (±3.7) | 98.5% | 25.6% (±6.7) | 73.0 pp | 1,545 |
| GPT-6 Luna | low | 63.0% (±4.2) | 79.0% (±4.1) | 98.6% | 8.4% (±4.1) | 90.2 pp | 307 |
| Gemini 3.5 Flash-Lite | high | 68.7% (±4.4) | 83.6% (±3.6) | 98.8% | 18.6% (±6.0) | 80.1 pp | 3,094 |
| Gemini 3.5 Flash-Lite | low | 58.5% (±4.7) | 74.4% (±4.6) | 95.0% | 8.6% (±4.4) | 86.4 pp | 840 |
| Gemini 3.5 Flash-Lite | minimal | 37.9% (±4.1) | 56.9% (±4.8) | 89.2% | 0.9% (±1.2) | 88.3 pp | 0 |
| Gemini 3.1 Flash-Lite* | high | 64.7% (±4.8) | 79.0% (±4.3) | 96.9% | 18.3% (±6.1) | 78.6 pp | 3,381 |
| Gemini 3.1 Flash-Lite* | low | 39.0% (±3.8) | 59.4% (±4.7) | 92.2% | 0.0% (±0.0) | 92.2 pp | 126 |
| GPT-5.6 Sol* | max | 87.2% (±3.4) | 91.5% (±3.0) | 98.3% | 54.2% (±7.9) | 44.0 pp | 1,653 |
| GPT-5.5* | xhigh | 84.5% (±3.6) | 89.4% (±2.9) | 99.9% | 51.7% (±8.0) | 48.2 pp | 2,299 |
| Claude Opus 5* | max | 81.3% (±4.0) | 85.8% (±3.6) | 99.8% | 47.3% (±8.1) | 52.4 pp | 2,326 |
| GPT-5.6 Terra* | max | 81.6% (±3.7) | 88.8% (±3.3) | 99.2% | 39.0% (±7.7) | 60.2 pp | 3,501 |
| Claude Opus 4.8* | max | 71.3% (±5.0) | 80.0% (±4.2) | 99.1% | 36.9% (±7.9) | 62.2 pp | 4,613 |
| Claude Sonnet 5* | max | 66.6% (±5.5) | 76.2% (±4.8) | 97.7% | 32.9% (±7.8) | 64.8 pp | 12,225 |
| Gemini 3 Flash* | high | 77.3% (±3.9) | 88.5% (±3.0) | 100.0% | 31.7% (±7.3) | 68.3 pp | 4,071 |
| Gemini 3 Flash* | low | 74.5% (±4.1) | 86.7% (±3.3) | 99.0% | 26.0% (±6.9) | 73.1 pp | 1,016 |
| GPT-5.6 Luna* | max | 75.9% (±4.0) | 85.4% (±3.5) | 98.8% | 28.6% (±7.2) | 70.2 pp | 4,198 |
| Claude Sonnet 4.6* | max | 60.0% (±5.7) | 68.8% (±5.4) | 92.9% | 24.6% (±7.0) | 68.3 pp | 6,240 |

> 表注原文：「Thought-token counts reflect each provider's native tokenizer and API reporting (e.g., OpenAI reasoning_tokens; Gemini 4 Argon low reports 0 thought tokens) and are not directly comparable across providers. Models are ordered by descending family pass^4 at highest evaluated reasoning effort. Reported ± values denote half-widths (hi − lo)/2 of the 95% family-clustered percentile bootstrap interval.」

## 本仓取数口径

- 每个模型取 Table A1 里**最高评测 reasoning effort** 那一行，写入该模型自己 release 的 evidence 行，`reported_score` 记 `pass@1`（值 + 页面原样字符串），`family pass^4` / `Family Reliability Gap` / `pass@4` / `family pass@4` / 平均思维 token 等同表读数写入该行 notes，完整表见上。
- `attribution_type` 记 `benchmark_owner_reported`：分数由基准发布方 Google DeepMind 统一跑、统一判分，不是各厂商自报。
- `benchmark_variant` 留 null：HFE 只有 2026-11-24 一个公开版本；推理档位是模型侧设置，记在 `protocol.reasoning_effort`，故对照登记表把本基准标为「单一版本」。
- 表格取数经**两种方法交叉核对**：PDF 内容流抽取（解压 FlateDecode 流后取 Tj/TJ 文本算子）与 PDF 阅读工具的整页渲染文本，逐格比对一致后才落账。

## 局限（本批已记入基准档案）

- 完整 544 题未公开，Kaggle 上仅公开 20% 分层抽样子集，外部无法完整复跑。
- 判分模型是 Gemini 3.1 Pro（temperature 0），官方用 Claude Fable 5.2 复审错答，估计假阴性约 3%。
- 推理档位逐厂商不同（OpenAI xhigh / Anthropic max / Google high），跨档位分数不可横比。
- 官方只公开 52 个「模型 × 推理档位」设置中的本表读数，其余分项（数学 / 阅读推理 / 空间位置 / 视觉）见 Table A2 与 Figure 系列。
