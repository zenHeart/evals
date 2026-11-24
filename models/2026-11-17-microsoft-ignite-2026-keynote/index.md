---
vendor: Microsoft AI
model: Microsoft Ignite 2026 MAI keynote transcript（演讲转录页）
release: (不入账本)
date: 2026-11-17
source: https://microsoft.ai/news/microsoft-ignite-2026-mai-keynote/
fetched_at: 2026-11-24
---

# Microsoft Ignite 2026：MAI 主题演讲转录页

## 页面性质

本页是 Ignite 2026 MAI 主题演讲的**文字转录**，与总发布页 [`models/2026-11-17-microsoft-ignite-2026/`](../2026-11-17-microsoft-ignite-2026/)（"Seven new world-class models at scalable price-performance"）是**两个独立页面**，不是同一 URL 的两种形态：

| 项 | 演讲转录页（本目录） | 总发布页 |
| --- | --- | --- |
| URL | <https://microsoft.ai/news/microsoft-ignite-2026-mai-keynote/> | <https://microsoft.ai/news/microsoft-ignite-2026/> |
| 标题 | Microsoft Ignite 2026: MAI keynote transcript | Seven new world-class models at scalable price-performance |
| `datePublished` | `2026-11-17T18:14:55+00:00` | `2026-11-17T18:16:05+00:00` |
| 抓取字节数 | 202,234 | 452,062 |
| 文体 | 第一人称演讲口播稿 | 官方发布文（含阵容速览 + 分节正文） |

两页 `datePublished` 相隔 1 分 10 秒，属同日同一场发布的配套产物；本目录在总发布页之后建档，用作演讲口径的独立佐证，**不产生任何 `data/model-releases/` 记录**——它本身不是某一个模型的发布文，页面也没有评测表格。

- 来源：<https://microsoft.ai/news/microsoft-ignite-2026-mai-keynote/>
- 归档日期：2026-11-17（= 发布日期）
- 抓取日期：2026-11-24
- 发布日期证据链：JSON-LD WebPage 的 `datePublished` `2026-11-17T18:14:55+00:00`、`<link rel="canonical">` 与 `og:url` 均指向本 URL、页面 Related Stories 标注「Nov 17, 2026」，三处互证，`date_precision: day`。

## 演讲中涉及账本 release 的句子（逐句照录）

| 账本 release | 演讲原句（英文） |
| --- | --- |
| `mai-code-2` | "Averaged over four widely used benchmarks that target the everyday enterprise coding tasks we see in GitHub Copilot, MAI Code 2 gives you 98% of the performance of GPT 6.1 Sol at just 40% of the cost, and against Opus 5.5 it's an incredible 5% of that cost." |
| `mai-code-2`（Flash 变体） | "Same for Code 2 Flash. It matches 6 Luna and Haiku 5.5 on these everyday tasks, at just 65% and 20% of the price, respectively." |
| `decision-1-1` | "But agents are increasingly needed to make decisions, especially where speed and cost are critical. So Decision 1.1 provides model routing integrated right into your applications. And on the Artificial Analysis Decision Index it beats Jev, Google and OpenAI." |
| `mai-cyber-2-flash` | "MAI Cyber 2 Flash is our response. It's ahead of GPT 6 Astra on CyberGym-E2E at less than 2% of the cost per task. Truly remarkable." |
| `mai-image-2-7-flash` | "We're also moving just as fast in multimodal. We're now the number two lab on image generation and MAI Image 2.7 just this morning is the world's number one image editing model at a fifth of the cost of the competition." |
| `mai-transcribe-2`（Dragon Copilot Transcribe 的底座） | "And our transcription model is the fastest and most accurate in the world. […] MAI Transcribe 2 has now been deployed to 10 million patient Dragon Copilot encounters a month, while halving the error rate." |
| `mai-licensed-weights` | "Today we're taking a big step forward with MAI Licensed Weights: models under your control. You take a frontier MAI model, customize it using your proprietary data if you want to. And then you run it securely in your own Azure environment." |

