/**
 * 发布页同表竞品列（data/competitor-columns/）：数据契约 + 同表证据进入对照的规则。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {headToHead} from '../scripts/model-compare.mjs';
import {fairVerdict,buildSameTables,sameTableHits,domainObservations,SAME_TABLE_WEIGHT,weightOf} from '../scripts/fair-compare.mjs';
import {compareHTML} from '../scripts/compare-ui.mjs';

function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rule={unit:'percent',metric:'accuracy',min:0,max:100,direction:'higher',allowNullMetric:true,aliases:[]};
const bench=(id,cite=10)=>({id,name:id.toUpperCase(),cite,eligible:true,rule,source:'test'});
const ev=(id,value,{variant='1.0',eid}={})=>({id:eid||'e-'+id+'-'+value,benchmark_id:id,value,display:value+'%',unit:'percent',metric:'accuracy',status:'verified',score_status:'reported',variant});
const M=(key,vendor,evidence)=>({key,id:key,name:key.toUpperCase(),release_id:key,vendor_id:vendor,vendor_label:vendor.toUpperCase(),evidence});
/** 一篇发布页：宿主模型 host 在评估 b 上自报 hostValue，同一行列出 cols={模型 id: 数值} */
const doc=(rel,vendor,rows)=>({release_id:rel,reported_by_vendor:vendor,attribution_type:'third_party_reported_by_vendor',
  columns:rows.flatMap(([hostEid,cols])=>Object.entries(cols).map(([mid,v])=>({host_evidence_id:hostEid,model_id:mid,value:v,display:v+'%'})))});

test('构建：竞品列挂到宿主行；未知模型、宿主自己、同 id 多家都不进入',()=>{
  const H=M('h','vh',[ev('x',70,{eid:'hx'})]),A=M('a','va',[]),B=M('b','vb',[]);
  const dup1={...M('d1','v1',[]),id:'dup'},dup2={...M('d2','v2',[]),id:'dup'};
  const T=buildSameTables([doc('r1','vh',[['hx',{a:60,b:50,h:99,nope:1,dup:3}]])],[H,A,B,dup1,dup2]);
  assert.deepEqual(Object.keys(T.rows),['hx']);
  const cells=T.rows.hx.cells;
  assert.deepEqual(Object.keys(cells).sort(),['a','b','h']);
  assert.equal(cells.h[0],70,'宿主格用宿主自报值，不用竞品列里的同名列');
  assert.equal(cells.h[3],1);assert.equal(cells.a[3],0);
  assert.equal(T.rows.hx.b,'x');assert.equal(T.rows.hx.by,'vh');
});

test('双方都有自报：以自报为准，同表数值只作「另见」，不一致时标出、不取平均',()=>{
  const dom={title:'测试',catalog:[bench('x')]};
  const H=M('h','vh',[ev('x',70,{eid:'hx'})]);
  const A=M('a','va',[ev('x',64.6)]),B=M('b','vb',[ev('x',74.6)]);
  const T=buildSameTables([doc('r1','vh',[['hx',{a:68.1,b:74.6}]])],[H,A,B]);
  const res=headToHead(dom,A,B);
  const v0=fairVerdict(res,{A,B});const z0=v0.Z;
  const v=fairVerdict(res,{A,B,tables:T});
  assert.equal(v.k,1);assert.equal(v.kt,0);assert.ok(Math.abs(v.Z-z0)<1e-12,'同表数值不改变自报同题对照');
  assert.equal(res.rows[0].a.row.value,64.6,'主值仍是自报 64.6');
  const alts=res.rows[0].alts;
  assert.equal(alts.length,2);
  assert.deepEqual(alts.map(x=>[x.who,x.value,x.differs]),[['a',68.1,true],['b',74.6,false]]);
  const html=compareHTML(res,A,B,dom,'../',{tables:T});
  assert.match(html,/另见/);assert.match(html,/与自报不同，以自报为准/);
});

