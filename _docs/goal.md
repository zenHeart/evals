# GOAL — evals.zenheart.site 深度优化执行合同

> 本文件不是愿景备忘录，而是 `zenHeart/evals` 后续人类与 Agent 的共同执行合同。任何实现、内容补全、引用采集、页面重构和验收，都必须以本文件为准。

## 0. 文档元信息

| 项 | 值 |
|---|---|
| 项目 | `zenHeart/evals` / `https://evals.zenheart.site/` |
| 默认分支 | `main` |
| 审计基线 | `main@4e9dc59d5138462da4b38630f4b5cf6fdb81fdf8` |
| 审计日期 | 2026-08-31 |
| 当前书籍版本 | `2.0.0` |
| 当前内容结构 | 术语速查 + 四大块 + 32 章（00–31） |
| 核心读者 | 1–3 年经验、懂 JavaScript/TypeScript/Node.js、不了解模型训练与 LLM Eval 的初级前端工程师 |
| 北极星目标 | 读者能理解评估、看懂模型发布评测、并从零搭建可运行的评估体系 |
| 文档状态 | Active / 后续 Agent 必须持续维护勾选状态与变更记录 |

---

## 1. Agent 执行协议

### 1.1 每次开始任务前必须完成

1. 读取本文件、根目录 `AGENTS.md`、`book/metadata.yaml`、`book/outline.md`。
2. 确认当前分支为 `main` 的最新基线或从最新 `main` 创建工作分支，记录当前 commit SHA。
3. 从本文件未完成的任务中，按 `P0 → P1 → P2` 和任务依赖选择下一项，不得跳过前置任务。
4. 先检查源文件和生成链路，禁止直接修改 `dist/` 等构建产物。
5. 内容任务先建立来源证据，再写结论；没有证据时使用 `pending`，不得补写“看起来合理”的模型、分数或协议。
6. UI 任务必须同时验证桌面、平板、手机、键盘和暗色模式，不得只看单一截图。
7. 完成后运行本文件规定的全部相关命令，附上验证结果、截图或测试报告，再勾选任务。

### 1.2 每次提交必须说明

- 解决了哪个任务 ID。
- 修改了哪些源文件，生成了哪些路由。
- 新增或修订了哪些事实性引用，来源等级是什么。
- 哪些验收项已通过，哪些仍未通过以及原因。
- 是否引入兼容性、路由、数据迁移或内容语义变化。

### 1.3 完成定义

一个任务只有在以下条件全部满足时才可标记 `[x]`：

- 实现、内容、数据和测试均已提交，而不是只完成设计稿。
- 对应验收标准全部可复现通过。
- 无新增 P0 缺陷、无破坏旧路由、无降低引用可信度。
- 文档、Schema、测试夹具和示例同步更新。
- 生成站点可本地完整构建。

---

## 2. 产品北极星与成功标准

### 2.1 一句话定位

**一本面向前端工程师的大模型评估实战手册，同时提供可检索的评估百科和可复现的模型发布证据库。**

### 2.2 三个核心用户任务

1. **系统学习**：从“不知道 Eval 是什么”逐步理解模型训练、后训练、应用开发、发布与线上监控中的评估方法。
2. **查清评估**：遇到 MMLU、GPQA、SWE-bench、Terminal-Bench 等名称时，快速查到它测什么、怎么测、分数怎么读、有哪些局限。
3. **核对模型报告并动手搭建**：知道某次模型发布实际使用了哪个版本、协议、harness 和分数，并能把方法落到自己的项目。

### 2.3 读者完成学习后的可验证能力

读者必须能够：

- 画出评估在预训练、后训练、对齐、安全、发布、A/B 和线上监控中的位置。
- 将业务目标拆成能力、样本、指标、评分器、基线、阈值和发布门禁。
- 解释 accuracy、F1、pass@k、cons@k、Elo、win rate、置信区间、Kappa、ECE 等分数的含义和误用风险。
- 阅读主流模型厂商发布页中的评测表，并识别 variant、shots、CoT、reasoning effort、工具、harness、采样参数、运行次数和裁判差异。
- 判断两个模型分数是否可以直接比较；不可比较时能指出具体缺失字段。
- 选择并运行至少一个主流评估框架。
- 用 TypeScript 从零实现最小评估器，包含数据加载、推理、评分、聚合、报告和 CI 门禁。
- 为 RAG、Agent、代码生成、多模态或业务问答中的至少一个场景建立离线评估集和线上反馈闭环。

### 2.4 站点级量化目标

| 维度 | 最终目标 |
|---|---|
| 导航一致性 | 所有页面使用同一导航配置，主导航标签、顺序、数量一致率 100% |
| 卡片可达性 | 100% 已发布评估卡片都有独立详情 URL |
| 引用可信度 | 公开显示的模型发布引用 100% 含明确厂商、模型、发布、日期、来源、定位和状态 |
| 悬浮依赖 | 仅通过 hover 才能获得的关键信息数量为 0 |
| 内部死链 | 0 |
| 关键外部来源死链 | 0；临时失败必须有存档或已记录例外 |
| 数据完整性 | 所有发布数据通过 JSON Schema、引用完整性和唯一性校验 |
| 无障碍 | 关键页面 axe `serious/critical` 为 0；达到 WCAG 2.2 AA |
| 性能 | 关键页面 Lighthouse Performance ≥ 90、Accessibility ≥ 95、SEO ≥ 95 |
| Web Vitals | LCP ≤ 2.5s、INP ≤ 200ms、CLS ≤ 0.1（目标为 p75） |
| 响应式卡片 | 360px=1 列、768px=2 列、1024/1280px=3 列、1440/1920px=4 列 |
| 内容门禁 | 32 章均满足统一章节结构、来源、实操和自测要求 |
| 实战闭环 | 至少 1 个 TypeScript 端到端 Capstone 可在 CI 中运行并生成报告 |

---

## 3. 范围、约束与非目标

### 3.1 本轮必须覆盖

- 统一全站信息架构、导航、路由、搜索和视觉语言。
- 优化首页、书籍阅读页、评估大全、评估详情页。
- 将评估、模型发布、厂商和引用证据结构化、可验证、可反向查询。
- 按现有四大块组织继续加深内容，不推翻当前课程主线。
- 建立可执行实战、自动校验、无障碍、性能、SEO 和维护机制。
- 系统覆盖国内外主流模型厂商的官方发布材料，并明确覆盖边界。

### 3.2 强约束

- 保留 `book/metadata.yaml` 中“术语速查 + 四大块 + 32 章”的主组织逻辑。
- 保留静态站点、无后端即可阅读的能力。
- 优先渐进改造现有 Node.js 构建链，P0 不以迁移 VitePress/Astro/Next.js 为前置条件。
- 所有事实性模型分数与协议必须可追溯到一手或被明确标记的二手来源。
- 页面必须在 JavaScript 失败时仍能阅读正文与进入详情页；增强交互不得阻塞核心内容。

### 3.3 非目标

- 不建设通用模型排行榜，不给出跨协议的“谁最强”结论。
- 不把站点做成模型厂商营销聚合页。
- 不承诺“收录历史上所有模型和所有评估”；只在定义的覆盖窗口内给出可审计覆盖率。
- 不在 P0 进行大规模框架重写、账号体系、评论系统或服务端搜索。
- 不保存或分发受限制数据集、泄露答案集、私有 benchmark 或未经许可的大段原文。

---

## 4. 当前仓库与站点审计

### 4.1 已有优势

- 产品读者非常明确：初级前端工程师，已有前端类比、TypeScript 示例和术语解释规范。
- 书籍已按四大块重构为 32 章，学习路径覆盖认知、方法论、厂商报告与实战。
- 已有自研静态生成器、EPUB 构建、章节校验、客户端搜索、暗色模式、目录和 Mermaid。
- 已有 `data/benchmarks.json` 和评估大全原型，证明产品方向可运行。
- 已开始记录厂商采用信息，为建设证据图谱提供了种子数据。

### 4.2 关键问题与目标落点

| ID | 现状位置 | 当前问题 | 用户影响 | 目标状态 |
|---|---|---|---|---|
| AUDIT-001 | `scripts/build-web.mjs` 与 `scripts/build-benchmarks-hub.mjs` | 两套 topbar 独立硬编码；评估页比首页/书籍页多“书籍阅读” | 点击“评估大全”后导航数量变化，用户误以为进入另一站点 | 单一 `site.config` 生成全站导航，页面快照一致 |
| AUDIT-002 | `scripts/build-benchmarks-hub.mjs` | 卡片网格最小宽度约 460px、容器 1100px、卡片又有最大宽度；多数屏幕只显示 1–2 列 | 评估大全纵向过长、空白多、难扫描 | 1/2/3/4 列明确断点，卡片无局部宽度上限 |
| AUDIT-003 | 评估卡片 | 引用藏在 hover 浮层，详情靠点击后原地展开 | 移动端无 hover；键盘、触屏和深链接体验差；页面高度跳变 | 引用摘要始终可见；整卡进入独立详情页 |
| AUDIT-004 | `data/benchmarks.json` | `adoption.release` 常只写厂商名，`score` 大量为 `-`，URL 可能指向泛化入口 | 无法回答“哪个模型哪次发布在哪里引用了什么” | 模型发布为一等实体，引用边含精确定位、协议和状态 |
| AUDIT-005 | `data/benchmarks.json` | benchmark 定义、展示文案、厂商采用、来源全部混在单一大 JSON | 冲突大、难维护、无法分工、难做 Schema | 按实体拆分，构建时派生索引和反向关系 |
| AUDIT-006 | `scripts/build-web.mjs` | 自研 Markdown 解析器承担大量语法，页面模板/CSS/解析器集中在近 40KB 单文件 | 新页面难扩展，边界语法容易解析错误 | 模块化生成器；成熟 Markdown 引擎；回归测试保护 |
| AUDIT-007 | 首页模板 | 首页主要是标题、搜索和完整目录 | 首屏不能立刻解释“为什么来、能学会什么、三大入口是什么” | 明确价值主张、学习成果、三入口、学习路径与可信度 |
| AUDIT-008 | 书籍阅读页 | 左目录和正文已具备，但正文宽度、章级元信息、学习进度、右页内目录不完整 | 长文认知负担高，难连续学习、难回到上次位置 | 桌面三栏、移动抽屉、进度、阅读时间、前置知识和本章成果 |
| AUDIT-009 | `README.md` | 仍描述 28 章/6 部分、`docs/`/VitePress 等旧结构 | 新 Agent 和贡献者会按错误架构操作 | README 与实际 32 章、自研生成器、目录结构完全同步 |
| AUDIT-010 | 路由 | 旧式 `/web/chapter-NN.html`、`/benchmarks/index.html`，详情无独立 URL | URL 不语义化，分享、SEO、迁移困难 | 清晰目录路由并保留永久重定向 |
| AUDIT-011 | 引用表述 | “13 家真实抓取”等总量式描述缺乏公开覆盖矩阵和缺口 | 读者无法判断“没收录”还是“厂商没使用” | 自动生成厂商×发布×benchmark 覆盖矩阵与缺口状态 |
| AUDIT-012 | 运行时依赖 | Mermaid 通过 CDN 动态加载 | 首屏、离线、隐私与稳定性受第三方影响 | 构建时渲染或按需自托管、懒加载 |
| AUDIT-013 | 自动化 | 现有校验偏章节格式，缺少数据 Schema、证据、可访问性、视觉与路由测试 | 错误可构建后进入生产 | 建立完整 CI 门禁与关键视口回归 |
| AUDIT-014 | 内容 | 大纲深度目标强，但章节与 benchmark 详情尚未统一满足“测什么/怎么测/怎么读/局限/复现/采用” | 初学者仍需跳到外部自行拼知识 | 对章节与详情页分别建立内容完整度评分和门禁 |

### 4.3 根因判断

当前问题不是单纯“样式丑”，而是三个产品层尚未统一：

1. **站点壳层不统一**：首页/书籍与评估大全由不同脚本生成，导航、CSS、语义和交互自然漂移。
2. **内容实体未建模**：benchmark 与模型发布的多对多证据被压缩成卡片附属数组，无法形成严密引用链。
3. **教学层和查询层未衔接**：书籍讲系统知识，评估大全查词条，但缺少章节、词条、模型发布、实战之间的双向关联。

因此，正确顺序是：**统一信息架构 → 规范实体和证据 → 建独立详情路由 → 深化内容 → 扩大厂商覆盖 → 自动化维护。**

