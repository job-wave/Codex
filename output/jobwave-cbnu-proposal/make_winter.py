"""build.js 의 디자인·도우미(머리)와 추진 배경 슬라이드, 연락처·마무리(꼬리)에 winter_body.js 를 끼워 build_winter.js 를 만든다."""
from pathlib import Path
D = Path(__file__).resolve().parent
src = (D / "build.js").read_text(encoding="utf-8")
L = src.split("\n")
def idx(marker):
    return next(i for i, l in enumerate(L) if marker in l)
head = "\n".join(L[: idx("(async () => {")])
head = head.replace('"JobWave_proposal_visual.pptx"', '"JobWave_winter_program.pptx"')
head = head.replace('pres.title = "충북대학교 외국인 유학생 취업지원 프로그램 제안서";', 'pres.title = "충북대 외국인 유학생 동계방학 취업 프로그램 제안서";')
head = head.replace('const FOOT = "충북대학교 외국인 유학생 취업지원 프로그램";', 'const FOOT = "충북대 외국인 유학생 동계방학 취업 프로그램";')
assert "JobWave_winter_program" in head and "동계방학" in head
data = "\n".join(L[idx("// ===== 5. 데이터"): idx("// ===== 6. 세 가지 지원 축")])
data = data.replace('content("01 제안 개요"', 'content("01 프로그램 개요"').replace('"유학생 유입은 늘었으나, 국내 취업·정착은 저조"', '"추진 배경: 유학생 유입은 늘었으나, 국내 취업·정착은 저조"')
tail = "\n".join(L[idx("// ===== Contact ====="):])
body = (D / "winter_body.js").read_text(encoding="utf-8").replace("  //__DATA_SLIDE__", data)
ctx = "  const ctxBase = { pres, content, T, card, pill, iconCircle, numCircle, chevron, W, M, colors: { BG, ACCENT, NAVY, NAVY2, WHITE, GRAY, MUTED, OTINT } };\n"
out = "// 자동 생성 파일: make_winter.py 로 만듦 (직접 고치지 말고 winter_body.js 를 고친 뒤 다시 생성)\n" + head + "\n\n(async () => {\n" + ctx + body + "\n  " + tail + "\n"
(D / "build_winter.js").write_text(out, encoding="utf-8")
print("wrote build_winter.js")
