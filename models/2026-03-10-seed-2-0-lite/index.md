---
vendor: doubao
model: Seed 2.0-Lite
release: seed-2-0-lite
date: 2026-03-10
source: https://seed.bytedance.com/en/seed2
fetched_at: 2026-09-01
---

# Seed2.0 系列官方产品页（Pro / Lite / Mini）

## 评测数据（转录）


说明：以下 5 张表均转录自官方产品页 /en/seed2 的页面文本表格（非图片）。seed-2-0-lite 对应列 Seed2.0 Lite（0428）；seed-2-0-mini 对应列 Seed2.0 Mini（0215）（仅视频表含该列）。

### 表 1 文本能力（页面文本表格逐行转录）

| Capability | Benchmark | Seed2.0 Lite（0428） | Seed2.0 Lite（0215） | Seed2.0 Pro（0215） | GPT-5.4 Mini | Gemini 3 Flash |
|---|---|---|---|---|---|---|
| Knowledge | GPQA Diamond | 88.4% | 85.1% | 88.9% | 88.0% | 90.7% |
| Knowledge | SuperGPQA | 69.6% | 67.5% | 68.7% | 63.9% | 72.7% |
| Knowledge | HLE (no tool, text only) | 25.7% | 28.2% | 32.4% | 28.2% | 31.7% |
| Reasoning | BeyondAIME | 79.0% | 76.0% | 86.5% | 80.0% | 82.0% |
| Reasoning | FrontierSci-olympiad | 72.0% | 70.0% | 74.0% | 70.0% | 73.0% |
| Reasoning | Superchem (text-only) | 55.0% | 48.0% | 51.6% | 29.1% | 54.4% |
| Reasoning | BABE | 57.9% | 50.2% | 53.5% | 49.0% | 55.2% |
| Instruction Following | CL-Bench | 20.1% | 20.0% | 20.8% | 14.9% | 16.1% |
| Instruction Following | MultiChallenge | 69.9% | 63.2% | 68.3% | 62.5% | 69.3% |
| SearchAgent | WideSearch | 70.3% | 74.5% | 74.7% | 73.0% | 64.0% |
| SearchAgent | BrowseComp | 64.0% | 72.1% | 77.3% | 61.3% | 41.5% |
| SearchAgent | ResearchRubrics | 59.2% | 50.8% | 50.7% | 47.1% | 36.9% |
| SearchAgent | XPert Bench | 56.8% | 63.3% | 64.5% | 41.8% | 50.1% |
| Real World | SkillsBench | 43.7% | 42.1% | 42.3% | 45.4% | 26.4% |
| Real World | GDPval | 53.1% | 47.3% | 54.4% | 50.6% | 13.7% |
| Real World | FinSearchComp | 63.8% | 65.1% | 70.2% | 61.8% | 43.7% |
| Real World | Tob-Agent | 51.4% | 45.2% | 52.6% | 43.0% | 37.4% |
| CodingAgent | SWE Multilingual | 66.6% | 64.4% | 71.7% | 73.6% | 71.1% |
| CodingAgent | SWE-Bench Pro | 46.6% | 46.0% | 46.9% | 54.4% | 46.7% |
| CodingAgent | NL2Repo-Bench | 28.7% | 24.6% | 27.9% | 37.3% | 27.6% |
| CodingAgent | PaperBench | 52.5% | 54.6% | 53.8% | 49.1% | 33.9% |
| CodingAgent | Terminal Bench 2.0 | 43.3% | 45.0% | 55.8% | 60.0% | 60.0% |
| CodingAgent | Vibe Coding 人工评估 | 49.4% | 48.7% | 48.4% | 57.4% | 56.9% |

### 表 2 多模态理解（页面文本表格逐行转录）

