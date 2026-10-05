"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const setBar = gsap.quickSetter(barRef.current, "scaleX");
    const setDot = gsap.quickSetter(dotRef.current, "left", "%");
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setBar(self.progress);
        setDot(self.progress * 100);
      },
    });
    setBar(st.progress);
    setDot(st.progress * 100);
  });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]">
      <div ref={barRef} className="h-full origin-left scale-x-0 rounded-r-full bg-blush" />
      <div
        ref={dotRef}
        className="absolute top-1/2 size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blush bg-cream"
        style={{ left: 0 }}
      />
    </div>
  );
}
