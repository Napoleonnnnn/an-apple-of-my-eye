"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, scrollState } from "@/lib/motion-utils";

export default function SmoothScroll() {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    let lenis: Lenis | null = null;

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
    }

    let lastY = window.scrollY;
    const tick = (time: number) => {
      lenis?.raf(time * 1000);
      const y = window.scrollY;
      scrollState.velocity += (y - lastY - scrollState.velocity) * 0.25;
      lastY = y;
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
