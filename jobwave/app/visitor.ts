import {homeIcon,type HomeIcon} from './home-icons';
import {homepageLectures} from './lectures/catalog';
import {withKakaoContact} from './kakao-contact';
import {productPreview,audienceOverview} from './brand';
const site='https://jobwave.kr';
const attr=(v:string)=>v.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]!));
export const defaultDescription='대학생의 학년별 진로 준비부터 직장인의 경력 관리와 이직 준비까지. 직무 가이드, 영상 강의, 자소서·면접 연습을 잡웨이브에서 함께 준비하세요.';
export type PageMeta={description?:string;path?:string;noindex?:boolean};
function metaTags(title:string,meta:PageMeta){const d=attr(meta.description??defaultDescription),t=attr(title);return `<meta name="description" content="${d}">${meta.path?`<link rel="canonical" href="${site+meta.path}"><meta property="og:url" content="${site+meta.path}">`:''}${meta.noindex?'<meta name="robots" content="noindex">':''}<meta property="og:type" content="website"><meta property="og:title" content="${t} | JOBWAVE"><meta property="og:description" content="${d}"><meta property="og:site_name" content="JOBWAVE"><meta property="og:locale" content="ko_KR"><meta name="twitter:card" content="summary"><meta name="theme-color" content="#173f30">`}
export function page(title:string,body:string,member=false,loginPath="/login",memberAction={href:"/?view=career",label:"내 커리어"},meta:PageMeta={}){return new Response(withKakaoContact(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | JOBWAVE</title>${metaTags(title,meta)}<link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/member-entry.css"></head><body class="next-entry"><header class="entry-header"><a class="entry-logo" href="/" aria-label="잡웨이브 홈">JOBWAVE<span aria-hidden="true">↗</span></a><nav aria-label="주 메뉴"><a href="/roles">직무 가이드</a><a href="/lectures">영상 강의</a><a href="/practice">취업연습실</a><a href="/resources">실용 정보</a><a href="/company">회사 소개</a></nav><a class="entry-button small" href="${member?memberAction.href:loginPath}">${member?memberAction.label:'로그인 / 가입'}</a></header>${body}<footer><a class="next-footer-brand" href="/">JOBWAVE</a><span>MAKE YOUR NEXT.</span><a href="/company">회사 소개</a><small>© JOBWAVE</small></footer></body></html>`),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})}
export function visitorHome(member=false){return page('첫 취업부터 다음 이직까지',`<main class="next-landing"><section class="next-hero"><p class="next-kicker">대학생과 직장인을 위한 커리어 준비</p><h1>첫 취업 준비도.<br>다음 이직 준비도.</h1><p class="next-lead"><span>대학생은 학년별 진로와 경험을,</span> <span>직장인은 경력 관리와 이직 준비를.</span> <span>나에게 맞는 계획부터 자소서·면접까지 함께 준비하세요.</span></p><div class="next-actions"><a class="entry-button" href="${member?'/?view=career':'/login'}">${member?'내 커리어 이어가기':'가입하고 시작하기'}</a><a class="next-text-link" href="#careerAudienceOverview">서비스 살펴보기 <span aria-hidden="true">↓</span></a></div><p class="next-access-note">${member?'저장한 커리어 계획과 경험 기록을 이어서 확인하세요.':'콘텐츠 이용은 가입 · 로그인 후 가능합니다.'}</p></section><section class="career-preview-section" aria-labelledby="homePreviewTitle"><h2 id="homePreviewTitle">가입하면 이렇게 준비합니다.</h2><p>계획을 세우고, 경험을 기록하고, 지원 준비까지 한곳에서.</p>${productPreview()}</section>${audienceOverview(false,member)}${homeLectures()}${homeServices(member)}</main>`,member,"/login",{href:"/?view=account",label:"내 계정"},{path:'/'})}

const homeLectureLabels:Record<string,string>={
 'career-first-year':'대학 1학년 진로 탐색',
 'cover-letter':'자기소개서',
 'interview':'면접',
};

function homeLectures(){
 const catalog=homepageLectures();
 const featured=catalog.find(l=>l.id==='career-first-year')??catalog[0];
 const items=featured?[featured,...catalog.filter(l=>l!==featured)]:[];
 return `<section class="home-collection home-lectures" aria-labelledby="homeLectureTitle"><div class="home-collection-inner">
 <header class="home-collection-heading"><p>JOBWAVE 영상 강의</p><h2 id="homeLectureTitle">취업·진로·AI를 한곳에서.</h2><span>지금 필요한 강의부터 골라보세요.</span></header>
 <div class="home-lecture-grid">${items.map((l,i)=>`<a class="home-lecture-card${i===0?' is-featured':''}" href="/lectures/${l.id}">
 <div class="home-lecture-copy"><p class="home-lecture-meta">${homeLectureLabels[l.id]??l.category??'영상 강의'} · ${l.duration}</p><h3>${l.title}</h3><p class="home-lecture-desc">${l.description}</p><span class="home-collection-action">강의 보기 <span aria-hidden="true">↗</span></span></div>
 <img src="${l.poster}" alt="" width="960" height="540" loading="lazy" decoding="async"></a>`).join('')}</div>
 <a class="home-collection-more" href="/lectures">특강 전체 보기 <span aria-hidden="true">↗</span></a>
 </div></section>`;
}

const homeServiceItems:{icon:HomeIcon;href:string;title:string;desc:string;action:string}[]=[
 {icon:'education',href:'/roles',title:'직무 가이드·현직자 인터뷰',desc:'실제로 하는 일과 직무의 차이, 공개 인터뷰의 핵심을 짧게 읽어보세요.',action:'직무 알아보기'},
 {icon:'jobs',href:'/?view=today',title:'기업 공식 채용공고',desc:'직무·지역·경력에 맞는 공고를 비교하고 마감 일정을 관리하세요.',action:'공고 찾기'},
 {icon:'calendar',href:'/resources/exams',title:'시험·자격증 캘린더',desc:'토익·컴활·한국사 등 시험의 접수일, 시험일, 성적 발표일을 확인하세요.',action:'일정 보기'},
 {icon:'wallet',href:'/resources/costs',title:'취업 준비 비용 아끼기',desc:'응시료 지원, 면접 정장 대여, 무료 교육의 대상과 신청 방법을 확인하세요.',action:'지원 제도 보기'},
 {icon:'education',href:'/resources',title:'인턴·프로젝트·직무 교육',desc:'방학 인턴부터 퇴근 후 들을 수 있는 야간·주말·온라인 교육까지 찾아보세요.',action:'경험과 교육 보기'},
 {icon:'mic',href:'/practice',title:'취업연습실',desc:'자소서, 인적성·NCS, AI 역량검사와 모의면접을 연습하세요.',action:'연습 도구 보기'},
 {icon:'insights',href:'/insights',title:'취업 뉴스·기업 분석',desc:'관심 기업과 산업의 흐름을 읽고, 지원할 직무를 더 깊이 알아보세요.',action:'뉴스·분석 보기'},
];

function homeServices(member:boolean){
 return `<section class="home-collection home-service-collection" aria-labelledby="homeServiceTitle"><div class="home-collection-inner">
 <header class="home-collection-heading"><p>잡웨이브 서비스</p><h2 id="homeServiceTitle">오늘 필요한 준비.</h2><span>지금 할 일에 맞는 정보와 도구를 찾아보세요.</span></header>
 <ul class="home-service-list">${homeServiceItems.map(s=>`<li><a href="${s.icon==='jobs'&&!member?'/login?next='+encodeURIComponent(s.href):s.href}"><span class="home-service-icon">${homeIcon(s.icon)}</span><div><h3>${s.title}</h3><p>${s.desc}</p></div><span class="home-collection-action">${s.action} <span aria-hidden="true">↗</span></span></a></li>`).join('')}</ul>
 <nav class="home-service-more" aria-label="더 살펴볼 정보"><a href="/resources/market">직무별 채용 요건 ↗</a><a href="/resources/tips">엑셀·보고서·업무용 AI 팁 ↗</a><a href="/guides">커리어 가이드 ↗</a></nav>
 </div></section>`;
}
