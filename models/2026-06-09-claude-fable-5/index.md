---
vendor: anthropic
model: Claude Fable 5 / Claude Mythos 5
release: claude-fable-5
date: 2026-06-09
source: https://www.anthropic.com/news/claude-fable-5-mythos-5
fetched_at: 2026-09-01
---

# Claude Fable 5 and Claude Mythos 5

## 评测数据（转录）

来源：归档总表 `images/02.webp`（列：Claude Mythos 5 / Fable 5 | Claude Mythos Preview | Claude Opus 4.8 | GPT 5.5 | Gemini 3.1 Pro）。下表「分数」为 Mythos 5 / Fable 5 合并列（页面方法学脚注：两模型分差 1–3 个百分点，表取两者较高值；带 `*` 行因 Fable 5 安全护栏回退到 Opus 4.8 而分差更大）。

| 评测 | 变体 | 分数 | 状态 |
|---|---|---|---|
| Agentic coding — SWE-Bench Pro | — | 80.3% | verified |
| Agentic coding — FrontierCode (Diamond) | xhigh | 29.3% | verified |
| Knowledge work — GDPval-AA | Elo | 1932（分值，非百分比） | verified |
| Knowledge work vision — GDP.pdf | no tools | 29.8% | verified |
| Spatial reasoning — Blueprint-Bench 2 | — | 38.6% | verified |
| Tool use — AutomationBench | — | 17.4% | verified |
| Computer use — OSWorld-Verified | — | 85.0% | verified |
| Legal — Legal Agent Benchmark | — | 13.3% | verified |
| Multidisciplinary reasoning — Humanity's Last Exam | no tools | 59.0%* | verified |
| Multidisciplinary reasoning — Humanity's Last Exam | with tools | 64.5%* | verified |
| Biology — BioMysteryBench | hard | 46.1%* | verified |
| Biology — BioMysteryBench | human solved | 83.9%* | verified |
| Agentic coding — Terminal-Bench 2.1 | — | 88.0%* | verified |
| Cybersecurity — ExploitBench | Cap% | 78.0%* | verified |
| Health — HealthBench Professional | — | 66.0%* | verified |

对照列参考（同表原文值）：Opus 4.8 — SWE-Bench Pro 69.2 / FrontierCode 13.4 / GDPval-AA 1890 / GDP.pdf 22.5 / Blueprint-Bench 2 14.5 / AutomationBench 15.5 / OSWorld 83.4 / Legal 10.4 / HLE 49.8·57.9 / BioMystery 40.0·80.4 / Terminal-Bench 82.7 / ExploitBench 40.0 / HealthBench 56.9；GPT 5.5 — 58.6 / 5.7 / 1769 / 24.9 / 36.2 / 12.9 / 78.7 / 2.1 / 41.4·52.2 / — / 83.4（Codex CLI）/ 34.0 / 51.8；Gemini 3.1 Pro — 54.2 / — / 1314 / 16.7 / 26.5 / 9.6 / 76.2 / 0.0 / 44.4·51.4 / — / 70.7（Gemini CLI）/ — / —；Mythos Preview — 77.8 / — / — / — / — / — / 85.4 / — / 56.8·64.7 / 29.6·82.6 / — / 69.0 / 64.7。

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 2880x1620 | alt='The number five composed of several butterflies' | 原URL: https://www.anthropic.com/_next/image
- images/02.webp — 2600x2870 | **【含评测数据：benchmark 总表】** alt='Benchmark table showing Claude Fable and Mythos compared to other leading models' | 原URL: https://www.anthropic.com/_next/image
- images/03.png — 1920x1080 | 原URL: https://www.anthropic.com/_next/image
- images/04.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/05.webp — 1920x1080 | 原URL: https://www.anthropic.com/_next/image
- images/06.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/07.png — 256x74 | alt=' logo' | 原URL: https://www.anthropic.com/_next/image
- images/08.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/09.webp — 1920x1080 | 原URL: https://www.anthropic.com/_next/image
- images/10.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/11.png — 2880x1620 | 原URL: https://cdn.sanity.io/images/4zrzovbb/website/b7055119423427c40a0e4d84054aed17682b50a2-...
- images/12.png — 2880x1620 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/b7055119423427c40a0e4d84054aed176...
- images/13.png — 2600x2870 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/1e65982497d7d4891219ed0e83141625a...
- images/14.png — 1920x1080 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/d3c3efe0e8ab310856368cee2b2161439...
- images/15.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/036229d8f9be9a5a911dbbd863b3c6cc0...
- images/16.png — 1920x1080 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/6a97019c4d8ea13fdd7200455f6dd9e8c...
- images/17.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/2502a0daf85b741641cff36757d7243ef...
- images/18.png — 888x256 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/41fa2545bafc63f50148ce0d710dbdadb...
- images/19.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/faf941fe1ebfd09139d39b8e4ad904812...
- images/20.png — 1920x1080 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/6bede3f6101d15bd899922917ea6246ad...
- images/21.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/3437ad5c0853a7bd273ed5e56289a4f38...
