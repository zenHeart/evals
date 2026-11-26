# 交接清单（manifests）

本目录收拢「继续推进所必需的账目」。四个文件全部**不依赖 `/workspace` 绝对路径、不含密钥**，
可直接随仓库 clone 走。生成/来源与列含义如下，逐项可复核。

| 文件 | 行数 | 来源 | 可否在 clone 内重新生成 |
| --- | --- | --- | --- |
| `candidates-23.tsv` | 23 + 表头 | `node scripts/handoff/candidates-window.mjs 2026-11-24` | **可以**，输入全在仓库内 |
| `published.tsv` | 326 | 发布控制面 `/workspace/rollout/published.tsv` 时点快照 | 不可以，发布台账只存在于控制面 |
| `publish-blocked.tsv` | 1 | 同上 | 不可以 |
| `backlog.tsv` | 8 | 同上 | 不可以 |

三个 `*.tsv` 快照与来源**逐字节相同**（md5 已核对），因此可以用
`diff manifests/published.tsv <控制面>/published.tsv` 判断控制面是否又往前走了。

---

## 1. `candidates-23.tsv` — 「23 候选」逐项账

对应 `/goal` 里的「23 候选」：`data/model-coverage.json` 中 `discovered_at` 为
**2026-11-24T12:05:25.953Z** 的 23 条，即本次增量扫描入口新发现的全部候选。

列含义（第 13 列由脚本现算，其余直接取自 `data/model-coverage.json`）：

| 列 | 含义 |
| --- | --- |
| `candidate_id` / `vendor_id` / `family` | 候选 id、厂商、标题/家族名 |
| `release_id` | 该候选归并到的 release 实体 id；**空 = 不产生 release 记录** |
| `classification` | `general` / `vertical` / `product` / `unknown` |
| `discovery_status` | `discovered`（保留）/ `excluded`（判定不建档） |
| `archive_status` | `archived` / `not_archived` |
| `evidence_status` | `reported`（已抽证据）/ `not_extracted` / `not_reported` |
| `official_source_verified` | 官方来源是否已人工核实（本批全为 `no`） |
| `exclusion_reason` | 排除理由；`discovery_status=excluded` 时应有值 |
| `official_urls` | 空格分隔的官方 URL |
| `official_json_present` | `release_id` 对应的 `data/model-releases/official/<vendor>/<release_id>.json` 是否存在 |

### 实测分布（脚本 stderr 同款数字）

- **23** 条候选 = **14 条带 `release_id`** + **9 条不带**。
- 14 条带 `release_id` 的候选**全部**能在 `data/model-releases/official/` 找到对应 JSON
  （无缺失实体）；它们指向 **10 个不同 release**（多个候选可归并到同一 release，
  例如 `mai-code-2` / `mai-realtime-1` / `mai-cyber-2-flash` / `mai-image-2-7` / `inkling-2-mini`
  各被 2 条候选指向）。
- `discovery_status × archive_status`：`discovered+archived 13`、`discovered+not_archived 2`、
  `excluded+archived 3`、`excluded+not_archived 5`。
- `evidence_status`：`reported 11`、`not_extracted 11`、`not_reported 1`。

### 需要后续 agent 判断的三处账面不一致（均已机器定位，未擅自改数据）

1. `thinking-machines-0428098a1ab0`（TML-d24-varloop-research）`discovery_status=excluded`
   但**没有 `exclusion_reason`**。它是本批唯一「排除但无理由」的项。
2. `openai-9342dbf934e4`、`openai-a1de396d3910` `discovery_status=discovered` 却**带了
   `exclusion_reason`**（「产品/工具/平台/方案更新，非独立模型发布」）。状态与理由互相矛盾，
   按理由看应当 `excluded`；未改是因为改状态会影响 reconcile 口径。
3. `microsoft-e724d5d4fc0b`（Ignite 2026 MAI keynote transcript）、`openai-b0689cf87ab5`（Shirudo）
   两条 `archive_status=archived` 但**没有 `release_id`**——它们归档在 `models/<date>-<slug>/`
   目录（范围外登记），不在 `official/<vendor>/` 下。这是设计如此，不是缺文件。

---

## 2. `published.tsv` — 发布台账（326 行，无表头）

列：`id \t commit_sha \t 发布时间 \t 线上 URL \t Actions run URL \t 状态`

