import series15 from './series-15.json';
export type LectureMaterial={id:string;label:string;filename:string;contentType:string;bytes:number};
export type Lecture={id:string;title:string;duration:string;seconds:number;description:string;poster:string;bytes:number;category?:'취업'|'진로'|'AI 활용';outcome?:string;topics?:string[];published?:boolean;practiceHref?:string;practiceLabel?:string;materials?:LectureMaterial[]};
export const lectures:Lecture[]=[
 {id:'cover-letter',category:'취업',title:'자소서 특강',duration:'21분 39초',seconds:1298.76,description:'자기소개서를 준비하고 작성할 때 참고하는 실전 특강.',poster:'/lectures/cover-letter.svg',bytes:41774062},
 {id:'interview',category:'취업',title:'대기업 합격 면접 · AI 역량면접',duration:'25분 6초',seconds:1506,description:'대기업 면접과 AI 역량면접 준비를 위한 실전 특강.',poster:'/lectures/interview.svg',bytes:46550046},
 {id:'career-first-year',category:'진로',title:'아직 꿈이 없어도 괜찮아',duration:'25분 21초',seconds:1521,description:'대학 1학년부터 시작하는 진로 탐색법. 관심과 강점을 발견하고, 직무를 살펴보며 나만의 4주 진로 실험을 계획합니다.',poster:'/lectures/career-first-year.png',bytes:46949509,published:true,practiceHref:'/?from=guide&track=student&tool=plan',practiceLabel:'나의 진로 계획 세우기 ↗',materials:[
  {id:'worksheet',label:'진로 탐색 활동지 · PDF',filename:'진로탐색_활동지.pdf',contentType:'application/pdf',bytes:298199},
  {id:'slides',label:'강의안 · PDF',filename:'진로첫수업_강의안.pdf',contentType:'application/pdf',bytes:1908862},
  {id:'materials',label:'강의 자료 전체 · ZIP',filename:'진로탐색_강의자료.zip',contentType:'application/zip',bytes:1432471}
 ]},
 ...(series15 as Lecture[]),
];
export const publishedLectures=()=>lectures.filter(l=>l.published!==false);

export const lectureCategories=['취업','진로','AI 활용'] as const;
export const categoryAnchors={'취업':'employment','진로':'career','AI 활용':'ai'} as const;
export const homepageLectures=()=>{const all=publishedLectures();return ['job-posting','interests-strengths','ai-prompting-basics','cover-letter','interview','career-first-year'].flatMap(id=>{const l=all.find(l=>l.id===id);return l?[l]:[]})};
