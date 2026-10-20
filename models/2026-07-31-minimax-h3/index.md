---
vendor: minimax
model: MiniMax H3
release: minimax-h3
date: 2026-07-31
source: https://www.minimax.io/blog/minimax-h3
fetched_at: 2026-10-19
---

# MiniMax H3: An Open Model Breaking the Boundaries Between Tasks and Modalities

## 发布要点（转录）

- MiniMax 官方宣布 H3 正式发布，定位为「通用多模态生成模型」：统一理解文本、图像、视频、音频上下文，生成带**原生立体声**的视频，最长 15 秒、最高 2K 分辨率。
- 官方称 H3 具备行业领先的价格性能：2K 下每秒价格「不到主流模型的三分之一」，768p 下「不到主流模型 720p 价格的一半」——只给相对口径，未给绝对定价数字。
- 核心技术由四部分组成：Contextual Omni Representation（上下文全模态表示）、H3-VAE（自研视频分词器）、H3-Omni Transformer（分离理解/生成负载的训练架构）、H3-In-context Regeneration（模型自身在上下文内重生成低分辨率结果以输出 2K，而非外挂超分模块）。
- H3-VAE 相比前代分词器实现重建质量与可学习性的全面提升，高压缩比带来 **4x 有效序列长度**增益，是原生 2K 分辨率的关键。
- H3-Omni Transformer 分离理解与生成负载分别调优硬件利用率，官方称端到端**训练吞吐提升近 30%**。
- 官方称模型权重「将在未来数日开放」（计划开放，非发布当日已开放）。
- 官方称 H3 早期测试已可商用，擅长指令遵循、文本与品牌渲染准确、V2V 运动迁移，应用于广告、品牌、电商、产品设计、UI/UX 与游戏。
- 官方明确表示完整 H3 技术报告「稍后发布」。

## 评测数据

> 说明：发布页**未给出任何离散基准跑分数值**。页面正文的数值仅出现在工程指标（H3-VAE 4x 有效序列长度、训练吞吐 +30%、captioning 从约 100K token 推理蒸馏到平均约 4K token）与价格相对口径中，均不属于标准公开评测基准。

按「不臆造任何数值」与「图表/无数值一律不记」的账本纪律，本批 `benchmark_evidence` 记 0 行，release 状态为 `pending`。

## 未明示项（账本记 null 的依据）

- 参数量：官方仅称「当前模型规模仍有提升空间」，未给数字。
- 上下文长度：未给。
- 绝对定价：只给与主流模型的相对价格区间，未给每单位价格。
- 权重开放形式（许可证、参数档位）：计划开放，细节未给。

## 归档说明

- `page.html` 为官方研究页 `https://www.minimax.io/blog/minimax-h3` 的原始存档，发布日期取自页面文章头部的印刷日期行 `<time>2026-07-31</time>`。
- `images/h3-hero.png` 为页面首图（官方 CDN `filecdn.minimax.chat` 原始文件）。
- 页面内嵌的演示视频与音频位于官方 CDN（`h3-en-v2-video-*.mp4` / `h3-en-v2-audio-*.mp3`），为演示素材、非评测图表，本批不下载。
