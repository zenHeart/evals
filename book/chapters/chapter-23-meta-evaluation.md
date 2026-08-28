# 23. 元评估：怎么知道你的评估是对的？

> **如果只读一节**：元评估 = 评估你的评估。**核心：与人类判断一致率 ≥ 80% 是门槛**。如果你的评估和人类判断不一致，要么改评估，要么改业务。

## 23.1 本章目标

读完后你能：

- 知道为什么"评估评估"是必要的
- 量化你的评估和人类的差距
- 知道何时该重做评估
- 避免"指标陷阱"

## 23.2 什么是元评估

> 元评估 = 评估"评估方法本身"是否合理。

**场景**：

```
你的 LLM-as-Judge 评分 vs 人类评分
→ 一致率 70% → 还行
→ 一致率 90% → 很好
→ 一致率 50% → 必须重做评估
```

**核心问题**：你怎么知道你的评估分数 = 真实质量？

## 23.3 4 个元评估方法

### 方法 1：与人类对比

```python
# 比较 LLM-as-Judge 和人类标注
from sklearn.metrics import cohen_kappa_score

human_scores = [5, 4, 3, 5, 2, 4, 5, 3]  # 100 个样本
llm_scores = [5, 4, 4, 5, 2, 3, 5, 3]    # 100 个样本

kappa = cohen_kappa_score(human_scores, llm_scores)
print(f"Cohen's Kappa: {kappa:.3f}")
# 0.85 = 高度一致
# 0.50 = 一般
# < 0.40 = 不可信
```

### 方法 2：与黄金测试集对比

```
1. 准备 100 道"金标准"题（人类专家反复确认答案）
2. 跑你的评估
3. 你的分数 = 金标准答案的比例
```

**示例**：

```
金标准：100 道题，每题有明确对错
你的评估：85 道对，15 道错
你的评估准确率：85%
```

### 方法 3：A/B 一致性

```
对同一批 1000 道题，跑 3 次你的评估
→ 如果分数波动 > 5% → 评估不稳定
```

**对策**：固定 temperature=0，多次采样取平均。

### 方法 4：业务指标反向验证

```
业务：用户满意度上升
你的评估：质量分数也上升
→ 一致 ✓

业务：用户满意度上升
你的评估：质量分数下降
→ 矛盾 ⚠️
```

## 23.4 量化与人类一致率

```typescript
// 5 步评估你的 LLM-as-Judge
async function validateJudge(
  judgeFn: (input: string, output: string) => Promise<number>,
  humanData: Array<{ input: string; output: string; humanScore: number }>
): Promise<{ kappa: number; correlation: number; accuracy: number; mae: number }> {
  // 1. 跑 LLM Judge
  const llmScores = await Promise.all(
    humanData.map(d => judgeFn(d.input, d.output))
  );
  
  // 2. Cohen's Kappa（对分级评分）
  const kappa = cohensKappa(llmScores, humanData.map(d => d.humanScore));
  
  // 3. Pearson 相关性
  const correlation = pearsonCorrelation(llmScores, humanData.map(d => d.humanScore));
  
  // 4. 二元分类准确率（threshold 0.5）
  const binaryHuman = humanData.map(d => d.humanScore >= 3 ? 1 : 0);
  const binaryLlm = llmScores.map(s => s >= 0.5 ? 1 : 0);
  const accuracy = binaryHuman.filter((h, i) => h === binaryLlm[i]).length / humanData.length;
  
  // 5. 平均绝对误差
  const mae = llmScores.reduce((a, s, i) => a + Math.abs(s - humanData[i].humanScore), 0) / humanData.length;
  
  return { kappa, correlation, accuracy, mae };
}
```

## 23.5 元评估的 4 个门槛

| 指标 | 门槛 | 含义 |
|---|---|---|
| Cohen's Kappa | ≥ 0.7 | 与人类高度一致 |
| Pearson r | ≥ 0.8 | 分数趋势一致 |
| 准确率（threshold=0.5） | ≥ 85% | 多数情况判对 |
| MAE | ≤ 0.3 | 平均误差小 |

**任何一项低于门槛 → 必须改进评估**。

## 23.6 指标陷阱

### 陷阱 1：指标被刷

```
例子：客服满意度指标
客服话术优化：先道歉再说问题
→ 满意度上升 → 但实际问题没解决
```

### 陷阱 2：代理指标失效

```
例子：用 MMLU 评估
你的业务：客服对话
→ MMLU 上升 ≠ 客服变好
```

### 陷阱 3：指标分布偏移

