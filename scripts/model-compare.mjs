/**
 * 两模型对照（/choose/）的纯函数：浏览器与 Node 测试共用。
 *
 * 规则（与页面「综合分怎么算」一一对应）：
 *
 * 1. 领域目录 catalog(D)：use-case 文件 benchmarks 里声明的评估 ∪ dimensions 引用的评估 ∪ catalog 数组列出的评估。
 *    catalog 是按评估档案（名称、简介、官方来源）逐项筛出的「这一类真实工作」的评估，见各 use-case 的 catalog_note；
 *    没有列出的评估不会被猜进领域。
 * 2. 计分规则 rule(B)（决定能否进入 0–100 综合分）：
 *    - use-case 已声明的评估：沿用其声明；comparison 必须是 cross_model，unit/metric/min/max 齐全。
 *    - 其余目录评估：评估档案 metrics 里恰好有一个「有固定上下界」的指标（range=[min,max]，单位已写明），
 *      且不是 Elo / 胜率 / 竞技场这类相对读数，才用它换算；否则只列原始分数，不进综合分（也不按 0 计）。
 * 3. 权重 cite(B)：至少有一条 B 记录的不同官方发布数（同一发布多个变体只算一次）。
 * 4. 每个模型在每项可计分评估上的状态：
 *    - value：有已核验、官方公布、单位与指标都对得上的数值 → 换算到 0–100；
 *    - missing：完全没有这项评估的记录 → 表格显示「-」，综合分按 0 计；
 *    - pending：只有官方配图里尚未转录的读数（或官方未公布数值）→ 显示「-」，但这一项整体退出这组对照（不按 0）；
 *    - other：有数值但版本、单位或指标对不上 → 这一项整体退出这组对照（不拿真实分数去比假 0）。
 * 5. 综合分 = Σ cite(B)·score(M,B) / Σ cite(B)，Σ 取「本领域全部可计分评估」减去这组对照里整体退出的项。
 *    缺失项的权重不会挪给模型报告过的评估——没报告就是拉低综合分。
 */

const unitOf=u=>u==='%'?'percent':String(u||'').trim().toLowerCase();
const canonMetric=m=>String(m||'').trim().toLowerCase().replace(/-/g,'_').replace(/^pass_at_(\d+)$/,'pass@$1');
/** 「任务通过率」一族：在代码与 Agent 评测里是同一种读数的不同叫法 */
const PASS_FAMILY=['pass_rate','resolve_rate','resolved_rate','task solve rate','pass@1','accuracy','percent_solved','test_pass_rate','task_pass_rate','success_rate','task_success_rate','task_completion_rate'];
/** Elo、胜率、竞技场分数依赖对手或题池，没有固定 0–100 意义，不换算 */
const RELATIVE=/elo|win.?rate|win.?or.?tie|arena|preference|胜率|对战/i;
const RULE_KEYS=['unit','metric','min','max'];
const validRule=r=>r&&RULE_KEYS.every(k=>r[k]!==null&&r[k]!==undefined&&r[k]!=='')&&Number.isFinite(r.min)&&Number.isFinite(r.max)&&r.max>r.min;

/** use-case 已声明评估的计分规则；返回 {rule} 或 {reason} */
export function ruleFromUseCase(r){
  if(!r||r.comparison!=='cross_model')return {reason:'仅作参考：各家题目、裁判或口径不统一'};
  if(!validRule(r))return {reason:'没有可靠的 0–100 换算范围'};
  return {rule:{unit:unitOf(r.unit),metric:canonMetric(r.metric),min:r.min,max:r.max,direction:r.direction||'higher',allowNullMetric:true,source:'use-case'}};
}
/** 评估档案 metrics 推出的计分规则；返回 {rule} 或 {reason} */
export function ruleFromEntity(ent){
  const ms=(ent?.metrics||[]).filter(m=>m&&typeof m==='object');
  const bounded=ms.filter(m=>Array.isArray(m.range)&&m.range.length===2&&Number.isFinite(m.range[0])&&Number.isFinite(m.range[1])&&m.range[1]>m.range[0]&&m.unit&&m.id&&!RELATIVE.test(m.id+' '+(m.name||'')));
  if(bounded.length!==1)return {reason:bounded.length?'评估档案有多个可换算指标，无法确定用哪一个':'评估档案没有写明固定上下界，不换算成 0–100'};
  const m=bounded[0];
  // 档案只声明了这一个指标时，未写指标名的记录才视为这个指标
  return {rule:{unit:unitOf(m.unit),metric:canonMetric(m.id),min:m.range[0],max:m.range[1],direction:m.direction==='lower'?'lower':'higher',allowNullMetric:(ent.metrics||[]).length===1,source:'benchmark'}};
}

