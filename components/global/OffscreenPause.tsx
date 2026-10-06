"use client";

import { useEffect } from "react";

export default function OffscreenPause() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("main > section, main .pin-spacer > section");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute("data-idle", !e.isIntersecting);
      },
      { rootMargin: "120px 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return null;
}
