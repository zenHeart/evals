# EXT-PUB · 增量发布改为「每页一次上线」

任务：EXT-PUB（18:03 下发，18:05 授权 MiniMax-self / glm-self 执行）
执行时间：2026-11-14 18:03 起，常驻发布器持续运行中
本报告最后更新：2026-11-15 04:05

---

## 一、根因复检结论

| 项 | 复检结果 |
|---|---|
| 验收 389 是唯一 ID | **已过时**。`gate.tsv` 现有 721 行 / 473 个唯一 id，其中 239 个 id 存在重复判定（别的会话在重复验收），但** accept ↔ reject 翻转数为 0**；249 行是旧三列占位（判定列为空）。判定取值改为「最后一次有明确判定者为准，空判定不覆盖」 |
| origin/main 上 v2 只有 40 页 | 属实。任务开始时 40 页（首批 39 + 试点 hlehle），现已 **59 页** |
| `MAX_BATCH=40` + `COALESCE=120` 把好页打成大包 | 属实，已彻底移除（见第二节） |
| 18:04 一批 40 页因 3 个坏页整批放弃、300s 后整批重试 | 属实。坏页为 `artificial-analysis-image-arena`（分类「图像编辑」「图像生成」不在 taxonomy；related `artificial-analysis-text-to-image-arena` 站内无此页）、`beyondaime` 与 `cgbench`（official_results 用 `"-"` 表示缺失，规范要求 null） |
| 更早批次因 compare-rules 未登记失败 | 属实，`a85b703` 已补 17 项；**本轮未新增、未伪造任何 compare-rule，也未改动任何测试断言** |

## 二、脚本改造（`/workspace/rollout/`）

### `publisher.sh`（常驻逐页发布器）

- **每次只发 1 页**：`MAX_BATCH=1`；`COALESCE`（120s 合并等待）已彻底删除，不再为凑批等待。
- 每页独立走完整链路：持锁 → FF 最新 origin/main → 只拷该页 → 全部门禁 → 还原 `evals.epub` → 提交 → 只快进 push → **等本次 Build & Publish（含 Deploy to GitHub Pages）成功** → curl 线上核验 `benchmark-profile/v2` → 写 `published.tsv`。**上一页 Actions 成功后才开始下一页**（由 publish-batch.sh 持锁 + 等 Actions 保证）。
- **失败隔离**：某页门禁失败 → 写 `publish-failed.tsv`（id / 时间 / 失败步骤 / 具体错误），**换下一页继续**，不整批重试、不让好页被拖住。单页自动重试上限 `MAX_ATTEMPTS=3`；用尽仍不过 → 写 `publish-blocked.tsv` 隔离记因，**保留线上旧版**，待该页 `out/` 再被改写时自动解禁重试。
- **历史 accept 复验**：`out/` 出现时间晚于 gate 判定的页面一律 `need=1`，先走 `check-one` + `reverify`（`helpers/regate.sh`）才允许上线；复验 reject 的页直接排除。
- check-one 失败 / reject / stub 非 v2 / 缺 out 的页不上线，保留线上旧版，原因写入 `publish-failed.tsv`。
- 不动他人未提交改动：工作树出现预期外的脏文件时**只撤回本脚本自己的文件**，不 `reset --hard`、不 stash，按「环境占用」退避重来（不计入该页失败次数）。

### `publish-batch.sh`（单页发布执行体）

- 门禁链：`reconcile-coverage` → `node --test tests/*.test.mjs` → `validate-data` → `sync:skills:check` → `build` → `validate-site`，逐道超时保护、逐道独立日志（`logs/gate-<名>.log`）。
- `evals.epub` 构建改写一律还原，不入提交；只暂存预期路径，脏文件检查失败即中止。
- 提交作者 `zenheart <zenheart_register@163.com>`；`git push origin HEAD:main` **只快进、不 force、不建 PR、不删远程分支**。
- **本轮修掉的卡死点**：原用 `gh run list --limit 15` 轮询找 run，单次 API 调用无超时，一旦网络挂住就把整页拖成小时级（实测 `aa-briefcase` 找 run 耗了 56 分钟，而 run 本身 3 分钟就成功）。改为 `timeout -k 5 gh api "repos/zenHeart/evals/actions/runs?head_sha=$sha&per_page=5"`（并按 `name=="Build & Publish"` 过滤）+ 有截止时间的结论轮询。**改造后单页全程约 70–90 秒**（推送 → run 定位 → Actions 成功 → 线上核验）。

