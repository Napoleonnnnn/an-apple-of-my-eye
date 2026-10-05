"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Lily from "@/components/lily/Lily";
import { content } from "@/lib/content";
import { MOTION_OK_QUERY, burstPetals } from "@/lib/motion-utils";

const { line, flag } = content.alwaysThere;

const DROPS = Array.from({ length: 18 }, (_, i) => ({ x: 4 + ((i * 41) % 92), delay: (i * 0.13) % 1.1, dur: 0.75 + (i % 4) * 0.12 }));

function Words({ text, className }: { text: string; className: string }) {
  const words = text.split(" ");
  return (
    <span aria-hidden>
      {words.map((w, i) => (
        <span key={i} className={`${className} inline-block`}>
          {w}
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

export default function AlwaysThere() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const q = gsap.utils.selector(sectionRef);

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: q(".rain-scene")[0], start: "top 85%", end: "center 40%", scrub: 0.6 },
          })
          .from(q(".cloud"), { y: -60, opacity: 0, scale: 0.7, duration: 0.3, ease: "back.out(2)" })
          .from(q(".rain"), { opacity: 0, duration: 0.2 }, "<0.1")
          .from(q(".line-word"), { opacity: 0, y: 24, filter: "blur(6px)", stagger: 0.06, duration: 0.25 }, 0.2)

          .fromTo(q(".umbrella"), { y: -140, rotate: -40, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 0.35, ease: "power2.out" }, 0.55)
          .fromTo(q(".canopy"), { scaleX: 0.15 }, { scaleX: 1, duration: 0.25, ease: "back.out(2.5)" }, 0.85)
          .to(q(".little-lily"), { scale: 1.15, y: -4, duration: 0.15, yoyo: true, repeat: 1 }, 1.05);

        let burst = false;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: q(".flag-scene")[0],
              start: "top 85%",
              end: "center 40%",
              scrub: 0.6,
              onLeave: () => {
                if (burst) return;
                burst = true;
                const r = q(".flag-cloth")[0].getBoundingClientRect();
                burstPetals({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 22, power: 5 });
              },
            },
          })
          .from(q(".pole"), { scaleY: 0, duration: 0.25, ease: "power2.out" })
          .from(q(".flag-cloth"), { scaleX: 0, duration: 0.2, ease: "back.out(2)" })
          .from(q(".flag-word"), { opacity: 0, y: 24, stagger: 0.06, duration: 0.25 }, 0.25)

          .fromTo(q(".flag-fill"), { attr: { fill: "#D9473F", stroke: "#B5332C" } }, { attr: { fill: "#FFD6E0", stroke: "#F4A3B9" }, duration: 0.3 }, 0.7)
          .from(q(".flag-lily"), { scale: 0, rotate: -120, duration: 0.25, ease: "back.out(3)" }, 0.9);

        gsap.to(q(".flag-wave"), { skewY: 6, scaleX: 0.94, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "0% 50%" });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-bg="#F1F6EC" data-stem-leaf className="relative z-10 flex flex-col items-center gap-24 px-6 py-28 md:gap-32 md:py-36">
      <div className="rain-scene flex w-full max-w-md flex-col items-center gap-8">
        <div aria-hidden className="relative h-64 w-64">
          <div className="cloud absolute -top-9 left-1/2 h-16 w-44 -translate-x-1/2">
            <svg viewBox="0 0 160 60" className="size-full">
              <path
                d="M30 56 C 10 56, 6 34, 24 30 C 22 12, 48 6, 58 20 C 66 4, 96 4, 102 24 C 120 16, 142 26, 136 42 C 152 44, 152 56, 136 56Z"
                fill="#C9C3D6"
              />
              <path d="M40 46 C 60 50, 100 50, 126 46" stroke="#B3ACC4" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div className="rain absolute top-5 right-6 bottom-6 left-6 overflow-hidden">
            {DROPS.map((d, i) => (
              <span
                key={i}
                className="rain-drop absolute top-0 block h-3 w-[2px] rounded-full bg-[#9CC9E8]"
                style={{ left: `${d.x}%`, animation: `rain-fall ${d.dur}s linear ${d.delay}s infinite` }}
              />
            ))}
          </div>

          <div className="umbrella absolute top-[3.6rem] left-1/2 z-10 w-40 -translate-x-1/2">
            <svg viewBox="0 0 120 90" className="w-full overflow-visible">
              <g className="canopy" style={{ transformOrigin: "60px 36px" }}>
                <path
                  d="M4 36 C 8 10, 40 0, 60 0 C 80 0, 112 10, 116 36 C 108 30, 98 30, 92 36 C 86 30, 74 30, 68 36 C 64 31, 56 31, 52 36 C 46 30, 34 30, 28 36 C 22 30, 12 30, 4 36Z"
                  fill="#E07A98"
                />
                <path
                  d="M60 0 C 50 10, 46 24, 52 36 M60 0 C 70 10, 74 24, 68 36 M60 0 C 34 6, 22 20, 28 36 M60 0 C 86 6, 98 20, 92 36"
                  stroke="#C25A76"
                  strokeWidth="1.4"
                  fill="none"
                />
              </g>
              <path d="M60 0 V68 C 60 76, 50 76, 50 68" stroke="#5C3A2E" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          <div className="little-lily absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center">
            <Lily className="size-14" />
            <span className="-mt-3 block h-8 w-[3px] rounded-full bg-leaf" />
          </div>
          <div className="absolute right-0 bottom-0 left-0 h-[3px] rounded-full bg-leaf/40" />
        </div>
        <p className="font-display text-center text-[clamp(1.7rem,7.5vw,2.6rem)] leading-snug font-medium text-balance text-maroon" aria-label={line}>
          <Words text={line} className="line-word" />
        </p>
      </div>

      <div className="flag-scene flex w-full max-w-md flex-col items-center gap-8">
        <div aria-hidden className="relative h-48 w-40">
          <div className="pole absolute bottom-0 left-6 h-full w-[5px] origin-bottom rounded-full bg-cocoa" />
          <span className="absolute -top-2 left-[1.15rem] block size-4 rounded-full bg-[#E8A93A]" />
          <div className="flag-cloth absolute top-2 left-[1.75rem] h-24 w-32 origin-left">
            <svg viewBox="0 0 120 80" className="flag-wave size-full overflow-visible">
              <path className="flag-fill" d="M0 4 C 30 -6, 60 14, 120 4 L120 70 C 60 80, 30 60, 0 70Z" fill="#FFD6E0" stroke="#F4A3B9" strokeWidth="2" />
            </svg>
            <div className="flag-lily absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2">
              <Lily className="size-full" />
            </div>
          </div>
        </div>
        <p className="font-display text-center text-[clamp(1.7rem,7.5vw,2.6rem)] leading-snug font-medium text-balance text-maroon italic" aria-label={flag}>
          <Words text={flag} className="flag-word" />
        </p>
      </div>
    </section>
  );
}
