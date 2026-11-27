---
vendor: google
model: Mass Spec Skills
release: mass-spec-skills
date: "2026-11-25"
source: https://deepmind.google/blog/interpreting-mass-spectra-with-google-antigravity/
fetched_at: "2026-11-27"
---

# Mass Spec Skills for Antigravity（官方归档转录）

发布日期证据：官方页 JSON-LD `datePublished` = **2026-11-25T17:00:00+00:00**，页面印刷日期行「**November 25, 2026**」。Google DeepMind 官方博客 RSS（`deepmind.google/blog/rss.xml`）同条 `pubDate` 为 **Tue, 24 Nov 2026 13:07:53 +0000**，与页面印刷日不同源 → 按页面口径取 `release_date=2026-11-25`。

来源：https://deepmind.google/blog/interpreting-mass-spectra-with-google-antigravity/

## 官方定位

Google Antigravity 推出 **Mass Spec Skills**：把社区通用的质谱工具（GNPS / MoNA 实验谱库检索、MAGMa 与 MetFrag 碎片解析、分子式预测、成对中性丢失查表）与 Antigravity 的智能体推理结合，替化学家完成谱图解读的脏活，同时把需要科学判断的决策权留给研究者。官方称之为「golden triad」：Gemini + AI Agent + Mass Spec Skills。

当天即可用：下载 Antigravity App 安装 Mass Spec 插件；企业用户可用 Google Cloud 凭据选「Use Business Account」登录。官方另面向 **10,000 名科学家**提供 Antigravity 最高用量档 **6 个月免费**（滚动录取，需申请、视资格与容量）。

## 官方明示的评测协议

| 项 | 官方口径 |
|---|---|
| 题集 | MoNA 收录的 **Enamine REAL MS/MS collection**，采样 **100 个化合物**（结构同时收录于 PubChem），并过滤碎片不足的记录（完整前体、几乎未碎裂的二聚体等） |
| 三种设置 | (1) Antigravity **无互联网无技能**；(2) Antigravity **用户许可的互联网访问**；(3) 同样的互联网访问 **+ Mass Spec Skills** |
| 受测模型 | 轻量级 **Gemini 3.8 Flash**；前沿模型 **Gemini 4 Argon**、**Gemini 4 Carbon** |
| 尝试次数 | 每条谱图 **3 次尝试**（100 化合物 × 3 = 300 次尝试） |
| 时限 | **1 小时**墙钟预算，超出即按 **0% 失败**计 |
| 剔除规则 | 瞬时基础设施错误与配额错误剔除 |
| 统计口径 | **mean + 95% 置信区间** |
| 判分 | **exact match**：识别出的分子结构须与真值完全一致（不涉及模型自评） |

## 官方正文明文结论（逐条转录）

| 设置 | 官方原句 | 口径 |
|---|---|---|
| 无互联网无技能 | 「With no internet access or skills, accuracy remained **below 4%** across all three models, confirming that they cannot reliably deduce molecular structures from the peak list alone.」 | 三模型**合并上界**，未逐模型拆分 |
| 仅互联网访问 | 「…custom search scripts written from scratch proved brittle around precursor windows, adducts, and noisy peaks, causing the **frontier models to miss a quarter to a third** of the spectra and the **lightweight model to miss more than three-quarters**.」 | 前沿模型（Argon / Carbon）漏检 1/4–1/3；轻量模型（Flash）漏检 >3/4；区间与上界，无单一数值 |
| 互联网 + Skills | 「With the Mass Spec Skills added, **all three models identified and verified the exact molecule in around 97%** of attempts, with the lightweight model matching the frontier models' accuracy (Figure 5a).」 | 三模型**合并约数**（around 97%） |
| token 成本 | 「…cutting generated tokens per attempt across every model: **by nearly four times on Flash, by half on Argon, and by nearly a fifth on Carbon** (Figure 5b).」 | 三种措辞量纲不统一：Flash「降到近四分之一」、Argon「减半」、Carbon「削掉近五分之一」 |

官方对技能价值的解释：不给技能时模型只能盯着原始峰表硬猜，token 消耗最高；只给联网时模型要现写 API 查询脚本并反复调试，token 仍然可观；装上 Mass Spec Skills 后智能体改为调用经过验证的即用技能，**每个模型的每次尝试生成 token 都下降**。

## 官方图表转录（人工读图，未人工确认）

> **可机读性说明**：官方 Figure 5a / 5b 以 **SVG** 提供，且**全部文字已转为 path 路径**——`<text>` 0 个、`<tspan>` 0 个、无 `aria-label`、无 `title`/`desc`，图中数字与标签**不可机读**。下表读数由归档 SVG 渲染后人工读柱高得到，Figure 5a 误差约 ±1 个百分点、Figure 5b 误差约 ±0.05×，仅供人工复核参考。