## 三、坏页修复（按规范/来源，不降级门禁）

修复器 `helpers/fix-page-defects.py` 只做三件被规范判定为错的事：

1. 缺失值恰为 `"-"` → `null`（`validate-data` 的 `forbidDash` 要求缺失用 null 或显式状态）。
2. `categories` 映射到站点 `data/taxonomy.json` 实际存在的 9 个分类 id（如「图像编辑」「图像生成」→ `multimodal`；`agentic`→`agent`；`math`→`reasoning`；`video`→`multimodal`），站内已有同名页时**优先采纳站内既有分类结论**。
3. `related_benchmarks` 对到站内真实存在的页面 id（`swe-bench`→`swebench` 等）；站内根本没有对应页面的（如 `artificial-analysis-text-to-image-arena`）**直接删除，不凭空造页面**。

**不新增 compare-rules、不改门禁、不编造计分决定。**

修复后三页的实测结果（隔离镜像目录跑全局 `validate-data`，不触碰发布工作树）：

```
[profile] 模板档案 50 个通过校验；待升级存量 459 个
[validate-data] PASS — taxonomy 9 类 / vendors 18 / benchmarks 509 / releases 240（official 226）/ evidence edges 4008
```

三页当前状态：**三页均已重新验收 accept，已进入发布队列**（`logs/.candidates.tsv` 中 need=0、gate accept + 重新验收 accept）：

| 页面 | 复验时刻 | 结果 | 当前状态 |
|---|---|---|---|
| `artificial-analysis-image-arena` | 2026-11-14 22:09:34 | accept（check_err=0 / quotes=43 / fresh_missing=0） | 在发布队列，等待上线 |
| `beyondaime` | 2026-11-15 01:04:14 | accept（check_err=0 / quotes=27 / fresh_missing=0） | 在发布队列，等待上线 |
| `cgbench` | 2026-11-15 03:07:57 | accept（check_err=0 / quotes=90 / fresh_missing=0） | 在发布队列，等待上线 |

**这一路径本身就是「先修数据、再过门禁」的证据**：修复后的页面在真实发布流程里通过 `check-one` 与全局 `validate-data`，而不是靠绕过门禁放行。

另修一处渲染缺陷（`91a980f`，已在 origin/main）：`official_results` 缺失值渲染成「—」而非 `null` 字面量，并补了对应测试。

**回归测试**：`node --test tests/*.test.mjs` → **140 tests / 140 pass / 0 fail**。

## 四、首批之后实际完成的全流程页面（截至本报告 20 页，持续增加）

每一页都走完：accept → check-one → 提交 → push（只快进）→ Actions SUCCESS → 线上 curl 确认含 `benchmark-profile/v2` → 写 `published.tsv`。