---

## 5. 目标信息架构

### 5.1 三个一级产品面

```text
首页 /                         解释产品、目标读者、学习成果和三个入口
├─ 系统学习 /book/            32 章书籍与学习路径
│  ├─ /book/chapter-01/
│  ├─ ...
│  └─ /book/chapter-31/
├─ 评估大全 /benchmarks/       响应式目录、搜索、筛选与排序
│  └─ /benchmarks/{id}/        独立 benchmark 详情页
├─ 动手搭建 /build/            从零搭建评估体系的实战路径
│  ├─ /build/mini-evaluator/
│  ├─ /build/test-set/
│  ├─ /build/judge-calibration/
│  └─ /build/ci-gate/
├─ 模型发布 /releases/         P1：按厂商/模型查看发布与 benchmark 证据
│  └─ /releases/{vendor}/{release-id}/
├─ 方法与可信度 /methodology/  来源等级、收录政策、比较规则、变更记录
└─ 搜索 /search/               P1：书籍、评估、发布、术语统一搜索
```

### 5.2 统一主导航

所有页面必须由同一配置生成以下 **3 个主导航项**：

```js
export const PRIMARY_NAV = [
  { label: "系统学习", href: "/book/" },
  { label: "评估大全", href: "/benchmarks/" },
  { label: "动手搭建", href: "/build/" }
];
```

规则：

- Logo 点击回首页，不再额外占用一个“首页”主导航位。
- 搜索、下载 EPUB、GitHub、主题切换属于工具区，不计入主导航。
- 所有路由的标签、顺序、数量和 active 状态完全一致。
- 桌面端 3 个主导航常显；移动端折叠菜单仍保持同样顺序。
- 当前页面使用 `aria-current="page"`，不得只靠颜色表示选中。
- Sticky header 不得遮挡锚点和键盘焦点。

### 5.3 路由兼容策略

| 旧路由 | 新路由 | 要求 |
|---|---|---|
| `/index.html` | `/` | canonical 指向 `/` |
| `/web/chapter-01.html` | `/book/chapter-01/` | 生成 301/静态 redirect 页面；至少保留两个大版本 |
| `/benchmarks/index.html` | `/benchmarks/` | canonical + redirect |
| 无 | `/benchmarks/mmlu/` | 每个 benchmark 必须生成 |
| 无 | `/releases/{vendor}/{release}/` | P1 生成 |

构建必须生成 `redirects.json` 或平台对应重定向配置，并由测试逐条验证。

---

## 6. 统一设计系统与页面壳

### 6.1 建议源文件结构

```text
scripts/web/
├─ config.mjs
├─ build.mjs
├─ content-loader.mjs
├─ markdown.mjs
├─ routes.mjs
├─ search-index.mjs
├─ structured-data.mjs
├─ components/
│  ├─ site-header.mjs
│  ├─ site-footer.mjs
│  ├─ breadcrumbs.mjs
│  ├─ search-dialog.mjs
│  ├─ source-badge.mjs
│  └─ benchmark-card.mjs
├─ layouts/
│  ├─ base.mjs
│  ├─ book.mjs
│  ├─ catalog.mjs
│  └─ article.mjs
├─ pages/
│  ├─ home.mjs
│  ├─ book-index.mjs
│  ├─ chapter.mjs
│  ├─ benchmarks.mjs
│  ├─ benchmark-detail.mjs
│  ├─ build-index.mjs
│  ├─ release-index.mjs
│  └─ release-detail.mjs
└─ assets/
   ├─ tokens.css
   ├─ base.css
   ├─ layout.css
   ├─ components.css
   ├─ book.css
   └─ catalog.css
```

P0 可以在不一次性移动全部代码的前提下渐进拆分，但最终不得继续在两个独立脚本内复制 topbar、主题逻辑、SEO 和基础 CSS。

### 6.2 视觉原则

- 视觉语气：专业、安静、可信、适合长时间阅读，不使用夸张渐变和营销式大面积动画。
- 颜色只表达类别、状态和交互，不靠颜色作为唯一信息编码。
- 正文最大宽度按中文阅读优化为约 `72ch`，宽屏不无限拉长。
- 卡片、表格、代码块、提示框使用一致圆角、边框、间距和暗色 token。
- 字号最低 14px；正文建议 16–18px，行高 1.75–1.9。
- 所有 motion 遵循 `prefers-reduced-motion`。

### 6.3 设计 token

至少定义：

```css
:root {
  --content-max: 76rem;
  --catalog-max: 94rem;
  --reading-width: 72ch;
  --sidebar-left: 17.5rem;
  --sidebar-right: 14rem;
  --space-1: .25rem;
  --space-2: .5rem;
  --space-3: .75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --radius-sm: .5rem;
  --radius-md: .75rem;
  --radius-lg: 1rem;
  --focus-ring: 0 0 0 3px color-mix(in srgb, var(--accent) 35%, transparent);
}
```

颜色 token 必须通过明暗主题和对比度测试，禁止页面内散落硬编码颜色。


---

## 7. 首页产品规范

### 7.1 首页必须在 10 秒内回答

1. 这是一个什么站点？
2. 写给谁？
3. 我能在这里完成什么？
4. 我应该从哪里开始？
5. 为什么可以信任这里的 benchmark 和模型引用？

### 7.2 首屏结构

```text
[Eyebrow] 写给前端工程师的 LLM Eval 实战手册
[H1] 从看懂评测分数，到搭建自己的评估流水线
[Lead] 不要求机器学习背景；用前端测试、CI 和监控的语言讲清 Eval。
[Primary CTA] 开始系统学习
[Secondary CTA] 浏览评估大全
[Audience] 适合：会 JS/TS/Node.js，但看不懂模型发布评测表的工程师
[Trust summary] 32 章 · N 个评估 · N 个已核验官方发布 · 更新时间
```

要求：

- H1 说明最终结果，不只重复书名。
- CTA 不超过 2 个，主次明确。
- 统计数字从数据构建结果动态生成，禁止手写。
- 封面图必须声明尺寸，避免 CLS；移动端不得挤压正文 CTA。

### 7.3 首屏以下模块顺序

1. **你将学会什么**：
   - 理解评估在模型与应用全生命周期中的位置。
   - 看懂模型发布文章中的 benchmark、协议和分数。
   - 从零搭建数据集、评分器、报告和 CI 门禁。
2. **三个使用入口**：系统学习、查评估、动手搭建。
3. **四大块学习地图**：以有向学习路径呈现 1–31 章，不在首页直接铺开 32 章长列表。
4. **推荐学习路线**：2 天认知、3 天方法论、2 周全景与实战；展示每阶段产出。
5. **评估大全精选**：按类别展示 6–8 个高价值 benchmark，点击进入详情页。
6. **最新核验的模型发布**：展示最近完成核验的 4–6 个发布，不等同于模型新闻流。
7. **证据与可信度**：说明来源等级、最后检查时间、如何报告错误。
8. **完整目录**：默认折叠到“按部分浏览”，避免首屏后直接成为超长目录。

### 7.4 首页验收

- 新用户测试中，5/5 名目标读者可在 10 秒内说出站点的三个核心能力。
- 360px 首屏 CTA、受众和价值主张完整可见，无横向滚动。
- 动态统计与实际构建数据完全一致。
- 首页不出现“13 家”“65+”等无法从当前数据实时计算的硬编码数字。
- 页面至少包含一个通往 `/book/`、`/benchmarks/`、`/build/` 的可见入口。

---

## 8. 书籍阅读体验规范

### 8.1 书籍入口 `/book/`

书籍入口不是直接跳到第 1 章，而是学习控制台，至少包含：

- 本书适合谁、不适合谁。
- 四大块的目标、前置关系和完成后产出。
- 三轮阅读法。
- “继续上次阅读”与“从第 1 章开始”。
- 章节搜索。
- 每章状态：阅读时长、难度、前置章节、实操数量、最近核验日期。

### 8.2 章节页桌面布局

```text
┌─────────────┬────────────────────────────┬────────────┐
│ 全书目录     │ 正文（最大约 72ch）          │ 本页目录    │
│ 约 280px     │ 约 760–820px                │ 约 220px    │
└─────────────┴────────────────────────────┴────────────┘
```

- ≥1280px：三栏。
- 960–1279px：左目录 + 正文；本页目录折叠为正文上方或浮动按钮。
- <960px：正文单栏；全书目录与本页目录使用两个可区分的抽屉/折叠入口。
- 正文与导航必须独立滚动合理，禁止出现两个不明确的细窄滚动区。

### 8.3 章节头部元信息

每章 H1 前后必须展示：

- 所属部分、章号、预计阅读时长、难度。
- 前置知识与推荐先读章节。
- 3–5 条可验证学习目标。
- “如果只读一节”直达链接。
- 最近内容核验日期。
- 本章引用数量与可运行示例数量。

建议在 Markdown front matter 中维护：

```yaml
chapter: 11
part: 3
slug: code
reading_minutes: 45
difficulty: intermediate
prerequisites: [4, 8]
learning_outcomes:
  - 区分 HumanEval、LiveCodeBench 与 SWE-bench 的测量对象
  - 判断 pass@1 与 pass@k 是否可比较
must_read_section: "11.4"
last_verified_at: 2026-08-31
content_status: reviewed
```

### 8.4 长文阅读细节

- H2/H3 锚点可复制，URL 可直接定位。
- 标题滚动位置考虑 sticky header，使用 `scroll-margin-top`。
- 代码块包含语言、复制按钮、运行命令、预期输出、联网/付费说明。
- 表格桌面可读、手机横向滚动，并提供必要的行/列标题语义。
- Mermaid 默认构建时转 SVG；SVG 有文字替代或紧邻解释。
- 引用编号可点击到本章 References，并支持返回正文。
- 外链显示来源类型与日期，不使用裸“这里”。
- 上一章/下一章同时展示章号与标题。
- 阅读进度仅存本地，不上传个人阅读数据；提供清除选项。
- `Ctrl/Cmd + K` 打开全站搜索，`[`/`]` 可选作为上一/下一章快捷键，但不得影响输入框。

### 8.5 内容辅助组件

统一支持以下语义块，不用手写任意 HTML 样式：

- `Concept`：概念与前端类比。
- `WhyItMatters`：为什么重要。
- `ProtocolFingerprint`：影响分数的协议字段。
- `Pitfall`：常见错误。
- `TryIt`：可执行练习。
- `Evidence`：事实来源。
- `Compare`：可比较/不可比较说明。
- `Checkpoint`：章节自测。

组件必须有可访问标题和纯文本降级；不能只靠 emoji 表意。

### 8.6 章节内容完整度门禁

每章至少满足：

- 1 个前端心智模型。
- 1 个可运行 TypeScript/Node.js 示例；纯历史章节可改为可运行数据分析示例。
- 2 个真实失败案例或协议差异案例。
- 1 个从“问题 → 方法 → 结果 → 决策”的完整链路。
- 3–5 个 Try It。
- 5 道自测，含至少 1 道实操题。
- 所有事实性数字有来源。
- 所有 2025 年以后易变化信息有 `last_verified_at`。

---

## 9. 评估大全 `/benchmarks/` 规范

### 9.1 页面目标

评估大全首先是“快速发现和理解入口”，不是在一页塞下全部细节。用户应能在 30 秒内：

- 找到目标 benchmark。
- 知道它属于哪一类、测什么、主要指标是什么。
- 看出有多少条已核验官方模型发布引用。
- 进入独立详情页继续阅读。

### 9.2 页面头部

- H1：`评估大全`。
- 一句话：`查清每个评估测什么、怎么测、分数怎么读，以及哪些模型发布真实使用过。`
- 公开统计：评估数、已核验发布数、厂商数、最后更新时间。
- “收录与证据规则”链接到 `/methodology/`。

### 9.3 筛选与排序

P0 必须支持：

- 全文搜索：名称、别名、用途、模型、厂商。
- 类别：知识、推理/数学、代码、Agent、视觉/多模态、长上下文、中文/多语言、偏好/排行、安全/事实、行业垂直。
- 厂商：只显示有已核验官方引用的厂商。
- 排序：相关性、官方发布引用数、最近核验、名称。

P1 增加：

- 模态、语言、任务类型、指标类型。
- 静态/持续更新、公开/受限、是否需要工具、污染风险。
- benchmark 状态：active、legacy、superseded、deprecated、private/internal。

交互要求：

