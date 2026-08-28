# 12. 第三方排行榜与基准交叉验证

> **如果只读一节**：不要只看一个榜单。综合看：LMSYS Arena（真实人类）+ Hugging Face Open LLM（开源）+ Artificial Analysis（成本+速度）+ SEAL（专家）。

## 12.1 本章目标

读完后你能：

- 知道 5 个主流第三方榜单
- 知道"对账"是怎么回事
- 知道 SEAL 排行榜的特色
- 知道如何交叉验证

## 12.2 主流第三方榜单

| 榜单 | 主办 | 特色 | 更新频率 |
|---|---|---|---|
| LMSYS Chatbot Arena | UC Berkeley | 真实人类盲评 | 实时 |
| Open LLM Leaderboard | Hugging Face | 开源模型 | 每周 |
| Artificial Analysis | AA | 速度+成本+质量综合 | 每周 |
| SEAL Leaderboard | Scale AI | 专家评估 | 月度 |
| OpenCompass CompassRank | 上海AI Lab | 中文为主 | 月度 |

## 12.3 LMSYS Chatbot Arena（详）

### 关键数据

- 投票数：> 2,000,000
- 涵盖模型：> 200
- 风格：盲评 + Bradley-Terry / Elo

### 类别排行榜

Arena 不仅有总榜，还按类别：

| 类别 | 第一名（2026） |
|---|---|
| Overall | GPT-4o |
| Coding | Claude 3.5 Sonnet |
| Math | DeepSeek-R1 |
| Chinese | Qwen2.5-72B |
| Hard Prompts | Claude 3.5 Sonnet |
| Creative Writing | GPT-4o |
| Extraction | GPT-4o |
| Multi-turn | Claude 3.5 Sonnet |

## 12.4 Hugging Face Open LLM Leaderboard v1/v2

### v1（已停止更新）

- 6 基准：MMLU、ARC、HellaSwag、TruthfulQA、Winogrande、GSM8K
- 已被刷到 90%+
- **2024 年停止更新**

### v2（IFBench + 新基准）

- 6 基准更新为：IFEval、BBH、MATH、GPQA、MUSR、MMLU-Pro
- 减少数据污染
- 2024 年 6 月推出

### 当前 SOTA（v2）

| 模型 | 总体 |
|---|---|
| Llama 3.1-405B | 80.0% |
| Qwen2.5-72B | 78.5% |
| DeepSeek-V3 | 79.0% |
| Mistral-Large-2 | 76.0% |

## 12.5 Artificial Analysis

### 特色

> 不只比"质量"，还比 **速度 + 成本**。

### 综合指标

每个模型给一个综合分，考虑：
- 质量（MMLU + Arena Elo）
- 速度（tokens/second）
- 成本（$ per 1M tokens）
- 延迟（首 token 时间）

### 性价比榜（2026）

| 模型 | 综合分 | $/1M |
|---|---|---|
| DeepSeek-V3 | 95 | 0.27 |
| Qwen2.5-72B | 88 | 0.40 |
| GPT-4o | 92 | 2.50 |
| Claude 3.5 Sonnet | 90 | 3.00 |
| Llama 3.1-405B | 80 | 2.70 |

**DeepSeek-V3 性价比远超其他**。

## 12.6 SEAL Leaderboard

### 一句话

> Scale AI 出的**专家级评估**。每个模型由领域专家测试。

### 特色

- **专家评估**（不是众包）
- 测试模型在 **真实企业任务** 上的表现
- 包含：法律、医疗、金融、客服、代码 5 大类

### 当前排名（2026）

| 排名 | 模型 | SEAL 分 |
|---|---|---|
| 1 | Claude 3.5 Sonnet | 78.2 |
| 2 | GPT-4o | 75.8 |
| 3 | Gemini 1.5 Pro | 71.5 |
| 4 | DeepSeek-V3 | 70.0 |
| 5 | Qwen2.5-72B | 68.5 |

**Claude 3.5 Sonnet 在专家评估中领先**，但 Arena 总榜输给 GPT-4o。

## 12.7 OpenCompass CompassRank

### 特色

- 中文为主
- 覆盖 100+ 模型
- 多个维度：学科、语言、推理、Agent、安全

### 当前 SOTA（中文）

| 模型 | 总分 |
|---|---|
| Qwen2.5-72B | 78 |
| DeepSeek-V3 | 77 |
| GLM-4-Plus | 72 |
| 文心 4.0 | 70 |
| 豆包 | 67 |

## 12.8 基准交叉验证（对账）

### 为什么需要对账

**单榜单的偏差**：

- Arena：偏英文、偏对话
- HF：偏学术、偏开源
- SEAL：偏企业、偏专家
- OpenCompass：偏中文

**结论**：单一榜单不能代表"真实能力"。

### 实战交叉验证流程

```
1. 选 3-5 个不同榜单
2. 看每个模型在每个榜单的排名
3. 看"全榜都有"和"只在某榜强"的模型
4. 全榜都强 = 真强
5. 只在单榜强 = 单点优化
```

