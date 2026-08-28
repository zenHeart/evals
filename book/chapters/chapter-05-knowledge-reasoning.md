# 5. 学科知识与综合推理基准

> **如果只读一节**：MMLU 是"学科知识"的代名词，CMMLU/C-Eval 是中文版，HellaSwag/PIQA/WinoGrande 测"常识"，ARC-AGI 是新一代推理挑战。

## 5.1 本章目标

读完后你能：

- 说出 MMLU 是什么、测什么、怎么评分
- 区分学科知识、常识推理、抽象推理三类基准
- 知道中文 MMLU 等价物 CMMLU / C-Eval 的差异
- 知道 ARC-AGI 与传统基准的本质区别

## 5.2 MMLU — Massive Multitask Language Understanding

### 一句话定义

> MMLU = 57 个学科 × 14,042 道多选题。测模型的"通识教育水平"。

**前端类比**：SAT + GRE + 律师 + 医生资格考试的迷你版。

### 数据集结构

```json
{
  "question": "在一个标准化的解决方案中,糖的质量(m)与体积(V)的比率称为:",
  "choices": ["A. 密度", "B. 重量", "C. 浓度", "D. 相对密度"],
  "answer": "A"
}
```

### 学科分布（57 个）

| 类别 | 学科示例 | 数量 |
|---|---|---|
| STEM | 数学、物理、计算机科学、生物、化学 | ~7,000 |
| 人文 | 历史、政治、哲学、宗教 | ~3,000 |
| 社会科学 | 经济、心理、社会学、地理 | ~2,000 |
| 其他 | 商业、法律、医学、其他专业 | ~2,000 |

### 评分方式

```typescript
function mmluScoring(modelOutput: string, correctAnswer: string): boolean {
  // 提取模型选择 (A/B/C/D)
  const m = modelOutput.match(/\b([A-D])\b/);
  return m?.[1] === correctAnswer;
}
```

简单：选对 = 1 分，选错 = 0 分。**没有"接近对"的概念**。

### 局限性

1. **数据污染严重** — 训练数据可能包含 MMLU 题目
2. **多选题形式简化** — 真实任务多是开放式
3. **学科分布偏美国** — 美国学生熟悉的学科
4. **没有推理过程** — 选对不等于真懂

### 当前 SOTA（2026 年）

| 模型 | MMLU 分数 |
|---|---|
| GPT-4o | 88.7% |
| Claude 3.5 Sonnet | 88.5% |
| Gemini 1.5 Pro | 85.9% |
| DeepSeek-V3 | 88.5% |
| Qwen2.5-72B | 86.1% |
| Llama 3.1-405B | 88.6% |

（来源：各厂商技术报告 2024–2026，5-shot 评估）

## 5.3 MMLU-Pro — 强化版

### 解决什么问题

MMLU 已被刷到 88%+，区分度下降。MMLU-Pro 做了 3 件事：

1. **选项从 4 个扩到 10 个**（更难瞎猜）
2. **移除简单噪声题**（让真正难的留下）
3. **强调 CoT 推理**（必须写思考过程）

### 难度提升

| 基准 | 选项数 | 题目数 | GPT-4o 分数 |
|---|---|---|---|
| MMLU | 4 | 14,042 | 88.7% |
| MMLU-Pro | 10 | 12,032 | 76.2% |

**MMLU-Pro 分数比 MMLU 低 12%**，但更接近真实能力。

## 5.4 CMMLU & C-Eval — 中文版 MMLU

### CMMLU

> 67 个学科，11,528 题，简体中文。

- 包含中国高考、公务员考试、医学院考试风格题目
- 适合评估中文模型的"中国通识"能力

### C-Eval

> 52 个学科，13,948 题，涵盖初中到专业级。

- 与 CMMLU 高度重合
- 提供 4 个难度等级：初中/高中/大学/专业

### 中英文对比样例

**MMLU（英文）**：
> "The first law of thermodynamics states that:"
> A) energy can be created
> B) energy can be destroyed
> C) energy is conserved
> D) entropy always increases

**C-Eval（中文）**：
> "下列关于光合作用的叙述，正确的是:"
> A) 光合作用只在白天进行
> B) 光合作用产生氧气
> C) 光合作用不需要光
> D) 光合作用消耗氧气

### 实操：在 OpenCompass 上跑 CMMLU

```bash
# 安装
pip install opencompass

# 准备模型
opencompass --models hf_qwen2_5_7b_instruct --datasets cmmlu

# 输出
dataset        version    metric   mode    qwen2.5-7b-instruct
cmmlu          3c8d70     accuracy gen                 72.43
```

## 5.5 AGIEval — 大学入学考试风格

### 一句话定义

> 用真实的中国高考、美国 SAT、律师资格考试、数学竞赛等题目评估模型。

**特点**：题目是**真实考题**，不是合成的。

### 包含的考试

| 考试 | 国家 | 题目数 |
|---|---|---|
| 中国高考 | 中国 | 1,000+ |
| 美国 SAT | 美国 | 1,000+ |
| LSAT 律师考试 | 美国 | 500+ |
| GRE | 美国 | 500+ |
| 数学竞赛 AMC | 美国 | 200+ |
| 全国数学联赛 | 中国 | 200+ |

## 5.6 HellaSwag — 常识推理

### 一句话定义

> 给你一个场景描述，从 4 个结尾里选"最合理"的。

**前端类比**：next.js / eslint 等工具的"智能补全"——给前文选最自然的续写。

