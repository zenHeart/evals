# 16. 评估框架全景图：选对你的工具

> **如果只读一节**：学术用 lm-eval-harness，中文用 OpenCompass，应用层用 RAGAS/DeepEval，Agent 用 Inspect AI，红队用 Garak。**没特别需求时，先用 lm-eval-harness。**

## 16.1 本章目标

读完后你能：

- 知道 8 个主流评估框架的定位
- 知道"综合性" vs "RAG/Agent" vs "安全"框架的差异
- 选对你场景的工具
- 安装并跑通一个 lm-eval-harness 任务

## 16.2 框架分类法

按用途分 5 类：

| 类别 | 测什么 | 代表 |
|---|---|---|
| **学术综合** | 学术基准全集 | lm-eval-harness、OpenCompass、HELM、LightEval |
| **多模态** | 视觉/音频 | VLMEvalKit、LMMs-Eval |
| **RAG/应用层** | RAG/Agent/对话 | RAGAS、DeepEval、TruLens、Phoenix |
| **代码/SWE** | 真实工程 | SWE-bench、LiveCodeBench |
| **安全/红队** | 攻击防御 | Garak、PyRIT、DeepTeam |

## 16.3 lm-eval-harness（EleutherAI）

**一句话**

> 学术评估的**事实标准**。**200+ 任务**，覆盖几乎所有公开基准。

**安装**

```bash
pip install lm-eval
```

**最小可运行示例**

```bash
# 跑 MMLU（5-shot）
lm_eval --model hf \
    --model_args pretrained=Qwen/Qwen2.5-7B-Instruct \
    --tasks mmlu \
    --num_fewshot 5 \
    --batch_size 8 \
    --output_path ./results

# 跑 SWE-bench
lm_eval --model openai-completions \
    --model_args model=gpt-4o \
    --tasks swe_bench_verified \
    --output_path ./results
```

**关键特性**

- 支持 200+ 任务
- HuggingFace、OpenAI、Anthropic、自定义模型
- 完整文档
- 社区活跃

**当前版本**

- v0.4.x（2026）

## 16.4 OpenCompass（书生·浦语）

**一句话**

> 上海 AI Lab 出品，**中文评估**最强。覆盖 100+ 数据集 + 50+ 模型。

**安装**

```bash
pip install opencompass
```

**跑中文评估**

```bash
opencompass --models hf_qwen2_5_7b_instruct --datasets cmmlu ceval
```

**特色**

- **中文领先**：CMMLU、C-Eval、CLUE 等
- 模型支持广泛
- 自带可视化

## 16.5 HELM（Stanford CRFM）

**一句话**

> Stanford 的**多指标综合评估**。同时测准确性、稳健性、公平性、偏见、效率等。

**特点**

- **多维度**而非单分
- 强调透明度
- 包含 toxicity、bias、robustness

**当前状况**

- HELM Lite：精简版
- HELM v1.0：完整版

## 16.6 LightEval（Hugging Face）

**一句话**

> HuggingFace 出品的现代轻量评估框架，**支持最新的多模态模型**。

**优势**

- 与 Transformers 深度集成
- 速度快
- 多 GPU 友好

## 16.7 Inspect AI（UK AISI）

**一句话**

> 英国 AI Safety Institute 出品，**Agent 评估的最强框架**。

**特点**

- Python-first
- Agent task 友好
- 可视化好
- 内置 SWE-bench、GAIA、MMLU

**安装**

```bash
pip install inspect-ai
```

## 16.8 RAGAS

**一句话**

> RAG 评估的事实标准。**4 大核心指标**。

**4 大指标**

| 指标 | 测什么 |
|---|---|
| Faithfulness | 答案是否忠于检索内容 |
| Answer Relevancy | 答案是否切题 |
| Context Precision | 检索内容是否精准 |
| Context Recall | 检索是否召回所有相关信息 |

**最小示例**

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy
from datasets import Dataset

dataset = Dataset.from_dict({
    "question": ["什么是 RAG？"],
    "answer": ["RAG 是检索增强生成..."],
    "contexts": [["RAG 是..."]],
    "ground_truth": ["RAG 是一种结合检索和生成的方法..."]
})

result = evaluate(dataset, metrics=[faithfulness, answer_relevancy])
print(result)
```

## 16.9 DeepEval

**一句话**

> LLM 评估的"Pytest"。**测试驱动 LLM 应用**。

**特点**

- Pytest 风格
- 20+ 内置指标
- 与 CI 集成友好

**指标**

- G-Eval（自定义）
- Hallucination
- Bias
- Toxicity
- Answer Relevancy
- 等

## 16.10 TruLens

**一句话**

> 评估 + 可观测性。**追踪 + 评分**。

**特点**

- 实时追踪
- 反馈函数
- 与 LangChain 集成

## 16.11 Phoenix（Arize）

**一句话**

> 开源 LLM 可观测 + 评估。**生产环境监控**。

**特点**

- 实时监控
- Drift detection
- 嵌入可视化
- 与多种 LLM 框架集成

## 16.12 LangSmith

**一句话**

> LangChain 官方的评估 + 调试平台。**LangChain 应用最佳搭档**。

**特点**

- 追踪 + 评估
- 数据集管理
- 在线评估
- 收费（但基础版免费）

## 16.13 SWE-bench 评估框架

**仓库**

[swebench.com](https://www.swebench.com/) 提供官方评估脚本

```bash
# 跑 SWE-bench Verified
python -m swebench.harness.run_evaluation \
    --dataset_name princeton-nlp/SWE-bench_Verified \
    --predictions_path ./model_patch.jsonl
