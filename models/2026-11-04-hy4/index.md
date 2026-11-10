---
vendor: tencent
model: Hy4
release: hy4
date: 2026-11-04
source: https://hunyuan.tencent.com/research/hy4
fetched_at: 2026-11-10
---

# Hy4 正式版（腾讯混元）发布页证据归档

本归档是**腾讯混元 Hy4 正式版官方发布页**的一级来源快照，用于给 `tencent/hy4` 建档并补录官方明文评测证据。

## 来源与日期证据

| 来源 | URL | 作用 | 取数方式 |
|---|---|---|---|
| 混元官方发布文 | `https://hunyuan.tencent.com/research/hy4` | 主来源：规格、定价、正文明文分值、附录得分表 | 静态 GET 只回 SPA 骨架屏（6,893 B），正文由官方接口 `POST https://api.hunyuan.tencent.com/api/blog/publicDetail` body `{"id":100129}` 取得（`data.detail.content`，43,508 字符官方 markdown），落盘为 `page-source.md`（**其中腾讯云 COS 预签名 URL 的 `q-ak=AKID…` SecretID 参数已脱敏为 `AKID-REDACTED-BY-ARCHIVE`，共 64 处；正文文字与全部评测数值未改动**） |
| 腾讯官网通稿 | `https://www.tencent.com/zh-cn/tencent-launches-hy4`（跳转至 `…/tencent-launches-hy4-joining-the-ranks-of-the-worlds-leading-open-source-ai-models/`） | 发布日期与「跻身世界领先开源模型」定位的官方佐证 | HTTP GET，159,934 B，落盘为 `tencent-pr.html` |
| 腾讯云技术百科 | `https://cloud.tencent.com/developer/techpedia/2748` | 参数量、上下文窗口、定价的官方规格页（页面修改于 2026-11-05） | HTTP GET，189,348 B，本批临时目录留存 |

**发布日 = 2026-11-04**，四个官方来源互证：

1. 发布文封面卡 `date = "2026年11月4日"`；
2. 发布文接口返回 `displayPublishTime=1793721600`（= 2026-11-04T00:00:00Z）与 `publishedAt=2026-11-04T03:21:40Z`；
3. 腾讯官网通稿落款「2026年11月04日」；
4. 腾讯云技术百科概述明文：「混元 Hy4 是腾讯混元于 **2026 年 11 月 4 日**正式发布的最新一代大语言模型」。

> 注意：`hy.tencent.com` 骨架屏内的 `2026/11/6` 是站点 build-time，不是发布日。

## 模型规格（官方明文）

- **架构**：MoE，**770B 总参数 / 49B 激活参数**（技术百科概述明文；发布文本身只写「显著扩展了预训练和后训练规模」）。
- **上下文**：**1M tokens**（技术百科：「Hy4 支持 1M tokens 的上下文窗口（TokenHub 侧约 960K 输入）」）。
- **新增能力**：**首次引入视觉能力**（视觉理解 + 图像细粒度处理与复杂图表分析）与**首次支持电脑操作（Computer Use）**，可结合命令行与图形界面，并对 Blender、CAD 等专业软件与跨应用长程任务做了专项训练。
- **上线渠道**：腾讯云 TokenHub、OpenRouter；并在 WorkBuddy / CodeBuddy、元宝、ima、企业微信智能助理大圆、QQ、王者荣耀、和平精英、微信读书、腾讯新闻等产品接入。
- **后续计划**：计划开源模型权重（联合 vLLM / SGLang 社区与 Inferact Inc.），届时发布模型系统卡片；**Hy4 flash 计划近期发布**（继承 Hy4 能力、大幅降低任务成本）。

## API 定价（官方明文，CNY / 每百万 tokens）

| 输入（命中缓存） | 输入 | 输出 |
|---:|---:|---:|
| 0.3 元 | 6 元 | 18 元 |

