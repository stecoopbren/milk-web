#!/usr/bin/env python3
"""
mockup-composite.py
-------------------
Composites a screenshot onto a phone mockup that has a bright-green (#00FF00)
placeholder screen.

Usage:
  python3 scripts/mockup-composite.py \
    --mockup path/to/blank-mockup.png \
    --screen path/to/screenshot.png \
    --output path/to/output.png

The script auto-detects the green screen region, finds its four corners,
perspective-warps the screenshot to fit exactly, then composites it.
"""

import argparse
import sys
import numpy as np
from PIL import Image


# ── Perspective helpers ───────────────────────────────────────────────────────

def find_coeffs(src_pts, dst_pts):
    """Compute 8 perspective-transform coefficients mapping src_pts → dst_pts."""
    matrix = []
    for (sx, sy), (dx, dy) in zip(src_pts, dst_pts):
        matrix.append([sx, sy, 1, 0, 0, 0, -dx * sx, -dx * sy])
        matrix.append([0, 0, 0, sx, sy, 1, -dy * sx, -dy * sy])
    A = np.array(matrix, dtype=float)
    b = np.array(dst_pts, dtype=float).reshape(8)
    coeffs, _, _, _ = np.linalg.lstsq(A, b, rcond=None)
    return coeffs.tolist()


def order_corners(pts):
    """
    Order four corner points as: top-left, top-right, bottom-right, bottom-left.
    """
    pts = sorted(pts, key=lambda p: p[1])          # sort by y
    top = sorted(pts[:2], key=lambda p: p[0])       # top two: left first
    bot = sorted(pts[2:], key=lambda p: p[0])       # bottom two: left first
    return [top[0], top[1], bot[1], bot[0]]         # TL, TR, BR, BL


def detect_green_corners(img: Image.Image, green_tol=60):
    """
    Detect the four corner pixels of the bright-green placeholder screen.
    Returns [(x,y), ...] ordered TL, TR, BR, BL.
    """
    arr = np.array(img.convert("RGB"), dtype=np.int32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]

    # Green mask: g is dominant, r and b are low
    mask = (g > 150) & (g - r > green_tol) & (g - b > green_tol)
    ys, xs = np.where(mask)

    if len(xs) == 0:
        sys.exit(
            "ERROR: No green screen detected. Make sure the mockup was generated "
            "with a solid bright-green (#00FF00) phone screen."
        )

    # Find the four extreme corners via convex-hull-like selection
    pts = list(zip(xs.tolist(), ys.tolist()))

    # Score each point for each corner position
    def score(px, py, flip_x, flip_y):
        return ((-1 if flip_x else 1) * px) + ((-1 if flip_y else 1) * py)

    tl = min(pts, key=lambda p: score(p[0], p[1], False, False))
    tr = max(pts, key=lambda p: score(p[0], p[1], False, True))
    br = max(pts, key=lambda p: score(p[0], p[1], False, False))
    bl = min(pts, key=lambda p: score(p[0], p[1], False, True))

    return order_corners([tl, tr, br, bl])


def warp_screenshot_onto_mockup(mockup: Image.Image, screenshot: Image.Image, corners):
    """
    Perspective-warp `screenshot` so it fills the quadrilateral defined by `corners`
    (TL, TR, BR, BL pixel coords in `mockup`), then composite onto `mockup`.
    """
    W, H = mockup.size
    sw, sh = screenshot.size

    # Source rectangle (screenshot corners in screenshot space)
    src = [(0, 0), (sw, 0), (sw, sh), (0, sh)]

    # We want to map src → corners in mockup space.
    # PIL's transform() applies an inverse warp: for each output pixel,
    # it looks up where it came from in the source.
    # So we compute coefficients from corners → src.
    coeffs = find_coeffs(corners, src)

    # Warp the screenshot into mockup-sized canvas
    warped = screenshot.transform(
        (W, H),
        Image.PERSPECTIVE,
        coeffs,
        resample=Image.BICUBIC,
    )

    from scipy.ndimage import binary_erosion

    # Build full green mask — every green pixel in the scene
    mockup_arr = np.array(mockup.convert("RGBA"))
    mock_r = mockup_arr[:, :, 0].astype(np.int32)
    mock_g = mockup_arr[:, :, 1].astype(np.int32)
    mock_b = mockup_arr[:, :, 2].astype(np.int32)
    full_green = (mock_g > 120) & (mock_g - mock_r > 40) & (mock_g - mock_b > 40)

    # Eroded interior — where the screenshot goes (avoids warm-lit edge pixels)
    inner_mask = binary_erosion(full_green, iterations=8)

    # Step 1: blank out the ENTIRE green area with black (removes all green + warm edges)
    base_arr = mockup_arr.copy()
    base_arr[full_green] = [0, 0, 0, 255]

    # Step 2: paste warped screenshot only in the eroded interior
    warped_arr = np.array(warped.convert("RGBA"))
    base_arr[inner_mask] = warped_arr[inner_mask]

    result = Image.fromarray(base_arr.astype(np.uint8), "RGBA")
    return result.convert("RGB")


# ── Main ─────────────────────────────────────────────────────────────────────

def parse_corners(s):
    """Parse '800,200 1400,250 1350,900 750,850' into list of (x,y) tuples."""
    pts = []
    for pair in s.strip().split():
        x, y = pair.split(",")
        pts.append((int(x), int(y)))
    if len(pts) != 4:
        sys.exit("ERROR: --corners must have exactly 4 points: 'x1,y1 x2,y2 x3,y3 x4,y4'")
    return pts


def main():
    parser = argparse.ArgumentParser(description="Composite screenshot onto phone mockup template.")
    parser.add_argument("--mockup", required=True, help="Path to the mockup template image")
    parser.add_argument("--screen", required=True, help="Path to the screenshot to composite")
    parser.add_argument("--output", required=True, help="Output file path (PNG)")
    parser.add_argument("--corners", default="", help="Manual screen corners: 'x1,y1 x2,y2 x3,y3 x4,y4' (TL TR BR BL). If omitted, auto-detects green screen.")
    args = parser.parse_args()

    print(f"Loading mockup: {args.mockup}")
    mockup = Image.open(args.mockup)

    print(f"Loading screenshot: {args.screen}")
    screenshot = Image.open(args.screen)

    if args.corners:
        corners = parse_corners(args.corners)
        print(f"  Using manual corners: {corners}")
    else:
        print("Detecting green screen region...")
        corners = detect_green_corners(mockup)
        print(f"  Corners (TL, TR, BR, BL): {corners}")

    print("Warping and compositing...")
    result = warp_screenshot_onto_mockup(mockup, screenshot, corners)

    result.save(args.output, "PNG", quality=95)
    print(f"Saved: {args.output}")


if __name__ == "__main__":
    main()
