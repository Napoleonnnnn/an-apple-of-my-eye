export default function BudShape({ gradientId }: { gradientId: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A3C58F" />
          <stop offset="0.35" stopColor="#E9EFC9" />
          <stop offset="0.6" stopColor="#FFD6E0" />
          <stop offset="1" stopColor="#F39AB2" />
        </linearGradient>
      </defs>
      <path d="M0 -2 L0 9" stroke="#86A96F" strokeWidth="3" strokeLinecap="round" />
      <path d="M0 7 C -11 15, -12 36, 0 56 C 12 36, 11 15, 0 7Z" fill={`url(#${gradientId})`} stroke="#E995AB" strokeWidth="1" />
      <path d="M0 11 C -4.5 25, -3.5 40, 0 53" fill="none" stroke="#E48BA4" strokeWidth="1" opacity="0.7" />
      <path d="M0 11 C 4.5 25, 3.5 40, 0 53" fill="none" stroke="#E48BA4" strokeWidth="0.8" opacity="0.45" />
      <path d="M0 8 C -6 9, -9 14, -8 20 C -5 15, -2 12, 0 10Z" fill="#86A96F" />
      <path d="M0 8 C 6 9, 9 14, 8 20 C 5 15, 2 12, 0 10Z" fill="#7A9E63" />
    </g>
  );
}
