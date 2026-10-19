---
vendor: xai
model: Grok Voice 3.0
release: grok-voice-3
date: 2026-10-14
source: https://x.ai/news/grok-voice-3
fetched_at: 2026-10-19
---

# Introducing Grok Voice 3.0

## 发布要点（转录）

- xAI 发布 speech-to-speech 模型 Grok Voice 3.0，官方定位为"世界上最智能的语音模型"：在解决客服通话上创下新纪录，延迟低于 1 秒，成本低于其他前沿模型。
- 在 Artificial Analysis 的独立测试中，Grok Voice 3.0 在 Speech-to-Speech Index 上排名第 1，分数 86.9；该指数综合语音推理、τ-Voice、真人偏好与任务成功率（盲测 head-to-head 通话）。
- 已在 Voice Agent API 上线，价格与前代 Grok Voice 2.0 相同：$0.08 / 分钟（$4.80 / 小时）。使用 `grok-voice-latest` 的智能体已自动切换，无需改动。
- 落地规模：Grok Voice 3.0 每天在特斯拉车内处理数百万通对话（支持 Connectors 处理日历/邮件等简单请求，以及 Grok Bot 处理点咖啡、订餐等复杂任务）；Starlink 呼叫中心每天处理 20,000 通客户通话，其中约 70% 无人工介入即解决，每四通销售通话约一通在挂断前成交。
- 官方给出的成本对照（Artificial Analysis 的 Big Bench Audio run 每任务平均成本，USD，越低越好）：Grok Voice 3.0 $0.025、GPT-Live-1 (Astra, Medium) $0.03、GPT-Realtime-2.1 (High) $0.055。
- 官方未披露参数量与上下文长度，故账本记 null。

## 评测数据（DOM 明文，可直接机读）

> 说明：本节数值取自发布页 DOM 文本与 DOM 表格，可精确定位，账本按 verified 记。表格 caption 明确标注 "per Artificial Analysis"，故该表各行按第三方转述（third_party_reported）处理。

### 主表（DOM table，caption：Speech-to-speech benchmark comparison between Grok Voice 3.0 and competing models, per Artificial Analysis。Source: Artificial Analysis, October 13, 2026）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| AA Speech-to-Speech Index | 86.9 | 综合指数；同表竞品列：Grok Voice 2.0 81.3 / GPT-Live-1 (Astra, Medium) 83.2 / Gemini 3.8 Live (Ext. Thinking, High) 82.6 |
| Big Bench Audio | 98.5% | 语音推理项；同表竞品列：97.2% / 90.1% / 97.7% |
| Speech Agent Arena Elo | 1070 | 真人偏好项；同表竞品列：1011 / 1048 / 990 |
| Task Success Rate | 94.8% | 任务完成项；同表竞品列：94.6% / 87.4% / 89.1% |
| Full Duplex Bench | 97.0% | 会话动态项；同表竞品列：95.1% / 94.9% / 91.9% |

### 正文散文明文

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Speech-to-Speech Index | 86.9 | 正文复述表格值："ranks #1 on the Speech-to-Speech Index, with a score of 86.9" |
| Full Duplex Bench | 97% | 正文复述表格值："also scores 97% on Full Duplex Bench" |
| τ-Voice | 71.6% | "Grok Voice 3.0 scores 71.6%, comparable with GPT-Live-1 (Astra), but at 40% lower latency"；配图 "Agentic Performance vs. Speed τ-Voice" 标注 Source: Artificial Analysis |
| EVA-Bench | 74% | "On EVA-Bench, ServiceNow's benchmark for enterprise voice agents, Grok Voice 3.0 achieves the highest accuracy score at 74%"；EVA-Bench 为 ServiceNow 开源基准，覆盖 200+ 真实企业场景 |

## 图表与素材

- 页面内联 SVG 图表（非位图，文本可机读）：
  - τ-Voice "Agentic Performance vs. Speed"（Source: Artificial Analysis）
  - "Lower cost per task than comparable models"（Big Bench Audio run 每任务平均成本，USD，越低越好；Grok Voice 3.0 $0.025 / GPT-Live-1 (Astra, Medium) $0.03 / GPT-Realtime-2.1 (High) $0.055）
- 成本数值属成本对照而非基准分数，按抽取口径不单独建基准行，其数值与口径记入 Big Bench Audio 行的 notes。
- `images/og-grok-voice-3-0.webp` — 官方页 og:image

## 规格与定价（官方明示）

| 项 | 值 |
| --- | --- |
| API 价 | $0.08 / 分钟（$4.80 / 小时），与 Grok Voice 2.0 同价 |
| API 模型 id | `grok-voice-latest`（已自动切换到 3.0） |
| 延迟 | 低于 1 秒 |
| 参数量 | 未披露（null） |
| 上下文长度 | 未披露（null） |
| 生产用量 | 特斯拉车内每天数百万通对话；Starlink 呼叫中心每天 20,000 通，约 70% 无人工介入 |
