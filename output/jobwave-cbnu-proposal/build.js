const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");
const path = require("path");
const { applyTheme } = require("/root/.claude/skills/synced/1140d78c-b0fa-4fd4-a06b-04f4c07d69e1_17b93ea7-d146-4ef9-848e-caab6f30b720/pptx/scripts/apply_theme.js");

const ARC = path.resolve(__dirname, "arc.png");
const OUT = path.resolve(__dirname, "JobWave_proposal_visual.pptx");

// palette (원본 색 유지)
const NAVY = "151B26", ORANGE = "E5532D", GRAY = "5B6472", LINE = "E3E6EA",
  MUTED = "9AA1AC", NAVY2 = "2A3342", BG = "F4F5F7", WHITE = "FFFFFF", OTINT = "FDECE6", NTINT = "E8EAF0";
const FONT = "맑은 고딕";

const THEME = {
  name: "JobWave",
  headFontFace: FONT,
  bodyFontFace: FONT,
  colors: {
    dk1: NAVY, lt1: WHITE, dk2: NAVY2, lt2: BG,
    accent1: ORANGE, accent2: NAVY, accent3: GRAY, accent4: MUTED, accent5: "F2A38C", accent6: NAVY2,
    hlink: ORANGE, folHlink: GRAY,
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.theme = { headFontFace: FONT, bodyFontFace: FONT };
pres.title = "충북대학교 외국인 유학생 취업지원 프로그램 제안서";
pres.author = "JobWave";

const W = 13.333, M = 0.6;
const FOOT = "충북대학교 외국인 유학생 취업지원 프로그램";

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: WHITE },
  objects: [
    { text: { text: "JobWave", options: { x: W - M - 2, y: 0.32, w: 2, h: 0.3, fontSize: 12, bold: true, color: NAVY, align: "right", margin: 0 } } },
    { text: { text: FOOT, options: { x: M, y: 7.05, w: 6, h: 0.25, fontSize: 9, color: MUTED, margin: 0 } } },
    { placeholder: { options: { name: "crumb", type: "body", x: M, y: 0.32, w: 8, h: 0.3, fontSize: 11, bold: true, color: ORANGE, margin: 0, valign: "middle" }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.68, w: W - 2 * M, h: 0.62, fontSize: 28, bold: true, color: NAVY, margin: 0, valign: "middle", align: "left" }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: M, y: 1.32, w: W - 2 * M, h: 0.38, fontSize: 14, color: GRAY, margin: 0, valign: "middle" }, text: "" } },
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
async function iconCircle(s, x, y, d, name, bg = ORANGE, fg = WHITE) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg } });
  const p = d * 0.26;
  s.addImage({ data: await icon(name, fg), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
}
function numCircle(s, x, y, d, n, bg = ORANGE, fg = WHITE, fs) {
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
function arrowR(s, x, y, w, color = ORANGE) {
  s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width: 2.25, endArrowType: "triangle" } });
}
function stat(s, x, y, w, h, num, unit, label, fill, numColor, labelColor) {
  card(s, x, y, w, h, fill);
  T(s, [{ text: num, options: { fontSize: 44, bold: true, color: numColor } }, { text: " " + unit, options: { fontSize: 18, bold: true, color: numColor } }], x + 0.3, y + 0.2, w - 0.6, h * 0.55, { valign: "bottom" });
  T(s, label, x + 0.3, y + h * 0.62, w - 0.6, h * 0.3, { fontSize: 13, color: labelColor });
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
  await photo(s, img, 6.2, 0, W - 6.2, 7.5);
  T(s, num, M, 1.5, 4, 1.4, { fontSize: 96, bold: true, color: ORANGE, valign: "bottom" });
  T(s, title, M, 3.0, 6, 0.9, { fontSize: 44, bold: true, color: WHITE, valign: "middle" });
  items.forEach((it, i) => {
    pill(s, it, M, 4.25 + i * 0.5, 3.6, 0.38, NAVY2, "D7DBE2", { fs: 13, bold: false });
  });
  return s;
}

