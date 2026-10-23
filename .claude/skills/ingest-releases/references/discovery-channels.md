# 发现渠道与日期取证（增此扫描的检索地图）

在册厂商清单以 `data/vendors.json` 为准（coverage_tier 1 = 必扫，2 = 扫描但预期密度低）。
本表沉淀各厂商**官方发布渠道**与已知站点脾气，来自 `data/model-releases/official/README.md`
各批抓取记录的提炼；新经验请回写本表（渠道地图）与 README（批次证据）两处。

## Tier 1 国际

| vendor_id | 官方发布渠道 | 站点脾气 / 已知坑 |
|---|---|---|
| openai | openai.com/news/；sitemap：`openai.com/sitemap.xml/release/`（slug 权威） | WebFetch 常报错→走 web reader；数值多在 vega-lite 组件，从 RSC payload（`self.__next_f.push`）平衡括号解析 `vegaSpec` 取 `title+data.values`，以 `labelValue` 为准并用正文锚点校验；旧 slug 易 404，以 sitemap 为准 |
| anthropic | anthropic.com/news/（newsroom 索引带日期） | 数值几乎全在图片：图片行 pending + 视觉转写进 notes；日期三源互证 = newsroom 索引 + platform.claude.com "Released" 行 + API snapshot id（`claude-x-YYYYMMDD`） |
| google | blog.google/technology/ai/（301 跳转 innovation-and-ai/technology/ai/）；开发者/开源入口 blog.google/innovation-and-ai/technology/developers-tools/；Gemma 模型卡 ai.google.dev/gemma/docs/core/；产品页 deepmind.google/models/gemini/ 与 deepmind.google/models/gemma/ | **防遗漏要点**：Google 具有 Gemini（专有旗舰）与 Gemma（开放权重）双系列；一页多模型与后增变体极其常见（如 Gemma 4 一表 5 变体：E2B/E4B/12B Unified/26B/31B，严禁漏列中间变体）；早期帖对比表若为 GIF，无头浏览器开 GIF 截稳定帧取证 |
| xai | x.ai/news/ | 页面对 reader 与真实 DOM 内容不一致：默认无头浏览器渲染后扫 SVG `<text>`（图表值以无障碍文本内嵌）；包含 Grok 主模型与 Grok Voice Transcribe 等专项模型 |
| meta | ai.meta.com/blog/；research.meta.ai | ai.meta.com 拒多数 reader → Playwright 直读 DOM；覆盖 Llama（开源通用）与 Muse（Muse Image / Muse Video 等多媒体生成）双线；伴随 Evaluation Report PDF 常为 tier-A 补充源 |
| mistral | mistral.ai/news/ + 官方 RSS `https://mistral.ai/rss.xml`（pubDate 可作日期证据）；开发者文档 changelog `https://docs.mistral.ai/resources/changelogs.md`（`.md` 后缀可直取） | 页面常不印日期 → RSS pubDate 取证；覆盖 Mistral/Mixtral（通用）、Mistral Small（端侧小模型）、Mistral OCR（文档智能）、Voxtral（语音）与 Devstral/Robostral 专项线。**评测图表数值在 DOM 里**：`data-chart-canvas` 内每个 `<g class="chart-mark-group">` 带 `data-series` / `data-category` / `data-value` / `data-display` 四个属性，一张图可整体机读（2026-10-20 的 Voxtral 3 页 9 张图、9 个图表全由此路径取得）。静态 HTTP GET 即可拿到完整 HTML，不需要渲染。**注意：官方新闻页只有 92 篇 slug（EN 与 FR 同为 92 条），RSS 也是 92 条——Mistral 的新闻区是「精选」不是全量，专项模型线走博客查不到**（2026-10-08 发布的 `LIDstral-Arabic` / `Voxtral-Mini-4B-Realtime-Arabic` 全程无博客、无 RSS 条目、无 changelog 条目、无 arXiv 论文、无 GitHub 仓、无 API 文档模型页，**只有官方 HF 模型仓**；查漏必须走 HF org API）。官方 changelog 的 `.md` 按 `## YYYY-MM-DD` 分组，可直读某段窗口 |

## Tier 1 国内

