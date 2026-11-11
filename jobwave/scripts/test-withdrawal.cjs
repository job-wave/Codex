// Account withdrawal: origin check, sign-in, confirmation word, deletion order, per-member isolation.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),ts=require('typescript'),{webcrypto}=require('node:crypto'),{DatabaseSync}=require('node:sqlite');
const sql=new DatabaseSync(':memory:');
sql.exec("CREATE TABLE member_state(user_id TEXT PRIMARY KEY,payload TEXT,version INTEGER,updated_at TEXT);CREATE TABLE consultation_requests(id TEXT PRIMARY KEY,user_id TEXT,payload TEXT,status TEXT,created_at TEXT);CREATE TABLE ai_usage(id TEXT PRIMARY KEY,count INTEGER)");
let failBatch=0;
const db={prepare(q){return {q,args:[],bind(...a){this.args=a;return this}}},async batch(list){if(failBatch>0){failBatch--;throw Error('db down')}sql.exec('BEGIN');try{for(const s of list)sql.prepare(s.q).run(...s.args);sql.exec('COMMIT')}catch(e){sql.exec('ROLLBACK');throw e}}};
let jar=new Map(),calls=[],reply={status:204},user=null,cache={};
const fakeCookies=async()=>({get:k=>jar.has(k)?{value:jar.get(k)}:undefined,has:k=>jar.has(k)});
function load(file){file=path.resolve(file);if(cache[file])return cache[file].exports;const mod={exports:{}};cache[file]=mod;const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 function req(p){if(p==='next/headers')return {cookies:fakeCookies};if(p==='cloudflare:workers')return {env:{DB:db}};if(p.endsWith('chatgpt-auth'))return {getChatGPTUser:async()=>null,chatGPTSignOutPath:r=>'/signout-with-chatgpt?return_to='+encodeURIComponent(r)};if(p.endsWith('/shared')){const real=load(path.resolve(path.dirname(file),p+'.ts'));return {...real,identity:async()=>user}}if(!p.startsWith('.'))return require(p);return load(path.resolve(path.dirname(file),p+'.ts'))}
 vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{Request,Response,URL,AbortSignal,TextEncoder,Uint8Array,Array,Date,console:{error(){}},crypto:webcrypto,fetch:async(url,options)=>{calls.push({url,options});if(reply.throws)throw Error('network');return new Response(null,{status:reply.status})}})(req,mod,mod.exports);return mod.exports}
const request=(data,origin='https://jobwave.kr')=>new Request('https://jobwave.kr/api/account',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(data)});
const hex=async v=>Array.from(new Uint8Array(await webcrypto.subtle.digest('SHA-256',new TextEncoder().encode(v))),b=>b.toString(16).padStart(2,'0')).join('');
const count=(t,w='1=1',...a)=>sql.prepare(`SELECT count(*) n FROM ${t} WHERE ${w}`).get(...a).n;
async function seed(){sql.exec('DELETE FROM member_state;DELETE FROM consultation_requests;DELETE FROM ai_usage');const h=await hex('a@example.com'),o=await hex('b@example.com');
 for(const id of ['supabase:aaa','supabase:aaab','legacy-1']){sql.prepare('INSERT INTO member_state VALUES (?,?,1,?)').run(id,'{}','t');sql.prepare('INSERT INTO consultation_requests VALUES (?,?,?,?,?)').run('c-'+id,id,'{}','requested','t');sql.prepare('INSERT INTO ai_usage VALUES (?,1)').run(id+':2026-11-11')}
 for(const id of ['auth:send:'+h+':2026-11-11','auth:verify:'+h+':2026-11-11','auth:send:'+o+':2026-11-11'])sql.prepare('INSERT INTO ai_usage VALUES (?,1)').run(id)}
