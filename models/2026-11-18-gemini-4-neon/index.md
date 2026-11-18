---
release: gemini-4-neon
vendor: google
release_date: 2026-11-18
date_precision: day
source_url: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/
canonical_url: https://deepmind.google/blog/introducing-gemini-4-neon/
archived_at: 2026-11-18
archive_status: archived
ledger_status: pending_next_batch
---

# Google Gemini 4 Neon（2026-11-18）· 官方发布文归档转录

> 本目录是**归档**，不是账本条目。账本 release 尚未建档（见 data/model-releases/official/README.md 第七十一批），
> 原因是官方发布文含 9 张评测图表位图，按账本纪律图表行永不自动翻 verified、读图不做视觉转写，
> 需逐图取证后再拆分 pending/verified 行。下列转录为**正文/图表原文的明文值**，非读图插值。

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

## 协议缺口（下一批留 null）

发布文未明示 harness / shots / temperature / top_p / token budget / run count / time limit；
官方评测方法通道：`https://deepmind.google/models/evals-methodology/<model>/`（返回 application/pdf），下一批据此补 `protocol`。

## 目录内容

- `page.html` — 官方发布文服务端渲染 HTML 原文
- `images/` — 官方图片（评测图表位图、封面与引用方 logo）
- `manifest.json` — 逐文件 sha256
