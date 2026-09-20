---
vendor: stepfun
model: Step 5 Preview
release: step-5-preview
date: 2026-09-19
source: https://www.stepfun.com/step-5-preview
fetched_at: 2026-09-20
---

# Step 5 Preview（2026-09-19 阶跃星辰旗舰基座预览版）

阶跃星辰在 `https://www.stepfun.com/step-5-preview` 正式发布 **Step 5 Preview**，定位为面向真实世界 Agentic 任务的旗舰基座模型。该页是 Next.js SPA，WebFetch 仅返回站壳（"阶跃星辰"），需用 Playwright 渲染后读 DOM。下文表格与脚注均自页面 DOM 逐行转录。

## 模型规格（页面上明示）

- 架构：稀疏 MoE
- 总参数：600B
- 每 Token 激活：27B
- 上下文窗口：1M Token
- 模态：文本 + 视觉输入
- 开源时间：2026-10-15
- AA Intelligence Index：44

## 评测对比（页面前置图表，DOM 文本）

| 评测基准 | Step 5 Preview (High) | Kimi K3 (Max) | GLM-5.3 (Max) | GPT-6 Astra (Max) | Claude Opus 5 (Max) |
|---|---:|---:|---:|---:|---:|
| DeepSWE v1.1 | 67.7 | 67.5 | 66.9 | 74.1 | 74.0 |
| StepCodeBench | 49.0 | 43.9 | 40.2 | 61.0 | 63.9 |
| ProgramBench | 80.5 | 77.8 | 72.0 | 85.4 | 82.3 |
| Terminal-Bench v4 | 33.3 | 12.6 | 41.9 | 57.9 | 52.3 |
| Agents' Last Exam (ALE-CLI) | 29.5 | 27.6 | 28.6 | 33.3 | 28.6 |
| GDPval-AA v2 | 1571 | 1548 | 1634 | 1580 | 1735 |
| FrontierFinance | 66.4 | 62.6 | 64.1 | 55.0 | 69.7 |
| DRACO | 83.3 | 78.5 | 82.3 | 76.8 | 87.6 |

## 完整评测结果（页面下方 DOM 表）

| 评测基准 | Step 5 Preview (High) | GLM 5.3 (Max) | Kimi K3 (Max) | GPT-6 Astra (Max) | Claude Fable 5.1 (Max) | Claude Opus 5 (Max) |
|---|---:|---:|---:|---:|---:|---:|
| GPQA Diamond | 93.5% | 91.7% | 93.5% | 96.1% | 93.7% | 93.2% |
| HLE | 46.5% | 42.3% | 46.9% | 54.7% | 59.1% | 54.9% |
| AA-LCR v1.1 | 88.3% | 79.7% | 88.7% | 80.7% | 85.3% | 79.3% |
| CritPt | 20.9% | 19.1% | 23.4% | 31.7% | 29.7% | 29.1% |
| DeepSWE v1.1 | 67.7% | 66.9% | 67.5% | 74.1% | 67.4% | 74.0% |
| Terminal-Bench v2.1 | 85.0% | 83.9% | 85.0% | 88.4% | 91.4% | 89.1% |
| Terminal-Bench v4 | 33.3% | 41.9% | 12.6% | 57.9% | 55.8% | 52.3% |
| CyberGym | 84.7% | 84.5% | 80.0% | — | — | — |
| SciCode | 58.9% | 59.0% | 59.5% | 56.5% | 63.1% | 56.4% |
| RoadmapBench | 54.3% | 54.1% | 55.4% | — | — | 68.3% |
| ProgramBench (Pass Rate) | 80.5% | 72.0% | 77.8% | 85.4% | 82.7% | 82.3% |
| SWE-Marathon v1.1 (Partial) | 72.7% | 67.4% | 84.4% | 77.3% | 80.2% | 85.6% |
| MLS-Bench-Lite | 40.5% | 37.3% | 48.3% | — | 50.3% | 49.8% |
| SWE-Atlas-QnA | 63.6% | 59.6% | 59.5% | 60.9% | — | 66.0% |
| SWE-Atlas-Test-writing | 50.8% | 50.4% | 50.4% | 51.1% | — | 60.3% |
| StepCodeBench† | 49.0% | 40.2% | 43.9% | 61.0% | — | 63.9% |
| StepCode-Bench-Daily† | 64.9% | 69.1% | 57.7% | — | — | 77.6% |
| StepCode-Bench-General† | 65.0% | 62.0% | 65.2% | 64.3% | — | 68.3% |
| GDPval-AA v2 | 1571 | 1634 | 1548 | 1580 | 1724 | 1735 |
| τ³-Banking | 42.5% | 50.3% | 46.0% | 41.4% | 47.2% | 42.1% |
| AutomationBench-AA | 51.0% | 62.2% | 58.3% | 68.5% | 59.4% | 56.6% |
| AutomationBench (public) | 44.0% | 48.2% | 46.7% | — | — | — |
| AA-Briefcase | 1417 | 1511 | 1492 | 1562 | 1662 | 1645 |
| Toolathlon-Verified | 74.1% | 73.0% | 76.5% | — | 77.8% | 80.6% |
| MCP-Atlas | 85.6% | 86.8% | 85.3% | — | — | 87.0% |
| PresentBench | 76.8% | 74.5% | 75.6% | — | — | 77.3% |
| OfficeQA Pro | 60.3% | 59.1% | 62.6% | 67.7% | — | 64.7% |
| SpeadSheet v2 | 29.4% | 30.5% | 31.9% | 31.4% | — | 32.8% |
| JobBench | 59.0% | 61.4% | 54.3% | — | — | 65.7% |
| Apex-Agents | 37.8% | 38.1% | 41.0% | — | — | 41.8% |
| Draco | 83.3% | 82.3% | 78.5% | 76.8% | 87.7% | 87.6% |
| BrowseComp | 88.7% | — | 91.2% | 91.5% | — | 90.2% |
| HLE w/ tools‡ | 59.4% | 62.5% | 56.0% | 57.2% | 65.0% | 63.6% |
| FinStepBench-LiveSearch† | 74.5% | 73.3% | 70.9% | 74.5% | — | 76.2% |
| FinStepBench-CorporateValuation† | 60.6% | 56.1% | 60.6% | 77.3% | — | 69.7% |
| FinStepBench-FinanceDR† | 55.8% | 53.3% | 48.9% | 45.0% | — | 59.1% |
| FrontierFinance | 66.4% | 64.1% | 62.6% | 55.0% | — | 69.7% |
| Agents' Last Exam (ALE-CLI) | 29.5% | 28.6% | 27.6% | 33.3% | — | 28.6% |
| MMMU-Pro | 76.0% | — (text only) | 81.0% | 87.0% | — | 85.0% |
| GDP.pdf | 14.8% | 11.2% | 22.0% | 31.0% | 26.2% | 21.6% |

