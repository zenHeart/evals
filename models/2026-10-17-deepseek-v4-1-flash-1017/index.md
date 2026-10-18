---
vendor: deepseek
model: DeepSeek-V4.1-Flash-1017
release: deepseek-v4-1-flash-1017
date: 2026-10-17
source: https://api-docs.deepseek.com/news/news261017
fetched_at: 2026-10-18
---

# DeepSeek-V4.1-Flash-1017: Wish-Driven Programming Made Real

## 发布要点（转录）

- 官方公告称相对上一版在基准成绩、任务完成速度与输出长度上均更优，构成性能与成本的 Pareto 改进。
- 针对 DeepSeek Harness、Tencent CodeBuddy、WorkBuddy 等做了优化，建议搭配 DeepSeek Harness v0.2.1-rc.1 及以上版本。
- 使用自反馈强化学习（reinforcement learning with self-feedback）改进端到端项目开发能力，覆盖游戏创作与 3D 建模等场景。
- 官方 Quick Start 已将 `deepseek-flash` 路由切换到本版本，旧 `deepseek-v4-flash` 与 `deepseek-v4-flash-vision-exp` 标记为退役。

## 评测数据（视觉转写，待人工确认）

> 说明：以下数值来自公告页内嵌评测总表图片 `images/benchmark_table_en.png`，非页面 DOM 明文，按图行规则一律记 pending，读图确认后方可翻转 verified。

| 评测基准 | 视觉转写值 | 协议（官方脚注） |
| --- | --- | --- |
| hlehle w/o-tools | 42.6 | 官方页未说明 |
| terminalbench 4.0 | 42.3 | Claude Code |
| deepswe 1.1 | 77.0 | Mini-SWE-V2 |
| program-bench | 29.1 | 官方页未说明 |
| nl2repo | 68.2 | 官方页未说明 |
| automationbench 1.0.6 | 60.5 | 官方页未说明 |
| agents-last-exam | 35.4 | 官方页未说明 |
| apexbench 1.1 | 72.1 | 官方页未说明 |
| chartography with-tools | 83.0 | 官方页未说明 / tools |
| babyvision with-tools | 92.5 | 官方页未说明 / tools |
| zerobench main-with-tools | 51.0 | 官方页未说明 / tools |

## 图表与素材

- `images/benchmark_table_en.png` — 官方评测总表（11 行，自家列 + 5 个竞品列）
- 正文另含 DeepSWE v1.1 Pass@1 与每任务成本对照图（`v4.1_261017_perf_cost_en.png`）与四个项目构建演示 GIF，本批未随档保存
