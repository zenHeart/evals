import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 对跑通后的运行做复算：结构校验只证明报告可解析，这里证明分数、来源字节和结论可追溯。
const root = new URL("..", import.meta.url);
const scriptPath = fileURLToPath(new URL("../scripts/evaluate-learning-agent.mjs", import.meta.url));
const RUNS = path.join(path.dirname(scriptPath), "..", "data", "eval-specs", "examples", "learning-agent-local-v1");
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const readJson = (dir, file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
const writeJson = (dir, file, value) => fs.writeFileSync(path.join(dir, file), `${JSON.stringify(value, null, 2)}\n`);
const GOOD = path.join(RUNS, "good");
const DEGRADED = path.join(RUNS, "degraded");

function copyRun(name, mutate = () => {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "learning-agent-run-"));
  fs.cpSync(path.join(RUNS, name), dir, { recursive: true });
  mutate(dir);
  return dir;
}

function withRun(name, mutate, body) {
  return async () => {
    const dir = copyRun(name, mutate);
    try { await body(dir); }
    finally { fs.rmSync(dir, { recursive: true, force: true }); }
  };
}

const evaluate = (dir, extra = []) => spawnSync(process.execPath, [scriptPath, ...extra, dir], { cwd: root, encoding: "utf8" });
// --json 不改变退出码语义：对账不一致时仍然退出 1，但 stdout 依旧是可解析的 JSON。
const evaluateJson = (dir, extra = []) => {
  const result = evaluate(dir, ["--json", ...extra]);
  assert.match(result.stdout, /^\{/, `--json 应输出 JSON：${result.stderr}`);
  const payload = JSON.parse(result.stdout);
  return payload.runs[0];
};

// 变异 trace.json 后重写 report.evidence.traces 的 hash，让溯源核对回到干净状态，
// 剩下的错误就只能是"复算值与记录值不符"这一类。
function restampTraceHash(dir) {
  const report = readJson(dir, "report.json");
  report.evidence.traces = [`trace.json#sha256=${sha256(fs.readFileSync(path.join(dir, "trace.json")))}`];
  writeJson(dir, "report.json", report);
}

// 重新导出被改动的来源文件时同步它在 report 里的声明 hash，隔离"改动来源"与"谎报指标"。
function restampSourceHash(dir, name) {
  const file = path.join(dir, "sources", name);
  const report = readJson(dir, "report.json");
  const source = report.source_snapshot.sources.find((s) => s.locator === `sources/${name}`);
  assert.ok(source, `source_snapshot 未声明 sources/${name}`);
  source.sha256 = sha256(fs.readFileSync(file));
  writeJson(dir, "report.json", report);
}

const findCase = (run, id) => run.cases.find((c) => c.id === id);

test("documented default command reconciles both bundled runs", () => {
  const result = spawnSync(process.execPath, [scriptPath], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.match(result.stdout, /evaluation consistent \(2 run\(s\)\): 2 consistent, 1 failed run\(s\)/);
  assert.match(result.stdout, /good[\s\S]*cases: 7\/7 recomputed pass, all match recorded[\s\S]*result: consistent, run passed/);
  assert.match(result.stdout, /degraded[\s\S]*idempotency_pass=false[\s\S]*effect_count=2[\s\S]*result: consistent, run failed/);
});

test("exit code reports reconciliation, not run success", () => {
  // 对账一致但运行失败的 degraded，退出码仍是 0；只有 --require-pass 才把质量结论变成门禁。
  const degraded = evaluate(DEGRADED);
  assert.equal(degraded.status, 0, degraded.stderr);
  assert.match(degraded.stdout, /result: consistent, run failed/);
  const good = evaluate(GOOD);
  assert.equal(good.status, 0, good.stderr);
  assert.match(good.stdout, /result: consistent, run passed/);

  const gatedGood = spawnSync(process.execPath, [scriptPath, "--require-pass", GOOD], { cwd: root, encoding: "utf8" });
  assert.equal(gatedGood.status, 0, gatedGood.stderr);
  const gatedDegraded = evaluate(DEGRADED, ["--require-pass"]);
  assert.equal(gatedDegraded.status, 1);
  const gatedBoth = spawnSync(process.execPath, [scriptPath, "--require-pass"], { cwd: root, encoding: "utf8" });
  assert.equal(gatedBoth.status, 1);
});

test("--json exposes the reconciliation the text summary claims", () => {
  const result = spawnSync(process.execPath, [scriptPath, "--json"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.deepEqual(payload.fatal, []);
  assert.equal(payload.runs.length, 2);

  const [good, degraded] = payload.runs;
  for (const run of [good, degraded]) {
    assert.equal(run.ok, true, run.errors.join("\n"));
    assert.equal(run.structure.ok, true);
    assert.equal(run.provenance.ok, true);
    assert.equal(run.reportCrossCheck.ok, true);
    assert.equal(run.reliability.match, true);
    assert.equal(run.thresholds.match, true);
    assert.equal(run.verdict.match, true);
    assert.equal(run.verdict.failingCases.every((f) => f.resolves && f.failing), true);
  }
  assert.equal(good.passed, true);
  assert.equal(degraded.passed, false);
  assert.equal(good.verdict.derivedQualityPass, true);
  assert.equal(degraded.verdict.derivedQualityPass, false);
  assert.equal(good.reliability.derived.idempotency_pass, true);
  assert.equal(good.reliability.derived.effect_count, 1);
  assert.equal(degraded.reliability.derived.idempotency_pass, false);
  assert.equal(degraded.reliability.derived.effect_count, 2);
  assert.deepEqual(degraded.verdict.failingCases, [
    { pointer: "trace.json#/recovery/idempotency_pass", resolves: true, value: false, failing: true },
  ]);
  assert.deepEqual(good.verdict.failingCases, []);
  assert.equal(good.provenance.promptHash.ok, true);
  assert.deepEqual(good.provenance.promptHash.matchedSources, ["prompt"]);
  assert.equal(good.provenance.traceHashes.every((t) => t.ok), true);
});

test("importing the evaluator produces no CLI output or process exit", () => {
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", `await import(${JSON.stringify(scriptPath)}); console.log('import completed');`], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "import completed\n");
  assert.equal(result.stderr, "");
});

for (const name of ["good", "degraded"]) {
  test(`${name} run reproduces every recorded measurement numerator and denominator`, () => {
    const run = evaluateJson(path.join(RUNS, name));
    const recorded = readJson(path.join(RUNS, name), "trace.json").measurements;
    const recomputable = Object.keys(recorded).filter((key) => key !== "claims");
    assert.equal(recomputable.length, 7);
    for (const key of recomputable) {
      const metric = run.metrics[key];
      assert.equal(metric.recomputed, true, `${key} 应可复算`);
      assert.equal(metric.numerator, recorded[key].numerator, `${key} numerator`);
      assert.equal(metric.denominator, recorded[key].denominator, `${key} denominator`);
      assert.equal(metric.ratio, recorded[key].numerator / recorded[key].denominator, `${key} ratio`);
    }
  });

  test(`${name} run reproduces every recorded case verdict from cases.json`, () => {
    const run = evaluateJson(path.join(RUNS, name));
    const trace = readJson(path.join(RUNS, name), "trace.json");
    assert.equal(run.cases.length, trace.cases.length);
    for (const recorded of trace.cases) {
      const recomputed = findCase(run, recorded.id);
      assert.equal(recomputed.derivedPass, recorded.passed, `${recorded.id} 派生判定`);
      assert.equal(recomputed.recordedPass, recorded.passed, `${recorded.id} 记录判定`);
      assert.equal(recomputed.match, true, `${recorded.id} 应一致`);
    }
  });

  test(`${name} run derives reliability from the tool-event log`, () => {
    const run = evaluateJson(path.join(RUNS, name));
    const recorded = readJson(path.join(RUNS, name), "trace.json").recovery;
    for (const key of ["replay_pass", "idempotency_pass", "timeout_retry_pass", "effect_count"]) {
      assert.equal(run.reliability.derived[key], recorded[key], key);
      assert.match(run.reliability.derivedFrom[key], /recovery\.(events|read_statuses)/, `${key} 应给出可追溯来源`);
    }
    assert.equal(run.reliability.match, true);
  });
}

test("every source byte, prompt hash and trace hash is recomputed from the run directory", () => {
  const run = evaluateJson(GOOD);
  const declared = readJson(GOOD, "report.json").source_snapshot.sources;
  assert.equal(run.provenance.sources.length, declared.length + 1); // +1 是 evidence.traces 指向的轨迹文件
  for (const source of declared) {
    const checked = run.provenance.sources.find((s) => s.locator === source.locator);
    assert.equal(checked.expected, source.sha256, source.locator);
    assert.equal(checked.actual, source.sha256, source.locator);
    assert.equal(checked.ok, true, source.locator);
  }
  const traceHash = sha256(fs.readFileSync(path.join(GOOD, "trace.json")));
  const traceEntry = run.provenance.sources.find((s) => s.trace);
  assert.equal(traceEntry.actual, traceHash);
  assert.equal(traceEntry.ok, true);
  assert.equal(run.provenance.traceHashes[0].expected, traceHash);
});

test("claims stays un-recomputed and is never zero-filled", () => {
  const run = evaluateJson(GOOD);
  const recorded = readJson(GOOD, "trace.json").measurements.claims;
  // trace 不记录论断分解：不得凭空造分子分母，也不得把记录值当作已核对的事实。
  assert.equal(run.metrics.claims.recomputed, false);
  assert.equal(run.metrics.claims.numerator, null);
  assert.equal(run.metrics.claims.denominator, null);
  assert.equal(run.metrics.claims.ratio, null);
  assert.deepEqual(run.metrics.claims.recorded, recorded);
  assert.equal(run.metrics.claims.recordedRatio, 0);
  assert.deepEqual(run.verdict.metricsNotRecomputed, ["claims"]);
  // 阈值按记录值 0/10 应用，判定路径与复算指标完全一致。
  assert.deepEqual(run.thresholds.applied.claims, { ratio: 0, verdict: true, rule: { max: 0 } });
});

test("mastery and cost dimensions stay out of the verdict", () => {
  const run = evaluateJson(GOOD);
  assert.deepEqual(run.verdict.dimensionsNotEvaluated, [
    "learning.explain",
    "learning.perform",
    "learning.debug",
    "learning.transfer",
    "learning.retain",
    "cost_latency（报告合同不含该字段）",
  ]);
  // 这些维度全是 pending / 缺失，却仍然得到 passed=true：结论只覆盖可核对的维度。
  assert.equal(run.passed, true);
});

test("evaluating a run does not write to the run directory", () => {
  const snapshot = (dir) => fs.readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => path.relative(dir, path.join(e.parentPath ?? e.path, e.name)))
    .sort()
    .map((rel) => {
      const stat = fs.statSync(path.join(dir, rel));
      return `${rel} ${stat.size} ${stat.mtimeMs}`;
    });
  for (const name of ["good", "degraded"]) {
    const dir = path.join(RUNS, name);
    const before = snapshot(dir);
    const result = evaluate(dir);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(snapshot(dir), before, `${name} 运行目录应保持只读`);
  }
});

test("tampered source byte is caught by recomputing the snapshot hash", withRun("good", (dir) => {
  const file = path.join(dir, "sources", "archive-v1.json");
  fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace("five items", "seven items"));
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /来源 archive-v1 \(sources\/archive-v1\.json\) hash 不符/);
  assert.doesNotMatch(result.stderr, /TypeError|at file:/);
}));

test("a declared source missing from the run directory is not silently skipped", withRun("good", (dir) => {
  fs.rmSync(path.join(dir, "sources", "restricted-note.json"));
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /来源 restricted-note \(sources\/restricted-note\.json\) hash 不符：source_snapshot 声明的文件在运行目录中不存在/);
  assert.doesNotMatch(result.stderr, /TypeError|at file:/);
}));

