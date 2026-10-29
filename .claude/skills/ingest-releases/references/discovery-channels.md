# 发现渠道与日期取证（增此扫描的检索地图）

在册厂商清单以 `data/vendors.json` 为准（coverage_tier 1 = 必扫，2 = 扫描但预期密度低）。
本表沉淀各厂商**官方发布渠道**与已知站点脾气，来自 `data/model-releases/official/README.md`
各批抓取记录的提炼；新经验请回写本表（渠道地图）与 README（批次证据）两处。

## Tier 1 国际

| vendor_id | 官方发布渠道 | 站点脾气 / 已知坑 |
|---|---|---|
| openai | openai.com/news/；sitemap：`openai.com/sitemap.xml/release/`（slug 权威，**但 lastmod 不可当日期**）；`openai.com/index/<slug>` | WebFetch 常报错→走 web reader；数值多在 vega-lite 组件，从 RSC payload（`self.__next_f.push`）平衡括号解析 `vegaSpec` 取 `title+data.values`，以 `labelValue` 为准并用正文锚点校验；旧 slug 易 404，以 sitemap 为准。**2026-10-25 实测：`/sitemap.xml/release/` 的 84 条 `lastmod` 全是 `2026-10-24T0x`（全站批量重新生成时间戳），不是各文发布/编辑日——只能取 slug 清单，日期一律走 RSS `pubDate`**；且 `openai.com/index/<slug>` **并非一律 403**（如 `terminal-x` 静态 GET 得 365KB 全文，正文明文数值可直接机读），逐个 slug 实取比假设被拦更靠谱 |
| anthropic | anthropic.com/news/（newsroom 索引带日期）；**模型总表 `platform.claude.com/docs/en/models/overview`**；**单模型页 `platform.claude.com/docs/en/models/<model>/overview`** | 数值几乎全在图片：图片行 pending + 视觉转写进 notes；日期三源互证 = newsroom 索引 + platform.claude.com "Released" 行 + API snapshot id（`claude-x-YYYYMMDD`）。**2026-10-24 实测：newsroom 索引只能静态取到最近 ~26 条且多为政策/合作类；模型存在性以 `platform.claude.com/docs/en/models/overview` 为准**——该页把 specialized models 单列（如 Claude Mythos 5 / 5.1，与 Fable 5 / 5.1 同源同发），只看 newsroom 会漏掉这些型号名。**2026-10-25 实测：单模型页的 SSR HTML 里 `<dt>Released</dt><dd>…</dd>` 对可直接正则解析**，一次拿到 Context window / Max output / 输入输出定价 / Released 日期（Released 字段是**日期精度**的值，如 "June 9, 2026"），是取规格与发布日最快的通道；注意 docs 把 Mythos（Specialized models）与 Fable（Legacy models）分栏单列，但**账本里 Mythos 是作为 Fable release 的 `models[]` 条目收录的**——巡检时别把 Mythos 当成漏建档 |
| google | blog.google/technology/ai/（301 跳转 innovation-and-ai/technology/ai/）；开发者/开源入口 blog.google/innovation-and-ai/technology/developers-tools/；Gemma 模型卡 ai.google.dev/gemma/docs/core/；产品页 deepmind.google/models/gemini/ 与 deepmind.google/models/gemma/ | **防遗漏要点**：Google 具有 Gemini（专有旗舰）与 Gemma（开放权重）双系列；一页多模型与后增变体极其常见（如 Gemma 4 一表 5 变体：E2B/E4B/12B Unified/26B/31B，严禁漏列中间变体）；早期帖对比表若为 GIF，无头浏览器开 GIF 截稳定帧取证。**2026-10-24 实测：`deepmind.google/blog/rss.xml` 是 gzip 压缩的**——`curl` 不加 `--compressed` 会拿到二进制乱码（Node fetch 自动解压，不受影响）；该 RSS 有 100 条、可回溯 3 个月，是 Google 的主巡检通道。**2026-10-28 实测（Gemini 4 Carbon）：发布文正文只印 4 个基准的明文分值，但页面内嵌一张 17 行评测总表图片**（17 基准 × 5 模型列）——「页面有图表」不等于「正文无数值」，也不等于「数值都在正文」；判定顺序仍是先剥 `<script>`/`<style>` 后在可见文本里正则找明文分值，再单独把总表图按 pending + 视觉转写进 notes 逐行落账。**且官方另发评测方法说明 PDF：`deepmind.google/models/evals-methodology/<model>/` 直接返回 `application/pdf`**（最终 302 到 `storage.googleapis.com/deepmind-media/gemini/*.pdf`），里面逐基准写明 harness（如 Antigravity / mini-swe-agent / ALE-Claw / Gemini CUA）、judge、time cap、题集子集与 pass@1 口径——**这是 `protocol` 字段唯一有据可依的来源**，只读发布文会把协议字段全留 null。另注意 `deepmind.google/blog/<slug>` 会 **301 跳转到 blog.google 的规范页**（字节一致），归档只存一份 HTML、别重复下载 |
| xai | x.ai/news/（**索引被 Cloudflare 拦，但 `/news/<slug>` 文章页可直取**）；`docs.x.ai/docs/models`；`docs.x.ai/docs/release-notes` | 页面对 reader 与真实 DOM 内容不一致：默认无头浏览器渲染后扫 SVG `<text>`（图表值以无障碍文本内嵌）；包含 Grok 主模型与 Grok Voice Transcribe 等专项模型。**2026-10-24 实测：`x.ai/news/` 索引 403（Cloudflare），但 `/news/<slug>` 文章页 200**——`grok-4-7`/`grok-4-6`/`grok-voice-3` 均可取，`grok-4-8`/`grok-5`/`grok-voice-transcribe-3` 等 404（用已知 slug 做 sanity check 再信 404）；`/news/rss.xml` 返回应用自身 404 页（说明该路径能绕过 CF 但无此 RSS）；`robots.txt` 指向的 `sitemap.xml` 同样被拦。故**公告流巡检走「docs 模型总表 + slug 探测」**，docs 导航标「Grok 4.7 = Latest」可判断当前旗舰。**2026-10-25 复测：直取 slug 的日期证据可用——`/news/<slug>` 的 JSON-LD `datePublished` 即发布日**；本轮已核验 200 的 slug：`grok-4-7`(2026-09-21)、`grok-voice-3`(2026-10-14)、`grok-imagine-image-2`(2026-08-07)、`grok-imagine-video-1-5`(2026-06-16)、`grok-code-fast-1`(2025-08-28)；404 的：`grok-4-8`/`grok-5`/`grok-imagine-image-2-0`/`grok-imagine-video-1-5-preview`。**注意 docs 模型总表里的模型名与 news slug 不是一一对应**（表里的 `grok-imagine-image-2.0` 对应的 slug 是 `grok-imagine-image-2`），按表名直接拼 slug 会误判 404 |
| meta | ai.meta.com/blog/；research.meta.ai | ai.meta.com 拒多数 reader → Playwright 直读 DOM；覆盖 Llama（开源通用）与 Muse（Muse Image / Muse Video 等多媒体生成）双线；伴随 Evaluation Report PDF 常为 tier-A 补充源 |
| mistral | mistral.ai/news/ + 官方 RSS `https://mistral.ai/rss.xml`（pubDate 可作日期证据）；开发者文档 changelog `https://docs.mistral.ai/resources/changelogs.md`（`.md` 后缀可直取） | 页面常不印日期 → RSS pubDate 取证；覆盖 Mistral/Mixtral（通用）、Mistral Small（端侧小模型）、Mistral OCR（文档智能）、Voxtral（语音）与 Devstral/Robostral 专项线。**评测图表数值在 DOM 里**：`data-chart-canvas` 内每个 `<g class="chart-mark-group">` 带 `data-series` / `data-category` / `data-value` / `data-display` 四个属性，一张图可整体机读（2026-10-20 的 Voxtral 3 页 9 张图、9 个图表全由此路径取得）。静态 HTTP GET 即可拿到完整 HTML，不需要渲染。**注意：官方新闻页只有 92 篇 slug（EN 与 FR 同为 92 条），RSS 也是 92 条——Mistral 的新闻区是「精选」不是全量，专项模型线走博客查不到**（2026-10-08 发布的 `LIDstral-Arabic` / `Voxtral-Mini-4B-Realtime-Arabic` 全程无博客、无 RSS 条目、无 changelog 条目、无 arXiv 论文、无 GitHub 仓、无 API 文档模型页，**只有官方 HF 模型仓**；查漏必须走 HF org API）。官方 changelog 的 `.md` 按 `## YYYY-MM-DD` 分组，可直读某段窗口。**2026-10-26 实测：Mistral 官方发布文会把「图表图片」与「正文散文明文」两种呈现形式混在同一页**——`mistral-large-4` 页既有 2400×1582 的 WebP 评测大图（`/_astro/*.webp`），正文段落里又明文印着 AA Cyber Index 分项 82% / Cybench 93% / DeepSWE v1.1 61.7% / SWE-Atlas-QnA 59.4% / Terminal-Bench 4.0 28.3% / Coding Agent Index 49.8% / AutomationBench 59.9% / Dense 200 42% / Lakera B3 93.3% 共 9 个绝对分值。**所以「页面有图表」绝不能推出「正文无数值」**：第二十二批因此误判该页「只有图片、无离散明文数字」，把 release 建成 0 条 evidence 的 pending 档，直到第三十七批重扫才发现。判定顺序应为：先剥 `<script>`/`<style>` 后在**可见文本**里正则找「数字+%」并逐句核上下文，再看是否另有图表；图表 DOM 路径（`chart-mark-group`）在这类页面通常为 0，但不代表页面无数据。 |

