import {mkdirSync,writeFileSync,copyFileSync} from 'node:fs';
import {join} from 'node:path';
import {SHELL_CSS,shellHead,shellTopbar,shellFooter,SHELL_JS} from './site-shell.mjs';
import {esc,MODEL_CSS,evidenceHTML,specsHTML} from './model-ui.mjs';
import {citationCounts,headToHead,domainCatalog,setCompareRules} from './model-compare.mjs';
import {COMPARE_CSS} from './compare-ui.mjs';
import {domainObservations,fitAbility,compactEstimates} from './fair-compare.mjs';
export function selectionData(db){
  const models=db.releases.flatMap(r=>r.model_specs.filter(m=>m.id).map(m=>({...m,key:r.id+'--'+m.id,release_id:r.id,release_date:r.release_date,vendor_id:r.vendor_id,vendor_label:r.vendor_label,region:r.region,evidence:r.evidence.filter(e=>e.model_id===m.id)})));
  return {
    asOf:[db.coverage.window_until,...db.releases.flatMap(r=>r.evidence.map(e=>e.last_verified_at))].filter(Boolean).sort().pop()||new Date().toISOString().slice(0,10),
    useCase:db.useCase,
    useCases:db.useCases,
    models
  };
}
/** /choose/ 专用的瘦身数据：只保留领域目录内评测的记录与对照所需字段（selection-data.json 有数 MB，不适合首屏） */
/** 领域按真实用途划分（「我要拿模型来做 X」），不按学术分类；编程开发数据最充分，作为默认领域 */
const DOMAIN_LABEL={coding:'编程开发','chinese-longform-writing':'文档写作'},DOMAIN_ORDER=['coding','office-business','computer-use','research-search','knowledge-reasoning','vision-documents','chinese-longform-writing','quant-finance'];
const KEEP=['id','benchmark_id','variant','metric','unit','value','display','status','score_status','attribution','harness','effort'];
/** 领域目录（含引用次数与 0–100 换算规则），构建期算好随数据下发，浏览器不再重复推导 */
export function domainCatalogs(db){
  setCompareRules(db.compareRules);
  const entities=Object.fromEntries(db.benchmarks.map(b=>[b.id,{name:b.name,metrics:b.metrics||[]}]));
  const official=db.releases.filter(r=>r.source_kind);
  const allIds=[...new Set([...Object.keys(entities),...Object.values(db.useCases).flatMap(u=>[...Object.keys(u.benchmarks||{}),...(u.catalog||[])])])];
  const cites=citationCounts(official,allIds);
  return Object.fromEntries(Object.entries(db.useCases).map(([id,u])=>[id,domainCatalog(u,entities,cites)]));
}
export function compareData(db){
  const sd=selectionData(db);
  const catalogs=domainCatalogs(db);
  const inDomain=new Set(Object.values(catalogs).flatMap(c=>c.map(b=>b.id)));
  const titles=Object.fromEntries(db.releases.map(r=>[r.id,r.release_title||'']));
  const models=mergeSameModel(sd.models.map(m=>({key:m.key,id:m.id,name:m.name,vendor_id:m.vendor_id,vendor_label:m.vendor_label,release_id:m.release_id,release_date:m.release_date||null,release_title:titles[m.release_id]||'',
    evidence:m.evidence.filter(e=>inDomain.has(e.benchmark_id)).map(e=>Object.fromEntries(KEEP.filter(k=>e[k]!==undefined&&e[k]!==null&&e[k]!=='').map(k=>[k,e[k]])))})));
  // 领域顺序与读者标签：编程数据最充分，作为默认领域；新增领域时在这里补标签即可
  const order=Object.keys(db.useCases).sort((a,b)=>(DOMAIN_ORDER.indexOf(a)+1||99)-(DOMAIN_ORDER.indexOf(b)+1||99));
  const useCases=Object.fromEntries(order.map(id=>{const u=db.useCases[id];return [id,{id,title:DOMAIN_LABEL[id]||u.title,description:u.description,catalog:catalogs[id]}];}));
  // 全库能力估计（构建期拟合一次，随数据下发）：数据太稀的领域不给估计
  for(const u of Object.values(useCases)){
    const fit=fitAbility(domainObservations(u,models));
    u.est=compactEstimates(fit);
    u.estMeta={models:Object.keys(fit.models).length,insufficient:fit.insufficient};
  }
  // 题量登记（同题对照的误差估计）：只下发题量，不下发出处说明
  const sizes=Object.fromEntries(Object.entries(db.compareRules?.sample_sizes||{}).filter(([k])=>!k.startsWith('_')).map(([k,v])=>[k,{...(v.n?{n:v.n}:{}),...(v.variants?{variants:v.variants}:{})}]));
  return {asOf:sd.asOf,useCases,models,sizes,suggestions:suggestPairs(useCases,models)};
}
/**
 * 同一厂商的同一模型 id 出现在多篇官方发布里（如 GA 公告、评测专文与首发页）时合并成一个可选模型：
 * 记录取并集（完全相同的记录只留一条），key 用记录最多的那篇发布，其余 key 记进 aliases，旧链接仍能打开。
 * 不合并不同的模型 id（变体之间不互相借分）。
 */
