// Image assets exported from the Figma file (see scripts/optimize-assets.py).
// Each entry: [url, intrinsic width, intrinsic height].
import aboutStainedGlass from './assets/figma/about-stained-glass.webp';
import arcades from './assets/figma/arcades.webp';
import atcbLogo from './assets/figma/atcb-logo.webp';
import blackLotus from './assets/figma/black-lotus.webp';
import blueJellyfish from './assets/figma/blue-jellyfish.webp';
import blueJellyfish2 from './assets/figma/blue-jellyfish2.webp';
import fiveJellyfish1 from './assets/figma/five-jellyfish-1.webp';
import fiveJellyfish2 from './assets/figma/five-jellyfish-2.webp';
import heroTexture from './assets/figma/hero-texture.webp';
import lotusLeaf from './assets/figma/lotus-leaf.webp';
import matinsInstallation from './assets/figma/matins-installation.webp';
import pinkLotus from './assets/figma/pink-lotus.webp';
import pinkMosaic from './assets/figma/pink-mosaic.webp';
import projectsTexture from './assets/figma/projects-texture.webp';
import stainedGlassA from './assets/figma/stained-glass-a.webp';
import stainedGlassB from './assets/figma/stained-glass-b.webp';
import stainedGlassC from './assets/figma/stained-glass-c.webp';
import sunMoon from './assets/figma/sun-moon.webp';
import swingFig from './assets/figma/swing-fig.webp';
import theStranger from './assets/figma/the-stranger.webp';
import theStrangerSm from './assets/figma/the-stranger-sm.webp';
import threeArches from './assets/figma/three-arches.webp';
import ua862 from './assets/figma/ua862.webp';
import ua862Sm from './assets/figma/ua862-sm.webp';
import vespers from './assets/figma/vespers.webp';
import vespersSm from './assets/figma/vespers-sm.webp';
import whiteLotus from './assets/figma/white-lotus.webp';
import atcbLogoOld from './assets/figma/atcb-logo-old.webp';
import atlasBackground from './assets/figma/atlas-background.webp';
import exhibition1 from './assets/figma/exhibition-1.webp';
import exhibition2 from './assets/figma/exhibition-2.webp';
import exhibition3 from './assets/figma/exhibition-3.webp';
import gymnopedie from './assets/figma/gymnopedie.webp';
import matinsAltar from './assets/figma/matins-altar.webp';
import matinsDetail from './assets/figma/matins-detail.webp';
import monster from './assets/figma/monster.webp';
import strangerDetails from './assets/figma/stranger-details.webp';
import strangerPart2 from './assets/figma/stranger-part-2.webp';
import ua862Process1 from './assets/figma/ua862-process-1.webp';
import vesperSh from './assets/figma/vesper-sh.webp';
import vespersPortrait from './assets/figma/vespers-portrait.webp';

type Asset = { src: string; intrinsic: readonly [number, number]; srcSet?: string };
const a = (src: string, w: number, h: number, small?: [string, number]): Asset => ({
  src,
  intrinsic: [w, h],
  srcSet: small ? `${small[0]} ${small[1]}w, ${src} ${w}w` : undefined,
});

export const img = {
  aboutStainedGlass: a(aboutStainedGlass, 442, 700),
  arcades: a(arcades, 1447, 1087),
  atcbLogo: a(atcbLogo, 1510, 1510),
  blackLotus: a(blackLotus, 235, 408),
  blueJellyfish: a(blueJellyfish, 511, 496),
  blueJellyfish2: a(blueJellyfish2, 646, 430),
  fiveJellyfish1: a(fiveJellyfish1, 575, 575),
  fiveJellyfish2: a(fiveJellyfish2, 575, 575),
  heroTexture: a(heroTexture, 576, 1024),
  lotusLeaf: a(lotusLeaf, 209, 343),
  matinsInstallation: a(matinsInstallation, 768, 1024),
  pinkLotus: a(pinkLotus, 314, 912),
  pinkMosaic: a(pinkMosaic, 576, 1024),
  projectsTexture: a(projectsTexture, 576, 1024),
  stainedGlassA: a(stainedGlassA, 442, 700),
  stainedGlassB: a(stainedGlassB, 442, 700),
  stainedGlassC: a(stainedGlassC, 442, 700),
  sunMoon: a(sunMoon, 432, 434),
  swingFig: a(swingFig, 487, 902),
  theStranger: a(theStranger, 1179, 2096, [theStrangerSm, 600]),
  threeArches: a(threeArches, 1448, 1086),
  ua862: a(ua862, 2000, 3022, [ua862Sm, 900]),
  vespers: a(vespers, 2260, 3013, [vespersSm, 1000]),
  whiteLotus: a(whiteLotus, 607, 571),
  atcbLogoOld: a(atcbLogoOld, 1100, 1100),
  atlasBackground: a(atlasBackground, 1970, 2977),
  exhibition1: a(exhibition1, 1400, 1050),
  exhibition2: a(exhibition2, 1400, 1050),
  exhibition3: a(exhibition3, 1600, 1200),
  gymnopedie: a(gymnopedie, 1100, 822),
  matinsAltar: a(matinsAltar, 1700, 2267),
  matinsDetail: a(matinsDetail, 600, 800),
  monster: a(monster, 2200, 1775),
  strangerDetails: a(strangerDetails, 560, 996),
  strangerPart2: a(strangerPart2, 1700, 1275),
  ua862Process1: a(ua862Process1, 765, 1024),
  vesperSh: a(vesperSh, 768, 1024),
  vespersPortrait: a(vespersPortrait, 1100, 1467),
} as const;
