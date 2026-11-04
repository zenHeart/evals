---
vendor: microsoft
model: Mage-VL-Cowork
release: mage-vl-cowork
date: 2026-10-30
source: https://huggingface.co/microsoft/Mage-VL-Cowork
fetched_at: 2026-10-30
---

# Mage-VL-Cowork 官方 model card 证据归档（4B 混合 GUI + 终端计算机操作智能体）

归档来源：**Hugging Face 官方模型仓的 model card 原文**（`microsoft/Mage-VL-Cowork`，官方组织 `microsoft`）。
本文件 `page.md` 为 card 原文 Markdown 的逐字副本，`page.html` 为同一模型页的渲染后 HTML，`images/` 为 card 内两张配图。

## 发布日期证据链（三源互证，均 2026-10-30）

1. Hugging Face 官方模型仓 API `createdAt` = **2026-10-30T12:13:24Z**。
2. 官方 GitHub 仓 `microsoft/Mage` 提交 `2026-10-30T07:54:49Z`「add Mage-VL-Cowork tech report PDF and citation」——技术报告与引用条目同日公开；`2026-10-30T08:09:25Z`「add Mage-VL-Cowork model link」把权重挂上官方仓首页。
3. 同仓 `2026-10-30T12:27:15Z`「refresh Cowork README teaser」、`2026-10-30T14:29:26Z`「update README and add OSWorld-Verified reproduction suite」；仓库 `pushed_at` = 2026-10-30T14:56:00Z。

**时间口径冲突（留痕）**：官方 GitHub 仓早在 `2026-10-28T17:49:55Z` 就有一次「docs: add Mage-VL-Cowork README」提交，但当时既无权重也无技术报告，属发布前预置文档；权重 + 技术报告 + 模型链接三件套齐备并对外可得的时间是 2026-10-30，故发布日取 **2026-10-30**（精度：日）。

## 官方定位（原文要点）

- **开发者**：Microsoft Mage Team。
- **模型类型**：多模态混合计算机操作智能体（`llava_onevision2` 架构；图像 + 文本 → 文本）。
- **参数量**：4B（bfloat16 共 9.48 GB，2 个 safetensors 分片）。
- **骨干**：Mage-ViT（16×16 patch 网格、`spatial_merge_size=2`、3D RoPE）+ Qwen3-4B（`Qwen3-4B-Instruct-2507`）。
- **上下文长度**：32,768 tokens（训练与推理的活跃窗口；架构上限可达 262,144）。
- **工作记忆**：非对称滑动窗口——**最近 3 张完整截图** + **4 条完整回复** + 折叠后的 `Action:` 历史。
- **动作通道**：`computer_use`（11 个 GUI 原语，坐标归一化到 `[0, 999]`）+ `bash`（常驻 shell 与 Python 环境）。
- **输出格式**：三段式结构化回合——`<think>...</think>` 推理 + `Action:` 摘要 + `<tool_call>...</tool_call>`。
- **训练算力**：5 个阶段合计名义 LM 算力 7.79 ZFLOPs（32 × NVIDIA B200 + 1,120 个 CPU 沙箱槽位用于 RL）。
- **许可**：Apache-2.0。

### 五阶段训练（官方表）

| 阶段 | 训练重点 | 监督规模 | 算力占比 | 名义算力 |
|---|---|---:|---:|---:|
| 1. GUI-Oriented Midtraining | 视觉定位、思维链推理、合规工具调用 | 24.6B tokens/epoch | 15.2% | 1.18 ZFLOPs |
| 2. GUI Agent SFT | 通过截图、鼠标、键盘完成多步桌面与网页流程 | 156.7K 条轨迹 | 33.6% | 1.55 ZFLOPs |
| 3. Coding & Terminal SFT | 仓库软件工程 + 程序化桌面文件/状态操作 | 563.7K 条轨迹 | 19.9% | 0.27 ZFLOPs |
| 4. Hybrid CUA SFT | `computer_use` 与 `bash` 的回合级通道路由与校验 | 318.8K 条轨迹 | 27.8% | 2.17 ZFLOPs |
| 5. Online Hybrid RL | 异步 GRPO + 可验证任务奖励 | 1,988 个可验证任务 | 3.5% | 2.62 ZFLOPs |

