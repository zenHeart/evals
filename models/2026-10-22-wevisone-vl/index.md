---
vendor: tencent
model: WeVisOne-VL
release: wevisone-vl
date: 2026-10-22
source: https://github.com/Tencent/WeVisOne-VL
fetched_at: 2026-10-23
---

# WeVisOne-VL

发布日期证据：Hugging Face 官方模型仓 `tencent/WeVisOne-VL-4B` / `tencent/WeVisOne-VL-2B` 的 `createdAt` 均为 2026-10-22；官方 GitHub 仓 `Tencent/WeVisOne-VL` 的 `created_at` 为 2026-10-22T08:58:16Z；技术报告 arXiv:2610.31329 同属 2026-10。来源：https://github.com/Tencent/WeVisOne-VL

腾讯微信视觉团队（WeChat Vision）发布 **WeVisOne-VL**，一个把**目标级感知**（检测、指代定位、计数、指向、OCR）与**像素级感知**（指代分割、可提示 alpha 抠图）统一进同一个视觉语言基础模型的架构。官方定位为「All-in-One」：单个模型同时输出框、点、掩码与 alpha，且用 9.6M 参数的轻量像素解码器直接输出全分辨率掩码 / alpha，不需要外接 SAM。

官方明示规格：

| 项 | 值 |
|---|---|
| 权重尺寸 | 2B / 4B 两档（官方模型仓 `WeVisOne-VL-2B` / `WeVisOne-VL-4B`） |
| 像素解码器 | 9.6M 参数轻量解码器，输出全分辨率掩码与 alpha |
| 统一任务形式 | 坐标 token `<0>`…`<1000>`；目标不存在时输出 `None`；框后接 `<OBJ>` token |
| 数据引擎 | 知识图谱驱动的标注引擎，官方称标注超过 1 亿张图像 |
| 评测协议 | F1 取 IoU 0.5:0.95 平均；贪心解码；每图 ≤1,960 视觉 token |
| 授权 | Apache License 2.0 |

官方「Performance at a Glance」表（对照该基准最强开源基线，WeVisOne-VL-4B）：

| 任务 | 评测 | 指标 | 最强基线 | WeVisOne-VL-4B |
|---|---|---|---:|---:|
| Detection | LVIS | F1 Mean ↑ | 50.7 | **55.3** |
| Dense Detection | Dense200 | F1 Mean ↑ | 58.7 | **71.3** |
| Referring | RefCOCOg test | F1 Mean ↑ | 77.6 | **81.8** |
| Rejection | WeRef-Bench | Rej. Rate ↑ | 73.0 | **96.4** |
| Counting | PixMo-Count test | Acc ↑ | 82.8 | **89.6** |
| Pointing | PointBench | Acc ↑ | 69.9 | **71.9** |
| OCR | TotalText | F1 Mean ↑ | 43.3 | **52.0** |
| Referring Seg. | ReasonSeg val | gIoU ↑ | 65.0 | **71.2** |
| Box Matting | P3M-500-NP | MAD ↓ | 15.4 | **7.3** |
| Text Matting | WeRefMat (Referring) | MAD ↓ | 22.4 | **9.8** |

官方完整评测表逐行转录（每表只取自家模型列，竞品列见账本各行 notes）：

### Object Detection (F1 Mean)

| Method | COCO | LVIS | Dense200 | VisDrone |
|---|---|---|---|---|
| GroundingDINO-T | 56.6 | 38.8 | 33.1 | 38.5 |
| Qwen3-VL-8B | 47.8 | 42.9 | 13.8 | 29.5 |
| Qwen3.5-9B | 49.5 | 43.7 | 18.0 | 31.3 |
| Rex-Omni-3B | 52.9 | 46.9 | 58.3 | 35.8 |
| LocateAnything-3B | 54.7 | 50.7 | 58.7 | 39.9 |
| **WeVisOne-VL-2B** | 55.2 | 53.3 | 61.4 | 40.4 |
| **WeVisOne-VL-4B** | **57.1** | **55.3** | **71.3** | **44.7** |

### Referring Object Detection (F1 Mean / Rejection Rate %)

| Method | RefCOCOg test | RefCOCOg Rej | WeRef Mean | WeRef Rej | HumanRef | Ref-L4 |
|---|---|---|---|---|---|---|
| Qwen3-VL-8B | 74.9 | 22.5 | 36.7 | 18.3 | 71.6 | 72.4 |
| Qwen3.5-9B | 74.6 | 15.2 | 50.7 | 70.7 | 77.8 | 72.0 |
| Rex-Omni-3B | 74.3 | 0.5 | 50.3 | 43.3 | 79.9 | 65.2 |
| LocateAnything-3B | 77.6 | 0.6 | 51.7 | 73.0 | 78.7 | 74.3 |
| **WeVisOne-VL-2B** | 78.2 | 50.2 | 73.2 | 92.9 | 77.4 | 75.1 |
| **WeVisOne-VL-4B** | **81.8** | **67.4** | **78.7** | **96.4** | **80.7** | **78.1** |