test("an undeclared file in sources/ is reported without an uncaught exception", withRun("good", (dir) => {
  fs.cpSync(path.join(dir, "sources", "archive-v1.json"), path.join(dir, "sources", "extra.json"));
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /来源 extra \(sources\/extra\.json\) hash 不符：存在于运行目录但未在 source_snapshot\.sources 中声明/);
  assert.doesNotMatch(result.stderr, /TypeError|Cannot read properties/);
  const run = evaluateJson(dir);
  assert.equal(run.provenance.ok, false);
  const extra = run.provenance.sources.find((s) => s.locator === "sources/extra.json");
  assert.equal(extra.ok, false);
  assert.match(extra.reason, /未在 source_snapshot\.sources 中声明/);
}));

test("a report metric that contradicts the recomputed value is drift", withRun("good", (dir) => {
  const report = readJson(dir, "report.json");
  report.results.retrieval.hit_rate = 0.8;
  writeJson(dir, "report.json", report);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /results\.retrieval\.hit_rate 记录值 0\.8 与复算值 1 不一致/);
  assert.doesNotMatch(result.stderr, /TypeError|at file:/);
}));

test("a trace measurement that contradicts cases.json is drift even with a re-stamped trace hash", withRun("good", (dir) => {
  const trace = readJson(dir, "trace.json");
  trace.measurements.citations.numerator = 5;
  writeJson(dir, "trace.json", trace);
  restampTraceHash(dir);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /指标 citations 复算分子分母 6\/6 与记录值 5\/6 不一致/);
  // trace hash 已同步重写，所以报错必须来自复算，而不是来源核对。
  assert.doesNotMatch(result.stderr, /hash 不符/);
}));

