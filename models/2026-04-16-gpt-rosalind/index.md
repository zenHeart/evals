---
vendor: openai
model: GPT-Rosalind
release: gpt-rosalind
date: 2026-04-16
source: https://openai.com/index/introducing-gpt-rosalind/
fetched_at: 2026-10-22
---

# GPT-Rosalind

发布日期证据：OpenAI 官方发布文 `https://openai.com/index/introducing-gpt-rosalind/` 页面正文头部印出日期行 `April 16, 2026`，标题为 "Introducing GPT‑Rosalind for life sciences research"，副标题 "A new purpose-built model to accelerate scientific research and drug discovery."，构成一级来源的日期证据。官方新闻 RSS（`openai.com/news/rss.xml`）中该文条目时间为 Thu, 16 Apr 2026 01:00:00 GMT，与页面印刷日互证。

OpenAI 发布 **GPT‑Rosalind**：面向生命科学研究的前沿推理模型系列，服务于生物学、药物研发与转化医学的科学工作流。官方定位强调「把更好的工具调用能力与对化学、蛋白质工程、基因组学的更深理解结合起来」，并为 Codex 提供免费的生命科学研究插件（可连接 50 多个科学工具与数据源）。

官方明示信息：

| 项 | 值 |
|---|---|
| 形态 | 前沿推理模型（生命科学系列） |
| 开放方式 | trusted access program（受信访问计划）：面向符合条件机构的 ChatGPT、Codex 与 API 研究预览 |
| 配套 | Codex 的 Life Sciences research plugin，连接 50+ 科学工具与数据源 |
| 合作方 | Amgen、Moderna、Allen Institute、Thermo Fisher Scientific 等 |
| 命名 | 以 Rosalind Franklin 命名 |
| 参数量 / 上下文 / 定价 | 官方未在本页印出（定价另见独立页面），账本记 null |

页面在 2026-10-22 抓取时已包含后续更新（顶部横幅说明模型「coming out of research preview」并已全球开放给符合条件机构，页尾提到 2026-10-15 的学术计划），这些是页面后续编辑内容，不改变 2026-04-16 的发布日期。

## 性能与评估（官方内嵌 Vega 图表，DOM 内含数值）

官方「性能与评估」章节的柱状图是页面内嵌的 Vega 图表：数值既在渲染后的 SVG 无障碍文本里，也在 RSC payload 的 `vegaLiteSpec.data.values` 里（可机读），因此按 DOM 机读口径逐行转录。图表横轴为 5 个能力维度，纵轴为「得分」（0–1 标度），每个柱给出 95% 置信区间。

| 能力维度 | GPT5 | GPT-5.2 | GPT-5.4 | **GPT‑Rosalind** | 官方对该维度的说明 |
|---|---:|---:|---:|---:|---|
| Chemistry | 0.320 (0.314–0.326) | 0.503 (0.496–0.510) | 0.548 (0.542–0.555) | **0.662 (0.655–0.668)** | 检验化学基本理解：预测主要反应产物、有机反应中的电子流、3D 构象 |
| Biochemistry and protein understanding | 0.339 (0.334–0.344) | 0.278 (0.273–0.283) | 0.305 (0.300–0.310) | **0.367 (0.362–0.373)** | 核心蛋白分析任务：评估突变影响、预测蛋白-蛋白界面的结合 |
| Phylogenetics | 0.133 (0.125–0.140) | 0.127 (0.118–0.136) | 0.110 (0.101–0.118) | **0.163 (0.153–0.173)** | 理解给定 DNA 序列的演化背景 |
| Experimental design and analysis | 0.107 (0.096–0.118) | 0.242 (0.220–0.264) | 0.322 (0.293–0.351) | **0.647 (0.634–0.660)** | 解析实验输出、像专家一样多维度追问、合成外部信息以设计后续实验 |
| Tool usage | 0.338 (0.291–0.386) | 0.396 (0.347–0.445) | 0.409 (0.360–0.459) | **0.578 (0.528–0.627)** | 给定用户指令时，是否选对要查询的数据库或要调用的技能 |

## 行业评估（官方正文）

- **BixBench**（真实生物信息学与数据分析基准）："On BixBench, a benchmark designed around real-world bioinformatics and data analysis, GPT‑Rosalind achieved leading performance among models with published scores."（在有公开分数的模型中名列前茅；官方未印具体分数）
- **LABBench2**（文献检索、数据库访问、序列操作、方案设计等科研任务）："GPT‑Rosalind outperforms GPT‑5.4 on 6 out of 11 tasks. The most notable improvement comes from CloningQA, which requires end-to-end design of DNA and enzyme reagents for molecular cloning protocols."（11 项任务中 6 项优于 GPT-5.4，最大提升在 CloningQA）
- **与 Dyno Therapeutics 合作的内部评估**（未公开、未污染的 RNA 序列，与 AI 生物领域 57 份人类专家历史评分对比）：在 Codex 应用中直接测试时，十次提交中的最佳表现，在 RNA 序列功能预测任务上排名超过 95% 的人类专家，在序列生成任务上超过约 84% 的人类专家。

未转录区块（说明）：

- 页面「生命科学介绍产品演示」为视频，`images/fig1-life-sciences-plugin.png` 是 Codex 生命科学研究插件的界面截图，属产品演示素材，不是评测数据，未转录。
- 页面其余篇幅为客户案例、生态合作与科研工具介绍，不含额外评测数值。
