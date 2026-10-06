"use client";

import { useRef } from "react";
import { gsap, useGSAP, whileVisible } from "@/lib/gsap";
import Image from "next/image";
import { content } from "@/lib/content";
import { MOTION_OK_QUERY, burstPetals, blurFrom } from "@/lib/motion-utils";
import FloatingDecor from "@/components/ui/FloatingDecor";

const { proud, proudNote } = content.journey;
const words = proud.split(" ");

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
          .from(q(".proud-letter"), {
            force3D: false,
            yPercent: 120,
            scale: 0.4,
            rotate: "random(-30, 30)",
            opacity: 0,
            ease: "back.out(2)",
            stagger: 0.05,
            duration: 0.4,
          })
          .from(q(".proud-star"), { scale: 0, rotate: -120, opacity: 0, stagger: 0.08, duration: 0.25, ease: "back.out(3)" }, ">-0.15")
          .from(q(".proud-mascot"), { yPercent: 70, opacity: 0, rotate: -12, duration: 0.35, ease: "back.out(1.8)" }, ">-0.1")
          .from(q(".proud-note"), { opacity: 0, y: 16, ...blurFrom(5), duration: 0.3 }, "<");
        whileVisible(
          gsap.to(q(".proud-mascot img"), { rotate: 5, y: -4, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1 }),
          sectionRef.current,
        );
        whileVisible(gsap.to(q(".proud-star"), { rotation: 90, duration: 2.6, repeat: -1, ease: "none", stagger: 0.5 }), sectionRef.current);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-bg="#FDECEF" data-stem-leaf className="relative z-10 flex flex-col items-center px-6 pt-36 pb-28 text-center md:pt-44">
      <FloatingDecor
        items={[
          { kind: "cake", x: 84, y: 12, size: 44, depth: -0.5, rotate: 10 },
          { kind: "swatch", x: 5, y: 86, size: 38, depth: 0.6, rotate: -14 },
        ]}
      />
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
      <div aria-hidden className="relative mt-6 h-28 w-28 overflow-hidden md:h-36 md:w-36">
        <div
          className="proud-mascot size-full"
          style={{ maskImage: "linear-gradient(to bottom, black 75%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent)" }}
        >
          <Image src={`${BASE_PATH}/images/enfp-cut.webp`} alt="" width={240} height={240} className="size-full object-contain" />
        </div>
      </div>
      <p className="proud-note mt-5 text-lg text-cocoa/80 md:text-xl">{proudNote}</p>
    </section>
  );
}
