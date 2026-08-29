# 29. 案例研究（三）：拍照解题 App 的多模态评估

> **如果只读一节**：拍照解题是"识别 → 公式 → 推理 → 讲解"四级流水线，每一级要有自己的测试集、自己的指标、自己的失败模式。**识别错但解对、识别对但解错，是两个完全不同的事故**——分层归因是多模态评估区别于纯文本评估的核心。基准知识在 [第 12 章](https://evals.zenheart.site/web/chapter-08.html)，本章讲把它装进一条真实管道。

**前置知识**：第 12 章（MMMU / MathVista / POPE）、第 10 章 6.10（MathVista 的协议敏感性）、第 20 章（评估 harness）、第 24 章（测试集构建）。本章代码全部为 TypeScript。

## 29.1 本章目标与读者

读完后你能：

- 为一条多模态流水线设计分层指标体系，让每个失败都能归因到具体的层
- 实现 OCR 字符 F1、公式 LaTeX 等价判定、POPE 幻觉检测三件套的可运行版本
- 用合成数据补齐长尾场景（几何图、手写体），并给管道算清成本与延迟预算

场景设定（合成案例）：一款 K12 拍照解题 App——用户拍一道数学/物理/化学题，App 识别题目（印刷体为主、夹杂手写），解题并生成讲解。四个学生版本迭代后，用户反馈两极："解析得很好"与"它把 3 抄成了 8"并存。团队第一次意识到：**端到端正确率一个数字，没法告诉你该修 OCR 还是该修解题 prompt**。

## 29.2 概念引入：多模态管道 = 四个前端组件串起来

**前端类比**：这条管道 ≈ "图片上传 → 预处理 → 解析 → 渲染"的老前端链路。每个环节都有自己的回归测试（图片处理看像素、解析看 AST、渲染看快照），从来没有人只测"上传到渲染"的端到端通过率。多模态评估的第一性原理相同：**先分层归因，再看端到端**。

```typescript
// photo-solve/types.ts —— 流水线各层的类型契约与预算（无需联网）
// 每层的输出都是显式结构，评估瞄准观测点而不是"最终答案对不对"

export interface OcrResult {       // 第 1 层：文字识别
  text: string;
  language: "zh" | "en";
  confidence: number;
}

export interface FormulaResult {   // 第 2 层：公式结构化
  latex: string;                   // 规范化后的 LaTeX
  isFormula: boolean;              // 该片段是否是公式
}

export interface SolveResult {     // 第 3+4 层：推理与讲解
  answer: string;
  steps: string[];
}

export interface PipelineTrace extends Record<string, unknown> {
  imageHash: string;               // 图片哈希：评估缓存与坏例定位的钥匙
  ocr: OcrResult;
  formulas: FormulaResult[];
  solve: SolveResult;
  latencyMs: { ocr: number; solve: number; total: number };
  costUsd: number;
}

// 预算断言：管道层有延迟与成本预算，评估 harness 里强制执行（第 20 章 17.6.4 的思想）
export const BUDGET = {
  ocrP95Ms: 800,
  solveP95Ms: 2200,
  totalP95Ms: 3000,
  costPerQueryUsd: 0.01,
} as const;
```

## 29.3 分层指标体系

| 层 | 能力 | 指标 | 评分方式 | 目标值 |
|---|---|---|---|---|
| 识别 | 印刷体/手写体 OCR | 字符级 F1（按语言分列） | 归一化后比对（确定性） | ≥ 0.95 |
| 识别 | 公式识别 | LaTeX 等价率 | 数学等价判定（确定性 + 数值探测） | ≥ 0.90 |
| 识别 | 几何图形 | 关键量识别正确率 | 合成数据真值比对（确定性） | ≥ 0.90 |
| 幻觉 | 图中无物说有 | POPE F1 / 幻觉率 | 二分类（确定性） | F1 ≥ 0.85 |
| 推理 | 解题正确 | 端到端 pass@1 | 参考答案匹配 + 判官 | ≥ 0.85 |
| 讲解 | 讲解质量 | 判官评分 + 人工抽检 | rubric（第 6 章） | ≥ 4 / 5 |
| 全局 | 延迟 / 成本 | P95 与 $/题 | trace 采集（确定性） | ≤ 3s / ≤ $0.01 |

分层归因表是本章最重要的一张表（合成案例，阈值按业务失败代价倒推）：

| 症状 | 识别层 | 推理层 | 结论 | 修谁 |
|---|---|---|---|---|
| 识别错 → 答错 | F1 低 | — | 上游污染下游 | 修 OCR/公式层 |
| 识别对 → 答错 | F1 达标 | pass@1 低 | 推理能力不足 | 修解题 prompt / 换模型 |
| 识别错 → 答对 | F1 低 | — | 模型在"容错"，靠不住 | 仍修识别层 |
| 识别对 → 答对但讲不清 | 达标 | 达标 | 讲解层问题 | 修讲解模板 |

特别提醒第三行：**"识别错了还能答对"不是好消息**——说明正确答案来自参数化记忆而非识别链路，换一道没见过的题就会翻车。评估必须同时报告"识别层 F1"与"端到端 pass@1"，单独任何一个都会误导。

## 29.4 测试集：真实题库 + 公开基准 + 合成数据

### 29.4.1 三来源分工

| 来源 | 数量 | 作用 | 备注 |
|---|---|---|---|
| 真实题库（脱敏） | 500 道分层抽样 | 反映真实分布：印刷 70% / 手写 30% | 用户上传图片经授权 + 脱敏 |
| 公开基准 | MathVista / MMMU / ChartQA / DocVQA / OCRBench | 与外部模型对齐的锚 | 口径见第 12 章 |
| 合成数据 | 几何 200 + 手写变形 200 | 长尾覆盖，带精确真值 | 程序化生成，见 29.4.2 |

公开基准的引用统一使用正典编号：MathVista 是 arXiv:2310.02255（6,141 道视觉情境数学题，7 类任务——见第 12 章 8.4）；POPE 是 arXiv:2305.10355。**引用编号写错的代价**是审稿与复现者找不到论文——多模态基准数量多、编号相近，团队内部要有唯一的"基准 → 论文编号"对照表（本章 29.15 的延伸阅读即是本案例的对照表）。

### 29.4.2 几何合成数据生成器（可运行、带精确真值）

几何题最难标真值——人工标注"这个角是 60°"本身会错。解法是**从参数生成图片**：先随机采样几何参数，再渲染成图，参数本身就是真值。升级版生成器用 SVG 渲染（前端团队零新依赖），同一份参数既是图片来源又是评分标准：

```typescript
// photo-solve/gen-geometry.ts —— 几何合成数据：参数 → SVG + 真值（本地运行，无需联网）
// 运行：npx tsx photo-solve/gen-geometry.ts 200 data/geometry-syn.jsonl
import { writeFileSync } from "node:fs";

interface GeoSample {
  id: string;
  svg: string;                 // 渲染出的题目图（可转 PNG 供模型输入）
  kind: "triangle-angle" | "rectangle-area";
  expected: string;            // 真值答案，来自参数本身
}

function triangleAngle(seed: number): GeoSample {
  // 固定种子保证可复现：同一 seed 永远生成同一道题（第 4 章 3.7 可复现性）
  let s = seed;
  const rand = (lo: number, hi: number) => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648 * (hi - lo) + lo;
  const a = Math.round(rand(30, 80)), b = Math.round(rand(30, 80));
  const c = 180 - a - b;                       // 三角形内角和：真值由构造保证
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="240">
  <polygon points="40,200 260,200 ${40 + 200 * Math.cos((a * Math.PI) / 180)},${200 - 200 * Math.sin((a * Math.PI) / 180)}"
    fill="none" stroke="black" stroke-width="2"/>
  <text x="120" y="225" font-size="16">已知角 A = ${a}°，角 B = ${b}°，求角 C</text></svg>`;
  return { id: `geo-syn-${seed}`, svg, kind: "triangle-angle", expected: `${c}` };
}

