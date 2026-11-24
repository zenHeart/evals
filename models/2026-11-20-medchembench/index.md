---
vendor: openai
model: GPT‑6.2 Astra
release: medchembench
date: 2026-11-20
source: https://openai.com/index/introducing-medchembench
fetched_at: 2026-11-24
---

# Introducing MedChemBench（OpenAI，2026-11-20）

> 发布日证据链：页面正文头部印刷日期行「November 20, 2026」；页脚「© 2015–2026」与「Keep reading」区块中同站相邻条目日期（Nov 22 / Nov 18）佐证时序；页面无 JSON-LD `datePublished`、无 `article:published_time` meta。
> 规范地址：<https://openai.com/index/introducing-medchembench>（归档 HTML 的 `og:url` 与 `rel=canonical` 均指向该地址）。
> 页面协议信息：正文散文明文 + 5 张 vega-lite 图（数值以 RSC 载荷内嵌 JSON 承载，非图片）。协议细节官方只披露「单次尝试、无工具、无反馈、无新实验」，未给出脚手架名称、采样参数与运行次数。

## 发布要点（中文转述，官方原文保留）

- **这是什么**——原文：「Introducing MedChemBench, a benchmark that tests how well AI models read molecular structures, interpret experimental results, and choose which compounds to test next.」
  中文：MedChemBench 考察模型读分子结构、解释实验结果、并决定下一个该测哪个化合物的能力。
- **题量与来源**——原文：「MedChemBench measures these abilities through 99 problems drawn from published research.」「MedChemBench draws on 117 papers and patents and includes 761 distinct molecular structures.」
  中文：99 题，取自已发表研究；底层是 117 篇论文与专利、761 个不同分子结构。
- **四个分项**——原文：「Molecular structures. Correct atom connections and specified stereochemistry…」「Scientific reasoning. Explanations supported by the supplied evidence…」「Ranking and selection. Compound rankings and choices that meet the stated requirements.」「Property predictions. Agreement with the numerical values and categories reported in the source material…」
  中文：分子结构重建 / 科学解释 / 排序与选择 / 属性预测。
- **给分方式**——原文：「Predictions receive partial credit based on their closeness to the measured values.」「Measurements already supplied in the prompt must also be reproduced correctly.」
  中文：按与实测值的接近程度给部分分；提示里已给出的测量值也必须正确复现。
- **上下文构造**——原文：「For most problems, models receive the context available at a chosen point in a research program: the biological target, the researchers' goals, the compounds studied so far, and selected experimental findings.」
  中文：多数题目把模型放到研究进程中的某一个时间点，只给到那时的生物靶点、研究目标、已测化合物与部分实验发现。
- **官方自述的局限**——原文：「These results do not establish whether models can discover new drugs or improve laboratory decisions. Prior exposure to the published sources cannot be ruled out, and each response was a single attempt without tools, feedback, or new experiments.」
  中文：不能据此判断模型能否发现新药；无法排除事先见过发表来源；每次回答都是单次尝试，无工具、无反馈、无新实验。

## 评测数据全量转录

> 说明：本页 5 张图表的数值都以 vega-lite `data.values` 形式内嵌在页面 RSC 载荷里，已逐值机读提取（见 `manifest.json` 的 method），因此「有绝对分值」一栏全部可建 evidence 行。
> 按账本约定**只建自己模型（GPT‑6.2 Astra）的行**；其余 8 个模型的同图读数只作对照记录在 notes，不建 comparison_cited 行。

### 总榜（图「MedChemBench」，linkId=`medchembench-overall`，51 点 / 9 模型）

| 推理档 | GPT‑6.2 Astra | 输出 tokens | 95% 区间 | 备注 |
| --- | --- | --- | --- | --- |
| low | 78.37 | 1530 | 75.25 – 81.38 | **已建 evidence 行** |
| medium | 80.01 | 2080 | 77.07 – 82.82 | **已建 evidence 行** |
| high | 82.99 | 6610 | 80.35 – 85.49 | **已建 evidence 行** |
| xhigh | 84.51 | 11000 | 82.08 – 86.79 | **已建 evidence 行**；散文句「GPT‑6.2 Astra earned 84.5%」与此一致 |
| max | 85.60 | 28300 | 83.27 – 87.77 | **已建 evidence 行** |

> 图脚注（原文）：「Each point represents a model at one reasoning setting, showing 51 combinations across nine models from GPT‑5.6 onward. Scores are averaged across 99 problems; bars show 95% uncertainty intervals. Tokens include reasoning and the final answer.」

### 同档对照（同一张总榜图，仅记 notes）

| 模型 @ xhigh | 得分 | 页面散文句 |
| --- | --- | --- |
| GPT‑6.2 Astra | 84.51 | 「GPT‑6.2 Astra earned 84.5% of the available credit」 |
| GPT‑6 Astra | 83.33 | 「Astra earned 83.3% of the available credit at the shared xhigh setting」 |
| GPT‑6.1 Sol | 81.99 | 「compared with 82.0% for GPT‑6.1 Sol」 |
| GPT‑6.1 Terra | 75.10 | 「75.1% for GPT‑6.1 Terra」 |
| GPT‑6 Sol | 64.44 | 未印出 |
| GPT‑5.6 Sol | 58.23 | 「58.2% for GPT‑5.6 Sol」 |
| GPT‑5.6 Terra | 41.19 | 未印出 |
| GPT‑5.6 Luna | 38.42 | 未印出 |
| GPT‑6 Luna | 35.02 | 未印出 |

