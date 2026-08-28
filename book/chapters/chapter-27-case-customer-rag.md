# 27. 案例研究（一）：评估一个客服 RAG 系统

> **如果只读一节**：评估 = (1) RAGAS 4 大指标 (2) 真实场景测试集 (3) 灰度发布 3 步走。本章用 8000 字演示一个真实 RAG 项目的完整评估 pipeline。

## 27.1 业务背景

**公司**：XX 电商
**问题**：客服每天处理 5000+ 重复问题，人力成本高
**目标**：用 RAG 替代 50% 客服工作

**RAG 系统**：
- 文档库：商品 FAQ、订单政策、退换货流程
- LLM：GPT-4o-mini
- Embedding：text-embedding-3-small
- 检索：top-5 chunks

## 27.2 业务目标 → 能力 → 指标

**业务目标**

> "减少 50% 客服工作量，CSAT 不下降"

**能力拆解**

| 能力 | 优先级 | 指标 | 目标 |
|---|---|---|---|
| 意图识别 | P0 | 分类 F1 | > 0.85 |
| 答案忠实 | P0 | RAGAS Faithfulness | > 0.85 |
| 答案切题 | P0 | RAGAS Answer Relevancy | > 0.80 |
| 检索召回 | P0 | RAGAS Context Recall | > 0.80 |
| 检索精准 | P1 | RAGAS Context Precision | > 0.75 |
| 速度 | P1 | P95 延迟 | < 2s |
| 成本 | P2 | $/对话 | < $0.02 |

## 27.3 测试集设计

**来源 1：人工编写（150 题）**

```jsonl
{"id": "cs-001", "category": "退款", "difficulty": "easy", "input": "我想退我上周买的耳机", "expected": "询问订单号/购买渠道", "golden_context": ["doc-refund-1", "doc-refund-2"]}
{"id": "cs-002", "category": "退款", "difficulty": "medium", "input": "我买的耳机用了 5 天发现有问题，能退吗？", "expected": "解释 7 天无理由退换政策", "golden_context": ["doc-refund-1"]}
{"id": "cs-003", "category": "退款", "difficulty": "hard", "input": "我的耳机是赠品，能退吗？", "expected": "解释赠品政策（不可退）"}
{"id": "cs-004", "category": "物流", "difficulty": "easy", "input": "我的快递到哪了？", "expected": "询问订单号/物流单号"}
```

**来源 2：公开数据（50 题）**

- 公开客服 QA 数据集
- Stanford Alpaca 改写的客服场景

**来源 3：真实回流（200 题）**

```
近 30 天 5000 客服对话 → 采样 5% → 脱敏 → 标注
```

**来源 4：LLM 合成（100 题）**

```
基于种子问题，让 GPT-4 生成 100 道新题
```

## 27.4 评估代码实现

**1. RAGAS 评估**

```python
# eval_rag.py
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
from datasets import Dataset
import json

# 准备数据
def load_data():
    with open("data/test-set.jsonl", "r", encoding="utf-8") as f:
        samples = [json.loads(l) for l in f]
    
    return Dataset.from_dict({
        "question": [s["input"] for s in samples],
        "answer": [s.get("model_answer", "") for s in samples],  # 由 RAG 生成
        "contexts": [s.get("retrieved_contexts", []) for s in samples],
        "ground_truth": [s["expected"] for s in samples],
    })

# 1. 跑 RAG 生成答案
def generate_answers():
    samples = load_samples()
    for s in samples:
        # 调用 RAG 系统
        result = my_rag.query(s["input"])
        s["model_answer"] = result["answer"]
        s["retrieved_contexts"] = result["contexts"]
    save_samples(samples)

# 2. 跑 RAGAS
def run_ragas():
    dataset = load_data()
    result = evaluate(
        dataset,
        metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
    )
    print(result)
    return result

if __name__ == "__main__":
    generate_answers()
    result = run_ragas()
```

**2. 自定义业务指标**

```python
# custom_metrics.py
def csat_proxy_score(answer: str) -> float:
    """CSAT 代理指标：基于回答特征预测用户满意度"""
    score = 0.5
    
    # 长度适中
    if 50 < len(answer) < 500:
        score += 0.1
    
    # 包含必要信息
    must_have_keywords = ["订单", "联系", "操作"]
    if any(kw in answer for kw in must_have_keywords):
        score += 0.1
    
    # 礼貌用语
    if any(p in answer for p in ["您好", "请", "感谢", "理解"]):
        score += 0.1
    
    # 没有明显错误信息
    if "我不知道" in answer and len(answer) < 50:
        score -= 0.2
    
    return min(max(score, 0), 1)

# 业务指标
def business_metrics(samples):
    return {
        "avg_csat_proxy": sum(csat_proxy_score(s["model_answer"]) for s in samples) / len(samples),
        "refund_handled_rate": sum(1 for s in samples if s["category"] == "退款" and "订单" in s["model_answer"]) / sum(1 for s in samples if s["category"] == "退款"),
        "off_topic_rate": sum(1 for s in samples if not is_on_topic(s["model_answer"], s["expected"])) / len(samples),
    }
```

## 27.5 评估结果分析

**第 1 轮结果**

