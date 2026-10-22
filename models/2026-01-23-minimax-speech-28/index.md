---
vendor: minimax
model: MiniMax Speech 2.8
release: minimax-speech-28
date: 2026-01-23
source: https://www.minimax.io/news/minimax-speech-28
fetched_at: 2026-10-21
---

# MiniMax Speech 2.8: Breathing life into AI voice

## 发布要点（转录）

- MiniMax 官方发布语音合成模型 **Speech 2.8**，官方定位为「让 AI 声音更像真人」的版本：引入原生拟声标签、高保真克隆与录音室级清晰度。
- **还原细微差别（Native Sound Tags）**：建模 “um”“uh”“ah” 等口语填充词，保留真实对话的自然节奏、音高与停顿，官方称合成语音不再显得平板冰冷。
- **声音克隆**：优化特征提取流程，仅需 **10 秒**样本即可捕捉说话者独有的音色纹理、气声与情绪特质并复刻，官方称结果是「听起来像你，就是你」。
- **真实会话感**：官方强调克隆结果具备“生活过的质感”，不是僵硬播报腔，而像坐下来聊天的可信朋友。
- **纯音频（Pure Audio）**：新增能力以消除背景噪声与数字伪影，官方称输出达到录音室级清晰度。
- 页面以 Original Audio 与 Speech-2.8 Cloned Result 的试听对照展示克隆效果。

## 评测数据

> 说明：发布页**未给出任何离散基准跑分数值**。页面正文出现的数字仅为功能演示参数（10 秒克隆样本时长），不构成标准公开评测基准。

按「不臆造任何数值」与「无数值一律不记」的账本纪律，本批 `benchmark_evidence` 记 0 行，release 状态为 `pending`。

页内 “Original Audio / Cloned Result” 为人耳试听演示对照，不是客观评测分数，按纪律不转录为评测行；官方全文亦未给出 WER/CER 等可量化指标。

## 未明示项（账本记 null 的依据）

- 参数量：未给。
- 上下文长度：未给。
- 绝对定价：未给。

## 归档说明

- `page.html` 为官方新闻页 `https://www.minimax.io/news/minimax-speech-28` 的原始存档，发布日期取自页面文章头部的印刷日期行 “2026.1.23”。
- `images/` 为页面全部图片原样下载（官方 CDN 原始文件），共 6 张，供人工复核用。
- 页面内嵌的试听音频（Original Audio / Cloned Result）位于官方 CDN，为演示素材、非评测图表，本批不下载。
