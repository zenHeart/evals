# 15. LLM-as-Judge 工程化：从 prompt 到偏差控制

> **如果只读一节**：LLM-as-Judge = 用一个 LLM 评另一个 LLM 的输出。**关键 = (1) 用强模型 (2) CoT prompt (3) 缓解 4 大偏差 (4) 多次采样**。

## 15.1 本章目标

读完后你能：

- 写一个高质量的 LLM-as-Judge prompt
- 缓解 4 大已知偏差
- 知道何时 LLM-as-Judge 可信、何时不可信
- 知道用其他 LLM 评自己的反偏见做法

## 15.2 为什么需要 LLM-as-Judge

### 传统评分的痛点

```
开放式问题："请评价这段代码的风格"
→ 没有标准答案
→ 规则匹配做不了
→ 人类评估太贵
```

**LLM-as-Judge** 提供"次优"解决方案：
- 接近人类判断（一致率 70-80%）
- 便宜快速
- 可扩展

## 15.3 4 大已知偏差

### 偏差 1：位置偏差

**实验**：让 GPT-4 当 judge，比较 A/B 两个答案。多次交换 A/B 位置，统计胜率。

```
不交换：A 胜 60%
交换后：A 胜 30%
```

**原因**：GPT-4 系统性偏好"在前面"或"在后面"的答案。

### 偏差 2：长度偏差

**实验**：长答案 vs 短答案，胜率 60-40。

**原因**：长的答案"看起来"更详细 = 更好。

### 偏差 3：自偏好

**实验**：GPT-4 评 GPT-4 vs Claude 的答案 → GPT-4 胜率 60%+。

**原因**：模型对自己生成的文本"更熟悉"。

### 偏差 4：格式偏差

**实验**：Markdown / bullet point / 长段落 vs 简单回答。

**原因**：训练时 markdown 评分更高。

## 15.4 一个完整的 LLM-as-Judge Prompt

```typescript
const JUDGE_PROMPT = `
# Role
You are a strict expert evaluator for [DOMAIN]. Your job is to objectively compare two AI responses.

# Evaluation Criteria
1. **Correctness** (40%): Is the response factually correct and accurate?
2. **Completeness** (30%): Does it address all aspects of the question?
3. **Clarity** (20%): Is the response well-structured and easy to understand?
4. **Conciseness** (10%): Is it appropriately brief (not too long, not too short)?

# Task
Compare Response A and Response B. Decide which is better.

# Question
{question}

# Response A
{responseA}

# Response B
{responseB}

# Output Format
Provide your evaluation in this exact JSON format:
{
  "winner": "A" | "B" | "tie",
  "reasoning": "<step-by-step reasoning>",
  "scores": {
    "A": { "correctness": 0-10, "completeness": 0-10, "clarity": 0-10, "conciseness": 0-10 },
    "B": { "correctness": 0-10, "completeness": 0-10, "clarity": 0-10, "conciseness": 0-10 }
  }
}
`;
```

## 15.5 缓解偏差的 4 个技巧

### 技巧 1：交换位置 + 取一致

```typescript
async function judgeDebiased(
  question: string,
  answerA: string,
  answerB: string
): Promise<'A' | 'B' | 'tie'> {
  // 跑两次，交换 A/B
  const [r1, r2] = await Promise.all([
    callJudge(question, answerA, answerB),
    callJudge(question, answerB, answerA),
  ]);

  // r1 选 A & r2 选 B → 一致选 A
  if (r1.winner === 'A' && r2.winner === 'B') return 'A';
  if (r1.winner === 'B' && r2.winner === 'A') return 'B';
  return 'tie';
}
```

### 技巧 2：长度归一化

```typescript
// 截断到相同长度
function normalizeLength(a: string, b: string): [string, string] {
  const avgLen = (a.length + b.length) / 2;
  if (a.length > avgLen * 1.5) return [a.slice(0, avgLen), b];
  if (b.length > avgLen * 1.5) return [a, b.slice(0, avgLen)];
  return [a, b];
}
```

### 技巧 3：交叉评估

```typescript
// 用 Claude 评 GPT-4，用 GPT-4 评 Claude
async function crossJudge(
  question: string,
  answerA: string, // from GPT-4
  answerB: string, // from Claude
): Promise<'A' | 'B' | 'tie'> {
  return judgeWithLLM(CLAUDE_JUDGE, question, answerA, answerB);
}
```

### 技巧 4：Multi-judge 投票

```typescript
async function ensembleJudge(
  question: string,
  answerA: string,
  answerB: string
): Promise<'A' | 'B' | 'tie'> {
  const judges = [GPT4_JUDGE, CLAUDE_JUDGE, GEMINI_JUDGE];
  const votes = await Promise.all(
    judges.map(j => judgeWithLLM(j, question, answerA, answerB))
  );
  const aWins = votes.filter(v => v === 'A').length;
  const bWins = votes.filter(v => v === 'B').length;
  if (aWins > bWins) return 'A';
  if (bWins > aWins) return 'B';
  return 'tie';
}
```

## 15.6 Pairwise vs Single Rating

### Pairwise（A vs B）

```
"Which is better: A or B?"
→ 输出 winner
```

**优点**：
- 更稳定
- 人类也擅长 pairwise
- 易实现 Elo