## 评测数值转录

> 官方 card 的评测数值全部在 **Markdown 表格**里（DOM 机读，非图片），故可直接建 verified 行；图片只含配图与技术报告 PDF，本归档未逐页核读 PDF 内数值。

### 1. OSWorld-Verified 主表（模型卡第 1 节）

协议原文：Evaluated on **361 held-out OSWorld-Verified tasks** (excluding Google Drive) under a **50-step budget** using the `MAGEHybridAgent` harness (`history_n=3`, `images_to_keep=3`, `1920×1080` desktop resolution).

headline **66.0%**（`66.04%`）是**两次全量独立跑的均值**（Run 1 = 65.33%，Run 2 = 66.75%）。

| 模型 | 参数量 | 步数 | OS | Office | Daily | Professional | Workflow | **总分** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| *人类参考* | — | — | — | — | — | — | — | 72.4 |
| GPT-5.5 | — | — | — | — | — | — | — | 78.7 |
| Claude Opus 4.7 | — | — | — | — | — | — | — | 78.0 |
| GPT-5.4 | — | — | — | — | — | — | — | 75.0 |
| Kimi-K2.6 | — | — | — | — | — | — | — | 73.1 |
| GPT-5.4-mini† | — | 50 | 79.2 | 68.0 | 76.6 | 69.4 | 63.3 | 69.6 |
| Claude Sonnet 4.5 | — | 100 | 70.8 | 72.6 | 61.4 | 63.2 | 49.5 | 62.9 |
| Seed-1.8 | — | 100 | 66.7 | 68.8 | 67.1 | 71.4 | 42.4 | 61.9 |
| Agent S2.5 w/ o3 | — | 50 | 75.0 | 53.8 | 54.0 | 75.5 | 39.5 | 54.2 |
| UI-TARS-2 | — | 100 | 41.7 | 61.1 | 62.1 | 61.2 | 34.1 | 53.1 |
| Claude Sonnet 4 | — | 50 | 45.8 | 43.5 | 55.1 | 55.1 | 28.5 | 43.9 |
| OpenAI CUA | — | 50 | 70.8 | 23.0 | 37.2 | 51.0 | 15.8 | 31.3 |
| ScaleCUA-Qwen3.5-9B | 9B | 50 | 79.2 | 70.6 | 74.3 | 89.5 | 48.1 | 68.7 |
| **Mage-VL-Cowork-4B (Ours)** | **4B** | **50** | **87.5** | 64.9 | 65.0 | 66.3 | **62.7** | **66.0** |
| Muse Glimmer-30B | 30B | — | — | — | — | — | — | 65.9 |
| Qwen3.6-27B | 27B | — | — | — | — | — | — | 63.9 |
| EvoCUA-32B | 32B | — | — | — | — | — | — | 56.7 |
| Qwen3.5-27B | 27B | — | — | — | — | — | — | 56.2 |
| ComputerRL-9B | 9B | 50 | 75.0 | 45.8 | 52.5 | 71.4 | 27.9 | 48.0 |
| ProCUA-SFT | — | — | — | — | — | — | — | 45.0 |
| OpenCUA-72B | 72B | 50 | 45.8 | 42.7 | 53.8 | 75.5 | 22.3 | 44.9 |
| DART-GUI-7B | 7B | 30 | 62.5 | 39.3 | 50.8 | 73.5 | 16.7 | 42.1 |
| Qwen3.5-9B | 9B | — | — | — | — | — | — | 41.8 |
| OpenCUA-32B | 32B | 50 | 60.9 | 29.9 | 41.0 | 65.3 | 14.6 | 35.1 |
| Fara1.5-4B | 4B | 50 | 25.0 | 7.6 | 29.5 | 12.2 | 6.6 | 13.9 |

