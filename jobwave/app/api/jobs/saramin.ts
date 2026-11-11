import type {Job} from './feed';
import {classify,plainHtml} from './feed';
// Approved API access only. Keep the provider's attribution query parameters on outbound links.
const value=(x:unknown)=>typeof x==='string'?x.trim():'';
const timestamp=(x:unknown)=>{const n=Number(x);return Number.isFinite(n)&&n>0?new Date(n*1000).toISOString():null};
const day=(x:unknown)=>{const d=timestamp(x);return d?new Date(Date.parse(d)+9*3600000).toISOString().slice(0,10):null};
export function normalizeSaramin(payload:unknown):Job[]{
 const data=payload as any;
 if(!data?.jobs||!Array.isArray(data.jobs.job)||!Number.isFinite(Number(data.jobs.total)))throw Error('invalid_source');
 if(Number(data.jobs.count)!==data.jobs.job.length)throw Error('incomplete_source');
 const out:Job[]=[],seen=new Set<string>();
 for(const j of data.jobs.job){
  if(String(j.active)!=='1'||!/^\d+$/.test(String(j.id)))continue;
  const p=j.position,title=value(p?.title),company=value(j.company?.detail?.name),raw=value(p?.location?.name);
  // API domestic region codes are 100000–117xxx; overseas/mixed postings are excluded conservatively.
  const codes=String(p?.location?.code||'').split(',');
  if(!title||!company||!raw||!codes.length||codes.some(c=>!/^1(?:0[0-9]|1[0-7])\d{3}$/.test(c.trim())))continue;
  let url:URL;try{url=new URL(j.url);if(url.protocol==='http:')url.protocol='https:';if(url.protocol!=='https:'||!/(^|\.)saramin\.co\.kr$/.test(url.hostname)||url.username||url.password)continue}catch{continue}
  const id='saramin-'+j.id;if(seen.has(id))continue;seen.add(id);
  const close=String(j['close-type']?.code),end=close==='1'?day(j['expiration-timestamp']):null;
  if(close==='1'&&!end)throw Error('invalid_source');
  out.push({id,sourceKey:'saramin',sourceId:String(j.id),source:'사람인 채용정보 API',company,title:title.slice(0,250),category:classify(title,value(p['job-mid-code']?.name)+' '+value(p['job-code']?.name)),categoryMethod:'공고 제목·제공처 직무 기반 분류',career:value(p['experience-level']?.name)||'원문 확인',careerMethod:'제공처 경력 요건',location:raw.split(' > ')[0].split(',')[0],locationRaw:raw.slice(0,250),type:value(p['job-type']?.name)||'원문 확인',start:day(j['opening-timestamp']),end,published:timestamp(j['posting-timestamp']),updatedAt:timestamp(j['modification-timestamp']),url:url.href,duties:[],requirements:[],preferred:[],excerpt:plainHtml(value(j.keyword)).slice(0,300)});
 }
 return out;
}
export async function collectSaramin(key:string):Promise<Job[]>{
 // One request per refresh (<=96/day at 15-minute freshness); latest 110 postings, not the full catalogue.
 const url=new URL('https://oapi.saramin.co.kr/job-search');
 Object.entries({'access-key':key,start:'0',count:'110',sort:'pd',sr:'directhire'}).forEach(([k,v])=>url.searchParams.set(k,v));
 const r=await fetch(url,{headers:{Accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(20000)});
 if(!r.ok)throw Error(r.status===429?'source_rate_limited':r.status===401||r.status===403?'source_auth_failed':'source_failed');
 const text=await r.text();if(text.length>2000000)throw Error('source_too_large');const data=JSON.parse(text);
 if(data.code)throw Error(Number(data.code)===4?'source_rate_limited':'source_auth_failed');
 return normalizeSaramin(data);
}
