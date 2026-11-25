---
vendor: tencent
model: Hy4 flash
release: hy4-flash
date: 2026-11-16
source: https://hunyuan.tencent.com/blog/hy4-flash
fetched_at: 2026-11-17
---

# Hy4 flash：日常工作的极致性价比模型

> 归档说明：官方发布页 `https://hunyuan.tencent.com/blog/hy4-flash` 为**纯客户端渲染的 SPA**——静态 GET 只回 6,894 字节骨架屏（`<title>腾讯混元</title>`、app-version 953de817、build-time 2026/11/16 19:42:03），正文由官方接口 `POST https://api.hunyuan.tencent.com/api/blog/publicDetail`（body `{"id":100145}`，请求头 `content-type: application/json` + `origin: https://hunyuan.tencent.com`）返回的 `data.detail.content` 渲染。对同一 URL 用 Googlebot / bingbot / Baiduspider UA 复抓，仍是同一份骨架屏，**无服务端渲染、无预渲染变体**。因此归档分三件：`page.html`（公开 URL 原样骨架屏，未做任何 DOM 改写）、`page-source.md`（官方接口返回的正文 markdown 原始内容，逐字落盘，仅对 COS 预签名 URL 的 `q-ak=AKID…` SecretID 参数做了脱敏，见文末局限）、`tokenhub-model-page.html`（腾讯云 TokenHub 官方模型规格页原样 HTML，规格数据源）。英文版为同一 `id=100145` 的孪生稿（`accept-language: en`），标题「Introducing Hy4 flash: Ultimate cost-efficiency for everyday productivity」，正文数值与中文版一致（定价表按 USD 折算列示），本归档以中文版为准。

## 发布日证据链（五源互证）

| 来源 | 原文 | 说明 |
|---|---|---|
| 发布文封面卡 | `date = "2026年11月16日"` | 正文首块 `@@@coverCard` 指令原文，页面印刷日 |
| 官方接口 `publishedAt`（中文版） | `1794803377` = 2026-11-16T04:29:37Z | `publicDetail` body `{"id":100145}` + `accept-language: zh` |
| 官方接口 `publishedAt`（英文版） | `1794808444` = 2026-11-16T05:54:04Z | 同一文章 id 的英文孪生稿，发布日同为 2026-11-16 |
| 官方接口 `displayPublishTime` | `1794758400` = 2026-11-15T16:00:00Z = 北京时间 2026-11-16 00:00 | 站内展示日 |
| 腾讯云 TokenHub 官方规格页 | `releaseAt: "2026-11-16T00:00:00.000Z"` | `cloud.tencent.com/tokenhub/hy4-flash` 内嵌模型数据 |

**账本取 release_date = 2026-11-16，date_precision = day。**

## 发布要点（转录）

- 定位（原文）：「我们推出 Hy4 flash，迄今为止最高性价比的 Hy 模型。」
- 参数（原文）：「其总参数量为 224B（其中 64B Engram 参数），激活参数 12B，支持多模态和 1M 上下文长度，API 价格相比 Hy4 大幅降低。」
- 架构与训练（原文四条）：预训练加入混合注意力、LatentMoE、Engram，**KV cache 仅为 Hy3 的 1/24、Hy4 的 1/6**；后训练用自蒸馏 Hy4 建立综合智能水平，再通过强化学习**使端到端任务输出长度降低 50%**；评估阶段构建**基于 WorkBuddy 典型任务的内部评测集 WorkIndex** 并结合人评；推理阶段结合 megakernel、4bit 量化、DFly，**解码速度超过 150 tps**。
- 定价（原文表，每百万 Tokens）：

  | API 价格（每百万 Tokens） | 输入（命中缓存） | 输入 | 输出 |
  |---|---|---|---|
  | **Hy4 flash** | **0.02 元** | **0.5 元** | **2 元** |
  | Hy4 | 0.3 元 | 6 元 | 18 元 |

  英文版同表按 USD 列示：Hy4 flash `$0.003 / $0.070 / $0.281`、Hy4 `$0.042 / $0.834 / $2.501`。