- 筛选条件同步到 URL query，可复制和前进/后退。
- 显示结果数量和当前筛选摘要。
- 提供“清除全部”。
- 空状态解释为什么无结果并提供恢复操作。
- 筛选变化不将键盘焦点强制移走。

### 9.4 响应式卡片布局

```css
.benchmark-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 640px) {
  .benchmark-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 1024px) {
  .benchmark-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (min-width: 1440px) {
  .benchmark-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
```

约束：

- 外层容器最大宽度约 1504px，左右留白随屏幕增长。
- 卡片不得设置 640px 等局部 `max-width`，必须填满网格轨道。
- 同一行卡片允许内容高度不同，但底部元信息用 flex 推到底部，视觉节奏一致。
- 卡片宽度不得低于约 280px；若文案无法容纳，优先调整断点，不缩到难读。

### 9.5 卡片始终可见信息

一张卡片只展示决策所需摘要：

1. 名称、全称/别名、状态。
2. 类别与模态标签。
3. `测什么`：最多两行。
4. `核心指标`：名称、方向和单位，例如 `Pass rate ↑ / %`。
5. `协议提醒`：最多一行，例如 `结果强依赖 harness + reasoning effort`。
6. `官方发布引用`：已核验数量。
7. 最近 2–3 个模型发布名称；更多显示 `+N`，但不靠 hover 展示。
8. 最近核验日期。

示意：

```text
SWE-bench Verified                  [代码] [Agent]
真实 GitHub Issue 修复，要求补丁通过仓库测试。
核心指标：Resolved rate ↑
协议提醒：harness、工具与 token 预算会显著影响结果
官方发布引用 18 条 · Claude Opus 5 · GPT-5.6 · Kimi K3 +15
更新：2026-08-31                                      →
```

### 9.6 卡片交互

- 整卡为语义化 `<a href="/benchmarks/{id}/">`，可键盘聚焦。
- hover 只允许阴影/边框等增强，不承载唯一信息。
- 删除 `.cite-pop`、`cursor:help` 和点击原地展开详情逻辑。
- 不在卡片内嵌套可点击外链，避免嵌套交互；外链只放详情页。
- 焦点样式清晰、与 hover 不同。
- 卡片点击不修改现有 DOM 高度，不出现布局跳动。

### 9.7 卡片验收

| 视口 | 预期列数 | 验收 |
|---|---:|---|
| 360×800 | 1 | 无横向滚动，关键信息完整 |
| 768×1024 | 2 | 两列等宽 |
| 1024×768 | 3 | 三列，卡片宽度可读 |
| 1280×800 | 3 | 容器居中，无单卡独占一行 |
| 1440×900 | 4 | 四列 |
| 1920×1080 | 4 | 容器不无限扩张，留白均衡 |

---

## 10. 评估详情页 `/benchmarks/{id}/` 模板

每个公开 benchmark 必须拥有独立页面，以下一级章节不得缺失；确实无资料时写“未公开/待核验”并解释，不得删除章节掩盖缺口。

### 10.1 顶部摘要

- H1：简称 + 全称。
- 一句话定义。
- 状态：active / legacy / superseded / deprecated / internal。
- 快速事实：类别、模态、语言、首次发布、最新版本、核心指标、分数方向、公开性、最后核验。
- 30 秒理解：
  - 测什么。
  - 不测什么。
  - 什么时候使用。
  - 最大误读风险。

### 10.2 背景与问题域

- 它为了解决什么旧评估缺陷而出现。
- 在评估版图中的位置，与相邻 benchmark 的关系。
- 谁创建、何时发布、现在由谁维护。
- 哪些决策适合使用它，哪些不适合。

### 10.3 测量构念

- `measures`：真正测量的能力。
- `does_not_measure`：不能从分数推出的能力。
- 构念效度风险：题目是否真的代表目标能力。
- 前端类比：对应单元测试、E2E、性能、兼容性或真实用户任务中的哪一类。

### 10.4 数据与任务构成

- 样本数、子集、split、来源、语言、领域和难度分布。
- 样本如何产生、筛选、标注和验证。
- 至少一个许可允许展示的真实样例；不能展示时提供结构化伪例并明确标识。
- 数据公开性、许可证、下载方式。
- 时间边界与持续更新机制。

### 10.5 评测协议

必须使用结构化 `Protocol Fingerprint` 展示：

| 字段 | 示例 |
|---|---|
| variant | `GPQA Diamond` 而非笼统 `GPQA` |
| shots | 0-shot / 5-shot |
| reasoning | no-CoT / CoT / reasoning effort=max |
| harness | Kimi Code / Codex / Terminus / official harness |
| tools | web、code、shell、browser、none |
| sampling | temperature、top_p、seed |
| budget | max tokens、turn limit、time limit、cost cap |
| runs | 每题采样数、全量运行次数 |
| aggregation | pass@1、pass@k、cons@k、mean、majority vote |
| judge | exact match、unit test、human、LLM judge、hybrid |
| normalization | 大小写、答案提取、容错和去重 |
| environment | 容器、硬件、依赖版本、网络权限 |

页面必须解释哪些字段最可能造成分数漂移。

### 10.6 指标与分数解释

每个指标分别说明：

- 普通语言定义。
- 公式及公式的口语解释。
- 取值范围、单位和“越高/越低越好”。
- 单题如何得分，整体如何聚合。
- 是否需要置信区间或显著性检验。
- 人类基线、随机基线或上限；只有有来源时才展示。
- 1 分差异是否有实际意义；无证据时不得编造分数档位。
- 不同 variant/protocol 下为什么不能直接比较。

### 10.7 版本与变体

- 版本时间线。
- 子集、修订版、Verified/Pro/Live 等名称关系。
- 旧版本是否被污染、饱和或替代。
- 页面默认展示哪个版本以及原因。
- 所有模型引用必须绑定具体版本或明确写 `unspecified`，不得静默归到最新版。

### 10.8 真实模型发布引用

这是详情页的核心证据区，按厂商分组并按发布日期倒序。每条至少展示：

- 厂商。
- 精确模型与 variant。
- 发布名称与发布日期。
- 该发布报告的 benchmark 版本。
- 报告分数；未报告时明确写“仅提及，未报告分数”，数据中用 `null`，禁止 `-`。
- 归因类型：厂商自报、benchmark 官方榜单、独立第三方、本站复现。
- 关键协议摘要。
- 证据位置：章节、表格、行、图、脚注或 PDF 页码。
- 官方原文入口。
- 核验日期和状态。
- 可比较性结论：`可直接比较 / 需谨慎 / 不可直接比较`，并列出原因。

不得只显示厂商 Logo 或“OpenAI/Anthropic/Google”这种泛化 release 名。

### 10.9 局限、污染与游戏空间

至少检查：

- 训练集或答案泄漏。
- benchmark awareness / eval awareness。
- 提示词和格式敏感性。
- 多次采样、投票和工具带来的计算优势。
- 私有 harness 或私有数据导致的不可复现。
- 饱和、难度失配和真实业务迁移性。
- 语言、地域、文化和领域偏差。
- 排行榜优化与 Goodhart 风险。

### 10.10 复现指南

- 官方数据集、论文、仓库、leaderboard。
- 推荐框架与最低版本。
- 环境、安装命令、数据准备、运行命令。
- 最小示例与期望输出结构。
- 成本、时间、硬件、网络和许可证提示。
- 复现结果必须标注本站运行日期、模型快照、参数和 commit。

### 10.11 关联阅读与变更记录

- 对应书籍章节。
- 相邻/替代 benchmark。
- 使用该 benchmark 的模型发布页。
- 页面更新记录：新增来源、修正分数、协议变化、撤回引用。
- 完整 References。

### 10.12 详情页内容完整度评分

构建时为每个 benchmark 计算完整度，不用于“质量排名”，只用于维护：

| 项 | 权重 |
|---|---:|
| 定义、测量与不测量 | 15 |
| 数据与任务构成 | 15 |
| 协议指纹 | 20 |
| 指标与分数解释 | 15 |
| 版本/变体 | 10 |
| 局限/污染 | 10 |
| 复现方法 | 10 |
| 真实模型发布证据 | 5 |

- `<60`：draft，不公开索引。
- `60–79`：beta，页面显式提示仍在补全。
- `≥80` 且必要字段无缺失：reviewed。
- `≥90` 且至少两人/两轮核验：verified。

---

## 11. 内容与数据架构

### 11.1 目标目录

```text
data/
├─ schemas/
│  ├─ benchmark.schema.json
│  ├─ vendor.schema.json
│  ├─ model-release.schema.json
│  ├─ evidence.schema.json
│  └─ taxonomy.schema.json
├─ taxonomy.json
├─ vendors.json
├─ benchmarks/
│  ├─ mmlu.json
│  ├─ gpqa-diamond.json
│  └─ ...
├─ model-releases/
│  ├─ openai/gpt-5-6.json
│  ├─ anthropic/claude-opus-5.json
│  ├─ moonshot/kimi-k3.json
│  └─ ...
├─ coverage/
│  ├─ policy.json
│  └─ source-seeds.json
└─ generated/                 # 构建生成，禁止手改
   ├─ benchmark-index.json
   ├─ release-index.json
   ├─ evidence-edges.json
   └─ coverage-matrix.json

content/
├─ benchmarks/
│  ├─ mmlu.md
│  └─ ...
├─ build/
│  ├─ mini-evaluator.md
│  └─ ...
└─ methodology/
   ├─ evidence-policy.md
   └─ comparison-policy.md
```

迁移原则：

- `data/benchmarks.json` 在 P0 迁移后成为兼容生成产物或删除，不再作为手工唯一源。
- benchmark 文件只保存 benchmark 自身，不手写“采用它的模型数组”。
- 模型发布与 benchmark 的关系由 evidence edge 建立，构建时反向生成。
- 长篇解释存 Markdown；可筛选、可排序、可验证字段存 JSON。

### 11.2 Benchmark Schema 核心字段

```json
{
  "id": "swe-bench-verified",
  "name": "SWE-bench Verified",
  "full_name": "SWE-bench Verified",
  "aliases": ["SWE-bench Verified"],
  "status": "active",
  "supersedes": [],
  "superseded_by": null,
  "categories": ["coding", "agent"],
  "modalities": ["text", "repository", "tool"],
  "domains": ["software-engineering"],
  "languages": ["en"],
  "owner": {
    "name": "...",
    "url": "..."
  },
  "first_released_at": "YYYY-MM-DD",
  "latest_version": "...",
  "latest_version_at": "YYYY-MM-DD",
  "license": "...",
  "visibility": "public",
  "summary": "...",
  "measures": ["..."],
  "does_not_measure": ["..."],
  "decision_uses": ["..."],
  "task_types": ["repository-issue-resolution"],
  "dataset": {
    "sample_count": null,
    "splits": [],
    "source_type": "real-world",
    "languages": [],
    "public_sample": null
  },
  "metrics": [
    {
      "id": "resolved-rate",
      "name": "Resolved rate",
      "range": [0, 100],
      "unit": "percent",
      "direction": "higher",
      "aggregation": "mean"
    }
  ],
  "default_protocol": {},
  "versions": [],
  "limitations": [],
  "contamination_risk": "medium",
  "gameability": [],
  "reproduction": {},
  "official_sources": [],
  "related_benchmarks": [],
  "book_chapters": [11],
  "content_path": "content/benchmarks/swe-bench-verified.md",
  "last_verified_at": "YYYY-MM-DD",
  "content_status": "reviewed"
}
```

### 11.3 Vendor Schema 核心字段

```json
{
  "id": "moonshot",
  "name": "Moonshot AI",
  "display_name": "Kimi / Moonshot AI",
  "region": "CN",
  "official_domains": ["kimi.ai", "kimi.com", "moonshot.cn"],
  "official_blog_roots": [],
  "official_docs_roots": [],
  "verified_orgs": {
    "github": [],
    "huggingface": []
  },
  "coverage_tier": 1,
  "active": true
}
```

### 11.4 Model Release Schema 核心字段

```json
{
  "id": "kimi-k3",
  "vendor_id": "moonshot",
  "release_title": "Kimi K3: Open Frontier Intelligence",
  "release_date": "2026-07-XX",
  "models": [
    {
      "id": "kimi-k3",
      "name": "Kimi K3",
      "variant": "max reasoning"
    }
  ],
  "capability_tags": ["coding", "agent", "multimodal"],
  "primary_sources": [
    {
      "url": "https://www.kimi.ai/blog/kimi-k3",
      "kind": "official_release_blog",
      "language": "en"
    }
  ],
  "benchmark_evidence": [],
  "retrieved_at": "YYYY-MM-DD",
  "last_verified_at": "YYYY-MM-DD",
  "status": "verified"
}
```

