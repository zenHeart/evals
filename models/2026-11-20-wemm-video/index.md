---
vendor: tencent
model: WeMM-Video 家族（2B / 4B / 9B / 35B-A3B）
release: wemm-video
date: 2026-11-20
source: https://huggingface.co/tencent/WeMM-Video-35BA3B
fetched_at: 2026-11-25
---

# WeMM-Video 家族（腾讯官方模型卡证据归档）

发布日期证据链：官方 GitHub 仓 Tencent/WeMM-Video README 印刷日期「The model license covers the WeMM-Video collection as of November 20, 2026.」；官方 Hugging Face papers 页对 arXiv 2611.26409 标注「Published on Nov 19」；arXiv v1 提交时间 2026-11-19T16:58:15Z；官方模型仓 createdAt 2026-11-17（发布前预置）。三个候选日期同处窗口内，取官方 README 印刷日 2026-11-20 为发布日，`date_precision=day`。

- 官方模型卡（旗舰档）：https://huggingface.co/tencent/WeMM-Video-35BA3B （`model-card.md`）
- 官方代码仓：https://github.com/Tencent/WeMM-Video （`github-readme.md`）
- 官方技术报告：https://arxiv.org/abs/2611.26409

## 官方定位（原文要点）

- 「WeMM-Video-35B-A3B is the mixture-of-experts (35B total, 3B active) checkpoint in the WeMM-Video family. WeMM-Video is a Chinese–English bilingual family for joint audio-visual understanding and reasoning. It accepts text, images, audio and video inputs.」
- 官方摘要称在超过 120 项基准上评测；官方模型卡称该家族在开源全模态视频理解上确立新的开源状态。

## 规格

| 型号 | 架构 | 权重格式 |
|---|---|---|
| WeMM-Video-2B | 2B dense | Apache-2.0 |
| WeMM-Video-4B | 4B dense | Apache-2.0 |
| WeMM-Video-9B | 9B dense | Apache-2.0 |
| WeMM-Video-35B-A3B | 35B 总参数 / 约 3B 激活（MoE） | Apache-2.0 |

## 评测转录表（官方结果图柱标签，人工视觉转写）

图一 `images/wemm-video-benchmarks.png`（WeMM-Video-35B-A3B vs Qwen3-Omni-Instruct / Qwen3.5-Omni-Flash / Seed2.0-Mini-0428 / Gemini-3.0-Flash）：

| 基准 | 类别 | WeMM-Video-35B-A3B |
|---|---|---|
| Video-MME | 视频理解 | 86.4 |
| Video-MME-v2 | 视频理解 | 54.9 |
| Daily-Omni | 音视频理解 | 83.4 |
| WorldSense | 音视频理解 | 62.7 |
| AVUT Human | 以音频为中心的视频理解 | 85.9 |
| AV-SpeakerBench | 音视频语音理解 | 72.6 |
| OmniCompass-AV | 音视频定位与理解 | 46.3 |
| Video-Holmes | 音视频推理 | 63.4 |
| OmniVideoBench | 音视频推理 | 55.3 |
| OmniReasoningBench | 音视频推理 | 45.4 |
| LVBench | 长视频理解 | 71.6 |
| LVOmniBench | 长音视频理解 | 52.6 |
| MMOU (test-mini) | 长音视频推理 | 74.5 |
| CrossVid | 多视频理解 | 50.2 |
| AVHBench | 跨模态幻觉 | 80.0 |
| TimeLens | 视频时序定位 | 60.1 |
| OmniCap-IF ISR | 音视频描述生成 | 23.6 |
| DVD-Bench (En) | 对话中心音视频描述生成 | 79.1 |
| OmniVChat | 音视频对话 | 48.9 |
| O-IN-Bench | 口语意图理解 | 49.0 |

图二 `images/wemm_index_audio.png`（WeMM-Video-35B-A3B vs WeMM-Video-9B vs MiniCPM-o 4.5-9B vs Qwen3-Omni-30B-A3B-Instruct vs Qwen3.5-Omni-Flash）：

| 基准 | 类别 | WeMM-Video-35B-A3B | WeMM-Video-9B |
|---|---|---|---|
| MMAU-Pro | 通用音频理解 | 70.6 | 70.9 |
| MMAR | 通用音频理解 | 73.6 | 72.8 |
| MMSU | 通用音频理解 | 76.0 | 76.8 |
| RUL-MuchoMusic | 音乐理解 | 57.4 | 57.2 |
| MusTBench | 音乐理解 | 46.6 | 42.0 |

## 限制

- 逐基准成绩全部以位图给出，本批只做视觉转写并记 pending，不翻 verified。
- 官方模型卡未印上下文长度（vLLM 部署示例中的 `--max-model-len 8192` 属部署建议，不是模型规格声明），context_window 留 null。
- 官方未印 temperature / top_p / 运行次数，protocol 对应字段一律 null。
- 4B 与 2B 两档在官方结果图中未单独给出成绩，本批未为其建行。
