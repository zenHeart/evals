---
vendor: google
model: Gemini 4 Carbon
release: mka-benchmark
date: 2026-11-10
source: https://blog.google/innovation-and-ai/models-and-research/gemini-models/multimodal-knowledge-agent-benchmark/
fetched_at: 2026-11-10
---

# Introducing the Multimodal Knowledge Agent benchmark（Google 官方发布文归档）

> 本档归档的是一次**基准发布**（MKA = Multimodal Knowledge Agent），不是新模型发布。页面里被评测的自家模型只有 Gemini 4 Carbon。

## 发布日期证据链

发布日期 **2026-11-10**，四证一致：

- 页面 JSON-LD：`"datePublished": "2026-11-10T16:00:00+00:00"`
- 页面 meta：`<meta property="article:published_time" content="2026-11-10" />`
- 页面 meta：`<meta name="published_time" content="2026-11-10T16:00:00+00:00" />`
- 页面可见印刷日期：**Nov 10, 2026**

外部互证：blog.google 官方 RSS（<https://blog.google/rss/>）中同名条目 `<title>Introducing the Multimodal Knowledge Agent benchmark</title>` 的 `<pubDate>Tue, 10 Nov 2026 16:00:00 +0000</pubDate>`，`<guid>` 与本文 URL 一致，作者 Rohan Doshi（Senior Product Manager, Google DeepMind）与 Ben Caine（Principal Engineer, Google DeepMind）。

附注：页面 JSON-LD 另有 `"dateModified": "2026-11-10T18:23:52.536044+00:00"`，同日改动不影响首发日期。

- 发布文：<https://blog.google/innovation-and-ai/models-and-research/gemini-models/multimodal-knowledge-agent-benchmark/>

## 这个基准测什么

MKA 补的是知识工作评测里一个具体缺口：**很多知识工作基准只用纯文本就能解开，从来不需要真的看图或看版面**。而真实的职业工作恰恰相反——要对照建筑蓝图、追踪工程原理图、把结论汇成漂亮的 deck、报告和表格。MKA 就用这类「关键信息只存在于图和版式里」的交付物来考智能体。

它的形态更像一个真实项目而不是一道题：给智能体一个装满文件的工程目录，让它自己开文件、调用工具，最后交出一份专业人士会验收的交付物（.xlsx / .pptx / .pdf / .docx / .html / .png 等）。

中文要点（对应官方英文原句见下节）：

- **覆盖范围**：10 个行业（verticals）、83 个职业；200 题评测集，由领域专家与 Google 共同构建。
- **单题成本**：每题是一个资深从业者需要 **3 到 8 小时**完成的多步项目。
- **评分标准**：每题配一份专家手写的评分标准，约 **70 条是/否检查**，权重按 **75% 事实准确性 / 25% 视觉设计** 分配。
- **运行环境**：所有模型跑在**同一个开源智能体框架 Stirrup** 上，工具、沙箱、回合预算完全相同。
- **判分方式**：由一个**基于非 Google 模型**的智能体自动评分器（agentic autorater）判分——它会打开每个文件、渲染页面、检查表格公式，再对照专家评分标准打分。
- **防污染**：200 题评测集由 Artificial Analysis 运行并**私有保管**，另在 Hugging Face 发布 **10 个公开任务**供查看格式与自测。
- **模型可用性**：Gemini 4 Carbon 已可通过 Gemini API 在 Google AI Studio 使用。

### 官方英文原文（逐句转录）

> In partnership with Artificial Analysis, we're launching MKA (Multimodal Knowledge Agent), a new benchmark built to evaluate how agents reason across visually complex files to solve real-world knowledge work tasks.

> Most knowledge work benchmarks can be solved with text alone, without ever needing to look at an image or page layout. Yet, everyday professional work looks very different. Across many industries, day-to-day work is deeply visual — from cross-referencing architectural blueprints and tracing engineering schematics to synthesizing findings into polished decks, reports, and spreadsheets. We built MKA to measure how well agents can handle this visually complex work.

> To ground the benchmark in real-world workflows, we partnered with domain experts across 10 verticals and 83 occupations where day-to-day work is inherently visual. Together, these specialists — from architects and biologists to underwriters and data scientists — created MKA's 200-task evaluation set to assist them in their jobs.

> Each task reflects a multi-step project that takes a seasoned professional three to eight hours to complete, pairing a realistic prompt and a bundle of multimodal input files with an expert-written rubric of roughly 70 yes/no checks, weighted 75% on factual accuracy and 25% on visual design.

> Starting today, you can explore the benchmark and evaluate your own models on Artificial Analysis. Every model runs in the same open-source agent harness, Stirrup, with the same tools, sandbox, and turn budget.

> An agentic autorater built on a non-Google model grades each deliverable. It opens every file, renders pages, inspects spreadsheet formulas, and checks the work against the expert rubric. When domain experts graded model outputs themselves, they agreed with the autorater 96% of the time.

> To keep results meaningful, Artificial Analysis runs the 200-task evaluation set and keeps it private so the tasks can't leak into training data or be found by the model via search. We've also released a separate set of 10 public tasks on Hugging Face, so anyone can inspect the format and test their own agents.

> Our technical report covers the methodology and results in detail. It shows that frontier models work in very different ways. On the same tasks, the models we tested have extreme differences in efficiency, using between 30 and 130 turns on average to complete each task. We show how strong perception abilities are necessary to solve each task, and we also show how models try and fail to compensate when vision is removed.

