const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict');
let member=false;const cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const mod={exports:{}};cache.set(file,mod);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;
 const req=p=>{if(p.endsWith('member-access'))return {loginHref:p=>'/login?next='+encodeURIComponent(p),memberGate:async p=>member?null:new Response(null,{status:303,headers:{Location:'/login?next='+encodeURIComponent(p)}})};if(p.endsWith('visitor'))return {page:(_,body)=>new Response(body)};if(p.endsWith('.json'))return JSON.parse(fs.readFileSync(path.resolve(path.dirname(file),p),'utf8'));return load(path.resolve(path.dirname(file),p+'.ts'))};
 vm.runInNewContext('(function(require,module,exports){'+code+'\n})',{Response,Request,URL})(req,mod,mod.exports);return mod.exports;
}
(async()=>{
 const c=load('app/roles/content.ts'),list=load('app/roles/route.ts'),detail=load('app/roles/[slug]/route.ts');
 assert.equal(c.articles.length,16);assert.equal(new Set(c.articles.map(a=>a.slug)).size,16);
 for(const [kind,count] of [['guide',10],['compare',3],['interview',3]]){
  assert.equal(c.articles.filter(a=>a.kind===kind).length,count);
  const r=await list.GET(new Request('https://jobwave.kr/roles?type='+kind));assert.equal(r.status,200);const h=await r.text();assert.equal((h.match(/class="role-card"/g)||[]).length,count);assert(h.includes('/login?next=%2Froles%2F'));
 }
 let r=await list.GET(new Request('https://jobwave.kr/roles?type=%3Cscript%3E'));assert.equal((await r.text()).includes('<script>'),false);
 assert.equal((await detail.GET(new Request('https://jobwave.kr/roles/marketing'),{params:Promise.resolve({slug:'marketing'})})).status,303);
 assert.equal((await detail.GET(new Request('https://jobwave.kr/roles/missing'),{params:Promise.resolve({slug:'missing'})})).status,404);
 member=true;
 for(const a of c.articles){
  assert(a.highlights.length===3&&a.sections.length>=3&&a.sources.length>0);
  assert(a.related.every(slug=>c.articles.some(x=>x.slug===slug)));
  assert(a.sources.every(s=>s.url.startsWith('https://')));
  r=await detail.GET(new Request('https://jobwave.kr/roles/'+a.slug),{params:Promise.resolve({slug:a.slug})});assert.equal(r.status,200);const h=await r.text();assert(h.includes(a.title));assert(!/<input|<textarea|<form\b/.test(h));assert(h.includes(a.sources[0].url.replaceAll('&','&amp;')));
  if(a.kind==='interview'){assert(a.context);assert(h.includes('공식 인터뷰 원문 보기'));assert(h.includes('공식 공개 인터뷰 요약'));}
 }
 const hostile=c.articleHtml({...c.articles[0],title:'<script>alert(1)</script>'});assert(hostile.includes('&lt;script&gt;'));assert(!hostile.includes('<script>alert'));
 console.log('PASS: 10 guides/3 comparisons/3 sourced interview summaries; anonymous previews and member-only articles; filters; all related links; no exercises/forms; escaped content; missing-article 404.');
})().catch(e=>{console.error(e);process.exit(1)});
