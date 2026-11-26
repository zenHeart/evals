# 全量审核报告 — benchmark-profile/v2 存量升级（t83）

- 生成时间：2026-11-25 07:55（+0800）
- 修订：2026-11-25 10:20（+0800）——新增 §8「干净 clone 复现验证」、§9「账本/来源一致性审核」，
  并修正下文 6 处过期数字与路径（`39 113` 的口径、7 步 → 8 步门禁、两处外置工具路径）。
  审核结论本身未变：`quotes_bad > 0` 的页仍为 0，门禁仍全绿。
- 仓库状态：`t83-integ` 分支，HEAD `b992272`，领先 `origin/main` 5 个提交
  （`8f851df` / `dd431ad` / `e4e3ab3` / `70d3e36` / `b992272`；`origin/main` = `fc56a57`）
- 本报告覆盖：全量引文与档案审核、门禁链、≥10% 引文复抓、10 页抽检、增量窗口落账核验、
  干净 clone 复现验证、账本/来源一致性审核
- 未做（按 T87 / T91 明确指令）：`git push`、启动 publisher、触发 GitHub Actions、创建或评论 issue

---

## 1. 全量引文审核（510 页）

工具：现已在库内 `scripts/check-one.mjs`（当时跑的是原机 `/workspace/rollout/check-one.mjs`，
两者同源；本修订把它改标为库内路径，便于接手方复跑）。逐字比对需要**外置语料**
（`data/evidence/<id>/<sid>.txt`，约 2.2 GB，不随交接提交，可按 §8.3 重建）。
明细：`logs/audit-checkone-510-final.jsonl`（510 行，一行一页；
同时留存 `audit-checkone-510-main.jsonl`、`audit-checkone-510-sweep-raw.jsonl`、
`audit-checkone-509-staged.jsonl` 三份同口径快照，mtime 均为 07:35:48）。

> **`39 113` 是 07:35 的快照口径，不是当前账本数。** 该 jsonl 生成后，证据库又在
> 08:36 被改写一次（15 个页面净变化：`finance-agent` 113→187、`genebench` 102→161、
> `hy-browsecomp-pro2` 0→44、`firefox-147-exploit` 60→71 为新增；
> `agents-last-exam` 173→169、`apex` 77→71、`gdpval` 211→208 等为去重收缩）。
> **当前权威数字以 `scripts/verify-cite-coverage.mjs` 的输出为准：账本摘录 39 279
> （496 个账本文件；v2 页 37 701 + 非 v2 页 1 578）**，见 §8.1。
> 两份数字不相等是时序差，不是漏核。

| 指标 | 数值 |
| --- | --- |
| 评测页总数 | 510 |
| cite 引用总数 | 12 778 |
| 逐字核验通过的摘录 | 39 113 |
| `quotes_bad > 0` 的页 | **0** |
| 完全干净（cites + quotes + 模板） | **480** |
| 带 error 标记的页 | 30 |

30 个 error 页**全部**是模板标记（`check-one.mjs` 的 `errors` 是计数，不是内容类失败），
没有一条内容类错误。分布已用集合运算核对（`err − backlog = {multimodal-knowledge-agent,
swebench-pro}`，`backlog − err = ∅`）：

- 28 个 = `data/benchmark-profile-backlog.json` 的**全部** id。这 28 个**都是 v0 schema 实体**：
  没有 `profile` 键、也没有 `template` 字段（`note` 说明它们是 2026-11-10 v1 上线时尚未按统一
  模板升级的存量）。其中 **13 个证据库里有摘录但 cite 未接线**（`cites=0`、`quotes_ok>0`、`errors=1`），
  另 **15 个连摘录都没有**（`quotes_ok=0`、`errors=2`）：`apexbench` `cmt-benchmark`
  `full-duplex-bench` `hy-browsecomp-pro2` `hy-euler-pro` `hy-finagentbench` `hy-math`
  `hy-skillsworld` `mm-claw` `prodbench` `qwen-blender-bench` `qwen-world-bench`
  `swebench-pretrain` `vibe-coding-human-eval` `videosimpleqa-v2`。