| 页面 | commit URL | Actions run URL | 线上核验 |
|---|---|---|---|
| aa-cyber-index | https://github.com/zenHeart/evals/commit/fc8a4f29d5b173a3054e06bc10b3b42218d900b1 | https://github.com/zenHeart/evals/actions/runs/43590923806 | ok |
| aa-briefcase | https://github.com/zenHeart/evals/commit/cfc4a3c8b0898f8b1f9d1d8ec69eb4a38501cd9b | https://github.com/zenHeart/evals/actions/runs/43593147043 | ok |
| aa-coding-agent-index | https://github.com/zenHeart/evals/commit/9c8c9b032a5e805282e90035e6c0dbfc88e7da36 | https://github.com/zenHeart/evals/actions/runs/43597814725 | ok |
| aa-intelligence-index | https://github.com/zenHeart/evals/commit/6ef5cb56ac27486a2126340fa021d64951d07314 | https://github.com/zenHeart/evals/actions/runs/43598010694 | ok |
| aa-speech-to-speech | https://github.com/zenHeart/evals/commit/0976a5c0e3879c4a12c705e99af27f90d2aade8c | https://github.com/zenHeart/evals/actions/runs/43598172605 | ok |
| abcbench | https://github.com/zenHeart/evals/commit/5be8458586aca386652e9a8679754fdf42b12faf | https://github.com/zenHeart/evals/actions/runs/43598318478 | ok |
| acl6060 | https://github.com/zenHeart/evals/commit/c6c57034f39bc640d75706e37b6e46047e008e41 | https://github.com/zenHeart/evals/actions/runs/43603104179 | ok |
| active-memory-eval | https://github.com/zenHeart/evals/commit/bd9edf0d47fa515469cc1c8f74f619b8aca2d3c0 | https://github.com/zenHeart/evals/actions/runs/43603265040 | ok |
| ade-bench | https://github.com/zenHeart/evals/commit/22f64d6002907abf80dfc9d3649bb164621a2659 | https://github.com/zenHeart/evals/actions/runs/43603461175 | ok |
| agent-startup-bench | https://github.com/zenHeart/evals/commit/d4c2699feb6789758ebd0bc7f01b9d81639812e9 | https://github.com/zenHeart/evals/actions/runs/43603644679 | ok |
| hlehle（试点页补记） | https://github.com/zenHeart/evals/commit/9fce31873a41f19a3383ecc0593d3ffb0ae2a306 | https://github.com/zenHeart/evals/actions/runs/42794844924 | ok |
| **agentbench** | https://github.com/zenHeart/evals/commit/48b75b5a617442ba9be04b9fcab70649f1eaf1f9 | https://github.com/zenHeart/evals/actions/runs/43618938461 | ok |
| **ai-office-bench** | https://github.com/zenHeart/evals/commit/2b0591ff3b1ecea7a580292a60ee1b4a582fe980 | https://github.com/zenHeart/evals/actions/runs/43619117997 | ok |
| **ai2d**（任务书点名建议页） | https://github.com/zenHeart/evals/commit/85ee1c42badae6c1c61fd6b0304f4cfa04118b87 | https://github.com/zenHeart/evals/actions/runs/43619276449 | ok |
| aime-26 | https://github.com/zenHeart/evals/commit/09920f3e5b50a4276202a4f747ba2ba79c6d5631 | https://github.com/zenHeart/evals/actions/runs/43630302419 | ok |
| aime-25（他人已发，本轮补记台账） | https://github.com/zenHeart/evals/commit/f09393bf7cdb7ad4013b866935ccc215040d98c4 | https://github.com/zenHeart/evals/actions/runs/43619605536 | ok |
| airs-bench | https://github.com/zenHeart/evals/commit/1b084fb87d8709ec84be14dac35123020007afaa | https://github.com/zenHeart/evals/actions/runs/43630456065 | ok |
| alignbench | https://github.com/zenHeart/evals/commit/c1fc01bb0152582c7c34586959bc5a3dd8b0949d | https://github.com/zenHeart/evals/actions/runs/43630638549 | ok |
| alpacaeval | https://github.com/zenHeart/evals/commit/683a08fe02c63d6b5bc03db029ad0042ed3db5ab | https://github.com/zenHeart/evals/actions/runs/43635452152 | ok |
| amo-bench | https://github.com/zenHeart/evals/commit/cb186f62ad3563d9fc1fa4eb41576ed73daa2fc5 | https://github.com/zenHeart/evals/actions/runs/43635629774 | ok |

独立复核（不用脚本、单独 curl 线上 HTML）：`aa-cyber-index` / `aa-briefcase` / `aa-coding-agent-index` / `aa-speech-to-speech` / `abcbench` / `acl6060` 六页线上均确认含 `benchmark-profile/v2`；本轮又单独核验 `agentbench`、`ai2d`、`aime-25`（`grep -c 'benchmark-profile/v2'` = 1），线上均含 `benchmark-profile/v2`。

