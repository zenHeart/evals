---
vendor: tencent
model: HyperLogic（榜单覆盖 GPT-5.6 Sol / Claude Opus 5 / Kimi K3 / Grok 4.6 / DeepSeek V4 Pro / GLM-5.3 / Doubao Seed 2.1 Pro 共 7 个前沿模型）
release: hyperlogic
date: 2026-10-28
source: https://github.com/Tencent-Hunyuan/HyperLogic
fetched_at: 2026-10-31
---

# HyperLogic（腾讯官方基准仓 Leaderboard 证据归档）

本归档**不是模型发布页**，而是**基准所有者（腾讯）自建自跑的中文形式逻辑推理基准**的官方仓库，用于给 7 个已建档模型的前沿发布补录官方明文评测证据。各模型的发布日期与规格仍以其发布文为准，本归档不改动任何既有 release 的发布日期与模型规格。

## 来源与日期证据

- 仓库：腾讯官方 GitHub 组织 `Tencent-Hunyuan` 下的 `HyperLogic`（`https://github.com/Tencent-Hunyuan/HyperLogic`），README 的 News 节明示 **2026.10.28**：「This repository and the Hugging Face dataset go public with about 30% of the items of every tier, the direct-answer prompt and scorer, and the complete Hard agent evaluation.」——即**仓库与数据集公开日 = 2026-10-28**，`date_precision=day`。
- 佐证：仓库创建时间 `2026-10-27T11:05:36Z`、最后推送 `2026-10-28T15:09:00Z`（GitHub API `created_at` / `pushed_at`）；README 首行 News 另记 **2026.10.02** 论文发布（arXiv **2605.19597** v2），并记 2026.09.28 首次预印本（arXiv 2605.19597 v1）。本归档取 **2026-10-28**（仓库与数据集公开日、榜单与公开子集同时可查的一级来源），论文日仅作佐证。
- 数据集：`https://huggingface.co/datasets/tencent/HyperLogic`（腾讯官方 HF 组织 `tencent`）。

## 基准本体（官方原文要点）

- 题目由**逻辑训练背景的本科生**撰写，**多智能体工作流只「硬化」题目而不作答**：两个来自不同模型家族的 agent 各自把成题翻译成**可执行的有限域模型**，再由**逻辑求解器**推导答案；两份编码经分层、agent 辅助的裁决流程（人类专家监督），**只有两套修正后的编码一致**才发布该题。因此题目可以比造它的模型更难，而每条答案都**可执行、可审计**。
- **规模**：228 Seed 题 · 195 Base 题（含 922 个子问）· 100 Hard 题 · 7 个前沿模型 · 每模型每条件 3 次 rollout。
- **三层口径**：
  - **Seed** — 228 道单问题题。官方自述「像现有基准一样，Seed 几乎不区分前沿模型：七模型彼此都在 5.9 分以内」。
  - **Base** — 195 题，每题共享约 **3300 字**背景，平均 **4.7 个子问**；**一个子问答错即整题不得分**。官方定位是「能把前沿模型区分开」。
  - **Hard** — 100 道单问题题，背景约 **8700 字**，耦合搜索空间更大；官方称「直接作答已不现实」，故除直接作答外另设**沙箱 Agent** 两种条件。
- **公开范围**：每层**均匀抽样公开 30%**（Seed 69 / Base 59 / Hard 30）并附标准答案、直接作答 prompt 与语义评分脚本、Hard Agent 评测全流程；`build_public_subset.py` + `selection_manifest.json` 提供 SHA-256 承诺以便审计。其余 70% 与**全部**题目的专家校验形式化翻译保留在私有集合。官方明确：**公开子集分数无法复现上文全量榜单数值**。

## 榜单转录（README「🏆 Leaderboard」表原文机读）

页面明示协议：**Accuracy (%) on the full benchmark, mean ± standard deviation over three rollouts, every model at its highest reasoning setting**；**Base Item 以全部子问都答对才计对题**；**Sandbox** 给 agent 代码沙箱、**+ Library** 另给逻辑建模库；**粗体为该列最佳**；**模型排名按 Base 题目级准确率**。

