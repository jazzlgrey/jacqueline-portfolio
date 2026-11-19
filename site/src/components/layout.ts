import type { CSSProperties } from 'react';

/** A rectangle in Figma design pixels: [x, y, width, height?]. */
export type Box = readonly [x: number, y: number, w: number, h?: number];

/** Inline style carrying CSS custom properties (design-pixel numbers). */
export type VarStyle = CSSProperties & Record<`--${string}`, string | number>;

export function cx(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(' ');
}

/** Turns a desktop box and optional mobile box into custom properties
 *  consumed by `.layer` in layout.css. */
export function boxVars(box: Box, mobile?: Box): VarStyle {
  const [x, y, w, h] = box;
  const style: VarStyle = { '--dx': x, '--dy': y, '--dw': w };
  if (h !== undefined) style['--dh'] = h;
  if (mobile) {
    const [mx, my, mw, mh] = mobile;
    style['--mx'] = mx;
    style['--my'] = my;
    style['--mw'] = mw;
    if (mh !== undefined) style['--mh'] = mh;
  }
  return style;
}
