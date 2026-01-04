"use client";
import { useState, useEffect } from 'react';

export default function CelestialAltar() {
  const [currentPhase, setCurrentPhase] = useState<'Hilo' | 'Kū' | 'Akua' | 'Muku'>('Hilo');
  const [goddessImage, setGoddessImage] = useState<string>('');
  const [goddessEmotion, setGoddessEmotion] = useState<'happy' | 'wise' | 'urgent' | 'calm'>('wise');
  const [speech, setSpeech] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const day = new Date().getDate();
    if (day <= 7) setCurrentPhase('Hilo');
    else if (day <= 14) setCurrentPhase('Kū');
    else if (day <= 21) setCurrentPhase('Akua');
    else setCurrentPhase('Muku');

    const saved = localStorage.getItem('leila_goddess_image');
    if (saved) setGoddessImage(saved);

    updateGoddessMessage();
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

  const updateGoddessMessage = () => {
    const messages = {
      Hilo: {
        text: "Aloha e! Today is Hilo - the New Moon. Plant your māmaki seeds NOW. The dark moon nurtures what grows beneath. Inoculate your mushroom logs too! 🌑",
        emotion: 'calm' as const
      },
      Kū: {
        text: "E kū! The moon rises! This is the BEST time to transplant your starts. They'll grow upward with the moon's energy. Move those finger lime seedlings! 🌒",
        emotion: 'happy' as const
      },
      Akua: {
        text: "AKUA! PEAK MANA TIME! Pollinate your vanilla RIGHT NOW! Harvest māmaki - it's at maximum potency! Market price is $185/lb - up 12%! 🌕✨",
        emotion: 'urgent' as const
      },
      Muku: {
        text: "Muku phase - time to rest. Sharpen your tools, update your logs, plan next cycle. The land needs stillness too. E hoʻomaha... 🌘",
        emotion: 'wise' as const
      }
    };

    const current = messages[currentPhase];
    setSpeech(current.text);
    setGoddessEmotion(current.emotion);
  };

  const phaseData = {
    Hilo: { action: 'Plant seeds, inoculate mushrooms', color: '#1a0b2e', title: 'New Moon - Hilo' },
    Kū: { action: 'Transplant starts (grows upward)', color: '#902F9B', title: 'Waxing Moon - Kū' },
    Akua: { action: 'PEAK MANA - Pollinate Vanilla, harvest Māmaki', color: '#FFE573', title: 'Full Moon - Akua' },
    Muku: { action: 'Rest, tool maintenance', color: '#6B21A8', title: 'Waning Moon - Muku' }
  };

  const crops = [
    { name: 'Māmaki', price: '$185/lb', status: 'Ready to harvest (Akua)', emoji: '🌿', color: '#FFE573' },
    { name: 'Finger Limes', price: '$45/lb', status: 'Growing (transplant Kū)', emoji: '🍋', color: '#FD437D' },
    { name: 'Vanilla', price: 'Premium', status: 'Pollinate NOW (Akua)', emoji: '🌺', color: '#902F9B' },
    { name: 'Ginger', price: 'Fast Cash', status: 'Bag culture ready', emoji: '🫚', color: '#FFE573' }
  ];

  const emotionStyles = {
    happy: 'scale-105 animate-bounce',
    wise: 'opacity-90',
    urgent: 'scale-110 animate-pulse',
    calm: 'opacity-80'
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

      {/* GODDESS IN TOP RIGHT CORNER */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          {/* Speech Bubble */}
          <div className="absolute bottom-full right-0 mb-4 w-80 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border-2 border-[#FFE573]">
            <p className="text-gray-900 font-semibold">{speech}</p>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white rotate-45 border-r-2 border-b-2 border-[#FFE573]"></div>
          </div>

          {/* Goddess Avatar */}
          {goddessImage ? (
            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-[#FFE573] shadow-2xl ${emotionStyles[goddessEmotion]} transition-all cursor-pointer`}
                 onClick={generateGoddess}>
              <img src={goddessImage} alt="Leila" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#902F9B] to-[#FD437D] flex items-center justify-center border-4 border-[#FFE573] cursor-pointer"
                 onClick={generateGoddess}>
              {loading ? (
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-white text-xs">Click</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 pt-40">
        
        {/* MOON - CENTER */}
        <div className="mb-12 relative">
          <svg width="600" height="600" viewBox="0 0 600 600" className="filter drop-shadow-[0_0_120px_rgba(255,229,115,0.9)]">
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
            
            <circle cx="300" cy="300" r="280" fill="url(#moonGrad)" />
            <circle cx="300" cy="300" r="280" fill="url(#moonGrad)" filter="url(#craters-deep)" opacity="0.9" />
            <circle cx="300" cy="300" r="280" fill="url(#moonGrad)" filter="url(#craters-medium)" opacity="0.7" />
          </svg>
          
          <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-full text-center">
            <h2 className="text-5xl font-black mb-2" style={{ color: phaseData[currentPhase].color }}>
              {phaseData[currentPhase].title}
            </h2>
            <p className="text-white/80 text-xl">JANUARY 4, 2026</p>
          </div>
        </div>

        {/* ACTION GUIDANCE */}
        <div className="bg-gradient-to-r from-[#902F9B]/20 to-[#FD437D]/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8 max-w-2xl mt-20">
          <h3 className="text-2xl font-bold text-[#FFE573] mb-4">Today's Mana Guidance</h3>
          <p className="text-white/90 text-xl">{phaseData[currentPhase].action}</p>
        </div>
      </div>

      {/* CROPS ON THE GROUND - BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
        <h3 className="text-2xl font-bold text-[#FFE573] mb-4 text-center">🌱 Your Farm • Market Prices</h3>
        <div className="grid grid-cols-4 gap-4">
          {crops.map((crop, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:scale-105 transition-all">
              <div className="text-4xl mb-2 text-center">{crop.emoji}</div>
              <h4 className="font-bold text-white text-center mb-1">{crop.name}</h4>
              <p className="text-center font-bold mb-2" style={{ color: crop.color }}>{crop.price}</p>
              <p className="text-xs text-white/60 text-center">{crop.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DEBUG LINK */}
      <a href="/debug" 
         className="fixed bottom-4 left-4 px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all z-50">
        🔧 Expert Panel
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
