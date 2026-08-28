# 国内外头部模型官方发布博客中的评测体系全景调研

> 调研方式：逐家抓取官方发布博客 / 技术报告原文（2026-08-28 抓取），所有分数均标注来源 URL。抓取失败或分数只存在于图片中的位置均明确标注，未做记忆补写。
> 证据等级约定：【正文】= 抓取到的页面正文文字直接含该数字；【图表】= 官方页面确认使用该评测、但分数渲染在图片中未抓到数值；【转述】= 来自搜索结果片段或第三方页面，未抓取到官方原文。

---

# 第一部分：逐厂商发布清单与锚点策略

## 1. OpenAI

### 1.1 Hello GPT-4o（2024-05-13）
链接：https://openai.com/index/hello-gpt-4o/ （已抓取）

**该次发布引用的评测清单**：

| 评测 | 分数/结果 | 对比锚点 |
| --- | --- | --- |
| 传统文本/推理/编码基准（未逐一具名） | "GPT-4 Turbo-level performance on text, reasoning, and coding"【正文】 | 自家 GPT-4 Turbo |
| 多语言/音频/视觉基准（未逐一具名） | "setting new high watermarks"【正文】 | GPT-4 Turbo |
| 分词压缩率（20 种语言实测） | 中文 34→24 token（1.4x）；Gujarati 4.4x；泰米尔 3.3x 等【正文】 | GPT-4 Turbo tokenizer |
| Preparedness Framework 风险记分卡 | Cyber/CBRN/Autonomy 低风险；Persuasion 中风险（缓解前后均 Medium）【正文】 | 自家 Preparedness 框架分级 |
| 70+ 外部专家红队 | 定性结论【正文】 | — |

**锚点策略分析**：GPT-4o 发布刻意回避了具名学术榜单的数字对抗，把比较维度转向"自家代际对比 + 分词效率 + 延迟 + 价格"。真正需要对外证明的是多模态融合的"不损失文本智能"，因此锚点是 GPT-4 Turbo 而非 GPT-4 系之外的任何竞品。安全部分首次把 Preparedness 记分卡作为发布标配，成为后来 o 系列与 o3/o4-mini 发布文的固定动作。

### 1.2 Learning to reason with LLMs（o1，2024-09-12）
链接：https://openai.com/index/learning-to-reason-with-llms/ （已抓取；正文渲染出的主要是 AIME 解题示例与叙述，基准对比表以图表形式存在，数值未在抓取文本中出现）

**该次发布引用的评测清单**（评测名经页面结构与其他抓取源交叉确认）：

| 评测 | 分数 | 对比锚点 |
| --- | --- | --- |
| AIME 2024 | o1 74.4%（cons@64 83.3%）【图表，未抓到数值】；GPT-4o 9.3%（该 9.3% 数值已被 Grok 3 官方表与 DeepSeek-R1 论文表独立交叉验证） | GPT-4o、o1-mini |
| Codeforces | o1 62% Elo 对应 89th percentile【图表】；89th percentile 一说另见第三方转述（Walturn 文章） | GPT-4o |
| GPQA Diamond | o1 77.3%（DeepSeek-R1 论文表中 OpenAI-o1-0912 为 75.7%，属 0912 版本口径） | GPT-4o |
| MATH / MATH-500 | 数值在图表中 | GPT-4o、o1-mini |
| MMMU | 数值在图表中（多模态） | — |
| 人机对比评估 | 数值在图表中 | — |

**锚点策略分析**：o1 发布把"推理模型"变成新品类，锚点全部是自家 GPT-4o / o1-mini 的"非思考模式"对照。pass@1 与 cons@64 双口径并报（详见第二部分 AIME 节），这一报法成为后来 R1、Grok 3、MiMo 等几乎所有推理模型发布的事实标准。

### 1.3 Introducing OpenAI o3 and o4-mini（2025-04-16）
链接：https://openai.com/index/introducing-o3-and-o4-mini/ （已抓取，脚注信息量极大）

**该次发布引用的评测清单**：

| 评测 | 分数/协议 | 锚点 |
| --- | --- | --- |
| Codeforces | "new SOTA"【正文】 | 前代 o 系 |
| SWE-bench（Verified） | "SOTA, without building a custom model-specific scaffold"【正文】；协议：固定 n=477 子集、256k 上下文（o4-mini +3%、o3 <1% 影响）、排除 23 个内部环境不可运行样本【正文脚注】 | o1、o3-mini |
| MMMU | SOTA【正文】 | — |
| AIME 2024 / 2025 | o4-mini 为"best-performing benchmarked model"【正文】；带 Python 解释器时 o4-mini 99.5% pass@1 / 100% cons@8，o3 98.4% pass@1 / 100% cons@8（并明确注明"不应与无工具模型比较"）【正文】 | o1、o3-mini |
| τ-bench | 5 次平均、无自定义工具；标注柱用 GPT-4.1 做用户模型【正文脚注】 | o1、o3-mini |
| 专家盲评（编程/咨询/创意） | o3 比 o1 少 20% 重大错误【正文】 | o1 |
| Charxiv-r、MathVista | 2025-04-16 因 system prompt 变更做了结果更正【正文更新记录】 | — |
| SWE-Lancer | 2025-07-17 更新数据与协议说明【正文更新记录】 | — |
| HLE（含浏览工具场景的反作弊协议） | 脚注定义"作弊行为"= 访问含该题标准答案的页面；缓解：屏蔽历史作弊域名 + 用推理模型监控器逐 token 审查，可疑即判错【正文脚注】 | — |
| FrontierMath | 2024-12-20 o3 预告时宣称 >25%（Mark Chen 直播："市场上其他产品不足 2%，我们在激进测试时计算设置下超过 25%"）【转述：IT之家/新浪聚合，含 Epoch 独立复测约 10%、o1 约 2% 的对照】 | 所有其他模型 |

**锚点策略分析**：o3/o4-mini 的锚点已从"友商横向表"转向"自家上一代 + 工具开/关两个世界"。这是第一次有厂商在发布文脚注里系统性地写清楚 SWE-bench 子集裁剪、τ-bench 用户模型替换、浏览式评测的反作弊监控——这份"协议透明度"本身成为同类发布文里少见的正面样本。FrontierMath 的 >25% 则是反例：与 Epoch AI 独立复测（约 10%）存在数倍差距，且随后曝出 OpenAI 资助该基准并拥有大部分题目访问权的利益冲突（见第二部分 FrontierMath 节）。

## 2. Anthropic

### 2.1 Introducing Claude 3.5 Sonnet（2024-06-20）
链接：https://www.anthropic.com/news/claude-3-5-sonnet （已抓取）

| 评测 | 分数/结果 | 锚点 |
| --- | --- | --- |
| GPQA（研究生级推理） | 提及为"sets new industry benchmarks"，数值在图【图表】 | 竞品模型 + Claude 3 Opus |
| MMLU（本科知识） | 同上【图表】 | 同上 |
| HumanEval（编码） | 同上【图表】 | 同上 |
| 内部 agentic coding 评测 | 64% vs Claude 3 Opus 38%【正文】；任务定义为"修复开源代码库 bug 或按自然语言描述添加功能" | 自家 Claude 3 Opus |
| 视觉基准 | 超越 Claude 3 Opus【正文】 | 自家 |
| 安全 | ASL-2；UK AISI 预部署测试【正文】 | 自家 RSP |

**锚点策略**：正文只给数字的地方是内部 agentic coding（64% vs 38%），具名榜单（GPQA/MMLU/HumanEval）全部交给图表并强调"击败竞品与自家 Opus"。此时 Anthropic 的差异化主张是"mid-tier 速度成本 + Opus 级智能"，所以锚点刻意选了自家上一代旗舰。

### 2.2 Introducing Claude 3.7 Sonnet and Claude Code（2025-02-24）
链接：https://www.anthropic.com/news/claude-3-7-sonnet （已抓取）

| 评测 | 分数/结果 | 锚点 |
| --- | --- | --- |
| SWE-bench Verified | "state-of-the-art"【正文】；标准/带脚手架双口径数值在图【图表】 | 全部已发布模型 |
| TAU-bench | "state-of-the-art"，含脚手架说明【正文】 | 同上 |
| 综合基准表（指令遵循/推理/多模态/agentic coding） | 图表【图表】 | 竞品推理模型 |
| Pokémon 游戏实测 | "outperformed all previous models"【正文】 | 自家 |
| 不必要拒绝率 | 相比前代降低 45%【正文】 | Claude 3.5 Sonnet |

**锚点策略**：这是厂商发布史上第一次把"真实世界任务优先于竞赛题"写成明文策略——原文直言"we've optimized somewhat less for math and computer science competition problems, and instead shifted focus towards real-world tasks"。因此该次发布不报 AIME/GPQA 数字，用 SWE-bench Verified + τ-bench + 客户证言（Cursor、Cognition、Vercel、Replit、Canva）替代竞赛榜。

### 2.3 Introducing Claude 4（2025-05-22）
链接：https://www.anthropic.com/news/claude-4 （已抓取）

| 评测 | 分数 | 锚点 |
| --- | --- | --- |
| SWE-bench | Opus 4 72.5%（Sonnet 4 72.7%）【正文】；并列出脚手架附录 | "world's best coding model" 语境下的全行业 |
| Terminal-bench | Opus 4 43.2%【正文】 | 全行业 |
| 抄近路（shortcut/loophole）行为率 | 比 Sonnet 3.7 低 65%【正文】 | 自家前代 |
| 客户工程实测 | Rakuten 7 小时独立开源重构、iGent 多特性应用开发、导航错误 20%→近 0【正文】 | 前代模型 |
| 长任务能力 | "连续工作数小时、数千步"【正文】 | 所有 Sonnet |

**锚点策略**：Claude 4 是 SWE-bench + Terminal-bench 双代码工程榜第一次在头部厂商旗舰发布文中并列出现（Terminal-bench 见第二部分专节）。数字锚点全部是真实工程任务，传统知识/数学榜在该文中完全缺席——与其"虚拟协作者"叙事一致。

## 3. Google

### 3.1 Our next-generation model: Gemini 1.5（2024-02-15）
链接：https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/ （已抓取）

