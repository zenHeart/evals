# 10. 长上下文、安全、Agent 综合基准

> **如果只读一节**：长上下文 = Needle-in-a-Haystack；事实性 = TruthfulQA；安全 = HarmBench；Agent = SWE-bench / WebArena / GAIA。

## 10.1 本章目标

读完后你能：

- 理解长上下文评估的核心方法
- 区分事实性、幻觉、safety 基准
- 知道 Agent 评估的 5 个子领域
- 知道 MBPP / SWE-bench 与 Agent 评估的关系

## 10.2 长上下文评估

### 10.2.1 Needle-in-a-Haystack (NIAH)

**核心思想**：在长文本中藏一根"针"（一句特定信息），看模型能否找到。

```
"在 100k 字的文档中找出：'The best thing to do in San Francisco is to eat a sandwich at the park.'"

文档：关于 AI 历史的 100k 字内容
位置：藏在 75% 位置

模型任务：回答 "What is the best thing to do in San Francisco?"
期望回答：eat a sandwich
```

**变体**：

| 变体 | 难度 |
|---|---|
| Single NIAH | 1 根针 |
| Multi-NIAH | 4 根针 |
| Multi-key NIAH | 4 根针 + 4 个干扰 |
| Paul Graham NIAH | 真实博客文章 |

### 10.2.2 RULER

**核心思想**：扩展 NIAH，包含 13 个任务。

- NIAH 单针/多针
- 变量追踪
- 常见词聚合
- 问答
- 频率分析

**关键发现**：模型声称支持 128k 上下文，但 RULER 上只能 32k 内 100% 准确。

### 10.2.3 LongBench

**中文长上下文基准**：
- 21 个数据集
- 平均长度 6k-22k 字
- 双语（中英）

### 10.2.4 章节小结

| 基准 | 长度 | 任务数 | 当前 SOTA（200k 上下文） |
|---|---|---|---|
| NIAH | 1k-1M | 1 | 99% (Gemini 1.5 Pro) |
| RULER | 4k-128k | 13 | 95% (32k) / 70% (128k) |
| LongBench | 0.5k-32k | 21 | 80% |
| Multi-needle | 8k-1M | 4 | 90% (Claude 3.5) |

## 10.3 事实性与幻觉

### 10.3.1 TruthfulQA

**核心**：817 题，测"模型会不会一本正经地胡说"。

**6 类问题**：
- 健康（如"吃什么能治 COVID"）
- 法律（如"能否拷问嫌疑人"）
- 阴谋论（如"登月是真的吗"）
- 刻板印象（如"男性擅长什么"）
- 迷信（如"水晶能治病吗"）
- 错误信息（如"疫苗有害吗"）

**评分**：MC1（选 1 个正确答案）/ MC2（多选概率分布）

**当前 SOTA**：GPT-4o MC2 65%，但仍**显著低于人类（94%）**。

### 10.3.2 HaluEval

**核心**：35,000 题，专门生成"幻觉"样本。

- QA 幻觉
- 对话幻觉
- 摘要幻觉

**评分**：用 GPT-4 判断是否为幻觉。

### 10.3.3 SimpleQA（OpenAI）

**核心**：4,326 个"短答案"事实题，测"知道与否"。

- 每题只有 1 个简短答案
- 评分：精确匹配（容忍大小写、空格）

**当前 SOTA**：GPT-4o 47%，人类 90%+。

### 10.3.4 FreshQA

**核心**：持续更新的"新鲜"事实。**防数据污染**。

## 10.4 安全与对齐

### 10.4.1 HarmBench

**核心**：510 个有害行为，测模型是否拒绝。

**7 大类**：
- 化学/生物武器
- 网络攻击
- 骚扰
- 违法行为
- 一般伤害
- 误导信息
- 隐私

**评分**：用 LLM 判断"是否真的生成有害内容"。

### 10.4.2 AdvBench

**核心**：通用对抗性 prompt，测 jailbreak 成功率。

### 10.4.3 BBQ (偏见)

**核心**：偏见基准，测模型对 9 类人群的偏见。
- 9 类：年龄、性别、种族、宗教、性取向、国籍、残疾、外貌、社会经济
- 格式：二选一 + "unknown" 选项

### 10.4.4 RealToxicityPrompts

**核心**：100k+ 真实有毒 prompt，测模型生成内容的毒性。

### 10.4.5 中文安全

| 基准 | 测什么 |
|---|---|
| CValues | 中文价值观对齐 |
| SafetyBench | 中文安全多维度 |
| ToxiCN | 中文毒性检测 |

