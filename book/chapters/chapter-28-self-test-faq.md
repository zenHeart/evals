# 28. 结课自测与 FAQ

> **如果只读一节**：通过 8 道自测题验证你的掌握；FAQ 解答 20 个常见疑问。**"能给别人讲清楚" = 真的懂**。

## 28.1 本章目标

读完后你能：

- 验证对全书核心概念的理解
- 知道 20 个常见疑问的答案
- 找到下一步学习的方向
- 把评估知识体系化

## 28.2 结课自测（8 题）

### 概念题（4 题，每题 5 分）

**1. 用 30 秒向产品经理解释"评估"是什么。**

**参考答案**：
> 评估 = 用固定题目 + 规则给模型打分。就像单元测试 + 性能监控 + A/B 实验的结合，目的是回答"这个模型在我业务上好不好用"。

**2. 评估的 4 步是什么？举例说明。**

**参考答案**：
1. **数据集**（题目）— 准备测试题
2. **模型推理**（答题）— 让模型生成答案
3. **评分**（判分）— 规则或 LLM Judge
4. **报告**（输出）— 聚合 + 错误分析 + 决策

例：评估客服 RAG 的"退款问题回答准确性"
1. 准备 200 道退款问题
2. 让 RAG 系统回答
3. 用 GPT-4 Judge 打分
4. 输出报告（按问题类型、看错误样例、给改进建议）

**3. LLM-as-Judge 的 4 个偏差是什么？如何缓解？**

**参考答案**：

| 偏差 | 缓解 |
|---|---|
| 位置偏差 | 交换 A/B 位置跑两次 |
| 长度偏差 | 截断到相同长度 |
| 自偏好 | 用第三方模型（评 GPT-4 用 Claude） |
| 格式偏差 | 用 CoT 评分 + 标准化格式 |

**4. 为什么"刷榜"是严肃问题？**

**参考答案**：
- 训练数据可能包含测试题（数据污染）
- 用了特殊 prompt 但报告没写
- 用了 best-of-N 取最高分

→ 评估分数高 ≠ 真实业务好

### 实践题（4 题，每题 5 分）

**5. 写一个 30 行的 TypeScript 评估"模型能否正确计算阶乘"。**

**参考答案**：

```typescript
import OpenAI from "openai";
const openai = new OpenAI();

const tasks = [
  { input: "5! = ?", expected: "120" },
  { input: "10! = ?", expected: "3628800" },
  { input: "0! = ?", expected: "1" },
];

let correct = 0;
for (const t of tasks) {
  const r = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: t.input }],
  });
  const output = r.choices[0].message.content?.trim() ?? "";
  if (output === t.expected || output.includes(t.expected)) correct++;
}
console.log(`Accuracy: ${(correct / tasks.length * 100).toFixed(1)}%`);
```

**6. 写一个 RAGAS 评估你 RAG 系统的命令。**

**参考答案**：

```bash
pip install ragas
python -c "
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall
from datasets import Dataset

dataset = Dataset.from_dict({
    'question': [...],
    'answer': [...],
    'contexts': [...],
    'ground_truth': [...],
})
result = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_precision, context_recall])
print(result)
"
```

**7. 你的 LLM 客服应用，5 大关键评估指标是什么？**

**参考答案**：

1. 意图识别准确率（分类 F1）
2. 答案忠实性（Faithfulness）
3. 用户满意度（CSAT）
4. 响应速度（P95 延迟）
5. 拒答准确率（边界 case 拒答 / 不拒答）

**8. 你公司的 AI 产品要从 3 个模型选一个，你会用什么流程？**

**参考答案**：

```
1. 拆业务目标为 5 大能力
2. 每个能力设计指标
3. 准备 500 道测试集（公开 20% + 人工 30% + 回流 30% + 合成 20%）
4. 跑 3 个模型 + 报告
5. 看 4 个榜单对账
6. 灰度 5% → 25% → 100%
7. 持续监控 + 每月复盘
```

## 28.3 FAQ：20 个常见疑问

### Q1：评估分数达到多少算"好"？

**A**：看具体基准。
- MMLU > 88% = 顶级
- HumanEval > 90% = 顶级
- GPQA > 70% = 超过人类博士
- Arena Elo > 1250 = 顶级

但**业务分数 = 你自己的标准**。建议 ≥ 90%。

### Q2：开源模型 vs 闭源模型怎么选？

**A**：