(async()=>{
 const api=load('app/api/account/route.ts'),auth=load('app/email-auth.ts');
 await seed();const total=()=>count('member_state')+count('consultation_requests')+count('ai_usage');const before=total();
 // rejected requests change nothing and never reach the auth server
 user={userId:'supabase:aaa',email:'a@example.com',displayName:'a@example.com',fullName:null};jar.set(auth.ACCESS_COOKIE,'access.fixture');
 assert.equal((await api.POST(request({confirm:'탈퇴'},'https://attacker.invalid'))).status,403);
 assert.equal((await api.POST(request({confirm:'네'}))).status,400);assert.equal((await api.POST(request({}))).status,400);
 assert.equal((await api.POST(request({confirm:'탈퇴',extra:1}))).status,400);
 user=null;assert.equal((await api.POST(request({confirm:'탈퇴'}))).status,401);
 user={userId:'supabase:aaa',email:'a@example.com',displayName:'a@example.com',fullName:null};
 jar.clear();assert.equal((await api.POST(request({confirm:'탈퇴'}))).status,401);jar.set(auth.ACCESS_COOKIE,'access.fixture');
 assert.equal(calls.length,0);assert.equal(total(),before);
 // auth deletion unavailable: nothing is erased, session kept
 for(const r of [{status:404},{status:500},{throws:true}]){reply=r;const res=await api.POST(request({confirm:'탈퇴'}));assert.equal(res.status,503);assert.equal(res.headers.get('set-cookie'),null);assert.equal(total(),before)}
 assert.equal(calls.length,3);
 // success: member token only goes to the fixed RPC URL; only this member's rows go; cookies cleared
 reply={status:204};calls=[];let res=await api.POST(request({confirm:'탈퇴'}));assert.equal(res.status,200);let out=await res.json();assert.deepEqual(out,{ok:true,erased:true,next:'/'});
 assert.equal(calls.length,1);assert.equal(calls[0].url,'https://qdvqiqwxadgnramercze.supabase.co/rest/v1/rpc/delete_own_account');assert.equal(calls[0].options.headers.Authorization,'Bearer access.fixture');assert.equal(calls[0].options.method,'POST');
 assert.ok(!JSON.stringify(out).includes('access.fixture'));
 const set=res.headers.getSetCookie().join('\n');assert.match(set,/__Host-jobwave-access=; Max-Age=0/);assert.match(set,/__Host-jobwave-refresh=; Max-Age=0/);
 assert.equal(count('member_state',"user_id='supabase:aaa'"),0);assert.equal(count('consultation_requests',"user_id='supabase:aaa'"),0);assert.equal(count('ai_usage',"id LIKE 'supabase:aaa:%'"),0);
 assert.equal(count('ai_usage','id LIKE ?','auth:%:'+await hex('a@example.com')+':%'),0);
 assert.equal(count('member_state'),2);assert.equal(count('consultation_requests'),2);assert.equal(count('ai_usage'),3); // aaab, legacy-1 and b@example.com untouched
 // native (ChatGPT) member: no auth-server call, data erased, sent to provider sign-out
 await seed();calls=[];jar.clear();user={userId:'legacy-1',email:'b@example.com',displayName:'Legacy',fullName:null};
 failBatch=2;res=await api.POST(request({confirm:'탈퇴'}));assert.equal(res.status,503);assert.equal(count('member_state',"user_id='legacy-1'"),1);
 failBatch=1;res=await api.POST(request({confirm:'탈퇴'}));assert.equal(res.status,200);out=await res.json();assert.equal(out.next,'/signout-with-chatgpt?return_to=%2F');assert.equal(res.headers.get('set-cookie'),null);
 assert.equal(calls.length,0);assert.equal(count('member_state',"user_id='legacy-1'"),0);assert.equal(count('member_state'),2);
 // email member whose stored data could not be erased after the account was removed: reported, still signed out
 await seed();user={userId:'supabase:aaa',email:'a@example.com',displayName:'a',fullName:null};jar.set(auth.ACCESS_COOKIE,'access.fixture');failBatch=2;
 res=await api.POST(request({confirm:'탈퇴'}));assert.equal(res.status,200);assert.equal((await res.json()).erased,false);assert.match(res.headers.getSetCookie().join('\n'),/Max-Age=0/);
 console.log('PASS: origin/sign-in/confirmation checks; no deletion when the sign-in account cannot be removed; fixed RPC target; member-scoped erasure incl. usage counters; cookie cleanup; native-member path; retry and failure reporting.');
})().catch(e=>{console.error(e);process.exit(1)});
