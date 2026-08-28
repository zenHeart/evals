# 17. 用 Node.js 30 行自建 Mini Evaluator

> **如果只读一节**：评估就是 (1) 题目 (2) 模型 (3) 评分 (4) 汇总。30 行 TypeScript 跑通一个完整流程。

## 17.1 本章目标

读完后你能：

- 30 行代码自建一个 mini evaluator
- 100 行代码支持并发、缓存、重试
- 200 行代码支持多种 metric
- 知道什么时候该用框架 vs 自建

## 17.2 30 行版本

```typescript
import OpenAI from "openai";
import fs from "node:fs";

const openai = new OpenAI();

const tasks = fs.readFileSync("data.jsonl", "utf-8")
  .trim().split("\n").map(l => JSON.parse(l));

let correct = 0;
for (const t of tasks) {
  const r = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: t.input }],
  });
  if (r.choices[0].message.content?.trim() === t.expected) correct++;
}
console.log(`Accuracy: ${(correct / tasks.length * 100).toFixed(1)}%`);
```

**这就是完整评估的最小可行版本。**

## 17.3 100 行版本：工程化

```typescript
// mini-eval.ts — 支持并发、缓存、重试、报告
import OpenAI from "openai";
import fs from "node:fs";
import pLimit from "p-limit";
import { LRUCache } from "lru-cache";

const openai = new OpenAI();
const MODEL = "gpt-4o-mini";

// 1. 缓存
const cache = new LRUCache<string, string>({ max: 10000, ttl: 24 * 3600 * 1000 });

// 2. 重试
async function callWithRetry(prompt: string, retries = 3): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      if (cache.has(prompt)) return cache.get(prompt)!;
      const r = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      });
      const out = r.choices[0].message.content ?? "";
      cache.set(prompt, out);
      return out;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error("unreachable");
}

// 3. 评分函数
function exactMatch(output: string, expected: string): boolean {
  return output.trim() === expected.trim();
}

// 4. 加载数据集
interface Task { id: string; input: string; expected: string; category?: string; }
const tasks: Task[] = fs.readFileSync("data.jsonl", "utf-8")
  .trim().split("\n").map(l => JSON.parse(l));

// 5. 并发运行
const limit = pLimit(10);
const results = await Promise.all(
  tasks.map(t => limit(async () => {
    const output = await callWithRetry(t.input);
    return { ...t, output, correct: exactMatch(output, t.expected) };
  }))
);

// 6. 报告
const total = results.length;
const correct = results.filter(r => r.correct).length;
const byCategory: Record<string, { total: number; correct: number }> = {};
for (const r of results) {
  const cat = r.category ?? "default";
  byCategory[cat] ??= { total: 0, correct: 0 };
  byCategory[cat].total++;
  if (r.correct) byCategory[cat].correct++;
}

console.log(`\n=== Eval Report ===`);
console.log(`Model: ${MODEL}, Total: ${total}, Correct: ${correct}, Acc: ${(correct/total*100).toFixed(1)}%`);
for (const [cat, s] of Object.entries(byCategory)) {
  console.log(`  ${cat}: ${(s.correct/s.total*100).toFixed(1)}% (${s.correct}/${s.total})`);
}

// 7. 保存原始结果
fs.writeFileSync("results.jsonl", results.map(r => JSON.stringify(r)).join("\n"));
```

**这 100 行支持**：
- 缓存（省钱）
- 重试（容错）
- 并发（速度）
- 分类报告（洞察）
- 原始结果保存（可分析）

## 17.4 200 行版本：多 metric + 多 provider

```typescript
// 支持多 metric + 多 LLM provider
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import pLimit from "p-limit";

// 1. 多 provider 抽象
interface Provider {
  name: string;
  generate(prompt: string): Promise<string>;
}

const openaiProvider: Provider = {
  name: "openai",
  async generate(prompt) {
    const r = await new OpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });
    return r.choices[0].message.content ?? "";
  }
};

const anthropicProvider: Provider = {
  name: "anthropic",
  async generate(prompt) {
    const r = await new Anthropic().messages.create({
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });
    return r.content[0].text;
  }
};

// 2. 多 metric
type Metric = (output: string, expected: string) => boolean | number;

const metrics: Record<string, Metric> = {
  exact: (o, e) => o.trim() === e.trim(),
  contains: (o, e) => o.includes(e),
  number: (o, e) => {
    const num = o.match(/-?\d+\.?\d*/)?.[0];
    return num === e;
  },
  fuzzy: (o, e) => {
    // 编辑距离相似度
    const d = levenshtein(o.toLowerCase().trim(), e.toLowerCase().trim());
    return 1 - d / Math.max(o.length, e.length);
  },
};

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const m: number[][] = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] = b.charAt(i-1) === a.charAt(j-1)
        ? m[i-1][j-1]
        : Math.min(m[i-1][j-1]+1, m[i][j-1]+1, m[i-1][j]+1);
    }
  }
  return m[b.length][a.length];
}

// 3. 主流程
async function run(provider: Provider, metric: Metric, dataPath: string) {
  const tasks = fs.readFileSync(dataPath, "utf-8")
    .trim().split("\n").map(l => JSON.parse(l));
  
  const limit = pLimit(10);
  const results = await Promise.all(
    tasks.map(t => limit(async () => {
      const output = await provider.generate(t.input);
      return { id: t.id, output, expected: t.expected, score: metric(output, t.expected) };
    }))
  );
  
  const total = results.length;
  const correct = results.filter(r => r.score === 1 || r.score === true).length;
  return { provider: provider.name, total, correct, accuracy: correct / total };
}

// 4. 多 provider 对比
const results = await Promise.all([
  run(openaiProvider, metrics.exact, "data.jsonl"),
  run(anthropicProvider, metrics.exact, "data.jsonl"),
]);
console.table(results);
```