| 评测 | 分数/结果 | 锚点 |
| --- | --- | --- |
| 开发期基准面板（文本/代码/图像/音频/视频） | "outperforms 1.0 Pro on 87% of the benchmarks"，与 1.0 Ultra 相当【正文】 | 自家 1.0 Pro / 1.0 Ultra |
| NIAH（大海捞针） | 至 100 万 token 检索成功率 99%【正文】；技术报告口径 53 万 token 100%、100 万 token 99.7%、1000 万 token 99.2%【转述】 | GPT-4 Turbo（后者 128k 上限后急剧下降） |
| MTOB（Kalamang 语学习翻译） | "与从同样手册学习的人类相当"【正文】 | 人类学习基线 |

**锚点策略**：Gemini 1.5 的发布核心是上下文长度，所以评测组合围绕 NIAH 与 in-context learning 展开，常规知识榜只以"面板百分比"形式出现。这是 NIAH 作为营销武器的最早旗舰级使用（见第二部分长上下文节）。

### 3.2 Gemini 2.5: Our most intelligent AI model（2025-03-25，3 月 26 日更新 MRCR）
链接：https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/ （已抓取）

| 评测 | 分数/结果 | 锚点 |
| --- | --- | --- |
| LMArena（人类偏好） | "debuts at #1 by a significant margin"【正文】 | 全榜 |
| GPQA | 领先（无 majority voting 前提）【正文】；数值在图【图表】 | OpenAI GPT-4.5、Claude 3.7 Sonnet |
| AIME 2025 | 领先（无 majority voting）【正文】；数值在图 | 同上 |
| Humanity's Last Exam | 18.8%（无工具）【正文】 | "across models" |
| SWE-bench Verified | 63.8%（custom agent setup）【正文】 | 行业标准 |
| MRCR（多轮共指消解） | 3 月 26 日补充评测【正文】 | 自家前代 |

**锚点策略**：Gemini 2.5 Pro 用"双榜逻辑"：偏好榜（LMArena #1）证明风格与产品体验，能力榜（GPQA/AIME/HLE）证明思考能力，且反复强调"不用 majority voting 等增加成本的测试时技术"——这是针对 OpenAI cons@64 报法的直接差异化攻击。HLE 18.8% 是该基准首次进入 Google 旗舰发布正文。

## 4. xAI

### 4.1 Grok 3 Beta（2025-02-19）
链接：https://x.ai/news/grok-3 （已抓取，含完整文本基准表）

| 评测 | Grok 3 Beta | Grok 3 mini | Gemini 2.0 | DeepSeek-V3 | GPT-4o | Claude 3.5 Sonnet |
| --- | --- | --- | --- | --- | --- | --- |
| AIME'24 | 52.2% | 39.7% | — | 39.2% | 9.3% | 16.0% |
| GPQA | 75.4% | 66.2% | 64.7% | 59.1% | 53.6% | 65.0% |
| LiveCodeBench（2024-10-01~2025-02-01 窗口） | 57.0% | 41.5% | 36.0% | 33.1% | 32.3% | 40.2% |
| MMLU-Pro | 79.9% | 78.9% | 79.1% | 75.9% | 72.6% | 78.0% |
| LOFT (128k，长上下文 RAG) | 83.3% | 83.1% | 75.6% | — | 78.0% | 69.9% |
| SimpleQA | 43.6% | 21.7% | 44.3% | 24.9% | 38.2% | 28.4% |
| MMMU | 73.2% | 69.4% | 72.7% | — | 69.1% | 70.4% |
| EgoSchema（视频理解） | 74.5% | 74.3% | 71.9% | — | 72.2% | — |

推理模式另报：AIME 2025（发布前 7 天才开赛，强调抗污染）cons@64 93.3%；GPQA 84.6%；LCB 79.4%；mini 版 AIME 2024 95.8%、LCB 80.4%。Chatbot Arena Elo 1402（代号 chocolate 上榜）。全部【正文】。

**锚点策略**：Grok 3 是唯一一家在发布正文同时放出六模型完整横向表的新旗舰。锚点选择有讲究：对比 Gemini 2.0 而非 2.5、Claude 3.5 Sonnet 而非 3.7——都是上一代，保证"全面领先"的叙事成立；同时用"发布前 7 天的 AIME 2025"做抗污染声明。SimpleQA 上 Gemini 2.0 44.3% 高于自家 43.6%，仍照登，属于少见的如实呈现。

### 4.2 Grok 4（2025-07-09）
链接：https://x.ai/news/grok-4 （已抓取）

| 评测 | 分数 | 锚点 |
| --- | --- | --- |
| Humanity's Last Exam（Full set 2025-04-03 版，带 Python+联网工具） | 首个 50%；Grok 4 Heavy 50.7%（text-only 子集）【正文】 | 全行业 |
| ARC-AGI-2 | 15.9%（"closed 模型新 SOTA，接近 Opus 8.6% 的两倍"）【正文】 | Claude Opus 4 |
| Vending-Bench | 净资产 $4694.15、售出 4569 单（5 次运行平均）vs Claude Opus 4 $2077.41/1412 单 vs 人类 $844.05/344 单【正文】 | Opus 4、人类 |
| USAMO 2025（奥数证明） | Grok 4 Heavy 61.9%【正文】 | — |
| HMMT 2025、LiveCodeBench（1-5 月） | 图表【图表】 | — |

**锚点策略**：Grok 4 的组合拳是"新基准首发"（HLE、ARC-AGI-2、Vending-Bench、USAMO 都是此前没有成熟分数史的评测），让锚点变成"我是第一个把这条曲线画出来的人"。USAMO 选证明题而非 AIME，是对"AIME 已饱和"共识的回应。

## 5. DeepSeek

### 5.1 DeepSeek-V3（2024-12-26）
官方发布页（api-docs.news）已改版无法回溯原表；以下数字取自 DeepSeek-R1 技术报告表 4 的 V3 列（arXiv:2501.12948，已抓取）与 Grok 3 官方表交叉验证：MMLU 88.5、MMLU-Pro 75.9、GPQA Diamond 59.1、SimpleQA 24.9、LiveCodeBench 36.2、SWE Verified 42.0、AIME 2024 39.2、MATH-500 90.2、C-Eval 86.5、CLUEWSC 90.9、C-SimpleQA 68.0、Codeforces 1134 rating。

### 5.2 DeepSeek-R1（2025-01-20）
链接：https://arxiv.org/html/2501.12948v1 （技术报告已抓取，含协议全文）

**主表（R1 与基线）**【正文】：

| 类别 | 评测 | Claude-3.5-Sonnet-1022 | GPT-4o-0513 | DeepSeek-V3 | o1-mini | o1-1217 | DeepSeek-R1 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 知识 | MMLU | 88.3 | 87.2 | 88.5 | 85.2 | 91.8 | 90.8 |
| | MMLU-Redux | 88.9 | 88.0 | 89.1 | 86.7 | — | 92.9 |
| | MMLU-Pro | 78.0 | 72.6 | 75.9 | 80.3 | — | 84.0 |
| | DROP | 88.3 | 83.7 | 91.6 | 83.9 | 90.2 | 92.2 |
| | GPQA Diamond | 65.0 | 49.9 | 59.1 | 60.0 | 75.7 | 71.5 |
| | SimpleQA | 28.4 | 38.2 | 24.9 | 7.0 | 47.0 | 30.1 |
| | FRAMES | 72.5 | 80.5 | 73.3 | 76.9 | — | 82.5 |
| 偏好 | AlpacaEval2.0 LC 胜率 | 52.0 | 51.1 | 70.0 | 57.8 | — | 87.6 |
| | ArenaHard | 85.2 | 80.4 | 85.5 | 92.0 | — | 92.3 |
| 代码 | LiveCodeBench（CoT） | 38.9 | 32.9 | 36.2 | 53.8 | 63.4 | 65.9 |
| | Codeforces（百分位/rating） | 20.3/717 | 23.6/759 | 58.7/1134 | 93.4/1820 | 96.6/2061 | 96.3/2029 |
| | SWE Verified | 50.8 | 38.8 | 42.0 | 41.6 | 48.9 | 49.2 |
| | Aider-Polyglot | 45.3 | 16.0 | 49.6 | 32.9 | 61.7 | 53.3 |
| 数学 | AIME 2024 | 16.0 | 9.3 | 39.2 | 63.6 | 79.2 | 79.8 |
| | MATH-500 | 78.3 | 74.6 | 90.2 | 90.0 | 96.4 | 97.3 |
| | CNMO 2024（中文奥数） | 13.1 | 10.8 | 43.2 | 67.6 | — | 78.8 |
| 中文 | CLUEWSC | 85.4 | 87.9 | 90.9 | 89.9 | — | 92.8 |
| | C-Eval | 76.7 | 76.0 | 86.5 | 68.9 | — | 91.8 |
| | C-SimpleQA | 55.4 | 58.7 | 68.0 | 40.3 | — | 63.7 |

**评测协议（正文原文要点）**：温度 0.6、top-p 0.95，k 取 4~64，pass@1 用无偏估计；AIME 2024 额外报 cons@64；SWE Verified 用 agentless 框架；Aider 用 diff 格式；输出上限 32768 token；o1-1217 因大陆无法直接调用 API，采用官方报告口径【正文】。

**R1-Zero 曲线**：AIME 2024 pass@1 从 15.6% 升至 71.0%，cons@64 达 86.7%，称超过 o1-0912【正文】。蒸馏模型：Distill-Qwen-32B AIME 72.6%、MATH-500 94.3%、LCB 57.2%【正文】。

**锚点策略**：R1 的锚点中心是 OpenAI-o1-1217（直接对标"性能对齐 o1"），同时诚实标出知识榜（MMLU 90.8 vs 91.8）与 SimpleQA（30.1 vs 47.0）上的落后；并主动披露 C-SimpleQA 因安全 RL 导致拒答下降、无安全 RL 可达 70%+。这是全行业罕见地在发布报告里解释自己分数下降原因的案例。

## 6. 阿里 Qwen

### 6.1 Qwen2.5: A Party of Foundation Models（2024-09-19）
链接：https://qwenlm.github.io/blog/qwen2.5/ （已抓取）

