# 交接材料 — benchmark-profile/v2 存量升级与 2026-11-24 增量窗口（t83 / t78）

> **给接手 agent 的第一句**：先读本文件 §2 把门禁链跑一遍（8 步，预期全绿），
> 再读 `AUDIT-REPORT.md` 看审核结论与遗留项，最后按 `manifests/README.md` 的账目决定下一步。
> **部署没有做，也不要从本分支直接 `git push origin main`**——见 §1.3。

本目录是**可干净 clone 复现**的交接包：引文账本、校验脚本、门禁日志、账目清单全部随仓库分发，
除原始抓取语料（可按 URL 重新抓取）外不依赖 `/workspace` 绝对路径、不含密钥、不含二进制大文件。
审核结论见 `AUDIT-REPORT.md`，逐项账目见 `manifests/README.md`，日志明细见 `logs/`。

---

## 1. 交接时的仓库状态

### 1.1 分支与提交

| 项 | 值 |
| --- | --- |
| 分支 | `t83-integ`（工作树 `/workspace/t83-integ`） |
| HEAD | `b992272` |
| 领先 `origin/main` | **5** 个提交 |
| 未推送、未建 PR、未触发 Actions | 是（按 T87 / T91 / t98u 明确指令） |

5 个提交（新 → 旧）：

| SHA | 职责 |
| --- | --- |
| `b992272` | docs(handoff)：说明 `logs/` 原始回显带原机路径、仅作证据 |
| `70d3e36` | docs(handoff)：v2 升级交接目录（干净 clone 可复现，含门禁日志与 issue 草稿） |
| `e4e3ab3` | feat(benchmarks)：108 个存量评测升级为 v2 深度档案（全量门禁通过） |
| `dd431ad` | feat(benchmarks)：46 个存量评测升级为 v2 深度档案（门禁复验通过） |
| `8f851df` | feat(releases)：增量窗口至 2026-11-24 正规落账——11 个 release / 509 条 evidence，并重构 ingest-releases 技能脚本 |

`dd431ad` 同时做了：引文补齐、`data/compare-rules.json` 口径决定、
`reconcile-coverage.mjs` 去重修复、backlog 棘轮 135 → 28。
`e4e3ab3` 收口：三条缺失 compare 决定（`madqa` / `finance-agent-v2` / `finworkbench`）、
`metric_aliases` 补充、2 个 Thinking Machines release JSON。

### 1.2 工作树**未**提交干净（交接时点实测，2026-11-25 10:05 CST）

`git status --porcelain` 有 **48 条**记录 = 10 个已修改跟踪文件 + 38 条未跟踪项。
其中 5 条未跟踪项是目录聚合，展开后**未跟踪共 559 个文件**，加上 10 个已修改跟踪文件，
**待提交合计 569 个路径**：

| 类别 | 条数 | 展开后文件数 |
| --- | --- | --- |
| 已修改跟踪文件 | 10 | 10 |
| `data/evidence/`（目录聚合） | 1 | 496 |
| `docs/handoff/v2-upgrade-20261124-t83/logs/clean-clone-20261125/`（目录聚合） | 1 | 12 |
| `docs/…/logs/gate-rerun-20261125/`（目录聚合） | 1 | 9 |
| `docs/…/manifests/`（目录聚合） | 1 | 5 |
| `scripts/handoff/`（目录聚合） | 1 | 4 |
| `docs/…/logs/` 下零散文件（26 个：`logs/` 顶层非聚合项） | 26 | 26 |
| **合计** | **48** | **569** |

**这批内容是准备提交项，不是脏垃圾**，但因为 t98u 规定「唯一集成写入者是 t83 会话」，
本侧未代为 commit，交由集成写入者执行：

- **已修改（10 个跟踪文件）**：`.gitignore`（外置语料忽略规则 + pycache）、
  根 `README.md`（新增「仓库维护 / 接手 agent 入口」块，指向本文件）、
  `scripts/v2-rollout/reverify.py` 与 `helpers/{addquote,srcfetch}.py`（改为从 `helpers/_rv.py`
  取 `EVIDENCE_DIR` / `VIEW_DIR`，不再依赖 `/workspace/rollout` 扁平根）、
  `data/benchmarks/{hlehle,multimodal-knowledge-agent,swebench-pro}.json`、
  两个 handoff 文档（`README.md`、`issue-draft.md`）。
- **未跟踪（38 条 → 559 个文件）**：
  - `data/evidence/` — 496 个引文账本（6 959 995 B）
  - `scripts/{check-one.mjs,verify-cite-coverage.mjs,verify-quotes.mjs,dedupe-evidence-quotes.mjs}`
  - `scripts/handoff/{run-gate.sh,candidates-window.mjs,audit-ledger-sources.mjs,compare-clones.mjs}`
  - `scripts/v2-rollout/helpers/_rv.py`
  - `docs/handoff/v2-upgrade-20261124-t83/` 下的 `AUDIT-REPORT.md`、`T98-HANDOFF-PRIORITY.md`、
    `manifests/`（5 个）、`logs/`（52 个，含 `clean-clone-20261125/` 12 个与
    `gate-rerun-20261125/` 9 个）

### 1.3 为什么没有 push（硬约束，勿绕过）

`.github/workflows/build-epub.yml` 的 `deploy` job 条件为
`github.ref == 'refs/heads/main' && (github.event_name == 'push' || github.event_name == 'workflow_dispatch')`。
因此 **push 到 `main` 会自动部署 GitHub Pages**。`STOP_PUBLISH` 与 t98u 均禁止自动部署，
授权范围内无法安全避免，故本侧**只做到本地 commit，不 `git push origin main`**，
也没有修改 workflow 去绕过部署条件。

已核对：`fc56a57`（§8 的 CI 修复）**已在 `origin/main`**，不是本分支新增。

---

## 2. 干净 clone 后的复现步骤

