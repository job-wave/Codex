"""충북대 외국인 유학생 취업지원 프로그램 - 프로그램별 예산서 (xlsx) 생성.

단가 근거: 유사사업 견적서 「2026학년도 K-유학생 취업캠프 견적서」(국립한국교통대학교, 오프너랩㈜, 2026.10.16).
유사사업에 없는 항목(채용정보 사이트 등)은 가정치로 두고 노란색으로 표시한다.
"""
import sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.comments import Comment

OUT = sys.argv[1] if len(sys.argv) > 1 else "budget.xlsx"
FONT = "Arial"
BLUE, GREEN, BLACK, WHITE = "0000FF", "008000", "000000", "FFFFFF"
NAVY, RED, GRAY_FILL, YELLOW, PINK = "151B26", "B72654", "F4F5F7", "FFFF00", "F8E5EB"
thin = Side(style="thin", color="D7DBE2")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)
WON = '#,##0;(#,##0);"-"'

def f(color=BLACK, bold=False, size=10):
    return Font(name=FONT, color=color, bold=bold, size=size)

def fill(c):
    return PatternFill("solid", start_color=c, end_color=c)

def hdr(ws, row, values, color=NAVY):
    for i, v in enumerate(values, 1):
        c = ws.cell(row=row, column=i, value=v)
        c.font = f(WHITE, True); c.fill = fill(color); c.border = BORDER
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

wb = Workbook()

# ------------------------------------------------------------------ 단가기준
P = wb.active
P.title = "단가기준"
P["A1"] = "단가 기준 및 운영 가정"; P["A1"].font = f(NAVY, True, 14)
P["A2"] = "파란 글씨 = 입력값(수정 가능) · 노란 바탕 = 유사사업에 없는 항목의 가정치(확인 필요) · 금액 단위: 원, 부가세 별도"
P["A2"].font = f("5B6472", size=9)
hdr(P, 4, ["코드", "항목", "단가(원)", "단위", "근거"])
SRC = "유사사업 견적: 2026학년도 K-유학생 취업캠프(한국교통대, 오프너랩㈜, 2026.10.16)"
prices = [
    ("LEC", "특강 강사료", 250000, "원/회", SRC + " · 지역기업 탐색·취업전략 특강, 면접 대응전략 250,000원"),
    ("PRO", "현직자·인사담당자 사례비", 150000, "원/인·회", SRC + " · 현직자 멘토링 150,000원"),
    ("CON", "1:1 컨설팅 단가", 150000, "원/인·회", SRC + " · 1:1 취업전략·자소서 컨설팅 150,000원"),
    ("INT", "모의면접 면접관", 300000, "원/인·회", SRC + " · 모의면접 300,000원"),
    ("MEN", "전문멘토 일당 (1일 7명 지도)", "=C7*2", "원/인·일", "가정: 1:1 컨설팅 단가 × 2회차(오전·오후)"),
    ("BOOK", "교재·워크북", 15000, "원/인", SRC + " · 교재 15,000원"),
    ("MEAL", "식사", 10000, "원/인·식", SRC + " · 식사 10,000원"),
    ("SNACK", "다과", 150000, "원/회", SRC + " · 다과 150,000원"),
    ("BAN", "현수막·배너", 150000, "원/식", SRC + " · 현수막 및 배너 150,000원"),
    ("OPS", "운영제반비", 800000, "원/식", SRC + " · 운영제반비용 800,000원"),
    ("WEB1", "사이트 기본 기능 구축", 3000000, "원/식", "가정: 유사사업에 항목 없음 · 개발 업체 견적으로 대체 필요"),
    ("WEB2", "사이트 확장 기능 개발", 3000000, "원/식", "가정: 이력서 빌더·기업 매칭·관리자 대시보드 · 견적 확인 필요"),
    ("HOST", "호스팅·도메인", 300000, "원/년", "가정: 서버·도메인 연간 비용"),
    ("CUR", "공고 큐레이션 운영", 100000, "원/주", "가정: 주 1회 공고 원문 확인·게시 인건비"),
]
REF = {}
for i, (code, name, price, unit, src) in enumerate(prices):
    r = 5 + i
    P.cell(row=r, column=1, value=code)
    P.cell(row=r, column=2, value=name)
    c = P.cell(row=r, column=3, value=price)
    c.number_format = WON
    c.font = f(BLACK if isinstance(price, str) else BLUE)
    P.cell(row=r, column=4, value=unit)
    P.cell(row=r, column=5, value=src)
    if src.startswith("가정"):
        for col in range(1, 6):
            P.cell(row=r, column=col).fill = fill(YELLOW)
    REF[code] = f"단가기준!$C${r}"
