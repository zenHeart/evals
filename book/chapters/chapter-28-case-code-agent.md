# 28. 案例研究（二）：评估一个代码生成 Agent

> **如果只读一节**：代码 Agent 评估 = HumanEval 单元测试 + SWE-bench 真实 Issue + 用户接受率。**自动 + 人工 + 业务** 三层评估缺一不可。

## 28.1 业务背景

**公司**：XX SaaS
**产品**：AI 代码助手（VS Code 插件）
**目标**：帮前端工程师提效 30%

**Agent 能力**：
- 代码补全（行内）
- 函数生成（自然语言 → 代码）
- Bug 修复
- 代码解释
- 重构建议

## 28.2 评估的 3 层

```
[第 1 层：自动评估]
  HumanEval / MBPP / LiveCodeBench
  单元测试通过率
  
[第 2 层：业务评估]
  - 真实 React/TypeScript 项目测试
  - 用户接受率（接受 vs 拒绝）
  - 编辑距离（接受后改了多少）
  
[第 3 层：人工评估]
  - 代码风格
  - 可维护性
  - 安全性
```

## 28.3 第 1 层：自动评估

**测试集**

| 来源 | 数量 | 类型 |
|---|---|---|
| HumanEval | 164 | Python 函数 |
| MBPP | 974 | Python 入门 |
| LiveCodeBench | 500 | LeetCode |
| 自建（TypeScript） | 200 | 前端 |
| 自建（React） | 200 | 组件生成 |

**代码**

```python
# eval_code_agent.py
import subprocess
import tempfile
import json

def eval_humaneval(model, samples):
    passed = 0
    for s in samples:
        # 1. 让模型补全函数
        completion = model.generate(s["prompt"])
        
        # 2. 写完整代码
        full_code = s["prompt"] + completion + "\n" + s["test"] + f"\ncheck({s['entry_point']})"
        
        # 3. 跑测试
        with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
            f.write(full_code)
            tmp_path = f.name
        
        try:
            result = subprocess.run(
                ["python3", tmp_path],
                capture_output=True,
                text=True,
                timeout=10,
            )
            if result.stdout.strip() == "PASSED":
                passed += 1
        except:
            pass
        finally:
            import os
            os.unlink(tmp_path)
    
    return passed / len(samples)
```

**TypeScript 专项**

```typescript
// eval-ts.ts
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

interface TsTask {
  id: string;
  prompt: string;       // 函数签名 + 描述
  expected: string;      // 期望签名
  test: string;          // 测试代码
  category: string;      // 类别
}

async function evalTypeScript(model: string, tasks: TsTask[]): Promise<{ passRate: number; byCategory: Record<string, number> }> {
  const results: { pass: boolean; category: string }[] = [];
  
  for (const t of tasks) {
    // 1. 让模型生成实现
    const completion = await model.generate(t.prompt);
    
    // 2. 写到临时文件
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ts-eval-"));
    const codePath = path.join(tmpDir, "solution.ts");
    const testPath = path.join(tmpDir, "test.ts");
    
    const fullCode = `
${t.prompt}
${completion}
${t.test}
`;
    
    fs.writeFileSync(codePath, fullCode);
    fs.writeFileSync(testPath, t.test);
    
    // 3. 跑 TypeScript 编译 + 测试
    try {
      execSync(`npx ts-node ${codePath}`, { cwd: tmpDir, stdio: "pipe" });
      results.push({ pass: true, category: t.category });
    } catch {
      results.push({ pass: false, category: t.category });
    } finally {
      fs.rmSync(tmpDir, { recursive: true });
    }
  }
  
  const passCount = results.filter(r => r.pass).length;
  return {
    passRate: passCount / results.length,
    byCategory: groupByCategory(results),
  };
}
```

## 28.4 第 2 层：业务评估

**真实 React 组件测试**

```python
# eval_react.py
# 200 道 React 组件生成任务
react_tasks = [
    {
        "id": "rc-001",
        "spec": "Create a Button component with primary, secondary, and danger variants",
        "tests": [
            "renders without crashing",
            "applies variant class correctly",
            "handles onClick",
        ],
    },
    # ... 200 道
]

def eval_react_component(model):
    passed = 0
    for task in react_tasks:
        # 1. 生成代码
        code = model.generate(task["spec"])
        
        # 2. 写文件
        with open(f"/tmp/{task['id']}.tsx", "w") as f:
            f.write(code)
        
        # 3. 跑测试
        result = run_jest(f"/tmp/{task['id']}.test.tsx", task["tests"])
        if result["all_passed"]:
            passed += 1
    
    return passed / len(react_tasks)
```

