---
vendor: xai
model: Grok 4.5
release: grok-4-5
date: 2026-07-16
source: https://x.ai/news/grok-4-5
fetched_at: 2026-09-01
---

# Introducing Grok 4.5

## 评测数据（转录）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| DeepSWE 1.0（DeepSWE score, pass@1） | 62.0%（Grok 4.5） | 同图对照 Fable (max) 66.1%、GPT 5.5 (xhigh) 64.31%、Opus 4.8 (max) 55.75%、Opus 4.7 (max) 40.12%；Eval 由 Datacurve 出题、AA 用各模型厂商 harness 运行 |
| DeepSWE 1.1（mini-swe-agent harness，Datacurve 运行） | 53%（Grok 4.5） | 同图对照 Fable (max) 70%、GPT 5.5 (xhigh) 67%、Opus 4.8 (max) 59%、GLM 5.2 44% |
| SWE Marathon（resolution rate, pass@1） | 29.0%（Grok 4.5） | 同图对照 Opus 4.8 (max) 26.0%、Fable (max) 24.0%、Opus 4.7 (max) 16.0% |
| Terminal Bench 2.1 | 83.3%（Grok 4.5） | 同图对照 Fable (max) 84.3%、GPT 5.5 (xhigh) 83.4%、Opus 4.8 (max) 78.9%、Opus 4.7 (max) 78.9% |
| SWE Bench Pro（resolve rate） | 64.7%（Grok 4.5） | 同图对照 Fable (max) 80.4%、Opus 4.8 (max) 69.2%、Opus 4.7 (max) 64.3%、GLM 5.2 62.1%、GPT 5.5 (xhigh) 58.6% |
| SWE Bench Pro token efficiency（平均输出 tokens/任务） | 15,954（Grok 4.5） | 正文：约 4.2× 少于 Opus 4.8 (max) 的 67,020 |
| 页面脚注（适用上列各图） | — | Competitor figures are drawn from the respective developers' published system cards or benchmark leaderboards |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 playwright-rendered。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.png — 1024x1024 | alt=公司徽标 | 原URL: https://cdn.cookielaw.org/logos/9dab7956-8e3b-4787-bcc5-96b37152bafe/019d4c9b-0b11-79c0...
