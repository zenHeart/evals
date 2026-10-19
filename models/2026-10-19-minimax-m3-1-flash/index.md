---
vendor: minimax
model: MiniMax M3.1 Flash
release: minimax-m3-1-flash
date: 2026-10-19
source: https://www.minimax.io/blog/minimax-m31f
fetched_at: 2026-10-19
---

# MiniMax M3.1 Flash: Redefining Agent Performance and Cost

## 发布要点（转录）

- MiniMax 官方宣布 M3.1 Flash 正式上线，是面向 agentic 任务的下一代 Flash 模型：在复杂 agent 任务、编码、Computer Use 与网络安全上均有代际提升，线上推理速度接近三倍提升，使用成本降低 70%。
- Space Bunny（匿名运行期间累计处理超过 200 万亿 token）即 M3.1 Flash 的早期版本。
- 推理效率通过更激进的稀疏化优化：日常使用输出速度可达 200+ TPS，P50 稳定在 170+ TPS。
- 定价（每 1M token 单一价，不区分输入/输出/缓存以外档位）：输入 $0.15、输出 $0.60、缓存输入 $0.015；agentic 任务整体使用成本较前代低 70%。
- 已可通过 MiniMax API、M Plan 与 MiniMax Code 使用；官方称模型权重稍后开放（"Model weights will be released later"）。更强的 Pro 版本也将稍后到来。
- 官方未披露参数量、上下文长度与模态范围，故账本记 null。

## 评测数据（DOM 明文，可直接机读）

> 说明：本节数值取自发布页正文散文的 DOM 文本，可精确定位，账本按 verified 记。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| BankerToolBench | 76.2 | 官方原句 "Scoring 76.2 on BankerToolBench"；未标百分号，按原始数值记 |
| DeepSWE v1.1 | 73.7% | 官方原句 "It achieves 73.7% on DeepSWE v1.1" |
| OSWorld V2 | 61.7 points | 官方原句 "It scores 61.7 points on OSWorld V2" |
| Agents' Last Exam (ALE) | 29.6 points | 官方原句 "29.6 points on Agents' Last Exam (ALE)"；官方称在两项上均居中国模型首位 |
| CyberGym | 82% | 官方原句 "It achieves a strong score of 82% on CyberGym" |
| AutomationBench-AA | 未给数值 | 官方原句 "M3.1 Flash ranks among the top performers on AutomationBench-AA"；只点名与定性描述，无分数 |

## 评测数据（视觉转写，待人工确认）

> 说明：以下数值来自公告页内嵌评测总表图片 `images/m31-flash-en-2.webp`（15 行基准 × 8 模型列 + 逐项协议脚注），非页面 DOM 明文，按图行规则一律记 pending，读图确认后方可翻转 verified。

### 自家列（MiniMax M3.1 Flash）视觉转写

| 分组 | 评测 | 视觉转写值 | 官方脚注（协议） |
| --- | --- | --- | --- |
| CoWork | Automation-Bench v1.0.6 | 62.8 | 600 道公开任务（zapier/AutomationBench） |
| CoWork | BankerToolBench | 76.2 | OpenCode 1.17.18 harness，judge 模型为 MiniMax-M2.7 |
| CoWork | GDP.pdf AA | 20.8 | 结果直接取自 Artificial Analysis |
| CoWork | Terminal Bench 4.0 | 38.1 | Codex 0.149.1 harness |
| CoWork | LOCA-Bench 256K | 60.3 | 官方实现（hkust-nlp/LOCA-bench） |
| Computer Use | Agents' Last Exam | 29.6 | 官方 Overall 设置；只收录 ALE 官方排行榜公开的全量结果 |
| Computer Use | OSWorld 2.0 | 61.7 | 官方推荐 0808 Full release |
| Coding | PostTrain Bench v1.1 | 39.3 | Claude Code 2.1.251 harness，最大上下文 512K |
| Coding | DeepSWE v1.1 | 73.7 | mini-SWE-agent 2.4.5 harness，最大上下文 512K |
| Coding | NL2Repo-Bench | 61.2 | Claude Code 2.1.233 harness，最大上下文 512K |
| Coding | SWE Refactor Bench | 23.0 | Claude Code 2.1.220 harness，最大上下文 200K |
| Cyber | CyberGym | 82.2 | Claude Code 2.1.263 harness，最大上下文 1M |
| General Capabilities | BabyVision (w/tools) | 91.0 | Claude Code 2.1.285，最短图片边长 1,500 像素 |
| General Capabilities | HLE (w/o tools) | 43.4 | 限制在 2,158 道纯文本提示子集 |
| General Capabilities | CharXiv RQ | 82.5 | judge 模型为 GPT-5.5 |