```bash
git clone <repo-url> && cd <repo>
git checkout t83-integ          # 或等合并后 checkout main 并拉到 b992272
npm ci

# 门禁链（8 步，预期全部 exit 0）
node scripts/reconcile-coverage.mjs                                  # 1
node --test tests/*.test.mjs                                         # 2
node --test tests/release-ingest.test.mjs                            # 3
node scripts/validate-data.mjs                                       # 4
node scripts/validate-model-coverage.mjs                             # 5
npm run build                                                         # 6
npm run sync:skills:check                                             # 7
node scripts/verify-cite-coverage.mjs                                 # 8（本次新增）

# 增量窗口状态（应报 today=执行日，last_scan_at 单调不回退）
node .claude/skills/ingest-releases/scripts/checkpoint.mjs status
```

也可以一键跑完 8 步并把每步回显落盘（脚本本身已入库，路径无关）：

```bash
bash scripts/handoff/run-gate.sh <日志目录>
# 例：bash scripts/handoff/run-gate.sh /tmp/gate-check
# 产出 <日志目录>/gate-summary.log + 每步一个 <name>.log，末尾打印 8 条 [exit=N]
```

**注意 `npm run build` 的两个副作用**（会让跟踪文件变脏，提交前必须还原）——见 §2.2。
干净 clone 里跑完只需 `git checkout -- evals.epub data/generated/auto-benchmark-ids.json`。

### 2.1 预期关键输出（2026-11-25 01:21 UTC 在 `t83-integ`，HEAD `b992272` 实测）

| 步 | 预期 |
| --- | --- |
| 1 `reconcile-coverage.mjs` | **成功时无 stdout 输出、exit 0**。不要因为没看到「候选 731」而判失败——那个数字不在它的输出里（候选账本见 `data/generated/auto-benchmark-ids.json`，`total: 293`） |
| 2 `node --test tests/*.test.mjs` | `pass 187 / fail 0`（duration ~22 s） |
| 3 `node --test tests/release-ingest.test.mjs` | `pass 12 / fail 0` |
| 4 `validate-data.mjs` | `PASS — taxonomy 9 类 / vendors 18 / benchmarks 510 / releases 260（official 246）/ evidence edges 4625`；模板档案 **482** 通过，待升级存量 **28** |
| 5 `validate-model-coverage.mjs` | 无输出、exit 0 |
| 6 `npm run build` | `链接检查 1142 个 HTML / 46635 个内部引用`；`314 个时间轴 / 2490 张事件卡片`；`482 个评测页`；`validate-site 全部通过` |
| 7 `sync:skills:check` | `✓ 技能镜像无漂移，与 canonical 完全一致` |
| 8 `verify-cite-coverage.mjs` | 见下方代码块，**exit 0** |

第 8 步的完整实测输出：

