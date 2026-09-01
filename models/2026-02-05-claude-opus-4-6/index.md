---
vendor: anthropic
model: Claude Opus 4.6
release: claude-opus-4-6
date: 2026-02-05
source: https://www.anthropic.com/news/claude-opus-4-6
fetched_at: 2026-09-01
---

# Claude Opus 4.6

## 评测数据（转录）

来源：归档 benchmark 总表 `images/07.webp`（列：Opus 4.6 | Opus 4.5 | Sonnet 4.5 | Gemini 3 Pro | GPT-5.2 (all models)）。下表为 Opus 4.6 列。

| 评测 | 变体 | 分数 | 状态 |
|---|---|---|---|
| Agentic terminal coding — Terminal-Bench 2.0 | — | 65.4% | verified |
| Agentic coding — SWE-bench Verified | — | 80.8% | verified |
| Agentic computer use — OSWorld | — | 72.7% | verified |
| Agentic tool use — τ2-bench | Retail | 91.9% | verified |
| Agentic tool use — τ2-bench | Telecom | 99.3% | verified |
| Scaled tool use — MCP Atlas | — | 59.5% | verified |
| Agentic search — BrowseComp | — | 84.0% | verified |
| Multidisciplinary reasoning — Humanity's Last Exam | without tools | 40.0% | verified |
| Multidisciplinary reasoning — Humanity's Last Exam | with tools | 53.0%（柱状图同格 53.1，页内 0.1 分差留痕） | verified |
| Agentic financial analysis — Finance Agent | — | 60.7% | verified |
| Office tasks — GDPval-AA | Elo | 1606（分值，非百分比） | verified |
| Novel problem-solving — ARC AGI 2 | — | 68.8% | verified |
| Graduate-level reasoning — GPQA Diamond | — | 91.3% | verified |
| Visual reasoning — MMMU Pro | without tools | 73.9% | verified |
| Visual reasoning — MMMU Pro | with tools | 77.3% | verified |
| Multilingual Q&A — MMMLU | — | 91.1% | verified |
| Long-context retrieval — MCR v2 (8-needle) | Opus 4.6 256k | 93.0%（images/08.webp 柱状图） | verified |
| Long-context reasoning — Graphwalks | Parents 1M | 72.0%（images/09.webp 柱状图） | verified |
| Multilingual coding — SWE-bench Multilingual | — | 77.8%（images/11.webp 柱状图） | verified |
| Long-term coherence — Vending-Bench 2 | — | $8,017.59（images/12.webp 柱状图） | verified |
| Cybersecurity vulnerability reproduction — CyberGym | — | 66.6%（images/13.webp 柱状图） | verified |
| Computational biology — BioPipelineBench | — | 53.1%（images/14.webp 柱状图） | verified |
| Agentic search — DeepSearchQA | — | 无法辨认（页面 alt 标注与实际图片内容矛盾，详见脚注） | pending |
| Long-context retrieval — MCR v2 (8-needle, 1M) | 18.5% | Claude Sonnet 4.5（视觉转写 images/08.webp 对照列；同图 Opus 4.6 256k 93.0 / 1M 76.0） |
| BigLaw Bench | 90.2% | Claude Opus 4.6（页面正文 prose，Harvey 客户引述） |

对照列参考（总表原文值）：Opus 4.5 — 59.8 / 80.9 / 66.3 / 88.9·98.2 / 62.3 / 67.8 / 30.8·43.4 / 55.9 / 1416 / 37.6 / 87.0 / 70.6·73.9 / 90.8；Sonnet 4.5 — 51.0 / 77.2 / 61.4 / 86.2·98.0 / 43.8 / 43.9 / 17.7·33.6 / 54.2 / 1277 / 13.6 / 83.4 / 63.4·68.9 / 89.5；Gemini 3 Pro — 56.2（54.2 self-reported）/ 76.2 / — / 85.3·98.0 / 54.1 / 59.2（Deep Research）/ 37.5·45.8 / 44.1 / 1195 / 45.1（Deep Thinking）/ 91.9 / 81.0·— / 91.8；GPT-5.2 — 64.7（64.0 self-reported，Codex CLI）/ 80.0 / — / 82.0·98.7 / 60.6 / 77.9（Pro）/ 36.6·50.0（Pro）/ 56.6（5.1）/ 1462 / 54.2（Pro）/ 93.2（Pro）/ 79.5·80.4 / 89.6。

