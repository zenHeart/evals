---
vendor: stepfun
model: StepAudio 3 Music
release: stepaudio-3-music
date: 2026-09-11
source: https://platform.stepfun.com/docs/zh/guides/models/stepaudio-3-music
fetched_at: 2026-11-16
---

# StepAudio 3 Music

发布日期取官方技术报告 arXiv 2609.16034《StepAudio 3 Music Technical Report》的 published 日期 2026-09-11（官方模型页未印发布日）。

StepAudio 3 Music 是面向长时长音乐创作的大规模生成模型，支持显式音乐规划（以 ABC 记谱产出编曲计划 ABC-CoT）与开放域文本控制，覆盖歌曲创作、纯音乐生成、干声智能配乐与歌曲改编（cover-song synthesis），最长支持 5 分 30 秒。

## 官方明文绝对分值（技术报告摘要）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Artificial Analysis Music Arena Vocals | 1105 | Quality Elo；官方原文：「On the preliminary Artificial Analysis Music Arena Vocals leaderboard, it obtains a Quality Elo of 1105, behind only Suno V5.5 and Mureka」。榜单由 Artificial Analysis 运营，**官方自述为 preliminary（初步）榜单** |

## 只给结论、未公布分值的评测（建行留痕，不填数值）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| AudioBox（Content Enjoyment / Content Usefulness / Production Quality） | — | 官方称三项均取得最高分，但摘要未印任何数值，数值在技术报告 PDF 图表内；本批不做视觉转写 |
| MuQ-MuLan | — | 官方称相似度最高，未印数值 |
| SongBench | — | 官方称「competitive」，未印数值 |

协议字段（harness / 推理强度 / 温度 / 跑次数）官方均未明示，账本一律记 `null`。
