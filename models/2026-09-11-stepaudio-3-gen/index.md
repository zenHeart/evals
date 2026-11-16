---
vendor: stepfun
model: StepAudio 3 Gen
release: stepaudio-3-gen
date: 2026-09-11
source: https://platform.stepfun.com/docs/zh/guides/models/stepaudio-3-gen
fetched_at: 2026-11-16
---

# StepAudio 3 Gen

发布日期取官方技术报告 arXiv 2609.12945《StepAudio 3 Gen Technical Report》的 published 日期 2026-09-11（官方模型页未印发布日）。

StepAudio 3 Gen 是面向综合音频内容创作的生成模型：仅需用自然语言描述角色设定、音色风格与情绪表达即可生成人声，在此基础上支持音效、环境音、背景音乐与歌声生成，并可把各类声音统一编排到同一段音频中。官方产品页在「评测表现」一节给出盲测 Elo 明文数值，正文段落与配图 alt 文本口径一致。

## 官方明文绝对分值（产品页正文段落 + 配图 alt 文本）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Chinese Human-Likeness Arena（TTS） | 1755.3 | Elo；官方正文：「在盲测两两对比评估中，StepAudio 3 Gen 在 TTS 与 Voice Design 两项任务上，分别以 1755.3 和 1668.5 的 Elo 分数位列图示参评模型第一」。配图 `assets/tts-elo-chinese.png` 的 alt 文本补充：图示 6 个参评模型中第一，领先次优 211.1 分；与 5 个对手 500 局对阵 410 胜 / 39 平 / 51 负 |
| Chinese Human-Likeness Arena — 总体胜率 | 82.0% | 胜率，分母含平局；同上页正文 |
| Voice Design Arena | 1668.5 | Elo；配图 `assets/vd-arena.png` 的 alt 文本补充：图示 5 个参评模型中第一，领先次优 97.0 分；与 4 个对手共 196 局（每对手 49 局）148 胜 / 9 平 / 39 负 |
| Voice Design Arena — 总体胜率 | 75.5% | 胜率，分母含平局；同上页正文 |

逐对手胜率（TTS：Qwen 73%、StepAudio 2.5 TTS 78%、豆包 79%、Inworld 90%、MiniMax 90%；Voice Design：Qwen3-TTS-VD 65.3%、MOSS-VoiceGenerator 71.4%、Ming-omni-tts-0.5B 79.6%、VoiceSculptor 85.7%）只在配图 alt 文本中以竞品名给出，**本批不单独建行**。

技术报告摘要另称「achieves state-of-the-art performance on both TTS and voice design」但未给绝对分值，与产品页的 Elo 同源，已由上表覆盖。

协议字段（harness / 推理强度 / 温度 / 跑次数）官方均未明示，账本一律记 `null`。
