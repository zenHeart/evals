---
vendor: anthropic
model: Claude Opus 4.5
release: claude-opus-4-5
date: 2025-11-24
source: https://www.anthropic.com/news/claude-opus-4-5
fetched_at: 2026-11-15
---

# Claude Opus 4.5 官方发布文证据归档

本归档是 **Anthropic 官方发布文 `Introducing Claude Opus 4.5`** 的一级来源快照，用于给 `anthropic/claude-opus-4-5` 建档。该发布属**存量回填**（发布日 2025-11-24，早于本批增量窗口；候选 `anthropic-7e389b0b8a7a`）。

## 来源与日期证据

| 证据 | 位置 | 内容 |
|---|---|---|
| 页面 JSON-LD `datePublished` | `page.html` | `2025-11-24T00:00:00.000Z` |
| 官方模型文档页 `Released` 字段 | `platform.claude.com/docs/en/models/opus-4-5/overview` | `November 24, 2025` |
| 官方模型文档页 `Retirement` | 同页 | `Not sooner than November 24, 2026` |
| 官方模型文档页 `Status` | 同页 | `Active (legacy)` |
| API snapshot id | 同页 `Claude API` 字段 | `claude-opus-4-5-20251101` |

三源指向同一天，发布日期取 **2025-11-24**（date_precision=day）。

## 取数口径

该页的评测数值**以位图承载**（页面 `<table>` 数为 0，`vegaLiteSpec` / `data-data` 数据集计数为 0）：核心的 9 项基准对比是一张 **2600×2236 的总表图片**（`images/01-2600x2236.webp`），另有 8 张单基准柱状图。表内数值**有印刷数字**，可逐格读出；柱状图则**无印刷数据标签**，只有坐标轴刻度。

按契约：
- **总表图片里印刷出数字的行** → 记 `evidence_type: "image-transcription"`，`status: "verified"`（与站内既有 `anthropic/claude-sonnet-4-5`、`anthropic/claude-opus-4-6` 的同一先例一致：数值有印刷出处，claim 亦可在正文定位）。
- **柱状图里只有轴刻度、没有印刷数字的** → 不建行（视觉估读属于臆造数值），只在下面记录。
- **正文明文印出的数字** → `evidence_type: "text"`，`status: "verified"`。

## 评测转录表（总表图片 `images/01-2600x2236.webp`，Opus 4.5 列）

| # | 类别 | 基准 | Opus 4.5 | 备注 |
|---|---|---|---|---|
| 1 | Agentic coding | SWE-bench Verified | 80.9% | 表内印刷值 |
| 2 | Agentic terminal coding | Terminal-bench 2.0 | 59.3% | 表内印刷值。**跨页冲突**：Claude Sonnet 4.6 发布文的对照表把 Opus 4.5 记为 59.8%，本条按**本发布页自己的表**取 59.3% |
| 3 | Agentic tool use | τ²-bench · Retail | 88.9% | 表内印刷值 |
| 4 | Agentic tool use | τ²-bench · Telecom | 98.2% | 表内印刷值 |
| 5 | Scaled tool use | MCP Atlas | 62.3% | 表内印刷值 |
| 6 | Computer use | OSWorld | 66.3% | 表内印刷值 |
| 7 | Novel problem solving | ARC-AGI-2 (Verified) | 37.6% | 表内印刷值 |
| 8 | Graduate-level reasoning | GPQA Diamond | 87.0% | 表内印刷值 |
| 9 | Visual reasoning | MMMU (validation) | 80.7% | 表内印刷值 |
| 10 | Multilingual Q&A | MMMLU | 90.8% | 表内印刷值 |

**同表竞品列**（只进 notes，不单独建行）：Sonnet 4.5 列 SWE-bench Verified 77.2% / Terminal-bench 2.0 50.0% / τ²-bench Retail 86.2% / Telecom 98.0% / MCP Atlas 43.8% / OSWorld 61.4% / ARC-AGI-2 13.6% / GPQA 83.4% / MMMU 77.8% / MMMLU 89.1%；Opus 4.1 列 74.5% / 46.5% / 86.8% / 71.5% / 40.9% / 44.4% / — / 81.0% / 77.1% / 89.5%；Gemini 3 Pro 列 76.2% / 54.2% / 85.3% / 98.0% / — / — / 31.1% / 91.9% / — / 91.8%；GPT-5.1 列 76.3%（GPT-5.1-Codex-Max 77.9%）/ 47.6%（Codex-Max 58.1%）/ — / — / — / — / 17.6% / 88.1% / 85.4% / 91.0%。

### 正文明文印出的评测数值（另建行）

| 基准 | 分数 | 正文原句 |
|---|---|---|
| BrowseComp-Plus（fetch-enabled 版） | 85.30% | 脚注 04：`A fetch-enabled version of BrowseComp-Plus. Specifically, the improvement was from 70.48% without using the combination of techniques to 85.30% using it.` |
| BrowseComp-Plus（未用该技术组合） | 70.48% | 同脚注。**两个数值是同一模型在同一基准上的两种条件，拆成两行**（variant 区分），不是两个基准 |

> BrowseComp-Plus 在本站没有独立 benchmark 实体，账本新铸 id `browsecomp-plus`（notes 标 `new-benchmark`）。

## 官方评测协议（页面「Methodology」段，逐字照录）

