---
vendor: microsoft
model: MAI-Cyber-1.1-Flash
release: mai-cyber-1-1-flash
date: 2026-10-27
source: https://microsoft.ai/news/mai-cyber-1-1-flash/
fetched_at: 2026-10-29
---

# MAI Cyber 1.1 Flash（Microsoft AI 官方发布通告证据归档）

发布日期证据链：官方发布通告页 JSON-LD `datePublished=2026-10-27T15:00:00+00:00`、`dateModified=2026-10-27T15:03:47+00:00`（发布后 3 分钟内轻微编辑，发布日期与修改日同日）；同页 `<meta property="article:modified_time" content="2026-10-27T15:03:47+00:00">` 互证；正文标题下方印刷日 **October 27, 2026** 三源一致，`date_precision=day`。

页面地址：Microsoft AI 官网新闻栏目 `https://microsoft.ai/news/mai-cyber-1-1-flash/`；模型落地页 `https://microsoft.ai/models/mai-cyber-1-1-flash/`（2026-10-27 新增于官方 `model-sitemap.xml`，lastmod 2026-10-27T23:12:12）。

## 官方定位（原文要点）

- 标题：*MAI Cyber 1.1 Flash: Sharper findings and fewer tokens inside MDASH*。
- 正文定位：**MAI Cyber 1.1 Flash** 把漏洞发现往前推了一步——在**内部 MDASH 漏洞扫描评测套件**上，性能与 MAI Cyber 1 Flash **相当**，而**每次扫描成本低 18%**。
- 正文的模型自述：MAI Cyber 1.1 Flash 是**更专注的模型**，自己承担更多工作，让整套 MDASH 系统以更低成本产出有用发现。
- 官方在模型落地页补充：该模型**面向防御侧校准**，**仅向通过验证的防御方（verified defenders）**经 MDASH 提供。
- 官方模型索引页（`https://microsoft.ai/models/`）把 MAI-Cyber-1.1-Flash 列为当前「最新模型」之一。

## 评测数值转录

**页面没有印出任何绝对基准分值**（发布通告正文与模型落地页全文中，无百分比、无 Elo、无通过率、无题量）。可见文本里只有三类数字，**全部是相对量或使用占比，不是基准分**，按「无数值不臆造」口径**不建 evidence 行**，只转录在此：

| 评测 | 分数 | 备注 |
|---|---|---|
| MDASH 内部漏洞扫描评测套件（internal MDASH vulnerability-scanning evaluation suite） | 性能与 MAI Cyber 1 Flash 相当；**每次扫描成本低 18%** | **相对结论 + 相对成本差，非绝对分**；评测集为微软内部私有套件，官方未公开题集、题量、判分流程与通过率口径，外部无法复跑、不可跨机构比较 → 按口径不建行，只写进 notes |
| MDASH 内部产品评测集（internal product evaluation set） | 每次扫描完成成本低 18% | 同上，与上一行同一结论在正文另一段的复述（"On the same MDASH evaluation suite, each scan costs 18% less to complete on an internal product evaluation set."） |
| MDASH 扫描中的模型档位使用占比 | 首次扫描后**近 9 成**后续扫描使用 MAI profile 而非「仅 OpenAI」模型 profile | **产品使用占比**，不是模型能力指标 |
| MDASH 扫描总量中的 MAI Cyber 占比 | **近 50%** 的 MDASH 扫描由 MAI Cyber 承担（来自数百家客户、累计数千次扫描） | **产品使用占比**，不是模型能力指标 |

未转录说明与口径边界：

1. **本批唯一没有可录入评测行的在册厂商发布**：本页把评测结论完全放在「内部私有套件 + 相对成本差」上，官方没有公开任何绝对基准分。因此本 release 的 `benchmark_evidence` 为**空数组**、`status: pending`，与账本既有先例一致（如 `microsoft/mai-voice-2-1`、`microsoft/mai-image-2-6`、`microsoft/mai-transcribe-2` 均为 0 行 pending 档）。
2. **18% 是成本差不是分数**：官方原文是 "costing 18% less per scan"，没有给出每次扫描的绝对美元数，也没有给出任务通过率；按口径「只有绝对分值才单独建行，页面只给相对差值时写进 notes」，不折算、不建行。
3. **使用占比不是评测**：「近 9 成后续扫描用 MAI profile」「近 50% 的 MDASH 扫描由 MAI Cyber 承担」是产品采用度指标，与模型能力无关，不入 evidence。
4. **官方未明示规格**：参数量、上下文长度、API 定价三页均未给（模型落地页只有定位文案与流程图，无规格表），一律记 null；官方也未公开模型卡 PDF 链接的直链（`https://microsoft.ai/pdf/MAI-Cyber-1.1-Flash-Model-Card.PDF` 实测 404）。
5. **协议字段全 null**：发布文未明示评测所用的 harness、工具集、温度、跑次数、判分器与通过率口径（MDASH 本身是「100+ 专用 AI 智能体」的多模型编排系统，但官方未给出本次评测的题集、判定规则与跑次数），故 protocol 12 键一律 null，不臆造。
6. **不与 MAI Cyber 1 Flash 合并**：MAI Cyber 1 Flash（2026-08-13 发布）尚未入账，本条按独立发布建档；两者是同系列的 1 → 1.1 迭代，不合并。