- 2 个 = `multimodal-knowledge-agent`、`swebench-pro`——本窗口只做引文外科修复，**刻意不升级模板**
  （两者都不在 28 id 的 backlog 里，属于第 29/30 个待升级项，见 §7 遗留项 2）。

本窗口关闭的页面/证据缺陷（终态均已复验）：

| 页面 | cites | quotes_ok | quotes_bad | errors | 处置 |
| --- | --- | --- | --- | --- | --- |
| `swebench` | 34 | 96 | 0 | 0 | 引用缺口补齐 |
| `swebench-pro` | 22 | 106 | 0 | 1（v1 模板） | 引用缺口补齐，模板未升级 |
| `multimodal-knowledge-agent` | 47 | 146 | 0 | 1（v1 模板） | 引用缺口补齐，模板未升级 |
| `apex` | 0 | 77 | 0 | 1（v0 无 profile） | 摘录与页面内容对齐 |
| `biomysterybench` | 0 | 125 | 0 | 1（v0 无 profile） | `…` 分段摘录误加列表符号，去掉前导 `- ` 后逐字命中 |
| `hlehle` | 31 | 70 | 0 | 0 | 引用缺口补齐 |

（`apex` / `biomysterybench` 的 `cites=0` 是 v0 实体本来就没有 cite 接线，不是本窗口弄丢的；
它们的 `quotes_ok` 是证据库里与页面内容对齐后的摘录数。）

`biomysterybench` 的修复方式值得记录：原摘录写作
`` - `problems.csv` / `problems.parquet` — one row per problem … `answer_rubric` ``，
但原文该处没有列表符号（`. contents problems.csv / ...`），导致 `…` 前段无法逐字匹配。
修复后的摘录去掉了前导 `- `，写入前用 `hit()` 断言通过（上一轮同类修复没有断言，所以写坏了）。

## 2. backlog 棘轮与档案模板

`data/benchmark-profile-backlog.json`：**135 → 28**（`count` 字段与 `ids.length` 一致，棘轮只减不增）。
`node scripts/validate-data.mjs` 报：

```
[profile] 模板档案 482 个通过校验；待升级存量 28 个（backlog 只减不增）
[validate-data] PASS — taxonomy 9 类 / vendors 18 / benchmarks 510 / releases 260（official 246）/ evidence edges 4625
```

## 3. 门禁链（8 步全绿）

脚本：原为 `/tmp/audit/final-gate.sh`，**已入库为 `scripts/handoff/run-gate.sh`**（同一串命令，
退出码与回显一致），全部从 `/workspace/t83-integ` 运行，日志在 `logs/gate-*.log`。

| 步骤 | 命令 | exit |
| --- | --- | --- |
| gate-1 | `node scripts/reconcile-coverage.mjs` | 0 |
| gate-2 | `node --test tests/*.test.mjs` | 0 |
| gate-2b | `node --test tests/release-ingest.test.mjs` | 0 |
| gate-3 | `node scripts/validate-data.mjs` | 0 |
| gate-3b | `node scripts/validate-model-coverage.mjs` | 0 |
| gate-4 | `npm run build` | 0 |
| gate-5 | `npm run sync:skills:check` | 0 |
| gate-6 | `node scripts/verify-cite-coverage.mjs` | 0 |

- gate-2：**187 tests / 187 pass / 0 fail**（含 `tests/compare-audit.test.mjs` 11 例）。
- gate-2b：12 tests 全过，含「真实检查点锚点可在账本兑现，覆盖页窗口与检查点同口径」。
- gate-4 构建产物：1 142 个 HTML、46 635 个内部引用、314 个时间轴 / 2 490 张事件卡、482 个档案页全部通过。

### 3.1 两次连续全量运行不一致的说明（如实记录）

同一份门禁链先后跑出三种结果：

1. 首跑：`compare-audit` 失败，`audit.undecided.length === 3`——`madqa` / `finance-agent-v2` /
   `finworkbench` 在 `data/compare-rules.json` 里没有任何换算决定；
2. 二跑：`undecided` 归零，但 `audit.stranded.length === 1`——`finance-agent-v2` 下
   `muse-spark-1-1` 的 `metric: "accuracy"` 被判「指标与计分口径不同」；
3. 三跑及之后 3 次独立复跑：11/11 全过，`rowIssue()` 对该行返回 `null`。