| 指标 | 值 | 目标 | 状态 |
|---|---|---|---|
| Faithfulness | 0.82 | > 0.85 | ❌ 略低 |
| Answer Relevancy | 0.78 | > 0.80 | ❌ 略低 |
| Context Recall | 0.85 | > 0.80 | ✅ |
| Context Precision | 0.65 | > 0.75 | ❌ 较低 |
| 延迟 P95 | 3.2s | < 2s | ❌ 慢 |

**问题诊断**

```
1. Context Precision 低 → 检索的内容含噪
2. Faithfulness 略低 → 偶尔幻觉
3. 延迟高 → top-5 太多
```

**改进方向**

| 问题 | 改进 |
|---|---|
| 检索含噪 | 改用 reranker 二次过滤 |
| 幻觉 | prompt 加"基于上下文回答"指令 |
| 延迟 | 减少到 top-3 |

**改进后第 2 轮**

| 指标 | 值 | 目标 | 状态 |
|---|---|---|---|
| Faithfulness | 0.88 | > 0.85 | ✅ |
| Answer Relevancy | 0.83 | > 0.80 | ✅ |
| Context Recall | 0.83 | > 0.80 | ✅ |
| Context Precision | 0.78 | > 0.75 | ✅ |
| 延迟 P95 | 1.6s | < 2s | ✅ |

## 27.6 灰度发布

**第 1 阶段：5% 流量**

```
时间：1 周
流量：5%（约 250 用户/天）
监控：实时看 Faithfulness + 用户反馈
```

**第 2 阶段：25% 流量**

```
条件：第 1 阶段 CSAT 不下降
时间：2 周
流量：25%
监控：CSAT、客服工作量
```

**第 3 阶段：100% 全量**

```
条件：第 2 阶段 CSAT 上升、客服工作量下降 ≥ 50%
时间：永久
```

## 27.7 持续监控

```python
# monitor.py
import schedule
import time

def daily_monitor():
    # 1. 拉当天的真实对话
    today_conversations = get_conversations(since="today")
    
    # 2. 跑 RAGAS
    metrics = run_ragas_on(today_conversations)
    
    # 3. 检查告警
    if metrics["faithfulness"] < 0.80:
        alert_slack("⚠️ Faithfulness 下降")
    if metrics["csat"] < 4.0:
        alert_slack("⚠️ CSAT 下降")
    if metrics["p95_latency"] > 3:
        alert_slack("⚠️ 延迟升高")
    
    # 4. 写入 dashboard
    push_to_grafana(metrics)

schedule.every().day.at("09:00").do(daily_monitor)

while True:
    schedule.run_pending()
    time.sleep(60)
```

## 27.8 月度复盘

每月做一次"评估的评估"：

```
1. 看 RAGAS 趋势（30 天）
2. 看 CSAT 趋势（30 天）
3. 两者是否一致？
   - 一致 → 评估可信
   - 不一致 → 调整评估
4. 抽样 20 个对话人工复核
5. 更新测试集
```

## 27.9 经验教训

**教训 1：纯 Faithfulness 不够**

```
Faithfulness 高 = 答案忠于文档
但用户问 A 答 B = 答非所问
→ 还要 Answer Relevancy
```

**教训 2：Context Precision 比 Recall 更难**

```
召回 = 找到相关信息
精准 = 排除噪声

提高 Recall 容易（top-K 调大）
提高 Precision 难（需要 rerank）
```

**教训 3：业务指标是"滞后"指标**

```
Faithfulness 立即知道
CSAT 需要 7 天累积

→ 业务指标变化时，根因可能 1 周前
```

**教训 4：RAG 不能解决所有问题**

```
- 多轮对话 → 需要 session 管理
- 个性化 → 需要用户画像
- 复杂推理 → 需要 CoT/Agent

→ RAG 适合"查文档 + 答问题"
```

## 27.10 章节小结

- **业务目标 → 能力 → 指标 → 测试集** 是核心
- **RAGAS 4 大指标** 是基础
- **业务指标 + 技术指标** 双重监控
- **灰度 3 步走**（5% → 25% → 100%）
- **每月复盘评估的评估**

## 27.11 验收自测

1. **选择**：RAG 评估的 4 大核心指标不包括？
   - A. Faithfulness
   - B. Answer Relevancy
   - C. Context Recall
   - D. BLEU

2. **简答**：为什么"Context Precision 比 Recall 更难"？

3. **实操**：用 RAGAS 评估你自己的 RAG 系统（50 个 query）。

## 27.12 延伸阅读

⭐⭐⭐
- [RAGAS 文档](https://docs.ragas.io/)
- [Building Production-Ready RAG (Anthropic)](https://www.anthropic.com/news/building-effective-agents)

⭐⭐
- [RAG 评估实战 (LlamaIndex)](https://docs.llamaindex.ai/en/stable/module_guides/evaluating/)
- [LangSmith RAG Evaluation](https://docs.smith.langchain.com/old/evaluation/end-to-end/rag_eval)

⭐
- [TruLens RAG Triad](https://www.trulens.org/trulens_eval/guardrails/)
- [Continuous Eval for RAG](https://towardsdatascience.com/continuous-evaluation-for-rag-1c775276ef59)
