---
vendor: openai
model: Astra for Law 6.2
release: gpt-6-2-astra-law
date: 2026-11-17
source: https://openai.com/index/astra-law-6-2
fetched_at: 2026-11-21
---

# Astra for Law 6.2（OpenAI 官方发布文证据归档）

发布日期证据链：发布文 hero 区印刷日期「November 17, 2026」（`<p class="text-meta text-primary-100">November 17, 2026</p>`）；官方 RSS `https://openai.com/news/rss.xml` 中该条目的 `pubDate` 为 `2026-11-17`。两源一致，`date_precision=day`。

- 发布文：https://openai.com/index/astra-law-6-2/ （`page.html`，服务端渲染 HTML，原始字节未改动存档）
- 发现渠道：官方 RSS `https://openai.com/news/rss.xml`（窗口内巡检，见 `data/model-coverage.json` 的 openai 通道记录）
- 配套官方页：https://microsoft.ai/news/introducing-mai-licensed-weights/ 属另一厂商发布，未纳入本归档

## 官方定位（原文要点）

- 发布文标题「Astra for Law leads in legal intelligence」，首句定位「Today, we're releasing an updated Astra for Law that is state-of-the-art on Harvey LAB-AA and a top performer on Vals AI's Legal Research Bench.」
- **Astra for Law 是 GPT-6.2 Astra 的模型配置**，不是新的基座模型。原文：「Astra for Law is a model configuration of GPT‑6.2 Astra, our latest, most powerful frontier model. It pairs GPT‑6.2 Astra with an expanded legal search index and instructions for researching a question, weighing the authorities, and writing the answer.」
- 官方称该配置在 LAB-AA 上获全通过率的频次「nearly 40% more often than did the runner-up, GPT‑6.2 Astra」。
- 9 月曾向 Cooley、Ropes & Gray、Sullivan & Cromwell 等少数律所做预览；本次更新把法律检索索引扩大三分之一以上（新增 8000 万余 URL，总计逾 3.1 亿 URL，覆盖 99.9% 以上美国已公开判例法）。
- 可用性：全部 ChatGPT Enterprise 客户可在管理台的 Trusted Access Program 中申请，模型标识 `gpt-6.2-astra-law`；也可申请 API 接入。

## 规格与架构（页面明示内容）

- **参数量**：页面未明示 → `params = null`
- **上下文窗口**：页面未明示 → `context_window = null`
- **定价**：页面未印 API 定价（走 Trusted Access Program 申请制，未公开价目）→ `pricing = null`
- **模态**：页面未明示 → `modalities = null`

## 评测协议（Benchmarking 口径）

- 全部数值印在厂商自己的发布文正文里（散文明文），**不是位图读图、不是 OCR**，故 11 条 evidence 一律记 `verified`，`evidence_type=text`。
- 页面未明示 reasoning effort / temperature / top_p / harness / 工具 / shots / 分母细节，`protocol` 12 键一律 `null`，因此所有行 `comparison_scope` 记 `only_same_protocol`。
- **两套评测口径必须隔离**：
  - **LAB-AA v1.1** = Artificial Analysis 版本的 Harvey Legal Agent Benchmark，120 道 assignment、24 个法律领域，all-pass 计分（每题全部 rubric 要求项通过才计 1 分）；
  - **Harvey 自有 LAB 留出集** = Harvey 自己的执行版本。原文明示「This test comes from Harvey's own LAB (separate from the previously discussed LAB-AA)」，与 LAB-AA **不是同一任务集**，两组数值不可直接比较。
  - **Vals AI 法律研究基准** = 执业律师出题（美国联邦与州法），答案须覆盖每一项必要求点且通过来源核查才计全对；本页引用 2026-11-16 评测。账本沿用既有 id `vals-legal-research-bench`（第六十四批 Gemini 4 Hydrogen 建档时已铸），**不新铸 id**；仓内另有独立 id `legal-research-bench`（Thinking Machines Inkling 2 Small 的第三方转述行所用），二者是两个不同 id，本批不合并、不改写既有行。
- 竞品分数的两种口径（本批显式区分并写进 notes）：同一句排序陈述里的竞品列（LAB-AA 的 GPT‑6.2 Astra 15.0%、Muse Wonder Full 13.1%）只写进本行 notes；厂商用独立句子单独陈述的竞品分数（Claude Opus 5.5 的幻觉率、GPT‑6 / GPT‑6.2 Astra 在 Harvey 自测集上的分数）单列 `comparison_cited` 行。

