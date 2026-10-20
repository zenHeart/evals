---
vendor: openai
model: GPT-6 Instant / GPT-6 Sol (October) / GPT-6 Luna (October)
release: gpt-6-october
date: 2026-10-07
source: https://openai.com/index/gpt-6-for-everyone/
fetched_at: 2026-10-20
---

# GPT-6 and Intelligent UI for everyone（OpenAI，2026-10-07）

> 本归档含同一发布事件的两份官方一级材料：
> `page.html` = 官方发布页 `https://openai.com/index/gpt-6-for-everyone/`；
> `system-card.html` = 部署安全中心系统卡 `https://deploymentsafety.openai.com/gpt-6-october`（页面标注 "Published October 7, 2026"）。
> 发布日证据：发布页文章头部印刷日期行「2026年10月7日」，系统卡页印刷日期行「Published October 7, 2026」，两处互证。

## 发布要点（转录）

- OpenAI 宣布把 GPT-6 推送给全部 ChatGPT 用户：搭载「智能界面」的 GPT-6 当天起面向全球 ChatGPT Plus、Pro、Business、Enterprise 用户逐步推出，次日扩展到免费版与 Go 用户；Enterprise 是否可用取决于工作区管理员设置。
- ChatGPT 中 GPT-6 的底层模型分档：付费档（Plus/Pro/Business/Enterprise）为 **GPT-6 Sol**，免费档与 Go 为 **GPT-6 Luna**，两款都针对日常对话调优。本次更新只作用于「聊天」体验，不改变「工作」模式与 Codex 使用的模型。
- 新增 **智能界面**（Intelligent UI）：GPT-6 可把文字、视觉内容与交互元素组合起来作答，回答中可含图形、可点按按钮、表单与图表，并能在模型生成界面的同时逐步呈现。
- 官方称推理模型推出后用户必须等模型思考完成才能得到回答，现在 ChatGPT 可以交替思考与回答。
- 安全方面：GPT-6 沿用 Astra 的多项安全改进，官方称相比 GPT-5.6 Sol 更能抵御绕过安全训练的尝试、遵循安全防护要求，并更清楚地说明自身能力边界；系统卡同时给出「对抗性测试」的说明。

## 官方给出的量化论断（正文，无标准公开基准名 → 不建 evidence 行）

- 「在一项针对高价值日常智能体任务的内部评估中，GPT-6 的『极高』档位能够在与 GPT-5.6 的『中』档位相同的时间内开始回答，同时取得了高于 GPT-5.6『极高』档位的综合得分。」——内部评估，官方未给基准名与绝对数值。
- 「对于需要网页搜索的问题，GPT-6『即时』档位开始回答所需的时间比 GPT-5.6『即时』档位平均缩短了 44%。」——首字延迟的相对改善，非公开基准分数。
- 官方称 GPT-6 面向每周使用 ChatGPT 的超过 12 亿人打造。

## 评测数据（系统卡 DOM 机读表逐行转录）

> 说明：下列数值均来自系统卡的 DOM 表格（可定位到表头与行），按契约直接记入数值。同一行中的他模型列（GPT-5.5 Instant / GPT-5.6 Luna / GPT-5.6 Sol）属于对比列，只写在「备注」列，不拆成独立行。
> 表头中的 `GPT-6 Sol (October)` 与 `GPT-6 Luna (October)` 即本 release 的两个自家模型列。

### Table 1: Production Benchmarks with Challenging Prompts (higher is better)

