# 14. 解读厂商技术报告：看懂每一行数字

> **如果只读一节**：模型报告 = 摘要 + 训练数据 + 训练方法 + 评估表 + 安全评估 + 局限性。评估表重点看 4 个：MMLU、GPQA、Arena、HumanEval/SWE-bench。

## 14.1 本章目标

读完后你能：

- 拆解一份典型模型技术报告的结构
- 知道每个数字背后的"猫腻"
- 知道"被忽略的评估"是什么
- 知道厂商报告的局限性

## 14.2 一份典型模型报告的结构

以 GPT-4o 报告 / Claude 3.5 报告 / DeepSeek-V3 报告为例：

```markdown
# [Model Name] Technical Report

## 1. Introduction
## 2. Training Data
## 3. Training Method
## 4. Architecture
## 5. Evaluation
   ### 5.1 Knowledge
   ### 5.2 Reasoning
   ### 5.3 Coding
   ### 5.4 Multilingual
   ### 5.5 Safety
## 6. Limitations
## 7. Conclusion
```

## 14.3 训练数据章节的猫腻

**厂商常说的**：

> "我们用了 13 万亿 token 的高质量数据，包括网页、书籍、代码…"

**应该问的**：

1. **多少 token？** 13T 是大，但 GPT-4 用 13T，Llama 3 用 15T。**差异多大？**
2. **什么来源？** 网页占多少？代码占多少？**如果代码占比低，代码能力可能差。**
3. **数据截止日期？** 2024-09 vs 2025-03 → 后者能多答新事件
4. **去重了吗？** 没去重 = 同一段话出现 N 次 = 表面 token 多
5. **过滤了吗？** 过滤了低质量 = 实际数据少
6. **是否包含测试集？** 必须明确说"我们的训练数据不包含 MMLU/GSM8K/HumanEval" → 否则有数据污染风险

## 14.4 训练方法章节的猫腻

**厂商常说的**：

> "我们用 SFT + RLHF + DPO 训练"

**应该问的**：

1. **SFT 数据多少？** 100k 还是 1M？
2. **RLHF 的人类反馈多少？** 100k 还是 10M？
3. **用了 red teaming 吗？** 多大规模？
4. **Constitutional AI 用了？** 多大规模？
5. **训练算力多少？** FLOPs 越多效果越好

## 14.5 评估章节的 4 个关键数字

**必须看的 4 类评估**

| 类别 | 必看基准 | 为什么重要 |
|---|---|---|
| **学科/知识** | MMLU + MMLU-Pro | 通用知识面 |
| **推理** | GPQA Diamond | 博士级推理 |
| **人类偏好** | Arena Elo | 真实用户感受 |
| **代码** | HumanEval + SWE-bench | 真实工程能力 |

**进阶要看**

- **GSM8K / MATH** — 数学推理
- **TruthfulQA** — 真实性
- **HellaSwag** — 常识
- **IFEval** — 指令遵循
- **MGSM** — 多语言数学
- **HumanEval+** — HumanEval 增强版

**关键：要看"基线对比"**

| 模型 | 报告里通常包含 |
|---|---|
| 同系列旧版本 | GPT-4 vs GPT-4o |
| 竞品 | vs Claude vs Gemini vs DeepSeek |
| 人类基线 | vs human-level |

## 14.6 数字背后的"猫腻"

**猫腻 1：few-shot 数量不报**

| 报告写法 | 实际意义 |
|---|---|
| "MMLU: 88.7%" | 可能是 0-shot, 5-shot, 25-shot？ |
| "MMLU: 88.7% (5-shot CoT)" | 明确，公平 |

**对策**：必须看脚注或附录的方法部分。

**猫腻 2：温度不固定**

| 报告写法 | 实际意义 |
|---|---|
| "MMLU: 88.7%" | 可能 temperature=0.7 取了 5 次平均？ |
| "MMLU: 88.7% (temp=0, greedy)" | 明确，公平 |

**猫腻 3：评测 prompt 不公开**

| 报告写法 | 实际意义 |
|---|---|
| "MMLU: 88.7%" | 不知道用了什么 prompt 模板 |
| "MMLU: 88.7% (见 appendix A 完整 prompt)" | 公开，可复现 |

**猫腻 4：选择"最好的"而非"典型的"**

| 报告写法 | 实际意义 |
|---|---|
| "pass@1 = 80%" | 跑了 1000 次取平均？ |
| "pass@100 (best of 100) = 80%" | 自欺欺人 |

**猫腻 5：Cherry-pick 测试**

| 报告写法 | 实际意义 |
|---|---|
| "在我们精选的 100 题上..." | 测自己出的题 |
| "在公开基准 MMLU..." | 公平对比 |

## 14.7 GPT-4o 报告解读示例

```
GPT-4o 报告核心数字：
- MMLU: 88.7% (5-shot)
- GPQA: 56.1% (0-shot CoT, Diamond)
- HumanEval: 90.2% (0-shot)
- MATH: 76.6% (4-shot, self-consistency @ temp=0.5)
- Arena Elo: 1287
- Human-level: 在大多数任务上达到或超过
```

**解读**：
- MMLU 88.7% 已接近天花板
- GPQA 56.1% 略高于人类博士的 65%? 实际略低
- HumanEval 90.2% 是 pass@1，单次就 90%
- Arena Elo 1287 = 用户真实反馈的反映

## 14.8 Claude 3.5 Sonnet 报告解读