test('补缺：没有自报共同评估时用同表行补上对照，半权，只靠同表最多「略占优」',()=>{
  const cat=Array.from({length:6},(_,i)=>bench('x'+i,50));
  const dom={title:'测试',catalog:cat};
  const H=M('h','vh',cat.map((c,i)=>ev(c.id,50,{eid:'h'+i})));
  const A=M('a','va',cat.map(c=>ev(c.id,90))),B=M('b','vb',[]);
  const rows=cat.map((c,i)=>['h'+i,{a:95,b:20}]);
  const T=buildSameTables([doc('r1','vh',rows)],[H,A,B]);
  const v0=fairVerdict(headToHead(dom,A,B),{A,B});
  assert.equal(v0.k,0);assert.equal(v0.leader,null);
  const res=headToHead(dom,A,B);
  const v=fairVerdict(res,{A,B,tables:T});
  assert.equal(v.k,0);assert.equal(v.kt,6);assert.equal(v.basis,'table');
  assert.equal(v.leader,'a');assert.equal(v.level,'lean','差距再大，只靠同表数据也不判「明显领先」');
  assert.equal(v.confidence,'medium','发布方不是其中一方：6 项按半项计 → 中');
  assert.ok(Math.abs(v.tabled[0].table.w-weightOf(50)*SAME_TABLE_WEIGHT)<1e-12,'半权');
  assert.ok(Math.abs(v.tMeanA-95)<1e-9&&Math.abs(v.tMeanB-20)<1e-9);
  const html=compareHTML(res,A,B,dom,'../',{tables:T});
  assert.match(html,/同表对照/);assert.match(html,/按发布页同表数据，<b>A<\/b> 略占优/);
  assert.ok(!/计 0|记 0|综合分|已核验|待核验|证据账本|窗口起点/.test(html));
  // 发布方就是其中一方（B 的厂商发的表）→ 可信度低
  const T2=buildSameTables([doc('r2','vb',rows)],[H,A,B]);
  const v2=fairVerdict(headToHead(dom,A,B),{A,B,tables:T2});
  assert.equal(v2.homeOnly,true);assert.equal(v2.confidence,'low');assert.equal(v2.level,'lean');
});

test('同一评估多张表：平分半权；同一发布方重复印出同一组数值只算一次',()=>{
  const dom={title:'测试',catalog:[bench('x',30)]};
  const H1=M('h1','v1',[ev('x',50,{eid:'p'})]),H2=M('h2','v1',[ev('x',51,{eid:'q'})]),H3=M('h3','v3',[ev('x',52,{eid:'r'})]);
  const A=M('a','va',[]),B=M('b','vb',[]);
  const T=buildSameTables([doc('r1','v1',[['p',{a:80,b:60}]]),doc('r2','v1',[['q',{a:80,b:60}]]),doc('r3','v3',[['r',{a:70,b:72}]])],[H1,H2,H3,A,B]);
  const hits=sameTableHits(T,{id:'x',rule},'a','b',['va','vb']);
  assert.equal(hits.length,2,'v1 两篇发布页同样的 80 vs 60 只算一次');
  const v=fairVerdict(headToHead(dom,A,B),{A,B,tables:T});
  assert.ok(Math.abs(v.tabled[0].table.hits[0].w-weightOf(30)*SAME_TABLE_WEIGHT/2)<1e-12);
});

test('不变式（随机 1500 组，含同表证据）：全部对照都不低于对方就不会被判落后；交换对称',()=>{
  const r=rng(1113);let dom=0;
  for(let t=0;t<1500;t++){
    const nb=2+Math.floor(r()*6);
    const cat=Array.from({length:nb},(_,i)=>bench('b'+i,Math.floor(r()*60)));
    const H=M('h','vh',cat.map((c,i)=>ev(c.id,50,{eid:'h'+i})));
    const A=M('a','va',cat.filter(()=>r()<0.4).map(c=>ev(c.id,Math.round(r()*1000)/10)));
    const B=M('b','vb',cat.filter(()=>r()<0.4).map(c=>ev(c.id,Math.round(r()*1000)/10)));
    const rows=cat.filter(()=>r()<0.5).map(c=>['h'+cat.indexOf(c),{a:Math.round(r()*1000)/10,b:Math.round(r()*1000)/10}]);
    const T=buildSameTables([doc('r','vh',rows)],[H,A,B]);
    const d={title:'t',catalog:cat};
    const v=fairVerdict(headToHead(d,A,B),{A,B,tables:T});
    const ds=[...v.shared.map(x=>x.gap.d),...v.tabled.flatMap(x=>x.table.hits.map(h=>h.d))];
    if(ds.length&&ds.every(x=>x>=0)&&ds.some(x=>x>0)){dom++;assert.notEqual(v.leader,'b');}
    if(ds.length&&ds.every(x=>x<=0)&&ds.some(x=>x<0))assert.notEqual(v.leader,'a');
    if(!v.k)assert.notEqual(v.level,'clear','没有自报同题对照不判明显领先');
    const w=fairVerdict(headToHead(d,B,A),{A:B,B:A,tables:T});
    assert.equal(w.leader,v.leader==='a'?'b':v.leader==='b'?'a':null);assert.equal(w.level,v.level);assert.equal(w.kt,v.kt);
  }
  assert.ok(dom>100);
});

