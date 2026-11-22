import { useEffect } from 'react';

/**
 * Scroll reveals (inspired by the prototype notes): elements with the
 * `reveal` class fade and slide in, `reveal--line` elements draw from their
 * start, the first time they enter the viewport. Without JS, or with reduced
 * motion, everything is simply visible.
 */
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = [...document.querySelectorAll<HTMLElement>('.reveal')];
    const vh = window.innerHeight;
    // Things already on screen at load stay put; the rest wait for scroll.
    const pending = els.filter((el) => el.getBoundingClientRect().top > vh * 0.92);
    if (!pending.length) return;
    pending.forEach((el) => el.classList.add('reveal--pending'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.remove('reveal--pending');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
