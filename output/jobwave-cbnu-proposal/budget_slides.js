// 06 예산서(안) 슬라이드: budget/JobWave_budget.xlsx 를 recalc 한 뒤 export_json.py 로 뽑은 값을 그린다.
const path = require("path");
const B = require(path.resolve(__dirname, "budget", "budget_values.json"));
const FONT = "Pretendard Variable", LINE = "E3E6EA";
const won = (v) => (v ? Math.round(v).toLocaleString("ko-KR") : "-");
const man = (v) => (v / 10000).toLocaleString("ko-KR", { maximumFractionDigits: 1 }) + "만 원";
const SRC = "단가 근거: 유사사업 「2026학년도 K-유학생 취업캠프」 견적(국립한국교통대학교, 2026.10.16) · 부가세 별도 · * 표시는 유사사업에 없는 항목의 가정 단가";
const CRUMB = "05 예산서(안)";

function qty(q, c) {
  if (!q || !c) return "-";
  return c === 1 ? `${q}` : `${q}×${c}`;
}

async function addBudgetSlides(ctx) {
  const { content, T, card, pill, W, M, colors: C } = ctx;
  const P = B.programs;
  const short = { "01 취업 특강": "기본 4강 / 확장 8강", "02 1:1 멘토링": "학생 20명 · 1인 2회 / 3회", "03 채용정보 사이트": "구축·호스팅·큐레이션 *", "04 인사담당자 상담": "3명 1회 / 5명 2회", "05 미니 K유학생 잡페어": "참여 기업 3개사 / 5개사", "06 공통 운영": "기획·홍보·결과보고" };

  // ---------------- 예산 요약 ----------------
  {
    const s = content(CRUMB, "예산 요약", "프로그램별 기본형·확장형 예산 · 공급가 합산 후 부가세 10% 포함, 만원 단위 절사");
    const H = (t, fill, align = "center") => ({ text: t, options: { bold: true, color: C.WHITE, fill: { color: fill }, align } });
    const data = [[H("프로그램", C.NAVY, "left"), H("기본형 (원)", C.NAVY), H("확장형 (원)", C.ACCENT), H("산출 기준", C.NAVY, "left")]];
    P.forEach((p, i) => {
      const bg = i % 2 ? C.BG : C.WHITE;
      data.push([
        { text: p.title, options: { bold: true, fill: { color: bg } } },
        { text: won(p.b), options: { align: "right", fill: { color: bg } } },
        { text: won(p.e), options: { align: "right", bold: true, fill: { color: i % 2 ? C.OTINT : "FBF1F4" } } },
        { text: short[p.title] || "", options: { color: C.GRAY, fill: { color: bg } } },
      ]);
    });
    const S = B.summary;
    const sumRow = (label, key, dark) => {
      const o = dark ? { bold: true, color: C.WHITE, fill: { color: C.NAVY } } : { bold: true, color: C.NAVY, fill: { color: "E8EAF0" } };
      return [{ text: label, options: o }, { text: won(S[key][0]), options: { ...o, align: "right" } }, { text: won(S[key][1]), options: { ...o, align: "right", ...(dark ? { fill: { color: C.ACCENT } } : {}) } }, { text: "", options: o }];
    };
    data.push(sumRow("공급가액 합계", "공급가액 합계"));
    data.push(sumRow("부가세 (10%)", "부가세 (10%)"));
    data.push(sumRow("총계 (VAT 포함)", "총계 (만원 단위 절사)", true));
    s.addTable(data, { x: M, y: 1.95, w: 8.15, colW: [2.75, 1.45, 1.45, 2.5], rowH: 0.41, fontSize: 12, fontFace: FONT, color: C.NAVY, border: { type: "solid", pt: 0.5, color: LINE }, valign: "middle", margin: [0, 0.1, 0, 0.12] });

    // 오른쪽: 추천 조합별 총액
    const x0 = M + 8.45, w0 = W - M - x0;
    T(s, "목적별 추천 조합 총액 (VAT 포함)", x0, 1.95, w0, 0.35, { fontSize: 13, bold: true, color: C.GRAY });
    const desc = { "A 역량집중형": "특강 + 멘토링", "B 채용연계형": "사이트 + 상담 + 잡페어", "C 통합형 (추천)": "01~05 전체" };
    B.combos.forEach(([name, b, e], k) => {
      const y = 2.38 + k * 1.45, rec = k === 2;
      card(s, x0, y, w0, 1.3, rec ? C.NAVY : C.BG, { shadow: true });
      T(s, name, x0 + 0.22, y + 0.1, w0 - 0.4, 0.38, { fontSize: 15, bold: true, color: rec ? C.WHITE : C.NAVY, valign: "middle" });
      T(s, desc[name] + " + 공통 운영", x0 + 0.22, y + 0.46, w0 - 0.4, 0.28, { fontSize: 10.5, color: rec ? "C9CED6" : C.GRAY, valign: "middle" });
      T(s, [{ text: "기본 ", options: { fontSize: 11, color: rec ? "C9CED6" : C.GRAY } }, { text: man(b), options: { fontSize: 15, bold: true, color: rec ? C.WHITE : C.NAVY } }], x0 + 0.22, y + 0.8, w0 / 2 - 0.2, 0.4, { valign: "middle" });
      T(s, [{ text: "확장 ", options: { fontSize: 11, color: rec ? "C9CED6" : C.GRAY } }, { text: man(e), options: { fontSize: 15, bold: true, color: rec ? "F2A6BC" : C.ACCENT } }], x0 + w0 / 2, y + 0.8, w0 / 2 - 0.2, 0.4, { valign: "middle" });
    });
    T(s, SRC, M, 6.78, W - 2 * M, 0.24, { fontSize: 9.5, color: C.MUTED });
  }

  // ---------------- 산출 내역 (2장) ----------------
  const pages = [[0, 1, 3], [2, 4, 5]];
  for (let pg = 0; pg < 2; pg++) {
    const ids = pages[pg];
    const s = content(CRUMB, `프로그램별 산출 내역 (${pg + 1}/2)`, ids.map((i) => P[i].title).join(" · ") + " · 단위: 원, 부가세 별도");
    const H = (t, fill, align = "center") => ({ text: t, options: { bold: true, color: C.WHITE, fill: { color: fill }, align, fontSize: 11 } });
    const data = [[H("항목", C.NAVY, "left"), H("단가", C.NAVY), H("기본 수량", C.NAVY), H("기본형 금액", C.NAVY), H("확장 수량", C.ACCENT), H("확장형 금액", C.ACCENT), H("산출 근거", C.NAVY, "left")]];
    for (const i of ids) {
      const p = P[i];
      data.push([{ text: `${p.title} · ${p.desc}`, options: { colspan: 7, bold: true, color: C.ACCENT, fill: { color: C.OTINT }, fontSize: 11 } }]);
      p.items.forEach((it) => {
        data.push([
          { text: it.name + (it.assumed ? " *" : ""), options: {} },
          { text: won(it.price), options: { align: "right" } },
          { text: qty(it.bq, it.bc), options: { align: "center", color: C.GRAY } },
          { text: won(it.b), options: { align: "right" } },
          { text: qty(it.eq, it.ec), options: { align: "center", color: C.GRAY } },
          { text: won(it.e), options: { align: "right", bold: true } },
          { text: it.note || "", options: { color: C.GRAY, fontSize: 9.5 } },
        ]);
      });
      const o = { bold: true, fill: { color: "E8EAF0" } };
      data.push([{ text: "소계 (공급가)", options: o }, { text: "", options: o }, { text: "", options: o }, { text: won(p.b), options: { ...o, align: "right" } }, { text: "", options: o }, { text: won(p.e), options: { ...o, align: "right", color: C.ACCENT } }, { text: "", options: o }]);
    }
    s.addTable(data, { x: M, y: 1.88, w: W - 2 * M, colW: [3.0, 1.0, 0.95, 1.25, 0.95, 1.25, 3.73], rowH: 0.26, fontSize: 10.5, fontFace: FONT, color: C.NAVY, border: { type: "solid", pt: 0.5, color: LINE }, valign: "middle", margin: [0, 0.08, 0, 0.1] });
    T(s, SRC, M, 6.86, W - 2 * M, 0.2, { fontSize: 9, color: C.MUTED });
  }
}

module.exports = { addBudgetSlides };
