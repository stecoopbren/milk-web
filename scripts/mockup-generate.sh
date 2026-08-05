#!/usr/bin/env bash
# mockup-generate.sh
# ------------------
# Full two-step iPhone mockup workflow:
#   1. Generate a lifestyle iPhone scene with a BRIGHT GREEN placeholder screen
#   2. Composite the real screenshot onto the green area (exact, no AI hallucination)
#
# Usage:
#   ./scripts/mockup-generate.sh \
#     --screen public/Chaguite/site/Site\ 1.png \
#     --output public/Chaguite/mockup-site1.png \
#     [--scene "custom scene description override"]
#
# Requires: higgsfield CLI, python3 + Pillow + numpy

set -euo pipefail

SCREEN=""
OUTPUT=""
SCENE_OVERRIDE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --screen)   SCREEN="$2";        shift 2 ;;
    --output)   OUTPUT="$2";        shift 2 ;;
    --scene)    SCENE_OVERRIDE="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

if [[ -z "$SCREEN" || -z "$OUTPUT" ]]; then
  echo "Usage: $0 --screen <screenshot.png> --output <output.png> [--scene '...']"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TMP_MOCKUP="/tmp/mockup_greenscreen_$$.png"

# ── Default scene prompt ──────────────────────────────────────────────────────
DEFAULT_SCENE="Lifestyle iPhone 15 Pro mockup photography. A woman's hand with natural nails holds an iPhone 15 Pro in black titanium, resting casually against a rich cognac brown velvet tufted sofa cushion. A chunky cream ivory knit blanket is visible at the lower edge. Camera overhead looking down at roughly 45 degrees. Phone angled naturally toward camera, screen facing viewer. Warm golden amber directional light from the upper right, soft dramatic shadows. Cozy editorial premium lifestyle feel. CRITICAL: The phone screen must be filled with a solid flat bright lime green color (#00FF00) — no texture, no reflection, no content, no UI, no text, completely flat pure green. This is a placeholder that will be replaced in post. The rest of the scene is photorealistic 4K."

SCENE="${SCENE_OVERRIDE:-$DEFAULT_SCENE}"

# ── Step 1: Generate green-screen mockup ─────────────────────────────────────
echo "Step 1: Generating green-screen mockup..."
RESULT_URL=$(higgsfield generate create gpt_image_2 \
  --prompt "$SCENE" \
  --aspect_ratio 16:9 \
  --resolution 4k \
  --wait --wait-timeout 20m 2>&1 | grep -E '^https?://' | head -1)

if [[ -z "$RESULT_URL" ]]; then
  echo "ERROR: No URL returned from Higgsfield. Check output above."
  exit 1
fi

echo "  Generated: $RESULT_URL"

# ── Download the mockup ───────────────────────────────────────────────────────
echo "  Downloading..."
curl -fsSL "$RESULT_URL" -o "$TMP_MOCKUP"

# ── Step 2: Composite real screenshot onto green area ────────────────────────
echo "Step 2: Compositing screenshot onto mockup..."
python3 "$SCRIPT_DIR/mockup-composite.py" \
  --mockup "$TMP_MOCKUP" \
  --screen "$SCREEN" \
  --output "$OUTPUT"

rm -f "$TMP_MOCKUP"
echo ""
echo "Done! Final mockup saved to: $OUTPUT"
