import { Layer } from './Layer';
import { cx, type Box, type VarStyle } from './layout';

type Fit = 'cover' | 'fill';

type ArtProps = {
  src: string;
  /** Width-described candidates; `sizes` is derived from the layout. */
  srcSet?: string;
  /** Empty string for decorative imagery. */
  alt: string;
  box: Box;
  mobile?: Box;
  /** Intrinsic pixel size of the file, so the browser can reserve space. */
  intrinsic: readonly [number, number];
  /** cover = Figma "Fill"; fill = stretched to the box (Figma "Stretch"). */
  fit?: Fit;
  /** Image rect inside the box in %, for Figma "Crop" fills: [left, top, width, height]. */
  crop?: readonly [number, number, number, number];
  /** Rotation in degrees, applied around the box centre. `inner` is the
   *  un-rotated size of the image in design px. */
  rotate?: { deg: number; inner: readonly [number, number] };
  opacity?: number;
  radius?: number;
  priority?: boolean;
  className?: string;
};

/** A Figma image layer. */
export function Art({
  src,
  srcSet,
  alt,
  box,
  mobile,
  intrinsic,
  fit = 'cover',
  crop,
  rotate,
  opacity,
  radius,
  priority,
  className,
}: ArtProps) {
  const imgStyle: VarStyle = {};
  // Rendered width of the image as a share of the 2005px design (crops
  // render the image wider than its box). Phones may show it full-width.
  const renderedShare = (box[2] * (crop ? crop[2] / 100 : 1)) / 2005;
  const sizes = srcSet
    ? `(max-width: 767px) 100vw, min(${Math.ceil(renderedShare * 100)}vw, ${Math.ceil(renderedShare * 2005)}px)`
    : undefined;
  if (opacity !== undefined) imgStyle.opacity = opacity;
  if (crop) {
    const [l, t, w, h] = crop;
    Object.assign(imgStyle, { left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%` });
  }
  if (rotate) {
    imgStyle['--iw'] = rotate.inner[0];
    imgStyle['--ih'] = rotate.inner[1];
    imgStyle.transform = `translate(-50%, -50%) rotate(${rotate.deg}deg)`;
  }

  return (
    <Layer
      box={box}
      mobile={mobile}
      clip={Boolean(crop)}
      className={cx('art', className)}
      style={radius !== undefined ? ({ '--radius': radius } as VarStyle) : undefined}
      aria-hidden={alt === '' ? true : undefined}
    >
      <img
        className={cx('art__img', crop ? 'art__img--crop' : rotate ? 'art__img--rotated' : `art__img--${fit}`)}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={intrinsic[0]}
        height={intrinsic[1]}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // @ts-expect-error -- fetchpriority is valid HTML; React 18 types lag behind
        fetchpriority={priority ? 'high' : undefined}
        style={imgStyle}
      />
    </Layer>
  );
}
