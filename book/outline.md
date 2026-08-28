# 《大模型评估入门：从前端工程师视角看 Eval》完整大纲

> **一句话**：让 1-3 年前端工程师看完这本书，能为任何 LLM 应用设计专业级评估方案，达到"专家级"理解。
>
> **总章数**：32 章（编号 00-31）/ 7 部分 / 约 25 万字
>
> **配套仓库**：[github.com/zenHeart/evals](https://github.com/zenHeart/evals)
>
> **在线阅读**：[evals.zenheart.site](https://evals.zenheart.site)

---

## 写在前面：如何使用本书

### 一句话定位

> **LLM 评估 ≈ 单元测试 + E2E 测试 + 性能监控 + A/B 实验。**

如果你是一个写 JavaScript/TypeScript 的工程师，本书要把你已经会的"测试金字塔"心智模型，迁移到"评估金字塔"上。读完本书，你能：

- 读懂厂商技术报告里的每一行评估数字
- 为你的 LLM 应用选对评测基准（避免被刷榜坑）
- 从零搭建自己的评估流水线（数据集 + 推理 + 评分 + 报告）
- 集成到 CI/CD 与灰度发布
- 区分"评估分数"和"真实业务价值"

### 三轮阅读法

| 轮次 | 目标 | 推荐章节 | 时长 |
| --- | --- | --- | --- |
| 第一轮 | 建立全景 | 0, 1, 2, 3, 4, 5 | 2 天 |
| 第二轮 | 框架与工程 | 13, 14, 15, 16, 17, 18 | 1 周 |
| 第三轮 | 自定义与实战 | 19, 20, 21, 22, 23, 24, 25, 26 | 1 周 |
| 速查手册 | 当参考 | 27, 28, 29, 30, 31 | 随时翻 |

### 四大核心能力线

```
[第 1 部分] 评估世界观（4 章）
[第 2 部分] 基准与数据集家族（8 章，含硬核新兴/垂直/持续更新）
[第 3 部分] 偏好与排行榜生态（3 章）
[第 4 部分] 评估工程实践（6 章）
[第 5 部分] 自定义评估设计（5 章）
[第 6 部分] 实战案例（3 章）
[第 7 部分] 资源与自测（3 章）
```

### 双形态发布

- **Web**：[evals.zenheart.site](https://evals.zenheart.site) — 搜索 + 链接 + 代码可复制
- **EPUB3**：[evals.zenheart.site/evals.epub](https://evals.zenheart.site/evals.epub) — Kindle/iBooks 可读
- 同一份 Markdown 源双形态输出

---

## 完整目录（32 章 / 7 部分）

### 第 0 部分：术语速查（建议先读）

| 章 | 标题 | 关键能力 |
|---|---|---|
| 0 | 核心术语速查（20 个） | LLM/Token/Prompt/Embedding/RAG/Agent/Tool Use/Judge/Benchmark/Metric/Pass@k/Elo/Context Window/RLHF/Retrieval 等 |

### 第 1 部分：评估的世界观（4 章）

| 章 | 标题 | 关键能力 |
|---|---|---|
| 1 | 什么是评估 | 4 步法、为什么评估、基准/指标/评分器、30 行 TS |
| 2 | 评估的 5W1H | 业务目标→能力→指标→测试集 |
| 3 | 标准评估流程 | 数据集→推理→评分→报告 |
| 4 | 核心原理 | Accuracy/F1/置信区间/人类一致性/Cohen's Kappa/ECE |

### 第 2 部分：基准与数据集家族图谱（8 章）

| 章 | 标题 | 关键能力 |
|---|---|---|
| 5 | 学科知识与综合推理 | MMLU/MMLU-Pro/CMMLU/C-Eval/AGIEval/HellaSwag/PIQA/ARC-AGI |
| 6 | 数学与逻辑 | GSM8K/MATH/AIME/FrontierMath/GPQA/MathVista |
| 7 | 代码能力 | HumanEval/MBPP/LiveCodeBench/SWE-bench/APPS/DS-1000/BFCL |
| 8 | 多模态 | MMMU/MMBench/ChartQA/DocVQA/POPE/HallusionBench |
| **9** | **硬核新兴评测** | **Terminal-Bench/SWE-Lancer/Cybench/KernelBench/MLE-bench/AppWorld** |
| 10 | 长上下文/事实/安全/Agent | NIAH/RULER/TruthfulQA/HarmBench/SWE-bench/WebArena/GAIA |
| **11** | **行业垂直评测** | **MedQA/PubMedQA/LegalBench/FinBen/FinEval/EcomInstruct** |
| **12** | **持续更新评测** | **LiveBench/SWE-bench Live/LiveCodeBench/FrontierMath** |

### 第 3 部分：偏好与排行榜生态（3 章）

| 章 | 标题 | 关键能力 |
|---|---|---|
| 13 | 人类偏好 + LLM-as-Judge | MT-Bench/Arena/AlpacaEval/Pairwise/Likert/Elo |
| 14 | 解读厂商技术报告 | 4 类必看基准/猫腻识别/DeepSeek 性价比 |
| 15 | 第三方排行榜 | LMSYS/Artificial/SEAL/OpenCompass/HF 5 个榜单对账 |

### 第 4 部分：评估工程实践（6 章）

| 章 | 标题 | 关键能力 |
|---|---|---|
| 16 | 评估框架全景图 | lm-eval/OpenCompass/RAGAS/DeepEval/Inspect AI/Garak |
| 17 | Node.js 30 行自建 | 缓存/重试/并发/分类报告/集成 CI |
| 18 | LLM-as-Judge 工程化 | 4 偏差缓解/CoT/Pairwise/Multi-judge |
| 19 | 人类评估设计 | 盲评/Elo/Bradley-Terry/评估员一致性 |
| 20 | RAG/Agent 评估 | RAGAS 4 指标/BFCL/SWE-bench/Phoenix/LangSmith |
| 21 | 红队与安全评估 | Garak/PyRIT/HarmBench/CyberSecEval |

### 第 5 部分：自定义评估设计（5 章）

| 章 | 标题 | 关键能力 |
|---|---|---|
| 22 | 我的应用需要评估什么 | 业务目标→能力→指标 4 步法 |
| 23 | 构建测试集 | 4 来源混合（公开 20% / 人工 30% / 回流 30% / 合成 20%）|
| 24 | CI/CD 流水线 | PR 5 分钟 / 每日 1 小时 / 发版全量 |
| 25 | 在线 A/B 实验 | 最小样本量/Wilcoxon/辛普森悖论/护栏指标 |
| 26 | 元评估 | 评估你的评估/4 方法/Cohen's Kappa/重做信号 |

### 第 6 部分：实战案例（3 章）

| 章 | 标题 | 关键能力 |
|---|---|---|
| 27 | 客服 RAG 评估 | 业务目标→RAGAS 4 指标→灰度发布 3 步→持续监控 |
| 28 | 代码 Agent 评估 | 3 层（自动/业务/人工）/用户接受率/编辑距离/SWE-bench |
| 29 | 多模态 App 评估 | OCR/公式/几何/解题/幻觉/多语言 |

### 第 7 部分：资源、附录与自测（2 章）

| 章 | 标题 | 关键能力 |
|---|---|---|
| 30 | 资源、术语表、Cheat Sheet | 80+ 基准/15 框架/13 指标/1 页速查卡 |
| 31 | 结课自测 + FAQ | 8 道场景自测题 + 20 个 FAQ + 6 月学习路径 |

---

## 章节 DAG 关系

```
                [第 0 章] 术语速查
                       ↓
[第 1 部分] 1 → 2 → 3 → 4
                  ↓
[第 2 部分] 5, 6, 7, 8（基础基准）
                  ↓
         9 (硬核) 10 (Agent/安全) 11 (垂直) 12 (持续)
                  ↓
[第 3 部分] 13 → 14 → 15
                  ↓
[第 4 部分] 16 → 17 → 18 → 19 → 20 → 21
                  ↓
[第 5 部分] 22 → 23 → 24 → 25 → 26
                  ↓
[第 6 部分] 27 → 28 → 29
                  ↓
[第 7 部分] 30 → 31
```

---

## 写作风格门禁

- 面向 1-3 年前端工程师（React/Vue/TypeScript）
- 每个新概念给"前端类比"
- 每个抽象给 5-30 行可运行 TypeScript 代码
- 数据集样例给原题原文（不改编）
- 厂商对比用表格
- 每章结尾 "⚠️ 5 个常见错误" + "📋 本章 Cheat Sheet"
- 类比本地化（高考、Git、Stack Overflow、V2EX、知乎、掘金、滴滴、美团、瑞幸等）

## 核心金句

1. "评估 = 单元测试 + E2E + 性能 + A/B"
2. "业务目标 → 能力 → 指标 → 测试集"
3. "评估必须集成到 CI/CD"
4. "LLM-as-Judge 4 偏差要缓解"
5. "与人类一致率 ≥ 80% 是元评估门槛"
6. "30 行代码跑通完整评估"
7. "4 来源测试集混合"
8. "5 个榜单对账选型"
9. "刷榜不是评估"
10. "没有 CI 的评估 = 不会被使用的评估"
