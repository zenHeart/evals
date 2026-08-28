# 24. 评估流水线工程：CI/CD、回归、灰度

> **如果只读一节**：评估必须集成到 CI/CD。每次 PR 跑回归，每天定时跑全量，发版前跑红队。**没有 CI 的评估 = 不会被使用的评估**。

## 24.1 本章目标

读完后你能：

- 把评估集成到 CI/CD
- 设计灰度发布
- 知道评估的"3 个时机"（PR / 定时 / 发版）
- 知道评估结果的呈现方式

## 24.2 评估的 3 个时机

| 时机 | 范围 | 速度 | 触发 |
|---|---|---|---|
| **每次 PR** | 快速回归 | 5-10 分钟 | push / pull_request |
| **每日定时** | 完整评估 | 1-2 小时 | cron |
| **发版前** | 红队 + 全量 | 数小时 | workflow_dispatch |

## 24.3 PR 时的快速回归

```yaml
# .github/workflows/eval-pr.yml
name: PR Eval
on:
  pull_request:
    paths:
      - "prompts/**"
      - "src/**"
      - "config/**"

jobs:
  eval:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup
        uses: actions/setup-node@v4
        with:
          node-version: 22
      
      - name: Install
        run: npm ci --ignore-scripts
      
      - name: Quick Eval
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          # 只跑 50 道快速回归
          npm run eval -- --limit 50 --output report.json
      
      - name: Check Regression
        run: |
          # 比较当前结果 vs 基线
          node scripts/check-regression.js report.json baseline.json
          # 如果准确率下降 > 2%，PR 不通过
```

## 24.4 每日定时全量

```yaml
# .github/workflows/eval-daily.yml
name: Daily Full Eval
on:
  schedule:
    - cron: '0 3 * * *'  # 每天 3 点
  workflow_dispatch:

jobs:
  eval:
    runs-on: ubuntu-latest
    timeout-minutes: 120
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install
        run: pip install -r requirements.txt
      
      - name: Full Eval
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: python -m eval.full --output daily-$(date +%Y%m%d).json
      
      - name: Upload Results
        uses: actions/upload-artifact@v4
        with:
          name: daily-eval
          path: 'daily-*.json'
      
      - name: Compare with Baseline
        run: |
          # 比较 vs 上一日 / 基线
          python scripts/compare.py daily-$(date +%Y%m%d).json baseline.json
      
      - name: Notify Slack on Regression
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "⚠️ Daily eval regression detected. Check: https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## 24.5 回归检测算法

```typescript
// scripts/check-regression.ts
interface EvalResult {
  accuracy: number;
  byCategory: Record<string, number>;
  total: number;
}

function detectRegression(
  current: EvalResult,
  baseline: EvalResult,
  threshold = 0.02  // 2%
): { regressed: boolean; details: string[] } {
  const details: string[] = [];
  
  // 总体检查
  if (current.accuracy < baseline.accuracy - threshold) {
    details.push(
      `Overall: ${(current.accuracy * 100).toFixed(1)}% < ${(baseline.accuracy * 100).toFixed(1)}% - ${threshold * 100}%`
    );
  }
  
  // 分类检查
  for (const [cat, currScore] of Object.entries(current.byCategory)) {
    const baseScore = baseline.byCategory[cat];
    if (baseScore === undefined) continue;
    if (currScore < baseScore - threshold) {
      details.push(
        `${cat}: ${(currScore * 100).toFixed(1)}% < ${(baseScore * 100).toFixed(1)}%`
      );
    }
  }
  
  return {
    regressed: details.length > 0,
    details,
  };
}
```

## 24.6 灰度评估

**灰度发布中的评估**

```
[新版本]
  ↓
[5% 流量]
  ↓
[评估指标]
  - 自动：成功率、延迟
  - LLM-as-Judge：质量
  - 用户：点赞/点踩
  ↓
[对比对照组（95% 旧版本）]
  ↓
[判定：扩大 / 缩小 / 回滚]
```

**评估代码**

```typescript
// canary-eval.ts
async function canaryEval(
  newVersion: string,
  oldVersion: string,
  traffic: number
): Promise<{ canaryWins: boolean; metrics: any }> {
  // 1. 跑 LLM-as-Judge
  const newResults = await evaluatePrompts(newVersion, canarySamples);
  const oldResults = await evaluatePrompts(oldVersion, canarySamples);
  
  // 2. 算胜率
  const newWins = newResults.filter(r => r.judge === 'new').length;
  const oldWins = newResults.filter(r => r.judge === 'old').length;
  const ties = newResults.filter(r => r.judge === 'tie').length;
  
  const totalJudged = newWins + oldWins + ties;
  const newWinRate = newWins / totalJudged;
  
  // 3. 算 P95 延迟
  const newP95 = percentile(newResults.map(r => r.latency), 0.95);
  const oldP95 = percentile(oldResults.map(r => r.latency), 0.95);
  
  // 4. 决策
  const canaryWins = newWinRate > 0.55 && newP95 <= oldP95 * 1.1;
  
  return {
    canaryWins,
    metrics: {
      newWinRate,
      newP95,
      oldP95,
      totalJudged,
    },
  };
}
```

## 24.7 评估结果展示

**报告生成**

```typescript
// generate-report.ts
import fs from "node:fs";

