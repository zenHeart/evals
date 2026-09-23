/** 只发现候选，不把网页链接自动宣称为已核验模型。 */
export function canonicalURL(value) {
  const u=new URL(value);u.hash='';u.hostname=u.hostname.replace(/^www\./,'');
  for(const k of [...u.searchParams.keys()])if(k!=='id')u.searchParams.delete(k);
  u.pathname=u.pathname.replace(/\/$/,'')||'/';return u.href;
}
export function mergeCandidates(existing, discovered) {
  const byURL=new Map(existing.map(c=>[canonicalURL(c.official_urls[0]),c]));
  for(const c of discovered){const key=canonicalURL(c.official_urls[0]);if(!byURL.has(key))byURL.set(key,c);}
  return [...byURL.values()].sort((a,b)=>a.id.localeCompare(b.id));
}
export function classifyTitle(title){
  if(/studio|enterprise|cli\b|desktop|pricing|program|console|solution|toolkit|workspace|sdk\b/i.test(title))return 'product';
  if(/image|video|audio|speech|sound|voice|transcri|seedance|seedream|seedrealtime|lyria|veo|sora|ocr|doc|robot|agent|coder?|devstral|robostral|图像|视频|语音|视觉|多模态/i.test(title))return 'vertical';
  if(/gemma|llama|gpt|claude|gemini|deepseek|mistral|mixtral|glm|kimi|qwen|step|mimo|phi|hunyuan/i.test(title))return 'general';
  return 'unknown';
}
export function discoverLinks(html, base) {
  const out=[];
  const RE_KEYWORD=/(introduc|announc|launch|releas|unveil|preview|发布|推出|上线|开源|宣布|gemma|gemini|claude|gpt|llama|mistral|qwen|seed|seedance|seedream|seedrealtime|grok|mimo|mai-|glm-|kimi|deepseek|phi|hunyuan|step|muse|devstral|robostral|ocr|transcri|audio|video|image)/i;
  for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){
    let title=m[2].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
    try{
      const u=new URL(m[1].replace(/&amp;/g,'&'),base);
      if(u.protocol!=='https:'||/login|signup|download|privacy|terms|cookie/i.test(u.pathname))continue;
      const slug=u.pathname.split('/').filter(Boolean).pop()||'';
      const isGenericTitle=!title||/^(learn more|read more|read post|view post|details|link|more|click here|arrow|see all)$/i.test(title);
      if(isGenericTitle&&RE_KEYWORD.test(slug)){
        title=slug.replace(/[-_]+/g,' ').replace(/\b[a-z]/g,c=>c.toUpperCase());
      }
      if(!title||(!RE_KEYWORD.test(title)&&!RE_KEYWORD.test(u.pathname)))continue;
      out.push({url:u.href,title});
    }catch{}
  }
  return out;
}