### 样例

> 场景：一个人走到厨房，打开冰箱，拿出…
> A) 一本数学书
> B) 一瓶牛奶
> C) 一辆玩具车
> D) 一块石头

正确答案 **B**。人类 95%+ 正确，GPT-4o 95%+ 正确。

### 评分

```typescript
// 4 选 1，正确率
function hellaswagScoring(modelChoice: string, correctChoice: string): boolean {
  return modelChoice === correctChoice;
}
```

### 局限性

- 题目是 2019 年的，可能已污染
- 场景偏英文北美生活
- 简单题目已被刷到天花板

## 5.7 PIQA — 物理常识

### 一句话定义

> 测"物理常识"——日常生活中的物理直觉。

### 样例

> 目标：把水从杯子里倒到碗里
> A) 倾斜杯子，让水从杯口流出
> B) 把杯子放在碗里，等水自己流过去

正确答案 **A**。模型要"理解"重力。

### 数据规模

- 训练集：16,000 题
- 测试集：2,000 题
- 人类准确率：95%

## 5.8 WinoGrande — 代词消歧

### 一句话定义

> 测"常识推理"中的代词指代理解。

### 样例

> 房子比车库大，因为**它**是用石头建的。
> A) 房子
> B) 车库

**陷阱**：语法上"它"可指两者，但常识说"石头建造的是房子"。

### 规模

- 44,000 题
- 专门为对抗大型 LM 数据污染设计

## 5.9 ARC-AGI — 抽象推理新挑战

### 一句话定义

> 图形抽象推理，类似"瑞文推理测验"。**当前 LLM 仍远低于人类**。

### 样例（文字描述）

```
输入网格：
🟦🟦🟥
🟦🟥🟦
🟥🟦🟦

输出网格：
🟦🟥
🟥🟦

规则：取对角线
```

### 与传统基准的本质区别

| 传统基准 | ARC-AGI |
|---|---|
| 测"已知知识的回忆" | 测"未知规则的发现" |
| 题目数 ≥ 1000 | 题目数 1000，但每题独立 |
| 题型单一（多选） | 题型多样（图案变换） |
| 已被刷到 90%+ | 当前 SOTA 40-60% |

### 当前 SOTA

- 人类：~76%
- GPT-4o：~40%
- Claude 3.5：~50%
- DeepSeek-R1：~55%

**ARC-AGI 仍是 AI 与人类智能差距最大的基准之一。**

## 5.10 章节汇总表

| 基准 | 规模 | 类型 | 中文支持 | 评分 | 当前 SOTA |
|---|---|---|---|---|---|
| MMLU | 14k | 多选·学科 | ❌ | accuracy | 88.7% (GPT-4o) |
| MMLU-Pro | 12k | 多选·学科（难） | ❌ | accuracy | 76.2% (GPT-4o) |
| CMMLU | 11k | 多选·学科 | ✅ | accuracy | 82% (Qwen2.5) |
| C-Eval | 14k | 多选·学科 | ✅ | accuracy | 80% (DeepSeek-V3) |
| AGIEval | 8k | 真实考题 | 中英 | accuracy | 75% (GPT-4o) |
| HellaSwag | 40k | 常识续写 | ❌ | accuracy | 95% |
| PIQA | 18k | 物理常识 | ❌ | accuracy | 91% |
| WinoGrande | 44k | 代词消歧 | ❌ | accuracy | 90% |
| ARC-AGI | 1k | 抽象推理 | ❌ | accuracy | 55% (DeepSeek-R1) |

## 5.11 实战：跑一次 MMLU 评估

```bash
# 方法 1：用 lm-evaluation-harness
pip install lm-eval
lm_eval --model hf \
    --model_args pretrained=Qwen/Qwen2.5-7B-Instruct \
    --tasks mmlu \
    --num_fewshot 5 \
    --output_path ./eval_results

# 方法 2：用 OpenCompass
pip install opencompass
opencompass --models hf_qwen2_5_7b_instruct --datasets mmlu

# 方法 3：自己写（30 行）
# 见第 3 章的 100 行模板，替换数据集为 MMLU JSONL
```

## 5.12 验收自测

1. **选择**：MMLU 包含多少学科？
   - A. 14
   - B. 57
   - C. 100
   - D. 200

2. **简答**：MMLU-Pro 比 MMLU 难在哪？

3. **实操**：用 lm-evaluation-harness 在你的笔记本上跑一次 MMLU（用 Qwen2.5-7B 或 GPT-4o-mini API）。

## 5.13 延伸阅读

⭐⭐⭐
- [MMLU 论文 (Hendrycks et al. 2021)](https://arxiv.org/abs/2009.03300) — 原始论文
- [MMLU-Pro 论文](https://arxiv.org/abs/2406.01574) — 强化版
- [ARC-AGI 官网](https://arcprize.org/) — 当前最难的抽象推理

⭐⭐
- [OpenCompass 排行榜](https://opencompass.org.cn/rank) — 中文模型基准对比
- [CMMLU 论文](https://arxiv.org/abs/2306.09212) — 中文 MMLU
- [AGIEval 论文](https://arxiv.org/abs/2304.06364) — 真实考试题目

⭐
- [HellaSwag 论文](https://arxiv.org/abs/1905.07830) — 常识推理
- [PIQA 论文](https://arxiv.org/abs/1911.11641) — 物理常识
- [WinoGrande 论文](https://arxiv.org/abs/1907.10641) — 代词消歧
