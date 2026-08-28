# 12. 持续更新评测：LiveBench、SWE-bench Live

> **如果只读一节**：静态基准已"刷到天花板"，持续更新评测是未来。**LiveBench 每月更新、SWE-bench Live 持续收新 Issue**。

## 12.1 本章目标

读完后你能：

- 理解为什么需要"持续更新"评测
- 知道 LiveBench / SWE-bench Live / FrontieMath 的运作机制
- 在自己业务上设计"持续评测"
- 知道"刷榜检测"的方法

**前置知识**：第 5-7 章基础。

## 12.2 为什么需要持续评测

**静态基准的"刷分"问题**

```
MMLU 2017 年发布 → 2024 年已被刷到 90%+
GSM8K 2021 年发布 → 2023 年已被刷到 96%+
HumanEval 2021 年发布 → 2024 年已被刷到 92%+
```

**问题**：训练数据可能已经包含测试题。

**典型案例**：

| 时间 | 模型 | 基准 | 突然跃升 | 原因 |
|---|---|---|---|---|
| 2023 | Llama 2 | GSM8K | +5% | 训练数据扩展 |
| 2024 | Qwen2 | MMLU | +3% | 训练数据 |
| 2024 | DeepSeek-V3 | HumanEval | +4% | 数据策略 |

→ **基准的"含金量"在下降**。

**持续评测的解决方案**

```
1. 持续从源头抓新数据
2. 时间戳标注（数据来源时间）
3. 防止训练-测试穿越
4. 旧题保留用于"历史对比"
```

## 12.3 LiveBench

**一句话**

> **LiveBench = 每月更新的综合性基准**。从 7 个真实来源抓新题。

**数据来源**

| 来源 | 题型 | 更新频率 |
|---|---|---|
| 国际数学奥林匹克 (IMO) | 奥数题 | 每年 7 月 |
| 美国数学邀请赛 (AIME) | 奥数题 | 每年 2 月 |
| 麻省理工数学联赛 (HMMT) | 数学 | 每年 2/11 月 |
| Codeforces | 编程题 | 每周 |
| LeetCode Weekly | 算法 | 每周 |
| 雅虎财经 | 金融问答 | 每日 |
| 美国法学院入学考试 (LSAT) | 逻辑 | 每年 6/10 月 |
| 艺术史教科书 | 视觉问答 | 每年 |
| 研究生入学考试 (GRE) | 语文/数学 | 每月 |

**任务类型（7 类）**

1. **数学**（30%）
2. **代码**（25%）
3. **推理**（20%）
4. **语文**（10%）
5. **指令遵循**（5%）
6. **数据可视化**（5%）
7. **金融**（5%）

**关键特性**

- **时间戳**：每题有"来源时间"，防止训练穿越
- **防污染**：题源公开 + 时间标注
- **可复现**：所有题目公开
- **持续更新**：每月添加新题

**当前 SOTA（2026）**

| 模型 | LiveBench 总分 |
|---|---|
| GPT-4o | 65% |
| Claude 3.5 Sonnet | 70% |
| Gemini 1.5 Pro | 60% |
| DeepSeek-V3 | 68% |

**LiveBench 上的分数比 MMLU 更能反映"真实能力"**。

详见：https://livebench.ai/

## 12.4 SWE-bench Live

**一句话**

> **SWE-bench Live = SWE-bench 的持续更新版**。从 2024-10 开始的 GitHub Issue 持续收集。

**与 SWE-bench Verified 区别**

| 维度 | SWE-bench Verified | SWE-bench Live |
|---|---|---|
| 数据时间 | 截止 2024-04 | 持续更新 |
| 题目数 | 500 | 1,500+ |
| 验证 | 人工检查 | 自动验证 |
| 难度 | 中 | 偏新 |

**关键作用**

- 防止"训练在测试之后"
- 反映"当前真实代码工程"能力
- 让刷榜无效（因为题在变）

**当前 SOTA**

| 模型 | SWE-bench Live |
|---|---|
| GPT-4o | 28% |
| Claude 3.5 Sonnet | 45% |
| DeepSeek-V3 | 30% |

**SWE-bench Live 比 Verified 难约 10%**。

详见：https://github.com/SWE-bench/swe-bench

## 12.5 LiveCodeBench

**一句话**

> **LiveCodeBench = 持续从 LeetCode / Codeforces / AtCoder 抓新题**。

**题目来源**

| 来源 | 频率 | 难度 |
|---|---|---|
| LeetCode Weekly | 每周 | 入门-中等 |
| LeetCode Biweekly | 双周 | 中等 |
| Codeforces Round | 每周 | 中-高 |
| AtCoder Beginner | 每周 | 入门 |
| AtCoder Regular | 每周 | 中-高 |

**时间标注**

每题有"contest_date"：