(async () => {
  // ===== 1. 표지 (충북대학교 공식 심볼마크 시그니처 + 캐릭터 CBNU FRIENDS, chungbuk.ac.kr 상징/UI) =====
  section("표지");
  {
    const s = pres.addSlide({ masterName: "DARK", sectionTitle: curSection });
    s.background = { color: WHITE };
    const A = (f) => path.resolve(__dirname, "assets", f);
    // 상단: 충북대 로고(좌) + JobWave(우)
    s.addImage({ path: A("cbnu_logo.png"), x: M, y: 0.55, w: 2.9, h: 2.9 * 245 / 742, altText: "충북대학교 심볼마크 시그니처" });
    T(s, "JobWave", W - M - 2.5, 0.7, 2.5, 0.5, { fontSize: 20, bold: true, color: NAVY, align: "right", valign: "middle" });
    // 왼쪽: 제목
    pill(s, "제안서", M, 2.2, 1.15, 0.42, NAVY, WHITE, { fs: 14 });
    T(s, "2026. 11.", M + 1.3, 2.2, 2, 0.42, { fontSize: 14, color: GRAY, valign: "middle" });
    T(s, "충북대학교\n외국인 유학생\n취업지원 프로그램", M, 2.8, 6.4, 2.3, { fontSize: 40, bold: true, color: NAVY, lineSpacingMultiple: 1.05, valign: "middle" });
    T(s, "공부한 충북에서, 일하는 충북으로", M, 5.25, 6.4, 0.45, { fontSize: 18, color: GRAY, valign: "middle" });
    T(s, "잡웨이브(JobWave)", M, 6.55, 4, 0.4, { fontSize: 15, bold: true, color: NAVY, valign: "middle" });
    // 오른쪽: 캐릭터
    s.addShape(pres.shapes.OVAL, { x: 7.2, y: 1.8, w: 5.5, h: 5.5, fill: { color: BG }, line: { color: BG } });
    const cw = 5.3, ch = cw * 307 / 802;
    s.addImage({ path: A("cbnu_friends.png"), x: 7.3, y: 3.55, w: cw, h: ch, altText: "충북대학교 캐릭터 CBNU FRIENDS" });
  }

  // ===== 2. 핵심 메시지 =====
  {
    const s = pres.addSlide({ masterName: "BLANK", sectionTitle: curSection });
    T(s, "Study in Chungbuk, Work in Korea", M, 0.55, 8, 0.35, { fontSize: 14, bold: true, color: ORANGE });
    T(s, [{ text: "공부한 충북에서,", options: { color: NAVY, breakLine: true } }, { text: "일하는 충북으로", options: { color: ORANGE } }], M, 0.95, 7.4, 1.35, { fontSize: 36, bold: true, valign: "middle" });
    T(s, "충북대에서 공부한 유학생이 충북 기업에서 첫 직장을 갖도록, 진단부터 채용까지 네 단계로 지원합니다.", M, 2.4, 7.4, 0.65, { fontSize: 15, color: GRAY });
    await photo(s, "handshake", 8.45, 0.5, W - M - 8.45, 2.55, 0.4);
    const steps = [
      ["01", "진단", "사전진단 · 취업플랜", "LuSearch"],
      ["02", "역량강화", "심화 특강 · 1:1 멘토링", "LuGraduationCap"],
      ["03", "매칭", "채용정보 사이트 · 인사담당자 상담", "LuHandshake"],
      ["04", "채용", "소규모 잡페어 · 사후관리", "LuBriefcase"],
    ];
    const fills = [BG, NTINT, NAVY, ORANGE];
    const cw = 2.75, gap = 0.33, y = 3.3, h = 3.35;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + gap);
      const dark = i >= 2;
      card(s, x, y, cw, h, fills[i], { shadow: true });
      await iconCircle(s, x + 0.35, y + 0.4, 1.0, steps[i][3], dark ? WHITE : ORANGE, dark ? fills[i] : WHITE);
      T(s, steps[i][0], x + cw - 1.1, y + 0.35, 0.8, 0.5, { fontSize: 22, bold: true, color: dark ? "FFFFFF" : MUTED, align: "right" });
      T(s, steps[i][1], x + 0.35, y + 1.75, cw - 0.6, 0.6, { fontSize: 28, bold: true, color: dark ? WHITE : NAVY });
      T(s, steps[i][2], x + 0.35, y + 2.45, cw - 0.6, 0.8, { fontSize: 14, color: dark ? "E6E8EC" : GRAY });
      if (i < 3) chevron(s, x + cw + 0.06, y + h / 2 - 0.18, 0.22, 0.36, ORANGE);
    }
  }

  // ===== 3. 목차 =====
  {
    const s = pres.addSlide({ masterName: "BLANK", sectionTitle: curSection });
    card(s, 0, 0, 4.2, 7.5, NAVY, { r: 0 });
    T(s, "목차", M, 1.0, 3, 0.9, { fontSize: 40, bold: true, color: WHITE });
    T(s, "Contents", M, 1.9, 3, 0.4, { fontSize: 16, color: ORANGE, bold: true });
    s.addImage({ path: ARC, x: -1.8, y: 3.0, w: 6.0, h: 4.56, transparency: 30 });
    const rows = [
      ["01", "제안 개요", "제안 배경 / 해결 방향 / 프로그램 구성", "LuTarget"],
      ["02", "제안사 소개", "일반현황 / 수행 조직 / 수행실적 / 유사사업", "LuBuilding2"],
      ["03", "프로그램 제안", "특강 / 멘토링 / 채용정보 사이트 / 인사담당자 상담 / 잡페어", "LuLayoutDashboard"],
      ["04", "도입 방식", "구성 옵션 / 추천 조합", "LuListChecks"],
      ["05", "운영 관리", "인력·참여 관리 / 개인정보 보호 / 성과관리·보고", "LuShieldCheck"],
    ];
    const x = 4.8, w = W - x - M, h = 1.0, g = 0.2;
    for (let i = 0; i < 5; i++) {
      const y = 0.75 + i * (h + g);
      card(s, x, y, w, h, BG);
      numCircle(s, x + 0.25, y + 0.15, 0.7, rows[i][0], ORANGE, WHITE, 18);
      T(s, rows[i][1], x + 1.2, y + 0.12, 5, 0.45, { fontSize: 20, bold: true, valign: "middle" });
      T(s, rows[i][2], x + 1.2, y + 0.55, 6.4, 0.35, { fontSize: 13, color: GRAY, valign: "middle" });
      await iconCircle(s, x + w - 0.85, y + 0.2, 0.6, rows[i][3], WHITE, NAVY);
    }
  }

  // ===== 4. 간지 01 =====
  section("01 제안 개요");
  await divider("01", "제안 개요", ["제안 배경", "해결 방향", "프로그램 구성"], "div01");

  // ===== 5. 데이터 =====
  {
    const s = content("01  제안 개요", "유학생 유입은 늘었으나, 국내 취업·정착은 저조", "충북은 유학생 입학 증가율 전국 1위지만, 학사 졸업 유학생 10명 중 7명은 졸업 후 출국");
    const y = 1.95, h = 4.65, w = 3.85, g = 0.3;
    // 카드 1: 신규 입학자 차트
    let x = M;
    card(s, x, y, w, h, BG);
    T(s, "유학생 신규 입학자", x + 0.3, y + 0.25, w - 0.6, 0.35, { fontSize: 15, bold: true });
    s.addChart(pres.charts.BAR, [{ name: "입학", labels: ["2019", "2025"], values: [66915, 117333] }], {
      x: x + 0.2, y: y + 0.65, w: w - 0.4, h: 2.75, barDir: "col", chartColors: ["9AA1AC", ORANGE], barGapWidthPct: 60,
      showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 13, dataLabelFontBold: true, dataLabelColor: NAVY, dataLabelFormatCode: "#,##0",
      catAxisLabelColor: GRAY, catAxisLabelFontSize: 13, valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
      showLegend: false, catAxisLineShow: false, dataLabelFontFace: "+mn-lt", catAxisLabelFontFace: "+mn-lt", valAxisMaxVal: 140000,
    });
    // pptxgenjs: invertedColors 대신 단일 시리즈 다색 처리
    T(s, [{ text: "+75.3%", options: { fontSize: 36, bold: true, color: ORANGE } }, { text: "  2019년 대비", options: { fontSize: 13, color: GRAY } }], x + 0.3, y + 3.55, w - 0.6, 0.8, { valign: "middle" });

    // 카드 2: 414.7%
    x += w + g;
    card(s, x, y, w, h, NAVY);
    T(s, "충북 유학생 입학 증가율", x + 0.3, y + 0.25, w - 0.6, 0.35, { fontSize: 15, bold: true, color: WHITE });
    T(s, "414.7%", x + 0.3, y + 0.65, w - 0.6, 1.0, { fontSize: 60, bold: true, color: ORANGE, valign: "middle" });
    pill(s, "전국 시도 중 1위", x + 0.3, y + 1.75, 1.9, 0.38, ORANGE, WHITE, { fs: 12 });
    T(s, "2019년 대비 2025년", x + 2.3, y + 1.75, 1.4, 0.38, { fontSize: 12, color: "C9CED6", valign: "middle" });
    const reg = [["충북", 414.7], ["경북", 305.2], ["전남", 254], ["경기", 140.3]];
    reg.forEach(([n, v], i) => {
      const ry = y + 2.45 + i * 0.5;
      T(s, n, x + 0.3, ry, 0.6, 0.35, { fontSize: 13, bold: true, color: WHITE, valign: "middle" });
      const bw = 1.9 * v / 414.7;
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.95, y: ry + 0.07, w: 1.9, h: 0.22, fill: { color: NAVY2 }, line: { color: NAVY2 } });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.95, y: ry + 0.07, w: bw, h: 0.22, fill: { color: i === 0 ? ORANGE : "7A8392" }, line: { color: i === 0 ? ORANGE : "7A8392" } });
      T(s, (v === 254 ? "254" : v.toFixed(1)) + "%", x + 2.95, ry, 0.75, 0.35, { fontSize: 12, color: i === 0 ? ORANGE : "C9CED6", bold: i === 0, valign: "middle", align: "right" });
    });

    // 카드 3: 10명 중 7명
    x += w + g;
    card(s, x, y, w, h, OTINT);
    T(s, "졸업 후 출국 비율", x + 0.3, y + 0.25, w - 0.6, 0.35, { fontSize: 15, bold: true });
    T(s, [{ text: "10명 중 ", options: { fontSize: 20, color: NAVY, bold: true } }, { text: "7명", options: { fontSize: 36, color: ORANGE, bold: true } }, { text: " 출국", options: { fontSize: 20, color: NAVY, bold: true } }], x + 0.3, y + 0.65, w - 0.6, 0.75, { valign: "middle" });
    for (let i = 0; i < 10; i++) {
      const px = x + 0.3 + (i % 5) * 0.66, py = y + 1.5 + Math.floor(i / 5) * 0.62;
      s.addImage({ data: await icon("LuUser", i < 7 ? ORANGE : MUTED), x: px, y: py, w: 0.52, h: 0.52 });
    }
    [["학사", 71.8], ["석사", 71.3], ["박사", 81.3]].forEach(([n, v], i) => {
      const ry = y + 2.9 + i * 0.5;
      T(s, n, x + 0.3, ry, 0.6, 0.35, { fontSize: 13, bold: true, valign: "middle" });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.95, y: ry + 0.07, w: 2.0, h: 0.22, fill: { color: WHITE }, line: { color: WHITE } });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.95, y: ry + 0.07, w: 2.0 * v / 100, h: 0.22, fill: { color: i === 0 ? ORANGE : NAVY }, line: { color: i === 0 ? ORANGE : NAVY } });
      T(s, v + "%", x + 3.0, ry, 0.6, 0.35, { fontSize: 12, bold: true, color: i === 0 ? ORANGE : NAVY, valign: "middle", align: "right" });
    });
    T(s, "출처: 법무부 출입국·외국인정책본부 「외국인 유학생 체류·정주 현황 분석」(2026. 9. 4.)   |   충북대 유학생 현황: 확인 후 추가", M, 6.7, 12, 0.28, { fontSize: 10, color: MUTED });
  }

  // ===== 6. 세 가지 지원 축 =====
  {
    const s = content("01  제안 개요", "학생 애로사항별 세 가지 지원 축", "비자·채용 정보 부족, 한국식 서류·면접 경험 부족, 채용 기업 접점 부족에 각각 대응");
    T(s, "유학생 애로사항", M, 1.95, 5, 0.35, { fontSize: 13, bold: true, color: GRAY });
    T(s, "지원 축", 7.2, 1.95, 5, 0.35, { fontSize: 13, bold: true, color: ORANGE });
    const rows = [
      ["비자·채용 정보 부족", "E-7·F-2-R 요건과 유학생 채용 기업을 알기 어려움", "LuCircleHelp", "정보", "채용정보 사이트 · 특강 1~3강", "LuInfo"],
      ["서류·면접 경험 부족", "한국식 자기소개서와 면접 방식이 낯섦", "LuFileText", "역량", "특강 4~8강 · 1:1 멘토링", "LuTrendingUp"],
      ["채용 기업 접점 부족", "유학생을 뽑으려는 기업을 만날 기회가 없음", "LuHandshake", "연결", "인사담당자 상담 · 소규모 잡페어", "LuLink"],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 2.4 + i * 1.45, h = 1.25;
      card(s, M, y, 5.8, h, BG);
      await iconCircle(s, M + 0.3, y + 0.25, 0.75, rows[i][2], WHITE, GRAY);
      T(s, rows[i][0], M + 1.3, y + 0.2, 4.3, 0.45, { fontSize: 18, bold: true, valign: "middle" });
      T(s, rows[i][1], M + 1.3, y + 0.68, 4.3, 0.4, { fontSize: 13, color: GRAY, valign: "middle" });
      chevron(s, 6.6, y + 0.4, 0.35, 0.45, ORANGE);
      const fill = i === 2 ? ORANGE : NAVY;
      card(s, 7.2, y, W - M - 7.2, h, fill, { shadow: true });
      await iconCircle(s, 7.5, y + 0.25, 0.75, rows[i][5], WHITE, fill);
      T(s, rows[i][3], 8.45, y + 0.15, 1.2, h - 0.3, { fontSize: 30, bold: true, color: WHITE, valign: "middle" });
      T(s, rows[i][4], 9.6, y + 0.15, 3.1, h - 0.3, { fontSize: 15, bold: true, color: WHITE, valign: "middle" });
    }
  }

  // ===== 7. 허브 =====
  {
    const s = content("01  제안 개요", "채용정보 사이트를 중심으로 연결되는 5개 프로그램", "각 프로그램의 참여 기록이 사이트에 쌓여, 다음 단계 신청과 기업 매칭에 쓰입니다");
    const cx = W / 2, cy = 4.15, R = 1.25;
    const items = [
      ["01", "취업 특강", "8강 심화 커리큘럼", "LuPresentation", M, 2.05],
      ["04", "인사담당자 상담", "외국인 채용 담당자 소그룹 상담", "LuMessagesSquare", W - M - 3.9, 2.05],
      ["02", "1:1 멘토링", "1인 1시간 전문멘토 지도", "LuUsers", M, 4.55],
      ["05", "소규모 잡페어", "5개사 사전매칭 현장면접", "LuBuilding2", W - M - 3.9, 4.55],
    ];
    // 연결선
    items.forEach(([, , , , x, y]) => {
      const ex = x < cx ? x + 3.9 : x, ey = y + 0.9;
      s.addShape(pres.shapes.LINE, { x: Math.min(ex, cx), y: Math.min(ey, cy), w: Math.abs(cx - ex), h: Math.abs(cy - ey), line: { color: "C9CED6", width: 2, dashType: "dash" }, flipH: (ex < cx) !== (ey < cy) ? true : false });
    });
    s.addShape(pres.shapes.OVAL, { x: cx - R - 0.25, y: cy - R - 0.25, w: 2 * R + 0.5, h: 2 * R + 0.5, fill: { color: OTINT }, line: { color: OTINT } });
    s.addShape(pres.shapes.OVAL, { x: cx - R, y: cy - R, w: 2 * R, h: 2 * R, fill: { color: NAVY }, line: { color: NAVY } });
    T(s, "03", cx - R, cy - 0.85, 2 * R, 0.35, { fontSize: 14, bold: true, color: ORANGE, align: "center" });
    T(s, "채용정보\n사이트", cx - R, cy - 0.5, 2 * R, 1.0, { fontSize: 22, bold: true, color: WHITE, align: "center", valign: "middle" });
    for (const [n, t, d, ic, x, y] of items) {
      card(s, x, y, 3.9, 1.8, BG, { shadow: true });
      await iconCircle(s, x + 0.3, y + 0.3, 0.8, ic);
      T(s, n, x + 1.3, y + 0.28, 1, 0.3, { fontSize: 13, bold: true, color: ORANGE });
      T(s, t, x + 1.3, y + 0.58, 2.5, 0.5, { fontSize: 20, bold: true, valign: "middle" });
      T(s, d, x + 1.3, y + 1.1, 2.5, 0.5, { fontSize: 13, color: GRAY });
    }
    const chips = ["공고", "예약", "이력서", "매칭", "성과"];
    chips.forEach((c, i) => pill(s, c, cx - 2.35 + i * 0.96, 6.25, 0.86, 0.38, ORANGE, WHITE, { fs: 12 }));
  }

  // ===== 8. 간지 02 =====
  section("02 제안사 소개");
  await divider("02", "제안사 소개", ["일반현황", "수행 조직", "수행실적", "유사사업"], "div02");

  // ===== 9. 회사 일반현황 =====
  {
    const s = content("02  제안사 소개", "회사 일반현황", "대학·공공기관 취업지원 프로그램 기획·운영");
    const rows = [["회사명", "잡웨이브(JobWave)"], ["대표자", "확인 필요"], ["설립일", "확인 필요"], ["사업자등록번호", "확인 필요"], ["소재지", "확인 필요"], ["홈페이지", "jobwave.kr"], ["연락처", "확인 필요"]];
    const data = [[{ text: "항목", options: { bold: true, color: WHITE, fill: { color: NAVY } } }, { text: "내용", options: { bold: true, color: WHITE, fill: { color: NAVY } } }]];
    rows.forEach((r) => data.push([{ text: r[0], options: { bold: true, fill: { color: BG } } }, { text: r[1], options: { color: r[1] === "확인 필요" ? MUTED : NAVY, bold: r[1] !== "확인 필요" } }]));
    s.addTable(data, { x: M, y: 2.0, w: 5.6, colW: [1.9, 3.7], rowH: 0.56, fontSize: 14, color: NAVY, fontFace: FONT, border: { type: "solid", pt: 0.75, color: LINE }, valign: "middle", margin: [0, 0.15, 0, 0.2] });
    T(s, "주요 사업분야", 6.75, 1.95, 4, 0.35, { fontSize: 15, bold: true });
    const biz = [["잡페어·채용박람회", "대학·지자체 채용행사", "LuTrophy"], ["대학 취업 프로그램", "취업캠프·특강·공모전", "LuGraduationCap"], ["유학생 취업지원", "K-유학생 취업캠프", "LuGlobe"], ["운영 웹 플랫폼", "사전진단·등록·예약", "LuMonitor"]];
    const bw = 2.85, bh = 2.0;
    for (let i = 0; i < 4; i++) {
      const x = 6.75 + (i % 2) * (bw + 0.28), y = 2.4 + Math.floor(i / 2) * (bh + 0.25);
      const fill = i === 2 ? ORANGE : BG, dark = i === 2;
      card(s, x, y, bw, bh, fill, { shadow: true });
      await iconCircle(s, x + 0.3, y + 0.3, 0.8, biz[i][2], dark ? WHITE : ORANGE, dark ? ORANGE : WHITE);
      T(s, biz[i][0], x + 0.3, y + 1.2, bw - 0.5, 0.4, { fontSize: 17, bold: true, color: dark ? WHITE : NAVY });
      T(s, biz[i][1], x + 0.3, y + 1.57, bw - 0.5, 0.35, { fontSize: 13, color: dark ? WHITE : GRAY });
    }
  }

  // ===== 10. 수행 조직 =====
  {
    const s = content("02  제안사 소개", "사업 수행 조직", "총괄 책임자 아래 4개 팀이 프로그램별로 전담");
    const tx = W / 2 - 1.9;
    card(s, tx, 1.95, 3.8, 1.0, NAVY, { shadow: true });
    T(s, "사업 총괄 책임자", tx, 2.05, 3.8, 0.45, { fontSize: 18, bold: true, color: WHITE, align: "center", valign: "middle" });
    T(s, "성명·직급 확인 필요", tx, 2.48, 3.8, 0.35, { fontSize: 12, color: "C9CED6", align: "center", valign: "middle" });
    card(s, W - M - 2.9, 2.1, 2.9, 0.7, WHITE, { line: ORANGE, lineW: 1.5 });
    T(s, [{ text: "발주처  ", options: { color: GRAY } }, { text: "충북대학교", options: { color: ORANGE, bold: true } }], W - M - 2.9, 2.1, 2.9, 0.7, { fontSize: 15, align: "center", valign: "middle" });
    s.addShape(pres.shapes.LINE, { x: tx + 3.8, y: 2.45, w: W - M - 2.9 - tx - 3.8, h: 0, line: { color: ORANGE, width: 1.5, dashType: "dash" } });
    const teams = [
      ["기획·운영팀", ["일정·모집 관리", "현장 운영", "발주처 소통"], "LuClipboardList"],
      ["교육·멘토링팀", ["강사·멘토 섭외", "커리큘럼 관리", "만족도 조사"], "LuPresentation"],
      ["플랫폼팀", ["사이트 구축·운영", "예약·데이터 관리", "대학 이관"], "LuMonitor"],
      ["기업협력팀", ["인사담당자 섭외", "참여기업 발굴", "매칭·결과 추적"], "LuHandshake"],
    ];
    const cw = 2.85, g = (W - 2 * M - 4 * cw) / 3, y = 3.65;
    s.addShape(pres.shapes.LINE, { x: W / 2, y: 2.95, w: 0, h: 0.35, line: { color: NAVY, width: 1.5 } });
    s.addShape(pres.shapes.LINE, { x: M + cw / 2, y: 3.3, w: 3 * (cw + g), h: 0, line: { color: NAVY, width: 1.5 } });
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + g);
      s.addShape(pres.shapes.LINE, { x: x + cw / 2, y: 3.3, w: 0, h: 0.35, line: { color: NAVY, width: 1.5 } });
      card(s, x, y, cw, 2.95, BG, { shadow: true });
      await iconCircle(s, x + cw / 2 - 0.42, y + 0.25, 0.84, teams[i][2]);
      T(s, teams[i][0], x, y + 1.18, cw, 0.45, { fontSize: 18, bold: true, align: "center", valign: "middle" });
      T(s, teams[i][1].map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < 2 } })), x + 0.45, y + 1.75, cw - 0.7, 1.05, { fontSize: 14, color: NAVY2, paraSpaceAfter: 3 });
    }
    T(s, "팀별 담당자 성명·직급은 확인 후 기재", M, 6.72, 6, 0.28, { fontSize: 11, color: MUTED });
  }

  // ===== 11. 수행실적 =====
  {
    const s = content("02  제안사 소개", "대학 취업지원 분야 수행실적", "2026년 수행 사업 (실적 명의·연도 확인 후 확정)");
    const st = [["8", "건", "2026년 수행 사업", NAVY, WHITE, "C9CED6", "LuClipboardCheck"], ["6", "개", "발주 대학", BG, NAVY, GRAY, "LuSchool"], ["1", "건", "유학생 대상 사업", ORANGE, WHITE, WHITE, "LuGlobe"]];
    const sw = 3.0, sh = 1.4;
    for (let i = 0; i < 3; i++) {
      const y = 2.0 + i * (sh + 0.2);
      card(s, M, y, sw, sh, st[i][3], { shadow: true });
      T(s, [{ text: st[i][0], options: { fontSize: 44, bold: true } }, { text: " " + st[i][1], options: { fontSize: 18, bold: true } }], M + 0.3, y + 0.12, 1.9, 0.8, { color: st[i][4], valign: "bottom" });
      T(s, st[i][2], M + 0.3, y + 0.93, 2.4, 0.35, { fontSize: 13, color: st[i][5] });
      s.addImage({ data: await icon(st[i][6], st[i][4] === WHITE ? WHITE : ORANGE), x: M + sw - 0.85, y: y + 0.3, w: 0.55, h: 0.55, transparency: 0 });
    }
    const rows = [
      ["1", "2026", "K-유학생 취업캠프 (RISE 연계)", "한국교통대학교"],
      ["2", "2026", "충청북도 지역청년 직무박람회", "건국대학교 글로컬캠퍼스"],
      ["3", "2026", "KU 커리어 공모전 11기", "건국대학교 글로컬캠퍼스"],
      ["4", "2026", "반도체 부트캠프 잡페어", "경기과학기술대학교"],
      ["5", "2026", "한성 JOB 톡톡 현직자 취업 특강", "한성대학교"],
      ["6", "2026", "기업분석 공모전", "한성대학교"],
      ["7", "2026", "SK하이닉스 토의면접 대비 특강", "인하대학교"],
      ["8", "2026", "JOB FIESTA", "서경대학교"],
    ];
    const hd = (t) => ({ text: t, options: { bold: true, color: WHITE, fill: { color: NAVY } } });
    const data = [[hd("No"), hd("연도"), hd("사업명"), hd("발주처")]];
    rows.forEach((r, i) => {
      const hl = i === 0;
      const o = hl ? { fill: { color: OTINT }, bold: true, color: ORANGE } : { fill: { color: i % 2 ? BG : WHITE } };
      data.push(r.map((c, k) => ({ text: hl && k === 2 ? c + "  ★ 유학생" : c, options: { ...o, align: k < 2 ? "center" : "left" } })));
    });
    s.addTable(data, { x: 3.9, y: 2.0, w: W - M - 3.9, colW: [0.6, 0.9, 4.4, 2.93], rowH: 0.5, fontSize: 13, color: NAVY, fontFace: FONT, border: { type: "solid", pt: 0.5, color: LINE }, valign: "middle", margin: [0, 0.12, 0, 0.12] });
  }

  // ===== 12. 유사사업 =====
  {
    const s = content("02  제안사 소개", "유사사업: 한국교통대학교 K-유학생 취업캠프", "충북 RISE 「충북형 K-유학생 유치 및 정주 지원」 연계, 사전진단부터 모의면접까지 직접 운영");
    const st = [
      ["01", "사전진단", "camp.jobwave.kr로\n진단·취업인식 조사", "LuSearch"],
      ["02", "1박 2일 캠프", "외국인 유학생 대상\n집중 프로그램", "LuCalendarDays"],
      ["03", "멘토링", "워크시트·\n취업플랜 작성", "LuUsers"],
      ["04", "모의면접", "평가표 기반\n피드백", "LuMic"],
      ["05", "통역", "중국어·영어\n통역 운영", "LuLanguages"],
    ];
    const cw = 2.15, g = (W - 2 * M - 5 * cw) / 4, y = 2.05, h = 2.75;
    for (let i = 0; i < 5; i++) {
      const x = M + i * (cw + g);
      card(s, x, y, cw, h, BG, { shadow: true });
      await iconCircle(s, x + cw / 2 - 0.45, y + 0.3, 0.9, st[i][3], i === 0 ? ORANGE : NAVY);
      T(s, st[i][0], x, y + 1.3, cw, 0.3, { fontSize: 12, bold: true, color: ORANGE, align: "center" });
      T(s, st[i][1], x, y + 1.58, cw, 0.42, { fontSize: 17, bold: true, align: "center", valign: "middle" });
      T(s, st[i][2], x + 0.1, y + 2.03, cw - 0.2, 0.62, { fontSize: 12, color: GRAY, align: "center" });
      if (i < 4) chevron(s, x + cw + g / 2 - 0.08, y + h / 2 - 0.15, 0.16, 0.3, ORANGE);
    }
    card(s, M, 5.15, W - 2 * M, 1.55, NAVY);
    await iconCircle(s, M + 0.35, 5.5, 0.85, "LuArrowRight", ORANGE);
    T(s, "충북대 사업에 적용", M + 1.5, 5.32, 6, 0.4, { fontSize: 16, bold: true, color: ORANGE, valign: "middle" });
    T(s, "캠프용 진단 플랫폼(camp.jobwave.kr)을 채용정보 사이트로 확장하고, 캠프에서 쓴 멘토링 워크시트와 모의면접 평가표를 1:1 멘토링 교재로 사용합니다.", M + 1.5, 5.75, W - 2 * M - 1.8, 0.8, { fontSize: 15, color: WHITE, valign: "middle" });
  }

  // ===== 13. 간지 03 =====
  section("03 프로그램 제안");
  await divider("03", "프로그램 제안", ["01  취업 특강", "02  1:1 멘토링", "03  맞춤 채용정보 사이트", "04  인사담당자 상담", "05  소규모 잡페어"], "div03");

  // ===== 14. 특강 개요 =====
  const C1 = "03  프로그램 제안  /  01 취업 특강";
  {
    const s = content(C1, "취업 특강 개요", "비자, 서류, 면접, 입사까지 4단계 8강. 강의마다 실습 결과물 작성");
    const rows = [["목적", "한국 취업 과정 단계별 심화 학습", "LuTarget"], ["대상", "한국 취업 희망 유학생 (학부·대학원)", "LuUsers"], ["운영", "회당 2시간 내외 대면 강의 (협의 후 확정)", "LuClock"], ["이수 혜택", "6강 이상 이수 시 잡페어 사전매칭, 멘토링 우선 예약", "LuGift"]];
    for (let i = 0; i < 4; i++) {
      const y = 2.0 + i * 1.18, x = M, w = 6.6;
      card(s, x, y, w, 1.02, i === 3 ? OTINT : BG);
      await iconCircle(s, x + 0.22, y + 0.16, 0.7, rows[i][2], i === 3 ? ORANGE : NAVY);
      T(s, rows[i][0], x + 1.1, y + 0.1, 1.4, 0.82, { fontSize: 16, bold: true, color: i === 3 ? ORANGE : NAVY, valign: "middle" });
      T(s, rows[i][1], x + 2.4, y + 0.1, w - 2.6, 0.82, { fontSize: 14, valign: "middle" });
    }
    const x0 = 7.6, ow = (W - M - x0 - 0.25) / 2;
    T(s, "구성 옵션", x0, 1.95, 3, 0.35, { fontSize: 14, bold: true, color: GRAY });
    card(s, x0, 2.35, ow, 2.1, BG, { shadow: true });
    T(s, "기본형", x0 + 0.3, 2.5, ow - 0.6, 0.35, { fontSize: 14, bold: true, color: GRAY });
    T(s, [{ text: "4", options: { fontSize: 60, bold: true } }, { text: " 강", options: { fontSize: 20, bold: true } }], x0 + 0.3, 2.85, ow - 0.6, 1.0, { valign: "bottom" });
    T(s, "1·2·4·6강", x0 + 0.3, 3.92, ow - 0.6, 0.35, { fontSize: 13, color: GRAY });
    const x1 = x0 + ow + 0.25;
    card(s, x1, 2.35, ow, 2.1, ORANGE, { shadow: true });
    T(s, "확장형", x1 + 0.3, 2.5, ow - 0.6, 0.35, { fontSize: 14, bold: true, color: WHITE });
    T(s, [{ text: "8", options: { fontSize: 60, bold: true } }, { text: " 강", options: { fontSize: 20, bold: true } }], x1 + 0.3, 2.85, ow - 0.6, 1.0, { valign: "bottom", color: WHITE });
    T(s, "전체 과정", x1 + 0.3, 3.92, ow - 0.6, 0.35, { fontSize: 13, color: WHITE });
    T(s, "언어", x0, 4.7, 3, 0.35, { fontSize: 14, bold: true, color: GRAY });
    const lang = [["한국어 진행", "기본 (TOPIK 4급 이상 권장)", NAVY], ["영어 가능 강사", "강의 단가 소폭 증가", ORANGE], ["통역", "별도 예산 (언어·시간 단위 견적)", ORANGE]];
    lang.forEach(([a, b, c], i) => {
      const y = 5.1 + i * 0.55;
      pill(s, a, x0, y, 1.75, 0.42, i === 0 ? NAVY : WHITE, i === 0 ? WHITE : NAVY, { fs: 12, line: i === 0 ? NAVY : "C9CED6" });
      T(s, b, x0 + 1.95, y, W - M - x0 - 1.95, 0.42, { fontSize: 13, color: c, valign: "middle" });
    });
  }

  // ===== 15. 커리큘럼 =====
  {
    const s = content(C1, "단계별 8강 커리큘럼", "기본형은 표시된 4강(1·2·4·6강), 확장형은 8강 전체 운영 · 세부 내용과 강사는 협의 후 확정");
    const cols = [
      ["STEP 01", "전략", [["1강", true, "채용 구조 해부", "공채·수시 채용, 외국인 전형", "지원 경로 맵"], ["2강", true, "비자 연계 취업전략", "D-10·E-7·F-2-R 요건", "비자 로드맵"], ["3강", false, "직무 분석·타겟 기업", "충북 주력산업 수요 직무", "타겟 기업 10곳"]]],
      ["STEP 02", "서류", [["4강", true, "한국형 자기소개서", "STAR 작성, 지원동기 논리", "자소서 초안"], ["5강", false, "AI 역량검사·인적성", "게임형 검사, 한국어 독해", "진단 리포트"]]],
      ["STEP 03", "면접", [["6강", true, "면접 심화", "인성·직무·PT·토론 면접", "모의면접 평가표"], ["7강", false, "실전 모의면접", "인사담당자 참여 평가", "개별 피드백"]]],
      ["STEP 04", "정착", [["8강", false, "근로계약·직장생활", "계약서, 4대보험, 체류자격", "입사 전 체크리스트"]]],
    ];
    const cw = 2.85, g = (W - 2 * M - 4 * cw) / 3;
    const hdFill = [NTINT, "C9CED6", NAVY2, NAVY];
    for (let c = 0; c < 4; c++) {
      const x = M + c * (cw + g);
      const dark = c >= 2;
      card(s, x, 1.9, cw, 0.72, hdFill[c]);
      T(s, cols[c][0], x + 0.25, 1.9, 1.2, 0.72, { fontSize: 12, bold: true, color: ORANGE, valign: "middle" });
      T(s, cols[c][1], x + 1.25, 1.9, cw - 1.45, 0.72, { fontSize: 22, bold: true, color: dark ? WHITE : NAVY, valign: "middle", align: "right" });
      cols[c][2].forEach((L, k) => {
        const y = 2.75 + k * 1.37, h = 1.25;
        card(s, x, y, cw, h, L[1] ? OTINT : BG, { line: L[1] ? "F6C3B2" : BG });
        T(s, L[0], x + 0.18, y + 0.1, 0.8, 0.3, { fontSize: 12, bold: true, color: GRAY });
        if (L[1]) pill(s, "기본", x + cw - 0.8, y + 0.1, 0.62, 0.28, ORANGE, WHITE, { fs: 10 });
        T(s, L[2], x + 0.18, y + 0.38, cw - 0.3, 0.32, { fontSize: 14, bold: true });
        T(s, L[3], x + 0.18, y + 0.68, cw - 0.3, 0.25, { fontSize: 10.5, color: GRAY });
        T(s, "→ " + L[4], x + 0.18, y + 0.92, cw - 0.3, 0.26, { fontSize: 11, bold: true, color: ORANGE });
      });
    }
  }

  // ===== 16. 결과물 연계 =====
  {
    const s = content(C1, "특강 결과물의 후속 프로그램 연계", "강의 중 작성한 결과물을 멘토링 첨삭과 잡페어 지원 서류로 사용");
    const fl = [["강의", "채용 정보·개념"], ["실습", "현장 작성·응시"], ["저장", "개인별 사이트 저장"], ["멘토링", "결과물 기반 첨삭"], ["잡페어", "지원 서류로 활용"]];
    const cw = 2.45, ov = 0.2;
    const fills = ["C9CED6", "9AA1AC", NAVY2, NAVY, ORANGE];
    fl.forEach(([a, b], i) => {
      const x = M + i * (cw - ov + 0.05);
      s.addShape(i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x, y: 1.95, w: cw, h: 1.15, fill: { color: fills[i] }, line: { color: WHITE, width: 2 } });
      const tc = i < 2 ? NAVY : WHITE;
      T(s, a, x + 0.3, 2.03, cw - 0.6, 0.5, { fontSize: 19, bold: true, color: tc, align: "center", valign: "middle" });
      T(s, b, x + 0.3, 2.5, cw - 0.6, 0.45, { fontSize: 12, color: tc, align: "center", valign: "middle" });
    });
    T(s, "학생별 결과물 7종", M, 3.4, 5, 0.38, { fontSize: 16, bold: true });
    const it = [["01", "지원 경로 맵", "LuRoute"], ["02", "비자 로드맵", "LuPlane"], ["03", "타겟 기업 10곳", "LuTarget"], ["04", "자소서 초안", "LuPenLine"], ["05", "역량검사 진단 리포트", "LuChartBar"], ["06", "모의면접 평가표", "LuClipboardCheck"], ["07", "입사 전 체크리스트", "LuListChecks"]];
    const gw = 2.85, gg = (W - 2 * M - 4 * gw) / 3, gh = 1.3;
    for (let i = 0; i < 7; i++) {
      const x = M + (i % 4) * (gw + gg), y = 3.9 + Math.floor(i / 4) * (gh + 0.2);
      const hl = i === 3 || i === 5;
      card(s, x, y, gw, gh, hl ? OTINT : BG);
      await iconCircle(s, x + 0.25, y + 0.3, 0.7, it[i][2], hl ? ORANGE : NAVY);
      T(s, it[i][0], x + 1.1, y + 0.25, 1, 0.3, { fontSize: 12, bold: true, color: ORANGE });
      T(s, it[i][1], x + 1.1, y + 0.55, gw - 1.2, 0.5, { fontSize: 15, bold: true, valign: "middle" });
    }
    const x = M + 3 * (gw + gg), y = 3.9 + gh + 0.2;
    card(s, x, y, gw, gh, ORANGE, { shadow: true });
    T(s, "자소서 초안과 평가표는\n멘토링 2·3회차 교재로\n그대로 사용", x + 0.25, y + 0.1, gw - 0.5, gh - 0.2, { fontSize: 13, bold: true, color: WHITE, valign: "middle" });
  }

  // ===== 17. 멘토링 운영 방식 =====
  const C2 = "03  프로그램 제안  /  02 1:1 멘토링";
  {
    const s = content(C2, "1:1 멘토링 운영 방식", "오프라인·온라인 모두 전문멘토 1명이 학생 1인당 1시간, 하루 최대 7명을 지도합니다");
    const sw = (7.6 - 0.6) / 3;
    await photo(s, "mentoring", M + 7.6 + 0.3, 1.95, W - 2 * M - 7.9, 1.45, 0.35);
    stat(s, M, 1.95, sw, 1.45, "1", "명", "전문멘토", BG, NAVY, GRAY);
    stat(s, M + sw + 0.3, 1.95, sw, 1.45, "1", "시간", "학생 1인당", BG, NAVY, GRAY);
    stat(s, M + 2 * (sw + 0.3), 1.95, sw, 1.45, "7", "명", "하루 최대", ORANGE, WHITE, WHITE);
    const mw = (W - 2 * M - 0.3) / 2;
    const mo = [["오프라인", "충북대 교내 상담 공간 (대학 협조)", ["표정·태도까지 보는 대면 피드백", "서류 출력본 첨삭"], "LuBuilding", NAVY], ["온라인", "Zoom 화상 멘토링", ["시험 기간·원거리에도 참여", "화면 공유로 서류 동시 첨삭"], "LuVideo", ORANGE]];
    for (let i = 0; i < 2; i++) {
      const x = M + i * (mw + 0.3), y = 3.65, h = 2.2;
      card(s, x, y, mw, h, BG, { shadow: true });
      await iconCircle(s, x + 0.35, y + 0.35, 1.0, mo[i][3], mo[i][4]);
      T(s, mo[i][0], x + 1.6, y + 0.3, 4, 0.5, { fontSize: 22, bold: true, valign: "middle" });
      T(s, mo[i][1], x + 1.6, y + 0.8, mw - 1.8, 0.35, { fontSize: 13, color: GRAY, valign: "middle" });
      T(s, mo[i][2].map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < 1 } })), x + 1.6, y + 1.3, mw - 1.8, 0.8, { fontSize: 14, paraSpaceAfter: 4 });
    }
    card(s, M, 6.1, W - 2 * M, 0.75, NAVY);
    T(s, "구성 옵션", M + 0.3, 6.1, 1.3, 0.75, { fontSize: 14, bold: true, color: ORANGE, valign: "middle" });
    pill(s, "기본형", M + 1.65, 6.28, 0.95, 0.38, WHITE, NAVY, { fs: 12 });
    T(s, "오프라인, 1인 2회 (진단·서류)", M + 2.75, 6.1, 3.3, 0.75, { fontSize: 13, color: WHITE, valign: "middle" });
    pill(s, "확장형", M + 6.2, 6.28, 0.95, 0.38, ORANGE, WHITE, { fs: 12 });
    T(s, "오프라인과 온라인, 1인 3회 (진단·서류·모의면접)", M + 7.3, 6.1, 4.8, 0.75, { fontSize: 13, color: WHITE, valign: "middle" });
  }

  // ===== 18. 회차별 =====
  {
    const s = content(C2, "회차별 멘토링 구성", "진단, 서류, 모의면접 3회차. 회차마다 산출물 제공 (기본형은 1·2회차)");
    const ss = [
      ["1", "1회차", "진단·목표 설정", ["사전진단 결과 해석", "비자 경로·타겟 직무 확정", "개인 취업플랜 작성"], "취업플랜", BG, NAVY, "LuSearch"],
      ["2", "2회차", "서류 클리닉", ["특강 자소서 초안 첨삭", "한국형 이력서 완성", "2회 수정까지 지원"], "최종 서류", BG, NAVY, "LuFileText"],
      ["3", "3회차", "실전 모의면접", ["예상 질문 기반 면접", "영상 녹화 후 복기", "질문별 개선 포인트"], "피드백 리포트", NAVY, WHITE, "LuMic"],
    ];
    const cw = (W - 2 * M - 0.8) / 3, y = 1.95, h = 4.85;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.4);
      const [n, lab, t, bl, out, fill, tc, ic] = ss[i];
      card(s, x, y, cw, h, fill, { shadow: true });
      T(s, n, x + 0.3, y + 0.1, 1.2, 1.3, { fontSize: 80, bold: true, color: i === 2 ? ORANGE : "C9CED6", valign: "middle" });
      await iconCircle(s, x + cw - 1.1, y + 0.35, 0.8, ic, i === 2 ? ORANGE : NAVY);
      T(s, lab, x + 0.35, y + 1.45, 2, 0.3, { fontSize: 13, bold: true, color: ORANGE });
      T(s, t, x + 0.35, y + 1.75, cw - 0.6, 0.5, { fontSize: 22, bold: true, color: tc, valign: "middle" });
      T(s, bl.map((b, k) => ({ text: b, options: { bullet: true, breakLine: k < 2 } })), x + 0.35, y + 2.45, cw - 0.6, 1.3, { fontSize: 14, color: i === 2 ? "E6E8EC" : NAVY2, paraSpaceAfter: 6 });
      card(s, x + 0.3, y + h - 0.95, cw - 0.6, 0.65, i === 2 ? ORANGE : WHITE, { r: 0.1 });
      T(s, [{ text: "산출물   ", options: { fontSize: 12, color: i === 2 ? WHITE : GRAY } }, { text: out, options: { fontSize: 16, bold: true, color: i === 2 ? WHITE : NAVY } }], x + 0.5, y + h - 0.95, cw - 1, 0.65, { valign: "middle" });
      if (i < 2) chevron(s, x + cw + 0.1, y + h / 2 - 0.15, 0.2, 0.3, ORANGE);
    }
  }

  // ===== 19. 예약·운영일수 =====
  {
    const s = content(C2, "예약·운영 관리와 운영일수 산정", "사이트 예약과 대기자 자동 배정으로 멘토의 하루 정원(7명)을 채워 운영");
    const fl = [["시간 슬롯 예약", "LuCalendarCheck"], ["전일·당일 알림", "LuBell"], ["멘토링 진행", "LuUserCheck"], ["결과 리포트 저장", "LuFolderOpen"]];
    const lw = 7.4, step = lw / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * step;
      card(s, x + 0.05, 2.0, step - 0.25, 2.0, BG);
      await iconCircle(s, x + (step - 0.2) / 2 - 0.4, 2.25, 0.8, fl[i][1], i === 3 ? ORANGE : NAVY);
      T(s, fl[i][0], x + 0.1, 3.2, step - 0.35, 0.6, { fontSize: 14, bold: true, align: "center", valign: "middle" });
      if (i < 3) chevron(s, x + step - 0.17, 2.85, 0.13, 0.3, ORANGE);
    }
    const info = [["노쇼 대응", "취소·불참 시 대기자에게 자동으로 슬롯 배정", "LuRefreshCw", OTINT, ORANGE], ["회차별 방식 선택 (확장형)", "1회차 오프라인, 2~3회차 온라인처럼 혼합 참여", "LuShuffle", BG, NAVY]];
    for (let i = 0; i < 2; i++) {
      const y = 4.3 + i * 1.25;
      card(s, M, y, lw - 0.2, 1.1, info[i][3]);
      await iconCircle(s, M + 0.25, y + 0.2, 0.7, lu[info[i][2]] ? info[i][2] : "LuRefreshCw", info[i][4]);
      T(s, info[i][0], M + 1.15, y + 0.15, 5.5, 0.4, { fontSize: 16, bold: true, color: info[i][4], valign: "middle" });
      T(s, info[i][1], M + 1.15, y + 0.55, 5.8, 0.4, { fontSize: 13, color: NAVY2, valign: "middle" });
    }
    const bx = 8.4, bw = W - M - bx;
    card(s, bx, 1.95, bw, 4.9, NAVY, { shadow: true });
    T(s, "운영일수 산정 예시", bx + 0.35, 2.15, bw - 0.7, 0.4, { fontSize: 15, bold: true, color: WHITE });
    const calc = [["20", "명", "학생"], ["× 3", "회", "회차"], ["÷ 7", "명", "하루 정원"]];
    calc.forEach(([a, u, l], i) => {
      const y = 2.7 + i * 0.72;
      T(s, [{ text: a, options: { fontSize: 28, bold: true, color: WHITE } }, { text: " " + u, options: { fontSize: 14, color: WHITE } }], bx + 0.35, y, 2.6, 0.62, { valign: "middle" });
      T(s, l, bx + bw - 1.6, y, 1.25, 0.62, { fontSize: 13, color: "C9CED6", align: "right", valign: "middle" });
    });
    s.addShape(pres.shapes.LINE, { x: bx + 0.35, y: 4.95, w: bw - 0.7, h: 0, line: { color: "4A5466", width: 1 } });
    T(s, [{ text: "약 ", options: { fontSize: 24, bold: true } }, { text: "9", options: { fontSize: 60, bold: true } }, { text: " 일", options: { fontSize: 24, bold: true } }], bx + 0.35, 5.0, bw - 0.7, 1.15, { color: ORANGE, valign: "middle" });
    T(s, "확장형 기준 · 인원은 협의 후 확정", bx + 0.35, 6.2, bw - 0.7, 0.35, { fontSize: 11, color: "C9CED6" });
  }

  // ===== 20. 사이트 =====
  const C3 = "03  프로그램 제안  /  03 채용정보 사이트";
  {
    const s = content(C3, "맞춤 채용정보 사이트 (가칭 CBNU K-Job Hub)", "유학생·기업·대학 관리자별 기능 제공");
    ["한국어", "English", "中文", "Tiếng Việt"].forEach((l, i) => pill(s, l, 5.05 + i * 1.25, 1.33, 1.12, 0.36, i === 0 ? ORANGE : OTINT, i === 0 ? WHITE : ORANGE, { fs: 12 }));
    const cols = [
      ["01", "유학생", "LuGraduationCap", NAVY, [["비자·언어·지역·직무 공고 필터", "LuFilter"], ["한국형 이력서 빌더", "LuIdCard"], ["프로그램 신청·멘토링 예약", "LuCalendarCheck"], ["QR 출석 체크", "LuQrCode"]]],
      ["02", "기업", "LuBuilding2", ORANGE, [["동의한 유학생 이력서 열람", "LuEye"], ["잡페어 참가 신청", "LuClipboardList"], ["면접 요청·일정 확정", "LuSend"]]],
      ["03", "대학 관리자", "LuSchool", NAVY2, [["참여·출석 통계", "LuChartBar"], ["만족도 결과", "LuCircleCheck"], ["취업 성과 대시보드", "LuTrendingUp"]]],
    ];
    const cw = (W - 2 * M - 0.6) / 3;
    for (let c = 0; c < 3; c++) {
      const x = M + c * (cw + 0.3), y = 2.0;
      const [n, t, ic, col, feats] = cols[c];
      card(s, x, y, cw, 4.85, BG, { shadow: true });
      card(s, x, y, cw, 1.2, col);
      s.addShape(pres.shapes.RECTANGLE, { x, y: y + 1.0, w: cw, h: 0.2, fill: { color: col }, line: { color: col } });
      await iconCircle(s, x + 0.3, y + 0.2, 0.8, ic, WHITE, col);
      T(s, n, x + 1.3, y + 0.2, 1, 0.3, { fontSize: 12, bold: true, color: c === 1 ? WHITE : ORANGE });
      T(s, t, x + 1.3, y + 0.48, cw - 1.5, 0.5, { fontSize: 22, bold: true, color: WHITE, valign: "middle" });
      for (let k = 0; k < feats.length; k++) {
        const fy = y + 1.45 + k * 0.82;
        card(s, x + 0.25, fy, cw - 0.5, 0.68, WHITE, { r: 0.08 });
        s.addImage({ data: await icon(feats[k][1], col === NAVY2 ? NAVY : col), x: x + 0.42, y: fy + 0.16, w: 0.36, h: 0.36 });
        T(s, feats[k][0], x + 0.95, fy, cw - 1.3, 0.68, { fontSize: 13, valign: "middle" });
      }
    }
  }

  // ===== 21. 와이어프레임 =====
  {
    const s = content(C3, "주요 화면 구성 (와이어프레임)", "공고 필터 / 멘토링 예약 / 관리자 대시보드 · 실제 화면은 착수 후 대학과 협의해 설계");
    const fw = (W - 2 * M - 0.8) / 3, fy = 1.95, fh = 4.3;
    const frame = (x, label) => {
      card(s, x, fy, fw, fh, WHITE, { line: "C9CED6", lineW: 1, shadow: true, r: 0.1 });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.02, y: fy + 0.02, w: fw - 0.04, h: 0.4, fill: { color: BG }, line: { color: BG } });
      ["F26B5B", "F5C04A", "5CC77A"].forEach((c, i) => s.addShape(pres.shapes.OVAL, { x: x + 0.18 + i * 0.22, y: fy + 0.14, w: 0.13, h: 0.13, fill: { color: c }, line: { color: c } }));
      card(s, x, fy + fh + 0.15, fw, 0.5, NAVY, { r: 0.1 });
      T(s, label, x, fy + fh + 0.15, fw, 0.5, { fontSize: 14, bold: true, color: WHITE, align: "center", valign: "middle" });
    };
    // 1. 공고 필터
    let x = M;
    frame(x, "01  맞춤 공고 필터");
    [["E-7 가능", ORANGE, WHITE], ["한국어 중급", NAVY, WHITE], ["충북", WHITE, NAVY], ["해외영업", WHITE, NAVY]].forEach(([t, f, c], i) => pill(s, t, x + 0.25 + (i % 2) * ((fw - 0.6) / 2 + 0.1), fy + 0.6 + Math.floor(i / 2) * 0.45, (fw - 0.6) / 2, 0.35, f, c, { fs: 11, line: f === WHITE ? "C9CED6" : f }));
    for (let i = 0; i < 4; i++) {
      const ry = fy + 1.65 + i * 0.62;
      card(s, x + 0.25, ry, fw - 0.5, 0.5, BG, { r: 0.06 });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.4, y: ry + 0.12, w: 2.0, h: 0.1, fill: { color: NAVY }, line: { color: NAVY } });
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.4, y: ry + 0.3, w: 1.3, h: 0.07, fill: { color: "C9CED6" }, line: { color: "C9CED6" } });
      T(s, "보기", x + fw - 0.95, ry, 0.55, 0.5, { fontSize: 11, bold: true, color: ORANGE, valign: "middle", align: "right" });
    }
    // 2. 예약
    x = M + fw + 0.4;
    frame(x, "02  멘토링 예약");
    T(s, "11월", x + 0.25, fy + 0.55, 2, 0.35, { fontSize: 14, bold: true });
    const filled = [1, 4, 7, 12, 15, 18, 21];
    const cs = (fw - 0.5) / 5;
    for (let i = 0; i < 20; i++) {
      const cx = x + 0.25 + (i % 5) * cs, cy = fy + 1.0 + Math.floor(i / 5) * 0.52;
      const f = filled.includes(i) ? NAVY : i === 8 ? ORANGE : BG;
      s.addShape(pres.shapes.RECTANGLE, { x: cx + 0.03, y: cy + 0.03, w: cs - 0.06, h: 0.46, fill: { color: f }, line: { color: WHITE } });
    }
    card(s, x + 0.25, fy + 3.2, fw - 0.5, 0.55, ORANGE, { r: 0.08 });
    T(s, "예약하기", x + 0.25, fy + 3.2, fw - 0.5, 0.55, { fontSize: 14, bold: true, color: WHITE, align: "center", valign: "middle" });
    // 3. 대시보드 (네이티브 차트)
    x = M + 2 * (fw + 0.4);
    frame(x, "03  관리자 대시보드");
    [["참여", "—"], ["이수", "—"], ["면접", "—"]].forEach(([l, v], i) => {
      const kx = x + 0.25 + i * ((fw - 0.5) / 3);
      card(s, kx + 0.04, fy + 0.6, (fw - 0.5) / 3 - 0.08, 0.75, BG, { r: 0.06 });
      T(s, v, kx, fy + 0.62, (fw - 0.5) / 3, 0.4, { fontSize: 18, bold: true, align: "center", valign: "middle" });
      T(s, l, kx, fy + 1.0, (fw - 0.5) / 3, 0.3, { fontSize: 11, color: GRAY, align: "center" });
    });
    const bars = [0.35, 0.6, 0.5, 0.8, 0.7, 1.0];
    bars.forEach((v, i) => {
      const bwid = (fw - 0.7) / 6, bh = 2.3 * v;
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.35 + i * bwid + 0.05, y: fy + 4.0 - bh, w: bwid - 0.1, h: bh, fill: { color: i === 5 ? ORANGE : "C9CED6" }, line: { color: i === 5 ? ORANGE : "C9CED6" } });
    });
  }

  // ===== 22. 사이트 운영 =====
  {
    const s = content(C3, "사이트 운영 방식과 구성 옵션", "주 1회 공고 갱신, 동의 기반 이력서 공개, 사업 종료 후 대학 이관");
    const f = [["채용정보 큐레이션", "공공 채용정보와 직접 발굴한 기업 공고를 주 1회 갱신", "LuRefreshCw", NAVY], ["동의 기반 공개", "이력서는 학생이 동의한 기업에만 공개", "LuShieldCheck", ORANGE], ["대학 이관", "사업 종료 후 운영 매뉴얼과 함께 대학에 이관", "LuHouse", NAVY2]];
    for (let i = 0; i < 3; i++) {
      const y = 2.0 + i * 1.6;
      card(s, M, y, 5.6, 1.4, BG, { shadow: true });
      await iconCircle(s, M + 0.3, y + 0.3, 0.8, f[i][2], f[i][3]);
      T(s, f[i][0], M + 1.35, y + 0.22, 4, 0.45, { fontSize: 18, bold: true, valign: "middle" });
      T(s, f[i][1], M + 1.35, y + 0.68, 4.05, 0.55, { fontSize: 13, color: GRAY });
    }
    const rows = [["다국어 공고 게시·필터", 1, 1], ["프로그램 신청·QR 출석", 1, 1], ["멘토링 예약", 1, 1], ["한국형 이력서 빌더", 0, 1], ["기업 매칭·면접 요청", 0, 1], ["관리자 대시보드", 0, 1]];
    const mk = (v) => ({ text: v ? "●" : "–", options: { color: v ? ORANGE : "C9CED6", align: "center", fontSize: v ? 18 : 16, bold: true } });
    const data = [[{ text: "기능", options: { bold: true, color: WHITE, fill: { color: NAVY } } }, { text: "기본형", options: { bold: true, color: WHITE, fill: { color: NAVY }, align: "center" } }, { text: "확장형", options: { bold: true, color: WHITE, fill: { color: ORANGE }, align: "center" } }]];
    rows.forEach((r, i) => data.push([{ text: r[0], options: { fill: { color: i % 2 ? BG : WHITE } } }, { ...mk(r[1]), options: { ...mk(r[1]).options, fill: { color: i % 2 ? BG : WHITE } } }, { ...mk(r[2]), options: { ...mk(r[2]).options, fill: { color: i % 2 ? OTINT : "FEF6F3" } } }]));
    s.addTable(data, { x: 6.6, y: 2.0, w: W - M - 6.6, colW: [3.13, 1.5, 1.5], rowH: 0.64, fontSize: 14, color: NAVY, fontFace: FONT, border: { type: "solid", pt: 0.5, color: LINE }, valign: "middle", margin: [0, 0.12, 0, 0.2] });
  }

  // ===== 23. 인사담당자 상담 개요 =====
  const C4 = "03  프로그램 제안  /  04 인사담당자 상담";
  {
    const s = content(C4, "인사담당자 상담 개요", "외국인 채용 경험이 있는 기업 인사담당자만 멘토로 섭외");
    card(s, M, 1.95, 4.75, 2.45, NAVY, { shadow: true });
    T(s, [{ text: "유학생을 실제로 뽑아 본\n인사담당자에게 직접 듣는\n", options: { color: WHITE } }, { text: "채용 기준", options: { color: ORANGE } }], M + 0.35, 2.1, 4.2, 2.15, { fontSize: 22, bold: true, valign: "middle" });
    await photo(s, "hr", M + 4.9, 1.95, 2.3, 2.45);
    const pts = [["01", "실제 채용 기준을 직접 설명", "LuMessagesSquare"], ["02", "기업이 망설이는 이유까지 공유", "LuCircleHelp"], ["03", "잡페어 참여 기업 발굴로 연결", "LuLink"]];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 2.45, y = 4.6;
      card(s, x, y, 2.3, 2.1, BG);
      await iconCircle(s, x + 0.25, y + 0.25, 0.7, pts[i][2], ORANGE);
      T(s, pts[i][0], x + 1.6, y + 0.3, 0.5, 0.3, { fontSize: 13, bold: true, color: MUTED, align: "right" });
      T(s, pts[i][1], x + 0.25, y + 1.1, 1.9, 0.85, { fontSize: 14, bold: true, valign: "middle" });
    }
    const x0 = 8.25, ow = W - M - x0;
    T(s, "구성 옵션", x0, 1.95, 3, 0.35, { fontSize: 14, bold: true, color: GRAY });
    card(s, x0, 2.35, ow, 2.0, BG, { shadow: true });
    T(s, "기본형", x0 + 0.3, 2.5, 2, 0.35, { fontSize: 14, bold: true, color: GRAY });
    T(s, "1회 운영", x0 + 0.3, 2.85, 2, 0.4, { fontSize: 18, bold: true });
    T(s, [{ text: "3", options: { fontSize: 60, bold: true } }, { text: " 명", options: { fontSize: 20, bold: true } }], x0 + 1.8, 2.5, ow - 2.1, 1.7, { align: "right", valign: "middle" });
    card(s, x0, 4.55, ow, 2.0, ORANGE, { shadow: true });
    T(s, "확장형", x0 + 0.3, 4.7, 2, 0.35, { fontSize: 14, bold: true, color: WHITE });
    T(s, "2회 운영", x0 + 0.3, 5.05, 2, 0.4, { fontSize: 18, bold: true, color: WHITE });
    T(s, [{ text: "5", options: { fontSize: 60, bold: true } }, { text: " 명", options: { fontSize: 20, bold: true } }], x0 + 1.8, 4.7, ow - 2.1, 1.7, { align: "right", valign: "middle", color: WHITE });
    T(s, "섭외 기업·담당자는 발주처와 협의 후 확정", x0, 6.62, ow, 0.3, { fontSize: 11, color: MUTED });
  }

  // ===== 24. 라운드제 =====
  {
    const s = content(C4, "라운드제 소그룹 상담", "인사담당자 1명당 학생 4~5명, 40분마다 테이블 순환 (예: 인사담당자 3명 × 학생 15명)");
    const cxs = [2.6, W / 2, W - 2.6], cy = 3.35, r = 0.75, R = 1.3;
    const lbl = ["A", "B", "C"];
    for (let i = 0; i < 3; i++) {
      s.addShape(pres.shapes.OVAL, { x: cxs[i] - R - 0.3, y: cy - R - 0.3, w: 2 * R + 0.6, h: 2 * R + 0.6, fill: { color: i === 1 ? OTINT : BG }, line: { color: i === 1 ? OTINT : BG } });
      for (let k = 0; k < 5; k++) {
        const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
        const px = cxs[i] + Math.cos(a) * R - 0.2, py = cy + Math.sin(a) * R - 0.2;
        s.addShape(pres.shapes.OVAL, { x: px, y: py, w: 0.4, h: 0.4, fill: { color: WHITE }, line: { color: i === 1 ? ORANGE : NAVY, width: 1.5 } });
        s.addImage({ data: await icon("LuUser", i === 1 ? ORANGE : NAVY), x: px + 0.08, y: py + 0.08, w: 0.24, h: 0.24 });
      }
      const f = i === 1 ? ORANGE : NAVY;
      s.addShape(pres.shapes.OVAL, { x: cxs[i] - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: f }, line: { color: f } });
      T(s, "인사담당자\n" + lbl[i], cxs[i] - r, cy - r, 2 * r, 2 * r, { fontSize: 14, bold: true, color: WHITE, align: "center", valign: "middle" });
      if (i < 2) {
        const ax = cxs[i] + R + 0.4, aw = cxs[i + 1] - cxs[i] - 2 * R - 0.8;
        arrowR(s, ax, cy, aw);
        pill(s, "40분", ax + aw / 2 - 0.45, cy - 0.55, 0.9, 0.36, ORANGE, WHITE, { fs: 12 });
      }
    }
    T(s, [{ text: "진행 시간표", options: { bold: true } }, { text: "   총 140분", options: { color: ORANGE, bold: true } }], M, 5.2, 6, 0.35, { fontSize: 14 });
    const segs = [["10분", "오리엔테이션", 10, "C9CED6", NAVY], ["40분", "라운드 1", 40, NAVY, WHITE], ["40분", "라운드 2", 40, ORANGE, WHITE], ["40분", "라운드 3", 40, NAVY, WHITE], ["10분", "마무리·설문", 10, "C9CED6", NAVY]];
    const tw = W - 2 * M;
    let x = M;
    segs.forEach(([a, b, m, f, c]) => {
      const w = tw * m / 140;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 5.65, w, h: 0.6, fill: { color: f }, line: { color: WHITE, width: 2 } });
      T(s, a, x, 5.65, w, 0.6, { fontSize: 14, bold: true, color: c, align: "center", valign: "middle" });
      const lw = Math.max(w, 1.4);
      T(s, b, x + w / 2 - lw / 2, 6.3, lw, 0.35, { fontSize: 12, color: GRAY, align: "center" });
      x += w;
    });
  }

  // ===== 25. 상담 주제 =====
  {
    const s = content(C4, "상담 주제와 산출물", "채용 현장의 판단 기준을 주제별로 다루고, Q&A 카드로 정리해 사이트에 게시");
    const q = ["유학생 서류에서 실제로 보는 항목", "외국인 채용 결정 기준과 망설이는 이유", "비자 고용 절차에 대한 기업 입장", "연봉과 처우 현실", "면접 탈락 유형"];
    q.forEach((t, i) => {
      const y = 1.95 + i * 0.95;
      card(s, M, y, 7.0, 0.8, BG);
      card(s, M, y, 1.0, 0.8, i % 2 ? NAVY : ORANGE);
      s.addShape(pres.shapes.RECTANGLE, { x: M + 0.8, y, w: 0.2, h: 0.8, fill: { color: i % 2 ? NAVY : ORANGE }, line: { color: i % 2 ? NAVY : ORANGE } });
      T(s, "Q" + (i + 1), M, y, 1.0, 0.8, { fontSize: 20, bold: true, color: WHITE, align: "center", valign: "middle" });
      T(s, t, M + 1.3, y, 5.5, 0.8, { fontSize: 16, bold: true, valign: "middle" });
    });
    const x0 = 8.2, w0 = W - M - x0;
    T(s, "산출물 · 인사담당자 Q&A 카드", x0, 1.95, w0, 0.35, { fontSize: 14, bold: true, color: ORANGE });
    // 카드 스택
    card(s, x0 + 0.3, 2.45, w0 - 0.3, 3.2, "C9CED6", { r: 0.12 });
    card(s, x0 + 0.15, 2.6, w0 - 0.3, 3.2, "E1E4E9", { r: 0.12 });
    card(s, x0, 2.75, w0 - 0.3, 3.2, WHITE, { line: NAVY, lineW: 1.5, shadow: true, r: 0.12 });
    pill(s, "Q2", x0 + 0.3, 3.0, 0.7, 0.4, ORANGE, WHITE, { fs: 14 });
    T(s, "기업명 · 담당 직무", x0 + 1.15, 3.0, 2.7, 0.4, { fontSize: 13, color: GRAY, valign: "middle" });
    s.addShape(pres.shapes.RECTANGLE, { x: x0 + 0.3, y: 3.7, w: w0 - 0.95, h: 0.14, fill: { color: NAVY }, line: { color: NAVY } });
    [0.9, 0.75, 0.85, 0.5].forEach((p, i) => s.addShape(pres.shapes.RECTANGLE, { x: x0 + 0.3, y: 4.1 + i * 0.32, w: (w0 - 0.95) * p, h: 0.1, fill: { color: "C9CED6" }, line: { color: "C9CED6" } }));
    await iconCircle(s, x0, 6.15, 0.55, "LuGlobe", NAVY);
    T(s, "사이트 게시로 미참석 학생도 열람", x0 + 0.7, 6.15, w0 - 0.7, 0.55, { fontSize: 14, bold: true, valign: "middle" });
  }

  // ===== 26. 잡페어 개요 =====
  const C5 = "03  프로그램 제안  /  05 소규모 잡페어";
  {
    const s = content(C5, "소규모 잡페어 개요", "유학생 채용 의향이 있는 기업 5개사 내외, 유학생 30~40명 규모");
    const sw = (W - 2 * M - 0.6) / 3;
    stat(s, M, 1.95, sw, 1.7, "5", "개사", "참여 기업 · 기본형 3개사", ORANGE, WHITE, WHITE);
    stat(s, M + sw + 0.3, 1.95, sw, 1.7, "30~40", "명", "참여 유학생 · 사전 서류 등록자", NAVY, WHITE, "C9CED6");
    stat(s, M + 2 * (sw + 0.3), 1.95, sw, 1.7, "사전", "매칭", "행사 전 서류 검토·면접 일정 확정", BG, NAVY, GRAY);
    T(s, "기업 발굴 기준", M + 4.2, 3.95, 4, 0.38, { fontSize: 16, bold: true });
    await photo(s, "jobfair", M, 3.95, 3.9, 2.75, 0.45);
    const cw3 = (W - 2 * M - 4.2 - 0.6) / 3;
    const cr = [["충북 소재 기업", "지역 정주로 이어지는 채용 우선", "LuMapPin"], ["유학생 채용 의향", "실제 채용 계획이 있는 기업만 초청", "LuHeart"], ["E-7 고용 가능 업종", "외투기업·수출기업 포함", "LuIdCard"]];
    for (let i = 0; i < 3; i++) {
      const x = M + 4.2 + i * (cw3 + 0.3), y = 4.45;
      card(s, x, y, cw3, 2.25, BG, { shadow: true });
      await iconCircle(s, x + 0.25, y + 0.25, 0.75, cr[i][2], i === 0 ? ORANGE : NAVY);
      T(s, cr[i][0], x + 0.25, y + 1.1, cw3 - 0.4, 0.45, { fontSize: 15, bold: true, valign: "middle" });
      T(s, cr[i][1], x + 0.25, y + 1.55, cw3 - 0.4, 0.6, { fontSize: 12, color: GRAY });
    }
  }

  // ===== 27. 사전매칭 절차 =====
  {
    const s = content(C5, "사전매칭 절차", "행사 전 서류 검토와 면접 일정 확정까지 마치고, 행사 후 3개월간 결과 추적");
    const st = [["기업 모집", "채용 직무·인원 확인", "LuBuilding2"], ["공고 게시", "사이트 잡페어 공고", "LuMegaphone"], ["이력서 등록", "지원·열람 동의", "LuFileText"], ["서류 검토", "면접 대상 선정", "LuFileSearch"], ["일정 확정", "면접 시간 안내", "LuCalendarCheck"], ["현장 면접", "잡페어 당일", "LuHandshake"], ["결과 추적", "3개월 합격 추적", "LuTrendingUp"]];
    const cw = (W - 2 * M) / 7;
    // phase band
    const ph = [["행사 전", 0, 5, NAVY], ["당일", 5, 1, ORANGE], ["사후", 6, 1, GRAY]];
    ph.forEach(([t, a, n, c]) => {
      card(s, M + a * cw + 0.05, 1.95, n * cw - 0.1, 0.5, c, { r: 0.08 });
      T(s, t, M + a * cw, 1.95, n * cw, 0.5, { fontSize: 15, bold: true, color: WHITE, align: "center", valign: "middle" });
    });
    s.addShape(pres.shapes.LINE, { x: M + cw / 2, y: 3.25, w: 6 * cw, h: 0, line: { color: "C9CED6", width: 3 } });
    for (let i = 0; i < 7; i++) {
      const x = M + i * cw, c = i < 5 ? NAVY : i === 5 ? ORANGE : GRAY;
      await iconCircle(s, x + cw / 2 - 0.45, 2.8, 0.9, st[i][2], c);
      T(s, String(i + 1).padStart(2, "0"), x, 3.85, cw, 0.3, { fontSize: 12, bold: true, color: ORANGE, align: "center" });
      T(s, st[i][0], x, 4.12, cw, 0.4, { fontSize: 16, bold: true, align: "center", valign: "middle" });
      T(s, st[i][1], x + 0.05, 4.52, cw - 0.1, 0.55, { fontSize: 12, color: GRAY, align: "center" });
    }
    card(s, M, 5.4, W - 2 * M, 1.3, OTINT);
    await iconCircle(s, M + 0.35, 5.6, 0.9, "LuBookOpen", ORANGE);
    T(s, "기업용 외국인 고용 안내자료", M + 1.5, 5.55, 8, 0.45, { fontSize: 17, bold: true, color: ORANGE, valign: "middle" });
    T(s, "E-7 신청 요건, 필요 서류, 소요 기간을 정리해 참여 기업에 미리 배포합니다.", M + 1.5, 6.0, 10, 0.5, { fontSize: 15, valign: "middle" });
  }

  // ===== 28. 현장 배치 =====
  {
    const s = content(C5, "현장 배치 (안)", "접수, 기업설명, 현장면접, 이력서 컨설팅, 대기 공간 · 장소와 배치는 협의 후 확정");
    const fx = M, fy = 1.95, fw = 7.9, fh = 4.55;
    card(s, fx, fy, fw, fh, BG, { line: NAVY, lineW: 2, r: 0.05 });
    const zone = (x, y, w, h, fill, text, tc, fs = 14) => {
      card(s, x, y, w, h, fill, { r: 0.06, line: fill === WHITE ? "C9CED6" : fill });
      T(s, text, x, y, w, h, { fontSize: fs, bold: true, color: tc, align: "center", valign: "middle" });
    };
    zone(fx + 0.2, fy + 0.2, 1.6, 1.0, NAVY, "접수", WHITE);
    zone(fx + 2.0, fy + 0.2, fw - 2.2, 1.0, "C9CED6", "기업설명", NAVY);
    zone(fx + 0.2, fy + 1.4, 1.6, 2.95, WHITE, "대기석", NAVY);
    const iw = (fw - 2.2 - 0.4) / 5;
    for (let i = 0; i < 5; i++) zone(fx + 2.0 + i * (iw + 0.1), fy + 1.4, iw, 1.5, ORANGE, "면접 " + (i + 1), WHITE, 14);
    zone(fx + 2.0, fy + 3.1, fw - 2.2, 1.25, NTINT, "이력서 컨설팅", NAVY);
    T(s, "▲ 출입구", fx, fy + fh + 0.05, 2, 0.3, { fontSize: 11, bold: true, color: GRAY });
    const lg = [["접수", "사전매칭 명단 확인·순서 안내", NAVY], ["기업설명", "기업별 직무·채용 조건 소개", "C9CED6"], ["현장면접", "기업별 독립 면접 공간 5곳", ORANGE], ["이력서 컨설팅", "멘토링 멘토가 현장 보완", NTINT], ["대기석", "면접 대기·자료 열람", WHITE]];
    const lx = 8.85;
    T(s, "공간 안내", lx, 1.95, 3, 0.35, { fontSize: 14, bold: true, color: GRAY });
    lg.forEach(([a, b, c], i) => {
      const y = 2.4 + i * 0.75;
      card(s, lx, y + 0.05, 0.42, 0.42, c, { r: 0.06, line: c === WHITE || c === NTINT ? "9AA1AC" : c });
      T(s, a, lx + 0.6, y, 3.2, 0.3, { fontSize: 14, bold: true });
      T(s, b, lx + 0.6, y + 0.3, 3.3, 0.3, { fontSize: 12, color: GRAY });
    });
    pill(s, "통역은 필요 시 별도 예산", lx, 6.25, 2.8, 0.4, OTINT, ORANGE, { fs: 12 });
  }

  // ===== 29. 간지 04 =====
  section("04 도입 방식");
  await divider("04", "도입 방식", ["구성 옵션", "추천 조합"], "div04");

  // ===== 30. 구성 옵션 =====
  {
    const s = content("04  도입 방식", "프로그램별 구성 옵션", "프로그램마다 기본형과 확장형 중 선택 · 영어 강사와 통역은 추가 옵션");
    const rows = [["01", "취업 특강", "4강, 한국어", "8강 전체, 한국어", "LuPresentation"], ["02", "1:1 멘토링", "오프라인, 1인 2회", "오프라인과 온라인, 1인 3회", "LuUsers"], ["03", "채용정보 사이트", "공고·프로그램 신청", "매칭·이력서 빌더·대시보드", "LuMonitor"], ["04", "인사담당자 상담", "1회, 인사담당자 3명", "2회, 인사담당자 5명", "LuMessagesSquare"], ["05", "소규모 잡페어", "3개사", "5개사 + 사전매칭", "LuBuilding2"]];
    const c0 = 4.0, c1 = 3.95, c2 = W - 2 * M - c0 - c1 - 0.3;
    const x1 = M + c0 + 0.15, x2 = x1 + c1 + 0.15;
    card(s, x1, 1.9, c1, 0.6, NAVY);
    T(s, "기본형", x1, 1.9, c1, 0.6, { fontSize: 17, bold: true, color: WHITE, align: "center", valign: "middle" });
    card(s, x2, 1.9, c2, 0.6, ORANGE);
    T(s, "확장형", x2, 1.9, c2, 0.6, { fontSize: 17, bold: true, color: WHITE, align: "center", valign: "middle" });
    for (let i = 0; i < 5; i++) {
      const y = 2.62 + i * 0.75, h = 0.65;
      card(s, M, y, c0, h, BG);
      s.addImage({ data: await icon(rows[i][4], ORANGE), x: M + 0.2, y: y + 0.14, w: 0.37, h: 0.37 });
      T(s, rows[i][0], M + 0.75, y, 0.5, h, { fontSize: 13, bold: true, color: ORANGE, valign: "middle" });
      T(s, rows[i][1], M + 1.25, y, c0 - 1.35, h, { fontSize: 16, bold: true, valign: "middle" });
      card(s, x1, y, c1, h, BG);
      T(s, rows[i][2], x1, y, c1, h, { fontSize: 14, align: "center", valign: "middle" });
      card(s, x2, y, c2, h, OTINT);
      T(s, rows[i][3], x2, y, c2, h, { fontSize: 14, bold: true, color: NAVY, align: "center", valign: "middle" });
    }
    T(s, "추가 옵션", M, 6.45, 1.3, 0.45, { fontSize: 14, bold: true, color: ORANGE, valign: "middle" });
    card(s, M + 1.3, 6.42, 4.9, 0.5, WHITE, { line: "C9CED6" });
    T(s, [{ text: "영어 가능 강사 진행   ", options: { bold: true } }, { text: "강의 단가 소폭 증가", options: { color: GRAY } }], M + 1.5, 6.42, 4.6, 0.5, { fontSize: 13, valign: "middle" });
    card(s, M + 6.4, 6.42, 5.7, 0.5, WHITE, { line: "C9CED6" });
    T(s, [{ text: "통역   ", options: { bold: true } }, { text: "별도 예산 (언어·시간 단위 견적)", options: { color: GRAY } }], M + 6.6, 6.42, 5.4, 0.5, { fontSize: 13, valign: "middle" });
  }

  // ===== 31. 추천 조합 =====
  {
    const s = content("04  도입 방식", "목적별 추천 조합", "운영 목적과 예산에 따라 세 가지 조합 제안");
    const progs = ["01  특강", "02  멘토링", "03  사이트", "04  상담", "05  잡페어"];
    await icon("LuCircleCheck", WHITE);
    const combos = [["A", "역량집중형", [1, 1, 0, 0, 0], "서류·면접 준비를 단기간에 끌어올려야 할 때"], ["B", "채용연계형", [0, 0, 1, 1, 1], "기업 연결과 실제 채용 성과를 우선할 때"], ["C", "통합형", [1, 1, 1, 1, 1], "진단부터 채용까지 전 단계를 연결해 운영할 때"]];
    const cw = (W - 2 * M - 0.6) / 3, y = 1.95, h = 4.9;
    combos.forEach(([L, n, inc, d], i) => {
      const x = M + i * (cw + 0.3), dark = i === 2;
      card(s, x, y, cw, h, dark ? NAVY : BG, { shadow: true });
      numCircle(s, x + 0.3, y + 0.3, 0.85, L, ORANGE, WHITE, 26);
      if (dark) pill(s, "추천", x + cw - 1.15, y + 0.4, 0.85, 0.38, ORANGE, WHITE, { fs: 13 });
      T(s, n, x + 1.35, y + 0.3, cw - 1.6, 0.85, { fontSize: 22, bold: true, color: dark ? WHITE : NAVY, valign: "middle" });
      inc.forEach((v, k) => {
        const py = y + 1.45 + k * 0.5;
        const f = v ? ORANGE : dark ? NAVY2 : WHITE, c = v ? WHITE : dark ? "6B7484" : "B5BBC4";
        card(s, x + 0.3, py, cw - 0.6, 0.4, f, { r: 0.08, line: v ? ORANGE : dark ? NAVY2 : "D7DBE2" });
        T(s, progs[k], x + 0.5, py, cw - 1.2, 0.4, { fontSize: 13, bold: true, color: c, valign: "middle" });
        if (v) s.addImage({ data: iconCache["LuCircleCheckFFFFFF"], x: x + cw - 0.68, y: py + 0.08, w: 0.24, h: 0.24 });
      });
      T(s, d, x + 0.3, y + 4.05, cw - 0.6, 0.7, { fontSize: 14, bold: true, color: dark ? "E6E8EC" : NAVY2, valign: "middle" });
    });
  }

  // ===== 32. 간지 05 =====
  section("05 운영 관리");
  await divider("05", "운영 관리", ["인력·참여 관리", "개인정보 보호", "성과관리·보고"], "div05");

  // ===== 33. 인력·참여 =====
  {
    const s = content("05  운영 관리", "인력 운영과 참여 관리", "강사·멘토 선정 기준과 모집·예약·이수 관리 방안");
    const cols = [
      ["인력 운영", NAVY, [["강사·전문멘토", "유학생 취업지도 경력자 우선 배정", "LuCircleCheck"], ["인사담당자", "외국인 채용 경험 기업으로 한정", "LuUserCheck"], ["사전 교육", "유학생 특성·비자 기초·개인정보 보호", "LuBookOpen"]]],
      ["참여 관리", ORANGE, [["모집", "국제교류 부서 협조, 교내 채널·사이트 다국어 공지", "LuMegaphone"], ["예약·노쇼", "사전 알림, 취소 시 대기자 자동 배정", "LuBell"], ["이수 혜택", "6강 이상 이수 시 잡페어 사전매칭·멘토링 우선 예약", "LuGift"]]],
    ];
    const cw = (W - 2 * M - 0.4) / 2;
    for (let c = 0; c < 2; c++) {
      const x = M + c * (cw + 0.4);
      const [h, col, items] = cols[c];
      card(s, x, 1.95, cw, 0.6, col);
      T(s, h, x + 0.3, 1.95, cw - 0.6, 0.6, { fontSize: 18, bold: true, color: WHITE, valign: "middle" });
      for (let i = 0; i < 3; i++) {
        const y = 2.75 + i * 1.38;
        card(s, x, y, cw, 1.22, BG, { shadow: true });
        await iconCircle(s, x + 0.3, y + 0.24, 0.75, items[i][2], col);
        T(s, items[i][0], x + 1.3, y + 0.15, cw - 1.5, 0.45, { fontSize: 17, bold: true, valign: "middle" });
        T(s, items[i][1], x + 1.3, y + 0.6, cw - 1.5, 0.5, { fontSize: 13, color: GRAY, valign: "middle" });
      }
    }
  }

  // ===== 34. 개인정보 =====
  {
    const s = content("05  운영 관리", "개인정보 보호 방안", "「개인정보 보호법」 준수, 학생이 동의한 범위 안에서만 정보 활용");
    const it = [["01", "수집 최소화", "운영에 필요한 항목만 수집", "LuClipboardList"], ["02", "열람 동의", "동의한 기업에만 이력서 공개", "LuPenLine"], ["03", "접근 권한", "담당자별 권한 분리, 접속 기록 관리", "LuKey"], ["04", "보관·파기", "사업 종료 후 이관 또는 협의 기한 내 파기", "LuTrash2"]];
    const cw = (W - 2 * M - 0.9) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.3), y = 1.95, h = 3.0;
      const hl = i === 1;
      card(s, x, y, cw, h, hl ? ORANGE : BG, { shadow: true });
      await iconCircle(s, x + 0.3, y + 0.3, 0.95, it[i][3], hl ? WHITE : NAVY, hl ? ORANGE : WHITE);
      T(s, it[i][0], x + cw - 0.9, y + 0.3, 0.6, 0.4, { fontSize: 18, bold: true, color: hl ? WHITE : "C9CED6", align: "right" });
      T(s, it[i][1], x + 0.3, y + 1.45, cw - 0.6, 0.5, { fontSize: 20, bold: true, color: hl ? WHITE : NAVY, valign: "middle" });
      T(s, it[i][2], x + 0.3, y + 1.98, cw - 0.6, 0.85, { fontSize: 13, color: hl ? WHITE : GRAY });
    }
    T(s, "이력서 열람 흐름", M, 5.25, 4, 0.38, { fontSize: 15, bold: true, color: ORANGE });
    const fl = ["학생 이력서 등록", "기업별 공개 동의", "동의 기업만 열람", "열람 이력 기록"];
    const fw = (W - 2 * M + 0.15 * 3) / 4;
    fl.forEach((t, i) => {
      const x = M + i * (fw - 0.15);
      const f = [NTINT, "C9CED6", NAVY2, NAVY][i];
      s.addShape(i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x, y: 5.7, w: fw, h: 0.95, fill: { color: f }, line: { color: WHITE, width: 2 } });
      T(s, t, x + 0.35, 5.7, fw - 0.7, 0.95, { fontSize: 15, bold: true, color: i < 2 ? NAVY : WHITE, align: "center", valign: "middle" });
    });
  }

  // ===== 35. 성과지표 =====
  {
    const s = content("05  운영 관리", "성과지표와 보고 체계", "정량 목표를 정하고 단계별로 보고");
    const k = [["4.5", "점 이상", "프로그램 만족도 (5점 만점)", ORANGE, WHITE, WHITE, "LuStar"], ["100", "%", "멘토링 참여자 이력서 완성률", NAVY, WHITE, "C9CED6", "LuFileText"], ["—", "건 이상", "잡페어 현장면접 연계 (목표 협의)", BG, NAVY, GRAY, "LuHandshake"], ["3", "개월", "종료 후 취업 결과 추적", BG, NAVY, GRAY, "LuTrendingUp"]];
    const cw = (W - 2 * M - 0.9) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.3), y = 1.95, h = 1.85;
      card(s, x, y, cw, h, k[i][3], { shadow: true });
      s.addImage({ data: await icon(k[i][6], k[i][4] === WHITE ? WHITE : ORANGE), x: x + cw - 0.75, y: y + 0.25, w: 0.45, h: 0.45 });
      T(s, [{ text: k[i][0], options: { fontSize: 44, bold: true } }, { text: " " + k[i][1], options: { fontSize: 16, bold: true } }], x + 0.3, y + 0.2, cw - 0.6, 0.95, { color: k[i][4], valign: "bottom" });
      T(s, k[i][2], x + 0.3, y + 1.22, cw - 0.4, 0.5, { fontSize: 12.5, color: k[i][5] });
    }
    T(s, "보고 체계", M, 4.05, 4, 0.38, { fontSize: 15, bold: true });
    const rp = [["착수보고", "계약 직후", "세부 운영계획"], ["중간보고", "운영 중", "참여 현황·중간 만족도"], ["수시보고", "이슈 발생 시", "즉시 공유"], ["최종보고", "종료 후", "결과보고서"]];
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.3), y = 4.5, last = i === 3;
      card(s, x, y, cw, 1.55, last ? NAVY : BG);
      pill(s, rp[i][1], x + 0.3, y + 0.22, 1.5, 0.34, last ? ORANGE : WHITE, last ? WHITE : ORANGE, { fs: 11, line: last ? ORANGE : "F6C3B2" });
      T(s, rp[i][0], x + 0.3, y + 0.65, cw - 0.6, 0.45, { fontSize: 19, bold: true, color: last ? WHITE : NAVY, valign: "middle" });
      T(s, rp[i][2], x + 0.3, y + 1.1, cw - 0.6, 0.35, { fontSize: 13, color: last ? "C9CED6" : GRAY, valign: "middle" });
      if (i < 3) chevron(s, x + cw + 0.07, y + 0.62, 0.16, 0.3, ORANGE);
    }
    card(s, M, 6.25, W - 2 * M, 0.6, OTINT);
    T(s, [{ text: "결과보고서 목차(안)   ", options: { bold: true, color: ORANGE } }, { text: "사업 개요 · 프로그램별 운영 결과 · 만족도 조사 · 취업 성과 · 현장 사진 · 개선 제안", options: { color: NAVY } }], M + 0.3, 6.25, W - 2 * M - 0.6, 0.6, { fontSize: 13, valign: "middle" });
  }

  // ===== 36. Contact =====
  {
    const s = pres.addSlide({ masterName: "DARK", sectionTitle: curSection });
    s.addImage({ path: ARC, x: 5.13, y: 0.15, w: 8.2, h: 6.23 });
    T(s, "Contact", M, 1.2, 4, 0.4, { fontSize: 16, bold: true, color: ORANGE });
    T(s, "잡웨이브(JobWave)", M, 1.65, 8, 0.9, { fontSize: 44, bold: true, color: WHITE, valign: "middle" });
    T(s, "공부한 충북에서, 일하는 충북으로", M, 2.6, 8, 0.45, { fontSize: 18, color: "C9CED6" });
    const rows = [["담당자", "확인 필요", "LuUser"], ["전화", "확인 필요", "LuPhone"], ["이메일", "확인 필요", "LuMail"], ["홈페이지", "jobwave.kr", "LuGlobe"]];
    for (let i = 0; i < 4; i++) {
      const y = 3.55 + i * 0.75;
      await iconCircle(s, M, y, 0.55, rows[i][2], ORANGE);
      T(s, rows[i][0], M + 0.8, y, 1.4, 0.55, { fontSize: 14, color: "C9CED6", valign: "middle" });
      T(s, rows[i][1], M + 2.2, y, 4, 0.55, { fontSize: 17, bold: true, color: WHITE, valign: "middle" });
    }
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
})();