† GPT-5.4-mini 在同样的 361 题（排除 Google Drive）上**单跑**一次。

### 2. 阶段表（OSWorld-Verified 分数 + 效率指标）

| 模型 / 阶段 | OSWorld-Verified (%) ↑ | 平均模型调用/题 ↓ | 平均输出 token/题 ↓ | 平均 think token/题 ↓ |
|---|---:|---:|---:|---:|
| Stage 2: GUI Agent SFT | 45.56 | 25.36 | 6,401 | 4,549 |
| Stage 4: Hybrid CUA SFT | 55.84 (+10.28 pp) | 21.57 (−14.9%) | 7,374 | 3,328 |
| **Stage 5: Online Hybrid RL（Mage-VL-Cowork）** | **66.04 (+20.48 pp)** | **18.77 (−26.0%)** | **5,499 (−25.4% vs. SFT)** | **2,482 (−25.4% vs. SFT)** |
| *参考：GPT-5.4-mini (xhigh)* | *69.57* | *18.24* | *12,397* | *11,631* |

**口径**：Stage 2 / Stage 4 是训练中间检查点，不是发布模型，故只有 Stage 5 入行；效率列是成本指标不是 benchmark 分值，不建行。

### 3. WebVoyager-Static 表（模型卡第 5 节）

官方原文：We evaluate browser transfer on **WebVoyager-Static** — a deterministic offline benchmark reconstructing all **643 tasks across 15 websites** on resettable self-hosted replicas, grading **both required UI navigation traces and backend SQLite database state**.

| 模型 | 参数量 | Agent 范围 | WebVoyager-Static (%) ↑ | 自报线上 (%) | 线上 → 静态虚高 (Δ pp) |
|---|---:|---|---:|---:|---:|
| Fara1.5-4B | 4B | 浏览器专精 | 68.0 | 80.8 | −12.8 |
| **Mage-VL-Cowork-SFT (Ours)** | **4B** | **通用桌面 + 浏览器** | **58.6** | — | — |
| Qwen3-VL-8B-Thinking | 8B | 通用 VLM | 53.7 | — | — |
| Qwen3.5-9B | 9B | 通用 VLM | 53.3 | — | — |
| Qwen3-VL-4B-Thinking | 4B | 通用 VLM | 49.6 | — | — |
| OpenWebRL-4B | 4B | 浏览器专精 | 47.1 | 74.1 | −27.0 |
| MolmoWeb-8B | 8B | 浏览器专精 | 46.8 | 78.2 | −31.4 |
| MolmoWeb-4B | 4B | 浏览器专精 | 42.6 | 75.2 | −32.6 |
| Fara-7B | 7B | 浏览器专精 | 40.4 | 73.5 | −33.1 |
| Qwen3.5-4B | 4B | 通用 VLM | 37.3 | — | — |

**口径**：本表 58.6% 属于 **Mage-VL-Cowork-SFT**（官方原文：Even before Stage 5 RL, our generalist desktop-and-browser SFT policy (58.6%)），即 Stage 4 检查点，**不是** Stage 5 RL 终版；与 OSWorld 行不是同一模型，不可互换。

### 4. 工具剪枝消融（672 题自建 held-out 多应用任务集）

| Harness 配置 | 教师成功率 (%) ↑ | 教师平均步数 ↓ | **4B 学生成功率 (%) ↑** | **4B 学生平均步数 ↓** |
|---|---:|---:|---:|---:|
| β1 · Evolved GUI + Coding（采用） | 92.0 | 25.00 | 37.6 | 30.91 |
| β2 · GUI + Coding + Accessibility (AX) | 89.6 | 35.33 | 25.1 | 39.40 |
| **采用 Evolved 剪枝的优势（β1 vs. β2）** | **+2.4 pp** | **−29.2% 步数** | **+12.5 pp** | **−21.5% 步数** |

