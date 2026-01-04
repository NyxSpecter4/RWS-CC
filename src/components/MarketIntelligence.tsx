'use client';
import { TrendingUp, DollarSign } from 'lucide-react';

export default function MarketIntelligence() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-blue-500/40">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="w-8 h-8 text-green-400" />
        <h3 className="text-2xl font-bold text-yellow-400">Market Intelligence</h3>
      </div>
      
      <div className="bg-orange-900/30 border-2 border-orange-500/40 rounded-xl p-6 mb-6">
        <p className="text-white/60 text-sm mb-2">Projected Monthly Revenue</p>
        <p className="text-5xl font-black text-yellow-400">$0/month</p>
        <p className="text-white/80 mt-2">Year 1 - Establishment Phase</p>
        <p className="text-white/60 text-sm mt-1">Nothing planted yet. Revenue starts Year 2+</p>
      </div>

      <div className="bg-blue-900/30 border-2 border-blue-500/40 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h4 className="text-xl font-bold text-green-400">Live Market Prices - Hawaii Farm Bureau</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/40 p-4 rounded-lg">
            <h5 className="text-white font-bold mb-2">Māmaki Tea</h5>
            <p className="text-3xl font-black text-green-400">$185</p>
            <p className="text-white/60 text-sm">/lb wholesale</p>
            <p className="text-green-400 text-sm mt-2">↑ +12.1% vs last week</p>
          </div>

          <div className="bg-gray-900/40 p-4 rounded-lg">
            <h5 className="text-white font-bold mb-2">Finger Limes</h5>
            <p className="text-3xl font-black text-green-400">$45</p>
            <p className="text-white/60 text-sm">/lb wholesale</p>
            <p className="text-green-400 text-sm mt-2">↑ +7.4% vs last week</p>
          </div>

          <div className="bg-gray-900/40 p-4 rounded-lg">
            <h5 className="text-white font-bold mb-2">Vanilla Beans</h5>
            <p className="text-3xl font-black text-green-400">$420</p>
            <p className="text-white/60 text-sm">/lb cured</p>
            <p className="text-yellow-400 text-sm mt-2">→ Stable</p>
          </div>

          <div className="bg-gray-900/40 p-4 rounded-lg">
            <h5 className="text-white font-bold mb-2">Ginger + Turmeric</h5>
            <p className="text-3xl font-black text-green-400">$8</p>
            <p className="text-white/60 text-sm">/lb fresh</p>
            <p className="text-red-400 text-sm mt-2">↓ -3.2% (seasonal)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
