---
vendor: stepfun
model: Step 3.7 Flash
release: step-3-7-flash
date: 2026-05-29
source: https://static.stepfun.com/blog/step-3.7-flash/
fetched_at: 2026-09-01
---

# Step 3.7 Flash — A high-efficiency Flash model for Real-World

## 评测数据（转录）

### 表 1（页面 HTML 表格逐行转录）

|  | Step 3.7 Flash | Step 3.5 Flash |
|---|---|---|
| Hermes Agent | 67.50% | 60.00% |
| OpenClaw | 67.00% | 47.00% |
| Claude Code | 71.50% | 73.00% |
| KiloCode | 67.50% | 59.00% |
| OpenCode | 64.50% | 57.00% |
| RooCode | 64.50% | 43.00% |

### 表 2（页面 HTML 表格逐行转录）

|  | Flash Level | Pro Level |  |  |
|---|---|---|---|---|
| Benchmarks | Step 3.7 Flash | Kimi K2.6 | GLM 5V Turbo | GPT 5.5 |
| SimpleVQA | 79.16% | 78.24%* | 78.20% | 79.11%* |
| WorldVQA | 58.10% | 55.98%* | 47.81%* | 54.58%* |
| BC-VL | 58.96% | 57.12%* | 51.90%* | 65.68%* |

### 表 3（页面 HTML 表格逐行转录）

|  | Flash Level | Pro Level |  |  |
|---|---|---|---|---|
| Benchmarks | Step 3.7 Flash | Kimi K2.6 | GLM 5V Turbo | Gemini 3 Flash |
| V* | 95.29% | 96.90% | 89.00% | 96.30% |
| HR-Bench 4K | 89.13% | 91.25%* | 84.62% | 94.50% |
| HR-Bench 8K | 86.34% | 90.13%* | 83.12% | 94.80% |
| VisualProbe | 65.05% | 64.47%* | 53.01% | 69.90% |

### 表 4（页面 HTML 表格逐行转录）

|  | Flash Level | Pro Level |  |  |  |  |  |  |  |
|---|---|---|---|---|---|---|---|---|---|
| Benchmarks | Step 3.7 Flash | Step 3.5 Flash | DeepSeek V4 Flash | Gemini 3.5 Flash | DeepSeek V4 Pro | GPT 5.5 | Claude Opus 4.7 | Kimi K2.6 | GLM 5.1 |
| Total Params | 196B + 1.8B (ViT) | 196B | 284B | â | 1.6T | â | â | 1T | 754B |
| Active Params | 11B | 11B | 13B | â | 49B | â | â | 32B | 40B |
| Multi-modal | â | â | â | â | â | â | â | â | â |
| General Agent |  |  |  |  |  |  |  |  |  |
| HLE w. tool (acc) | 47.2% (text-only 49.7%) | 35.7% | 45.1% | 40.2% | 48.2% | 52.2% | 54.7% | 54.0% | 52.3% |
| BrowseComp (acc) | 75.8% | 69.0% | 73.2% | â | 83.4% | 90.1% | 79.3% | 83.2% | 79.3% |
| deepsearchQA (F1) | 92.8% | 85.5%* | 90.6%* | â | â | 94.0%* | 91.7%* | 92.5% | 91.2%* |
| deepsearchQA (acc) | 81.7% | 73.4% | 79.8%* | â | â | 85.3%* | 82.3%* | 83.0% | 81.3%* |
| ResearchRubrics (score) | 71.7% | 65.3% | 66.2%* | 63.6%* | 68.3%* | 61.5%* | 73.9%* | 63.0%* | 67.9%* |
| Toolathlon | 49.5% | 33.3% | 52.8%* | 56.5% | 56.6%* | 60.2%* | 65.4%* | 54.6%* | 48.1%* |
| Claweval-v1.1 (pass^3) | 67.1% | 43.6% | 57.8% | â | 59.8% | â | â | 62.3% | 62.3% |
| GDPval-Stirrup | 1415.8 (ii 45.8%) | 1055.0 (ii 27.8%) | 1414.0 (ii 44.0%) | 1656.0 (ii 57.8%) | 1554.0 (ii 53.0%) | 1769.0 (ii 63.0%) | 1753.0 (ii 63.0%) | 1481.0 (ii 49.0%) | 1535.0 (ii 52.0%) |
| Coding |  |  |  |  |  |  |  |  |  |
| SWE-MTLG | 72.4% | 67.4% | 73.3% | â | 76.2% | â | 80.5% | 76.7% | â |
| SWE-Bench Pro | 56.3% | 51.3% | 55.6%* | 55.1% | 55.4% | 58.6% | 64.3% | 58.6% | 58.4% |
| SWE-Bench Verified | 76.5% | 74.4% | 79.0%* | â | 80.6% | â | 87.6% | 80.2% | â |
| Terminal-Bench 2.1 | 59.6% | 53.4% | 62.0%* | 76.2% | 72.0% | 82.7% | 69.4% | 66.7% | 69.0% |
| Long Context |  |  |  |  |  |  |  |  |  |
| AA-LCR (avg@16/acc) | 63.9% | 45.5% | 63.7% | 71.0% | 66.3% | 74.3% | 70.3% | 69.1% | 64.9% |

## 协议脚注

- 来源：https://static.stepfun.com/blog/step-3.7-flash/（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 2556x1302 | https://static.stepfun.com/blog/step-3.7-flash/assets/search_thumbs/law_1_s9.png | Search topology |