test("a ratio-invariant measurement lie is still caught by numerator and denominator", withRun("good", (dir) => {
  const trace = readJson(dir, "trace.json");
  trace.measurements.retrieval_hit = { numerator: 10, denominator: 10 };
  writeJson(dir, "trace.json", trace);
  restampTraceHash(dir);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /指标 retrieval_hit 复算分子分母 5\/5 与记录值 10\/10 不一致/);
  assert.doesNotMatch(result.stderr, /results\.retrieval\.hit_rate/);
}));

test("lying trace quality_pass is caught by re-deriving it", withRun("good", (dir) => {
  const trace = readJson(dir, "trace.json");
  trace.quality_pass = false;
  writeJson(dir, "trace.json", trace);
  restampTraceHash(dir);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /复算 quality_pass=true 与记录值 false 不一致/);
  assert.match(result.stdout, /verdict: quality_pass=true \(recorded false\)/);
}));

test("a failing case cannot be hidden behind quality_pass=true", withRun("good", (dir) => {
  const trace = readJson(dir, "trace.json");
  const target = trace.cases.find((c) => c.id === "stale-visible-reader");
  target.actual.refused = true; // 期望拒答 false：该 case 复算失败
  writeJson(dir, "trace.json", trace);
  restampTraceHash(dir);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /case stale-visible-reader 复算判定 false 与记录值 true 不一致/);
  assert.match(result.stderr, /复算 quality_pass=false 与记录值 true 不一致/);
  // 失败必须同时留下故障模式和可定位的失败指针，否则"缺分"会被当成没发生。
  assert.match(result.stderr, /运行未通过但 fault=none，缺少故障模式记录/);
  assert.match(result.stderr, /复算未通过但 evidence\.failing_cases 为空，失败项不可定位/);
  const run = evaluateJson(dir);
  assert.equal(findCase(run, "stale-visible-reader").checks.refusal_correct, false);
  assert.equal(run.passed, false);
}));