该任务集是官方自建的 672 题 held-out 多应用集，**不是**公开标准 benchmark → 不建行，只在 release notes 留痕。

### 5. Mage-CUA-Forge 数据合成成本

| 环境合成范式 | tokens/题 ↓ | 每题经常性成本 (USD) ↓ | 相对降幅 |
|---|---:|---:|---|
| 标准 Agent-First 构造 | 1,276K | $0.906 | 基线 |
| **Mage-CUA-Forge（Workflow-First）** | **85K** | **$0.158** | **−93.3% tokens / −82.6% 成本** |

成本是相对结论且不是 benchmark 分值 → 不建行。

## 推理与评测协议（官方「Harness Configuration」表）

| 组件 / 参数 | 取值 | 作用 |
|---|---|---|
| 推理管线 | `AutoProcessor` + `POST /generate`（`sglang_generate`） | 用 `apply_chat_template(..., enable_thinking=True)` 渲染回合，向 SGLang `/generate` 传 JPEG（quality=95）`image_data` |
| 步数与上下文预算 | `max_steps=50`、`history_n=3`、`images_to_keep=3` | 保留最近 3 个完整回合与最多 3 张截图，更早步骤做成对动作摘要折叠 |
| 采样参数 | `temperature=0.7`、`top_p=0.8`、`max_tokens=4096` | 平衡多步探索与 `<think>` + `Action:` + `<tool_call>` 结构化生成 |
| Guest 环境初始化 | `/tmp_workspace`、`IDLE_LOCK_SETTINGS`、`~/.bash_history` | 准备临时工作目录、防止推理时 GNOME 息屏、记录 bash 调用 |

复现入口（官方原文）：完整的端到端 OSWorld-Verified 评测 harness（`361` 题，`test_nogdrive.json`，`50` 步预算）见官方 GitHub 仓 `https://github.com/microsoft/Mage/tree/main/mage_vl_cowork`，或把 `osworld_eval/mm_agents/` 直接集成进本地 OSWorld checkout。

## 动作通道工具集（官方表）

| 通道 | 工具 | 支持操作与返回契约 |
|---|---|---|
| GUI 通道 | `computer_use` | `click`、`double_click`、`triple_click`、`move`、`drag`、`type`、`keypress`、`scroll`、`wait`、`screenshot`、`terminate`；坐标归一化到 `[0, 999]`（`x = round(coord_x * width / 1000)`）；返回动作后的**桌面截图** |
| 终端通道 | `bash` | 执行 shell 命令、Python 脚本与 CLI 工具（工作目录 `/tmp_workspace`）；返回合并后的 `stdout`/`stderr` 文本，包在 `<tool_response>` 内，**不消耗图像槽位** |

## 未建档内容与已知缺口

1. **技术报告 PDF**（`assets/mage_vl_cowork_tech_report.pdf`）本批未逐页核读，账本内不引用其任何数值。
2. **官方未印** OSWorld 判分实现细节（judge 留 null）、WebVoyager-Static 的 agent harness / 采样参数 / 步数上限 / 跑次数 / 聚合方式。
3. **同卡未建档的同族模型**：`microsoft/Mage-VL`（HF createdAt 2026-07-25）、`microsoft/Mage-ViT`（HF createdAt 2026-07-26）均为 2026 年 7 月发布，落在本批增量窗口（2026-10-15 ~ 2026-10-30）之外，账本当前未收录 → 列入存量回填待办。
4. **配图**：`images/mage-vl-cowork-teaser.png`（首页 teaser）、`images/mage-vl-cowork-method.png`（方法示意）。按「图片 / 图表行必须 pending」纪律，图内数值不单独建行。
