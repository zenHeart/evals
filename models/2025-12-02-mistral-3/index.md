---
vendor: mistral
model: Mistral Large 3 / Ministral 3 14B / Ministral 3 8B / Ministral 3 3B
release: mistral-3
date: 2025-12-02
source: https://mistral.ai/news/mistral-3/
fetched_at: 2026-09-01
---

# Introducing Mistral 3

## 评测数据（转录）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| AIME '25 | 85% | Ministral 3 14B（reasoning 变体，页面正文） |
| LMArena 排名（OSS 非推理类） | #2 | Mistral Large 3（页面正文） |
| LMArena 排名（OSS 模型总榜） | #6 | Mistral Large 3（页面正文） |
| 成本-性能比（OSS 对比） | — | 页面仅定性描述："achieves the best cost-to-performance ratio of any OSS model"（Ministral 3） |
| 真实场景生成 token 数 | — | 页面仅定性描述："often producing an order of magnitude fewer tokens"（Ministral instruct） |
| MMMLU（8-lang average，base） | 85.5 | Mistral Large 3（675B）（视觉转写，images/15.webp） |
| MMMLU（8-lang average，base） | 84.2 | Deepseek-3.1（670B）（视觉转写，images/15.webp） |
| MMMLU（8-lang average，base） | 83.5 | Kimi-K2（1.2T）（视觉转写，images/15.webp） |
| GPQA-Diamond（5-shot, no CoT，base） | 43.9 | Mistral Large 3（675B）（视觉转写，images/15.webp） |
| GPQA-Diamond（5-shot, no CoT，base） | 41.9 | Deepseek-3.1（670B）（视觉转写，images/15.webp） |
| GPQA-Diamond（5-shot, no CoT，base） | 35.6 | Kimi-K2（1.2T）（视觉转写，images/15.webp） |
| SimpleQA（Exact match，base） | 23.8 | Mistral Large 3（675B）（视觉转写，images/15.webp） |
| SimpleQA（Exact match，base） | 19.7 | Deepseek-3.1（670B）（视觉转写，images/15.webp） |
| SimpleQA（Exact match，base） | 26.0 | Kimi-K2（1.2T）（视觉转写，images/15.webp） |
| AMC（base） | 52.0 | Mistral Large 3（675B）（视觉转写，images/15.webp） |
| AMC（base） | 46.4 | Deepseek-3.1（670B）（视觉转写，images/15.webp） |
| AMC（base） | 54.4 | Kimi-K2（1.2T）（视觉转写，images/15.webp） |
| LiveCodeBench（no CoT，base） | 34.4 | Mistral Large 3（675B）（视觉转写，images/15.webp） |
| LiveCodeBench（no CoT，base） | 35.6 | Deepseek-3.1（670B）（视觉转写，images/15.webp） |
| LiveCodeBench（no CoT，base） | 40.2 | Kimi-K2（1.2T）（视觉转写，images/15.webp） |
| LMArena ELO Score | 1418 ±11 | Mistral Large 3（视觉转写，images/19.webp） |
| LMArena ELO Score | 1394 ±4 | Qwen3-VL (non-thinking)（视觉转写，images/19.webp） |
| LMArena ELO Score | 1421 ±4 | Qwen3 2507 (non-thinking)（视觉转写，images/19.webp） |
| LMArena ELO Score | 1418 ±7 | Kimi-2 0905 (non-thinking)（视觉转写，images/19.webp） |
| LMArena ELO Score | 1423 ±7 | DeepSeek v3.2 (non-thinking)（视觉转写，images/19.webp） |
| 人工评测 Win（General Prompts） | 53% | Mistral Large 3 vs Deepseek V3.1，第三方人工评审（视觉转写，images/17.webp） |
| 人工评测 Lose（General Prompts） | 47% | Mistral Large 3 vs Deepseek V3.1，第三方人工评审（视觉转写，images/17.webp） |
| 人工评测 Win（General Prompts） | 55% | Mistral Large 3 vs Kimi K2，第三方人工评审（视觉转写，images/17.webp） |
| 人工评测 Lose（General Prompts） | 45% | Mistral Large 3 vs Kimi K2，第三方人工评审（视觉转写，images/17.webp） |
| 人工评测 Win（Multilingual Prompts） | 57% | Mistral Large 3 vs Deepseek V3.1，第三方人工评审（视觉转写，images/17.webp） |
| 人工评测 Lose（Multilingual Prompts） | 43% | Mistral Large 3 vs Deepseek V3.1，第三方人工评审（视觉转写，images/17.webp） |
| 人工评测 Win（Multilingual Prompts） | 60% | Mistral Large 3 vs Kimi K2，第三方人工评审（视觉转写，images/17.webp） |
| 人工评测 Lose（Multilingual Prompts） | 40% | Mistral Large 3 vs Kimi K2，第三方人工评审（视觉转写，images/17.webp） |
| GPQA Diamond（Ministral 3 instruct vs 竞品散点） | — | 页面仅定性呈现，图表无数值标签：Ministral3 14B/8B/3B Instruct 与 Qwen3-VL 8B/4B、Gemma3 12B/4B Instruct 的准确率-输出 token 数对比（视觉转写，images/21.webp） |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 192x192 | 原URL: https://mistral.ai/_astro/ai-app_LCReD.webp
- images/02.webp — 192x192 | 原URL: https://mistral.ai/_astro/ai-app_Z2q9iqE.webp
- images/03.webp — 144x144 | 原URL: https://mistral.ai/_astro/logo-forge_Z1mQhkS.webp
- images/04.webp — 144x144 | 原URL: https://mistral.ai/_astro/logo-forge_ZFCTMS.webp
- images/05.webp — 120x120 | 原URL: https://mistral.ai/_astro/vibe_Z20p2OU.webp
- images/06.webp — 120x120 | 原URL: https://mistral.ai/_astro/vibe_19h78z.webp
- images/07.webp — 144x144 | 原URL: https://mistral.ai/_astro/logo-vibe-code_drDoK.webp
- images/08.webp — 144x144 | 原URL: https://mistral.ai/_astro/logo-vibe-code_ZmCjpX.webp
- images/09.webp — 120x120 | 原URL: https://mistral.ai/_astro/logo-compute_ZDL3ab.webp
- images/10.webp — 120x120 | 原URL: https://mistral.ai/_astro/logo-compute_Z1P9afi.webp
- images/11.webp — 1440x800 | 原URL: https://mistral.ai/_astro/Cover-Mistral%203_Z2gN5Tx.webp
- images/12.webp — 1440x800 | 原URL: https://mistral.ai/_astro/Cover-Mistral%203_ZxFoJa.webp
- images/13.webp — 1800x1074 | 原URL: https://mistral.ai/_astro/Thumbnail-Mistral%203_1M7PB5.webp
- images/14.webp — 1800x1074 | 原URL: https://mistral.ai/_astro/Thumbnail-Mistral%203_ZuRcet.webp
- images/15.webp — 1905x1242 | alt='Chart Base Models (1)' | 原URL: https://mistral.ai/_astro/98aeee04-e1c3-43b7-b90e-c51da84d5e56_ZdKC34.webp
- images/16.webp — 1905x1242 | 原URL: https://mistral.ai/_astro/98aeee04-e1c3-43b7-b90e-c51da84d5e56_1QzOEG.webp
- images/17.webp — 1346x1115 | alt='3 Model Performance Comparison (instruct)' | 原URL: https://mistral.ai/_astro/bdf27a12-76fd-4e62-be9b-938f14288a9a_ZqfLXe.webp
- images/18.webp — 1346x1115 | 原URL: https://mistral.ai/_astro/bdf27a12-76fd-4e62-be9b-938f14288a9a_FMdgy.webp
- images/19.webp — 1905x1242 | alt='Lm Arena Chart Ml3' | 原URL: https://mistral.ai/_astro/4626af3d-7554-4d50-9c0e-041fe7111ece_Z1qTh5k.webp
- images/20.webp — 1905x1242 | 原URL: https://mistral.ai/_astro/4626af3d-7554-4d50-9c0e-041fe7111ece_DraCq.webp
- images/21.webp — 1726x1062 | alt='4 Gpqa Diamond Accuracy' | 原URL: https://mistral.ai/_astro/ea1fcc83-5bad-400e-b63a-35c8a8c0bf9c_ZEaRWe.webp
- images/22.webp — 1726x1062 | 原URL: https://mistral.ai/_astro/ea1fcc83-5bad-400e-b63a-35c8a8c0bf9c_Z2tYriJ.webp
- images/23.jpg — 1800x1074 | 原URL: https://mistral.ai/cms-media/api/media/file/Thumbnail-Mistral%203.jpg