**状态在第 6 列**（用 `awk -F'\t' '{print $2}'` 取到的是 commit SHA，不是状态）。

| 状态 | 行数 | 说明 |
| --- | --- | --- |
| `ok` | 320 | 已发布且线上可访问 |
| `pending` | 4 | `one-million-bench`(16:46:11)、`openai-error-inducing-prompts`(17:09:38)、`openai-gif-moderation-recall`(17:40:04)、`ovbench`(18:17:41) |
| `failed` | 2 | `nl2repo`(2026-11-21 09:53:22, run 44852790713)、`olympiadbench`(2026-11-22 08:10:01, run 44965290862) |

四条 `pending` 的 **Actions URL 均为空**，即从未成功触发过 Pages 部署，不是「部署中」。
`STOP_PUBLISH` 生效期间未重试，故这 6 行是本地接管后的第一批待办。

## 3. `publish-blocked.tsv` — 阻塞清单（1 行）

列：`id \t 阻塞原因 \t 阻塞时间 \t <run 标识>`

```
multichallenge  连续 3 次未通过：2026-11-21 08:10:49 'multichallenge',;  2026-11-21 08:14:50  1795090824:24447
```

**账实不一致（已知）**：`multichallenge` 在 `published.tsv` 里已是 `ok`（2026-11-21 17:35:36 发布成功），
但这条 block 行没被清掉。清 block 时**以 `published.tsv` 为准**。

## 4. `backlog.tsv` — 重试日志（8 行），**不是** backlog 台账

列：`id \t reason \t attempt \t duration_seconds \t 时间`
（由 `worker-sf.sh:165` 的 `printf '%s\t%s\t%s\t%s\t%s\n' "$id" "$reason" "$attempt" "$dt" "$(date '+%F %T')"` 写出。）

**第 4 列是耗时秒数，不是错误数。** 只记录 `cmt-benchmark` 与 `full-duplex-bench` 两页：

| id | attempt | 耗时(s) | 时间 |
| --- | --- | --- | --- |
| cmt-benchmark | 2 | 404 | 2026-11-14 02:34:49 |
| full-duplex-bench | 2 | 437 | 2026-11-14 03:57:09 |
| icpc-world-finals-2025 | 2 | 451 | 2026-11-14 04:43:13 |
| hy-math | 2 | 1208 | 2026-11-14 04:50:08 |
| cmt-benchmark | 2 | 430 | 2026-11-19 20:31:51 |
| full-duplex-bench | 2 | 611 | 2026-11-19 20:36:51 |
| cmt-benchmark | 2 | 2348 | 2026-11-25 03:12:14 |
| full-duplex-bench | 2 | 877 | 2026-11-25 07:50:05 |

`icpc-world-finals-2025` 与 `hy-math` 只在 11-14 出现过，之后未再重试；
`cmt-benchmark` / `full-duplex-bench` 到 **2026-11-25 07:50** 仍在重试，且耗时在涨
（404 → 430 → 2348 s）。

**权威 backlog 台账在仓库内**：`data/benchmark-profile-backlog.json`，`count: 28`，
「只减不增：升级一个就删一个」。两页的实测现状（2026-11-25 09:0x，仓库内可复现）：

```
$ node scripts/check-one.mjs data/benchmarks/cmt-benchmark.json
{"id":"cmt-benchmark","cites":0,"quotes_ok":0,"quotes_bad":0,"errors":0,"corpus":"absent"}
$ node scripts/check-one.mjs data/benchmarks/full-duplex-bench.json
{"id":"full-duplex-bench","cites":0,"quotes_ok":0,"quotes_bad":0,"errors":0,"corpus":"absent"}
```

两页都是 **~1.9 KB 的 v0 桩**（无 `profile`、无 `sources`、无 `cites`），
因此 `check-one.mjs` 报 `cites: 0 / errors: 0`——**不是通过，是无内容可验**。
重试日志里的秒数与任何仓库内检查都对不上，接手重试循环前需先重新界定该列的判定来源。

---

## 5. 重新生成 candidates-23.tsv

```bash
node scripts/handoff/candidates-window.mjs 2026-11-24 -o docs/handoff/v2-upgrade-20261124-t83/manifests/candidates-23.tsv
```

脚本只读 `data/model-coverage.json` 与 `data/model-releases/official/`，无网络、无外部依赖。
换成其它扫描日：`node scripts/handoff/candidates-window.mjs <YYYY-MM-DD>`。
