export const scrollState = {
  velocity: 0,
};

export const stemState: {
  tipY: number;

  xAt: ((y: number) => number) | null;
} = { tipY: -Infinity, xAt: null };

export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
export const MOTION_OK_QUERY = "(prefers-reduced-motion: no-preference)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;
}

export type BurstDetail = { x: number; y: number; count?: number; power?: number };

export function burstPetals(detail: BurstDetail) {
  window.dispatchEvent(new CustomEvent<BurstDetail>("petal-burst", { detail }));
}

export const LILY_BLOOM = "lily-bloom";
export const LILY_CLOSE = "lily-close";

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const isPhone = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

export const blurFrom = (px: number) => (isPhone() ? {} : { filter: `blur(${px}px)` });
export const blurTo = () => (isPhone() ? {} : { filter: "blur(0px)" });
