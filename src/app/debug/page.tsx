"use client";
import { useState } from 'react';
import ExpertPanel from '@/components/ExpertPanel';
import ExpertPanelV2 from '@/components/ExpertPanelV2';
import SoilHealthTracker from '@/components/SoilHealthTracker';
import SmartSensorAlerts from '@/components/SmartSensorAlerts';
import MarketIntelligence from '@/components/MarketIntelligence';
import CarbonTracker from '@/components/CarbonTracker';
import { Brain, Mountain, Waves, Home, Rocket } from 'lucide-react';

export default function DebugDashboard() {
  const [activeZone, setActiveZone] = useState<'mauka' | 'waena' | 'makai'>('makai');
  const [showExpertsV1, setShowExpertsV1] = useState(false);
  const [showExpertsV2, setShowExpertsV2] = useState(false);

  const ahupuaaZones = {
    mauka: {
      id: 'mauka',
      icon: Mountain,
      label: '⛰️ Mauka',
      subtitle: 'Mountain Zone',
      description: 'Upland farming, crops, soil, sensors',
      color: 'from-green-600 to-emerald-600',
      borderColor: 'border-green-500'
    },
    waena: {
      id: 'waena',
      icon: Home,
      label: '🏞️ Waena', 
      subtitle: 'Middle Zone',
      description: 'Processing, KNF recipes, carbon tracking',
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500'
    },
    makai: {
      id: 'makai',
      icon: Waves,
      label: '🌊 Makai',
      subtitle: 'Ocean Zone',
      description: 'Markets, buyers, sales, export',
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] pb-24">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B] mb-6">
          🌺 LEILA INTELLIGENCE DASHBOARD
        </h1>

        {/* PHASE 2 - NEW EXPERTS */}
        <button
          onClick={() => setShowExpertsV2(!showExpertsV2)}
          className="mb-4 w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
        >
          <Rocket className="w-8 h-8" />
          {showExpertsV2 ? 'HIDE' : 'SHOW'} PHASE 2: Advanced Features (Database, AI, Blockchain, AR)
        </button>

        {showExpertsV2 && <div className="mb-8"><ExpertPanelV2 /></div>}

        {/* PHASE 1 - IMPLEMENTED EXPERTS */}
        <button
          onClick={() => setShowExpertsV1(!showExpertsV1)}
          className="mb-8 w-full px-6 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-2xl font-bold text-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
        >
          <Brain className="w-8 h-8" />
          {showExpertsV1 ? 'HIDE' : 'SHOW'} PHASE 1: Implemented Features (7 Completed - Run Again for Fresh Feedback)
        </button>

        {showExpertsV1 && <div className="mb-8"><ExpertPanel /></div>}

        {/* AHUPUA'A NAVIGATION */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(ahupuaaZones).map((zone) => {
              const Icon = zone.icon;
              const isActive = activeZone === zone.id;
              
              return (
                <button
                  key={zone.id}
                  onClick={() => setActiveZone(zone.id as any)}
                  className={`p-4 rounded-2xl border-4 transition-all ${
                    isActive 
                      ? `bg-gradient-to-br ${zone.color} ${zone.borderColor} scale-105` 
                      : 'bg-white/5 border-white/20 hover:border-white/40'
                  }`}
                >
                  <Icon className={`w-12 h-12 mx-auto mb-2 ${isActive ? 'text-white' : 'text-white/60'}`} />
                  <h3 className={`text-xl font-black text-center ${isActive ? 'text-white' : 'text-white/80'}`}>
                    {zone.label}
                  </h3>
                  <p className={`text-xs text-center ${isActive ? 'text-white/80' : 'text-white/50'}`}>
                    {zone.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {activeZone === 'mauka' && (
          <div className="space-y-8">
            <SmartSensorAlerts />
            <SoilHealthTracker />
            <CarbonTracker />
          </div>
        )}

        {activeZone === 'waena' && (
          <div className="bg-white/10 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">🧪 KNF Recipe Library</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['IMO #3', 'Guava FPJ', 'OHN'].map(recipe => (
                <div key={recipe} className="bg-purple-900/30 p-4 rounded-lg border-2 border-purple-500/40">
                  <h4 className="text-xl font-bold text-white mb-2">{recipe}</h4>
                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-bold">View Recipe</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeZone === 'makai' && <MarketIntelligence />}

        <a href="/" className="mt-8 inline-block px-8 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all">
          🏝️ Home
        </a>
      </div>
    </div>
  );
}
