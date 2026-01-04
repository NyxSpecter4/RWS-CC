"use client";
import { useState } from 'react';
import SoilHealthTracker from '@/components/SoilHealthTracker';
import SmartSensorAlerts from '@/components/SmartSensorAlerts';
import MarketIntelligence from '@/components/MarketIntelligence';
import CarbonTracker from '@/components/CarbonTracker';
import ShamanRecipes from '@/components/ShamanRecipes';
import { Mountain, Waves, Home } from 'lucide-react';

export default function Dashboard() {
  const [activeZone, setActiveZone] = useState<'mauka' | 'waena' | 'makai'>('mauka');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-2 sm:p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <h1 className="text-xl sm:text-3xl font-black text-white">📊 DASHBOARD</h1>
          <a href="/" className="px-3 py-2 sm:px-6 sm:py-3 bg-purple-600 text-white rounded-lg sm:rounded-xl font-bold hover:bg-purple-700 text-xs sm:text-base">
            🏝️ Home
          </a>
        </div>

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

        <div className="overflow-y-auto max-h-[60vh] sm:max-h-none">
          {activeZone === 'mauka' && (
            <div className="space-y-3 sm:space-y-4">
              <SmartSensorAlerts />
              <SoilHealthTracker />
              <CarbonTracker />
            </div>
          )}
          
          {activeZone === 'waena' && <ShamanRecipes />}
          
          {activeZone === 'makai' && <MarketIntelligence />}
        </div>

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
