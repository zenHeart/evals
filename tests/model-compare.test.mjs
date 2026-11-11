import test from 'node:test';
import assert from 'node:assert/strict';
import {candidateBenches,citationCounts,pairEligibility,variantOf,metricOf,headToHead,readCompareParams,compareParams,searchModels} from '../scripts/model-compare.mjs';
import {compareHTML} from '../scripts/compare-ui.mjs';

const pct=(metric)=>({comparison:'cross_model',unit:'percent',metric,min:0,max:100,direction:'higher'});
const uc={title:'编程开发',benchmarks:{
  hot:{...pct('resolve_rate'),name:'Hot Bench'},
  cold:{...pct('pass@1'),name:'Cold Bench'},
  ife:{...pct('prompt_strict_acc'),name:'IFEval'},
  desc:{comparison:'descriptive_only',unit:null,metric:null,min:null,max:null,name:'Arena'},
}};
const cites={hot:30,cold:10,ife:5,desc:50};
let n=0;
const ev=(benchmark_id,value,extra={})=>({id:'e'+(++n),benchmark_id,value,display:String(value),variant:'2.0',unit:'percent',status:'verified',score_status:'reported',attribution:'vendor_reported',...extra});
const M=(key,evidence)=>({key,id:key,name:key.toUpperCase(),vendor_label:'V',release_id:'r-'+key,evidence});

