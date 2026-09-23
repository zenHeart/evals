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
  if(/image|video|audio|speech|transcri|seedance|seedream|lyria|veo|ocr|图像|视频|语音/i.test(title))return 'vertical';
  return 'unknown';
}
export function discoverLinks(html, base) {
  const out=[];
  for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){
    const title=m[2].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
    if(!title||!/(introduc|releas|模型|发布|gemma|qwen|seedance|seedream|grok|mimo|mai-|glm-|kimi.k)/i.test(title))continue;
    try{const u=new URL(m[1].replace(/&amp;/g,'&'),base);if(u.protocol==='https:'&& !/login|signup|download/i.test(u.pathname))out.push({url:u.href,title});}catch{}
  }
  return out;
}
