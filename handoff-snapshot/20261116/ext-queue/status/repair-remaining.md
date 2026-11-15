# EXT-REPAIR 状态：原全量升级范围内、尚未可发布页的有限修复

执行时间：2026-11-15 02:00–04:10（glm-self）。结论先行：**三类范围全部处置完毕**——
32 个 check-one 失败页全部修复并交逐页 publisher 重新验收发布；swebench-pro 恢复为 v2；
23 页列入拒绝清单（`/workspace/rollout/reject-final.tsv`）。未推送任何 commit（按约定全部由 publisher 完成）。

## 范围 1：缺 out 的历史 accept（5 页）

automationbench、biobasicsbench、charxiv-reasoning、cybergym、imo-answerbench：
重扫会话恢复件与全部工作树（`/workspace/rollout/wt/*`、`/workspace/evals-publish/data`），
均无合格 v2 成品 → 拒绝，保留线上旧版。

## 范围 2：accept 但 out 非 v2（18 页）

- **swebench-pro 恢复**：`wt/w10` 中存在完整 v2（11 sources，52 cites / 105 quotes，
  check-one 对生产证据 0 errors），已拷回 `out/swebench-pro.json`，交 publisher 重新验收。
- 其余 17 页（agents-last-exam … video-mmmu，见拒绝清单）：out 为 1–5KB stub/无 template，
  工作树无现成 v2；从现有证据目录补写完整 v2 属重新生成，超出本轮「有限修复」边界 → 拒绝，保留旧版。

## 范围 3：check-one 失败已记账的 32 页 — 全部修复

修复 ledger（publish-failed.tsv 32 id）与本轮修复集 1:1 对齐。先做诊断：**32 页原始证据中
所有摘录都能在归档 txt 中逐字命中，失败全部是「内容 cite 缺精确匹配摘录」**，据此分型修复
（/tmp/repair-w/repair.py，全部操作可复算，无编造）：

| 手段 | 页例 |
| --- | --- |
| 证据 txt 更名对齐 profile source id | arc-agi、gdpval-aa、mmvu、osworld、perception-bench、wmdp、openai-cobol-migration |
| 从既有归档逐字补抽缺失 cite 的摘录 | aa-lcr、aime24、appcif-bench、benchcad、claw-eval、countqa、gsm8k、hmmt25、lab-bench、longvideobench、lvbench、mcp-atlas、mmmu、mtob、posttrain-bench、remote-labor-index、skillsbench 等 |
| 内容 cite 重标到既有摘录的精确串 | aime24、benchcad、gsm8k（§3/§4/版本头/脚注）、lab-bench（arxiv id 笔误）、scicode |
| 来源增删（src_drop/src_add/src_rename） | ceval、claw-eval、mtob、tau2-bench、cmmlu(+commits API)、simpleqa(+eval-code/deprecated commit)、scicode |
| 数据修正 | infinitebench-en-mc（as_of）、nexus（verified_at）、ifbench（构造 cite 规范化） |

验证（scratch，/tmp/repair-w）：32/32 通过 check-one（0 errors）；并用与 `helpers/regate.sh`
完全相同的公式对 32 页跑线上 reverify（共享 `/workspace/rollout/fresh/` 缓存）→ 30 页直接 ACCEPT。
两页线上漂移者二修后通过：

- **aime24**（f=79 m=14 → f=93 m=0 u=8）：HF 数据集页重新渲染为 `$…$` 数学定界，摘录无法在线命中。
  以 reverify 抓取缓存重新归档 `hf-dataset.txt`（accessed 更新 2026-11-15），14 条题干摘录从新归档逐字重抽。
- **lvbench**（f=34 m=4 → f=38 m=0 u=0）：线上榜单表改竖排、`*` 空格变化。同法重归档 `site.txt`
  并重抽 4 条榜单行摘录。

（重归档 = 用同 URL 的当前线上抓取替换快照并如实更新 accessed；新旧摘录均逐字来自归档，非拼装。）

## 生产交接（已完成，未另起推送）

- 33 个 out（32 修复页 + swebench-pro）拷入 `/workspace/rollout/out/`；修复页证据
  （evidence.json + 变更 txt）同步到 `/workspace/rollout/evidence/`；
  清除 33 页在 `logs/publish-cache.tsv` 的缓存行。
- 抽查 3 页（arc-agi/aime24/scicode）对生产证据目录重跑 check-one：0 errors。
- publisher（PID 1050426，一页一提交模式）已将全部 33 页列为 need=1 候选，
  按 regate 同口径逐页重新验收后自动上线；发布结果以 `published.tsv` / `regated.tsv` 为准。
  如个别页因线上再漂移被隔离，见 `publish-blocked.tsv`（out 再变更会自动解禁），不在本轮追加修复。

## 拒绝清单

`/workspace/rollout/reject-final.tsv`（23 行）：范围 1 共 5 页、范围 2 共 17 页、finance-agent
（gate reject，不上线）。均保留线上旧版。

STATUS: DONE
