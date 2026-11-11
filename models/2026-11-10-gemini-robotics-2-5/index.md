---
vendor: google
model: Gemini Robotics 2.5
release: gemini-robotics-2-5
date: 2026-11-10
source: https://deepmind.google/blog/gemini-robotics-2-5-accelerates-real-world-physical-intelligence/
fetched_at: 2026-11-10
---

# Gemini Robotics 2.5（Google DeepMind 机器人模型发布页证据归档）

发布日期证据链（三处互证）：

1. 发布页 `<meta property="article:published_time" content="2026-11-10T15:00:00+00:00">`。
2. 页面可见印刷日期行「November 10, 2026」（同页 `<time>` 元素）。
3. 页面 JSON-LD `datePublished` = `2026-11-10`（`dateModified` 同日）。

> ⚠️ **日期例外（已记录，不调和）**：Google DeepMind 官方 RSS（`https://deepmind.google/blog/rss.xml`）对同一条目给出 `pubDate: Mon, 09 Nov 2026 19:51:47 +0000`，比页面自身 `published_time` 早约 19 小时。本仓一贯口径以**页面自身发布元数据**为准，故 `release_date = 2026-11-10`；RSS 时间戳只作查漏线索保留。

## 本次发布是什么

Google DeepMind 于 2026-11-10 发布 **Gemini Robotics 2.5**，官方定位为「迄今能力最强的视觉-语言-动作（VLA）模型」，同时扩展机器人可学习技能的**广度**与**习得速度**：

> "Today, we are introducing Gemini Robotics 2.5, our most capable vision-language-action (VLA) model to date. Gemini Robotics 2.5 increases both the breadth of skills a robot can learn and the speed at which it can acquire them. This enhances dexterity, reliability, and safety to help robots step out of the lab and into more unstructured, real-world environments, where they can assist people with a greater range of tasks."

官方把进展归为三条主线：

- **Dexterity（灵巧）**："Our robots can perform significantly more tasks with greater performance and dexterity — from using everyday tools to handling delicate, flexible objects."
- **Reliability（可靠性）**："During a real-world proof-of-concept on Mercedes-Benz production lines, our models helped Apptronik's Apollo 2 humanoid pick and pack automotive parts with a **96% success rate**."
- **Safety（安全）**："we have improved physical safety steerability and introduced a new benchmark to test against adversarial jailbreaks specific to robotics."

配套型号为 **Gemini Robotics ER**（具身推理模型）：产线概念验证中由 ER 跟踪工作流与多步推理、由 Gemini Robotics 2.5 动作模型控制手臂与手部。

评测覆盖：官方称在 **200 余项真实任务**上评估（"We evaluated the model across 200 distinct tasks — such as serving food with tongs, tying a bow on a gift box, and pipetting a liquid"），机器人平台为 Apptronik **Apollo 2** 人形机器人（五指、22 自由度 SharpaWave 手）与 Franka **Duo** 双指平行夹爪平台。

## ASIMOV-Jailbreak：随发布公开的新开源安全基准

> "To test jailbreak robustness, we are releasing **ASIMOV-Jailbreak**, a new open-source benchmark containing hundreds of prompts that disguise unsafe requests across dozens of scenes. **Argon achieves a 99.5% jailbreak resistance — a significant improvement over the 82% rate of our previous baseline, Gemini Robotics ER 2.**"

- 数据集托管：`https://huggingface.co/datasets/google/asimov_agentic`（Google 官方 HF 组织）。
- 该 99.5% 的取值主体是 Google 自家模型 **Gemini 4 Argon**（不是 Gemini Robotics 2.5 本身），故账本 `model_id = gemini-4-argon`，并在本行 notes 声明；82% 是同厂上一代基线 Gemini Robotics ER 2，按口径进 notes、不另建行。
- 官方另称 Gemini 4 Argon 在三项 agentic robotics 评测上领先，链接指向 Gemini 4 安全报告 PDF 第 200 页（`https://storage.googleapis.com/deepmind-media/gemini/gemini_4_safety_report.pdf#page=200`）；该 PDF 未在本页给出可机读分值，故不建行。

## Mercedes-Benz 产线概念验证

> "we partnered with Apptronik and Mercedes-Benz to use Apollo 2 humanoid robots on active automotive production lines in Kecskemét, Hungary, and Sindelfingen, Germany."

> "Using our embodied reasoning model (**Gemini Robotics ER**) to keep track of the workflow, and the **Gemini Robotics 2.5** actions model to control its hands and arms, the robot reaches into supply bins, picks up metal automotive brackets, and places them into sequencing containers, all while correcting for any gaps. **Achieving a 96% success rate**, this pilot shows promising progress toward widespread real-world industrial applications."