test('候选评测只含 cross_model 且归一化规则完整的项',()=>{
  assert.deepEqual(candidateBenches(uc),['hot','cold','ife']);
  assert.deepEqual(candidateBenches({benchmarks:{x:{comparison:'cross_model',unit:'percent',metric:'m',min:null,max:100}}}),[]);
});
test('引用次数按不同发布计数，同一发布多个变体只算一次',()=>{
  const rel=[{id:'r1',evidence:[{benchmark_id:'hot'},{benchmark_id:'hot'},{benchmark_id:'cold'}]},{id:'r2',evidence:[{benchmark_id:'hot'}]},{id:'r3',evidence:[]}];
  assert.deepEqual(citationCounts(rel,['hot','cold','ife']),{hot:2,cold:1,ife:0});
});
test('交集为空：不计算综合分，原始分数仍列出',()=>{
  const r=headToHead(uc,cites,M('a',[ev('hot',60)]),M('b',[ev('cold',70)]));
  assert.equal(r.composite,null);
  assert.match(r.reason,/无法综合对比/);
  assert.equal(r.onlyA.length,1);assert.equal(r.onlyB.length,1);
});
test('单项交集：综合分等于该项得分，并标记 single',()=>{
  const r=headToHead(uc,cites,M('a',[ev('ife',89.8,{metric:'prompt_strict_acc',variant:'strict prompt'})]),M('b',[ev('ife',84.1,{metric:'prompt_strict_acc',variant:'strict-prompt'})]));
  assert.equal(r.composite.n,1);assert.equal(r.composite.single.id,'ife');
  assert.equal(r.composite.a,89.8);assert.equal(r.composite.b,84.1);assert.equal(r.composite.winner,'a');
});
test('引用加权：高引用评测对综合分的影响更大',()=>{
  const A=M('a',[ev('hot',80),ev('cold',40)]),B=M('b',[ev('hot',60),ev('cold',90)]);
  const r=headToHead(uc,cites,A,B);
  // weight hot=30/40, cold=10/40
  assert.equal(r.composite.n,2);
  assert.ok(Math.abs(r.composite.a-(0.75*80+0.25*40))<1e-9);
  assert.ok(Math.abs(r.composite.b-(0.75*60+0.25*90))<1e-9);
  assert.equal(r.composite.winner,'a');
  assert.deepEqual(r.shared.map(x=>x.id),['hot','cold'],'按引用权重降序');
  // 交换引用次数后胜负翻转
  assert.equal(headToHead(uc,{...cites,hot:10,cold:30},A,B).composite.winner,'b');
});
test('全部引用为 0 时等权',()=>{
  const r=headToHead(uc,{},M('a',[ev('hot',80),ev('cold',40)]),M('b',[ev('hot',60),ev('cold',90)]));
  assert.equal(r.composite.a,60);assert.equal(r.composite.b,75);assert.equal(r.composite.equalWeights,true);
});
test('缺分不填 0，权重不向交集外重新分配',()=>{
  const r=headToHead(uc,cites,M('a',[ev('hot',80),ev('cold',10)]),M('b',[ev('hot',60)]));
  assert.equal(r.composite.n,1);assert.equal(r.composite.a,80);assert.equal(r.composite.b,60);
  assert.equal(r.shared[0].weight,1);
});
test('同一版本同一设置数值冲突：排除出交集并说明',()=>{
  const r=headToHead(uc,cites,M('a',[ev('hot',80),ev('hot',85),ev('cold',50)]),M('b',[ev('hot',60),ev('cold',40)]));
  assert.deepEqual(r.shared.map(x=>x.id),['cold']);
  assert.equal(r.excluded.length,1);assert.ok(r.excluded[0].conflict);assert.match(r.excluded[0].reason,/不一致/);
});
test('重复记录（同值）只算一次；多档设置只有相同档位才配对',()=>{
  assert.equal(headToHead(uc,cites,M('a',[ev('hot',80),ev('hot',80)]),M('b',[ev('hot',60)])).composite.a,80);
  const A=M('a',[ev('hot',80,{effort:'max'}),ev('hot',70,{effort:'high'})]),B=M('b',[ev('hot',60,{effort:'high'})]);
  const r=headToHead(uc,cites,A,B);assert.equal(r.composite.a,70);
  const r2=headToHead(uc,cites,A,M('b',[ev('hot',60,{effort:'low'}),ev('hot',62,{effort:'mid'})]));assert.equal(r2.composite,null);
});
test('仅作参考的评测永远不进入综合分',()=>{
  const r=headToHead(uc,cites,M('a',[ev('desc',1500,{unit:'elo'}),ev('hot',50)]),M('b',[ev('desc',1400,{unit:'elo'}),ev('hot',70)]));
  assert.equal(r.composite.n,1);assert.equal(r.reference.length,1);assert.equal(r.composite.b,70);
});
test('版本不同、竞品转述、未公布数值、单位或口径不同都不能配对',()=>{
  assert.equal(headToHead(uc,cites,M('a',[ev('hot',50,{variant:'2.0'})]),M('b',[ev('hot',60,{variant:'4.0'})])).composite,null);
  assert.ok(pairEligibility(ev('hot',50,{attribution:'comparison_cited'}),uc.benchmarks.hot));
  assert.ok(pairEligibility(ev('hot',null,{score_status:'not_reported'}),uc.benchmarks.hot));
  assert.ok(pairEligibility(ev('hot',50,{unit:'elo'}),uc.benchmarks.hot));
  assert.ok(pairEligibility(ev('hot',50,{variant:''}),uc.benchmarks.hot),'未写版本不能当作相同');
  assert.ok(pairEligibility(ev('ife',80,{metric:'accuracy'}),uc.benchmarks.ife),'IFEval 笼统 accuracy 与 prompt strict 不同口径');
  assert.equal(pairEligibility(ev('hot',80,{metric:'pass_rate'}),uc.benchmarks.hot),null,'通过率一族视为同一读数');
  assert.ok(pairEligibility(ev('hot',80,{metric:'avg@3 score'}),uc.benchmarks.hot));
});
test('版本号规范化：2 与 2.0 相同，v6 写法统一，日期区间不当版本',()=>{
  assert.equal(variantOf({variant:'2'}),variantOf({variant:'2.0, Terminus-2'}));
  assert.equal(variantOf({variant:'Terminal-Bench 4.0'}),'4.0');
  assert.equal(variantOf({variant:'LiveCodeBench v6'}),variantOf({variant:'V6 (25.02-25.05)'}));
  assert.notEqual(variantOf({variant:'10/01/2024-02/01/2025'}),'10.0');
  assert.equal(metricOf({metric:''},uc.benchmarks.hot),metricOf({metric:'Accuracy'},uc.benchmarks.hot));
});
test('同一模型或缺一侧不出综合分',()=>{
  const A=M('a',[ev('hot',80)]);
  assert.equal(headToHead(uc,cites,A,A).composite,null);
  assert.equal(headToHead(uc,cites,A,null).composite,null);
});
test('URL 参数可复现，非法 key 丢弃',()=>{
  const models=[M('x--1',[]),M('y--2',[])],ucs={coding:uc,w:uc};
  const s=readCompareParams(new URLSearchParams('task=w&a=x--1&b=nope'),ucs,models);
  assert.deepEqual(s,{task:'w',a:'x--1',b:''});
  assert.deepEqual(readCompareParams(compareParams(s),ucs,models),s);
  assert.equal(readCompareParams(new URLSearchParams('task=zzz'),ucs,models).task,'coding');
});
test('搜索按名称/厂商分词命中，本领域有分数的优先',()=>{
  const ms=[{...M('a--1',[]),name:'Claude Opus',vendor_label:'Anthropic'},{...M('b--1',[]),name:'Claude Sonnet',vendor_label:'Anthropic'},{...M('c--1',[]),name:'Qwen',vendor_label:'Alibaba'}];
  assert.deepEqual(searchModels(ms,'anthropic',{'b--1':2}).map(m=>m.key),['b--1','a--1']);
  assert.deepEqual(searchModels(ms,'claude opus').map(m=>m.key),['a--1']);
});
test('渲染：单项交集明确提示，仅作参考不画条形、不判胜负',()=>{
  const A=M('a',[ev('ife',89.8,{metric:'prompt_strict_acc',variant:'strict prompt'}),ev('desc',1500,{unit:'elo'})]),B=M('b',[ev('ife',84.1,{metric:'prompt_strict_acc',variant:'strict-prompt'})]);
  const html=compareHTML(headToHead(uc,cites,A,B),A,B,uc,'../');
  assert.match(html,/只有 <a [^>]+>IFEval<\/a> 一项可以直接对照，综合分就等于这一项的得分/);
  assert.match(html,/本次计入 <b>1<\/b> 项/);
  const ref=html.slice(html.indexOf('仅作参考'));
  assert.ok(!ref.includes('cbar')&&!ref.includes(' win'));
  assert.ok(!/已核验|待核验|证据账本|窗口起点/.test(html));
  const none=compareHTML(headToHead(uc,cites,M('a',[ev('hot',1)]),M('b',[ev('cold',2)])),M('a',[]),M('b',[]),uc,'../');
  assert.match(none,/无法综合对比/);
});
test('真实数据：文档写作目前只有 IFEval 可横向比较；对比数据只保留领域内记录',async()=>{
  const {loadBenchData}=await import('../scripts/load-data.mjs');const {compareData}=await import('../scripts/build-model-pages.mjs');
  const d=compareData(loadBenchData());
  assert.deepEqual(candidateBenches(d.useCases['chinese-longform-writing']),['ifeval']);
  const inDomain=new Set(Object.values(d.useCases).flatMap(u=>Object.keys(u.benchmarks)));
  assert.ok(d.models.every(m=>m.evidence.every(e=>inDomain.has(e.benchmark_id))));
  for(const [task,pairs] of Object.entries(d.suggestions))for(const p of pairs){
    const r=headToHead(d.useCases[task],d.citations[task],d.models.find(m=>m.key===p.a),d.models.find(m=>m.key===p.b));
    assert.ok(r.composite&&r.composite.n===p.n,'推荐对照必须能算出综合分');
    if(task==='chinese-longform-writing')assert.equal(r.composite.single?.id,'ifeval');
  }
});
test('领域只有一项可比评估时，明确说「这一领域目前只有 X 可横向比较」',()=>{
  const w={title:'文档写作',benchmarks:{ife:uc.benchmarks.ife,desc:uc.benchmarks.desc}};
  const A=M('a',[ev('ife',89.8,{metric:'prompt_strict_acc'})]),B=M('b',[ev('ife',84.1,{metric:'prompt_strict_acc'})]);
  assert.match(compareHTML(headToHead(w,cites,A,B),A,B,w,'../'),/这一领域目前只有 <a [^>]+>IFEval<\/a> 可横向比较，综合分就等于这一项的得分/);
});
