---
vendor: glm
model: GLM-4.6
release: glm-4-6
date: 2025-09-30
source: https://z.ai/blog/glm-4.6
fetched_at: 2026-09-01
---

# GLM-4.6: Advanced Agentic, Reasoning and Coding Capabilities

## 评测数据（转录）

### 八项公开基准（视觉转写，来源 images/02.png coding_benchmark；128K 上下文；GLM-4.6 括号内为 w/ Tools 档）

| Benchmark | GLM-4.6 | GLM-4.5 | DeepSeek-V3.2-Exp | Claude Sonnet 4 | Claude Sonnet 4.5 |
|---|---|---|---|---|---|
| AIME 25 | 93.9（98.6 w/ Tools） | 85.4 | 89.3 | 74.3 | 87.0 |
| GPQA | 81.0（82.9 w/ Tools） | 79.9 | 79.9 | 77.7 | 83.4 |
| LiveCodeBench v6 | 82.8（84.5 w/ Tools） | 63.3 | 70.1 | 48.9 | 57.7 |
| HLE | 17.2（30.4 w/ Tools） | 14.4 | 19.8 | 9.6 | 17.3 |
| BrowseComp | 45.1 | 26.4 | 40.1 | 14.7 | 19.6 |
| SWE-bench Verified | 68.0 | 64.2 | 67.8 | 72.5 | 77.2 |
| Terminal-Bench | 40.5 | 37.5 | 37.7 | 35.5 | 50.0 |
| τ²-Bench (Weighted) | 75.9 | 67.5 | 53.4 | 66.0 | 88.1 |

### CC-Bench-V1.1 真实任务 Agent Coding 对战（视觉转写，来源 images/03.png perf.png，左中右三段拼读）

| 对战（GLM-4.6 参与） | Win | Tie | Lose |
|---|---|---|---|
| GLM-4.6 vs Claude Sonnet 4 | 48.6% | 9.5% | 41.9% |
| GLM-4.6 vs GLM-4.5 | 50.0% | 13.5% | 36.5% |
| GLM-4.6 vs Kimi-K2-0905 | 56.8% | 28.3% | 14.9% |
| GLM-4.6 vs DeepSeek-V3.1-Terminus | 64.9% | 8.1% | 27.0% |

### 平均每次交互 token 用量（input+output，多工具调用、不计缓存；视觉转写，同图右段）

| 模型 | Tokens per Round |
|---|---|
| GLM-4.6 | 651,525 |
| GLM-4.5 | 762,817 |
| Kimi-K2-0905 | 821,759 |
| DeepSeek-V3.1-Terminus | 947,454 |

## 协议脚注

- 来源：https://z.ai/blog/glm-4.6（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.webp | 300x300 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5-blog/z-icon.png | rendered page image |
| images/02.png | 3390x2654 | https://z-cdn.chatglm.cn/z-blog/glm-4-6/coding_benchmark.png | rendered page image |
| images/03.png | 8870x2898 | https://z-cdn.chatglm.cn/z-blog/glm-4-6/perf.png | rendered page image |
