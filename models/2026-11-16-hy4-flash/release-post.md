@@@coverCard
type = "image"
date = "2026年11月16日"
media_src = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026111517490716_6d0b8dd02dcfff6174ba34e437a09247.png"
image_alt = "Hy4flash"
title = "Hy4 flash：\n日常工作的极致性价比模型"
aspectRatio = ""
mediaWidth = "100%"
mediaMarginTop = "32"
mediaMarginBottom = "64"
videoLoop = 0
@@@

@@@space
height = 16
@@@

@@@buttonGroupCard

[[buttons]]
text = "腾讯云"
icon = "tencentcloud"
url = "https://cloud.tencent.com/tokenhub/hy4-flash"

[[buttons]]
text = "OpenRouter"
icon = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026070622081339_db7b4e83c4ccd253de47d27e656c6a1f.svg"
url = "https://openrouter.ai/tencent/hy4-flash"

[[buttons]]
text = "WorkBuddy"
icon = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026111316225445_38f7d1fa6bb1f062c21920b162d05167.png"
url = "https://www.workbuddy.cn/app"

[[buttons]]
text = "元宝"
icon = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026111316231014_b52b5e93c4dadeea0b56cb690a633d10.png"
url = "https://yuanbao.tencent.com/"

[[buttons]]
text = "GitHub"
icon = "GitHub"
url = "https://github.com/Tencent-Hunyuan/Hy4-flash"

[[buttons]]
text = "HuggingFace"
icon = "huggingface"
url = "https://huggingface.co/tencent/Hy4-flash"

[[buttons]]
text = "ModelScope"
icon = "modelscope"
url = "https://modelscope.cn/models/Tencent-Hunyuan/Hy4-flash"

[[buttons]]
text = "AtomGit"
icon = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026070520372391_5ab131402b8d9602f385640c3cf82490.png"
url = "https://ai.gitcode.com/tencent_hunyuan/Hy4-flash"

@@@

@@@space
height =32
@@@
我们推出 Hy4 flash，迄今为止最高性价比的 Hy 模型。其总参数量为 224B（其中 64B Engram 参数），激活参数 12B，支持多模态和 1M 上下文长度，API 价格相比 Hy4 大幅降低。

@@@space
height = 32
@@@

::: center  

|API 价格（每百万 Tokens）|输入（命中缓存） | 输入 | 输出 |
| ------ | ------ | ------ | ------ |
| **Hy4 flash** | **0.02元**  | **0.5元**| **2元** |
| Hy4 | 0.3元  | 6元| 18元 |

:::

@@@space
height = 32
@@@

我们通过一系列工作在极致优化成本的同时兼顾智能水平和实用性：

- 在预训练阶段，Hy4 flash 加入了混合注意力、LatentMoE、Engram 等架构特性，KV cache 大小仅为 Hy3 的 1/24、Hy4 的 1/6，且通过大量 scaling ladder 实验确保效果符合预期；

- 在后训练阶段，我们通过自蒸馏 Hy4 获得了较强的综合智能水平，再通过强化学习使端到端任务输出长度降低 50%；

- 在评估阶段，我们构建基于 WorkBuddy 典型任务的内部评测集 WorkIndex，并结合人评，聚焦日常工作的产物效果、单轮输出长度、端到端用时，而非远离日常工作的公开榜单分数；

- 在推理阶段，我们结合 megakernel、4bit 量化、DFly 等手段极致优化，使 Hy4 flash 解码速度超过 150 tps，且可以大规模低成本部署运营。

**最终，Hy4 flash 在综合效果上略优于 Hy4 preview；在 WorkIndex 上单任务成本仅为 Hy4 preview 的 1/13、Hy4 的 1/20、DeepSeek-V4.1-Flash-1017（max档位，忙时价格）的 1/8。**

@@@space
height = 32
@@@

@@@ tabChartCard
buttonType = "primary"
chartHeight = 500