**origin/main 上 v2 页数：40 → 59**（本报告统计时点，之后仍在增长）。台账 `published.tsv` 59 行、59 个唯一 id，与 origin/main 上的 59 个 v2 页 id 集合**完全一致**（双向差集均为空，已用脚本比对；59 行全部为 `ok`，无遗留 pending）。

### 台账「已上线但没记账」的堵漏（本轮新增）

推送成功之后还要等 Actions + 线上核验，这段窗口里本进程可能崩溃或超时退出——页面其实已上线，台账却缺这一行；而候选脚本又因「已是 v2」跳过它，于是账目与线上长期对不上。处置：

1. **push 成功后立即记 pending 行**（`publish-batch.sh` 第 6b 步）：不等 Actions，先按 `(id, sha)` 落一行 `result=pending`；后续核验通过就在**同一行**改成 `ok`，不追加第二行。
2. **受锁 upsert**（新增 `helpers/upsert-published.py`）：读—改—写整个过程持 `published.lock`（fcntl.flock），发布器记账与对账脚本共用这把锁，互不覆盖；定位键 `(id, sha)` 保证「先 pending 后 ok」是同一行。
3. **对账脚本**（`helpers/reconcile-published.py`）：以 origin/main 为准，把「已是 v2 但台账没有」的页补齐、把 pending 行落实；**已接入发布器主循环**（每 600s 一次，后台执行、独立 `reconcile.lock`），不阻塞发布。
4. **查 run 的退化路径**：push 触发的 run，其 `head_sha` 是**推送的 tip**而不是单页提交，所以 `actions/runs?head_sha=<单页 sha>` 常常返回 0 条——这就是试点页 `hlehle` 一直补不上台账的原因（它实际由 run 42794844924 部署成功）。对账脚本改为在候选 run 里找「`head_sha` 是该页提交的祖先」的最早一个（`git merge-base --is-ancestor`），`hlehle` 随即补记为 ok。

### 本轮修掉的发布器缺陷（三个）

| 缺陷 | 现象 | 根因 | 修法 |
|---|---|---|---|
| 重试时**发错页** | `agent-startup-bench` 的第 2 次重试变成了发 `abcbench`（已上线页），随后以 `rc=1 暂存区为空` 失败 | `publisher.sh` 的 `save_retry()` 在 `publish_page()` 的调用栈里用 `for id in ...` 循环，bash 动态作用域下覆盖了 `publish_page` 的 `local id` | `save_retry` 改用 `k` 作循环变量；`publish_page` 每轮重试前 `id=$1` 重置 |
| 已上线页被当成失败 | 同一页重发时门禁全过，最后报 `暂存区为空，无可提交内容`（rc=1） | 该页与 origin/main 已逐字一致，确实没有可提交内容，但被当成页面缺陷 | `publish-batch.sh` 改为识别这一状态并以专用退出码 **14** 返回，发布器记「已上线、不需重复发布」，不计入失败次数 |
| 门禁期间远程前进 → push 被拒 | `aime-25` 首轮 push 被拒 `! [rejected] HEAD -> main (fetch first)`（rc=9），白等 55 分钟才发现远程已含同内容 | 门禁链要跑 30 s–55 min，其间任何并发 push 都让本地提交不再是快进；而当时脚本只判断「远程 tip == 本地父提交」 | 见下节「推送前重新整合」 |

因第二个缺陷被误写入 `publish-blocked.tsv` 的 `abcbench`（实际早已上线、线上为 v2）已撤销隔离。

`published.tsv` 新增行统一为 6 列：`id / 完整 commit SHA / 时间 / 页面 URL / Actions run URL / 核验结果`（2026-11-14 之前的历史行只有 5 列，是首批发布的旧格式，保留不改）。

