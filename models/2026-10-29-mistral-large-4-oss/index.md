---
vendor: mistral
model: Mistral Large 4 (Le Chonk)
release: mistral-large-4-oss
date: 2026-10-29
source: https://mistral.ai/news/mistral-large-4-oss/
fetched_at: 2026-10-30
---

# Mistral Large 4 (Le Chonk) 开源权重版

发布日期来自官方发布页 JSON-LD `datePublished: 2026-10-29T12:00:07.000Z`（`dateModified: 2026-10-29T17:33:42.728Z`，发布当日二次编辑），与官方 RSS 条目 `pubDate Wed, 29 Oct 2026 12:00:07 GMT` 一致。

本页是 **Mistral Large 4（昵称 "Le Chonk"）的开源权重发布**。该模型 2026-10-06 以公开预览（public preview）形式发布（账本已有 `mistral-large-4` 条目）；本次官方在预览发布后又追加了三周的强化学习训练，放出**改进后 checkpoint 的权重**，官方称编码与防御性安全两项能力同步提升、推理效率显著改善。

官方明示规格：

| 项 | 值 |
|---|---|
| 参数量 | 1T（1-trillion-parameter）MoE；HF 权重仓名 `Mistral-Large-4-1T-A52B`，即激活参数约 52B |
| 模态 | 原生多模态（natively multimodal），HF `pipeline_tag: image-text-to-text` |
| 推理档位 | Low / Medium / High 三档，**默认 High**；Low 档取代原 "None" 档 |
| 权重发布 | HuggingFace `mistralai/Mistral-Large-4-1T-A52B`（仓创建于 2026-09-30，2026-10-29 14:51 最后更新） |
| 许可 | Mistral Ecosystem Open-Weight License（MIT 改版；HF 卡片 `license: other`） |
| 部署 | 官方列出 vLLM / SGLang / llama.cpp 标签；页面强调可自托管、可定制（sovereign AI） |
| API 定价 | 本发布页**未给出** API 定价，账本一律记 null |

官方评测数据全部以页面内嵌图表组件给出（`data-value` / `data-display` 属性内嵌数值，DOM 机读，无需读图）；下表每行均与同页散文逐条交叉校验一致：

| 评测 | 分数 | 备注 |
|---|---:|---|
| Cognition FrontierCode 2.0 | 19.7% | 官方散文「leads with a score of 19.7%」；同图对照 Beam 1.0 2.9%、GLM-5.3 Flash 14.2%、Kimi K3 17.3%、GLM-5.3 17.8%、DeepSeek V4.1 Flash 19.3%。Cognition **私有**基准，未授权者无法复跑。 |
| Artificial Analysis Coding Agent Index（High，默认档） | 48% | 散文「scores 48%」；官方称与领先开源模型 GLM-5.3 持平，但每任务平均**少用 47% token**。 |
| Artificial Analysis Coding Agent Index（Medium 档） | 35% | 仅图表 DOM 机读（`data-value="35"`，该散点图标注为 "6 · 35"，即 6 与 35 两个量纲合成显示）；正文只点名 High 档的 48%。同图对照 GLM-5.3 49、DeepSeek V4.1 Flash 1017 46、Kimi K3 41、Muse Spark Open (xhigh) 26。 |
| Terminal-Bench 4.0 | 41% | 散文「improved by 13 percentage points to 41% compared to its public preview」；图表 `data-value="41.4"`、`data-display="41%"`（正文与图表显示均为 41%，机读值为 41.4）。同图对照 ML4 Preview 28%、GLM-5.3 40%、DeepSeek V4.1 Flash 1017 31%、Kimi K3 21%、Muse Spark Open 6%、Beam 1.0 3%。 |
| Surge Code 盲测偏好（对手 GLM-5.3） | 64% | 图表 DOM 机读，胜率口径为「评委更偏好 Mistral Large 4 答案的提示占比」，对照 36%。 |
| Surge Code 盲测偏好（对手 Kimi K3） | 64% | 同上，对照 36%。 |
| Surge Code 盲测偏好（对手 DeepSeek V4.1 Flash 1017） | 56% | 同上，对照 44%。 |
| Surge Code 盲测偏好（对手 Claude Opus 5.5） | 22% | 同上，对照 78%。官方散文只说「落后于 Claude Opus 5.5」，未给数值。 |
| Artificial Analysis Cyber Index | 51% | 散文「scores 51%」；图表 `data-value="50.9"`、`data-display="51%"`。同图对照 DeepSeek-V4.1-Flash 1017 57%、MiMo-V2.6-Pro 56%、GLM-5.3 Flash 50%、Kimi K3 41%、GLM-5.3 36%、Beam 1.0 34%。指数口径为「发现漏洞 → 复现验证 → 打补丁且不破坏既有功能」。 |
| 恶意网络安全请求平均拒答率（JailbreakBench + StrongREJECT + AgentHarm） | 96.6% | 散文「achieving an average refusal rate of 96.6% on malicious cyber requests」；图表 `data-value="96.6"`、`data-display="97%"`。同图对照 Kimi K3 93.6%、GLM-5.3 87.1%、Gemma-4-31B 84.1%、DeepSeek-V4-Pro 50.7%；ML4 Preview 95.3%。此为**安全行为**指标（越高越拒答），不是能力分。 |
| FinWorkBench（Finch） | 73.3% | 散文「our Finch scores climbing to 73.3%, second only to Kimi K3 for open models」；图表 `data-value="73.3"`。同图对照 Kimi K3 77.33%（显示 77.3%）、DeepSeek-V4-Pro-0813 67.44%（67.4%）、GLM-5.3 65.12%（65.1%）；ML4 Preview 67.4%。衡量金融/会计表格类真实工作流。 |
| BrowseComp | 84.5% | 散文「Our RL pipeline enabled us to reach 84.5% on BrowseComp (starting from an SFT checkpoint that was achieving 75%)」；图表 `data-value="84.5"`。同图对照 Kimi K3 91.2%、DeepSeek V4.1 Flash 1017 83.4%、GLM-5.3 82.5%；Early Mistral Large SFT checkpoint 75%。 |

图表脚注与协议要点：

- **推理档位与 token 效率**：官方给出 Low / Medium / High 三档，High 为默认档；散点图把「每任务 token 数」与「Coding Agent Index 分数」放在同一张图上，Medium 档显示 "6 · 35"、High 档显示 "9 · 48"，即 High 档多花约 50% token 换 13 个指数点。官方称 High 档比 GLM-5.3 少用 **47%** token（每任务平均）。
- **Terminal-Bench 4.0 提升口径**：官方称较公开预览提升 **13 个百分点**；账本既有预览行 `mistral-mistral-large-4--terminalbench` = 28.3%，28.3 + 13 = 41.3 ≈ 41.4，与本次机读值交叉一致。
- **Surge Code**：盲测成对偏好（blind pairwise），胜率随对手而变，是**对手相关**指标；同页对手集合（GLM-5.3 / Kimi K3 / DeepSeek V4.1 Flash 1017 / Claude Opus 5.5）不可外推到其他对手，也不构成综合分。
- **Cyber 拒答率**：图题为「Average refusal on the cyber-related prompts of JailbreakBench, StrongREJECT and AgentHarm」，即三个越狱/有害请求套件中**网络安全类**提示的平均拒答率；官方强调该模型要在防御性安全任务上「不过度拒答」，因此该指标需与 AA Cyber Index 的能力分**成对读**。
- **页面未给出**：各评测的原始提交哈希、题量、通过判分细则与复现脚本；Cognition FrontierCode 2.0 为私有基准（仅授权厂商有成绩）。
