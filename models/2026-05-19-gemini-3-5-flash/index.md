---
vendor: google
model: Gemini 3.5 Flash
release: gemini-3-5-flash
date: 2026-05-19
source: https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/
fetched_at: 2026-09-01
---

# Gemini 3.5: frontier intelligence with action

## 评测数据（转录）

> 说明:页面正文给出 4 项 Gemini 3.5 Flash 分数(备注写"Gemini 3.5 Flash(页面文本)")。带(视觉转写)的行读自 images/03.gif 的六列对比表(Gemini 3.5 Flash / Gemini 3 Flash / Gemini 3.1 Pro / Claude Sonnet 4.6 / Claude Opus 4.7 / GPT-5.5);images/04.webp 为 AA Intelligence Index-输出速度散点图,无精确数值标注。未报告单元格原文为"-",不转录。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Terminal-Bench 2.1(Terminus-2 harness) | 76.2% | Gemini 3.5 Flash(页面文本;与图表一致) |
| GDPval-AA(Elo) | 1656 | Gemini 3.5 Flash(页面文本;与图表一致) |
| MCP Atlas | 83.6% | Gemini 3.5 Flash(页面文本;与图表一致) |
| CharXiv Reasoning(no tools) | 84.2% | Gemini 3.5 Flash(页面文本:leading in multimodal understanding) |
| 输出速度 | — | 页面仅定性描述:"4 times faster than other frontier models"(output tokens per second 口径,无绝对分数) |
| 成本 | — | 页面仅定性描述:"often at less than half the cost of other frontier models"(无分数) |
| Terminal-bench 2.1(Terminus-2 harness) | 58.0% | Gemini 3 Flash(视觉转写) |
| Terminal-bench 2.1(Terminus-2 harness) | 70.3% | Gemini 3.1 Pro(视觉转写) |
| Terminal-bench 2.1(Terminus-2 harness) | 66.1% | Claude Opus 4.7(视觉转写) |
| Terminal-bench 2.1(Terminus-2 harness) | 78.2% | GPT-5.5(视觉转写) |
| SWE-Bench Pro (Public)(single attempt) | 55.1% | Gemini 3.5 Flash(视觉转写) |
| SWE-Bench Pro (Public)(single attempt) | 49.6% | Gemini 3 Flash(视觉转写) |
| SWE-Bench Pro (Public)(single attempt) | 54.2% | Gemini 3.1 Pro(视觉转写) |
| SWE-Bench Pro (Public)(single attempt) | 64.3% | Claude Opus 4.7(视觉转写) |
| SWE-Bench Pro (Public)(single attempt) | 58.6% | GPT-5.5(视觉转写) |
| MCP Atlas(multi-step workflows using MCP) | 62.0% | Gemini 3 Flash(视觉转写) |
| MCP Atlas(multi-step workflows using MCP) | 78.2% | Gemini 3.1 Pro(视觉转写) |
| MCP Atlas(multi-step workflows using MCP) | 69.5% | Claude Sonnet 4.6(视觉转写) |
| MCP Atlas(multi-step workflows using MCP) | 79.1% | Claude Opus 4.7(视觉转写) |
| MCP Atlas(multi-step workflows using MCP) | 75.3% | GPT-5.5(视觉转写) |
| Toolathlon(real-world general tool use) | 56.5% | Gemini 3.5 Flash(视觉转写) |
| Toolathlon(real-world general tool use) | 49.4% | Gemini 3 Flash(视觉转写) |
| Toolathlon(real-world general tool use) | 55.6% | GPT-5.5(视觉转写) |
| OSWorld-Verified(agentic computer use) | 78.4% | Gemini 3.5 Flash(视觉转写) |
| OSWorld-Verified(agentic computer use) | 65.1% | Gemini 3 Flash(视觉转写) |
| OSWorld-Verified(agentic computer use) | 76.2% | Gemini 3.1 Pro(视觉转写) |
| OSWorld-Verified(agentic computer use) | 72.5% | Claude Sonnet 4.6(视觉转写) |
| OSWorld-Verified(agentic computer use) | 78.0% | Claude Opus 4.7(视觉转写) |
| OSWorld-Verified(agentic computer use) | 78.7% | GPT-5.5(视觉转写) |
| Finance Agent v2(financial analysis and decision-making) | 57.9% | Gemini 3.5 Flash(视觉转写) |
| Finance Agent v2(financial analysis and decision-making) | 42.6% | Gemini 3 Flash(视觉转写) |
| Finance Agent v2(financial analysis and decision-making) | 43.0% | Gemini 3.1 Pro(视觉转写) |
| Finance Agent v2(financial analysis and decision-making) | 51.0% | Claude Sonnet 4.6(视觉转写) |
| Finance Agent v2(financial analysis and decision-making) | 51.5% | Claude Opus 4.7(视觉转写) |
| Finance Agent v2(financial analysis and decision-making) | 51.8% | GPT-5.5(视觉转写) |
| GDPval-AA(Economically valuable knowledge work,Elo) | 1204 | Gemini 3 Flash(视觉转写) |
| GDPval-AA(Economically valuable knowledge work,Elo) | 1314 | Gemini 3.1 Pro(视觉转写) |
| GDPval-AA(Economically valuable knowledge work,Elo) | 1676 | Claude Sonnet 4.6(视觉转写) |
| GDPval-AA(Economically valuable knowledge work,Elo) | 1753 | Claude Opus 4.7(视觉转写) |
| GDPval-AA(Economically valuable knowledge work,Elo) | 1769 | GPT-5.5(视觉转写) |
| CharXiv Reasoning(no tools) | 80.3% | Gemini 3 Flash(视觉转写) |
| CharXiv Reasoning(no tools) | 83.3% | Gemini 3.1 Pro(视觉转写) |
| CharXiv Reasoning(no tools) | 72.4% | Claude Sonnet 4.6(视觉转写) |
| CharXiv Reasoning(no tools) | 82.1% | Claude Opus 4.7(视觉转写) |
| CharXiv Reasoning(no tools) | 84.1% | GPT-5.5(视觉转写) |
| MMMU-Pro(no tools) | 83.6% | Gemini 3.5 Flash(视觉转写) |
| MMMU-Pro(no tools) | 81.2% | Gemini 3 Flash(视觉转写) |
| MMMU-Pro(no tools) | 80.5% | Gemini 3.1 Pro(视觉转写) |
| MMMU-Pro(no tools) | 74.5% | Claude Sonnet 4.6(视觉转写) |
| MMMU-Pro(no tools) | 75.2% | Claude Opus 4.7(视觉转写) |
| MMMU-Pro(no tools) | 81.2% | GPT-5.5(视觉转写) |
| Blueprint-Bench 2(agentic spatial reasoning,normalized score) | 33.6% | Gemini 3.5 Flash(视觉转写) |
| Blueprint-Bench 2(agentic spatial reasoning,normalized score) | 0.0% | Gemini 3 Flash(视觉转写) |
| Blueprint-Bench 2(agentic spatial reasoning,normalized score) | 26.5% | Gemini 3.1 Pro(视觉转写) |
| Blueprint-Bench 2(agentic spatial reasoning,normalized score) | 6.7% | Claude Sonnet 4.6(视觉转写) |
| Blueprint-Bench 2(agentic spatial reasoning,normalized score) | 24.5% | Claude Opus 4.7(视觉转写) |
| Blueprint-Bench 2(agentic spatial reasoning,normalized score) | 36.2% | GPT-5.5(视觉转写) |
| MRCR v2 (8-needle)(128k,average) | 77.3% | Gemini 3.5 Flash(视觉转写) |
| MRCR v2 (8-needle)(128k,average) | 67.2% | Gemini 3 Flash(视觉转写) |
| MRCR v2 (8-needle)(128k,average) | 84.9% | Gemini 3.1 Pro(视觉转写) |
| MRCR v2 (8-needle)(128k,average) | 84.9% | Claude Sonnet 4.6(视觉转写) |
| MRCR v2 (8-needle)(128k,average) | 59.3% | Claude Opus 4.7(视觉转写) |
| MRCR v2 (8-needle)(128k,average) | 94.8% | GPT-5.5(视觉转写) |
| MRCR v2 (8-needle)(1M,pointwise) | 26.6% | Gemini 3.5 Flash(视觉转写) |
| MRCR v2 (8-needle)(1M,pointwise) | 22.1% | Gemini 3 Flash(视觉转写) |
| MRCR v2 (8-needle)(1M,pointwise) | 26.3% | Gemini 3.1 Pro(视觉转写) |
| Humanity's Last Exam(full set,text + MM) | 40.2% | Gemini 3.5 Flash(视觉转写) |
| Humanity's Last Exam(full set,text + MM) | 33.7% | Gemini 3 Flash(视觉转写) |
| Humanity's Last Exam(full set,text + MM) | 44.4% | Gemini 3.1 Pro(视觉转写) |
| Humanity's Last Exam(full set,text + MM) | 33.2% | Claude Sonnet 4.6(视觉转写) |
| Humanity's Last Exam(full set,text + MM) | 46.9% | Claude Opus 4.7(视觉转写) |
| Humanity's Last Exam(full set,text + MM) | 41.4% | GPT-5.5(视觉转写) |
| ARC-AGI-2(abstract reasoning puzzles) | 72.1% | Gemini 3.5 Flash(视觉转写) |
| ARC-AGI-2(abstract reasoning puzzles) | 33.6% | Gemini 3 Flash(视觉转写) |
| ARC-AGI-2(abstract reasoning puzzles) | 77.1% | Gemini 3.1 Pro(视觉转写) |
| ARC-AGI-2(abstract reasoning puzzles) | 58.3% | Claude Sonnet 4.6(视觉转写) |
| ARC-AGI-2(abstract reasoning puzzles) | 75.8% | Claude Opus 4.7(视觉转写) |
| ARC-AGI-2(abstract reasoning puzzles) | 84.6% | GPT-5.5(视觉转写) |
| Artificial Analysis Intelligence Index vs Output Speed | — | 页面仅定性描述;散点图(视觉转写)中 Gemini 3.5 Flash 位于右上高指数/高速度区,无数值标注(坐标轴 30–70 / 100–300+ tokens/S) |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 200x112 | alt='Gemini 3.5 text and multi-colored star icon on an abstract blue background.' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-5__keyword__bl...
- images/02.webp — 2096x1182 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-5__keyword__bl...
- images/03.gif — 1187x889 | alt='Performance comparison table of Gemini, Claude, and GPT models across various benchmarks, highlighting Gemini 3.5 Flash.' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/original_images/gemini-3-5__be...
- images/04.webp — 1200x667 | alt='an image showing "Artificial Analysis Intelligence Index vs Output Speed' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/GeminiModels_Artificial...
- images/05.webp — 2000x1112 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/GeminiModels_Artificial...
- images/06.webp — 800x451 | alt='The image shows a colorful abstract design with the Google I/O 2026 logo.' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/IOCollection_social.wid...
- images/07.webp — 2096x1182 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/IOCollection_social.wid...
- images/08.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Search_Travel_Blog_He.2...
- images/09.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Search_Travel_Blog_He.2...
- images/10.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Omni_1-1_Flash_hero.2e1...
- images/11.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Omni_1-1_Flash_hero.2e1...
- images/12.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini_3-5_transcribe.2...
- images/13.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini_3-5_transcribe.2...
- images/14.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Home_Decor.2e16d0ba.fil...
- images/15.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Home_Decor.2e16d0ba.fil...
- images/16.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/thumbnail_BfIj9lP.2e16d...
- images/17.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/thumbnail_BfIj9lP.2e16d...
- images/18.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Blog_header_2_JwwDb02.2...
- images/19.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Blog_header_2_JwwDb02.2...
- images/20.png — 1300x731 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-5__keywordstat...
