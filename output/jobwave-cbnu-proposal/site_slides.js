// 맞춤 채용정보 사이트 슬라이드: 실제 시안 사이트(CBNU K-Job Hub) 스크린샷 기반
// 스크린샷: assets/site/*.jpg (cbnu-kjob-hub.heosh85.chatgpt.site, 2026-11-15 촬영)
const path = require("path");
const A = (f) => path.resolve(__dirname, "assets", "site", f);
const SITE_URL = "cbnu-kjob-hub.heosh85.chatgpt.site";

function browserFrame(ctx, s, x, y, w, h, img) {
  const { pres, card, colors: C } = ctx;
  const bar = 0.28;
  card(s, x, y, w, h + bar, "FFFFFF", { line: "D7DBE2", lineW: 1, shadow: true, r: 0.08 });
  s.addShape(pres.shapes.RECTANGLE, { x: x + 0.02, y: y + 0.02, w: w - 0.04, h: bar - 0.02, fill: { color: C.BG }, line: { color: C.BG } });
  ["F26B5B", "F5C04A", "5CC77A"].forEach((c, i) => s.addShape(pres.shapes.OVAL, { x: x + 0.14 + i * 0.17, y: y + 0.09, w: 0.1, h: 0.1, fill: { color: c }, line: { color: c } }));
  s.addImage({ path: img, x: x + 0.02, y: y + bar, w: w - 0.04, h: h - 0.02 });
}

async function addSiteSlides(ctx, crumb, opts = {}) {
  const { content, T, card, pill, iconCircle, numCircle, W, M, colors: C } = ctx;

  // ---- 1. 개요: 홈 화면 + 주요 기능 ----
  {
    const s = content(crumb, "맞춤 채용정보 사이트 CBNU K-Job Hub", `시안 사이트 공개 · ${SITE_URL} · 한국어·English·中文·Tiếng Việt`);
    const fw = 7.6, fh = fw * 1200 / 1920;
    browserFrame(ctx, s, M, 1.95, fw, fh, A("home.jpg"));
    const x0 = M + fw + 0.35, w0 = W - M - x0;
    T(s, "주요 기능", x0, 1.95, w0, 0.35, { fontSize: 14, bold: true, color: C.GRAY });
    const feats = [
      ["검색·바로가기", "기업명·공고명·직무 검색과 조건 바로가기 버튼"],
      ["유학생 맞춤 필터", "비자·TOPIK 급수·지역·직무 4가지 조건"],
      ["충북 우선 정렬", "충북 공고 우선 노출, 마감 임박순 정렬 지원"],
      ["요건 한눈에 보기", "공고 카드에 비자·한국어 요건, 마감일, 출처"],
      ["원문 바로 연결", "근무 조건 요약과 공고 원문 링크 제공"],
    ];
    feats.forEach(([t, d], k) => {
      const y = 2.38 + k * 0.9;
      card(s, x0, y, w0, 0.8, k === 1 ? C.OTINT : C.BG);
      numCircle(s, x0 + 0.15, y + 0.17, 0.46, String(k + 1), k === 1 ? C.ACCENT : C.NAVY, C.WHITE, 13);
      T(s, t, x0 + 0.75, y + 0.06, w0 - 0.85, 0.32, { fontSize: 14, bold: true, valign: "middle" });
      T(s, d, x0 + 0.75, y + 0.37, w0 - 0.85, 0.38, { fontSize: 10.5, color: C.GRAY, valign: "top" });
    });
  }

  // ---- 2. 주요 화면과 메뉴 구성 ----
  if (!opts.overviewOnly) {
    const s = content(crumb, "주요 화면과 메뉴 구성", "채용공고 메뉴는 시안 구현 완료 · 나머지 4개 메뉴는 착수 후 대학과 협의해 단계별 구축");
    const h = 2.0, gap = 0.27;
    const shots = [["list.jpg", 2280 / 1160, "채용공고 목록 · 요건 태그와 마감일"], ["detail.jpg", 1080 / 740, "상세 보기 · 공고 원문 연결"], ["vi.jpg", 1440 / 650, "4개 언어 전환 (베트남어 화면)"]];
    let x = M;
    shots.forEach(([f, r, cap]) => {
      const w = h * r;
      s.addImage({ path: A(f), x, y: 1.95, w, h });
      s.addShape(ctx.pres.shapes.RECTANGLE, { x, y: 1.95, w, h, fill: { type: "none" }, line: { color: "D7DBE2", width: 1 } });
      T(s, cap, x, 1.95 + h + 0.07, w, 0.3, { fontSize: 11.5, bold: true, color: C.NAVY2 });
      x += w + gap;
    });
    const menus = [
      ["채용공고", "시안 구현", "검색·필터·충북 우선 정렬·원문 연결", "LuBriefcase", true],
      ["취업 프로그램", "다음 단계", "특강 신청·QR 출석·이수 확인", "LuPresentation"],
      ["멘토링", "다음 단계", "1:1 시간 슬롯 예약·대기자 자동 배정", "LuUsers"],
      ["기업회원", "다음 단계", "동의한 유학생 이력서 열람·면접 요청", "LuBuilding2"],
      ["대학 관리자", "다음 단계", "참여·출석 통계, 취업 성과 대시보드", "LuLayoutDashboard"],
    ];
    const cw = (W - 2 * M - 0.6) / 5, y = 4.55, ch = 2.25;
    for (let i = 0; i < 5; i++) {
      const [n, st, d, ic, live] = menus[i], cx = M + i * (cw + 0.15);
      card(s, cx, y, cw, ch, live ? C.NAVY : C.BG, { shadow: true });
      await iconCircle(s, cx + 0.2, y + 0.22, 0.62, ic, live ? C.ACCENT : C.WHITE, live ? C.WHITE : C.NAVY);
      pill(s, st, cx + cw - 1.0, y + 0.3, 0.85, 0.32, live ? C.ACCENT : C.WHITE, live ? C.WHITE : C.GRAY, { fs: 10, line: live ? C.ACCENT : "D7DBE2" });
      T(s, n, cx + 0.2, y + 1.0, cw - 0.35, 0.4, { fontSize: 15, bold: true, color: live ? C.WHITE : C.NAVY, valign: "middle" });
      T(s, d, cx + 0.2, y + 1.42, cw - 0.35, 0.7, { fontSize: 11.5, color: live ? "C9CED6" : C.GRAY });
    }
  }
}

module.exports = { addSiteSlides, SITE_URL };