原因不是逻辑分歧，而是**并发 worker-sf 会话在这两次运行之间写入了 `data/compare-rules.json`**：
三条 `decision: "score"` 规则（含 `metric_aliases["finance-agent-v2"] = ["accuracy"]`）是在我诊断
过程中由并发会话落盘的，最终随 `e4e3ab3` 提交。第二次运行读到的是写入过程中的中间态。
当前状态已用 3 次独立复跑确认确定性通过；`data/compare-rules.json` 现为 185 条规则、16 组同义写法。

三条决定的口径依据（写在规则的 `basis` 字段里，与评估档案原文一致）：

- `madqa` → `accuracy`（0–100，越高越好）：主指标，精确匹配 + LLM 语义裁判，Correct 1.0 /
  Partial 0.5 / Incorrect 0，Rogan-Gladen 偏差校正。Page F1 / Doc F1 是归因诊断，Kuiper 与步数、
  推理成本是努力校准与效率，均不并入 0–100。
- `finance-agent-v2` → `partial-credit`（0–100）：官网 v2 榜单 Accuracy 列即 Partial Credit
  （逐检查严重度加权，任一 dealbreaker 失败整题计 0）。All-Pass 是次指标。
- `finworkbench` → `workflow_pass_rate`（0–100）：以人工评估为金标准的二分判定，分母 172 个
  工作流。`judge_agreement` 是裁判有效性统计，`rubric_score` 是 LLM 自动评估口径（论文据此提示
  可能高估准确率），均不并入 0–100。

## 4. ≥10% 引文复抓（独立复核）

工具：现已在库内 `scripts/v2-rollout/reverify.py`（当时跑的是原机
`/workspace/rollout/reverify.py`，同源）。样本 66 个 id =
477 个可复核页等距抽样 `[::8]` 再加上 6 个重点页（`swebench` / `swebench-pro` /
`multimodal-knowledge-agent` / `apex` / `biomysterybench` / `hlehle`）。
**样本率 64/510 = 12.5%（占 482 个已建档页 13.3%），满足 ≥10%。**

抓取前对每个来源 URL 的直抓缓存和 jina 兜底缓存**都做了 md5 purge**（642 个缓存条目，
见 `logs/reverify-10pct-cache-purge.log`），确保不是读旧缓存。

| 指标 | 数值 |
| --- | --- |
| 参与复核页 | 64 |
| 逐字命中 | 4 298 |
| missing（该来源抓到了但摘录对不上） | 53 |
| unverified（该来源整组都没命中） | 37 |
| unfetchable（来源抓不到） | **0** |
| 完全干净（missing=0 且 unverified=0） | 37 |
| missing>0 的页 | 21 |
| unverified>0 的页 | 10 |

`apex` 与 `biomysterybench` 无法用 `reverify.py` 复核：两者是 v0 schema 实体，没有 `profile`
键，脚本在 `b['profile']['sources']` 处 `KeyError`。这是脚本对 v0 的已知边界，不是核验失败；
两页的摘录已由 §1 的 `check-one.mjs` 逐字核验覆盖（125 / 77 条，`quotes_bad: 0`）。

### 4.0 480 个干净页的上一轮复抓残差（`logs/audit-gate-t83-480.tsv`）

同一场复抓运动里，480 个完全干净的页先过了一轮「重抓后逐条比对」，残差如下
（`check_err` 全部为 0，即没有一页因解析失败而未参与）：

| 残差类型 | 条数 | 涉及页数 | 最差页 |
| --- | --- | --- | --- |
| `fresh_missing`（重抓到了但摘录对不上） | 191 | 52 | `skillsbench` 18 / `healthbench` 12 / `benchcad` 11 / `motionbench` 10 / `swe-marathon` 9 |
| `unverified`（该来源整组都没命中） | 319 | 43 | `swe-marathon` 46 / `critpt` 22 / `terminal-bench-science` 21 / `program-bench` 19 / `mmmu-pro` 15 |
| `unfetch`（来源抓不到） | 63 | 43 | `arena` 4 / `critpt` 3 / `aime24` 3 / `dense200` 3 / `swe-marathon` 2 |
| `fresh_found = 0` 的页 | — | **0** | 每一页都至少有一条重抓命中 |