- 腾讯云 TokenHub 官方规格页补充（`tokenhub-model-page.html`）：上下文窗口 `1024K`、最大输入 `960k`、最大输出 `64k`、QPM 300 / TPM 10,000,000；标签「文本生成 / 深度思考 / 视觉理解」；能力位：深度思考、Function Calling、结构化输出、缓存、图片输入、文本输入、文本输出均 `true`，支持 Anthropic API / OpenAI 兼容 Completions API / Response API；官方摘要「更轻量、更高效的日常主力模型。适合日常办公等高频、规模化场景。」；`createdAt`/`updatedAt` 均为 2026-11-11T14:10:06.757+08:00。
- 上线与推荐（原文）：已在腾讯云 TokenHub、WorkBuddy、元宝、企业微信、QQ、ima、Marvis 上线，即将接入 OpenRouter；11 月 30 日前 WorkBuddy 限时免费、腾讯云 TokenHub API 限时 5 折；推荐用于深度搜索、文档处理、PPT 生成、简单前端展示、computer use 等日常任务，长程软件工程仍推荐 Hy4；**计划开源 Hy4 flash**。

## 评测数据

> 说明：本篇评测值分三类，账本按口径分别处理——
> ① **图 1 内的机读聚合值**（ECharts 配置随正文 payload 下发，非 OCR、非读图）→ 数值可机读，但两者都是**跨多个基准的算术平均**（非单一基准分），按「一行一基准、取自家模型列」口径**不建行**，全量转录只留在本文件与 release notes；如要作为对照维度收录，须先在 `data/compare-rules.json` 的 `unmapped_ids` 登记 `workindex` 与 `open-agent-benchmark`（本批未越界修改该文件）；
> ② **附录「模型得分」位图逐项分**（17 行）+ **85 人盲测**（1 行）→ 数值只存在于官方位图，记 `evidence_type: figure` / `status: pending` / `score_status: not_extracted`，视觉转写值只进 `notes`；
> ③ **正文相对差值与点名未量化的内部评测**（WorkBuddy / 元宝 / 微信支付 / 企业微信 / 王者荣耀 / ima / QQ / Marvis）→ 相对口径，非绝对分值，**不建行**，只在本文件与 release notes 留痕。
>
> 账本结果：**18 条 evidence = 0 verified + 18 pending**，release `status: pending`（无 verified 行）。

### 一、图 1：内外部任务上的性能和成本（机读聚合值，2 条复合读数，不建行）

图 1 为 `@@@ tabChartCard` 双标签页 ECharts 散点/折线图，x 轴 `Cost per task (RMB)`（对数轴），y 轴 `Performance`。其数据点以 `name` / `value` 形式直接写在正文 payload 里，非位图。

| 评测 | 分数 | 备注 |
|---|---|---|
| WorkIndex (internal) — Hy4 flash 综合 Performance | 42.1 | 内部评测集（8 个子集）综合分；同点单任务成本 ¥0.2。竞品同点：DeepSeek-V4.1-Flash-1017 44.4/¥1.6、Hy4 51.4/¥5.7、Qwen3.8-Flash-Next 41.0/¥0.7、Hy4 preview 39.7/¥3.2、GLM-5.3-Flash 37.7/¥1.7、GPT-6 Luna 34.1/¥0.9 |
| Open Benchmarks — Hy4 flash 综合 Performance | 48.3 | 7 个公开 Agent 评测集综合分；同点单任务成本 ¥0.3。竞品同点：DeepSeek-V4.1-Flash-1017 56.5/¥2.7、Hy4 59.8/¥8.6、Qwen3.8-Flash-Next 48.1/¥4.3、GLM-5.3-Flash 47.5/¥4.5、GPT-6 Luna 39.2/¥1.5、Hy4 preview 45.9/¥19.6 |

