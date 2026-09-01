---
vendor: google
model: Gemini 3.7 Flash
release: gemini-3-7-flash
date: 2026-08-13
source: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/
fetched_at: 2026-09-01
---

# Introducing Gemini 3.7 Flash

## 评测数据（转录）

> 说明:页面正文以"x vs y"形式给出 3.7 Flash 对 3.6 Flash 的分数;详细对比表在 images/17.webp/18.webp(列:Gemini 3.7 Flash / Gemini 3.6 Flash / Claude Sonnet 5 / GPT-5.6 Terra / Muse Spark 1.2),带(视觉转写)的行读自该图。images/03.webp 为 DeepSWE 性能-成本散点图,无精确数值标注。未报告单元格原文为"-",不转录。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| FrontierCode 1.1 Main(production code quality) | 43.6% vs 34.4% | Gemini 3.7 Flash vs 3.6 Flash(页面文本;与图表一致) |
| DeepSWE v1.1(long-horizon software engineering) | 65.3% vs 49.0% | Gemini 3.7 Flash vs 3.6 Flash(页面文本;图中 3.6 Flash 作 48.6%,两处不一致,均原样转录) |
| WebDev Arena(Elo,UI 生成) | 1588 vs 1538 | Gemini 3.7 Flash vs 3.6 Flash(页面文本;图表同值,行名作 Code Arena/web development) |
| GDP.pdf(复杂文档理解) | 34.0% vs 22.0% | Gemini 3.7 Flash vs 3.6 Flash(页面文本;与图表一致) |
| AutomationBench(real-world business workflows) | 30.4% vs 17.0% | Gemini 3.7 Flash vs 3.6 Flash(页面文本;与图表一致) |
| 定价 | $0.75/1M input、$3.75/1M output | 页面文本:"introductory price of half the original 3.6 Flash cost per million tokens";图注:3.6/3.7 Flash 促销价 2026-12-31 到期,2027-01-01 起 $1.50/$7.50 |
| DeepSWE V1.1(性能-成本散点) | — | 页面仅定性描述;散点图(视觉转写)中 gemini-3.7-flash 位于高分解/低成本前沿,无数值标注 |
| Input price($/1M tokens) | $0.75* | Gemini 3.7 Flash(视觉转写;* 促销价,见上注) |
| Input price($/1M tokens) | $0.75* | Gemini 3.6 Flash(视觉转写) |
| Input price($/1M tokens) | $2.00 | Claude Sonnet 5(视觉转写) |
| Input price($/1M tokens) | $2.00 | GPT-5.6 Terra(视觉转写) |
| Input price($/1M tokens) | $1.25 | Muse Spark 1.2(视觉转写) |
| Output price($/1M tokens) | $3.75* | Gemini 3.7 Flash(视觉转写) |
| Output price($/1M tokens) | $3.75* | Gemini 3.6 Flash(视觉转写) |
| Output price($/1M tokens) | $10.00 | Claude Sonnet 5(视觉转写) |
| Output price($/1M tokens) | $12.00 | GPT-5.6 Terra(视觉转写) |
| Output price($/1M tokens) | $4.25 | Muse Spark 1.2(视觉转写) |
| Artificial Analysis Intelligence Index(composite model intelligence) | 56 | Gemini 3.7 Flash(视觉转写) |
| Artificial Analysis Intelligence Index(composite model intelligence) | 52 | Gemini 3.6 Flash(视觉转写) |
| Artificial Analysis Intelligence Index(composite model intelligence) | 55 | Claude Sonnet 5(视觉转写) |
| Artificial Analysis Intelligence Index(composite model intelligence) | 57 | GPT-5.6 Terra(视觉转写) |
| Artificial Analysis Intelligence Index(composite model intelligence) | 57 | Muse Spark 1.2(视觉转写) |
| FrontierCode 1.1 Main(Score) | 43.6% | Gemini 3.7 Flash(视觉转写) |
| FrontierCode 1.1 Main(Score) | 34.4% | Gemini 3.6 Flash(视觉转写) |
| FrontierCode 1.1 Main(Score) | 42.7% | Claude Sonnet 5(视觉转写) |
| FrontierCode 1.1 Main(Score) | 41.3% | GPT-5.6 Terra(视觉转写) |
| DeepSWE v1.1 | 65.3% | Gemini 3.7 Flash(视觉转写) |
| DeepSWE v1.1 | 48.6% | Gemini 3.6 Flash(视觉转写;正文引 49.0%) |
| DeepSWE v1.1 | 53.8% | Claude Sonnet 5(视觉转写) |
| DeepSWE v1.1 | 69.6% | GPT-5.6 Terra(视觉转写) |
| DeepSWE v1.1 | 54.9% | Muse Spark 1.2(视觉转写) |
| Code Arena(web development,Elo) | 1588 | Gemini 3.7 Flash(视觉转写) |
| Code Arena(web development,Elo) | 1538 | Gemini 3.6 Flash(视觉转写) |
| Code Arena(web development,Elo) | 1541 | Claude Sonnet 5(视觉转写) |
| Code Arena(web development,Elo) | 1523 | GPT-5.6 Terra(视觉转写) |
| Code Arena(web development,Elo) | 1535 | Muse Spark 1.2(视觉转写) |
| Terminal-bench 2.1(agentic terminal coding) | 85.8% | Gemini 3.7 Flash(视觉转写) |
| Terminal-bench 2.1(agentic terminal coding) | 78.0% | Gemini 3.6 Flash(视觉转写) |
| Terminal-bench 2.1(agentic terminal coding) | 80.4% | Claude Sonnet 5(视觉转写) |
| Terminal-bench 2.1(agentic terminal coding) | 87.4% | GPT-5.6 Terra(视觉转写) |
| Terminal-bench 2.1(agentic terminal coding) | 82.9% | Muse Spark 1.2(视觉转写) |
| Terminal-bench 3.0(general agent capabilities) | 14.9% | Gemini 3.7 Flash(视觉转写) |
| Terminal-bench 3.0(general agent capabilities) | 5.4% | Gemini 3.6 Flash(视觉转写) |
| Terminal-bench 3.0(general agent capabilities) | 14.6% | Claude Sonnet 5(视觉转写) |
| Terminal-bench 3.0(general agent capabilities) | 20.8% | GPT-5.6 Terra(视觉转写) |
| AutomationBench(enterprise workflow automation,private set) | 30.4% | Gemini 3.7 Flash(视觉转写) |
| AutomationBench(enterprise workflow automation,private set) | 17.0% | Gemini 3.6 Flash(视觉转写) |
| AutomationBench(enterprise workflow automation,private set) | 10.7% | Claude Sonnet 5(视觉转写) |
| AutomationBench(enterprise workflow automation,private set) | 23.6% | GPT-5.6 Terra(视觉转写) |
| GDPval-AA v2(knowledge work,Elo) | 1525 | Gemini 3.7 Flash(视觉转写) |
| GDPval-AA v2(knowledge work,Elo) | 1422 | Gemini 3.6 Flash(视觉转写) |
| GDPval-AA v2(knowledge work,Elo) | 1598 | Claude Sonnet 5(视觉转写) |
| GDPval-AA v2(knowledge work,Elo) | 1578 | GPT-5.6 Terra(视觉转写) |
| GDPval-AA v2(knowledge work,Elo) | 1628 | Muse Spark 1.2(视觉转写) |
| Harvey LAB-AA(complex legal workflows) | 90.7% | Gemini 3.7 Flash(视觉转写) |
| Harvey LAB-AA(complex legal workflows) | 85.1% | Gemini 3.6 Flash(视觉转写) |
| Harvey LAB-AA(complex legal workflows) | 90.1% | Claude Sonnet 5(视觉转写) |
| Harvey LAB-AA(complex legal workflows) | 85.2% | GPT-5.6 Terra(视觉转写) |
| GDP.pdf(expert PDF document comprehension) | 34.0% | Gemini 3.7 Flash(视觉转写) |
| GDP.pdf(expert PDF document comprehension) | 22.0% | Gemini 3.6 Flash(视觉转写) |
| GDP.pdf(expert PDF document comprehension) | 28.0% | Claude Sonnet 5(视觉转写) |
| GDP.pdf(expert PDF document comprehension) | 24.7% | GPT-5.6 Terra(视觉转写) |
| GDP.pdf(expert PDF document comprehension) | 16.0% | Muse Spark 1.2(视觉转写) |
| CharXiv Reasoning(no tools) | 84.5% | Gemini 3.7 Flash(视觉转写) |
| CharXiv Reasoning(no tools) | 85.2% | Gemini 3.6 Flash(视觉转写) |
| CharXiv Reasoning(no tools) | 77.0% | Claude Sonnet 5(视觉转写) |
| CharXiv Reasoning(no tools) | 85.9% | GPT-5.6 Terra(视觉转写) |
| CharXiv Reasoning(with tools) | 88.7% | Gemini 3.7 Flash(视觉转写) |
| CharXiv Reasoning(with tools) | 89.4% | Gemini 3.6 Flash(视觉转写) |
| CharXiv Reasoning(with tools) | 88.3% | Claude Sonnet 5(视觉转写) |
| LVBench(long video understanding) | 85.4% | Gemini 3.7 Flash(视觉转写) |
| LVBench(long video understanding) | 84.2% | Gemini 3.6 Flash(视觉转写) |
| LVBench(long video understanding) | 68.5% | Claude Sonnet 5(视觉转写) |
| LVBench(long video understanding) | 78.9% | GPT-5.6 Terra(视觉转写) |
| GDM-MRCR v2 (8-needle)(128k,average) | 97.0% | Gemini 3.7 Flash(视觉转写) |
| GDM-MRCR v2 (8-needle)(128k,average) | 91.8% | Gemini 3.6 Flash(视觉转写) |
| GDM-MRCR v2 (8-needle)(128k,average) | 81.5% | Claude Sonnet 5(视觉转写) |
| GDM-MRCR v2 (8-needle)(128k,average) | 93.5% | GPT-5.6 Terra(视觉转写) |
| OSWorld-2.0(agentic computer use) | 47.9% | Gemini 3.7 Flash(视觉转写) |
| OSWorld-2.0(agentic computer use) | 33.8% | Gemini 3.6 Flash(视觉转写) |
| OSWorld-2.0(agentic computer use) | 50.2% | GPT-5.6 Terra(视觉转写) |
| Agent's Last Exam(multimodal desktop/OS agent tasks,pass rate) | 26.3% | Gemini 3.7 Flash(视觉转写) |
| Agent's Last Exam(multimodal desktop/OS agent tasks,pass rate) | 24.2% | Gemini 3.6 Flash(视觉转写) |
| Agent's Last Exam(multimodal desktop/OS agent tasks,pass rate) | 33.3% | Claude Sonnet 5(视觉转写) |
| Agent's Last Exam(multimodal desktop/OS agent tasks,pass rate) | 28.0% | GPT-5.6 Terra(视觉转写) |
| HLE-Verified(multidisciplinary expert reasoning) | 53.6% | Gemini 3.7 Flash(视觉转写) |
| HLE-Verified(multidisciplinary expert reasoning) | 51.2% | Gemini 3.6 Flash(视觉转写) |
| HLE-Verified(multidisciplinary expert reasoning) | 31.0% | Claude Sonnet 5(视觉转写) |
| HLE-Verified(multidisciplinary expert reasoning) | 51.1% | GPT-5.6 Terra(视觉转写) |
| BioMysteryBench(bioinformatics reasoning,human solvable) | 87.1% | Gemini 3.7 Flash(视觉转写) |
| BioMysteryBench(bioinformatics reasoning,human solvable) | 80.6% | Gemini 3.6 Flash(视觉转写) |
| BioMysteryBench(bioinformatics reasoning,human solvable) | 87.5% | Claude Sonnet 5(视觉转写) |
| BioMysteryBench(bioinformatics reasoning,human solvable) | 83.8% | GPT-5.6 Terra(视觉转写) |
| BioMysteryBench(bioinformatics reasoning,human difficult) | 43.5% | Gemini 3.7 Flash(视觉转写) |
| BioMysteryBench(bioinformatics reasoning,human difficult) | 41.2% | Gemini 3.6 Flash(视觉转写) |
| BioMysteryBench(bioinformatics reasoning,human difficult) | 34.1% | Claude Sonnet 5(视觉转写) |
| BioMysteryBench(bioinformatics reasoning,human difficult) | 49.4% | GPT-5.6 Terra(视觉转写) |
| LABBench2(biology real-world research tasks) | 82.1% | Gemini 3.7 Flash(视觉转写) |
| LABBench2(biology real-world research tasks) | 76.1% | Gemini 3.6 Flash(视觉转写) |
| LABBench2(biology real-world research tasks) | 80.1% | Claude Sonnet 5(视觉转写) |
| LABBench2(biology real-world research tasks) | 81.2% | GPT-5.6 Terra(视觉转写) |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 200x112 | alt='Spark icon next to the text "Gemini 3.7 Flash", all on a light blue backgorund' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash.width-...
- images/02.webp — 2096x1182 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash.width-...
- images/03.webp — 1200x675 | alt='an image of a performance to cost comparison chart' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__evals...
- images/04.webp — 1920x1080 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__evals...
- images/05.webp — 100x56 | alt='Quote from Box' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__testi...
- images/06.webp — 100x56 | alt='Quote from Browser Use' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__testi...
- images/07.webp — 100x56 | alt='Quote from Cartwheel' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__testi...
- images/08.webp — 100x56 | alt='quote from databricks' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__testi...
- images/09.webp — 100x56 | alt='Quote from emergent' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__testi...
- images/10.webp — 100x56 | alt='Quote from Harvey' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__testi...
- images/11.webp — 100x56 | alt='Quote from Hebbia' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__testi...
- images/12.webp — 100x56 | alt='Quote from LangChain' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__testi...
- images/13.webp — 100x56 | alt='Quote from Nunu.ai' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__testi...
- images/14.webp — 100x56 | alt='Quote from Open Code' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__testi...
- images/15.webp — 100x56 | alt='Quote from Pydantic' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__testi...
- images/16.webp — 100x56 | alt='Quote from Stanford Department of Biology' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__testi...
- images/17.webp — 1200x1205 | alt='a chart displaying AI model benchmarks' | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__evals...
- images/18.webp — 2000x2008 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash__evals...
- images/19.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Omni_1-1_Flash_hero.2e1...
- images/20.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Omni_1-1_Flash_hero.2e1...
- images/21.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini_3-5_transcribe.2...
- images/22.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini_3-5_transcribe.2...
- images/23.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/thumbnail_BfIj9lP.2e16d...
- images/24.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/thumbnail_BfIj9lP.2e16d...
- images/25.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Omni_experts_social.2e1...
- images/26.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Omni_experts_social.2e1...
- images/27.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Omni_hero.2e16d0ba.fill...
- images/28.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Omni_hero.2e16d0ba.fill...
- images/29.webp — 300x300 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/July_AI_Recap_still.2e1...
- images/30.webp — 600x600 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/July_AI_Recap_still.2e1...
- images/31.png — 1300x733 | 原URL: https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-3-7-flash.width-...
