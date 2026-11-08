---
vendor: tencent
model: AppCIF-Bench（榜单覆盖 GPT-5.4-xhigh / Gemini-3.1-Pro-Preview / Gemini-3-Flash-Preview / GLM-5.1 / Kimi-K2.5-Thinking / DeepSeek-V3.2-Thinking / Minimax-M2.7 共 7 个已建档模型）
release: appcif-bench
date: 2026-11-05
source: https://github.com/Tencent-Hunyuan/AppCIF-Bench
fetched_at: 2026-11-07
---

# AppCIF-Bench（腾讯官方基准仓 Leaderboard 证据归档）

本归档**不是模型发布页**，而是**基准所有者（腾讯）自建自跑的应用级复杂指令跟随基准**的官方仓库，用于给已建档模型补录官方明文评测证据。各模型的发布日期与规格仍以其发布文为准，本归档不改动任何既有 release 的发布日期与模型规格。

## 来源与日期证据

- 仓库：腾讯官方 GitHub 组织 `Tencent-Hunyuan` 下的 `AppCIF-Bench`（`https://github.com/Tencent-Hunyuan/AppCIF-Bench`），README 的 News 节记 **2026** 年「AppCIF-Bench has been accepted to **NeurIPS 2026**」与「The **evaluation code, Code Simulation Engines, and dataset** (Chinese and English) are released」。仓库创建时间 `2026-11-05T08:07:26Z`、最后推送 `2026-11-05T13:29:54Z`（GitHub API `created_at` / `pushed_at`）——即**仓库与数据集公开日 = 2026-11-05**，`date_precision=day`。
- 项目页：https://ac2333.github.io/AppCIF/ 。
- 数据集随仓库发布：`data/AppCIF_bench_dataset.jsonl`（中文）与 `data/AppCIF_bench_dataset_en.jsonl`（英文），各 466 样本、样本 id 与每样本细则数一一对应；`data/cross_lingual_strata.json` 标出 18 个角色扮演样本需在跨语言对比中单列。

## 基准本体（官方原文要点）

- 官方定位：「AppCIF is the first application-level CIF benchmark.」难度沿两轴加压：**地平线长度 H**（干扰累积、关键信号需持续追踪的跨度）与**逻辑深度 L**（嵌套规则的层数）。
- **Prompt-as-Environment** 范式：复杂系统提示词（L4 约 **1.4 万词**）+ 可执行 **Code Simulation Engines**（平均约 **3.5k 行 Python**），用状态机推断维持严格推理。
- **规模**：**466 样本 / 3,017 条原子细则**，五个应用场景（课程规划、旅行规划、数值密集、角色扮演、真实世界仿真）× 四个复杂度层，官方仓库当前发布版本为 **v1.1**；**论文报告的是初始版本 2,998 条细则**。
- **四层难度**：

| 层级 | 名称 | 压力 |
|---|---|---|
| L1 | Precise Execution 精确执行 | 短 H、少量步骤 L |
| L2 | Multi-turn Goal Retention 多轮目标保持 | 长 H + 局部干扰、多步 L |
| L3 | Information Reorganization Under High Noise 高噪声下的信息重组 | 长 H + 全局干扰、多步 L |
| L4 | Extreme Pressure Deduction 极端压力推断 | 极端 H、深层多步 L |

- **两个指标**（LLM-as-a-judge）：**SSR** = 被满足的细则占全部细则的比例；**HSR** = 该样本全部细则都满足才算通过的样本比例。
- 五个场景的样本分布：

| 场景 | L1 | L2 | L3 | L4 | 合计 |
|---|---:|---:|---:|---:|---:|
| 课程规划 Curriculum Planning | 38 | 38 | 0 | 0 | 76 |
| 旅行规划 Travel Planning | 25 | 17 | 8 | 0 | 50 |
| 数值密集 Numeric-Intensive | 23 | 0 | 23 | 0 | 46 |
| 角色扮演 Role-Playing | 27 | 16 | 11 | 0 | 54 |
| 真实世界仿真 Real-world Simulation | 21 | 49 | 80 | 90 | 240 |
| **样本合计** | **134** | **120** | **122** | **90** | **466** |
| **细则合计（v1.1）** | **730** | **688** | **803** | **796** | **3,017** |