| Rank | Model | Seed | Base Item | Base Sub-Q | Hard Direct | Hard Sandbox | Hard + Library |
|:---:|---|---:|---:|---:|---:|---:|---:|
| 1 | GPT-5.6 Sol | **89.8** ± 3.7 | **77.6** ± 0.6 | **92.6** ± 0.2 | 13.7 ± 5.9 | 40.3 ± 4.2 | 45.7 ± 2.1 |
| 2 | Claude Opus 5 | 86.5 ± 0.7 | 74.2<sup>†</sup> ± 2.7 | 88.9<sup>†</sup> ± 0.7 | **15.6**<sup>†</sup> ± 1.8 | **55.7** ± 3.2 | **57.0** ± 2.6 |
| 3 | Kimi K3 | 88.6 ± 0.0 | 57.9 ± 1.8 | 81.6 ± 1.8 | 4.0 ± 0.0 | 41.3 ± 1.5 | 43.0 ± 8.9 |
| 4 | Grok 4.6 | 87.0 ± 1.8 | 52.5 ± 4.1 | 82.9 ± 0.7 | 12.0 ± 1.0 | 39.3 ± 1.5 | 38.3 ± 2.1 |
| 5 | DeepSeek V4 Pro | 83.9 ± 1.7 | 51.8 ± 1.5 | 81.2 ± 1.2 | 9.3 ± 1.2 | 26.0 ± 5.6 | 20.0 ± 1.7 |
| 6 | GLM-5.3 | 87.3 ± 0.9 | 45.6 ± 3.2 | 67.2 ± 4.9 | 3.0 ± 1.0 | 20.7 ± 0.6 | 31.3 ± 5.1 |
| 7 | Doubao Seed 2.1 Pro | 85.8 ± 0.7 | 44.6 ± 2.2 | 73.2 ± 1.0 | 5.0 ± 1.0 | 26.0 ± 1.0 | 33.7 ± 0.6 |

页面脚注原文：

> <sup>†</sup>Excludes items refused by the model's API service. Grok 4.6 runs at `xhigh`, every other model at `max`. Models are ranked by Base item accuracy.

即：**† = 剔除该模型 API 服务拒答的条目后统计**（只出现在 Claude Opus 5 的 Base Item / Base Sub-Q / Hard Direct 三列）；**推理档位 Grok 4.6 用 `xhigh`，其余模型用 `max`**；排名按 Base 题目级准确率。

## 官方 Key Findings 原文要点

- **Base 难且有判别力**：在 5 个既有逻辑基准上三个前沿模型最多差 3 分，Seed 同样如此（83.9–89.8%）；Base 上每个模型相对 Seed 至少掉 12 分，七模型跨度 33.0 分（44.6–77.6%）。
- **推理更长不等于更准**：Base 上每题中位推理长度 15.2k–52.7k token，与准确率不相关；最准的两个模型用不到 GLM-5.3 一半的 token，而 GLM-5.3 有 99/585 次触到 131k token 上限仍给不出可解析答案。
- **Hard 大体超出直接作答，沙箱有帮助但解决不了**：无人直接作答超过 16%；代码沙箱让每个模型提升 **16.7–40.1 分**，但最好也只有 55.7%（带库 57.0%）。
- **逻辑建模库不必然有帮助**：加库使 Hard 准确率变化 **−6.0 ~ +10.6 分**，五个模型变好、两个变差。
- **模型倾向写朴素 Python 而非调用求解器**：只有沙箱时七模型中六个主要写朴素 Python 枚举候选赋值再用手写规则过滤。

## 评测协议（页面明示项）

- 判分：语义等价 **LLM judge**（非字面字符串匹配），`evaluate.py` 把一道题的所有子问**一起判**；judge 端点需实现 OpenAI 兼容的 Chat Completions。
- rollout：每模型每条件 **3 次**（`--rollouts 3`）；Hard Agent 用 `--judge-repeats 2` 复现重复判分与一致性报告。
- 拒答：预测可标 `{"id": N, "status": "refusal"}`，拒答**单独统计并从分母剔除**，缺失或非法预测计错。
- Hard Agent 条件：`c2` 只给任务与 case 文件；`c3` 另给完整 `translation` 库与 `MANUAL.md`；**同一 agent 模型与设置跑两种条件**。runner 默认每 workspace **2 CPU、10 GB、3 小时**上限，**每容器只挂一个 workspace**（直接在 checkout 里跑会让 agent 读到公开标准答案）。
- 抽样：`build_public_subset.py` 用 `random.Random("2027:<tier>")` 对每层独立均匀不放回抽样，释放 `ceil(0.30 × 全量题数)`；`selection_manifest.json` 记录方法、各层全量的 SHA-256 承诺与公开子集哈希。

## 入账方式

- 新建基准实体 `data/benchmarks/hyperlogic.json`（`id=hyperlogic`）。
- 按「**同一 benchmark 不同条件/版本 → 拆 variant 行**」，对 7 个模型各建 **6 条** evidence，共 **42 条**；`benchmark_variant` 取页面列名（`Seed` / `Base Item` / `Base Sub-Q` / `Hard Direct` / `Hard Sandbox` / `Hard + Library`），`reported_score.value` 取均值、`display` 保留页面原样的「均值 ± 标准差」。
- `attribution_type = benchmark_owner_reported`（基准所有者自建自跑并自报榜单），`source_tier = A`，`evidence_type = table`。
- 竞品列（同一行的其他模型）按「取自家模型列」规则写入各行 `notes`，不单独建行。
- 落档目标 release：`openai/gpt-5-6`（gpt-5-6-sol）、`anthropic/claude-opus-5`、`kimi/kimi-k3`、`xai/grok-4-6`、`deepseek/deepseek-v4-pro`、`glm/glm-5-3`（glm-5.3）、`doubao/seed-2-1`（seed-2.1-pro）。
