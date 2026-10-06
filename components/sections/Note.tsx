"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Lily from "@/components/lily/Lily";
import FloatingDecor, { type DecorItem } from "@/components/ui/FloatingDecor";
import { content } from "@/lib/content";
import { MOTION_OK_QUERY, blurFrom } from "@/lib/motion-utils";

const { lines } = content.note;

const DECOR: DecorItem[] = [
  { kind: "petal", x: 6, y: 18, size: 20, depth: 0.8 },
  { kind: "sparkle", x: 90, y: 10, size: 14, depth: -0.7 },
  { kind: "lily", x: 3, y: 68, size: 34, depth: -0.6, rotate: 20 },
  { kind: "leaf", x: 90, y: 58, size: 30, depth: 0.7, rotate: 160 },
  { kind: "petal", x: 86, y: 92, size: 18, depth: -0.9 },
];

export default function Note() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const q = gsap.utils.selector(sectionRef);
        const env = q(".env")[0];

        gsap.from(env, {
          opacity: 0,
          y: 80,
          rotate: -8,
          scale: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 90%", end: "top 15%", scrub: true },
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: stageRef.current,
              pin: true,
              start: "top top",
              end: () => `+=${window.innerHeight * 1.1}`,
              scrub: 0.6,
              anticipatePin: 1,
            },
          })
          .to(q(".env-seal"), { scale: 1.3, duration: 0.08, ease: "power1.out" })
          .to(q(".env-seal"), { scale: 0, opacity: 0, rotate: 40, duration: 0.12, ease: "power2.in" })
          .to(q(".env-flap"), { rotateX: 180, duration: 0.35, ease: "power2.inOut" }, 0.12)
          .set(q(".env-flap"), { zIndex: 0 }, 0.3)
          .to(q(".env-sheet"), { yPercent: -58, duration: 0.35, ease: "power2.out" }, 0.45)
          .to(q(".env-sheet"), { scale: 1.06, rotate: -2, duration: 0.2 }, 0.8)
          .to(env, { y: 24, duration: 0.2 }, 0.8);

        gsap.from(paperRef.current, {
          opacity: 0,
          y: 70,
          rotate: 3,
          ease: "power2.out",
          scrollTrigger: { trigger: paperRef.current, start: "top 95%", end: "top 55%", scrub: true },
        });
        q(".note-line").forEach((line) => {
          gsap.from(line, {
            opacity: 0,
            y: 16,
            ...blurFrom(5),
            ease: "power1.out",
            scrollTrigger: { trigger: line, start: "top 88%", end: "top 62%", scrub: true },
          });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section data-bg="#FFF4EF" ref={sectionRef} data-stem-leaf className="relative z-10">
      <FloatingDecor items={DECOR} />
      <div ref={stageRef} className="flex h-[100svh] items-center justify-center px-6">
        <div className="env relative aspect-[1.5] w-[min(82vw,360px)] [perspective:1100px]" aria-hidden>
          <div className="absolute inset-0 rounded-2xl bg-[#F6BFCD] shadow-lift" />
          <div className="env-sheet absolute inset-x-[7%] top-[7%] bottom-[8%] z-[1] rounded-lg bg-paper p-[8%] shadow-soft">
            <div className="space-y-[9%]">
              <div className="h-1.5 w-1/2 rounded-full bg-blush-deep/60" />
              <div className="h-1.5 w-[85%] rounded-full bg-blush/90" />
              <div className="h-1.5 w-[70%] rounded-full bg-blush/90" />
              <div className="h-1.5 w-[78%] rounded-full bg-blush/90" />
            </div>
          </div>
          <div
            className="absolute inset-0 z-[2] rounded-2xl bg-gradient-to-t from-[#FFC9D6] to-blush"
            style={{ clipPath: "polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)" }}
          />
          <div
            className="env-flap absolute inset-x-0 top-0 z-[3] h-[62%] origin-top rounded-t-2xl bg-gradient-to-b from-[#F7B7C7] to-[#F3A6BA]"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", backfaceVisibility: "visible" }}
          />
          <div className="env-seal absolute top-[50%] left-1/2 z-[4] flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-maroon shadow-soft">
            <svg viewBox="0 0 24 24" className="size-6">
              <g fill="#FFD6E0">
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <ellipse key={a} cx="12" cy="6.5" rx="2.6" ry="4.6" transform={`rotate(${a} 12 12)`} />
                ))}
              </g>
              <circle cx="12" cy="12" r="2.4" fill="#F6C66B" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative -mt-[14svh] px-5 pb-24 md:pb-36">
        <div
          ref={paperRef}
          className="ruled-paper relative mx-auto max-w-md -rotate-1 rounded-[1.4rem] px-7 pt-[1.6rem] pb-14 shadow-lift md:max-w-lg md:px-10"
        >
          <span aria-hidden className="absolute -top-3 left-6 h-6 w-20 -rotate-6 rounded-sm bg-blush/85 shadow-sm" />
          <span aria-hidden className="absolute -top-3 right-6 h-6 w-16 rotate-[8deg] rounded-sm bg-[#E3EDD5]/90 shadow-sm" />
          <div className="font-display pt-8 text-[1.2rem] leading-8 text-maroon md:text-[1.3rem]">
            {lines.map((line, i) => (
              <p key={i} className="note-line mb-8 last:mb-0 whitespace-pre-line">
                {line}
              </p>
            ))}
          </div>
          <Lily aria-hidden className="absolute right-5 bottom-4 size-10 rotate-12 opacity-90" />
        </div>
      </div>
    </section>
  );
}
