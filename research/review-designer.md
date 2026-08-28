# 设计师视角评审

- 评审人设：产品/内容设计师（文档型产品与知识库设计视角）
- 评审日期：2026-08-29（凌晨）
- 评审方式：Playwright 实测（桌面 1280×800 + 移动 375×700），对照 `scripts/build-web.mjs`、`scripts/build-benchmarks-hub.mjs`、`dist/styles.css` 源码
- 重要前提：**评审期间站点发生了至少一次重新部署**（旧版 hub 是"卡片平铺+厂商竖排"，新版是"摘要卡+点击展开"；导航从「评估大全/框架工具」变为 hub 页「开始阅读」）。下述结论均已在新版部署上二次复验，旧版证据的截图会单独标注。

## 实测覆盖的 URL 与交互

| URL | 结果 |
| --- | --- |
| `https://evals.zenheart.site/`（及 http 版） | 正常；http 现已 301 到 https（评审开始时 https 证书报 `ERR_CERT_COMMON_NAME_INVALID`，见截图 05，约 1 小时后签发生效） |
| `/web/chapter-01.html` | 面包屑/sticky TOC/scrollspy/上一章下一章/复制/暗色 全部实测 |
| `/web/chapter-03.html`（最大章 76KB） | 移动端溢出实测（旧版溢出 840px，**新版已修复** 360=360） |
| `/benchmarks/index.html` | 65 张卡、10 个类目 chip、3 种排序、卡片展开/收起、筛选联动统计行 |
| `/research/benchmarks.html`、`/research/frameworks.html` | 49,067px / 60,536px 超长页，无目录锚链接 |
| `/research/site-content-review.html`、`/research/audit-junior-perspective.html`、`/research/outline-design.html` | **HTTP 200，内部评审文档公开可访问** |
| `/evals.epub` | HEAD 200，可下载 |
| `/no-such-page-xyz` | GitHub Pages 默认 404，无定制页 |

交互实测：搜索（置信区间 / SWE-bench / pass@k / Elo / 无匹配词）、主题切换+localStorage 持久化+OS 暗色偏好首载、复制按钮、自测卡展开、TOC scrollspy、hub chip 筛选、排序下拉、卡片展开/收起。

## 总评分（1-10）：6.5/10

- 信息架构：8/10
- 阅读动线：8/10
- 视觉层级：7/10
- 交互反馈：6/10
- 移动端：5/10

## 实测记录

### 首页（截图 01、02、09、15、21）

- 30 秒理解测试通过：眉题「ZenHeart · Eval Handbook」→ 渐变大标题 → 一句话定位（"从前端工程师视角看 Eval…"）→ 路径预告「32 章 · 学术史 → 方法论 → 厂商报告拆解 → 框架实战」→ 搜索框（带示例查询）→ 按 7 个部分分组的章节列表。信息密度与层级是对的。
- 「第 0 部分：术语速查（建议先读）」是好的信息架构决策——给了新读者明确的入口。
- 章节列表双栏（≤720px 单栏）、章节号蓝色等宽字体，扫读效率高。
- 封面图写死「28 章 · 6 个部分」，页面实际是 32 章 · 7 个部分（hero 文案是对的）——同屏矛盾（截图 15、21 右上角可同时看到两处）。
- 搜索：输「置信区间」返回 8 条，下拉含章节名+部分名+摘要高亮。但摘要质量差——表格单元格被压成一串碎片（实测片段："…词序惩罚 0 1 翻译 BERTScore 语义相似度 0 1 通用 pas…"，见截图 15）。**占位符建议的「SWE-bench」搜出来是「无匹配结果」**（索引生成时 `-` 被当作 markdown 符号删掉，内容里是「SWE bench」；且每章只索引前 4000 字符，第 03 章只覆盖约 8%）。
- 章节标题冒号不一致：第 13/15 章是半角「:」，其余是全角「：」（搜索下拉里可见）。

### 章节页（截图 03、07、08、10）

