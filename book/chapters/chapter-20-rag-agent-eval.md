# 20. RAG / Agent / 应用层评估

> **如果只读一节**：RAG 评估 = RAGAS（4 大指标）。Agent 评估 = 任务完成率 + 工具调用准确率。生产监控 = Phoenix / LangSmith。

## 20.1 本章目标

读完后你能：

- 用 RAGAS 评估 RAG 系统
- 评估 Agent 的工具调用和多步推理
- 知道生产环境监控的关键指标
- 选对应用层评估工具

## 20.2 RAG 评估的 4 大维度

**维度 1：检索质量**

**指标**：
- **Context Precision**：检索的内容里"有用"的比例
- **Context Recall**：所有相关信息是否都检索到了
- **MRR** (Mean Reciprocal Rank)：第一个相关结果的排名
- **NDCG**：归一化折损累积增益

**维度 2：生成质量**

**指标**：
- **Faithfulness**：答案是否忠于检索内容（不幻觉）
- **Answer Relevancy**：答案是否切题
- **Answer Correctness**：答案是否正确（vs 参考）

**维度 3：端到端**

**指标**：
- **Answer similarity**：与参考答案的相似度
- **Human evaluation**：人工评分

**维度 4：性能**

**指标**：
- **Latency**：端到端延迟
- **Cost per query**：单次查询成本
- **Throughput**：每秒查询数

## 20.3 RAGAS 实战

**安装**

```bash
pip install ragas
```

**4 大核心指标**

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
from datasets import Dataset

# 准备数据
data = {
    "question": [
        "什么是 RAG？",
        "DeepSeek-V3 的训练成本是多少？",
    ],
    "answer": [
        "RAG 是检索增强生成...",
        "DeepSeek-V3 训练成本约 5.5M 美元。",
    ],
    "contexts": [
        ["RAG 是一种结合检索和生成的方法..."],
        ["DeepSeek-V3 报告提到训练成本约 5.5M 美元..."],
    ],
    "ground_truth": [
        "RAG 是一种结合检索和生成的方法。",
        "DeepSeek-V3 训练成本约 5.5M 美元。",
    ],
}

dataset = Dataset.from_dict(data)

# 跑评估
result = evaluate(
    dataset,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
)

print(result)
# {'faithfulness': 0.95, 'answer_relevancy': 0.88, 'context_precision': 0.85, 'context_recall': 0.90}
```

**解读**

| 分数 | 含义 | 行动 |
|---|---|---|
| Faithfulness < 0.7 | 模型在"幻觉" | 改 prompt：要求"基于上下文回答" |
| Answer Relevancy < 0.7 | 答非所问 | 改 query 改写 / 检索策略 |
| Context Precision < 0.7 | 检索内容含噪 | 改 embedding / rerank |
| Context Recall < 0.7 | 检索不全 | 改 chunk size / 检索数量 |

## 20.4 TruLens 实战

```python
from trulens.core import Tru
from trulens.feedback import Groundedness, AnswerRelevance
from trulens.providers.openai import OpenAI

tru = Tru()
openai = OpenAI()

groundedness = Groundedness(openai)
relevance = AnswerRelevance(openai)

# 包装你的 RAG 应用
from trulens.apps.langchain import TruChain
tru_recorder = TruChain(
    rag_chain,
    app_name="my-rag",
    feedbacks=[groundedness, relevance],
)

# 跑应用
with tru_recorder as recording:
    rag_chain.invoke("What is RAG?")

# 启动仪表盘
tru.run_dashboard()
```

## 20.5 Agent 评估

**Agent 能力的 3 个层次**

| 层次 | 测什么 | 评估方式 |
|---|---|---|
| L1：单步工具调用 | 模型能否正确选工具 | BFCL |
| L2：多步推理 | 多轮思考 + 行动 | AgentBench |
| L3：真实任务 | 端到端任务完成 | SWE-bench、WebArena、OSWorld |

**单步工具调用评估（BFCL）**

```python
from bfcl import BFCL

# 加载测试集
dataset = BFCL.load()

for sample in dataset:
    tools = sample["tools"]  # 工具 schema 列表
    user_query = sample["query"]  # 用户请求
    
    # 模型生成 tool call
    tool_call = my_agent.generate_tool_call(tools, user_query)
    
    # 评分：调用是否正确（参数是否匹配）
    is_correct = BFCL.score(tool_call, sample["expected_call"])
```

**多步 Agent 评估**

```python
# 用 Inspect AI 跑 Agent 评估
from inspect_ai import eval
from inspect_ai.agent import Agent
from inspect_ai.task import Task

agent = Agent(
    tools=[search_tool, calculator_tool, code_tool],
    prompt="Solve the user's problem step by step.",
)

task = Task(
    dataset=load_dataset("gaia"),
    agent=agent,
    scorer=match_answer(),
)

results = eval([task], model="gpt-4o")
```

**关键指标**

| 指标 | 含义 |
|---|---|
| Task success rate | 任务最终成功的比例 |
| Tool selection accuracy | 工具选择正确的比例 |
| Parameter accuracy | 工具参数正确的比例 |
| Step efficiency | 完成任务用的步数 |
| Recovery rate | 失败后能否恢复 |

## 20.6 生产环境监控

**关键指标**

| 类别 | 指标 |
|---|---|
| **性能** | P50/P95/P99 延迟、吞吐量 |
| **成本** | 每查询成本、每月总成本 |
| **质量** | 用户反馈、点赞率 |
| **稳定性** | 错误率、超时率 |
| **安全** | 拒绝率、有害内容率 |

**Phoenix 实战**

```python
import phoenix as px
from phoenix.trace.langchain import LangChainInstrumentor