`unverified` 与 `fresh_missing` 的差值（319 − 191）说明多数「没命中」发生在整组来源层面，
即该来源这次抓取的内容与建库时不同（改版、JS 渲染、分页），而不是个别摘录写错。
这与 §4.1 对 53 条 missing 的逐条归因结论一致（60.4% 属来源 drift）。

### 4.1 53 条 missing 摘录的归因（`logs/reverify-10pct-missing-class.txt`）

对每条 missing 摘录，在**同一评测页的全部来源**里重新找逐字命中：

| 归因 | 条数 | 含义 |
| --- | --- | --- |
| 同页其它来源逐字命中 | **21**（39.6%） | 事实真实，`cite` 指向的来源写错——可定位、可修 |
| 该来源已抓取但逐字找不到 | **32**（60.4%） | 来源改版或需重抓 |
| 来源抓取为空 | 0 | — |
| 摘录不在库存 | 0 | — |

21 条「指向错来源」集中在 10 个页面，是可执行的修复队列（不是数据造假信号）；
32 条 drift 需要重抓后才能判断，本窗口不重抓（见 §7 遗留项 3）。

## 5. 10 页内容抽检

样本（`logs/spotcheck-10pages-report.md`）：按 cites 排序取前 6（`mtvqa` / `program-bench` /
`mceval` / `shade-arena` / `swe-atlas-test-writing` / `swe-fficiency`），加分布中段 4 页
（`lvbench` / `mtbench` / `refspatialbench` / `tomato`）。

| 指标 | 数值 |
| --- | --- |
| 页数 | 10 |
| 来源数 | 53 |
| 摘录数 | 923 |
| claim 数 | 554 |
| cite 引用次数 | 1 184 |
| **没有同 locator 摘录的 cite** | **0** |
| `"-"` 占位符 | **0** |

数值可追溯性：对 claim 里的数字逐条回查抓取原文，28.7% 的 claim 数字不在所挂摘录的
locator 内（同来源不同小节，或由多个来源推导）。直接 grep 抓取原文确认：抽检的 12 个代表性
数字**全部真实存在于原始抓取文本**。初版分类器把数字池和模式串的逗号处理不一致，误报率
50.6%，两边都去掉逗号后降到 28.7%——残余部分是 locator 覆盖度问题，不是编造。

**这条 28.7% 是本窗口发现的真实质量缺口**（非阻塞）：v2 档案重写时应把每个 claim 的数字
挂到它实际来自的 locator 上，而不是笼统挂到页面级来源。

## 6. 增量窗口落账核验（执行日 2026-11-24）

`node .claude/skills/ingest-releases/scripts/checkpoint.mjs status`
（下面这行是 2026-11-24 23:51 UTC 跑出的原样输出；`today` 与 `window_until` 会随运行日滚动，
2026-11-25 再跑会变成 `2026-11-25`，这是脚本行为，不是检查点被手改）：

```json
{"today":"2026-11-24","last_scan_at":"2026-11-24","ledger_max_release_date":"2026-11-20",
 "official_release_count":246,"window_since":"2026-11-06","window_until":"2026-11-24",
 "overlap_days":14,"first_run":false}
```

- 窗口 `2026-11-06 → 2026-11-24`，锚点单调不回退（`last_max_release_date` 2026-11-12 → 2026-11-20），
  由 `checkpoint.mjs` 维护，未手改。
- 账本内落在该窗口的 release 实体 **24 个**（20 `verified` + 4 `pending`）。
- 本批正规落账在提交 `8f851df`：**11 个 release / 509 条 evidence**（496 verified + 13 pending），
  13 个归档目录（`index.md` + 逐文件 sha256 的 `manifest.json` + `page.html`；
  `inkling-2-mini` 另含 `model-card.html`），候选 706 → 731（入口扫描 +23，另主动登记
  `release-decision-1-1` / `release-medchembench` 两条合成候选），未决候选 0。
  `/goal` 里的「23 候选」对应这 +23；落账实体 11 个，窗口内另有 13 个是先前批次入库、
  本批只做复验的。