| 评测 | 分数/结果 | 锚点 |
| --- | --- | --- |
| MMLU | "85+"【正文】 | Llama-3.1-70B、Mistral-Large-V2（图表） |
| HumanEval | "85+"【正文】 | 同上 |
| MATH | "80+"【正文】 | 同上 |
| Qwen-Plus 综合对比 | "显著超过 DeepSeek-V2.5，与 Llama-3.1-405B 有竞争力，部分方面仍逊于 GPT-4o 与 Claude-3.5-Sonnet"【正文】 | GPT4-o、Claude-3.5-Sonnet、Llama-3.1-405B、DeepSeek-V2.5 |
| 知识密度趋势（MMLU>65 的模型参数量） | 3B 级即可达标【正文】 | 历代小模型 |

**锚点策略**：罕见地写明"underperforming compared to GPT4-o and Claude-3.5-Sonnet in some aspects"——在国产厂商发布文中属于少见的让步式表述，用诚实换取可信度，同时把比较单位从"旗舰 vs 旗舰"调整为"开源权重可用最优 vs 闭源"。

### 6.2 QwQ-32B: Embracing the Power of Reinforcement Learning（2025-03-06）
链接：https://qwenlm.github.io/blog/qwq-32b/ （已抓取）

| 评测 | 结果 | 锚点 |
| --- | --- | --- |
| AIME 24 / AIME 25 / LiveCodeBench / IFEval / BFCL | 与 DeepSeek-R1 相当；数值在图【图表】 | DeepSeek-R1（671B/37B 激活）、R1-Distill-Qwen-32B、R1-Distill-Llama-70B、o1-mini |
| 叙事主张 | "32B 达到 671B R1 的可比性能，凸显 RL 对强基座的有效性"【正文】 | 参数规模 |

**锚点策略**：核心锚点不是分数而是"参数效率"——用 32B 对标 671B。评测组合（IFEval、BFCL）里出现了 agent/工具维度，为后续 Qwen3 的 agentic 路线埋线。

## 7. 智谱 GLM

### 7.1 GLM-4.5（2025-07-28 发布）
来源：HuggingFace 模型卡 https://huggingface.co/zai-org/GLM-4.5 与 GitHub 仓库 https://github.com/zai-org/GLM-4.5 （均已抓取）

| 评测 | 分数/结果 | 锚点 |
| --- | --- | --- |
| 12 项行业标准基准综合分 | GLM-4.5 63.2（全部开源+闭源模型中第 3）；GLM-4.5-Air 59.8【正文】 | 专有与开源全体模型 |

**锚点策略**：智谱采用"自选 12 项基准加权合成一个总分、报排名不报全表"的打法。合成总分的好处是营销传播友好，代价是外部无法复核各子项权重——这是阅读国产厂商发布材料时需要额外小心的口径。

### 7.2 GLM-4.7（发布信息见同一仓库 README，已抓取）

| 评测 | 分数 | 相对提升 |
| --- | --- | --- |
| SWE-bench | 73.8% | +5.8 |
| SWE-bench Multilingual | 66.7% | +12.9 |
| Terminal Bench 2.0 | 41% | +16.5 |
| HLE | 42.8% | +12.4 |
| τ²-Bench、BrowseComp | 显著提升（数值未给） | — |

**锚点策略**：GLM-4.7 的锚点全部是自家 GLM-4.6/4.5，且主战场完全切换为 agentic coding（SWE + Terminal + τ² + BrowseComp）。值得注意的是 Terminal-bench 2.0 Verified 一度由智谱（Z.ai）维护衍生版本，Terminal-Bench 官网明示 2.1 版本"inspired by Z.ai's Terminal-Bench 2.0 Verified"——厂商深度参与评测基础设施是这一时期的显著现象。

## 8. 月之暗面 Kimi

### 8.1 Kimi k1.5: Scaling Reinforcement Learning with LLMs（2025-01）
链接：https://arxiv.org/html/2501.12599v1 （已抓取）

| 评测 | 分数 | 锚点 |
| --- | --- | --- |
| AIME | long-CoT 77.5；long2short 60.8【正文】 | OpenAI o1 |
| MATH-500 | 96.2 / 94.6【正文】 | o1 |
| Codeforces | 94th percentile【正文】 | o1 |
| MathVista | 74.9【正文】 | o1 |
| LiveCodeBench | short-CoT 47.3（"超 GPT-4o/Claude 3.5 幅度最高 +550%"）【正文】 | GPT-4o、Claude 3.5 Sonnet |

**锚点策略**：k1.5 的贡献是"long2short"协议——把长思维链技术蒸馏到短 CoT 模型再报分，锚点变成"同等思考预算下"。+550% 这类相对值表述后来被广泛诟病为营销话术（基数极小时相对值夸张）。

### 8.2 Kimi K2: Open Agentic Intelligence（2025-07-11）
官方发布页 https://moonshotai.github.io/Kimi-K2/ （JS 渲染，仅抓到标题与摘要）；技术报告 https://arxiv.org/html/2507.20534v1 （已抓取）

| 评测 | 分数 | 锚点 |
| --- | --- | --- |
| Tau2-Bench | 66.1【正文】 | 非 thinking 模型全体 |
| ACEBench (En) | 76.5【正文】 | 同上 |
| SWE-bench Verified | 65.8【正文】 | 同上 |
| SWE-bench Multilingual | 47.3（"Claude 4 Opus 成本过高，多语言版只评了 Sonnet"）【正文脚注】 | Claude 4 Sonnet |
| LiveCodeBench v6 | 53.7【正文】 | 同上 |
| OJBench | 27.1【正文】 | 同上 |
| AIME 2025 | 49.5【正文】 | 同上 |
| GPQA-Diamond | 75.1【正文】 | 同上 |
| LMSYS Arena | 开源第 1、总榜第 5（2025-07-17，3000+ 票）【正文】 | 全榜 |

**锚点策略**：K2 的锚点圈定为"非思考（non-thinking）模式"——所有对比都限定在不开长思维链的设定下，用"非思考 SOTA"避开与 R1/o3 全力思考模式的正面比较，同时把 agentic（Tau2/ACEBench/SWE 双榜）作为新差异化主张。脚注里"Opus 太贵没评"是成本约束导致锚点不全的诚实披露。

## 9. MiniMax

### 9.1 MiniMax-M1（2025-06）
链接：https://arxiv.org/html/2506.13585v1 （已抓取，含完整协议）

**主表（M1-80k，对比表含 OpenAI-o3、Gemini 2.5 Pro 06-05、Claude 4 Opus、Seed-Thinking-v1.5、DeepSeek-R1、R1-0528、Qwen3-235B-A22B）**【正文】：AIME 2024 86.0 / AIME 2025 76.9 / MATH-500 96.8 / LiveCodeBench（24/8~25/5）65.0 / FullStackBench 68.3 / GPQA Diamond 70.0 / HLE（无工具，text-only）8.4 / ZebraLogic 86.8 / MMLU-Pro 81.1 / SWE-bench Verified 56.0 / OpenAI-MRCR 128k 73.4、1M 56.2 / LongBench-v2 61.5 / τ-bench airline 62.0、retail 63.5 / SimpleQA 18.5 / MultiChallenge 44.7。

**协议**：温度 1.0、top-p 0.95；AIME 与 GPQA 采 32 次采样平均；LCB/FullStackBench 报 16 样本平均；SWE-bench 用 Agentless 脚手架并自行改进两阶段定位；τ-bench 用 GPT-4.1 作用户模型、40 步上限、通用系统提示【正文】。

**锚点策略**：M1 的表同时收录闭源三巨头 + 国产三家共 7 个模型，是国产厂商发布中最"全景"的一张表；但 HLE、SimpleQA 上如实呈现大幅落后（8.4 vs o3 的 20.3；18.5 vs o3 的 49.4），以长上下文（MRCR 128k 73.4 反超 Gemini）作为核心差异化。公开完整协议（采样次数、用户模型、步数上限）是这份报告的可信度来源。

## 10. 字节跳动（豆包 / Seed）

### 10.1 Doubao-1.5-pro（2025-01-22）
来源：字节 Seed 官方页 https://seed.bytedance.com/en/special/doubao_1_5_pro （搜索命中并抓取摘要）

| 评测 | 结果 | 锚点 |
| --- | --- | --- |
| MMLU-Pro、GPQA、DROP、McEval、FullStackBench、CMMLU、C-Eval | 多项"全球领先"【正文（官方页）】 | GPT-4o-0806、Llama3.1-405B、Claude 3.5 Sonnet |
| 预训练对照 | MoE 激活参数为稠密 1/7 时反超（"7 倍性能杠杆"），对照同为 9T token 的自家稠密模型与 15T token 的 Llama3.1-405B【正文】 | 自家稠密对照 + Llama |
| 推理模型预告 | Doubao-1.5-Pro-AS1-Preview "AIME 业内领先"【正文】 | — |
| 披露口径 | "其它模型的评测指标来自官方评测结果，官方评测结果中不含的部分来自内部评测平台结果"【正文】 | — |

**锚点策略**：明确声明"未使用任何其他模型生成的数据"（不蒸馏），评测组合中文榜（CMMLU/C-Eval）与多语言编程榜（McEval）并重。最后一条披露口径非常重要：承认部分对比分数出自内部评测平台而非官方原始来源，这是读国产厂商分数表时最常见的灰区。

### 10.2 Seed-Thinking-v1.5（2025-04-10）
链接：https://arxiv.org/html/2504.13914v2 （已抓取）

| 评测 | 分数 | 锚点 |
| --- | --- | --- |
| AIME 2024 | 86.7（"与 o3-mini-high 持平"）【正文】 | o3-mini-high、o1、R1 |
| AIME 2025 | 74.0【正文】 | 同上 |
| Codeforces（自建集） | pass@8 55.0（取最近 12 场 contest）【正文】 | R1、o3（有差距，如实标注） |
| GPQA | 77.3【正文】 | o3-mini-high |
| BeyondAIME（自建） | 超 o1/R1、逊 o3 与 Gemini 2.5 Pro【正文】 | 上述全部 |
| ARC-AGI | 逻辑类 RL 数据显著提升【正文】 | — |
| 人类偏好 | 非推理任务正反馈比 R1 高 8.0%【正文】 | R1 |

**锚点策略**：这篇报告最重要的贡献是对评测方法论的自我批判：明确写"两次运行分差可达 10 分"、AIME 每年 30 题高方差不足以区分顶级模型、Elo 是估计值不可直接比较——并因此自建 BeyondAIME 与 Codeforces pass@k 协议。用"指出旧基准缺陷 + 自建新基准"替代单纯刷分，是 2025 年厂商评测叙事的转折样本。

