# 干净 clone 交接验证（2026-11-25）

T98u 第 5 条要求：「用干净克隆、只含准备提交的仓库内容验证交接命令，记录实际结果，
不伪称完工」。本目录就是那次验证的原始回显。

## 1. 环境

| 项 | 值 |
| --- | --- |
| 验证时间(UTC) | 2026-11-25 01:43–02:00 |
| 验证方式 | `git clone --no-hardlinks /workspace/t83-integ /workspace/t98-cleanclone`（**非** shallow、非 hardlink），套用交接补丁 `/workspace/t98-staged.patch`（9 文件），再叠加「准备提交的未跟踪内容」 |
| clone 内 branch / HEAD | `t83-integ` / `b992272` |
| node / npm | v24.22.1 / 11.21.1 |
| `npm ci` | 成功（node_modules 全新安装） |

**为什么这样构造**：`git clone` 只带已提交历史，而本次交接的绝大部分内容
（证据账本、审核脚本、handoff 文档、日志、台账快照）都是**未跟踪文件**。
只 clone 不叠加等于验证了一个空壳。所以做法是：clone + patch + 未跟踪内容叠加，
然后验证「叠加后」与 t83-integ 工作树逐字节等价（见 §4），再在该目录里跑全部命令。

## 2. 八步门禁全量结果（8 / 8 exit 0）

由入库脚本 `scripts/handoff/run-gate.sh` 生成，每步回显单独落盘：

| 步骤 | 命令 | 结果 |
| --- | --- | --- |
| 1 | `node scripts/reconcile-coverage.mjs` | exit 0 |
| 2 | `node --test tests/*.test.mjs` | exit 0 |
| 2b | `node --test tests/release-ingest.test.mjs` | exit 0 |
| 3 | `node scripts/validate-data.mjs` | exit 0 |
| 3b | `node scripts/validate-model-coverage.mjs` | exit 0 |
| 4 | `npm run build` | exit 0 |
| 5 | `npm run sync:skills:check` | exit 0（`✓ 技能镜像无漂移`） |
| 6 | `node scripts/verify-cite-coverage.mjs` | exit 0（**PASS**） |

`gate-6-cite-coverage.log` 的实测数字：

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

**注意 `gate-summary.log` 第 5 行「领先 origin/main: 330 个提交」是 clone 假象**，
不要采信：clone 的 `origin` 指向 `/workspace/t83-integ`，其 `origin/main` 仍是本地
陈旧的 `main`（`84f4a00`），不是真正的远端 `origin/main`（`fc56a57`）。
真实领先数以主控工作树 `git rev-list --count fc56a57..HEAD` 为准。

## 3. 逐字引文核验：在干净 clone 内从零重建语料

`hlehle` 全 6 个来源在 clone 内**从实时网络重新抓取**（不沿用任何旧文件）：

```bash
rm -rf data/fresh data/view          # 先删掉，证明脚本能自建目录
python3 -I scripts/v2-rollout/helpers/srcfetch.py hlehle \
  paper https://arxiv.org/abs/2501.14249 \
  site https://lastexam.ai/ \
  repo https://github.com/centerforaisafety/hle \
  dataset https://huggingface.co/datasets/cais/hle \
  diamond https://lastexam.ai/blog/hle-diamond \
  futurehouse https://www.futurehouse.org/research-announcements/hle-exam
node scripts/check-one.mjs data/benchmarks/hlehle.json
```

实测结果（6 个来源全部 `usable: true`，抓取字符数 280040 / 540977 / 209018 /
326867 / 107231 / 54152）：

```json
{"id":"hlehle","cites":31,"quotes_ok":70,"quotes_bad":0,"errors":0}
```

exit=0。与主控侧记录的审核行**逐字节相同**。

### 3.1 本次验证发现并已修复一个真实缺陷

第一次在 clone 里跑 `srcfetch.py` 时报
`FileNotFoundError: '/workspace/t98-cleanclone/data/fresh/af1167….txt'`。