function generateReport(results: any[]): string {
  const total = results.length;
  const correct = results.filter(r => r.score > 0.7).length;
  const byCategory = groupBy(results, r => r.category);
  
  return `
# 评估报告 - ${new Date().toISOString().split("T")[0]}

## 总体
- 总样本：${total}
- 优秀样本：${correct} (${(correct / total * 100).toFixed(1)}%)

## 分类结果
| 类别 | 样本数 | 优秀率 | 平均分 |
|---|---|---|---|
${Object.entries(byCategory).map(([cat, items]) => `
| ${cat} | ${items.length} | ${(items.filter(r => r.score > 0.7).length / items.length * 100).toFixed(1)}% | ${(items.reduce((a, r) => a + r.score, 0) / items.length).toFixed(2)} |
`).join("")}

## 错误 Top 10
${results
  .filter(r => r.score < 0.3)
  .slice(0, 10)
  .map((r, i) => `${i + 1}. [${r.category}] ${r.input.slice(0, 50)}... → ${r.output.slice(0, 50)}`)
  .join("\n")}
`;
}
```

**Slack 通知**

```typescript
async function notifySlack(results: any) {
  await fetch(SLACK_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `📊 *每日评估报告* - ${new Date().toLocaleDateString()}\n` +
            `• 总样本：${results.total}\n` +
            `• 准确率：${(results.accuracy * 100).toFixed(1)}%\n` +
            `• 较昨日：${results.delta > 0 ? "+" : ""}${(results.delta * 100).toFixed(1)}%\n` +
            `• 详情：https://eval.yourcompany.com/report/${results.date}`,
    }),
  });
}
```

## 24.8 评估流水线架构

```
                    ┌────────────────┐
                    │  GitHub Repo   │
                    │   (PR / Push)  │
                    └────────┬───────┘
                             ↓
              ┌──────────────────────────────┐
              │    PR Eval (快速回归)        │
              │    50 题 / 5 分钟            │
              └──────────────┬───────────────┘
                             ↓
              ┌──────────────────────────────┐
              │    Daily Eval (全量)         │
              │    500 题 / 1 小时           │
              └──────────────┬───────────────┘
                             ↓
              ┌──────────────────────────────┐
              │    Pre-release (红队)        │
              │    1000 题 / 数小时          │
              └──────────────┬───────────────┘
                             ↓
              ┌──────────────────────────────┐
              │    Canary (生产灰度)         │
              │    5% 流量 / 1 周            │
              └──────────────┬───────────────┘
                             ↓
              ┌──────────────────────────────┐
              │    Full Rollout (全量)        │
              │    100% 流量                │
              └──────────────────────────────┘
```

## 24.9 实战：把评估集成到 React 项目

```json
// package.json
{
  "scripts": {
    "eval:quick": "tsx scripts/eval-quick.ts",
    "eval:full": "tsx scripts/eval-full.ts",
    "eval:compare": "tsx scripts/compare.ts"
  }
}
```

```typescript
// scripts/eval-quick.ts
import { execSync } from "child_process";
import fs from "node:fs";

async function main() {
  console.log("Running quick eval (50 samples)...");
  const start = Date.now();
  
  // 1. 准备 50 题
  const samples = JSON.parse(
    fs.readFileSync("data/quick-50.jsonl", "utf-8")
      .trim().split("\n").join(",")
  );
  
  // 2. 跑模型
  const results = [];
  for (const s of samples) {
    const r = await callMyModel(s.input);
    results.push({ ...s, output: r.output, score: r.score });
  }
  
  // 3. 输出
  const accuracy = results.filter(r => r.score > 0.7).length / results.length;
  console.log(`Done in ${((Date.now() - start) / 1000).toFixed(1)}s`);
  console.log(`Accuracy: ${(accuracy * 100).toFixed(1)}%`);
  
  // 4. 写到文件供 CI 读取
  fs.writeFileSync("eval-report.json", JSON.stringify({ accuracy, results }));
  
  // 5. 退出码
  if (accuracy < 0.85) process.exit(1);
}
main();
```

## 24.10 验收自测

1. **选择**：评估的 3 个时机不包括？
   - A. 每次 PR
   - B. 每日定时
   - C. 发版前
   - D. 每年一次

2. **简答**：为什么评估必须集成到 CI/CD？

3. **实操**：把 eval-quick 集成到你的 GitHub Actions。

## 24.11 📋 本章 Cheat Sheet

| 概念 | 一句话 | 详见 |
|---|---|---|
| 3 时机 | PR 5 分钟 / 每日 1 小时 / 发版全量 | §24.2 |
| PR 回归 | 200-500 题快速子集 | §24.3 |
| 每日定时 | cron + 完整基准 | §24.4 |
| 灰度评估 | 新模型 1% → 10% → 50% | §24.6 |
| 回归检测 | 分数波动 2-3 分告警 | §24.5 |
| 报告结构 | 总体/分类/错误 Top10 | §24.7 |


## 24.12 ⚠️ 5 个常见错误

1. **PR 跑全量评估** — PR 跑 1w 道题 2 小时,工程师失去耐心,只跑子集。
2. **每日定时不查结果** — cron 跑了不看 = 评估白做,结果要推到 Slack/邮件。
3. **灰度评估只看分数** — 灰度要看延迟/错误率/用户反馈,不只看分数。
4. **回归检测阈值过严** — 1 分波动就告警 = 噪声淹没问题,设 2-3 分阈值。
5. **结果展示只给数字** — 给错误样例 Top 10,工程师能直接定位问题。

## 24.13 延伸阅读

⭐⭐⭐
- [GitHub Actions: AI/ML Workflows](https://docs.github.com/en/actions/guides)
- [Continuous ML (CML)](https://cml.dev/)

⭐⭐
- [Weights & Biases: LLM Evaluation](https://docs.wandb.ai/guides)
- [MLOps Guide (Google)](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)

⭐
- [Vertex AI Evaluation](https://cloud.google.com/vertex-ai/docs/evaluation/overview)
- [SageMaker Clarify](https://aws.amazon.com/sagemaker/clarify/)
