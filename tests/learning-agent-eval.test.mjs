import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";

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