## 11. 腾讯混元

### 11.1 混元 T1 正式版（2025-03-21）
官方发布渠道为微信公众号与腾讯云上线公告；本次未能抓取到含基准数值表的官方原文（社区/媒体页面被搜索命中，数值未经官方原文验证）。

- 已确认【转述】：采用 Hybrid-Mamba-Transformer 架构，主打首字秒回与 80 token/s 吐字；定位为大规模 RL 强推理模型，强调数学、逻辑、科学、代码。混元 TurboS 曾在 LMSYS Chatbot Arena 取得名次（转述自百度百科词条与机器之心报道，未验证原始分数）。
- 结论标注：混元 T1 的具体评测清单与分数 = **未抓取到（媒体常见报道为 MMLU-Pro、GPQA-Diamond、AIME 等表，数值未验证）**。

**锚点策略（基于可确认信息）**：混元系的叙事重心在架构效率（Mamba）与中文产品体验，评测营销以第三方 Arena 榜为主，未形成类似 DeepSeek/MiniMax 的完整自建表——2025 年 12 月腾讯重组混元团队后公开转向"从过度关注外部榜单转向以产品用户体验为核心指标"，等于官方承认了此前的榜单依赖（转述自百度百科混元词条）。

## 12. 阶跃星辰（Step）

### 12.1 Step-2（万亿参数 MoE）
未抓取到官方自建基准发布文；其成绩全部来自第三方 LiveBench 榜单（livebench.ai），经由国内媒体广泛转载【转述】：

| 评测 | 结果 | 锚点 |
| --- | --- | --- |
| LiveBench 综合 | step-2-16k-202411 全球第五、国产第一、前十唯一中国模型；逼近 o1-mini，超 gpt-4o-2024-08-06 与 gemini-1.5-pro-002 | o1-preview、Claude 3.5 Sonnet、GPT-4o、Gemini 1.5 Pro |
| LiveBench IF Average（指令跟随） | 86.57 全榜第一；对比 gemini-1.5-flash-002 84.55、llama-3.1-70b-instruct 79.08、o1-preview 77.72 | 全榜 |

**锚点策略**：阶跃是国内"以第三方防污染榜单为官方营销主战场"的典型——LiveBench 每月换题、客观真值、无 LLM 裁判的机制被直接用作可信度背书。代价是厂商无法控制评测组合，也不发布自建表；这种"借榜发声"与 DeepSeek 的"自建协议"形成两种路线的鲜明对照。

## 13. 小米

### 13.1 Xiaomi MiMo-7B（2025-04-30）
官方博客 mimo.xiaomi.com 未能直接抓取；技术报告 https://arxiv.org/html/2505.07608v2 （已抓取，含完整表）

**主表（MiMo-7B-RL）**【正文】：

| 评测 | GPT-4o-0513 | Claude-3.5-Sonnet-1022 | o1-mini | QwQ-32B-Preview | R1-Distill-Qwen-14B | R1-Distill-Qwen-7B | MiMo-7B-RL |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GPQA Diamond | 49.9 | 65.0 | 60.0 | 54.5 | 59.1 | 49.1 | 54.4 |
| SuperGPQA | 42.4 | 48.2 | 45.2 | 43.6 | 40.6 | 28.9 | 40.5 |
| MMLU-Pro | 72.6 | 78.0 | 80.3 | 52.0 | 68.8 | 53.5 | 58.6 |
| MATH-500 | 74.6 | 78.3 | 90.0 | 90.6 | 93.9 | 92.8 | 95.8 |
| AIME 2024 | 9.3 | 16.0 | 63.6 | 50.0 | 69.7 | 55.5 | 68.2 |
| AIME 2025 | 11.6 | 7.4 | 50.7 | 32.4 | 48.2 | 38.8 | 55.4 |
| LiveCodeBench v5 | 32.9 | 38.9 | 53.8 | 41.9 | 53.1 | 37.6 | 57.8 |
| LiveCodeBench v6 | 30.9 | 37.2 | 46.8 | 39.1 | 31.9 | 23.9 | 49.3 |

**锚点策略**：以小博大的标准打法——7B 对标 o1-mini 与 32B 蒸馏模型，并把 LiveCodeBench 拆成 v5/v6 两个窗口证明"不是只在旧题上强"。SuperGPQA 与 OJBench 这类中文社区新基准进入表格，反映国产厂商在评测供给侧的参与度上升。

---

# 第二部分：按类型深度拆解

## A. 知识类

### MMLU（Massive Multitask Language Understanding）
- **测什么**：57 个学科的四选一选择题，从高中到专业级，测"广度知识 + 少量推理"。
- **数据构建**：源自 GRE/USMLE/执业考试等公开题库的人工收集，约 1.4 万题。
- **评分协议**：选项准确率；few-shot（原论文 5-shot）与 0-shot/CoT 口径混用是最大协议噪声源。
- **厂商采用记录**：

| 模型 | 发布 | 分数 | 出处 |
| --- | --- | --- | --- |
| DeepSeek-R1 | 2025-01 | 90.8（o1-1217 91.8） | arXiv:2501.12948（已抓取） |
| DeepSeek-V3 | 2024-12 | 88.5 | 同上表 4 |
| Claude 3.5 Sonnet | 2024-06 | 图表（正文点名"undergraduate-level knowledge (MMLU)"） | anthropic.com/news/claude-3-5-sonnet |
| Qwen2.5-72B | 2024-09 | "85+" | qwenlm.github.io/blog/qwen2.5/ |
| GPT-4o/Grok 3 等知识榜 | — | 均含 MMLU-Pro 而渐弃 MMLU | x.ai/news/grok-3 |

- **局限与游戏空间**：90% 之后的分数对头部模型已无区分度（饱和）；训练集污染长期无法排除；四选一给了 25% 底线分。这正是 MMLU-Pro 诞生的原因。

### MMLU-Pro
- **测什么**：MMLU 的抗污染升级版：10 选项（底随机线 10%）、减少记忆型琐事题、增加需多步推理的 STEM 题、约 1.2 万题。
- **厂商采用记录**：

| 模型 | 发布 | 分数 | 出处 |
| --- | --- | --- | --- |
| Grok 3 / mini | 2025-02 | 79.9 / 78.9（对比 Gemini 2.0 79.1、DS-V3 75.9、GPT-4o 72.6、Claude 3.5 78.0） | x.ai/news/grok-3【正文表】 |
| DeepSeek-R1 | 2025-01 | 84.0（o1-mini 80.3、Claude3.5 78.0） | arXiv:2501.12948 |
| MiniMax-M1-80k | 2025-06 | 81.1（o3 85.0、Gemini 2.5 86.0、Claude4 Opus 85.0） | arXiv:2506.13585 |
| MiMo-7B-RL | 2025-04 | 58.6 | arXiv:2505.07608 |

- **局限**：仍是选择题，答案可猜测性从 25% 降到 10% 但未消除；推理型模型靠"检查每个选项"的暴力枚举即可显著抬分，与真实知识调用能力的相关性在下降。

## B. 推理与数学类

### AIME 2024/2025（重点：pass@1 vs cons@64 报法差异）
- **测什么**：美国数学邀请赛，每年 30 题、答案为 0-999 整数，客观可自动判分，被推理模型时代选为"抗污染竞赛数学"标准。
- **核心原理与报法差异**：
  - pass@1：单次采样正确率。反映"真实一次做对"的体验。
  - cons@64 / cons@32：采 64（或 32）次取多数投票。反映"模型+测试时计算"的系统上限，成本是数十倍推理量。
  - 两种口径差距巨大且都属于官方数字：DeepSeek-R1-Zero AIME 2024 pass@1 71.0% vs cons@64 86.7%（R1 论文正文）；OpenAI o4-mini 无工具与带 Python 解释器的 AIME 2025 差距为"99.5% pass@1、100% cons@8"（o3 发布文正文，且明示不可与无工具模型比较）；Grok 3 (Think) 用"最高测试时计算 cons@64"报 93.3%（Grok 3 正文）。
  - 阅读规则：任何 AIME 分数若未标注采样协议，默认不可比。DeepSeek、MiniMax（32 次平均）、OpenAI（cons@8/64）、xAI（cons@64）各用各的口径。
- **数据构建与污染**：题目公开多年，2024 及更早版本疑似进入预训练语料。因此 Grok 3 强调"发布前 7 天的 AIME 2025"，Seed-Thinking 直接指出"每年仅 30 题、高方差、不再有区分度"并自建 BeyondAIME（100 道专家新造改编题，且故意让答案不是题面出现的数字以防猜中）。
- **厂商采用记录**：

| 模型 | 发布 | 分数（协议） | 出处 |
| --- | --- | --- | --- |
| OpenAI o1 | 2024-09 | 74.4% pass@1 / 83.3% cons@64【图表】 | openai.com/index/learning-to-reason-with-llms/ |
| DeepSeek-R1 | 2025-01 | 79.8% pass@1（temp 0.6）+ cons@64 | arXiv:2501.12948 |
| Grok 3 (Think) | 2025-02 | AIME'25 cons@64 93.3%；非思考 AIME'24 52.2% | x.ai/news/grok-3 |
| Gemini 2.5 Pro | 2025-03 | AIME 2025 领先（明确声明不用 majority voting） | blog.google（Gemini 2.5 文） |
| Kimi k1.5 | 2025-01 | 77.5（long）/60.8（short） | arXiv:2501.12599 |
| MiMo-7B-RL | 2025-04 | 68.2（AIME'24）/55.4（AIME'25） | arXiv:2505.07608 |
| Seed-Thinking-v1.5 | 2025-04 | 86.7（'24）/74.0（'25） | arXiv:2504.13914 |
| MiniMax-M1-80k | 2025-06 | 86.0（32 次采样平均） | arXiv:2506.13585 |
| OpenAI o4-mini | 2025-04 | 无工具最佳；带 Python 99.5% pass@1 / 100% cons@8 | openai.com/index/introducing-o3-and-o4-mini/ |