### 11.5 Evidence Edge Schema

```json
{
  "id": "moonshot-kimi-k3--terminal-bench-2-1",
  "benchmark_id": "terminal-bench-2-1",
  "benchmark_variant": "2.1",
  "vendor_id": "moonshot",
  "release_id": "kimi-k3",
  "model_id": "kimi-k3",
  "model_variant": "reasoning_effort=max",
  "source_url": "https://www.kimi.ai/blog/kimi-k3",
  "source_kind": "official_release_blog",
  "source_tier": "A",
  "attribution_type": "vendor_reported",
  "evidence_type": "footnote",
  "locator": {
    "heading": "Full Benchmark Table / Footnotes / Coding benchmarks",
    "table": null,
    "row": "Terminal-Bench 2.1",
    "figure": null,
    "page": null,
    "quote_snippet": ""
  },
  "reported_score": {
    "value": null,
    "display": null,
    "unit": "percent",
    "metric": "pass_rate",
    "score_status": "not_extracted"
  },
  "protocol": {
    "harness": "Kimi Code",
    "tools": [],
    "shots": null,
    "reasoning_effort": "max",
    "temperature": 1.0,
    "top_p": 1.0,
    "token_budget": null,
    "turn_limit": null,
    "time_limit": null,
    "run_count": null,
    "aggregation": null,
    "judge": null
  },
  "comparison_scope": "only_same_protocol",
  "retrieved_at": "2026-08-31",
  "last_verified_at": "2026-08-31",
  "status": "verified",
  "archive_url": null,
  "notes": ""
}
```

### 11.6 Schema 规则

- 所有 ID 使用稳定 kebab-case，不随页面标题变化。
- 日期统一 ISO 8601；未知精确日时允许 `YYYY-MM`，但需额外 `date_precision`。
- 缺失值使用 `null` 或显式状态，不使用 `"-"`、`"N/A"` 混代。
- URL 必须为 HTTPS，例外必须在 allowlist 说明。
- `aliases` 不能与其他 benchmark 的 canonical name/alias 冲突。
- `status=verified` 必须通过来源域、定位、模型、发布、日期和协议必填检查。
- `content_status` 与证据 `status` 分离：文章写完不代表引用已核验。

---

## 12. 引用证据与厂商覆盖体系

### 12.1 来源等级

| 等级 | 来源 | 可用于证明厂商发布采用 benchmark | 可用于 benchmark 定义 |
|---|---|---:|---:|
| A | 厂商官方 release blog、system/model card、官方文档、厂商署名技术报告 | 是 | 可辅助 |
| B | benchmark 官方论文、官方仓库、官方 leaderboard、维护者文档 | 仅能证明榜单/复现，不等同厂商自报 | 是 |
| C | 可信独立评测机构或论文 | 仅标记为第三方，不得伪装成厂商发布 | 可交叉核对 |
| D | 搜索摘要、社交帖、媒体转述、聚合榜单、无作者转载 | 否 | 否；只作发现线索 |

### 12.2 “已核验模型发布引用”的必要条件

公开计数只统计同时满足以下条件的 evidence：

- `status = verified`。
- `source_tier = A`。
- 页面明确出现 benchmark 名称、清晰可对应的表格行/图/脚注；不能只根据图片文件名或搜索摘要推断。
- 有精确 `vendor_id + release_id + model_id`。
- 有 source URL 与 locator。
- benchmark variant 可确定，或显式写 `unspecified`。
- 分数未公开时 `reported_score.value = null`，不得补零或 `-`。

### 12.3 归因必须区分

- `vendor_reported`：厂商在自己的发布材料中报告。
- `benchmark_owner_reported`：benchmark 官方 leaderboard 报告。
- `third_party_reported`：独立机构运行或转录。
- `site_reproduced`：本站按记录协议复现。
- `comparison_cited`：厂商只引用了竞争模型的分数，不代表自己运行。

卡片上的“官方发布引用数”只计 `vendor_reported`；详情页可分区展示其他类型。

### 12.4 可比较性判定

构建时比较两条 evidence 的以下字段：

- benchmark 与 variant。
- dataset snapshot/date。
- harness 与工具。
- shots、prompt、CoT/reasoning effort。
- temperature、top_p、seed。
- token/turn/time/cost budget。
- run count、pass@k/cons@k/majority vote。
- judge、normalization、环境。

判定：

- `comparable`：所有关键字段一致或官方明确声明同协议。
- `caution`：缺少非核心字段，页面逐项提示。
- `not_comparable`：variant、harness、工具、effort、aggregation 等关键字段不同。
- `unknown`：信息不足，不得默认可比。

页面禁止只按数值排序而不显示判定。

### 12.5 来源抓取与人工核验流程

1. 从厂商官方 release index 或已验证域名发现发布。
2. 建立 release 实体，保存发布日期、模型和主来源。
3. 提取正文、表格、图注、脚注和 PDF 页码。
4. 将每个 benchmark 建成独立 evidence edge。
5. 二次核对 benchmark 官方版本/协议。
6. 运行 Schema、域名、链接和重复检查。
7. 人工抽查 locator 能否在 60 秒内回到证据位置。
8. 通过后从 `pending` 改为 `verified`。

对于 JS-only、图片表格或抓取器无法读取的页面：

- 使用浏览器人工查看或截图/OCR 辅助，但最终必须人工核对。
- 保存 heading/figure/table/row/page 等定位信息。
- OCR 文本不得直接作为唯一证据。
- 无法确认时保持 `pending`，不计入公开数量。

### 12.6 必须覆盖的厂商层级

#### Tier 1 — 国际

- OpenAI
- Anthropic
- Google DeepMind / Gemini
- xAI
- Meta / Llama
- Mistral AI

#### Tier 1 — 国内

- DeepSeek
- Moonshot AI / Kimi
- Z.ai / GLM
- MiniMax
- Alibaba / Qwen
- ByteDance Seed / Doubao

#### Tier 2 — 有公开一手材料时纳入

- Tencent Hunyuan
- Baidu ERNIE
- Xiaomi MiMo
- Huawei Pangu
- 其他在公开模型发布中提供可核验 benchmark 的重要厂商

### 12.7 覆盖边界

“覆盖主流厂商”定义为：

- 对 Tier 1 厂商检查滚动 24 个月内所有主要通用模型发布。
- 同时覆盖当前旗舰、性价比/Flash、小型、reasoning、coding/agent、多模态等主要产品线。
- 对每家维护 release index：已核验、无 benchmark、页面不可访问、待核验、未公开。
- 站点只能声称“已检查覆盖政策范围内的 X/Y 个主要发布”，不得声称“覆盖所有模型”。

### 12.8 覆盖矩阵

构建生成 `/methodology/coverage/`，至少展示：

| 厂商 | 覆盖窗口内主要发布 | 已检查 | 含 benchmark | 已核验证据 | 待处理 | 最后检查 |
|---|---:|---:|---:|---:|---:|---|

并可下钻到 release：

- release 名称/日期。
- 来源状态。
- 提取 benchmark 数。
- 缺失原因。
- 核验人/Agent 与日期。

### 12.9 已验证的高质量来源模式

后续 Agent 必须把以下官方材料当作证据抽取样板，而不是只保存链接：

- Kimi K3 官方技术博客：脚注明确区分 harness、reasoning effort、temperature/top-p、运行次数、第三方分数与上下文策略。
- DeepSeek V4-Flash-Vision-Exp 官方文档：明确 Code Agent 文本任务的 harness、effort、top-p、temperature，以及多模态元素处理差异。
- Anthropic Claude Opus 4.6 官方发布：明确 tool、context compaction、reasoning effort、trial count、harness 和分数修订记录。
- OpenAI GPT-5.6、xAI Grok 4.6、Google Gemini 3 等官方发布：用于建立发布级 benchmark 表和对比来源归因。

这些页面说明：**一个可信引用不是“某厂商提到某 benchmark”，而是一条可以复核模型、版本、协议、分数、归因和修订历史的证据记录。**


---

## 13. 全书内容深度目标

现有 32 章与四大块结构保留，但每一块必须承担不同学习任务，避免章节只是 benchmark 名称堆叠。

### 13.1 第 0 部分：术语速查

目标：让读者在不提前学机器学习课程的情况下，能读懂后续章节。

必须补全：

- 每个术语包含：一句话、前端类比、精确定义、常见误解、所在章节。
- 同义词与缩写可被全站搜索。
- 对容易混淆的成对概念提供对比：eval/benchmark/metric、model/application eval、offline/online、reference-based/reference-free、pointwise/pairwise、pass@k/cons@k。
- 术语页与 benchmark 详情互链。

### 13.2 四大块 1：建立框架认知（第 1–3 章）

读完必须能回答：评估是什么、为什么出现、评估谁、何时评估、能解决和不能解决什么。

内容门槛：

- 从 Turing Test、标准 NLP benchmark、基础模型 scaling、instruction tuning、RLHF、reasoning、Agent 演进到线上应用评估。
- 画出模型研发与应用研发两条生命周期，并标注评估调用点。
- 解释训练 loss、验证集、benchmark、红队、产品指标的差异。
- 讲清构念效度、内部/外部效度、可靠性、统计不确定性和 Goodhart 定律。
- 每个理论必须有前端测试类比和一个反例。

### 13.3 四大块 2：方法论与标准流程（第 4–7 章）

读完必须能独立设计一份评估方案。

标准 SOP 必须统一为：

```text
业务目标
→ 风险与用户任务
→ 能力分解
→ 指标与 rubric
→ 样本来源与抽样
→ 数据清洗/脱敏/版本
→ 推理协议冻结
→ 评分器实现与校准
→ 运行与可观测
→ 聚合、置信区间与显著性
→ 错题分层与根因分析
→ 发布门禁
→ 线上监控与失败回流
```

每一步必须给出：输入、输出、角色、工具、常见失败、验收物。

重点补强：

- LLM-as-Judge 的 rubric、交换顺序、位置/长度/风格/自偏好等偏差。
- Judge 与人工标注的一致性校准，不得只给一个固定 80% 口号；必须说明任务、样本量和指标。
- 人类评估的盲评、标注手册、培训、冲突仲裁、Elo/Bradley-Terry。
- 元评估：评分器准确性、稳定性、鲁棒性和漂移。
- 统计部分提供可运行 TypeScript 或 Python 对照实现，并用同一小数据集贯穿。

### 13.4 四大块 3：厂商发布评测全景（第 8–18 章）

读完必须能看懂厂商发布文章，而不是记住一串 benchmark 名。

每个 benchmark 的章节内最小结构：

1. 测量对象。
2. 数据与任务。
3. 指标。
4. 协议指纹。
5. 分数解释。
6. 版本与相邻 benchmark。
7. 局限、污染和游戏空间。
8. 真实厂商采用记录。
9. 一个“是否可直接比较”的练习。
10. 指向独立 benchmark 详情页。

第 8 章必须成为“读模型报告的解释器”，重点讲：

- 表格中的粗体、星号、脚注、内部 benchmark 和第三方分数。
- best-of-N、pass@k、cons@k、majority vote。
- reasoning effort、token budget、工具、agent harness。
- 单代理/多代理、上下文压缩、联网与代码执行。
- 自报分数、官方 leaderboard、第三方复现的归因差异。
- 只给平均分、不报告方差或运行次数的风险。
- benchmark 版本和快照日期。

第 9–18 章不得只做“排行榜摘要”，每章至少包含：

- 一个协议改变导致分数显著变化的真实案例。
- 一个旧 benchmark 被饱和/污染/替代的案例。
- 一个厂商对比看似可比、实际不可比的案例。
- 一张“选用决策树”。

### 13.5 四大块 4：评估框架实战（第 19–31 章）

读完必须能从零落地。

必须覆盖：

- 框架选型：数据驱动、实验跟踪、observability、CI、本地/托管、RAG、Agent、安全等维度。
- Mini Evaluator：可运行代码，不是伪代码。
- 测试集版本、数据 lineage、PII 脱敏、合成样本质检。
- exact/regex/schema/code test/LLM judge/human/hybrid scorer。
- 并发、重试、rate limit、缓存、成本与可复现。
- 报告、错题查看、slice、回归阈值和发布门禁。
- RAG 的 retrieval 与 generation 分层。
- Agent 的最终结果、轨迹、工具调用、成本、延迟和安全。
- 红队、安全不对称性和误杀/漏判。
- 离线与线上指标连接、A/B、灰度、漂移和反馈回流。
- 客服 RAG、代码 Agent、多模态三个案例均给出真实工程物料模板。