- 漏项补齐：Decision 1.1 此前无 release 实体已补建；`medchembench` 补齐同页 GPT-6.2 Astra
  总榜 5 档；`tml-d24-varloop-research` 与 `inkling-2-mini` 共用 DOM 对比表补齐 265 行；
  `reconcile-coverage.mjs` 合成候选 URL 去重。
- `tests/release-ingest.test.mjs` 12 例全过，其中「真实检查点锚点可在账本兑现」用真实账本校验。

## 7. 遗留项（交给本地 agent，均不阻塞集成）

1. **发布侧 6 行未闭环**（`/workspace/rollout/published.tsv`，326 行：320 `ok` / 4 `pending` /
   2 `failed`）。`pending`：`one-million-bench`、`openai-error-inducing-prompts`、
   `openai-gif-moderation-recall`、`ovbench`——四条 Actions URL 均为空，即从未成功触发过
   Pages 部署。`failed`：`nl2repo`、`olympiadbench`。
   `STOP_PUBLISH` 生效期间不重试；本地接管后按 T80 的 A 序处理。
2. **两个 v1 页不进 backlog 的账实不一致**：`multimodal-knowledge-agent` 与 `swebench-pro`
   模板仍是 `benchmark-profile/v1`，但不在 28 id 的 backlog 里。`validate-data.mjs` 两种写法
   都过（backlog 里有 profile 才报错），棘轮「只减不增」，且并发会话可能正在升级这两个页面，
   因此本窗口**没有改 backlog**。建议本地确认无并发升级后，把这两个 id 补进 backlog，
   或在升级完成后从 28 减到 26。
3. **32 条来源 drift + 21 条 cite 指错来源**（§4.1）：需要重抓后才能定性。重抓前不要改摘录。
4. **v2 档案重写时把 claim 数字挂到真实 locator**（§5 的 28.7%）。
5. **`evals.epub` 未提交**：`npm run build` 会重写它（497 425 字节二进制，内容变化）。
   本窗口把它还原成 HEAD 版本，不并入提交，避免构建产物污染 diff。
6. **48 页 / 145 个「账本独有来源」的裁剪决策**（§9 的差异 B2，承载 2 345 条摘录 = 6.2%）。
   不影响页面可追溯性，本窗口建议保留作审核留痕；若接手方要瘦身，必须先确认这 145 个 sid
   没有任何页面打算后续引用。
7. **`/workspace/rollout/out/` 与仓库内 `data/model-coverage.json` 的双向分歧**：rollout 侧
   候选 JSON 数 494、`gate.lock` 记 502，与仓库 496 不一致。该目录是发布侧工作产物、不随
   交接提交，接手方以仓库内 `data/model-coverage.json` 与 `gate.lock` 为准，不要从 out/ 回灌。

---

## 8. 干净 clone 复现验证（T98u 第 5 条）

T98u 第 5 条要求「用干净克隆、只含准备提交的仓库内容验证交接命令，记录实际结果，
不伪称完工」。完整回显在 `logs/clean-clone-20261125/`（12 个文件）。

**构造方式**：`git clone --no-hardlinks /workspace/t83-integ /workspace/t98-cleanclone`
→ 套用交接补丁 `/workspace/t98-staged.patch`（9 文件）→ 叠加「准备提交的未跟踪内容」。
只 clone 不叠加等于验证空壳（本次交接 568 条待提交路径里 559 条是未跟踪文件）。

| 验证项 | 结果 |
| --- | --- |
| 环境 | node v24.22.1 / npm 11.21.1；`npm ci` 成功；clone 内 HEAD `b992272` |
| 8 步门禁 | **8 / 8 exit 0**（§3 表格同口径，`gate-6` 回显 `结果: PASS`） |
| 逐字引文 | `hlehle` 全 6 个来源从实时网络重抓 → `{"id":"hlehle","cites":31,"quotes_ok":70,"quotes_bad":0,"errors":0}`，exit 0 |
| 内容等价 | 3 783 个共同路径 sha256 逐字节一致；0 缺失、0 意外差异 |
| 账本/来源审核 | 在 clone 内复跑，输出与主控侧完全一致（§9） |

### 8.1 gate-6 在 clone 内的实测数字

