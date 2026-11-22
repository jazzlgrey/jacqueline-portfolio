import { Canvas } from '../components/Canvas';
import { Text } from '../components/Text';
import { Logo } from '../components/Logo';
import { links } from '../links';
import type { Box } from '../components/layout';
import './Footer.css';

/** Figma frame "Footer" (winter rose). Only its top ~580px fall inside the
 *  10000px Home frame, so that is the visible footer. Positions are the
 *  frame's own plus its 2px x offset. */
export default function Footer() {
  return (
    <Canvas as="footer" size={[2005, 580]} mobileSize={[900, 760]} className="footer" aria-label="Contact">
      <Logo href="#top" mark={[47.7, 200.3, 161.5, 161.25]} markMobile={[60, 70, 161.5, 161.25]} word={[171.6, 221.3]} wordMobile={[190, 90]} />
      <Text box={[345.2, 405.6, 216]} mobile={[300, 260, 216]} variant="note" color="white" nowrap>
        by jacqueline song
      </Text>
      {/* Left-aligned lines, but anchored to their right edge so larger
          minimum text sizes on tablets grow inwards. */}
      <ContactLines box={[1488.7, 454.7, 477]} mobile={[60, 520, 800]} anchor="right" align="left" />
    </Canvas>
  );
}

export function ContactLines({
  box,
  mobile,
  anchor,
  align,
}: {
  box: Box;
  mobile?: Box;
  anchor?: 'right';
  align?: 'left';
}) {
  return (
    <Text as="address" box={box} mobile={mobile} anchor={anchor} variant="note" color="white" nowrap className={align === 'left' ? 'footer__contact footer__contact--left' : 'footer__contact'}>
      write to me: <a href={links.email}>itsjacquelinehere@gmail.com</a>
      <br />
      or leave me a message: <a href={links.phone}>510-610-2682</a>
      <br />
      <br />
      instagram gallery: <a href={links.instagram}>@perlgray</a>
    </Text>
  );
}
