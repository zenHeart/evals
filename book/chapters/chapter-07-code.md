# 7. 代码能力基准

> **如果只读一节**：HumanEval = 编程入门题，MBPP = 简单问题，SWE-bench = 真实 GitHub Issue。SWE-bench 是当前代码评估的金标准。

## 7.1 本章目标

读完后你能：

- 区分 HumanEval / MBPP / LiveCodeBench / SWE-bench 的能力维度
- 知道 Spider / BIRD 是 Text-to-SQL 专项
- 知道 BFCL 测函数调用，DS-1000 测数据科学
- 跑一次 HumanEval 评估

## 7.2 代码评估的 5 个层级

| 层级 | 测什么 | 代表基准 | 难度 |
|---|---|---|---|
| L1 | 单函数补全 | HumanEval, MBPP | ⭐ |
| L2 | 简单算法 | APPS, CodeContests | ⭐⭐ |
| L3 | 真实工程 | SWE-bench, RepoBench | ⭐⭐⭐ |
| L4 | 数据科学 | DS-1000 | ⭐⭐ |
| L5 | 数据库/SQL | Spider, BIRD | ⭐⭐ |

## 7.3 HumanEval — 编程入门

### 一句话定义

> 164 道手写 Python 函数题。**让模型补全函数体。**

### 真实样例（HumanEval/0）

```python
def has_close_elements(numbers: List[float], threshold: float) -> bool:
    """ Check if in given list of numbers, are any two numbers closer to each other than
    given threshold.
    >>> has_close_elements([1.0, 2.0, 3.0], 0.5)
    False
    >>> has_close_elements([1.0, 2.8, 3.0, 4.0, 5.0, 2.0], 0.3)
    True
    """
```

### 评分方式

```typescript
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile, mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

const execAsync = promisify(exec);

async function humanevalScore(
  problem: { prompt: string; test: string; entryPoint: string },
  modelCompletion: string
): Promise<boolean> {
  const tmpDir = await mkdtemp(join(tmpdir(), "humaneval-"));
  try {
    const fullCode = problem.prompt + modelCompletion + "\n" + problem.test + `\ncheck(${problem.entryPoint})`;
    const file = join(tmpDir, "solution.py");
    await writeFile(file, fullCode);
    const { stdout } = await execAsync(`python3 ${file}`, { cwd: tmpDir });
    return stdout.trim() === "PASSED";
  } catch (e) {
    return false;
  } finally {
    await rm(tmpDir, { recursive: true });
  }
}
```

**关键**：**真的执行代码**，不是字符串匹配。

### pass@k 指标

> pass@k = 尝试 k 次，至少 1 次通过的概率。

```typescript
function passAtK(n: number, c: number, k: number): number {
  // n = 总样本数，c = 通过数
  if (n - c < k) return 1.0;
  return 1.0 - comb(n - c, k) / comb(n, k);
}
```

`pass@1`（一次就对）= 主流指标。
`pass@10`（10 次里 1 次对）= 反映"探索能力"。

### 当前 SOTA

| 模型 | HumanEval pass@1 |
|---|---|
| GPT-4o | 90.2% |
| Claude 3.5 Sonnet | 92.0% |
| DeepSeek-Coder-V2 | 90.0% |
| Qwen2.5-Coder-32B | 92.0% ⭐ |
| Llama 3.1-405B | 89.0% |

**已被刷到 90%+，区分度下降。**

## 7.4 MBPP — Mostly Basic Python Problems

### 一句话定义

> 974 道 Python 入门题，更接近"真实编程课作业"。

**与 HumanEval 区别**：

| HumanEval | MBPP |
|---|---|
| 函数签名固定 | 给自然语言描述，自己写 |
| 164 题 | 974 题 |
| 风格学术 | 风格实用 |

### 样例

> **题目**：编写一个 Python 函数 `count_vowels(s)`，返回字符串 `s` 中元音字母的个数。
> **测试**：`assert count_vowels("hello") == 2`

## 7.5 LiveCodeBench — 持续更新的编程题

### 为什么需要

> HumanEval/MBPP 训练数据里**大量存在**（2021 年前的题），分数虚高。

