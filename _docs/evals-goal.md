# zenHeart/evals 全站、评估体系与内容深度研究

> 调研对象以实际公开仓库 **`zenHeart/evals`** 为准；你消息里的 `zenheartd/evals` 应是笔误。GitHub API 显示实际仓库为 `zenHeart/evals`。同时发现一个比 UI 更应优先处理的工程问题：仓库当前默认分支仍是 `master`，但生产 Pages 工作流监听和部署的是 `main`，这会导致后续 Agent、GitHub 默认浏览和搜索落到旧分支。fileciteturn23file0L1-L13 fileciteturn17file0L1-L7

本次结论不是“把站点重新做一遍”，而是：**现有项目已经有相当好的教材骨架，但需要把它从“内容丰富的静态电子书 + 一个 benchmark 卡片页”升级成“教材型学习产品 + 严谨的 benchmark reference 数据库”**。现有 `metadata.yaml` 已经形成 32 章、Part 0 加四大核心部分的完整学习路径，从“建立框架认知 → 方法论与标准流程 → 厂商发布评测全景 → 评估框架实战”，方向本身是对的。fileciteturn22file0L1-L7

最终执行规格已整理为一份可直接交给后续 Agent 持续工作的文件：

**[下载 goal.md](sandbox:/mnt/data/goal.md)**

## 核心判断与优先级

我认为目前最重要的不是继续无序补 benchmark 数量，而是先解决四个结构性问题。

| 优先级 | 核心问题 | 为什么必须先做 |
|---|---|---|
| **P0** | 默认分支 `master` 与生产分支 `main` 分裂 | 后续 Agent 可能在错误版本上工作，是整个项目持续演进最大的隐患。fileciteturn23file0L1-L13 fileciteturn17file0L1-L7 |
| **P0** | Book 与 Benchmark 各维护一套 Site Shell / Topbar / CSS | 这是你看到“评估大全顶部突然变 4 个路由”、页面风格割裂、移动端导航难看的根因。fileciteturn7file0L1-L7 fileciteturn10file0L1-L2 |
| **P0** | Benchmark 仍是“卡片内展开详情 + hover 引用” | 它把“快速浏览目录”和“深入阅读一个评估”混在同一个组件里；数据越完整，卡片越难看。fileciteturn7file0L1-L7 |
| **P0/P1** | `adoption[]` 还是厂商级弱数据，而不是“模型发布级证据” | 2026 年主流模型发布已经证明：benchmark 名字相同，harness、effort、工具、采样、环境不同，最终数字可以不能直接比较。citeturn20search0turn20search1turn20search4 |

因此，整体改造目标应该被定义为：

> **书籍负责建立认知和实战能力；评估大全负责做严谨、可查询、可追溯的 benchmark reference；二者通过相同概念、相同数据源、相同 Site Shell 互相连接。**

这比单纯“把卡片变漂亮”重要得多。

## 站点架构与 UI 深度审计

### 当前最大 UI 问题其实是架构重复

当前 `build-web.mjs` 与 `build-benchmarks-hub.mjs` 分别维护顶部导航、主题逻辑、CSS 和页面框架。

书籍构建器中的 Topbar 是：

> Logo / 首页 / 评估大全 / EPUB / Theme

而 benchmark builder 又自己生成：

> Logo / 首页 / 评估大全 / 书籍阅读 / EPUB / Theme

所以你提到的“点评估大全顶部路由变为 4 个，体验很差”并非一个局部导航文案问题，而是**两个 builder 拥有两套 Site Shell 的必然结果**。fileciteturn7file0L1-L7 fileciteturn10file0L1-L2

正确方向不是单独删掉一个链接，而是抽出：

```text
SiteShell
├── Head / SEO
├── Header
│   ├── Brand
│   ├── 学习 / 书籍
│   ├── 评估大全
│   └── Utilities
│       ├── Search
│       ├── EPUB
│       ├── GitHub
│       └── Theme
├── Main
└── Footer
```

**一级内容导航只应有两个：**

**学习 / 书籍**　　**评估大全**

Logo 自身负责回首页。EPUB、GitHub、主题切换都是 utility，不应该跟两个内容入口抢同一层级。

移动端则不应该让导航自动 `flex-wrap` 成两三行，而应该保持一个稳定约 56–64px 的 Header，剩余 utility 收进 menu。

### 评估大全“一行一张/两张卡”是 CSS 结构决定的

当前 benchmark 页：

```css
.wrap {
  max-width: 1100px;
}

.grid {
  grid-template-columns:
    repeat(auto-fill, minmax(min(100%, 460px), 1fr));
}

.grid .card {
  max-width: 640px;
}
```

