'use strict';
(()=>{
let coverObserver;
function sync(){
 const audience=window.JobwaveHomeAudience?.()||'student';
 document.querySelectorAll('[data-editorial-audience]').forEach(b=>{const active=b.dataset.editorialAudience===audience;if(b.getAttribute('role')==='radio'){b.setAttribute('aria-checked',String(active));b.tabIndex=active?0:-1}else{b.removeAttribute('aria-checked');b.setAttribute('aria-pressed',String(active));b.tabIndex=0}});
 document.querySelectorAll('[data-editorial-panel]').forEach(p=>p.hidden=p.dataset.editorialPanel!==audience);
 const student=audience==='student';
 const description=document.querySelector('#homeHeroDescription');if(description)description.textContent='나를 이해하고, 방향을 정하고, 경험과 성과를 쌓아갑니다. 잡웨이브는 진로의 시작부터 경력의 다음 단계까지 함께합니다.';
 const line=document.querySelector('.editorial-cover-line');if(line)line.innerHTML=student?'전공 밖의 가능성도,<br>내 커리어가 되도록.':'매일의 일이,<br>다음 기회가 되도록.';
 const cover=document.querySelector('.editorial-cover');if(cover)cover.dataset.audience=audience;
 const label=document.querySelector('.editorial-cover-type');if(label)label.textContent=student?'CAMPUS EDITION':'WORK EDITION';
 const start=document.querySelector('[data-home-why]');if(start)start.textContent=student?'학년별 커리어 플랜 보기':'경력 관리 시작하기';
}
function enhance(){
 const home=document.querySelector('#home');if(!home)return;
 document.body.classList.add('home-editorial');
 const hero=home.querySelector('.home-main-hero');if(!hero)return;
 hero.querySelector('.home-hero-copy').innerHTML=`<div class="editorial-audience" role="radiogroup" aria-label="나에게 맞는 홈 콘텐츠"><button data-editorial-audience="student" role="radio" aria-checked="true">대학생</button><button data-editorial-audience="professional" role="radio" aria-checked="false">직장인</button></div><span class="group-kicker">YOUR CAREER, ONE CONNECTED JOURNEY.</span><h1 id="homeHeroTitle"><small>첫 진로부터 다음 이직까지,</small>내 커리어를<br><span>스스로 설계하는 곳.</span></h1><p id="homeHeroDescription"></p><div class="home-hero-actions"><button class="primary" data-home-why>학년별 커리어 플랜 보기 <span aria-hidden="true">↘</span></button><button class="home-text-link" data-home-tool="jobs">채용공고 보기 ↗</button><button class="home-text-link" data-home-discover>실용 정보 보기</button></div><span class="hero-open-note">모든 콘텐츠는 가입 · 로그인 후 이용</span>`;
 hero.querySelector('.service-art').innerHTML=`<div class="editorial-cover" data-audience="student"><div class="editorial-cover-top"><span>THE NEXT<br><b>CHAPTER.</b></span><span class="editorial-cover-type">CAMPUS EDITION</span></div><div class="editorial-cover-wave" aria-hidden="true"><svg viewBox="0 0 500 220"><defs><pattern id="editorialDots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor" opacity=".22"/></pattern></defs><rect width="500" height="220" fill="url(#editorialDots)"/><path class="editorial-wave-back" d="M-30 204C110 204 105 99 235 99S375 4 520 4"/><path class="editorial-wave-line" d="M-30 204C110 204 105 99 235 99S375 4 520 4"/><circle cx="235" cy="99" r="24" fill="#d4f769"/><path d="M226 109 245 90m-18 0h18v18" fill="none" stroke="#202b28" stroke-width="3" stroke-linecap="square"/></svg><span class="editorial-wave-tag">진단 · 설계 · 기록 · 기회</span></div><div class="editorial-cover-bottom"><p class="editorial-cover-line">전공 밖의 가능성도,<br>내 커리어가 되도록.</p><button data-open-film aria-label="1분으로 보는 잡웨이브 영상 열기"><span aria-hidden="true">▶</span> 1분으로 보는 잡웨이브</button></div></div>`;
 const career=home.querySelector('#homeAudienceTitle');if(career)career.textContent='대학생과 직장인, 준비 방법은 다릅니다';
 const careerSection=home.querySelector('#serviceFeatures');
 if(careerSection){
  hero.after(careerSection);
  careerSection.querySelector('.group-kicker').textContent='01 / WHY JOBWAVE';
  careerSection.querySelector('.vision-choices')?.remove();
  careerSection.querySelector('.home-section-top').insertAdjacentHTML('afterend',`<div class="vision-choices" role="radiogroup" aria-label="대상별 커리어 설계가 필요한 이유"><button class="vision-choice" data-editorial-audience="student" role="radio" aria-checked="true"><span class="vision-choice-label">FOR STUDENTS <b>대학생</b></span><strong>학년별로 준비할 경험을<br>미리 정리하세요.</strong><p>방향을 일찍 탐색하면 수업·자격증·프로젝트·인턴이 하나의 준비로 연결됩니다.</p><span class="vision-choice-action">학년별로 무엇을 얻을까요? <i aria-hidden="true">↘</i></span></button><button class="vision-choice" data-editorial-audience="professional" role="radio" aria-checked="false"><span class="vision-choice-label">FOR PROFESSIONALS <b>직장인</b></span><strong>업무 성과를 기록하고<br>다음 직무를 준비하세요.</strong><p>이직할 때만 경력을 정리하면 성과를 놓치기 쉽습니다. 평소의 기록이 나의 강점과 다음에 필요한 역량을 보여줍니다.</p><span class="vision-choice-action">경력을 어떻게 쌓아갈까요? <i aria-hidden="true">↘</i></span></button></div>`);
 }
 const discover=home.querySelector('#homeDiscover .group-kicker');if(discover)discover.textContent='02 / USEFUL TODAY';
 const support=home.querySelector('#homeSupportTitle');if(support)support.textContent='서류·면접 연습과 상담';
 sync();pauseCover();
 coverObserver?.disconnect();const cover=document.querySelector('.editorial-cover');if(cover&&typeof IntersectionObserver==='function'){coverObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-cover-visible',entry.isIntersecting)),{threshold:.1});coverObserver.observe(cover)}
}
const previous=renderServiceHome;renderServiceHome=function(){previous();enhance()};
document.addEventListener('jobwave:audience',sync);
document.addEventListener('keydown',event=>{
 const radio=event.target.closest('[data-editorial-audience]');
 if(!radio?.closest('[role=radiogroup]')||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
 const other=Array.from(radio.closest('[role=radiogroup]').querySelectorAll('[role=radio]')).find(b=>b!==radio);
 if(other){event.preventDefault();other.click();other.focus()}
});
document.addEventListener('click',event=>{
 const audience=event.target.closest('[data-editorial-audience]');if(audience)window.JobwaveSelectAudience(audience.dataset.editorialAudience);
 if(event.target.closest('[data-home-why]')){const panel=document.querySelector('#homeAudiencePanel');if(panel){panel.tabIndex=-1;panel.focus({preventScroll:true});panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})}}
 if(event.target.closest('[data-home-discover]')){const tab=document.querySelector('[data-read-tab="resources"]');tab?.click();document.querySelector('#homeDiscover')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})}
});
// Mirror the reduced-motion/pause setting used by content scenes for the cover path.
function pauseCover(){const control=document.querySelector('[data-resource-motion-toggle]');document.querySelector('.editorial-cover')?.classList.toggle('is-paused',document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches||control?.getAttribute('aria-pressed')==='true')}
document.addEventListener('click',event=>{if(event.target.closest('[data-resource-motion-toggle]'))pauseCover()});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',pauseCover);
document.addEventListener('visibilitychange',pauseCover);
enhance();pauseCover();document.querySelector('#bootStyle')?.remove();
})();
