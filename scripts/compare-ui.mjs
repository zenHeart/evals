/**
 * /choose/ 两模型对照的 HTML 渲染（构建期与浏览器共用，保证同构）。
 * 只负责展示；计算全部在 model-compare.mjs。
 */
import {esc} from './model-ui.mjs';
import {isPending,excludedText} from './model-compare.mjs';
import {fairVerdict,domainCtx,HOME_MIN_ROWS} from './fair-compare.mjs';
export {excludedText};

const fmt=v=>Number.isFinite(v)?(Math.round(v*10)/10).toFixed(1):'—';
const pct=p=>Math.round(p*100);
/** 把握的说法：四舍五入会把 99.6% 写成「约 100%」，这里最多写到「超过 99%」 */
const pctText=p=>p>=0.995?'超过 99%':`约 ${pct(p)}%`;
const fmt0=v=>Number.isFinite(v)?String(Math.round(v)):'—';
const NEAR=1; // 0–100 刻度上差距小于 1 分视为接近：不高亮胜负
export const PENDING_TIP='官方配图尚未转录出数值';
/** 对照表里的分数文字：只有官方公布的数值才显示数字，其余一律「-」 */
export function scoreText(e){return !e||isPending(e)?'-':(e.display||String(e.value));}
function pendingTip(e){return e?.score_status==='not_reported'?'官方未公布数值':PENDING_TIP;}
function settings(e){return [e.harness?'执行框架 '+e.harness:'',e.effort?'推理档位 '+e.effort:''].filter(Boolean).join(' · ');}
function scoreLink(m,e,rel,cls=''){
  const pend=isPending(e);
  const tip=pend?pendingTip(e):[e.variant?'版本 '+e.variant:'',settings(e)].filter(Boolean).join(' · ');
  return `<a class="cv${cls}${pend?' dash':''}" href="${rel}models/${esc(m.release_id)}/#${esc(e.id)}"${tip?` title="${esc(tip)}"`:''}>${esc(scoreText(e))}</a>`;
}
/** 一侧的多条原始分数：逐行列出并标版本；待转录的写「-」并附「尚未转录」 */
function scoreList(m,rows,rel,cls=' raw'){
  if(!rows?.length)return '<span class="cx" title="没有这项评估的记录">-</span>';
  const one=e=>`${scoreLink(m,e,rel,cls)}${isPending(e)?' <small class="cq">尚未转录</small>':''}`;
  if(rows.length===1)return `<span class="cvs">${one(rows[0])}</span>`;
  return `<span class="cvs">${rows.map(e=>`<span>${one(e)}${e.variant?` <small>${esc(e.variant)}</small>`:''}</span>`).join('')}</span>`;
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

/** 可计分评估一侧的单元格 */
function cell(m,s,r,who,rel){
  const cls=r.winner?(r.winner===who?' win':' lose'):'';
  if(s.state==='value')return `<div class="cc ${who}${cls}">${scoreLink(m,s.row,rel)}${bar(s.n)}</div>`;
  const t=r.table?.hits?.[0]?.[who];
  if(s.state==='missing'&&t){
    const h=r.table.hits[0];
    return `<div class="cc ${who}"><a class="cv tb" href="${rel}models/${esc(h.rel)}/" title="${esc(h.byLabel+' 发布页同一张表里的数值，不是该模型厂商的自报'+(t.settings?' · '+t.settings:''))}">${esc(t.display)}</a>${bar(t.n)}<small class="cq">同表 · ${esc(h.byLabel)}</small></div>`;
  }
  if(s.state==='missing')return `<div class="cc ${who}"><span class="cx" title="没有这项评估的记录">-</span><small class="cq">${r.status==='scored'?'未报告 · 不计分':'未报告'}</small></div>`;
  return `<div class="cc ${who}">${scoreList(m,s.rows,rel,s.state==='other'?' raw':'')}</div>`;
}

/**
 * @param res  headToHead() 结果
 * @param A,B  模型
 * @param uc   领域（{title, catalog}）
 */
export function compareHTML(res,A,B,uc,rel='../',opt={}){
  const c=res.composite;
  const nm=m=>esc(m.name);
  const title=esc(uc.title||'本领域');
  const v=c?fairVerdict(res,{sizes:opt.sizes,...domainCtx(uc),A,B,tables:opt.tables}):null;
  res.verdict=v;
  // ---- 结论区：同题对照是主结论；全库估计只作参考；覆盖面单列（没报告不等于 0 分）
  let verdict;
  if(v){
    const who=w=>w==='a'?nm(A):nm(B);
    const L=v.leader;
    const sideCls=w=>!L?'tie':L===w?'win':'lose';
    const confText={high:'高',medium:'中',low:'低',none:'—'}[v.confidence];
    const basisText=[v.k?`${v.k} 项共同评估`:'',v.kt?`${v.kt} 项发布页同表数据（按半项计）`:''].filter(Boolean).join('、');
    const confWhy=v.homeOnly?`只有发布页同表数据，且发布方就是其中一方`:v.k+v.kt*0.5<3?`只有 ${basisText}，证据单薄`:basisText;
    const reporters=[...new Set(v.tabled.flatMap(r=>r.table.hits.map(h=>h.byLabel)))];
    const tText=L=>L?`${who(L)} 领先 ${L==='a'?v.twins:v.tlosses} 项、落后 ${L==='a'?v.tlosses:v.twins} 项`:`${nm(A)} 领先 ${v.twins} 项、${nm(B)} 领先 ${v.tlosses} 项`;
    let lead,how='';
    const winText=L?`在 ${v.k} 项共同评估上 ${who(L)} 领先 ${L==='a'?v.wins:v.losses} 项、落后 ${L==='a'?v.losses:v.wins} 项${v.ties?`、持平 ${v.ties} 项`:''}`:`在 ${v.k} 项共同评估上 ${nm(A)} 领先 ${v.wins} 项、${nm(B)} 领先 ${v.losses} 项${v.ties?`、持平 ${v.ties} 项`:''}`;
    const clear=v.clearWins+v.clearLosses;
    if(v.k){
      const gap=Math.abs(v.meanGap);
      const p=L?(L==='a'?v.pA:1-v.pA):Math.max(v.pA,1-v.pA);
      if(v.level==='clear')lead=`<b>${who(L)}</b> 明显领先`;
      else if(v.level==='lean')lead=`<b>${who(L)}</b> 略占优`;
      else lead='两者<b>难分高下</b>';
      how=`${winText}，按评估重要性加权平均${L?'高':'相差'} ${fmt(gap)} 分。`
        +(clear?`其中 ${clear} 项的差距超出题量误差；`:'每一项的差距都在题量误差范围内，单看一项不足以定胜负；')
        +(v.kt?`另有 ${v.kt} 项双方没有都自报、但 ${reporters.map(esc).join('、')} 的发布页在同一张表里列出了两者（${tText(L)}），按半权一并计入；`:'')
        +(L?`把各项合并后，${who(L)} 更强的把握${pctText(p)}。`:`合并后哪一方更强的把握都不到 ${pct(0.84)}%。`);
    }else if(v.kt){
      const p=L?(L==='a'?v.pA:1-v.pA):Math.max(v.pA,1-v.pA);
      lead=L?`按发布页同表数据，<b>${who(L)}</b> 略占优`:v.homeThin?'两者<b>难分高下</b>（只有发布方自家表格的 1 项数据，仅作参考）':'按发布页同表数据，两者<b>难分高下</b>';
      how=`两者在${title}没有各自都报告、且版本与测试条件一致的评估。${reporters.map(esc).join('、')} 的发布页在同一张表里同时列出了两者 ${v.kt} 项评估的分数（同一发布方、同一套设置），${tText(L)}。这些数值由发布方给出，不是被比较厂商自己的报告，按半权计入，只靠它最多判「略占优」${v.homeOnly?'；发布方本身就是其中一方，可能偏向自家':''}。`
        +(v.homeThin?`只有发布方自家的一张表、${v.kt} 项评估，不足 ${HOME_MIN_ROWS} 项独立数据，不据此判高下，上面的数值仅作参考。`
          :L?`合并后 ${who(L)} 更强的把握${pctText(p)}。`:`合并后哪一方更强的把握都不到 ${pct(0.84)}%。`);
    }else if(v.level==='indirect'){
      const p=L==='a'?v.estimate.pA:1-v.estimate.pA;
      lead=`没有共同评估；间接估计 <b>${who(L)}</b> 可能更强`;
      how=`两者在${title}没有都做过、且版本与测试条件一致的评估，无法同题对照。下面的全库能力估计借其他模型的成绩把不同评估对齐后推断，${who(L)} 更强的把握${pctText(p)}——这是间接推断，请结合逐项分数判断。`;
    }else{
      lead='<b>数据不足</b>，无法判断高下';
      const why=!v.estimate?'':v.estimate.reference?'；本领域的全库能力估计仅供参考，不据此做间接推断':!v.estimate.enough?'；至少一方能和其他模型对齐的评估不足 2 项，也不做间接推断':'，全库能力估计的区间也大幅重叠';
      how=`两者在${title}没有都做过、且版本与测试条件一致的评估${why}。下面仍列出各自的原始分数。`;
    }
    const big=(x,w)=>`<div class="vd-v ${sideCls(w)}"><span class="big">${fmt(x)}</span></div>`;
    const shared=v.k?`<div class="vd-row"><div class="vd-k">同题对照<small>${v.k} 项双方都有的评估 · 加权均分</small></div>${big(v.meanA,'a')}${big(v.meanB,'b')}</div>`
      :v.kt?`<div class="vd-row"><div class="vd-k">同表对照<small>${v.kt} 项发布页同一张表里的数值 · 加权均分</small></div>${big(v.tMeanA,'a')}${big(v.tMeanB,'b')}</div>`
      :`<div class="vd-row"><div class="vd-k">同题对照<small>没有双方都有的评估</small></div><div class="vd-v na"><span class="big">—</span></div><div class="vd-v na"><span class="big">—</span></div></div>`;
    const e=v.estimate;
    const estCell=x=>x?`<div class="vd-v est"><span class="mid">${fmt0(x.idx)}</span><small>区间 ${fmt0(x.lo)}–${fmt0(x.hi)}${x.n<2?' · 只依据 1 项':''}</small></div>`:'<div class="vd-v est na"><span class="mid">—</span><small>数据不足</small></div>';
    const ea=uc.est?.[A.key],eb=uc.est?.[B.key];
    const refWhy={unvalidated:`${title}没有可用来校验的外部综合榜单`,thin:`${title}大多数模型只有 1 项可对齐的评估`}[v.estReference];
    const refNote=refWhy?`<p class="vd-ref"><b>仅供参考</b>：${refWhy}，这里的全库能力估计无法验证准不准，只作参考展示，不据此判断高下。</p>`:'';
    const estRow=uc.est&&Object.keys(uc.est).length?`<div class="vd-row est"><div class="vd-k">全库能力估计<small>0–100 · 95% 区间 · ${refWhy?'<b>仅供参考</b>':'仅作参考'}</small></div>${estCell(ea)}${estCell(eb)}</div>${refNote}
      <p class="vd-how">用${title}${uc.estMeta?.models?` ${uc.estMeta.models} 个模型`:'全部模型'}的可计分分数，按每项评估的难度对齐后估计（与 Epoch AI 能力指数同一类方法），可以推断「没报告的评估大概会考多少」。报告的评估越少，区间越宽${v.k?'；它不改变上面的同题对照结论':''}。</p>`
      :`<p class="vd-how">${title}公开分数太少、模型之间重叠太少，暂不提供全库能力估计。</p>`;
    const only=(list,m)=>list.length?`${nm(m)} 另有 ${list.length} 项（${list.slice(0,4).map(r=>esc(r.name)).join('、')}${list.length>4?' 等':''}）`:'';
    // 已经靠同表数据补上对照的评估不再写成「只有自己报告」
    const ones=[only(v.onlyA.filter(r=>!r.table),A),only(v.onlyB.filter(r=>!r.table),B)].filter(Boolean);
    const cov=`<p class="vd-cov"><b>覆盖面</b>：${nm(A)} 有分 ${v.hasA} 项，${nm(B)} 有分 ${v.hasB} 项，双方都有 ${v.k} 项${v.kt?`，另有 ${v.kt} 项靠发布页同表数据补上对照`:''}。${ones.length?ones.join('，')+'只有自己报告，不参与胜负——没报告不等于 0 分；厂商通常优先公布自己占优的评估，单方面的分数只说明它做过这项。':''}${c.excluded?`另有 ${c.excluded} 项这组对照里不计入：${excludedText(c.excludedBy)}。`:''}</p>`;
    const names=c.of<=3?res.rows.map(r=>`<a href="${rel}benchmarks/${esc(r.id)}/">${esc(r.name)}</a>`).join('、'):'';
    const thin=c.of<=3?`<p class="vd-thin">${title}目前只有 ${names}${c.of>1?` 这 ${c.of} 项`:''} 能换算成 0–100 分，结论只反映${c.of>1?'这几项':'这一项'}，不代表全面能力。</p>`:'';
    verdict=`${shared}<p class="vd-lead">${lead}</p><p class="vd-how">${how}${v.k||v.kt?` 可信度：<b>${confText}</b>（${confWhy}）。`:''}</p>${estRow}${cov}${thin}`;
  }else{
    verdict=`<div class="vd-row"><div class="vd-k">同题对照</div><div class="vd-v na"><span class="big">—</span></div><div class="vd-v na"><span class="big">—</span></div></div>
      <p class="vd-lead"><b>无法对比</b></p><p class="vd-how">${esc(res.reason||'')}。下面仍列出双方各自的原始分数。</p>`;
  }
  // ---- 可计分评估：至少一方有记录的逐项列出；双方都没有记录的收进一个折叠区
  const meta=r=>{
    // 显示官方原文写法，不显示内部配对用的归一化键
    const raws=[...new Set([r.a?.row?.variant,r.b?.row?.variant].filter(Boolean))];
    const bits=[raws.length?'版本 '+esc(raws.join(' / ')):'','官方引用 '+r.cite+' 次'];
    if(r.gap)bits.push(`差 ${fmt(Math.abs(r.gap.d))} 分 · 误差约 ±${fmt(1.96*r.gap.se)}（${r.gap.known?r.gap.n+' 题':'题量未登记，按 '+r.gap.n+' 题估'}）${r.gap.clear?'':' · 在误差内'}`);
    let extra='';
    if(r.table){
      const hs=r.table.hits;
      extra+=`<small class="cs tbl">同表对照（半权${hs.length>1?`，${hs.length} 张表平分`:''}）：${hs.map(h=>`<a href="${rel}models/${esc(h.rel)}/">${esc(h.byLabel)} 发布页</a> ${esc(h.a.display)}${h.a.settings?'（'+esc(h.a.settings)+'）':''} 对 ${esc(h.b.display)}${h.b.settings?'（'+esc(h.b.settings)+'）':''} · 差 ${fmt(Math.abs(h.d))} 分 · 误差约 ±${fmt(1.96*h.se)}${Math.abs(h.z)>=1.96?'':' · 在误差内'}`).join('；')}</small>`;
    }
    if(r.alts?.length){
      extra+=`<small class="cs alt">另见：${r.alts.map(x=>`<a href="${rel}models/${esc(x.rel)}/">${esc(x.byLabel)} 发布页</a>同表记 ${esc(x.who==='a'?A.name:B.name)} ${esc(x.display)}${x.settings?'（'+esc(x.settings)+'）':''}${x.nc?`（${esc(x.nc)}，不计入）`:x.differs?'（与自报不同，以自报为准）':''}`).join('；')}</small>`;
    }
    if(r.tref?.length){
      extra+=`<small class="cs alt">同表数据（${title}的发布页同表数据只作参考，不计入胜负）：${r.tref.map(h=>`<a href="${rel}models/${esc(h.rel)}/">${esc(h.byLabel)} 发布页</a> ${esc(h.a.display)}${h.a.settings?'（'+esc(h.a.settings)+'）':''} 对 ${esc(h.b.display)}${h.b.settings?'（'+esc(h.b.settings)+'）':''}`).join('；')}</small>`;
    }
    if(r.status==='excluded')extra=`<small class="cs">${r.table?'自报分数不计入这组对照':'不计入这组对照'}：${esc(r.reason||'')}</small>`+extra;
    else if(r.a.state==='value'&&r.b.state==='value'){const set=[settings(r.a.row),settings(r.b.row)];if(set.some(Boolean)&&set[0]!==set[1])extra=`<small class="cs">测试设置可能不同：${esc(set[0]||'未说明')} / ${esc(set[1]||'未说明')}</small>`+extra;}
    return `<small class="cm">${bits.filter(Boolean).join(' · ')}</small>${extra}`;
  };
  const shown=res.rows.filter(r=>!(r.a.state==='missing'&&r.b.state==='missing'));
  const empty=res.rows.filter(r=>r.a.state==='missing'&&r.b.state==='missing');
  const rowHTML=r=>`<li class="crow${r.status==='excluded'?' quiet':''}">${benchCell(r,rel,meta(r))}${cell(A,r.a,r,'a',rel)}${cell(B,r.b,r,'b',rel)}</li>`;
  const main=shown.map(rowHTML).join('');
  const emptyList=empty.length?`<details class="cempty"><summary>两者都没有记录的 ${empty.length} 项</summary><ul class="cnames" role="list">${empty.map(r=>`<li><a href="${rel}benchmarks/${esc(r.id)}/">${esc(r.name)}</a> <small>引用 ${r.cite} 次</small></li>`).join('')}</ul></details>`:'';
  // ---- 仅作参考
  const raws=r=>`<li class="crow quiet">${benchCell(r,rel,`<small class="cm">官方引用 ${r.cite} 次</small>`)}
      <div class="cc a">${scoreList(A,r.a,rel)}</div>
      <div class="cc b">${scoreList(B,r.b,rel)}</div></li>`;
  const ref=res.reference.map(raws).join('');
  const refRest=res.referenceEmpty?`<p class="csec-hint">另有 ${res.referenceEmpty} 项本领域的参考评估两者都没有记录。</p>`:'';
  return `<section class="verdict" aria-label="综合结论">${verdict}</section>
  <section class="csec" aria-labelledby="cmp-scored"><h2 id="cmp-scored">可计分评估 <span class="n">${res.rows.length}</span></h2>
  <p class="csec-hint">${title}里能换算成 0–100 分的评估，按官方引用次数从高到低排列。「-」表示没有官方数值：没有报告的不计分，也不按 0 分算；官方配图里尚未转录的同样不计入这组对照。只有双方都有、版本与测试条件一致的评估才比胜负，每项都标出题量误差；一方没有自报、但某篇官方发布页在同一张表里同时列出了两者时，用这一行补上对照（标「同表」，按半权计）。点分数看出处，点评估名看它测什么。</p>
  ${res.rows.length?`<ul class="clist" role="list">${main}</ul>${emptyList}`:'<p class="csec-empty">这一领域还没有能换算成 0–100 分的评估。</p>'}</section>
  ${ref||refRest?`<details class="csec sub ref" id="cmp-ref-wrap" open><summary><h2 id="cmp-ref">仅作参考 <span class="n">${res.reference.length}</span></h2></summary><p class="csec-hint">这些评估属于${title}，但没有可靠的 0–100 换算（含厂商内部评测、Elo 或胜率这类相对读数），只列原始分数，不判胜负，也不进入同题对照（不按 0 计）。</p>${ref?`<ul class="clist" role="list">${ref}</ul>`:''}${refRest}</details>`:''}`;
}

export const COMPARE_CSS=`
.choose-main{max-width:1040px}
.choose-main h1{margin:.2em 0 .3em}
.choose-lead{max-width:68ch;color:var(--graphite);margin:0 0 20px}
.picker{display:grid;gap:14px;margin:0 0 8px}
.choose-main fieldset.domain{border:0;border-radius:0;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
/* 不浮动：保持为 fieldset 的标题图例，才不会被当成网格里的一格 */
.domain legend{margin:0 0 8px;font-weight:600;font-size:14px;color:var(--graphite);padding:0}
.domain label{position:relative;display:inline-flex!important;align-items:center;justify-content:center;padding:7px 14px;border:1px solid var(--rule);border-radius:999px;background:var(--card);cursor:pointer;font-size:15px;white-space:nowrap;min-height:36px}
.domain label:hover{border-color:var(--graphite)}
.domain label:has(input:checked){border-color:var(--ink);background:var(--ink);color:var(--paper)}
.domain label:has(input:focus-visible){outline:2px solid var(--pin);outline-offset:2px}
/* 单选按钮保留给键盘与读屏，视觉上由整颗胶囊表示选中 */
.domain input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}
@media (max-width:560px){.choose-main fieldset.domain{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.domain label{padding:7px 4px;font-size:14px}}
.dom-stat{margin:6px 0 0;padding-left:1.1em}.dom-stat li{margin:2px 0}
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
.vd-row.est{margin-top:18px;padding-top:12px;border-top:1px dashed var(--rule)}
.vd-v.est .mid{font:600 26px/1 var(--serif);color:var(--ink)}.vd-v.est small{display:block;color:var(--graphite);font-size:12.5px;margin-top:2px}.vd-v.est.na .mid{color:var(--rule)}
.cv.tb{font-style:italic}.cs.tbl,.cs.alt{display:block}
.vd-cov{margin:12px 0 0;font-size:14px;color:var(--graphite);max-width:75ch}
.vd-thin{margin:10px 0 0;padding:8px 12px;border-left:3px solid var(--warn);background:color-mix(in srgb,var(--warn) 8%,transparent);font-size:14px}
.vd-ref{margin:6px 0;padding:6px 10px;border-left:3px solid var(--warn);background:color-mix(in srgb,var(--warn) 8%,transparent);font-size:13px;max-width:75ch}
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
.cv.dash,.cx{font:600 17px/1.3 var(--mono);color:var(--graphite)}
.cc small.cq,.cvs small.cq{display:block;font-size:11.5px;color:var(--graphite);font-weight:400}
.cempty{margin:10px 0 0;font-size:14px;color:var(--graphite)}
.cempty summary{cursor:pointer;font-weight:600}
.cnames{list-style:none;padding:0;margin:8px 0 0;display:flex;flex-wrap:wrap;gap:6px 14px}
.cnames small{display:inline;color:var(--graphite);font-size:12px}
.cbar{display:block;block-size:6px;margin-top:6px;background:color-mix(in srgb,var(--rule) 60%,transparent);border-radius:3px;overflow:hidden}
.cbar i{display:block;block-size:100%;border-radius:3px;background:color-mix(in srgb,var(--graphite) 45%,transparent)}
.cc.a.win .cbar i{background:var(--ink)}.cc.b.win .cbar i{background:var(--pin)}
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