| Capability | Benchmark | Seed2.0 Lite（0428） | Seed2.0 Lite（0215） | Seed2.0 Pro（0215） | GPT-5.4 High | Gemini 3 Flash | Gemini 3.1 Pro High |
|---|---|---|---|---|---|---|---|
| STEM | MathVision | 89.8 | 86.4 | 88.8 | 90.6 | 87.5 | 89.0 |
| STEM | MMMU_Pro | 78.4 | 76.0 | 78.2 | 79.2 | 80.4 | 82.5 |
| STEM | HiPhO | 83.8 | 72.5 | 74.1 | 84.3 | 78.0 | 86.6 |
| STEM | MedXpertQA-MM | 79.6 | 64.0 | 68.1 | 76.9 | 78.0 | 80.2 |
| Perception | BabyVision | 64.7 | 57.5 | 60.6 | 53.4 | 47.2 | 54.4 |
| Perception | VLMBias | 80.6 | 74.8 | 77.4 | 42.8 | 66.1 | 73.5 |
| Visual Knowledge | SimpleVQA | 72.7 | 67.2 | 71.4 | 56.0 | 68.4 | 70.5 |
| Visual Knowledge | WorldVQA | 50.2 | 44.0 | 49.9 | 30.2 | 46.5 | 44.4 |
| InfoGraphics | CharXiv-DQ | 94.5 | 93.3 | 93.5 | 94.1 | 94.0 | 94.9 |
| InfoGraphics | CharXiv-RQ | 82.4 | 79.9 | 80.5 | 82.6 | 79.7 | 84.0 |
| Embodied | ERQA | 71.5 | 65.8 | 68.5 | 64.5 | 65.8 | 70.8 |

### 表 3 GUI / Mobile（页面文本表格逐行转录）

| Capability | Benchmark | Seed2.0 Lite（0428） | Seed1.8 | Claude Opus 4.7 | Claude Sonnet 4.6 | Claude Sonnet 4.5 | GPT-5.4 High | Gemini 3.1 Pro |
|---|---|---|---|---|---|---|---|---|
| GUI | OSWorld-Verfied | 64.4% | 61.9% | 78.0% | 72.5% | 62.9% | 75.0% | 64.0% |
| GUI | MobileWorld | 64.6% | 52.1% | 56.4% | - | 47.8% | - | 57.3% |

### 表 4 视频理解（页面文本表格逐行转录；* 为官方标注口径，(3.1Pro) 表示该数取自 Gemini 3.1 Pro）

| Capability | Benchmark | Seed2.0 Lite（0428） | Seed2.0 Lite（0215） | Seed2.0 Pro（0215） | Seed2.0 Mini（0215） | Gemini 3 Pro High | Gemini 3 Flash High |
|---|---|---|---|---|---|---|---|
| Video Knowledge | VideoMMMU | 88.3 | 84.1 | 86.9 | 80.6 | 87.6* | 88.1 |
| Video Knowledge | MMVU | 76.7 | 75.0 | 78.2 | 69.0 | 76.3 | 77.9 |
| Video Knowledge | VideoSimpleQA-v2 | 69.0 | 65.0 | 71.5 | 64.9 | - | - |
| Video Knowledge | VideoSimpleQA | 71.7 | 66.6 | 71.9 | 67.7 | 72.4 | 70.0 |
| Video Knowledge | SciVideo | 70.3 | 51.4 | 52.3 | 35.3 | - | 74.1 |
| Video Reasoning | VideoReasonBench | 59.4 | 64.2 | 77.8 | 40.5 | 59.5 | 61.2 |
| Video Reasoning | VideoHolmes | 67.4 | 63.8 | 67.4 | 58.6 | 64.2 | 65.6 |
| Video Reasoning | Minerva | 68.5 | 63.8 | 66.5 | 54.7 | 65.0 | 64.4 |
| Motion & Perception | TVBench | 80.4 | 71.5 | 75.0 | 70.5 | 71.1 | 69.6 |
| Motion & Perception | TOMATO | 72.5 | 57.3 | 59.9 | 47.4 | 55.8 | 60.8 |
| Motion & Perception | EgoTempo | 68.4 | 61.8 | 71.8 | 67.2 | 65.4 | 58.4 |
| Motion & Perception | MotionBench | 72.4 | 70.9 | 75.2 | 65.1 | 70.3 | 68.9 |
| Motion & Perception | ContPhy | 62.4 | 56.1 | 67.4 | 55.9 | 61.1 | 62.0 |
| Motion & Perception | Morese-500 | 34.6 | 32.2 | 37.4 | 32.2 | 33.0 | 32.4 |
| Long Video | VideoMME | 89.0 | 87.7 | 89.5 | 81.2 | 88.4* | 85.2 |
| Long Video | VideoMMEv2 | 64.9 | - | 60.5* | - | 66.1* | 61.1* |
| Long Video | CGBench | 65.5 | 59.3 | 65.0 | - | 65.5 | 65.3 |
| Long Video | LongVideoBench | 79.0 | 77.3 | 80.3 | 74.8 | 78.2 | 74.5 |
| Long Video | LVBench | 76.4 | 73.0 | 76.4 | 66.6 | - | - |
| Long Video | VideoEval-Pro | 49.5 | 44.3 | 47.3 | 43.7 | - | 51.9 |
| Streaming Video | OVBench | 63.2 | 65.5 | 69.2 | 60.1 | 63.5 | 59.2 |
| Streaming Video | ODVBench | 66.0 | 69.6 | 72.5 | 65.1 | 63.6 | 56.7 |
| Streaming Video | LiveSports-3K | 78.1 | 77.8 | 78.0 | 73.3 | 74.5 | 73.2 |
| Streaming Video | OVOBench | 75.4 | 76.7 | 77.0 | 70.4 | 70.1 | 68.7 |
| Streaming Video | ViSpeak | 87.0 | 84.0 | 78.5 | 77.5 | 89.0 | 88.0 |
| Multi-video | CrossVid | 63.7 | 57.7 | 61.0 | 58.6 | 53.0 | 48.7 |
| Visual-Audio Understanding | OmniVideoBench | 61.7 | 44.5 | 49.5 | 40.8 | 61.4(3.1Pro) | - |
| Visual-Audio Understanding | AVMeme | 69.5 | 60.6 | 61.2 | 50.7 | 77.3(3.1Pro) | - |
| Visual-Audio Understanding | JointAVBench | 69.5 | 56.7 | 62.3 | 52.7 | - | - |
| Visual-Audio Understanding | WorldSense | 67.3 | 57.0 | 57.0 | 52.7 | 65.5(3.1Pro) | - |

