const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),ts=require('typescript');
const cache={},rows=new Map();let broken=false;
const db={prepare(sql){return {args:[],bind(...args){this.args=args;return this},async all(){return {results:[...rows.values()]}},async run(){const [id,payload,success,attempt]=this.args;if(sql.includes("VALUES (?,'[]'")){const [id,attempt,error]=this.args;const old=rows.get(id);rows.set(id,{id,payload:old?.payload||'[]',success_at:old?.success_at||null,attempt_at:attempt,error})}else rows.set(id,{id,payload,success_at:success,attempt_at:attempt,error:null});}}}};
const conf={DB:db};
const sample={id:123,title:'Software Engineer',absolute_url:'https://example.com/jobs/123',location:{name:'Seoul, South Korea'},internal_job_id:1,departments:[{name:'Engineering'}],content:'<h2>Responsibilities</h2><p>Build reliable distributed applications</p>',updated_at:'2026-10-24T00:00:00Z'};
function load(file){file=path.resolve(file);if(cache[file])return cache[file].exports;const mod={exports:{}};cache[file]=mod;const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const req=p=>p==='../shared'?{config:()=>conf}:p==='./work24'?{parseJobs:()=>[]}:load(path.resolve(path.dirname(file),p+'.ts'));vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{URL,Date,Set,AbortSignal,fetch:async()=>({ok:true,text:async()=>JSON.stringify(broken?{message:'bad'}:{jobs:[sample],meta:{total:1}})}),console})(req,mod,mod.exports);return mod.exports}
(async()=>{
const feed=load('app/api/jobs/feed.ts'),saramin=load('app/api/jobs/saramin.ts'),s=feed.sources[0];
assert.equal(feed.sources.length,9);
assert.equal(feed.normalizeGreenhouse({jobs:[sample]},s).length,1);
assert.equal(feed.normalizeGreenhouse({jobs:[{...sample,location:{name:'Tokyo, Japan'}}]},s).length,0);
assert.equal(feed.normalizeGreenhouse({jobs:[{...sample,title:'Talent Pool'}]},s).length,0);
assert.throws(()=>feed.normalizeGreenhouse({jobs:[sample],meta:{total:2}},s),/incomplete_source/);
const one={id:'456',active:1,url:'http://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=456&utm_source=job-search-api',company:{detail:{name:'테스트기업'}},position:{title:'신입 개발자',location:{code:'101050',name:'서울 > 강남구'},'experience-level':{name:'신입'},'job-type':{name:'정규직'}},'close-type':{code:'1'},'expiration-timestamp':String(Date.parse('2026-11-01T14:59:59Z')/1000)};
const data={jobs:{count:1,total:1,job:[one]}};let out=saramin.normalizeSaramin(data);assert.equal(out.length,1);assert.equal(out[0].end,'2026-11-01');assert.match(out[0].url,/^https:/);assert.match(out[0].url,/utm_source=job-search-api/);
assert.equal(saramin.normalizeSaramin({jobs:{count:1,total:1,job:[{...one,'close-type':{code:'2'}}]}})[0].end,null);
assert.equal(saramin.normalizeSaramin({jobs:{count:1,total:1,job:[{...one,position:{...one.position,location:{code:'200001',name:'해외'}}}]}}).length,0);
assert.throws(()=>saramin.normalizeSaramin({code:2}),/invalid_source/);
await feed.syncFeed();assert.equal(rows.size,9);const previous=JSON.stringify(rows.get(s.id));broken=true;await feed.syncFeed();const preserved=rows.get(s.id);assert.equal(preserved.payload,JSON.parse(previous).payload);assert.equal(preserved.success_at,JSON.parse(previous).success_at);assert.equal(preserved.error,'invalid_source');const read=await feed.readFeed(false);assert.equal(read.mode,'error');assert.equal(read.jobs.length,9);assert.ok(read.sources.every(s=>s.stale&&s.error==='invalid_source'));
assert.equal(read.saraminConfigured,false);console.log('PASS: 9 sources; domestic filtering; invalid/incomplete response rejection; Saramin dates/attribution; failed refresh preserves all snapshots.');
})().catch(e=>{console.error(e);process.exit(1)});