[[tabs]]
label = "WorkIndex (internal)"
content = '''
```echarts
{
  baseOption: {
    tooltip: {
      trigger: 'item',
      confine: true,
      backgroundColor: '#1f1f1f',
      borderWidth: 0,
      borderRadius: 8,
      padding: [8, 12],
      textStyle: { color: '#a3a3a3', fontSize: 13 }
    },
    grid: { left: 0, right: 0, top: 40, bottom: 56, show: true, borderColor: '#e5e5e5' },
    xAxis: {
      type: 'log',
      min: 0.15,
      max: 7.5,
      name: 'Cost per task (RMB)',
      nameLocation: 'middle',
      nameGap: 32,
      nameTextStyle: { color: '#888' },
      axisLine: { show: false },
      axisTick: { show: false, customValues: [0.2, 0.5, 1, 2, 5] },
      axisLabel: { customValues: [0.2, 0.5, 1, 2, 5], color: '#888' },
      splitLine: { show: true, lineStyle: { color: '#eee' } }
    },
    yAxis: {
      type: 'value',
      min: 30,
      max: 55,
      interval: 5,
      name: 'Performance',
      nameLocation: 'end',
      nameGap: 12,
      nameTextStyle: { color: '#888', align: 'left' },
      axisLine: { show: false },
      axisLabel: { color: '#888' },
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [
      {
        type: 'line',
        symbol: 'circle',
        symbolSize: 14,
        lineStyle: { color: '#00BAFF', width: 1.5 },
        itemStyle: { color: '#29b6f6', borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}', fontSize: 13, fontWeight: 'bold', color: '#222' },
        data: [
          {
            name: 'Hy4 flash', value: [0.2, 42.1],
            label: { position: 'bottom', align: 'left', offset: [6, 0] },
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥0.2 · 42.1</span>' }
          },
          {
            name: 'DeepSeek-V4.1-Flash-1017', value: [1.6, 44.4],
            label: { position: 'top', align: 'right', offset: [-6, 0] },
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥1.6 · 44.4</span>' }
          },
          {
            name: 'Hy4', value: [5.7, 51.4],
            label: { position: 'top', align: 'right', offset: [-6, 0] },
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥5.7 · 51.4</span>' }
          }
        ]
      },
      {
        type: 'scatter',
        symbolSize: 10,
        itemStyle: { color: '#9aa3b2', opacity: 1 },
        label: { show: true, position: 'right', formatter: '{b}', fontSize: 13, color: '#333' },
        data: [
          {
            name: 'Qwen3.8-Flash-Next', value: [0.7, 41.0],
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥0.7 · 41.0</span>' }
          },
          {
            name: 'Hy4 preview', value: [3.2, 39.7],
            label: { position: 'left', offset: [0, 3] },
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥3.2 · 39.7</span>' }
          },
          {
            name: 'GLM-5.3-Flash', value: [1.7, 37.7],
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥1.7 · 37.7</span>' }
          },
          {
            name: 'GPT-6 Luna', value: [0.9, 34.1],
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥0.9 · 34.1</span>' }
          }
        ]
      }
    ]
  },
  media: [
    {
      option: {
        series: [
          { label: { fontSize: 13 } },
          { label: { fontSize: 13 } }
        ]
      }
    },
    {
      query: { maxWidth: 500 },
      option: {
        series: [
          { label: { fontSize: 10 } },
          { label: { fontSize: 10 } }
        ]
      }
    }
  ]
}
```
'''

