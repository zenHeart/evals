#!/usr/bin/env node
/**
 * audit-ledger-sources.mjs — 审核「页面声明的来源」与「证据账本实际引用的来源」是否一致。
 *
 * 背景：`scripts/verify-cite-coverage.mjs` 只校验单向——「声明了却没被引用的来源」
 * （uncited v2 profile.sources）。反向（页面引用了某个 source id，但 profile.sources
 * 里没有这个 id）不在任何门禁里，`check-one.mjs` 也不看：只要 data/evidence/<id>/<sid>.txt
 * 存在，逐字比对就能过。于是会出现「页面挂了一个读者查不到出处的引用」而全链门禁全绿。
 *
 * 本脚本把这种偏差分成两类，均可只在仓库内复现（无网络、无外置语料）：
 *
 *   缺口 A  页面引用了 <sid>，但 profile.sources 未声明该 <sid>
 *           → 读者在页面上看不到该引用的出处，是可追溯性缺口。
 *   差异 B2 账本里有 <sid> 的摘录，但页面既未声明也未引用
 *           → 账本比页面旧/宽，属于账本冗余，不影响页面可追溯性。
 *
 * 用法（在仓库根运行）：
 *   node scripts/handoff/audit-ledger-sources.mjs                 # 只打汇总
 *   node scripts/handoff/audit-ledger-sources.mjs -o out.tsv      # 额外写每页明细
 *   node scripts/handoff/audit-ledger-sources.mjs --fail-on A     # 有缺口 A 则 exit 1
 *
 * 退出码：0 = 跑完（默认 informational）；1 = --fail-on A 且有缺口 A，或输入缺失。
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const outIdx = args.indexOf("-o");
const outPath = outIdx >= 0 ? args[outIdx + 1] : null;
const failOn = args.includes("--fail-on") ? args[args.indexOf("--fail-on") + 1] : null;

const BENCH_DIR = path.join(ROOT, "data", "benchmarks");
const EV_DIR = path.join(ROOT, "data", "evidence");

/** 收集页面里所有 cite 数组的 <sid>（与 scripts/check-one.mjs 的 walk 同口径） */
function pageCitedSids(b) {
  const out = new Set();
  const walk = (x) => {
    if (Array.isArray(x)) x.forEach(walk);
    else if (x && typeof x === "object") {
      for (const [k, v] of Object.entries(x)) {
        if (k === "cite" && Array.isArray(v)) v.forEach((c) => out.add(String(c).split("@")[0]));
        else walk(v);
      }
    }
  };
  walk(b);
  for (const v of Object.values(b.profile?.cites || {})) (v || []).forEach((c) => out.add(String(c).split("@")[0]));
  return out;
}

const files = fs.readdirSync(BENCH_DIR).filter((f) => f.endsWith(".json")).sort();
const rows = [];
for (const f of files) {
  const b = JSON.parse(fs.readFileSync(path.join(BENCH_DIR, f), "utf8"));
  const tpl = b.profile ? b.profile.template : "(no profile)";
  const declared = new Set((b.profile?.sources || []).map((s) => s.id));
  const pageSids = pageCitedSids(b);
  const evp = path.join(EV_DIR, `${b.id}.evidence.json`);
  const ev = fs.existsSync(evp) ? JSON.parse(fs.readFileSync(evp, "utf8")) : { quotes: [] };
  const ledSids = new Set((ev.quotes || []).map((q) => String(q.cite || "").split("@")[0]));

  rows.push({
    id: b.id,
    template: tpl,
    isV2: tpl === "benchmark-profile/v2",
    declared: declared.size,
    pageCited: pageSids.size,
    ledger: ledSids.size,
    gapA: [...pageSids].filter((s) => !declared.has(s)).sort(),
    gapB2: [...ledSids].filter((s) => !declared.has(s) && !pageSids.has(s)).sort(),
    noLedger: !fs.existsSync(evp),
  });
}

const v2 = rows.filter((r) => r.isV2);
const v0 = rows.filter((r) => !r.isV2);
const gapARows = v2.filter((r) => r.gapA.length);
const gapB2Rows = v2.filter((r) => r.gapB2.length);

const list = (a) => (a.length ? a.join(",") : "-");
const esc = (s) => (/[\t\n"]/.test(s) ? JSON.stringify(s) : s);

if (outPath) {
  const header = [
    "page_id", "template", "declared_sources", "page_cited_sids", "ledger_sids",
    "gapA_page_cited_but_undeclared", "gapB2_ledger_only",
  ].join("\t");
  const body = rows.map((r) => [
    r.id, r.template, r.declared, r.pageCited, r.ledger, list(r.gapA), list(r.gapB2),
  ].map(esc).join("\t"));
  fs.writeFileSync(outPath, [header, ...body].join("\n") + "\n", "utf8");
  console.error(`已写 ${outPath}（${rows.length} 行）`);
}

console.log(`页总数            ${rows.length}（v2 ${v2.length} / 无 v2 profile ${v0.length}）`);
console.log(`缺口 A 页数        ${gapARows.length} / ${v2.length} 个 v2 页，涉及 ${gapARows.reduce((n, r) => n + r.gapA.length, 0)} 个未声明 source id`);
console.log(`差异 B2 页数       ${gapB2Rows.length} / ${v2.length} 个 v2 页，涉及 ${gapB2Rows.reduce((n, r) => n + r.gapB2.length, 0)} 个账本独有 source id`);
for (const r of [...gapARows].sort((a, b) => b.gapA.length - a.gapA.length)) {
  console.log(`  A  ${r.id.padEnd(28)} ${r.gapA.join(",")}`);
}
for (const r of [...gapB2Rows].sort((a, b) => b.gapB2.length - a.gapB2.length).slice(0, 20)) {
  console.log(`  B2 ${r.id.padEnd(28)} ${r.gapB2.join(",")}`);
}
if (gapB2Rows.length > 20) console.log(`  B2 …… 其余 ${gapB2Rows.length - 20} 页见 TSV 明细`);

if (failOn === "A" && gapARows.length) {
  console.error(`\n--fail-on A：${gapARows.length} 个 v2 页存在「页面引用但未声明来源」`);
  process.exit(1);
}
