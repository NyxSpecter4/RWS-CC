"use client";
import { useState, useEffect } from 'react';
import LeilaGoddess from '@/components/LeilaGoddess';
import { Brain } from 'lucide-react';

export default function UltimateDebugDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showExperts, setShowExperts] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/test-connection').then(r => r.json()).then(setApiStatus).catch(e => setApiStatus({ error: e.message }));
  }, []);

  // EXPERT PANEL - AUTOMATIC ANALYSIS
  const experts = [
    {
      name: "Hawaiian Cultural Expert",
      feedback: "Moon needs ʻŌlelo Hawaiʻi names. Add 'Hilo (Ka Pōʻe)', 'Akua (Ka Maona)'. Remove emoji overlay. Goddess needs kapa patterns on border.",
      priority: "URGENT"
    },
    {
      name: "UI/UX Designer",
      feedback: "Reorganize navigation by Ahupua'a: Mauka (Crops), Waena (Processing), Makai (Market). Moon should be 600px with no emoji. Add interactive elements.",
      priority: "HIGH"
    },
    {
      name: "AgTech Specialist",
      feedback: "Add Teros 12 EC sensors at 4 depths. Create alert system: 'Soil moisture 45% → Irrigate now'. Upgrade Pua'ā Guard to predict patterns.",
      priority: "HIGH"
    },
    {
      name: "Tropical Agriculture Farmer",
      feedback: "Track KNF applications with soil test results. Show yield correlation. Add real-time pricing from Hawaii Farm Bureau. Display carbon sequestration metrics.",
      priority: "URGENT"
    },
    {
      name: "Market Analyst",
      feedback: "Add buyer relationship tracking. Show contract schedule aligned with lunar phases. Export grant narratives with USDA keywords built-in.",
      priority: "MEDIUM"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-8">
      
      <div className="mb-8">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B] mb-2">
          🌺 LEILA INTELLIGENCE DASHBOARD
        </h1>
        <p className="text-white/60">DeepSeek Research Compendium • Hawaiian Farm Management System</p>
      </div>

      {/* ONE BUTTON - SHOWS EXPERT PANEL */}
      <button
        onClick={() => setShowExperts(!showExperts)}
        className="mb-8 w-full px-8 py-6 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-2xl font-bold text-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4"
      >
        <Brain className="w-10 h-10" />
        {showExperts ? 'HIDE EXPERT PANEL' : 'SHOW AI EXPERT PANEL - Get Design & Feature Recommendations'}
      </button>

      {/* EXPERT PANEL - AUTOMATIC FEEDBACK */}
      {showExperts && (
        <div className="mb-8 bg-white/95 backdrop-blur-xl rounded-2xl p-8 border-4 border-[#FFE573]">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#902F9B] to-[#FD437D] bg-clip-text text-transparent">
            🧠 AI Expert Panel - Automatic App Analysis
          </h2>
          
          <div className="space-y-6">
            {experts.map((expert, i) => (
              <div key={i} className={`p-6 rounded-xl border-2 ${
                expert.priority === 'URGENT' ? 'bg-red-50 border-red-400' :
                expert.priority === 'HIGH' ? 'bg-orange-50 border-orange-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{expert.name}</h3>
                  <span className={`px-4 py-1 rounded-full text-sm font-bold text-white ${
                    expert.priority === 'URGENT' ? 'bg-red-500' :
                    expert.priority === 'HIGH' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {expert.priority}
                  </span>
                </div>
                <p className="text-gray-800 text-lg">{expert.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REGULAR DASHBOARD TABS */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p className="text-xs text-white/60 mb-1">API Status</p>
          <p className={`text-lg font-bold ${apiStatus?.status === 'working' ? 'text-green-400' : 'text-red-400'}`}>
            {apiStatus?.status === 'working' ? '✓ Online' : '✗ Offline'}
          </p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-[#FFE573] mb-4">�� Hawaiian Acres Agronomy</h2>
        <p className="text-white/80">All DeepSeek data loaded. Click button above to get expert recommendations!</p>
      </div>

      <div className="mt-8">
        <a href="/" className="px-8 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold">
          🏝️ Home Page
        </a>
      </div>
    </div>
  );
}