/** 引用次数：不同官方发布数（releases: [{id, evidence|benchmark_evidence:[{benchmark_id}]}]） */
export function citationCounts(releases,benchIds){
  const out=Object.fromEntries(benchIds.map(id=>[id,0]));
  for(const r of releases||[]){
    const seen=new Set((r.evidence||r.benchmark_evidence||[]).map(e=>e.benchmark_id));
    for(const id of benchIds)if(seen.has(id))out[id]++;
  }
  return out;
}

/**
 * 领域目录。
 * @param useCase   data/use-cases/*.json
 * @param entities  {id:{name,metrics}}
 * @param cites     {id: 引用次数}（需覆盖全部候选 id）
 * @returns [{id,name,cite,source,eligible,rule,reason}]，按 cite 降序
 */
export function domainCatalog(useCase,entities,cites){
  const ids=new Set(Object.keys(useCase?.benchmarks||{}));
  for(const d of useCase?.dimensions||[])for(const id of d.benchmarks||[])ids.add(id);
  const declared=new Set(ids);
  for(const id of useCase?.catalog||[])ids.add(id);
  return [...ids].map(id=>{
    const uc=useCase.benchmarks?.[id];
    const {rule,reason}=uc?ruleFromUseCase(uc):ruleFromEntity(entities?.[id]);
    return {id,name:uc?.name||entities?.[id]?.name||id,cite:cites?.[id]||0,source:declared.has(id)?'use-case':'catalog',eligible:Boolean(rule),rule:rule||null,reason:reason||null};
  }).sort((a,b)=>b.cite-a.cite||Number(b.eligible)-Number(a.eligible)||a.name.localeCompare(b.name));
}

export function metricMatches(e,rule){
  const m=canonMetric(e.metric);
  if(!m)return Boolean(rule.allowNullMetric);
  if(m===rule.metric)return true;
  return PASS_FAMILY.includes(rule.metric)&&PASS_FAMILY.includes(m);
}
/** 记录在该规则下能否计分；返回不能的原因（面向读者）或 null */
export function rowIssue(e,rule){
  if(e.status!=='verified'||e.score_status!=='reported'||!Number.isFinite(e.value))return 'pending';
  if(e.attribution==='comparison_cited')return '来自其他厂商的对比引用，不算该模型自报';
  if(!rule)return '仅作参考';
  if(unitOf(e.unit)!==rule.unit)return '单位与计分口径不同';
  if(!metricMatches(e,rule))return '指标与计分口径不同';
  if(e.value<rule.min||e.value>rule.max)return '数值超出换算范围';
  return null;
}
export function normalizedValue(e,rule){
  const n=100*(e.value-rule.min)/(rule.max-rule.min);
  return rule.direction==='lower'?100-n:n;
}
/** 记录是否属于「官方配图尚未转录 / 官方未公布数值」 */
export const isPending=e=>e.status!=='verified'||e.score_status!=='reported'||!Number.isFinite(e.value);

/**
 * 评测版本：从官方写法里取出版本号（v6、2.0、4.0 等），2 与 2.0 视为同一版本；
 * 没有版本号时取第一个词（如 Public、strict）。日期区间不当作版本号。
 */
/**
 * 会改变分数含义的测试条件：有无工具 / 联网、上下文管理策略、计分方式（partial / strict / binary）、
 * 子集（offline、text-only、image、full set、Diamond、Verified、Public、Pro）。
 * 版本相同但条件不同的分数不配对。
 */
