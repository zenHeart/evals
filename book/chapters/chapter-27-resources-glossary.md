# 27. 资源、术语表与 Cheat Sheet

> **如果只读一节**：本章节是"工具书"——遇到不懂的术语回来翻。**Cheat Sheet 是 1 页速查卡**，打印贴墙。

## 27.1 核心基准速查

### 学科 / 知识

| 基准 | 规模 | 测什么 | 关键链接 |
|---|---|---|---|
| MMLU | 14k | 57 学科 | [论文](https://arxiv.org/abs/2009.03300) |
| MMLU-Pro | 12k | MMLU 强化 | [论文](https://arxiv.org/abs/2406.01574) |
| CMMLU | 11.5k | 中文 67 学科 | [论文](https://arxiv.org/abs/2306.09212) |
| C-Eval | 14k | 中文 52 学科 | [GitHub](https://github.com/SJTU-LIT/ceval) |
| AGIEval | 8k | 真实考试 | [论文](https://arxiv.org/abs/2304.06364) |
| HellaSwag | 40k | 常识 | [论文](https://arxiv.org/abs/1905.07830) |
| PIQA | 18k | 物理常识 | [论文](https://arxiv.org/abs/1911.11641) |
| WinoGrande | 44k | 代词 | [论文](https://arxiv.org/abs/1907.10641) |
| ARC-AGI | 1k | 抽象推理 | [官网](https://arcprize.org/) |

### 数学 / 逻辑

| 基准 | 规模 | 测什么 | 关键链接 |
|---|---|---|---|
| GSM8K | 8.5k | 小学数学 | [论文](https://arxiv.org/abs/2110.14168) |
| MATH | 12.5k | 高中竞赛 | [论文](https://arxiv.org/abs/2103.03874) |
| MATH-500 | 500 | 精选 | OpenAI 出品 |
| AIME 2024 | 30 | 奥赛 | 真实题目 |
| FrontierMath | 300+ | 研究级 | [Epoch AI](https://epochai.org/frontiermath) |
| GPQA | 450 | 博士级 | [论文](https://arxiv.org/abs/2311.12022) |
| MathVista | 6k | 视觉+数学 | [论文](https://arxiv.org/abs/2310.08955) |

### 代码

| 基准 | 规模 | 测什么 | 关键链接 |
|---|---|---|---|
| HumanEval | 164 | Python 函数 | [论文](https://arxiv.org/abs/2107.03374) |
| MBPP | 974 | Python 入门 | [GitHub](https://github.com/google-research/mbpp) |
| LiveCodeBench | 500+ | 持续更新 | [官网](https://livecodebench.github.io/) |
| SWE-bench | 500 | 真实 Issue | [官网](https://www.swebench.com/) |
| APPS | 10k | 编程竞赛 | [论文](https://arxiv.org/abs/2105.09938) |
| BigCodeBench | 1140 | 库调用 | [官网](https://bigcode-bench.github.io/) |
| DS-1000 | 1k | 数据科学 | [官网](https://ds1000-code-llm.github.io/) |
| Spider | 10k | Text-to-SQL | [官网](https://yale-lily.github.io/spider) |
| BIRD | 12.7k | Text-to-SQL | [官网](https://bird-bench.github.io/) |
| BFCL | 2k+ | 函数调用 | [官网](https://gorilla.cs.berkeley.edu/leaderboard.html) |

### 多模态

| 基准 | 规模 | 测什么 | 关键链接 |
|---|---|---|---|
| MMMU | 11.5k | 多学科 | [论文](https://arxiv.org/abs/2311.16502) |
| MMBench | 3k | 综合视觉 | [论文](https://arxiv.org/abs/2307.06281) |
| ChartQA | 9.6k | 图表 | [论文](https://arxiv.org/abs/2203.10244) |
| DocVQA | 10k | 文档 | [论文](https://arxiv.org/abs/2007.00398) |
| AI2D | 5k | 示意图 | [GitHub](https://github.com/allenai/ai2d) |
| OCRBench | 1k | OCR | [GitHub](https://github.com/Yuliang-Liu/MultimodalOCR) |
| POPE | 9k | 视觉幻觉 | [论文](https://arxiv.org/abs/2305.10355) |
| HallusionBench | 460 | 复杂幻觉 | [GitHub](https://github.com/open-compass/HallusionBench) |

### 长上下文

| 基准 | 长度 | 测什么 | 关键链接 |
|---|---|---|---|
| NIAH | 1k-1M | 单针检索 | 通用 |
| RULER | 4k-128k | 多任务长上下文 | [论文](https://arxiv.org/abs/2404.06654) |
| LongBench | 0.5k-32k | 中文长上下文 | [GitHub](https://github.com/THUDM/LongBench) |
| Multi-needle | 8k-1M | 多针 | 通用 |

### 事实性 / 幻觉

| 基准 | 规模 | 测什么 | 关键链接 |
|---|---|---|---|
| TruthfulQA | 817 | 真实性 | [论文](https://arxiv.org/abs/2109.07958) |
| HaluEval | 35k | 幻觉 | [GitHub](https://github.com/pminervini/HaluEval) |
| SimpleQA | 4326 | 短答案事实 | OpenAI |
| FreshQA | - | 时效性 | 持续更新 |

### 安全

| 基准 | 规模 | 测什么 | 关键链接 |
|---|---|---|---|
| HarmBench | 510 | 有害行为 | [论文](https://arxiv.org/abs/2402.04249) |
| AdvBench | 1000 | 对抗 prompt | [论文](https://arxiv.org/abs/2307.15043) |
| BBQ | 58k | 偏见 | [论文](https://arxiv.org/abs/2110.08193) |
| RealToxicityPrompts | 100k | 毒性 | [论文](https://arxiv.org/abs/2009.11462) |
| SafetyBench | - | 中文安全 | [GitHub](https://github.com/THUDM/SafetyBench) |

### Agent

| 基准 | 任务 | 测什么 | 关键链接 |
|---|---|---|---|
| SWE-bench | 500 | 代码 Agent | [官网](https://www.swebench.com/) |
| WebArena | 812 | 网页 Agent | [官网](https://webarena.dev/) |
| VisualWebArena | 910 | 视觉网页 | [官网](https://viswebarena.github.io/) |
| GAIA | 466 | 通用助手 | [官网](https://gaia-bench.github.io/) |
| OSWorld | 369 | OS Agent | [官网](https://osworld.github.io/) |
| τ-bench | 165 | 客服 | [官网](https://taubench.com/) |
| AgentBench | 8 环境 | 综合 | [GitHub](https://github.com/THUDM/AgentBench) |

### 偏好 / 排行榜

| 基准 | 风格 | 题目 | 关键链接 |
|---|---|---|---|
| MT-Bench | LLM Judge | 80 | [GitHub](https://github.com/lm-sys/FastChat) |
| Chatbot Arena | 人类投票 | 无限 | [官网](https://lmarena.ai/) |
| AlpacaEval | LLM Judge | 805 | [官网](https://tatsu-lab.github.io/alpaca_eval/) |
| HF Open LLM v2 | 6 基准 | ~6k | [官网](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) |
| Artificial Analysis | 综合 | - | [官网](https://artificialanalysis.ai/) |
| SEAL | 专家 | 5000+ | [官网](https://scale.com/leaderboard) |
| OpenCompass | 综合 | 100+ | [官网](https://opencompass.org.cn/) |

## 27.2 框架速查

| 框架 | 类别 | 安装 | 关键命令 |
|---|---|---|---|
| lm-eval-harness | 学术综合 | `pip install lm-eval` | `lm_eval --model hf --tasks mmlu` |
| OpenCompass | 中文综合 | `pip install opencompass` | `opencompass --datasets cmmlu` |
| HELM | 多指标 | helm | `helm-run` |
| LightEval | 轻量 | `pip install lighteval` | `lighteval --tasks mmlu` |
| Inspect AI | Agent | `pip install inspect-ai` | `inspect eval mmlu` |
| RAGAS | RAG | `pip install ragas` | `ragas.evaluate()` |
| DeepEval | 应用 | `pip install deepeval` | `pytest tests/` |
| TruLens | 追踪+评估 | `pip install trulens` | `tru.run_dashboard()` |
| Phoenix | 可观测 | `pip install phoenix` | `phoenix serve` |
| LangSmith | LangChain | web | web UI |
| SWE-bench | 代码 Agent | git | `swebench.harness` |
| VLMEvalKit | 多模态 | `pip install vlmeval` | `python run.py` |
| Garak | 红队 | `pip install garak` | `garak --model_type openai` |
| PyRIT | 红队 | `pip install pyrit` | `python attack.py` |
| Promptfoo | Prompt | `npm install -g promptfoo` | `promptfoo eval` |

## 27.3 关键指标速查

| 指标 | 公式 | 适用 |
|---|---|---|
| Accuracy | (TP+TN) / Total | 平衡数据 |
| Precision | TP / (TP+FP) | 减少误报 |
| Recall | TP / (TP+FN) | 减少漏报 |
| F1 | 2*P*R/(P+R) | 综合 P 和 R |
| pass@k | 1 - C(n-c,k)/C(n,k) | 代码 |
| BLEU | n-gram 重叠 | 翻译/摘要 |
| ROUGE | 召回型 n-gram | 摘要 |
| BERTScore | 语义相似度 | 通用 |
| Cohen's Kappa | 人类一致性 | 元评估 |
| ECE | 校准误差 | 概率输出 |
| Elo | 对战分数 | 偏好 |
| Wilson CI | 二项置信区间 | 准确率 |

## 27.4 关键概念速查

| 概念 | 定义 |
|---|---|
| Benchmark | 一组评估任务的集合 |
| Metric | 打分规则 |
| Judge | 实际执行评分的程序/模型 |
| LLM-as-Judge | 用 LLM 当 judge |
| Pairwise | 两两比较 |
| Likert | 1-N 分评分 |
| Bradley-Terry | 偏好建模 |
| Elo | 相对排名分数 |
| Cohen's Kappa | 人类一致性指标 |
| F1 | Precision × Recall 调和 |
| pass@k | k 次内通过率 |
| Bootstrap | 重采样估计 |
| Contamination | 数据污染 |
| Hold-out | 保留测试集 |
| Canary | 污染检测 token |
| Red Team | 主动找漏洞 |
| Jailbreak | 绕过安全限制 |
| Prompt Injection | 注入恶意指令 |
| Faithfulness | 答案忠于上下文 |
| Hallucination | 编造内容 |
| Calibration | 概率与准确性匹配 |

## 27.5 LLM 厂商 API 速查

| 厂商 | 模型 | API | 备注 |
|---|---|---|---|
| OpenAI | gpt-4o, gpt-4o-mini | api.openai.com | 最贵，质量高 |
| Anthropic | claude-3-5-sonnet | api.anthropic.com | 代码最强 |
| Google | gemini-1.5-pro | ai.google.dev | 长上下文 |
| DeepSeek | deepseek-v3 | api.deepseek.com | 性价比 |
| Qwen | qwen2.5-72b | dashscope.aliyun.com | 中文强 |
| 智谱 | glm-4-plus | open.bigmodel.cn | 国产 |
| Mistral | mistral-large | api.mistral.ai | 欧洲 |
| Meta | llama-3.1-405b | 自部署 | 开源 |
| Cohere | command-r-plus | api.cohere.com | 企业 |
| Ollama | 本地 | ollama.ai | 自部署 |

## 27.6 必读论文清单

### L0 必读（5 篇）

1. [MMLU 论文 (Hendrycks et al. 2021)](https://arxiv.org/abs/2009.03300)
2. [HumanEval 论文 (Chen et al. 2021)](https://arxiv.org/abs/2107.03374)
3. [GSM8K 论文 (Cobbe et al. 2021)](https://arxiv.org/abs/2110.14168)
4. [Judging LLM-as-a-Judge (Zheng et al. 2023)](https://arxiv.org/abs/2306.05685)
5. [HELM (Liang et al. 2022)](https://arxiv.org/abs/2211.09110)

### L1 推荐（10 篇）

- TruthfulQA
- HellaSwag
- LiveCodeBench
- SWE-bench
- MMMU
- RULER
- FrontierMath
- RAGAS
- Garak (红队)
- DeepEval

### L2 进阶（按需）

- 各基准原始论文
- 厂商技术报告（GPT-4o、Claude 3.5、Gemini 1.5、DeepSeek-V3）

## 27.7 必看博客

- [Designing ML Evaluation Systems (Chip Huyen)](https://huyenchip.com/2023/05/15/designing-ml-evaluation-systems.html) — 必读长文
- [How to Read a LLM Paper (Sebastian Raschka)](https://magazine.sebastianraschka.com/p/llm-research-papers-2024) — 论文阅读
- [Anthropic Engineering Blog](https://www.anthropic.com/engineering)
- [OpenAI Engineering Blog](https://openai.com/blog/engineering/)
- [Chip Huyen's Blog](https://huyenchip.com/blog/)

## 27.8 必用工具

| 工具 | 用途 |
|---|---|
| Hugging Face Datasets | 数据集 |
| Hugging Face Spaces | 在线 demo |
| LM Studio | 本地 LLM |
| Ollama | 本地 LLM |
| Label Studio | 标注 |
| Weights & Biases | 实验追踪 |
| Promptfoo | Prompt 评估 |
| Phoenix | 可观测 |
| LangSmith | LangChain 调试 |
| DeepEval | 应用测试 |

## 27.9 数据集下载源

| 平台 | 链接 |
|---|---|
| Hugging Face Datasets | https://huggingface.co/datasets |
| Papers with Code | https://paperswithcode.com/datasets |
| GitHub Topic | github.com/topics/benchmark-dataset |
| 学术平台 | arXiv.org |

## 27.10 1 页 Cheat Sheet（速查卡）

```
┌────────────────────────────────────────────┐
│ 评估速查卡 - evals.zenheart.site          │
├────────────────────────────────────────────┤
│ 4 步评估法：                              │
│ 1. 数据集  2. 模型  3. 评分  4. 报告     │
│                                            │
│ 5W1H：Why/What/Who/When/Where/How         │
│                                            │
│ 必看 4 类基准：                            │
│ - 学科：MMLU + MMLU-Pro                  │
│ - 推理：GPQA Diamond                      │
│ - 偏好：Arena Elo                         │
│ - 代码：HumanEval + SWE-bench            │
│                                            │
│ LLM-as-Judge 4 偏差：                     │
│ - 位置 / 长度 / 自偏好 / 格式            │
│                                            │
│ 评估时机：                                │
│ - PR 5 分钟 / 每日 1 小时 / 发版全量     │
│                                            │
│ 4 来源测试集：                            │
│ - 公开 20% + 人工 30% + 回流 30% + 合成 20%│
│                                            │
│ 核心指标：                                │
│ Accuracy / F1 / pass@k / Elo / Cohen's κ │
│                                            │
│ 5 选型对账：                              │
│ Arena / Artificial / SEAL / OpenCompass / HF│
│                                            │
│ 红队工具：Garak + PyRIT                  │
│                                            │
│ 元评估：与人类一致率 ≥ 80%              │
│                                            │
│ 黄金公式：                                │
│ 业务 → 能力 → 指标 → 测试集              │
└────────────────────────────────────────────┘
```

## 27.11 章节小结

- 80+ 基准速查
- 15 个框架速查
- 13 个核心指标公式
- 24 个关键概念
- 10 个 LLM 厂商 API
- 5 + 10 + N 篇论文推荐

## 27.12 验收自测

1. **选择**：下面哪个基准测"博士级科学推理"？
   - A. MMLU
   - B. GPQA
   - C. TruthfulQA
   - D. HellaSwag

2. **简答**：为什么要交叉看 4-5 个榜单选型？

3. **实操**：从本章 80+ 基准中选 3 个，跑你模型的评估。

## 27.13 延伸阅读

⭐⭐⭐
- [Awesome LLM Evaluation (GitHub)](https://github.com/MLGroupJ/awesome-llm-evaluation)
- [Holistic Evaluation of Language Models (HELM)](https://crfm.stanford.edu/helm/latest/)

⭐⭐
- [Evaluating LLMs: A Complete Guide (Confident AI)](https://www.confident-ai.com/blog/llm-evaluation-guide)
- [LLM Evaluation Frameworks Comparison](https://www.vellum.ai/blog/llm-evaluation-framework)

⭐
- [LMSYS Blog](https://lmarena.ai/blog)
- [Anthropic: Constitutional AI](https://www.anthropic.com/news/constitutional-ai-harmlessness-from-ai-feedback)
