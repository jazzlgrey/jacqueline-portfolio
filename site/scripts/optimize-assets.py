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


# ---------------------------------------------------------------------------
# Round 2 (Project Page, About carousel). Source → (output name, max width).
# Blue-monochrome images use Figma's full-colour originals ("raw/*-a.jpg");
# the blue treatment is recreated in CSS so hover can reveal the colour.
# ---------------------------------------------------------------------------
SRC2 = Path("assets-src/figma2")
ROUND2 = {
    "raw/ex1-a.jpg": ("exhibition-1", 1400),
    "raw/ex2-a.jpg": ("exhibition-2", 1400),
    "raw/ex3-a.jpg": ("exhibition-3", 1600),
    "raw/monster-a.jpg": ("monster", 2200),
    "raw/sdet-a.jpg": ("stranger-details", 560),
    "raw/mat3-a.jpg": ("matins-detail", 600),
    "raw/atlasbg-a.jpg": ("atlas-background", 1970),  # darkened below
    "stranger-part-2.png": ("stranger-part-2", 1700),
    "gymnopedie.png": ("gymnopedie", 1100),
    "vespers-2.png": ("vespers-portrait", 1100),
    "matins-installation-2.png": ("matins-altar", 1700),
    "atcb-logo-old.png": ("atcb-logo-old", 1100),
    "ua862-process-1.png": ("ua862-process-1", 1000),
    "vesper-sh.png": ("vesper-sh", 1000),
}
for rel, (name, cap) in ROUND2.items():
    src = SRC2 / rel
    if not src.exists():
        continue
    im = Image.open(src)
    im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
    if im.width > cap:
        im = im.resize((cap, round(im.height * cap / im.width)), Image.LANCZOS)
    if name == "atlas-background":
        # Figma darkens this fill to 58.7% (fitted against its render).
        im = im.point(lambda v: round(v * 0.587))
    dst = OUT / f"{name}.webp"
    im.save(dst, "WEBP", quality=86, method=6)
    print(f"{rel:30s} -> {dst.name:26s} {dst.stat().st_size//1024:5d}K {im.size}")