### 13.6 框架章节的中立性要求

对任何框架或平台，使用统一矩阵，不写“最好用”等无上下文结论：

| 维度 | 必须说明 |
|---|---|
| 抽象 | dataset / task / solver / scorer / run / trace 如何建模 |
| 支持对象 | 模型、RAG、Agent、多模态、安全 |
| 自定义 | 自定义 scorer、dataset、provider、reporter 难度 |
| 可复现 | 配置、版本、seed、缓存、环境记录 |
| 可观测 | trace、逐样本结果、错误分析 |
| CI | 阈值、基线比较、退出码、报告产物 |
| 部署 | 本地、开源、托管、私有化 |
| 成本 | 许可证、服务费用、运行成本 |
| 锁定 | 数据可导出性和 provider lock-in |
| 适合/不适合 | 明确场景而非泛化推荐 |

候选工具至少调研：OpenAI Evals/平台评估能力、Anthropic 官方评估指南、Google Vertex AI Evaluation、Inspect AI、lm-evaluation-harness、Ragas、DeepEval、Promptfoo、LangSmith、Langfuse。具体功能必须以当时官方文档为准，不从旧博客推断。

### 13.7 每章的统一质量门禁

构建 `scripts/validate-content.mjs` 自动检查：

- front matter 必填字段。
- H1 唯一、H2 编号连续、无跳级标题。
- 存在学习目标、前置知识、Try It、自测、常见错误、Cheat Sheet、References。
- 代码围栏闭合并声明语言。
- 内部章节/benchmark 引用可解析。
- 事实数字附近存在引用标记。
- 不存在 TODO/TBD/待补充占位进入 production。
- `last_verified_at` 超过阈值时产生 warning 或 failure。

自动检查不能替代内容审阅；每章还需通过“初学者可理解性”抽查。

---

## 14. 从零搭建评估体系的 Capstone

### 14.1 最终交付

在仓库增加可独立运行的示例：

```text
examples/mini-evaluator/
├─ README.md
├─ package.json
├─ src/
│  ├─ schema.ts
│  ├─ dataset.ts
│  ├─ provider.ts
│  ├─ runner.ts
│  ├─ scorers/
│  │  ├─ exact-match.ts
│  │  ├─ json-schema.ts
│  │  └─ llm-judge.ts
│  ├─ aggregate.ts
│  ├─ compare.ts
│  └─ report.ts
├─ datasets/
│  ├─ smoke.jsonl
│  └─ regression.jsonl
├─ rubrics/
│  └─ helpfulness.yaml
├─ eval.config.yaml
├─ tests/
└─ .github/workflows/eval.yml
```

### 14.2 Capstone 必须演示

1. 定义业务目标和失败分类。
2. 构建至少 30 条可公开样本，含正常、边界、对抗与回归样本。
3. 连接一个可替换 provider；无 API key 时可用 deterministic fixture 跑通。
4. 同时运行 deterministic scorer 与 judge scorer。
5. 用人工金标准校准 judge。
6. 输出逐样本 JSONL、summary JSON、可读 HTML/Markdown 报告。
7. 比较 baseline 与 candidate，计算差值与不确定性。
8. 按总体指标和关键 slice 执行 CI 门禁。
9. 失败样本分类并回流成 regression set。
10. 记录模型、提示词、数据集、代码、参数和运行环境版本。

### 14.3 Capstone 验收

```bash
cd examples/mini-evaluator
npm ci
npm test
npm run eval:fixture
npm run report
```

必须在无外网、无密钥环境下成功，且生成：

- `artifacts/run.json`
- `artifacts/results.jsonl`
- `artifacts/summary.json`
- `artifacts/report.html`

提供可选真实 provider 集成，但 CI 默认不消耗付费 API。

---

## 15. 全站搜索与发现

### 15.1 搜索对象

统一索引：

- 章节标题、H2/H3、正文摘要和术语。
- benchmark 名称、别名、测量对象、指标、协议、类别。
- 模型发布、厂商、模型名和证据中的 benchmark。
- 实战教程与代码符号。

### 15.2 搜索体验

- 全站 `Ctrl/Cmd + K` 打开搜索。
- 结果按“书籍 / 评估 / 模型发布 / 实战 / 术语”分组。
- 支持拼音不是 P0；英文大小写、连字符、别名和缩写必须支持。
- 查询高亮但不得破坏屏幕阅读器文本。
- 键盘上下选择、Enter 打开、Esc 关闭。
- URL `/search/?q=` 可分享。
- 无结果时给出别名和清除筛选建议。

### 15.3 索引实现

- 构建时生成轻量索引，P0 可继续纯前端。
- 文档量增长前不引入后端服务。
- 索引中不重复嵌入整篇正文，控制下载体积；按章节/小节建立摘要和关键词。
- 搜索脚本延迟加载，不阻塞首页和正文 LCP。

---

## 16. SEO、可访问性、性能与兼容性

### 16.1 SEO

每页必须生成：

- 唯一 `<title>` 与 description。
- canonical clean URL。
- Open Graph/Twitter metadata。
- 正确 `lang="zh-CN"`。
- Breadcrumb UI 与 `BreadcrumbList` JSON-LD。
- 首页/书籍入口使用适当 `Book`/`CreativeWork` 结构化数据。
- 章节使用 `TechArticle` 或 `Article`。
- benchmark 页面可使用 `Dataset`/`TechArticle` 组合，但只有属性真实匹配时使用。
- `sitemap.xml`、`robots.txt`、404 页面。
- 旧 `.html` URL 保持重定向与 canonical，避免重复索引。

禁止为了富媒体结果虚构 ISBN、评分、作者机构或数据集属性。

### 16.2 可访问性

目标：WCAG 2.2 AA。

必须满足：

- 页面有 skip link、`header/nav/main/aside/footer` landmarks。
- 标题层级语义正确。
- 导航在所有页面位置和顺序一致。
- 所有功能可键盘完成，焦点可见且不被 sticky header/抽屉遮挡。
- 核心点击目标至少按 44×44px 设计；最低不得违反 24×24px AA 要求。
- 文本对比度至少 4.5:1，大文本至少 3:1；非文本交互状态满足要求。
- 不使用 hover-only、颜色-only、placeholder-only 信息。
- 抽屉/对话框实现焦点管理、Esc 关闭、背景不可聚焦、恢复焦点。
- 主题按钮有可读 label，不只显示月亮/太阳。
- 表格具备 caption、scope 和必要的可滚动提示。
- 代码复制结果通过非打断式 live region 提示。
- 动画在 reduced motion 下关闭或简化。
- 卡片、chip、排序控件有明确 accessible name。

### 16.3 性能预算

| 项 | 预算 |
|---|---:|
| LCP | ≤ 2.5s p75 |
| INP | ≤ 200ms p75 |
| CLS | ≤ 0.1 p75 |
| 目录/详情页首屏 JS | ≤ 150KB gzip |
| 全站基础 CSS | ≤ 80KB gzip |
| 首页首屏图片 | ≤ 250KB，声明尺寸并提供现代格式 |
| 第三方运行时脚本 | 默认 0；必要时延迟加载且记录理由 |

措施：

- Mermaid 构建时渲染，避免每个章节加载完整运行时。
- 搜索索引、筛选脚本按页面延迟加载。
- 不引入仅为简单卡片/筛选服务的大型前端框架。
- 图片提供 width/height、WebP/AVIF 和 lazy loading；LCP 图除外。
- 字体优先系统字体；引入 Web Font 必须有子集、预加载与回退策略。
- 页面静态 HTML 中包含核心内容，避免客户端模板首次渲染。

### 16.4 浏览器与设备

最低验证：

- 最新稳定 Chrome、Edge、Firefox、Safari。
- iOS Safari、Android Chrome。
- 360、390、768、1024、1280、1440、1920 宽度。
- 缩放 200% 时无内容丢失和二维滚动；大表格/代码除外。
- 暗色、系统自动主题和高对比度场景。

---

## 17. 工程架构原则

### 17.1 P0 不先迁移框架

当前站点已经是可运行的 Node 静态生成器。P0 优先：

1. 建立测试和快照。
2. 提取配置、组件、layout、页面和数据 loader。
3. 替换/封装 Markdown 解析层。
4. 完成独立 benchmark 路由与 Schema。

只有完成上述步骤后，才允许用 ADR 比较继续自研、VitePress、Astro 等方案。迁移必须证明：

- 内容路由不破坏。
- 构建复杂度或维护成本显著下降。
- 搜索、benchmark 数据页和证据页可实现。
- 性能、无障碍和静态部署不倒退。

### 17.2 Markdown 引擎

自研解析器应逐步替换为成熟、可扩展、可测试的解析管线，例如 `markdown-it` 或 unified/remark/rehype。

迁移要求：

- 先用现有 32 章生成 HTML snapshot。
- 对表格、任务列表、代码块、原生 details、Mermaid、脚注、标题 ID 建立 fixtures。
- 新旧输出允许语义等价，不要求字节相同。
- 防止任意 HTML/XSS；明确允许标签和属性。

### 17.3 单一事实来源

- 章节顺序：`book/metadata.yaml`。
- 章节元信息：章节 front matter；metadata 只管顺序/分组，避免重复标题。
- benchmark：`data/benchmarks/*.json`。
- model release + evidence：`data/model-releases/**/*.json`。
- 导航/站点 metadata：`site.config.mjs`。
- 构建产物：`dist/`，禁止手改。

### 17.4 依赖建议

- JSON Schema：Ajv。
- Markdown：`markdown-it` 或 unified 生态，选择一个，不并存两套。
- HTML 校验：html-validate。
- E2E：Playwright。
- 无障碍：`@axe-core/playwright`。
- 性能：Lighthouse CI。
- 链接：Lychee 或受控自研 checker。
- 单元测试：Node test runner 或 Vitest，选择与当前复杂度匹配的一套。

每个依赖需固定主版本、记录选择理由并关注许可证。

### 17.5 安全

- 所有 Markdown/外部数据经过转义或可信 sanitizer。
- 外链新窗口使用 `rel="noopener noreferrer"`；默认不强制新窗口。
- 不执行来源页脚本，不把抓取 HTML直接插入站点。
- 搜索参数和 hash 不得进入 `innerHTML` 未转义。
- CI 中第三方链接检查不输出任何密钥。
- 远程图片默认不热链，必要时保存许可明确的本地资源和来源。

---

## 18. 自动校验与 CI 门禁

### 18.1 目标命令

```json
{
  "scripts": {
    "validate": "npm run validate:content && npm run validate:data && npm run validate:evidence",
    "validate:content": "node scripts/validate-content.mjs",
    "validate:data": "node scripts/validate-data.mjs",
    "validate:evidence": "node scripts/validate-evidence.mjs",
    "check:links": "node scripts/check-links.mjs",
    "build": "node scripts/web/build.mjs && npm run build:epub",
    "test:unit": "node --test",
    "test:e2e": "playwright test",
    "test:a11y": "playwright test tests/a11y",
    "test:visual": "playwright test tests/visual",
    "test:lighthouse": "lhci autorun",
    "ci": "npm run validate && npm run build && npm run check:links && npm run test:unit && npm run test:e2e && npm run test:a11y"
  }
}
```

### 18.2 数据测试

- 所有 JSON 通过 Schema。
- benchmark/vendor/release/evidence ID 唯一。
- 所有外键存在。
- alias 无冲突。
- category/modality/metric 等值来自 taxonomy。
- 无 `score: "-"`、空 URL、泛化 release 名。
- `verified` evidence 的必填字段齐全。
- 公开 citation count 与派生 evidence 数一致。
- 同一 release/benchmark/variant/source 不重复。

### 18.3 证据测试

- 来源域必须属于 vendor `official_domains`，否则不可标 A。
- URL 可访问或有明确 archive/temporary failure 状态。
- locator 至少包含 heading/table/row/figure/page 中一个。
- quote snippet 不超过 25 个英文词或合理等价长度，且只用于定位。
- release date 不晚于来源页面可验证日期。
- score 数值和 display 语义一致。
- benchmark variant 不存在时构建失败。
- source correction/retraction 必须保留历史，不静默覆盖。

### 18.4 路由与构建测试

