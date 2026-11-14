---
vendor: minimax
model: MiniMax M2.1
release: minimax-m2-1
date: 2025-12-23
source: https://www.minimax.io/blog/minimax-m21
fetched_at: 2026-11-14
---

# MiniMax M2.1 官方发布页证据归档

本归档是 **MiniMax M2.1 官方研究博客发布页**的一级来源快照，用于给 `minimax/minimax-m2-1` 建档，并把官方正文明文评测写进证据账本。

## 来源与日期证据

| 证据 | 位置 | 内容 |
|---|---|---|
| 页面结构化数据 | `page.html` 内嵌 JSON | `"2025-12-23T00:00:00.000Z"` |
| 页面日期标签 | `<time>` 元素 | 2025-12-23 |
| 官方数据集创建时间 | huggingface.co/datasets/MiniMaxAI/VIBE 的 `createdAt` | `2025-12-23T03:26:14.000Z` |
| 官方数据集开放节奏 | 该数据集 README 的 Roadmap 段 | `Phase 1: Benchmark query prompts & task specifications (Released: December 23, 2025)` |

四源指向同一天，发布日期取 **2025-12-23**。

## 评测转录表

| 评测 | 分数 | 备注 |
|---|---|---|
| VIBE（Visual & Interactive Benchmark for Execution）aggregate 平均分 | 88.6 | 正文明文；原文写 `achieving an average score of 88.6`，**未标百分号、未给满分**，账本按 `unit: index` 记录，display 保留原样字符串「88.6」。VIBE 是 MiniMax 自建评测，题集同日在 Hugging Face 公开（200 题，Web / Simulation / Android / iOS / Backend 五子集各 40 题，Easy 65 / Medium 70 / Hard 65） |
| SWE-bench Verified × 多 coding agent 框架 | —（未取数） | 正文只点名：`We also evaluated MiniMax-M2.1 on SWE-bench Verified across a variety of coding agent frameworks. The results highlight the model s exceptional framework generalization and robust stability.` 数值只存在于位图，承载位图的官方图床在 2026-11-14 不可取（见下），账本记 `pending` + `not_extracted` |

### 正文中提到但未建 evidence 行的评测表述

以下对比同样只有位图、且正文未给出可确定的基准名称，按「不臆造数值、不建无名行」纪律只在此记录：

- 「MiniMax-M2.1 delivers a significant leap over M2 on core software engineering leaderboards.」（具体榜单位于位图内，正文未点名）
- 「across specific benchmarks—including test case generation, code performance optimization, code review, and instruction following—MiniMax-M2.1 demonstrates comprehensive improvements over M2.」
- 「In these specialized domains, it consistently matches or exceeds the performance of Claude Sonnet 4.5.」
- 「It shines particularly bright in multilingual scenarios, where it outperforms Claude Sonnet 4.5 and closely approaches Claude Opus 4.5.」（竞品对比按「竞品列进 notes」处理）

## 抓取与降级路径记录

1. `GET https://www.minimax.io/blog/minimax-m21` → 200，99,333 字节，原样落盘为 `page.html`（正文为 SSR 输出，评测数值是明文，可直接检索）。
2. 页面配图共 13 个 `filecdn.minimax.chat` 地址：
   - 2 张成功取回（`hero-m21-banner.png`、`minimax-logo.png`），4 张作者头像取回（`author-01..04.png`）。
   - **7 张承载基准数值的官方基准图在 2026-11-14 全部不可取**：直连 CDN 返回 **404**，改走站点图片代理 `https://www.minimax.io/_next/image?url=…&w=1920&q=75` 与 `&w=3840&q=90` 两种路由**同样返回 404**。本轮因此无法归档这些位图、也无法做视觉转写，相关 evidence 行一律记 `pending` + `not_extracted`。
3. 页面在「Local Deployment Guide」段给出本地部署建议与推荐推理参数（`temperature=1.0, top_p=0.95, top_k=40`）。按契约「部署建议不是评测协议」，这些值**不写入 protocol**。
4. 规格口径：页面未印参数量、上下文窗口与 API 定价，账本对应字段一律 `null`。

## 文件清单

见 `manifest.json`（含逐文件 sha256）。
