"use client";
export const Moon = () => (
  <div className="relative z-20">
    <svg width="450" height="450" viewBox="0 0 400 400" className="filter drop-shadow-[0_0_120px_rgba(255,229,115,0.35)]">
      <defs>
        <filter id="craters"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="6" /><feDiffuseLighting lightingColor="#fcf3cf" surfaceScale="5"><feDistantLight azimuth="45" elevation="65" /></feDiffuseLighting><feComposite operator="in" in2="SourceGraphic"/></filter>
        <radialGradient id="mG"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#d5d8dc" /></radialGradient>
      </defs>
      <circle cx="200" cy="200" r="185" fill="url(#mG)" filter="url(#craters)" />
    </svg>
  </div>
);
