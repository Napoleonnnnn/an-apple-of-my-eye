"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { content } from "@/lib/content";
import { MOTION_OK_QUERY } from "@/lib/motion-utils";

const text = content.messages.smart;
const words = text.split(" ");

const CIRCLE = words.length >= 4 ? [1, 2] : words.length === 3 ? [1] : [];
const SIZE =
  text.length > 60 ? "text-[clamp(1.55rem,6.8vw,2.4rem)]" : text.length > 32 ? "text-[clamp(1.9rem,8.5vw,3rem)]" : "text-[clamp(2.4rem,11vw,3.6rem)]";

function Doodles() {
  const stroke = { fill: "none", stroke: "#6E1F2E", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <>
      <svg viewBox="0 0 40 40" className="doodle absolute -top-6 right-2 size-11 md:right-6" aria-hidden>
        <path className="draw" d="M20 4 L24 16 L37 16 L27 24 L31 37 L20 29 L9 37 L13 24 L3 16 L16 16Z" {...stroke} stroke="#E8A93A" />
      </svg>

      <svg viewBox="0 0 40 50" className="doodle absolute bottom-7 left-5 h-14 w-11 md:left-10" aria-hidden>
        <path className="draw" d="M20 6 C 10 6, 5 14, 7 22 C 8 27, 13 30, 14 36 L26 36 C 27 30, 32 27, 33 22 C 35 14, 30 6, 20 6Z" {...stroke} />
        <path className="draw" d="M15 41 H25 M16 45 H24" {...stroke} />
        <path className="draw" d="M20 0 V2 M4 6 L6 8 M36 6 L34 8" {...stroke} stroke="#E8A93A" />
      </svg>

      <svg viewBox="0 0 60 24" className="doodle absolute right-4 bottom-9 h-7 w-[4.5rem] -rotate-12 md:right-10" aria-hidden>
        <path className="draw" d="M10 7 C 4 1, -2 9, 5 12 C -2 15, 4 23, 10 17 L50 17 C 56 23, 62 15, 55 12 C 62 9, 56 1, 50 7Z" {...stroke} stroke="#5C3A2E" />
      </svg>

      <svg viewBox="0 0 60 40" className="doodle absolute top-[38%] -left-1 h-9 w-14 md:left-2" aria-hidden>
        <path className="draw" d="M4 32 C 16 30, 34 26, 50 12" {...stroke} />
        <path className="draw" d="M40 10 L51 11 L48 22" {...stroke} />
      </svg>
    </>
  );
}

export default function Smart() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const q = gsap.utils.selector(sectionRef);
        const draws = sectionRef.current!.querySelectorAll<SVGPathElement>(".draw");
        draws.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });

        gsap.from(q(".notebook"), {
          x: 120,
          rotate: 14,
          opacity: 0,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "top top", scrub: 0.6 },
        });

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: stageRef.current,
              pin: true,
              start: "top top",
              end: () => `+=${window.innerHeight * 1.3}`,
              scrub: 0.6,
              anticipatePin: 1,
            },
          })
          .from(q(".ink-word"), { opacity: 0, y: 12, filter: "blur(4px)", stagger: 0.12, duration: 0.3 })
          .from(q(".highlight"), { scaleX: 0, duration: 0.35, ease: "power1.inOut" })
          .to(q(".circle-path"), { strokeDashoffset: 0, duration: 0.45, ease: "power1.inOut" })
          .to(q(".underline-path"), { strokeDashoffset: 0, duration: 0.3 })
          .to(q(".doodle .draw"), { strokeDashoffset: 0, duration: 0.35, stagger: 0.08 })
          .from(q(".doodle"), { scale: 0.6, rotate: -20, duration: 0.3, stagger: 0.1, ease: "back.out(2)" }, "<")
          .to({}, { duration: 0.25 });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-bg="#FBF3E8" data-stem-leaf className="relative z-10">
      <div ref={stageRef} className="flex h-[100svh] items-center justify-center px-5">
        <div className="notebook relative w-full max-w-md -rotate-2 md:max-w-lg">
          <div aria-hidden className="absolute top-6 bottom-6 -left-3 z-10 flex flex-col justify-between">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="block h-3 w-7 rounded-full border-[2.5px] border-[#B9A99E] bg-transparent" />
            ))}
          </div>

          <div
            className="relative overflow-visible rounded-[1.25rem] px-9 pt-16 pb-20 shadow-lift md:px-14"
            style={{
              backgroundColor: "#FFFDF8",
              backgroundImage:
                "linear-gradient(to right, transparent 2.4rem, rgb(244 163 185 / 0.55) 2.4rem, rgb(244 163 185 / 0.55) calc(2.4rem + 1.5px), transparent calc(2.4rem + 1.5px)), linear-gradient(rgb(186 170 160 / 0.18) 1px, transparent 1px), linear-gradient(90deg, rgb(186 170 160 / 0.18) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 22px 22px, 22px 22px",
            }}
          >
            <Doodles />
            <p className={`font-display relative ${SIZE} leading-[1.35] font-medium text-cocoa`} aria-label={text}>
              {words.map((w, i) => {
                const circled = CIRCLE.includes(i);
                const startCircle = i === CIRCLE[0];
                const endCircle = i === CIRCLE[CIRCLE.length - 1];
                const last = i === words.length - 1 && words.length > 1;
                return (
                  <span key={i} aria-hidden>
                    {startCircle && <span className="relative inline-block">{renderCircled(words, CIRCLE)}</span>}
                    {!circled && (
                      <span className="ink-word relative isolate inline-block">
                        {i === 0 && (
                          <span className="highlight absolute inset-x-[-0.12em] top-[0.42em] bottom-[0.08em] -z-10 origin-left -rotate-1 rounded-sm bg-blush" />
                        )}
                        {w}
                        {last && (
                          <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="absolute -bottom-[0.08em] left-0 h-[0.3em] w-full overflow-visible">
                            <path
                              className="underline-path draw"
                              d="M2 7 C 20 2, 35 11, 52 6 S 85 3, 98 7"
                              fill="none"
                              stroke="#E8A93A"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                    {!circled && i < words.length - 1 && " "}
                    {endCircle && i < words.length - 1 && " "}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderCircled(words: string[], idx: number[]) {
  return (
    <>
      {idx.map((j, k) => (
        <span key={j} className="ink-word inline-block">
          {words[j]}
          {k < idx.length - 1 && " "}
        </span>
      ))}
      <svg
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -inset-x-[0.3em] -inset-y-[0.12em] h-[calc(100%+0.24em)] w-[calc(100%+0.6em)] overflow-visible"
        aria-hidden
      >
        <path
          className="circle-path draw"
          d="M108 6 C 60 2, 8 12, 6 40 C 4 68, 70 78, 120 74 C 170 70, 198 56, 194 34 C 190 12, 140 2, 92 8"
          fill="none"
          stroke="#6E1F2E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}
