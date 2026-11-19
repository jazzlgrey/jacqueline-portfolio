import { Canvas } from '../components/Canvas';
import { Art } from '../components/Art';
import { Text } from '../components/Text';
import { img } from '../assets';
import { links } from '../links';
import './Hero.css';

/** Figma frame "Hero" (1:52), 2005 × 1306. */
export default function Hero() {
  return (
    // Mobile: the left collage keeps its composition (1140 wide) and the
    // painting moves underneath it at full width.
    <Canvas size={[2005, 1306]} mobileSize={[1140, 3027]} className="hero" aria-label="perlgray">
      <Art {...img.heroTexture} alt="" box={[-23, -569, 1145, 2036]} />
      <Art
        {...img.ua862}
        alt="Painting by perlgray: a veiled figure on a swing beside a piano, a moon face and lotus pond, in deep blues."
        box={[1140, 0, 865, 1306]}
        mobile={[0, 1306, 1140, 1721]}
        className="hero__painting"
        priority
      />

      <nav aria-label="Explore" className="hero__jellyfish-nav">
        <Art {...img.blueJellyfish} alt="" box={[386, 683, 273, 265]} priority />
        <Text as="a" href="#about" box={[447, 798, 151, 67]} variant="label" color="ice" nowrap>
          about me
        </Text>
        <Art {...img.blueJellyfish2} alt="" box={[469, 599, 313, 208]} fit="fill" priority />
        <Text as="a" href="#projects" box={[582, 642, 146, 66]} variant="label" color="ice">
          what i’ve been creating
        </Text>
        <Art {...img.pinkLotus} alt="" box={[0, -12, 314, 912]} priority />
        <Art {...img.lotusLeaf} alt="" box={[854, 1097, 343, 209]} rotate={{ deg: -90, inner: [209, 343] }} />
        <Art {...img.fiveJellyfish1} alt="" box={[728, 362, 275, 291]} fit="fill" priority />
        <Text as="a" href={links.writings} box={[782, 434, 144, 58]} variant="label" color="ice" nowrap>
          my writings
        </Text>
        <Art {...img.fiveJellyfish2} alt="" box={[659, 865, 222, 178]} fit="fill" priority />
        <Text as="a" href={links.library} box={[709, 964, 157, 57]} variant="label" color="ice" nowrap>
          my library
        </Text>
      </nav>

      <Art {...img.blackLotus} alt="" box={[875, 938, 301.505, 412.521]} rotate={{ deg: -15, inner: [213, 370] }} />
      <Text as="h1" box={[55, 1154, 289]} variant="logo" color="moonshine" nowrap>
        perlgray
      </Text>
    </Canvas>
  );
}