两个综合分与附录表逐行算术平均自洽（WorkIndex 8 项均值 42.11→42.1；Open Agent Benchmark 7 项均值 48.34→48.3），但页面未披露加权方式与归一化口径，**不可与单项基准分直接横比**。

### 二、图 2：WorkIndex 上的平均任务花费（位图，数值只进 notes）

`images/13-bench-workindex-cost.png`：Hy4 flash ¥0.2 / Performance 42.1，Hy4 preview ¥3.2 / 39.7，Hy4 ¥5.7 / 51.4；图内标注「13.8× cheaper（vs Hy4 preview）」「24.5× cheaper（vs Hy4）」。**跨源不一致**：正文写「单任务成本仅为 Hy4 preview 的 1/13、Hy4 的 1/20」，与图 2 的 13.8×／24.5× 在 Hy4 一档对不上（按图 2 为 24.5×），两处口径均原样记录，不做调和。

### 三、85 位 WorkBuddy 内部用户盲测（位图，1 条 pending）

`images/14-bench-blindtest-85-users.png`：85 位 WorkBuddy 内部用户在 27 类共 259 个日常工作任务上盲测。Hy4 flash **用户满意度 2.79（4 分制）**，同图端到端时长中位数 6.7 min、单任务成本 ¥0.26；竞品 DeepSeek-V4.1-Flash-1017 3.09 / 10.3 min / ¥1.20、Claude Haiku 5.5 2.81 / 6.8 min / ¥4.73、GLM-5.3-Flash 2.53 / 7.6 min / ¥0.81；图注「外部模型（DeepSeek、Claude Haiku、GLM）均为 high 档」。正文对应表述：「Hy4 flash 的用户满意度接近 Claude Haiku 5.5，且单任务成本显著低于其他所有模型，任务时长也最短。」时间与成本非评测分值，只留 notes。

### 四、附录「模型得分」逐项（位图，17 行 pending）

`images/15-bench-appendix-full.png`（官方原图 3474×4678）。视觉转写值如下，**全部只进 notes，不写入 `reported_score.value`**：

