---
vendor: particle
model: Particle-1
release: particle-1
date: 2026-10-28
source: https://particle.ai/blog/introducing-particle-1
fetched_at: 2026-10-30
---

# Particle-1（Particle AI 官方发布文证据归档）

发布日期证据链：正文标题下署名行为 `Particle team · <time datetime="2026-10-28">Oct 28, 2026</time>`，**机器可读的 `datetime` 属性与印刷日同值**，`date_precision=day`。

页面为 Webflow CMS 渲染，**没有** JSON-LD `datePublished` / `dateModified`，也没有 `<meta property="article:published_time">`；HTML 头部注释里的 `Last Published: Thu Oct 29 2026 23:32:01 GMT+0000` 是**站点整体发布时刻**（比发布文晚一天，属站点重新发布），不是本发布的发布日期，不作日期证据。

页面地址：Particle AI 官方博客 `https://particle.ai/blog/introducing-particle-1`（由官网首页 `https://particle.ai/` 导航链入）；官方文档 `https://docs.particle.ai/models`（模型目录，含上下文长度、输出上限、模态与当前定价）与 `https://docs.particle.ai/usage-billing`（当前计价表）。该博客栏目当前仅此一篇文章。

## 官方定位（原文要点）

- 标题：*Introducing Particle-1*。
- 定位：Particle AI 自研前沿模型 **Particle-1**，在 **DeepSeek V4.1 Flash** 基础上做后训练（post-trained），目标是**用更少的 token 解决同样的问题**，官方称平均**少用约 45% 的 token**、且任务完成更快。
- 训练方式：在**自研强化学习环境**中训练，用 reward function 激励模型「更少 token 解决任务」；后训练分阶段推进，采用 **Cascade RL** 思路；推理侧用 **Group Sequence Policy Optimization（GSPO）** 做策略更新（按整条序列做重要性加权与裁剪，不按 token 归一化优势）；基础设施基于开源 RL 框架 **Miles**（RadixArk）与 **SGLang / Megatron**，做了吞吐优化。
- 训练增量形式：**rank-64 LoRA 适配器**（覆盖各层专家），可训练参数量约当基座模型参数量的 **1.25%**。
- **首个版本聚焦软件工程**（software engineering），官方称后续会扩展到其他领域。
- 官方明说泛化方向：训练虽聚焦编码与数据工程，但在**法律**与**网络安全**上也看到早期泛化迹象。
- 官方明说能力边界：这批优化目标是 token 效率，**精度与基座基本持平**（"accuracy stays close to base DeepSeek V4.1 Flash"），不是刷分型发布。

## 评测数值转录

### 一、四个软件工程基准（官方对比 widget，DOM 机读）

页面正文有一个可切换基准的对比组件（默认展开 **DeepSWE 1.1**），每个基准给出三款模型的**每次任务成本（USD）**、**平均输出 tokens**、**任务通过率**。取值来自页面内嵌的结构化数据载荷（`data.benchmarks[].cohorts.all.results[]`），每个数据点的 `aria-label` 直接写明「模型名, 数值」，**逐行 DOM 可机读**；页面散文里的区间声明与该载荷**逐条精确吻合**（见下方交叉校验）。

**Particle-1 自家列（本 release 建 evidence 行的取值）**

| 基准 | 任务通过率 | 每次任务成本 | 平均输出 tokens | 通过/总尝试数 |
|---|---|---|---|---|
| DeepSWE 1.1 | **72.57%** | $0.2211 | 59,580 | 1304 / 1797 |
| Terminal-Bench 2.1 | **79.93%** | $0.0489 | 24,594 | 1099 / 1375 |
| ReactBench | **31.46%** | $0.0947 | 41,314 | 196 / 623 |
| ADE Bench | **64.45%** | $0.0162 | 9,645 | 495 / 768 |

**同协议对照列（竞品，按口径只写进 notes、不建行）**

| 基准 | 模型 | 任务通过率 | 每次任务成本 | 平均输出 tokens | 通过/总尝试数 |
|---|---|---|---|---|---|
| DeepSWE 1.1 | DeepSeek V4.1 Flash（基座） | 71.15% | $0.3368（1.5×） | 83,246（1.4×） | 1275 / 1792 |
| DeepSWE 1.1 | GLM 5.3 Flash | 66.82% | $0.6523（3.0×） | 98,155（1.6×） | 1174 / 1757 |
| Terminal-Bench 2.1 | DeepSeek V4.1 Flash | 81.87% | $0.0765 | 38,755 | 1111 / 1357 |
| Terminal-Bench 2.1 | GLM 5.3 Flash | 79.06%（不含 fastText 任务） | $0.1552 | 65,980 | 1106 / 1399 |
| ReactBench | DeepSeek V4.1 Flash | 33.65% | $0.1805 | 75,152 | 210 / 624 |
| ReactBench | GLM 5.3 Flash | 32.26% | $0.3976 | 147,295 | 201 / 623 |
| ADE Bench | DeepSeek V4.1 Flash | 67.97% | $0.0335 | 20,174 | 522 / 768 |
| ADE Bench | GLM 5.3 Flash | 67.71% | $0.0282 | 21,581 | 520 / 768 |

