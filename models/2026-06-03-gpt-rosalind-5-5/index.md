---
vendor: openai
model: GPT-Rosalind 5.5
release: gpt-rosalind-5-5
date: 2026-06-03
source: https://openai.com/index/introducing-new-capabilities-to-gpt-rosalind/
fetched_at: 2026-11-15
---

# GPT‑Rosalind（2026-06-03 版本）官方发布文证据归档

本归档是 **OpenAI 官方发布文 `Introducing new capabilities to GPT‑Rosalind`** 的一级来源快照，用于给 `openai/gpt-rosalind-5-5` 建档。该发布属**存量回填**（发布日 2026-06-03，早于本批增量窗口；候选 `openai-ba562226725d`）。

## 来源与日期证据

| 证据 | 位置 | 内容 |
|---|---|---|
| 页面印刷日期行 | `page.html` 可见文本第 23 行 | `June 3, 2026` |
| 类目标签 | 同页紧随其后 | `Product` / `Research` / `Release` |
| 页面 H1 | `page.html` | `Introducing new capabilities to GPT‑Rosalind` |
| 页面副标题 | 同页 | `Bringing greater intelligence grounded in real scientific workflows for the life sciences industry.` |
| 正文首句 | 「Improving performance on scientifically-valuable tasks」段 | `We're introducing a new model update to our GPT‑Rosalind series purpose-built for life sciences research at enterprise scale.` |

发布日期取 **2026-06-03**（页面自身印刷日，date_precision=day）。

**与既有档案的区分**：账本已有 `openai/gpt-rosalind`（2026-04-16，首发版）。本次是官方明示的「a new model update」——**另起 release 归档**，不改写既有文件。官方页面把模型一律称作 `GPT‑Rosalind`，图表内的 model 字段也是 `GPT‑Rosalind`；本账本按候选登记的族名记为 `GPT‑Rosalind 5.5`（正文写明「combines GPT‑5.5's agentic coding and tool-use capabilities」），并在 notes 里注明官方页面不印「5.5」这一后缀。

**页面后续编辑**：正文含一段 `Update on September 11, 2026: GPT‑Rosalind … is coming out of research preview and is now available globally to eligible organizations through our trusted-access program. … Published pricing will take effect on October 5, 2026.` —— 这是**发布之后**的更新说明，不改变 2026-06-03 的发布日期；本归档按「取数当天页面内容」原样存档，并在账本 notes 标注。

## 取数口径

五张评测图**全部是页面内嵌的 vega-lite 数据集**（`vegaLiteSpec.data.values`，写在 Next.js RSC 载荷里），**没有位图**。数值逐格机读，按契约记 `evidence_type: "text"` / `status: "verified"`。

| # | 图表标题 | 图型 | 数据字段 |
|---|---|---|---|
| 1 | `LifeSciBench Overall Scores` | 柱状图 + 误差条 | `model` / `benchmark` / `score_percent` / `ci_low_percent` / `ci_high_percent` |
| 2 | `LifeSciBench Scores by Scientific Workflow` | 柱状图 + 误差条 | `model` / `workflow_split` / `score_percent` / `ci_*_percent` |
| 3 | `GPT-Rosalind leads performance on complex medicinal chemistry` | 散点 + 折线 + 误差条 | `model` / `score_percent` / `ci_*_percent` / `sollen`（输出 token 数） |
| 4 | `GPT-Rosalind improves accuracy on GeneBench` | 散点 + 折线 + 误差条 | 同上 |
| 5 | `GPT-Rosalind provides stronger support for real-world lab work` | 散点 + 折线 + 误差条 | 同上 |

**显示格式**：图 1 / 图 2 的 y 轴 `labelExpr` 是 `datum.value + '%'`，即按数值原样加百分号渲染（图 1 为一位小数 `63.4%`，图 2 为两位小数 `63.37%`）；图 3–5 的 y 轴是整数刻度、无印刷数据标签，精确读数在 tooltip（`score_percent` 格式 `.1f`）。图 3–5 的 x 轴标题是 `Output tokens`（`sollen`）。

