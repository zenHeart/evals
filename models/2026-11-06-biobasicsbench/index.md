---
vendor: openai
model: GPT-5.2 / GPT-5.4 / GPT-5.5 / GPT-5.6 Sol / GPT-6.1 Sol / GPT-6 Luna / GPT-6 Astra
release: biobasicsbench
date: 2026-11-06
source: https://openai.com/index/measuring-how-ai-agents-handle-wet-lab-science
fetched_at: 2026-11-06
---

# BioBasicsBench（OpenAI 官方发布文归档）

发布日期证据：官方发布页可见文字印刷「November 6, 2026」；官方新闻 RSS（`https://openai.com/news/rss.xml`）对应条目为 2026-11-06；页面 JSON-LD `datePublished` = 2026-11-06T00:00:00.000Z。三者一致。

- 发布文：https://openai.com/index/measuring-how-ai-agents-handle-wet-lab-science
- 官方新闻 RSS：https://openai.com/news/rss.xml

## 为什么这批 evidence 可以逐值机读

发布文把全部 37 个「模型 × 推理强度」设置的分值放在**内嵌图表的 vega-lite 数据集**（`data.values`）里，逐值可机读，**无一条依赖位图读图**；同时正文用两个锚点交叉校验了同一组数值（「At the 'xhigh' setting … GPT‑6 Astra earned an average of 66.7% of the available credit, compared with 43.8% for GPT‑5.6 Sol.」→ 对应图表值 66.68508 与 43.76452）。

官方口径原文：

> We evaluated seven models on BioBasicsBench: GPT‑5.2, GPT‑5.4, GPT‑5.5, GPT‑5.6 Sol, GPT‑6.1 Sol, GPT‑6 Luna and GPT‑6 Astra. The evaluation covers 37 model and reasoning-effort settings, with five attempts on each of the 100 tasks per setting, for a total of 18,500 results.

> The benchmark's 100 tasks test whether agents can interpret raw experimental data, identify errors, and recognize when the evidence cannot support a conclusion.

## 评测数据转录表一：Mean reward by model and reasoning effort（官方 vega-lite `data.values` 逐值机读）

指标为「the average task score, expressed as a percentage of the available credit」，0–100；每设置 = 100 题 × 5 次尝试；CI 为整题重采样的 95% 置信区间；`tokens` 为每题平均输出 token 数。

