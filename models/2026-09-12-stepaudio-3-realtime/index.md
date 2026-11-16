---
vendor: stepfun
model: StepAudio 3 Realtime
release: stepaudio-3-realtime
date: 2026-09-12
source: https://platform.stepfun.com/docs/zh/guides/models/stepaudio-3-realtime
fetched_at: 2026-11-16
---

# StepAudio 3 Realtime

发布日期取官方技术报告 arXiv 2609.14005《StepAudio 3 Realtime Technical Report》的 published 日期 2026-09-12（官方模型页未印发布日；该报告 v3 更新于 2026-10-12，发布日仍取首次 published 日期）。

StepAudio 3 Realtime 是阶跃星辰面向实时互动场景的旗舰语音模型，围绕「边听边说边想」（Think-While-Speaking）循环组织：Deep Perception 捕捉声学线索，Seamless Duplex 处理停顿、附和与打断，推理模式（reasoning mode）下可执行私有推理并与语音输出并行，另有内置 Voice Agent 异步执行工具而不打断对话。

## 官方明文绝对分值（技术报告摘要）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| StepAudioChat | 73.0 | 宏平均（macro average）；官方原文：「In reasoning mode, StepAudio 3 reaches a 73.0 macro average on StepAudioChat」——**推理模式口径**，厂商自建集 |
| MMSU | 90.6 | 官方原文：「an exceptional 90.6 on the MMSU benchmark」 |
| Artificial Analysis Full-Duplex Bench | 98.9 | 行名口径 **Overall**；官方原文：「98.9 Overall on the Artificial Analysis Full-Duplex Bench」；榜单由 Artificial Analysis 运营 |
| τ-Voice | 56.0% | 宏平均任务成功率（macro task-success rate）；官方原文：「a 56.0% macro task-success rate on τ-Voice」 |

官方模型页另说明：`stepaudio-3-realtime-preview` 与 `stepaudio-3-chat-preview` 是**限免期间**的模型名，限免到期后预览版本下线并新增正式付费版本。

协议字段（harness / 推理强度 / 温度 / 跑次数）官方均未明示，账本一律记 `null`；StepAudioChat 一行仅能记明「reasoning mode」这一条件，落在 `benchmark_variant` 与 notes 里。
