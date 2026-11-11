---
vendor: google
model: Gemini 4 Carbon
release: gemini-4-carbon-ga
date: 2026-11-10
source: https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/
fetched_at: 2026-11-10
---

# Gemini 4 Carbon is now available（Google，2026-11-10）

> 发布日证据链（四源互证）：发布页文章头部印刷日期行「Nov 10, 2026」；页面 JSON-LD `datePublished = 2026-11-10T16:00:00+00:00`；`article:published_time` meta = 2026-11-10；Google DeepMind 官方博客 RSS（<https://deepmind.google/blog/rss.xml>）同条 `pubDate = Tue, 10 Nov 2026 16:03:47 +0000`。
> 规范地址：<https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/>（页面 `og:url`、`rel=canonical` 与 JSON-LD `mainEntityOfPage` 三者一致）。deepmind.google/blog/gemini-4-carbon-is-now-available/ 会 302 跳到该规范页且返回字节完全一致（sha256 `c2da7cee2c19432f7361b111d20f7b304af30533841be76340a3b07a54096855`），故只归档一份 HTML。
> 页面协议信息：除正文散文明文外，本页没有 DOM 评测表；协议细节（脚手架、采样、运行次数、判定方式）一概未明示，账本 12 个 protocol 键一律留 null。

## 发布要点（中文转述，官方原文保留）

- **面向谁开放**——原文：「Today, we’re making Gemini 4 Carbon available to developers, enterprises, scientists, and consumers.」
  中文：2026-11-10 起，Gemini 4 Carbon 面向开发者、企业、科学家与消费者开放。
- **官方定位**——原文：「Carbon is our strongest model with frontier performance in cybersecurity capabilities and long-horizon agentic workflows across complex knowledge work, software engineering, and scientific reasoning.」
  中文：Carbon 是我们目前最强的模型，在网络安全能力，以及覆盖复杂知识工作、软件工程与科学推理的长程智能体工作流上具备前沿表现。
- **与 Argon 的分工**——原文：「Argon remains the ideal choice for the majority of software engineering and knowledge work, while Carbon is built for tasks that test the limits of a model’s intelligence like complex, multi-step coding and debugging and open-ended scientific research and discovery — using more tokens than Argon to explore thoroughly, reason deeply, and run extended verification loops.」
  中文：Argon 仍是多数软件工程与知识工作的首选；Carbon 面向「考验模型智能上限」的任务（复杂多步编码与调试、开放式科研），会花更多 token 去充分探索、深度推理并跑更长的验证循环。
- **开放节奏**——原文：「Two weeks ago, we released Carbon to a set of cybersecurity defenders via our Fairwind Program.」中文：两周前（2026-10-28）Carbon 先经 Fairwind Program 向一批网络安全防御者开放，本次是面向公众的正式开放。
- **价格**——原文：「at the same introductory price as Gemini 4 Argon ($2 per million input tokens and $10 per million output tokens)」。页面脚注：「After the introductory period expires on November 30, 2026, the price of $4 per 1M input tokens and $20 per 1M output tokens will apply. Applies to the Carbon model intended for public access only.」
  中文：引入期价格与 Gemini 4 Argon 相同，每百万输入 token $2、每百万输出 token $10；引入期在 2026-11-30 结束后调整为每百万输入 $4、每百万输出 $20（仅适用于面向公众开放的 Carbon 模型）。
- **获取渠道**——原文：「For developers: Build with the Gemini API paid tier in AI Studio and Android Studio」「For enterprises: Try it in Gemini for business via the API or model drop down, Google Antigravity, or CodeMender」「For everyday users: Try Carbon starting today in the Gemini app and AI Mode in Search if you are a Google AI Ultra subscriber」「For cybersecurity defenders: Apply to join the Fairwind Program to get access to Carbon for cyber on a rolling basis.」
- **产品特性**——在 Google Antigravity 中预览 `/swarm`：把一个提示词变为一支可实时跟踪的智能体团队（架构设计、协调、审计等重推理角色 + 更快更轻的模型并行工作 + 对抗式验证器）。
- **安全口径**——原文：「For more details, read the full Gemini 4 Carbon Safety and Security report.」（配套 PDF：<https://storage.googleapis.com/deepmind-media/gemini/gemini_4_carbon_safety_report.pdf>）

## 评测数据全量转录