> All evals were run with a 64K thinking budget, interleaved scratchpads, 200K context window, default effort (high), default sampling settings (temperature, top_p), and averaged over 5 independent trials. Exceptions: SWE-bench Verified (no thinking budget) and Terminal Bench (128K thinking budget).

据此写入 `protocol`：

| 字段 | 值 | 适用范围 |
|---|---|---|
| `token_budget` | `64K thinking budget` | 全部评测（默认） |
| `reasoning_effort` | `high`（default effort） | 全部评测（默认） |
| `run_count` | `5`（averaged over 5 independent trials） | 全部评测（默认） |
| `aggregation` | `averaged over 5 independent trials` | 全部评测（默认） |
| `token_budget` | `null`（no thinking budget） | **例外**：SWE-bench Verified |
| `token_budget` | `128K thinking budget` | **例外**：Terminal-Bench |

另有两条脚注披露评测脚手架：

- 脚注 03：`Note that these evaluations were run on an in-progress upgrade to Petri, our open-source, automated evaluation tool. They were run on an earlier snapshot of Claude Opus 4.5.` → 涉及以 **Petri** 为 harness 的那组评测，写入 `protocol.harness` 并在 notes 说明「跑在早期快照上」。
- 脚注 02：`We improved the hosting environment to reduce infrastructure failures. This change improved Gemini 3 to 56.7% and GPT-5.1 to 48.6% from the values reported by their developers, using the Terminus-2 harness.` → Terminal-bench 2.0 的竞品列统一改用 **Terminus-2 harness** 在 Anthropic 基础设施上复现。

## 非评测内容转录

| 项 | 页面原文 | 账本处理 |
|---|---|---|
| 定价 | `Pricing is now $5/$25 per million tokens` | `pricing`（与官方模型文档页一致） |
| 上下文 / 输出 | 官方模型文档页：Context window `200K tokens`、Max output `64K tokens` | 写入 `models[]` |
| 知识截止 | 官方模型文档页：Reliable knowledge cutoff `May 2025`、Training data cutoff `Aug 2025` | 写入 `notes` |
| 内部 benchmark 论断 | `Claude Opus 4.5 beats Sonnet 4.5 and competition on our internal benchmarks, using fewer tokens to solve the same problems.` | **不建行**（内部评测，官方未给基准名与数值） |
| 内部 take-home exam | `Within our prescribed 2-hour time limit, Claude Opus 4.5 scored higher than any human candidate ever` | **不建行**（无名内部基准，且绝对分只在校招图里） |
| token 效率相对论断 | `It achieves higher pass rates on held-out tests while using up to 65% fewer tokens`；`Set to a medium effort level, Opus 4.5 matches Sonnet 4.5's best score on SWE-bench Verified, but uses 76% fewer output tokens. At its highest effort level, Opus 4.5 exceeds Sonnet 4.5 performance by 4.3 percentage points—while using 48% fewer tokens.` | 写入 `notes`；**不建行**（差值不是绝对分；4.3 个百分点是相对差） |
| 安全评测 | `Opus 4.5 is harder to trick with prompt injection than any other frontier model in the industry`（图注：`this benchmark includes only very strong prompt injection attacks. It was developed and run by Gray Swan.`） | 图内数值无印刷标签且基准未命名 → **不建行** |
| 参数 / 激活参数 | 页面与官方模型文档页均未给出 | `null` |

## 归档图片

| 文件 | 内容 | 是否建行 |
|---|---|---|
| `images/00-3840x2160.webp` | SWE-bench Verified 柱状图（alt：`Chart comparing frontier models on SWE-bench Verified where Opus 4.5 scores highest`） | 否（无印刷数据标签；数值以总表为准） |
| `images/01-2600x2236.webp` | **9 项基准对比总表**（alt：`Comparison table showing frontier model performance across popular benchmarks`） | **是**（表内印刷数字） |
| `images/02-3840x2160.webp` | SWE-bench Multilingual 分语言柱状图（C / C++ / Go / Java / JS-TS / PHP / Ruby / Rust，PASS@1 %） | 否（无印刷标签，按轴刻度读数等于臆造） |
| `images/03-3840x2160.webp` ~ `images/08-3840x2160.webp` | 其余各单项基准柱状图（视觉推理、内部 benchmark、prompt injection 鲁棒性等） | 否（同上） |

页面另有 21 张**员工头像 SVG**（`Jeff Wang logo` 等）与 3 张 YouTube 视频缩略图，与评测证据无关，未归档。

## 局限与注意

- 总表里的数字是**位图上的印刷数字**，可逐格核对；本站既有 Anthropic 条目用同一口径（`evidence_type: "image-transcription"` + `status: "verified"`），本条沿用。
- 8 张柱状图**只有坐标轴刻度、没有数据标签**，按「不臆造数值」纪律不建行；需要这些数值时应等官方印出带标签的版本或读其系统卡。
- 官方模型文档页把 Opus 4.5 标为 `Active (legacy)`（退役不早于 2026-11-24），并提示「should consider migrating to Claude Opus 5.5」——这是**当前状态**，不改变 2025-11-24 的发布日期。
- 官方「Methodology」段的 `default sampling settings (temperature, top_p)` **没有给具体数值**，因此 `protocol.temperature` / `protocol.top_p` 记 `null`，只把「用了默认采样设置」写进 notes。
- 本条与既有 `anthropic/claude-opus-4-6`（2026-02-05）、`anthropic/claude-sonnet-4-6`（本批另一条，2026-02-17）是**不同代际的不同发布**，其表内互相引用的竞品值不构成本模型的自报值。