- 真实世界仿真 240 个样本覆盖六个子场景各 40 个样本：Concert Budgeting / Tomb Exploration / TCM Diagnosis / Case Adjudication / Power Grid Dispatch / Time-Space Trading。

## 榜单转录（README「🏆 Leaderboard」表原文机读）

官方页面明示：**「Performance of 12 LLMs on the Chinese version of AppCIF, as reported in the paper (initial version of the data, judged by Doubao-Seed-1.6-1015), sorted by **HSR Avg**. Best results in each column are in **bold**. Numbers under each column are rubric counts (SSR) or sample counts (HSR).」**；表下脚注：**「Scores are judged by Doubao-Seed-1.6-1015. **Avg** is the sample- or rubric-weighted global average.」**

| Model | SSR L1<br>727 | SSR L2<br>678 | SSR L3<br>798 | SSR L4<br>795 | SSR Avg<br>2,998 | HSR L1<br>134 | HSR L2<br>120 | HSR L3<br>122 | HSR L4<br>90 | HSR Avg<br>466 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| GPT-5.4-xhigh | 79.1 | **81.0** | **77.4** | **75.9** | **78.2** | **50.8** | **54.2** | **43.4** | **31.1** | **45.9** |
| Gemini-3.1-Pro-Preview | **82.4** | 76.6 | 73.2 | 53.1 | 70.9 | 49.3 | 39.2 | 32.8 | 8.9 | 34.6 |
| Doubao-Seed-2.0-Pro-high | 66.6 | 62.8 | 52.5 | 34.7 | 53.5 | 30.6 | 25.0 | 16.4 | 2.2 | 20.0 |
| GLM-5.1 | 65.2 | 58.3 | 48.6 | 30.6 | 50.0 | 23.9 | 10.8 | 4.9 | 0.0 | 10.9 |
| Gemini-3-Flash-Preview | 66.4 | 56.8 | 41.7 | 23.8 | 46.4 | 17.9 | 14.2 | 5.7 | 0.0 | 10.3 |
| Kimi-K2.5-Thinking | 60.4 | 46.2 | 40.4 | 25.0 | 42.5 | 14.9 | 10.0 | 6.6 | 0.0 | 8.6 |
| Qwen-3.6-Plus-Thinking | 57.4 | 50.7 | 41.7 | 30.7 | 44.7 | 14.9 | 11.7 | 2.5 | 0.0 | 7.9 |
| Grok-4.2 | 55.3 | 45.6 | 32.7 | 16.1 | 36.7 | 11.2 | 5.8 | 1.6 | 0.0 | 5.2 |
| DeepSeek-V3.2-Thinking | 48.0 | 44.0 | 36.5 | 29.9 | 39.2 | 7.5 | 3.3 | 4.1 | 0.0 | 4.1 |
| Xiaomi-MiMo-V2-Pro | 42.0 | 38.4 | 31.8 | 19.6 | 32.5 | 6.0 | 4.2 | 2.5 | 0.0 | 3.4 |
| Minimax-M2.7 | 35.5 | 29.7 | 22.8 | 12.6 | 24.7 | 3.7 | 4.2 | 0.0 | 1.1 | 2.4 |
| Xiaomi-MiMo-V2-Omni | 39.1 | 32.3 | 27.1 | 16.1 | 28.3 | 1.5 | 0.8 | 1.6 | 0.0 | 1.1 |

即：**SSR 列的分母是各难度的细则条数**（727 / 678 / 798 / 795，全局 2,998），**HSR 列的分母是各难度的样本数**（134 / 120 / 122 / 90，全局 466）；**Avg 为按细则数（SSR）/ 样本数（HSR）加权的全局平均**；**粗体为该列最佳**；**排名按 HSR Avg**。

## 版本口径（必须随分数一起读）

官方「Version notes」节原文要点：

