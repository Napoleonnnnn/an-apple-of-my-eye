"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, whileVisible } from "@/lib/gsap";
import SectionTitle from "@/components/ui/SectionTitle";
import Lily from "@/components/lily/Lily";
import BudShape from "@/components/lily/BudShape";
import FloatingDecor, { type DecorItem } from "@/components/ui/FloatingDecor";
import { content } from "@/lib/content";
import { REDUCED_QUERY, burstPetals, stemState } from "@/lib/motion-utils";

const { title, steps } = content.journey;
const N = steps.length;

const DECOR: DecorItem[] = [
  { kind: "pineapple", x: 82, y: 4, size: 44, depth: -0.4, rotate: 12 },
  { kind: "sparkle", x: 8, y: 10, size: 14, depth: 0.7 },
  { kind: "leaf", x: 4, y: 48, size: 28, depth: 0.6, rotate: 20 },
  { kind: "dot", x: 18, y: 86, size: 10, depth: 0.9 },
];

const TOUCH = 30;

function Castle() {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full" aria-hidden>
      <path d="M0 90 C 20 70, 40 62, 62 60 C 90 58, 120 64, 160 78 L160 90Z" fill="currentColor" opacity="0.5" />
      <path
        d="M44 62 V40 h4 v-4 h4 v4 h4 v-4 h4 v4 h4 V28 h3 v-3 h3 v3 h3 v-3 h3 v3 h3 V46 h6 V34 l6 -8 l6 8 V46 h6 v-6 h4 v4 h4 v-4 h4 v4 h4 V62Z"
        fill="currentColor"
      />
      <path d="M84 26 V14 l4 -5 l4 5 V26" fill="currentColor" />
    </svg>
  );
}

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current!;
      const main = section.parentElement!;
      const reduce = window.matchMedia(REDUCED_QUERY).matches;
      const rows = gsap.utils.toArray<HTMLElement>(".j-row", section);
      const twigs = rows.map((r) => r.querySelector<HTMLElement>(".j-twig")!);

      const tls = rows.map((row, k) => {
        const q = gsap.utils.selector(row);
        const fromStemOnRight = row.dataset.side === "left";
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out", force3D: false } });
        tl.fromTo(q(".j-node"), { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(2.5)" });

        const petals = q(".j-node .lily-petal");
        if (petals.length)
          tl.fromTo(
            petals,
            { rotation: 180, scale: 0.3, transformOrigin: "50% 100%" },
            {
              rotation: (_: number, el: Element) => Number((el as SVGGElement).dataset.angle),
              scale: 1,
              transformOrigin: "50% 100%",
              duration: 0.45,
              stagger: 0.03,
              ease: "back.out(1.6)",
            },
            0.05,
          );
        tl.fromTo(q(".j-line"), { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "power2.inOut" }, 0.15)
          .fromTo(q(".j-card"), { opacity: 0.55, y: -10, rotate: 4 }, { opacity: 1, y: 0, rotate: 0, duration: 0.5, ease: "bounce.out" }, 0.3)
          .fromTo(
            q(".j-paper"),
            { clipPath: fromStemOnRight ? "inset(0 0 0 calc(100% - 1.6rem) round 12px)" : "inset(0 calc(100% - 1.6rem) 0 0 round 12px)" },
            { clipPath: "inset(0 0 0 0% round 12px)", duration: 0.55, ease: "power2.inOut" },
            0.6,
          )
          .fromTo(
            q(".j-roll"),
            { left: fromStemOnRight ? "100%" : "0%", opacity: 1 },
            { left: fromStemOnRight ? "0%" : "100%", duration: 0.55, ease: "power2.inOut" },
            0.6,
          )
          .fromTo(q(".j-paper p"), { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0.7)
          .to(q(".j-roll"), { opacity: 0, duration: 0.15 }, 1.12);
        const check = q(".j-check");
        if (check.length) tl.fromTo(check, { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.3, ease: "back.out(3)" }, 1.05);
        if (k === N - 1) {
          tl.fromTo(q(".castle"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.9).fromTo(
            q(".sparkle"),
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.35, stagger: 0.1, ease: "back.out(3)" },
            1,
          );
        }
        if (reduce) tl.progress(1);
        return tl;
      });
      const shown = rows.map(() => reduce);

      if (!reduce)
        whileVisible(gsap.to(gsap.utils.toArray(".sparkle", section), { rotation: 90, duration: 2.4, repeat: -1, ease: "none", stagger: 0.4 }), section);

      const rowY = rows.map(() => Infinity);
      let measuredFor: typeof stemState.xAt = null;
      let dirty = true;
      const measure = () => {
        const mr = main.getBoundingClientRect();
        rows.forEach((row, k) => {
          const r = row.getBoundingClientRect();
          rowY[k] = r.top + r.height / 2 - mr.top;
          if (!stemState.xAt) return;
          const stemX = stemState.xAt(rowY[k]);
          const gap = row.dataset.side === "left" ? stemX - (r.right - mr.left) : r.left - mr.left - stemX;
          twigs[k].style.width = `${Math.max(14, Math.round(gap))}px`;
        });
        measuredFor = stemState.xAt;
        dirty = false;
      };
      const markDirty = () => {
        dirty = true;
      };
      ScrollTrigger.addEventListener("refresh", markDirty);

      const tick = () => {
        if (dirty || measuredFor !== stemState.xAt) measure();
        if (reduce) return;
        rows.forEach((row, k) => {
          const touched = stemState.tipY + TOUCH >= rowY[k];
          if (touched === shown[k]) return;
          shown[k] = touched;
          if (touched) {
            tls[k].timeScale(1).play();
            const node = row.querySelector(".j-node")!.getBoundingClientRect();
            burstPetals({
              x: node.left + node.width / 2,
              y: node.top + node.height / 2,
              count: k === N - 1 ? 26 : 10,
              power: k === N - 1 ? 5 : 3.2,
            });
          } else {
            tls[k].timeScale(2.2).reverse();
          }
        });
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        ScrollTrigger.removeEventListener("refresh", markDirty);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section data-bg="#FDECEF" data-stem-x="0.5" ref={sectionRef} data-stem-leaf className="relative z-10 pt-24 pb-[22svh] md:pt-32">
      <FloatingDecor items={DECOR} />
      <div className="px-4">
        <SectionTitle eyebrow={title}>{content.messages.strong}</SectionTitle>
      </div>

      <ol className="relative mt-[7svh] [--g:22px] md:[--g:46px]">
        {steps.map(({ text, done }, k) => {
          const last = k === N - 1;
          const side = k % 2 === 0 ? "left" : "right";
          const left = side === "left";
          return (
            <li key={text} data-done={done} className="relative h-[11svh] min-h-[84px] md:h-[12svh]">
              <div
                data-side={side}
                className="j-row absolute top-1/2 flex -translate-y-1/2"
                style={{
                  ...(left ? { right: "calc(50% + var(--g))", justifyContent: "flex-end" } : { left: "calc(50% + var(--g))" }),
                  maxWidth: "min(19rem, calc(50% - var(--g) - 12px))",
                }}
              >
                <div className="j-card relative max-w-full">
                  {last && (
                    <div
                      className={`castle pointer-events-none absolute -top-14 h-14 w-24 text-maroon/15 md:-top-20 md:h-20 md:w-36 ${left ? "left-0" : "right-0"}`}
                      aria-hidden
                    >
                      <Castle />
                    </div>
                  )}
                  <div
                    className={`j-paper relative rounded-xl border px-3.5 py-2 md:px-4 md:py-2.5 ${
                      done
                        ? "border-blush bg-paper shadow-soft"
                        : last
                          ? "border-dashed border-[#E8C07A] bg-[#FFF8E6]/80"
                          : "border-dashed border-blush-deep/70 bg-white/55"
                    }`}
                  >
                    <p
                      className={`text-[0.95rem] leading-snug md:text-[1.05rem] ${left ? "text-right" : "text-left"} ${
                        done ? "text-cocoa" : last ? "font-semibold text-maroon/90 italic" : "text-cocoa/75 italic"
                      }`}
                    >
                      {text}
                    </p>
                  </div>
                  {done && (
                    <span
                      aria-hidden
                      className={`j-check absolute -top-2.5 flex size-6 items-center justify-center rounded-full bg-maroon shadow-soft ${left ? "-left-2.5" : "-right-2.5"}`}
                    >
                      <svg viewBox="0 0 16 16" className="size-3.5">
                        <path d="M3.5 8.5 L6.5 11.5 L12.5 4.5" fill="none" stroke="#FFD6E0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                  <span
                    aria-hidden
                    className="j-roll pointer-events-none absolute top-0 bottom-0 w-3 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#EAD9CC] via-white to-[#EAD9CC] opacity-0 shadow-sm"
                    style={{ left: left ? "100%" : "0%" }}
                  />
                  {last &&
                    ["-top-5 -left-3", "-top-7 right-6", "-bottom-5 left-10"].map((pos, i) => (
                      <svg key={i} viewBox="0 0 20 20" className={`sparkle pointer-events-none absolute size-4 ${pos}`} aria-hidden>
                        <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" fill="#F6C66B" />
                      </svg>
                    ))}

                  <span aria-hidden className={`j-twig absolute top-1/2 block h-0 ${left ? "left-full" : "right-full"}`} style={{ width: 22 }}>
                    <span
                      className={`j-line absolute top-[-1.5px] right-0 left-0 block h-[3px] rounded-full bg-leaf ${left ? "origin-right" : "origin-left"}`}
                    />
                    <span
                      className={`j-node absolute top-0 block size-7 -translate-y-1/2 md:size-9 ${left ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"}`}
                    >
                      {done ? (
                        <Lily className="size-full" />
                      ) : (
                        <svg viewBox="-16 -60 32 64" className="size-full overflow-visible">
                          <g transform="rotate(180)">
                            <BudShape gradientId={`j-bud-${k}`} />
                          </g>
                        </svg>
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
