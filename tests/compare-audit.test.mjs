/**
 * /choose/ 对照可靠性回归：官方明明报了数值，对照里却按 0 计、被悄悄丢掉、或两边 0 比 0「分不出高下」。
 * 起因：Claude Fable 5.2 vs GPT-6 Astra（编程开发）显示 0.0 : 0.0。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {loadBenchData} from '../scripts/load-data.mjs';
import {compareData,mergeSameModel} from '../scripts/build-model-pages.mjs';
import {auditCompare} from '../scripts/compare-audit.mjs';
import {headToHead,rowIssue,variantOf,pickOne,pairBench,metricMatches,readCompareParams,setCompareRules,ruleFromRegistry} from '../scripts/model-compare.mjs';

const db=loadBenchData();
const d=compareData(db);
const audit=auditCompare(db,{pairs:false});
const byName=n=>d.models.find(m=>m.name===n);
const show=xs=>JSON.stringify(xs.slice(0,8),null,1)+(xs.length>8?`\n…共 ${xs.length} 条`:'');

test('全库：目录里有官方数值的评估都有明确的换算决定（计分或仅作参考）',()=>{
  assert.equal(audit.undecided.length,0,'以下评估有官方数值但没有换算规则，请在 data/compare-rules.json 写明 score / reference：\n'+show(audit.undecided));
});
test('全库：可计分评估上的官方数值不能因指标写法对不上而被悄悄丢掉',()=>{
  assert.equal(audit.stranded.length,0,'以下官方数值因单位 / 指标写法不计分，且未在 compare-rules.json 的 metric_aliases（同义）或 reviewed_metric_mismatch（确属不同口径）登记：\n'+show(audit.stranded));
});
test('全库：每个记录的评估 id 都能对上评估档案、别名，或已说明为何不进对照',()=>{
  assert.equal(audit.orphans.length,0,'以下评估 id 没有档案 / 别名 / unmapped_ids 说明（例如 frontier-swe-v2 曾因此整列丢失）：\n'+show(audit.orphans));
});
test('全库：每个领域里，都有可计分官方数值的两个模型不会因「指标对不上」而 0 比 0',()=>{
  // 0:0 只允许来自真实原因（版本 / 测试条件不同、多档设置、待转录）；不允许来自 metric 类排除
  const a=auditCompare(db);
  for(const [dom,s] of Object.entries(a.stalemates)){
    const bad=s.list.filter(p=>p.excludedBy?.metric&&Object.keys(p.excludedBy).length===1);
    assert.equal(bad.length,0,dom+' 有只因指标写法而 0:0 的对照：\n'+show(bad));
  }
});
test('截图回归：Claude Fable 5.2 vs GPT-6 Astra（编程开发）不再 0:0，三项双方都有官方数值',()=>{
  const A=byName('Claude Fable 5.2'),B=byName('GPT-6 Astra');
  assert.ok(A&&B,'两个模型都在对照库里');
  const r=headToHead(d.useCases.coding,A,B);
  assert.ok(r.composite,'能综合对比');
  assert.ok(r.composite.hasA>0&&r.composite.hasB>0,'双方都有计入的分数');
  assert.ok(r.composite.a>0&&r.composite.b>0,'综合分不是 0:0');
  const row=id=>r.rows.find(x=>x.id===id);
  for(const id of ['frontierswe','frontier-code','terminal-bench-science']){
    assert.equal(row(id)?.status,'scored',id+' 计入');
    assert.equal(row(id).a.state,'value',id+' Fable 5.2 有数值');assert.equal(row(id).b.state,'value',id+' Astra 有数值');
  }
  assert.equal(row('frontierswe').na,69.9);assert.equal(row('frontierswe').nb,65.5);
  assert.equal(row('frontier-code').na,49.1);assert.equal(row('frontier-code').nb,42.8,'FrontierCode 2.0 同版本同口径（Score）配对');
  // MultiLangBench：Astra 的 20 语言平均分计入，COBOL 等单语言切片不混入
  assert.equal(row('multilangbench')?.b.state,'value');assert.equal(row('multilangbench').nb,87.4);
});
test('frontier-swe-v2 并入 frontierswe（同一官方榜单 V2）',()=>{
  assert.equal(db.benchmarkAliases['frontier-swe-v2'],'frontierswe');
  assert.ok(!db.releases.some(r=>r.evidence.some(e=>e.benchmark_id==='frontier-swe-v2')));
});
test('MultiLangBench：只计 20 语言平均，单语言切片（COBOL 等）不混入',()=>{
  const c=d.useCases.coding.catalog.find(b=>b.id==='multilangbench');
  assert.ok(c?.eligible);
  const ok=e=>!rowIssue(e,c.rule);
  const base={benchmark_id:'multilangbench',value:80,unit:'percent',status:'verified',score_status:'reported'};
  assert.ok(ok({...base,metric:'20 种编程语言上的平均测试通过率（越高越好）'}));
  assert.ok(!ok({...base,metric:'COBOL 测试通过率'}));
});
test('指标写法：登记的同义写法、avg@k、exact_match 视为同一口径；Elo 不视为百分比',()=>{
  const pass={unit:'percent',metric:'accuracy',min:0,max:100,allowNullMetric:true,aliases:[]};
  assert.ok(metricMatches({metric:'avg@3'},pass));
  assert.ok(metricMatches({metric:'exact_match'},pass));
  assert.ok(metricMatches({metric:'resolution_rate'},{...pass,metric:'resolve_rate'}));
  assert.ok(!metricMatches({metric:'elo'},pass));
  assert.ok(metricMatches({metric:'Agentic terminal coding, best published harness'},{...pass,metric:'score',aliases:['agentic terminal coding, best published harness']}));
  assert.ok(!metricMatches({metric:null},{...pass,metric:'score',allowNullMetric:false}),'FrontierCode：没写 score / pass rate 的不计');
});
test('版本写法：v1.1 与 1.1 相同；Main 与 Extended 不同；最新版本优先',()=>{
  assert.equal(variantOf({variant:'v1.1'}),variantOf({variant:'1.1'}));
  assert.equal(variantOf({variant:'v6'}),variantOf({variant:'6'}));
  assert.notEqual(variantOf({variant:'1.1 Main'}),variantOf({variant:'1.1 Extended'}));
  const ev=(v,value)=>({benchmark_id:'x',variant:v,value,unit:'percent',status:'verified',score_status:'reported'});
  assert.equal(pickOne([ev('1.1 Main',53.3),ev('2.0',42.8)]).row.value,42.8,'旧版本行存在时取最新版本，不整项排除');
  assert.equal(pairBench([ev('2.0',49.1),ev('1.1 Main',60)],[ev('2.0',42.8)]).b.value,42.8);
  assert.ok(pairBench([ev('',1)],[ev('',2)]).excluded,'默认：双方都没写版本不配对');
  assert.ok(!pairBench([ev('',1)],[ev('',2)],{singleVersion:true}).excluded,'登记为唯一版本的评估可配对');
  assert.ok(pairBench([ev('',1)],[ev('Plus',2)],{singleVersion:true}).excluded,'写明的变体仍须一致');
});
test('同一模型出现在多篇发布里：合并为一个对照对象，旧 key 仍能打开',()=>{
  const ids=d.models.map(m=>(m.vendor_id||m.vendor_label)+'|'+m.id);
  assert.equal(new Set(ids).size,ids.length,'没有重复的模型');
  const ev=(b,v)=>({benchmark_id:b,value:v,variant:'',unit:'percent',status:'verified',score_status:'reported'});
  const out=mergeSameModel([{key:'r1--m',id:'m',vendor_id:'v',evidence:[ev('a',1)]},{key:'r2--m',id:'m',vendor_id:'v',evidence:[ev('a',1),ev('b',2)]}]);
  assert.equal(out.length,1);assert.equal(out[0].key,'r2--m');assert.deepEqual(out[0].aliases,['r1--m']);assert.equal(out[0].evidence.length,2);
  const p=readCompareParams(new URLSearchParams('task=coding&a=r1--m'),{coding:{}},out);
  assert.equal(p.a,'r2--m');
});
test('登记表：Elo / 胜率 / 双口径评估不进综合分',()=>{
  setCompareRules(db.compareRules);
  const find=id=>Object.values(d.useCases).flatMap(u=>u.catalog).find(b=>b.id===id);
  for(const id of ['arc-agi','economically-important-tasks','aider','swe-lancer'])assert.equal(find(id)?.eligible,false,id+' 仅作参考');
  const cf=find('codeforces');
  assert.ok(rowIssue({benchmark_id:'codeforces',value:2701,unit:'elo',metric:'elo',status:'verified',score_status:'reported'},cf.rule),'Codeforces Elo 不当百分比');
  assert.ok(ruleFromRegistry('frontier-code')?.rule,'FrontierCode 有登记的计分规则');
});
