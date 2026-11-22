import { Canvas } from '../components/Canvas';
import { Art } from '../components/Art';
import { Layer } from '../components/Layer';
import { Text } from '../components/Text';
import { img } from '../assets';
import { links } from '../links';
import type { VarStyle } from '../components/layout';
import './Projects.css';

/**
 * Figma frame "Projects" (15:166, 1996 × 6603 at x=2) plus the two loose
 * layers that sit on the Home frame below it. The canvas starts at the end of
 * the About frame, so it also includes the 88px gap above Projects.
 *
 * The arcade PNGs have transparent windows: artworks are layered *under*
 * them and show through the arches, exactly as in Figma.
 */
const TOP = 88; // About ends at y=2727, Projects starts at y=2815.

export default function Projects() {
  return (
    <Canvas size={[2005, TOP + 6603 + 2]} id="projects" aria-labelledby="projects-title" className="projects">
      <Layer box={[2, TOP, 1996, 6603]} clip className="projects__frame">
        <Art {...img.ua862} alt="" box={[1362, 1295, 575, 402]} crop={[-77.55, -65.12, 177.55, 383.38]} />
        <Art
          {...img.projectsTexture}
          alt=""
          box={[2, 5664, 1994, 941]}
          rotate={{ deg: -90, inner: [941, 1994] }}
          className="projects__texture"
        />
        <Art {...img.stainedGlassA} alt="" box={[490, 3842, 243, 332]} fit="fill" />
        <Art
          {...img.vespers}
          alt="Vesper, painting detail: a hand with red nails resting at red lips."
          box={[1315, 4191, 666, 1488]}
          crop={[-27.06, -0.01, 169.07, 100.9]}
        />
        <Art
          {...img.matinsInstallation}
          alt="Matin, installation view: a painting reflected in an ornate gold mirror beside a candle."
          box={[15, 4174, 683, 1505]}
          fit="fill"
        />
        <Art {...img.pinkMosaic} alt="" box={[1759, 3150, 222, 324]} fit="fill" />
        <Art
          {...img.atcbLogo}
          alt="Argentine Tango Club of Berkeley logo: a pink dancing couple silhouette."
          box={[-32, 2745, 755, 755]}
          radius={77}
        />
        <Art {...img.stainedGlassB} alt="" box={[480, 1718, 263, 327]} fit="fill" />
        <Art
          {...img.ua862}
          alt="ATLAS: painted moonlit lotus pond with a moon face."
          box={[1005, 1697, 928, 696]}
          crop={[-0.03, -101.11, 100, 201.12]}
        />
        <Art {...img.stainedGlassA} alt="" box={[1528, 290, 243, 332]} fit="fill" />
        <Art {...img.stainedGlassC} alt="" box={[1245, 960, 274, 332]} fit="fill" />
        <Art
          {...img.theStranger}
          alt="The Stranger, detail: blue painted fabric with torn newspaper and a coin."
          box={[36, 262, 687, 1051]}
          crop={[0, -12.19, 100, 116.13]}
        />
        <Art {...img.arcades} alt="" box={[0, 194, 2001, 1503]} crop={[0.02, 1.75, 100, 100.01]} />
        <Art {...img.arcades} alt="" box={[2, 1631, 2001, 1503]} crop={[0.02, 1.75, 100, 100.01]} />
        <Art {...img.whiteLotus} alt="" box={[1706, 0, 227, 214]} />

        {/* "selected" in Season Mix, "projects" in Kapakana dropped below. */}
        <Text as="h2" id="projects-title" box={[64, 10, 704]} variant="title" color="lotus" nowrap className="mixed-title">
          selected{' '}
          <span className="mixed-title__script mixed-title__drop" style={{ '--ks': 168, '--sx': -19, '--sy': 46 } as VarStyle}>
            projects
          </span>
        </Text>

        {/* 01 — The Stranger */}
        <Text as="h3" box={[1528, 708, 357]} mobile={[1528, 660, 357]} variant="heading" color="ice" anchor="right" nowrap>
          The Stranger
        </Text>
        {/* 02 — ATLAS */}
        <Text as="h3" box={[60, 2229, 195]} mobile={[60, 2170, 195]} variant="heading" color="ice" nowrap>
          <a href={links.atlas}>ATLAS</a>
        </Text>
        {/* 03 — Tango */}
        <Text as="h3" box={[1749, 2943, 172]} mobile={[1749, 2895, 172]} variant="heading" color="lotus" anchor="right" nowrap>
          Tango
        </Text>
        <Text box={[1597, 807, 288]} variant="note" color="frost" anchor="right" nowrap>
          art | mixed media | 2021
        </Text>
        <Text box={[60, 2316, 528]} variant="note" color="frost" nowrap>
          creative teach | digital installation | 2026
        </Text>
        <Text box={[677, 610, 24]} variant="note" color="frost" nowrap>
          01
        </Text>
        <Text box={[1291, 2135, 24]} variant="note" color="frost" nowrap>
          02
        </Text>

        <Art {...img.arcades} alt="" box={[-2, 3067, 2001, 1108]} crop={[0.02, 2.37, 100, 135.67]} />

        <Text box={[1369, 3043, 552, 47]} mobile={[821, 3043, 1100]} variant="note" color="frost" anchor="right">
          design | organizational rebrand for the argentine tango club of berkeley | 2025
        </Text>
        <Text box={[652, 3111, 24]} variant="note" color="frost" nowrap>
          03
        </Text>

        {/* 04 — Matin & Vesper */}
        <Art {...img.threeArches} alt="" box={[2, 4175, 2005, 1504]} />
        <h3 className="projects__matin-vesper">
          <Text as="span" box={[923, 4530, 164]} mobile={[923, 4470, 164]} variant="heading" color="ice" anchor="center" nowrap>
            Matin
          </Text>{' '}
          <Text as="span" box={[984, 4619, 43]} mobile={[984, 4610, 43]} variant="heading" color="ice" anchor="center" nowrap>
            &amp;
          </Text>{' '}
          <Text as="span" box={[905, 4709, 193]} mobile={[905, 4750, 193]} variant="heading" color="ice" anchor="center" nowrap>
            Vesper
          </Text>
        </h3>
        <Text box={[885, 6200, 240]} variant="note" color="white" anchor="center" nowrap>
          <a href={links.projects} aria-label="view more projects">
            view more projects --&gt;
          </a>
        </Text>
        <Text box={[1921, 4235, 24]} variant="note" color="frost" nowrap>
          04
        </Text>
      </Layer>

      {/* Loose layers on the Home frame (16:252, 16:254). */}
      <Text box={[858, 7685 - 2727, 300]} mobile={[858, 5010, 300]} variant="note" color="frost" anchor="center" nowrap>
        art | installation | 2024
      </Text>
      <Art {...img.whiteLotus} alt="" box={[915, 8755 - 2727, 227, 214]} />
    </Canvas>
  );
}