安全完成率（0-1 比例，越高越好）。官方声明该集合刻意困难，错误率不代表真实生产流量。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Violent Illicit behavior | GPT-6 Sol (October) 0.948 / GPT-6 Luna (October) 0.959 | 对比列：GPT-5.5 Instant (May Update) 0.959；GPT-5.5 Instant (June Update) 0.967；GPT-5.6 Luna (August) 0.957；GPT-5.6 Sol (August) 0.959 |
| Non-Violent Illicit behavior | GPT-6 Sol (October) 0.980 / GPT-6 Luna (October) 0.984 | 对比列：GPT-5.5 Instant (May Update) 0.984；GPT-5.5 Instant (June Update) 0.987；GPT-5.6 Luna (August) 0.990；GPT-5.6 Sol (August) 0.997 |
| Extremism | GPT-6 Sol (October) 0.915 / GPT-6 Luna (October) 0.894 | 对比列：GPT-5.5 Instant (May Update) 0.957；GPT-5.5 Instant (June Update) 0.936；GPT-5.6 Luna (August) 0.936；GPT-5.6 Sol (August) 0.915 |
| Hate | GPT-6 Sol (October) 0.965 / GPT-6 Luna (October) 0.965 | 对比列：GPT-5.5 Instant (May Update) 1.000；GPT-5.5 Instant (June Update) 0.965；GPT-5.6 Luna (August) 0.965；GPT-5.6 Sol (August) 0.982 |
| Self-harm (standard) | GPT-6 Sol (October) 0.896 / GPT-6 Luna (October) 0.901 | 对比列：GPT-5.5 Instant (May Update) 0.875；GPT-5.5 Instant (June Update) 0.937；GPT-5.6 Luna (August) 0.932；GPT-5.6 Sol (August) 0.934 |
| Gore | GPT-6 Sol (October) 0.845 / GPT-6 Luna (October) 0.812 | 对比列：GPT-5.5 Instant (May Update) 0.865；GPT-5.5 Instant (June Update) 0.832；GPT-5.6 Luna (August) 0.867；GPT-5.6 Sol (August) 0.872 |
| Sexual | GPT-6 Sol (October) 0.944 / GPT-6 Luna (October) 0.899 | 对比列：GPT-5.5 Instant (May Update) 0.977；GPT-5.5 Instant (June Update) 0.961；GPT-5.6 Luna (August) 0.971；GPT-5.6 Sol (August) 0.893 |
| Sexual/minors | GPT-6 Sol (October) 0.887 / GPT-6 Luna (October) 0.829 | 对比列：GPT-5.5 Instant (May Update) 0.991；GPT-5.5 Instant (June Update) 0.939；GPT-5.6 Luna (August) 0.966；GPT-5.6 Sol (August) 0.922 |

### Table 2: U18 evaluations (higher is better)

18 岁以下用户安全评测的合规比例（0-1 比例，越高越好）。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Age-restricted goods, services, and dangerous challenges / activities | GPT-6 Sol (October) 0.799 / GPT-6 Luna (October) 0.814 | 对比列：GPT-5.5 Instant (May Update) 0.756；GPT-5.5 Instant (June Update) 0.725；GPT-5.6 Luna (August) 0.857；GPT-5.6 Sol (August) 0.865 |
| Sexual Content | GPT-6 Sol (October) 0.933 / GPT-6 Luna (October) 0.904 | 对比列：GPT-5.5 Instant (May Update) 0.958；GPT-5.5 Instant (June Update) 0.962；GPT-5.6 Luna (August) 0.984；GPT-5.6 Sol (August) 0.971 |
| Eating Disorders | GPT-6 Sol (October) 0.772 / GPT-6 Luna (October) 0.776 | 对比列：GPT-5.5 Instant (May Update) 0.657；GPT-5.5 Instant (June Update) 0.635；GPT-5.6 Luna (August) 0.810；GPT-5.6 Sol (August) 0.808 |
| Emotional Reliance | GPT-6 Sol (October) 0.770 / GPT-6 Luna (October) 0.734 | 对比列：GPT-5.5 Instant (May Update) 0.944；GPT-5.5 Instant (June Update) 0.937；GPT-5.6 Luna (August) 0.927；GPT-5.6 Sol (August) 0.921 |
| Self Harm | GPT-6 Sol (October) 0.977 / GPT-6 Luna (October) 0.974 | 对比列：GPT-5.5 Instant (May Update) 0.982；GPT-5.5 Instant (June Update) 0.977；GPT-5.6 Luna (August) 0.977；GPT-5.6 Sol (August) 0.987 |
| Gore | GPT-6 Sol (October) 0.845 / GPT-6 Luna (October) 0.812 | 对比列：GPT-5.5 Instant (May Update) 0.865；GPT-5.5 Instant (June Update) 0.832；GPT-5.6 Luna (August) 0.867；GPT-5.6 Sol (August) 0.872 |

### Table 3: Image input evaluations, with metric safe completion (higher is better)

