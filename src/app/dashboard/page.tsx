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
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-white">📊 DASHBOARD</h1>
          <a href="/" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700">
            🏝️ Home
          </a>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-green-900/40 rounded-xl p-4 border-2 border-green-500/40">
            <p className="text-white/60 text-sm">Soil Health</p>
            <p className="text-3xl font-black text-green-400">92%</p>
          </div>
          <div className="bg-blue-900/40 rounded-xl p-4 border-2 border-blue-500/40">
            <p className="text-white/60 text-sm">Moisture</p>
            <p className="text-3xl font-black text-blue-400">45%</p>
          </div>
          <div className="bg-yellow-900/40 rounded-xl p-4 border-2 border-yellow-500/40">
            <p className="text-white/60 text-sm">Revenue</p>
            <p className="text-3xl font-black text-yellow-400">$0</p>
          </div>
          <div className="bg-purple-900/40 rounded-xl p-4 border-2 border-purple-500/40">
            <p className="text-white/60 text-sm">Moon Phase</p>
            <p className="text-2xl font-black text-white">Hilo</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
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
                className={`p-4 rounded-xl border-2 ${
                  isActive ? `bg-${zone.color}-600 border-${zone.color}-500` : 'bg-white/5 border-white/20'
                }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2 text-white" />
                <p className="text-white font-bold text-center">{zone.label}</p>
              </button>
            );
          })}
        </div>

        <div>
          {activeZone === 'mauka' && (
            <div className="space-y-4">
              <SmartSensorAlerts />
              <SoilHealthTracker />
              <CarbonTracker />
            </div>
          )}
          {activeZone === 'waena' && (
            <div className="bg-white/10 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">🧪 KNF Recipes</h3>
              <div className="grid grid-cols-3 gap-4">
                {['IMO #3', 'Guava FPJ', 'OHN'].map(r => (
                  <div key={r} className="bg-purple-900/30 p-4 rounded-lg">
                    <h4 className="text-white font-bold mb-2">{r}</h4>
                    <button className="w-full bg-purple-600 text-white py-2 rounded font-bold">View</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeZone === 'makai' && <MarketIntelligence />}
        </div>

        <div className="mt-6 flex gap-4">
          <a href="/" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold">🏝️ Home</a>
          <a href="/debug" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">�� Debug</a>
        </div>
      </div>
    </div>
  );
}
