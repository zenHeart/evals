---
vendor: google
model: EmbeddingGemma 2
release: embeddinggemma-2
date: 2026-10-06
source: https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/
fetched_at: 2026-10-12
---

# EmbeddingGemma 2: an open, lightweight multimodal embedding model

发布日期来自官方博客 October 6, 2026。EmbeddingGemma 2 是基于 Gemma 4 架构开发的轻量级原生多模态嵌入模型，Apache 2.0 协议开源。总参数 740M，支持模块化按需加载（纯文本 270M，可选视觉 170M、音频 300M 编码器），支持 Matryoshka 表示学习（MRL，可动态将 768 维截断至 512/256/128 维），具备 8K 上下文窗口。官方正文报告 MTEB Code 基准得分 78.68（相比前代 68.76 提升 9.92 点）。

| 评测 | 分数 | 备注 |
|---|---|---|
| mteb-code | 78.68 | embeddinggemma-2；MTEB Code 子集；verified；new-benchmark |
