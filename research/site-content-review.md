# evals.zenheart.site 深度审查报告

> 审查日期：2026-08-28
> 审查方式：Playwright 实测站点（桌面 1280px + 移动 375px）、EPUB 解包验证、源码逐行核对、交叉引用排查
> 审查范围：站点体验、内容质量、EPUB 质量、CI 部署链路

---

## 总体结论

站点已上线且功能完整（9/9 关键资源 200，EPUB 结构有效，CI 全自动），但存在 **3 个站点体验问题、3 个内容 P0 问题、3 个 EPUB 规范问题** 需要修复。内容主体质量良好：32 章齐全、表格 15/15 对齐、术语/Cheat Sheet/5 错误小节完整。

**评分：站点体验 6.5/10 · 内容质量 8/10 · EPUB 质量 6/10**

---

## 一、站点体验问题（Playwright 实测）

### P0-1：HTTPS 证书未签发【阻塞】

```
http://evals.zenheart.site/  → 200 ✅
https://evals.zenheart.site/ → 连接失败 ❌
GitHub Pages cert 状态: null（pending）
DNS（Google DNS）: evals.zenheart.site → zenheart.github.io ✅ 已传播
```

- CNAME 已配置且 DNS 已全球传播，但 Let's Encrypt 证书尚未签发（已等待约 40 分钟；GitHub 官方口径最长 24h）
- **行动**：等待；若 24h 后仍未签发，检查 CNAME 记录值是否严格为 `zenheart.github.io`（不带协议/斜杠），并在 Settings → Pages 强制重新验证

### P0-2：favicon 404【体验】

- 控制台报错：`GET /favicon.ico 404`
- 全站无 favicon，浏览器标签页显示默认图标
- **行动**：从 cover.svg 派生一个 favicon.svg/png 放入 dist 根目录，并在页面 head 加 `<link rel="icon">`

### P0-3：移动端横向溢出【体验】

375px 视口实测（chapter-09）：

```
body scrollWidth: 452px > viewport 360px  → 整页横向滚动
Table 9: 428px > 360px
P 元素: 396px（长英文串未断行）
PRE 元素: 404px / 415px / 517px
```

- 触发原因：长无空格英文串（如 `Terminal-Bench/SWE-Lancer/Cybench/...` 标题）+ 宽表格无滚动容器
- **行动**：
  1. `body { overflow-x: hidden }` 或 `word-break: break-word` 兜底
  2. 表格包一层 `overflow-x: auto` 容器
  3. H1 移动端字号已 clamp 但 6 行换行仍占屏一半，可再降 clamp 上限

### P1-4：首页丢失「7 部分」结构

- 32 章平铺两列，「第 0 部分～第 7 部分」的分组信息只存在于 metadata.yaml 和 EPUB nav 中，Web 首页没有
- **行动**：build-web.mjs 的 indexPage 读 metadata.yaml 的 part 结构，按部分分组渲染

### P1-5：首页无封面

- cover.svg 已部署且可用（/cover.svg 200），但 hero 区纯文字
- **行动**：hero 右侧放 cover.svg（参考 CI 旧版 index 的布局）

### P1-6：SEO meta 全站缺失

```
index.html:  仅 charset + viewport，无 description/og/canonical
chapter-*.html: 同上
research/*.html: 同上
```

- **行动**：build-web.mjs 每页注入 `<meta name="description">`（取章节首段）+ og:title/og:description + canonical

### P1-7：导航信息架构弱

- 章节页只有「上一章 / 目录 / 下一章」，无当前所属部分提示、无页内 TOC（长章节如 chapter-30 有 30+ 屏）
- 无站内搜索
- **行动**（按优先级）：章节页顶部加「第 X 部分 · 第 N 章」面包屑；侧栏页内 TOC；搜索可后置

---

## 二、内容问题

### P0-8：交叉引用过期（章节重排遗留）【准确性】

章节从 28 → 32 重排后，正文引用未同步，共 4 处错误 + 1 处部分错误：

| 位置 | 现文 | 应为 |
|---|---|---|
| chapter-00 L121（RAG 词条） | 详见：第 17 章 | 第 20 章 |
| chapter-00 L238（Retrieval 词条） | 详见：第 11 章 | 第 20 章 |
| chapter-11 L248 | 详见第 19-20 章 | 第 22-23 章 |
| chapter-16 L343 | 参考第 14 章 | 第 17 章 |
| chapter-00 L230（Agent 词条） | 第 9 章 | 第 9、10 章（内容横跨两章）|

其余 13 处引用（第 1-8 章区间内）经核对仍然正确。

### P0-9：ch00「全书术语地图」整表过期

`0.5 全书术语地图` 仍是 28 章旧结构（`24-26 实战案例`、`27-28 资源自测`），与现 32 章 7 部分完全对不上。这是读者第一站，错误地图杀伤力最大。

### P0-10：ch01 代码示例缺运行前提

30 行 TypeScript 示例直接 `import OpenAI from "openai"` 并调用 API，但：

