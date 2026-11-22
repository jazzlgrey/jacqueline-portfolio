import { useEffect, useRef, useState } from 'react';
import { Layer } from './Layer';
import { cx, type Box, type VarStyle } from './layout';
import './ParticleCarousel.css';

export type Slide = {
  src: string;
  intrinsic: readonly [number, number];
  alt: string;
  /** Box in design px relative to the carousel box. */
  box: readonly [number, number, number, number];
  /** Corner radius in design px. */
  radius?: number;
};

type Props = {
  box: Box;
  mobile?: Box;
  slides: Slide[];
  /** How long each image rests, ms (prototype: 4s). */
  hold?: number;
  className?: string;
};

const MORPH = 2600; // particle transition, ms

type Points = { x: Float32Array; y: Float32Array; c: Uint32Array; n: number; step: number };

/**
 * Cycles through images. Between two images the old one dissolves into
 * particles that drift and re-form as the next one (prototype note).
 * Runs only while on screen; with reduced motion it simply cross-fades.
 */
export function ParticleCarousel({ box, mobile, slides, hold = 4000, className }: Props) {
  const [active, setActive] = useState(0);
  const [morphing, setMorphing] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let cur = 0;
    let timer = 0;
    let raf = 0;
    let busy = false;
    const cache = new Map<string, Points>();

    const [, , boxW, boxH] = [0, 0, box[2], box[3] ?? box[2]];

    /** Sample one slide's pixels at the canvas's current resolution. */
    function sample(i: number): Points | null {
      const im = imgs.current[i];
      if (!im || !im.complete || !im.naturalWidth) return null;
      const key = `${i}:${cv!.width}`;
      const hit = cache.get(key);
      if (hit) return hit;
      const k = cv!.width / boxW; // canvas px per design px
      const s = slides[i];
      const w = Math.max(1, Math.round(s.box[2] * k));
      const h = Math.max(1, Math.round(s.box[3] * k));
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const g = off.getContext('2d', { willReadFrequently: true })!;
      if (s.radius) {
        const r = Math.min(s.radius * k, w / 2, h / 2);
        g.beginPath();
        g.roundRect(0, 0, w, h, r);
        g.clip();
      }
      // object-fit: cover
      const sc = Math.max(w / im.naturalWidth, h / im.naturalHeight);
      const dw = im.naturalWidth * sc;
      const dh = im.naturalHeight * sc;
      g.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh);
      const data = new Uint32Array(g.getImageData(0, 0, w, h).data.buffer);
      const step = Math.max(3, Math.round(cv!.width / 170));
      const xs: number[] = [];
      const ys: number[] = [];
      const cs: number[] = [];
      const ox = s.box[0] * k;
      const oy = s.box[1] * k;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const px = data[y * w + x];
          if (px >>> 24 < 60) continue; // transparent
          xs.push(ox + x);
          ys.push(oy + y);
          cs.push(px | 0xff000000);
        }
      }
      const pts = { x: Float32Array.from(xs), y: Float32Array.from(ys), c: Uint32Array.from(cs), n: xs.length, step };
      cache.set(key, pts);
      return pts;
    }

    function size() {
      const r = el!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cv!.width = Math.max(1, Math.round(r.width * dpr));
      cv!.height = Math.max(1, Math.round((r.width * dpr * boxH) / boxW));
    }

    function morph(from: number, to: number, done: () => void) {
      size();
      const A = sample(from);
      const B = sample(to);
      const ctx = cv!.getContext('2d');
      if (!A || !B || !A.n || !B.n || !ctx) return done();
      const W = cv!.width;
      const H = cv!.height;
      const N = Math.max(A.n, B.n);
      // Per-particle randomness: start delay and a drift direction.
      const delay = new Float32Array(N);
      const dx = new Float32Array(N);
      const dy = new Float32Array(N);
      const spread = W * 0.18;
      for (let i = 0; i < N; i++) {
        delay[i] = Math.random() * 0.3;
        const ang = Math.random() * Math.PI * 2;
        const rad = spread * (0.3 + Math.random() * 0.7);
        dx[i] = Math.cos(ang) * rad;
        dy[i] = Math.sin(ang) * rad - spread * 0.35; // drift upwards, like rising sparks
      }
      const frame = ctx.createImageData(W, H);
      const buf = new Uint32Array(frame.data.buffer);
      const t0 = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const mix = (a: number, b: number, t: number) => {
        const r = (a & 255) + ((b & 255) - (a & 255)) * t;
        const g = ((a >>> 8) & 255) + (((b >>> 8) & 255) - ((a >>> 8) & 255)) * t;
        const bl = ((a >>> 16) & 255) + (((b >>> 16) & 255) - ((a >>> 16) & 255)) * t;
        return (0xff000000 | (bl << 16) | (g << 8) | r) >>> 0;
      };

      const tick = (now: number) => {
        const T = Math.min(1, (now - t0) / MORPH);
        buf.fill(0);
        for (let i = 0; i < N; i++) {
          const ia = Math.floor((i * A.n) / N);
          const ib = Math.floor((i * B.n) / N);
          const t = Math.min(1, Math.max(0, (T - delay[i]) / 0.7));
          const e = ease(t);
          const lift = Math.sin(Math.PI * t);
          const x = A.x[ia] + (B.x[ib] - A.x[ia]) * e + dx[i] * lift;
          const y = A.y[ia] + (B.y[ib] - A.y[ia]) * e + dy[i] * lift;
          // Solid at the ends, fine dust in the middle.
          const s = Math.max(1, Math.round(Math.max(A.step, B.step) * (1 - 0.65 * lift)));
          const col = mix(A.c[ia], B.c[ib], e);
          const x0 = Math.round(x);
          const y0 = Math.round(y);
          if (x0 < 0 || y0 < 0 || x0 + s > W || y0 + s > H) continue;
          for (let yy = 0; yy < s; yy++) {
            const row = (y0 + yy) * W + x0;
            for (let xx = 0; xx < s; xx++) buf[row + xx] = col;
          }
        }
        ctx.putImageData(frame, 0, 0);
        if (T < 1) raf = requestAnimationFrame(tick);
        else done();
      };
      raf = requestAnimationFrame(tick);
    }

    function schedule() {
      clearTimeout(timer);
      if (!visible || busy) return;
      timer = window.setTimeout(advance, hold);
    }

    function advance() {
      if (!visible || document.hidden) return;
      const next = (cur + 1) % slides.length;
      if (reduce.matches) {
        cur = next;
        setActive(next);
        schedule();
        return;
      }
      busy = true;
      setMorphing(true);
      morph(cur, next, () => {
        cur = next;
        setActive(next);
        setMorphing(false);
        // The crisp image fades in over the last particle frame.
        window.setTimeout(() => {
          cv!.getContext('2d')?.clearRect(0, 0, cv!.width, cv!.height);
          busy = false;
          schedule();
        }, 350);
      });
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
        else clearTimeout(timer);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    const onVis = () => (document.hidden ? clearTimeout(timer) : schedule());
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [box, slides, hold]);

  const [, , bw, bh = bw] = box;
  return (
    <Layer box={box} mobile={mobile} className={cx('pcarousel', morphing && 'pcarousel--morphing', className)}>
      <div ref={root} className="pcarousel__inner">
      {/* Particles draw beneath the slides, so the next image fades in over them. */}
      <canvas ref={canvas} className="pcarousel__canvas" aria-hidden="true" />
      {slides.map((s, i) => {
        const style: VarStyle = {
          left: `${(s.box[0] / bw) * 100}%`,
          top: `${(s.box[1] / bh) * 100}%`,
          width: `${(s.box[2] / bw) * 100}%`,
          height: `${(s.box[3] / bh) * 100}%`,
          '--radius': s.radius ?? 0,
        };
        return (
          <div key={s.src} className={cx('pcarousel__slide', i === active && 'is-active')} style={style} aria-hidden={i !== active}>
            <img
              ref={(n) => (imgs.current[i] = n)}
              src={s.src}
              alt={s.alt}
              width={s.intrinsic[0]}
              height={s.intrinsic[1]}
              decoding="async"
            />
          </div>
        );
      })}
      </div>
    </Layer>
  );
}
