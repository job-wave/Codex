import assert from 'node:assert/strict';
import {webcrypto,generateKeyPairSync,publicEncrypt,constants} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import {DatabaseSync} from 'node:sqlite';
import * as zod from 'zod';
const sql=new DatabaseSync(':memory:');for(const file of (await readdir('drizzle')).filter(f=>f.endsWith('.sql')).sort())sql.exec((await readFile('drizzle/'+file,'utf8')).replaceAll('--> statement-breakpoint',''));
const DB={prepare(query){let args=[];const wrap={bind(...values){args=values;return wrap},async first(){return sql.prepare(query).get(...args)||null},async all(){return {results:sql.prepare(query).all(...args)}},async run(){const r=sql.prepare(query).run(...args);return {meta:{changes:Number(r.changes)}}}};return wrap}};
let auth=null;let mockFetch=async()=>{throw new Error('Unexpected external request')};
const environment={DB};
const context=vm.createContext({crypto:webcrypto,atob,TextEncoder,Uint8Array,TextDecoder,Response,Request,URL,Date,JSON,Number,Object,Array,String,Set,Error,RegExp,AbortSignal,console,fetch:(...args)=>mockFetch(...args)});
const modules=new Map();
function synthetic(id,exports){const m=new vm.SyntheticModule(Object.keys(exports),function(){for(const [k,v]of Object.entries(exports))this.setExport(k,v)},{context,identifier:id});return m}
const special={
 'cloudflare:workers':synthetic('cloudflare:workers',{env:environment}),
 'auth':synthetic('auth',{getChatGPTUser:async()=>auth}),
 'zod':synthetic('zod',zod)
};
async function load(path){path=resolve(path);if(modules.has(path))return modules.get(path);const src=await readFile(path,'utf8'),js=ts.transpileModule(src,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;const m=new vm.SourceTextModule(js,{context,identifier:path});modules.set(path,m);await m.link(async(spec,ref)=>{if(spec==='cloudflare:workers'||spec==='zod')return special[spec];if(spec.endsWith('chatgpt-auth'))return special.auth;return load(resolve(dirname(ref.identifier),spec+'.ts'))});return m}
const member=await load('app/api/member/route.ts'),ai=await load('app/api/analyze/route.ts'),jobs=await load('app/api/jobs/route.ts');for(const m of [member,ai,jobs])await m.evaluate();
const request=(path,payload,origin='https://test.invalid')=>new Request('https://test.invalid'+path,{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(payload)});
assert.equal((await member.namespace.GET()).status,401);
assert.equal((await member.namespace.PUT(request('/api/member',{},'https://foreign.invalid'))).status,403);
assert.equal((await ai.namespace.POST(request('/api/analyze',{}))).status,401);
assert.equal((await(await jobs.namespace.GET()).json()).mode,'error');
auth={userId:'alice',displayName:'Alice',email:'alice@test.invalid'};
assert.equal((await(await member.namespace.GET()).json()).version,0);
const state={'jobwave-saved':['work24-123'],'jobwave-preferences':{role:'개발·데이터',location:'서울',career:'신입'}};
assert.equal((await member.namespace.PUT(request('/api/member',{state,version:0}))).status,200);
assert.deepEqual((await(await member.namespace.GET()).json()).state,state);
assert.equal((await member.namespace.PUT(request('/api/member',{state,version:0}))).status,409);
assert.equal((await member.namespace.PUT(request('/api/member',{state:{'jobwave-schedules':[{}]},version:1}))).status,400);
auth={userId:'bob',displayName:'Bob',email:'bob@test.invalid'};
assert.deepEqual((await(await member.namespace.GET()).json()).state,{});
assert.equal((await ai.namespace.POST(request('/api/analyze',{text:'가'.repeat(150),consent:true}))).status,503);
const future='20991231',xml=`<dhsOpenEmpInfoList><dhsOpenEmpInfo><empSeqno>123</empSeqno><empWantedTitle><![CDATA[데이터 분석가 & 개발자]]></empWantedTitle><empBusiNm>기업</empBusiNm><empWantedStdt>20261001</empWantedStdt><empWantedEndt>${future}</empWantedEndt><empWantedTypeNm>정규직</empWantedTypeNm><empWantedHomepgDetail>https://example.com/jobs/123</empWantedHomepgDetail></dhsOpenEmpInfo></dhsOpenEmpInfoList>`;
assert.equal(jobs.namespace.parseJobs(xml).length,1);assert.equal(jobs.namespace.parseJobs(xml)[0].category,'개발·데이터');
assert.equal(jobs.namespace.parseJobs(xml.replace('https://example.com/jobs/123','javascript:alert(1)')).length,0);
assert.equal(jobs.namespace.parseJobs(xml.replace(future,'20200101')).length,0);
assert.throws(()=>jobs.namespace.parseJobs('<error>denied</error>'));
const shared=modules.get(resolve('app/api/shared.ts')).namespace;
assert.equal(await shared.openAIKey(),null);
const pair=generateKeyPairSync('rsa',{modulusLength:4096});
environment.OPENAI_KEY_PKCS8=pair.privateKey.export({type:'pkcs8',format:'der'}).toString('base64');
environment.OPENAI_KEY_CIPHERTEXT=publicEncrypt({key:pair.publicKey,oaepHash:'sha256',padding:constants.RSA_PKCS1_OAEP_PADDING},Buffer.from('sk-synthetic-local-test')).toString('base64');
assert.equal(shared.hasOpenAIKey(),true);
assert.equal(await shared.openAIKey(),'sk-synthetic-local-test');
console.log('PASS: encrypted credential roundtrip, unauthenticated access, origin protection, SQLite persistence, per-user isolation, concurrent write conflict, schema validation, missing API keys, XML parsing, expired listings, unsafe URLs.');

const feed=modules.get(resolve('app/api/jobs/feed.ts')).namespace;
const fixture={jobs:[{id:1,title:'Senior Data Engineer',internal_job_id:2,location:{name:'Seoul, Korea'},absolute_url:'https://example.com/job/1',content:'&lt;h3&gt;Responsibilities&lt;/h3&gt;&lt;p&gt;Build reliable pipelines.&lt;/p&gt;',first_published:'2026-01-01T00:00:00Z',updated_at:'2026-10-21T00:00:00Z'}],meta:{total:1}};
const normalized=feed.normalizeGreenhouse(fixture,feed.sources[0]);assert.equal(normalized.length,1);assert.equal(normalized[0].end,null);assert.equal(normalized[0].published,'2026-01-01T00:00:00.000Z');assert.equal(normalized[0].duties[0],'Build reliable pipelines.');
assert.equal(feed.normalizeGreenhouse({jobs:[{...fixture.jobs[0],location:{name:'San Francisco'}}]},feed.sources[0]).length,0);
assert.equal(feed.normalizeGreenhouse({jobs:[{...fixture.jobs[0],title:'Expression of Interest'}]},feed.sources[0]).length,0);
assert.equal(feed.normalizeGreenhouse({jobs:[{...fixture.jobs[0],absolute_url:'javascript:alert(1)'}]},feed.sources[0]).length,0);
assert.throws(()=>feed.normalizeGreenhouse({jobs:[],meta:{total:1}},feed.sources[0]));
mockFetch=async()=>Response.json(fixture);await feed.syncFeed();let snapshot=await feed.readFeed(false);assert.equal(snapshot.jobs.length,feed.sources.length);assert.equal(snapshot.mode,'live');
mockFetch=async()=>{throw Error('source down')};await feed.syncFeed();snapshot=await feed.readFeed(false);assert.equal(snapshot.jobs.length,feed.sources.length);assert.equal(snapshot.jobs[0].stale,true);assert.equal(snapshot.mode,'error');
mockFetch=async()=>Response.json({jobs:[...fixture.jobs,{...fixture.jobs[0],id:99,absolute_url:'https://example.com/job/1?utm_source=test#apply'},{...fixture.jobs[0],id:100,location:{name:'Busan, Korea'},absolute_url:'https://example.com/job/100'}],meta:{total:3}});await feed.syncFeed();snapshot=await feed.readFeed(false);assert.equal(snapshot.jobs.length,feed.sources.length*2);
mockFetch=async()=>Response.json({jobs:[],meta:{total:0}});await feed.syncFeed();assert.equal((await feed.readFeed(false)).jobs.length,0);
console.log('PASS: official feed normalization, actual published dates, nullable deadlines, foreign/pool/unsafe URL exclusion, incomplete response rejection, durable failure recovery, removed listing cleanup.');

// Career data shares the versioned per-user store; exercise real handler validation.
auth={userId:'career-alice',displayName:'Career Alice'};
const profile={type:'student',grade:1,stage:'explore',background:'경영학',role:'마케팅',target:'브랜드 마케터',goal:'관심 직무 비교하기',horizon:'이번 학기',hours:3};
const tasks=[{id:'t1',title:'직무 비교하기',due:'2026-10-29',done:false,track:'대학생 · 1학년',template:'student-1-explore-0'}];
const records=[{id:'r1',title:'프로젝트',date:'2026-10-22',kind:'수업·프로젝트',situation:'목표',action:'나의 행동',result:'확인한 결과',learning:'배운 점',skills:'협업',link:'https://example.com/portfolio'}];
const careerState={'jobwave-career-profile':profile,'jobwave-career-tasks':tasks,'jobwave-career-records':records};
assert.equal((await member.namespace.PUT(request('/api/member',{state:careerState,version:0}))).status,200);
assert.deepEqual((await(await member.namespace.GET()).json()).state,careerState);
const changed={...careerState,'jobwave-career-profile':{...profile,type:'professional',stage:'grow',horizon:'3개월'}};
assert.equal((await member.namespace.PUT(request('/api/member',{state:changed,version:1}))).status,200);
assert.deepEqual((await(await member.namespace.GET()).json()).state['jobwave-career-records'],records);
for(const invalid of [
 {...careerState,'jobwave-career-profile':{...profile,grade:5}},
 {...careerState,'jobwave-career-profile':{...profile,type:'professional',stage:'explore'}},
 {...careerState,'jobwave-career-tasks':[{...tasks[0],due:'2026-02-31'}]},
 {...careerState,'jobwave-career-tasks':[...tasks,...tasks]},
 {...careerState,'jobwave-career-records':[{...records[0],link:'javascript:alert(1)'}]}
])assert.equal((await member.namespace.PUT(request('/api/member',{state:invalid,version:2}))).status,400);
auth={userId:'career-bob',displayName:'Career Bob'};assert.deepEqual((await(await member.namespace.GET()).json()).state,{});
console.log('PASS: career profile/task/experience persistence, member-type transition without record loss, per-user isolation, impossible dates, duplicate IDs and unsafe link rejection.');
// Plan rules and persisted output share the same schema used by real members.
const plannerContext=vm.createContext({Date,Math,JSON,Number,Error});
vm.runInContext(await readFile('public/plan-engine.js','utf8'),plannerContext);
const planner=vm.runInContext('CareerPlanner',plannerContext);
const answer={clarity:'exploring',experience:'none',years:0,level:'start',skills:'글쓰기',evidence:'',blocker:'direction',priorities:['growth'],conditions:'시험 기간 고려'};
const smallProfile={...profile,hours:2};
const proposal=planner.build(smallProfile,answer,'2026-10-22');
assert.equal(proposal.months.length,3);assert.equal(proposal.months.flatMap(m=>m.tasks).length,6);
assert.equal(proposal.months[0].tasks[0].due,'2026-10-25');
const weekly=planner.week('2026-10-22');assert.equal(weekly.start,'2026-10-19');assert.equal(weekly.end,'2026-10-25');
const proProfile={...profile,type:'professional',stage:'apply',hours:8,role:'개발·데이터',target:'데이터 분석가'};
const experienced={...answer,clarity:'clear',experience:'work',years:5,level:'evidence',blocker:'documents',priorities:['growth','balance']};
const proPlan=planner.build(proProfile,experienced,'2026-10-22');
assert.equal(proPlan.months.flatMap(m=>m.tasks).length,9);assert.match(proPlan.summary,/지원/);assert.match(proPlan.months[0].tasks[0].title,/업무 성과/);
assert.notDeepEqual(JSON.parse(JSON.stringify(proPlan.months)),JSON.parse(JSON.stringify(proposal.months)));
for(const m of proPlan.months){assert.ok(m.tasks.every(t=>t.reason&&t.criterion&&t.estimate>0));assert.ok(m.tasks.reduce((s,t)=>s+t.estimate,0)<=4*proProfile.hours)}
assert.equal(planner.week('2026-10-25').end,'2026-10-25');assert.throws(()=>planner.build(profile,answer,'2026-02-31'));
const storedPlan=JSON.parse(JSON.stringify({id:'plan-1',createdAt:'2026-10-22',profile:smallProfile,answers:answer,...proposal}));
let taskCounter=0;storedPlan.months.forEach(m=>m.tasks.forEach(t=>t.id='plan-task-'+ ++taskCounter));
const plannedTasks=storedPlan.months.flatMap(m=>m.tasks.map(t=>({...t,done:false,track:'대학생 · 1학년',template:'student-1-explore-plan-1',planId:storedPlan.id,month:m.month})));
auth={userId:'planner-alice',displayName:'Planner Alice'};
const plannedState={'jobwave-career-profile':smallProfile,'jobwave-career-plan':storedPlan,'jobwave-career-tasks':plannedTasks};
assert.equal((await member.namespace.PUT(request('/api/member',{state:plannedState,version:0}))).status,200);
assert.deepEqual((await(await member.namespace.GET()).json()).state,plannedState);
const invalidPlan=JSON.parse(JSON.stringify(storedPlan));invalidPlan.months[1].tasks[0].id=invalidPlan.months[0].tasks[0].id;
assert.equal((await member.namespace.PUT(request('/api/member',{state:{...plannedState,'jobwave-career-plan':invalidPlan},version:1}))).status,400);
const badAnswers={...storedPlan,answers:{...answer,priorities:['growth','growth']}};
assert.equal((await member.namespace.PUT(request('/api/member',{state:{...plannedState,'jobwave-career-plan':badAnswers},version:1}))).status,400);
console.log('PASS: answer-sensitive planning, smaller scope for low weekly availability, per-task rationale and completion criteria, calendar-week boundaries, persisted plan/task compatibility, duplicate plan IDs and priorities rejected.');

const assessmentContext=vm.createContext({URL,Date,Map,Set,JSON,Object,Number,Array,String,Error});
vm.runInContext(await readFile('public/assessment-engine.js','utf8')+'\nthis.reflection=CareerAssessment;',assessmentContext);
const reflect=assessmentContext.reflection;
const studentReflection={id:'assessment-s1',version:1,type:'student',completedAt:'2026-10-22T12:00:00.000Z',answers:[5,4,0,3,3,3,1,2,0,4,4,4],grade:1,interests:['design','analysis'],values:['growth','autonomy']};
let reflection=reflect.analyze(studentReflection);
assert.equal(reflection.axes[0].mean,4.5);assert.equal(reflection.axes[0].unknown,1);assert.equal(reflection.focus.name,'직무 탐색');assert.equal(reflection.actions.length,3);assert.equal(reflection.roles.length,3);
const uncertain=reflect.analyze({...studentReflection,answers:Array(12).fill(0)});assert.equal(uncertain.axes.every(a=>a.mean===null),true);assert.equal(uncertain.strengths.length,0);assert.equal(uncertain.allUnknown,true);
assert.equal(reflect.analyze({...studentReflection,answers:[5,0,0,3,3,3,3,3,3,3,3,3]}).axes[0].mean,null);
assert.throws(()=>reflect.analyze({...studentReflection,answers:[6,...Array(11).fill(1)]}));assert.throws(()=>reflect.analyze({...studentReflection,interests:['design','design']}));
const professionalReflection={id:'assessment-p1',version:1,type:'professional',completedAt:'2026-10-22T12:00:00.000Z',answers:[5,5,4,1,2,1,3,4,3,4,4,3],role:'서비스 기획',years:5,direction:'move'};
assert.equal(reflect.analyze(professionalReflection).focus.name,'성과 증거');assert.equal(reflect.analyze(professionalReflection).roles.length,0);
const gradeOne=reflect.analyze({...studentReflection,answers:[4,4,4,4,4,4,4,4,4,1,1,1]});
const gradeFour=reflect.analyze({...studentReflection,grade:4,answers:[4,4,4,4,4,4,4,4,4,1,1,1]});assert.notEqual(gradeOne.actions[1].title,gradeFour.actions[1].title);
auth={userId:'assessment-alice',displayName:'Assessment Alice'};
const reflectionState={...plannedState,'jobwave-assessments':{student:studentReflection,professional:professionalReflection}};
assert.equal((await member.namespace.PUT(request('/api/member',{state:reflectionState,version:0}))).status,200);
assert.deepEqual((await(await member.namespace.GET()).json()).state,reflectionState);
for(const invalid of [{...studentReflection,answers:Array(11).fill(1)},{...studentReflection,answers:[6,...Array(11).fill(1)]},{...studentReflection,interests:['design','design']},{...studentReflection,values:['growth','balance','salary']},{...studentReflection,completedAt:'yesterday'},{...studentReflection,unexpected:'x'}])assert.equal((await member.namespace.PUT(request('/api/member',{state:{'jobwave-assessments':{student:invalid}},version:1}))).status,400);
assert.equal((await member.namespace.PUT(request('/api/member',{state:{'jobwave-assessments':{professional:{...professionalReflection,years:-1}}},version:1}))).status,400);
assert.equal((await member.namespace.PUT(request('/api/member',{state:{'jobwave-assessments':{student:professionalReflection}},version:1}))).status,400);
auth={userId:'assessment-bob',displayName:'Assessment Bob'};assert.deepEqual((await(await member.namespace.GET()).json()).state,{});
console.log('PASS: two reflection types, unknown answers excluded, minimum two responses for means, answer/grade-sensitive actions, strict result persistence, existing plan preservation and per-user isolation.');

const refreshRoute=await load('app/api/jobs/refresh/route.ts');await refreshRoute.evaluate();auth=null;
assert.equal((await member.namespace.GET()).status,401);
assert.equal((await member.namespace.PUT(request('/api/member',{state:{},version:0}))).status,401);
assert.equal((await ai.namespace.POST(request('/api/analyze',{}))).status,401);
assert.equal((await refreshRoute.namespace.POST(request('/api/jobs/refresh',{}))).status,401);
environment.JOB_REFRESH_TOKEN='synthetic-updater-test-token';
const refreshReq=(token,origin='https://test.invalid')=>new Request('https://test.invalid/api/jobs/refresh',{method:'POST',headers:{'X-Jobwave-Refresh-Token':token,origin},body:'{}'});
assert.equal((await refreshRoute.namespace.POST(refreshReq('wrong'))).status,401);
assert.equal((await refreshRoute.namespace.POST(refreshReq(environment.JOB_REFRESH_TOKEN,'https://foreign.invalid'))).status,403);
mockFetch=async()=>Response.json({jobs:[],meta:{total:0}});
assert.equal((await refreshRoute.namespace.POST(refreshReq(environment.JOB_REFRESH_TOKEN))).status,200);
assert.equal((await jobs.namespace.GET()).status,200);
console.log('PASS: public feed read, anonymous member/AI access blocked, missing/wrong updater credentials rejected and valid scheduled refresh accepted.');

// Consultation intake uses independent records, consent validation and owner-only administration.
const consultations=await load('app/api/consultations/route.ts');await consultations.evaluate();
auth=null;
assert.equal((await consultations.namespace.GET(new Request('https://test.invalid/api/consultations'))).status,401);
assert.equal((await consultations.namespace.POST(request('/api/consultations',{}))).status,401);
auth={userId:'consult-alice',displayName:'Alice',email:'alice@test.invalid'};
const intake={type:'student',name:'테스트 신청자',email:'applicant@example.invalid',topic:'진로·직무 탐색',availability:'평일 오후',note:'직무 탐색 상담',consent:true};
assert.equal((await consultations.namespace.POST(request('/api/consultations',intake,'https://foreign.invalid'))).status,403);
assert.equal((await consultations.namespace.POST(request('/api/consultations',{...intake,consent:false}))).status,400);
assert.equal((await consultations.namespace.POST(request('/api/consultations',{...intake,email:'invalid'}))).status,400);
let intakeResponse=await consultations.namespace.POST(request('/api/consultations',intake));assert.equal(intakeResponse.status,201);const intakeId=(await intakeResponse.json()).id;
assert.equal((await consultations.namespace.POST(request('/api/consultations',intake))).status,409);
let myRequests=(await(await consultations.namespace.GET(new Request('https://test.invalid/api/consultations'))).json()).requests;assert.equal(myRequests.length,1);assert.equal(myRequests[0].email,intake.email);
assert.equal((await consultations.namespace.GET(new Request('https://test.invalid/api/consultations?scope=all'))).status,403);
auth={userId:'consult-bob',displayName:'Bob',email:'bob@test.invalid'};
assert.equal((await(await consultations.namespace.GET(new Request('https://test.invalid/api/consultations'))).json()).requests.length,0);
assert.equal((await consultations.namespace.PATCH(request('/api/consultations',{id:intakeId,status:'cancelled'}))).status,404);
assert.equal((await consultations.namespace.PATCH(request('/api/consultations',{id:intakeId,status:'completed'}))).status,403);
environment.CONSULTATION_ADMIN_EMAIL='admin@example.invalid';auth={userId:'consult-admin',email:'admin@example.invalid'};
assert.equal((await(await consultations.namespace.GET(new Request('https://test.invalid/api/consultations?scope=all'))).json()).requests.length,1);
assert.equal((await consultations.namespace.PATCH(request('/api/consultations',{id:intakeId,status:'contacted'}))).status,200);
auth={userId:'consult-alice',displayName:'Alice',email:'alice@test.invalid'};
assert.equal((await consultations.namespace.PATCH(request('/api/consultations',{id:intakeId,status:'cancelled'}))).status,200);
assert.equal((await consultations.namespace.POST(request('/api/consultations',intake))).status,201);
sql.prepare("UPDATE consultation_requests SET created_at='2020-01-01T00:00:00.000Z' WHERE user_id='consult-alice'").run();
assert.equal((await(await consultations.namespace.GET(new Request('https://test.invalid/api/consultations'))).json()).requests.length,0);
console.log('PASS: consultation consent validation, authenticated intake, atomic duplicate prevention, user isolation, admin authorization, owner cancellation and 90-day retention cleanup.');
