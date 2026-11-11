const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),ts=require('typescript'),{webcrypto}=require('node:crypto');
let cache={},jar=new Map(),calls=[],reply={status:200,body:{}},allowed=true,legacyCalls=0;
const db={prepare(){return {bind(){return this},async first(){return allowed?{count:1}:null}}}};
const fakeCookies=async()=>({get:k=>jar.has(k)?{value:jar.get(k)}:undefined,has:k=>jar.has(k)});
const legacy={getChatGPTUser:async()=>{legacyCalls++;return {userId:'legacy-owner',email:'same@example.com',displayName:'Legacy',fullName:null}}};
function load(file){file=path.resolve(file);if(cache[file])return cache[file].exports;const mod={exports:{}};cache[file]=mod;const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;function req(p){if(p==='next/headers')return {cookies:fakeCookies};if(p==='cloudflare:workers')return {env:{DB:db}};if(p.endsWith('chatgpt-auth'))return legacy;if(!p.startsWith('.'))return require(p);return load(path.resolve(path.dirname(file),p+'.ts'))}vm.runInNewContext(`(function(require,module,exports){${code}\n})`,{Request,Response,URL,AbortSignal,TextEncoder,Uint8Array,Date,btoa,crypto:webcrypto,fetch:async(url,options)=>{calls.push({url,options});return Response.json(reply.body,{status:reply.status})}})(req,mod,mod.exports);return mod.exports}
function request(data,origin='https://jobwave.kr'){return new Request('https://jobwave.kr/api/auth',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(data)})}
(async()=>{
 const api=load('app/api/auth/route.ts'),auth=load('app/email-auth.ts'),shared=load('app/api/shared.ts');
 assert.equal((await api.POST(request({action:'send',email:'user@example.com'},'https://attacker.invalid'))).status,403);assert.equal(calls.length,0);
 assert.equal((await api.POST(request({action:'verify',email:'user@example.com',token:'1234'}))).status,400);assert.equal(calls.length,0);
 allowed=false;assert.equal((await api.POST(request({action:'send',email:'user@example.com'}))).status,429);assert.equal(calls.length,0);allowed=true;
 reply={status:400,body:{msg:'invalid token'}};let r=await api.POST(request({action:'verify',email:'user@example.com',token:'12345678'}));assert.equal(r.status,400);assert.equal(r.headers.get('set-cookie'),null);
 reply={status:200,body:{access_token:'access.fixture',refresh_token:'refresh.fixture',expires_in:3600,user:{id:'uuid',email:'same@example.com',email_confirmed_at:'2026-10-24T00:00:00Z'}}};
 r=await api.POST(request({action:'verify',email:'user@example.com',token:'12345678'}));assert.equal(r.status,200);const serialized=await r.text();assert.equal(serialized,'{"ok":true}');assert.ok(!serialized.includes('fixture'));assert.match(r.headers.get('set-cookie'),/HttpOnly; Secure; SameSite=Lax/);
 jar.set(auth.ACCESS_COOKIE,'tampered');reply={status:401,body:{}};assert.equal(await shared.identity(),null);assert.equal(legacyCalls,0);
 reply={status:200,body:{id:'uuid',email:'same@example.com',email_confirmed_at:'2026-10-24T00:00:00Z',user_metadata:{role:'admin',sub:'legacy-owner'}}};const u=await shared.identity();assert.equal(u.userId,'supabase:uuid');assert.equal(legacyCalls,0);
 reply.body.email_confirmed_at=null;assert.equal(await auth.emailIdentity(),null);
 jar.clear();assert.equal((await shared.identity()).userId,'legacy-owner');assert.equal(legacyCalls,1);
 jar.set(auth.REFRESH_COOKIE,'refresh.fixture');reply={status:500,body:{}};r=await api.POST(request({action:'refresh'}));assert.equal(r.status,503);assert.equal(r.headers.get('set-cookie'),null);
 reply={status:400,body:{}};r=await api.POST(request({action:'refresh'}));assert.equal(r.status,401);assert.match(r.headers.get('set-cookie'),/Max-Age=0/);
 r=await api.POST(request({action:'logout'}));assert.equal(r.status,200);assert.match(r.headers.get('set-cookie'),/Max-Age=0/);

 const social=load('app/social-auth.ts'),socialApi=load('app/api/auth/social/route.ts'),callback=load('app/api/auth/callback/route.ts');
 reply={status:200,body:{external:{kakao:true,google:false}}};jar.clear();
 function socialReq(provider,origin='https://jobwave.kr'){return new Request('https://jobwave.kr/api/auth/social',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify({provider})})}
 assert.equal((await socialApi.POST(socialReq('kakao','https://attacker.invalid'))).status,403);
 assert.equal((await socialApi.POST(socialReq('unlisted'))).status,400);
 assert.equal((await socialApi.POST(socialReq('google'))).status,503);
 r=await socialApi.POST(socialReq('kakao'));assert.equal(r.status,200);const start=await r.json(),destination=new URL(start.url);assert.equal(destination.origin,'https://qdvqiqwxadgnramercze.supabase.co');assert.equal(destination.searchParams.get('redirect_to'),'https://jobwave.kr/api/auth/callback');assert.equal(destination.searchParams.get('code_challenge_method'),'s256');
 const verifier=r.headers.get('set-cookie').split(';')[0].split('=')[1];assert.equal(start.verifier,undefined);const challenge=Buffer.from(await webcrypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier))).toString('base64url');assert.equal(destination.searchParams.get('code_challenge'),challenge);
 r=await callback.GET(new Request('https://jobwave.kr/api/auth/callback?code=fixture-code'));assert.equal(r.headers.get('location'),'https://jobwave.kr/?auth=error');assert.ok(!r.headers.get('set-cookie').includes(auth.ACCESS_COOKIE));
 jar.set(social.VERIFIER_COOKIE,'bad');r=await callback.GET(new Request('https://jobwave.kr/api/auth/callback?code=fixture-code'));assert.equal(r.headers.get('location'),'https://jobwave.kr/?auth=error');
 jar.set(social.VERIFIER_COOKIE,verifier);reply={status:200,body:{access_token:'access.fixture',refresh_token:'refresh.fixture',expires_in:3600,user:{id:'social-uuid',identities:[{provider:'kakao'}]}}};r=await callback.GET(new Request('https://jobwave.kr/api/auth/callback?code=fixture-code'));assert.equal(r.status,303);assert.equal(r.headers.get('location'),'https://jobwave.kr/?auth=complete');assert.match(r.headers.get('set-cookie'),/jobwave-access/);assert.match(r.headers.get('set-cookie'),/jobwave-pkce=; Max-Age=0/);
 jar.set(auth.ACCESS_COOKIE,'access.fixture');reply={status:200,body:{id:'social-uuid',email:'admin@example.com',identities:[{provider:'kakao'}],user_metadata:{full_name:'Nickname',role:'admin'}}};const socialUser=await shared.identity();assert.equal(socialUser.email,'');assert.equal(socialUser.userId,'supabase:social-uuid');assert.equal(socialUser.displayName,'Nickname');
 assert.equal((await callback.GET(new Request('https://attacker.invalid/api/auth/callback?code=fixture'))).status,400);
 console.log('PASS: social-provider gating, cross-origin start rejection, PKCE challenge binding, verifier kept out of JSON, missing/bad verifier rejection, secure social callback, email-less Kakao identity, unverified email cannot grant admin rights, fixed redirects.');
 console.log('PASS: cross-origin rejection, OTP format and quotas, invalid-token rejection, HttpOnly cookies, no token response exposure, provider-verified identity, isolated account IDs, unconfirmed-user rejection, native sign-in preserved, refresh failures, logout.');
})().catch(e=>{console.error(e);process.exit(1)});