## Tier 1 国内

| vendor_id | 官方发布渠道 | 站点脾气 / 已知坑 |
|---|---|---|
| kimi | www.kimi.com/en/blog/ + www.kimi.com/code/docs/en/kimi-code/whats-new.html（预览版也在此发布）；历史发布走 HF model card（moonshotai org，A 级）；旧域 kimi.ai/blog/ | 索引只挂最近 ~9 篇链接；国内/海外域名存在别名对账；表格有时非 DOM 组件（正文有 Evaluations 却无分数 → 先怀疑渲染遗漏，Playwright DOM 扫描 `table` 与 `img`） |
| deepseek | api-docs.deepseek.com/zh-cn/news/（slug 含日期如 `news250821`）；**公告通道用 `api-docs.deepseek.com/updates`** | 分数常在 webp 图：图行 pending + 视觉转写进 notes；slug 裸格式会重定向到文档首页。**2026-10-25 实测：`/zh-cn/news/` 与 `/news/rss.xml` 静态 GET 都会落到文档首页（"Your First API Call"），只在侧栏留一条 news slug；真正的公告流在 `/updates`**（静态可取，日期串 2026-10-17 / 09-10 / 08-21 / 08-13 / 07-31 / 07-24 / 04-24），判新发布看它，不要只盯 `/news/` |
| glm | z.ai/blog/ | 完整 DOM 表 + 每表独立协议脚注是常见形态（verified 密度最高的来源）；无头浏览器兜底 |
| minimax | minimax.io/news/（新版）；agent.minimax.cn/tools/* 与 agent.minimax.io/tools/*（Agent/IDE 工具落地页）；platform.minimax.io/docs/release-notes/models（开发者平台模型日志）；旧 /blog/ slug 带时间戳后缀（后缀≠发布时间戳） | **防遗漏要点**：MiniMax 具备多子域矩阵（官网、开发者文档、Agent 工具平台），模型发布形态不仅限于博客长文，亦会作为 Agent 落地页（如 `/tools/m3-1-flash-preview`）或文档日志直接上线；扫描白名单需囊括 `agent.minimax.*` 与 `platform.minimax.io`；JS 渲染站：大结果表多为整图或产品实战案例，无离散基准打分表时行记 pending。**2026-10-24 实测：`platform.minimax.io/docs/release-notes/models` 是唯一带日期的官方模型日志**（`Oct. 19, 2026 / MiniMax M3.1 Flash` 这种「月份. 日, 年 + 模型名 + 一句话」结构，倒序排列，静态 GET 即可取全部条目）——比 `minimax.io/news` 的卡片墙更好取证 |
| qwen | qwen.ai/blog?id=<model>（research 索引分页找 id，勿猜）；旧域 qwenlm.github.io 部分存活 | id 体系不规律（qwen3.8 / qwen3-max 并存，qwen3.7-max 空壳）；多模态有独立 Qwen-Image / Qwen-Omni 线；DOM 表多且机读，必须逐张转录 |
| doubao | seed.bytedance.com/en/blog/ + **seed.bytedance.com/sitemap.xml**（全量博客 URL + lastmod）+ 各专项 Landing Pages（seedream / seedance / seedrealtime / seed audio） | **防遗漏要点**：字节跳动除通用豆包/Seed 外，多模态采用独立品牌前缀（Seedance 视频 / Seedream 图像设计 / SeedRealtime 全双工实时音视频 / Seed Audio 音频创作）；散文少分数、分数图多：图行 pending；正文明确论断行可 verified + not_extracted。**2026-10-24 实测：博客索引是 SPA（静态 GET 只出 11KB 壳），但 `/sitemap.xml` 静态可取**——35 条 URL 覆盖全部模型发布文 + 专项页，配 `<lastmod>`；注意 **lastmod 是页面更新时间不是发布日**（如 seedream 5.0 pro 的 lastmod 2026-09-18 而实际发布日是 2026-07-08），只能用「lastmod 不早于窗口起点」做排除，不能当发布日 |

## Tier 2（扫但预期低频）

| vendor_id | 官方发布渠道 | 备注 |
|---|---|---|
| tencent | hy.tencent.com（blog，SPA 需渲染）；腾讯新闻官方通稿可作日期证据；官方 GitHub 仓 Tencent/*（README DOM 表） | 附录"模型得分"是整图 → pending；正文散文分数可 verified。**2026-10-24 实测：`hy.tencent.com` 全站（/、/blog、/sitemap.xml、/robots.txt）都只回同一份 6.9KB 骨架屏，无内嵌数据**；改走 `tencent` HF 组织 + `Tencent-Hunyuan` 官方 GitHub org（`/orgs/Tencent-Hunyuan/repos?sort=pushed`）。**注意 GitHub org 里大量是 benchmark/研究产物而非模型发布**（OmniCapBench、DiagSafe、CL-bench、Prism、HYDRA、UniRL、ExplorationBench、Precise…），只有 AuK、Hy-Nomas、WeVisOne-VL、Hy-Memory 属模型发布；`tencent/Qwen3-8B-DSpine-b16` 是**投机解码 drafter 研究产物**（arXiv 2609.36173，基于 Qwen3-8B），非独立模型发布，不建档 |
| stepfun | stepfun.ai/research/（DOM 大表）；**`platform.stepfun.com/docs/zh/guides/models/<model>.md`（`.md` 变体直出正文，含模型 ID、计费与明文评测数值）**；static.stepfun.com/blog/<model>/；官方 GitHub 仓（createdAt 作日期证据） | 表注 `*` = 同条件复现语义；自建内部集照录并注明。**2026-10-25 实测：`stepfun.ai/research` 301 跳到白名单外主机（`platform.stepfun.ai`），扫描通道记 inaccessible → 绕行走 `platform.stepfun.com/docs` 的 `.md` 变体**；**`platform.stepfun.com/docs/sitemap.xml` 的 `lastmod` 是站点重建戳（全部模型指南条目同为一天），不可当发布日**——发布日取技术报告或公告（StepAudio 3 取 arXiv 2609.12945 = 2026-09-11） |
| microsoft | microsoft.ai/blog/（news 301 重定向至此）；模型落地页 microsoft.ai/models/*（MAI 系列规格大页）；**官方站点地图 `https://microsoft.ai/sitemap_index.xml` → `new-sitemap.xml`（全部 news 文章 + lastmod）与 `model-sitemap.xml`（模型落地页 + lastmod）** | **防遗漏要点**：覆盖 MAI 系列（MAI-Transcribe 语音转录、MAI-Image 图像生成、MAI-Voice、MAI-Thinking、MAI-Code、MAI-Cyber）与 Phi 系列；正文散文明文分数可 verified，对比表多为整图 → pending；规格直接在落地页印出。**2026-10-25 实测：403 命中不稳定——同一 URL 跨轮次 403/200 都有（第三十四批 321 KB 全文可取、本轮扫描通道为 partial）；每轮先实取再判不可达，不要沿用上一轮的失败结论**。**2026-10-29 实测（403 的真因已定位，并据此开出两条稳定巡检通道）：① 触发挑战的是 `Accept` 头而不是 UA——curl 默认发 `Accept: */*` 直接吃到 CF 挑战页 403，显式带 `-H 'accept: text/html'` 后**同一个 URL 立刻 200 返回全文**（`microsoft.ai/blog/`、`/news/<slug>/`、`/models/<slug>/`、`/sitemap_index.xml` 全部可取，带不带 `sec-fetch-*` 头都可用）；② `sitemap_index.xml` → `new-sitemap.xml` 列出全部 news 文章与 `<lastmod>`，是本厂商最省事的发现通道（`model-sitemap.xml` 列模型落地页，2026-10-27 新增 `mai-cyber-1-1-flash/`），但 **lastmod 不等于发布日**（`mai-code-1-1-flash-br-better-faster` 一文 lastmod 2026-10-07，实际发布日 2026-08-11），**发布日期一律取文章页 JSON-LD 的 `datePublished`**（正文标题下方也印印刷日，两源互证）。另：WP REST API（`/wp-json/wp/v2/posts`、`/wp-json/wp/v2/new/<id>`）**全部 401**（需鉴权），别在它上面浪费时间；模型卡直链命名规律为 `https://microsoft.ai/pdf/<Model-Name>-Model-Card.PDF`（`MAI-Code-1.1-Flash-Model-Card.PDF` 200，但 `MAI-Cyber-1.1-Flash-Model-Card.PDF` 实测 **404**，不是每个模型都有卡）** |
| xiaomi | mimo.xiaomi.com/（Rspress 静态站）+ **mimo.xiaomi.com/blog**（博客路由）+ 首页博客卡片清单 | MiMo-V2.6 已入库；首页为发现入口，规格与日期逐页取证；区分 MiMo 开发者平台/桌面端（product）与模型权重。**2026-10-24 实测：站点是 Rspress 生成的纯静态站**——首页 HTML 里直接带博客卡片清单（Research 栏文章带印刷日期，Blog 栏为模型发布文，卡片 01 排最前即最新）；`/blog/<slug>` 路由可静态 GET（`mimo-v2-6`、`mimo-v2-5` 200，`mimo-v2-7` 404）；无 sitemap.xml / robots.txt（均 404） |

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
| `microsoft.ai/blog` / `microsoft.ai/models` | 403 Cloudflare 挑战页（`/feed/` 同样 403）；官方 RSS 通道 `https://microsoft.ai/feed/` 返回**空条目**。**命中不稳定**（2026-10-25 23:19 实测同一 URL 恢复 200、321 KB 全文可取，扫描通道由 inaccessible 升为 partial）。**2026-10-29 定位到真因：curl 默认的 `Accept: */*` 触发 CF 挑战，带 `-H 'accept: text/html'` 同一 URL 即 200 全文** | **绕行：curl 加 `-H 'accept: text/html'`**（2026-10-29 实测：`/blog/`、`/news/<slug>/`、`/models/<slug>/`、`/sitemap_index.xml` 全部 200；`/wp-json/wp/v2/*` 仍 401 需鉴权）。另可用 `sitemap_index.xml` → `new-sitemap.xml` / `model-sitemap.xml` 做发现（但 lastmod ≠ 发布日，日期取文章页 JSON-LD `datePublished`）；再靠 `microsoft` HF 组织旁证 + GitHub API `api.github.com/orgs/microsoft/repos`（2026-10-25 实测：该 org 窗口内新建仓只有 `AnalyticsHub-Dashboard`，是 Copilot 仪表盘安装器，**非 MAI / Phi 模型发布**）；**每轮先实取再判不可达，不要沿用上一轮的失败结论**；按 partial 记 |
| `stepfun.ai/research` | 301 跳到白名单外主机 `platform.stepfun.ai`，扫描通道记 `inaccessible`（`redirect host outside official allowlist`） | 改走官方 `platform.stepfun.com/docs/zh/guides/models/*.md`（`.md` 变体可静态 GET，直出正文，含模型 ID、计费与明文评测数值，如 StepAudio 3 ASR 的错误率/CER）；**注意 `platform.stepfun.com/docs/sitemap.xml` 的 `lastmod` 是站点重建戳（全部模型指南条目同为一天），不能当发布日** |
| `qwen.ai/sitemap.xml` | **返回的是 SPA 的 HTML，不是 XML sitemap**（`<url>` 条目数为 0），拿它当 sitemap 解析会得到空结果 | 别在这条路上耗时间；官方 GitHub `QwenLM/Qwen-Image-2.1` 的 README 更新日志是可靠日期来源（2026-10-25 实测最新条目 `2026.10.09` Turbo），配合 `Qwen` HF 组织 |
| GitHub org API 当查漏通道 | `api.github.com/orgs/<org>/repos?sort=pushed` 一次就能取该 org 全部仓的 `created_at`/`pushed_at`，但**org 里大量是 benchmark / 研究产物而非模型发布** | 逐仓人工判别后再决定是否建档。已实测：`Tencent-Hunyuan`（OmniCapBench / DiagSafe / Prism / HYDRA / UniRL / CL-bench / ExplorationBench / Precise 都是基准或研究仓，只有 AuK / Hy-Nomas / WeVisOne-VL / Hy-Memory 属模型发布）、`facebookresearch`（InteractiveWorld / AmbiGUI / Memo-Pro-Agent 均为论文或基准仓）、`zai-org` / `QwenLM`（窗口内新建仅 `BlenderWorld`，其余为工具仓） |
| `qwen.ai/blog?id=…` | 正文纯客户端渲染：无头 Chrome 不 hydrate（只见导航壳）、爬虫 UA 也只拿到 SEO 关键词 | 同一模型的规格改从官方 GitHub 仓 README + 官方模型仓取证；索引页只作发现入口 |
| `openai.com/index/<slug>` | 静态 GET 多数时候返回 Cloudflare 验证页，但**不是全部**（2026-10-25 实测 `openai.com/index/terminal-x` 静态 GET 得 365KB 全文，正文明文数值全部可机读）；`https://openai.com/news/rss.xml`（1300+ 条、带 pubDate）**不拦**，全站发现走 RSS | RSS 发现 + 逐个 slug 实取正文；**遇到 403 先换 slug 实取，不要预设整站被拦** |
| `x.ai/news`、`ai.meta.com/blog` | 静态 GET 403/不可达 | 无头 Chrome 渲染（`x.ai` 可行）；Meta 改走 `research.meta.ai/blog`（可静态 GET） |
| `hy.tencent.com` | SPA，只出骨架屏；页面里的 `2026/10/16` 是**站点 build-time**，不是发布日 | 靠 `tencent` HF 组织 + 官方 GitHub |
| `blog.google` 的三条 RSS（`/rss/`、`/innovation-and-ai/technology/ai/rss/`） | **只暴露最近 20 条**；`?start=20/40/60` 不分页（返回与首屏完全相同的 20 条，文件字节数一致） | Google 的完整时间线靠 `deepmind.google/blog/rss.xml`（100 条，可回溯 3 个月）+ `blog.google/rss/` 定点补；**别把 Google 博客 RSS 当作全量窗口**——单靠它扫窗口会静默漏掉 20 条之前的发布 |
| `openai.com/index/<slug>` 的内嵌 Vega 图表 | 渲染后 SVG 的 `aria-label` **只覆盖部分 mark**（2026-10-22 在 GPT‑Rosalind 页实测：20 个数据 mark 只暴露 15 个，其余 5 个无障碍文本缺失） | 以 RSC payload 的 `vegaLiteSpec.data.values` 为全集来源（`self.__next_f.push` 里解析），SVG 无障碍文本只作交叉校验；缺值时不要用柱体几何反推 |
| **「正文只印相对结论」⇒「页面没有绝对分」（误判）** | 发布页的散文常只印相对结论（比竞品高几个百分点、接近某模型），**但同一页的内嵌 vega 图表里逐「模型 × 推理档位」写着绝对数值**。2026-10-29 实测 `openai.com/index/introducing-gpt-6-1-terra/`：正文对 Agents' Last Exam / MMMU-Pro / OSWorld 2.1 / Terminal-Bench-Science 四项只印相对结论，上一批据此记成 `not_extracted`；解析 RSC payload 后拿到全部绝对分（57.6% / 85.5% / 66.7% / 58.3%），且**与同页散文逐条交叉校验一致**（差值恰 15.0 个百分点、恰 5.0 个百分点） | **判定顺序：散文给不出绝对分时，下一步是翻 RSC payload 的图表数据集，不是直接记 not_extracted。** 解析法：把 `self.__next_f.push([1,"…"])` 里的字符串按 JSON 解码后拼起来，再按大括号配平截出 `vegaLiteSpec` 对象读 `data.values`。**这些数据在归档的 `page.html` 里就有**——不必重抓页面，从归档复核即可。补录时按「每 benchmark 行 = 一条 evidence」只取**一个**推理档位（正文点名或引用的档位；正文未点名的取最高档并在 `protocol.reasoning_effort` 标注），五个档位的完整数值写进归档 `index.md`，竞品同档数值进 `notes` |
| **「页面有图表」⇒「正文无明文数值」（误判）** | 厂商发布文常把**图表图片与正文散文明文**混在同一页：图表给全貌与竞品对比，散文给自家模型的几个关键绝对分值。2026-10-26 实测 `mistral.ai/news/mistral-large-4/` 一页之内既有 2400×1582 的 WebP 大图，正文又明文印着 9 个绝对分值 | **判定顺序固定为：先剥 `<script>`/`<style>` → 在可见文本里正则找「数字 + %」→ 逐句读上下文确认这个数字属于哪个评测 → 再看是否另有图表。** 只有「可见文本里确实没有数值」才可判为纯图表。**第二十二批因此把 Mistral Large 4 建成 0 条 evidence 的 pending 档，直到第三十七批重扫才发现**——存量档位里 `benchmark_evidence: []` 且 release 级 `status:"pending"` 的条目应优先回看 |
| `mistral.ai/news/*` 的 `dateModified` 字段 | **是全站重新生成的时间戳，不是该文的编辑时间**——2026-10-23 实测 `mistral-saba`、`mixtral-8x22b`、`codestral`、`mistral-3`、`le-chat-mistral` 五个页面的 `dateModified` 全是 `2026-10-08T13:46:xx`（相差数秒） | **不可当发布日或编辑日证据**；要日期只认 `datePublished`、RSS `pubDate`、正文印刷日或官方仓创建日。特别提醒：Mistral Saba 是 2025-02-17 的老模型，`dateModified=2026-10-08` 极易被误读成「阿拉伯语模型发布日」 |
| **RSS `pubDate` 的 RFC-822 格式（`Mon, 26 Oct 2026 22:00:00 GMT`）** | 日期是「日-月-年」，不是 ISO 的「年-月-日」。只认 `YYYY-MM-DD` 的解析器会**把整条 RSS 的窗口内条目全部静默丢掉**——2026-10-26 实测 `openai.com/news/rss.xml` 的最新条目正是 `Mon, 26 Oct 2026 22:00:00 GMT`，若按 ISO 解析，GPT-6.1 Terra 这类窗口内新发布会整批漏检 | 解析 `pubDate` / `published` / `updated` 时**必须同时支持三种形状**：① `YYYY-MM-DD`（ISO）② RFC-822 `26 Oct 2026`（日-月-年）③ `October 26, 2026` / `Oct. 26, 2026`（月-日-年）。先统一归一化成 `YYYY-MM-DD` 再做窗口比较。**自检手段**：解析后必须打印「窗口内条目数」，若为 0 而 RSS 有上千条，说明日期解析错了而不是真没新发布 |
| `docs.x.ai/docs/release-notes` 里的 `October 15, 2026` | 该页底部有 `Last updated: October 15, 2026`——这是**文档站整页的更新时间戳**，不是任何一条发布的日期 | 该页的发布条目按标题分组（`October 14` / `October 2` / `September 25` 等月份-日 形式），**只认分组标题**，页脚 `Last updated` 一律忽略 |