## 评测转录表

### 图 1 · LifeSciBench 总体分

| 模型 | 分数 | 95% 置信区间 | 备注 |
|---|---|---|---|
| GPT‑Rosalind | 63.4% | 61.75% – 64.96% | 自家模型列。原始 `score_percent 63.4` |
| GPT‑5.5 | 58.8% | 57.26% – 60.42% | 竞品列，只进 notes |
| Gemini 3.1 Pro | 51.7% | 50% – 53.2% | 竞品列，只进 notes |
| Grok 4.3 | 33.7% | 33.3% – 34.2% | 竞品列，只进 notes |

### 图 2 · LifeSciBench 按科研工作流分

x 轴 `labelExpr` 把 `workflow_split` 的内部值映射成页面上的工作流名（注意 `translation` 在图上显示为 `Translation & Scientific Communication`，**六个工作流**）：

| 工作流 | GPT‑Rosalind | GPT‑5.5（竞品） | 备注 |
|---|---|---|---|
| Evidence Handling | 63.37% | 60.34% | 区间 58.18% – 68.56% |
| Analysis | 60.43% | 55.94% | 区间 56.32% – 64.54% |
| Design, Optimization, & Prediction | 60.72% | 57.12% | 区间 58.01% – 63.43% |
| Reasoning | 65.43% | 59.88% | 区间 60.79% – 70.07% |
| Validation & operations | 65.36% | 60.09% | 区间 61.93% – 68.79% |
| Translation & Scientific Communication | 74.26% | 66.32% | 区间 68.69% – 79.83% |

### 图 3 · MedChemBench（药物化学）

正文原句：`GPT‑Rosalind out-performs GPT‑5.5 at 27.5% vs. 25…`（页面文本在 25 后被截断，完整为 25.1%）——**27.5% 是正文明文**，可直接落行。

图 3 的散点按「输出 token 数 vs 分数」排布，每个模型 5 个点，**页面未标注每个点对应哪道任务**：

| 模型 | 正文引用分 | 图中 5 个点（分数） | 对应输出 token 数 |
|---|---|---|---|
| GPT‑Rosalind | 27.5% | 27.5 / 26.9 / 23.6 / 20.6 / 16.0 | 27134 / 17954 / 8878 / 3322 / 2033 |
| GPT‑5.5 | 25.1% | 25.1 / 24.1 / 22.9 / 19.0 / 15.8 | 29232 / 17208 / 7621 / 2339 / 1554 |

**处置**：只按正文印出的 27.5% 建**一行**（variant `Overall`），5 个未标注任务的点值只记 notes——**不臆造任务名**。

### 图 4 · GeneBench（基因组学与定量生物学）

正文原句：`On GeneBench, our agentic evaluation on long horizon, end-to-end analysis in genomics and quantitative biology, GPT‑Rosalind uses 31% fewer tokens than GPT‑5.5 while achieving a higher accuracy of 21.6% vs. 20.4%.` —— **21.6% 正文明文**。

| 模型 | 正文引用分 | 图中 5 个点（分数） | 对应输出 token 数 |
|---|---|---|---|
| GPT‑Rosalind | 21.6% | 21.6 / 17.7 / 11.5 / 4.5 / 1.9 | 16721 / 11860 / 6516 / 2418 / 1000 |
| GPT‑5.5 | 20.4% | 20.4 / 18.3 / 7.3 / 2.2 / 0.5 | 24270 / 17251 / 13541 / 5292 / 590 |

「31% fewer tokens」是**相对 token 用量差**，不是基准分，不建行。

### 图 5 · LabWorkBench（真实湿实验室工作）

正文原句：`GPT‑Rosalind scores 63.2% vs. GPT‑5.5 at 55.8%, while using 5.3% fewer tokens.` —— **63.2% 正文明文**。

| 模型 | 正文引用分 | 图中 3 个点（分数） | 对应输出 token 数 |
|---|---|---|---|
| GPT‑Rosalind | 63.2% | 61.7 / 64.4 / 63.2 | 25761 / 40123 / 45391 |
| GPT‑5.5 | 55.8% | 53.9 / 55.4 / 55.8 | 25483 / 41393 / 47951 |

