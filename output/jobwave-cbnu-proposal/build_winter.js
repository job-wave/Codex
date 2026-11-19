// 자동 생성 파일: make_winter.py 로 만듦 (직접 고치지 말고 winter_body.js 를 고친 뒤 다시 생성)
const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");
const path = require("path");
const { applyTheme } = require("/root/.claude/skills/synced/1140d78c-b0fa-4fd4-a06b-04f4c07d69e1_17b93ea7-d146-4ef9-848e-caab6f30b720/pptx/scripts/apply_theme.js");

const ARC = path.resolve(__dirname, "arc.png");
const OUT = path.resolve(__dirname, "JobWave_winter_program.pptx");

// palette (원본 색 유지)
const NAVY = "151B26", ACCENT = "B72654" /* 강조색: 충북대 CBNU Red */, GRAY = "5B6472", LINE = "E3E6EA",
  MUTED = "9AA1AC", NAVY2 = "2A3342", BG = "F4F5F7", WHITE = "FFFFFF", OTINT = "F8E5EB", NTINT = "E8EAF0";
const FONT = "Pretendard"; // 일반 설치판 Pretendard(정적 폰트) 패밀리 이름
const LOGO_R = 892 / 162; // 잡웨이브 로고(assets/jobwave_*.png) 가로/세로 비율, jobwave.kr 헤더 로고 캡처
const CBNU_RED = "B72654"; // 충북대학교 전용색상 CBNU Red (PANTONE 7425C, R183 G38 B84)

const THEME = {
  name: "JobWave",
  headFontFace: FONT,
  bodyFontFace: FONT,
  colors: {
    dk1: NAVY, lt1: WHITE, dk2: NAVY2, lt2: BG,
    accent1: ACCENT, accent2: NAVY, accent3: GRAY, accent4: MUTED, accent5: "D98AA3", accent6: NAVY2,
    hlink: ACCENT, folHlink: GRAY,
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
pres.title = "충북대 외국인 유학생 동계방학 취업 프로그램 제안서";
pres.author = "JobWave";

const W = 13.333, M = 0.6;
const FOOT = "충북대 외국인 유학생 동계방학 취업 프로그램";

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: WHITE },
  objects: [
    { image: { path: path.resolve(__dirname, "assets", "jobwave_dark.png"), x: W - M - 0.24 * LOGO_R, y: 0.35, w: 0.24 * LOGO_R, h: 0.24 } },
    { text: { text: FOOT, options: { x: M, y: 7.05, w: 6, h: 0.25, fontSize: 9, color: MUTED, margin: 0 } } },
    { placeholder: { options: { name: "crumb", type: "body", x: M, y: 0.32, w: 8, h: 0.3, fontSize: 11, bold: true, color: ACCENT, margin: 0, valign: "middle" }, text: "" } },
    // 제목 띠: 모든 내용 페이지에서 같은 위치·크기, 왼쪽 끝부터 오른쪽 끝까지
    { rect: { x: 0, y: 0.66, w: W, h: 0.68, fill: { color: CBNU_RED }, line: { color: CBNU_RED } } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.66, w: W - 2 * M, h: 0.68, fontSize: 26, bold: true, color: WHITE, margin: 0, valign: "middle", align: "left" }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: M, y: 1.42, w: W - 2 * M, h: 0.36, fontSize: 14, color: GRAY, margin: 0, valign: "middle" }, text: "" } },
  ],
  slideNumber: { x: W - M - 0.6, y: 7.05, w: 0.6, h: 0.25, fontSize: 9, color: MUTED, align: "right" },
});
pres.defineSlideMaster({
  title: "BLANK",
  background: { color: WHITE },
  objects: [
    { text: { text: FOOT, options: { x: M, y: 7.05, w: 6, h: 0.25, fontSize: 9, color: MUTED, margin: 0 } } },
  ],
  slideNumber: { x: W - M - 0.6, y: 7.05, w: 0.6, h: 0.25, fontSize: 9, color: MUTED, align: "right" },
});
pres.defineSlideMaster({
  title: "DARK",
  background: { color: NAVY },
  objects: [],
});

// ---------- helpers ----------
const iconCache = {};
async function icon(name, color) {
  const key = name + color;
  if (iconCache[key]) return iconCache[key];
  const svg = RDS.renderToStaticMarkup(React.createElement(lu[name], { color: "#" + color, size: 256, strokeWidth: 2 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return (iconCache[key] = "image/png;base64," + buf.toString("base64"));
}
const shadow = () => ({ type: "outer", color: "000000", opacity: 0.10, blur: 8, offset: 2, angle: 90 });

function T(s, text, x, y, w, h, o = {}) {
  s.addText(text, { x, y, w, h, fontSize: 14, color: NAVY, margin: 0, valign: "top", isTextBox: true, ...o });
}
function card(s, x, y, w, h, fill = BG, o = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: o.line || fill, width: o.lineW || 1 }, rectRadius: o.r ?? 0.12, shadow: o.shadow ? shadow() : undefined });
}
async function iconCircle(s, x, y, d, name, bg = ACCENT, fg = WHITE) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg } });
  const p = d * 0.26;
  s.addImage({ data: await icon(name, fg), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
}
function numCircle(s, x, y, d, n, bg = ACCENT, fg = WHITE, fs) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg } });
  T(s, n, x, y, d, d, { fontSize: fs || Math.round(d * 30), bold: true, color: fg, align: "center", valign: "middle" });
}
function pill(s, text, x, y, w, h, fill, color, o = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: o.line || fill, width: 1 }, rectRadius: h / 2 });
  T(s, text, x, y, w, h, { fontSize: o.fs || 12, bold: o.bold ?? true, color, align: "center", valign: "middle" });
}
function chevron(s, x, y, w, h, fill) {
  s.addShape(pres.shapes.CHEVRON, { x, y, w, h, fill: { color: fill }, line: { color: fill } });
}
function arrowR(s, x, y, w, color = ACCENT) {
  s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width: 2.25, endArrowType: "triangle" } });
}
function stat(s, x, y, w, h, num, unit, label, fill, numColor, labelColor) {
  card(s, x, y, w, h, fill);
  T(s, [{ text: num, options: { fontSize: 44, bold: true, color: numColor } }, { text: " " + unit, options: { fontSize: 18, bold: true, color: numColor } }], x + 0.3, y + 0.12, w - 0.6, h * 0.52, { valign: "bottom" });
  T(s, label, x + 0.3, y + h * 0.66, w - 0.6, h * 0.26, { fontSize: 13, color: labelColor, valign: "middle" });
}
function content(crumb, title, sub) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: curSection });
  s.addText(crumb, { placeholder: "crumb" });
  s.addText(title, { placeholder: "title" });
  if (sub) s.addText(sub, { placeholder: "sub" });
  return s;
}
let curSection = "표지";
function section(t) { curSection = t; pres.addSection({ title: t }); }

// Canva로 생성한 사진(photos/)을 박스 비율에 맞게 가운데 기준으로 잘라 넣는다
async function photo(s, name, x, y, w, h, focusY = 0.5) {
  const file = path.resolve(__dirname, "photos", name + ".jpg");
  const meta = await sharp(file).metadata();
  const target = w / h, src = meta.width / meta.height;
  let cw = meta.width, ch = meta.height;
  if (src > target) cw = Math.round(meta.height * target); else ch = Math.round(meta.width / target);
  const left = Math.round((meta.width - cw) / 2);
  const top = Math.round(Math.min(Math.max((meta.height - ch) * focusY, 0), meta.height - ch));
  const buf = await sharp(file).extract({ left, top, width: cw, height: ch }).jpeg({ quality: 88 }).toBuffer();
  s.addImage({ data: "image/jpeg;base64," + buf.toString("base64"), x, y, w, h });
}

async function divider(num, title, items, img) {
  const s = pres.addSlide({ masterName: "DARK", sectionTitle: curSection });
  if (img) await photo(s, img, 6.2, 0, W - 6.2, 7.5);
  else s.addImage({ path: ARC, x: 4.33, y: 0.6, w: 9.0, h: 6.84 });
  T(s, num, M, 1.5, 4, 1.4, { fontSize: 96, bold: true, color: ACCENT, valign: "bottom" });
  T(s, title, M, 3.0, 6, 0.9, { fontSize: 44, bold: true, color: WHITE, valign: "middle" });
  items.forEach((it, i) => {
    pill(s, it, M, 4.25 + i * 0.5, 3.6, 0.38, NAVY2, "D7DBE2", { fs: 13, bold: false });
  });
  return s;
}


