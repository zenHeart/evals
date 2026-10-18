---
vendor: meta
model: Muse Wonder / Muse Wonder Full
release: muse-wonder
date: 2026-10-12
source: https://research.meta.ai/blog/muse-wonder
fetched_at: 2026-10-18
---

# Muse Wonder: A Frontier Model For Personal & Professional AI Agents

发布日期来自官方页面正文印刷日「October 12, 2026」，并与页面 JSON-LD `datePublished: 2026-10-12` 一致。

Meta 发布 Muse Wonder 系列，包含 **Muse Wonder** 与 **Muse Wonder Full** 两个模型，定位为个人与专业智能体任务的前沿能力，由 **Active Memory**（跨会话携带个人上下文并主动检索相关信息）与 **Active Focus**（围绕困难目标持续推进、尝试替代方案、越过阻塞并在新信息下调整，必要时主动澄清）两项机制组合而成。训练在 Meta 自建的 gigawatt 级 Prometheus 数据中心完成。

官方明示规格：

| 项 | 值 |
|---|---|
| 参数规模 | 页面正文未明示（未披露） |
| 上下文长度 | 页面正文未明示（未披露） |
| 获取方式 | Muse Wonder 经 Meta Model API 与 Muse Code 今日可用；Muse Wonder Full 面向 Muse Code 订阅者 |
| 未来方向 | 将支撑 Muse 内的体验，先向订阅者推出；并用于 artifact 生成与需要更高智能的过程 |

评测部分：官方称在个人/专业智能体、记忆与编码的关键基准上取得 SOTA，并与其它前沿模型做了完整评测对比，正文点名 **Harvey's Legal Agent Benchmark (LAB)**、**FocusBench** 与 **SWE-Marathon** 三项基准。但**完整结果以图表/表格图片呈现，正文未印离散数字**，依契约保持 pending 证据档，视觉读数未转录。另有一张 in-distribution / out-of-distribution 散点图用于说明「benchmark 外泛化能力」，同样为图表。

| 评测 | 分数 | 备注 |
|---|---|---|
| legal-agent-benchmark | — | Harvey's Legal Agent Benchmark (LAB)；页面为图表，未印离散数字（视觉转写） |
| focusbench | — | 用于评估 Active Focus；页面为图表，未印离散数字（视觉转写） |
| swe-marathon | — | 用于评估持续执行（长时程软件项目）；页面为图表，未印离散数字（视觉转写） |

页面另有定性表述（原样转录，不作数值证据）：官方比较 Muse Spark 1.3 与 Muse Wonder Full 的 in-distribution / out-of-distribution 表现，称二者随 test-time compute 扩展在未见任务上提升相近，但 Muse Wonder Full 因建立在更强的基础模型上，在陌生任务上的表现高于 Muse Spark 1.3 趋势所预期的水平。详细评测方法另见官方报告链接（页面未给出可直读的数值表）。