- 本仓库发布 **v1.1**；466 样本、场景、难度层级与任务定义与论文相同，但相对论文结果所用的初始版本：**新增英文平行版本**；投稿后审计发现的问题（gold 值、细则措辞、推导、规则库规则、少量对话轮次）已修正，代码仿真引擎同步修复；2,998 条原始细则中 **1,084 条被修订、1 条移除、20 条新增**（合计 3,017 条），149 个样本未变。
- **裁判变更**：论文结果的裁判 Doubao-Seed-1.6 **已停止服务**，v1.1 的结果改由 **Doubao-Seed-2.0-lite**（`doubao-seed-2-0-lite-260428`）以同一判分提示词判定。
- 官方明示：**「Scores on v1.1 are therefore not directly comparable with the paper results」**，且分数依赖裁判，报告时须写明所用裁判并在同一裁判下比较模型。

## 评测协议（页面明示项）

- 三步官方脚本：`pull_answer`（拉取回答）→ `evaluate`（**逐条细则**判定，裁判只看细则、最终问题与模型回答）→ `calculate_accuracy`（算 SSR / HSR）。
- 裁判默认 **Doubao-Seed-2.0-lite**（`ARK_API_KEY`）；换裁判必须同时在 `calculate_accuracy` 传入 `--eval_model`，否则 SSR/HSR 与判分口径不一致。
- **无回答或无判定的样本计为失败**；缺 API key、缺权限或模型名被拒会立即中止。
- 分档产物：`results/accuracy_summary.xlsx`（`constraint_*` 列为 SSR、`sample_*` 列为 HSR），逐细则判定结果在 `results/results_tagged.jsonl`。
- 六个仿真引擎只依赖 Python 标准库，`structured_inputs.jsonl` 存 240 个仿真样本的引擎输入，`python -m code_simulation_engines.regenerate_gold` 可重新推导公开细则。

## 入账方式

- 新建基准实体 `data/benchmarks/appcif-bench.json`（`id=appcif-bench`）；**不新建 release**（本归档是基准仓库，不是模型发布页）。
- 按「**同一 benchmark 不同列 → 拆 variant 行**」，对 7 个已建档模型各建 **10 条** evidence，共 **70 条**；`benchmark_variant` 取榜单列名（`SSR L1` / `SSR L2` / `SSR L3` / `SSR L4` / `SSR Avg` / `HSR L1` / `HSR L2` / `HSR L3` / `HSR L4` / `HSR Avg`），`reported_score.value` 取该格原值、`display` 保留原表字符串。
- `attribution_type = benchmark_owner_reported`（基准所有者自建自跑并自报榜单），`source_kind = official_benchmark_repo`，`source_tier = A`，`evidence_type = table`，`comparison_scope = only_same_protocol`。
- 竞品列（同一行的其他模型）按「取自家模型列」规则写入各行 `notes`，不单独建行。
- 落档目标 release / model：`openai/gpt-5-4`（gpt-5-4，标签 GPT-5.4-xhigh）、`google/gemini-3-1-pro`（标签 Gemini-3.1-Pro-Preview）、`google/gemini-3-flash`（标签 Gemini-3-Flash-Preview）、`glm/glm-5-1`（glm-5.1，标签 GLM-5.1）、`kimi/kimi-k2-5`（标签 Kimi-K2.5-Thinking）、`deepseek/deepseek-v3-2`（标签 DeepSeek-V3.2-Thinking）、`minimax/minimax-m2-7`（标签 Minimax-M2.7）。
- **榜单另有 5 行未入账**（本仓无对应 release 档案，不强行映射）：`Doubao-Seed-2.0-Pro-high`（账本只有 seed-2-0-lite / seed-2-0-mini / seed-2-1，无 seed-2-0-pro）、`Qwen-3.6-Plus-Thinking`（账本 qwen/qwen3-6-flash 为经济档且无官方评测数值，与 Plus 档不是同一次发布）、`Grok-4.2`（账本 xai/grok-4-20 是另一次发布且零 evidence，不能把第三方榜单行挂到它上面）、`Xiaomi-MiMo-V2-Pro` 与 `Xiaomi-MiMo-V2-Omni`（账本只有 mimo-v2-6 / mimo-v2-5-pro，无 V2-Pro / V2-Omni 档案）。
