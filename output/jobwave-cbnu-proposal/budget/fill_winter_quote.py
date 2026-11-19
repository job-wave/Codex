"""잡웨이브 견적서 양식(xlsx)에 동계방학 취업 프로그램 예산을 채운다.
사용: python fill_winter_quote.py 양식.xlsx 출력.xlsx
양식의 15행(표 머리)~33행(특약) 서식을 복사해 항목 수에 맞게 표를 다시 그린다."""
import sys, datetime
from copy import copy
from openpyxl import load_workbook

src, out = sys.argv[1], sys.argv[2]
wb = load_workbook(src)
ws = wb.active
COLS = "ABCDEFGHIJK"

def snap(r):
    return {c: (copy(ws[f"{c}{r}"]._style)) for c in COLS}, ws.row_dimensions[r].height

S_HEAD, S_ITEM_FIRST, S_ITEM, S_SUB = snap(15), snap(16), snap(17), snap(21)
S_SUPPLY, S_VAT, S_TOTAL = snap(26), snap(27), snap(28)
S_BLANK, S_NOTE_H, S_NOTE = snap(29), snap(30), snap(31)
S_NOTE2, S_NOTE3 = snap(32), snap(33)

# 15행 이하 병합·값 지우기
for rng in list(ws.merged_cells.ranges):
    if rng.min_row >= 15:
        ws.unmerge_cells(str(rng))
for r in range(15, 80):
    for c in COLS:
        ws[f"{c}{r}"].value = None
        ws[f"{c}{r}"]._style = copy(S_BLANK[0][c])
    ws.row_dimensions[r].height = None

def put(r, style, vals=None, merges=()):
    st, h = style
    for c in COLS:
        ws[f"{c}{r}"]._style = copy(st[c])
    ws.row_dimensions[r].height = h
    for k, v in (vals or {}).items():
        ws[f"{k}{r}"] = v
    for m in merges:
        ws.merge_cells(m.format(r=r))

# ---- 머리 정보 ----
ws["A4"] = "[ 충북대 외국인 유학생 동계방학 취업 프로그램 견적서 ]"
ws["B6"] = "충북대학교"
ws["B7"] = "외국인 유학생 동계방학 취업 프로그램"
ws["B8"] = "(담당자 확인 필요)"
ws["B9"] = datetime.datetime(2026, 11, 19)

# ---- 예산 (제안서 06 예산서(안)과 동일, 유사사업 단가 기준) ----
GROUPS = [
    ("취업 특강", "a", [
        ("특강 강사료 (2시간)", 250000, 1, 4, "1~4주차 주 1회", "명", "회"),
        ("교재·워크북", 15000, 30, 1, "수강 30명", "부", "식"),
        ("다과", 150000, 1, 4, "강의 회차마다", "식", "회"),
    ]),
    ("1:1 멘토링", "b", [
        ("전문멘토 수당 (1일)", 300000, 3, 2, "멘토 3명 × 2일", "명", "일"),
        ("다과", 150000, 1, 2, "운영일마다", "식", "일"),
    ]),
    ("기업 멘토링 데이", "c", [
        ("인사담당자 사례비 (1일)", 300000, 10, 1, "5개사 × 2명", "명", "일"),
        ("통역 (영어·중국어)", 300000, 2, 1, "언어별 1명", "명", "일"),
        ("식사", 10000, 45, 1, "학생·인사담당자·운영", "명", "식"),
        ("다과", 150000, 1, 1, "행사 1회", "식", "회"),
        ("기업용 외국인 고용 안내자료", 15000, 5, 1, "참여 기업 수", "부", "식"),
    ]),
    ("채용정보 사이트", "d", [
        ("사이트 기능 보완", 1500000, 1, 1, "신청·예약·기업 선택", "식", "식"),
        ("호스팅·도메인", 300000, 1, 1, "1년", "식", "년"),
        ("공고 큐레이션 운영", 100000, 1, 8, "주 1회 × 8주", "식", "주"),
    ]),
    ("공통 운영", "e", [
        ("현장 운영 보조 인력", 150000, 1, 7, "운영일 7일", "명", "일"),
        ("홍보물 (현수막·배너·포스터)", 150000, 2, 1, "모집·행사장", "식", "식"),
        ("수료증·우수 수료자 시상", 400000, 1, 1, "수료증 30·시상 5명", "식", "식"),
        ("운영제반비", 800000, 1, 1, "기획·결과보고", "식", "식"),
    ]),
]