**用户接受率（关键业务指标）**

```python
# 从生产数据计算
def user_acceptance_rate():
    # 1. 拉 30 天的建议数据
    suggestions = get_suggestions(since=days_ago(30))
    
    # 2. 计算接受率
    accepted = [s for s in suggestions if s["status"] == "accepted"]
    rejected = [s for s in suggestions if s["status"] == "rejected"]
    ignored = [s for s in suggestions if s["status"] == "ignored"]
    
    return {
        "acceptance_rate": len(accepted) / len(suggestions),
        "rejection_rate": len(rejected) / len(suggestions),
        "ignore_rate": len(ignored) / len(suggestions),
    }
```

**编辑距离（接受后改了多少）**

```python
def edit_distance_metric():
    # 用户接受后，改了多少字符
    suggestions = get_accepted_suggestions(since=days_ago(30))
    
    edit_distances = []
    for s in suggestions:
        if s.get("final_code"):
            # 用 diff 库计算编辑距离
            distance = levenshtein(s["suggested_code"], s["final_code"])
            edit_distances.append(distance / len(s["suggested_code"]))
    
    return {
        "avg_edit_ratio": sum(edit_distances) / len(edit_distances),
        "perfect_acceptance_rate": sum(1 for d in edit_distances if d < 0.1) / len(edit_distances),
    }
```

## 28.5 第 3 层：人工评估

**Rubric**

```markdown
# 代码生成人工评估 Rubric

## 评估维度（每项 1-5 分）

**1. 正确性**
- 5：完全正确，无 bug
- 4：基本正确，有 1-2 个小 bug
- 3：能跑但有 bug
- 2：编译/类型错
- 1：完全不能跑

**2. 风格**
- 5：与现有代码风格一致
- 4：风格基本一致
- 3：可接受
- 2：风格不一致
- 1：风格很差

**3. 可读性**
- 5：清晰、有注释、命名好
- 4：清晰
- 3：可读
- 2：难读
- 1：完全难懂

**4. 安全性**
- 5：安全的最佳实践
- 4：基本安全
- 3：中等
- 2：有明显漏洞
- 1：严重安全风险
```

**抽检流程**

```python
# 每周抽 50 个建议，3 个工程师评估
def weekly_review():
    suggestions = sample_suggestions(50, since=days_ago(7))
    
    for s in suggestions:
        score = {
            "correctness": 0, "style": 0, "readability": 0, "security": 0
        }
        for engineer in 3_engineers:
            for k in score:
                score[k] += engineer.rate(s)
        # 取平均
        for k in score:
            score[k] /= 3
        
        s["quality_score"] = score
        s["inter_rater_agreement"] = calc_agreement(s["ratings"])
    
    return aggregate_quality(suggestions)
```

## 28.6 评估结果

**第 1 轮**

| 指标 | 值 | 目标 | 状态 |
|---|---|---|---|
| HumanEval pass@1 | 75% | > 85% | ❌ |
| MBPP pass@1 | 80% | > 85% | ⚠️ |
| React 组件生成 | 60% | > 70% | ❌ |
| 用户接受率 | 35% | > 50% | ❌ |
| 编辑距离 | 0.25 | < 0.15 | ❌ |

**改进方向**

```
1. HumanEval 低 → 改用更强模型（GPT-4o → Claude 3.5 Sonnet）
2. React 组件差 → 加前端知识到 prompt
3. 接受率低 → 改进建议的"上下文感知"
4. 编辑距离高 → 改进建议的"用户风格匹配"
```

**改进后第 2 轮**

| 指标 | 值 | 目标 | 状态 |
|---|---|---|---|
| HumanEval pass@1 | 88% | > 85% | ✅ |
| MBPP pass@1 | 87% | > 85% | ✅ |
| React 组件生成 | 75% | > 70% | ✅ |
| 用户接受率 | 55% | > 50% | ✅ |
| 编辑距离 | 0.12 | < 0.15 | ✅ |

## 28.7 SWE-bench 风格评估