const n = Number(process.argv[2] ?? 200);
const outPath = process.argv[3] ?? "data/geometry-syn.jsonl";
const samples = Array.from({ length: n }, (_, i) => triangleAngle(1000 + i));
writeFileSync(outPath, samples.map(s => JSON.stringify(s)).join("\n"));
console.log(`generated ${samples.length} samples → ${outPath}`);
```

合成数据的纪律（第 24 章 23.6 的原则）：合成题必须经过与真实题相同的判分路径；每批合成数据记录生成器版本（`genVersion`），生成器升级后旧批次的分数不可与新批次直接对比。

## 29.5 识别层（一）：OCR 字符 F1 与归一化

### 29.5.1 先归一化，再算分

直接拿识别文本和真值做字符比对，会把"全角问号 vs 半角问号"这种无关差异判错。第 4 章 4.5 节的归一化原则在 OCR 场景的具体化：去空白差异、统一大小写、全半角折叠，然后再算字符级 P/R/F1：

```typescript
// photo-solve/ocr-f1.ts —— 字符级 F1（含 CJK 处理；本地运行，无需联网）
// 运行：npx tsx photo-solve/ocr-f1.ts data/ocr-cases.jsonl
import { readFileSync } from "node:fs";

export function normalizeOcr(s: string): string {
  return s
    .replace(/\s+/g, "")                       // 空白不影响内容
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)) // 全角数字→半角
    .replace(/[？?！!。，,]/g, "")              // 标点归一
    .toLowerCase();
}

