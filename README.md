# evals.zenheart.site

> 一本面向**初级前端工程师**的大模型评估入门电子书。
> 让一个懂 JavaScript/TypeScript、不懂 AI 训练的人，只通过这本书就能完全理解：
> 1. 什么是评估、为什么需要评估、标准流程和核心原理；
> 2. 主流模型厂商每次公布模型性能时涉及哪些评估（每个评估的：实现原理 / 评估策略 / 价值作用）；
> 3. 评估的主流实践和框架；
> 4. 如何设计自己的自定义评估。

- **在线阅读**：[https://evals.zenheart.site](https://evals.zenheart.site)
- **评估大全**：[https://evals.zenheart.site/benchmarks/](https://evals.zenheart.site/benchmarks/)
- **下载 EPUB**：[https://evals.zenheart.site/evals.epub](https://evals.zenheart.site/evals.epub)
- **源码**：[https://github.com/zenHeart/evals](https://github.com/zenHeart/evals)

## 站点内容

- **《大模型评估入门》**：32 章（chapter-00 术语速查 + 四大块：建立框架认知 / 方法论与标准流程 / 厂商发布评测全景 / 评估框架实战），提供在线阅读与 EPUB 下载。
- **评估大全**：65 个主流 benchmark 的参考库（测什么、怎么测、分数含义、厂商采用记录），数据源为 `data/benchmarks/` 实体层。每个 benchmark 都有独立详情页（/benchmarks/<id>/），由构建自动生成。

## 读者画像

- 1–3 年经验的前端工程师（React / Vue / TypeScript）
- 会写 Node.js，可能用过 OpenAI / Anthropic API
- 完全不懂 AI 训练/微调/RLHF
- 看过 LLM 厂商技术报告，但看不懂里面的评估表
- 想从零理解"评估"是什么，怎么自己写一个小评估

## 仓库结构

```
evals/
├── book/                              # 书籍源
│   ├── chapters/                      # 32 个章节 Markdown（chapter-00 ~ chapter-31）
│   ├── cover/                         # 封面
│   ├── epub-content/                  # EPUB 中间产物（构建生成）
│   ├── AGENTS.md                      # 写作规范
│   ├── outline.md                     # 完整大纲
│   ├── metadata.yaml                  # 元信息 + 四大块分组 + 章序
│   ├── preprocess.js                  # EPUB 预处理
│   ├── build-epub.mjs                 # EPUB 构建脚本
│   └── validate.js                    # 书籍校验门禁
├── data/                              # 实体化数据层（构建唯一数据源，goal.md §11）
│   ├── benchmarks/                    #   benchmark 实体（每评测一个 JSON，65 个）
│   ├── taxonomy.json                  #   类别本体与枚举
│   ├── vendors.json                   #   厂商注册表（13 家）
│   ├── model-releases/
│   │   ├── official/                  #   官方发布证据（release + evidence edge，A 级来源）
│   │   └── legacy/                    #   由 v1 adoption[] 迁移的历史引用（pending，不计公开数）
│   └── generated/                     #   构建生成（迁移报告等），禁止手改
├── scripts/
│   ├── build-web.mjs                  # 书籍站点构建（首页/书台/章节/实战入口/404/sitemap）
│   ├── build-benchmarks-hub.mjs       # 评估大全构建（explorer + 65 个独立详情页）
│   ├── site-shell.mjs                 # 共享站点壳（主导航/topbar/footer/主题，唯一来源）
│   ├── load-data.mjs                  # 构建期数据加载层（builders 唯一取数入口）
│   ├── validate-site.mjs              # 站点门禁（封面/交叉引用/schema/链接/隐私）
│   ├── validate-data.mjs              # 数据门禁（schema/外键/枚举/唯一性）
│   └── migrate-data.mjs               # v1 单文件 → 实体层的一次性迁移脚本（已完成）
├── research/                          # 调研素材（不发布；validate:site 保证不进 dist/）
├── deploy/                            # 部署文档
├── .github/workflows/                 # CI：build-epub.yml（构建 + GitHub Pages 发布）
├── dist/                              # 构建产物（GitHub Pages 发布内容，禁止手改）
├── package.json
└── README.md
```

## 内容源 vs 生成产物

- **改内容请改源**：章节在 `book/chapters/`，章序与分组在 `book/metadata.yaml`，大纲在 `book/outline.md`，评估大全数据在 `data/benchmarks/`（benchmark 实体）与 `data/model-releases/`（发布证据）。
- **`dist/` 全部由构建生成**（书籍页面、评估大全、样式、搜索索引），任何手动修改都会被下一次构建覆盖。禁止直接编辑 `dist/`。

## 本地构建

```bash
# 1. 安装依赖
npm ci --ignore-scripts

# 2. 校验书籍结构
npm run validate

# 3. 完整构建：书籍校验 → EPUB → 站点 → 站点门禁
npm run build
```

也可以单独执行：

```bash
npm run build:web            # 只构建书籍站点到 dist/
npm run build:epub:official  # 只构建 evals.epub
npm run validate:site        # 只跑站点门禁
```

## 部署

CI（`.github/workflows/build-epub.yml`）在 `main` 分支推送时自动：

1. 安装依赖，校验书籍结构（`node book/validate.js`）
2. 构建 `evals.epub` 与站点 `dist/`
3. 将 `dist/` 内容 + `evals.epub` 发布到 GitHub Pages（自定义域名 `evals.zenheart.site`）

## 如何补 benchmark

1. 新建 `data/benchmarks/<id>.json`（每评测一个文件）。必填字段：`id`（URL 安全的 kebab-case slug，即详情页路径）、`name`、`categories`（取值须在 `data/taxonomy.json` 的 `categories` 中）、`summary`（测什么）、`official_sources`（数组，含 `{ kind: "site" | "paper", url }`）；常用可选字段：`full_name`、`aliases`、`default_protocol.raw`（怎么测）、`interpretation`（分数含义）、`status`（`active` / `rolling` / `near-saturation` / `historical` / `superseded` / `deprecated`）、`measures` / `does_not_measure`、`last_verified_at`、`content_status`。
2. 未核验的信息留 `null`，不编造。
3. 跑 `npm run build`。`validate:data` 校验 schema/外键/枚举，`validate:site` 校验详情页与内部链接，不通过则构建失败。

## 数据源逻辑（账本模型：记录冻结 + 窗口视图）

- **记录模式冻结**：release 与 evidence edge 的 schema 保持稳定，历史记录永不改形、不重写。
- **时间轴是视图不是数据**：`/benchmarks/releases/` 与各详情页的采用表、引用计数，全部由 `scripts/load-data.mjs` 在构建时从记录现算，无任何手写副本。
- **统一新鲜度窗口**：只有「发布日期可知 ∧ 在近三年窗口内（fresh）」的证据进入公开计数与主视图；窗口外或日期缺失的归入历史引用，折叠降级展示（不丢不删）。时间推进自动完成新旧分离，无需迁移。
- 后续更新只有三种动作，互不干扰：

| 动作 | 操作 | 波及面 |
|---|---|---|
| 新发布 | 新增 1 个 release JSON（含 evidence） | 零改动，所有视图自动长出 |
| 核验完成 | 只翻转对应 evidence 的 `status` + 补 `locator` | 该条进入公开计数 |
| 厂商勘误 | 修订字段值，同时在 release 的 `revisions[]` 追加 `{ date, field, from, to, reason }` | 留痕，不静默覆盖（goal §18.3） |

## 如何补模型发布证据

1. 新建 `data/model-releases/official/<vendor>/<release-id>.json`（结构见 `_docs/goal.md` §11.4/§11.5）：release 记录 + 每个被引用 benchmark 一条 `benchmark_evidence`（含 `benchmark_id`、`source_tier`、`locator`、`reported_score`、`protocol`）。
2. 证据纪律：分数在图片表格读不出 → `status: "pending"` 且不计入公开引用数；未公布分数 → `reported_score.value: null`，禁止 `"-"`；厂商引用竞品的行标 `attribution_type: "comparison_cited"`。
3. 勘误已有记录时：改值 + 在该 release 的 `revisions[]` 追加一条 `{ date, field, from, to, reason }`，`validate:data` 会校验其完整性。
4. 新厂商先在 `data/vendors.json` 登记注册表条目。
5. 跑 `npm run build`，两个 validator 把关。

## 引用本书

```
ZenHeart. (2026). 大模型评估入门：从前端工程师视角看 Eval (v2.0.0). 
https://evals.zenheart.site
```

## 许可

MIT License. 引用厂商基准数据时，请遵守各原始数据集的许可协议。
