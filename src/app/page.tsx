"use client";
import { useState, useEffect } from 'react';
import { Moon, Droplets, Thermometer, Leaf } from 'lucide-react';

export default function CelestialAltar() {
  const [currentPhase, setCurrentPhase] = useState<'Hilo' | 'Kū' | 'Akua' | 'Muku'>('Akua');
  const [goddessImage, setGoddessImage] = useState<string>('');
  const [wisdomText, setWisdomText] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [sensorData, setSensorData] = useState<any>(null);

  useEffect(() => {
    const day = new Date().getDate();
    if (day <= 7) setCurrentPhase('Hilo');
    else if (day <= 14) setCurrentPhase('Kū');
    else if (day <= 21) setCurrentPhase('Akua');
    else setCurrentPhase('Muku');

    generateGoddess();
    getLeilaWisdom();
    loadSensorData();
  }, []);

  const generateGoddess = async () => {
    try {
      const res = await fetch('/api/generate-goddess', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.imageUrl) setGoddessImage(data.imageUrl);
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

  const loadSensorData = async () => {
    try {
      const res = await fetch('/api/sensor-data');
      const data = await res.json();
      setSensorData(data);
    } catch (e) {
      console.error('Failed to load sensor data:', e);
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        
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

        <div className="mb-8">
          {goddessImage ? (
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[#FFE573] shadow-2xl shadow-[#902F9B]/50">
              <img src={goddessImage} alt="Leila - Hawaiian Goddess" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#902F9B] to-[#FD437D] flex items-center justify-center border-4 border-[#FFE573] shadow-2xl cursor-pointer hover:scale-105 transition-transform" onClick={generateGoddess}>
              <div className="text-center">
                <p className="text-white text-sm mb-2">Click to manifest</p>
                <p className="text-white/60 text-xs">Leila goddess</p>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-2xl bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <p className="text-2xl text-white/90 text-center leading-relaxed italic">
            "{wisdomText || 'The \'āina speaks through the phases of Mahina. Listen to her rhythm, and abundance will follow.'}"
          </p>
          <p className="text-center text-[#FFE573] mt-4 font-semibold">— Leila, Guardian of the \'Āina</p>
        </div>

        <div className="mt-8 flex gap-4">
          <a href="/debug" className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
            🔧 Debug Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
