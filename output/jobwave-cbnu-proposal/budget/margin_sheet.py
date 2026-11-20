"""견적서 엑셀에 '수익률 분석' 시트를 붙인다 (잡웨이브 견적서 공통).

원가 기준 (2026-11 합의):
- 인건비(강사비·멘토링·인사담당자 사례비 등): 투입 시간 × 시간당 10만 원
- 운영 인력비(운영 보조 인력 등): 원가 0
- 현수막·배너·교재·다과·홍보물·시상·수료증 등 물품: 견적 단가 그대로 원가
- 운영제반비(운영재정비): 원가 0, 전액 수익
- 그 밖의 항목은 가정치(노란 바탕)로 두고 시트에서 고쳐 쓴다.

매출은 견적 시트 셀을 그대로 참조하므로 견적이 바뀌면 분석도 자동으로 다시 계산된다.
"""
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

LABOR_RATE = 100000

# (키워드, 원가 기준, 단위당 투입 시간, 설명) — 위에서부터 먼저 맞는 것을 쓴다
RULES = [
    ("운영제반", "profit", None, "전액 수익 (원가 0)"),
    ("운영재정", "profit", None, "전액 수익 (원가 0)"),
    ("운영 보조", "zero", None, "운영 인력비 (원가 0)"),
    ("운영 인력", "zero", None, "운영 인력비 (원가 0)"),
    ("운영인력", "zero", None, "운영 인력비 (원가 0)"),
    ("시간당", "labor", 1, "인건비 · 1시간"),
    ("강사", "labor", 2, "인건비 · 회당 2시간"),
    ("사례비", "labor", 5, "인건비 · 하루 5시간 (10~16시, 점심 제외)"),
    ("멘토", "labor", 1, "인건비 · 1시간"),
    ("교재", "pass", None, "물품 (단가 = 원가)"),
    ("현수막", "pass", None, "물품 (단가 = 원가)"),
    ("배너", "pass", None, "물품 (단가 = 원가)"),
    ("다과", "pass", None, "물품 (단가 = 원가)"),
    ("홍보물", "pass", None, "물품 (단가 = 원가)"),
    ("시상", "pass", None, "물품 (단가 = 원가)"),
    ("수료증", "pass", None, "물품 (단가 = 원가)"),
    ("안내자료", "pass", None, "물품 (단가 = 원가)"),
    ("식사", "pass", None, "물품 (단가 = 원가)"),
    ("호스팅", "pass", None, "외부 비용 (단가 = 원가)"),
]


def classify(name):
    for kw, basis, hours, desc in RULES:
        if kw in name:
            return basis, hours, desc
    return "assume", None, "가정: 자체 수행 (원가 0) · 확인 필요"


