"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export function whileVisible<T extends gsap.core.Animation>(animation: T, trigger: Element | null): T {
  animation.pause();
  ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? animation.resume() : animation.pause()),
  });
  return animation;
}

export { gsap, ScrollTrigger, useGSAP };
