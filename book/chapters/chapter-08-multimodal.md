# 8. 多模态评估基准

> **如果只读一节**：MMMU = 多学科多模态，MMBench = 综合视觉问答，MathVista = 数学视觉，ChartQA = 图表理解，HallusionBench = 视觉幻觉。

## 8.1 本章目标

读完后你能：

- 区分多模态基准的能力维度
- 知道"视觉幻觉"是个独立的问题
- 知道 OCRBench 测光学字符识别
- 知道评测多模态模型的关键挑战

## 8.2 多模态基准的 5 类

| 类型 | 测什么 | 代表基准 |
|---|---|---|
| 学科综合 | 多学科 + 图 | MMMU, MMBench |
| 视觉问答 | 图 + 自然语言 | VQA v2, OK-VQA |
| 文档理解 | 图 + 文字 + 表格 | DocVQA, ChartQA, AI2D |
| 幻觉检测 | 模型"看到"不存在的东西 | POPE, HallusionBench |
| OCR | 文字识别 | OCRBench, TextVQA |

## 8.3 MMMU — 多学科多模态

### 一句话定义

> 11,500 题，覆盖 30 个学科（艺术设计、商业、科学、医学、人文、技术）。**多模态版的 MMLU。**

### 样例（MMMU 艺术设计）

> **问题**：[图：莫奈《睡莲》] 这幅作品的画家属于哪个艺术流派？
> A) 印象派
> B) 立体派
> C) 超现实主义
> D) 表现主义
>
> **正确答案**：A

### 学科分布

| 类别 | 学科数 | 题目数 |
|---|---|---|
| Art & Design | 5 | 1,800 |
| Business | 4 | 1,500 |
| Science | 5 | 2,000 |
| Health & Medicine | 5 | 1,800 |
| Humanities & Social Science | 5 | 1,800 |
| Tech & Engineering | 6 | 2,600 |

### 当前 SOTA

| 模型 | MMMU (val) |
|---|---|
| GPT-4o | 69.1% |
| Claude 3.5 Sonnet | 68.3% |
| Gemini 1.5 Pro | 65.0% |
| Qwen2.5-VL-72B | 70.2% ⭐ |
| InternVL2-76B | 68.9% |

## 8.4 MMBench — 综合视觉基准

### 一句话

> 3,000 题，覆盖 20 个细粒度能力维度。**评估视觉模型的"全科能力"。**

### 能力维度

| 维度 | 示例 |
|---|---|
| 物体识别 | 识别图中的动物 |
| 场景理解 | 描述图中的场景 |
| 计数 | 数图中有几个人 |
| OCR | 读图中的文字 |
| 推理 | 根据图推理 |
| 情感 | 识别图中的情绪 |

### 特色

- **Likert 评分**（1-5 分）vs 简单正确/错误
- 提供 **CircularEval**（循环评估）减少位置偏差

## 8.5 MathVista — 视觉数学

### 一句话

> 6,141 题，28 个数据集，**测视觉 + 数学的联合能力**。详见第 6 章。

## 8.6 ChartQA — 图表理解

### 一句话

> 9,600 题，**测"看图读数 + 计算"的能力**。

### 样例

> **图**：[柱状图，X 轴是月份，Y 轴是销售额，1 月 100，2 月 150，3 月 200]
> **问题**：3 月份的销售额比 1 月份高百分之多少？
> **答案**：100%

### 当前 SOTA

| 模型 | ChartQA |
|---|---|
| GPT-4o | 85.7% |
| Claude 3.5 Sonnet | 90.8% ⭐ |
| Qwen2.5-VL-72B | 88.0% |
| Gemini 1.5 Pro | 87.0% |

## 8.7 DocVQA — 文档理解

### 一句话

> 10,194 题，**测"读懂文档图片"的能力**。包括发票、合同、表格、表单等。

### 样例

> **图**：[一张发票]
> **问题**：这张发票的总金额是多少？
> **答案**：$1,234.56

### 当前 SOTA

| 模型 | DocVQA |
|---|---|
| GPT-4o | 92.8% |
| Gemini 1.5 Pro | 93.0% |
| Qwen2.5-VL-72B | 94.0% ⭐ |
| Claude 3.5 Sonnet | 89.0% |

## 8.8 AI2D — 图表与示意图

### 一句话

> 5,000 道题，**测"理解科学示意图"的能力**。包括物理、生物、化学、地球科学。

