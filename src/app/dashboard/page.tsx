"use client";
import { useState } from 'react';
import SoilHealthTracker from '@/components/SoilHealthTracker';
import SmartSensorAlerts from '@/components/SmartSensorAlerts';
import MarketIntelligence from '@/components/MarketIntelligence';
import CarbonTracker from '@/components/CarbonTracker';
import { Mountain, Waves, Home } from 'lucide-react';

export default function Dashboard() {
  const [activeZone, setActiveZone] = useState<'mauka' | 'waena' | 'makai'>('mauka');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-2 sm:p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER - MOBILE */}
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <h1 className="text-xl sm:text-3xl font-black text-white">�� DASHBOARD</h1>
          <a href="/" className="px-3 py-2 sm:px-6 sm:py-3 bg-purple-600 text-white rounded-lg sm:rounded-xl font-bold hover:bg-purple-700 text-xs sm:text-base">
            🏝️ Home
          </a>
        </div>

        {/* QUICK STATS - MOBILE GRID */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-6">
          <div className="bg-green-900/40 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-green-500/40">
            <p className="text-white/60 text-[10px] sm:text-sm">Soil Health</p>
            <p className="text-xl sm:text-3xl font-black text-green-400">92%</p>
          </div>
          <div className="bg-blue-900/40 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-blue-500/40">
            <p className="text-white/60 text-[10px] sm:text-sm">Moisture</p>
            <p className="text-xl sm:text-3xl font-black text-blue-400">45%</p>
          </div>
          <div className="bg-yellow-900/40 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-yellow-500/40">
            <p className="text-white/60 text-[10px] sm:text-sm">Revenue</p>
            <p className="text-xl sm:text-3xl font-black text-yellow-400">$0</p>
          </div>
          <div className="bg-purple-900/40 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-purple-500/40">
            <p className="text-white/60 text-[10px] sm:text-sm">Moon</p>
            <p className="text-lg sm:text-2xl font-black text-white">Hilo</p>
          </div>
        </div>

        {/* ZONE BUTTONS - MOBILE */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-6">
          {[
            { id: 'mauka', icon: Mountain, label: '⛰️ Mauka', color: 'green' },
            { id: 'waena', icon: Home, label: '🏞️ Waena', color: 'purple' },
            { id: 'makai', icon: Waves, label: '🌊 Makai', color: 'blue' }
          ].map((zone) => {
            const Icon = zone.icon;
            const isActive = activeZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id as any)}
                className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 ${
                  isActive ? `bg-${zone.color}-600 border-${zone.color}-500` : 'bg-white/5 border-white/20'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-white" />
                <p className="text-white font-bold text-center text-[10px] sm:text-base">{zone.label}</p>
              </button>
            );
          })}
        </div>

        {/* CONTENT - SCROLLABLE ON MOBILE */}
        <div className="overflow-y-auto max-h-[60vh] sm:max-h-none">
          {activeZone === 'mauka' && (
            <div className="space-y-3 sm:space-y-4">
              <SmartSensorAlerts />
              <SoilHealthTracker />
              <CarbonTracker />
            </div>
          )}
          
          {activeZone === 'waena' && (
            <div className="bg-white/10 p-3 sm:p-6 rounded-xl">
              <h3 className="text-lg sm:text-2xl font-bold text-purple-400 mb-3 sm:mb-4">🧙‍♂️ Shaman's Natural Recipes</h3>
              <p className="text-white/80 text-sm sm:text-base mb-4">Ancient wisdom for natural pest control and soil health</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {[
                  { name: 'IMO #3', desc: 'Indigenous microorganisms', icon: '🦠' },
                  { name: 'Guava FPJ', desc: 'Fermented plant juice', icon: '🍃' },
                  { name: 'OHN', desc: 'Oriental herbal nutrients', icon: '🌿' }
                ].map(r => (
                  <div key={r.name} className="bg-purple-900/30 p-3 sm:p-4 rounded-lg border border-purple-500/40">
                    <div className="text-3xl sm:text-4xl mb-2">{r.icon}</div>
                    <h4 className="text-white font-bold mb-1 text-sm sm:text-base">{r.name}</h4>
                    <p className="text-white/60 text-xs sm:text-sm mb-3">{r.desc}</p>
                    <button className="w-full bg-purple-600 text-white py-2 rounded font-bold text-xs sm:text-base hover:bg-purple-700">
                      View Recipe
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-green-900/30 p-3 sm:p-4 rounded-lg border border-green-500/40">
                <h4 className="text-green-400 font-bold mb-3 text-sm sm:text-lg">🛡️ Natural Pest Control</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded">
                    <p className="text-white font-bold text-sm sm:text-base">Neem Oil Spray</p>
                    <p className="text-white/60 text-xs sm:text-sm">For aphids, mites, whiteflies</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <p className="text-white font-bold text-sm sm:text-base">Garlic & Pepper Mix</p>
                    <p className="text-white/60 text-xs sm:text-sm">Universal pest deterrent</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <p className="text-white font-bold text-sm sm:text-base">Soap Solution</p>
                    <p className="text-white/60 text-xs sm:text-sm">Soft-bodied insects</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <p className="text-white font-bold text-sm sm:text-base">Companion Plants</p>
                    <p className="text-white/60 text-xs sm:text-sm">Marigolds, basil, mint</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeZone === 'makai' && <MarketIntelligence />}
        </div>

        {/* BOTTOM NAV - FIXED ON MOBILE */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur p-2 sm:relative sm:bg-transparent sm:mt-6 sm:p-0">
          <div className="flex gap-2 sm:gap-4 max-w-6xl mx-auto">
            <a href="/" className="flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 bg-purple-600 text-white rounded-lg sm:rounded-xl font-bold text-center text-xs sm:text-base">
              🏝️ Home
            </a>
            <a href="/debug" className="flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl font-bold text-center text-xs sm:text-base">
              🔧 Debug
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
