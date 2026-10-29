#!/usr/bin/env node
/**
 * Validate learning-agent-v1 evidence reports without adding a runtime dependency.
 *
 * This checks report structure, not source bytes, metric truth or learner mastery.
 * Provenance fields are mandatory, while metrics are bounded [0, 1].
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURES = path.join(ROOT, "data", "eval-specs", "fixtures");
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SHA = /^[a-f0-9]{64}$/;
const PROMPT_HASH = /^sha256:[a-f0-9]{64}$/;
const SOURCE_ID = /^[a-z0-9][a-z0-9._-]*$/;

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const required = (out, file, value, key) => {
  if (typeof value !== "string" || !value.trim()) out.push(`${file}: ${key} must be a non-empty string`);
};
const validDate = (value) => {
  if (typeof value !== "string" || !DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};
const exactKeys = (out, file, value, allowed, label) => {
  if (!isObject(value)) return;
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) out.push(`${file}: ${label} has unknown field ${key}`);
  }
};
const bounded = (out, file, value, key) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1)
    out.push(`${file}: ${key} must be a number in [0, 1]`);
};
const stringEnum = (out, file, value, key, values) => {
  if (typeof value !== "string" || !values.includes(value))
    out.push(`${file}: ${key} must be one of ${values.join(", ")}`);
};

export function validateLearningAgentReport(report, file = "<report>") {
  const out = [];
  if (!isObject(report)) return [`${file}: report must be an object`];
  exactKeys(out, file, report, ["artifact","spec","subject","source_snapshot","run","results","evidence"], "report");
  if (report.artifact !== "learning-agent-eval") out.push(`${file}: artifact must be learning-agent-eval`);
  if (report.spec !== "eval-spec-v1") out.push(`${file}: spec must be eval-spec-v1`);
  required(out, file, report.subject, "subject");

  const snapshot = report.source_snapshot;
  if (!isObject(snapshot)) out.push(`${file}: source_snapshot must be an object`);
  else {
    exactKeys(out, file, snapshot, ["id","captured_at","sources"], "source_snapshot");
    required(out, file, snapshot.id, "source_snapshot.id");
    if (typeof snapshot.id !== "string" || !SOURCE_ID.test(snapshot.id))
      out.push(`${file}: source_snapshot.id must be lowercase stable id`);
    if (!validDate(snapshot.captured_at))
      out.push(`${file}: source_snapshot.captured_at must be a valid YYYY-MM-DD date`);
    if (!Array.isArray(snapshot.sources) || snapshot.sources.length === 0)
      out.push(`${file}: source_snapshot.sources must be a non-empty array`);
    else {
      const ids = new Set();
      for (const [i, source] of snapshot.sources.entries()) {
        const tag = `${file}: source_snapshot.sources[${i}]`;
        if (!isObject(source)) { out.push(`${tag} must be an object`); continue; }
        exactKeys(out, tag, source, ["id","locator","sha256","access"], "source");
        for (const key of ["id","locator","sha256","access"]) required(out, tag, source[key], key);
        if (typeof source.id !== "string" || !source.id.trim()) out.push(`${tag}.id must be non-empty`);
        if (ids.has(source.id)) out.push(`${tag}.id duplicates another source`);
        ids.add(source.id);
        if (typeof source.locator !== "string" || !source.locator.trim()) out.push(`${tag}.locator is required`);
        if (typeof source.sha256 !== "string" || !SHA.test(source.sha256)) out.push(`${tag}.sha256 must be 64 lowercase hex characters`);
        stringEnum(out, tag, source.access, "access", ["public","synthetic","restricted"]);
      }
    }
  }

  const run = report.run;
  if (!isObject(run)) out.push(`${file}: run must be an object`);
  else {
    exactKeys(out, file, run, ["seed","model","prompt_hash"], "run");
    if (!own(run, "seed") || (run.seed !== null && !Number.isInteger(run.seed)))
      out.push(`${file}: run.seed must be an integer or null`);
    if (!isObject(run.model)) out.push(`${file}: run.model must be an object`);
    else {
      exactKeys(out, file, run.model, ["provider","name","revision"], "run.model");
      for (const key of ["provider","name","revision"]) required(out, file, run.model[key], `run.model.${key}`);
    }
    if (typeof run.prompt_hash !== "string" || !PROMPT_HASH.test(run.prompt_hash))
      out.push(`${file}: run.prompt_hash must be sha256:<64 lowercase hex>`);
  }

  const results = report.results;
  if (!isObject(results)) out.push(`${file}: results must be an object`);
  else {
    exactKeys(out, file, results, ["retrieval","grounding","safety","reliability","learning"], "results");
    const retrieval = results.retrieval;
    if (!isObject(retrieval)) out.push(`${file}: results.retrieval must be an object`);
    else {
      exactKeys(out, file, retrieval, ["mode","hit_rate","mrr"], "retrieval");
      stringEnum(out, file, retrieval.mode, "results.retrieval.mode", ["deterministic-file","hybrid","vector"]);
      bounded(out, file, retrieval.hit_rate, "results.retrieval.hit_rate");
      bounded(out, file, retrieval.mrr, "results.retrieval.mrr");
    }
    const grounding = results.grounding;
    if (!isObject(grounding)) out.push(`${file}: results.grounding must be an object`);
    else {
      exactKeys(out, file, grounding, ["citation_precision","unsupported_claim_rate","abstention_quality"], "grounding");
      for (const key of ["citation_precision","unsupported_claim_rate","abstention_quality"])
        bounded(out, file, grounding[key], `results.grounding.${key}`);
    }
    const safety = results.safety;
    if (!isObject(safety)) out.push(`${file}: results.safety must be an object`);
    else {
      exactKeys(out, file, safety, ["acl_leakage_rate","injection_resistance","pii_redaction"], "safety");
      for (const key of ["acl_leakage_rate","injection_resistance","pii_redaction"])
        bounded(out, file, safety[key], `results.safety.${key}`);
    }
    const reliability = results.reliability;
    if (!isObject(reliability)) out.push(`${file}: results.reliability must be an object`);
    else {
      exactKeys(out, file, reliability, ["replay_pass","idempotency_pass","timeout_retry_pass"], "reliability");
      for (const key of ["replay_pass","idempotency_pass","timeout_retry_pass"]) {
        if (typeof reliability[key] !== "boolean") out.push(`${file}: results.reliability.${key} must be boolean`);
      }
    }
    const learning = results.learning;
    if (!isObject(learning)) out.push(`${file}: results.learning must be an object`);
    else {
      exactKeys(out, file, learning, ["explain","perform","debug","transfer","retain"], "learning");
      for (const key of ["explain","perform","debug","transfer","retain"])
        stringEnum(out, file, learning[key], `results.learning.${key}`, ["pass","fail","pending"]);
    }
  }

  const evidence = report.evidence;
  if (!isObject(evidence)) out.push(`${file}: evidence must be an object`);
  else {
    exactKeys(out, file, evidence, ["traces","failing_cases","reviewer"], "evidence");
    for (const key of ["traces","failing_cases"]) {
      if (!Array.isArray(evidence[key]) || evidence[key].some((v) => typeof v !== "string" || !v.trim()))
        out.push(`${file}: evidence.${key} must be an array of non-empty strings`);
    }
    stringEnum(out, file, evidence.reviewer, "evidence.reviewer", ["human","automated","mixed"]);
  }
  return out;
}

function readReport(file) {
  try { return { report: JSON.parse(fs.readFileSync(file, "utf8")) }; }
  catch (error) { return { error: `${file}: JSON read/parse failed: ${error.message}` }; }
}

function filesFromArgs(args) {
  if (args.length) return args.map((f) => path.resolve(process.cwd(), f));
  return [path.join(FIXTURES, "learning-agent-v1-example.json")];
}

function main(args) {
  if (args.length === 1 && args[0] === "--self-test") {
    const valid = path.join(FIXTURES, "learning-agent-v1-example.json");
    const invalid = path.join(FIXTURES, "learning-agent-v1-invalid.json");
    const validInput = readReport(valid);
    const invalidInput = readReport(invalid);
    const validErrors = validInput.error ? [validInput.error] : validateLearningAgentReport(validInput.report, valid);
    const invalidErrors = invalidInput.error ? [invalidInput.error] : validateLearningAgentReport(invalidInput.report, invalid);
    if (validErrors.length || invalidInput.error || !invalidErrors.length) {
      console.error("learning-agent-v1 self-test failed", { validErrors, invalidErrors });
      return 1;
    }
    console.log("learning-agent-v1 self-test passed");
  } else {
    const allErrors = [];
    for (const file of filesFromArgs(args)) {
      const input = readReport(file);
      if (input.error) allErrors.push(input.error);
      else allErrors.push(...validateLearningAgentReport(input.report, file));
    }
    if (allErrors.length) {
      for (const error of allErrors) console.error(error);
      return 1;
    }
    console.log(`learning-agent-v1 structure validation passed (${filesFromArgs(args).length} report(s)); metrics and source content not verified`);
  }
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}

