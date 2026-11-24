---
vendor: Microsoft AI
model: Microsoft Ignite 2026 MAI keynote（七模型总发布页）
release: decision-1-1
date: 2026-11-17
source: https://microsoft.ai/news/microsoft-ignite-2026/
fetched_at: 2026-11-24
---

# Microsoft Ignite 2026：MAI 主题演讲（七模型总发布页）

## 页面性质

本页是 Microsoft Ignite 2026 的 MAI 主题演讲总发布页，**本身不是某一个模型的发布文**。它一次公布七项模型（外加一项硬件加速器），其中五项在仓内各有独立归档目录与 release 实体，一项的底座模型早已入账，一项（Decision 1.1）在本页之前账本漏项、由本次补建。

- 来源：<https://microsoft.ai/news/microsoft-ignite-2026/>
- 归档日期：2026-11-17（= 发布日期）
- 抓取日期：2026-11-24
- 发布日期证据链：JSON-LD WebPage 的 `datePublished` `2026-11-17T18:16:05+00:00`、页面可见日期「Nov 17, 2026」、`dateModified` `2026-11-18T21:07:26+00:00`（此后有编辑），三处互证，`date_precision: day`。
- frontmatter 的 `release:` 记 `decision-1-1`：`scripts/reconcile-coverage.mjs` 用它把归档目录回填到对应候选上，而七项里只有 Decision 1.1 没有独立归档目录、以本页为唯一公开出处；其余六项的 `release:` 各归其独立归档页。这不表示本页只服务一个 release。

## 七项对账表（多变体完整性校验）

主题演讲原文：

> "That's why today we're releasing a family of seven new world class models at a truly exceptional price-performance. Here's the lineup:"

| # | 演讲列出的名称 | 账本 release | 归档目录 | 状态 |
| --- | --- | --- | --- | --- |
| 1 | MAI Cyber 2 Flash | `mai-cyber-2-flash` | `models/2026-11-17-mai-cyber-2-flash/` | 已入账 |
| 2 | MAI Code 2 | `mai-code-2`（`models[]` 两条之一） | `models/2026-11-17-mai-code-2/` | 已入账 |
| 3 | MAI Code 2 Flash | `mai-code-2`（`models[]` 两条之一） | 同上 | 已入账 |
| 4 | MAI Image 2.7 | `mai-image-2-7-flash` | `models/2026-11-17-mai-image-2-7/` | 已入账 |
| 5 | MAI Realtime 1 | `mai-realtime-1` | `models/2026-11-17-mai-realtime-1/` | 已入账 |
| 6 | Dragon Copilot Transcribe（built on MAI Transcribe 2） | 底座模型 `mai-transcribe-2` / `mai-transcribe-2-streaming` | `models/2026-08-20-mai-transcribe-2/` 等 | 底座已入账；Dragon Copilot Transcribe 是产品不是新模型 |
| 7 | Decision 1.1 | `decision-1-1`（本次补建） | 本目录（唯一公开出处） | **本次补建** |
| — | Maia 200（第二代 AI 加速器） | 无 | 无 | 硬件，不入模型账本 |

漏项说明：Decision 1.1 在本次补建前仓内无任何 release 实体，而它在本页有独立小节「The leading Decision model in the market」与独立段落，属于官方一页公布多个变体时被漏掉的中间项；已按 ingest 技能的「多变体完整性校验」补建 `data/model-releases/official/microsoft/decision-1-1.json`，并在其 notes 记录不建 benchmark 行的原因。

同页 Related Stories 还列出第六篇 `mai-licensed-weights`（MAI Licensed Weights，`models/2026-11-17-mai-licensed-weights/`），它是交付形态而非新模型，已单独入账，不计入「七项模型」。

## 发布要点（阵容速览，逐句照录）

| 名称 | 页面原句（英文） |
| --- | --- |
| MAI Cyber 2 Flash | beats GPT-6 Astra's quality at less than 2% of the cost per task on the CyberGym-E2E benchmark. |
| MAI Code 2 | reaches 98% of the coding quality of GPT-6.1 Sol at about 40% of the price. And against Opus 5.5, it reaches 96% performance for just 5% of the price. |
| MAI Code 2 Flash | shows comparable performance GPT-6 Luna at 65% of the price, and Haiku 5.5 at 20% of the price. |
| MAI Image 2.7 | is #1 on Artificial Analysis image editing, outperforming GPT Image 2.6 Sunburst (max) at just one-fifth of the price. |
| MAI Realtime 1 | outperforms GPT-Realtime 2.1 and starts at just $0.01 per audio minute. |
| Dragon Copilot Transcribe | is built on MAI Transcribe 2, the world's fastest and most accurate multilingual transcription model, and already powers 10 million patient encounters a month with multilingual error rates halved. |
| Decision 1.1 | is the latest decision model from Microsoft, 50x faster and 79x cheaper than GPT-6.1 Sol. |
| Maia 200 | , Microsoft's second-generation AI accelerator, is now in production running our largest models, achieving 1.7x more tokens per watt. |

## 正文章节照录

### Frontier cyber defense built to run 24/7

> "Security, alignment and containment are the most important priorities for agent development in 2027 and beyond. That's our top priority. We need to run monitoring and control agents defending and patching live production systems 24/7. That's why MAI Cyber 2 Flash was designed to deliver frontier intelligence at a fraction of the cost."

> "Built with Microsoft's decades of proprietary data and world-class security expertise, our models help defenders stay safe in this new era where attackers have cheap and abundant offensive tools. MAI Cyber 2 Flash builds on earlier MAI Cyber models that defenders already rely on. MAI Cyber accounts for almost 40% of scans in MDASH, and 90% of scans that started with MAI continued to use it. Our latest model is now priced 86% lower on output tokens than MAI Cyber 1.1 Flash, giving existing MDASH customers a stronger model at a lower price."

