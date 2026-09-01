#!/usr/bin/env node
/**
 * validate-data.mjs — 数据层校验器（纯 Node，零新依赖，不用 Ajv）。
 *
 * 校验范围（migrate-data.mjs 的产物）：
 *   data/taxonomy.json
 *   data/vendors.json
 *   data/benchmarks/*.json
 *   data/model-releases/legacy/*.json   （含内嵌 evidence edge）
 *   data/generated/migration-report.json（报告数字与磁盘对账）
 *
 * 检查项：JSON 可解析、必填字段、id kebab-case 且唯一、外键存在
 * （evidence.benchmark_id ∈ benchmarks、vendor_id ∈ vendors、release_id ∈ model-releases）、
 * 枚举合法（status/source_tier/attribution_type/score_status 等）、
 * 无 "score":"-"、无 null 冒充必填。
 *
 * 内置 fixture 自测：一好一坏两个内联样例，坏样例必须被判失败。
 * 退出码 0 = 全部通过；1 = 存在错误。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "data");

// ---------------------------------------------------------------------------
// 枚举（与 goal.md §11/§12 一致）
// ---------------------------------------------------------------------------
const ENUMS = {
  benchmark_status: ["active", "rolling", "near-saturation", "historical", "superseded", "deprecated"],
  content_status: ["draft", "beta", "reviewed", "verified", "stale", "deprecated"],
  region: ["CN", "GLOBAL"],
  coverage_tier: [1, 2],
  release_status: ["draft", "pending", "verified", "inaccessible", "out-of-scope"],
  evidence_status: ["draft", "pending", "verified", "inaccessible", "out-of-scope"],
  source_tier: ["A", "B", "C", "D"],
  attribution_type: [
    "vendor_reported",
    "benchmark_owner_reported",
    "third_party_reported",
    "site_reproduced",
    "comparison_cited",
  ],
  score_status: ["reported", "not_extracted", "not_reported"],
};

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// evidence edge id 采用 goal.md §11.5 的 `--` 分隔约定（如 anthropic-claude-3-5-sonnet--mmlu）
const EDGE_ID = /^[a-z0-9]+(-[a-z0-9]+)*(--[a-z0-9]+(-[a-z0-9]+)*)+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const errors = [];
const err = (file, msg) => errors.push(`${path.relative(ROOT, file)}: ${msg}`);

const readJson = (file) => {
  try {
    return { ok: true, data: JSON.parse(fs.readFileSync(file, "utf8")) };
  } catch (e) {
    err(file, `JSON 解析失败：${e.message}`);
    return { ok: false };
  }
};

const jsonFiles = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => path.join(dir, f))
    : [];

// 值不得为 "-"（缺失一律用 null 或显式状态）；字符串值本身不递归
const forbidDash = (file, obj, prefix = "") => {
  if (!obj || typeof obj !== "object") return;
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v === "-") err(file, `${p} 使用 "-" 表示缺失，应改用 null`);
    else if (Array.isArray(v)) v.forEach((x, i) => forbidDash(file, x, `${p}[${i}]`));
    else if (v && typeof v === "object") forbidDash(file, v, p);
  }
};

// ---------------------------------------------------------------------------
// 单实体校验函数（同时用于真实数据与 fixture 自测）
// ---------------------------------------------------------------------------
export function validateBenchmark(b, ctx) {
  const out = [];
  const file = `benchmarks/${b.id ?? "(no-id)"}.json`;
  if (!b.id || !KEBAB.test(b.id)) out.push(`${file}: id 缺失或非 kebab-case`);
  if (typeof b.name !== "string" || !b.name.trim()) out.push(`${file}: name 必填`);
  if (b.full_name === undefined) out.push(`${file}: full_name 字段缺失（可为 null）`);
  if (!Array.isArray(b.aliases)) out.push(`${file}: aliases 必须为数组`);
  if (!(b.status === null || ENUMS.benchmark_status.includes(b.status)))
    out.push(`${file}: status 非法（${JSON.stringify(b.status)}）`);
  if (!Array.isArray(b.categories) || b.categories.length === 0)
    out.push(`${file}: categories 必须为非空数组`);
  else
    for (const c of b.categories)
      if (!ctx.categoryIds.has(c)) out.push(`${file}: 类别外键不存在：${c}`);
  if (typeof b.summary !== "string" || !b.summary.trim())
    out.push(`${file}: summary 必填（tests 迁移产物）`);
  if (!Array.isArray(b.measures) || !Array.isArray(b.does_not_measure))
    out.push(`${file}: measures / does_not_measure 必须为数组`);
  if (b.dataset === null || typeof b.dataset !== "object" || Array.isArray(b.dataset))
    out.push(`${file}: dataset 必须为对象`);
  if (!Array.isArray(b.metrics)) out.push(`${file}: metrics 必须为数组`);
  if (!Array.isArray(b.versions)) out.push(`${file}: versions 必须为数组`);
  if (!Array.isArray(b.limitations)) out.push(`${file}: limitations 必须为数组`);
  if (!Array.isArray(b.official_sources)) out.push(`${file}: official_sources 必须为数组`);
  for (const s of b.official_sources ?? []) {
    if (!s || typeof s.url !== "string" || !s.url.startsWith("https://"))
      out.push(`${file}: official_sources.url 必须为 HTTPS`);
  }
  if (!Array.isArray(b.related_benchmarks)) out.push(`${file}: related_benchmarks 必须为数组`);
  for (const r of b.related_benchmarks ?? [])
    if (!ctx.benchmarkIds.has(r)) out.push(`${file}: related_benchmark 外键不存在：${r}`);
  if (!ENUMS.content_status.includes(b.content_status))
    out.push(`${file}: content_status 非法（${JSON.stringify(b.content_status)}）`);
  if (!ISO_DATE.test(b.last_verified_at ?? "")) out.push(`${file}: last_verified_at 必须为 YYYY-MM-DD`);
  if (b.default_protocol && (typeof b.default_protocol !== "object" || Array.isArray(b.default_protocol)
    || typeof b.default_protocol.raw !== "string"))
    out.push(`${file}: default_protocol 必须为 {raw: string} 或 null`);
  return out;
}

export function validateVendor(v) {
  const out = [];
  const file = `vendors.json#${v.id ?? "(no-id)"}`;
  if (!v.id || !KEBAB.test(v.id)) out.push(`${file}: id 缺失或非 kebab-case`);
  if (typeof v.name !== "string" || !v.name.trim()) out.push(`${file}: name 必填`);
  if (typeof v.display_name !== "string" || !v.display_name.trim()) out.push(`${file}: display_name 必填`);
  if (!ENUMS.region.includes(v.region)) out.push(`${file}: region 非法（${JSON.stringify(v.region)}）`);
  if (!ENUMS.coverage_tier.includes(v.coverage_tier)) out.push(`${file}: coverage_tier 非法（须为 1|2）`);
  if (typeof v.active !== "boolean") out.push(`${file}: active 必须为 boolean`);
  return out;
}

export function validateReleaseEdge(e, ctx) {
  const out = [];
  const tag = e.id ?? "(no-id)";
  if (!e.id || !EDGE_ID.test(e.id)) out.push(`${tag}: edge id 缺失或不符合 -- 分隔约定（如 vendor-release--benchmark）`);
  if (typeof e.benchmark_id !== "string" || (!ctx.benchmarkIds.has(e.benchmark_id) && !ctx.candidateBenchmarkIds.has(e.benchmark_id)))
    out.push(`${tag}: benchmark_id 外键不存在：${JSON.stringify(e.benchmark_id)}`);
  if (typeof e.vendor_id !== "string" || !ctx.vendorIds.has(e.vendor_id))
    out.push(`${tag}: vendor_id 外键不存在：${JSON.stringify(e.vendor_id)}`);
  if (typeof e.release_id !== "string" || !ctx.releaseIds.has(e.release_id))
    out.push(`${tag}: release_id 外键不存在：${JSON.stringify(e.release_id)}`);
  if (e.source_url === null) {
    // 无来源即无等级：source_tier / attribution_type 必须为 null（unknown 不编造）
    if (e.source_tier !== null || e.attribution_type !== null)
      out.push(`${tag}: 无 source_url 时 source_tier / attribution_type 必须为 null`);
  } else {
    if (!ENUMS.source_tier.includes(e.source_tier))
      out.push(`${tag}: source_tier 非法（${JSON.stringify(e.source_tier)}）`);
    if (!ENUMS.attribution_type.includes(e.attribution_type))
      out.push(`${tag}: attribution_type 非法（${JSON.stringify(e.attribution_type)}）`);
  }
  const rs = e.reported_score;
  if (!rs || typeof rs !== "object") {
    out.push(`${tag}: reported_score 必填`);
  } else {
    if (!ENUMS.score_status.includes(rs.score_status))
      out.push(`${tag}: score_status 非法（${JSON.stringify(rs.score_status)}）`);
    if (rs.display === "-" || rs.value === "-")
      out.push(`${tag}: score 使用 "-"，必须改用 null + score_status`);
    if (rs.value !== null && typeof rs.value !== "number")
      out.push(`${tag}: reported_score.value 必须为数字或 null（${JSON.stringify(rs.value)}）`);
    if (rs.score_status === "reported" && typeof rs.value !== "number")
      out.push(`${tag}: score_status=reported 时 value 必须为数字`);
    if (rs.score_status === "not_extracted" && rs.value !== null)
      out.push(`${tag}: score_status=not_extracted 时 value 必须为 null`);
  }
  if (!ENUMS.evidence_status.includes(e.status))
    out.push(`${tag}: status 非法（${JSON.stringify(e.status)}）`);
  if (!ISO_DATE.test(e.retrieved_at ?? "")) out.push(`${tag}: retrieved_at 必须为 YYYY-MM-DD`);
  if (!ISO_DATE.test(e.last_verified_at ?? "")) out.push(`${tag}: last_verified_at 必须为 YYYY-MM-DD`);
  if (e.source_url !== null && !(typeof e.source_url === "string" && e.source_url.startsWith("https://")))
    out.push(`${tag}: source_url 必须为 HTTPS 或 null`);
  return out;
}

export function validateRelease(r, ctx) {
  const out = [];
  const file = r.__file ? `model-releases/${r.__file}` : `model-releases/legacy/${r.id ?? "(no-id)"}.json`;
  if (!r.id || !KEBAB.test(r.id)) out.push(`${file}: id 缺失或非 kebab-case`);
  if (typeof r.vendor_id !== "string" || !ctx.vendorIds.has(r.vendor_id))
    out.push(`${file}: vendor_id 外键不存在：${JSON.stringify(r.vendor_id)}`);
  if (typeof r.release_title !== "string" || !r.release_title.trim())
    out.push(`${file}: release_title 必填`);
  if (!(r.release_date === null || ISO_DATE.test(r.release_date) || /^\d{4}-\d{2}$/.test(r.release_date)))
    out.push(`${file}: release_date 必须为 YYYY-MM-DD / YYYY-MM 或 null`);
  if (!Array.isArray(r.models)) out.push(`${file}: models 必须为数组`);
  if (!Array.isArray(r.primary_sources)) out.push(`${file}: primary_sources 必须为数组`);
  for (const s of r.primary_sources ?? [])
    if (!s || typeof s.url !== "string" || !s.url.startsWith("https://"))
      out.push(`${file}: primary_sources.url 必须为 HTTPS`);
  if (!Array.isArray(r.benchmark_evidence)) out.push(`${file}: benchmark_evidence 必须为数组`);
  for (const e of r.benchmark_evidence ?? []) {
    if (e.release_id !== undefined && e.release_id !== r.id)
      out.push(`${file}: edge ${e.id} 的 release_id 与所属 release 不一致`);
    out.push(...validateReleaseEdge(e, ctx).map((m) => `${file} → ${m}`));
  }
  if (!ENUMS.release_status.includes(r.status))
    out.push(`${file}: status 非法（${JSON.stringify(r.status)}）`);
  if (!ISO_DATE.test(r.last_verified_at ?? "")) out.push(`${file}: last_verified_at 必须为 YYYY-MM-DD`);
  // 勘误留痕（goal §18.3：修订/撤回必须保留历史，不静默覆盖）
  for (const [i, rev] of (r.revisions ?? []).entries()) {
    if (!rev || !ISO_DATE.test(rev.date ?? "")) out.push(`${file}: revisions[${i}].date 必须为 YYYY-MM-DD`);
    if (!rev.reason || typeof rev.reason !== "string") out.push(`${file}: revisions[${i}].reason 必填（勘误原因）`);
    if (!rev.field) out.push(`${file}: revisions[${i}].field 必填（被修订的字段名）`);
  }
  return out;
}

// ---------------------------------------------------------------------------
// 装载真实数据
// ---------------------------------------------------------------------------
const ctx = { categoryIds: new Set(), benchmarkIds: new Set(), vendorIds: new Set(), releaseIds: new Set() };

const taxFile = path.join(DATA, "taxonomy.json");
const tax = readJson(taxFile);
if (tax.ok) {
  const t = tax.data;
  if (!Array.isArray(t.categories) || t.categories.length === 0) err(taxFile, "categories 必须为非空数组");
  for (const c of t.categories ?? []) {
    if (!c.id || !KEBAB.test(c.id)) err(taxFile, `category id 非法：${JSON.stringify(c.id)}`);
    else ctx.categoryIds.add(c.id);
    if (typeof c.name !== "string" || !c.name.trim()) err(taxFile, `category ${c.id} name 必填`);
  }
  for (const key of ["modalities", "metric_types"]) {
    const e = t[key];
    if (!e || !Array.isArray(e.values) || e.values.length === 0 || e.draft !== true)
      err(taxFile, `${key} 必须为 { draft: true, values: [...] }`);
  }
}

const venFile = path.join(DATA, "vendors.json");
const ven = readJson(venFile);
if (ven.ok) {
  const seen = new Set();
  for (const v of ven.data.vendors ?? []) {
    for (const m of validateVendor(v)) err(venFile, m);
    if (v.id) {
      if (seen.has(v.id)) err(venFile, `vendor id 重复：${v.id}`);
      seen.add(v.id);
      ctx.vendorIds.add(v.id);
    }
  }
}

const benchDir = path.join(DATA, "benchmarks");
const benchFiles = jsonFiles(benchDir);
if (benchFiles.length === 0) err(benchDir, "benchmarks/ 目录为空，请先运行 node scripts/migrate-data.mjs");
// 第一遍：装载与 id 收集（外键校验需全集就绪后再做）
const benchData = new Map();
for (const file of benchFiles) {
  const r = readJson(file);
  if (!r.ok) continue;
  const b = r.data;
  benchData.set(file, b);
  const base = path.basename(file, ".json");
  if (b.id !== base) err(file, `文件名 ${base}.json 与 id ${b.id} 不一致`);
  if (b.id) {
    if (ctx.benchmarkIds.has(b.id)) err(file, `benchmark id 重复：${b.id}`);
    ctx.benchmarkIds.add(b.id);
  }
}
// 第二遍：完整校验
for (const [file, b] of benchData) {
  for (const m of validateBenchmark(b, ctx)) err(file, m);
  forbidDash(file, b);
}

const releasesRoot = path.join(DATA, "model-releases");
// 递归收集 legacy/ 与 official/<vendor>/ 等所有层级（official 是一等公民，必须同样过门禁）
const relFiles = (function walkReleases(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkReleases(p, acc);
    else if (name.endsWith(".json")) acc.push(p);
  }
  return acc;
})(releasesRoot);
const edgeIds = new Set();
const relData = new Map();
let officialCount = 0;
for (const file of relFiles) {
  const r = readJson(file);
  if (!r.ok) continue;
  const rel = r.data;
  relData.set(file, rel);
  const base = path.basename(file, ".json");
  if (rel.id !== base) err(file, `文件名 ${base}.json 与 id ${rel.id} 不一致`);
  if (rel.id) {
    if (ctx.releaseIds.has(rel.id)) err(file, `release id 重复：${rel.id}`);
    ctx.releaseIds.add(rel.id);
  }
  if (file.includes(`${path.sep}official${path.sep}`)) officialCount++;
  for (const e of rel.benchmark_evidence ?? []) {
    if (e.id) {
      if (edgeIds.has(e.id)) err(file, `evidence edge id 重复：${e.id}`);
      edgeIds.add(e.id);
    }
  }
}
// 未知 benchmark_id 候选集：官方证据先行（evidence-first），同一 id 在任一边标注过 new-benchmark 即登记
const candidateBenchmarkIds = new Set();
for (const [file, rel] of relData) {
  const isOfficial = file.includes(`${path.sep}official${path.sep}`);
  if (!isOfficial) continue;
  for (const e of rel.benchmark_evidence ?? []) {
    const bid = e.benchmark_id;
    if (bid && !ctx.benchmarkIds.has(bid) && (e.notes ?? "").includes("new-benchmark")) {
      candidateBenchmarkIds.add(bid);
    }
  }
}
ctx.candidateBenchmarkIds = candidateBenchmarkIds;

// 全部 release id 就绪后再做完整校验（含 edge 外键）
for (const [file, rel] of relData) {
  const isOfficial = file.includes(`${path.sep}official${path.sep}`);
  if (!isOfficial) {
    for (const e of rel.benchmark_evidence ?? []) {
      if (e.benchmark_id && !ctx.benchmarkIds.has(e.benchmark_id) && !candidateBenchmarkIds.has(e.benchmark_id))
        err(file, `legacy edge 引用了未知且未登记的 benchmark_id：${JSON.stringify(e.benchmark_id)}`);
    }
  }
  rel.__file = path.relative(path.join(DATA, "model-releases"), file);
  for (const m of validateRelease(rel, ctx)) err(file, m);
  forbidDash(file, rel);
}

// 迁移报告与磁盘对账
const repFile = path.join(DATA, "generated", "migration-report.json");
const rep = readJson(repFile);
if (rep.ok) {
  const r = rep.data;
  const diskBench = benchFiles.length;
  const legacyFiles = relFiles.filter((f) => f.includes(`${path.sep}legacy${path.sep}`));
  const diskRel = legacyFiles.length;
  const diskEdges = new Set();
  for (const f of legacyFiles) {
    const rr = readJson(f);
    if (rr.ok) for (const e of rr.data.benchmark_evidence ?? []) if (e.id) diskEdges.add(e.id);
  }
  // 对账语义：迁移基线 65 个实体是下限——实体只允许增长（研究建档），不允许减少
  if (!r.benchmarks || r.benchmarks.before !== r.benchmarks.after)
    err(repFile, 'benchmark 迁移前后不一致（报告内部）');
  if ((r.benchmarks?.after ?? 0) > diskBench)
    err(repFile, `实体数低于迁移基线（报告 ${r.benchmarks?.after} > 磁盘 ${diskBench}）——实体不得丢失`);
  // 对账语义：迁移报告是 v1→v2 时刻快照；此后 legacy 只允许因数据卫生（双计去重）减少，不允许增加
  if ((r.releases?.total ?? 0) < diskRel)
    err(repFile, `legacy release 数超出迁移基线（报告 ${r.releases?.total} < 磁盘 ${diskRel}）——不得向 legacy 追加`);
  if ((r.evidence_edges?.total ?? 0) < diskEdges.size)
    err(repFile, `legacy edge 数超出迁移基线（报告 ${r.evidence_edges?.total} < 磁盘 ${diskEdges.size}）——不得向 legacy 追加`);
  const a = r.adoption_entries;
  if (!a || a.mapped_to_evidence + a.rejected !== a.total)
    err(repFile, "adoption_entries 对账失败：mapped + rejected ≠ total");
  if (a && a.mapped_to_evidence < diskEdges.size)
    err(repFile, `legacy edge 超出迁移映射基线（${a.mapped_to_evidence} < ${diskEdges.size}）`);
  if (!Array.isArray(r.rejected) || a.rejected !== r.rejected.length)
    err(repFile, "rejected 清单与计数不一致");
}

// ---------------------------------------------------------------------------
// fixture 自测：一好一坏，坏样例必须失败
// ---------------------------------------------------------------------------
const testCtx = {
  candidateBenchmarkIds: new Set(),
  categoryIds: new Set(["coding"]),
  benchmarkIds: new Set(["fixture-bench"]),
  vendorIds: new Set(["fixture-vendor"]),
  releaseIds: new Set(["fixture-release"]),
};

const goodRelease = {
  id: "fixture-release",
  vendor_id: "fixture-vendor",
  release_title: "Fixture Model 1.0",
  release_date: null,
  models: [{ id: null, name: "Fixture Model 1.0", variant: null }],
  primary_sources: [{ url: "https://example.com/release", kind: "official_release_blog", language: null }],
  benchmark_evidence: [
    {
      id: "fixture-vendor-fixture-release--fixture-bench",
      benchmark_id: "fixture-bench",
      benchmark_variant: null,
      vendor_id: "fixture-vendor",
      release_id: "fixture-release",
      model_id: null,
      model_name: "Fixture Model 1.0",
      model_variant: null,
      source_url: "https://example.com/release",
      source_kind: "official_release_blog",
      source_tier: "A",
      attribution_type: "vendor_reported",
      evidence_type: null,
      locator: { heading: null, table: null, row: null, figure: null, page: null, quote_snippet: null },
      reported_score: { value: 42.5, display: "42.5", unit: "percent", metric: null, score_status: "reported" },
      protocol: null,
      comparison_scope: "unknown",
      retrieved_at: "2026-08-28",
      last_verified_at: "2026-08-28",
      status: "pending",
      archive_url: null,
      notes: "",
    },
  ],
  retrieved_at: "2026-08-28",
  last_verified_at: "2026-08-28",
  status: "pending",
};

const badRelease = {
  ...goodRelease,
  id: "Bad_Id", // 非 kebab-case
  vendor_id: "no-such-vendor", // 外键不存在
  status: "maybe", // 非法枚举
  benchmark_evidence: [
    {
      ...goodRelease.benchmark_evidence[0],
      benchmark_id: "ghost-bench", // 外键不存在
      source_tier: "X", // 非法枚举
      attribution_type: "self_claimed", // 非法枚举
      reported_score: { value: "-", display: "-", unit: null, metric: null, score_status: "not_extracted" }, // "-" 代替缺失
    },
  ],
};

const goodErrors = validateRelease(goodRelease, testCtx);
const badErrors = validateRelease(badRelease, testCtx);
if (goodErrors.length > 0)
  errors.push(`fixture 自测失败：有效样例被误判（${goodErrors.join("; ")}）`);
if (badErrors.length === 0)
  errors.push("fixture 自测失败：无效样例未被检出");
else
  console.log(`[fixture] 有效样例通过；无效样例按预期被拒（${badErrors.length} 项错误）`);

// ---------------------------------------------------------------------------
// 输出
// ---------------------------------------------------------------------------
if (errors.length > 0) {
  console.error(`[validate-data] FAILED — ${errors.length} 项错误：`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`[validate-data] PASS — taxonomy 9 类 / vendors ${ctx.vendorIds.size} / benchmarks ${ctx.benchmarkIds.size} / releases ${ctx.releaseIds.size}（official ${officialCount}）/ evidence edges ${edgeIds.size}`);