这意味着单卡最低宽度接近 460px，而总容器又只有约 1100px；普通桌面最多自然形成两列，稍窄马上退化到一列，同时 Card 自己还有 `max-width` 限制。fileciteturn6file0L1-L2

这与“评估大全”的使用场景完全相反：这个页面首先应该是一个**高扫描效率的 Explorer**。

建议目标：

```css
.benchmark-container {
  width: min(100% - 32px, 1520px);
  margin-inline: auto;
}

.benchmark-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: clamp(12px, 1.4vw, 20px);
}
```

大致目标：

| 视口 | 卡片布局 |
|---|---|
| 手机 | 1 列 |
| 较宽手机 / 小平板 | 1–2 列 |
| 平板 | 2 列 |
| 普通桌面 | 3 列 |
| 宽屏 | 4 列 |

这里不要再给单张 Card 一个阻止它填满 grid cell 的 `max-width`。

### Card 必须从“微型详情页”退回“索引入口”

当前实现中，Card 折叠态显示“测什么 / 分数含义”，hover “N 家引用”弹引用浮层，点击整张 Card 又展开评分协议、厂商采用表和链接。fileciteturn7file0L1-L7

这套交互的问题不是单纯丑，而是**信息职责错位**。

当 GPQA 有十几个发布采用记录时，Card 展开后自然会变成一大块长页面；当每个 benchmark 的 protocol、版本差异、引用进一步丰富后，它会越来越不可维护。

建议 Card 永远保持固定扫描结构：

```text
┌─────────────────────────────────┐
│ GPQA Diamond        推理 · 科学 │
│                                 │
│ 博士级物理/化学/生物多选推理    │
│                                 │
│ Accuracy ↑ · Diamond · 198 题   │
│                                 │
│ 已见于 18 次主流模型发布        │
│ OpenAI · Anthropic · Kimi +5    │
│                                 │
│ 查看详情 →                      │
└─────────────────────────────────┘
```

直接删除：

- citation hover popover；
- Card 内展开；
- “▼ 点击展开详情”；
- hover 才能获取的重要信息。

Card 的唯一主行为：

> **进入 `/benchmarks/<slug>/` 独立详情页。**

这样 Card 负责“发现”，Detail 负责“理解”。

### 首页目前不是差，而是产品定位还可以更进一步

当前 metadata 对整本书的定位已经相当清楚：它明确面向初级前端工程师，并把内容组织成“理解 → 方法 → 厂商 benchmark → 实战”。fileciteturn22file0L1-L7

所以首页不需要大改视觉语言，应该重点从“电子书目录”升级为“学习产品入口”。

第一屏应该让用户立即回答：

> 我是谁？  
> 这个站解决什么问题？  
> 学完有什么能力？  
> 应该先学还是先查 benchmark？

推荐第一屏：

**大模型评估入门**

> 给会 JavaScript / TypeScript，但还不懂 LLM Eval 的工程师。  
> 学会看懂模型发布里的 benchmark、理解分数真正代表什么，并从零搭建自己的评估体系。

两个主 CTA：

**开始学习**　　**浏览评估大全**

Hero 后不要马上铺完整 32 章，而应先放三块能力承诺：

**看懂发布报告**  
知道 MMLU、GPQA、AIME、SWE-bench、Terminal-Bench 到底测什么，以及数字是否可比。

**理解评估方法**  
掌握数据集、协议、判官、指标、统计、污染、饱和、Agent 环境等核心问题。

**自己搭评估体系**  
从 JSONL 数据集开始，逐步做 scorer、LLM judge、缓存、并发、CI gate、线上 eval。

之后再展示学习路径和完整目录。

### 有几个当前版本里的明确完整性问题必须立刻修

当前封面 SVG 仍然硬编码：

> 28 章  
> 6 个部分

但现在的 metadata 已经是 chapter-00 到 chapter-31，共 32 章，并采用 Part 0 + 四大核心部分结构。fileciteturn21file0L1-L7 fileciteturn22file0L1-L7

这类问题以后不应该靠人记得改：

```text
metadata.yaml
    ↓
homepage
cover
EPUB
SEO
chapter count
part count
```

都应该从一个 source of truth 自动生成。

另一个更严重的问题是章节重排后的交叉引用已经再次腐烂。当前 Chapter 19 开头仍然告诉读者“如果只读一节：读 16.4.5”，正文继续引用 `16.x`、`17.9` 等旧号；Chapter 20 又写“读 17.5”“对应 16.3”，与当前文件和章节编号明显不一致。fileciteturn24file0L1-L2 fileciteturn25file0L1-L5