### Incredible coding performance at a fraction of the cost

> "MAI Code 2 is built for the best price-performance for everyday enterprise coding tasks. Averaged over four widely used benchmarks that target the everyday enterprise coding tasks we see in GitHub Copilot (DeepSWE 1.1, Terminal Bench 2.1, SWE-Atlas and FrontierCode v1.1), MAI Code 2 gives you 98% of the performance of GPT-6.1 Sol at 40% of the price, and 96% of Claude Opus 5.5's performance at just 5% of the price."

> "We've built these models to prioritize the coding work our customers do every day. They're explicitly not yet tuned for harder problems, like fundamental science research and very long horizon agentic work."

> "MAI Code 2 also been tuned to generate great dashboards and visualizations. In a blind, side-by-side evaluation of frontend work, developers preferred MAI Code 2 over GPT-6 Sol 64% of the time. Try MAI Code 2 in GitHub Copilot today."

> "MAI Code 2 Flash is designed for high-volume, everyday tasks like code explanations, targeted edits, routine fixes, and rapid iterations, while bringing quality at a much lower cost. It performs comparably to GPT-6 Luna and Claude Haiku 5.5 at 65% and 20% of the price, respectively, across three coding benchmarks measuring day-to-day, high-volume routine coding tasks (DeepSWE 1.1, Terminal Bench 2.1 and SWE-Atlas). It's available in GitHub Copilot and in a limited-access preview in Microsoft Foundry."

### The best image and transcription models in the world

> "MAI Image 2.7 is the best image editing model in the world, taking the #1 spot on Artificial Analysis, outperforming GPT Image 2.6 Sunburst (max) at just one-fifth of the price. At text-to-image generation, our model is ranked #4, making us the second-best lab. And MAI Image 2.7 Flash brings world class image generation for high-volume scenarios at ~$10 per 1,000 images. Both are available in Microsoft Foundry."

> "MAI Realtime 1 is our first live speech-to-speech model, designed for natural, low-latency conversations. In our evaluations, it outperformed GPT-Realtime 2.1 across external and Dynamics 365 benchmarks. It's priced for enterprise-scale use, starting at a budget-saving price of $0.01 per audio minute. You can try it out in MAI Labs and register your interest here."

> "Dragon Copilot Transcribe, built on MAI Transcribe 2, is now live in Dragon Copilot, powering 100% of doctor–patient conversation transcriptions. It covers 10 million encounters a month, halves error rates in multilingual workflows, and is in the hands of a third of US physicians."

### The leading Decision model in the market

> "Decision 1.1 provides model routing integrated right into your applications so that the bigger, pricier models are only used when you really need them. On the Artificial Analysis Decision Index Microsoft is ahead of Jev, Google and OpenAI, while being faster and cheaper. Used by 4,000 customers, it's 50x faster and 79x cheaper than GPT-6.1 Sol."

### Customize models for your business

> "We've heard again and again from leaders that no one wants to pour their IQ into someone else's model. And if you build on open weights, can you really trust where they came from, or how they'll behave when you use one as a foundation for your most valuable IP and data? We heard you. We started with Custom Models. AT&T developed an MAI custom model for 5G network operation analytics and it outperformed GPT-6.1 Sol at 1/50th of the cost. On complex scenarios, they found that Code 2 delivered frontier-level performance at a significantly lower price than alternatives."

> "Today, we're taking a big step forward with MAI Licensed Weights: models under your control. Take a frontier MAI model, customize it using your proprietary data if you want to. Then run it securely in your own Azure environment. You control who can access it. Your data and adaptations stay yours. And we'll work with you through Frontier Company to deliver the custom model and embed it in your own products and agents."

### 结语

> "So that's MAI, a family of world class models with exceptional price performance: the world's best image editing model; the world's best transcription model; frontier cyber defense at 2% of the cost; and world class everyday coding models at a price you can scale. And crucially all of it with Your IQ. Your agents. Your weights. All under your control."

## 口径与限制

- 本页**不建任何 benchmark_evidence 行**。页面只给相对口径（百分比成本比、倍数、名次）与商业采用数字，没有任何一项公布绝对分数、题集划分或评测协议；各项的绝对分数在各自的独立发布文页（`models/2026-11-17-mai-*`）里，由那些 release 自行入账。
- 本页提到的四个评测名目（CyberGym-E2E、DeepSWE 1.1 / Terminal Bench 2.1 / SWE-Atlas / FrontierCode v1.1、Artificial Analysis image editing、Artificial Analysis Decision Index）在本页均无分数，只在对应独立发布文页取数；Decision 1.1 因无独立发布文页，其 notes 已说明为何无法落到 `benchmark_id + reported_score`。
- 页面配图为产品与演讲截图，`images/` 为空：本页无可机读评测数值，评测数字全部承载在正文文本里。
- 「MAI Cyber accounts for almost 40% of scans in MDASH」「90% of scans that started with MAI continued to use it」「10 million encounters a month」「a third of US physicians」「Used by 4,000 customers」均为商业采用口径，不是评测读数。
- 页面明示 MAI Code 2 / Code 2 Flash 的能力边界：「They're explicitly not yet tuned for harder problems, like fundamental science research and very long horizon agentic work.」
- 全部陈述均为厂商自报（vendor_reported），未经第三方独立复现；本归档仅存 2026-11-24 当日抓取快照，`dateModified` 显示页面在 2026-11-18 有过编辑。
