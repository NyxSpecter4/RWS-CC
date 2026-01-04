"use client";
import { useState, useEffect } from 'react';
import { Moon, Droplets, Thermometer, Leaf } from 'lucide-react';

export default function CelestialAltar() {
  const [currentPhase, setCurrentPhase] = useState<'Hilo' | 'Kū' | 'Akua' | 'Muku'>('Akua');
  const [goddessImage, setGoddessImage] = useState<string>('');
  const [wisdomText, setWisdomText] = useState('');
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    // Get current lunar phase (simplified - use actual lunar calc later)
    const day = new Date().getDate();
    if (day <= 7) setCurrentPhase('Hilo');
    else if (day <= 14) setCurrentPhase('Kū');
    else if (day <= 21) setCurrentPhase('Akua');
    else setCurrentPhase('Muku');

    // Generate goddess with DALL-E
    generateGoddess();
    
    // Get Leila's wisdom
    getLeilaWisdom();
  }, []);

  const generateGoddess = async () => {
    try {
      const res = await fetch('/api/generate-goddess', { method: 'POST' });
      const data = await res.json();
      if (data.imageUrl) setGoddessImage(data.imageUrl);
    } catch (e) {
      console.error('Goddess generation failed:', e);
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
      
      {/* Mana Particles Background */}
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        
        {/* Moon with Current Phase */}
        <div className="mb-12 relative">
          <svg width="400" height="400" viewBox="0 0 400 400" className="filter drop-shadow-[0_0_80px_rgba(255,229,115,0.6)]">
            <defs>
              <filter id="craters">
                <feTurbulence type="fractalNoise" baseFrequency="0.03 0.05" numOctaves="8" seed="2" />
                <feDiffuseLighting lightingColor="#fef9e7" surfaceScale="8" diffuseConstant="1">
                  <feDistantLight azimuth="45" elevation="60" />
                </feDiffuseLighting>
                <feComposite operator="in" in2="SourceGraphic" />
                <feGaussianBlur stdDeviation="0.8" />
              </filter>
              <radialGradient id="moonGrad">
                <stop offset="0%" stopColor="#fef9e7" />
                <stop offset="40%" stopColor="#f8f4d5" />
                <stop offset="100%" stopColor="#d4c9a8" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="180" fill="url(#moonGrad)" filter="url(#craters)" />
          </svg>
          
          {/* Phase Indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-center">
              <div className="text-8xl mb-4">{phaseData[currentPhase].emoji}</div>
              <h2 className="text-4xl font-black text-white mb-2" style={{ color: phaseData[currentPhase].color }}>
                {currentPhase}
              </h2>
              <p className="text-white/80 text-sm">PEAK MANA • JANUARY</p>
            </div>
          </div>
        </div>

        {/* Goddess Portal */}
        <div className="mb-8">
          {goddessImage ? (
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#FFE573] shadow-2xl shadow-[#902F9B]/50">
              <img src={goddessImage} alt="Leila - Hawaiian Goddess" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#902F9B] to-[#FD437D] flex items-center justify-center border-4 border-[#FFE573] shadow-2xl">
              <p className="text-white text-sm">Manifesting goddess...</p>
            </div>
          )}
        </div>

        {/* Leila's Wisdom */}
        <div className="max-w-2xl bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <p className="text-2xl text-white/90 text-center leading-relaxed italic">
            "{wisdomText || 'The \'āina speaks through the phases of Mahina. Listen to her rhythm, and abundance will follow.'}"
          </p>
          <p className="text-center text-[#FFE573] mt-4 font-semibold">— Leila, Guardian of the \'Āina</p>
        </div>

        {/* Current Phase Action */}
        <div className="bg-gradient-to-r from-[#902F9B]/20 to-[#FD437D]/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-[#FFE573] mb-3">Today's Mana Guidance</h3>
          <p className="text-white/80 text-lg">{phaseData[currentPhase].action}</p>
        </div>

        {/* Hawaiian Wisdom Cards */}
        <div className="grid grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">🌿</div>
            <h4 className="text-lg font-bold text-white mb-2">Ahupua'a Wisdom</h4>
            <p className="text-white/70 text-sm">Ancient land division teaches balance from mountains to sea</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">💧</div>
            <h4 className="text-lg font-bold text-white mb-2">Water is Life</h4>
            <p className="text-white/70 text-sm">Every drop carries Mana. Conserve and honor this sacred resource</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">🌋</div>
            <h4 className="text-lg font-bold text-white mb-2">Pele's Gift</h4>
            <p className="text-white/70 text-sm">Volcanic soil is rich with nutrients. Work with the land, not against it</p>
          </div>
        </div>

        {/* Divine Audit Button */}
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="mt-12 px-8 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#FD437D]/50 transition-all"
        >
          EVALUATE MANA
        </button>

        {/* Links */}
        <div className="mt-8 flex gap-4">
          <a href="/debug" className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
            🔧 Debug Dashboard
          </a>
        </div>
      </div>

      {/* Glassmorphism Divine Audit Panel */}
      {showPanel && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white/10 backdrop-blur-2xl border-l border-white/20 shadow-2xl p-8 z-50 animate-slide-in">
          <button onClick={() => setShowPanel(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">✕</button>
          
          <h2 className="text-2xl font-bold text-[#FFE573] mb-6">Divine Audit</h2>
          
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm flex items-center gap-2">
                  <Thermometer className="w-4 h-4" /> Temperature
                </span>
                <span className="text-white font-bold">78°F</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#FFE573] to-[#FD437D] h-2 rounded-full" style={{width: '78%'}} />
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm flex items-center gap-2">
                  <Droplets className="w-4 h-4" /> Moisture
                </span>
                <span className="text-white font-bold">65%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#902F9B] to-[#FD437D] h-2 rounded-full" style={{width: '65%'}} />
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm flex items-center gap-2">
                  <Leaf className="w-4 h-4" /> Māmaki Tea
                </span>
                <span className="text-green-400 font-bold">Rising Mana</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 p-4 rounded-lg border border-green-500/30">
              <h3 className="text-green-400 font-semibold mb-2">🐗 Pua'a Guard</h3>
              <p className="text-white/80 text-sm">All Clear • Last scan: 2 min ago</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