assert REF["CON"] == "단가기준!$C$7"  # MEN 공식이 참조

r0 = 5 + len(prices) + 2
P.cell(row=r0 - 1, column=1, value="운영 가정").font = f(NAVY, True, 12)
hdr(P, r0, ["코드", "항목", "값", "단위", "근거"])
assumptions = [
    ("N_LEC", "특강 수강 인원", 30, "명", "가정: 회당 수강 인원"),
    ("N_MEN", "멘토링 참여 학생", 20, "명", "제안서 '운영일수 산정 예시' 기준"),
    ("CAP", "멘토 1일 정원", 7, "명", "제안서: 1인 1시간, 하루 최대 7명"),
    ("WEEKS", "사이트 운영(공고 큐레이션) 기간", 12, "주", "가정: 사업 기간 약 3개월"),
    ("CO_B", "잡페어 참여 기업 (기본형)", 3, "개사", "제안서 구성 옵션"),
    ("CO_E", "잡페어 참여 기업 (확장형)", 5, "개사", "제안서 구성 옵션"),
    ("STAFF", "잡페어 운영 인력", 10, "명", "제안서 운영 인력 배치(안): 총괄1·접수2·안내5·컨설팅2"),
    ("VAT", "부가세율", 0.1, "", "부가가치세 10%"),
]
for i, (code, name, val, unit, src) in enumerate(assumptions):
    r = r0 + 1 + i
    P.cell(row=r, column=1, value=code)
    P.cell(row=r, column=2, value=name)
    c = P.cell(row=r, column=3, value=val)
    c.font = f(BLUE)
    c.number_format = "0%" if code == "VAT" else "#,##0"
    P.cell(row=r, column=4, value=unit)
    P.cell(row=r, column=5, value=src)
    if src.startswith("가정"):
        for col in range(1, 6):
            P.cell(row=r, column=col).fill = fill(YELLOW)
    REF[code] = f"단가기준!$C${r}"
for r in list(range(5, 5 + len(prices))) + list(range(r0 + 1, r0 + 1 + len(assumptions))):
    for col in range(1, 6):
        P.cell(row=r, column=col).border = BORDER
P.column_dimensions["A"].width = 9
P.column_dimensions["B"].width = 30
P.column_dimensions["C"].width = 14
P.column_dimensions["D"].width = 10
P.column_dimensions["E"].width = 78

# ------------------------------------------------------------------ 프로그램 시트
def g(code):
    return REF[code]

