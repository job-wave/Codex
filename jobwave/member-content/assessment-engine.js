'use strict';
// JOBWAVE self-report reflection rules, version 1. Not a standardized psychometric test.
const CareerAssessment=(()=>{
 const names={student:'커리어 나침반',professional:'커리어 자산 진단'};
 const interests={analysis:'문제 분석',build:'만들기·개발',design:'표현·디자인',persuade:'설득·홍보',help:'도움·교육',organize:'계획·운영'};
 const values={growth:'성장',stability:'안정',salary:'보상',autonomy:'자율',meaning:'사회 기여',balance:'일과 생활의 균형'};
 const directions={grow:'현재 직무 성장',lead:'승진·리더십',move:'같은 직무로 이직',switch:'직무 전환',explore:'아직 탐색 중'};
 const questions={student:[
 ['관심 발견','시간 가는 줄 모르고 몰입하는 활동이 있다.','더 알아보고 싶은 산업이나 사회 문제가 있다.','보상이 없어도 해보고 싶은 일이 있다.'],
 ['자기 이해','내가 잘하는 일을 구체적인 경험으로 설명할 수 있다.','혼자 일할 때와 함께 일할 때 중 선호하는 방식을 안다.','직업을 선택할 때 중요하게 생각하는 기준이 있다.'],
 ['직무 탐색','관심 직무에서 실제로 어떤 일을 하는지 안다.','관심 직무에 필요한 역량을 알고 있다.','서로 다른 직무를 비교해 본 경험이 있다.'],
 ['실행 준비','관심 분야와 관련된 활동을 해본 적이 있다.','경험에서 내가 한 일과 배운 점을 기록하고 있다.','이번 학기에 실천할 커리어 목표가 있다.']],professional:[
 ['전문성','내 직무의 핵심 업무를 독립적으로 수행할 수 있다.','어려운 업무 문제를 해결한 사례가 있다.','동료가 나에게 도움을 요청하는 전문 분야가 있다.'],
 ['성과 증거','주요 성과를 수치나 구체적인 변화로 설명할 수 있다.','팀의 성과와 나의 기여를 구분해 설명할 수 있다.','경력기술서에 활용할 경험과 자료를 정리해 두었다.'],
 ['경력 확장','다른 조직에서도 활용할 수 있는 역량을 알고 있다.','희망하는 다음 역할에 필요한 역량을 알고 있다.','다음 역할을 위해 학습하거나 새로운 업무를 경험하고 있다.'],
 ['방향 명확성','현재 경력에서 유지하고 싶은 것과 바꾸고 싶은 것을 안다.','다음 경력에서 우선할 조건이 명확하다.','현재 회사에서의 성장과 이직을 비교해 본 적이 있다.']]};
 const roleMap={analysis:[['데이터 분석','개발·데이터'],['서비스 기획','기획·전략']],build:[['소프트웨어 개발','개발·데이터'],['생산기술·품질 개선','생산·품질']],design:[['콘텐츠 디자인','디자인'],['콘텐츠 마케팅','마케팅']],persuade:[['브랜드 마케팅','마케팅'],['영업·사업개발','영업·고객관리']],help:[['고객 경험 관리','영업·고객관리'],['교육·인사 운영','경영지원']],organize:[['서비스 운영·기획','기획·전략'],['인사·재무 운영','경영지원']]};
 const tasks={student:[
 [['몰입했던 활동 3개 기록하기','각 활동의 재미있던 순간·내 행동·다시 하고 싶은 점을 한 줄씩 기록'],['관심 활동을 작은 실험으로 해보기','선택한 활동을 1시간 체험하고 좋았던 점·어려웠던 점을 기록'],['관심 분야 2개 비교하기','각 분야의 문제·업무·더 알아보고 싶은 점을 비교한 메모 완성']],
 [['경험에서 나의 강점 후보 찾기','기억나는 경험 2개에서 내가 한 행동과 받은 피드백을 구분해 기록'],['일하는 방식과 선택 기준 정리','선호하는 협업 방식과 중요한 직업 가치 2개에 이유를 작성'],['강점을 확인할 활동 하나 정하기','강점 후보를 써볼 활동·기대 결과·확인할 피드백을 한 줄씩 작성']],
 [['관심 직무 공고 3개 비교하기','공식 공고에서 담당 업무·필수 역량·궁금한 점을 표로 정리'],['현직자의 실제 업무 살펴보기','공개 인터뷰 또는 직접 인터뷰에서 하루 업무·어려움·필요 역량 기록'],['직무 후보 2개와 선택 이유 정리','직무별 끌리는 점·아직 모르는 점·다음 탐색 행동을 기록']],
 [['이번 학기 작은 목표 하나 정하기','결과물·완료 기준·목표일이 있는 목표 한 개 작성'],['관심 직무 관련 작은 결과물 만들기','주간 가용 시간 안에 가능한 과제 하나를 정하고 초안 완성'],['경험 한 개를 기록장에 남기기','목표·나의 행동·결과·배운 점을 경험 기록장에 작성']]],professional:[
 [['핵심 업무와 해결 경험 목록 만들기','반복 업무 3개와 어려운 문제를 해결한 사례 1개를 기록'],['다음 역할의 역량 한 가지 연습하기','목표 역할에서 필요한 역량 하나를 고르고 작은 업무·학습 실험 완료'],['업무 피드백에서 강점 확인하기','직접 점검 또는 동료 피드백을 바탕으로 유지할 강점·개선점 작성']],
 [['대표 성과 사례 3개 모으기','사례별 목표·내 기여·확인 가능한 결과를 작성 · 수치가 없으면 산출물·피드백 활용'],['성과의 근거와 공개 범위 점검','자료·측정 기준·본인 기여를 확인하고 회사 기밀과 개인정보 제외'],['경력기술서 한 페이지 작성하기','대표 사례 1개의 상황·판단·행동·결과를 목표 역할과 연결해 작성']],
 [['다른 조직에서도 쓸 역량 정리하기','업무 경험 3개를 도구명보다 문제 해결·판단·협업 역량으로 설명'],['다음 역할의 요건과 경험 비교하기','목표 역할 자료·공식 공고 3개에서 충족 근거와 보완 역량 구분'],['보완 역량을 작은 결과물로 확인하기','역량 하나를 선택해 학습·업무 실험 후 결과와 피드백 기록']],
 [['유지할 것과 바꿀 것 구분하기','현재 경력에서 유지할 조건 2개와 바꿀 조건 2개에 이유 작성'],['다음 경력의 선택 기준 정리하기','필수 조건과 조정 가능한 조건을 나눠 우선순위 3개 작성'],['성장 경로 두 가지 비교하기','현재 조직 성장과 외부 기회의 업무·조건·준비 항목을 비교']]]};
 function valid(r){const type=r?.type;if(!questions[type]||r.version!==1||!Array.isArray(r.answers)||r.answers.length!==12||!r.answers.every(n=>Number.isInteger(n)&&n>=0&&n<=5))return false;if(type==='student')return Number.isInteger(r.grade)&&r.grade>=1&&r.grade<=4&&Array.isArray(r.interests)&&r.interests.length>=1&&r.interests.length<=3&&new Set(r.interests).size===r.interests.length&&r.interests.every(k=>interests[k])&&Array.isArray(r.values)&&r.values.length>=1&&r.values.length<=2&&new Set(r.values).size===r.values.length&&r.values.every(k=>values[k]);return typeof r.role==='string'&&r.role.trim().length>0&&r.role.length<=80&&Number.isInteger(r.years)&&r.years>=0&&r.years<=50&&Object.hasOwn(directions,r.direction)}
 function analyze(r){if(!valid(r))throw Error('invalid_assessment');const groups=questions[r.type];const axes=groups.map((group,i)=>{const answers=r.answers.slice(i*3,i*3+3);const known=answers.filter(n=>n>0);return {index:i,name:group[0],answered:known.length,unknown:3-known.length,mean:known.length>=2?known.reduce((a,b)=>a+b,0)/known.length:null,answers,questions:group.slice(1)}});const ranked=[...axes].sort((a,b)=>(a.mean??-1)-(b.mean??-1)||a.index-b.index);const focus=ranked[0];const strengths=axes.filter(a=>a.mean!==null&&a.mean>=3).sort((a,b)=>b.mean-a.mean||a.index-b.index).slice(0,2);const allUnknown=r.answers.every(n=>n===0),ready=axes.every(a=>a.mean!==null&&a.mean>=4);const titles=r.type==='student'?['관심을 발견할 작은 경험부터 시작해요.','나를 설명할 경험과 기준을 모아봐요.','관심을 실제 직무와 연결해볼 단계예요.','생각한 방향을 작은 실행으로 바꿔봐요.']:['쌓아온 업무에서 전문성의 단서를 찾아봐요.','경험을 성과의 근거로 정리해볼 단계예요.','현재의 역량을 다음 역할과 연결해봐요.','다음 경력에서 원하는 것을 정리해봐요.'];let title=allUnknown?'아직 모르는 항목부터, 하나씩 알아가도 괜찮아요.':ready?'정리한 방향을 실제 기회와 비교해보세요.':titles[focus.index];let explanation=focus.mean===null?`${focus.name} 영역에서 구체적인 응답이 2개 미만이라 평균을 표시하지 않았어요. 점수 대신 직접 확인할 행동을 제안합니다.`:`${focus.name}의 응답 평균은 ${focus.mean.toFixed(1)} / 5예요. 다른 영역보다 먼저 살펴볼 부분으로 제안합니다. 응답 평균은 능력이나 취업 가능성을 뜻하지 않아요.`;if(ready)explanation='모든 영역에서 평균 4 이상으로 응답했어요. 정리한 내용을 실제 경험·공고와 비교하며 다음 과제를 조정해보세요.';
 const actions=tasks[r.type][focus.index].map(([title,criterion],i)=>({code:`assessment-${r.type}-v1-${focus.index}-${i}`,title,criterion,reason:focus.mean===null?`${focus.name}에서 아직 모르는 응답이 있어 직접 확인할 행동을 제안합니다.`:`${focus.name} 응답을 바탕으로 정리·확인·실행을 연결하는 과제입니다.`}));
 if(r.type==='student'){if(r.grade===1)actions[1].criterion+=' · 첫 체험은 1시간 이내로 시작';if(r.grade===3&&focus.index===3)actions[1]={...actions[1],title:'인턴·프로젝트 요건과 나의 준비 비교',criterion:'모집 요건 2개를 비교하고 보완할 역량·만들 결과물 하나 작성'};if(r.grade===4&&focus.index===3)actions[1]={...actions[1],title:'지원 후보 공고와 제출 자료 비교',criterion:'실제 모집 중인 공식 공고 2개의 요건·서류·준비 항목 확인'}}
 if(r.type==='professional'&&r.direction==='lead'&&focus.index===2)actions[1]={...actions[1],title:'다음 리더 역할과 나의 경험 비교',criterion:'역할의 의사결정·협업·피드백 책임과 본인 사례를 나란히 정리'};
 const roles=r.type==='student'?[...new Map(r.interests.flatMap(k=>roleMap[k]).map(([title,category])=>[title,{title,category}])).values()].slice(0,3):[];
 return {axes,focus,strengths,title,explanation,actions,roles,allUnknown,guide:r.type==='student'&&focus.index<3?'explore':'evidence'};
 }
 return {names,interests,values,directions,questions,valid,analyze};
})();
