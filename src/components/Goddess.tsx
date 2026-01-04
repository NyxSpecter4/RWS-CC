"use client";
export const Goddess = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-40">
    <svg width="1000" height="1000" viewBox="0 0 100 100" className="translate-x-12 translate-y-10">
      <defs>
        <filter id="divineGlow"><feGaussianBlur stdDeviation="2" /><feColorMatrix type="matrix" values="0 0 0 0 0.56 0 0 0 0 0.18 0 0 0 0 0.61 0 0 0 1 0"/></filter>
      </defs>
      {/* Intricate Goddess Profile: Nose, Lips, and Chin */}
      <path 
        d="M50 5 C42 5 35 12 35 25 C35 32 38 38 42 42 C38 48 35 55 35 65 C35 80 42 92 50 95 C58 92 65 80 65 65 C65 55 62 48 58 42 C62 38 65 32 65 25 C65 12 58 5 50 5 Z M44 25 Q40 35 44 45 M56 25 Q60 35 56 45" 
        fill="#1a0b2e" filter="url(#divineGlow)" 
      />
      <path d="M40 18 Q25 30 30 75 M60 18 Q75 30 70 75" stroke="#902F9B" strokeWidth="0.3" fill="none" opacity="0.6" />
      <circle cx="50" cy="12" r="1.5" fill="#FD437D" />
    </svg>
  </div>
);
