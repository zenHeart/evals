# 19. 人类评估设计：盲评、Elo 与 Pairwise

> **如果只读一节**：人类评估是黄金标准。**3 个关键：盲评（不知道模型身份）、多评估员（>3）、标准化 rubric（事先定义好）**。

## 19.1 本章目标

读完后你能：

- 设计一个 100 人的人类评估
- 知道 Elo 评分的工作原理
- 知道 Pairwise 比 Likert 更可靠
- 评估人类评估的可靠性

## 19.2 何时必须用人类评估

| 场景 | 人类评估必要性 |
|---|---|
| 创意写作质量 | ⭐⭐⭐ 必要 |
| 客服对话满意度 | ⭐⭐⭐ 必要 |
| 教学/解释清晰度 | ⭐⭐⭐ 必要 |
| 角色扮演一致性 | ⭐⭐ 推荐 |
| 简单问答准确性 | ⭐ 不必（LLM-as-Judge 即可） |
| 代码可运行性 | ⭐ 不必（自动跑测试） |
| 数学计算 | ⭐ 不必（规则匹配） |

## 19.3 人类评估的 3 种范式

**范式 1：Likert 量表（单评分）**

```
请评价这段回答的质量（1-5）：
1 = 非常差
2 = 差
3 = 一般
4 = 好
5 = 非常好

[回答内容]
```

**优点**：简单、易懂
**缺点**：评分标准不一致（每个人的"5"不一样）

**范式 2：Pairwise（两两比较）**

```
请比较以下两个回答：
A: ...
B: ...

A 更好 / B 更好 / 平局
```

**优点**：更可靠（人类擅长相对判断）
**缺点**：需要更多对比次数

**范式 3：Ranked List（排名）**

```
请将以下 5 个回答从最好到最差排序：
[回答 1] [回答 2] [回答 3] [回答 4] [回答 5]
```

**优点**：信息密度高
**缺点**：疲劳、注意力下降

**经验**：**Pairwise > Likert > Ranking**，因为 pairwise 是人类最擅长的。

## 19.4 Elo 评分系统

**来自麻将**

> 每个选手初始 1500 分。每次对战胜者得 K 分，败者失 K 分。K 通常 16-32。

**公式**

```
E_A = 1 / (1 + 10^((R_B - R_A) / 400))
R_A' = R_A + K * (S_A - E_A)
```

其中：
- `E_A` = A 预期胜率
- `R_A, R_B` = 两人当前分
- `S_A` = 实际得分（1 胜 / 0.5 平 / 0 负）

**LLM 评估版**

```typescript
class Elo {
  private ratings = new Map<string, number>();
  private k = 32;
  
  getElo(model: string): number {
    return this.ratings.get(model) ?? 1500;
  }
  
  update(modelA: string, modelB: string, scoreA: number): void {
    const rA = this.getElo(modelA);
    const rB = this.getElo(modelB);
    const eA = 1 / (1 + Math.pow(10, (rB - rA) / 400));
    const eB = 1 - eA;
    
    this.ratings.set(modelA, rA + this.k * (scoreA - eA));
    this.ratings.set(modelB, rB + this.k * ((1 - scoreA) - eB));
  }
  
  // 跑 N 轮 pairwise 后输出排名
  leaderboard(): Array<{ model: string; elo: number }> {
    return Array.from(this.ratings.entries())
      .map(([model, elo]) => ({ model, elo }))
      .sort((a, b) => b.elo - a.elo);
  }
}

// 跑 1000 轮 pairwise
const elo = new Elo();
elo.update("gpt-4o", "claude-3.5", 1); // GPT-4o 胜
elo.update("gpt-4o", "claude-3.5", 0); // Claude 胜
// ...
console.table(elo.leaderboard());
```

## 19.5 Bradley-Terry 模型

比 Elo 更统计化的方法：

```
P(A wins) = exp(R_A) / (exp(R_A) + exp(R_B))
```

**优势**：
- 可处理多模型同时对比
- 输出置信区间

**工具**：
- Python: `choix` 库
- LMSYS 用这个做 Arena

## 19.6 评估员选择与培训

**评估员类型**

| 类型 | 成本 | 质量 | 适用 |
|---|---|---|---|
| 众包（淘宝 MTurk） | 低 | 中 | 简单任务 |
| 内部员工 | 中 | 高 | 业务任务 |
| 领域专家 | 高 | 最高 | 专业任务（法律/医疗） |
| 用户 | 最高 | 真实 | 最终验证 |

**培训 3 步**

1. **看 rubric**（评分标准）
2. **评 20 道样本**（热身）
3. **与"金标准"对比**（发现分歧点）

**一致性检验**

```typescript
// Cohen's Kappa 衡量两个评估员的一致性
function cohensKappa(rater1: number[], rater2: number[]): number {
  // rater1, rater2 是相同长度的评分数组
  const categories = new Set([...rater1, ...rater2]);
  const n = rater1.length;
  let agree = 0;
  for (let i = 0; i < n; i++) {
    if (rater1[i] === rater2[i]) agree++;
  }
  const p_o = agree / n; // 观察一致率
  
  let p_e = 0;
  for (const c of categories) {
    const p1 = rater1.filter(x => x === c).length / n;
    const p2 = rater2.filter(x => x === c).length / n;
    p_e += p1 * p2;
  }
  
  return (p_o - p_e) / (1 - p_e);
}
```