GPT‑6 Astra 另有两个散文句读数：总榜 max 档 83.83（原文「At max effort, GPT‑6 Astra reached 83.8%」）、分子结构分项 xhigh 档 95.37（原文「Astra earned 95.4% of the available structure credit at xhigh」）。

### 四个分项图（均**不含** GPT‑6.2 Astra，故不建该模型的分项行）

| 图 linkId | 行数 | 得分刻度 | 含 GPT‑6.2 Astra？ |
| --- | --- | --- | --- |
| `medchembench-molecular-structure` | 46 | 0–1 小数 | 否 |
| `medchembench-scientific-explanation` | 46 | 百分数 0–100 | 否 |
| `medchembench-ranking-selection` | 46 | 百分数 0–100 | 否 |
| `medchembench-numerical-prediction` | 46 | 百分数 0–100 | 否 |

> 分项图只覆盖 8 个模型（GPT‑5.6 Luna/Sol/Terra、GPT‑6 Astra/Luna/Sol、GPT‑6.1 Sol/Terra）。页面把「Astra 在分子结构上最强、在选择与数值预测上只拿到约一半 credit」的叙述归于上一代 GPT‑6 Astra（原文「GPT‑6 Astra was strongest at reconstructing molecular structures and explaining experimental evidence. Selecting compounds and predicting their numerical properties proved harder for that model.」），与分项图不含 GPT‑6.2 Astra 这一事实一致。

## 指代消歧（本页最关键的一处判读）

页面两处单独写「Astra」而不带代次：

1. 「While measuring the benchmark for structure components, Astra earned 95.4% of the available credit at xhigh.」
2. 「Across the full benchmark, Astra earned 83.3% of the available credit at the shared xhigh setting, compared with 82.0% for GPT‑6.1 Sol, 75.1% for GPT‑6.1 Terra, and 58.2% for GPT‑5.6 Sol. At max effort, GPT‑6 Astra reached 83.8%.」

两处都指**上一代 GPT‑6 Astra**，不是本页主角 GPT‑6.2 Astra。判据有三：

- 第 2 句紧接着的下一句就写全了「GPT‑6 Astra reached 83.8%」，而同图 GPT‑6 Astra 的 max 档正是 83.83；
- 分项图 `medchembench-molecular-structure` 里 GPT‑6 Astra @ xhigh = 95.37，与第 1 句的 95.4% 吻合，而该图根本没有 GPT‑6.2 Astra 的点；
- 第 2 句列出的 82.0 / 75.1 / 58.2 与总榜图 xhigh 档的 81.99 / 75.10 / 58.23 逐一吻合，同档 GPT‑6 Astra 是 83.33，与句首「Astra earned 83.3%」吻合。

因此 95.4% / 83.3% / 83.8% **不**作为 GPT‑6.2 Astra 的官方读数建行；GPT‑6.2 Astra 在本页唯一被正文明点名的数值是总榜 xhigh 的 84.5%，其余四档（78.37 / 80.01 / 82.99 / 85.60）只存在于图表数据中。

## 一个题目的定性结论（无分值，仅记 notes）

- 原文：「One problem asks models to assemble a molecule from a central structure and two attached groups while preserving an 18-atom ring. At the highest reasoning setting shared by all eleven models (xhigh), GPT‑6 Astra reconstructed this compound correctly in all ten responses. GPT‑5.6 Sol and GPT‑5.6 Luna failed across all ten responses. In the illustrated answers, GPT‑5.6 Sol produced a 15-atom ring, while GPT‑5.6 Luna split the molecule into two disconnected fragments.」
  中文：某题要求从一个中心结构和两个取代基组装分子并保住 18 原子环；xhigh 档下 GPT‑6 Astra 十次全对，GPT‑5.6 Sol 十次全错（搭成 15 原子环），GPT‑5.6 Luna 十次全错（拆成两个不相连片段）。这是定性通过率描述且主角是上一代模型，**不建 evidence 行**。

## 与既有条目的关系

- `benchmark_id=medchembench` 在站内已存在：`openai/gpt-rosalind-5-5`（2026-10-27 前后入账）曾从同一基准的早期结果页收录 GPT‑Rosalind 的 27.5% 读数，并在 notes 里注明「题集与 rubric 官方未公开」。
- 本页是 MedChemBench 的**基准发布文**，首次官方说明题量（99 题）、来源规模（117 篇论文与专利 / 761 个分子结构）、四个分项与部分分判分方式；但题集、rubric 与判分流程仍未公开，故**不建 `data/benchmarks/medchembench.json` 实体**，只在 `data/model-releases/official/README.md` 的新增 benchmark 清单里保持登记。
- 两者指向同一 benchmark_id，按「只追加、不改既有文件」的约定并存。

## 归档说明

- `page.html` = 官方发布页原始存档（HTTP GET，浏览器 User-Agent；服务端渲染 HTML，非 JS 渲染），sha256 `abd2c666f473f56d09216b26b0939bbe606d03608cf13238d811e7de28ea411c`，489716 字节。
- `images/` = 空。页面三张配图（Figure 1「The same input, different molecules」等）与 5 张图表全部由客户端按 vega-lite 规格渲染，HTML 中没有可下载的图片文件；图表数值直接取自 RSC 载荷，不依赖图片。
- 本页未公布 GPT‑6.2 Astra 的定价、参数量或上下文窗口，账本 `models[].pricing` / `params` / `context_window` 一律记 null。
- 全部数值为厂商自报（`vendor_reported`），未经第三方独立复现；官方明示无法排除事先见过发表来源（污染风险）。
- 本归档仅存 2026-11-24 当日抓取快照。
