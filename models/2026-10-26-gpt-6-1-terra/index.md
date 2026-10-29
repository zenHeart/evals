---
vendor: openai
model: GPT-6.1 Terra
release: gpt-6-1-terra
date: 2026-10-26
source: https://openai.com/index/introducing-gpt-6-1-terra/
fetched_at: 2026-10-26
---

# GPT-6.1 Terra

发布日期证据：官方发布页 `https://openai.com/index/introducing-gpt-6-1-terra/` 正文标题为「Introducing GPT-6.1 Terra」；官方 news RSS（`https://openai.com/news/rss.xml`）收录该条目的 `pubDate` 为 `Mon, 26 Oct 2026 22:00:00 GMT`，两者同为 2026-10-26，`date_precision=day`。来源：https://openai.com/index/introducing-gpt-6-1-terra/

OpenAI 发布 **GPT-6.1 Terra**——GPT-6.1 系列的 fast / efficient 档模型，官方定位是「把视觉理解与精确的计算机操作结合起来，同时写作更清晰自然」，主打起草提案、读技术图纸、填表、剪视频这类填满工作日的工作。

官方明示规格：

| 项 | 值 |
|---|---|
| 系列定位 | fast / efficient 档（官方原文 a fast, efficient model） |
| API 模型名 | `gpt-6.1-terra` |
| 标准 API 价 | 每百万输入 token **1 美元**、每百万缓存输入 token **0.05 美元**、每百万输出 token **5 美元** |
| 相对定价 | 较 GPT-5.6 Terra 与 GPT-6.1 Sol 的标准 API 价**低 50%** |
| 上线范围 | ChatGPT Work 与 Codex 的 Plus / Pro / Enterprise / Edu 用户；OpenAI API（`gpt-6.1-terra`） |
| 上下文窗口 / 参数量 | 发布页未给出（`null`） |
| 安全对齐 | Preparedness Framework 网络安全项达到 **Critical** 门槛，保留 GPT-6 Astra 的防护；另称比 GPT-5.6 Terra 更守范围、更主动披露局限与阻塞项 |

正文（服务端渲染，DOM 机读）明确给出的**绝对分值**：

| 评测 | 模型 | 数值 | 同段对照 |
|---|---|---:|---|
| 内部诱导性提示基准（low reasoning effort） | GPT-6.1 Terra | 16.7% | 前代 GPT-5.6 Terra 53.6% |
| 内部诱导性提示基准（max reasoning effort） | GPT-6.1 Terra | 4.3% | 官方称接近 GPT-6 Astra 与 GPT-6.1 Sol（未印数值） |
| Terminal-Bench 4.0 | GPT-6.1 Terra | 50.3% | 前代 GPT-5.6 Terra 21.5%（官方称「已公布分」） |

正文点名但**散文里只给相对结论**的四项——绝对分值其实在同一页**内嵌评测图表的结构化数据**里（见下节「内嵌图表数据补录」，2026-10-29 核验补录）：

| 评测 | 官方原话要点（散文层） |
|---|---|
| Agents' Last Exam | 中等努力级别下较 GPT-5.6 Terra 高 15 个百分点、成本约其三分之一；与 GPT-6 Astra 持平而单 token 价格约其十分之一 |
| MMMU-Pro | 在每个推理档位都优于 GPT-5.6 Terra；接近 GPT-6 Astra 与 GPT-6.1 Sol 的分数而成本低得多 |
| OSWorld 2.1 | 中等努力级别下超过 GPT-5.6 Terra 的最好成绩，每任务成本只是其零头 |
| Terminal-Bench-Science 0.1 | max 努力级别下超过 GPT-6.1 Sol 且成本更低，与 Claude Opus 5.5 相差在 5 分以内、估算成本不到其五分之一 |

## 内嵌评测图表数据（2026-10-29 核验补录）

本页 6 张评测图不是位图，而是以结构化数据内嵌在页面 RSC 载荷里：`self.__next_f.push([1, "…"])` → `vegaLiteSpec.data.values`，逐「模型 × 推理档位」给出 `score` 与 `usd`（每任务成本）。**DOM 可逐行机读**，按「DOM 机读图表记 DOM 明文」口径补齐绝对分；下方即本归档 `page.html` 内可复核的原始数值。

