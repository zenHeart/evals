---
vendor: meta
model: Muse Realtime Avatar
release: muse-realtime-avatar
date: 2026-09-23
source: https://research.meta.ai/blog/bringing-your-muse-to-life
fetched_at: 2026-10-04
---

# Bringing your muse to life

发布日期 2026-09-23 来自页面 JSON-LD 结构化数据 datePublished 2026-09-23。基于语音 token 流、参考媒体和滚动视频隐变量窗口条件的因果 Diffusion Transformer 架构，双向蒸馏由 120 次评估压缩至 2 次函数评估（60x 减幅）。输出规格 448x768 竖屏 25fps，端到端首字节延迟约 870ms。真人评测（2-3 分钟实时对话）整体偏好度相对 Runway Characters 为 78%:22%，相对 HeyGen LiveAvatar 为 88%:12%，在面部表现力、动作自然度、唇形同步、角色保持等维度领先。

| 评测 | 分数 | 备注 |
|---|---|---|
| human-preference-avatar | 78% | muse-realtime-avatar；Live Evaluation vs Runway Characters；verified |
| human-preference-avatar | 88% | muse-realtime-avatar；Live Evaluation vs HeyGen LiveAvatar；verified |
| avatar-stream-latency | 870ms | muse-realtime-avatar；End-of-turn to first-byte latency；verified |