- 每章、每个公开 benchmark、每个公开 release 均生成页面。
- 无孤儿内容、无指向不存在页面的关系。
- 旧路由重定向通过。
- 所有页面只有一个 H1、一个 main。
- canonical、title、description、breadcrumb 正确。
- production HTML 不含 TODO、undefined、`[object Object]`。

### 18.5 导航测试

对首页、章节、评估目录、评估详情、实战页做 DOM snapshot：

- 主导航恰好 3 项。
- 标签和顺序完全相同。
- Logo 始终回首页。
- active 页面 `aria-current` 正确。
- 工具区在移动和桌面均存在且语义一致。

### 18.6 响应式与视觉测试

Playwright 对 360、768、1024、1280、1440、1920 截图并断言：

- benchmark 网格列数符合本文件。
- 卡片无超出容器、无水平滚动、无重叠。
- 章节侧栏在对应断点显示/隐藏。
- 抽屉打开时焦点受控，关闭后恢复。
- 暗色模式没有不可读文本和图表。
- 筛选空状态、长标题、无引用、30+ 引用等边界 fixture 正常。

### 18.7 无障碍测试

- axe 在关键页面 `serious/critical = 0`。
- Tab 顺序覆盖 skip link、导航、搜索、筛选、卡片、正文链接、页脚。
- hover 信息都可在无鼠标情况下获得。
- 主题、搜索、抽屉、复制按钮均有 name/role/state。
- sticky header 不遮挡当前焦点。

### 18.8 链接测试策略

- 内部链接每次 CI 全量检查，失败阻断。
- 外部来源每日/每周定时检查，使用缓存、限速、重试和状态区分。
- 403/429 不直接判定内容失效；标记 `blocked` 并人工复核。
- 关键 A 级来源连续失败后创建 Issue，但保留页面与历史证据。
- 跳转域变化必须人工确认，防止域名劫持或错误重定向。

---

## 19. 维护、变更与透明度

### 19.1 内容状态

统一状态：

- `draft`：仅内部构建或 robots noindex。
- `beta`：结构基本完成，有明确缺口。
- `reviewed`：完成一轮技术/内容审阅。
- `verified`：来源、协议、页面均完成复核。
- `stale`：超过复核周期或来源发生变化。
- `deprecated`：内容保留但不再推荐。

### 19.2 新鲜度策略

- 模型发布证据：Tier 1 厂商每月检查，重要新发布尽快收录。
- 活跃 benchmark：每 6 个月核验版本、仓库和 leaderboard。
- 稳定基础概念：每 12 个月复核。
- 来源失效、分数修订、benchmark 更名时立即创建维护任务。

### 19.3 公开变更记录

`/methodology/changelog/` 记录：

- 新增/删除/改名 benchmark。
- 新增模型发布证据。
- 分数、协议或来源修订。
- 引用撤回与原因。
- 比较结论变化。

禁止无记录地修改已经公开的分数或归因。

### 19.4 反馈入口

每个章节和详情页提供：

- `在 GitHub 报告内容问题`，自动带页面 URL、数据 ID 和最近 commit。
- `查看源文件`。
- 不引入需要账号的站内评论系统作为 P0。

---

## 20. 明确禁止事项

后续 Agent 不得：

1. 再创建一套独立 topbar、主题脚本、基础 CSS 或 SEO 模板。
2. 使用 hover、tooltip 或鼠标停留作为获取关键引用的唯一方式。
3. 以卡片原地展开替代独立 benchmark 详情页。
4. 将 `OpenAI`、`Google`、`Anthropic` 等厂商名当作 release 名。
5. 用 `-` 同时表示“未报告、未提取、不适用、零分”。
6. 用厂商首页、产品首页或泛化博客入口证明具体 benchmark 采用。
7. 将第三方 leaderboard 分数写成厂商自报。
8. 混淆 benchmark 版本、子集、pass@k/cons@k、带工具/无工具结果。
9. 在协议不同的情况下仅按数值宣称模型 A 优于 B。
10. 编造人类基线、分数档位、样本数、发布日期或比较条件。
11. 把搜索摘要、社交媒体或媒体文章作为唯一事实来源。
12. 直接复制大段受版权保护的模型发布或论文文本。
13. 在页面写“覆盖全部主流模型”而没有展示覆盖策略和矩阵。
14. 手工编辑 `dist/` 或其他 generated 文件。
15. 在没有回归测试的情况下替换 Markdown 引擎或迁移站点框架。
16. 为追求炫酷引入阻塞阅读的动画、3D、视频背景或大型前端运行时。
17. 隐藏待核验、不完整和不可比较状态。
18. 删除旧 URL 而不提供重定向。
19. 让卡片、按钮、标签只在浅色模式或单一屏幕上通过。
20. 只完成代码不补测试、只补内容不补来源、只补来源不补定位。


---

## 21. 分阶段执行路线图

> 所有任务默认未完成。后续 Agent 只可在实际通过验收后将 `[ ]` 改为 `[x]`。

### 21.1 P0 — 统一产品骨架、修复核心体验、建立可信数据（必须先完成）

#### [ ] P0-BASE-001 固化基线与贡献入口

**依赖**：无  
**主要文件**：`README.md`、`AGENTS.md`、`book/metadata.yaml`、`package.json`、本文件

**实施**：

- README 改为当前真实状态：默认分支 `main`、32 章/四大块、自研 Node 静态生成器、实际目录和构建命令。
- 删除 VitePress、`docs/`、28 章/6 部分等过期描述。
- 增加“内容源 vs 生成产物”“如何补 benchmark”“如何补 model release evidence”。
- 在 AGENTS.md 引用本文件，并说明冲突时：事实与任务目标以本文件最新版本为准，写作风格以 AGENTS.md 为准。

**DoD**：

- 新贡献者只读 README 可成功安装、校验、构建并找到源文件。
- README 所列目录和脚本均由 CI 检查存在。
- 不再出现 `docs/VitePress/28 章/6 部分` 等旧结构残留。

---

#### [ ] P0-ENG-001 为现有页面建立回归基线

**依赖**：P0-BASE-001  
**主要文件**：`tests/fixtures/`、`tests/visual/`、`playwright.config.*`

**实施**：

- 保存首页、章节、评估大全的关键 HTML 语义 fixture。
- 建立 360/768/1024/1440 视口截图基线。
- 建立 Markdown 边界 fixture：表格、代码、Mermaid、details、任务列表、脚注、原始 HTML。
- 记录当前已知失败，不将错误快照当成最终目标；快照用于防止无关退化。

**DoD**：

- `npm run test:visual` 可本地执行。
- 至少覆盖 1 个普通章、1 个表格密集章、1 个 Mermaid 章、评估目录。
- 测试报告能区分“预期改造差异”和“非预期退化”。

---

#### [ ] P0-IA-001 建立单一站点配置与统一导航

**依赖**：P0-ENG-001  
**主要文件**：`site.config.mjs`、`scripts/web/components/site-header.mjs`、两个旧构建脚本

**实施**：

- 新增站点元信息、主导航、工具导航、canonical base、GitHub/EPUB 地址的单一配置。
- 所有页面调用同一个 header/footer 组件。
- 主导航固定为“系统学习 / 评估大全 / 动手搭建”。
- Logo 回首页；搜索、EPUB、GitHub、主题放工具区。
- 移除评估页独有的第 4 个主导航项和页面内联 active 样式。

**DoD**：

- 首页、章节、评估目录、评估详情、实战入口主导航 DOM snapshot 完全一致。
- 主导航在所有页面恰好 3 项。
- active 状态由路由计算并有 `aria-current`。
- 移动菜单键盘和触屏可用。

---

#### [ ] P0-ENG-002 模块化静态生成器

**依赖**：P0-ENG-001、P0-IA-001  
**主要文件**：`scripts/build-web.mjs`、`scripts/build-benchmarks-hub.mjs`、`scripts/web/**`

**实施**：

- 提取 shared head、SEO、header、footer、theme、breadcrumb、layout、asset pipeline。
- 将 homepage、chapter、catalog、detail 分成页面构建函数。
- 建立统一 route helper，禁止字符串手拼相对层级。
- 保留旧 npm script 作为薄兼容入口，再逐步指向新 build。
- 对 Markdown parser 先建立接口边界；本任务不要求立即替换全部实现。

**DoD**：

- 两个旧脚本不再各自包含完整 topbar/CSS/theme/SEO 实现。
- `npm run build:web` 一次生成所有页面。
- 共享组件变更能同时反映到全部页面。
- 现有 32 章和 EPUB 构建未破坏。

---

#### [ ] P0-DATA-001 建立 taxonomy 与 JSON Schema

**依赖**：P0-BASE-001  
**主要文件**：`data/schemas/**`、`data/taxonomy.json`、`scripts/validate-data.mjs`

**实施**：

- 按本文件建立 benchmark/vendor/model-release/evidence/taxonomy Schema。
- 明确定义 status、source tier、attribution type、metric、modality、category 等 enum。
- 用 Ajv 或等价工具输出可读错误：文件、JSON pointer、期望值。
- 增加唯一性、alias 冲突和外键校验。

**DoD**：

- `npm run validate:data` 在当前合法数据上通过。
- 故意删除必填字段、重复 ID、写 `score:"-"` 的 fixture 会失败。
- Schema 有至少一份有效和无效示例测试。

---

#### [ ] P0-DATA-002 迁移 `data/benchmarks.json`

**依赖**：P0-DATA-001  
**主要文件**：`data/benchmarks/*.json`、`data/vendors.json`、迁移脚本

**实施**：

- 为当前所有 benchmark 创建稳定 ID 的独立文件。
- 将类别迁移到 taxonomy。
- 将 `tests/protocol/meaning` 拆到明确字段；无法自动拆分的标记人工审阅。
- 从 benchmark 文件移除手工 `adoption`，迁入 release/evidence。
- 生成兼容索引，避免一次性破坏目录页。

**DoD**：

- 当前 benchmark 数迁移前后完全一致。
- 名称、别名和旧 ID 有映射表。
- 无数据静默丢失；未映射字段写入迁移报告。
- 构建仅从新数据源读取，旧单文件不再手工维护。

---

#### [ ] P0-EVID-001 建立 model release 与 evidence 数据层

**依赖**：P0-DATA-001、P0-DATA-002  
**主要文件**：`data/model-releases/**`、`scripts/validate-evidence.mjs`

**实施**：

- 将现有 adoption 拆成 release 实体与 evidence edge。
- 泛化 release 名必须精确到模型发布；无法确定的保持 `pending`，不公开计数。
- `score:"-"` 迁移为 `null + score_status`。
- 保存来源等级、归因、定位、核验日期和协议。
- 构建反向关系：benchmark → releases、release → benchmarks。

**DoD**：

- 所有旧 adoption 均出现在迁移报告中的 `verified/pending/rejected` 之一。
- public verified count 只统计 A 级 vendor-reported evidence。
- 任意详情页引用可在 60 秒内定位到来源位置。
- 泛化厂商主页和无法识别模型的记录不计入公开数量。

---

#### [ ] P0-EVID-002 完成 6 个官方发布样板

**依赖**：P0-EVID-001  
**首批来源**：Kimi K3、DeepSeek V4-Flash-Vision-Exp、GLM 5.3/5.3 Flash、OpenAI GPT-5.6、Anthropic Claude Opus 4.6/5、xAI Grok 4.6（至少完成 6 个独立 release）

**实施**：

- 每个发布提取所有明确 benchmark evidence。
- 保存表格/图/脚注定位、模型 variant、分数和协议。
- 区分厂商自报与引用第三方结果。
- 对 GLM `5.3` 与 `5.3 Flash` 分别核验，禁止因名称相似合并。
- 抓取器无法读取的页面进入人工浏览核验队列。

**DoD**：

- 6 个 release 全部通过 Schema 与人工抽查。
- 每个至少有一个完整 Protocol Fingerprint；来源没公开时明确缺失。
- 详情页能展示来源、定位、协议和可比较性。
- 样板成为后续厂商录入 fixture/documentation。

---

#### [ ] P0-CATALOG-001 重做响应式评估卡片网格

**依赖**：P0-ENG-002、P0-DATA-002  
**主要文件**：catalog page、`benchmark-card`、`catalog.css`

**实施**：

- 按本文件 1/2/3/4 列规则重写网格。
- 删除 460px 最小轨道与单卡 640px 最大宽度组合。
- 卡片内容使用新 benchmark/evidence 派生数据。
- 长标题、0 引用、30+ 引用、长中文摘要均有 fixture。

