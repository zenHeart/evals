---
vendor: qwen
model: Qwen3.8-Max-0902
release: qwen3-8-max-0902
date: 2026-09-02
source: https://weibo.com/ttarticle/p/show?id=2309405338660580229122
fetched_at: 2026-09-02
---

# Qwen3.8-Max-0902 发布（微博官方公告《Qwen3.8-Max更强了！》）

来源两级：
1. **官方发布文**（一级来源）：千问官方微博文章《Qwen3.8-Max更强了！》，publishedTime `2026-09-02 11:22:12`，发布于浙江。本页 `page.html` 外另存 `weibo-article.html`（curl 抓取，内嵌全文，与 web reader 双路径一致，非 JS 壳）。
2. **官方模型页**（一级来源）：千问AI平台 https://www.qianwenai.com/models/qwen3.8-max-0902 （注意：URL 为**点号** `qwen3.8-max-0902`；连字符形式 `/models/qwen3-8-max-0902` 返回 404）。本归档 `page.html` 即该页渲染 HTML（95 KB，定价区为 DOM 机读）。

## 公告全文（逐字转录）

> Qwen3.8-Max更强了！
>
> 今天，Qwen3.8-Max升级到0902版本。
>
> 1个月前，我们发布并开源了Qwen3.8-Max，陆续收到了企业和开发者们的热烈反馈和建议。在此基础上，我们围绕编程（Coding）和专业办公（Cowork），对Qwen3.8-Max进行了进一步的后训练，使得模型整体性能再度突破，更适合企业真实复杂任务、科研、长周期任务等。
>
> 【图 1：images/01.png】
>
> 在CodeArena前端编程总榜中，Qwen3.8-Max提升22分至1691分夺得冠军。这说明，Qwen3.8-Max拥有更强的智能体编程能力，在多步推理、工具调用、端到端app生成方面均刷新了全球模型的新上限。同时，CodeArena更新的模型性价比榜单（帕累托前沿）显示，Qwen3.8-Max-0902新版本每百万Tokens综合平均仅5美元，而当前性能排名第二和第三的模型百万Tokens综合价格分别为20美元和12美元。
>
> 【图 2：images/02.png】
>
> 现在，全新的Qwen3.8-Max-0902版本模型，已上线千问AI平台对外提供API服务，并且第一时间接入千问办公、Qoder、千问APP，供所有企业、开发者和用户们使用。
>
> 【图 3：images/03.png】
>
> 欢迎体验👇
>
> 千问AI平台：
> https://www.qianwenai.com/models/qwen3.8-max-0902
>
> 发布于浙江

## 评测数据（转录）

### 散文明文行

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| CodeArena 前端编程总榜 | 1691 | 散文明文「提升22分至1691分夺得冠军」，第三方 Arena.ai 榜单转述（benchmark_owner_reported）；榜单图（01.png）标题为「Code Arena: WebDev」 |
| —（CodeArena 性价比榜 / 帕累托前沿） | $5/M | 非评测分数，为公告引第三方榜单的综合均价口径：新版本每百万 Tokens 综合平均约 5 美元；性能第二/第三的模型综合价 $20 与 $12（图 02 tooltip 视觉读数 $5.00/M blended price, 3:1 ratio） |
| —（平台定价，模型页 DOM） | ¥12 / ¥36 | 非评测分数，来源为本归档 page.html 定价区：输入 ¥12/M tokens、输出 ¥36/M tokens；输入缓存命中 ¥1.5/M、显式缓存创建 ¥15/M、显式缓存命中 ¥1/M；最大输入 991K / 最大输出 131K（思考模式 983K / 131K）；上下文 1M；最大思维链 262K；TPM 1M；内置工具 code_interpreter、i2i_search |

### 图 1（images/01.png）——Arena.ai「Code Arena: WebDev」榜单截图（视觉转写，未人工确认，不作账本证据）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Code Arena: WebDev | (视觉转写) Qwen3.8-Max-0902 #1 = 1,691 | 标题「Qwen3.8-Max-0902: Ranked #1」，来源标注 SOURCE: ARENA AI LEADERBOARD (ARENA.AI/LEADERBOARD/CODE)；图中未显示投票数 |
| 同榜 #2 | (视觉转写) Claude Opus 5 (Max) = 1,688 | 竞品列，仅归档 |
| 同榜 #3 | (视觉转写) Kimi K3 (Max) = 1,674 | 竞品列，仅归档 |
| 同榜 #4 | (视觉转写) Qwen3.8-Max = 1,669 | 与散文「提升22分」自洽（1669 → 1691）；与 Qwen 官方 X 帖 "jumps from 1669 to 1691" 一致 |

### 图 2（images/02.png）——Arena.ai「Pareto Frontier for Code Arena: WebDev」性价比图（视觉转写，未人工确认）

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| Pareto Frontier（性价比） | (视觉转写) tooltip: qwen3.8-max-0902 · Alibaba · Proprietary · Score 1691 · $5.00/M | 横轴为 Blended price per 1M tokens (3:1 Ratio)；qwen3.8-max-0902 位于前沿最左上（最高分、最贵）；前沿其余点视觉读数约 hy4-preview ~$2/1630、qwen3.8-flash-next ~$0.5/1620、mimo-v2.5 ~1440、solar-pro4 ~1360、granite-4.1-8b ~1190（均为近似读数） |

### 图 3（images/03.png）——公告内嵌 17 项 benchmark 对比表（视觉转写，未人工确认；**待人工读图后补入账本**）

列：Qwen3.8-Max-0902（高亮列）| Qwen3.8-Max | Claude-Opus-5 | Fable5 | GPT5.6 Sol。分区：Coding / Agent / Multimodal Intelligence。

