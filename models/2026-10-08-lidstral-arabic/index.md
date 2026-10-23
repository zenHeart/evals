---
vendor: mistral
model: LIDstral Arabic
release: lidstral-arabic
date: 2026-10-08
source: https://huggingface.co/mistralai/LIDstral-Arabic
fetched_at: 2026-10-23
---

# LIDstral Arabic

发布日期证据：官方 Hugging Face 模型仓 `mistralai/LIDstral-Arabic` 创建于 **2026-10-08T11:37:05Z**；同批发布的 `mistralai/Voxtral-Mini-4B-Realtime-Arabic` 创建于 2026-10-08T11:36:06Z（两者相隔 61 秒，为同一批阿拉伯语模型发布）；官方共同开发方 **Morocco-MTNRA-Labs** 组织于 2026-10-09 镜像同两个模型仓（17:19:43Z / 17:20:57Z），独立佐证两个模型在 2026-10-09 前已公开。本批按账本既有先例（`zai-org/GLM-OCR` 档：以「权重与官方模型卡上线日」为发布日）取 2026-10-08。

> 取证说明：Mistral 官方新闻页（92 篇全量 slug）、官方 RSS、开发者 changelog（2026-10-06 / 10-20 / 10-22 三条窗口内条目）、官方 GitHub 组织、arXiv 与 API 文档模型总览页均**无**本次阿拉伯语模型的发布公告，模型仓与模型卡是唯一的一手发布渠道。官方模型仓创建日在此属「权重与模型卡上线日」，不是抓取日。

Mistral 发布 **LIDstral Arabic** —— 面向阿拉伯语文字的**语种与方言识别**模型：可区分标准阿拉伯语（MSA）、各方言，以及使用同一文字系统的非阿拉伯语（模型卡明确说明训练中纳入这些非阿语语言，是为了避免模型仅凭文字系统就判成阿拉伯语）。

官方明示规格与方法：

| 项 | 值 |
|---|---|
| 任务 | 文本语种 + 方言分类（51 个受支持类别） |
| 结构 | fastText one-vs-all 分类器 + 64 单元 LayerNorm MLP stacker + 逐类 isotonic 校准 |
| 特征 | 144 维（原始分数、先验修正、置信度边际、熵、区域汇总） |
| 推理 | CPU 即可运行（`classify.py` 全流程在 CPU 上跑） |
| 权重文件 | `lid_ova_full.bin` + `mlp_stacker_ln.pt` + `isotonic_calibration.pkl`（三个文件须同目录） |
| 预处理 | 去除网页与 ASR 噪声、元音符号、装饰性拉长与重复标点；保留 alef 变体 |
| 许可证 | Apache-2.0（模型仓 tag） |
| 已知限制 | 总是输出 51 类之一，可能误判未支持语言或混合语言文本 |

官方 Evaluation 节（散文明文，越高越好）：

| 评测 | 分数 | 备注 |
|---|---:|---|
| Moroccan Darija F1 | **88.67%** | LIDstral Arabic 自家列；评测集共 84,870 条阿拉伯语样本 |
| Moroccan Darija F1（对照） | 72.65% | LahjatBERT **ALDi CL**，模型卡称其为该方言「测试过的最强基线」 |
| Moroccan Darija F1（对照） | 71.28% | GlotLID v3 |

评测集来源（模型卡列出）：NADI、MADAR、QADI、Casablanca、FLEURS、SMOL、Omnilingual ASR、Hassaniya，共 84,870 条阿拉伯语样本。

官方图表（位图，数值只存在于像素；下表为视觉转写，**未经人工确认不得翻 verified**）：
`images/arabic-country-comparison.png` —— 逐标签 F1 热力图（21 个地区/语种标签行 × 4 个模型列，单位 %）：

| 标签 | LIDstral-Arabic | LahjatBERT Card CL | GlotLID v3 | lid.176 |
|---|---:|---:|---:|---:|
| Saudi Arabia | 28.61 | 19.01 | — | — |
| Kuwait | 50.15 | 12.61 | — | — |
| Bahrain | 39.67 | 0.72 | — | — |
| Qatar | 30.54 | 8.24 | — | — |
| UAE | 43.96 | 26.71 | — | — |
| Oman | 30.12 | 15.41 | — | — |
| Yemen | 41.80 | 16.29 | — | — |
| Iraq | 71.24 | 46.54 | — | — |
| Jordan | 42.09 | 31.35 | — | — |
| Palestine | 33.45 | 20.85 | — | — |
| Syria | 40.14 | 26.49 | — | — |
| Lebanon | 42.23 | 19.53 | — | — |
| Egypt | 74.18 | 76.04 | 59.23 | 28.71 |
| Sudan | 63.37 | 2.64 | — | — |
| Libya | 55.62 | 35.83 | — | — |
| Tunisia | 66.08 | 30.06 | 37.00 | — |
| Algeria | 67.77 | 40.24 | 15.92 | — |
| Morocco | 88.67 | 68.48 | 71.28 | — |
| Mauritania | 79.59 | — | — | — |
| MSA | 93.63 | — | 88.86 | 62.73 |
| Chad | 97.39 | — | 0.00 | — |

图注：`—` = 无匹配类别；`0.00` = 有该受支持类别但零正确预测。

差异留档（不跨来源调和）：散文给的 LahjatBERT 基线是 **ALDi CL 72.65%**，热力图列名是 **Card CL 68.48%**——两者是同一家族的不同变体（72.65 > 71.28 > 68.48，与「ALDi CL 为最强测试基线」的表述自洽）；散文给的 GlotLID v3 71.28% 与图中 Morocco 行 71.28 一致，LIDstral 自家 88.67% 两处一致。

## 评测口径与限制

- 51 类是**闭集**：模型必定输出其中一个类别，未支持语言与混合语言文本会被强行归类。
- 热力图只展示 21 个标签行，模型本身支持 51 类——完整逐标签结果以官方模型仓权重与 `classify.py` 输出为准。
- 模型卡未给出评测协议细节（无温度、无样本切分、无评委设定说明），故账本 protocol 12 键全部记 null。
