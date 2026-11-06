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
cp -r "$TMP/remotion/skills/remotion-best-practices" "$DEST/"
cp -r "$TMP/toolkit/.claude/skills/ffmpeg" "$TMP/toolkit/.claude/skills/video-design" "$DEST/"
cp -r "$TMP/swiftui/swiftui-pro" "$DEST/"
echo "설치 완료 → $DEST : remotion-best-practices, ffmpeg, video-design, swiftui-pro"
