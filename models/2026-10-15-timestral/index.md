---
vendor: mistral
model: Timestral
release: timestral
date: 2026-10-15
source: https://mistral.ai/news/timestral/
fetched_at: 2026-10-19
---

# Introducing Timestral

## 发布要点（转录）

- 官方定位：Mistral 首个时间序列基础模型（TSFM）家族，提供概率化、多变量预测，支持仅历史协变量与已知未来协变量。
- 四个尺寸：5M / 28M / 123M / 209M 参数，共用同一架构与训练配方；官方称每个尺寸都位于「准确率 vs 模型规模」的 Pareto 前沿。
- 最大模型 209M 在 GIFT-Eval、TIME、fev-bench 三个公开预测基准上均排名第一，官方称以三分之二的参数量超过此前最优。
- 推理不需要 GPU：标准服务器 CPU（8 线程）上，用三周 15 分钟粒度历史预测一天，5M 约 10 ms，209M 约 140 ms。
- 关键技术：Decoupled Horizon Forecasting（解耦预测步长）、协变量感知注意力、合成数据优先、两阶段训练（合成数据 context 8192 预训练 → 真实+合成混合数据、4 倍上下文后训练，pinball loss over 21 quantiles）。
- 可通过 Mistral Forge 做零样本推理、架构扩展与领域微调，支持本地、VPC 与气隙环境部署。
- 官方称结果已提交 GIFT-Eval 与 TIME 排行榜。

## 规格表（页面明示）

| 项 | 值 |
| --- | --- |
| Type | Time-series foundation model (TSFM) |
| Parameters | 5M, 28M, 123M and 209M |
| Context length | 32,768 time steps |
| Output | Probabilistic forecasts, 21 quantiles |
| Inputs | Multivariate targets, past-only and known-future covariates |
| Deployment | On-prem, VPC or air-gapped |
| Licence | Modified MIT |

页面未给出 API 定价，账本 pricing 记 null。

## 评测数据（视觉转写，待人工确认）

> 说明：以下数值来自公告页内嵌的 5 张柱状图图片（`images/*.webp`），非页面 DOM 明文。按图行规则一律记 pending，读图确认后方可翻转 verified。

| 评测 | 分数（视觉转写） | 方向 | 备注 |
| --- | --- | --- | --- |
| GIFT-Eval / GMean MASE | 0.657 | 越低越好 | 83 个可比预训练零样本条目中的前十，图中排第 1 |
| GIFT-Eval / GMean WQL | 0.446 | 越低越好 | 同上，图中排第 1 |
| TIME / GMean MASE | 0.626 | 越低越好 | 35 个排行榜条目前十，图中排第 1 |
| TIME / GMean CRPS | 0.522 | 越低越好 | 同上，图中排第 1 |
| fev-bench / SQL skill score | 50.4 | 越高越好 | 37 个排行榜条目前十，图中排第 1 |

图表图片对应关系：

- `images/gift-eval-gmean-mase.webp` — GIFT-Eval / GMean MASE 前十柱状图
- `images/gift-eval-gmean-wql.webp` — GIFT-Eval / GMean WQL 前十柱状图
- `images/time-gmean-mase.webp` — TIME / GMean MASE 前十柱状图
- `images/time-gmean-crps.webp` — TIME / GMean CRPS 前十柱状图
- `images/fev-bench-sql-skill-score.webp` — fev-bench / SQL skill score 前十柱状图
- `images/timestral-overview-pareto.webp` — 分数 vs 模型规模总览图（1 − skill score）

## 竞品对照（各图视觉转写，同为未确认值）

- GIFT-Eval / GMean MASE：t0-gamma 0.661、Falcon-2.0 0.666、LingJiang2.0 0.666、TimesFM-3 0.667、QiYao-M 0.671、EXAONE-Forecast 0.673、TiRex-2 Pretained 0.677、DeOSAlpha-TimeGPT 0.681、Granite-PatchTST-FM-f2 0.685。
- GIFT-Eval / GMean WQL：t0-gamma 0.452、TimesFM-3 0.456、LingJiang2.0 0.457、EXAONE-Forecast 0.460、QiYao-M 0.461、DeOSAlpha-TimeGPT 0.466、TiRex-2 Pretained 0.467、Granite-PatchTST-FM-f2 0.467、t0-beta 0.474。
- TIME / GMean MASE：t0-gamma 0.637、QiYao-M 0.638、TimesFM-3 0.640、Toto-2.0-2.5B 0.642、Toto-2.0-313m 0.644、Toto-2.0-1B 0.645、PatchTST-FM-Extended 0.662、Chronos-2 0.662、t0-beta 0.665。
- TIME / GMean CRPS：t0-gamma 0.534、QiYao-M 0.536、TimesFM-3 0.536、Toto-2.0-2.5B 0.539、Toto-2.0-313m 0.542、Toto-2.0-1B 0.545、Tabby 0.553、t0-beta 0.555、Chronos-2 0.556。
- fev-bench / SQL skill score：t0-gamma 49.4、TimesFM-3 49.0、Chronos-2 47.3、LingJiang2.0 47.0、t0-beta 46.6、TiRex-2 45.5、Toto-2.0-1B 44.4、Toto-2.0-2.5B 44.4、Toto-2.0-313m 44.2。

## 日期证据冲突（未调和）

- 页面正文印刷日：`October 15, 2026`，署名 `By Mistral`。
- 页面 JSON-LD 元数据：`"datePublished":"2026-07-15"`。

两者不一致。按账本契约不跨来源调和，`release_date` 取页面印刷日 `2026-10-15`，JSON-LD 值原样记入账本 notes 备查。

## 未转录区块

- 页面导航、页脚与品牌图例未转录。
- 官方技术报告当时尚未发布（"A technical report with the full results will follow"），暂无论文级完整协议说明，故 protocol 12 键全部记 null。
