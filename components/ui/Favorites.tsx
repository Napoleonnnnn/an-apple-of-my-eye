export type FavoriteKind = "pineapple" | "f1" | "mirror" | "compact" | "camera" | "matcha" | "swatch" | "seblak" | "cake" | "book" | "moon" | "phone";

const box = { viewBox: "0 0 64 64", className: "fav size-full overflow-visible" } as const;

export default function Favorite({ kind }: { kind: FavoriteKind }) {
  switch (kind) {
    case "pineapple":
      return (
        <svg {...box}>
          <ellipse className="fav-shadow" cx="32" cy="62" rx="14" ry="2.2" fill="#5C3A2E" opacity="0.12" />
          <g className="fav-bounce">
            <g className="fav-crown">
              <path d="M32 26 C 28 18, 22 14, 16 13 C 22 18, 25 22, 27 27Z" fill="#6FA35A" />
              <path d="M32 26 C 36 18, 42 14, 48 13 C 42 18, 39 22, 37 27Z" fill="#6FA35A" />
              <path d="M32 27 C 29 18, 30 9, 32 2 C 34 9, 35 18, 32 27Z" fill="#86B86F" />
              <path d="M32 27 C 26 21, 24 14, 25 8 C 29 14, 31 20, 33 26Z" fill="#7DAE66" />
              <path d="M32 27 C 38 21, 40 14, 39 8 C 35 14, 33 20, 31 26Z" fill="#7DAE66" />
            </g>
            <ellipse cx="32" cy="44" rx="14" ry="17" fill="#F6C24B" stroke="#E0A33A" strokeWidth="1.2" />
            <path d="M22 34 L42 54 M20 42 L36 58 M26 30 L44 48 M42 34 L22 54 M44 42 L28 58 M38 30 L20 48" stroke="#D99A33" strokeWidth="1.2" opacity="0.8" />
            <path d="M24 38 C 23 34, 25 31, 28 30" stroke="#FFE7A0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "f1":
      return (
        <svg {...box}>
          <g className="fav-speedlines" stroke="#F4A3B9" strokeWidth="1.8" strokeLinecap="round">
            <path d="M0 30 H7" />
            <path d="M-2 36 H5" />
          </g>
          <g className="fav-drive">
            <path d="M8 31 L20 30 L26 26 L36 25 L42 29 L60 31 L60 35 L8 36Z" fill="#D63E5B" />
            <path d="M5 26 L12 26 L12 37 L5 37Z" fill="#6E1F2E" />
            <path d="M3 25 H14" stroke="#6E1F2E" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M56 35 L63 35 L63 38 L52 38Z" fill="#6E1F2E" />
            <path d="M28 26 C 31 22, 36 22, 38 26" fill="none" stroke="#2B2B33" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="33" cy="25" r="2.6" fill="#F6C66B" />
            <path d="M22 32 H50" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M44 31 H54" stroke="#FFD6E0" strokeWidth="1.4" strokeLinecap="round" />
            <g className="fav-wheel">
              <circle cx="16" cy="37" r="5.5" fill="#2B2B33" />
              <circle cx="16" cy="37" r="2" fill="#D63E5B" />
            </g>
            <g className="fav-wheel">
              <circle cx="50" cy="38" r="4.8" fill="#2B2B33" />
              <circle cx="50" cy="38" r="1.8" fill="#D63E5B" />
            </g>
          </g>
        </svg>
      );
    case "mirror":
      return (
        <svg {...box}>
          <defs>
            <clipPath id="fav-mirror-glass">
              <ellipse cx="32" cy="24" rx="14" ry="17" />
            </clipPath>
          </defs>
          <g className="fav-tilt">
            <rect x="28.5" y="40" width="7" height="20" rx="3.5" fill="#F4A3B9" />
            <rect x="27" y="38" width="10" height="5" rx="2" fill="#E8C07A" />
            <ellipse cx="32" cy="24" rx="18" ry="21" fill="#FFD6E0" stroke="#F4A3B9" strokeWidth="1.4" />
            <ellipse cx="32" cy="24" rx="14" ry="17" fill="#E3F2FF" />
            <g clipPath="url(#fav-mirror-glass)">
              <path className="fav-shine" d="M14 30 L30 6 L36 6 L20 30Z" fill="#FFFFFF" opacity="0.8" />
            </g>
            <circle cx="20" cy="8" r="2" fill="#FFFFFF" />
            <circle cx="46" cy="14" r="1.6" fill="#FFFFFF" />
          </g>
          <path className="fav-twinkle" d="M54 34 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z" fill="#F6C66B" />
        </svg>
      );
    case "compact":
      return (
        <svg {...box}>
          <g className="fav-lid">
            <ellipse cx="32" cy="22" rx="22" ry="7" fill="#F4A3B9" />
            <ellipse cx="32" cy="20" rx="22" ry="7" fill="#FFD6E0" stroke="#F4A3B9" strokeWidth="1.2" />
            <ellipse cx="32" cy="20" rx="15" ry="4.6" fill="#E3F2FF" opacity="0.85" />
            <path d="M24 19 L30 17" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
          </g>
          <path d="M10 40 C 10 48, 54 48, 54 40 L54 44 C 54 53, 10 53, 10 44Z" fill="#E07A98" />
          <ellipse cx="32" cy="40" rx="22" ry="7" fill="#FFD6E0" stroke="#F4A3B9" strokeWidth="1.2" />
          <ellipse cx="32" cy="40" rx="15" ry="4.4" fill="#F6C9B4" />
          <ellipse className="fav-puff" cx="40" cy="38" rx="6" ry="2.4" fill="#FFFFFF" opacity="0.9" />
        </svg>
      );
    case "camera":
      return (
        <svg {...box}>
          <g className="fav-tilt">
            <rect x="6" y="18" width="52" height="36" rx="7" fill="#5C3A2E" />
            <rect x="16" y="11" width="16" height="9" rx="3" fill="#5C3A2E" />
            <rect x="44" y="23" width="8" height="5" rx="1.5" fill="#F6C66B" />
            <circle cx="32" cy="36" r="13" fill="#FFD6E0" />
            <g className="fav-lens">
              <circle cx="32" cy="36" r="8.5" fill="#2B2B33" />
              <path d="M32 28 L34 34 L32 36Z M40 36 L34 38 L32 36Z M32 44 L30 38 L32 36Z M24 36 L30 34 L32 36Z" fill="#55555F" />
            </g>
            <circle cx="29" cy="33" r="2.2" fill="#FFFFFF" opacity="0.8" />
          </g>
          <circle className="fav-flash" cx="48" cy="25" r="9" fill="#FFFFFF" />
          <path className="fav-twinkle" d="M56 6 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z" fill="#F6C66B" />
        </svg>
      );
    case "matcha":
      return (
        <svg {...box}>
          <path className="fav-straw" d="M40 2 L36 26" stroke="#FFD6E0" strokeWidth="4" strokeLinecap="round" />
          <path d="M18 14 L46 14 L42 58 C 41 61, 23 61, 22 58Z" fill="#FFFFFF" stroke="#C9B8AE" strokeWidth="1.6" />
          <path d="M19.5 26 Q 26 22, 32 26 T 44.5 26 L42 58 C 41 61, 23 61, 22 58Z" fill="#9CC08A" />
          <path d="M20.5 34 L43.6 34" stroke="#E5EDC7" strokeWidth="5" />
          <rect className="fav-ice" x="25" y="38" width="7" height="7" rx="2" fill="#FFFFFF" opacity="0.8" />
          <rect className="fav-ice fav-ice-2" x="33" y="44" width="6" height="6" rx="2" fill="#FFFFFF" opacity="0.8" />
          <circle className="fav-bubble" cx="28" cy="54" r="1.6" fill="#FFFFFF" />
          <circle className="fav-bubble fav-bubble-2" cx="37" cy="55" r="1.3" fill="#FFFFFF" />
        </svg>
      );
    case "swatch":
      return (
        <svg {...box}>
          <circle className="fav-ripple" cx="32" cy="25" r="10" fill="none" stroke="#FFD6E0" strokeWidth="2.5" />
          <circle className="fav-ripple fav-ripple-2" cx="32" cy="25" r="10" fill="none" stroke="#FFD6E0" strokeWidth="2.5" />
          <g className="fav-tilt">
            <rect x="12" y="4" width="40" height="56" rx="6" fill="#FFFFFF" stroke="#F1D9DF" strokeWidth="1.4" />
            <rect className="fav-pulse" x="16" y="8" width="32" height="34" rx="3" fill="#FFD6E0" />
            <rect x="16" y="47" width="18" height="3" rx="1.5" fill="#6E1F2E" opacity="0.55" />
            <rect x="16" y="53" width="11" height="2.5" rx="1.25" fill="#5C3A2E" opacity="0.3" />
          </g>
        </svg>
      );
    case "seblak":
      return (
        <svg {...box}>
          <path
            className="fav-steam"
            d="M22 20 c -3 -4, 3 -6, 0 -10 c -2 -3, 2 -5, 0 -8"
            fill="none"
            stroke="#E7CFC7"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            className="fav-steam fav-steam-2"
            d="M32 20 c -3 -4, 3 -6, 0 -10 c -2 -3, 2 -5, 0 -8"
            fill="none"
            stroke="#E7CFC7"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            className="fav-steam fav-steam-3"
            d="M42 20 c -3 -4, 3 -6, 0 -10 c -2 -3, 2 -5, 0 -8"
            fill="none"
            stroke="#E7CFC7"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M6 26 L58 26 C 58 44, 46 56, 32 56 C 18 56, 6 44, 6 26Z" fill="#FFFFFF" stroke="#E9D7CF" strokeWidth="1.4" />
          <ellipse cx="32" cy="26" rx="26" ry="5" fill="#E8573B" />
          <path d="M18 25 c 3 -3, 7 -3, 9 0 M34 27 c 3 -3, 7 -3, 9 0" stroke="#FFF3D6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path className="fav-chili" d="M44 23 l6 -3" stroke="#B5272A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 32 L54 32" stroke="#FFD6E0" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "cake":
      return (
        <svg {...box}>
          <path d="M6 52 L58 52 L58 30 L6 40Z" fill="#FFF0C9" stroke="#EBD7A6" strokeWidth="1.2" />
          <path d="M6 40 L58 30 L54 24 L10 34Z" fill="#FFD6E0" />
          <path d="M6 52 L58 52 L58 47 L6 47Z" fill="#C79A6B" />
          <g className="fav-cherry">
            <circle cx="44" cy="23" r="4.5" fill="#D63E5B" />
            <circle cx="42.5" cy="21.5" r="1.2" fill="#FFFFFF" opacity="0.7" />
            <path d="M44 19 c 1 -3, 3 -4, 5 -4" stroke="#86A96F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "book":
      return (
        <svg {...box}>
          <path d="M32 12 C 24 7, 12 7, 4 10 L4 50 C 12 47, 24 47, 32 52Z" fill="#FFFDF8" stroke="#D9C8BE" strokeWidth="1.2" />
          <path d="M32 12 C 40 7, 52 7, 60 10 L60 50 C 52 47, 40 47, 32 52Z" fill="#FFFDF8" stroke="#D9C8BE" strokeWidth="1.2" />
          <path d="M9 20 H27 M9 26 H27 M9 32 H24 M37 20 H55 M37 26 H52 M37 32 H55" stroke="#E5D6CD" strokeWidth="1.4" strokeLinecap="round" />
          <path className="fav-page" d="M32 12 C 40 7, 52 7, 60 10 L60 50 C 52 47, 40 47, 32 52Z" fill="#FFF6EE" stroke="#D9C8BE" strokeWidth="1.2" />
          <path d="M4 50 C 12 47, 24 47, 32 52 C 40 47, 52 47, 60 50 L60 54 C 52 51, 40 51, 32 56 C 24 51, 12 51, 4 54Z" fill="#6E1F2E" />
          <path d="M48 8 L48 22 L51 19 L54 22 L54 7" fill="#FFD6E0" />
        </svg>
      );
    case "moon":
      return (
        <svg {...box}>
          <path
            className="fav-rock"
            d="M40 6 C 22 6, 12 22, 14 36 C 16 52, 32 62, 48 56 C 32 54, 24 40, 26 28 C 28 16, 34 10, 40 6Z"
            fill="#FFE7A8"
            stroke="#F2C766"
            strokeWidth="1.2"
          />
          <path className="fav-twinkle" d="M50 14 l1.4 3.6 3.6 1.4 -3.6 1.4 -1.4 3.6 -1.4 -3.6 -3.6 -1.4 3.6 -1.4z" fill="#FFD6E0" />
          <path className="fav-twinkle fav-twinkle-2" d="M56 36 l1 2.6 2.6 1 -2.6 1 -1 2.6 -1 -2.6 -2.6 -1 2.6 -1z" fill="#FFD6E0" />
          <path className="fav-twinkle fav-twinkle-3" d="M8 12 l1 2.6 2.6 1 -2.6 1 -1 2.6 -1 -2.6 -2.6 -1 2.6 -1z" fill="#F6C66B" />
        </svg>
      );
    case "phone":
      return (
        <svg {...box}>
          <g className="fav-buzz">
            <rect x="16" y="2" width="32" height="60" rx="7" fill="#6E1F2E" />
            <rect x="19" y="7" width="26" height="50" rx="4" fill="#FFD6E0" />
            <circle cx="32" cy="30" r="8" fill="#FFFFFF" opacity="0.9" />
            <path d="M29.5 26 L36 30 L29.5 34Z" fill="#6E1F2E" />
            <path d="M23 48 H41" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          </g>
          <g className="fav-notif">
            <rect x="34" y="-6" width="26" height="11" rx="5.5" fill="#FFFFFF" stroke="#F4A3B9" strokeWidth="1.2" />
            <rect x="37" y="-3.5" width="6" height="6" rx="1.5" fill="#FFD6E0" />
            <rect x="45" y="-2.5" width="12" height="1.8" rx="0.9" fill="#E3C9C9" />
            <rect x="45" y="0.6" width="8" height="1.8" rx="0.9" fill="#EFDCDC" />
          </g>
        </svg>
      );
  }
}