因此后续不能继续手写：

```text
详见第 17 章
见 16.4.5
```

应改成逻辑引用：

```text
[[frameworks-landscape#framework-comparison]]
[[mini-evaluator#complete-implementation]]
```

构建时根据 metadata 渲染成当前章号和 section 号。

同时加 CI validator，章节一重排就自动失败，而不是等读者发现。

值得注意的是，仓库之前的设计审查中一些问题已经被修了：当前 `build-web.mjs` 已经做全文搜索索引并保留连字符，同时明确删除 `dist/research`，所以早期 review 中“内部 research 页面全部公开”“搜索只截取部分正文”等历史问题，不能继续当作当前问题照抄。fileciteturn20file0L1-L7

这也是为什么后续 Agent 必须**先审当前代码和当前 live site，再看历史 review**。

## 评估大全应该升级成什么产品

### 当前数据模型已经有价值，但支撑不了你的最终目标

现在 `data/benchmarks.json` 已有：

```text
id
name
category
tests
protocol
url
paper
adoption[]
adoptionNote
meaning
```

这说明项目基础并不差：已经知道 benchmark 不应只有“名字 + 链接”，而需要“测什么、protocol、meaning、采用情况”。fileciteturn11file0L1-L7

真正缺失的是 adoption 的**粒度**。

目前很多记录类似：

```json
{
  "release": "OpenAI",
  "score": "-",
  "url": "..."
}
```

这只能回答：

> OpenAI 好像用过 GPQA。

而用户真正需要回答的是：

> 哪个 OpenAI 模型？  
> 哪次正式发布？  
> 用 GPQA 还是 GPQA Diamond？  
> 什么 reasoning effort？  
> 有没有 tools？  
> 跑了几次？  
> score 是 pass@1、avg@N 还是其他 aggregation？  
> 能不能跟 Kimi 那个数字比较？

2026 年最新官方发布已经非常清楚地说明，**后者才是正确的数据粒度**。

Kimi K3 的官方 benchmark 脚注直接记录了 max reasoning effort、temperature=1.0、top-p=1.0，并针对不同 benchmark 指定 Kimi Code、Claude Code 或 Codex harness；DeepSWE、Terminal-Bench、PostTrain Bench 等甚至各有不同的运行环境和 aggregation。citeturn20search0

DeepSeek 在 2026 年 8 月 21 日的 V4-Flash-Vision-Exp 发布中，不仅公布 Terminal Bench 2.1、NL2Repo、DeepSWE、AutomationBench、Agents' Last Exam 等结果，还明确写了公开 Code Agent 任务采用 DeepSeek Harness minimal mode、max effort、top-p 0.95、temperature 1.0。citeturn20search6

GLM-5.3 的官方发布则进一步把 Terminal-Bench 2.1/3.0、DeepSWE、HLE 等 benchmark 的 harness、context、timeout、temperature、top-p、最大输出、avg@3、judge model 等放到了正式脚注中。citeturn20search1

而 Anthropic 对 agentic coding eval 的专项实验甚至发现，仅基础设施配置不同就可使 Terminal-Bench 2.0 相差约 **6 个百分点**，这个幅度可能超过排行榜顶级模型之间的差距。citeturn20search4

因此这个站未来必须教会读者：

> **Benchmark score 不是一个数字，而是一次完整实验配置的结果。**

我建议把“可比较的一次评估结果”抽象成：

```text
Result =
  benchmark
+ benchmark variant/version
+ dataset subset
+ prompt/protocol
+ sampling
+ reasoning effort
+ tools
+ browsing
+ harness/scaffold
+ scorer/judge
+ aggregation
+ run count
+ context/output budget
+ environment
```

少了这些信息，详情页就应该明确写：

**协议披露不足，不能据此进行严格横向比较。**

### 数据应从一个 JSON 改成“Benchmark × Release”多对多结构

建议逐步迁移成：

```text
data/
├── benchmarks/
│   ├── gpqa.yaml
│   ├── swe-bench.yaml
│   ├── terminal-bench.yaml
│   └── ...
│
├── releases/
│   ├── openai/
│   │   └── gpt-5-6.yaml
│   ├── anthropic/
│   │   └── claude-opus-5.yaml
│   ├── google/
│   │   └── gemini-3-7-flash.yaml
│   ├── xai/
│   │   └── grok-4-6.yaml
│   ├── kimi/
│   │   └── kimi-k3.yaml
│   ├── deepseek/
│   │   └── v4-flash-vision-exp.yaml
│   └── zai/
│       └── glm-5-3.yaml
│
├── vendors.yaml
└── aliases.yaml
```

