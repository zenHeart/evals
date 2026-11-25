#!/usr/bin/env node
// 证据自检：摘录逐字比对 + 「每个 cite 都有逐字证据」+ 来源原文存在性。
// 用法: node scripts/verify-quotes.mjs data/benchmarks/<id>.json
// 与 check-one.mjs 同一套归一化规则；额外报告长度 <30 的摘录和缺失的 <source id>.txt。
import fs from "node:fs";
import path from "node:path";
const file = path.resolve(process.argv[2]);
const repo = path.resolve(path.dirname(file), "../..");
const EV = process.env.EVIDENCE_DIR || path.join(repo, "data", "evidence");
const b = JSON.parse(fs.readFileSync(file, "utf8"));
const norm = s => String(s).normalize("NFKC").toLowerCase()
  .replace(/[‘’“”"`]/g, "")
  .replace(/[‐-―−]/g, "-")
  .replace(/-\s*\n\s*/g, "")
  .replace(/\s+/g, " ").trim();
const cites = new Set();
(function walk(x) {
  if (Array.isArray(x)) x.forEach(walk);
  else if (x && typeof x === "object") for (const [k, v] of Object.entries(x)) {
    if (k === "cite" && Array.isArray(v)) v.forEach(c => cites.add(c));
    else walk(v);
  }
})(b);
for (const v of Object.values(b.profile?.cites || {})) (v || []).forEach(c => cites.add(c));
const evf = path.join(EV, `${b.id}.evidence.json`);
const ev = JSON.parse(fs.readFileSync(evf, "utf8"));
const srcText = {};
const getSrc = id => {
  if (!(id in srcText)) {
    try { srcText[id] = norm(fs.readFileSync(path.join(EV, b.id, `${id}.txt`), "utf8")); }
    catch { srcText[id] = null; }
  }
  return srcText[id];
};
const errs = [];
const byCite = new Map();
for (const q of ev.quotes || []) {
  const sid = String(q.cite || "").split("@")[0];
  const t = getSrc(sid);
  if (t == null) { errs.push(`来源原文缺失: ${EV}/${b.id}/${sid}.txt`); continue; }
  const raw = String(q.quote || "");
  if (raw.length < 30) console.log(" ! 摘录偏短(<30 字符，建议加长): [" + q.cite + "]");
  if (raw.length > 300) console.log(" ! 摘录偏长(>300 字符，建议缩短): [" + q.cite + "]");
  const parts = norm(raw).split(/\s*(?:…|\.\.\.)\s*/).filter(p => p.length >= 8);
  if (parts.length && parts.every(p => t.includes(p))) byCite.set(q.cite, (byCite.get(q.cite) || 0) + 1);
  else errs.push(`摘录在原文中找不到: [${q.cite}] ${raw.slice(0, 100)}`);
}
for (const c of cites) if (!byCite.get(c)) errs.push(`cite 无逐字证据: ${c}`);
const usedSrc = new Set([...cites].map(c => c.split("@")[0]));
for (const s of b.profile?.sources || []) if (!usedSrc.has(s.id)) errs.push(`sources[${s.id}] 未被引用`);
console.log(JSON.stringify({ id: b.id, cites: cites.size, quotes: (ev.quotes || []).length, errors: errs.length }));
for (const m of errs) console.log(" - " + m);
process.exit(errs.length ? 1 : 0);