programs = [
    ("01 취업 특강", "기본형 4강(1·2·4·6강) / 확장형 8강 전체 · 회당 2시간 내외", [
        ("운영비(강의료)", "특강 강사료", "LEC", 1, 4, 1, 7, "기본 4강, 확장 8강 중 7강을 뺀 7강"),
        ("운영비(강의료)", "7강 실전 모의면접 면접관", "INT", 0, 0, 2, 1, "확장형만 · 인사담당자 2명 참여"),
        ("인쇄물", "교재·워크북", "BOOK", f"={g('N_LEC')}", 1, f"={g('N_LEC')}", 1, "수강 인원 × 1권"),
        ("식사", "다과", "SNACK", 1, 4, 1, 8, "강의 회차마다 1회"),
        ("인쇄물", "현수막·배너(홍보)", "BAN", 1, 1, 1, 1, "모집 홍보용 1식"),
    ]),
    ("02 1:1 멘토링", "기본형 1인 2회(오프라인) / 확장형 1인 3회(오프라인·온라인) · 1인 1시간", [
        ("운영비(강의료)", "전문멘토 수당 (1일 7명)", "MEN", 1, f"=ROUNDUP({g('N_MEN')}*2/{g('CAP')},0)", 1, f"=ROUNDUP({g('N_MEN')}*3/{g('CAP')},0)", "횟수 = 학생 수 × 회차 ÷ 1일 정원 (올림)"),
        ("인쇄물", "워크시트·결과 리포트", "BOOK", f"={g('N_MEN')}", 1, f"={g('N_MEN')}", 1, "참여 학생 × 1부"),
    ]),
    ("03 채용정보 사이트", "기본형 공고·프로그램 신청 / 확장형 매칭·이력서 빌더·대시보드", [
        ("개발비", "사이트 기본 기능 구축 (시안 고도화)", "WEB1", 1, 1, 1, 1, "채용공고 검색·필터·다국어 (시안 구현 완료분 고도화)"),
        ("개발비", "사이트 확장 기능 개발", "WEB2", 0, 0, 1, 1, "확장형만 · 이력서 빌더·기업 매칭·관리자 대시보드"),
        ("운영비(기타)", "호스팅·도메인", "HOST", 1, 1, 1, 1, "1년"),
        ("운영비(기타)", "공고 큐레이션 운영", "CUR", 1, f"={g('WEEKS')}", 1, f"={g('WEEKS')}", "주 1회 공고 갱신 × 운영 주수"),
    ]),
    ("04 인사담당자 상담", "기본형 1회·인사담당자 3명 / 확장형 2회·5명 · 회당 140분 라운드제", [
        ("운영비(강의료)", "인사담당자 사례비", "PRO", 3, 1, 5, 2, "인원 × 운영 횟수"),
        ("식사", "다과", "SNACK", 1, 1, 1, 2, "운영 회차마다 1회"),
    ]),
    ("05 미니 K유학생 잡페어", "기본형 3개사 / 확장형 5개사 + 사전매칭 · 유학생 30~40명", [
        ("인쇄물", "현수막·배너", "BAN", 2, 1, 2, 1, "행사장 입구·접수처"),
        ("인쇄물", "기업용 외국인 고용 안내자료", "BOOK", f"={g('CO_B')}", 1, f"={g('CO_E')}", 1, "참여 기업 수 × 1부"),
        ("식사", "식사 (기업 인사담당자·운영 인력)", "MEAL", f"={g('CO_B')}*2+{g('STAFF')}", 1, f"={g('CO_E')}*2+{g('STAFF')}", 1, "기업당 2명 + 운영 인력"),
        ("식사", "다과", "SNACK", 1, 1, 1, 1, "행사 1회"),
        ("운영비(강의료)", "이력서 컨설팅 멘토", "CON", 2, 1, 2, 1, "현장 이력서 보완 2명"),
        ("운영비(기타)", "운영제반비 (현장 운영·물품)", "OPS", 1, 1, 1, 1, "유사사업 운영제반비용 준용"),
    ]),
    ("06 공통 운영", "사업 기획·홍보·결과보고서 등 프로그램 공통", [
        ("운영비(기타)", "공통 운영비 (기획·홍보·결과보고)", "OPS", 1, 1, 1, 1, "유사사업 운영제반비용 준용"),
    ]),
]

