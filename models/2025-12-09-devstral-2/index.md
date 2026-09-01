---
vendor: mistral
model: Devstral 2 / Devstral Small 2
release: devstral-2
date: 2025-12-09
source: https://mistral.ai/news/devstral-2-vibe-cli/
fetched_at: 2026-09-01
---

# Introducing: Devstral 2 and Mistral Vibe CLI.

## 评测数据（转录）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| SWE-bench Verified | 72.2% | Devstral 2（123B，页面正文） |
| SWE-bench Verified | 68.0% | Devstral Small 2（24B，页面正文） |
| 人工评测 vs DeepSeek V3.2 胜率 | 42.8% | Devstral 2（页面正文，Cline 脚手架） |
| 人工评测 vs DeepSeek V3.2 负率 | 28.6% | Devstral 2（页面正文，Cline 脚手架） |
| 真实任务成本效率 | 7x（至多） | Devstral 2（页面正文："Up to 7x more cost-efficient than Claude Sonnet at real-world tasks"） |
| SWE-bench Verified | 73.1% | DeepSeek V3.2（开源对照，视觉转写，images/15.webp） |
| SWE-bench Verified | 71.3% | Kimi K2 thinking（开源对照，视觉转写，images/15.webp） |
| SWE-bench Verified | 69.6% | Qwen3 coder plus（开源对照，视觉转写，images/15.webp） |
| SWE-bench Verified | 69.4% | MiniMax M2（开源对照，视觉转写，images/15.webp） |
| SWE-bench Verified | 68.0% | GLM 4.6（开源对照，视觉转写，images/15.webp） |
| SWE-bench Verified | 62.4% | GPT-OSS-120B（开源对照，视觉转写，images/15.webp） |
| SWE-bench Verified | 53.9% | CWM（开源对照，视觉转写，images/15.webp） |
| SWE-bench Verified | 42.2% | DeepSWE（开源对照，视觉转写，images/15.webp） |
| SWE-bench Verified | 70.8% | Grok Code Fast 1（专有对照，视觉转写，images/15.webp） |
| SWE-bench Verified | 76.2% | Gemini 3 Pro（专有对照，视觉转写，images/15.webp） |
| SWE-bench Verified | 77.9% | GPT 5.1 Codex Max（专有对照，视觉转写，images/15.webp） |
| SWE-bench Verified | 77.2% | Claude 4.5 Sonnet（专有对照，视觉转写，images/15.webp） |
| 人工评测 vs DeepSeek V3.2 平局率 | 28.6% | Devstral 2（视觉转写，images/19.webp） |
| 人工评测 vs Claude Sonnet 4.5 胜率 | 21.4% | Devstral 2（视觉转写，images/19.webp） |
| 人工评测 vs Claude Sonnet 4.5 平局率 | 25.5% | Devstral 2（视觉转写，images/19.webp） |
| 人工评测 vs Claude Sonnet 4.5 负率 | 53.1% | Devstral 2（视觉转写，images/19.webp） |
| SWE-bench Verified（性能-参数规模散点） | — | 页面仅定性呈现，图表无数值标签：Devstral 2 / Devstral Small 2 与 MiniMax M2、Qwen3 coder plus、GLM 4.6、DeepSeek v3.2、Kimi K2 thinking、Qwen 3 coder flash、CWM 的分数-模型规模对比（视觉转写，images/17.webp） |

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 192x192 | 原URL: https://mistral.ai/_astro/ai-app_LCReD.webp
- images/02.webp — 192x192 | 原URL: https://mistral.ai/_astro/ai-app_Z2q9iqE.webp
- images/03.webp — 144x144 | 原URL: https://mistral.ai/_astro/logo-forge_Z1mQhkS.webp
- images/04.webp — 144x144 | 原URL: https://mistral.ai/_astro/logo-forge_ZFCTMS.webp
- images/05.webp — 120x120 | 原URL: https://mistral.ai/_astro/vibe_Z20p2OU.webp
- images/06.webp — 120x120 | 原URL: https://mistral.ai/_astro/vibe_19h78z.webp
- images/07.webp — 144x144 | 原URL: https://mistral.ai/_astro/logo-vibe-code_drDoK.webp
- images/08.webp — 144x144 | 原URL: https://mistral.ai/_astro/logo-vibe-code_ZmCjpX.webp
- images/09.webp — 120x120 | 原URL: https://mistral.ai/_astro/logo-compute_ZDL3ab.webp
- images/10.webp — 120x120 | 原URL: https://mistral.ai/_astro/logo-compute_Z1P9afi.webp
- images/11.webp — 1440x800 | 原URL: https://mistral.ai/_astro/Cover-Model-Devstral_1Ib6un.webp
- images/12.webp — 1440x800 | 原URL: https://mistral.ai/_astro/Cover-Model-Devstral_ZBwVBT.webp
- images/13.webp — 1800x1074 | 原URL: https://mistral.ai/_astro/Thumbnail-Model-Devstral_Z1f1Srg.webp
- images/14.webp — 1800x1074 | 原URL: https://mistral.ai/_astro/Thumbnail-Model-Devstral_29tnJz.webp
- images/15.webp — 1686x1093 | alt='Devstral   Swe Bench Verified  Open Weights Vs Proprietary Models (light) (1)' | 原URL: https://mistral.ai/_astro/9c36eef1-2b4c-4fb8-8ef0-d531116ec53a_1fQRlC.webp
- images/16.webp — 1686x1093 | 原URL: https://mistral.ai/_astro/9c36eef1-2b4c-4fb8-8ef0-d531116ec53a_1P2Y1J.webp
- images/17.webp — 1686x969 | alt='Devstral   Swe Bench Verified Regular Performance X Modelsize (light)' | 原URL: https://mistral.ai/_astro/49e0d71c-436c-4334-9fff-fa68c9f60380_Z1z9fFe.webp
- images/18.webp — 1686x969 | 原URL: https://mistral.ai/_astro/49e0d71c-436c-4334-9fff-fa68c9f60380_1S4vKf.webp
- images/19.webp — 1371x670 | alt='Devstral   Model Performance Comparison (light) (1)' | 原URL: https://mistral.ai/_astro/48b2b0fc-f8d8-44da-a3a2-4961aad2f10e_1mMVCG.webp
- images/20.webp — 1371x670 | 原URL: https://mistral.ai/_astro/48b2b0fc-f8d8-44da-a3a2-4961aad2f10e_1htA3b.webp
- images/21.jpg — 1800x1074 | 原URL: https://mistral.ai/cms-media/api/media/file/Thumbnail-Model-Devstral.jpg
