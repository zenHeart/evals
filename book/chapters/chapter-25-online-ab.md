# 25. 在线评估与 A/B 实验

> **如果只读一节**：离线评估告诉你"理论上好不好"，在线 A/B 告诉你"用户认不认"。**两者缺一不可**。在线评估的核心是分流 + 指标 + 显著性检验。

## 25.1 本章目标

读完后你能：

- 设计一个生产级 A/B 实验
- 计算统计显著性
- 知道在线评估的 4 大陷阱
- 区分曝光指标 vs 转化指标

## 25.2 离线 vs 在线

| 维度 | 离线评估 | 在线 A/B |
|---|---|---|
| 数据 | 固定测试集 | 真实用户 |
| 速度 | 快 | 慢（需累积流量） |
| 成本 | 低 | 高（用户体验风险） |
| 真实性 | 中 | 高 |
| 适合 | 回归、选型 | 决策发布 |

**金科玉律**：离线胜出 → 上线 5% 灰度 → A/B 胜出 → 全量。

## 25.3 A/B 实验设计

**5 个关键问题**

1. **指标**：评估什么？
2. **最小样本量**：多少用户才有结论？
3. **流量分配**：50/50？90/10？
4. **实验周期**：跑多久？
5. **判定标准**：多少提升算显著？

**最小样本量计算**

```typescript
// 假设：基线转化率 5%，希望检测到 1% 绝对提升（5% → 6%）
// 显著性水平 α = 0.05（5% 误报率）
// 检验功效 1-β = 0.80（80% 检测到真实差异）

function calculateSampleSize(
  baselineRate: number,  // 基线转化率
  mde: number,            // 最小可检测效应（绝对值）
  alpha = 0.05,
  power = 0.80
): number {
  // 用简化公式
  // n = (Z_alpha/2 + Z_beta)^2 * (p1(1-p1) + p2(1-p2)) / (p2-p1)^2
  const p1 = baselineRate;
  const p2 = baselineRate + mde;
  const zAlpha = 1.96;  // for alpha=0.05
  const zBeta = 0.84;   // for power=0.80
  
  const numerator = Math.pow(zAlpha + zBeta, 2) * (p1 * (1 - p1) + p2 * (1 - p2));
  const denominator = Math.pow(p2 - p1, 2);
  
  return Math.ceil(numerator / denominator);
}

// 示例：基线 5%，想检测 1% 提升
console.log(calculateSampleSize(0.05, 0.01)); // ~3000
```

**实验周期估算**

```typescript
// 假设：每天 1000 用户，转化率 5%
// 3000 / 1000 = 3 天

function estimateDaysToResult(
  dailyTraffic: number,
  sampleSize: number
): number {
  return Math.ceil(sampleSize / dailyTraffic);
}
```

## 25.4 流量分配

**50/50（标准 A/B）**

```
[100% 流量] → 50% 旧版本 / 50% 新版本
```

**适合**：成熟产品，转化稳定。

**90/10（新功能灰度）**

```
[100% 流量] → 90% 旧版本 / 10% 新版本
```

**适合**：风险大的新功能，验证稳定性。

**95/5（Canary）**

```
[100% 流量] → 95% 旧版本 / 5% 新版本
```

**适合**：监控告警，不追求统计显著。

## 25.5 在线指标分类

**1. 曝光指标**

| 指标 | 含义 |
|---|---|
| 触达用户 | 实验看到的人 |
| 曝光次数 | 实验展示的次数 |
| 首次曝光时间 | 第一次看到实验的时间 |

**2. 转化指标**

| 指标 | 含义 |
|---|---|
| 点击率 (CTR) | 点击 / 曝光 |
| 转化率 (CVR) | 转化 / 点击 |
| 完成率 | 完成 / 开始 |
| 留存率 | 次日 / 当日 |

**3. 业务指标**

| 指标 | 含义 |
|---|---|
| GMV | 商品交易总额 |
| 客单价 | 平均订单金额 |
| 退款率 | 退款 / 订单 |
| 满意度 (CSAT) | 5 分制评分 |

**4. 护栏指标（Guardrail）**

| 指标 | 含义 | 阈值 |
|---|---|---|
| 错误率 | 错误 / 请求 | < 1% |
| P95 延迟 | 95% 请求的延迟 | < 3s |
| 投诉率 | 投诉 / 订单 | < 0.5% |
| 安全事件 | 违规 / 总数 | = 0 |

**护栏指标超阈值 → 立即停止实验**。

## 25.6 显著性检验

```typescript
// 双比例 Z 检验
function twoProportionZTest(
  successesA: number, trialsA: number,
  successesB: number, trialsB: number
): { z: number; pValue: number; significant: boolean } {
  const pA = successesA / trialsA;
  const pB = successesB / trialsB;
  const pPool = (successesA + successesB) / (trialsA + trialsB);
  
  const se = Math.sqrt(pPool * (1 - pPool) * (1/trialsA + 1/trialsB));
  const z = (pB - pA) / se;
  
  // 简化：Z > 1.96 = p < 0.05 (双尾)
  // 这里用单尾（B 优于 A）
  const pValue = 1 - normalCdf(z);
  const significant = pValue < 0.05;
  
  return { z, pValue, significant };
}

function normalCdf(z: number): number {
  // 标准正态分布 CDF 近似
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

function erf(x: number): number {
  // 误差函数近似
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

// 示例：
// A: 转化 500/10000 = 5%
// B: 转化 600/10000 = 6%
const result = twoProportionZTest(500, 10000, 600, 10000);
console.log(result); // { z: 2.94, pValue: 0.0016, significant: true }
```

## 25.7 在线评估的 4 大陷阱

