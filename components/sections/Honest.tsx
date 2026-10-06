"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { content } from "@/lib/content";
import FloatingDecor from "@/components/ui/FloatingDecor";

const text = content.messages.honest;
const replies = content.chat;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const STICKERS: Record<string, string> = { cool: "cool.webp", dia: "stickerdia.webp" };

function Avatar({ className, who = "me" }: { className: string; who?: "me" | "her" }) {
  return (
    <span className={`block shrink-0 overflow-hidden rounded-full ring-2 ring-white ${who === "her" ? "bg-[#E3F0DA]" : "bg-[#EDE6F5]"} ${className}`}>
      <Image
        src={`${BASE_PATH}/images/${who === "her" ? "enfp-avatar" : "intj-avatar"}.webp`}
        alt=""
        width={80}
        height={80}
        className="size-full object-cover"
      />
    </span>
  );
}

function useConversation(active: boolean) {
  const [typed, setTyped] = useState("");
  const [shown, setShown] = useState(0);
  const [typingSide, setTypingSide] = useState<"me" | "her" | null>(null);

  useEffect(() => {
    if (!active) return;
    let len = 0;
    let timer = 0;
    let next = 0;
    const reply = () => {
      if (next >= replies.length) {
        setTypingSide(null);
        return;
      }
      setTypingSide(replies[next].from as "me" | "her");
      timer = window.setTimeout(() => {
        next++;
        setShown(next);
        setTypingSide(null);
        timer = window.setTimeout(reply, 700);
      }, 1100);
    };
    const step = () => {
      len++;
      setTyped(text.slice(0, len));
      if (len < text.length) timer = window.setTimeout(step, 45 + Math.random() * 55);
      else timer = window.setTimeout(reply, 900);
    };
    timer = window.setTimeout(step, 1600);
    return () => window.clearTimeout(timer);
  }, [active]);

  return { typed, shown, typingSide };
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

const pop = {
  initial: { opacity: 0, scale: 0.6, y: 14 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 320, damping: 20 },
};

function Row({ side, children, avatar }: { side: "me" | "her"; children: React.ReactNode; avatar?: boolean }) {
  return (
    <motion.div className={`flex items-end gap-2 ${side === "her" ? "justify-end" : ""}`} {...pop} style={{ originX: side === "her" ? 1 : 0, originY: 1 }}>
      {side === "me" && (avatar ? <Avatar className="mb-1 size-7" /> : <span className="w-7 shrink-0" />)}
      {children}
      {side === "her" && (avatar ? <Avatar who="her" className="mb-1 size-7" /> : <span className="w-7 shrink-0" />)}
    </motion.div>
  );
}

export default function Honest() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6, once: true });
  const reduce = useReducedMotion();
  const convo = useConversation(inView && !reduce);
  const typed = reduce ? text : convo.typed;
  const shown = reduce ? replies.length : convo.shown;
  const done = typed.length === text.length;

  return (
    <section data-bg="#FFEFF3" data-stem-leaf className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-24">
      <FloatingDecor items={[{ kind: "matcha", x: 86, y: 10, size: 42, depth: 0.5, rotate: 10 }]} />
      <motion.div
        ref={ref}
        className="w-full max-w-md overflow-hidden rounded-[2rem] border border-blush bg-[#FFF9FA] shadow-lift"
        initial={{ opacity: 0, y: 80, scale: 0.9, rotate: -3 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
      >
        <div className="flex items-center gap-3 border-b border-blush/70 bg-white/80 px-5 py-3.5" aria-hidden>
          <span className="relative">
            <Avatar className="size-10" />
            <span className="absolute right-0 bottom-0 block size-2.5 rounded-full bg-leaf ring-2 ring-white" />
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="block h-2.5 w-20 rounded-full bg-maroon/25" />
            <span className="block h-2 w-12 rounded-full bg-leaf/50" />
          </span>
        </div>

        <div
          className="flex min-h-[46svh] flex-col justify-end gap-2.5 px-4 py-6"
          style={{ background: "radial-gradient(rgb(244 163 185 / 0.22) 1.5px, transparent 1.6px) 0 0 / 20px 20px" }}
        >
          <Row side="me" avatar={shown === 0 || (replies[0].from as string) !== "me"}>
            <div className="max-w-[85%] rounded-[1.4rem] rounded-bl-md bg-white px-5 py-3.5 shadow-soft">
              <p className="text-[1.2rem] leading-snug text-cocoa md:text-[1.4rem]">
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
            </div>
          </Row>

          {replies.slice(0, shown).map((m, i) => {
            const side = m.from as "me" | "her";
            const lastOfGroup = i === shown - 1 || replies[i + 1]?.from !== m.from;
            if ("sticker" in m) {
              return (
                <Row key={i} side={side} avatar={lastOfGroup}>
                  <Image
                    src={`${BASE_PATH}/images/${STICKERS[m.sticker]}`}
                    alt=""
                    width={220}
                    height={220}
                    className="size-28 rounded-2xl object-cover shadow-soft md:size-32"
                  />
                </Row>
              );
            }
            return (
              <Row key={i} side={side} avatar={lastOfGroup}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 shadow-soft ${
                    side === "her" ? "rounded-[1.2rem] rounded-br-md bg-blush text-maroon" : "rounded-[1.2rem] rounded-bl-md bg-white text-cocoa"
                  }`}
                >
                  <p className="text-[1.1rem] leading-snug md:text-[1.2rem]">{m.text}</p>
                  {side === "her" && (
                    <span className="mt-0.5 flex justify-end" aria-hidden>
                      <Ticks />
                    </span>
                  )}
                </div>
              </Row>
            );
          })}

          {convo.typingSide && (
            <Row side={convo.typingSide} avatar>
              <div
                className={`px-4 py-1.5 shadow-soft ${convo.typingSide === "her" ? "rounded-[1.2rem] rounded-br-md bg-blush" : "rounded-[1.2rem] rounded-bl-md bg-white"}`}
              >
                <Dots />
              </div>
            </Row>
          )}
        </div>
      </motion.div>
    </section>
  );
}
