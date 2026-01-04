"use client";
interface LeilaAvatarProps {
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  pulseColor?: string;
}
export default function LeilaAvatar({ isSpeaking = false, size = 'md', pulseColor = 'from-[#FFE573]/40 via-[#FD437D]/30 to-[#902F9B]/40' }: LeilaAvatarProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {isSpeaking && (
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${pulseColor} animate-pulse opacity-60`}></div>
      )}
      
      <div className="relative flex items-center justify-center pointer-events-none opacity-60 w-full h-full">
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <defs>
            <filter id="divineAura"><feGaussianBlur stdDeviation="2" /><feColorMatrix type="matrix" values="0 0 0 0 0.56 0 0 0 0 0.18 0 0 0 0 0.61 0 0 0 1 0"/></filter>
          </defs>
          <path d="M100 20 C85 20 75 35 75 55 C75 60 78 65 82 70 C75 80 72 95 72 110 C72 135 85 160 100 175 C115 160 128 135 128 110 C128 95 125 80 118 70 C122 65 125 60 125 55 C125 35 115 20 100 20 Z" fill="#1a0b2e" filter="url(#divineAura)" />
          <path d="M85 55 Q70 75 75 140 M115 55 Q130 75 125 140" stroke="#902F9B" strokeWidth="0.5" fill="none" opacity="0.6" />
          <circle cx="100" cy="35" r="2" fill="#FD437D" />
        </svg>
      </div>
    </div>
  );
}
