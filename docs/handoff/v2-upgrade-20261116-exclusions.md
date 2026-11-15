# 本次提交主动排除清单（v2 升级交接，2026-11-16）

以下内容**有意不入库**。原机数据并未删除。

## 机密与凭据

- 任何 token / API key 的值（包括环境变量实际内容和 `~/.config`、`secrets.zsh`）
- `CC_GLM_TOKEN`、`Z_AI_API_KEY`、`CC_STEP_EXPLORE_TOKEN`、`CC_MINIMAX_TOKEN`、MiniMax 公司/家庭密钥相关配置
- 带有真实 Authorization 头的 settings（仓库内只保留 `${ENV}` 占位符）
- 用户凭据、gh hosts 中的 token、Claude / 模型供应商登录态

## 运行时脏文件与生成物

- `evals.epub` 以及一切构建产物、cache、`node_modules`、`__pycache__`
- `/workspace/evals-publish` 工作区未提交改动（交接时发布器可能正在写某一页，例如当时的 `eifbench` / 后续页；不得打断或把半成品提交）
- pidfile、lock、`PUBLISH_OWNER`、`READY_FINAL`、`dispatcher.pid`、`*.live.pids`

## 完整日志与会话

- `/workspace/rollout/logs/`、`/workspace/ext-queue/logs/`、`/workspace/sf-conductor/logs/`
- Claude / StepFun / MiniMax / GLM 会话原文与 `~/.claude/projects/**/*.jsonl`
- 完整 worker 输出、调试探测目录（`mcptest/`、`glmprobe/` 等）

## 大体量本地数据（换机不能只靠 git 克隆得到）

- `/workspace/rollout/evidence/`（约 2.1G，第三方抓取原文，不入仓）
- `/workspace/rollout/fresh/`（约 5.5G）
- `/workspace/rollout/view/`（约 281M）
- `/workspace/rollout/wt/` 及其它 git worktree（约 13G，运行时工作树，不入仓）
- 快照分支用「文件名清单」代替证据原文；页面成品 JSON 在快照分支 `handoff-snapshot/20261116/out/`

## 未验收页面不得灌入 main

- 数百个已 accept 但尚未逐页通过发布门禁的 `out/*.json`：**只在快照分支**，禁止一次性合并进 `main`
- 证据摘要以外的原始抓取
- 队列台账（`gate.tsv`、`published.tsv` 等）在快照分支，不作为已验收主干数据

## 未纳入的其它工作树改动

- `v2-spec` 上除已拣选的两则技能文档外、落后 `origin/main` 130 个提交的历史分叉，不整支合并
- `feat/fair-tighten`、`feat/fair-compare`、`feat/competitor-columns` 等 TaskA 相关分支：TaskA / 校准已在主干，不重做、不扩展未批准的残留建议
- 与本评测升级无关的本地修改
- `cc-speed-glm.json` / `cc-speed45-glm.json` 的 z.ai 通道模板（易被误当成未授权 `CC_GLM_TOKEN`/`Z_AI_API_KEY` 通道）；仓库只收 glm-self / minimax-self 模板

## 恢复办法

见 `docs/handoff/v2-upgrade-20261116.md`：「从远程恢复」与「原机接管」。
