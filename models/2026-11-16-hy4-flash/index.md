---
vendor: tencent
model: Hy4 flash
release: hy4-flash
date: 2026-11-16
source: https://huggingface.co/tencent/Hy4-flash
fetched_at: 2026-11-24
---

# Hy4 flash（腾讯官方发布文证据归档）

发布日期证据链：腾讯混元官方博客正文封面卡印刷日「2026年11月16日」，并由官方 Hugging Face 模型卡与官方仓创建日（2026-11-18）互证，`date_precision=day`。

- 官方模型卡：https://huggingface.co/tencent/Hy4-flash （`README.md`，官方仓 raw README，原始字节未改动存档）
- 官方发布文：https://hunyuan.tencent.com/blog/100145 （`release-post.md`，腾讯官方博客接口返回的官方 markdown 正文，含内嵌 echarts 配置）
- 开源镜像：https://github.com/Tencent-Hunyuan/Hy4-flash ｜ https://huggingface.co/tencent/Hy4-flash

## 官方定位（原文要点）

- 官方模型卡：「Hy4 flash is our most cost-effective Hy model to date」——迄今性价比最高的 Hy 模型。
- 官方博客：「我们推出 Hy4 flash，迄今为止最高性价比的 Hy 模型」。

## 规格与架构（官方模型卡明示）

- **总参数**：220B（语言主干 155.5B + Engram 63.5B + ViT 0.43B + DFly2 drafter 0.85B）；官方博客口径写作「224B（其中 64B Engram 参数）」，两口径并存，已记入 notes 不做调和。
- **激活参数**：11.3B（文本）+ 0.43B（视觉）；官方博客写「激活参数 12B」。
- **上下文窗口**：1M（1,048,576 tokens）。
- **架构**：42 层语言主干（1 dense + 41 MoE），混合注意力（sparse + sliding-window / MLA），LatentMoE，Engram n-gram embedding，DFly2 投机解码 drafter。
- **模态**：原生接受文本与图像输入，生成文本。
- **API 定价**：输入（命中缓存）0.02 元 / 百万 tokens；输入 0.5 元；输出 2 元（Hy4 对照：0.3 / 6 / 18 元）。
- **解码速度**：官方称超过 150 tokens/s（megakernels + 4bit 量化 + DFly2）。

## 评测转录表（官方模型卡 Markdown 真表格，逐格机读）