| 评测 | 分数 | 备注 |
|---|---|---|
| PPTGenBench | （视觉转写）54.2 | WorkIndex 组；单任务成本 ¥0.169。Hy4 61.5 / Hy4 preview 52.3 / DeepSeek-V4.1-Flash-1017 64.4 / Qwen3.8-Flash-Next 56.0 / GLM-5.3-Flash 53.6 / GPT-6 Luna 56.8 |
| PPTCoEditBench | （视觉转写）74.0 | WorkIndex 组；成本 ¥0.105。Hy4 78.9 / Hy4 preview 71.5 / DeepSeek 76.8 / Qwen 62.9 / GLM 67.3 / GPT-6 Luna 43.5 |
| PPTFixBench | （视觉转写）23.7 | WorkIndex 组；成本 ¥0.253。Hy4 45.6 / Hy4 preview 23.8 / DeepSeek 45.3 / Qwen 23.9 / GLM 28.6 / GPT-6 Luna 8.6 |
| MdCoEditBench | （视觉转写）56.9 | WorkIndex 组；成本 ¥0.057。Hy4 57.7 / Hy4 preview 49.2 / DeepSeek 29.2 / Qwen 53.8 / GLM 32.3 / GPT-6 Luna 53.1 |
| WordEditBench | （视觉转写）46.2 | WorkIndex 组；成本 ¥0.629。Hy4 57.2 / Hy4 preview 44.2 / DeepSeek 53.5 / Qwen 46.3 / GLM 47.6 / GPT-6 Luna 42.7 |
| ExcelFixBench | （视觉转写）15.6 | WorkIndex 组；成本 ¥0.310。Hy4 27.8 / Hy4 preview 11.7 / DeepSeek 20.0 / Qwen 12.8 / GLM 9.9 / GPT-6 Luna 6.7 |
| AudioVideoBench | （视觉转写）17.8 | WorkIndex 组；成本 ¥0.344。Hy4 27.4 / Hy4 preview 16.3 / DeepSeek 22.2 / Qwen 17.8 / GLM 11.9 / GPT-6 Luna 10.0 |
| BuddyVQA Atlas (without tools) | （视觉转写）48.5 | WorkIndex 组；成本 ¥0.007。Hy4 55.5 / Hy4 preview 未列 / DeepSeek 43.7 / Qwen 54.5 / GLM 50.1 / GPT-6 Luna 51.6 |
| DeepSWE v1.1 | （视觉转写）64.6 | Open Agent Benchmark 组；成本 ¥0.290。Hy4 74.9 / Hy4 preview 64.3 / DeepSeek 73.8 / Qwen 65.1 / GLM 67.8 / GPT-6 Luna 67.1 |
| ProgramBench (almost solved) | （视觉转写）16.0 | 成本 ¥0.561。Hy4 30.0 / Hy4 preview 17.5 / DeepSeek 29.0 / Qwen 22.0 / GLM 13.0 / GPT-6 Luna 6.0 |
| Terminal-Bench 4.0 | （视觉转写）19.2 | 成本 ¥0.558。Hy4 44.4 / Hy4 preview 26.3 / DeepSeek 40.0 / Qwen 29.5 / GLM 35.4 / GPT-6 Luna 13.3 |
| APEX-Agents v1.1 (pass@1) | （视觉转写）63.1 | 成本 ¥0.087。Hy4 75.2 / Hy4 preview 53.9 / DeepSeek 72.9 / Qwen 57.6 / GLM 51.5 / GPT-6 Luna 44.7 |
| AutomationBench v1.0.6 | （视觉转写）52.2 | 成本 ¥0.038。Hy4 56.2 / Hy4 preview 36.3 / DeepSeek 54.3 / Qwen 49.3 / GLM 48.4 / GPT-6 Luna 38.1 |
| HLE-Full (with tools) | （视觉转写）55.2 | 成本 ¥0.060。Hy4 59.1 / Hy4 preview 未列 / DeepSeek 57.1 / Qwen 54.1 / GLM 52.2 / GPT-6 Luna 49.7 |
| OSWorld 2.1 (Full, partial score) | （视觉转写）68.1 | 成本 ¥0.451。Hy4 78.9 / Hy4 preview 未列 / DeepSeek 68.4 / Qwen 58.8 / GLM 64.0 / GPT-6 Luna 55.7 |
| MMMU-Pro | （视觉转写）75.8 | Multimodal 组；成本 ¥0.010。Hy4 78.6 / Hy4 preview 未列 / DeepSeek 76.7 / Qwen 77.2 / GLM 77.0 / GPT-6 Luna 77.5 |
| ZeroBench-main (with tools, pass@5) | （视觉转写）45.8 | 成本 ¥0.077。Hy4 55.4 / Hy4 preview 未列 / DeepSeek 16.5 / Qwen 41.7 / GLM 35.3 / GPT-6 Luna 33.6 |

**跨档交叉互证（本批新增的锚点命中）**：本表 Hy4 列 9 项（74.9 / 30.0 / 44.4 / 75.2 / 56.2 / 59.1 / 78.9 / 78.6 / 55.4）与同仓 `data/model-releases/official/tencent/hy4.json` 从 Hy4 发布文附录位图独立转写的 Hy4 列数值**逐项一致**；Hy4 preview 列 5 项（64.3 / 17.5 / 26.3 / 53.9 / 36.3）同样一致；两表在「Hy4 preview 未列」的 Multimodal 与 OSWorld 行也一致。互证说明本批视觉转写可信度较高，但仍按纪律保持 pending。

