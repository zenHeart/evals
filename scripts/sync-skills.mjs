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
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, ".claude", "skills");
const DST = join(ROOT, ".agent", "skills");

if (!existsSync(SRC)) {
  console.error(`[sync-skills] canonical 目录不存在：${SRC}`);
  process.exit(1);
}
mkdirSync(DST, { recursive: true });

const names = readdirSync(SRC).filter(n => statSync(join(SRC, n)).isDirectory());
let copied = 0, refreshed = 0, removed = 0;

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
