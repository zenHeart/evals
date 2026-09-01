---
vendor: xai
model: Grok 4.1
release: grok-4-1
date: 2025-11-17
source: https://x.ai/news/grok-4-1
fetched_at: 2026-09-01
---

# Grok 4.1

## 评测数据（转录）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| LMArena Text Leaderboard（Overall Style Control Elo 坐标轴 1325–1525） | 1483（Grok 4.1 Thinking，代号 quasarflux，#1）、1465（Grok 4.1 非推理模式，代号 tensor，#2） | 正文：领先最高非 xAI 模型 31 分；Grok 4（grok-4-0709）1409、grok-4-fast 1420，正文称 Grok 4 综合排名 #33；同榜对照 gemini-2.5-pro 1452、claude-sonnet-4-5-20250929-thinking-32k 1450、claude-opus-4-1-20250805-thinking-16k 1449、claude-sonnet-4-5-20250929 1445、gpt-4-5-preview-2025-02-27 1442、claude-opus-4-1-20250805 1440、chatgpt-4o-latest-20250326 1438、gpt-5-high 1437、o3-2025-04-16 1434、qwen3-max-preview 1434、kimi-k2-thinking 1432、glm-4.6 1428 |
| 生产流量盲测偏好（WIN RATE） | 64.78% | 正文：两周渐进静默发布期间对线上流量持续盲测，相比上一生产模型 64.78% 被偏好 |
| EQ-Bench3（Elo, normalized） | 1586（Grok 4.1 Thinking）、1585（Grok 4.1） | 同图对照 Kimi K2 Instruct 1561、Horizon Alpha 1559、Gemini 2.5 Pro 1460、GPT-5 Chat 1364、Claude Opus 4 1304、Grok 4 1206；官方仓库默认采样、judge 为 Claude Sonnet 3.7、无 system prompt |
| Creative Writing v3（Elo, normalized） | 1721.9（Grok 4.1 Thinking）、1708.6（Grok 4.1） | 32 个写作提示 × 3 轮；同图对照 Polaris Alpha (early GPT 5.1) 1756.2、o3 1696.4、Claude Sonnet 4.5 1648.7、Kimi K2 Instruct 1627.5、Grok 3 1126 |
| Hallucination Rate（越低越好） | 4.22%（Grok 4.1 (Non-Reasoning)） | 同图 Grok 4 Fast (Non-Reasoning) 12.09%（图例顺序对应柱序）；生产 info-seeking 抽样、非推理模型带 web search 工具 |
| FActScore（越低越好） | 2.97%（Grok 4.1 (Non-Reasoning)） | 同图 Grok 4 Fast (Non-Reasoning) 9.89%（图例顺序对应柱序）；500 个人物传记问题、非推理模型带 web search 工具 |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 playwright-rendered。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.png — 16x16 | alt=iOS Play Store Icon | 原URL: https://media.x.ai/cdn-cgi/image/fit=scale-down,onerror=redirect,width=42,height=42,f=a...
- images/02.png — 16x18 | alt=Android Play Store Icon | 原URL: https://media.x.ai/cdn-cgi/image/fit=scale-down,onerror=redirect,width=42,height=42,f=a...
- images/03.jpg — 751x563 | alt=Golden Gate Bridge | 原URL: https://media.x.ai/cdn-cgi/image/fit=scale-down,onerror=redirect,width=1668,height=938,...
- images/04.jpg — 751x503 | alt=Golden Gate Bridge | 原URL: https://media.x.ai/cdn-cgi/image/fit=scale-down,onerror=redirect,width=1668,height=938,...
- images/05.jpg — 751x422 | alt=Alcatraz Island | 原URL: https://media.x.ai/cdn-cgi/image/fit=scale-down,onerror=redirect,width=1668,height=938,...
- images/06.jpg — 751x500 | alt=Fisherman’s Wharf & Pier 39 | 原URL: https://media.x.ai/cdn-cgi/image/fit=scale-down,onerror=redirect,width=1668,height=938,...
- images/07.jpg — 751x422 | alt=Golden Gate Park | 原URL: https://media.x.ai/cdn-cgi/image/fit=scale-down,onerror=redirect,width=1668,height=938,...
- images/08.jpg — 尺寸未知 | alt=Lombard Street | 原URL: https://media.x.ai/cdn-cgi/image/fit=scale-down,onerror=redirect,width=1200,height=675,...
- images/09.jpg — 尺寸未知 | alt=Painted Ladies | 原URL: https://media.x.ai/cdn-cgi/image/fit=scale-down,onerror=redirect,width=1200,height=675,...
- images/10.jpg — 尺寸未知 | alt=Chinatown | 原URL: https://media.x.ai/cdn-cgi/image/fit=scale-down,onerror=redirect,width=1200,height=675,...
- images/11.jpg — 尺寸未知 | alt=Cable Cars | 原URL: https://media.x.ai/cdn-cgi/image/fit=scale-down,onerror=redirect,width=1200,height=675,...
- images/12.png — 1024x1024 | alt=公司徽标 | 原URL: https://cdn.cookielaw.org/logos/9dab7956-8e3b-4787-bcc5-96b37152bafe/019d4c9b-0b11-79c0...