### `aime-25`：重复发布竞态的完整归因与处置（本轮新发现）

**现象**：本地提交 `4b2573b` 被远程拒收（`fetch first`）。初判像是「推送失败/内容有问题」，但复核证明是**重复发布竞态**，不是内容缺陷：

- 上游已存在提交 `f09393b`（作者同为 `zenheart <zenheart_register@163.com>`，提交时间 2026-11-15 01:09:57），内容与本地 `4b2573b` **逐字相同**（`git cherry -v origin/main HEAD` 显示 `-`，`git diff --stat` 为空）；
- 该上游提交对应的 Build & Publish run `43619605536` 已 success，线上 `https://evals.zenheart.site/benchmarks/aime-25/` 实测含 `benchmark-profile/v2`；
- 也就是说：**该页早已由另一个执行者上线成功**，本轮再发一次纯属多余。

**处置**（未 force、未改远程、未动他人提交）：

1. **台账补行**：该页「已上线但台账没有」，用 `helpers/upsert-published.py` 写入 `f09393b… / 2026-11-15 01:09:57 / run 43619605536 / ok`，账实对齐。
2. **脚本层根治**（`publish-batch.sh` 第 6 步，**push 前重新整合**）：

   ```
   git fetch origin
   mnow    = origin/main 的 tip
   parent  = 本次提交的父提交
   若 mnow == 本次提交            → 远程已含本次内容（already=1），不重复推
   若 mnow == parent              → 常规快进，直接推
   否则若 本次提交已是 origin/main 的祖先 → 远程已含本次内容（already=1），不重复推
   否则                          → 门禁期间远程已前进 → rebase 到 origin/main 后再推
   rebase 后若新提交 == mnow      → 该页已由他人发布，退出码 14（已上线），不计失败
   ```

   实测生效：`alignbench`（03:10:21）与 `alpacaeval`（04:03:44）两页都在门禁期间遇到远程前进，均自动 rebase 到新 tip 后推送成功，**没有再出现 `fetch first` 拒收**。

3. **rebase 冲突的自动解法**：rebase 唯一允许自动解决的冲突是 `data/benchmark-profile-backlog.json`——它只是「待升级页 id 列表」，各方只会从中删条目，文本必然撞车。正确结果 = **上游版本，再删掉本地这批提交删掉的 id**，由新增的 `helpers/merge-backlog.py` 合成（共同祖先列表 − 本地列表 = 本地删掉的 id；再从上游列表里去掉这些 id，并同步 `count`）。其它冲突一律 `git rebase --abort` 并按「环境被占用」退避（不计页面失败次数）。该解法在两个临时仓库里验证过（无冲突直合 / 强制冲突后合成再 `rebase --continue` 均正确）。

### 观察到的基础设施抖动（已收敛，不影响发布正确性）

`abcbench` 一页从推送（21:09:15）到记账（22:05:24）耗时约 56 分钟，但其 Actions run 本身在 **21:10:31 就已 success**——耗时全花在「轮询 GitHub API 拿 run 状态」上：该时段本机到 `api.github.com` 的连接无响应，每次 API 调用都跑满超时才返回。与此前 `aa-briefcase` 找 run 耗 56 分钟是同一现象（不是 CPU/内存争用：当时 load average 0.74）。

处置：
- 单次 `gh` 调用加 `timeout -k 5`（`timeout` 不带 `-k` 时，子进程忽略 SIGTERM 会无限期挂住——实测一次 `gh api` 挂死让 `alignbench` 停滞 53 分钟），轮询间隔 15s → **10s**，保证「卡一次最多损失 30s、绝不无限期挂住」；
- `ACTIONS_TIMEOUT` 由 2100s 放宽到 **5400s**：GitHub 侧排队可能很久，超时按**基础设施**类错误处理（rc=11，页面**不隔离**、退避后重试，远程提交不回退），避免慢但成功的 run 被超时打断而留下台账空洞；
- 网络恢复后实测单次 API 调用 1.6s，单页全程回到 **70–90 秒**。