原因很简单：

一条模型发布会使用多个 benchmark；

一个 benchmark 又会被几十次模型发布引用。

这本质是典型 many-to-many relation，不应继续塞在：

```text
benchmark.adoption[]
```

里。

模型 Release 记录应接近：

```yaml
vendor: kimi
model: Kimi K3
releaseTitle: Kimi K3: Open Frontier Intelligence
releaseDate: ...
officialUrl: ...
sourceType: blog
lastVerifiedAt: ...

benchmarks:
  - benchmarkId: terminal-bench
    benchmarkVariant: "2.1"
    score: ...
    reportingProtocol:
      reasoning: max
      harness: Kimi Code
      temperature: 1.0
      topP: 1.0
      aggregation: ...
    evidence:
      grade: A
      type: text
      verifiedAt: ...
```

这样才能自动生成：

```text
GPQA
  → 哪些模型用过

Kimi K3
  → 发布时用了哪些 benchmark

Anthropic
  → 历代发布 benchmark 变化

Terminal-Bench
  → 不同 harness 下模型结果为何不能裸比
```

这会让“评估大全”从静态卡片页变成真正的数据产品。

### Benchmark 独立详情页应该采用严格模板

我建议详情页统一采用以下结构：

| 页面区块 | 必须回答的问题 |
|---|---|
| Identity | 谁发布、何时发布、当前版本、官方入口、论文、数据集、Repo |
| 30 秒看懂 | 测什么 / 不测什么 / 分数怎么看 / 最大误区 |
| Why | 为什么要创造这个 benchmark，它替代或补足了什么 |
| Dataset | 有多少题、什么领域、什么来源、公开还是私有、静态还是 rolling |
| Task | 一条 sample 长什么样，模型实际接收到什么 |
| Pipeline | prompt → model/harness → output/trajectory → parser/judge → score |
| Metric | metric 是什么、↑/↓、公式、chance/human baseline |
| Protocol | shot、CoT、tools、browser、effort、sampling、context、harness |
| Validity | contamination、saturation、judge bias、infra/harness sensitivity |
| Model adoption | 哪些模型在哪次正式发布中使用，具体分数和协议 |
| Reproduce | lm-eval / OpenCompass / LightEval / Inspect / 官方实现 |
| Related | predecessor、successor、相邻 benchmark |
| References | 一手论文、官网、官方模型发布证据 |

这套模板会解决目前 Card 上一句：

> “90 分 ≈ 顶尖本科生水平”

这种表达过度压缩的问题。

详情页真正应该解释：

> 90 是什么 metric？  
> 哪个 benchmark variant？  
> chance baseline 是多少？  
> 这是不是“知识能力”的有效代理？  
> 是否已接近 saturation？  
> 结果对 prompt/harness 敏不敏感？  
> 人类 baseline 的实验条件是什么？

例如 SWE-bench 的 evolution 就非常适合教学。OpenAI 与 SWE-bench 作者合作推出 Verified 时，先让 93 名有 Python 经验的软件开发者检查 1,699 个测试样本，再构建 500 个经过验证的任务，并提供基于 Docker 的评估 harness。这个案例本身就能告诉初学者：**benchmark 不是永恒正确的题库，题目质量和 grader 也需要被评估。** citeturn25search0

GPQA 也很适合按这种方式讲：原论文定义了 448 道由领域专家编写的生物、物理、化学多选题，并报告相应领域专家与非专家验证者的表现，这比只告诉读者“博士级题，越高越好”更能帮助理解 benchmark 的构念。citeturn25academia18

HLE 同样应该展示版本历史而不是一个静态条目：官方站点已经提供 HLE-Rolling，并记录最终数据集经过 bug bounty / 搜索性问题处理后在 2025 年固定为 2,500 道题。citeturn25search3

### 引用应该改成“证据系统”

建议统一五级证据：

**A — 官方模型发布正文 / 表格**  
模型厂商自己的 release blog、system card、model card、API release docs 中直接出现 benchmark。

**B — 官方模型发布图表**  
官方页面明确包含 benchmark，但数据嵌入图片，需要人工核对。

**C — 官方技术报告 / 官方 GitHub model card**  
厂商自己发布，但不是主 release 页面。

**D — Benchmark 官方项目 / 官方 leaderboard**  
可用于验证实现、排名或复现。

**E — 第三方媒体 / 聚合平台**  
只能用于背景，不能作为“厂商正式发布采用”的主证据。

页面里应明确展示：

