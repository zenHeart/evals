---
vendor: glm
model: GLM-5.4
release: glm-5-4
date: 2026-11-23
source: https://z.ai/blog/glm-5.4
fetched_at: 2026-11-28
---

# GLM-5.4: Toward Generalized Coding with Our First Loop Transformer

## 评测数据（转录）

### 图 1（Scaling Correctness 等参数对照实验，图表逐行视觉转写）

官方正文原句：「On a 30B model with the exact same architecture as our 750B base, we ran a controlled iso-parameter comparison. With identical parameter counts and only ~10% more total training compute, the looped version showed clear gains:」图注：「(Evaluated on the 30B model after 200K long-context SFT, with thinking mode enabled.)」

> 口径提示：下表是 **30B 规模**上「Loop 架构 vs 同参数量基线」的对照实验读数，**不是 GLM-5.4（750B）本体的基准读数**。官方未公布 GLM-5.4 本体的任何基准分数。

| 评测 | 分数 | 备注 |
|---|---|---|
| AIME25 | Baseline 19.17 → +Loop 30.42 | 提升 11.3；平均输出长度 -635 tokens（-2%）（视觉转写） |
| GPQA-Diamond | Baseline 47.58 → +Loop 56.26 | 提升 8.7；平均输出长度 -2,473 tokens（-11.7%）（视觉转写） |
| AA-LCR | Baseline 40.33 → +Loop 47.67 | 提升 7.3；平均输出长度 -539 tokens（-9.7%）（视觉转写） |
| MMLU-Pro | Baseline 71.65 → +Loop 75.05 | 提升 3.4；平均输出长度 -863 tokens（-14.9%）（视觉转写） |
| IFBench | Baseline 50.20 → +Loop 53.47 | 提升 3.3；平均输出长度 -763 tokens（-13.0%）（视觉转写） |

### 非评测内容（推理吞吐规格，官方正文明文）

| 评测 | 分数 | 备注 |
|---|---|---|
| 推理吞吐（非基准评测） | 最高 200 tokens/s（离峰时段）；70–80 tokens/s（峰值负载） | 官方正文「Inference Efficiency」段明文；属解码吞吐规格，非基准评测分数，不与其它厂商横比 |

## 协议脚注

- 来源：https://z.ai/blog/glm-5.4（official primary_sources[0]）
- 补充官方文档页：https://docs.z.ai/guides/llm/glm-5.4
- 抓取时间：2026-11-28；快照方式：z.ai/blog 是客户端渲染的 Vue SPA，服务器端无正文 HTML，因此正文由官方文章打包文件（`article-bundle.js`，原文逐字解析）还原为 `page.html`，并保留打包文件原件供逐字复核。
- 发布日期证据：官方文章打包文件的元数据字段 `date: 2026-11-23`（与 OG 图资源名 `20261123-173242` 一致）。
- 数值转录规则：上表 5 行数值全部来自图片（`images/img_v3_...png`），按仓库口径标注「（视觉转写）」，只进账本 notes，**不自动翻 verified**；待人工读图确认后方可翻转。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/image.png | 1280x960 | https://z-ai-bj.oss-cn-beijing.aliyuncs.com/prompts-rich-media-resources/5.4-blog/image.png | Loop Transformer 架构图（Prelude / Loop Pass 1 / Loop Pass 2 / Coda） |
| images/img_v3_0217n_2d1a655c-5bce-4b3f-9115-2ad7c397ce5g.png | 1789x729 | https://z-ai-bj.oss-cn-beijing.aliyuncs.com/prompts-rich-media-resources/5.4-blog/img_v3_0217n_2d1a655c-5bce-4b3f-9115-2ad7c397ce5g.png | Scaling Correctness 等参数对照实验表（30B 规模，图内数值视觉转写来源） |

## 未归档资源说明

官方文章内嵌 4 段演示视频（Generalized Coding 样例），合计约 424 MB，按仓库归档惯例（只归档页面图片）未纳入本目录；其资源 URL 记录在 manifest.json 的 `omitted_media` 中。
