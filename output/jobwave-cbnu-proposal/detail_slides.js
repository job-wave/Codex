// 프로그램별 상세 슬라이드. build.js에서 require 해서 호출한다.
// ctx: { pres, content, T, card, pill, iconCircle, numCircle, chevron, W, M, colors }

const LECTURES = [
  {
    no: "1강", step: "STEP 01 전략", basic: true, title: "채용 구조 해부",
    goal: "한국 기업의 채용 방식과 외국인 지원 경로를 이해한다",
    items: ["공채·수시·상시 채용의 차이와 시기", "대기업·중견·중소기업 채용 절차 비교", "외국인 전형·유학생 우대 공고 찾는 법", "고용24·대학 채용정보 활용법"],
    practice: "관심 직무 기준 지원 경로 그리기", output: "지원 경로 맵",
  },
  {
    no: "2강", step: "STEP 01 전략", basic: true, title: "비자 연계 취업전략",
    goal: "졸업 후 체류자격 전환 경로를 알고 본인 일정을 세운다",
    items: ["D-2 → D-10(구직) → E-7(특정활동) 전환 흐름", "F-2-R(지역특화형) 등 지역 정주 비자 개요", "전공·직무 연계와 고용 기업 요건 확인 포인트", "시기별 준비 서류 체크리스트"],
    practice: "졸업 시점 기준 비자 일정표 작성", output: "비자 로드맵",
  },
  {
    no: "3강", step: "STEP 01 전략", basic: false, title: "직무 분석·타겟 기업",
    goal: "충북 주력산업에서 나에게 맞는 직무와 기업을 고른다",
    items: ["충북 주력산업(반도체·이차전지·바이오 등) 직무 지도", "채용공고·직무기술서 읽는 법", "외국인 채용 가능 기업 찾는 방법", "언어·전공 강점과 직무 매칭"],
    practice: "타겟 기업 목록 작성", output: "타겟 기업 10곳",
  },
  {
    no: "4강", step: "STEP 02 서류", basic: true, title: "한국형 자기소개서",
    goal: "한국 기업이 원하는 구조로 자기소개서 초안을 완성한다",
    items: ["자주 나오는 문항 유형(지원동기·직무역량·포부)", "STAR 기법으로 경험 정리", "유학 경험을 강점으로 쓰는 법", "번역투·과장 등 자주 하는 실수"],
    practice: "지원 기업 1곳 대상 초안 작성", output: "자소서 초안",
  },
  {
    no: "5강", step: "STEP 02 서류", basic: false, title: "AI 역량검사·인적성",
    goal: "온라인 채용 검사 유형을 이해하고 직접 체험한다",
    items: ["AI 역량검사 구성(성향·게임·영상 문항)", "인적성 검사 영역(언어·수리·추리)", "한국어 지문 독해와 시간 관리", "응시 환경 준비와 주의사항"],
    practice: "모의 검사 응시 및 결과 해석", output: "진단 리포트",
  },
  {
    no: "6강", step: "STEP 03 면접", basic: true, title: "면접 심화",
    goal: "면접 유형별 답변 구조를 익힌다",
    items: ["인성·직무·PT·토론 면접의 차이", "1분 자기소개와 빈출 질문 답변 구조", "외국인에게 자주 묻는 질문(비자·정착·한국어)", "면접 예절과 비언어 표현"],
    practice: "2인 1조 모의면접·상호 평가", output: "모의면접 평가표",
  },
  {
    no: "7강", step: "STEP 03 면접", basic: false, title: "실전 모의면접",
    goal: "인사담당자 앞에서 실전처럼 면접을 보고 피드백을 받는다",
    items: ["현직 인사담당자 면접관 참여", "개별 또는 3인 1조 실전 면접", "평가표 기반 즉석 피드백", "영상 녹화 후 복기(희망자)"],
    practice: "실전 모의면접", output: "개별 피드백",
  },
  {
    no: "8강", step: "STEP 04 정착", basic: false, title: "근로계약·직장생활",
    goal: "입사 전에 알아야 할 계약·제도·직장 문화를 익힌다",
    items: ["근로계약서 핵심 항목 확인법", "4대보험과 급여명세서 읽기", "입사 후 체류자격 변경·신고 절차", "한국 직장 문화와 소통 예절"],
    practice: "입사 준비 항목 점검", output: "입사 전 체크리스트",
  },
];