| **本机无头 Chrome**（`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new --dump-dom`） | 2026-10-24 实测**完全不出内容**：`--dump-dom` 对 `https://example.com` 都返回 0 字节（`--headless=old`、`--user-data-dir`、`--virtual-time-budget` 三种组合全试过），`perl -e 'alarm N; exec @ARGV'` 强杀后 stdout 仍是空 | 别把时间耗在调无头 Chrome 参数上。改用「静态 GET + 站点自带通道」：sitemap.xml / RSS / 官方文档模型总表 / HF 官方组织 API / GitHub org API——本轮 12 家厂商的巡检全部靠这些静态通道完成 |
| **内置浏览器（`mcp_browser`）读页面** | `open_tab` 正常（能拿到标题与 URL），但 `query`（kind=text / dom / selector）与 `screenshot` 在重页面上**每次都撞满 275s 超时**（x.ai/news、seed.bytedance.com/en/blog/、x.ai/sitemap.xml 全如此）；`inspect` 在 x.ai/news 上 4s 返回但只有 1 个元素（页面没 hydrate） | 浏览器只适合「确认页面存在」，**不适合当取数通道**。取数走静态 HTTP 通道；浏览器单次调用超时要按 275s 预算规划，一轮别超过 2 次 |

> 「上一轮跑批遗留未收口」的判定：开工前若发现**当前本地分支**是某个已合并的 `model-release-daily-*`，且存在**更新的远端 `model-release-daily-*` 带 OPEN PR**，说明上一轮在「开 PR」与「合并」之间断了。不要重跑那一批，也不要当残留清理——先把那个 OPEN PR 合并并确认其 CI 为绿，再从 `origin/main` 开本轮新分支。**完整的 A/B/C 三情况分流与分支策略见 `SKILL.md` Step 0**（那里是正式规则，本条只是判据提示）。

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

