---
vendor: anthropic
model: Claude Opus 4 / Claude Sonnet 4
release: claude-4
date: 2025-05-22
source: https://www.anthropic.com/news/claude-4
fetched_at: 2026-09-01
---

# Introducing Claude 4

## 评测数据（转录）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| SWE-bench Verified | 72.5% | Claude Opus 4（pass@1，bash/editor 工具，10 次试验平均，无测试期计算） |
| SWE-bench Verified | 72.7% | Claude Sonnet 4（同上口径） |
| SWE-bench Verified（并行测试时计算） | 79.4% | Claude Opus 4 |
| SWE-bench Verified（并行测试时计算） | 80.2% | Claude Sonnet 4 |
| Terminal-bench | 43.2% | Claude Opus 4（Claude Code 作为 agent 框架） |
| Terminal-bench | 35.5% | Claude Sonnet 4（Claude Code 作为 agent 框架） |
| Terminal-bench（与非 Claude 模型相同 agent） | 39.2% | Claude Opus 4（页面脚注） |
| Terminal-bench（与非 Claude 模型相同 agent） | 33.5% | Claude Sonnet 4（页面脚注） |
| GPQA Diamond（无扩展思考） | 74.9% | Claude Opus 4 |
| GPQA Diamond（无扩展思考） | 70.0% | Claude Sonnet 4 |
| MMMLU（无扩展思考） | 87.4% | Claude Opus 4（14 种非英语语言平均） |
| MMMLU（无扩展思考） | 85.4% | Claude Sonnet 4（14 种非英语语言平均） |
| MMMU（无扩展思考） | 73.7% | Claude Opus 4 |
| MMMU（无扩展思考） | 72.6% | Claude Sonnet 4 |
| AIME（无扩展思考） | 33.9% | Claude Opus 4（nucleus sampling，top_p=0.95） |
| AIME（无扩展思考） | 33.1% | Claude Sonnet 4（nucleus sampling，top_p=0.95） |
| SWE-bench verified（图表） | 62.3% | Claude Sonnet 3.7（视觉转写） |
| SWE-bench verified（图表） | 70.3% | Claude Sonnet 3.7，with parallel test-time compute（视觉转写） |
| SWE-bench verified（图表） | 72.1% | OpenAI Codex-1（视觉转写） |
| SWE-bench verified（图表） | 69.1% | OpenAI o3（视觉转写） |
| SWE-bench verified（图表） | 54.6% | OpenAI GPT-4.1（视觉转写） |
| SWE-bench verified（图表） | 63.2% | Gemini 2.5 Pro Preview (05-06)（视觉转写） |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 2880x1620 | alt='Illustration of Claude juggling several tasks in parallel' | 原URL: https://www.anthropic.com/_next/image
- images/02.webp — 3840x2304 | alt='Bar chart comparison between Claude and other LLMs on software engineering tasks' | 原URL: https://www.anthropic.com/_next/image
- images/03.gif — 1920x1080 | alt="A visual note in Claude's memories that depicts a navigation guide for the game Pokemon Red." | 原URL: https://www.anthropic.com/_next/image
- images/04.jpg — 2880x1620 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/9890d1bb39c15c41772af22d2282eb612...
- images/05.png — 3840x2304 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/09a6d5aa47c25cb2037efff9f486da491...
- images/06.gif — 1920x1080 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/e51564bb5ce9597dbfc59bbab13a0efbe...
