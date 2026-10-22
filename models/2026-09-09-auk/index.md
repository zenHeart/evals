---
vendor: tencent
model: AuK
release: auk
date: 2026-09-09
source: https://huggingface.co/tencent/AuK
fetched_at: 2026-10-22
---

# AuK / AuK-Flash

发布日期证据：腾讯混元官方 Hugging Face 模型卡 `tencent/AuK` 的 News 首条印出 **[2026/09/09] "AuK is now open-source. Code and model weights are publicly available"**，同日官方 GitHub 仓 `Tencent-Hunyuan/AuK` 与官方技术报告 arXiv:2609.08936（*AuK Technical Report: An Open-Source Foundational Model for Speech Generation and Editing*，提交日 2026-09-08）互证，构成一级来源的日期证据。

腾讯混元发布 **AuK**：面向语音生成与编辑的开放权重基础模型，用统一的自然语言指令接口覆盖多类语音任务。

官方明示规格（模型卡 + 官方仓 README + 技术报告）：

| 项 | 值 |
|---|---|
| 参数量 | 1.5B（基础模型） |
| 变体 | AuK（base，EMA 后训练，质量优先）；AuK-Flash（任务路由蒸馏，4 步推理） |
| 覆盖任务 | 零样本 TTS、指令 TTS、内容编辑、声学编辑、韵律/副语言编辑、语音增强、源分离 |
| 训练规模 | 约 30.3 亿条指令-音频样本、195 万小时有效监督，覆盖 5 类任务族 |
| 架构 | 多模态大模型语义条件 + 联合训练 VAE 声学条件 + 混合整流流 Transformer（MMDiT 双流 → DiT 单流） |
| 解码 | Euler 求解器，AuK 32 步（FE 32）、AuK-Flash 4 步（FE 44），AuK-Flash 相对 4.5× 墙钟加速 |
| 采样率 | 24 kHz；VAE 潜空间 64 维 / 50 Hz |
| 许可 | MIT |

官方技术报告（arXiv:2609.08936）正文表格为 **HTML 真表（可机读）**，数值逐行转录如下。

语音生成（Table：Generation Ability，Seed-TTS-Eval，WER↓ 越低越好 / SIM↑ 越高越好）：

| 模型 | WER en | WER zh | WER zh-hard | WER avg | SIM avg |
|---|---:|---:|---:|---:|---:|
| Qwen3-TTS（前代 SOTA） | 1.23 | 1.22 | 6.76 | 3.07 | 0.745 |
| Seed-TTS | 2.25 | 1.12 | 7.59 | 3.65 | 0.778 |
| VoxCPM2 | 1.84 | 0.97 | 8.13 | 3.65 | 0.767 |
| **AuK-Flash** | 1.03 | 1.10 | 6.43 | 2.85 | 0.790 |
| **AuK** | 1.02 | 1.02 | 5.91 | **2.65** | **0.795** |

指令 TTS（InstructTTSEval，ACC↑）：

| 模型 | DSD-ZH | DSD-EN |
|---|---:|---:|
| Qwen3-TTS-VD | 81.10 | 82.40 |
| Mimo-Audio | 74.30 | 77.60 |
| MOSS-VoiceGenerator | 80.00 | 82.00 |
| **AuK-Flash** | 78.80 | 82.40 |
| **AuK** | **83.37** | 81.60 |

通用语音编辑（MMAE(Speech)，IFR↑ / CR↑ / EMR↑）：

| 模型 | IFR | CR | EMR |
|---|---:|---:|---:|
| Step-Audio-EditX | 43.52 | 77.27 | 4.69 |
| Ming-UniAudio | 34.13 | 76.01 | 7.04 |
| MMEdit* | 30.52 | 35.40 | 0.99 |
| Audio-Omni* | 43.14 | 68.29 | 1.98 |
| SmartDJ*（w/o planner） | 28.03 | 56.22 | 2.97 |
| SmartDJ*（w/ planner） | 32.17 | 43.00 | 0.99 |
| **AuK-Flash** | 46.62 | 86.41 | **13.85** |
| **AuK** | **48.23** | **88.11** | 12.44 |

