---
vendor: openai
model: GPT-5.2 Instant / GPT-5.2 Thinking / GPT-5.2 Pro
release: gpt-5-2
date: 2025-12-11
source: https://openai.com/index/introducing-gpt-5-2
fetched_at: 2026-11-15
---

# GPT‑5.2 官方发布页证据归档

本归档是 **OpenAI 官方发布文 `Introducing GPT‑5.2`** 的一级来源快照，用于给 `openai/gpt-5-2` 建档。该发布属**存量回填**（发布日 2025-12-11，早于本批增量窗口；候选 `openai-5f721228af36`）。

> 上一批（第五十三批起）已确认 GPT‑5.2 在 BioBasicsBench 发布文里的 5 档官方分值，但当时「本仓无 GPT‑5.2 的独立 release 档案，也未找到可定位其发布日的官方发布文」，故未建档。本批在 `openai.com` 发布 sitemap 中定位到官方发布文 `introducing-gpt-5-2`（页面印刷日 2025-12-11），补齐发布日证据链后正式建档。

## 来源与日期证据

| 证据 | 位置 | 内容 |
|---|---|---|
| 页面印刷日期行 | `page.html` 可见文本第 23 行 | `December 11, 2025` |
| 页面 H1 | `page.html` | `Introducing GPT‑5.2` |
| 页面副标题 | 同页 | `The most advanced frontier model for professional work and long-running agents.` |
| slug 互证 | `https://openai.com/sitemap.xml/release/` | 含 `https://openai.com/index/introducing-gpt-5-2`（与 `introducing-gpt-5-2-codex` 是两个独立 slug） |

发布日期取 **2025-12-11**（页面自身印刷日，date_precision=day）。

## 取数口径：数值来自页面 DOM `<table>`

本页的评测数据**不是位图**，而是 12 张服务端渲染的 DOM `<table>`（每格都是可机读文本），因此数值逐格机读，按契约记 `evidence_type: "text"` / `status: "verified"`。

页面里另有 11 段 vega-lite 载荷（写在 Next.js RSC 载荷里，`vegaLiteSpec.data.values`）。**这些图表的数据集用的是 `datasets` 命名引用而非内联 `values`**，绝对值不直接落在载荷里；对应的绝对值已由上表的 DOM 表格给出，因此本批**不重复从载荷取值**，避免同一数值出现两个来源。

### 评测转录表（自家模型列）

页面第 408 行明写：*"Below, we report comprehensive benchmark scores for GPT‑5.2 Thinking, along with a subset for GPT‑5.2 Pro."* 自家模型列 = **GPT‑5.2 Thinking** 与 **GPT‑5.2 Pro**；竞品列（GPT‑5.1 Thinking / GPT‑5.1 Instant）只进 notes，不建行。

#### 表 0 · 总览（GPT‑5.2 Thinking vs GPT‑5.1 Thinking）

| 基准 | GPT‑5.2 Thinking | GPT‑5.1 Thinking（竞品列） |
|---|---|---|
| GDPval (wins or ties) Knowledge work tasks | 70.9% | 38.8%（GPT‑5） |
| SWE-Bench Pro (public) Software engineering | 55.6% | 50.8% |
| SWE-bench Verified Software engineering | 80.0% | 76.3% |
| GPQA Diamond (no tools) Science questions | 92.4% | 88.1% |
| CharXiv Reasoning (w/ Python) Scientific figure questions | 88.7% | 80.3% |
| AIME 2025 (no tools) Competition math | 100.0% | 94.0% |
| FrontierMath (Tier 1–3) Advanced mathematics | 40.3% | 31.0% |
| FrontierMath (Tier 4) Advanced mathematics | 14.6% | 12.5% |
| ARC-AGI-1 (Verified) Abstract reasoning | 86.2% | 72.8% |
| ARC-AGI-2 (Verified) Abstract reasoning | 52.9% | 17.6% |

#### 表 1 · Mental health evaluations（GPT‑5.2 Instant / GPT‑5.2 Thinking）

| 指标 | GPT‑5.2 Instant | GPT‑5.1 Instant（竞品列） | GPT‑5.2 Thinking | GPT‑5.1 Thinking（竞品列） |
|---|---|---|---|---|
| Mental health | 0.995 | 0.883 | 0.915 | 0.684 |
| Emotional reliance | 0.938 | 0.945 | 0.955 | 0.785 |
| Self-harm | 0.938 | 0.925 | 0.963 | 0.937 |