```
页数               510   （v2    480 / v0     30）
cite 定位符      12778
账本摘录         39279
失败页               0
悬空 cite            0
过短摘录             0
重复摘录             0
未被引用来源         0
缺失账本(有cite)     0
结果: PASS
```

> `gate-summary.log` 第 5 行「领先 origin/main: 330 个提交」是 clone 假象，**不要采信**：
> clone 的 `origin` 指向 `/workspace/t83-integ`，其 `origin/main` 仍是本地陈旧的 `main`
> （`84f4a00`），不是真正的远端 `origin/main`（`fc56a57`）。真实领先数以
> `git rev-list --count fc56a57..HEAD` 为准（当前 5）。

### 8.2 本次验证发现并修复了一个真实缺陷

clone 内首次跑 `srcfetch.py` 报
`FileNotFoundError: '/workspace/t98-cleanclone/data/fresh/af1167….txt'`。

根因：`scripts/v2-rollout/helpers/_rv.py` 用 `ast` 从 `reverify.py` 只抽取
`norm/fetch/jina/hit` 四个**函数体**，`reverify.py:11` 的模块级
`os.makedirs(FRESH_DIR, exist_ok=True)` 不会被执行；而 `fetch()` 在缓存未命中时直接
`open(FRESH_DIR/<md5>.txt, 'w')`。于是干净 clone 上首次抓取必崩。修复：在 `_rv.py`
路径解析之后补上同一动作（已随本交接入库）。`VIEW_DIR` 不需要同样补——
`srcfetch.py:21` 自己会 `makedirs($VIEW_DIR/<bid>)`（含父目录）。

**这个缺陷只有在干净 clone 里从零跑一遍才会暴露**：主控工作树上 `data/fresh/` 早就存在，
所以一直看不出来。修复后已用 `rm -rf data/fresh data/view` + 重跑同一命令复证通过。

### 8.3 语料为什么不在库里

逐字比对需要 `data/evidence/<id>/<sid>.txt`（约 2.2 GB 原始抓取文本），
**不随交接提交**（体积 + 可再生）。接手方按需重建：

```bash
python3 -I scripts/v2-rollout/helpers/srcfetch.py <id> <sid> <url> ...
EVIDENCE_DIR=data/evidence node scripts/check-one.mjs data/benchmarks/<id>.json
```

`data/evidence/*.evidence.json`（引文账本，496 个文件 / 6 959 995 B / 39 279 条摘录）
**是提交进库的**，它是唯一保存逐字摘录原文的地方；`<id>/<sid>.txt` 只是用来核验账本的语料。
只有账本、没有语料时，应改用 `node scripts/verify-cite-coverage.mjs`（纯仓库内输入的结构核验），
`check-one.mjs` 在语料目录整体缺失时会输出 `corpus: "absent"` 并 exit 2——
那是「无法比对」，不是「通过」。

---

## 9. 账本/来源一致性审核（本窗口新增）

`scripts/handoff/audit-ledger-sources.mjs`（新入库，`--fail-on A` 可用于门禁）。
它补的是**原本不在任何门禁里的反向缺口**：`verify-cite-coverage.mjs` 只查单向
（声明了来源但没被页面引用），不查「页面引用了一个 `profile.sources` 里没声明的 source id」。

| 分类 | 定义 | 实测 |
| --- | --- | --- |
| 缺口 A | 页面 `cite` 指向某个 sid，但 `profile.sources` 没声明它 | **0 页 / 0 个 sid** |
| 差异 B2 | 账本里有摘录，但页面既未声明也未引用该 sid | **48 页 / 145 个 sid** |

- **缺口 A = 0**：480 个 v2 页没有一个引用了未声明来源。可追溯性在「声明面」上是闭合的。
- **差异 B2 = 48 页 / 145 个 sid**：账本比页面宽。实测这些 sid 承载 **2 345 条摘录**，
  占 v2 页账本 37 701 条的 **6.2%**。属于建库时多抓了来源，不影响任何页面的可追溯性，
  本窗口**不建议裁剪**（裁剪会丢失审核留痕，且没有页面在引用它们）。列入 §7 遗留项 6。

每页明细：`logs/clean-clone-20261125/ledger-sources.tsv`（510 行，列 = id / template /
declared / pageCited / ledger / gapA / gapB2）。