> 说明：本页评测结论全部为**正文散文明文**（无 DOM 评测表），因此「有绝对分值」与「只给名次/相对量」两类分开处理：有绝对分值或具名基准明确论断的建 evidence 行；只给名次（#1 / #2 / top）或只给相对倍数（2X / 6X / 25%）的按口径**只记 notes、不建行**。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| CursorBench 4.0 | #1（名次） | 官方称 Carbon 排名第一；同句的成本说法为「more than 2X lower cost per task compared to the next best external model」，属相对量。**仅记 notes（名次 + 相对）**，不建 evidence 行 |
| Perplexity's WANDR | #1（名次） | 同上，官方称排名第一，成本相对量同前。**仅记 notes（名次 + 相对）** |
| Zapier's AutomationBench | #1（名次） | 同上，官方称排名第一，成本相对量同前。**仅记 notes（名次 + 相对）** |
| Multimodal Knowledge Agent (MKA，Artificial Analysis 与 Google 合作新推) | #2（名次） | 官方称「Carbon ranks #2 while being more than 6X lower in average cost per task compared to the top performing model」。**仅记 notes（名次 + 相对）**；MKA 基准另有专文 <https://blog.google/innovation-and-ai/models-and-research/gemini-models/multimodal-knowledge-agent-benchmark/>，由并行批次单独建档，本批不建 MKA 行 |
| Hebbia's E2E Financial Agentic evaluation（深度金融研究） | 未印数值 | 官方论断：「Carbon matched the performance of the best model tested on deep financial research」，官方自述为预发布评测（pre-release evaluations）。**已建 evidence 行**（`e2e-financial-agentic`，value=null / score_status=not_reported / status=verified） |
| Balyasny Asset Management's General Financial Intelligence benchmark | top（名次） | 原文「ranked at the top out of 23 frontier model configurations」——23 个前沿模型配置是上下文计数，不是分值。**仅记 notes（名次）** |
| SEC-bench Pro（finding，发现漏洞） | 未印数值 | 官方论断「Carbon leads on key benchmarks across finding (SEC-bench Pro), exploiting (ExploitGym), and patching (CWE-bench v1)」。**已建 evidence 行**（`sec-bench-pro`，value=null / not_reported / verified）。该基准明文分值 88.2% 已在既有 release `gemini-4-carbon` 收录，本批不重复建行 |
| ExploitGym（exploiting，利用漏洞） | 未印数值 | 同句论断。**已建 evidence 行**（`exploitgym`，value=null / not_reported / verified）。明文分值 54.8% 已在既有 release `gemini-4-carbon` 收录，不重复建行 |
| CWE-bench v1（patching，修补漏洞） | 未印数值 | 同句论断。**已建 evidence 行**（`cwe-bench`，variant=CWE-bench v1，value=null / not_reported / verified）。明文分值 71.0% 已在既有 release `gemini-4-carbon` 收录（该行按第三方公开榜 third_party_reported 记录），不重复建行 |
| Project Fortify — scanning 召回率 | 100% | 原文「Carbon hit 100% recall on scanning … on our internal benchmark」。**已建 evidence 行**（`project-fortify` / metric=recall / value=100 / reported / verified）。Google 自家内部基准，越高越好（漏报越少） |
| Project Fortify — triage 精确率 | 95% | 原文「… and 95% precision on triage, on our internal benchmark」。**已建 evidence 行**（`project-fortify` / metric=precision / value=95 / reported / verified）。同一内部基准的另一个度量，越高越好（误报越少） |
| 开源代码仓测试（Open Source code repository testing） | 「over 25% relative improvement」 | 原文「we see an over 25% relative improvement on Argon’s already strong recall rate」——相对量（对照对象是同厂 Argon）。**仅记 notes（相对）** |
| 以 ExploitBench + CyScenarioBench 为种子的模拟网络攻击测试环境 | 99% | 原文「Carbon blocked 99% of attack trajectories from our adaptive red-teaming agent that can iteratively revisit its attack plans after each block」。**已建 evidence 行**（`exploitbench` / metric=attack_trajectory_block_rate / value=99 / reported / verified），越高越好。官方把 99% 归于两个基准作种子的整体环境，未分别归属，故只建一行 |
| 每次尝试的突破率（per-attempt breach rate，Carbon 护栏） | 0.8%（Argon 3.1%） | 原文「The Carbon safeguards lowered the per-attempt breach rate to just 0.8% (down from 3.1% on Argon)」。Google 自家护栏部署指标，非公开基准分数。**仅记 notes** |
| Gray Swan 测试中的自动化网络攻击查询成功率 | 2.17%（Argon 9.86%） | 原文「Our safeguards also lowered the automated cyberattack query success rate to 2.17% in Gray Swan’s testing, compared to 9.86% on Argon」。护栏部署指标。**仅记 notes** |
| Trajectory Labs 外部测试 | 0 个新通用越狱（132 小时 / 逾 13,000 次请求） | 原文「external testing by Trajectory Labs found zero new universal jailbreaks across 132 hours and over 13,000 requests」。外部测试方口径，非基准分值。**仅记 notes** |
| 375 题智能体诚实性基准 — 任务通过率 | 92% | 原文「on our 375-task agentic honesty benchmark, it passed 92% of tasks (compared to 70% for Argon)」。**已建 evidence 行**（`agentic-honesty` / metric=task_pass_rate / value=92 / reported / verified）。对照的 70% 是同厂自家模型 Argon，按口径只记 notes，不建 comparison_cited 行 |
| 375 题智能体诚实性基准 — 拒绝填补缺失实验数据 | 98% | 原文「declining to fill in missing experimental data 98% of the time」。**已建 evidence 行**（`agentic-honesty` / metric=declined_to_fill_missing_data_rate / value=98 / reported / verified） |
| 375 题智能体诚实性基准 — 指出方法学缺陷 | 68% | 原文「and flagging methodological flaws 68% of the time」。**已建 evidence 行**（`agentic-honesty` / metric=flagged_methodological_flaws_rate / value=68 / reported / verified） |
| Gray Swan IPI 基准（提示注入攻击成功率） | 0% | 原文「Two weeks ago, we shared that Carbon achieved a 0% prompt injection attack success rate on the Gray Swan IPI benchmark」。**既有 release 已收录**（`gemini-4-carbon` 的 `gray-swan-ipi` 行 0.0%），本批不重复建行，只记 notes |
| Axiom Bio 转化科学场景 | 「the leading model」（名次） | 原文「For drug toxicity research company Axiom Bio, Carbon is now the leading model in performance for translational science」。**仅记 notes（名次）** |
| CASP17 盲测集上的同源序列检索 | 「40-fold on average」 | 原文「across 7 low-homolog protein families from the CASP17 blind test set, Carbon increased the number of homologs retrieved by 40-fold on average」。相对倍数（7 个蛋白家族为上下文计数）。**仅记 notes（相对）** |

