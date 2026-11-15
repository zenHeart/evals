# 报告 A：收紧 evals 站点公平对比方法（4 项）

## 交付

| 项 | 值 |
|---|---|
| PR | https://github.com/zenHeart/evals/pull/76 |
| 合并提交 | `fa9c0aaac7e82bb3309d0fbad8acc144bbb0c652`（squash，未删远程分支 `feat/fair-tighten`） |
| PR CI | https://github.com/zenHeart/evals/actions/runs/43400490646 — Build EPUB & Web ✅、GitGuardian ✅（Deploy to GitHub Pages 按 PR 规则跳过） |
| 部署 run | https://github.com/zenHeart/evals/actions/runs/43400784215 — Build & Publish ✅ |
| 基线 | 分支从 `origin/main`（`f1b27cf`，PR #75 合并点）开出，无需 merge |

起点：工作树里有上一个执行者未提交的改动。逐条核对后判定实现方向正确、质量可用，在此基础上补齐了三处缺口——第 2/4 项缺测试、第 1 项的权重选取依据没写进文档、`conflicts.json` 里有 12 处无锚点的「同上」说明和 3 个对不上条目的汇总数字。

## 四项做法与结果

### 1. 视觉与文档：同表数据按领域分「对照」「估计」两档降权

新增 `TABLE_WEIGHT_BY_DOMAIN`，取 `verdict=0 / fit=0.5`。取值由外部榜单逐档扫描得出（`node scripts/fair-compare-validate.mjs --sweep-table-weight vision-documents --split`，共 30 档）：

- **对照档必须为 0**：只要同表数值能进两两对照（ρ≥0.1），与 Artificial Analysis 智能指数的方向一致率就跌到 83% 或更低（ρ=1 时 72%，其中只靠同表判方向的对子仅 6/10 一致），错的方向集中在 Anthropic Fable 5.2 页与 Thinking Machines Inkling 2 Small 页两张自家表；ρ=0 时一致率回到与加入同表数据之前相同的 6/7。
- **估计档取 0.5**：是让留一外推加权值不低于基线（0.65 ≥ 0.61）的最高档；ECI 0.83 / AA 0.81 / 留一 0.79·0.65 三项都优于 0.25 档。0.75 与 1.0 秩相关略高（0.85 / 0.86）但留一外推回落到 0.59 / 0.55，不满足「不低于之前」。

扫描数据表与两条理由写进 `data/competitor-columns/README.md`；`scripts/fair-compare.mjs` 的常量注释同步。其余领域两档仍为 1。

### 2. 只靠发布方自家表：独立评估不足 2 项不出结论

通用规则 `HOME_MIN_ROWS=2`：只有发布方自家的表、且独立评估不足 2 项时不判方向，写「难分高下（只有发布方自家表格的 N 项数据，仅作参考）」，数值仍作参考展示。发布方不是其中一方时不受此限。

实测生效例：Claude Opus 5.5 vs GPT-6 Astra（知识与推理）`k=0 kt=1 homeOnly=true homeThin=true → leader=null level=even`。

### 3. 82 处 + 78 组数值冲突逐条归因

回原页重读（必要时看归档原图），每条记原因、处置、原页 URL 与 locator，写入 `data/competitor-columns/conflicts.json`。

**自报 vs 同表（82 处）**

| 原因 | 条数 | 原因 | 条数 |
|---|---:|---|---:|
| 两页均未说明 | 21 | 本站转录/映射错误 | 5 |
| 厂商后续页面改报 | 13 | 页面示意组件，来源不明 | 4 |
| 执行框架不同 | 12 | 榜单快照时点不同 | 3 |
| 推理/工具设置不同 | 8 | 只是小数位不同 | 3 |
| 型号或快照不同 | 6 | 发布方误记其他型号 | 1 |
| 评测版本或子集不同 | 6 | | |

**表与表之间（78 组）**：两页均未说明 27、评测版本或子集不同 12、本站转录/映射错误 9、执行框架不同 9、页面示意组件 9、厂商改报 5、榜单快照 5、型号快照 4、推理/工具设置 4、小数位 1、误记型号 1。

**处置**

