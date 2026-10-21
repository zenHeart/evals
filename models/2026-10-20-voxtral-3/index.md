---
vendor: mistral
model: Voxtral 3
release: voxtral-3
date: 2026-10-20
source: https://mistral.ai/news/voxtral-3/
fetched_at: 2026-10-21
---

# Voxtral 3

发布日期来自官方发布页 JSON-LD `datePublished: 2026-10-20T12:00:22.000Z`，与官方 RSS（pubDate Tue, 20 Oct 2026 12:00:22 GMT）一致。

Mistral 发布 **Voxtral 3** 语音模型家族：语音转文本（Voxtral Small Transcribe 3 / Voxtral Mini Transcribe 3 / Voxtral Mini Transcribe Realtime 3）与文本转语音（Voxtral Speech 3，即 Voxtral Mini TTS 3.0），并附带 Voice Agent SDK 与 Pro Voice 音色适配。官方定位为面向实时多轮语音对话（呼叫中心、虚拟助理、免手持副驾）。

官方明示规格：

| 项 | 值 |
|---|---|
| 覆盖语言 | 转写 50+ 语种；TTS 35+ 语种、50+ 方言 |
| Mini Transcribe 3 参数量 | 4B |
| 转写定价 | Mini Transcribe 3 批式 0.0035 USD/分钟；Mini Realtime 3 0.008 USD/分钟；Small Transcribe 3 0.0040 USD/分钟 |
| 语音合成定价 | Voxtral Speech 3（批式与实时同一 API）13 USD/每百万字符 |
| 实时延迟 | 端到端轮次检测（end-of-turn），亚 500ms 延迟，覆盖 35+ 语种 |
| 音色克隆 | Pro Voice 适配需 30 分钟音频；标准克隆 30+ 分钟采样 |

官方评测数据全部以页面内嵌图表组件给出（`data-value` / `data-display` 属性内嵌数值，DOM 机读，无需读图）：

| 评测 | 自家模型 | 数值 | 方向 |
|---|---|---:|---|
| FLEURS 45（指定语种） | Voxtral Small Transcribe 3 | 4.0% | 越低越好 |
| FLEURS 45（自动检测语种） | Voxtral Small Transcribe 3 | 4.1% | 越低越好 |
| FLEURS 45（指定语种） | Voxtral Mini Transcribe 3 | 4.5% | 越低越好 |
| FLEURS 45（自动检测语种） | Voxtral Mini Transcribe 3 | 4.6% | 越低越好 |
| 说话人分离 cpWER | Voxtral Small Transcribe 3 | 18.4% | 越低越好 |
| 说话人分离 cpWER | Voxtral Mini Transcribe 3 | 18.6% | 越低越好 |
| 关键短语召回（含上下文） | Voxtral Small Transcribe 3 | 94.6% | 越高越好 |
| 关键短语召回（无上下文） | Voxtral Small Transcribe 3 | 81.4% | 越高越好 |
| Artificial Analysis WER 指数 | Voxtral Small Transcribe 3 | 2.1% | 越低越好 |
| Artificial Analysis WER 指数 | Voxtral Mini Transcribe 3 | 2.2% | 越低越好 |
| FLEURS 35 实时（2400ms 窗口） | Voxtral Mini Realtime 3 | 5.7% | 越低越好 |
| FLEURS 35 实时（960ms 窗口） | Voxtral Mini Realtime 3 | 6.0% | 越低越好 |
| FLEURS 35 实时（480ms 窗口） | Voxtral Mini Realtime 3 | 6.4% | 越低越好 |
| FLEURS 35 实时（240ms 窗口） | Voxtral Mini Realtime 3 | 7.4% | 越低越好 |
| Voice Code Bench（忠实复现片段） | Voxtral Speech 3 | 80% | 越高越好 |
| 读音控制（发音准确片段） | Voxtral Speech 3 | 87% | 越高越好 |
| 多语种评委均分（11 语种） | Voxtral Speech 3 | 3.16 | 越高越好 |
| 英文表现力评委均分 | Voxtral Speech 3 | 3.13 | 越高越好 |

图表脚注载明的评测协议：Voice Code Bench 由 BeSimple AI 出品，300 条英文提示、每系统男女两种音色、评委为 gemini-3.8-flash、单价取自各厂商定价页、生成日期 2026-10-20；多语种榜为 377 条提示、11 个语种、每语种 1 个母语音色、1–5 分制、评委为 gemini-3.8-flash；英文表现力榜（one_eval）为 237 条提示、每系统 2 个音色（Voxtral 为 Sarah 与 James）、1–5 分制。FLEURS 45 脚注列明 45 个语种清单，日/韩/泰/中用 CER 代替 WER。说话人分离榜采用 AMI-IHM、AMI-SDM、Switchboard、Switchboard CallHome、AISHELL-4 五个公开基准，AMI 与 AISHELL 取 30 分钟版本。Artificial Analysis WER 指数为 VoxPopuli、Earnings-22、AgentTalk 三个基准的加权平均。