### 实操：交叉验证 GPT-4o

| 榜单 | GPT-4o 排名 | 解读 |
|---|---|---|
| Arena Overall | #1 | 真实用户最强 |
| HF Open LLM v2 | 闭源不参与 | / |
| Artificial Analysis | #1 综合 | 速度+质量综合最强 |
| SEAL | #2 | 专家级略输 Claude |
| OpenCompass | 闭源不参与 | / |

**GPT-4o 在 3/3 可比榜单都 #1 或 #2，确为顶级模型。**

### 实操：交叉验证 DeepSeek-V3

| 榜单 | DeepSeek-V3 排名 | 解读 |
|---|---|---|
| Arena Overall | #4 | 用户偏好略低 |
| HF Open LLM v2 | 闭源不参与 | / |
| Artificial Analysis | #1 性价比 | 速度+成本冠军 |
| SEAL | #4 | 专家评估中等 |
| OpenCompass | #2 | 中文能力强 |

**DeepSeek-V3 在"性价比"和"中文"榜强，"专家评估"略弱。**

## 12.9 排行榜刷榜问题

### 真实案例

- 某模型 MMLU 刷到 90%+ → 后来被测出训练数据里包含 MMLU
- 某厂商报告 Arena Elo 第一 → 后来发现是定向优化了 Arena 的 5 类 prompt
- 某模型 HumanEval 第一 → 实际是用了特殊 prompt

### 识别刷榜的 3 个信号

1. **同一基准某模型突然涨 5+ 分** → 查训练数据声明
2. **厂商未公开 prompt 模板** → 警惕
3. **单榜单独占前 3 但跨榜单不一致** → 数据集不真实

## 12.10 如何用对账结果指导选型

### 决策矩阵

| 你的场景 | 看哪个榜单 |
|---|---|
| 英文客服 | Arena (对话) + HumanEval (代码工具) |
| 中文应用 | OpenCompass + Arena (Chinese) |
| 成本敏感 | Artificial Analysis |
| 企业级（法律/医疗） | SEAL + 自家 hold-out |
| 代码 Agent | SWE-bench + LiveCodeBench |

## 12.11 实战：自己做一份"对账报告"

```markdown
# 选型对账报告

## 候选模型
- GPT-4o
- Claude 3.5 Sonnet
- Gemini 1.5 Pro
- DeepSeek-V3
- Qwen2.5-72B

## 各榜单排名
| 榜单 | GPT-4o | Claude 3.5 | Gemini 1.5 | DeepSeek-V3 | Qwen2.5 |
|---|---|---|---|---|---|
| Arena | #1 | #2 | #3 | #4 | #5 |
| Artificial | #1 | #2 | #3 | #1 性价比 | #4 |
| SEAL | #2 | #1 | #3 | #4 | #5 |
| OpenCompass | 闭源 | 闭源 | 闭源 | #2 | #1 |

## 交叉验证结论
- 英文对话/偏好：GPT-4o
- 专家级任务：Claude 3.5 Sonnet
- 中文应用：Qwen2.5-72B
- 性价比：DeepSeek-V3
- 综合最强：GPT-4o（成本不敏感时）

## 推荐
- 主用：GPT-4o
- 备选：Claude 3.5 Sonnet
- 中文场景：Qwen2.5-72B
- 降本场景：DeepSeek-V3
```

## 12.12 验收自测

1. **选择**：哪个榜单最真实反映用户偏好？
   - A. Hugging Face Open LLM
   - B. LMSYS Chatbot Arena
   - C. SEAL
   - D. Artificial Analysis

2. **简答**：为什么单一榜单不足以选型？

3. **实操**：用 4 个榜单（lmarena、Artificial、SEAL、OpenCompass）做一份你关心场景的选型对账报告。

## 12.13 延伸阅读

⭐⭐⭐
- [LMSYS Chatbot Arena](https://lmarena.ai/) — 真实人类
- [Artificial Analysis](https://artificialanalysis.ai/) — 速度+成本+质量
- [SEAL Leaderboard](https://scale.com/leaderboard) — 专家评估
- [OpenCompass](https://opencompass.org.cn/) — 中文榜单
- [HF Open LLM Leaderboard v2](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) — 开源模型

⭐⭐
- [Berkeley Function Calling Leaderboard (BFCL)](https://gorilla.cs.berkeley.edu/leaderboard.html) — 函数调用
- [LiveCodeBench](https://livecodebench.github.io/) — 代码
- [SWE-bench Leaderboard](https://www.swebench.com/) — 代码 Agent

⭐
- [AlpacaEval](https://tatsu-lab.github.io/alpaca_eval/) — 自动化 Arena
- [OpenRouter Rankings](https://openrouter.ai/rankings) — 实际 API 使用
- [vLLM Production Stats](https://blog.vllm.ai/) — 生产性能