r = 15
put(r, S_HEAD, {"A": "구분", "B": "내역", "C": "단가", "E": "수량", "G": "횟수", "I": "견 적 가", "J": "비 고"},
    ["C{r}:D{r}", "E{r}:F{r}", "G{r}:H{r}", "J{r}:K{r}"])
r += 1
subs = []
for name, key, items in GROUPS:
    first = r
    for i, (n, p, q, t, note, uq, ut) in enumerate(items):
        put(r, S_ITEM_FIRST if i == 0 else S_ITEM,
            {"B": n, "C": p, "E": q, "G": t, "I": f"=C{r}*E{r}*G{r}", "J": note},
            ["C{r}:D{r}", "E{r}:F{r}", "G{r}:H{r}", "J{r}:K{r}"])
        ws[f"E{r}"].number_format = f'General"{uq}"'
        ws[f"G{r}"].number_format = f'General"{ut}"'
        r += 1
    ws[f"A{first}"] = name
    ws.merge_cells(f"A{first}:A{r-1}")
    put(r, S_SUB, {"A": f"소계 ( {key} )", "I": f"=SUM(I{first}:I{r-1})"}, ["A{r}:H{r}", "J{r}:K{r}"])
    subs.append(f"I{r}")
    r += 1

keys = " + ".join(k for _, k, _ in GROUPS)
put(r, S_SUPPLY, {"A": f"공급가액 합계 ( {keys} )", "I": "=" + "+".join(subs)}, ["A{r}:H{r}", "J{r}:K{r}"]); sup = r; r += 1
put(r, S_VAT, {"A": "부가세 ( VAT 10% )", "I": f"=ROUND(I{sup}*0.1,0)"}, ["A{r}:H{r}", "J{r}:K{r}"]); vat = r; r += 1
put(r, S_TOTAL, {"A": "최종 견적금액 (VAT 포함)", "I": f"=ROUNDDOWN(SUM(I{sup}:I{vat}),-4)", "J": "만원단위 절사"}, ["A{r}:H{r}", "J{r}:K{r}"]); tot = r; r += 1
put(r, S_BLANK); r += 1
put(r, S_NOTE_H, {"A": "※ Note.", "F": "※ 특약사항."}, ["A{r}:D{r}", "F{r}:K{r}"]); r += 1
put(r, S_NOTE, {"A": "1. 상기 서비스 내용이 변경될 경우, 견적가가 변동될 수 있습니다.",
                "F": "- 총액 14,932,500원에서 2,500원 절사"}, ["A{r}:D{r}", "F{r}:K{r}"]); r += 1
put(r, S_NOTE2, {"A": "2. 본 견적은 1개월간 효력이 유지 됩니다.",
                 "F": "- 참여 학생 30명 기준, 인원 변동 시 교재·식사 조정"}, ["A{r}:D{r}", "F{r}:K{r}"]); r += 1
put(r, S_NOTE3, {"F": "- 일정: 2027. 1. 4. ~ 2. 19. (7주, 기업 멘토링 데이 2. 17.)"}, ["F{r}:K{r}"])

ws["B13"] = "일금 일천사백구십삼만 원정"
ws["C13"] = f"=I{tot}"
ws.print_area = f"A1:K{r}"
wb.save(out)
print("total row", tot, "last row", r)