- 已按原文改正本站数据 **5 处**（均在对应账本 `revisions` 或竞品列 `corrections` 里留了原值、新值与出处）：
  1. `claude-opus-5-5` 的 OSWorld 版本 `2.0 partial` → `2.1 partial`（页面行名为「Computer use · OSWorld 2.1」）；
  2. `muse-ember` 的 PerceptionBench 补版本 `w/ tools`（页面行名「PerceptionBench (w/ tools)」、图注「With tools.」）；
  3. `step-5-preview` 的 AutomationBench 补版本 `AutomationBench-AA`（与同页 Zapier 公开版分行）；
  4. Kimi K2 Thinking 页 SWE-bench Multilingual 的 `DeepSeek-V3.2` 列经脚注 3.a 确认是 DeepSeek-V3.2-Exp，`model_id` 由 `deepseek-v3-2` 改为 `deepseek-v3-2-exp`；
  5. 另一处同表竞品列 `model_id` 误映射（同上批次）。
- **162 格**标 `comparability.status=not_comparable`（设置不同 99、执行框架 32、评测版本 14、示意组件 16、误记型号 1），不计入同表两两对照与全库估计，只在「另见」展示；其中来源不可靠的（`placeholder_widget`、`reporter_misattribution`）连全库估计也不用。
- **保留 48 处**：厂商改报、型号快照合并、四舍五入、榜单快照、两页均未说明。一律以自报为准，同表数值只在「另见」标出不一致，不取平均。
- 修正后仍存在的冲突：自报 vs 同表 77 处（其中可比 48），表与表之间 69 组（其中可比 28）。`validate:fair` 末尾「同表竞品列 vs 被转述模型自报」一行实测「不一致 77」，与汇总一致，测试里逐条重算锁定。

**两个必查样例**

- Kimi K2 页 AIME 2025 列名「Claude Opus 4 (w/o extended thinking)」的 33.9 与 Anthropic 自报 75.5 差 41.6 分 → 判「设置不同、不可比」。自报 75.5 是开启扩展思考的口径，Anthropic 附录另载的无扩展思考值正是 33.9，两页并不矛盾，只是口径不同。
- Anthropic Fable 5.2 页 GPT-6 Astra 的 Terminal-Bench-Science 0.1 记 68.1%，OpenAI Astra 页与 Anthropic Opus 5.5 页都是 64.6%，Fable 5.2 页脚注只说「各模型取最高可用档」、未说明差异 → 保留，以自报 64.6 为准，68.1 只在「另见」标出。

### 4. 无外部榜单领域：能力估计仅供参考

`EXTERNALLY_VALIDATED`（编程开发、知识与推理、视觉与文档）之外、或超过半数模型只有 1 项可对齐评估的领域，全库能力估计照常展示但标「仅供参考」，不产生间接结论。当前命中办公与商务、调研与搜索；页面在估计行加「仅供参考」徽标并给出一段说明（「没有可用来校验的外部综合榜单……只作参考展示，不据此判断高下」）。计算机操作、中文长文写作、量化金融公开分数太稀，本就不提供估计，页面原样说明。

实测：调研与搜索若不屏蔽会有 159 个间接结论，现为 0；办公与商务 0。

## 验证

| 命令 | 结果 |
|---|---|
| `npm test` | 139 通过（新增 12 条：自家表下限 1、对应渲染 1、Opus 5.5 vs Astra 真实回归 1、`estimateReference` 单元 1、对应渲染 1、ρ 两档 1、视觉不靠同表真实回归 1、无外部榜单不产间接真实回归 1、冲突登记汇总可重算 1、不可比格数据契约 1、不可比格取舍 1、两个必查样例 1） |
| `npm run audit:fair` | 23041 对；`newDominance` / `asymmetric` / `estConflict` 均为 0 |
| `npm run validate:fair` | 见下表 |
| `npm run validate:data` | PASS（taxonomy 9 / vendors 18 / benchmarks 509 / releases 234 / evidence 3918） |
| `npm run build` | test + sync:skills:check + validate:data + validate + build:epub:official + build:web + validate:site 全通过 |
| `npm run validate:site` | 1073 个 HTML / 39608 个内部引用、279 个时间轴、8 个档案页全部通过 |

## 外部验证改前改后

「改前」= PR #75 之前（`a03fa4a`）；「PR #75」= `f1b27cf`；「本 PR」= 合并后。**粗体为本轮关注项**。

