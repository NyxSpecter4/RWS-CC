"use client";
import { useState } from 'react';
import SoilHealthTracker from '@/components/SoilHealthTracker';
import SmartSensorAlerts from '@/components/SmartSensorAlerts';
import MarketIntelligence from '@/components/MarketIntelligence';
import CarbonTracker from '@/components/CarbonTracker';
import ShamanRecipes from '@/components/ShamanRecipes';
import GrantsTracker from '@/components/GrantsTracker';
import { Mountain, Waves, Home, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [activeZone, setActiveZone] = useState<'mauka' | 'waena' | 'makai' | 'grants'>('mauka');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103]">
      <div className="max-w-7xl mx-auto p-4">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-white">📊 DASHBOARD</h1>
          <a href="/" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700">
            🏝️ Home
          </a>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-900/40 rounded-xl p-4 border border-green-500/40">
            <p className="text-white/60 text-sm">Soil Health</p>
            <p className="text-3xl font-black text-green-400">92%</p>
          </div>
          <div className="bg-blue-900/40 rounded-xl p-4 border border-blue-500/40">
            <p className="text-white/60 text-sm">Moisture</p>
            <p className="text-3xl font-black text-blue-400">45%</p>
          </div>
          <div className="bg-yellow-900/40 rounded-xl p-4 border border-yellow-500/40">
            <p className="text-white/60 text-sm">Revenue</p>
            <p className="text-3xl font-black text-yellow-400">$0</p>
          </div>
          <div className="bg-purple-900/40 rounded-xl p-4 border border-purple-500/40">
            <p className="text-white/60 text-sm">Moon</p>
            <p className="text-2xl font-black text-white">Hilo</p>
          </div>
        </div>

        {/* ZONE BUTTONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { id: 'mauka', icon: Mountain, label: '⛰️ Mauka', color: 'green' },
            { id: 'waena', icon: Home, label: '🏞️ Waena', color: 'purple' },
            { id: 'makai', icon: Waves, label: '🌊 Makai', color: 'blue' },
            { id: 'grants', icon: DollarSign, label: '💰 Grants', color: 'yellow' }
          ].map((zone) => {
            const Icon = zone.icon;
            const isActive = activeZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id as any)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isActive 
                    ? `bg-${zone.color}-600 border-${zone.color}-500 scale-105` 
                    : 'bg-white/5 border-white/20 hover:border-white/40'
                }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2 text-white" />
                <p className="text-white font-bold text-center">{zone.label}</p>
              </button>
            );
          })}
        </div>

        {/* CONTENT AREA - SCROLLABLE WITH MAX HEIGHT */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
          {activeZone === 'mauka' && (
            <div className="space-y-4 pb-6">
              <SmartSensorAlerts />
              <SoilHealthTracker />
              <CarbonTracker />
            </div>
          )}
          
          {activeZone === 'waena' && (
            <div className="pb-6">
              <ShamanRecipes />
            </div>
          )}
          
          {activeZone === 'makai' && (
            <div className="pb-6">
              <MarketIntelligence />
            </div>
          )}
          
          {activeZone === 'grants' && (
            <div className="pb-6">
              <GrantsTracker />
            </div>
          )}
        </div>

        {/* BOTTOM NAV */}
        <div className="fixed bottom-4 left-4 right-4 md:relative md:bottom-0 md:left-0 md:right-0 md:mt-6">
          <div className="flex gap-4 bg-black/90 md:bg-transparent backdrop-blur md:backdrop-blur-none p-3 md:p-0 rounded-xl md:rounded-none">
            <a href="/" className="flex-1 md:flex-none px-6 py-3 bg-purple-600 text-white rounded-xl font-bold text-center hover:bg-purple-700">
              🏝️ Home
            </a>
            <a href="/debug" className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-center hover:bg-blue-700">
              🔧 Debug
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
