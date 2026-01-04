'use client';

import React from 'react';

const GoddessSilhouette = () => {
  return (
    <div className="relative w-full h-full">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#902F9B]/20 to-[#14BB5C]/10 rounded-full blur-3xl" />
      
      {/* Goddess SVG */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-[0_0_60px_rgba(144,47,155,0.7)]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Divine Gradient */}
          <radialGradient id="goddessGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#902F9B" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#5A1E6B" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1a0b2e" stopOpacity="0.5" />
          </radialGradient>
          
          {/* Glow Filter */}
          <filter id="goddessGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.56
                      0 0 0 0 0.18
                      0 0 0 0 0.61
                      0 0 0 1 0"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Texture Filter */}
          <filter id="texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
          </filter>
        </defs>
        
        {/* Main Silhouette */}
        <g filter="url(#goddessGlow)">
          {/* Head */}
          <path
            d="M200,80 C240,60 300,70 320,120 C340,170 330,220 300,250 C270,280 230,290 200,280 C170,290 130,280 100,250 C70,220 60,170 80,120 C100,70 160,60 200,80 Z"
            fill="url(#goddessGradient)"
            opacity="0.9"
          />
          
          {/* Body */}
          <path
            d="M200,280 Q260,300 280,360 Q300,420 260,460 Q220,500 200,500 Q180,500 140,460 Q100,420 120,360 Q140,300 200,280 Z"
            fill="url(#goddessGradient)"
            opacity="0.8"
          />
          
          {/* Flowing Hair Left */}
          <path
            d="M100,250 C80,220 60,180 40,200 C20,220 30,260 50,280 C70,300 90,290 100,280"
            fill="#5A1E6B"
            opacity="0.7"
          />
          
          {/* Flowing Hair Right */}
          <path
            d="M300,250 C320,220 340,180 360,200 C380,220 370,260 350,280 C330,300 310,290 300,280"
            fill="#5A1E6B"
            opacity="0.7"
          />
          
          {/* Lei */}
          <circle cx="200" cy="140" r="30" fill="none" stroke="#FFE573" strokeWidth="4" opacity="0.6">
            <animate attributeName="r" values="30;32;30" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* Divine Eyes */}
        <circle cx="170" cy="130" r="8" fill="#FFE573" opacity="0.9">
          <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="230" cy="130" r="8" fill="#FFE573" opacity="0.9">
          <animate attributeName="r" values="8;10;8" dur="2.5s" repeatCount="indefinite" />
        </circle>
        
        {/* Energy Particles */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15) * (Math.PI / 180);
          const radius = 140 + Math.random() * 60;
          const x = 200 + radius * Math.cos(angle);
          const y = 200 + radius * Math.sin(angle);
          const size = 2 + Math.random() * 4;
          
          return (
            <circle
              key={`particle-${i}`}
              cx={x}
              cy={y}
              r={size}
              fill="#902F9B"
              opacity={0.3 + Math.random() * 0.5}
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur={`${3 + Math.random() * 3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values={`${size};${size + 2};${size}`}
                dur={`${4 + Math.random() * 4}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </svg>
      
      {/* Label */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-4">
        <div className="text-white/70 text-lg tracking-widest">LEILA</div>
        <div className="text-white/40 text-sm">Hawaiian Goddess of the 'Aina</div>
      </div>
    </div>
  );
};

export default GoddessSilhouette;