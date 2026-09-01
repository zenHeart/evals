---
vendor: qwen
model: Qwen3-Coder-480B-A35B-Instruct
release: qwen3-coder
date: 2025-07-22
source: https://qwenlm.github.io/blog/qwen3-coder/
fetched_at: 2026-09-01
---

# Qwen3-Coder: Agentic Coding in the World

## 评测数据（转录）


### Qwen3-Coder 主对照表（视觉转写，来源 images/02.jpg qwen3-coder-main.jpg）

| 分组 | Benchmark | Qwen3-Coder-480B-A35B-Instruct | Kimi-K2 Instruct | DeepSeek-V3-0324 | Claude Sonnet-4 | OpenAI GPT-4.1 |
|---|---|---|---|---|---|---|
| Agentic Coding | Terminal-Bench | 37.5 | 30.0 | 2.5 | 35.5 | 25.3 |
| Agentic Coding | SWE-bench Verified w/ OpenHands, 500 turns | 69.6 | - | - | 70.4 | - |
| Agentic Coding | SWE-bench Verified w/ OpenHands, 100 turns | 67.0 | 65.4 | 38.8 | 68.0 | 48.6 |
| Agentic Coding | SWE-bench Verified w/ Private Scaffolding | - | 65.8 | - | 72.7 | 63.8 |
| Agentic Coding | SWE-bench Live | 26.3 | 22.3 | 13.0 | 27.7 | - |
| Agentic Coding | SWE-bench Multilingual | 54.7 | 47.3 | 13.0 | 53.3 | 31.5 |
| Agentic Coding | Multi-SWE-bench mini | 25.8 | 19.8 | 7.5 | 24.8 | - |
| Agentic Coding | Multi-SWE-bench flash | 27.0 | 20.7 | - | 25.0 | - |
| Agentic Coding | Aider-Polyglot | 61.8 | 60.0 | 56.9 | 56.4 | 52.4 |
| Agentic Coding | Spider2 | 31.1 | 25.2 | 12.8 | 31.1 | 16.5 |
| Agentic Browser Use | WebArena | 49.9 | 47.4 | 40.0 | 51.1 | 44.3 |
| Agentic Browser Use | Mind2Web | 55.8 | 42.7 | 36.0 | 47.4 | 49.6 |
| Agentic Tool Use | BFCL-v3 | 68.7 | 65.2 | 64.7 | 73.3 | 62.9 |
| Agentic Tool Use | TAU-Bench Retail | 77.5 | 70.7 | 59.1 | 80.5 | - |
| Agentic Tool Use | TAU-Bench Airline | 60.0 | 53.5 | 40.0 | 60.0 | - |

## 协议脚注

- 来源：https://qwenlm.github.io/blog/qwen3-coder/（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 843x835 | https://qwenlm.github.io/img/logo.png |  |
| images/02.jpg | 3184x1817 | https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3-Coder/qwen3-coder-main.jpg |  |
| images/03.png | 5952x2206 | https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3-Coder/coderl.png |  |
| images/04.jpg | 3306x1715 | https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen3-Coder/swe.jpg |  |
