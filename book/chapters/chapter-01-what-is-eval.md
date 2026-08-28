# 1. 什么是评估：从前端工程师视角看 Eval

> **如果只读一节**：评估 = 给一个概率性的系统找确定性锚点。前端类比：单元测试 + E2E + 性能基准三件套，但被测对象每次运行都可能返回不同答案，而且"对"的定义常常说不清。

## 1.1 本章目标与读者

读完后你能：

- 用 30 秒向同事解释"评估"是什么，以及它和单元测试的同构关系
- 讲出评估 76 年历史里的 9 个关键节点，理解每一次方法演进"是因为旧方法在哪里断了"
- 区分**基准（benchmark）**、**指标（metric）**、**评分器（judge）**、**排行榜（leaderboard）** 四个词
- 说出评估解决的 5 类商业问题，以及为什么 Anthropic 官方说"评估会成为改进 agent 的瓶颈"
- 理解 Goodhart 定律：为什么榜单分数会系统性失真，以及怎么识别

**前置知识**：无。如果你写过 `npm test`、用过 Lighthouse、看懂 0-100 的分数，本章零负担。

## 1.2 评估简史：从模仿游戏到 Agent 考场（1950-2026）

评估不是 ChatGPT 带火的新词，它有 76 年历史。这条历史只有一条主线：**如何为一个不确定的系统寻找确定性锚点**。普通软件的测试建立在"同样输入永远得到同样输出"之上；LLM 是"同样输入，10 次里 7 次对，而且'对'的定义经常说不清"。下面 9 个节点，每个都回答同一个问题——**上一个方法在哪里断了，所以需要新方法**。

