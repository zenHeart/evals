---
vendor: qwen
model: Qwen3.8-Flash-Next
release: qwen3-8-flash
date: 2026-08-26
source: https://qwen.ai/blog?id=qwen3.8-flash-next
fetched_at: 2026-09-01
---

# Qwen3.8-Flash-Next：全新架构，迈向极致性价比

## 评测数据（转录）

### 表 1（页面 HTML 表格逐行转录）

|  | Qwen3.8-Flash-Next | Qwen3.8-27B | Qwen3.7-Plus | DeepSeek-V4-Flash-0731 | Claude-Opus-4.6 (Max) |
|---|---|---|---|---|---|
| # Params | 125B | 27B | 397B | 284B | -- |
| # Activated params | 6B | 27B | 17B | 13B | -- |
| # N-gram embedding params | 51B | -- | -- | -- | -- |
| Coding |  |  |  |  |  |
| Agentic coding DeepSWE 1.1 | 58.7 | 42.2 | 16.5 | 54.4 | -- |
| Agentic coding SWE-bench Pro | 62.5 | 61.7 | 55.8 | 56.0 | 53.4 |
| Multilingual software engineering SWE-bench Multilingual | 81.0 | 73.8 | 75.8 | -- | 77.5 |
| Repo-level code generation NL2Repo-Bench | 48.1 | 42.3 | 41.1 | 54.2 | 47.6 |
| Agent |  |  |  |  |  |
| Long-horizon office work CoWorkBench | 73.9 | 70.7 | 65.1 | 45.1 | 68.2 |
| Professional job tasks JobBench | 55.7 | 33.4 | 27.6 | 41.3 | 36.6 |
| Frontier agentic tasks Agents' Last Exam | Pass@1 24.3 Score 51.2 | Pass@1 20.4 Score 42.9 | Pass@1 13.2 Score 33.6 | Pass@1 25.2 Score -- | -- |
| Real-world tool use Toolathlon Verified (Pass@1) | 73.5 | 67.1 | 50.6 | 70.3 | -- |
| General |  |  |  |  |  |
| Instruction following IFBench | 81.3 | 79.5 | 79.1 | 79.2 | 62.5 |
| Scientific reasoning GPQA Diamond | 91.7 | 89.2 | 90.3 | 90.8 | 91.3 |
| Multidisciplinary reasoning HLE | 35.9 | 30.8 | 34.7 | 33.8 | 40.0 |
| Competitive coding LiveCodeBench v6 | 91.9 | 90.3 | 89.6 | 90.6 | 88.8 |

### 表 2（页面 HTML 表格逐行转录）

|  | Qwen3.8-Flash-Next | Qwen3.8-27B | Qwen3.7-Plus | Claude-Opus-4.6 (Max) |
|---|---|---|---|---|
| Agentic Multimodal Intelligence |  |  |  |  |
| Multimodal tool use ClawEval-MM | Pass@3 64.4 Average 60.4 | Pass@3 57.4 Average 56.9 | Pass@3 57.4 Average 60.1 | Pass@3 52.5 Average 54.7 |
| Application recreation RecreationBench | 49.9 | 47.1 | 30.2 | -- |
| Mobile use AndroidWorld | 84.5 | 81.9 | 81.0 | 62.0 |
| Computer use OSWorld 2.0 | Binary 19.4 Partial 52.3 | Binary 19.4 Partial 48.0 | Binary 2.8 Partial 21.5 | -- |
| Visual web development Vision2Web | 64.0 | 62.9 | 42.1 | -- |
| General Multimodal Intelligence |  |  |  |  |
| Embodied intelligence ERQA | 72.3 | 65.5 | 69.8 | 40.8 |
| Long video understanding LVBench | 76.6 | 72.4 | 76.2 | 63.0 |
| Real-world perception RealWorldQA | 88.5 | 85.9 | 86.9 | 73.9 |
| Visual math problem solving MathVision | Without CI 90.6 With CI 95.7 | Without CI 90.0 With CI 94.6 | Without CI 90.3 With CI 88.7 | Without CI 65.5 |
| Scientific chart analysis CharXiv (RQ) | Without CI 84.6 With CI 90.6 | Without CI 83.7 With CI 90.2 | Without CI 85.8 With CI 85.9 | Without CI 66.0 |

### 表 3（页面 HTML 表格逐行转录）

