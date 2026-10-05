"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { burstPetals } from "@/lib/motion-utils";

const subscribe = (cb: () => void) => {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
};
const getNow = () => Math.floor(Date.now() / 1000);
const getServerNow = () => 0;

const pad = (n: number) => String(n).padStart(2, "0");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isRealLink = (href: string | null): href is string => !!href && /^https?:\/\//.test(href);

async function fetchLink(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_PATH}/link.json?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { href?: unknown };
    return typeof data.href === "string" ? data.href : null;
  } catch {
    return null;
  }
}

function Digits({ value }: { value: string }) {
  return (
    <span className="relative inline-flex overflow-hidden rounded-xl bg-white px-2.5 py-2 font-display text-2xl font-semibold text-maroon tabular-nums shadow-soft md:text-3xl">
      {Array.from(value).map((d, i) => (
        <span key={i} className="relative inline-block w-[0.62em] text-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={d}
              className="inline-block"
              initial={{ y: "-70%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "70%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

function Lock({ open }: { open: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 32 36"
      className="size-9 overflow-visible"
      aria-hidden
      animate={open ? { rotate: 0 } : { rotate: [0, -10, 10, -6, 0, 0, 0, 0] }}
      transition={open ? { duration: 0.3 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.path
        d="M9 16 V11 C 9 3, 23 3, 23 11 V16"
        fill="none"
        stroke="#6E1F2E"
        strokeWidth="3.2"
        strokeLinecap="round"
        animate={open ? { y: -5, rotate: 24 } : { y: 0, rotate: 0 }}
        style={{ originX: 0.95, originY: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 12 }}
      />
      <rect x="4" y="15" width="24" height="19" rx="5" fill="#FFD6E0" stroke="#6E1F2E" strokeWidth="2" />
      <circle cx="16" cy="23.5" r="2.6" fill="#6E1F2E" />
      <path d="M16 25 V29" stroke="#6E1F2E" strokeWidth="2.4" strokeLinecap="round" />
    </motion.svg>
  );
}

export default function LockedLink({ label, unlockAt }: { label: string; unlockAt: string }) {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);
  const target = Math.floor(new Date(unlockAt).getTime() / 1000);
  const ready = now !== 0;
  const left = target - now;
  const unlocked = ready && left <= 0;
  const [href, setHref] = useState<string | null>(null);

  const boxRef = useRef<HTMLDivElement>(null);
  const sawLocked = useRef(false);

  useEffect(() => {
    if (!unlocked) return;
    let cancelled = false;
    fetchLink().then((link) => {
      if (!cancelled) setHref(link);
    });
    return () => {
      cancelled = true;
    };
  }, [unlocked]);

  useEffect(() => {
    if (!ready) return;
    if (!unlocked) {
      sawLocked.current = true;
      return;
    }
    if (sawLocked.current && boxRef.current) {
      sawLocked.current = false;
      const r = boxRef.current.getBoundingClientRect();
      burstPetals({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 40, power: 7 });
    }
  }, [ready, unlocked]);

  const onClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    burstPetals({ x: e.clientX, y: e.clientY, count: 18, power: 4.5 });
    if (isRealLink(href)) return;

    e.preventDefault();
    const link = await fetchLink();
    setHref(link);

    if (isRealLink(link)) window.location.assign(link);
  };

  if (!ready) return <div className="h-14" />;

  const h = Math.floor(Math.max(left, 0) / 3600);
  const m = Math.floor((Math.max(left, 0) % 3600) / 60);
  const s = Math.max(left, 0) % 60;

  return (
    <div ref={boxRef} className="flex min-h-14 flex-col items-center">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="locked"
            role="timer"
            className="flex items-center gap-3"
            exit={{ scale: 0.6, opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.35 }}
          >
            <Lock open={false} />
            <span className="flex items-center gap-1.5" aria-hidden>
              <Digits value={pad(h)} />
              <span className="font-display text-2xl font-semibold text-maroon/60">:</span>
              <Digits value={pad(m)} />
              <span className="font-display text-2xl font-semibold text-maroon/60">:</span>
              <Digits value={pad(s)} />
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="open"
            className="flex flex-col items-center gap-3"
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
          >
            <Lock open />
            <motion.a
              href={isRealLink(href) ? href : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClick}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="shimmer inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full bg-maroon px-7 py-3.5 font-medium text-cream shadow-lift outline-none focus-visible:ring-4 focus-visible:ring-blush"
            >
              <svg viewBox="0 0 24 24" className="relative z-[2] size-5" aria-hidden>
                <rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="#FFD6E0" strokeWidth="2" />
                <path d="M4 7 L12 13 L20 7" fill="none" stroke="#FFD6E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="relative z-[2]">{label}</span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
