"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { content } from "@/lib/content";
import { MOTION_OK_QUERY } from "@/lib/motion-utils";

const { title, subtitle, hint } = content.hero;
const LETTER_DELAY = 0.055;
const START = 0.45;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const words = title.split(" ");
  const lettersTotal = title.replace(/ /g, "").length;
  const underlineDelay = START + lettersTotal * LETTER_DELAY + 0.35;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const scroll = (end: string) => ({ trigger: sectionRef.current, start: "top top", end, scrub: 0.6 });

        gsap.to(".hero-letter", {
          x: "random(-150, 150)",
          y: "random(-280, -90)",
          rotation: "random(-80, 80)",
          scale: "random(0.5, 1.4)",
          opacity: 0,
          ease: "power1.in",
          stagger: { each: 0.05, from: "center" },
          scrollTrigger: scroll("70% top"),
        });
        gsap.to(".hero-underline", { opacity: 0, scaleX: 0.3, ease: "power1.in", scrollTrigger: scroll("35% top") });
        gsap.to(".hero-sub", { opacity: 0, y: -40, filter: "blur(8px)", ease: "none", scrollTrigger: scroll("45% top") });
        gsap.to(bodyRef.current, { yPercent: -18, ease: "none", scrollTrigger: scroll("bottom top") });
        gsap.to(".hero-blob", { yPercent: (i) => (i ? -60 : 50), scale: 1.4, ease: "none", scrollTrigger: scroll("bottom top") });
        gsap.to(hintRef.current, {
          opacity: 0,
          y: 20,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "18% top", scrub: true },
        });
      });
    },
    { scope: sectionRef },
  );

  let letterIndex = 0;

  return (
    <section data-bg="#FFF8F2" ref={sectionRef} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="hero-blob absolute top-[12%] -left-24 size-72">
          <div className="float-blob size-full rounded-full bg-blush/70 blur-3xl" style={{ animation: "float-blob 9s ease-in-out infinite" }} />
        </div>
        <div className="hero-blob absolute -right-28 bottom-[14%] size-80">
          <div className="float-blob size-full rounded-full bg-blush-soft blur-3xl" style={{ animation: "float-blob 11s ease-in-out -3s infinite" }} />
        </div>
      </div>

      <div data-stem-start aria-hidden className="absolute top-[13svh] left-1/2 size-0" />

      <div ref={bodyRef} className="relative mt-[10svh] will-change-transform">
        <h1 className="font-display text-[clamp(3.1rem,14.5vw,7.5rem)] leading-[1.02] font-semibold tracking-tight text-balance text-maroon" aria-label={title}>
          {words.map((word, wi) => (
            <span key={wi} aria-hidden className="relative inline-block whitespace-nowrap">
              {Array.from(word).map((ch) => {
                const i = letterIndex++;
                return (
                  <span key={i} className="hero-letter inline-block">
                    <motion.span
                      className="inline-block origin-bottom"
                      initial={{ y: "-0.9em", opacity: 0, rotate: i % 2 ? 10 : -10, scaleY: 1.15 }}
                      animate={{ y: 0, opacity: 1, rotate: 0, scaleY: 1 }}
                      transition={{
                        y: { type: "spring", stiffness: 520, damping: 13, delay: START + i * LETTER_DELAY },
                        rotate: { type: "spring", stiffness: 300, damping: 10, delay: START + i * LETTER_DELAY },
                        scaleY: { type: "spring", stiffness: 600, damping: 9, delay: START + i * LETTER_DELAY + 0.12 },
                        opacity: { duration: 0.15, delay: START + i * LETTER_DELAY },
                      }}
                    >
                      {ch}
                    </motion.span>
                  </span>
                );
              })}
              {wi === words.length - 1 && <Underline delay={underlineDelay} />}
              {wi < words.length - 1 && <span className="inline-block w-[0.28em]" />}
            </span>
          ))}
        </h1>

        <div className="hero-sub">
          <motion.p
            className="mx-auto mt-7 max-w-[20rem] text-lg leading-relaxed text-balance text-cocoa md:max-w-md md:text-xl"
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: underlineDelay + 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {subtitle}
          </motion.p>
        </div>
      </div>

      <motion.div
        ref={hintRef}
        className="absolute bottom-[6svh] flex flex-col items-center gap-2 text-sm text-cocoa/75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: underlineDelay + 1.1 }}
      >
        <span>{hint}</span>
        <motion.svg
          viewBox="0 0 24 24"
          className="size-5 text-maroon/70"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <path d="M12 4v15M6 13l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </section>
  );
}

function Underline({ delay }: { delay: number }) {
  return (
    <svg
      viewBox="0 0 220 34"
      className="hero-underline pointer-events-none absolute -bottom-[0.2em] left-[-4%] h-[0.3em] w-[108%] overflow-visible"
      aria-hidden
    >
      <motion.path
        d="M4 20 C 30 10, 52 28, 80 18 S 128 8, 150 19 S 186 26, 196 16"
        fill="none"
        stroke="#F4A3B9"
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ pathLength: { duration: 0.9, delay, ease: "easeInOut" }, opacity: { duration: 0.01, delay } }}
      />
      <motion.path
        d="M208 2 L211 12 L221 15 L211 18 L208 28 L205 18 L195 15 L205 12Z"
        fill="#F6C66B"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: [0, 1.4, 1], rotate: 0 }}
        style={{ originX: 0.5, originY: 0.5 }}
        transition={{ duration: 0.6, delay: delay + 0.85, ease: "easeOut" }}
      />
    </svg>
  );
}
