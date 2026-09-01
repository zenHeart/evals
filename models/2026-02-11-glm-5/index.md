---
vendor: glm
model: GLM-5
release: glm-5
date: 2026-02-11
source: https://z.ai/blog/glm-5
fetched_at: 2026-09-01
---

# GLM-5: From Vibe Coding to Agentic Engineering

## 评测数据（转录）

### 表 1（页面 HTML 表格逐行转录）

| Benchmark | GLM-5 (Thinking) | GLM-4.7 (Thinking) | DeepSeek-V3.2 (Thinking) | Kimi K2.5 (Thinking) | Claude Opus 4.5 (Extend Thinking) | Gemini 3.0 Pro (High Thinking Level) | GPT-5.2 (xhigh) |
|---|---|---|---|---|---|---|---|
| Reasoning |  |  |  |  |  |  |  |
| Humanity's Last Exam | 30.5 | 24.8 | 25.1 | 31.5 | 28.4 | 37.2 | 35.4 |
| Humanity's Last Exam w/ Tools | 50.4 | 42.8 | 40.8 | 51.8 | 43.4* | 45.8* | 45.5* |
| AIME 2026 I | 92.7 | 92.9 | 92.7 | 92.5 | 93.3 | 90.6 | - |
| HMMT Nov. 2025 | 96.9 | 93.5 | 90.2 | 91.1 | 91.7 | 93.0 | 97.1 |
| IMOAnswerBench | 82.5 | 82.0 | 78.3 | 81.8 | 78.5 | 83.3 | 86.3 |
| GPQA-Diamond | 86.0 | 85.7 | 82.4 | 87.6 | 87.0 | 91.9 | 92.4 |
| Coding |  |  |  |  |  |  |  |
| SWE-bench Verified | 77.8 | 73.8 | 73.1 | 76.8 | 80.9 | 76.2 | 80.0 |
| SWE-bench Multilingual | 73.3 | 66.7 | 70.2 | 73.0 | 77.5 | 65.0 | 72.0 |
| Terminal-Bench 2.0 Terminus-2 | 56.2 / 60.7† | 41.0 | 39.3 | 50.8 | 59.3 | 54.2 | 54.0 |
| Terminal-Bench 2.0 Claude Code | 56.2 / 61.1† | 32.8 | 46.4 | - | 57.9 | - | - |
| CyberGym | 43.2 | 23.5 | 17.3 | 41.3 | 50.6 | 39.9 | - |
| General Agent |  |  |  |  |  |  |  |
| BrowseComp | 62.0 | 52.0 | 51.4 | 60.6 | 37.0 | 37.8 | - |
| BrowseComp w/ Context Manage | 75.9 | 67.5 | 67.6 | 74.9 | 67.8 | 59.2 | 65.8 |
| BrowseComp-Zh | 72.7 | 66.6 | 65.0 | 62.3 | 62.4 | 66.8 | 76.1 |
| τ²-Bench | 89.7 | 87.4 | 85.3 | 80.2 | 91.6 | 90.7 | 85.5 |
| MCP-Atlas Public Set | 67.8 | 52.0 | 62.2 | 63.8 | 65.2 | 66.6 | 68.0 |
| Tool-Decathlon | 39.2 | 23.8 | 35.2 | 27.8 | 43.5 | 36.4 | 46.3 |
| Vending Bench 2 | $4,432.12 | $2,376.82 | $1,034.00 | $1,198.46 | $4,967.06 | $5,478.16 | $3,591.33 |

## 协议脚注

- 来源：https://z.ai/blog/glm-5（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.webp | 300x300 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5-blog/z-icon.png | rendered page image |
| images/02.webp | 4239x2884 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5-blog/20260212-010724.png | rendered page image |
| images/03.png | 5465x3738 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5-blog/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_2026-02-11_232804_259.png | rendered page image |
| images/04.webp | 3335x2411 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5-blog/bf5c97ae6ba5f07ba980ed9bcc116f47.PNG | rendered page image |
| images/05.webp | 3840x2160 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5-blog/word-goodcase-2-westbrook2.png | rendered page image |