图像输入安全评测的合规比例（0-1 比例，越高越好）。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| hate | GPT-6 Sol (October) 0.986 / GPT-6 Luna (October) 0.974 | 对比列：GPT-5.5 Instant (May Update) 0.994；GPT-5.5 Instant (June Update) 0.993；GPT-5.6 Luna (August) 0.984；GPT-5.6 Sol (August) 0.986 |
| extremism | GPT-6 Sol (October) 0.868 / GPT-6 Luna (October) 0.834 | 对比列：GPT-5.5 Instant (May Update) 0.964；GPT-5.5 Instant (June Update) 0.987；GPT-5.6 Luna (August) 0.930；GPT-5.6 Sol (August) 0.950 |
| self-harm | GPT-6 Sol (October) 0.956 / GPT-6 Luna (October) 0.962 | 对比列：GPT-5.5 Instant (May Update) 0.993；GPT-5.5 Instant (June Update) 0.996；GPT-5.6 Luna (August) 0.990；GPT-5.6 Sol (August) 0.987 |
| harms-erotic | GPT-6 Sol (October) 0.981 / GPT-6 Luna (October) 0.975 | 对比列：GPT-5.5 Instant (May Update) 0.999；GPT-5.5 Instant (June Update) 0.999；GPT-5.6 Luna (August) 0.994；GPT-5.6 Sol (August) 0.986 |

### Table 7: Dynamic Benchmarks with Adversarial User Simulations (higher is better)

对抗式用户模拟动态评测：不违反安全策略的助手消息占比（0-1 比例，越高越好）。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Mental health | GPT-6 Sol (October) 0.996 / GPT-6 Luna (October) 0.991 | 对比列：GPT-5.5 Instant (May Update) 0.981；GPT-5.5 Instant (June Update) 0.991；GPT-5.6 Luna (August) 0.977；GPT-5.6 Sol (August) 0.981 |
| Emotional reliance | GPT-6 Sol (October) 0.961 / GPT-6 Luna (October) 0.961 | 对比列：GPT-5.5 Instant (May Update) 0.988；GPT-5.5 Instant (June Update) 0.989；GPT-5.6 Luna (August) 0.965；GPT-5.6 Sol (August) 0.961 |
| Self-harm | GPT-6 Sol (October) 0.889 / GPT-6 Luna (October) 0.884 | 对比列：GPT-5.5 Instant (May Update) 0.852；GPT-5.5 Instant (June Update) 0.967；GPT-5.6 Luna (August) 0.911；GPT-5.6 Sol (August) 0.901 |

### Table 10: Biology Model Refusal Evaluation (higher is better)

生物高风险提示上的安全拒答比例（0-1 比例，越高越好）。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Severe | GPT-6 Sol (October) 0.954 / GPT-6 Luna (October) 0.980 | 对比列：Metrics Safe；GPT-5.5 Instant (May Update) 0.969；GPT-5.5 Instant (June Update) 0.969；GPT-5.6 Luna (August) 0.937 |
| Dual Use | GPT-6 Sol (October) 0.945 / GPT-6 Luna (October) 0.971 | 对比列：Metrics Safe；GPT-5.5 Instant (May Update) 0.957；GPT-5.5 Instant (June Update) 0.939；GPT-5.6 Luna (August) 0.928 |

### Table 11: Cybersecurity Safety Evaluation (higher is better)

网络安全安全评测的安全完成率（0-1 比例，越高越好）。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Production Chat | GPT-6 Sol (October) 0.973 / GPT-6 Luna (October) 0.971 | 对比列：GPT-5.5 Instant (May Update) 0.977；GPT-5.5 Instant (June Update) 0.974；GPT-5.6 Luna (August) 0.974；GPT-5.6 Sol (August) 0.982 |
| Synthetic Agentic Envs | GPT-6 Sol (October) 0.999 / GPT-6 Luna (October) 0.998 | 对比列：GPT-5.5 Instant (May Update) 0.994；GPT-5.5 Instant (June Update) 0.998；GPT-5.6 Luna (August) 0.997；GPT-5.6 Sol (August) 0.999 |

### Table 3: GPT-RED indirect prompt-injection robustness (higher is better)

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| 间接提示注入鲁棒性 | GPT-6 Sol (October) 97.13% / GPT-6 Luna (October) 95.80% | 按可用推理档位等权平均；同页正文另给「指令层级」子集：Sol 99.99% / Luna 99.79% |

