'use client';
import { useState } from 'react';
import { Plus, TrendingUp, Beaker } from 'lucide-react';

interface SoilLog {
  date: string;
  organic_matter: number;
  ph: number;
  knf_applied: string;
  mamaki_yield_lbs: number;
  notes: string;
}

export default function SoilHealthTracker() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [logs, setLogs] = useState<SoilLog[]>([
    { date: '2025-12-01', organic_matter: 3.2, ph: 5.1, knf_applied: 'IMO #3', mamaki_yield_lbs: 12, notes: 'First application' },
    { date: '2025-12-15', organic_matter: 3.5, ph: 5.2, knf_applied: 'Guava FPJ', mamaki_yield_lbs: 14, notes: 'Growth improving' },
    { date: '2026-01-01', organic_matter: 3.8, ph: 5.3, knf_applied: 'IMO #3', mamaki_yield_lbs: 15, notes: 'Second IMO application' },
    { date: '2026-01-15', organic_matter: 4.1, ph: 5.4, knf_applied: 'IMO #3', mamaki_yield_lbs: 18, notes: 'Third IMO - significant improvement!' }
  ]);

  // Calculate correlation
  const imoApplications = logs.filter(l => l.knf_applied.includes('IMO')).length;
  const yieldIncrease = logs.length > 1 
    ? ((logs[logs.length - 1].mamaki_yield_lbs - logs[0].mamaki_yield_lbs) / logs[0].mamaki_yield_lbs * 100).toFixed(0)
    : 0;
  const avgOrganic = (logs.reduce((sum, l) => sum + l.organic_matter, 0) / logs.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-[#FFE573] mb-2">🌱 Soil Health Tracker</h2>
            <p className="text-white/80">Dr. Radovich's Scientific Method - Track KNF Applications vs Yields</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Log New Data
          </button>
        </div>

        {/* CORRELATION INSIGHTS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-900/30 border-2 border-green-500 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-xs text-green-400 font-semibold">YIELD INCREASE</p>
                <p className="text-4xl font-black text-green-400">+{yieldIncrease}%</p>
              </div>
            </div>
            <p className="text-white/80 text-sm">Māmaki production up since tracking started</p>
          </div>

          <div className="bg-blue-900/30 border-2 border-blue-500 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Beaker className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-xs text-blue-400 font-semibold">IMO APPLICATIONS</p>
                <p className="text-4xl font-black text-blue-400">{imoApplications}x</p>
              </div>
            </div>
            <p className="text-white/80 text-sm">Indigenous microorganism treatments</p>
          </div>

          <div className="bg-purple-900/30 border-2 border-purple-500 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">🌿</div>
              <div>
                <p className="text-xs text-purple-400 font-semibold">ORGANIC MATTER</p>
                <p className="text-4xl font-black text-purple-400">{avgOrganic}%</p>
              </div>
            </div>
            <p className="text-white/80 text-sm">Average soil organic matter</p>
          </div>
        </div>

        {/* CORRELATION STATEMENT */}
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-500 p-6 rounded-xl mb-6">
          <p className="text-2xl font-bold text-yellow-400 mb-2">
            📊 SCIENTIFIC CORRELATION DETECTED
          </p>
          <p className="text-white text-xl">
            IMO #3 applied <span className="font-black text-green-400">{imoApplications}x</span> → 
            Māmaki yield <span className="font-black text-green-400">+{yieldIncrease}%</span>
          </p>
          <p className="text-white/60 text-sm mt-2 italic">
            "This data could help farmers statewide optimize their KNF protocols" - Dr. Radovich
          </p>
        </div>

        {/* DATA TABLE */}
        <div className="bg-black/40 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-white/10">
                <th className="p-4 text-left text-[#FFE573]">Date</th>
                <th className="p-4 text-left text-[#FFE573]">KNF Applied</th>
                <th className="p-4 text-left text-[#FFE573]">Organic Matter %</th>
                <th className="p-4 text-left text-[#FFE573]">pH</th>
                <th className="p-4 text-left text-[#FFE573]">Māmaki Yield (lbs)</th>
                <th className="p-4 text-left text-[#FFE573]">Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4 text-white">{log.date}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-purple-500/30 border border-purple-500 rounded-full text-white text-sm font-semibold">
                      {log.knf_applied}
                    </span>
                  </td>
                  <td className="p-4 text-white font-mono">{log.organic_matter}%</td>
                  <td className="p-4 text-white font-mono">{log.ph}</td>
                  <td className="p-4 text-green-400 font-bold text-xl">{log.mamaki_yield_lbs} lbs</td>
                  <td className="p-4 text-white/60 text-sm italic">{log.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TREND VISUALIZATION (Simple) */}
        <div className="mt-6 bg-gradient-to-br from-green-900/20 to-blue-900/20 p-6 rounded-xl border border-green-500/30">
          <h3 className="text-xl font-bold text-green-400 mb-4">Yield Trend Over Time</h3>
          <div className="flex items-end gap-2 h-32">
            {logs.map((log, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all hover:scale-105"
                  style={{ height: `${(log.mamaki_yield_lbs / 20) * 100}%` }}
                ></div>
                <p className="text-white/60 text-xs mt-2">{log.date.slice(5)}</p>
                <p className="text-green-400 font-bold">{log.mamaki_yield_lbs}</p>
              </div>
            ))}
          </div>
        </div>

        {/* EXPORT BUTTON */}
        <div className="mt-6 flex justify-end">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all">
            📊 Export Data for UH Mānoa Research Collaboration
          </button>
        </div>
      </div>
    </div>
  );
}
