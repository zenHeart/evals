---
vendor: kimi
model: Kimi K3
release: kimi-k3
date: 2026-07
source: https://www.kimi.ai/blog/kimi-k3
fetched_at: 2026-09-01
---

# Kimi K3 Tech Blog: Open Frontier Intelligence

## 评测数据（转录）

### Full Benchmark Table（页面内置 JSON 数据逐行转录）

| Benchmark | Metric | Kimi K3 (max) | Claude Fable 5 (max, with fallback) | GPT 5.6 Sol (max) | Claude Opus 4.8 (max) | GPT 5.5 (xhigh) | GLM-5.2 (max) |
|---|---|---|---|---|---|---|---|
| **Coding** |  |   |   |   |   |   |   |
| DeepSWE |  | 67.5 | 70.0 | 73.0 | 59.0 | 67.0 | 46.2 |
| Program Bench |  | 77.8 | 76.8 | 77.6 | 71.9 | 70.8 | 63.7 |
| Terminal Bench 2.1 |  | 88.3 | 84.6 | 88.8 | 84.6 | 83.4 | 82.7 |
| FrontierSWE |  | 81.2 | 86.6 | 71.3 | 66.7 | 64.9 | 67.3 |
| SWE Marathon |  | 42.0 | 35.0 | 39.0 | 40.0 | 14.0 | 13.0 |
| PostTrain Bench |  | 36.6 | 41.4 | 34.6 | 34.1 | 28.4 | 34.3 |
| MLS Bench |  | 48.3 | 49.9 | 46.2 | 42.8 | 35.5 | 40.4 |
| Kimi Code Bench 2.0 (Internal) |  | 72.9 | 76.9 | 64.8 | 71.7 | 69.0 | 64.2 |
| **Agentic** |  |   |   |   |   |   |   |
| GDPval-AA v2 (Elo-score) |  | 1668 | 1760 | 1748 | 1600 | 1494 | 1514 |
| BrowseComp |  | 91.2 | 88.0 | 90.4 | 84.3 | 84.4 | null |
| DeepSearchQA (f1-score) |  | 95.0 | 94.2 | null | 93.1 | null | null |
| Toolathlon-Verified |  | 73.2 | 77.9 | 74.9 | 76.2 | 73.5 | 59.9 |
| MCP Atlas |  | 84.2 | 84.7 | 83.6 | 83.6 | 82.8 | 82.6 |
| Automation Bench |  | 30.8 | 29.1 | 29.7 | 27.2 | 22.7 | 12.9 |
| Job Bench |  | 52.9 | 57.4 | 46.5 | 48.4 | 38.3 | 43.4 |
| AA-Briefcase (Elo-score) |  | 1548 | 1583 | 1495 | 1354 | 1158 | 1260 |
| APEX-Agents |  | 41.0 | 43.3 | 39.9 | 39.4 | 38.5 | 35.6 |
| Office QA Pro |  | 63.3 | 69.9* | 63.2* | 63.9* | 60.9* | 41.4 |
| SpreadsheetBench 2 |  | 34.8 | 34.7* | 32.4* | 31.55* | 29.05* | 28.12 |
| DECK-Bench (Internal) |  | 73.5 | 73.0 | 74.7 | 66.9 | 68.2 | 68.6 |
| **Reasoning & Knowledge** |  |   |   |   |   |   |   |
| GPQA-Diamond |  | 93.5 | 92.6 | 94.1 | 91.0 | 93.5 | 91.2 |
| HLE-Full |  | 43.5 | 53.3 | 44.5 | 49.8* | 41.4* | null |
| HLE-Full w/ tools |  | 56.0 | 63.0 | 58.0 | 57.9* | 52.2* | null |
| **Vision** |  |   |   |   |   |   |   |
| MMMU-Pro |  | 81.6 | 81.2 | 83.0 | 78.9 | 81.2 | null |
| MMMU-Pro w/ python |  | 83.4 | 86.5 | 84.6 | 82.7 | 83.2 | null |
| CharXiv (RQ) |  | 84.8 | 88.9 | 84.6 | 80.5 | 84.1 | null |
| CharXiv (RQ) w/ python |  | 91.3 | 93.5 | 89.1 | 89.9 | 89.0 | null |
| MathVision |  | 94.3 | 94.8 | 95.8 | 86.7 | 92.2 | null |
| MathVision w/ python |  | 97.8 | 98.6 | 97.8 | 97.1 | 96.8 | null |
| BabyVision w/ python |  | 85.7 | 90.5 | 88.9 | 81.2 | 83.6 | null |
| ZeroBench_main (pass@5) |  | 23.0 | 23.0 | 17.0 | 17.0 | 22.0 | null |
| ZeroBench_main w/ python (pass@5) |  | 41.0 | 46.0 | 35.0 | 34.0 | 41.0 | null |
| WorldVQA ForceAnswer |  | 51.0 | 56.7 | 41.8 | 39.1 | 38.5 | null |
| OmniDocBench |  | 91.1 | 89.8 | 85.8 | 87.9 | 89.4 | null |
| PerceptionBench |  | 58.5 | 57.2 | 59.7 | 47.2 | 55.8 | null |