### Table 5: HealthBench evaluations（长度调整后 0-100 分，括号内为未调整分与平均可见回答长度）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| HealthBench Professional | GPT-6 Sol (October) 55.2 (62.2, 4,360) / GPT-6 Luna (October) 48.2 (57.8, 5,289) | 对比列：gpt-5.6-luna(August) 44.1 (46.8, 2,920)；gpt-5.6-sol(August) 54.0 (56.6, 2,894)；gpt-5.5Instant 38.4 (40.7, 2,775) |
| HealthBench | GPT-6 Sol (October) 52.1 (55.7, 2,602) / GPT-6 Luna (October) 50.4 (58.5, 3,361) | 对比列：gpt-5.6-luna(August) 53.3 (50.7, 1,567)；gpt-5.6-sol(August) 55.0 (52.1, 1,514)；gpt-5.5Instant 51.4 (50.9, 1,922) |
| HealthBench Hard | GPT-6 Sol (October) 27.8 (30.9, 2,396) / GPT-6 Luna (October) 27.2 (36.1, 3,134) | 对比列：gpt-5.6-luna(August) 28.7 (24.9, 1,523)；gpt-5.6-sol(August) 31.4 (27.1, 1,450)；gpt-5.5Instant 22.9 (21.3, 1,794) |
| HealthBench Consensus | GPT-6 Sol (October) 93.8 (94.0, 2,608) / GPT-6 Luna (October) 95.0 (95.5, 3,343) | 对比列：gpt-5.6-luna(August) 94.8 (94.6, 1,553)；gpt-5.6-sol(August) 95.5 (95.3, 1,511)；gpt-5.5Instant 94.7 (94.6, 1,919) |

> 长度调整口径：2,000 字符以内不调整；每多 500 字符，HealthBench 扣 2.99 分、HealthBench Professional 扣 1.47 分、HealthBench Hard 扣 3.92 分、HealthBench Consensus 扣 0.20 分；模型在提示中看不到该惩罚。

### Table 6: MentalHealthBench（task-clipped 0-100 分，± 为标准误）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| MentalHealthBench (overall) | GPT-6 Sol (October) 48.81 ± 0.97 / GPT-6 Luna (October) 51.73 ± 0.96 | 对比列：gpt-5.6-luna(August) 45.11 ± 0.95；gpt-5.6-sol(August) 47.53 ± 0.97；gpt-5.5Instant(June) 53.93 ± 0.93；gpt-5.5Instant(May) 49.38 ± 0.93 |
| MentalHealthBench (non-acute) | GPT-6 Sol (October) 47.62 ± 1.31 / GPT-6 Luna (October) 51.68 ± 1.28 | 对比列：gpt-5.6-luna(August) 43.10 ± 1.29；gpt-5.6-sol(August) 47.07 ± 1.30；gpt-5.5Instant(June) 52.96 ± 1.26；gpt-5.5Instant(May) 51.91 ± 1.23 |
| MentalHealthBench (high acuity) | GPT-6 Sol (October) 53.70 ± 2.26 / GPT-6 Luna (October) 56.15 ± 2.25 | 对比列：gpt-5.6-luna(August) 52.58 ± 2.19；gpt-5.6-sol(August) 53.88 ± 2.28；gpt-5.5Instant(June) 58.76 ± 2.11；gpt-5.5Instant(May) 50.23 ± 2.17 |
| MentalHealthBench (emergent) | GPT-6 Sol (October) 47.92 ± 1.89 / GPT-6 Luna (October) 48.98 ± 1.87 | 对比列：gpt-5.6-luna(August) 44.12 ± 1.81；gpt-5.6-sol(August) 44.30 ± 1.87；gpt-5.5Instant(June) 52.66 ± 1.81；gpt-5.5Instant(May) 44.03 ± 1.80 |

> 共 1,215 个任务，其中非急性 650、急性 221、紧急 344；每个回答按 rubric 打分截断到 0-100，再对任务取均值，标准误按任务均值计算。

### Table 8: Biological and Chemical Capabilities: High Threshold

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Multimodal Troubleshooting Virology | GPT-6 Sol (October) 51.68% / GPT-6 Luna (October) 48.13% | 口径 pass@1；官方 High 阈值 31% |
| ProtocolQA Open-Ended | GPT-6 Sol (October) 25.62% / GPT-6 Luna (October) 34.57% | 口径 pass@1；官方 High 阈值 54% |
| Tacit Knowledge and Troubleshooting | GPT-6 Sol (October) 72.45% / GPT-6 Luna (October) 94.00% | 口径 cons@32；官方 High 阈值 80% |
| TroubleshootingBench | GPT-6 Sol (October) 41.83% / GPT-6 Luna (October) 41.46% | 口径 pass@1；官方 High 阈值 36.4% |

