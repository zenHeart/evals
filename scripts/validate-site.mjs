#!/usr/bin/env node
/**
 * validate-site.mjs — 站点级结构校验门禁（书内 validate.js 之外的第二道闸）。
 *
 * 原则（_docs/evals-goal.md）：任何已经发生过一次的结构性错误，
 * 都不应该靠 Agent 下次继续记住；应该转成 validator。
 *
 * 覆盖：
 *   1. 封面/章节数一致性 —— cover.svg 的「N 章 / M 个部分」必须与 metadata.yaml 同源
 *   2. 章节交叉引用有效性 —— 「第 N 章」「见/读 N.M(.K)」必须指向真实存在的章节/小节
 *   3. benchmark 数据 schema —— 必填字段、id 路径安全、status/evidence 枚举
 *   4. dist 内部链接完整性 —— 相对 href/src 目标必须存在（构建后运行）
 *   5. 构建产物隐私 —— dist 不得包含 research/ 等内部素材
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const errors = [];
const warn = [];

function err(msg) { errors.push(msg); }

// ---------------------------------------------------------------- metadata 解析

function readPartStructure() {
  const lines = readFileSync(join(ROOT, "book", "metadata.yaml"), "utf-8").split(/\r?\n/);
  const parts = [];
  let inChapters = false;
  for (const line of lines) {
    if (line.trim() === "chapters:") { inChapters = true; continue; }
    if (inChapters && /^[a-zA-Z_]+:/.test(line)) break;
    if (!inChapters) continue;
    const partMatch = line.match(/^\s+- part: "(.+)"\s*$/);
    if (partMatch) parts.push({ title: partMatch[1], items: [] });
    else {
      const itemMatch = line.match(/^\s+- ([a-zA-Z0-9_.-]+\.md)\s*$/);
      if (itemMatch && parts.length > 0) parts[parts.length - 1].items.push(itemMatch[1]);
    }
  }
  return parts;
}

// ---------------------------------------------------------------- 1. 封面一致性

function checkCoverConsistency(parts) {
  const chapterCount = parts.flatMap(p => p.items).length;
  const partCount = parts.length;
  const svgPath = join(ROOT, "book", "cover", "cover.svg");
  if (!existsSync(svgPath)) { err(`[cover] 缺少 ${svgPath}`); return; }
  const svg = readFileSync(svgPath, "utf-8");
  const mCh = svg.match(/>(\d+) 章</);
  const mPart = svg.match(/>(\d+) 个部分</);
  if (!mCh || !mPart) { err("[cover] cover.svg 中找不到「N 章 / M 个部分」文本（模板被改动？）"); return; }
  if (Number(mCh[1]) !== chapterCount) err(`[cover] 封面章数 ${mCh[1]} ≠ metadata 实际 ${chapterCount}（重排章节后必须同步封面）`);
  if (Number(mPart[1]) !== partCount) err(`[cover] 封面部分数 ${mPart[1]} ≠ metadata 实际 ${partCount}`);
  const distCover = join(ROOT, "dist", "cover.svg");
  if (existsSync(distCover)) {
    const dsvg = readFileSync(distCover, "utf-8");
    if (!dsvg.includes(`>${chapterCount} 章<`) || !dsvg.includes(`>${partCount} 个部分<`)) {
      err(`[cover] dist/cover.svg 数字与 metadata 不一致——请重新 npm run build`);
    }
  }
}

// ---------------------------------------------------------------- 2. 交叉引用

function checkCrossReferences(parts) {
  const flat = parts.flatMap(p => p.items);
  const chapterNums = new Set();
  const sectionNums = new Set();
  for (const f of flat) {
    const mdPath = join(ROOT, "book", "chapters", f);
    if (!existsSync(mdPath)) continue; // 章节文件存在性由 book/validate.js 负责
    const md = readFileSync(mdPath, "utf-8").replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " ");
    for (const m of md.matchAll(/^#{1,3}\s+(\d+(?:\.\d+)*)[\s.]/gm)) {
      const num = m[1];
      if (num.includes(".")) sectionNums.add(num);
      else chapterNums.add(num);
    }
  }
  for (const f of flat) {
    const mdPath = join(ROOT, "book", "chapters", f);
    if (!existsSync(mdPath)) continue;
    const md = readFileSync(mdPath, "utf-8").replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " ");
    const lines = md.split(/\r?\n/);
    // 自测节内引用其他章节的小节 = 高危旧编号残留信号（自测通常引用本章）；仅警告不阻断
    let inQuiz = false;
    const curNum = f.match(/chapter-(\d+)/)?.[1] ?? null;
    lines.forEach((line, i) => {
      if (/^##\s/.test(line.trim())) inQuiz = /自测/.test(line);
      if (inQuiz && curNum) {
        for (const m of line.matchAll(/(?:见|读|对应|参见|详见|回顾)\s*(\d+\.\d+)/g)) {
          const refCh = m[1].split(".")[0];
          if (refCh !== curNum && chapterNums.has(refCh)) {
            warn.push(`[xref-suspect] ${f}:${i + 1} 自测节引用了其他章小节「${m[1]}」——可能是章节重排前的旧编号（同章常为 ${curNum}.${m[1].split(".").slice(1).join(".")}），请人工确认`);
          }
        }
      }
      for (const m of line.matchAll(/第\s*(\d+)\s*章/g)) {
        if (!chapterNums.has(m[1])) err(`[xref] ${f}:${i + 1} 引用了不存在的「第 ${m[1]} 章」→ "${line.trim().slice(0, 60)}"`);
      }
      for (const m of line.matchAll(/(?:见|读|对应|参见|详见|回顾)\s*(\d+\.\d+(?:\.\d+)?)/g)) {
        if (!sectionNums.has(m[1])) err(`[xref] ${f}:${i + 1} 引用了不存在的小节「${m[1]}」→ "${line.trim().slice(0, 60)}"`);
      }
    });
  }
}

// ---------------------------------------------------------------- 3. benchmark schema（构建消费视图）

const STATUS_ENUM = ["active", "rolling", "near-saturation", "historical", "superseded", "deprecated"];

function checkBenchmarkSchema() {
  // 深度 schema/外键/枚举校验在 scripts/validate-data.mjs（实体层）；此处校验构建实际消费的关键不变量
  const benchDir = join(ROOT, "data", "benchmarks");
  if (!existsSync(benchDir)) { err("[bench] 缺少 data/benchmarks/（实体数据层）"); return; }
  const files = readdirSync(benchDir).filter(f => f.endsWith(".json"));
  if (!files.length) { err("[bench] data/benchmarks/ 为空"); return; }
  const catIds = new Set(
    existsSync(join(ROOT, "data", "taxonomy.json"))
      ? (JSON.parse(readFileSync(join(ROOT, "data", "taxonomy.json"), "utf-8")).categories || []).map(c => c.id)
      : []
  );
  const ids = new Set();
  for (const f of files) {
    let b;
    try { b = JSON.parse(readFileSync(join(benchDir, f), "utf-8")); }
    catch (e) { err(`[bench:${f}] 解析失败: ${e.message}`); continue; }
    const at = `bench:${b.id || f}`;
    for (const k of ["id", "name", "summary"]) {
      if (b[k] === undefined || b[k] === null || b[k] === "") err(`[${at}] 缺少必填字段 ${k}`);
    }
    if (!/^[a-z0-9][a-z0-9-]*$/.test(b.id || "")) err(`[${at}] id 必须是 URL 安全 slug（详情页路径依赖它）`);
    if (ids.has(b.id)) err(`[${at}] id 重复`);
    ids.add(b.id);
    const cat = (b.categories || [])[0];
    if (cat && catIds.size && !catIds.has(cat)) err(`[${at}] 未知 category "${cat}"`);
    if (b.status && !STATUS_ENUM.includes(b.status)) err(`[${at}] 非法 status "${b.status}"（允许：${STATUS_ENUM.join("|")}）`);
    for (const s of b.official_sources || []) {
      if (!s.url || !/^https?:\/\//.test(s.url)) err(`[${at}] official_sources 条目缺少合法 url`);
    }
  }
}

// ---------------------------------------------------------------- 4/5. dist 链接与隐私

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function checkDist() {
  const dist = join(ROOT, "dist");
  if (!existsSync(join(dist, "index.html"))) {
    warn.push("[dist] dist/index.html 不存在——先运行 npm run build 再跑本校验才能覆盖链接检查");
    return;
  }
  const files = walk(dist);
  const htmlFiles = files.filter(f => f.endsWith(".html"));
  const fileSet = new Set(files.map(f => relative(dist, f).replace(/\\/g, "/")));
  // 目录式链接（/benchmarks/gpqa/）目标按 目录/index.html 归一
  const dirSet = new Set(
    files.filter(f => f.endsWith(".html"))
      .flatMap(f => {
        const rel = relative(dist, f).replace(/\\/g, "/");
        return rel.endsWith("/index.html") ? [rel.slice(0, -"index.html".length)] : [];
      })
  );

  // 5. 隐私：research 素材不得进入 dist
  const leaked = files.filter(f => relative(dist, f).replace(/\\/g, "/").startsWith("research/"));
  if (leaked.length) err(`[privacy] dist 中发现内部 research 产物 ${leaked.length} 个（示例：${relative(dist, leaked[0])}）`);

  // 4. 内部链接
  let checked = 0;
  for (const f of htmlFiles) {
    // 剔除 <script>/<style> 内容：内联 JS 里的 href 拼接模板不是真实链接
    const html = readFileSync(f, "utf-8").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
    const base = dirname(f);
    const relFromDist = relative(dist, base).replace(/\\/g, "/");
    for (const m of html.matchAll(/(?:href|src)="([^"#]+)(#[^"]*)?"/g)) {
      const raw = m[1];
      if (/^(https?:|mailto:|data:|javascript:)/.test(raw)) continue;
      const target = raw.startsWith("/") ? join(dist, raw) : resolve(base, raw);
      const rel = relative(dist, target).replace(/\\/g, "/");
      if (rel.startsWith("..")) { err(`[link] ${relative(dist, f)} → "${raw}" 越出 dist`); continue; }
      checked++;
      // resolve 会吃掉链接尾斜杠：目录式链接（../gpqa/）按 gpqa/index.html 兜底
      const asDir = rel + "/index.html";
      if (!fileSet.has(rel) && !fileSet.has(asDir)) {
        err(`[link] ${relative(dist, f)} → "${raw}" 目标不存在（dist/${rel}${fileSet.has(asDir) ? "" : " 或 " + asDir}）`);
      }
    }
  }
  console.log(`  [dist] 链接检查 ${htmlFiles.length} 个 HTML / ${checked} 个内部引用`);
}

// ---------------------------------------------------------------- main

const parts = readPartStructure();
console.log("validate-site：站点结构门禁");
checkCoverConsistency(parts);
checkCrossReferences(parts);
checkBenchmarkSchema();
checkDist();

if (warn.length) warn.forEach(w => console.log(`  ⚠ ${w}`));
if (errors.length) {
  console.error(`\n✗ validate-site 失败，${errors.length} 个问题：`);
  errors.slice(0, 60).forEach(e => console.error("  ✗ " + e));
  if (errors.length > 60) console.error(`  … 其余 ${errors.length - 60} 个略`);
  process.exit(1);
}
console.log("✓ validate-site 全部通过");
