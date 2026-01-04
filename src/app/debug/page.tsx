"use client";
import { useState, useEffect } from 'react';
import LeilaGoddess from '@/components/LeilaGoddess';
import { Brain, X, Search, Sparkles } from 'lucide-react';

export default function UltimateDebugDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'crops' | 'lunar' | 'knf' | 'security' | 'components' | 'hydro' | 'grants'>('overview');
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [envStatus, setEnvStatus] = useState<any>(null);
  
  // AI Panel State
  const [aiOpen, setAiOpen] = useState(false);
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
        body: JSON.stringify({ query: aiQuery, category: activeTab })
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
    { name: 'IMO #3 (Microbes)', ingredients: 'White mold from \'Ōhi\'a/Koa forest + cooked rice + bamboo leaves + molasses', ratio: '1:1:1', purpose: 'Soil microbe inoculation' },
    { name: 'Guava-Tip FPJ', ingredients: '1kg young Guava shoots + 1kg brown sugar', ratio: 'Ferment 7 days, dilute 2tsp/gallon', purpose: 'Triggers Vanilla flowering (Bloom Booster)' },
    { name: 'JWA (Pest Shield)', ingredients: '3.5 lbs cooking oil + 0.9 lbs KOH + 2.6 gal rainwater', ratio: 'Mix to create wetting agent', purpose: 'Suffocates aphids/scale on Vanilla' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-8">
      
      {/* AI RESEARCH BUTTON - TOP */}
      <div className="mb-6 p-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] rounded-2xl">
        <button
          onClick={() => setAiOpen(!aiOpen)}
          className="w-full flex items-center justify-center gap-3 text-white text-xl font-bold py-3"
        >
          <Brain className="w-7 h-7" />
          {aiOpen ? '❌ CLOSE AI RESEARCH PANEL' : '🧠 OPEN AI RESEARCH PANEL - Get Cutting-Edge Recommendations!'}
          <Sparkles className="w-5 h-5 animate-pulse" />
        </button>
      </div>

      {/* AI PANEL */}
      {aiOpen && (
        <div className="mb-8 p-8 bg-white/95 backdrop-blur-xl rounded-2xl border-4 border-[#FFE573]">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#902F9B] to-[#FD437D] bg-clip-text text-transparent mb-4">
            🧠 Leila AI Research - Design, Tools & Farming Intelligence
          </h2>
          <p className="text-gray-700 mb-6">Ask about: Latest sensors, Hawaiian culture, hydroponic systems, AI models, UI/UX design, grant opportunities, KNF recipes</p>
          
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiResearch()}
              placeholder="e.g. 'Best IoT sensors for māmaki tea?' or 'Improve goddess design with Hawaiian patterns'"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#902F9B] focus:ring-2 focus:ring-[#902F9B]/20"
            />
            <button
              onClick={handleAiResearch}
              disabled={aiLoading}
              className="px-8 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-lg font-bold text-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              {aiLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-6 h-6" />}
              {aiLoading ? 'Researching...' : 'DeepSearch'}
            </button>
          </div>

          {aiResults && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-300">
                <h3 className="text-2xl font-bold mb-4 text-green-900">🔍 Research Findings</h3>
                {aiResults.research_findings?.map((f: any, i: number) => (
                  <div key={i} className="mb-4 p-4 bg-white rounded-lg shadow">
                    <p className="font-bold text-lg text-gray-900">{f.summary}</p>
                    <p className="text-sm text-gray-600 mt-2">📚 Source: {f.source}</p>
                    <p className="text-sm text-[#902F9B] mt-2 font-semibold">→ Relevance: {f.relevance}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300">
                <h3 className="text-2xl font-bold mb-4 text-blue-900">✅ Actionable Recommendations</h3>
                <ul className="space-y-3">
                  {aiResults.recommendations?.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow">
                      <span className="text-green-600 text-2xl font-bold">✓</span>
                      <span className="text-gray-800 text-lg">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-300">
                <h3 className="text-2xl font-bold mb-3 text-purple-900">🌺 Hawaiian Cultural Context</h3>
                <p className="text-gray-800 text-lg italic bg-white p-4 rounded-lg shadow">"{aiResults.cultural_context}"</p>
                <div className="mt-4 flex items-center justify-between bg-white p-3 rounded-lg shadow">
                  <span className="text-lg font-semibold">Authenticity Score:</span>
                  <span className="px-5 py-2 bg-gradient-to-r from-[#FFE573] to-[#FD437D] text-white rounded-full font-bold text-xl">{aiResults.authenticity_score}/10 🌺</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DASHBOARD HEADER */}
      <div className="mb-8">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B] mb-2">
          🌺 LEILA INTELLIGENCE DASHBOARD
        </h1>
        <p className="text-white/60">DeepSeek Research Compendium • Hawaiian Farm Management System</p>
      </div>

      {/* API STATUS */}
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

      {/* TABS */}
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

      {/* TAB CONTENT - I'll add back ALL the content in next message */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-[#FFE573] mb-4">📍 Hawaiian Acres Agronomy (Puna District)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Environment</h3>
                <ul className="text-white/80 space-y-1 text-sm">
                  <li>• Subtropical rainforest</li>
                  <li>• 120-150" rain/year</li>
                  <li>• Young volcanic rock (a'ā/pāhoehoe)</li>
                  <li>• pH 4.5-5.5 (acidic)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Lavender Solution</h3>
                <ul className="text-white/80 space-y-1 text-sm">
                  <li className="text-red-400">✗ L. angustifolia (root rot)</li>
                  <li className="text-green-400">✓ L. dentata (French)</li>
                  <li className="text-green-400">✓ L. stoechas (Spanish)</li>
                  <li>• Technique: Cinder-Pot/Mound Culture</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crops' && (
          <div className="grid grid-cols-2 gap-6">
            {cropData.map((crop, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{crop.name}</h3>
                    <p className="text-sm text-white/60">{crop.category}</p>
                  </div>
                  <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: crop.color + '30', borderColor: crop.color, borderWidth: 2 }}>
                    <p className="font-black" style={{ color: crop.color }}>{crop.roi}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm">{crop.status}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'lunar' && (
          <div className="grid grid-cols-2 gap-6">
            {lunarPhases.map((phase, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{phase.emoji}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#FFE573]">{phase.name}</h3>
                    <p className="text-white/60">{phase.phase}</p>
                  </div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-white/80">{phase.action}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'knf' && (
          <div className="space-y-6">
            {knfRecipes.map((recipe, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-[#FFE573] mb-3">{recipe.name}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-white/60 text-sm mb-2">Ingredients</h4>
                    <p className="text-white/80">{recipe.ingredients}</p>
                  </div>
                  <div>
                    <h4 className="text-white/60 text-sm mb-2">Ratio/Process</h4>
                    <p className="text-white/80">{recipe.ratio}</p>
                  </div>
                </div>
                <div className="bg-[#902F9B]/20 p-4 rounded-lg border border-[#902F9B]/30">
                  <p className="text-[#FD437D] font-semibold">Purpose: {recipe.purpose}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <a href="/" className="px-8 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#FD437D]/30 transition-all">
          🏝️ Home Page
        </a>
      </div>
    </div>
  );
}
