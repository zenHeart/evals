---
vendor: glm
model: GLM-4.6V
release: glm-4-6v
date: 2025-12-08
source: https://z.ai/blog/glm-4.6v
fetched_at: 2026-10-22
---

# GLM-4.6V / GLM-4.6V-Flash

发布日期证据：智谱官方发布文 `https://z.ai/blog/glm-4.6v` 页面正文头部印出日期行 `2025-12-08`，正文以 "Today, we officially introduce and open-source the GLM-4.6V series" 宣告开源，构成一级来源的日期证据。官方 GitHub 仓 `zai-org/GLM-V` 的 Project Updates 亦记录该系列（"This open-source repository contains our GLM-4.6V, GLM-4.5V and GLM-4.1V series models"）。

智谱发布 **GLM-4.6V 系列**多模态（VLM）模型，一次放出两个版本：

| 型号 | 定位 | 规模 | 上下文 |
|---|---|---|---|
| GLM-4.6V | 面向云端与高性能集群的基础模型 | 106B（A12B） | 128k |
| GLM-4.6V-Flash | 面向本地部署与低延迟应用的轻量模型 | 9B | 128k |

官方在发布文中的定位与技术要点：

- **原生多模态工具调用（Function Calling）**：图像、截图、文档页可直接作为工具入参传入，无需先转成文字描述；模型可读懂工具返回的搜索结果、统计图表、网页截图或检索到的图片，并纳入推理链。
- **图文交错内容生成**：从论文、报告、幻灯片等多模态输入生成结构化图文交错长文，过程中可自主调用工具裁剪源材料里的关键视觉元素。
- **多模态文档理解**：最长 128K tokens 的多文档 / 长文档输入，直接把版面丰富的页面当图像理解，联合解析文字、版面、图表、表格与公式。
- **前端复刻与视觉编辑**：从 UI 截图重建像素级 HTML/CSS，并支持自然语言驱动的迭代修改。

官方评测图表（`images/fig1-benchmarks.jpg`，原图 10101×7371）是一张**位图**大表：8 个模型列 × 32 项开放权重 LLM 基准，分 6 组（General VQA / Multimodal Reasoning / Multimodal Agentic / Multimodal Long Context / OCR & Chart / Spatial & Grounding）。图中 GLM-4.6V 与 GLM-4.6V-Flash 两列为官方自家模型（蓝色高亮框）。

按账本纪律，图表行一律记 `pending`（数值只存在于像素，未经人工确认不翻 `verified`），下表为视觉转写结果（供人工读图复核）：

