---
vendor: glm
model: GLM-5.1
release: glm-5-1
date: 2026-04-07
source: https://z.ai/blog/glm-5.1
fetched_at: 2026-09-01
---

# GLM-5.1: Towards Long-Horizon Tasks

## 评测数据（转录）

### 表 1（页面 HTML 表格逐行转录）

| Benchmark | GLM-5.1 | GLM-5 | Qwen3.6-Plus | MiniMax M2.7 | DeepSeek-V3.2 | Kimi K2.5 | Claude Opus 4.6 | Gemini 3.1 Pro | GPT-5.4 |
|---|---|---|---|---|---|---|---|---|---|
| Reasoning |  |  |  |  |  |  |  |  |  |
| HLE | 31.0 | 30.5 | 28.8 | 28.0 | 25.1 | 31.5 | 36.7 | 45.0 | 39.8 |
| HLE w/ Tools | 52.3 | 50.4 | 50.6 | - | 40.8 | 51.8 | 53.1* | 51.4* | 52.1* |
| AIME 2026 | 95.3 | 95.4 | 95.1 | 89.8 | 95.1 | 94.5 | 95.6 | 98.2 | 98.7 |
| HMMT Nov. 2025 | 94.0 | 96.9 | 94.6 | 81.0 | 90.2 | 91.1 | 96.3 | 94.8 | 95.8 |
| HMMT Feb. 2026 | 82.6 | 82.8 | 87.8 | 72.7 | 79.9 | 81.3 | 84.3 | 87.3 | 91.8 |
| IMOAnswerBench | 83.8 | 82.5 | 83.8 | 66.3 | 78.3 | 81.8 | 75.3 | 81.0 | 91.4 |
| GPQA-Diamond | 86.2 | 86.0 | 90.4 | 87.0 | 82.4 | 87.6 | 91.3 | 94.3 | 92.0 |
| Coding |  |  |  |  |  |  |  |  |  |
| SWE-Bench Pro | 58.4 | 55.1 | 56.6 | 56.2 | - | 53.8 | 57.3 | 54.2 | 57.7 |
| NL2Repo | 42.7 | 35.9 | 37.9 | 39.8 | - | 32.0 | 49.8 | 33.4 | 41.3 |
| Terminal-Bench 2.0 Terminus-2 | 63.5 | 56.2 | 61.6 | - | 39.3 | 50.8 | 65.4 | 68.5 | - |
| Terminal-Bench 2.0 Best self-reported harness | 69.0 (Claude Code) | 56.2 (Claude Code) | - | 57.0 (Claude Code) | 46.4 (Claude Code) | - | - | - | 75.1 (Codex) |
| CyberGym | 68.7 | 48.3 | - | - | 17.3 | 41.3 | 66.6 | 38.8 | 66.3 |
| Agentic |  |  |  |  |  |  |  |  |  |
| BrowseComp | 68.0 | 62.0 | - | - | 51.4 | 60.6 | - | - | - |
| BrowseComp w/ Context Manage | 79.3 | 75.9 | - | - | 67.6 | 74.9 | 84.0 | 85.9 | 82.7 |
| 𝜏³-Bench | 70.6 | 69.2 | 70.7 | 67.6 | 69.2 | 66.0 | 72.4 | 67.1 | 72.9 |
| MCP-Atlas Public Set | 71.8 | 69.2 | 74.1 | 48.8 | 62.2 | 63.8 | 73.8 | 69.2 | 67.2 |
| Tool-Decathlon | 40.7 | 38.0 | 39.8 | 46.3 | 35.2 | 27.8 | 47.2 | 48.8 | 54.6 |
| Vending Bench 2 | $5,634.41 | $4,432.12 | $5,114.87 | - | $1,034.00 | $1,198.46 | $8,017.59 | $911.21 | $6,144.18 |

## 协议脚注

- 来源：https://z.ai/blog/glm-5.1（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.webp | 300x300 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5-blog/z-icon.png | rendered page image |
| images/02.webp | 2800x1400 | https://z-cdn-media.chatglm.cn/prompts-rich-media-resources/5.1-blog/20260407-235121.jpeg | rendered page image |