「5.3% fewer tokens」是相对 token 用量差，不建行。

## 非评测内容转录

| 项 | 页面原文 | 账本处理 |
|---|---|---|
| 定位 | `We're introducing a new model update to our GPT‑Rosalind series purpose-built for life sciences research at enterprise scale. It combines GPT‑5.5's agentic coding and tool-use capabilities with stronger model intelligence in core drug-discovery domains such as medicinal chemistry and genomics…` | 写入 `capability_summary` |
| LifeSciBench 的定位 | `we designed LifeSciBench, an externally expert-judged benchmark focused on foundational aspects in life sciences research. Unlike existing benchmarks that evaluate a single component of model performance or biological domain in isolation, LifeSciBench takes an end-to-end view of scientifically valuable work by drawing tasks from six workflow areas central to life sciences research…` | 写入 `notes` 与 benchmark 实体注记 |
| LabWorkBench 的定位 | `We introduce a new evaluation to test GPT‑Rosalind's ability to help scientists conducting lab work in the real world. LabWorkBench tests the model's ability to link perturbations to experimental outcomes in real wet lab protocols used by scientists, for the purposes ranging from troubleshooting to optimization. The data used by LabWorkBench are proprietary and thus uncontaminated.` | 写入 `notes` |
| MedChemBench 的定位 | `We designed MedChemBench to reflect realistic medicinal chemistry workflows, evaluating multimodal chemical structure understanding; structure-activity relationship (SAR); prediction of drug potency, toxicity, and absorption, distribution, metabolism, excretion (ADME); multiparameter lead-optimization decision-making; and retrosynthesis.` | 写入 `notes` |
| 分发 | `GPT‑Rosalind is available to eligible organizations globally through its trusted-access deployment structure.` | 写入 `notes` |
| 插件 | `Life Sciences Research` 与 `Life Sciences NGS Analysis` 两个 Codex 插件（检索、解释、生信执行） | 写入 `notes`，不建 evidence 行 |
| 参数量 / 上下文窗口 / 定价 | 页面**未给出**（定价另见独立页面） | 一律 `null` |

## 页面上那张 DOM 表不是评测表

页面里唯一的 `<table>` 是 **DMD（杜氏肌营养不良）基因治疗临床试验的方法学评审表**（三列：`Package Item` / `Key Failure Mode` / `What Would Be Needed`），逐条讨论抗体、活检设计、AAV 持久性、免疫安全性等——**与模型评测无关**，未取任何数值、未建任何行。

## 归档图片

| 文件 | 内容 |
|---|---|
| `images/00-3840x2160.webp` | NGS Analysis 插件工作区截图（`A computer screen shows a workspace instructing the use of an NGS Analysis plugin…`） |
| `images/01-1920x1080.webp` | 生信工作流分屏截图（`Screenshot of a split-screen bioinformatics workflow…`） |
| `images/02-3840x2160.webp` | RNA-seq 工作流分屏截图（`Split-screen view of an RNA-seq workflow…`） |

三张均为**产品演示截图**，与评测数值无关，保留仅为还原页面原貌。

## 局限与注意

- 本页**没有位图**，五张评测图都是内嵌数据集，数值机读、可逐格复算；不存在「读图估数」问题。
- 图 3–5 的散点**每个模型有多条未命名任务线**，本账本只按正文印出的那个数建行，其余点值留在 notes 里，避免臆造任务名。
- 官方**未明示评测协议**（harness / 工具 / 温度 / 跑次数 / 判分器）——`protocol` 12 键一律 `null`。LifeSciBench 是「externally expert-judged」（外部专家按 rubric 评分），但题集、题量、rubric 全文均未公开，**外部无法复跑**。
- 本条与既有 `openai/gpt-rosalind`（2026-04-16 首发）是**两次不同发布**，数值不可混用；两者的 LifeSciBench 分属不同版本。
