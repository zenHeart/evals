---
vendor: deepseek
model: DeepSeek V4 Pro
release: deepseek-v4-pro
date: 2026-08-13
source: https://api-docs.deepseek.com/zh-cn/news/news260813/
fetched_at: 2026-09-02
---

# DeepSeek-V4-Pro 正式版上线

## 发布要点（散文转录）

- 「今天，我们发布 DeepSeek V4 Pro 正式版。」
- 已同步在 APP、网页端和 API 更新上线；APP/网页端通过「专家模式」使用全新 V4 Pro 正式版模型；**API 模型名不变**。
- **Agent 能力大幅提升**：正式版 DeepSeek V4 Pro 增强了 Agent 能力，「在生产环境中的性能表现提升尤为显著」。
- **原生支持 Responses API**：DeepSeek API 原生支持 OpenAI Responses API 格式，并针对性适配 Codex（官方文档提供一键配置脚本）。
- **思考强度三档**：V4-Pro 和 V4-Flash 思考模式现支持 low / high / max 三档思考强度。
- **峰谷定价**：随 V4 全系列正式版上线调整 API 价格，闲时价格为高峰时段价格的一半；北京时间 2026-08-17 00:00 起生效。
- 页面脚注中的模型快照名：**DeepSeek-V4-Pro-0813**。

## 评测数据（转录）

本页全部评测数值在单张图片内：`images/v4_260813_benchmark_table_cn.png`。下表为逐行视觉转写（2026-09-02，模型直读 + MiniMax OCR 双路径一致），**未经人工复核确认前不得作为 verified 证据引用**。

表注原文：*对于公开基准测试集中的 Code Agent 任务，DeepSeek-V4-Pro-0813 使用 DeepSeek Harness 极简模式作为框架进行测试（使用 max 档位，topp=0.95，temperature=1.0），其他框架下结果可能略有不同。

表格题注：DeepSeek V4 Pro 正式版模型在 Agent 相关评测集上的表现以及与其他前沿模型的对比

| 评测 | 分数（V4-Pro-0813） | 备注（同表其余列） |
| --- | --- | --- |
| HLE (wo/w tools) | 42.7 / 60.0 (视觉转写) | 双值为 无工具/带工具。Flash-0731 37.8/51.5；V4-Pro-Preview 37.7/48.2；V4-Flash-Preview 34.8/45.1；GLM-5.2 40.5/54.7；Kimi-K3 43.5/56.0；Opus-4.8 49.8/57.9；Fable 5 (w/ fallback) 53.3/63.0 |
| Terminal Bench 2.1 | 87.9 (视觉转写) | Flash-0731 82.7；V4-Pro-Preview 72.1；V4-Flash-Preview 61.8；GLM-5.2 81.0；Kimi-K3 88.3；Opus-4.8 85.0；Fable 5 88.0 |
| NL2Repo | 61.5 (视觉转写) | Flash-0731 54.2；V4-Pro-Preview 38.5；V4-Flash-Preview 39.4；GLM-5.2 48.9；Kimi-K3 未报告；Opus-4.8 69.7；Fable 5 未报告 |
| Cybergym | 83.3 (视觉转写) | Flash-0731 76.7；V4-Pro-Preview 52.7；V4-Flash-Preview 38.7；GLM-5.2 未报告；Kimi-K3 80.0；Opus-4.8 78.3；Fable 5 83.1 |
| DeepSWE | 62.7 (视觉转写) | Flash-0731 54.4；V4-Pro-Preview 12.8；V4-Flash-Preview 7.3；GLM-5.2 46.2；Kimi-K3 67.5；Opus-4.8 58.0；Fable 5 70.0 |
| Toolathlon-Verified | 74.1 (视觉转写) | Flash-0731 70.3；V4-Pro-Preview 55.9；V4-Flash-Preview 49.7；GLM-5.2 59.9；Kimi-K3 76.5；Opus-4.8 76.2；Fable 5 77.9 |
| Agents' Last Exam | 25.7 (视觉转写) | Flash-0731 25.2；V4-Pro-Preview 16.5；V4-Flash-Preview 15.8；GLM-5.2 23.8；Kimi-K3 27.6；Opus-4.8 25.7；Fable 5 未报告 |
| AutomationBench (Public) | 31.8 (视觉转写) | Flash-0731 25.1；V4-Pro-Preview 12.8；V4-Flash-Preview 10.8；GLM-5.2 12.9；Kimi-K3 30.8；Opus-4.8 27.2；Fable 5 29.1 |
| DSBench-FullStack | 71.1 (视觉转写) | Flash-0731 68.7；V4-Pro-Preview 41.8；V4-Flash-Preview 37.0；GLM-5.2 61.8；Kimi-K3 73.7；Opus-4.8 71.6；Fable 5 77.2 |
| DSBench-Hard | 67.2 (视觉转写) | Flash-0731 59.6；V4-Pro-Preview 31.1；V4-Flash-Preview 25.8；GLM-5.2 54.5；Kimi-K3 63.0；Opus-4.8 71.7；Fable 5 68.3 |

未报告单元格（原图 `-`）一律不转录数值，仅注明「未报告」。同表 DeepSeek 侧三列为不同快照（0731 正式 Flash / 预览版 Pro / 预览版 Flash），不可与 0813 正式版列互比。

## 定价（图片转录 — 非评测内容，注明）

价格表同为图片：`images/v4_260813_price_cn.png`（视觉转写，供复核；不计入评测证据）。单位 ¥/百万 Tokens，峰谷复合价：

| 模型 | 时段 | 输入（缓存命中） | 输入（缓存未命中） | 输出 |
| --- | --- | --- | --- | --- |
| DeepSeek-V4-Pro | 空闲时段 | 0.15 | 4.5 | 13.5 |
| DeepSeek-V4-Pro | 高峰时段 | 0.30 | 9.0 | 27.0 |
| DeepSeek-V4-Flash | 空闲时段 | 0.05 | 1.5 | 4.5 |
| DeepSeek-V4-Flash | 高峰时段 | 0.10 | 3.0 | 9.0 |

高峰时段：北京时间 9:00–12:00、14:00–18:00（其余为空闲时段）；北京时间 2026-08-17 00:00 开始生效。闲时价格为高峰一半，与正文「峰谷定价」表述一致。

## 附录图片清单

- `images/v4_260813_benchmark_table_cn.png` — 3665x1632 | 原URL: https://api-docs.deepseek.com/zh-cn/img/v4_260813_benchmark_table_cn.png | Agent benchmark 对比全表（本页唯一评测数据载体）
- `images/v4_260813_price_cn.png` — 1280x705 | 原URL: https://api-docs.deepseek.com/zh-cn/img/v4_260813_price_cn.png | 价格表（非评测）
- `images/v4-hire.jpeg` — 1080x636 | 原URL: https://api-docs.deepseek.com/zh-cn/img/v4-hire.jpeg | 招聘图（非评测）

页面另引用站点装饰图 `img/favicon.svg`、`img/deepseek-social-card.jpeg`，非内容图片，未归档。

- 日期证据：新闻侧栏印刷「DeepSeek-V4-Pro 正式版上线 2026/08/13」+ slug `news260813`。
- 本节数值为对官方图片的视觉转写（2026-09-02），以原图为准。
