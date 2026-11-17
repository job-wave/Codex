"""recalc된 예산 xlsx에서 슬라이드용 값을 JSON으로 뽑는다."""
import json, sys
from openpyxl import load_workbook
wb = load_workbook(sys.argv[1], data_only=True)
out = {"programs": [], "summary": {}, "combos": []}
for ws in wb.worksheets[2:]:
    items = []
    r = 6
    while ws.cell(row=r, column=1).value not in ("공급가액", None):
        v = [ws.cell(row=r, column=c).value for c in range(1, 11)]
        items.append({"cat": v[0], "name": v[1], "price": v[2], "bq": v[3], "bc": v[4], "b": v[5],
                      "eq": v[6], "ec": v[7], "e": v[8], "note": v[9],
                      "assumed": ws.cell(row=r, column=2).fill.fgColor.rgb in ("00FFFF00", "FFFFFF00")})
        r += 1
    out["programs"].append({"title": ws["A1"].value.strip("[]").replace("] 예산서", "").replace("[", ""),
                            "desc": ws["A2"].value, "items": items,
                            "b": ws.cell(row=r, column=6).value, "e": ws.cell(row=r, column=9).value})
S = wb["요약"]
rows = {S.cell(row=r, column=1).value: (S.cell(row=r, column=2).value, S.cell(row=r, column=3).value) for r in range(5, 40)}
out["summary"] = {k: rows[k] for k in ("공급가액 합계", "부가세 (10%)", "합계", "총계 (만원 단위 절사)")}
out["combos"] = [(k, *rows[k]) for k in ("A 역량집중형", "B 채용연계형", "C 통합형 (추천)")]
json.dump(out, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
print([p["title"] for p in out["programs"]], out["summary"])
