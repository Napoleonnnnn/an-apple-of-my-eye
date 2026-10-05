"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK_QUERY, burstPetals } from "@/lib/motion-utils";

function Sprig({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 40 16" className={`h-3 w-6 md:h-3.5 md:w-9 ${flip ? "-scale-x-100" : ""}`} aria-hidden>
      <path d="M2 8 H30" stroke="#86A96F" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 8 C 14 3, 19 2, 22 3 C 19 6, 16 8, 12 8Z" fill="#9CC08A" />
      <path d="M20 8 C 22 13, 27 14, 30 13 C 27 10, 24 8, 20 8Z" fill="#86A96F" />
      <circle cx="34" cy="8" r="3" fill="#FFD6E0" stroke="#F4A3B9" strokeWidth="1" />
    </svg>
  );
}

export default function SectionTitle({ eyebrow, children }: { eyebrow?: string; children: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const words = children.split(" ");

  const size = children.length > 40 ? "text-[clamp(1.45rem,6.2vw,2.1rem)] md:text-[2.4rem]" : "text-[clamp(2rem,9vw,2.4rem)] md:text-[3.4rem]";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const el = ref.current!;
        let burst = false;
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "top 55%",
              scrub: 0.7,
              onLeave: () => {
                if (burst) return;
                burst = true;
                const r = el.getBoundingClientRect();
                burstPetals({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 12, power: 4 });
              },
            },
          })
          .from(".title-pill", { scale: 0.6, opacity: 0, ease: "power2.out", duration: 0.5 }, 0)
          .from(".title-eyebrow", { y: 20, opacity: 0, duration: 0.4 }, 0)
          .from(".title-sprig", { scaleX: 0, opacity: 0, ease: "back.out(2)", duration: 0.4, stagger: 0.1 }, 0.1)
          .from(
            ".title-letter",
            {
              x: "random(-90, 90)",
              y: "random(60, 160)",
              rotation: "random(-90, 90)",
              scale: "random(0.3, 0.8)",
              opacity: 0,
              ease: "back.out(1.4)",
              stagger: { amount: 0.8, from: "random" },
            },
            0.1,
          );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative z-10 flex justify-center">
      <div className="relative flex max-w-xl flex-col items-center gap-2 px-5 py-3 text-center">
        <span aria-hidden className="title-pill absolute inset-0 -z-10 rounded-[2rem] bg-[var(--page-bg)]" />
        {eyebrow && (
          <p className="flex items-center gap-2 text-sm tracking-[0.18em] text-cocoa/70 md:text-base">
            <span aria-hidden className="title-sprig origin-right">
              <Sprig flip />
            </span>
            <span className="title-eyebrow">{eyebrow}</span>
            <span aria-hidden className="title-sprig origin-left">
              <Sprig />
            </span>
          </p>
        )}
        <h2 className={`font-display ${size} leading-[1.15] font-medium tracking-tight text-balance text-maroon`} aria-label={children}>
          {words.map((word, wi) => (
            <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, ci) => (
                <span key={ci} className="title-letter inline-block">
                  {ch}
                </span>
              ))}
              {wi < words.length - 1 && <span className="inline-block w-[0.26em]" />}
            </span>
          ))}
        </h2>
      </div>
    </div>
  );
}