† 标注的为内部自研评测。
‡ 对于 HLE w/ tools，Step 5 Preview (High) 与 GLM-5.3 (Max) 在纯文本子集上评测，其余模型在完整数据集上评测。不同评测设置下的结果不具备直接可比性。

## 页面脚注（DOM 明文）

- GDPval-AA v2 数据采用 Artificial Analysis（https://artificialanalysis.ai/）截至 2026-09-19 公布的最新结果。
- DeepSWE v1.1 使用 SWE-agent（https://github.com/SWE-agent/SWE-agent）harness 评测，temperature=1.0、top_p=0.95。
- FrontierFinance（https://samaya.ai/blog/frontier-finance）覆盖 6 类投资场景、220 道专家设计的问题、11,543 项评估标准。

## 案例模块（页面下方 tab 切换区，仅文字描述，不入账）

Room Planner / 3D Flappy Bird / Dream Racing / Toy Universe / 穿越时光的铁路 / 清明上河图 / 动态象棋 — 七个交互式 demo 缩略图（按钮型 UI，无静态文案）；Industry Engineering、Creative Production、Live Production、Process Engineering、Manufacturing Engineering、Video Editing、Mechanical Engineering、Pharmacy 八个 Artifact 按钮 — 全部为 click-to-view artifact 交互控件，无文本 benchmark 数据，不入账。

## 长程执行案例（散文 + 图表）

- **优化 MLA GPU Kernel**：给 Step 5 Preview 24 小时，在 NVIDIA H100 上从零优化 MLA GPU Kernel（Head Dim 512、Batch Size 1、64 Heads、8192 Tokens）。每个模型独立运行 4 次取最佳。Step 5 Preview 约 22 小时达到前向 + 反向合计 **508 TFLOPS**（页面散文明示 vs Claude Opus 5 的 493 TFLOPS）。
- **优化后训练数据流程**：24 小时内通过自动化后训练把 Qwen3-30B-A3B 基础模型在 AIME24 准确率从 53.3% 提升到 **60%**（页面散文明示）。
- **Pokémon Red**：未做专项优化下持续完成 3000+ Turns，累计交互近 600 万 Tokens；在第 3082 步击败枯叶道馆馆主马志士获得第三枚道馆徽章（页面散文明示）。

## 取舍与产物对照

- **入账**：上方"完整评测结果"40 行（DOM 表直接机读，按 vendor_reported 收录；GDPval-AA v2 / AA-Briefcase 按厂商脚注口径记 third_party_reported）。
- **不入账**：长程案例（GPU Kernel / AIME24 / Pokémon Red）均为散文叙述，无可定位的 DOM 表 / 数值行，按"仅点名无数值 + 图表演示"原则不入账，仅在 release notes 中保留摘要。
- **new-benchmark 候选**：roadmapbench、stepcodebench（含 Daily / General 子集）、finstepbench-livesearch、finstepbench-corporatevaluation、finstepbench-financedr、frontierfinance、gdp-pdf — 全部在 release JSON 的每条 notes 标记 `new-benchmark:`，待迁移进 benchmark 主数据。