```

## 16.14 VLMEvalKit

**一句话**

> **多模态评估**的事实标准。**80+ 多模态基准，100+ 模型**。

**安装**

```bash
git clone https://github.com/open-compass/VLMEvalKit
cd VLMEvalKit
pip install -e .
```

**跑 MMMU**

```bash
python run.py --model Qwen2.5-VL-72B --data MMMU_DEV_VAL
```

## 16.15 Garak（NVIDIA）

**一句话**

> **红队扫描**。**自动探测 LLM 漏洞**。

**攻击类别**

- Prompt injection
- Jailbreak
- Data leak
- Hallucination
- Toxicity
- Misinformation

**跑扫描**

```bash
pip install garak
garak --model_type openai --model_name gpt-4o
```

## 16.16 PyRIT（Microsoft）

**一句话**

> Microsoft 的**AI 红队框架**。**Python + 策略驱动**。

**特点**

- 多种攻击策略
- 转换器（transformer）
- 评分器
- 与 Azure AI 集成

## 16.17 Promptfoo

**一句话**

> **Prompt 红队 + A/B 评估**。**YAML 驱动的 LLM 评估**。

**最小示例**

```yaml
# promptfooconfig.yaml
prompts:
  - "Translate to French: {{text}}"

providers:
  - openai:gpt-4o
  - anthropic:claude-3-5-sonnet

tests:
  - vars:
      text: "Hello, world"
    assert:
      - type: contains
        value: "Bonjour"
```

```bash
npx promptfoo eval
```

## 16.18 框架选型决策树

```
你要评估什么？
├─ 学术基准（MMLU、GSM8K）→ lm-eval-harness
├─ 中文评估 → OpenCompass
├─ 多模态 → VLMEvalKit
├─ RAG 应用 → RAGAS
├─ LLM 应用测试 → DeepEval
├─ LangChain 应用 → LangSmith
├─ Agent 任务 → Inspect AI
├─ 真实软件工程 → SWE-bench
├─ 红队/安全 → Garak + PyRIT
├─ Prompt A/B → Promptfoo
├─ 生产监控 → Phoenix
└─ 自定义评测 → 自己写（参考第 14 章）
```

## 16.19 章节汇总

| 框架 | 类别 | 安装 | 关键命令 |
|---|---|---|---|
| lm-eval-harness | 学术综合 | pip | `lm_eval --model hf --tasks mmlu` |
| OpenCompass | 中文综合 | pip | `opencompass --datasets cmmlu` |
| HELM | 多指标 | helm | `helm-run --run-spec ...` |
| LightEval | 轻量 | pip | `lighteval --tasks mmlu` |
| Inspect AI | Agent | pip | `inspect eval mmlu` |
| RAGAS | RAG | pip | `ragas.evaluate()` |
| DeepEval | 应用 | pip | `pytest tests/` |
| TruLens | 追踪+评估 | pip | `trulens-eval` |
| Phoenix | 可观测性 | pip + docker | `phoenix serve` |
| LangSmith | LangChain | API key | web UI |
| SWE-bench | 代码 Agent | pip | `swebench.harness` |
| VLMEvalKit | 多模态 | pip + git | `python run.py` |
| Garak | 红队 | pip | `garak --model_type openai` |
| PyRIT | 红队 | pip | `python attack.py` |
| Promptfoo | Prompt | npm | `npx promptfoo eval` |

## 16.20 实战：3 个框架跑通

**1. lm-eval-harness**

```bash
pip install lm-eval
lm_eval --model openai-completions --model_args model=gpt-4o-mini --tasks mmlu --num_fewshot 5 --limit 100
# 输出：{'mmlu': 0.85}
```

**2. RAGAS**

```bash
pip install ragas
python -c "from ragas import evaluate; print('OK')"
```

**3. Promptfoo**

```bash
npm install -g promptfoo
promptfoo init
promptfoo eval
```

## 16.21 验收自测

1. **选择**：评估 RAG 系统最该用？
   - A. lm-eval-harness
   - B. RAGAS
   - C. Garak
   - D. HELM

2. **简答**：为什么 lm-eval-harness 仍是学术评估的事实标准？

3. **实操**：用 lm-eval-harness 跑 100 道 MMLU（GPT-4o-mini）。

## 16.22 延伸阅读

⭐⭐⭐
- [lm-eval-harness 文档](https://github.com/EleutherAI/lm-evaluation-harness)
- [OpenCompass 文档](https://github.com/open-compass/opencompass)
- [RAGAS 文档](https://docs.ragas.io/)

⭐⭐
- [DeepEval 文档](https://docs.confident-ai.com/)
- [Inspect AI](https://github.com/UKGovernmentBEIS/inspect_ai)
- [VLMEvalKit](https://github.com/open-compass/VLMEvalKit)

⭐
- [TruLens](https://www.trulens.org/)
- [Phoenix](https://phoenix.arize.com/)
- [Garak](https://github.com/NVIDIA/garak)
- [Promptfoo](https://promptfoo.dev/)
