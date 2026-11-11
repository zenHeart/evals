/**
 * /choose/ 两模型对照的 HTML 渲染（构建期与浏览器共用，保证同构）。
 * 只负责展示；计算全部在 model-compare.mjs。
 */
import {esc} from './model-ui.mjs';

const fmt=v=>Number.isFinite(v)?(Math.round(v*10)/10).toFixed(1):'—';
const NEAR=1; // 0–100 刻度上差距小于 1 分视为接近：不高亮胜负
export function scoreText(e){return e?.display||(Number.isFinite(e?.value)?String(e.value):e?.score_status==='not_reported'?'官方未公布数值':'暂无可读数值');}
function settings(e){return [e.harness?'执行框架 '+e.harness:'',e.effort?'推理档位 '+e.effort:''].filter(Boolean).join(' · ');}
function scoreLink(m,e,rel,cls=''){
  const tip=[e.variant?'版本 '+e.variant:'',settings(e)].filter(Boolean).join(' · ');
  return `<a class="cv${cls}" href="${rel}models/${esc(m.release_id)}/#${esc(e.id)}"${tip?` title="${esc(tip)}"`:''}>${esc(scoreText(e))}</a>`;
}
/** 一侧的多条原始分数：逐行列出并标版本，避免数字挤在一起 */
function scoreList(m,rows,rel,cls=' raw'){
  if(!rows?.length)return '<span class="cx">未报告</span>';
  if(rows.length===1)return scoreLink(m,rows[0],rel,cls);
  return `<span class="cvs">${rows.map(e=>`<span>${scoreLink(m,e,rel,cls)}${e.variant?` <small>${esc(e.variant)}</small>`:''}</span>`).join('')}</span>`;
}
function benchCell(r,rel,extra=''){
  return `<div class="cl"><a class="cn" href="${rel}benchmarks/${esc(r.id)}/">${esc(r.name)}</a>${extra}</div>`;
}
/** 胜负状态：win / lose / near（接近）/ tie（相同） */
function side(diff,who){if(Math.abs(diff)<1e-9)return 'tie';if(Math.abs(diff)<NEAR)return 'near';return (diff>0)===(who==='a')?'win':'lose';}
function bar(n){return `<span class="cbar" aria-hidden="true"><i style="inline-size:${Math.max(0,Math.min(100,n)).toFixed(1)}%"></i></span>`;}

export function modelHead(m,rel){
  return m?`<a class="mh-name" href="${rel}models/${esc(m.release_id)}/#${esc(m.id)}">${esc(m.name)}</a><span class="mh-sub">${esc(m.vendor_label)}${m.release_date?' · '+esc(m.release_date):''}</span>`:'<span class="mh-name muted">未选择</span>';
}

/**
 * @param res  headToHead() 结果
 * @param A,B  模型
 * @param uc   领域 use-case
 */
