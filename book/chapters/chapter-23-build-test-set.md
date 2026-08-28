# 23. 构建测试集：合成、人工、回流

> **如果只读一节**：测试集的 4 个来源 = 公开数据 + 人工编写 + 真实回流 + LLM 合成。**真实回流 20% 是底线，否则评估永远偏。**

## 23.1 本章目标

读完后你能：

- 设计一个 4 来源混合的测试集
- 知道每个来源的优缺点
- 知道如何避免"测试集污染"
- 写一个合成数据的 pipeline

## 23.2 个来源对比

| 来源 | 数量 | 质量 | 多样性 | 隐私风险 | 成本 |
|---|---|---|---|---|---|
| 公开数据 | 高 | 中 | 高 | 无 | 低 |
| 人工编写 | 中 | 高 | 中 | 无 | 高 |
| 真实回流 | 低 | 高 | 低 | 高 | 低 |
| LLM 合成 | 高 | 中-高 | 高 | 低 | 中 |

## 23.3 来源 1：公开数据

**适合场景**

- **基线**（与全行业对比）
- **冷启动**（没数据时）
- **能力验证**（数学、代码等通用能力）

**注意点**

- **数据污染风险**：训练数据可能包含测试题
- **时效性**：很多基准已过时
- **本地化**：英文基准不能代表中文场景

**推荐公开数据**

| 场景 | 基准 |
|---|---|
| 通用对话 | MT-Bench, AlpacaEval |
| 客服 | Customer Service QA Dataset |
| 代码 | HumanEval, MBPP, LiveCodeBench |
| 中文 | CMMLU, C-Eval |
| 多模态 | MMMU, MathVista |
| Agent | SWE-bench, WebArena |

## 23.4 来源 2：人工编写

**适合场景**

- 业务关键能力
- 边界 case
- 风险点（不能失败）

**编写流程**

```
1. 列出 10-20 个核心场景
2. 每个场景写 10-20 道题
3. 找 2-3 个领域专家审校
4. 试跑 → 修改
5. 锁定（freeze）作为黄金测试集
```

**编写质量 checklist**

```markdown
## 测试集题目 Checklist

**内容质量**
- [ ] 题目无歧义
- [ ] 答案唯一或可枚举
- [ ] 难度适当
- [ ] 覆盖典型场景
- [ ] 覆盖边界场景

**形式**
- [ ] JSONL 格式
- [ ] 每题有 ID
- [ ] 每题有 category
- [ ] 每题有 difficulty
- [ ] 每题有 expected output
```

**真实示例**

```jsonl
{"id": "cs-001", "category": "退款", "difficulty": "easy", "input": "我想退我上周买的耳机", "expected": "询问订单号/购买渠道"}
{"id": "cs-002", "category": "退款", "difficulty": "medium", "input": "我买的耳机用了 5 天发现有问题，能退吗？", "expected": "解释 7 天无理由退换政策"}
{"id": "cs-003", "category": "退款", "difficulty": "hard", "input": "我的耳机是赠品，能退吗？", "expected": "解释赠品政策（不可退）"}
```

## 23.5 来源 3：真实回流

**适合场景**

- 反映真实分布
- 持续改进
- 长期监控

**Pipeline**

```
[生产环境] 
   ↓ (用户对话)
[采样 5-10%]
   ↓
[脱敏（去除 PII）]
   ↓
[人工标注 / LLM Judge 评分]
   ↓
[加入测试集]
```

**脱敏**

```typescript
// 脱敏示例
function anonymize(text: string): string {
  return text
    .replace(/[\w.]+@[\w.]+/g, "[EMAIL]")     // 邮箱
    .replace(/1[3-9]\d{9}/g, "[PHONE]")       // 手机号
    .replace(/\d{17,18}/g, "[ID_CARD]")       // 身份证
    .replace(/[一-龥]{2,3}(先生|女士)/g, "[NAME]")  // 姓名
    .replace(/订单号[：:]?\s*\d+/g, "[ORDER_ID]")  // 订单号
    .replace(/地址[：:]?\s*[^\n]+/g, "[ADDRESS]");   // 地址
}
```

**人工标注**

```python
# 用 Label Studio
# 每个对话标注：
# - 类别（退货/换货/咨询/投诉...）
# - 质量（1-5）
# - 风险（是否涉及合规）
# - 期望回复
```

**自动回流**

```python
# 每周自动跑：采样生产数据 → 脱敏 → 标注 → 入库
from datetime import datetime, timedelta
import json

def weekly_refill():
    last_week = datetime.now() - timedelta(days=7)
    
    # 1. 采样
    conversations = sample_production_data(since=last_week, ratio=0.05)
    
    # 2. 脱敏
    conversations = [anonymize(c) for c in conversations]
    
    # 3. 自动评分（LLM-as-Judge）
    for c in conversations:
        c["auto_score"] = judge(c)
    
    # 4. 选择低分（< 0.7）作为测试集候选
    candidates = [c for c in conversations if c["auto_score"] < 0.7]
    
    # 5. 入库
    test_set.extend(candidates)
```

## 23.6 来源 4：LLM 合成