### 同表竞品列（视觉转写，仅作对照，不拆成独立账本行）

| 评测 | DeepSeek-V4.1-Flash-1017 | DeepSeek-V4.1-Flash | Kimi-K3 | GLM-5.3 | GPT-5.6 Sol | Opus 5 |
| --- | --- | --- | --- | --- | --- | --- |
| Automation-Bench v1.0.6 | 60.5 | 54.8 | 46.7 | 48.8 | 45.8 | 50.3 |
| BankerToolBench | - | 73.7 | 69.1 | 74.5 | 74.6 | 76.2 |
| GDP.pdf AA | - | 12.8 | 22.0 | 11.2 | 27.2 | 21.6 |
| Terminal Bench 4.0 | 42.3 | 31.2 | 12.6 | 37.9 | 39.9 | 51.8 |
| LOCA-Bench 256K | - | - | 49.7 | 50.3 | 60.0 | 53.7 |
| Agents' Last Exam | - | - | 28.3 | - | 30.6 | 32.2 |
| OSWorld 2.0 | - | 54.3 | 58.3 | - | 65.7 | 70.6 |
| PostTrain Bench v1.1 | - | 30.5 | 36.6 | 37.5 | 36.2 | 40.4 |
| DeepSWE v1.1 | 77.0 | 74.2 | 67.5 | 66.9 | 73.0 | 74.0 |
| NL2Repo-Bench | 68.2 | 65.4 | 58.0 | 58.0 | 56.8 | 75.3 |
| SWE Refactor Bench | - | 11.8 | 19.5 | 10.4 | 28.5 | 31.0 |
| CyberGym | - | - | 80.0 | 84.5 | 83.6 | - |
| BabyVision (w/tools) | 92.5 | 89.6 | 85.7 | - | 88.9 | 94.1 |
| HLE (w/o tools) | 44.0 | 39.2 | 43.5 | 42.3 | 49.5 | 55.6 |
| CharXiv RQ | - | 69.0 | 84.8 | - | 85.2 | 83.7 |

> 原文 `-` 表示该模型未上榜/未公布，不转录为 0。

## 图表与素材

- `images/m31-flash-en-2.webp` — 官方评测总表（15 行基准 × 8 模型列 + 逐项协议脚注），本节视觉转写来源
- `images/m31-flash-en-3.png` — Agents' Last Exam 通过率 vs 预估总成本散点图（自家 max 29.6%，约 $111；脚注：ALE-V1 Overall、152 题，数据截至 2026-10-18，自家跑在 Claude Code / max effort）
- `images/m31-flash-en-4.png` — DeepSWE v1.1 分数 vs 每任务成本散点图（自家 max 73.7%、xhigh 72.1%、high 68.1%；脚注：DeepSWE v1.1 排行榜数据截至 2026-09-22，harness 为 mini-swe-agent，汇率 1 USD = 6.6862 CNY）
- `images/m31-flash-en-5.png` — Automation-Bench 分数 vs 每任务成本散点图（自家 max 62.8%、xhigh 61.2%、high 59.2%、medium 57.7%、low 52.8%；脚注：Automation-Bench v1.0.6，harness 为 Claude Code，数据截至 2026-10-18）

## 规格与定价（官方明示）

| 项 | 值 |
| --- | --- |
| 输入价（每 1M token） | $0.15 |
| 输出价（每 1M token） | $0.60 |
| 缓存输入价（每 1M token） | $0.015 |
| 输出速度 | 200+ TPS，P50 170+ TPS |
| 参数量 | 未披露（null） |
| 上下文长度 | 未披露（null） |
| 权重 | 官方称稍后开放 |
