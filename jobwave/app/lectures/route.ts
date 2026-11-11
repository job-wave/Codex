import {page} from '../visitor';
import {loginHref,memberGate} from '../member-access';
import {publishedLectures,lectureCategories,categoryAnchors} from './catalog';
export const dynamic='force-dynamic';
export async function GET(){
 const member=!(await memberGate('/lectures'));const all=publishedLectures();
 return page('취업·진로·AI 강의실',`<main class="lecture-main"><p class="eyebrow">JOBWAVE CLASS</p><h1>취업·진로·AI 강의실.</h1><p>진로를 탐색하고, 취업을 준비하고, AI를 일상에 활용하는 수업.<br>${member?'영상을 보며 직접 작성할 강의안과 활동지를 함께 제공합니다.':'강의 소개를 먼저 살펴보세요. 영상과 강의 자료는 로그인 후 이용할 수 있어요.'}</p><nav class="lecture-categories" aria-label="강의 분야">${lectureCategories.map(c=>`<a href="#${categoryAnchors[c]}">${c} <span>${all.filter(l=>l.category===c).length}개</span></a>`).join('')}</nav>${lectureCategories.map(c=>{const items=all.filter(l=>l.category===c);return items.length?`<section id="${categoryAnchors[c]}" class="lecture-category" aria-labelledby="heading-${categoryAnchors[c]}"><h2 id="heading-${categoryAnchors[c]}">${c} 강의 <small>${items.length}개</small></h2><div class="lecture-grid">${items.map(l=>`<a class="lecture-card" href="${member?'/lectures/'+l.id:loginHref('/lectures/'+l.id)}"><img src="${l.poster}" alt="" width="960" height="540" loading="lazy"><div><span class="lecture-meta">${c} · ${l.duration}${l.topics?' · 실습 포함':''}</span><h3>${l.title}</h3><p>${l.description}</p><b>${member?'강의 시청하기 →':'로그인하고 강의 보기 →'}</b></div></a>`).join('')}</div></section>`:''}).join('')}</main>`,member,loginHref('/lectures'));
}