test("a fault run cannot claim quality_pass=true", withRun("degraded", (dir) => {
  const trace = readJson(dir, "trace.json");
  trace.quality_pass = true;
  writeJson(dir, "trace.json", trace);
  restampTraceHash(dir);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /复算 quality_pass=false 与记录值 true 不一致/);
}));

test("a failed run must keep a locatable failing pointer", withRun("degraded", (dir) => {
  const report = readJson(dir, "report.json");
  report.evidence.failing_cases = [];
  writeJson(dir, "report.json", report);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /复算未通过但 evidence\.failing_cases 为空，失败项不可定位/);
}));

test("a failing pointer must resolve to a falsy value", withRun("degraded", (dir) => {
  const report = readJson(dir, "report.json");
  report.evidence.failing_cases = ["trace.json#/fault"];
  writeJson(dir, "report.json", report);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /失败指针 trace\.json#\/fault 指向 "duplicate-write"，并非失败项/);
}));

test("a failing pointer into trace.cases resolves through the array index", withRun("degraded", (dir) => {
  const report = readJson(dir, "report.json");
  report.evidence.failing_cases = ["trace.json#/cases/0/passed"];
  writeJson(dir, "report.json", report);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  // 指到了真实存在的 true，所以报"并非失败项"，而不是"指针不存在"。
  assert.match(result.stderr, /失败指针 trace\.json#\/cases\/0\/passed 指向 true，并非失败项/);
  const run = evaluateJson(dir);
  assert.deepEqual(run.verdict.failingCases, [
    { pointer: "trace.json#/cases/0/passed", resolves: true, value: true, failing: false },
  ]);
}));

test("a failing pointer that does not exist in the trace is reported as unresolvable", withRun("degraded", (dir) => {
  const report = readJson(dir, "report.json");
  report.evidence.failing_cases = ["trace.json#/recovery/not_a_field"];
  writeJson(dir, "report.json", report);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /指针路径 trace\.json#\/recovery\/not_a_field 在轨迹中不存在/);
  const run = evaluateJson(dir);
  assert.equal(run.verdict.failingCases[0].resolves, false);
}));

test("a metric with no samples is undecidable, never zero", withRun("good", (dir) => {
  const cases = readJson(dir, "sources/cases.json");
  delete cases.find((c) => c.id === "pii-redaction").expected.absent;
  writeJson(dir, "sources/cases.json", cases);
  restampSourceHash(dir, "cases.json");
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /指标 pii 无法判定，运行结论不得记为通过/);
  assert.match(result.stdout, /pii no denominator \(未补零\)/);
  const run = evaluateJson(dir);
  assert.equal(run.metrics.pii.recomputed, true);
  assert.equal(run.metrics.pii.denominator, 0);
  assert.equal(run.metrics.pii.ratio, null);
  assert.equal(run.thresholds.applied.pii.verdict, null);
  assert.equal(run.thresholds.applied.pii.reason, "分母为 0，无法判定（未补零）");
  // 缺分母的运行不得记为通过，也不得把"未判定"渲染成一次真实的低分。
  assert.equal(run.passed, false);
  assert.equal(run.verdict.derivedQualityPass, false);
}));

