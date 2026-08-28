#!/usr/bin/env node
/**
 * validate.js — 校验 evals 书籍结构、章节顺序、编号与链接。
 *
 * 门禁：
 *   1. metadata.yaml 中列出的所有 chapter .md 都存在
 *   2. chapters/ 中所有 .md 都被 metadata.yaml 列出（无孤儿）
 *   3. H1 必须以 "N. " 开头
 *   4. H2 必须以 "N.M " 开头且 M 顺序递增
 *   5. H3 必须以 "N.M.K " 开头
 *   6. 代码 fence 闭合
 *   7. 内部相对链接目标存在
 *   8. 包含 TODO/FIXME/XXX 标记的章节失败
 *   9. 数字论断需标注来源（启发式）
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const CHAPTERS_DIR = join(__dirname, "chapters");
const METADATA_FILE = join(__dirname, "metadata.yaml");
const COVER_DIR = join(__dirname, "cover");

const errors = [];
const warnings = [];

function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

function readChapterOrder() {
  const yaml = readFileSync(METADATA_FILE, "utf-8");
  const lines = yaml.split(/\r?\n/);
  const items = [];
  let inChapters = false;
  for (const line of lines) {
    if (line.trim() === "chapters:") { inChapters = true; continue; }
    if (inChapters && /^[a-zA-Z_]+:/.test(line)) break;
    if (inChapters) {
      const m = line.match(/^\s+- ([a-zA-Z0-9_.-]+\.md)\s*$/);
      if (m) items.push(m[1]);
    }
  }
  return items;
}

function readPartStructure() {
  const yaml = readFileSync(METADATA_FILE, "utf-8");
  const lines = yaml.split(/\r?\n/);
  const parts = [];
  let inChapters = false;
  for (const line of lines) {
    if (line.trim() === "chapters:") { inChapters = true; continue; }
    if (inChapters && /^[a-zA-Z_]+:/.test(line)) break;
    if (!inChapters) continue;
    const partMatch = line.match(/^\s+- part: "(.+)"\s*$/);
    if (partMatch) {
      parts.push({ title: partMatch[1], items: [] });
    } else {
      const itemMatch = line.match(/^\s+- ([a-zA-Z0-9_.-]+\.md)\s*$/);
      if (itemMatch && parts.length > 0) {
        parts[parts.length - 1].items.push(itemMatch[1]);
      }
    }
  }
  return parts;
}

function validateHeading(file, lineNo, line, chapterNumber, expectedH2) {
  const h1 = line.match(/^# (.+)$/);
  if (h1 && !new RegExp(`^${chapterNumber}\\. `).test(h1[1])) {
    fail(`${file}:${lineNo} H1 must start with "${chapterNumber}. " — got: "${h1[1]}"`);
  }
  const h2 = line.match(/^## (.+)$/);
  if (h2 && !new RegExp(`^${chapterNumber}\\.${expectedH2} `).test(h2[1])) {
    fail(`${file}:${lineNo} H2 must use sequential section prefix "${chapterNumber}.${expectedH2}" — got: "${h2[1]}"`);
  }
  const h3 = line.match(/^### (.+)$/);
  if (h3 && !/^[0-9]+\.[0-9]+ /.test(h3[1])) {
    fail(`${file}:${lineNo} H3 must start with numeric section prefix (e.g. "1.1.1") — got: "${h3[1]}"`);
  }
}

function validateInternalLinks(file, content) {
  const re = /\[[^\]]+\]\((?!https?:\/\/|#)([^)#]+)\)/g;
  for (const m of content.matchAll(re)) {
    const target = m[1].split("#")[0];
    if (!target) continue;
    const abs = join(REPO_ROOT, target);
    if (!existsSync(abs)) {
      fail(`${file} missing internal link target: ${target}`);
    }
  }
}

function validateBannedTokens(file, content) {
  if (/\bTODO\b/.test(content)) fail(`${file} contains TODO marker`);
  if (/\bFIXME\b/.test(content)) fail(`${file} contains FIXME marker`);
  if (/\bXXX\b/.test(content)) fail(`${file} contains XXX marker`);
}

function validateDataClaims(file, content) {
  // 启发式：含百分号数字 + 未标"来源"的句子
  // 排除年份（YYYY）、版本号（v\d+）
  const lines = content.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (/\b\d{2,3}\.?\d*%/.test(line) || /\b\d+\.\d+\b/.test(line)) {
      if (!/(来源|Source|数据来源|参考)/.test(line)) {
        // 警告级而非失败，给作者一次机会
        if (line.length < 200 && /MMLU|HumanEval|Arena|GPT|Claude|Gemini|DeepSeek|Qwen|Llama|Mistral/.test(line)) {
          warn(`${file}:${i + 1} numeric claim may need source citation: ${line.trim().slice(0, 100)}...`);
        }
      }
    }
  });
}

function main() {
  console.log("[evals] Validating book structure...\n");

  // 1. metadata.yaml
  if (!existsSync(METADATA_FILE)) {
    fail(`metadata.yaml not found: ${METADATA_FILE}`);
    console.error(errors.join("\n"));
    process.exit(1);
  }
  const chapterOrder = readChapterOrder();
  const parts = readPartStructure();

  if (chapterOrder.length === 0) {
    fail("metadata.yaml has no chapters listed");
  }

  // 2. chapters dir
  if (!existsSync(CHAPTERS_DIR)) {
    fail(`chapters dir not found: ${CHAPTERS_DIR}`);
  } else {
    const actualChapters = readdirSync(CHAPTERS_DIR).filter((f) => f.endsWith(".md"));
    const chapterSet = new Set(chapterOrder);

    for (const file of chapterOrder) {
      const p = join(CHAPTERS_DIR, file);
      if (!existsSync(p)) fail(`metadata chapter missing: ${file}`);
    }
    for (const file of actualChapters) {
      if (!chapterSet.has(file)) fail(`orphan chapter not listed in metadata: ${file}`);
    }

    for (const file of chapterOrder) {
      const p = join(CHAPTERS_DIR, file);
      if (!existsSync(p) || !statSync(p).isFile()) continue;
      const content = readFileSync(p, "utf-8");
      const lines = content.split(/\r?\n/);
      let inFence = false;
      let expectedH2 = 1;
      const chapterNumber = Number(file.match(/^chapter-(\d+)/)?.[1]);
      if (!chapterNumber) {
        fail(`${file} filename must start with "chapter-NN-"`);
        continue;
      }
      for (const [idx, line] of lines.entries()) {
        if (line.trim().startsWith("```")) { inFence = !inFence; continue; }
        if (inFence) continue;
        validateHeading(file, idx + 1, line, chapterNumber, expectedH2);
        if (line.startsWith("## ")) expectedH2 += 1;
      }
      if (inFence) fail(`${file} has unclosed code fence`);
      validateInternalLinks(file, content);
      validateBannedTokens(file, content);
      validateDataClaims(file, content);
    }
  }

  // 3. cover
  if (!existsSync(join(COVER_DIR, "cover.svg"))) {
    warn(`cover/cover.svg not found`);
  }

  // 4. summary
  console.log(`  Chapters: ${chapterOrder.length}`);
  console.log(`  Parts: ${parts.length}`);
  if (warnings.length > 0) {
    console.warn(`\n  Warnings (${warnings.length}):`);
    warnings.forEach((w) => console.warn(`    ! ${w}`));
  }
  if (errors.length > 0) {
    console.error(`\n  Errors (${errors.length}):`);
    errors.forEach((e) => console.error(`    ✗ ${e}`));
    process.exit(1);
  }
  console.log(`\n[evals] Book validation passed for ${chapterOrder.length} chapters.`);
}

main();