const COND=[
  ['无工具',/\b(?:no|without|w\/o)[\s.\-]*(?:tools?|python|ci|search)\b|\bwithout\s*\/\s*with\b/],
  ['有工具',/(?:\b(?:with|w\/|w\.)[\s.\-]*(?:tools?|python|ci|search)\b|\bpython\s*\+\s*search\b|\bsearch\s*\(|\+\s*code\b)/],
  ['无上下文管理',/\b(?:no|without|w\/o)\s+context\s+manag/],
  ['上下文管理',/(?<!no\s|without\s|w\/o\s)\bcontext\s+manag/],
  ['discard',/\bdiscard/],
  ['partial',/\bpartial\b/],['strict',/\bstrict\b/],['binary',/\bbinary\b/],['loose',/\bloose\b/],
  ['offline',/\boffline\b/],['text',/\btext[\s\-]*(?:only|subset)\b|^text\b|\btext\s*\(/],['image',/\bimage\b/],['full',/\bfull[\s\-]*set\b/],
  ['diamond',/\bdiamond\b/],['verified',/\bverified\b/],['public',/\bpublic\b/],['pro',/(?:^|[\s,(])pro(?:\b(?!\s*max)|$)/],
];
const DATE=/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b20\d\d[.\-\/]\d{1,2}\b|\b\d{2}\.\d{2}\s*-\s*\d{2}\.\d{2}\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+20\d\d\b/g;
export function variantOf(e){
  const raw=String(e.variant||'').trim().toLowerCase();
  if(!raw)return '';
  const tags=COND.filter(([,re])=>re.test(raw)).map(([t])=>t);
  // 子集规模、多次尝试、轮数上限：同样会改变分数含义
  const sub=raw.match(/\bn\s*=\s*(\d+)|\b(\d+)[\s-]*(?:sample|task)s?\b/);if(sub)tags.push('n'+(sub[1]||sub[2]));
  const k=raw.match(/pass@(\d+)/);if(k&&k[1]!=='1')tags.push('pass@'+k[1]);
  if(/multiple attempts|parallel test-time|best[\s-]of/.test(raw))tags.push('多次尝试');
  const t=raw.match(/(\d+)\s*turns?\b/);if(t)tags.push(t[1]+'轮');
  if(tags.includes('无上下文管理'))tags.splice(tags.indexOf('上下文管理')>>>0,tags.includes('上下文管理')?1:0);
  const v=raw.match(/\bv(\d+)\b/);
  const n=v?null:raw.replace(DATE,' ').match(/(?<![\d/.\-@=])(\d{1,2})(?:\.(\d+))?(?![\d/]|-\d|\s*(?:turns?|k\b|b\b|gb|core|s\b))/);
  let base=v?'v'+v[1]:n?n[1]+'.'+(n[2]||'0'):'';
  // 没有版本号时，题目时间窗口也是版本的一部分（如 LiveCodeBench 不同日期区间）
  if(!base){const d=raw.match(DATE);if(d)base=d.map(x=>x.replace(/\s+/g,'')).join('~');}
  if(!base&&!tags.length)base=raw.split(/[\s,，(（;；\-]+/).find(Boolean)||'';
  return tags.length?base+'|'+tags.sort().join('+'):base;
}
const isNumericVariant=v=>/^v?\d+(?:\.\d+)?(?:\|.*)?$/.test(v)&&!v.includes('|');
const cmpVariantDesc=(a,b)=>b.localeCompare(a,undefined,{numeric:true});
const settingKey=e=>JSON.stringify([String(e.harness||e.protocol?.harness||'').trim().toLowerCase(),String(e.effort||e.protocol?.reasoning_effort||'').trim().toLowerCase()]);
const groupBy=(rows,f)=>rows.reduce((o,e)=>{(o[f(e)]??=[]).push(e);return o;},{});
const distinct=rows=>[...new Set(rows.map(e=>e.value))];
const MULTI='同一版本下有多档测试设置的分数，无法确定用哪一档';
/** 一侧单独取值：最新版本；同版本多个不同数值（多档设置）时不择优 */
export function pickOne(rows){
  const vs=[...new Set(rows.map(variantOf))].sort(cmpVariantDesc);
  // 只有「都是版本号」时才取最新版本；有工具 / 子集 / 设置等非版本写法并存且分数不同，不替用户挑一个
  if(vs.length>1&&!vs.filter(Boolean).every(isNumericVariant)&&distinct(rows).length>1)return {excluded:MULTI};
  const v=vs.find(Boolean)??'';
  const R=rows.filter(e=>variantOf(e)===v);
  if(distinct(R).length===1)return {row:R[0],variant:v};
  return {excluded:MULTI};
}
/** 两侧都有可计分记录：必须在同一个写明的版本上配对 */
export function pairBench(rowsA,rowsB){
  const va=new Set(rowsA.map(variantOf).filter(Boolean)),vb=new Set(rowsB.map(variantOf).filter(Boolean));
  const common=[...va].filter(v=>vb.has(v)).sort(cmpVariantDesc);
  const raw=rows=>[...new Set(rows.map(e=>String(e.variant||'').trim()).filter(Boolean))].join('、');
  if(!common.length)return {excluded:va.size&&vb.size?'双方报告的评测版本或测试条件不同（'+raw(rowsA)+' / '+raw(rowsB)+'），不能直接对照':'至少一方没有写明评测版本，不能确认是同一版本'};
  const v=common[0];
  const A=rowsA.filter(e=>variantOf(e)===v),B=rowsB.filter(e=>variantOf(e)===v);
  const da=distinct(A),db=distinct(B);
  if(da.length===1&&db.length===1)return {a:A[0],b:B[0],variant:v};
  const sa=groupBy(A,settingKey),sb=groupBy(B,settingKey);
  const same=Object.keys(sa).filter(k=>sb[k]&&k!=='["",""]'&&distinct(sa[k]).length===1&&distinct(sb[k]).length===1);
  if(same.length===1)return {a:sa[same[0]][0],b:sb[same[0]][0],variant:v};
  return {excluded:MULTI};
}

/** 一侧在某评估上的原始记录分类 */
function sideRows(m,id,rule){
  const rows=(m?.evidence||[]).filter(e=>e.benchmark_id===id);
  const usable=rule?rows.filter(e=>!rowIssue(e,rule)):[];
  const pending=rows.filter(isPending);
  const other=rows.filter(e=>!usable.includes(e)&&!pending.includes(e));
  return {rows,usable,pending,other};
}
const val=(row,rule,variant)=>({state:'value',row,variant,n:normalizedValue(row,rule)});
const TIE=0.05;

/**
 * 两模型对照主函数。
 * @param domain {title, catalog:[domainCatalog() 项]}
 * @param A,B    {key,name,evidence:[...]}
 * @returns {rows, scored, reference, composite, reason, eligibleCount}
 *   rows: 可计分评估（全部列出），每项 {id,name,cite,status:'scored'|'excluded',a,b,weight,winner,reason}
 *         a/b: {state:'value'|'missing'|'pending'|'other', n?, row?, rows?}
 *   reference: 目录里不可计分的评估中至少一方有记录的项 {id,name,cite,a:rows,b:rows,reason}
 */
export function headToHead(domain,A,B){
  const cat=domain?.catalog||[];
  const eligible=cat.filter(c=>c.eligible);
  const rows=[],reference=[];
  let referenceEmpty=0;
  for(const c of cat){
    const sa=sideRows(A,c.id,c.rule),sb=sideRows(B,c.id,c.rule);
    if(!c.eligible){
      if(sa.rows.length||sb.rows.length)reference.push({id:c.id,name:c.name,cite:c.cite,a:sa.rows,b:sb.rows,reason:c.reason});
      else referenceEmpty++;
      continue;
    }
    const base={id:c.id,name:c.name,cite:c.cite,rule:c.rule};
    const stateOf=s=>s.usable.length?null:s.rows.length===0?{state:'missing'}:s.pending.length&&!s.other.length?{state:'pending',rows:s.rows}:{state:'other',rows:s.rows};
    let a=stateOf(sa),b=stateOf(sb),reason=null,variant=null;
    if(!a&&!b){
      const p=pairBench(sa.usable,sb.usable);
      if(p.excluded){reason=p.excluded;a={state:'other',rows:sa.usable};b={state:'other',rows:sb.usable};}
      else{a=val(p.a,c.rule,p.variant);b=val(p.b,c.rule,p.variant);variant=p.variant;}
    }else{
      for(const [s,who] of [[sa,'a'],[sb,'b']]){
        if((who==='a'?a:b))continue;
        const p=pickOne(s.usable);
        if(p.excluded){reason=p.excluded;if(who==='a')a={state:'other',rows:s.usable};else b={state:'other',rows:s.usable};}
        else{const v=val(p.row,c.rule,p.variant);if(who==='a')a=v;else b=v;}
      }
    }
    // 任一侧是待转录或口径不同：整项退出这组对照（不按 0，也不拿真实分数比假 0）
    const blocked=[a,b].find(x=>x.state==='pending'||x.state==='other');
    if(blocked&&!reason)reason=blocked.state==='pending'?'有一方的分数只在官方配图里，尚未转录出数值':'有一方的记录版本、单位或指标对不上';
    const status=blocked?'excluded':'scored';
    const na=a.state==='value'?a.n:0,nb=b.state==='value'?b.n:0;
    rows.push({...base,status,a,b,variant,reason,na,nb,diff:na-nb,
      // 只在双方都有真实数值时标胜负；「有分 vs 缺失」靠「计 0」提示，不画胜者
      winner:status==='scored'&&a.state==='value'&&b.state==='value'&&Math.abs(na-nb)>1e-9?(na>nb?'a':'b'):null});
  }
  const scored=rows.filter(r=>r.status==='scored');
  const total=scored.reduce((s,r)=>s+r.cite,0);
  for(const r of rows)r.weight=r.status!=='scored'?0:total>0?r.cite/total:1/scored.length;
  let composite=null,reason=null;
  if(!A||!B)reason='请选择两个模型';
  else if(A.key&&A.key===B.key)reason='请选择两个不同的模型';
  else if(!eligible.length)reason='这一领域还没有可以换算成 0–100 分的评估';
  else if(!scored.length)reason='这一领域的可计分评估在这组对照里都因待转录或口径不同而退出，无法综合对比';
  else{
    const a=scored.reduce((s,r)=>s+r.weight*r.na,0),b=scored.reduce((s,r)=>s+r.weight*r.nb,0);
    const has=w=>scored.filter(r=>r[w].state==='value').length;
    composite={a,b,n:scored.length,of:eligible.length,excluded:rows.length-scored.length,hasA:has('a'),hasB:has('b'),
      both:scored.filter(r=>r.a.state==='value'&&r.b.state==='value').length,
      single:eligible.length===1?eligible[0]:null,winner:Math.abs(a-b)<TIE?null:a>b?'a':'b',diff:a-b,equalWeights:total===0,totalCite:total};
  }
  return {rows,reference,referenceEmpty,composite,reason,eligibleCount:eligible.length,catalogSize:cat.length};
}
/** 读写 URL：task / a / b（模型 key = releaseId--modelId） */
export function readCompareParams(params,useCases,models){
  const task=useCases?.[params.get('task')]?params.get('task'):Object.keys(useCases||{})[0]||'';
  const ok=k=>models.some(m=>m.key===k)?k:'';
  return {task,a:ok(params.get('a')||''),b:ok(params.get('b')||'')};
}
export function compareParams(s){const p=new URLSearchParams();if(s.task)p.set('task',s.task);if(s.a)p.set('a',s.a);if(s.b)p.set('b',s.b);return p;}
/** 每个模型在领域里有可计分数值的评估数（组合框提示用） */
export function domainCounts(domain,models){
  const c={};
  for(const m of models){let n=0;for(const b of domain.catalog)if(b.eligible&&m.evidence.some(e=>e.benchmark_id===b.id&&!rowIssue(e,b.rule)))n++;if(n)c[m.key]=n;}
  return c;
}
/** 搜索：模型名 / 厂商 / 发布标题，空格分词全部命中；同分时优先本领域有记录的模型、再按发布日期倒序 */
export function searchModels(models,q,domainCount={},limit=30){
  const terms=String(q||'').toLowerCase().split(/\s+/).filter(Boolean);
  const has=m=>(domainCount[m.key]||0)>0?1:0;
  return models.map(m=>{const hay=(m.name+' '+m.vendor_label+' '+(m.release_title||'')+' '+m.key).toLowerCase();return {m,hit:terms.every(t=>hay.includes(t)),starts:terms.length&&m.name.toLowerCase().startsWith(terms[0])?1:0};})
    .filter(x=>x.hit).sort((x,y)=>has(y.m)-has(x.m)||y.starts-x.starts||(domainCount[y.m.key]||0)-(domainCount[x.m.key]||0)||String(y.m.release_date||'').localeCompare(String(x.m.release_date||''))||x.m.key.localeCompare(y.m.key)).slice(0,limit).map(x=>x.m);
}
