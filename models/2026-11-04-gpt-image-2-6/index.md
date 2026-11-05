---
vendor: openai
model: GPT-Image-2.6 Sunburst / GPT-Image-2.6 Flare
release: gpt-image-2-6
date: 2026-11-04
source: https://openai.com/index/introducing-images-2-6/
fetched_at: 2026-11-05
---

# OpenAI《Introducing Images 2.6》——官方系统卡安全评测全量转录

发布日期证据（三源一致）：官方发布页页眉印刷「November 4, 2026」；官方新闻 RSS（`https://openai.com/news/rss.xml`）对应条目 `pubDate` 为 `Wed, 04 Nov 2026 00:00:00 GMT`；官方系统卡页标注「Published November 4, 2026」。

- 发布文：https://openai.com/index/introducing-images-2-6/
- 系统卡：https://deploymentsafety.openai.com/chatgpt-images-2-6
- 定价页：https://developers.openai.com/api/docs/pricing

## 为什么本批的证据全部来自系统卡

本次发布文正文**没有任何能力评测数值**——剥 `<script>` / `<style>` 后的可见文本共 8,634 字符，全文唯一的百分比是「Images 2.6 generates images **50% faster** than before」，那是出图速度描述，不是评测分数。页面内嵌图表数据集里也没有 `vegaLiteSpec` / `vegaSpec`（两者计数均为 0），唯一一张图片是社交卡配图。

按渠道地图「正文给不出数值时下一步是翻图表数据集」的判定顺序，本批继续下探到官方系统卡——系统卡第 3.2.1 节给出 Table 1 / Table 2 两张**DOM 真表格**（逐格可机读），第 3.2.2 节给出 Table 3（图表组件渲染，数值存于 DOM 的 `data-data` 属性，同样可机读）。全部 67 条 evidence 均出自这里，**无一条依赖位图读图**。

## 评测数据转录表一：安全评测（系统卡 §3.2.1 Table 1 + Table 2）

分母统一为 **3,077 条对抗性图像请求**。三项指标方向不同，**三列加总为 100%**：

- **Safe Generation**（越高越好）：生成结果被判为非违规的比例
- **Unsafe Generation Blocked**（越高越好）：违规生成被安全审核层拦截的比例
- **Unsafe Generation Not Blocked**（越低越好）：违规生成未被拦截、最终流向用户的比例

### Table 1（Overall，3,077 条）

| 模型 | Safe Generation | Unsafe Generation Blocked | Unsafe Generation Not Blocked |
|---|---:|---:|---:|
| GPT-Image-2.5 Sunburst (baseline) | 76.15% | 21.94% | 1.92% |
| **GPT-Image-2.6 Sunburst** | 75.50% | 22.78% | 1.72% |
| GPT-Image-2.5 Flare (baseline) | 78.36% | 20.15% | 1.49% |
| **GPT-Image-2.6 Flare** | 75.04%* | 22.81%* | 2.14% |

### Table 2（分政策类别）

| 政策类别 | Sunburst Safe Gen | Sunburst Blocked | Sunburst Not Blocked | Flare Safe Gen | Flare Blocked | Flare Not Blocked |
|---|---|---|---|---|---|---|
| Overall | 75.50% | 22.78% | 1.72% | 75.04%* | 22.81%* | 2.14% |
| Sexual | 15.87% | 83.07% | 1.06% | 12.70%* | 87.30%* | 0.00% |
| Hate | 88.07% | 11.21% | 0.72% | 88.97% | 10.31% | 0.72% |
| Other (e.g., religious and public figures) | 79.30% | 19.12% | 1.57% | 76.49%* | 20.70% | 2.81% |
| Violence / Gore | 70.02% | 29.12% | 0.86% | 71.52% | 27.41% | 1.07% |
| Extremism | 79.49% | 20.51% | 0.00% | 79.49% | 20.51% | 0.00% |
| Self-harm | 61.51% | 34.34% | 4.15% | 61.13% | 32.83% | 6.04% |
| Political | 89.32% | 8.54% | 2.14% | 90.75% | 7.83% | 1.42% |
| Abuse | 66.38% | 31.90% | 1.72% | 72.41% | 26.72% | 0.86% |
| Wrongdoing | 89.30% | 6.58% | 4.12% | 88.07% | 7.41% | 4.53% |

`*` = 系统卡原表带星号标注（Flare 的 Overall、Sexual、Other 三行）。

**基线列（GPT-Image-2.5 Sunburst / Flare）按「竞品列进 notes、不另建行」口径不单独建 evidence 行**，各行的基线数值写进该行 `notes`。

### 官方结论（原文，DOM 散文明文）

