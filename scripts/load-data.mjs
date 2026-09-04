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

/** 递归收集 model-releases 下的 release JSON（legacy/、official/<vendor>/ 等任意层级），保证按发布日期倒序排序 */
function collectReleases(dir = join(DATA, "model-releases")) {
  const out = [];
  function walk(d) {
    if (!existsSync(d)) return;
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith(".json")) out.push(readJson(p));
    }
  }
  walk(dir);
  return out.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || "") || (a.id || "").localeCompare(b.id || ""));
}

let cache = null;

/**
 * 新鲜度窗口（goal §12.7 / 站点口径）：只有窗口内的 dated 证据进入公开计数与主视图；
 * 窗口外与日期缺失的证据归入 archive（历史引用），不丢不删、降级展示。
 * 记录模式本身冻结不变——时间推进自动完成新旧分离，无需迁移。
 */
export const FRESH_WINDOW_YEARS = 3;
export function freshCutoff() {
  return new Date(Date.now() - FRESH_WINDOW_YEARS * 365 * 24 * 3600 * 1000).toISOString().slice(0, 10);
}

export function loadBenchData() {
  if (cache) return cache;
  const cutoff = freshCutoff();

  const taxonomy = readJson(join(DATA, "taxonomy.json"));
  let ALIAS = {};
  try {
    ALIAS = readJson(join(DATA, "generated", "benchmark-aliases.json")).aliases || {};
  } catch { /* 别名文件可选 */ }
  const canon = id => ALIAS[id] || id;
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
        _archived: 0,
      };
    });
  const byId = Object.fromEntries(benchmarks.map(b => [b.id, b]));

  // ---- release/evidence → benchmark 反向引用视图（含 verified/pending 派生）
  const releases = collectReleases();
  const unmatched = new Set();
  for (const r of releases) {
    for (const e of r.benchmark_evidence || []) {
      const benchId = canon(e.benchmark_id);
      const b = byId[benchId];
      if (!b) { unmatched.add(benchId); continue; }
      const verified = e.status === "verified";
      const score = e.reported_score || {};
      const vendorLabel = vendorNames[e.vendor_id] || r.release_title;
      const modelLabel = e.model_name || e.model_id || null;
      // model_name/model_id 与厂商名重复时（如 "智谱 GLM"）不重复拼接
      const label = modelLabel && !vendorLabel.includes(modelLabel)
        ? `${vendorLabel} · ${modelLabel}`
        : vendorLabel;
      // fresh = 日期可知且在窗口内；窗口外/日期缺失 → archive（历史引用，降级展示）
      const fresh = Boolean(r.release_date) && r.release_date >= cutoff;
      b.adoption.push({
        release: label,
        release_id: r.id ?? null,
        score: score.display ?? null,
        url: e.source_url ?? null,
        note: e.protocol?.harness ? `harness: ${e.protocol.harness}` : (e.model_variant || null),
        status: e.status ?? "pending",
        tier: e.source_tier ?? null,
        variant: e.benchmark_variant ?? null,
        date: r.release_date ?? null,
        fresh,
      });
      if (verified && fresh) b._verified++;
      else if (fresh) b._pending++;
      else b._archived++;
    }
  }

  // 保证每个 benchmark 的 adoption 记录无论数据源遍历顺序如何，一律按 release 日期严格倒序
  for (const b of benchmarks) {
    b.adoption.sort((a, b) => (b.date || "").localeCompare(a.date || "") || (a.release_id || "").localeCompare(b.release_id || ""));
  }

  // ---- release 时间轴视图（厂商 → 版本 → blog 证据结构）
  const vendorRegion = Object.fromEntries((vendors.vendors || vendors || []).map(v => [v.id, v.region ?? null]));
  const catNames = Object.fromEntries(taxonomy.categories.map(c => [c.id, c.name]));
  const releaseViews = collectReleases().map(r => {
    const evidence = (r.benchmark_evidence || []).map(e => ({
      benchmark_id: canon(e.benchmark_id),
      variant: e.benchmark_variant ?? null,
      display: e.reported_score?.display ?? null,
      value: typeof e.reported_score?.value === "number" ? e.reported_score.value : null,
      status: e.status ?? "pending",
      harness: e.protocol?.harness ?? null,
      effort: e.protocol?.reasoning_effort ?? null,
      temperature: e.protocol?.temperature ?? null,
      topP: e.protocol?.top_p ?? null,
      attribution: e.attribution_type ?? null,
      url: e.source_url ?? null,
    }));
    // 模型规格与能力概述：入库时写入 models[]（ingest-releases 技能负责）；
    // 构建期只做派生兜底画像（评测领域分布），保证存量发布也有可读概述。
    const catCount = new Map();
    for (const e of evidence) {
      const cid = byId[e.benchmark_id]?.category;
      if (cid) catCount.set(cid, (catCount.get(cid) || 0) + 1);
    }
    const profileCategories = [...catCount.entries()]
      .sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([cid, n]) => ({ id: cid, name: catNames[cid] || cid, count: n }));
    const modelSpecs = (r.models || []).map(m => ({
      name: m.name || m.id || null,
      params: m.params ?? null,
      context_window: m.context_window ?? null,
      pricing: m.pricing ?? null,
      modalities: m.modalities ?? null,
      capability_summary: m.capability_summary ?? null,
      key_traits: m.key_traits ?? [],
    }));
    return {
      id: r.id,
      vendor_id: r.vendor_id ?? null,
      vendor_label: vendorNames[r.vendor_id] || r.vendor_id || "未知厂商",
      region: vendorRegion[r.vendor_id] ?? null,
      release_title: r.release_title ?? r.id,
      release_date: r.release_date ?? null,
      models: (r.models || []).map(m => m.name || m.id).filter(Boolean),
      model_specs: modelSpecs,
      profile: { evidence_count: evidence.length, categories: profileCategories },
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
    cutoff,
    categories: taxonomy.categories || [],
    vendors: vendors.vendors || vendors || [],
    benchmarks,
    releases: releaseViews,
    _unmatchedEvidenceIds: [...unmatched],
  };
  return cache;
}