### GPQA Diamond
- **测什么**：研究生级"Google-proof"科学问答（物理/化学/生物），Diamond 为专家校验后的 198 题精简子集；即使领域博士在有 Google 的情况下也只能拿到约 65-70%——这是它作为"知识天花板"营销点的由来。
- **核心原理**：题目由领域博士写、博士答、再由另一批博士验证"不用搜索很难答对"，用以压制检索式答题。
- **局限**：仍为选择题；推理模型通过长思考 + 选项排除可以显著超越人类基线，使其逐渐失去"人类对照"意义；Grok 3/Gemini 2.5 报的 84-86% 已属该子集饱和区。
- **游戏空间**：题目虽经"Google-proof"设计，但难以防"题源回溯"——出题人引用过的论文与讲义本身可能进入预训练语料。另一个更隐蔽的问题是"博士基线漂移"：宣传中反复引用的"人类专家约 65-70%"是非专家博士在限时 + 有网络条件下的成绩，与推理模型"无限时 + 全推理"的设定并非同一测量条件，两类数字同框时实际不可比。
- **分数含义**：在 2024 年它测"最稀缺的知识边界"，在 2025 年它更多测"推理系统在知识边界上的利用率"。这也是为什么 xAI 在 Grok 4 发布中不再把 GPQA 当主战场，而转向 HLE 与 ARC-AGI-2。
- **厂商采用记录**（全为【正文】或【正文表】）：DeepSeek-R1 71.5（arXiv:2501.12948）；Grok 3 75.4 / Think 84.6（x.ai/news/grok-3）；Gemini 2.5 Pro 领先（blog.google）；Kimi K2 75.1（arXiv:2507.20534）；MiniMax-M1 70.0（arXiv:2506.13585）；MiMo 54.4（arXiv:2505.07608）；Seed-Thinking 77.3（arXiv:2504.13914）；Grok 3 表中 Claude 3.5 Sonnet 65.0、GPT-4o 53.6。GPQA Diamond 是本次调研中跨厂商出现频次最高的单一评测。

### FrontierMath
- **测什么**：Epoch AI 委托 60 余位数学家出题的研究生研究级数学题，定位"数小时内都难以解决"的前沿数学。
- **核心原理与争议**：完全私有、保留集验证，防污染设计激进。o3 发布（2024-12）宣称 >25%（o1 约 2%，其他模型 <2%）；Epoch 独立复测公开版 o3 约 10%（差异被归因于计算档位与子集版本不同）；随后曝出 OpenAI 资助该基准并拥有大部分题目访问权、贡献数学家未被告知，形成严重的利益冲突事件（【转述】IT之家/新浪聚合页，含 Epoch 方 Tamay Besiroglu 与数学家双方的表态原文）。
- **厂商采用记录**：OpenAI o3 预告（2024-12，直播口径）为唯一厂商发布引用；其余主流厂商发布文均未采用——共同回避正是对独立性与利益冲突担忧的注脚。ARC Prize 基金会亦公开指出公开版 o3 计算档位低于测试版【转述】。

## C. 代码类

### HumanEval
- **测什么**：164 道 Python 函数级手写题，测函数合成。
- **现状**：头部模型已 90%+，深度饱和。Claude 3.5 Sonnet（2024-06）发布时还把它作为三大门面之一（anthropic.com/news/claude-3-5-sonnet 正文点名）；2025 年后的旗舰发布（Claude 4、Grok 3/4、o3、K2、M1）正文均不再报 HumanEval——从"共识门面"到"退场"只用了不到一年。Qwen2.5（2024-09）正文报"HumanEval 85+"是它在旗舰发布中的最后高光之一。

### LiveCodeBench（时间切分防污染）
- **测什么**：持续从 LeetCode/AtCoder/Codeforces 收集新题，按时间窗切分（如 Grok 3 用 2024-10-01~2025-02-01，K2 用 v6，M1 用 2024-08~2025-05），保证测试题晚于模型训练截止。
- **核心原理**：以"发布时间"而非"数据私有"实现防污染，全部题目公开可复核——这是它与 NIAH/FrontierMath 路线的本质区别。
- **局限**：竞赛题分布窄，不能代表工程代码；各家选窗不同导致分数不可直接横比（MiMo 同表报 v5/v6 双窗口正是为了自证这一点）。
- **厂商采用记录**：Grok 3/mini（57.0/41.5，窗口注明，x.ai 正文表）；Grok 4（1-5 月窗口，图表）；DeepSeek-R1 65.9（CoT，2024-08~2025-01 窗口，arXiv:2501.12948）；Kimi K2 v6 53.7、k1.5 short 47.3（arXiv）；MiniMax-M1 65.0（16 样本平均，arXiv:2506.13585）；MiMo v5 57.8 / v6 49.3（arXiv:2505.07608）；QwQ-32B（图，qwenlm.github.io/blog/qwq-32b/）。已被几乎所有推理模型发布采用，是代码竞赛类的实际共识榜。

### SWE-bench Verified（真实 Issue 修复）
- **测什么**：从 12 个真实开源 Python 仓库抓取 GitHub Issue，要求模型产出补丁并通过仓库真实测试用例；Verified 是 OpenAI 联合原作者从 2294 题中人工筛出 500 题的可靠子集。
- **核心原理**：评测的不是"写代码"而是"读懂陌生仓库 + 定位 + 改对 + 通过测试"的工程闭环，测试用例是唯一裁判——客观且贴近真实工作。
- **协议敏感点（本次抓取到的真实证据）**：脚手架（agentless vs 重型 agent）、上下文上限（o3 发布文：256k 使 o4-mini +3%）、子集裁剪（o3 发布文：固定 n=477 并排除 23 个不可运行样本）、是否允许并行多次尝试（Claude 4 的 80.9% 为并行计算口径 vs 单次 72.5%）。同一模型分差可到 8-10 个点，全部合法。
- **厂商采用记录**：

| 模型 | 发布 | 分数 | 出处 |
| --- | --- | --- | --- |
| Claude 3.5 Sonnet | 2024-06 | 内部 agentic coding 64% vs Opus 38%（SWE-bench 前身口径，正文） | anthropic.com |
| Claude 3.7 Sonnet | 2025-02 | SOTA（62.3%/70.3% 双口径【图表】） | anthropic.com/news/claude-3-7-sonnet |
| Claude Opus 4 / Sonnet 4 | 2025-05 | 72.5% / 72.7%【正文】 | anthropic.com/news/claude-4 |
| DeepSeek-R1 | 2025-01 | 49.2（agentless 框架） | arXiv:2501.12948 |
| Gemini 2.5 Pro | 2025-03 | 63.8%（custom agent） | blog.google |
| MiniMax-M1 | 2025-06 | 56.0（自改两阶段定位的 Agentless） | arXiv:2506.13585 |
| Kimi K2 | 2025-07 | 65.8（非 thinking 设定） | arXiv:2507.20534 |
| OpenAI o3 | 2025-04 | SOTA（n=477 协议披露） | openai.com |
| GLM-4.7 | 2025-12 | 73.8%（+5.8） | github.com/zai-org/GLM-4.5 |

- **前端类比**：SWE-bench 之于代码，相当于"真实用户 issue 回归测试"之于前端——不看你能不能从零写组件，只看你敢不敢在别人维护了五年的代码库里动手，且 CI 必须绿。

### Terminal-Bench（终端操作 vs 仓库修复的本质区别）
- **测什么**：在真实容器化终端环境里完成运维/工程任务：编译 Linux 内核并跑 QEMU、给 git 仓库配 web server、从 7z 加密包解出哈希、生成自签 TLS 证书、按约束重切分数据集、训练一个 ≤150MB 且测试集精度 ≥0.62 的 fasttext 模型（任务示例均来自 tbench.ai 首页，已抓取）。
- **与 SWE-bench 的本质区别**：
  1. **环境自由度**：SWE-bench 给定仓库 + 已知测试；Terminal-Bench 给一个空白容器和一个目标，工具链、路径、依赖全部要自己搭建——考察的是"环境工程"而非"仓库理解"。
  2. **任务形态**：SWE-bench 是"修"；Terminal-Bench 是"建/配/运维"，覆盖安全、系统管理、数据工程、模型训练等非纯编码任务。
  3. **评分**：SWE-bench 跑仓库测试；Terminal-Bench 每题自带独立验证脚本，按任务逐题通过率计分。
  4. **能力画像**：一个 Claude 4 同时报两者（72.5% / 43.2%）恰好说明二者低相关——会修 issue 不等于会装环境。
- **数据构建**：任务由研究者与社区共同编写，每题包含 Docker 化环境、自然语言任务描述与独立的自动化验证脚本；官网展示了从编译内核、配置 git 服务器到训练 fasttext 模型的完整任务谱，覆盖软件工程、系统管理、安全、数据科学、机器学习五个标签（tbench.ai 正文）。每题标注难度（medium/hard），并附 canary GUID 用于训练语料排查。
- **评分协议**：任务通过率（task resolution success-rate），即整条任务链的端到端成功率——与 SWE-bench 的"补丁过测试"不同，终端任务的失败可以在任意一步发生（装错依赖、权限不对、文件路径错误），因此分数天然偏低且方差大；leaderboard 按"agent 框架 + 模型"双维度记录，同一模型换 agent 得分差异显著。
- **分数含义与局限**：Claude 4 的 43.2% 与 GLM-4.7 的 41% 看似不高，但参考系不同——两个数字来自不同版本（1.0 系 vs 2.0），不可横比。局限在于：环境依赖重（网络、镜像源波动会影响通过率）、验证脚本覆盖不了"用错误方式达到正确结果"的路径、任务池更新快导致跨期不可比。官方为解决跨期问题引入了版本化（1.0/2.0/2.1/3.0 并行维护）与 Verified 衍生（智谱维护的 Terminal-Bench 2.0 Verified 反过来成为官方 2.1 的设计参考），这种厂商与评测方互相嵌入的关系本身就是一个值得持续观察的治理信号。
- **前端类比**：如果 SWE-bench 是"接手一个有 CI 的存量仓库修 bug"，Terminal-Bench 就是"新员工入职第一天：拿到一台裸机和一个需求，自己装环境、自己验证交付"。前端工程里前者像改组件逻辑，后者像从零搭一套本地开发链路（Node 版本、包管理器、证书、代理）——后者的失败模式几乎全部发生在"环境"而不是"算法"。
- **版本生态**：1.0（80 题）→ 2.0（89 题）→ 2.1（受智谱 Terminal-Bench 2.0 Verified 启发）→ 3.0；另有单任务挑战赛与 Terminal-Bench-Science。Stanford × Laude 合作，附 canary GUID 防训练污染（tbench.ai 正文）。
- **厂商采用记录**：Claude Opus 4 43.2%（anthropic.com/news/claude-4 正文，首次旗舰引用）；GLM-4.7 41%（Terminal Bench 2.0，+16.5，github.com/zai-org/GLM-4.5）。OpenAI/Google/DeepSeek/Kimi 旗舰发布正文均未采用。属"少数厂商引用、社区快速起量"的新一代工程评测。

