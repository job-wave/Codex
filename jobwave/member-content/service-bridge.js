(()=>{'use strict';
// Every legacy essay entry routes to one editor. Carry only user-selected, bounded context.
const previousView=showView;showView=function(view){if(view!=='essay')return previousView(view);const j=data.find(j=>j.id===$('#essayJob')?.value);const context={role:j?j.company+' · '+j.category:$('#essayRole')?.value||'',text:$('#essayText')?.value||'',job:j?`${j.company} · ${j.title}\n담당업무: ${(j.duties||[]).join(' / ')}\n자격요건: ${(j.requirements||[]).join(' / ')}`:'',at:Date.now()};try{sessionStorage.setItem('jobwave-practice-context',JSON.stringify(context))}catch{}location.href='/practice#essay'};
const previousLesson=showLesson;showLesson=function(id){if(id==='evidence'){location.href='/practice#essay';return}if(id==='interview'){location.href='/practice#interview';return}previousLesson(id)};
function unify(){document.querySelectorAll('[data-view="essay"],[data-nav-essay]').forEach(b=>b.textContent='잡웨이브 자소서');const prep=document.querySelector('#prep .page-title');if(prep){const h=prep.querySelector('h1'),p=prep.querySelector('p');if(h)h.textContent='지원 서류·제출 체크';if(p)p.textContent='선택한 공고의 필수 서류, 제출 조건, 지원 진행 상태를 확인하세요.'}const old=document.querySelector('#openEssayTool');if(old){old.querySelector('h3')&&(old.querySelector('h3').textContent='잡웨이브 자소서 ↗');old.querySelector('small')&&(old.querySelector('small').textContent='경험 정리 → 작성 → AI 코칭')}const panel=document.querySelector('#diagnosisPanel');if(panel&&careerProfile&&!panel.querySelector('.plan-first-week'))panel.insertAdjacentHTML('beforeend',`<a class="plan-first-week" href="/challenges/${careerProfile.type}">계획을 시작하는 첫 7일 · 작은 실천 코스 ↗</a>`)};
const oldCareer=renderCareer;renderCareer=function(){oldCareer();unify()};const oldHome=renderServiceHome;renderServiceHome=function(){oldHome();unify()};unify();
// A business request uses the existing private enquiry inbox, clearly labelled by topic.
let business=false;const u=new URL(location.href);if(u.searchParams.get('business')==='inquiry'){business=true;try{sessionStorage.setItem('jobwave-business-intent','1')}catch{}}else try{business=sessionStorage.getItem('jobwave-business-intent')==='1'}catch{}
function businessInquiry(){if(!business)return;showView('home');const details=$('#consultationDetails');if(!details)return;details.open=true;const title=$('#consultationTitle');if(title)title.textContent='교육·행사 협업 문의';const form=$('#consultationForm');if(form){const select=form.elements.namedItem('topic');if(select){if(!Array.from(select.options).some(o=>o.value==='교육·행사 협업'))select.add(new Option('교육·행사 협업','교육·행사 협업'));select.value='교육·행사 협업'}const note=form.elements.namedItem('note');if(note&&!note.value)note.placeholder='기관명 / 참여 대상·인원 / 일정 / 희망 프로그램 / 문의 내용을 남겨주세요.';const type=form.elements.namedItem('type');if(type)type.value='professional';business=false;try{sessionStorage.removeItem('jobwave-business-intent')}catch{}const url=new URL(location.href);url.searchParams.delete('business');history.replaceState(null,'',url.pathname+url.search+url.hash)}details.scrollIntoView({block:'center',behavior:'instant'});loadConsultation()}
const requestedView=u.searchParams.get('view');let openedEntry=false;
function openMemberEntry(){
 if(openedEntry||!account)return;
 if(requestedView==='account'){openedEntry=true;accountDialog()}
 else if(requestedView==='career'&&memberReady){openedEntry=true;window.openMemberStart()}
}
const oldConnected=careerConnected;careerConnected=function(){oldConnected();businessInquiry();openMemberEntry()};if(business)businessInquiry();openMemberEntry();
document.querySelectorAll('body>header .wordmark,footer .wordmark').forEach(link=>{link.href='/';link.onclick=null});
const startHome=document.querySelector('#memberStartHome');
if(startHome)startHome.onclick=()=>location.assign('/');
})();