| vendor_id | 官方发布渠道 | 站点脾气 / 已知坑 |
|---|---|---|
| kimi | www.kimi.com/en/blog/ + www.kimi.com/code/docs/en/kimi-code/whats-new.html（预览版也在此发布）；历史发布走 HF model card（moonshotai org，A 级）；旧域 kimi.ai/blog/ | 索引只挂最近 ~9 篇链接；国内/海外域名存在别名对账；表格有时非 DOM 组件（正文有 Evaluations 却无分数 → 先怀疑渲染遗漏，Playwright DOM 扫描 `table` 与 `img`） |
| deepseek | api-docs.deepseek.com/zh-cn/news/（slug 含日期如 `news250821`） | 分数常在 webp 图：图行 pending + 视觉转写进 notes；slug 裸格式会重定向到文档首页 |
| glm | z.ai/blog/ | 完整 DOM 表 + 每表独立协议脚注是常见形态（verified 密度最高的来源）；无头浏览器兜底 |
| minimax | minimax.io/news/（新版）；agent.minimax.cn/tools/* 与 agent.minimax.io/tools/*（Agent/IDE 工具落地页）；platform.minimax.io/docs/release-notes/models（开发者平台模型日志）；旧 /blog/ slug 带时间戳后缀（后缀≠发布时间戳） | **防遗漏要点**：MiniMax 具备多子域矩阵（官网、开发者文档、Agent 工具平台），模型发布形态不仅限于博客长文，亦会作为 Agent 落地页（如 `/tools/m3-1-flash-preview`）或文档日志直接上线；扫描白名单需囊括 `agent.minimax.*` 与 `platform.minimax.io`；JS 渲染站：大结果表多为整图或产品实战案例，无离散基准打分表时行记 pending |
| qwen | qwen.ai/blog?id=<model>（research 索引分页找 id，勿猜）；旧域 qwenlm.github.io 部分存活 | id 体系不规律（qwen3.8 / qwen3-max 并存，qwen3.7-max 空壳）；多模态有独立 Qwen-Image / Qwen-Omni 线；DOM 表多且机读，必须逐张转录 |
| doubao | seed.bytedance.com/en/blog/ + 各专项 Landing Pages（seedream / seedance / seedrealtime / seed audio） | **防遗漏要点**：字节跳动除通用豆包/Seed 外，多模态采用独立品牌前缀（Seedance 视频 / Seedream 图像设计 / SeedRealtime 全双工实时音视频 / Seed Audio 音频创作）；散文少分数、分数图多：图行 pending；正文明确论断行可 verified + not_extracted |

## Tier 2（扫但预期低频）

| vendor_id | 官方发布渠道 | 备注 |
|---|---|---|
| tencent | hy.tencent.com（blog，SPA 需渲染）；腾讯新闻官方通稿可作日期证据；官方 GitHub 仓 Tencent/*（README DOM 表） | 附录"模型得分"是整图 → pending；正文散文分数可 verified |
| stepfun | stepfun.ai/research/（DOM 大表）；static.stepfun.com/blog/<model>/；官方 GitHub 仓（createdAt 作日期证据） | 表注 `*` = 同条件复现语义；自建内部集照录并注明 |
| microsoft | microsoft.ai/blog/（news 301 重定向至此）；模型落地页 microsoft.ai/models/*（MAI 系列规格大页） | **防遗漏要点**：覆盖 MAI 系列（MAI-Transcribe 语音转录、MAI-Image 图像生成、MAI-Voice、MAI-Thinking、MAI-Code）与 Phi 系列；正文散文明文分数可 verified，对比表多为整图 → pending；规格直接在落地页印出 |
| xiaomi | mimo.xiaomi.com/ | MiMo-V2.6 已入库；首页为发现入口，规格与日期逐页取证；区分 MiMo 开发者平台/桌面端（product）与模型权重 |

## 查漏渠道：官方 HuggingFace / GitHub 组织（**发现新发布的低成本入口**）

官方模型仓是 A 级来源（与官方博客同级），且 `createdAt` 给出候选发布日；按纪律它只用于**查漏与佐证**，正式建档仍需官方发布文 / 模型卡 / 官方仓 README 的日期互证。
`https://huggingface.co/api/models?author=<org>&limit=200&sort=createdAt&direction=-1` 一次即可取回该组织全部模型仓的创建日。

| 厂商 | HF 组织 | 备注 |
|---|---|---|
| Mistral | `mistralai` | 语音 / 端侧 / OCR 专项权重常先于博客上线（`LIDstral-Arabic`、`Voxtral-Mini-4B-Realtime-Arabic` 2026-10-08、`LIDstral-Arabic` 之外还有 `Voxtral-Mini-4B-Realtime-Arabic-WebGPU` space 与 `onnx-community` 的 ONNX 镜像——**后两者是下游社区产物，不是官方发布渠道**）。共同开发方的官方组织（如摩洛哥 `Morocco-MTNRA-Labs`）会镜像同一模型仓，可作「发布已公开」的第二处佐证 |
| 腾讯混元 | `tencent` | `Hy-Memory-*`（记忆写入模型）、`Youtu-Parsing-Omni`（文档解析）**只有模型仓+GitHub 仓，没有博客发布文**，靠这条线才不漏 |
| 阿里 Qwen | `Qwen` | 同一家族的后加速 checkpoint（如 `Qwen-Image-2.1-Turbo`）只在官方仓 README 更新日志里带日期 |
| StepFun | `stepfun-ai` | 多为已建档模型的量化版本（NVFP4 / BF16 / GGUF），量化版不另建档 |
| 微软 | `microsoft` | 窗口内新增多为研究产物模型，不是 MAI / Phi 系列发布 |
| Google | — | Gemma / Gemini 权重不挂在 `google` 组织下，此路查不到 |
| Meta | `meta-llama` | 2025-04 后无新仓；Muse 系列走 `research.meta.ai/blog`（见 Meta 行） |
| 智谱 | `zai-org` | 最新仓为 GLM-5.3 系；`z.ai/blog` 被拦截时用它判断是否真有新模型 |
| DeepSeek / Kimi | `deepseek-ai` / `moonshotai` | 发布密度低，作为兜底 |
| MiniMax | `MiniMaxAI` | 最新仓 Music-3.0 / H3，与新闻页节奏不同步 |

官方 GitHub 仓 README 的**更新日志**是可靠的官方日期证据（同一行写「YYYY.MM.DD: We released …」），比博客页更好取证：
`QwenLM/Qwen-Image-2.1`（2026.10.09 Turbo）、`Tencent-Hunyuan/Hy-Memory`、`TencentCloudADP/youtu-parsing`。

## 已知抓取障碍（别重复踩）

| 站点 | 现象 | 可用绕行 |
|---|---|---|
| `z.ai/blog` | 静态 GET 返回 nginx 404；`/blog/feed`、`/rss.xml` 均 404；无头渲染只得 152 字节挑战页 | 只能靠 `zai-org` 模型仓 + 官方 GitHub 判断有无新模型；本轮窗口内无法巡检公告 |
| `microsoft.ai/blog` / `microsoft.ai/models` | 403 Cloudflare 挑战页；官方 RSS 通道 `https://microsoft.ai/feed/` 返回**空条目** | 靠 `microsoft` HF 组织旁证；本轮窗口内无法巡检公告 |
| `qwen.ai/blog?id=…` | 正文纯客户端渲染：无头 Chrome 不 hydrate（只见导航壳）、爬虫 UA 也只拿到 SEO 关键词 | 同一模型的规格改从官方 GitHub 仓 README + 官方模型仓取证；索引页只作发现入口 |
| `openai.com/index/<slug>` | 静态 GET 返回 Cloudflare 验证页；但 `https://openai.com/news/rss.xml`（1300 条、带 pubDate）**不拦**，全站发现走 RSS | RSS 发现 + `web_fetch` 工具读正文 |
| `x.ai/news`、`ai.meta.com/blog` | 静态 GET 403/不可达 | 无头 Chrome 渲染（`x.ai` 可行）；Meta 改走 `research.meta.ai/blog`（可静态 GET） |
| `hy.tencent.com` | SPA，只出骨架屏；页面里的 `2026/10/16` 是**站点 build-time**，不是发布日 | 靠 `tencent` HF 组织 + 官方 GitHub |
| `blog.google` 的三条 RSS（`/rss/`、`/innovation-and-ai/technology/ai/rss/`） | **只暴露最近 20 条**；`?start=20/40/60` 不分页（返回与首屏完全相同的 20 条，文件字节数一致） | Google 的完整时间线靠 `deepmind.google/blog/rss.xml`（100 条，可回溯 3 个月）+ `blog.google/rss/` 定点补；**别把 Google 博客 RSS 当作全量窗口**——单靠它扫窗口会静默漏掉 20 条之前的发布 |
| `openai.com/index/<slug>` 的内嵌 Vega 图表 | 渲染后 SVG 的 `aria-label` **只覆盖部分 mark**（2026-10-22 在 GPT‑Rosalind 页实测：20 个数据 mark 只暴露 15 个，其余 5 个无障碍文本缺失） | 以 RSC payload 的 `vegaLiteSpec.data.values` 为全集来源（`self.__next_f.push` 里解析），SVG 无障碍文本只作交叉校验；缺值时不要用柱体几何反推 |
| `mistral.ai/news/*` 的 `dateModified` 字段 | **是全站重新生成的时间戳，不是该文的编辑时间**——2026-10-23 实测 `mistral-saba`、`mixtral-8x22b`、`codestral`、`mistral-3`、`le-chat-mistral` 五个页面的 `dateModified` 全是 `2026-10-08T13:46:xx`（相差数秒） | **不可当发布日或编辑日证据**；要日期只认 `datePublished`、RSS `pubDate`、正文印刷日或官方仓创建日。特别提醒：Mistral Saba 是 2025-02-17 的老模型，`dateModified=2026-10-08` 极易被误读成「阿拉伯语模型发布日」 |

> 「上一轮跑批遗留未收口」的判定：开工前若发现**当前本地分支**是某个已合并的 `model-release-daily-*`，且存在**更新的远端 `model-release-daily-*` 带 OPEN PR**，说明上一轮在「开 PR」与「合并」之间断了。不要重跑那一批，也不要当残留清理——先把那个 OPEN PR 合并并确认其 CI 为绿，再从 `origin/main` 开本轮新分支。

## 图表数值取数：先分清「DOM 可机读」与「只在位图里」

发布页的评测图表有三类，取数方式完全不同，取数前先判类型：

1. **DOM 机读图表**（可逐行核对）：图表组件把每个数据点写成结构化属性，静态抓 HTML 即可取全。
   - Mistral：`data-chart-canvas` → `<g class="chart-mark-group" data-series=… data-category=… data-value=… data-display=…>`
   - xAI：渲染后扫 SVG `<text>`（图表值以无障碍文本内嵌）
   - OpenAI：RSC payload（`self.__next_f.push`）里解析 `vegaSpec` / `vegaLiteSpec` 的 `data.values`，以 `labelValue` 为准（**注意：渲染后 SVG 的 `aria-label` 可能只暴露部分 mark，取全集要回 payload**，见「已知抓取障碍」表）
   这类与本账本既有 `xai/grok-4-6`（locator 记「Also rendered as bar chart; the DOM contains the numeric values」）、`openai/gpt-5-6` 的处理口径一致：DOM 数值可逐行核对，同时在 `locator.figure` 注明「以图渲染但 DOM 内含数值」。
2. **位图图表**（数值只存在于像素）：`img` / 背景图，需人工读图。视觉转写只进 `notes`，数值留 `null` + `score_status:"not_extracted"`。
3. **真表格**：Markdown / DOM `<table>`，逐行转录。

判据是「数值是否已写成可机读的 DOM 结构」，不是「长不长得像图」——柱状图、散点图、雷达图都可能是第 1 类。
**注意**：README「抽取口径」一节现写的是「图片/图表行必须 pending」，字面上可被读成「凡图表一律 pending」；近三批对 DOM 机读图表（xAI SVG 文本、OpenAI vega、Mistral data-value）均按「DOM 明文」记 `verified`。口径措辞是否要收敛，属账本口径变更，需人工裁定后再改，本技能不擅改。

## 旁证与交叉核对（仅作线索，日期与数值一律以官方页为准）

- **OpenRouter**：`https://openrouter.ai/api/v1/models` 各模型 `created` 时间戳——上架日常≈发布日（可差 1-2 天，权重先行或 API 先行时以官方页为准）；也是"这家最近发过什么"的查漏清单。
- **HuggingFace org createdAt**：权重先行于 blog 1-2 天很常见；单独不作为发布日，与官方页互证。
  - **例外（账本既有先例）**：当该模型**没有任何其它官方发布渠道**（无博客 / 无 RSS / 无 changelog / 无论文 / 无 GitHub 仓 / 未进 API 文档）时，官方模型仓的创建日就是「权重与官方模型卡上线日」，可作发布日——先例 `zai-org/GLM-OCR`（第三十批，以权重与模型卡上线日 2026-01-30 为发布日）、`mistralai/LIDstral-Arabic` 与 `mistralai/Voxtral-Mini-4B-Realtime-Arabic`（第三十二批，2026-10-08，两个仓相隔 61 秒属同批发布，并由共同开发方官方 org 在次日镜像佐证）。**用此路径时必须在 notes 写清「已逐一核过哪些渠道均无公告」，别让读者误以为有发布文。**
- **官方 sitemap / RSS**：openai、mistral（RSS pubDate）可作日期一级证据。
- **聚合站**（Artificial Analysis、 Various leaderboards）：**只用来发现线索**。其榜单值若被厂商原页转载，按 `third_party_reported` 记录；聚合站自身的数字不入账。

## 新厂商接入（发现未注册厂商的正式发布时）

1. `data/vendors.json` 注册：kebab-case `id`、`name`、`display_name`、`region`（CN|GLOBAL）、`coverage_tier: 2`、`active: true`。
2. `scripts/fetch-logos.mjs` 的 `DOMAINS` 表加该厂商候选官方域名（1-3 个，按优先级）。
3. 运行 `node scripts/fetch-logos.mjs`（全量重抓，输出到 `assets/logos/`），确认新厂商文件生成且为彩色品牌标。
4. `scripts/vendor-logos.mjs` 的 `LOGO_EXT` 登记实际扩展名（png/jpg）——不登记则站点徽章退化为字母点。
5. 本表 Tier 2 加一行渠道说明。

图标铁律：**必须真实厂商彩色 logo，禁止字母占位**——这是用户明确红线（GLM/stepfun/阿里曾因字母替换被打回）。
