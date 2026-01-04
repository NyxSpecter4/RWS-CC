"use client";
import { useState, useEffect } from 'react';

export default function CelestialAltar() {
  const [currentPhase, setCurrentPhase] = useState<'Hilo' | 'Kū' | 'Akua' | 'Muku'>('Hilo');
  const [goddessImage, setGoddessImage] = useState<string>('');
  const [speech, setSpeech] = useState('Aloha e! I am Leila. Generating my form and analyzing your farm...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const day = new Date().getDate();
    if (day <= 7) setCurrentPhase('Hilo');
    else if (day <= 14) setCurrentPhase('Kū');
    else if (day <= 21) setCurrentPhase('Akua');
    else setCurrentPhase('Muku');

    // AUTO GENERATE on first load
    generateGoddess();
    getSmartGuidance();
  }, []);

  const generateGoddess = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate-goddess', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGoddessImage(data.imageUrl);
      }
    } catch (e) {
      console.error('Goddess error:', e);
    } finally {
      setLoading(false);
    }
  };

  const getSmartGuidance = async () => {
    try {
      const res = await fetch('/api/leila-smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phase: currentPhase,
          sensorData: { moisture_10cm: 45, ec_30cm: 1.2, temperature: 78 },
          marketData: { mamaki: { price: 185, change: '+12%' } },
          soilData: { organic_matter: 4.1, last_knf: 'IMO #3' }
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setSpeech(data.speech || 'Aloha! Plant with the moon! 🌙');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const phaseData = {
    Hilo: { hawaiian: 'Hilo', metaphor: 'Ka Pōʻe (The Empty Bowl)', color: '#8B7355' },
    Kū: { hawaiian: 'Kū', metaphor: 'Ka Piha (The Filling Bowl)', color: '#902F9B' },
    Akua: { hawaiian: 'Akua', metaphor: 'Ka Maona (The Full Bowl)', color: '#FFE573' },
    Muku: { hawaiian: 'Muku', metaphor: 'Ka Nalo (The Draining Bowl)', color: '#6B21A8' }
  };

  const current = phaseData[currentPhase];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0820]">
      
      {/* SKY */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0820] via-[#1a1540] to-[#2d1b4e]"></div>
        
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              width: `${0.5 + Math.random() * 2}px`,
              height: `${0.5 + Math.random() * 2}px`,
              opacity: 0.4 + Math.random() * 0.6,
              animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`
            }}
          />
        ))}
        
        <svg className="absolute bottom-0 w-full h-64 opacity-90" viewBox="0 0 1400 300" preserveAspectRatio="none">
          <path d="M 0 300 L 0 150 Q 200 80, 400 150 L 400 300 Z" fill="#1a0f2e" opacity="0.9"/>
          <path d="M 350 300 L 500 120 Q 700 60, 900 120 L 1100 180 L 1400 300 Z" fill="#0a0515"/>
        </svg>
      </div>

      {/* LEILA */}
      <div className="fixed top-6 right-6 z-50">
        <div className="relative">
          <div className="relative w-44 h-44">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 176 176">
              <defs>
                <linearGradient id="kapaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#902F9B" />
                  <stop offset="50%" stopColor="#FD437D" />
                  <stop offset="100%" stopColor="#FFE573" />
                </linearGradient>
              </defs>
              <circle cx="88" cy="88" r="86" fill="none" stroke="url(#kapaGradient)" strokeWidth="16"/>
            </svg>

            {goddessImage ? (
              <div className="absolute inset-3 rounded-full overflow-hidden shadow-2xl cursor-pointer hover:scale-105 transition-all"
                   onClick={generateGoddess}>
                <img src={goddessImage} alt="Leila" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#902F9B] to-[#FD437D] flex items-center justify-center cursor-pointer shadow-2xl"
                   onClick={generateGoddess}>
                {loading ? (
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="text-center px-4">
                    <p className="text-white font-bold">Loading...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="absolute top-full right-0 mt-4 w-[28rem] bg-white/98 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border-4 border-[#FFE573]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-black text-purple-700 uppercase">AI LIVE ANALYSIS</span>
            </div>
            <p className="text-gray-900 font-semibold text-base leading-relaxed mb-3">{speech}</p>
            <button onClick={getSmartGuidance} className="text-xs text-purple-600 font-bold hover:text-purple-800">↻ Refresh</button>
          </div>
        </div>
      </div>

      {/* MOON */}
      <div className="relative z-10 flex flex-col items-center pt-16">
        <svg width="380" height="380" viewBox="0 0 380 380" className="filter drop-shadow-[0_0_100px_rgba(255,229,115,0.8)]">
          <defs>
            <radialGradient id="moonGrad">
              <stop offset="0%" stopColor="#fef9e7" />
              <stop offset="100%" stopColor="#c8c0a8" />
            </radialGradient>
          </defs>
          <circle cx="190" cy="190" r="170" fill="url(#moonGrad)" />
        </svg>
        
        <div className="mt-6 text-center">
          <h2 className="text-6xl font-black drop-shadow-lg" style={{ color: current.color }}>
            {current.hawaiian}
          </h2>
          <p className="text-xl font-bold text-white/90 mt-1 drop-shadow-md">{current.metaphor}</p>
        </div>
      </div>

      {/* CROPS */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <div className="bg-green-900/40 p-4 rounded-xl border-2 border-green-500/40">
          <div className="text-4xl mb-2">🌿</div>
          <p className="text-white text-sm font-bold">Māmaki</p>
        </div>
        <div className="bg-yellow-900/40 p-4 rounded-xl border-2 border-yellow-500/40">
          <div className="text-4xl mb-2">🍋</div>
          <p className="text-white text-sm font-bold">Finger Limes</p>
        </div>
        <div className="bg-purple-900/40 p-4 rounded-xl border-2 border-purple-500/40">
          <div className="text-4xl mb-2">🌺</div>
          <p className="text-white text-sm font-bold">Vanilla</p>
        </div>
        <div className="bg-orange-900/40 p-4 rounded-xl border-2 border-orange-500/40">
          <div className="text-4xl mb-2">🫚</div>
          <p className="text-white text-sm font-bold">Ginger</p>
        </div>
      </div>

      <a href="/debug" className="fixed bottom-4 left-4 px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all z-50 shadow-2xl">
        🧠 Dashboard
      </a>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