**DoD**：

- 6 个规定视口列数自动断言通过。
- 1280px 不再每个评估独占一行。
- 卡片无横向滚动、重叠和局部空白列。
- 暗色/浅色视觉回归通过。

---

#### [ ] P0-CATALOG-002 删除 hover 引用与原地展开

**依赖**：P0-CATALOG-001、P0-DETAIL-001  
**主要文件**：`benchmark-card`、catalog runtime

**实施**：

- 删除 `.cite-pop`、hover/focus popover 和 card open/detail DOM。
- 将关键信息直接显示在卡片上。
- 整卡链接到独立详情页。
- URL query 保留筛选状态；从详情返回时浏览器可恢复目录位置。

**DoD**：

- 页面不存在 hover-only 关键信息。
- 键盘 Enter、触屏点击、鼠标点击均进入同一 URL。
- 点击卡片不造成目录页 layout shift。
- DOM 中不再有内嵌完整采用表。

---

#### [ ] P0-DETAIL-001 生成独立 benchmark 详情页

**依赖**：P0-ENG-002、P0-DATA-002、P0-EVID-001  
**主要文件**：`pages/benchmark-detail.mjs`、`layouts/article.mjs`、`content/benchmarks/**`

**实施**：

- 按第 10 节模板生成每个公开 benchmark 页面。
- P0 可先为全部条目生成结构页，对内容不足的标 beta/draft。
- 对至少 10 个高频 benchmark 写完整内容：MMLU/MMLU-Pro、GPQA Diamond、AIME、HumanEval、LiveCodeBench、SWE-bench Verified、Terminal-Bench、MMMU、HLE、BrowseComp（可按现有数据调整 ID）。
- 引用由 evidence 派生，不在 Markdown 重复维护。

**DoD**：

- 100% 公开卡片有详情 URL，全部返回 200。
- 10 个样板页完整度 ≥80。
- 页面有 quick facts、协议、分数、局限、复现、发布引用和 References。
- 0 引用页面仍完整解释 benchmark，不显示空白表。

---

#### [ ] P0-HOME-001 重构首页信息架构

**依赖**：P0-IA-001、P0-ENG-002、P0-DATA-002  
**主要文件**：`pages/home.mjs`、home styles

**实施**：

- 按第 7 节重写首屏、三入口、学习成果、四块路径、精选评估和可信度。
- 目录从超长平铺改为按部分折叠/分组。
- 所有统计动态生成。
- 增加“适合谁/不适合谁”。

**DoD**：

- 首屏在 360px 和 1440px 均清晰。
- 3 个核心入口可见、可键盘访问。
- 所有统计与构建数据一致。
- 目标读者 10 秒理解测试通过。

---

#### [ ] P0-BOOK-001 完成书籍阅读基础体验

**依赖**：P0-IA-001、P0-ENG-002  
**主要文件**：book layout、chapter template、book index

**实施**：

- 新增 `/book/` 学习入口。
- 章节页实现明确的响应式 3/2/1 栏策略。
- 增加章级元信息、学习目标、预计时长、最近核验。
- 修复 sticky header/anchor/focus、移动目录和上一/下一章。
- 首批为第 1、4、8、11、20、25、31 章补 front matter，用作迁移样板。

**DoD**：

- 指定 7 章展示完整元信息。
- 360px 无双侧栏和横向溢出；1440px 有全书目录/正文/页内目录。
- 目录抽屉焦点管理通过。
- 旧章节 URL 正确重定向或兼容。

---

#### [ ] P0-BUILD-001 建立“动手搭建”入口骨架

**依赖**：P0-IA-001、P0-ENG-002  
**主要文件**：`content/build/**`、`pages/build-index.mjs`

**实施**：

- 将第 19–31 章中的实战内容组织为任务导向入口，不复制正文。
- 显示四步路径：设计目标 → 建测试集 → 实现评分器 → 接入 CI。
- 每步链接章节、代码示例和最终 Capstone。

**DoD**：

- `/build/` 可用且不是空占位。
- 用户可从首页通过一次点击到达。
- 每个步骤至少有一条现有章节链接和明确产出。

---

#### [ ] P0-ROUTE-001 清理 URL、canonical、redirect 与 sitemap

**依赖**：P0-ENG-002、P0-DETAIL-001、P0-BOOK-001  
**主要文件**：route builder、redirect config、sitemap builder

**实施**：

- 生成 clean directory routes。
- 生成旧 `.html` 到新路由的永久重定向/兼容页。
- 为所有公开页面生成 canonical、sitemap、breadcrumb。
- 增加 404 和 orphan route 检查。

**DoD**：

- 旧链接不 404。
- canonical 不互相冲突。
- sitemap URL 与实际公开页面集合一致。
- 所有详情页可通过直接刷新访问。

---

#### [ ] P0-QA-001 建立 P0 CI 门禁

**依赖**：全部 P0 工程任务  
**主要文件**：`.github/workflows/**`、test scripts

**实施**：

- 接入内容、数据、证据、内部链接、构建、E2E、a11y。
- PR 展示生成页面数量、benchmark 数、verified evidence 数和失败摘要。
- 外部链接检查单独定时运行，避免网络波动阻断每次 PR；关键新来源在 PR 中即时验证。

**DoD**：

- P0 目标命令全部存在且在 CI 运行。
- 无 Schema、无详情路由、导航漂移、列数错误、serious axe 问题均能阻断 PR。
- CI 无密钥时可完整构建和测试。

---

### 21.2 P1 — 深化核心内容、完成主流厂商覆盖与端到端实战

#### [ ] P1-EVID-001 完成 Tier 1 厂商 24 个月发布清单

**依赖**：P0-EVID-001、P0-EVID-002  
**实施**：

- 为 12 家 Tier 1 厂商建立 release inventory。
- 每个发布状态只能是 `verified/no-benchmark/pending/inaccessible/out-of-scope`。
- 优先官方 release index、blog、model card、technical report。

**DoD**：

- 12 家都有覆盖记录、最后检查日期和缺口。
- 覆盖矩阵可从数据自动生成。
- “已检查率”与“含 benchmark 发布数”不混用。

---

#### [ ] P1-EVID-002 完成 Tier 1 官方证据抽取

**依赖**：P1-EVID-001  
**实施**：

- 对 inventory 中所有含 benchmark 的主要发布抽取 evidence。
- 重点覆盖通用、reasoning、coding/agent、多模态和轻量模型。
- 对图片表格做人工核验；保留修订历史。

**DoD**：

- 所有 `verified` release 的 benchmark 行都有 edge。
- public coverage 页面显示缺口，不以缺口阻止上线但不能隐藏。
- 抽样 30 条 evidence，来源定位成功率 100%。

---

#### [ ] P1-DETAIL-001 完成 Top 25 benchmark 深度页

**依赖**：P0-DETAIL-001、P1-EVID-002  
**选择原则**：厂商引用量、学习价值、类别代表性、当前活跃度。

**DoD**：

- 25 页完整度 ≥85。
- 每个类别至少有 2 个代表页面；不足时记录原因。
- 所有指标、协议和分数解释通过技术审阅。
- 每页至少链接一个书籍章节和一个相邻 benchmark。

---

#### [ ] P1-RELEASE-001 上线模型发布目录与详情页

**依赖**：P1-EVID-001  
**实施**：

- `/releases/` 支持厂商、能力、日期筛选。
- release 详情展示模型、官方来源、benchmark 清单、协议、归因和修订。
- 与 benchmark 页面双向链接。

**DoD**：

- 所有公开 verified release 有独立 URL。
- 页面不复制 benchmark 定义，只引用 canonical benchmark。
- 厂商、模型、发布三个概念在 UI 中明确区分。

---

#### [ ] P1-SEARCH-001 上线统一全站搜索

**依赖**：P0-DETAIL-001、P1-RELEASE-001  
**DoD**：

- `Cmd/Ctrl+K` 搜索章节、评估、发布、实战和术语。
- 搜索 SWE-bench、SWE Bench、swebench 均能返回 canonical 结果。
- 搜索结果可键盘完成。
- 搜索索引不阻塞关键页面首屏。

---

#### [ ] P1-BOOK-001 迁移全部章节 front matter 与学习门禁

**依赖**：P0-BOOK-001  
**实施**：

- 32 章全部补齐章级元信息。
- 建立章节前置关系和三轮阅读路径。
- 增加本地阅读进度与继续阅读。

**DoD**：

- 32/32 章通过 front matter Schema。
- 无无效前置章节或循环依赖。
- `/book/` 显示准确总时长、实操数和状态。

---

#### [ ] P1-CONTENT-001 审核第 1–7 章认知与 SOP 完整性

**依赖**：P1-BOOK-001  
**DoD**：

- 生命周期图覆盖训练与应用两条链路。
- SOP 每步都有输入/输出/角色/工具/风险/验收。
- Judge、人评、统计和元评估都有可运行示例。
- 初级前端测试读者不依赖外部 ML 课程可完成自测 ≥80%。

---

#### [ ] P1-CONTENT-002 审核第 8–18 章模型报告解读能力

**依赖**：P1-EVID-002、P1-DETAIL-001  
**DoD**：

- 每章至少一例协议差异、一例污染/饱和、一例不可比。
- 所有模型表格从结构化 evidence 派生或可追踪到来源。
- 不存在泛化“某厂商采用”而无 release 证据。
- 第 8 章提供完整报告阅读 checklist。

---

#### [ ] P1-FRAMEWORK-001 更新主流评估框架全景

**依赖**：P1-CONTENT-001  
**实施**：

- 按统一十维矩阵检查官方文档。
- 区分 benchmark runner、application eval、observability、red-team、vendor service。
- 提供最小运行示例和选型决策树。

**DoD**：

- 每个框架至少有官方文档、版本/核验日期、适合/不适合场景。
- 不使用营销排序。
- 示例代码在固定版本下可运行或有 fixture。

---

#### [ ] P1-CAPSTONE-001 实现 TypeScript Mini Evaluator

**依赖**：P1-CONTENT-001、P1-FRAMEWORK-001  
**DoD**：

- 按第 14 节目录交付。
- 无 API key 可跑 fixture；有 key 可替换 provider。
- 生成 4 类 artifacts。
- CI 能阻断已知退化并展示失败样本。

---

#### [ ] P1-CONTENT-003 审核第 19–31 章实战闭环

**依赖**：P1-CAPSTONE-001  
**DoD**：

- 所有关键代码链接到可运行文件，不重复维护易漂移大段代码。
- 三个案例均提供业务目标、数据、指标、rubric、运行、报告、门禁和失败回流。
- 第 31 章自测能覆盖全书三大结果能力。

---

#### [ ] P1-A11Y-001 完成 WCAG 2.2 AA 人工审阅

**依赖**：P0-QA-001、P1-SEARCH-001  
**DoD**：

- axe `serious/critical=0`。
- 完成纯键盘、200% 缩放、屏幕阅读器抽查、reduced motion 和高对比度检查。
- 问题与修复记录在 `docs/accessibility-audit.md`。

---

#### [ ] P1-PERF-001 建立性能预算与 Lighthouse CI

**依赖**：P0-QA-001、P1-SEARCH-001  
**DoD**：

- 首页、章节、目录、详情四类页面纳入 LHCI。
- Performance ≥90、Accessibility ≥95、SEO ≥95。
- Mermaid、搜索、图片不突破本文件预算。
- 性能回归能阻断 PR 或产生明确审批流程。

---

### 21.3 P2 — 全量覆盖、持续更新与长期可维护

#### [ ] P2-DETAIL-001 完成全部公开 benchmark 深度页

- 所有 active benchmark 完整度 ≥85。
- legacy/deprecated 页面仍解释历史价值与替代项。
- 无只有标题和一句话的公开详情页。

#### [ ] P2-EVID-001 扩展 Tier 2 厂商与重要开源模型

- 只在有一手资料时纳入。
- 使用同一覆盖政策与证据门禁。
- 不因数量目标降低证据等级。

#### [ ] P2-AUTO-001 自动发现新的官方发布

- 定时检查官方 release index/RSS/sitemap。
- 只自动创建 `pending` source candidate 和 Issue。
- 自动系统不得直接将来源发布为 `verified`。

#### [ ] P2-AUTO-002 自动来源健康与过期检查

- 定期链接检查、域名跳转检查、内容 hash 变化提醒。
- 重要来源变化自动创建复核任务。
- 保留最近成功核验和失败历史。

#### [ ] P2-AUTO-003 自动生成覆盖与新鲜度报告

