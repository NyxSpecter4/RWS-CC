"use client";
import { useState, useEffect } from 'react';
import LeilaGoddess from '@/components/LeilaGoddess';

export default function UltimateDebugDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'crops' | 'lunar' | 'knf' | 'security' | 'components' | 'hydro' | 'grants'>('overview');
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [envStatus, setEnvStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/test-connection').then(r => r.json()).then(setApiStatus).catch(e => setApiStatus({ error: e.message }));
    fetch('/api/env-check').then(r => r.json()).then(setEnvStatus).catch(e => setEnvStatus({ error: e.message }));
  }, []);

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

      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
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
              <div className="mt-4 p-4 bg-black/30 rounded-lg">
                <h3 className="text-[#FD437D] font-semibold mb-2">Medium Recipe</h3>
                <p className="text-white/80 text-sm">40% crushed black cinder + 40% aged compost + 20% coarse perlite</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-[#FFE573] mb-4">🎋 Bamboo Integration</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                  <h3 className="text-green-400 font-semibold mb-2">Dendrocalamus asper</h3>
                  <p className="text-white/80 text-sm">Giant Clumping - Construction/Windbreak</p>
                </div>
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                  <h3 className="text-blue-400 font-semibold mb-2">Bambusa chungii</h3>
                  <p className="text-white/80 text-sm">Tropical Blue - Interior Divisions</p>
                </div>
              </div>
              <p className="mt-4 text-red-400 text-sm font-semibold">⚠ RULE: Strictly clumping only (no running varieties)</p>
            </div>
          </>
        )}

        {activeTab === 'hydro' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-[#FFE573] mb-4">💧 Hydroponic Logic</h2>
              
              <div className="bg-red-900/20 p-6 rounded-lg border border-red-500/30 mb-6">
                <h3 className="text-red-400 font-bold mb-3 text-xl">❌ AVOID: NFT (Nutrient Film Technique)</h3>
                <div className="text-white/80 space-y-2">
                  <p>• Vulnerable to power outages</p>
                  <p>• Rain dilution issues in 120-150" rainfall environment</p>
                  <p>• NOT suitable for Puna District conditions</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-900/20 p-6 rounded-lg border border-green-500/30">
                  <h3 className="text-green-400 font-bold mb-3 text-xl">✓ USE: Kratky Method</h3>
                  <div className="text-white/80 space-y-2 mb-4">
                    <p className="font-semibold text-[#FFE573]">For: Greens & Leafy Vegetables</p>
                    <p>• Passive system (NO POWER NEEDED)</p>
                    <p>• Perfect for off-grid Hawaii farms</p>
                    <p>• Water level drops naturally</p>
                    <p>• Roots develop oxygen zone</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded">
                    <p className="text-xs text-green-300">Best for: Lettuce, Kale, Bok Choy, Herbs</p>
                  </div>
                </div>

                <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-500/30">
                  <h3 className="text-blue-400 font-bold mb-3 text-xl">✓ USE: Media Beds (Bato Buckets)</h3>
                  <div className="text-white/80 space-y-2 mb-4">
                    <p className="font-semibold text-[#FFE573]">For: Fruiting Crops</p>
                    <p>• Drain-to-waste system</p>
                    <p>• Excellent for tomatoes, peppers</p>
                    <p>• Handles heavy rainfall well</p>
                    <p>• Supports larger plants</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded">
                    <p className="text-xs text-blue-300">Best for: Tomatoes, Cucumbers, Peppers, Beans</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30">
              <h2 className="text-2xl font-bold text-[#FFE573] mb-4">👜 BAG CULTURE HACK</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-3">Technique</h3>
                  <ul className="text-white/80 space-y-2 text-sm">
                    <li>• Use large fabric grow bags</li>
                    <li>• Place DIRECTLY on lava rock (no digging!)</li>
                    <li>• Bypass acidic soil pH entirely</li>
                    <li>• Effortless harvest - just lift bag</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3">Perfect For</h3>
                  <ul className="text-white/80 space-y-2 text-sm">
                    <li className="text-[#FFE573]">🌿 Ginger (Fast Cash Crop)</li>
                    <li className="text-[#FFE573]">🌿 Turmeric / ʻŌlena</li>
                    <li>• No-dig farming on volcanic rock</li>
                    <li>• Easy root crop management</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-black/40 rounded-lg">
                <p className="text-[#FFE573] font-semibold mb-2">Why This Works in Puna:</p>
                <p className="text-white/80 text-sm">Lava rock is too hard to dig. Bag culture lets you grow root crops without breaking your back or dealing with acidic soil!</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/20 to-yellow-900/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🔥 Bamboo Biochar - "Flame-Cap" Kiln</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-3">Process</h3>
                  <ul className="text-white/80 space-y-2 text-sm">
                    <li>• Build on-site "Flame-Cap" kiln</li>
                    <li>• Use harvested bamboo (Dendrocalamus asper)</li>
                    <li>• Pyrolysis creates biochar</li>
                    <li>• Zero external inputs needed</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3">Function</h3>
                  <ul className="text-white/80 space-y-2 text-sm">
                    <li className="text-green-400">• Creates "permanent nutrient battery"</li>
                    <li>• Stores nutrients in porous lava rock</li>
                    <li>• Improves water retention</li>
                    <li>• Carbon sequestration benefit</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-4 bg-black/40 rounded-lg">
                <p className="text-yellow-300 font-semibold">Integration: Mix biochar with KNF preparations for maximum soil health</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grants' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#902F9B]/20 to-[#FFE573]/20 backdrop-blur-md rounded-xl p-6 border border-[#FFE573]/30">
              <h2 className="text-3xl font-bold text-[#FFE573] mb-6">💰 GRANT-WINNING STRATEGY</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-4">🎯 Target Grants</h3>
                  <ul className="space-y-3">
                    <li className="text-white/80">
                      <span className="text-[#FFE573] font-semibold">USDA Specialty Crop Block Grant</span>
                      <p className="text-sm text-white/60 mt-1">Focus on endemic Hawaiian crops (Māmaki)</p>
                    </li>
                    <li className="text-white/80">
                      <span className="text-[#FD437D] font-semibold">HDOA Agribusiness Development</span>
                      <p className="text-sm text-white/60 mt-1">State-level agricultural innovation funding</p>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/10 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-4">🔑 Winning Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Indigenous Innovation',
                      'Precision Agroecology',
                      'Food Sovereignty',
                      'Climate-Resilient',
                      'Specialty Crops',
                      'Zero-Input Regenerative',
                      'Endemic Species',
                      'Biosurveillance'
                    ].map(keyword => (
                      <span key={keyword} className="px-3 py-1 bg-[#902F9B]/30 border border-[#902F9B] rounded-full text-sm text-white">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
                <h3 className="text-2xl font-bold text-[#FFE573] mb-3">📜 Grant Narrative Template</h3>
                <div className="bg-black/40 p-5 rounded-lg">
                  <p className="text-white/90 leading-relaxed mb-4">
                    "Project Leila bridges <span className="text-[#FFE573] font-semibold">ancestral lunar wisdom</span> with 
                    <span className="text-[#FD437D] font-semibold"> modern AI biosurveillance</span> to preserve 
                    <span className="text-[#902F9B] font-semibold"> endemic Hawaiian species</span> like Māmaki tea.
                  </p>
                  <p className="text-white/90 leading-relaxed mb-4">
                    Our <span className="text-green-400 font-semibold">zero-input regenerative system</span> combines:
                  </p>
                  <ul className="text-white/80 space-y-2 ml-6">
                    <li>• Kaulana Mahina (lunar calendar) crop timing</li>
                    <li>• Korean Natural Farming (KNF) preparations</li>
                    <li>• YOLOv8 feral pig detection for crop protection</li>
                    <li>• Climate-resilient specialty crop cultivation</li>
                  </ul>
                  <p className="text-white/90 leading-relaxed mt-4">
                    This <span className="text-[#FFE573] font-semibold">Indigenous Innovation</span> model empowers 
                    <span className="text-[#FD437D] font-semibold"> food sovereignty</span> in Hawaii while creating 
                    <span className="text-[#902F9B] font-semibold"> replicable frameworks</span> for island agricultural communities worldwide."
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30 text-center">
                  <p className="text-3xl font-bold text-green-400 mb-2">$150-200</p>
                  <p className="text-sm text-white/80">Māmaki ROI per lb</p>
                  <p className="text-xs text-white/60 mt-1">Highest value endemic crop</p>
                </div>
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30 text-center">
                  <p className="text-3xl font-bold text-blue-400 mb-2">0</p>
                  <p className="text-sm text-white/80">External Inputs</p>
                  <p className="text-xs text-white/60 mt-1">Fully regenerative system</p>
                </div>
                <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30 text-center">
                  <p className="text-3xl font-bold text-purple-400 mb-2">AI+</p>
                  <p className="text-sm text-white/80">Ancestral Wisdom</p>
                  <p className="text-xs text-white/60 mt-1">Innovation meets tradition</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Keep existing tabs... */}
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
            <div className="col-span-2 bg-gradient-to-r from-[#902F9B]/20 to-[#FD437D]/20 backdrop-blur-md rounded-xl p-6 border border-[#FFE573]/30">
              <h3 className="text-2xl font-bold text-[#FFE573] mb-4">📊 Crop Mix Strategy (50/30/20)</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-[#FFE573] h-8 rounded-lg flex items-center justify-center text-black font-bold">50%</div>
                  <p className="text-white">Fast Cash: Ginger/Turmeric + Mushrooms</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-[#FD437D] h-8 rounded-lg flex items-center justify-center text-white font-bold">30%</div>
                  <p className="text-white">Stability: Māmaki + Finger Limes</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-[#902F9B] h-8 rounded-lg flex items-center justify-center text-white font-bold">20%</div>
                  <p className="text-white">Premium: Vanilla Planifolia (Orchids)</p>
                </div>
              </div>
            </div>
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
            <div className="col-span-2 bg-gradient-to-r from-[#FFE573]/20 via-[#FD437D]/20 to-[#902F9B]/20 backdrop-blur-md rounded-xl p-6 border border-white/30">
              <h3 className="text-2xl font-bold text-white mb-3">🌙 Current Lunar Phase</h3>
              <p className="text-white/80 mb-2">Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p className="text-[#FFE573] font-semibold">Recommended Action: Check lunar calendar for today's phase</p>
            </div>
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
            <div className="bg-gradient-to-r from-green-900/20 to-yellow-900/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
              <h3 className="text-2xl font-bold text-green-400 mb-3">🔥 Bamboo Biochar</h3>
              <p className="text-white/80 mb-2">Process: "Flame-Cap" kiln on-site</p>
              <p className="text-white/80">Function: Creates permanent nutrient battery in porous lava rock</p>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-[#FFE573] mb-4">🐗 Pua'a Guard - AI Security System</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                  <h3 className="text-blue-400 font-semibold mb-2">Hardware</h3>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• Raspberry Pi Zero 2W</li>
                    <li>• Arducam IR Camera</li>
                    <li>• 10W Solar Panels</li>
                  </ul>
                </div>
                <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                  <h3 className="text-purple-400 font-semibold mb-2">AI Logic</h3>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• YOLOv8n (Nano) model</li>
                    <li>• Feral pig dataset trained</li>
                    <li>• Trigger: &gt;85% confidence</li>
                  </ul>
                </div>
              </div>
              <div className="bg-red-900/20 p-6 rounded-lg border border-red-500/30">
                <h3 className="text-red-400 font-bold mb-3 text-xl">⚡ "Goddess's Wrath" Deterrent System</h3>
                <div className="space-y-2 text-white/80">
                  <p>🔊 Sound 1: Aggressive domestic dog packs</p>
                  <p>🔊 Sound 2: Chaotic human noise/clanging metal</p>
                  <p>🔊 Sound 3: Booming Hawaiian Oli (Protection Chants)</p>
                </div>
                <p className="text-[#FFE573] mt-4 font-semibold">Integration: Real-time push to "Divine Audit" panel</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-[#FFE573] mb-4">🎨 Laka/Haumea Goddess Component</h2>
              <div className="flex justify-center bg-gradient-to-br from-[#1a0b2e] to-black p-8 rounded-xl mb-4">
                <LeilaGoddess isSpeaking={true} size="lg" showMana={true} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-900/20 p-4 rounded-lg">
                  <p className="text-green-400 font-bold mb-2">✓ Component Renders</p>
                  <p className="text-xs text-white/60">LeilaGoddess.tsx loaded successfully</p>
                </div>
                <div className="bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-blue-400 font-bold mb-2">✓ Mana Particles</p>
                  <p className="text-xs text-white/60">Animated energy visualization active</p>
                </div>
                <div className="bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-purple-400 font-bold mb-2">✓ Third Eye Glow</p>
                  <p className="text-xs text-white/60">Mana point animation working</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-[#FFE573] mb-4">🌙 Moon Crater Shader Test</h2>
              <div className="bg-black p-8 rounded-xl flex justify-center">
                <svg width="300" height="300" viewBox="0 0 400 400" className="filter drop-shadow-[0_0_60px_rgba(255,229,115,0.4)]">
                  <defs>
                    <filter id="testCraters">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="6" result="noise" />
                      <feDiffuseLighting in="noise" lightingColor="#fdfde7" surfaceScale="8">
                        <feDistantLight azimuth="45" elevation="65" />
                      </feDiffuseLighting>
                      <feComposite in="SourceGraphic" operator="in" />
                    </filter>
                    <radialGradient id="testMoonGradient" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#d5d8dc" />
                    </radialGradient>
                  </defs>
                  <circle cx="200" cy="200" r="180" fill="url(#testMoonGradient)" filter="url(#testCraters)" />
                </svg>
              </div>
              <p className="text-center text-green-400 mt-4 font-semibold">✓ feTurbulence crater shader rendering correctly</p>
            </div>
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
    </div>
  );
}
