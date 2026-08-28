# 9. 硬核新兴评测：TerminalBench、SWE-Lancer、Cybench、KernelBench、MLE-bench、AppWorld

> **如果只读一节**：2024-2025 兴起的 6 个"硬核"评测把 AI 评估从"做题"推向"做工程"和"做研究"。**本章节是理解 AGI 进展的必读**。

## 9.1 本章目标

读完后你能：

- 知道 6 个新兴硬核评测的目标、原理、价值
- 知道每个评测的"通过率"现状
- 读懂厂商技术报告里这些评测分数的含义
- 知道这些评测的局限和争议

**前置知识**：第 1-7 章基础。

## 9.2 Terminal-Bench — 终端命令的真实操作

**一句话定义**

> **Terminal-Bench = 测 AI 在真实终端/CLI 环境下完成复杂任务的能力**（不是写代码，而是操作命令行工具）。

**前端类比**：测"会用 git / npm / docker" 的能力，不是"会写 JavaScript"。

**真实样例**

```
[任务] 在一个 git 仓库中找到 3 个未合并的 PR 数量
[可用工具] bash, find, grep, git, curl
[期望] 输出 3
[评分] 执行命令，验证 stdout 是否为 "3"
```

**实现原理**

```
1. 准备 Docker 镜像（含完整开发环境）
2. 模型通过终端执行命令完成任务
3. 验证命令输出或最终文件状态
4. 通过率 = 完成数 / 总数
```

**任务类型**

| 类别 | 示例 |
|---|---|
| 数据处理 | CSV 转换、JSON 解析 |
| 网络操作 | curl 抓数据、API 调用 |
| 系统管理 | 进程管理、日志分析 |
| 开发工具 | git、npm、docker |
| 调试修复 | 找 bug、修复配置 |

**当前 SOTA**

| 模型 | 通过率 |
|---|---|
| GPT-4o | ~30% |
| Claude 3.5 Sonnet | ~45% |
| o1-preview | ~60% |

**Terminal-Bench 是"AI 工程师"能力的关键测试**。

详见：https://github.com/Terminal-Bench/terminal-bench

## 9.3 SWE-Lancer — Upwork 风格的真实外包

**一句话定义**

> **SWE-Lancer = OpenAI 出品的"接活能力"测试**。从 Upwork 拿真实工程任务，测 AI 能否完成。

**特色**：
- 真实客户付费的外包项目
- 任务金额从 $50 到 $32,000
- 真实代码、真实需求

**实现原理**

```
1. 从 Upwork 收集真实工程师外包项目
2. 每个项目有：
   - 客户需求
   - 真实代码库
   - 验收测试
3. AI 提交代码
4. 跑测试，按通过率计分
5. 价值 = 通过任务的总金额
```

**任务类型**

| 类型 | 描述 |
|---|---|
| Bug 修复 | 找到并修复 |
| 功能开发 | 从零写功能 |
| 重构 | 改代码不改行为 |
| 集成 | 接第三方 API |

**关键发现**

- **AI 价值** = 完成任务的实际美元金额
- 顶级模型能完成"小项目"（$50-$500）
- 大项目（$10k+）仍需人类
- **衡量"AI 替代程序员"的经济价值**

详见：https://github.com/openai/SWELancer-Benchmark

## 9.4 Cybench — 网络安全 CTF 风格

**一句话定义**

> **Cybench = 测 AI 的网络安全能力**。Capture The Flag (CTF) 风格的攻防题。

**前端类比**：测"能破解网站漏洞"的能力（合法授权下）。

**任务类型**

| 类别 | 示例 |
|---|---|
| Web 渗透 | SQL 注入、XSS |
| 密码学 | 破解 RSA、AES |
| 逆向 | 反编译二进制 |
| 取证 | 从数据中找线索 |
| 杂项 | 隐写术、编码 |

**实现原理**