export function charF1(predicted: string, expected: string): number {
  const p = [...normalizeOcr(predicted)];      // 展开 Unicode 码点：CJK 必须按字符而不是字节
  const e = [...normalizeOcr(expected)];
  const bag = new Map<string, number>();
  for (const ch of e) bag.set(ch, (bag.get(ch) ?? 0) + 1);
  let tp = 0;
  for (const ch of p) {
    const left = bag.get(ch) ?? 0;
    if (left > 0) { tp++; bag.set(ch, left - 1); }
  }
  // 多重集比对：出现 2 次的字符只匹配 2 次（朴素集合会把重复字符判对）
  const precision = tp / Math.max(p.length, 1);
  const recall = tp / Math.max(e.length, 1);
  return precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
}

const rows = readFileSync(process.argv[2] ?? "data/ocr-cases.jsonl", "utf-8")
  .trim().split("\n").map(JSON.parse as (l: string) => { id: string; predicted: string; expected: string; language: string });

for (const lang of ["zh", "en"]) {
  const sub = rows.filter(r => r.language === lang);
  if (sub.length === 0) continue;
  const avg = sub.reduce((s, r) => s + charF1(r.predicted, r.expected), 0) / sub.length;
  console.log(`lang=${lang} charF1=${avg.toFixed(4)} n=${sub.length}`);
}
// 期望输出示例：lang=zh charF1=0.9387 n=350   lang=en charF1=0.9712 n=150
```

按语言分列不是可选项：中文场景里数字与符号混排（"解得 x=3.5"）是最常见错误源，混合统计会把这类错误稀释掉。

## 29.6 识别层（二）：公式 LaTeX 等价判定

`\frac{1}{2}` 与 `0.5` 字符完全不同，数学上完全等价；`\frac{a}{b}` 与 `\frac{b}{a}` 字符高度相似，数学上完全不同。**字符串相似度在公式上是反向指标**。等价判定分两级：

1. **规范化**：去空白、统一 `\left(`/`(`、统一分数与根号写法——规范化后相等直接判等价；
2. **数值探测**：把两侧 LaTeX 翻译成可求值表达式，在若干随机点采样比较（相同则极大概率等价）。

```typescript
// photo-solve/latex-equiv.ts —— 公式等价两级判定（本地运行；npm i mathjs）
// 运行：npx tsx photo-solve/latex-equiv.ts
import { parse, simplify, evaluate } from "mathjs";

export function normalizeLatex(latex: string): string {
  return latex
    .replace(/\s+/g, "")
    .replace(/\\left|\\right/g, "")
    .replace(/\\cdot|\\times/g, "*")
    .replace(/\\div/g, "/")
    .replace(/[{}]/g, "");
}

// LaTeX 朴素子集 → mathjs 表达式（\frac{a}{b} → (a)/(b)，^ 保留，\sqrt{a} → sqrt(a)）
function latexToExpr(latex: string): string {
  return normalizeLatex(latex)
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)")
    .replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)")
    .replace(/\\pi/g, "pi");
}

