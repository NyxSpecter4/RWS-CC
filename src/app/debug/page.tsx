"use client";
import { useState } from 'react';
import ExpertPanel from '@/components/ExpertPanel';
import ExpertPanelV2 from '@/components/ExpertPanelV2';
import SoilHealthTracker from '@/components/SoilHealthTracker';
import SmartSensorAlerts from '@/components/SmartSensorAlerts';
import MarketIntelligence from '@/components/MarketIntelligence';
import CarbonTracker from '@/components/CarbonTracker';
import { Brain, Mountain, Waves, Home, Rocket } from 'lucide-react';

export default function DebugPage() {
  const [activeZone, setActiveZone] = useState<'mauka' | 'waena' | 'makai'>('makai');
  const [showExpertsV1, setShowExpertsV1] = useState(false);
  const [showExpertsV2, setShowExpertsV2] = useState(false);

  const ahupuaaZones = {
    mauka: {
      id: 'mauka',
      icon: Mountain,
      label: '⛰️ Mauka',
      subtitle: 'Mountain Zone',
      color: 'from-green-600 to-emerald-600',
      borderColor: 'border-green-500'
    },
    waena: {
      id: 'waena',
      icon: Home,
      label: '🏞️ Waena', 
      subtitle: 'Middle Zone',
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500'
    },
    makai: {
      id: 'makai',
      icon: Waves,
      label: '🌊 Makai',
      subtitle: 'Ocean Zone',
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-4">
      
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER WITH HOME BUTTON */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B]">
            🔧 DEBUG PAGE
          </h1>
          <a href="/" className="px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all">
            🏝️ Home
          </a>
        </div>

        {/* EXPERT PANELS - COMPACT */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => setShowExpertsV2(!showExpertsV2)}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-base hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <Rocket className="w-6 h-6" />
            {showExpertsV2 ? 'HIDE' : 'SHOW'} PHASE 2: Advanced Features
          </button>

          {showExpertsV2 && <ExpertPanelV2 />}

          <button
            onClick={() => setShowExpertsV1(!showExpertsV1)}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold text-base hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <Brain className="w-6 h-6" />
            {showExpertsV1 ? 'HIDE' : 'SHOW'} PHASE 1: Implemented (Run for Fresh Feedback)
          </button>

          {showExpertsV1 && <ExpertPanel />}
        </div>

        {/* AHUPUA'A ZONES - COMPACT */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {Object.values(ahupuaaZones).map((zone) => {
            const Icon = zone.icon;
            const isActive = activeZone === zone.id;
            
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id as any)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isActive 
                    ? `bg-gradient-to-br ${zone.color} ${zone.borderColor} scale-105` 
                    : 'bg-white/5 border-white/20 hover:border-white/40'
                }`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${isActive ? 'text-white' : 'text-white/60'}`} />
                <h3 className={`text-lg font-black text-center ${isActive ? 'text-white' : 'text-white/80'}`}>
                  {zone.label}
                </h3>
                <p className={`text-xs text-center ${isActive ? 'text-white/90' : 'text-white/60'}`}>
                  {zone.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* ZONE CONTENT - FITS ON SCREEN */}
        <div className="max-h-[50vh] overflow-y-auto">
          {activeZone === 'mauka' && (
            <div className="space-y-4">
              <SmartSensorAlerts />
              <SoilHealthTracker />
              <CarbonTracker />
            </div>
          )}

          {activeZone === 'waena' && (
            <div className="bg-white/10 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">🧪 KNF Recipe Library</h3>
              <div className="grid grid-cols-3 gap-4">
                {['IMO #3', 'Guava FPJ', 'OHN'].map(recipe => (
                  <div key={recipe} className="bg-purple-900/30 p-4 rounded-lg border-2 border-purple-500/40">
                    <h4 className="text-lg font-bold text-white mb-2">{recipe}</h4>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-bold">View</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeZone === 'makai' && <MarketIntelligence />}
        </div>

        {/* BOTTOM NAV */}
        <div className="mt-6 flex gap-4">
          <a href="/" className="px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all">
            🏝️ Home
          </a>
          <a href="/dashboard" className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all">
            📊 Dashboard
          </a>
          <a href="/test-crops" className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-bold hover:scale-105 transition-all">
            🧪 Test Crops
          </a>
        </div>
      </div>
    </div>
  );
}