export function compareHTML(res,A,B,uc,rel='../'){
  const c=res.composite;
  const nm=m=>esc(m.name);
  // ---- 结论区
  let verdict;
  if(c){
    const sa=side(c.diff,'a'),sb=side(c.diff,'b');
    const lead=c.winner?`<p class="vd-lead"><b>${nm(c.winner==='a'?A:B)}</b> 领先 ${fmt(Math.abs(c.diff))} 分</p>`:`<p class="vd-lead">两者<b>持平</b>（差距小于 0.1 分）</p>`;
    const one=`<a href="${rel}benchmarks/${esc(c.single?.id)}/">${esc(c.single?.name)}</a>`;
    const thin=!c.single?'':c.of===1?`<p class="vd-thin">这一领域目前只有 ${one} 可横向比较，综合分就等于这一项的得分，不代表全面能力。</p>`:`<p class="vd-thin">这两个模型在这一领域只有 ${one} 一项可以直接对照，综合分就等于这一项的得分，不代表全面能力。</p>`;
    verdict=`<div class="vd-row"><div class="vd-k">引用加权综合分<small>0–100，仅限${esc(uc.title||'本领域')}</small></div>
      <div class="vd-v ${sa}"><span class="big">${fmt(c.a)}</span></div><div class="vd-v ${sb}"><span class="big">${fmt(c.b)}</span></div></div>
      ${lead}<p class="vd-how">综合分按该领域评估在官方发布中被引用的次数加权；只计入双方都有、且可横向比较的评估。本次计入 <b>${c.n}</b> 项（该领域共 ${c.of} 项可比评估）。${c.equalWeights?'计入的评估都还没有官方引用记录，按等权计算。':''}</p>${thin}`;
  }else{
    verdict=`<div class="vd-row"><div class="vd-k">引用加权综合分</div><div class="vd-v na"><span class="big">—</span></div><div class="vd-v na"><span class="big">—</span></div></div>
      <p class="vd-lead"><b>无法综合对比</b></p><p class="vd-how">${esc(res.reason||'')}。缺少的分数不会按 0 计入，下面仍列出双方各自的原始分数。</p>`;
  }
  // ---- 可比评估
  const shared=res.shared.map(r=>{
    const sa=side(r.diff,'a'),sb=side(r.diff,'b');
    const set=[settings(r.a),settings(r.b)];
    const setNote=set.some(Boolean)&&set[0]!==set[1]?`<small class="cs">测试设置可能不同：${esc(set[0]||'未说明')} / ${esc(set[1]||'未说明')}</small>`:'';
    return `<li class="crow">${benchCell(r,rel,`<small class="cm">版本 ${esc(r.variant)} · 官方引用 ${r.cite} 次${c?` · 占综合分 ${Math.round(r.weight*100)}%`:''}</small>${setNote}`)}
      <div class="cc a ${sa}">${scoreLink(A,r.a,rel)}${bar(r.na)}</div><div class="cc b ${sb}">${scoreLink(B,r.b,rel)}${bar(r.nb)}</div></li>`;
  }).join('');
  // ---- 只有一方 / 口径不同
  const one=(r,who)=>`<li class="crow quiet">${benchCell(r,rel,`<small class="cm">仅 ${nm(who==='a'?A:B)} 有可比分数${r.reason?'；另一方：'+esc(r.reason):''}</small>`)}
      <div class="cc a">${scoreList(A,who==='a'?r.rows:r.other,rel,who==='a'?'':' raw')}</div>
      <div class="cc b">${scoreList(B,who==='b'?r.rows:r.other,rel,who==='b'?'':' raw')}</div></li>`;
  const raws=(r,note)=>`<li class="crow quiet">${benchCell(r,rel,note?`<small class="cm">${esc(note)}</small>`:'')}
      <div class="cc a">${scoreList(A,r.a,rel)}</div>
      <div class="cc b">${scoreList(B,r.b,rel)}</div></li>`;
  const single=[...res.onlyA.map(r=>one(r,'a')),...res.onlyB.map(r=>one(r,'b'))].join('');
  const mism=res.excluded.map(r=>raws(r,r.reason)).join('');
  const ref=res.reference.map(r=>raws(r,'')).join('');
  const sec=(id,title,hint,body,cls='')=>body?`<section class="csec${cls}" aria-labelledby="${id}"><h2 id="${id}">${title}</h2>${hint?`<p class="csec-hint">${hint}</p>`:''}<ul class="clist" role="list">${body}</ul></section>`:'';
  return `<section class="verdict" aria-label="综合结论">${verdict}</section>
  ${sec('cmp-shared',`可比评估 <span class="n">${res.shared.length}</span>`,'双方在同一评估、同一版本上都有官方自报分数；按官方引用次数从高到低排列。点分数看出处，点评估名看它测什么。',shared)}
  ${!res.shared.length?'<p class="csec-empty">这一领域里，两者没有同一版本、同一口径的共同评估。</p>':''}
  ${sec('cmp-one',`只有一方有分数 <span class="n">${res.onlyA.length+res.onlyB.length}</span>`,'不进入综合分：另一方没有可对照的同口径分数。',single,' sub')}
  ${sec('cmp-mism',`双方都有记录、但口径不同 <span class="n">${res.excluded.length}</span>`,'版本、测试设置或数值不一致，不能直接比大小，也不进入综合分。',mism,' sub')}
  ${ref?`<details class="csec sub ref" id="cmp-ref-wrap" open><summary><h2 id="cmp-ref">仅作参考 <span class="n">${res.reference.length}</span></h2></summary><p class="csec-hint">这些评估各家用的裁判、题目或口径不统一（含厂商内部评测），只列原始分数，不判胜负，也不进入综合分。</p><ul class="clist" role="list">${ref}</ul></details>`:''}`;
}