**缺点**：
- 需要两个答案
- 难扩展到 N 个模型

### Single Rating（给 A 打分）

```
"Rate A on scale 1-10"
→ 输出分数
```

**优点**：
- 一次评一个
- 可直接排序

**缺点**：
- 评分标准不一致（不同 prompt 给不同分布）
- 偏差更大

**经验**：能用 pairwise 就用 pairwise。

## 15.7 CoT（Chain-of-Thought）评分

### 加与不加 CoT 的对比

```
无 CoT:  "A is better"  (50% 一致)
有 CoT:  "Step 1: A is correct. Step 2: B is more concise..."  (75% 一致)
```

**CoT prompt 模板**：

```typescript
const COT_PROMPT = `
Before deciding, walk through these steps:
1. What is the question asking?
2. What are the key requirements?
3. Does Response A meet them? (list strengths/weaknesses)
4. Does Response B meet them? (list strengths/weaknesses)
5. Based on the criteria, which is better overall?
6. Final verdict: A, B, or tie.
`;
```

## 15.8 Reference-Based Grading

**当有参考答案时**：

```typescript
const GRADING_PROMPT = `
# Task
Compare the model's response to the reference answer.

# Question
{question}

# Reference Answer
{reference}

# Model Response
{response}

# Scoring Criteria
- 5 = Perfect match (semantically equivalent)
- 4 = Mostly correct, minor differences
- 3 = Partially correct
- 2 = Major errors
- 1 = Completely wrong
- 0 = Refused to answer / irrelevant

# Output
{ "score": 1-5, "reasoning": "..." }
`;
```

## 15.9 何时 LLM-as-Judge 不可信

| 任务 | 可靠性 |
|---|---|
| 事实性查核 | ⚠️ 中（LLM 也会幻觉） |
| 长文本摘要 | ⚠️ 中（摘要质量难评） |
| 创意写作 | ✅ 较高（人类也难评） |
| 代码正确性 | ✅ 高（有运行结果） |
| 安全性 | ✅ 高（"是否违反规则"清晰） |
| 数学推理 | ⚠️ 中（建议用规则匹配） |
| 偏见检测 | ⚠️ 中（LLM 本身有偏见） |

**金科玉律**：能用规则评的，不用 LLM。

## 15.10 实战：写一个 Prompt-as-a-Service Judge

```typescript
// judge-service.ts — 可复用的 judge 服务
class JudgeService {
  constructor(private model: string = "gpt-4o") {}

  async score(question: string, response: string, reference: string): Promise<number> {
    const prompt = GRADING_PROMPT
      .replace("{question}", question)
      .replace("{reference}", reference)
      .replace("{response}", response);

    const r = await this.callModel(prompt);
    return this.parseScore(r);
  }

  async pairwise(question: string, responseA: string, responseB: string): Promise<'A' | 'B' | 'tie'> {
    // 交换位置
    const [r1, r2] = await Promise.all([
      this.callPairwise(question, responseA, responseB),
      this.callPairwise(question, responseB, responseA),
    ]);
    if (r1 === 'A' && r2 === 'B') return 'A';
    if (r1 === 'B' && r2 === 'A') return 'B';
    return 'tie';
  }

  private async callModel(prompt: string): Promise<string> {
    const r = await new OpenAI().chat.completions.create({
      model: this.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      response_format: { type: "json_object" },
    });
    return r.choices[0].message.content ?? "";
  }

  private parseScore(output: string): number {
    try {
      const json = JSON.parse(output);
      return json.score ?? 0;
    } catch {
      return 0;
    }
  }

  private async callPairwise(q: string, a: string, b: string): Promise<'A' | 'B' | 'tie'> {
    const r = await this.callModel(PAIRWISE_PROMPT.replace("{question}", q)
      .replace("{responseA}", a).replace("{responseB}", b));
    try {
      return JSON.parse(r).winner;
    } catch {
      return 'tie';
    }
  }
}

// 用法
const judge = new JudgeService();
const score = await judge.score("What's 2+2?", "4", "4"); // 5
const winner = await judge.pairwise("Q", "Answer A", "Answer B");
```

## 15.11 验收自测

1. **选择**：哪个是 LLM-as-Judge 的已知偏差？
   - A. 时间偏差
   - B. 位置偏差
   - C. 颜色偏差
   - D. 网络偏差

2. **简答**：为什么"用 Claude 评 GPT-4"能减少自偏好？

3. **实操**：写一个交换位置的 pairwise judge 评估 50 道对话样本。

## 15.12 延伸阅读

⭐⭐⭐
- [Judging LLM-as-a-Judge (Zheng et al. 2023)](https://arxiv.org/abs/2306.05685) — 偏差研究必读
- [MT-Bench 论文](https://arxiv.org/abs/2306.05685) — LLM Judge 实践

⭐⭐
- [PandaLM](https://github.com/WeOpenML/PandaLM) — 训练专门 judge 的小模型
- [Prometheus](https://github.com/kaistAI/Prometheus) — 开源 LLM Judge
- [Auto-J](https://github.com/GAIR-NLP/auto-j) — 自动化 judge

⭐
- [Calibration of LLM-as-a-Judge](https://arxiv.org/abs/2402.10688) — 校准
- [Reward Bench](https://github.com/allenai/reward-bench) — 奖励模型基准
