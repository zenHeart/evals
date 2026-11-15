#!/usr/bin/env bash
# preflight-rules.sh <id...>
# 在不碰发布工作树的前提下，预先算出「这些候选页里哪些会卡在数据层门禁上」。
# 目前覆盖 compare-audit 的 undecided（有官方数值、但 compare-rules.json 没有计分/参考决定）。
# 输出：每行一个会卡住的 id（stdout）；诊断信息走 stderr。
#
# 做法：搭沙箱目录（scripts/book 真拷贝、data 里除 benchmarks 外软链、
# data/benchmarks 软链 + 候选页真实文件覆盖），在沙箱里跑 auditCompare({pairs:false})。
set -uo pipefail
WT=${PUBLISH_WT:-/workspace/evals-publish}
R=/workspace/rollout
[ $# -ge 1 ] || { echo "usage: preflight-rules.sh <id...>" >&2; exit 2; }

SB=$(mktemp -d)
trap 'rm -rf "$SB"' EXIT
mkdir -p "$SB/data/benchmarks"
cp -r "$WT/scripts" "$SB/scripts"
for e in "$WT/data"/*; do
  [ "$(basename "$e")" = benchmarks ] && continue
  ln -s "$e" "$SB/data/$(basename "$e")"
done
for f in "$WT/data/benchmarks"/*.json; do ln -s "$f" "$SB/data/benchmarks/$(basename "$f")"; done
for id in "$@"; do
  [ -f "$R/out/$id.json" ] && ln -sf "$R/out/$id.json" "$SB/data/benchmarks/$id.json"
done

cat > "$SB/preflight.mjs" <<'JS'
import { auditCompare } from './scripts/compare-audit.mjs';
import { loadBenchData } from './scripts/load-data.mjs';
const ids = new Set(process.argv.slice(2));
const a = auditCompare(loadBenchData(), { pairs: false });
// undecided：有官方数值但没有计分/参考决定；stranded：可计分评估上的数值因指标写法对不上而不计分，
// 且没在 metric_aliases / reviewed_metric_mismatch 登记。两者都会让 compare-audit 门禁失败。
const seen = new Set();
const emit = (bench, kind) => { if (ids.has(bench) && !seen.has(bench)) { seen.add(bench); console.log(`${bench}\t${kind}`); } };
for (const u of a.undecided) emit(u.bench, 'undecided');
for (const s of a.stranded) emit(s.bench, 'stranded');
const nu = a.undecided.filter(u => ids.has(u.bench)).length;
const ns = a.stranded.filter(s => ids.has(s.bench)).length;
console.error(`preflight: undecided=${nu} stranded=${ns} orphans=${a.orphans.filter(o=>ids.has(o.id)).length}`);
JS

(cd "$SB" && node preflight.mjs "$@")
