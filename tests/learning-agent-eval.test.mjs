import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = new URL("..", import.meta.url);
const script = new URL("../scripts/validate-learning-agent.mjs", import.meta.url);
const example = JSON.parse(fs.readFileSync(new URL("../data/eval-specs/fixtures/learning-agent-v1-example.json", import.meta.url), "utf8"));
const checkReport = (report) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "learning-agent-validator-"));
  try {
    const file = path.join(dir, "report.json");
    fs.writeFileSync(file, JSON.stringify(report));
    return spawnSync(process.execPath, [script.pathname, file], { cwd: root, encoding: "utf8" });
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
};

test("documented default command validates only the structural example", () => {
  const result = spawnSync(process.execPath, [script.pathname], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /structure validation passed/);
  assert.match(result.stdout, /not verified/);
});

test("importing the validator has no CLI output or process exit", () => {
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", `await import(${JSON.stringify(script.href)}); console.log('import completed');`], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "import completed\n");
  assert.equal(result.stderr, "");
});

for (const field of ["subject", "run.model.provider", "run.model.name", "run.model.revision"]) {
  for (const value of [12, {}, [], false, "", " \t\n"]) {
    test(`${field} rejects non-string or blank ${JSON.stringify(value)}`, () => {
      const report = structuredClone(example);
      const keys = field.split(".");
      const name = keys.pop();
      const target = keys.reduce((o, k) => o[k], report);
      target[name] = value;
      const result = checkReport(report);
      assert.equal(result.status, 1, result.stdout);
      assert.match(result.stderr, new RegExp(field.replaceAll(".", "\\.")));
    });
  }
}

for (const field of ["", "source_snapshot", "source_snapshot.sources.0", "run", "run.model", "results", "results.retrieval", "results.grounding", "results.safety", "results.reliability", "results.learning", "evidence"]) {
  test(`unknown approval field is rejected at ${field || "root"}`, () => {
    const report = structuredClone(example);
    const target = field ? field.split(".").reduce((o, k) => o[k], report) : report;
    target.learner_graduation_approved = true;
    const result = checkReport(report);
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, /unknown field learner_graduation_approved/);
  });
}

for (const date of ["2026-99-99", "2026-02-29", "2026-04-31", "not-a-date"]) {
  test(`invalid calendar date ${date} is rejected`, () => {
    const report = structuredClone(example);
    report.source_snapshot.captured_at = date;
    assert.equal(checkReport(report).status, 1);
  });
}

test("schema-valid leap day and negative integer seed are accepted", () => {
  const report = structuredClone(example);
  report.source_snapshot.captured_at = "2024-02-29";
  report.run.seed = -1;
  const result = checkReport(report);
  assert.equal(result.status, 0, result.stderr);
});

test("null JSON is a validation error without an uncaught exception", () => {
  const result = checkReport(null);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /report must be an object/);
  assert.doesNotMatch(result.stderr, /TypeError|at file:/);
});

test("learning-agent-v1 self-test validates the good and bad fixtures", () => {
  const output = execFileSync(process.execPath, ["scripts/validate-learning-agent.mjs", "--self-test"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  });
  assert.match(output, /self-test passed/);
});

test("learning-agent-v1 validator rejects missing provenance", () => {
  const result = spawnSync(process.execPath, [
    "scripts/validate-learning-agent.mjs",
    "data/eval-specs/fixtures/learning-agent-v1-invalid.json",
  ], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /source_snapshot\.sources/);
  assert.match(result.stderr, /prompt_hash/);
});