```text
OpenAI · GPT‑5.6 Sol
Official Release · 2026-07-09
Evidence A

Benchmark: ...
Variant: ...
Score: ...
Effort: ...
Harness: ...
Tools: ...
Runs: ...
Source: OpenAI official release
```

而不是：

```text
OpenAI  ✓
```

### 厂商覆盖不能再靠人工感觉“差不多全了”

需要建立一个 machine-readable vendor registry。

全球至少长期检查：

```text
OpenAI
Anthropic
Google / Gemini / DeepMind
xAI
Meta / Llama
Mistral
```

中国至少长期检查：

```text
Moonshot / Kimi
DeepSeek
Z.ai / GLM
MiniMax
Alibaba / Qwen
ByteDance Seed
Xiaomi MiMo
Baidu ERNIE
Tencent Hunyuan
```

重点不是每家硬塞一样多内容，而是有一个显式状态：

```yaml
vendor: qwen
active: true
lastCheckedAt: ...
latestBenchmarkReleaseChecked: ...
coverageStatus: complete | partial | gap
```

查不到官方 benchmark release 时，写：

> **coverage gap**

绝不能为了“全覆盖”拿媒体文章或二手排行榜补成“官方引用”。

截至本次调研，头部厂商最近发布已经非常适合作为第一轮正式结构化数据：

OpenAI 的 GPT‑5.6 于 2026 年 7 月 9 日正式发布，并继续把 coding、knowledge work、cybersecurity、science 等评估作为发布论证的一部分。citeturn21search7

Anthropic 的 Claude Opus 5 于 2026 年 7 月 24 日发布，官方页面包含 Frontier-Bench、CursorBench、ARC-AGI 3、GDPval-AA、OSWorld、HLE、AutomationBench 等，并在脚注明确说明特定 benchmark 的 harness、backend、每任务尝试次数等条件。citeturn22search0

Google 在 2026 年 8 月 13 日继续发布 Gemini 3.7 Flash，定位明显偏 coding 与 agent workflow；它距离 3.6 Flash 发布仅约三周，也说明模型发布与 benchmark 覆盖是需要持续维护而不是一次性抓取的内容。citeturn22search5turn22search3

xAI 的 Grok 4.6 于 2026 年 8 月 12 日发布时列出了 GDPVal-AA v2、CursorBench v3.2、DeepSWE v1.1、FrontierCode、APEX-Agents、Terminal-Bench v3.0 等多类 eval，并注明竞争模型数字取自开发商发布材料或 benchmark leaderboard。citeturn21search0

国内方面，Kimi K3、DeepSeek V4-Flash-Vision-Exp 和 GLM-5.3 尤其值得优先结构化，因为三者都已经把 harness、sampling、effort 或 environment 等信息写得非常明确。citeturn20search0turn20search6turn20search1

这三个例子可以直接成为详情页中“为什么不能只看裸分数”的教学主线。

## 书籍内容：已经有好底子，但要从“内容多”升级到“学习闭环完整”

### 现有内容最值得保留的是“前端工程师类比”

已有 junior frontend 视角审查给了一个非常重要的信号：读者真正形成理解的地方，不是术语堆积，而是把 Eval 映射到已经掌握的工程概念。

例如现有教材中的：

- 构念效度 ↔ Lighthouse；
- 代码 benchmark ↔ Jest / snapshot；
- cons@k ↔ flaky test 重跑与预声明 aggregation 的区别；
- Dataset / target / evaluator ↔ 测试用例 / 被测函数 / assertion；
- trace ↔ observability；

这些都是很好的教学资产。既有 junior review 也明确记录了这些类比是最容易形成“aha moment”的部分。fileciteturn13file0L1-L7

所以**不要把书改成学术综述风格**。

真正需要做的是让每个概念都有双层表达：

> **直觉层**：用前端类比建立 mental model。

然后马上补：

> **严格层**：这个术语真正的定义是什么，类比哪里不成立。

否则类比虽然容易懂，也可能把错误模型固化。

### 初学者阅读最大的缺口是“认知坡度”

已有 junior reader audit 指出的几处问题非常有代表性：

likelihood-based evaluation 一上来讲“比较答案字符串条件概率”，但一个只用过 Chat Completions 的前端工程师不知道去哪里拿 logits/logprobs；

Wilson interval → McNemar → bootstrap 连续出现时，没有先告诉读者“这一节不会推公式也没关系，你只要记住哪三句话”；

Reward Model / RLHF 等训练侧概念相对应用开发者而言跨度太大。fileciteturn13file0L1-L7

因此建议每章采用 progressive disclosure：

### 先记住

只读这一块也不妨碍继续读。

例如：