- 阅读动线完整：面包屑「首页 / 第 1 部分：评估的世界观（4 章）/ 第 1 章」→ 右侧 sticky TOC（top:76px，带 IntersectionObserver 高亮，实测滚动后正确跟随）→ 文末「← 上一章 / 下一章 →」带章节名 → 页脚。长章（ch03 实测 22,249px 高、13 个 H2）不迷路。
- 「验收自测」quiz 卡：虚线边框卡片 +「👆 点击展开自测（先作答再对照）」按钮，点击后展开、按钮消失。反馈清晰，但只能展开不能收起。
- Mermaid 正常渲染为 SVG（jsdelivr CDN）；但时间线图横向极宽（截图 13），移动端要横向滚很久。
- 代码复制：HTTPS 下点击可写入剪贴板、按钮变「已复制 ✓」1.5 秒后还原。但实现无 `.catch` 无兜底——HTTP（非安全上下文）下 `navigator.clipboard` 为 undefined，点击抛 TypeError、无任何反馈（评审早间在 http 下实测拿到控制台报错）；且按钮默认 `opacity:0` 仅 hover 显示，CSS 无 `:focus` 规则——键盘用户不可见。
- 暗色模式：点击切换正常（背景 #fdfdfb→#0b1224，🌙→☀️，localStorage 记忆，刷新保持，截图 07）。**但 OS 暗色偏好的用户首次打开是"半暗"状态**：内联脚本只设了 `html[data-theme]`（body 背景变暗），`body.dark` 类只有在手动点击后才加上——实测首载时 topbar 仍是白底（rgba(253,253,251,.94)）、H2/TOC 链接仍是亮色主题蓝 #2563eb（截图 08 顶部白条非常显眼）。

### 评估大全汇集站（截图 04 旧版 / 16、17、18、19 新版）

- 信息架构是这个站点最强的部分：10 个类目 chip 全部带数量（9+9+10+10+7+3+7+6+4=65，与总数吻合）、默认按厂商引用量倒排（#1 GPQA 11 家 → #2 AIME 9 → #3 MMLU 8 → #4 SWE-bench 7，排序正确）、统计行「共 65 个评测 · 数据更新于 2026-08-28…」随筛选实时更新（点「代码与工程」后变「共 10 个评估体系」，实测卡片数同步为 10）。
- 新版卡片：折叠态给「测什么 / 分数含义」两行 +「▼ 点击卡片展开：评分协议 / 采用详情 / 原文链接」，展开/收起双向可用（实测 148px↔752px）。
- 展开后的厂商采用记录是**一行一个厂商**（OpenAI/Anthropic/…各占 ~38px 高的整行），GPQA 卡展开后 752px 高——11 家厂商占 400+px，65 张卡扫读"谁引用了谁"成本很高（截图 18）。
- **移动端 375px 横向溢出未修复**：`document.scrollWidth` 871px vs 视口 360px，罪魁是超长说明文字（".cp-none"元素"暂无官方发布引用——社区驱动或垂域使用…"右边缘到 871px，实测 121 个元素溢出，截图 11 为旧版、新版复测同样溢出）。`body{overflow-x:hidden}` 只是把滚动条藏掉，内容照样被裁切。
- 卡片是 `<div>` 点击展开：无 `tabindex`、无 `role`、无 `aria-expanded`——键盘用户完全无法展开。
- 「N 家引用」badge 用了 `cursor:help` 但没有 title/tooltip——死交互暗示。
- **topbar 与书页不一致**：hub 自带一份 topbar 模板（build-benchmarks-hub.mjs 内联），导航是「首页 / 开始阅读 / 基准图谱 / 下载 EPUB」，而书页/研究页是「首页 / 评估大全 / 基准图谱 / 框架工具 / 下载 EPUB」（截图 18 vs 20 顶部可见）。同一站点两套导航，两个 builder 各自维护一份 topbar+CSS 副本。

### 研究页（截图 06、20）

- 「基准图谱」49,067px 高（约 49 屏）、「框架工具」60,536px 高、51 个 H2——**目录是一段纯文本列表，不可点击**（页面上 `a[href^="#"]` 数量为 0，而 H2 的 `sec-N` id 其实都已生成，基础设施在、只差渲染），无面包屑、无上一章下一章。读者在这两页必然迷路。
- 页面上有裸露的「---」字面量渲染残留（截图 20，「目录」标题下方）。
- **内部工作文档被公开发布**：`/research/site-content-review.html`、`/research/audit-junior-perspective.html`、`/research/outline-design.html`、`/research/book-structures.html`、`/research/missing-benchmarks.html` 均 200 可访问。`build-web.mjs` 的 `researchPage()` 会把 `research/*.md` 全量构建上线——包括评审文档；本文件（review-designer.md）在下一次构建后也会公开。

