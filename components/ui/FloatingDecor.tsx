"use client";

import { useRef } from "react";
import { gsap, useGSAP, whileVisible } from "@/lib/gsap";
import Lily from "@/components/lily/Lily";
import Favorite, { type FavoriteKind } from "@/components/ui/Favorites";
import { MOTION_OK_QUERY, burstPetals, clamp, scrollState } from "@/lib/motion-utils";

type Kind = "petal" | "sparkle" | "lily" | "leaf" | "dot" | FavoriteKind;
export type DecorItem = {
  kind: Kind;
  x: number;
  y: number;
  size: number;
  depth: number;
  rotate?: number;
  hideOnMobile?: boolean;
};

const FAVORITES = new Set<Kind>(["camera", "pineapple", "f1", "mirror", "compact", "matcha", "swatch", "seblak", "cake", "book", "moon", "phone"]);

function Shape({ kind }: { kind: Kind }) {
  switch (kind) {
    case "petal":
      return (
        <svg viewBox="0 0 24 24" className="size-full">
          <path d="M12 2 C 19 6, 20 14, 12 22 C 4 14, 5 6, 12 2Z" fill="#FFD6E0" stroke="#F4A3B9" strokeWidth="1" />
          <path d="M12 6 L12 18" stroke="#F4A3B9" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
      );
    case "sparkle":
      return (
        <svg viewBox="0 0 20 20" className="size-full">
          <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" fill="#F6C66B" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 30 20" className="size-full">
          <path d="M2 10 C 8 2, 20 0, 28 8 C 20 16, 8 18, 2 10Z" fill="#B4D29C" stroke="#86A96F" strokeWidth="1" />
          <path d="M4 10 C 12 8, 20 8, 26 8" stroke="#86A96F" strokeWidth="0.8" fill="none" />
        </svg>
      );
    case "lily":
      return <Lily className="size-full" />;
    case "dot":
      return <span className="block size-full rounded-full bg-blush" />;
    default:
      return <Favorite kind={kind} />;
  }
}

export default function FloatingDecor({ items }: { items: DecorItem[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const els = gsap.utils.toArray<HTMLElement>(".decor", ref.current);
        els.forEach((el, i) => {
          const depth = FAVORITES.has(items[i].kind) ? items[i].depth * 0.55 : items[i].depth;
          gsap.fromTo(
            el,
            { y: depth * 160, rotation: (items[i].rotate ?? 0) - depth * 60 },
            {
              y: depth * -160,
              rotation: (items[i].rotate ?? 0) + depth * 60,
              ease: "none",
              scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.4 },
            },
          );
        });
        const pops = gsap.utils.toArray<HTMLElement>(".fav-in", ref.current);
        if (pops.length) {
          gsap.fromTo(
            pops,
            { scale: 0, rotation: -200 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.9,
              ease: "back.out(1.8)",
              stagger: 0.15,
              scrollTrigger: { trigger: ref.current, start: "top 75%", toggleActions: "play none none reverse" },
            },
          );
          const wobble = gsap.quickTo(pops, "skewX", { duration: 0.5, ease: "power3.out" });
          const tick = () => wobble(clamp(scrollState.velocity * 0.5, -12, 12));
          whileVisible(gsap.to({}, { duration: 1, repeat: -1, onUpdate: tick }), ref.current);
        }
      });
    },
    { scope: ref },
  );

  const onTap = (e: React.PointerEvent<HTMLButtonElement>) => {
    const inner = e.currentTarget.firstElementChild;
    if (inner)
      gsap.fromTo(
        inner,
        { rotation: 0, scale: 1 },
        { rotation: 360, scale: 1.25, duration: 0.6, ease: "back.out(2)", yoyo: false, onComplete: () => gsap.set(inner, { scale: 1 }) },
      );
    burstPetals({ x: e.clientX, y: e.clientY, count: 8, power: 3 });
  };

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {items.map((it, i) => {
        const fav = FAVORITES.has(it.kind);
        return (
          <div
            key={i}
            className={`decor absolute ${it.hideOnMobile ? "hidden md:block" : ""}`}
            style={{
              left: `max(6px, min(${it.x}%, calc(100% - ${(fav ? Math.round(it.size * 1.25) : it.size) + 8}px)))`,
              top: `${it.y}%`,
              width: fav ? Math.round(it.size * 1.25) : it.size,
              height: fav ? Math.round(it.size * 1.25) : it.size,
              rotate: `${it.rotate ?? 0}deg`,
            }}
          >
            {fav ? (
              <button type="button" tabIndex={-1} onPointerDown={onTap} className="pointer-events-auto block size-full cursor-pointer rounded-full">
                <span className="fav-in block size-full drop-shadow-[0_6px_8px_rgba(110,31,46,0.22)]">
                  <Shape kind={it.kind} />
                </span>
              </button>
            ) : (
              <Shape kind={it.kind} />
            )}
          </div>
        );
      })}
    </div>
  );
}
