---
vendor: thinking-machines
model: Inkling
release: inkling
date: 2026-07-15
source: https://thinkingmachines.ai/news/introducing-inkling/
fetched_at: 2026-11-14
---

# Inkling: Our Open-Weights Model

> 归档说明：`page.html` 为官方发布页 `https://thinkingmachines.ai/news/introducing-inkling/` 的原始存档（HTTP 200，Astro 静态站，服务端渲染 HTML），抓取于 2026-11-14。页面**正文图片 0 张**——全部评测图表是**内联 SVG**（本页 `<svg>` 计数 29），其中 Terminal Bench 2.1 / HLE 的 effort 扫描图只含坐标轴刻度（`<text>` 为 “20% / 40% / 60% / 80%” 与 token 刻度），**数据点无数值标签**；该图不可逐格机读，其 effort 各档数值留待人工读图。页面 og:image 一张已原样下载到 `images/`。

## 发布日证据链（两源互证）

| 来源 | 原文 | 说明 |
|---|---|---|
| 发布页 HTML | `itemprop="datePublished" content="2026-07-15T00:00:00+00:00"` | 页面 `<head>` 内 schema.org 节点 |
| Thinking Machines 官方 news 索引 | `Inkling: Our Open-Weights Model Jul 15, 2026` | 官方 news 索引页条目，与 HTML 一致 |

## 发布要点（转录）

- 定位（副标题原文）：「Our mission is to build AI that extends human will and judgment.」
- 开篇原文：「Today we are advancing our mission by releasing a model we trained from scratch with the full weights available, so that people can make it their own.」
- 架构与规模：原文「Our model, called Inkling, is a Mixture-of-Experts transformer with 975B total parameters, 41B active. It supports a context window of up to 1M tokens. It was pretrained on 45 trillion tokens of text, images, audio, and video.」
- 家族关系：原文「It is the first in a family of models of different sizes: alongside it we are sharing a preview of Inkling-Small, a lighter-weight model with 12B active parameters, trained with a similar recipe.」
- 模态与推理：原文「Inkling reasons natively over text, images, and audio, and balances cost with performance through efficient and controllable thinking effort.」
- 自我定位（原文）：「Inkling is not the strongest overall model available today, open or closed. Instead, a combination of qualities makes it a good open-weights base for customization: multimodal capabilities, efficient thinking, and availability on Tinker for fine-tuning.」
- 权重与试用：页面提供 “Try on Tinker / Model card / Hugging Face” 三个入口。

## 评测数据

> 说明：发布页的评测数值全部落在 **DOM 真表格**（`<table>` 计数 5）里，可逐格机读，故证据行记 `evidence_type: "text"` / `status: "verified"`。取值口径 = **每个 benchmark 行取「Inkling effort=0.99」自家列**，同表竞品列写进该行 notes，不拆成独立行。

- **表 0（Multimodal 小节表）**：Audio MC / MMAU / VoiceBench / MMMU Pro / Charxiv RQ / Charxiv RQ with python 六行，与表 3 总表数值逐一相同，按「只按总表建一次行」不重复建行。
- **表 1（Forecasting）**：ForecastBench 与 Prophet Arena 三行，**仅见于该小节表**，单独建行。
- **表 2（Safety 小节表）**：FORTRESS Adversarial / Benign、StrongREJECT 三行与表 3 总表数值相同，不重复建行。
- **表 3（Benchmarking 总表，Evaluation snapshot，9 模型列）**：25 行，建行。
- **表 4（Inkling vs Inkling-Small Preview）**：Inkling 列与表 3 相同；Inkling-Small Preview 列属另一 release 的早期预览值，落在 `inkling-small` 档案口径外，见该档 notes。

### 数值全量转录表（总表 + 仅见于小节表的行）

| 评测 | 分数 | 备注 |
|---|---|---|
| HLE text only | 29.7% |  |
| HLE with tools | 46.0% |  |
| AIME 2026 | 97.1% |  |
| GPQA Diamond | 87.2% |  |
| SWEBench Verified * | 77.6% | 竞品列：行名带星号 *，页面以脚注标注该行口径（原表脚注在本轮归档 index.md 中照录）。 |
| SWEBench Pro Public | 54.3% |  |
| Terminal Bench 2.1 * Best Harness | 63.8% | 竞品列：行名带星号 * 并注明 Best Harness；官方另给 effort 扫描图（内联 SVG，仅有坐标轴刻度、数据点无数值标签），effort 各档数值不在 DOM 中，需人工读图。 |
| GDPVal-AA v2 | 1238 |  |
| MCP Atlas | 76.0% |  |
| Tau 3 Banking | 23.7% |  |
| Toolathlon Verified | 45.5% |  |
| BrowseComp w/ ctx management | 77.1% |  |
| SimpleQA Verified | 43.9% |  |
| AA Omniscience | 2.1 | 竞品列：new-benchmark: AA Omniscience 为 Artificial Analysis 口径，页面行名即 “AA Omniscience”，该列数值量纲为 index（可正可负）。 |
| IFBench | 79.8% |  |
| Global-MMLU-Lite | 88.7% |  |
| MMMU Pro Standard 10 | 73.5% |  |
| Charxiv RQ | 78.1% | 竞品列：行名带 † 标记的同族行另建。 |
| Charxiv RQ † with python | 82.0% |  |
| Audio MC † | 56.6% | 竞品列：new-benchmark: Audio MC（音频多项选择）暂无既有评估实体，页面行名即 “Audio MC †”。 |
| MMAU | 77.2% | 竞品列：new-benchmark: MMAU 暂无既有评估实体，页面行名即 “MMAU”。 |
| VoiceBench † | 91.4% | 竞品列：new-benchmark: VoiceBench 暂无既有评估实体，页面行名即 “VoiceBench †”。 |
| FORTRESS Adversarial | 78.0% | 竞品列：new-benchmark: FORTRESS 为该厂商自建安全评测，暂无既有评估实体。 |
| FORTRESS Benign | 95.9% | 竞品列：new-benchmark: FORTRESS 为该厂商自建安全评测，暂无既有评估实体。 |
| StrongREJECT | 98.6% | 竞品列：new-benchmark: StrongREJECT 暂无既有评估实体，页面行名即 “StrongREJECT”。 |
| ForecastBench Brier Index ↑ · no search | 61.1 ± 0.79 | new-benchmark: ForecastBench 暂无既有评估实体；页面给出「61.1 ± 0.79」形式（Brier Index，越高越好），此处取中心值 61.1，± 置信区间照录于 display。 |
| ForecastBench Brier Index ↑ · with search | 63.7 ± 0.82 | new-benchmark: 同上，页面给出「63.7 ± 0.82」。 |
| Prophet Arena Brier Score ↓ | 0.1617 | new-benchmark: Prophet Arena 暂无既有评估实体；Brier Score 越低越好。 |