页面脚注要点（备注字段摘录）：
- DeepSWE：Kimi Code
- Program Bench：Kimi Code
- Terminal Bench 2.1：Kimi Code
- FrontierSWE：Dominance as of 26/7/16 · Kimi Code
- SWE Marathon：Claude Code
- PostTrain Bench：Claude Code
- MLS Bench：Kimi Code

## 协议脚注

- 来源：https://www.kimi.ai/blog/kimi-k3（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.webp | 1920x879 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs7176rtp4tqfofnsg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 | Kimi K3 hero visual |
| images/02.webp | 480x220 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs7176rtp4tqfofnsg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_480 | Kimi K3 hero visual [srcset] |
| images/03.webp | 800x366 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs7176rtp4tqfofnsg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_800 | Kimi K3 hero visual [srcset] |
| images/04.webp | 1040x476 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs7176rtp4tqfofnsg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1040 | Kimi K3 hero visual [srcset] |
| images/05.webp | 1440x659 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs7176rtp4tqfofnsg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1440 | Kimi K3 hero visual [srcset] |
| images/06.png | 7110x4308 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chl6mdcmosb3rnlehg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 | Kimi K3 benchmark comparison |
| images/07.webp | 480x291 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chl6mdcmosb3rnlehg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_480 | Kimi K3 benchmark comparison [srcset] |
| images/08.webp | 800x485 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chl6mdcmosb3rnlehg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_800 | Kimi K3 benchmark comparison [srcset] |
| images/09.webp | 1200x727 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chl6mdcmosb3rnlehg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1200 | Kimi K3 benchmark comparison [srcset] |
| images/10.webp | 1600x969 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chl6mdcmosb3rnlehg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1600 | Kimi K3 benchmark comparison [srcset] |
| images/11.png | 7110x4242 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chlgn6rtp4tqfnnmjg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 |  |
| images/12.webp | 480x286 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chlgn6rtp4tqfnnmjg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_480 |  [srcset] |
| images/13.webp | 800x477 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chlgn6rtp4tqfnnmjg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_800 |  [srcset] |
| images/14.webp | 1200x716 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chlgn6rtp4tqfnnmjg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1200 |  [srcset] |
| images/15.webp | 1600x955 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chlgn6rtp4tqfnnmjg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1600 |  [srcset] |
| images/16.png | 7110x5730 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chkpqav1fc645qbcj0?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 | Kimi K3 benchmark comparison |
| images/17.webp | 480x387 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chkpqav1fc645qbcj0?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_480 | Kimi K3 benchmark comparison [srcset] |
| images/18.webp | 800x645 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chkpqav1fc645qbcj0?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_800 | Kimi K3 benchmark comparison [srcset] |
| images/19.webp | 1200x967 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chkpqav1fc645qbcj0?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1200 | Kimi K3 benchmark comparison [srcset] |
| images/20.webp | 1600x1289 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chkpqav1fc645qbcj0?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1600 | Kimi K3 benchmark comparison [srcset] |
| images/21.png | 7110x5722 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chlbnf2ena6205244g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 |  |
| images/22.webp | 480x386 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chlbnf2ena6205244g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_480 |  [srcset] |
| images/23.webp | 800x644 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chlbnf2ena6205244g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_800 |  [srcset] |
| images/24.webp | 1200x966 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chlbnf2ena6205244g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1200 |  [srcset] |
| images/25.webp | 1600x1288 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9chlbnf2ena6205244g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1600 |  [srcset] |
| images/26.webp | 1500x960 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73v6rtp4tqfofoag?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 | Kimi K3 showcase |
| images/27.webp | 480x307 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73v6rtp4tqfofoag?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_480 | Kimi K3 showcase [srcset] |
| images/28.webp | 800x512 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73v6rtp4tqfofoag?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_800 | Kimi K3 showcase [srcset] |
| images/29.webp | 1200x768 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73v6rtp4tqfofoag?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1200 | Kimi K3 showcase [srcset] |
| images/30.webp | 1500x960 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73v6rtp4tqfofoag?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1600 | Kimi K3 showcase [srcset] |
| images/31.jpg | 1500x960 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/1d9cv7rt3v89kkemm3860?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 |  |
| images/32.webp | 480x307 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/1d9cv7rt3v89kkemm3860?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_480 |  [srcset] |
| images/33.webp | 800x512 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/1d9cv7rt3v89kkemm3860?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_800 |  [srcset] |
| images/34.webp | 1200x768 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/1d9cv7rt3v89kkemm3860?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1200 |  [srcset] |
| images/35.webp | 1500x960 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/1d9cv7rt3v89kkemm3860?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1600 |  [srcset] |
| images/36.webp | 1280x819 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73n6rtp4tqfofo9g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 | Kimi K3 showcase |
| images/37.webp | 480x307 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73n6rtp4tqfofo9g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_480 | Kimi K3 showcase [srcset] |
| images/38.webp | 800x512 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73n6rtp4tqfofo9g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_800 | Kimi K3 showcase [srcset] |
| images/39.webp | 1200x768 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73n6rtp4tqfofo9g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1200 | Kimi K3 showcase [srcset] |
| images/40.webp | 1280x819 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73n6rtp4tqfofo9g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1600 | Kimi K3 showcase [srcset] |
| images/41.webp | 1500x960 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73f6rtp4tqfofo7g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 |  |
| images/42.webp | 480x307 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73f6rtp4tqfofo7g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_480 |  [srcset] |
| images/43.webp | 800x512 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73f6rtp4tqfofo7g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_800 |  [srcset] |
| images/44.webp | 1200x768 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73f6rtp4tqfofo7g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1200 |  [srcset] |
| images/45.webp | 1500x960 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs73f6rtp4tqfofo7g?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1600 |  [srcset] |
| images/46.png | 5178x3702 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9cg76vf2ena6204uv80?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 | Internal Knowledge Work Bench |
| images/47.webp | 480x343 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9cg76vf2ena6204uv80?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_480 | Internal Knowledge Work Bench [srcset] |
| images/48.webp | 800x572 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9cg76vf2ena6204uv80?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_800 | Internal Knowledge Work Bench [srcset] |
| images/49.webp | 1200x858 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9cg76vf2ena6204uv80?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1200 | Internal Knowledge Work Bench [srcset] |
| images/50.webp | 1600x1144 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-16/1d9cg76vf2ena6204uv80?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1600 | Internal Knowledge Work Bench [srcset] |
| images/51.webp | 1280x915 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs71f6rtp4tqfofntg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1 |  |
| images/52.webp | 480x343 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs71f6rtp4tqfofntg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_480 |  [srcset] |
| images/53.webp | 800x572 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs71f6rtp4tqfofntg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_800 |  [srcset] |
| images/54.webp | 1200x858 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs71f6rtp4tqfofntg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1200 |  [srcset] |
| images/55.webp | 1280x915 | https://kimi-file.kimi.ai/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs71f6rtp4tqfofntg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1600 |  [srcset] |
