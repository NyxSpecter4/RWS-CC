"use client";

interface LeilaGoddessProps {
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg' | number;
  pulseColor?: string;
  showMana?: boolean;
}

export default function LeilaGoddess({ 
  isSpeaking = false, 
  size = 'md',
  pulseColor = 'from-[#FFE573]/40 via-[#FD437D]/30 to-[#902F9B]/40',
  showMana = true 
}: LeilaGoddessProps) {
  const sizeMap = {
    sm: 120,
    md: 200,
    lg: 300
  };
  
  const actualSize = typeof size === 'number' ? size : sizeMap[size];
  
  return (
    <div className="relative" style={{ width: actualSize, height: actualSize }}>
      {isSpeaking && (
        <div className="absolute inset-0 animate-pulse">
          <div className={`absolute inset-0 bg-gradient-to-r ${pulseColor} rounded-full blur-2xl`} />
        </div>
      )}
      
      <svg width={actualSize} height={actualSize} viewBox="0 0 300 300" className="relative z-10">
        <defs>
          <filter id="goddess-aura">
            <feGaussianBlur stdDeviation="3" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.56 0 0 0 0 0.18 0 0 0 0 0.61 0 0 0 1 0"/>
          </filter>
          <linearGradient id="hair-vine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#902F9B" />
            <stop offset="50%" stopColor="#2d5016" />
            <stop offset="100%" stopColor="#1a0b2e" />
          </linearGradient>
        </defs>
        
        <ellipse cx="150" cy="120" rx="70" ry="85" fill="#1a0b2e" filter="url(#goddess-aura)" />
        <path d="M 150 40 Q 145 60 145 80 L 145 110" stroke="#4a2c4e" strokeWidth="2" fill="none" opacity="0.8" />
        <path d="M 145 110 L 140 125 Q 145 128 148 126" fill="#3a1f3e" opacity="0.9" />
        <ellipse cx="143" cy="140" rx="8" ry="4" fill="#FD437D" opacity="0.7" />
        <path d="M 135 145 Q 145 155 150 150" stroke="#2a1a2e" strokeWidth="3" fill="none" />
        <ellipse cx="160" cy="100" rx="12" ry="3" fill="#FFE573" opacity="0.5" />
        <circle cx="152" cy="75" r="3" fill="#FFE573" opacity="0.8">
          {isSpeaking && <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />}
        </circle>
        
        <path d="M 80 100 Q 60 120 70 180 Q 75 220 80 260 M 90 90 Q 70 130 80 200 Q 85 240 90 280" stroke="url(#hair-vine)" strokeWidth="4" fill="none" opacity="0.7" />
        <path d="M 220 100 Q 240 120 230 180 Q 225 220 220 260 M 210 90 Q 230 130 220 200 Q 215 240 210 280" stroke="url(#hair-vine)" strokeWidth="4" fill="none" opacity="0.7" />
        
        <circle cx="190" cy="85" r="8" fill="#FFE573" opacity="0.6" />
        <circle cx="200" cy="90" r="6" fill="#FD437D" opacity="0.6" />
        <circle cx="185" cy="95" r="5" fill="#902F9B" opacity="0.6" />
        
        <path d="M 110 180 L 110 240 M 190 180 L 190 240" stroke="#1a0b2e" strokeWidth="25" opacity="0.6" />
      </svg>
      
      {showMana && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[#FFE573] rounded-full animate-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.6
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