| 指标 | 改前 | PR #75 | 本 PR |
|---|---:|---:|---:|
| Epoch ECI · 视觉 Spearman | 0.57 | 0.86 | **0.83** |
| AA 智能指数 · 视觉 Spearman | 0.41 | 0.83 | **0.81** |
| ECI · 视觉两两方向一致 | 23/23 (100%) | 76/77 (99%) | **38/38 (100%)** |
| AA · 视觉两两方向一致 | 6/7 (86%) | 13/18 (72%) | **6/7 (86%)** |
| AA · 视觉只靠同表判方向 | — | 6/10 (60%) | **0/0（不再判）** |
| 视觉留一外推（中位/加权） | 0.67 / 0.61 | 0.67 / 0.55 | **0.79 / 0.65** |
| ECI · 编程 | 0.70 | 0.83 | 0.83 |
| ECI · 知识推理 | 0.94 | 0.93 | 0.93 |
| AA · 编程 | 0.87 | 0.89 | 0.89 |
| AA · 知识推理 | 0.76 | 0.87 | 0.84 |
| 编程留一外推（中位/加权） | 0.68 / 0.62 | 0.80 / 0.75 | 0.80 / 0.75 |
| 知识推理留一外推（中位/加权） | 0.75 / 0.69 | 0.76 / 0.70 | 0.76 / 0.70 |

视觉与文档三项关注指标全部回到不低于 PR #75 之前的水平；其余领域没有变差（AA 知识推理 0.87 → 0.84，是唯一低于 PR #75 的点，仍显著高于改前 0.76）。

## 结论数量变化（`audit:fair` 全库）

| 指标 | 改前 | PR #75 | 本 PR |
|---|---:|---:|---:|
| 判出方向 | 5782 | 7279 | 7033 |
| 明显领先 | 51 | 150 | 145 |
| 略占优 | 2835 | 3020 | 2923 |
| 间接估计 | 2896 | 4109 | 3965 |
| 靠同表数据判方向 | — | 251 | 146 |

分领域：视觉与文档 120 → 247 → **169**（间接 11 → 126 → 60）；调研与搜索 18 → 145 → **49**（间接 0 → 76 → **0**）；办公与商务 10 → 36 → 22（间接 0 → 0 → 0）。

## 线上核对

- `https://evals.zenheart.site/assets/compare-data.json`（HTTP 200，781992 B）：`vision-documents` 的 `tableWeight=0`、`tableFitWeight=0.5`；`office-business` 与 `research-search` 的 `estMeta.reference=unvalidated`；其余领域两档为 1。
- `https://evals.zenheart.site/choose/`（HTTP 200）：方法学三处新文案在位（自家表不足不出结论、视觉同表只作参考、无外部榜单领域估计仅供参考）。
- `assets/compare-ui.mjs`、`assets/fair-compare.mjs` 与本地 `dist/` 逐字节一致（`diff -q` 通过），新逻辑（`homeThin`、`estReference`、`vd-ref`、`TABLE_WEIGHT_BY_DOMAIN`、`HOME_MIN_ROWS`、`UNRELIABLE_CAUSES`）均在线上包内。
- 用**线上** `compare-data.json` 复算关键对照：Opus 5.5 vs Astra（知识与推理）`k=0 kt=1 homeThin=true → 难分高下`；Gemini 4 Argon vs Opus 5.5（办公与商务）`estRef=unvalidated`；Astra vs Fable 5.2（调研与搜索）`数据不足`；Astra vs Fable 5.2（编程）`Fable 5.2 略占优`。全库体检：视觉与文档靠同表判方向 0 对、办公与商务间接结论 0、调研与搜索间接结论 0。

## 未解决事项

1. 162 个不可比格里有 133 个没挂 `conflict_ids`，原因直接写在各自的 `comparability.note` 里（列名已注明推理档位、框架或子集）。要逐条补登记可下一轮做，已计入汇总的 `unreferenced` 字段。
2. `conflicts.json` 的 `cross_table` 是发现时的快照，个别条目的 `model_key` 在映射修正后指向的已不是原模型（如 cross-39 的 Kimi 侧现属 DeepSeek-V3.2-Exp），已在对应 `note` 说明。
3. AA 知识推理 Spearman 0.87 → 0.84，低于 PR #75 但仍显著高于改前 0.76；未继续追因。
4. 按约定未提交 `evals.epub` 的构建产物改写（构建后已还原）；`data/generated/auto-benchmark-ids.json` 仅时间戳变化，随构建一并提交以保持工作树干净。

STATUS: DONE