export const COMPARE_CSS=`
.choose-main{max-width:1040px}
.choose-main h1{margin:.2em 0 .3em}
.choose-lead{max-width:68ch;color:var(--graphite);margin:0 0 20px}
.picker{display:grid;gap:14px;margin:0 0 8px}
.choose-main fieldset.domain{border:0;border-radius:0;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.domain legend{float:left;margin-right:10px;font-weight:600;font-size:14px;color:var(--graphite);padding:0}
.domain label{display:inline-flex!important;align-items:center;gap:6px;padding:7px 14px;border:1px solid var(--rule);border-radius:999px;background:var(--card);cursor:pointer;font-size:15px}
.domain label:has(input:checked){border-color:var(--ink);background:var(--ink);color:var(--paper)}
.domain label:has(input:focus-visible){outline:2px solid var(--pin);outline-offset:2px}
.domain input{accent-color:var(--pin);margin:0}
.duo{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:end}
.cbx{position:relative;min-width:0}
.cbx label{display:block;font-size:13px;font-weight:600;color:var(--graphite);margin-bottom:4px}
.cbx .tag-a,.cbx .tag-b{display:inline-block;inline-size:9px;block-size:9px;border-radius:50%;margin-right:6px;vertical-align:1px}
.tag-a{background:var(--ink)}.tag-b{background:var(--pin)}
.cbx-field{display:flex;gap:6px}
.choose-main .cbx input{flex:1;min-width:0;width:100%;font-size:16px;padding:10px 12px;border-radius:8px}
.choose-main .cbx button.clr{flex:none;padding:0 12px;border-radius:8px;color:var(--graphite)}
.cbx [role=listbox]{position:absolute;z-index:30;inset-inline:0;top:100%;margin:4px 0 0;padding:4px;list-style:none;background:var(--card);border:1px solid var(--rule);border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.14);max-height:min(60vh,380px);overflow:auto}
.cbx [role=option]{padding:8px 10px;border-radius:6px;cursor:pointer;display:grid;grid-template-columns:1fr auto;gap:2px 10px}
.cbx [role=option] .o-n{font-weight:600}.cbx [role=option] .o-s{grid-column:1;font-size:12.5px;color:var(--graphite)}
.cbx [role=option] .o-c{grid-row:1/span 2;grid-column:2;align-self:center;font:12px/1 var(--mono);color:var(--graphite)}
.cbx [role=option] .o-c.has{color:var(--ok)}
.cbx [role=option][aria-selected=true],.cbx [role=option]:hover{background:var(--pin-soft)}
.cbx .o-empty{padding:10px;color:var(--graphite);font-size:14px}
.choose-main button.swap{block-size:44px;inline-size:44px;padding:0;border-radius:50%;font-size:18px;line-height:1}
.sr-only{position:absolute!important;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.cmp{margin-top:18px}
.cmp-grid,.vd-row,.crow{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr) minmax(0,1fr);column-gap:20px;align-items:center}
.cmp-head{position:sticky;top:56px;z-index:20;background:color-mix(in srgb,var(--paper) 94%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:2px solid var(--ink);padding:10px 0}
.cmp-head .mh{min-width:0;text-align:end;border-top:3px solid var(--ink);padding-top:6px}
.cmp-head .mh.b{border-top-color:var(--pin)}
.cmp-head .mh-k{font-size:12.5px;color:var(--graphite)}
.mh-name{display:block;font-weight:700;font-size:16px;line-height:1.3;text-decoration:none;overflow-wrap:anywhere}
.mh-sub{display:block;font-size:12.5px;color:var(--graphite)}
.cmp-head .tools{display:flex;gap:8px;flex-wrap:wrap}
.cmp-head .tools button{font-size:13px;padding:5px 10px;border-radius:6px}
.verdict{padding:22px 0 18px;border-bottom:1px solid var(--rule)}
.vd-k{font-weight:700;font-size:15px}.vd-k small{display:block;font-weight:400;color:var(--graphite);font-size:12.5px}
.vd-v{text-align:end;font-variant-numeric:tabular-nums}
.vd-v .big{font:700 clamp(38px,6vw,56px)/1 var(--serif);letter-spacing:-.01em;color:var(--graphite)}
.vd-v.win .big{color:var(--ok)}.vd-v.lose .big{color:var(--ink);opacity:.55}.vd-v.near .big,.vd-v.tie .big{color:var(--ink)}
.vd-v.na .big{color:var(--rule)}
.vd-lead{margin:14px 0 4px;font-size:17px}
.vd-how{margin:4px 0;color:var(--graphite);font-size:14px;max-width:75ch}
.vd-thin{margin:10px 0 0;padding:8px 12px;border-left:3px solid var(--warn);background:color-mix(in srgb,var(--warn) 8%,transparent);font-size:14px}
.csec{margin:26px 0 0}
.csec h2,.csec summary h2{font-size:17px;margin:0;display:inline}
.csec h2 .n{font:600 13px/1 var(--mono);color:var(--graphite);margin-left:6px}
.csec-hint{color:var(--graphite);font-size:13.5px;margin:6px 0 4px;max-width:75ch}
.csec-empty{color:var(--graphite);margin:18px 0 0}
.clist{list-style:none;margin:8px 0 0;padding:0;border-top:1px solid var(--rule)}
.crow{padding:12px 0;border-bottom:1px solid var(--rule)}
.cl{min-width:0}
.cn{font-weight:600;font-size:15.5px;text-decoration:none;overflow-wrap:anywhere}
.cl small{display:block;font-size:12.5px;color:var(--graphite);line-height:1.5}
.cl .cs{color:var(--warn)}
.cc{text-align:end;min-width:0;font-variant-numeric:tabular-nums}
.cv{font:600 17px/1.3 var(--mono);text-decoration:none;color:var(--ink);white-space:nowrap}
.cv.raw{font-weight:400;font-size:14.5px;color:var(--graphite)}
.cc.win .cv{color:var(--ok);font-weight:800}.cc.win .cv::after{content:" ▲";font-size:11px}
.cc.lose .cv{color:var(--graphite);font-weight:500}
.cbar{display:block;block-size:6px;margin-top:6px;background:color-mix(in srgb,var(--rule) 60%,transparent);border-radius:3px;overflow:hidden}
.cbar i{display:block;block-size:100%;border-radius:3px;background:color-mix(in srgb,var(--graphite) 45%,transparent)}
.cc.a.win .cbar i{background:var(--ink)}.cc.b.win .cbar i{background:var(--pin)}
.cx{color:var(--graphite);font-size:13px}
.cvs{display:flex;flex-direction:column;gap:2px;align-items:flex-end}.cvs small{font-size:11.5px;color:var(--graphite);overflow-wrap:anywhere}
.csec.sub .crow{padding:9px 0}.csec.sub .cn{font-weight:500;font-size:14.5px}.csec.sub h2{font-size:15.5px}
.ref summary{cursor:pointer;list-style-position:outside}
.ref summary::marker{color:var(--graphite)}
.cmp-empty{border:1px dashed var(--rule);border-radius:10px;padding:20px;margin:18px 0}
.cmp-empty h2{font-size:17px;margin:0 0 6px}
.sugg{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}
.sugg a{display:block;padding:10px 12px;border:1px solid var(--rule);border-radius:8px;text-decoration:none;background:var(--card)}
.sugg a:hover{border-color:var(--pin)}
.sugg small{display:block;color:var(--graphite);font-size:12.5px}
.method{margin:34px 0 0;border-top:1px solid var(--rule);padding-top:14px;color:var(--graphite);font-size:14px}
.method summary{cursor:pointer;font-weight:600;color:var(--ink)}
.method li{margin:4px 0}
@media (max-width:720px){
  .duo{grid-template-columns:1fr;gap:8px}
  .choose-main button.swap{justify-self:center;block-size:36px;inline-size:36px;transform:rotate(90deg)}
  .cmp-grid,.vd-row,.crow{grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:14px}
  .cmp-head{padding:8px 0}
  .cmp-head .tools{grid-column:1/-1;order:3;margin-top:6px}
  .cmp-head .mh{text-align:start}
  .mh-name{font-size:14.5px}.mh-sub{display:none}
  .vd-k,.cl{grid-column:1/-1}
  .vd-k{margin-bottom:8px}
  .vd-v,.cc{text-align:start}
  .cvs{align-items:flex-start}
  .vd-v .big{font-size:44px}
  .cl{margin-bottom:6px}
  .cv{font-size:16px}
}
`;