> We find that the GPT-Images-2.6 series with moderation checks generally performs on par with GPT Images-2.5. Minor numerical regressions are not statistically significant.
>
> For the evaluated configurations shown, Sunburst produced fewer violative images post-moderation than its corresponding GPT-Images-2.5 baseline. Flare's rate increased from 1.49% (46 of 3,077 requests) to 2.14% (66 of 3,077), an increase of 0.65 percentage points. Neither overall difference was statistically significant. Before moderation, the proportion of Flare outputs graded non-violative decreased from 78.36% to 75.04%. This decline was statistically significant, with the largest contributions coming from the "Other" and sexual prompt categories. Of the 20 net additional unsafe outputs that were not blocked, 14 were in the "Other" category. No individual prompt category showed a statistically significant increase in violative outputs when safety moderation was applied.
>
> These evaluations use a fixed set of adversarial requests that are designed around challenging edge cases with automated grading. Results apply to the model and safeguard configurations evaluated and do not measure the complete deployed safety system or the frequency of violative outputs in production.

## 评测数据转录表二：GIF 审核召回率（系统卡 §3.2.2 Table 3）

Recall = 被标注为违规的对抗性 GIF 中，防护检出（拦截）的比例。该表在页面上以图表组件渲染，数值存于 DOM 的 `data-data` 属性（`modelNames: ["GIF Moderation Recall"]`，`datasets[].modelScores`），属 DOM 机读、逐格可核对，非位图读图。

| 类别 | GIF Moderation Recall |
|---|---:|
| Overall | 77.7% |
| Sexual | 77.8% |
| Hate / abuse | 90.9% |
| Violence / gore | 89.7% |
| Extremism | 92.9% |
| Self-harm | 77.5% |
| Violent Activities | 96.6% |

官方原文说明：

> We evaluated these safeguards using a targeted set of adversarial GIFs labeled as policy-violating. These challenging cases are not representative of typical user requests or outputs. Recall measures the proportion of policy-violating GIFs in this evaluation set that the evaluated safeguards detected. It does not estimate how often harmful requests are fulfilled or harmful GIFs reach users in production. Motion-related violations remain challenging to detect, and the safeguards may not catch all violations.

**口径**：这是**安全防护（safeguard）层指标**，度量防护对违规 GIF 的检出能力，不是模型自身能力分。官方未在表内区分 Sunburst 与 Flare 两列，故按发布主体挂 Sunburst，并在每行 `notes` 说明同样适用于 Flare。

## 非评测内容（不进账本）

| 内容 | 数值 | 备注 |
|---|---|---|
| 出图速度提升 | 50% | 相对上一代的**速度描述**，非评测分数 |
| 全平台每周生成图像量 | 40 亿张 | 运营指标 |
| 低画质下 Flare 最快出图 | 6 秒 | 规格描述 |
| Flare 漏网违规图绝对条数 | 66 / 3,077（基线 46 / 3,077） | 与 Table 1 的 2.14% / 1.49% 同源，属显著性论证的补充计数，不另建行 |
| Preparedness 阈值 | 未达 Bio High / Cyber High | 官方结论性表述，无分值 |

## 定价（非评测，转录自官方 API 定价页）

| 模型 | 模态 | 输入 | 输出 | 缓存输入 |
|---|---|---:|---:|---:|
| gpt-image-2.6-sunburst | 图像 | $8.00 | $30.00 | $2.00 |
| gpt-image-2.6-sunburst | 文本 | $5.00 | — | $1.25 |
| gpt-image-2.6-flare | 图像 | $8.00 | $30.00 | $2.00 |
| gpt-image-2.6-flare | 文本 | $5.00 | — | $1.25 |

（单位：每百万 tokens；与 GPT-Image-2.5 同价。）

## 口径说明

1. **一个 benchmark 行 = 一条 evidence，取自家模型列**：Table 1 / Table 2 的每一行 × 三项指标 × 两个自家模型各建一行，共 60 条；Table 3 的 7 行共 7 条。合计 67 条 evidence，全部 `verified`。
2. **三项指标是三个不同的量**，方向不同（两高一低），不可混读；已在 benchmark 实体 `metrics` 里逐项标注 `direction`。
3. **基线（GPT-Image-2.5）列只进 notes**，不另建 evidence 行——2.5 本身不是本次发布的主体。
4. **协议字段全为 null**：官方未印 temperature / top_p / shots / run_count / judge / 题集抽样方式，`comparison_scope` 统一 `only_same_protocol`。
5. **本批无待人工读图项**：Table 1 / Table 2 是 DOM 真表格，Table 3 是 DOM 内嵌数据集，均可逐格核对，不属「图表图片行必须 pending」的范畴。
