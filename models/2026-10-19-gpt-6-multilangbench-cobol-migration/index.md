---
vendor: openai
model: GPT-6 Astra / GPT-6 Luna / GPT-6.1 Sol / GPT-5.6 Sol
release: gpt-6-astra
date: 2026-10-19
source: https://openai.com/index/low-resource-programming-languages
fetched_at: 2026-10-25
---

# Advancing coding in low-resource programming languages（MultiLangBench 与 COBOL 迁移评测证据页）

发布日期证据：OpenAI 官网该文正文页眉印「October 19, 2026」；官方新闻 RSS（`https://openai.com/news/rss.xml`）对应条目 `pubDate` 同为 2026-10-19。来源：https://openai.com/index/low-resource-programming-languages

本页是 OpenAI 官网发布的一篇**研究/方法学文章**，公布两个新评测的官方结果：面向 COBOL、Fortran、Visual Basic 等「低资源编程语言」的 **MultiLangBench**，以及 **COBOL 迁移评测**。文中给出了 **GPT-6 Astra**、**GPT-6 Luna**、**GPT-6.1 Sol** 与对照的 **GPT-5.6 Sol** 的明文绝对分值。

本页**不是任何模型的发布页**，因此不改变任何 release 的发布日期；它只为已建档的四个 release 追加新的官方明文 evidence。

## 一、两个评测是什么（页面原文口径）

- **MultiLangBench**：「MultiLangBench tests whether a model can build a SQLite-compatible database engine from scratch across 20 different programming languages.」——要求模型用指定语言从零写一个 SQLite 兼容的数据库引擎。测试用例改编自 SQLite 既有测试套件，「measures how much working functionality a model can build over an extended coding session, reporting both test pass rate and API cost.」
- **COBOL 迁移评测**：「Our second evaluation asks models to migrate COBOL programs to C++, Java, Kotlin, Python, or Rust while preserving what each program does.」——要求把已有 COBOL 程序迁移到 C++、Java、Kotlin、Python 或 Rust，并保持程序行为不变。页面举例说明难点：COBOL 定点运算会丢弃多余小数位，除非显式要求舍入；改写后若改成舍入，程序可以不报错却算出不同的财务结果。

官方同时宣布开源 MultiLangBench 评测环境与测试套件：`https://github.com/openai/MultiLangBench`。

## 二、MultiLangBench（正文机读转录）

主指标是「20 种语言上的平均测试通过率」，页面在**最大推理强度（maximum reasoning effort）**下给出全部数值：

| 评测 | 分数 | 备注 |
|---|---:|---|
| MultiLangBench 20 语言平均测试通过率 — GPT-6 Astra | 87.4% | 同段对照：GPT-5.6 Sol 为 26.8%；官方写明「improvements in every language tested」 |
| MultiLangBench 20 语言平均测试通过率 — GPT-6 Luna | 40.3% | 同段对照：GPT-5.6 Sol 为 26.8%；估测平均 API 成本 $0.77/样本（GPT-5.6 Sol 为 $3.48，约低 78%） |
| MultiLangBench 20 语言平均测试通过率 — GPT-5.6 Sol | 26.8% | 页面在前两段作为「基线」明文印出；该 26.8% 所在句未单独标注推理强度 |
| MultiLangBench COBOL — GPT-6 Astra | 72.1% | 同句给出 GPT-5.6 Sol 的 10.9% 作为基线；官方另写「COBOL remaining the hardest at 72%」 |
| MultiLangBench COBOL — GPT-6 Luna | 17.1% | 同句基线 GPT-5.6 Sol 10.9% |
| MultiLangBench OCaml — GPT-6 Astra | 85.8% | 同句基线 GPT-5.6 Sol 25.6% |
| MultiLangBench OCaml — GPT-6 Luna | 34.1% | 同句基线 GPT-5.6 Sol 25.6% |
| MultiLangBench Fortran — GPT-6 Astra | 83.5% | 同句基线 GPT-5.6 Sol 21.4% |
| MultiLangBench Fortran — GPT-6 Luna | 31.4% | 同句基线 GPT-5.6 Sol 21.4% |
| MultiLangBench Visual Basic — GPT-6 Astra | 89.4% | 同句基线 GPT-5.6 Sol 27.5% |
| MultiLangBench Visual Basic — GPT-6 Luna | 41.6% | 同句基线 GPT-5.6 Sol 27.5% |
| MultiLangBench COBOL — GPT-5.6 Sol | 10.9% | 作为 Astra / Luna 两段的共同基线明文印出 |
| MultiLangBench OCaml — GPT-5.6 Sol | 25.6% | 同上 |
| MultiLangBench Fortran — GPT-5.6 Sol | 21.4% | 同上 |
| MultiLangBench Visual Basic — GPT-5.6 Sol | 27.5% | 同上 |

其余 16 种语言：页面只在文字里给出「Astra scores above 83% in 19 of the 20 languages」这一区间式表述，没有逐语言绝对值，故**不建行**（见「未转录说明」第 3 条）。

## 三、COBOL 迁移评测（正文机读转录）

| 评测 | 分数 | 备注 |
|---|---:|---|
| COBOL 迁移评测 准确率 — GPT-6.1 Sol（低推理强度） | 86.6% | 同段对照：GPT-5.6 Sol 为 5.4%；官方写明成本低 39%（另一处写为「just 61% of the API cost」） |
| COBOL 迁移评测 准确率 — GPT-6.1 Sol（更高推理强度） | 97.9% | 页面写「nearly saturating the evaluation」「bringing the evaluation close to saturation」 |
| COBOL 迁移评测 准确率 — GPT-5.6 Sol（低推理强度） | 5.4% | 同段对照基线，明文印出 |

