import type { ElementType, ReactNode } from 'react';
import { Layer } from './Layer';
import { cx, type Box } from './layout';

export type TextStyle = 'logo' | 'title' | 'heading' | 'body' | 'note' | 'label';
export type TextColor = 'ice' | 'moonshine' | 'lotus' | 'frost' | 'white';

type TextProps = {
  as?: ElementType;
  box: Box;
  mobile?: Box;
  variant: TextStyle;
  color: TextColor;
  anchor?: 'left' | 'right' | 'center';
  /** Keep on one line (Figma "auto width" text). */
  nowrap?: boolean;
  className?: string;
  id?: string;
  /** For links rendered with `as="a"`. */
  href?: string;
  children: ReactNode;
};

/** A Figma text layer using one of the file's text styles. */
export function Text({ as = 'p', box, mobile, variant, color, anchor, nowrap, className, id, href, children }: TextProps) {
  return (
    <Layer
      as={as}
      id={id}
      href={href}
      box={box}
      mobile={mobile}
      anchor={anchor}
      className={cx('type', `type--${variant}`, `color--${color}`, nowrap && 'type--nowrap', className)}
    >
      {children}
    </Layer>
  );
}