### 移动端 375px 汇总（截图 09、10、11、19）

- 首页：无横向溢出（360=360）、H1 34px 单行、hero 纵排正常 ✓。
- 章节页：旧版全页溢出到 840px（正文每行都被裁切，截图 10）；**新版部署已修复**（复测 360=360，`table-wrap` 内部滚动正常）。表格 `min-width:480px` + `.table-wrap` 横向滚动的方案是对的。
- hub：仍溢出 871px（见上）。
- sticky topbar 在 375px 下 flex-wrap 成 3–4 行（约 160–180px 高）且保持 sticky，吃掉约 1/4 视口（截图 19）。
- TOC 侧栏 ≤1080px 直接 `display:none`，移动端长章节没有任何"跳到本节"手段，也没有返回顶部。

### 可访问性快速检查

- `lang="zh-CN"`、viewport、H1 唯一、原生 `<button>` chip、搜索框 `aria-label`、复制按钮 `aria-label` ✓。
- 对比度实测计算：「← 上一章 / 下一章 →」小标签与页脚 `#94a3b8` on `#fdfdfb` = **2.52:1**（WCAG AA 需 4.5:1，不达标）；面包屑/TOC `#64748b` = 4.67:1（过）；暗色 TOC `#94a3b8` on `#0b1224` = 7.27:1（过）。
- hub 卡片键盘不可达（见上）；chip 无 `aria-pressed` 表达筛选态。
- 外链统一 `target="_blank" rel="noopener"` ✓；print 样式隐藏 topbar/TOC/复制按钮 ✓。

### 品牌与分发细节

- favicon.svg 存在（柱状图标，与 hero 配色一致）✓；EPUB 下载动线完整（导航+页脚+正文三处入口，200 OK）✓。
- **每页 canonical 都写死为 `https://evals.zenheart.site/`**（`COMMON_HEAD` 常量），章节页 canonical 全部指向首页；无 og:image、无 twitter card——分享到社交平台/IM 时没有封面图。

## 问题清单

### P0（阻断/明确损害）

