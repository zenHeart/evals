---
release: gemini-4-neon
vendor: google
release_date: 2026-11-18
date_precision: day
source_url: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/
canonical_url: https://deepmind.google/blog/introducing-gemini-4-neon/
archived_at: 2026-11-18
archive_status: archived
ledger_status: built
---

# Google Gemini 4 Neon（2026-11-18）· 官方发布文归档转录

> 本目录是**归档**，账本 release 已于第七十二批建档：`data/model-releases/official/google/gemini-4-neon.json`。
> 官方发布文含 9 张评测图表位图，按账本纪律图表行永不自动翻 verified、读图不做视觉转写，
> 需逐图取证后再补录；下列转录为**正文/图表原文的明文值**，非读图插值。
> 协议字段已据官方评测方法说明 PDF（`evals-methodology.pdf`，同目录归档）补齐。

## 日期证据（三源互证）

| 证据 | 值 |
|---|---|
| 页面印刷日 | Nov 18, 2026 |
| JSON-LD `datePublished` | 2026-11-18T21:00:00+00:00 |
| blog.google 官方 RSS `pubDate` | 2026-11-18 |

## 规格（官方明文）

| 项 | 值 |
|---|---|
| 上下文窗口 | 1,000,000 tokens |
| 输入价 | $3 / 百万 tokens |
| 缓存输入价 | $0.15 / 百万 tokens（95% 折扣） |
| 输出价 | $15 / 百万 tokens |
| 可综合输入 | 电子表格、PDF、图表、音频、视频 |
| 上线渠道 | Gemini API、Google AI Studio、Gemini for business、Google Antigravity、Gemini app |

## 正文明文绝对分值（DOM 可机读，非读图）

| 基准 | 分值 | 口径 / 备注 |
|---|---|---|
| Vals Index | 70.9% | 第 2 名 |
| Chartography | 73.5% | 读取密集专业图表 |
| Agents' Last Exam v1.1 | 75.8% | 与领先模型持平 |
| AutomationBench（Zapier） | 56.3% | 总分第 1 |
| Terminal-Bench Science | 70.5% | 最佳档 |
| RiemannBench | 84.0% | 最佳档 |
| HLE-Diamond | 71.3% | 最佳档 |
| Artificial Analysis Coding Agent Index | 58.6 | 总分第 1（指数分，非百分数） |
| Terminal-Bench 4.1 | 65.2% | — |
| FrontierCode 2.0 | 46.2% | 默认 high 档 |
| SWE-sweep（mini-SWE harness） | 12.8% | 同基准不同 harness，按 variant 拆行 |
| SWE-sweep（Antigravity harness） | 39.0% | 同上 |
| AutoBaxBench | 76% | 困难档（easy/medium 档在位图内） |
| WebExploitBench v1.2 | 51.26% | 同类大模型中 SOTA |
| SEC-bench Pro | 90.5% | 漏洞发现，SOTA |
| CWE-bench v2（Collinear） | 70.7% | 比 Carbon 提升 3.4% |
| Gray Swan（攻击成功率） | 0.0% | 最高 thinking 档；分档明细在位图内 |
| Artificial Analysis Intelligence Index | 61 | xhigh 档，总分第 3 |
| Agent Arena Index | 1336 | 全球第 2；steerability 第 2 |

## 正文点名但无数值（下一批按 score_status: not_extracted 记）

- Legal Research Bench — 第 1 名
- Tax Agent Bench — 第 1 名
- Surge AI — 财务/会计/电子表格建模/复杂约束遵循多数分项第 1
- Andon Labs Vending-Bench 2 — $16,843（金额，不是分值）

## 不建行（相对论断与成本比，只进 notes）

比 Carbon 每任务成本低 32%；Vals/Agent Arena 处于 Pareto 前沿、比同级前沿模型低 50%–80% 成本；
xhigh 档仍比同级低 36%+；CWE-bench v2 比 Carbon 提升 3.4%；
Terminal-Bench 4.0 拒答率 1.98%、Terminal-Bench-Science 拒答率 0%；
编码作弊率 0.0%、走捷径 2.45%；agentic safety 误配动作率 0.09%；agent honesty 99.2%；
under-service 降 43%–56%、overreach 降 15%–35%。