根因：`scripts/v2-rollout/helpers/_rv.py` 用 `ast` 从 `reverify.py` 里只抽取
`norm/fetch/jina/hit` 四个**函数体**，`reverify.py:11` 的模块级
`os.makedirs(FRESH_DIR, exist_ok=True)` 不会被执行；而 `fetch()` 在缓存未命中时
直接 `open(FRESH_DIR/<md5>.txt, 'w')`。于是干净 clone（`data/fresh/` 尚未建）
上首次抓取必崩。

修复（已随本交接入库）：在 `_rv.py` 路径解析之后补同一动作，见
`scripts/v2-rollout/helpers/_rv.py` 的注释块。`VIEW_DIR` 不需要同样补——
`srcfetch.py:21` 自己会 `makedirs($VIEW_DIR/<bid>)`（含父目录）。

**这个缺陷只有「在干净 clone 里从零跑一遍」才会暴露**；在主控工作树上
`data/fresh/` 早就存在，所以一直看不出来。这正是 T98u 第 5 条的意义。

## 4. 内容等价性：clone 叠加后与工作树逐字节比对

脚本 `scripts/handoff/compare-clones.mjs`（sha256 逐文件比对，忽略 `.git/` 与
`node_modules/`），原始回显见 `compare-clones.txt`，实测：

```
[git 索引（将提交内容）] 集合大小 A=3237 B=3237
  仅 A 有        0      仅 B 有        0      一侧缺失       0      内容不同       1
[未跟踪文件] 集合大小 A=559 B=546
  仅 A 有       13      仅 B 有        0      一侧缺失       0      内容不同       0
```

即：**3 783 个共同路径（3 237 已跟踪 + 546 未跟踪）中，唯一内容差异是 handoff README
的工作树版本比 clone 快照新**（clone 建于 09:43，README 改于 09:49）；13 个「仅 A 有」
全部是本次验证自己产生的证据文件与 `compare-clones.mjs` 本身（clone 建于它们之前）。
**0 个缺失、0 个意外差异。**

## 5. 账本/来源一致性审核（新脚本，本次新增）

`scripts/handoff/audit-ledger-sources.mjs` 在干净 clone 内复跑，与主控侧完全一致：

```
页总数            510（v2 480 / 无 v2 profile 30）
缺口 A 页数        0 / 480 个 v2 页，涉及 0 个未声明 source id
差异 B2 页数       48 / 480 个 v2 页，涉及 145 个账本独有 source id
```

- **缺口 A = 0**：没有任何页面引用了一个 `profile.sources` 里没声明的 source id。
  `verify-cite-coverage.mjs` 只查单向（声明了没被引用），这个反向缺口**原本不在任何
  门禁里**，现在由本脚本覆盖。
- **差异 B2 = 48 页 / 145 个 sid**：账本里存在页面既未声明也未引用的来源。
  实测这些 sid 承载 **2 345 条摘录**（占 v2 页账本 37 701 条的 **6.2%**）。
  属于账本比页面宽，**不影响页面可追溯性**；是否裁剪由接手方决定（建议保留作审核留痕）。

每页明细见同目录 `ledger-sources.tsv`（510 行）。

## 6. 本目录文件清单

| 文件 | 内容 |
| --- | --- |
| `gate-summary.log` | 8 步汇总（含运行环境头） |
| `gate-1-reconcile-coverage.log` | 第 1 步回显（无输出，仅 exit 0） |
| `gate-2-tests-full.log` | 第 2 步回显（16 802 B） |
| `gate-2b-release-ingest.log` | 第 2b 步回显 |
| `gate-3-validate-data.log` | 第 3 步回显 |
| `gate-3b-model-coverage.log` | 第 3b 步回显（无输出，仅 exit 0） |
| `gate-4-build.log` | 第 4 步回显（64 886 B） |
| `gate-5-sync-skills.log` | 第 5 步回显 |
| `gate-6-cite-coverage.log` | 第 6 步回显（`结果: PASS` 全量数字） |
| `ledger-sources.tsv` | 510 页的账本/来源一致性明细 |

§4 的等价性比对脚本已入库为 `scripts/handoff/compare-clones.mjs`（sha256 逐文件比对），
其原始回显见 `compare-clones.txt`。

回显里含**原机绝对路径**（如 `/workspace/t98-cleanclone/...`），仅作证据保留，
不代表交接包依赖 `/workspace` 绝对路径——所有命令都用仓库相对路径。