## D. Agent / 环境交互类（设计光谱与盲区）

这一类的光谱：**单轮工具调用（BFCL/ACEBench）→ 规则约束下多轮对话服务（τ-bench）→ 网页操作（WebArena）→ 桌面操作系统（OSWorld）→ 通用开放环境（GAIA/Vending-Bench）**。

### τ-bench / τ²-bench
- **测什么**：模拟客服场景（airline/retail/telecom），模型扮演持有 API 工具与服务政策文档的 agent，与一个由 LLM 扮演的"用户"多轮对话完成任务；同时考察任务完成与政策遵守（pass^k：k 次全对才算过）。
- **协议敏感点（真实抓取证据）**：OpenAI o3 脚注——5 次运行取平均降方差、无自定义工具、柱状图标注项改用 GPT-4.1 当用户模型（因 GPT-4o 指令遵循差导致 rollout 失败率高）；MiniMax-M1 协议——GPT-4.1 用户模型、40 步上限、通用系统提示。用户模型选择能系统性改变分数，这是所有 agent 榜单最大的隐藏旋钮。
- **厂商采用记录**：Claude 3.7 Sonnet（SOTA，正文，anthropic.com）；OpenAI o3/o4-mini（正文脚注）；MiniMax-M1（airline 62.0 / retail 63.5，arXiv:2506.13585）；Kimi K2（Tau2-Bench 66.1，arXiv:2507.20534）；GLM-4.7（τ²-Bench 显著提升，github README）。τ-bench 是 2025 年 agent 类出现频次最高的评测。

### WebArena / OSWorld / GAIA
- **WebArena**：自托管真实网站（购物、论坛、地图等）上的长程网页任务，按任务目标函数判分。**厂商采用记录**：本次抓取的 13 家厂商发布正文中均未出现——社区与研究界驱动、厂商旗舰发布未引用（截至本次抓取证据）。
- **OSWorld**：真实 Ubuntu 虚拟机桌面环境跨应用任务（浏览器/办公/系统设置），截图状态 + 真实执行检查。**厂商采用记录**：本次抓取的发布正文中未见引用；其广泛应用场景是 computer-use 类产品发布（如 Anthropic 2024-10 computer use 能力介绍）与社区评测，未见旗舰基准表（本次抓取范围内）。
- **GAIA**：面向通用助理的多步现实问题（网页、文件、推理组合），人类 92% vs 当时 GPT-4 插件 15% 的巨大人机差是其设计卖点。**厂商采用记录**：本次抓取的厂商发布正文未见引用，属社区/研究评估为主。
- **设计光谱上的共同盲区**：环境脆弱（网页改版即失效）、评测器即测试集（自动化检查覆盖不全）、用户模拟器偏差（τ-bench 类）、长任务方差大需要多次平均（o3 的 5 次平均即是回应）。这三者至今没有进入主流厂商发布基准表，说明厂商对"不可控环境 + 不可复现分数"的发布级引用仍然谨慎。
- **光谱两端的原理差异**：BFCL/ACEBench 这类单轮工具调用评测本质是"函数签名匹配 + 参数填空"，判分确定、可复现，但与真实 agent 的差距类似"单元测试与集成测试"的差距；τ-bench 引入了对话状态（用户会改主意、会给模糊信息），第一次把"澄清能力"和"政策遵守"纳入判分；WebArena/OSWorld 把状态转移到真实渲染界面（DOM 或像素），考察视觉定位与跨应用导航；GAIA 与 Vending-Bench 则把评测推向"无脚本的长程开放目标"。越往光谱右端，评测越接近产品体验，但也越难控制变量——这正是厂商发布文的引用分布呈现"τ-bench 常见、OSWorld 罕见"的根本原因：前者可以在发布材料里写清楚协议，后者写不清楚。
- **对读数者的启示**：比较 agent 分数时，第一问不是"多少分"，而是"用户模型是谁、多少步上限、几次平均、判分器是什么"。本次抓取到的最好示范是 OpenAI o3 脚注与 MiniMax-M1 协议节：两者都把用户模型版本、交互步数上限、平均次数写进正文。反之，凡是只给一个百分比而不给协议的 agent 分数，都应视为营销数字而非测量结果。

### Vending-Bench（差异化营销样本）
- **测什么**：模型扮演自动售货机经营者，在长程模拟中进货、定价、应对突发，报净资产与销量——把"长程规划 + 延迟满足"变成经济指标。
- **厂商采用记录**：仅 Grok 4（$4694.15 净资产 vs Claude Opus 4 $2077.41 vs 人类 $844.05，5 次平均，x.ai/news/grok-4 正文）。社区评测、单厂商引用，属典型的"自选新战场"策略。

## E. 长上下文类

### NIAH（Needle In A Haystack）——营销化
- **测什么**：在长文本中随机位置插入一句事实，问模型这句话是什么。Gemini 1.5 发布即以"100 万 token 内 99% 检索"为门面（blog.google 正文），并辅以音频/视频多模态捞针。
- **原理与局限**：检索任务与"理解/推理 over 长文"差距巨大；单针、答案自含，接近"长距离复制粘贴"。当所有厂商都能报 99%+ 时，它退化为上下文长度广告位，失去区分度。

### RULER 及多任务化路线
- **测什么/原理**：把长上下文拆成检索、多跳推理、聚合、问答等多类任务并按长度参数化生成，测的是"能力随长度衰减曲线"而非单点检索。
- **厂商采用记录（本次抓取证据）**：厂商旗舰发布正文均未点名 RULER，而是各自采用更"可讲故事"的替代：
  - Gemini 2.5 Pro：MRCR（多轮共指消解，3 月 26 日补充进发布文，blog.google 正文）——OpenAI 开源的多针升级版，测的是"分得清长得一样的针"。
  - MiniMax-M1：OpenAI-MRCR 128k 73.4 / 1M 56.2 + LongBench-v2 61.5（arXiv:2506.13585 正文表），用 MRCR 反超 Gemini 2.5（76.8→73.4 仍低于 Gemini 128k 的 76.8，但 1M 档 Gemini 58.8 vs M1 56.2 接近）。
  - Grok 3：LOFT (128k) 83.3%（长上下文 RAG 12 任务平均，x.ai 正文表）。
  - DeepSeek-R1：FRAMES 82.5（长文档问答，arXiv:2501.12948）。
- **结论**：长上下文评测的厂商实践已从"单针 NIAH"整体迁移到"多针共指（MRCR）/多任务（RULER 系思想）/RAG（LOFT/FRAMES）"，但没有任何一家直接引用 RULER——标准制定者与采用者错位是这一领域的现状。
- **两条路线的对照**：NIAH 回答的是"注意力是否够长"，MRCR 回答的是"注意力是否够准"——后者要求模型区分上下文中多个高度相似的对象（例如多轮对话里先后出现的同名变量、相似格式的订单号），失败模式从"找不到"变成"找错"，分数才能反映真实的信息分辨能力。RULER 的贡献是把"衰减曲线"变成标准做法：同一任务在 4k/16k/64k/128k/1M 各长度上重复，报告的是性能保持率而非单点峰值。厂商实践中最接近这条路线的是 MiniMax-M1（同时报 128k 与 1M 两个 MRCR 档位）与 Grok 3（LOFT 的 12 任务平均）。
- **营销化的历史教训**：Gemini 1.5 的"百万 token 99%"之所以成为经典案例，是因为它同时满足了三个传播条件：极端数字（一百万）、直观隐喻（大海捞针）、单点满分（99%）。此后所有厂商都意识到长上下文的评测叙事必须"多任务化 + 多档位化"才能维持可信度，Gemini 2.5 Pro 在发布文更新里补 MRCR 正是对这一教训的官方回应——同一厂商在两代产品间的评测策略变化，比任何单一分数都更能说明评测体系的演化方向。

## F. 中文类

### C-Eval / CMMLU
- **测什么**：C-Eval 是覆盖 52 学科的中英双语考试基准（含初中/高中/大学/专业四层）；CMMLU 是 67 个中文主题学科的选择题集。两者共同构成中文知识类的"MMLU 对应物"。
- **厂商采用记录**：DeepSeek-R1 C-Eval 91.8（vs V3 86.5、Claude3.5 76.7、GPT-4o 76.0，arXiv:2501.12948 正文表）；Doubao-1.5-pro 同时引用 CMMLU 与 C-Eval（seed.bytedance.com 官方页）；Qwen 系与 GLM 系历史发布长期使用。国际厂商（OpenAI/Anthropic/Google/xAI）旗舰发布正文均不采用——中文榜是国产厂商的"主场共识榜"。
- **局限**：选择题格式与 MMLU 同病；部分学科已现饱和；对 agent/工程能力零覆盖。

### CLUEWSC / C-SimpleQA / CNMO 2024 / SuperGPQA
- **厂商采用记录**：R1 报 CLUEWSC 92.8、C-SimpleQA 63.7（并解释因安全 RL 拒答压低，无安全 RL 可 70%+）、CNMO 2024 78.8（中文奥数，R1 论文表）；MiMo 与 GLM 系采用 SuperGPQA（研究生级中文社区新基准，MiMo 表 40.5）。中文评测供给侧正在从"考试选择题"向"中文事实问答（C-SimpleQA）+ 中文竞赛（CNMO）+ 中文研究生知识（SuperGPQA）"多元化。
- **SuperCLUE**：第三方中文综合榜单，媒体引用广泛，但本次抓取的厂商发布正文均未自引——与 LiveBench 之于阶跃星辰不同，SuperCLUE 至今是"媒体榜"而非"厂商发布引用榜"。

## G. 偏好类

