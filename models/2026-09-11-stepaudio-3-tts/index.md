---
vendor: stepfun
model: StepAudio 3 TTS
release: stepaudio-3-tts
date: 2026-09-11
source: https://platform.stepfun.com/docs/zh/guides/models/stepaudio-3-tts
fetched_at: 2026-11-16
---

# StepAudio 3 TTS

发布日期取官方技术报告 arXiv 2609.12945《StepAudio 3 Gen Technical Report》的 published 日期 2026-09-11——官方 TTS 模型页直接链该报告作为「技术报告」，且报告摘要明确覆盖 zero-shot TTS 能力（官方模型页未印发布日）。

StepAudio 3 TTS 生成贴近真人的自然语音，在音色、语调、节奏和气口停顿上高度还原真实口语表现；依托流式生成架构一边生成一边输出，可无缝对接实时对话链路。官方模型页另列音色克隆与音色设计能力。

## 评测数值

本条**没有官方明文绝对分值**：官方 TTS 模型页与技术报告摘要均未给出 StepAudio 3 TTS 的独立分值。TTS 赛道的盲测 Elo（1755.3）由官方产品在 **StepAudio 3 Gen** 名下公布，已记于 release `stepaudio-3-gen`，不重复计入本条。按「无数值不臆造」口径，本条 0 条 evidence、release 级 status 记 `pending`。

协议字段（harness / 推理强度 / 温度 / 跑次数）官方均未明示，账本一律记 `null`。
