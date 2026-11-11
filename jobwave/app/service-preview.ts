import {page} from './visitor';
import {escape as e} from './guides/content';
import {sections} from './resources/content';

import {loginHref} from './member-access';
type PreviewItem={title:string;description:string;destination:string};

function group(title:string,items:PreviewItem[]){
 return `<section class="service-preview-group"><h2>${e(title)}</h2><ul>${items.map(item=>`<li><h3>${e(item.title)}</h3><p>${e(item.description)}</p><a class="next-text-link" href="${loginHref(item.destination)}" aria-label="로그인하고 ${e(item.title)} 이용하기">로그인하고 이용하기 <span aria-hidden="true">↗</span></a></li>`).join('')}</ul></section>`;
}

function preview(title:string,description:string,groups:string,path:string){
 return page(title,`<main class="lecture-main service-preview"><p class="eyebrow">서비스 미리보기</p><h1>${e(title)}</h1><p>${e(description)}</p>${groups}</main>`,false,loginHref(path));
}

export function practicePreview(){
 return preview('취업연습실','필요한 연습을 골라 보세요. 도구 사용과 연습 기록은 로그인 후 이용할 수 있어요.',group('연습 도구',[
  {title:'자소서 연습',description:'지원 직무에 맞게 경험을 정리하고 자소서 초안을 써 보세요.',destination:'/practice#essay'},
  {title:'인적성 모의검사',description:'언어·수리·추리 문제를 풀고 정답과 해설을 확인하세요.',destination:'/practice#aptitude'},
  {title:'NCS 모의검사',description:'의사소통·수리·문제해결 등 직업기초능력 문항을 연습하세요.',destination:'/practice#ncs'},
  {title:'역량 과제',description:'업무 상황에서 어떤 판단을 내리고 어떻게 설명할지 연습하세요.',destination:'/practice#capacity'},
  {title:'모의면접',description:'질문을 보고 내 경험을 답변으로 정리하고 말해 보세요.',destination:'/practice#interview'},
  {title:'AI 역량검사 연습',description:'성향 탐색, 인지능력 과제, 면접 답변을 체험하는 자체 제작 모의검사입니다.',destination:'/practice/ai-assessment'},
 ]),'/practice');
}

export function resourcesPreview(){
 const groups=[['student','대학생·취업준비생'],['professional','직장인']].map(([audience,title])=>group(title,sections.filter(s=>s.audience===audience).map(s=>({title:s.title,description:s.description,destination:'/resources/'+s.slug})))).join('');
 return preview('실용 정보','어떤 정보가 있는지 먼저 살펴보세요. 상세 일정, 지원 조건, 실무 예제는 로그인 후 확인할 수 있어요.',groups,'/resources');
}
