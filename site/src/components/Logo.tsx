import { Layer } from './Layer';
import { Text } from './Text';
import { img } from '../assets';
import { cx, type Box } from './layout';

type LogoProps = {
  /** Sun-moon mark box (design px). */
  mark: Box;
  markMobile?: Box;
  /** Top-left of the Kapakana "perlgray" wordmark (279 × 140). */
  word: readonly [number, number];
  wordMobile?: readonly [number, number];
  /** Element for the wordmark (h1 in the hero, p elsewhere). */
  as?: 'h1' | 'p';
  /** Where the sun-moon leads: the home hero. */
  href?: string;
  className?: string;
};

/** The sun-moon mark (a link home) next to the script "perlgray" wordmark. */
export function Logo({ mark, markMobile, word, wordMobile, as = 'p', href = '/', className }: LogoProps) {
  return (
    <>
      <Layer as="a" href={href} box={mark} mobile={markMobile} className={cx('logo-mark', className)} aria-label="perlgray home">
        <img
          className="art__img art__img--fill"
          src={img.sunMoon.src}
          alt=""
          width={img.sunMoon.intrinsic[0]}
          height={img.sunMoon.intrinsic[1]}
          decoding="async"
        />
      </Layer>
      <Text
        as={as}
        box={[word[0], word[1], 279, 140]}
        mobile={wordMobile ? [wordMobile[0], wordMobile[1], 279, 140] : undefined}
        variant="script"
        color="moonshine"
        nowrap
        className={cx('logo-word', className)}
      >
        perlgray
      </Text>
    </>
  );
}
