---
vendor: mistral
model: Voxtral Mini 4B Realtime Arabic
release: voxtral-mini-4b-realtime-arabic
date: 2026-10-08
source: https://huggingface.co/mistralai/Voxtral-Mini-4B-Realtime-Arabic
fetched_at: 2026-10-23
---

# Voxtral Mini 4B Realtime Arabic

发布日期证据：官方 Hugging Face 模型仓 `mistralai/Voxtral-Mini-4B-Realtime-Arabic` 创建于 **2026-10-08T11:36:06Z**；同批发布的 `mistralai/LIDstral-Arabic` 创建于 2026-10-08T11:37:05Z（相隔 61 秒，同一批阿拉伯语模型发布）；官方共同开发方 **Morocco-MTNRA-Labs** 组织于 2026-10-09 镜像同两个模型仓（17:19:43Z / 17:20:57Z），独立佐证模型在 2026-10-09 前已公开。本批按账本既有先例（`zai-org/GLM-OCR` 档：以「权重与官方模型卡上线日」为发布日）取 2026-10-08。

> 取证说明：Mistral 官方新闻页（92 篇全量 slug）、官方 RSS、开发者 changelog（窗口内仅 2026-10-06 / 10-20 / 10-22 三条）、官方 GitHub 组织、arXiv 与 API 文档模型总览页均**无**本次阿拉伯语模型的发布公告，模型仓与模型卡是唯一的一手发布渠道。官方模型仓创建日在此属「权重与模型卡上线日」，不是抓取日。

Mistral 发布 **Voxtral Mini 4B Realtime Arabic** —— 面向阿拉伯语方言与标准阿拉伯语（MSA）的**流式语音转文本**模型，面向真实场景音频与**语码转换**（说话人在同一段对话中切换语言）设计。

官方明示规格与方法：

| 项 | 值 |
|---|---|
| 任务 | 流式语音识别（ASR / 实时转写） |
| 参数 | 约 4.4B（从 `Voxtral-Mini-4B-Realtime-2602` 微调而来） |
| 精度 | BF16 |
| 音频 | 16 kHz，因果音频编码器 + 语言解码器，边到边出字 |
| 可配置转写延迟 | 官方给 80 / 160 / 320 / 480 / 720 ms 五档（见下方图表） |
| 共同开发 | 与摩洛哥 **Ministère de la Transition Numérique et de la Réforme Administrative（MTNRA）** 联合开发，隶属 Mistral 与摩洛哥 2026 年 1 月签署的战略伙伴关系，定位为主权 AI 资产 |
| 社区部署 | 官方提供 WebGPU 浏览器 demo space（`mistralai/Voxtral-Mini-4B-Realtime-Arabic-WebGPU`，ONNX 权重由 onnx-community 提供） |
| 推理栈 | vLLM（`vllm serve mistralai/Voxtral-Mini-4B-Realtime-Arabic`）、Transformers ≥ 5.2.0 |

官方散文明文（越低越好）：

| 评测 | 分数 | 备注 |
|---|---:|---|
| 七个阿拉伯语基准平均 CER（转写延迟 480 ms） | **8.82%** | 自家模型列 |
| 七个阿拉伯语基准平均 CER（对照） | 7.91% | **Voxtral Transcribe Arabic**；模型卡称差距为 0.91 个百分点 |

官方评测口径（模型卡 Benchmarks 节原文要点）：

- 指标为 **CER**（字符错误率），越低越好。
- 七个阿拉伯语基准：ISMA、**Darija in the Wild**（新，与 MTNRA 联合构建）、MGB-2、SADA、Casablanca、FLEURS、**MASC clean**。
- 全部评测 **temperature 0.0**；实时模型使用 **480 ms** 配置化转写延迟。
- CER 的归一化方式与 MTNRA 联合构建，覆盖阿语方言特有拼写、黏着成分（clitics）、外来词与口语数字；归一化代码见模型仓 `normalization.py`。**换用其他归一化方式分数会不同。**
- 模型卡注明 Gemini 的安全过滤会拦掉部分 FLEURS 音频样本的转写。
- 训练聚焦阿语语码转换；模型卡称在训练重点之外的语种参与的语码转换上也有提升。

官方图表（位图，数值只存在于像素；下表为视觉转写，**未经人工确认不得翻 verified**）：

`images/benchmark_scores.png` —— 八个面板（CER %，越低越好；7 个基准 + 七基准平均）：