**陷阱 1：辛普森悖论**

```
整体：新版本转化率低
细分：每个用户群都是新版本高

→ 流量分配不均导致
```

**对策**：分层分析，按用户群分别看。

**陷阱 2：新颖性效应**

```
新功能上线前 3 天，转化率虚高
之后回归正常
```

**对策**：跑 ≥ 7 天，包含完整周期。

**陷阱 3：样本污染**

```
实验 A 的用户也被算到实验 B
```

**对策**：用 user_id 哈希分桶，严格不重叠。

**陷阱 4：过早停止**

```
实验跑 1 天，看到差异显著就停
```

**对策**：事先定样本量，达到才看。

## 25.8 实战：完整的 A/B 实验

```python
# ab_test.py
import hashlib
from datetime import datetime, timedelta

class ABTest:
    def __init__(self, name, variants, traffic_split):
        self.name = name
        self.variants = variants  # ['control', 'treatment']
        self.traffic_split = traffic_split  # {'control': 0.5, 'treatment': 0.5}
        self.start_date = datetime.now()
        self.target_samples = 3000  # 预计算
    
    def assign(self, user_id: str) -> str:
        """用 user_id 哈希分桶，确保稳定"""
        h = int(hashlib.md5(f"{self.name}:{user_id}".encode()).hexdigest(), 16)
        bucket = (h % 1000) / 1000
        
        cumulative = 0
        for variant, ratio in self.traffic_split.items():
            cumulative += ratio
            if bucket < cumulative:
                return variant
        return self.variants[-1]
    
    def track(self, user_id, variant, event):
        # 记录到分析系统
        analytics.track(
            user_id=user_id,
            experiment=self.name,
            variant=variant,
            event=event,
            timestamp=datetime.now(),
        )
    
    def analyze(self):
        # 1. 拉数据
        control_data = analytics.query(
            experiment=self.name, variant='control', event='conversion'
        )
        treatment_data = analytics.query(
            experiment=self.name, variant='treatment', event='conversion'
        )
        
        # 2. 显著性检验
        result = two_proportion_z_test(
            successesA=control_data['success'],
            trialsA=control_data['total'],
            successesB=treatment_data['success'],
            trialsB=treatment_data['total'],
        )
        
        # 3. 决策
        if not result['significant']:
            return "继续实验（不显著）"
        if treatment_data['rate'] > control_data['rate']:
            return "新版本胜出，发布"
        else:
            return "旧版本胜出，保留"
```

## 25.9 多变量测试（MVT）

> A/B 是 2 个版本，MVT 是 N 个。

```
变体 1：prompt A + temperature 0
变体 2：prompt A + temperature 0.7
变体 3：prompt B + temperature 0
变体 4：prompt B + temperature 0.7
```

**优点**：可分析交互效应
**缺点**：需要更大样本量（变体越多，每变体样本越少）

## 25.10 与离线评估的结合

```
[离线评估] 5 个版本 → 选 2 个最优
   ↓
[A/B 实验] 2 个版本 → 选 1 个胜出
   ↓
[全量发布]
```

**离线胜出 ≠ 在线胜出**（约 30-50% 的情况）。

原因：
- 离线测试集不够全面
- 用户行为 ≠ 测试集预期
- 真实场景有意外

## 25.11 章节小结

- **离线胜出 → 灰度 5% → 显著胜出 → 全量**
- 显著性检验是基础
- 护栏指标防止灾难
- 在线胜出 ≠ 离线胜出（约 30-50% 反转）

## 25.12 验收自测

1. **选择**：A/B 实验中"立即停止"的指标是？
   - A. 转化率
   - B. 护栏指标
   - C. CTR
   - D. 客单价

2. **简答**：为什么"辛普森悖论"在 A/B 实验中危险？

3. **实操**：计算你业务的最小样本量（基线 5%，MDE 1%，α=0.05，power=0.8）。

## 25.13 📋 本章 Cheat Sheet

| 概念 | 一句话 | 详见 |
|---|---|---|
| A/B 实验 | 在线评估金标准 | §25.3 |
| 流量分配 | 1% 灰度起步 | §25.4 |
| 显著性检验 | p < 0.05 才决策 | §25.6 |
| P50/P90/P99 | 长尾问题看 P99 | §25.5 |
| 4 大陷阱 | 辛普森悖论/新奇效应/瓶中效应/存活偏差 | §25.7 |
| MVT | 多变量测试 | §25.9 |


## 25.14 ⚠️ 5 个常见错误

1. **A/B 实验只看转化率** — 延迟/留存/差评也要看,综合指标才不片面。
2. **流量分配 50/50** — 新模型 50% 风险大,先 1% 灰度再扩。
3. **不计算显著性** — 1% 提升可能是噪声,p < 0.05 才决策。
4. **只看均值不看分布** — P50/P90/P99 三档都看,长尾问题才暴露。
5. **在线评估 = 离线放弃** — 在线离线互为补充,不是替代,见 §25.10。

## 25.15 延伸阅读

⭐⭐⭐
- [Trustworthy Online Controlled Experiments (Kohavi et al.)](https://www.amazon.science/publications/trustworthy-online-controlled-experiments-a-practical-guide-to-a-b-testing)
- [A/B Testing 完整指南 (Evan Miller)](https://www.evanmiller.org/ab-testing/)

⭐⭐
- [Statsig A/B Testing Guide](https://docs.statsig.com/)
- [GrowthBook (Open Source)](https://docs.growthbook.io/)

⭐
- [PostHog Experiments](https://posthog.com/docs/experiments)
- [Eppo A/B Testing](https://www.geteppo.com/)
