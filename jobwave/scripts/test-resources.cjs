const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
function load(f){f=path.resolve(f);if(f.endsWith('.json'))return JSON.parse(fs.readFileSync(f,'utf8'));const m={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,{exports:m.exports,module:m,require:s=>load(path.resolve(path.dirname(f),s.endsWith('.json')?s:s+'.ts')),Response,URL});return m.exports}
const {sections,summarize,detailHtml,hubHtml,careerLabel}=load('app/resources/content.ts'),data=load('public/practical-resources.json');
assert.equal(sections.length,6);assert.equal(sections.filter(s=>s.audience==='student').length,3);for(const s of sections){const html=detailHtml(s.slug);assert(html.includes('<h1>'+s.title+'</h1>'));assert(html.includes('https://jobwave.kr/resources/'+s.slug));}assert(hubHtml().includes('data-resource-panel="professional"'));assert.equal(detailHtml('bad'),null);
// Deduplicate and exclude closed/talent pool jobs; count each tool once per job, never mistake JavaScript for Java.
const jobs=[{id:'1',url:'https://example.com/a',company:'A',category:'개발',title:'<script>oops</script>',end:'2026-10-26',requirements:['Python Python SQL JavaScript'],preferred:['Python'],duties:['협업'],career:'경력'},{id:'2',url:'https://example.com/b',company:'A',category:'개발',end:'2026-10-25',requirements:['Python']},{id:'3',url:'https://example.com/a#apply',company:'A',category:'개발',requirements:['Java']},{id:'4',url:'https://example.com/d',company:'B',category:'기획',requirements:['Excel'],talentPool:true},{id:'5',url:'https://example.com/e',company:'B',category:'기획',requirements:[]}];
const s=summarize(jobs,'all',new Date('2026-10-25T15:00:00Z'));assert.equal(s.total,2);assert.equal(s.detailCount,1);assert.equal(s.tools.find(x=>x.name==='Python').count,1);assert(!s.tools.some(x=>x.name==='Java'));assert.equal(summarize(jobs,'개발',new Date('2026-10-26T00:00:00Z')).total,1);assert.equal(summarize(jobs,'all',new Date('2026-10-26T15:00:00Z')).total,1);
const html=detailHtml('market',{jobs,mode:'partial',checkedAt:'2026-10-26T00:00:00Z'});assert(!html.includes('<script>oops</script>'));assert(html.includes('표본'));assert(html.includes('필수와 우대'));assert(detailHtml('market',{jobs:[]}).includes('아직 요약할 공고가 없어요'));
assert.equal(new Set(data.exams.map(x=>x.id)).size,data.exams.length);for(const event of data.exams){assert(!Number.isNaN(Date.parse(event.at)));assert(event.url.startsWith('https://'));if(event.at.includes('T'))assert(event.at.endsWith('+09:00'));}assert(!data.exams.some(x=>['오픽','컴퓨터활용능력','SQLD'].includes(x.exam)));assert.equal(data.lookups.length,4);
// ICS helper is tested independently using the exact functions shipped to the browser.
const client=fs.readFileSync('public/resources.js','utf8'),helpers=client.slice(client.indexOf('function icsEscape'),client.indexOf("if(!$('#examCalendar'))return;"));const ctx={};vm.runInNewContext(helpers+';this.ics=eventIcs;',ctx);const timed=ctx.ics({id:'test',at:'2026-11-03T10:00+09:00',exam:'한국사',session:'81회',type:'접수 시작',url:'https://example.com'});assert(timed.includes('DTSTART:20261103T010000Z'));const day=ctx.ics({id:'date',at:'2026-11-28',exam:'한국사',session:'81회',type:'시험일',url:'https://example.com'});assert(day.includes('DTSTART;VALUE=DATE:20261128'));assert(day.includes('DTEND;VALUE=DATE:20261129'));
console.log('PASS: six public resources, escaped content, deduplicated bounded market sample, KST expiry boundary, dated sources, event IDs, all-day/timed calendar export.');

assert.equal(careerLabel({title:'Senior IT Internal Auditor',career:'인턴',careerMethod:'공고 제목 기반 분류 · 지원자격은 원문 확인'}),'경력 (제목 기준)');assert.equal(careerLabel({title:'Marketing Intern',careerMethod:'공고 제목 기반 분류'}),'인턴 (제목 기준)');
// Homepage deadlines are selected at render time from the dated source, never promote an expired registration.
const {editorialHome}=load('app/resources/editorial.ts');
const homeBefore=editorialHome(new Date('2026-10-28T03:00:00Z'));
assert(homeBefore.includes('토익 추가 접수 마감'));
const homeAfter=editorialHome(new Date('2026-10-28T04:00:01Z'));
assert(homeAfter.includes('유통관리사 2급 접수 마감'));
assert(!homeAfter.includes('토익 추가 접수 마감'));
const exhausted=editorialHome(new Date('2028-01-01T00:00:00Z'));
assert(exhausted.includes('다음 시험,'));assert(exhausted.includes('등록된 모집 기간이 끝났어요'));
assert(homeAfter.includes('2026-10-26'));assert(homeAfter.includes('/resources/tips#tip-report'));
console.log('PASS: homepage uses upcoming deadlines, excludes closed registrations, handles exhausted snapshots, and preserves source dates.');
