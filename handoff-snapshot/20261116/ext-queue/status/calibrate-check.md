# EXT-CAL 校准任务残留核查报告（2026-11-15）

## 结论：已覆盖，无需补数据，未推 main

`feat/calibrate-coding-leaderboards` 的两项数据提交（`6b53a8d`、`2ed27a2`）的官方原值已全部在 origin/main 上，无缺失。

## 核查方法与证据

基线：merge-base = `bf91449`；分支 3 提交（ad41a71 → 6b53a8d → 2ed27a2）；origin/main 已含 `a92e8d4`（#72）与 `a03fa4a`（#74）。

1. **#72 即整分支的 squash 合入**。`a92e8d4` 的提交信息按序包含分支全部三条提交说明（fix(choose) 校准 / 按官方榜单补录 L0 原值 / FrontierSWE V2 复核 56.3·47.0），且其文件统计覆盖两项数据提交的全部 26 个文件。
2. **逐文件字节比对**（两项数据提交触碰的 26 个 data 文件，分支 HEAD vs 当前 origin/main）：
   - 25/26 完全一致（含 gpt-6-astra.json 新文件、deepseek-v3-2.json 单位修正、fable-5-1/5 复核值）。
   - 唯一差异 `claude-opus-5-5.json`：main 侧多一条 2026-11-13 的后续修订（OSWorld 2.0→2.1 行名更正，revisions 有记录）——main 严格更新，非分支内容缺失。
   - official/ 目录其余差异文件（README、alphagenome-2、alphaproof-code、gemini-4-hydrogen、gemini-decision-1、inkling、muse-ember、step-5-preview 等）均为 main 后续入库新增或 2026-11-13 更正，与本分支无关。
3. **关键数值在 origin/main 上直接验证**（reported_score，status=verified）：
   - Fable 5.1 `frontierswe-v2-leaderboard`（variant v2）= 56.3 percent（2ed27a2 ✓）
   - Fable 5 `frontierswe-v2-leaderboard`（variant v2）= 47.0 percent（2ed27a2 ✓）
   - GPT-6 Astra 建档在库，41 条 evidence，含 frontierswe-v2 65.5 / frontier-code-2.0 42.8 等（6b53a8d ✓）
   - DeepSeek V3.2 Speciale Codeforces = 2701，unit=elo（Elo 而非百分比，6b53a8d 单位修正 ✓）
   - Fable 5.1 frontier-code 2.0 = 32.4 percent（6b53a8d ✓）
4. 防回归设施在 main：`scripts/compare-audit.mjs` + `tests/compare-audit.test.mjs`（随 a92e8d4 入库），无需新增。

## 处置

- 不推 main（无缺失可补）；发布锁、FF、作者邮箱、还原 epub 等推送前置条件均不再适用。
- 未触碰 taskA（#76 公平对比收紧）范围，未采纳其残留建议。
- 分支 `feat/calibrate-coding-leaderboards` 保留原状（其内容已被 main 等价包含，可由后续清理流程按 `git cherry` 判据回收，非本任务动作）。

STATUS: DONE
