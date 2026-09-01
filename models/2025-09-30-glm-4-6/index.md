---
vendor: glm
model: GLM-4.6
release: glm-4-6
date: 2025-09-30
source: https://z.ai/blog/glm-4.6
fetched_at: 2026-09-01
---

# GLM-4.6 发布

## 评测数据（转录）

| Benchmark | GLM-4.6 | GLM-4.6 w/ Tools | GLM-4.5 | DeepSeek-V3.2-Exp | Claude Sonnet 4 | Claude Sonnet 4.5 |
| --- | --- | --- | --- | --- | --- | --- |
| AIME 25 | 93.9 | 98.6 | 85.4 | 89.3 | 74.3 | 87.0 |
| GPQA | 81.0 | 82.9 | 79.9 | 79.9 | 77.7 | 83.4 |
| LiveCodeBench v6 | 82.8 | 84.5 | 63.3 | 70.1 | 48.9 | 57.7 |
| HLE | 17.2 | 30.4 | 14.4 | 19.8 | 9.6 | 17.3 |
| BrowseComp | 45.1 | - | 26.4 | 40.1 | 14.7 | 19.6 |
| SWE-bench Verified | 68.0 | - | 64.2 | 67.8 | 72.5 | 77.2 |
| Terminal-Bench | 40.5 | - | 37.5 | 37.7 | 35.5 | 50.0 |
| tau2-Bench (Weighted) | 75.9 | - | 67.5 | 53.4 | 66.0 | 88.1 |

CC-Bench（真实多轮编程任务，对照 Claude Sonnet 4 的胜率）：GLM-4.6 48.6%（prose）。

## 协议脚注

- 评测统一在 128K 上下文长度下进行（图内说明）。
- AIME 25 / GPQA / LiveCodeBench v6 / HLE 四项同时给出 base 与 w/ Tools 两个口径，两者不合并。
- GLM-4.6 上下文由 128K 扩展到 200K；thinking 与工具调用可在推理中交织。

## 图片清单

- images/02.png — 3390x2654 | rendered page image | 原URL: https://z-cdn.chatglm.cn/z-blog/glm-4-6/coding_benchmark.png
- images/03.png — 8870x2898 | rendered page image | 原URL: https://z-cdn.chatglm.cn/z-blog/glm-4-6/perf.png

- 归档快照 page.html 未随本目录拷贝；Kimi 页面的附录表格以页面内嵌 JSON 形式存在时，数值直接取自该机器可读文本。
- 本节数值为对官方页面/图片的转录复核（2026-09-01），以原文为准。
