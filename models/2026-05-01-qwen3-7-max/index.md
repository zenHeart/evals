---
vendor: qwen
model: Qwen3.7-Max
release: qwen3-7-max
date: 2026-05
source: https://qwen.ai/blog?id=qwen3.7
fetched_at: 2026-09-01
---

# Qwen3.7：智能体新前沿

## 评测数据（转录）

### 表 1（页面 HTML 表格逐行转录）

|  | Opus-4.6 Max | K2.6 Thinking | GLM-5.1 Thinking | DS-V4-Pro Max | Qwen3.6-Plus | Qwen3.7-Max |
|---|---|---|---|---|---|---|
| Coding Agent |  |  |  |  |  |  |
| Terminal Bench 2.0-Terminus | 65.4 | 66.7 | 63.5 | 67.9 | 61.6 | 69.7 |
| SWE-Verified | 80.8 | 80.2 | -- | 80.6 | 78.8 | 80.4 |
| SWE-Pro | 57.3 | 59.5 | 58.8 | 59.0 | 56.6 | 60.6 |
| SWE-Multilingual | 77.5 | 76.7 | -- | 76.2 | 73.8 | 78.3 |
| NL2repo | 47.6 | 42.8 | 41.0 | 35.5 | 34.4 | 47.2 |
| SciCode | 51.9 | 52.2 | 45.1 | -- | 41.4 | 53.5 |
| QwenWebDev | 1617 | -- | 1564 | 1570 | 1500 | 1568 |
| QwenSVG | 1541 | 1325 | 1605 | 1506 | 1432 | 1608 |
| General Agent |  |  |  |  |  |  |
| Qwenclaw | 65.5 | 54.7 | 58.7 | 59.2 | 57.2 | 64.3 |
| CoWorkBench | 68.2 | 58.2 | 66.0 | 66.3 | 64.5 | 67.2 |
| ClawEval | 70.4 | 61.5 | 62.7 | 58.4 | 57.1 | 65.2 |
| Skillsbench | -- | 56.2 | 53.1 | 52.3 | 45.7 | 59.2 |
| BFCL-V4 | 76.7 | 71.3 | 70.9 | 70.6 | 68.9 | 75.0 |
| MCP-Mark | 56.7 | 55.9 | 57.5 | 57.1 | 48.2 | 60.8 |
| MCP-Atlas | 75.8 | 66.6 | 71.8 | 73.6 | 74.1 | 76.4 |
| Vitabench | -- | 39.1 | 45.1 | 51.9 | 42.8 | 47.9 |
| SpreadSheetBench-v1 | 89.3 | 84.5 | 85.2 | 84.9 | 80.2 | 87.0 |
| Kernel Bench L3 | 2.63/98% | 1.41/80% | 2.00/78% | 1.07/54% | 1.03/48% | 1.98/96% |
| HLE w/ tools | 53.0 | 54.0 | 52.3 | 48.2 | 50.2 | 53.5 |
| QwenWorldBench | 56.1 | 50.9 | 50.2 | 52.3 | 47.6 | 57.3 |
| STEM & Reasoning |  |  |  |  |  |  |
| GPQA Diamond | 91.3 | 90.5 | 86.2 | 90.1 | 90.4 | 92.4 |
| HLE | 40.0 | 36.4 | 34.7 | 37.7 | 28.8 | 41.4 |
| LiveCodeBench | 88.8 | 89.6 | -- | 93.5 | 87.1 | 91.6 |
| HMMT 2026 Feb | 96.2 | 92.7 | 89.4 | 95.2 | 87.8 | 97.1 |
| IMOAnswerBench | 75.3 | 86.0 | 83.8 | 89.8 | 83.8 | 90.0 |
| CritPT | 12.6 | 8.0 | 4.6 | 12.9 | 2.9 | 11.4 |
| Apex | 34.5 | 24.0 | 11.5 | 38.3 | 8.8 | 44.5 |
| General Capability |  |  |  |  |  |  |
| MMLU-Pro | 89.7 | 87.1 | 86.3 | 87.5 | 88.5 | 89.6 |
| MMLU-Redux | 95.2 | 95.3 | 94.3 | 94.8 | 94.5 | 95.0 |
| SuperGPQA | 72.5 | 71.3 | 68.0 | 69.9 | 71.6 | 73.6 |
| IFEval | 91.9 | 94.5 | 94.5 | 91.9 | 94.3 | 94.3 |
| IFBench | 62.5 | 76.0 | 76.0 | 77.0 | 74.2 | 79.1 |
| MRCR-v2 128k | 84.0 | 63.1 | 62.0 | 74.4 | 85.9 | 90.4 |
| Multilingualism |  |  |  |  |  |  |
| WMT24++ | 82.7 | 81.6 | 81.8 | 82.2 | 84.3 | 85.8 |
| MAXIFE | 81.3 | 87.7 | 87.7 | 88.9 | 88.2 | 89.2 |
| MMMLU | 90.6 | 87.5 | 87.2 | 87.9 | 89.5 | 90.3 |
| MMLU-ProX | 86.1 | 83.7 | 83.9 | 83.9 | 84.7 | 87.0 |
| NOVA-63 | 59.1 | 56.7 | 54.6 | 52.8 | 57.9 | 59.0 |
| INCLUDE | 87.4 | 84.2 | 84.3 | 86.1 | 85.1 | 86.2 |
| Global PIQA | 91.2 | 89.2 | 89.5 | 90.5 | 89.8 | 91.4 |
| PolyMATH | 80.2 | 82.7 | 67.6 | 72.0 | 77.4 | 86.5 |

