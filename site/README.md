# perlgray — portfolio homepage (React + Vite)

A close reproduction of the Figma file "portfolio" (frame **Home**, 2005 × 10000).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/
```

## How the layout works

The design is a hand-placed collage, so each Figma frame becomes a **Canvas**
and every layer is placed in Figma's own pixel coordinates:

| Piece | Role |
| --- | --- |
| `components/Canvas.tsx` | One Figma frame. Scales with the page: 1 design px = `100cqw / frameWidth`. |
| `components/Layer.tsx` | Absolutely positioned element with a `box={[x, y, w, h]}` copied from Figma, plus an optional `mobile` box. |
| `components/Art.tsx` | Image layer: cover / stretch / crop / rotation / radius exactly as in the Figma fills. |
| `components/Text.tsx` | Text layer using one of the file's text styles (logo, title, heading, body, note, label). |
| `components/SiteNav.tsx` | projects / writings / library navigation. |
| `sections/*` | Hero, About, Projects, Footer, in Figma's layer order (later = on top). |
| `styles/tokens.css` | Figma variables: midnight, ice, moonshine, lotus, frost and the font stacks. |

* **Desktop (≥ 768px):** the whole composition scales proportionally; at 2005px wide it is 1:1 with Figma.
* **Tablet:** same composition; text never shrinks below a readable minimum.
* **Mobile (< 768px):** the Hero and About frames switch to a narrower crop of the same artwork
  (`mobileSize`), the painting/text move below it, and a few titles get `mobile` boxes so they don't collide.

## Assets

`assets-src/figma/` holds the original Figma exports (not committed).
`npm run optimize-assets` re-encodes them to WebP in `src/assets/figma/`
(quality 90; the three largest paintings are capped at 2× display size and
get a small variant for `srcset`).

## Deploying

`dist/` is a static site with relative asset URLs (`base: './'`), so it can be
served from the domain root or a sub-folder. Navigation links point at the
existing pages (`/projects.html`, `/booklog.html`, `/projects/atlas.html`),
which assumes the build is served from the root of perlgray.com.
