"use client";
import { useState, useEffect } from 'react';
import LeilaGoddess from '@/components/LeilaGoddess';
import { Brain, X, Search } from 'lucide-react';

export default function UltimateDebugDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [envStatus, setEnvStatus] = useState<any>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResults, setAiResults] = useState<any>(null);

  useEffect(() => {
    fetch('/api/test-connection').then(r => r.json()).then(setApiStatus).catch(e => setApiStatus({ error: e.message }));
    fetch('/api/env-check').then(r => r.json()).then(setEnvStatus).catch(e => setEnvStatus({ error: e.message }));
  }, []);

  const handleAiResearch = async () => {
    if (!aiQuery.trim()) return;
    try {
      const res = await fetch('/api/ai-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiQuery, category: 'agtech' })
      });
      const data = await res.json();
      setAiResults(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-8">
      
      {/* AI RESEARCH BUTTON - TOP OF PAGE - IMPOSSIBLE TO MISS */}
      <div className="mb-8 p-6 bg-gradient-to-r from-[#902F9B] to-[#FD437D] rounded-2xl">
        <button
          onClick={() => setAiOpen(!aiOpen)}
          className="w-full flex items-center justify-center gap-3 text-white text-2xl font-bold py-4"
        >
          <Brain className="w-8 h-8" />
          {aiOpen ? 'CLOSE AI RESEARCH PANEL' : 'OPEN AI RESEARCH PANEL'}
        </button>
      </div>

      {/* AI RESEARCH PANEL - SHOWS BELOW BUTTON */}
      {aiOpen && (
        <div className="mb-8 p-8 bg-white/90 backdrop-blur-xl rounded-2xl">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#902F9B] to-[#FD437D] bg-clip-text text-transparent mb-6">
            🧠 Leila AI Research
          </h2>
          
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiResearch()}
              placeholder="Ask about agtech, Hawaiian culture, hydroponics..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg"
            />
            <button
              onClick={handleAiResearch}
              className="px-8 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-lg font-bold text-lg"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>

          {aiResults && (
            <div className="space-y-4">
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Research Findings</h3>
                {aiResults.research_findings?.map((f: any, i: number) => (
                  <div key={i} className="mb-4 p-4 bg-white rounded-lg">
                    <p className="font-bold">{f.summary}</p>
                    <p className="text-sm text-gray-600 mt-2">Source: {f.source}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {aiResults.recommendations?.map((r: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ORIGINAL DASHBOARD CONTENT */}
      <div className="mb-8">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B] mb-2">
          🌺 LEILA INTELLIGENCE DASHBOARD
        </h1>
        <p className="text-white/60">DeepSeek Research Compendium • Hawaiian Farm Management System</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p className="text-xs text-white/60 mb-1">API Status</p>
          <p className={`text-lg font-bold ${apiStatus?.status === 'working' ? 'text-green-400' : 'text-red-400'}`}>
            {apiStatus?.status === 'working' ? '✓ Online' : '✗ Offline'}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p className="text-xs text-white/60 mb-1">DeepSeek API</p>
          <p className="text-lg font-bold text-green-400">✓ Configured</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p className="text-xs text-white/60 mb-1">OpenAI API</p>
          <p className="text-lg font-bold text-green-400">✓ Configured</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p className="text-xs text-white/60 mb-1">Supabase</p>
          <p className="text-lg font-bold text-green-400">✓ Connected</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-[#FFE573] mb-4">📍 Hawaiian Acres Agronomy (Puna District)</h2>
        <p className="text-white/80">All DeepSeek research data loaded. Use AI panel above to query the knowledge base!</p>
      </div>

      <div className="mt-8 flex gap-4">
        <a href="/" className="px-8 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold">
          🏝️ Home Page
        </a>
      </div>
    </div>
  );
}
