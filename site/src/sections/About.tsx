import { Canvas } from '../components/Canvas';
import { Art } from '../components/Art';
import { Layer } from '../components/Layer';
import { Text } from '../components/Text';
import { SiteNav } from '../components/SiteNav';
import { ParticleCarousel, type Slide } from '../components/ParticleCarousel';
import { img } from '../assets';
import type { VarStyle } from '../components/layout';

const slides: Slide[] = [
  {
    ...img.swingFig,
    alt: 'Painting by perlgray: a pale veiled figure seated on a swing.',
    box: [190 - 76, 241 - 130, 558, 1034],
  },
  {
    ...img.ua862Process1,
    alt: 'The artist, seen from behind, sitting on the floor painting a large blue canvas.',
    box: [0, 0, 900, 1200],
  },
  {
    ...img.vesperSh,
    alt: 'Vesper, painting detail: a face half covered by a red moth, fingertips at the lips.',
    box: [145 - 76, 374 - 130, 594, 791],
    radius: 333,
  },
];

/** Figma frame "About" (1:56), 2005 × 1421. */
export default function About() {
  return (
    // Mobile: the stained-glass window keeps its composition (881 wide) and
    // the text flows below it.
    <Canvas size={[2005, 1421]} mobileSize={[881, 2600]} id="about" aria-labelledby="about-title" className="about">
      <Art {...img.aboutStainedGlass} alt="" box={[0, 25, 881, 1396]} mobile={[0, 105, 881, 1396]} />

      {/* "about" in Kapakana, "me" in Season Mix tucked under its "t". */}
      <Text as="h2" id="about-title" box={[944, 267, 560]} mobile={[60, 1517, 600]} variant="title" color="lotus" nowrap className="mixed-title">
        <span className="mixed-title__script" style={{ '--ks': 200 } as VarStyle}>
          about
        </span>{' '}
        <span className="mixed-title__drop" style={{ '--sx': -12, '--sy': 33 } as VarStyle}>
          me
        </span>
      </Text>
      {/* Longer text than the Figma copy, so the block starts higher to clear the lotus. */}
      <Layer box={[976, 449, 933]} mobile={[48, 1700, 800]} className="type type--body color--frost">
        <p>i like beautiful things. i like making beautiful things, and making things beautiful.</p>
        <p>{' '}</p>
        <p>
          i like moving between the intuitive and the systematic. paintings, verses, code, and design are all frequent,
          invaluable guests to my mind’s dinner party. much of what i make begins with some strange fixation born from
          microscopic observation — of a space, a memory, some loosely linked information — and with the desire to give
          those things a form that feels alive.
        </p>
        <p>{' '}</p>
        <p>
          perlgray takes its name from the phonaesthetics of <em>pearl gray</em>: a color i have always found timeless
          and difficult to pin down, somewhere between clarity and nebulosity. i am drawn to the same tension in the
          things i make.
        </p>
        <p>{' '}</p>
        <p>i hope something here makes you look a little longer.</p>
      </Layer>

      <SiteNav box={[1660, 25, 320, 26]} mobile={[361, 30, 490, 40]} />

      {/* Prototype: the three pictures take turns, 4s each, dissolving into
          particles between them. Slide boxes are relative to [76, 130]. */}
      <ParticleCarousel box={[76, 130, 900, 1200]} mobile={[76, 210, 900, 1200]} slides={slides} className="about__carousel" />
      <Art
        {...img.blackLotus}
        alt=""
        box={[1732, 1062, 301.505, 412.521]}
        mobile={[640, 2380, 301.505, 412.521]}
        rotate={{ deg: -15, inner: [213, 370] }}
      />
    </Canvas>
  );
}
