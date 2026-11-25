> ## Documentation Index
> Fetch the complete documentation index at: https://platform.stepfun.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# StepAudio 3 Gen

StepAudio 3 Gen 是面向综合音频内容创作的生成模型。用户仅需用自然语言描述角色设定、音色风格与情绪表达，即可生成富有表现力、可精细控制的人声；在此基础上，模型同样支持音效、环境音、背景音乐与歌声的生成，并可将各类声音统一编排到同一段音频中，输出具有完整听觉效果的作品。[技术报告](https://arxiv.org/abs/2609.12945)｜[更多 demo](https://static.stepfun.com/blog/stepaudio3/gen/)｜[语音体验中心](https://www.stepfun.com/studio/audio?tab=audio-gen)

## 模型信息

| 项目 | 内容 |
| :- | :- |
| 模型 ID | `stepaudio-3-gen-preview` |
| 输入 | 角色、脚本描述和自然语言指令 |
| 输出 | 综合音频 |
| 计费 | 限时免费 |

> [!NOTE]
>
> `stepaudio-3-gen-preview` 为限免期间使用的模型名称，限免到期后该预览版本将下线，并新增正式付费版本。

## 核心能力

* **精细化声音设计与控制**：支持通过自然语言控制多角色台词、音色风格、说话方式、语气情绪、方言口音，以及笑声、喘息、停顿等拟人化副语言特征。可在一条指令中描述多个角色及其互动关系，由模型完成对白组织和声音衔接，使生成结果更具连贯性和表现力。
* **全要素生成与时序编排**：除人声外，同样支持音效、环境音、背景音乐与歌声的生成，并可通过规范化的自然语言指定各声音元素的出现位置与先后顺序，完成协同生成与片段衔接，满足完整音频作品的制作需要。

## 应用场景

* **专业内容生产**：面向影视、游戏、动画、广播剧和有声书等专业场景，可灵活设计不同角色的音色与表达风格，快速完成角色配音与多角色对白；并可一并生成所需的环境音、音效与背景音乐，减少传统制作流程中的多工种协作与后期处理成本，提升内容生产效率。
* **短视频与自媒体**：面向个人创作者的短视频配音场景，无需专业软件或音频制作经验，仅需一段规范化的自然语言描述，即可生成与视频内容匹配、风格可控的配音；并可按需补充背景音乐与音效，简化配音、选曲与混音等环节。

## API 端点

> [card] [音频生成 API](https://platform.stepfun.com/docs/zh/api-reference/audio/generate.md)
>
> `POST /v1/audio/generate`

## 相关资源

> [card] [语音大模型概述](https://platform.stepfun.com/docs/zh/guides/models/audio.md)
>
> 返回 Audio 3 系列模型概述。

> [card] [完整定价详情](https://platform.stepfun.com/docs/zh/guides/pricing/details.md)
>
> 查看语音、文本、图像等全部模型的计费规则。

> [card] [音频生成 API](https://platform.stepfun.com/docs/zh/api-reference/audio/generate.md)
>
> 查看音频生成请求参数与接口说明。

> [card] [Demo 与体验中心](https://www.stepfun.com/studio/audio?tab=audio-gen)
>
> 在线快速体验 StepAudio 3 Gen 的音频生成能力。


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.