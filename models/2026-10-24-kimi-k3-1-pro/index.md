---
vendor: kimi
model: Kimi K3.1 Pro
release: kimi-k3-1-pro
date: 2026-10-24
source: https://www.kimi.com/en/blog/kimi-k3-1-pro
fetched_at: 2026-10-23
---

# Kimi K3.1 Pro

发布日期证据：官方博客列表页 https://www.kimi.com/en/blog/ 收录本文的日期为 2026-10-24；官方页 JSON-LD 的 `dateModified` 同为 2026-10-24；页面配图资源路径含 `/kimi-k3-1/20261023/`（图片构建日）。来源：https://www.kimi.com/en/blog/kimi-k3-1-pro

Kimi 发布 **Kimi K3.1 Pro**——K3.1 系列首个模型，也是其迄今能力最强的 3T 级开源权重模型，1 百万 token 上下文。官方称其在编码、3D 创作、金融研究与智能体能力上均有大幅提升；官方说明 K3.1 Pro 是在 Kimi K3 基础上用大规模联合 RL 后训练得到，并针对数百个下游领域优化了 RL 框架、长上下文推理、训练效率与沙箱基础设施。

官方明示规格：

| 项 | 值 |
|---|---|
| 参数量级 | 3T-class（官方原文） |
| 上下文窗口 | 1M tokens（1-million-token context window） |
| 同系列版本 | Kimi K3.1 Pro Highspeed（官方称速度为标准版的 2–3 倍） |
| 上线范围 | Kimi.com / Kimi 移动端 / Kimi Work / Kimi Code / Kimi API（API 模型名 `kimi-k3.1-pro`、`kimi-k3.1-pro-highspeed`） |
| 权重发布 | 官方声明完整模型权重将于 2026-11-04 前发布（归档时尚无官方权重仓） |
| 企业侧 | Kimi Enterprise 管理员可为其组织启用，默认关闭 |

正文（服务端渲染，DOM 机读）明确给出的评测数值：

| 评测 | 模型 | 数值 | 同段竞品 |
|---|---|---:|---|
| Terminal-Bench 4.0 | Kimi K3.1 Pro | 65.7% | GPT-6 Astra 58.2%；Claude Opus 5.5 66.4% |
| Kimi Code Bench 3.0 Long-horizon | Kimi K3.1 Pro | 61.2% | 前代 K3 55.95% |
| BenchCAD（with tools） | Kimi K3.1 Pro | 92.7% | Claude Opus 5.5 96.2%；GPT-6 Astra 95.9% |
| Kimi Hallu Bench Hard（claim 级幻觉率） | Kimi K3.1 Pro | 8.3% | 前代 K3 23.4% |
| xdev-bench-hard（pass@3） | Kimi K3.1 Pro | 81.0% | 未做风险削减的同管线检查点 90.5% |
| OfficeQA Pro v2 | Kimi K3.1 Pro | 64.4 | 官方称当前最优 |

其余评测以图片表格给出，本批未做视觉转写，逐项数值待人工读图确认后补录：

| 分组 | 具名评测（官方脚注口径） |
|---|---|
| Coding benchmarks | Terminal-Bench Science 0.1、DeepSWE v1.1、SWE-Marathon v1.1、PostTrainBench、ProgramBench（binary score）、Kimi Code Bench 2.0 |
| Agentic benchmarks | BioMysteryBench、Our Agents' Last Exam、Frontier Finance、HANDBOOK.md、Harvey Legal Agent、OSWorld V2.1、DECK-Arena、Design Bench、MCP Atlas、BrowseComp、GDPval-AA v2.1、AA-Briefcase v1.1、AutomationBench-AA |
| Reasoning & Knowledge & Multimodal | GDP.pdf、ZeroBench、ChartoGraphy、HLE、HLE-Diamond、MMMU-Pro、Kimi Hallucination Benchmark |
| Cybersecurity benchmarks | ExploitBench、ExploitGym |

协议口径（官方总脚注）：除非另有说明，全部结果取 reasoning effort = `max`、temperature = 1.0、top-p = 0.95；逐项脚注另注明 harness（多数为 Claude-Code harness，OSWorld 用 Kimi Agent harness，ExploitGym 用 KimiCode harness，MCP Atlas 以 Gemini 3.1 Pro 担任评委，BrowseComp 最多 500 步、200K token 触发上下文压缩等）。

未转录说明：官方评测总览与各分表均为图片（`images/kimi-figure-*.webp`），本归档只下载留档、不做视觉转写；正文明确写出数值之外的描述性结论（如「相较 K3 提升 7.2 分」「约 4.2 倍」）是相对差值而非绝对分值，不单独建行。
