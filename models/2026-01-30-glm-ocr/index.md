---
vendor: glm
model: GLM-OCR
release: glm-ocr
date: 2026-01-30
source: https://huggingface.co/zai-org/GLM-OCR
fetched_at: 2026-10-22
---

# GLM-OCR

发布日期证据：智谱官方 Hugging Face 模型仓 `zai-org/GLM-OCR`（模型权重与官方模型卡）创建于 **2026-01-30**，模型卡即该系列的官方发布载体；官方 GitHub 仓 `zai-org/GLM-OCR` 的 News & Updates 首条为 2026.2.12（GLM-OCR 微调教程），说明模型在 2026-02-12 之前已公开；官方技术报告 arXiv:2603.10910（GLM-OCR Technical Report）提交日为 2026-03-11，官方仓 News 记 2026.3.12「技术报告上线」。权重首次公开日与技术报告日不同，本档以权重与模型卡上线日 2026-01-30 为发布日。

智谱发布 **GLM-OCR**：面向复杂文档理解的多模态 OCR 模型，建在 GLM-V 编码器-解码器架构上。

官方明示规格（模型卡 + 技术报告）：

| 项 | 值 |
|---|---|
| 参数量 | 0.9B（技术报告：0.4B CogViT 视觉编码器 + 0.5B GLM 语言解码器） |
| 架构 | GLM-V encoder–decoder；MTP（Multi-Token Prediction）损失 + 稳定全任务强化学习 |
| 流水线 | 两阶段：PP-DocLayout-V3 版面分析 → 并行区域识别 |
| 部署 | vLLM / SGLang / Ollama / Transformers；官方 SDK 集成 PP-DocLayoutV3 |
| 许可 | MIT（开源权重与 SDK） |
| 语言 | zh / en / fr / es / ru / de / ja / ko |

官方模型卡正文明文的评测结论（**散文明文，可核验**）：

- "Achieves a score of **94.62** on OmniDocBench V1.5, **ranking #1 overall**"；并在公式识别、表格识别、信息抽取等主要文档理解基准上给出 SOTA 级表现。
- 工程指标（非基准分）：PDF 文档解析吞吐 1.86 pages/second、图像 0.67 images/second（相同硬件、单副本单并发条件下的方法对比）。

模型卡 `## Performance` 一节的成绩全部在**位图**中（`images/fig1-docparse.png`、`images/fig2-realworld.png`），按纪律记 `pending`，下表为视觉转写结果（供人工读图复核）：

公共基准（图 1，Document Parsing & Information Extraction）：

| 基准 | GLM-OCR | PaddleOCR-VL-1.5 | Deepseek-OCR2 | MinerU2.5 | dots.ocr | Gemini-3-Pro | GPT-5.2-20-25-12-11 |
|---|---:|---:|---:|---:|---:|---:|---:|
| OmniDocBench v1.5 | 94.6 | 94.5 | 91.1 | 90.7 | 88.4 | 90.3 | 85.4 |
| OCRBench (Text) | 94.0 | 75.3 | 34.7 | 75.3 | 92.1 | 91.9 | 83.7 |
| UniMERNet | 96.5 | 96.1 | 85.8 | 96.4 | 90.0 | 96.4 | 90.5 |
| PubTabNet | 85.2 | 84.6 | – | 88.4 | 71.0 | 91.4 | 84.4 |
| TEDS_TEST | 86.0 | 83.3 | – | 85.4 | 62.4 | 81.8 | 67.6 |
| Nanonets-KIE | 93.7 | – | – | – | – | 95.2 | 87.5 |
| Handwritten-Forms | 86.1 | – | – | – | – | 94.5 | 78.2 |

官方真实场景自建集（图 2，Real-World Scenarios Performance）：

| 场景 | GLM-OCR | PaddleOCR-VL-1.5 | Deepseek-OCR2 | MinerU2.5 | dots.ocr | Gemini-3-Pro | GPT-5.2-20-25-12-11 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Code | 84.7 | 75.8 | 82.1 | 82.9 | 80.8 | 86.9 | 84.4 |
| Real-world Table | 91.5 | 86.1 | – | 70.8 | 81.8 | 90.6 | 86.7 |
| Handwriting | 87.0 | 87.4 | 73.8 | 54.2 | 71.7 | 90.0 | 78.0 |
| Multi-language | 69.3 | 54.8 | 56.1 | 27.8 | 65.1 | 86.2 | 70.1 |
| Seal | 90.5 | 42.2 | 40.4 | – | 63.0 | 91.3 | 58.8 |
| Receipt (KIE) | 94.5 | – | – | – | – | 97.3 | 83.5 |

图表列注：前五列为「Specialized VLM」（专业 OCR 视觉语言模型），后两列为「General VLM」（通用视觉语言模型）；`–` 表示该列未给出成绩。

未转录区块（说明）：

- `images/fig3-speed.png` 为解析吞吐对比图（工程指标，非基准分），只作归档，不转录为评测行。
- 官方模型卡的其余内容为 SDK 用法、prompt 模板、部署说明与示例，不含额外评测数值。
