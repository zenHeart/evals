---
vendor: thinking-machines
model: Inkling-Small
release: inkling-small
date: 2026-07-30
source: https://thinkingmachines.ai/news/inkling-small/
fetched_at: 2026-11-14
---

# Inkling-Small

> 归档说明：`page.html` 为官方发布页 `https://thinkingmachines.ai/news/inkling-small/` 的原始存档（HTTP 200，Astro 静态站，服务端渲染 HTML），抓取于 2026-11-14。页面**正文图片 0 张**——性能/成本曲线是**内联 SVG**（本页 `<svg>` 计数 22），effort 扫描图只含坐标轴刻度、数据点无数值标签，不可逐格机读，需人工读图。og:image 一张已原样下载到 `images/`。

## 发布日证据链（两源互证）

| 来源 | 原文 | 说明 |
|---|---|---|
| 发布页 HTML | `itemprop="datePublished" content="2026-07-30T00:00:00+00:00"` | 页面 `<head>` 内 schema.org 节点 |
| Thinking Machines 官方 news 索引 | `Introducing Inkling-Small Jul 30, 2026` | 官方 news 索引页条目，与 HTML 一致 |

## 发布要点（转录）

- 开篇原文：「Today, we are releasing Inkling-Small, an efficient open-weights model that achieves comparable performance to Inkling at a quarter of its size.」
- 架构与规模：原文「Inkling-Small is a Mixture-of-Experts transformer with 276B total parameters, 12B active, trained on NVIDIA GB300 NVL72 systems.」
- 模态与上下文：原文「Like Inkling, it features native reasoning over audio and images, variable thinking effort, a context window of up to 1M tokens, and well-rounded performance across a range of benchmarks.」
- 定位原文：「Across agentic tool use (Terminal-Bench 2.1), reasoning (HLE text-only, no tools), and instruction following (IFBench) benchmarks, Inkling-Small is more efficient than Inkling and competitive with other models in its weight class.」
- 权重与试用：原文「We are releasing the full weights of Inkling-Small. We're also making it available for fine-tuning on Tinker, and for text, image, and audio chat on Tinker Playground.」

## 评测数据

> 说明：评测数值全部落在 **DOM 真表格**（`<table>` 计数 4）里，可逐格机读，故证据行记 `evidence_type: "text"` / `status: "verified"`。取值口径 = **每个 benchmark 行取「Inkling-Small」自家列**，同表竞品列写进该行 notes，不拆成独立行。

- **表 0（Multimodal 小节表）**：五行与表 3 总表数值相同，不重复建行。
- **表 1（Forecasting）**：ForecastBench 与 Prophet Arena 三行，**仅见于该小节表**，单独建行。
- **表 2（Safety 小节表）**：FORTRESS / StrongREJECT 三行与表 3 总表数值相同，不重复建行。
- **表 3（Benchmarking 总表，Evaluation snapshot，10 模型列）**：33 行，建行（含 “Params (B) activated / total” 规格行，规格不建行）。

### 数值全量转录表（总表 + 仅见于小节表的行）

| 评测 | 分数 | 备注 |
|---|---|---|
| AA Index v4.1 | 40.0% | 页面该行属 “Model Info” 分节，量纲为百分比形式的 AA 综合指数（AA Index v4.1）。 |
| SWEBench Verified * | 80.2% | 行名带星号 *。 |
| SWEBench Pro public | 55.9% |  |
| Terminal Bench 2.1 * best harness | 64.7% | 行名带星号 * 并注明 best harness；官方另给 effort 扫描图（内联 SVG，仅坐标轴刻度，数据点无数值标签），effort 各档数值需人工读图。 |
| SciCode | 48.7% |  |
| GDPval-AA v2 | 1269 |  |
| MCP Atlas public / all | 79.6% | 页面同一单元格写作 “79.6/79.2%”（public / all），拆成两行；本行取 public 值。 |
| MCP Atlas public / all | 79.2% | 页面同一单元格写作 “79.6/79.2%”（public / all），拆成两行；本行取 all 值。同厂较晚的 Inkling 2 Small 发布文把这两档写作 “Full / Public”，档名口径不一致，两处各自照录不调和。 |
| Tau 3 Banking | 15.5% |  |
| BrowseComp with context management | 77.4% |  |
| Toolathlon Verified | 54.4% |  |
| AA-Briefcase | 917 |  |
| GPQA Diamond | 89.5% |  |
| HLE text only | 31.6% |  |
| HLE † with tools | 47.8% |  |
| AIME 2026 | 95.5% |  |
| HMMT Feb 2026 | 90.2% |  |
| CritPt | 8.3% | 同厂 Inkling 2 Small 发布文把 CritPt 记为 “v2 Full / v2 Hard” 两档，本页只给单行 “CritPt”，未标版本。 |
| ARC-AGI-1 | 84.0% |  |
| ARC-AGI-2 | 40.1% |  |
| SimpleQA Verified | 20.6% |  |
| AA Omniscience index | -9.0 | new-benchmark: AA Omniscience 暂无既有评估实体；页面行名为 “AA Omniscience index”，该列量纲为 index（可正可负）。 |
| IFBench | 82.2% |  |
| Global-MMLU-Lite | 86.7% |  |
| StrongREJECT | 98.4% | new-benchmark: StrongREJECT 暂无既有评估实体，页面行名即 “StrongREJECT”。 |
| FORTRESS adversarial | 71.6% | new-benchmark: FORTRESS 为该厂商自建安全评测，暂无既有评估实体。 |
| FORTRESS benign | 96.9% | new-benchmark: FORTRESS 为该厂商自建安全评测，暂无既有评估实体。 |
| MMMU Pro Standard 10 | 74.0% |  |
| Charxiv RQ original / with python | 77.4% | 页面同一单元格写作 “77.4/81.3%”（original / with python），拆成两行。 |
| Charxiv RQ original / with python | 81.3% | 页面同一单元格写作 “77.4/81.3%”（original / with python），拆成两行。 |
| Audio MC † | 54.9% | new-benchmark: Audio MC 暂无既有评估实体，页面行名即 “Audio MC †”。 |
| MMAU | 77.0% | new-benchmark: MMAU 暂无既有评估实体，页面行名即 “MMAU”。 |
| VoiceBench † | 90.1% | new-benchmark: VoiceBench 暂无既有评估实体，页面行名即 “VoiceBench †”。 |
| ForecastBench no search · Brier Index ↑ | 61.3 ± 0.46 | new-benchmark: ForecastBench 暂无既有评估实体；页面给出「61.3 ± 0.46」（Brier Index，越高越好）。 |
| ForecastBench with search · Brier Index ↑ | 61.5 ± 0.54 | new-benchmark: 同上，页面给出「61.5 ± 0.54」。 |
| Prophet Arena Brier Score ↓ | 0.1238 ± 0.0086 | new-benchmark: Prophet Arena 暂无既有评估实体；Brier Score 越低越好。 |