TOTALS = []  # (name, sheet, 기본 공급가 셀, 확장 공급가 셀)
for title, desc, items in programs:
    ws = wb.create_sheet(title.replace("1:1 ", "").replace(" ", "_")[:31])
    sname = ws.title
    ws["A1"] = f"[{title}] 예산서"; ws["A1"].font = f(NAVY, True, 14)
    ws["A2"] = desc; ws["A2"].font = f("5B6472", size=9)
    ws.merge_cells("D4:F4"); ws.merge_cells("G4:I4")
    ws["D4"] = "기본형"; ws["G4"] = "확장형"
    for c, col in (("D4", NAVY), ("G4", RED)):
        ws[c].font = f(WHITE, True); ws[c].fill = fill(col); ws[c].alignment = Alignment(horizontal="center")
    hdr(ws, 5, ["구분", "항목", "단가(원)", "수량", "횟수", "금액(원)", "수량", "횟수", "금액(원)", "산출 근거"])
    for c in ("G5", "H5", "I5"):
        ws[c].fill = fill(RED)
    for i, (cat, name, code, bq, bc, eq, ec, note) in enumerate(items):
        r = 6 + i
        ws.cell(row=r, column=1, value=cat)
        ws.cell(row=r, column=2, value=name)
        c = ws.cell(row=r, column=3, value=f"={g(code)}"); c.font = f(GREEN); c.number_format = WON
        for col, v in ((4, bq), (5, bc), (7, eq), (8, ec)):
            c = ws.cell(row=r, column=col, value=v)
            c.font = f(GREEN if isinstance(v, str) else BLUE)
            c.number_format = "#,##0;(#,##0);\"-\""
            c.alignment = Alignment(horizontal="center")
        ws.cell(row=r, column=6, value=f"=C{r}*D{r}*E{r}").number_format = WON
        ws.cell(row=r, column=9, value=f"=C{r}*G{r}*H{r}").number_format = WON
        ws.cell(row=r, column=10, value=note)
        if code in ("WEB1", "WEB2", "HOST", "CUR", "MEN"):
            ws.cell(row=r, column=2).fill = fill(YELLOW)
            ws.cell(row=r, column=2).comment = Comment("단가가 유사사업에 없는 가정치입니다. 단가기준 시트에서 수정하세요.", "JobWave")
        for col in range(1, 11):
            ws.cell(row=r, column=col).border = BORDER
            if ws.cell(row=r, column=col).font.name != FONT:
                ws.cell(row=r, column=col).font = f()
    last = 5 + len(items)
    s = last + 1
    rows = [("공급가액", f"=SUM(F6:F{last})", f"=SUM(I6:I{last})"),
            ("부가세", f"=ROUND(F{s}*{g('VAT')},0)", f"=ROUND(I{s}*{g('VAT')},0)"),
            ("합계 (VAT 포함)", f"=F{s}+F{s+1}", f"=I{s}+I{s+1}")]
    for k, (lab, fb, fe) in enumerate(rows):
        r = s + k
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=5)
        ws.cell(row=r, column=1, value=lab)
        ws.cell(row=r, column=6, value=fb).number_format = WON
        ws.merge_cells(start_row=r, start_column=7, end_row=r, end_column=8)
        ws.cell(row=r, column=9, value=fe).number_format = WON
        for col in range(1, 11):
            c = ws.cell(row=r, column=col)
            c.font = f(WHITE if k == 2 else NAVY, True)
            c.fill = fill(NAVY if k == 2 else GRAY_FILL)
            c.border = BORDER
        ws.cell(row=r, column=1).alignment = Alignment(horizontal="center")
    for col, w in zip("ABCDEFGHIJ", (14, 34, 12, 8, 8, 14, 8, 8, 14, 48)):
        ws.column_dimensions[col].width = w
    ws.freeze_panes = "A6"
    TOTALS.append((title, sname, f"F{s}", f"I{s}"))

# ------------------------------------------------------------------ 요약
S = wb.create_sheet("요약", 0)
S["A1"] = "충북대학교 외국인 유학생 취업지원 프로그램 · 프로그램별 예산 요약"; S["A1"].font = f(NAVY, True, 14)
S["A2"] = "단가 근거: " + SRC + " · 부가세 별도 금액을 합산한 뒤 VAT 10%를 더하고 만원 단위 절사 (유사사업 견적 방식 준용)"
S["A2"].font = f("5B6472", size=9)
hdr(S, 4, ["프로그램", "기본형 공급가(원)", "확장형 공급가(원)", "비고"])
S["C4"].fill = fill(RED)
notes = {
    "01 취업 특강": "확장형 7강에 면접관 2명 포함",
    "02 1:1 멘토링": "학생 20명 기준, 멘토 일당은 가정치",
    "03 채용정보 사이트": "개발·호스팅·큐레이션 단가 전부 가정치 (견적 확인 필요)",
    "04 인사담당자 상담": "현직자 멘토링 단가 준용",
    "05 미니 K유학생 잡페어": "통역은 별도 예산",
    "06 공통 운영": "유사사업 운영제반비용 준용",
}
for i, (title, sname, cb, ce) in enumerate(TOTALS):
    r = 5 + i
    S.cell(row=r, column=1, value=title)
    for col, ref in ((2, cb), (3, ce)):
        c = S.cell(row=r, column=col, value=f"='{sname}'!{ref}")
        c.font = f(GREEN); c.number_format = WON
    S.cell(row=r, column=4, value=notes.get(title, ""))
    for col in range(1, 5):
        S.cell(row=r, column=col).border = BORDER
        if S.cell(row=r, column=col).font.name != FONT:
            S.cell(row=r, column=col).font = f()
    if title.startswith("03"):
        S.cell(row=r, column=1).fill = fill(YELLOW)