async function addLectureDetails(ctx, crumb) {
  const { content, T, card, pill, W, M, colors: C } = ctx;
  for (let page = 0; page < 2; page++) {
    const s = content(crumb, `강의별 세부 내용 (${page === 0 ? "1~4강" : "5~8강"})`, "강의당 2시간 · 목표, 주요 내용, 현장 실습, 결과물을 정해 운영 · 세부 내용은 협의 후 확정");
    const cw = (W - 2 * M - 0.3) / 2, ch = 2.37;
    for (let i = 0; i < 4; i++) {
      const L = LECTURES[page * 4 + i];
      const x = M + (i % 2) * (cw + 0.3), y = 1.95 + Math.floor(i / 2) * (ch + 0.13);
      card(s, x, y, cw, ch, C.BG);
      // 머리줄: 강 번호 + 제목 + STEP + 기본 배지
      pill(s, L.no, x + 0.2, y + 0.17, 0.72, 0.38, L.basic ? C.ACCENT : C.NAVY, C.WHITE, { fs: 13 });
      T(s, L.title, x + 1.05, y + 0.12, 3.2, 0.48, { fontSize: 17, bold: true, valign: "middle" });
      T(s, L.step + " · 2시간", x + cw - 2.95, y + 0.17, 2.15, 0.38, { fontSize: 11, bold: true, color: C.GRAY, align: "right", valign: "middle" });
      if (L.basic) pill(s, "기본", x + cw - 0.68, y + 0.2, 0.5, 0.32, C.ACCENT, C.WHITE, { fs: 10 });
      T(s, [{ text: "목표  ", options: { bold: true, color: C.ACCENT } }, { text: L.goal, options: { color: C.NAVY2 } }], x + 0.22, y + 0.62, cw - 0.4, 0.3, { fontSize: 12, valign: "middle" });
      T(s, L.items.map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < L.items.length - 1 } })), x + 0.22, y + 0.95, cw - 0.4, 0.98, { fontSize: 12, color: C.NAVY, paraSpaceAfter: 2 });
      // 바닥줄: 실습 / 결과물
      card(s, x + 0.15, y + ch - 0.43, cw - 0.3, 0.33, C.WHITE, { r: 0.06 });
      T(s, [{ text: "실습  ", options: { bold: true, color: C.GRAY } }, { text: L.practice, options: { color: C.NAVY } }], x + 0.3, y + ch - 0.43, cw * 0.55, 0.33, { fontSize: 11.5, valign: "middle" });
      T(s, [{ text: "결과물  ", options: { bold: true, color: C.GRAY } }, { text: L.output, options: { bold: true, color: C.ACCENT } }], x + cw * 0.55, y + ch - 0.43, cw * 0.45 - 0.3, 0.33, { fontSize: 11.5, valign: "middle", align: "right" });
    }
    if (page === 0) T(s, "비자 관련 내용은 운영 시점의 법무부 최신 기준으로 안내합니다", M, 6.82, 8, 0.22, { fontSize: 10, color: C.MUTED });
  }
}

const SESSIONS = [
  {
    n: "1회차", t: "진단·목표 설정", out: "취업플랜", rows: [
      ["0~10분", "사전진단 결과 함께 보기"],
      ["10~30분", "강점·경험·희망 직무 인터뷰"],
      ["30~50분", "비자 경로와 타겟 직무 확정"],
      ["50~60분", "취업플랜 작성, 2회차 과제 안내"],
    ],
  },
  {
    n: "2회차", t: "서류 클리닉", out: "최종 서류", rows: [
      ["0~10분", "과제(자소서 초안) 확인"],
      ["10~40분", "문항별 자기소개서 첨삭"],
      ["40~55분", "한국형 이력서 항목 완성"],
      ["55~60분", "수정본 사이트 제출 (2회까지)"],
    ],
  },
  {
    n: "3회차", t: "실전 모의면접", out: "피드백 리포트", rows: [
      ["0~5분", "지원 기업·직무 기준 면접 준비"],
      ["5~35분", "예상 질문 모의면접(영상 녹화)"],
      ["35~55분", "영상 복기와 질문별 피드백"],
      ["55~60분", "피드백 리포트 안내"],
    ],
  },
];

