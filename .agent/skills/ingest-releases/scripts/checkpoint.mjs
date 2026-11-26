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
 *   - 窗口数学与 commit 计划是纯函数（computeWindow / planCommit），CLI 只做文件
 *     读写；导入本模块不会执行任何命令（tests/release-ingest.test.mjs 依赖这一点）。
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd());
const RELEASES_DIR = join(ROOT, "data", "model-releases", "official");
const CHECKPOINT = join(ROOT, "data", "generated", "ingest-checkpoint.json");
const COVERAGE = join(ROOT, "data", "model-coverage.json");
const OVERLAP_DAYS = 14;
const FIRST_RUN_FALLBACK_DAYS = 90;
export { OVERLAP_DAYS, FIRST_RUN_FALLBACK_DAYS };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function daysAgo(isoDate, days) {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/** 递归收集 official/ 下全部 release JSON 的 release_date（排除 manifest 等） */
export function ledgerDates(dir = RELEASES_DIR, out = []) {
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
export function ledgerFileCount(dir = RELEASES_DIR, n = 0) {
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

/**
 * 本次扫描应使用的增量窗口。纯函数：调用方负责提供账本日期、文件数与检查点。
 * 锚点优先级 = 检查点 last_max_release_date > 账本最大 release_date > 首次运行回退。
 */
export function computeWindow({ today, dates = [], count = dates.length, checkpoint = null }) {
  const ledgerMax = dates.length ? [...dates].sort().pop() : null;
  const cpAnchor = checkpoint?.last_max_release_date && ISO_DATE.test(checkpoint.last_max_release_date)
    ? checkpoint.last_max_release_date
    : null;
  const anchor = cpAnchor || ledgerMax;
  const firstRun = !anchor;
  return {
    today,
    last_scan_at: checkpoint?.last_scan_at ?? null,
    ledger_max_release_date: ledgerMax,
    official_release_count: count,
    window_since: firstRun ? daysAgo(today, FIRST_RUN_FALLBACK_DAYS) : daysAgo(anchor, OVERLAP_DAYS),
    window_until: today,
    overlap_days: OVERLAP_DAYS,
    first_run: firstRun,
    note: firstRun
      ? `账本与检查点均无日期锚点——首次运行按近 ${FIRST_RUN_FALLBACK_DAYS} 天窗口扫描`
      : `窗口 = 检查点锚点 ${anchor} 回退 ${OVERLAP_DAYS} 天重叠`,
  };
}

/**
 * commit 的落账计划（纯函数，不做任何 IO）。锚点单调不回退：取新值与旧锚点的较大者，
 * 免得某批入库量偏小就把窗口起点往前推、漏掉之后几天。校验失败抛 Error，由 CLI 转成
 *  stderr + exit 1。
 */
export function planCommit({ value, ledgerMax, prev = {}, today }) {
  if (!value || !ISO_DATE.test(value)) {
    throw new Error("用法: checkpoint.mjs commit --max-release-date YYYY-MM-DD\n--max-release-date = 本批入库中见到的最大官方发布日期（不是今天）。");
  }
  if (ledgerMax && value > ledgerMax) {
    throw new Error(`拒绝：传入日期 ${value} 大于账本现有最大 release_date ${ledgerMax}。\n检查点锚点必须能在账本中兑现；请传本批实际入库的最大发布日期。`);
  }
  const prevAnchor = prev?.last_max_release_date && ISO_DATE.test(prev.last_max_release_date)
    ? prev.last_max_release_date
    : null;
  const anchor = [value, prevAnchor].filter(Boolean).sort().pop() ?? null;
  return {
    checkpoint: {
      last_scan_at: today,
      last_max_release_date: anchor,
      _comment: "ingest-releases 技能的扫描检查点：last_max_release_date 是下次增量窗口的锚点（自动回退重叠天数）。由 checkpoint.mjs commit 维护，勿手改。",
    },
    coverage: {
      window_since: anchor ? daysAgo(anchor, OVERLAP_DAYS) : daysAgo(today, FIRST_RUN_FALLBACK_DAYS),
      window_until: today,
    },
  };
}

function status() {
  console.log(JSON.stringify(computeWindow({
    today: today(),
    dates: ledgerDates(),
    count: ledgerFileCount(),
    checkpoint: readCheckpoint(),
  }), null, 2));
}

function commit(args) {
  const flag = args.indexOf("--max-release-date");
  const value = flag >= 0 ? args[flag + 1] : null;
  const now = today();
  let plan;
  try {
    plan = planCommit({ value, ledgerMax: ledgerDates().sort().pop() ?? null, prev: readCheckpoint() ?? {}, today: now });
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  writeFileSync(CHECKPOINT, JSON.stringify(plan.checkpoint, null, 2) + "\n", "utf-8");
  console.log(`[checkpoint] 已记录：last_scan_at=${now} last_max_release_date=${plan.checkpoint.last_max_release_date}`);

  // 同步覆盖页的展示窗口（data/model-coverage.json 的 window_since / window_until 是
  // 手写型元数据，没有任何脚本自动写入——漏写就会让覆盖页长期显示上一批的窗口）。
  // 这里按与 status() 完全相同的口径落账：起点 = 锚点回退 OVERLAP_DAYS，终点 = 今天。
  if (existsSync(COVERAGE)) {
    const cov = JSON.parse(readFileSync(COVERAGE, "utf-8"));
    cov.last_scan_at = new Date().toISOString();
    cov.window_since = plan.coverage.window_since;
    cov.window_until = plan.coverage.window_until;
    writeFileSync(COVERAGE, JSON.stringify(cov, null, 2) + "\n", "utf-8");
    console.log(`[checkpoint] 已同步覆盖页窗口：window_since=${cov.window_since} window_until=${cov.window_until}`);
  }
}

// 仅当作为 CLI 直接调用时才执行；被 import（如测试）时不产生任何副作用。
const invokedAsCli = process.argv[1]?.replace(/\\/g, "/").endsWith("/checkpoint.mjs");
if (invokedAsCli) {
  const [, , cmd, ...args] = process.argv;
  if (cmd === "status") status();
  else if (cmd === "commit") commit(args);
  else {
    console.error("用法: checkpoint.mjs <status|commit --max-release-date YYYY-MM-DD>");
    process.exit(1);
  }
}