**LiveCodeBench** 解决思路：
- **持续从 LeetCode、Codeforces 抓新题**
- 每月更新
- 题目时间戳标注 → 防止"训练在测试之后"

### 规模与频率

- 题目数：~500+
- 来源：LeetCode Weekly, Codeforces Round, AtCoder
- 更新频率：每月

### 当前 SOTA（2026 年初）

| 模型 | LiveCodeBench pass@1 |
|---|---|
| GPT-4o | 72.0% |
| Claude 3.5 Sonnet | 75.0% |
| DeepSeek-Coder-V2 | 78.0% ⭐ |
| Qwen2.5-Coder-32B | 76.0% |

## 7.6 SWE-bench — 真实 GitHub Issue 修复

### 一句话定义

> 给定一个 GitHub Issue，模型要从代码库中**修改多个文件**来修复它。**当前代码评估的金标准。**

### 流程

```
1. 选一个 GitHub 仓库（如 Django）
2. 找有 PR 关闭的 Issue
3. 把代码库 checkout 到 Issue 提交前的状态
4. 给模型 Issue 描述 + 代码库
5. 模型生成 patch（修改文件）
6. 应用 patch
7. 跑仓库的测试
8. 看测试是否通过
```

### 真实样例（Django 框架）

> **Issue**：DateInput widget 在显示非 ISO 格式时崩溃
> **模型要做的**：
> 1. 找到 `django/forms/widgets.py` 中 `DateInput` 类
> 2. 找到 format 错误的位置
> 3. 修改代码处理非 ISO 格式
> 4. 生成 patch
> 5. 跑测试 `tests/forms_tests/field_tests/test_datefield.py`

### 评分

```typescript
async function sweBenchScore(
  repo: string,
  baseCommit: string,
  modelPatch: string,
  testPatch: string,
  testCommand: string
): Promise<boolean> {
  // 1. 克隆仓库到 base commit
  // 2. 应用 modelPatch
  // 3. 应用 testPatch
  // 4. 跑 testCommand
  // 5. 全部通过 = true
  const dir = await cloneAt(repo, baseCommit);
  try {
    await applyPatch(dir, modelPatch);
    await applyPatch(dir, testPatch);
    const { stdout, stderr } = await execAsync(testCommand, { cwd: dir });
    return !stderr.includes("FAILED") && !stderr.includes("ERROR");
  } catch {
    return false;
  } finally {
    await rm(dir, { recursive: true });
  }
}
```

### 变体

| 变体 | 题目数 | 难度 |
|---|---|---|
| SWE-bench Lite | 300 | 较简单 |
| SWE-bench Verified | 500 | 人类验证过 |
| SWE-bench Multilingual | 300+ | 多语言（JS/Java/Go/Rust） |

### 当前 SOTA（SWE-bench Verified）

| 模型 | Verified |
|---|---|
| GPT-4o | 33.2% |
| Claude 3.5 Sonnet | 49.0% |
| Devin (AI Engineer) | 13.9% |
| DeepSeek-R1 | 33.0% |
| Qwen2.5-Coder-32B | 31.0% |

**Claude 3.5 Sonnet 在 SWE-bench 上领先，但仍未到 50%。SWE-bench 仍是最难的代码基准。**

## 7.7 APPS — 算法竞赛

### 一句话

> 10,000 道竞赛编程题，难度从入门到 NOI/IOI 级别。

### 难度

- **Introductory**（1,000 题）：入门
- **Interview**（5,000 题）：面试级别
- **Competition**（4,000 题）：竞赛级别

## 7.8 BigCodeBench — 真实工具调用

### 一句话

> 139 个库 × 7 个任务 = 1140 个测试。**测"调用真实 Python 库"的能力。**

### 样例

> 任务：用 `pandas` 读取 CSV 并绘制折线图
> 评测：执行代码，检查输出 PNG 是否正确生成

## 7.9 DS-1000 — 数据科学

### 一句话

> 1,000 道 NumPy/Pandas/SciPy/Matplotlib/PyTorch 题目。**测"使用数据科学库"的能力。**

### 与 HumanEval 区别

- HumanEval：纯算法，标准库
- DS-1000：调用科学计算库，需要"知道 API"

## 7.10 Spider & BIRD — Text-to-SQL

