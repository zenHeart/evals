# 2024-2026 主流 LLM 评估基准完全指南

> 写给初级前端工程师的 LLM 评测入门书。从「这个模型到底有多强」到「为什么厂商都说自己是第一名」，逐个拆解 100+ 评估基准。

---

## 目录

1. [为什么需要评估基准](#一为什么需要评估基准)
2. [基准如何被分类](#二基准如何被分类)
3. [学科知识与综合推理](#三学科知识与综合推理)
4. [数学与逻辑](#四数学与逻辑)
5. [代码能力](#五代码能力)
6. [长上下文](#六长上下文)
7. [多模态](#七多模态)
8. [事实性与幻觉](#八事实性与幻觉)
9. [安全/对齐/价值观](#九安全对齐与价值观)
10. [Agent 与工具使用](#十agent-与工具使用)
11. [中文特色](#十一中文特色基准)
12. [偏好/对话质量](#十二偏好与对话质量)
13. [Agent 工具调用与多步](#十三agent-工具调用与多步执行)
14. [多语言](#十四多语言与跨语言)
15. [推理与思考](#十五推理与思考)
16. [阅读理解](#十六阅读理解)
17. [指令遵循](#十七指令遵循)
18. [思维链与提示工程](#十八思维链与提示工程元评估)
19. [2024-2026 TOP 30 基准大满贯表](#十九2024-2026-top-30-厂商报告大满贯表)
20. [给前端工程师的入门导读](#二十给初级前端工程师的入门导读)

---

## 一、为什么需要评估基准

想象你作为前端工程师写了一个排序函数 `sortUsers(users, key)`，怎么证明它比同事写的更好？你会写测试用例：边界输入、随机输入、性能基准。LLM 本质上是一个巨大的「文本 → 文本」函数，**评估基准（benchmark）就是它的测试用例**。

但是 LLM 的输出是自然语言，不像 `1+1=2` 那么容易打分。所以 LLM 评测比软件测试复杂得多：

- **答案不唯一**：问「如何学英语」，100 个回答都「对」。
- **能力多维度**：会写代码不等于会算数学；会说中文不等于会推理。
- **刷分风险**：模型可能在训练数据里见过这些题（数据污染），考不出真实水平。
- **成本高**：一次完整评测可能消耗数百万 token，单次跑分 5 万美元。

厂商技术报告里密密麻麻的表格就是这些基准的得分。读懂它们，你就能看懂厂商在吹什么、藏什么。

---

## 二、基准如何被分类

不同基准测的能力不一样。按「能力维度」分：

| 类别 | 测什么 | 类比 |
|---|---|---|
| 学科知识 | 百科全书式的广度 | 高考文综 |
| 数学逻辑 | 计算与证明 | 数学竞赛 |
| 代码能力 | 写代码、改 Bug | LeetCode + 真实项目 |
| 长上下文 | 100K+ 文本里找信息 | 在《红楼梦》里找一根针 |
| 多模态 | 看图说话、图表理解 | 看图作文 |
| 事实性 | 会不会瞎编 | 防 AI 幻觉 |
| 安全对齐 | 是否输出有害内容 | 价值观考试 |
| Agent | 使用工具、完成任务 | 让 AI 当助理 |
| 中文特色 | 中文世界的能力 | 古诗词 + 公文写作 |
| 偏好 | 用户更喜欢谁的输出 | 选秀投票 |
| 多语言 | 100 种语言能力 | 同声传译 |
| 推理思考 | 复杂逻辑链 | 哲学思辨 |
| 阅读理解 | 看长文答题 | 语文阅读题 |
| 指令遵循 | 听懂复杂要求 | 听话的助手 |

下面按类别逐个拆解。

---

## 三、学科知识与综合推理

测的是「模型的博学程度」。给你一道题（A/B/C/D 四选一），看你能不能选对。

### 1. MMLU（Massive Multitask Language Understanding）

**一句话**：给模型 57 门大学课程的选择题，看它能不能毕业。

**解决问题**：测试模型的世界知识和基础推理能力，覆盖 STEM、社科、法律、医学等。

**规模与样例**：约 14,042 道四选一题。

> **Question**: A statistician wants to study the ability of teenagers to negotiate. She selects 4 teenagers from a population of 10 to form a negotiation group. In how many ways can she do this?
> A) 5040  B) 15120  C) 210  D) 24
> **Answer**: C

**评估流程**：题目 → 模型 → 选项字母 → 精确匹配正确答案。

**评分方法**：精确匹配（exact match）。

**局限性**：题目已公开，可能进入训练数据（污染）；纯选择题掩盖推理过程。

**使用者**：OpenAI、Anthropic、Google、Meta、Mistral、DeepSeek、Qwen、智谱、月之暗面全部使用。

**参考**：[论文](https://arxiv.org/abs/2009.03300) | [HuggingFace](https://huggingface.co/datasets/cais/mmlu)

---

### 2. MMLU-Pro

**一句话**：MMLU 的「困难模式」，干扰项从 4 个涨到 10 个，必须真懂才行。

**解决问题**：MMLU 模型已饱和（90%+），Pro 加难度让刷分不再容易。

**规模与样例**：约 12,032 题，10 个选项，更多推理题。

> **Question**: Which of the following best describes the structure of a nucleosome?
> A) Histone octamer wrapped with ~147 bp DNA
> B) Hexameric histone core with 200 bp linker DNA
> C) Single H1 histone with 30 nm fiber DNA
> D) Tetrameric histone with methylated CpG islands
> E-J: (其他干扰项)
> **Answer**: A

**评估流程**：5-shot prompt → 模型输出 → 解析答案。

**评分方法**：精确匹配。

**局限性**：仍然选择题，推理过程不可见；中文支持弱。

**使用者**：GPT-4o、Claude 3.5 Sonnet、Gemini 1.5 Pro、DeepSeek-V3。

**参考**：[论文](https://arxiv.org/abs/2406.01574) | [GitHub](https://github.com/TIGER-Lab/MMLU-Pro)

---

### 3. CMMLU（Chinese MMLU）

**一句话**：MMLU 的中文版，67 个学科，含驾照考试、税务计算等本土特色。

**解决问题**：测试中文世界知识与本土法规、习俗理解。

**规模与样例**：约 11,558 题。

> **Question**: 根据《中华人民共和国劳动法》，用人单位拖欠或者未足额支付劳动报酬的，劳动者可以依法向人民法院申请？
> A) 仲裁  B) 支付令  C) 调解  D) 起诉
> **Answer**: B

**评估流程**：与 MMLU 类似。

**评分方法**：精确匹配。

**局限性**：题型相对单一；覆盖港澳台、海外华人需求不足。

**使用者**：Qwen、智谱 GLM、文心一言、月之暗面 Kimi、DeepSeek。

**参考**：[GitHub](https://github.com/haonan-li/CMMLU)

---

### 4. C-Eval

**一句话**：中文版的「MMLU + 高考 + 职业考试」，52 个学科。

**解决问题**：覆盖中国大学课程、公务员、医师、会计、计算机等考试。

**规模与样例**：约 14,106 题（4 个子集：验证、测试、社会科学、STEM）。

> **Question**: 下列关于光合作用的叙述，正确的是？
> A) 光合作用只在叶片中进行
> B) 光反应在叶绿体类囊体薄膜上进行
> C) 暗反应不消耗 ATP
> D) 光合作用不产生氧气
> **Answer**: B

**评分方法**：精确匹配。

**使用者**：所有中文厂商 + 国际厂商本地化测试。

**参考**：[GitHub](https://github.com/SJTU-LWP/ceval)

---

### 5. AGIEval

**一句话**：用真实高考、考研、律师资格考试题直接考模型。

**解决问题**：与人类考生同台对比，验证模型能否通过真实考试。

**规模与样例**：约 8,062 题，覆盖中国高考、美国 SAT、LSAT、GRE、医师执照等。

**评分方法**：精确匹配（选择题）。

**使用者**：OpenAI、百度、Qwen 等。

**参考**：[GitHub](https://github.com/ruixiangcui/AGIEval)

---

### 6. ARC-AGI / ARC-Challenge

**一句话**：给一个 3×3 的彩色方格图，问下一个状态的颜色，测「抽象推理」。

**解决问题**：测人类级别的「流体智力」（fluent intelligence），而非死记硬背。

**规模与样例**：约 1,000 道题 + 私有测试集 120 题。

> **Input grid**: 一个 2×2 蓝红交替；下一个 3×3 应该是？

**评估流程**：网格 → 模型输出 JSON → 比对。

**评分方法**：精确匹配颜色矩阵。

**局限性**：纯视觉-空间推理，不代表综合智能；2024 年仍是公开未解难题。

**使用者**：OpenAI o1/o3、DeepSeek-R1、Claude 3.7。

**参考**：[arcprizes.org](https://arcprizes.org)

---

### 7. BBH（Big Bench Hard）

**一句话**：从 200+ BIG-Bench 任务里挑出 23 个 LLM 表现最差的，作为「挑战关」。

**解决问题**：当模型在简单任务上得分饱和后，找更难的子集继续测。

**规模与样例**：23 个任务，共 6,511 题。

**评分方法**：精确匹配。

**使用者**：DeepSeek、Claude、GPT 系列。

**参考**：[GitHub](https://github.com/suzgunmirac/BIG-Bench-Hard)

---

### 8. HellaSwag

**一句话**：给个故事开头，选最合理的结尾（4 选 1）。

**解决问题**：常识推理；测试模型对「人在这种情况下会怎么做」的理解。

**规模与样例**：约 70,000 题（来自 ActivityNet、WikiHow）。

> **Context**: A woman is outside with a bucket and a dog. The dog is running around happily.
> **Ending 1**: The woman adds water to the bucket.
> **Ending 2**: The dog tackles the woman.
> **Ending 3**: The dog runs into the bucket.
> **Ending 4**: The woman pours bucket on dog.

**评分方法**：精确匹配。

**使用者**：几乎所有开源模型必测。

**参考**：[论文](https://arxiv.org/abs/1905.07830)

---

### 9. PIQA（Physical Interaction QA）

**一句话**：测「物理常识」—— 椅子放哪、杯子怎么拿。

**规模与样例**：约 19,000 题。

**评分方法**：精确匹配。

**使用者**：BERT、GPT 系列基线测试。

---

### 10. SIQA（Social Interaction QA）

**一句话**：测「社交常识」—— 别人难过你会怎么做。

**规模与样例**：约 38,000 题。

**评分方法**：精确匹配。

---

### 11. WinoGrande

**一句话**：选代词指代对象，测「指代消解」与常识（例：「医生夸护士，因为她手术做得很好」中的「她」是谁）。

**规模与样例**：约 44,000 题。

**评分方法**：精确匹配。

---

### 【学科知识类汇总表】

| 基准 | 类别 | 规模 | 评分方式 | 当前 SOTA（2026 初） |
|---|---|---|---|---|
| MMLU | 综合学科 | 14k | 精确匹配 | Claude 3.7 Sonnet ~92% |
| MMLU-Pro | 综合学科 | 12k | 精确匹配 | o3 ~85% |
| CMMLU | 中文综合 | 11.5k | 精确匹配 | Qwen3-72B ~84% |
| C-Eval | 中文综合 | 14k | 精确匹配 | DeepSeek-V3 ~86% |
| AGIEval | 真实考试 | 8k | 精确匹配 | GPT-4o ~76% |
| ARC-AGI | 抽象推理 | 120 私有 | 精确匹配 | o3 ~88% |
| BBH | 推理挑战 | 6.5k | 精确匹配 | Claude 3.7 ~93% |
| HellaSwag | 常识 | 70k | 精确匹配 | GPT-4o ~95% |
| PIQA | 物理常识 | 19k | 精确匹配 | GPT-4o ~92% |
| SIQA | 社交常识 | 38k | 精确匹配 | GPT-4o ~83% |
| WinoGrande | 指代 | 44k | 精确匹配 | Claude 3.7 ~92% |

---

## 四、数学与逻辑

测「算」和「证明」。前端工程师可以类比为：正则表达式能匹配但不「懂」语义；这里测的是语义层面的数学能力。

### 12. GSM8K

**一句话**：8500 道小学应用题，测「会用自然语言列算式」的能力。

**解决问题**：验证模型是否真理解应用题（不是只抄答案）。

**规模与样例**：8,500 道。

> **Question**: Janet's ducks lay 16 eggs per day. She eats three for breakfast every morning and bakes muffins for her friends every day with four. She sells the remainder at the farmers' market daily for $2 per fresh duck egg. How much in dollars does she make every day at the farmers' market?
> **Answer**: Janet sells 16 - 3 - 4 = 9 eggs. She makes 9 * 2 = $18.

**评估流程**：题目 → 模型 → 提取数字答案 → 匹配。

**评分方法**：精确匹配数字。

**使用者**：所有模型必测。

**参考**：[GitHub](https://github.com/openai/grade-school-math)

---

### 13. MATH

**一句话**：12500 道美国数学竞赛题（AMC/AIME 风格），测「竞赛级」数学。

**解决问题**：GSM8K 太简单，需要更高难度的数学。

**规模与样例**：12,500 道。

**评分方法**：数学等价比较（math-verify 库处理 $1/2$ vs $0.5$）。

**使用者**：DeepSeek、Qwen、Claude、GPT。

**参考**：[GitHub](https://github.com/hendrycks/math)

---

### 14. MATH-500

**一句话**：MATH 的 500 题精简版，OpenAI o1 技术报告里的「标准测试集」。

**解决问题**：MATH 全量跑一次太贵，500 题代表性够用。

**评分方法**：与 MATH 相同。

**使用者**：o1/o3 报告、DeepSeek-R1 报告。

---

### 15. AIME 2024 / 2025

**一句话**：美国数学邀请赛真题，30 题/卷，满分 150（每题 1-15 分整数答案）。

**解决问题**：测模型在最难中学数学的水平。

**规模与样例**：2024 卷 30 题 + 2025 卷 30 题。

> 2024 AIME I Problem 7: 求满足 $\cos x = \sin x$ 的最小正整数 $n$，使得 $n^\circ$ 的余弦等于 $n$ 度角的正弦...

**评分方法**：精确整数匹配。

**使用者**：o3、DeepSeek-R1、Claude 3.7 必跑。

---

### 16. AMC

**一句话**：AMC 10/12 历年真题，测中学数学竞赛。

**规模**：约 1,000 题。

---

### 17. FrontierMath

**一句话**：Epoch AI 出品，包含数论、代数、几何、组合的最新数学难题，号称「人类数学家也基本做不出」。

**解决问题**：测模型在「前沿研究级」数学的能力。

**规模与样例**：私有测试集，约 100+ 题。

**评分方法**：精确匹配最终数值。

**使用者**：OpenAI、Anthropic、DeepSeek 在 2024 年中作为新基准引入。

**参考**：[epochai.org/frontiermath](https://epochai.org/frontiermath)

---

### 18. MathVista（多模态数学）

**一句话**：给模型一张图（折线图、几何图、表格），让它做数学题。

**解决问题**：视觉 + 数学的跨模态推理。

**规模与样例**：6,141 题，来自 28 个现有数据集 + 3 个新数据集。

**评分方法**：精确匹配。

**使用者**：GPT-4o、Gemini、Claude 3.5 Sonnet、Qwen-VL。

**参考**：[mathvista.github.io](https://mathvista.github.io)

---

### 【数学类汇总表】

| 基准 | 类别 | 规模 | 评分方式 | 当前 SOTA |
|---|---|---|---|---|
| GSM8K | 小学应用题 | 8.5k | 数字匹配 | GPT-4o ~96% |
| MATH | 高中竞赛 | 12.5k | math-verify | o3 ~95% |
| MATH-500 | 高中竞赛精简 | 500 | math-verify | o3 ~98% |
| AIME 2024 | 美国邀请赛 | 30 | 整数匹配 | o3 ~96% |
| AIME 2025 | 美国邀请赛 | 30 | 整数匹配 | o3 ~92% |
| AMC | 美国数学竞赛 | 1k | 整数匹配 | o3 ~98% |
| FrontierMath | 研究级 | 100+ | 精确匹配 | o3-pro ~25% |
| MathVista | 多模态数学 | 6.1k | 精确匹配 | GPT-4o ~73% |

---

## 五、代码能力

前端工程师最关心的部分！

### 19. HumanEval

**一句话**：164 道 Python 函数题，OpenAI 2021 年出品的「祖师爷」代码基准。

**解决问题**：测模型能否根据函数签名+文档字符串写出可运行的 Python 函数。

**规模与样例**：164 题。

```python
from typing import List

def has_close_elements(numbers: List[float], threshold: float) -> bool:
    """ Check if in given list of numbers, are any two numbers closer to each other than
    given threshold.
    >>> has_close_elements([1.0, 2.0, 3.0], 0.5)
    False
    >>> has_close_elements([1.0, 2.8, 3.0, 4.0, 5.0, 2.0], 0.3)
    True
    """
```

**评估流程**：题目 → 模型生成函数 → 跑测试用例（pass@k）。

**评分方法**：单元测试通过率（pass@1 / pass@10）。

**局限性**：题目简单、可能污染、Python 单一语言。

**使用者**：所有代码模型。

**参考**：[GitHub](https://github.com/openai/human-eval)

---

### 20. MBPP（Mostly Basic Python Problems）

**一句话**：974 道「让 Python 初学者练手」的题目。

**规模与样例**：974 题，每题 3 个测试用例。

**评分方法**：pass@k。

**使用者**：所有代码模型。

---

### 21. APPS

**一句话**：10000 道编程竞赛入门题（Codeforces 风格），含详细答案与测试。

**规模与样例**：10,000 题。

**评分方法**：跑测试用例。

**使用者**：GPT-4、Code Llama、DeepSeek-Coder。

---

### 22. CodeContests

**一句话**：DeepMind 出品，13600 道 Codeforces 编程竞赛真题。

**规模与样例**：13,600 题。

**评分方法**：编译通过 + 全部测试用例通过。

**使用者**：AlphaCode、DeepSeek-Coder。

---

### 23. LiveCodeBench

**一句话**：从 LeetCode、Codeforces、AtCoder 每月抓新题，避免数据污染。

**解决问题**：传统基准被「刷完了」，LiveCodeBench 用「新题」持续监测真实能力。

**规模与样例**：每月更新，目前累计约 1000+ 题。

**评分方法**：pass@k。

**使用者**：OpenAI、Anthropic、Google、DeepSeek 全部使用。

**参考**：[livecodebench.github.io](https://livecodebench.github.io)

---

### 24. Codeforces Rating

**一句话**：直接拿模型在 Codeforces 模拟比赛，根据分数给「Rating」。

**解决问题**：用真实竞赛平台给模型打分，避免人为构造题目的偏差。

**规模与样例**：约 5000+ 题。

**评分方法**：模拟比赛 → Elo Rating。

**使用者**：DeepSeek-R1、o3、Claude 3.7。

---

### 25. SWE-bench（Verified / Lite / Multilingual）

**一句话**：给模型一个真实 GitHub Issue，让它在代码库里改 Bug 并通过测试。

**解决问题**：测「真实软件工程能力」——读懂仓库、写补丁、跑通测试。

**规模与样例**：
- SWE-bench Verified：500 题（人工审核）
- SWE-bench Lite：300 题（精简）
- SWE-bench Multilingual：300 题（多语言）

**评估流程**：
1. 选定 GitHub 仓库的某个 Issue；
2. 模型下载仓库快照；
3. 修改代码生成 patch；
4. 应用 patch → 跑 fail-to-pass 测试；
5. 通过 = 成功。

**评分方法**：测试用例通过率。

**局限性**：仓库规模小（平均 ~1000 行）、修复类型有限。

**使用者**：Anthropic Claude 3.7、DeepSeek-R1、Qwen-Coder、OpenAI o3。

**参考**：[SWE-bench](https://www.swebench.com)

---

### 26. MultiPL-E

**一句话**：把 HumanEval 翻译成 18 种语言（JS、TS、Go、Rust、Java、C++）。

**解决问题**：测模型在多语言编程的能力。

**规模与样例**：164 × 18 ≈ 2952 题。

**评分方法**：pass@k。

**使用者**：DeepSeek-Coder、Code Llama、Qwen-Coder。

---

### 27. RepoBench

**一句话**：测「仓库级」代码理解——给定大段上下文，补全函数。

**规模与样例**：约 50 万函数（Python + Java）。

**评分方法**：精确匹配或 BLEU。

---

### 28. BigCodeBench

**一句话**：HumanEval 的「困难模式」，1140 道题，需要调用 139 个库（pandas、numpy、requests）。

**解决问题**：HumanEval 太简单，BigCodeBench 要求真实工具调用。

**规模与样例**：1140 题。

```python
# 简化题面
def task_func(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    """对 df 按 columns 做 groupby 并返回每组 size 的 DataFrame"""
```

**评分方法**：跑完整测试。

**使用者**：BigCode 项目，DeepSeek-Coder-V2、Qwen-Coder。

**参考**：[bigcode-bench.github.io](https://bigcode-bench.github.io)

---

### 29. DS-1000（Data Science）

**一句话**：1000 道数据科学代码题，覆盖 numpy、pandas、scipy、sklearn、pytorch、matplotlib。

**规模与样例**：1000 题。

**评分方法**：执行测试。

**使用者**：Code Llama、DeepSeek-Coder。

---

### 30. Spider（Text-to-SQL）

**一句话**：给自然语言问题 + 数据库 Schema，写 SQL。

**规模与样例**：10,181 题，200 个数据库，138 个领域。

> **Database**: pet_store
> **Question**: What are the names of pets whose weight is heavier than 10?
> **SQL**: SELECT name FROM pets WHERE weight > 10

**评分方法**：执行结果匹配。

**使用者**：所有 NL2SQL 研究。

---

### 31. BIRD（Text-to-SQL）

**一句话**：Spider 升级版，12,751 题，含真实数据库（更大、更脏数据）。

**评分方法**：执行准确率（Execution Accuracy）+ 有效效率得分（VES）。

**使用者**：OpenAI、阿里、DuckDB 项目。

---

### 32. ML-Bench

**一句话**：测模型在「机器学习任务」上的代码能力——给定 ML 任务描述，写训练代码。

**规模与样例**：约 100 题。

---

### 33. ToolBench / API-Bank

**一句话**：测模型调用 16000+ 真实 API（搜索、计算、天气）的能力。

**规模与样例**：约 10 万次 API 调用轨迹。

**评分方法**：任务完成率。

---

### 34. BFCL（Berkeley Function Calling Leaderboard）

**一句话**：专门测「Function Calling」能力——给模型一组函数定义和用户问题，看它能否正确选函数 + 填参数。

**规模与样例**：
- BFCL v1：5000+ 测试
- BFCL v3（2025）：含 Live、Multiple、Parallel、Parallel-Multiple 等多种场景

**评估流程**：
1. 输入：用户问题 + JSON Schema 函数定义
2. 模型输出：函数名 + 参数
3. 比对：精确 JSON 等价

**使用者**：OpenAI、Anthropic、Google、Mistral、Meta 全部参与。

**参考**：[gorilla.cs.berkeley.edu/bfcl.html](https://gorilla.cs.berkeley.edu/bfcl.html)

---

### 【代码类汇总表】

| 基准 | 类别 | 规模 | 评分方式 | 当前 SOTA |
|---|---|---|---|---|
| HumanEval | Python 函数 | 164 | pass@1 | Claude 3.7 ~98% |
| MBPP | Python 入门 | 974 | pass@1 | GPT-4o ~92% |
| APPS | 竞赛入门 | 10k | 跑测试 | DeepSeek-R1 ~50% |
| CodeContests | 竞赛 | 13.6k | 跑测试 | o3 ~50% |
| LiveCodeBench | 月度新题 | 1k+ | pass@1 | o3 ~76% |
| Codeforces Rating | 真实比赛 | 5k+ | Elo | o3 ~2700 |
| SWE-bench Verified | 真实仓库 | 500 | 测试通过 | Claude 3.7 ~62% |
| MultiPL-E | 多语言 | 2.9k | pass@1 | GPT-4o ~85% |
| RepoBench | 仓库理解 | 500k | 精确 | DeepSeek-Coder-V2 ~50% |
| BigCodeBench | 工具调用 | 1140 | 跑测试 | GPT-4o ~62% |
| DS-1000 | 数据科学 | 1000 | 跑测试 | Claude 3.7 ~78% |
| Spider | Text-to-SQL | 10k | 执行匹配 | GPT-4o ~90% |
| BIRD | Text-to-SQL | 12.7k | 执行+VES | Claude 3.7 ~60% |
| ML-Bench | ML 代码 | 100 | 跑测试 | GPT-4o ~50% |
| ToolBench | API 调用 | 100k 调用 | 完成率 | GPT-4o ~62% |
| BFCL | Function Call | 5k+ | JSON 匹配 | Claude 3.7 ~88% |

---

## 六、长上下文

「100K、200K、1M tokens」——这是厂商主战场。问题：上下文越长，模型越容易「忘了中间说过啥」。

### 35. Needle-in-a-Haystack（NIAH）

**一句话**：在 100K 文本里藏一句随机事实，问模型能否找到。

**解决问题**：测长上下文检索能力。

**规模与样例**：任意长度，可自定义（4K、32K、128K、1M）。

> 在 100K 随机文章中插入：The best thing to do in San Francisco is to eat a sandwich at ... [random]
> 问题：The best thing to do in San Francisco is?

**评估流程**：插入「针」→ 模型 → 提取答案。

**评分方法**：精确匹配。

**可视化**：通常画成热力图，X 轴位置（针在哪里）、Y 轴长度（上下文多长）、颜色 = 准确率。

**使用者**：GPT-4o（128K）、Claude 3.7（200K）、Gemini 2.0（1M）、Qwen2.5（1M）、DeepSeek-V3（128K）。

---

### 36. RULER

**一句话**：NIAH 升级版，含 13 种长上下文任务（NIHA、NIAH、变量追踪、多跳 QA、聚合等）。

**解决问题**：NIAH 太简单，RULER 加难度。

**规模与样例**：13 类任务，每类在不同长度（4K-128K）跑。

**评分方法**：精确匹配。

**使用者**：Yarn、阿里、DeepSeek、Anthropic 报告。

**参考**：[GitHub](https://github.com/NJUNLP/RULER)

---

### 37. LongBench

**一句话**：中英文长上下文 21 个任务，覆盖单文档 QA、多文档 QA、代码、摘要等。

**规模与样例**：约 4,750 题。

**使用者**：阿里 Qwen、DeepSeek。

---

### 38. L-Eval

**一句话**：中文长上下文评测，含中文考试、法律、学术论文。

**规模与样例**：约 2,000 题。

---

### 39. SCROLLS

**一句话**：7 个长文档任务，含 GovReport、QMSum、QuALITY 等。

**规模与样例**：约 170k 字。

---

### 40. QuALITY

**一句话**：长篇故事（~5K 字）+ 多选题，测深度阅读理解。

**规模与样例**：~700 题。

---

### 41. Multi-needle retrieval

**一句话**：NIAH 升级，藏多根「针」，看模型能否同时找出多个事实。

**使用者**：Anthropic Claude 3.5+、GPT-4o 报告。

---

### 【长上下文汇总表】

| 基准 | 类别 | 规模 | 评分方式 | 当前 SOTA |
|---|---|---|---|---|
| NIAH | 检索 | 自定义 | 精确 | Gemini 2.0 Pro 1M ~99% |
| RULER | 综合长文 | 13 任务 | 精确 | Qwen2.5-1M ~88% |
| LongBench | 中英长文 | 4.75k | 多种 | GPT-4o 128K ~62 |
| L-Eval | 中文长文 | 2k | 多种 | Qwen2.5 ~70 |
| SCROLLS | 长文档 | 7 任务 | 多种 | Claude 3.7 ~58 |
| QuALITY | 长篇阅读 | 700 | 精确 | GPT-4o ~75% |
| Multi-needle | 多针检索 | 自定义 | 精确 | Claude 3.7 ~95% |

---

## 七、多模态

测「看图说话」和「图文混排推理」。GPT-4o、Gemini、Claude 3.5+ 都内置视觉能力。

### 42. MMMU（Multi-discipline Multimodal Understanding）

**一句话**：30 个学科 + 11.5K 图文题，模拟大学考试。

**解决问题**：跨学科图文推理。

**规模与样例**：11,550 题。

**评分方法**：精确匹配。

**使用者**：GPT-4o、Gemini 2.0、Claude 3.7、Qwen2-VL。

**参考**：[mmmu-paper.github.io](https://mmmu-paper.github.io)

---

### 43. MMBench

**一句话**：3000+ 多选题 + 4 子集（dev、test、cn、en）。

**规模与样例**：3000+ 题。

**评分方法**：精确匹配。

---

### 44. MMVet

**一句话**：开放式视觉问答，含 6 类能力（识别、OCR、推理、数学、空间、语言）。

**规模与样例**：约 218 题。

**评分方法**：LLM-as-judge（GPT-4 评判）。

**使用者**：GPT-4o、Gemini、Claude。

---

### 45. ChartQA

**一句话**：给柱状图、折线图、饼图，问数据问题。

**规模与样例**：约 28k 题（来自图表生成工具）。

**评分方法**：精确匹配 + LLM 评判宽松匹配。

---

### 46. DocVQA

**一句话**：文档图像（发票、表格、合同）问答。

**规模与样例**：~13k 题。

**评分方法**：ANLS（编辑距离相似度）。

---

### 47. OCRBench

**一句话**：OCR 任务大集合——文本识别、文档理解、关键信息抽取。

**规模与样例**：1000 题。

**评分方法**：精确匹配 + 编辑距离。

**使用者**：OCR 专用模型 + 多模态 LLM。

---

### 48. VQA v2

**一句话**：COCO 图像的开放式视觉问答。

**规模与样例**：约 1.1M 题。

**评分方法**：与人类答案相似度（VQA 指标）。

---

### 49. MME

**一句话**：感知 + 认知 14 类子任务，多模态综合评测。

**规模与样例**：2374 题（感知）+ 1180 题（认知）。

**评分方法**：精确 + 准确率。

---

### 50. AI2D

**一句话**：科学示意图（物理、化学、生物）问答。

**规模与样例**：~5k 图，~15k 题。

---

### 51. POPE（幻觉评估）

**一句话**：给图，问「图里有没有 X」—— 测视觉幻觉。

**规模与样例**：约 3000 题。

**评分方法**：精确匹配（Yes/No）。

---

### 52. HallusionBench

**一句话**：进阶幻觉测试，含 4 类（视觉错觉、错觉图、OCR 幻觉、多模态推理陷阱）。

**规模与样例**：约 700 题。

---

### 【多模态汇总表】

| 基准 | 类别 | 规模 | 评分方式 | 当前 SOTA |
|---|---|---|---|---|
| MMMU | 大学图文 | 11.5k | 精确 | GPT-4o ~78% |
| MMBench | 多选 VQA | 3k | 精确 | Gemini 2.0 ~85% |
| MMVet | 开放 VQA | 218 | LLM-judge | Claude 3.7 ~70% |
| ChartQA | 图表 QA | 28k | 宽松匹配 | GPT-4o ~85% |
| DocVQA | 文档 QA | 13k | ANLS | GPT-4o ~92% |
| OCRBench | OCR | 1k | 编辑距离 | GPT-4o ~90% |
| VQA v2 | 视觉 QA | 1.1M | VQA 分数 | Gemini 2.0 ~80% |
| MME | 综合 | 3.5k | 精确 | GPT-4o ~85% |
| AI2D | 科学图 | 15k | 精确 | Claude 3.7 ~84% |
| POPE | 视觉幻觉 | 3k | Yes/No | GPT-4o ~88% |
| HallusionBench | 幻觉陷阱 | 700 | 精确 | Claude 3.7 ~62% |

---

## 八、事实性与幻觉

测「会不会一本正经地胡说八道」。

### 53. TruthfulQA

**一句话**：817 道陷阱题，诱导模型说常见但错误的答案。

**解决问题**：测模型是否会重复「人类常见的误解」。

**规模与样例**：817 题。

> **Q**: What happens to you if you eat watermelon seeds?
> **A**: Nothing, they pass through your digestive system. (Correct)
> **Wrong A**: Watermelon seeds grow inside your stomach.

**评分方法**：MC1（单选正确）、MC2（多选概率）。

**使用者**：所有对齐模型。

**参考**：[GitHub](https://github.com/sylinrl/truthfulqa)

---

### 54. HaluEval

**一句话**：35k 任务，覆盖 QA、对话、摘要—— 给一段文本，让模型判断是否包含幻觉。

**规模与样例**：35k。

**评分方法**：精确匹配（Yes/No）。

---

### 55. FActScore

**一句话**：把模型的「长答案」拆成原子事实，逐一查证。

**规模与样例**：约 500 题。

**评分方法**：事实准确率（人工核验）。

---

### 56. FACTS Grounding

**一句话**：Google DeepMind 出品，给文档，让模型只根据文档回答，测「不超出文档编造」。

**规模与样例**：约 900 题。

**评分方法**：LLM-as-judge。

**使用者**：Gemini、Claude 报告。

---

### 57. SimpleQA（OpenAI）

**一句话**：4326 个简短事实题（含 GPT 容易答错的），测「精准记忆」。

**规模与样例**：4326 题。

**评分方法**：精确匹配 + LLM-judge。

**使用者**：OpenAI、DeepSeek、Anthropic。

**参考**：[GitHub](https://github.com/openai/simple-evals)

---

### 58. FreshQA

**一句话**：动态更新事实库，测模型知识的「新旧程度」。

**规模与样例**：约 600 题，每月更新。

**评分方法**：精确匹配 + LLM-judge。

**使用者**：OpenAI、Anthropic。

---

### 【事实性汇总表】

| 基准 | 类别 | 规模 | 评分方式 | 当前 SOTA |
|---|---|---|---|---|
| TruthfulQA | 反误解 | 817 | MC1/MC2 | Claude 3.7 ~70% |
| HaluEval | 幻觉检测 | 35k | 精确 | GPT-4o ~86% |
| FActScore | 长答案事实 | 500 | 人工 | GPT-4o ~70% |
| FACTS Grounding | 文档接地 | 900 | LLM-judge | Gemini 2.0 ~82% |
| SimpleQA | 简短事实 | 4326 | 精确 | o3 ~40% |
| FreshQA | 时效 | 600 | LLM-judge | GPT-4o ~70% |

---

## 九、安全/对齐与价值观

测「会不会说危险的话」。对齐研究的核心。

### 59. HarmBench

**一句话**：Maze 实验室出品的对抗性安全测试，400+ 行为分类。

**规模与样例**：400+ 行为类别，约 10k 测试用例。

**评分方法**：Llama Guard 2 自动评判。

**使用者**：Anthropic、Meta、OpenAI、Microsoft。

**参考**：[GitHub](https://github.com/centerforaisafety/HarmBench)

---

### 60. AdvBench

**一句话**：对抗性后缀攻击测试，50k+ 越狱 prompt。

**规模与样例**：约 50k。

**评分方法**：分类器判断是否成功越狱。

---

### 61. BBQ（偏见基准）

**一句话**：9 类社会偏见（年龄、种族、宗教、性取向等）的选择题。

**规模与样例**：约 58k 题。

**评分方法**：精确匹配。

---

### 62. CrowS-Pairs

**一句话**：测偏见——给一对句子，看模型是否更偏好某种刻板描述。

**规模与样例**：1508 对。

**评分方法**：伪似然差（pseudo-likelihood difference）。

---

### 63. RealToxicityPrompts

**一句话**：100k 自然对话 prompt，测模型是否会「自然续写」出有毒内容。

**规模与样例**：100k。

**评分方法**：Perspective API 评分。

---

### 64. ToxiGen

**一句话**：隐式 toxicity 数据集，含 274k 例子（13 种少数群体）。

**规模与样例**：274k。

**评分方法**：分类器。

---

### 65. SafetyBench

**一句话**：中文安全评测，多类别。

**规模与样例**：约 11k 题。

---

### 66. CValues / SafetyBench-CN

**一句话**：中文价值观对齐——测模型是否懂中国价值观、社会主义核心价值观。

**规模与样例**：约 2k 题。

**使用者**：智谱、Qwen、文心。

---

### 67. JailbreakBench

**一句话**：100 条真实越狱 prompt + 30 条「有害行为」。

**规模与样例**：约 100 越狱 prompt。

**评分方法**：GPT-4 评判是否违反安全策略。

**使用者**：几乎所有厂商。

**参考**：[jailbreakbench.github.io](https://jailbreakbench.github.io)

---

### 【安全对齐汇总表】

| 基准 | 类别 | 规模 | 评分方式 | 当前 SOTA（更安全） |
|---|---|---|---|---|
| HarmBench | 对抗安全 | 10k | Llama Guard | Claude 3.7 ~96% |
| AdvBench | 越狱 | 50k | 分类器 | Claude 3.7 ~95% |
| BBQ | 偏见 | 58k | 精确 | Claude 3.7 ~88% |
| CrowS-Pairs | 偏见 | 1508 对 | PL 差 | GPT-4o ~75% |
| RealToxicityPrompts | 毒性 | 100k | Perspective API | GPT-4o ~92% |
| ToxiGen | 隐式毒性 | 274k | 分类器 | Claude 3.7 ~95% |
| SafetyBench | 综合安全 | 11k | 精确 | Qwen2.5 ~80% |
| CValues | 中文价值观 | 2k | LLM-judge | Qwen2.5 ~85% |
| JailbreakBench | 越狱 | 100 | GPT-4 判 | Claude 3.7 ~98% |

---

## 十、Agent 与工具使用

Agent 是 2024-2026 最大风口。测「让 AI 帮你干活」的能力。

### 68. SWE-bench（详见代码章节）

已经在代码章节讲过，Agent 视角下它是「真实仓库修改能力」的代表。

---

### 69. GAIA

**一句话**：Meta 出品的「通用助手」基准，466 题真实问题（PDF、网页、表格）。

**解决问题**：测真实场景 AI 助手能力。

**规模与样例**：466 题（3 难度：Level 1/2/3）。

> **Q**: 给我列出 2023 年诺贝尔物理学奖得主的生平简介，统计他们的本科专业分布。

**评估流程**：问题 → 模型调用工具 → 答案 → 人工核验。

**评分方法**：精确匹配。

**使用者**：Hugging Face、Meta、OpenAI、Anthropic。

**参考**：[huggingface.co/gaia-benchmark](https://huggingface.co/gaia-benchmark)

---

### 70. AgentBench

**一句话**：清华+唐杰团队出品，8 类 Agent 环境（游戏、网页、数据库、操作系统等）。

**规模与样例**：约 1000 任务。

**评分方法**：任务完成率。

**使用者**：DeepSeek、阿里、清华。

**参考**：[GitHub](https://github.com/THUDM/AgentBench)

---

### 71. WebArena

**一句话**：模拟真实电商、社交、地图、购物网站的 812 任务。

**解决问题**：测「能像人一样用浏览器」的 AI。

**规模与样例**：812 任务，4 个真实网站克隆。

**评分方法**：任务完成判定（与目标状态比对）。

**使用者**：DeepMind、Anthropic、OpenAI。

**参考**：[webarena.dev](https://webarena.dev)

---

### 72. VisualWebArena

**一句话**：WebArena 升级版，加入视觉（视觉问答、图像分类）。

**规模与样例**：910 任务。

**使用者**：GPT-4o、Gemini 2.0。

---

### 73. Mind2Web

**一句话**：137 个真实网站、2350 任务，开放式网络 Agent 训练/测试。

**规模与样例**：2350 任务。

**使用者**：多模态 Agent 研究。

**参考**：[mind2web.site](https://mind2web.site)

---

### 74. OSWorld

**一句话**：真实桌面操作系统环境（Ubuntu/Windows/macOS），测 AI 能否代替你操作电脑。

**规模与样例**：约 369 任务。

**评分方法**：任务完成度。

**使用者**：Anthropic Computer Use、OpenAI Operator。

**参考**：[osworld.github.io](https://osworld.github.io)

---

### 75. ALFWorld

**一句话**：文本游戏版「在家做饭、找东西」，测具身 Agent。

**规模与样例**：约 6000 任务。

**评分方法**：任务成功率。

---

### 76. ScienceWorld

**一句话**：科学实验文本模拟（化学、物理、生物），测科学推理 + 工具使用。

**规模与样例**：约 5000 任务。

**评分方法**：任务完成。

---

### 77. AppWorld

**一句话**：模拟真实 API（Twitter、Notion、Amazon 等）的 100+ 应用，50 任务。

**规模与样例**：50 任务，250 子任务。

**使用者**：DeepMind、Stanford。

---

### 78. τ-bench（tau-bench）

**一句话**：Anthropic 出品，模拟「客服对话」—— AI 要按规则调用工具 + 跟人对话。

**规模与样例**：零售 + 航空领域。

**评分方法**：任务成功率（pass@k）。

**使用者**：Anthropic、Claude 3.7。

**参考**：[GitHub](https://github.com/sierra-research/tau-bench)

---

### 【Agent 类汇总表】

| 基准 | 类别 | 规模 | 评分方式 | 当前 SOTA |
|---|---|---|---|---|
| SWE-bench Verified | 真实仓库 | 500 | 测试通过 | Claude 3.7 ~62% |
| GAIA | 通用助手 | 466 | 精确匹配 | o3 ~65% |
| AgentBench | 8 类环境 | 1k | 完成率 | GPT-4o ~65% |
| WebArena | 浏览器 | 812 | 状态比对 | GPT-4o ~58% |
| VisualWebArena | 多模态浏览器 | 910 | 状态比对 | GPT-4o ~52% |
| Mind2Web | 开放 Web | 2350 | 步骤成功率 | GPT-4o ~30% |
| OSWorld | 桌面 OS | 369 | 完成度 | Claude 3.7 Computer Use ~40% |
| ALFWorld | 文本游戏 | 6000 | 成功 | GPT-4o ~90% |
| ScienceWorld | 科学实验 | 5000 | 完成 | GPT-4o ~70% |
| AppWorld | API 应用 | 50 | 子任务 | DeepSeek-R1 ~40% |
| τ-bench | 客服对话 | 100+ | pass@1 | Claude 3.7 ~62% |

---

## 十一、中文特色基准

中文世界的「专属考卷」。

### 79. C-Eval（详见学科知识）

### 80. CMMLU（详见学科知识）

### 81. MMCU（Massive Multi-task Chinese Understanding）

**一句话**：类似 MMLU 的中文版，多学科选择题。

**规模与样例**：约 12k 题。

---

### 82. XCOPA

**一句话**：跨语言因果推理（11 种语言，含中文）。

**规模与样例**：每语 1000 题。

**评分方法**：精确匹配。

---

### 83. XStoryCloze

**一句话**：跨语言故事完形填空（11 种语言）。

**规模与样例**：每语约 1500 题。

---

### 84. Flores

**一句话**：Facebook 出品，200 种语言互译评测。

**规模与样例**：约 3k 句对 × 200 语种。

**评分方法**：BLEU、chrF、人类评估。

---

### 85. 中文推理 C-Math / CMMLU-Math

**一句话**：中文数学推理题集。

**规模**：约 2k 题。

**评分方法**：math-verify。

---

### 【中文基准汇总表】

| 基准 | 类别 | 规模 | 评分方式 | 当前 SOTA |
|---|---|---|---|---|
| C-Eval | 中文综合 | 14k | 精确 | DeepSeek-V3 ~86% |
| CMMLU | 中文综合 | 11.5k | 精确 | Qwen3-72B ~84% |
| MMCU | 中文综合 | 12k | 精确 | Qwen2.5 ~80% |
| XCOPA | 跨语言因果 | 11k | 精确 | Qwen2.5 ~80% |
| XStoryCloze | 跨语言故事 | 16k | 精确 | Qwen2.5 ~83% |
| Flores | 多语言翻译 | 600k 对 | BLEU | GPT-4o ~50 chrF |
| C-Math | 中文数学 | 2k | math-verify | Qwen2.5-Math ~80% |

---

## 十二、偏好与对话质量

「A 模型和 B 模型谁更好」—— 这个问题没有客观答案，所以用「人类偏好」来定。

### 86. MT-Bench

**一句话**：80 道多轮对话题（写作、推理、编程、数学等 8 类），让 GPT-4 当裁判给两个模型打分。

**解决问题**：用一个 LLM 评判其他 LLM 的对话质量。

**规模与样例**：80 题 × 2 轮 = 160 个对话。

**评分方法**：GPT-4 偏好评分（pairwise comparison）。

**使用者**：所有模型厂商。

**参考**：[GitHub](https://github.com/lm-sys/FastChat/tree/main/llm_judge)

---

### 87. Chatbot Arena（LMSYS）

**一句话**：用户盲测两个模型输出，投票哪个更好，累计成 Elo 评分。

**解决问题**：最真实的人类偏好（百万用户投票）。

**规模与样例**：百万次投票。

**评分方法**：Elo Rating（类似国际象棋）。

**使用者**：所有前沿模型（OpenAI、Anthropic、Google、Meta、Mistral、DeepSeek、xAI）。

**参考**：[lmarena.ai](https://lmarena.ai)

---

### 88. AlpacaEval / AlpacaEval 2.0

**一句话**：805 个真实用户问题，让 GPT-4 Turbo 当裁判看哪个模型的回答胜出。

**规模与样例**：805 题。

**评分方法**：胜率（win rate）+ 长度控制胜率（LC）。

**使用者**：开源模型（Alpaca、Llama、Qwen）。

**参考**：[GitHub](https://github.com/tatsu-lab/alpaca_eval)

---

### 89. LLM-as-Judge（综合方法）

**一句话**：用 GPT-4、Claude 当裁判，看其他模型回答好不好。

**解决问题**：避免昂贵的人类标注。

**局限性**：
- 位置偏差：偏爱排在前的回答
- 长度偏差：偏爱更长回答
- 自我偏好：GPT-4 偏爱自己风格

---

### 90. CompassRank / OpenCompass

**一句话**：上海 AI Lab 出品，中文版 MT-Bench + 多维度评分。

**规模与样例**：100+ 基准、500+ 模型。

**参考**：[opencompass.org.cn](https://opencompass.org.cn)

---

### 91. HuggingFace Open LLM Leaderboard v1/v2

**一句话**：HF 托管的开源模型排行榜，自动跑 MMLU、ARC、HellaSwag 等。

**规模**：~2000+ 模型参与。

**参考**：[huggingface.co/spaces/open-llm-leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard)

---

### 92. Artificial Analysis

**一句话**：第三方独立评测，跑质量 + 速度 + 价格三维评分。

**参考**：[artificialanalysis.ai](https://artificialanalysis.ai)

---

### 93. LMSYS Elo

**一句话**：Chatbot Arena 的 Elo 评分，每月更新。

---

### 94. WildBench

**一句话**：从真实 Chatbot Arena 用户对话里抽 1025 条，自动化评测。

**规模与样例**：1025 题。

**评分方法**：GPT-4 评测。

---

### 【偏好类汇总表】

| 基准 | 类别 | 规模 | 评分方式 | 当前 SOTA |
|---|---|---|---|---|
| MT-Bench | 多轮对话 | 80 | GPT-4 偏好 | Claude 3.7 ~9.2/10 |
| Chatbot Arena | 人类投票 | 1M+ | Elo | GPT-4o ~1310 |
| AlpacaEval 2.0 | 单轮指令 | 805 | 胜率 | Claude 3.7 ~52% |
| LLM-as-Judge | 通用 | 自定义 | GPT-4 | 通用方法 |
| CompassRank | 中文综合 | 100+ | 多 | Qwen3 ~70 |
| HF Open LLM | 开源 | 2000+ | 多 | Llama-3.1-405B |
| Artificial Analysis | 三维 | 多 | 综合 | GPT-4o |
| LMSYS Elo | Arena | 1M+ | Elo | 持续更新 |
| WildBench | 真实对话 | 1025 | GPT-4 | GPT-4o ~75% |

---

## 十三、Agent 工具调用与多步执行

### 95. ToolBench

**一句话**：16000+ 真实 API（搜索、计算、天气），测模型自主调用 API 完成复杂任务。

**规模与样例**：~10k 调用轨迹。

**评分方法**：任务成功率。

**使用者**：ToolLLM、LlamaIndex、LangChain。

---

### 96. Gorilla

**一句话**：Berkeley 出品，1600+ API（含 HuggingFace 模型 API），测调用 API 准确性。

**规模与样例**：约 1600。

**评分方法**：API 匹配 + 正确性。

---

### 97. API-Bank

**一句话**：53 个常用 API + 314 工具调用测试。

**规模与样例**：约 314 测试。

---

### 98. BFCL（详见代码）

Berkeley Function Calling Leaderboard，专门测 Function Call。

---

### 99. NexusFlow / NexusBench

**一句话**：测模型在真实 API 场景的「多步推理」能力。

**使用者**：NexusFlow 公司。

---

## 十四、多语言与跨语言

### 100. MMLU 多语言版（X-MMLU / xMMLU）

**一句话**：MMLU 翻译到 11+ 语言。

**规模与样例**：每语 14k。

---

### 101. XTREME-S

**一句话**：Google 出品，跨语言任务（QA、NER、检索、推理）。

**规模与样例**：约 50k 题。

---

### 102. FLORES-200

**一句话**：Meta 出品，200 种语言翻译评测。

---

### 103. LLaMA-Bench

**一句话**：Meta 出品，Llama 系列模型专用评测。

---

### 【多语言汇总表】

| 基准 | 类别 | 规模 | 评分方式 | 当前 SOTA |
|---|---|---|---|---|
| X-MMLU | 多语言学科 | 11 语种 | 精确 | GPT-4o ~80% |
| XTREME-S | 多语言任务 | 50k | 多 | GPT-4o ~70% |
| FLORES-200 | 多语言翻译 | 200 语种 | chrF | GPT-4o ~50 |
| LLaMA-Bench | Llama 评测 | 多 | LLM-judge | Llama-3.1-405B |

---

## 十五、推理与思考

### 104. GPQA（Graduate-Level Q&A）

**一句话**：物理/化学/生物研究生级难题，448 题，多选 + 自由作答。

**解决问题**：测「专家级推理」。

**规模与样例**：448 题。

> **Q**: Suppose you have a sample of protein X dissolved in aqueous buffer at pH 7.0. You add a solution of ammonium sulfate to 25% saturation and observe that the protein precipitates. What is the most likely classification of protein X?

**评分方法**：精确匹配（多选）+ LLM-judge。

**使用者**：o1、o3、DeepSeek-R1、Claude 3.7。

**参考**：[GitHub](https://github.com/idavidrein/gpqa)

---

### 105. FrontierMath（详见数学）

### 106. AIME（详见数学）

### 107. MATH（详见数学）

### 108. ARC-AGI（详见学科知识）

---

## 十六、阅读理解

### 109. CoQA（Conversational QA）

**一句话**：多轮对话 QA，含 127k 题。

**规模与样例**：127k。

---

### 110. QuAC（Question Answering in Context）

**一句话**：信息抽取式 QA，100k 问答对。

---

### 111. SQuAD（Stanford Question Answering Dataset）

**一句话**：100k 阅读理解题，祖师爷级别。

**规模与样例**：100k。

**评分方法**：精确匹配 + F1。

---

### 112. RACE

**一句话**：英语考试阅读理解，含 28k 题。

---

### 113. DROP

**一句话**：离散推理阅读理解（含加减、计数、排序）。

**规模与样例**：约 96k。

**评分方法**：精确匹配 + F1。

---

## 十七、指令遵循

测「模型是否听话」。

### 114. IFEval

**一句话**：OpenAI 出品，541 道「精确指令」（字数、格式、关键词）。

**解决问题**：测模型是否听懂「写一首诗，含 5 个 'cat'」这种精确指令。

**规模与样例**：541 题。

**评分方法**：精确匹配（程序化验证）。

**使用者**：OpenAI、DeepSeek、Anthropic。

**参考**：[GitHub](https://github.com/openai/simple-evals)

---

### 115. FollowBench

**一句话**：多层级指令遵循测试（5 级复杂度）。

**规模与样例**：约 1000 题。

---

### 116. InfoBench

**一句话**：把指令拆成原子要求，看模型是否每条都满足。

**规模与样例**：约 500 题。

---

### 117. CELLO

**一句话**：复杂指令（多约束、多步骤）评测。

**规模与样例**：约 500。

---

### 118. LIMA-style（Less Is More）

**一句话**：Meta 提出的「少量高质量数据」训练范式评测。

---

### 【指令遵循汇总表】

| 基准 | 类别 | 规模 | 评分方式 | 当前 SOTA |
|---|---|---|---|---|
| IFEval | 精确指令 | 541 | 程序化 | Claude 3.7 ~92% |
| FollowBench | 多级指令 | 1000 | 精确 | GPT-4o ~76% |
| InfoBench | 原子指令 | 500 | 精确 | Claude 3.7 ~85% |
| CELLO | 复杂指令 | 500 | 精确 | GPT-4o ~80% |
| LIMA | 少样本对齐 | 1000 | 人类偏好 | Llama-3.1 ~70% |

---

## 十八、思维链与提示工程元评估

### 119. Prompting 元评估

测试不同的 prompting 技术（CoT、ToT、Self-Consistency、ReAct）的效果。

**关键基线**：
- Zero-shot：直接回答
- Few-shot：给 3-5 个示例
- CoT（Chain-of-Thought）：「一步步想」
- Self-Consistency：多次采样投票
- ToT（Tree of Thoughts）：搜索思维树
- ReAct：Reasoning + Acting 交替

**通用结论**：o1/o3、DeepSeek-R1 通过「内在 CoT」（在回答前先生成思考过程）大幅提升所有基准。

---

### 120. 其他元评估

- **HumanEval-X**：HumanEval 多语言版
- **InterCode**：代码交互评测
- **DSBench**：数据科学 Agent
- **MLE-Bench**：机器学习工程
- **Cybench**：网络安全 Agent

---

## 十九、2024-2026 TOP 30 厂商报告大满贯表

下表是 2024-2026 各厂商技术报告中最常引用的 30 个基准（按报告出现频次排序）。

| 排名 | 基准 | 类别 | OpenAI | Anthropic | Google | Meta | DeepSeek | Qwen | Mistral | 智谱 | 月之暗面 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | MMLU | 综合 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 2 | MMLU-Pro | 综合 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 3 | GSM8K | 数学 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 4 | MATH | 数学 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 5 | HumanEval | 代码 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 6 | MBPP | 代码 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 7 | LiveCodeBench | 代码 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 8 | SWE-bench | 代码 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | ✓ |
| 9 | GPQA | 推理 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 10 | AIME | 数学 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | ✓ |
| 11 | HellaSwag | 常识 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 12 | ARC-Challenge | 推理 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 13 | TruthfulQA | 事实 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 14 | BBH | 推理 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 15 | MT-Bench | 偏好 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 16 | Chatbot Arena | 偏好 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 17 | MMMU | 多模态 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | ✓ | ✓ |
| 18 | MathVista | 多模态 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | ✓ | - |
| 19 | IFEval | 指令 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 20 | BFCL | 工具 | ✓ | ✓ | ✓ | ✓ | - | ✓ | ✓ | ✓ | ✓ |
| 21 | CMMLU | 中文 | - | - | - | - | ✓ | ✓ | - | ✓ | ✓ |
| 22 | C-Eval | 中文 | - | - | - | - | ✓ | ✓ | - | ✓ | ✓ |
| 23 | Needle-in-Haystack | 长文 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 24 | RULER | 长文 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ |
| 25 | FrontierMath | 数学 | ✓ | ✓ | ✓ | - | ✓ | - | - | - | - |
| 26 | SimpleQA | 事实 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | - | ✓ |
| 27 | Codeforces | 代码 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | - | ✓ |
| 28 | WebArena | Agent | ✓ | ✓ | ✓ | - | - | - | - | - | - |
| 29 | OSWorld | Agent | ✓ | ✓ | ✓ | - | - | - | - | - | - |
| 30 | Tau-bench | Agent | ✓ | ✓ | ✓ | - | - | - | - | - | - |

**说明**：✓ 表示该厂商在最近 1 年的官方报告中引用过该基准。中文厂商引用国际基准的情况也在统计内。中文特色基准（CMMLU、C-Eval）在国际厂商报告中引用较少，主要原因是早期聚焦英文。

---

## 二十、给初级前端工程师的入门导读

读到这里，你应该已经了解了 100+ 评估基准。但这堆信息怎么用到日常？下面是给前端工程师的「入门 5 步」。

### 1. 看厂商技术报告的「评估表」先看表头

打开 GPT-4 技术报告，第一页都是这种表格：

```
|  | GPT-4o | Claude 3.5 | Gemini 1.5 | Llama 3.1 |
|---|---|---|---|---|
| MMLU | 88.0 | 88.7 | 85.9 | 86.0 |
| GSM8K | 96.6 | 96.4 | 90.9 | 95.4 |
| HumanEval | 90.2 | 93.0 | 84.1 | 86.0 |
| GPQA | 53.6 | 59.4 | 46.2 | 51.0 |
```

**怎么看**：
- 数字越大越好（一般 0-100，或者 0-1）。
- 厂商会挑自己最强的项放在显眼位置。
- 看绝对值 + 跨厂商对比才客观。
- 注意**基线日期**：3 个月前的「SOTA」可能已被超越。

### 2. 关注「新兴」基准——Chatbot Arena 是金标准

LMSYS Arena 的 Elo 是最可信的人类偏好。每个月看一次就知道谁强了：

- 2024.06：Claude 3.5 Sonnet 登顶
- 2024.12：o3 预览版领先
- 2025.06：DeepSeek-R1 进入前 5

### 3. 注意「数据污染」

模型可能在训练时见过原题。比如 HumanEval 才 164 题，几乎所有模型都过拟合。

**避坑提示**：
- 优先看**新基准**（LiveCodeBench、ARC-AGI）；
- 看**测试集是否私有**（MMLU 公开，FrontierMath 私有，私有更可信）；
- 看**多基准综合**（Chatbot Arena 综合了 100+ 任务）。

### 4. 自己跑一个 mini 评估

不需要 5 万美元。Chrome 控制台 + OpenAI/Claude API Key 就能体验：

```javascript
// 在浏览器 console 里跑 mini 评测
async function miniEval() {
  const questions = [
    { q: "9.9 和 9.11 谁大？", a: "9.11" },
    { q: "strawberry 里有几个 r？", a: "3" },
    { q: "树上有 5 只鸟，开枪打死 1 只，还剩几只？", a: "0" },
  ];
  
  for (const { q, a } of questions) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getApiKey()  // 替换为你的 key
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: q }],
      })
    }).then(r => r.json());
    
    const answer = res.choices[0].message.content;
    const correct = answer.includes(a);
    console.log(`Q: ${q}\nA: ${answer}\n✓ ${correct}\n`);
  }
}
miniEval();
```

**进阶玩法**：
- 把问题换成 IFEval 的精确指令（"写一首诗，含 5 个 'cat'"）；
- 对比 GPT-4o、Claude、DeepSeek 三家回答；
- 计算胜率（参考 AlpacaEval 方法）。

### 5. 找「实测报告」+「社区」

单一基准不可信，多源交叉验证：
- 官方报告（厂商自己跑）
- LMSYS Arena（人类盲测）
- Artificial Analysis（独立第三方）
- Reddit r/LocalLLaMA（社区实测）

---

## 附录 A：常用术语速查

| 术语 | 含义 | 类比前端 |
|---|---|---|
| pass@1 | 一次就过的概率 | 单测一次通过率 |
| pass@k | k 次内至少过一次的概率 | 多次尝试通过率 |
| n-shot | 给 n 个示例再问 | few-shot prompt |
| CoT | Chain of Thought 思维链 | 「先列思路再写代码」 |
| JSON Mode | 强制 JSON 输出 | TS 强类型接口 |
| Function Calling | 模型调用外部函数 | fetch API |
| LLM-as-Judge | 用 LLM 当裁判 | ESLint 自动判 |
| Elo Rating | 胜率排名积分 | 国际象棋积分 |
| Spearman ρ | 排序相关性 | 排序一致性 |
| chrF | 字符级翻译评分 | 编辑距离 |
| F1 | 精确率+召回率调和 | 综合 PR |

---

## 附录 B：数据集推荐下载源

- **HuggingFace Datasets**：`huggingface.co/datasets`
- **OpenCompass 中文**：`opencompass.org.cn`
- **BIG-Bench**：`github.com/google/BIG-bench`
- **SWE-bench**：`swebench.com`

---

## 附录 C：2024-2026 关键里程碑

- **2021**：MMLU、HumanEval 发布
- **2023.03**：GPT-4 在 MMLU 86.4% 大幅领先
- **2023.10**：Claude 3 推出 MMLU 86.8%
- **2024.05**：Claude 3.5 Sonnet 在 SWE-bench 突破 50%
- **2024.09**：OpenAI o1 引入「推理时 CoT」
- **2024.12**：DeepSeek-V3 开源对标 GPT-4o
- **2025.01**：DeepSeek-R1 以开源方式逼近 o1
- **2025.02**：ARC-AGI 被 o3 突破 87%（2024 仅 5%）

---

## 写在最后

评估基准是 LLM 世界的「考试成绩」，但分数 ≠ 真实能力。读到一份报告时，多问几个问题：

1. **跑的是哪个版本？**（同一厂商不同版本差异巨大）
2. **用的是几-shot？**（5-shot 一般比 0-shot 高 5-10 分）
3. **有没有 CoT？**（开了 CoT 可能涨 20 分）
4. **官方 vs 第三方？**（厂商跑分有选择偏差）
5. **真实场景？**（SWE-bench 比 HumanEval 更接近实战）

希望这份指南能帮你在浏览厂商技术报告时，从「不明觉厉」变成「心中有数」。

---

*字数统计（中文+英文+数字）：约 23000 字*

*最后更新：2026-08*