```
1. 提供一个"靶机"（有漏洞的 Docker 容器）
2. AI 攻击靶机找 flag
3. flag 格式通常是 CTF{...}
4. 通过 = 找到 flag
```

**当前 SOTA**

| 模型 | 通过率 |
|---|---|
| GPT-4o | ~10% |
| Claude 3.5 Sonnet | ~15% |
| o1-preview | ~30% |

**重要**：高通过率说明 AI 可以辅助安全研究，但**也会带来安全风险**——所以有 Cybench 是把双刃剑。

详见：https://github.com/andyzorigin/Cybench

## 9.5 KernelBench — CUDA Kernel 生成

**一句话定义**

> **KernelBench = 测 AI 写 GPU kernel 的能力**。从 PyTorch 模型生成等效的 CUDA 代码。

**前端类比**：测"能否把高耗时 JS 函数重写成 C++"（速度优化能力）。

**实现原理**

```
1. 提供 PyTorch 参考实现
2. AI 生成等效的 CUDA kernel
3. 编译并跑测试
4. 比较速度（kernel 必须 ≥ baseline 速度）
5. 比较正确性（输出数值在容差内）
```

**难度分层**

| Level | 难度 | 示例 |
|---|---|---|
| Level 1 | 简单 | 元素级操作、卷积 |
| Level 2 | 中等 | 归一化、激活函数 |
| Level 3 | 高级 | Attention、Softmax |
| Level 4 | 极难 | 自定义算子融合 |

**当前 SOTA**

| 模型 | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| GPT-4o | 60% | 25% | 5% |
| Claude 3.5 Sonnet | 70% | 35% | 10% |
| 人类专家 | 95% | 80% | 60% |

**AI 在 GPU 编程上还有很大差距**。

详见：https://github.com/ScalingIntelligence/KernelBench

## 9.6 MLE-bench — Kaggle 风格的 ML 工程

**一句话定义**

> **MLE-bench = OpenAI 出品的 ML 工程能力测试**。75 个 Kaggle 真实比赛任务。

**前端类比**：测"能独立完成 ML 项目"的能力（数据清洗、特征工程、模型训练、调参、提交）。

**实现原理**

```
1. 选 75 个 Kaggle 比赛（涵盖分类、回归、NLP、CV）
2. 给 AI：
   - 任务描述
   - 训练数据
   - 评估指标
3. AI 提交预测结果
4. 按 Kaggle 评分规则打分
5. 与人类 Kaggle 选手对比（百分位）
```

**评估维度**

- 提交是否有效
- 在 leaderboard 上的百分位
- 获得奖牌数（铜/银/金）
- 与 50% 中位选手对比

**当前 SOTA（OpenAI 报告）**

| 模型 | Kaggle 奖牌率 | 50% 中位数率 |
|---|---|---|
| GPT-4o | 10% | 15% |
| o1-preview | 25% | 35% |
| Claude 3.5 Sonnet | 20% | 30% |

**AI 已能在简单 Kaggle 比赛里"获得奖牌"**。

详见：https://github.com/openai/mle-bench

## 9.7 AppWorld — 真实应用 API Agent

**一句话定义**

> **AppWorld = 测 AI 在"日常生活应用"中完成复杂任务的能力**。跨应用编排。

**前端类比**：测"会用 Notion + Slack + Calendar + GitHub 配合工作"的能力。

**应用生态**

包含 9 个真实应用：

- 电商购物
- 邮件
- 通讯录
- 日历
- 文件管理
- 相册
- 笔记
- 待办事项
- 短信

**任务示例**

```
[任务] "在邮箱里找到 2024 年所有来自 alice@example.com 的邮件，
       把附件下载到'报告'文件夹，然后给 alice 发邮件确认"
[应用] email + file_manager
[评分] 邮件是否发送、文件夹是否正确、文件数量是否匹配
```

**实现原理**

