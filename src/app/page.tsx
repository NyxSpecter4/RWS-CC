"use client";
import AutoExpertFeedback from '@/components/AutoExpertFeedback';
import { useState, useEffect } from 'react';

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

    const saved = localStorage.getItem('leila_goddess_image');
    if (saved) setGoddessImage(saved);

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
    Hilo: { action: 'Plant seeds, inoculate mushrooms', color: '#1a0b2e', title: 'New Moon - Hilo' },
    Kū: { action: 'Transplant starts (grows upward)', color: '#902F9B', title: 'Waxing Moon - Kū' },
    Akua: { action: 'PEAK MANA - Pollinate Vanilla, harvest Māmaki', color: '#FFE573', title: 'Full Moon - Akua' },
    Muku: { action: 'Rest, tool maintenance', color: '#6B21A8', title: 'Waning Moon - Muku' }
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
      <AutoExpertFeedback />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        
        {/* REAL MOON - NO EMOJI OVERLAY */}
        <div className="mb-12 relative">
          <svg width="600" height="600" viewBox="0 0 600 600" className="filter drop-shadow-[0_0_120px_rgba(255,229,115,0.9)]">
            <defs>
              {/* Multiple crater layers for depth */}
              <filter id="craters-deep">
                <feTurbulence type="fractalNoise" baseFrequency="0.08 0.12" numOctaves="15" seed="7" />
                <feDiffuseLighting lightingColor="#d4c9a8" surfaceScale="25" diffuseConstant="1.5">
                  <feDistantLight azimuth="45" elevation="55" />
                </feDiffuseLighting>
                <feComposite operator="in" in2="SourceGraphic" />
              </filter>
              
              <filter id="craters-medium">
                <feTurbulence type="fractalNoise" baseFrequency="0.05 0.08" numOctaves="12" seed="3" />
                <feDiffuseLighting lightingColor="#e8e4d0" surfaceScale="18" diffuseConstant="1.3">
                  <feDistantLight azimuth="50" elevation="60" />
                </feDiffuseLighting>
                <feComposite operator="in" in2="SourceGraphic" />
              </filter>
              
              <filter id="craters-fine">
                <feTurbulence type="fractalNoise" baseFrequency="0.15 0.20" numOctaves="8" seed="11" />
                <feDiffuseLighting lightingColor="#fef9e7" surfaceScale="8" diffuseConstant="1.0">
                  <feDistantLight azimuth="40" elevation="65" />
                </feDiffuseLighting>
                <feComposite operator="in" in2="SourceGraphic" />
              </filter>

              {/* Lunar maria (dark spots) */}
              <filter id="maria">
                <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" seed="5" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.4
                                                      0 0 0 0 0.3
                                                      0 0 0 0 0.2
                                                      0 0 0 0.6 0" />
              </filter>

              <radialGradient id="moonGrad">
                <stop offset="0%" stopColor="#fef9e7" />
                <stop offset="30%" stopColor="#f8f4d5" />
                <stop offset="70%" stopColor="#e8e0c0" />
                <stop offset="100%" stopColor="#c8c0a8" />
              </radialGradient>
            </defs>
            
            {/* Base moon sphere */}
            <circle cx="300" cy="300" r="280" fill="url(#moonGrad)" />
            
            {/* Lunar maria (dark regions) */}
            <circle cx="300" cy="300" r="280" fill="url(#moonGrad)" filter="url(#maria)" opacity="0.4" />
            
            {/* Deep craters */}
            <circle cx="300" cy="300" r="280" fill="url(#moonGrad)" filter="url(#craters-deep)" opacity="0.9" />
            
            {/* Medium craters */}
            <circle cx="300" cy="300" r="280" fill="url(#moonGrad)" filter="url(#craters-medium)" opacity="0.7" />
            
            {/* Fine detail */}
            <circle cx="300" cy="300" r="280" fill="url(#moonGrad)" filter="url(#craters-fine)" opacity="0.5" />
          </svg>
          
          {/* Phase info BELOW moon, not overlaying it */}
          <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-full">
            <div className="text-center">
              <h2 className="text-5xl font-black mb-2" style={{ color: phaseData[currentPhase].color }}>
                {phaseData[currentPhase].title}
              </h2>
              <p className="text-white/80 text-xl">JANUARY 4, 2026</p>
      <AutoExpertFeedback />
            </div>
      <AutoExpertFeedback />
          </div>
      <AutoExpertFeedback />
        </div>

        {/* GODDESS */}
        <div className="mb-8 mt-20">
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
      <AutoExpertFeedback />
            </div>
          ) : (
            <div 
              className="w-80 h-80 rounded-full bg-gradient-to-br from-[#902F9B] via-[#FD437D] to-[#FFE573] flex items-center justify-center border-8 border-[#FFE573] shadow-2xl cursor-pointer hover:scale-105 transition-transform"
              onClick={generateGoddess}
            >
              <div className="text-center p-8">
                {loading ? (
                  <>
      <AutoExpertFeedback />
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg font-bold">Manifesting Leila...</p>
                  </>
                ) : (
                  <>
                    <p className="text-white text-2xl font-bold mb-2">✨ Click to Manifest</p>
                    <p className="text-white/80">Leila Goddess</p>
                  </>
                )}
      <AutoExpertFeedback />
              </div>
      <AutoExpertFeedback />
            </div>
          )}
      <AutoExpertFeedback />
        </div>

        {/* WISDOM */}
        <div className="max-w-3xl bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl mb-8">
          <p className="text-3xl text-white/90 text-center leading-relaxed italic">"{wisdomText}"</p>
          <p className="text-center text-[#FFE573] mt-6 font-semibold text-xl">— Leila, Guardian of the \'Āina</p>
      <AutoExpertFeedback />
        </div>

        {/* ACTION */}
        <div className="bg-gradient-to-r from-[#902F9B]/20 to-[#FD437D]/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8 max-w-2xl">
          <h3 className="text-2xl font-bold text-[#FFE573] mb-4">Today's Mana Guidance</h3>
          <p className="text-white/90 text-xl">{phaseData[currentPhase].action}</p>
      <AutoExpertFeedback />
        </div>

        {/* LINKS */}
        <div className="flex gap-4">
          <a href="/debug" className="px-8 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#FD437D]/50 transition-all">
            🔧 Expert Panel Dashboard
          </a>
      <AutoExpertFeedback />
        </div>
      <AutoExpertFeedback />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
      <AutoExpertFeedback />
    </div>
  );
}