test("hidden document text must not reach the answer", withRun("good", (dir) => {
  const trace = readJson(dir, "trace.json");
  const restricted = readJson(dir, "sources/restricted-note.json").text;
  const target = trace.cases.find((c) => c.id === "acl-denied");
  target.actual.text = `${target.actual.text}\n${restricted}`;
  writeJson(dir, "trace.json", trace);
  restampTraceHash(dir);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /case acl-denied 复算判定 false 与记录值 true 不一致/);
  const run = evaluateJson(dir);
  const checks = findCase(run, "acl-denied").checks;
  assert.equal(checks.hidden_text_leakage, false);
  assert.equal(checks.acl_scope, true, "检索范围本身没越权，越权的是正文外泄");
}));

test("retrieval outside the role ACL is a failed case", withRun("good", (dir) => {
  const trace = readJson(dir, "trace.json");
  trace.cases.find((c) => c.id === "acl-denied").actual.retrieved = ["restricted-note"];
  writeJson(dir, "trace.json", trace);
  restampTraceHash(dir);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /case acl-denied 复算判定 false 与记录值 true 不一致/);
  const run = evaluateJson(dir);
  assert.equal(findCase(run, "acl-denied").checks.acl_scope, false);
  // acl 指标复算的是生产者 acl_noninterference 的定义；越权检索由 case 级 acl_scope 检出，
  // 并直接让该 case 与运行结论失败，不靠改指标定义来"补分"。
  assert.equal(run.metrics.acl.numerator, 0);
  assert.equal(run.metrics.acl.denominator, 6);
  assert.equal(run.passed, false);
}));