## 配图数值（只存在于图片，未转录）

页内唯一一张评测图是安全章节的「Measures of misalignment across the model's lifecycle」（原图见 `images/carbon-misalignment-lifecycle.webp`），三栏数值（视觉转写）：

| 图内栏目 | Gemini 4 Carbon | Gemini 4 Argon | 备注 |
| --- | --- | --- | --- |
| RL training alerts（高危触发） | 0.023%（-54%） | 0.050% | Google 内部训练监控指标，非公开基准分数；**仅记 notes** |
| Cheating on evals（Terminal-Bench 4.0 审计） | 尝试作弊 0.4%（9x lower）／成功作弊 0.0% | 尝试作弊 3.6%／成功作弊 2.4% | Carbon 的两个数值已在既有 release `gemini-4-carbon` 以明文散文收录（0.4% / 0.0%），**既有 release 已收录**，本批不重复建行 |
| Alerts from internal deployment（确认的高危告警） | 0.016%（-80%） | 0.078% | Google 内部部署监控指标，非公开基准分数；**仅记 notes**（-80% 的相对下降在既有 release 的内部指标备查中已有同类表述） |

> 图注写明方法论出处：<https://deepmind.google/models/evals-methodology/gemini-4-carbon>。

## 非评测的量化结论（仅备查，不建 evidence 行）

- Google Cloud Vulnerability Research 团队用 Carbon 证明某开源软件的两个缺陷确为可利用漏洞，严重程度与近期的 PHP2Shell 漏洞相当（无分值）。
- Wiz「Scan for Good」项目：扫描两家主流 SaaS 提供方时，模型在两小时内挖出 0-day 漏洞（无分值，属客户侧案例）。
- AlphaProof Code：以 Carbon 生成数百万行 Lean 证明代码，用于证明 Signal 的密码协议安全属性，把「专家团队需要数年」的任务压缩到数周（无数值）。
- 酶标实验开发：Carbon 识别出深孔板自动混合不充分等湿实验伪影（无数值）。
- Google 开放科学研究计划：四周前开放 10,000 名科学家免费使用 Argon 六个月，本次扩展到 Carbon（规模数字，非评测）。
- Antigravity `/swarm` 案例：7 份市政规划 PDF（206 张工程图视图）单提示词重建 906K 三角形的 Google Platform 37 办公室（10 轮夜间迭代）；61 键击弦机模型；110 纤维极坐标追踪（均为案例规模数字，非评测）。

## 与既有条目的关系

- 既有 release `gemini-4-carbon`（2026-10-28）记录的是 Carbon 的**首发**：先经 Fairwind Program 向部分网络防御者限量开放，收录 21 条 evidence（明文分值如 SEC-bench Pro 88.2%、ExploitGym 54.8%、CWE-bench 71.0%、Gray Swan IPI 0.0%）。
- 本 release `gemini-4-carbon-ga`（2026-11-10）记录的是**正式开放（GA）**：新增本文件的 10 条 evidence。
- 两者指向同一模型 `gemini-4-carbon`。按账本契约「只追加、不改既有文件」，两者并存而不互相覆盖（与 `gemini-4-argon` 限量首发 / `gemini-4-argon-ga` 正式放开的先例同构）。

## 归档说明

- `page.html` = 官方发布页原始存档（抓取自 <https://deepmind.google/blog/gemini-4-carbon-is-now-available/>，与 blog.google 规范页字节一致，sha256 `c2da7cee2c19432f7361b111d20f7b304af30533841be76340a3b07a54096855`）。
- `images/carbon-misalignment-lifecycle.webp` = 页内唯一一张评测图原样下载（1600 宽变体，原图 URL 见 `manifest.json`）。页面其余图片为导航 logo、作者头像、主视觉与相关推荐缩略图，非评测图，未归档。
- 参数量与上下文长度官方本页未明示，账本记 null。
- 本页全部数值均为厂商自报，未经第三方独立复现；Project Fortify 与 375 题智能体诚实性基准为 Google 内部基准，题集与判定方式未公开。