### Chatbot Arena / LMArena（Bradley-Terry 与风格控制）
- **测什么**：匿名双盲对战，用户对两个模型的回答投票，胜率数据经 Bradley-Terry 模型拟合为 Elo/分数排名（ Bradley-Terry 系数法见 arXiv:2507.08983 对该流程的描述："user selections are incorporated into the leaderboard, typically using Bradley-Terry coefficients"【转述：检索片段】）。
- **核心原理**：以真实用户分布的偏好替代静态基准，规避数据污染；代价是测的是"偏好"而非"正确"。
- **风格控制的影响**：平台引入 style control（控制回答长度、markdown 加粗、列表密度等表面风格特征后重算排名）后，长而花哨的回答不再自动占优，推理/知识类模型的 Arena 分与能力榜相关性上升。Gemini 2.5 Pro 发布文"tops LMArena by a significant margin, indicating a highly capable model equipped with high-quality style"（blog.google 正文）正是对"能力+风格"双读法的自觉利用。
- **厂商采用记录**：Grok 3（Elo 1402，正文）；Gemini 2.5 Pro（#1，正文）；Kimi K2（开源第 1 / 总榜第 5，3000+ 票，arXiv:2507.20534 正文）；混元 TurboS（Arena 成绩，转述）。Arena 的地位特殊：它既是厂商发布文引用频率最高的"活榜单"，也是唯一一个厂商无法自控评测集的榜单——因此它的引用常与自建表并列出现，互为信用背书。

### Chatbot Arena / LMArena 的方法论细节
- **Bradley-Terry 原理**：把每场对战视为一次伯努利试验，假设每个模型有一个潜在强度值，模型 i 击败模型 j 的概率为强度差的单调函数（logistic 形式）；用全部对战记录做极大似然估计，得到可排序的强度系数，再映射为 Elo 类分值。相比按胜率直接排名，BT 估计的优势在于能处理对手池不均衡（新模型对战次数少、对手强度不同）的问题，并天然给出置信区间。
- **它测什么、不测什么**：Arena 测的是"真实用户在真实提示分布下的偏好"，因此它对风格、语气、格式、长度高度敏感——一个排版华丽但事实错误率高的模型完全可以排到能力榜之下。风格控制（style control）的介入正是为了剥离这部分信号：在统计模型中把长度、加粗密度、列表数等表面特征作为协变量控制后重新拟合，使排名更接近"内容质量"而非"格式讨好"。代价是任何统计控制都依赖建模假设，控制前后排名的位移本身也成了争议源。
- **厂商的双榜策略**：观察本次抓取的样本可以发现一个稳定模式——偏好榜（Arena）与能力榜（GPQA/AIME/SWE）在发布文中承担不同叙事职能：xAI 用 Arena 证明"用户爱用"，Gemini 2.5 用 Arena 证明"能力强且风格好"，Kimi K2 用 Arena 证明"开源阵营第一"。没有一家只用 Arena，也没有一家只报自建表——两类榜单互为信用锚是当前发布材料的标准结构。

### AlpacaEval 2.0 / ArenaHard
- **测什么**：AlpacaEval 2.0 用 GPT-4 做裁判、报告长度控制（LC）胜率；ArenaHard 用 500 个真实困难用户问题 + GPT-4-1106 裁判。
- **厂商采用记录**：DeepSeek-R1（AlpacaEval2.0 LC 87.6、ArenaHard 92.3，并主动披露平均 689/2218 token 以自证未利用长度偏置——R1 论文正文）；MiniMax-M1 用 MultiChallenge（44.7）替代二者。LLM 裁判类评测的固有风险（自我偏好、长度偏置）正是 R1 那段披露的写作动机。

## H. 多模态类（简述）

- **MMMU**：大学级多学科图文推理选择题。采用记录：Grok 3（73.2，正文表）、OpenAI o3（SOTA，正文）、Claude 3.5 Sonnet（视觉图表）、Gemini 2.5（图表）。GPT-4o 发布则整体回避具名多模态榜。
- **MathVista**：数学视觉问答。Kimi k1.5 74.9（正文）；o3 更新记录中出现。
- **EgoSchema**：第一视角视频理解。仅 Grok 3（74.5，正文表）在旗舰发布中引用——极少数厂商采用的冷门榜，用于补足"视频理解"叙事。

---

# 第三部分：横向综合

## 3.0 评测体系的生命周期：一个可复用的观察框架

综合本次 13 家厂商的抓取证据，一个评测从诞生到退场呈现清晰的生命周期，理解它比记住任何单个分数更有用：

1. **萌芽期（学术发布）**：论文提出 + 社区小范围使用。例：GPQA（2023 论文）、LiveCodeBench、Terminal-Bench。
2. **首发引用期**：被某一头部旗舰发布首次采用并制造叙事。例：Gemini 1.5 之于 NIAH、Claude 4 之于 Terminal-Bench、Grok 4 之于 HLE/ARC-AGI-2/Vending-Bench。首发引用者往往同时是"该评测叙事的最大受益者"，因为分数史空白意味着它是第一个把曲线画出来的人。
3. **共识期**：三家以上厂商跟随，评测成为通用语言。例：GPQA Diamond（11/11 家）、AIME、LiveCodeBench、SWE-bench Verified。
4. **饱和与口径战争期**：分数趋同后，竞争转移到协议差异——采样次数、子集、脚手架、工具开关。AIME 的 pass@1 vs cons@64、SWE-bench 的 n=477 与并行计算口径、τ-bench 的用户模型替换都发生在这一阶段。
5. **退场或更名期**：HumanEval 从 Claude 3.5 门面到无人引用只用一年；FrontierMath 因利益冲突事件从"独家电台"变成集体回避；NIAH 退化为长度广告位后由 MRCR 接棒。

用这个框架看，2025 年正处于"SWE-bench 饱和与口径战争期 + Terminal-Bench/HLE 共识期前夜 + MMLU 退场完成"的叠加态。判断一个新基准值不值得关注，就看它处于哪一段：萌芽期的评测看设计是否可复现，共识期的评测看协议披露，饱和期的评测直接忽略单点分数、只看衰减曲线与多口径对照。

## 3.1 锚点策略的四种原型

把 13 家厂商的锚点选择归纳为四种原型，便于快速识别任何一份新发布材料的立场：

- **代际锚（自家上一代）**：OpenAI GPT-4o vs GPT-4 Turbo、GLM-4.7 vs GLM-4.6、Claude 4 的 shortcut 行为率 vs Sonnet 3.7。适合渐进式改进，回避横向对比；风险是"超越自己"不构成购买理由。
- **同代横向锚（友商表）**：Grok 3 六模型表、MiniMax-M1 七模型表、DeepSeek-R1 五基线表。是最有信息量的形态，但会策略性选择对手代际（Grok 3 选 Gemini 2.0/Claude 3.5 而非 2.5/3.7）。
- **限定赛道锚（加限定词制造局部第一）**：Kimi K2 的"非 thinking 模式 SOTA"、Gemini 2.5 的"不用 majority voting"、OpenAI o4-mini 的"无工具最佳"、xAI 的"closed 模型 ARC-AGI-2 SOTA"。限定词每加一个，"第一"的含金量就降一级，读报告时必须把限定词和分数一起读。
- **第三方借势锚（榜单名次）**：阶跃星辰的 LiveBench 全球第五、各家的 LMArena 名次。优点是无法被指责自导自演，缺点是评测组合不可控、且无法展示协议细节。

真实发布文常是混合体：Claude 4 = 代际锚（shortcut 率）+ 横向锚（SWE-bench/Terminal-bench 隐含全行业）+ 第三方证言（Cursor/Rakuten）；DeepSeek-R1 = 横向锚（o1-1217）+ 让步披露（SimpleQA、C-SimpleQA 落后及原因）。

## 3.2 评测 × 厂商覆盖矩阵（基于真实抓取统计）

**说明**：✓ = 该厂商旗舰发布正文（含技术报告正文表格）出现该评测；○ = 仅图表/提及；空 = 未出现。样本为本次实际抓取的 13 家发布材料。

| 评测 | OpenAI | Anthropic | Google | xAI | DeepSeek | Qwen | GLM | Kimi | MiniMax | 字节 | 小米 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MMLU/MMLU-Pro | ○ | ○ | ○ | ✓ | ✓ | ✓ | ○ | ○ | ✓ | ○ | ✓ |
| GPQA Diamond | ✓ | ✓ | ✓ | ✓ | ✓ | ○ | ○ | ✓ | ✓ | ✓ | ✓ |
| AIME 24/25 | ✓ | 空 | ✓ | ✓ | ✓ | ✓ | 空 | ✓ | ✓ | ✓ | ✓ |
| MATH-500 | ✓ | 空 | 空 | 空 | ✓ | ✓ | 空 | ✓ | ✓ | 空 | ✓ |
| HLE | ✓ | 空 | ✓ | ✓ | 空 | 空 | ✓ | 空 | ✓ | 空 | 空 |
| HumanEval | 空(旧) | ✓(2024) | 空 | 空 | 空 | ✓(2024) | 空 | 空 | 空 | 空 | 空 |
| LiveCodeBench | 空 | 空 | 空 | ✓ | ✓ | ✓ | 空 | ✓ | ✓ | 空 | ✓ |
| Codeforces | ✓ | 空 | 空 | 空 | ✓ | 空 | 空 | ✓ | 空 | ✓(自建) | 空 |
| SWE-bench Verified | ✓ | ✓ | ✓ | 空 | ✓ | 空 | ✓ | ✓ | ✓ | 空 | 空 |
| Terminal-Bench | 空 | ✓ | 空 | 空 | 空 | 空 | ✓ | 空 | 空 | 空 | 空 |
| τ-bench / τ² | ✓ | ✓ | 空 | 空 | 空 | 空 | ✓ | ✓ | ✓ | 空 | 空 |
| Arena/LMArena | ○ | 空 | ✓ | ✓ | 空 | 空 | 空 | ✓ | 空 | 空 | 空 |
| MRCR/长上下文任务 | ✓(研发) | 空 | ✓ | ✓(LOFT) | ✓(FRAMES) | 空 | 空 | 空 | ✓ | 空 | 空 |
| C-Eval/CMMLU 等中文榜 | 空 | 空 | 空 | 空 | ✓ | ✓ | ○ | 空 | 空 | ✓ | ○ |
| ARC-AGI | ○ | 空 | 空 | ✓ | 空 | 空 | 空 | 空 | 空 | ✓ | 空 |