> **置信区间只需要先记住：**  
> 70% 不是“真实能力就是 70%”；题越少，不确定性越大。比较两次 run 时不要只看点估计。

### 工程上怎么用

告诉开发者什么情况下需要它：

> PR 评估从 79% 变成 80% 不应该自动判定“提升”；先判断样本量和差异是否超过合理波动。

### 为什么成立

再讲 Wilson / bootstrap。

### 进阶

最后才讲推导、不同估计器和统计假设。

这能显著降低初学者的认知负担，同时保留严谨性。

### 全书必须有一张贯穿始终的“Eval 生命周期总图”

用户希望理解“评估在整个模型训练流程中的意义”，这一点现在应进一步显式化。

建议从第一部分就固定一张总图：

```text
Data
  ↓
Pre-training
  ├─ training loss
  ├─ validation eval
  └─ capability tracking
  ↓
Post-training
  ├─ SFT
  ├─ preference / reward model
  ├─ RL
  └─ post-training eval
  ↓
Pre-release
  ├─ capability eval
  ├─ safety eval
  ├─ red-team
  ├─ contamination checks
  └─ release gate
  ↓
Model release
  └─ benchmark report
       ↓
Application development
  ├─ offline product eval
  ├─ regression eval
  ├─ RAG / Agent eval
  └─ CI gate
       ↓
Production
  ├─ sampled online eval
  ├─ human feedback
  ├─ A/B testing
  ├─ monitoring
  └─ dataset feedback loop
```

然后明确告诉读者：

> 厂商训练侧 Eval 与应用开发者产品侧 Eval 不是一件事，但共享一套测量思想。

这也是前端工程师理解模型发布报告与自己业务 eval 之间关系的关键桥梁。

### “看懂厂商发布”应该成为一套固定阅读算法

建议统一成七问：

> **测什么？**  
> **哪个 benchmark variant/version？**  
> **metric 是什么？**  
> **是裸模型还是 harness/agent？**  
> **有没有 tools/browser/code execution？**  
> **reasoning/sampling/inference budget 是否一致？**  
> **结果是单跑、平均、多次投票还是 best-of？**

每一个 benchmark 详情页都重复使用这套逻辑。

这样读者看到 Kimi K3、GLM、DeepSeek、Claude、GPT、Gemini 的 benchmark table 时，会形成稳定的“读表肌肉”。

Anthropic 关于基础设施噪声的结果尤其适合做这一章的核心案例：对 Agent benchmark 来说，环境本身就是实验变量，不能把 leaderboard score 当成模型自身不可变的属性。citeturn20search4

### 框架章节现在内容不浅，但 taxonomy 还不够完整

现有 Chapter 19 已经深入比较 LangSmith、Langfuse、Inspect AI、DeepEval，并用 `Dataset × 被测物 × Evaluator` 的共同抽象去解释工具，而不是死背 API，这是正确方向。fileciteturn24file0L1-L2

但它还需要进一步区分三类工具：

**模型 / Academic benchmark runner**

- lm-evaluation-harness
- OpenCompass
- LightEval

EleutherAI 的 lm-evaluation-harness 本身就是面向大量标准语言模型任务的统一 runner，支持本地模型、API、vLLM 等，并把 prompt、answer extraction、few-shot、task configuration 等作为可配置实验条件。citeturn23search0

OpenCompass 则强调统一模型/数据集配置、zero-shot/few-shot/CoT、多后端、实验记录与报告，并持续加入新的 benchmark 和 evaluator。citeturn24search1

LightEval 当前官方文档提供多 backend、任务/metric 自定义和 sample-level 结果分析。citeturn23search1

**Agent / Safety eval orchestration**

- Inspect AI

Inspect AI 官方框架原生覆盖 prompt engineering、工具使用、多轮交互与 model-graded evaluation，并维护大量预构建 eval。citeturn24search0

**应用 / Observability / Product Eval**

- LangSmith
- Langfuse
- DeepEval
- Promptfoo 等当前仍适用工具

读者应该学到：

> lm-eval 和 LangSmith 都叫 eval framework，但它们解决的抽象层级不一样。

这比简单做“一张框架功能对比表”重要。

### Mini Evaluator 已经是很好的基底，下一步应该做成可运行项目

当前 Chapter 20 已经从 30 行脚本逐步做到并发、cache、retry、报告、可插拔 judge、Wilson interval 和 CI gate，实际比很多“LLM Eval 入门文章”扎实。fileciteturn25file0L1-L5

所以不应该重写，而应该把它提升为一个真正可 clone 的项目：

