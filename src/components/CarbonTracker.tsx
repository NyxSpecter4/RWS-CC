'use client';

export default function CarbonTracker() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 border-2 border-emerald-500/40">
      <h3 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-4">🌍 Carbon Sequestration Tracker</h3>
      <p className="text-white/80 mb-6 text-sm md:text-base">Track carbon stored in soil through regenerative practices</p>
      
      <div className="space-y-4">
        <div className="bg-emerald-900/30 p-4 rounded-lg">
          <p className="text-white/60 text-sm mb-2">Total Carbon Sequestered</p>
          <p className="text-3xl font-black text-emerald-400">0 tons CO₂</p>
          <p className="text-white/50 text-xs mt-2">Year 1 - Baseline establishment</p>
        </div>

        <div className="bg-emerald-900/30 p-4 rounded-lg">
          <p className="text-white/60 text-sm mb-2">Soil Organic Matter</p>
          <p className="text-2xl font-black text-white">4.1%</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
            <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '41%' }}></div>
          </div>
        </div>

        <div className="bg-blue-900/30 p-4 rounded-lg">
          <p className="text-white/60 text-sm mb-2">Carbon Credit Potential</p>
          <p className="text-xl font-black text-blue-400">$0/year</p>
          <p className="text-white/50 text-xs mt-2">Becomes available Year 2+</p>
        </div>
      </div>
    </div>
  );
}
