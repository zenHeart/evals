> ## Documentation Index
> Fetch the complete documentation index at: https://platform.stepfun.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# StepAudio 3 TTS

StepAudio 3 TTS 生成贴近真人的自然语音，在音色、语调、节奏和气口停顿上高度还原真实口语表现。[技术报告](https://arxiv.org/abs/2609.12945)｜[语音体验中心](https://www.stepfun.com/studio/audio?tab=tts)

## 模型信息

| 项目 | 内容 |
| :- | :- |
| 模型 ID | `stepaudio-3-tts` |
| 输入 | 文本、音频 |
| 输出 | 语音 |
| 计费 | 2.5 元 / 万字符 |
| 音色克隆 | 9.9 元 / 音色 |

## 核心能力

* **真人级的说话表现**：模型在音色基底、语调层次、节奏律动与气口停顿上高度贴合人类原生口语范式，彻底挣脱机器朗读的生硬桎梏与固化韵律模板。模型还原的不只是字面内容，更是人在说话时的最真实状态——笑声、咂嘴、迟疑、结巴、重复与改口等真人级口语表现，还能根据语义脉络自主推演情绪与语气的微妙变化。听到的始终是“一个人在说话”，而不是“一段被合成的语音”。
* **超低时延流式生成**：依托流式生成架构，一边生成一边输出，无需等待整句合成完成即可开始播放，可无缝对接实时对话业务链路，极大压缩交互等待窗口。

适合实时对话、语音助手和高表现力内容生成。

## API 端点

> [card] [非流式合成](https://platform.stepfun.com/docs/zh/api-reference/audio/create-audio.md)
>
> `POST /v1/audio/speech`

> [card] [流式合成](https://platform.stepfun.com/docs/zh/api-reference/audio/ws-audio.md)
>
> `WebSocket /v1/realtime/audio`

## 相关资源

> [card] [语音大模型概述](https://platform.stepfun.com/docs/zh/guides/models/audio.md)
>
> 返回 Audio 3 系列模型概述。

> [card] [完整定价详情](https://platform.stepfun.com/docs/zh/guides/pricing/details.md)
>
> 查看语音、文本、图像等全部模型的计费规则。

> [card] [音色列表](https://platform.stepfun.com/docs/zh/guides/developer/tts.md#支持音色)
>
> 查看官方提供的音色及参数说明。

> [card] [Demo 与体验中心](https://www.stepfun.com/studio/audio?tab=tts)
>
> 在线快速体验 StepAudio 3 TTS 的完整能力。


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.