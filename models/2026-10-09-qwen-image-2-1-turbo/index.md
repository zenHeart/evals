---
vendor: qwen
model: Qwen-Image-2.1-Turbo
release: qwen-image-2-1-turbo
date: 2026-10-09
source: https://github.com/QwenLM/Qwen-Image-2.1
fetched_at: 2026-10-21
---

# Qwen-Image-2.1-Turbo

发布日期证据：官方 GitHub 仓 QwenLM/Qwen-Image-2.1 的 README 更新日志逐条写明「**2026.10.09**: We released Qwen-Image-2.1-Turbo for image generation and editing in just 8 denoising steps」，同日「Qwen-Image-2.1 Pro and Turbo APIs are now officially live!」。官方 Hugging Face 模型仓 Qwen/Qwen-Image-2.1-Turbo 的创建时间同为 2026-10-09。

阿里发布 **Qwen-Image-2.1-Turbo**，是已入库的 Qwen-Image-2.1 的加速 checkpoint：沿用同一套 7B 视觉生成架构，把文生图与图像编辑的去噪步数压到 8 步，权重自带推荐采样表，Diffusers 通过 `QwenImage21Pipeline` 直接加载。

官方明示规格：

| 项 | 值 |
|---|---|
| 架构 | 与 Qwen-Image-2.1 相同的 7B 视觉生成架构 |
| 去噪步数 | 8 步（自带推荐采样表） |
| 默认采样 | CFG=1；前缀 KV 缓存跨去噪步复用文本与参考图上下文 |
| 能力 | 文生图 + 图像编辑 |
| 加载方式 | Diffusers `QwenImage21Pipeline`（需支持管线级采样 sigma 的 Diffusers 版本） |
| 默认分辨率 | 与 Qwen-Image-2.1 一致，为 2048 分辨率档 |
| API | Model Studio 的 Qwen-Image-2.1 Pro / Turbo API 已同步上线 |

官方本次发布未随附评测数值表：GitHub README 与 Hugging Face 模型卡均只给出规格、加载方式与使用示例，未印基准分数与对照表。
