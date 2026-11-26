# issue 正文草稿（未创建、未评论）

> 本文件只是草稿。按 T87 / T91 / T83 明确指令：**不要在 GitHub 上创建或评论 issue**。
> 需要提交时，由人或本地 agent 手工执行；提交前请先把其中「待填」项补实。

---

**标题**：benchmark-profile/v2 存量升级与 2026-11-24 增量窗口已核验，待本地接管发布

**标签建议**：`enhancement` / `data-quality`（按仓库实际标签体系调整）

## 背景

`t83-integ` 分支上完成了两件事，均已通过全量审核与门禁链：

1. benchmark-profile/v2 存量升级（backlog 棘轮 135 → 28，510 个评测页的引文逐字核验清零）；
2. 执行日 2026-11-24 为止的增量发布落账（11 个 release / 509 条 evidence / 13 个归档目录，
   检查点推进到 2026-11-24）。

远程侧按 `STOP_PUBLISH` 停止领取新部署页，未 `git push`、未触发 Actions、未建 PR。

## 已完成（附证据路径，均为仓库内可 clone 复现）

- 全量引文审核：510 页 / 12 778 条 cite / **`quotes_bad > 0` 的页为 0**。
  明细 `docs/handoff/v2-upgrade-20261124-t83/logs/audit-checkone-510-final.jsonl`。
  逐字命中数按口径分两个，不要混用：
  **39 113** = 该 jsonl（07:35 快照）当场的逐字命中数；
  **39 279** = 当前账本摘录总数（496 个账本文件 / v2 页 37 701 + 非 v2 页 1 578）。
  两者相差 166 是因为证据库在 08:36 又被改写一次（15 个页面有增减，含去重收缩），
  时序差，不是漏核。
- 门禁链 **8 步**全绿：`reconcile-coverage` → `node --test tests/*.test.mjs`（**187/187**）→
  `release-ingest`（12/12）→ `validate-data` → `validate-model-coverage` → `build` →
  `sync:skills:check` → **`verify-cite-coverage`**（`结果: PASS`：页数 510 / cite 12 778 /
  账本摘录 39 279 / 悬空 cite 0 / 重复摘录 0 / 未被引用来源 0）。
  日志 `docs/handoff/v2-upgrade-20261124-t83/logs/gate-*.log`，脚本已入库
  `scripts/handoff/run-gate.sh`。
- **干净 clone 复现验证**（T98u 第 5 条）：`git clone` + 交接补丁 + 待提交未跟踪内容叠加后，
  8 步门禁 8/8 exit 0；`hlehle` 全 6 个来源从实时网络重抓 →
  `{"id":"hlehle","cites":31,"quotes_ok":70,"quotes_bad":0,"errors":0}`；
  3 783 个共同路径 sha256 逐字节一致（0 缺失 / 0 意外差异）。
  回显 `docs/handoff/v2-upgrade-20261124-t83/logs/clean-clone-20261125/`（12 个文件）。
  本次验证还发现并修复了一个只在干净 clone 上暴露的真实缺陷
  （`scripts/v2-rollout/helpers/_rv.py` 未自建 `data/fresh/`，见 AUDIT-REPORT §8.2）。
- ≥10% 引文复抓：64 页（12.5%），4 298 条命中 / 53 条 missing / 37 条 unverified /
  **0 条 unfetchable**；抓取前 purge 了直抓与 jina 双路缓存。结果
  `logs/reverify-10pct-result.jsonl`，归因 `logs/reverify-10pct-missing-class.txt`。
- 10 页内容抽检：10 页 / 53 来源 / 923 摘录 / 554 claim / **无裸 cite、无 `-` 占位符**；
  代表性数字已回查原始抓取文本确认真实。报告 `logs/spotcheck-10pages-report.md`。
- 账本/来源一致性审核（新脚本 `scripts/handoff/audit-ledger-sources.mjs`）：
  **缺口 A = 0 页 / 0 个 sid**（没有任何页面引用了 `profile.sources` 未声明的来源，
  这个反向缺口原本不在任何门禁里）；差异 B2 = 48 页 / 145 个账本独有来源，
  承载 2 345 条摘录（占 v2 页账本 37 701 条的 6.2%），不影响页面可追溯性，建议保留。
  明细 `logs/clean-clone-20261125/ledger-sources.tsv`。
