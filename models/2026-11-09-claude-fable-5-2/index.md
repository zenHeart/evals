---
vendor: anthropic
model: Claude Fable 5.2 / Claude Mythos 5.2
release: claude-fable-5-2
date: 2026-11-09
source: https://www.anthropic.com/claude-fable-and-mythos-5-2
fetched_at: 2026-11-09
---

# Introducing Claude Fable 5.2 and Claude Mythos 5.2（Anthropic 官方发布文归档）

发布日期证据：官方发布页**可见文字**印刷「November 9, 2026」（页面无 JSON-LD `datePublished`）；并由两处官方文档页互证——

- `https://platform.claude.com/docs/en/models/fable-5-2/overview` 正文首行印「**Latest.** Released November 9, 2026.」
- `https://platform.claude.com/docs/en/models/mythos-5-2/overview` 正文首行印「**Verification required.** Released November 9, 2026.」
- `https://platform.claude.com/docs/en/release-notes/overview` 有「### November 9, 2026」小节

- 发布文：https://www.anthropic.com/claude-fable-and-mythos-5-2

## 发布内容

> We've upgraded Claude Fable and Claude Mythos—models that are designed to tackle the most daunting technical challenges.

> Claude Fable 5.2 and Claude Mythos 5.2 show improvements in areas like coding, reasoning, and vision.

> Claude Fable and Claude Mythos are the same underlying model. Fable has strong cybersecurity and biology safeguards to guard against misuse, which allows us to make it available to all users. Organizations pursuing beneficial applications in cybersecurity or biomedical research can apply for access to Mythos through our recently expanded Life Sciences and Cyber Verification Programs.

规格（官方文档页明示）：上下文 1M tokens，最大输出 128K tokens，输入 $8 / MTok、输出 $40 / MTok；fast mode 为 $16 / $80，知识截止 2026 年 6 月。

## 评测数据转录表：官方 DOM 对比表

整页唯一 `<table class="zKqBAG_table">`，逐格取自 `<span class="zKqBAG_value">` 与 `<span class="zKqBAG_qualifier">`，DOM 逐值可机读。表头 5 列：**Fable 5.2 | Fable 5.1 | Opus 5.5 | GPT-6 Astra | Gemini 4 Carbon**。以下转录**首列（Fable 5.2）**；同表其余列为竞品对照，只记入账本 notes，不另建 evidence 行。

| 类别 | 基准 | Fable 5.2 | 同格括注 |
|---|---|---:|---|
| Agentic coding | FrontierCode 2.0 | 49.1% | Xhigh effort |
| Agentic coding | FrontierSWE v2 | 69.9% | — |
| Business workflows | AutomationBench | 51.4% | — |
| Agentic scientific research | Terminal-Bench-Science 0.1 | 74.6% | 75.3% (Mythos 5.2) |
| Cybersecurity | CyScenarioBench | 76.3% | Mythos 5.2 |
| Cybersecurity | CVE Rediscovery | 89.6% | Mythos 5.2 |
| Protein design | De novo binder design (24 hr) | 85.1% | Mythos 5.2 |
| Agentic search | WANDR (relaxed score) | 82.1% | — |
| Computer use | OSWorld 2.1 (offline set, partial) | 89.3% | — |
| Robotics | RoboDojo Sim | 64.9% | — |
| Knowledge work | AA-Briefcase v1.1 | 66.1% | rubric |
| Knowledge work | Remote Labor Index (RLI) | 41.3% | High effort |
| Multidisciplinary reasoning | Humanity's Last Exam (with tools) | 74.2% | — |
| Visual chart recognition | Chartography (no tools) | 73.4% | — |

**AA-Briefcase v1.1 行的第二单位**：同表该行另印 Elo 值（Fable 5.2 = 1785 Elo，Fable 5.1 = 1669，Opus 5.5 = 1800，GPT-6 Astra = 1569，Gemini 4 Carbon = 1611）。本档 evidence 取 rubric 百分数，Elo 值只记 notes。

## 页面脚注（原文）

> For details on evaluation methodology, see the Claude Fable 5.2 and Mythos 5.2 System Card. Scores for Fable 5.2, Fable 5.1, and Opus 5.5 show results with safeguards on unless otherwise noted. All scores show each model's highest-available effort unless otherwise noted.

> † On CyScenarioBench, each lab's scores are based on unique tasks.

> ‡ RoboDojo Sim shows the highest-available effort and was run internally.

## 非评测内容（不入 evidence）

- 「They generate outputs up to 30% faster than Claude Fable 5.1 and Claude Mythos 5.1」——**相对提速描述**，非独立评测分。
- 「formalized the proof of Fermat's Last Theorem in 30 hours」等预发布测试轶事——非基准分。
- 文中 Accuracy-vs-Cost 类 SVG 图表逐点值未转录（图表非 DOM 文本行）。