### Figure 5a — Exact-match identification accuracy（100 条公开基准谱图，每谱图 3 次尝试）

| 模型 | 无互联网无技能 | 仅互联网访问 | 互联网 + Mass Spec Skills |
|---|---|---|---|
| Gemini 3.8 Flash | 约 1% | 约 24% | 约 97% |
| Gemini 4 Argon | 约 1% | 约 67% | 约 97% |
| Gemini 4 Carbon | 约 4% | 约 74% | 约 97% |

交叉自洽检查：无技能三柱均 <4%（与正文上界一致）；仅互联网时 Flash 漏检约 76%（>3/4 ✓）、Argon 漏检约 33%、Carbon 漏检约 26%（均落在 1/4–1/3 ✓）；加技能后三柱均约 97%（与正文 around 97% ✓）。

### Figure 5b — Relative generated tokens（基线 = Gemini 4 Argon + 仅互联网 = 1.0× 虚线）

| 模型 | 无互联网无技能 | 仅互联网访问 | 互联网 + Mass Spec Skills |
|---|---|---|---|
| Gemini 3.8 Flash | 约 2.7× | 约 2.3× | 约 0.63× |
| Gemini 4 Argon | 约 2.6× | **1.0×（基线）** | 约 0.50× |
| Gemini 4 Carbon | 约 4.2× | 约 1.55× | 约 1.25× |

交叉自洽检查：Flash 的「仅互联网 → 加技能」之比约 3.6×（与 prose「by nearly four times」一致）；Argon 的 1.0× → 0.50× 恰为「by half」；Carbon 的 1.55× → 1.25× 降幅约 19%（与 prose「by nearly a fifth」一致）。Carbon 的最后一根柱在官方 SVG 画布右缘略有裁切，按柱顶读数。

## 逐例工作流转录（Figure 2/3/4 的单例细节，非基准读数）

- 演示样本：分子式 **C20H21ClN6O**，在 PubChem 中检索 **845 个同分异构体**并按模拟碎片与中性丢失打分。
- 谱图预处理：负离子模式串联质谱，前体 m/z 395.1387，**1,761 个原始峰**过滤为 **19 个预处理峰**。
- 碎片指认：MAGMa + MetFrag + 成对中性丢失查表，解释 **19 个峰中的 14 个**，占 summed fragment intensity 的 **97.7%**；碎片经 HCl 与 HNCO 连续中性丢失相连，定位氯原子与脲基；m/z 162.1037（45.1%）与 m/z 232.0283（6.8%）为一对互补半体。
- 排序决胜：同分异构体并列时改用反应化学一致性判别——三唑并苯并氮杂䓬（CID 154638626）因缺少脲基连接、无 HNCO 丢失路径被排除；最终 Rank 1 为 CID 137835447（键断裂打分 26.0），Rank 2 为 CID 55558151。
- 谱库检索：GNPS 与 MoNA，去噪碎片峰按 **cosine similarity** 打分，容差由用户指定或按仪器匹配；检索无高置信命中时回退到分子式预测 + 化学数据库检索。

## 官方明示的能力边界

- 镜像异构体（mirror-image molecules）与部分相近异构体**无法仅凭 LC-MS/MS 区分**，需要色谱保留时间、离子迁移率或 NMR 等其他测量。
- 许多天然产物等真正的新分子**不在任何现有数据库中**，Antigravity 无法自行检索或确证结构，只能给出有依据的起点：预测分子式、碎片指认与详细标注表。

## 未建行项与理由

| 官方数值 | 不建行的理由 |
|---|---|
| 「>90% in most of our evaluations」 | 合作方 Dr Xi Xing（Princeton University, The Rabinowitz Lab）的**引语**，非官方评测读数 |
| 谱库检索「on average only about 5% of measured spectra, and 10% for human samples」 | 描述传统谱库检索的**行业基线**，不是任何模型的得分 |
| 97.7% summed fragment intensity（14/19 峰） | Figure 2/3/4 演示的**单个化合物个案参数**，不是基准读数 |
| 845 个异构体、m/z 162.1037 / 232.0283 等 | 同上，个案工作流参数 |
| 10,000 名科学家免费 6 个月 | 商业条款，非评测分 |

## 归档文件

| 文件 | 说明 |
|---|---|
| `page.html` | 官方文章页全文（含内嵌 SVG 原图引用与 JSON-LD 日期） |
| `images/AGY_Mass-spec_fig-7__light.svg` | 官方 Figure 5a（Exact-match identification accuracy）矢量原图，文字全为 path |
| `images/AGY_Mass-spec_fig-8__light.svg` | 官方 Figure 5b（Relative generated tokens）矢量原图，文字全为 path |