语音编辑（SpeechEditBench，ACC↑；Content / Emotion / Prosody / Paralinguistic / Acoustic）：

| 模型 | Content | Emotion | Prosody | Paralinguistic | Acoustic |
|---|---:|---:|---:|---:|---:|
| Ming-UniAudio | 76.46 | 3.43 | 26.50 | 11.25 | 25.85 |
| Step-Audio-EditX | 16.50 | 7.71 | 20.13 | 31.25 | 22.89 |
| **AuK-Flash** | 87.50 | 6.29 | 70.00 | **39.25** | 30.26 |
| **AuK** | **91.83** | 9.94 | **71.33** | 38.50 | **37.07** |

语音增强（DNS Challenge，DNSMOS-OVRL↑ / UTMOS↑ / dWER↓ / SIM↑）：

| 模型 | DNSMOS-OVRL | UTMOS | dWER | SIM |
|---|---:|---:|---:|---:|
| SAM-Audio-Large | 3.29 | 3.78 | 9.67 | 0.96 |
| AnyEnhance | 3.41 | 3.76 | 7.71 | 0.98 |
| RE-USE | 3.38 | 3.69 | 3.31 | 0.98 |
| **AuK-Flash** | 3.38 | 4.05 | 2.93 | 0.99 |
| **AuK** | **3.35** | 3.86 | **2.66** | 0.99 |

语音增强（CHiME-4，DNSMOS-OVRL↑ / UTMOS↑ / WER↓）：

| 模型 | DNSMOS-OVRL | UTMOS | WER |
|---|---:|---:|---:|
| SAM-Audio-Large | 3.14 | 3.38 | 17.30 |
| AnyEnhance | 3.19 | 3.24 | 27.41 |
| RE-USE | 3.33 | 3.44 | 10.71 |
| **AuK-Flash** | 3.35 | 3.91 | 7.84 |
| **AuK** | 3.28 | 3.72 | 7.98 |

语音增强（Libri2Mix，DNSMOS-OVRL↑ / UTMOS↑ / WER↓ / SIM↑）：

| 模型 | DNSMOS-OVRL | UTMOS | WER | SIM |
|---|---:|---:|---:|---:|
| MossFormer2-SS | 3.24 | 3.66 | 9.34 | 0.96 |
| SAM-Audio-Large | 2.87 | 2.84 | 57.22 | 0.86 |
| Sidon (Dialogue) | 3.08 | 2.61 | 51.79 | 0.87 |
| **AuK-Flash** | 3.32 | 4.03 | 10.07 | 0.96 |
| **AuK** | 3.28 | 3.87 | 9.12 | 0.96 |

语音增强（VCTKSR，AudioSR，DNSMOS-OVRL↑ / UTMOS↑ / WER↓ / SIM↑）：

| 模型 | DNSMOS-OVRL | UTMOS | WER | SIM |
|---|---:|---:|---:|---:|
| Resemble-Enhance | 3.08 | 3.13 | 4.72 | 0.92 |
| **AuK-Flash** | 3.25 | 4.05 | 2.92 | 0.96 |
| **AuK** | 3.21 | 3.93 | 3.06 | 0.97 |

表注：`*` 为官方标注的复现他人方法的结果。

未转录区块（说明）：

- 官方 GitHub 仓 README 的 `## Performance` 用一张位图（`images/fig1-performance.png`）呈现与上述技术报告表格同源的分数；本档以技术报告的 HTML 真表为转写依据（可机读），该位图仅作归档留证。
- 技术报告中用于推导训练/评测流程的公式表（Table 1–18 为数学公式排版）不是评测数据，未转录。
- 官方模型卡的其余内容为安装、推理、推理加速、微调与 ComfyUI / Gradio 集成说明，不含额外评测数值。