```
引文账本结构核验（仅仓库内输入，无网络、无外置语料）
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

`checkpoint.mjs status`：`last_scan_at` 应为 `2026-11-24`（单调不回退）；
`today` 与 `window_until` **会随运行日滚动**——在 2026-11-25 及之后运行会报
`today: 2026-11-25` / `window_until: 2026-11-25`，这是预期行为，不是检查点被改过。

已落库的三次全量执行回显（可直接对照，不必重跑就能判断环境是否一致）：

| 日志 | HEAD | 时间(UTC) | 结果 |
| --- | --- | --- | --- |
| `logs/clean-clone-20261125/gate-summary.log` + 8 个 `<name>.log` | `b992272` | 2026-11-25 01:43 | **8 / 8 步 exit 0**（在干净 clone 内） |
| `logs/gate-rerun-20261125/gate-summary.log` + 8 个 `<name>.log` | `b992272` | 2026-11-25 01:21 | **8 / 8 步 exit 0**（在主控工作树） |
| `logs/gate-full-20261125-0753.log` | `dd431ad` | 2026-11-24 23:51（本地 CST 07:51） | 7 / 7 步 exit 0（**当时还没有第 8 步** `verify-cite-coverage`，见下方说明） |

第三行是历史记录：那一轮门禁链还只有 7 步，`verify-cite-coverage`（第 8 步）是后来补上的，
所以它是 7/7 而不是 8/8。前两行才是当前口径。

前两者由入库脚本 `scripts/handoff/run-gate.sh` 生成（即上面「一键跑完」那条命令的产物），
含 `worktree / branch / HEAD / node / npm / 领先 origin/main 提交数` 的运行环境头，
便于判断手上的 clone 与交接时点是否同源。

⚠️ **clone 版 `gate-summary.log` 里的「领先 origin/main: 330 个提交」是 clone 假象**，
不要采信：clone 的 `origin` 指回 `/workspace/t83-integ`，其 `origin/main` 还是本地
陈旧的 `main`（`84f4a00`），不是真正的远端 `origin/main`（`fc56a57`）。
真实领先数以主控工作树 `git rev-list --count fc56a57..HEAD` 为准（实测 5）。

### 2.2 ⚠️ 门禁链不幂等：跑完必须还原两个文件

`npm run build`（第 6 步，必跑）有两个副作用，会让跟踪文件变脏：

1. `data/generated/auto-benchmark-ids.json` 的 `updated` 被写成**运行日**
   （`scripts/build-benchmarks-hub.mjs:1168` 用 `new Date().toISOString().slice(0,10)`）。
2. `evals.epub` 是**不确定性二进制**（同尺寸 497425 B，内容每次不同）。

提交前必须还原，否则会把构建日期和二进制差异混进提交：

```bash
git checkout -- evals.epub data/generated/auto-benchmark-ids.json
```

（本交接时点已实测并还原；`git status --porcelain evals.epub` 为空即干净。）

### 2.3 已在干净 clone 里完整验证过一次（不是纸面声明）

T98u 第 5 条要求用干净克隆验证交接命令。**已做**，原始回显在
`logs/clean-clone-20261125/`（含 `gate-summary.log` + 8 个分步日志 + 等价性比对回显）。
构造方式与实测结论：

```bash
git clone --no-hardlinks <工作树> /tmp/clean        # 非 shallow、非 hardlink
cd /tmp/clean && git checkout t83-integ
npm ci                                              # 成功
bash scripts/handoff/run-gate.sh /tmp/gate          # 8 / 8 步 exit 0
```

| 验证项 | 实测结果 |
| --- | --- |
| 八步门禁 | **8 / 8 exit 0**，第 8 步 `结果: PASS`（510 页 / 12 778 cite / 39 279 摘录 / 0 失败） |
| 与工作树逐字节等价 | 3 783 个共同路径中 **0 缺失 / 0 意外差异**（唯一差异是 README 版本新旧） |
| `hlehle` 逐字引文 | 6 个来源**从实时网络重新抓取**后仍 `{"cites":31,"quotes_ok":70,"quotes_bad":0,"errors":0}` |
| 账本/来源一致性 | 缺口 A **0 页**；差异 B2 48 页 / 145 sid（见 §3.4） |

**验证过程发现并修复了一个只有干净 clone 才会暴露的缺陷**（`srcfetch.py` 在
`data/fresh/` 不存在时必崩），根因与修复见 §3.2。主控工作树上该目录一直存在，
所以此前看不出来——这正是必须做干净 clone 验证的理由。

⚠️ clone 的 `origin/main` 指向本地陈旧 `main`，`gate-summary.log` 的「领先 N 个提交」
在 clone 里不可信，判断同源性请用 HEAD SHA（应为 `b992272`）。

---

## 3. 引文证据：账本在仓库内，语料在仓库外

这是本次交接相对旧版说明的**最大变化**：逐字核验现在**可以在干净 clone 内跑结构性部分**。

分两层，边界务必分清：

| 层 | 路径 | 规模 | 随仓库分发 | 用途 |
| --- | --- | --- | --- | --- |
| **引文账本** | `data/evidence/<page_id>.evidence.json` | **496 个文件 / 6 959 995 B（6.96 MB）/ 39 279 条摘录** | **是** | 逐字摘录文本的**唯一**存放处 |
| 原始抓取语料 | `data/evidence/<page_id>/<source_id>.txt` | ~3 852 文件 / 2.2 GB | 否（`.gitignore` 忽略 `data/evidence/*/`） | 逐字比对的比对基准 |

结构：`{"id":…, "quotes":[{"cite":"<sid>@<locator>", "quote":"<verbatim>"}]}`。
**为什么账本必须入库**：`data/benchmarks/*.json` 只存 `cite` 定位符和分节键，
**不存摘录正文**；摘录的逐字文本只存在于账本。不入库则干净 clone 无法做任何引文核验。

### 3.1 干净 clone 内可跑的三级核验

```bash
# A. 结构核验（无网络、无语料，全仓库 510 页）
node scripts/verify-cite-coverage.mjs                 # 全量
node scripts/verify-cite-coverage.mjs <id> [<id>...]  # 指定页

# B. 逐字核验·单页（需要外置语料）
EVIDENCE_DIR=<含 <id>/<sid>.txt 的证据根> node scripts/check-one.mjs data/benchmarks/<id>.json

# C. 逐字核验·批量（需要外置语料）
EVIDENCE_DIR=<证据根> node scripts/verify-quotes.mjs data/benchmarks/<id>.json
```

`check-one.mjs` 输出一行 JSON `{id, cites, quotes_ok, quotes_bad, errors}`，
随后最多 60 行 ` - <明细>`；有未解决项时 `exit 1`。
**语料整目录缺失时**它报 `corpus: "absent"` 并 `exit 0`——这是「无法比对」，
**不是「内容通过」**，读结果时不要混淆。

`verify-cite-coverage.mjs` 与 `check-one.mjs` 的分工：
前者只回答「每条 cite 是否在账本里有逐字摘录、账本自身是否自洽」，输入全在仓库内；
后者回答「摘录是否逐字出现在原始抓取文本里」，需要外置语料。
前者不能替代后者，但能在集成前拦住悬空 cite / 过短摘录 / 重复摘录 / 来源未被引用。

### 3.2 重建外置语料

语料可按页面 `profile.sources[].url` 重新抓取，**不需要保留旧文件**：

```bash
# 单个来源（已入库脚本，路径无关）
python3 -I scripts/v2-rollout/helpers/srcfetch.py <benchmark-id> <source-id> <url>
# 可多组：srcfetch.py <id> sid1 url1 sid2 url2 ...
```

环境变量（均可覆盖，无默认秘密；**不设置也能跑**，默认值全部落在仓库内）：

| 变量 | 默认值 | 被谁读取 |
| --- | --- | --- |
| `EVALS_REPO` | 从脚本位置向上推两级得到 `<repo>` | `reverify.py`、`_rv.py` |
| `ROLLOUT_ROOT` | `<repo>/data` | `reverify.py`、`_rv.py`（扁平数据根） |
| `EVIDENCE_DIR` | `<repo>/data/evidence` | 账本 `<id>.evidence.json` + 原文 `<id>/<sid>.txt`：`reverify.py`、`check-one.mjs`、`verify-quotes.mjs`、`verify-cite-coverage.mjs`、`srcfetch.py`（写原文）、`addquote.py`、`_rv.py` |
| `VIEW_DIR` | `<repo>/data/view` | `srcfetch.py`、`_rv.py`（纯文本视图） |
| `FRESH_DIR` | `<repo>/data/fresh` | `srcfetch.py`、`_rv.py`（抓取缓存；`_rv.py` 导入时自建） |
| `REVERIFY_PY` | `<repo>/scripts/v2-rollout/reverify.py` | `_rv.py`（要抽取实现的源文件） |

**已知边界（接手时别被咬）**：`reverify.py` 里的 `fetch()` / `jina()` 缓存路径写的是
`$ROLLOUT_ROOT/fresh/<md5>.txt`，**只认 `ROLLOUT_ROOT`，不认单独的 `FRESH_DIR` 覆盖**
（`FRESH_DIR` 在那里仅用于 `makedirs`）。`_rv.py` 已按 `FRESH_DIR` 正确注入，所以
`srcfetch.py` / `check-one.mjs` / `verify-quotes.mjs` 的 `FRESH_DIR` 覆盖是生效的。
日常不需要覆盖任何变量；真要改缓存位置，就一起改 `ROLLOUT_ROOT`。

依赖（无密钥、无 token、全部可从公开源安装）：

| 类别 | 依赖 |
| --- | --- |
| npm（`package.json` 唯一运行时依赖） | `jszip ^3.10.1`（EPUB 打包用；`npm ci` 安装，无需额外源） |
| 系统命令 | `curl`、`pdftotext`（poppler-utils）、`python3`、`node` |
| 第三方 Python 包 | **无**（只用标准库；`-I` 隔离运行） |

**干净 clone 上不需要先 `mkdir data/fresh data/view`**：`_rv.py` 会在导入时自建
`FRESH_DIR`（`VIEW_DIR` 由 `srcfetch.py` 的 `makedirs($VIEW_DIR/<bid>)` 顺带建）。

实测（干净 clone，`rm -rf data/fresh data/view` 之后直接跑）：

```bash
python3 -I scripts/v2-rollout/helpers/srcfetch.py hlehle paper https://arxiv.org/abs/2501.14249
# → {"sid":"paper","url":"https://arxiv.org/abs/2501.14249","chars_fetch":280040,
#    "chars_jina":0,"view":"…/data/view/hlehle/paper.txt","usable":true}
```

> 历史坑（已修复，留档防复发）：`_rv.py` 用 `ast` 只从 `reverify.py` 抽取
> `norm/fetch/jina/hit` 四个**函数体**，`reverify.py:11` 的模块级
> `os.makedirs(FRESH_DIR)` 不会执行，而 `fetch()` 缓存未命中时直接
> `open(FRESH_DIR/<md5>.txt,'w')`。修复前干净 clone 上首次抓取必报
> `FileNotFoundError: …/data/fresh/af1167….txt`。

### 3.3 本次实测发现并已修复：16 条重复摘录

`verify-cite-coverage.mjs` 首次全量跑时报 **16 条重复 `(cite, quote)` 条目**（涉及 10 个页面）。
已用入库脚本 `scripts/dedupe-evidence-quotes.mjs` 去掉（保留每个 `(cite, quote)` 的首次出现，
纯删除、不改文本），账本摘录 **39 295 → 39 279**。

已核对去重是**纯删除**：与主控证据库 `/workspace/rollout/evidence/` 逐条比对，
10 个变动文件的 `(cite, quote)` 集合均为原集合的**严格子集**（`only-repo=0 only-master=0`），
无任何文本被改写。去重后 `verify-cite-coverage.mjs` 全绿（见 §2.1 第 8 步）。

若以后再遇到，复跑即可（幂等）：`node scripts/dedupe-evidence-quotes.mjs --dry-run` 先看再写。
该脚本会反推每个文件原有的 JSON 缩进与末尾换行，**推不出格式就跳过并报告**，绝不重排文件。

### 3.4 新增审核：页面引用 vs 账本来源（缺口 A = 0）

`verify-cite-coverage.mjs` 只查**单向**：`profile.sources` 里声明了却没被页面引用的来源
（「未被引用来源」）。反向——**页面引用了某个 `<sid>`，但 `profile.sources` 里没声明它**——
此前不在任何门禁里，`check-one.mjs` 也不看（只要 `data/evidence/<id>/<sid>.txt` 存在，
逐字比对就能过）。结果是「页面挂了一个读者查不到出处的引用」也能全链全绿。

已入库 `scripts/handoff/audit-ledger-sources.mjs` 补这个方向，并把偏差分成两类：

| 类 | 定义 | 实测 | 性质 |
| --- | --- | --- | --- |
| **缺口 A** | 页面引用了 `<sid>`，但 `profile.sources` 未声明 | **0 页 / 0 sid** | 可追溯性缺口（**实测为 0**） |
| **差异 B2** | 账本里有 `<sid>` 的摘录，但页面既未声明也未引用 | **48 页 / 145 sid** | 账本比页面宽，不影响页面可追溯性 |

```bash
node scripts/handoff/audit-ledger-sources.mjs                 # 只打汇总
node scripts/handoff/audit-ledger-sources.mjs -o out.tsv      # 每页明细
node scripts/handoff/audit-ledger-sources.mjs --fail-on A     # 有缺口 A 则 exit 1
```

B2 的 145 个 sid 承载 **2 345 条摘录**（占 v2 页账本 37 701 条的 **6.2%**）。
它们是研究阶段抓取、最终页面没用上的证据。**建议保留作审核留痕**，不要为了「对齐」删——
删了反而丢掉「当初核过什么」的记录。若确实要裁，先 `-o` 落明细再逐页确认。

每页明细（510 行）已落库：`logs/clean-clone-20261125/ledger-sources.tsv`。

---

## 4. 发布流水线的仓库外暂存区 `/workspace/rollout/out/`（**与仓库已双向分叉**）

`out/` 是逐页发布流水线的暂存产物目录，**在仓库之外**（`/workspace/rollout/` 下），
**不随 clone 分发**，也不在本分支的 `git status` 里。t98u 要求交接包不得依赖它——
本包确实不依赖：§2 / §3 的全部命令只读仓库内文件。
但接手前必须知道它和仓库的**实测偏差**，否则会误判「线上是哪个版本」。

### 4.1 实测对账（2026-11-25 01:5x，`out/` 共 498 个 JSON / 13 MB）

| 项 | 实测值 |
| --- | --- |
| `out/` 下 `.json` 文件数 | **498**（13 MB） |
| 文件名在 `data/benchmarks/` 中存在 | **498 / 498**（缺失 0） |
| 文件名在本分支已跟踪 | **498 / 498**（未跟踪 0）；`data/benchmarks/` 共 510 个跟踪 JSON |
| 与仓库副本**逐字节相同** | **401** |
| 与仓库副本**不同** | **97** |

那 97 个差异文件按双方 schema 档位再分三类（穷尽、互斥）：

| 类别 | 个数 | 含义 |
| --- | --- | --- |
| `out/` v2 / 仓库 v0 | **8** | **仓库侧是 v0 桩，`out/` 侧是完整 v2 档案——仓库确实缺内容** |
| `out/` v2 / 仓库 v2 | **88** | 双方都是 v2，但 profile 字段有实质差异 |
| `out/` v0 / 仓库 v2 | **1** | 仓库更新（`toolathlon-verified`） |

8 个「仓库侧仍是 v0 桩」的 id（**这是本交接包未覆盖的内容缺口，必须单列**）：

```
androidbench  apex  biomysterybench  finance-agent
firefox-147-exploit  genebench  hy-browsecomp-pro2  hy-math
```

### 4.2 不要把 88 个 v2/v2 差异当成单向落后

对这 88 个文件按 `last_verified_at` 与 profile 体积两个方向各量了一次，
**两个方向都有人更新，没有一方是另一方的超集**：

| 度量 | `out/` 更新 | 仓库更新 | 持平 |
| --- | --- | --- | --- |
| `last_verified_at` 更大 | 8 | 2 | 79 |
| `profile` JSON 体积更大 | 18 | 36 | 34 |

差异字段集中在 profile 内部（`measures` 12 / `limitations` 21 / `dataset` 16 /
`default_protocol` 16 / `metrics` 11 / `versions` 12 / `categories` 4 /
`related_benchmarks` 10 / `notes` 9 / `official_sources` 6 等），不是单纯时间戳漂移。
另外 `out/` 里 486 个文件带 `profile`（v2）、12 个不带（v0 桩）：
`apexbench` / `cmt-benchmark` / `full-duplex-bench` / `hy-euler-pro` /
`hy-skillsworld` / `lifeval` / `livesqlbench` / `loca-bench` / `plawbench` /
`swe-atlas-codebase-qna` / `swebench-multilingual` / `toolathlon-verified`。

**因此正确的接手动作是**：换机器或重新部署前，逐页比对 `out/` 与 `data/benchmarks/`，
不能默认「以仓库为准」也不能默认「以 out/ 为准」；至少要把上面 8 个 v0 桩在仓库侧补齐或
显式记录为未升级。`out/` 的 mtime 也在持续变动（实测 max = 2026-11-25T01:19:39Z，
发布流水线仍在写），**不能用 mtime 推断哪份内容更新**。

（`scripts/v2-rollout/helpers/recover-out.py` 可从会话记录里恢复丢失的 `out/*.json`，
仅用于发布控制面救灾，与仓库无关。）

---

## 5. 增量窗口与 ingest-checkpoint 边界

`ingest-releases` 技能的扫描检查点落在 `data/generated/ingest-checkpoint.json`（已跟踪）。
**交接时必须连同边界一起交**，否则接手 agent 无法判断「下一轮该扫哪几天、哪些已扫过」。

### 5.1 交接时点的检查点状态

```bash
node .claude/skills/ingest-releases/scripts/checkpoint.mjs status
```

交接时点（`b992272`）实测输出：

```json
{
  "today": "2026-11-25",
  "last_scan_at": "2026-11-24",
  "ledger_max_release_date": "2026-11-20",
  "official_release_count": 246,
  "window_since": "2026-11-06",
  "window_until": "2026-11-25",
  "overlap_days": 14,
  "first_run": false,
  "note": "窗口 = 检查点锚点 2026-11-20 回退 14 天重叠"
}
```

字段语义与**哪些会随运行日变**（接手后核对时不要误判成被改过）：

| 字段 | 交接时点值 | 是否随运行日滚动 |
| --- | --- | --- |
| `last_scan_at` | `2026-11-24` | **不滚**——单调不回退，是真正的扫描进度锚点 |
| `last_max_release_date`（文件内） | `2026-11-20` | **不滚**——下次窗口的锚点 |
| `ledger_max_release_date` | `2026-11-20` | 由账本推导，跟随 `official/` 最大 release_date |
| `official_release_count` | `246` | 随落账增长 |
| `window_since` | `2026-11-06` | 由 `last_max_release_date − overlap_days` 推导 |
| `window_until` | `2026-11-25` | **滚**——取 `today`，接手日会变 |
| `today` | `2026-11-25` | **滚** |
| `overlap_days` | `14` | 固定配置 |
| `first_run` | `false` | 首运行为 `true`，窗口退化为 90 天 |

**边界一句话**：已扫到 `2026-11-24`，账本最晚 release 日期 `2026-11-20`，
下次扫描窗口 `[2026-11-06, <运行日>]`（14 天重叠兜底）。
`data/model-releases/official/` 现有 **246** 个实体。

### 5.2 窗口内的 24 个 release 实体（与「23 候选」不是一回事）

窗口 `[2026-11-06, 2026-11-25]` 内共 **24** 个 release 实体
（**20 `verified` + 4 `pending`**）。用仓库内输入可复现：

```bash
node -e '
const fs=require("fs"),path=require("path");
const out=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){
  const p=path.join(d,e.name);e.isDirectory()?walk(p):e.name.endsWith(".json")&&out.push(p);}};
walk("data/model-releases/official");
const w=out.map(p=>JSON.parse(fs.readFileSync(p,"utf8")))
  .filter(j=>{const d=j.release_date||"";return d>="2026-11-06"&&d<="2026-11-25";});
console.log("in window:",w.length);
const s={};for(const j of w)s[j.verification_status||j.status]=(s[j.verification_status||j.status]||0)+1;
console.log(JSON.stringify(s));'
```

| 项 | 数 |
| --- | --- |
| 窗口内 release 实体 | **24** |
| `verified` | 20 |
| `pending` | 4（`alphaproof-code` / `mka-benchmark` / `minimax-h3-image` / `gemini-decision-1`） |
| 本批 `8f851df` 新落账 | **11** |
| 更早批次落账、本批只做复验 | 13 |

**24 ≠ 23 的原因**：两个数来自不同账本，**口径不同，对不上是正常的，不要相互校验**。

- **24** = `data/model-releases/official/` 里 `release_date` 落在 `[2026-11-06, 2026-11-25]`
  内的 **release 实体**数。
- **23** = `data/model-coverage.json` 里 `discovered_at` 为 `2026-11-24` 的 **候选**数。

候选发现后要经过「排除 / 合并 / 归档」，所以 23 个候选**不对应 23 个 release**：

| 项 | 数 |
| --- | --- |
| 23 个候选中带 `release_id` 的 | **14** |
| 这 14 个去重后的不同 release 实体 | **10** |
| 其中 release_date 落在窗口内 | **9**（全部由本批 `8f851df` 落账） |
| 窗口外 | **1**（`mai-image-2-7`，`release_date = 2026-10-27`，更早批次 `47d08b4` 落账） |
| 无 `release_id` 的候选 | **9**（7 不建档 + 2 待裁，见 §6） |

反过来，窗口内 24 个实体里只有 **9** 个被这批候选引用；其余 **15** 个
（24 − 9）来自更早的提交（`3a22c7f` 4 / `0ceff2b` 3 / `e664480` 2 / `13a3696` 2 /
`e15697c` 1 / `2e6c33b` 1，**均已在 `origin/main`**）。
另外 `8f851df` 落的 11 个 release 里有 2 个（`decision-1-1` / `medchembench`）
不被任何本批候选引用——它们走的是账本驱动的入账路径，不是候选发现路径。
4 个 `pending` 实体也**不都**来自本批候选。

可复现上面的拆分：

```bash
# 23 个候选各自带的 release_id（去重、去空）
node scripts/handoff/candidates-window.mjs | tail -n +2 | cut -f4 | grep -v '^$' | sort -u
```

---

## 6. 23 候选逐项状态（已完成 / 未验收 / 失败 / 未开始）

逐项账在 `manifests/candidates-23.tsv`（23 行 + 表头，13 列），
**可由仓库内脚本重新生成**，不必信任快照：

```bash
node scripts/handoff/candidates-window.mjs                 # 默认扫描日 2026-11-24
node scripts/handoff/candidates-window.mjs 2026-11-24 -o /tmp/x.tsv   # 指定日 + 落盘
```

退出码：`0` = 写出成功；`1` = 该日无候选或输入缺失。
**stderr 会打印交接状态分桶与账面不一致清单**，是判断「有没有新情况」的第一现场。

### 6.1 23 个候选逐项（上表 TSV 的展开，b992272 实测）

| 候选 id | 分类 | release_id | 交接状态 | 归档 | 证据 |
| --- | --- | --- | --- | --- | --- |
| `anthropic-e621a2a9dfa1` | unknown | — | **不建档** | not_archived | not_extracted |
| `google-be0aed2f5105` | general | `gemini-4-neon` | **已完成** | archived | reported |
| `kimi-10ef78a4602c` | general | — | **不建档** | not_archived | not_extracted |
| `kimi-2ce1fd877531` | general | — | **不建档** | not_archived | not_extracted |
| `kimi-cd51b7d4b555` | unknown | — | **不建档** | not_archived | not_extracted |
| `kimi-cd8fbff3ad8a` | general | — | **不建档** | not_archived | not_extracted |
| `microsoft-056379588fe0` | vertical | `mai-code-2` | **已完成** | archived | reported |
| `microsoft-1334a48ecef3` | vertical | `mai-realtime-1` | **未验收** | archived | not_extracted |
| `microsoft-3af3f58646a2` | product | `mai-image-2-7` | **已完成** | archived | reported |
| `microsoft-69997388c54e` | unknown | `mai-cyber-2-flash` | **已完成** | archived | reported |
| `microsoft-74e8c9aab7e2` | product | `mai-licensed-weights` | **未验收** | archived | not_reported |
| `microsoft-9d1dabbd0ad9` | vertical | `mai-realtime-1` | **未验收** | archived | not_extracted |
| `microsoft-c74e8eacd8b5` | vertical | `mai-code-2` | **已完成** | archived | reported |
| `microsoft-de443bc5133f` | vertical | `mai-cyber-2-flash` | **已完成** | archived | reported |
| `microsoft-e64f2d5f5d51` | vertical | `mai-image-2-7-flash` | **已完成** | archived | reported |
| `microsoft-e724d5d4fc0b` | product | — | **不建档** | archived | not_extracted |
| `openai-8f6af8c44a4a` | general | `gpt-6-2-astra-sol` | **已完成** | archived | reported |
| `openai-9342dbf934e4` | product | — | **待裁** | not_archived | not_extracted |
| `openai-a1de396d3910` | product | — | **待裁** | not_archived | not_extracted |
| `openai-b0689cf87ab5` | unknown | — | **不建档** | archived | not_extracted |
| `thinking-machines-0428098a1ab0` | vertical | `tml-d24-varloop-research` | **已完成** | archived | reported |
| `thinking-machines-1e52228e1c5c` | vertical | `inkling-2-mini` | **已完成** | archived | reported |
| `thinking-machines-bd3614c30b5d` | unknown | `inkling-2-mini` | **已完成** | archived | reported |

复现方式：把 `manifests/candidates-23.tsv` 的 1/3/4 列取出来，套 §6.2 的分桶规则即可
（`release_id` 空 + `excluded` → 不建档；空 + `discovered` → 待裁；
非空但 `data/model-releases/official/` 下无同名 JSON → 失败；JSON 在则看 `evidence_status`）。
本表与 §6.2 的机器分桶**逐行一致**（11 / 3 / 7 / 2 / 0），两处对不上就说明数据又动了。

### 6.2 交接状态分桶（MECE：互斥且穷尽）

分桶规则**写在脚本里**（`candidates-window.mjs` 的 `bucketOf`），不靠人肉归类：

| 桶 | 判定规则 | 个数 |
| --- | --- | --- |
| **已完成** | 有 `release_id` + `official/` 有对应 JSON + `evidence_status == reported` | **11** |
| **未验收** | 有 `release_id` + JSON 在，但证据未抽全（`not_extracted` / `not_reported`） | **3** |
| **不建档** | `discovery_status == excluded`（判定非独立模型发布，不产生 release） | **7** |
| **待裁** | 无 `release_id` 却仍是 `discovered`——状态与 `exclusion_reason` 自相矛盾，**需人工定夺** | **2** |
| **失败** | 以上都套不进的形态 | **0** |
| | **合计** | **23** |

stderr 实测回显（`b992272`，逐字符复制，未加工）：

```
扫描日 2026-11-24: 23 个候选；分类 {"unknown":5,"general":5,"vertical":8,"product":5}；discovery {"excluded":8,"discovered":15}；archive {"not_archived":7,"archived":16}；evidence {"not_extracted":11,"reported":11,"not_reported":1}
交接状态分桶: {"已完成":11,"未验收":3,"不建档":7,"待裁":2,"失败":0}
  [待裁] openai-9342dbf934e4, openai-a1de396d3910
  [账面不一致] discovered 却带 exclusion_reason: openai-9342dbf934e4, openai-a1de396d3910
  [账面不一致] excluded 却无 exclusion_reason: thinking-machines-0428098a1ab0
```

stdout 是 24 行 TSV（1 表头 + 23 数据行），`manifests/candidates-23.tsv` 即该 stdout 的落盘副本
（实测 md5 `e5948558ec8fc40934d0422077d7aacd`，重跑一致）。

分桶数与上面四个原始计数是自洽的，可手工对上：`reported 11` → 已完成 11；
`not_extracted 11 + not_reported 1 = 12` 里扣掉没有 `release_id` 的 9 个（7 不建档 + 2 待裁）→ 未验收 3。
**下次跑完先看分桶合计是否仍为 23**，不是 23 就说明 `data/model-coverage.json` 被动过。

### 6.3 三处账面不一致（已机器定位，**未擅自改数据**）

| # | 候选 | 现象 | 为什么没改 |
| --- | --- | --- | --- |
| 1 | `openai-9342dbf934e4`、`openai-a1de396d3910` | `discovered` 却带 `exclusion_reason: not_archived` | 到底是「该排除没排除」还是「已排除没改状态」需要发布侧事实，改错会把 23 候选账目改坏 |
| 2 | `thinking-machines-0428098a1ab0` | `excluded` 却没有 `exclusion_reason` | 同上，缺排除理由的原始判断 |
| 3 | `microsoft-e724d5d4fc0b`、`openai-b0689cf87ab5` | 已归档但无 `release_id` | **这是设计如此**——它们归档在 `models/<date>-<slug>/` 而非 `official/`，不是缺陷 |

**接手动作**：这三条要人工定夺，定夺完只需改 `data/model-coverage.json` 的对应字段，
然后重跑上面的脚本，分桶数会跟着变；分桶数变了就说明改生效了。

### 6.4 「失败 0」的含义

`失败` 桶为 0 **只代表 23 个候选都套进了前四个桶**，不代表全部通过。
真正的失败面在发布台账（§7 的 2 条 `failed`）和 backlog 重试日志，
以及 §9 的遗留项。接手时请把 §6 的分桶、§7 的发布状态、§9 的遗留项**三处合起来看**。

---

## 7. 发布台账状态（快照在 `manifests/`，逐字节同源）

台账本体只存在于发布控制面，本目录放**时点快照**，可与控制面 `diff` 判断是否又往前走了：

| 文件 | 行数 | 状态分布 |
| --- | --- | --- |
| `manifests/published.tsv` | 326 | `ok` 320 / `pending` 4 / `failed` 2 |
| `manifests/publish-blocked.tsv` | 1 | `multichallenge` blocked |
| `manifests/backlog.tsv` | 8 | 重试日志（**不是** backlog 台账） |
| `manifests/candidates-23.tsv` | 23 | 「23 候选」逐项账，可由 `scripts/handoff/candidates-window.mjs` 重新生成 |

**状态在 `published.tsv` 第 6 列**（该文件无表头；`awk -F'\t' '{print $2}'` 取到的是 commit SHA，不是状态）。

四条 `pending`（`one-million-bench` / `openai-error-inducing-prompts` /
`openai-gif-moderation-recall` / `ovbench`）的 Actions URL **均为空**，即从未成功触发过
Pages 部署，不是「部署中」。两条 `failed`（`nl2repo` / `olympiadbench`）有 run 链接。
`STOP_PUBLISH` 生效期间未重试，故这 6 行是本地接管后的第一批待办。

**一处账实不一致**：`publish-blocked.tsv` 里 `multichallenge` 仍是 blocked 行，
但它已于 2026-11-21 17:35:36 发布成功（`ok`）。清 block 行时**以 `published.tsv` 为准**。

---

## 8. CI 部署缺陷与修复（提交 `fc56a57`，已在 `origin/main`）

**症状**：Actions 的 `deploy-pages` 步骤在 `actions/deploy-pages@v4` 里报找不到 `github-pages`
artifact，但同一次 run 里 artifact 明明已上传成功。

**根因**：`actions/deploy-pages@v4` 通过 **Twirp** `ArtifactService.ListArtifacts`
读取 artifact 列表，**不走 REST**。REST 与 Twirp 之间存在可见的传播延迟——run `45367368858`
实测 REST 比 Twirp 早 0.4 s 就能看到该 artifact。原等待步骤轮询 REST，于是
「REST 说有了、Twirp 还没有」就立刻失败。

**修复**：等待步骤改为轮询同一个 Twirp 通道；artifact 缺失或出现多个 `github-pages`
时明确报错而非静默继续。同时移除了不再需要的 `actions: read` 权限。

**为什么没继续改 CI**：T91 明确要求不做部署功能开发。`fc56a57` 是修一个「已发布页无法
上线」的既有缺陷，属维持停发所必需的最小修复；此后未再动任何 workflow。

---

## 9. 遗留项与责任划分

详见 `AUDIT-REPORT.md` §7。摘要（按优先级）：

1. **发布侧 6 行未闭环**（4 `pending` + 2 `failed`）——本地接管后按 T80 的 A 序处理，
   都需新的 push 授权，本次一律未动。
2. **28 个 backlog id 的 v2 升级**；其中 `cmt-benchmark` 与 `full-duplex-bench` 两页
   到 2026-11-25 07:50 仍在被重试且耗时在涨（见 `manifests/README.md` §4，
   两页目前是 ~1.9 KB 的 v0 桩，`cites: 0`，**不是通过，是无内容可验**）。
3. `multimodal-knowledge-agent` / `swebench-pro` 仍是 v1 模板但不在 backlog 的 28 个 id 里
   （账实不一致，未改是因为棘轮只减不增且可能有并发升级在进行）。
4. 53 条 missing 摘录：21 条 cite 指错来源（可修）、32 条来源 drift（需重抓后才能定性）。
5. 10 页抽检发现 28.7% 的 claim 数字未挂到真实 locator——v2 重写时收紧。
6. `apex` / `biomysterybench` 是 v0 schema 实体，`reverify.py` 无法复核（`KeyError: 'profile'`），
   其摘录已由 `check-one.mjs` 逐字核验覆盖。
7. 「23 候选」里有 3 处账面不一致（排除无理由、有理由却未排除、归档但无 release_id），
   已机器定位，未擅自改数据——见 `manifests/README.md` §1。
8. **48 页 / 145 个「账本独有来源」**（2 345 条摘录，占 6.2%）——**不是缺陷，是待定决策**：
   裁掉可让账本与页面严格对齐，保留则留住「当初核过什么」的留痕。
   本侧未裁，明细见 §3.4 与 `logs/clean-clone-20261125/ledger-sources.tsv`。
9. **`out/` 与仓库双向分叉**（97 个文件不同，其中 8 个仓库侧还是 v0 桩）——见 §4。
   换机器或重新部署前必须逐页比对，不能默认任何一侧为准。

---

## 10. 目录内容

| 文件 | 说明 |
| --- | --- |
| `README.md` | 本文件（交接入口） |
| `AUDIT-REPORT.md` | 全量审核报告：510 页引文终态、门禁链、≥10% 复抓、10 页抽检、增量窗口核验、遗留项 |
| `issue-draft.md` | issue 正文草稿，**只写文件，未创建也未评论任何 GitHub issue** |
| `manifests/README.md` | 账目清单说明：23 候选、发布台账、blocked、backlog 重试日志 |
| `manifests/*.tsv` | 上表对应的 4 个时点快照 |
| `T98-HANDOFF-PRIORITY.md` | t98u 指令的机械投递记录（**是指令投递，不是交接正文**） |
| `logs/` | 证据日志：8 步门禁链（`gate-*.log`）、510 页引文明细（`audit-checkone-510-*.jsonl`）、复抓结果与归因（`reverify-10pct-*`）、10 页抽检报告、缓存 purge 记录 |
| `logs/clean-clone-20261125/` | **干净 clone 验证**（T98u 第 5 条）：8 步门禁回显 + 等价性比对 + 账本/来源明细 |

`logs/` 共 **52 个文件**：5 个已随 `70d3e36` 入库，47 个随本次提交入库
（其中 `clean-clone-20261125/` 12 个、`gate-rerun-20261125/` 9 个）。
`logs/` 下的原始回显可能带原机绝对路径（如 `/workspace/rollout/...`、`/workspace/t98-cleanclone/...`），
**仅作证据**，不是运行依赖；复现命令一律以本文件 §2 / §3 的仓库相对路径为准。

### 本次新增的仓库内脚本（均无外部依赖、路径无关）

| 脚本 | 作用 |
| --- | --- |
| `scripts/verify-cite-coverage.mjs` | 引文账本结构核验（门禁第 8 步） |
| `scripts/check-one.mjs` | 单页逐字核验（需外置语料；无语料时报 `corpus: absent`） |
| `scripts/verify-quotes.mjs` | 批量逐字核验（需外置语料） |
| `scripts/dedupe-evidence-quotes.mjs` | 去掉账本重复 `(cite, quote)`，保序纯删除、格式保持 |
| `scripts/handoff/candidates-window.mjs` | 按扫描日导出候选清单（生成 `candidates-23.tsv`） |
| `scripts/handoff/run-gate.sh` | 一键跑 8 步门禁并把每步回显落盘 |
| `scripts/handoff/audit-ledger-sources.mjs` | 审核「页面引用 vs 账本来源」，拆缺口 A / 差异 B2（§3.4） |
| `scripts/handoff/compare-clones.mjs` | sha256 逐文件比对两个 checkout，证明干净 clone 与工作树等价 |
| `scripts/v2-rollout/helpers/_rv.py` | v2-rollout 助手的共享路径与抓取模块（`EVIDENCE_DIR` / `VIEW_DIR` / `FRESH_DIR`，导入时自建 `FRESH_DIR`） |