- 全章无 `npm install openai` 说明
- 全章无 `OPENAI_API_KEY` 环境变量提示（全书首次出现 API key 是第 17 章！）
- 初读者复制运行第一段代码就会报错，违反本书「每章 Try It 可立即执行」承诺

### P1-11：SFT 术语未收录

- ch02 L35 出现「SFT/RLHF」，ch00 术语表只有 RLHF（#18），SFT 缺失
- **行动**：ch00 进阶术语区补一条（SFT ≈ 用「标准问答范例」做岗前培训，RLHF 之前的步骤）

### P1-12：H3→粗体转换损失语义

此前为过校验将大量 H3 转为 `**粗体段落**`（如 ch31 的 20 道自测题、FAQ 标题）。后果：

- 粗体行无法进 TOC、无锚点、屏幕阅读器不识别层级
- ch31 实测 11 处 orphan bold 段落
- **行动**：validate.js 的 H3 规则放宽为允许 `### N.M.K` 或章内独立编号（如 `### Q1`），把语义还回去

### P1-13：代码块 lang class 为空

- 所有 `<pre><code class="lang-">` 的 lang 为空字符串（build 脚本未把 fence 语言传给 class）
- 影响未来接 highlight.js/prism 的扩展性
- **行动**：web 与 epub 两个生成器都把语言写入 class（book 侧 fence 语言是齐全的）

---

## 三、EPUB 质量问题

### P0-14：styles/book.css 未在 OPF manifest 声明【规范违规】

```
ZIP 内存在: styles/book.css ✅
OPF manifest: 无此条目 ❌（grep -c "css" content.opf = 0）
各章 xhtml: <link href="../styles/book.css"> 引用了它
```

- EPUB 规范要求所有引用资源必须在 manifest 声明；Apple Books/Calibre 严格模式下会告警，部分阅读器直接忽略样式
- **行动**：preprocess.js 生成 content.opf 时补 `<item id="css" href="styles/book.css" media-type="text/css"/>`

### P1-15：无封面 HTML 页

- cover.svg 已声明 `properties="cover"`（元数据层封面），但 spine 无 cover.xhtml
- 部分阅读器（KindleSend、老版 Calibre）只认 spine 首页封面
- **行动**：生成 cover.xhtml（内嵌 SVG）并插入 spine 首位

### P1-16：目录无「部分」层级

- nav.xhtml 与 toc.ncx 均为 32 章平铺，7 个 part 丢失
- EPUB3 nav 支持嵌套 `<ol>`，ncx 支持嵌套 navPoint
- **行动**：preprocess.js 按 metadata.yaml 的 part 生成两级目录

---

## 四、审查中排除的疑似问题（实为正确）

| 疑似问题 | 结论 |
|---|---|
| build-web.mjs inlineMd 占位符把数字替换成 undefined | **误判**。实际实现用 `\x01` 控制字符作占位符定界符（od 十六进制确认），普通数字不受影响；Read 工具显示时控制字符不可见导致误读 |
| frameworks.html 渲染后 0 张表格 | **正常**。frameworks.md 源文件本就用 H3+列表组织，无 markdown 表格 |
| benchmarks.html 检出「表格分隔符泄漏」 | **误判**。那是代码块内故意展示的「厂商报告原表」示例 |
| EPUB XHTML 无效 | **误判**。32 章抽查 XML 解析全部通过 |

---

## 五、修复优先级路线图

| 优先级 | 项 | 工作量 |
|---|---|---|
| P0 | 等待/排查 HTTPS 证书（#1） | 等待 + 可能的 DNS 复查 |
| P0 | 修 4+1 处过期交叉引用（#8） | 10 分钟 |
| P0 | 重写 ch00 术语地图为 32 章版（#9） | 10 分钟 |
| P0 | ch01 补 npm install + API key 前提（#10） | 10 分钟 |
| P0 | EPUB manifest 补 CSS 声明（#14） | 5 分钟 |
| P0 | favicon + 移动端溢出修复（#2 #3） | 30 分钟 |
| P1 | 首页按部分分组 + 封面图（#4 #5） | 40 分钟 |
| P1 | 全站 SEO meta（#6） | 30 分钟 |
| P1 | EPUB 封面页 + 两级目录（#15 #16） | 40 分钟 |
| P1 | SFT 词条 + H3 语义恢复 + lang class（#11 #12 #13） | 1 小时 |
| P2 | 面包屑 / 页内 TOC / 搜索（#7） | 半天起 |

---

## 六、实测数据存档

```
站点（HTTP 200 明细）:
  /                          3,949B   index
  /web/chapter-00.html      15,261B
  /web/chapter-15.html      12,599B
  /web/chapter-31.html      17,011B
  /research/benchmarks.html 76,593B  (15 tables, 27,250 字, 39 外链)
  /research/frameworks.html 70,588B  (0 tables—源文件即无表格)
  /evals.epub              129,928B
  /styles.css /cover.svg     200

EPUB:
  32 chapters / spine 32 itemrefs / XHTML 抽查解析通过
  manifest 缺 css 声明 ❌

CI:
  最新 run: success (32s)，push main 全自动构建→部署
```