```python
# eval_swe.py
# 真实 GitHub Issue 修复评估
import subprocess
import tempfile
import shutil

def eval_swe_bench(model, instances, timeout=300):
    """instances: [{repo, base_commit, issue, test_patch, eval_script}]"""
    results = []
    
    for inst in instances:
        tmp_dir = tempfile.mkdtemp()
        try:
            # 1. 克隆仓库到 base commit
            subprocess.run(
                ["git", "clone", inst["repo_url"], tmp_dir],
                check=True, capture_output=True,
            )
            subprocess.run(
                ["git", "checkout", inst["base_commit"]],
                cwd=tmp_dir, check=True, capture_output=True,
            )
            
            # 2. 给模型 Issue，让它生成 patch
            patch = model.generate_patch(
                issue=inst["issue"],
                repo_path=tmp_dir,
            )
            
            # 3. 应用 patch
            with open(f"{tmp_dir}/model.patch", "w") as f:
                f.write(patch)
            subprocess.run(
                ["git", "apply", "model.patch"],
                cwd=tmp_dir, capture_output=True,
            )
            
            # 4. 应用 test patch
            with open(f"{tmp_dir}/test.patch", "w") as f:
                f.write(inst["test_patch"])
            subprocess.run(
                ["git", "apply", "test.patch"],
                cwd=tmp_dir, capture_output=True,
            )
            
            # 5. 跑测试
            result = subprocess.run(
                inst["eval_script"].split(),
                cwd=tmp_dir,
                capture_output=True,
                timeout=timeout,
            )
            
            passed = result.returncode == 0
            results.append({"id": inst["id"], "passed": passed})
        except Exception as e:
            results.append({"id": inst["id"], "passed": False, "error": str(e)})
        finally:
            shutil.rmtree(tmp_dir)
    
    return results
```

## 28.8 章节小结

- **3 层评估**：自动 + 业务 + 人工
- **HumanEval / MBPP / LiveCodeBench** 是基础
- **用户接受率 + 编辑距离** 是关键业务指标
- **SWE-bench 风格** 测真实 Issue 修复
- **每周人工抽检** 保证质量

## 28.9 验收自测

1. **选择**：代码 Agent 评估的关键业务指标是？
   - A. HumanEval 分数
   - B. 用户接受率
   - C. 延迟
   - D. Token 成本

2. **简答**：为什么"用户接受率"比"HumanEval 分数"更反映产品价值？

3. **实操**：用 HumanEval 评估 50 个 Python 函数生成样本。

## 28.10 📋 本章 Cheat Sheet

| 概念 | 一句话 | 详见 |
|---|---|---|
| 3 层评估 | 自动(SWE-bench)/业务/人工 | §28.2 |
| SWE-bench Verified | 500 题金标准 | §28.7 |
| 业务 hold-out | 你仓库的真实 issue | §28.4 |
| 人工 5 维度 | 正确性/可读性/安全/性能/风格 | §28.5 |
| Lessons learned | 每次评估必写 | §28.7 |


## 28.11 ⚠️ 5 个常见错误

1. **只看 SWE-bench pass rate** — Pass 率 30% 不等于'能修你的 bug',看子集与你业务相似度。
2. **不区分自动 vs 业务评估** — 自动评估便宜但粗,业务评估贵但准,3 层都要有。
3. **人工评估不标维度** — 只给 1-5 分没信息,维度化(正确性/可读性/安全/性能)。
4. **SWE-bench 风格评估本地跑不动** — SWE-bench Verified 需要 Docker 环境,本地要先 mock 5 题验证。
5. **评估完不回归** — 新 prompt 上线不复盘 → 下次踩同一个坑,每次评估写 lessons learned。

## 28.12 延伸阅读

⭐⭐⭐
- [SWE-bench](https://www.swebench.com/)
- [HumanEval](https://github.com/openai/human-eval)
- [LiveCodeBench](https://livecodebench.github.io/)

⭐⭐
- [Cursor 评估实践](https://www.cursor.com/blog/evaluating-ai-coding)
- [Copilot Metrics (Microsoft Research)](https://arxiv.org/abs/2202.07875)

⭐
- [Edit Distance 评估](https://en.wikipedia.org/wiki/Edit_distance)
- [CodeBLEU 指标](https://github.com/wasiahmad/CodeBLEU)
