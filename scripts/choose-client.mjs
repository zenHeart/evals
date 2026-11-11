/** /choose/：选领域 → 搜两个模型 → 两两对照。计算在 model-compare.mjs，渲染在 compare-ui.mjs（与构建期同构）。 */
import {headToHead,readCompareParams,compareParams,searchModels,domainCounts} from './model-compare.mjs';
import {compareHTML,modelHead} from './compare-ui.mjs';
import {esc} from './model-ui.mjs';

const REL='../';
const form=document.querySelector('#compare-form');
const out=document.querySelector('#compare');
const live=document.querySelector('#cbx-status');
const emptyHTML=out.innerHTML;
let data;
try{data=await fetch(REL+'assets/compare-data.json').then(r=>{if(!r.ok)throw Error(String(r.status));return r.json();});}
catch{out.insertAdjacentHTML('afterbegin','<p class="negative">对比数据暂时无法读取，请刷新重试；模型档案仍可在 <a href="../models/">模型目录</a> 打开。</p>');throw Error('compare-data 读取失败');}
const byKey=new Map(data.models.map(m=>[m.key,m]));
const state=readCompareParams(new URLSearchParams(location.search),data.useCases,data.models);

/** 每个模型在当前领域有官方数值的可计分评估数；没有的模型照样能选，综合分按 0 计 */
const countCache={};
function domainCount(task){return countCache[task]??=domainCounts(data.useCases[task],data.models);}
let counts=domainCount(state.task);

