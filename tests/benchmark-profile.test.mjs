import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateProfile, PROFILE_SECTIONS, PROFILE_TEMPLATE } from "../scripts/benchmark-profile.mjs";

const dir = new URL("../data/benchmarks/", import.meta.url);
const entities = fs.readdirSync(dir).filter(f => f.endsWith(".json")).map(f => JSON.parse(fs.readFileSync(new URL(f, dir), "utf8")));

const minimal = () => ({
  template: PROFILE_TEMPLATE, verified_at: "2026-11-10",
  sources: [{ id: "paper", kind: "paper", title: "t", url: "https://example.org/p", accessed: "2026-11-10" }],
  sections: Object.fromEntries(PROFILE_SECTIONS.filter(s => s.required).map(s => [s.key, { text: "x", cite: ["paper@§1"] }])),
});

test("minimal fully cited profile passes", () => {
  assert.deepEqual(validateProfile(minimal(), "m"), []);
});

test("uncited facts, unknown sources and empty missing reasons are rejected", () => {
  const p = minimal();
  p.sections.origin = { facts: [{ k: "机构", v: "某机构" }] };
  p.sections.scoring = { items: [{ text: "x", cite: ["ghost"] }] };
  p.sections.versions = { missing: "" };
  const errs = validateProfile(p, "bad");
  assert.ok(errs.some(e => e.includes("origin.facts[0]")));
  assert.ok(errs.some(e => e.includes("ghost")));
  assert.ok(errs.some(e => e.includes("versions.missing")));
});

test("required sections cannot be silently dropped", () => {
  const p = minimal();
  delete p.sections.limitations;
  assert.ok(validateProfile(p, "x").some(e => e.includes("limitations")));
});

test("every profiled benchmark entity passes the template gate", () => {
  const profiled = entities.filter(b => b.profile !== undefined);
  assert.ok(profiled.length >= 1);
  for (const b of profiled) assert.deepEqual(validateProfile(b.profile, b.id), [], b.id);
});

test("remote-labor-index flagship cites the paper and the official site", () => {
  const rli = entities.find(b => b.id === "remote-labor-index");
  const urls = rli.profile.sources.map(s => s.url);
  assert.ok(urls.includes("https://arxiv.org/abs/2510.26787"));
  assert.ok(urls.includes("https://www.remotelabor.ai/"));
});