export function mergeSameModel(models){
  const groups=new Map();
  for(const m of models){const g=(m.vendor_id||m.vendor_label)+'|'+m.id;if(!groups.has(g))groups.set(g,[]);groups.get(g).push(m);}
  const out=[];
  for(const ms of groups.values()){
    if(ms.length===1){out.push(ms[0]);continue;}
    const p=[...ms].sort((a,b)=>b.evidence.length-a.evidence.length||String(b.release_date||'').localeCompare(String(a.release_date||''))||a.key.localeCompare(b.key))[0];
    const seen=new Set(),evidence=[];
    for(const m of [p,...ms.filter(x=>x!==p)])for(const e of m.evidence){const k=JSON.stringify([e.benchmark_id,e.variant||'',e.metric||'',e.unit||'',e.value??null,e.status,e.score_status]);if(seen.has(k))continue;seen.add(k);evidence.push(e);}
    out.push({...p,evidence,aliases:ms.filter(x=>x!==p).map(x=>x.key)});
  }
  return out;
}
/** 推荐对照：每个领域取「双方都有真实数值」的可计分评估最多、优先跨厂商、发布较新的几组，避免同一模型反复出现 */
export function suggestPairs(useCases,models,limit=4){
  const out={};
  for(const [id,u] of Object.entries(useCases)){
    const ids=new Set(u.catalog.filter(b=>b.eligible).map(b=>b.id));
    const ms=models.filter(m=>m.evidence.some(e=>ids.has(e.benchmark_id)));
    const all=[];
    for(let i=0;i<ms.length;i++)for(let j=i+1;j<ms.length;j++){
      const r=headToHead(u,ms[i],ms[j]);
      if(r.composite&&r.composite.both>0){const [a,b]=String(ms[i].release_date||'')>=String(ms[j].release_date||'')?[ms[i],ms[j]]:[ms[j],ms[i]];all.push({a:a.key,b:b.key,n:r.composite.both,x:a.vendor_label!==b.vendor_label?1:0,d:String(b.release_date||'')});}
    }
    // 优先跨厂商对照（同家族型号互比信息量低），再看双方都有分的项数与发布新旧
    all.sort((x,y)=>y.x-x.x||y.n-x.n||y.d.localeCompare(x.d)||x.a.localeCompare(y.a)||x.b.localeCompare(y.b));
    const used={},pick=[];
    for(const p of all){if(pick.length>=limit)break;if(used[p.a]||used[p.b])continue;used[p.a]=used[p.b]=1;pick.push(p);}
    out[id]=pick;
  }
  return out;
}
function page(title,path,rel,active,body,script='',opt={}){
 return `${shellHead({title,desc:title+' · 查看来源、规格与可比性边界',path,rel,extra:`<style>${SHELL_CSS}${MODEL_CSS}${opt.css||''}</style>`})}</head><body>${shellTopbar(rel,active)}<main id="main-content" class="${opt.mainClass||'model-main'}">${body}</main>${shellFooter()}${SHELL_JS}${script}</body></html>`;
}
function save(dist,path,html){const dir=join(dist,path);mkdirSync(dir,{recursive:true});writeFileSync(join(dir,'index.html'),html);}
const classificationLabels={general:'通用模型',vertical:'专项模型',product:'产品更新',unknown:'类别未确认'};
export function buildModelPages(db,dist){
 const data=selectionData(db);
 mkdirSync(join(dist,'assets'),{recursive:true});
 for(const f of ['model-selection.mjs','model-ui.mjs','model-compare.mjs','fair-compare.mjs','compare-ui.mjs','choose-client.mjs','models-client.mjs'])copyFileSync(new URL(f,import.meta.url),join(dist,'assets',f));
 writeFileSync(join(dist,'assets','selection-data.json'),JSON.stringify(data));
 const cmp=compareData(db);
 writeFileSync(join(dist,'assets','compare-data.json'),JSON.stringify(cmp));
 const candidateFor=r=>db.coverage.candidates.find(c=>c.release_id===r.id);
 for(const r of db.releases){
  const c=candidateFor(r);
  const body=`<a href="../">← 模型目录</a><h1>${esc(r.models.join(' / ')||r.release_title)}</h1><p>${esc(r.vendor_label)} · ${esc(r.release_date||'官方发布日期未说明')}${r.date_precision==='month'?'（仅精确到月）':''} · ${esc(classificationLabels[c?.classification||'unknown'])}</p>
   <p>${r.source_url?`<a href="${esc(r.source_url)}">官方发布来源</a>`:''} · <a href="../../choose/">按需求选型</a> · <a href="../../coverage/">查看覆盖缺口</a>${c?.archive_path?` · <a href="https://github.com/zenHeart/evals/tree/main/${esc(c.archive_path)}">归档与转录记录</a>`:''}</p>
   ${!r.evidence.length?'<div class="notice">所收录官方页面未披露量化评测。此模型仍可查询，但不能据此进入分数排序。</div>':''}
   ${r.model_specs.map(m=>`<section class="model-card" id="${esc(m.id)}"><h2>${esc(m.name)}</h2><p>${esc(m.capability_summary||'本发布尚无能力概述。')}</p>${specsHTML(m)}<h3>本变体的评测证据</h3>${evidenceHTML(r.evidence.filter(e=>e.model_id===m.id),'../../',data.asOf)}</section>`).join('')}
   ${r.evidence.some(e=>!r.model_specs.some(m=>m.id===e.model_id))?`<section class="model-card"><h2>未关联到本页变体的记录</h2><p>这些记录不会分配给任意模型参与选型。</p>${evidenceHTML(r.evidence.filter(e=>!r.model_specs.some(m=>m.id===e.model_id)),'../../',data.asOf)}</section>`:''}`;
  save(dist,'models/'+r.id,page(r.models.join(' / ')||r.release_title,'models/'+r.id+'/','../../','releases',body));
 }
 const cards=db.releases.map(r=>{const c=candidateFor(r);return `<article class="model-card" data-model data-search="${esc((r.models.join(' ')+' '+r.vendor_label).toLowerCase())}" data-class="${c?.classification||'unknown'}" data-modalities="${esc([...new Set(r.model_specs.flatMap(m=>m.modalities||[]))].join(','))}"><h2><a href="${r.id}/">${esc(r.models.join(' / ')||r.release_title)}</a></h2><p>${esc(r.vendor_label)} · ${esc(r.release_date||'日期未说明')}</p><p>${esc(classificationLabels[c?.classification||'unknown'])} · ${esc([...new Set(r.model_specs.flatMap(m=>m.modalities||[]))].join(' / ')||'输入模态未说明')}</p><p>${r.evidence.length?r.evidence.length+' 条评测记录；是否可比需逐条检查。':'所收录来源未披露量化评测。'}</p></article>`;}).join('');
 save(dist,'models',page('模型目录','models/','../','releases',`<h1>模型目录</h1><p>通用与专项模型都可查询；是否能比较取决于评测证据。<a href="../coverage/">覆盖与缺口</a> · <a href="../releases/">发布时间轴</a></p><form class="model-controls form-row" id="model-filters"><label>搜索模型<input name="q" type="search"></label><label>输入模态<select name="modality"><option value="">全部</option>${['文本','图像','音频','视频'].map(x=>`<option>${x}</option>`).join('')}</select></label><label>模型类别<select name="classification"><option value="">全部</option>${Object.entries(classificationLabels).map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></label><button type="reset">清除筛选</button></form><p id="model-count" role="status"></p><p id="model-empty" hidden>没有匹配模型，清除筛选可恢复全部目录。</p><div class="model-grid">${cards}</div>`,`<script type="module" src="../assets/models-client.mjs"></script>`));
 const stateLabels={not_scanned:'尚未检查',partial:'已检查入口，历史与分页未穷尽',needs_render:'动态内容尚需读取',inaccessible:'本次读取失败'};
 const coverage=db.vendors.filter(v=>v.active).map(v=>{const cov=db.coverage.vendors.find(x=>x.vendor_id===v.id);const cs=db.coverage.candidates.filter(c=>c.vendor_id===v.id);return `<section class="model-card"><h2>${esc(v.display_name)}</h2><p>已收录 ${db.releases.filter(r=>r.vendor_id===v.id).length} 场发布；发现 ${cs.length} 条线索。线索尚需逐项确认，不能代表全部模型。</p><ul>${(cov?.entries||[]).map(e=>`<li><a href="${esc(e.url)}">${esc(e.url)}</a>：${esc(stateLabels[e.status])} · ${esc(e.last_scanned_at||'无检查记录')}${e.failure_reason?' · '+esc(e.failure_reason):''}</li>`).join('')}</ul><details><summary>模型家族与回填清单</summary><ul>${cs.map(c=>`<li><a href="${esc(c.official_urls[0])}">${esc(c.family)}</a> · ${c.release_id?`<a href="../models/${esc(c.release_id)}/">模型档案</a>`:'尚未建档'} · ${esc(c.exclusion_reason|| (c.evidence_status==='not_reported'?'所收录页面没有量化评测':c.archive_status==='archived'?'来源已归档，数值以模型页为准':'需要读取详情并确认是否为模型发布'))}</li>`).join('')||'<li>尚无可确认的模型家族线索，不能据此认定厂商没有发布。</li>'}</ul></details></section>`;}).join('');
 save(dist,'coverage',page('模型覆盖与缺口','coverage/','../','releases',`<h1>模型覆盖与缺口</h1><p>最近检查：${esc(db.coverage.last_scan_at||'尚未开始')}。增量窗口 ${esc(db.coverage.window_since)} 至 ${esc(db.coverage.window_until)}。历史回填独立于此窗口。</p><p class="notice">公开模型目录仍在补全。入口读取成功、模型存在、已建档、已有可比较分数是不同状态；下面逐项显示检查范围和缺口。</p>${coverage}`));
 
 const domains=Object.values(cmp.useCases);
 const byKey=Object.fromEntries(cmp.models.map(m=>[m.key,m]));
 const firstTask=domains[0]?.id||'';
 const suggHTML=(task)=>`<ul class="sugg" role="list">${(cmp.suggestions[task]||[]).map(p=>{const a=byKey[p.a],b=byKey[p.b];return `<li><a href="?task=${esc(task)}&amp;a=${esc(p.a)}&amp;b=${esc(p.b)}" data-pair="${esc(task)}|${esc(p.a)}|${esc(p.b)}"><b>${esc(a.name)}</b> 对比 <b>${esc(b.name)}</b><small>${esc(a.vendor_label)} / ${esc(b.vendor_label)} · 双方都有分 ${p.n} 项</small></a></li>`;}).join('')}</ul>`;
 const domainRadios=domains.map((u,i)=>`<label><input type="radio" name="task" value="${esc(u.id)}"${i===0?' checked':''}>${esc(u.title)}</label>`).join('');
 const cbx=(side,label)=>`<div class="cbx" data-side="${side}"><label for="pick-${side}"><span class="tag-${side}" aria-hidden="true"></span>${label}</label><div class="cbx-field"><input id="pick-${side}" name="${side}" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="pick-${side}-list" autocomplete="off" spellcheck="false" placeholder="搜索模型名或厂商，如 Claude、Qwen"><button type="button" class="clr" data-clear="${side}" aria-label="清除${label}" hidden>清除</button></div><ul id="pick-${side}-list" role="listbox" aria-label="${label}候选" hidden></ul></div>`;
 const chooseBody = `<p class="eyebrow-mono">模型对比</p>
<h1>选领域，对比两个模型</h1>
<p class="choose-lead">按你要拿模型来做的事选领域——编程开发、办公与商务、电脑操作、调研与搜索、知识与推理、视觉与文档、文档写作、量化与金融——再搜两个模型。结论只看两者都做过、版本与测试条件一致的评估（同题对照），每项差距都标出题量误差；没报告的评估不按 0 分算，单独列为覆盖面。另附一个借全部模型成绩对齐难度后的全库能力估计，供参考。<a href="../models/">浏览全部模型</a></p>
<form class="picker" id="compare-form" action="./" method="get">
  <fieldset class="domain"><legend>领域</legend>${domainRadios}</fieldset>
  <div class="duo">${cbx('a','模型 A')}<button type="button" class="swap" id="swap" aria-label="交换 A 与 B" title="交换 A 与 B">⇄</button>${cbx('b','模型 B')}</div>
  <p class="sr-only" id="cbx-status" role="status" aria-live="polite"></p>
</form>
<div id="compare" class="cmp">
  <div class="cmp-empty" id="cmp-empty"><h2>选两个模型开始对比</h2><p class="muted">搜索框会优先列出在当前领域有分数的模型；没有分数的模型也能选。也可以从这些对照开始：</p><div id="sugg">${suggHTML(firstTask)}</div>
  <noscript><p>对比需要启用浏览器脚本。不启用也可以直接打开<a href="../models/">模型档案</a>，每个模型页都列出了全部官方分数与出处。</p></noscript></div>
</div>
<details class="method">
  <summary>结论怎么得出</summary>
  <ol>
    <li><b>领域</b>：按真实用途划分，不按学术分类。本期 8 个：${domains.map(u=>esc(u.title)).join('、')}。视频生成、图像生成、语音对话本期不单独设领域——这几类公开分数大多是竞技场 Elo 或人工偏好胜率，没有固定的 0–100 意义，下一期再评估。</li>
    <li><b>领域目录</b>：每个领域的评估是逐项按评估档案（名称、简介、官方来源）筛出来的「这类工作」的评估，写在领域文件里，不按名字或关键词自动猜，一项评估只归一个领域。例如：编程开发只收软件工程评估；办公与商务不含金融与编程；电脑操作只收 GUI / 桌面 / 手机界面操作；调研与搜索不收只是顺带用到工具的通用 Agent 评测（Toolathlon、MCP-Atlas、AutomationBench、τ-bench）；知识与推理不含编程与写作；视觉与文档不含视频生成与 GUI 操作。</li>
    <li><b>能否计分</b>：只有能可靠换算成 0–100 分的评估参与对照——领域文件为它写明了单位、指标与上下界（均为百分制正确率或成功率，并附官方来源）；或评估档案里只有一个写明固定上下界的指标（Elo、胜率、竞技场分数这类相对读数除外）。其余列在「仅作参考」，只看原始分数。</li>
    <li><b>各领域现状</b>（目录项数 / 可计分项数，括号内是引用最多的几项）：<ul class="dom-stat">${domains.map(u=>{const el=u.catalog.filter(b=>b.eligible);return '<li><b>'+esc(u.title)+'</b> '+u.catalog.length+' / '+el.length+(el.length?'（'+el.slice(0,4).map(b=>esc(b.name)).join('、')+(el.length>4?' 等':'')+'）':'')+'</li>';}).join('')}</ul></li>
    <li><b>同题对照（主结论）</b>：只比较双方都有官方数值、且评测版本与测试条件（有无工具、子集、计分方式等）一致的评估。每一项按题量估算误差（题越少误差越大；题量来自评估官方说明，未登记的按 100 题保守估计），差距在误差内的只算「方向」，不算「明显领先」。多项合并时按评估的重要性加权（被官方发布引用越多越重要，但取对数，热门评估不会压倒一切），算出哪一方更强的把握：≥97.5% 且至少 3 项共同评估才写「明显领先」，≥84% 写「略占优」，否则写「难分高下」。</li>
    <li><b>没报告不等于 0 分</b>：只有一方报告的评估不参与胜负，单列为「覆盖面」。厂商通常优先公布自己占优的评估，所以「报告得多」既不加分，也不减分。官方配图里有、但还没转录出数值的，同样不计入这组对照。</li>
    <li><b>全库能力估计（参考）</b>：用本领域全部模型的全部可计分分数拟合一个按难度对齐的模型——每项评估有自己的难度，每个模型有一个能力值，报告少的模型会被适度拉向平均（与 Epoch AI 能力指数、项目反应理论同一类方法）。它能推断「没报告的评估大概会考多少」，并给出 95% 区间；只在两者没有任何共同评估时，且把握 ≥90%，才用它给出「间接估计」的方向。公开分数太稀的领域不提供估计。</li>
    <li><b>保证</b>：一方在每一项共同评估上都不低于另一方时，结论不会判另一方领先；交换 A 与 B，结论对称；多一项只有一方报告的评估，不会改变同题对照的结论。这些性质由自动测试逐条检查，构建时还会对全部模型两两对照做一遍体检。</li>
  </ol>
  <p>这是同一领域内、同一批公开分数下的对照读数，不是模型的总体能力排名。官方自报分数的测试设置（如推理档位、执行框架）可能不同，页面会在对应行提示。上线前请用自己的业务样本复核：<a href="../book/chapter-24/">建立测试集</a> · <a href="../book/chapter-05/">设计评分标准</a> · <a href="../book/chapter-25/">评估流水线工程</a></p>
</details>`;

 save(dist,'choose',page('选领域，对比两个模型','choose/','../','choose',chooseBody,`<script type="module" src="../assets/choose-client.mjs"></script>`,{css:COMPARE_CSS,mainClass:'model-main choose-main'}));
 return ['/choose/','/models/','/coverage/',...db.releases.map(r=>'/models/'+r.id+'/')];
}