### Spider 1.0

> 10,181 个自然语言问题 + 5,693 个 SQL。**跨领域、跨数据库。**

### 样例

> **自然语言问题**：列出所有学生的人数，按专业分组。
> **SQL**：
> ```sql
> SELECT major, COUNT(*) FROM student GROUP BY major;
> ```

### BIRD

> 95 个大型数据库，12,751 题。**更复杂、更真实，含脏数据。**

## 7.11 BFCL — Berkeley Function Calling Leaderboard

### 一句话

> 测"模型调用函数"的能力。**Agent 时代的核心评估。**

### 维度

- **Simple**：单个函数调用
- **Multiple**：多个函数（模型选哪个）
- **Parallel**：并行调用多个函数
- **Nested**：嵌套调用（A 调 B 的结果再调 C）
- **Live**：真实用户请求（持续更新）

### 当前 SOTA（BFCL Live）

| 模型 | Overall |
|---|---|
| GPT-4o | 71.6% |
| Claude 3.5 Sonnet | 76.5% |
| Gemini 1.5 Pro | 67.0% |
| Qwen2.5-72B | 70.0% |
| DeepSeek-V3 | 73.0% |

## 7.12 章节汇总

| 基准 | 测什么 | 规模 | 评分 | 当前 SOTA |
|---|---|---|---|---|
| HumanEval | Python 函数 | 164 | pass@1 | 92% |
| MBPP | Python 入门 | 974 | pass@1 | 90% |
| LiveCodeBench | 持续更新算法 | 500+ | pass@1 | 78% |
| SWE-bench Verified | GitHub Issue 修复 | 500 | 通过率 | 49% (Claude) |
| APPS | 编程竞赛 | 10k | pass@k | 40% |
| BigCodeBench | 库调用 | 1140 | 通过率 | 50% |
| DS-1000 | 数据科学 | 1000 | pass@1 | 70% |
| Spider | Text-to-SQL | 10k | exact match | 85% |
| BIRD | Text-to-SQL（真实） | 12.7k | execution | 60% |
| BFCL | 函数调用 | 2000+ | 综合 | 76.5% (Claude) |

## 7.13 实战：跑 HumanEval

```bash
# 用 lm-evaluation-harness
lm_eval --model hf \
    --model_args pretrained=Qwen/Qwen2.5-Coder-7B-Instruct \
    --tasks humaneval \
    --output_path ./results

# 自己写
npx tsx eval-humaneval.ts
```

**eval-humaneval.ts 核心**：

```typescript
import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

async function evalHumanEval(model: string) {
  const problems = await loadHumanEval(); // 从 humaneval-x JSONL 加载
  let pass = 0;
  for (const p of problems) {
    const completion = await callModel(model, p.prompt + "\n    ");
    const passed = await runTests(p, completion);
    if (passed) pass++;
  }
  console.log(`Pass@1: ${(pass / problems.length * 100).toFixed(1)}%`);
}
```

## 7.14 验收自测

1. **选择**：哪个基准最接近"真实工程"难度？
   - A. HumanEval
   - B. MBPP
   - C. SWE-bench
   - D. BFCL

2. **简答**：为什么 pass@k 比 pass@1 更能反映"探索能力"？

3. **实操**：用 `lm-eval` 跑 HumanEval，输出 pass@1、pass@10。

## 7.15 延伸阅读

⭐⭐⭐
- [HumanEval 论文](https://arxiv.org/abs/2107.03374) — 编程题的开山之作
- [SWE-bench 论文](https://arxiv.org/abs/2310.06770) — 真实工程
- [LiveCodeBench](https://livecodebench.github.io/) — 持续更新防污染

⭐⭐
- [BigCodeBench](https://bigcode-bench.github.io/) — 库调用
- [DS-1000](https://ds1000-code-llm.github.io/) — 数据科学
- [BIRD 论文](https://bird-bench.github.io/) — Text-to-SQL
- [BFCL](https://gorilla.cs.berkeley.edu/leaderboard.html) — 函数调用

⭐
- [APPS 论文](https://arxiv.org/abs/2105.09938) — 编程竞赛
- [Spider 论文](https://yale-lily.github.io/spider) — 跨域 SQL
