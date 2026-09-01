---
vendor: doubao
model: Seed1.8
release: seed-1-8
date: 2025-12
source: https://seed.bytedance.com/en/blog/official-release-of-seed1-8-a-generalized-agentic-model
fetched_at: 2026-09-01
---

# Official Release of Seed1.8: A Generalized Agentic Model

## 评测数据（转录）


### GUI Agent 能力（视觉转写，来源 images/01.png 官方博客对照表）

| Capability | Benchmark | Seed1.8 | Seed1.5-VL | Claude-Sonnet-4.5 | Gemini-2.5-pro | GPT-O3-CUA |
|---|---|---|---|---|---|---|
| Computer Use | OSWorld | 61.9 | 36.7 | 62.9 | 13.3 | 38.1 |
| Browser Use | Realbench | 49.1 | 46.0 | 39.3 | 38.4 | 34.8 |
| Browser Use | Online-Mind2web | 85.9 | 76.4 | - | 69.0 | 61.3 |
| Mobile Use | AndroidWorld | 70.7 | 62.1 | 56.0 | 69.7 | - |

### 搜索与视觉搜索（视觉转写，来源 images/02.png；* 为官方引用外部数字）

| Capability | Benchmark | Seed1.8 | GPT-5-high | Claude-Sonnet-4.5 | Gemini-2.5-pro | Gemini-3-pro |
|---|---|---|---|---|---|---|
| General Agentic Search | BrowseComp-en | 67.6 | 54.9* | 24.1* | 9.9* | 37.8 |
| General Agentic Search | BrowseComp-zh | 81.3 | 63.0* | 42.4* | 34.6 | 51.6 |
| General Agentic Search | GAIA | 87.4 | 76.7 | 66.0 | 57.3 | 74.8 |
| General Agentic Search | WideSearch | 63.8 | 62.2 | 65.7 | 52.6 | 57.0 |
| General Agentic Search | HLE(text-only) | 40.9 | 41.7* | 32.0* | 19.8 | 45.8*1 |
| Visual Search | MM-BrowseComp | 46.3 | 27.7 | - | 7.2 | 25.0 |
| Visual Search | HLE-VL | 31.5 | 24.6 | - | 19.0 | 36.0 |

### Agentic Coding（视觉转写，来源 images/03.png；* 为官方引用外部数字）

| Benchmark | Seed1.8 | GPT-5-high | Claude-Sonnet-4.5 | Gemini-2.5-pro | Gemini-3-pro |
|---|---|---|---|---|---|
| SWE-Bench Verified | 72.9 | 74.9* | 77.2* | 59.6* | 76.2* |
| Multi-SWE-Bench | 42.0 | 41.7 | 44.3* | 20.7 | 42.7 |
| Einstein-SWE-Bench | 36.7 | 35.4 | 33.7 | 19.3 | 42.8 |
| Terminal Bench 2.0 | 45.2 | 35.2* | 42.8* | 32.6* | 54.2* |
| U-Artifacts | 49.2 | 56.8 | 37.3 | 33.4 | 57.8 |

### 经济价值领域任务（视觉转写，来源 images/04.png）

| 领域 | Benchmark | Seed1.8 | GPT-5-high | Claude-Sonnet-4.5 | Gemini-2.5-pro | Gemini-3-pro |
|---|---|---|---|---|---|---|
| Economically Valuable Fields | FinSearchComp (T2 & T3) | 62.8 | 64.5 | 58.6 | 34.0 | 49.9 |
| Economically Valuable Fields | XpertBench - Law | 55.2 | 54.7 | 58.7 | 47.3 | 52.3 |
| Economically Valuable Fields | XpertBench - Fin | 62.0 | 64.5 | 44.5 | 30.3 | 56.1 |
| Economically Valuable Fields | XpertBench - Edu | 47.9 | 56.9 | 44.5 | 47.9 | 49.2 |
| Economically Valuable Fields | XpertBench - Research | 31.4 | 48.2 | 27.5 | 25.5 | 34.9 |
| Economically Valuable Fields | XpertBench - Humanities | 60.2 | 68.5 | 54.9 | 52.3 | 68.2 |
| Economically Valuable Fields | WorldTravel - multi-modal | 47.2 | 45.9 | 41.3 | 36.0 | 47.2 |
| Economically Valuable Fields | WorldTravel - text | 52.1 | 56.4 | 53.3 | 44.5 | 53.3 |

## 协议脚注

- 来源：https://seed.bytedance.com/en/blog/official-release-of-seed1-8-a-generalized-agentic-model（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.png | 2690x922 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjazfhe8.png |  |
| images/02.png | 2690x1415 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjazm9e9.png |  |
| images/03.png | 2690x1078 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjazoh5x.png |  |
| images/04.png | 2690x1595 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjazrscc.png |  |
| images/05.png | 2690x5062 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb02npz.png |  |
| images/06.png | 2690x2012 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb1rshf.png |  |
| images/07.png | 2690x1056 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb1tz3d.png |  |
| images/08.png | 2690x1290 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb210ym.png |  |
| images/09.png | 2690x1810 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb22697.png |  |
| images/10.png | 2690x1335 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb24c2n.png |  |
| images/11.png | 2690x1215 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb25ay6.png |  |
| images/12.png | 2690x1203 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb265o8.png |  |
| images/13.png | 2690x952 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb26xj6.png |  |
| images/14.jpg | 2690x854 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb28cil.png |  |
| images/15.jpg | 2690x913 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjb294t2.png |  |
| images/16.png | 210x211 | https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/deploy/flow/ai_official_website/88329/static/image/new_qr_code.949b4782.png |  |
| images/17.png | 3840x1200 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/banner/footerv3.png | [raw-scan] |
| images/18.jpg | 2784x1380 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/47w9oml4tutby.jpg | [raw-scan] |
| images/19.jpg | 1440x900 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjaxtiy7.jpg | [raw-scan] |
| images/20.jpg | 2784x1380 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/47w9oml4tvixq.jpg | [raw-scan] |
| images/21.jpg | 1440x900 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymji2cxz1.jpg | [raw-scan] |
| images/22.jpg | 1074x1602 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymji2dcdc.jpg | [raw-scan] |
| images/23.jpg | 1440x900 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymji2dkcp.jpg | [raw-scan] |
| images/24.jpg | 1074x1602 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjaxtxxp.jpg | [raw-scan] |
| images/25.jpg | 830x650 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjaxxkpr.jpg | [raw-scan] |
| images/26.jpg | 380x380 | https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/user-upload/4og2ymjaxxbuv.jpg | [raw-scan] |