## 协议脚注

- 来源：https://qwen.ai/blog?id=qwen3.7（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.webp | 180x48 | https://img.alicdn.com/imgextra/i3/O1CN01JLF4IJ1yAv1ZE7bfQ_!!6000000006539-2-tps-180-48.png | logo |
| images/02.png | 843x835 | https://qwenlm.github.io/img/logo.png | rendered page image |
| images/03.png | 1672x941 | https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3.7/Figures/qwen3.7-max-banner.png | Qwen3.7 Main Image |
| images/04.png | 17277x9669 | https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3.7/Figures/Qwen3.7-Max-Score.png | rendered page image |
| images/05.png | 4498x3441 | https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3.7/Figures/agent_scaling.png#center | rendered page image |
| images/06.png | 2761x1269 | https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3.7/Figures/harness-generalization.png#center | rendered page image |
| images/07.png | 2066x1496 | https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3.7/Figures/autonomous_hacking_detect_cn.png#center | rendered page image |
| images/08.webp | 150x150 | https://img.alicdn.com/imgextra/i1/O1CN01OwlzsC1cRTnZrFfXa_!!6000000003597-2-tps-150-150.png | rendered page image |
| images/09.webp | 72x72 | https://img.alicdn.com/imgextra/i3/O1CN01LF6pFa1PE79GHDehi_!!6000000001808-2-tps-72-72.png | rendered page image |
| images/10.webp | 72x72 | https://img.alicdn.com/imgextra/i3/O1CN01696apl1pyzhNJ40bg_!!6000000005430-2-tps-72-72.png | rendered page image |
| images/11.webp | 72x72 | https://img.alicdn.com/imgextra/i2/O1CN01DJfj2R28G5Z6O677U_!!6000000007904-2-tps-72-72.png | rendered page image |
| images/12.webp | 72x72 | https://img.alicdn.com/imgextra/i2/O1CN01JbyKvo1NhlYiMFJ93_!!6000000001602-2-tps-72-72.png | rendered page image |
| images/13.webp | 72x72 | https://img.alicdn.com/imgextra/i2/O1CN01VmVMp41qYiaiS6nta_!!6000000005508-2-tps-72-72.png | rendered page image |
| images/14.webp | 72x72 | https://img.alicdn.com/imgextra/i4/O1CN01pQADTs1WKiABLBcVE_!!6000000002770-2-tps-72-72.png | rendered page image |
