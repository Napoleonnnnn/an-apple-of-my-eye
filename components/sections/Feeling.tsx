"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, whileVisible } from "@/lib/gsap";
import Lily from "@/components/lily/Lily";
import { content } from "@/lib/content";
import { MOTION_OK_QUERY } from "@/lib/motion-utils";
import FloatingDecor from "@/components/ui/FloatingDecor";

const text = content.messages.feeling;
const words = text.split(" ");
const SIZE = text.length > 14 ? "text-[clamp(1.6rem,7.5vw,2.8rem)]" : "text-[clamp(3rem,15vw,5.5rem)]";

type Ripple = { id: number; x: number; y: number };

function LilyPad({ className }: { className: string }) {
  return (
    <div className={`pad absolute ${className}`} aria-hidden>
      <svg viewBox="0 0 100 70" className="size-full overflow-visible">
        <ellipse cx="50" cy="40" rx="46" ry="26" fill="#8DB678" />
        <path d="M50 40 L96 34 L94 46Z" fill="#FFEFF3" />
        <g stroke="#A9CB94" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M50 40 L14 30 M50 40 L18 54 M50 40 L50 64 M50 40 L80 60 M50 40 L44 16" />
        </g>
      </svg>
      <Lily className="absolute -top-[38%] left-[22%] size-[56%] drop-shadow-[0_4px_6px_rgba(110,31,46,0.2)]" />
    </div>
  );
}

export default function Feeling() {
  const sectionRef = useRef<HTMLElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const q = gsap.utils.selector(sectionRef);

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: sectionRef.current, start: "top 85%", end: "center 70%", scrub: 0.7 },
          })
          .fromTo(q(".pond"), { scale: 0.45, rotate: -25, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1, ease: "power2.out" })
          .fromTo(q(".scroll-ring"), { scale: 0.05, opacity: 0.9 }, { scale: 1.5, opacity: 0, duration: 1, stagger: 0.25 }, 0)
          .from(
            q(".drop-letter"),
            { force3D: false, y: -220, opacity: 0, rotate: "random(-40, 40)", duration: 0.4, stagger: { amount: 0.5 }, ease: "bounce.out" },
            0.45,
          )
          .from(q(".pad"), { scale: 0, rotate: -90, duration: 0.4, stagger: 0.15, ease: "back.out(2)" }, 0.6);

        whileVisible(
          gsap.to(q(".float-letter"), {
            force3D: false,
            y: -10,
            rotate: 4,
            duration: 1.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: { each: 0.12, from: "start" },
          }),
          sectionRef.current,
        );
        whileVisible(gsap.to(q(".pad"), { y: -6, rotate: 6, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.8 }), sectionRef.current);
      });
    },
    { scope: sectionRef },
  );

  const onTap = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const ripple = { id: performance.now(), x: e.clientX - r.left, y: e.clientY - r.top };
    setRipples((rs) => [...rs.slice(-5), ripple]);
    window.setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== ripple.id)), 1700);
  };

  return (
    <section ref={sectionRef} data-bg="#FCEBF0" data-stem-leaf className="relative z-10 flex min-h-[115svh] items-center justify-center px-5 py-24">
      <FloatingDecor
        items={[
          { kind: "swatch", x: 86, y: 8, size: 40, depth: -0.6, rotate: 12 },
          { kind: "compact", x: 5, y: 86, size: 40, depth: 0.4, rotate: 12 },
        ]}
      />
      <div
        onPointerDown={onTap}
        className="pond relative aspect-square w-[min(90vw,460px)] cursor-pointer touch-manipulation overflow-hidden rounded-full shadow-[inset_0_-14px_40px_rgb(244_163_185/0.55),inset_0_10px_30px_rgb(255_255_255/0.9),0_30px_60px_-25px_rgb(110_31_46/0.35)]"
        style={{ background: "radial-gradient(circle at 45% 40%, #FFFFFF 0%, #FFEFF3 40%, #FBD3DE 78%, #F4B3C5 100%)" }}
      >
        {[0, 1, 2].map((i) => (
          <span key={`s${i}`} aria-hidden className="scroll-ring absolute inset-0 rounded-full border-2 border-white/80" />
        ))}

        {[0, 1, 2].map((i) => (
          <span
            key={`a${i}`}
            aria-hidden
            className="ripple-ring absolute top-1/2 left-1/2 size-[110%] rounded-full border border-white/70"
            style={{ animation: `ripple-out 5.4s ease-out ${i * 1.8}s infinite` }}
          />
        ))}

        {ripples.map((r) => (
          <span key={r.id} aria-hidden className="pointer-events-none absolute" style={{ left: r.x, top: r.y }}>
            {[0, 0.25].map((d) => (
              <span
                key={d}
                className="ripple-ring absolute top-0 left-0 size-56 rounded-full border-2 border-white"
                style={{ animation: `ripple-out 1.4s ease-out ${d}s both` }}
              />
            ))}
          </span>
        ))}

        <LilyPad className="top-[14%] left-[8%] h-[16%] w-[24%]" />
        <LilyPad className="right-[10%] bottom-[16%] h-[13%] w-[20%] -scale-x-100" />

        <div className="absolute inset-0 flex items-center justify-center px-[14%]">
          <h2 className={`font-display ${SIZE} text-center leading-[1.15] font-semibold tracking-tight text-balance text-maroon`} aria-label={text}>
            {words.map((w, wi) => (
              <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
                {Array.from(w).map((ch, i) => (
                  <span key={i} className="drop-letter inline-block">
                    <span className="float-letter inline-block">{ch}</span>
                  </span>
                ))}
                {wi < words.length - 1 && <span className="inline-block w-[0.25em]" />}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}