# 启动 Phoenix
session = px.launch_app()

# 自动追踪 LangChain 应用
LangChainInstrumentor().instrument()

# 启动评估
from phoenix.evals import (
    HallucinationEvaluator,
    QAEvaluator,
    OpenAIModel,
)

model = OpenAIModel(model="gpt-4o")
hallucination = HallucinationEvaluator(model)

# 跑评估
results = hallucination.evaluate(dataframe)
```

## 20.7 LangSmith 实战

```python
from langsmith import traceable
from langsmith.evaluation import evaluate

@traceable
def my_rag(query: str) -> str:
    # 你的 RAG 逻辑
    return answer

# 跑评估
results = evaluate(
    my_rag,
    data=dataset_name,
    evaluators=[correctness, hallucination, retrieval_relevance],
    metadata={"model": "gpt-4o"},
)
```

## 20.8 DeepEval 实战

```python
from deepeval import evaluate
from deepeval.metrics import (
    AnswerRelevancyMetric,
    FaithfulnessMetric,
    HallucinationMetric,
)
from deepeval.test_case import LLMTestCase

test_case = LLMTestCase(
    input="What is RAG?",
    actual_output="RAG is a technique...",
    retrieval_context=["RAG is a technique..."],
    expected_output="RAG combines retrieval and generation.",
)

# 跑评估
evaluate([test_case], [
    AnswerRelevancyMetric(threshold=0.7),
    FaithfulnessMetric(threshold=0.7),
    HallucinationMetric(threshold=0.7),
])
```

## 20.9 应用层评估 checklist

```markdown
## RAG 评估 Checklist
- [ ] Faithfulness 分数 > 0.8
- [ ] Answer Relevancy 分数 > 0.7
- [ ] Context Precision 分数 > 0.7
- [ ] Context Recall 分数 > 0.7
- [ ] 端到端延迟 < 2s
- [ ] 每月成本 < 预算
- [ ] 每周看 Phoenix 仪表盘

## Agent 评估 Checklist
- [ ] 任务成功率 > 80%
- [ ] 工具选择准确率 > 90%
- [ ] 平均步数 < 10
- [ ] 失败后能恢复
- [ ] 真实任务 hold-out 测试

## 生产监控 Checklist
- [ ] 错误率告警 < 5%
- [ ] 延迟告警 P95 > 5s
- [ ] 成本告警 > 月预算 80%
- [ ] 每周人工抽检 20 个对话
- [ ] 用户反馈收集
```

## 20.10 章节小结

- **RAG**: RAGAS 4 大指标
- **Agent**: BFCL + AgentBench + SWE-bench
- **生产监控**: Phoenix / LangSmith / TruLens
- **测试驱动**: DeepEval

## 20.11 验收自测

1. **选择**：RAG 评估最该用？
   - A. lm-eval-harness
   - B. RAGAS
   - C. SWE-bench
   - D. BFCL

2. **简答**：为什么 Faithfulness 比 Answer Correctness 更重要？

3. **实操**：用 RAGAS 评估你自己的 RAG 系统（100 个 query）。

## 20.12 📋 本章 Cheat Sheet

| 概念 | 一句话 | 详见 |
|---|---|---|
| RAG 4 维度 | Faithfulness/Relevance/Context/Answer | §20.2 |
| RAGAS | RAG 评估框架 | §20.3 |
| TruLens | RAG + Agent 评估 | §20.4 |
| Agent 评估 | 拆步骤看每步正确率 | §20.5 |
| LangSmith | trace 工具 | §20.7 |
| 生产监控 | 实时告警 + 抽样 | §20.6 |


## 20.13 ⚠️ 5 个常见错误

1. **只看 RAGAS 总分** — Faithfulness/Relevance/Context Precision 分项看,总分掩盖问题。
2. **不评估检索** — 检索召不回 = 模型再强也没用,先看 Recall@K。
3. **Agent 评估只看 pass/fail** — Agent 任务可拆步骤,看每步正确率才能定位失败。
4. **用真实 API 不限流** — Agent 跑 1000 题触发限流,失败率虚高,本地 mock 先跑通。
5. **LangSmith 当监控** — LangSmith 是 trace 工具不是监控,生产监控要 Prometheus/Grafana。

## 20.14 延伸阅读

⭐⭐⭐
- [RAGAS 文档](https://docs.ragas.io/)
- [Phoenix 文档](https://docs.arize.com/phoenix)
- [DeepEval 文档](https://docs.confident-ai.com/)

⭐⭐
- [LangSmith 文档](https://docs.smith.langchain.com/)
- [TruLens 文档](https://www.trulens.org/)
- [BFCL](https://gorilla.cs.berkeley.edu/leaderboard.html)

⭐
- [GAIA](https://gaia-bench.github.io/)
- [SWE-bench](https://www.swebench.com/)
- [WebArena](https://webarena.dev/)
