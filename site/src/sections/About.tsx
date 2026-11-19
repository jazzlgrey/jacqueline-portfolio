import { Canvas } from '../components/Canvas';
import { Art } from '../components/Art';
import { Layer } from '../components/Layer';
import { Text } from '../components/Text';
import { SiteNav } from '../components/SiteNav';
import { img } from '../assets';

/** Figma frame "About" (1:56), 2005 × 1421. */
export default function About() {
  return (
    // Mobile: the stained-glass window keeps its composition (881 wide) and
    // the text flows below it.
    <Canvas size={[2005, 1421]} mobileSize={[881, 2330]} id="about" aria-labelledby="about-title" className="about">
      <Art {...img.aboutStainedGlass} alt="" box={[0, 25, 881, 1396]} mobile={[0, 105, 881, 1396]} />

      <Text as="h2" id="about-title" box={[976, 664, 398]} mobile={[48, 1550, 600]} variant="title" color="lotus" nowrap>
        about me
      </Text>
      <Layer box={[976, 813, 933, 409]} mobile={[48, 1700, 800]} className="type type--body color--frost">
        <p>
          i like beautiful things. i like making beautiful things and making things beautiful. all that i create - from
          paintings and poems to codes and designs - i create out of passion for sharing all the beauty i see in the
          world with everyone else.
        </p>
        <p>{' '}</p>
        <p>
          my artist name, perlgray, takes the phonaesthetics of <em>pearl gray</em>,  a color i think is most timeless
          and elegant, possessing qualities of both purity and nebulosity.
        </p>
        <p>{' '}</p>
        <p>i hope you find peace and strength in my artworks.</p>
      </Layer>

      <Art {...img.sunMoon} alt="" box={[1816, 49, 159, 161]} mobile={[694, 1490, 159, 161]} fit="fill" />
      <SiteNav box={[1660, 25, 320, 26]} mobile={[361, 30, 490, 40]} />

      <Art
        {...img.swingFig}
        alt="Painting by perlgray: a pale veiled figure seated on a swing."
        box={[190, 241, 558, 1034]}
        mobile={[190, 321, 558, 1034]}
      />
      <Art
        {...img.blackLotus}
        alt=""
        box={[1732, 1062, 301.505, 412.521]}
        mobile={[640, 2110, 301.505, 412.521]}
        rotate={{ deg: -15, inner: [213, 370] }}
      />
    </Canvas>
  );
}