演讲中**未提及** MAI Realtime 1——总发布页阵容里的第五项在口播稿中没有对应句子，其口径只能取总发布页与 `models/2026-11-17-mai-realtime-1/` 独立发布文。

## 与总发布页的口径差异（对账用）

同一场发布的两个页面在个别数字的表述粒度不同，取数时以各自 release 的独立发布文页为准，本表只记录差异本身：

| 项目 | 演讲转录页 | 总发布页 | 差异性质 |
| --- | --- | --- | --- |
| MAI Code 2 vs Opus 5.5 | "against Opus 5.5 it's an incredible 5% of that cost"（只说成本） | "reaches 96% performance for just 5% of the price"（成本 + 性能两个数） | 转录页少给「96% 性能」这一半；`mai-code-2` 账本行以总发布页与独立发布文为准 |
| MAI Code 2 vs GPT 6.1 Sol | "98% of the performance … at just 40% of the cost" | "reaches 98% of the coding quality … at about 40% of the price" | 一致（转录页未写 "about"） |
| MAI Image 2.7 竞品 | "at a fifth of the cost of the competition"（未点名） | "outperforming GPT Image 2.6 Sunburst (max) at just one-fifth of the price"（点名） | 转录页未点名竞品型号，不能据其补竞品列 |
| MAI Cyber 2 Flash | "ahead of GPT 6 Astra on CyberGym-E2E at less than 2% of the cost per task" | 同（ CyberGym-E2E 点名相同） | 一致 |
| AT&T 定制模型 | "AT&T's custom version of Code 2 Flash. It outperforms 6.1 Sol on standard 5G network analysis, while being a whopping 50x cheaper." | "AT&T developed an MAI custom model for 5G network operation analytics and it outperformed GPT-6.1 Sol at 1/50th of the cost." | 口径一致（50x = 1/50th）；两页都未给绝对分，不建行 |
| 实验室排名 | "We're now the number two lab on image generation" | "At text-to-image generation, our model is ranked #4, making us the second-best lab." | 一致 |
| Decision 1.1 | 只说 "beats Jev, Google and OpenAI"，未给 50x / 79x / 4,000 客户 | 给全 "50x faster and 79x cheaper" 与 "Used by 4,000 customers" | 转录页口径更少；`decision-1-1` 的 notes 已说明为何三种口径都不建行 |
| 能力边界 | "they're explicitly not yet tuned for the harder problems, like fundamental science research and very long horizon agentic work" | 同句（发布文正文） | 一致 |

## 口径与限制

- 本页**不建任何 benchmark_evidence 行**：全部是相对口径（百分比成本比、倍数、名次先后）与商业采用数字，没有任何一项公布绝对分数、题集划分或评测协议。
- 本页提及的评测名目（"four widely used benchmarks"、CyberGym-E2E、Artificial Analysis Decision Index）在页面上均无分数；总发布页对前四项给出了具体基准名（DeepSWE 1.1 / Terminal Bench 2.1 / SWE-Atlas / FrontierCode v1.1），转录页只说 "four widely used benchmarks"，**不得**把总发布页的基准名单回填到转录页引用上。
- 「10 million patient Dragon Copilot encounters a month」「a whopping 50x cheaper」「number two lab」均为商业或相对口径，不是评测读数。
- 演讲者为 MAI 负责人（口吻为 "Our mission at MAI"），页面未印演讲人姓名；转录稿经站点排版，段落边界可靠，但省略了现场演示与幻灯片内容。
- 页面配图与 Related Stories 链接已从正文剔除；`images/` 为空——本页无可机读评测数值，数字全部承载在正文文本里。
- 全部陈述均为厂商自报（vendor_reported），未经第三方独立复现；本归档仅存 2026-11-24 当日抓取快照。
