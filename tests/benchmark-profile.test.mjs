import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateProfile, profileAnchors, PROFILE_SECTIONS, PROFILE_TEMPLATE, PROFILE_TEMPLATE_V2 } from "../scripts/benchmark-profile.mjs";
import { toolClass, ledgerTops, renderProfileV2 } from "../scripts/benchmark-profile-page.mjs";

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
  for (const b of profiled) assert.deepEqual(validateProfile(b.profile, b.id, b), [], b.id);
});

test("remote-labor-index flagship cites the paper and the official site", () => {
  const rli = entities.find(b => b.id === "remote-labor-index");
  const urls = rli.profile.sources.map(s => s.url);
  assert.ok(urls.includes("https://arxiv.org/abs/2510.26787"));
  assert.ok(urls.includes("https://www.remotelabor.ai/"));
});

// ---------------------------------------------------------------- benchmark-profile/v2（HLE 试点）
const hle = () => structuredClone(entities.find(b => b.id === "hlehle"));

test("HLE uses the v2 layout and its content shares come from the paper figure", () => {
  const b = hle();
  assert.equal(b.profile.template, PROFILE_TEMPLATE_V2);
  assert.deepEqual(validateProfile(b.profile, "hlehle", b), []);
  const shares = b.measures.map(m => parseInt(m.share, 10));
  assert.equal(shares.reduce((a, x) => a + x, 0), 100);
  for (const m of b.measures) assert.ok(m.cite.includes("paper@Figure 3"), m.area);
  const keys = profileAnchors(b.profile).map(([k]) => k);
  for (const k of ["glance", "content", "method", "reading", "trust", "background", "appendix", "versions", "official_results", "ledger", "adoption", "related", "refs"]) assert.ok(keys.includes(k), k);
});

test("v2 rejects uncited rows, bad severity, unused sources and missing entity", () => {
  const b = hle();
  delete b.measures[0].cite;
  b.limitations[0].severity = "极高";
  b.profile.sources.push({ id: "orphan", kind: "blog", title: "t", url: "https://example.org/o", accessed: "2026-11-10" });
  b.profile.ladder.push({ label: "x", value: "1%", cite: ["ghost"] });
  const errs = validateProfile(b.profile, "bad", b);
  assert.ok(errs.some(e => e.includes("measures[0]")));
  assert.ok(errs.some(e => e.includes("severity")));
  assert.ok(errs.some(e => e.includes("orphan")));
  assert.ok(errs.some(e => e.includes("ghost")));
  assert.ok(validateProfile(b.profile, "noent").some(e => e.includes("实体")));
});

test("ledger top score is split by tool protocol", () => {
  assert.equal(toolClass("no tools (starred)"), "no");
  assert.equal(toolClass("w/ Tools"), "with");
  assert.equal(toolClass("text-only with Search"), "with");
  assert.equal(toolClass("Full set"), "other");
  const t = ledgerTops([{ value: 60, variant: "no tools" }, { value: 70, variant: "with tools" }, { value: 65, variant: "no tools" }, { value: null, variant: "with tools" }]);
  assert.equal(t.no.value, 65);
  assert.equal(t.with.value, 70);
});

test("v2 header card has exactly 4 small cards (no duplicate status card) plus 2 full-width rows", () => {
  const b = hle();
  const html = renderProfileV2({}, b, { ledgerRows: [], comparabilityHTML: "", adoptionHTML: "", relatedHTML: "" });
  const card = html.slice(html.indexOf('<div class="pf2-card"'), html.indexOf("</nav>"));
  const keys = [...card.matchAll(/<div class="k">([^<]+)<\/div>/g)].map(m => m[1]);
  assert.ok(!keys.includes("状态"));
  assert.deepEqual(keys.slice(1, 5), ["发布方", "首次发布", "题量", "主要指标"]);
  assert.equal((card.match(/class="wide"/g) || []).length, 2);
});

test("official_results 表格里来源未披露的值渲染成「—」，不露出 null 字面量", () => {
  const b = hle();
  b.profile.official_results.table.rows = [["论文 Table 1", "GPT-4o", "2.7%", null, "全集"]];
  const html = renderProfileV2({}, b, { ledgerRows: [], comparabilityHTML: "", adoptionHTML: "", relatedHTML: "" });
  const tbl = html.slice(html.indexOf("official_results"), html.indexOf("official_results") + 4000);
  assert.ok(tbl.includes("—"), "缺失值应渲染成「—」");
  assert.ok(!tbl.includes(">null<"), "表格单元格不应出现 null 字面量");
});