| 评测 | 分数 | 备注 |
| --- | --- | --- |
| TerminalBench 3.0 | (视觉转写) 29.0 | 08-03 版 11.3；竞品列 Opus 42.7 / Fable5 34.0 / GPT5.6 34.6；脚注 2：Claude Code avg@5、10h 超时、max_tokens 128000、temp 1.0、1M 上下文 |
| DeepSWE 1.1 | (视觉转写) 69.3 | 08-03 版 56.6；Opus 73.6 / Fable5 69.7 / GPT5.6 72.7；脚注 3：mini-SWE-agent、temp 1.0、top_p 0.95、1M 上下文 |
| NL2Repo-Bench | (视觉转写) 64.9 | 08-03 版 55.9；Opus 72.3 / Fable5 70.2 / GPT5.6 --；脚注 4：Claude Code，禁网搜与 pip download/install、git clone 防 reward hacking |
| ProgramBench (Almost Solved) | (视觉转写) 28.0 | 08-03 版 10.5；Opus 41.5 / Fable5 33.0 / GPT5.6 23.0；脚注 5：Claude Code、12h 超时、max_tokens 64000、1M 上下文 |
| SWE-Marathon | (视觉转写) 44.8 | 08-03 版 39.1；Opus 50.0 / Fable5 45.0 / GPT5.6 42.5；脚注 6：Claude Code、10h 超时、1M 上下文 |
| MLS-Bench-Lite | (视觉转写) 50.1 | 08-03 版 41.0；Opus 49.8 / Fable5 49.9 / GPT5.6 46.2；脚注 7：Claude Code、5h 超时、max_tokens 65535，其他模型取官方排行榜 |
| SWE-Atlas QnA | (视觉转写) 66.3 | 08-03 版 60.3；Opus 63.2 / Fable5 39.0 / GPT5.6 46.0 |
| QwenSWEBench V2 | (视觉转写) 70.0 | 08-03 版（V1）55.1；Opus 68.0 / Fable5 67.1 / GPT5.6 --；脚注 8：内部基准、Claude Code avg@3、8h、max_tokens 64000、temp 1.0、1M 上下文 |
| CoWorkBench | (视觉转写) 76.1 | 08-03 版 74.8；Opus 79.6 / Fable5 75.9 / GPT5.6 71.5；脚注 9：内部办公协作基准 |
| JobBench | (视觉转写) 64.0 | 08-03 版 53.4；Opus 67.8 / Fable5 57.4 / GPT5.6 45.4 |
| Automation Bench v1.0.6 (Pass@1) | (视觉转写) 50.8 | 08-03 版 --；Opus 50.3 / Fable5 46.2 / GPT5.6 45.8；脚注 10：纳入 PR #16 后运行（github.com/zapier/automationbench） |
| Toolathlon Verified (Pass@1) | (视觉转写) 73.3 | 08-03 版 72.5；Opus 77.6 / Fable5 77.9 / GPT5.6 74.9 |
| WorkArena (Elo Rating) | (视觉转写) 1468 | 08-03 版 1348；Opus 1437 / Fable5 -- / GPT5.6 1482；脚注 11：内部人工评测，外部领域专家出题，29 行业 145 个多文件任务，成对专家比较 Elo |
| MMMU-Pro | (视觉转写) 82.7 | 08-03 版 82.3；Opus 82.6 / Fable5 81.2 / GPT5.6 83.0 |
| ERQA | (视觉转写) 78.3 | 08-03 版 77.8；Opus 67.3 / Fable5 70.0 / GPT5.6 70.0 |
| ClawEval-MM (Pass@3) | (视觉转写) 80.2 | 08-03 版 77.2；Opus -- / Fable5 81.2 / GPT5.6 81.2 |
| BabyVision (w/ CI) | (视觉转写) 93.8 | 08-03 版 91.3；Opus -- / Fable5 90.5 / GPT5.6 88.9 |

表内其余脚注：脚注 1 Fable5 results may involve fallbacks；脚注 12 `--` = 分数尚不可用或不适用。

> 按 goal §12.5：以上三张图全部为**视觉辅助转写**，数值仅存本归档、不得据此翻 verified；人工读图确认后方可补入 `data/model-releases/official/qwen/qwen3-8-max-0902.json`（图 3 的 17 行为最大补行机会）。

## 规格与定价（模型页 page.html 明示）

- 页面自述：「Qwen3.8-Max-0902（别名 qwen3.8-max-2026-09-02）是 qwen3.8-max 的快照版本。编码深度再突破……视觉理解全面精进……延续 100 万上下文、思考模式与完整工具生态。」
- 定价（DOM 机读）：输入 ¥12/M、输出 ¥36/M、输入缓存命中 ¥1.5/M、显式缓存创建 ¥15/M、显式缓存命中 ¥1/M。
- 限速与上下文：最大输入 991K / 最大输出 131K（思考模式 983K / 131K）；上下文 1M；最大思维链 262K；TPM 1M。
- 参数规模未重述（沿用 2026-08-03 官方发布：2.4T 总参 / 95B 激活 MoE）。

## 归档清单

| 文件 | 说明 |
| --- | --- |
| page.html | 千问AI平台模型页（点号 URL，HTTP 200，95,015 B，定价区 DOM 机读） |
| weibo-article.html | 微博官方文章页原始 HTML（curl 直接取得内嵌全文，非 JS 壳，33,589 B） |
| images/01.png | 榜单截图「Code Arena: WebDev」（1080×1080，sinaimg 以 Referer 头下载成功） |
| images/02.png | 「Pareto Frontier for Code Arena: WebDev」性价比图（1080×681） |
| images/03.png | 17 项 benchmark 对比表图（1080×1232，含 12 条协议脚注） |
| manifest.json | 抓取路径与资产清单 |