## 评测协议（第七十二批据官方方法说明 PDF 补齐）

官方另发《Gemini 4 Neon Model evaluation — Approach, methodology & results》PDF（同目录 `evals-methodology.pdf`），
写明通用口径与逐基准口径，账本 `protocol` 字段一律以此为准：

- 通用：除特别说明外所有分数均为 **pass@1**；「单次尝试」= 无多数投票、无并行测试时计算；
  统一以 Gemini API **最高思考档** 运行；小基准取多次试验平均；**除网络安全类评测外均开启安全过滤**；
  非 Gemini 模型的分数取自各厂商自报数字。
- Terminal-Bench 4.1：Neon 分数由 Artificial Analysis 用公开 **Antigravity-CLI v1.5.9** 脚手架产出，一律采用**作弊修正后准确率**。
- SWE-sweep：provider harness 档为自算（**Antigravity-CLI v1.5.9**，默认带子智能体扇出工具），指标为 **subtask-weighted reward**；
  mini-swe 档为自算（**mini-swe-agent vision harness**）。
- FrontierCode 2.0：取自官方公开榜，Neon 用 **high** 思考档。
- Agents' Last Exam v1.1：自算，**122 题**、**Antigravity-CLI v1.4.8**、**5 小时窗口**、开启安全过滤，报告 **averaged rubric Score**。
- Terminal-Bench Science 0.1：自算，**mini-swe-agent vision harness**，**每任务 5 次尝试取平均**，报告 **Average Reward**。
- Chartography：自算、**不使用工具**，沿用官方 Surge 公开榜口径。
- SEC-bench Pro：自跑开源评测设置，**Pass@1**、**183 题 May 2026 JavaScript 引擎切分**、**每题 3 次独立尝试取平均**、**Antigravity** 脚手架，
  以 LLM judge 复核 PoC 是否命中目标漏洞。
- WebExploitBench v1.2：自评并由 **AgentCyberRange** 验证，15 个多容器 Web 应用目标、共 **277 个漏洞**，
  以确定性运行时验证器 + LLM judge 判定。
- CWE-bench v2：取自官方公开榜（Collinear AI 开发、Artificial Analysis 独立复核），按 **programmatic pass@1** 排序、同分以 **pass@4** 破平。
- ExploitGym：自算（**Antigravity** 脚手架、**单次尝试、无联网**、缓解措施关闭、**每任务 10 小时超时**），分别测 **2 / 6 / 10 小时**三档成功率。
- AutoBaxBench：结果由基准作者提供，**560 个 Web 后端任务**（40 场景 × 14 后端框架），单次 LLM 调用产出实现，
  以固定功能测试 + 针对特定 CWE 的固定黑盒利用判定，分 **easy / medium / hard** 三档、报告 **functional** 与 **functional + secure** 两个口径。
- Gray Swan IPI Arena：由 Gray Swan 用 **1,810 条**高迁移性攻击（2026 Q1 与 Q2 两波）评估，跨 **4 次独立推理试验**，
  以 **bootstrapped ASR@1 / ASR@10 / ASR@15** 报告（越低越好）。
- 其余：Cursorbench 4.1 取自 Cursor；LVBench 自算（vision-only、无工具、Gemini 侧 1FPS 低分辨率）；
  MKA 取自 Artificial Analysis 榜单；GraphWalks 自算（200 题、上下文 256k–1M tokens）。

> PDF 第 6 页的 Results 总表是**位图**，不可机读；表中 Cursorbench 4.1 / LVBench / MKA / GraphWalks 四项在正文完全未出现，
> 只能以位图来源挂 pending（见账本对应 pending 行）。

## 目录内容

- `page.html` — 官方发布文服务端渲染 HTML 原文
- `images/` — 官方图片（评测图表位图、封面与引用方 logo）
- `evals-methodology.pdf` — 官方评测方法说明 PDF（协议字段来源）
- `manifest.json` — 逐文件 sha256
