---
vendor: google
model: Gemini 4 Argon
release: gemini-4-argon-ga
date: 2026-10-13
source: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/
fetched_at: 2026-10-20
---

# Gemini 4 Argon: Built to solve your hardest problems（Google，2026-10-13）

> 本归档含同一发布事件的三篇官方一级材料：
> `page.html` = 正式发布页（https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/）；
> `safety-post.html` = 同日安全与负责任开发说明（https://deepmind.google/blog/developing-gemini-4-argon-responsibly-and-safely/）；
> `robotics-post.html` = 同日机器人应用说明（https://deepmind.google/blog/gemini-4-argon-for-robotics/）。
> 发布日证据：发布页文章头部印刷日期行「Oct 13, 2026」，并由 Google DeepMind 官方博客 RSS 同条 pubDate 交叉确认。

## 发布要点（转录）

- Gemini 4 Argon 于 2026-10-13 **正式面向所有人开放**（此前 2026-09-30 的一篇官方文章为限量开放，仅向 Fairwind Program 的可信网络防御者提供）。
- 官方定位：「为最困难的问题而造」，覆盖复杂工程任务、关键业务与专业工作流转化、真实世界影响，以及负责任地开发 Argon。
- 上下文：官方称由 **1M 统一输入输出 token 上限**支撑模型长时间、高强度地解决复杂科学、编码与智能体问题，并引入新的 continuation 协议。
- 价格：开放期每百万输入 token $2、每百万输出 token $10（缓存输入按 95% 折扣）；**2026-11-30 开放期结束后**调整为每百万输入 $4、每百万输出 $20。
- 官方称 Argon 在 **Vals Index 排名第一**（Vals Index 衡量模型在金融、编码、法务、税务等关键经济部门的表现）。
- 同日另发两篇：《Developing Gemini 4 Argon responsibly and safely》与《Gemini 4 Argon for Robotics》。

## 评测数据（正文明文，逐行转录）

> 说明：本页评测数值全部以**正文散文明文**给出（页面无 DOM 评测表、无评测图表图片），故按契约记为 verified；同一句中出现的他模型结论只写在「备注」列，不拆成独立行。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Embodied Reasoning (ERQA) | 87% | 具身推理：理解并求解 3D 环境中的物理与空间问题；官方称仅用推理即超越所有其他前沿模型。同一数字在同日的机器人一文中复述为「Argon scores 87%」 |
| RareBench | 57% | 罕见病诊断辅助；官方口径为 Gamow Labs 基于真实临床与实验室数据自建的私有评测，非公开榜单读数 |
| LabBench（wet-lab reasoning） | 52.2% | 湿实验推理；同为 Gamow Labs 私有评测口径 |
| Gray Swan Indirect Prompt Injection (IPI) | 0.7% | 15 次自适应攻击下的攻击成功率，越低越好；官方称 Argon 在该基准上领先 |
| 外部生物安全越狱红队解锁率 | <1% | 官方只给上界（less than 1%），未给精确数值，账本记 value=null、score_status=not_extracted |
| 编码基准上的走捷径/作弊尝试率 | 2% | 「模型没有偷懒动机」的编码基准；官方称为近几代 Gemini 模型中的最好表现 |

## 不构成标准公开基准的量化结论（仅备查，不建 evidence 行）

- **Vals Index**：官方称 Argon 排名第一（排名而非分数）。
- 机器人内部真实评测：成功率 56% → 75%，完成时长 35s → 24s。
- 对抗性压测集合：违规次数减少近 2 倍。
- Google ADK 性能优化（Argon 驱动）：长会话内存准备时间减少 40%，冷导入提速 21%。
- Gemma 4 E2B 推理优化（Argon 驱动）：A100 上经 vLLM 端到端提速 2.85x，吞吐约 37,900 → 逾 108,000 token/s，token 一致性 100%、无质量下降。
- Antigravity：智能体代码提交量提升逾 35%，代码回滚减少近三分之一。

## 与既有条目的关系

- 既有 release `gemini-4-argon`（2026-09-30）记录的是**限量首发**：当时仅向 Fairwind Program 的可信网络防御者开放，面向开发者、企业与消费者的正式发布「即将进行」，收录 7 条 evidence（deepswe、automationbench、lvbench、cwe-bench、vals-index、vals-finance-agent、harvey-lab）。
- 本 release `gemini-4-argon-ga`（2026-10-13）记录的是**正式放开**：新增本文件的 6 条 evidence。
- 两条指向同一模型 `gemini-4-argon`。按账本契约「只追加、不改既有文件」，两者并存而不互相覆盖。

## 归档说明

- `page.html`、`safety-post.html`、`robotics-post.html` 均为官方页面原始存档。
- 本页无评测图表图片（正文数值已全部转录），故无 `images/` 子目录。
- 参数量官方未明示，账本记 null。
