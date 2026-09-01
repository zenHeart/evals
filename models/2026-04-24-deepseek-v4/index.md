---
vendor: deepseek
model: DeepSeek-V4-Pro
release: deepseek-v4
date: 2026-04-24
source: https://api-docs.deepseek.com/zh-cn/news/news260424
fetched_at: 2026-09-01
---

# DeepSeek-V4 预览版：迈入百万上下文普惠时代

## 评测数据（转录）


### 全量基准对照表（视觉转写，来源 images/04.png v4-benchmark-2；表头为 模型 + 推理档位）

| 分组 | Benchmark (metric) | DS-V4-Pro Max | DS-V4-Flash Max | K2.6 Thinking | GLM-5.1 Thinking | Opus-4.6 Max | GPT-5.4 xHigh | Gemini-3.1-Pro High |
|---|---|---|---|---|---|---|---|---|
| Knowledge & Reasoning | MMLU-Pro (EM) | 87.5 | 86.2 | 87.1 | 86.0 | 89.1 | 87.5 | 91.0 |
| Knowledge & Reasoning | SimpleQA-Verified (Pass@1) | 57.9 | 34.1 | 36.9 | 38.1 | 46.2 | 45.3 | 75.6 |
| Knowledge & Reasoning | Chinese-SimpleQA (Pass@1) | 84.4 | 78.9 | 75.9 | 75.0 | 76.2 | 76.8 | 85.9 |
| Knowledge & Reasoning | GPQA Diamond (Pass@1) | 90.1 | 88.1 | 90.5 | 86.2 | 91.3 | 93.0 | 94.3 |
| Knowledge & Reasoning | HLE (Pass@1) | 37.7 | 34.8 | 36.4 | 34.7 | 40.0 | 39.8 | 44.4 |
| Knowledge & Reasoning | LiveCodeBench (Pass@1) | 93.5 | 91.6 | 89.6 | - | 88.8 | - | 91.7 |
| Knowledge & Reasoning | Codeforces (Rating) | 3206 | 3052 | - | - | - | 3168 | 3052 |
| Knowledge & Reasoning | HMMT 2026 Feb (Pass@1) | 95.2 | 94.8 | 92.7 | 89.4 | 96.2 | 97.7 | 94.7 |
| Knowledge & Reasoning | IMOAnswerBench (Pass@1) | 89.8 | 88.4 | 86.0 | 83.8 | 75.3 | 91.4 | 81.0 |
| Knowledge & Reasoning | Apex (Pass@1) | 38.3 | 33.0 | 24.0 | 11.5 | 34.5 | 54.1 | 60.9 |
| Knowledge & Reasoning | Apex Shortlist (Pass@1) | 90.2 | 85.7 | 75.5 | 72.4 | 85.9 | 78.1 | 89.1 |
| Long Context | MRCR 1M (MMR) | 83.5 | 78.7 | - | - | 92.9 | - | 76.3 |
| Long Context | CorpusQA 1M (ACC) | 62.0 | 60.5 | - | - | 71.7 | - | 53.8 |
| Agentic | Terminal Bench 2.0 (Acc) | 67.9 | 56.9 | 66.7 | 63.5 | 65.4 | 75.1 | 68.5 |
| Agentic | SWE Verified (Resolved) | 80.6 | 79.0 | 80.2 | - | 80.8 | - | 80.6 |
| Agentic | SWE Pro (Resolved) | 55.4 | 52.6 | 58.6 | 58.4 | 57.3 | 57.7 | 54.2 |
| Agentic | SWE Multilingual (Resolved) | 76.2 | 73.3 | 76.7 | 73.3 | 77.5 | - | - |
| Agentic | BrowseComp (Pass@1) | 83.4 | 73.2 | 83.2 | 79.3 | 83.7 | 82.7 | 85.9 |
| Agentic | HLE w/tools (Pass@1) | 48.2 | 45.1 | 54.0 | 50.4 | 53.1 | 52.0 | 51.6 |
| Agentic | GDPval-AA (Elo) | 1554 | 1395 | 1482 | 1535 | 1619 | 1674 | 1314 |
| Agentic | MCPAtlas Public (Pass@1) | 73.6 | 69.0 | 66.6 | 71.8 | 73.8 | 67.2 | 69.2 |
| Agentic | Toolathlon (Pass@1) | 51.8 | 47.8 | 50.0 | 40.7 | 47.2 | 54.6 | 48.8 |

### 知识/推理 vs Agent 柱状对照（视觉转写，来源 images/03.png v4-benchmark）

| 评测 | DeepSeek-V4-Pro-Max | Claude-Opus-4.6-Max | GPT-5.4-xHigh | Gemini-3.1-Pro-High |
|---|---|---|---|---|
| SimpleQA Verified (Pass@1) | 57.9 | 46.2 | 45.3 | 75.6 |
| HLE (Pass@1) | 37.7 | 40.0 | 39.8 | 44.4 |
| Apex Shortlist (Pass@1) | 90.2 | 85.9 | 78.1 | 89.1 |
| Codeforces (Rating) | 3206 | 3168 | 3168 | 3052 |
| SWE Verified (Resolved) | 80.6 | 80.8 | 80.8 | 80.6 |
| Terminal Bench 2.0 (Acc) | 67.9 | 65.4 | 75.1 | 68.5 |
| Toolathlon (Pass@1) | 51.8 | 47.2 | 54.6 | 48.8 |

## 协议脚注

- 来源：https://api-docs.deepseek.com/zh-cn/news/news260424（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 225x225 | https://cdn.deepseek.com/platform/favicon.png | DeepSeek API ææ¡£ Logo |
| images/02.png | 1080x209 | https://api-docs.deepseek.com/zh-cn/img/v4-spec.png |  |
| images/03.png | 1080x742 | https://api-docs.deepseek.com/zh-cn/img/v4-benchmark.png |  |
| images/04.png | 1080x798 | https://api-docs.deepseek.com/zh-cn/img/v4-benchmark-2.png |  |
| images/05.png | 1080x406 | https://api-docs.deepseek.com/zh-cn/img/v4-efficiency.png |  |
| images/06.png | 1080x2438 | https://api-docs.deepseek.com/zh-cn/img/v4-ppt.png |  |
| images/07.png | 1080x297 | https://api-docs.deepseek.com/zh-cn/img/v4-price.png |  |
| images/08.jpg | 1080x636 | https://api-docs.deepseek.com/zh-cn/img/v4-hire.jpeg |  |
| images/09.jpg | 800x800 | https://cdn.deepseek.com/official_account.jpg | WeChat QRcode |
| images/10.jpg | 3836x2038 | https://api-docs.deepseek.com/zh-cn/img/deepseek-social-card.jpeg | [og/twitter] |