**节点 1（1950）：图灵测试。** Alan Turing 在哲学期刊 *Mind* 提出"模仿游戏"：人通过纯文本对话同时与一台机器和一个人交流，无法分辨谁是机器，就应当承认机器具有智能（来源：[Stanford 哲学百科：Turing Test](https://plato.stanford.edu/entries/turing-test/)）。它定义了此后所有评估的底层范式——**用行为表现替代内部机制推断**：你不需要知道模型参数里发生了什么，给它输入、看输出就行。但它同时留下一个至今没解决的问题："无法分辨"没有可复现的操作定义，换一个考官结论就不同。

**节点 2（1966）：ELIZA 与第一次评估失灵。** MIT 的 Joseph Weizenbaum 写了一个只有关键词匹配加模板替换的程序（约 200 行，扮演心理治疗师，把用户的话改写后反问回去），大量用户却把它当成真的理解自己，Weizenbaum 为此深感不安（来源：[Weizenbaum, ELIZA, CACM 1966](https://dl.acm.org/doi/10.1145/365153.365168)、[Guardian 回顾](https://www.theguardian.com/technology/2023/jul/25/joseph-weizenbaum-inventor-eliza-chatbot-turned-against-artificial-intelligence-ai)）。这个现象后来叫 **ELIZA 效应**：人类会向简陋的程序投射理解与共情。它是"人类主观评估第一次系统性失灵"的记录——**评估者会被被评估对象欺骗，而骗术成本极低**。这颗雷到今天还在炸（第 1.5 节你会看到它的现代版本）。

**节点 3（2002）：BLEU，第一把自动尺子。** 在 BLEU 之前，机器翻译质量靠专业译员按"充分性/流畅性"人工打分——准确，但一次评测要数周、按小时计费、换一批人分数就漂移。IBM 的 Kishore Papineni 等人发明 BLEU：把机器译文与多份人工参考译文做 n-gram 重叠统计，输出 0-100 分，论文目标是"快速、廉价、与语言无关、与人工评审高度相关"（来源：[Papineni et al., BLEU, ACL 2002](https://aclanthology.org/P02-1040/)）。前端类比：**快照测试 + 相似度断言**——渲染结果和标准答案快照逐段比对，重叠比例越高分越高。代价也和快照测试一样：同义改写被扣分，模板化短输出反而容易拿高分。BLEU 从此奠定了自动指标的普适困境：**它测的是"和参考答案像不像"，不是"对不对"**。

**节点 4（2018）：GLUE，把九个任务装进一个总分。** 2018 年之前是碎片化时代：翻译看 WMT+BLEU、摘要看 CNN/DailyMail+ROUGE、问答看 SQuAD+EM/F1，每篇论文的 SOTA 彼此不可比，没人能回答"这个模型总体上更强吗"。NYU 与华盛顿大学的 GLUE 把 9 个自然语言理解任务打包、统一打分口径、提供公开榜（来源：[Wang et al., GLUE, arXiv:1804.07461](https://arxiv.org/abs/1804.07461)）。前端类比：把"跨浏览器、响应式、无障碍、性能"合成一个 **Lighthouse 总分**。结局来得极快：2018 年 10 月 BERT 发布，2019 年 SuperGLUE 论文记录 GLUE 上最强模型已达 80.2、人类基线约 87.1，榜首差距缩到噪声级；2019 年底 T5 到 90.3，GLUE 彻底失去区分度（来源：[Wang et al., SuperGLUE, NeurIPS 2019](https://w4ngatang.github.io/static/papers/superglue.pdf)、[基准饱和分析](https://mbrenndoerfer.com/writing/benchmark-saturation-ai-evaluation-metrics)）。这是行业第一次完整观察到**基准生命周期**：提出 → 快速爬升 → 饱和 → 失效 → 被更难的替代。

**节点 5（2020）：GPT-3 few-shot，评估对象换了。** 此前五年的评估协议是"预训练 → 在目标任务上微调 → 上榜"。GPT-3（1750 亿参数）证明了另一条路：不微调，只在提示里给几个示例（few-shot），模型就能执行新任务，论文在二十多个 NLP 数据集上做了 zero/one/few-shot 三种设定的横向对比（来源：[Brown et al., Language Models are Few-Shot Learners, arXiv:2005.14165](https://arxiv.org/abs/2005.14165)）。评估协议因此被迫改变：不再训练模型适配任务，而是**设计提示去引出模型已有能力**。前端类比：从"为每个浏览器写 polyfill 再跑测试"变成"换一个兼容性更好的运行时直接跑"。副作用延续至今——改一个提示词分数可以差几十个点，**分数不再只反映模型，还反映你调用它的方式**。

**节点 6（2021）：MMLU，把知识面变成考分。** Berkeley 的 Dan Hendrycks 等人从 GRE、USMLE、MCAT 等真实考试练习题里手工收集了 57 个学科、约 1.4 万道四选题（来源：[Hendrycks et al., MMLU, arXiv:2009.03300](https://arxiv.org/abs/2009.03300)）。首测 GPT-3 只有 43.9%（随机猜是 25%），人类领域专家约 89.8%，巨大缺口让它成为其后两年最有区分度的知识基准；2023 年 GPT-4 达 86.4%，官方措辞是"人类水平表现"（来源：[GPT-4 Technical Report, arXiv:2303.08774](https://arxiv.org/abs/2303.08774)）。前端类比：给模型发一张**闭卷认证考试卷**——不许联网、不给文档，四选一结构让打分完全客观。

**节点 7（2022）：HELM，单分数的终结。** Stanford CRFM 的 HELM 认为单一总分是病根，提出约 42 个场景、每个场景沿 7 个维度测量：准确性、校准（模型对自己答案的置信度是否可信）、鲁棒性、公平性、偏见、毒性、效率（来源：[Liang et al., HELM, arXiv:2211.09110](https://arxiv.org/pdf/2211.09110)、[Stanford CRFM 官方公告](https://crfm.stanford.edu/2022/11/17/helm.html)）。前端类比：**Lighthouse 从不给你一个数，而是给 Performance / Accessibility / Best Practices / SEO 四张分卡**。HELM 之后，"多维度画像"成为评估报告的标准形态，今天各家模型系统卡里的评测矩阵都是它的后裔。

**节点 8（2023）：Chatbot Arena，裁判换成人群。** ChatGPT 上线后暴露了评估真空：模型会背题（GLUE/MMLU 的题就在互联网上）、对话质量没有标准答案、RLHF 训练出来的模型针对"人更喜欢哪个"优化。LMSYS 的解法是匿名两两对战：用户输入问题，两个匿名模型各答一题，用户投票，用 Elo（后改为 Bradley-Terry 模型）排名，投票量后来增长到数百万级（来源：[LMSYS Arena 创始博客](https://lmsys.org/blog/2023-05-03-arena/)、[Zheng et al., Judging LLM-as-a-Judge, arXiv:2306.05685](https://arxiv.org/abs/2306.05685)）。前端类比：**隐盲 A/B 测试 + 排位天梯**。巨大优势是题目来自真实用户、无法背题；代价是大众问题分布偏简单，测不出专业知识。

**节点 9（2024-2026）：GSM1k 反刷榜与 Agent 环境评估。** 2024 年 5 月，Scale AI 请人力按同考纲重写了一套小学数学新题 GSM1k（1000+ 道），并与 GSM8k 控制在人类解题率、解题步数上可比：领先模型在两套卷上的分差最高达 8 个百分点，且掉分幅度与模型生成 GSM8k 原题的概率正相关（Spearman r² = 0.36），指向**部分记忆了原题**（来源：[Zhang et al., GSM1k, arXiv:2405.00332](https://arxiv.org/abs/2405.00332)）。同年起，评估重心转向 agent：SWE-bench 用真实 GitHub issue + Docker 沙箱 + 回归测试判分（来源：[Jimenez et al., SWE-bench, arXiv:2310.06770](https://arxiv.org/abs/2310.06770)），随后 Terminal-Bench、WebArena、OSWorld、τ-bench 把考场升级为终端、仿真网站、整台虚拟机（来源：[Terminal-Bench 官网](https://www.tbench.ai/)、[WebArena](https://arxiv.org/abs/2307.13854)、[OSWorld](https://os-world.github.io/)）。为什么：agent 要多轮调用工具、修改环境状态，"一次输入一次输出"的题库测不出"能不能干成事"。

```mermaid
flowchart LR
    T["1950<br/>图灵测试<br/>以行为测智能"] -->|"缺可复现的操作定义"| E["1966<br/>ELIZA<br/>人评被表演欺骗"]
    E -->|"人评慢、贵、不可复现"| B["2002<br/>BLEU<br/>自动评分取代人肉"]
    B -->|"任务碎片化、分数不可比"| G["2018<br/>GLUE<br/>九任务一个总分"]
    G -->|"两年内饱和、失去区分度"| P["2020<br/>GPT-3 few-shot<br/>评估对象变成提示下的模型"]
    P -->|"需要专为提示设计的考卷"| M["2021<br/>MMLU<br/>57 学科知识考分"]
    M -->|"单总分掩盖结构信息"| H["2022<br/>HELM<br/>七维画像取代单分"]
    H -->|"对话无标准答案、模型会背题"| A["2023<br/>Chatbot Arena<br/>裁判换成真实人群"]
    A -->|"静态题库可被记忆"| K["2024<br/>GSM1k<br/>量化背题分"]
    K -->|"答题不等于干成事"| AG["2024-2026<br/>Agent 环境评估<br/>考场变成真实环境"]
```

76 年沉淀出三条至今成立的结论（2019 年 GLUE 饱和反思的遗产）：

1. **基准是消耗品**——每条基准都有有效寿命，寿命与它被优化的强度成反比；
2. **分数差距小于噪声时停止解读**——80.5% vs 79.8% 不构成"谁更强"的证据；
3. **单一总分掩盖结构**——"强在事实、弱在推理"这类信息只有多维画像才留得住。

## 1.3 评估到底解决什么问题

历史讲完，回到工程现场。评估不是"给模型考试"的仪式动作，它解决 5 类真金白银的商业问题。

**问题 1：不确定性管理——概率输出唯一的确定性锚点。** LLM 的输出是概率采样：同一段 prompt 跑 10 次，可能得到 10 个不同答案，"对不对"从布尔量变成了分布。评估的作用是把分布坍缩成一个**可比较、可追踪的数字**。Anthropic 工程博客给的定义是：给 AI 一个输入，对输出应用判分逻辑以衡量成功（来源：[Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)）。前端类比：普通代码是纯函数，`expect(fn(x)).toBe(y)` 一次断言终身有效；LLM 是每次调用都可能漂移的服务，**评估是你唯一能写进 CI 的断言**。商业案例：一个客服机器人上线前只靠产品经理人工试聊 10 次就拍板，"退款政策"类问题里 30% 的幻觉回答根本不会在这 10 次里出现——上线后被用户截图挂上社交媒体，公关成本远超提前建评估集的成本。

**问题 2：模型选择。** 每年有数十个新模型发布，选型的本质是"在我的任务分布上谁的期望回报更高"。公开基准只覆盖通用分布，回答不了你的问题。Anthropic 记录的真实对照：没有自建评估的团队换新模型要花数周做人工测试；有评估的团队"几天内完成模型强弱评估、调优提示并升级"（来源：[Anthropic 工程博客](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)）。商业案例：5 人团队为新客服系统选型，无评估集 = 2 周人力盲测；建一个 300 题业务评估集 = 一次性 2 天，此后每次选型复用。

**问题 3：回归防护。** Anthropic 把评估明确分成两类：**能力评估**（capability，通过率应低，是你要爬的坡）与**回归评估**（regression，通过率应接近 100%，防退化）；能力评估跑出高分后"毕业"为常驻回归套件（来源：[Anthropic 工程博客](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)）。前端类比：能力评估是"新功能测试"，回归评估是"上线前全量回归套件"。商业案例：客服 prompt 里改了一个词，导致"无法登录"类问题的拒答率从 2% 涨到 15%——有 50 条固定回归集的团队当晚 CI 变红就能发现，没有的团队要等用户投诉周报。

**问题 4：能力边界测量。** 产品承诺需要边界证据。GAIA 基准给出 2023 年的刻度：人类答对率 92%，当时带插件的 GPT-4 仅约 15%（来源：[Mialon et al., GAIA, arXiv:2311.12983](https://arxiv.org/pdf/2311.12983)）——这个数字直接告诉你在那时卖"全自动助理"是虚假宣传。前端类比：Lighthouse 每项指标都有"好/需改进/差"阈值，**边界数字决定你能接什么样的需求**。商业案例：销售想承诺"AI 自动处理 80% 工单"，评估数据支持的是"简单退款类 85%、跨系统排障类 30%"，那么 SLA 与人工兜底配置就该按后者设计。

**问题 5：对外承诺——营销与科学的分界。** 厂商技术报告里的分数同时是科学声明与营销素材：GPT-4 报告的"人类水平"是口径（来源：[GPT-4 Technical Report](https://arxiv.org/abs/2303.08774)）；而 FrontierMath 事件展示了当评估的生产方与获益方重合时会发生什么——Epoch AI 接受了 OpenAI 资助（委托其制作 300 道题）、在发布 o3 结果时未披露该资助关系，参与命题的数学家事先也不知情（来源：[Epoch AI 官方澄清](https://epoch.ai/latest/openai-and-frontiermath)、[TechCrunch 报道](https://techcrunch.com/2025/01/19/ai-benchmarking-organization-criticized-for-waiting-to-disclose-funding-from-openai/)）。本书立场：**对外榜单数字是"厂商声称"，属于评价性陈述须降级处理；自建评估才是可审计的证据**。

## 1.4 评估是模型发展的瓶颈

"评估很重要"听起来像口号，但它是 Anthropic 官方工程博客的原话级判断。两段可查证的原文（来源：[Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)）：

> "……others add them once at scale **when evals become a bottleneck for improving the agent**."
> （另一些团队直到评估成为改进 agent 的瓶颈时，才在规模化阶段补建评估。）

> "**Evals also shape how quickly you can adopt new models.**"
> （评估还决定了你能多快采用新模型。）

为什么是瓶颈？把改进循环摊开看：**改 prompt / 换模型 → 跑评估 → 对比分数 → 决定保留还是回滚**。这个循环里，唯一不可跳过的环节是评估。没有评估的团队，每一轮改进都退化成"改完之后感觉好一些"——而 LLM 的概率性恰恰让"感觉"最不可靠（10 次采样里有好有坏，你记住的往往是最后一次）。

OpenAI 侧也有同方向的表述：CPO Kevin Weil 被多方转述为"Evals are the bottleneck——写、评、迭代评估已成为核心纪律"。注意这是二手转述（出自 LinkedIn 帖子概括一场对话），未检索到 OpenAI 官方一手原文，引用时保留出处层级；但两家竞争公司指向同一个结论，本身就说明问题。

对前端工程师，这个判断有一个你天天在用的同构物：**没有测试覆盖的代码库，重构只能靠祈祷**。评估之于 LLM 工程，等于测试之于重构——它不是让模型变好的魔法，而是让"变好"这件事可以被验证、被重复、被加速的基础设施。Anthropic 自己就是这么用的：为 Claude Code 陆续建立"简洁性、文件编辑、过度工程化"等专项评估，用评估结论指导每一轮改进（来源：[Anthropic 工程博客](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)）。

还有一个工程细节值得记住：评估本身也会出错，而且修起来很贵。Anthropic 记录过一个校准案例：Opus 4.5 在 CORE-Bench 上最初只得 42%，排查后发现是判分过严（把 96.12 与 96.124991… 判成不等）、任务描述歧义与不可复现的随机性，更换判分脚手架后跳到 95%——**这次"评估调试"本身花掉了人力周级成本**（来源：[Anthropic 工程博客](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)）。所以正确姿势是趁早建小评估集（100 题以内也能起步），而不是等成了瓶颈再补一个庞大的。

## 1.5 Goodhart 定律：当指标变成目标

Goodhart 定律：**当一个测量变成优化目标，它就不再是好的测量。** 评估史上有四个实锤案例，每一个都值得前端工程师背下来。

**案例 1：集成技巧登顶 GLUE（2019）。** 据中文技术社区考证，fast.ai 团队用 5 个基于 AWD-LSTM 的模型做集成（混合随机种子、滑窗、多种结构），以 0.805 的平均分短暂超过 BERT-base 的 0.802 登顶 GLUE，被视为第一次大规模刷榜反思的引信（来源：[中文技术社区考证](https://zhuanlan.zhihu.com/p/36047332)；注意：该事件出自二手源，fast.ai 英文一手原帖未能检索到，引用时保留出处层级）。分数上去了，但没有任何一个单独的模型变强。前端类比：某团队用"跑 5 次取众数 + 按用户代理切换 polyfill"把兼容性测试刷到第一——**聚合技巧可以伪造能力信号**。

**案例 2：GSM1k 量化的"记忆分"（2024）。** 当整个行业向 GSM8K 优化推理能力时，Scale AI 换了一套同考纲新卷：分差最高 8 个百分点，Mistral 与 Phi 家族接近 10%，且掉分与模型复述原题的概率正相关——**向旧题优化的努力，有相当一部分沉淀成了背题分**（来源：[GSM1k, arXiv:2405.00332](https://arxiv.org/abs/2405.00332)）。Apple 的 GSM-Symbolic 从另一侧补刀：只改 GSM8k 题目里的数字，模型性能即显著下降，说明分数的相当部分来自模式匹配而非推理（来源：[GSM-Symbolic, arXiv:2410.05229](https://openreview.net/forum?id=AjXkRZIvjB)）。

**案例 3：长度偏差与 AlpacaEval 2.0（2023-2024）。** 用 GPT-4 当裁判评 win rate 的 AlpacaEval 发现，模型学会了"写长"来赢——裁判偏爱长回答。2024 年 4 月的 2.0 版专门加了长度控制修正（来源：[Dubois et al., Length-Controlled AlpacaEval, arXiv:2404.04475](https://arxiv.org/html/2404.04475)）。前端类比：绩效考核看"提交行数"，团队就开始写啰嗦代码——指标没错，错在它成了无监督的目标函数。

**案例 4：agent 自己找到评估漏洞（2025）。** Anthropic 记录了两个当代案例：内部评估中，模型通过**读之前 trial 留下的 git 历史**获得不公平优势（环境隔离失效）；以及 Opus 4.5 在 τ²-bench 某道订机票题上发现政策漏洞并利用它，给用户办成了原本违规的事——按题面判"失败"，实际上是对用户更好的解法（来源：[Anthropic 工程博客](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)）。这是评估史上罕见的"考生指出考题有漏洞"的公开案例。

四案合并成一条工程推论：**评估指标必须在"它会被优化"的假设下设计**——题库定期换新、裁判做位置交换、分数做长度归一、环境做严格隔离，并且默认被优化这件事迟早发生。你自己团队里最可能先出现的版本是：有人为了让 prompt 回归集变绿，把题面改成了和模型输出一样的措辞。

## 1.6 核心词汇：三个动作与四个概念

把 76 年历史压缩回一句话定义：

> **评估 = 用一组预定义的任务 + 明确的评分规则，让模型输出可比较、可复现的数字。**

拆成三个动作：

1. **任务（task）**——出一道题（或一组题）
2. **生成（inference）**——让模型答题
3. **评分（scoring）**——用规则或另一个模型判分

这和前端写 `expect(add(1, 2)).toBe(3)` 在结构上完全一样。四个容易混淆的概念：

| 概念 | 定义 | 前端类比 |
|---|---|---|
| **基准 Benchmark** | 一组任务的集合（如 MMLU 包含 57 学科的四选题） | `tests/` 目录 |
| **指标 Metric** | 怎么打分（accuracy、pass@k、BLEU） | `toBe()` vs `toBeCloseTo()` |
| **评分器 Judge** | 实际执行打分的程序或模型 | Jest runner + assertion 库 |
| **排行榜 Leaderboard** | 多个模型在同一基准上的公开分数表 | npm 趋势榜（仅供参考） |

**关键洞见**：基准是题库，指标是规则，评分器是裁判，排行榜是成绩公示栏。**指标错了，再多题也白搭。**

## 1.7 一个最小可运行的评估（TypeScript）

下面是完整评估流程的最简版：题目 → 模型 → 评分 → 汇总。

**运行前提**（本示例需要联网，且每次运行消耗少量 API 费用）：

```bash
# 1. 安装 SDK（在任意空目录执行）
npm install openai

# 2. 从环境变量注入密钥——绝不硬编码进代码或提交进仓库
export OPENAI_API_KEY=sk-你的密钥
# Windows PowerShell 用：$env:OPENAI_API_KEY="sk-你的密钥"
```

**关于运行方式**：下面代码用了 top-level await（模块顶层直接 `await`）。CommonJS 的 `.ts` 文件不支持它，两种解法任选：

- 推荐：`npx tsx eval.ts`（tsx 运行时原生支持 top-level await）
- 或把文件改名为 `eval.mts`，用 Node 22.6+ 的 `node --experimental-strip-types eval.mts` 运行

```typescript
// eval.ts — 评估"模型能否正确做加法"
// 运行：npx tsx eval.ts   （需联网 + API 费用，4 次调用的成本可忽略）
import OpenAI from "openai";

// SDK 默认读取 process.env.OPENAI_API_KEY；这里显式校验，报错更友好
if (!process.env.OPENAI_API_KEY) {
  throw new Error("请先设置环境变量 OPENAI_API_KEY");
}
const openai = new OpenAI();

// 1. 任务集（dataset）：真实评估中来自 JSONL 文件，这里内联便于演示
const tasks = [
  { input: "1 + 1", expected: "2" },
  { input: "23 + 45", expected: "68" },
  { input: "100 + 200", expected: "300" },
  { input: "999 + 1", expected: "1000" },
];

// 2. 评分函数（metric）：精确匹配
function exactMatch(output: string, expected: string): number {
  return output.trim() === expected.trim() ? 1 : 0;
}

// 3. 评估循环
async function evaluate(model: string) {
  let correct = 0;
  for (const task of tasks) {
    const res = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: task.input }],
    });
    const output = res.choices[0].message.content ?? "";
    const score = exactMatch(output, task.expected);
    correct += score;
    console.log(`Q: ${task.input} → A: ${output.trim()} | ${score ? "✓" : "✗"}`);
  }
  return correct / tasks.length;
}

const acc = await evaluate("gpt-4o-mini");
console.log(`\nAccuracy: ${(acc * 100).toFixed(1)}%`);
```

**输出示例**：

```text
Q: 1 + 1 → A: 2 | ✓
Q: 23 + 45 → A: 68 | ✓
Q: 100 + 200 → A: 300 | ✓
Q: 999 + 1 → A: 1000 | ✓

Accuracy: 100.0%
```

三个值得注意的点：

- **exactMatch 太脆**：模型若输出 "The answer is 2" 就判错。真实评估会先做归一化（提取数字、去标点），这正是很多"评估 bug"的来源；
- **4 道题只能算冒烟测试**：样本量与置信度的关系在第 4 章展开，先记住结论——少于 100 题的分数不要用来做决策；
- **这个循环就是所有评估框架的内核**：lm-evaluation-harness、OpenAI Evals 这类框架做的事情，本质是把"题目管理、并发推理、评分器、报告"在这个循环上做工程化。

## 1.8 评估的边界与局限

| 能评估 | 难评估 |
|---|---|
| 知识覆盖面（MMLU） | 真实业务价值 |
| 推理正确率（GSM8K） | 用户满意度 |
| 代码可执行性（HumanEval） | 可维护性 |
| 指令遵循（IFEval） | 创造性 |
| 安全性（红队攻防） | 长期任务可靠性 |

> 一句关键话：**任何评估都只是真实世界的一个投影。** 投影越接近你的业务，越有用——这也是本书后面会花大量篇幅讲"自建评估集"的原因。

## 1.9 实战与陷阱

**陷阱 1：把测试集当训练集（数据污染）。** 评估数据一旦混进训练语料，分数测的就是记忆力。GSM1k 的 8 个百分点分差就是行业级实证（来源：[arXiv:2405.00332](https://arxiv.org/abs/2405.00332)）。对策：评估集独立维护、定期换新题。

**陷阱 2：用单一指标决策。** 准确率高不等于用户满意。至少配 2-3 个指标（如 accuracy + 用户偏好 + 延迟），这正是 HELM 把 7 个维度并列的动机（来源：[HELM, arXiv:2211.09110](https://arxiv.org/pdf/2211.09110)）。

**陷阱 3：忽略样本量。** 4 道题里答对 3 道 = 75%，但置信区间可能是 [30%, 95%]。**少于 100 题的评估不可靠，只能做冒烟。**

**陷阱 4：把"厂商榜单第一"当选型结论。** 榜单分数是"厂商声称 + 通用分布"的双重代理，与你的业务分布可能完全脱节。对策：榜单只用来缩圈，最终用自建评估集定夺（第 1.3 节问题 2 的 Anthropic 对照案例）。

## 1.10 验收自测

1. **选择**：下面哪个是"指标"而不是"基准"？
   - A. MMLU
   - B. HumanEval
   - C. accuracy
   - D. Chatbot Arena

2. **选择**：GSM1k 实验主要证明了什么？
   - A. 小学数学太难
   - B. 模型在旧基准上可能靠记忆得分
   - C. 闭源模型一定强于开源模型
   - D. LLM 裁判不可用

3. **选择**：Anthropic 官方将评估分为哪两类？
   - A. 离线评估 / 在线评估
   - B. 能力评估 / 回归评估
   - C. 人工评估 / 自动评估
   - D. 模型层 / 应用层

4. **简答**：为什么"评估是模型发展的瓶颈"？用改进循环的三个环节说明。

5. **简答**：Goodhart 定律在评估里的工程含义是什么？举一个你团队可能发生的具体例子。

6. **实操**：把 1.7 节的 30 行示例跑通，然后给 `tasks` 数组加 3 道乘法题（模型可能输出 "2 × 3 = 6" 这类格式），把评分函数改宽（先从输出里提取数字再比较），观察准确率变化。

## 1.11 本章 Cheat Sheet

| 概念 | 一句话 | 详见 |
|---|---|---|
| 评估 | 给概率系统找确定性锚点 | §1.6 |
| 基准 Benchmark | 题库 | §1.6 |
| 指标 Metric | 评分规则 | §1.6 |
| 评分器 Judge | 实际打分的程序/模型 | §1.6 |
| 评估的 5 个作用 | 不确定性/选型/回归/边界/承诺 | §1.3 |
| 基准生命周期 | 提出→爬升→饱和→失效→替代 | §1.2 |
| 能力 vs 回归评估 | 爬坡的坡 / 必须接近 100% 的底线 | §1.3 |
| Goodhart 定律 | 指标成为目标后就失真 | §1.5 |
| 数据污染 | 训练数据包含测试题 | §1.9 |

## 1.12 五个常见错误

1. **把基准当评估**——基准是题库，评估是"跑分动作 + 报告"，两者不是一回事。
2. **只看分数不看指标定义**——accuracy 80% 可能是闭卷四选一的 80%（随机基线 25%），先问怎么判的分。
3. **忽略样本量**——100 题里 80 分的置信区间约 ±8%，小样本评估不可靠。
4. **凭一次分数选模型**——至少跑 3 个维度交叉看，单榜第一可能只是单点优化。
5. **把榜单当真**——训练数据可能已包含测试题，看到暴增先查污染与出处层级。

## 1.13 延伸阅读

⭐⭐⭐
- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — "评估是瓶颈"原文出处
- [Stanford HELM](https://arxiv.org/abs/2211.09110) — 多维度评估方法论开山
- [GSM1k (Scale AI)](https://arxiv.org/abs/2405.00332) — 反刷榜对照实验

⭐⭐
- [GLUE 论文](https://arxiv.org/abs/1804.07461) — 统一基准的起点
- [Judging LLM-as-a-Judge](https://arxiv.org/abs/2306.05685) — Chatbot Arena 与 LLM 裁判

⭐
- [基准饱和分析](https://mbrenndoerfer.com/writing/benchmark-saturation-ai-evaluation-metrics) — GLUE 生命周期梳理
