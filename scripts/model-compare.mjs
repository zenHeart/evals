/**
 * 两模型对照（/choose/）的纯函数：浏览器与 Node 测试共用。
 *
 * 规则（与页面文案一一对应）：
 * - 候选评测：该领域里 comparison === 'cross_model' 且有完整归一化规则（unit/metric/min/max）的评测。
 * - 引用次数：账本里至少有一条该评测记录的「不同官方发布」数（同一发布的多个变体只算一次）。
 * - 只在双方都有可对照分数的评测（交集 I）上计算；缺分不填 0，权重不向 I 之外重新分配。
 * - weight(B) = cite(B) / Σ cite(I)；Σ 为 0 时等权。score(M) = Σ weight(B) · normalize(M,B)。
 * - 仅作描述的评测（descriptive_only）、厂商内部评测、竞品转述永远不进入综合分。
 *
 * 为什么不直接用 evidenceEligibility：它是「全库排名」的门槛，要求 12 项测试设置全部公开，
 * 目前官方发布几乎都达不到，两两对照会永远是空集。两两对照改为：双方在同一评测、同一版本、
 * 同一指标上的自报分数才配对，测试设置差异在页面上如实提示，而不是假装相同。
 */
import {normalizeScore,protocolKey} from './model-selection.mjs';

