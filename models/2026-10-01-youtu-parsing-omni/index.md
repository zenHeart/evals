---
vendor: tencent
model: Youtu-Parsing-Omni
release: youtu-parsing-omni
date: 2026-10
source: https://huggingface.co/tencent/Youtu-Parsing-Omni
fetched_at: 2026-10-21
---

# Youtu-Parsing-Omni

发布日期证据：官方模型卡的更新日志写明「**[2026-10]** 技术报告、模型权重、vLLM 插件与推理示例一并发布」，页内未印具体日；因此本档日期精度记到月，仓库目录用 `2026-10-01` 前缀排序，实际发布日以官方后续公告为准。

腾讯发布 **Youtu-Parsing-Omni** 文档解析模型，把整页文档（文字、表格、公式、图表）一次性解析成带结构与层级的 JSON 封装：感知层给出版面元素包围盒、文本、LaTeX/OTSL 表格、Markdown 图表、Mermaid 流程图与阅读顺序。

官方明示规格：

| 项 | 值 |
|---|---|
| 参数规模 | 5B |
| 输入 | 文档页（image / document）、单张图表（graphics_chart） |
| 输出 | 布局元素 + 文本 + 公式 + 表格 + 图表 + 阅读顺序的 JSON 封装 |
| 配套 | 技术报告 PDF、vLLM 插件、推理示例、OmniDocBench 评测代码（均为 2026-10 放出） |
| 部署 | 提供 OpenAI 兼容服务端，模型名 `Youtu_Parsing_Omni` |

官方 OmniDocBench v1.6 评测（同一行对照）：

| 模型 | 参数量 | Overall ↑ | Text Edit ↓ | Formula CDM ↑ | Table TEDS ↑ | Table TEDS-S ↑ | Reading Order Edit ↓ |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Youtu-Parsing-Omni** | 5B | **96.96** | 0.0271 | 96.80 | 96.79 | **98.20** | **0.1104** |
| TeleOCR | 1.2B | 96.91 | 0.0267 | 96.59 | **96.82** | 98.18 | 0.1184 |
| OvisOCR2 | 0.8B | 96.47 | **0.0265** | 97.49 | 94.58 | 96.98 | 0.1120 |
| PaddleOCR-VL-1.6 | 0.9B | 96.34 | 0.0326 | **97.53** | 94.76 | 97.10 | 0.1278 |
| MinerU2.5-Pro | 1.2B | 95.75 | 0.0360 | 97.45 | 93.42 | 95.92 | 0.1200 |
| GLM-OCR | 0.9B | 95.22 | 0.0440 | 97.18 | 92.83 | 95.39 | 0.1330 |
| HunyuanOCR-1.5 | 1B | 94.74 | 0.0390 | 94.50 | 93.67 | 94.71 | 0.1290 |
| Gemini-3-Pro | — | 92.91 | 0.0640 | 95.99 | 89.15 | 92.96 | 0.1650 |
| Qwen3-VL-235B | 235B-A22B | 89.78 | 0.0630 | 92.55 | 83.07 | 86.75 | 0.1660 |
| DeepSeek-OCR 2 | 3B | 90.25 | 0.0500 | 91.84 | 83.89 | 87.75 | 0.1440 |
| dots.ocr | 3B | 90.77 | 0.0480 | 89.95 | 87.18 | 90.58 | 0.1380 |

完整 19 行对照已随本档逐行收录到各评测条目。
