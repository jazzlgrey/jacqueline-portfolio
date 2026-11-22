import { img } from '../assets';
import homeLabel from '../assets/svg/home-label.svg';
import './HomeMark.css';

/** The fixed sun-moon "home" link of the inner pages. */
export function HomeMark() {
  return (
    <a href="./" className="home-mark" aria-label="home">
      <img className="home-mark__label" src={homeLabel} alt="" />
      <img className="home-mark__mark" src={img.sunMoon.src} alt="" width={img.sunMoon.intrinsic[0]} height={img.sunMoon.intrinsic[1]} />
    </a>
  );
}

/**
 * Large Kapakana display line ("creating...", "reading..."): Figma roughens
 * its outline with a noise effect, recreated by this SVG filter.
 */
export function RoughFilter() {
  return (
    <svg className="rough-defs" aria-hidden="true" focusable="false">
      {/* Generous region: the script glyphs overhang their text box. */}
      <filter id="rough" x="-15%" y="-30%" width="130%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" />
        <feDisplacementMap in="SourceGraphic" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
