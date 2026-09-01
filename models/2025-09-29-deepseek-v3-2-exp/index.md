---
vendor: deepseek
model: DeepSeek-V3.2-Exp
release: deepseek-v3-2-exp
date: 2025-09-29
source: https://api-docs.deepseek.com/zh-cn/news/news250929
fetched_at: 2026-09-01
---

# DeepSeek-V3.2-Exp 发布，训练推理提效，API 同步降价

## 评测数据（转录）


### 主基准对照（视觉转写，来源 images/03.webp v3_2_benchmark）

| 分组 | Benchmark | DeepSeek-V3.1-Terminus | DeepSeek-V3.2-Exp |
|---|---|---|---|
| General | MMLU-Pro | 85.0 | 85.0 |
| General | GPQA-Diamond | 80.7 | 79.9 |
| General | Humanity's Last Exam | 21.7 | 19.8 |
| Search Agent | BrowseComp | 38.5 | 40.1 |
| Search Agent | BrowseComp-zh | 45.0 | 47.9 |
| Search Agent | SimpleQA | 96.8 | 97.1 |
| Code | LiveCodeBench | 74.9 | 74.1 |
| Code | Codeforces-Div1 | 2046 | 2121 |
| Code | Aider-Polyglot | 76.1 | 74.5 |
| Code Agent | SWE Verified | 68.4 | 67.8 |
| Code Agent | SWE-bench Multilingual | 57.8 | 57.9 |
| Code Agent | Terminal-bench | 36.7 | 37.7 |
| Math | AIME 2025 | 88.4 | 89.3 |
| Math | HMMT 2025 | 86.1 | 83.6 |

## 协议脚注

- 来源：https://api-docs.deepseek.com/zh-cn/news/news250929（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 225x225 | https://cdn.deepseek.com/platform/favicon.png | DeepSeek API ææ¡£ Logo |
| images/02.webp | 1080x481 | https://api-docs.deepseek.com/zh-cn/img/v3_2_cost_compare.webp |  |
| images/03.webp | 1080x1140 | https://api-docs.deepseek.com/zh-cn/img/v3_2_benchmark.webp |  |
| images/04.webp | 1080x595 | https://api-docs.deepseek.com/zh-cn/img/v3_2_price_zh.webp |  |
| images/05.jpg | 800x800 | https://cdn.deepseek.com/official_account.jpg | WeChat QRcode |
| images/06.jpg | 3836x2038 | https://api-docs.deepseek.com/zh-cn/img/deepseek-social-card.jpeg | [og/twitter] |
