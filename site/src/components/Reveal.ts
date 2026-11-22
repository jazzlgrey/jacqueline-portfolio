import { useEffect } from 'react';

/**
 * Scroll reveals (inspired by the prototype notes): elements with the
 * `reveal` class fade and slide in, `reveal--line` elements draw from their
 * start, the first time they enter the viewport. Without JS, or with reduced
 * motion, everything is simply visible. Pass `ready` when the content
 * arrives later (e.g. fetched data) to scan once it is there.
 */
export function useReveal(ready: unknown = true) {
  useEffect(() => {
    if (!ready || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = [...document.querySelectorAll<HTMLElement>('.reveal')];
    const vh = window.innerHeight;
    // Things already on screen at load stay put; the rest wait for scroll.
    const pending = els.filter((el) => el.getBoundingClientRect().top > vh * 0.92);
    if (!pending.length) return;
    pending.forEach((el) => el.classList.add('reveal--pending'));
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        // Reveal what came into view, plus anything already scrolled past
        // (a jump to the end or an anchor link skips over sections).
        const bottom = window.innerHeight;
        for (const el of pending) {
          if (!el.classList.contains('reveal--pending')) continue;
          if (el.getBoundingClientRect().top < bottom) {
            el.classList.remove('reveal--pending');
            io.unobserve(el);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ready]);
}
