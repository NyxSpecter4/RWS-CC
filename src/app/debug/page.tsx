"use client";
import { useState, useEffect } from 'react';
import ExpertPanelV2 from '@/components/ExpertPanelV2';
import SoilHealthTracker from '@/components/SoilHealthTracker';
import SmartSensorAlerts from '@/components/SmartSensorAlerts';
import MarketIntelligence from '@/components/MarketIntelligence';
import CarbonTracker from '@/components/CarbonTracker';
import { Brain, Mountain, Waves, Home } from 'lucide-react';

export default function DebugDashboard() {
  const [activeZone, setActiveZone] = useState<'mauka' | 'waena' | 'makai'>('makai');
  const [showExperts, setShowExperts] = useState(false);

  const ahupuaaZones = {
    mauka: {
      id: 'mauka',
      icon: Mountain,
      label: '⛰️ Mauka',
      subtitle: 'Mountain Zone',
      description: 'Upland farming, crops, soil, sensors - where food grows',
      color: 'from-green-600 to-emerald-600',
      borderColor: 'border-green-500'
    },
    waena: {
      id: 'waena',
      icon: Home,
      label: '🏞️ Waena', 
      subtitle: 'Middle Zone',
      description: 'Processing, KNF recipes, carbon tracking - where transformation happens',
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500'
    },
    makai: {
      id: 'makai',
      icon: Waves,
      label: '🌊 Makai',
      subtitle: 'Ocean Zone',
      description: 'Markets, buyers, sales, export - where abundance flows outward',
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] pb-24">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B] mb-2">
            🌺 LEILA INTELLIGENCE DASHBOARD
          </h1>
          <p className="text-white/60 mb-4 text-sm md:text-base">Organized by Ahupua'a - Traditional Hawaiian Land Divisions</p>
          
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500/30 rounded-xl p-4 mb-6">
            <p className="text-purple-300 font-semibold mb-2 text-sm md:text-base">📚 Hawaiian Spatial Thinking</p>
            <p className="text-white/80 text-xs md:text-sm">
              The Ahupua'a system divides land from <span className="text-green-400 font-bold">Mauka (mountain)</span> to <span className="text-blue-400 font-bold">Makai (ocean)</span>, 
              teaching that all resources flow from upland to sea.
            </p>
          </div>
        </div>

        {/* NEW EXPERT PANEL - PHASE 2 */}
        <button
          onClick={() => setShowExperts(!showExperts)}
          className="mb-4 w-full px-6 md:px-8 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg md:text-2xl hover:scale-[1.02] transition-all shadow-2xl flex items-center justify-center gap-4"
        >
          <Brain className="w-8 h-8 md:w-10 md:h-10" />
          {showExperts ? 'HIDE EXPERT PANEL' : 'SHOW 7 AI EXPERT ADVISORS - Advanced Features'}
        </button>

        {showExperts && (
          <div className="mb-8">
            <ExpertPanelV2 />
          </div>
        )}

        {/* AHUPUA'A NAVIGATION */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {Object.values(ahupuaaZones).map((zone) => {
              const Icon = zone.icon;
              const isActive = activeZone === zone.id;
              
              return (
                <button
                  key={zone.id}
                  onClick={() => setActiveZone(zone.id as any)}
                  className={`
                    relative p-4 md:p-6 rounded-2xl border-4 transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-br ${zone.color} ${zone.borderColor} scale-105 shadow-2xl` 
                      : 'bg-white/5 border-white/20 hover:border-white/40 hover:scale-[1.02]'}
                  `}
                >
                  <div className="flex flex-col items-center text-center">
                    <Icon className={`w-12 h-12 md:w-16 md:h-16 mb-3 ${isActive ? 'text-white' : 'text-white/60'}`} />
                    <h3 className={`text-xl md:text-2xl font-black mb-1 ${isActive ? 'text-white' : 'text-white/80'}`}>
                      {zone.label}
                    </h3>
                    <p className={`text-xs md:text-sm font-semibold mb-2 ${isActive ? 'text-white/90' : 'text-white/60'}`}>
                      {zone.subtitle}
                    </p>
                    <p className={`text-[10px] md:text-xs ${isActive ? 'text-white/80' : 'text-white/50'}`}>
                      {zone.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAUKA */}
        {activeZone === 'mauka' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500/40 rounded-xl p-4 md:p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-2 flex items-center gap-3">
                <Mountain className="w-6 h-6 md:w-8 md:h-8" />
                Mauka - Where Food Grows
              </h2>
              <p className="text-white/80 text-sm md:text-base">Upland farming zone: sensors, soil health, crops, environmental monitoring</p>
            </div>

            <div><SmartSensorAlerts /></div>
            <div><SoilHealthTracker /></div>
            <div><CarbonTracker /></div>
          </div>
        )}

        {/* WAENA */}
        {activeZone === 'waena' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500/40 rounded-xl p-4 md:p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-2 flex items-center gap-3">
                <Home className="w-6 h-6 md:w-8 md:h-8" />
                Waena - Where Transformation Happens
              </h2>
              <p className="text-white/80 text-sm md:text-base">Middle zone: KNF processing, value-added products</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 border border-purple-500/30">
              <h3 className="text-xl md:text-2xl font-bold text-purple-400 mb-4">🧪 KNF Recipe Library</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['IMO #3', 'Guava FPJ', 'OHN'].map(recipe => (
                  <div key={recipe} className="bg-purple-900/30 p-4 md:p-6 rounded-lg border-2 border-purple-500/40">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-2">{recipe}</h4>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 text-sm md:text-base">
                      View Recipe
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MAKAI */}
        {activeZone === 'makai' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-2 border-blue-500/40 rounded-xl p-4 md:p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2 flex items-center gap-3">
                <Waves className="w-6 h-6 md:w-8 md:h-8" />
                Makai - Where Abundance Flows
              </h2>
              <p className="text-white/80 text-sm md:text-base">Ocean zone: markets, buyers, sales, export</p>
            </div>

            <div><MarketIntelligence /></div>
          </div>
        )}

        <div className="mt-8">
          <a href="/" className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all inline-block text-sm md:text-base">
            🏝️ Home Page
          </a>
        </div>
      </div>
    </div>
  );
}