```text
examples/mini-eval/
├── datasets/
│   └── support.jsonl
├── src/
│   ├── target.ts
│   ├── runner.ts
│   ├── judges/
│   ├── metrics/
│   ├── cache.ts
│   └── report.ts
├── tests/
├── eval.config.ts
├── package.json
└── README.md
```

最终让读者亲手实现：

```text
dataset schema
→ target
→ deterministic scorer
→ LLM judge
→ structured output
→ retry
→ rate limit
→ bounded concurrency
→ cache
→ raw sample logs
→ run metadata
→ model/prompt version
→ sampling config
→ aggregate metric
→ confidence interval
→ baseline comparison
→ regression gate
→ CI artifact
→ failure analysis
```

再把：

**RAG / 客服**  
**Coding Agent**  
**多模态**

三个 case 都按同一闭环跑一遍：

```text
需求
→ 风险
→ 测量目标
→ 数据集
→ scorer
→ baseline
→ experiment
→ error analysis
→ CI gate
→ production monitoring
```

达到这里，才真正满足你要求的：

> “初级前端工程师读完后，不只是看懂，还是能从零搭。”

## 官方发布引用覆盖与长期维护规则

最关键的研究结论是：**现在已经不能把“benchmark adoption”理解为厂商名称列表。**

2026 年公开发布材料正在快速从：

```text
GPQA 85.2
SWE-bench 72.1
```

升级为：

```text
benchmark
variant
harness
reasoning effort
tools
temperature
top-p
context management
timeout
rollout count
aggregation
judge
```

Kimi K3 官方发布就是一个非常好的结构化范例。citeturn20search0

DeepSeek 2026 年 8 月版本说明也已经直接公布模型的 benchmark protocol。citeturn20search6

GLM-5.3 的发布脚注甚至对不同 agent benchmark 分别指定不同 context、timeout、harness、sampling 与 aggregation。citeturn20search1

因此后续 Agent 的工作标准应是：

**不能写：**

> GPQA 被 OpenAI、Anthropic、Kimi 使用。

而应该写成：

```text
GPQA Diamond

OpenAI
└── GPT-X
    ├── Release: ...
    ├── Date: ...
    ├── Variant: Diamond
    ├── Score: ...
    ├── Protocol: ...
    ├── Source: Official release
    └── Evidence: A

Anthropic
└── Claude ...
    ...

Kimi
└── Kimi ...
    ...
```

并进一步允许用户回答：

> “为什么 OpenAI 的 84.5 与 Kimi 的 86.1 可能不能直接比？”

这才是真正“严密逻辑组织，让用户完全理解评估体系”。

建议第一批不要追求 65+ benchmark 全部同时重写，而是先把详情页标准打磨到高质量，再扩散：

```text
MMLU / MMLU-Pro
GPQA Diamond
AIME
HLE
HumanEval
LiveCodeBench
SWE-bench / Verified / Pro
Terminal-Bench 2.x / 3.x
DeepSWE
BrowseComp
OSWorld
τ-bench / τ²-bench
MMMU / MMMU-Pro
MCP Atlas
GDPval-AA
Agents' Last Exam
Arena / preference benchmark
一个长上下文 benchmark
一个安全 benchmark
```

尤其不要把：

> MMLU  
> MMLU-Pro  
> SWE-bench  
> SWE-bench Verified  
> SWE-bench Pro  
> Terminal-Bench 2.1  
> Terminal-Bench 3.0

这些名字简单当成同一个 benchmark 的“别名”。

它们必须有明确的 version / variant relationship。

SWE-bench Verified 的形成过程本身就说明 variant 会改变 dataset validity 和 harness。citeturn25search0

HLE 后续又出现 HLE-Rolling，也进一步说明“benchmark 是有生命周期的”，不是一个永远静态的名字。citeturn25search3

最终每个 benchmark 页面还应该有状态：

```text
Active
Live / Rolling
Historical classic
Near saturation
Superseded
Deprecated
```

这样一个完全不了解 Eval 的读者才不会误以为：

> “MMLU 既然经典，就一定是 2026 最重要的模型能力指标。”

## goal.md 的执行设计与完成标准

完整执行合同已经写入：

**[下载 goal.md](sandbox:/mnt/data/goal.md)**

它不是一个简单 TODO，而是专门给后续 Agent 使用的长期 specification，已经包含：

**产品目标**  
首页、书籍、Benchmark Explorer、Benchmark Detail 各自承担什么职责。

**不可破坏原则**  
初学者优先但不牺牲严谨性；分数必须绑定 protocol；官方一手来源优先；不能依赖 hover 获取核心信息。

