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

正文点名但**只给相对结论、未印绝对分**的四项（按口径记 `verified` + `score_status: not_extracted`，不折算绝对分）：

| 评测 | 官方原话要点 |
|---|---|
| Agents' Last Exam | 中等努力级别下较 GPT-5.6 Terra 高 15 个百分点、成本约其三分之一；与 GPT-6 Astra 持平而单 token 价格约其十分之一 |
| MMMU-Pro | 在每个推理档位都优于 GPT-5.6 Terra；接近 GPT-6 Astra 与 GPT-6.1 Sol 的分数而成本低得多 |
| OSWorld 2.1 | 中等努力级别下超过 GPT-5.6 Terra 的最好成绩，每任务成本只是其零头 |
| Terminal-Bench-Science 0.1 | max 努力级别下超过 GPT-6.1 Sol 且成本更低，与 Claude Opus 5.5 相差在 5 分以内、估算成本不到其五分之一 |

协议口径：发布页**未明示任何评测协议**（harness / tools / 温度 / 跑次数），`protocol` 12 键一律 `null`，只在正文点名的推理努力级别处填 `reasoning_effort`。竞品分只有相对差值（+15 分、约 3 倍 token 效率、约 1/9 单任务成本等），按口径不另建 `comparison_cited` 行。

未转录说明：本页的评测图表以内嵌数据形式呈现（页面只引一张 `terra-art-card-16x9.png` 主视觉图），没有可单独归档的评测大图；上述数值全部来自可见正文段落，非脚本载荷、非读图结果。
