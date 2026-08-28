# 6. 数学与逻辑推理基准

> **如果只读一节**：GSM8K = 小学数学应用题，MATH = 高中竞赛，FrontierMath = 研究级数学。当前最强模型也只能做对一半 FrontierMath。

## 6.1 本章目标

读完后你能：

- 区分 GSM8K / MATH / AIME / FrontierMath 的难度
- 知道 GPQA 是"专家级科学问答"
- 知道 MathVista 是多模态数学
- 理解为什么数学评估能区分"推理能力"

## 6.2 为什么数学是 LLM 的核心试金石

数学推理需要：

1. **理解问题** — 解析自然语言
2. **拆解问题** — 分解为子步骤
3. **逐步计算** — 每步准确
4. **格式化输出** — 最终答案可校验

**少一步就错**，没有"差不多正确"。

**前端类比**：单元测试。`expect(add(1, 2)).toBe(4)` 就是错，没有"接近 3"。

## 6.3 GSM8K — 小学数学

### 一句话定义

> 8,500 道小学数学应用题。**CoT 推理的代表作**。

### 真实样例

> **题目**：Natalia 在 4 月份卖给了客户 48 个发夹。5 月份，她的销量是 4 月份的一半。**6 月份，她的销量是 5 月份的 3 倍**。Natalia 6 月份卖了多少个发夹？
>
> **参考答案**：
> Natalia 5 月份卖了 48/2 = **24** 个发夹。
> Natalia 6 月份卖了 24 × 3 = **72** 个发夹。
> 答案：72

### 评分方式

```typescript
function gsm8kScoring(modelOutput: string, groundTruth: string): boolean {
  // 提取模型输出的最终数字
  const m = modelOutput.match(/####\s*(-?\d+\.?\d*)/);
  if (!m) {
    // 兜底：找最后一个数字
    const nums = modelOutput.match(/-?\d+\.?\d*/g);
    if (!nums) return false;
    return nums[nums.length - 1] === groundTruth;
  }
  return m[1] === groundTruth;
}
```

### 当前 SOTA

| 模型 | GSM8K (8-shot) |
|---|---|
| GPT-4o | 96.0% |
| Claude 3.5 Sonnet | 96.4% |
| Gemini 1.5 Pro | 94.0% |
| DeepSeek-V3 | 94.0% |
| Qwen2.5-72B | 95.0% |
| Llama 3.1-405B | 96.0% |

（来源：各厂商技术报告，pass@1，2024–2026）

**GSM8K 已被刷到 95%+，区分度下降。**

## 6.4 MATH — 高中竞赛

### 一句话定义

> 12,500 道高中数学竞赛题。**比 GSM8K 难一个量级**。

### 难度分布

| 等级 | 题目数 | 描述 |
|---|---|---|
| Level 1 | ~3,000 | AMC 入门 |
| Level 2 | ~3,000 | AMC 中等 |
| Level 3 | ~3,000 | AIME 难度 |
| Level 4 | ~3,000 | 奥赛 |
| Level 5 | ~1,000 | 奥赛高级 |

### 真实样例（Level 3）

> **题目**：求满足 $x^2 + y^2 = z^2$ 的所有**正整数**三元组 $(x, y, z)$，其中 $x$ 和 $y$ 互质，且 $x$ 是奇数。证明这样的三元组有无穷多个。
>
> **参考答案**：
> 证明：设 $x = 2k+1$，$y = 2m$，$z = 2n$。通过 Pell 方程可证有无穷解。
> [详细步骤略]

### 评分方式

```typescript
function mathScoring(modelOutput: string, groundTruth: string): boolean {
  // MATH 答案格式是 \boxed{...}
  const m = modelOutput.match(/\\boxed\{([^}]+)\}/);
  if (!m) return false;
  // 用数学等价比较（sympy）
  return isMathematicallyEqual(m[1], groundTruth);
}

// sympy 等价比较示例
function isMathematicallyEqual(a: string, b: string): boolean {
  // 简化：字符串相等 + 数值相等
  if (a.trim() === b.trim()) return true;
  try {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return Math.abs(numA - numB) < 1e-6;
    }
  } catch {}
  return false;
}
```

### 当前 SOTA

| 模型 | MATH (4-shot) |
|---|---|
| GPT-4o | 76.6% |
| Claude 3.5 Sonnet | 71.1% |
| Gemini 1.5 Pro | 67.5% |
| DeepSeek-R1 | 97.3% ⭐ |
| Qwen2.5-Math-72B | 86.0% |

**DeepSeek-R1 在 MATH 上接近满分 97.3%，主要靠 CoT 强化训练。**

## 6.5 MATH-500 — 精简版

### 一句话

> 从 MATH 中精选 500 题，OpenAI 用来做 GPT-4 评估的子集。

**优点**：跑得快，适合快速回归。

## 6.6 AIME 2024/2025 — 美国数学邀请赛

### 一句话

> 每年 30 题，限时 3 小时，**美国高中奥赛最难级别**。

### 真实样例（AIME 2024 I 第 6 题）

> 求满足以下条件的三位数 $\overline{abc}$ 的个数：$a + b + c$ 能被 7 整除，且 $a - b$ 是质数。

**参考答案**：75

### 为什么 AIME 重要

- **题目数量少**（30 题/年）→ 高方差
- **难度大** → 区分推理能力
- **真实奥赛** → 比合成题更能测真实水平

