---
vendor: google
model: Gemini 4 Hydrogen
release: gemini-4-hydrogen
date: 2026-11-12
source: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/
fetched_at: 2026-11-13
---

# Introducing Gemini 4 Hydrogen

> 归档说明：`page.html` 为官方发布页 `https://deepmind.google/blog/introducing-gemini-4-hydrogen/` 的原始存档（HTTP 200，417862 字节，服务端渲染 HTML），抓取于 2026-11-13。同一条发布文在 `https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/` 以同一字节数（417284 字节）镜像发布，两站正文与 JSON-LD 完全一致，互为同一篇官方原文。页面引用 17 张图片，其中 16 张全部原样下载到 `images/`（唯一失败项为站点装饰用 SVG `super-g-aurora.svg`，返回 404，非发布内容图片）。

## 发布日证据链（两源互证）

| 来源 | 原文 | 说明 |
|---|---|---|
| 发布页 JSON-LD | `"datePublished":"2026-11-12T18:00:00+00:00"`，`"dateModified":"2026-11-13T18:27:54.873135+00:00"` | deepmind.google 与 blog.google 两站 `<head>` 内 schema.org 节点的同一组时间戳 |
| 发布页页头日期行 | `Nov 12, 2026` | 正文标题下方的印刷日期，与 JSON-LD 的 UTC 日期一致 |
| 发布页页尾 | `Last updated November 13, 2026` | 页面修订日，非发布日；账本取发布日 **2026-11-12** |

## 发布要点（转录）

- 定位：原文「Today, we’re introducing Gemini 4 Hydrogen, bringing cutting-edge intelligence to everyone — with speed and efficiency for everyday coding and agentic workflows.」官方把它定位为「日常编码与智能体工作流」的快速执行型模型，与承担长程深度推理的 Gemini 4 Carbon / Gemini 4 Argon 区分开。
- 与同代旗舰的关系：原文「While our frontier models, Gemini 4 Carbon and Gemini 4 Argon, excel at deep, long-horizon reasoning on your hardest problems, Hydrogen is built for rapid execution across diverse agentic workflows.」
- 上线范围：原文「With Hydrogen, we’re also bringing Gemini 4 to everyone — for all tiers of Google AI Studio, the Gemini API, Gemini for business, the Gemini app, Google Search, and paid Google AI Pro and Ultra subscribers in Google Antigravity.」
- 定价：原文「Gemini 4 Hydrogen is priced flat across its entire 1 million-token context window at $1.50 per million input tokens and $7.50 per million output tokens.」
- 思考档位：原文「Hydrogen’s four thinking levels — low, medium, high (default), and a new xhigh tier — offer a wide range of options across quality, latency, and cost.」
- 官方模型页规格（`https://ai.google.dev/gemini-api/docs/models/gemini-4-hydrogen`）：模型代码 `gemini-4-hydrogen`；上下文窗口（输入输出统一上限）1,048,576 tokens；最大输出 65,536 tokens（默认同步）/ 最高 1,048,576 tokens（开启 long decode）。
- 多模型编排：原文「we’re introducing Orchestrator in Google Antigravity. Rather than using a single model from start to finish, Orchestrator dynamically switches between models like Carbon and Hydrogen within the same session.」
- 安全：原文「It reduces overreach in agentic tasks by up to 81% and under-service by up to 79%, and cuts misaligned actions and task shortcutting across tool-use and coding evaluations by 12x.」「…achieves a 94% honesty rate on our internal agent honesty evaluation.」「Hydrogen also preserves 99.9% chain-of-thought legibility with zero deceptive reasoning edits across more than 200,000 audited turns.」「Against indirect prompt injection attacks, Hydrogen is more than 2.3x more resilient on the Gray Swan IPI benchmark.」「…keeping false refusals on HealthBench Pro under 0.4%.」

## 评测数据

> 说明：发布页**没有 DOM 跑分表**（`<table>` 计数为 0），全部评测结论以**正文散文明文**给出，因此本 release 的证据行全部记 `evidence_type: "text"` / `status: "verified"`，无 pending 行。页面另有 6 张评测配图（GIF），按仓库口径**位图数值不得作为唯一证据**，故只作复核留证，其数值不入证据字段。

### 数值全量转录表

