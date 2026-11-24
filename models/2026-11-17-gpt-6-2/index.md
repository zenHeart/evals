---
vendor: OpenAI
model: GPT-6.2 Astra / GPT-6.2 Sol
release: gpt-6-2-astra-sol
date: 2026-11-17
source: https://openai.com/index/introducing-gpt-6-2-astra-sol
fetched_at: 2026-11-24
---
# GPT-6.2 Astra and Sol



- 来源：<https://openai.com/index/introducing-gpt-6-2-astra-sol>

- 归档日期：2026-11-17（= 发布日期）

- 抓取日期：2026-11-24



## 发布要点



OpenAI 同日发布两个档位：**GPT-6.2 Astra**（frontier，面向最难项目）与 **GPT-6.2 Sol**（efficient，日常工作默认模型）。



## 可机读评测数值（HTML 正文/脚注内）



| 评测 | 模型 | 数值 | 口径 |

| --- | --- | --- | --- |

| AA-AnalystAgent | Astra | 62.5% | 五次独立尝试全部答对才算通过 |

| AA-3D | Astra | 1,318 Elo（第 1） | 人工评委 blinded pairwise |

| AA-3D | Sol | 1,259 Elo（第 3） | 同上 |

| internal 3D generation evals | Astra | 73% 一次成型 | 对照组 GPT-6 Astra 需 3+ 次迭代 |



同行同句印出的 Claude Fable 5.2 AA-3D 为 1,271 Elo（非本次发布模型，未入库）。



## 仅给相对差/定性结论的评测（value=null, pending）



| 评测 | 页面陈述 |

| --- | --- |

| Agents' Last Exam | new high；较 GPT-6 Astra +5.2 分且成本 <1/3；较 Claude Fable 5.2 +5.5 分且成本 5%（Fable 5.2 榜单剔除 9 个 fallback 任务） |

| Terminal-Bench-Science 0.1 | new high；较 GPT-6 Astra +9 个百分点且成本 <1/3 |

| Vals Science Index v1 | new high |

| FrontierCode 2.0 | Sol 距 Astra 0.5 分、成本约 1/5（both at max） |

| Harvey LAB-AA v1.1 | new SOTA；pass rate 超过 Claude Fable 5.2 两倍且成本约 1/6；Astra for Law 更高 |

| GDPval v2 | Astra 领先受测模型，较 GPT-6 Astra +6.2 个百分点且输出 token 少 22%；Sol 较 GPT-6.1 Sol +5.3 |

| LifeVal | Sol 以约 1/7 成本超过 GPT-6 Astra |



## 图表内数值（未读数）



Artificial Analysis Intelligence Index v5.0.1、BenchCAD 2.1、Core AutomationBench 1.0.6、DeepBinary ExploitBench Internal Port、SecureSWE PatchBench、Blocker deception、Improper actions。



## 安全与对齐



- 网络安全达 Preparedness Framework **Critical** 阈值（同 GPT-6 Astra）；生化达 **High**。

- 首个外部发布即达 **AI Self-improvement High** 阈值。

- improper actions 少于 GPT-6 Astra；但两项测试中更容易漏报阻碍工作的障碍（Codex 已加指令缓解）。



## 定价（每百万 tokens）



| 模型 | 输入 | 缓存输入 | 输出 |

| --- | --- | --- | --- |

| GPT-6.2 Astra | $8 | $0.40 | $40 |

| GPT-6.2 Sol | $2 | $0.10 | $10 |



Astra 较 GPT-6 Astra 输入/输出各低 20%，缓存输入折扣 60%；Sol 沿用 GPT-6.1 Sol 价格。
