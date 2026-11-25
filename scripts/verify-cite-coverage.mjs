#!/usr/bin/env node
/**
 * verify-cite-coverage.mjs — 引文账本结构核验（无需网络、无需外置语料）。
 *
 * 与 scripts/check-one.mjs 的分工：
 *   - check-one.mjs 回答「摘录是否逐字出现在原始抓取文本里」，需要外置语料
 *     EVIDENCE_DIR/<id>/<sid>.txt（本机 2.2 GB，不随仓库分发）。
 *   - 本脚本只回答「每条 cite 是否在引文账本里有逐字摘录、账本自身是否自洽」，
 *     全部输入都在仓库内（data/benchmarks/ + data/evidence/），干净 clone 即可跑。
 *     它不能替代逐字核验，但能把「cite 悬空 / 摘录过短 / 摘录重复 / 来源未被引用」
 *     这类结构缺陷在集成前拦住。
 *
 * 用法（在仓库根目录运行）:
 *   node scripts/verify-cite-coverage.mjs                 # 全量
 *   node scripts/verify-cite-coverage.mjs <id> [<id>...]  # 指定页
 *
 * 退出码：0 = 全部通过；1 = 有失败项（明细打印到 stdout，末尾给出汇总）。
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BENCH_DIR = path.join(ROOT, "data", "benchmarks");
const EV_DIR = process.env.EVIDENCE_DIR || path.join(ROOT, "data", "evidence");

/** 与 check-one.mjs 同一套 cite 收集规则：递归找所有 cite 数组，外加 profile.cites */
function collectCites(b) {
  const cites = new Set();
  (function walk(x) {
    if (Array.isArray(x)) x.forEach(walk);
    else if (x && typeof x === "object") {
      for (const [k, v] of Object.entries(x)) {
        if (k === "cite" && Array.isArray(v)) v.forEach((c) => cites.add(c));
        else walk(v);
      }
    }
  })(b);
  for (const v of Object.values(b.profile?.cites || {})) (v || []).forEach((c) => cites.add(c));
  return cites;
}

function listPages() {
  const args = process.argv.slice(2);
  if (args.length) return args.map((a) => (a.endsWith(".json") ? a : a + ".json"));
  return fs.readdirSync(BENCH_DIR).filter((f) => f.endsWith(".json")).sort();
}

const files = listPages();
const totals = {
  pages: 0,
  v2: 0,
  v0: 0,
  cites: 0,
  quotes: 0,
  failedPages: 0,
  danglingCites: 0,
  shortQuotes: 0,
  dupQuotes: 0,
  uncitedSources: 0,
  missingLedger: 0,
};
const failures = [];

for (const f of files) {
  const file = path.join(BENCH_DIR, f);
  const id = path.basename(f, ".json");
  let b;
  try {
    b = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    failures.push(`${id}: JSON 解析失败 — ${e.message}`);
    totals.failedPages++;
    continue;
  }
  totals.pages++;
  const isV2 = b.profile?.template === "benchmark-profile/v2";
  if (isV2) totals.v2++;
  else totals.v0++;

  const cites = collectCites(b);
  totals.cites += cites.size;

  const evf = path.join(EV_DIR, `${b.id}.evidence.json`);
  if (!fs.existsSync(evf)) {
    // v0 实体（backlog 里的 28 个）本来就没有引文账本，属已知待升级项，不计失败。
    if (cites.size > 0) {
      failures.push(`${id}: 有 ${cites.size} 条 cite 但没有引文账本 ${path.relative(ROOT, evf)}`);
      totals.failedPages++;
      totals.missingLedger++;
    }
    continue;
  }

  let ev;
  try {
    ev = JSON.parse(fs.readFileSync(evf, "utf8"));
  } catch (e) {
    failures.push(`${id}: 引文账本解析失败 — ${e.message}`);
    totals.failedPages++;
    continue;
  }
  const quotes = ev.quotes || [];
  totals.quotes += quotes.length;

  const byCite = new Map();
  const seen = new Set();
  let uncited = [];
  for (const q of quotes) {
    const cite = String(q.cite || "");
    const text = String(q.quote || "");
    if (cite) byCite.set(cite, (byCite.get(cite) || 0) + 1);
    if (text.length < 15) {
      failures.push(`${id}: 摘录过短(<15 字符) [${cite}] ${JSON.stringify(text.slice(0, 40))}`);
      totals.shortQuotes++;
    }
    const key = cite + "" + text;
    if (seen.has(key)) {
      failures.push(`${id}: 摘录重复 [${cite}] ${JSON.stringify(text.slice(0, 40))}`);
      totals.dupQuotes++;
    }
    seen.add(key);
  }

  const dangling = [...cites].filter((c) => !byCite.get(c));
  if (dangling.length) {
    totals.danglingCites += dangling.length;
    failures.push(`${id}: ${dangling.length} 条 cite 在账本里没有逐字摘录 — ${dangling.slice(0, 5).join(", ")}${dangling.length > 5 ? " …" : ""}`);
  }

  if (isV2) {
    const usedSrc = new Set([...cites].map((c) => String(c).split("@")[0]));
    uncited = (b.profile.sources || []).filter((s) => !usedSrc.has(s.id));
    if (uncited.length) {
      totals.uncitedSources += uncited.length;
      failures.push(`${id}: ${uncited.length} 个 sources 未被任何 cite 引用 — ${uncited.map((s) => s.id).slice(0, 5).join(", ")}${uncited.length > 5 ? " …" : ""}`);
    }
  }

  if (dangling.length || (isV2 && uncited.length)) totals.failedPages++;
}

const pad = (n, w = 6) => String(n).padStart(w);
console.log("引文账本结构核验（仅仓库内输入，无网络、无外置语料）");
console.log(`  页数            ${pad(totals.pages)}   （v2 ${pad(totals.v2)} / v0 ${pad(totals.v0)}）`);
console.log(`  cite 定位符     ${pad(totals.cites)}`);
console.log(`  账本摘录        ${pad(totals.quotes)}`);
console.log(`  失败页          ${pad(totals.failedPages)}`);
console.log(`  悬空 cite       ${pad(totals.danglingCites)}`);
console.log(`  过短摘录        ${pad(totals.shortQuotes)}`);
console.log(`  重复摘录        ${pad(totals.dupQuotes)}`);
console.log(`  未被引用来源    ${pad(totals.uncitedSources)}`);
console.log(`  缺失账本(有cite)${pad(totals.missingLedger)}`);

if (failures.length) {
  console.log(`\n失败明细（${failures.length} 条，最多 200 条）:`);
  for (const m of failures.slice(0, 200)) console.log(" - " + m);
  if (failures.length > 200) console.log(` … 其余 ${failures.length - 200} 条省略`);
  console.log("\n结果: FAIL");
  process.exit(1);
}
console.log("\n结果: PASS");
