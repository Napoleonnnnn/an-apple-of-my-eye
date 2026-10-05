"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Lily from "@/components/lily/Lily";
import { content } from "@/lib/content";

const text = content.messages.honest;

function useTyping(active: boolean) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!active) return;
    let len = 0;
    let timer = 0;
    const step = () => {
      len++;
      setTyped(text.slice(0, len));
      if (len < text.length) timer = window.setTimeout(step, 45 + Math.random() * 55);
    };
    timer = window.setTimeout(step, 1600);
    return () => window.clearTimeout(timer);
  }, [active]);

  return typed;
}

function Dots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-2" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block size-2.5 rounded-full bg-maroon/50"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

function Ticks() {
  return (
    <svg viewBox="0 0 24 14" className="h-3 w-5" aria-hidden>
      <path d="M1 7 L5 11 L13 2 M9 11 L10 12 L22 2" fill="none" stroke="#E07A98" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Honest() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduce = useReducedMotion();
  const typed = useTyping(inView && !reduce);
  const done = typed.length === text.length;

  return (
    <section data-bg="#FFEFF3" data-stem-leaf className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-24">
      <motion.div
        ref={ref}
        className="w-full max-w-md overflow-hidden rounded-[2rem] border border-blush bg-[#FFF9FA] shadow-lift"
        initial={{ opacity: 0, y: 80, scale: 0.9, rotate: -3 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
      >
        <div className="flex items-center gap-3 border-b border-blush/70 bg-white/80 px-5 py-3.5" aria-hidden>
          <span className="flex size-10 items-center justify-center rounded-full bg-blush">
            <Lily className="size-8" />
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="block h-2.5 w-20 rounded-full bg-maroon/25" />
            <span className="block h-2 w-12 rounded-full bg-leaf/50" />
          </span>
        </div>

        <div
          className="flex min-h-[30svh] flex-col justify-end gap-3 px-4 py-6"
          style={{ background: "radial-gradient(rgb(244 163 185 / 0.22) 1.5px, transparent 1.6px) 0 0 / 20px 20px" }}
        >
          <motion.div
            className="flex items-end gap-2"
            initial={{ opacity: 0, x: -30, scale: 0.6 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.5 }}
            style={{ originX: 0, originY: 1 }}
          >
            <span aria-hidden className="mb-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-blush">
              <Lily className="size-5" />
            </span>
            <div className="max-w-[85%] rounded-[1.4rem] rounded-bl-md bg-white px-5 py-3.5 shadow-soft">
              {reduce ? (
                <p className="text-[1.35rem] leading-snug text-cocoa md:text-2xl">{text}</p>
              ) : (
                <p className="text-[1.35rem] leading-snug text-cocoa md:text-2xl">
                  <span className="sr-only">{text}</span>
                  <span aria-hidden>
                    {typed === "" ? (
                      <Dots />
                    ) : (
                      <>
                        {typed}
                        {!done && <span className="caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-maroon" />}
                      </>
                    )}
                  </span>
                </p>
              )}
              <span className="mt-1 flex justify-end" aria-hidden>
                <Ticks />
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