> ⚠️ **这是真实产线上的客户概念验证，不是标准化公开基准**：无公开题集、无统一协议，**不可与本档其余基准分横向比较**。账本中已单列 `apollo-automotive-kitting` 并在 metric 与 notes 双重标注。

## 官方评测图（4 张，位图）

四张图为发布页内嵌官方柱状图（`images/`），每张横轴为任务、纵轴为 Success rate，浅色斜纹柱为上一代 **Gemini Robotics 2**、蓝色实心柱为 **Gemini Robotics 2.5**。图为**位图**，按「图行不自动翻 verified」红线，4 条 evidence 记 `pending`（`value=null`、`score_status=not_extracted`），转写值只进 notes。

| 评测组 | 官方高亮任务读作（Gemini Robotics 2.5 / Gemini Robotics 2） |
|---|---|
| Tabletop pick & place | Pick up a lime and put it on the top shelf（Apollo + Sharpa）**100% / 0%**；Extract disk drive from bay（Duo）**100% / 0%**；Pick rubber duck and place on yellow plate（Duo）**100% / 86%**；Clean up kitchen mixer（Apollo + Sharpa）**60% / 0%** |
| Multi-step & contact-rich | Close lid of black toolbox（Duo）**93% / 0%**；Unhang mug from table（Duo）**75% / 29%**；Pack rice cooker（Apollo + Sharpa）**40% / 0%**；Sweep trash into dustpan with brush（Apollo + Sharpa）**52% / 0%** |
| Precision kitting & insertion | Unscrew light bulb（Apollo + Sharpa）**90% / 63%**；Take a picture with the Polaroid camera（Duo）**92% / 0%**；Put the pliers in the black toolbox（Duo）**82% / 7%**；Kit all tools into bin（Duo）**70% / 33%** |
| Dexterous tools & deformables | Pack pastries into box using tongs（Apollo + Sharpa）**100% / 5%**；Untie ribbon bow on gift box（Apollo + Sharpa）**70% / 0%**；Hang cardigan sweater on clothes hanger（Apollo + Sharpa）**62% / 0%**；Fold pants with board（Apollo + Sharpa）**40% / 0%** |

> 转写值为**视觉读数**，未经页面 DOM 明文确认，需另起「重读归档图片」专项批次才能翻 verified；本批不自动翻。

## 完整数值转录表（含未建行项）

| 评测 | 分数 | 备注 |
|---|---|---|
| ASIMOV-Jailbreak 越狱抵抗力（Gemini 4 Argon） | 99.5% | 正文明文绝对分，已建行（`verified`）。基线 Gemini Robotics ER 2 = 82%，同厂前代模型，进 notes |
| Mercedes-Benz 产线零件拣配成功率 | 96% | 正文明文绝对分，已建行（`verified`）。**真实产线概念验证，非标准化基准** |
| Tabletop pick & place 任务集 | 见上表 | 位图视觉转写，已建行（`pending`），4 个高亮任务读数进 notes |
| Multi-step & contact-rich 任务集 | 见上表 | 位图视觉转写，已建行（`pending`） |
| Precision kitting & insertion 任务集 | 见上表 | 位图视觉转写，已建行（`pending`） |
| Dexterous tools & deformables 任务集 | 见上表 | 位图视觉转写，已建行（`pending`） |
| 较前代基线的成功率提升 | 30% ~ 100% | 相对口径，**未建行**，只进 notes |
| 任务完成速度提升 | 20% ~ 30% | 相对口径，**未建行** |
| 绕障安全任务完成率提升 | 33% | 相对口径，**未建行** |
| 绕行人安全任务完成率提升 | 43% | 相对口径，**未建行** |
| 评估任务规模 | 200 余项 | 规模数字，非评测分，**未建行** |
| 三项 agentic robotics 评测领先（Argon） | — | 定性论断 + 外链安全报告 PDF，无可机读分值，**未建行** |
| 参数量 / 上下文长度 / 定价 | — | 官方均未明示，账本三字段记 `null` |

## 未建行的原因与不调和项

- **相对口径不建行**：30%~100% 成功率提升、20%~30% 速度提升、33% / 43% 安全完成率提升均为「相对前代」的增幅，不是可比较的绝对分，按仓库口径只进 notes 与本表。
- **不调和项**：官方 RSS `pubDate` 与页面 `published_time` 相差约 19 小时，已按页面元数据取值并在上方写明，未做折中。
- **所有数值均为厂商自报**，外部未做独立复跑。
