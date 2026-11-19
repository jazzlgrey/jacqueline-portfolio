import { Layer } from './Layer';
import type { Box } from './layout';
import { links } from '../links';

/** The "projects  writings  library" navigation (Note style, frost). */
export function SiteNav({ box, mobile }: { box: Box; mobile?: Box }) {
  return (
    <Layer as="nav" box={box} mobile={mobile} anchor="right" fit aria-label="Primary" className="site-nav">
      <ul className="site-nav__list type type--note color--frost">
        <li>
          <a href={links.projects}>projects</a>
        </li>
        <li>
          <a href={links.writings}>writings</a>
        </li>
        <li>
          <a href={links.library}>library</a>
        </li>
      </ul>
    </Layer>
  );
}
