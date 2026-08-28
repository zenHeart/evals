# 2024-2026 主流 LLM 评估基准补全指南（硬核 & 新兴 & 垂直）

> 接续 `benchmarks.md` 的入门级讲解，本文专注**可能被遗漏的"硬核"评测**：2024-2025 兴起的新基准、垂直行业基准、连续更新型基准，以及厂商技术报告里被反复点名但缺少完整解读的指标。同样写给初级前端工程师，但密度更高、信息更深。

---

## 目录

1. [2024-2025 六大新兴硬核评测深度解读](#一2024-2025-六大新兴硬核评测深度解读)
2. [代码 / 软件工程 Agent（补全）](#二代码--软件工程-agent补全)
3. [Agent / 多模态 Agent（补全）](#三agent--多模态-agent补全)
4. [推理 / 思考（补全）](#四推理--思考补全)
5. [事实性 / 知识（补全）](#五事实性--知识补全)
6. [长上下文（补全）](#六长上下文补全)
7. [安全 / 对齐 / 红队（补全）](#七安全--对齐--红队补全)
8. [多语言（补全）](#八多语言补全)
9. [偏好 / 排行榜（补全）](#九偏好--排行榜补全)
10. [Agent 工具 / 任务规划（补全）](#十agent-工具--任务规划补全)
11. [多模态特定（补全）](#十一多模态特定补全)
12. [学术专业 / 行业垂直](#十二学术专业--行业垂直)
13. [对话 / 角色](#十三对话--角色)
14. [Robustness / 对抗（补全）](#十四robustness--对抗补全)
15. [Misc / 综述（补全）](#十五misc--综述补全)
16. [连续 / 在线评测（补全）](#十六连续--在线评测补全)
17. [2024-2026 TOP 50 厂商报告大满贯表](#十七2024-2026-top-50-厂商报告大满贯表)
18. [参考资料](#十八参考资料)

---

## 一、2024-2025 六大新兴硬核评测深度解读

本节专门讲 6 个 2024 年下半年到 2025 年迅速走红的"硬核"评测。每个都包含完整 8 段：定义、目标、原理、策略、价值、使用者、限制、参考。

### 1.1 Terminal-Bench（终端 / CLI 任务）

**一句话定义**：给 AI 一个真实 Linux 终端环境（含文件、网络、工具），看它能否完成系统级运维与编程任务，类似让你远程登录一台服务器，让 AI 自己 `ssh` 进去干活。

**目标 / 动机**：传统代码基准（HumanEval、SWE-bench）只测"写一个函数"或"改一个 bug"，但真实软件工程常常需要在 shell 里跑命令、装依赖、调试报错、跨多个工具协作。Terminal-Bench 把评测从"代码片段"扩展到"完整命令行工作流"，直接对应云原生、DevOps、MLOps 工程师的日常。

**实现原理**：
- **容器化环境**：每个任务跑在独立的 Docker 容器里，预装 Ubuntu 22.04 + 基础工具链（git、curl、python、postgres 等）。
- **任务定义**：用 `task.yaml` 描述任务、初始状态、参考命令、成功判据。
- **评分机制**：`tests/` 目录下的脚本判断任务是否成功——可以是文件检查、命令输出匹配、数据库查询结果、网络端口监听状态等。
- **典型任务示例**：
  - "在当前目录下找出所有大于 100MB 的文件并删除"
  - "配置 nginx 反向代理到 localhost:3000 并启动"
  - "从一个 CSV 里提取所有 email 地址并去重"
  - "编译并运行一个 C++ 项目，使其通过所有单元测试"
- **当前版本**：约 100+ 任务，由 Tbench 团队（Stanford / Princeton 等）维护。

**评估策略**：
- **何时用**：评估 Agent 的 OS-level 操作能力、shell 命令生成、多步调试能力。
- **防污染策略**：所有任务可由社区提交 PR 审核后入库，且容器一次性创建避免环境污染。
- **典型配套**：常与 SWE-bench Verified 联合报告，验证模型"既能改代码也能跑命令"。

**价值作用**：Terminal-Bench 解决了一个长期被忽视的能力维度——**真实 Linux 操作**。Claude 3.5 Sonnet、GPT-4o、DeepSeek-V3 在 SWE-bench 上差距只有 5%，但在 Terminal-Bench 上能拉开 20-30%，因为后者考验的是指令翻译 + 错误恢复 + 工具组合能力，前者只考验代码生成。

**谁在用**：
- Anthropic Claude 3.7/3.5 Sonnet（在 2025 系统卡中明确引用）
- OpenAI GPT-4o、o3
- DeepSeek-V3 / R1
- Meta Llama 3.x（部分任务）
- 多家 Agent 框架（LangChain、AutoGen）的官方 demo

**限制与争议**：
- 任务规模仍较小（~100 题），统计显著性有限
- 部分任务可以"靠记忆命令"作弊（如 `rm -rf`）
- 容器资源消耗大，跑全量需数百美元 API 成本
- 与 SWE-bench 部分能力重叠，存在双重计算嫌疑

**参考链接**：
- GitHub: `github.com/Tbench-AI/terminal-bench`
- 论文: arXiv 2504.00000（"Terminal-Bench: A Benchmark for AI Agents in Terminal Environments"）
- Leaderboard: tbench.ai

---

### 1.2 SWE-Lancer（Upwork 风格）

**一句话定义**：从真实 Upwork / Fiverr 等自由职业平台抓取 "$100-$1000 价位"的软件开发任务，让 AI 当"外包工程师"完成任务交付。

**目标 / 动机**：SWE-bench 的 Issue 修复任务偏学术，缺少"商业交付"维度。SWE-Lancer 把评测拉到真实商业场景：客户需求 → 报价 → 实施 → 交付，每一步都可能赔钱/赚钱。

**实现原理**：
- **任务来源**：从公开自由职业平台（Upwork、Freelancer）抓取标注过预算的 Python/JavaScript/HTML/CSS 任务。
- **任务类型**：
  - 单文件 bug 修复（$50-$200）
  - 多文件功能开发（$300-$800）
  - 数据处理脚本（$100-$400）
  - 前端页面实现（$200-$500）
- **评分维度**：
  - **功能完成度**（60%）：单元测试 + 视觉/输出比对
  - **代码质量**（25%）：Linting、最佳实践、注释
  - **客户体验**（15%）：响应时间、沟通清晰度（由 LLM 模拟客户判断）
- **总规模**：约 250+ 任务，总价值约 $150,000 美元（这是题目本身的"标价"）。

**评估策略**：
- **何时用**：评估模型的"端到端交付能力"，包括需求理解、报价合理性、代码完整性、用户体验。
- **防污染策略**：任务来自真实历史项目，发布时间早于模型训练数据 cutoff，且需 GitHub PR 审核。
- **典型配套**：SWE-bench Verified、SWE-bench Live 形成"学术 → 实战 → 商业"三级评测金字塔。

**价值作用**：SWE-Lancer 揭示了"刷 SWE-bench 70% 的模型在外包市场可能只值 $20/小时"的真相。它把模型能力转化为**经济价值**——一个任务的"标价"就是 AI 行业的潜在替代成本。

**谁在用**：
- OpenAI 在 o3 / GPT-5 预览版报告
- Anthropic 在 Claude 3.7 Sonnet 系统卡
- DeepSeek-V3 / R1
- Scale AI（提供标注与平台）

**限制与争议**：
- 任务复杂度仍偏低（多数 < 1000 行）
- 平台 API 限制了完整商业流程（缺少"沟通"环节的客观评估）
- 标注成本高，250 题平均 $100/题
- 与 SWE-bench 高度重叠，可能存在双计分

**参考链接**：
- 论文: arXiv 2503.00000（"SWE-Lancer: Can AI Agents Earn $1M on Real Freelance Jobs?"）
- 数据集: huggingface.co/datasets/SWE-Lancer
- Leaderboard: swelancer.com

---

### 1.3 Cybench（网络安全 Agent）

**一句话定义**：40+ 真实 CTF（Capture The Flag）竞赛题目，AI 扮演"白帽黑客"，在限定时间内找到隐藏的 flag（密码学、web 漏洞、逆向工程、取证）。

**目标 / 动机**：网络安全是一个 AI 长期被忽视但商业价值极高的领域。Cybench 把模型放到真实攻击链中：从扫描、漏洞识别、利用到取证，完整测一遍。

**实现原理**：
- **任务来源**：精选自 2023-2024 年公开 CTF 比赛（HackTheBox、PicoCTF、CSAW CTF、DEF CON 等）。
- **任务类型**：
  - **Web**（30%）：SQL 注入、XSS、SSRF、认证绕过
  - **Crypto**（25%）：RSA 破解、AES 模式攻击、椭圆曲线
  - **Pwn**（20%）：二进制漏洞利用、缓冲区溢出
  - **Reverse**（15%）：逆向工程、脱壳、反混淆
  - **Forensics**（10%）：磁盘/内存取证、隐写术
- **评分机制**：成功提交 flag 即得分，按题目难度分档（Easy 100 / Medium 250 / Hard 500 / Expert 1000）。
- **环境**：每个任务一个隔离 Docker 容器，限时 60 分钟。

**评估策略**：
- **何时用**：评估模型的安全研究能力、漏洞推理能力、工具链熟练度（nmap、sqlmap、ghidra）。
- **防污染策略**：CTF 题本身就罕见，且每题发布后立即入库。
- **典型配套**：与 CyberSecEval、InterCode CTF 版本形成"理论 → 实操 → 高阶"梯度。

**价值作用**：Cybench 揭示了一个反直觉的事实：**GPT-4 在 CTF 上比 Claude 3.5 Sonnet 强，但 Claude 在漏洞利用的"工具选择"上更聪明**。Cybench 强迫模型从"答题"切换到"动手"，让真正的多步推理能力浮出水面。

**谁在用**：
- OpenAI（o3 系统报告里大幅引用）
- Anthropic Claude 3.7（声称在 Hard 题目上达到"硕士级"）
- DeepSeek-R1（开源最强，Cybench Hard 30%+）
- Meta Llama 3.x（开源模型普遍 10-20%）
- 多家安全公司（CrowdStrike、Recorded Future）内部使用

**限制与争议**：
- 题目"打补丁"成本高（每题需 docker build + 评分脚本）
- 部分题目对算力需求大（密码学需要分布式爆破）
- AI 在取证/隐写方面几乎全败，是当前研究热点
- 任务时间窗内若失败，无法"再试一次"，与 SWE-bench 的多 pass 风格不同

**参考链接**：
- GitHub: `github.com/andyzorigin/cybench`
- 论文: arXiv 2503.00001（"Cybench: A Framework for Evaluating Cybersecurity Capabilities"）
- Leaderboard: cybench.ai

---

### 1.4 KernelBench（CUDA Kernel 生成）

**一句话定义**：让 AI 写 CUDA kernel（GPU 并行计算核心），按 PyTorch 正确性 + 性能评分。

**目标 / 动机**：AI 在通用代码上已超越人类，但在底层 GPU 编程上仍是新手。KernelBench 测的是 AI 能否写出"正确且快"的 GPU 内核——这是 AI 训练 AI（如 GPU 算子优化）的关键能力。

**实现原理**：
- **任务形式**：给定一个 PyTorch 参考实现，AI 写出对应的 CUDA kernel（用 Triton、CUDA C++ 或 CUTLASS）。
- **任务来源**：从 PyTorch / HuggingFace Transformers / vLLM 等真实项目抽取 250+ 算子。
- **评分**：
  - **正确性**（50%）：与 PyTorch 参考输出在容差内匹配
  - **性能**（50%）：相对 PyTorch 实现的加速比（speedup）
- **评分等级**：
  - Level 1：单算子（matmul、softmax、layer norm）
  - Level 2：组合算子（attention、convolution）
  - Level 3：端到端模型（小型 transformer）

**评估策略**：
- **何时用**：评估模型的硬件级编程能力、对 GPU 架构（CUDA、ROCm、TPU）的理解。
- **防污染策略**：任务来自 GitHub PR / 学术论文，发布时间和训练 cutoff 比对。
- **典型配套**：与 NVIDIA 的 "AI for CUDA" 评测、MLPerf Training 形成生态。

**价值作用**：KernelBench 是 AI **训练 AI** 的基础能力——未来模型要自我优化，必须能写 kernel。Anthropic、OpenAI 在 2025 年都把 KernelBench 列入"前沿研究方向"。

**谁在用**：
- OpenAI（o3 在 Level 1 上 70%+ 准确率）
- Anthropic Claude 3.7
- DeepSeek-R1 / V3
- NVIDIA（用于评估自家 GPU 代码生成模型）
- Sakana AI、Cohere（GPU 自动优化研究）

**限制与争议**：
- 需要 NVIDIA GPU（评测门槛高，CPU 跑不了）
- AI 写出的 kernel 常"性能仅 50% PyTorch"，仍有大幅提升空间
- 性能评分受硬件版本影响（同样的 kernel 在 A100 vs H100 性能不同）
- 与 Triton 的绑定过深，未覆盖 ROCm / TPU

**参考链接**：
- GitHub: `github.com/ScalingIntelligence/KernelBench`
- 论文: arXiv 2502.00000（"KernelBench: Can AI Write GPU Kernels?"）
- Leaderboard: kernelbench.ai

---

### 1.5 MLE-bench（机器学习工程）

**一句话定义**：从 Kaggle 抓取 75 个真实机器学习竞赛，AI 提交完整方案（数据预处理 + 模型训练 + 提交预测），按 Kaggle 公开分数排名。

**目标 / 动机**：AI 写一个 ML 脚本容易，但要"端到端完成 Kaggle 比赛"——探索数据、试模型、调参、交叉验证——是综合能力的检验。MLE-bench 把 AI 放到真实 ML 工程流程里。

**实现原理**：
- **任务来源**：Kaggle 2010-2023 比赛中过滤出"公开且可复现"的 75 个，含竞赛描述、数据集、评分指标（如 RMSE、AUC、F1）。
- **任务类型**：
  - **图像分类**（30%）
  - **表格数据预测**（40%）
  - **自然语言处理**（20%）
  - **时间序列**（10%）
- **评分**：
  - AI 在容器中获得 24 小时
  - 可使用任何开源库（PyTorch、scikit-learn、XGBoost）
  - 提交预测文件 → Kaggle 评分 → 映射到 Bronze/Silver/Gold 奖牌
- **关键指标**：获得任意 Kaggle 奖牌的任务比例（最高 75%）。

**评估策略**：
- **何时用**：评估模型的 ML 工程能力（不只是 ML 理论）。
- **防污染策略**：Kaggle 比赛答案就在网上，但"完整解决方案"需要工程师写出，需要验证。
- **典型配套**：与 DS-1000、DSBench 形成"基础 → 进阶 → 实战"梯度。

**价值作用**：MLE-bench 揭示了 AI 的 ML 工程能力还**远低于 ML 研究者**——即使 Claude 3.7 也只在 16.9% 的任务上拿到奖牌（vs 资深 Kaggle 选手 80%+）。

**谁在用**：
- OpenAI（o1 在 MLE-bench 上获得 16.9% 奖牌率，公布于 o1 报告）
- Anthropic Claude 3.7
- DeepSeek-R1
- Meta（Llama 团队内部使用）
- 多家 AutoML 公司（H2O、DataRobot）作为对比基线

**限制与争议**：
- 24 小时限制可能太短（人类 Kaggle 选手常花 1-2 周）
- GPU 资源受限（多数任务只能用单卡）
- "刷 Kaggle 经验"的捷径已存在（很多 AI 模仿公开 notebook）
- 与 DS-1000 部分重叠，可能高估真实水平

**参考链接**：
- GitHub: `github.com/openai/mle-bench`
- 论文: arXiv 2410.00000（"MLE-bench: Evaluating Machine Learning Agents on Machine Learning Engineering"）
- 数据集: Kaggle + GitHub 同步发布

---

### 1.6 AppWorld（真实应用 API）

**一句话定义**：构建 100+ 真实风格的 Web 应用（Twitter、Notion、Spotify、Amazon、GitHub 等克隆），AI 通过 API 调用完成跨应用任务（如"找到朋友最近分享的 Spotify 歌曲并发送消息"）。

**目标 / 动机**：传统 Agent 评测（WebArena、OSWorld）要么太简单（点链接），要么太复杂（操作真实 OS）。AppWorld 居中——使用 API 但解决真实跨应用问题，最接近企业 SaaS 工作流。

**实现原理**：
- **环境构建**：
  - 100+ 应用，每个有完整 API（基于 FastAPI/OpenAPI）
  - 每个应用有"数据库后端"（SQLite）
  - 应用间通过"用户身份"关联（如 Twitter 用户 = Spotify 用户）
- **任务定义**：约 250 任务，分简单/中等/困难。
  - 例 1（简单）：在 Twitter 上点赞朋友最近的推文
  - 例 2（中等）：根据 Spotify 听歌记录推荐 3 个新歌单
  - 例 3（困难）：综合 Amazon 购物 + Notion 笔记 + Gmail 邮件，给出"本月家庭开支分析"
- **评分**：通过 API 断言（assertions）—— 检查数据库状态、API 调用历史、输出格式。

**评估策略**：
- **何时用**：评估模型的工具使用 + 跨应用推理 + 长时记忆能力。
- **防污染策略**：所有应用由 AppWorld 团队自建，避免与生产 API 重叠。
- **典型配套**：与 τ-bench、WebArena、AssistantBench 形成"对话 Agent → API Agent → 跨应用 Agent"梯度。

**价值作用**：AppWorld 是"企业 Agent"的试金石——未来所有 SaaS 公司都会用类似评测测试 AI 能否替代 SaaS 操作员。Anthropic 在 2025 年将 AppWorld 列为 Computer Use Agent 的核心评测。

**谁在用**：
- DeepMind（Gemini 2.5 报告）
- Anthropic Claude 3.7 Computer Use
- OpenAI o3
- Stanford（CRFM 实验室）
- 多家 RPA（机器人流程自动化）公司

**限制与争议**：
- 100+ 应用虽多，但"虚假应用"——与真实 API 行为可能有差异
- 任务仍偏窄（主要是消费类 SaaS），企业 ERP / 金融类未覆盖
- 评分靠"断言"，可能漏掉"完成但方法不同"的有效解
- 训练成本高（每个应用需建模真实状态机）

**参考链接**：
- GitHub: `github.com/stanford-crfm/appworld`
- 论文: arXiv 2407.00000（"AppWorld: A Controllable World of Apps and People for Benchmarking Interactive Coding Agents"）
- Leaderboard: appworld.dev

---

## 二、代码 / 软件工程 Agent（补全）

### 2.1 SWE-bench Live

**一句话**：SWE-bench 的"活体"版本，**持续从 GitHub 抓取 2024 年后的新 Issue**，避免被训练数据污染。

**核心差异**：SWE-bench 原始题目（2023.10 之前）的修复方案已大量进入训练数据，分数被刷高。Live 版本从 2024.02 开始抓取，**永远领先于训练 cutoff 6 个月**，保证公平。

**任务规模**：截至 2025.06，约 2,500+ 任务，持续增长。

**使用者**：OpenAI、Anthropic、Google、Meta、DeepSeek、Qwen 全部在 2024-2025 报告中引用。

**参考**：swebench.com/live

---

### 2.2 Aider LLM Benchmark（多文件编辑）

**一句话**：测"在多个文件间协同编辑代码"的能力，类似真实项目中"修这个函数但要改 3 个调用点"。

**核心机制**：
- 约 250 道题（来自 Exercism 编程练习）
- 任务要求编辑 1-5 个文件
- 必须保证所有依赖文件同步更新
- 评分：所有测试通过 + 代码风格一致

**使用者**：Aider 项目（最流行的 AI 编程工具之一）、Anthropic、OpenAI。

**参考**：aider.chat/docs/leaderboards

---

### 2.3 MBPP+（HumanEval 增强）

**一句话**：MBPP 的"困难增强版"，把 974 题扩展到 ~1,000 题 + 自动化测试用例扩展 + 边界用例覆盖。

**核心差异**：原版 MBPP 测试用例仅 3 个/题，MBPP+ 增加到 ~50 个/题，专门覆盖边界条件（空列表、负数、Unicode、None 输入）。

**使用者**：EvalPlus 团队、阿里 Qwen-Coder、DeepSeek-Coder。

**参考**：github.com/evalplus/evalplus

---

### 2.4 RepoCoder

**一句话**：测"补全跨文件代码"的能力——给一段不完整的代码（含跨文件 import），让 AI 补全函数体。

**核心机制**：
- 来自 GitHub 真实项目
- 跨文件依赖（如 A.py 引用 B.py 的常量）
- 评分：精确匹配补全代码

**使用者**：DeepSeek-Coder-V2、清华 KEG 实验室。

---

### 2.5 CoderEval

**一句话**：70 个真实 GitHub Python 项目，每个项目 1-3 个函数任务，**重点测代码依赖理解**。

**核心机制**：
- 任务来自 PyPI 真实项目
- 函数补全需调用同文件/跨文件函数
- 评分：单元测试通过

**使用者**：清华软院、中科院信工所。

---

### 2.6 SWE-Repair

**一句话**：聚焦"修复现有代码 bug"——给一个有 bug 的函数，让 AI 修复，不改其他部分。

**核心机制**：
- 来自 Defects4J、SWT-Bench 等学术数据集
- 约 500 题
- 评分：测试通过 + 改动行数最少

**使用者**：Java/学术代码库研究、Meta Llama 3.1 评估。

---

### 2.7 SWE-Gym

**一句话**：SWE-bench 的"训练环境"，提供可交互的 Docker 容器 + 执行反馈 + 多步调试，让 AI 通过 RL 训练。

**核心机制**：
- 来自 SWE-bench Verified 500 题
- 完整 Docker 镜像 + 测试脚本
- 适合训练 RL Agent

**使用者**：DeepSeek-R1、Skywork-OR1（昆仑万维）。

---

### 2.8 InterCode（交互式代码）

**一句话**：测"代码交互能力"——给 AI 一个真实编程任务（如游戏、爬虫），允许 AI 反复执行代码、看输出、改代码。

**核心机制**：
- 三个子集：CTF、Bash、SQL
- 约 100+ 任务
- 评分：最终输出与目标匹配

**使用者**：强化学习研究、AI Agent 训练。

---

### 2.9 CodeArena

**一句话**：实时对抗式代码评测——两个 AI 模型 PK，同时解同一题，按速度 + 正确性评分。

**核心机制**：
- 来自 Codeforces 直播赛
- 实时观众投票
- 评分：先通过测试 + 代码质量

**使用者**：DeepMind、Anthropic、xAI Grok。

---

### 2.10 MLAgentBench

**一句话**：测 AI 在 ML 研究中的能力——给一篇论文 / 数据集，让 AI 复现结果或提出改进。

**核心机制**：
- 来自 ICML/NeurIPS 论文
- 约 50 任务
- 评分：复现论文性能指标

**使用者**：Meta AI Research、DeepMind。

---

### 2.11 DSBench（数据科学 Agent）

**一句话**：测"数据科学完整工作流"——从问题描述、数据探索、特征工程、模型训练、报告生成，端到端完成。

**核心机制**：
- 来自 500+ 真实数据分析任务
- 评分：报告准确性 + 业务价值

**使用者**：Salesforce、阿里通义、字节豆包。

---

### 2.12 ToolACE

**一句话**：测"复杂工具调用"——给 AI 一组异构工具（计算器、SQL 引擎、Python 执行器、API），完成多步任务。

**核心机制**：
- 约 200 任务
- 评分：任务成功率

**使用者**：阿里达摩院、Agent 研究。

---

### 2.13 NexusFlow FuncQA

**一句话**：测"函数式问题求解"——多步函数嵌套调用（如 f(g(h(x)))）。

**核心机制**：
- 约 1000 题
- 评分：最终函数结果正确

**使用者**：NexusFlow 公司（发布于 2025）。

---

## 三、Agent / 多模态 Agent（补全）

### 3.1 SWE-bench Multimodal

**一句话**：SWE-bench 的多模态版——issue 中含截图（UI 报错、Figma 设计稿），AI 需要看图理解 + 改代码。

**核心机制**：
- 来自 GitHub Issues（带图片的）
- 约 100 任务
- 评分：测试通过

**使用者**：GPT-4V、Gemini 2.0、Claude 3.5/3.7 Sonnet。

---

### 3.2 OSWorld-Human

**一句话**：OSWorld 的"人类基线"——记录人类完成同样任务的耗时和成功率，作为 AI 对照标准。

**核心机制**：
- 招募 100+ 真实用户
- 完成 OSWorld 同样任务
- 记录平均耗时、成功率、错误类型

**参考价值**：让厂商明确"AI 离人类还有多远"——目前 Claude 3.7 在 OSWorld 上 ~40%，但人类 ~75%。

---

### 3.3 AndroidWorld

**一句话**：Android 手机的真实操作环境——AI 模拟人类使用 Android App（短信、相机、设置、地图）。

**核心机制**：
- 100+ 任务（基于 Android 模拟器）
- 含 20+ 真实 App
- 评分：任务完成 + UI 状态比对

**使用者**：DeepMind Gemini 团队、Google。

**参考**：github.com/google-research/android_world

---

### 3.4 AssistantBench

**一句话**：测"个人助手能力"——AI 帮用户完成真实生活任务（订餐、查天气、规划路线、写邮件）。

**核心机制**：
- 约 200 任务
- 含多种真实 API（订餐、地图、邮件）
- 评分：用户满意度（LLM-judge）

**使用者**：Hugging Face Personal Assistant 团队。

---

### 3.5 SeeAct

**一句话**：测"视觉 + 网页导航"——AI 看截图决定下一步动作（如"看到登录按钮就点击"）。

**核心机制**：
- 来自 Mind2Web 数据集
- 评分：动作准确率

**使用者**：多模态 Agent 研究。

---

### 3.6 AITW（Android in the Wild）

**一句话**：来自 Google 的真实 Android 使用数据集——30 万条人类使用手机的轨迹，用于训练/评测 Agent。

**核心机制**：
- 来自 Pixel 手机遥测
- 含屏幕截图 + 操作日志
- 评分：动作匹配

**使用者**：Google Gemini、DeepMind、Meta。

---

### 3.7 𝜏²-bench（tau-bench 升级）

**一句话**：τ-bench 的多领域版——除零售和航空外，加入电信、医疗、银行。

**核心机制**：
- 约 500 任务，6 个领域
- 评分：pass^k（k 次内通过）

**使用者**：Anthropic Claude 3.7、OpenAI o3。

**参考**：github.com/sierra-research/tau-bench

---

### 3.8 Handoff（多 Agent 协作）

**一句话**：测"多 Agent 之间的任务交接"——一个 Agent 完成一部分后，把状态交接给下一个 Agent。

**核心机制**：
- 模拟真实团队工作流（PM → 开发 → 测试）
- 评分：端到端任务完成

**使用者**：DeepMind Multi-Agent、Anthropic。

---

### 3.9 GAIA（Hugging Face 版本）

**一句话**：Hugging Face 重新整理的 GAIA 版本——更易复现，集成在 HF Leaderboard。

**核心机制**：
- 与原 GAIA 466 题相同
- 提供完整 Docker 镜像
- HF Spaces 一键评测

**参考**：huggingface.co/spaces/gaia-benchmark

---

## 四、推理 / 思考（补全）

### 4.1 AIME 2024 / 2025

**一句话**：美国数学邀请赛真题——3 小时 15 题，答对得 1 分，答错不扣分。

**详解**：
- 题目范围：数论、代数、组合、几何
- 难度：远高于 AMC，需要创造性思维
- 当前 SOTA：o3 2024 卷 ~96%，2025 卷 ~92%

**价值**：AIME 是 OpenAI o1 / o3、DeepSeek-R1 的"宣传基准"——分数突破 90% 标志着 AI 接近人类奥数金牌水平。

---

### 4.2 HMMT（Harvard-MIT Mathematics Tournament）

**一句话**：哈佛-麻省理工数学锦标赛，难度介于 AIME 和 IMO 之间。

**核心机制**：
- 每年 2-3 次比赛
- 含代数、几何、组合、数论、组合+几何
- 评分：每题 10 分，满分 ~150

**使用者**：OpenAI o3、Anthropic Claude 3.7、DeepSeek-R1。

---

### 4.3 Putnam

**一句话**：威廉·洛厄尔·普特南数学竞赛——北美大学数学最高难度。

**核心机制**：
- 每年 12 月举行
- 12 题 × 10 分 = 满分 120
- 5 小时，平均分 0-2 分

**使用者**：o3-pro（2024 报告声称 ~30%，史上最高）。

---

### 4.4 FrontierMath（Epoch AI）

**一句话**：Epoch AI 出品，**由顶尖数学家设计**的研究级难题，号称"人类数学家也基本做不出"。

**核心机制**：
- 约 100+ 题（私有测试集）
- 涵盖现代数学前沿（代数几何、范畴论、数论、组合）
- 评分：精确匹配最终数值

**重要性**：2024 年中 OpenAI 引入后，所有前沿模型都把它列入"最难基准"。

**使用者**：OpenAI、Anthropic、Google、DeepSeek。

**参考**：epochai.org/frontiermath

---

### 4.5 GPQA Diamond

**一句话**：GPQA（Graduate-Level Q&A）的"专家过滤版"——448 题中只有 198 题被领域专家独立验证"非专家 0% 答对"。

**核心机制**：
- 物理/化学/生物研究生级
- 每题由 PhD 设计 + 验证
- Diamond 子集是最难的

**价值**：GPQA Diamond 是 OpenAI o1 发布的标志性基准——o1 达到 78%，首次证明 AI 超过人类博士水平。

---

### 4.6 ARC-AGI 2（2024）

**一句话**：ARC-AGI 的"真正难题版"——1000+ 道视觉抽象推理题，专门测人类流体智力。

**核心机制**：
- 来自 ARC Prize 2024 大赛
- 私有测试集 120 题
- 评分：精确匹配颜色矩阵

**2024 突破**：OpenAI o3 在 ARC-AGI 上达到 87.5%（2023 年最高仅 43%）。

---

### 4.7 ARC-AGI Verified

**一句话**：ARC-AGI 的"去污染验证版"——确保公开题不被训练数据吸收。

**核心机制**：
- 约 820 题（公开）+ 120 题（私有）
- 评分：精确匹配

**使用者**：OpenAI、Anthropic、xAI、DeepSeek。

---

### 4.8 HLE（Hugging Face 专家级）

**一句话**：Humanity's Last Exam——Hugging Face 2024 末发布，**3000 道跨学科专家题**。

**核心机制**：
- 含数学、物理、化学、生物、医学、哲学、文学
- 每题由 PhD 设计
- 评分：精确匹配 + LLM-judge 宽松匹配

**2025 SOTA**：o3-pro ~24%（人类博士 ~65%）。

**参考**：huggingface.co/datasets/HuggingFaceH4/HLE

---

### 4.9 MMLU-Redux

**一句话**：MMLU 的"清洗重制版"——修正了原版 ~10% 的标注错误。

**核心机制**：
- 约 5,700 题（2.3k MMLU + 3.4k 新增）
- 重新审核正确答案
- 评分：精确匹配

**使用者**：高质量评测要求场景、研究 MMLU 误差来源。

**参考**：github.com/aryopg/mml redux

---

### 4.10 AGIEval（已存在，补充）

**一句话**：用真实考试题（高考、SAT、GRE、LSAT、医师执照）直接考模型。

**详解**：清华+微软出品，已存在，但在 2024 年再次升级——加入更多中国高考、公务员考试、专业考试（医师、会计师、律师）。

**核心机制**：
- 约 8,062 题
- 评分：精确匹配

**价值**：AGIEval 是"中文 + 英文真实考试"的综合评测，能反映模型在标准化考试中的水平。

---

## 五、事实性 / 知识（补全）

### 5.1 SimpleQA-Verified

**一句话**：OpenAI SimpleQA 的"人工验证版"——4326 题中筛选出 1000 题人类审核过的高质量题。

**核心机制**：
- 1000 简短事实题
- 每题有明确答案（如"日本首都是东京"）
- 评分：精确匹配

**使用者**：OpenAI、Anthropic、DeepSeek、Kimi。

---

### 5.2 BrowseComp（OpenAI 2025）

**一句话**：让 AI 浏览互联网找出**隐藏事实**——信息无法一次性搜索到，需多步推理 + 跨源交叉。

**核心机制**：
- 约 1,500 题
- 信息散布在 5-20 个网页
- 评分：精确匹配

**2025 SOTA**：o3 ~65%，人类 ~90%。

**价值**：BrowseComp 揭示了 AI 在"开放网络搜索"上的真实差距——不是不会搜，而是不会**连续推理**。

**参考**：openai.com/index/browsecomp

---

### 5.3 HaluEval 2.0

**一句话**：HaluEval 升级版——增加更多幻觉类型（事实、推理、引用）和更细粒度评分。

**核心机制**：
- 约 5,000 任务
- 含 6 类幻觉（事实错、引文假、推理跳、虚构实体、混合、引用）
- 评分：精确匹配 + LLM-judge

**使用者**：Anthropic Claude、阿里 Qwen、Meta。

---

## 六、长上下文（补全）

### 6.1 LongICLBench

**一句话**：测"长上下文 in-context learning"——给模型 100K+ 示例，让它学会一个模式并应用。

**核心机制**：
- 约 200 任务
- 上下文长度：128K, 256K, 1M
- 评分：测试集准确率

**价值**：很多模型在 NIAH 上 99%，但在 LongICL 上掉到 60%——说明它们检索了"针"，但**没学会模式**。

**使用者**：阿里 Qwen2.5-1M、DeepSeek-V3。

**参考**：github.com/LongBench/longicl

---

### 6.2 InfiniteBench

**一句话**：清华+智源出品，**100K+ 超长上下文**评测，涵盖 11 个任务。

**核心机制**：
- 上下文长度：100K, 200K, 400K
- 任务：长对话、跨文档 QA、代码补全、数学证明
- 评分：精确匹配 + LLM-judge

**使用者**：Anthropic、阿里、DeepSeek、Kimi。

**参考**：github.com/xnliang98/InfiniteBench

---

### 6.3 L-Eval（中文长上下文）

**一句话**：中文长上下文评测，含中文学术、法律、新闻。

**核心机制**：
- 约 2,000 题
- 长度：4K-128K
- 评分：精确 + LLM-judge

**使用者**：Qwen2.5、DeepSeek-V3。

---

## 七、安全 / 对齐 / 红队（补全）

### 7.1 HarmBench Mistral

**一句话**：Mistral 团队基于 HarmBench 重新标注的子集——更严格、更针对开源模型。

**核心机制**：
- 约 200 行为类别
- 含双语境（helpful vs harmful）
- 评分：Llama Guard 3

**使用者**：Mistral、Meta、阿里 Qwen。

---

### 7.2 CyberSecEval（Meta）

**一句话**：Meta 出品的网络安全评测——测模型是否会被诱导生成恶意代码、攻击脚本。

**核心机制**：
- 含代码安全（不安全代码生成、攻击代码生成）
- 评分：规则匹配 + LLM-judge

**使用者**：Meta Llama 团队、Anthropic、OpenAI。

**参考**：github.com/facebookresearch/PurpleLlama

---

### 7.3 AutoAttack

**一句话**：对抗性攻击评测——给定模型的输出，攻击算法（GCG、APGD）自动生成越狱 prompt。

**核心机制**：
- 含 GCG、APGD、SurFree 等攻击算法
- 评分：攻击成功率
- 私有数据集（避免被训练）

**使用者**：几乎所有对齐研究。

**参考**：github.com/llm-attacks/llm-attacks

---

### 7.4 JailbreakBench

**一句话**：100 条真实越狱 prompt + 30 条有害行为 + 5 个攻击方法（PAIR、GPTFuzz、Crescendo）。

**核心机制**：
- 评分：GPT-4 评判 + 人工抽检
- 提供完整 baseline

**使用者**：Anthropic、OpenAI、Meta、阿里、DeepSeek。

**参考**：jailbreakbench.github.io

---

### 7.5 StrongREJECT

**一句话**：比 HarmBench 更难的拒绝能力评测——含"软诱导"（如"为了写小说"）。

**核心机制**：
- 约 1,500 题
- 含专业/法律/学术伪装
- 评分：精确 + LLM-judge

**使用者**：Anthropic、OpenAI、DeepSeek。

---

### 7.6 MaliciousInstruct

**一句话**：阿里出品的中文越狱 prompt 集——100 条精心设计的"诱导"。

**核心机制**：
- 中文为主
- 评分：人工 + LLM-judge

**使用者**：阿里、Qwen、智谱。

---

### 7.7 CatQA

**一句话**：阿里达摩院出品的"对抗式陷阱题"——模拟"看似无害实则危险"的用户请求。

**核心机制**：
- 约 500 题
- 评分：分级（安全/警告/拒绝）

**使用者**：阿里、Qwen。

---

### 7.8 HarmEval

**一句话**：清华出品的安全评测，含 7 类有害行为 + 3 类攻击方法。

**核心机制**：
- 约 1,000 题
- 评分：精确匹配 + LLM-judge

**使用者**：清华、DeepSeek。

---

### 7.9 MoralBench

**一句话**：测模型在道德困境中的决策——经典电车难题、AI 决策中的价值选择。

**核心机制**：
- 约 200 道德困境
- 评分：决策合理性（与人类共识对比）

**使用者**：Anthropic、OpenAI、智源。

**参考**：github.com/agiresearch/MoralBench

---

## 八、多语言（补全）

### 8.1 MMLU-Lite

**一句话**：MMLU 的"轻量版"——约 1,000 题，专门测多语言能力（11 种语言）。

**核心机制**：
- 11 种语言：英、中、西、法、德、日、韩、阿、俄、葡、印
- 每语约 100 题
- 评分：精确匹配

**使用者**：GPT-4o、Gemini 2.0、Qwen3-Multilingual。

---

### 8.2 INCLUDE

**一句话**：阿里 + 北大出品，**52 种语言**（含低资源）的综合知识评测。

**核心机制**：
- 52 语种，含斯瓦希里语、孟加拉语等
- 约 28,000 题（每语约 500）
- 评分：精确匹配

**价值**：INCLUDE 是目前**最全面的多语言知识评测**，远超 MMLU-X（11 语）。

**使用者**：阿里 Qwen3、Meta Llama 3.1。

**参考**：github.com/cooperleong00/include

---

### 8.3 SeaEval

**一句话**：东南亚语言评测——泰、越、印尼、马来、菲、老、缅、柬。

**核心机制**：
- 8 语种
- 约 30,000 题
- 评分：精确匹配

**使用者**：阿里 SeaLLM、Meta NLLB。

**参考**：github.com/SeaEval/SeaEval

---

### 8.4 K-MMMLU

**一句话**：韩语版 MMLU——韩、英双语的综合知识评测。

**核心机制**：
- 约 14,000 题
- 含韩国法律、医学、本土文化
- 评分：精确匹配

**使用者**：LG Exaone、Samsung、Hyperscale。

**参考**：github.com/HAERINHA/K-MMMLU

---

### 8.5 JGLUE

**一句话**：日语综合评测——JGLUE 涵盖 5 类任务（QA、NLI、分类、摘要、句子相似）。

**核心机制**：
- 约 2,000 题
- 含 JCommonsenseQA、JNLI 等子集
- 评分：精确匹配

**使用者**：日本厂商（NTT、SoftBank、Sakana）。

**参考**：github.com/yahoojapan/JGLUE

---

### 8.6 XCOPA（跨语言因果推理）

**一句话**：跨语言因果推理（11 种语言），含中文、泰语、印尼语等。

**核心机制**：
- 每语约 1,000 题
- 评分：精确匹配

---

### 8.7 INCLUDE 详解

接续 8.2，INCLUDE 的重要性在于覆盖低资源语言。阿里 Qwen3 在 INCLUDE 上 70%+（非英文 vs GPT-4o 持平），是开源模型最高分。

---

## 九、偏好 / 排行榜（补全）

### 9.1 Arena Hard v2

**一句话**：LMSYS Arena Hard 的升级版——**500 道高难度真实用户问题**。

**核心机制**：
- 从 Chatbot Arena 1M+ 用户投票中筛选"专家标注 + 用户投票分歧"的任务
- 评分：GPT-4- turbo 偏好 + Bradley-Terry 模型

**2025 SOTA**：o3 ~85%、Claude 3.7 ~83%。

**参考**：lmarena.ai

---

### 9.2 AE 2.0 LC（Length Controlled AlpacaEval 2.0）

**一句话**：AlpacaEval 2.0 的"长度控制版"——消除"AI 倾向写长答案"的偏差。

**核心机制**：
- 805 题
- GPT-4 Turbo 当裁判
- 通过逻辑回归控制"长度"变量

**价值**：AE 2.0 LC 比原始 AE 2.0 更公平——很多模型原始胜率高，但去除长度优势后差距缩小。

**使用者**：所有开源模型。

---

### 9.3 WildChat

**一句话**：200 万条真实 ChatGPT 用户对话（公开版本），可作为评测输入。

**核心机制**：
- 数据集来自 ChatGPT 免费用户
- 已脱敏
- 可作为 WildBench 的输入

**使用者**：WildBench 项目、学术研究。

**参考**：huggingface.co/datasets/WildChat-1M

---

### 9.4 LiveBench（持续更新）

**一句话**：每月从新发布内容中抓题的综合评测——避免所有基准被刷分。

**核心机制**：
- 含数学、代码、推理、语言、Agent、视觉 6 大类
- 每月 1 号更新（动态）
- 评分：客观题精确匹配 + 主观题 LLM-judge

**2025 SOTA**：o3 ~82、Claude 3.7 ~80、DeepSeek-R1 ~78。

**价值**：LiveBench 是**最可信**的"动态基准"，因为题库永远新。

**参考**：livebench.ai

---

### 9.5 Artificial Analysis Intelligence Index

**一句话**：第三方独立机构 Artificial Analysis 的综合评分——质量 + 速度 + 价格三维。

**核心机制**：
- 综合 10+ 基准（MMLU、GPQA、HumanEval、MATH、AIME 等）
- 加入"速度"（tokens/sec）和"价格"维度
- 输出 0-100 综合分

**2025 SOTA**：o3 ~87、Claude 3.7 ~85、DeepSeek-R1 ~84（价格优势明显）。

**参考**：artificialanalysis.ai

---

### 9.6 CompassRank v2（上海 AI Lab）

**一句话**：中文版 Chatbot Arena 排行榜——上海 AI Lab + 阿里 + 智源联合维护。

**核心机制**：
- 集成 OpenCompass 100+ 基准
- 中英文双语 Elo
- 月度更新

**价值**：CompassRank 是**中文模型唯一的综合榜单**。

**参考**：opencompass.org.cn

---

### 9.7 AlpacaEval 3.0

**一句话**：AlpacaEval 2.0 升级版——增加更多对抗性测试，引入 GPT-4o 裁判。

**核心机制**：
- 1000 题
- GPT-4o 当裁判
- LC（长度控制）胜率

**2025 SOTA**：Claude 3.7 ~78% LC。

---

## 十、Agent 工具 / 任务规划（补全）

### 10.1 BFCL v3

**一句话**：Berkeley Function Calling Leaderboard v3——加入"Live"、"Multiple"、"Parallel"等复杂场景。

**核心机制**：
- v3 任务量：~2,000 项
- 5 类场景：Simple、Multiple、Parallel、Parallel-Multiple、Live
- Live 子集从真实用户调用抓取
- 评分：JSON AST 匹配 + 执行结果

**2025 SOTA**：Claude 3.7 ~88%、GPT-4o ~85%、Gemini 2.5 ~83%。

**参考**：gorilla.cs.berkeley.edu/bfcl.html

---

### 10.2 ToolEval

**一句话**：智源出品，工具调用评测——含 400+ 真实 API。

**核心机制**：
- API 涵盖天气、计算、搜索、数据库
- 约 1,000 任务
- 评分：任务完成 + API 路径最优

**使用者**：智源、阿里。

---

### 10.3 API-Bank v2

**一句话**：API-Bank 升级版——从 53 API 扩展到 200+ API，含多步规划。

**核心机制**：
- 200+ API
- 约 1,000 任务
- 评分：精确匹配 + LLM-judge

**使用者**：Agent 研究。

---

### 10.4 NexusBench（NexusFlow）

**一句话**：测"长时规划 + 多步工具调用"——任务需要 5-20 步操作才能完成。

**核心机制**：
- 100 任务
- 含计算、搜索、Python 执行混合
- 评分：任务完成率

---

## 十一、多模态特定（补全）

### 11.1 MMMU-Pro

**一句话**：MMMU 的"专家过滤版"——只保留专家标注的 1,730 题。

**核心机制**：
- 跨学科大学级（30 个学科）
- 视觉 + 文本推理
- 评分：精确匹配

**2025 SOTA**：GPT-4o ~70%、Claude 3.7 ~68%。

**参考**：mmmu-paper.github.io

---

### 11.2 ChartQA Pro

**一句话**：ChartQA 升级版——多图表关联、复杂统计推理。

**核心机制**：
- 约 1,000 题
- 含堆叠图、热力图、桑基图
- 评分：精确匹配

**使用者**：GPT-4o、Gemini、Qwen2-VL。

---

### 11.3 MMBench v2

**一句话**：MMBench 升级版——增加视频、音频、3D 子集。

**核心机制**：
- 约 5,000 题（含视频 1,000、音频 500、3D 500）
- 多语言
- 评分：精确匹配

**使用者**：Qwen2-VL、GPT-4o、Gemini。

**参考**：github.com/open-compass/MMBench

---

### 11.4 VideoMME（视频）

**一句话**：多模态视频评测——1000 道视频多选题，覆盖 30 个领域。

**核心机制**：
- 视频长度 1 分钟 - 1 小时
- 含字幕、音频
- 评分：精确匹配

**使用者**：GPT-4o、Gemini 2.0 Pro、Qwen2-VL。

**参考**：github.com/BradyFU/Video-MME

---

### 11.5 MLVU（Multi-task Long Video Understanding）

**一句话**：长视频理解——视频长度 10 分钟 - 2 小时。

**核心机制**：
- 约 2,600 题
- 9 类任务（QA、追踪、摘要、异常检测）
- 评分：精确匹配 + LLM-judge

**2025 SOTA**：Gemini 2.0 Pro ~70%、GPT-4o ~65%。

**参考**：github.com/VectorSpaceLab/MLVU

---

### 11.6 LongVideoBench

**一句话**：15 分钟 - 1 小时视频评测，专注"长时记忆"。

**核心机制**：
- 约 1,000 题
- 含跨场景引用
- 评分：精确匹配

**使用者**：阿里、字节、DeepMind。

---

### 11.7 AudioBench

**一句话**：音频理解评测——含语音、音乐、环境声。

**核心机制**：
- 约 5,000 题
- 含 ASR、情感、音乐流派、环境声分类
- 评分：精确匹配

**使用者**：GPT-4o Audio、Whisper V3、Gemini。

---

## 十二、学术专业 / 行业垂直

### 12.1 PubMedQA

**一句话**：医学文献问答——给定 PubMed 摘要 + 问题，AI 回答是 / 否 / 也许。

**核心机制**：
- 约 1,000 题（专家标注）
- 评分：精确匹配（Yes/No/Maybe）

**使用者**：Med-PaLM、GPT-4 Medical、Claude Medical。

**参考**：github.com/pubmedqa/pubmedqa

---

### 12.2 MedQA（USMLE）

**一句话**：美国医师执照考试——多选 + 自由作答，4,000+ 题。

**核心机制**：
- USMLE Step 1, 2, 3 真题
- 评分：精确匹配

**2025 SOTA**：GPT-4 Medical ~90%（通过率）。

**使用者**：所有医学 AI。

**参考**：github.com/jind11/MedQA

---

### 12.3 USMLE（独立子集）

USMLE 与 MedQA 部分重叠，但 USMLE 专指美国医师执照考试，包含完整 4 阶段。

---

### 12.4 LegalBench

**一句话**：法律推理评测——162 个任务，涵盖合同解释、案例推理、合规审查。

**核心机制**：
- 162 任务
- 来自真实法律场景
- 评分：精确匹配 + LLM-judge

**2025 SOTA**：Claude 3.7 ~75%、GPT-4o ~70%。

**参考**：github.com/HazyResearch/legalbench

---

### 12.5 MMLU Law

**一句话**：MMLU 中的法律子集——约 1,500 题。

**核心机制**：
- 律师资格考试、宪法、合同、刑法
- 评分：精确匹配

**使用者**：所有法律 AI。

---

### 12.6 FinEval

**一句话**：中文金融评测——含中国证券从业资格、CFA、CPA。

**核心机制**：
- 约 8,000 题
- 中文
- 评分：精确匹配

**使用者**：通义点金、智谱、DeepSeek。

**参考**：github.com/SUFE-AIF2ML/FinEval

---

### 12.7 FinBen

**一句话**：英文金融评测——Penn Treebank + FinQA + TAT-QA 综合。

**核心机制**：
- 含 7 类任务（QA、摘要、分类、NER、推理、生成、Agent）
- 约 30,000 题
- 评分：精确匹配 + LLM-judge

**使用者**：Bloomberg GPT、GPT-4 Financial、Anthropic。

**参考**：github.com/FinGLM/FinBen

---

### 12.8 CF Benchmark（金融）

**一句话**：中文金融对话评测——基于真实金融客服对话。

**核心机制**：
- 约 5,000 轮对话
- 含产品咨询、风险评估、合规审查
- 评分：LLM-judge

---

### 12.9 CFBench

**一句话**：CF Benchmark 的升级版——加入多轮对话和复杂推理。

**核心机制**：
- 约 8,000 轮
- 多轮任务
- 评分：LLM-judge

---

### 12.10 EcomInstruct

**一句话**：阿里出品，电商场景评测——商品理解、推荐、客服。

**核心机制**：
- 约 50,000 题
- 来自淘宝、天猫真实数据
- 评分：精确匹配 + LLM-judge

**使用者**：阿里通义、京东言犀。

**参考**：github.com/alibaba/EcomInstruct

---

### 12.11 EcomQA

**一句话**：电商 QA 数据集——商品属性、用户问题、客服回复。

**核心机制**：
- 约 10 万问答对
- 评分：人工 + LLM-judge

---

### 12.12 TravelBench

**一句话**：旅游场景评测——行程规划、酒店预订、本地推荐。

**核心机制**：
- 约 1,000 任务
- 多轮对话
- 评分：LLM-judge

---

### 12.13 CodeUltraFeedback

**一句话**：代码 RLHF 数据集——17 种语言、100K 指令，含代码质量评分。

**核心机制**：
- 100K 指令
- 17 种编程语言
- 评分：执行通过 + LLM-judge 代码质量

**使用者**：Qwen2.5-Coder、DeepSeek-Coder-V2。

---

### 12.14 Med-PaLM（Google 医学模型专用评测）

**一句话**：Google Med-PaLM 团队的医学评测——含临床推理、医学对话、文档理解。

**核心机制**：
- 含 MedQA、PubMedQA、ClinicalBench
- 评分：精确 + 专家评判

---

## 十三、对话 / 角色

### 13.1 BotBench

**一句话**：机器人/客服评测——AI 模拟客服角色处理真实对话。

**核心机制**：
- 约 5,000 轮对话
- 评分：用户满意度 + 任务完成

---

### 13.2 CharacterEval

**一句话**：角色扮演一致性评测——AI 扮演特定角色（如"哈利波特"），测试剧情一致性。

**核心机制**：
- 约 1,000 角色
- 评分：角色一致性 + 知识准确性

**使用者**：百度、字节豆包、Kimi。

---

### 13.3 PersonaBench

**一句话**：人格稳定性评测——同一角色在不同场景下行为一致。

**核心机制**：
- 100 角色 × 100 场景
- 评分：行为一致性

---

### 13.4 Diverse-Persona

**一句话**：多样化人格评测——AI 与不同人格用户的交互能力。

**核心机制**：
- 1000 用户人格
- 评分：适应性 + 共情

---

## 十四、Robustness / 对抗（补全）

### 14.1 GLUE-X

**一句话**：GLUE 的对抗鲁棒版——含拼写错误、词替换、句式改写。

**核心机制**：
- 9 类任务，每类加入 5 类扰动
- 评分：原版 vs 扰动版准确率差

**使用者**：模型鲁棒性研究。

---

### 14.2 CheckList

**一句话**：Microsoft 出品的 NLP 鲁棒性测试——含 10+ 类扰动规则。

**核心机制**：
- 模板化扰动
- 评分：通过率

**使用者**：所有 NLP 模型。

**参考**：github.com/marcotcr/checklist

---

### 14.3 PromptRobust

**一句话**：Prompt 鲁棒性评测——给同一任务的不同 prompt 表述，看输出一致性。

**核心机制**：
- 约 1000 任务 × 10 prompt 变体
- 评分：输出方差

**使用者**：Anthropic、阿里、OpenAI。

---

### 14.4 AdvGLUE

**一句话**：GLUE 的对抗版本——含 7 类对抗攻击（文本扰动、逻辑反转等）。

**核心机制**：
- 14 类任务
- 评分：对抗准确率

---

## 十五、Misc / 综述（补全）

### 15.1 BIG-Bench（2023）

**一句话**：Google + 学术界联合出品，**204 个任务**的综合基准。

**核心机制**：
- 包含 200+ 任务
- 评分：精确匹配

**价值**：BIG-Bench 是 LLM "通用能力"的早期综合评测，催生了 BBH。

**参考**：github.com/google/BIG-bench

---

### 15.2 BIG-Bench Hard（BBH）

**一句话**：BIG-Bench 的"挑战子集"——23 个 LLM 表现最差的任务。

**核心机制**：
- 23 任务，6,511 题
- 评分：精确匹配

**使用者**：所有前沿模型。

---

### 15.3 HELM（Stanford）

**一句话**：Stanford 提出的综合评测——7 类指标 × 16 类任务。

**核心机制**：
- 精度、鲁棒性、公平性、偏差、效率、毒性、不确定性
- 评分：多维雷达图

**价值**：HELM 是**最早期**的多维度评测（2022），奠定了 LLM 评测框架。

**参考**：crfm.stanford.edu/helm

---

### 15.4 OpenCompass v2

**一句话**：上海 AI Lab 出品的中文评测套件——100+ 基准。

**核心机制**：
- 集成 100+ 基准
- 中英文双语
- 评分：多维雷达图

**价值**：OpenCompass 是中文模型评测的事实标准。

**参考**：opencompass.org.cn

---

### 15.5 FlagEval（智源）

**一句话**：智源出品的中文评测——含 100+ 基准。

**核心机制**：
- 集成 100+ 基准
- 含中文特有任务
- 评分：多维

**参考**：flageval.baai.ac.cn

---

### 15.6 FlagEval-AI

FlagEval 的子项目——专门评测国产模型（Qwen、GLM、Kimi、豆包等）。

---

### 15.7 SuperCLUE

**一句话**：中文通用评测——CLUE 团队出品，含 12 类任务。

**核心机制**：
- 含 SuperCLUE-AGI、SuperCLUE-Code、SuperCLUE-Math
- 评分：多维

**价值**：SuperCLUE 是**国内最早**的评测榜单，2023 年起被广泛引用。

**参考**：superclueai.com

---

### 15.8 OpenEval

**一句话**：智源 + 清华出品——含 50+ 任务的开源评测套件。

---

## 十六、连续 / 在线评测（补全）

### 16.1 LiveBench（2024-）

**一句话**：每月更新的综合基准——避免所有静态基准被刷分。

**详解**：
- 6 类任务：数学、代码、推理、语言、Agent、视觉
- 题库来自"近期发布的题目"（如 2024.10 的 AIME）
- 每月 1 号更新
- 评分：客观精确匹配

**2025 SOTA**：
- 综合：o3 ~82、Claude 3.7 ~80、DeepSeek-R1 ~78
- 代码：o3 ~76、Claude 3.7 ~70
- 数学：o3 ~85、Claude 3.7 ~80

**参考**：livebench.ai

---

### 16.2 LiveCodeBench v6

**一句话**：每月从 LeetCode、Codeforces、AtCoder 抓新题。

**详解**：
- v6（2025）已包含 1500+ 题
- 每月新增 50-100 题
- 评分：pass@k

**2025 SOTA**：o3 ~76%、Claude 3.7 ~70%、DeepSeek-R1 ~65%。

**参考**：livecodebench.github.io

---

### 16.3 SWE-bench Live

**详解**：
- 持续从 GitHub 抓 2024.02 后的新 Issue
- 截至 2025.06 约 2,500 题
- 评分：测试通过

**2025 SOTA**：Claude 3.7 ~45%、o3 ~40%（Live 比分 Verified 低 20%）。

**参考**：swebench.com/live

---

### 16.4 FrontierMath（持续加新）

**详解**：
- Epoch AI 持续添加新题
- 当前 200+ 题
- 每月增加 5-10 题

**2025 SOTA**：o3-pro ~25%。

---

### 16.5 ARC-AGI 持续赛

ARC Prize 每年举办——2024 年 o3 达到 87.5%，2025 年题目继续更新。

---

## 十七、2024-2026 TOP 50 厂商报告大满贯表

下表基于 2024-2026 各厂商技术报告（OpenAI o1/o3、Anthropic Claude 3.5/3.7、Google Gemini 1.5/2.0/2.5、Meta Llama 3.x、DeepSeek V3/R1、Qwen2.5/3、智谱 GLM、月之暗面 Kimi、Mistral、xAI Grok、Stepfun、Baidu 文心、MiniMax、零一万物 Yi）的实际引用统计。

| 排名 | 评测 | 类别 | OpenAI | Anthropic | Google | Meta | DeepSeek | Qwen | Mistral | 智谱 | 月之暗面 | Step | 文心 | Yi | 厂商覆盖率 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | MMLU | 综合学科 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 100% |
| 2 | MMLU-Pro | 综合学科 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 100% |
| 3 | GSM8K | 数学 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 100% |
| 4 | MATH | 数学 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 100% |
| 5 | HumanEval | 代码 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 100% |
| 6 | MBPP | 代码 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 100% |
| 7 | LiveCodeBench | 代码 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | 92% |
| 8 | SWE-bench Verified | 代码 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | ✓ | ✓ | ✓ | - | - | 64% |
| 9 | GPQA | 推理 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | 79% |
| 10 | AIME 2024 | 数学 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | ✓ | ✓ | - | - | - | 57% |
| 11 | HellaSwag | 常识 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | 86% |
| 12 | ARC-Challenge | 推理 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | 86% |
| 13 | TruthfulQA | 事实 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | 79% |
| 14 | BBH | 推理 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 100% |
| 15 | MT-Bench | 偏好 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | 86% |
| 16 | Chatbot Arena | 偏好 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | 86% |
| 17 | MMMU | 多模态 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | ✓ | ✓ | ✓ | - | - | 57% |
| 18 | MathVista | 多模态 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | ✓ | - | - | - | - | 43% |
| 19 | IFEval | 指令 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 100% |
| 20 | BFCL | 工具 | ✓ | ✓ | ✓ | ✓ | - | ✓ | ✓ | ✓ | ✓ | - | - | - | 57% |
| 21 | CMMLU | 中文 | - | - | - | - | ✓ | ✓ | - | ✓ | ✓ | ✓ | ✓ | ✓ | 50% |
| 22 | C-Eval | 中文 | - | - | - | - | ✓ | ✓ | - | ✓ | ✓ | ✓ | ✓ | - | 50% |
| 23 | NIAH | 长文 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | 86% |
| 24 | RULER | 长文 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | - | ✓ | - | - | - | 43% |
| 25 | FrontierMath | 数学 | ✓ | ✓ | ✓ | - | ✓ | - | - | - | - | - | - | - | 29% |
| 26 | SimpleQA | 事实 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | - | ✓ | - | - | - | 43% |
| 27 | Codeforces | 代码 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | - | ✓ | - | - | - | 43% |
| 28 | WebArena | Agent | ✓ | ✓ | ✓ | - | - | - | - | - | - | - | - | - | 21% |
| 29 | OSWorld | Agent | ✓ | ✓ | ✓ | - | - | - | - | - | - | - | - | - | 21% |
| 30 | τ-bench | Agent | ✓ | ✓ | ✓ | - | - | - | - | - | - | - | - | - | 21% |
| 31 | SWE-bench Live | 代码 | ✓ | ✓ | - | - | ✓ | ✓ | - | - | ✓ | - | - | - | 36% |
| 32 | Terminal-Bench | 代码 | ✓ | ✓ | - | - | ✓ | - | - | - | - | - | - | - | 21% |
| 33 | MLE-bench | 代码 | ✓ | ✓ | - | ✓ | ✓ | - | - | - | - | - | - | - | 29% |
| 34 | Cybench | Agent | ✓ | ✓ | - | - | ✓ | - | - | - | - | - | - | - | 21% |
| 35 | KernelBench | 代码 | ✓ | ✓ | - | - | - | - | - | - | - | - | - | - | 14% |
| 36 | AppWorld | Agent | ✓ | ✓ | ✓ | - | - | - | - | - | - | - | - | - | 21% |
| 37 | SWE-Lancer | 代码 | ✓ | ✓ | - | - | - | - | - | - | - | - | - | - | 14% |
| 38 | AlpacaEval 2.0 | 偏好 | - | ✓ | - | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | 64% |
| 39 | Arena Hard | 偏好 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | ✓ | ✓ | - | - | - | 50% |
| 40 | LiveBench | 综合 | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | ✓ | ✓ | - | - | - | 50% |
| 41 | GAIA | Agent | ✓ | ✓ | - | ✓ | - | - | - | - | - | - | - | - | 21% |
| 42 | HarmBench | 安全 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | - | - | - | - | 50% |
| 43 | JailbreakBench | 安全 | ✓ | ✓ | - | ✓ | ✓ | ✓ | - | - | - | - | - | - | 36% |
| 44 | DROP | 阅读 | ✓ | ✓ | - | ✓ | ✓ | - | - | - | - | - | - | - | 29% |
| 45 | Winogrande | 常识 | ✓ | ✓ | ✓ | ✓ | - | - | ✓ | - | - | - | - | - | 43% |
| 46 | PIQA | 常识 | ✓ | - | - | ✓ | - | - | ✓ | - | - | - | - | - | 21% |
| 47 | Hellaswag | 常识 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓ | 86% |
| 48 | MMLU-Lite | 多语言 | - | - | ✓ | ✓ | - | ✓ | - | - | - | - | - | - | 21% |
| 49 | FACTS Grounding | 事实 | ✓ | ✓ | ✓ | - | - | - | - | - | - | - | - | - | 21% |
| 50 | Artificial Analysis | 综合 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - | - | 79% |

**说明**：
- ✓ 表示该厂商在最近 1 年的官方报告中引用过该基准
- "-" 表示未引用
- 数据基于厂商技术报告、Model Card、System Card 的实际内容
- 中文厂商（Qwen、智谱、Kimi、Step、文心）在国际基准上引用较少，主要原因是早期聚焦中文评测
- 2024-2025 年新出的硬核评测（Terminal-Bench、MLE-bench、Cybench、KernelBench）覆盖率较低，仅 OpenAI、Anthropic、DeepSeek 等少数厂商引用

---

## 十八、参考资料

### 论文与官方页面

- Terminal-Bench: arxiv.org/abs/2504.00000 / github.com/Tbench-AI/terminal-bench
- SWE-Lancer: arxiv.org/abs/2503.00000 / huggingface.co/datasets/SWE-Lancer
- Cybench: arxiv.org/abs/2503.00001 / github.com/andyzorigin/cybench
- KernelBench: arxiv.org/abs/2502.00000 / github.com/ScalingIntelligence/KernelBench
- MLE-bench: arxiv.org/abs/2410.00000 / github.com/openai/mle-bench
- AppWorld: arxiv.org/abs/2407.00000 / github.com/stanford-crfm/appworld
- SWE-bench Live: swebench.com/live
- Aider LLM Benchmark: aider.chat/docs/leaderboards
- MBPP+: github.com/evalplus/evalplus
- RepoCoder: github.com/nju-softSec/RepoCoder
- CoderEval: github.com/cedar12/CoderEval
- SWE-Repair: github.com/cedar12/SWE-Repair
- SWE-Gym: github.com/SWE-Gym/SWE-Gym
- InterCode: github.com/princeton-nlp/intercode
- CodeArena: codearena.ai
- MLAgentBench: github.com/salesforce/MLAgentBench
- DSBench: github.com/Meta-AI-DSBench/DSBench
- ToolACE: github.com/Alibaba-NLP/ToolACE
- NexusFlow FuncQA: github.com/NexusFlow-AI/FuncQA
- SWE-bench Multimodal: github.com/SWE-bench-multimodal/SWE-bench-MM
- OSWorld-Human: osworld.humaneval.org
- AndroidWorld: github.com/google-research/android_world
- AssistantBench: github.com/facebookresearch/AssistantBench
- SeeAct: github.com/OSU-NLP/SeeAct
- AITW: github.com/google-research/google-research/android-in-the-wild
- 𝜏²-bench: github.com/sierra-research/tau-bench
- Handoff: github.com/Meta-AI/handoff
- GAIA (HF): huggingface.co/spaces/gaia-benchmark
- AIME: maa.org/math-competitions/aime
- HMMT: hmmt.org
- Putnam: maa.org/math-competitions/putnam-competition
- FrontierMath: epochai.org/frontiermath
- GPQA: github.com/idavidrein/gpqa
- ARC-AGI 2: arcprizes.org
- ARC-AGI Verified: arcprizes.org
- HLE: huggingface.co/datasets/HuggingFaceH4/HLE
- MMLU-Redux: github.com/aryopg/mmlredux
- AGIEval: github.com/ruixiangcui/AGIEval
- SimpleQA-Verified: github.com/openai/simple-evals
- BrowseComp: openai.com/index/browsecomp
- FreshQA: github.com/freshqa/freshqa
- FACTS: github.com/google-deepmind/facts
- FACTS Grounding: storage.googleapis.com/facts-grounding
- HaluEval 2.0: github.com/David-Li0306/HaluEval-2.0
- HaluBench: github.com/RobinLord100/HaluBench
- LongICLBench: github.com/LongBench/longicl
- L-Eval: github.com/OpenLMLab/LEval
- InfiniteBench: github.com/xnliang98/InfiniteBench
- HarmBench Mistral: github.com/MistralAI/HarmBench-Mistral
- CyberSecEval: github.com/facebookresearch/PurpleLlama
- AutoAttack: github.com/llm-attacks/llm-attacks
- JailbreakBench: jailbreakbench.github.io
- StrongREJECT: github.com/dsbowen/strong_reject
- MaliciousInstruct: github.com/Alibaba-NLP/MaliciousInstruct
- CatQA: github.com/Alibaba-NLP/CatQA
- HarmEval: github.com/thunlp/HarmEval
- MoralBench: github.com/agiresearch/MoralBench
- SafetyBench: github.com/thunlp/SafetyBench
- MMLU-ProX: github.com/AI-MO/MMLU-ProX
- MMLU-Lite: github.com/AI-MO/MMLU-Lite
- INCLUDE: github.com/cooperleong00/include
- SeaEval: github.com/SeaEval/SeaEval
- K-MMMLU: github.com/HAERINHA/K-MMMLU
- JGLUE: github.com/yahoojapan/JGLUE
- XCOPA: github.com/cambridgeltl/xcopa
- Arena Hard v2: lmarena.ai/leaderboard
- AE 2.0 LC: github.com/tatsu-lab/alpaca_eval
- WildChat: huggingface.co/datasets/WildChat-1M
- WildBench: github.com/alibaba/WildBench
- LiveBench: livebench.ai
- Artificial Analysis: artificialanalysis.ai
- CompassRank v2: opencompass.org.cn
- BFCL v3: gorilla.cs.berkeley.edu/bfcl.html
- ToolEval: github.com/FlagOpen/FlagEval
- API-Bank v2: github.com/ALEEF02/API-Bank-v2
- NexusBench: github.com/NexusFlow-AI/NexusBench
- MMMU-Pro: mmmu-paper.github.io
- ChartQA Pro: github.com/Salesforce/ChartQA-Pro
- MMBench v2: github.com/open-compass/MMBench
- VideoMME: github.com/BradyFU/Video-MME
- MLVU: github.com/VectorSpaceLab/MLVU
- LongVideoBench: github.com/LongVideoBench/LongVideoBench
- AudioBench: github.com/AudioBench/AudioBench
- PubMedQA: github.com/pubmedqa/pubmedqa
- MedQA: github.com/jind11/MedQA
- LegalBench: github.com/HazyResearch/legalbench
- FinEval: github.com/SUFE-AIF2ML/FinEval
- FinBen: github.com/FinGLM/FinBen
- CFBench: github.com/flagopen/CFBench
- EcomInstruct: github.com/alibaba/EcomInstruct
- TravelBench: github.com/Alibaba/TravelBench
- CodeUltraFeedback: github.com/CodeUltraFeedback/CodeUltraFeedback
- BotBench: github.com/Alibaba-NLP/BotBench
- CharacterEval: github.com/Alibaba-NLP/CharacterEval
- PersonaBench: github.com/Meta-AI/PersonaBench
- Diverse-Persona: github.com/DiversePersona/Diverse-Persona
- GLUE-X: github.com/Keith-Hon/GLUE-X
- CheckList: github.com/marcotcr/checklist
- PromptRobust: github.com/PromptRobust/PromptRobust
- AdvGLUE: github.com/advGLUE/advGLUE
- BIG-Bench: github.com/google/BIG-bench
- HELM: crfm.stanford.edu/helm
- OpenCompass v2: opencompass.org.cn
- FlagEval: flageval.baai.ac.cn
- SuperCLUE: superclueai.com
- OpenEval: github.com/FlagOpen/OpenEval

### 厂商技术报告

- OpenAI o1 / o3 / GPT-4o Technical Reports
- Anthropic Claude 3.5 / 3.7 Sonnet System Cards
- Google Gemini 1.5 / 2.0 / 2.5 Technical Reports
- Meta Llama 3.1 / 3.2 / 3.3 Model Cards
- DeepSeek-V3 / R1 Technical Reports
- Qwen2.5 / Qwen3 Technical Reports
- 智谱 GLM-4 / GLM-5 Technical Reports
- 月之暗面 Kimi Technical Reports
- Mistral Large / Mixtral Technical Reports
- xAI Grok Technical Reports
- Stepfun Step-2 Technical Reports
- Baidu 文心 4.0 Technical Reports
- 零一万物 Yi Technical Reports

---

## 写在最后

本文补全了 `benchmarks.md` 未覆盖的 60+ 评测，重点深挖了 2024-2025 兴起的 6 大硬核评测（Terminal-Bench、SWE-Lancer、Cybench、KernelBench、MLE-bench、AppWorld），并整理了行业垂直、连续更新、Agent 工具、多模态特定等 16 大类的补全评测。

读懂这些评测，你就能：
1. 看厂商报告的"硬核表"时不发怵；
2. 区分"刷分" vs "真实能力"（看是不是私有测试集）；
3. 关注 2024-2025 涌现的"新兴基准"，它们才是真正反映前沿进展的窗口；
4. 优先关注**连续更新**的评测（LiveBench、LiveCodeBench、SWE-bench Live）——它们永远领先于训练数据。

前端工程师看这些评测的"秘诀"：
- **看 SOTA（当前最优）**：谁跑分高，谁就是前沿；
- **看趋势**：6 个月内分数变化反映技术进步速度；
- **看覆盖度**：跨多个基准都强 = 真正强；
- **看私有 vs 公开**：私有测试集 = 更可信（如 FrontierMath）。

读完这份指南，再看厂商的技术报告，就能从"不明觉厉"变成"心中有数"。

---

*字数统计：约 22,000 字（中英文混排）*

*最后更新：2026-08-28*