def add_margin_sheet(wb, qs, items, sup_row, vat_row, tot_row, font_name="Pretendard Variable"):
    """items: [(구분, 항목명, 견적 시트 행번호), ...]"""
    ms = wb.create_sheet("수익률 분석")
    Q = f"'{qs.title}'!"
    thin = Side(style="thin", color="D7DBE2")
    B = Border(left=thin, right=thin, top=thin, bottom=thin)
    WON = '#,##0;[Red]-#,##0;"-"'
    PCT = '0.0%;[Red]-0.0%;"-"'

    def f(color="000000", bold=False, size=10):
        return Font(name=font_name, color=color, bold=bold, size=size)

    def fill(c):
        return PatternFill("solid", start_color=c, end_color=c)

    ms["A1"] = f"[ 수익률 분석 ] {qs['B7'].value or ''}"
    ms["A1"].font = f("20231C", True, 16)
    ms["A2"] = "공급가(부가세 제외) 기준 · 매출은 견적 시트 연결 · 파란 글씨 = 입력값 · 노란 바탕 = 가정치"
    ms["A2"].font = f("5B6472", size=9)
    ms["A4"] = "시간당 인건비 원가"
    ms["A4"].font = f(bold=True)
    ms["C4"] = LABOR_RATE
    ms["C4"].font = f("0000FF", True)
    ms["C4"].number_format = WON
    ms["D4"] = "원 (강사·멘토·인사담당자 등)"
    ms["D4"].font = f("5B6472", size=9)

    heads = ["구분", "항목", "매출 (견적가)", "원가 기준", "단위당 시간", "원가 단가", "수량", "원가", "이익", "이익률"]
    for i, h in enumerate(heads, 1):
        c = ms.cell(row=6, column=i, value=h)
        c.font = f("FFFFFF", True)
        c.fill = fill("20231C")
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = B
    r = 7
    first = r
    flagged = []
    for grp, name, qr in items:
        basis, hours, desc = classify(name)
        ms.cell(row=r, column=1, value=grp)
        ms.cell(row=r, column=2, value=name)
        ms.cell(row=r, column=3, value=f"={Q}I{qr}").font = f("008000")
        ms.cell(row=r, column=4, value=desc)
        if basis == "labor":
            ms.cell(row=r, column=5, value=hours).font = f("0000FF")
            ms.cell(row=r, column=6, value=f"=$C$4*E{r}")
        elif basis == "pass":
            ms.cell(row=r, column=6, value=f"={Q}C{qr}").font = f("008000")
        else:
            ms.cell(row=r, column=6, value=0).font = f("0000FF")
        ms.cell(row=r, column=7, value=f"={Q}E{qr}*{Q}G{qr}").font = f("008000")
        ms.cell(row=r, column=8, value=f"=F{r}*G{r}")
        ms.cell(row=r, column=9, value=f"=C{r}-H{r}")
        ms.cell(row=r, column=10, value=f"=IFERROR(I{r}/C{r},0)")
        for col in range(1, 11):
            c = ms.cell(row=r, column=col)
            c.border = B
            if c.font.name != font_name:
                c.font = f()
            if col in (3, 6, 8, 9):
                c.number_format = WON
            if col == 10:
                c.number_format = PCT
            if col in (5, 7):
                c.alignment = Alignment(horizontal="center")
        if basis == "assume":
            flagged.append(name)
            for col in (4, 6):
                ms.cell(row=r, column=col).fill = fill("FFFF00")
        r += 1
    last = r - 1

    rows = [
        ("공급가액 (매출)", f"=SUM(C{first}:C{last})", WON),
        ("원가 합계", f"=SUM(H{first}:H{last})", WON),
        ("매출이익", f"=C{r}-C{r+1}", WON),
        ("이익률 (공급가 기준)", f"=IFERROR(C{r+2}/C{r},0)", PCT),
        ("견적 절사액", f"={Q}I{sup_row}+{Q}I{vat_row}-{Q}I{tot_row}", WON),
        ("절사 반영 이익", f"=C{r+2}-ROUND(C{r+4}/1.1,0)", WON),
        ("절사 반영 이익률", f"=IFERROR(C{r+5}/(C{r}-ROUND(C{r+4}/1.1,0)),0)", PCT),
    ]
    r += 0
    top = r
    for k, (lab, fm, nf) in enumerate(rows):
        rr = top + k
        ms.merge_cells(start_row=rr, start_column=1, end_row=rr, end_column=2)
        ms.cell(row=rr, column=1, value=lab)
        c = ms.cell(row=rr, column=3, value=fm)
        c.number_format = nf
        key = lab.startswith("매출이익") or lab.startswith("이익률")
        for col in (1, 2, 3):
            cc = ms.cell(row=rr, column=col)
            cc.font = f("FFFFFF" if key else "20231C", True)
            cc.fill = fill("B72654" if key else "F3F5EF")
            cc.border = B
    nr = top + len(rows) + 1
    notes = [
        "원가 기준: 인건비 = 투입 시간 × 시간당 단가(C4) · 운영 인력비 = 0 · 물품(현수막·배너·교재·다과·홍보물·시상) = 견적 단가 · 운영제반비 = 전액 수익",
        "절사 반영 이익: 최종 견적금액의 만 원 단위 절사액(부가세 포함)을 공급가 기준으로 환산해 뺀 값",
    ]
    if flagged:
        notes.append("노란 바탕은 원가 기준이 정해지지 않은 항목(" + ", ".join(flagged) + ")으로, 자체 수행 가정(원가 0)입니다. F열에서 고쳐 주세요.")
    for i, t in enumerate(notes):
        c = ms.cell(row=nr + i, column=1, value=f"{i + 1}. {t}")
        c.font = f("5B6472", size=9)
    for col, w in zip("ABCDEFGHIJ", (16, 30, 14, 34, 10, 12, 8, 13, 13, 9)):
        ms.column_dimensions[col].width = w
    ms.freeze_panes = "A7"
    ms.sheet_view.showGridLines = False
    ms.page_setup.orientation = "landscape"
    ms.page_setup.fitToWidth = 1
    ms.page_setup.fitToHeight = 0
    ms.sheet_properties.pageSetUpPr.fitToPage = True
    return ms, flagged