## 官方模型仓 README 原文可直接取（markdown 表格 = 真表格，逐格可机读）

Hugging Face 官方模型仓的 README **原文**可以绕过 SPA 直接取，优先级高于爬仓页 HTML：

- 原文：`https://huggingface.co/<org>/<repo>/raw/main/README.md`（2026-10-26 实测 `tencent/Hy-SimulMT-30B-A3B` 直出 23 KB markdown）
- 仓内图片：`https://huggingface.co/<org>/<repo>/resolve/main/assets/<file>`（同仓 `assets/` 下的评测图可直接归档）

拿到 markdown 后有三条通用价值：

1. **表格是真表格**（第 3 类，见上节）：`| API / Model | FLEURS | CoVoST2 | ACL6060 | RealSI-Sentence |` 这类多列对比表逐格可机读转录，**按「取自家模型列、竞品列进 notes」建行**，不需要读图。
2. **发布日优先取仓内 News 节的印刷日**，而不是仓 `createdAt`：`tencent/Hy-SimulMT-30B-A3B` 的 HF `createdAt` 是 2026-10-22（权重与代码先落地），但模型卡 News 节写明「**2026.10.26 | Release**: …」，发布日取 **2026-10-26**；两者相差 4 天，`createdAt` 只能当「权重上线日」的旁证。
3. **厂商加粗规则要读懂**：模型卡常见「自家整行加粗 + 各列最高分另加粗」的双重加粗。2026-10-26 实测 `tencent/Hy-SimulMT-30B-A3B` 的表注写明「The entire Hy-SimulMT row is bolded to highlight our model; other bolded values indicate the highest score in the corresponding column」——所以**自家行加粗 ≠ 自家每列都最高**（该表 CoVoST2 一列最高是 Qwen3.8-LiveTranslate 82.1，Hy-SimulMT 只有 75.5）。读表时必须逐列看哪个数被单独加粗。

