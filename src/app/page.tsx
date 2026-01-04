"use client";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CelestialAltar() {
  const [currentPhase, setCurrentPhase] = useState<'Hilo' | 'Kū' | 'Akua' | 'Muku'>('Hilo');
  const [goddessImage, setGoddessImage] = useState<string>('');
  const [speech, setSpeech] = useState('Aloha e! I am Leila. Generating my form and analyzing your farm...');
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);

  useEffect(() => {
    const day = new Date().getDate();
    if (day <= 7) setCurrentPhase('Hilo');
    else if (day <= 14) setCurrentPhase('Kū');
    else if (day <= 21) setCurrentPhase('Akua');
    else setCurrentPhase('Muku');

    // AUTO-GENERATE LEILA ON LOAD
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

  const farmPlan = {
    crops: [
      { name: 'Māmaki Tea', emoji: '🌿', allocation: '0.25 acres', status: 'Not yet planted', year1: '$0', year2: '$200/mo', year3: '$500/mo' },
      { name: 'Finger Limes', emoji: '🍋', allocation: '0.2 acres', status: 'Not yet planted', year1: '$0', year2: '$0', year3: '$300/mo' },
      { name: 'Vanilla Beans', emoji: '🌺', allocation: '0.2 acres', status: 'Not yet planted', year1: '$0', year2: '$0', year3: '$400/mo' },
      { name: 'Fresh Ginger', emoji: '🫚', allocation: '0.15 acres', status: 'Not yet planted', year1: '$0', year2: '$200/mo', year3: '$300/mo' },
      { name: 'Turmeric', emoji: '🟡', allocation: '0.15 acres', status: 'Not yet planted', year1: '$0', year2: '$200/mo', year3: '$300/mo' }
    ]
  };

  const current = phaseData[currentPhase];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0820] pb-24 md:pb-8">
      
      {/* SKY */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0820] via-[#1a1540] to-[#2d1b4e]"></div>
        {[...Array(200)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`,
              width: `${0.5 + Math.random() * 2}px`, height: `${0.5 + Math.random() * 2}px`,
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

      {/* LEILA - AUTO-GENERATES */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <div className="relative">
          <div className="relative w-32 h-32 md:w-44 md:h-44">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 176 176">
              <defs>
                <linearGradient id="kapaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#902F9B" />
                  <stop offset="50%" stopColor="#FD437D" />
                  <stop offset="100%" stopColor="#FFE573" />
                </linearGradient>
                <pattern id="nihoPalaoa" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 0,12 L 12,0 L 12,24 Z" fill="url(#kapaGradient)" opacity="0.9"/>
                  <path d="M 24,12 L 12,0 L 12,24 Z" fill="url(#kapaGradient)" opacity="0.6"/>
                  <path d="M 6,12 L 9,9 L 9,15 Z" fill="#FFE573" opacity="0.8"/>
                  <path d="M 18,12 L 15,9 L 15,15 Z" fill="#902F9B" opacity="0.7"/>
                </pattern>
              </defs>
              <circle cx="88" cy="88" r="86" fill="none" stroke="url(#nihoPalaoa)" strokeWidth="16"/>
              <circle cx="88" cy="88" r="78" fill="none" stroke="url(#kapaGradient)" strokeWidth="4" opacity="0.8"/>
              <circle cx="88" cy="2" r="3" fill="#FFE573" opacity="0.9"/>
              <circle cx="174" cy="88" r="3" fill="#FFE573" opacity="0.9"/>
              <circle cx="88" cy="174" r="3" fill="#FFE573" opacity="0.9"/>
              <circle cx="2" cy="88" r="3" fill="#FFE573" opacity="0.9"/>
            </svg>

            {goddessImage ? (
              <div className="absolute inset-3 rounded-full overflow-hidden shadow-2xl cursor-pointer hover:scale-105 transition-all"
                   onClick={() => setChatOpen(!chatOpen)}>
                <img src={goddessImage} alt="Leila" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#902F9B] to-[#FD437D] flex items-center justify-center shadow-2xl">
                {loading && (
                  <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            )}
          </div>

          {chatOpen && (
            <div className="absolute top-full right-0 mt-3 w-72 md:w-[28rem] bg-white/98 backdrop-blur-xl rounded-2xl p-4 md:p-5 shadow-2xl border-4 border-[#FFE573]">
              <button onClick={() => setChatOpen(false)} className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700">
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-black text-purple-700 uppercase">AI LIVE ANALYSIS</span>
              </div>
              <p className="text-gray-900 font-semibold text-sm md:text-base leading-relaxed mb-2 pr-6">{speech}</p>
              <button onClick={getSmartGuidance} className="text-xs text-purple-600 font-bold hover:text-purple-800">↻ Refresh</button>
            </div>
          )}

          {!chatOpen && (
            <button onClick={() => setChatOpen(true)} className="absolute top-full right-0 mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 text-sm">
              💬 Open Chat
            </button>
          )}
        </div>
      </div>

      {/* MOON */}
      <div className="relative z-10 flex flex-col items-center pt-8 md:pt-16">
        <svg width="280" height="280" viewBox="0 0 380 380" className="md:w-[380px] md:h-[380px] filter drop-shadow-[0_0_100px_rgba(255,229,115,0.8)]">
          <defs><radialGradient id="moonGrad"><stop offset="0%" stopColor="#fef9e7" /><stop offset="100%" stopColor="#c8c0a8" /></radialGradient></defs>
          <circle cx="190" cy="190" r="170" fill="url(#moonGrad)" />
        </svg>
        <div className="mt-4 md:mt-6 text-center px-4">
          <h2 className="text-4xl md:text-6xl font-black drop-shadow-lg" style={{ color: current.color }}>{current.hawaiian}</h2>
          <p className="text-base md:text-xl font-bold text-white/90 mt-1 drop-shadow-md">{current.metaphor}</p>
        </div>
      </div>

      {/* CROPS */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-3 md:p-4 backdrop-blur-sm z-40 max-h-[45vh] md:max-h-none overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-2 md:mb-3">
            <p className="text-white font-bold text-sm md:text-lg">🌱 1-Acre Regenerative Farm</p>
            <p className="text-yellow-400 font-black text-lg md:text-2xl">$0/month</p>
            <p className="text-white/60 text-xs">Year 1 - Establishment</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 mb-16 md:mb-4">
            {farmPlan.crops.map((crop) => (
              <div key={crop.name} className="bg-white/10 backdrop-blur-md rounded-lg p-2 md:p-3 border-2 border-white/20">
                <div className="text-2xl md:text-3xl mb-1 text-center">{crop.emoji}</div>
                <h4 className="font-bold text-white text-center text-[10px] md:text-xs mb-1">{crop.name}</h4>
                <p className="text-[9px] md:text-xs text-white/60 text-center mb-1">{crop.allocation}</p>
                <p className="text-[9px] md:text-xs text-orange-400 font-bold text-center mb-1">{crop.status}</p>
                <div className="text-[8px] md:text-[10px] text-white/50 text-center space-y-0.5">
                  <p>Y1: {crop.year1}</p><p>Y2: {crop.year2}</p><p>Y3+: {crop.year3}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NAV */}
      <div className="fixed bottom-3 left-3 md:bottom-4 md:left-4 z-50 flex gap-2">
        <a href="/dashboard" className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-2xl text-sm md:text-base">
          📊 Dashboard
        </a>
        <a href="/debug" className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-2xl text-sm md:text-base">
          🔧 Debug
        </a>
      </div>

      <style jsx>{`@keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}