test("duplicate ok results for one idempotency key break the derived reliability", withRun("good", (dir) => {
  const trace = readJson(dir, "trace.json");
  const duplicate = trace.recovery.events.find((e) => e.event === "tool_result" && e.status === "replayed");
  duplicate.status = "ok";
  writeJson(dir, "trace.json", trace);
  restampTraceHash(dir);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /recovery\.idempotency_pass 记录值 true 与导出值 false 不一致/);
  assert.match(result.stderr, /results\.reliability\.idempotency_pass 记录值 true 与导出值 false 不一致/);
  assert.match(result.stderr, /recovery\.effect_count 记录值 1 与导出值 2 不一致/);
  assert.match(result.stderr, /复算 quality_pass=false 与记录值 true 不一致/);
  const run = evaluateJson(dir);
  assert.equal(run.reliability.derived.idempotency_pass, false);
  assert.equal(run.reliability.derived.effect_count, 2);
  assert.equal(run.passed, false);
}));

test("a case present in cases.json but absent from the trace cannot be scored", withRun("good", (dir) => {
  const trace = readJson(dir, "trace.json");
  trace.cases = trace.cases.filter((c) => c.id !== "missing-evidence");
  writeJson(dir, "trace.json", trace);
  restampTraceHash(dir);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /轨迹中没有 case missing-evidence 的 actual 记录/);
  const run = evaluateJson(dir);
  assert.equal(run.cases.length, 6, "缺失的 case 不得凭空补一条通过记录");
}));

test("a case present in the trace but undefined in cases.json is drift", withRun("good", (dir) => {
  const trace = readJson(dir, "trace.json");
  trace.cases.push({ id: "invented-case", actual: { citations: [], refused: true, retrieved: [], text: "no matching evidence" }, passed: true });
  writeJson(dir, "trace.json", trace);
  restampTraceHash(dir);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /轨迹包含 cases\.json 未定义的 case invented-case/);
  const run = evaluateJson(dir);
  assert.equal(run.cases.some((c) => c.id === "invented-case"), false);
}));

test("a structurally invalid report stops before any provenance claim", withRun("good", (dir) => {
  const report = readJson(dir, "report.json");
  delete report.run.prompt_hash;
  writeJson(dir, "report.json", report);
}, (dir) => {
  const result = evaluate(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /run\.prompt_hash must be sha256:<64 lowercase hex>/);
  // 结构不过关时不进入溯源/复算分支，避免对一份无法解析的报告输出任何结论。
  assert.match(result.stdout, /structure: 1 error\(s\)/);
  assert.doesNotMatch(result.stdout, /provenance:|cases:|metrics:/);
  assert.match(result.stdout, /result: DRIFT$/m);
}));

test("an unreadable run directory is fatal instead of an empty pass", () => {
  const missing = path.join(os.tmpdir(), "learning-agent-absent-run");
  fs.rmSync(missing, { recursive: true, force: true });
  const result = evaluate(missing);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /report\.json|JSON read\/parse failed|sources 目录不可读/);
  assert.doesNotMatch(result.stderr, /TypeError|at file:/);
  const json = spawnSync(process.execPath, [scriptPath, "--json", missing], { cwd: root, encoding: "utf8" });
  assert.equal(json.status, 1);
  const payload = JSON.parse(json.stdout);
  assert.equal(payload.runs[0].passed, null);
  assert.ok(payload.fatal.length >= 1);
});
