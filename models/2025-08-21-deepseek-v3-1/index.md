---
vendor: deepseek
model: DeepSeek-V3.1
release: deepseek-v3-1
date: 2025-08-21
source: https://api-docs.deepseek.com/zh-cn/news/news250821
fetched_at: 2026-09-01
---

# DeepSeek-V3.1 发布

## 评测数据（转录）


### 编码与终端（视觉转写，来源 images/02.webp v3.1_benchmark_1）

| Benchmark | DeepSeek-V3.1 | DeepSeek-V3-0324 | DeepSeek-R1-0528 |
|---|---|---|---|
| SWE-bench Verified | 66.0 | 45.4 | 44.6 |
| SWE-bench Multilingual | 54.5 | 29.3 | 30.5 |
| Terminal-Bench | 31.3 | 13.3 | 5.7 |

### 搜索与问答（视觉转写，来源 images/03.webp v3.1_benchmark_2）

| Benchmark | DeepSeek-V3.1 | DeepSeek-R1-0528 |
|---|---|---|
| Browsecomp | 30.0 | 8.9 |
| Browsecomp_zh | 49.2 | 35.7 |
| HLE | 29.8 | 24.8 |
| xbench-DeepSearch | 71.2 | 55.0 |
| Frames | 83.7 | 82.0 |
| SimpleQA | 93.4 | 92.3 |
| Seal0 | 42.6 | 29.7 |

### 思考效率：输出 token（视觉转写，来源 images/04.webp v3.1_benchmark_3）

| 评测 | R1-0528 输出 token（准确率） | V3.1-Think 输出 token（准确率） |
|---|---|---|
| AIME 2025 | 22,615（87.5%） | 15,889（88.4%） |
| GPQA Diamond | 7,678（81.0%） | 4,122（80.1%） |
| LiveCodeBench | 19,352（73.3%） | 13,977（74.8%） |

## 协议脚注

- 来源：https://api-docs.deepseek.com/zh-cn/news/news250821（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 225x225 | https://cdn.deepseek.com/platform/favicon.png | DeepSeek API ææ¡£ Logo |
| images/02.webp | 1080x495 | https://cdn.deepseek.com/api-docs/v3.1_benchmark_1.webp |  |
| images/03.webp | 1080x1027 | https://cdn.deepseek.com/api-docs/v3.1_benchmark_2.webp |  |
| images/04.webp | 1080x539 | https://cdn.deepseek.com/api-docs/v3.1_benchmark_3.webp |  |
| images/05.webp | 1080x595 | https://cdn.deepseek.com/api-docs/v3.1_price_cn.webp |  |
| images/06.jpg | 800x800 | https://cdn.deepseek.com/official_account.jpg | WeChat QRcode |
| images/07.jpg | 3836x2038 | https://api-docs.deepseek.com/zh-cn/img/deepseek-social-card.jpeg | [og/twitter] |
