"use client";

import { useId } from "react";

export const LILY_ANGLES = [0, 60, 120, 180, 240, 300];

const ORDER = [1, 3, 5, 0, 2, 4];

type Props = Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
  glow?: boolean;
};

export default function Lily({ glow = false, ...rest }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden {...rest}>
      <defs>
        <linearGradient id={`${id}q`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#F4A3B9" />
          <stop offset="0.5" stopColor="#FFD6E0" />
          <stop offset="1" stopColor="#FFF5F7" />
        </linearGradient>
        <radialGradient id={`${id}c`}>
          <stop offset="0" stopColor="#FFF6D8" />
          <stop offset="1" stopColor="#F8D48C" />
        </radialGradient>
        <radialGradient id={`${id}g`}>
          <stop offset="0" stopColor="#FFD6E0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFD6E0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {glow && <circle className="lily-glow" r="98" fill={`url(#${id}g)`} />}

      <g className="lily-petals">
        {ORDER.map((i) => {
          const a = LILY_ANGLES[i];
          const back = i % 2 === 1;
          return (
            <g key={a} className="lily-petal" data-angle={a} transform={`rotate(${a})`}>
              <path
                d={back ? "M0 0 C -17 -16, -21 -52, 0 -80 C 21 -52, 17 -16, 0 0Z" : "M0 0 C -21 -18, -25 -58, 0 -90 C 25 -58, 21 -18, 0 0Z"}
                fill={`url(#${id}q)`}
                stroke="#EFA0B5"
                strokeWidth="1.2"
              />
              <path d="M0 -6 C -2 -32, 1 -58, 0 -78" fill="none" stroke="#EE96AE" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
              <g fill="#B94F6C" opacity="0.5">
                <circle cx="-5" cy="-24" r="1.6" />
                <circle cx="4.5" cy="-31" r="1.3" />
                <circle cx="-3.5" cy="-40" r="1.1" />
                <circle cx="5" cy="-19" r="1.2" />
              </g>
            </g>
          );
        })}
      </g>

      <g className="lily-heart">
        {LILY_ANGLES.map((a) => (
          <g key={a} transform={`rotate(${a + 30})`}>
            <path d="M0 0 C 1 -12, -1 -22, 0 -32" fill="none" stroke="#C7D9A8" strokeWidth="1.6" strokeLinecap="round" />
            <ellipse cx="0" cy="-34" rx="2.6" ry="5" fill="#7A4632" />
          </g>
        ))}
        <circle r="10" fill={`url(#${id}c)`} />
        <circle r="3.2" fill="#9CC08A" />
      </g>
    </svg>
  );
}
