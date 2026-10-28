---
vendor: google
model: Gemini 4 Carbon
release: gemini-4-carbon
date: 2026-10-28
source: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/
fetched_at: 2026-10-28
---

# Gemini 4 Carbon: our next frontier model（Google，2026-10-28）

> 本归档含 Google 官方发布的 **两份一级材料**：
> `page.html` = 正式发布页（https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/）；
> `evals-methodology.pdf` = 同日发布的《Gemini 4 Carbon Model evaluation — Approach, methodology & results》评测方法说明（https://deepmind.google/models/evals-methodology/gemini-4-carbon/）。
> 发布日证据（四源互证）：发布页文章头部印刷日期行「October 28, 2026」、页面 JSON-LD `datePublished=2026-10-28T17:00:00+00:00`、`article:published_time` meta 为 2026-10-28、Google DeepMind 官方博客 RSS 同条 pubDate。
> 深度链接（DeepMind 站内地址）会 301 跳转到 blog.google 的规范页，字节一致，故只归档一份 HTML。

## 发布要点（转录）

- 官方定位：「Gemini 4 Carbon 是我们最强的模型，具备最先进（SOTA）的网络安全与长程任务能力」。
- 官方称 Carbon 在 **Artificial Analysis Intelligence Index v5.0 排名第一（指数 59）**。
- 面向长程工程：内部团队称 Carbon 能连续运行数天，在死胡同里持续推进，处理跨大型代码库与底层系统的根因定位与补丁这类多步复杂工程任务。
- 上线节奏（**分阶段**）：本周先向一部分网络防御者开放，再经 **Fairwind Program** 逐步扩展到更多可信伙伴，之后才面向开发者、企业与消费者开放；官方称正在参与美国政府的自愿发布前模型测试流程。
- 价格：与 Gemini 4 Argon 相同的引入期价格——每百万输入 token $2、每百万输出 token $10（缓存输入按 95% 折扣）；**引入期结束后**调整为每百万输入 $4、每百万输出 $20。
- 能力域：官方称本次重点改善了编码、智能体、科学任务、全栈 Web 开发与多模态理解。

## 评测数据（正文明文，逐行转录）

> 本节 8 条全部为**正文散文明文绝对值**（页面无 DOM 评测表），故按契约直接记入数值并翻 verified。
> 方法说明 PDF 给出的协议：Gemini 4 Carbon 与 Argon 的分数除特别说明外均为 **pass@1**、单次尝试（无多数投票、无并行测试时计算）、统一以 **Gemini API 最高思考档** 运行，小基准取多次试验平均。

| 评测 | 分数 | 协议（来自官方方法说明 PDF） | 备注 |
| --- | --- | --- | --- |
| Artificial Analysis Intelligence Index v5.0 | 59 | AA 复合指数 v5.0（含工具） | 第三方榜单读数，不计厂商自报；官方称排名第 1（名次非分值）。v5.0 与既有 v4.1.1 不可跨版比较 |
| SEC-bench Pro | 88.2% | Pass@1；183 题 May 2026 JavaScript 引擎切分；每题 3 次独立尝试取平均；Antigravity 脚手架；LLM 裁判复核崩溃是否源于目标漏洞 | 官方自跑开源评测设置（非第三方榜读数）；属「未启用护栏的外部基准」 |
| ExploitGym | 54.8% | Causal Pass Rate；单次尝试、无联网；Antigravity 脚手架；默认设置并关闭缓解措施；10 小时/题超时档 | 官方自跑；同模型 6 小时档为 53.5%（仅作口径提示）；判定需拿到目标 flag 且经 LLM 裁判确认命中预期漏洞 |
| Collinear's CWE-bench v1 | 71.0% | 程序化 pass@1，同分以 pass@4 破平；榜内 Gemini 4 Carbon 一列标注脚手架 Antigravity | 由 Collinear AI 对全部模型统一评测的官方公开榜，故记第三方榜读数；Collinear 官网披露 1,000+ 现成任务、215 类 CWE、120 道留出评测任务 |
| Gray Swan IPI（间接提示注入） | 0.0% | k=15 次自适应尝试下的攻击成功率（越低越好） | Argon 同口径 0.7%；竞品值只记 notes，不建 comparison_cited 行 |
| Terminal-Bench 4.0 作弊成功比例 | 0.0% | 官方未给该指标的脚手架细节 | **不是 Terminal-Bench 解题率**；本页未披露解题率明文数值 |
| Terminal-Bench 4.0 尝试作弊比例 | 0.4% | 同上 | 同上；与上一行是同一句里的两个不同度量，故分列两行 |
| WebDev Arena | 1768 Elo | 第三方盲选竞技场榜单 | 官方称较前 +89 Elo、位列第 4（名次与相对差只记 notes） |