附录 Notes 段给出的协议（读自位图，同 hy4 先例记入 `protocol`）：每个模型按**最高可用推理档**评测；8 个 WorkBuddy 内部子集**全部在 workbuddy cli 上评测**；DeepSWE v1.1 用 mini-SWE-agent、每任务沙箱 8 CPU / 16 GB；ProgramBench 的 Almost Solved 用 mini-SWE-agent；Terminal-Bench 4.0 用 Claude Code 脚手架、每试验最多 500 turns / 13 小时超时、16 CPU / 32 GB RAM、三个 GPU 任务额外配单张 H100；APEX-Agents v1.1 用官方 reference agent harness（Loop）、每试验最多 250 步、main + world 两服务环境上限 8 CPU / 24 GB RAM、判分在独立 verifier 容器（2 CPU / 8 GB RAM）；AutomationBench v1.0.6 用 Zapier 发布的 600 个公开任务并按官方方法评测；ExcelFixBench 每任务 rubric 校验、**3 次运行取均值**；ZeroBench-main 用网络隔离的 Jupyter 环境、图像输出作为工具接口、每次运行最多 80 轮工具调用、**每题 10 次独立运行估计 pass@5**；成本按各家官方 API 价折算，USD→CNY 固定汇率 1:7.2。

### 五、正文相对差值与点名未量化的内部评测（不建行）

| 评测方 | 原文数值（相对口径） | 备注 |
|---|---|---|
| WorkBuddy | 平均任务耗时减少 70%；平均成本约为 Hy4 的 1/15；效果基本持平，Coding 长程任务小幅下降 | 相对前代，无绝对分值 |
| 元宝 | Agent 能力相比 Hy3 提升 13.6%；Agent 任务 GSB 人工对比相比 Hy3 提升 7.56%；通用对话相比 GLM-5.3-Flash 提升 2.52% | 相对差值，非绝对分值 |
| 微信支付 | 真机支付客户端四流程均分**持平或更高**；执行步数减少约 6%；单次输出长度缩短约 29%；代码静态扫描耗时降 37%、Token 降 46%、推理效果持平 | 均分为「持平或更高」，无数值 |
| 企业微信大圆 | 输出速度相比 Hy4 提升 88%；思考模式输出 Token 减少约 60% | 相对差值 |
| 王者荣耀 | 根因定位接近 DeepSeek-V4.1-Flash-1017 与 GLM-5.3-Flash；请求次数减少 22.0%–39.1%；Token 消耗减少 40.5%–61.2%；工具调用多 51.2% / 7.7%；报告篇幅短 13.8% / 37.0% | 相对差值 |
| ima | 知识库问答平均等待时间缩短约 18%–35%；回答整体评分提升 1.8%；回答内容质量评分提升 8.1%；思维链内容质量综合评分提升 2.1% | 相对差值 |
| QQ | 音乐推荐 / 频道互动 / QQ 空间 / 星座长篇解析的「符合要求结果占比」分别高出 6.16 / 2.84 / 0.92 / 2.22 个百分点；完成时间缩短约 11%–27%；评论 P90 耗时缩短 39%、峰值缩短 47%、输出 token 减少 30% | 相对差值 |
| Marvis | 应用下载安装提升 6.2%；系统设置与诊断提升 4.4%；文档处理与调研报告生成提升 6.9%；整体任务满意度持平 | 相对差值 |

## 协议与口径说明

- 图 1 两个聚合值来自正文 payload 内联的 ECharts 配置（`name` / `value` 机器可读，不是 OCR 读图），但它们是**跨多个基准的算术平均**，不是单一基准的分；按「一行一基准、取自家模型列」口径不建证据行，只在本文件与 release notes 全量留档。若要收录为对照维度，须先在 `data/compare-rules.json` 的 `unmapped_ids` 登记 `workindex` 与 `open-agent-benchmark`（同厂既有写法见 `workbuddy-comprehensive` / `yuanbao-internal-eval`），否则 `scripts/compare-audit.mjs` 会报 orphan。
- 附录 17 行与图 3 盲测的数值**只存在于官方位图**，按纪律记 pending + not_extracted，视觉转写值只进 `notes`；需另起「重读归档图片」专项批次才能升级 verified（先例：`tencent/hy4`）。
- 竞品列（DeepSeek-V4.1-Flash-1017、Hy4、Hy4 preview、Qwen3.8-Flash-Next、GLM-5.3-Flash、GPT-6 Luna、Claude Haiku 5.5、Claude Opus 等）按「取自家模型列」规则只进该行 notes，不拆独立行。
- 图 1 的两个「Performance」为组内各基准分的算术平均（可由附录表逐行核对），页面未披露加权与归一化口径，**不可与单项基准分横比**。
- WorkIndex、8 个 WorkBuddy 内部子集、WorkBuddy 盲测、腾讯系产品内部评测均为厂商自建评测，题目、判分流程与打分标准不公开，不可复现。
- 页面未披露采样温度、top_p、单次运行次数等逐项配置，未明示者一律 null。

