'use strict';
// Compact disclosure navigation; move existing controls to retain their handlers and state.
(()=>{
 const header=document.querySelector('body>header'),nav=header?.querySelector('nav');if(!nav||nav.classList.contains('site-nav'))return;
 const original={};nav.querySelectorAll('[data-view]').forEach(b=>original[b.dataset.view]=b);
 const insight=nav.querySelector('a[href="/insights"]'),guide=nav.querySelector('a[href="/guides"]');
 document.body.classList.add('compact-nav');header.classList.add('site-header');nav.classList.add('site-nav');nav.setAttribute('aria-label','주요 서비스');
 const groups=[['career','커리어'],['discover','채용·인사이트'],['support','지원·상담']];
 const panels={};groups.forEach(([key,label])=>{const details=document.createElement('details');details.className='site-nav-group';details.dataset.navGroup=key;details.innerHTML=`<summary aria-controls="siteNav-${key}">${label}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3"/></svg></summary><div id="siteNav-${key}" class="site-nav-panel"></div>`;nav.append(details);panels[key]=details.querySelector('.site-nav-panel');details.addEventListener('toggle',()=>{if(details.open)nav.querySelectorAll('.site-nav-group').forEach(other=>{if(other!==details)other.open=false})})});
 function move(view,key){const b=original[view];if(b)panels[key].append(b)}
 move('career','career');
 panels.career.insertAdjacentHTML('beforeend','<button data-home-tool="assessment">커리어 진단</button><button data-home-tool="plan">커리어 플랜</button><button data-home-tool="records">경험·성과 기록</button>');if(guide)panels.career.append(guide);panels.career.insertAdjacentHTML('beforeend','<a href="/company">회사 소개</a>');
 panels.discover.insertAdjacentHTML('beforeend','<a href="/resources">실용 정보 · 일정·지원·교육</a>');if(original.today){original.today.textContent='채용공고';original.today.classList.add('site-nav-direct');nav.prepend(original.today)}move('calendar','discover');if(insight)panels.discover.append(insight);
 move('prep','support');move('saved','support');
 panels.support.insertAdjacentHTML('beforeend','<a href="/lectures">실전 취업특강 · 영상 강의</a><a href="/practice">취업연습실 · 자소서·검사·면접</a><button data-view="essay" data-nav-essay>잡웨이브 자소서</button><button data-consult-jump>무료 HR 상담</button>');
 nav.addEventListener('click',e=>{const b=e.target.closest('.site-nav-panel [data-view],.site-nav-direct[data-view]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();showView(b.dataset.view)},true);
 function close(focus=false){nav.querySelectorAll('.site-nav-group[open]').forEach(d=>{d.open=false;if(focus)d.querySelector('summary').focus()})}
 nav.addEventListener('click',e=>{if(e.target.closest('.site-nav-panel button,.site-nav-panel a'))close()});
 document.addEventListener('click',e=>{if(!nav.contains(e.target))close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=nav.querySelector('.site-nav-group[open]');if(open){e.preventDefault();close(true)}}});
 function admin(){const button=nav.querySelector(':scope>#consultationAdminNav');if(button)panels.support.append(button)}
 new MutationObserver(admin).observe(nav,{childList:true});admin();
 function mark(){const selected=['career','assessment','memberStart'].includes(currentView)?'career':['today','calendar'].includes(currentView)?'discover':['prep','saved','essay','consultationAdmin'].includes(currentView)?'support':null;nav.querySelectorAll('.site-nav-group').forEach(d=>d.classList.toggle('is-current',d.dataset.navGroup===selected))}
 const previous=showView;showView=function(view){previous(view);mark();close()};mark();
})();