发布文定价表与技术百科第九节口径一致（技术百科：「输入 6 元/百万 tokens，输出 18 元/百万 tokens，缓存命中 0.3 元/百万 tokens」），并注明**正式版定价与 Hy4 preview 保持不变**；即日起至 2026-12-31 腾讯云 TokenHub 按刊例价 5 折计费。

## 正文明文评测分值（DOM 散文，可机读）

以下为发布文正文（非配图）里**以文字形式给出绝对值**的评测结果。

| 评测方 | 指标 | Hy4 | 对照（页面明文） | 归因 |
|---|---|---:|---|---|
| 腾讯金融科技 FiT（联合） | 213 位专家、579 个真实金融任务的金融众测综合评分 | **3.04 / 4** | DeepSeek-V4.1-Flash-1017 2.97/4；Kimi K3.1 Pro 2.68/4；GLM-5.3 2.68/4 | 厂商自测 |
| 混元自建测试 | 幻觉率（越低越好） | **5.45%** | Hy4 preview 15.76% | 厂商自测 |
| 混元自建测试 | 猜测导致的错误率（越低越好） | **5.6%** | Hy4 preview 23.1% | 厂商自测 |
| WorkBuddy（腾讯系） | 综合评测平均效果 | **83.18 分** | 12 个场景中 9 个位列国内模型第一 | 厂商自测 |
| WorkBuddy（腾讯系） | 办公任务通过率 | **96.15%** | 同上 | 厂商自测 |
| 讯兔科技 | IRAB 投研智能体评测基准（101 道真实投研任务）综合得分 | **61.63 分** | 较 Hy4 preview 提升 12.03 分 | 第三方自建基准 |
| 进门（机构 AI 投研工作台） | 内部投研 Agent 场景评测「数据查询」单项 | **75.4 分** | 超过 GPT-6.1-sol 近 20 分、位列全部参测模型第一；总分与 Claude Opus 5.5 并列第二 | 第三方自建评测 |
| 财搭子 | Harness 框架下个股研究场景均分（满分 5） | **4.27 / 5** | 参评模型首位；42.9% 的回答获五模型最高评分（含并列） | 第三方自建评测 |
| 财搭子 | 深度投研场景均分（满分 5） | **4.43** | — | 第三方自建评测 |
| 财搭子 | 跟踪监控场景均分（满分 5） | **4.03** | — | 第三方自建评测 |
| Manus | 内部评测：办公文档生成与编辑任务完成率 | **接近 97%** | 深度研究、数据分析、办公文档等任务综合表现名列前茅 | 第三方自建评测 |
| 元宝（腾讯系） | 内部评测集合综合得分 | **72.53** | Hy4 preview 65.25 | 厂商自测 |
| 和平精英 AI NPC | 3 分制人工评分总分均值 | **2.91** | 情绪价值分项 2.96 | 厂商自测 |
| 王者荣耀 | AI 自动表格配置平台 20 类游戏配置场景准确率 | **97.28%** | Hy4 preview 91.74%；经 Agent 自主校验修复后达 99.32% | 厂商自测 |
| 王者荣耀 | Bug AI 自动分析平台代码根因分析准确率 | **73.8%** | Hy4 preview 59.5% | 厂商自测 |
| QQ 小 Q | 整体满意率 | **93.10%** | Hy4 preview 90.11% | 厂商自测 |
| 微信读书 | 综合评测得分 | **87.69** | Hy4 preview 82.10 | 厂商自测 |
| 腾讯安全（内部审计） | Hy-BioExperimentBench（生物安全开放式实验设计） | **30.4 / 100** | 未达高风险阈值 | 基准所有者自建自跑 |

