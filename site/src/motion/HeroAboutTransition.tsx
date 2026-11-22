import { useEffect, useRef } from 'react';
import { img } from '../assets';
import './HeroAboutTransition.css';

/** Where the veiled swing figure sits inside the hero painting (design px). */
const FIGURE = { x: 1350, y: 412, w: 260, h: 482 };

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t); // smoothstep
};

/**
 * Prototype transition "fall, fade, return": scrolling down from the hero,
 * the hero fades out while the swing figure drops out of the bottom of the
 * screen; About then fades in and its figure floats back up into place.
 *
 * Scroll-linked (scrubs both ways). Desktop/tablet only; off with reduced
 * motion, where the page stays exactly as designed.
 */
export function HeroAboutTransition() {
  const fig = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hero');
    const about = document.querySelector<HTMLElement>('.about');
    const carousel = document.querySelector<HTMLElement>('.about__carousel');
    const f = fig.current;
    if (!hero || !about || !carousel || !f) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px)');
    let raf = 0;

    const reset = () => {
      hero.style.opacity = '';
      about.style.opacity = '';
      carousel.style.translate = '';
      f.style.visibility = 'hidden';
    };

    const update = () => {
      raf = 0;
      if (mq.matches) return reset();
      const r = hero.getBoundingClientRect();
      const u = r.width / 2005;
      const vh = window.innerHeight;
      const q = -r.top / r.height; // 0 at the top, 1 once the hero has scrolled away

      hero.style.opacity = String(1 - ramp(0.04, 0.55, q));

      // The figure lifts off the painting and falls out of the screen.
      const show = ramp(0.0, 0.08, q);
      const fall = clamp((q - 0.06) / 0.5);
      if (show > 0 && fall < 1) {
        const drop = fall * fall * (vh + FIGURE.h * u);
        f.style.visibility = 'visible';
        f.style.opacity = String(show);
        f.style.left = `${r.left + FIGURE.x * u}px`;
        f.style.top = `${FIGURE.y * u}px`;
        f.style.width = `${FIGURE.w * u}px`;
        f.style.height = `${FIGURE.h * u}px`;
        f.style.transform = `translateY(${drop}px) rotate(${fall * 14}deg)`;
      } else {
        f.style.visibility = 'hidden';
      }

      // About fades in; its figure floats up from below into place.
      const into = ramp(0.5, 0.92, q);
      about.style.opacity = String(into);
      const rise = 1 - ramp(0.5, 1.05, q);
      carousel.style.translate = rise > 0 ? `0 ${rise * 0.55 * vh}px` : '';
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    mq.addEventListener('change', request);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      mq.removeEventListener('change', request);
      reset();
    };
  }, []);

  return (
    <img
      ref={fig}
      className="fall-figure"
      src={img.swingFig.src}
      alt=""
      aria-hidden="true"
      width={img.swingFig.intrinsic[0]}
      height={img.swingFig.intrinsic[1]}
    />
  );
}
