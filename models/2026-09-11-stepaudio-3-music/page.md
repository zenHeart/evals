> ## Documentation Index
> Fetch the complete documentation index at: https://platform.stepfun.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# StepAudio 3 Music

模型以自然语言、歌词、人声及参考音频为核心输入，覆盖从灵感描述、完整歌曲生成到智能配乐的多种创作任务，帮助用户更高效地将创意转化为可听、可用的音乐作品。[技术报告](https://arxiv.org/abs/2609.16034)｜[查看更多 demo](https://static.stepfun.com/blog/stepaudio3/music/)｜[语音体验中心](https://www.stepfun.com/studio/audio?tab=music)

## 模型信息

| 项目 | 内容 |
| :- | :- |
| 模型 ID | `stepaudio-3-music-preview` |
| 输入 | 自然语言、歌词、人声或参考音频 |
| 输出 | 音乐 |
| 协议 | HTTP 异步任务 |
| 计费 | 限时免费 |

> [!NOTE]
>
> `stepaudio-3-music-preview` 为限免期间使用的模型名称，限免到期后该预览版本将下线，并新增正式付费版本。

## 模型架构

StepMusic 采用面向音乐理解与高保真生成的统一架构，基于大规模歌曲与音乐理解数据进行训练，通过自研无监督音乐表征编码器学习旋律、和声、节奏、结构、音色和演唱等信息，并由生成与渲染模块完成最终音频合成。

* **音乐语义理解**：将文字描述、歌词与参考音频映射到统一的音乐语义空间，理解内容、风格和演唱要求之间的关系。
* **多条件控制**：根据任务组合歌词、音乐描述、人声、旋律或参考歌曲等条件，支持多种生成模式。
* **音乐结构建模**：学习前奏、主歌、副歌、桥段、间奏和尾奏等结构，以及跨段落的旋律与能量发展。
* **高保真音频渲染**：通过 DiT 等生成架构完成音频细节重建，兼顾人声、器乐、空间感和整体制作质量。

## 核心能力

* **歌曲生成**：根据音乐描述和歌词，生成包含人声、旋律、编曲与混音的完整歌曲。
* **纯音乐生成**：根据风格、情绪、场景或乐器描述，生成无演唱人声的纯音乐。
* **干声智能配乐**：分析清唱或干声人声的旋律、节奏与情绪，自动生成匹配的伴奏和编曲。
* **自然语言音乐控制**：支持描述风格与流派、人声与唱腔、旋律与节奏、乐器与编曲、情绪与场景，以及制作质感。
* **参考音频驱动**：支持通过音色、哼唱、原曲或干声等参考输入，进行更精确、更个性化的音乐生成。
* **ABC 记谱输入**：支持参考 ABC 旋律记谱输入的音乐生成（即将支持）。

## 使用场景

* **音乐创作与 Demo**：快速验证歌词、旋律、曲风和编曲方向，为词曲作者、制作人和歌手提供创作草稿。
* **短视频与内容平台**：根据视频主题、情绪和时长生成原创歌曲或背景音乐，提升内容生产效率。
* **影视、游戏与广告**：围绕角色、剧情、世界观或品牌调性生成主题音乐、场景音乐和广告音乐。
* **虚拟角色与数字人**：结合角色音色生成歌曲，强化角色声音身份与持续内容供给能力。
* **个性化娱乐**：使用用户自己的声音、歌词或哼唱生成专属歌曲，用于纪念、祝福和社交分享。
* **音乐教育与灵感辅助**：将旋律想法快速转化为不同风格版本，辅助理解编曲、曲风和情绪表达。

## 输入建议

* **描述尽量具体**：相比“生成一首好听的歌”，同时说明流派、速度、人声、乐器、情绪和制作质感，更容易获得符合预期的结果。
* **歌词使用清晰结构**：建议使用 `[Intro]`、`[Verse]`、`[Pre-Chorus]`、`[Chorus]`、`[Bridge]`、`[Outro]` 等段落标签，帮助模型理解歌曲结构。
* **分轮调整关键变量**：首次生成先确定整体曲风和演唱方向，后续再逐步调整乐器、编曲密度和制作细节，便于比较不同版本。

## 合规说明

涉及声音克隆、歌曲翻唱和参考音频生成时，应确保已获得声音主体、词曲、录音及其他相关权利人的合法授权。生成内容在公开传播或商业使用前，应依据实际业务地区、平台规则和使用场景完成必要的版权、人格权及内容安全审核。

## API 端点

> [card] [Music API](https://platform.stepfun.com/docs/zh/api-reference/audio/music.md)
>
> `POST /v1/audio/music`

## 相关资源

> [card] [语音大模型概述](https://platform.stepfun.com/docs/zh/guides/models/audio.md)
>
> 返回 Audio 3 系列模型概述。

> [card] [完整定价详情](https://platform.stepfun.com/docs/zh/guides/pricing/details.md)
>
> 查看语音、文本、图像等全部模型的计费规则。

> [card] [Music API](https://platform.stepfun.com/docs/zh/api-reference/audio/music.md)
>
> 查看 Music API 请求参数。

> [card] [Demo 与体验中心](https://www.stepfun.com/studio/audio?tab=music)
>
> 在线快速体验 StepAudio 3 Music 的音乐生成能力。


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.