"use client";
import { useState } from 'react';
import { LayoutDashboard, TrendingUp, Droplets, Leaf } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B] mb-4">
            📊 Farm Dashboard
          </h1>
          <p className="text-white/60 text-sm md:text-base">Real-time overview of your farm operations</p>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-md rounded-xl p-6 border-2 border-green-500/40">
            <div className="flex items-center gap-3 mb-2">
              <Leaf className="w-8 h-8 text-green-400" />
              <h3 className="text-white font-bold text-lg">Soil Health</h3>
            </div>
            <p className="text-3xl font-black text-green-400">92%</p>
            <p className="text-white/60 text-sm">Organic Matter: 4.1%</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-md rounded-xl p-6 border-2 border-blue-500/40">
            <div className="flex items-center gap-3 mb-2">
              <Droplets className="w-8 h-8 text-blue-400" />
              <h3 className="text-white font-bold text-lg">Moisture</h3>
            </div>
            <p className="text-3xl font-black text-blue-400">45%</p>
            <p className="text-white/60 text-sm">Optimal Range</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-md rounded-xl p-6 border-2 border-purple-500/40">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <h3 className="text-white font-bold text-lg">Revenue</h3>
            </div>
            <p className="text-3xl font-black text-yellow-400">$0/mo</p>
            <p className="text-white/60 text-sm">Year 1 Establishment</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/40 to-amber-900/40 backdrop-blur-md rounded-xl p-6 border-2 border-orange-500/40">
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="w-8 h-8 text-orange-400" />
              <h3 className="text-white font-bold text-lg">Moon Phase</h3>
            </div>
            <p className="text-2xl font-black text-white">Hilo</p>
            <p className="text-white/60 text-sm">New Moon - Planting</p>
          </div>
        </div>

        {/* FARM STATUS */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 border-2 border-white/20 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">🌱 Current Farm Status</h2>
          
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">🌿 Māmaki Tea (0.25 acres)</h3>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-white/60 text-sm">Not yet planted • First harvest in 18-24 months</p>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">🍋 Finger Limes (0.2 acres)</h3>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <div className="bg-yellow-500 h-4 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-white/60 text-sm">Not yet planted • First harvest in 3-4 years</p>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">🌺 Vanilla Beans (0.2 acres)</h3>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <div className="bg-purple-500 h-4 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-white/60 text-sm">Not yet planted • First harvest in 3+ years</p>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">🫚 Ginger (0.15 acres)</h3>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <div className="bg-orange-500 h-4 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-white/60 text-sm">Not yet planted • First harvest in 8-10 months</p>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">🟡 Turmeric (0.15 acres)</h3>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <div className="bg-amber-500 h-4 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-white/60 text-sm">Not yet planted • First harvest in 8-10 months</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex gap-4 flex-wrap">
          <a href="/" className="px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all">
            🏝️ Home
          </a>
          <a href="/debug" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-all">
            🔧 Debug Panel
          </a>
        </div>
      </div>
    </div>
  );
}
