#!/usr/bin/env node
/**
 * scan.mjs — ingest-releases 技能的入口扫描：只发现候选，不把网页链接自动宣称为已核验模型。
 *
 * 纯逻辑（buildCandidate / scanEntry）与 CLI 分离：被 import 时不读文件、不发请求，
 * 测试可注入 fetchImpl 验证 allowlist 重定向与候选形状（tests/release-ingest.test.mjs）。
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {canonicalURL,mergeCandidates,discoverLinks,classifyTitle} from '../../../../scripts/release-discovery.mjs';

// 2026-10-30 实测：microsoft.ai 的 Cloudflare 按 UA 字符串放行——Windows Chrome 128 这条 UA 一律 403，
// 换成 macOS Chrome 141 或 Node 默认 UA 即 200 全文（Accept 头与 redirect 模式都不是决定因素）。
const SCAN_UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const MAX_REDIRECTS=5;

/** 一个发现链接 → 一条覆盖账本候选。分类为 product 的自动带排除原因，其余留待人工判定。 */
export function buildCandidate(vendorId,link,now){
  const cls=classifyTitle(link.title);
  const excl=cls==='product'?'产品/工具/平台/方案更新，非独立模型发布':null;
  return {
    id:vendorId+'-'+crypto.createHash('sha256').update(canonicalURL(link.url)).digest('hex').slice(0,12),
    vendor_id:vendorId,
    family:link.title,
    classification:cls,
    official_urls:[link.url],
    discovery_status:'discovered',
    official_source_verified:false,
    release_id:null,
    archive_status:'not_archived',
    evidence_status:'not_extracted',
    exclusion_reason:excl,
    next_backfill_at:excl?null:now.slice(0,10),
    discovered_at:now
  };
}

/**
 * 扫一个厂商入口：手动跟随重定向（每一跳都校验主机仍在官方 allowlist 内，越界即判 inaccessible），
 * 从静态 HTML 提取模型链接并生成候选。fetchImpl 可注入（测试用），默认全局 fetch。
 * 返回 {entry,candidates}；entry 被就地更新，抓取失败时 status=inaccessible 且不产候选。
 */
export async function scanEntry(vendor,entry,{fetchImpl=fetch,now=new Date().toISOString(),maxRedirects=MAX_REDIRECTS}={}){
  entry.last_scanned_at=now;
  let url=entry.url,response;
  try{
    for(let n=0;n<maxRedirects;n++){
      if(!vendor.allowed_hosts.includes(new URL(url).hostname))throw Error('redirect host outside official allowlist');
      response=await fetchImpl(url,{
        method:'GET',
        redirect:'manual',
        headers:{'user-agent':SCAN_UA,'accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'},
        signal:AbortSignal.timeout(15000)
      });
      if(response.status>=300&&response.status<400){
        const loc=response.headers.get('location');
        if(!loc)break;
        url=new URL(loc,url).href;
        entry.canonical_url=url;
        continue;
      }
      break;
    }
    if(!response.ok)throw Error('HTTP '+response.status);
    const html=await response.text();
    entry.content_sha256=crypto.createHash('sha256').update(html).digest('hex');
    const links=discoverLinks(html,url).filter(l=>vendor.allowed_hosts.includes(new URL(l.url).hostname));
    entry.status=links.length?'partial':'needs_render';
    entry.failure_reason=links.length?null:'静态页面未提取到模型链接，需要渲染或人工读取；不代表没有模型。';
    return {entry,candidates:links.map(l=>buildCandidate(vendor.vendor_id,l,now))};
  }catch(e){
    entry.status='inaccessible';entry.failure_reason=e.message;
    return {entry,candidates:[]};
  }
}

const invokedAsCli=process.argv[1]?.replace(/\\/g,'/').endsWith('/scan.mjs');
if(invokedAsCli){
  const root=process.cwd(),file=path.join(root,'data/model-coverage.json');
  const data=JSON.parse(fs.readFileSync(file));
  const apply=process.argv.includes('--write');
  const now=new Date().toISOString();
  for(const vendor of data.vendors){
    for(const entry of vendor.entries){
      const {candidates}=await scanEntry(vendor,entry,{now});
      data.candidates=mergeCandidates(data.candidates,candidates);
      console.log(vendor.vendor_id,entry.status,entry.url);
    }
  }
  data.last_scan_at=now;
  data.note='入口扫描是候选发现，分页、动态页及历史模型仍需回填。partial 不表示完整覆盖；日期未知候选不受增量窗口排除。';
  if(apply)fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
  else console.log(JSON.stringify(data,null,2));
}