## 配图总表（数值只在官方配图里 → pending）

> 官方发布文内嵌一张总表图片（`images/carbon-evals-table.webp`），列出 17 个基准的 5 列模型分值。
> 其中 **AA Index v5.0 / SEC-bench Pro / ExploitGym / CWE-bench** 四项同时有正文明文值（见上表，已按明文记 verified）；
> 其余 **13 项数值只存在于图片**，按纪律一律记 `status: pending` + `score_status: not_extracted`，**视觉转写值只写进 notes**，不得自动翻 verified。

| 评测 | Gemini 4 Carbon（视觉转写） | 同表其他模型（视觉转写） | 协议要点（来自方法说明 PDF） |
| --- | --- | --- | --- |
| Vals Index v2.2 | 70.4% | Argon 69.2% / GPT-6 Astra 65.0% / Opus 5.5 70.2% / Fable 5.1 未列 | 取自 Vals AI（第三方指数） |
| SWE-sweep | 9.6% | Argon 4.3% / GPT-6 Astra 9.5% / Opus 5.5 3.6% / Fable 5.1 2.9% | 官方用 mini-swe-agent 脚手架自算，指标为 subtask-weighted reward；竞品取自官方公开榜 |
| FrontierSWE 2 | 61.2% | Argon 55.0% / GPT-6 Astra 65.5%（该行最高）/ Opus 5.5 62.3% / Fable 5.1 56.3% | 取自 Proximal 官方公开榜 |
| Terminal-Bench 4.0 (AA) | 65.2% | Argon 57.1% / GPT-6 Astra 59.1% / Opus 5.5 59.6% / Fable 5.1 52.0% | 取自 Artificial Analysis |
| Agents' Last Exam v1.1（Score） | 77.4% | Argon 69.0% / GPT-6 Astra 73.1% / Opus 5.5 71.6% / Fable 5.1 未列 | 122 题 v1.1；默认 ALE-Claw 脚手架；5 小时窗口；启用安全过滤；用 2026-10-17 任务版本（未套用 10-26 更新）；报告 rubric 平均 Score |
| OSWorld 2.1（Offline subset） | 81.5% | Argon 74.7% / GPT-6 Astra 80.9% / Opus 5.5 87.2%（该行最高）/ Fable 5.1 76.8% | 82 题离线（无联网）子集；官方 docker + 官方评测器；默认 1080p、最大步长 500；Gemini CUA 脚手架（并行批量工具调用）；PyAutoGUI 操作 + 仅截图观察；取 3 次运行最大值 |
| AutomationBench（Zapier） | 53.9% | Argon 51.3% / GPT-6 Astra 41.4% / Opus 5.5 42.5% / Fable 5.1 31.4% | 私有集；取自 Zapier 官方公开榜 |
| Vending-Bench 2（Bank balance $） | $16,484 | Argon $13,718 / GPT-6 Astra $15,515 / Opus 5.5 $9,235 / Fable 5.1 $5,422 | 余额型分数（美元，越高越好）；取自 Andon Labs 官方公开榜 |
| Chartography | 72.5% | Argon 71.6% / GPT-6 Astra 71.0% / Opus 5.5 66.3% / Fable 5.1 46.2% | 不使用工具；取自 Surge 官方公开榜 |
| Blueprint-Bench 2（Similarity score） | 58.6% | Argon 54.4% / GPT-6 Astra 49.7% / Opus 5.5 51.2% / Fable 5.1 41.9% | 取自 Andon Labs 官方公开榜 |
| GraphWalks（256k to 1M, BFS F1） | 96.2% | Argon 84.2% / GPT-6 Astra 71.8% / Opus 5.5 66.8% / Fable 5.1 65.0% | 全部模型由官方自算；256k–1M 子集为上下文长度介于 256k 与 1M token 的 200 道题，报告 BFS F1 |
| RiemannBench | 80.0% | Argon 76.0% / GPT-6 Astra 72.0% / Opus 5.5 69.6% / Fable 5.1 65.6% | 取自 Surge 官方公开榜 |
| Terminal-Bench-Science 0.1 (AA) | 64.8% | Argon 52.9% / GPT-6 Astra 63.3% / Opus 5.5 59.0% / Fable 5.1 43.3% | 取自 Artificial Analysis |

