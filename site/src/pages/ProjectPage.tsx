import { Canvas } from '../components/Canvas';
import { Layer } from '../components/Layer';
import { Text } from '../components/Text';
import { Logo } from '../components/Logo';
import { ContactLines } from '../sections/Footer';
import { useReveal } from '../components/Reveal';
import { HomeMark, RoughFilter } from '../components/HomeMark';
import { cx, type Box, type VarStyle } from '../components/layout';
import { img } from '../assets';
import { links } from '../links';
import line1 from '../assets/svg/line-1.svg';
import line2 from '../assets/svg/line-2.svg';
import line3 from '../assets/svg/line-3.svg';
import './ProjectPage.css';

type Asset = { src: string; intrinsic: readonly [number, number]; srcSet?: string };

/**
 * Blue-monochrome treatment from the Figma file, recreated in CSS so hover
 * can bring the colour back: `screen` = greyscale image screened onto
 * #042ea6 (the exhibition photos); an rgba tuple = greyscale image under a
 * blue overlay.
 */
type Tint = { screen: true; opacity?: number } | { overlay: string };

function Pic({
  asset,
  alt,
  box,
  mobile,
  tint,
  position,
  className,
}: {
  asset: Asset;
  alt: string;
  box: Box;
  mobile?: Box;
  tint?: Tint;
  position?: string;
  className?: string;
}) {
  const style: VarStyle = {};
  if (tint && 'overlay' in tint) style['--tint'] = tint.overlay;
  if (tint && 'screen' in tint && tint.opacity) style['--tint-opacity'] = tint.opacity;
  return (
    <Layer
      box={box}
      mobile={mobile}
      className={cx('pic reveal', tint && 'pic--tint', tint && ('screen' in tint ? 'pic--screen' : 'pic--overlay'), className)}
      style={style}
    >
      <img
        src={asset.src}
        srcSet={asset.srcSet}
        alt={alt}
        width={asset.intrinsic[0]}
        height={asset.intrinsic[1]}
        loading="lazy"
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
      />
    </Layer>
  );
}

function Line({ src, box, mobile, from = 'left' }: { src: string; box: Box; mobile?: Box; from?: 'left' | 'right' }) {
  return (
    <Layer box={[box[0], box[1], box[2], 1]} mobile={mobile && [mobile[0], mobile[1], mobile[2], 1]} className={`pp-line reveal reveal--line reveal--from-${from}`} aria-hidden>
      <img src={src} alt="" />
    </Layer>
  );
}

function Lotus({ box, mobile }: { box: [number, number]; mobile?: [number, number] }) {
  return (
    <Layer box={[box[0], box[1], 169, 159]} mobile={mobile && [mobile[0], mobile[1], 132, 124]} className="pic pp-lotus reveal" aria-hidden>
      <img src={img.whiteLotus.src} alt="" width={img.whiteLotus.intrinsic[0]} height={img.whiteLotus.intrinsic[1]} loading="lazy" />
    </Layer>
  );
}

function Video({ name, box, mobile, label }: { name: string; box: Box; mobile?: Box; label: string }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <Layer
      as="video"
      box={box}
      mobile={mobile}
      className="pp-video reveal"
      src={`videos/${name}.mp4`}
      poster={`videos/${name}-poster.jpg`}
      autoPlay={!reduce}
      controls={reduce}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}

