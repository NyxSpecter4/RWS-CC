"use client";
import { useState, useEffect } from 'react';

export default function CelestialAltar() {
  const [currentPhase, setCurrentPhase] = useState<'Hilo' | 'Kū' | 'Akua' | 'Muku'>('Hilo');
  const [goddessImage, setGoddessImage] = useState<string>('');
  const [goddessEmotion, setGoddessEmotion] = useState<'happy' | 'wise' | 'urgent' | 'calm'>('wise');
  const [speech, setSpeech] = useState('Loading intelligent guidance...');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const day = new Date().getDate();
    if (day <= 7) setCurrentPhase('Hilo');
    else if (day <= 14) setCurrentPhase('Kū');
    else if (day <= 21) setCurrentPhase('Akua');
    else setCurrentPhase('Muku');

    const saved = localStorage.getItem('leila_goddess_image');
    if (saved) setGoddessImage(saved);

    getSmartGuidance();

    // Update guidance every 2 minutes
    const interval = setInterval(getSmartGuidance, 120000);
    return () => clearInterval(interval);
  }, [currentPhase]);

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
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getSmartGuidance = async () => {
    try {
      // Gather ALL farm data
      const sensorData = {
        moisture_10cm: 45,
        moisture_30cm: 52,
        ec_30cm: 1.2,
        temperature: 78
      };

      const marketData = {
        mamaki: { price: 185, change: '+12%' },
        finger_limes: { price: 45, change: '+7%' },
        vanilla: { price: 320, change: '+2%' }
      };

      const soilData = {
        organic_matter: 4.1,
        last_knf: 'IMO #3',
        yield_trend: '+50%'
      };

      const res = await fetch('/api/leila-smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phase: currentPhase,
          sensorData,
          marketData,
          soilData
        })
      });

      const data = await res.json();
      setSpeech(data.speech);
      setGoddessEmotion(data.emotion);
      setLastUpdate(new Date());
    } catch (e) {
      console.error('Smart guidance error:', e);
      setSpeech('Aloha e! The mana flows strong today. Check your sensors and trust the ʻāina. 🌺');
      setGoddessEmotion('wise');
    }
  };

  const phaseData = {
    Hilo: { 
      hawaiian: 'Hilo', 
      metaphor: 'Ka Pōʻe (The Empty Bowl)',
      color: '#8B7355',
      bgGradient: 'from-gray-900 to-purple-900'
    },
    Kū: { 
      hawaiian: 'Kū', 
      metaphor: 'Ka Piha (The Filling Bowl)',
      color: '#902F9B',
      bgGradient: 'from-purple-900 to-pink-900'
    },
    Akua: { 
      hawaiian: 'Akua', 
      metaphor: 'Ka Maona (The Full Bowl)',
      color: '#FFE573',
      bgGradient: 'from-yellow-600 to-orange-600'
    },
    Muku: { 
      hawaiian: 'Muku', 
      metaphor: 'Ka Nalo (The Draining Bowl)',
      color: '#6B21A8',
      bgGradient: 'from-purple-900 to-gray-900'
    }
  };

  const crops = [
    { name: 'Māmaki', price: '$185/lb', status: 'Harvest at Akua', emoji: '🌿', color: '#FFE573' },
    { name: 'Finger Limes', price: '$45/lb', status: 'Transplant at Kū', emoji: '🍋', color: '#FD437D' },
    { name: 'Vanilla', price: 'Premium', status: 'Pollinate at Akua', emoji: '🌺', color: '#902F9B' },
    { name: 'Ginger', price: 'Fast Cash', status: 'Plant at Hilo', emoji: '🫚', color: '#FFE573' }
  ];

  const emotionStyles = {
    happy: 'scale-105 animate-bounce',
    wise: 'opacity-90',
    urgent: 'scale-110 animate-pulse',
    calm: 'opacity-80'
  };

  const current = phaseData[currentPhase];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${current.bgGradient} relative overflow-hidden transition-all duration-1000`}>
      
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

      {/* SMART GODDESS - TOP RIGHT */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          {/* AI-POWERED Speech Bubble */}
          <div className="absolute bottom-full right-0 mb-4 w-[28rem] bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border-4 border-[#FFE573]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-600">🤖 AI-POWERED GUIDANCE</span>
              <span className="text-xs text-gray-500">{lastUpdate.toLocaleTimeString()}</span>
            </div>
            <p className="text-gray-900 font-semibold text-base leading-relaxed">{speech}</p>
            <div className="absolute -bottom-2 right-12 w-4 h-4 bg-white rotate-45 border-r-4 border-b-4 border-[#FFE573]"></div>
            <button 
              onClick={getSmartGuidance}
              className="mt-3 text-xs text-purple-600 hover:text-purple-800 font-semibold"
            >
              ↻ Refresh Guidance
            </button>
          </div>

          {/* Goddess Avatar */}
          {goddessImage ? (
            <div className={`w-48 h-48 rounded-full overflow-hidden border-4 border-[#FFE573] shadow-2xl ${emotionStyles[goddessEmotion]} transition-all cursor-pointer`}
                 onClick={generateGoddess}>
              <img src={goddessImage} alt="Leila" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#902F9B] to-[#FD437D] flex items-center justify-center border-4 border-[#FFE573] cursor-pointer"
                 onClick={generateGoddess}>
              {loading ? (
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-white font-bold">Generate</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOON - CENTER */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        
        <div className="mb-8 relative">
          <svg width="500" height="500" viewBox="0 0 500 500" className="filter drop-shadow-[0_0_120px_rgba(255,229,115,0.9)]">
            <defs>
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

              <radialGradient id="moonGrad">
                <stop offset="0%" stopColor="#fef9e7" />
                <stop offset="30%" stopColor="#f8f4d5" />
                <stop offset="70%" stopColor="#e8e0c0" />
                <stop offset="100%" stopColor="#c8c0a8" />
              </radialGradient>
            </defs>
            
            <circle cx="250" cy="250" r="230" fill="url(#moonGrad)" />
            <circle cx="250" cy="250" r="230" fill="url(#moonGrad)" filter="url(#craters-deep)" opacity="0.9" />
            <circle cx="250" cy="250" r="230" fill="url(#moonGrad)" filter="url(#craters-medium)" opacity="0.7" />
          </svg>
          
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <h2 className="text-6xl font-black" style={{ color: current.color }}>
              {current.hawaiian}
            </h2>
            <p className="text-xl font-bold text-white/70 mt-1">{current.metaphor}</p>
          </div>
        </div>
      </div>

      {/* CROPS */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 backdrop-blur-sm">
        <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
          {crops.map((crop, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:scale-105 transition-all">
              <div className="text-4xl mb-2 text-center">{crop.emoji}</div>
              <h4 className="font-bold text-white text-center mb-1">{crop.name}</h4>
              <p className="text-center font-bold text-xl mb-1" style={{ color: crop.color }}>{crop.price}</p>
              <p className="text-xs text-white/50 text-center">{crop.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* EXPERT PANEL LINK */}
      <a href="/debug" 
         className="fixed bottom-4 left-4 px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all z-50 shadow-2xl flex items-center gap-2">
        🧠 Expert Panel
      </a>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