**分支治理**  
先处理当前 `master` 默认分支与 `main` 部署分支不一致问题。GitHub 当前 API 确实返回 `default_branch: master`，而 Pages workflow 的 push / deploy 条件都是 `main`。fileciteturn23file0L1-L13 fileciteturn17file0L1-L7

**统一 Site Shell**  
书籍与 benchmark 不再分别维护 header/theme/CSS。

**Benchmark Card 规范**  
响应式 1/2/3/4 列、删除 hover citation、删除 Card expand、独立详情 URL。

**Benchmark Detail 模板**  
Why / Dataset / Task / Pipeline / Metric / Protocol / Validity / Adoption / Reproduce / Related / References。

**Benchmark + Release 数据 Schema**  
把当前 `adoption[]` 升级成 release-level 多对多结构。

**厂商 Registry**  
对 OpenAI、Anthropic、Gemini、xAI、Meta、Mistral，以及 Kimi、DeepSeek、GLM、MiniMax、Qwen、Seed、MiMo、ERNIE、Hunyuan 等做显式 coverage audit，而不是凭印象声称“覆盖所有”。这个 Registry 的每个 active vendor 都要求定期重新核验官方 release。

**教材能力链**  

```text
为什么评
→ 评什么
→ 怎么设计测量
→ 怎么执行
→ 怎么解释
→ 怎么比较
→ 怎么复现
→ 怎么进入 CI / Production
→ 怎么持续改善
```

**框架 taxonomy**  
把 lm-eval、OpenCompass、LightEval、Inspect、LangSmith、Langfuse、DeepEval 等放到正确问题层次，而不是做产品功能罗列。对应框架的官方资料也证明，它们的抽象与应用场景并不相同。citeturn23search0turn23search1turn24search0turn24search1

**实践项目标准**  
Mini Evaluator 从脚本升级到可运行项目，并要求 RAG、Coding Agent、多模态三个完整闭环。

**自动验收**  
要求加入：

```text
branch/deploy consistency
benchmark schema validator
release evidence validator
chapter cross-reference validator
internal link checker
external citation URL checker
responsive smoke
keyboard navigation smoke
search regression
cover/metadata consistency
artifact privacy check
```

这非常关键，因为当前已经出现两种典型“修过又可能回来”的问题：

一类是章节重排后旧编号重新残留。fileciteturn24file0L1-L2 fileciteturn25file0L1-L5

另一类是封面仍停留在“28 章 / 6 部分”，而内容已经是新结构。fileciteturn21file0L1-L7 fileciteturn22file0L1-L7

后续原则应该是：

> **任何已经发生过一次的结构性错误，都不应该靠 Agent 下次继续记住；应该转成 validator。**

最终 Definition of Done 被明确设定为：

**站点层面**：首页 30 秒讲明产品；全站只剩一套 IA 和 Navigation；Benchmark Explorer 在普通桌面自然 3 列、宽屏 4 列；手机没有全页横向 overflow；每个 benchmark 有独立可分享 URL。

**教学层面**：一个只懂初级前端的读者读完后，能够解释 Eval 在训练与产品生命周期的位置，能够说清 MMLU、GPQA、SWE-bench、Terminal-Bench 测什么，能够解释 Accuracy、Pass@k、Elo 等指标，并能判断两个厂商数字为什么可能不可比。

**实战层面**：读者可以建立 dataset、runner、scorer/judge、统计汇总、regression、CI gate，并能完成一个业务级 RAG / Agent eval。

**证据层面**：每条“某模型采用某 benchmark”必须追溯到具体 vendor、model、release、date、variant、score、protocol 与官方证据；无法验证的事实标记缺失，而不是猜。

**工程层面**：默认分支和生产分支统一；Book 与 Benchmark 共享 Site Shell；所有 metadata、封面、章节数同源；benchmark/release schema 可校验；章节交叉引用、链接、响应式和可访问性有自动回归。

这条路线最重要的结果，不是让 `evals.zenheart.site` “更好看”，而是把它升级为一种非常明确的产品：

> **前半部分是一所面向应用工程师的 Eval 学校；后半部分是一部可以逐项核查模型发布数字的 Eval Reference。**

现有 32 章、前端类比、Mini Evaluator 和厂商调研已经提供了很好的底座。fileciteturn22file0L1-L7 fileciteturn25file0L1-L5 fileciteturn15file0L1-L2

真正需要完成的下一阶段，是把**内容深度、证据粒度、信息架构和数据模型统一起来**：从“这里有很多 Eval 知识”变成“一个初级前端工程师可以在这里建立完整 Eval 心智模型，而且每一个模型发布数字都能追溯到它究竟是怎么测出来的”。