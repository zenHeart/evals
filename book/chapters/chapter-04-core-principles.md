# 4. 核心原理：指标设计、统计置信与人类一致性

> **如果只读一节**：好评估的 4 个原则 — (1) 可复现 (2) 统计显著 (3) 与人类判断一致 (4) 反映真实任务。

## 4.1 本章目标与读者

读完后你能：

- 区分准确率 / 精确率 / 召回率 / F1
- 理解置信区间、p 值、效应量的基本概念
- 知道"与人类一致"为什么是评估的黄金标准
- 知道 Cohen's Kappa 衡量什么

**前置知识**：读完第 1-3 章。本章有少量数学概念，但都附前端类比。

## 4.2 指标设计：4 个基础

**Accuracy（准确率）**

```
accuracy = (TP + TN) / (TP + TN + FP + FN)
```

> 前端类比：单元测试通过率。

**陷阱**：数据不平衡时 accuracy 会骗人。

```
100 道题里 95 道"是"、5 道"否"
模型只会答"是" → 95% 准确率（但毫无用处）
```

→ 这时该用 **precision / recall / F1**。

**Precision（精确率）**

```
precision = TP / (TP + FP)
```

> "模型说'是'的里面，多少真对了？"

**Recall（召回率）**

```
recall = TP / (TP + FN)
```

> "真正'是'的里面，模型找出了多少？"

**F1 Score**

```
F1 = 2 * precision * recall / (precision + recall)
```

> precision 和 recall 的调和平均。**综合指标**。

**多分类与多标签**

- 多分类：macro-F1（各类平等）/ weighted-F1（按样本量加权）
- 多标签：每个标签独立算，再平均

## 4.3 生成任务的指标

开放式生成（写作、对话）不能简单用 accuracy。常见：

| 指标 | 测什么 | 范围 | 例子 |
|---|---|---|---|
| BLEU | n-gram 重叠 | 0-1 | 翻译 |
| ROUGE | 召回率型 n-gram | 0-1 | 摘要 |
| METEOR | 同义词 + 词序 | 0-1 | 翻译 |
| BERTScore | 语义相似度 | 0-1 | 通用 |
| pass@k | 代码通过率 | 0-1 | HumanEval |
| Win Rate | 偏好胜率 | 0-100% | Arena |

**经验法则**：
- 翻译/摘要：BLEU + 人类抽检
- 代码：pass@k + 实际执行
- 对话：Arena Elo + 人类标注
- RAG：Faithfulness + Answer Relevance（RAGAS）

## 4.4 统计置信：从"看起来好"到"真的好"

**核心问题**

> 模型 A 准确率 80.5%，模型 B 准确率 79.8%。A 真的更好吗？

**答案**：要看置信区间和样本量。

**置信区间（CI）**

95% 置信区间 = "如果重复这个实验 100 次，大约 95 次真值落在这个区间里"。

```typescript
// 1000 题，A 答对 805 道 = 80.5%
// 95% 置信区间 ≈ [78.0%, 82.8%]
// B 答对 798 道 = 79.8%
// 95% 置信区间 ≈ [77.2%, 82.1%]
// 两区间重叠 → 差异不显著
```

**前端类比**：A/B 测试的 p 值 ≥ 0.05 = "差异可能来自随机"。

**显著性检验**

```typescript
// 配对卡方检验：同一道题上 A 和 B 哪个对的更多
function pairedMcNemar(aResults: boolean[], bResults: boolean[]): number {
  // a 对 b 错 (b01) + a 错 b 对 (b10)
  let b01 = 0, b10 = 0;
  for (let i = 0; i < aResults.length; i++) {
    if (aResults[i] && !bResults[i]) b01++;
    if (!aResults[i] && bResults[i]) b10++;
  }
  // McNemar 统计量
  return (Math.abs(b01 - b10) - 1) ** 2 / (b01 + b10);
}
// 查卡方分布表，>3.84 = p < 0.05
```

**何时需要显著性检验？**
- 准确率差异 < 2%
- 样本量 < 500
- 决策影响重大（是否切换主模型）

## 4.5 人类一致性：评估的黄金标准

**核心洞见**

> 如果两个标注员对同一道题看法不一致，**那么这道题就不该用来评估模型**。

**Cohen's Kappa**：衡量两个人类标注员的一致性（剔除随机一致）。

```
κ = (p_o - p_e) / (1 - p_e)
```

- κ = 1.0：完全一致
- κ = 0：和随机一样
- κ < 0：比随机还差
- **κ > 0.7 才算"高度一致"**，可作为评估的"地面真相"

**如果人类自己都不一致，模型怎么可能"对"？**

**LLM-as-Judge 与人类的一致性**

