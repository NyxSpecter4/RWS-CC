"use client";
import { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';

export default function CelestialAltar() {
  const [currentPhase, setCurrentPhase] = useState<'Hilo' | 'Kū' | 'Akua' | 'Muku'>('Akua');
  const [goddessImage, setGoddessImage] = useState<string>('');
  const [wisdomText, setWisdomText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const day = new Date().getDate();
    if (day <= 7) setCurrentPhase('Hilo');
    else if (day <= 14) setCurrentPhase('Kū');
    else if (day <= 21) setCurrentPhase('Akua');
    else setCurrentPhase('Muku');

    // Load saved goddess from localStorage
    const saved = localStorage.getItem('leila_goddess_image');
    if (saved) {
      setGoddessImage(saved);
    }

    getLeilaWisdom();
  }, []);

  const generateGoddess = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-goddess', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGoddessImage(data.imageUrl);
        localStorage.setItem('leila_goddess_image', data.imageUrl);
      }
    } catch (e) {
      console.error('Goddess generation failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const getLeilaWisdom = async () => {
    try {
      const res = await fetch('/api/leila-wisdom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: currentPhase })
      });
      const data = await res.json();
      setWisdomText(data.wisdom);
    } catch (e) {
      setWisdomText('Aloha, Kahu. The Mana of the \'āina flows strong today. 🌺');
    }
  };

  const phaseData = {
    Hilo: { emoji: '🌑', action: 'Plant seeds, inoculate mushrooms', color: '#1a0b2e' },
    Kū: { emoji: '🌒', action: 'Transplant starts (grows upward)', color: '#902F9B' },
    Akua: { emoji: '🌕', action: 'PEAK MANA - Pollinate Vanilla, harvest Māmaki', color: '#FFE573' },
    Muku: { emoji: '🌘', action: 'Rest, tool maintenance', color: '#6B21A8' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] relative overflow-hidden">
      
      {/* Mana Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-[#FFE573] to-[#FD437D]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite alternate`,
              opacity: 0.4
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        
        {/* MOON */}
        <div className="mb-12 relative">
          <svg width="500" height="500" viewBox="0 0 500 500" className="filter drop-shadow-[0_0_100px_rgba(255,229,115,0.8)]">
            <defs>
              <filter id="craters">
                <feTurbulence type="fractalNoise" baseFrequency="0.04 0.06" numOctaves="10" seed="2" />
                <feDiffuseLighting lightingColor="#fef9e7" surfaceScale="12" diffuseConstant="1.2">
                  <feDistantLight azimuth="45" elevation="60" />
                </feDiffuseLighting>
                <feComposite operator="in" in2="SourceGraphic" />
                <feGaussianBlur stdDeviation="0.6" />
              </filter>
              <radialGradient id="moonGrad">
                <stop offset="0%" stopColor="#fef9e7" />
                <stop offset="40%" stopColor="#f8f4d5" />
                <stop offset="100%" stopColor="#d4c9a8" />
              </radialGradient>
            </defs>
            <circle cx="250" cy="250" r="220" fill="url(#moonGrad)" filter="url(#craters)" />
          </svg>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-center">
              <div className="text-9xl mb-4">{phaseData[currentPhase].emoji}</div>
              <h2 className="text-5xl font-black text-white mb-2" style={{ color: phaseData[currentPhase].color }}>
                {currentPhase}
              </h2>
              <p className="text-white/80 text-lg">PEAK MANA • JANUARY 2026</p>
            </div>
          </div>
        </div>

        {/* GODDESS - STAYS VISIBLE */}
        <div className="mb-8">
          {goddessImage ? (
            <div className="w-80 h-80 rounded-full overflow-hidden border-8 border-[#FFE573] shadow-2xl shadow-[#902F9B]/50 bg-gradient-to-br from-[#902F9B] to-[#FD437D]">
              <img 
                src={goddessImage} 
                alt="Leila - Hawaiian Goddess" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div 
              className="w-80 h-80 rounded-full bg-gradient-to-br from-[#902F9B] via-[#FD437D] to-[#FFE573] flex items-center justify-center border-8 border-[#FFE573] shadow-2xl cursor-pointer hover:scale-105 transition-transform"
              onClick={generateGoddess}
            >
              <div className="text-center p-8">
                {loading ? (
                  <>
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg font-bold">Manifesting Leila...</p>
                  </>
                ) : (
                  <>
                    <p className="text-white text-2xl font-bold mb-2">✨ Click to Manifest</p>
                    <p className="text-white/80">Leila Goddess</p>
                    <p className="text-white/60 text-sm mt-2">(AI-generated beauty)</p>
                  </>
                )}
              </div>
            </div>
          )}
          
          {goddessImage && (
            <button
              onClick={generateGoddess}
              className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-lg hover:bg-white/30 transition-all"
            >
              Generate New Goddess
            </button>
          )}
        </div>

        {/* WISDOM */}
        <div className="max-w-3xl bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl mb-8">
          <p className="text-3xl text-white/90 text-center leading-relaxed italic">
            "{wisdomText || 'The \'āina speaks through the phases of Mahina. Listen to her rhythm, and abundance will follow.'}"
          </p>
          <p className="text-center text-[#FFE573] mt-6 font-semibold text-xl">— Leila, Guardian of the \'Āina</p>
        </div>

        {/* ACTION */}
        <div className="bg-gradient-to-r from-[#902F9B]/20 to-[#FD437D]/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8 max-w-2xl">
          <h3 className="text-2xl font-bold text-[#FFE573] mb-4">Today's Mana Guidance</h3>
          <p className="text-white/90 text-xl">{phaseData[currentPhase].action}</p>
        </div>

        {/* LINKS */}
        <div className="flex gap-4">
          <a href="/debug" className="px-8 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#FD437D]/50 transition-all">
            🔧 Expert Panel & Research Dashboard
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