last = 4 + len(TOTALS)
t = last + 1
summary = [
    ("공급가액 합계", f"=SUM(B5:B{last})", f"=SUM(C5:C{last})"),
    ("부가세 (10%)", f"=ROUND(B{t}*{g('VAT')},0)", f"=ROUND(C{t}*{g('VAT')},0)"),
    ("합계", f"=B{t}+B{t+1}", f"=C{t}+C{t+1}"),
    ("총계 (만원 단위 절사)", f"=ROUNDDOWN(B{t+2},-4)", f"=ROUNDDOWN(C{t+2},-4)"),
]
for k, (lab, fb, fe) in enumerate(summary):
    r = t + k
    S.cell(row=r, column=1, value=lab)
    S.cell(row=r, column=2, value=fb).number_format = WON
    S.cell(row=r, column=3, value=fe).number_format = WON
    for col in range(1, 5):
        c = S.cell(row=r, column=col)
        c.font = f(WHITE if k == 3 else NAVY, True)
        c.fill = fill(NAVY if k == 3 else GRAY_FILL)
        c.border = BORDER

# 추천 조합 (제안서 31~36쪽 목적별 추천 조합)
c0 = t + 6
S.cell(row=c0 - 1, column=1, value="목적별 추천 조합 (공통 운영 포함, VAT 포함, 만원 단위 절사)").font = f(NAVY, True, 12)
hdr(S, c0, ["조합", "기본형 구성(원)", "확장형 구성(원)", "포함 프로그램"])
S.cell(row=c0, column=3).fill = fill(RED)
combos = [("A 역량집중형", [0, 1], "01 특강 + 02 멘토링"),
          ("B 채용연계형", [2, 3, 4], "03 사이트 + 04 상담 + 05 잡페어"),
          ("C 통합형 (추천)", [0, 1, 2, 3, 4], "01~05 전체")]
for i, (name, idx, desc) in enumerate(combos):
    r = c0 + 1 + i
    S.cell(row=r, column=1, value=name)
    for col, letter in ((2, "B"), (3, "C")):
        cells = "+".join(f"{letter}{5 + j}" for j in idx + [5])  # 공통 운영(6번째 행) 포함
        c = S.cell(row=r, column=col, value=f"=ROUNDDOWN(({cells})*(1+{g('VAT')}),-4)")
        c.number_format = WON
    S.cell(row=r, column=4, value=desc + " + 공통 운영")
    for col in range(1, 5):
        S.cell(row=r, column=col).border = BORDER
        if S.cell(row=r, column=col).font.name != FONT:
            S.cell(row=r, column=col).font = f()
n0 = c0 + 5
S.cell(row=n0, column=1, value="참고").font = f(NAVY, True)
for i, txt in enumerate([
    "파란 글씨는 입력값, 초록 글씨는 다른 시트 연결, 노란 바탕은 유사사업에 없어 가정한 단가입니다. 단가기준 시트를 바꾸면 전체가 다시 계산됩니다.",
    "채용정보 사이트 개발·운영 단가는 유사사업 견적에 없어 가정치로 넣었습니다. 개발 업체 견적을 받아 단가기준 시트에서 바꿔 주세요.",
    "영어 가능 강사 할증과 통역은 제안서 추가 옵션으로 이 예산에 포함하지 않았습니다.",
]):
    S.cell(row=n0 + 1 + i, column=1, value=f"{i + 1}. {txt}").font = f("5B6472", size=9)
S.column_dimensions["A"].width = 26
S.column_dimensions["B"].width = 18
S.column_dimensions["C"].width = 18
S.column_dimensions["D"].width = 52
for ws in wb.worksheets:
    ws.sheet_view.showGridLines = False
    for row in ws.iter_rows():
        for c in row:
            if c.value is not None and c.font.name != FONT:
                c.font = f()
wb.save(OUT)
print("saved", OUT)