(async () => {
  const ctxBase = { pres, content, T, card, pill, iconCircle, numCircle, chevron, W, M, colors: { BG, ACCENT, NAVY, NAVY2, WHITE, GRAY, MUTED, OTINT } };
// ===== 동계방학 취업 프로그램 본문 (build_winter.js 생성 시 끼워 넣음) =====
  const C = { BG, ACCENT, NAVY, NAVY2, WHITE, GRAY, MUTED, OTINT };
  const PINK2 = "F2A6BC";

  // ---------- 일정 (2027년 동계방학, 6주) ----------
  const LECT = [
    { wk: "1주차", date: "1/6(수)", d: [2027, 1, 6], title: "한국 채용 구조와 비자 연계 취업전략", items: ["공채·수시·외국인 전형 등 채용 방식", "D-2 → D-10 → E-7 체류자격 전환 흐름", "F-2-R 등 지역 정주 비자와 졸업 시점별 일정"], out: "취업·비자 로드맵", icon: "LuRoute" },
    { wk: "2주차", date: "1/13(수)", d: [2027, 1, 13], title: "직무 분석과 충북 타깃 기업 찾기", items: ["충북 주력산업(반도체·이차전지·바이오 등) 직무", "채용공고·직무기술서 읽는 법", "채용정보 사이트로 외국인 채용 기업 찾기"], out: "타깃 기업 10곳", icon: "LuTarget" },
    { wk: "3주차", date: "1/20(수)", d: [2027, 1, 20], title: "한국형 자기소개서·이력서", items: ["자주 나오는 문항과 답변 구조", "STAR 기법으로 경험 정리", "유학 경험을 강점으로 쓰는 법"], out: "자소서·이력서 초안", icon: "LuPenLine" },
    { wk: "4주차", date: "1/27(수)", d: [2027, 1, 27], title: "면접 전략과 AI 역량검사", items: ["인성·직무 면접과 외국인 빈출 질문", "AI 역량검사 유형 체험", "2인 1조 모의면접·상호 평가"], out: "모의면접 평가표", icon: "LuMic" },
  ];
  const DAY_MENTOR = [[2027, 2, 2], [2027, 2, 3]];
  const DAY_COMPANY = [2027, 2, 11];
  const HOLI = { "2027-1-1": "신정", "2027-2-6": "설 연휴", "2027-2-7": "설날", "2027-2-8": "설 연휴", "2027-2-9": "대체공휴일" };

  // ===== 1. 표지 =====
  section("표지");
  {
    const s = pres.addSlide({ masterName: "DARK", sectionTitle: curSection });
    s.background = { color: WHITE };
    const A = (f) => path.resolve(__dirname, "assets", f);
    s.addImage({ path: A("cbnu_logo.png"), x: M, y: 0.55, w: 2.9, h: 2.9 * 245 / 742, altText: "충북대학교 심볼마크 시그니처" });
    s.addImage({ path: A("jobwave_dark.png"), x: W - M - 0.36 * LOGO_R, y: 0.78, w: 0.36 * LOGO_R, h: 0.36, altText: "잡웨이브 로고" });
    pill(s, "제안서", M, 2.2, 1.15, 0.42, NAVY, WHITE, { fs: 14 });
    T(s, "2026. 11.", M + 1.3, 2.2, 2, 0.42, { fontSize: 14, color: GRAY, valign: "middle" });
    T(s, "충북대 외국인 유학생\n동계방학\n취업 프로그램", M, 2.8, 6.4, 2.3, { fontSize: 40, bold: true, color: NAVY, lineSpacingMultiple: 1.05, valign: "middle" });
    T(s, "특강 4회 → 1:1 전문가 멘토링 → 기업 멘토링 데이, 6주 연계 과정", M, 5.25, 6.4, 0.45, { fontSize: 16, color: GRAY, valign: "middle" });
    T(s, "잡웨이브(JobWave)", M, 6.55, 4, 0.4, { fontSize: 15, bold: true, color: NAVY, valign: "middle" });
    s.addShape(pres.shapes.OVAL, { x: 7.2, y: 1.8, w: 5.5, h: 5.5, fill: { color: BG }, line: { color: BG } });
    const cw = 5.3, ch = cw * 307 / 802;
    s.addImage({ path: A("cbnu_friends.png"), x: 7.3, y: 3.55, w: cw, h: ch, altText: "충북대학교 캐릭터 CBNU FRIENDS" });
  }

  // ===== 2. 핵심 메시지 =====
  {
    const s = pres.addSlide({ masterName: "BLANK", sectionTitle: curSection });
    T(s, "Winter Career Program 2027", M, 0.55, 8, 0.35, { fontSize: 14, bold: true, color: ACCENT });
    T(s, [{ text: "방학 6주 동안,", options: { color: NAVY, breakLine: true } }, { text: "배우고 · 고치고 · 기업을 만난다", options: { color: ACCENT } }], M, 0.95, 9, 1.35, { fontSize: 36, bold: true, valign: "middle" });
    T(s, "주 1회 특강으로 준비하고, 전문가와 1:1로 서류·면접을 다듬은 뒤, 유학생 채용 기업과 대기업 인사팀을 하루에 만납니다.", M, 2.4, 11.5, 0.4, { fontSize: 15, color: GRAY });
    const ph = [
      ["1~4주차", "취업 특강 4회", "주 1회 · 2시간 · 실습 결과물", "LuPresentation", BG, NAVY],
      ["5주차", "1:1 전문가 멘토링", "2일 · 1인 60분 · 서류·면접 코칭", "LuUsers", NAVY, WHITE],
      ["6주차", "기업 멘토링 데이", "하루 · 5개사 인사담당자 동시 참여", "LuBuilding2", ACCENT, WHITE],
    ];
    const cw = 3.75, gap = 0.44, y = 3.05, h = 2.75;
    for (let i = 0; i < 3; i++) {
      const [wk, t, d, ic, fill, tc] = ph[i], x = M + i * (cw + gap), dark = fill !== BG;
      card(s, x, y, cw, h, fill, { shadow: true });
      await iconCircle(s, x + 0.35, y + 0.35, 0.9, ic, dark ? WHITE : ACCENT, dark ? fill : WHITE);
      pill(s, wk, x + cw - 1.45, y + 0.5, 1.15, 0.38, dark ? WHITE : NAVY, dark ? fill : WHITE, { fs: 12 });
      T(s, t, x + 0.35, y + 1.45, cw - 0.6, 0.55, { fontSize: 24, bold: true, color: tc, valign: "middle" });
      T(s, d, x + 0.35, y + 2.05, cw - 0.6, 0.45, { fontSize: 14, color: dark ? "E6E8EC" : GRAY, valign: "middle" });
      if (i < 2) chevron(s, x + cw + 0.12, y + h / 2 - 0.18, 0.22, 0.36, ACCENT);
    }
    card(s, M, 6.05, W - 2 * M, 0.62, OTINT);
    s.addImage({ data: await icon("LuGlobe", ACCENT), x: M + 0.25, y: 6.17, w: 0.38, h: 0.38 });
    T(s, [{ text: "전 기간  ", options: { bold: true, color: ACCENT } }, { text: "외국인 채용공고 안내 사이트 CBNU K-Job Hub 제공 · 공고 매주 갱신, 신청·예약·결과물 관리", options: { color: NAVY } }], M + 0.8, 6.05, W - 2 * M - 1, 0.62, { fontSize: 14, valign: "middle" });
  }

  // ===== 3. 목차 =====
  {
    const s = pres.addSlide({ masterName: "BLANK", sectionTitle: curSection });
    card(s, 0, 0, 4.2, 7.5, NAVY, { r: 0 });
    T(s, "목차", M, 1.0, 3, 0.9, { fontSize: 40, bold: true, color: WHITE });
    T(s, "Contents", M, 1.9, 3, 0.4, { fontSize: 16, color: ACCENT, bold: true });
    s.addImage({ path: ARC, x: -1.8, y: 3.0, w: 6.0, h: 4.56, transparency: 30 });
    const rows = [
      ["01", "프로그램 개요", "추진 배경 / 6주 연계 구조 / 운영 개요", "LuTarget"],
      ["02", "전체 일정", "달력으로 보는 커리큘럼 / 주차별 일정", "LuCalendarDays"],
      ["03", "단계별 운영", "취업 특강 4회 / 1:1 전문가 멘토링 / 기업 멘토링 데이", "LuLayoutDashboard"],
      ["04", "채용공고 안내 사이트", "CBNU K-Job Hub / 기간 중 사이트 활용", "LuGlobe"],
      ["05", "운영 관리", "모집·참여·수료 관리 / 성과지표와 보고", "LuShieldCheck"],
      ["06", "예산서(안)", "항목별 산출 내역", "LuCalculator"],
    ];
    const x = 4.8, w = W - x - M, h = 0.88, g = 0.14;
    for (let i = 0; i < rows.length; i++) {
      const y = 0.65 + i * (h + g);
      card(s, x, y, w, h, BG);
      numCircle(s, x + 0.25, y + 0.12, 0.64, rows[i][0], ACCENT, WHITE, 17);
      T(s, rows[i][1], x + 1.15, y + 0.08, 5, 0.42, { fontSize: 19, bold: true, valign: "middle" });
      T(s, rows[i][2], x + 1.15, y + 0.48, 6.4, 0.32, { fontSize: 13, color: GRAY, valign: "middle" });
      await iconCircle(s, x + w - 0.8, y + 0.17, 0.54, rows[i][3], WHITE, NAVY);
    }
  }

  // ===== 01 프로그램 개요 =====
  section("01 프로그램 개요");
  await divider("01", "프로그램 개요", ["추진 배경", "6주 연계 구조", "운영 개요"], "div01");

  // ===== 5. 데이터 =====
  {
    const s = content("01 프로그램 개요", "추진 배경: 유학생 유입은 늘었으나, 국내 취업·정착은 저조", "충북은 유학생 입학 증가율 전국 1위지만, 학사 졸업 유학생 10명 중 7명은 졸업 후 출국");
    const y = 1.95, h = 4.65, w = 3.85, g = 0.3;
    // 카드 1: 신규 입학자 차트
    let x = M;
    card(s, x, y, w, h, BG);
    T(s, "유학생 신규 입학자", x + 0.3, y + 0.25, w - 0.6, 0.35, { fontSize: 15, bold: true });
    s.addChart(pres.charts.BAR, [{ name: "입학", labels: ["2019", "2025"], values: [66915, 117333] }], {
      x: x + 0.2, y: y + 0.65, w: w - 0.4, h: 2.75, barDir: "col", chartColors: ["9AA1AC", ACCENT], barGapWidthPct: 60,
      showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 13, dataLabelFontBold: true, dataLabelColor: NAVY, dataLabelFormatCode: "#,##0",
      catAxisLabelColor: GRAY, catAxisLabelFontSize: 13, valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
      showLegend: false, catAxisLineShow: false, dataLabelFontFace: "+mn-lt", catAxisLabelFontFace: "+mn-lt", valAxisMaxVal: 140000,
    });
    // pptxgenjs: invertedColors 대신 단일 시리즈 다색 처리
    T(s, [{ text: "+75.3%", options: { fontSize: 36, bold: true, color: ACCENT } }, { text: "  2019년 대비", options: { fontSize: 13, color: GRAY } }], x + 0.3, y + 3.55, w - 0.6, 0.8, { valign: "middle" });

    // 카드 2: 414.7%
    x += w + g;
    card(s, x, y, w, h, NAVY);
    T(s, "충북 유학생 입학 증가율", x + 0.3, y + 0.25, w - 0.6, 0.35, { fontSize: 15, bold: true, color: WHITE });
    T(s, "414.7%", x + 0.3, y + 0.65, w - 0.6, 1.0, { fontSize: 60, bold: true, color: ACCENT, valign: "middle" });
    pill(s, "전국 시도 중 1위", x + 0.3, y + 1.75, 1.9, 0.38, ACCENT, WHITE, { fs: 12 });
    T(s, "2019년 대비\n2025년", x + 2.3, y + 1.72, 1.4, 0.44, { fontSize: 12, color: "C9CED6", valign: "middle" });
    const reg = [["충북", 414.7], ["경북", 305.2], ["전남", 254], ["경기", 140.3]];
    reg.forEach(([n, v], i) => {
      const ry = y + 2.45 + i * 0.5;
      T(s, n, x + 0.3, ry, 0.6, 0.35, { fontSize: 13, bold: true, color: WHITE, valign: "middle" });
      const bw = 1.9 * v / 414.7;
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.95, y: ry + 0.07, w: 1.9, h: 0.22, fill: { color: NAVY2 }, line: { color: NAVY2 } });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.95, y: ry + 0.07, w: bw, h: 0.22, fill: { color: i === 0 ? ACCENT : "7A8392" }, line: { color: i === 0 ? ACCENT : "7A8392" } });
      T(s, (v === 254 ? "254" : v.toFixed(1)) + "%", x + 2.95, ry, 0.75, 0.35, { fontSize: 12, color: i === 0 ? ACCENT : "C9CED6", bold: i === 0, valign: "middle", align: "right" });
    });

    // 카드 3: 10명 중 7명
    x += w + g;
    card(s, x, y, w, h, OTINT);
    T(s, "졸업 후 출국 비율", x + 0.3, y + 0.25, w - 0.6, 0.35, { fontSize: 15, bold: true });
    T(s, [{ text: "10명 중 ", options: { fontSize: 20, color: NAVY, bold: true } }, { text: "7명", options: { fontSize: 36, color: ACCENT, bold: true } }, { text: " 출국", options: { fontSize: 20, color: NAVY, bold: true } }], x + 0.3, y + 0.65, w - 0.6, 0.75, { valign: "middle" });
    for (let i = 0; i < 10; i++) {
      const px = x + 0.3 + (i % 5) * 0.66, py = y + 1.5 + Math.floor(i / 5) * 0.62;
      s.addImage({ data: await icon("LuUser", i < 7 ? ACCENT : MUTED), x: px, y: py, w: 0.52, h: 0.52 });
    }
    [["학사", 71.8], ["석사", 71.3], ["박사", 81.3]].forEach(([n, v], i) => {
      const ry = y + 2.9 + i * 0.5;
      T(s, n, x + 0.3, ry, 0.6, 0.35, { fontSize: 13, bold: true, valign: "middle" });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.95, y: ry + 0.07, w: 2.0, h: 0.22, fill: { color: WHITE }, line: { color: WHITE } });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.95, y: ry + 0.07, w: 2.0 * v / 100, h: 0.22, fill: { color: i === 0 ? ACCENT : NAVY }, line: { color: i === 0 ? ACCENT : NAVY } });
      T(s, v + "%", x + 3.0, ry, 0.6, 0.35, { fontSize: 12, bold: true, color: i === 0 ? ACCENT : NAVY, valign: "middle", align: "right" });
    });
    T(s, "출처: 법무부 출입국·외국인정책본부 「외국인 유학생 체류·정주 현황 분석」(2026. 9. 4.)", M, 6.7, 12, 0.28, { fontSize: 10, color: MUTED });
  }


  // 6주 연계 구조
  {
    const s = content("01 프로그램 개요", "6주 연계 구조", "앞 단계의 결과물을 다음 단계에서 그대로 쓰도록 설계 · 채용정보 사이트에 모든 기록을 저장");
    const st = [
      ["STEP 1", "취업 특강 4회", "1~4주차 · 매주 수요일", ["채용 구조·비자", "직무·타깃 기업", "자소서·이력서", "면접·AI 역량검사"], "로드맵 · 타깃 기업 · 서류 초안 · 평가표", BG, NAVY],
      ["STEP 2", "1:1 전문가 멘토링", "5주차 · 2일", ["특강 서류 초안 첨삭", "평가표 기반 모의면접", "기업 멘토링 데이 준비"], "최종 이력서·자소서 · 면접 피드백", NAVY, WHITE],
      ["STEP 3", "기업 멘토링 데이", "6주차 · 하루", ["5개사 인사담당자 동시 참여", "라운드 테이블 3회", "희망자 개별 채용 상담"], "기업 Q&A 카드 · 채용 연계 후보", ACCENT, WHITE],
    ];
    const cw = 3.7, gap = 0.515, y = 1.95, h = 3.75;
    for (let i = 0; i < 3; i++) {
      const [lab, t, when, bl, out, fill, tc] = st[i], x = M + i * (cw + gap), dark = fill !== BG;
      card(s, x, y, cw, h, fill, { shadow: true });
      T(s, lab, x + 0.3, y + 0.25, 1.5, 0.3, { fontSize: 12, bold: true, color: dark ? PINK2 : ACCENT });
      T(s, t, x + 0.3, y + 0.55, cw - 0.5, 0.5, { fontSize: 21, bold: true, color: tc, valign: "middle" });
      T(s, when, x + 0.3, y + 1.05, cw - 0.5, 0.32, { fontSize: 13, color: dark ? "C9CED6" : GRAY });
      T(s, bl.map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < bl.length - 1 } })), x + 0.3, y + 1.5, cw - 0.5, 1.3, { fontSize: 14, color: dark ? WHITE : NAVY, paraSpaceAfter: 4 });
      card(s, x + 0.2, y + h - 0.85, cw - 0.4, 0.65, dark ? WHITE : OTINT, { r: 0.08 });
      T(s, [{ text: "결과물  ", options: { bold: true, color: ACCENT, fontSize: 11 } }, { text: out, options: { color: NAVY, fontSize: 11.5, bold: true } }], x + 0.35, y + h - 0.85, cw - 0.6, 0.65, { valign: "middle" });
      if (i < 2) {
        chevron(s, x + cw + 0.17, y + h / 2 - 0.2, 0.2, 0.4, ACCENT);
      }
    }
    card(s, M, 5.95, W - 2 * M, 0.75, NAVY2);
    s.addImage({ data: await icon("LuGlobe", WHITE), x: M + 0.25, y: 6.12, w: 0.4, h: 0.4 });
    T(s, [{ text: "채용정보 사이트 CBNU K-Job Hub  ", options: { bold: true, color: WHITE } }, { text: "신청·사전진단 → 특강 자료·결과물 저장 → 멘토링 예약 → 기업 선택·이력서 공개 동의 → 공고 안내·결과 추적", options: { color: "D7DBE2" } }], M + 0.85, 5.95, W - 2 * M - 1.1, 0.75, { fontSize: 13, valign: "middle" });
  }

  // 운영 개요
  {
    const s = content("01 프로그램 개요", "운영 개요", "충북대 외국인 유학생 30명 내외 · 2027년 1월 4일 ~ 2월 12일 (6주) · 일정은 협의 후 확정");
    const rows = [
      ["대상", "충북대 외국인 유학생 30명 내외\n(학부·대학원, TOPIK 3급 이상 권장)", "LuUsers"],
      ["기간", "2027. 1. 4.(월) ~ 2. 12.(금), 6주\n설 연휴(2/6~2/9) 제외", "LuCalendarDays"],
      ["장소", "충북대 교내 강의실·상담실 (멘토링은 온라인 병행 가능)", "LuMapPin"],
      ["언어", "한국어 진행 · 기업 멘토링 데이는 영어·중국어 통역 지원", "LuLanguages"],
      ["수료 기준", "특강 3회 이상 + 1:1 멘토링 + 기업 멘토링 데이 참여", "LuCircleCheck"],
      ["수료 혜택", "수료증 발급, 희망 기업 우선 배정\n동의 시 참여 기업에 이력서 추천", "LuGift"],
    ];
    const cw = (W - 2 * M - 0.3) / 2, ch = 1.45;
    for (let i = 0; i < rows.length; i++) {
      const x = M + (i % 2) * (cw + 0.3), y = 1.95 + Math.floor(i / 2) * (ch + 0.17), hl = i >= 4;
      card(s, x, y, cw, ch, hl ? OTINT : BG);
      await iconCircle(s, x + 0.3, y + 0.35, 0.75, rows[i][2], hl ? ACCENT : NAVY);
      T(s, rows[i][0], x + 1.3, y + 0.22, 3, 0.4, { fontSize: 17, bold: true, color: hl ? ACCENT : NAVY, valign: "middle" });
      T(s, rows[i][1], x + 1.3, y + 0.65, cw - 1.5, 0.65, { fontSize: 13.5, color: NAVY2 });
    }
  }

  // ===== 02 전체 일정 =====
  section("02 전체 일정");
  await divider("02", "전체 일정", ["달력으로 보는 커리큘럼", "주차별 일정"], "div04");

  // 달력
  {
    const s = content("02 전체 일정", "달력으로 보는 전체 커리큘럼", "2027년 1월 4일 ~ 2월 12일 · 특강은 매주 수요일 14:00~16:00 · 일정은 협의 후 확정");
    const ev = {};
    LECT.forEach((l, i) => (ev[l.d.join("-")] = { t: `특강 ${i + 1}`, f: NAVY }));
    DAY_MENTOR.forEach((d) => (ev[d.join("-")] = { t: "1:1\n멘토링", f: NAVY2 }));
    ev[DAY_COMPANY.join("-")] = { t: "기업\n멘토링 데이", f: ACCENT };
    const inRange = (y, m, d) => { const t = new Date(y, m - 1, d).getTime(); return t >= new Date(2027, 0, 4).getTime() && t <= new Date(2027, 1, 12).getTime(); };
    const drawMonth = (x, y, w, h, yr, mo) => {
      T(s, `${yr}년 ${mo}월`, x, y, w, 0.4, { fontSize: 18, bold: true, valign: "middle" });
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const cw = w / 7, top = y + 0.45, hh = 0.32, rh = (h - 0.45 - hh) / 6;
      days.forEach((d, i) => {
        s.addShape(pres.shapes.RECTANGLE, { x: x + i * cw, y: top, w: cw, h: hh, fill: { color: NAVY }, line: { color: WHITE, width: 1 } });
        T(s, d, x + i * cw, top, cw, hh, { fontSize: 11, bold: true, color: i === 0 ? PINK2 : WHITE, align: "center", valign: "middle" });
      });
      const first = new Date(yr, mo - 1, 1).getDay(), n = new Date(yr, mo, 0).getDate();
      for (let c = 0; c < 42; c++) {
        const d = c - first + 1, col = c % 7, row = Math.floor(c / 7);
        const cx = x + col * cw, cy = top + hh + row * rh;
        const key = `${yr}-${mo}-${d}`, e = ev[key], hol = HOLI[key];
        const valid = d >= 1 && d <= n;
        const fill = !valid ? "FAFAFB" : e ? e.f : hol ? "EDEEF1" : inRange(yr, mo, d) ? "FBF1F4" : WHITE;
        s.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: cw, h: rh, fill: { color: fill }, line: { color: LINE, width: 0.75 } });
        if (!valid) continue;
        const dc = e ? WHITE : col === 0 || hol ? ACCENT : col === 6 ? GRAY : NAVY;
        T(s, String(d), cx + 0.06, cy + 0.03, cw - 0.1, 0.24, { fontSize: 10.5, bold: !!e, color: dc });
        if (e) T(s, e.t, cx + 0.03, cy + 0.22, cw - 0.06, rh - 0.24, { fontSize: e.t.includes("\n") ? 8.5 : 10, bold: true, color: WHITE, align: "center", valign: "middle" });
        else if (hol) T(s, hol, cx + 0.03, cy + 0.26, cw - 0.06, rh - 0.3, { fontSize: 8.5, color: GRAY, align: "center", valign: "middle" });
      }
    };
    const mw = (W - 2 * M - 0.45) / 2;
    drawMonth(M, 1.88, mw, 4.35, 2027, 1);
    drawMonth(M + mw + 0.45, 1.88, mw, 4.35, 2027, 2);
    // 범례
    const lg = [[NAVY, "취업 특강 (매주 수, 2시간)"], [NAVY2, "1:1 전문가 멘토링 (2/2~2/3)"], [ACCENT, "기업 멘토링 데이 (2/11)"], ["FBF1F4", "프로그램 기간 · 채용정보 사이트 운영"], ["EDEEF1", "공휴일"]];
    let lx = M;
    const lw = [2.55, 2.75, 2.35, 3.05, 1.0];
    lg.forEach(([c, t], i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: lx, y: 6.42, w: 0.24, h: 0.24, fill: { color: c }, line: { color: c === "FBF1F4" || c === "EDEEF1" ? "C9CED6" : c, width: 0.75 } });
      T(s, t, lx + 0.32, 6.37, lw[i] - 0.35, 0.34, { fontSize: 11, color: NAVY2, valign: "middle" });
      lx += lw[i];
    });
    T(s, "사전: 12월 모집·사전진단(사이트) · 사후: 2~5월 취업 결과 추적", M, 6.75, W - 2 * M, 0.25, { fontSize: 10, color: MUTED });
  }

  // 주차별 일정표
  {
    const s = content("02 전체 일정", "주차별 일정", "주 1회 특강 4회 → 5주차 1:1 멘토링 2일 → 6주차 기업 멘토링 데이, 결과물이 다음 단계로 이어짐");
    const H = (t, f = NAVY) => ({ text: t, options: { bold: true, color: WHITE, fill: { color: f }, align: "center" } });
    const data = [[H("주차"), H("일정"), H("프로그램"), H("주요 내용"), H("결과물", ACCENT)]];
    const row = (a, b, c, d, e, hl) => {
      const f = hl === 1 ? OTINT : hl === 2 ? "E8EAF0" : WHITE;
      data.push([
        { text: a, options: { bold: true, align: "center", fill: { color: f } } },
        { text: b, options: { align: "center", fill: { color: f } } },
        { text: c, options: { bold: true, fill: { color: f }, color: hl === 1 ? ACCENT : NAVY } },
        { text: d, options: { fill: { color: f }, color: NAVY2 } },
        { text: e, options: { bold: true, fill: { color: f }, color: ACCENT } },
      ]);
    };
    row("사전", "12월", "모집·신청", "사이트 신청, 사전진단(관심 직무·비자·한국어 수준)", "사전진단 결과", 2);
    LECT.forEach((l, i) => row(l.wk, `${l.date} 14:00~16:00`, `특강 ${i + 1}`, l.title, l.out, 0));
    row("5주차", "2/2(화)~2/3(수)", "1:1 전문가 멘토링", "1인 60분 · 서류 첨삭 + 모의면접 · 기업 멘토링 데이 준비", "최종 서류·면접 피드백", 1);
    row("6주차", "2/11(목) 10:00~16:30", "기업 멘토링 데이", "5개사 인사담당자 라운드 테이블 3회 + 개별 채용 상담", "Q&A 카드·채용 연계", 1);
    row("사후", "2~5월", "결과 추적", "채용공고 안내 지속, 지원·합격 현황 3개월 추적", "결과보고서", 2);
    s.addTable(data, { x: M, y: 1.95, w: W - 2 * M, colW: [1.0, 2.25, 2.2, 4.6, 2.08], rowH: 0.52, fontSize: 12.5, fontFace: FONT, color: NAVY, border: { type: "solid", pt: 0.5, color: LINE }, valign: "middle", margin: [0, 0.1, 0, 0.14] });
  }

  // ===== 03 단계별 운영 =====
  section("03 단계별 운영");
  await divider("03", "단계별 운영", ["STEP 1  취업 특강 4회", "STEP 2  1:1 전문가 멘토링", "STEP 3  기업 멘토링 데이"], "div03");

  // STEP 1 특강
  {
    const s = content("03 단계별 운영 / STEP 1 취업 특강", "STEP 1  취업 특강 4회", "1~4주차 매주 수요일 14:00~16:00 · 강의당 2시간 (강의 80분 + 실습 40분) · 강의마다 결과물 작성");
    const cw = (W - 2 * M - 0.3) / 2, ch = 2.37;
    for (let i = 0; i < 4; i++) {
      const L = LECT[i], x = M + (i % 2) * (cw + 0.3), y = 1.95 + Math.floor(i / 2) * (ch + 0.13);
      card(s, x, y, cw, ch, BG);
      await iconCircle(s, x + 0.22, y + 0.2, 0.62, L.icon, i % 2 ? NAVY : ACCENT);
      T(s, `${L.wk} · ${L.date}`, x + 1.0, y + 0.16, 3, 0.3, { fontSize: 12, bold: true, color: ACCENT, valign: "middle" });
      T(s, `특강 ${i + 1}. ${L.title}`, x + 1.0, y + 0.45, cw - 1.2, 0.4, { fontSize: 16, bold: true, valign: "middle" });
      T(s, L.items.map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < L.items.length - 1 } })), x + 0.25, y + 1.0, cw - 0.45, 0.85, { fontSize: 12.5, color: NAVY2, paraSpaceAfter: 2 });
      card(s, x + 0.15, y + ch - 0.45, cw - 0.3, 0.33, WHITE, { r: 0.06 });
      T(s, [{ text: "결과물  ", options: { bold: true, color: GRAY } }, { text: L.out, options: { bold: true, color: ACCENT } }, { text: "  →  " + ["멘토링 1:1 상담 자료", "기업 멘토링 데이 기업 선택", "멘토링 서류 첨삭 교재", "멘토링 모의면접 기준"][i], options: { color: GRAY } }], x + 0.3, y + ch - 0.45, cw - 0.6, 0.33, { fontSize: 11.5, valign: "middle" });
    }
  }

  // STEP 2 멘토링
  {
    const s = content("03 단계별 운영 / STEP 2 1:1 전문가 멘토링", "STEP 2  1:1 전문가 멘토링", "5주차 2/2(화)~2/3(수) 이틀 · 전문멘토 3명 · 1인 60분 · 특강 결과물로 서류와 면접을 마무리");
    const sw = (7.6 - 0.6) / 3;
    stat(s, M, 1.95, sw, 1.45, "2", "일", "2/2(화)~2/3(수)", BG, NAVY, GRAY);
    stat(s, M + sw + 0.3, 1.95, sw, 1.45, "3", "명", "전문멘토 동시 운영", BG, NAVY, GRAY);
    stat(s, M + 2 * (sw + 0.3), 1.95, sw, 1.45, "42", "회", "3명 × 7회 × 2일", ACCENT, WHITE, WHITE);
    await photo(s, "mentoring", M + 7.9, 1.95, W - 2 * M - 7.9, 1.45, 0.35);
    // 60분 구성
    T(s, "1인 60분 구성", M, 3.6, 5, 0.35, { fontSize: 14, bold: true });
    const seg = [["10분", "로드맵·타깃 기업 확인", "BG"], ["25분", "자소서·이력서 첨삭", "A"], ["20분", "모의면접 + 피드백", "N"], ["5분", "기업 멘토링 데이 준비", "BG"]];
    let sx = M;
    const tw = 7.6;
    seg.forEach(([m, t, k]) => {
      const w = tw * parseInt(m) / 60, f = k === "A" ? ACCENT : k === "N" ? NAVY : "C9CED6", tc = k === "BG" ? NAVY : WHITE;
      s.addShape(pres.shapes.RECTANGLE, { x: sx, y: 4.0, w, h: 0.55, fill: { color: f }, line: { color: WHITE, width: 2 } });
      T(s, m, sx, 4.0, w, 0.55, { fontSize: 13, bold: true, color: tc, align: "center", valign: "middle" });
      T(s, t, sx - (w < 1.3 ? (1.3 - w) / 2 : 0), 4.6, Math.max(w, 1.3), 0.5, { fontSize: 11, color: GRAY, align: "center" });
      sx += w;
    });
    // 멘토 구성 + 운영
    const box = [["멘토 구성", ["취업 컨설턴트 2명 (서류·면접)", "외국인 채용 경험 인사 전문가 1명"], "LuUserCheck"], ["운영 방식", ["사이트에서 시간 슬롯 예약 · 대기자 자동 배정", "교내 상담실 대면, 원거리 학생은 온라인"], "LuCalendarCheck"]];
    for (let i = 0; i < 2; i++) {
      const x = M + i * 3.95, y = 5.25;
      card(s, x, y, 3.8, 1.5, BG);
      await iconCircle(s, x + 0.2, y + 0.2, 0.5, box[i][2], i ? NAVY : ACCENT);
      T(s, box[i][0], x + 0.85, y + 0.2, 2.8, 0.5, { fontSize: 14, bold: true, valign: "middle" });
      T(s, box[i][1].map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < 1 } })), x + 0.25, y + 0.78, 3.45, 0.65, { fontSize: 11.5, color: NAVY2, paraSpaceAfter: 2 });
    }
    // 오른쪽: 하루 시간표
    const x0 = M + 7.9, w0 = W - M - x0;
    card(s, x0, 3.6, w0, 3.15, NAVY);
    T(s, "하루 운영 (멘토 1명 기준)", x0 + 0.25, 3.72, w0 - 0.5, 0.38, { fontSize: 13.5, bold: true, color: WHITE, valign: "middle" });
    const slots = ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
    slots.forEach((t, k) => {
      const cx = x0 + 0.25 + (k % 4) * ((w0 - 0.5) / 4), cy = 4.2 + Math.floor(k / 4) * 0.62;
      pill(s, t, cx + 0.03, cy, (w0 - 0.5) / 4 - 0.08, 0.42, NAVY2, WHITE, { fs: 11.5 });
    });
    T(s, "1인 60분 × 하루 7회 (12:00~13:00 점심)\n30명이 1인 1회, 남는 12회는 희망자 2회차·예비", x0 + 0.25, 5.55, w0 - 0.5, 0.9, { fontSize: 12, color: "C9CED6", valign: "middle" });
  }

  // STEP 3 기업 멘토링 데이 (1)
  {
    const s = content("03 단계별 운영 / STEP 3 기업 멘토링 데이", "STEP 3  기업 멘토링 데이", "6주차 2/11(목) 하루 · 유학생 채용 기업 3곳 + 대기업 인사팀 2곳, 기업별 인사담당자 2명 · 영어·중국어 통역 지원");
    const sw = (W - 2 * M - 0.6) / 3;
    stat(s, M, 1.95, sw, 1.5, "5", "개사", "유학생 채용 기업 3 + 대기업 인사팀 2", ACCENT, WHITE, WHITE);
    stat(s, M + sw + 0.3, 1.95, sw, 1.5, "3", "라운드", "학생 1인당 희망 기업 3곳 상담", NAVY, WHITE, "C9CED6");
    stat(s, M + 2 * (sw + 0.3), 1.95, sw, 1.5, "10", "명", "인사담당자 (기업별 2명)", BG, NAVY, GRAY);
    // 5개 테이블 그림
    const tx = M, ty = 3.75, tw = 7.2;
    card(s, tx, ty, tw, 3.0, BG);
    T(s, "동시 운영 테이블", tx + 0.25, ty + 0.12, 3, 0.35, { fontSize: 13, bold: true, color: GRAY });
    const tl = [["A", "유학생 채용 기업"], ["B", "유학생 채용 기업"], ["C", "유학생 채용 기업"], ["D", "대기업 인사팀"], ["E", "대기업 인사팀"]];
    for (let i = 0; i < 5; i++) {
      const cx = tx + 0.75 + i * 1.33, cy = ty + 1.45, big = i >= 3, f = big ? ACCENT : NAVY;
      s.addShape(pres.shapes.OVAL, { x: cx - 0.4, y: cy - 0.4, w: 0.8, h: 0.8, fill: { color: f }, line: { color: f } });
      T(s, tl[i][0], cx - 0.4, cy - 0.4, 0.8, 0.8, { fontSize: 22, bold: true, color: WHITE, align: "center", valign: "middle" });
      for (let k = 0; k < 6; k++) {
        const a = -Math.PI / 2 + (k * 2 * Math.PI) / 6, px = cx + Math.cos(a) * 0.55 - 0.09, py = cy + Math.sin(a) * 0.55 - 0.09;
        s.addShape(pres.shapes.OVAL, { x: px, y: py, w: 0.18, h: 0.18, fill: { color: WHITE }, line: { color: f, width: 1.25 } });
      }
      T(s, tl[i][1], cx - 0.66, cy + 0.72, 1.32, 0.45, { fontSize: 10, color: NAVY2, align: "center", valign: "top" });
    }
    // 오른쪽: 하루 일정
    const x0 = tx + tw + 0.3, w0 = W - M - x0;
    T(s, "하루 일정 (안)", x0, 3.75, w0, 0.35, { fontSize: 13, bold: true, color: GRAY });
    const tt = [["10:00", "오리엔테이션·참여 기업 소개"], ["10:20", "기업 설명회 (기업별 12분)"], ["11:30", "점심·기업별 네트워킹"], ["13:00", "라운드 테이블 1·2·3 (각 40분)"], ["15:40", "개별 채용 상담·이력서 피드백"], ["16:30", "마무리·만족도 조사"]];
    tt.forEach(([t, d], k) => {
      const y = 4.15 + k * 0.44, main = k === 3;
      card(s, x0, y, w0, 0.38, main ? OTINT : WHITE, { line: main ? "E9B8C7" : LINE, r: 0.06 });
      T(s, t, x0 + 0.12, y, 0.75, 0.38, { fontSize: 12, bold: true, color: ACCENT, valign: "middle" });
      T(s, d, x0 + 0.9, y, w0 - 1.0, 0.38, { fontSize: 12, color: NAVY, bold: main, valign: "middle" });
    });
  }

  // STEP 3 기업 멘토링 데이 (2) 운영 방식
  {
    const s = content("03 단계별 운영 / STEP 3 기업 멘토링 데이", "기업 멘토링 데이 준비와 연계", "행사 전 기업 선택과 서류 공유, 행사 후 Q&A 카드와 채용 연계까지 한 흐름으로 운영");
    const st = [
      ["기업 섭외", "5주 전", "유학생 채용 기업 3곳\n대기업 인사팀 2곳 확정", "LuBuilding2"],
      ["기업 선택", "5주차", "사이트에서 희망 기업\n3곳 선택, 라운드 배정", "LuListChecks"],
      ["서류 공유", "6주차 전", "동의한 학생의 최종 이력서를\n참여 기업에 미리 전달", "LuFileText"],
      ["멘토링 데이", "2/11(목)", "라운드 테이블 3회\n+ 개별 채용 상담", "LuHandshake"],
      ["사후 연계", "2~5월", "Q&A 카드 사이트 게시\n채용 연계 후보 결과 추적", "LuTrendingUp"],
    ];
    const cw = (W - 2 * M) / 5;
    s.addShape(pres.shapes.LINE, { x: M + cw / 2, y: 2.5, w: 4 * cw, h: 0, line: { color: "C9CED6", width: 3 } });
    for (let i = 0; i < 5; i++) {
      const x = M + i * cw, c = i === 3 ? ACCENT : NAVY;
      await iconCircle(s, x + cw / 2 - 0.45, 2.05, 0.9, st[i][3], c);
      pill(s, st[i][1], x + cw / 2 - 0.6, 3.1, 1.2, 0.34, i === 3 ? ACCENT : WHITE, i === 3 ? WHITE : ACCENT, { fs: 11, line: i === 3 ? ACCENT : "E9B8C7" });
      T(s, st[i][0], x, 3.55, cw, 0.42, { fontSize: 17, bold: true, align: "center", valign: "middle" });
      T(s, st[i][2], x + 0.15, 4.0, cw - 0.3, 0.8, { fontSize: 12, color: GRAY, align: "center" });
    }
    const bx = [["기업 구성 기준", ["외국인(E-7) 고용 경험 또는 채용 계획이 있는 기업", "충북 소재 기업 우선, 대기업 인사팀은 직무·채용 절차 중심"], "LuBadgeCheck", NAVY], ["산출물", ["기업별 인사담당자 Q&A 카드 (사이트 게시)", "채용 연계 후보 명단 (학생 동의 기반)"], "LuClipboardCheck", ACCENT]];
    const bw = (W - 2 * M - 0.3) / 2;
    for (let i = 0; i < 2; i++) {
      const x = M + i * (bw + 0.3), y = 5.05;
      card(s, x, y, bw, 1.65, i ? OTINT : BG);
      await iconCircle(s, x + 0.25, y + 0.25, 0.6, lu[bx[i][2]] ? bx[i][2] : "LuCircleCheck", bx[i][3]);
      T(s, bx[i][0], x + 1.0, y + 0.25, bw - 1.2, 0.6, { fontSize: 16, bold: true, color: bx[i][3], valign: "middle" });
      T(s, bx[i][1].map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < 1 } })), x + 0.3, y + 0.92, bw - 0.5, 0.65, { fontSize: 12.5, color: NAVY2, paraSpaceAfter: 2 });
    }
  }

  // ===== 04 채용공고 안내 사이트 =====
  section("04 채용공고 안내 사이트");
  await divider("04", "채용공고 안내 사이트", ["CBNU K-Job Hub", "기간 중 사이트 활용"], "handshake");
  {
    const SITE = require("./site_slides.js");
    // 사이트 개요 1장만 사용 (메뉴 구성 장은 아래 '기간 중 사이트 활용'으로 대체)
    await SITE.addSiteSlides(ctxBase, "04 채용공고 안내 사이트", { overviewOnly: true });
  }
  // 기간 중 사이트 활용
  {
    const s = content("04 채용공고 안내 사이트", "프로그램 기간 중 사이트 활용", "모집부터 사후 관리까지 한 사이트에서 · 외국인 채용공고는 프로그램 기간 내내 매주 갱신");
    const ph = [
      ["사전", "12월", ["프로그램 신청", "사전진단"]],
      ["1~4주차", "특강", ["특강 자료·과제 제출", "결과물 개인별 저장"]],
      ["5주차", "멘토링", ["시간 슬롯 예약·알림", "첨삭 결과 리포트 저장"]],
      ["6주차", "기업 멘토링", ["희망 기업 3곳 선택", "이력서 공개 동의"]],
      ["사후", "2~5월", ["Q&A 카드·공고 안내", "지원·합격 현황 입력"]],
    ];
    const cw = (W - 2 * M + 0.15 * 4) / 5;
    ph.forEach(([a, b, bl], i) => {
      const x = M + i * (cw - 0.15);
      s.addShape(i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x, y: 1.95, w: cw, h: 0.85, fill: { color: [NTINT, "C9CED6", NAVY2, NAVY, ACCENT][i] }, line: { color: WHITE, width: 2 } });
      T(s, [{ text: a, options: { bold: true, fontSize: 15, breakLine: true } }, { text: b, options: { fontSize: 11 } }], x + 0.35, 1.95, cw - 0.7, 0.85, { color: i < 2 ? NAVY : WHITE, align: "center", valign: "middle" });
      card(s, x + 0.1, 2.95, cw - 0.35, 1.25, BG);
      T(s, bl.map((t, k) => ({ text: t, options: { bullet: true, breakLine: k < bl.length - 1 } })), x + 0.22, 3.05, cw - 0.55, 1.05, { fontSize: 12, color: NAVY2, paraSpaceAfter: 4, valign: "middle" });
    });
    // 아래: 화면 3장
    const h = 2.05, gap = 0.27;
    const A = (f) => path.resolve(__dirname, "assets", "site", f);
    const shots = [["list.jpg", 2280 / 1160, "채용공고 목록 · 비자·한국어 요건 태그"], ["detail.jpg", 1080 / 740, "상세 보기 · 공고 원문 연결"], ["vi.jpg", 1440 / 650, "4개 언어 전환 (베트남어 화면)"]];
    let x = M;
    shots.forEach(([f, r, cap]) => {
      const w = h * r;
      s.addImage({ path: A(f), x, y: 4.4, w, h });
      s.addShape(pres.shapes.RECTANGLE, { x, y: 4.4, w, h, fill: { type: "none" }, line: { color: "D7DBE2", width: 1 } });
      T(s, cap, x, 4.4 + h + 0.06, w, 0.28, { fontSize: 11, bold: true, color: NAVY2 });
      x += w + gap;
    });
  }

  // ===== 05 운영 관리 =====
  section("05 운영 관리");
  await divider("05", "운영 관리", ["모집·참여·수료 관리", "성과지표와 보고"], "div05");
  {
    const s = content("05 운영 관리", "모집·참여·수료 관리", "방학 중 참여율을 지키기 위한 모집·알림·수료 기준 운영");
    const it = [
      ["모집·홍보", "12월", ["국제교류본부 협조, 교내 채널·사이트 다국어 공지", "유학생 커뮤니티·학과 단위 안내"], "LuMegaphone", NAVY],
      ["참여 관리", "1~2월", ["회차별 전일·당일 알림, 결석 시 자료 제공", "멘토링 노쇼 시 대기자 자동 배정"], "LuBell", NAVY],
      ["수료 관리", "2월", ["특강 3회 이상 + 멘토링 + 기업 멘토링 데이", "수료증 발급, 희망 기업 우선 배정"], "LuAward", ACCENT],
      ["개인정보 보호", "전 기간", ["필요한 항목만 수집, 동의한 기업에만 이력서 공개", "사업 종료 후 대학 이관 또는 협의 기한 내 파기"], "LuShieldCheck", ACCENT],
    ];
    const cw = (W - 2 * M - 0.3) / 2, ch = 2.3;
    for (let i = 0; i < 4; i++) {
      const [t, when, bl, ic, col] = it[i], x = M + (i % 2) * (cw + 0.3), y = 1.95 + Math.floor(i / 2) * (ch + 0.2);
      card(s, x, y, cw, ch, BG, { shadow: true });
      await iconCircle(s, x + 0.3, y + 0.3, 0.8, lu[ic] ? ic : "LuCircleCheck", col);
      T(s, t, x + 1.3, y + 0.3, 3.5, 0.45, { fontSize: 18, bold: true, valign: "middle" });
      pill(s, when, x + cw - 1.3, y + 0.38, 1.0, 0.34, WHITE, ACCENT, { fs: 11, line: "E9B8C7" });
      T(s, bl.map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < 1 } })), x + 1.3, y + 0.95, cw - 1.5, 1.1, { fontSize: 13.5, color: NAVY2, paraSpaceAfter: 6 });
    }
  }
  {
    const s = content("05 운영 관리", "성과지표와 보고 체계", "정량 목표를 정하고 단계별로 보고 · 목표치는 협의 후 확정");
    const k = [["80", "% 이상", "수료율 (모집 인원 대비)", ACCENT, WHITE, WHITE, "LuAward"], ["4.5", "점 이상", "프로그램 만족도 (5점 만점)", NAVY, WHITE, "C9CED6", "LuStar"], ["100", "%", "멘토링 참여자 서류 완성률", BG, NAVY, GRAY, "LuFileText"], ["3", "개월", "종료 후 취업 결과 추적", BG, NAVY, GRAY, "LuTrendingUp"]];
    const cw = (W - 2 * M - 0.9) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.3), y = 1.95, h = 1.85;
      card(s, x, y, cw, h, k[i][3], { shadow: true });
      s.addImage({ data: await icon(lu[k[i][6]] ? k[i][6] : "LuStar", k[i][4] === WHITE ? WHITE : ACCENT), x: x + cw - 0.75, y: y + 0.25, w: 0.45, h: 0.45 });
      T(s, [{ text: k[i][0], options: { fontSize: 44, bold: true } }, { text: " " + k[i][1], options: { fontSize: 16, bold: true } }], x + 0.3, y + 0.15, cw - 0.6, 0.95, { color: k[i][4], valign: "bottom" });
      T(s, k[i][2], x + 0.3, y + 1.22, cw - 0.4, 0.5, { fontSize: 12.5, color: k[i][5] });
    }
    T(s, "보고 체계", M, 4.05, 4, 0.38, { fontSize: 15, bold: true });
    const rp = [["착수보고", "12월", "세부 운영계획·섭외 현황"], ["중간보고", "1월 말", "특강 참여·만족도"], ["수시보고", "이슈 발생 시", "즉시 공유"], ["최종보고", "2월 말", "결과보고서 제출"]];
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.3), y = 4.5, last = i === 3;
      card(s, x, y, cw, 1.55, last ? NAVY : BG);
      pill(s, rp[i][1], x + 0.3, y + 0.22, 1.5, 0.34, last ? ACCENT : WHITE, last ? WHITE : ACCENT, { fs: 11, line: last ? ACCENT : "E9B8C7" });
      T(s, rp[i][0], x + 0.3, y + 0.65, cw - 0.6, 0.45, { fontSize: 19, bold: true, color: last ? WHITE : NAVY, valign: "middle" });
      T(s, rp[i][2], x + 0.3, y + 1.1, cw - 0.5, 0.35, { fontSize: 12.5, color: last ? "C9CED6" : GRAY, valign: "middle" });
      if (i < 3) chevron(s, x + cw + 0.07, y + 0.62, 0.16, 0.3, ACCENT);
    }
    card(s, M, 6.25, W - 2 * M, 0.6, OTINT);
    T(s, [{ text: "결과보고서 목차(안)   ", options: { bold: true, color: ACCENT } }, { text: "사업 개요 · 단계별 운영 결과 · 만족도 조사 · 기업 멘토링 데이 결과 · 취업 성과 · 개선 제안", options: { color: NAVY } }], M + 0.3, 6.25, W - 2 * M - 0.6, 0.6, { fontSize: 13, valign: "middle" });
  }

  // ===== 06 예산서(안) =====
  section("06 예산서(안)");
  await divider("06", "예산서(안)", ["예산 요약", "항목별 산출 내역"], "div02");
  {
    // 단가 근거: 유사사업 「2026학년도 K-유학생 취업캠프」 견적(국립한국교통대학교, 2026.10.16)
    // * 는 유사사업에 없는 항목이거나 회당 단가를 하루로 환산한 가정 단가
    const G = [
      ["STEP 1 취업 특강 4회", [
        ["특강 강사료", 250000, "1×4", 4, "회당 2시간"],
        ["교재·워크북", 15000, "30", 30, "수강 30명"],
        ["다과", 150000, "1×4", 4, "회차마다"],
      ]],
      ["STEP 2 1:1 전문가 멘토링", [
        ["전문멘토 수당 (하루) *", 300000, "3×2", 6, "멘토 3명 × 2일"],
        ["다과", 150000, "1×2", 2, "운영일마다"],
      ]],
      ["STEP 3 기업 멘토링 데이", [
        ["인사담당자 사례비 (하루) *", 300000, "5×2", 10, "5개사 × 2명"],
        ["통역 (영어·중국어) *", 300000, "2", 2, "언어별 1명"],
        ["식사", 10000, "45", 45, "참석 45명"],
        ["다과", 150000, "1", 1, "행사 1회"],
        ["기업용 외국인 고용 안내자료", 15000, "5", 5, "참여 기업 수"],
      ]],
      ["채용공고 안내 사이트", [
        ["기능 보완 (신청·예약·기업 선택) *", 1500000, "1", 1, "시안 사이트 기반"],
        ["호스팅·도메인 *", 300000, "1", 1, "1년"],
        ["공고 큐레이션 운영 *", 100000, "1×8", 8, "주 1회 × 8주"],
      ]],
      ["공통 운영", [
        ["현장 운영 보조 인력 *", 150000, "1×7", 7, "운영일 7일"],
        ["홍보물 (현수막·배너·포스터)", 150000, "2", 2, "모집·행사장"],
        ["수료증·우수 수료자 시상 *", 400000, "1", 1, "수료증 30·시상 5명"],
        ["운영제반비", 800000, "1", 1, "기획·결과보고"],
      ]],
    ];
    const won = (v) => (v ? v.toLocaleString("ko-KR") : "-");
    let total = 0;
    const subs = G.map(([g, items]) => { const v = items.reduce((a, [, p, , q]) => a + p * q, 0); total += v; return [g, v]; });
    const vat = Math.round(total * 0.1), grand = Math.floor((total + vat) / 10000) * 10000;
    const SRC = "단가 근거: 유사사업 「2026학년도 K-유학생 취업캠프」 견적(국립한국교통대학교, 2026.10.16) · * 유사사업에 없는 항목이거나 회당 단가를 하루로 환산(× 2회)한 가정 단가";

    // --- 예산 요약 ---
    {
      const s = content("06 예산서(안)", "예산 요약", "총 1,500만 원 내외 (VAT 포함) · 공급가 합산 후 부가세 10% 포함, 만 원 단위 절사");
      const desc = ["강사료·교재·다과", "전문멘토 3명 × 2일", "인사담당자 10명·통역·식사", "기능 보완·호스팅·공고 큐레이션", "운영 보조·홍보·수료·운영제반"];
      const icons = ["LuPresentation", "LuUsers", "LuBuilding2", "LuGlobe", "LuClipboardList"];
      const max = Math.max(...subs.map((x) => x[1]));
      for (let k = 0; k < subs.length; k++) {
        const [g, v] = subs[k], y = 1.95 + k * 0.92;
        card(s, M, y, 7.9, 0.8, BG);
        await iconCircle(s, M + 0.18, y + 0.14, 0.52, icons[k], k === 2 ? ACCENT : NAVY);
        T(s, g, M + 0.85, y + 0.07, 3.3, 0.36, { fontSize: 14, bold: true, valign: "middle" });
        T(s, desc[k], M + 0.85, y + 0.42, 3.3, 0.3, { fontSize: 11, color: GRAY, valign: "middle" });
        const bx = M + 4.2, bw = 2.2 * v / max;
        s.addShape(pres.shapes.RECTANGLE, { x: bx, y: y + 0.3, w: 2.2, h: 0.2, fill: { color: "E3E6EA" }, line: { color: "E3E6EA" } });
        s.addShape(pres.shapes.RECTANGLE, { x: bx, y: y + 0.3, w: bw, h: 0.2, fill: { color: k === 2 ? ACCENT : NAVY }, line: { color: k === 2 ? ACCENT : NAVY } });
        T(s, won(v), M + 6.5, y, 1.25, 0.8, { fontSize: 14, bold: true, align: "right", valign: "middle" });
      }
      const x0 = M + 8.25, w0 = W - M - x0;
      card(s, x0, 1.95, w0, 4.5, NAVY, { shadow: true });
      T(s, "총 예산 (VAT 포함)", x0 + 0.3, 2.15, w0 - 0.6, 0.4, { fontSize: 15, bold: true, color: WHITE, valign: "middle" });
      T(s, [{ text: (grand / 10000).toLocaleString("ko-KR"), options: { fontSize: 54, bold: true, color: PINK2 } }, { text: " 만 원", options: { fontSize: 20, bold: true, color: WHITE } }], x0 + 0.3, 2.65, w0 - 0.6, 1.1, { valign: "middle" });
      s.addShape(pres.shapes.LINE, { x: x0 + 0.3, y: 3.95, w: w0 - 0.6, h: 0, line: { color: "4A5466", width: 1 } });
      [["공급가액", total], ["부가세 (10%)", vat], ["합계", total + vat]].forEach(([l, v], k) => {
        const y = 4.1 + k * 0.5;
        T(s, l, x0 + 0.3, y, 1.8, 0.42, { fontSize: 13, color: "C9CED6", valign: "middle" });
        T(s, won(v) + " 원", x0 + 1.9, y, w0 - 2.2, 0.42, { fontSize: 13, bold: true, color: WHITE, align: "right", valign: "middle" });
      });
      T(s, "만 원 단위 절사 · 참여 인원 30명 기준", x0 + 0.3, 5.75, w0 - 0.6, 0.4, { fontSize: 11, color: "C9CED6", valign: "middle" });
      T(s, SRC, M, 6.8, W - 2 * M, 0.22, { fontSize: 9, color: MUTED });
    }

    // --- 항목별 산출 내역 (두 열) ---
    {
      const s = content("06 예산서(안)", "항목별 산출 내역", "단위: 원 · 부가세 별도 · 수량은 인원(명)·횟수 기준");
      const H = (t, f = NAVY, al = "center") => ({ text: t, options: { bold: true, color: WHITE, fill: { color: f }, align: al, fontSize: 10.5 } });
      const table = (groups, x, w) => {
        const data = [[H("항목", NAVY, "left"), H("단가"), H("수량"), H("금액", ACCENT), H("산출 근거", NAVY, "left")]];
        for (const [g, items] of groups) {
          const sub = items.reduce((a, [, p, , q]) => a + p * q, 0);
          data.push([{ text: g, options: { colspan: 3, bold: true, color: ACCENT, fill: { color: OTINT } } }, { text: won(sub), options: { bold: true, color: ACCENT, align: "right", fill: { color: OTINT } } }, { text: "", options: { fill: { color: OTINT } } }]);
          for (const [n, p, q, qn, note] of items) data.push([{ text: n }, { text: won(p), options: { align: "right" } }, { text: q, options: { align: "center", color: GRAY } }, { text: won(p * qn), options: { align: "right", bold: true } }, { text: note, options: { color: GRAY, fontSize: 9.5 } }]);
        }
        s.addTable(data, { x, y: 1.95, w, colW: [2.35, 0.8, 0.55, 0.9, w - 4.6], rowH: 0.3, fontSize: 10, fontFace: FONT, color: NAVY, border: { type: "solid", pt: 0.5, color: LINE }, valign: "middle", margin: [0, 0.06, 0, 0.08] });
      };
      const cw = (W - 2 * M - 0.25) / 2;
      table(G.slice(0, 3), M, cw);
      table(G.slice(3), M + cw + 0.25, cw);
      // 오른쪽 아래 합계 상자
      const x0 = M + cw + 0.25, y0 = 1.95 + 0.3 * 12 + 0.25;
      card(s, x0, y0, cw, 0.95, NAVY);
      T(s, [{ text: "공급가 " + won(total) + "  +  부가세 " + won(vat), options: { fontSize: 11.5, color: "C9CED6", breakLine: true } }, { text: "총계 (VAT 포함, 만 원 단위 절사)  ", options: { fontSize: 13, bold: true, color: WHITE } }, { text: won(grand) + " 원", options: { fontSize: 16, bold: true, color: PINK2 } }], x0 + 0.3, y0, cw - 0.6, 0.95, { valign: "middle" });
      T(s, SRC, M, 6.8, W - 2 * M, 0.22, { fontSize: 9, color: MUTED });
    }
    console.log("budget total", total, vat, grand);
  }

    // ===== Contact =====
  {
    const s = pres.addSlide({ masterName: "DARK", sectionTitle: curSection });
    s.addImage({ path: ARC, x: 5.13, y: 0.15, w: 8.2, h: 6.23 });
    T(s, "Contact", M, 1.2, 4, 0.4, { fontSize: 16, bold: true, color: ACCENT });
    s.addImage({ path: path.resolve(__dirname, "assets", "jobwave_white.png"), x: M, y: 1.75, w: 0.62 * LOGO_R, h: 0.62, altText: "잡웨이브 로고" });
    T(s, "공부한 충북에서, 일하는 충북으로", M, 2.6, 8, 0.45, { fontSize: 18, color: "C9CED6" });
    const rows = [["담당자", "허성훈 실장", "LuUser"], ["연락처", "010-5939-4362", "LuPhone"], ["홈페이지", "jobwave.kr", "LuGlobe"]];
    for (let i = 0; i < rows.length; i++) {
      const y = 3.55 + i * 0.75;
      await iconCircle(s, M, y, 0.55, rows[i][2], ACCENT);
      T(s, rows[i][0], M + 0.8, y, 1.4, 0.55, { fontSize: 14, color: "C9CED6", valign: "middle" });
      T(s, rows[i][1], M + 2.2, y, 4, 0.55, { fontSize: 17, bold: true, color: WHITE, valign: "middle" });
    }
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  // 테마의 한글(Hang)·동아시아(ea) 글꼴도 Pretendard로 지정 (기본값은 맑은 고딕/빈칸)
  {
    const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
    const fs = require("fs");
    const zip = await JSZip.loadAsync(fs.readFileSync(OUT));
    for (const name of Object.keys(zip.files).filter((n) => /^ppt\/theme\/theme\d+\.xml$/.test(n))) {
      let xml = await zip.file(name).async("string");
      xml = xml.replace(/<a:ea typeface="[^"]*"\/>/g, `<a:ea typeface="${FONT}"/>`)
               .replace(/<a:font script="Hang" typeface="[^"]*"\/>/g, `<a:font script="Hang" typeface="${FONT}"/>`);
      zip.file(name, xml);
    }
    // 차트(pptxgenjs 기본값 Arial) 글꼴도 Pretendard로
    for (const name of Object.keys(zip.files).filter((n) => /^ppt\/charts\/chart\d+\.xml$/.test(n))) {
      const xml = await zip.file(name).async("string");
      zip.file(name, xml.replace(/typeface="Arial"/g, `typeface="${FONT}"`));
    }
    // 글머리 기호 글꼴(마스터·레이아웃·슬라이드의 buFont Arial)도 Pretendard로
    for (const name of Object.keys(zip.files).filter((n) => /^ppt\/(slideMasters|slideLayouts|slides)\/[^/]+\.xml$/.test(n))) {
      const xml = await zip.file(name).async("string");
      if (xml.includes('<a:buFont typeface="Arial"')) zip.file(name, xml.replace(/<a:buFont typeface="Arial"/g, `<a:buFont typeface="${FONT}"`));
    }
    for (const n of Object.keys(zip.files)) if (zip.files[n].dir) delete zip.files[n]; // 폴더 항목 제거 (클라우드 공동편집 호환)
    fs.writeFileSync(OUT, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  }
  console.log("wrote", OUT);
})();

