---
vendor: qwen
model: Qwen3.8-LiveTranslate
release: qwen3-8-livetranslate
date: 2026-09-18
source: https://qwen.ai/blog?id=qwen3.8-livetranslate
fetched_at: 2026-10-04
---

# Qwen3.8-LiveTranslate：知其人，传其义

发布日期 2026-09-18 来自官方发布页面印刷日 2026/09/18。采用 Hybrid MoE 的 Thinker-Talker 双模块设计与 Interleave 音频-文本交织流。支持 60 种语言输入（文本/音频）与 29 种语音输出。字均延迟（LAAL）从上一代 2.8s 降至 2.3s；在覆盖 14 个语向的 Omnilingua-MSpeaker（忠实度、流畅度、简洁度、DER）和覆盖 70 个语向的 FLEURS（翻译质量、字均延迟、ASR 准确率、TTS 合成质量）上领先，正文未列逐项详细数字，相关评测行记为 pending。

| 评测 | 分数 | 备注 |
|---|---|---|
| laal-latency | 2.3s | qwen3-8-livetranslate；Length-Adaptive Average Lagging (LAAL)；verified |
| omnilingua-mspeaker | —（图表行/未详列数值） | qwen3-8-livetranslate；Omnilingua-MSpeaker (14 language directions)；pending |
| fleurs | —（图表行/未详列数值） | qwen3-8-livetranslate；FLEURS Realtime Translation (70 language directions)；pending |
