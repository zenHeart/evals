#!/usr/bin/env node
/**
 * sync-skills.mjs — 项目技能跨 agent 分发（单向镜像）。
 *
 * Canonical：.claude/skills/<name>/   （Claude Code 发现目录，技能正文的唯一所有者）
 * Mirror   ：.agent/skills/<name>/    （Google Antigravity 等读 .agent/skills/ 的 agent 的发现目录）
 *
 * 规则（与资产仓 canonical/mirror 纪律一致）：
 *   - 单方向：只允许 canonical → mirror；改技能正文请改 .claude/skills/，然后重跑本脚本。
 *   - 全量：目录整树复制（SKILL.md + references/ + scripts/ + evals/）。
 *   - 防漂移：mirror 中 canonical 已不存在的技能目录会被删除；文件按字节比较，不一致即覆盖。
 *
 * 用法：node scripts/sync-skills.mjs   （npm run sync:skills）
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, ".claude", "skills");
const DST = join(ROOT, ".agent", "skills");

if (!existsSync(SRC)) {
  console.error(`[sync-skills] canonical 目录不存在：${SRC}`);
  process.exit(1);
}

function getAllFiles(dir, base = "") {
  let results = [];
  if (!existsSync(dir)) return results;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, relPath));
    } else if (entry.isFile()) {
      results.push(relPath);
    }
  }
  return results;
}

const isCheck = process.argv.includes("--check");

if (isCheck) {
  if (!existsSync(DST)) {
    console.error(`[sync-skills] 错误：镜像目录不存在：${DST}`);
    process.exit(1);
  }
  const srcFiles = new Set(getAllFiles(SRC));
  const dstFiles = new Set(getAllFiles(DST));
  let hasDiff = false;

  for (const file of srcFiles) {
    if (!dstFiles.has(file)) {
      console.error(`[sync-skills] 漂移：镜像缺失文件 ${file}`);
      hasDiff = true;
    } else {
      const srcBuf = readFileSync(join(SRC, file));
      const dstBuf = readFileSync(join(DST, file));
      if (!srcBuf.equals(dstBuf)) {
        console.error(`[sync-skills] 漂移：内容不一致 ${file}`);
        hasDiff = true;
      }
    }
  }

  for (const file of dstFiles) {
    if (!srcFiles.has(file)) {
      console.error(`[sync-skills] 漂移：镜像存在多余文件 ${file}`);
      hasDiff = true;
    }
  }

  if (hasDiff) {
    console.error("[sync-skills] 失败：.agent/skills/ 与 .claude/skills/ 存在漂移。请运行 `npm run sync:skills` 重新同步后提交。");
    process.exit(1);
  }

  console.log("[sync-skills] ✓ 技能镜像无漂移，与 canonical 完全一致");
  process.exit(0);
}

mkdirSync(DST, { recursive: true });

const names = readdirSync(SRC).filter(n => statSync(join(SRC, n)).isDirectory());
let copied = 0, removed = 0;

// 全量复制（cpSync 递归覆盖）
for (const name of names) {
  const dst = join(DST, name);
  cpSync(join(SRC, name), dst, { recursive: true });
  copied++;
  console.log(`[sync-skills] ✓ ${name} → ${relative(ROOT, dst)}`);
}

// 清理 mirror 中 canonical 已删除的技能
for (const name of readdirSync(DST)) {
  if (!names.includes(name)) {
    rmSync(join(DST, name), { recursive: true, force: true });
    removed++;
    console.log(`[sync-skills] ✗ ${name}（canonical 已删除，镜像清除）`);
  }
}

if (copied === 0 && removed === 0) console.log("[sync-skills] 无技能目录，未做任何变更");
else console.log(`[sync-skills] 完成：镜像 ${copied} 个技能，清除 ${removed} 个陈旧镜像`);