// ---------------- 组合框（ARIA 1.2 combobox + listbox，aria-activedescendant 管理焦点）
const boxes={};
for(const el of form.querySelectorAll('.cbx')){
  const side=el.dataset.side,input=el.querySelector('input'),list=el.querySelector('[role=listbox]'),clr=el.querySelector('.clr');
  const box={side,input,list,clr,items:[],active:-1};boxes[side]=box;
  let t=0;
  const announce=n=>{clearTimeout(t);t=setTimeout(()=>{live.textContent=n?`找到 ${n} 个模型，用上下方向键选择`:'没有匹配的模型';},350);};
  box.open=()=>{
    const q=input.value.trim();
    box.items=searchModels(data.models,q,counts,q?30:12);
    box.active=-1;
    list.innerHTML=box.items.length?box.items.map((m,i)=>{const n=counts[m.key]||0;return `<li role="option" id="opt-${side}-${i}" aria-selected="false" data-i="${i}"><span class="o-n">${esc(m.name)}</span><span class="o-s">${esc(m.vendor_label)}${m.release_date?' · '+esc(m.release_date):''}</span><span class="o-c${n?' has':''}">${n?n+' 项有分':'暂无分数 · 计 0'}</span></li>`;}).join(''):'<li class="o-empty" role="presentation">没有匹配的模型，换个关键词试试</li>';
    list.hidden=false;input.setAttribute('aria-expanded','true');input.removeAttribute('aria-activedescendant');
    announce(box.items.length);
  };
  box.close=()=>{list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');box.active=-1;};
  box.move=d=>{
    if(list.hidden)box.open();
    if(!box.items.length)return;
    box.active=(box.active+d+box.items.length)%box.items.length;
    for(const o of list.querySelectorAll('[role=option]'))o.setAttribute('aria-selected',String(+o.dataset.i===box.active));
    const o=list.querySelector(`#opt-${side}-${box.active}`);input.setAttribute('aria-activedescendant',o.id);o.scrollIntoView({block:'nearest'});
  };
  box.pick=m=>{state[side]=m?m.key:'';box.sync();box.close();update();};
  box.sync=()=>{const m=byKey.get(state[side]);input.value=m?m.name:'';clr.hidden=!m;};
  input.addEventListener('input',()=>box.open());
  input.addEventListener('focus',()=>{input.select();});
  input.addEventListener('click',()=>{if(list.hidden)box.open();});
  input.addEventListener('keydown',e=>{
    if(e.isComposing||e.keyCode===229)return; // 输入法组字中不拦截回车与方向键
    if(e.key==='ArrowDown'){e.preventDefault();box.move(1);}
    else if(e.key==='ArrowUp'){e.preventDefault();box.move(-1);}
    else if(e.key==='Enter'){if(!list.hidden){e.preventDefault();const m=box.items[box.active>=0?box.active:0];if(m)box.pick(m);}}
    else if(e.key==='Escape'){if(!list.hidden){e.preventDefault();box.close();box.sync();}else if(input.value){e.preventDefault();box.pick(null);}}
    else if(e.key==='Tab'){box.close();box.sync();}
  });
  input.addEventListener('blur',()=>setTimeout(()=>{if(!el.contains(document.activeElement)){box.close();box.sync();}},120));
  list.addEventListener('pointerdown',e=>e.preventDefault()); // 保持输入框焦点
  list.addEventListener('click',e=>{const o=e.target.closest('[role=option]');if(o)box.pick(box.items[+o.dataset.i]);});
  clr.addEventListener('click',()=>{box.pick(null);input.focus();});
}

// ---------------- 领域、交换、推荐对照
for(const r of form.elements.task?.length?form.elements.task:[form.elements.task].filter(Boolean)) r.checked=r.value===state.task;
form.addEventListener('change',e=>{if(e.target.name==='task'){state.task=e.target.value;counts=domainCount(state.task);update();}});
form.addEventListener('submit',e=>e.preventDefault());
function swap(){[state.a,state.b]=[state.b,state.a];boxes.a.sync();boxes.b.sync();update();}
document.querySelector('#swap').addEventListener('click',swap);
out.addEventListener('click',e=>{
  const s=e.target.closest('[data-pair]');
  if(s){e.preventDefault();const [task,a,b]=s.dataset.pair.split('|');state.task=task;state.a=a;state.b=b;for(const r of form.elements.task)r.checked=r.value===task;counts=domainCount(task);boxes.a.sync();boxes.b.sync();update();out.scrollIntoView({block:'start'});return;}
  if(e.target.closest('#cmp-swap'))swap();
  const ch=e.target.closest('[data-change]');if(ch){const b=boxes[ch.dataset.change];b.input.focus();b.input.scrollIntoView({block:'center'});b.open();}
});

function suggestions(task){
  return `<ul class="sugg" role="list">${(data.suggestions[task]||[]).map(p=>{const a=byKey.get(p.a),b=byKey.get(p.b);return `<li><a href="?task=${esc(task)}&amp;a=${esc(p.a)}&amp;b=${esc(p.b)}" data-pair="${esc(task)}|${esc(p.a)}|${esc(p.b)}"><b>${esc(a.name)}</b> 对比 <b>${esc(b.name)}</b><small>${esc(a.vendor_label)} / ${esc(b.vendor_label)} · 双方都有分 ${p.n} 项</small></a></li>`;}).join('')}</ul>`;
}

function update(push=true){
  if(push)history.replaceState(null,'','?'+compareParams(state));
  const uc=data.useCases[state.task],A=byKey.get(state.a),B=byKey.get(state.b);
  if(!A||!B||A.key===B.key){
    out.innerHTML=emptyHTML;
    out.querySelector('#sugg').innerHTML=suggestions(state.task);
    if(A&&B)out.querySelector('#cmp-empty h2').textContent='请选择两个不同的模型';
    else if(A||B)out.querySelector('#cmp-empty h2').textContent='再选一个模型';
    document.title='选领域，对比两个模型 · 按需求选型';
    return;
  }
  const res=headToHead(uc,A,B);
  out.innerHTML=`<div class="cmp-head cmp-grid" role="group" aria-label="对比中的两个模型"><div class="tools"><button type="button" id="cmp-swap">⇄ 交换</button><button type="button" data-change="a">换 A</button><button type="button" data-change="b">换 B</button></div><div class="mh a"><span class="mh-k">A · ${esc(uc.title)}</span>${modelHead(A,REL)}</div><div class="mh b"><span class="mh-k">B</span>${modelHead(B,REL)}</div></div>`+compareHTML(res,A,B,uc,REL);
  // 窄屏默认收起「仅作参考」
  const ref=out.querySelector('#cmp-ref-wrap');if(ref&&matchMedia('(max-width:720px)').matches)ref.open=false;
  document.title=`${A.name} 对比 ${B.name} · ${uc.title} · 按需求选型`;
}
boxes.a.sync();boxes.b.sync();
update(false);
addEventListener('popstate',()=>{Object.assign(state,readCompareParams(new URLSearchParams(location.search),data.useCases,data.models));counts=domainCount(state.task);boxes.a.sync();boxes.b.sync();update(false);});