| 评测 | 分数 | 备注 |
|---|---|---|
| Artificial Analysis Intelligence Index（high，默认档） | 51 | 第三方榜单指数；竞品 Gemini 4 Argon 同档 50。页面未印指数版本号 |
| Artificial Analysis Intelligence Index（xhigh 档） | 54 | 同一榜单在最高思考档的读数 |
| Terminal-Bench 4.1 | 57% | 官方自跑；对比 Gemini 3.8 Flash 18.2%（官方称「more than tripling」） |
| HLE-Diamond | 58.8% | 官方称领先同级 |
| Vals Tax Agent Bench | 52.3% | 官方称总榜第 1 |
| Vals Legal Research Bench | 55.8% | 官方称并列第 1 |
| Multimodal Knowledge Agent (MKA) benchmark | 53.4% | 多模态知识工作端到端 |
| Agents' Last Exam v1.1 | 71.6% | 专业工作流端到端 |
| AutomationBench-AA | （未给数值） | 正文只称领先同级，绝对值仅见于配图 `images/04-gemini-4-hydrogen_automation-bench_graph.gif` |
| Agent Arena（arena.ai 实时榜） | （未给数值） | 正文只给名次 #5 |
| SWE-sweep | （未给数值） | 正文只称优于同级，无绝对值 |
| Gray Swan IPI | （未给数值） | 正文只给相对倍数「more than 2.3x more resilient」 |
| HealthBench Pro | under 0.4% | 官方口径为**误拒率上界**（「keeping false refusals … under 0.4%」） |
| 速度（vs Gemini 3.8 Flash） | 2.5 倍 / 2–2.8 倍 | 相对口径：自身任务完成快 2.5 倍；合作伙伴反馈 2–2.8 倍、token 用量降 12%–23% |
| 假声明（fabricated claims） | 减少 5 倍以上 | 相对口径，非标准公开评测 |
| Sheets 画布输出 | 快 30% 以上 | 相对口径（vs 前代模型） |
| Terminal-Bench 4.0（Orchestrator 编排） | 成功率接近 Carbon | 系统级（Carbon+Hydrogen 动态切换）指标，**不记为 Hydrogen 单模型行**；配额少耗 24%、快 19% |

### 配图清单（位图，仅作复核依据，数值不入证据字段）

| 文件 | 页面用途 |
|---|---|
| `images/02-gemini-4-hydrogen_benchmarks_table.gif` | 总评测表配图 |
| `images/03-gemini-4-hydrogen_aa-index_score-time_graph.gif` | Artificial Analysis 指数—速度散点图 |
| `images/04-gemini-4-hydrogen_automation-bench_graph.gif` | AutomationBench-AA 柱状图（AutomationBench 绝对值来源） |
| `images/05-gemini-4-hydrogen_aa-index_graph.gif` | Artificial Analysis 指数柱状图 |
| `images/06-gemini-4-hydrogen_t-bench_graph.gif` | Terminal-Bench 柱状图 |
| `images/07-gemini-4-hydrogen_hle_graph.gif` | HLE-Diamond 柱状图 |
| `images/08`–`images/10-…webp` | Gemini app / Antigravity 场景截图 |

## 协议与口径说明

- 官方发布页**未给出** Terminal-Bench、HLE、Vals、MKA、Agents' Last Exam 的脚手架、题目数、采样次数、判官与温度；协议字段一律留 null，评分均按厂商自报记 `vendor_reported`。
- Artificial Analysis Intelligence Index 为第三方榜单读数，按口径记 `third_party_reported`；官方只给 Hydrogen 与 Argon 两个自家模型的分值，其余竞品值未印。
- 思考档位仅在 Artificial Analysis 一处明示（high 默认 / xhigh 最高），其余评测行的思考档位页面未写，留 null。
- 页面未披露参数量，账本 `params` 记 null。

## 局限与待人工核验

1. AutomationBench-AA、Agent Arena、SWE-sweep、Gray Swan IPI 四项正文点名但未给绝对值，证据行按契约记 `score_status: "not_extracted"`、`value: null`；其绝对值仅见于上述配图，需人工读图确认后才能补值（补录走 `revisions[]`，不得直接改写）。
2. HealthBench Pro 的 0.4% 是**误拒率上界**（"under 0.4%"），非精确分值，与账本内其他 HealthBench 相关行不可直接横比。
3. 速度、token 用量、假声明减少倍数、Sheets 加速均为相对前代或竞品的营销口径，无绝对值与统一测试协议，按仓库口径不建行，仅留本文件转录。
4. Orchestrator 的 Terminal-Bench 4.0 成功率是**多模型系统**指标（Hydrogen 与 Carbon 动态切换），归因于系统而非 Hydrogen 单模型，故不建 Hydrogen 证据行。
5. 全部数值为厂商自报，本次未做本地复跑或第三方独立复现。
6. `images/` 下 17 张引用图中 1 张（`super-g-aurora.svg`）返回 404，未下载；该图为站点背景装饰，非发布内容图片。
