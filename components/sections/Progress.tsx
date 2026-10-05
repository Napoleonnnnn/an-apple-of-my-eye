"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionTitle from "@/components/ui/SectionTitle";
import Lily from "@/components/lily/Lily";
import { content } from "@/lib/content";
import { MOTION_OK_QUERY, burstPetals } from "@/lib/motion-utils";

export default function Progress() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const q = gsap.utils.selector(sectionRef);
        let burst = false;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: q(".bar")[0],
              start: "top 85%",
              end: "top 40%",
              scrub: 0.6,
              onLeave: () => {
                if (burst) return;
                burst = true;
                const r = q(".bar-end")[0].getBoundingClientRect();
                burstPetals({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 28, power: 6 });
              },
            },
          })
          .fromTo(q(".bar-fill"), { scaleX: 0.04 }, { scaleX: 1, duration: 1 })
          .fromTo(q(".bar-rider"), { left: "4%" }, { left: "100%", duration: 1 }, 0)
          .fromTo(q(".bar-tick"), { backgroundColor: "#F1D9DF" }, { backgroundColor: "#FFFFFF", stagger: 0.24, duration: 0.05 }, 0.2)
          .fromTo(q(".bar-end"), { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.2, ease: "back.out(2.5)" }, 0.95);

        gsap.to(q(".bar-rider-inner"), { y: -6, rotate: 12, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-bg="#FFF6EA" data-stem-leaf className="relative z-10 flex min-h-[90svh] flex-col items-center justify-center px-6 py-24">
      <SectionTitle>{content.messages.random}</SectionTitle>

      <div aria-hidden className="bar relative mx-auto mt-14 w-full max-w-md">
        <div className="relative h-5 overflow-hidden rounded-full border border-blush bg-white shadow-soft">
          <div className="bar-fill absolute inset-0 origin-left rounded-full bg-gradient-to-r from-blush via-[#F4A3B9] to-[#E07A98]" />

          <div className="absolute inset-0 flex items-center justify-evenly">
            {[0, 1, 2].map((i) => (
              <span key={i} className="bar-tick block size-1.5 rounded-full bg-white" />
            ))}
          </div>
        </div>
        <div className="bar-rider absolute -top-9 -translate-x-1/2" style={{ left: "100%" }}>
          <div className="bar-rider-inner size-8">
            <Lily className="size-full drop-shadow-[0_4px_6px_rgba(110,31,46,0.2)]" />
          </div>
        </div>

        <div className="bar-end absolute top-1/2 -right-3 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-maroon shadow-lift">
          <svg viewBox="0 0 32 32" className="size-7">
            <path d="M16 7 L30 13 L16 19 L2 13Z" fill="#FFD6E0" />
            <path d="M8 16 V21 C 8 24, 24 24, 24 21 V16 L16 19Z" fill="#FFFFFF" />
            <path d="M28 14 V21" stroke="#F6C66B" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="28" cy="22" r="1.6" fill="#F6C66B" />
          </svg>
        </div>
      </div>
    </section>
  );
}