| 分组 | 基准 | GLM-4.6V (106B/A12B) | GLM-4.6V-Flash (9B) | GLM-4.5V (106B/A12B) | GLM-4.1V-9B-Thinking | Qwen3-VL-8B-Thinking | Qwen3-VL-235B-A22B-Thinking | Kimi-VL-A3B-Thinking-2506 | Step3 321B (A38B) |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| General VQA | MMBench V1.1 | 88.8 | 86.9 | 88.2 | 85.8 | 84.3* | 90.6 | 84.4 | 81.1* |
| General VQA | MMBench V1.1 (CN) | 88.2 | 85.9 | 88.3 | 84.7 | 83.3* | 87.2* | 80.7* | 81.5* |
| General VQA | MMStar | 75.9 | 74.7 | 75.3 | 72.9 | 75.3 | 78.7 | 70.4 | 69.0* |
| General VQA | BLINK (Val) | 65.5 | 65.5 | 65.3 | 65.1 | 64.7 | 67.1 | 53.5* | 62.7* |
| General VQA | MUIRBENCH | 77.1 | 75.7 | 75.3 | 74.7 | 76.8 | 80.1 | 63.8* | 75.0* |
| Multimodal Reasoning | MMMU (Val) | 76.0 | 71.1 | 75.4 | 68.0 | 74.1 | 80.6 | 64.0 | 74.2 |
| Multimodal Reasoning | MMMU_Pro | 66.0 | 60.6 | 65.2 | 57.1 | 60.4 | 69.3 | 46.3 | 58.6 |
| Multimodal Reasoning | VideoMMMU | 74.7 | 70.1 | 72.4 | 61.0 | 72.8 | 80.0 | 65.2 | / |
| Multimodal Reasoning | MathVista | 85.2 | 82.7 | 84.6 | 80.7 | 81.4 | 85.8 | 80.1 | 79.2* |
| Multimodal Reasoning | AI2D | 88.8 | 89.2 | 88.1 | 87.9 | 84.9 | 89.2 | 81.9* | 83.7* |
| Multimodal Reasoning | DynaMath | 54.5 | 43.7 | 53.9 | 42.5 | 41.1* | 56.5* | 28.1* | 50.1 |
| Multimodal Reasoning | WeMath | 69.8 | 60.0 | 68.8 | 63.8 | 66.5* | 74.5* | 42.0* | 59.8 |
| Multimodal Reasoning | ZeroBench (sub) | 25.8 | 22.5 | 23.4 | 19.2 | - | 27.7 | 16.2* | 23.0 |
| Multimodal Agentic | MMBrowseComp | 7.6 | 7.1 | / | / | 6.9* | 6.7* | / | / |
| Multimodal Agentic | Design2Code | 88.6 | 69.8 | 82.2 | 64.7 | 56.6* | 93.4 | 38.8* | 34.1* |
| Multimodal Agentic | Flame-React-Eval | 86.3 | 78.8 | 82.5 | 72.5 | 56.3* | 73.8* | 36.3* | 63.8* |
| Multimodal Agentic | OSWorld | 37.2 | 21.1 | 35.8 | 14.9 | 33.9 | 38.1 | 8.2 | / |
| Multimodal Agentic | AndroidWorld | 57.0 | 42.7 | 57.0 | 41.7 | 50.0 | / | / | / |
| Multimodal Agentic | WebVoyager | 81.0 | 71.8 | 84.4 | 69.0 | 47.7* | 30.4* | / | / |
| Multimodal Agentic | Webquest-SingleQA | 79.5 | 75.1 | 76.9 | 72.1 | 70.7* | 76.4* | 35.6* | 58.7* |
| Multimodal Agentic | Webquest-MultiQA | 59.0 | 53.4 | 60.6 | 54.7 | 60.3* | 17.3* | 11.1* | 52.8* |
| Multimodal Long Context | MMLongBench-Doc | 54.9 | 53.0 | 44.7 | 42.4 | 48.0 | 56.2 | 42.1 | 31.8* |
| Multimodal Long Context | MMLongBench-128K | 64.1 | 63.4 | / | / | 49.5* | 61.8* | / | / |
| Multimodal Long Context | LVBench | 59.5 | 49.5 | 53.8 | 44.0 | 55.8 | 63.6 | 47.6* | / |
| OCR & Chart | OCRBench | 86.5 | 84.7 | 86.5 | 84.2 | 81.9 | 87.5 | 86.9 | 83.7* |
| OCR & Chart | OCR-Bench_v2 (EN) | 65.1 | 63.5 | 60.8 | 57.4 | 63.9 | 66.8 | / | / |
| OCR & Chart | OCR-Bench_v2 (CN) | 59.6 | 59.5 | 59.0 | 54.6 | 59.2 | 63.5 | / | / |
| OCR & Chart | ChartQAPro | 65.5 | 62.6 | 64.0 | 59.5 | 58.4* | 63.6* | 23.7* | 56.4* |
| OCR & Chart | ChartMuseum | 58.4 | 49.8 | 55.3 | 48.8 | 46.7* | / | 33.6* | 40.0* |
| OCR & Chart | CharXiv_Val-Reasoning | 63.2 | 59.6 | 58.4 | 55.0 | 53.0 | 66.1 | 39.6* | / |
| Spatial & Grounding | OmniSpatial | 52.0 | 50.6 | 51.0 | 47.7 | 51.3* | - | 37.3* | 47.0* |
| Spatial & Grounding | RefCOCO-avg (val) | 88.6 | 85.6 | 91.3 | 85.3 | 89.3* | 92.4 | 33.6* | 20.2* |
| Spatial & Grounding | TreeBench | 51.4 | 45.7 | 50.1 | 37.5 | 34.3* | 50.9 | 41.5* | 41.3* |
| Spatial & Grounding | Ref-L4-test | 88.9 | 87.7 | 89.5 | 86.8 | 88.6* | 90.4 | 51.3* | 12.2* |

图表脚注：`*` 为官方标注的引用自第三方报告的数值（非官方自测）；`/` 表示该列未给出该基准成绩。

未转录区块（说明）：

- 官方发布文正文只给定性论断（"在相近参数规模中视觉理解与推理达到 SoTA"），未印任何明文分数；全部数值均在上述位图大表中。
- 发布文内的能力演示图（文档理解、前端复刻、视觉搜索等示例截图）不是评测数据，未转录。
- 官方 GitHub 仓 `zai-org/GLM-V` 的 Model Overview 另有 GLM-4.5V、GLM-4.1V-9B-Thinking 的说明段落（"SOTA among models of the same scale on 42 public vision-language benchmarks" 等），无数值，同样未转录。
