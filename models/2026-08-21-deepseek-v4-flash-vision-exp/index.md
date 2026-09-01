---
vendor: deepseek
model: DeepSeek-V4-Flash-Vision-Exp
release: deepseek-v4-flash-vision-exp
date: 2026-08-21
source: https://api-docs.deepseek.com/zh-cn/news/news260821
fetched_at: 2026-09-01
---

# V4-Flash-Vision-Exp 上线，开启多模态 API 服务

## 评测数据（转录）


### Agent 基准对照（视觉转写，来源 images/02.png v4_260821_benchmark_cn）

| 分组 | Benchmark | DeepSeek V4-Flash-Vision-Exp | DeepSeek V4-Flash-0731 | Opus-4.8 |
|---|---|---|---|---|
| 文本 Agent 能力评测* | Terminal Bench 2.1 | 83.9 | 82.7 | 85.0 |
| 文本 Agent 能力评测* | NL2Repo | 57.7 | 54.2 | 69.7 |
| 文本 Agent 能力评测* | CyberGym | 75.3 | 76.7 | 78.3 |
| 文本 Agent 能力评测* | DeepSWE | 59.3 | 54.4 | 58.0 |
| 文本 Agent 能力评测* | Toolathlon-Verified | 75.9 | 70.3 | 76.2 |
| 文本 Agent 能力评测* | DSBench-Hard | 63.6 | 59.6 | 71.7 |
| 文本 Agent 能力评测* | AutomationBench (Public) | 25.7 | 25.1 | 27.2 |
| 多模态 Agent 能力评测 | ApexBench (Pass@1) | 36.5 | 26.2** | 39.4 |
| 多模态 Agent 能力评测 | Agents' Last Exam | 27.3 | 25.2** | 25.7 |
| 多模态 Agent 能力评测 | Chartography | 64.3 | - | 65.0 |
| 多模态 Agent 能力评测 | ZeroBench (Pass@5) | 35.0 | - | 34.0 |

## 协议脚注

- 来源：https://api-docs.deepseek.com/zh-cn/news/news260821（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 225x225 | https://cdn.deepseek.com/platform/favicon.png | DeepSeek API ææ¡£ Logo |
| images/02.png | 2495x1680 | https://api-docs.deepseek.com/zh-cn/img/v4_260821_benchmark_cn.png |  |
| images/03.png | 960x6480 | https://api-docs.deepseek.com/zh-cn/img/v4_260821_case1.png |  |
| images/04.gif | 480x266 | https://api-docs.deepseek.com/zh-cn/img/v4_260821_case2.gif |  |
| images/05.gif | 320x162 | https://api-docs.deepseek.com/zh-cn/img/v4_260821_case3.gif |  |
| images/06.jpg | 1080x636 | https://api-docs.deepseek.com/zh-cn/img/v4-hire.jpeg |  |
| images/07.jpg | 800x800 | https://cdn.deepseek.com/official_account.jpg | WeChat QRcode |
| images/08.jpg | 3836x2038 | https://api-docs.deepseek.com/zh-cn/img/deepseek-social-card.jpeg | [og/twitter] |
