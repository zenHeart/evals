import {mkdirSync,writeFileSync,copyFileSync} from 'node:fs';
import {join} from 'node:path';
import {SHELL_CSS,shellHead,shellTopbar,shellFooter,SHELL_JS} from './site-shell.mjs';
import {esc,MODEL_CSS,evidenceHTML,specsHTML} from './model-ui.mjs';
import {citationCounts,headToHead} from './model-compare.mjs';
import {COMPARE_CSS} from './compare-ui.mjs';
export function selectionData(db){
  const models=db.releases.flatMap(r=>r.model_specs.filter(m=>m.id).map(m=>({...m,key:r.id+'--'+m.id,release_id:r.id,release_date:r.release_date,vendor_id:r.vendor_id,vendor_label:r.vendor_label,region:r.region,evidence:r.evidence.filter(e=>e.model_id===m.id)})));
  return {
    asOf:[db.coverage.window_until,...db.releases.flatMap(r=>r.evidence.map(e=>e.last_verified_at))].filter(Boolean).sort().pop()||new Date().toISOString().slice(0,10),
    useCase:db.useCase,
    useCases:db.useCases,
    models
  };
}
/** /choose/ 专用的瘦身数据：只保留领域内评测的记录与对照所需字段（selection-data.json 有数 MB，不适合首屏） */
const DOMAIN_LABEL={coding:'编程开发','chinese-longform-writing':'文档写作'},DOMAIN_ORDER=['coding','chinese-longform-writing'];
const KEEP=['id','benchmark_id','variant','metric','unit','value','display','status','score_status','attribution','harness','effort','protocol'];
export function compareData(db){
  const sd=selectionData(db);
  const inDomain=new Set(Object.values(db.useCases).flatMap(u=>Object.keys(u.benchmarks)));
  const citations=Object.fromEntries(Object.entries(db.useCases).map(([id,u])=>[id,citationCounts(db.releases.filter(r=>r.source_kind),Object.keys(u.benchmarks))]));
  const titles=Object.fromEntries(db.releases.map(r=>[r.id,r.release_title||'']));
  const models=sd.models.map(m=>({key:m.key,id:m.id,name:m.name,vendor_label:m.vendor_label,release_id:m.release_id,release_date:m.release_date||null,release_title:titles[m.release_id]||'',
    evidence:m.evidence.filter(e=>inDomain.has(e.benchmark_id)).map(e=>Object.fromEntries(KEEP.filter(k=>e[k]!==undefined&&e[k]!==null&&e[k]!=='').map(k=>[k,e[k]])))}));
  // 领域顺序与读者标签：编程数据最充分，作为默认领域；新增领域时在这里补标签即可
  const order=Object.keys(db.useCases).sort((a,b)=>(DOMAIN_ORDER.indexOf(a)+1||99)-(DOMAIN_ORDER.indexOf(b)+1||99));
  const useCases=Object.fromEntries(order.map(id=>{const u=db.useCases[id];return [id,{id,title:DOMAIN_LABEL[id]||u.title,description:u.description,benchmarks:u.benchmarks}];}));
  return {asOf:sd.asOf,useCases,citations,models,suggestions:suggestPairs(useCases,citations,models)};
}
/** 推荐对照：每个领域取共同可比评估最多、发布较新的几组，避免同一模型反复出现 */
export function suggestPairs(useCases,citations,models,limit=4){
  const out={};
  for(const [id,u] of Object.entries(useCases)){
    const ms=models.filter(m=>m.evidence.some(e=>u.benchmarks[e.benchmark_id]));
    const all=[];
    for(let i=0;i<ms.length;i++)for(let j=i+1;j<ms.length;j++){const r=headToHead(u,citations[id],ms[i],ms[j]);if(r.composite){const [a,b]=String(ms[i].release_date||'')>=String(ms[j].release_date||'')?[ms[i],ms[j]]:[ms[j],ms[i]];all.push({a:a.key,b:b.key,n:r.composite.n,d:String(b.release_date||'')});}}
    all.sort((x,y)=>y.n-x.n||y.d.localeCompare(x.d)||x.a.localeCompare(y.a)||x.b.localeCompare(y.b));
    const used={},pick=[];
    for(const p of all){if(pick.length>=limit)break;if((used[p.a]||0)>=1||(used[p.b]||0)>=1)continue;used[p.a]=(used[p.a]||0)+1;used[p.b]=(used[p.b]||0)+1;pick.push(p);}
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
 for(const f of ['model-selection.mjs','model-ui.mjs','model-compare.mjs','compare-ui.mjs','choose-client.mjs','models-client.mjs'])copyFileSync(new URL(f,import.meta.url),join(dist,'assets',f));
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
 const suggHTML=(task)=>`<ul class="sugg" role="list">${(cmp.suggestions[task]||[]).map(p=>{const a=byKey[p.a],b=byKey[p.b];return `<li><a href="?task=${esc(task)}&amp;a=${esc(p.a)}&amp;b=${esc(p.b)}" data-pair="${esc(task)}|${esc(p.a)}|${esc(p.b)}"><b>${esc(a.name)}</b> 对比 <b>${esc(b.name)}</b><small>${esc(a.vendor_label)} / ${esc(b.vendor_label)} · 共同可比评估 ${p.n} 项</small></a></li>`;}).join('')}</ul>`;
 const domainRadios=domains.map((u,i)=>`<label><input type="radio" name="task" value="${esc(u.id)}"${i===0?' checked':''}>${esc(u.title)}</label>`).join('');
 const cbx=(side,label)=>`<div class="cbx" data-side="${side}"><label for="pick-${side}"><span class="tag-${side}" aria-hidden="true"></span>${label}</label><div class="cbx-field"><input id="pick-${side}" name="${side}" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="pick-${side}-list" autocomplete="off" spellcheck="false" placeholder="搜索模型名或厂商，如 Claude、Qwen"><button type="button" class="clr" data-clear="${side}" aria-label="清除${label}" hidden>清除</button></div><ul id="pick-${side}-list" role="listbox" aria-label="${label}候选" hidden></ul></div>`;
 const chooseBody = `<p class="eyebrow-mono">模型对比</p>
<h1>选领域，对比两个模型</h1>
<p class="choose-lead">先选你关心的领域，再搜两个模型，逐项看它们在同一评估上的官方分数。综合分按该领域评估在官方发布中被引用的次数加权，只计入双方都有、且可横向比较的评估。<a href="../models/">浏览全部模型</a></p>
<form class="picker" id="compare-form" action="./" method="get">
  <fieldset class="domain"><legend>领域</legend>${domainRadios}</fieldset>
  <div class="duo">${cbx('a','模型 A')}<button type="button" class="swap" id="swap" aria-label="交换 A 与 B" title="交换 A 与 B">⇄</button>${cbx('b','模型 B')}</div>
  <p class="sr-only" id="cbx-status" role="status" aria-live="polite"></p>
</form>
<div id="compare" class="cmp">
  <div class="cmp-empty" id="cmp-empty"><h2>选两个模型开始对比</h2><p class="muted">搜索框会优先列出在当前领域有分数的模型。也可以从这些对照开始：</p><div id="sugg">${suggHTML(firstTask)}</div>
  <noscript><p>对比需要启用浏览器脚本。不启用也可以直接打开<a href="../models/">模型档案</a>，每个模型页都列出了全部官方分数与出处。</p></noscript></div>
</div>
<details class="method">
  <summary>综合分怎么算</summary>
  <ol>
    <li>只看所选领域里可以横向比较的评估（${domains.map(u=>esc(u.title)+'：'+Object.entries(u.benchmarks).filter(([,r])=>r.comparison==='cross_model'&&r.unit).map(([,r])=>esc(r.name)).join('、')).join('；')}）。</li>
    <li>每项评估的权重 = 它被多少个官方模型发布引用过（同一次发布的多个型号只算一次）。被引用越多，说明业内越常用它来比较。</li>
    <li>只计入两个模型都有、且版本和口径一致的评估，按权重求加权平均，换算到 0–100 分。缺少的分数不会按 0 计入，也不会把权重挪给别的评估。</li>
    <li>如果共同评估只有一项，综合分就等于这一项的得分；一项都没有时，不给综合分。</li>
    <li>仅作参考的评估（裁判、题目或口径各家不统一，或是厂商内部评测）只展示原始分数，永远不进入综合分。</li>
  </ol>
  <p>这是同一领域内、同一批公开分数下的对照读数，不是模型的总体能力排名。官方自报分数的测试设置（如推理档位、执行框架）可能不同，页面会在对应行提示。上线前请用自己的业务样本复核：<a href="../book/chapter-24/">建立测试集</a> · <a href="../book/chapter-05/">设计评分标准</a> · <a href="../book/chapter-25/">评估流水线工程</a></p>
</details>`;

 save(dist,'choose',page('选领域，对比两个模型','choose/','../','choose',chooseBody,`<script type="module" src="../assets/choose-client.mjs"></script>`,{css:COMPARE_CSS,mainClass:'model-main choose-main'}));
 return ['/choose/','/models/','/coverage/',...db.releases.map(r=>'/models/'+r.id+'/')];
}

