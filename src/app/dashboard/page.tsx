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
    mauka: { id: 'mauka', icon: Mountain, label: '⛰️ Mauka', subtitle: 'Mountain - Growing', color: 'from-green-600 to-emerald-600', borderColor: 'border-green-500' },
    waena: { id: 'waena', icon: Home, label: '🏞️ Waena', subtitle: 'Middle - Processing', color: 'from-purple-600 to-pink-600', borderColor: 'border-purple-500' },
    makai: { id: 'makai', icon: Waves, label: '🌊 Makai', subtitle: 'Ocean - Markets', color: 'from-blue-600 to-cyan-600', borderColor: 'border-blue-500' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-10 h-10 text-green-400" />
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B]">
              📊 FARM DASHBOARD
            </h1>
          </div>
          <a href="/" className="px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all">
            🏝️ Home
          </a>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-900/40 backdrop-blur-md rounded-xl p-4 border-2 border-green-500/40">
            <p className="text-white/60 text-sm mb-1">Soil Health</p>
            <p className="text-3xl font-black text-green-400">92%</p>
            <p className="text-white/60 text-xs">OM: 4.1%</p>
          </div>
          <div className="bg-blue-900/40 backdrop-blur-md rounded-xl p-4 border-2 border-blue-500/40">
            <p className="text-white/60 text-sm mb-1">Moisture</p>
            <p className="text-3xl font-black text-blue-400">45%</p>
            <p className="text-white/60 text-xs">Optimal</p>
          </div>
          <div className="bg-yellow-900/40 backdrop-blur-md rounded-xl p-4 border-2 border-yellow-500/40">
            <p className="text-white/60 text-sm mb-1">Revenue</p>
            <p className="text-3xl font-black text-yellow-400">$0</p>
            <p className="text-white/60 text-xs">Year 1</p>
          </div>
          <div className="bg-purple-900/40 backdrop-blur-md rounded-xl p-4 border-2 border-purple-500/40">
            <p className="text-white/60 text-sm mb-1">Moon</p>
            <p className="text-2xl font-black text-white">Hilo</p>
            <p className="text-white/60 text-xs">Planting</p>
          </div>
        </div>

        {/* ZONE NAVIGATION */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {Object.values(zones).map((zone) => {
            const Icon = zone.icon;
            const isActive = activeZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id as any)}
                className={`p-4 rounded-xl border-2 transition-all ${isActive ? `bg-gradient-to-br ${zone.color} ${zone.borderColor} scale-105` : 'bg-white/5 border-white/20 hover:border-white/40'}`}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${isActive ? 'text-white' : 'text-white/60'}`} />
                <h3 className={`text-lg font-black text-center ${isActive ? 'text-white' : 'text-white/80'}`}>{zone.label}</h3>
                <p className={`text-xs text-center ${isActive ? 'text-white/90' : 'text-white/60'}`}>{zone.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* FARM DATA BY ZONE */}
        <div className="space-y-4">
          {activeZone === 'mauka' && (
            <>
              <SmartSensorAlerts />
              <SoilHealthTracker />
              <CarbonTracker />
            </>
          )}

          {activeZone === 'waena' && (
            <div className="bg-white/10 p-6 rounded-xl border-2 border-purple-500/40">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">🧪 KNF Processing</h3>
              <div className="grid grid-cols-3 gap-4">
                {['IMO #3', 'Guava FPJ', 'OHN'].map(recipe => (
                  <div key={recipe} className="bg-purple-900/30 p-4 rounded-lg border-2 border-purple-500/40">
                    <h4 className="text-lg font-bold text-white mb-2">{recipe}</h4>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-bold">View Recipe</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeZone === 'makai' && <MarketIntelligence />}
        </div>

        <div className="mt-6 flex gap-4">
          <a href="/" className="px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all">🏝️ Home</a>
          <a href="/debug" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-all">🔧 Debug</a>
        </div>
      </div>
    </div>
  );
}