## 客户案例页（customer story）也可能带明文评测数值

厂商官网的「客户案例 / 合作故事」栏目有时会披露**已建档模型**在客户自建评测上的明文数值（如 OpenAI 官网 2026-10-20 的 Terminal X 案例页给出 GPT-6.1 Sol 与资深人类评审一致率 88.6%）。这类页面**不是模型发布文**，因此：

- **不新建 release 条目**（模型发布日期与规格仍以发布文为准），只作为该发布的一条 **evidence** 来源，追加到既有 release 的 `benchmark_evidence[]`，并在 `revisions[]` 记一笔「仅追加、未改既有行」。
- **归因口径**：评测由客户自建自报 → `attribution_type: third_party_reported`（不是 `vendor_reported`），`source_tier: "A"`（页面本身在厂商官方域名）。
- **只有绝对分值才单独建行**；页面只给相对差值（如「较次优模型 +25%」「成本 −30%」）时，不建行，写进该行 `notes`。
- **自定义 Agentic 脚手架必须结构化**：`protocol.harness` 写清客户评测器（如 `Terminal X Eval Agent`），`protocol.run_count` 写评分样本量，`protocol.judge` 写评分器与对照（资深人类评审），`comparison_scope` 统一 `only_same_protocol`，并在 notes 交代与官方标准单轮基线的差距。
- **页面若带私有准则/私有样本**，必须在 notes 与 benchmark 实体 `limitations` 里写明「外部无法复跑、跨机构不可比」。

> 口径归属提醒：以上是「本批按此口径记录」的既成事实，不构成对 `data/model-releases/official/README.md`「抽取口径」一节的修改。**是否把客户案例页纳入常规抽取口径，属账本口径变更，需人工裁定**；下批若遇到同类页面，按本节保持一致，或先报请裁定。

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
