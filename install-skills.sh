#!/usr/bin/env bash
# 추천 스킬 설치 스크립트
# 사용법:
#   bash install-skills.sh            → 현재 폴더의 .claude/skills 에 설치 (해당 프로젝트에서만)
#   bash install-skills.sh --global   → ~/.claude/skills 에 설치 (내 컴퓨터의 모든 프로젝트)
set -euo pipefail
DEST=".claude/skills"; [ "${1:-}" = "--global" ] && DEST="$HOME/.claude/skills"
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
mkdir -p "$DEST"
git clone -q --depth 1 https://github.com/remotion-dev/skills "$TMP/remotion"
git clone -q --depth 1 https://github.com/digitalsamba/claude-code-video-toolkit "$TMP/toolkit"
git clone -q --depth 1 https://github.com/twostraws/SwiftUI-Agent-Skill "$TMP/swiftui"
git clone -q --depth 1 https://github.com/Leonxlnx/taste-skill "$TMP/taste"
git clone -q --depth 1 https://github.com/zarazhangrui/frontend-slides "$TMP/slides"
git clone -q --depth 1 https://github.com/addyosmani/web-quality-skills "$TMP/webq"
git clone -q --depth 1 https://github.com/vercel-labs/agent-skills "$TMP/vercel"
git clone -q --depth 1 https://github.com/JuliusBrussee/caveman "$TMP/caveman"
git clone -q --depth 1 --filter=blob:none --sparse https://github.com/shadcn-ui/ui "$TMP/shadcn" && git -C "$TMP/shadcn" sparse-checkout set skills
cp -r "$TMP/remotion/skills/remotion-best-practices" "$DEST/"
cp -r "$TMP/toolkit/.claude/skills/ffmpeg" "$TMP/toolkit/.claude/skills/video-design" "$DEST/"
cp -r "$TMP/swiftui/swiftui-pro" "$DEST/"
rm -rf "$DEST/design-taste-frontend"; cp -r "$TMP/taste/skills/taste-skill" "$DEST/design-taste-frontend"
cp -r "$TMP/slides/plugins/frontend-slides/skills/frontend-slides" "$DEST/"
cp -r "$TMP/webq/skills/accessibility" "$TMP/webq/skills/web-quality-audit" "$DEST/"
cp -r "$TMP/vercel/skills/react-best-practices" "$DEST/"
cp -r "$TMP/shadcn/skills/shadcn" "$DEST/"
cp -r "$TMP/caveman/skills/caveman" "$TMP/caveman/skills/ultracave" "$DEST/"
echo "설치 완료 → $DEST : 영상(remotion-best-practices, ffmpeg, video-design), iOS(swiftui-pro), 디자인(design-taste-frontend), 사이트 UI/UX(accessibility, web-quality-audit, shadcn, react-best-practices), 슬라이드·PDF(frontend-slides), 토큰 절약(caveman, ultracave)"
