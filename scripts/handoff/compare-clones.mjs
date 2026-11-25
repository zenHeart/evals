#!/usr/bin/env node
/**
 * compare-clones.mjs — 证明「干净 clone + 交接补丁」与 t83-integ 工作树逐字节等价。
 *
 * 只比较两类路径：
 *   1. 两个 checkout 的 git 索引（= 将要提交的内容）— 必须逐字节相同
 *   2. 两个 checkout 的未跟踪文件集合 — 必须逐个同名且内容相同
 * 忽略：.git/、node_modules/、被 .gitignore 忽略的 data/{evidence/*,view,fresh}/ 等。
 *
 * 用法：node compare-clones.mjs <dirA> <dirB>
 * 退出码：0 = 完全等价；1 = 有差异（明细打到 stdout）
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const A = process.argv[2];
const B = process.argv[3];
if (!A || !B) { console.error("用法: node compare-clones.mjs <dirA> <dirB>"); process.exit(2); }

function tracked(dir) {
  const out = execFileSync("git", ["ls-files", "-z"], { cwd: dir, maxBuffer: 1 << 28 }).toString();
  return out.split("\0").filter(Boolean).sort();
}
function untracked(dir) {
  const out = execFileSync("git", ["ls-files", "-z", "--others", "--exclude-standard"], { cwd: dir, maxBuffer: 1 << 28 }).toString();
  return out.split("\0").filter(Boolean).sort();
}
function sha(p) {
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}
function compareSets(aSet, bSet, label) {
  const onlyA = aSet.filter((x) => !bSet.includes(x));
  const onlyB = bSet.filter((x) => !aSet.includes(x));
  let contentDiff = 0, missing = 0;
  const diffs = [];
  for (const f of aSet) {
    if (!bSet.includes(f)) { missing++; continue; }
    const pa = path.join(A, f), pb = path.join(B, f);
    let ea = null, eb = null;
    try { ea = fs.statSync(pa); } catch {}
    try { eb = fs.statSync(pb); } catch {}
    if (!ea || !eb) { missing++; continue; }
    if (ea.isDirectory() || eb.isDirectory()) continue;
    if (sha(pa) !== sha(pb)) { contentDiff++; if (diffs.length < 50) diffs.push(f); }
  }
  console.log(`[${label}] 集合大小 A=${aSet.length} B=${bSet.length}`);
  console.log(`  仅 A 有        ${onlyA.length}`);
  console.log(`  仅 B 有        ${onlyB.length}`);
  console.log(`  一侧缺失       ${missing}`);
  console.log(`  内容不同       ${contentDiff}`);
  for (const d of diffs) console.log(`    diff ${d}`);
  for (const d of onlyA.slice(0, 20)) console.log(`    only-A ${d}`);
  for (const d of onlyB.slice(0, 20)) console.log(`    only-B ${d}`);
  return onlyA.length + onlyB.length + missing + contentDiff;
}

const ta = tracked(A), tb = tracked(B);
const ua = untracked(A), ub = untracked(B);
const bad = compareSets(ta, tb, "git 索引（将提交内容）") + compareSets(ua, ub, "未跟踪文件");
console.log(bad === 0 ? "\n结论: 等价（逐字节相同）" : `\n结论: 有 ${bad} 处差异`);
process.exit(bad === 0 ? 0 : 1);
