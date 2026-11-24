---
vendor: OpenAI + Cisco
model: Shirudo（非模型发布，开源 Linux 运行时）
release: (不入账本)
date: 2026-11-23
source: https://openai.com/index/introducing-shirudo/
fetched_at: 2026-11-24
---

# Shirudo — 范围外登记（开源 Linux 运行时，非模型发布）

## 判定结论

本页**不产生任何 `data/model-releases/` 记录**。Shirudo 是 OpenAI 与 Cisco 联合开源的 **Linux 运行时**（eBPF shields），属于基础设施/安全工具，不是模型、不是模型权重、也不是模型能力发布，按 ingest 技能的收录范围排除。

保留本目录与 `page.html` 的理由：该页确实由本仓的增量扫描在 2026-11-23 窗口内命中并抓取，直接删除会丢掉「扫到过、判定过、为什么不要」这段证据；后续任何一次重扫都会再次命中同一 URL，没有这份登记就得重新推导一遍结论。

## 页面自证（原文照录）

- 页面标题：`OpenAI and Cisco introduce Shirudo | OpenAI`
- `og:description`：`OpenAI and Cisco introduce Shirudo, an open-source runtime for Linux. It helps teams protect running systems while they roll out patches.`
- canonical：<https://openai.com/index/introducing-shirudo/>
- 副标题：`An open-source runtime that helps operators protect running Linux systems without needing to wait for the patch or restarts`
- 定义句：`Shirudo (Japanese for "shield") is designed to help security teams navigate this tradeoff. Teams can test whether a temporary safeguard, called a shield, blocks the behavior that exposes a vulnerability while allowing legitimate requests through.`
- 技术底座：`Shirudo uses eBPF, a Linux technology that allows small programs to run at specific points inside the operating system.`
- 许可：`Shirudo is licensed under BSD 2-Clause, with its BPF programs dual-licensed under BSD and GPL.`
- 四项核心能力：`Live protection` / `Defense at machine speed` / `Trusted deployment` / `Hardware-backed verification`

页面通篇没有任何模型名称、参数量、上下文窗口、定价或评测分数；唯一涉及模型的句子是受控测试的说明——`a Codex-generated shield blocked a Java4Shell exploit attempt against a running Elasticsearch service without requiring a restart`——即模型是被用来**生成 shield** 的工具，Shirudo 本身不是被发布的模型。

## 为什么不是模型发布

| 判定项 | 页面事实 |
| --- | --- |
| 是否发布模型权重 | 否。开源的是 eBPF 运行时与 shield 程序（BSD 2-Clause / BSD+GPL），不是模型权重 |
| 是否公布模型规格 | 否。无参数量、无上下文窗口、无模态、无定价 |
| 是否公布评测读数 | 否。只有一次受控测试的定性描述（挡住 Java4Shell 利用尝试、Elasticsearch 未重启），没有题集、协议或分数 |
| 发布物形态 | 基础设施安全工具（运行时 + 签名/验证 + TPM  attestation） |
| 归属账本章节 | 均不适用——仓内 `data/model-releases/` 只收模型发布 |

## 时间线

- 页面可见日期：November 23, 2026（`og:url`/canonical 为 <https://openai.com/index/introducing-shirudo/>）
- 抓取日期：2026-11-24
- 页内提到的后续活动：`December 15 webinar`、Linux Plumbers Conference 的 `Shirudo technical walkthrough`

## 限制

- 本登记只做范围判定与原文留证，不对 Shirudo 的技术主张做真实性核验；页面自述的受控测试结果未经第三方复现。
- `images/` 为空：本页配图为架构示意图，不含可机读评测数值。
- 若后续 Shirudo 页面开始公布模型规格或评测分数（例如把所用模型作为可调用端点发布），需按 ingest 技能重新判定并单独建 release，不要修改本登记来兼容。