| 维度 | 开源 | 闭源 |
|---|---|---|
| 成本 | 低（自部署） | 中（API 费） |
| 性能 | 中-高 | 顶 |
| 隐私 | 高 | 中 |
| 可控 | 高 | 低 |
| 运维 | 中 | 低 |

小规模/隐私敏感 → 开源（Llama 3.1-405B）
大规模/质量优先 → 闭源（GPT-4o、Claude 3.5 Sonnet）

### Q3：为什么"刷榜"在 LLM 圈这么严重？

**A**：
- 训练数据动辄 13T token，几乎包含所有公开数据
- 测试集小（HumanEval 只有 164 题），容易背
- 评估的反馈信号被用作 RLHF 的奖励

→ 厂商有动力优化基准分数。

### Q4：可以用 LLM Judge 评估自己吗？

**A**：**不推荐**。LLM 评自己有"自偏好"偏差。**用第三方模型**（如评 GPT-4 用 Claude）。

### Q5：评估跑得很慢，怎么办？

**A**：
1. **并行**：并发调用 API
2. **缓存**：相同输入不重复
3. **采样**：先跑 10%，稳定后全量
4. **更小的模型**：评估用更小模型（GPT-4o-mini 而不是 GPT-4o）
5. **分层**：PR 跑小集、每日跑全量、发版跑红队

### Q6：测试集要多大？

**A**：
- 简单准确率类：≥ 500 题
- 偏好类：≥ 5000 次投票
- 开放式：≥ 200 题

**经验法则**：准确率 ±2% 需要 ~ 2500 题。

### Q7：人工评估要请多少人？

**A**：
- 简单分类：≥ 3 人
- Likert 评分：≥ 5 人
- 复杂判断：≥ 3 人
- **每题至少 3 人**，Cohen's Kappa ≥ 0.7

### Q8：怎么避免数据污染？

**A**：
1. **时间戳**：标注数据时间
2. **Hold-out**：留 10% 不公开
3. **Canary tokens**：插入唯一标记
4. **问厂商**：训练数据是否包含测试集

### Q9：开源评估框架怎么选？

**A**：
- 学术基准：lm-eval-harness
- 中文：OpenCompass
- 多模态：VLMEvalKit
- RAG：RAGAS
- Agent：Inspect AI
- 红队：Garak

### Q10：评估结果不一致怎么办？

**A**：
- 检查 temperature（应 = 0）
- 检查 prompt（应固定）
- 检查 API 随机性（换 seed）
- 检查数据污染
- 检查模型版本

### Q11：为什么我的模型在 MMLU 高但用户不满意？

**A**：MMLU 测学科知识，不测对话能力。要看：
- Arena Elo（真实人类偏好）
- MT-Bench（多轮对话）
- 你自己的业务 hold-out

### Q12：长上下文支持 1M，但 RULER 只测到 32k 怎么办？

**A**：RULER 测的是"有效长上下文"，不是宣称的支持。**以 RULER 实际分数为准**。

### Q13：怎么测模型是否"幻觉"？

**A**：
- TruthfulQA（事实性）
- SimpleQA（短答案事实）
- POPE（视觉幻觉）
- HaluEval（任务型幻觉）

### Q14：多语言怎么测？

**A**：
- 中文：CMMLU、C-Eval
- 多语言：XCOPA、XStoryCloze
- 翻译：Flores-200
- 多语言 MMLU

### Q15：如何选 embedding 模型？

**A**：用 **MTEB 排行榜**。
- text-embedding-3-large（OpenAI）
- bge-large-en-v1.5（BAAI）
- m3e-large（Moka）

### Q16：评估的"统计显著性"是必须的吗？

**A**：
- 准确率差异 > 2%：不用特别检验
- 差异 1-2%：需要显著性检验
- 差异 < 1%：基本是噪声

### Q17：怎么测模型在 Agent 任务上的能力？

**A**：
- 简单工具调用：BFCL
- 多步推理：AgentBench、GAIA
- 真实工程：SWE-bench
- 操作系统：OSWorld

### Q18：LMSYS Arena 怎么参与？

