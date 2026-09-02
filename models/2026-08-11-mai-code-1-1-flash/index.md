---
vendor: microsoft
model: MAI-Code-1.1-Flash
release: mai-code-1-1-flash
date: 2026-08-11
source: https://microsoft.ai/news/mai-code-1-1-flash
fetched_at: 2026-09-02
---

# MAI-Code-1.1-Flash: Better, faster, at a quarter of the cost

> 归档说明：本目录三件证据——`page.html`（官方发布文）、`model-card.pdf`（厂商署名 Model Card，6 页，绝对分数所在）、`images/`（页面关键图）。
> 发布文正文只有相对提升（vs 1.0），无任何绝对分数；全部绝对分数与竞品对照表在 `model-card.pdf` 第 5 页，且该 PDF 文本层机读干净（pypdf 逐行抽取无列粘连）。
> 页面自身图片（`images/`）均为站点装饰/相关故事缩略图，不含评测数值；相关故事缩略图 No2_1_1.webp 为图像生成能力宣传图，与本次发布无关。
> 未报告数值不转录；相对提升行标注"(相对值，基线 1.0)"。

## 评测数据（转录）

来源一：官方发布文（散文，均为相对 1.0 的提升幅度）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Terminal-Bench 2.1（GitHub Copilot CLI 场景） | +22% | (相对值，基线 1.0)；发布文原文 "a 22% improvement on Terminal-Bench 2.1 in GitHub Copilot CLI"；无绝对分数（CLI 场景绝对值未发布） |
| .NET 任务 | +15% | (相对值，基线 1.0)；无对应公开 benchmark 行 |
| Token 流速（GitHub Copilot 内） | +25% | (相对值，基线 1.0)；"tokens stream 25% faster" |
| 每任务 token 用量 | −25% | (相对值，基线 1.0)；"uses 25% fewer tokens to complete a task"；与 Model Card 的 tokens/task 绝对值方向一致（8.6K vs 10.8K） |
| 价格 | 1.0 的四分之一 | "one quarter of the price of 1.0"；GitHub changelog 口径为 "73% lower list price" |
| 代码存活率（code survival） | +4% | 生产环境内部指标，无基线定义、无绝对值 |
| 回访率（return visits） | +9% | 生产环境内部指标，无基线定义、无绝对值 |

来源二：Model Card 第 5 页 "Quality and performance evaluations"（绝对分数，同 harness 同设置；通过率单位 %，tokens 为每完成任务平均 token 数）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| SWE-Bench Verified | 72.6 | MAI-Code-1.1-Flash；tokens 8.6K |
| SWE-Bench Verified | 71.6 | MAI-Code-1-Flash（前代基线）；tokens 10.8K |
| SWE-Bench Verified | 69.8 | Haiku 4.5（竞品列，同 harness）；tokens 20.9K |
| SWE-Bench Verified | 69.2 | GPT 5.4 mini（竞品列，同 harness）；tokens 9.4K |
| Terminal Bench 2.1 | 62.9 | MAI-Code-1.1-Flash；tokens 17.0K |
| Terminal Bench 2.1 | 51.7 | MAI-Code-1-Flash（前代基线）；tokens 14.2K |
| Terminal Bench 2.1 | 49.4 | Haiku 4.5（竞品列，同 harness）；tokens 25.5K |
| Terminal Bench 2.1 | 60.7 | GPT 5.4 mini（竞品列，同 harness）；tokens 21.9K |