- 首页与 methodology 的统计由同一 generated report 驱动。
- CI 输出 stale benchmark/release 列表。
- 可按厂商、类别、状态查看维护债务。

#### [ ] P2-UX-001 完成高级发现体验

- 对比 2–4 个 benchmark 的“测量/协议/指标/局限”页面。
- 收藏/最近浏览只存在本地。
- 提供“我该用哪个 benchmark”决策向导，结论必须链接到限制说明。

#### [ ] P2-SEO-001 完成结构化数据与社交卡自动化

- 验证 Breadcrumb/Article/Dataset 等 schema。
- 为章节与 benchmark 自动生成稳定 OG 图。
- sitemap 拆分、lastmod 来自真实内容更新。

#### [ ] P2-QA-001 建立长期视觉与内容回归

- 关键页面和极端 fixture 全量视觉快照。
- HTML、Schema、导航、内容完整度趋势可查看。
- PR 中显示截图差异和数据差异摘要。

#### [ ] P2-ADR-001 决定是否迁移站点框架

只有在 P0/P1 门禁稳定后编写 ADR，比较：

- 继续模块化自研生成器。
- VitePress。
- Astro 或其他静态内容框架。

ADR 必须提供 PoC、构建时间、bundle、路由兼容、Markdown 兼容、数据页能力和维护成本，不得凭偏好迁移。

---

## 22. 发布里程碑与 Gate

### Milestone A — 可信可用目录

必须完成：

- P0-IA-001
- P0-ENG-002
- P0-DATA-001/002
- P0-EVID-001/002
- P0-CATALOG-001/002
- P0-DETAIL-001
- P0-QA-001

Gate：

- 导航一致。
- 网格在规定视口正确。
- hover 引用为 0。
- 所有卡片有详情页。
- 至少 10 个深度 benchmark 页面。
- 6 个官方模型发布样板可审计。

### Milestone B — 学习产品完整

必须完成：

- P0-HOME-001
- P0-BOOK-001
- P0-BUILD-001
- P1-BOOK-001
- P1-CONTENT-001/002
- P1-DETAIL-001

Gate：

- 首页清晰表达目标、读者和三入口。
- 32 章元信息完整。
- Top 25 benchmark 深度达标。
- 初级前端读者完成核心自测。

### Milestone C — 能独立搭建评估体系

必须完成：

- P1-FRAMEWORK-001
- P1-CAPSTONE-001
- P1-CONTENT-003
- P1-SEARCH-001

Gate：

- Capstone 无密钥可运行。
- 读者可从业务目标走到 CI 报告。
- 书籍、评估、发布、实战可统一搜索和互链。

### Milestone D — 可持续证据库

必须完成：

- P1-EVID-001/002
- P1-RELEASE-001
- P2-AUTO-001/002/003

Gate：

- Tier 1 24 个月覆盖矩阵公开。
- 新发布可发现、待核验、人工确认、上线和更新。
- 来源失效与内容过期可自动提示。

---

## 23. 最终站点验收清单

### 23.1 首页

- [ ] 首屏明确站点是什么、写给谁、能学会什么。
- [ ] “系统学习”和“浏览评估大全”CTA 清晰。
- [ ] 三入口和四大块学习路径清晰。
- [ ] 统计由数据动态生成。
- [ ] 有公开可信度/来源规则入口。
- [ ] 手机和桌面无布局问题。

### 23.2 导航与路由

- [ ] 所有页面主导航恰好 3 项且顺序一致。
- [ ] Logo 回首页，active 有 `aria-current`。
- [ ] 旧 `.html` URL 不 404。
- [ ] clean URL、canonical、breadcrumb、sitemap 正确。
- [ ] 404 页面可返回核心入口。

### 23.3 书籍

- [ ] `/book/` 提供学习控制台而非直接丢进正文。
- [ ] 32 章均有时长、难度、前置、成果和核验日期。
- [ ] 桌面三栏、平板两栏、手机单栏合理。
- [ ] 章节锚点、目录、上一/下一章、阅读进度可用。
- [ ] 代码、表格、Mermaid、引用在暗色和移动端可读。
- [ ] 所有章节通过内容完整度门禁。

### 23.4 评估大全

- [ ] 规定视口显示 1/2/3/4 列。
- [ ] 卡片关键信息始终可见。
- [ ] 无 hover-only 引用和原地完整详情展开。
- [ ] 每张卡片进入独立详情页。
- [ ] 搜索、筛选、排序同步 URL。
- [ ] 空状态、0 引用、长标题和极端数量正常。

### 23.5 评估详情

- [ ] 定义、测量、不测量、数据、任务、协议、指标齐全。
- [ ] 分数含义和不可比较条件清晰。
- [ ] 版本、变体、污染、局限和复现齐全。
- [ ] 发布引用精确到厂商、模型、发布和证据位置。
- [ ] 每条引用显示来源等级、归因和核验日期。
- [ ] 关联章节、相邻 benchmark、完整 References 齐全。

### 23.6 厂商与证据

- [ ] Tier 1 厂商都有 24 个月 inventory。
- [ ] coverage matrix 公开显示已检查与缺口。
- [ ] 公开 verified evidence 没有泛化 release 名。
- [ ] 无 `score:"-"`。
- [ ] 第三方分数不伪装成厂商自报。
- [ ] 协议差异触发不可比较提示。
- [ ] 修订/撤回保留历史。

### 23.7 实战

- [ ] `/build/` 提供从目标到 CI 的路径。
- [ ] TypeScript Mini Evaluator 无密钥可运行。
- [ ] 有测试集、多个 scorer、judge 校准、slice、报告和 gate。
- [ ] 三个案例提供完整工程物料。
- [ ] 读者可以独立复刻到自己的项目。

### 23.8 质量

- [ ] `npm run validate` 通过。
- [ ] `npm run build` 通过。
- [ ] 内部死链 0。
- [ ] 关键外部来源死链 0 或有已批准状态。
- [ ] E2E、视觉、a11y、Lighthouse 通过。
- [ ] axe serious/critical = 0。
- [ ] LCP/INP/CLS 达标或有明确 field-data 改进计划。
- [ ] 无 TODO、undefined、空白详情和生成产物手改。

---

## 24. Agent 工作结果模板

每个任务完成时，在 PR/Issue 中使用：

```md
## Task
P0-CATALOG-001

## Baseline
- branch: feat/...
- based on: main@<sha>

## Changed
- source files:
- generated routes:
- data migrations:
- evidence added/changed:

## Acceptance
- [x] requirement 1
- [x] requirement 2

## Commands
- `npm run validate` — PASS
- `npm run build` — PASS
- `npm run test:e2e` — PASS
- `npm run test:a11y` — PASS

## Visual verification
- 360px:
- 768px:
- 1024px:
- 1440px:

## Evidence verification
- source tier:
- exact release/model:
- locator:
- last verified:

## Risks / remaining gaps
- ...
```

---

## 25. 研究与来源清单

> 此清单用于启动核验，不代表其中每个页面的所有内容都已被本站采纳。Agent 必须打开原始页面、记录定位和核验日期，不能只复制 URL。

### 25.1 项目基线

- Repository: https://github.com/zenHeart/evals
- Main branch: https://github.com/zenHeart/evals/tree/main
- Audit commit: https://github.com/zenHeart/evals/commit/4e9dc59d5138462da4b38630f4b5cf6fdb81fdf8
- Live home: https://evals.zenheart.site/
- Current catalog: https://evals.zenheart.site/benchmarks/index.html

### 25.2 官方模型发布证据种子

#### 国际厂商

- OpenAI GPT-5.6: https://openai.com/index/gpt-5-6/
- Anthropic Claude Opus 4.6: https://www.anthropic.com/news/claude-opus-4-6
- Anthropic Claude Opus 5: https://www.anthropic.com/news/claude-opus-5
- Google Gemini 3: https://blog.google/products-and-platforms/products/gemini/gemini-3/
- Google Gemini 3 Deep Think: https://blog.google/products-and-platforms/products/gemini/gemini-3-deep-think/
- xAI Grok 4.6: https://x.ai/news/grok-4-6
- Mistral Devstral 2: https://mistral.ai/news/devstral-2-vibe-cli/
- Mistral 3: https://mistral.ai/news/mistral-3/
- Meta AI blog discovery root: https://ai.meta.com/blog/

#### 国内厂商

- Kimi K3: https://www.kimi.ai/blog/kimi-k3
- Kimi K2 Thinking: https://www.kimi.ai/blog/kimi-k2-thinking
- DeepSeek V4-Flash-Vision-Exp: https://api-docs.deepseek.com/zh-cn/news/news260821
- DeepSeek updates index: https://api-docs.deepseek.com/zh-cn/updates/
- Z.ai GLM 5.3: https://z.ai/blog/glm-5.3
- 用户指定 GLM 5.3 Flash 种子：https://z.ai/blog/glm-5.3-flash
  - 状态要求：页面抓取不可读或名称关系未确认时必须 `pending/manual_review`；不得与 GLM 5.3 自动合并。
- MiniMax model release index: https://platform.minimax.io/docs/release-notes/models
- Qwen3: https://qwenlm.github.io/blog/qwen3/
- Qwen3-Coder: https://qwenlm.github.io/blog/qwen3-coder/
- ByteDance Seed2.1: https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity
- ByteDance Seed1.8: https://seed.bytedance.com/en/blog/official-release-of-seed1-8-a-generalized-agentic-model

### 25.3 标准与 Web 质量

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI WCAG 2.2 changes: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- Core Web Vitals: https://web.dev/articles/vitals
- LCP guidance: https://web.dev/articles/optimize-lcp
- MDN CSS Grid `repeat()`: https://developer.mozilla.org/docs/Web/CSS/repeat
- Google Breadcrumb structured data: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Google structured data overview: https://developers.google.com/search/docs/appearance/structured-data
- Schema.org Book: https://schema.org/Book
- Schema.org TechArticle: https://schema.org/TechArticle
- Schema.org Dataset: https://schema.org/Dataset
- Schema.org BreadcrumbList: https://schema.org/BreadcrumbList
- JSON Schema: https://json-schema.org/

### 25.4 工程工具候选

- Ajv: https://ajv.js.org/
- markdown-it: https://github.com/markdown-it/markdown-it
- unified: https://unifiedjs.com/
- Playwright: https://playwright.dev/
- axe-core: https://github.com/dequelabs/axe-core
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- html-validate: https://html-validate.org/
- Lychee link checker: https://github.com/lycheeverse/lychee

### 25.5 评估方法与框架官方入口候选

- OpenAI Evals guide: https://platform.openai.com/docs/guides/evals
- Anthropic evaluation documentation: https://docs.anthropic.com/en/docs/test-and-evaluate/overview
- Google Vertex AI generative evaluation: https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-overview
- Inspect AI: https://inspect.aisi.org.uk/
- lm-evaluation-harness: https://github.com/EleutherAI/lm-evaluation-harness
- Ragas: https://docs.ragas.io/
- DeepEval: https://deepeval.com/
- Promptfoo: https://www.promptfoo.dev/
- LangSmith evaluation: https://docs.langchain.com/langsmith/evaluation
- Langfuse evaluation: https://langfuse.com/docs/evaluation/overview

---

## 26. 最终退出标准

本 GOAL 只有在以下结果同时成立时才算完成：

1. 一个完全不懂 LLM Eval 的初级前端工程师，能从首页选择路径并持续读完整本书。
2. 他能解释评估在训练、后训练、发布和应用迭代中的价值与标准流程。
3. 他看到任意主流模型发布的 benchmark 表，能知道每个评估测什么、分数是什么意思、哪些协议决定它能否比较。
4. 他能在评估大全中快速找到词条，并进入结构严密、证据可追溯的独立详情页。
5. 每个公开模型引用都能回答：哪个厂商、哪个模型、哪次发布、哪个 benchmark 版本、什么分数、什么协议、原文在哪里。
6. 他能运行仓库中的 TypeScript Mini Evaluator，为自己的应用建立测试集、评分器、报告和 CI 门禁。
7. 站点在信息架构、移动端、键盘、暗色模式、SEO、性能和可维护性上达到生产级文档站标准。
8. 新模型、新 benchmark 和来源变化可以通过可审计流程持续进入站点，而不会再次退化成手工散落文案。

**最终产品不是“有很多评估名词的一本书”，而是一条完整能力链：建立认知 → 理解方法 → 查清证据 → 看懂发布 → 独立实践 → 持续维护。**