**共识榜（几乎所有厂商都报）**：GPQA Diamond（11/11 家均出现，含间接表）、AIME、LiveCodeBench、MMLU-Pro。这四者构成"推理模型时代"的通用语言。
**差异化营销榜**：SWE-bench（国际强、国内选择性）、Terminal-Bench（Anthropic + 智谱双雄、其余回避）、HLE（三家引用后迅速扩散）、ARC-AGI-2（xAI 首发 SOTA 叙事）、Vending-Bench（xAI 独家）、τ-bench（agent 叙事厂商）、Arena（产品体验叙事厂商）、中文榜（国产厂商主场）。
**厂商回避 / 社区驱动**：WebArena、OSWorld、GAIA（抓取范围内无一家旗舰发布正文引用）；RULER（思想被吸收但无点名引用）；SuperCLUE（媒体榜）；FrontierMath（单一厂商引用 + 利益冲突争议后实际退场）。

## 3.3 读报告五问法（附本次调研实例）

1. **协议**：用什么脚手架？SWE-bench 是 agentless 还是重 agent？τ-bench 的用户模型是 GPT-4o 还是 GPT-4.1？是否允许浏览/解释器？（o3 脚注与 M1 协议节是范本）
2. **采样次数**：pass@1、pass@k、cons@64 还是"32 次平均"？Grok 3 的 93.3% 是 cons@64，DeepSeek 的 79.8% 是 temp 0.6 的 pass@1——两者差 13 个点但都叫"AIME 成绩"。
3. **子集**：SWE-bench 是全 500 还是 n=477？HLE 是 full set 还是 text-only？FrontierMath 是 180 题公开版还是 290 题私有版？Aider 是 Polyglot 还是全量？
4. **锚点公平**：对比的是上一代还是同代？Grok 3 比 Gemini 2.0 / Claude 3.5；GLM 合成总分的权重是否公开？"非 thinking 设定"（K2）与"不用 majority voting"（Gemini 2.5）都是限定词，限定词决定可比性。
5. **没报什么**：GPT-4o 不报具名榜、Claude 3.7 不报数学竞赛、xAI 的 SimpleQA 输给 Gemini 仍登了表——缺席名单有时比在场名单信息量更大。凡是把"真实工程任务"与"竞赛题"双报的厂商（Claude 4、MiniMax-M1），其单一维度分数的可信度也越高。

**案例演示：用五问法重读 Grok 3 的六模型表**。这张表是本次调研中信息最完整的一张，也恰好是五问法的最佳教具。

第一问（协议）：表内是"非思考模式"成绩，推理模式成绩另列在正文（AIME 2025 cons@64 93.3% 等），两套数字不得混读；LCB 标注了窗口（2024-10-01 至 2025-02-01），LOFT 标注了 128k 档——协议披露充分。第二问（采样）：表内 AIME'24 52.2% 未标采样口径，正文推理段的 93.3% 标了 cons@64，说明表内默认单次口径但未明说，属于可追问点。第三问（子集）：GPQA 标注了 Diamond，LOFT 标注了任务平均数（12 任务），SimpleQA 未标注版本——SimpleQA 存在事实更新后的多版本，这是全行业通病。第四问（锚点公平）：对比对象是 Gemini 2.0（上一代）与 Claude 3.5 Sonnet（上一代），而非同期的 2.5 与 3.7；GPT-4o 的 AIME 9.3% 真实但具有强烈戏剧效果——它不是推理模型，放进步行者对比表里主要用于制造分差。第五问（没报什么）：表里没有 SWE-bench、没有任何工程类评测，而 2025 年 2 月 SWE-bench 已是代码发布标配——对照两周后 Anthropic Claude 3.7 发布的"只报 SWE-bench 与 τ-bench、不报 AIME"，可以清楚看到两家公司按自身优势各选了半个评测宇宙。五问走完，这张表的正确读法是："Grok 3 在非思考模式的知识与竞赛类任务上超越上一代国际旗舰"——而不是"Grok 3 全面领先"。

**再补一个反例：GLM-4.5 的合成总分**。"12 项行业标准基准综合 63.2、全模型第三"是本次抓取中唯一一份只给合成总分不给子表的旗舰发布。合成总分的传播效率极高（一个数字一个名次），但复核成本也极高：12 项是哪 12 项、各自权重、思考模式还是非思考模式、锚点是同期还是上一代，正文均未披露。这不是说分数不可信，而是说它把验证成本转嫁给了读者。对照同一仓库里 GLM-4.7 的披露方式（逐项分数 + 逐项增幅），可以看到智谱自身的披露标准也在随行业水位上移——这也是读报告时应当纳入的纵向视角：同一厂商两代发布之间的透明度变化，往往比分数变化更能说明问题。

## 3.4 每类评测"设计重点 + 厂商采用记录"速查表

| 类别 | 评测 | 设计重点一句话 | 厂商采用记录（本次抓取证据） |
| --- | --- | --- | --- |
| 知识 | MMLU | 57 学科广度，已饱和 | Claude 3.5(2024)、R1 表、Qwen2.5；新旗舰渐弃 |
| 知识 | MMLU-Pro | 10 选项抗污染升级 | Grok 3 表、R1、M1、MiMo 表 |
| 推理数学 | AIME 2024/25 | 30 题整数答案；pass@1 vs cons@64 口径敏感 | OpenAI/o1/o3、R1、Grok3/4、Gemini2.5、k1.5、MiMo、Seed、M1、QwQ |
| 推理数学 | GPQA Diamond | 博士级 Google-proof 精选 198 题 | 全部 11 家（覆盖率第一） |
| 推理数学 | FrontierMath | 私有研究级数学；利益冲突争议 | 仅 OpenAI o3 预告引用；其余厂商回避 |
| 代码 | HumanEval | 函数合成，已饱和 | Claude 3.5/Qwen2.5(2024) 后退场 |
| 代码 | LiveCodeBench | 时间窗切分防污染 | Grok3/4、R1、QwQ、K2、M1、MiMo |
| 代码 | SWE-bench Verified | 真实 Issue + 仓库测试闭环；脚手架敏感 | OpenAI、Claude3.7/4、Gemini2.5、R1、K2、M1、GLM-4.7 |
| 代码 | Terminal-Bench | 空白容器终端运维，测"建"不测"修" | Claude Opus 4（43.2%）、GLM-4.7（41%）；其余未引用 |
| Agent | τ-bench/τ² | LLM 用户模拟 + 政策遵守 + pass^k | OpenAI、Claude3.7、K2、M1、GLM-4.7 |
| Agent | WebArena/OSWorld/GAIA | 网页/桌面/通用环境；可复现性弱 | 抓取范围内无厂商旗舰发布正文引用（社区驱动） |
| Agent | Vending-Bench | 长程经营模拟经济指标 | 仅 Grok 4 |
| 长上下文 | NIAH | 单针检索，营销化 | Gemini 1.5（99%@1M）后普遍退化为长度广告 |
| 长上下文 | MRCR/LOFT/FRAMES/RULER | 多针共指/RAG/多任务衰减曲线 | Gemini2.5(MRCR)、M1(MRCR+LongBench-v2)、Grok3(LOFT)、R1(FRAMES)；RULER 无点名引用 |
| 中文 | C-Eval / CMMLU | 中文 MMLU 对应物 | R1（91.8）、Doubao、Qwen、GLM；国际厂商不用 |
| 中文 | C-SimpleQA/CNMO/SuperGPQA | 中文事实/竞赛/研究生知识多元化 | R1 表、MiMo 表 |
| 偏好 | Chatbot Arena | 匿名投票 + Bradley-Terry；风格控制上线 | Grok3(1402)、Gemini2.5(#1)、K2(开源#1)、混元(转述) |
| 偏好 | AlpacaEval2.0/ArenaHard | LLM 裁判 + 长度控制 | R1（含长度偏置自证披露）、V3 表 |
| 多模态 | MMMU/MathVista/EgoSchema | 学科图文推理/数学视觉/第一视角视频 | Grok3（三表全用）、o3、k1.5、Claude3.5 |

---

## 抓取与验证记录（截至 2026-08-28）

成功抓取的官方/一手来源（正文含可引用内容）：
1. https://openai.com/index/hello-gpt-4o/
2. https://openai.com/index/learning-to-reason-with-llms/（正文仅含示例与叙述，基准数值在图表）
3. https://openai.com/index/introducing-o3-and-o4-mini/（含全部协议脚注）
4. https://www.anthropic.com/news/claude-3-5-sonnet
5. https://www.anthropic.com/news/claude-3-7-sonnet
6. https://www.anthropic.com/news/claude-4
7. https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024/
8. https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/
9. https://x.ai/news/grok-3（含完整六模型文本表）
10. https://x.ai/news/grok-4
11. https://arxiv.org/html/2501.12948v1（DeepSeek-R1，含完整主表/蒸馏表/协议）
12. https://qwenlm.github.io/blog/qwen2.5/
13. https://qwenlm.github.io/blog/qwq-32b/
14. https://huggingface.co/zai-org/GLM-4.5
15. https://github.com/zai-org/GLM-4.5
16. https://arxiv.org/html/2507.20534v1（Kimi K2）
17. https://arxiv.org/html/2501.12599v1（Kimi k1.5）
18. https://arxiv.org/html/2506.13585v1（MiniMax-M1，含完整表与协议）
19. https://arxiv.org/html/2504.13914v2（Seed-Thinking-v1.5）
20. https://arxiv.org/html/2505.07608v2（MiMo-7B，含完整表）
21. https://www.tbench.ai/（Terminal-Bench 官网）
22. https://moonshotai.github.io/Kimi-K2/（JS 页面，仅标题/摘要）

未能抓取或仅获转述的部分（已在正文对应位置标注）：
- OpenAI o1 博客与 Claude 3.5/3.7 发布文中的图表化分数数值（页面确认使用该评测，数值未渲染）
- 腾讯混元 T1 官方发布数值（发布于微信公众号渠道，未抓取到原文）
- 阶跃星辰 Step-2 的 LiveBench 具体分数（第三方榜单经媒体转述）
- 小米 MiMo 官方博客 mimo.xiaomi.com（以 arXiv 技术报告替代，为同一官方来源）
- LMArena 风格控制机制细节（经 arXiv:2507.08983 与平台描述转述）
- FrontierMath o3 >25% 与 Epoch 复测 ~10%（经 IT之家/新浪聚合页转述，含双方当事人表态引文）