[[tabs]]
label = "Open Benchmarks"
content = '''
```echarts
{
  baseOption: {
    tooltip: {
      trigger: 'item',
      confine: true,
      backgroundColor: '#1f1f1f',
      borderWidth: 0,
      borderRadius: 8,
      padding: [8, 12],
      textStyle: { color: '#a3a3a3', fontSize: 13 }
    },
    grid: { left: 0, right: 0, top: 40, bottom: 56, show: true, borderColor: '#e5e5e5' },
    xAxis: {
      type: 'log',
      min: 0.2,
      max: 28,
      name: 'Cost per task (RMB)',
      nameLocation: 'middle',
      nameGap: 32,
      nameTextStyle: { color: '#888' },
      axisLine: { show: false },
      axisTick: { show: false, customValues: [0.5, 1, 2, 5, 10, 20] },
      axisLabel: { customValues: [0.5, 1, 2, 5, 10, 20], color: '#888' },
      splitLine: { show: true, lineStyle: { color: '#eee' } }
    },
    yAxis: {
      type: 'value',
      min: 30,
      max: 65,
      interval: 5,
      name: 'Performance',
      nameLocation: 'end',
      nameGap: 12,
      nameTextStyle: { color: '#888', align: 'left' },
      axisLine: { show: false },
      axisLabel: { color: '#888' },
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [
      {
        type: 'line',
        symbol: 'circle',
        symbolSize: 14,
        lineStyle: { color: '#00BAFF', width: 1.5 },
        itemStyle: { color: '#29b6f6', borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}', fontSize: 13, fontWeight: 'bold', color: '#222' },
        data: [
          {
            name: 'Hy4 flash', value: [0.3, 48.3],
            label: { position: 'bottom' },
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥0.3 · 48.3</span>' }
          },
          {
            name: 'DeepSeek-V4.1-Flash-1017', value: [2.7, 56.5],
            label: { position: 'top', align: 'right', offset: [-6, 0] },
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥2.7 · 56.5</span>' }
          },
          {
            name: 'Hy4', value: [8.6, 59.8],
            label: { position: 'right' },
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥8.6 · 59.8</span>' }
          }
        ]
      },
      {
        type: 'scatter',
        symbolSize: 10,
        itemStyle: { color: '#9aa3b2', opacity: 1 },
        label: { show: true, position: 'right', formatter: '{b}', fontSize: 13, color: '#333' },
        data: [
          {
            name: 'Qwen3.8-Flash-Next', value: [4.3, 48.1],
            label: { position: 'top' },
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥4.3 · 48.1</span>' }
          },
          {
            name: 'GLM-5.3-Flash', value: [4.5, 47.5],
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥4.5 · 47.5</span>' }
          },
          {
            name: 'GPT-6 Luna', value: [1.5, 39.2],
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥1.5 · 39.2</span>' }
          },
          {
            name: 'Hy4 preview', value: [19.6, 45.9],
            label: { position: 'bottom', align: 'right', offset: [4, 2] },
            tooltip: { formatter: '{b}<br/><span style="color:#fff;font-size:15px">¥19.6 · 45.9</span>' }
          }
        ]
      }
    ]
  },
  media: [
    {
      option: {
        series: [
          { label: { fontSize: 13 } },
          { label: { fontSize: 13 } }
        ]
      }
    },
    {
      query: { maxWidth: 500 },
      option: {
        series: [
          { label: { fontSize: 10 } },
          { label: { fontSize: 10 } }
        ]
      }
    }
  ]
}
```
'''


@@@
!!#737373 !12 图 1：内外部任务上的性能和成本。其中 WorkIndex 包含 8 个内部评测集（PPT 制作、PPT 修改、PPT 人机双写、Markdown 人机双写、文档编辑、表格修复、音视频处理、视觉理解）；Open Benchmarks 包含 7 个公开 Agent 评测集（DeepSWE、ProgramBench、Terminal-Bench 4.0、APEX-Agents、AutomationBench、HLE、OSWorld 2.1）。!!!


![Internal Buddy Index.png](https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026111611534381_28e20d5526fc6c9f49093ba2468abd19.png) 
!!#737373 !12 图 2：在 WorkIndex 上的平均任务花费对比。!!!


