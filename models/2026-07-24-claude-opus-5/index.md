---
vendor: anthropic
model: Claude Opus 5
release: claude-opus-5
date: 2026-07-24
source: https://www.anthropic.com/news/claude-opus-5
fetched_at: 2026-09-01
---

# Introducing Claude Opus 5

## 评测数据（转录）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| 自动化行为审计（overall misaligned behavior，越低越好） | 2.3 | Claude Opus 5（近期模型中最低） |
| 内部有机化学基准（光谱推断分子结构） | +10.2 个百分点 | Claude Opus 5 相对 Opus 4.8（页面文本） |
| 内部蛋白质基准（序列变异功能预测） | +7.7 个百分点 | Claude Opus 5 相对 Opus 4.8（页面文本） |
| Zapier AutomationBench | 100% | Claude Opus 5（客户引述） |
| Lovable 内部 agentic coding 任务 | +22% | Claude Opus 5 相对 Opus 4.7（客户引述） |
| max effort 下与 Fable 5 峰值分差 | 0.5% 以内 | Claude Opus 5（页面文本：coding and knowledge work evaluations） |
| OSS-Fuzz（漏洞识别 / exploit 开发） | — | 页面仅定性描述：Opus 5 识别漏洞接近 Mythos 5，开发 exploit 明显落后 |
| Agentic terminal coding — Frontier-Bench v0.1 | 43.3% | Claude Opus 5（视觉转写） |
| Agentic terminal coding — Frontier-Bench v0.1 | 33.7% | Fable 5（视觉转写） |
| Agentic terminal coding — Frontier-Bench v0.1 | 21.1% | Claude Opus 4.8（视觉转写） |
| Agentic terminal coding — Frontier-Bench v0.1 | 34.4% | GPT-5.6 Sol（视觉转写） |
| Knowledge work — GDPval-AA v2 | 1861 | Claude Opus 5（视觉转写，分值非百分比） |
| Knowledge work — GDPval-AA v2 | 1747 | Fable 5（视觉转写） |
| Knowledge work — GDPval-AA v2 | 1593 | Claude Opus 4.8（视觉转写） |
| Knowledge work — GDPval-AA v2 | 1736 | GPT-5.6 Sol（视觉转写） |
| Novel problem-solving — ARC-AGI-3 | 30.2% | Claude Opus 5（视觉转写） |
| Novel problem-solving — ARC-AGI-3 | 1.5% | Claude Opus 4.8（视觉转写） |
| Novel problem-solving — ARC-AGI-3 | 7.8% | GPT-5.6 Sol（视觉转写） |
| Agentic search — BrowseComp | 90.8% | Claude Opus 5（视觉转写） |
| Agentic search — BrowseComp | 87.4% | Fable 5（视觉转写） |
| Agentic search — BrowseComp | 84.3% | Claude Opus 4.8（视觉转写） |
| Agentic search — BrowseComp | 90.4% | GPT-5.6 Sol（视觉转写） |
| Multidisciplinary reasoning — Humanity's Last Exam（no tools） | 56.3% | Claude Opus 5（视觉转写） |
| Multidisciplinary reasoning — Humanity's Last Exam（no tools） | 56.5% | Fable 5（视觉转写） |
| Multidisciplinary reasoning — Humanity's Last Exam（no tools） | 49.8% | Claude Opus 4.8（视觉转写） |
| Multidisciplinary reasoning — Humanity's Last Exam（with tools） | 64.7% | Claude Opus 5（视觉转写） |
| Multidisciplinary reasoning — Humanity's Last Exam（with tools） | 63.9% | Fable 5（视觉转写） |
| Multidisciplinary reasoning — Humanity's Last Exam（with tools） | 57.9% | Claude Opus 4.8（视觉转写） |
| Computer use — OSWorld 2.0 | 70.6% | Claude Opus 5（视觉转写） |
| Computer use — OSWorld 2.0 | 66.1% | Fable 5（视觉转写） |
| Computer use — OSWorld 2.0 | 55.7% | Claude Opus 4.8（视觉转写） |
| Computer use — OSWorld 2.0 | 62.6% | GPT-5.6 Sol（视觉转写） |
| Agentic coding — DeepSWE v1.1 | 68.8% | Claude Opus 5（视觉转写） |
| Agentic coding — DeepSWE v1.1 | 69.7% | Fable 5（视觉转写） |
| Agentic coding — DeepSWE v1.1 | 59.0% | Claude Opus 4.8（视觉转写） |
| Agentic coding — DeepSWE v1.1 | 72.7% | GPT-5.6 Sol（视觉转写） |
| Agentic coding — FrontierCode v1.1, Main | 53.4% | Claude Opus 5（视觉转写） |
| Agentic coding — FrontierCode v1.1, Main | 53.5% | Fable 5（视觉转写） |
| Agentic coding — FrontierCode v1.1, Main | 46.5% | Claude Opus 4.8（视觉转写） |
| Agentic coding — FrontierCode v1.1, Main | 47.5% | GPT-5.6 Sol（视觉转写） |
| Business workflows — AutomationBench | 26.0% | Claude Opus 5（视觉转写） |
| Business workflows — AutomationBench | 17.4% | Fable 5（视觉转写） |
| Business workflows — AutomationBench | 17.0% | Claude Opus 4.8（视觉转写） |
| Business workflows — AutomationBench | 18.1% | GPT-5.6 Sol（视觉转写） |
| Legal — Legal Agent Benchmark, Held-out | 11.7% | Claude Opus 5（视觉转写） |
| Legal — Legal Agent Benchmark, Held-out | 13.3% | Fable 5（视觉转写） |
| Legal — Legal Agent Benchmark, Held-out | 10.4% | Claude Opus 4.8（视觉转写） |
| Legal — Legal Agent Benchmark, Held-out | 2.5% | GPT-5.6 Sol（视觉转写） |
| Health — HealthBench Professional | 59.8% | Claude Opus 5（视觉转写） |
| Health — HealthBench Professional | 66.0% | Mythos 5（Fable 5 列标注值，视觉转写） |
| Health — HealthBench Professional | 57.4% | Claude Opus 4.8（视觉转写） |
| Health — HealthBench Professional | 60.5% | GPT-5.6 Sol（视觉转写） |
| Biology — BioMysteryBench（hard） | 49.4% | Claude Opus 5（视觉转写） |
| Biology — BioMysteryBench（hard） | 46.5% | Fable 5（视觉转写） |
| Biology — BioMysteryBench（hard） | 42.4% | Claude Opus 4.8（视觉转写） |
| Biology — BioMysteryBench（human solved） | 90.1% | Claude Opus 5（视觉转写） |
| Biology — BioMysteryBench（human solved） | 89.0% | Mythos 5（Fable 5 列标注值，视觉转写） |
| Biology — BioMysteryBench（human solved） | 88.5% | Claude Opus 4.8（视觉转写） |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 2880x1620 | alt='Introducing Claude Opus 5' | 原URL: https://www.anthropic.com/_next/image
- images/02.webp — 2600x2578 | 原URL: https://www.anthropic.com/_next/image
- images/03.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/04.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/05.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/06.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/07.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/08.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/09.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/10.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/11.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/12.png — 256x124 | alt=' logo' | 原URL: https://www.anthropic.com/_next/image
- images/13.webp — 256x74 | alt=' logo' | 原URL: https://www.anthropic.com/_next/image
- images/14.png — 256x55 | alt=' logo' | 原URL: https://www.anthropic.com/_next/image
- images/15.png — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/16.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/17.png — 2880x1620 | 原URL: https://cdn.sanity.io/images/4zrzovbb/website/54b7ab1d2c2521f83ae5d2da5f9d99321c370d24-...
- images/18.png — 2880x1620 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/54b7ab1d2c2521f83ae5d2da5f9d99321...
- images/19.png — 2600x2578 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/a8fb4f77a9fe240e6f27f3bdc47a137f3...
- images/20.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/7530b1086992936d7e9d5796a892d1e8f...
- images/21.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/1af9dbd742e3812be4bf66903740188fb...
- images/22.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/08499ed7c3c2b6416700fa47c70d36dff...
- images/23.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/b5e071ba6a9ce5628b4662f05484d1806...
- images/24.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/8c0870bfca0dfac1d81a20e0ebac7eb3e...
- images/25.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/44fac8bd76238d8c09305ec7fe1511670...
- images/26.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/368a6a6ae23e72deac37566b9d0166d06...
- images/27.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/c7c726c5588b69c944dcc205bd1ba7ebd...
- images/28.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/8ac95d8d4d6e68b6f5fdf04a09206defc...
- images/29.png — 528x256 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/04865ae02e70e9d8ca5a79fb49ae9263d...
- images/30.png — 666x192 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/867075586d7f5ee37ee1c8c7b4bf0dadb...
- images/31.webp — 1280x275 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/921e6c04971bb083186c710c631b21946...
- images/32.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/76d4af96516ffca2aceb4c1d0b0a83e27...
- images/33.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/b22d18a4d2003401f96f866effd9a40b5...