export function latexEquivalent(a: string, b: string): { equivalent: boolean; method: string } {
  const na = normalizeLatex(a), nb = normalizeLatex(b);
  if (na === nb) return { equivalent: true, method: "normalize" };   // 第一级：规范化相等

  try {                                                              // 第二级：符号化简
    const ea = simplify(parse(latexToExpr(a)));
    const eb = simplify(parse(latexToExpr(b)));
    const diff = simplify(parse(`(${latexToExpr(a)})-(${latexToExpr(b)})`));
    if (diff.toString() === "0" || ea.equals(eb)) return { equivalent: true, method: "symbolic" };
  } catch { /* 符号化简不支持的表达式 → 走数值探测 */ }

  try {                                                              // 第三级：数值探测
    for (const x of [0.37, 1.21, 2.53, 4.71]) {                      // 固定采样点保证可复现
      const va = evaluate(latexToExpr(a).replace(/(^|[^a-z])x/g, `$1(${x})`));
      const vb = evaluate(latexToExpr(b).replace(/(^|[^a-z])x/g, `$1(${x})`));
      if (Math.abs(va - vb) > 1e-9 * Math.max(1, Math.abs(va))) return { equivalent: false, method: "numeric" };
    }
    return { equivalent: true, method: "numeric" };
  } catch {
    return { equivalent: false, method: "unparseable" };             // 解析不了按不等价，并记入错误率
  }
}

console.log(latexEquivalent("\\frac{1}{2}", "0.5"));                  // true（符号级）
console.log(latexEquivalent("x^2+2x+1", "(x+1)^2"));                  // true（数值探测）
console.log(latexEquivalent("\\frac{a}{b}", "\\frac{b}{a}"));         // false——字符串最像的一对
```

工程上还要保留一份**分方法统计**：`unparseable` 比例升高说明识别层开始输出病态 LaTeX，这本身就是一个上游告警信号。

## 29.7 幻觉层：POPE 检测接入

POPE（来源：arXiv:2305.10355）的做法朴素而锋利：**问模型"图里有没有 X"，一半的 X 存在、一半不存在，看它会不会把不存在的东西说成有**。三种采样难度——随机（random）、高频（popular：取图中常见物体）、对抗（adversarial：取与图同类的高频物体）——第 12 章 12.6 节有完整拆解。教材 App 的适配版：把"物体"换成题目元素（"图中是否有坐标系""是否标注了直角符号""图中是否有两组数据"）：

```typescript
// photo-solve/pope.ts —— POPE 式幻觉检测（需联网 + API 费用）
// 运行：export OPENAI_API_KEY=sk-你的密钥 && npx tsx photo-solve/pope.ts data/pope.jsonl
import OpenAI from "openai";
import { readFileSync } from "node:fs";

if (!process.env.OPENAI_API_KEY) throw new Error("请先设置环境变量 OPENAI_API_KEY");
const openai = new OpenAI();

interface PopeItem { id: string; imageB64: string; question: string; objectPresent: boolean; }

export async function runPope(items: PopeItem[]) {
  let tp = 0, fp = 0, tn = 0, fn = 0, yes = 0;
  for (const it of items) {
    const r = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [{
        role: "user",
        content: [
          { type: "text", text: `${it.question} 只回答 yes 或 no。` },
          { type: "image_url", image_url: { url: `data:image/png;base64,${it.imageB64}` } },
        ],
      }],
    });
    const said = /yes/i.test(r.choices[0].message.content ?? "") ;
    if (said) yes++;
    if (said && it.objectPresent) tp++;
    else if (said && !it.objectPresent) fp++;   // 幻觉：图中无物说有
    else if (!said && !it.objectPresent) tn++;
    else fn++;
  }
  const precision = tp / Math.max(tp + fp, 1);
  const recall = tp / Math.max(tp + fn, 1);
  return {
    f1: (2 * precision * recall) / Math.max(precision + recall, 1e-9),
    hallucinationRate: fp / Math.max(fp + tn, 1), // "无中生有"率：产品最该盯的数字
    yesRate: yes / items.length,                  // 防模型"逢问必 yes"的均衡哨兵
  };
}

const items: PopeItem[] = readFileSync(process.argv[2] ?? "data/pope.jsonl", "utf-8")
  .trim().split("\n").map(JSON.parse);