const RULE_KEYS=['unit','metric','min','max'];
/** 该领域可进入综合分的评测 id（保持 use-case 中的声明顺序） */
export function candidateBenches(useCase){
  return Object.entries(useCase?.benchmarks||{}).filter(([,r])=>r&&r.comparison==='cross_model'&&RULE_KEYS.every(k=>r[k]!==null&&r[k]!==undefined&&r[k]!=='')&&Number.isFinite(r.min)&&Number.isFinite(r.max)&&r.max>r.min).map(([id])=>id);
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
const unitOf=u=>u==='%'?'percent':String(u||'').trim().toLowerCase();
/**
 * 指标口径：未写明时视为该评测的默认指标。
 * 「任务通过率」一族（通过率 / 解决率 / 单次通过率 / 准确率）在代码与 Agent 评测里是同一种读数的不同叫法，
 * 只在默认指标本身属于这一族时才合并；像 IFEval 的 prompt_strict_acc 与笼统的 accuracy 属于不同口径，不合并。
 */
const PASS_FAMILY=['pass_rate','resolve_rate','resolved_rate','task solve rate','pass@1','accuracy','percent_solved'];
export function metricOf(e,rule){
  const def=String(rule?.metric||'').trim().toLowerCase();
  const m=String(e.metric||'').trim().toLowerCase()||def;
  if(PASS_FAMILY.includes(def)&&PASS_FAMILY.includes(m))return 'pass-family';
  return m;
}
function ruleMetric(rule){return metricOf({metric:''},rule);}
/**
 * 评测版本：从官方写法里取出版本号（v6、2.0、4.0 等），2 与 2.0 视为同一版本；
 * 没有版本号时取第一个词（如 Public、strict）。日期区间不当作版本号。
 */
export function variantOf(e){
  const raw=String(e.variant||'').trim().toLowerCase();
  if(!raw)return '';
  const v=raw.match(/\bv(\d+)\b/);if(v)return 'v'+v[1];
  const n=raw.match(/(?<![\d/.\-])(\d{1,2})(?:\.(\d+))?(?![\d/]|-\d)/);if(n)return n[1]+'.'+(n[2]||'0');
  return raw.split(/[\s,，(（;；\-]+/)[0];
}
/** 单条记录能否参加两两对照；返回不能的原因（中文，面向读者）或 null */
export function pairEligibility(e,rule){
  if(!rule||rule.comparison!=='cross_model')return '仅作参考，不参与对照';
  if(e.status!=='verified'||e.score_status!=='reported'||!Number.isFinite(e.value))return '官方未公布可读数值';
  if(e.attribution==='comparison_cited')return '来自其他厂商的对比引用，不算该模型自报';
  if(!variantOf(e))return '未写明评测版本';
  if(unitOf(e.unit)!==rule.unit)return '单位与可比口径不同';
  if(metricOf(e,rule)!==ruleMetric(rule))return '指标与可比口径不同';
  if(normalizeScore({value:e.value,unit:rule.unit,metric:rule.metric},rule)===null)return '数值超出可比范围';
  return null;
}
export function normalizedValue(e,rule){return normalizeScore({value:e.value,unit:rule.unit,metric:rule.metric},rule);}
/** 版本号降序（数字感知），用于双方都有多个版本时取最新的共同版本 */
function cmpVariantDesc(a,b){return b.localeCompare(a,undefined,{numeric:true});}
const settingKey=e=>JSON.stringify([String(e.harness||e.protocol?.harness||'').trim().toLowerCase(),String(e.effort||e.protocol?.reasoning_effort||'').trim().toLowerCase()]);
const groupBy=(rows,f)=>rows.reduce((o,e)=>{(o[f(e)]??=[]).push(e);return o;},{});
const sameSetting=e=>protocolKey(e)+settingKey(e);
const distinct=rows=>[...new Set(rows.map(e=>e.value))];
/**
 * 在一个评测上为两侧配对。返回 {a,b,variant} 或 {conflict:true,reason} 或 {mismatch:true,reason}。
 */
export function pairBench(rowsA,rowsB){
  const va=new Set(rowsA.map(variantOf)),vb=new Set(rowsB.map(variantOf));
  const common=[...va].filter(v=>vb.has(v)).sort(cmpVariantDesc);
  if(!common.length)return {mismatch:true,reason:'双方报告的评测版本不同（'+[...va].join('、')+' / '+[...vb].join('、')+'），不能直接对照'};
  for(const v of common){
    const A=rowsA.filter(e=>variantOf(e)===v),B=rowsB.filter(e=>variantOf(e)===v);
    // 同一测试设置下的重复记录只算一次；同设置数值不一致视为冲突，不择优
    const conflictA=Object.values(groupBy(A,sameSetting)).some(g=>distinct(g).length>1);
    const conflictB=Object.values(groupBy(B,sameSetting)).some(g=>distinct(g).length>1);
    if(conflictA||conflictB)return {conflict:true,variant:v,reason:'同一版本、同一设置下出现了不一致的数值，未纳入综合分'};
    const da=distinct(A),db=distinct(B);
    if(da.length===1&&db.length===1)return {a:A[0],b:B[0],variant:v};
    // 一方有多档设置（如不同推理档位）：只有双方恰有一个相同设置时才配对
    const sa=groupBy(A,settingKey),sb=groupBy(B,settingKey);
    const same=Object.keys(sa).filter(k=>sb[k]&&k!=='["",""]');
    if(same.length===1)return {a:sa[same[0]][0],b:sb[same[0]][0],variant:v};
    return {conflict:true,variant:v,reason:'同一版本下有多档测试设置的分数，无法确定用哪一档对照，未纳入综合分'};
  }
}
const TIE=0.05;
/**
 * 两模型对照主函数。
 * @param useCase 领域（data/use-cases/*.json）
 * @param cites   {benchId: 引用次数}
 * @param A,B     {key,name,evidence:[...]}
 */
export function headToHead(useCase,cites,A,B){
  const cand=candidateBenches(useCase);
  const shared=[],onlyA=[],onlyB=[],excluded=[],reference=[];
  for(const id of Object.keys(useCase.benchmarks||{})){
    const rule=useCase.benchmarks[id];
    const ra=(A?.evidence||[]).filter(e=>e.benchmark_id===id),rb=(B?.evidence||[]).filter(e=>e.benchmark_id===id);
    if(!ra.length&&!rb.length)continue; // 双方都无记录的评测不显示
    const base={id,name:rule.name||id,cite:cites?.[id]||0};
    if(!cand.includes(id)){reference.push({...base,a:ra,b:rb,reason:'仅作参考'});continue;}
    const ea=ra.filter(e=>!pairEligibility(e,rule)),eb=rb.filter(e=>!pairEligibility(e,rule));
    if(ea.length&&eb.length){
      const p=pairBench(ea,eb);
      if(p.a){const na=normalizedValue(p.a,rule),nb=normalizedValue(p.b,rule);shared.push({...base,variant:p.variant,a:p.a,b:p.b,na,nb,winner:Math.abs(na-nb)<1e-9?null:na>nb?'a':'b',diff:na-nb});}
      else excluded.push({...base,a:ra,b:rb,reason:p.reason,conflict:Boolean(p.conflict)});
    }else if(ea.length&&!rb.length)onlyA.push({...base,rows:ea,other:[]});
    else if(eb.length&&!ra.length)onlyB.push({...base,rows:eb,other:[]});
    else{
      // 至少一方的记录不能对照（未写版本、口径不同、无数值……）
      const why=[...ra,...rb].map(e=>pairEligibility(e,rule)).find(Boolean)||'口径不同';
      if(ea.length)onlyA.push({...base,rows:ea,other:rb,reason:why});
      else if(eb.length)onlyB.push({...base,rows:eb,other:ra,reason:why});
      else excluded.push({...base,a:ra,b:rb,reason:why});
    }
  }
  const total=shared.reduce((s,r)=>s+r.cite,0);
  for(const r of shared)r.weight=shared.length?(total>0?r.cite/total:1/shared.length):0;
  shared.sort((x,y)=>y.weight-x.weight||x.name.localeCompare(y.name));
  let composite=null,reason=null;
  if(!A||!B)reason='请选择两个模型';
  else if(A.key&&A.key===B.key)reason='请选择两个不同的模型';
  else if(!shared.length)reason='双方在这一领域没有共同可比的评估，无法综合对比';
  else{
    const a=shared.reduce((s,r)=>s+r.weight*r.na,0),b=shared.reduce((s,r)=>s+r.weight*r.nb,0);
    composite={a,b,n:shared.length,of:cand.length,single:shared.length===1?shared[0]:null,winner:Math.abs(a-b)<TIE?null:a>b?'a':'b',diff:a-b,equalWeights:total===0};
  }
  return {candidates:cand,shared,onlyA,onlyB,excluded,reference,composite,reason};
}
/** 读写 URL：task / a / b（模型 key = releaseId--modelId） */
export function readCompareParams(params,useCases,models){
  const task=useCases?.[params.get('task')]?params.get('task'):Object.keys(useCases||{})[0]||'';
  const ok=k=>models.some(m=>m.key===k)?k:'';
  return {task,a:ok(params.get('a')||''),b:ok(params.get('b')||'')};
}
export function compareParams(s){const p=new URLSearchParams();if(s.task)p.set('task',s.task);if(s.a)p.set('a',s.a);if(s.b)p.set('b',s.b);return p;}
/** 搜索：模型名 / 厂商 / 发布标题，空格分词全部命中；同分时优先本领域有记录的模型、再按发布日期倒序 */
export function searchModels(models,q,domainCount={},limit=30){
  const terms=String(q||'').toLowerCase().split(/\s+/).filter(Boolean);
  const has=m=>(domainCount[m.key]||0)>0?1:0;
  return models.map(m=>{const hay=(m.name+' '+m.vendor_label+' '+(m.release_title||'')+' '+m.key).toLowerCase();return {m,hit:terms.every(t=>hay.includes(t)),starts:terms.length&&m.name.toLowerCase().startsWith(terms[0])?1:0};})
    .filter(x=>x.hit).sort((x,y)=>has(y.m)-has(x.m)||y.starts-x.starts||(domainCount[y.m.key]||0)-(domainCount[x.m.key]||0)||String(y.m.release_date||'').localeCompare(String(x.m.release_date||''))||x.m.key.localeCompare(y.m.key)).slice(0,limit).map(x=>x.m);
}
