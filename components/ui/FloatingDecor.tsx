"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Lily from "@/components/lily/Lily";
import { MOTION_OK_QUERY } from "@/lib/motion-utils";

type Kind = "petal" | "sparkle" | "lily" | "leaf" | "dot";
export type DecorItem = {
  kind: Kind;

  x: number;
  y: number;
  size: number;

  depth: number;
  rotate?: number;
  hideOnMobile?: boolean;
};

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
          const depth = items[i].depth;
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
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {items.map((it, i) => (
        <div
          key={i}
          className={`decor absolute ${it.hideOnMobile ? "hidden md:block" : ""}`}
          style={{ left: `${it.x}%`, top: `${it.y}%`, width: it.size, height: it.size, rotate: `${it.rotate ?? 0}deg` }}
        >
          <Shape kind={it.kind} />
        </div>
      ))}
    </div>
  );
}