/** Figma frame "Project Page", 1971 × 8200, winter rose. */
export default function ProjectPage() {
  useReveal();
  return (
    <div className="page page--project">
      <HomeMark />

      <Canvas as="section" size={[1971, 8200]} mobileSize={[900, 7660]} className="pp" aria-label="what i’ve been creating">
        <nav aria-label="Primary" className="pp-nav">
          <Text as="a" href={links.writings} box={[1715, 20, 100]} mobile={[560, 30, 140]} variant="note" color="frost" nowrap>
            writings
          </Text>
          <Text as="a" href={links.library} box={[1850, 20, 100]} mobile={[730, 30, 140]} variant="note" color="frost" nowrap>
            library
          </Text>
        </nav>

        <RoughFilter />

        <h1 className="pp-heading">
          <Text as="span" box={[77, 225, 909]} mobile={[48, 250, 800]} variant="title" color="moonshine" nowrap>
            what i’ve been
          </Text>
          <Text as="span" box={[413, 234, 1227, 346]} mobile={[100, 330, 760, 216]} variant="display" color="ice" nowrap>
            creating...
          </Text>
        </h1>

        {/* 01 | graduation exhibition */}
        <section aria-labelledby="pp-01">
          <Pic
            asset={img.exhibition1}
            alt="Graduation exhibition: white partition walls hung with paintings in the library reading room."
            box={[77, 726, 524, 393]}
            mobile={[48, 640, 409, 307]}
            tint={{ screen: true, opacity: 0.66 }}
          />
          <Pic
            asset={img.exhibition3}
            alt="Graduation exhibition: the glass-walled storage room, with paintings hung on the walls beside it."
            box={[158, 1119, 683, 512]}
            mobile={[111, 947, 533, 400]}
            tint={{ screen: true, opacity: 0.66 }}
          />
          <Pic
            asset={img.exhibition2}
            alt="Graduation exhibition: the glass storage room turned into a ceremonial, candle-lit installation for two large paintings."
            box={[568, 875, 535, 401]}
            mobile={[431, 757, 417, 313]}
            tint={{ screen: true }}
          />
          <Lotus box={[1783, 726]} mobile={[738, 1390]} />
          <Text as="h2" id="pp-01" box={[1224, 814, 560]} mobile={[48, 1430, 680]} variant="section" color="moonshine" nowrap className="reveal">
            01 | graduation exhibition
          </Text>
          <Line src={line1} box={[1136, 885, 647]} mobile={[48, 1500, 680]} from="right" />
          <Text box={[1436, 915, 468]} mobile={[48, 1535, 760]} anchor="right" variant="body" color="white" className="pp-desc reveal">
            a multi-media exhibition i held in collaboration with three other artists at my high school. we didn’t have a
            proper exhibition space, so we made use of the library reading room. i transformed its glass storage room to a
            ceremonial installation housing two large paintings of mine.
          </Text>

          <Text as="h3" box={[1609, 1670, 300]} mobile={[552, 1985, 300]} anchor="right" variant="caption" color="white" nowrap className="reveal">
            in this exhibition
          </Text>
          <Pic
            asset={img.strangerPart2}
            alt="The Stranger, Part II: three blue faces painted on a torn, layered collage under plastic."
            box={[77, 1644, 788, 591]}
            mobile={[48, 2050, 804, 603]}
          />
          <Pic
            asset={img.monster}
            alt="Abstract painting of swirling brushstrokes, shown in blue monochrome."
            box={[869, 1719, 1046, 844]}
            mobile={[48, 2670, 804, 649]}
            tint={{ overlay: 'rgba(0, 55, 255, 0.28)' }}
          />
          <Pic
            asset={img.matinsAltar}
            alt="Matin, installation: a hooded figure with praying hands, displayed on an altar of candles and a brass plate."
            box={[77, 2225, 788, 1051]}
            mobile={[48, 3340, 500, 667]}
          />
          <Pic
            asset={img.vespersPortrait}
            alt="Vesper: a girl in a red headband, one eye hidden by a red moth, among gold leaf."
            box={[879, 2569, 525, 701]}
            mobile={[566, 3340, 286, 382]}
          />
          <Pic
            asset={img.gymnopedie}
            alt="Gymnopédie: a colourful painting of overlapping faces."
            box={[1413, 2563, 502, 375]}
            mobile={[566, 3738, 286, 214]}
          />
          <Pic
            asset={img.matinsDetail}
            alt="Matin, detail: an ornate mirror reflecting the painting, in blue monochrome."
            box={[1424, 2948, 240, 320]}
            mobile={[48, 4027, 396, 528]}
            tint={{ overlay: 'rgba(12, 46, 170, 0.3)' }}
          />
          <Pic
            asset={img.strangerDetails}
            alt="The Stranger, detail: a painted face with a coin for an eye, in blue monochrome."
            box={[1685, 2948, 230, 328]}
            mobile={[456, 4027, 396, 528]}
            tint={{ overlay: 'rgba(0, 48, 225, 0.2)' }}
            position="50% 0%"
          />
        </section>

        {/* 02 | rebrand for berkeley tango club */}
        <section aria-labelledby="pp-02">
          <Lotus box={[46, 3525]} mobile={[40, 4640]} />
          <Text as="h2" id="pp-02" box={[220, 3579, 786]} mobile={[185, 4660, 700]} variant="section" color="moonshine" nowrap className="reveal">
            02 | rebrand for berkeley tango club
          </Text>
          <Line src={line2} box={[220, 3649, 750]} mobile={[185, 4720, 667]} />
          <Text box={[215, 3664, 600]} mobile={[185, 4735, 600]} variant="caption" color="white" nowrap className="reveal">
            visual design | 2026
          </Text>
          <Layer box={[512, 3730, 1895, 670]} mobile={[0, 4830, 900, 620]} className="pp-panel" aria-hidden />
          <Pic
            asset={img.atcbLogoOld}
            alt="Old logo: Argentine Tango Club of Berkeley, a yellow dancing couple on a navy circle."
            box={[924, 3775, 536, 536]}
            mobile={[70, 4880, 370, 370]}
          />
          <Pic
            asset={img.atcbLogo}
            alt="New logo: Argentine Tango, Club of Berkeley, a pink dancing couple on a deep plum circle."
            box={[1436, 3802, 497, 497]}
            mobile={[470, 4898, 343, 343]}
            className="pp-round"
          />
          <Text box={[1144, 4299, 120]} mobile={[205, 5290, 120]} variant="note" color="white" nowrap className="reveal">
            old logo
          </Text>
          <Text box={[1637, 4299, 120]} mobile={[590, 5290, 120]} variant="note" color="white" nowrap className="reveal">
            new logo
          </Text>
        </section>

        {/* 03 | ATLAS */}
        <section aria-labelledby="pp-03">
          <Layer box={[0, 4763, 1970, 2977]} mobile={[0, 5700, 900, 1360]} className="pp-atlas-bg" aria-hidden>
            <img src={img.atlasBackground.src} alt="" width={1970} height={2977} loading="lazy" decoding="async" />
          </Layer>
          <Lotus box={[1764, 4591]} mobile={[730, 5470]} />
          <Text as="h2" id="pp-03" box={[1483, 4671, 250]} mobile={[440, 5510, 270]} anchor="right" variant="section" color="moonshine" nowrap className="reveal">
            03 | ATLAS
          </Text>
          <Line src={line3} box={[1364, 4750, 400]} mobile={[310, 5580, 400]} from="right" />
          <Text box={[1315, 4776, 600]} mobile={[252, 5600, 600]} anchor="right" variant="caption" color="white" nowrap className="reveal">
            painting &amp; digital installation | 2026
          </Text>
          <Video
            name="ua862-closeup"
            label="ATLAS in progress: the blue painting leaning against a wall, filmed close up."
            box={[1204, 5152, 488.8, 869]}
            mobile={[480, 5790, 340, 604]}
          />
          <Video
            name="ua862-process"
            label="ATLAS in progress: the artist painting the large blue canvas on the floor."
            box={[377, 5713, 688, 917]}
            mobile={[70, 6190, 400, 533]}
          />
          <Text
            as="a"
            href={links.atlas}
            box={[1302, 7344, 500]}
            mobile={[352, 6930, 500]}
            anchor="right"
            variant="mono"
            color="moonshine"
            nowrap
            className="pp-portal reveal"
          >
            → secret portal to ATLAS
          </Text>
        </section>

        <Text box={[809, 7793, 400]} mobile={[250, 7120, 400]} anchor="center" variant="note" color="white" nowrap className="reveal">
          more creations coming...
        </Text>

        <footer className="pp-footer" aria-label="Contact">
          <Logo href="./" mark={[34, 7905, 159, 161]} markMobile={[48, 7240, 161, 161]} word={[193, 7905]} wordMobile={[190, 7260]} />
          <Text box={[333, 8092, 216]} mobile={[300, 7430, 216]} variant="note" color="white" nowrap>
            by jacqueline song
          </Text>
          <ContactLines box={[1456, 8080, 480]} mobile={[48, 7520, 800]} anchor="right" />
        </footer>
      </Canvas>
    </div>
  );
}
