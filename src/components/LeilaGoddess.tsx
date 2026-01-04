"use client";
import React from 'react';

interface LeilaGoddessProps {
  size?: 'sm' | 'md' | 'lg';
  isSpeaking?: boolean;
  showMana?: boolean;
}

const LeilaGoddess: React.FC<LeilaGoddessProps> = ({ 
  size = 'md', 
  isSpeaking = false,
  showMana = false
}) => {
  const sizeMap = {
    sm: '120px',
    md: '200px',
    lg: '300px'
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 400 600"
      width={sizeMap[size]}
      height={sizeMap[size]}
      className={`leila-goddess ${isSpeaking ? 'speaking' : ''}`}
      aria-label="Leila - Hawaiian-Japanese Goddess of Agriculture"
      role="img"
    >
      <defs>
        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a574" />
          <stop offset="100%" stopColor="#c89968" />
        </linearGradient>
        
        <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a0b2e" />
          <stop offset="30%" stopColor="#1a0b2e" />
          <stop offset="70%" stopColor="#2d1a4a" />
          <stop offset="100%" stopColor="#902F9B" />
        </linearGradient>
        
        <radialGradient id="manaGlow">
          <stop offset="0%" stopColor="#FFE573" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#FFE573" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFE573" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* HAIR */}
      <g className="hair">
        <path 
          d="M200,80 Q180,100 160,120 Q140,140 120,160 Q100,200 90,250 Q80,300 85,350 Q90,400 110,450 Q130,500 180,520 Q250,540 320,500 Q350,450 340,400 Q330,350 310,300 Q290,250 280,200 Q270,150 260,120 Q250,90 230,80 Z" 
          fill="url(#hairGradient)" 
          stroke="#1a0b2e" 
          strokeWidth="2"
        />
        
        <path d="M200,85 Q190,110 185,130 Q180,150 175,170 Q170,190 165,210" 
          fill="none" stroke="#902F9B" strokeWidth="1.5" strokeOpacity="0.6" />
        <path d="M210,85 Q215,110 220,130 Q225,150 230,170 Q235,190 240,210" 
          fill="none" stroke="#902F9B" strokeWidth="1.5" strokeOpacity="0.6" />
        <path d="M220,100 Q225,130 230,160 Q235,190 240,220" 
          fill="none" stroke="#6B21A8" strokeWidth="2" strokeOpacity="0.3" />
      </g>

      {/* FACE */}
      <g className="face">
        <path 
          d="M200,120 Q180,130 170,150 Q160,180 155,210 Q150,240 148,270 Q146,300 150,330 Q155,360 165,380 Q180,400 200,410 Q220,400 235,380 Q245,360 250,330 Q255,300 253,270 Q250,240 245,210 Q240,180 230,150 Q220,130 200,120 Z" 
          fill="url(#skinGradient)" 
          stroke="#b58c5a" 
          strokeWidth="2"
        />
        
        <ellipse cx="170" cy="280" rx="15" ry="10" fill="#e8c9a3" fillOpacity="0.3" />
        
        {/* EARS */}
        <path d="M165,200 Q160,210 165,220 Q170,230 175,220 Q180,210 175,200 Z" 
          fill="url(#skinGradient)" stroke="#b58c5a" strokeWidth="1.5" />
        
        {/* NOSE */}
        <path d="M185,220 Q190,215 195,220 Q195,240 193,250" 
          fill="none" stroke="#b58c5a" strokeWidth="1.5" />
        
        {/* EYES */}
        <g className="eyes">
          <ellipse cx="170" cy="240" rx="8" ry="6" fill="#3C2A21" transform="rotate(-5 170 240)" />
          <ellipse cx="170" cy="240" rx="3" ry="3" fill="#FFE573" transform="rotate(-5 170 240)" />
          
          <ellipse cx="210" cy="245" rx="6" ry="5" fill="#3C2A21" transform="rotate(2 210 245)" />
          <ellipse cx="210" cy="245" rx="2" ry="2" fill="#FFE573" transform="rotate(2 210 245)" />
          
          <path d="M162,235 Q160,230 158,232" stroke="#1a0b2e" strokeWidth="1.5" />
          <path d="M164,235 Q163,228 160,230" stroke="#1a0b2e" strokeWidth="1.5" />
        </g>

        {/* LIPS */}
        <path 
          d="M175,300 Q185,305 195,300 Q200,310 195,315 Q185,320 175,315 Q170,310 175,300 Z" 
          fill="#FD437D" 
          fillOpacity="0.6" 
          stroke="#D43072" 
          strokeWidth="1.5"
        />
      </g>

      {/* THIRD EYE MANA POINT */}
      <g className="mana-point">
        <circle cx="195" cy="195" r="8" fill="url(#manaGlow)" opacity="0.7">
          {isSpeaking && <animate attributeName="r" values="8;9;8" dur="1s" repeatCount="indefinite" />}
        </circle>
        <circle cx="195" cy="195" r="4" fill="#FFE573" stroke="#FFD700" strokeWidth="1" />
      </g>

      {/* PLUMERIA FLOWERS */}
      <g className="plumeria-adornments">
        <g transform="translate(150, 190)">
          <circle cx="0" cy="0" r="12" fill="#fef9e7" stroke="#FD437D" strokeWidth="1" />
          <circle cx="0" cy="0" r="4" fill="#FD437D" />
          <path d="M0,-12 Q4,-8 8,-12 Q12,-8 12,0 Q8,4 0,12 Q-8,4 -12,0 Q-12,-8 -8,-12 Q-4,-8 0,-12 Z" 
            fill="#fef9e7" stroke="#FD437D" strokeWidth="1" />
        </g>
        
        <g transform="translate(280, 150) rotate(20)">
          <circle cx="0" cy="0" r="10" fill="#fef9e7" stroke="#FD437D" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="#FD437D" />
          <path d="M0,-10 Q3,-7 7,-10 Q10,-7 10,0 Q7,3 0,10 Q-7,3 -10,0 Q-10,-7 -7,-10 Q-3,-7 0,-10 Z" 
            fill="#fef9e7" fillOpacity="0.9" stroke="#FD437D" strokeWidth="1" />
        </g>
        
        <g transform="translate(230, 100) rotate(-10)">
          <circle cx="0" cy="0" r="8" fill="#fef9e7" stroke="#FD437D" strokeWidth="1" />
          <circle cx="0" cy="0" r="2.5" fill="#FD437D" />
        </g>
      </g>

      {/* LEI */}
      <g className="lei">
        <path d="M165,350 Q180,340 200,340 Q220,340 235,350" 
          fill="none" stroke="#FFE573" strokeWidth="4" strokeOpacity="0.3" strokeLinecap="round" />
        <circle cx="180" cy="345" r="3" fill="#FD437D" fillOpacity="0.6" />
        <circle cx="200" cy="342" r="3" fill="#FFE573" fillOpacity="0.7" />
        <circle cx="220" cy="345" r="3" fill="#FD437D" fillOpacity="0.6" />
      </g>

      {/* NECK AND SHOULDERS */}
      <g className="neck-shoulders">
        <path d="M185,410 Q190,430 195,450 Q200,470 205,450 Q210,430 215,410" 
          fill="url(#skinGradient)" stroke="#b58c5a" strokeWidth="2" />
        <path d="M150,450 Q180,460 200,465 Q220,460 250,450" 
          fill="#d4a574" fillOpacity="0.7" stroke="#b58c5a" strokeWidth="2" />
      </g>

      {/* HAIR OVERLAY */}
      <g className="hair-overlay">
        <path d="M205,85 Q220,100 230,120 Q240,140 245,160 Q250,180 252,200" 
          fill="none" stroke="#1a0b2e" strokeWidth="1.5" strokeOpacity="0.5" />
      </g>
    </svg>
  );
};

export default LeilaGoddess;