**Kappa 解读**：
- > 0.8：极好
- 0.6-0.8：好
- 0.4-0.6：中等
- < 0.4：差（需要重新培训）

## 19.7 评估设计 checklist

设计人类评估前，回答 8 个问题：

```markdown
## 人类评估设计 Checklist

**1. 目标**
- [ ] 评估什么能力？（写作/代码/对话）
- [ ] 为什么不能自动化？

**2. 任务**
- [ ] 任务数：____ (建议 ≥ 100)
- [ ] 任务来源：公开 / 业务 / 合成
- [ ] 每任务多少评估员：____ (建议 ≥ 3)

**3. 评估员**
- [ ] 评估员数：____ (建议 ≥ 5)
- [ ] 资质要求：____
- [ ] 培训：____
- [ ] 报酬：____

**4. 评分方式**
- [ ] Likert 1-5 / 1-7 / 1-10
- [ ] Pairwise
- [ ] Ranking
- [ ] 自定义 rubric

**5. 盲评**
- [ ] 评估员不知道模型身份 ✓
- [ ] 评估员不知道 prompt ✓
- [ ] 随机化答案顺序 ✓

**6. 可靠性**
- [ ] 计算 Cohen's Kappa
- [ ] 抽样核查
- [ ] 设置"金标准"样本

**7. 工具**
- [ ] Label Studio
- [ ] Amazon Mechanical Turk
- [ ] Prolific
- [ ] 自建

**8. 时间与成本**
- [ ] 预计总时间：____
- [ ] 每评估员成本：____
- [ ] 总预算：____
```

## 19.8 实战：用 Label Studio 做人类评估

```bash
# 安装
pip install label-studio

# 启动
label-studio start
# 打开 http://localhost:8080
```

**配置**

```xml
<!-- label_config.xml -->
<View>
  <Header value="Please rate the AI response"/>
  <Text name="question" value="$question"/>
  <TextArea name="response" toName="response" value="$response"/>
  <Choices name="rating" toName="response">
    <Choice value="excellent">Excellent (5)</Choice>
    <Choice value="good">Good (4)</Choice>
    <Choice value="fair">Fair (3)</Choice>
    <Choice value="poor">Poor (2)</Choice>
    <Choice value="bad">Bad (1)</Choice>
  </Choices>
</View>
```

## 19.9 人类评估的陷阱

**陷阱 1：评估员疲劳**

- 每个评估员评 < 50 个任务
- 每 15 分钟休息
- 移除异常快/慢的评估员

**陷阱 2：答案顺序影响**

- 每次随机化 A/B 顺序
- 盲评（不知道是谁的答案）

**陷阱 3：评估员偏差**

- 培训时给"金标准"答案
- 监控一致性

**陷阱 4：rubric 不清晰**

- 给具体例子
- "5 = 完美" 不够
- 应该是 "5 = 流畅、正确、覆盖所有要点、提供额外洞见"

## 19.10 章节小结

- **Pairwise > Likert**（人类更擅长相对判断）
- **盲评**是关键
- **多评估员 + 一致性检验**保证质量
- **Elo / Bradley-Terry** 转换 pairwise 为分数

## 19.11 验收自测

1. **选择**：哪种评分方式最稳定？
   - A. Likert 1-5
   - B. Pairwise
   - C. Ranking
   - D. Binary

2. **简答**：为什么"盲评"是人类评估的关键？

3. **实操**：用 Label Studio 创建一个 50 道题的 Pairwise 评估项目。

## 19.12 📋 本章 Cheat Sheet

| 概念 | 一句话 | 详见 |
|---|---|---|
| 人类评估 | 可用性测试的 LLM 版本 | §19.2 |
| Elo | 胜率排序 | §19.4 |
| Bradley-Terry | 统计化的偏好模型 | §19.5 |
| Cohen's Kappa | 评估员一致性,>0.7 | §19.3 |
| 盲评 | 评估员不知模型身份 | §19.6 |
| 评估员培训 | Kappa 低 = 培训不到位 | §19.6 |


## 19.13 ⚠️ 5 个常见错误

1. **1 个评估员评所有** — 1 个人看法 = 个人观点,至少 3 人评 + 算 Kappa。
2. **不培训评估员** — 评估员对题目理解不一致 → Kappa 低,先培训再评。
3. **不盲评** — 评估员知道模型身份 = 偏见,blinding 必须严格执行。
4. **一次评完不抽检** — 评估员前 10 题 vs 后 10 题可能漂移,定期抽检。
5. **Bradley-Terry 当 Elo** — BT 假设独立对战,Elo 假设动态,数据少用 BT 多用 Elo。

## 19.14 延伸阅读

⭐⭐⭐
- [LMSYS Chatbot Arena Methodology](https://lmarena.ai/blog)
- [Crowd-Kit: Human Evaluation Library](https://github.com/Toloka/crowd-kit)

⭐⭐
- [Cohen's Kappa 详解](https://en.wikipedia.org/wiki/Cohen%27s_kappa)
- [Label Studio Docs](https://labelstud.io/guide/)
- [淘宝 Mechanical Turk Docs](https://docs.aws.amazon.com/mturk/)

⭐
- [BradleyTerry2 (R package)](https://docs.ropensci.org/BradleyTerry2/)
- [Inter-Annotator Agreement 详解](https://en.wikipedia.org/wiki/Inter-rater_reliability)