| 评测（图表标题） | anchorId | GPT-6.1 Terra 五个推理档 | 本次入库取档 | 同档竞品对照 |
|---|---|---|---|---|
| Agents' Last Exam v1 | `agents-last-exam-v1` | low 55.9% / **medium 57.6%** / high 57.2% / xhigh 58.5% / max 60.0% | medium（正文引用的档位） | 同档 GPT-5.6 Terra 42.6%、GPT-6.1 Sol 53.8%、GPT-6 Astra 57.6%、GPT-6 Luna 46.8%、Claude Opus 5.5 63.2%（max 档） |
| MMMU-Pro (Vision) | `mmmu-pro-vision` | low 83.7% / medium 84.6% / high 85.0% / xhigh 85.4% / **max 85.5%** | max（正文未点名推理档，取最高档并在 protocol 标注） | 同档 GPT-6.1 Sol 86.3%、GPT-6 Astra 86.7%、GPT-5.6 Terra 81.7%、GPT-6 Luna 79.9% |
| OSWorld 2.1, offline set | `osworld-2-1-offline` | low 53.8% / **medium 66.7%** / high 68.7% / xhigh 71.3% / max 74.2% | medium（正文引用的档位） | 同档 GPT-5.6 Terra 27.4%、GPT-6.1 Sol 73.5%、GPT-6 Astra 75.4%、GPT-6 Luna 26.3%、Claude Sonnet 5.5 65.9% |
| Terminal-Bench 4.0 | `terminal-bench-4-0` | low 24.8% / medium 35.8% / high 41.8% / xhigh 46.4% / **max 50.3%** | max（与散文一致，本次未改） | 同档 Claude Sonnet 5.5 70.6%、GPT-6.1 Sol 55.9%、GPT-6 Astra 58.2%、GPT-5.6 Terra 21.5% |
| Terminal-Bench-Science 0.1 | `terminal-bench-science-0-1` | low 24.3% / medium 34.3% / high 39.7% / xhigh 43.4% / **max 58.3%** | max（正文引用的档位） | 同档 Claude Opus 5.5 w/ fallbacks 63.3%、GPT-6 Astra 68.1%、GPT-6.1 Sol 57.0% |
| Factual error rate on difficult prompts (lower is better) | `factuality` | low 16.7% / medium 10.1% / high 7.7% / xhigh 5.0% / **max 4.3%** | low 16.7% 与 max 4.3%（与散文一致，本次未改） | 同档 GPT-5.6 Terra low 53.6% / max 22.3%；GPT-6 Astra low 13.3% / max 4.2%；GPT-6.1 Sol low 14.7% / max 4.4% |

四处补录取值与同页散文交叉校验一致：

1. **Agents' Last Exam**：正文「scores 15 percentage points higher than GPT-5.6 Terra」→ 同档 57.6% − 42.6% = **恰 15.0 个百分点**。
2. **OSWorld 2.1**：正文「surpasses GPT-5.6 Terra's best score」→ medium 档 66.7% > GPT-5.6 Terra 全档最好成绩 max 57.1%。
3. **Terminal-Bench-Science 0.1**：正文「surpasses GPT-6.1 Sol at lower cost, coming within five points of Opus 5.5」→ max 档 58.3% > 同档 GPT-6.1 Sol 57.0%，且与 Claude Opus 5.5 w/ fallbacks 63.3% 相差 **恰 5.0 个百分点**。
4. **MMMU-Pro**：正文「nearly matches the scores of GPT-6 Astra and GPT-6.1 Sol」→ max 档 85.5% 与 86.3% / 86.7% 相差不到 1.2 个百分点。

口径边界与读图提醒：

- 这些图是**散点/成本图**（横轴每任务美元成本、纵轴得分），同一模型有多个推理档位的数据点；本归档按「每 benchmark 行 = 一条 evidence、取自家模型列」的规则，**每项基准只取一个档位**（取正文点名或引用的档位；正文未点名的取最高档并在 `protocol.reasoning_effort` 标注），五个档位的完整数值列在上表，不进账本行。
- 图表中 GPT-6.1 Sol 的 Terminal-Bench-Science 点带 **w/ fallbacks** 标签，与其它厂商直接报的 Claude 分**不可直接横比**。
- 图表还给出每点 `usd`（每任务估算成本），属成本指标不是基准分，按口径不建行；已在各行 notes 与本表说明。
- **数值可从本归档 `page.html` 复核**：`vegaLiteSpec.data.values` 在文件内（`self.__next_f.push` 载荷里），本次补录未重新抓取页面。
