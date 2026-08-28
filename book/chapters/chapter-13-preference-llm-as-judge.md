# 13. 人类偏好、LLM-as-Judge 与 Arena 生态

> **如果只读一节**：MT-Bench = 8 类对话任务的多轮评测；Chatbot Arena = 真实人类盲评；AlpacaEval = 自动化 Arena；CompassRank = 中文偏好榜单。

## 13.1 本章目标

读完后你能：

- 知道为什么人类偏好是"最难测但最准"的
- 区分 MT-Bench / Arena / AlpacaEval
- 知道 LLM-as-Judge 的实现与偏差
- 读懂 LMSYS Chatbot Arena 排行榜

## 13.2 为什么需要"偏好"评估

**传统评估的局限**

```
MMLU：4 选 1，不能测"对话质量"
GSM8K：1 个数字，不能测"推理过程"
```

**但用户实际关心的是**：

- "回答得自然吗？"
- "逻辑通顺吗？"
- "有礼貌吗？"
- "长对话记得上文吗？"

**这些只能用"偏好"评估**。

## 13.3 MT-Bench / MT-Bench++

**一句话**

> 80 道多轮对话，8 大类，**测"多轮对话能力"**。

**8 大类**

| 类别 | 示例 |
|---|---|
| Writing | "写一篇关于环保的演讲" |
| Roleplay | "扮演苏格拉底和我对话" |
| Reasoning | "这道逻辑题怎么解？" |
| Math | "解这个数学问题" |
| Extraction | "从这段文本中提取关键信息" |
| STEM | "解释黑洞" |
| Humanities | "分析这首诗" |
| Coding | "实现一个 LRU cache" |

**评分**

- LLM-as-Judge（GPT-4 当裁判）
- 打分 1-10
- **pairwise comparison**（A vs B 谁更好）

**MT-Bench++**

- 加入了更难的数学/推理题
- 避免被针对性训练刷分

**当前 SOTA**

| 模型 | MT-Bench（GPT-4 Judge） |
|---|---|
| GPT-4o | 9.32 |
| Claude 3.5 Sonnet | 9.10 |
| Gemini 1.5 Pro | 8.86 |
| DeepSeek-V3 | 8.93 |
| Qwen2.5-72B | 8.80 |
| Llama 3.1-405B | 8.92 |

## 13.4 Chatbot Arena（LMSYS）

**一句话**

> 真实人类盲评的 LLM 对战平台。**Elo 评分系统。**

**工作原理**

```
1. 用户输入问题
2. 随机选两个模型（盲评，不知道是谁）
3. 两个模型都回答
4. 用户投票：A 更好 / B 更好 / 平局 / 都不好
5. 用 Elo 算法更新两个模型分数
6. 投票达到阈值后，公布排行榜
```

**数据规模**

- 投票数：> 2,000,000（截至 2026）
- 参与的模型：> 200
- 平台：lmarena.ai

**Elo 算法**

```typescript
// Elo 更新公式
function updateElo(ratingA: number, ratingB: number, scoreA: number, k = 32): { newA: number; newB: number } {
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 - expectedA;
  return {
    newA: ratingA + k * (scoreA - expectedA),
    newB: ratingB + k * ((1 - scoreA) - expectedB),
  };
}
// scoreA: 1=A 胜, 0.5=平, 0=A 输
```

**当前 SOTA（2026）**

| 排名 | 模型 | Elo |
|---|---|---|
| 1 | GPT-4o | 1287 |
| 2 | Claude 3.5 Sonnet | 1271 |
| 3 | Gemini 1.5 Pro | 1260 |
| 4 | DeepSeek-V3 | 1256 |
| 5 | Qwen2.5-72B | 1245 |

**优势 vs 局限**

| 优势 | 局限 |
|---|---|
| 真实人类判断 | 投票者人群偏差（英文为主） |
| 累积大样本 | 容易被刷票（IP 攻击） |
| 实时更新 | 题目分布不均 |
| 包含多语言 | 难以复现（每次投票都不同） |

## 13.5 AlpacaEval & AlpacaEval 2.0

**一句话**

> 自动化版的"Arena"。**用 GPT-4 当 judge 跑 800+ 题。**

**流程**

```
1. 准备 805 道题（来自 AlpacaEval 集）
2. 让被测模型生成回答
3. 让 GPT-4-Turbo 当 judge，比较 vs 参考答案（GPT-4 的回答）
4. 输出 Win Rate（被测模型胜率）
```

**与 Arena 的区别**

| Arena | AlpacaEval |
|---|---|
| 真实人类投票 | GPT-4 投票 |
| 持续更新 | 固定 805 题 |
| 题目开放 | 题目固定 |
| 受人群偏差 | 受 GPT-4 偏差 |

**当前 SOTA**

| 模型 | AlpacaEval 2.0 LC Win Rate |
|---|---|
| GPT-4o | 57.5% |
| Claude 3.5 Sonnet | 50.0% |
| Gemini 1.5 Pro | 48.0% |
| DeepSeek-V3 | 49.0% |
| Qwen2.5-72B | 47.0% |

**LC** = Length-Controlled（控制回答长度后的胜率，因为 GPT-4 偏长答案）。

## 13.6 CompassRank（OpenCompass）

**一句话**

> OpenCompass 出的中文偏好榜单，**含中英双语**。

**特色**

- 覆盖 100+ 模型
- 中英文混合
- 多维度（学科、推理、Agent、安全、对话）