async function addMentoringTimetable(ctx, crumb) {
  const { content, T, card, pill, numCircle, chevron, W, M, colors: C } = ctx;
  const s = content(crumb, "회차별 60분 진행안", "모든 회차는 1인 60분, 직전 회차 결과물을 이어받아 진행 (기본형은 1·2회차)");
  const cw = (W - 2 * M - 0.8) / 3;
  for (let i = 0; i < 3; i++) {
    const S = SESSIONS[i], x = M + i * (cw + 0.4), y = 1.95, last = i === 2;
    card(s, x, y, cw, 0.75, last ? C.ACCENT : C.NAVY);
    T(s, S.n, x + 0.25, y, 1.1, 0.75, { fontSize: 13, bold: true, color: last ? C.WHITE : "F2A6BC", valign: "middle" });
    T(s, S.t, x + 1.15, y, cw - 1.3, 0.75, { fontSize: 19, bold: true, color: C.WHITE, valign: "middle" });
    S.rows.forEach(([tm, tx], k) => {
      const ry = y + 0.9 + k * 0.82;
      card(s, x, ry, cw, 0.7, C.BG);
      pill(s, tm, x + 0.18, ry + 0.17, 1.1, 0.36, C.WHITE, C.ACCENT, { fs: 11, line: "E9B8C7" });
      T(s, tx, x + 1.42, ry, cw - 1.55, 0.7, { fontSize: 12.5, color: C.NAVY, valign: "middle" });
    });
    card(s, x, y + 4.25, cw, 0.55, C.OTINT);
    T(s, [{ text: "산출물   ", options: { fontSize: 12, color: C.GRAY } }, { text: S.out, options: { fontSize: 15, bold: true, color: C.ACCENT } }], x + 0.25, y + 4.25, cw - 0.5, 0.55, { valign: "middle" });
    if (i < 2) chevron(s, x + cw + 0.12, y + 2.3, 0.16, 0.3, C.ACCENT);
  }
}

async function addHrRoundDetail(ctx, crumb) {
  const { content, T, card, pill, iconCircle, W, M, colors: C } = ctx;
  const s = content(crumb, "라운드 진행 순서와 사전·사후 준비", "40분 라운드를 4단계로 나눠 운영하고, 사전 질문과 사후 Q&A 카드로 상담 내용을 남김");
  // 왼쪽: 40분 구성
  T(s, "라운드 1회 (40분) 구성", M, 1.95, 5, 0.35, { fontSize: 14, bold: true });
  const steps = [
    ["5분", "인사 및 회사 소개", "업종·주요 직무·외국인 채용 현황"],
    ["15분", "주제별 설명", "서류에서 보는 항목, 채용 결정 기준"],
    ["15분", "자유 Q&A", "학생 사전 질문 우선, 현장 질문 이어서"],
    ["5분", "정리", "핵심 조언 한마디, 잡페어 안내"],
  ];
  const lw = 6.6;
  steps.forEach(([m, t, d], k) => {
    const y = 2.4 + k * 1.1;
    card(s, M, y, lw, 0.95, C.BG);
    card(s, M, y, 1.1, 0.95, k === 1 || k === 2 ? C.ACCENT : C.NAVY);
    T(s, m, M, y, 1.1, 0.95, { fontSize: 18, bold: true, color: C.WHITE, align: "center", valign: "middle" });
    T(s, t, M + 1.35, y + 0.1, lw - 1.5, 0.4, { fontSize: 16, bold: true, valign: "middle" });
    T(s, d, M + 1.35, y + 0.5, lw - 1.5, 0.35, { fontSize: 12.5, color: C.GRAY, valign: "middle" });
  });
  // 오른쪽: 사전 / 사후
  const x0 = M + lw + 0.35, w0 = W - M - x0;
  const blocks = [
    ["사전 준비", C.NAVY, "LuClipboardList", ["학생: 사이트에 사전 질문 제출, 이력서 지참", "인사담당자: 사전 질문 미리 전달, 회사 소개 1쪽 준비", "운영: 테이블별 학생 배정·라운드 순서 안내"]],
    ["사후 정리", C.ACCENT, "LuFileText", ["주요 질문과 답변을 Q&A 카드로 정리", "채용정보 사이트에 게시해 미참석 학생도 열람", "참여 기업의 잡페어 참여 의향 확인"]],
  ];
  for (let i = 0; i < 2; i++) {
    const [h, col, ic, bl] = blocks[i];
    const y = 1.95 + i * 2.45;
    card(s, x0, y, w0, 2.3, C.BG, { shadow: true });
    await iconCircle(s, x0 + 0.25, y + 0.22, 0.62, ic, col);
    T(s, h, x0 + 1.0, y + 0.22, w0 - 1.2, 0.62, { fontSize: 17, bold: true, color: col, valign: "middle" });
    T(s, bl.map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < bl.length - 1 } })), x0 + 0.3, y + 1.0, w0 - 0.5, 1.15, { fontSize: 12.5, color: C.NAVY, paraSpaceAfter: 4 });
  }
}