理想情况：LLM Judge 和人类标注的一致率 ≥ 80%。

**提升方法**：
1. 用更强的模型（GPT-4o > GPT-3.5）
2. 写更详细的评分 prompt（举例子）
3. 用 chain-of-thought（让 judge 先思考再判分）
4. 多次采样投票

## 4.6 个评估原则（可复现的金标准）

| 原则 | 含义 | 检查方法 |
|---|---|---|
| **可复现** | 同一模型 + 同一数据集 = 同一分数 | 跑两遍对比 |
| **统计显著** | 差异不是随机 | 置信区间 + 显著性检验 |
| **人类一致** | 模型评分与人类判断一致 | Cohen's Kappa |
| **任务相关** | 测的是真实业务能力 | 错误样例分析 |

**任何评估缺一条，结论都要打折扣。**

## 4.7 偏差（Bias）— LLM-as-Judge 的隐藏陷阱

LLM 当 judge 时有 4 个已知偏差：

1. **位置偏差**：偏好"第一个"或"最后一个"答案
2. **长度偏差**：偏好更长的答案
3. **自偏好偏差**：偏好自己（GPT-4 偏好 GPT-4 的答案）
4. **格式偏差**：偏好 markdown 格式、bullet point

**对策**：
- 随机化答案顺序
- 控制答案长度
- 用第三方模型（评估 GPT-4 用 Claude）
- 多次采样取平均

```typescript
// 位置偏差缓解：交换 A/B 顺序跑两次
async function judgeWithDebias(question: string, answerA: string, answerB: string): Promise<'A' | 'B' | 'tie'> {
  const order1 = await judge(question, answerA, answerB); // A 在前
  const order2 = await judge(question, answerB, answerA); // B 在前
  // 两次结果不一致 → 标记为 tie
  if ((order1 === 'A' && order2 === 'B') || (order1 === 'B' && order2 === 'A')) return 'tie';
  return order1;
}
```

## 4.8 校准（Calibration）— 模型说"我确定"时真的对吗？

ECE (Expected Calibration Error)：

```typescript
function ece(predictions: { confidence: number; correct: boolean }[], nBins = 10): number {
  let err = 0;
  for (let i = 0; i < nBins; i++) {
    const lo = i / nBins, hi = (i + 1) / nBins;
    const inBin = predictions.filter(p => p.confidence >= lo && p.confidence < hi);
    if (inBin.length === 0) continue;
    const avgConf = inBin.reduce((a, p) => a + p.confidence, 0) / inBin.length;
    const avgAcc = inBin.filter(p => p.correct).length / inBin.length;
    err += inBin.length / predictions.length * Math.abs(avgConf - avgAcc);
  }
  return err;
}
```

> 前端类比：天气预报说"90% 降雨概率"时，真的 9 次里下雨 9 次吗？

**好模型**：ECE < 0.05。**坏模型**：自信地胡说（高 confidence 但错）。

## 4.9 实战与陷阱

**陷阱 1：只报点估计，不报区间**

> "模型 A 准确率 85.3%"
> ❌ 缺信息
> "模型 A 准确率 85.3% ± 1.2%（95% CI, n=2000）"
> ✓ 完整

**陷阱 2：用 accuracy 评估不平衡数据**

90% 是负样本时，永远预测"负"就能 90% 准确率。

→ 改用 F1、AUC。

**陷阱 3：LLM Judge 没说 temperature**

LLM Judge temperature=0 vs 1.0 → 同输入可能给不同分数。**必须固定 temperature=0**。

## 4.10 验收自测

1. **选择**：1000 题里 800 题答对，95% 置信区间大约是？
   - A. [78%, 82%]
   - B. [70%, 90%]
   - C. [80%, 80%]
   - D. [50%, 95%]

2. **简答**：为什么 Cohen's Kappa < 0.7 的题目不适合作为评估基准？

3. **实操**：用 TypeScript 写一个 McNemar 检验函数，输入两个模型的 boolean 数组，返回 p 值。

## 4.11 延伸阅读

⭐⭐⭐
- [Holistic Evaluation of Language Models (HELM)](https://arxiv.org/abs/2211.09110) — Stanford 的评估哲学
- [Judging LLM-as-a-Judge (Zheng et al. 2023)](https://arxiv.org/abs/2306.05685) — LLM Judge 偏差研究

⭐⭐
- [Cohen's Kappa Explained](https://en.wikipedia.org/wiki/Cohen%27s_kappa) — 人类一致性指标
- [ECE 校准指标](https://en.wikipedia.org/wiki/Expected_calibration_error) — 模型校准

⭐
- [Statistical Methods in NLP (Slides)](https://www.cs.cmu.edu/~nasmith/statistical-nlp.html) — 完整课件
