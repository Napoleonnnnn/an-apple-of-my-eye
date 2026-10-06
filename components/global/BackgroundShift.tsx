"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export default function BackgroundShift() {
  useGSAP(() => {
    const root = document.documentElement;
    const sections = gsap.utils.toArray<HTMLElement>("[data-bg]");
    const triggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (!self.isActive) return;
          const color = section.dataset.bg!;
          root.style.setProperty("--page-bg", color);
          gsap.to([root, document.body], { backgroundColor: color, duration: 0.9, ease: "power2.out", overwrite: true });
        },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  });

  return null;
}