## 17.5 vs 框架：什么时候用哪个

| 场景 | 用什么 |
|---|---|
| 跑 1 个公开基准（MMLU） | lm-eval-harness |
| 跑 10+ 公开基准 | lm-eval-harness / OpenCompass |
| 自定义业务评估 | 自建（参考本章） |
| RAG 评估 | RAGAS |
| Agent 评估 | Inspect AI |
| 红队 | Garak |

**自建的 4 个理由**：
1. **业务数据私密**（不能上传框架）
2. **评估逻辑特殊**（框架不支持）
3. **需要嵌入 CI/CD**（轻量集成）
4. **学习原理**（造轮子才能理解轮子）

## 17.6 集成 GitHub Actions

```yaml
# .github/workflows/eval.yml
name: Daily Eval
on:
  schedule:
    - cron: '0 0 * * *'  # 每天 0 点
  workflow_dispatch:

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci --ignore-scripts
      - run: npm run eval
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      - uses: actions/upload-artifact@v4
        with:
          name: eval-report
          path: eval-report.json
```

## 17.7 实战：把它接入到 React 项目

```typescript
// eval.ts - 评估"前端代码生成质量"
import { execSync } from "child_process";
import fs from "node:fs";
import OpenAI from "openai";

const openai = new OpenAI();

const components = [
  { name: "Button", spec: "Create a Button component with primary, secondary, danger variants" },
  { name: "Modal", spec: "Create a Modal component with overlay, close button, accessible focus trap" },
  { name: "Tabs", spec: "Create a Tabs component with keyboard navigation and ARIA attributes" },
];

// 1. 生成代码
for (const c of components) {
  const r = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "system",
      content: "You are a senior frontend engineer. Write production-ready React + TypeScript code."
    }, { role: "user", content: c.spec }],
  });
  fs.writeFileSync(`./generated/${c.name}.tsx`, r.choices[0].message.content);
}

// 2. 跑 TypeScript 编译检查
let compileErrors = 0;
for (const c of components) {
  try {
    execSync(`npx tsc --noEmit ./generated/${c.name}.tsx`);
  } catch (e) {
    compileErrors++;
  }
}

// 3. 跑单元测试（如果写了）
let testsPassed = 0;
for (const c of components) {
  try {
    execSync(`npm test -- ${c.name}`);
    testsPassed++;
  } catch {}
}

console.log(`\n=== Frontend Component Eval ===`);
console.log(`Components: ${components.length}`);
console.log(`TypeScript compile: ${components.length - compileErrors}/${components.length}`);
console.log(`Tests passed: ${testsPassed}/${components.length}`);
```

## 17.8 验收自测

1. **选择**：30 行评估代码最少需要哪 3 个组件？
   - A. 数据集 + 评分函数 + 报告
   - B. 数据集 + 模型推理 + 评分
   - C. 模型推理 + 评分 + 缓存
   - D. 数据集 + 模型推理 + 评分 + 报告

2. **简答**：什么时候该自建 evaluator vs 用框架？

3. **实操**：把 30 行版本跑通你的业务问题（如"评估模型能否正确生成 React useState 代码"）。

## 17.9 延伸阅读

⭐⭐⭐
- [OpenAI Cookbook: Evaluation](https://cookbook.openai.com/examples/evaluation)
- [Anthropic: Building Effective Agents](https://docs.anthropic.com/en/docs/build-with-claude/building-effective-agents)

⭐⭐
- [DeepEval: LLM Evaluation Framework](https://docs.confident-ai.com/)
- [Promptfoo: LLM Testing](https://promptfoo.dev/docs/intro)

⭐
- [Vercel AI SDK Eval](https://sdk.vercel.ai/docs/foundations/evals)
- [LangChain Evaluation](https://python.langchain.com/docs/guides/evaluation/)