为了衡量真实使用体验，我们邀请了 85 位 WorkBuddy 内部用户在 27 类共 259 个日常工作任务上进行盲测。结果显示，Hy4 flash 的用户满意度接近 Claude Haiku 5.5，且单任务成本显著低于其他所有模型，任务时长也最短。

![【中】模型盲测结果.png](https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026111613050359_56fcc01725d9dee855802b478cf3c9df.png)

Hy4 flash 已在腾讯云 TokenHub、WorkBuddy、元宝、企业微信、QQ、ima、Marvis 等产品上线，即将接入 OpenRouter。11 月 30 日前，用户可在 WorkBuddy 限时免费使用，腾讯云 TokenHub API 限时 5 折使用。 我们推荐在深度搜索、文档处理、PPT生成、简单前端展示、computer use 等大部分日常任务中使用 Hy4 flash，在长程软件工程等复杂任务中使用智能上限更高的 Hy4。Hy4 flash 已在 GitHub、HuggingFace、ModelScope、AtomGit 开源，并将高频迭代，不断提升真实工作中的实用性和效率。


@@@testimonialSlider
ariaLabel = "产品反馈"
itemsPerPage = 2
mobileItemsPerPage = 1
loop = false
defaultActivePage = 0
showCount = true
countSeparator = " / "
countMinDigits = 2
countLabelTemplate = "第 {current} 页，共 {total} 页"
emptyText = "暂无证言内容"
contentEmptyText = "暂无证言内容"
previousLabel = "上一页证言"
nextLabel = "下一页证言"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403005137_38f7d1fa6bb1f062c21920b162d05167.png"
brandName = "WorkBuddy"
content = "日常办公中，用户既看重任务完成质量，也在意完成时间和使用成本。WorkBuddy 的评测结果显示，与 Hy4 相比，平均任务耗时减少 70%，平均成本仅为 Hy4 的 1/15 左右，效果在日常工作任务上基本持平，Coding 长程任务小幅下降，并且具备原生多模态能力。总的来看，Hy4 flash 是兼顾效果、速度与成本的实用首选。"
authorName = "WorkBuddy"
authorTitle = "产品经理 Anne"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403012828_b52b5e93c4dadeea0b56cb690a633d10.png"
brandName = "元宝"
content = "元宝真实场景下，Hy4 flash 的 Agent 能力相比 Hy3 大幅提升 13.6%，Agent 任务人工对比评估 GSB 相比 Hy3 提升 7.56%，提升亮点在于任务完成更充分、信息呈现更清晰、内容更专业可信。在元宝通用对话任务上，Hy4 flash 相比 GLM-5.3-Flash 提升 2.52%，其中多轮对话能力提升最明显。"
authorName = "元宝"
authorTitle = "产品负责人  Logan"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026111601215756_2ca7df5c2fe9a52ad7abb7456d9f73db.png"
brandName = "微信支付"
content = "在 AI 操作真机的支付客户端场景测评中，我们针对执行路径、知识利用、验收检查、造号准确性四个 Agent 流程进行评测，Hy4 flash 相比 DeepSeek-V4.1-Flash-1017，均分全部持平或更高，执行步数减少约 6%，单次输出长度缩短约 29%。执行路径更干净，对注入的知识库理解更清晰，使用更准确。在微信支付代码静态扫描场景的测评中，Hy4 flash 相比 DeepSeek-V4.1-Flash-1017，完成扫描所需时间降低 37%、消耗 Token 降低 46%，推理效果持平，模型回复内容更简练，且更能从上下文中找到决策依据。"
authorName = "微信支付"
authorTitle = "信息智能实验室 yilin 安全工程师 Simba"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403051259_3cce84d5fe7d7f0402c18f161e606bc8.png"
brandName = "企业微信"
content = "日常办公协作中，企业微信大圆的评测结果显示，Hy4 flash 的输出速度相比 Hy4 提升 88%，思考模式下的输出 Token 减少约 60%。在企业信息检索、资料分析、文档整理等任务中，它能够自主规划工具调用并完成结果交付。Hy4 flash 兼顾响应效率与交付质量，非常适合需要快速响应和多步骤处理的办公场景。"
authorName = "企业微信"
authorTitle = "算法负责人 Dylan"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026111610200065_135ff144dd6a08bc8d026b733198b18b.png"
brandName = "王者荣耀"
content = "在游戏研发 Bug 分析评测中，针对 UI 交互、系统逻辑等问题，Hy4 flash 的根因定位表现接近 DeepSeek-V4.1-Flash-1017 和 GLM-5.3-Flash，但模型请求次数减少 22.0% – 39.1%，按请求回执统计的 Token 消耗量减少 40.5% – 61.2%。Hy4 flash 平均工具调用次数分别多 51.2% 和 7.7%；输出报告篇幅短 13.8% 和 37.0%。Hy4 flash 体现出兼顾定位质量与资源效率的优势，尤其适合日常研发中高频、批量的问题排查与辅助定位。"
authorName = "王者荣耀"
authorTitle = "项目管理负责人 TH"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403035813_ba938573b46ba47b93f4d3805db90d82.png"
brandName = "ima"
content = "在基于知识库问答真实场景构建的评测显示，Hy4 flash 相比 DeepSeek-V4.1-Flash-1017 和 GLM-5.3-Flash，平均等待时间缩短约 18% – 35%；提速的同时，各项质量指标同步向好：回答整体评分提升 1.8%，回答内容质量评分提升 8.1%，思维链内容质量综合评分提升 2.1%。对于日常问答、文字整理这类知识工作，完成时间更短，并且能够拿到更优质的回复。 "
authorName = "ima"
authorTitle = "产品经理 Kaycee"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026110403023983_8ca88aeaa8e8a39d2774d600860162f9.png"
brandName = "QQ"
content = "接入 Hy4 flash 后，小 Q 的多项  Agent 能力进一步提升，既答得好，也回得快。评测显示，相较 DeepSeek-V4.1-Flash，Hy4 flash 在音乐推荐、频道互动、QQ 空间和星座长篇解析中的表现更优，符合要求的结果占比分别高出 6.16、2.84、0.92 和 2.22 个百分点；在聊天陪伴、音乐推荐和星座长篇解析场景里，完成时间缩短约 11%–27%，让用户更快获得贴合需求的陪伴与帮助。在频道助手的 UGC 互场景中，Hy4 flash 能在近实时约束下稳定完成意图识别与工具调用。相比 DeepSeek-V4.1-Flash，对用户意图的判断准确率持平，评论 P90 耗时缩短 39%、峰值耗时缩短 47%，输出 token 减少 30%，缓存命中率大幅提升，充分满足业务要求。"
authorName = "QQ"
authorTitle = "小 Q 技术负责人 Red 频道研发 Look"

[[items]]
logo = "https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026111611315652_0b5a10603cd9facc92251ef309043828.png"
brandName = "Marvis"
content = "Hy4 flash 在 Marvis 核心 AI 管家场景中展现出很强的任务解决能力。相比 DeepSeek-V4.1-Flash-1017，多个核心场景的任务满意度均有提升：应用下载安装提升 6.2%，系统设置与诊断提升 4.4%，文档处理与调研报告生成提升 6.9%。在整体任务满意度持平的基础上，Hy4 flash 进一步强化了重点场景的任务质量，为用户带来更加可靠的 AI 管家体验。"
authorName = "Marvis"
authorTitle = "算法工程师 Baihan"

@@@

@@@space
height =40
@@@

## 附录：模型得分

![Hy4 flash Bench图表-全.png](https://hy-model-ap-prod-1258344703.cos.ap-guangzhou.myqcloud.com/llm-blog/default/9a5ea02f/2026111612180251_f78f651630a35685ae127407040a2aae.png) 