## 13.7 Hugging Face Open LLM Leaderboard

**一句话**

> Hugging Face 维护的开源模型榜单。**基于 6 个核心基准。**

**6 个核心基准**

| 基准 | 测什么 |
|---|---|
| MMLU | 学科知识 |
| ARC-Challenge | 推理 |
| HellaSwag | 常识 |
| TruthfulQA | 真实性 |
| Winogrande | 代词 |
| GSM8K | 数学 |

**局限**

- 已被刷到 90%+，区分度差
- 已停止更新（2024 年）
- 后续：v2 版本（IFEval、BBH、MATH、GPQA、MUSR、MMLU-Pro）

## 13.8 LLM-as-Judge 工程实现

**基础版**

```typescript
async function judgeWithLLM(question: string, answerA: string, answerB: string): Promise<'A' | 'B' | 'tie'> {
  const prompt = `Compare the two responses to the question. Which is better?

Question: ${question}

Response A: ${answerA}

Response B: ${answerB}

Output JSON: {"winner": "A" | "B" | "tie", "reason": "..."}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0, // 评分要稳定
  });
  return JSON.parse(res.choices[0].message.content!).winner;
}
```

**高级版：位置偏差缓解**

```typescript
async function judgeDebiased(question: string, answerA: string, answerB: string): Promise<'A' | 'B' | 'tie'> {
  // 跑两次，交换 A/B 顺序
  const [r1, r2] = await Promise.all([
    judgeWithLLM(question, answerA, answerB),
    judgeWithLLM(question, answerB, answerA),
  ]);
  // r1 答 A 胜 & r2 答 B 胜 = 一致胜 A
  if (r1 === 'A' && r2 === 'B') return 'A';
  if (r1 === 'B' && r2 === 'A') return 'B';
  return 'tie';
}
```

**Multi-judge 投票**

```typescript
async function judgeEnsemble(question: string, answerA: string, answerB: string): Promise<'A' | 'B' | 'tie'> {
  const judges = ["gpt-4o", "claude-3-5-sonnet", "gemini-1.5-pro"];
  const votes = await Promise.all(judges.map(j => judgeWithLLM(j, question, answerA, answerB)));
  const aWins = votes.filter(v => v === 'A').length;
  const bWins = votes.filter(v => v === 'B').length;
  if (aWins > bWins) return 'A';
  if (bWins > aWins) return 'B';
  return 'tie';
}
```

## 13.9 WildBench / Arena Hard / AlpacaEval 3.0

**WildBench**

- 真实用户 1k+ 任务
- GPT-4 评分
- **任务真实，难度高**

**Arena Hard**

- LMSYS 出的"硬题"版本
- 5,000 道从 Arena 抽出的难题
- **比 MT-Bench 难 3x**

**AlpacaEval 3.0**

- 加入更长、更复杂的题目
- 用 Claude 3 当 judge（减少自偏好）

## 13.10 章节汇总

| 基准 | 评分方式 | 题目数 | 当前 SOTA 模型 |
|---|---|---|---|
| MT-Bench | LLM Judge | 80 | GPT-4o (9.32) |
| Chatbot Arena | 人类投票 | 无限 | GPT-4o (Elo 1287) |
| AlpacaEval 2.0 | LLM Judge | 805 | GPT-4o (57.5%) |
| CompassRank | 综合 | 100+ | GPT-4o |
| HF Open LLM v1 | 6 基准 | ~6k | Llama 3.1-405B |
| WildBench | LLM Judge | 1k | GPT-4o |
| Arena Hard | LLM Judge | 5k | Claude 3.5 (90%) |

## 13.11 实战：跑 MT-Bench

```bash
# 用 FastChat
git clone https://github.com/lm-sys/FastChat
cd FastChat
pip install -e .

# 跑 MT-Bench
python fastchat/llm_judge/gen_model_answer.py \
  --model-path Qwen/Qwen2.5-7B-Instruct \
  --model-id qwen2.5-7b

python fastchat/llm_judge/gen_judgment.py \
  --model-list qwen2.5-7b gpt-4o \
  --judge-model gpt-4o
```

## 13.12 验收自测

1. **选择**：哪个基准用真实人类盲评？
   - A. MT-Bench
   - B. AlpacaEval
   - C. Chatbot Arena
   - D. CompassRank

2. **简答**：为什么 LLM-as-Judge 会有"自偏好"偏差？

3. **实操**：用 GPT-4 当 judge，写一个 pairwise 评估脚本评估两个模型。

## 13.13 延伸阅读

⭐⭐⭐
- [LMSYS Chatbot Arena](https://lmarena.ai/) — 实时排行榜
- [MT-Bench 论文](https://arxiv.org/abs/2306.05685) — 多轮对话
- [AlpacaEval](https://tatsu-lab.github.io/alpaca_eval/) — 自动化 Arena

⭐⭐
- [OpenCompass 榜单](https://opencompass.org.cn/rank) — 中文偏好
- [Hugging Face Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) — 开源模型
- [WildBench](https://github.com/allenai/WildBench) — 真实用户任务
- [Arena Hard](https://github.com/lm-sys/arena-hard) — 硬题

⭐
- [PandaLM](https://github.com/WeOpenML/PandaLM) — 训练专门当 judge 的模型
- [Prometheus](https://github.com/kaistAI/Prometheus) — 开源 LLM Judge
