/**
 * load-data.mjs — 构建期数据加载层（唯一数据消费入口）。
 *
 * 数据源（goal.md §11 实体结构）：
 *   data/benchmarks/<id>.json          benchmark 实体
 *   data/taxonomy.json                 类别本体
 *   data/vendors.json                  厂商注册表
 *   data/model-releases/（递归全部 JSON）  release 实体 + evidence edges（legacy 与 official）
 *
 * 输出兼容视图：build-web.mjs 与 build-benchmarks-hub.mjs 通过本模块取数，
 * 不再直接读任何单个数据文件；「已核验 / 待核验」计数在此统一派生（goal §12.2：
 * 公开计数只统计 verified evidence，pending 永远显式展示、不混入）。
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "data");

function readJson(p) {
  return JSON.parse(readFileSync(p, "utf-8"));
}

/** 递归收集 model-releases 下的 release JSON（legacy/、official/<vendor>/ 等任意层级） */
function collectReleases(dir = join(DATA, "model-releases"), out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) collectReleases(p, out);
    else if (name.endsWith(".json")) out.push(readJson(p));
  }
  return out;
}

let cache = null;

export function loadBenchData() {
  if (cache) return cache;

  const taxonomy = readJson(join(DATA, "taxonomy.json"));
  const vendors = existsSync(join(DATA, "vendors.json")) ? readJson(join(DATA, "vendors.json")) : [];
  const vendorNames = Object.fromEntries((vendors.vendors || vendors || []).map(v => [v.id, v.display_name || v.name]));

  // ---- benchmark 实体 → 兼容视图
  const dir = join(DATA, "benchmarks");
  const benchmarks = readdirSync(dir)
    .filter(f => f.endsWith(".json"))
    .map(f => {
      const b = readJson(join(dir, f));
      const sources = b.official_sources || [];
      return {
        id: b.id,
        name: b.name,
        category: (b.categories && b.categories[0]) || null,
        tests: b.summary ?? null,
        protocol: b.default_protocol?.raw ?? null,
        meaning: b.interpretation ?? null,
        adoptionNote: b.notes ?? null,
        status: b.status ?? null,
        contentStatus: b.content_status ?? null,
        lastVerifiedAt: b.last_verified_at ?? null,
        url: (sources.find(s => s.kind === "site") || sources[0] || {}).url ?? null,
        paper: (sources.find(s => s.kind === "paper") || {}).url ?? null,
        // evidence 视图在下方统一填充
        adoption: [],
        _verified: 0,
        _pending: 0,
      };
    });
  const byId = Object.fromEntries(benchmarks.map(b => [b.id, b]));

  // ---- release/evidence → benchmark 反向引用视图（含 verified/pending 派生）
  const releases = collectReleases();
  const unmatched = new Set();
  for (const r of releases) {
    for (const e of r.benchmark_evidence || []) {
      const b = byId[e.benchmark_id];
      if (!b) { unmatched.add(e.benchmark_id); continue; }
      const verified = e.status === "verified";
      const score = e.reported_score || {};
      const vendorLabel = vendorNames[e.vendor_id] || r.release_title;
      // model_name 与厂商名重复时（如 "智谱 GLM"）不重复拼接
      const label = e.model_name && !vendorLabel.includes(e.model_name)
        ? `${vendorLabel} · ${e.model_name}`
        : vendorLabel;
      b.adoption.push({
        release: label,
        score: score.display ?? null,
        url: e.source_url ?? null,
        note: e.protocol?.harness ? `harness: ${e.protocol.harness}` : (e.model_variant || null),
        status: e.status ?? "pending",
        tier: e.source_tier ?? null,
        variant: e.benchmark_variant ?? null,
        date: r.release_date ?? null,
      });
      if (verified) b._verified++;
      else b._pending++;
    }
  }

  // ---- release 时间轴视图（厂商 → 版本 → blog 证据结构）
  const releaseViews = collectReleases().map(r => {
    const evidence = (r.benchmark_evidence || []).map(e => ({
      benchmark_id: e.benchmark_id,
      variant: e.benchmark_variant ?? null,
      display: e.reported_score?.display ?? null,
      status: e.status ?? "pending",
      harness: e.protocol?.harness ?? null,
      effort: e.protocol?.reasoning_effort ?? null,
      temperature: e.protocol?.temperature ?? null,
      topP: e.protocol?.top_p ?? null,
      attribution: e.attribution_type ?? null,
      url: e.source_url ?? null,
    }));
    return {
      id: r.id,
      vendor_id: r.vendor_id ?? null,
      vendor_label: vendorNames[r.vendor_id] || r.vendor_id || "未知厂商",
      release_title: r.release_title ?? r.id,
      release_date: r.release_date ?? null,
      models: (r.models || []).map(m => m.name || m.id).filter(Boolean),
      source_url: (r.primary_sources || [])[0]?.url ?? null,
      source_kind: (r.primary_sources || [])[0]?.kind ?? null,
      status: r.status ?? "pending",
      notes: r.notes ?? null,
      evidence,
      verified: evidence.filter(e => e.status === "verified").length,
      pending: evidence.filter(e => e.status !== "verified").length,
    };
  }).sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));

  const updated = benchmarks
    .map(b => b.lastVerifiedAt)
    .filter(Boolean)
    .sort()
    .pop() || null;

  cache = {
    updated,
    categories: taxonomy.categories || [],
    vendors: vendors.vendors || vendors || [],
    benchmarks,
    releases: releaseViews,
    _unmatchedEvidenceIds: [...unmatched],
  };
  return cache;
}