async function addJobfairDay(ctx, crumb) {
  const { content, T, card, pill, iconCircle, W, M, colors: C } = ctx;
  const s = content(crumb, "행사 당일 운영안", "반나절(약 4시간) 운영 기준 예시 · 시간과 인원은 참여 규모에 맞춰 협의 후 확정");
  const rows = [
    ["13:00", "30분", "접수·대기", "사전매칭 명단 확인, 면접 순서표·명찰 배부", "LuClipboardCheck"],
    ["13:30", "30분", "개회·기업 설명", "기업별 5분 내외 회사·직무·채용 조건 소개", "LuPresentation"],
    ["14:00", "150분", "현장면접", "기업별 독립 면접 공간에서 1인 20분 내외 면접", "LuHandshake"],
    ["14:00", "150분", "이력서 컨설팅", "면접 대기 학생 대상 멘토 현장 보완 (병행)", "LuPenLine"],
    ["16:30", "30분", "마무리", "만족도 조사, 결과 안내 일정 공지", "LuCircleCheck"],
  ];
  const tw = 8.0;
  rows.forEach(([tm, dur, t, d, ic], k) => {
    const y = 1.95 + k * 0.97, main = k === 2;
    card(s, M, y, tw, 0.83, main ? C.OTINT : C.BG);
    T(s, tm, M + 0.2, y, 0.9, 0.83, { fontSize: 16, bold: true, color: C.ACCENT, valign: "middle" });
    pill(s, dur, M + 1.1, y + 0.24, 0.8, 0.34, C.WHITE, C.GRAY, { fs: 10.5, line: "D7DBE2" });
    T(s, t, M + 2.1, y, 1.9, 0.83, { fontSize: 15, bold: true, valign: "middle" });
    T(s, d, M + 3.95, y, tw - 4.1, 0.83, { fontSize: 12.5, color: C.NAVY2, valign: "middle" });
  });
  // 오른쪽: 운영 인력 배치(안)
  const x0 = M + tw + 0.35, w0 = W - M - x0;
  card(s, x0, 1.95, w0, 4.75, C.NAVY, { shadow: true });
  T(s, "운영 인력 배치 (안)", x0 + 0.3, 2.1, w0 - 0.6, 0.45, { fontSize: 16, bold: true, color: C.WHITE, valign: "middle" });
  const staff = [["총괄", "1명", "진행·기업 응대"], ["접수", "2명", "명단 확인·안내"], ["면접장 안내", "5명", "기업별 1명, 순서 관리"], ["이력서 컨설팅", "2명", "멘토링 전문멘토"], ["통역", "필요 시", "별도 예산"]];
  staff.forEach(([a, n, d], k) => {
    const y = 2.7 + k * 0.78;
    T(s, a, x0 + 0.3, y, 1.6, 0.36, { fontSize: 14, bold: true, color: C.WHITE, valign: "middle" });
    T(s, n, x0 + w0 - 1.3, y, 1.0, 0.36, { fontSize: 14, bold: true, color: "F2A6BC", align: "right", valign: "middle" });
    T(s, d, x0 + 0.3, y + 0.34, w0 - 0.6, 0.3, { fontSize: 11.5, color: "C9CED6", valign: "middle" });
  });
}

module.exports = { addLectureDetails, addMentoringTimetable, addHrRoundDetail, addJobfairDay };
