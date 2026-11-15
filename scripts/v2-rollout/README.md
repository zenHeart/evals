# v2 增量发布运行时脚本（已脱敏入库）

本目录是评测页 v2 升级 / 逐页发布相关脚本的版本化副本，供后续 agent 在换机或本机接管时对照。

## 重要：原机正在跑的才是现行控制面

在原工作机上，**正在运行的发布器与调度器仍然使用**：

- `/workspace/rollout/publisher.sh`（pidfile `/workspace/rollout/publisher.pid`，锁 `/workspace/rollout/publish.lock`）
- `/workspace/ext-queue/dispatcher.sh`
- `/workspace/sf-conductor/conductor.sh`

**不要**在发布器仍存活时，再从本目录或其它路径启动第二个 `publisher.sh`。所有权标记：`/workspace/rollout/PUBLISH_OWNER`。

本目录只是仓库内备份与换机种子。原机若要把仓库副本同步回运行目录，须先停掉或持有 `publish.lock`，并核对 diff，避免覆盖正在写入的工作树 `/workspace/evals-publish`。

## 授权模型（禁止把 token 值写入仓库或 issue）

已授权：`CC_MINIMAX_SELF_TOKEN`、`CC_GLM_SELF_TOKEN`（仅通过 `apiKeyHelper` 从环境或本机 `secrets.zsh` 读取）。

未授权（不要用）：`CC_GLM_TOKEN`、`Z_AI_API_KEY`、`CC_STEP_EXPLORE_TOKEN`、`CC_MINIMAX_TOKEN`、以及 MiniMax 公司/家庭密钥。

settings 里只有环境变量名与占位符，没有密钥。`helpers/glm-key.sh` 打印 `CC_GLM_SELF_TOKEN`，`helpers/minimax-key.sh` 打印 `CC_MINIMAX_SELF_TOKEN`。

## 逐页发布（不可改为凑批）

- `MAX_BATCH` 固定语义为 1：一页一次检查、一次提交、一次推送、一次 Actions / 线上 v2 双确认。
- 失败页记入 `publish-failed.tsv` 并隔离，不阻塞其它合格页。
- 不得跳过 `check-one` / `validate-data` / `reconcile-coverage` / 测试等全局门禁，不得为过关伪造数据。
- 不 force push、不改已推历史、不提交 `evals.epub`、不删远程分支、不删除线上未完成页的旧版。

## 常用命令（原机）

```bash
# 发布器是否在跑
cat /workspace/rollout/publisher.pid /workspace/rollout/publisher.state /workspace/rollout/PUBLISH_OWNER
kill -0 "$(cat /workspace/rollout/publisher.pid)" && echo alive
tail -n 30 /workspace/rollout/logs/publisher.out

# 按远程主干与线上恢复记账（不要只信本机 published.tsv）
cd /workspace/evals-publish && git fetch origin
python3 /workspace/rollout/helpers/reconcile-published.py   # 若脚本参数有变，先读脚本头

# 单页门禁（在发布工作树、已拷入该页 JSON 后）
# 发布器经 publish-batch.sh 调用，不要手工把未验收 JSON 批量灌入 main
```

构建与部署由 `.github/workflows/build-epub.yml` 在推送到 `main` 后触发。本地不要提交生成的 `evals.epub`。站点：https://evals.zenheart.site/

## dispatcher 队列文件竞态

历史 bug：`update_queue_field` 原地截断写 `queue.tsv`，导致同一轮循环误启动残缺 id（如 `-QA`）。仓库副本与原机脚本文件已改为 `mkstemp` + `os.replace` 原子替换。**正在运行的 dispatcher 进程仍是旧函数**，不要为交接去重启它；下次进程退出后再起来即生效。
