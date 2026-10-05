"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { content } from "@/lib/content";
import { MOTION_OK_QUERY } from "@/lib/motion-utils";

const text = content.messages.kind;
const words = text.split(" ");
const SIZE = text.length > 24 ? "text-[clamp(2.3rem,10vw,4.5rem)]" : "text-[clamp(3.2rem,15vw,7rem)]";

const MOTES = Array.from({ length: 14 }, (_, i) => ({
  left: 8 + ((i * 37) % 84),
  delay: (i * 0.7) % 6,
  dur: 7 + (i % 5),
  size: 4 + (i % 3) * 2,
}));

export default function Kind() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const q = gsap.utils.selector(sectionRef);
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "bottom bottom", scrub: 0.8 },
          })
          .fromTo(q(".glow"), { scale: 0.3, opacity: 0, yPercent: 40 }, { scale: 1.15, opacity: 1, yPercent: 0, duration: 1 })
          .fromTo(q(".rays"), { rotate: -30, opacity: 0 }, { rotate: 20, opacity: 1, duration: 1.4 }, 0)
          .fromTo(
            q(".kind-letter"),
            { opacity: 0.08, filter: "blur(10px)", y: 18 },
            { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.25, stagger: { amount: 0.9 } },
            0.25,
          )
          .fromTo(q(".kind-line"), { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, ">-0.1");
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-bg="#FFF1E4" data-stem-leaf className="relative z-10 h-[200svh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-6">
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <svg viewBox="-100 -100 200 200" className="rays absolute size-[150vmin] opacity-60">
            {Array.from({ length: 16 }, (_, i) => (
              <path key={i} d="M-3 -30 L0 -98 L3 -30Z" fill="#FFD9A8" opacity="0.35" transform={`rotate(${i * 22.5})`} />
            ))}
          </svg>
          <div className="glow size-[85vmin] rounded-full bg-[radial-gradient(circle,#FFE3B8_0%,#FFD6E0_45%,transparent_70%)] blur-xl" />
          {MOTES.map((m, i) => (
            <span
              key={i}
              className="mote absolute bottom-0 rounded-full bg-[#FFE6BF]"
              style={{ left: `${m.left}%`, width: m.size, height: m.size, animation: `mote-rise ${m.dur}s linear ${m.delay}s infinite` }}
            />
          ))}
        </div>

        <div className="relative flex flex-col items-center gap-6 text-center">
          <h2 className={`font-display ${SIZE} max-w-3xl leading-[1.1] font-light tracking-tight text-balance text-maroon italic`} aria-label={text}>
            {words.map((w, wi) => (
              <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
                {Array.from(w).map((ch, i) => (
                  <span key={i} className="kind-letter inline-block">
                    {ch}
                  </span>
                ))}
                {wi < words.length - 1 && <span className="inline-block w-[0.25em]" />}
              </span>
            ))}
          </h2>
          <span
            aria-hidden
            className="kind-line block h-[2px] w-40 origin-center rounded-full bg-gradient-to-r from-transparent via-[#E8A93A] to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
