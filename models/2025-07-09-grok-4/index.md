---
vendor: xai
model: Grok 4 / Grok 4 Heavy
release: grok-4
date: 2025-07-09
source: https://x.ai/news/grok-4
fetched_at: 2026-09-01
---

# Grok 4

## 评测数据（转录）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Humanity's Last Exam（State of the art，全量集 2025-04-03，Python + Internet 工具） | 44.4（Grok 4 Heavy w/ Python + Internet）、38.6（Grok 4 w/ Python + Internet） | 同图对照 Gemini Deep Research 26.9、o3 w/ Python + Internet 24.9、Gemini 2.5 Pro 21.6、o3 21；同图另有 Grok 4（无工具）25.4 |
| Humanity's Last Exam（text-only subset） | 50.7（Grok 4 Heavy） | 正文：首个在该子集得分 50.7% 的模型；另称"首个在 HLE 得分 50% 的模型" |
| GPQA（Science） | 88.4（Grok 4 Heavy w/ Python）、87.5（Grok 4） | 同图对照 Gemini 2.5 Pro 86.4、o3 83.3、Claude Opus 4 79.6 |
| LiveCodeBench（Jan - May，Competitive Coding） | 79.4（Grok 4 Heavy w/ Python）、79.3（Grok 4 w/ Python）、79（Grok 4） | 同图对照 Gemini 2.5 Pro 74.2、o3 72 |
| USAMO 2025（Olympiad Math Proofs） | 61.9（Grok 4 Heavy w/ Python） | 正文：Grok 4 Heavy 领跑 USAMO'25 61.9%；同图对照 Gemini Deep Think 49.4、Grok 4 37.5、Gemini 2.5 Pro 34.5、o3 21.7 |
| HMMT 2025（Competitive Math） | 96.7（Grok 4 Heavy w/ Python）、93.9（Grok 4 w/ Python）、90（Grok 4） | 同图对照 Gemini 2.5 Pro 82.5、o3 77.5、Claude Opus 4 58.3 |
| AIME'25（Competition Math） | 100（Grok 4 Heavy w/ Python）、98.8（Grok 4 w/ Python）、91.7（Grok 4） | 同图对照 o3 w/ Python 98.4、o3 88.9、Gemini 2.5 Pro 88、Claude Opus 4 75.5 |
| ARC-AGI-2（Abstraction and Reasoning） | 15.9（Grok 4） | 正文：闭源模型新 SOTA，约为 Opus 8.6% 的近两倍；同图对照 Claude Opus 4 8.6、o3 6.5、Gemini 2.5 Pro 4.9 |
| Vending-Bench（正文陈述，5 次运行平均） | $4694.15 净值、售出 4569 件（Grok 4） | 正文对照 Claude Opus 4 $2077.41、1412 件；人类 $844.05、344 件 |
| HLE 训练进程曲线（Performance over training，text-only subset with Python and Internet tools） | — | 页面为训练进度折线图，未标注单点分数 |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 playwright-rendered。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.jpg — 256x553 | alt=Voice mode in the Grok app explaining what is seen in the camera | 原URL: https://media.x.ai/cdn-cgi/image/fit=scale-down,onerror=redirect,width=512,height=1108,...
- images/02.png — 1024x1024 | alt=公司徽标 | 原URL: https://cdn.cookielaw.org/logos/9dab7956-8e3b-4787-bcc5-96b37152bafe/019d4c9b-0b11-79c0...
