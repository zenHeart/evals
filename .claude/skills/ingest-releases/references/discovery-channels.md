# 发现渠道与日期取证（增此扫描的检索地图）

在册厂商清单以 `data/vendors.json` 为准（coverage_tier 1 = 必扫，2 = 扫描但预期密度低）。
本表沉淀各厂商**官方发布渠道**与已知站点脾气，来自 `data/model-releases/official/README.md`
各批抓取记录的提炼；新经验请回写本表（渠道地图）与 README（批次证据）两处。

## Tier 1 国际

| vendor_id | 官方发布渠道 | 站点脾气 / 已知坑 |
|---|---|---|
| openai | openai.com/news/；sitemap：`openai.com/sitemap.xml/release/`（slug 权威） | WebFetch 常报错→走 web reader；数值多在 vega-lite 组件，从 RSC payload（`self.__next_f.push`）平衡括号解析 `vegaSpec` 取 `title+data.values`，以 `labelValue` 为准并用正文锚点校验；旧 slug 易 404，以 sitemap 为准 |
| anthropic | anthropic.com/news/（newsroom 索引带日期） | 数值几乎全在图片：图片行 pending + 视觉转写进 notes；日期三源互证 = newsroom 索引 + platform.claude.com "Released" 行 + API snapshot id（`claude-x-YYYYMMDD`） |
| google | blog.google/technology/ai/（publishedTime 元数据）；产品页 deepmind.google/models/gemini/*（DOM 明文大表） | 早期帖的对比表是 GIF：无头浏览器开 GIF 取稳定帧截图 + 视觉转写；一帖多模型常见（Flash/Lite/Cyber 并发） |
| xai | x.ai/news/ | 页面对 reader 与真实 DOM 内容不一致：默认无头浏览器渲染后扫 SVG `<text>`（图表值以无障碍文本内嵌） |
| meta | ai.meta.com/blog/；research.meta.ai | ai.meta.com 拒多数 reader → Playwright 直读 DOM；伴随 Evaluation Report PDF 常为 tier-A 补充源（文本可机读但表格易粘连，按口径处理） |
| mistral | mistral.ai/news/ + 官方 RSS（pubDate 可作日期证据） | 页面常不印日期 → RSS pubDate 取证 |

## Tier 1 国内

| vendor_id | 官方发布渠道 | 站点脾气 / 已知坑 |
|---|---|---|
| kimi | kimi.ai/blog/（索引卡片带日期）；历史发布走 HF model card（moonshotai org，A 级） | 索引只挂最近 ~9 篇链接；表格有时非 DOM 组件（正文有 Evaluations 却无分数 → 先怀疑渲染遗漏，Playwright DOM 扫描 `table` 与 `img`） |
| deepseek | api-docs.deepseek.com/zh-cn/news/（slug 含日期如 `news250821`） | 分数常在 webp 图：图行 pending + 视觉转写进 notes；slug 裸格式会重定向到文档首页 |
| glm | z.ai/blog/ | 完整 DOM 表 + 每表独立协议脚注是常见形态（verified 密度最高的来源）；无头浏览器兜底 |
| minimax | minimax.io/news/（新版）；旧 /blog/ slug 带时间戳后缀（后缀≠发布时间戳） | JS 渲染站：web reader 只回站点壳 → Playwright DOM 扫描；大结果表是整图（数千 px）→ pending |
| qwen | qwen.ai/?id=<model>（research 索引分页找 id，勿猜）；旧域 qwenlm.github.io 部分存活 | id 体系不规律（qwen3.8 / qwen3-max 并存，qwen3.7-max 空壳）；DOM 表多且机读；DOM 表必须逐张转录（曾漏表 2 共 61 行） |
| doubao | seed.bytedance.com/en/blog/ | 散文少分数、分数图多（十余张）：图行 pending；正文"点名+明确论断"行可 verified + not_extracted（Opus 5 先例口径） |

## Tier 2（扫但预期低频）

| vendor_id | 官方发布渠道 | 备注 |
|---|---|---|
| tencent | hy.tencent.com（blog，SPA 需渲染）；腾讯新闻官方通稿可作日期证据；官方 GitHub 仓 Tencent/*（README DOM 表） | 附录"模型得分"是整图 → pending；正文散文分数可 verified |
| stepfun | stepfun.ai/research/（DOM 大表）；static.stepfun.com/blog/<model>/；官方 GitHub 仓（createdAt 作日期证据） | 表注 `*` = 同条件复现语义；自建内部集照录并注明 |
| xiaomi | 官方 blog / MiLLM 发布页 | 尚无 release 落库；首次录入时回写本行 |

## 旁证与交叉核对（仅作线索，日期与数值一律以官方页为准）

- **OpenRouter**：`https://openrouter.ai/api/v1/models` 各模型 `created` 时间戳——上架日常≈发布日（可差 1-2 天，权重先行或 API 先行时以官方页为准）；也是"这家最近发过什么"的查漏清单。
- **HuggingFace org createdAt**：权重先行于 blog 1-2 天很常见；单独不作为发布日，与官方页互证。
- **官方 sitemap / RSS**：openai、mistral（RSS pubDate）可作日期一级证据。
- **聚合站**（Artificial Analysis、 Various leaderboards）：**只用来发现线索**。其榜单值若被厂商原页转载，按 `third_party_reported` 记录；聚合站自身的数字不入账。

## 新厂商接入（发现未注册厂商的正式发布时）

1. `data/vendors.json` 注册：kebab-case `id`、`name`、`display_name`、`region`（CN|GLOBAL）、`coverage_tier: 2`、`active: true`。
2. `scripts/fetch-logos.mjs` 的 `DOMAINS` 表加该厂商候选官方域名（1-3 个，按优先级）。
3. 运行 `node scripts/fetch-logos.mjs`（全量重抓，输出到 `assets/logos/`），确认新厂商文件生成且为彩色品牌标。
4. `scripts/vendor-logos.mjs` 的 `LOGO_EXT` 登记实际扩展名（png/jpg）——不登记则站点徽章退化为字母点。
5. 本表 Tier 2 加一行渠道说明。

图标铁律：**必须真实厂商彩色 logo，禁止字母占位**——这是用户明确红线（GLM/stepfun/阿里曾因字母替换被打回）。
