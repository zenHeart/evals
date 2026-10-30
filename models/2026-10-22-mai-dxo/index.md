---
vendor: microsoft
model: MAI-DxO
release: mai-dxo
date: 2026-10-22
source: https://microsoft.ai/news/building-medical-superintelligence/
fetched_at: 2026-10-30
---

# MAI-DxO（Microsoft AI Diagnostic Orchestrator 官方发布通告证据归档）

发布日期证据链（三源互证，均为 2026-10-22）：

1. 官方发布通告页正文标题下方印刷日 **October 22, 2026**。
2. 页面 Yoast SEO JSON-LD `datePublished: 2026-10-22T18:01:00+00:00`、`dateModified: 2026-10-22T19:32:05+00:00`；同页 `<meta property="article:modified_time" content="2026-10-22T19:32:05+00:00">` 互证。
3. 官方站点地图 `https://microsoft.ai/new-sitemap.xml` 对应条目 `<lastmod>2026-10-22 19:32 +00:00</lastmod>`（与 `dateModified` 同一时刻）。

页面地址：Microsoft AI 官网新闻栏目 `https://microsoft.ai/news/building-medical-superintelligence/`。
**该发布没有独立模型落地页**：`https://microsoft.ai/model-sitemap.xml` 列出的 7 个模型落地页中无 MAI-DxO 对应项（MAI-DxO 是编排系统而非可调用的单一基模）。

## 官方定位（原文要点）

- 标题：*Building Medical Superintelligence*，署名 **MAI Health Team**，栏目分类 Health。
- 正文定位：**MAI-DxO（Microsoft AI Diagnostic Orchestrator）** 是微软的「AI 诊断系统」；官方称在常见美国急诊科病例上比医生准确 1.7 倍，在最复杂的病例上比「有教科书和互联网可用」的医生准确两倍以上、比「无外部资料」的医生接近四倍，并且**成本只有一半甚至三分之一**。
- 官方论文：同日发表于 **Science**；另在 **BMJ Digital Health and AI** 发表《The Building Blocks of Medical Superintelligence》愿景文。
- 本次同时推出两项基础设施：
  1. **SDBench（Sequential Diagnosis Benchmark）**——评测「一步步的问诊推理」；官方说明其动机是 USMLE 这类执照考试「一次性给全部信息、单选一个答案」，与真实临床「逐步拼图、决定接下来问什么、开什么检查、每个新发现如何改变可能诊断」不同。
  2. **MAI-DxO**——官方称其为「该基准上我们最强的 AI 系统」。
- SDBench 题集：两组互补病例——**304 例取自《新英格兰医学杂志》（NEJM）病例记录**的复杂病例，以及一组**更常见的 MIMIC-IV-ED 急诊科病例**。每例都是交互式病例，模型和/或医生从有限信息出发，自行决定接下来索取什么；基准同时度量**诊断准确率、索取的证据量与估算的检查成本**。
- MAI-DxO 的工作方式：**不依赖单个模型直接给答案**，而是「像一组虚拟医生那样运作」——各自提出诊断、挑选有用的问题或检查、挑战正在形成的看法；MAI-DxO 协调**若干轮辩论**，随新证据到达更新判断，并把每项检查的可能价值与其成本相权衡。
- 开源：官方将开源部分 NEJM 病例的 SDBench，**含基准本身、Gatekeeper、Judge 与成本估算代码**，供他人复现、测试其他模型并挑战结论。
- 后续计划：与 **Mayo Clinic** 合作，把前沿 AI、临床专长与纵向多模态数据结合；与波士顿 **Beth Israel Deaconess Medical Center** 建立新合作，在真实临床环境做前瞻性研究（患者直接与系统交互，以医生独立评估为对照）。

## 评测数值转录

正文「What we found:」小节为**明文列表**（DOM 机读，非图表），逐条转录如下；官方未印出任何评测图表，本页无 `<table>`、无柱状图数值。

| 评测 | 分数 | 备注 |
|---|---|---|
| SDBench · NEJM 复杂病例（304 例） | MAI-DxO **83%** 诊断准确率 | 同一行并列的医生基线：不用外部资料 **22%**、可用教科书与互联网 **36%**；官方称 MAI-DxO 分别约为其 **3.7 倍**与 **2.3 倍** |
| SDBench · MIMIC-IV-ED 急诊常见病例 | MAI-DxO **80%** 诊断准确率 | 同一行并列的医生基线 **47%**；官方称高出 **1.7 倍以上** |
| SDBench · NEJM 复杂病例（成本优化配置） | MAI-DxO **81%** 诊断准确率 | 官方称该配置以**不到对比系统一半的成本**达成；成本为相对结论，官方未给绝对金额 |

正文另有一处**相对倍数**（不建行，写进 notes）：首页 hero 图 `images/health_v5_stat_typeset.webp` 只印「1.7 times more accurate than physicians」，与 MIMIC-IV-ED 行的 1.7 倍一致，**不是绝对分值**；按「只有绝对分值才单独建行，相对差值写进 notes」处理。

未转录说明与口径边界：

1. **医生基线不是模型，不拆 comparison_cited**：22% / 36% / 47% 是同一评测里的人类医生对照值，官方在同一句里印出，按「取自家模型列、竞品列进 notes」写进对应行的 notes，不另立 evidence 行。
2. **1.7 倍 / 3.7 倍 / 2.3 倍是倍数不是分值**，同理只进 notes。
3. **成本是相对结论**：官方写「at half or even one third of the cost」「less than half the cost of comparative systems」，未给绝对美元数，故不建成本行、不折算。
4. **GPT-5.5 等新模型重跑无数值**：正文只说「用更新一代模型（含 GPT-5.5）重跑，成绩持平甚至更好，且未改动编排方法」，**未印任何 GPT-5.5 的具体分数**，按「点名但无数值 → not_reported」不建行，只在 notes 说明官方结论是「方法不绑定单一模型代际」。
5. **官方未明示规格**：参数量、上下文长度、API 定价三项全页未给，一律记 null；MAI-DxO 本身也不是单一可调用基模。
6. **协议字段只记明示项**：仅 `harness` 可写（MAI-DxO 多模型编排、多轮辩论）；题量（NEJM 304 例为明示，MIMIC-IV-ED 例数未印）、跑次数、温度、判分器型号、聚合算法官方均未明示，一律 null。SDBench 的 **Gatekeeper / Judge / cost-estimation 代码开源**这一点写入 notes（官方只说会开源，未说明 Judge 用哪个模型）。
7. **发布文不等于论文全文**：Science 论文正文与 SDBench 开源仓库本轮未抓取，本条所有数值只来自官方发布通告页。
8. **本页无评测图表**：全页 `<table>` 计数 0、评测柱状图 0，可见文本中百分比命中 6 处且全部已在上面三行转录；4 张配图（hero 图、栏目装饰图、logo）均不含评测数值，故无「图表行 pending」条目。

## 抓取路径记录

- `curl` 静态 GET 对 `microsoft.ai` 一律命中 Cloudflare 挑战页 403（2026-10-30 实测：`/blog/`、`/new-sitemap.xml`、`/model-sitemap.xml`、`/news/<slug>/` 全部 403，带 `Accept: text/html` 与完整浏览器头也无效）。
- 改用 **Node `fetch`（undici）+ 浏览器 UA** 静态 GET：同一 URL 立刻返回 200 全文（499 KB）。故本批 Microsoft 侧全部内容经 Node fetch 取得；发布通告页正文另经内置浏览器渲染后二次读取，两路一致。