> Gemini 4 Carbon achieves #2 in quality among the models we tested, and completes tasks at 6x lower cost on average compared to the top scoring model.

> Gemini 4 Carbon is on the pareto frontier of quality and price for the MKA eval.

## 评测数据转录表

页面正文**没有印出任何 MKA 绝对分值**——唯一的分数出现在结果图里（`images/04-mka-results-quality-vs-cost-per-task.webp`）。按仓库口径「图片/图表行必须 pending，视觉转写只进 notes」，本档对应的 evidence 行记 `evidence_type: figure` / `score_status: not_extracted` / `status: pending`，下列转写值待人工读图确认后再回填。

| 评测 | 分数 | 备注 |
|---|---|---|
| MKA · Climb WSR（Gemini 4 Carbon） | （视觉转写）54.3% | 本档唯一成绩行；正文无绝对分值，数值只在结果图左栏（Quality / Climb WSR · higher is better） |
| MKA · Climb WSR（Claude Fable 5.2，竞品列） | （视觉转写）56.6% | 同一张结果图左栏；按「一个 benchmark 行 = 一条 evidence」只记入本行 notes，不拆独立 evidence 行 |
| MKA · Climb WSR（Claude Opus 5.5，竞品列） | （视觉转写）53.0% | 同上 |
| MKA · Climb WSR（GPT-6 Astra，竞品列） | （视觉转写）50.2% | 同上 |
| MKA · 每任务成本（Gemini 4 Carbon） | （视觉转写）$5.63 | 结果图右栏（Cost per task / USD · lower is better） |
| MKA · 每任务成本（Claude Fable 5.2，竞品列） | （视觉转写）$35.28 | 同上；只记 notes |
| MKA · 每任务成本（Claude Opus 5.5，竞品列） | （视觉转写）$10.29 | 同上；只记 notes |
| MKA · 每任务成本（GPT-6 Astra，竞品列） | （视觉转写）$6.15 | 同上；只记 notes。官方技术报告 Table 4 记 $6.03，厂商两处口径不一致，待裁定 |
| MKA · 质量排名 | #2 | 官方原句「achieves #2 in quality among the models we tested」——**排名论断，不建分数行** |
| MKA · 相对成本 | 6x | 官方原句「completes tasks at 6x lower cost on average compared to the top scoring model」——**相对论断，不建分数行** |
| MKA · 评分器与专家一致率 | 96% | 官方原句「they agreed with the autorater 96% of the time」——描述的是**评分器的可靠性**，不是任何模型的得分，不建分数行 |
| MKA · 评测集规模 | 200 题 | 「created MKA's 200-task evaluation set」；该评测集私有，由 Artificial Analysis 运行 |
| MKA · 覆盖范围 | 10 verticals / 83 occupations | 「domain experts across 10 verticals and 83 occupations」 |
| MKA · 单题人工耗时 | 3–8 小时 | 「takes a seasoned professional three to eight hours to complete」 |
| MKA · 评分项数量 | 约 70 条是/否检查 | 「an expert-written rubric of roughly 70 yes/no checks」 |
| MKA · 评分项权重 | 75% 事实准确性 / 25% 视觉设计 | 「weighted 75% on factual accuracy and 25% on visual design」 |
| MKA · 公开任务数 | 10 题 | 「a separate set of 10 public tasks on Hugging Face」 |
| MKA · 平均回合数区间 | 30–130 回合 | 「using between 30 and 130 turns on average to complete each task」——**跨模型区间**，非 Carbon 单值，不建分数行 |
| Gemini 4 Carbon 列表价（结果图内脚注） | $4 / $20 per 1M tokens | 图内脚注「All models at standard list price, including Gemini 4 Carbon at $4 / $20 per 1M tokens」——**非评测分**，不入 evidence；该价格已记于既有 release `gemini-4-carbon.json` 的 `models[].pricing` |

### 结果图脚注（原文）

> Methodology: MKA split from Artificial Analysis. Stirrup harness. Score is Climb WSR. All models at standard list price, including Gemini 4 Carbon at $4 / $20 per 1M tokens.

### 结果图内标题（原文）

> Multimodal Knowledge Agent (MKA) Eval
> Gemini 4 Carbon delivers frontier quality at much lower cost

## 页面图片清单

| 文件 | 内容 |
|---|---|
| `images/01-hero-mka-benchmark-visual-knowledge-work.webp` | 首屏主视觉（Visual Knowledge Work） |
| `images/02-mka-10-verticals-illustrations.webp` | MKA 的 10 个行业（verticals）示意 |
| `images/03-mka-example-tasks-prompts-files-rubrics.webp` | 三个示例任务：prompt + 输入文件 → 黄金输出 + 约 70 条评分检查 |
| `images/04-mka-results-quality-vs-cost-per-task.webp` | **结果图**：左栏 Quality（Climb WSR）、右栏 Cost per task（USD）——本档所有绝对分值的唯一来源 |

## 非评测内容（不入 evidence）

- 「Gemini 4 Carbon is on the pareto frontier of quality and price for the MKA eval」——定性表述，无分值。
- 「Gemini 4 Carbon is available today via the Gemini API in Google AI Studio」——可用性说明。
- 页面未印 temperature / top_p / shots / run_count / 回合上限等协议数值；除 harness = `stirrup` 外协议键一律 null。
