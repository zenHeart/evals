---
vendor: openai
model: GPT-5 / GPT-5 Pro
release: gpt-5
date: 2025-08-07
source: https://openai.com/index/introducing-gpt-5/
fetched_at: 2026-09-01
---

# Introducing GPT-5

## 评测数据（转录）

来源说明:本页数值取自 `page.html` 正文文本与页面内嵌 Vega 图表数据(OpenAI 图表为客户端 JS 渲染,静态归档图片仅保留装饰背景)。`备注`中「图表」指内嵌图表数据、「正文」指散文文本,均出自 `page.html`;本次无读图数值,故无「(视觉转写)」行。

**正文结论与相对值**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| AIME 2025(无工具) | 94.6% | 正文 SOTA 列举,GPT-5(thinking) |
| SWE-bench Verified | 74.9% | 正文 SOTA 列举,GPT-5 |
| Aider Polyglot | 88% | 正文 SOTA 列举,GPT-5 |
| MMMU | 84.2% | 正文 SOTA 列举,GPT-5 |
| HealthBench Hard | 46.2% | 正文 SOTA 列举,GPT-5 |
| GPQA | 88.4% | 正文:GPT-5 pro 无工具刷新 SOTA |
| 专家偏好(GPT-5 pro vs "GPT-5 thinking") | 67.8% | 正文:1000+ 真实推理 prompt 中专家偏好 pro;pro 少 22% major errors |
| 事实错误率(vs GPT-4o) | ~45% 减少 | 正文相对值:开启 web search 的生产流量,GPT-5 响应含事实错误概率低于 GPT-4o 约 45% |
| 事实错误率(vs OpenAI o3) | ~80% 减少 | 正文相对值:thinking 模式 |
| 谄媚回复率 | 14.5% → <6% | 正文:定向谄媚评测,改进前 → 改进后 |
| 生产流量欺骗率 | 4.8% → 2.1% | 正文:OpenAI o3 4.8% → GPT-5(reasoning)2.1% |

