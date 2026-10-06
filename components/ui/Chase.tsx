"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { LILY_BLOOM, LILY_CLOSE, MOTION_OK_QUERY } from "@/lib/motion-utils";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function Runner({ who, className }: { who: "enfp" | "intj"; className: string }) {
  const ring = who === "enfp" ? "ring-[#B4D29C] bg-[#E3F0DA]" : "ring-[#C9B8E6] bg-[#EDE6F5]";
  const leg = who === "enfp" ? "#6FA35A" : "#4B3F63";
  return (
    <div className={`runner absolute bottom-8 left-0 ${className}`}>
      <div className="runner-flip">
        <div className="runner-pose relative h-[4.6rem] w-14" style={{ transformOrigin: "50% 100%" }}>
          <div className="runner-body relative size-full">
            <span className="runner-dust absolute bottom-0 -right-3 block size-3 rounded-full bg-[#E9D7CF]" />
            <span className="runner-dust runner-dust-2 absolute bottom-0.5 -right-6 block size-2 rounded-full bg-[#E9D7CF]" />
            <svg viewBox="0 0 56 24" className="absolute bottom-0 left-0 h-6 w-14 overflow-visible">
              <path className="runner-leg" d="M22 0 L18 20" stroke={leg} strokeWidth="4.5" strokeLinecap="round" />
              <path className="runner-leg runner-leg-2" d="M34 0 L38 20" stroke={leg} strokeWidth="4.5" strokeLinecap="round" />
            </svg>
            <span className={`absolute top-0 left-0 block size-14 overflow-hidden rounded-full shadow-soft ring-[3px] ${ring}`}>
              <Image src={`${BASE_PATH}/images/${who}-avatar.webp`} alt="" width={80} height={80} className="size-full object-cover" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Chase() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_QUERY, () => {
        const root = ref.current!;
        const enfp = root.querySelector<HTMLElement>(".runner-enfp")!;
        const intj = root.querySelector<HTMLElement>(".runner-intj")!;
        const flip = (r: HTMLElement) => r.querySelector<HTMLElement>(".runner-flip")!;
        const pose = (r: HTMLElement) => r.querySelector<HTMLElement>(".runner-pose")!;
        const ball = root.querySelector<HTMLElement>(".throwball")!;
        const stars = root.querySelector<HTMLElement>(".bonk")!;
        const sweat = root.querySelector<HTMLElement>(".sweat")!;
        const books = root.querySelector<HTMLElement>(".books")!;
        const sun = root.querySelector<HTMLElement>(".sun")!;
        const parasol = root.querySelector<HTMLElement>(".parasol")!;
        const bottle = root.querySelector<HTMLElement>(".bottle")!;
        const cam = root.querySelector<HTMLElement>(".cam")!;
        const flash = root.querySelector<HTMLElement>(".flash")!;
        const photos = gsap.utils.toArray<HTMLElement>(".polaroid", root);
        const props = [ball, stars, sweat, books, sun, parasol, bottle, cam, flash, ...photos];

        // both drawings look to the left, so facing right = mirrored
        const face = (r: HTMLElement, dir: "left" | "right") => () => gsap.set(flip(r), { scaleX: dir === "right" ? -1 : 1 });
        const still = (r: HTMLElement, on: boolean) => () => r.classList.toggle("still", on);

        const W = () => root.clientWidth;
        const off = () => -(enfp.offsetWidth + 150);
        const far = () => W() + 150;
        const at = (f: number) => () => W() * f;
        const x = (r: HTMLElement) => gsap.getProperty(r, "x") as number;

        const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "none" } });

        // scene 1: ENFP runs off happy, hops, looks back, slips; INTJ catches up and checks on her
        tl.call(face(enfp, "right"), [], 0)
          .call(face(intj, "right"), [], 0)
          .call(still(enfp, false), [], 0)
          .call(still(intj, false), [], 0)
          .set([enfp, intj], { autoAlpha: 1 }, 0)
          .set([pose(enfp), pose(intj)], { rotation: 0, y: 0, scaleY: 1 }, 0)
          .fromTo(enfp, { x: () => off() + 90 }, { x: at(0.55), duration: 3.4, immediateRender: false }, 0)
          .fromTo(intj, { x: () => off() }, { x: at(0.18), duration: 3.6, immediateRender: false }, 0.3)
          .to(pose(enfp), { y: -22, duration: 0.22, ease: "power2.out", yoyo: true, repeat: 1 }, 1.0)
          .to(pose(enfp), { rotation: 18, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut" }, 2.0)
          .addLabel("slip", 3.4)
          .call(still(enfp, true), [], "slip")
          .to(pose(enfp), { rotation: -82, y: -26, duration: 0.28, ease: "power3.in" }, "slip")
          .to(enfp, { x: () => x(enfp) + 22, duration: 0.28, ease: "power2.out" }, "slip")
          .to(intj, { x: () => x(enfp) - 64, duration: 1.1, ease: "power1.out" }, "slip")
          .call(still(intj, true), [], "slip+=1.1")
          .to(pose(intj), { rotation: -18, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 1 }, "slip+=1.15")
          .to(pose(enfp), { rotation: 0, y: 0, duration: 0.4, ease: "back.out(2)" }, "slip+=1.8")
          .call(still(enfp, false), [], "slip+=2.2")
          .to(enfp, { x: () => far() + 90, duration: 2.6, ease: "power1.in" }, "slip+=2.2")
          .call(still(intj, false), [], "slip+=2.45")
          .to(intj, { x: () => far(), duration: 2.8, ease: "power1.in" }, "slip+=2.45")

          // scene 2: back from the right; INTJ runs, ENFP chases, stops and throws a pineapple, bonk
          .addLabel("back", "+=0.6")
          .call(face(enfp, "left"), [], "back")
          .call(face(intj, "left"), [], "back")
          .fromTo(intj, { x: () => far() }, { x: at(0.15), duration: 3.4, immediateRender: false }, "back")
          .fromTo(enfp, { x: () => far() + 120 }, { x: at(0.62), duration: 3.0, immediateRender: false }, "back+=0.2")
          .addLabel("throw", "back+=3.2")
          .call(still(enfp, true), [], "throw")
          .to(pose(enfp), { rotation: 22, duration: 0.15, ease: "power2.out", yoyo: true, repeat: 1 }, "throw")
          .set(ball, { autoAlpha: 1, x: () => x(enfp) + 8, y: -48, rotation: 0 }, "throw+=0.15")
          .to(ball, { x: () => x(intj) + 16, rotation: -540, duration: 0.7, ease: "none" }, "throw+=0.15")
          .to(ball, { y: -110, duration: 0.35, ease: "power2.out" }, "throw+=0.15")
          .to(ball, { y: -60, duration: 0.35, ease: "power2.in" }, "throw+=0.5")
          .addLabel("bonk", "throw+=0.85")
          .call(still(intj, true), [], "bonk")
          .to(ball, { y: 10, x: () => x(intj) + 70, rotation: -720, autoAlpha: 0, duration: 0.5, ease: "power1.in" }, "bonk")
          .to(intj, { x: () => x(intj) - 18, duration: 0.25, ease: "power2.out" }, "bonk")
          .to(pose(intj), { scaleY: 0.82, duration: 0.12, yoyo: true, repeat: 1 }, "bonk")
          .set(stars, { autoAlpha: 1, x: () => x(intj) - 4 }, "bonk")
          .fromTo(stars, { rotation: 0 }, { rotation: 360, duration: 1.2, ease: "none" }, "bonk")
          .to(pose(intj), { rotation: 14, duration: 0.2, ease: "sine.inOut", yoyo: true, repeat: 3 }, "bonk+=0.2")
          .set(stars, { autoAlpha: 0 }, "bonk+=1.2")

          // then INTJ turns around and chases ENFP back off to the right
          .addLabel("revenge", "bonk+=1.3")
          .call(face(intj, "right"), [], "revenge")
          .call(still(intj, false), [], "revenge")
          .call(face(enfp, "right"), [], "revenge+=0.25")
          .to(pose(enfp), { y: -16, duration: 0.15, ease: "power2.out", yoyo: true, repeat: 1 }, "revenge")
          .call(still(enfp, false), [], "revenge+=0.25")
          .to(enfp, { x: () => far() + 90, duration: 2.6, ease: "power1.in" }, "revenge+=0.3")
          .to(intj, { x: () => far(), duration: 3.0, ease: "power1.in" }, "revenge+=0.25")

          // scene 3: ENFP wobbles in under a tower of books, INTJ takes them all and they walk off together
          .addLabel("books", "+=0.8")
          .call(face(enfp, "right"), [], "books")
          .call(face(intj, "left"), [], "books")
          .set([pose(enfp), pose(intj)], { rotation: 0, y: 0, scaleY: 1 }, "books")
          .set(books, { autoAlpha: 1, rotation: 0 }, "books")
          .add(() => enfp.classList.add("slow"), "books")
          .fromTo(enfp, { x: () => off() }, { x: at(0.3), duration: 4.0, immediateRender: false }, "books")
          .fromTo(books, { x: () => off() - 4 }, { x: () => W() * 0.3 - 4, duration: 4.0, immediateRender: false }, "books")
          .to(books, { rotation: 7, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 7 }, "books")
          .to(pose(enfp), { rotation: -6, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 7 }, "books")
          .fromTo(intj, { x: () => far() }, { x: () => W() * 0.3 + 70, duration: 2.6, ease: "power1.out", immediateRender: false }, "books+=1.5")
          .addLabel("handoff", "books+=4.1")
          .call(still(enfp, true), [], "handoff")
          .add(() => enfp.classList.remove("slow"), "handoff")
          .call(still(intj, true), [], "handoff")
          .to(books, { x: () => x(intj) - 4, y: -6, rotation: 0, duration: 0.6, ease: "power2.inOut" }, "handoff+=0.3")
          .to(pose(intj), { scaleY: 0.9, duration: 0.15, yoyo: true, repeat: 1 }, "handoff+=0.85")
          .to(pose(enfp), { y: -22, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1 }, "handoff+=1.0")
          .fromTo(pose(enfp), { rotation: 0 }, { rotation: -360, duration: 0.5, ease: "power1.inOut", immediateRender: false }, "handoff+=1.0")
          .set(pose(enfp), { rotation: 0 }, "handoff+=1.5")
          .call(face(intj, "right"), [], "handoff+=1.7")
          .call(still(enfp, false), [], "handoff+=1.9")
          .call(still(intj, false), [], "handoff+=1.9")
          .add(() => intj.classList.add("slow"), "handoff+=1.9")
          .add(() => enfp.classList.add("slow"), "handoff+=1.9")
          .to(enfp, { x: () => far() - 76, duration: 4.6 }, "handoff+=1.9")
          .to(intj, { x: () => far(), duration: 4.6 }, "handoff+=1.9")
          .to(books, { x: () => far() - 4, duration: 4.6 }, "handoff+=1.9")
          .set(books, { autoAlpha: 0 }, "handoff+=6.5")
          .add(() => intj.classList.remove("slow"), "handoff+=6.5")
          .add(() => enfp.classList.remove("slow"), "handoff+=6.5")

          // scene 4: hot sun, ENFP gets tired; INTJ shades her with a parasol and hands her water
          .addLabel("sunny", "+=0.6")
          .call(face(enfp, "right"), [], "sunny")
          .call(face(intj, "right"), [], "sunny")
          .fromTo(sun, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "back.out(2)" }, "sunny")
          .fromTo(enfp, { x: () => off() + 90 }, { x: at(0.6), duration: 3.6, ease: "power2.out", immediateRender: false }, "sunny")
          .fromTo(intj, { x: () => off() }, { x: () => W() * 0.6 - 66, duration: 4.4, ease: "power1.out", immediateRender: false }, "sunny+=0.6")
          .addLabel("hot", "sunny+=3.5")
          .call(still(enfp, true), [], "hot")
          .to(pose(enfp), { rotation: -24, duration: 0.3, ease: "power2.out" }, "hot")
          .to(pose(enfp), { scaleY: 0.9, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 5 }, "hot+=0.3")
          .set(sweat, { autoAlpha: 1, x: () => x(enfp) + 8, y: 0 }, "hot+=0.2")
          .to(sweat, { y: 22, autoAlpha: 0, duration: 0.8, ease: "power1.in", repeat: 1 }, "hot+=0.2")
          .addLabel("care", "sunny+=5.0")
          .call(still(intj, true), [], "care")
          .set(parasol, { x: () => x(enfp) - 26, autoAlpha: 1 }, "care")
          .fromTo(parasol, { scaleX: 0.15, y: 12 }, { scaleX: 1, y: 0, duration: 0.45, ease: "back.out(2.2)" }, "care")
          .set(bottle, { autoAlpha: 1, x: () => x(intj) + 40, y: -30, rotation: 0 }, "care+=0.7")
          .to(bottle, { x: () => x(enfp) + 30, y: -44, duration: 0.5, ease: "power1.inOut" }, "care+=0.7")
          .to(pose(enfp), { rotation: 0, scaleY: 1, duration: 0.3, ease: "power2.out" }, "care+=1.1")
          .to(bottle, { rotation: 60, x: () => x(enfp) + 22, y: -52, duration: 0.3 }, "care+=1.3")
          .to(bottle, { rotation: 75, duration: 0.25, yoyo: true, repeat: 3 }, "care+=1.6")
          .to(bottle, { autoAlpha: 0, duration: 0.2 }, "care+=2.6")
          .to(pose(enfp), { y: -24, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 3 }, "care+=2.7")
          .to(sun, { autoAlpha: 0, scale: 0.5, duration: 0.6 }, "care+=2.9")
          .to(parasol, { autoAlpha: 0, scaleX: 0.15, duration: 0.3 }, "care+=3.4")
          .call(still(enfp, false), [], "care+=3.6")
          .to(enfp, { x: () => far() + 90, duration: 2.4, ease: "power1.in" }, "care+=3.6")
          .call(still(intj, false), [], "care+=3.9")
          .to(intj, { x: () => far(), duration: 2.8, ease: "power1.in" }, "care+=3.9")

          // scene 5: photo session, INTJ is her photographer and ENFP strikes pose after pose
          .addLabel("photo", "+=0.8")
          .call(face(enfp, "left"), [], "photo")
          .call(face(intj, "left"), [], "photo")
          .fromTo(enfp, { x: () => far() }, { x: at(0.26), duration: 3.2, ease: "power1.out", immediateRender: false }, "photo")
          .fromTo(intj, { x: () => far() + 120 }, { x: at(0.66), duration: 3.6, ease: "power1.out", immediateRender: false }, "photo+=0.2")
          .call(still(enfp, true), [], "photo+=3.2")
          .call(face(enfp, "right"), [], "photo+=3.4")
          .call(still(intj, true), [], "photo+=3.8")
          .to(pose(intj), { scaleY: 0.86, y: 4, duration: 0.25 }, "photo+=3.8")
          .set(cam, { x: () => x(intj) - 30, autoAlpha: 1, scale: 0.4 }, "photo+=3.9")
          .to(cam, { scale: 1, duration: 0.3, ease: "back.out(2.5)" }, "photo+=3.9")
          .addLabel("pose1", "photo+=4.5")
          .to(pose(enfp), { y: -26, duration: 0.2, ease: "power2.out" }, "pose1")
          .set(flash, { x: () => x(intj) - 30, autoAlpha: 1, scale: 0.3 }, "pose1+=0.2")
          .to(flash, { scale: 2.4, autoAlpha: 0, duration: 0.35, ease: "power2.out" }, "pose1+=0.2")
          .to(cam, { scale: 0.88, duration: 0.08, yoyo: true, repeat: 1 }, "pose1+=0.2")
          .set(photos[0], { x: () => x(intj) - 26, y: -40, rotation: 0, autoAlpha: 1, scale: 0.4 }, "pose1+=0.2+=0.15")
          .to(photos[0], { y: -150, x: () => x(intj) - 26 + -40, rotation: -14, scale: 1, duration: 1.6, ease: "power1.out" }, "pose1+=0.2+=0.15")
          .to(photos[0], { autoAlpha: 0, duration: 0.5 }, "pose1+=0.2+=1.4")
          .to(pose(enfp), { y: 0, duration: 0.2, ease: "power2.in" }, "pose1+=0.35")
          .addLabel("pose2", "pose1+=1.1")
          .to(pose(enfp), { rotation: 18, y: -4, duration: 0.3, ease: "back.out(2)" }, "pose2")
          .set(flash, { x: () => x(intj) - 30, autoAlpha: 1, scale: 0.3 }, "pose2+=0.35")
          .to(flash, { scale: 2.4, autoAlpha: 0, duration: 0.35, ease: "power2.out" }, "pose2+=0.35")
          .to(cam, { scale: 0.88, duration: 0.08, yoyo: true, repeat: 1 }, "pose2+=0.35")
          .set(photos[1], { x: () => x(intj) - 26, y: -40, rotation: 0, autoAlpha: 1, scale: 0.4 }, "pose2+=0.35+=0.15")
          .to(photos[1], { y: -150, x: () => x(intj) - 26 + 10, rotation: 8, scale: 1, duration: 1.6, ease: "power1.out" }, "pose2+=0.35+=0.15")
          .to(photos[1], { autoAlpha: 0, duration: 0.5 }, "pose2+=0.35+=1.4")
          .to(pose(enfp), { rotation: 0, y: 0, duration: 0.25 }, "pose2+=0.8")
          .addLabel("pose3", "pose2+=1.3")
          .fromTo(pose(enfp), { rotation: 0 }, { rotation: 360, duration: 0.55, ease: "power1.inOut", immediateRender: false }, "pose3")
          .to(pose(enfp), { y: -44, duration: 0.27, ease: "power2.out" }, "pose3")
          .to(pose(enfp), { y: 0, duration: 0.27, ease: "power2.in" }, "pose3+=0.27")
          .set(pose(enfp), { rotation: 0 }, "pose3+=0.55")
          .to(pose(enfp), { rotation: -14, scaleY: 1.06, duration: 0.2 }, "pose3+=0.6")
          .set(flash, { x: () => x(intj) - 30, autoAlpha: 1, scale: 0.3 }, "pose3+=0.7")
          .to(flash, { scale: 2.4, autoAlpha: 0, duration: 0.35, ease: "power2.out" }, "pose3+=0.7")
          .to(cam, { scale: 0.88, duration: 0.08, yoyo: true, repeat: 1 }, "pose3+=0.7")
          .set(photos[2], { x: () => x(intj) - 26, y: -40, rotation: 0, autoAlpha: 1, scale: 0.4 }, "pose3+=0.7+=0.15")
          .to(photos[2], { y: -150, x: () => x(intj) - 26 + 55, rotation: 18, scale: 1, duration: 1.6, ease: "power1.out" }, "pose3+=0.7+=0.15")
          .to(photos[2], { autoAlpha: 0, duration: 0.5 }, "pose3+=0.7+=1.4")
          .to(pose(enfp), { rotation: 0, scaleY: 1, duration: 0.2 }, "pose3+=1.2")
          .to(cam, { scale: 0.3, autoAlpha: 0, duration: 0.25 }, "pose3+=1.5")
          .to(pose(intj), { scaleY: 1, y: 0, duration: 0.25 }, "pose3+=1.5")
          .call(still(enfp, false), [], "pose3+=1.6")
          .to(enfp, { x: () => x(intj) - 64, duration: 0.8, ease: "power1.inOut" }, "pose3+=1.6")
          .call(still(enfp, true), [], "pose3+=2.4")
          .to(pose(enfp), { y: -22, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 3 }, "pose3+=2.45")
          .to(pose(intj), { rotation: 12, duration: 0.2, yoyo: true, repeat: 1 }, "pose3+=2.5")
          .call(face(intj, "right"), [], "pose3+=3.2")
          .call(still(enfp, false), [], "pose3+=3.3")
          .call(still(intj, false), [], "pose3+=3.3")
          .to(enfp, { x: () => far() + 60, duration: 2.6, ease: "power1.in" }, "pose3+=3.3")
          .to(intj, { x: () => far() + 140, duration: 2.6, ease: "power1.in" }, "pose3+=3.3")

          .set([enfp, intj], { autoAlpha: 0 })
          .to({}, { duration: 0.8 });

        gsap.set([enfp, intj, ...props], { autoAlpha: 0 });
        gsap.set([enfp, intj], { x: () => off() });

        let started = false;
        let visible = true;
        let wait: gsap.core.Tween | null = null;
        const sync = () => (started && visible ? tl.play() : tl.pause());
        const onBloom = () => {
          wait?.kill();
          wait = gsap.delayedCall(5, () => {
            started = true;
            tl.restart();
            sync();
          });
        };
        const onClose = () => {
          wait?.kill();
          started = false;
          tl.pause(0);
          gsap.set([enfp, intj, ...props], { autoAlpha: 0 });
          enfp.classList.remove("slow", "still");
          intj.classList.remove("slow", "still");
        };
        const onResize = () => tl.invalidate();
        const st = ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
            sync();
          },
        });
        window.addEventListener(LILY_BLOOM, onBloom);
        window.addEventListener(LILY_CLOSE, onClose);
        window.addEventListener("resize", onResize);
        return () => {
          wait?.kill();
          st.kill();
          window.removeEventListener(LILY_BLOOM, onBloom);
          window.removeEventListener(LILY_CLOSE, onClose);
          window.removeEventListener("resize", onResize);
        };
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[1svh] -z-10 h-48 overflow-hidden">
      <div className="absolute right-0 bottom-[1.9rem] left-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-blush-deep/50 to-transparent" />
      <Runner who="intj" className="runner-intj" />
      <Runner who="enfp" className="runner-enfp" />
      <div className="throwball absolute bottom-8 left-0 size-7">
        <svg viewBox="0 0 64 64" className="size-full">
          <path d="M32 26 C 28 18, 22 14, 16 13 C 22 18, 25 22, 27 27Z M32 26 C 36 18, 42 14, 48 13 C 42 18, 39 22, 37 27Z" fill="#6FA35A" />
          <path d="M32 27 C 29 18, 30 9, 32 2 C 34 9, 35 18, 32 27Z" fill="#86B86F" />
          <ellipse cx="32" cy="44" rx="14" ry="17" fill="#F6C24B" stroke="#E0A33A" strokeWidth="1.5" />
          <path d="M22 34 L42 54 M26 30 L44 48 M42 34 L22 54 M38 30 L20 48" stroke="#D99A33" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="sun absolute top-1 left-6 size-12" style={{ transformOrigin: "50% 50%" }}>
        <svg viewBox="0 0 48 48" className="sun-spin size-full">
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M24 2 L26 9 L22 9Z" fill="#F6C66B" transform={`rotate(${i * 45} 24 24)`} />
          ))}
          <circle cx="24" cy="24" r="11" fill="#FFD66B" stroke="#F2B544" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="books absolute bottom-[6.9rem] left-0 h-10 w-16" style={{ transformOrigin: "50% 100%" }}>
        <svg viewBox="0 0 64 40" className="size-full">
          <rect x="6" y="28" width="52" height="11" rx="2" fill="#6E1F2E" />
          <rect x="8" y="30" width="48" height="2" fill="#FFF6EE" />
          <rect x="10" y="17" width="46" height="11" rx="2" fill="#86A96F" />
          <rect x="12" y="19" width="42" height="2" fill="#FFF6EE" />
          <rect x="4" y="6" width="50" height="11" rx="2" fill="#F4A3B9" />
          <rect x="6" y="8" width="46" height="2" fill="#FFF6EE" />
          <rect x="14" y="0" width="34" height="6" rx="1.5" fill="#E8C07A" />
        </svg>
      </div>
      <div className="parasol absolute bottom-[5.6rem] left-0 h-14 w-28" style={{ transformOrigin: "50% 100%" }}>
        <svg viewBox="0 0 112 56" className="size-full overflow-visible">
          <path
            d="M6 30 C 14 6, 98 6, 106 30 C 96 24, 86 24, 79 30 C 72 24, 62 24, 56 30 C 50 24, 40 24, 33 30 C 26 24, 16 24, 6 30Z"
            fill="#FFD6E0"
            stroke="#F4A3B9"
            strokeWidth="1.5"
          />
          <path d="M56 8 C 50 16, 46 24, 33 30 M56 8 C 62 16, 66 24, 79 30" stroke="#F4A3B9" strokeWidth="1.2" fill="none" />
          <path d="M56 4 V 30 L 38 60" stroke="#5C3A2E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="bottle absolute bottom-8 left-0 h-9 w-5" style={{ transformOrigin: "50% 50%" }}>
        <svg viewBox="0 0 20 36" className="size-full">
          <rect x="6" y="0" width="8" height="5" rx="1.5" fill="#86A96F" />
          <path d="M5 5 H15 L17 10 V33 C 17 35, 3 35, 3 33 V10Z" fill="#E3F2FF" stroke="#9CC9E8" strokeWidth="1.2" />
          <path d="M3.6 16 H16.4 V33 C 16.4 34.6, 3.6 34.6, 3.6 33Z" fill="#9CC9E8" opacity="0.7" />
          <path d="M6 14 V28" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        </svg>
      </div>
      <div className="cam absolute bottom-[3.2rem] left-0 h-7 w-9" style={{ transformOrigin: "50% 50%" }}>
        <svg viewBox="0 0 36 28" className="size-full">
          <rect x="1" y="6" width="34" height="21" rx="4" fill="#5C3A2E" />
          <rect x="6" y="2" width="11" height="6" rx="2" fill="#5C3A2E" />
          <circle cx="18" cy="16.5" r="7.5" fill="#FFD6E0" />
          <circle cx="18" cy="16.5" r="4.6" fill="#2B2B33" />
          <circle cx="16.4" cy="14.8" r="1.4" fill="#FFFFFF" opacity="0.8" />
          <rect x="27" y="9" width="5" height="3" rx="1" fill="#F6C66B" />
        </svg>
      </div>
      <div
        className="flash absolute bottom-[3.6rem] left-0 size-10 rounded-full"
        style={{ background: "radial-gradient(circle, #FFFFFF 0%, rgba(255,255,255,0.85) 35%, rgba(255,246,214,0) 70%)" }}
      />
      {[0, 1, 2].map((i) => (
        <div key={i} className="polaroid absolute bottom-8 left-0 h-11 w-9 rounded-[3px] bg-white p-1 pb-2.5 shadow-soft">
          <div className="size-full rounded-[2px]" style={{ background: ["#FFD6E0", "#E3F0DA", "#FFE7A8"][i] }}>
            <svg viewBox="0 0 20 20" className="size-full p-1">
              <circle cx="10" cy="8" r="4" fill="#B4D29C" />
              <path d="M3 18 C 5 12, 15 12, 17 18Z" fill="#B4D29C" />
            </svg>
          </div>
        </div>
      ))}
      <svg viewBox="0 0 10 14" className="sweat absolute bottom-[5.6rem] left-0 h-4 w-3">
        <path d="M5 0 C 8 5, 10 8, 5 14 C 0 8, 2 5, 5 0Z" fill="#9CC9E8" />
      </svg>
      <div className="bonk pointer-events-none absolute bottom-[6.6rem] left-0 h-8 w-16" style={{ transformOrigin: "28px 16px" }}>
        {[
          [4, 10],
          [24, 0],
          [42, 12],
        ].map(([px, py], i) => (
          <svg key={i} viewBox="0 0 20 20" className="absolute size-4" style={{ left: px, top: py }}>
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" fill="#F6C66B" />
          </svg>
        ))}
      </div>
    </div>
  );
}
