---
vendor: minimax
model: MiniMax Music 3.0
release: minimax-music-3
date: 2026-08-13
source: https://www.minimax.io/blog/minimax-music-3-0-next-generation-open-weights-production-ready-versatile-music-model
fetched_at: 2026-10-21
---

# MiniMax Music 3.0: Next-Generation Open-Weights, Production-Ready & Versatile Music Model

## 发布要点（转录）

- MiniMax 官方发布下一代音乐生成模型 **Music 3.0**，定位为「开放权重、可直接用于生产、兼顾多样曲风的音乐模型」：给定创意概念与可选歌词，模型完成作曲、编曲、演唱与混音，产出完整歌曲。
- 技术架构由三个相互衔接的部件组成：**分词器**、**Hybrid-LM**、**合成栈**，分别回答「音乐信息如何表示」「长程结构与局部细节如何建模」「音频如何重建」。
- **多层 RVQ**：八层残差向量量化分层表示音乐信息。第一层使用 16,384 条目的码本专注于音乐的核心语义与结构，第 2–8 层各用 1,024 条目码本，逐层编码残差声学细节。
- **Hybrid-LM**：8B Global LLM 初始化自 Qwen3.5-8B，逐帧预测语义 token 并建模全局上下文；随机初始化的 0.6B Local LLM 预测帧内声学细节。
- **隐状态融合（Hidden-State Fusion）**：不再把离散声学 token 直接送入解码器，而是把 Global LLM 与 Local LLM 的连续隐状态融合后用于条件化 **2.4B flow matching 模块**，再由 **123M Flow-VAE** 解码音频；官方称这一设计把语言模型的结构理解与声学模型的音频重建直接连通，在保留长程一致性的同时改善局部音质。
- 官方新增**更细粒度的音乐描述框架 Structured Captions**：按时间粒度描述音乐，指定曲风、速度、拍号与调性等，并配合歌词段落标签（[intro]、[verse]、[pre-chorus]、[chorus]、[bridge]、[instrumental]、[solo]、[outro]）定义歌曲宏观结构。
- 官方称新增**模板化 Prompt Enhancement System**：从结构化字幕模板库中挑选语言并套用既有音乐术语与编曲表达。
- 官方称音频质量有实质提升：混音更通透、清晰、均衡，减少拥堵与浑浊；改进覆盖弦乐起弓与运弓、鼓与贝斯的冲击力、密集电子编配中的源分离，以及人声的临场空间感。
- 官方称本代把音乐生成从「生成貌似合理的音频」推进到「实现完整、自洽的创作意图」。

## 评测数据

> 说明：发布页**未给出任何离散基准跑分数值**。页面正文出现的数字均为模型规模与工程指标（16,384 / 1,024 码本条目数、8B Global LLM、0.6B Local LLM、2.4B flow matching 模块、123M Flow-VAE、Qwen3.5-8B 初始化来源），均不属于标准公开评测基准。

按「不臆造任何数值」与「无数值一律不记」的账本纪律，本批 `benchmark_evidence` 记 0 行，release 状态为 `pending`。

页内表格为演示用的「用户 prompt / 歌词 / Demo」对照表，属生成样例而非评测数据，不转录为评测行。

## 未明示项（账本记 null 的依据）

- 上下文长度：未给。
- 绝对定价：未给（发布页只讲创作可用性，未列每单位价格）。
- 权重开放形式（许可证、参数档位）：标题称 Open Weights，但页面未给许可证与参数档位。

## 归档说明

- `page.html` 为官方研究页 `https://www.minimax.io/blog/minimax-music-3-0-next-generation-open-weights-production-ready-versatile-music-model` 的原始存档，发布日期取自页面文章头部的印刷日期行 `<time>2026-08-13</time>`。
- `images/` 为页面全部图片原样下载（官方 CDN 原始文件），共 8 张，供人工复核图表用。
- 页面内嵌的演示音频（Demo）位于官方 CDN，为演示素材、非评测图表，本批不下载。