```
训练时 80% 答对
3 个月后用户行为变化
可能 60% 答对
→ 指标没变 → 实际变差
```

### 陷阱 4：评估与优化脱钩

```
评估说：新 prompt 更好
但实际：用户没感觉
→ 评估是"对的"，但脱离了用户感知
```

## 23.7 何时该重做评估

### 5 个触发条件

1. **业务变化** — 业务模式调整
2. **数据漂移** — 用户输入分布改变
3. **模型升级** — 切换到新模型
4. **指标饱和** — 所有人都得 99%
5. **业务反馈矛盾** — 评估和业务不一致

### 重做流程

```
1. 收集证据（评估和业务不一致）
2. 重新设计评估
3. 跑新评估
4. 与业务交叉验证
5. 部署新评估
6. 旧评估保留作为对照
```

## 23.8 元评估的工程实现

```python
# meta_eval.py
import json
from typing import List, Dict, Callable

def run_meta_eval(
    judge: Callable,
    human_annotated: List[Dict],
    primary_metric: str = "kappa"
) -> Dict:
    """运行元评估"""
    
    # 1. 跑 LLM Judge
    llm_results = []
    for sample in human_annotated:
        score = judge(sample["input"], sample["output"])
        llm_results.append(score)
    
    # 2. 提取人类评分
    human_scores = [s["human_score"] for s in human_annotated]
    
    # 3. 计算多个指标
    metrics = {
        "kappa": cohens_kappa(llm_results, human_scores),
        "pearson": pearson(llm_results, human_scores),
        "spearman": spearman(llm_results, human_scores),
        "accuracy_at_0.5": binary_accuracy(llm_results, human_scores, 0.5),
        "accuracy_at_0.7": binary_accuracy(llm_results, human_scores, 0.7),
        "mae": mean_absolute_error(llm_results, human_scores),
    }
    
    # 4. 判定
    metrics["passes_meta_eval"] = metrics["kappa"] >= 0.7
    
    return metrics
```

## 23.9 实战：评估你的 LLM-as-Judge

```python
# 准备 100 道人类标注样本
gold_samples = [
    {"input": "...", "output": "...", "human_score": 5, "category": "code"},
    {"input": "...", "output": "...", "human_score": 3, "category": "code"},
    # ... 100 条
]

# 跑元评估
result = run_meta_eval(
    judge=my_llm_judge,
    human_annotated=gold_samples,
)

print(json.dumps(result, indent=2))
```

**输出示例**：

```json
{
  "kappa": 0.78,
  "pearson": 0.85,
  "spearson": 0.83,
  "accuracy_at_0.5": 0.89,
  "accuracy_at_0.7": 0.82,
  "mae": 0.42,
  "passes_meta_eval": true
}
```

**解读**：
- κ = 0.78：通过（≥ 0.7）
- 相关性 0.85：很好
- MAE 0.42：可接受
- **可以信赖这个 LLM Judge**

## 23.10 元评估的"元元"问题

> "评估 LLM Judge 的人，也是要评估的吗？"

是的，**人也是评估对象**。要：
- 多人标注（避免个人偏差）
- 培训 + 校准
- Cohen's Kappa 检验

## 23.11 章节小结

- **元评估 = 评估你的评估**
- **与人类一致率 ≥ 80%** 是门槛
- 4 个方法：人类对比 / 黄金集 / 一致性 / 业务验证
- 评估饱和后必须重做

## 23.12 验收自测

1. **选择**：元评估的核心指标是？
   - A. 准确率
   - B. Cohen's Kappa
   - C. P95 延迟
   - D. 成本

2. **简答**：为什么"指标饱和"是必须重做评估的信号？

3. **实操**：用 50 道人类标注样本评估你的 LLM Judge。

## 23.13 延伸阅读

⭐⭐⭐
- [Judging LLM-as-a-Judge (Zheng et al.)](https://arxiv.org/abs/2306.05685)
- [Designing ML Evaluation Systems (Chip Huyen)](https://huyenchip.com/2023/05/15/designing-ml-evaluation-systems.html)

⭐⭐
- [PandaLM](https://github.com/WeOpenML/PandaLM) — 训练专门 judge 的模型
- [Prometheus](https://github.com/kaistAI/Prometheus) — 开源 LLM Judge

⭐
- [Cohen's Kappa 详解](https://en.wikipedia.org/wiki/Cohen%27s_kappa)
- [Inter-Rater Reliability](https://en.wikipedia.org/wiki/Inter-rater_reliability)
