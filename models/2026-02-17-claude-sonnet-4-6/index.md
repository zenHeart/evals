---
vendor: anthropic
model: Claude Sonnet 4.6
release: claude-sonnet-4-6
date: 2026-02-17
source: https://www.anthropic.com/news/claude-sonnet-4-6
fetched_at: 2026-11-15
---

# Claude Sonnet 4.6 官方发布文证据归档

本归档是 **Anthropic 官方发布文 `Introducing Sonnet 4.6`** 的一级来源快照，用于给 `anthropic/claude-sonnet-4-6` 建档。该发布属**存量回填**（发布日 2026-02-17，早于本批增量窗口；候选 `anthropic-cbaf022d464f`）。

## 来源与日期证据

| 证据 | 位置 | 内容 |
|---|---|---|
| 页面 JSON-LD `datePublished` | `page.html` | `2026-02-17T00:00:00.000Z` |
| 官方模型文档页 `Released` 字段 | `platform.claude.com/docs/en/models/sonnet-4-6/overview` | `February 17, 2026` |
| 官方模型文档页 `Retirement` | 同页 | `Not sooner than February 17, 2027` |
| 官方模型文档页 `Status` | 同页 | `Active (legacy)` |
| 官方模型文档页 `Max output (Batch API, beta)` | 同页 | `300K tokens` |

两源指向同一天，发布日期取 **2026-02-17**（date_precision=day）。

## 取数口径

与 Opus 4.5 同型：评测数值以**位图**承载（页面 `<table>` 为 0，`vegaLiteSpec` / `data-data` 计数为 0），核心是一张 **2600×2960 的 12 行对比总表**（`images/01-2600x2960.webp`），表内数值**有印刷数字**，可逐格读出；另有 2 张单基准柱状图（无印刷数据标签，不建行）。

同时本页**有比 Opus 4.5 更完整的一组逐基准脚注**（Footnotes 段），给出了 harness、跑次数、思考预算、是否开工具等口径——本账本的 `protocol` 字段主要来自那里。

## 评测转录表（总表图片 `images/01-2600x2960.webp`，Sonnet 4.6 列）

| # | 类别 | 基准 | Sonnet 4.6 | 备注 |
|---|---|---|---|---|
| 1 | Agentic terminal coding | Terminal-Bench 2.0 | 59.1% | 表内印刷值。脚注注明「The Sonnet 4.6 score reported is with thinking turned off」 |
| 2 | Agentic coding | SWE-bench Verified | 79.6% | 表内印刷值。脚注：`Our score was averaged over 10 trials. With a prompt modification, we saw a score of 80.2%.` |
| 3 | Agentic computer use | OSWorld-Verified | 72.5% | 表内印刷值。脚注说明 Sonnet 4.5 起改用 OSWorld-Verified |
| 4 | Agentic tool use | τ²-bench · Retail | 91.7% | 表内印刷值 |
| 5 | Agentic tool use | τ²-bench · Telecom | 97.9% | 表内印刷值 |
| 6 | Scaled tool use | MCP-Atlas | 61.3% | 表内印刷值 |
| 7 | Agentic search | BrowseComp | 74.7% | 表内印刷值 |
| 8 | Multidisciplinary reasoning | Humanity's Last Exam (HLE) | 33.2%（without tools） / 49.0%（with tools） | 表内印刷值，**同一基准的两种条件合并为一行**（与站内 `anthropic/claude-opus-4-6` 的 HLE 行同形） |
| 9 | Agentic financial analysis | Finance Agent v1.1 | 63.3% | 表内印刷值 |
| 10 | Office tasks | GDPval-AA Elo | 1633 | 表内印刷值，**Elo 口径非百分比** |
| 11 | Novel problem-solving | ARC-AGI-2 | 58.3% | 表内印刷值，脚注：`The score shown reflects max effort; with high effort, we achieve a score of 60.4%.` → **另建一行**（high effort 60.4%） |
| 12 | Graduate-level reasoning | GPQA Diamond | 89.9% | 表内印刷值 |
| 13 | Visual reasoning | MMMU-Pro | 74.5%（without tools） / 75.6%（with tools） | 表内印刷值，**同一基准的两种条件合并为一行** |
| 14 | Multilingual Q&A | MMMLU | 89.3% | 表内印刷值 |