**只给相对差值、不给绝对值的表述不单独建行**，仅进 notes：GameDev +19.1%、GameLogic +9.8%；企业微信大圆指令跟随 +13.5% / 检索 +12.7% / 会话 +8.5%；腾讯新闻 +28% / +36%；ima +9.7% / +3.4% / +1.2%；元宝多轮记忆 +6.67 分、写作多样性 +10.89 分、多模态 Agent 任务完成度 +36.8%、多模态问答 +15.8%；QQ 三个高频场景 +6.66pp / +4.69pp / +2.52pp；微信读书信息取舍 +22.2%、长度控制 +50.7%、答案可达性 +3.0%、读者适配 +6.6%；IRAB +12.03 分；训练吞吐 +20.1%。

## 附录得分表（图片，34 行有值）

「附录：模型得分」只渲染为一张位图（`images/bench-hy4-appendix.jpg`，1965×3756，官方原图 `大Bench图表.jpg`）。列序经原生分辨率切条带确认：

> Task | Benchmark | **Hy4 preview** | **Hy4**（蓝框高亮，第 3 个数值列） | GLM-5.3 | DeepSeek-V4.1-Flash-1017 | Kimi K3.1 Pro | GPT-6.1 Sol | Claude Opus 5.5

Hy4 列 34 行有值的**视觉转写**（原图为位图，数值按纪律记 pending + not_extracted，转写值只进 notes；下表仅作归档留痕）：

| Task | Benchmark | Hy4（转写） | Task | Benchmark | Hy4（转写） |
|---|---|---:|---|---|---:|
| Agentic Coding | DeepSWE v1.1 | 74.9 | Working Agent | APEX-Agents v1.1 | 75.2 |
| Agentic Coding | SWE-Marathon v1.1 | 43.8 | Working Agent | Agents' Last Exam v1.1 | 41.0 |
| Agentic Coding | ProgramBench (almost solved) | 30.0 | Working Agent | AutomationBench v1.0.6 | 56.2 |
| Agentic Coding | Terminal-Bench 4.0 | 44.4 | Working Agent | E-Bench 2.0 | 70.0 |
| Agentic Coding | FrontierCode 2.0 | 31.0 | Working Agent | Agents' First Exam-IF | 79.9 |
| Agentic Coding | Hy-CompanyBench 2.0 | 78.8 | Working Agent | Tag-bench | 48.8 |
| Agentic Coding | Hy-SWE Max Verified 2.0 | 45.4 | Working Agent | PPTGen-Bench | 60.9 |
| Agentic Coding | Hy-Backend 3.0 | 45.1 | AI4Research | HLE-Full (with tools) | 59.1 |
| Agentic Coding | WebCraftBench | 78.9 | AI4Research | Hy-FrontierMath T5 (internal) | 13.0 |
| Agentic Coding | GameFix Bench 2.0 | 68.4 | AI4Research | ProofBench (internal) | 5.5 |
| Agentic Coding | 3DArena-Modeling | 37.1 | AI4Research | Terminal-Bench-Science 0.1 | 19.8 |
| Agentic Coding | Goal2Repo | 23.2 | AI4Research | PostTrainBench v1.2 | 35.2 |
| Agent Search | AutoCatBench | 57.2 | AI4Research | Foundation Model Bench | 28.1 |
| Agent Search | Hy-LifeSearch | 60.2 | AI4Research | TenureTrail | 53.6 |
| Agent Search | Hy-BrowseComp 2.0 | 59.9 | Computer Use | OSWorld 2.1 | 78.9 |
| Multimodal | MMMU-Pro | 78.6 | Multimodal | ZeroBench-main (with tools, pass@5) | 55.4 |
| Multimodal | BuddyVQA Atlas (with tools) | 81.0 | Multimodal | BuddyVQA Atlas (without tools) | 55.6 |

> 附录共 17 个数值行 × 2 组（Hy4 / Hy4 preview）所在表体，另含 GLM-5.3、DeepSeek-V4.1-Flash-1017、Kimi K3.1 Pro、GPT-6.1 Sol、Claude Opus 5.5 五列竞品值，按「取自家模型列」规则只进 notes。

### 附录协议说明（图中 Notes 段，逐条读入）