## 单项基准配图（随发布文一并归档）

| 文件 | 内容 |
| --- | --- |
| `images/carbon-secbench-pro.webp` | SEC-bench Pro 柱状图（Pass@1） |
| `images/carbon-exploitgym.webp` | ExploitGym 柱状图（Causal Pass Rate，标注每模型超时档：Carbon 10h / 6h、Argon 10h / 6h 等） |
| `images/carbon-cwe-bench.webp` | CWE-bench 柱状图（Pass@1，ties broken by Pass@4），并标注各家脚手架（Antigravity / opencode / Codex / Claude Code） |
| `images/carbon-gray-swan.webp` | Gray Swan IPI 柱状图（k=15 攻击成功率，越低越好） |
| `images/carbon-hero.webp` | 发布文头图 |

## 不构成标准公开基准的量化结论（仅备查，不建 evidence 行）

- **内部基准**：官方称 Carbon 生成安全代码的成功率较 Argon **提升逾 2 倍**（只给相对值，无绝对分、无基准名）。
- **内部团队真实编码环境**：高危越狱（misalignment）告警**下降近 80%**。
- **内部测试**：无依据声明（unsupported claims）较 Argon **减少约 2 倍**；越界执行下降 **26%**、服务不足下降 **29%**。
- **Chrome 团队（第三方客户）**：称 Carbon 生成高质量补丁的表现比**另一家实验室的大型前沿模型好逾 10 倍**（未印对方分数，故不建 comparison_cited 行）。
- **Wiz（第三方客户）**：观察到 Carbon 在 **Web 渗透测试相关基准上领先**（未印数值）。
- **相对结论**：正文称 Carbon「在编码与智能体任务上显著提升」（未给绝对值）。
- 参数量与上下文长度官方未明示，账本记 null（GraphWalks 的「256k 至 1M」是评测覆盖的上下文长度区间，不等于模型上下文窗口）。

## 与既有条目的关系

- 既有 `gemini-4-argon`（2026-09-30）记录 **Gemini 4 Argon 的限量首发**（仅向 Fairwind Program 可信网络防御者开放）。
- 既有 `gemini-4-argon-ga`（2026-10-13）记录 **Argon 正式放开**（收录 6 条 evidence）。
- 本 release `gemini-4-carbon`（2026-10-28）记录 **第三代前沿模型 Gemini 4 Carbon**，官方称其接续两周前发布的 Argon。
- 按账本契约「只追加、不改既有文件」，三者并存而不互相覆盖。

## 归档说明

- `page.html`、`evals-methodology.pdf` 均为官方一手材料原样存档；`images/` 为发布文内嵌图片原样下载。
- 页面评测数值分两类：**正文明文**（8 条，账本记 verified）与**配图总表**（13 条，账本记 pending + not_extracted，视觉转写值只进 notes）。
- 官方未公开题集、样本量细节以外的部分评分细则；协议字段一律以方法说明 PDF 为准，PDF 未明示者留 null。
- 本批新增 benchmark id 2 个（`swe-sweep`、`riemannbench`）未找到可核验的独立官网/论文地址，暂由兜底页承载；`cwe-bench`、`gray-swan-ipi`、`vals-index` 本批补建了正式实体。