**交叉校验（散文 vs 载荷，逐条精确吻合）**

| 正文原话 | 由载荷复算 | 结论 |
|---|---|---|
| "uses 28.4%–52.2% fewer output tokens" | DeepSWE 1.1：1 − 59,580/83,246 = **28.40%**；ADE Bench：1 − 9,645/20,174 = **52.19%** | 两端吻合 |
| "34.4%–51.6% lower average cost per task" | DeepSWE 1.1：1 − 0.2211/0.3368 = **34.35%**；ADE Bench：1 − 0.0162/0.0335 = **51.64%** | 两端吻合 |
| "Pass@1 rates are within the confidence intervals of the base model" | 四个基准的 Particle-1 通过率与基座差值均在 ±2.2 个百分点内（Terminal-Bench 2.1 为 −1.94pp，ADE Bench 为 −3.52pp） | 方向一致 |
| "28.4%–52.2% fewer output tokens"覆盖到 ReactBench | ReactBench：1 − 41,314/75,152 = **45.03%**；Terminal-Bench 2.1：1 − 24,594/38,755 = **36.53%** | 均落在区间内 |

**基准说明（官方原文）**：Terminal-Bench 2.1 测终端工作流（编译软件、调试代码、配置系统）；ReactBench 测 Agent 构建与修复 React 应用（功能、性能、可访问性）；ADE Bench 用**真实 dbt 项目与数据库**测分析与数据工程任务；DeepSWE 1.1 测需要理解代码库、实现改动并验证方案的较长软件工程任务。

### 二、四个通用基准（正文散文明文分值）

> "On general benchmarks outside our training domains, Particle-1's accuracy stays close to base DeepSeek V4.1 Flash: GPQA Diamond 90.40% (base 90.91%), Tau Airlines 86.00% (base 88.00%), Standard MMLU 86.08% (base 85.98%), and BabyVision with tools 89.18% (base 89.60%)."

| 基准 | Particle-1 | 基座 DeepSeek V4.1 Flash | 差值 |
|---|---|---|---|
| GPQA Diamond | **90.40%** | 90.91% | −0.51 pp |
| Tau Airlines | **86.00%** | 88.00% | −2.00 pp |
| Standard MMLU | **86.08%** | 85.98% | +0.10 pp |
| BabyVision（with tools） | **89.18%** | 89.60% | −0.42 pp |

### 三、评测协议（官方脚注明示）

| 项 | 官方明示值 |
|---|---|
| Agent 脚手架 | **Terminus 2**（Harbor 框架实现，官方给了源码链接） |
| 上下文/预算上限 | **512k-token limit**（原文未区分单次调用与总量） |
| 温度 | **1** |
| top_p | **0.95** |
| 推理档 | **max reasoning** |
| 任务集例外 | Terminal-Bench 2.1 **排除 fastText 任务**；GLM 5.3 Flash 的该基准结果带 `evaluationNote: "without fastText"` |
| 跑次数 | 每任务 **16 次 rollout**（含成功与失败） |
| 成本口径 | 对**所有尝试**（含失败）取平均，固定 **95% 缓存命中率**；混合输入价 $0.0207/百万 tokens（Particle-1 与 DeepSeek）、$0.0360（GLM） |
| tokens 口径 | 平均 assistant 生成 token 数，覆盖全部有效 rollout；**因基础设施故障中断的 rollout 剔除** |
| 基座来源 | 页面数据载荷标注基座 DeepSeek V4.1 Flash 的提供方为 **OpenRouter** |

### 四、规格与定价（官方文档 docs.particle.ai）

| 项 | 值 | 来源 |
|---|---|---|
| 上下文窗口 | **1,048,576 tokens**（prompt + completion 合计） | 文档「Model catalog」 |
| 默认输出上限 | 32,000 tokens（显式指定以其为准） | 同上 |
| 输出天花板 | 显式上限超过 131,072 tokens 会被截到 131,072 | 同上 |
| 模态 | 文本与图像输入 → 文本输出 | 同上 |
| 推理 | 默认 effort **high**，可用 `reasoning_effort` 调档（`max` → Max effort） | 文档「Reasoning controls」 |
| 工具调用 | 「Qualified」——支持 OpenAI tools / tool_choice | 文档「Model catalog」 |
| 发布时定价 | 未缓存输入 **$0.30** / 缓存输入 **$0.006** / 输出 **$1.20** 每百万 tokens | 发布文脚注 b |
| 当前定价（文档） | 输入 **$0.25** / 缓存输入 **$0.03** / 输出 **$1.00** 每百万 tokens；离峰时段再折半；`flex` 服务档再打五折 | 文档「Usage & billing」 |
| 公共模型 ID | `particle-ai/particle-1`（请求别名 `particle-1`） | 文档「Model catalog」 |