```
Claude 3.5 Sonnet 报告核心数字：
- MMLU: 88.5% (5-shot)
- GPQA: 59.4% (0-shot CoT)
- HumanEval: 92.0% (0-shot)
- SWE-bench Verified: 49.0% ⭐
- Arena Elo: 1271
```

**解读**：
- SWE-bench 49% 是当前最强，远超 GPT-4o 的 33.2%
- 但 GPQA 略低于 GPT-4o
- 综合偏好略低于 GPT-4o

## 14.9 DeepSeek-V3 报告解读

```
DeepSeek-V3 报告核心数字：
- MMLU: 88.5% (5-shot)
- GPQA: 59.4% (0-shot CoT)
- HumanEval: 82.6% (0-shot)
- Arena Elo: 1256
- 训练成本: 5.5M 美元 ⭐
```

**解读**：
- 性能接近 GPT-4o
- 但训练成本仅 5.5M 美元（GPT-4 估计 100M+）
- 性价比极高
- **被低估的强模型**

## 14.10 厂商报告里"被忽略"的评估

**几乎不报的**

| 类型 | 原因 |
|---|---|
| 长上下文表现 | 多数厂商重 NIAH 营销，实际 RULER 表现未必好 |
| 延迟/吞吐量 | 影响用户但厂商不报 |
| 成本（API 价格） | 各家差异大 |
| 能源消耗 | 不利于营销 |
| 失败模式 | 容易招黑 |

**看了不报的**

- 用户投诉率
- 真实业务 ROI
- 客服场景表现
- 多 Agent 协作

## 14.11 厂商报告的"绿色数字"风险

> 报告里所有数字都是"光鲜"的。**没报的数字往往更重要。**

**实际选型流程**：

```
1. 看 3-5 份报告
2. 提取关键数字
3. 在自己的业务场景上做 hold-out 评估
4. 不要直接信报告数字
```

**金句**：*Every model report is a marketing document, not a scientific paper.*

## 14.12 实战：解读一份报告

**任务**：拿到一份厂商报告，完成以下分析：

```markdown
# 报告解读：[模型 X]

## 1. 训练数据
- Token 数：____
- 数据截止：____
- 是否声明不包含测试集：____

## 2. 训练方法
- 用了 SFT/RLHF/DPO：____
- 红队规模：____

## 3. 评估
- MMLU: ____% (几-shot)
- GPQA: ____%
- HumanEval: ____%
- Arena Elo: ____
- 人类基线: ____

## 4. 没报的
- 延迟：____
- 长上下文真实表现：____

## 5. 猫腻
- 是否有 cherry-pick：____
- 评估方法是否公开：____

## 6. 建议
- 我们要不要用：____
- 试用场景：____
```

## 14.13 验收自测

1. **选择**：以下哪项最容易有"猫腻"？
   - A. MMLU 准确率
   - B. Arena Elo
   - C. 自家出的测试集分数
   - D. TruthfulQA

2. **简答**：为什么"被忽略的评估"比"报告里的评估"更重要？

3. **实操**：找一份最近的厂商报告（GPT-4o、Claude 3.5、Gemini 1.5、DeepSeek-V3），完成上面的报告解读模板。

## 14.14 📋 本章 Cheat Sheet

| 概念 | 一句话 | 详见 |
|---|---|---|
| 报告结构 | 摘要/训练数据/训练方法/评估表/安全/局限 | §14.2 |
| 必看 4 类 | MMLU/GPQA/Arena/HumanEval+SWE-bench | §14.5 |
| few-shot 数量 | 必须看清 0/5/25-shot | §14.6 |
| 温度参数 | temp=0 才是稳 | §14.6 |
| prompt 公开 | 未公开 = 不可复现 | §14.6 |
| Cherry-pick | 自选 100 题打分 = 自欺 | §14.6 |


## 14.15 ⚠️ 5 个常见错误

1. **只看 MMLU 分数** — MMLU 已刷到 88%+,区分度低,看 GPQA/SWE-bench/Arena 才有信息。
2. **不看 few-shot 数量** — 'MMLU 88.7%' 不写 5-shot/25-shot = 不可复现,警惕。
3. **不查温度参数** — 温度不固定 = 分数波动,必须看清是否 temp=0。
4. **信厂商 prompt 模板** — 未公开 prompt = 不可复现,警惕刷榜。
5. **只看被报的评估** — 延迟/长上下文/成本/失败模式往往不报,这些才是选型关键。

## 14.16 延伸阅读

⭐⭐⭐
- [GPT-4o System Card](https://openai.com/index/gpt-4o-system-card/) — 顶级报告范例
- [Claude 3 Model Card](https://www-cdn.anthropic.com/de8ba9b01c9ab7cbabf5c33b80b7bbc618857627/Model_Card_Claude_3.pdf) — 安全评估详尽
- [DeepSeek-V3 报告](https://github.com/deepseek-ai/DeepSeek-V3) — 训练成本公开

⭐⭐
- [Gemini 1.5 技术报告](https://arxiv.org/abs/2403.05530) — 长上下文
- [Llama 3 报告](https://arxiv.org/abs/2407.21783) — 训练数据详解
- [Qwen2.5 报告](https://qwenlm.github.io/blog/qwen2.5/) — 多语言

⭐
- [How to Read a LLM Paper (Sebastian Raschka)](https://magazine.sebastianraschka.com/p/llm-research-papers-2024) — 论文阅读指南
- [Interpreting LLM Benchmarks (Hugging Face)](https://huggingface.co/blog/leaderboard-interpretability) — 排行榜解读
