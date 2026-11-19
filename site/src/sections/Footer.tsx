import { Canvas } from '../components/Canvas';
import { Art } from '../components/Art';
import { Text } from '../components/Text';
import { img } from '../assets';
import { links } from '../links';

/** Figma frame "Footer" (17:263). Only its top 580px fall inside the 10000px
 *  Home frame, so that is the visible footer. */
export default function Footer() {
  return (
    <Canvas as="footer" size={[2005, 580]} mobileSize={[900, 760]} className="footer" aria-label="Contact">
      <Art {...img.sunMoon} alt="" box={[81, 153, 159, 161]} mobile={[60, 70, 159, 161]} fit="fill" />
      <Text as="p" box={[81, 337, 289]} mobile={[60, 250, 289]} variant="logo" color="moonshine" nowrap>
        perlgray
      </Text>
      <Text box={[154, 466, 216]} mobile={[133, 375, 216]} variant="note" color="white" nowrap>
        by jacqueline song
      </Text>
      <Text as="address" box={[1464, 454, 480]} mobile={[60, 520, 800]} variant="note" color="white" className="footer__contact">
        write to me: <a href={links.email}>itsjacquelinehere@gmail.com</a>
        <br />
        or leave me a message: <a href={links.phone}>510-610-2682</a>
      </Text>
    </Canvas>
  );
}