## 评测数值转录（全部为官方发布文正文明文数字）

| 评测 | 分数 | 备注 |
|---|---|---|
| Harvey LAB-AA v1.1（Artificial Analysis，120 题）· 全通过率 | 20.8% | 本配置排名���一；同句竞品列 GPT‑6.2 Astra 15.0%、Muse Wonder Full 13.1%（见 `images/01.webp`） |
| Harvey LAB-AA v1.1 · 每题平均输出 token | 约 64,000 | 同次评测运行的成本口径；Muse Wonder Full 为 139,000，官方称少 54% 输出（见 `images/02.webp`） |
| Harvey LAB-AA v1.1 · 每题重大幻觉次数 | 0.03 | Artificial Analysis 计数口径；本配置 minor 幻觉 0.06 次/题；普通 GPT‑6.2 Astra 重大幻觉 0.06 次/题（见 `images/03.webp`） |
| Harvey LAB-AA v1.1 · 竞品 Muse Wonder Full 全通过率 | 13.1% | 非 OpenAI 最高分；竞品明文引用行（`comparison_cited`） |
| Harvey LAB-AA v1.1 · 竞品 Claude Opus 5.5 重大幻觉 | 0.59 次/题 | 官方称约为本配置的 20 倍；竞品明文引用行 |
| Harvey LAB-AA v1.1 · 竞品 Claude Opus 5.5 轻微幻觉 | 0.51 次/题 | 官方称约为本配置的 8.5 倍；竞品明文引用行 |
| Vals AI 法律研究基准（2026-11-16 评测，208 题）· 全对率 | 53.8% | 112 / 208 题全对；2026-09 同口径约 46%，两个月 +约 8 个百分点（见 `images/04.webp`、`images/05.webp`） |
| Vals AI 法律研究基准 · 全部题目可得分点合计（含部分得分） | 90.9% | 与全对率 53.8% 是两个口径，不可互相替代 |
| Harvey 自有 LAB 留出集 · 全通过率 | 16.2% | 与 LAB-AA 非同一任务集；官方称比 GPT‑6.2 Astra 的 14.6% 多完成 11%（见 `images/06.webp`） |
| Harvey 自有 LAB 留出集 · 竞品 GPT‑6.2 Astra 全通过率 | 14.6% | 自家前代配置，明文引用行 |
| Harvey 自有 LAB 留出集 · 竞品 GPT‑6 Astra 全通过率 | 4.6% | 自家前代配置，明文引用行 |

## 未建 evidence 行 / 口径外数值（照录不建行）

- Harvey 研究负责人被引述「Astra for Law 6.2 写出的法律意见书被成对评审偏好约 90%」：没有可定位的评测名称与版本口径，不建 evidence 行，仅在账本 release notes 记录待人工核验。
- 官方称本次配置相比 9 月在全对率上「gained about eight percentage points」：与 Vals AI 行同源，避免重复建行。
- 客户案例数值（AT&T 5G 网络分析中「以 GPT‑6.1 Sol 1/50 的成本」取得更优表现、Woven by Toyota 44% 的代码修复无需人工介入、Alaska Airlines 维护报告分类准确率 81.2%→91.1%）：属客户自有任务上的评测，官方明示「Results reflect customer-specific evaluations」，无公开 benchmark 口径，不建行。
- 检索索引规模（3.1 亿 URL、新增 8000 万 URL、覆盖 99.9% 美国判例法）：产品能力指标，非评测分，不建行。
- 官网 `gpt-6.2-astra-law` 的产品标识与 Trusted Access Program 申请流程：可复现性信息，不建行。

## 归档清单

| 文件 | 说明 |
|---|---|
| `page.html` | 官方发布文原始存档（475,290 bytes） |
| `images/01.webp` | LAB-AA 全通过率排名散点图 |
| `images/02.webp` | LAB-AA 全通过率 × 输出 token 散点图 |
| `images/03.webp` | LAB-AA 幻觉率对比图 |
| `images/04.webp` | Vals AI 法律研究基准进展图 |
| `images/05.webp` | Vals AI 法律研究基准系统对比图 |
| `images/06.webp` | Harvey 自有 LAB 全通过率图 |