### Object Counting (Exact-match Accuracy %)

| Method | CountQA | PixMo-Count test | CLOC test | KubriCount testB | MixCount test |
|---|---|---|---|---|---|
| Qwen3.5-9B | 41.6 | 80.4 | 22.4 | 19.1 | 7.0 |
| Rex-Omni-3B | 37.6 | 71.9 | 22.3 | 18.8 | 11.4 |
| LocateAnything-3B | 52.4 | 82.8 | 23.9 | 22.4 | 15.2 |
| **WeVisOne-VL-2B** | 47.9 | 88.1 | 26.9 | 32.4 | 32.2 |
| **WeVisOne-VL-4B** | **57.1** | **89.6** | **28.3** | **40.1** | **40.4** |

### Object Pointing

| Method | PointBench | PixMo-Points | COCO | LVIS | Dense200 | VisDrone |
|---|---|---|---|---|---|---|
| Qwen3-VL-8B | 62.5 | 72.2 | 77.5 | 67.7 | 42.2 | 46.4 |
| Rex-Omni-3B | 69.9 | 72.9 | 80.5 | 70.8 | 82.5 | 58.9 |
| LocateAnything-3B | 56.9 | 68.6 | 83.9 | 76.6 | **87.6** | 60.4 |
| **WeVisOne-VL-2B** | 62.9 | 73.2 | **85.8** | 78.9 | 83.2 | 62.4 |
| **WeVisOne-VL-4B** | **71.9** | **74.7** | 85.4 | **79.5** | 87.0 | **64.4** |

### OCR — Text Grounding & Recognition (F1 Mean)

| Method | HierText | ICDAR2015 | TotalText | SROIE |
|---|---|---|---|---|
| PP-OCRv5 (specialist) | 30.5 | 25.6 | 25.7 | 58.6 |
| Qwen3-VL-8B | 25.7 | 27.1 | 35.4 | 43.3 |
| Rex-Omni-3B | 28.0 | 28.1 | 40.6 | 44.8 |
| LocateAnything-3B | 29.4 | 24.1 | 43.3 | 40.3 |
| **WeVisOne-VL-2B** | 30.5 | 42.6 | 42.5 | 62.1 |
| **WeVisOne-VL-4B** | **39.0** | **47.8** | **52.0** | **68.1** |

### Referring Segmentation (cIoU; ReasonSeg uses gIoU)

| Method | RefCOCO testA | RefCOCO+ testA | RefCOCOg test | ReasonSeg val | Ref-ZOM cIoU | Ref-ZOM Rej |
|---|---|---|---|---|---|---|
| LISA-13B (ft) | 78.8 | 70.2 | 70.5 | 65.0 | - | - |
| GSVA-7B | 78.9 | 69.6 | 73.3 | 50.5 | 66.6 | 41.9 |
| UniPixel-7B | 83.0 | 80.1 | 77.1 | 60.5 | 62.9 | 0.3 |
| Youtu-VL-4B | 82.0 | 79.6 | 76.6 | - | 61.0 | 1.3 |
| **WeVisOne-VL-2B** | 82.9 | 79.0 | 74.9 | 60.9 | **73.4** | 62.4 |
| **WeVisOne-VL-4B** | **84.5** | **81.1** | **77.8** | **71.2** | 72.2 | **86.0** |

### Promptable Matting (MAD ×10³ ↓)

| Method | P3M-500-NP (Box) | AM-2K (Box) | PPM-100 (Box) | WeRefMat (Category) | WeRefMat (Referring) |
|---|---|---|---|---|---|
| Matte Anything | 24.4 | 13.2 | 10.5 | - | - |
| SAM2-Matting (SAM3) | 15.4 | 12.1 | 10.8 | 70.8 | 51.9 |
| Qwen3.5-9B + SAM2-Matting | - | - | - | 77.8 | 22.4 |
| **WeVisOne-VL-2B** | **6.6** | 5.7 | **5.3** | 17.7 | 15.8 |
| **WeVisOne-VL-4B** | 7.3 | **5.0** | 6.1 | **16.4** | **9.8** |

未转录说明：官方原表中的 `-` 表示该项该方法未报告，按抽取口径不转录数值；其余内容为用法与部署说明，非评测内容。
