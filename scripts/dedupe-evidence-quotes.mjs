#!/usr/bin/env node
/**
 * dedupe-evidence-quotes.mjs — 去掉引文账本里重复的 (cite, quote) 条目。
 *
 * 背景：addquote.py 在追加摘录前有去重判断，但账本里仍出现了重复条目
 * （10 个文件共 16 条），说明存在一条绕过该判断的写入路径。重复条目会让
 * check-one.mjs 的 quotes_ok 虚高、让 verify-cite-coverage.mjs 报「摘录重复」。
 *
 * 做法：保留每个 (cite, quote) 的首次出现，删除后续重复。只做删除，不改动
 * 任何保留行的文本，因此 diff 必须是纯删除。
 *
 * 格式保持：每个文件的缩进与末尾换行各自不同（1/2 空格、有/无换行，还有 5 个
 * 手写混合格式），先用 JSON.stringify 反推格式，推不出来就跳过并报告，
 * 绝不把文件重排成另一种格式。
 *
 * 用法（在仓库根运行）:
 *   node scripts/dedupe-evidence-quotes.mjs            # 全量 data/evidence
 *   node scripts/dedupe-evidence-quotes.mjs <id>...    # 指定账本
 *   加 --dry-run 只报告不写盘
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const EV_DIR = path.join(ROOT, "data", "evidence");
const DRY = process.argv.includes("--dry-run");

function listLedgers() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (args.length) return args.map((a) => (a.endsWith(".evidence.json") ? a : `${a}.evidence.json`));
  return fs.readdirSync(EV_DIR).filter((f) => f.endsWith(".evidence.json")).sort();
}

/** 反推该文件用的 JSON.stringify 缩进；推不出返回 null（手写混合格式） */
function detectFormat(raw, obj) {
  const body = raw.endsWith("\n") ? raw.slice(0, -1) : raw;
  for (const n of [0, 1, 2, 3, 4]) {
    if (JSON.stringify(obj, null, n) === body) return { indent: n, newline: raw.endsWith("\n") };
  }
  return null;
}

let touched = 0, removed = 0, skipped = [];
for (const f of listLedgers()) {
  const p = path.join(EV_DIR, f);
  const raw = fs.readFileSync(p, "utf8");
  let obj;
  try {
    obj = JSON.parse(raw);
  } catch (e) {
    skipped.push(`${f}: JSON 解析失败 — ${e.message}`);
    continue;
  }
  const fmt = detectFormat(raw, obj);
  if (!fmt) {
    // 手写混合格式：先查有没有重复，有就报告让人工处理，没有就不算问题
    const quotes = obj.quotes;
    if (!Array.isArray(quotes)) continue;
    const seen = new Set();
    let dup = 0;
    for (const q of quotes) {
      const key = `${q.cite}\u0000${q.quote}`;
      if (seen.has(key)) dup++;
      seen.add(key);
    }
    if (dup) skipped.push(`${f}: 无法反推 JSON 格式（手写混合缩进），有 ${dup} 条重复需人工删除`);
    continue;
  }
  const quotes = obj.quotes;
  if (!Array.isArray(quotes)) continue;
  const seen = new Set();
  const kept = [];
  let dropped = 0;
  for (const q of quotes) {
    const key = `${q.cite}\u0000${q.quote}`;
    if (seen.has(key)) { dropped++; continue; }
    seen.add(key);
    kept.push(q);
  }
  if (!dropped) continue;
  obj.quotes = kept;
  const out = JSON.stringify(obj, null, fmt.indent) + (fmt.newline ? "\n" : "");
  if (!DRY) fs.writeFileSync(p, out);
  // 硬断言：kept 必须是原 quotes 的保序子序列，且删掉的恰好是重复条目
  let i = 0;
  for (const q of quotes) if (i < kept.length && JSON.stringify(q) === JSON.stringify(kept[i])) i++;
  const reparsed = JSON.parse(out);
  if (i !== kept.length || JSON.stringify(reparsed) !== JSON.stringify(obj)) {
    skipped.push(`${f}: 去重结果不是原数组的保序子序列，已放弃写入`);
    continue;
  }
  touched++;
  removed += dropped;
  console.log(`${f}: -${dropped} 条重复（${quotes.length} → ${kept.length}，indent=${fmt.indent}${fmt.newline ? " +nl" : ""}）`);
}
console.log(`\n${DRY ? "[dry-run] " : ""}处理 ${touched} 个账本，删除 ${removed} 条重复摘录`);
for (const s of skipped) console.log("跳过: " + s);
process.exit(skipped.length ? 1 : 0);