- 带 `*` 的基准**首次发布时首次评测**；每个模型按**最高可用推理档**评测并报告，`*` 表示自测，`†` 表示在 HLE 的**纯文本子集**上评测。
- 部分 Hy4 preview 分数与此前报告不同，因评测脚手架、judge 模型与反作弊机制有更新。
- **DeepSWE v1.1**：mini-swe-agent；每任务沙箱 8 CPU 核 / 16 GB 内存。
- **SWE-Marathon v1.1**：官方评测设置，agent 超时放宽到官方 2 倍；为降低方差，每任务重复运行直到取得 8 个有效分数。
- **ProgramBench**：报 Almost Solved 分数，Claude Code 2.1.220；其他模型沿用各自官方博客的脚手架配置，未说明则回退 ProgramBench 官方 mini-SWE-agent。
- **Terminal-Bench 4.0**：Claude Code 脚手架，每次试验最多 500 turns、13 小时超时；资源上限 16 CPU / 32 GB RAM，三个 GPU 相关任务额外配单张 H100。
- **Hy-CompanyBench 2.0**：GPT 系用 Codex 0.154.0，其他模型用 Claude Code 2.1.234。
- **Hy-SWE Max Verified 2.0 / Hy-Backend 3.0**：GPT 系用 Codex 0.154.0，其他模型用 Claude Code 2.1.295。
- **WebCraftBench**：文本生成网站；GPT 系用 Codex 0.115.0，其他模型用 Claude Code 2.1.117；网站产物部署在内部沙箱，exploration agent 基于 AWorld，judge agent 为自研 agent。
- **GameFix Bench 2.0**：100 个游戏修复任务，16 核 / 32 GB 沙箱；GPT 系用 Codex，其他模型用 Claude Code；隐藏 Playwright 测试度量修复的游戏问题比例。
- **3DArena-Modeling**：120 个 3D 建模任务（从精度到美学），16 核 / 32 GB 沙箱；GPT 系用 Codex，其他模型用 Claude Code；Elo 来自盲对成对比较并缩放为百分比。
- **Goal2Repo**：长程编码与自调试，agent 多次提交并获得带失败惩罚的通过率反馈，直到全通过或预算耗尽；GPT 系 codex v0.166.0，其他模型 claude-code v2.1.316，avg@3。
- **AutoCatBench**：以网页为载体探测模型极限；GPT 系用 Codex 0.115.0，其他模型用 Claude Code 2.1.117。
- **Hy-LifeSearch / Hy-BrowseComp 2.0**：内部搜索脚手架 + LLM judge（前者按任务 rubric 评分，后者对唯一参考答案评分）。
- **APEX-Agents v1.1**：官方 reference agent harness（Loop），每试验最多 250 步；官方 main + world 两服务环境上限 8 CPU / 24 GB RAM，判分在独立 verifier 容器（2 CPU / 8 GB RAM）。
- **AutomationBench v1.0.6**：使用 Zapier 发布的 600 个公开任务，按官方方法评测。
- **E-Bench 2.0**：以 MCP 工具完成日常任务，简单 agent 循环，评分结合最终数据库状态检查与 LLM-as-judge。
- **Agents' First Exam-IF**：101 个研究任务，内部搜索脚手架 + 逐任务 rubric 评分。
- **Tag-bench**：评估 agent 完成复杂真实职场任务的能力（多轮交互，LLM-as-judge + 程序化验证器）。
- **PPTGen-Bench**：文本生成 PPT，结合通用美学评估与关键缺陷扣分；GPT 系用 Codex 0.115.0，其他模型用 Claude Code 2.1.117；用 LibreOffice 把 PPT 渲染成 PDF；agentic judge 采用 Claude Code 2.1.117。
- **Terminal-Bench-Science 0.1**：Claude Code 脚手架，每试验最多 500 turns、13 小时超时；资源上限 24 CPU / 48 GB RAM。
- **PostTrainBench v1.2**：Gemini 模型用 OpenCode，其他模型用 Claude Code 2.1.198；任务在带 NVIDIA H100 GPU、10 小时预算的沙箱中运行。
- **Foundation Model Bench**：考察 agent 能否通过训练数据、架构与训练策略优化领域专用基础模型。
- **TenureTrail**：考察 AI 研究 agent 能否在 123 个可执行任务（数学、ML、物理科学、生命科学、地球与环境科学、工程、社科）上取得可验证进展；GPT 系用 Codex 0.153.4，其他模型用 Claude Code 2.1.220。
- **ZeroBench-main**：网络隔离的 Jupyter 环境，以图像输出作为工具接口，每次运行最多 80 轮工具调用；每题 10 次独立运行以估计 pass@5。
- **BuddyVQA Atlas**：从图像回答问题（识别、计数、比较、OCR、空间朝向、定位），聚焦直接整图作答易失败的用例（小字、细线、小目标、定位）。