## 8.9 OCRBench — 光学字符识别

### 一句话

> 1,000 题，**测"看图识字"的能力**。多语言、多场景。

### 子任务

- 文本识别
- 文档 VQA
- 关键信息提取
- 手写识别
- 罕见字符

## 8.10 POPE — 视觉幻觉评估

### 一句话

> 测"模型说图里有 X，但 X 其实不在"的现象。**用是/否问题。**

### 样例

> **问题**：图里有猫吗？
> A) 是
> B) 否
>
> **评分**：
> - TP：图里有猫，模型答"是" ✓
> - FP：图里没猫，模型答"是" ✗（幻觉）
> - TN：图里没猫，模型答"否" ✓
> - FN：图里有猫，模型答"否" ✗

### 关键指标

```
accuracy = (TP + TN) / (TP + TN + FP + FN)
precision = TP / (TP + FP)  # 减少幻觉的关键
recall = TP / (TP + FN)
F1
```

## 8.11 HallusionBench — 高级幻觉检测

### 一句话

> 460 题，**专门测复杂推理下的视觉幻觉**。

### 类型

- 错觉（Illusion）：图故意有歧义
- 长推理（Long Reasoning）：需要多步推理
- 对比（Comparison）：两张图对比

## 8.12 视觉问答（VQA 系列）

| 基准 | 测什么 | 规模 |
|---|---|---|
| VQA v2 | 通用 VQA | 1.1M |
| OK-VQA | 知识型 VQA | 14k |
| TextVQA | 文字 + 视觉 | 45k |
| GQA | 场景图 VQA | 22M |
| VizWiz | 视障人士 VQA | 31k |

## 8.13 多模态评估的挑战

### 挑战 1：图像预处理差异

不同模型用不同分辨率、归一化方式 → 同样图像输入实际不同。

### 挑战 2：幻觉难量化

"模型说得不对" vs "模型说了一个图里没有的细节" — 程度差异大。

### 挑战 3：OCR 失败 ≠ 视觉失败

模型可能因为读不出图里的字而答错，但这不反映"视觉能力"。

## 8.14 章节汇总

| 基准 | 测什么 | 规模 | 当前 SOTA |
|---|---|---|---|
| MMMU | 多学科多模态 | 11.5k | 70% (Qwen-VL) |
| MMBench | 综合视觉 | 3k | 85% |
| MathVista | 视觉+数学 | 6k | 75% (Qwen-VL) |
| ChartQA | 图表理解 | 9.6k | 91% (Claude) |
| DocVQA | 文档理解 | 10k | 94% (Qwen-VL) |
| AI2D | 科学示意图 | 5k | 90% |
| OCRBench | OCR | 1k | 90% |
| POPE | 视觉幻觉 | 9k | 90% (precision) |
| HallusionBench | 复杂幻觉 | 460 | 65% |
| VQA v2 | 通用 VQA | 1.1M | 85% |

## 8.15 实战：评估 MMMU

```bash
# 用 VLMEvalKit
pip install vlmeval
python run.py --model Qwen2.5-VL-72B --data MMMU_DEV_VAL

# 期望输出
{
  "Overall": 70.2,
  "Art & Design": 75.0,
  "Business": 68.5,
  ...
}
```

## 8.16 验收自测

1. **选择**：哪个基准专门测"模型幻觉"？
   - A. MMMU
   - B. ChartQA
   - C. POPE
   - D. VQA v2

2. **简答**：为什么 OCRBench 不算纯视觉能力测试？

3. **实操**：用 VLMEvalKit 跑一次 MMMU 评估你的多模态模型。

## 8.17 延伸阅读

⭐⭐⭐
- [MMMU 论文](https://arxiv.org/abs/2311.16502) — 多模态 MMLU
- [MMBench 论文](https://arxiv.org/abs/2307.06281) — 综合视觉
- [POPE 论文](https://arxiv.org/abs/2305.10355) — 视觉幻觉

⭐⭐
- [MathVista 论文](https://arxiv.org/abs/2310.08955) — 视觉+数学
- [ChartQA 论文](https://arxiv.org/abs/2203.10244) — 图表理解
- [DocVQA 论文](https://arxiv.org/abs/2007.00398) — 文档

⭐
- [HallusionBench](https://github.com/open-compass/HallusionBench) — 高级幻觉
- [OCRBench](https://github.com/Yuliang-Liu/MultimodalOCR) — OCR 综合
