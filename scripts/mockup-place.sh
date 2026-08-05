#!/usr/bin/env bash
# mockup-place.sh
# ---------------
# Composite a screenshot onto an existing mockup template image.
# No AI generation — uses the template as-is.
#
# Usage:
#   ./scripts/mockup-place.sh \
#     --template public/Chaguite/templates/scene1.png \
#     --screen   public/Chaguite/site/Site\ 1.png \
#     --output   public/Chaguite/mockup-site1.png
#
# The script auto-detects the screen region. If detection fails,
# pass --corners "x1,y1 x2,y2 x3,y3 x4,y4" (TL TR BR BL) to override.

set -euo pipefail

TEMPLATE=""
SCREEN=""
OUTPUT=""
CORNERS=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --template) TEMPLATE="$2"; shift 2 ;;
    --screen)   SCREEN="$2";   shift 2 ;;
    --output)   OUTPUT="$2";   shift 2 ;;
    --corners)  CORNERS="$2";  shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

if [[ -z "$TEMPLATE" || -z "$SCREEN" || -z "$OUTPUT" ]]; then
  echo "Usage: $0 --template <template.png> --screen <screenshot.png> --output <output.png> [--corners 'x1,y1 x2,y2 x3,y3 x4,y4']"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [[ -n "$CORNERS" ]]; then
  python3 "$SCRIPT_DIR/mockup-composite.py" \
    --mockup "$TEMPLATE" \
    --screen "$SCREEN" \
    --output "$OUTPUT" \
    --corners "$CORNERS"
else
  python3 "$SCRIPT_DIR/mockup-composite.py" \
    --mockup "$TEMPLATE" \
    --screen "$SCREEN" \
    --output "$OUTPUT"
fi

echo "Done: $OUTPUT"