## 入账方式

- 新建 release 档 `data/model-releases/official/tencent/hy4.json`，模型 id `hy4`，release_date `2026-11-04`（`date_precision: day`）。
- **正文明文绝对值** → `evidence_type: "text"`，`status: verified`，`attribution_type` 按评测方区分（腾讯系自测 = `vendor_reported`；讯兔 / 进门 / 财搭子 / Manus 自建评测 = `third_party_reported`；Hy-BioExperimentBench 为腾讯自建自跑基准 = `benchmark_owner_reported`）。
- **附录位图行** → `evidence_type: "figure"`，`status: pending`，`reported_score.value = null` / `score_status: "not_extracted"`，视觉转写值只进 `notes`，`locator.figure` 指向 `models/2026-11-04-hy4/images/bench-hy4-appendix.jpg`。
- 同一 benchmark 的不同子指标用 `benchmark_variant` 区分（如财搭子的个股研究 / 深度投研 / 跟踪监控）。
- 竞品列只进 `notes`，不单独建行。
- 本批**不新建** benchmark 实体；账本中尚未收录的基准在 `notes` 里标 `new-benchmark: <name>`。
- 归档路径 `models/2026-11-04-hy4`，`index.md` frontmatter 的 `release: hy4` 供 `scripts/reconcile-coverage.mjs` 回填 `archive_path`。

## 局限性

- 附录 34 行为**官方配图位图**，本批按纪律记 `pending` + `not_extracted`；转写值已按原生分辨率切条带逐行复核并与 `images/bench1-hy4-main.jpg` 柱状图交叉互证，但**数值尚未经人工复核翻 verified**——沿用 `tencent/hy4-preview` 的先例：需另起一轮「重读归档图片」专项批次才能升级。
- 竞品列（GLM-5.3、DeepSeek-V4.1-Flash-1017、Kimi K3.1 Pro、GPT-6.1 Sol、Claude Opus 5.5）多为 `a / b*` 双值或带 `*`（首次评测）标记，口径与 Hy4 单值列不同，横向比较仅在 `comparison_scope: only_same_protocol` 内成立。
- 金融众测、WorkBuddy、元宝、王者荣耀、和平精英、QQ、微信读书等为**内部评测**，题目、判分流程与打分标准不公开，不可复现；IRAB、进门、财搭子、Manus 同理（第三方自建基准，发布文只给结论值）。
- 混合量纲并存：4 分制众测评分、5 分制财搭子评分、3 分制和平精英评分、0–100 的 Hy-BioExperimentBench、百分制准确率与得分，跨行不可直接比较。
- 发布文未给出 Hy4 的 token 成本、采样温度、rollout 次数等逐项运行配置明细，故 `protocol` 中相应字段一律 `null`。
- 官方明确 Hy4 与顶尖闭源模型仍有差距，尤其在内部构建的前沿数学、长程开发、模型迭代、视觉问答等高难度测试集上。