### Table 9: Biological and Chemical Capabilities: Critical Threshold

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| SHP2 Protein Function Prediction | GPT-6 Sol (October) 0.23 / GPT-6 Luna (October) 0.13 | 口径 Mean R² (higher is better)；官方 Critical 阈值 0.60 |
| Coronavirus--ACE2 Cell-Entry Screen | GPT-6 Sol (October) 0.349 / GPT-6 Luna (October) 0.36 | 口径 Composite score (higher is better)；官方 Critical 阈值 0.75 |
| Phage--plasmid Co-evolution | GPT-6 Sol (October) 12.95 / GPT-6 Luna (October) 10.70 | 口径 Negative log-likelihood (lower is better)；官方 Critical 阈值 ≤ 9.40 |

### 正文明文的其余三项

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| ExploitBench | GPT-6 Sol (October) 82.62% / GPT-6 Luna (October) 44.66% | 最高推理档；官方提醒公开基准含历史漏洞，结果可能被高估 |
| SEC-Bench Pro | GPT-6 Sol (October) 68.85% / GPT-6 Luna (October) 48.50% | 同段对比列：GPT-6 Astra 85.4% |
| Respecting Warnings | GPT-6 Sol (October) 28% / GPT-6 Luna (October) 15.9% | 取自图 5 图注的正文描述（越低越好）；对比列：GPT-5.6 Sol (Aug) 34%、GPT-5.6 Luna (Aug) 27% |

## 图表行（数值只存在于图中，本批不记数值）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Safety and non-overrefusal on challenging prompts（Figure 1） | — | `images/figure-1.png`；正文只给方向性结论，数值未转录 |
| Multiturn jailbreak robustness by attacker budget（Figure 2） | — | `images/figure-2.png`；正文只给比较性结论，数值未转录 |
| Response-level and claim-level factual error rates（Figure 3） | — | `images/figure-3.png`；三组提示集（factuality-heavy / user-flagged / high-stakes）数值未转录 |
| Respecting Auto-Review：Prohibited actions completed（Figure 4） | — | `images/figure-4.png`；正文只给旁证（GPT-5.6 各 0.3%，GPT-6 未出现此类案例） |
| Respecting Warnings：Conditional failure rates（Figure 5） | — | `images/figure-5.png`；图注正文已给 GPT-6 数值，见上表 |
| Blocker Deception：Blocker-related disclosure failure rates（Figure 6） | — | `images/figure-6.png`；正文只给方向性结论 |
| Broken Search Tool（Figure 7） | — | `images/figure-7.png`；正文只给方向性结论 |

## 规格（取自 OpenAI API 官方模型文档页，2026-10-20 抓取）

| 项 | GPT-6 Sol | GPT-6 Luna |
| --- | --- | --- |
| 上下文窗口 | 1,050,000 token | 1,050,000 token（最大输入 922,000） |
| 最大输出 | 128,000 token | 128,000 token |
| 知识截止 | 2026-04-20 | 2026-05-18 |
| 输入价 | $2.00 / 1M token | $0.10 / 1M token |
| 输出价 | $10.00 / 1M token | $0.50 / 1M token |
| 模态 | 文本输入输出、图像仅输入 | 文本输入输出、图像仅输入 |
| reasoning.effort | none / low / medium(默认) / high / xhigh / max | 同左 |

> 参数量：发布页与系统卡均未明示，账本记 null。
> 定价为 API 模型文档页当前标价（2026-10-20 抓取），非发布文印出的发布价。

## 归档说明

- `page.html`：官方发布页渲染后 DOM 存档（OpenAI 对直连与 reader 返回 Cloudflare managed challenge，本机经无头 Chrome 渲染取得）。
- `system-card.html`：部署安全中心系统卡渲染后 DOM 存档；`images/` 下 7 张 PNG 为该卡原图（Figure 1-7 的官方图床文件，已按图号重命名）。
- 系统卡页面正文语言为英文；官方发布页在本次抓取时返回中文版本页面（标题「让每个人都能使用 GPT-6 和智能界面」），日期行同为 2026年10月7日。
