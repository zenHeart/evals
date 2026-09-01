---
vendor: minimax
model: MiniMax-M3
release: minimax-m3
date: 2026-06-01
source: https://www.minimax.io/blog/minimax-m3
fetched_at: 2026-09-01
---

# MiniMax M3: Frontier Coding, 1M Context, Native Multimodality — All in One Model - MiniMax Research

## 评测数据（转录）


### 十项基准对照（视觉转写，来源 images/12.png 官方对比图；空缺为图中无该模型柱）

| Benchmark | MiniMax M3 | Claude Opus 4.7 | GPT 5.5 | Gemini 3.1 Pro |
|---|---|---|---|---|
| SWE Bench Pro | 59.0 | 64.3 | 58.6 | 54.2 |
| Terminal Bench 2.1 | 66.0 | 66.1 | 78.2 | 70.0 |
| VIBE V2 | 50.1 | 55.8 | 50.5 | 28 |
| SVG-Bench | 63.7 | 62.3 | 58.2 | 59.2 |
| KernelBench Hard | 28.8 | 30.7 | 20.9 | 18.6 |
| BrowseComp | 83.5 | 79.3 | 84.4 | 85.9 |
| GDPval rubrics | 74.7 | 79.8 | 80.6 | 57.8 |
| BankerToolBench | 76.1 | 81.3 | 70.0 | 67.0 |
| MCP Atlas | 74.2 | 77 | 75.3 | 69.2 |
| OSWorld-verified | 75.2 | 82.8 | 78.7 | 76.2 |

## 协议脚注

- 来源：https://www.minimax.io/blog/minimax-m3（official primary_sources[0]）
- 抓取时间：2026-09-01；快照方式：curl 直存
- 数值转录规则：页面 HTML 文本表格为逐行转录；从图片读出的数值标注（视觉转写）。
- 原始抓取元数据（含每张图原始 URL/尺寸/字节与下载失败清单）见同目录 manifest.json。

## 图片清单

| 文件 | 尺寸 | 原始 URL | 说明 |
|---|---|---|---|
| images/01.webp | 384x88 | https://www.minimax.io/_next/image?url=https%3A%2F%2Ffilecdn.minimax.chat%2Fpublic%2F969d635c-cab6-45cc-8d61-47c9fe40c81f.png%3Fx-oss-process%3Dimage%2Fformat%2Cwebp&w=384&q=75 | MiniMax |
| images/02.webp | 256x59 | https://www.minimax.io/_next/image?url=https%3A%2F%2Ffilecdn.minimax.chat%2Fpublic%2F969d635c-cab6-45cc-8d61-47c9fe40c81f.png%3Fx-oss-process%3Dimage%2Fformat%2Cwebp&w=256&q=75 | MiniMax [srcset] |
| images/03.webp | 32x32 | https://www.minimax.io/_next/image?url=https%3A%2F%2Ffilecdn.minimax.chat%2Fpublic%2F00874e9c-ad34-4f9f-8537-47e535ec2691.png&w=32&q=75 | LLM |
| images/04.webp | 16x16 | https://www.minimax.io/_next/image?url=https%3A%2F%2Ffilecdn.minimax.chat%2Fpublic%2F00874e9c-ad34-4f9f-8537-47e535ec2691.png&w=16&q=75 | LLM [srcset] |
| images/05.webp | 32x32 | https://www.minimax.io/_next/image?url=https%3A%2F%2Ffilecdn.minimax.chat%2Fpublic%2F0f112b95-97b8-4e67-9ef9-e1b869e8342d.png&w=32&q=75 | VIDEO |
| images/06.webp | 16x16 | https://www.minimax.io/_next/image?url=https%3A%2F%2Ffilecdn.minimax.chat%2Fpublic%2F0f112b95-97b8-4e67-9ef9-e1b869e8342d.png&w=16&q=75 | VIDEO [srcset] |
| images/07.webp | 32x32 | https://www.minimax.io/_next/image?url=https%3A%2F%2Ffilecdn.minimax.chat%2Fpublic%2Fd01e8064-2baf-4c26-adc8-53e9dfaa252d.png&w=32&q=75 | SPEECH & MUSIC |
| images/08.webp | 16x16 | https://www.minimax.io/_next/image?url=https%3A%2F%2Ffilecdn.minimax.chat%2Fpublic%2Fd01e8064-2baf-4c26-adc8-53e9dfaa252d.png&w=16&q=75 | SPEECH & MUSIC [srcset] |
| images/09.webp | 32x32 | https://www.minimax.io/_next/image?url=https%3A%2F%2Ffilecdn.minimax.chat%2Fpublic%2F0052eccd-8fbd-485b-9007-3d6ef1a80a76.png&w=32&q=75 | Intelligence with everyone |
| images/10.webp | 16x16 | https://www.minimax.io/_next/image?url=https%3A%2F%2Ffilecdn.minimax.chat%2Fpublic%2F0052eccd-8fbd-485b-9007-3d6ef1a80a76.png&w=16&q=75 | Intelligence with everyone [srcset] |
| images/11.webp | 128x29 | https://www.minimax.io/_next/image?url=https%3A%2F%2Ffilecdn.minimax.chat%2Fpublic%2F969d635c-cab6-45cc-8d61-47c9fe40c81f.png%3Fx-oss-process%3Dimage%2Fformat%2Cwebp&w=128&q=75 | MiniMax [srcset] |
| images/12.png | 1904x881 | https://filecdn.minimax.chat/public/20260619-222405-1781879125997.png |  |
| images/13.png | 1280x718 | https://filecdn.minimax.chat/public/m3-msa-arch.png |  |
| images/14.png | 1280x603 | https://filecdn.minimax.chat/public/m3-paper-repro.png |  |
| images/15.gif | 1680x900 | https://filecdn.minimax.chat/public/m3-cuda-perf.gif |  |
| images/16.gif | 1400x660 | https://filecdn.minimax.chat/public/m3-posttrain-bench.gif |  |
| images/17.png | 2422x1144 | https://filecdn.minimax.chat/public/m3-token-plan-2.png |  |
| images/18.jpg | 1920x841 | https://filecdn.minimax.chat/public/20260601-101138-1780280144441.jpeg |  |
| images/19.jpg | 2584x3766 | https://filecdn.minimax.chat/public/img_v3_02128_b7726cd8-879a-4b7a-a9da-db4395ea597g-1780272508686.jpg |  |
| images/20.png | 2619x1200 | https://file.cdn.minimax.io/public/11649e5b-3f76-477e-a73d-2abc4882211c.png | [og/twitter] |