| 评测 | 分数 | 备注 |
|---|---|---|
| MMLU†（5-shot） | 88.7% | 同行 Hy4=91.6、Hy3 preview=87.5、DeepSeek-V4-flash-Base=89.7、DeepSeek-V4-Pro-Base=91.1 |
| MMLU-Pro†（5-shot） | 71.1% | 同行 Hy4=73.9、Hy3 preview=65.8、DeepSeek-V4-flash-Base=68.6、DeepSeek-V4-Pro-Base=73.4 |
| MMLU-Redux†（5-shot） | 87.6% | 同行 Hy4=90.6、Hy3 preview=87.0、DeepSeek-V4-flash-Base=88.8、DeepSeek-V4-Pro-Base=90.2 |
| SuperGPQA†（5-shot） | 57.8% | 同行 Hy4=62.7、Hy3 preview=52.3、DeepSeek-V4-flash-Base=52.5、DeepSeek-V4-Pro-Base=54.8 |
| C-Eval†（5-shot） | 92.0% | 同行 Hy4=95.0、Hy3 preview=90.1、DeepSeek-V4-flash-Base=91.9、DeepSeek-V4-Pro-Base=93.4 |
| CMMLU†（5-shot） | 91.6% | 同行 Hy4=93.1、Hy3 preview=89.6、DeepSeek-V4-flash-Base=89.8、DeepSeek-V4-Pro-Base=90.7 |
| SimpleQA（5-shot） | 37.5% | 同行 Hy4=57.2、Hy3 preview=26.4、DeepSeek-V4-flash-Base=31.3、DeepSeek-V4-Pro-Base=52.1 |
| Chinese-SimpleQA†（5-shot） | 74.6% | 同行 Hy4=83.9、Hy3 preview=69.6、DeepSeek-V4-flash-Base=71.9、DeepSeek-V4-Pro-Base=76.6 |
| AGIEval (English)†（3-shot） | 75.4% | new-benchmark: agieval；同行 Hy4=79.3、Hy3 preview=76.0、DeepSeek-V4-flash-Base=76.3、DeepSeek-V4-Pro-Base=78.2 |
| AGIEval (Chinese)†（3-shot） | 90.6% | new-benchmark: agieval；同行 Hy4=91.2、Hy3 preview=87.8、DeepSeek-V4-flash-Base=88.5、DeepSeek-V4-Pro-Base=89.8 |
| HellaSwag (3,000-item subset)（10-shot） | 85.2% | 同行 Hy4=87.1、Hy3 preview=85.7、DeepSeek-V4-flash-Base=85.1、DeepSeek-V4-Pro-Base=86.8 |
| PIQA（4-shot） | 84.4% | new-benchmark: piqa；同行 Hy4=85.3、Hy3 preview=84.6、DeepSeek-V4-flash-Base=83.8、DeepSeek-V4-Pro-Base=84.9 |
| ARC-Challenge（0-shot） | 95.0% | 同行 Hy4=97.3、Hy3 preview=96.0、DeepSeek-V4-flash-Base=97.3、DeepSeek-V4-Pro-Base=97.0 |
| Social IQa（0-shot） | 80.1% | new-benchmark: social-iqa；同行 Hy4=82.7、Hy3 preview=80.5、DeepSeek-V4-flash-Base=72.5、DeepSeek-V4-Pro-Base=73.1 |
| KOR-Bench（3-shot） | 54.7% | 同行 Hy4=57.6、Hy3 preview=54.6、DeepSeek-V4-flash-Base=53.4、DeepSeek-V4-Pro-Base=55.4 |
| C³（0-shot） | 77.3% | 同行 Hy4=82.4、Hy3 preview=75.9、DeepSeek-V4-flash-Base=74.1、DeepSeek-V4-Pro-Base=78.3 |
| U-MATH（5-shot） | 69.8% | new-benchmark: u-math；同行 Hy4=71.6、Hy3 preview=60.9、DeepSeek-V4-flash-Base=57.4、DeepSeek-V4-Pro-Base=64.8 |
| OCW Courses（5-shot） | 64.0% | new-benchmark: ocw-courses；同行 Hy4=66.7、Hy3 preview=62.6、DeepSeek-V4-flash-Base=63.3、DeepSeek-V4-Pro-Base=68.2 |
| MBPP-plus（3-shot） | 73.7% | 同行 Hy4=74.0、Hy3 preview=77.4、DeepSeek-V4-flash-Base=76.8、DeepSeek-V4-Pro-Base=79.1 |
| Belebele (5-language subset)†（5-shot） | 93.8% | new-benchmark: belebele；同行 Hy4=95.0、Hy3 preview=94.2、DeepSeek-V4-flash-Base=94.4、DeepSeek-V4-Pro-Base=95.2 |
| INCLUDE†（5-shot） | 82.8% | 同行 Hy4=88.1、Hy3 preview=84.3、DeepSeek-V4-flash-Base=84.0、DeepSeek-V4-Pro-Base=84.3 |
| MMMU-Pro (Standard, 10 opts)（4-shot） | 52.0% | 同行 Hy4=59.6；Hy3 preview 与 DeepSeek 两列官方留空 |
| SimpleVQA（4-shot） | 48.5% | 同行 Hy4=54.5 |
| CVBench（4-shot） | 83.4% | 同行 Hy4=86.7 |
| RealWorldQA（4-shot） | 71.1% | 同行 Hy4=72.3 |
| TextVQA（4-shot） | 73.4% | new-benchmark: textvqa；同行 Hy4=78.2 |
| CountBenchQA（4-shot） | 86.6% | new-benchmark: countbenchqa；同行 Hy4=90.6 |
| WorkIndex（内部 8 个评测集） | 42.1 | new-benchmark: workindex；模型卡散文明文，Hy4 preview=39.7、Hy4=51.4 |
| Open Benchmarks（7 个公开 Agent 评测集汇总） | 48.3 | new-benchmark: hy4-open-benchmarks-aggregate；官方博客 echarts 数据块机读 |
| 盲测用户满意度（4 分制） | 2.79/4 | new-benchmark: hy4-flash-blind-eval；Claude Haiku 5.5=2.81/4；中位端到端完成 6.7 分钟、单任务成本 RMB 0.26 |

† 官方标注：† 行为 macro-average accuracy，其余文本行用评测套件报告的 accuracy 指标；粗体只标同行最高分，不代表统计显著性。

## 未转录区块说明

- 图 1 / 图 2 / 盲测图 / benchmark 全表以位图存档于 `images/`，供人工复核；对应数值已由官方散文或官方 echarts 数据块给出，本表未从位图读数。