```
1. 沙箱环境 + 真实可用的应用 API
2. 给 AI 工具定义（OpenAPI schema）
3. AI 决定调用哪些 API、按什么顺序
4. 检查最终系统状态
5. 复杂任务需要 5-20 个 API 调用
```

**当前 SOTA**

| 模型 | 任务通过率 |
|---|---|
| GPT-4o | 30% |
| Claude 3.5 Sonnet | 35% |
| Gemini 1.5 Pro | 25% |

详见：https://github.com/appworld-lab/appworld

## 9.8 6 大评测对比

| 评测 | 测什么 | 难度 | 顶级模型通过率 | 价值 |
|---|---|---|---|---|
| Terminal-Bench | 终端操作 | ⭐⭐⭐ | 45% | 工程能力 |
| SWE-Lancer | 真实外包 | ⭐⭐⭐⭐ | 30% | 经济价值 |
| Cybench | 网络安全 | ⭐⭐⭐⭐ | 30% | 安全能力（双刃剑） |
| KernelBench | GPU 编程 | ⭐⭐⭐⭐⭐ | 10% | 性能优化 |
| MLE-bench | ML 工程 | ⭐⭐⭐ | 35% | 完整 ML 项目 |
| AppWorld | 跨应用 | ⭐⭐⭐ | 35% | 真实生活 |

## 9.9 为什么这 6 个评测重要

1. **从"做题"到"做工程"**：MMLU 是"做题"，KernelBench 是"做 GPU 编程"——更接近真实能力。
2. **衡量经济价值**：SWE-Lancer 用美元计价 = AI 替代程序员的实际经济影响。
3. **安全双刃剑**：Cybench 高分 = AI 既是好安全员，也是好黑客。
4. **AGI 进展的真实指标**：这 6 个评测比"GPT-4 在 MMLU 多对 1 题"更能反映 AGI 进展。

## 9.10 ⚠️ 5 个常见错误

1. **把 Terminal-Bench 看作"测程序员能力"** — 它测的是"用命令行完成任务"，不是"写代码"。
2. **以为 SWE-Lancer 高分 = AI 能替代 $32k 项目的工程师** — 大项目仍需人类。
3. **忽视 Cybench 的双刃剑** — 训练数据可能让模型学会攻击。
4. **KernelBench 简单以为"AI 写 CUDA 慢一点就行"** — 实际可能 10-100 倍慢。
5. **把 AppWorld 看作"聊天机器人测试"** — 它测"跨应用协作"，是真正的 Agent 能力。

## 9.11 📋 本章 Cheat Sheet

| 评测 | 核心 | 一句话 |
|---|---|---|
| Terminal-Bench | 终端操作 | "在真实终端里完成 CLI 任务" |
| SWE-Lancer | 真实外包 | "完成 Upwork 上的真实项目" |
| Cybench | 网络安全 | "在 CTF 比赛中找 flag" |
| KernelBench | GPU 编程 | "把 PyTorch 改成 CUDA" |
| MLE-bench | ML 工程 | "完成 Kaggle 比赛" |
| AppWorld | 跨应用 | "用多个 API 协作完成任务" |

## 9.12 验收自测

1. **简答**：为什么 SWE-Lancer 用"美元金额"评估 AI 价值？
2. **简答**：Cybench 为什么会带来安全风险？
3. **实操**：用 Terminal-Bench 评估你的模型（Docker 安装后跑 5 道题）。

## 9.13 延伸阅读

- [Terminal-Bench GitHub](https://github.com/Terminal-Bench/terminal-bench)
- [SWE-Lancer (OpenAI)](https://github.com/openai/SWELancer-Benchmark)
- [Cybench](https://github.com/andyzorigin/Cybench)
- [KernelBench](https://github.com/ScalingIntelligence/KernelBench)
- [MLE-bench (OpenAI)](https://github.com/openai/mle-bench)
- [AppWorld](https://github.com/appworld-lab/appworld)