- 数据截止 2024-09 → 训练不会看到
- 数据截止 2025-01 → 训练可能看到

→ 模型评测时只看"截止前"的题目。

**当前 SOTA（2025）**

| 模型 | LiveCodeBench |
|---|---|
| GPT-4o | 65% |
| Claude 3.5 Sonnet | 70% |
| DeepSeek-Coder-V2 | 75% |
| o1 | 80% |

详见：https://livecodebench.github.io/

## 12.6 FrontierMath

**一句话**

> **FrontierMath = 持续加新题的研究级数学基准**。每月添加 ~50 道新题。

**题目特点**

- 研究生级数学
- 出题者：专业数学家
- 防刷榜：题不公开
- 难度递增

**当前 SOTA（2025）**

| 模型 | FrontierMath |
|---|---|
| 任何模型 | < 10% |
| 顶级推理模型（o1/R1） | 15-25% |
| 数学博士 | ~40% |

**FrontierMath 是"AGI 与人类差距"的最大指标之一**。

详见：https://epochai.org/frontiermath

## 12.7 LiveBench 的"刷榜检测"

**4 个检测机制**

1. **时间戳核对**：模型训练时间必须早于题目时间
2. **题目检索**：监控 GitHub/网上是否被公开
3. **隐式对照**：与同期任务"难度等价但未公开"的题对比
4. **分布对比**：新题分数 vs 旧题分数，应该平滑下降（如果突然一致 = 刷榜）

**实战：检测 LLM 是否在特定基准上"刷榜"**

```
1. 选 100 道"等价但未公开"的题
2. 跑模型
3. 模型在公开题上的分数 = X
4. 在"未公开等价题"上的分数 = Y
5. X - Y > 5% = 刷榜
```

## 12.8 自己设计"持续评测"

**3 步**

```
1. 持续抓数据源
   - 业务日志（脱敏）
   - 用户反馈
   - 真实任务样本
2. 时间戳标注
   - 每题加 collection_date
3. 每月评估
   - 上月新题 + 上月旧题（对比）
```

**代码示例**

```typescript
// live-eval.ts
interface LiveTask {
  id: string;
  input: string;
  expected: string;
  collection_date: string;  // 关键：抓取时间
  category: string;
}

class LiveEvaluator {
  async run(model: string, cutoff_date: string) {
    // 1. 加载所有任务
    const tasks = await loadAllTasks();
    
    // 2. 过滤：只跑 cutoff_date 之前抓的（防训练穿越）
    const validTasks = tasks.filter(t => t.collection_date <= cutoff_date);
    
    // 3. 跑评估
    const results = await this.evaluate(model, validTasks);
    
    // 4. 按时间分组
    const byMonth = groupBy(results, r => r.task.collection_date.slice(0, 7));
    
    return {
      overall: this.aggregate(results),
      byMonth,
      cutoff_date,
    };
  }
}
```

## 12.9 持续评测 vs 静态评测

| 维度 | 静态评测 | 持续评测 |
|---|---|---|
| 防污染 | 弱 | 强 |
| 反映真实能力 | 弱 | 强 |
| 维护成本 | 低 | 中 |
| 难度持续性 | 下降 | 持续增加 |
| 公平比较 | 难（新模型看更多数据） | 易 |

## 12.10 ⚠️ 5 个常见错误

1. **静态基准 = 真实能力** — 错。训练数据可能包含测试题。
2. **忽视时间戳** — 不标注 → 模型可能在测试后才"训练"。
3. **只看总分** — LiveBench 等多维度基准要看分项。
4. **不更新测试集** — 旧的测试集永远不变 = 永远在测"过去的能力"。
5. **持续评测 = 每月跑一次** — 持续评测的核心是"持续"。

## 12.11 📋 本章 Cheat Sheet

| 评测 | 特点 | 频率 |
|---|---|---|
| LiveBench | 综合 7 来源 | 每月 |
| SWE-bench Live | GitHub 新 Issue | 持续 |
| LiveCodeBench | 编程竞赛新题 | 每周 |
| FrontierMath | 研究级数学新题 | 每月 |

**关键概念**：时间戳标注 + 持续更新 + 防污染。

## 12.12 验收自测

1. **简答**：为什么静态基准容易被"刷榜"？
2. **简答**：LiveBench 的"时间戳"机制如何防污染？
3. **实操**：设计一个 3 步"持续评测" pipeline。

## 12.13 延伸阅读

- [LiveBench 论文](https://arxiv.org/abs/2406.19314)
- [SWE-bench Live](https://github.com/SWE-bench/swe-bench)
- [LiveCodeBench](https://livecodebench.github.io/)
- [FrontierMath (Epoch AI)](https://epochai.org/frontiermath)
- [Detecting Data Contamination](https://arxiv.org/abs/2402.08760)
