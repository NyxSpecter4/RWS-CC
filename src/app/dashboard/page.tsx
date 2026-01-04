"use client";
import { useState } from 'react';
import SoilHealthTracker from '@/components/SoilHealthTracker';
import SmartSensorAlerts from '@/components/SmartSensorAlerts';
import MarketIntelligence from '@/components/MarketIntelligence';
import CarbonTracker from '@/components/CarbonTracker';
import { Mountain, Waves, Home, LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const [activeZone, setActiveZone] = useState<'mauka' | 'waena' | 'makai'>('mauka');

  const zones = {
    mauka: { id: 'mauka', icon: Mountain, label: '⛰️ Mauka', subtitle: 'Mountain', color: 'from-green-600 to-emerald-600', borderColor: 'border-green-500' },
    waena: { id: 'waena', icon: Home, label: '🏞️ Waena', subtitle: 'Middle', color: 'from-purple-600 to-pink-600', borderColor: 'border-purple-500' },
    makai: { id: 'makai', icon: Waves, label: '🌊 Makai', subtitle: 'Ocean', color: 'from-blue-600 to-cyan-600', borderColor: 'border-blue-500' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER - RESPONSIVE */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <LayoutDashboard className="w-6 h-6 md:w-10 md:h-10 text-green-400" />
            <h1 className="text-xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B]">
              📊 DASHBOARD
            </h1>
          </div>
          <a href="/" className="px-3 py-2 md:px-6 md:py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-lg md:rounded-xl font-bold hover:scale-105 transition-all text-xs md:text-base">
            🏝️ Home
          </a>
        </div>

        {/* QUICK STATS - RESPONSIVE GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
          <div className="bg-green-900/40 backdrop-blur-md rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-green-500/40">
            <p className="text-white/60 text-xs md:text-sm mb-1">Soil Health</p>
            <p className="text-2xl md:text-3xl font-black text-green-400">92%</p>
            <p className="text-white/60 text-[10px] md:text-xs">OM: 4.1%</p>
          </div>
          <div className="bg-blue-900/40 backdrop-blur-md rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-blue-500/40">
            <p className="text-white/60 text-xs md:text-sm mb-1">Moisture</p>
            <p className="text-2xl md:text-3xl font-black text-blue-400">45%</p>
            <p className="text-white/60 text-[10px] md:text-xs">Optimal</p>
          </div>
          <div className="bg-yellow-900/40 backdrop-blur-md rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-yellow-500/40">
            <p className="text-white/60 text-xs md:text-sm mb-1">Revenue</p>
            <p className="text-2xl md:text-3xl font-black text-yellow-400">$0</p>
            <p className="text-white/60 text-[10px] md:text-xs">Year 1</p>
          </div>
          <div className="bg-purple-900/40 backdrop-blur-md rounded-lg md:rounded-xl p-3 md:p-4 border-2 border-purple-500/40">
            <p className="text-white/60 text-xs md:text-sm mb-1">Moon</p>
            <p className="text-xl md:text-2xl font-black text-white">Hilo</p>
            <p className="text-white/60 text-[10px] md:text-xs">Planting</p>
          </div>
        </div>

        {/* ZONE NAVIGATION - RESPONSIVE */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
          {Object.values(zones).map((zone) => {
            const Icon = zone.icon;
            const isActive = activeZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id as any)}
                className={`p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all ${isActive ? `bg-gradient-to-br ${zone.color} ${zone.borderColor} scale-105` : 'bg-white/5 border-white/20 hover:border-white/40'}`}
              >
                <Icon className={`w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 ${isActive ? 'text-white' : 'text-white/60'}`} />
                <h3 className={`text-sm md:text-lg font-black text-center ${isActive ? 'text-white' : 'text-white/80'}`}>{zone.label}</h3>
                <p className={`text-[10px] md:text-xs text-center ${isActive ? 'text-white/90' : 'text-white/60'}`}>{zone.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* FARM DATA BY ZONE - RESPONSIVE */}
        <div className="space-y-3 md:space-y-4">
          {activeZone === 'mauka' && (
            <>
              <SmartSensorAlerts />
              <SoilHealthTracker />
              <CarbonTracker />
            </>
          )}

          {activeZone === 'waena' && (
            <div className="bg-white/10 p-4 md:p-6 rounded-xl border-2 border-purple-500/40">
              <h3 className="text-xl md:text-2xl font-bold text-purple-400 mb-3 md:mb-4">🧪 KNF Processing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {['IMO #3', 'Guava FPJ', 'OHN'].map(recipe => (
                  <div key={recipe} className="bg-purple-900/30 p-3 md:p-4 rounded-lg border-2 border-purple-500/40">
                    <h4 className="text-base md:text-lg font-bold text-white mb-2">{recipe}</h4>
                    <button className="w-full px-3 py-2 md:px-4 md:py-2 bg-purple-600 text-white rounded-lg font-bold text-sm md:text-base">View Recipe</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeZone === 'makai' && <MarketIntelligence />}
        </div>

        {/* NAVIGATION - RESPONSIVE */}
        <div className="mt-4 md:mt-6 flex gap-2 md:gap-4">
          <a href="/" className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-lg md:rounded-xl font-bold hover:scale-105 transition-all text-sm md:text-base">🏝️ Home</a>
          <a href="/debug" className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg md:rounded-xl font-bold hover:scale-105 transition-all text-sm md:text-base">🔧 Debug</a>
        </div>
      </div>
    </div>
  );
}