### 表 5 音频理解（页面文本表格逐行转录；ASR 为 WER/CER，越低越好）

| Capability | Benchmark | Seed2.0 Lite（0428） | Gemini-3.1-Pro |
|---|---|---|---|
| Audio Understanding | MMSU | 86.54 | 85.94 |
| Audio Understanding | WildSpeech | 75.81 | 75.41 |
| ASR | WenetSpeech test-net | 4.47 | 9.52 |
| ASR | WenetSpeech test-meeting | 5.31 | 12.80 |
| ASR | Librispeech test-clean | 1.07 | 1.94 |
| ASR | Librispeech test-other | 2.17 | 3.60 |
| S2TT | Fleurs(15 langs)(zh/en<->xx) | 74.70 | 73.14 |

## 协议脚注

- 来源：https://seed.bytedance.com/en/seed2（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 926x778 | https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/deploy/flow/ai_official_website/88329/static/image/pro2_en.4666d5b6.png |  |
| images/02.png | 884x424 | https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/deploy/flow/ai_official_website/88329/static/image/lite5_en.384c2e1e.png |  |
| images/03.png | 804x788 | https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/deploy/flow/ai_official_website/88329/static/image/lite2_en.f8842268.png |  |
| images/04.png | 901x780 | https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/deploy/flow/ai_official_website/88329/static/image/lite3_en.43630df6.png |  |
| images/05.png | 912x710 | https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/deploy/flow/ai_official_website/88329/static/image/lite4_en.9bc638da.png |  |
| images/06.png | 904x384 | https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/deploy/flow/ai_official_website/88329/static/image/mini2_en.c31eeb34.png |  |
| images/07.png | 546x244 | https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/deploy/flow/ai_official_website/88329/static/image/mini3_en.706bc60e.png |  |
| images/08.png | 584x306 | https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/deploy/flow/ai_official_website/88329/static/image/mini4_en.393912f4.png |  |
| images/09.png | 458x232 | https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/deploy/flow/ai_official_website/88329/static/image/mini5_en.4f9b8ecf.png |  |
| images/10.png | 210x211 | https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/deploy/flow/ai_official_website/88329/static/image/new_qr_code.949b4782.png |  |
| images/11.png | 3840x1200 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/banner/footerv3.png | [raw-scan] |
| images/12.png | 60x60 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2/0.png | [raw-scan] |
| images/13.png | 60x60 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2/1.png | [raw-scan] |
| images/14.png | 60x60 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2/3.png | [raw-scan] |
| images/15.png | 60x60 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2/2.png | [raw-scan] |
| images/16.png | 60x60 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2/4.png | [raw-scan] |
| images/17.png | 3840x6697 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2/img2code.png | [raw-scan] |
| images/18.png | 1312x1086 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2/case3.png | [raw-scan] |
| images/19.gif | 1772x1170 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2/20260211211234_rec_.gif | [raw-scan] |