**页面数据与门禁判定未受此影响**：所有提交都只快进、都过了全部门禁、都等到了 Actions success 才记账。

### 关于「日志里每行出现两次」

`publisher.sh` 第 121 行以 `bash "$R/publish-batch.sh" "$id" >> "$LOG" 2>&1` 调用子进程，而 `publish-batch.sh` 自己的 `log()` 也往同一份 `$LOG` 追加，于是每条批处理日志被写了两遍。**这是同一次运行的双写，不是两个 publisher**——`ps` 实测只有一个 `bash publisher.sh`（PID 1050426）加它自己的 `publish-batch.sh` 子进程。

## 五、常驻发布器

- 唯一实例：**PID 1050426**，`setsid` 独立会话，pidfile `/workspace/rollout/publisher.pid`，状态文件 `/workspace/rollout/publisher.state`。实测 `ps` 中仅此一个 publisher 进程树。
- 这是本轮**第二个**常驻实例：上一实例（PID 993530）跑的是修复前的 `publisher.sh`（含「重试发错页」缺陷），2026-11-15 01:06:05 先给它发 SIGTERM 让它退出并清理 pidfile，**退出后才**用修复后的脚本启动唯一实例——全程**没有两个 publisher 并存**，也未 `--resume` 他人会话、未 kill 任何他方进程。
- 退出时正在跑的那一页（`ai2d`）由其 `publish-batch.sh` 子进程独立跑完：门禁 → 提交 → push → Actions success → 线上核验 → 记账全部完成，未被中断。
- 脚本热更新一律走「写临时文件 → `mv` 原子替换」：运行中的 bash 进程持有旧 inode，不会因就地编辑而损坏；本轮三次改 `publish-batch.sh` 均用此法，在飞的那一页（`aime-26`/`airs-bench`/`alignbench`）跑的是旧 inode 且全部正常完成。
- 协调约束遵守情况：全程未重启 GLM 页面池 keeper-glm（保留 STOPGLM）、未加 StepFun 槽位、未动 `/workspace/evals` 的 v2-spec 检出、未改 routine、未打印任何密钥；只用了本会话 provider。
- 发布锁 `/workspace/rollout/publish.lock`（flock fd 9）串行化所有 push；`gate.lock` 探测到别的会话在跑 gate 时**不重复启动**。
- 后台复验链一次只跑一页（不叠加 worker 压力）；`gate.sh` 放后台运行，不阻塞发布主循环。

## 六、当前台账

| 文件 | 内容 |
|---|---|
| `published.tsv` | **59 行**上线记录（首批 39 + 本轮 19，含试点页 hlehle 补记 1）；origin/main 上 v2 页共 **59**，两者 id 集合逐项相同（双向差集均为空，已用脚本比对） |
| `publish-failed.tsv` | **32 个唯一页面**（文件 544 行，按轮次追加、同一页会重复出现），全部卡在 `check-one` 步骤（逐字证据核验不过，如 `wmdp` errors=28、`scicode` errors=13、`osworld` errors=13）。这些页**不上线、保留线上旧版**，不影响其他页发布 |
| `publish-blocked.tsv` | **空**（误隔离的 `abcbench` 已撤销；尚无页面因重试用尽被隔离） |
| `regated.tsv` | 历史 accept 复验结果台账，逐页追加 |
| `logs/.candidates.tsv` | **323** 个候选页（本报告统计时点；worker 仍在产出，数字实时变化）；其中已重新验收 accept 的三张坏页（`artificial-analysis-image-arena`/`beyondaime`/`cgbench`）均在列且 need=0 |

**剩余待发布队列**（本报告统计时点）：候选 323 页，扣除已上线的 59 页与 check-one 不过的 32 页；常驻发布器正按「一页一次上线」持续排空（最近两页：`alpacaeval` 04:05:05 上线成功、`amo-bench` 04:06:47 上线成功，随后进入 `aa-lcr`），页面数随 worker 产出与复验结果实时变化。

---

STATUS: DONE
