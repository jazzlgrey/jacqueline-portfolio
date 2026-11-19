import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { boxVars, cx, type Box } from './layout';

type LayerProps<T extends ElementType> = {
  as?: T;
  box: Box;
  /** Box override below the mobile breakpoint. */
  mobile?: Box;
  /** Which edge stays fixed if the content renders larger than designed
   *  (text has minimum sizes on small screens). */
  anchor?: 'left' | 'right' | 'center';
  /** Clip children to the box, like a Figma frame with "clip content". */
  clip?: boolean;
  /** Size to content instead of the box width (for anchored groups). */
  fit?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

/** An absolutely positioned element placed in design pixels. */
export function Layer<T extends ElementType = 'div'>({
  as,
  box,
  mobile,
  anchor = 'left',
  clip,
  fit,
  className,
  style,
  children,
  ...rest
}: LayerProps<T>) {
  const Tag: ElementType = as ?? 'div';
  const autoHeight = box[3] === undefined;
  return (
    <Tag
      className={cx(
        'layer',
        anchor !== 'left' && `layer--${anchor}`,
        autoHeight && 'layer--auto-h',
        clip && 'layer--clip',
        fit && 'layer--fit',
        className,
      )}
      style={{ ...boxVars(box, mobile), ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