### 当前 SOTA（AIME 2024）

| 模型 | AIME 2024 |
|---|---|
| GPT-4o | 13.3% |
| Claude 3.5 Sonnet | 16.0% |
| DeepSeek-R1 | 79.8% ⭐ |
| Qwen2.5-Math-72B | 60.0% |

## 6.7 FrontierMath — 研究级数学

### 一句话

> Epoch AI 出品的"研究级数学"，**目前 LLM 几乎做不对**。

### 难度

- 需要数论、代数几何、组合数学等研究生级数学
- 题目由专业数学家设计
- **任何 LLM 当前都 < 5%**（截至 2026）

### 设计哲学

> "We need benchmarks that distinguish between models that are merely competent at math and models that can do original research."

> 我们需要能区分"数学熟练"和"原创研究"的基准。

### 价值

> FrontierMath 是 **AGI 在数学领域的最强信号**。能做对 FrontierMath = 接近 AGI。

## 6.8 GPQA — 专家级科学问答

### 一句话

> Google Research 出品，物理学/化学/生物学**博士级**多选题。**人类博士也只有 65%。**

### 学科

- Physics（148 题）
- Chemistry（148 题）
- Biology（148 题）
- 总计 ~450 题

### 真实样例（GPQA Physics）

> Which of the following is the most likely cause of the cosmic microwave background (CMB) acoustic peak structure?
> A) Primordial gravitational waves
> B) Baryon-photon acoustic oscillations
> C) Dark matter annihilation
> D) Inflationary quantum fluctuations

**正确答案**：B

### 当前 SOTA

| 模型 | GPQA (Diamond) |
|---|---|
| GPT-4o | 50.6% |
| Claude 3.5 Sonnet | 59.4% |
| Gemini 1.5 Pro | 46.2% |
| DeepSeek-R1 | 71.5% ⭐ |
| 人类博士 | 65% |

**DeepSeek-R1 已超过人类博士。**

## 6.9 MathVista — 多模态数学

### 一句话

> 数学题 + 图片（几何图形、统计图表）。**测视觉 + 数学的联合能力。**

### 题型

- 几何题（看图求角度、面积）
- 统计图（看柱状图回答问题）
- 表格理解
- 公式识别

### 当前 SOTA

| 模型 | MathVista |
|---|---|
| GPT-4o | 63.8% |
| Claude 3.5 Sonnet | 67.7% |
| Gemini 1.5 Pro | 63.9% |
| Qwen2.5-VL-72B | 74.8% ⭐ |

## 6.10 章节汇总

| 基准 | 难度 | 规模 | 评分 | 当前 SOTA 模型 | SOTA 分数 |
|---|---|---|---|---|---|
| GSM8K | 小学 | 8.5k | 数字匹配 | GPT-4o | 96.0% |
| MATH | 高中竞赛 | 12.5k | 数学等价 | DeepSeek-R1 | 97.3% |
| MATH-500 | 高中精选 | 500 | 数学等价 | DeepSeek-R1 | 96.8% |
| AIME 2024 | 奥赛 | 30 | 数字匹配 | DeepSeek-R1 | 79.8% |
| AMC 2023 | 奥赛 | 40 | 数字匹配 | DeepSeek-R1 | 90.0% |
| FrontierMath | 研究级 | 300+ | 数学等价 | 任何模型 | < 5% |
| GPQA | 博士级 | 450 | 多选 | DeepSeek-R1 | 71.5% |
| MathVista | 视觉+数学 | 6,000 | 多样 | Qwen2.5-VL | 74.8% |

## 6.11 实战：评估 GSM8K

```bash
# 用 OpenCompass 跑 GSM8K
opencompass --models hf_qwen2_5_7b_instruct --datasets gsm8k

# 用 lm-evaluation-harness
lm_eval --model hf \
    --model_args pretrained=Qwen/Qwen2.5-7B-Instruct \
    --tasks gsm8k \
    --num_fewshot 8
```

**期望输出**：
```
Tasks  Version  Filter  Metric    Value  Stderr
-----  -------  ------  ------    -----  ------
gsm8k     yaml   none   exact_match  85.7  ±0.6
```

## 6.12 验收自测

1. **选择**：哪个数学基准最接近"研究级"难度？
   - A. GSM8K
   - B. MATH
   - C. AIME
   - D. FrontierMath

2. **简答**：为什么 GSM8K 已被"刷到天花板"，但 AIME 还远未饱和？

3. **实操**：用 OpenCompass 跑一次 MATH-500 评估你的模型。

## 6.13 延伸阅读

⭐⭐⭐
- [GSM8K 论文](https://arxiv.org/abs/2110.14168) — CoT 推理的开山之作
- [MATH 论文](https://arxiv.org/abs/2103.03874) — 高中竞赛
- [FrontierMath 报告 (Epoch AI)](https://epochai.org/frontiermath) — 研究级数学
- [GPQA 论文](https://arxiv.org/abs/2311.12022) — 博士级科学

⭐⭐
- [DeepSeek-R1 报告](https://arxiv.org/abs/2501.12948) — 数学推理的飞跃
- [MathVista 论文](https://arxiv.org/abs/2310.08955) — 多模态数学

⭐
- [AIME 2024 题目集](https://artofproblemsolving.com/wiki/index.php/AIME_Problems_and_Solutions) — 真实题目
- [OpenCompass 数学榜](https://opencompass.org.cn/rank)