| 模型 | 推理强度 | 分值 | CI 下界 | CI 上界 | 平均输出 tokens |
|---|---|---:|---:|---:|---:|
| GPT-5.2 | none | 24.01436% | 19.58758% | 28.58085% | 2079.134 |
| GPT-5.2 | low | 28.66536% | 23.76373% | 33.74939% | 4401.932 |
| GPT-5.2 | medium | 30.70130% | 25.70819% | 35.75935% | 10239.358 |
| GPT-5.2 | high | 30.49368% | 25.65874% | 35.29892% | 14197.154 |
| GPT-5.2 | xhigh | 31.15348% | 26.20544% | 36.28213% | 27619.584 |
| GPT-5.4 | none | 24.47002% | 19.90117% | 29.27057% | 1667.402 |
| GPT-5.4 | low | 29.01514% | 24.01231% | 33.85514% | 4012.454 |
| GPT-5.4 | medium | 31.27094% | 26.30005% | 36.25536% | 6502.234 |
| GPT-5.4 | high | 31.49656% | 26.44242% | 36.68020% | 9061.498 |
| GPT-5.4 | xhigh | 33.24082% | 28.29099% | 38.44322% | 13717.138 |
| GPT-5.5 | none | 25.90308% | 21.40028% | 30.39819% | 1532.802 |
| GPT-5.5 | low | 28.70460% | 24.17296% | 33.10530% | 2334.828 |
| GPT-5.5 | medium | 31.92678% | 26.80818% | 37.23187% | 5154.742 |
| GPT-5.5 | high | 33.39794% | 27.91597% | 39.14722% | 7764.164 |
| GPT-5.5 | xhigh | 35.36392% | 29.66839% | 41.04225% | 11134.88 |
| GPT-5.6 Sol | none | 29.80568% | 24.68233% | 34.90843% | 1648.632 |
| GPT-5.6 Sol | low | 34.13360% | 28.63012% | 39.44920% | 2146.282 |
| GPT-5.6 Sol | medium | 38.31094% | 32.39750% | 43.97600% | 4227.742 |
| GPT-5.6 Sol | high | 41.65320% | 35.52663% | 47.60522% | 6491.854 |
| GPT-5.6 Sol | xhigh | 43.76452% | 37.59557% | 49.98964% | 9098.714 |
| GPT-5.6 Sol | max | 45.56352% | 39.34349% | 51.67246% | 13751.438 |
| GPT-6 Luna | none | 27.97478% | 23.67481% | 32.57017% | 2132.47 |
| GPT-6 Luna | low | 30.06596% | 24.90161% | 35.44582% | 1700.038 |
| GPT-6 Luna | medium | 34.87168% | 29.14643% | 40.71288% | 6681.876 |
| GPT-6 Luna | high | 36.98412% | 31.14475% | 42.92059% | 9739.822 |
| GPT-6 Luna | xhigh | 38.26694% | 32.28084% | 44.48688% | 13119.588 |
| GPT-6 Luna | max | 37.56240% | 31.52474% | 43.55586% | 23616.188 |
| GPT-6.1 Sol | low | 53.48756% | 46.73036% | 60.26537% | 1335.456 |
| GPT-6.1 Sol | medium | 57.56218% | 50.76088% | 64.22758% | 2259.214 |
| GPT-6.1 Sol | high | 60.40354% | 54.02341% | 66.99503% | 3971.988 |
| GPT-6.1 Sol | xhigh | 61.99776% | 55.55574% | 68.39897% | 5238.12 |
| GPT-6.1 Sol | max | 62.61486% | 56.20164% | 68.95378% | 8766.324 |
| GPT-6 Astra | low | 62.32870% | 55.81965% | 68.64172% | 1501.482 |
| GPT-6 Astra | medium | 63.72312% | 57.24568% | 70.05352% | 2302.974 |
| GPT-6 Astra | high | 65.43528% | 58.79536% | 72.08379% | 3523.066 |
| GPT-6 Astra | xhigh | 66.68508% | 60.32677% | 73.13904% | 4704.268 |
| GPT-6 Astra | max | 66.98176% | 60.65069% | 73.34977% | 7531.266 |

> **GPT-5.2 的 5 行不建证据行**：本仓无 GPT-5.2 的独立 release 记录（无官方发布文可定位其发布日），按「不拿抓取日冒充发布日期」纪律，本批只留档，不新建 release、不建证据行。

## 评测数据转录表二：Tasks by domain and tested skill（官方 vega-lite `data.values` 逐值机读）

同一任务可覆盖多个技能，故各技能计数之和大于 100。

| 任务域 | 唯一任务数 | Tacit knowledge | Multimodal analysis | Error detection | Protocol understanding | Recognizing insufficient data |
|---|---:|---:|---:|---:|---:|---:|
| Protein Methods | 25 | 25（100%） | 21（84%） | 10（40%） | 13（52%） | 4（16%） |
| Imaging & Cytometry | 23 | 18（78%） | 23（100%） | 17（74%） | 3（13%） | 5（22%） |
| Quantification & Assays | 19 | 13（68%） | 14（74%） | 14（74%） | 13（68%） | 5（26%） |
| Nucleic Acid Methods | 17 | 16（94%） | 17（100%） | 12（71%） | 7（41%） | 4（24%） |
| Molecular Cloning | 16 | 16（100%） | 13（81%） | 15（94%） | 14（88%） | 1（6%） |
| All tasks | 100 | 88（88%） | 88（88%） | 68（68%） | 50（50%） | 19（19%） |

## 非评测内容（不入 evidence）

- 「mean_output_tokens_per_problem」是成本/效率侧描述，官方同页把它放在同一张图的横轴上，不单独建行。
- 「GPT‑6 Astra substantially improves on GPT‑5.6 Sol, even at low reasoning effort」与「stronger native multimodal capabilities may be key to improving performance on everyday wet-lab」是结论性表述，不是独立评测分。
- 官方对 biosafety / biosecurity 的展望段落无数值，不建行。
