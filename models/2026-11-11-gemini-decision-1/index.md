---
vendor: google
model: Gemini Decision 1
release: gemini-decision-1
date: 2026-11-11
source: https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/
fetched_at: 2026-11-14
---

# Gemini Decisions API: Fast, calibrated multimodal decisions

> 归档说明：`page.html` 为官方发布页 `https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/` 的原始存档（HTTP 200，blog.google 服务端渲染 HTML，367858 字节），抓取于 2026-11-14。页面正文**无 DOM 跑分表**（`<table>` 计数 0），也**无内嵌图表数据载荷**（`vega` / `vegaLite` / `data-data` 均为 0），评测对照以 **WebP 位图**呈现；页面另有 `application/json` 脚本若干但不含评测数值数据集。3 张内容图片已原样下载到 `images/`（架构图、评测对照图、主视觉），页脚其余缩略图（相关推荐卡片、社交分享图）非内容图，未下载。

## 发布日证据链（两源互证）

| 来源 | 原文 | 说明 |
|---|---|---|
| 发布页 `<meta>` | `article:published_time` = `2026-11-11` | 页面 head |
| 发布页 JSON-LD | `"datePublished":"2026-11-11T18:00:00+00:00"`，`"dateModified":"2026-11-11T18:15:48.035680+00:00"` | schema.org BlogPosting 节点 |
| Google 官方博客 RSS | `Gemini Decisions API: Fast, calibrated multimodal decisions` / `Nov 11, 2026` | `https://blog.google/rss/` 条目 |

## 发布要点（转录）

- 定位（副标题原文）：「Fast, calibrated multimodal decisions」。
- 开头原文：「Today, we’re introducing the Gemini Decisions API, a new endpoint for fast, closed-set decisions powered by our new Gemini Decision 1 model (gemini-decision-1), available through the Gemini API in Google AI Studio.」
- 输入与规模：原文「You can pass one multimodal input across text, images, audio, video, and PDFs (up to 256K tokens) along with up to 1,000 independent questions.」
- 计费与延迟：原文「returning probabilities and confidence scores in 150-250 ms end-to-end latency at $0.10 per 1M input tokens with zero output tokens billed.」
- 相对结论（原文）：「On benchmarks spanning agent routing, reasoning, ranking, and multimodal understanding, Gemini Decision 1 leads across the suite, with the lowest calibration error.」另称「Gemini Decision 1 with the Decisions API is nearly 5x cheaper across the shared benchmark suite than Gemini 3.5 Flash-Lite with the Interactions API.」
- 三种题型：noul（是/否概率）、choice（2–255 选项，返回归一化概率）、score（有序评分档，返回连续加权分与逐档概率）。
- 内部使用：Gemini Notebook 用其做实时模型路由、Stitch 的 rapid canvas 用其生成线框图、CC 用其挑选 emoji 表情、Search 用其做 MCP 工具安全层。

## 评测数据

> 说明：评测对照是**位图**（`images/c02-54461bb3a855160a0551.webp`，WebP 1200×675），页面 DOM 里没有对应的可机读数值，故全部 11 行记 `evidence_type: "figure"` / `status: "pending"`，视觉转写只进 notes，**不自动翻 verified**。正文只给相对结论（“leads across the suite”“lowest calibration error”“nearly 5x cheaper”），按「正文只印相对结论 ⇒ 先翻图表载荷」的顺序已确认本页无任何内嵌图表数据集，故保留为图行。

### 数值全量转录表（位图视觉转写，未人工确认）

| 评测 | 分数（视觉转写） | 口径 / 备注 |
|---|---|---|
| JevBench（Public split） | 92.2% | TypeSafe Jav 1.14 90.0% / GPT-6 Luna 90.9% / Gemini 3.5 Flash-Lite 86.6% |
| Amazon ESCI（Macro-F1） | 58.7% | TypeSafe Jav 1.14 56.7% / GPT-6 Luna 54.7% / Gemini 3.5 Flash-Lite 47.2% |
| New Yorker Caption（Text-only） | 79.7% | TypeSafe Jav 1.14 72.0% / GPT-6 Luna 68.4% / Gemini 3.5 Flash-Lite 73.7% |
| Mind2Web Multimodal | 86.2% | TypeSafe Jav 1.14 86.8% / GPT-6 Luna 81.8% / Gemini 3.5 Flash-Lite 78.0% |
| PubMedQA | 79.8% | TypeSafe Jav 1.14 78.2% / GPT-6 Luna 74.4% / Gemini 3.5 Flash-Lite 77.6% |
| Global-MMLU-Lite（Non-English） | 86.0% | TypeSafe Jav 1.14 85.0% / GPT-6 Luna 79.6% / Gemini 3.5 Flash-Lite 78.8% |
| When2Call | 79.9% | TypeSafe Jav 1.14 82.0% / GPT-6 Luna 70.4% / Gemini 3.5 Flash-Lite 60.9% |
| MMAU | 71.8% | TypeSafe Jav 1.14 – / GPT-6 Luna – / Gemini 3.5 Flash-Lite 67.7% |
| Video-MME（No subtitles） | 69.1% | TypeSafe Jav 1.14 – / GPT-6 Luna – / Gemini 3.5 Flash-Lite 63.3% |
| Top-1 ECE（7 shared evals, lower is better） | 0.0250 | TypeSafe Jav 1.14 0.0494 / GPT-6 Luna 0.0721 / Gemini 3.5 Flash-Lite 0.2104 |
| Total price（7 shared evals） | $0.88 | TypeSafe Jav 1.14 $0.68 / GPT-6 Luna $0.93 / Gemini 3.5 Flash-Lite $4.14 |