#### 表 2 · Model naming across ChatGPT & API

| ChatGPT | API |
|---|---|
| Chat GPT‑5.2 Instant | GPT‑5.2‑chat‑latest |
| Chat GPT‑5.2 Thinking | GPT‑5.2 |
| Chat GPT‑5.2 Pro | GPT‑5.2 Pro |

#### 表 3 · Price per million tokens

| Model | Input | Cached input | Output |
|---|---|---|---|
| gpt-5.2 / gpt-5.2-chat-latest | $1.75 | $0.175 | $14 |
| gpt-5.2-pro | $21 | - | $168 |
| gpt-5.1 / gpt-5.1-chat-latest | $1.25 | $0.125 | $10 |
| gpt-5-pro | $15 | - | $120 |

#### 表 4 · GDPval 与投行表格建模

| 行 | GPT‑5.2 Thinking | GPT‑5.2 Pro | GPT‑5.1 Thinking（竞品列） |
|---|---|---|---|
| GDPval (ties allowed, wins or ties) | 70.9% | 74.1% | 38.8%（GPT‑5） |
| GDPval (ties allowed, clear wins) | 49.8% | 60.0% | 35.5%（GPT‑5） |
| GDPval (no ties) | 61.0% | 67.6% | 37.1%（GPT‑5） |
| Investment banking spreadsheet tasks (internal) | 68.4% | 71.7% | 59.1% |

#### 表 5 · 软件工程

| 行 | GPT‑5.2 Thinking | GPT‑5.2 Pro | GPT‑5.1 Thinking（竞品列） |
|---|---|---|---|
| SWE-Bench Pro, Public | 55.6% | - | 50.8% |
| SWE-bench Verified | 80.0% | - | 76.3% |
| SWE-Lancer, IC Diamond* | 74.6% | - | 69.7% |

#### 表 6 · ChatGPT 回答错误率

| 行 | GPT‑5.2 Thinking | GPT‑5.2 Pro | GPT‑5.1 Thinking（竞品列） |
|---|---|---|---|
| ChatGPT answers without errors (w/ search) | 93.9% | - | 91.2% |
| ChatGPT answers without errors (no search) | 88.0% | - | 87.3% |

#### 表 7 · 长上下文

| 行 | GPT‑5.2 Thinking | GPT‑5.2 Pro | GPT‑5.1 Thinking（竞品列） |
|---|---|---|---|
| OpenAI MRCRv2, 8 needles, 4k–8k | 98.2% | - | 65.3% |
| OpenAI MRCRv2, 8 needles, 8k–16k | 89.3% | - | 47.8% |
| OpenAI MRCRv2, 8 needles, 16k–32k | 95.3% | - | 44.0% |
| OpenAI MRCRv2, 8 needles, 32k–64k | 92.0% | - | 37.8% |
| OpenAI MRCRv2, 8 needles, 64k–128k | 85.6% | - | 36.0% |
| OpenAI MRCRv2, 8 needles, 128k–256k | 77.0% | - | 29.6% |
| BrowseComp Long Context 128k | 92.0% | - | 90.0% |
| BrowseComp Long Context 256k | 89.8% | - | 89.5% |
| GraphWalks bfs <128k | 94.0% | - | 76.8% |
| Graphwalks parents <128k | 89.0% | - | 71.5% |

#### 表 8 · 视觉与图表推理

| 行 | GPT‑5.2 Thinking | GPT‑5.2 Pro | GPT‑5.1 Thinking（竞品列） |
|---|---|---|---|
| CharXiv reasoning (no tools) | 82.1% | - | 67.0% |
| CharXiv reasoning (w/ Python) | 88.7% | - | 80.3% |
| MMMU Pro (no tools) | 79.5% | - | - |
| MMMU Pro (w/ Python) | 80.4% | - | 79.0% |
| Video MMMU (no tools) | 85.9% | - | 82.9% |
| Screenspot Pro (w/ Python) | 86.3% | - | 64.2% |

#### 表 9 · 工具使用

| 行 | GPT‑5.2 Thinking | GPT‑5.2 Pro | GPT‑5.1 Thinking（竞品列） |
|---|---|---|---|
| Tau2-bench Telecom | 98.7% | - | 95.6% |
| Tau2-bench Retail | 82.0% | - | 77.9% |
| BrowseComp | 65.8% | 77.9% | 50.8% |
| Scale MCP-Atlas | 60.6% | - | 44.5% |
| Toolathlon | 46.3% | - | 36.1% |