**A**：[lmarena.ai](https://lmarena.ai/) 直接投票。每个模型需要提交 API。

### Q19：评估要不要公开？

**A**：
- 内部评估：建议公开（建立信任）
- 业务评估：建议保密（涉及业务）
- 学术评估：必须公开（可复现）

### Q20：未来评估的趋势是什么？

**A**：
- **从静态基准到动态**（持续更新）
- **从单分到多维**（HELM 风格）
- **从离线到在线**（持续监控）
- **从人类到 AI 评 AI**（LLM-as-Judge + 红队）
- **从通用到垂直**（行业基准）

## 28.4 下一步学习路径

### 第 1 周：跑通基础

```
1. 装 lm-eval-harness
2. 跑 MMLU、GSM8K、HumanEval
3. 读懂报告
4. 复现厂商数字
```

### 第 2-4 周：自定义评估

```
1. 选你的业务场景
2. 准备 200 道测试集
3. 写 LLM-as-Judge
4. 集成 CI/CD
```

### 第 2-3 月：完整流水线

```
1. 多个能力维度
2. 多个 LLM Judge + 校准
3. 持续监控
4. 灰度发布
```

### 第 4-6 月：高级评估

```
1. RAGAS / DeepEval
2. Agent 评估（Inspect AI）
3. 红队（Garak）
4. 元评估
```

### 持续：保持更新

```
1. 关注新基准（NIAH、FrontierMath、LiveCodeBench）
2. 关注厂商报告
3. 关注社区（lmarena、OpenCompass、SEAL）
```

## 28.5 推荐学习资源

### 入门

- 本书
- [Designing ML Evaluation Systems](https://huyenchip.com/2023/05/15/designing-ml-evaluation-systems.html)
- [lm-evaluation-harness 文档](https://github.com/EleutherAI/lm-evaluation-harness)

### 进阶

- 各基准的原始论文
- 厂商技术报告
- Anthropic Engineering Blog
- OpenAI Cookbook

### 高级

- NeurIPS / ICML / ICLR 论文
- 红队方法论
- 多 Agent 评估
- RLHF 评估

## 28.6 关键金句

1. **"评估 = 单元测试 + E2E + 性能 + A/B"**
2. **"业务目标 → 能力 → 指标 → 测试集"**
3. **"评估必须集成到 CI/CD"**
4. **"LLM-as-Judge 4 偏差要缓解"**
5. **"与人类一致率 ≥ 80% 是元评估门槛"**
6. **"30 行代码跑通完整评估"**
7. **"4 来源测试集混合"**
8. **"5 个榜单对账选型"**
9. **"刷榜不是评估"**
10. **"没有 CI 的评估 = 不会被使用的评估"**

## 28.7 推荐的下一步

1. **在你的业务上跑 1 个评估**（哪怕 50 题）
2. **集成到 GitHub Actions**
3. **每周看一次报告**
4. **3 个月后做元评估**
5. **分享给团队**

## 28.8 章节小结

- 8 道自测题覆盖核心
- 20 个 FAQ 解答常见疑问
- 6 个月学习路径
- 关键金句
- 下一步行动

## 28.9 验收自测（终极）

回答这 3 个问题，证明你真的懂：

1. **用 30 秒向老板解释评估的价值。**
2. **写下你下周一要做的事（在你的业务上跑评估）。**
3. **给团队同事讲 1 个章节（最佳检验方式）。**

## 28.10 延伸阅读

⭐⭐⭐
- [Designing ML Evaluation Systems (Chip Huyen)](https://huyenchip.com/2023/05/15/designing-ml-evaluation-systems.html)
- [lm-eval-harness 文档](https://github.com/EleutherAI/lm-evaluation-harness)
- [RAGAS 文档](https://docs.ragas.io/)

⭐⭐
- [Awesome LLM Evaluation](https://github.com/MLGroupJ/awesome-llm-evaluation)
- [LMSYS Arena](https://lmarena.ai/)
- [OpenCompass](https://opencompass.org.cn/)

⭐
- [HELM](https://crfm.stanford.edu/helm/latest/)
- [Artificial Analysis](https://artificialanalysis.ai/)
- [Chip Huyen's Blog](https://huyenchip.com/blog/)

---

# 结语

> 评估是 AI 产品的"质量门"。**没有评估 = 盲飞**。希望这本书能让你从"评估小白"变成"评估专家"。

下一步行动：
1. ⭐ 收藏这本书：[evals.zenheart.site](https://evals.zenheart.site)
2. 🚀 在你的项目里跑 1 个评估
3. 💬 加入社区：OpenCompass、LMSYS、r/LocalLLaMA

> 评估不是终点，是起点。
> — ZenHeart 2026
