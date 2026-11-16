> ## Documentation Index
> Fetch the complete documentation index at: https://platform.stepfun.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# StepAudio 3 ASR

StepAudio 3 ASR 系列提供高准确率、低延迟的语音转写能力。

StepAudio 3 ASR Max 是阶跃星辰迄今规模最大的 ASR 模型，以大语言模型为语义底座，将高精度声学建模与大语言模型的上下文理解、知识储备和推理能力深度融合，让语音识别从“辨认声音”进一步走向“理解语境”。[语音体验中心](https://www.stepfun.com/studio/audio?tab=speech-recognition)

## 模型信息

| 项目 | 内容 |
| :- | :- |
| 输入 | 音频 |
| 输出 | 增量与最终文本 |
| 协议 | HTTP + SSE |
| 计费 | 2.8 元 / 小时 |

## 核心能力

* **语境理解**：结合音频信号、上下文关系和领域知识，提升人名、地名、药品名、技术术语和同音词等复杂内容的识别准确率。
* **跨语言、跨场景识别**：覆盖中文、英文、方言、中英混说、长音频和垂类领域等场景，相较上一代模型均有提升。
* **专业领域识别**：在体育、医药、化工、汽车、法律、金融、编程开发等 20+ 垂类场景中，能够结合领域知识理解专业表达。
* **复杂声音处理**：支持悄悄话、极快语速、含糊连读、拖沓发音、环境噪声、歌唱和背景音乐等真实世界音频。
* **歌曲与歌声转写**：支持处理清唱、伴奏演唱等复杂歌声场景，直接转写歌曲内容。
* **低误识别**：无语音测试准确率达到 99%，可减少环境声、背景音乐和静音片段引发的错误转写。

## 评测亮点

* **上下文推理**：错误率为 0.57%，相比 StepAudio 2.5 ASR 的 1.59% 降低 64.2%；相比豆包 ASR 2.0 的 1.00% 降低 43.0%。
* **垂类专名**：覆盖体育、医药、化工、汽车、法律、金融和编程开发等 20+ 领域，平均错误率为 3.81%。
* **相较上一代的全面跃升**：中文、英文通用平均错误率分别降低 9.3% 和 25.0%，方言降低 22.3%，垂类领域降低 42.1%，中英混说降低 27.9%。
* **长上下文能力**：上下文推理错误率相比上一代降低 64.2%。
* **对比主要商业模型**：相比豆包 ASR 2.0，中文通用、英文、重口音、长音频和上下文推理平均错误率分别降低 18.6%、60.4%、23.3%、40.3% 和 43.0%。
* **真实复杂声音**：AISHELL-6 悄悄话测试 CER 为 3.97%，优于上一代的 5.36%；在极快语速、含糊、连读和拖沓等测试中保持稳定识别能力。

## 应用场景

StepAudio 3 ASR Max 将通过 API 提供服务，可用于会议纪要、视频字幕、直播内容理解、智能客服、车载交互、医疗记录、金融服务和专业内容生产等场景，让语音内容更准确地被理解、检索和使用。

## API 端点

> [card] [语音识别（流式返回文本）](https://platform.stepfun.com/docs/zh/api-reference/audio/asr-sse.md)
>
> `POST /v1/audio/asr/sse`\
> 一次性提交音频，SSE 流式返回识别文本。

## 相关资源

> [card] [语音大模型概述](https://platform.stepfun.com/docs/zh/guides/models/audio.md)
>
> 返回 Audio 3 系列模型概述。

> [card] [完整定价详情](https://platform.stepfun.com/docs/zh/guides/pricing/details.md)
>
> 查看语音、文本、图像等全部模型的计费规则。

> [card] [语音识别 API](https://platform.stepfun.com/docs/zh/api-reference/audio/asr-sse.md)
>
> 查看语音识别请求参数、响应事件和接口说明。

> [card] [Demo 与体验中心](https://www.stepfun.com/studio/audio?tab=speech-recognition)
>
> 在线体验 StepAudio 3 ASR 的识别能力。


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.