#### 表 10 · 科学与数学

| 行 | GPT‑5.2 Thinking | GPT‑5.2 Pro | GPT‑5.1 Thinking（竞品列） |
|---|---|---|---|
| GPQA Diamond (no tools) | 92.4% | 93.2% | 88.1% |
| HLE (no tools) | 34.5% | 36.6% | 25.7% |
| HLE (w/ search, Python) | 45.5% | 50.0% | 42.7% |
| MMMLU | 89.6% | - | 89.5% |
| HMMT, Feb 2025 (no tools) | 99.4% | 100.0% | 96.3% |
| AIME 2025 (no tools) | 100.0% | 100.0% | 94.0% |
| FrontierMath Tier 1–3 (w/ Python) | 40.3% | - | 31.0% |
| FrontierMath Tier 4 (w/ Python) | 14.6% | - | 12.5% |

#### 表 11 · 抽象推理

| 行 | GPT‑5.2 Thinking | GPT‑5.2 Pro | GPT‑5.1 Thinking（竞品列） |
|---|---|---|---|
| ARC-AGI-1 (Verified) | 86.2% | 90.5% | 72.8% |
| ARC-AGI-2 (Verified) | 52.9% | 54.2%（high） | 17.6% |

## 评测协议（页面脚注明示）

页面脚注（第 601 行）原文：

> *"Models were run with maximum available reasoning effort in our API (xhigh for GPT‑5.2 Thinking & Pro, and high for GPT‑5.1 Thinking), except for the professional evals, where GPT‑5.2 Thinking was run with reasoning effort heavy, the maximum available in ChatGPT Pro. Benchmarks were conducted in a research environment, which may provide slightly different output from production ChatGPT in some cases."*

据此：

- `protocol.reasoning_effort` = `xhigh`（GPT‑5.2 Thinking / Pro 的默认档）；
- **professional evals**（GDPval、投行表格建模、ChatGPT 回答错误率）改用 `heavy`（ChatGPT Pro 的最大档）；
- 其余协议键（harness / 工具 / shots / 温度 / top_p / token 预算 / 轮次 / 时间 / 跑次数 / 聚合 / 判分器）官方**未明示**，一律 `null`；
- 表 6 的「w/ search」行页面另注：*"Reasoning effort was set to the maximum available and a search tool was enabled."* —— 该行 `protocol.tools` 记 `search`，`reasoning_effort` 记 `xhigh`。

## 非评测内容转录

