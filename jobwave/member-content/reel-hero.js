'use strict';
(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const topics=[
 ['커리어 플랜','plan','대학생은 학년별로 쌓을 경험을, 직장인은 다음 직무를 위한 목표와 계획을 정리할 수 있어요.','내 플랜 시작하기'],
 ['AI 면접','/practice#interview'],
 ['채용공고','today'],
 ['역량 검사','/practice/ai-assessment'],
 ['업무 성과 기록','records','프로젝트에서 맡은 역할과 결과를 기록해 두면 이력서 작성과 면접 준비에 다시 꺼내 쓸 수 있어요.','성과 기록하기'],
 ['자소서 연습','/practice#essay'],
 ['시험 일정','/resources/exams'],
 ['이직 준비','career','다음에 하고 싶은 일과 지금까지 쌓은 경험을 비교하고 이직 계획을 세워 보세요.','나의 커리어 보기']
];
let current;
function mount(){
 const hero=document.querySelector('#home .home-main-hero');
 if(!hero||hero===current)return;
 current=hero;
 const audience=hero.querySelector('.editorial-audience');
 hero.classList.add('jw-journal-hero','jw-studio-hero');
 document.body.classList.add('career-content-home');
 hero.innerHTML=`<div class="jw-studio-main next-member-hero"><p class="next-kicker">나의 커리어 준비</p><h1 id="homeHeroTitle">첫 취업 준비도.<br>다음 이직 준비도.</h1><p class="next-lead">대학생은 학년별 진로와 경험을,<br>직장인은 경력 관리와 이직 준비를.<br>나에게 맞는 계획부터 자소서·면접까지 준비하세요.</p><div class="jw-studio-actions"><button type="button" data-studio-start="student">대학생으로 시작</button><button type="button" data-studio-start="professional" class="jw-studio-outline">직장인으로 시작</button></div><a class="jw-studio-more" href="#careerAudienceOverview">나에게 맞는 준비 살펴보기 ↓</a></div>${document.querySelector('#careerAudienceTemplate')?.innerHTML||''}
 <section class="next-member-shortcuts" aria-label="주요 서비스"><button type="button" data-home-tool="jobs"><span>채용공고</span><b>기업 공식 공고 찾기</b><i>↗</i></button><a href="/practice"><span>취업연습실</span><b>자소서·검사·면접 연습</b><i>↗</i></a><a href="/lectures"><span>실전 취업특강</span><b>영상으로 배우는 자소서와 면접</b><i>↗</i></a></section>
 <details class="jw-journal-index"><summary>전체 서비스 <span aria-hidden="true">＋</span></summary><div class="jw-journal-tools">${topics.map(([name,target,desc,label],i)=>target.startsWith('/')?`<a href="${target}"><b>${name}</b><i aria-hidden="true">↗</i></a>`:`<button type="button" data-journal-topic="${i}"><b>${name}</b><i aria-hidden="true">↗</i></button>`).join('')}</div></details><details class="career-preview-disclosure"><summary>서비스 화면 예시 보기 <span aria-hidden="true">＋</span></summary>${document.querySelector('#nextProductTemplate')?.innerHTML||''}</details>`;
 hero.querySelectorAll('[data-studio-start]').forEach(button=>button.onclick=()=>{
  window.JobwaveSelectAudience(button.dataset.studioStart);
  try{sessionStorage.setItem('jobwave-start-type',button.dataset.studioStart)}catch{}
  hero.querySelector('[data-home-start]')?.remove();
  const trigger=document.createElement('button');trigger.type='button';trigger.hidden=true;trigger.setAttribute('data-home-start','');hero.append(trigger);trigger.click();trigger.remove();
 });
 if(!reduce.matches&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.animate([{opacity:.65,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.2,.8,.2,1)'});
   observer.unobserve(entry.target);
  }),{threshold:.12});
  hero.querySelectorAll('.jw-studio-tile').forEach(node=>observer.observe(node));
 }

 const dialog=document.createElement('dialog');dialog.className='jw-reel-dialog';dialog.setAttribute('aria-labelledby','jw-journal-dialog-title');
 dialog.innerHTML='<form method="dialog"><button aria-label="안내 닫기">닫기</button></form><h2 id="jw-journal-dialog-title"></h2><p></p><button type="button" class="jw-reel-guide-action"></button>';
 hero.append(dialog);
 let origin;
 dialog.addEventListener('close',()=>origin?.focus({preventScroll:true}));
 hero.querySelectorAll('[data-journal-topic]').forEach(button=>button.onclick=()=>{
  const [name,target,desc,label]=topics[Number(button.dataset.journalTopic)];
  if(!desc){showView(target);return}
  origin=button;dialog.querySelector('h2').textContent=name;dialog.querySelector('p').textContent=desc;
  const action=dialog.querySelector('.jw-reel-guide-action');action.textContent=label;
  action.onclick=()=>{origin=null;dialog.close();if(target==='plan'||target==='records')document.querySelector(`.site-nav-panel [data-home-tool="${target}"]`)?.click();else showView(target)};
  dialog.showModal();
 });
}
const carousels=new WeakMap();
document.addEventListener('jobwave:audience',event=>{
 document.querySelectorAll('#serviceFeatures .vision-choices').forEach(rail=>carousels.get(rail)?.(event.detail));
});
function mountRecommendations(){
 document.querySelectorAll('#homeDiscover .edit-rail,#serviceFeatures .vision-choices,#homeSupport .support-tools').forEach(rail=>{
  if(rail.dataset.rotating)return;
  const items=[...rail.querySelectorAll(':scope > :is(.edit-short,.vision-choice,.support-tool)')];if(items.length<2)return;
  const vision=rail.classList.contains('vision-choices');
  rail.dataset.rotating='true';
  const controls=document.createElement('div');
  controls.className='jw-rec-controls';
  controls.innerHTML='<button type="button" aria-label="이전 카드">←</button><span class="jw-rec-position" aria-live="polite"></span><button type="button" aria-label="다음 카드">→</button><button type="button">자동 넘김 재생</button>';
  if(rail.classList.contains('edit-rail'))rail.append(controls);else rail.after(controls);
  const [prev,next,toggle]=controls.querySelectorAll('button');
  const position=controls.querySelector('span');
  const title=item=>item.querySelector('h3,strong,b')?.textContent.replace('↗','').trim()||item.textContent.trim();
  let active=-1,gesture,swiped=false,turn,paused=true,visible=false,lastInput=0,wheelAt=0,wheelTotal=0,wheelHandled=false;
  function show(index,motion,focus=false){
   index=(index+items.length)%items.length;
   if(index===active)return;
   const direction=index>active?1:-1;
   const restore=focus||items[active]?.contains(document.activeElement);
   active=index;
   items.forEach((item,i)=>{
    item.hidden=i!==active;
   });
   position.textContent=(active+1)+' / '+items.length+' · '+title(items[active]);
   if(restore)items[active].focus({preventScroll:true});
   turn?.cancel();
   if(motion&&!reduce.matches)turn=items[active].animate([
    {opacity:.35,transform:'translateX('+(direction*18)+'px)'},
    {opacity:1,transform:'translateX(0)'}
   ],{duration:300,easing:'cubic-bezier(.2,.8,.2,1)'});
  }
  function step(direction,focus=false){lastInput=Date.now();show(active+direction,true,focus)}
  prev.onclick=()=>step(-1);next.onclick=()=>step(1);
  toggle.onclick=()=>{
   paused=!paused;lastInput=Date.now();
   toggle.textContent=paused?'자동 넘김 재개':'자동 넘김 일시정지';
   position.setAttribute('aria-live',paused?'polite':'off');
  };
  const motion=()=>{toggle.hidden=reduce.matches;position.setAttribute('aria-live',paused||reduce.matches?'polite':'off')};
  reduce.addEventListener('change',motion);motion();
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting},{threshold:.25});observer.observe(rail);
  const timer=setInterval(()=>{
   if(!rail.isConnected){clearInterval(timer);observer.disconnect();reduce.removeEventListener('change',motion);return}
   if(visible&&!document.hidden&&!paused&&!reduce.matches&&!gesture&&Date.now()-lastInput>5000&&!rail.matches(':focus-within')&&!(matchMedia('(hover:hover)').matches&&(rail.matches(':hover')||controls.matches(':hover')))&&!controls.matches(':focus-within'))show(active+1,true);
  },5000);
  rail.addEventListener('wheel',event=>{
   if(event.ctrlKey||(!event.shiftKey&&Math.abs(event.deltaX)<=Math.abs(event.deltaY)))return;
   const delta=event.deltaX||event.deltaY;if(!delta)return;
   event.preventDefault();
   const now=Date.now();lastInput=now;
   if(now-wheelAt>160){wheelTotal=0;wheelHandled=false}
   wheelAt=now;wheelTotal+=delta*(event.deltaMode===1?16:event.deltaMode===2?120:1);
   if(!wheelHandled&&Math.abs(wheelTotal)>24){wheelHandled=true;step(Math.sign(wheelTotal))}
  },{passive:false});
  function onKey(event){
   if(event.altKey||event.ctrlKey||event.metaKey||!['ArrowLeft','ArrowRight'].includes(event.key))return;
   event.preventDefault();event.stopPropagation();
   step(event.key==='ArrowLeft'?-1:1,items[active]?.contains(document.activeElement));
  }
  rail.addEventListener('keydown',onKey);controls.addEventListener('keydown',onKey);
  rail.addEventListener('pointerdown',event=>{
   if(event.isPrimary&&event.button===0){gesture=[event.pointerId,event.clientX,event.clientY];swiped=false}
  });
  rail.addEventListener('pointercancel',()=>{gesture=null});
  rail.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse')gesture=null});
  rail.addEventListener('pointerup',event=>{
   if(gesture?.[0]!==event.pointerId)return;
   const dx=event.clientX-gesture[1],dy=event.clientY-gesture[2];gesture=null;
   if(Math.abs(dx)>36&&Math.abs(dx)>Math.abs(dy)*1.5){swiped=true;step(dx<0?1:-1)}
  });
  rail.addEventListener('click',event=>{if(swiped&&event.detail!==0){swiped=false;event.preventDefault();event.stopImmediatePropagation()}},true);
  if(vision){
   rail.removeAttribute('role');
   rail.setAttribute('role','group');
   items.forEach(item=>{item.removeAttribute('role');item.setAttribute('aria-pressed',item.getAttribute('aria-checked'));item.removeAttribute('aria-checked');item.tabIndex=0});
   carousels.set(rail,value=>{const i=items.findIndex(item=>item.dataset.editorialAudience===value);if(i>=0)show(i,false)});
  }
  show(vision?Math.max(0,items.findIndex(item=>item.getAttribute('aria-pressed')==='true')):0,false);
 });
}
const previous=renderServiceHome;renderServiceHome=function(){previous();mount();mountRecommendations()};
mount();mountRecommendations();
})();