**竞赛数学(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| AIME 2025(GPT-5 pro,python) | 100 | 图表 |
| AIME 2025(GPT-5 pro,无工具) | 96.7 | 图表 |
| AIME 2025(GPT-5,thinking,无工具) | 94.6 | 图表;与正文 SOTA 94.6% 一致 |
| AIME 2025(GPT-5,thinking,python) | 99.6 | 图表 |
| AIME 2025(GPT-5,无 thinking,无工具) | 61.9 | 图表 |
| AIME 2025(GPT-5,无 thinking,python) | 71 | 图表 |
| AIME 2025(OpenAI o3,无工具) | 88.9 | 对照模型 |
| AIME 2025(OpenAI o3,python) | 98.4 | 对照模型 |
| AIME 2025(GPT-4o,python) | 42.1 | 对照模型 |
| FrontierMath Tier 1-3(GPT-5 pro,python) | 32.1 | 图表 |
| FrontierMath Tier 1-3(GPT-5,thinking,python) | 26.3 | 图表 |
| FrontierMath Tier 1-3(GPT-5,thinking,无工具) | 13.5 | 图表 |
| FrontierMath Tier 1-3(ChatGPT agent,browser+computer+terminal) | 27.4 | 图表 |
| FrontierMath Tier 1-3(OpenAI o4-mini,python) | 19.3 | 对照模型 |
| FrontierMath Tier 1-3(OpenAI o3,python) | 15.8 | 对照模型 |
| HMMT(GPT-5 pro,python) | 100 | 图表 |
| HMMT(GPT-5,thinking,python) | 96.7 | 图表 |
| HMMT(GPT-5,thinking,无工具) | 93.3 | 图表 |
| HMMT(OpenAI o3,python) | 93.3 | 对照模型 |

**学问答与专家级考试(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| GPQA Diamond(GPT-5 pro,python) | 89.4 | 图表 |
| GPQA Diamond(GPT-5 pro,无工具) | 88.4 | 图表;正文同列 88.4% |
| GPQA Diamond(GPT-5,thinking,python) | 87.3 | 图表 |
| GPQA Diamond(GPT-5,thinking,无工具) | 85.7 | 图表 |
| GPQA Diamond(GPT-5,无 thinking,无工具) | 77.8 | 图表 |
| GPQA Diamond(OpenAI o3,无工具) | 83.3 | 对照模型 |
| GPQA Diamond(GPT-4o,无工具) | 70.1 | 对照模型 |
| Humanity's Last Exam 全集(GPT-5 pro,python + search with blocklist) | 42 | 图表 |
| Humanity's Last Exam 全集(GPT-5 pro,无工具) | 30.7 | 图表 |
| Humanity's Last Exam 全集(GPT-5,thinking,python + search with blocklist) | 35.2 | 图表 |
| Humanity's Last Exam 全集(GPT-5,thinking,无工具) | 24.8 | 图表 |
| Humanity's Last Exam 全集(GPT-5,无 thinking,无工具) | 6.3 | 图表 |
| Humanity's Last Exam 全集(ChatGPT agent,browser+computer+terminal) | 41.6 | 对照模型 |
| Humanity's Last Exam 全集(ChatGPT agent,无工具) | 23 | 对照模型 |
| Humanity's Last Exam 全集(OpenAI o3,python + browser) | 24.3 | 对照模型 |
| Humanity's Last Exam 全集(OpenAI o3,无工具) | 14.7 | 对照模型 |
| Humanity's Last Exam 全集(Deep research,python + browser) | 26.6 | 对照模型 |
| Humanity's Last Exam 全集(GPT-4o,无工具) | 5.3 | 对照模型 |

**编码(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| SWE-bench Verified n=477(GPT-5,thinking) | 74.9 | 图表;与正文 SOTA 74.9% 一致 |
| SWE-bench Verified n=477(GPT-5,无 thinking) | 52.8 | 图表 |
| SWE-bench Verified n=477(OpenAI o3) | 69.1 | 对照模型 |
| SWE-bench Verified n=477(GPT-4o) | 30.8 | 对照模型 |
| SWE-bench Verified(GPT-5,effort low / medium / high) | 0.691 / 0.724 / 0.749 | 图表,小数为原值;对应 tokens 4201.96 / 7068.52 / 10684.08 |
| SWE-bench Verified(OpenAI o3,effort low / medium / high) | 0.6384 / 0.6709 / 0.691 | 对照模型,图表 |
| Aider Polyglot(GPT-5,thinking) | 88 | 图表;与正文 SOTA 88% 一致 |
| Aider Polyglot(GPT-5,无 thinking) | 26.7 | 图表 |
| Aider Polyglot(OpenAI o3) | 79.6 | 对照模型 |
| Aider Polyglot(GPT-4o) | 25.8 | 对照模型 |

**指令跟随与智能体(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Scale MultiChallenge(GPT-5,thinking) | 69.6 | 图表;脚注:默认 grader(GPT-4o)常误判,换 o3-mini 评分更准 |
| Scale MultiChallenge(GPT-5,无 thinking) | 54.9 | 同上脚注 |
| Scale MultiChallenge(OpenAI o3) | 60.4 | 对照模型 |
| Scale MultiChallenge(GPT-4o) | 40.3 | 对照模型 |
| BrowseComp(GPT-5,thinking) | 54.9 | 图表 |
| BrowseComp(ChatGPT agent) | 68.9 | 对照模型 |
| BrowseComp(OpenAI o3) | 49.7 | 对照模型 |
| COLLIE(GPT-5,thinking) | 99 | 图表 |
| COLLIE(GPT-5,无 thinking) | 70.5 | 图表 |
| COLLIE(OpenAI o3) | 98.4 | 对照模型 |
| COLLIE(GPT-4o) | 61 | 对照模型 |
| Tau2-bench airline / retail / telecom(GPT-5,无 thinking) | 0.55 / 0.728 / 0.386 | 图表,0–1 小数为原值 |
| Tau2-bench airline / retail / telecom(GPT-5,thinking) | 0.076 / 0.083 / 0.581 | 图表 |
| Tau2-bench airline / retail / telecom(OpenAI o3) | 0.648 / 0.802 / 0.582 | 对照模型 |
| Tau2-bench airline / retail / telecom(GPT-4o) | 0.455 / 0.634 / 0.235 | 对照模型 |

**多模态(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| MMMU(GPT-5,thinking) | 84.2 | 图表;与正文 SOTA 84.2% 一致 |
| MMMU(GPT-5,无 thinking) | 74.4 | 图表 |
| MMMU(OpenAI o3) | 82.9 | 对照模型 |
| MMMU(GPT-4o) | 72.2 | 对照模型 |
| MMMU Pro(GPT-5,thinking) | 78.4 | 图表;脚注:standard 与 vision 平均 |
| MMMU Pro(GPT-5,无 thinking) | 62.7 | 图表 |
| MMMU Pro(OpenAI o3) | 76.4 | 对照模型 |
| MMMU Pro(GPT-4o) | 59.9 | 对照模型 |
| CharXiv-Reasoning(GPT-5,thinking) | 81.1 | 图表 |
| CharXiv-Reasoning(GPT-5,无 thinking) | 57.8 | 图表 |
| CharXiv-Reasoning(OpenAI o3) | 78.6 | 对照模型 |
| CharXiv-Reasoning(GPT-4o) | 58.8 | 对照模型 |
| CharXiv-Reasoning(GPT-5,effort low / medium / high) | 0.74 / 0.775 / 0.811 | 图表;对应 samples 648.65 / 1801.63 / 4321.28 |
| CharXiv-Reasoning(OpenAI o3,effort low / medium / high) | 0.686 / 0.738 / 0.768 | 对照模型,图表 |
| ERQA(GPT-5,thinking) | 65.7 | 图表 |
| ERQA(GPT-5,无 thinking) | 42 | 图表 |
| ERQA(OpenAI o3) | 64 | 对照模型 |
| ERQA(GPT-4o) | 35.2 | 对照模型 |
| VideoMMMU, max frame 256(GPT-5,thinking) | 84.6 | 图表 |
| VideoMMMU, max frame 256(GPT-5,无 thinking) | 61.6 | 图表 |
| VideoMMMU, max frame 256(OpenAI o3) | 83.3 | 对照模型 |
| VideoMMMU, max frame 256(GPT-4o) | 61.2 | 对照模型 |

**健康(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| HealthBench(GPT-5,thinking) | 67.2 | 图表 |
| HealthBench(GPT-5,无 thinking) | 54.3 | 图表 |
| HealthBench(OpenAI o3) | 59.8 | 对照模型 |
| HealthBench(GPT-4o) | 32 | 对照模型 |
| HealthBench Hard(GPT-5,thinking) | 46.2 | 图表;与正文 SOTA 46.2% 一致 |
| HealthBench Hard(GPT-5,无 thinking) | 25.5 | 图表 |
| HealthBench Hard(OpenAI o3) | 31.6 | 对照模型 |
| HealthBench Hard(GPT-4o) | 0 | 对照模型 |
| HealthBench Hard 幻觉率(GPT-5,thinking) | 1.6 | 图表,越低越好 |
| HealthBench Hard 幻觉率(GPT-5,无 thinking) | 3.6 | 图表 |
| HealthBench Hard 幻觉率(OpenAI o3) | 12.9 | 对照模型 |
| HealthBench Hard 幻觉率(GPT-4o) | 15.8 | 对照模型 |

**事实性 / 幻觉 / 欺骗(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| 幻觉率:LongFact-Concepts / LongFact-Objects / FActScore(GPT-5,thinking) | 0.007 / 0.008 / 0.01 | 图表,越低越好 |
| 幻觉率:LongFact-Concepts / LongFact-Objects / FActScore(OpenAI o3) | 0.045 / 0.051 / 0.057 | 对照模型 |
| 响应级错误率(de-identified ChatGPT 流量)(GPT-5,thinking) | 4.8 | 图表 |
| 响应级错误率(GPT-5,无 thinking) | 11.6 | 图表 |
| 响应级错误率(OpenAI o3) | 22 | 对照模型 |
| 响应级错误率(GPT-4o) | 20.6 | 对照模型 |
| 欺骗评测:Coding deception / CharXiv 缺图 / 生产流量(GPT-5,thinking) | 0.165 / 0.09 / 0.021 | 图表;正文表述为 9% 与 2.1%,越低越好 |
| 欺骗评测:Coding deception / CharXiv 缺图 / 生产流量(OpenAI o3) | 0.474 / 0.867 / 0.048 | 对照模型;正文表述为 86.7% 与 4.8% |

**经济价值任务(内部,图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Economically important tasks(GPT-5,win+tie) | 47.146316153580074 | 图表原值;win-only 为 41.43894846074023 |
| Economically important tasks(OpenAI o3,win+tie) | 33.51781390522311 | 对照模型;win-only 为 26.876513317191282 |
| Economically important tasks(ChatGPT agent,win+tie) | 43.47976478727084 | 对照模型;win-only 为 36.00830162573504 |

**安全与有用性评分(图表)**

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| 安全评分 Benign / Dual / Malicious(GPT-5,thinking) | 0.92 / 0.84 / 0.83 | 图表 |
| 安全评分 Benign / Dual / Malicious(OpenAI o3) | 0.9 / 0.75 / 0.73 | 对照模型 |
| 有用性评分 Benign / Dual / Malicious(GPT-5,thinking) | 3.81 / 3.75 / 3.24 | 图表 |
| 有用性评分 Benign / Dual / Malicious(OpenAI o3) | 3.73 / 3.5 / 1.94 | 对照模型 |

页面脚注:AIME 等带工具成绩不应与无工具成绩直接比较;SWE-bench 评测使用固定子集 n=477;HLE 数字与此前博文略有出入(旧版 HLE);MultiChallenge 默认 grader 为 GPT-4o、常误判,o3-mini 评分显著更准;MMMUPro 取 standard 与 vision 平均。

## 协议脚注

- 页面快照 `page.html`：2026-09-01 抓取，方式 curl(直出)。
- 图片原始文件在 `images/`，逐张原始 URL 与像素尺寸见 `manifest.json`。
- 本节 benchmark 数值为对官方页面/图片的视觉转写，以原文为准；无法确认的数值不转录。

## 图片清单

- images/01.webp — 1080x1080 | alt='Expanding access to AI > Cover image' | 原URL: https://images.ctfassets.net/kftzwdyauwt9/x3ij3VqMj60KcdHucQvNc/414ce018aafcf0916557e00...
- images/02.webp — 1080x1080 | alt='ChatGPT for Teachers district expansion | Original neutral library cover' | 原URL: https://images.ctfassets.net/kftzwdyauwt9/4jHps0gmVQfIrnl2shwDBi/35e47854409876d353f3bb...
- images/03.webp — 2160x2160 | alt='Learning never stops card image' | 原URL: https://images.ctfassets.net/kftzwdyauwt9/rGBw0SMWP2aaIH5twRBgX/5f8f24d0e5a03eecfc74ab6...
- images/04.png — 1600x900 | 原URL: https://images.ctfassets.net/kftzwdyauwt9/6Dgf4Pz8NYQL3AXe5Y8Cq5/cd44291eaf82ef8b98afa5...
