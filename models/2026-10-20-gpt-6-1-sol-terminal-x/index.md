---
vendor: openai
model: GPT-6.1 Sol
release: gpt-6-1-sol
date: 2026-10-20
source: https://openai.com/index/terminal-x
fetched_at: 2026-10-25
---

# Terminal X（GPT-6.1 Sol 客户评测证据页）

发布日期证据：OpenAI 官网该文正文页眉印「October 20, 2026」；官方新闻 RSS（`https://openai.com/news/rss.xml`）对应条目 `pubDate` 同为 2026-10-20。来源：https://openai.com/index/terminal-x

本页是 OpenAI 官网发布的一篇**客户案例**文章，披露终端投资机构 Terminal X 用其自建 Eval Agent 评测自家 agent 工作流时，底座模型 **GPT-6.1 Sol** 的表现。Terminal X 是做「Capital Memory」的投资 AI 公司（官方通稿里的客户自述），其 Eval Agent 按 54 条评分准则（54-criterion rubric）逐条核对 agent 输出是否偏离基金章程（mandate），再与资深人类评审的结果比对。

页面正文（服务端渲染，DOM 机读）给出的评测数值：

| 评测 | 分数 | 备注 |
|---|---:|---|
| Terminal X Eval Agent 与资深人类评审一致率（500 次已评分判断） | 88.6% | 同段竞品列：次优模型 86.4%；官方写明差值 220 个基点（220 basis points） |
| Terminal X mandate 偏离检出率（相对次优模型） | 约 +25% | 页面只给相对差值，无绝对分值 → 记 notes，不单独建 evidence 行 |
| Terminal X 单次查询成本（相对次优模型） | 约 −30% | 页面只给相对差值，无绝对分值 → 记 notes，不单独建 evidence 行 |

正文原文（数值证据句）：

> Terminal X picks models based on its own evaluation results. Across 500 scored judgments, its Eval Agent on GPT‑6.1 Sol agreed with the senior human reviewer 88.6% of the time, vs. 86.4% for the next-best model, an improvement of 220 basis points.

> GPT‑6.1 Sol helped the Eval Agent catch about 25% more recommendations that strayed from a fund’s mandate and ran the same workflows at approximately 30% lower cost per query than the next-best model.

> Terminal X’s Eval Agent grades outputs against a 54-criterion rubric, catching 25% more deviances from a fund’s mandate with GPT‑6.1 Sol.

评测协议（页面明示项）：

| 项 | 值 |
|---|---|
| 评分器 | Terminal X 自建 Eval Agent，按 54 条评分准则逐条核对 |
| 评分样本量 | 500 次已评分判断 |
| 对照基准 | 资深人类评审（senior human reviewer） |
| 主指标 | Eval Agent 判定与资深人类评审判定的一致率 |
| 底座模型 | GPT-6.1 Sol（推理与上下文合成环节）、GPT-6 Luna（高吞吐、成本敏感环节） |

未转录说明与口径边界：

1. **本页不是模型发布页**，是 OpenAI 官方案例文章；GPT-6.1 Sol 本身的发布日期仍为 2026-09-29（见 `models/2026-09-29-gpt-6-1-sol/`）。本归档只作为该发布的一条**新增证据来源**。
2. **评测由客户 Terminal X 自建并自报**，OpenAI 转载于官网案例栏目；54 条评分准则、500 次评分样本的原始明细未公开，故按「第三方评测方自报、厂商官网转载」口径记 `third_party_reported`，不记厂商自报。
3. **只有 88.6% 是绝对分值**；25% 与 30% 均为相对次优模型的差值，无绝对值，不单独建行，只写进该 evidence 的 notes。
4. 页面**无评测表格、无图表数值**（仅 2 个 `<figure>` 布局容器与 3 条 hero 统计条，全部为 DOM 文本），因此本条 evidence 无需视觉转写、不存在 pending 图表行。
5. 页面另述 Terminal X 侧商业数据（1,700 个 firm Memories、100 万+ 自定义工作流、81% 周活/月活、某私募机构年化节省 240 万美元），均为**客户运营指标而非模型评测分数**，不入账本。
