---
vendor: openai
model: GPT-5.2-Codex
release: gpt-5-2-codex
date: 2025-12-18
source: https://openai.com/index/introducing-gpt-5-2-codex/
fetched_at: 2026-11-15
---

# GPT‑5.2‑Codex 官方发布页证据归档

本归档是 **OpenAI 官方发布文 `Introducing GPT‑5.2‑Codex`** 的一级来源快照，用于给 `openai/gpt-5-2-codex` 建档。该发布属**存量回填**（发布日 2025-12-18，早于本批增量窗口；候选 `openai-cd8d6c8023f2`）。

## 来源与日期证据

| 证据 | 位置 | 内容 |
|---|---|---|
| 页面印刷日期行 | `page.html` 可见文本第 23 行 | `December 18, 2025` |
| 类目标签 | 同页紧随其后 | `Product` / `Release` |
| 页面 H1 | `page.html` | `Introducing GPT‑5.2‑Codex` |
| 页面副标题 | 同页 | `The most advanced agentic coding model for professional software engineering and defensive cybersecurity.` |

发布日期取 **2025-12-18**（页面自身印刷日，date_precision=day）。

## 取数口径：数值来自页面内嵌数据集

三张评测图都是页面内嵌的 vega-lite 组件（`vegaLiteSpec.data.values`，写在 Next.js RSC 载荷里），**不是位图**，因此数值逐格机读，按契约记 `evidence_type: "text"` / `status: "verified"`。

- **载荷 A** → 图表标题 `SWE-Bench Pro`（柱状图，x=model、y=value，文本层 `format: ".1%"`）
- **载荷 B** → 图表标题 `Terminal-Bench 2.0`（柱状图，同上格式）
- **载荷 C** → 图表标题 `["Professional Capture-the-Flag Challenges","Performance over time"]`（折线图，x=model、y=value，文本层 `format: ".1%"`）

页面**可见文本里没有任何百分数**（正文只给相对结论），全部绝对值都在这三份载荷里——所以只读正文会误判「无数值」。

## 评测转录表

### 载荷 A · SWE-Bench Pro

| 模型 | 分数 | 备注 |
|---|---|---|
| GPT‑5.2‑Codex | 56.4% | 自家模型列。原始值 `0.564` |
| GPT‑5.2 | 55.6% | 竞品列（`0.556`），只进 notes，不建行 |
| GPT‑5.1 | 50.8% | 竞品列（`0.508`），只进 notes，不建行 |

### 载荷 B · Terminal-Bench 2.0

| 模型 | 分数 | 备注 |
|---|---|---|
| GPT‑5.2‑Codex | 64.0% | 自家模型列。原始值 `0.64`，按 `.1%` 渲染为 64.0% |
| GPT‑5.2 | 62.2% | 竞品列（`0.622`），只进 notes，不建行 |
| GPT‑5.1‑Codex‑Max | 58.1% | 竞品列（`0.581`），只进 notes，不建行 |

两张图的纵轴标题均为 `Accuracy`。

### 载荷 C · Professional Capture-the-Flag（CTF）eval

图表标题 `Professional Capture-the-Flag Challenges` + 副标题 `Performance over time`；数据集每个对象带 `model` / `release_date` / `value`。

| 模型 | 发布日 | 分数 | 备注 |
|---|---|---|---|
| GPT‑5.2‑Codex | 2025-12-18 | 88.1% | 自家模型列。原始值 `0.881` |
| GPT‑5.2 | 2025-12-11 | 82.4% | 竞品列（`0.8235132515`），只进 notes，不建行 |
| GPT‑5.1‑Codex‑Max | 2025-11-19 | 75.6% | 竞品列（`0.756`），只进 notes，不建行 |
| GPT‑5‑Codex | 2025-09-15 | 50.5% | 竞品列（`0.5049896049896051`），只进 notes，不建行 |
| GPT‑5 | 2025-08-07 | 26.8% | 竞品列（`0.268324918324918`），只进 notes，不建行 |
| o3 | 2025-04-16 | 27.7% | 竞品列（`0.276819126819126`），只进 notes，不建行 |

图注说明该 eval 的口径：`The Professional Capture-the-Flag (CTF) eval measures how often the model can solve advanced, multi-step real-world challenges (requiring professional-level cybersecurity skills) in a Linux environment.` —— 题集、题量、判分流程官方均未公开，**不可外部复跑**。该 eval 在本站没有独立 benchmark 实体，本账本新铸 id `professional-ctf`（notes 标 `new-benchmark`）。

### 正文可核验的论断（与上表互证）

- `GPT‑5.2‑Codex achieves state-of-the-art performance on SWE-Bench Pro and Terminal-Bench 2.0, benchmarks designed to test agentic performance on a wide variety of tasks in realistic terminal environments.` —— 两个基准的 SOTA 论断在正文可定位，是两行 evidence 的 `quote_snippet`。
- `In SWE-Bench Pro, a model is given a code repository and must generate a patch to solve a realistic software engineering task.` —— 基准说明。
- `Terminal-Bench 2.0 is a benchmark for testing AI agents in real terminal environments. Tasks include compiling code, training models and setting up servers.` —— 基准说明。

## 非评测内容转录

| 项 | 页面原文 | 账本处理 |
|---|---|---|
| 定位 | `Today we're releasing GPT‑5.2‑Codex, the most advanced agentic coding model yet for complex, real-world software engineering.` | 写入 `capability_summary` |
| 分发 | `We're releasing GPT‑5.2‑Codex today in all Codex surfaces for paid ChatGPT users, and working towards safely enabling access to GPT‑5.2‑Codex for API users in the coming weeks.` | 写入 `notes` |
| 上下文窗口 / 定价 / 参数量 | 页面**未给出**（可见文本无 context window、无定价表、无参数量） | 一律 `null` |
| 网络安全能力分级 | `While GPT‑5.2‑Codex does not reach a 'High' level of cyber capability under our Preparedness Framework…` | 写入 `notes`，**不建 evidence 行**（Preparedness Framework 等级是定性分级，不是基准分） |
| Professional Capture-the-Flag (CTF) eval | 见上方「载荷 C」小节 | **已建行**（88.1%，机读数据集） |

## 归档图片

| 文件 | 内容 |
|---|---|
| `images/00-1536x1024.webp` | 页面正文里的设计稿样例配图（`Design mock used to generate a web prototype with Codex-5.2`），**与评测证据无关**，保留仅为还原页面原貌 |

## 局限与注意

- 本页三张评测图都是内嵌数据集（机读），不存在位图读数问题。
- 官方**未明示评测协议**（harness / 工具 / 温度 / 跑次数 / 判分器 / 推理档位）——`protocol` 12 键一律 `null`。SWE-Bench Pro、Terminal-Bench 2.0 在本站都有独立 benchmark 实体，其各自的协议口径请看对应条目；`professional-ctf` 目前只有本站新铸的兜底页。
- 页面末尾的「Keep reading」站内推荐区（Codex app、GPT‑5.3‑Codex、GPT‑5.3‑Codex System Card 等）属于其它发布，**未取其任何数值**；本条只代表 2025-12-18 这次发布。
