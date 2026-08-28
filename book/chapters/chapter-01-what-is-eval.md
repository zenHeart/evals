# 1. 什么是评估：从前端工程师视角看 Eval

> **如果只读一节**：评估 = 用一套**可重复**的规则给模型打分。前端类比：单元测试 + E2E + 性能基准，三者合一。

## 1.1 本章目标与读者

读完后你能：

- 用 30 秒向同事解释"评估"是什么
- 区分**基准（benchmark）**、**指标（metric）**、**评分器（judge）**、**排行榜（leaderboard）**
- 说出评估的 3 个核心目的：选型、回归、改进
- 知道为什么"刷榜"是个严肃问题

**前置知识**：无。如果你写过 `npm test`、用过 Lighthouse、看懂 0–100 的分数，本章零负担。

## 1.2 一句话定义

> **评估 = 用一组预定义的任务 + 明确的评分规则，让模型输出可比较、可复现的数字。**

把它拆成三个动作：

1. **任务（task）** — 出一道题（或多个题）
2. **生成（inference）** — 让模型答题
3. **评分（scoring）** — 用规则或另一个模型判分

这和前端写 `expect(add(1, 2)).toBe(3)` 在结构上**完全一样**：

| 前端测试 | LLM 评估 |
|---|---|
| 测试用例 | 数据集样本 |
| `expect` 断言 | 评分函数 / LLM-as-Judge |
| `npm test` 报告 | 评估报告 / 排行榜 |
| 覆盖率 | 题目类别覆盖度 |
| 测试套件 | 基准（benchmark） |

**前端类比**：LLM 评估 ≈ 单元测试 + E2E + 性能基准三件套，但题目是"自然语言"，评分经常要"另一个 AI 来判"。

## 1.3 评估的 3 个核心目的

**选型（selection）**

"我的产品应该用 GPT-4o、Claude 3.5 还是 Qwen？"

→ 看同一份数据集上三个模型的得分高低。

**回归（regression）**

"我升级 prompt 或换模型版本后，效果变没变？"

→ 在固定数据集上跑两遍，对比分数。**这就是 CI 里跑 eval 的本质。**

**改进（improvement）**

"我的 prompt 改一个字，整体效果提升还是下降？"

→ A/B 实验或 paired test。

## 1.4 三个容易混淆的概念

| 概念 | 定义 | 前端类比 |
|---|---|---|
| **基准 Benchmark** | 一组任务的集合（如 MMLU 包含 14k 多选题） | `tests/` 目录 |
| **指标 Metric** | 怎么打分（accuracy、pass@k、BLEU） | `expect().toBe()` vs `expect().toBeCloseTo()` |
| **评分器 Judge** | 实际执行打分的程序或模型 | Jest runner + assertion 库 |

**关键洞见**：基准是题库，指标是规则，评分器是裁判。**指标错了，再多题也白搭。**

## 1.5 一个最小可运行的评估（30 行 TypeScript）

```typescript
// eval.ts — 评估"模型能否正确做加法"
import OpenAI from "openai";

const openai = new OpenAI();

// 1. 任务集（dataset）
const tasks = [
  { input: "1 + 1", expected: "2" },
  { input: "23 + 45", expected: "68" },
  { input: "100 + 200", expected: "300" },
  { input: "999 + 1", expected: "1000" },
];

// 2. 评分函数（metric）
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

**运行**：`npx tsx eval.ts`（或用 `node --experimental-strip-types`）

**输出示例**：
```
Q: 1 + 1 → A: 2 | ✓
Q: 23 + 45 → A: 68 | ✓
Q: 100 + 200 → A: 300 | ✓
Q: 999 + 1 → A: 1000 | ✓

Accuracy: 100.0%
```

这就是**完整评估流程的最简版**：题目 → 模型 → 评分 → 汇总。

## 1.6 为什么"刷榜"是个问题

真实案例：某模型在 MMLU 上拿了 90 分，全网沸腾。但后来发现：

- 训练数据里**已经包含了 MMLU 的测试题**（数据污染 / data contamination）
- 评估时用了**特殊 prompt**（CoT、self-consistency）但报告里没写
- 用了**多次采样取最高分**（best-of-N cheating）

**前端类比**：单元测试只测你写过的代码覆盖率 = 100%，但上线后还是炸。评估分数高 ≠ 在真实业务上好用。

**判断刷榜的 3 个信号**：
1. 同一基准某模型突然涨 5+ 分 — 查训练数据声明
2. 厂商技术报告未列出完整 prompt 模板 — 警惕
3. 排行榜独占前 3 但人类偏好榜单排第 10 — 数据集不代表真实使用

## 1.7 评估的边界与局限

| 能评估 | 难评估 |
|---|---|
| 知识覆盖面（MMLU） | 真实业务价值 |
| 推理能力（GSM8K） | 用户满意度 |
| 代码正确性（HumanEval） | 可维护性 |
| 指令遵循（IFEval） | 创造性 |
| 多语言（XCOPA） | 推理的"可解释性" |
| 安全性（HarmBench） | 长期任务可靠性 |

> 一句关键话：**任何评估都只是真实世界的一个投影。** 投影越接近你的业务，越有用。

## 1.8 实战与陷阱

**陷阱 1：把测试集当训练集**

```
训练数据 ← 测试集 ❌
评估数据 ← 独立 hold-out ✓
```

**陷阱 2：用单一指标决策**

准确率高 ≠ 用户满意。至少配 2-3 个指标（如 accuracy + 用户偏好 + 延迟）。

**陷阱 3：忽略置信区间**

4 道题里答对 3 道 = 75%。但置信区间可能是 [30%, 95%]。**少样本评估不可靠**。

## 1.9 验收自测

1. **选择**：下面哪个是"指标"而不是"基准"？
   - A. MMLU
   - B. HumanEval
   - C. accuracy
   - D. Chatbot Arena

2. **简答**：为什么不能只看一个分数就选模型？

3. **实操**：把上面 30 行 TypeScript 复制到本地，给 `tasks` 数组加 3 道乘法题（注意：模型可能输出"2 × 3 = 6"格式），让评分函数更宽松（容忍格式差异）。

## 1.10 延伸阅读

⭐⭐⭐
- [Stanford HELM: Holistic Evaluation of Language Models](https://crfm.stanford.edu/helm/latest/) — 评估哲学基础
- [lm-evaluation-harness 文档](https://github.com/EleutherAI/lm-evaluation-harness) — 工业级实现

⭐⭐
- [How to Evaluate LLMs: A Complete Guide](https://www.confident-ai.com/blog/llm-evaluation-guide) — 综述博客

⭐
- [Anthropic: Constitutional AI](https://www.anthropic.com/news/constitutional-ai-harmlessness-from-ai-feedback) — 评估驱动训练
