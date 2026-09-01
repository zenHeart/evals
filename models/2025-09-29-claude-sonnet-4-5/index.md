---
vendor: anthropic
model: Claude Sonnet 4.5
release: claude-sonnet-4-5
date: 2025-09-29
source: https://www.anthropic.com/news/claude-sonnet-4-5
fetched_at: 2026-09-01
---

# Introducing Claude Sonnet 4.5

## 评测数据（转录）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| SWE-bench Verified | 77.2% | Claude Sonnet 4.5（10 次试验平均，无测试期计算，200K 思考预算，全 500 题） |
| SWE-bench Verified（1M 上下文配置） | 78.2% | Claude Sonnet 4.5（页面说明不作为主报告分数） |
| OSWorld | 61.4% | Claude Sonnet 4.5 |
| OSWorld | 42.2% | Claude Sonnet 4（四个月前的领先分数） |
| SWE-bench Verified（with parallel test-time compute） | 82.0% | Claude Sonnet 4.5（视觉转写） |
| SWE-bench Verified | 74.5% | Claude Opus 4.1（视觉转写） |
| SWE-bench Verified（with parallel test-time compute） | 79.4% | Claude Opus 4.1（视觉转写） |
| SWE-bench Verified | 72.7% | Claude Sonnet 4（视觉转写） |
| SWE-bench Verified（with parallel test-time compute） | 80.2% | Claude Sonnet 4（视觉转写） |
| SWE-bench Verified | 72.8% | GPT-5（视觉转写） |
| SWE-bench Verified | 74.5% | GPT-5-Codex（视觉转写） |
| SWE-bench Verified | 67.2% | Gemini 2.5 Pro（视觉转写） |
| Terminal-Bench | 50.0% | Claude Sonnet 4.5（视觉转写） |
| Terminal-Bench | 46.5% | Claude Opus 4.1（视觉转写） |
| Terminal-Bench | 36.4% | Claude Sonnet 4（视觉转写） |
| Terminal-Bench | 43.8% | GPT-5（视觉转写） |
| Terminal-Bench | 25.3% | Gemini 2.5 Pro（视觉转写） |
| τ2-bench（Retail） | 86.2% | Claude Sonnet 4.5（视觉转写） |
| τ2-bench（Retail） | 86.8% | Claude Opus 4.1（视觉转写） |
| τ2-bench（Retail） | 83.8% | Claude Sonnet 4（视觉转写） |
| τ2-bench（Retail） | 81.1% | GPT-5（视觉转写） |
| τ2-bench（Airline） | 70.0% | Claude Sonnet 4.5（视觉转写） |
| τ2-bench（Airline） | 63.0% | Claude Opus 4.1（视觉转写） |
| τ2-bench（Airline） | 63.0% | Claude Sonnet 4（视觉转写） |
| τ2-bench（Airline） | 62.6% | GPT-5（视觉转写） |
| τ2-bench（Telecom） | 98.0% | Claude Sonnet 4.5（视觉转写） |
| τ2-bench（Telecom） | 71.5% | Claude Opus 4.1（视觉转写） |
| τ2-bench（Telecom） | 49.6% | Claude Sonnet 4（视觉转写） |
| τ2-bench（Telecom） | 96.7% | GPT-5（视觉转写） |
| OSWorld（图表） | 44.4% | Claude Opus 4.1（视觉转写） |
| AIME 2025（python） | 100% | Claude Sonnet 4.5（视觉转写） |
| AIME 2025（no tools） | 87.0% | Claude Sonnet 4.5（视觉转写） |
| AIME 2025 | 78.0% | Claude Opus 4.1（视觉转写） |
| AIME 2025 | 70.5% | Claude Sonnet 4（视觉转写） |
| AIME 2025（python） | 99.6% | GPT-5（视觉转写） |
| AIME 2025（no tools） | 94.6% | GPT-5（视觉转写） |
| AIME 2025 | 88.0% | Gemini 2.5 Pro（视觉转写） |
| GPQA Diamond | 83.4% | Claude Sonnet 4.5（视觉转写） |
| GPQA Diamond | 81.0% | Claude Opus 4.1（视觉转写） |
| GPQA Diamond | 76.1% | Claude Sonnet 4（视觉转写） |
| GPQA Diamond | 85.7% | GPT-5（视觉转写） |
| GPQA Diamond | 86.4% | Gemini 2.5 Pro（视觉转写） |
| MMMLU | 89.1% | Claude Sonnet 4.5（视觉转写） |
| MMMLU | 89.5% | Claude Opus 4.1（视觉转写） |
| MMMLU | 86.5% | Claude Sonnet 4（视觉转写） |
| MMMLU | 89.4% | GPT-5（视觉转写） |
| MMMU (validation) | 77.8% | Claude Sonnet 4.5（视觉转写） |
| MMMU (validation) | 77.1% | Claude Opus 4.1（视觉转写） |
| MMMU (validation) | 74.4% | Claude Sonnet 4（视觉转写） |
| MMMU (validation) | 84.2% | GPT-5（视觉转写） |
| MMMU (validation) | 82.0% | Gemini 2.5 Pro（视觉转写） |
| Finance Agent | 55.3% | Claude Sonnet 4.5（视觉转写） |
| Finance Agent | 50.9% | Claude Opus 4.1（视觉转写） |
| Finance Agent | 44.5% | Claude Sonnet 4（视觉转写） |
| Finance Agent | 46.9% | GPT-5（视觉转写） |
| Finance Agent | 29.4% | Gemini 2.5 Pro（视觉转写） |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.png — 3840x2160 | alt='Chart showing frontier model performance on SWE-bench Verified with Claude Sonnet 4.5 leading' | 原URL: https://www.anthropic.com/_next/image
- images/02.webp — 2600x2288 | alt='Benchmark table comparing frontier models across popular public evals' | 原URL: https://www.anthropic.com/_next/image
- images/03.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/04.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/05.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/06.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/07.png — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/08.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/6421e7049ff8b2c4591497ec92dc4157b...
- images/09.png — 2600x2288 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/67081be1ea2752e2a554e49a6aab2731b...
- images/10.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/7175bc18c46562f1228280a7abda75121...
- images/11.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/fd313a5edb996d98b9fc73ee5b3e6a34f...
- images/12.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/442f96fd96de39e3ff3a05b288e2647dd...
- images/13.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/711e6e1178f0ed7ca9aa85a5e0e9940a8...
- images/14.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/33efc283321feeff94dd80973dbcd3840...