| 项 | 页面原文 | 账本处理 |
|---|---|---|
| 定位 | `GPT‑5.2 Thinking is the best model yet for real-world, professional use.` | 写入 `capability_summary` |
| GDPval 的人类基线 | `GPT‑5.2 Thinking beats or ties top industry professionals on 70.9% of comparisons on GDPval knowledge work tasks, according to expert human judges.` | 与表 4 首行互证，进 `quote_snippet` |
| 效率声明 | `GPT‑5.2 Thinking produced outputs for GDPval tasks at >11x the speed and <1% the cost of expert professionals` | 写入 `notes`（相对倍数，非基准分，不建行） |
| 投行内部基准 | `GPT 5.2 Thinking's average score per task is 9.3% higher than GPT‑5.1's, rising from 59.1% to 68.4%.` | 与表 4 末行互证 |
| SWE-bench Verified | `On SWE-bench Verified (not plotted), GPT‑5.2 Thinking scores our new high of 80%.` | 与表 5 互证 |
| Tau2-bench | `GPT‑5.2 Thinking achieves a new state of the art of 98.7% on Tau2-bench Telecom` | 与表 9 互证 |
| GPQA | `On GPQA Diamond ... GPT‑5.2 Pro achieves 93.2%, followed closely by GPT‑5.2 Thinking at 92.4%.` | 与表 10 互证 |
| FrontierMath | `On FrontierMath (Tier 1–3) ... GPT‑5.2 Thinking set a new state of the art, solving 40.3% of problems.` | 与表 10 互证 |
| ARC-AGI-2 | `On ARC-AGI-2 (Verified) ... GPT‑5.2 Thinking achieves a new state of the art for chain-of-thought models, scoring 52.9%. GPT‑5.2 Pro performs even higher, reaching 54.2%` | 与表 11 互证；`54.2% (high)` 的 high 档进 `notes` |
| 长上下文 | `it's the first model we've seen that achieves near 100% accuracy on the 4-needle MRCR variant (out to 256k tokens)` | 与表 7 前两行互证 |
| 定价 | `GPT‑5.2 is priced at $1.75/1M input tokens and $14/1M output tokens, with a 90% discount on cached inputs.` | 写入 `pricing` |
| 可用性 | `In ChatGPT, we'll begin rolling out GPT‑5.2 (Instant, Thinking, and Pro) today, starting with paid plans (Plus, Pro, Go, Business, Enterprise).` | 写入 `notes` |
| API 可用性 | `GPT‑5.2 Thinking is available today in the Responses API and Chat Completions API as gpt-5.2, and GPT‑5.2 Instant as gpt-5.2-chat-latest. GPT‑5.2 Pro is available in the Responses API as gpt-5.2-pro.` | 写入 `notes` |
| 新推理档 | `both GPT‑5.2 Pro and GPT‑5.2 Thinking now support the new fifth reasoning effort of xhigh` | 与脚注互证 |
| 上下文窗口 | 页面**未给出**具体窗口数值（只说 Responses 端点可"extends the model's effective context window"，MRCR 表格用到 256k 输入档） | 一律 `null` |
| 参数量 | 页面**未给出** | `null` |
| Codex 特化版 | `we expect to release a version of GPT‑5.2 optimized for Codex in the coming weeks.` | 写入 `notes`（对应后到的 `gpt-5-2-codex`） |
| Preparedness / 安全分级 | 页面只给"少数几类 undesirable responses 减少"的定性表述 | 见表 1，不建额外行 |

## 归档图片

| 文件 | 内容 |
|---|---|
| `images/00-gpt-5-1-image-components.webp` | GPT‑5.1 识别主板元件的示例输出（对照组） |
| `images/01-gpt-5-2-image-components.webp` | GPT‑5.2 识别主板元件的示例输出 |
| `images/02-gpt-5-1-tool-calling.webp` | GPT‑5.1 工具调用输出示例（对照组） |
| `images/03-gpt-5-2-tool-calling.webp` | GPT‑5.2 工具调用输出示例 |
| `images/04-spreadsheet-output-comparison.webp` | GPT‑5.1 与 GPT‑5.2 电子表格输出并排对比 |

> 页面「Keep reading」推荐区的三张封面（ChatGPT Wallet、Businesses in ChatGPT、AWS Marketplace）属于其它发布，**未归档**。

## 局限与注意

- 本页全部评测数值都是 DOM 表格的机读文本，**不存在位图读数问题**，无需 OCR 转写。
- 页面**未明示**评测 harness、工具（除表 6 的 search 外）、shots、温度、top_p、token 预算、轮次、跑次数、聚合方式与判分器——`protocol` 12 键除 `reasoning_effort`（脚注明示）外一律 `null`。
- 官方脚注声明评测在 research environment 跑，可能与生产 ChatGPT 有细微差异。
- 表 1 的 0–1 量表**未在页面定义**满分含义与判分细则（细节在 system card，本页未给），因此该 3 行按"页面原值照录"处理，口径说明写进 `notes`。
- 表 4 末行"Investment banking spreadsheet tasks (internal)"是 OpenAI **内部**基准，题集与判分不公开、不可外部复跑，本站无对应 benchmark 实体，本批新铸 id `investment-banking-spreadsheet`。
- 表 6 的"ChatGPT answers without errors"是 OpenAI **内部**事实性评测集（去标识化 ChatGPT 查询集），题集不公开，本批新铸 id `chatgpt-answer-accuracy`。
- 表 1 的"Mental health evaluations"与站内已有的 `mentalhealthbench`（deploymentsafety.openai.com 的开放基准，1,215 段合成对话 + rubric 打分）**不是同一评测**，故另铸 id `openai-mental-health-safety`。
- **跨页冲突（不调和，各自记行）**：GPT‑5.4 发布页引用 GPT‑5.2 的 FrontierMath Tier 1–3 为 40.7%、Tier 4 为 18.8%/31.3%，与本页自报的 40.3%/14.6% 不一致。两处数值各自成行并在 notes 标注来源页，不做取舍。
