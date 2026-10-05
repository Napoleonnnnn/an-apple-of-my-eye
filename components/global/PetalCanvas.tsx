"use client";

import { useEffect, useRef } from "react";
import { type BurstDetail, REDUCED_QUERY, scrollState } from "@/lib/motion-utils";

type Petal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  phase: number;
  swaySpeed: number;
  swayAmp: number;
  color: string;
  alpha: number;

  life: number | null;

  laneX: number | null;
};

const COLORS = ["#FFD6E0", "#FFC4D2", "#FFE3EA", "#F9B6C8"];
const MAX_BURST = 140;
const LANE = 20;

function ambientPetal(w: number, h: number, anywhere: boolean): Petal {
  const lanes = w < 768;
  const laneX = lanes ? (Math.random() < 0.5 ? 4 + Math.random() * (LANE - 8) : w - 4 - Math.random() * (LANE - 8)) : null;
  return {
    x: laneX ?? Math.random() * w,
    y: anywhere ? Math.random() * h : -20 - Math.random() * 80,
    vx: 0,
    vy: 0.35 + Math.random() * 0.45,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.02,
    size: lanes ? 4 + Math.random() * 3 : 5 + Math.random() * 5,
    phase: Math.random() * Math.PI * 2,
    swaySpeed: 0.008 + Math.random() * 0.012,
    swayAmp: 0.35 + Math.random() * 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 0.55 + Math.random() * 0.35,
    life: null,
    laneX,
  };
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  const s = p.size;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);

  ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.cos(p.phase * 1.3)));
  ctx.globalAlpha = p.alpha * (p.life ?? 1);
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.85, -s * 0.55, s * 0.6, s * 0.75, 0, s);
  ctx.bezierCurveTo(-s * 0.6, s * 0.75, -s * 0.85, -s * 0.55, 0, -s);
  ctx.fillStyle = p.color;
  ctx.fill();
  ctx.strokeStyle = "rgba(214, 120, 150, 0.35)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.7);
  ctx.lineTo(0, s * 0.6);
  ctx.stroke();
  ctx.restore();
}

export default function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia(REDUCED_QUERY).matches) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;
    let ambient: Petal[] = [];
    let bursts: Petal[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 768 ? 8 : 14;
      if (ambient.length !== count || w < 768 !== ambient.some((p) => p.laneX !== null)) {
        ambient = Array.from({ length: count }, () => ambientPetal(w, h, true));
      }
    };
    resize();

    const onBurst = (e: Event) => {
      const { x, y, count = 6, power = 3 } = (e as CustomEvent<BurstDetail>).detail;
      for (let i = 0; i < count && bursts.length < MAX_BURST; i++) {
        const a = Math.random() * Math.PI * 2;
        const speed = power * (0.45 + Math.random() * 0.75);
        const p = ambientPetal(w, h, true);
        p.laneX = null;
        p.x = x;
        p.y = y;
        p.vx = Math.cos(a) * speed;
        p.vy = Math.sin(a) * speed - power * 0.35;
        p.vr = (Math.random() - 0.5) * 0.25;
        p.size = 4 + Math.random() * 5;
        p.alpha = 0.95;
        p.life = 1;
        bursts.push(p);
      }
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      onBurst(new CustomEvent("petal-burst", { detail: { x: e.clientX, y: e.clientY, count: 4, power: 2.4 } }));
    };

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 16.667, 3);
      last = now;
      if (document.hidden) return;

      const v = Math.max(-40, Math.min(40, scrollState.velocity));
      ctx.clearRect(0, 0, w, h);

      for (const p of ambient) {
        p.phase += p.swaySpeed * dt;
        if (p.laneX !== null) p.x = p.laneX + Math.sin(p.phase) * 4;
        else p.x += (Math.sin(p.phase) * p.swayAmp + p.vx) * dt;
        p.y += (p.vy - v * 0.22) * dt;
        p.rot += (p.vr + Math.abs(v) * 0.0015) * dt;
        if (p.y > h + 24) Object.assign(p, ambientPetal(w, h, false));
        if (p.y < -60) p.y = h + 20;
        if (p.x < -20) p.x = w + 10;
        if (p.x > w + 20) p.x = -10;
        drawPetal(ctx, p);
      }

      bursts = bursts.filter((p) => (p.life ?? 0) > 0);
      for (const p of bursts) {
        p.vx *= Math.pow(0.97, dt);
        p.vy = p.vy * Math.pow(0.97, dt) + 0.05 * dt;
        p.phase += 0.06 * dt;
        p.x += (p.vx + Math.sin(p.phase) * 0.3) * dt;
        p.y += (p.vy - v * 0.1) * dt;
        p.rot += p.vr * dt;
        p.life = (p.life ?? 0) - 0.0075 * dt;
        drawPetal(ctx, p);
      }
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("resize", resize);
    window.addEventListener("petal-burst", onBurst);
    window.addEventListener("pointerdown", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("petal-burst", onBurst);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-30" />;
}