| # | 问题 | 证据 |
| --- | --- | --- |
| P0-1 | hub 汇集站移动端横向溢出：375px 下 scrollWidth 871px，长说明文字不可断行，正文被裁切 | 截图 11/19；DOM 实测 `.cp-none` right=871 |
| P0-2 | 搜索核心承诺失效：占位符示范词「SWE-bench」返回「无匹配结果」；每章只索引前 4000 字符（ch03 仅约 8% 可搜）；`-` 被删除导致英文术语匹配失败 | 实测搜索；`build-web.mjs` L689 正则 `[#>*|`\[\]()-]` + `.slice(0,4000)` |
| P0-3 | 内部评审/审计文档公开发布在 `/research/*.html`（site-content-review、audit-junior-perspective、outline-design、book-structures、missing-benchmarks 均 200） | HTTP 200 实测；`researchPage()` 全量构建 `research/*.md` |
| P0-4 | 全站 canonical 写死为首页 URL；无 og:image/twitter card——章节页 SEO 权重归拢到首页、社交分享无图 | `build-web.mjs` L426 |

### P1（明显）

| # | 问题 | 证据 |
| --- | --- | --- |
| P1-1 | OS 暗色偏好用户首载"半暗"：`body.dark` 只在点击后才加，首载只有 body 背景色被内联补丁盖住，topbar 白条+亮色组件混排 | 截图 08；`COMMON_HEAD` 内联脚本只设 `data-theme` |
| P1-2 | 研究页 49k–60k px 超长且不可导航：目录是纯文本（锚链接 0 个，H2 id 已生成未使用）、无面包屑无上下章 | `/research/frameworks.html` DOM 实测 |
| P1-3 | hub 卡片键盘不可达：div 点击展开，无 tabindex/role/aria-expanded | DOM 实测 |
| P1-4 | 移动端 sticky topbar 折成 3–4 行（~160px+）常驻 | 截图 19 |
| P1-5 | 复制按钮无失败兜底（`.catch`）、`opacity:0` 仅 hover 可见且无 `:focus` 规则——非安全上下文静默失败、键盘用户不可见 | 控制台 TypeError 实测；`styles.css` L309–315 |
| P1-6 | hub 展开卡"一行一个厂商"：GPQA 展开后 752px，扫读引用关系成本高 | 截图 18 |
| P1-7 | 封面图「28 章 · 6 个部分」与实际「32 章 · 7 部分」同屏矛盾 | 截图 15/21 |
| P1-8 | 两套 topbar/导航（hub builder 内联副本 vs build-web），标签不一致（开始阅读 vs 评估大全、缺 框架工具） | 截图 18 vs 20；`build-benchmarks-hub.mjs` L151–155 |

### P2（打磨）

- Mermaid 暗色模式下仍是白底盒子（截图 14），且时间线横向过宽、依赖 jsdelivr CDN（国内失败时显示原始代码文本）。
- 「← 上一章」标签与页脚 #94a3b8 对比度 2.52:1。
- 搜索摘要把表格单元格压成碎片文本，读不懂。
- 第 13/15 章标题半角冒号，与全站全角冒号不一致。
- 无自定义 404 页。
- 「N 家引用」badge `cursor:help` 无 tooltip。
- chip 筛选无 `aria-pressed`。
- 内容深度断崖：第 18–29 章源文件 8–12KB，而第 01–17 章 20–55KB，读者能感觉到后半本"变薄"。
- 自测卡只能展开不能收起；任务清单勾选状态不持久化。
- 裸露「---」字面量渲染残留（基准图谱页）。

## 值得保留的设计决策（别改坏的）

1. **首页 7 部分分组 + 「第 0 部分：术语速查（建议先读）」入口**——30 秒理解全书的动线是成立的，别重构成卡片墙。
2. **章节页"面包屑 + sticky TOC + scrollspy + 上一章/下一章"闭环**——完整、克制、无动画噪音，是全站最好的阅读动线实现。
3. **hub 的"类目 chip 带计数 + 引用量倒排 + 统计行实时联动 + 卡片展开/收起"**——筛选-排序-统计的反馈链是同类汇集站的正确形态。
4. **暗色切换的 localStorage 记忆 + 首屏内联 `data-theme` 预置脚本**（防 FOUC 的思路是对的，只是补丁只盖了 body 背景）。
5. **表格 `.table-wrap` 横向滚动 + `min-width:480px`**、`overflow-wrap/word-break` 对 CJK+英文混排的处理。
6. **静态零依赖架构**（无框架、单 CSS、构建即产物）——加载快、可维护，别为了动画引入运行时。
7. 语义化底子（lang、viewport、aria-label、原生 button、外链 rel=noopener、print 样式）。
8. EPUB 三处入口 + 下载即用的离线动线。

## 改进建议（附具体方案）

1. **修 hub 移动端溢出（P0-1）**：在 `build-benchmarks-hub.mjs` 的内联 CSS 给 `.card`、说明类元素加 `overflow-wrap:anywhere; word-break:break-word`，并给 flex/grid 子项加 `min-width:0`；根治办法是 hub 页也复用 `body{overflow-x:hidden}` 之外真正的约束（`overflow-x:hidden` 只是遮羞）。
2. **修搜索（P0-2）**：① 索引正则不再删 `-`（或对查询与索引同时做 `-`→空格归一化）；② 去掉 `.slice(0,4000)`，把每章按 H2 分片、每片一条索引记录（`search-data.js` 会变大，32 章全文本 gzip 后预计 <300KB，可接受）；③ 摘要来源改用章节正文段落而非表格碎片。
3. **研究页止损（P0-3 + P1-2）**：`researchPage()` 改为白名单构建（只构建 benchmarks/frameworks/academic-history/methodology-deep/vendor-blog-evals/framework-practice 六个映射键）；评审类 md 移出 `research/`（如 `docs/internal/`，不进 dist）；同时给 researchPage 接上现成的 `tocSide(sections)`（H2 id 已生成）+ 面包屑。
4. **SEO/分享（P0-4）**：`COMMON_HEAD` 的 canonical 改为传参 `rel + path`；新增 1200×630 `og-cover.png`（可从 hero 截图导出）并补 `og:image` + `twitter:card summary_large_image`。
5. **暗色首载（P1-1）**：在内联预置脚本里同步 `document.body ? document.body.classList.add('dark')`（DOMContentLoaded 前用 `document.addEventListener('readystatechange')` 或把补丁规则改为 `html[data-theme="dark"]` 选择器全量替换 `body.dark`）。
6. **复制按钮健壮性（P1-5）**：`navigator.clipboard.writeText(...).catch(fallbackTextareaExecCommand)`；CSS 增加 `.copy-btn:focus-visible{opacity:1}`。
7. **hub 卡片可达性（P1-3）**：`card-head` 改为 `<button aria-expanded="false" aria-controls="…">`，展开态 JS 同步 `aria-expanded`。
8. **厂商列表紧凑化（P1-6）**：一行一个 → `display:flex; flex-wrap:wrap; gap:8px` 的 chip 流（旧版平铺已有雏形），预计卡片高度从 752px 降到 ~300px。
9. **统一 topbar（P1-8）**：把 `TOPBAR()` 抽成两个 builder 共享的模块（`scripts/site-chrome.mjs` 导出模板字符串），导航标签一处定义。
10. **封面图重生成（P1-7）**：`book/cover/cover.svg` 的「28 章 · 6 个部分」改由构建时注入（或删掉数字只留书名），避免再次过期。
11. **移动端 topbar（P1-4）**：`@media (max-width:720px)` 下 topbar 改为非 sticky，或把导航链接收进 `<details>` 摘要行。
12. **对比度（P2）**：`--muted` 类色值 `#94a3b8`（亮色场景）统一提到 `#64748b`。
13. **Mermaid（P2）**：`mermaid.initialize({ theme: document.documentElement.getAttribute('data-theme')==='dark' ? 'dark' : 'neutral' })`；时间线图改 `flowchart TD` 或容器限宽；长期考虑自托管 mermaid 以摆脱 CDN。
14. **内容侧（P2）**：第 18–29 章按第 01–17 章的密度补齐（这属于内容设计债，站点层面至少可在首页对后半部分不做特殊暗示）；标题冒号统一为全角。

## 附：截图索引（`research/shots/`）

| 文件 | 内容 |
| --- | --- |
| 01-home-desktop-top.png | 首页 hero（桌面） |
| 02-home-desktop-chapterlist.png | 章节分组列表 + 搜索下拉（桌面） |
| 03-ch01-desktop-top.png | 章节页面包屑 + sticky TOC（桌面） |
| 04-benchmarks-desktop-top.png | hub **旧版**（评审期间的部署版本，含误输入的筛选词） |
| 05-https-cert-error-invalid.png | 评审早间 https 证书错误（后已签发修复） |
| 06-research-benchmarks-desktop.png | 研究页（旧导航版本） |
| 07-ch01-darkmode.png | 手动切换暗色后的正确渲染 |
| 08-ch01-dark-freshload-broken.png | **OS 暗色偏好首载半暗状态**（topbar 白条） |
| 09-home-mobile-375.png | 首页 375px |
| 10-ch03-mobile-top.png | **旧版**章节页 375px 溢出证据（新版已修复，未截新图） |
| 11-benchmarks-mobile.png | hub 375px 溢出证据（旧版；新版复测仍 871px） |
| 13/14-mermaid-light/dark.png | Mermaid 亮/暗渲染对比 |
| 15-home-search-dropdown.png | 搜索下拉（摘要碎片化 + 封面"28 章"同屏证据） |
| 16/17-benchmarks-desktop-clean.png | hub **新版**折叠卡片 |
| 18-hub-card-expanded.png | hub 展开卡（厂商一行一条） |
| 19-hub-mobile-current.png | hub 375px（topbar 折 4 行） |
| 20-research-benchmarks-current.png | 研究页纯文本目录 + 裸「---」 |
| 21-home-current.png | 首页最终版本 |
