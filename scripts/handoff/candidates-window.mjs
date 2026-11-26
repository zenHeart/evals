#!/usr/bin/env node
/**
 * candidates-window.mjs — 导出某个扫描日发现的候选清单（交接用，可复现）。
 *
 * 输入全部在仓库内：`data/model-coverage.json` 的 `candidates` 数组 +
 * `data/model-releases/official/` 的落账实体。输出 TSV，供交接双方逐项复核
 * 「这批候选各自走到了哪一步」。
 *
 * 用法（在仓库根运行）:
 *   node scripts/handoff/candidates-window.mjs                 # 默认 2026-11-24
 *   node scripts/handoff/candidates-window.mjs 2026-11-24      # 指定扫描日
 *   node scripts/handoff/candidates-window.mjs 2026-11-24 -o path.tsv
 *
 * 退出码：0 = 写出成功；1 = 该日没有候选或输入文件缺失。
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const day = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) || "2026-11-24";
const outIdx = args.indexOf("-o");
const outPath = outIdx >= 0 ? args[outIdx + 1] : null;

const cov = JSON.parse(fs.readFileSync(path.join(ROOT, "data/model-coverage.json"), "utf8"));
const candidates = cov.candidates || [];
const picked = candidates.filter((c) => String(c.discovered_at || "").startsWith(day));

if (!picked.length) {
  console.error(`data/model-coverage.json 里没有 discovered_at 为 ${day} 的候选（共 ${candidates.length} 条）`);
  process.exit(1);
}

// 落账实体：official/<vendor>/<release_id>.json 视为已归档正文；legacy/ 是旧格式迁移残留。
function archivedReleaseIds(root) {
  const base = path.join(root, "data/model-releases/official");
  const out = new Set();
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(dir, e.name));
      else if (e.name.endsWith(".json")) out.add(e.name.slice(0, -5));
    }
  };
  if (fs.existsSync(base)) walk(base);
  return out;
}
const archivedIds = archivedReleaseIds(ROOT);

const esc = (v) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[\t\n"]/.test(s) ? JSON.stringify(s) : s;
};

const header = [
  "candidate_id", "vendor_id", "family", "release_id", "classification",
  "discovery_status", "archive_status", "evidence_status",
  "official_source_verified", "exclusion_reason", "discovered_at",
  "official_urls", "official_json_present",
];

const rows = picked
  .slice()
  .sort((a, b) => String(a.id).localeCompare(String(b.id)))
  .map((c) => {
    const rid = c.release_id || "";
    return [
      c.id, c.vendor_id, c.family || "", rid, c.classification,
      c.discovery_status, c.archive_status, c.evidence_status,
      c.official_source_verified ? "yes" : "no", c.exclusion_reason || "",
      c.discovered_at || "",
      (c.official_urls || []).join(" "),
      rid && archivedIds.has(rid) ? "yes" : (rid ? "NO" : "-"),
    ].map(esc).join("\t");
  });

const body = [header.join("\t"), ...rows].join("\n") + "\n";
if (outPath) fs.writeFileSync(outPath, body);
else process.stdout.write(body);

const by = (k) => picked.reduce((m, c) => m.set(c[k], (m.get(c[k]) || 0) + 1), new Map());

// 交接状态分桶（MECE，互斥且穷尽，用于「已完成 / 未验收 / 失败 / 未开始」口径）：
//   已完成  — 已产生 release 实体、官方 JSON 在仓、证据已抽取
//   未验收  — 已产生 release 实体，但证据未抽全（not_extracted / not_reported）
//   不建档  — 判定非独立模型发布、不产生 release（discovery_status=excluded）
//   待裁    — 无 release 却仍是 discovered，即状态与 exclusion_reason 互相矛盾，需人工定夺
//   失败    — 以上都套不进的形态；非 0 说明出现了新情况，必须人工逐条看，不要猜
const buckets = { 已完成: 0, 未验收: 0, 不建档: 0, 待裁: 0, 失败: 0 };
const bucketOf = (c) => {
  const rid = c.release_id || "";
  if (!rid) return c.discovery_status === "excluded" ? "不建档" : (c.discovery_status === "discovered" ? "待裁" : "失败");
  const jsonOk = archivedIds.has(rid);
  if (!jsonOk) return "失败";
  return c.evidence_status === "reported" ? "已完成" : "未验收";
};
const bucketMembers = {};
for (const c of picked) {
  const b = bucketOf(c);
  buckets[b]++;
  (bucketMembers[b] = bucketMembers[b] || []).push(c.id);
}
const missingJson = picked.filter((c) => (c.release_id || "") && !archivedIds.has(c.release_id)).map((c) => c.id);
const reasonWithoutExcluded = picked
  .filter((c) => c.discovery_status === "discovered" && c.exclusion_reason)
  .map((c) => c.id);
const excludedWithoutReason = picked
  .filter((c) => c.discovery_status === "excluded" && !c.exclusion_reason)
  .map((c) => c.id);

console.error(
  `扫描日 ${day}: ${picked.length} 个候选；` +
  `分类 ${JSON.stringify(Object.fromEntries(by("classification")))}；` +
  `discovery ${JSON.stringify(Object.fromEntries(by("discovery_status")))}；` +
  `archive ${JSON.stringify(Object.fromEntries(by("archive_status")))}；` +
  `evidence ${JSON.stringify(Object.fromEntries(by("evidence_status")))}`
);
console.error(`交接状态分桶: ${JSON.stringify(buckets)}`);
if (buckets.失败) console.error(`  [失败] ${bucketMembers.失败.join(", ")}`);
if (bucketMembers.待裁) console.error(`  [待裁] ${bucketMembers.待裁.join(", ")}`);
if (missingJson.length) console.error(`  [缺实体] release_id 有值但 official/ 下无 JSON: ${missingJson.join(", ")}`);
if (reasonWithoutExcluded.length) console.error(`  [账面不一致] discovered 却带 exclusion_reason: ${reasonWithoutExcluded.join(", ")}`);
if (excludedWithoutReason.length) console.error(`  [账面不一致] excluded 却无 exclusion_reason: ${excludedWithoutReason.join(", ")}`);
