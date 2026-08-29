#!/usr/bin/env node
/**
 * restructure-four-blocks.mjs — 按"四大块"重构书籍目录（一次性迁移脚本）
 *
 * 旧 7 部分顺序 → 新 4 大块阅读顺序：
 *   B1 建立框架认知      ← old 01, 02, 04        → new 01-03
 *   B2 方法论与标准流程  ← old 03, 18, 19, 26    → new 04-07
 *   B3 厂商发布评测全景  ← old 14, 05-13, 15     → new 08-18
 *   B4 评估框架实战      ← old 16, 17, 20-25, 27-31 → new 19-31
 *
 * 动作：文件重命名（经临时名防碰撞）→ H1 编号 → H2/H3 前缀 → 交叉引用（第 X 章 / §X / §X.M）
 */

import { readFileSync, writeFileSync, renameSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, "..", "book", "chapters");

// 旧章号 → 新章号
const MAP = {
  0: 0, 1: 1, 2: 2, 4: 3,
  3: 4, 18: 5, 19: 6, 26: 7,
  14: 8, 5: 9, 6: 10, 7: 11, 8: 12, 9: 13, 10: 14, 11: 15, 12: 16, 13: 17, 15: 18,
  16: 19, 17: 20, 20: 21, 21: 22, 22: 23, 23: 24, 24: 25, 25: 26,
  27: 27, 28: 28, 29: 29, 30: 30, 31: 31,
};

const files = readdirSync(DIR).filter(f => /^chapter-\d{2}-.+\.md$/.test(f));

// ── 1. 文件重命名（两段式防碰撞）──────────────────────────
for (const f of files) {
  const old = Number(f.match(/^chapter-(\d{2})/)[1]);
  const nu = MAP[old];
  if (nu !== undefined && nu !== old) {
    renameSync(join(DIR, f), join(DIR, `__tmp_${String(nu).padStart(2, "0")}__` + f.replace(/^chapter-\d{2}/, "")));
  }
}
for (const f of readdirSync(DIR).filter(f => f.startsWith("__tmp_"))) {
  const nu = f.match(/^__tmp_(\d{2})__/)[1];
  const slug = f.replace(/^__tmp_\d{2}__chapter-\d{2}/, "");
  renameSync(join(DIR, f), join(DIR, `chapter-${nu}${slug}`));
}
console.log("files renamed");

// ── 2. 内容编号与交叉引用 ─────────────────────────────────
const pad = n => String(n).padStart(2, "0");

// "第 5-12 章" 范围 → "第 9-16 章"（端点映射）
function mapRange(m, p1, p2) {
  const a = MAP[Number(p1)], b = MAP[Number(p2)];
  if (a === undefined || b === undefined) return m;
  // 展开区间内全部旧号都需在映射内，否则保守原样
  for (let k = Number(p1); k <= Number(p2); k++) if (MAP[k] === undefined) return m;
  const seq = [];
  for (let k = Number(p1); k <= Number(p2); k++) seq.push(MAP[k]);
  const contiguous = seq.every((v, i) => i === 0 || v === seq[i - 1] + 1);
  return contiguous ? `第 ${a}-${b} 章` : `第 ${seq.join("、")} 章`;
}

let totalReplacements = 0;
for (const f of readdirSync(DIR).filter(f => /^chapter-\d{2}-.+\.md$/.test(f))) {
  const oldNum = Number(f.match(/^chapter-(\d{2})/)[1]);
  const newNum = MAP[oldNum];
  const fp = join(DIR, f);
  let s = readFileSync(fp, "utf-8");
  const before = s;

  // H1: "# 14. xxx" → "# 8. xxx"
  s = s.replace(new RegExp(`^# ${oldNum}\\. `, "m"), `# ${newNum}. `);

  // H2: "## 14.5 xxx" → "## 8.5 xxx"（子节号 M 不变，内部顺序未变）
  s = s.replace(new RegExp(`^## ${oldNum}\\.`, "gm"), `## ${newNum}.`);

  // H3: "### 14.5.2 xxx" → "### 8.5.2 xxx"
  s = s.replace(new RegExp(`^### ${oldNum}\\.`, "gm"), `### ${newNum}.`);

  // 引用块内的 "详见：第 X 章" / "（第 X 章）" / "见第 X 章" / "第 X 章" — 单章号
  s = s.replace(/第 (\d+) 章/g, (m, d) => {
    const t = MAP[Number(d)];
    if (t === undefined) return m;
    totalReplacements++;
    return `第 ${t} 章`;
  });
  // 范围 "第 5-12 章"
  s = s.replace(/第 (\d+)-(\d+) 章/g, (m, a, b) => { totalReplacements++; return mapRange(m, a, b); });
  // §14.5 / §14（章内小节号不变，仅映射章号）
  s = s.replace(/§(\d+)\.(\d+)/g, (m, d, sec) => {
    const t = MAP[Number(d)];
    if (t === undefined) return m;
    totalReplacements++;
    return `§${t}.${sec}`;
  });
  s = s.replace(/§(\d+)(?!\.\d)/g, (m, d) => {
    const t = MAP[Number(d)];
    if (t === undefined) return m;
    totalReplacements++;
    return `§${t}`;
  });
  // "N.M 节" / "第 X.Y 节" 前缀映射（保守：仅 "N.M 节" 形态）
  s = s.replace(/(\d+)\.(\d+) 节/g, (m, d, sec) => {
    const t = MAP[Number(d)];
    if (t === undefined) return m;
    totalReplacements++;
    return `${t}.${sec} 节`;
  });

  if (s !== before) writeFileSync(fp, s, "utf-8");
}
console.log("cross-references updated:", totalReplacements);

// ── 3. 遗漏排查：仍指向旧号的"第 X 章"（X 无映射即报出）────
let dangling = 0;
for (const f of readdirSync(DIR).filter(f => /^chapter-\d{2}-.+\.md$/.test(f))) {
  const s = readFileSync(join(DIR, f), "utf-8");
  for (const m of s.matchAll(/第 (\d+) 章/g)) {
    if (MAP[Number(m[1])] === undefined) { console.log(`  ⚠ ${f}: 未映射章号 "${m[0]}"`); dangling++; }
  }
}
console.log(dangling ? `${dangling} 处未映射引用待人工处理` : "no dangling refs");