**适合场景**

- 大量补充
- 长尾覆盖
- 边界 case 探索

**合成 pipeline**

```python
# 用 GPT-4 合成测试集
def generate_synthetic_questions(seed_examples: list, n: int = 100):
    prompt = f"""
    Based on these example questions, generate {n} new diverse questions 
    that test the same capability but cover edge cases and varied scenarios.
    
    Examples:
    {json.dumps(seed_examples, ensure_ascii=False, indent=2)}
    
    Requirements:
    - Cover easy, medium, and hard difficulties
    - Include edge cases
    - Vary the wording
    - Keep the same expected output format
    
    Output JSON array with id, input, expected, difficulty, category.
    """
    
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
    )
    
    return json.loads(response.choices[0].message.content)
```

**合成质量控制**

```python
def validate_synthetic_question(q: dict) -> bool:
    # 1. 必填字段
    if not all(k in q for k in ["id", "input", "expected", "difficulty"]):
        return False
    
    # 2. 不能太短
    if len(q["input"]) < 10:
        return False
    
    # 3. 不能太长
    if len(q["input"]) > 2000:
        return False
    
    # 4. 必须是新题（去重）
    if is_duplicate(q["input"]):
        return False
    
    return True
```

## 23.7 来源最佳实践

**比例建议**

| 来源 | 比例 | 数量 (n=500) | 用途 |
|---|---|---|---|
| 公开数据 | 20% | 100 | 基线对比 |
| 人工编写 | 30% | 150 | 业务核心 |
| 真实回流 | 30% | 150 | 反映真实 |
| LLM 合成 | 20% | 100 | 长尾覆盖 |

**何时更新**

| 来源 | 更新频率 |
|---|---|
| 公开数据 | 半年 / 季度 |
| 人工编写 | 季度 |
| 真实回流 | 持续（每月汇总） |
| LLM 合成 | 月度（按需） |

## 23.8 防止数据污染

**4 个机制**

1. **Hold-out**（保留 10% 不给任何模型看）
2. **时间戳**（标注数据时间，防训练-测试穿越）
3. **Canary tokens**（在数据中插入唯一标记，检测是否被训练）
4. **盲评**（评估员不知道哪个模型在跑）

**Canaries 示例**

```jsonl
{"id": "canary-001", "input": "What is the secret code ABCXYZ-123?", "expected": "I do not have access to that information."}
```

如果某个模型能"答对" canary → 数据已被污染。

## 23.9 测试集版本管理

```
test-set/
├── v1.0/         # 锁定版本
│   ├── customer-service.jsonl
│   ├── coding.jsonl
│   └── README.md
├── v1.1/         # 新版本（不破坏 v1.0）
│   ├── customer-service.jsonl
│   └── CHANGELOG.md
└── latest -> v1.1/
```

**不要修改锁定版本**，永远新建 v2。

## 23.10 实战：构建一个 500 题的测试集

```python
# build-test-set.py
import json
import random

def build_test_set():
    test_set = []
    
    # 来源 1：公开数据
    public_data = load_jsonl("data/public/mmlu-customer-service.jsonl")
    test_set.extend(random.sample(public_data, 100))
    
    # 来源 2：人工编写
    human_data = load_jsonl("data/human/written.jsonl")
    test_set.extend(human_data)
    
    # 来源 3：真实回流
    real_data = load_jsonl("data/reflow/this-month.jsonl")
    test_set.extend(real_data)
    
    # 来源 4：LLM 合成
    seed = human_data[:5]
    synthetic = generate_synthetic_questions(seed, n=100)
    test_set.extend([s for s in synthetic if validate_synthetic_question(s)])
    
    # 随机打乱
    random.shuffle(test_set)
    
    # 写入文件
    with open("test-set/v1.0/full.jsonl", "w") as f:
        for q in test_set:
            f.write(json.dumps(q, ensure_ascii=False) + "\n")
    
    return test_set
```

## 23.11 章节小结

- **4 来源**：公开 / 人工 / 回流 / 合成
- **比例**：20% / 30% / 30% / 20%
- **去重 + 脱敏 + 版本管理** 是工程化关键
- **持续更新**是测试集保持有效的关键

## 23.12 验收自测

1. **选择**：测试集的"基线"对比该用？
   - A. LLM 合成
   - B. 真实回流
   - C. 公开数据
   - D. 人工编写

2. **简答**：为什么"真实回流"必须占测试集的 20%+？

3. **实操**：用 4 来源构建一个 200 题的客服测试集。

## 23.13 延伸阅读

⭐⭐⭐
- [Designing ML Evaluation Systems (Chip Huyen)](https://huyenchip.com/2023/05/15/designing-ml-evaluation-systems.html)
- [Data Contamination in LLMs](https://arxiv.org/abs/2402.08760)

⭐⭐
- [Synthetic Data for LLM Training (Anthropic)](https://www.anthropic.com/news/synthetic-data)
- [Label Studio](https://labelstud.io/)

⭐
- [Scale AI Data Platform](https://scale.com/)
- [Surge AI](https://www.surgehq.ai/)
