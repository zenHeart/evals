---
vendor: openai
model: OpenAI o3 / OpenAI o4-mini
release: o3-o4-mini
date: 2025-04-16
source: https://openai.com/index/introducing-o3-and-o4-mini/
fetched_at: 2026-09-01
---

# Introducing OpenAI o3 and o4-mini

## 评测数据（转录）

来源说明:本页数值取自 `page.html` 正文文本与页面内嵌 Vega 图表数据(OpenAI 图表为客户端 JS 渲染;manifest 中名为 AIME/GPQA 评测图的 02–05.webp 实际渲染为暗色装饰背景,不含可读数值)。`备注`中「图表」指内嵌图表数据、「正文」指散文文本,均出自 `page.html`;本次无读图数值,故无「(视觉转写)」行。

**正文数值**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| AIME 2025(o4-mini,Python 工具) | 99.5% pass@1(100% consensus@8) | 正文;页面注明带工具成绩不应与无工具模型直接比较 |
| AIME 2025(o3,工具) | 98.4% pass@1(100% consensus@8) | 正文 |
| 相对 OpenAI o1 的 major errors(o3) | −20% | 正文:困难真实任务上的专家评估 |
| biorisk 会话拦截率 | ~99% | 正文:安全 monitor 在人工红队活动中的标记率,非模型能力分 |

**定性 SOTA(正文,无具体分数)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Codeforces / SWE-bench / MMMU | — | 页面仅定性描述:"sets a new SOTA on benchmarks including Codeforces, SWE-bench (without building a custom model-specific scaffold), and MMMU";分数见下方图表 |