## 局限与待人工核验

1. `page-source.md` 中的腾讯云 COS 预签名 URL 含 `q-ak=AKID…` SecretID 参数（该参数随官方博客页面公开，属公开站点素材，但会被 GitHub push protection 判为密钥）——**已脱敏为 `AKID-REDACTED-BY-ARCHIVE`（15 处）**；正文文字、全部评测数值、封面卡日期与接口元数据未改动，脱敏后 SHA-256 已重算。
2. `page.html` 只含 SPA 骨架屏，**正文不在 HTML 内**；复核请读 `page-source.md`（官方接口原文）与 `tokenhub-model-page.html`（腾讯云规格页原文）。
3. 附录位图 17 行 + 盲测 1 行待人工读图确认后翻 verified；本批已与 `tencent/hy4` 归档附录表交叉互证（Hy4 列 9/9 命中），可信度较高但按纪律不自动升级。
4. 图 1 的两个「Performance」（WorkIndex 42.1、Open Benchmarks 48.3）为组内各基准分的算术平均（可由附录表逐行核对），页面未披露加权与归一化口径，**不可与单项基准分横比**；本批按「一行一基准」口径只在本文件与 release notes 留档，未入账本 evidence 行（收录前需先在 `data/compare-rules.json` 的 `unmapped_ids` 登记 id）。
5. 正文与图 2 的成本倍数不一致（正文「1/13、1/20」vs 图 2「13.8×、24.5×」），按「跨页冲突不调和」两处并存。
6. 参数量、上下文窗口、定价中，发布文正文给出参数与定价与「1M 上下文」；上下文与价格细节另取腾讯云 TokenHub 官方规格页（`1024K / 960k / 64k`），二者口径不同但一致不矛盾，账本 `context_window` 取正文口径。
7. 参数量与激活参数为发布文原文（224B 含 64B Engram 参数、激活 12B）；TokenHub 规格页另称「参数量约为旗舰的四分之一」，本归档未据此推算数值。
8. 全部声明为厂商自报，本次未对任何分值做本地复跑或第三方独立复现。
9. 页面 15 张引用图片（封面、按钮图标、8 个客户 logo、3 张评测配图）全部原样下载；英文孪生稿另有一张英文版盲测图未下载（中文版已归档）。

---

## 附：另一批次独立归档转录（第七十一~七十六批链路）

> 本节为同一官方发布文的**另一批次独立抓取**转录，原样保留以便交叉核对；上文为基准批次的完整转录。两者取数口径不同（第七十批解出发布方自带数据常量，第七十一~七十六批链路只取正文散文明文），数值差异以本 release 的 evidence 行与 revisions[] 为准。

# Hy4 flash（腾讯官方发布文证据归档）

发布日期证据链：腾讯混元官方博客正文封面卡印刷日「2026年11月16日」，并由官方 Hugging Face 模型卡与官方仓创建日（2026-11-18）互证，`date_precision=day`。

- 官方模型卡：https://huggingface.co/tencent/Hy4-flash （`README.md`，官方仓 raw README，原始字节未改动存档）
- 官方发布文：https://hunyuan.tencent.com/blog/100145 （`release-post.md`，腾讯官方博客接口返回的官方 markdown 正文，含内嵌 echarts 配置）
- 开源镜像：https://github.com/Tencent-Hunyuan/Hy4-flash ｜ https://huggingface.co/tencent/Hy4-flash

## 官方定位（原文要点）

