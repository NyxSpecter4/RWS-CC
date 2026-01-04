"use client";

interface LeilaGoddessProps {
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showMana?: boolean;
}

export default function LeilaGoddess({ 
  isSpeaking = false, 
  size = 'md',
  showMana = true 
}: LeilaGoddessProps) {
  const sizes = { sm: 120, md: 200, lg: 300 };
  const w = sizes[size];
  
  return (
    <div className="relative" style={{ width: w, height: w }}>
      {isSpeaking && (
        <div className="absolute inset-0 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFE573]/30 via-[#FD437D]/20 to-[#902F9B]/30 rounded-full blur-3xl" />
        </div>
      )}
      
      <svg width={w} height={w} viewBox="0 0 300 300">
        <defs>
          <filter id="goddess-aura">
            <feGaussianBlur stdDeviation="4" />
            <feColorMatrix values="0 0 0 0 0.56 0 0 0 0 0.18 0 0 0 0 0.61 0 0 0 1 0"/>
          </filter>
          <linearGradient id="vine-hair" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#902F9B" />
            <stop offset="40%" stopColor="#2d5016" />
            <stop offset="100%" stopColor="#1a0b2e" />
          </linearGradient>
          <radialGradient id="skin-glow">
            <stop offset="0%" stopColor="#3a2a4e" />
            <stop offset="100%" stopColor="#1a0b2e" />
          </radialGradient>
        </defs>
        
        {/* Head */}
        <ellipse cx="150" cy="130" rx="75" ry="90" fill="url(#skin-glow)" filter="url(#goddess-aura)" />
        
        {/* Forehead to nose elegant line */}
        <path d="M 150 45 Q 148 70 148 100 L 148 125" stroke="#5a4a6e" strokeWidth="3" fill="none" opacity="0.9" />
        
        {/* Nose */}
        <path d="M 148 125 L 142 142 Q 147 145 152 143" fill="#4a3a5e" opacity="0.95" />
        
        {/* Elegant lips (sacred smile of Laka) */}
        <path d="M 138 158 Q 148 165 158 158" stroke="#FD437D" strokeWidth="4" fill="none" opacity="0.8" />
        <ellipse cx="148" cy="160" rx="10" ry="5" fill="#FD437D" opacity="0.6" />
        
        {/* Chin */}
        <path d="M 130 165 Q 148 180 165 165" stroke="#2a1a3e" strokeWidth="4" fill="none" opacity="0.9" />
        
        {/* Eye (closed in meditation) */}
        <ellipse cx="165" cy="110" rx="15" ry="4" fill="#FFE573" opacity="0.6">
          {isSpeaking && <animate attributeName="ry" values="4;2;4" dur="3s" repeatCount="indefinite" />}
        </ellipse>
        
        {/* Third eye - MANA POINT */}
        <circle cx="152" cy="80" r="5" fill="#FFE573" opacity="0.9">
          {isSpeaking && <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />}
        </circle>
        
        {/* Flowing vine hair - LEFT SIDE */}
        <path d="M 75 110 Q 50 130 60 200 Q 65 245 70 285" stroke="url(#vine-hair)" strokeWidth="6" fill="none" opacity="0.8" />
        <path d="M 85 100 Q 60 140 70 210 Q 75 255 80 290" stroke="url(#vine-hair)" strokeWidth="5" fill="none" opacity="0.7" />
        <path d="M 95 95 Q 70 150 80 220 Q 85 265 90 295" stroke="url(#vine-hair)" strokeWidth="4" fill="none" opacity="0.6" />
        
        {/* Flowing vine hair - RIGHT SIDE */}
        <path d="M 225 110 Q 250 130 240 200 Q 235 245 230 285" stroke="url(#vine-hair)" strokeWidth="6" fill="none" opacity="0.8" />
        <path d="M 215 100 Q 240 140 230 210 Q 225 255 220 290" stroke="url(#vine-hair)" strokeWidth="5" fill="none" opacity="0.7" />
        <path d="M 205 95 Q 230 150 220 220 Q 215 265 210 295" stroke="url(#vine-hair)" strokeWidth="4" fill="none" opacity="0.6" />
        
        {/* Plumeria hair ornaments */}
        <circle cx="195" cy="90" r="10" fill="#FFE573" opacity="0.7" />
        <circle cx="207" cy="96" r="8" fill="#FD437D" opacity="0.7" />
        <circle cx="190" cy="102" r="7" fill="#902F9B" opacity="0.7" />
        <circle cx="200" cy="85" r="6" fill="#ffffff" opacity="0.5" />
        
        {/* Neck/shoulders */}
        <path d="M 105 200 L 105 260 M 195 200 L 195 260" stroke="url(#skin-glow)" strokeWidth="35" opacity="0.7" />
      </svg>
      
      {showMana && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[#FFE573] rounded-full animate-float"
              style={{
                left: `${15 + i * 12}%`,
                top: `${25 + (i % 4) * 18}%`,
                animationDelay: `${i * 0.4}s`,
                opacity: 0.7
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
