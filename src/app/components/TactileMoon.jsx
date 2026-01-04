'use client';

import React from 'react';

const TactileMoon = () => {
  return (
    <div className="relative w-full h-full">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFE573]/10 to-[#14BB5C]/5 rounded-full blur-3xl" />
      
      {/* Moon SVG */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-[0_0_80px_rgba(255,229,115,0.4)]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Moon Gradient */}
          <radialGradient id="moonGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE573" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#E6C34A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B89C3A" stopOpacity="0.7" />
          </radialGradient>
          
          {/* Crater Texture Filter */}
          <filter id="craterTexture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="4"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor="#FFE573"
              surfaceScale="3"
              diffuseConstant="1"
              result="light"
            >
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
            <feComposite in="light" in2="SourceGraphic" operator="in" />
          </filter>
          
          {/* Glow Filter */}
          <filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 1.0
                      0 0 0 0 0.9
                      0 0 0 0 0.45
                      0 0 0 1 0"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Shadow for 3D effect */}
          <radialGradient id="moonShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Main Moon Disc */}
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="url(#moonGradient)"
          filter="url(#craterTexture) url(#moonGlow)"
        />
        
        {/* 3D Shadow */}
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="url(#moonShadow)"
          opacity="0.4"
        />
        
        {/* Large Craters */}
        <g opacity="0.6">
          <circle cx="140" cy="160" r="25" fill="#B89C3A" filter="url(#craterTexture)">
            <animate attributeName="r" values="25;27;25" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx="240" cy="240" r="30" fill="#E6C34A" filter="url(#craterTexture)">
            <animate attributeName="r" values="30;32;30" dur="10s" repeatCount="indefinite" />
          </circle>
          <circle cx="180" cy="280" r="20" fill="#FFE573" filter="url(#craterTexture)">
            <animate attributeName="r" values="20;22;20" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="280" cy="180" r="22" fill="#B89C3A" filter="url(#craterTexture)">
            <animate attributeName="r" values="22;24;22" dur="7s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* Small Craters */}
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = Math.random() * 2 * Math.PI;
          const distance = 80 + Math.random() * 70;
          const x = 200 + distance * Math.cos(angle);
          const y = 200 + distance * Math.sin(angle);
          const size = 3 + Math.random() * 8;
          
          return (
            <circle
              key={`smallCrater-${i}`}
              cx={x}
              cy={y}
              r={size}
              fill="#E6C34A"
              opacity={0.5 + Math.random() * 0.3}
            >
              <animate
                attributeName="opacity"
                values={`${0.5 + Math.random() * 0.3};${0.8 + Math.random() * 0.2};${0.5 + Math.random() * 0.3}`}
                dur={`${5 + Math.random() * 5}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
        
        {/* Highlight */}
        <circle cx="120" cy="120" r="80" fill="white" opacity="0.05" />
        
        {/* Moon Phase Sliver (optional) */}
        <path
          d="M200,50 Q250,100 200,150 Q150,100 200,50 Z"
          fill="#FFFFFF"
          opacity="0.1"
        >
          <animate
            attributeName="opacity"
            values="0.1;0.2;0.1"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Energy Rings */}
        <circle cx="200" cy="200" r="160" fill="none" stroke="#FFE573" strokeWidth="2" opacity="0.3">
          <animate attributeName="r" values="160;170;160" dur="12s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur="12s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="200" r="180" fill="none" stroke="#14BB5C" strokeWidth="1" opacity="0.2">
          <animate attributeName="r" values="180;190;180" dur="15s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.4;0.2" dur="15s" repeatCount="indefinite" />
        </circle>
      </svg>
      
      {/* Label */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-4">
        <div className="text-white/70 text-lg tracking-widest">AKUA MOON</div>
        <div className="text-white/40 text-sm">Cratered Lunar Oracle</div>
      </div>
    </div>
  );
};

export default TactileMoon;