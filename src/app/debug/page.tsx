"use client";
import { useState, useEffect } from 'react';
import ExpertPanel from '@/components/ExpertPanel';
import { Brain } from 'lucide-react';

export default function UltimateDebugDashboard() {
  const [showExperts, setShowExperts] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/test-connection').then(r => r.json()).then(setApiStatus).catch(e => setApiStatus({ error: e.message }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-8">
      
      <div className="mb-8">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B] mb-2">
          🌺 LEILA INTELLIGENCE DASHBOARD
        </h1>
        <p className="text-white/60">DeepSeek Research Compendium • Hawaiian Farm Management System</p>
      </div>

      <button
        onClick={() => setShowExperts(!showExperts)}
        className="mb-8 w-full px-8 py-6 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-2xl font-bold text-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4"
      >
        <Brain className="w-10 h-10" />
        {showExperts ? 'HIDE DEEPSEEK EXPERT PANEL' : 'SHOW DEEPSEEK EXPERT PANEL - 7 Experts Analyze Your App'}
      </button>

      {showExperts && <ExpertPanel />}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p className="text-xs text-white/60 mb-1">API Status</p>
          <p className={`text-lg font-bold ${apiStatus?.status === 'working' ? 'text-green-400' : 'text-red-400'}`}>
            {apiStatus?.status === 'working' ? '✓ Online' : '✗ Offline'}
          </p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-[#FFE573] mb-4">📍 All DeepSeek Data Loaded</h2>
        <p className="text-white/80">Click button above to see expert analysis!</p>
      </div>

      <div className="mt-8">
        <a href="/" className="px-8 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold">
          🏝️ Home Page
        </a>
      </div>
    </div>
  );
}
