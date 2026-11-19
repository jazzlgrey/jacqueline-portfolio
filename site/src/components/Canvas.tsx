import type { ComponentPropsWithoutRef } from 'react';
import { cx, type VarStyle } from './layout';

type CanvasProps = ComponentPropsWithoutRef<'section'> & {
  as?: 'section' | 'footer' | 'header';
  /** Size of the Figma frame in design px. */
  size: readonly [w: number, h: number];
  /** Alternative frame size used below the mobile breakpoint. */
  mobileSize?: readonly [w: number, h: number];
};

/**
 * A section rendered as a scaled copy of its Figma frame: children are
 * <Layer>s positioned in design pixels, and the whole frame scales with the
 * viewport so the overlapping composition is preserved exactly.
 */
export function Canvas({ as: Tag = 'section', size, mobileSize, className, style, children, ...rest }: CanvasProps) {
  const vars: VarStyle = { '--dcw': size[0], '--dch': size[1], ...style };
  if (mobileSize) {
    vars['--mcw'] = mobileSize[0];
    vars['--mch'] = mobileSize[1];
  }
  return (
    <Tag className={cx('canvas', className)} style={vars} {...rest}>
      {children}
    </Tag>
  );
}
