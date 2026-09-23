import {readState,stateParams,parseGoal,selectModels} from './model-selection.mjs';
import {esc,evidenceHTML,specsHTML} from './model-ui.mjs';
const data=await fetch('../assets/selection-data.json').then(r=>{if(!r.ok)throw Error('数据无法读取');return r.json();});
const form=document.querySelector('#choose-form');
const status=document.querySelector('#selection-status'), results=document.querySelector('#selection-results');
function formState(){const p=new URLSearchParams(new FormData(form));p.set('candidates',[...form.elements.candidates.selectedOptions].map(o=>o.value).join(','));return readState(p,data.useCase,data.models);}
function fill(state){for(const [k,v] of Object.entries(state)){if(k==='weights')for(const [id,w] of Object.entries(v))form.elements['w_'+id].value=w;else if(k==='candidates')for(const o of form.elements.candidates.options)o.selected=v.includes(o.value);else if(form.elements[k])form.elements[k].value=v??'';}}
function render(state,save=true){
 const report=selectModels(data,state);
 if(save)history.replaceState(null,'','?'+stateParams(state));
 status.textContent=report.message;
 const pool=report.candidates.filter(m=>m.eligible);
 const rows=[...report.candidates].sort((a,b)=>Number(b.eligible)-Number(a.eligible)||(b.total??-1)-(a.total??-1)||b.coverage-a.coverage||a.key.localeCompare(b.key));
 const main=rows.filter(m=>m.coverage>0), others=rows.filter(m=>!m.coverage);
 function card(m){
  const reasons=m.checks.filter(c=>c.status!=='pass');
  const label=!m.eligible?'未通过所选硬约束':report.winner===m.key?'优先试用':m.total!==null?'同协议候选':'不建议直接下结论';
  return `<article class="model-card"><h2><a href="../models/${esc(m.release_id)}/#${esc(m.id)}">${esc(m.name)}</a></h2><p><strong>${label}</strong> · ${esc(m.vendor_label)}</p><p>${m.total===null?'综合分数：不计算':`当前权重读数：${m.total.toFixed(2)} / 100`}</p><p>有记录的维度 ${m.coverage} / ${m.dimensions.length}；数量不代表能力高低。</p><ul>${m.checks.map(c=>`<li>${esc(c.label)}：${c.status==='pass'?'满足':c.status==='fail'?'不满足':'缺少信息，无法确认'}</li>`).join('')||'<li>未设置硬约束</li>'}</ul>${reasons.length?'<p>放宽对应硬约束后可重新检查；未知值不会自动通过。</p>':''}<details><summary>规格、成本与数据缺口</summary>${specsHTML(m)}<p>服务可用地区、部署方式、延迟和吞吐：当前资料不足。报价来自发布时记录，采购前需复核。</p></details>
   <table class="model-table"><thead><tr><th>维度</th><th>原始记录 / 可比记录</th><th>共同协议归一化读数</th></tr></thead><tbody>${m.dimensions.map(d=>`<tr><td>${esc(d.label)}</td><td>${d.rows.length} / ${d.comparable.length}</td><td>${d.score===null?'证据不足':d.score.toFixed(2)}${d.conflict?'（同协议数值冲突）':''}</td></tr>`).join('')}</tbody></table>
   <details><summary>为什么能或不能推荐：逐维度查看来源</summary>${m.dimensions.map(d=>`<h3>${esc(d.label)}</h3>${evidenceHTML(d.rows,'../',data.asOf)}`).join('')}<p>主要反例：公开题集上的表现不代表你的文体、事实引用和长文一致性；需要同一业务样本复核。</p></details></article>`;
 }
 results.innerHTML=`<p>候选 ${report.candidates.length} 个，其中 ${pool.length} 个通过已设置约束。以下按约束与证据可见性组织，不是能力排行榜。</p>${!pool.length?'<p class="negative">没有模型通过全部硬约束。可用“放宽硬约束”恢复候选。</p>':''}${!Object.values(state.weights).some(x=>x>0)?'<p>所有权重为 0，请至少选择一个维度。</p>':''}<section class="model-card"><h2>权重敏感性</h2><p>${report.canRank?'调整权重后重新计算，只在相同候选和共享协议下查看试用顺序变化。':'当前证据不足，改变权重也不能补出缺失分数；无法给出可靠的胜出敏感性结论。'}</p><a href="#business-eval">建立自己的业务评估计划</a></section>${main.map(card).join('')}<details><summary>查看没有所选维度证据的 ${others.length} 个候选</summary>${others.map(card).join('')}</details>`;
}
form.addEventListener('submit',e=>{e.preventDefault();render(formState());});
form.addEventListener('reset',e=>{e.preventDefault();fill(readState(new URLSearchParams(),data.useCase,data.models));document.querySelector('#parse-note').textContent='已恢复默认写作模板。';render(formState(),false);history.replaceState(null,'',location.pathname);});
document.querySelector('#parse-goal').addEventListener('click',()=>{const parsed=parseGoal(form.elements.goal.value,data.useCase);for(const [id,w]of Object.entries(parsed.weights))form.elements['w_'+id].value=w;document.querySelector('#parse-note').textContent=parsed.note;render(formState());});
document.querySelector('#relax').addEventListener('click',()=>{const s=formState();Object.assign(s,{modality:'',context:0,maxPrice:null,region:'',deployment:''});fill(s);render(s);});
addEventListener('popstate',()=>{const s=readState(new URLSearchParams(location.search),data.useCase,data.models);fill(s);render(s,false);});
const initial=readState(new URLSearchParams(location.search),data.useCase,data.models);fill(initial);render(initial,false);
