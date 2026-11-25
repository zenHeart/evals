> ## Documentation Index
> Fetch the complete documentation index at: https://platform.stepfun.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# StepAudio 3 Realtime

## 模型概述

阶跃星辰提供两种语音对话方案，适用于不同的场景需求。StepAudio 3 Realtime 是当前面向实时互动场景的旗舰模型，重点提升全双工对话、边想边说和 Voice Agent 能力。[技术报告](https://arxiv.org/abs/2609.14005)｜[查看更多 demo](https://static.stepfun.com/blog/stepaudio3/realtime/)｜[语音体验中心](https://www.stepfun.com/studio/audio?tab=voice-chat)

| 特性 | Chat Completions API | Realtime API |
| - | - | - |
| 连接方式 | HTTP 请求 | WebSocket 长连接 |
| 语音识别 (ASR) | 需自行实现或使用第三方服务 | 内置，自动识别用户语音 |
| 上下文管理 | 需自行维护 messages 列表 | 内置，自动管理对话历史 |
| 语音活动检测 (VAD) | 需自行实现 | 内置，自动检测用户说话 |
| 联网搜索 | 需自行实现搜索接口 | 内置 web\_search 工具 |
| 知识库检索 | 需自行实现 | 内置 retrieval 工具 |
| 延迟 | 较低（流式输出） | 极低（双向流式交互） |
| 适用场景 | 离线处理、批量任务、简单集成 | 实时对话、语音助手、客服机器人 |

以下模型可分别通过 [Chat API](https://platform.stepfun.com/docs/zh/api-reference/chat/chat-completion-create.md) 和 [Realtime API](https://platform.stepfun.com/docs/zh/api-reference/realtime/chat.md) 接入。

## 模型列表

### StepAudio 3 Realtime

* 定位：面向实时互动的全双工语音模型
* 能力标签：真人自然交互、全双工对话、自适应推理、边想边说、Voice Agent
* 体验入口：[体验中心](https://www.stepfun.com/studio/audio?tab=voice-chat)
* StepAudio 3 Realtime 将实时音频理解、话轮管理、推理和工具调用整合到同一段对话中。模型不仅识别用户说了什么，还能理解语气、情绪、副语言线索与环境声音。
* 支持自然打断、附和识别和话权协调：用户与模型可以同时说话，模型会在真正被打断时及时停下，在自然停顿或随口附和时保持对话连贯。
* 面对简单问题可以快速回应；面对复杂任务，可以自适应进入更深入的思考，并通过边想边说降低等待感。
* Voice Agent 可以在意图明确后调用工具或执行后端任务，任务运行期间对话仍可继续，结果返回后自然接入交流。

> [!NOTE]
>
> `stepaudio-3-realtime-preview` 为限免期间使用的模型名称，限免到期后该预览版本将下线，并新增正式付费版本。价格见 [API 定价](https://platform.stepfun.com/docs/zh/guides/pricing/details.md)，调用限制见 [API 速率限制](https://platform.stepfun.com/docs/zh/guides/pricing/rate-limits.md)。

### StepAudio 3 Chat

* 定位：面向 Chat Completions API 的语音理解与对话模型
* 能力标签：语音输入、文本对话、上下文理解、工具调用
* 通过 [Chat API](https://platform.stepfun.com/docs/zh/api-reference/chat/chat-completion-create.md) 接入，适合按轮次提交语音或文本并获取文本回复的场景。
* 与 StepAudio 3 Realtime 共享 Audio 3 系列的声音理解与推理能力；如需语音流式输出和全双工交互，请使用 Realtime API。

> [!NOTE]
>
> `stepaudio-3-chat-preview` 为限免期间使用的模型名称，限免到期后该预览版本将下线，并新增正式付费版本。价格见 [API 定价](https://platform.stepfun.com/docs/zh/guides/pricing/details.md)，调用限制见 [API 速率限制](https://platform.stepfun.com/docs/zh/guides/pricing/rate-limits.md)。

## 业务场景应用

Realtime API 凭借实时交互与情感理解能力，已在多个行业领域实现成功落地：

* **智能座舱**：为车载系统提供自然语音交互界面，支持驾驶过程中的信息查询、闲聊对话和安全提醒
* **智能终端**：为各类 IOT 智能硬件设备提供实时语音交互能力，提升用户与设备间的交互体验
* **社交娱乐**：帮助社交平台和娱乐应用构建情感陪伴 Agent
* **智能客服**：实现高度拟人化的客户服务体验，提升服务效率和客户满意度
* **金融调解**：在金融纠纷处理过程中提供中立、专业的沟通辅助

通过集成 Realtime API，开发者可以快速构建具备人类般自然交流能力的应用，为用户带来真正沉浸式的语音交互体验。

## 模型快速入门

> [card] [实时双向语音开发](https://platform.stepfun.com/docs/zh/guides/developer/realtime.md)
>
> 了解 Realtime API 的事件模型、会话管理和语音交互流程。

> [card] [语音对话开发](https://platform.stepfun.com/docs/zh/guides/developer/audio-chat.md)
>
> 通过 Chat Completion 接口接入语音输入输出与音频流式能力。

> [card] [Realtime API 事件文档](https://platform.stepfun.com/docs/zh/api-reference/realtime/chat.md)
>
> 查看 Realtime API 的请求格式、事件字段和接口说明。

> [card] [Realtime API Demo](https://github.com/stepfun-ai/Step-Realtime-Console)
>
> 参考官方前端演示项目，快速搭建实时语音对话控制台。


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.