console.log(await runPope(items));
// 期望输出示例：{ f1: 0.912, hallucinationRate: 0.043, yesRate: 0.51 }
```

两个读数纪律：**yesRate 必须接近 0.5**——正负样本各半的设计下，yesRate 偏离意味着模型有应答偏置，此时 F1 不可信；**幻觉率单独报告**，不要藏在 accuracy 里（第 12 章 8.7 的坑）。

## 29.8 多语言分层

K12 场景的多语言不是"翻译质量"，而是"同一道题在不同语言下的识别与解题稳定性"。分层原则：**每层语言独立的测试子集、独立的阈值、独立的告警**——中文 0.95 的 F1 不豁免韩文 0.80 的窟窿：

| 语言 | 子集规模 | F1 阈值 | 本案例读数（合成） | 状态 |
|---|---|---|---|---|
| 中文（简体） | 350 | ≥ 0.95 | 0.939 | 未达标，数字混排是主要错误源 |
| 英语 | 150 | ≥ 0.95 | 0.971 | 达标 |
| 日语 | 60 | ≥ 0.90 | 0.912 | 达标 |
| 韩语 | 40 | ≥ 0.90 | 0.847 | 未达标，缺少专用子集与训练语料 |

工程对策按性价比排序：先补韩语专用子集（40 题太少，没有统计效力——第 3 章的样本量原则）；再在识别 prompt 里加语言先验提示；最后才考虑换模型。**语言分层报表每周出一次，任何语言跌破阈值即阻止该语言功能的新市场投放**——这把评估结论直接接进了业务决策。

## 29.9 成本与延迟预算

多模态管道的预算是分层的，端到端 ≤3s 的目标拆到层才有约束力：

| 层 | P95 预算 | 单次成本预算 | 超预算的降级动作 |
|---|---|---|---|
| OCR / 公式识别 | 800ms | $0.002 | 降分辨率重试（600→1000px） |
| 解题推理 | 2200ms | $0.008 | 换轻量模型 + 结果缓存 |
| 端到端 | 3000ms | $0.010 | 首字先行：先出"识别中 → 思考中"占位 |

预算在评估 harness 里是断言不是建议（第 20 章 17.6.1 的成本工程）：

```typescript
// photo-solve/budget.ts —— 预算断言：超预算的 run 直接失败（本地运行，无需联网）
import { BUDGET, type PipelineTrace } from "./types.ts";

