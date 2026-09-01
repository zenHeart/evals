---
vendor: google
model: Gemini 2.5 Pro
release: gemini-2-5-pro
date: 2025-03-25
source: https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025
fetched_at: 2026-09-01
---

# Gemini 2.5: Our most intelligent AI model

## 评测数据（转录）

> 说明:带(视觉转写)的行读自 images/03.gif 的六模型对比表(Gemini 2.5 Pro Experimental 03-25 / OpenAI o3-mini High / OpenAI GPT-4.5 / Claude 3.7 Sonnet 64k Extended Thinking / Grok 3 Beta Extended Thinking / DeepSeek R1);图注注明带 * 的数值仅在文本题上评测(不含图片)。未报告的单元格原文为"—",不转录。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| LMArena | — | 页面仅定性描述:"debuts at #1 on LMArena"、"tops the LMArena leaderboard by a significant margin"(无分数) |
| GPQA / AIME 2025 | — | 页面仅定性描述:"2.5 Pro leads in math and science benchmarks like GPQA and AIME 2025"(分数见图) |
| Humanity's Last Exam(no tools) | 18.8% | Gemini 2.5 Pro Experimental(页面文本:state-of-the-art 18.8% across models without tool use;与图表一致) |
| SWE-Bench Verified | 63.8% | Gemini 2.5 Pro,custom agent setup(页面文本;与图表一致) |
| Humanity's Last Exam(no tools) | 18.8% | Gemini 2.5 Pro Experimental(视觉转写) |
| Humanity's Last Exam(no tools) | 14.0%* | OpenAI o3-mini High(视觉转写;* = 仅文本题) |
| Humanity's Last Exam(no tools) | 6.4% | OpenAI GPT-4.5(视觉转写) |
| Humanity's Last Exam(no tools) | 8.9% | Claude 3.7 Sonnet 64k Extended Thinking(视觉转写) |
| Humanity's Last Exam(no tools) | 8.6%* | DeepSeek R1(视觉转写;* = 仅文本题) |
| GPQA diamond(single attempt,pass@1) | 84.0% | Gemini 2.5 Pro Experimental(视觉转写) |
| GPQA diamond(single attempt,pass@1) | 79.7% | OpenAI o3-mini High(视觉转写) |
| GPQA diamond(single attempt,pass@1) | 71.4% | OpenAI GPT-4.5(视觉转写) |
| GPQA diamond(single attempt,pass@1) | 78.2% | Claude 3.7 Sonnet 64k Extended Thinking(视觉转写) |
| GPQA diamond(single attempt,pass@1) | 80.2% | Grok 3 Beta Extended Thinking(视觉转写) |
| GPQA diamond(single attempt,pass@1) | 71.5% | DeepSeek R1(视觉转写) |
| GPQA diamond(multiple attempts) | 84.8% | Claude 3.7 Sonnet 64k Extended Thinking(视觉转写) |
| GPQA diamond(multiple attempts) | 84.6% | Grok 3 Beta Extended Thinking(视觉转写) |
| AIME 2025(single attempt,pass@1) | 86.7% | Gemini 2.5 Pro Experimental(视觉转写) |
| AIME 2025(single attempt,pass@1) | 86.5% | OpenAI o3-mini High(视觉转写) |
| AIME 2025(single attempt,pass@1) | 49.5% | Claude 3.7 Sonnet 64k Extended Thinking(视觉转写) |
| AIME 2025(single attempt,pass@1) | 77.3% | Grok 3 Beta Extended Thinking(视觉转写) |
| AIME 2025(single attempt,pass@1) | 70.0% | DeepSeek R1(视觉转写) |
| AIME 2025(multiple attempts) | 93.3% | Grok 3 Beta Extended Thinking(视觉转写) |
| AIME 2024(single attempt,pass@1) | 92.0% | Gemini 2.5 Pro Experimental(视觉转写) |
| AIME 2024(single attempt,pass@1) | 87.3% | OpenAI o3-mini High(视觉转写) |
| AIME 2024(single attempt,pass@1) | 36.7% | OpenAI GPT-4.5(视觉转写) |
| AIME 2024(single attempt,pass@1) | 61.3% | Claude 3.7 Sonnet 64k Extended Thinking(视觉转写) |
| AIME 2024(single attempt,pass@1) | 83.9% | Grok 3 Beta Extended Thinking(视觉转写) |
| AIME 2024(single attempt,pass@1) | 79.8% | DeepSeek R1(视觉转写) |
| AIME 2024(multiple attempts) | 80.0% | Claude 3.7 Sonnet 64k Extended Thinking(视觉转写) |
| AIME 2024(multiple attempts) | 93.3% | Grok 3 Beta Extended Thinking(视觉转写) |
| LiveCodeBench v5(single attempt,pass@1) | 70.4% | Gemini 2.5 Pro Experimental(视觉转写) |
| LiveCodeBench v5(single attempt,pass@1) | 74.1% | OpenAI o3-mini High(视觉转写) |
| LiveCodeBench v5(single attempt,pass@1) | 70.6% | Grok 3 Beta Extended Thinking(视觉转写) |
| LiveCodeBench v5(single attempt,pass@1) | 64.3% | DeepSeek R1(视觉转写) |
| LiveCodeBench v5(multiple attempts) | 79.4% | Grok 3 Beta Extended Thinking(视觉转写) |
| Aider Polyglot(whole/diff) | 74.0% / 68.6% | Gemini 2.5 Pro Experimental,whole/diff(视觉转写) |
| Aider Polyglot(diff) | 60.4% | OpenAI o3-mini High(视觉转写) |
| Aider Polyglot(diff) | 44.9% | OpenAI GPT-4.5(视觉转写) |
| Aider Polyglot(diff) | 64.9% | Claude 3.7 Sonnet 64k Extended Thinking(视觉转写) |
| Aider Polyglot(diff) | 56.9% | DeepSeek R1(视觉转写) |
| SWE-bench verified | 63.8% | Gemini 2.5 Pro Experimental(视觉转写) |
| SWE-bench verified | 49.3% | OpenAI o3-mini High(视觉转写) |
| SWE-bench verified | 38.0% | OpenAI GPT-4.5(视觉转写) |
| SWE-bench verified | 70.3% | Claude 3.7 Sonnet 64k Extended Thinking(视觉转写) |
| SWE-bench verified | 49.2% | DeepSeek R1(视觉转写) |
| SimpleQA(Factuality) | 52.9% | Gemini 2.5 Pro Experimental(视觉转写) |
| SimpleQA(Factuality) | 13.8% | OpenAI o3-mini High(视觉转写) |
| SimpleQA(Factuality) | 62.5% | OpenAI GPT-4.5(视觉转写) |
| SimpleQA(Factuality) | 43.6% | Grok 3 Beta Extended Thinking(视觉转写) |
| SimpleQA(Factuality) | 30.1% | DeepSeek R1(视觉转写) |
| MMMU(single attempt,pass@1) | 81.7% | Gemini 2.5 Pro Experimental(视觉转写) |
| MMMU(single attempt,pass@1) | no MM support | OpenAI o3-mini High(视觉转写,原文) |
| MMMU(single attempt,pass@1) | 74.4% | OpenAI GPT-4.5(视觉转写) |
| MMMU(single attempt,pass@1) | 75.0% | Claude 3.7 Sonnet 64k Extended Thinking(视觉转写) |
| MMMU(single attempt,pass@1) | 76.0% | Grok 3 Beta Extended Thinking(视觉转写) |
| MMMU(single attempt,pass@1) | no MM support | DeepSeek R1(视觉转写,原文) |
| MMMU(multiple attempts) | 78.0% | Grok 3 Beta Extended Thinking(视觉转写) |
| Vibe-Eval (Reka)(Image understanding) | 69.4% | Gemini 2.5 Pro Experimental(视觉转写;图注:以 Gemini 作为 judge) |
| Vibe-Eval (Reka)(Image understanding) | no MM support | OpenAI o3-mini High(视觉转写,原文) |
| Vibe-Eval (Reka)(Image understanding) | no MM support | DeepSeek R1(视觉转写,原文) |
| MRCR(128k,average) | 94.5% | Gemini 2.5 Pro Experimental(视觉转写) |
| MRCR(128k,average) | 61.4% | OpenAI o3-mini High(视觉转写) |
| MRCR(128k,average) | 64.0% | OpenAI GPT-4.5(视觉转写) |
| MRCR(1M,pointwise) | 83.1% | Gemini 2.5 Pro Experimental(视觉转写) |
| Global MMLU (Lite)(Multilingual) | 89.8% | Gemini 2.5 Pro Experimental(视觉转写) |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 200x112 | alt='Five glowing blue rectangles, decreasing in size, angled diagonally across a dark background, suggesting depth and layers.' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/2.5_keyword_header_no_t...
- images/02.webp — 2096x1182 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/2.5_keyword_header_no_t...
- images/03.gif — 1920x2578 | alt='Detailed table displays performance of multiple large language models on tests like math, coding, and reasoning. Gemini 2.5 Pro shows top results in several categories, indicated by highlighted cells. Fine print at the bottom provides context for the data.' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/original_images/gemini_benchma...
- images/04.webp — 1200x736 | alt='Bar charts comparing the performance of Gemini 2.5 Pro with other AI models like OpenAI GPT-4.5 and Claude 3.7 Sonnet across three categories: Reasoning, Science, and Mathematics. Gemini 2.5 Pro shows strong results in all categories.' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/final_2.5_blog_1.width-...
- images/05.webp — 2000x1228 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/final_2.5_blog_1.width-...
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
- images/18.png — 1200x627 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/2.5_keyword_social_shar...
