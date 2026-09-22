/** 纯函数：浏览器与 Node 测试共用。缺失协议不能因同为 null 而被当成相同。 */
export const PROTOCOL_KEYS = ['harness','tools','shots','reasoning_effort','temperature','top_p','token_budget','turn_limit','time_limit','run_count','aggregation','judge'];
export function normalizeScore(score, rule) {
  if (!Number.isFinite(score?.value) || score.unit !== rule.unit || score.metric !== rule.metric) return null;
  if (!Number.isFinite(rule.min) || !Number.isFinite(rule.max) || rule.max <= rule.min || score.value < rule.min || score.value > rule.max) return null;
  const n = 100 * (score.value - rule.min) / (rule.max - rule.min);
  return rule.direction === 'lower' ? 100 - n : n;
}
export function evidenceEligibility(e, rule) {
  if (!rule || rule.comparison !== 'cross_model') return '该评测仅作描述，不能跨模型排序';
  if (e.status !== 'verified' || e.score_status !== 'reported' || !Number.isFinite(e.value)) return '没有可复核数值';
  if (!['A','B'].includes(e.source_tier) || !e.url || !e.locator || !Object.values(e.locator).some(Boolean)) return '来源或原文位置不完整';
  if (e.attribution === 'comparison_cited') return '竞品转述不能作为该模型的自报成绩';
  if (!['only_same_protocol','comparable'].includes(e.comparison_scope)) return '比较范围未明确';
  if (!e.variant || !e.metric || !e.unit) return '版本、指标或单位缺失';
  if (PROTOCOL_KEYS.some(k => e.protocol?.[k] === null || e.protocol?.[k] === undefined || (typeof e.protocol[k] === 'string' && /^(\s*|unknown|not reported|not disclosed|未披露|未知)$/i.test(e.protocol[k])))) return '评测协议未完整披露';
  if (normalizeScore({value:e.value,unit:e.unit,metric:e.metric},rule) === null) return '指标不匹配或没有可靠归一化范围';
  return null;
}
export function protocolKey(e) {
  return JSON.stringify([e.benchmark_id,e.variant,e.metric,e.unit,...PROTOCOL_KEYS.map(k=>e.protocol?.[k])]);
}
export function parseGoal(text, useCase) {
  const recognized = useCase.dimensions.filter(d => d.keywords.some(k => text.toLowerCase().includes(k.toLowerCase()))).map(d=>d.id);
  return {recognized, weights:Object.fromEntries(useCase.dimensions.map(d=>[d.id,recognized.length ? (recognized.includes(d.id)?d.weight:0):d.weight])), note:recognized.length?'按关键词识别，请确认维度与约束。':'未识别到具体写作维度，保留默认模板；其他任务暂不推荐。'};
}
export function contextTokens(value) {
  const match=String(value||'').trim().match(/^(\d+(?:\.\d+)?)\s*([kKmM])?(?:\s*tokens)?$/);
  return match ? Number(match[1])*({k:1000,m:1000000}[match[2]?.toLowerCase()]||1):null;
}
export function constraintChecks(model, state) {
  const checks=[];
  function add(label, known, passed){checks.push({label,status:known?(passed?'pass':'fail'):'unknown'});}
  if(state.modality) add('输入模态：'+state.modality,Array.isArray(model.modalities),model.modalities?.includes(state.modality));
  if(state.context>0){const n=contextTokens(model.context_window);add('上下文至少 '+state.context+' tokens',n!==null,n>=state.context);}
  if(state.maxPrice!==null && state.maxPrice!==undefined && state.maxPrice!=='') {const p=model.pricing;add('输出单价 ≤ '+state.maxPrice+' '+state.currency+'/百万 tokens',Number.isFinite(p?.output_per_m)&&p.currency===state.currency,p?.output_per_m<=state.maxPrice);}
  if(state.region) add('厂商所属区域：'+state.region,Boolean(model.region),model.region===state.region);
  if(state.deployment) add('部署方式：'+state.deployment,Array.isArray(model.deployment),model.deployment?.includes(state.deployment));
  return checks;
}
export function selectModels(data,state) {
  const active=data.useCase.dimensions.filter(d=>(state.weights[d.id]||0)>0);
  const candidates=data.models.filter(m=>!state.candidates?.length||state.candidates.includes(m.key)).map(m=>{
    const checks=constraintChecks(m,state);
    const dimensions=active.map(d=>{
      const rows=m.evidence.filter(e=>d.benchmarks.includes(e.benchmark_id)).map(e=>{
        const rule=data.useCase.benchmarks[e.benchmark_id];
        return {...e,reason:evidenceEligibility(e,rule),normalized:normalizeScore({value:e.value,unit:e.unit,metric:e.metric},rule||{})};
      });
      return {id:d.id,label:d.label,rows,comparable:rows.filter(e=>!e.reason)};
    });
    return {...m,checks,eligible:checks.every(c=>c.status==='pass'),dimensions,total:null,coverage:dimensions.filter(d=>d.rows.length).length};
  });
  // 只在全部通过硬约束的候选共享的协议上比较，不能以不同证据子集凑出总分。
  const pool=candidates.filter(m=>m.eligible);
  const common={};
  for(const d of active){
    const keys=pool.map(m=>new Set(m.dimensions.find(x=>x.id===d.id).comparable.map(protocolKey)));
    common[d.id]=keys.length>=2?[...keys[0]].filter(k=>keys.every(s=>s.has(k))).sort():[];
  }
  const sufficient=active.length>0&&pool.length>=2&&active.every(d=>common[d.id].length>0);
  for(const m of candidates){
    for(const d of m.dimensions){
      d.selected=d.comparable.filter(e=>common[d.id]?.includes(protocolKey(e)));
      // 重复发布/重复记录按同协议归组；冲突分数不择优。
      const groups=Object.groupBy(d.selected,protocolKey);
      d.conflict=Object.values(groups).some(rows=>new Set(rows.map(e=>e.value)).size>1);
      d.score=d.selected.length&&!d.conflict?Object.values(groups).reduce((s,rows)=>s+rows[0].normalized,0)/Object.keys(groups).length:null;
    }
    if(sufficient&&m.eligible&&m.dimensions.every(d=>d.score!==null)) m.total=m.dimensions.reduce((s,d)=>s+d.score*state.weights[d.id],0)/active.reduce((s,d)=>s+state.weights[d.id],0);
  }
  const ranked=candidates.filter(m=>m.total!==null).sort((a,b)=>b.total-a.total||a.key.localeCompare(b.key));
  const canRank=sufficient&&ranked.length===pool.length;
  if(!canRank) for(const m of candidates)m.total=null;
  const tied=canRank&&Math.abs(ranked[0].total-ranked[1].total)<0.01;
  const winner=canRank&&!tied?ranked[0].key:null;
  return {candidates,common,winner,canRank,tied,message:canRank?(tied?'同协议证据下候选平局，无法指定唯一优先项。':'仅在当前约束和共享协议下给出试用顺序。'):'当前无法客观推荐：所选维度缺少共同可比证据，或硬约束尚无法确认。'};
}
export function readState(params,useCase,models) {
  const number=(key,fallback,max)=>{const v=params.get(key);return v!==null&&v!==''&&Number.isFinite(+v)&&+v>=0?Math.min(+v,max):fallback;};
  return {goal:(params.get('goal')||'').slice(0,500),weights:Object.fromEntries(useCase.dimensions.map(d=>[d.id,number('w_'+d.id,d.weight,10)])),modality:['文本','图像','音频','视频'].includes(params.get('modality'))?params.get('modality'):'',context:number('context',0,10000000),maxPrice:params.get('maxPrice')?number('maxPrice',null,100000):null,currency:params.get('currency')==='CNY'?'CNY':'USD',region:['CN','GLOBAL'].includes(params.get('region'))?params.get('region'):'',deployment:['local','api'].includes(params.get('deployment'))?params.get('deployment'):'',candidates:(params.get('candidates')||'').split(',').filter(k=>models.some(m=>m.key===k))};
}
export function stateParams(state) {
  const p=new URLSearchParams();
  for(const k of ['goal','modality','context','maxPrice','currency','region','deployment']) if(state[k]!==null&&state[k]!==undefined&&state[k]!=='')p.set(k,String(state[k]));
  for(const [k,v] of Object.entries(state.weights))p.set('w_'+k,String(v));
  if(state.candidates?.length)p.set('candidates',state.candidates.join(','));
  return p;
}
