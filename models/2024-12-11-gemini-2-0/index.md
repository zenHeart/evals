---
vendor: google
model: Gemini 2.0 Flash / Project Mariner
release: gemini-2-0
date: 2024-12-11
source: https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/
fetched_at: 2026-09-01
---

# Introducing Gemini 2.0: our new AI model for the agentic era

## 评测数据（转录）

> 说明:除 WebVoyager 外,本页 benchmark 数值全部读自 images/03.gif 的对比表(列:Gemini 1.5 Flash 002 / Gemini 1.5 Pro 002 / Gemini 2.0 Flash Experimental),逐值标注(视觉转写)。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| WebVoyager(Project Mariner 浏览器任务) | 83.5% | Project Mariner(页面文本:achieved a state-of-the-art result of 83.5%) |
| 综合 | — | 页面仅定性描述:"2.0 Flash even outperforms 1.5 Pro on key benchmarks, at twice the speed"(无分数) |
| MMLU-Pro(General) | 67.3% | Gemini 1.5 Flash 002(视觉转写) |
| MMLU-Pro(General) | 75.8% | Gemini 1.5 Pro 002(视觉转写) |
| MMLU-Pro(General) | 76.4% | Gemini 2.0 Flash Experimental(视觉转写) |
| Natural2Code(Code) | 79.8% | Gemini 1.5 Flash 002(视觉转写) |
| Natural2Code(Code) | 85.4% | Gemini 1.5 Pro 002(视觉转写) |
| Natural2Code(Code) | 92.9% | Gemini 2.0 Flash Experimental(视觉转写) |
| Bird-SQL (Dev)(Code) | 45.6% | Gemini 1.5 Flash 002(视觉转写) |
| Bird-SQL (Dev)(Code) | 54.4% | Gemini 1.5 Pro 002(视觉转写) |
| Bird-SQL (Dev)(Code) | 56.9% | Gemini 2.0 Flash Experimental(视觉转写) |
| LiveCodeBench (Code Generation)(Code,样例 06/01/2024–10/05/2024) | 30.0% | Gemini 1.5 Flash 002(视觉转写) |
| LiveCodeBench (Code Generation)(Code,样例 06/01/2024–10/05/2024) | 34.3% | Gemini 1.5 Pro 002(视觉转写) |
| LiveCodeBench (Code Generation)(Code,样例 06/01/2024–10/05/2024) | 35.1% | Gemini 2.0 Flash Experimental(视觉转写) |
| FACTS Grounding(Factuality) | 82.9% | Gemini 1.5 Flash 002(视觉转写) |
| FACTS Grounding(Factuality) | 80.0% | Gemini 1.5 Pro 002(视觉转写) |
| FACTS Grounding(Factuality) | 83.6% | Gemini 2.0 Flash Experimental(视觉转写) |
| MATH(Math) | 77.9% | Gemini 1.5 Flash 002(视觉转写) |
| MATH(Math) | 86.5% | Gemini 1.5 Pro 002(视觉转写) |
| MATH(Math) | 89.7% | Gemini 2.0 Flash Experimental(视觉转写) |
| HiddenMath(Math,AIME/AMC-like 私有集) | 47.2% | Gemini 1.5 Flash 002(视觉转写) |
| HiddenMath(Math,AIME/AMC-like 私有集) | 52.0% | Gemini 1.5 Pro 002(视觉转写) |
| HiddenMath(Math,AIME/AMC-like 私有集) | 63.0% | Gemini 2.0 Flash Experimental(视觉转写) |
| GPQA (diamond)(Reasoning) | 51.0% | Gemini 1.5 Flash 002(视觉转写) |
| GPQA (diamond)(Reasoning) | 59.1% | Gemini 1.5 Pro 002(视觉转写) |
| GPQA (diamond)(Reasoning) | 62.1% | Gemini 2.0 Flash Experimental(视觉转写) |
| MRCR (1M)(Long context) | 71.9% | Gemini 1.5 Flash 002(视觉转写) |
| MRCR (1M)(Long context) | 82.6% | Gemini 1.5 Pro 002(视觉转写) |
| MRCR (1M)(Long context) | 69.2% | Gemini 2.0 Flash Experimental(视觉转写) |
| MMMU(Image) | 62.3% | Gemini 1.5 Flash 002(视觉转写) |
| MMMU(Image) | 65.9% | Gemini 1.5 Pro 002(视觉转写) |
| MMMU(Image) | 70.7% | Gemini 2.0 Flash Experimental(视觉转写) |
| Vibe-Eval (Reka)(Image) | 48.9% | Gemini 1.5 Flash 002(视觉转写) |
| Vibe-Eval (Reka)(Image) | 53.9% | Gemini 1.5 Pro 002(视觉转写) |
| Vibe-Eval (Reka)(Image) | 56.3% | Gemini 2.0 Flash Experimental(视觉转写) |
| CoVoST2 (21 lang)(Audio,BLEU 分数) | 37.4 | Gemini 1.5 Flash 002(视觉转写) |
| CoVoST2 (21 lang)(Audio,BLEU 分数) | 40.1 | Gemini 1.5 Pro 002(视觉转写) |
| CoVoST2 (21 lang)(Audio,BLEU 分数) | 39.2 | Gemini 2.0 Flash Experimental(视觉转写) |
| EgoSchema (test)(Video) | 66.8% | Gemini 1.5 Flash 002(视觉转写) |
| EgoSchema (test)(Video) | 71.2% | Gemini 1.5 Pro 002(视觉转写) |
| EgoSchema (test)(Video) | 71.5% | Gemini 2.0 Flash Experimental(视觉转写) |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 200x112 | alt='Text "Gemini 2.0" in front of a futuristic blue and black abstract background' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/blog_gemini_keyword_hea...
- images/02.webp — 2096x1182 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/blog_gemini_keyword_hea...
- images/03.gif — 1920x2736 | alt='A chart comparing Gemini models and their capabilities' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/original_images/gemini_benchma...
- images/04.webp — 800x450 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/12-11-24_Collection_Soc...
- images/05.webp — 1921x1081 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/12-11-24_Collection_Soc...
- images/06.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Omni_1-1_Flash_hero.2e1...
- images/07.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Omni_1-1_Flash_hero.2e1...
- images/08.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini_3-5_transcribe.2...
- images/09.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini_3-5_transcribe.2...
- images/10.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/thumbnail_BfIj9lP.2e16d...
- images/11.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/thumbnail_BfIj9lP.2e16d...
- images/12.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash.2e16d0...
- images/13.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash.2e16d0...
- images/14.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Omni_experts_social.2e1...
- images/15.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Omni_experts_social.2e1...
- images/16.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/AIME_SIZZLE_THUMBNAIL.2...
- images/17.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/AIME_SIZZLE_THUMBNAIL.2...
- images/18.png — 1300x731 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/blog_gemini_hero_thumbn...
