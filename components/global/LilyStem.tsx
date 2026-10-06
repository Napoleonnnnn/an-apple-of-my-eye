"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import BudShape from "@/components/lily/BudShape";
import { LILY_BLOOM, LILY_CLOSE, REDUCED_QUERY, clamp, scrollState, stemState } from "@/lib/motion-utils";

type Leaf = { x: number; y: number; side: 1 | -1 };
type Chunk = { top: number; h: number; d: string; i0: number; i1: number; leaves: number[] };
type Layout = {
  w: number;
  h: number;
  d: string;

  ts: number[];
  xs: number[];
  ys: number[];
  lens: number[];
  startY: number;
  endY: number;
  leaves: Leaf[];
  chunks: Chunk[];
  reduced: boolean;
  mobile: boolean;
};

const STEP = 10;
const CHUNK = 700;
const BUD_BOX = 80;

const smooth = (a: number, b: number, v: number) => {
  const u = clamp((v - a) / (b - a), 0, 1);
  return u * u * (3 - 2 * u);
};

function buildLayout(main: HTMLElement): Layout | null {
  const startEl = main.querySelector<HTMLElement>("[data-stem-start]");
  const endEl = main.querySelector<HTMLElement>("[data-stem-end]");
  if (!startEl || !endEl) return null;

  const mr = main.getBoundingClientRect();
  const centre = (el: Element) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2 - mr.left, y: r.top + r.height / 2 - mr.top };
  };
  const box = (el: Element) => {
    const r = el.getBoundingClientRect();
    return { top: r.top - mr.top, bottom: r.bottom - mr.top };
  };

  const w = main.clientWidth;
  const h = main.scrollHeight;
  const vh = window.innerHeight;
  const s = centre(startEl);
  const e = centre(endEl);
  const mobile = w < 768;
  const left = mobile ? 10 : Math.max(36, (w - 960) / 2 - 40);
  const right = w - left;
  const cross = mobile ? 70 : 110;

  const sections = Array.from(main.querySelectorAll<HTMLElement>("[data-bg]"))
    .slice(1)
    .filter((el) => !el.contains(endEl));

  const bands = sections.map((el, i) => {
    const forced = el.dataset.stemSide;

    const pull = Number(el.dataset.stemX);
    if (pull) return { el, ...box(el), x: w * pull };
    return { el, ...box(el), x: forced === "right" ? right : forced === "left" ? left : i % 2 === 0 ? left : right };
  });

  const sideAt = (y: number) => {
    let x = bands[0]?.x ?? left;
    for (let k = 1; k < bands.length; k++) x += (bands[k].x - x) * smooth(bands[k].top - cross, bands[k].top + cross, y);
    return x;
  };

  const xAt = (y: number) => {
    if (y <= s.y) return s.x;

    const out = mobile ? smooth(s.y + 15, s.y + vh * 0.2, y) : smooth(s.y + 40, s.y + vh * 0.55, y);
    const base = s.x + (sideAt(y) - s.x) * out;

    const back = smooth(e.y - (mobile ? 300 : 360), e.y - (mobile ? 150 : 190), y);
    return base + (e.x - base) * back;
  };

  const loopR = mobile ? 12 : 22;
  const loopLen = mobile ? 100 : 150;
  const loops: { a: number; b: number; dir: number }[] = [];
  sections.forEach((el, i) => {
    const n = Number(el.dataset.stemLoops ?? 0);
    if (!n) return;
    const b = bands[i];

    const span = Math.max(b.bottom - b.top - vh, vh * 0.5);
    for (let k = 0; k < n; k++) {
      const at = b.top + vh * 0.25 + span * ((k + 0.6) / (n + 0.4));
      loops.push({ a: at - loopLen / 2, b: at + loopLen / 2, dir: b.x < w / 2 ? 1 : -1 });
    }
  });

  const ts: number[] = [];
  const xs: number[] = [];
  const ys: number[] = [];
  for (let t = 0; t < e.y; t += STEP) {
    let x = xAt(t);
    let y = t;
    const loop = loops.find((l) => t > l.a && t < l.b);
    if (loop) {
      const th = ((t - loop.a) / (loop.b - loop.a)) * Math.PI * 2;
      x += loop.dir * loopR * (1 - Math.cos(th));
      y -= loopR * 1.3 * Math.sin(th);
    }
    ts.push(t);
    xs.push(x);
    ys.push(y);
  }
  ts.push(e.y);
  xs.push(e.x);
  ys.push(e.y);

  const lens = [0];
  for (let i = 1; i < xs.length; i++) {
    lens.push(lens[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]));
  }

  let d = `M${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`;
  for (let i = 1; i < xs.length - 1; i++) {
    const mx = (xs[i] + xs[i + 1]) / 2;
    const my = (ys[i] + ys[i + 1]) / 2;
    d += ` Q${xs[i].toFixed(1)} ${ys[i].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  d += ` L${e.x.toFixed(1)} ${e.y.toFixed(1)}`;

  const leaves: Leaf[] = bands.map((b) => {
    const y = clamp(b.top + cross + 70, s.y + 120, e.y - 360);
    const onLeft = sideAt(y) < w / 2;

    const inward = onLeft ? 1 : -1;
    return { x: xAt(y), y, side: (mobile ? inward : -inward) as 1 | -1 };
  });

  const chunks: Chunk[] = [];
  for (let top = 0; top < e.y; top += CHUNK) {
    let i0 = ys.findIndex((y) => y >= top);
    i0 = Math.max(0, i0 - 1);
    let i1 = ys.findIndex((y) => y > top + CHUNK);
    i1 = i1 === -1 ? ys.length - 1 : i1;
    let cd = `M${xs[i0].toFixed(1)} ${(ys[i0] - top).toFixed(1)}`;
    for (let i = i0 + 1; i <= i1; i++) cd += ` L${xs[i].toFixed(1)} ${(ys[i] - top).toFixed(1)}`;
    const chunkLeaves = leaves.map((l, li) => (l.y >= top && l.y < top + CHUNK ? li : -1)).filter((li) => li >= 0);
    chunks.push({ top, h: Math.min(CHUNK, e.y - top) + 12, d: cd, i0, i1, leaves: chunkLeaves });
  }

  const reduced = window.matchMedia(REDUCED_QUERY).matches;
  return { w, h, d, ts, xs, ys, lens, startY: s.y, endY: e.y, leaves, chunks, reduced, mobile };
}

function sampleAt(l: Layout, t: number) {
  const { ts, xs, ys, lens } = l;
  let lo = 0;
  let hi = ts.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (ts[mid] <= t) lo = mid;
    else hi = mid;
  }
  const f = clamp((t - ts[lo]) / (ts[hi] - ts[lo] || 1), 0, 1);
  const dx = xs[hi] - xs[lo];
  const dy = ys[hi] - ys[lo];
  return {
    t,
    x: xs[lo] + dx * f,
    y: ys[lo] + dy * f,
    len: lens[lo] + (lens[hi] - lens[lo]) * f,

    angle: (-Math.atan2(dx, dy) * 180) / Math.PI,
  };
}

export default function LilyStem() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const hiRefs = useRef<(SVGPathElement | null)[]>([]);
  const budRef = useRef<HTMLDivElement>(null);
  const budFadeRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<(SVGGElement | null)[]>([]);
  const [layout, setLayout] = useState<Layout | null>(null);
  const reduced = layout?.reduced ?? false;

  useEffect(() => {
    const main = rootRef.current!.parentElement!;
    let lastKey = "";
    const measure = () => {
      const l = buildLayout(main);
      if (!l) return;
      const key = `${l.w}|${l.h}|${l.d}|${l.reduced}`;
      if (key === lastKey) return;
      lastKey = key;
      setLayout(l);
    };
    const raf = requestAnimationFrame(measure);
    ScrollTrigger.addEventListener("refresh", measure);
    let resizeTimer = 0;
    const onWindowResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 200);
    };
    window.addEventListener("resize", onWindowResize);

    let timer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(main);

    return () => {
      ScrollTrigger.removeEventListener("refresh", measure);
      window.removeEventListener("resize", onWindowResize);
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!layout) return;
    // the stem is split into short chunks so only the one that is growing gets repainted
    const parts = layout.chunks.map((c, k) => {
      const path = pathRefs.current[k]!;
      const hi = hiRefs.current[k]!;
      const total = path.getTotalLength();
      const own = layout.lens[c.i1] - layout.lens[c.i0] || 1;
      for (const p of [path, hi]) p.style.strokeDasharray = `${total} ${total}`;
      return { c, path, hi, total, ratio: total / own, state: "" };
    });
    const setPart = (k: number, len: number) => {
      const part = parts[k];
      const offset = Math.min(part.total, Math.max(0, part.total - len * part.ratio));
      const state = offset.toFixed(1);
      if (state === part.state) return;
      part.state = state;
      part.path.style.strokeDashoffset = state;
      part.hi.style.strokeDashoffset = state;
      part.path.style.opacity = "1";
      part.hi.style.opacity = "1";
    };
    const leaves = leafRefs.current.slice(0, layout.leaves.length).filter(Boolean) as SVGGElement[];

    stemState.xAt = (y: number) => sampleAt(layout, y).x;

    if (reduced) {
      parts.forEach((_, k) => setPart(k, Infinity));
      gsap.set(leaves, { scale: 1, rotation: 0 });
      return;
    }

    gsap.set(leaves, { scale: 0, rotation: -40, transformOrigin: "0% 70%" });
    const grown = layout.leaves.map(() => false);

    const budScale = layout.mobile ? 0.72 : 1;
    let tip = sampleAt(layout, layout.startY);
    let bloomed = false;
    let prevX = tip.x;

    const update = (progress: number) => {
      tip = sampleAt(layout, layout.startY + (layout.endY - layout.startY) * progress);
      stemState.tipY = tip.t;
      const arrived = tip.t >= layout.endY - 40;
      const left = tip.t < layout.endY - 140;
      if (arrived && !bloomed) {
        bloomed = true;
        window.dispatchEvent(new Event(LILY_BLOOM));
      } else if (left && bloomed) {
        bloomed = false;
        window.dispatchEvent(new Event(LILY_CLOSE));
      }
      parts.forEach((part, k) => setPart(k, tip.len - layout.lens[part.c.i0]));
      layout.leaves.forEach((leaf, i) => {
        const g = tip.t > leaf.y + 8;
        if (g === grown[i]) return;
        grown[i] = g;
        gsap.to(
          leaves[i],
          g
            ? { scale: 1, rotation: 0, duration: 1.1, ease: "elastic.out(1, 0.5)", overwrite: true }
            : { scale: 0, rotation: -40, duration: 0.35, ease: "power2.in", overwrite: true },
        );
      });
    };

    const liveProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: () => update(liveProgress()) });
    const onResize = () => update(liveProgress());
    window.addEventListener("resize", onResize);
    update(liveProgress());

    let theta = 0;
    let omega = 0;
    const tick = (time: number) => {
      const dx = tip.x - prevX;
      prevX = tip.x;
      const v = clamp(scrollState.velocity, -40, 40);
      const target = clamp(v * 1.1 - dx * 2, -30, 30) + Math.sin(time * 1.5) * 4;
      omega = (omega + (target - theta) * 0.05) * 0.9;
      theta += omega;
      const el = budRef.current;
      if (el) {
        el.style.transform = `translate3d(${(tip.x - BUD_BOX / 2).toFixed(2)}px, ${tip.y.toFixed(2)}px, 0) rotate(${(tip.angle + theta).toFixed(2)}deg) scale(${budScale})`;
      }
    };
    gsap.ticker.add(tick);

    const fade = budFadeRef.current;
    const onBloom = () => gsap.to(fade, { opacity: 0, scale: 0.4, duration: 0.45, ease: "power2.in", overwrite: true });
    const onClose = () => gsap.to(fade, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", overwrite: true });
    window.addEventListener(LILY_BLOOM, onBloom);
    window.addEventListener(LILY_CLOSE, onClose);

    return () => {
      st.kill();
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tick);
      gsap.killTweensOf(leaves);
      window.removeEventListener(LILY_BLOOM, onBloom);
      window.removeEventListener(LILY_CLOSE, onClose);
    };
  }, [layout, reduced]);

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {layout && (
        <>
          {layout.chunks.map((c, k) => (
            <svg
              key={k}
              className="absolute left-0 z-0 overflow-visible"
              style={{ top: c.top }}
              width={layout.w}
              height={c.h}
              viewBox={`0 0 ${layout.w} ${c.h}`}
            >
              <defs>
                <linearGradient id={`stem-leaf-${k}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#7FA368" />
                  <stop offset="1" stopColor="#B4D29C" />
                </linearGradient>
              </defs>
              <path
                ref={(el) => {
                  pathRefs.current[k] = el;
                }}
                d={c.d}
                fill="none"
                stroke="#86A96F"
                strokeWidth="3.4"
                opacity="0"
                strokeLinecap="round"
              />
              <path
                ref={(el) => {
                  hiRefs.current[k] = el;
                }}
                d={c.d}
                fill="none"
                stroke="#CFE3BD"
                strokeWidth="1"
                opacity="0"
                strokeLinecap="round"
                transform="translate(-0.9 0)"
              />
              {c.leaves.map((i) => {
                const leaf = layout.leaves[i];
                return (
                  <g
                    key={i}
                    transform={`translate(${leaf.x.toFixed(1)} ${(leaf.y - c.top).toFixed(1)}) scale(${leaf.side * (layout.mobile ? 0.6 : 1)} ${layout.mobile ? 0.6 : 1}) rotate(-28)`}
                  >
                    <g
                      ref={(el) => {
                        leafRefs.current[i] = el;
                      }}
                    >
                      <path d="M0 0 C 14 -16, 38 -20, 54 -6 C 38 6, 16 8, 0 0Z" fill={`url(#stem-leaf-${k})`} stroke="#6F9759" strokeWidth="0.8" />
                      <path d="M3 -1 C 18 -8, 34 -10, 48 -6" fill="none" stroke="#E4F0D8" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
                    </g>
                  </g>
                );
              })}
            </svg>
          ))}

          {!reduced && (
            <div
              ref={budRef}
              className="absolute left-0 top-0 z-20 will-change-transform"
              style={{
                width: BUD_BOX,
                height: BUD_BOX,
                transformOrigin: "50% 0%",
                transform: `translate3d(${layout.xs[0] - BUD_BOX / 2}px, ${layout.startY}px, 0)`,
              }}
            >
              <div ref={budFadeRef} className="size-full" style={{ transformOrigin: "50% 0%" }}>
                <svg viewBox={`${-BUD_BOX / 2} 0 ${BUD_BOX} ${BUD_BOX}`} className="size-full overflow-visible drop-shadow-[0_6px_8px_rgba(110,31,46,0.18)]">
                  <BudShape gradientId="riding-bud" />
                </svg>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