- 官方模型卡：「Hy4 flash is our most cost-effective Hy model to date」——迄今性价比最高的 Hy 模型。
- 官方博客：「我们推出 Hy4 flash，迄今为止最高性价比的 Hy 模型」。

## 规格与架构（官方模型卡明示）

- **总参数**：220B（语言主干 155.5B + Engram 63.5B + ViT 0.43B + DFly2 drafter 0.85B）；官方博客口径写作「224B（其中 64B Engram 参数）」，两口径并存，已记入 notes 不做调和。
- **激活参数**：11.3B（文本）+ 0.43B（视觉）；官方博客写「激活参数 12B」。
- **上下文窗口**：1M（1,048,576 tokens）。
- **架构**：42 层语言主干（1 dense + 41 MoE），混合注意力（sparse + sliding-window / MLA），LatentMoE，Engram n-gram embedding，DFly2 投机解码 drafter。
- **模态**：原生接受文本与图像输入，生成文本。
- **API 定价**：输入（命中缓存）0.02 元 / 百万 tokens；输入 0.5 元；输出 2 元（Hy4 对照：0.3 / 6 / 18 元）。
- **解码速度**：官方称超过 150 tokens/s（megakernels + 4bit 量化 + DFly2）。

## 评测转录表（官方模型卡 Markdown 真表格，逐格机读）