**同表竞品列**（只进 notes，不单独建行）：

| 基准 | Sonnet 4.5 | Opus 4.6 | Opus 4.5 | Gemini 3 Pro | GPT-5.2 (all models) |
|---|---|---|---|---|---|
| Terminal-Bench 2.0 | 51.0% | 65.4% | 59.8% | 56.2%（54.2% self-reported） | 64.7%（64.0% self-reported, Codex CLI） |
| SWE-bench Verified | 77.2% | 80.8% | 80.9% | 78.0%（Flash） | 80.0% |
| OSWorld(-Verified) | 61.4% | 72.7% | 66.3% | — | 38.2% |
| τ²-bench Retail / Telecom | 86.2% / 98.0% | 91.9% / 99.3% | 88.9% / 98.2% | 85.3% / 98.0% | 82.0% / 98.7% |
| MCP-Atlas | 43.8% | 59.5% | 62.3% | 54.1% | 60.6% |
| BrowseComp | 43.9% | 84.0% | 67.8% | 59.2%（Deep Research） | 77.9%（Pro） |
| HLE without / with tools | 17.7% / 33.6% | 40.0% / 53.0% | 30.8% / 43.4% | 37.5% / 45.8% | 36.6% / 50.0%（Pro） |
| Finance Agent v1.1 | 54.5% | 60.1% | 58.8% | 55.2% | 59.0% |
| GDPval-AA Elo | 1276 | 1606 | 1416 | 1201 | 1462 |
| ARC-AGI-2 | 13.6% | 68.8% | 37.6% | 31.1% | 54.2%（Pro） |
| GPQA Diamond | 83.4% | 91.3% | 87.0% | 91.9% | 93.2%（Pro） |
| MMMU-Pro without / with tools | 63.4% / 68.9% | 73.9% / 77.3% | 70.6% / 73.9% | 81.0% / — | 79.5% / 80.4% |
| MMMLU | 89.5% | 91.1% | 90.8% | 91.8% | 89.6% |

> **跨页冲突（不调和）**：本表把 Opus 4.5 的 Terminal-Bench 2.0 记为 **59.8%**，而 Opus 4.5 自己的发布文总表记为 **59.3%**；本表把 Sonnet 4.5 的 Terminal-Bench 2.0 记为 **51.0%**，而 Sonnet 4.5 自己的发布文记为 **50.0%**。两个模型各自的 release 条目都按**其自身发布页**取值，另一处数值只写进 notes。

## 官方评测协议（Footnotes 段逐条照录）

| 脚注 | 原文 | 写入字段 |
|---|---|---|
| Terminal-Bench 2.0 | `All runs used the Terminus-2 harness, except for OpenAI's Codex CLI. All experiments used 1× guaranteed/3× ceiling resource allocation and 5–15 samples per task across staggered batches. The Sonnet 4.6 score reported is with thinking turned off.` | `protocol.harness = "Terminus-2"`、`run_count = "5–15 samples per task"`、`aggregation = "1× guaranteed/3× ceiling resource allocation"`、`reasoning_effort = null`（thinking turned off） |
| SWE-bench Verified | `Our score was averaged over 10 trials. With a prompt modification, we saw a score of 80.2%.` | `run_count = 10`、`aggregation = "averaged over 10 trials"`；80.2% 是**带 prompt 改动的另一条件**，不并入主行，写进 notes |
| Humanity's Last Exam | `Claude models run "with tools" were run with web search, web fetch, code execution, programmatic tool calling, context compaction triggered at 50k tokens up to 3M total tokens, max reasoning effort, and adaptive thinking enabled. A domain blocklist was used to decontaminate eval results.` | `tools = ["web_search","web_fetch","code_execution","programmatic_tool_calling","context_compaction"]`、`reasoning_effort = "max"`、`token_budget = "context compaction triggered at 50k tokens up to 3M total tokens"`、`judge = "domain blocklist decontamination"` |
| BrowseComp | `Claude models were run with web search, web fetch, programmatic tool calling, context compaction triggered at 50k tokens up to 10M total tokens, max reasoning effort, and no thinking enabled.` | `tools = ["web_search","web_fetch","programmatic_tool_calling","context_compaction"]`、`reasoning_effort = "max"`、`token_budget = "context compaction triggered at 50k tokens up to 10M total tokens"`、`thinking = none enabled` |
| ARC-AGI-2 | `Claude Sonnet 4.6 was run with max and high effort and a 120k thinking budget score. The score shown reflects max effort; with high effort, we achieve a score of 60.4%.` | 主行 `reasoning_effort = "max"`、`token_budget = "120K"`；另建 high effort 行（60.4%） |
| MMMU-Pro | `We made two small updates to our MMMU-Pro implementation that have affected the score: 1) our previous implementation contained the prefix "Let's think step-by-step," which we have removed, and 2) we previously graded this multiple-choice eval by looking at on-policy token probabilities of the multiple-choice options; we now grade it using a separate model (Claude Sonnet 4).` | `judge = "separate model (Claude Sonnet 4) 判分"`；实现变更写入 notes |
| OSWorld | `Scores prior to Claude Sonnet 4.5 were measured on the original OSWorld; scores from Sonnet 4.5 onward use OSWorld-Verified. OSWorld-Verified (released July 2025) is an in-place upgrade of the original OSWorld benchmark, with updates to task quality, evaluation grading, and infrastructure.` | 记入 `benchmark_variant = "Verified"` 与 notes |