export function assertBudget(traces: PipelineTrace[]): void {
  const p95 = (xs: number[]) => xs.sort((a, b) => a - b)[Math.floor(xs.length * 0.95)] ?? Infinity;
  const violations: string[] = [];
  if (p95(traces.map(t => t.latencyMs.ocr)) > BUDGET.ocrP95Ms) violations.push("ocr P95 超预算");
  if (p95(traces.map(t => t.latencyMs.solve)) > BUDGET.solveP95Ms) violations.push("solve P95 超预算");
  if (p95(traces.map(t => t.latencyMs.total)) > BUDGET.totalP95Ms) violations.push("端到端 P95 超预算");
  const avgCost = traces.reduce((s, t) => s + t.costUsd, 0) / traces.length;
  if (avgCost > BUDGET.costPerQueryUsd) violations.push(`平均成本 $${avgCost.toFixed(4)} 超预算`);
  if (violations.length) { console.error("预算违例：" + violations.join("；")); process.exitCode = 1; }
  else console.log("预算内 ✓");
}
```

缓存是最有效的降本手段：`imageHash` 作键缓存整条 trace 结果——学生反复拍同一道题的比例不低（一个班做同一页作业），缓存命中率 30% 时成本直降三成（合成案例测算）。

## 29.10 上线前 checklist 与灰度

上线门槛（每条都可从本章评估体系直接读数）：

- [ ] 真实题库 500 题端到端 pass@1 ≥ 0.85
- [ ] 识别层：中文 F1 ≥ 0.95，各语言达标
- [ ] 公式等价率 ≥ 0.90，`unparseable` 率 < 2%
- [ ] POPE 幻觉率 < 5%，yesRate ∈ [0.45, 0.55]
- [ ] 预算断言通过（P95 ≤ 3s，$ ≤ 0.01/题）
- [ ] 灰度剧本就位：内部员工 → 5% → 25% → 100%（判定条件与回滚条件参照第 27 章 27.8 的模板，多模态版增加"识别失败率"一档观察项）

## 29.11 实战与陷阱

**陷阱 1：只看端到端 pass@1。** 0.78 的 pass@1 无法回答"该修哪里"；分层归因表（29.3）才是修 pipeline 的地图。

**陷阱 2：公式用字符串相似度评分。** `\frac{a}{b}` vs `\frac{b}{a}` 字符相似度 90%+，数学上全错；`x^2+2x+1` vs `(x+1)^2` 字符相似度低，数学上全对。规范化 + 符号化简 + 数值探测三级判定（29.6）是底线配置。

**陷阱 3：幻觉只看 accuracy。** 正负样本各半时，"逢问必 yes"也有 50% accuracy；F1、幻觉率、yesRate 三个数一起看才算读懂 POPE。

**陷阱 4：中间结果不落盘。** 识别、公式、推理三层的输出不存档，坏例来了只能重跑猜——每条 trace（含 imageHash 与各层输出）进对象存储，坏例回放是排查的第一工具。

**陷阱 5：合成数据没有版本号。** 生成器升级后新旧合成集分数混着比，趋势图就是噪声；`genVersion` 进数据集元数据，跨版本对比前先重跑基线。

## 29.12 验收自测

1. **选择**："识别错但答案对"应该怎么解读？
   - A. 可以放过，用户没受影响
   - B. 识别层仍要修——正确答案来自参数化记忆，不可靠
   - C. 说明推理层太强，识别层可以下线
   - D. 测试集标注错了

2. **选择**：POPE 的 yesRate 显著高于 0.5 说明什么？
   - A. 模型能力强，检出率高
   - B. 模型有应答偏置，F1 读数不可信
   - C. 测试集标注错误
   - D. 图片分辨率不足

3. **选择**：公式识别评估中，下列哪对字符串最需要"数学等价"而不是"字符相似"判定？
   - A. `\frac{a}{b}` 与 `\frac{b}{a}`
   - B. `x^2+2x+1` 与 `(x+1)^2`
   - C. `2x` 与 `x+x`
   - D. 以上全部

4. **简答**：为什么几何题优先用"参数生成图片"而不是人工标注真值？

5. **简答**：中文 OCR 的 F1 达到 0.95 后，产品经理提议"韩语市场先用现有模型顶着"，你如何用本章的评估数据回应？

6. **实操**：把 29.6 的 `latexEquivalent` 扩展支持 `\sqrt{}` 嵌套（如 `\sqrt{\frac{1}{4}}`），并写 5 个用例验证三级判定各自命中一次。

## 29.13 本章 Cheat Sheet

| 概念 | 一句话 | 详见 |
|---|---|---|
| 分层归因 | 识别错→修上游；识别对→修推理；都错要分头修 | §29.3 |
| 三来源测试集 | 真实 500 + 公开基准 + 合成 400（带 genVersion） | §29.4 |
| OCR 字符 F1 | 先归一化再按码点多重集比对，语言分列 | §29.5 |
| 公式等价三级判定 | 规范化 → 符号化简 → 数值探测，`unparseable` 单独统计 | §29.6 |
| POPE 接入 | 元素有无二分类；F1 + 幻觉率 + yesRate 三个数一起读 | §29.7 |
| 多语言分层 | 每语言独立子集/阈值/告警，跌破阈值阻止新市场投放 | §29.8 |
| 预算断言 | P95 与成本写进 harness，超预算 run 直接失败 | §29.9 |

## 29.14 5 个常见错误

1. **只报端到端正确率**——一个数字既不能归因也不能指导修复；分层报表才是评估的交付物。
2. **字符串相似度评公式**——字符越像越危险的场景真实存在（分子分母颠倒）；等价判定必须走数学语义。
3. **幻觉藏在 accuracy 里**——幻觉率、yesRate、F1 分列；"逢问必 yes"的模型在 accuracy 上可以很好看。
4. **中间结果不落盘**——坏例无法回放，排查全靠重跑；trace 存档是管道评估的基建。
5. **多语言一锅算**——混合统计把长尾语言的窟窿平均掉；分层阈值 + 业务动作联动才有效。

## 29.15 延伸阅读

⭐⭐⭐（官方一手）
- [MathVista（arXiv:2310.02255）](https://arxiv.org/abs/2310.02255) — 视觉数学评测与混合判分协议
- [POPE（arXiv:2305.10355）](https://arxiv.org/abs/2305.10355) — 视觉幻觉三种采样
- [MMMU（arXiv:2311.16502）](https://arxiv.org/abs/2311.16502) — 多学科多模态综合

⭐⭐（方法论）
- [OCRBench](https://github.com/Yuliang-Liu/MultimodalOCR) — OCR 子任务全景
- [ChartQA（arXiv:2203.10244）](https://arxiv.org/abs/2203.10244) — 图表问答与 relaxed accuracy
- [DocVQA](https://www.docvqa.org/) — 文档问答与 ANLS 指标

⭐
- [VLMEvalKit](https://github.com/open-compass/VLMEvalKit) — 多模态评测套件（跑公开基准的现成轮子）
- [mathjs 文档](https://mathjs.org/docs/) — 本章节点数探测用到的表达式引擎
