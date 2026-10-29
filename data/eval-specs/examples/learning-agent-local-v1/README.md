# 实际运行的合成学习 Agent 报告

这里保存一次正常运行和一次故意重复写入的故障运行。它们由公开合成资料实际执行产生，报告、轨迹和来源文件保留原始字节；没有收录原始会话、checkpoint 文件或副作用账本。

生产者固定为 [learn-llm `b57370c10d55c09a68df5bf9b16a143e998fcdd3`](https://github.com/zenHeart/learn-llm/tree/b57370c10d55c09a68df5bf9b16a143e998fcdd3)，运行入口与范围见该版本的 [fixture README](https://github.com/zenHeart/learn-llm/blob/b57370c10d55c09a68df5bf9b16a143e998fcdd3/eval/learning-agent-local-v1/README.md)。**生产者仓库当前需要读取权限**，这些固定链接与下方 clone 命令并非对所有公开读者可用。公开样例可独立检查报告结构、文件 hash 和已记录的指标；重新执行生产者需要对应仓库权限及锁定环境。本目录没有复制私有运行器源码。

运行时使用的实现和来源字节已与此合并版本核对。采集日期见各报告的 `source_snapshot.captured_at`，Python 版本见 `trace.python`。

| 样例 | 运行器退出码 | `trace.quality_pass` | `results.reliability.idempotency_pass` | 实际副作用次数 |
| --- | --- | --- | --- | --- |
| [正常 report](good/report.json) / [trace](good/trace.json) | 0 | `true` | `true` | 1 |
| [故障 report](degraded/report.json) / [trace](degraded/trace.json) | 1 | `false` | `false` | 2 |

（来源：两份实际 `trace.json` 的 `recovery.effect_count`、质量字段和对应 CLI 运行结果。）故障模式为 `duplicate-write`；报告中的 `evidence.failing_cases` 指向 `trace.json#/recovery/idempotency_pass`。它像一条失败的集成测试：JSON 格式仍有效，业务断言已经失败。

## 在 evals 中检查

以下命令在本仓根目录执行，只读本地文件，无需联网或付费。

```bash
# 两份报告都应通过结构检查；这不代表两次运行都成功
node scripts/validate-learning-agent.mjs \
  data/eval-specs/examples/learning-agent-local-v1/good/report.json \
  data/eval-specs/examples/learning-agent-local-v1/degraded/report.json
```

质量结论另在轨迹中，不能从结构校验器的退出码推断：

```typescript
// 在本仓根目录用 node --input-type=module 运行；预期输出 good true、degraded false
import { readFileSync } from 'node:fs';
for (const name of ['good', 'degraded']) {
  const path = `data/eval-specs/examples/learning-agent-local-v1/${name}/trace.json`;
  const trace = JSON.parse(readFileSync(path, 'utf8'));
  console.log(name, trace.quality_pass);
}
```

报告的 source locator 相对于所在样例目录；每份 `sources/` 包含此次使用的 manifest、prompt、cases、阈值和文档。`source_snapshot.sources[].sha256`、`run.prompt_hash` 与 `evidence.traces` 中的 hash 对应这些实际文件；`trace.implementation_hashes` 对应固定生产者的 `python/agent_core/` 文件。`run.model.revision` 还绑定故障模式，因此两份报告的 revision 不同。结构校验器本身不核对这些文件内容或 hash。

## 从固定生产者重新运行

已获生产者仓库读取权限的读者，可按该版本的 [REPRODUCE.md](https://github.com/zenHeart/learn-llm/blob/b57370c10d55c09a68df5bf9b16a143e998fcdd3/REPRODUCE.md) 准备锁定环境。下面的获取仓库与安装依赖需要联网及仓库授权；报告运行本身不调用网络或付费模型。每次选择新的输出目录，已有结果不会覆盖。

```bash
git clone https://github.com/zenHeart/learn-llm.git learning-agent-example
cd learning-agent-example
git checkout b57370c10d55c09a68df5bf9b16a143e998fcdd3
# 按 REPRODUCE.md 安装依赖后执行；第一条退出 0，第二条预期退出 1 并保留失败报告
pnpm capstone:export --output-dir .artifacts/published-example/good
pnpm capstone:export --fault duplicate-write --output-dir .artifacts/published-example/degraded
```

重新运行的采集日期、Python 版本等记录可能不同，不能把整份报告逐字相同当作复现要求。核对固定来源与实现、指标的分子分母、失败指针和质量结果。

## 证据范围

这些样例只测固定的本地抽取式 fixture，不是真实 LLM、生产服务或学习者成绩。阈值在执行前固定于 `sources/thresholds.json`；方向和分子分母可从 producer README 与 `trace.measurements` 追溯。小型合成案例没有统计泛化保证，grounding 使用固定输出一致性检查，不是通用语义判官。

恢复过程使用真实磁盘 checkpoint，在同一进程中重建 engine/registry；未测操作系统强杀、跨进程并发或真实服务事务。来源中的 `user@example.com` 与 `SYNTHETIC_RESTRICTED_*` 都是公开合成测试值；完整来源属于评估者视角，不代表 reader 获得了其中所有文档的访问权限。

Explain / Perform / Debug / Transfer / Retain 仍全部为 `pending`，reviewer 为 `automated`。真实 token/费用、延迟 SLO 与 `cost_latency` 未测，未补零或写成通过；云部署和人工掌握也没有验收。因此这些报告只补充 [evals#35](https://github.com/zenHeart/evals/issues/35) 的运行样例证据，不关闭它或 [workflow#651](https://github.com/zenHeart/workflow/issues/651)。