## 四、正文原文（数值证据句）

> To measure progress, we developed two evaluations. MultiLangBench tests whether a model can build a SQLite-compatible database engine from scratch across 20 different programming languages. Our COBOL migration evaluation tests whether a model can migrate existing programs to another language while preserving their behavior. Together, they test two complementary skills: building new software and preserving what existing software does.

> On MultiLangBench, GPT‑6 Astra achieves an average test pass rate of 87.4% across 20 programming languages, up from 26.8% for GPT‑5.6 Sol, with improvements in every language tested. GPT‑6 Luna also outperforms GPT‑5.6 Sol, reaching 40.3% at approximately 78% lower estimated API cost.

> On our COBOL migration evaluation, GPT‑6.1 Sol achieves 86.6% accuracy at low reasoning effort, compared with just 5.4% for GPT‑5.6 Sol, while costing 39% less. At higher reasoning effort, accuracy reaches 97.9%, nearly saturating the evaluation.

> At maximum reasoning effort, GPT‑6 Astra achieves an average test pass rate of 87.4% across the 20 languages, up from 26.8% for GPT‑5.6 Sol. Improvements extend to every language tested, including COBOL (10.9% to 72.1%), OCaml (25.6% to 85.8%), Fortran (21.4% to 83.5%), and Visual Basic (27.5% to 89.4%). Astra scores above 83% in 19 of the 20 languages, with COBOL remaining the hardest at 72%.

> GPT‑6 Luna offers a lower-cost option that also improves on GPT‑5.6 Sol in every language tested. At maximum reasoning effort, it reaches an average test pass rate of 40.3%. Gains include COBOL (10.9% to 17.1%), OCaml (25.6% to 34.1%), Fortran (21.4% to 31.4%), and Visual Basic (27.5% to 41.6%). These improvements come at an estimated average API cost of $0.77 per sample, compared with $3.48 for GPT‑5.6 Sol, approximately 78% lower.

> On this evaluation, GPT‑6.1 Sol achieves 86.6% accuracy at low reasoning effort, compared with GPT‑5.6 Sol’s 5.4% at the same setting at just 61% of the API cost. At higher reasoning effort, accuracy reaches 97.9%, bringing the evaluation close to saturation.

## 五、评测协议（页面明示项）

| 项 | MultiLangBench | COBOL 迁移评测 |
|---|---|---|
| 任务 | 用指定语言从零构建 SQLite 兼容数据库引擎 | 把 COBOL 程序迁移到 C++ / Java / Kotlin / Python / Rust 并保持行为 |
| 主指标 | 测试通过率（test pass rate，%），另报 API 成本 | 准确率（accuracy，%） |
| 语言范围 | 20 种（含 COBOL、OCaml、Fortran、Visual Basic） | 源语言 COBOL，目标语言 5 种 |
| 推理强度 | 明示：maximum reasoning effort | 明示两档：low reasoning effort、higher reasoning effort |
| 成本口径 | 估测平均 API 成本 $0.77/样本（Luna）vs $3.48（GPT-5.6 Sol） | 相对成本：61% API cost / 39% 更低 |
| 测试来源 | 改编自 SQLite 既有测试套件 | 页面未公开 |
| 评测环境 | 官方开源 `github.com/openai/MultiLangBench` | 页面未公开 |

## 六、未转录说明与口径边界

1. **本页不是模型发布页**，是 OpenAI 官网的研究/方法学文章。GPT-6 Astra（2026-09-03）、GPT-6 Luna（2026-09-22）、GPT-6.1 Sol（2026-09-29）、GPT-5.6 Sol（2026-08-26）各自的发布日期不变，本归档只作为四个 release 的**新增证据来源**。
2. **评测由厂商自建自报**：MultiLangBench 与 COBOL 迁移评测都是 OpenAI 自己设计的评测，结果由 OpenAI 在官网文章中自报，故 evidence 记 `vendor_reported`（A 级一手来源），不记第三方榜单口径。
3. **图表为客户端渲染，无静态图可转录**：页面有 4 个 `<figure>` 图表容器（`multilangbench-average-test-pass-rate`、`sqlite-performance-by-language`、`cobol-migration-performance`、`sqlite-test-pass-rate-c`），在服务端 HTML 中都是**空 div**（`height:400px`，无 `src`/`srcset`），图表数据由前端脚本运行时拉取，静态 HTML 内**不含任何语言名数组或数值数组**。因此本批 evidence **全部来自正文散文明文数值**，不存在「图表行 → pending」的待转录项；那 16 种未点名语言的逐语言数值既未明文给出、也无静态图可读，按纪律**不建行、不臆造**。
4. **Astra 的 26.8% 与 87.4% 出现在两个不同句子**：首段「achieves an average test pass rate of 87.4% across 20 programming languages, up from 26.8% for GPT‑5.6 Sol」未标注推理强度，后段「At maximum reasoning effort, GPT‑6 Astra achieves an average test pass rate of 87.4% across the 20 languages」才明确强度。取后段的明文口径记 `reasoning_effort = maximum`；**GPT-5.6 Sol 的 26.8% 所在句未标注强度**，故该行的 `reasoning_effort` 记 `null`，并在 `model_variant` 标注「effort setting not stated for the 26.8% figure」，与 GPT-5.6 既有行同款处理。
5. **成本不是分数**：$0.77 / $3.48 / 78% / 61% / 39% 均为 API 成本口径，不是评测分值，不单独建 evidence 行，只写进相关行的 notes。
6. **「above 83% in 19 of the 20 languages」是区间式表述**，没有逐语言绝对值，不建行。
