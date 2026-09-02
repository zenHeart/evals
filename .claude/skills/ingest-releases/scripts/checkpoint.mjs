#!/usr/bin/env node
/**
 * checkpoint.mjs — ingest-releases 技能的增量窗口状态工具。
 *
 * 「上个时间结点」的唯一事实来源是证据账本本身（data/model-releases/official/ 下的
 * 最大 release_date），检查点文件只补充一件账本推导不出的事：上次扫描发生在何时。
 *
 * 用法（在仓库根目录运行）:
 *   node .claude/skills/ingest-releases/scripts/checkpoint.mjs status
 *     → 打印本次扫描应使用的增量窗口（JSON）
 *   node .claude/skills/ingest-releases/scripts/checkpoint.mjs commit --max-release-date YYYY-MM-DD
 *     → 整批入库与门禁全部通过后，记录本次扫描检查点
 *
 * 设计约束：
 *   - 零依赖、纯 Node 标准库（与仓内其他 scripts 一致）。
 *   - 窗口起点恒定回退 14 天（OVERLAP_DAYS）：发布文可能事后补印日期、
 *     搜索索引滞后于发布、厂商可能在窗口边界补发变体——重叠保证不漏。
 *   - 状态文件 data/generated/ingest-checkpoint.json 与仓内其他 generated 派生态
 *     一同入库，扫描历史可用 git 追溯，不另建审计机制。
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd());
const RELEASES_DIR = join(ROOT, "data", "model-releases", "official");
const CHECKPOINT = join(ROOT, "data", "generated", "ingest-checkpoint.json");
const OVERLAP_DAYS = 14;
const FIRST_RUN_FALLBACK_DAYS = 90;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function daysAgo(isoDate, days) {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/** 递归收集 official/ 下全部 release JSON 的 release_date（排除 manifest 等） */
function ledgerDates(dir = RELEASES_DIR, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) ledgerDates(p, out);
    else if (name.endsWith(".json") && name !== "manifest.json") {
      try {
        const r = JSON.parse(readFileSync(p, "utf-8"));
        if (typeof r.release_date === "string" && ISO_DATE.test(r.release_date)) out.push(r.release_date);
      } catch { /* 单文件损坏不阻断 status；validate-data 会报 */ }
    }
  }
  return out;
}

/** official/ 下 release 文件总数（含月精度/无日期档，用于对账展示） */
function ledgerFileCount(dir = RELEASES_DIR, n = 0) {
  if (!existsSync(dir)) return n;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) n = ledgerFileCount(p, n);
    else if (name.endsWith(".json") && name !== "manifest.json") n++;
  }
  return n;
}

function readCheckpoint() {
  if (!existsSync(CHECKPOINT)) return null;
  try { return JSON.parse(readFileSync(CHECKPOINT, "utf-8")); } catch { return null; }
}

function status() {
  const dates = ledgerDates();
  const ledgerMax = dates.sort().pop() ?? null;
  const cp = readCheckpoint();
  const anchor = cp?.last_max_release_date && ISO_DATE.test(cp.last_max_release_date)
    ? cp.last_max_release_date
    : ledgerMax;
  const firstRun = !anchor;
  const windowSince = firstRun ? daysAgo(today(), FIRST_RUN_FALLBACK_DAYS) : daysAgo(anchor, OVERLAP_DAYS);
  const result = {
    today: today(),
    last_scan_at: cp?.last_scan_at ?? null,
    ledger_max_release_date: ledgerMax,
    official_release_count: ledgerFileCount(),
    window_since: windowSince,
    window_until: today(),
    overlap_days: OVERLAP_DAYS,
    first_run: firstRun,
    note: firstRun
      ? `账本与检查点均无日期锚点——首次运行按近 ${FIRST_RUN_FALLBACK_DAYS} 天窗口扫描`
      : `窗口 = 检查点锚点 ${anchor} 回退 ${OVERLAP_DAYS} 天重叠`,
  };
  console.log(JSON.stringify(result, null, 2));
}

function commit(args) {
  const flag = args.indexOf("--max-release-date");
  const value = flag >= 0 ? args[flag + 1] : null;
  if (!value || !ISO_DATE.test(value)) {
    console.error("用法: checkpoint.mjs commit --max-release-date YYYY-MM-DD");
    console.error("--max-release-date = 本批入库中见到的最大官方发布日期（不是今天）。");
    process.exit(1);
  }
  const dates = ledgerDates();
  const ledgerMax = dates.sort().pop() ?? null;
  if (ledgerMax && value > ledgerMax) {
    console.error(`拒绝：传入日期 ${value} 大于账本现有最大 release_date ${ledgerMax}。`);
    console.error("检查点锚点必须能在账本中兑现；请传本批实际入库的最大发布日期。");
    process.exit(1);
  }
  const prev = readCheckpoint() ?? {};
  writeFileSync(CHECKPOINT, JSON.stringify({
    last_scan_at: today(),
    last_max_release_date: value,
    _comment: "ingest-releases 技能的扫描检查点：last_max_release_date 是下次增量窗口的锚点（自动回退重叠天数）。由 checkpoint.mjs commit 维护，勿手改。",
  }, null, 2) + "\n", "utf-8");
  console.log(`[checkpoint] 已记录：last_scan_at=${today()} last_max_release_date=${value}`);
}

const [, , cmd, ...args] = process.argv;
if (cmd === "status") status();
else if (cmd === "commit") commit(args);
else {
  console.error("用法: checkpoint.mjs <status|commit --max-release-date YYYY-MM-DD>");
  process.exit(1);
}