**竞赛数学(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| AIME 2024(o1) | 74.3 | 图表,对照模型 |
| AIME 2024(o3-mini) | 87.3 | 图表,对照模型 |
| AIME 2024(o3,无工具) | 91.6 | 图表 |
| AIME 2024(o4-mini,无工具) | 93.4 | 图表 |
| AIME 2025(o1) | 79.2 | 图表,对照模型 |
| AIME 2025(o3-mini) | 86.5 | 图表,对照模型 |
| AIME 2025(o3,无工具) | 88.9 | 图表 |
| AIME 2025(o4-mini,无工具) | 92.7 | 图表 |

**竞赛代码(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Codeforces,Elo(o1) | 1891 | 图表,对照模型 |
| Codeforces,Elo(o3-mini) | 2073 | 图表,对照模型 |
| Codeforces,Elo(o3,with terminal) | 2706 | 图表 |
| Codeforces,Elo(o4-mini,with terminal) | 2719 | 图表 |

**学问答与专家级考试(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| GPQA Diamond(o1) | 78 | 图表,对照模型 |
| GPQA Diamond(o3-mini) | 77 | 图表,对照模型 |
| GPQA Diamond(o3,无工具) | 83.3 | 图表 |
| GPQA Diamond(o4-mini,无工具) | 81.4 | 图表 |
| Humanity's Last Exam(o1-pro) | 8.12 | 图表,对照模型 |
| Humanity's Last Exam(o3-mini) | 13.4 | 图表,对照模型 |
| Humanity's Last Exam(o3,无工具) | 20.32 | 图表 |
| Humanity's Last Exam(o3,python + browsing** 工具) | 24.9 | 图表 |
| Humanity's Last Exam(o4-mini,无工具) | 14.28 | 图表 |
| Humanity's Last Exam(o4-mini,python + browsing** 工具) | 17.7 | 图表 |
| Humanity's Last Exam(Deep research) | 26.6 | 图表,对照模型 |

**多模态(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| MMMU(o1) | 77.6 | 图表,对照模型 |
| MMMU(o3) | 82.9 | 图表 |
| MMMU(o4-mini) | 81.6 | 图表 |
| MathVista(o1) | 71.8 | 图表,对照模型 |
| MathVista(o3) | 86.8 | 图表 |
| MathVista(o4-mini) | 84.3 | 图表 |
| CharXiv-Reasoning(o1) | 55.1 | 图表,对照模型 |
| CharXiv-Reasoning(o3) | 78.6 | 图表 |
| CharXiv-Reasoning(o4-mini) | 72 | 图表 |

**编码(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| SWE-Lancer: IC SWE Diamond,美元(o1-high) | 43958 | 图表,对照模型 |
| SWE-Lancer: IC SWE Diamond,美元(o3-mini-high) | 33833 | 图表,对照模型 |
| SWE-Lancer: IC SWE Diamond,美元(o3-high) | 86100 | 图表 |
| SWE-Lancer: IC SWE Diamond,美元(o4-mini-high) | 65792 | 图表 |
| SWE-Bench Verified n=477(o1) | 48.9 | 图表,对照模型 |
| SWE-Bench Verified n=477(o3-mini) | 49.3 | 图表,对照模型 |
| SWE-Bench Verified n=477(o3) | 69.1 | 图表 |
| SWE-Bench Verified n=477(o4-mini) | 68.1 | 图表 |
| Aider Polyglot,whole / diff(o1-high) | 0.644 / 0.617 | 图表,0–1 小数为原值;对照模型 |
| Aider Polyglot,whole / diff(o3-mini-high) | 0.667 / 0.604 | 图表,对照模型 |
| Aider Polyglot,whole / diff(o3-high) | 0.813 / 0.796 | 图表 |
| Aider Polyglot,whole / diff(o4-mini-high) | 0.689 / 0.582 | 图表 |

**指令跟随与智能体(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Scale MultiChallenge(o1) | 44.93 | 图表,对照模型 |
| Scale MultiChallenge(o3-mini) | 39.89 | 图表,对照模型 |
| Scale MultiChallenge(o3) | 56.51 | 图表 |
| Scale MultiChallenge(o4-mini) | 42.99 | 图表 |
| BrowseComp(4o + browsing) | 1.9 | 图表,对照模型 |
| BrowseComp(o3,python + browsing* 工具) | 49.7 | 图表 |
| BrowseComp(o4-mini,python + browsing** 工具) | 28.3 | 图表 |
| BrowseComp(Deep research) | 51.5 | 图表,对照模型 |
| Tau-bench airline / retail(o1-high) | 0.5 / 0.708 | 图表,0–1 小数为原值;对照模型 |
| Tau-bench airline / retail(o3-mini-high) | 0.324 / 0.576 | 图表,对照模型 |
| Tau-bench airline / retail(o3-high) | 0.52 / 0.704 | 图表;图表另含未标注意义的 Retail 附加值 0.035 |
| Tau-bench airline / retail(o4-mini-high) | 0.492 / 0.656 | 图表;图表另含未标注意义的 Retail 附加值 0.062 |

页面脚注:SWE-bench 使用 256k 最大上下文,使 o4-mini solve rate 提升约 3%、对 o3 影响 <1%,并排除 23 个内部基础设施无法运行的样本;tau-bench 为 5 次运行平均、无自定义工具或提示;o3 在 CharXiv-r 与 MathVista 的结果因 system prompt 变更而更新;浏览类评测在 OpenAI API 上因搜索引擎后端差异可能不完全可复现。

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 2257x1447 | alt='ChatGPT thinking with images' | 原URL: https://images.ctfassets.net/kftzwdyauwt9/5xCw1KgHHs0BQI0Fz1bOLM/1ca4ddcca658fddd65815d...
- images/02.webp — 2300x2300 | alt='OpenAI o3-mini and o4-mini AIME evals' | 原URL: https://images.ctfassets.net/kftzwdyauwt9/1HaJwt63QmevA8n6A8rOys/0d76297d0023935057e940...
- images/03.webp — 2352x2300 | alt='OpenAI o3-mini and o4-mini GPQA evals' | 原URL: https://images.ctfassets.net/kftzwdyauwt9/4Gw2tlDup1LN9WcMiiuyUr/2210496f5a2b2edf06898f...
- images/04.webp — 2300x2300 | alt='OpenAI o3 and o4 AIME evals' | 原URL: https://images.ctfassets.net/kftzwdyauwt9/1NDcqcms5r7NFdbdlhVdCX/008e39fe5112baa135c727...
- images/05.webp — 2352x2300 | alt='OpenAI o3 and o4 GPQA evals' | 原URL: https://images.ctfassets.net/kftzwdyauwt9/2HpQv67tCNmBJ8MtGfnTNS/f0d69d710fbb5ed2e9d36e...
- images/06.webp — 2300x2300 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/57Ci52oHMOMVoMYVmkXl9G/8c35f42ee1ccb1f679128d...
- images/07.webp — 2300x2300 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/1HaJwt63QmevA8n6A8rOys/0d76297d0023935057e940...
- images/08.webp — 2300x2300 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/57Ci52oHMOMVoMYVmkXl9G/8c35f42ee1ccb1f679128d...
- images/09.webp — 2352x2300 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/2cdIMEwnDwv2bxEVOpwQ8z/1db7f8a43717937cbd68dc...
- images/10.webp — 2352x2300 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/4Gw2tlDup1LN9WcMiiuyUr/2210496f5a2b2edf06898f...
- images/11.webp — 2352x2300 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/2cdIMEwnDwv2bxEVOpwQ8z/1db7f8a43717937cbd68dc...
- images/12.webp — 2300x2300 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/5bbO5DOoHZFGQr0gEg7x8J/53e1345744fd28788e1f16...
- images/13.webp — 2300x2300 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/1NDcqcms5r7NFdbdlhVdCX/008e39fe5112baa135c727...
- images/14.webp — 2300x2300 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/5bbO5DOoHZFGQr0gEg7x8J/53e1345744fd28788e1f16...
- images/15.webp — 2352x2300 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/2HpQv67tCNmBJ8MtGfnTNS/f0d69d710fbb5ed2e9d36e...
- images/16.webp — 2352x2300 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/4D68lzw7TeDGqsQqJkxLMI/203bae76f6bd2239df98b8...
- images/17.png — 1600x900 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/4hwOw0gdB26Czan75DOKai/3d3978172f4104809aa522...