|  | Qwen3.8-Flash-Next-Base | Qwen3.8-27B-Base | Qwen3.7-Plus-Base |
|---|---|---|---|
| # Params | 125B | 27B | 397B |
| # Activated params | 6B | 27B | 17B |
| # N-gram embedding params | 51B | -- | -- |
| General tasks |  |  |  |
| MMLU | 90.36 | 87.51 | 90.43 |
| MMLU-Redux | 90.68 | 87.26 | 91.47 |
| MMLU-Pro | 73.23 | 68.60 | 70.90 |
| SuperGPQA | 51.36 | 44.86 | 48.42 |
| BBH | 90.87 | 89.56 | 89.41 |
| Math & STEM tasks |  |  |  |
| GPQA | 51.42 | 45.01 | 51.52 |
| GSM8K | 93.29 | 93.18 | 92.95 |
| MATH | 72.78 | 60.54 | 74.38 |
| Coding tasks |  |  |  |
| EvalPlus | 78.76 | 76.05 | 78.06 |
| MultiPL-E | 79.09 | 74.50 | 81.68 |
| SWEBench-Pretrain | 50.99 | 41.66 | 49.24 |
| Multilingual tasks |  |  |  |
| MGSM | 89.33 | 86.37 | 85.42 |
| MMMLU | 84.86 | 79.74 | 84.53 |
| INCLUDE | 78.40 | 74.37 | 78.90 |

## 协议脚注

- 来源：https://qwen.ai/blog?id=qwen3.8-flash-next（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.webp | 180x48 | https://img.alicdn.com/imgextra/i3/O1CN01JLF4IJ1yAv1ZE7bfQ_!!6000000006539-2-tps-180-48.png | logo |
| images/02.png | 843x835 | https://qwenlm.github.io/img/logo.png | rendered page image |
| images/03.jpg | 1920x1080 | https://qianwen-res.oss-accelerate.aliyuncs.com/Qwen3.8-Flash-Next/Qwen3.8-flash_banner_zh.jpg#center | Qwen3.8-Flash-Next |
| images/04.png | 2885x2930 | https://qianwen-res.oss-accelerate.aliyuncs.com/Qwen3.8-Flash-Next/architecture.png#center | Qwen3.8-Flash-Next 模型结构 |
| images/05.png | 2246x1171 | https://qianwen-res.oss-accelerate.aliyuncs.com/Qwen3.8-Flash-Next/qsa_arch.png#center | Qwen Sparse Attention (QSA) 结构图 |
| images/06.png | 2738x1640 | https://qianwen-res.oss-accelerate.aliyuncs.com/Qwen3.8-Flash-Next/throughput.png#center | 90% Cache 命中率下的相对 Prefill 吞吐 |
| images/07.png | 1632x808 | https://qianwen-res.oss-accelerate.aliyuncs.com/Qwen3.8-Flash-Next/qwen-work-cn.png#center | Qwen3.8-Flash on QwenWork |
| images/08.webp | 150x150 | https://img.alicdn.com/imgextra/i1/O1CN01OwlzsC1cRTnZrFfXa_!!6000000003597-2-tps-150-150.png | rendered page image |
| images/09.webp | 72x72 | https://img.alicdn.com/imgextra/i3/O1CN01LF6pFa1PE79GHDehi_!!6000000001808-2-tps-72-72.png | rendered page image |
| images/10.webp | 72x72 | https://img.alicdn.com/imgextra/i3/O1CN01696apl1pyzhNJ40bg_!!6000000005430-2-tps-72-72.png | rendered page image |
| images/11.webp | 72x72 | https://img.alicdn.com/imgextra/i2/O1CN01DJfj2R28G5Z6O677U_!!6000000007904-2-tps-72-72.png | rendered page image |
| images/12.webp | 72x72 | https://img.alicdn.com/imgextra/i2/O1CN01JbyKvo1NhlYiMFJ93_!!6000000001602-2-tps-72-72.png | rendered page image |
| images/13.webp | 72x72 | https://img.alicdn.com/imgextra/i2/O1CN01VmVMp41qYiaiS6nta_!!6000000005508-2-tps-72-72.png | rendered page image |
| images/14.webp | 72x72 | https://img.alicdn.com/imgextra/i4/O1CN01pQADTs1WKiABLBcVE_!!6000000002770-2-tps-72-72.png | rendered page image |
