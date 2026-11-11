'use strict';
// Explainable planning rules; no psychological score, hiring probability or external AI call.
const CareerPlanner=(()=>{
 const priorities={growth:'성장 가능성',salary:'보상',balance:'일·생활 균형',location:'근무 지역',meaning:'일의 의미',stability:'안정성'};
 const roleWork={
  '개발·데이터':['작은 데이터 분석 또는 기능 구현','문제·접근 방법·코드 또는 분석 결과를 한 문서로 정리'],
  '기획·전략':['사용자 문제를 해결하는 서비스 개선안','사용자 문제·가설·개선안·검증 방법을 한 문서로 정리'],
  '마케팅':['관심 브랜드의 캠페인 개선안','타깃·메시지·채널·확인할 지표를 한 문서로 정리'],
  '디자인':['사용자 흐름을 개선하는 디자인 시안','문제·설계 이유·시안·피드백을 한 문서로 정리'],
  '영업·고객관리':['고객 상황을 바탕으로 한 제안서','고객 문제·제안·예상 질문·검증 방법을 한 문서로 정리'],
  '생산·품질':['공개 사례를 활용한 품질 문제 분석','문제·원인 가설·점검 항목·개선안을 한 문서로 정리'],
  '경영지원':['공개 사례를 활용한 업무 절차 개선안','업무 흐름·문제·개선 절차·확인할 지표를 한 문서로 정리']
 };
 const validDay=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
 const plus=(day,n)=>{const d=new Date(day+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
 function week(day){const n=new Date(day+'T00:00:00Z').getUTCDay();return {start:plus(day,-((n+6)%7)),end:plus(day,(7-n)%7)}}
 const profileKey=p=>JSON.stringify([p.type,p.grade,p.stage,p.role,p.target,p.goal,p.hours]);
 function build(p,a,today){if(!validDay(today))throw Error('invalid_date');if(!p||!Number.isInteger(p.hours)||p.hours<1||p.hours>30)throw Error('invalid_hours');const student=p.type==='student',role=p.target||p.role||'관심 직무',low=p.hours<=3,explore=a.clarity==='exploring'||a.blocker==='direction'||!p.role,reuse=a.experience!=='none'&&a.experience!=='study',apply=!explore&&(p.stage==='apply'||a.blocker==='documents'),grow=!student&&p.stage==='grow',evidence=a.level==='evidence';const project=roleWork[p.role]||['관심 직무의 작은 실습 결과물','목표·내가 한 일·결과·다음 개선을 한 문서로 정리'];const burden=low?'짧은 과제 2개씩':'핵심 과제 3개씩';const summary=explore?`${role}의 방향을 비교하는 것부터 시작합니다. 주 ${p.hours}시간에 맞춰 ${burden} 진행하고, 3개월 동안 탐색·실행·회고를 연결합니다.`:grow?`현재 업무의 성과를 다음 역할의 근거로 정리합니다. 주 ${p.hours}시간 동안 ${burden} 진행하며 기록·업무 실험·회고를 연결합니다.`:apply?`${role} 지원을 위한 경험과 서류를 우선 정리합니다. 주 ${p.hours}시간에 맞춰 ${burden} 진행하며 지원·피드백·보완을 반복합니다.`:`${role}에 필요한 역량을 작은 결과물로 확인합니다. 주 ${p.hours}시간에 맞춰 ${burden} 진행하며 기초 점검·실행·정리를 연결합니다.`;
 const context=[student?`${p.grade}학년 · ${a.experience==='none'?'관련 경험 시작 전':'보유 경험 활용'}`:`경력 ${a.years}년 · ${grow?'현재 직장 성장':'다음 역할 준비'}`,a.skills?`스스로 적은 강점·기술: ${a.skills}`:'강점은 탐색 과정에서 직접 기록',a.evidence?'입력한 경험을 결과물 정리에 활용':'경험 근거부터 쌓는 과제 포함',a.conditions?`계획 시 고려할 조건: ${a.conditions}`:'목표일은 실제 일정에 맞게 조정'];
 const workReason=a.blocker==='time'?'시간 확보가 어렵다고 답해 범위를 작은 산출물 하나로 제한합니다.':a.level==='start'?'관련 역량을 처음 배우는 단계라고 답해 기초 실습부터 진행합니다.':reuse?'이미 가진 경험이 있어 새 경험을 무조건 늘리기보다 기존 경험을 개선합니다.':'설명할 수 있는 결과물을 만들며 직무 경험을 쌓도록 제안합니다.';
 const task=(title,reason,criterion)=>({title:title.slice(0,120),reason:reason.slice(0,300),criterion:criterion.slice(0,240)});
 const assess=task(explore?'관심 직무 2개 비교하기':`${role} 공고 3개의 공통 요건 정리`,explore?'아직 방향을 탐색 중이거나 직무 선택이 어렵다고 답했습니다.':'관심 역할이 정해져 있어 실제 공고의 업무와 요구 조건부터 확인합니다.','공식 공고·직무 자료를 읽고 업무·역량·관심 이유를 비교한 메모 1개 완성');
 const inventory=task(student?'수업·활동에서 나의 역할 찾기':'대표 업무 성과의 근거 정리',a.evidence?'직접 입력한 경험에서 나의 행동과 근거를 먼저 정리합니다.':reuse?'관련 경험이 있다고 답해 활용 가능한 사례부터 정리합니다.':'아직 경험 근거가 부족해 기억나는 활동에서 출발합니다.','목표·나의 역할·직접 한 행동·확인 가능한 결과를 경험 기록장에 1개 작성');
 const conditions=task(student?'관심 직무를 선택할 나의 기준 정리':'이직·경력 선택 기준 비교표 만들기',a.priorities.length?'선택한 중요 조건을 실제 기회를 비교할 때 사용할 기준으로 바꿉니다.':'남의 기준이 아닌 자신의 조건으로 다음 기회를 선택하기 위해 제안합니다.',`중요 조건 ${a.priorities.length?a.priorities.map(k=>priorities[k]).join('·'):'3개'}와 꼭 필요한 조건·조정 가능한 조건을 구분한 표 완성`);
 const practice=task(grow?'현재 업무에서 작은 개선 실험 설계':reuse?`${project[0]}: 기존 경험 보완`:`${project[0]} 초안 만들기`,workReason,project[1]+' · 기밀 자료와 실제로 측정하지 않은 수치는 제외');
 const feedback=task('결과물 피드백을 받고 한 가지 개선',evidence?'결과를 설명할 수 있다고 답해 외부 관점으로 전달력을 점검합니다.':'첫 결과물을 점검하며 부족한 설명을 찾기 위해 제안합니다.','직접 점검 또는 동료·멘토의 피드백 3개를 기록하고 개선 전후 1개 비교');
 const learning=task(`${role} 기초 역량 한 가지 연습`,a.skills?`입력한 강점·기술(${a.skills.slice(0,80)})을 공고 요건과 비교해 보완할 항목 하나를 직접 고릅니다.`:'보유 기술을 아직 정리하지 않아 공고에서 반복되는 역량 하나부터 선택합니다.','부족한 역량 1개 선택 → 기초 자료 학습 → 실습 결과 또는 학습 메모 1개 완성');
 const docs=task(student?'대표 경험을 자소서·포트폴리오로 정리':'대표 성과를 경력기술서 초안으로 정리',apply?'지원 단계이거나 서류 준비가 어렵다고 답해 서류 초안을 먼저 만듭니다.':'쌓은 경험을 다음 기회에서 설명할 수 있는 자료로 바꾸기 위해 제안합니다.','지원 직무와 관련된 경험 1개의 역할·행동·근거를 한 페이지로 작성');
 const opportunity=task(grow?'다음 역할에 필요한 역량을 상사·동료와 점검':explore?'관심 역할 한 가지와 다음 실험 정하기':'지원 후보 공고와 준비 항목 비교',grow?'이직 여부와 관계없이 현재 역할에서 성장 경로를 확인합니다.':explore?'탐색 결과를 임시 선택으로 정리하고 이후 수정할 여지를 남깁니다.':'준비 내용을 실제 공고의 요건과 비교하되 지원 여부는 직접 결정하도록 제안합니다.',grow?'다음 역할의 업무 2개와 보완할 역량 1개를 메모하고 가능한 업무 과제 1개 선정':explore?'관심 역할 1개·선택 이유·아직 모르는 점·다음 실험을 각각 한 줄로 작성':'공식 공고 2개의 업무·필수 요건·준비할 서류·모집 상태를 직접 확인해 비교');
 const review=task('3개월 실행을 돌아보고 다음 목표 수정','직무 선택과 계획은 실제 경험에 따라 바뀔 수 있어 마지막에 재점검합니다.','완성한 기록·결과물·지원 준비를 확인하고 유지할 것 1개·바꿀 것 1개·다음 목표 1개 작성');
 let sets;if(explore)sets=[[assess,conditions,inventory],[practice,learning,feedback],[opportunity,docs,review]];else if(grow)sets=[[inventory,assess,conditions],[practice,learning,feedback],[docs,opportunity,review]];else if(apply)sets=[[inventory,docs,conditions],[opportunity,feedback,learning],[docs,opportunity,review]];else sets=[[assess,inventory,conditions],[practice,learning,feedback],[docs,opportunity,review]];
 // Low time budgets keep a smaller explicit scope. Reused titles in later phases get distinct completion checkpoints.
 if(low)sets=sets.map((set,i)=>i===0?[set[0],set[1]]:i===1?[set[0],set[2]]:[set[0],set[2]]);
 const sunday=new Date(week(today).end+'T00:00:00Z');const firstDue=Math.min(3,Math.round((sunday-new Date(today+'T00:00:00Z'))/86400000));
 const titles=explore?['방향을 비교하다','작게 경험하다','내 방향을 정리하다']:grow?['성과를 점검하다','업무에서 실험하다','다음 역할을 준비하다']:apply?['지원 자료를 정리하다','기회와 비교하다','지원 준비를 보완하다']:['준비 기준을 세우다','결과물을 만들다','경험을 기회로 연결하다'];
 return {summary,context,priorities:a.priorities.map(k=>priorities[k]),months:sets.map((set,i)=>({month:i+1,title:titles[i],outcome:i===0?(explore?'직무 비교 메모와 나의 선택 기준 완성':'준비 상태와 대표 경험의 근거 정리'):i===1?'피드백을 반영한 작은 결과물 완성':'서류·직무 선택 자료와 다음 실행 계획 완성',tasks:set.map((t,j)=>({...t,title:i===2&&apply&&j===0?'피드백을 반영해 지원 서류 보완':t.title,due:plus(today,i*28+(j===0?(i===0?firstDue:7):j===1?(set.length===2?28:18):28)),estimate:Math.max(1,Math.min(p.hours,j===0?p.hours:Math.floor(p.hours*4/set.length)))}))}))};
 }
 return {build,week,plus,profileKey,priorities};
})();
