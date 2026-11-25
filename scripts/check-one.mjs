#!/usr/bin/env node
// 用法: node scripts/check-one.mjs data/benchmarks/<id>.json
//   EVIDENCE_DIR 默认为 <repo>/data/evidence；需要「逐字比对原始抓取文本」时，
//   另行准备含 <id>/<sid>.txt 的证据目录并用 EVIDENCE_DIR 指过去（见 docs/handoff）。
//   只提交引文账本（data/evidence/*.evidence.json）时，缺原文会逐条报「证据原文缺失」，
//   那不是内容缺陷，是外置语料未就位；此时应改用 scripts/verify-cite-coverage.mjs。
import fs from "node:fs"; import path from "node:path"; import { pathToFileURL } from "node:url";
const file = path.resolve(process.argv[2]);
const repo = path.resolve(path.dirname(file), "../..");
const EV = process.env.EVIDENCE_DIR || path.join(repo, "data", "evidence");
const { validateProfile } = await import(pathToFileURL(path.join(repo, "scripts/benchmark-profile.mjs")));
const b = JSON.parse(fs.readFileSync(file, "utf8"));
const errs = [];
if (b.profile?.template !== "benchmark-profile/v2") errs.push("profile.template 不是 benchmark-profile/v2");
else errs.push(...validateProfile(b.profile, file, b));
// 收集全部 cite
const cites = new Set();
(function walk(x){ if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === "object") for (const [k,v] of Object.entries(x)) { if (k === "cite" && Array.isArray(v)) v.forEach(c => cites.add(c)); else walk(v); } })(b);
for (const v of Object.values(b.profile?.cites || {})) (v||[]).forEach(c => cites.add(c));
const norm = s => String(s).normalize("NFKC").toLowerCase().replace(/[\u2018\u2019\u201c\u201d"'`]/g, "").replace(/[\u2010-\u2015\u2212]/g, "-").replace(/-\s*\n\s*/g, "").replace(/\s+/g, " ").trim();
const evf = path.join(EV, `${b.id}.evidence.json`);
let ev = null; try { ev = JSON.parse(fs.readFileSync(evf, "utf8")); } catch { errs.push(`缺少或无法解析证据文件 ${evf}`); }
const srcText = {}; const getSrc = id => { if (!(id in srcText)) { try { srcText[id] = norm(fs.readFileSync(path.join(EV, b.id, `${id}.txt`), "utf8")); } catch { srcText[id] = null; } } return srcText[id]; };
// 外置语料整目录缺失时，逐字比对无从做起；此时报「缺语料」而不是 60 行「证据原文缺失」，
// 避免被误读成内容类失败。语料到位但个别来源文件缺失仍按原样逐条报错。
if (!fs.existsSync(path.join(EV, b.id))) {
  console.log(JSON.stringify({ id: b.id, cites: cites.size, quotes_ok: 0, quotes_bad: 0, errors: 0, corpus: "absent" }));
  console.log(`外置语料未就位: ${path.join(EV, b.id)}/ 不存在，无法做逐字比对（不是内容缺陷）。`);
  console.log("  - 有语料时: EVIDENCE_DIR=<含 <id>/<sid>.txt 的证据根> node scripts/check-one.mjs <page.json>");
  console.log("  - 无语料时: node scripts/verify-cite-coverage.mjs   # 仅仓库内输入的结构核验");
  console.log("  - 重建语料: python3 scripts/v2-rollout/helpers/srcfetch.py <id> <sid> <url>");
  process.exit(2);
}
let ok = 0, bad = 0;
if (ev) {
  const quotes = ev.quotes || [];
  const byCite = new Map();
  for (const q of quotes) {
    const sid = String(q.cite || "").split("@")[0];
    const t = getSrc(sid);
    if (t == null) { errs.push(`证据原文缺失: ${EV}/${b.id}/${sid}.txt`); continue; }
    const nq = norm(q.quote || "");
    if (nq.length < 15) { errs.push(`摘录过短: ${q.cite}`); continue; }
    // 允许摘录中用 … / ... 省略：每段都必须在原文中逐字出现
    const parts = nq.split(/\s*(?:…|\.\.\.)\s*/).filter(p => p.length >= 8);
    if (parts.length && parts.every(p => t.includes(p))) { ok++; byCite.set(q.cite, true); }
    else { bad++; errs.push(`摘录在原文中找不到: [${q.cite}] ${String(q.quote).slice(0, 90)}`); }
  }
  for (const c of cites) if (!byCite.get(c)) errs.push(`cite 无逐字证据: ${c}`);
}
const uniq = [...new Set(errs)];
console.log(JSON.stringify({ id: b.id, cites: cites.size, quotes_ok: ok, quotes_bad: bad, errors: uniq.length }, null, 0));
for (const m of uniq.slice(0, 60)) console.log(" - " + m);
process.exit(uniq.length ? 1 : 0);
