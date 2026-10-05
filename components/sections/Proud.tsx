"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { content } from "@/lib/content";
import { MOTION_OK_QUERY, burstPetals } from "@/lib/motion-utils";

const { proud, proudNote } = content.journey;
const words = proud.split(" ");

export default function Proud() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const q = gsap.utils.selector(sectionRef);
        let burst = false;
        gsap
          .timeline({
            scrollTrigger: {
              trigger: q(".proud-title")[0],
              start: "top 85%",
              end: "top 45%",
              scrub: 0.6,
              onLeave: () => {
                if (burst) return;
                burst = true;
                const r = q(".proud-title")[0].getBoundingClientRect();
                burstPetals({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 34, power: 6.5 });
              },
            },
          })
          .from(q(".proud-letter"), { yPercent: 120, scale: 0.4, rotate: "random(-30, 30)", opacity: 0, ease: "back.out(2)", stagger: 0.05, duration: 0.4 })
          .from(q(".proud-star"), { scale: 0, rotate: -120, opacity: 0, stagger: 0.08, duration: 0.25, ease: "back.out(3)" }, ">-0.15")
          .from(q(".proud-note"), { opacity: 0, y: 16, filter: "blur(5px)", duration: 0.3 }, "<");
        gsap.to(q(".proud-star"), { rotation: 90, duration: 2.6, repeat: -1, ease: "none", stagger: 0.5 });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-bg="#FDECEF" data-stem-leaf className="relative z-10 flex flex-col items-center px-6 pt-36 pb-28 text-center md:pt-44">
      <h2
        className="proud-title font-display relative text-[clamp(3rem,15vw,7rem)] leading-none font-bold tracking-tight text-maroon italic"
        aria-label={proud}
      >
        {words.map((w, wi) => (
          <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
            {Array.from(w).map((ch, i) => (
              <span key={i} className="proud-letter inline-block">
                {ch}
              </span>
            ))}
            {wi < words.length - 1 && <span className="inline-block w-[0.25em]" />}
          </span>
        ))}
        {["-top-6 -left-4", "-top-9 right-2", "-bottom-4 -right-6"].map((pos, i) => (
          <svg key={i} viewBox="0 0 20 20" className={`proud-star pointer-events-none absolute size-5 md:size-7 ${pos}`} aria-hidden>
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" fill="#F6C66B" />
          </svg>
        ))}
      </h2>
      <p className="proud-note mt-5 text-lg text-cocoa/80 md:text-xl">{proudNote}</p>
    </section>
  );
}