**DeepSearchQA 脚注**：官方页把 alt「Bar chart comparing Opus 4.6 to other models on DeepSearchQA」挂在资产 018d6d88…（归档 images/03.webp），但该图实际渲染为 Agentic search / BrowseComp（84.0/67.8/43.9/59.2/77.9）。HTML 与 manifest 的资产集合完全一致（无遗漏下载），因此 DeepSearchQA 的数值在归档中无法辨认，保持 pending。

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 1920x1080 | alt='Video thumbnail' | 原URL: https://www.anthropic.com/_next/image
- images/02.webp — 3840x2160 | **【含评测数据】** alt='Bar charts comparing Claude Opus 4.6 to other models on GDPval-AA' | 原URL: https://www.anthropic.com/_next/image
- images/03.webp — 3840x2160 | **【含评测数据】** alt='Bar chart comparing Opus 4.6 to other models on DeepSearchQA' | 原URL: https://www.anthropic.com/_next/image
- images/04.webp — 3840x2160 | **【含评测数据】** alt='Bar charts comparing Opus 4.6 to other models on Terminal-Bench 2' | 原URL: https://www.anthropic.com/_next/image
- images/05.webp — 3840x2160 | **【含评测数据】** 原URL: https://www.anthropic.com/_next/image
- images/06.webp — 3840x2160 | alt='Video thumbnail' | 原URL: https://www.anthropic.com/_next/image
- images/07.webp — 2600x2968 | **【含评测数据】** alt='Benchmark table comparing Opus 4.6 to other models' | 原URL: https://www.anthropic.com/_next/image
- images/08.webp — 3840x2160 | **【含评测数据】** 原URL: https://www.anthropic.com/_next/image
- images/09.webp — 3840x2160 | **【含评测数据】** 原URL: https://www.anthropic.com/_next/image
- images/10.webp — 3840x2160 | 原URL: https://www.anthropic.com/_next/image
- images/11.webp — 3840x2160 | **【含评测数据】** 原URL: https://www.anthropic.com/_next/image
- images/12.webp — 3840x2160 | **【含评测数据】** 原URL: https://www.anthropic.com/_next/image
- images/13.webp — 3840x2160 | **【含评测数据】** 原URL: https://www.anthropic.com/_next/image
- images/14.webp — 3840x2160 | **【含评测数据】** 原URL: https://www.anthropic.com/_next/image
- images/15.webp — 3840x2160 | alt='Bar charts comparing Opus 4.6 to other Claude models on overall misaligned behavior' | 原URL: https://www.anthropic.com/_next/image
- images/16.png — 2400x1260 | 原URL: https://cdn.sanity.io/images/4zrzovbb/website/01d06528567e4bd22c3ddedc87f609ee5716a009-...
- images/17.png — 1920x1080 | 原URL: https://cdn.sanity.io/images/4zrzovbb/website/5ac72c2c6509b4b6c41ac8f742636fe123b0ba1a-...
- images/18.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/6e29759b50e8b3a8363b38b1f573d854d...
- images/19.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/018d6d882034d50727948b22e3ad3844a...
- images/20.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/b8cfd7ebd6c82febce5f428f519d68a5d...
- images/21.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/b8d511155f209c57e4d6a92ab115ebfc7...
- images/22.png — 3840x2160 | 原URL: https://cdn.sanity.io/images/4zrzovbb/website/810008fad362e0ba3c984c3de094f4527541bb89-...
- images/23.png — 2600x2968 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/f9564dd2f758237bd9dbe775674c4a375...
- images/24.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/ae7ae61aefff3c9b059975957335785f8...
- images/25.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/9a32a76a983d4c8f709683b38ff3af666...
- images/26.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/653e04afc43612d3a0f8427da86b65498...
- images/27.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/542044519014a793cf042a08a730ebd89...
- images/28.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/6c1b33e985bcae9163b77bc25620e85ab...
- images/29.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/8a421f45125743fd9e9078aae992c6e5f...
- images/30.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/f7dff66d47d54dfaabddc82bf9b96658d...
- images/31.png — 3840x2160 | 原URL: https://www-cdn.anthropic.com/images/4zrzovbb/website/569d748607388e6ed42e3ff0ff245d9b0...
