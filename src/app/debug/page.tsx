"use client";
import { useState, useEffect } from 'react';
import LeilaGoddess from '@/components/LeilaGoddess';
import { Brain, X, Search, Sparkles, Droplets, Thermometer, Leaf } from 'lucide-react';

export default function UltimateDebugDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'crops' | 'lunar' | 'knf' | 'security' | 'components' | 'hydro' | 'grants'>('overview');
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [envStatus, setEnvStatus] = useState<any>(null);
  
  // AI Research Panel State
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResults, setAiResults] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetch('/api/test-connection').then(r => r.json()).then(setApiStatus).catch(e => setApiStatus({ error: e.message }));
    fetch('/api/env-check').then(r => r.json()).then(setEnvStatus).catch(e => setEnvStatus({ error: e.message }));
  }, []);

  const handleAiResearch = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    
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
    } finally {
      setAiLoading(false);
    }
  };

  const lunarPhases = [
    { name: 'Hilo', phase: 'New Moon', action: 'Plant seeds, inoculate mushrooms', emoji: '🌑' },
    { name: 'Kū', phase: 'Rising', action: 'Transplant starts (grows upward)', emoji: '🌒' },
    { name: 'Akua', phase: 'Full Moon', action: 'PEAK MANA - Pollinate Vanilla, harvest Māmaki', emoji: '🌕' },
    { name: 'Muku', phase: 'Dark Moon', action: 'Rest, tool maintenance, log updates', emoji: '🌘' }
  ];

  const cropData = [
    { name: 'Māmaki Tea', roi: '$150-200/lb', category: 'HIGHEST ROI', status: 'Endemic, loves Puna rain', color: '#FFE573' },
    { name: 'Finger Limes', roi: '$30-50/lb', category: 'Specialty', status: 'High disease tolerance, targets chefs', color: '#FD437D' },
    { name: 'Vanilla Planifolia', roi: 'Premium', category: 'Long-term', status: 'Requires pollination at Akua phase', color: '#902F9B' },
    { name: 'Ginger/Turmeric', roi: 'Fast Cash', category: '50% Mix', status: 'Bag Culture on lava rock', color: '#FFE573' }
  ];

  const knfRecipes = [
    {
      name: 'IMO #3 (Microbes)',
      ingredients: 'White mold from \'Ōhi\'a/Koa forest + cooked rice + bamboo leaves + molasses',
      ratio: '1:1:1',
      purpose: 'Soil microbe inoculation'
    },
    {
      name: 'Guava-Tip FPJ',
      ingredients: '1kg young Guava shoots + 1kg brown sugar',
      ratio: 'Ferment 7 days, dilute 2tsp/gallon',
      purpose: 'Triggers Vanilla flowering (Bloom Booster)'
    },
    {
      name: 'JWA (Pest Shield)',
      ingredients: '3.5 lbs cooking oil + 0.9 lbs KOH + 2.6 gal rainwater',
      ratio: 'Mix to create wetting agent',
      purpose: 'Suffocates aphids/scale on Vanilla'
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

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p className="text-xs text-white/60 mb-1">API Status</p>
          <p className={`text-lg font-bold ${apiStatus?.status === 'working' ? 'text-green-400' : 'text-red-400'}`}>
            {apiStatus?.status === 'working' ? '✓ Online' : '✗ Offline'}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p className="text-xs text-white/60 mb-1">DeepSeek API</p>
          <p className={`text-lg font-bold ${envStatus?.DEEPSEEK === 'SET' ? 'text-green-400' : 'text-yellow-400'}`}>
            {envStatus?.DEEPSEEK === 'SET' ? '✓ Configured' : '⚠ Missing'}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p className="text-xs text-white/60 mb-1">OpenAI API</p>
          <p className={`text-lg font-bold ${envStatus?.OPENAI === 'SET' ? 'text-green-400' : 'text-yellow-400'}`}>
            {envStatus?.OPENAI === 'SET' ? '✓ Configured' : '⚠ Missing'}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <p className="text-xs text-white/60 mb-1">Supabase</p>
          <p className={`text-lg font-bold ${envStatus?.SUPABASE_URL === 'SET' ? 'text-green-400' : 'text-yellow-400'}`}>
            {envStatus?.SUPABASE_URL === 'SET' ? '✓ Connected' : '⚠ Missing'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: '🏝️ Overview' },
          { id: 'hydro', label: '💧 Hydroponics' },
          { id: 'crops', label: '🌿 Crops & ROI' },
          { id: 'lunar', label: '🌙 Lunar Calendar' },
          { id: 'knf', label: '🧪 KNF Recipes' },
          { id: 'security', label: '🐗 Puaʻa Guard' },
          { id: 'grants', label: '💰 Grants' },
          { id: 'components', label: '⚙️ Components' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white shadow-lg'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6 mb-20">
        {activeTab === 'overview' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-[#FFE573] mb-4">📍 All DeepSeek Data Loaded</h2>
            <p className="text-white/80">Use the tabs above to explore all research areas, or click the AI Research button below!</p>
          </div>
        )}

        {activeTab === 'crops' && (
          <div className="grid grid-cols-2 gap-6">
            {cropData.map((crop, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-1">{crop.name}</h3>
                <p className="text-sm text-white/60">{crop.category}</p>
                <p className="text-white/80 text-sm mt-2">{crop.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <a href="/leila" className="px-8 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#FD437D]/30 transition-all">
          🌺 Open Leila Chat
        </a>
        <a href="/" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-all">
          🏝️ Home Page
        </a>
      </div>

      {/* AI RESEARCH PANEL - EMBEDDED DIRECTLY */}
      <button
        onClick={() => setAiPanelOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2"
      >
        <Brain className="w-6 h-6" />
        <span className="font-semibold">AI Research</span>
        <Sparkles className="w-4 h-4 animate-pulse" />
      </button>

      {aiPanelOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" onClick={() => setAiPanelOpen(false)} />
          
          <div className="fixed top-0 right-0 h-screen w-full max-w-2xl bg-white/90 backdrop-blur-2xl z-[9999] shadow-2xl p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#902F9B] to-[#FD437D] bg-clip-text text-transparent">
                🧠 Leila AI Research
              </h2>
              <button onClick={() => setAiPanelOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">DeepSeek Research Query</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiResearch()}
                  placeholder="Ask about agtech, Hawaiian culture, hydroponics, grants..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#902F9B]"
                />
                <button
                  onClick={handleAiResearch}
                  disabled={aiLoading}
                  className="px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  {aiLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  Research
                </button>
              </div>
            </div>

            {aiResults && (
              <div className="space-y-6">
                <div className="bg-white/50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">🔍 Research Findings</h3>
                  {aiResults.research_findings?.map((f: any, i: number) => (
                    <div key={i} className="mb-4 p-4 bg-white rounded-lg">
                      <p className="font-semibold text-gray-900">{f.summary}</p>
                      <p className="text-sm text-gray-600 mt-2">Source: {f.source}</p>
                      <p className="text-sm text-[#902F9B] mt-2">→ {f.relevance}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <h3 className="text-xl font-bold mb-4 text-green-900">✅ Recommendations</h3>
                  <ul className="space-y-2">
                    {aiResults.recommendations?.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600 text-xl">✓</span>
                        <span className="text-gray-700">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-xl font-bold mb-3 text-purple-900">🌺 Hawaiian Cultural Context</h3>
                  <p className="text-gray-700 italic">"{aiResults.cultural_context}"</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Authenticity Score:</span>
                    <span className="px-4 py-2 bg-[#FFE573] rounded-full font-bold text-lg">{aiResults.authenticity_score}/10</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
// Force deploy Sun Jan  4 10:56:43 UTC 2026
