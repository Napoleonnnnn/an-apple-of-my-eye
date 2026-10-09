"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Lily from "@/components/lily/Lily";
import LockedLink from "@/components/ui/LockedLink";
import Chase from "@/components/ui/Chase";
import FloatingDecor, { type DecorItem } from "@/components/ui/FloatingDecor";
import { content } from "@/lib/content";
import { LILY_BLOOM, LILY_CLOSE, MOTION_OK_QUERY, burstPetals } from "@/lib/motion-utils";

const { lines, button } = content.closing;

const DECOR: DecorItem[] = [
  { kind: "phone", x: 86, y: 30, size: 36, depth: 0.3, rotate: -10 },
  { kind: "sparkle", x: 8, y: 18, size: 16, depth: -0.7 },
  { kind: "sparkle", x: 90, y: 30, size: 12, depth: 0.8 },
  { kind: "petal", x: 6, y: 74, size: 20, depth: 0.6 },
  { kind: "petal", x: 90, y: 82, size: 22, depth: -0.8, rotate: 60 },
];

export default function Closing() {
  const sectionRef = useRef<HTMLElement>(null);
  const lilyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const q = gsap.utils.selector(sectionRef);
        const petals = q(".big-lily .lily-petal");
        const heart = q(".big-lily .lily-heart");
        const glow = q(".big-lily .lily-glow");
        const texts = q(".closing-reveal");

        gsap.set(lilyRef.current, { opacity: 0, scale: 0.35 });
        gsap.set(petals, { rotation: 180, scale: 0.28, transformOrigin: "50% 100%" });
        gsap.set(heart, { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(glow, { scale: 0.2, opacity: 0, transformOrigin: "50% 50%" });
        gsap.set(texts, { opacity: 0, y: 22 });

        const tl = gsap
          .timeline({ paused: true })
          .to(lilyRef.current, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" })
          .to(
            petals,
            {
              rotation: (_: number, el: Element) => Number((el as SVGGElement).dataset.angle),
              scale: 1,
              duration: 0.9,
              ease: "back.out(1.5)",
              stagger: 0.16,
            },
            0.25,
          )
          .to(heart, { scale: 1, duration: 0.6, ease: "back.out(3)" }, 1.1)
          .to(glow, { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }, 0.9)
          .add(() => {
            if (tl.reversed()) return;
            const r = lilyRef.current!.getBoundingClientRect();
            burstPetals({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 42, power: 7 });
          }, 1.25)
          .to(texts, { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: "power3.out" }, 1.35);

        const breathe = gsap.to(lilyRef.current, { rotate: 4, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true });

        const onBloom = () => {
          tl.timeScale(1).play();
          breathe.play();
        };
        const onClose = () => {
          tl.timeScale(2.5).reverse();
          breathe.pause();
        };
        window.addEventListener(LILY_BLOOM, onBloom);
        window.addEventListener(LILY_CLOSE, onClose);
        return () => {
          window.removeEventListener(LILY_BLOOM, onBloom);
          window.removeEventListener(LILY_CLOSE, onClose);
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section data-bg="#FFF8F2" ref={sectionRef} data-stem-leaf className="relative z-10 flex flex-col items-center px-6 pb-36 text-center lg:min-h-[100svh] lg:flex-row lg:items-center lg:justify-center lg:gap-14 lg:pt-6 lg:pb-36">
      <FloatingDecor items={DECOR} />
      <Chase />
      <div className="flex min-h-[100svh] w-full flex-col items-center justify-center py-[6svh] lg:min-h-0 lg:w-auto lg:max-w-xl lg:py-0">
        <div className="relative aspect-square w-[min(68vw,46svh,320px)] lg:w-[min(40svh,320px)]">
          <div ref={lilyRef} className="big-lily size-full">
            <Lily glow className="size-full overflow-visible drop-shadow-[0_14px_22px_rgba(110,31,46,0.16)]" />
          </div>

          <div data-stem-end aria-hidden className="absolute top-1/2 left-1/2 size-0" />
        </div>

        <div className="mt-4 flex flex-col items-center gap-3">
          <p className="closing-reveal font-display text-balance text-[clamp(1.9rem,8.5vw,3.25rem)] leading-tight font-medium text-maroon">{lines[0]}</p>
          <p className="closing-reveal max-w-[21rem] text-balance text-base leading-relaxed text-cocoa/85 md:max-w-none md:text-lg">{lines[1]}</p>
        </div>
      </div>

      <div className="closing-reveal lg:max-w-md">
        <LockedLink label={button.label} unlockAt={button.unlockAt} robots={content.closing.robots} />
      </div>
    </section>
  );
}