来源三：Model Card 第 5 页 "Enabling vision capabilities for coding tasks"（视觉建站，分组标注 "(internal)"，同 harness）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Text2WebApp（WebApp development, internal） | 74.1 | MAI-Code-1.1-Flash；tokens 17.1K |
| Text2WebApp | 11.5 | Haiku 4.5（竞品列）；tokens 60.0K |
| Text2WebApp | 58.3 | GPT 5.4 mini（竞品列）；tokens 36.4K |
| ScreenShot2WebApp（WebApp development, internal） | 42.1 | MAI-Code-1.1-Flash；tokens 10.5K |
| ScreenShot2WebApp | 10.0 | Haiku 4.5（竞品列）；tokens 33.9K |
| ScreenShot2WebApp | 39.3 | GPT 5.4 mini（竞品列）；tokens 26.6K |
| Vision2Web Level3（WebApp development, internal） | 11.5 | MAI-Code-1.1-Flash；tokens 15.1K |
| Vision2Web Level3 | 13.7 | Haiku 4.5（竞品列）；tokens 36.5K（该项 Haiku 高于本模型，按卡原样转录） |
| Vision2Web Level3 | 10.1 | GPT 5.4 mini（竞品列）；tokens 3.7K |

## 非评测内容转录

| 项目 | 值 | 来源 |
| --- | --- | --- |
| 定位 | "small, efficient, coding workhorse"，已投产 GitHub Copilot | 发布文散文 |
| 发布日期 | August 11, 2026（页面印刷日期） | 发布文页头 |
| 参数规模 | 138B 总参 / 5B 激活，稀疏 Mixture-of-Experts | Model Card 第 1 页 Model Summary |
| 输入/输出 | 输入 Text + Image（原生视觉），输出 Text | Model Card 第 1 页 |
| 上下文长度 | 256K tokens | Model Card 第 1 页 |
| 预训练截止 | December 2025 | Model Card Technical specs |
| 训练周期 | 2026-03 至 2026-08；自 MAI-Thinking-1 压缩后的 5B 激活 mid-training checkpoint 起训 | Model Card Training disclosure |
| RL 规模 | 超过 150,000 个智能体环境（卡）；发布文写作 "more than hundreds of thousands"，两处口径不一致，按卡为准并留档 | Model Card / 发布文 |
| mid2 阶段 | 约 200 万条合成智能体任务，两阶段由简到难 | Model Card |
| 定价（卡上） | "To be finalized"（未定稿） | Model Card Pricing 栏 |
| 定价（GitHub 列表价） | $0.20 input / $0.02 cached input / $1.20 output 每百万 tokens；类目 Lightweight | docs.github.com 模型定价页 |
| 订阅倍率 | annual GitHub Copilot 订阅 0.25× premium request multiplier | GitHub changelog |
| 列表价降幅 | 较 MAI-Code-1-Flash（$0.75/$0.075/$4.50）低 73% | GitHub changelog |
| 1.0 退役 | MAI-Code-1-Flash 于 2026-09-10 在 GitHub Copilot 全渠道弃用，建议迁移至 1.1 | GitHub changelog "Upcoming deprecation of MAI-Code-1-Flash"（2026-08-11） |
| 评测协议 | SWE-V 与 TB 2.1 在生产 GitHub Copilot 工作流所用的 VS Code-based 同一 harness 内端到端评测（含仓库上下文、工具调用与验证）；各对比模型同 harness 同设置；tokens/task 为每完成任务平均 token 数 | Model Card Benchmarking methodology |
| 部署面 | Copilot 全客户端（CLI、cloud agent、VS Code、Visual Studio、JetBrains、Xcode 等）；CLI 在卡上标 "planned for a later rollout"，changelog 已列入 picker 清单（滚动上线） | Model Card / changelog |
| 安全评估 | CyberBench、CyberSecEval、SecRepo（卡上仅点名，无分数） | Model Card Safety evaluations |
| Raptor Mini 替代指向 | GitHub 2026-08-31 弃用公告中 Raptor Mini 的建议替代即本模型（轻量档定位旁证） | GitHub changelog "Selected GitHub Copilot models deprecated" |

## 媒体日期差异留档

部分中文媒体以 2026-08-12 报道本次发布（转载时区差异）；官方三源（发布文页头、Model Card Release date 字段、GitHub changelog 条目）一致为 2026-08-11。