## 非评测内容转录

| 项 | 页面原文 | 账本处理 |
|---|---|---|
| 定位 | `Claude Sonnet 4.6 is our most capable Sonnet model yet. It's a full upgrade of the model's skills across coding, computer use, long-context reasoning, agent planning, knowledge work, and design.` | 写入 `capability_summary` |
| 定价 | `remains the same as Sonnet 4.5, starting at $3/$15 per million tokens.` | `pricing`（与官方模型文档页一致） |
| 上下文 | `Sonnet 4.6 also features a 1M token context window in beta.` | `context_window = "1M"`（beta） |
| 模型文档页规格 | Context window `1M tokens`、Max output `128K tokens`、Max output (Batch API, beta) `300K tokens`、Thinking `Adaptive (extended deprecated)`、Default effort `high`、Reliable knowledge cutoff `Aug 2025`、Training data cutoff `Jan 2026` | 写入 `models[]` 与 `notes` |
| 用户偏好（非基准分） | `In Claude Code, our early testing found that users preferred Sonnet 4.6 over Sonnet 4.5 roughly 70% of the time.`；`Users even preferred Sonnet 4.6 to Opus 4.5, our frontier model from November, 59% of the time.` | **不建 evidence 行**（用户主观偏好，不是基准分） |
| 内部基准 | `we saw a significant jump in answer match rate compared to Sonnet 4.5 in our Financial Services Benchmark` | **不建行**（内部基准，绝对分未印） |
| 保险内部基准 | `Claude Sonnet 4.6 hit 94% on our insurance benchmark` | **不建行**（官方未给基准名，内部评测） |
| 参数 / 激活参数 | 页面与官方模型文档页均未给出 | `null` |

## 归档图片

| 文件 | 内容 | 是否建行 |
|---|---|---|
| `images/00-3840x1948.webp` | OSWorld 柱状图（alt：`Chart comparing several Sonnet model scores on the OSWorld benchmark`） | 否（无印刷数据标签；数值以总表为准） |
| `images/01-2600x2960.webp` | **12 行基准对比总表**（alt：`A table of popular benchmarks and Sonnet 4.6's relative performance compared to other fron…`） | **是**（表内印刷数字） |
| `images/02-3840x2160.webp` | 安全/对齐相关单图 | 否（无印刷标签或基准未命名） |

## 局限与注意

- 总表里的数字是**位图上的印刷数字**，可逐格核对；本条沿用站内既有 Anthropic 条目的 `image-transcription` 口径。
- 官方模型文档页把 Sonnet 4.6 标为 `Active (legacy)`（退役不早于 2027-02-17），并提示迁移到 Claude Sonnet 5.5——这是**当前状态**，不改变 2026-02-17 的发布日期。
- 官方**未明示** temperature / top_p 具体值、`shots`、判分器（除 MMMU-Pro 外）、时间上限与跑次数（除 SWE-bench Verified 与 Terminal-Bench 2.0 外），对应 `protocol` 字段一律 `null`。
- 本条与既有 `anthropic/claude-sonnet-4-5`（2025-09-29）是**不同代际的不同发布**；本表里 Sonnet 4.5 列的数值是竞品列，不构成本模型的自报值。