> 定价两处不一致（发布文脚注 $0.30/$0.006/$1.20 vs 文档当前 $0.25/$0.03/$1.00）**不调和**：两者按各自出处分别记录，账本 `pricing` 取**发布文**（发布时明示值），文档当前值写进 notes 与 release 级说明。

## 未转录说明与口径边界

1. **成本与 token 数不单独建 evidence 行**：成本不是基准分，token 数也不是基准分；按「每个 benchmark 行 = 一条 evidence，取自家模型列」的规则，八个基准**各建一行**，取**任务通过率/基准分**为 `reported_score`，成本与 token 数写进该行 `notes`（含竞品同协议对照值）。
2. **竞品列不建 comparison_cited 行**：DeepSeek V4.1 Flash 与 GLM 5.3 Flash 的数值全部写进 Particle-1 所在行的 `notes`；这两款模型另有自己的发布档案，不在本 release 重复建行。
3. **页面内嵌数据载荷自带内部状态标记，已原样记入 notes**：该 widget 的数据载荷顶层带 `status: "draft_with_mock_values"`、`costBasis: "cohort_dependent"`；每个数据点的 `meanAssistantTokensSource` / `accuracySource` 标为 `user-supplied-simulated`、`costSource` 标为 `user-supplied`，DeepSWE 1.1 的 `medianTokenReductionSource` 标为 `mock`（另三个基准的中位 token 降幅无来源标记）。**页面正文与可见文案完全没有暴露这些标记**（全文检索 `simulat` / `mock` / `estimate` / `draft` 均无命中）。判断依据是：这些标记**只影响载荷内部的派生字段**——其中被明确标 `mock` 的中位 token 降幅在页面上根本不展示；而页面展示的成本、token、通过率三项，与正文散文的区间声明**逐条精确吻合**（见上表），据此判定展示值即为该页公开结论，按 DOM 机读口径录入。标记内容原样抄进 notes 以备复核，不做改写、不做推测性解释。
4. **中位 token 降幅不录入**：该字段被载荷标为 `mock`（DeepSWE 1.1）或无来源标记（其余三个），且页面从未展示，按「读不到就是 null，宁可留 pending」不建行、不转录数值。
5. **示例 rollout 不建行**：正文给出 12 个逐任务示例（Git 部署、pMARS 编译、日程安排、cattrs 恢复、Awilix 启动、go-git 合并冲突、CoreUI 导航、递归删除、表行选择、Review 主键、字符串产品 ID、F1 圈速模型），各自带「更少输出 token」百分比与两方 token 数——它们是**单个任务上的轨迹展示**，不是基准级结论，全部转录在本归档中供复核，不进账本。
6. **Harvey LAB 法律任务不建行**：正文用**一个**合同审查任务（8 次 rollout）展示泛化（Particle-1 准确率 100%、基座 62.5%、少 24.6% 输出 token），并附 LoRA 强度 0.25×~8× 消融。**单任务演示**不构成基准级证据，只写进归档与 notes。
7. **GLM 5.3 Flash 的 Terminal-Bench 2.1 结果有例外**：数据载荷标 `evaluationNote: "without fastText"`，与脚注 a「Terminal-Bench 2.1 excludes the fastText task」一致——该基座列与另两个模型**不同任务集**，横向比较时须注意。
8. **「Tau Airlines」的 τ 版本未标明**：正文只写 "Tau Airlines"，未标注 τ¹ / τ²。账本按既有惯例归到 `tau-bench`（τ-bench）的 `airline` 域，并在 notes 记明该版本歧义。
9. **「Standard MMLU」与既有 MMLU 变体并存**：账本里已有 MMLU-Pro / MMLU-Redux / MMLU-ProX 等同族基准，本行按正文原名取 `mmlu` + 变体 `Standard`，不与 MMLU-Pro 混同。
10. **参数量记 null**：官方只说明「在 DeepSeek V4.1 Flash 上做后训练、LoRA 适配器可训练参数约当基座参数量的 1.25%」，**未给出本模型的绝对参数量**，故 `params` 记 null，不从基座规模反推。
11. **两个官方数字来源的差异如实记录**：定价（发布文 vs 当前文档）两处不一致，各自出处分别保留；模型上下文（发布文脚注的「512k-token limit」是**评测时**的预算，文档的 1,048,576 是**模型**上下文窗口）两者含义不同，分别记入 `protocol.token_budget` 与 `models[].context_window`，不混为一谈。
