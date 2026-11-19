"""Convert the original Figma exports in assets-src/figma into web-ready WebP
files in src/assets/figma. Pixels are not edited: images are only re-encoded
(quality 90) and very large sources are capped at MAX_WIDTH, which is still
2x the largest size they are displayed at in the 2005px-wide design.
Run: python3 -I scripts/optimize-assets.py  (from the site/ folder)"""
from pathlib import Path
from PIL import Image

SRC = Path("assets-src/figma")
OUT = Path("src/assets/figma")
MAX_WIDTH = {"vespers": 2260, "ua862": 2000, "the-stranger": 1179, "atcb-logo": 1510}
# Extra smaller variants (used through srcset on phones and tablets).
SMALL_WIDTH = {"vespers": 1000, "ua862": 900, "the-stranger": 600}

OUT.mkdir(parents=True, exist_ok=True)
for src in sorted(SRC.iterdir()):
    if src.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
        continue
    im = Image.open(src)
    im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
    cap = MAX_WIDTH.get(src.stem)
    if cap and im.width > cap:
        im = im.resize((cap, round(im.height * cap / im.width)), Image.LANCZOS)
    dst = OUT / f"{src.stem}.webp"
    im.save(dst, "WEBP", quality=90, method=6)
    print(f"{src.name:26s} {src.stat().st_size//1024:6d}K -> {dst.name:26s} {dst.stat().st_size//1024:5d}K {im.size}")
    small = SMALL_WIDTH.get(src.stem)
    if small:
        sm = im.resize((small, round(im.height * small / im.width)), Image.LANCZOS)
        sdst = OUT / f"{src.stem}-sm.webp"
        sm.save(sdst, "WEBP", quality=88, method=6)
        print(f"{'':26s}         -> {sdst.name:26s} {sdst.stat().st_size//1024:5d}K {sm.size}")