test('全库估计：同表数值只给「自己没有这项自报」的模型补观测',()=>{
  const dom={catalog:[bench('x'),bench('y')]};
  const H=M('h','vh',[ev('x',50,{eid:'hx'}),ev('y',40,{eid:'hy'})]);
  const A=M('a','va',[ev('x',90)]),B=M('b','vb',[]);
  const T=buildSameTables([doc('r','vh',[['hx',{a:10,b:30}],['hy',{a:77}]])],[H,A,B]);
  const obs=domainObservations(dom,[H,A,B],T);
  const get=(k,i)=>obs.filter(o=>o.key===k&&o.item===i);
  assert.deepEqual(get('a','x#1.0').map(o=>[o.y,!!o.table]),[[90,false]],'A 自报 90 为准，不混入同表 10');
  assert.deepEqual(get('a','y#1.0').map(o=>[o.y,!!o.table]),[[77,true]]);
  assert.deepEqual(get('b','x#1.0').map(o=>[o.y,!!o.table]),[[30,true]]);
  assert.equal(domainObservations(dom,[H,A,B]).filter(o=>o.table).length,0,'不传同表数据时与原口径一致');
});

// ---------------- 数据契约（真实数据）
test('数据：每条竞品列都有来源、发布方、宿主行与复核方式，来源类型与自报分开',async()=>{
  const {loadBenchData}=await import('../scripts/load-data.mjs');
  const db=loadBenchData();
  const docs=db.competitorColumns;
  assert.ok(docs.length>=30,'至少 30 篇发布页');
  const evid=new Map(db.releases.flatMap(r=>(r.evidence||[]).map(e=>[e.id,{r,e}])));
  let n=0;
  for(const d of docs){
    assert.equal(d.attribution_type,'third_party_reported_by_vendor',d._file);
    assert.ok(d.release_id&&d.reported_by_vendor&&d.retrieved_at&&d.last_verified_at,d._file);
    const seen=new Set();
    for(const c of d.columns){
      n++;
      assert.ok(Number.isFinite(c.value),d._file);
      assert.ok(/^https?:\/\//.test(c.source_url),d._file);
      assert.ok(['dom_table','reader_markdown','page_text'].includes(c.verification?.method),d._file);
      assert.ok(c.model_label&&c.host_evidence_id&&c.benchmark_id,d._file);
      const h=evid.get(c.host_evidence_id);
      assert.ok(h,`${d._file}: 宿主行 ${c.host_evidence_id} 不在账本里`);
      assert.equal(h.r.id,d.release_id,`${d._file}: 宿主行必须属于这篇发布`);
      const k=c.host_evidence_id+'|'+c.model_label+'|'+c.value;
      assert.ok(!seen.has(k),`${d._file}: 重复格 ${k}`);seen.add(k);
    }
  }
  assert.ok(n>=1500);
});

test('真实数据回归：Astra 的 Terminal-Bench-Science——自报 64.6 为主，Anthropic 同表 68.1 只作「另见」',async()=>{
  const {loadBenchData}=await import('../scripts/load-data.mjs');const {compareData}=await import('../scripts/build-model-pages.mjs');
  const d=compareData(loadBenchData());const u=d.useCases.coding;
  const k=s=>d.models.find(m=>m.key===s||(m.aliases||[]).includes(s));
  const A=k('claude-fable-5-2--claude-fable-5-2'),B=k('gpt-6-astra--gpt-6-astra');
  const res=headToHead(u,A,B);
  const v=fairVerdict(res,{sizes:d.sizes,est:u.est,A,B,tables:d.tables});
  const tbs=res.rows.find(r=>r.id==='terminal-bench-science');
  assert.equal(tbs.b.row.value,64.6);
  assert.ok(tbs.alts.some(x=>x.who==='b'&&x.value===68.1&&x.differs&&x.rel==='claude-fable-5-2'));
  assert.equal(v.k,3);assert.equal(v.leader,'a');
  // 同一 Anthropic 表里的 FrontierCode 2.0（GPT-6 Astra 42.8%）与自报一致
  assert.ok(res.rows.find(r=>r.id==='frontier-code').alts.some(x=>x.who==='b'&&x.value===42.8&&!x.differs));
});

test('真实数据回归：GPT-5.6 Sol vs GPT-5.5 没有自报共同评估，靠发布页同表补上对照',async()=>{
  const {loadBenchData}=await import('../scripts/load-data.mjs');const {compareData}=await import('../scripts/build-model-pages.mjs');
  const d=compareData(loadBenchData());const u=d.useCases.coding;
  const k=s=>d.models.find(m=>m.key===s||(m.aliases||[]).includes(s));
  const A=k('gpt-5-6--gpt-5-6-sol'),B=k('gpt-5-5--gpt-5-5');
  const res=headToHead(u,A,B);
  assert.equal(fairVerdict(res,{sizes:d.sizes,est:u.est,A,B}).k,0);
  const v=fairVerdict(res,{sizes:d.sizes,est:u.est,A,B,tables:d.tables});
  assert.ok(v.kt>=3);assert.equal(v.leader,'a');assert.equal(v.level,'lean');
});