| 面板 | Voxtral Mini 4B Realtime Arabic | Voxtral Transcribe Arabic | MAI-Transcribe 2 | ElevenLabs Scribe v2 | Meta Muse Transcribe | Gemini 3.8 Flash | Cohere Transcribe Arabic |
|---|---:|---:|---:|---:|---:|---:|---:|
| Seven-benchmark average | 8.82 | 7.91 | 8.23 | 9.74 | 10.77 | 14.45 | 14.34 |
| ISMA | 6.68 | 4.96 | 7.68 | 8.49 | 14.01 | 14.82 | 19.35 |
| Darija in the Wild | 9.69 | 8.97 | 14.01 | 12.58 | 16.85 | 28.20 | 27.22 |
| MGB-2 | 5.31 | 4.83 | 5.83 | 4.33 | 4.87 | 7.92 | 7.30 |
| SADA | 13.75 | 12.25 | 10.94 | 16.70 | 15.34 | 18.46 | 21.78 |
| Casablanca | 20.34 | 18.60 | 14.90 | 21.32 | 18.52 | 21.64 | 19.49 |
| FLEURS | 2.66 | 2.27 | 1.80 | 2.00 | 3.25 | 5.88 | 2.06 |
| MASC clean | 3.33 | 3.50 | 2.44 | 2.73 | 2.52 | 4.23 | 3.21 |

算术自校验：本模型七项（6.68+9.69+5.31+13.75+20.34+2.66+3.33）÷ 7 = 8.8228 ≈ **8.82**，与散文一致；Voxtral Transcribe Arabic（4.96+8.97+4.83+12.25+18.60+2.27+3.50）÷ 7 = 7.911 ≈ **7.91**，与散文一致。

`images/avg_evals_by_delay.png` —— 七基准平均 CER 随配置化转写延迟变化（延迟轴为对数刻度）：

| 配置化延迟（ms） | Voxtral Mini 4B Realtime Arabic CER % |
|---:|---:|
| 80 | 10.64 |
| 160 | 9.76 |
| 320 | 9.17 |
| 480 | 8.82 |
| 720 | 8.80 |

同图竞品参考线（CER %）：Voxtral Transcribe Arabic 7.91、MAI-Transcribe 2 8.23、Scribe v2 9.74、Muse 10.76、Cohere Transcribe Arabic 14.35、Gemini 3.8 Flash 14.45。

差异留档（不跨来源调和）：竞品在两张官方图之间有 0.01 的四舍五入差——`benchmark_scores.png` 记 Cohere Transcribe Arabic 14.34、Meta Muse Transcribe 10.77，`avg_evals_by_delay.png` 记 Cohere 14.35、Muse 10.76。两图不自洽处按原样留档。

`images/benchmark_composition.png` —— 两个新基准的数据集构成（条数与占比，非评测分数）：

| ISMA（共 357 clips） | 条数 · 占比 |  | Darija in the Wild（共 109 clips） | 条数 · 占比 |
|---|---:|---|---|---:|
| Business | 40 · 11% |  | Everyday code-switching | 38 · 35% |
| Engineering | 45 · 13% |  | Baseline speech | 23 · 21% |
| Entrepreneurship & startups | 33 · 9% |  | Technical code-switching | 16 · 15% |
| Finance | 40 · 11% |  | Tricky names & phrases | 15 · 14% |
| History | 40 · 11% |  | Noise & speed | 11 · 10% |
| Mathematics | 39 · 11% |  | Silence handling | 6 · 6% |
| Physics | 30 · 8% |  |  |  |
| Life sciences | 40 · 11% |  |  |  |
| Tourism | 50 · 14% |  |  |  |

## 评测口径与限制

- CER 依赖**与 MTNRA 联合构建的归一化**（方言拼写、黏着成分、外来词、口语数字），换归一化方式分数会变；跨厂商比较前必须对齐归一化与延迟档。
- 流式延迟是硬约束：80 ms 档 CER 10.64%，比 480 ms 档高 1.82 个百分点——实时字幕类场景不能直接引用 8.82%。
- 模型卡未给出评测协议细节（无采样温度之外的参数、无样本切分说明、无评委设定），故账本 protocol 仅记 temperature=0.0 与转写延迟，其余键为 null。
- 官方模型仓另有 `assets/bank-take-2.wav` 演示音频（未归档，非评测数据）。