- 增量窗口：`checkpoint.mjs status` 报窗口 2026-11-06 → 2026-11-24、锚点
  `last_max_release_date 2026-11-20` 单调不回退；账本窗口内 24 个 release 实体
  （20 verified + 4 pending）。提交 `8f851df`。

## 待本地接管

1. **发布侧 6 行未闭环**（`/workspace/rollout/published.tsv`）：4 行 `pending`
   （`one-million-bench` / `openai-error-inducing-prompts` / `openai-gif-moderation-recall` /
   `ovbench`，Actions URL 均为空，即从未成功触发 Pages 部署）；2 行 `failed`
   （`nl2repo` run 44852790713、`olympiadbench` run 44965290862）。
   `/workspace/rollout/out/` 是发布侧工作产物、**不随交接提交**，且与仓库内
   `data/model-coverage.json` 数字不一致（out/ 494 / `gate.lock` 记 502 / 仓库 496）。
   接手方以仓库内 `data/model-coverage.json` 与 `gate.lock` 为准，**不要从 out/ 回灌**。
2. **CI 部署缺陷已修但需线上验证**：提交 `fc56a57` 修正 `actions/deploy-pages@v4` 读
   Twirp `ArtifactService.ListArtifacts`（非 REST）的等待逻辑。该修复尚未在真实
   Pages 部署上跑通——停发期间无法验证。
3. **`multimodal-knowledge-agent` / `swebench-pro` 仍是 v1 模板**但不在 backlog 的 28 个 id 里，
   账实不一致；确认无并发升级后补进 backlog 或从 28 减到 26。
4. **53 条 missing 摘录**：21 条 cite 指向错误来源（同页其它来源可逐字命中，可定位修复）、
   32 条来源 drift（需重抓后才能定性，重抓前不要改摘录）。
5. **v2 档案重写时收紧 claim 数字的 locator**：10 页抽检发现 28.7% 的 claim 数字不在所挂
   摘录的 locator 内（数字真实，但挂点笼统）。

## 复现方式

```bash
git clone <repo-url> && cd <repo> && git checkout t83-integ && npm ci
# 8 步门禁链（等价于 scripts/handoff/run-gate.sh），预期全部 exit 0
node scripts/reconcile-coverage.mjs && node --test tests/*.test.mjs
node --test tests/release-ingest.test.mjs && node scripts/validate-data.mjs
node scripts/validate-model-coverage.mjs && npm run build && npm run sync:skills:check
node scripts/verify-cite-coverage.mjs          # 结果: PASS
node .claude/skills/ingest-releases/scripts/checkpoint.mjs status
```

**引文核验的两条路径，按是否需要逐字比对选一条：**

- **只要结构核验（不需要外置语料）**：`node scripts/verify-cite-coverage.mjs`
  ——只用仓库内输入，查悬空 cite、过短/重复摘录、未被引用来源、缺失账本。
- **要逐字比对原始抓取文本**：引文账本 `data/evidence/*.evidence.json`
  （496 文件 / 6 959 995 B / 39 279 条摘录）**已在库内**，它是唯一保存逐字摘录原文的地方；
  被比对的语料 `data/evidence/<id>/<sid>.txt`（约 2.2 GB）不随交接提交，按需重建：

  ```bash
  python3 -I scripts/v2-rollout/helpers/srcfetch.py <id> <sid> <url> ...
  EVIDENCE_DIR=data/evidence node scripts/check-one.mjs data/benchmarks/<id>.json
  ```

  注意 `check-one.mjs` 在语料目录整体缺失时输出 `corpus: "absent"` 并 exit 2，
  那是「无法比对」而不是「通过」。

完整步骤、预期输出与已知陷阱见 `docs/handoff/v2-upgrade-20261124-t83/README.md`
（§2 门禁链 / §3 引文账本）与 `AUDIT-REPORT.md` §8。

🤖 Generated with [Claude Code](https://claude.com/claude-code)
