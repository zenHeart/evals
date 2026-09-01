---
vendor: glm
model: GLM-5.2
release: glm-5-2
date: 2026-06-16
source: https://z.ai/blog/glm-5.2
fetched_at: 2026-09-01
---

# GLM-5.2: Built for Long-Horizon Tasks

## 评测数据（转录）

### 表 1（页面 HTML 表格逐行转录）

| Method | Acceptance Length |
|---|---|
| Baseline | 4.56 |
| + IndexShare + KV Share | 5.10 |
| + Rejection Sampling | 5.29 |
| + End-to-end TV Loss | 5.47 (+20%) |

### 表 2（页面 HTML 表格逐行转录）

| Benchmark | GLM-5.2 | GLM-5.1 | Qwen3.7-Max | MiniMax M3 | DeepSeek-V4-Pro | Claude Opus 4.8 | GPT-5.5 | Gemini 3.1 Pro |
|---|---|---|---|---|---|---|---|---|
| Reasoning |  |  |  |  |  |  |  |  |
| HLE | 40.5 | 31.0 | 41.4 | 37.0 | 37.7 | 49.8* | 41.4* | 45.0 |
| HLE w/ Tools | 54.7 | 52.3 | 53.5 | - | 48.2 | 57.9* | 52.2* | 51.4* |
| CritPt | 20.9 | 4.6 | 13.4 | 3.7 | 12.9 | 20.9 | 27.1 | 17.7 |
| AIME 2026 | 99.2 | 95.3 | 97.0 | - | 94.6 | 95.7 | 98.3 | 98.2 |
| HMMT Nov. 2025 | 94.4 | 94.0 | 95.0 | 84.4 | 94.4 | 96.5 | 96.5 | 94.8 |
| HMMT Feb. 2026 | 92.5 | 82.6 | 97.1 | 84.4 | 95.2 | 96.7 | 96.7 | 87.3 |
| IMOAnswerBench | 91.0 | 83.8 | 90.0 | - | 89.8 | 83.5 | - | 81.0 |
| GPQA-Diamond | 91.2 | 86.2 | 90.0 | 93.0 | 90.1 | 93.6 | 93.6 | 94.3 |
| Coding |  |  |  |  |  |  |  |  |
| SWE-bench Pro | 62.1 | 58.4 | 60.6 | 59.0 | 55.4 | 69.2 | 58.6 | 54.2 |
| NL2Repo | 48.9 | 42.7 | 47.2 | 42.1 | 35.5 | 69.7 | 50.7 | 33.4 |
| DeepSWE | 46.2 | 18.0 | 18.0 | 20.0 | 8.0 | 58.0 | 70.0 | 10.0 |
| ProgramBench | 63.7 | 50.9 | - | - | 47.8 | 71.9 | 70.8 | 39.5 |
| Terminal Bench 2.1 Terminus-2 | 81.0 | 63.5 | 75.0 | 65.0 | 64.0 | 85.0 | 84.0 | 74.0 |
| Terminal Bench 2.1 Best Reported Harness | 82.7 (Claude Code) | 69 (Claude Code) | - | - | - | 78.9 (Claude Code) | 83.4 (Codex) | 70.7 (Gemini CLI) |
| FrontierSWE Dominance as of 26/6/16 | 74.4 | 30.5 | - | - | 29.0 | 75.1 | 72.6 | 39.6 |
| PostTrainBench | 34.3 | 20.1 | - | - | - | 37.2 | 28.4 | 21.6 |
| SWE-Marathon | 13.0 | 1.0 | - | - | - | 26.0 | 12.0 | 4.0 |
| Agentic |  |  |  |  |  |  |  |  |
| MCP-Atlas Public Set | 76.8 | 71.8 | 76.4 | 74.2 | 73.6 | 77.8 | 75.3 | 69.2 |
| Tool-Decathlon | 48.2 | 40.7 | - | - | 52.8 | 59.9 | 55.6 | 48.8 |

## 协议脚注

- 来源：https://z.ai/blog/glm-5.2（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.webp | 300x300 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5-blog/z-icon.png | rendered page image |
| images/02.png | 6006x3894 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5.2-blog/20260617-012551.png | img_v3_0212n_dd3e6c79-bb10-4959-9080-56eb8525b92g |
| images/03.webp | 4239x2799 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5.2-blog/20260617-012836.png | img_v3_0212o_51684a16-c33f-4429-aea5-9f5f7cdfc30g |
| images/04.png | 6166x4094 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5.2-blog/20260617-010855.png | img_v3_0212n_3ea7ea95-4c53-4192-b613-00eccaa27b9g |
| images/05.webp | 4000x2206 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5.2-blog/20260617-013338.png | img_v3_0212n_f94802c4-f734-4deb-860f-1f6402907bag |
| images/06.webp | 1280x457 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5.2-blog/rJRliw0WGx.png | image |
| images/07.webp | 1972x878 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5.2-blog/rJip3TCbGl.png | CleanShot 2026-06-16 at 21.16.26@2x |