| 评测 | 分数 | 备注 |
|---|---|---|
| MMLU†（5-shot） | 88.7% | 同行 Hy4=91.6、Hy3 preview=87.5、DeepSeek-V4-flash-Base=89.7、DeepSeek-V4-Pro-Base=91.1 |
| MMLU-Pro†（5-shot） | 71.1% | 同行 Hy4=73.9、Hy3 preview=65.8、DeepSeek-V4-flash-Base=68.6、DeepSeek-V4-Pro-Base=73.4 |
| MMLU-Redux†（5-shot） | 87.6% | 同行 Hy4=90.6、Hy3 preview=87.0、DeepSeek-V4-flash-Base=88.8、DeepSeek-V4-Pro-Base=90.2 |
| SuperGPQA†（5-shot） | 57.8% | 同行 Hy4=62.7、Hy3 preview=52.3、DeepSeek-V4-flash-Base=52.5、DeepSeek-V4-Pro-Base=54.8 |
| C-Eval†（5-shot） | 92.0% | 同行 Hy4=95.0、Hy3 preview=90.1、DeepSeek-V4-flash-Base=91.9、DeepSeek-V4-Pro-Base=93.4 |
| CMMLU†（5-shot） | 91.6% | 同行 Hy4=93.1、Hy3 preview=89.6、DeepSeek-V4-flash-Base=89.8、DeepSeek-V4-Pro-Base=90.7 |
| SimpleQA（5-shot） | 37.5% | 同行 Hy4=57.2、Hy3 preview=26.4、DeepSeek-V4-flash-Base=31.3、DeepSeek-V4-Pro-Base=52.1 |
| Chinese-SimpleQA†（5-shot） | 74.6% | 同行 Hy4=83.9、Hy3 preview=69.6、DeepSeek-V4-flash-Base=71.9、DeepSeek-V4-Pro-Base=76.6 |
| AGIEval (English)†（3-shot） | 75.4% | new-benchmark: agieval；同行 Hy4=79.3、Hy3 preview=76.0、DeepSeek-V4-flash-Base=76.3、DeepSeek-V4-Pro-Base=78.2 |
| AGIEval (Chinese)†（3-shot） | 90.6% | new-benchmark: agieval；同行 Hy4=91.2、Hy3 preview=87.8、DeepSeek-V4-flash-Base=88.5、DeepSeek-V4-Pro-Base=89.8 |
| HellaSwag (3,000-item subset)（10-shot） | 85.2% | 同行 Hy4=87.1、Hy3 preview=85.7、DeepSeek-V4-flash-Base=85.1、DeepSeek-V4-Pro-Base=86.8 |
| PIQA（4-shot） | 84.4% | new-benchmark: piqa；同行 Hy4=85.3、Hy3 preview=84.6、DeepSeek-V4-flash-Base=83.8、DeepSeek-V4-Pro-Base=84.9 |
| ARC-Challenge（0-shot） | 95.0% | 同行 Hy4=97.3、Hy3 preview=96.0、DeepSeek-V4-flash-Base=97.3、DeepSeek-V4-Pro-Base=97.0 |
| Social IQa（0-shot） | 80.1% | new-benchmark: social-iqa；同行 Hy4=82.7、Hy3 preview=80.5、DeepSeek-V4-flash-Base=72.5、DeepSeek-V4-Pro-Base=73.1 |
| KOR-Bench（3-shot） | 54.7% | 同行 Hy4=57.6、Hy3 preview=54.6、DeepSeek-V4-flash-Base=53.4、DeepSeek-V4-Pro-Base=55.4 |
| C³（0-shot） | 77.3% | 同行 Hy4=82.4、Hy3 preview=75.9、DeepSeek-V4-flash-Base=74.1、DeepSeek-V4-Pro-Base=78.3 |
| U-MATH（5-shot） | 69.8% | new-benchmark: u-math；同行 Hy4=71.6、Hy3 preview=60.9、DeepSeek-V4-flash-Base=57.4、DeepSeek-V4-Pro-Base=64.8 |
| OCW Courses（5-shot） | 64.0% | new-benchmark: ocw-courses；同行 Hy4=66.7、Hy3 preview=62.6、DeepSeek-V4-flash-Base=63.3、DeepSeek-V4-Pro-Base=68.2 |
| MBPP-plus（3-shot） | 73.7% | 同行 Hy4=74.0、Hy3 preview=77.4、DeepSeek-V4-flash-Base=76.8、DeepSeek-V4-Pro-Base=79.1 |
| Belebele (5-language subset)†（5-shot） | 93.8% | new-benchmark: belebele；同行 Hy4=95.0、Hy3 preview=94.2、DeepSeek-V4-flash-Base=94.4、DeepSeek-V4-Pro-Base=95.2 |
| INCLUDE†（5-shot） | 82.8% | 同行 Hy4=88.1、Hy3 preview=84.3、DeepSeek-V4-flash-Base=84.0、DeepSeek-V4-Pro-Base=84.3 |
| MMMU-Pro (Standard, 10 opts)（4-shot） | 52.0% | 同行 Hy4=59.6；Hy3 preview 与 DeepSeek 两列官方留空 |
| SimpleVQA（4-shot） | 48.5% | 同行 Hy4=54.5 |
| CVBench（4-shot） | 83.4% | 同行 Hy4=86.7 |
| RealWorldQA（4-shot） | 71.1% | 同行 Hy4=72.3 |
| TextVQA（4-shot） | 73.4% | new-benchmark: textvqa；同行 Hy4=78.2 |
| CountBenchQA（4-shot） | 86.6% | new-benchmark: countbenchqa；同行 Hy4=90.6 |
| WorkIndex（内部 8 个评测集） | 42.1 | new-benchmark: workindex；模型卡散文明文，Hy4 preview=39.7、Hy4=51.4 |
| Open Benchmarks（7 个公开 Agent 评测集汇总） | 48.3 | new-benchmark: hy4-open-benchmarks-aggregate；官方博客 echarts 数据块机读 |
| 盲测用户满意度（4 分制） | 2.79/4 | new-benchmark: hy4-flash-blind-eval；Claude Haiku 5.5=2.81/4；中位端到端完成 6.7 分钟、单任务成本 RMB 0.26 |

† 官方标注：† 行为 macro-average accuracy，其余文本行用评测套件报告的 accuracy 指标；粗体只标同行最高分，不代表统计显著性。

## 未转录区块说明

- 图 1 / 图 2 / 盲测图 / benchmark 全表以位图存档于 `images/`，供人工复核；对应数值已由官方散文或官方 echarts 数据块给出，本表未从位图读数。
