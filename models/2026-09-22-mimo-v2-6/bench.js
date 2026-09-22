/*
 * MiMo-V2.6 — benchmark overview + appendix table.
 *
 * Overview: sections of small bar charts, one card per benchmark, one bar
 * per model, sorted by score. Our models are vermilion; everyone else is
 * warm grey. A model with no result on a benchmark gets no bar there.
 *
 * Appendix: one table, rows grouped by section, one column per model. It
 * carries every benchmark in the source sheet except the four the editors
 * dropped, so it has rows the cards do not. Best score per row in bold;
 * "-" = no result. `cards: false` keeps a model or a benchmark out of
 * the bar charts, a benchmark's `hide` lists model keys left out of its card
 * only, `table: false` keeps a model out of the table; the data is shared.
 * A section with `joinPrev` shares one card row with the section before it
 * (each card then carries its section name as an eyebrow); the table still
 * groups them separately.
 *
 * Data: V26 Benchmark 主表 (mi.feishu.cn/wiki/IN4dwuyZOih57FkZazJc59q9nYg),
 * snapshot 2026-09-22. `null` = no result.
 */
(() => {
    'use strict';

    // `lines` = how the name breaks in the table header
    const MODELS = [
        { key: 'pro',    name: 'MiMo-V2.6-Pro',     lines: ['MiMo-V2.6', 'Pro'],       ours: true, tone: 'pro' },
        { key: 'flash',  name: 'MiMo-V2.6-Flash',   lines: ['MiMo-V2.6', 'Flash'],     ours: true, tone: 'flash' },
        { key: 'v25',    name: 'MiMo-V2.5-Pro',     lines: ['MiMo-V2.5', 'Pro'] },
        { key: 'ds',     name: 'DeepSeek V4.1 Flash', lines: ['DeepSeek', 'V4.1 Flash'] },
        { key: 'k3',     name: 'Kimi K3',           lines: ['Kimi K3'],                cards: false },
        { key: 'opus',   name: 'Claude Opus 5',     lines: ['Claude', 'Opus 5'] },
        { key: 'sol',    name: 'GPT 5.6 Sol',       lines: ['GPT 5.6', 'Sol'] },
        { key: 'fable5', name: 'Claude Fable 5',    lines: ['Claude', 'Fable 5'] },
        { key: 'astra',  name: 'GPT 6 Astra',       lines: ['GPT 6', 'Astra'] },
        { key: 'fable',  name: 'Claude Fable 5.1',  lines: ['Claude', 'Fable 5.1'] },
        { key: 'glm',    name: 'GLM 5.3',           lines: ['GLM 5.3'],                table: false },
    ];
    // scores in MODELS order: [pro, flash, v25, ds, k3, opus, sol, fable5, astra, fable, glm]
    const SECTIONS = [
        { title: 'Coding', benchmarks: [
            { name: 'DeepSWE v1.1',       scores: [71.9, 67.9, 19.0, 74.2, 69.0, 74.0, null, 70.0, 74.0, null, null] },
            { name: 'ProgramBench',       scores: [26.5, 26.0, 12.5, 20.3, 24.5, 37.0, 25.0, 33.0, null, null, null] },
            { name: 'MiMo Code Bench',    scores: [63.2, 61.2, 40.4, 60.2, 60.1, 68.6, 59.3, null, 61.4, null, null], note: 'in-house' },
        ] },
        { title: 'General', benchmarks: [
            { name: 'GDPVal 2.1 (AA)',    scores: [1673, null, 1107, 1600, 1524, 1708, 1588, 1595, 1542, 1735, null], unit: 'elo', floor: 1000 },
            { name: 'Toolathlon-verified', scores: [76.9, 73.6, 49.1, null, 76.5, 80.6, 74.9, 77.9, null, 77.8, null] },
            { name: 'Automation Bench v1.0.6',   scores: [53.1, 52.3, 16.0, 54.8, 46.7, 50.3, 45.8, 46.2, 52.0, null, null] },
            { name: "Agents' Last Exam",  scores: [31.6, 27.6, 13.2, 31.8, 28.3, 31.6, 30.8, 25.7, 34.2, null, null], hide: ['sol'] },
            { name: 'Terminal Bench 4.0', scores: [34.9, 28.8, 1.5, 26.8, 12.6, 49.0, 39.9, 42.4, 59.6, 55.1, null], hide: ['sol', 'fable5'] },
            { name: 'Terminal Bench 2.1', scores: [89.9, 87.6, 65.2, 90.6, 88.3, 89.1, 88.8, 84.3, 89.9, 91.4, null], cards: false },
            { name: 'OSWorld-Verified',   scores: [82.0, 80.8, null, null, 84.8, 83.4, 83.0, 86.0, null, null, null], cards: false },
            { name: 'JobBench',           scores: [62.0, 61.2, 25.0, 45.8, 54.3, 65.7, 45.4, 57.4, null, null, null] },
        ] },
        { title: 'Visual', benchmarks: [
            { name: 'MiMo Visual Coding', scores: [72.3, 71.5, null, 70.6, 70.3, 70.0, 73.4, 69.1, 82.2, 74.4, null], note: 'in-house', hide: ['sol', 'fable5'] },
        ] },
        { title: 'Cyber', joinPrev: true, benchmarks: [
            { name: 'CyberGym',           scores: [94.0, 95.1, 40.0, 88.1, 80.0, null, null, null, null, null, 84.5] },
            { name: 'ExploitGym',         scores: [17.8, 6.0, 0.1, 15.3, 8.1, 22.1, 30.3, 28.4, 42.4, 30.4, null], hide: ['ds', 'sol', 'fable5'] },
            { name: 'ExploitBench',       scores: [47.9, 25.3, 16.6, null, 32.2, 70.0, 78.5, 78.0, 100.0, 83.0, null], cards: false },
            { name: 'SEC Bench Pro',      scores: [66.3, 47.5, 17.7, 62.8, null, null, 79.1, null, 85.4, null, null], cards: false },
            { name: 'MiMo Cyber Bench',   scores: [81.7, 77.2, 0.0, 62.7, 56.3, null, null, null, null, null, null], note: 'in-house', cards: false },
        ] },
    ];

    const fmt = (v, unit) => unit === 'elo' ? String(Math.round(v)) : v.toFixed(1);
    const label = (b) => `${b.name}${b.note ? ` <em>${b.note}</em>` : ''}`;

    function renderCards(root) {
        root.innerHTML = '';
        const groups = [];
        for (const sec of SECTIONS) {
            if (sec.joinPrev && groups.length) groups[groups.length - 1].push(sec);
            else groups.push([sec]);
        }
        for (const group of groups) {
            const joined = group.length > 1;
            const section = document.createElement('section');
            section.className = 'bench-section' + (joined ? ' joined' : '');
            section.innerHTML = (joined ? '' : `<header class="bench-head"><h3>${group[0].title}</h3></header>`) + '<div class="bench-grid"></div>';
            const grid = section.querySelector('.bench-grid');
            for (const sec of group) {
                let first = true;
                for (const b of sec.benchmarks) {
                    if (b.cards === false) continue;
                    const rows = MODELS.map((m, i) => ({ m, v: b.scores[i] }))
                        .filter((r) => r.m.cards !== false && r.v != null && !(b.hide || []).includes(r.m.key))
                        .sort((a, c) => c.v - a.v);
                    const floor = b.floor || 0;
                    const max = Math.max(...rows.map((r) => r.v));
                    const card = document.createElement('div');
                    card.className = 'bench-card' + (joined && sec === group[0] ? ' lead' : '');
                    card.innerHTML = (joined ? `<h3 class="bench-eyebrow">${first ? sec.title : ''}</h3>` : '') +
                        `<div class="bench-name">${label(b)}</div>`;
                    for (const r of rows) {
                        const pct = Math.max(2, (r.v - floor) / (max - floor) * 100);
                        const row = document.createElement('div');
                        row.className = 'bench-row' + (r.m.ours ? ` ours ${r.m.tone}` : '');
                        row.innerHTML =
                            `<span class="bench-model">${r.m.name}</span>` +
                            `<span class="bench-track"><span class="bench-bar" style="width:${pct.toFixed(1)}%"></span></span>` +
                            `<span class="bench-value">${fmt(r.v, b.unit)}</span>`;
                        card.appendChild(row);
                    }
                    grid.appendChild(card);
                    first = false;
                }
            }
            root.appendChild(section);
        }
    }

    function renderTable(root) {
        const cols = MODELS.map((m, i) => ({ m, i })).filter(({ m }) => m.table !== false);
        const head = cols.map(({ m }) =>
            `<th class="bt-model${m.ours ? ' ours' : ''}">${m.lines.join('<br>')}</th>`).join('');
        let body = '';
        for (const sec of SECTIONS) {
            body += `<tr class="bt-sec"><th>${sec.title}</th><td colspan="${cols.length}"></td></tr>`;
            for (const b of sec.benchmarks) {
                const vals = cols.map(({ i }) => b.scores[i]);
                const best = Math.max(...vals.filter((v) => v != null));
                body += `<tr><th class="bt-name">${label(b)}</th>`;
                cols.forEach(({ m, i }) => {
                    const v = b.scores[i];
                    const cls = [m.ours ? 'ours' : '', v === best ? 'best' : '', v == null ? 'na' : ''].filter(Boolean).join(' ');
                    body += `<td${cls ? ` class="${cls}"` : ''}>${v == null ? '-' : fmt(v, b.unit)}</td>`;
                });
                body += '</tr>';
            }
        }
        root.innerHTML = `<table class="bt-table"><thead><tr><th></th>${head}</tr></thead><tbody>${body}</tbody></table>`;
    }

    document.querySelectorAll('[data-bench]').forEach(renderCards);
    document.querySelectorAll('[data-bench-table]').forEach(renderTable);
})();