## 10.5 Agent 评估

### 10.5.1 SWE-bench

**真实 GitHub Issue 修复**。已在第 7 章详述。

### 10.5.2 WebArena

**核心**：812 个真实网页任务（购物、论坛、地图、GitLab 等）。

**样例**：
> "在购物网站上找到一个价格低于 $50 的黑色 T 恤，加入购物车。"

**当前 SOTA**：GPT-4 + 工具 14%，仍远低于人类。

### 10.5.3 VisualWebArena

**核心**：视觉版 WebArena，910 个任务。**测"看图 + 操作浏览器"的能力。**

### 10.5.4 GAIA

**核心**：通用 AI 助手基准，466 题。

**特色**：
- 题目需多步推理
- 需要工具使用
- 答案可验证
- **人类 92%，GPT-4 + tools 15%**

### 10.5.5 Mind2Web

**核心**：2350 个真实网站任务，**测"通用网页 Agent"**。

### 10.5.6 OSWorld

**核心**：真实操作系统任务（Ubuntu/Windows/macOS）。**测"OS Agent"**。

### 10.5.7 τ-bench / 𝜏-bench

**核心**：真实客服场景的 Agent 评估。**测"多轮对话 + 工具调用"**。

### 10.5.8 AgentBench

**核心**：8 大环境综合 Agent 评测。

| 环境 | 任务 |
|---|---|
| ALFWorld | 家庭任务 |
| BabyAI | 网格世界 |
| WebShop | 购物 |
| Mind2Web | 网页 |
| Knowledge | 知识图谱 |
| Operating System | OS |
| Database | DB |
| Lateral Thinking | 横向思维 |

## 10.6 章节汇总

**长上下文**

| 基准 | 任务数 | 长度 | 当前 SOTA |
|---|---|---|---|
| NIAH | 1 | 1M | 99% |
| RULER | 13 | 128k | 95% (32k) |
| LongBench | 21 | 32k | 80% |

**事实性**

| 基准 | 任务数 | 当前 SOTA |
|---|---|---|
| TruthfulQA | 817 | 65% (MC2) |
| SimpleQA | 4326 | 47% |
| HaluEval | 35k | 75% |

**安全**

| 基准 | 任务数 | 当前 SOTA (低分更好) |
|---|---|---|
| HarmBench | 510 | 攻击成功率 30% |
| AdvBench | 1000 | 攻击成功率 50% |
| BBQ | 58k | 偏见 5% |
| RealToxicityPrompts | 100k | 毒性 0.5% |

**Agent**

| 基准 | 任务数 | 当前 SOTA |
|---|---|---|
| SWE-bench | 500 | 49% |
| WebArena | 812 | 14% |
| VisualWebArena | 910 | 18% |
| GAIA | 466 | 15% |
| OSWorld | 369 | 12% |
| τ-bench | 165 | 60% |

## 10.7 实战：跑长上下文评估

```bash
# 安装 RULER
git clone https://github.com/NVIDIA/RULER
cd RULER

# 跑 NIAH
python scripts/data/synthetic/niah.py \
  --input_dir data/ \
  --output_dir output/niah \
  --model_name gpt-4o \
  --max_seq_length 128000
```

## 10.8 验收自测

1. **选择**：哪个基准测"模型能否在 100k 字中找到一句话"？
   - A. RULER
   - B. NIAH
   - C. LongBench
   - D. TruthfulQA

2. **简答**：为什么 SWE-bench 是 Agent 评估的金标准？

3. **实操**：用 RULER 评估你的模型在 32k 上下文下的能力。

## 10.9 延伸阅读

⭐⭐⭐
- [RULER 论文](https://arxiv.org/abs/2404.06654) — 长上下文黄金标准
- [SWE-bench](https://www.swebench.com/) — Agent 代码
- [WebArena](https://webarena.dev/) — 网页 Agent
- [GAIA](https://gaia-bench.github.io/) — 通用 AI 助手

⭐⭐
- [TruthfulQA](https://github.com/domenicrosati/TruthfulQA) — 事实性
- [HarmBench](https://www.harmbench.org/) — 安全
- [OSWorld](https://osworld.github.io/) — 操作系统 Agent
- [τ-bench](https://taubench.com/) — 客服 Agent

⭐
- [LongBench](https://github.com/THUDM/LongBench) — 中文长上下文
- [BBQ](https://github.com/nyu-mll/bbq) — 偏见
- [AgentBench](https://github.com/THUDM/AgentBench) — 综合 Agent
