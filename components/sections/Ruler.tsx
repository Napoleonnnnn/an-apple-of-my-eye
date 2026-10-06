"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, whileVisible } from "@/lib/gsap";
import { content } from "@/lib/content";
import { MOTION_OK_QUERY } from "@/lib/motion-utils";
import FloatingDecor from "@/components/ui/FloatingDecor";

const text = content.ruler;
const words = text.split(" ");

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function Photo() {
  return (
    <span className="block size-full overflow-hidden rounded-[42%] border-[3px] border-white bg-blush shadow-soft">
      <Image src={`${BASE_PATH}/images/kitty.webp`} alt="" width={160} height={160} className="size-full object-cover object-[50%_45%]" />
    </span>
  );
}

function Pillar() {
  return (
    <svg viewBox="0 0 30 46" className="size-full overflow-visible" aria-hidden>
      <path className="flame origin-bottom" d="M15 2 C 20 9, 21 14, 15 18 C 9 14, 10 9, 15 2Z" fill="#F6C66B" />
      <path d="M15 8 C 17 11, 17 14, 15 16 C 13 14, 13 11, 15 8Z" fill="#FFF3D6" />
      <path d="M15 18 V22" stroke="#5C3A2E" strokeWidth="1.4" />
      <rect x="9" y="22" width="12" height="24" rx="2" fill="#FFFFFF" stroke="#F4A3B9" strokeWidth="1" />
      <path d="M9 28 L21 24 M9 35 L21 31 M9 42 L21 38" stroke="#F4A3B9" strokeWidth="2" />
    </svg>
  );
}

export default function Ruler() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const q = gsap.utils.selector(sectionRef);
        whileVisible(
          gsap.to(q(".flame"), { scaleY: 1.25, scaleX: 0.85, duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 100%" }),
          sectionRef.current,
        );

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stageRef.current,
              pin: true,
              start: "top top",
              end: () => `+=${window.innerHeight * 1.4}`,
              scrub: 0.6,
              anticipatePin: 1,
            },
          })
          .from(q(".ruler-word"), { force3D: false, opacity: 0, y: 30, rotate: "random(-12, 12)", stagger: 0.08, duration: 0.3, ease: "back.out(2)" })
          .from(q(".wall"), { opacity: 0, y: 60, duration: 0.3 }, 0)

          .fromTo(q(".grow-bar"), { height: "10%" }, { height: "86%", duration: 1.2, ease: "power1.in" }, 0.3)

          .to(q(".person"), { y: -16, scaleY: 1.08, duration: 0.15, ease: "power2.out" }, 0.55)
          .to(q(".person"), { y: 0, scaleY: 1, duration: 0.15, ease: "bounce.out" }, 0.7)
          .to(q(".person"), { y: -10, scaleY: 1.05, duration: 0.12, ease: "power2.out" }, 0.95)
          .to(q(".person"), { y: 0, scaleY: 1, duration: 0.15, ease: "bounce.out" }, 1.07)
          .fromTo(q(".height-mark"), { y: 0 }, { y: -6, duration: 0.3, yoyo: true, repeat: 1 }, 0.6)
          .from(q(".sweat"), { opacity: 0, y: -8, scale: 0, duration: 0.15, ease: "back.out(3)" }, 1.15)
          .to({}, { duration: 0.25 });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-bg="#F6F1FA" data-stem-leaf className="relative z-10">
      <FloatingDecor
        items={[
          { kind: "phone", x: 86, y: 72, size: 40, depth: 0.5, rotate: 14 },
          { kind: "mirror", x: 4, y: 4, size: 40, depth: -0.4, rotate: -10 },
        ]}
      />
      <div ref={stageRef} className="flex h-[100svh] flex-col items-center justify-center gap-8 px-6 pt-10">
        <h2
          className="font-display max-w-md text-center text-[clamp(1.9rem,8.5vw,3.2rem)] leading-tight font-medium text-balance text-maroon"
          aria-label={text}
        >
          {words.map((w, i) => (
            <span key={i} aria-hidden className="ruler-word inline-block">
              {w}
              {i < words.length - 1 && " "}
            </span>
          ))}
        </h2>

        <div
          aria-hidden
          className="wall relative flex h-[46svh] w-full max-w-xs items-end justify-center gap-14 rounded-[1.6rem] bg-white/70 px-8 pb-4 shadow-soft"
        >
          <div
            className="absolute top-4 bottom-4 left-1/2 w-5 -translate-x-1/2 rounded-sm bg-[#FFF6D9]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to top, #C9A56B 0 1.5px, transparent 1.5px 10px), repeating-linear-gradient(to top, #C9A56B 0 2px, transparent 2px 50px)",
              backgroundSize: "40% 100%, 100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          />

          <div className="relative flex h-full w-12 flex-col justify-end">
            <div className="grow-bar relative h-[86%] rounded-t-xl bg-gradient-to-t from-blush-deep to-blush">
              <div className="absolute -top-11 left-1/2 h-12 w-8 -translate-x-1/2">
                <Pillar />
              </div>
            </div>
          </div>

          <div className="relative flex h-full w-20 flex-col justify-end">
            <div className="height-mark absolute bottom-[calc(5rem+6px)] -left-2 h-[3px] w-24 rounded-full bg-maroon/60" />
            <div className="person relative size-20 origin-bottom">
              <Photo />
              <svg viewBox="0 0 10 14" className="sweat absolute top-0 -right-2 h-4 w-3" aria-hidden>
                <path d="M5 0 C 8 5, 10 8, 5 14 C 0 8, 2 5, 5 0Z" fill="#9CC9E8" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
