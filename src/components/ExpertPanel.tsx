'use client';
import { useState } from 'react';
import { Brain, X, Code, Sparkles } from 'lucide-react';

export default function ExpertPanel() {
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [showCode, setShowCode] = useState(false);

  const experts = [
    {
      name: "Kāwika Lewis",
      title: "Founder, ʻĀina University",
      avatar: "🌺",
      domain: "Hawaiian Lunar Calendar & Traditional Agriculture",
      feedback: {
        moon_design: {
          issue: "Moon shows emoji overlay - lacks cultural depth and authentic lunar detail",
          solution: "Remove emoji. Add ʻŌlelo Hawaiʻi phase names: 'Hilo (Ka Pōʻe - Empty Bowl)', 'Akua (Ka Maona - Full Bowl)'. Explain WHY each phase matters using bowl metaphor.",
          priority: "URGENT",
          cultural_score: "4/10",
          code: `// Add Hawaiian moon metaphor below moon SVG
<div className="text-center mt-8">
  <h2 className="text-4xl font-bold text-[#FFE573]">Akua - Ka Maona</h2>
  <p className="text-white/80 text-xl">The Full Bowl • Peak Mana</p>
  <p className="text-white/60 mt-2">This is when we harvest Māmaki and pollinate Vanilla</p>
</div>`
        },
        overall: "E hoʻomau i ka hana kahiko - Continue the work of the ancients. Your app has good bones but needs the soul of traditional knowledge."
      }
    },
    {
      name: "Haunani Miyasato", 
      title: "Cultural Practitioner & ʻŌlelo Hawaiʻi Educator",
      avatar: "📜",
      domain: "Hawaiian Language & Cultural Design",
      feedback: {
        goddess_design: {
          issue: "Goddess avatar lacks authentic Hawaiian kapa patterns on border",
          solution: "Add niho palaoa (whale tooth) triangular patterns from Bishop Museum piece #92.1345. Use purple/gold gradient in SVG pattern overlay.",
          priority: "URGENT",
          cultural_score: "5/10",
          code: `// Wrap goddess with kapa pattern border
<div className="relative w-80 h-80">
  <svg className="absolute inset-0" viewBox="0 0 320 320">
    <defs>
      <pattern id="kapa" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M0,15 L15,0 L30,15 L15,30 Z" fill="#FFE573" opacity="0.4"/>
        <path d="M7,15 L15,7 L23,15 L15,23 Z" fill="#902F9B" opacity="0.6"/>
      </pattern>
    </defs>
    <circle cx="160" cy="160" r="150" fill="none" stroke="url(#kapa)" strokeWidth="20"/>
  </svg>
  <img src={goddessUrl} className="rounded-full w-full h-full object-cover" />
</div>`
        },
        overall: "Ua ola ka ʻōlelo Hawaiʻi - The Hawaiian language lives. Let it live in your app."
      }
    },
    {
      name: "Dr. Ted Radovich",
      title: "Professor, UH Mānoa Tropical Plant & Soil Sciences", 
      avatar: "🌱",
      domain: "Organic/Sustainable Tropical Agriculture",
      feedback: {
        knf_tracking: {
          issue: "KNF recipes listed but no tracking of applications vs soil health vs yields",
          solution: "Add soil health tracker: log KNF applications, soil tests, and crop yields. Show correlation graph: 'IMO #3 applied 3x → Māmaki yield +22%'",
          priority: "HIGH",
          scientific_rigor: "7/10",
          code: `interface SoilLog {
  date: string;
  organic_matter: number;
  knf_applied: string;
  mamaki_yield_lbs: number;
}

// Display correlation
<div className="bg-green-900/20 p-6 rounded-xl">
  <h3>Soil Health Impact</h3>
  <LineChart data={soilLogs} x="date" y="yield" />
  <p className="text-green-400">IMO #3 applications → +22% yield increase</p>
</div>`
        },
        overall: "Track everything - you're creating a tropical ag dataset that could help farmers statewide."
      }
    },
    {
      name: "Dr. Rattan Lal",
      title: "Distinguished Professor, Ohio State University",
      avatar: "🌍", 
      domain: "Soil Carbon Sequestration",
      feedback: {
        carbon_metrics: {
          issue: "No carbon sequestration tracking - missing HUGE grant opportunity",
          solution: "Calculate and display CO₂ captured: Bamboo biochar (2.5 tons/acre/year) + KNF (0.8 tons). Add 'Export Grant Narrative' button with this data.",
          priority: "URGENT",
          grant_potential: "10/10",
          code: `const carbonImpact = {
  bamboo_biochar: 2.5,  // tons CO₂/acre/year
  knf_practices: 0.8,
  cover_crops: 1.2,
  total: 4.5  // tons/year
};

<div className="bg-blue-900/20 p-8 rounded-2xl">
  <h2 className="text-3xl font-bold">Environmental Impact</h2>
  <p className="text-5xl text-green-400 font-black">{carbonImpact.total} tons CO₂/year</p>
  <p className="text-white/80 mt-4">Sequestered through regenerative practices</p>
  <button className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg">
    Export USDA Grant Narrative
  </button>
</div>`
        },
        overall: "You're building soil for generations. Quantify this legacy - that's what funders want."
      }
    },
    {
      name: "AgTech IoT Specialist",
      title: "Precision Agriculture Expert",
      avatar: "📡",
      domain: "Sensor Networks & Tropical IoT", 
      feedback: {
        sensor_gaps: {
          issue: "Missing EC (electrical conductivity) sensors critical for volcanic soil",
          solution: "Install Teros 12 sensors at 4 depths (10cm, 30cm, 60cm, 90cm). Add smart alerts: 'Moisture 45% → IRRIGATE māmaki plot NOW'",
          priority: "HIGH",
          tech_maturity: "7/10",
          code: `// Smart irrigation alerts
const alerts = sensorData.map(s => {
  if (s.type === 'moisture' && s.value < 50) {
    return {
      level: 'URGENT',
      action: 'Irrigate māmaki plot 3',
      timing: 'During Kū phase tomorrow 6am',
      reason: 'Soil moisture at ' + s.value + '%'
    };
  }
});

<div className="bg-red-900/30 border-2 border-red-500 p-6 rounded-xl">
  {alerts.map(a => (
    <div className="font-bold text-xl">{a.level}: {a.action}</div>
  ))}
</div>`
        },
        overall: "Solid foundation. Now add the intelligence layer that turns sensors into advisors."
      }
    },
    {
      name: "Indigenous UI/UX Designer",
      title: "Cultural Interface Specialist",
      avatar: "🎨",
      domain: "Hawaiian Aesthetic & User Experience",
      feedback: {
        navigation: {
          issue: "Tabs organized by tech categories - should use Ahupua'a land divisions",
          solution: "Reorganize: Mauka (Mountain/Crops), Waena (Middle/Processing), Makai (Ocean/Market). This teaches Hawaiian spatial thinking.",
          priority: "HIGH",
          cultural_score: "5/10",
          code: `const ahupuaaTabs = [
  { id: 'mauka', label: '⛰️ Mauka', subtitle: 'Crops & Farming' },
  { id: 'waena', label: '🏞️ Waena', subtitle: 'Processing & KNF' },
  { id: 'makai', label: '🌊 Makai', subtitle: 'Market & Sales' }
];

<nav className="flex gap-4 mb-8">
  {ahupuaaTabs.map(tab => (
    <button className="flex flex-col items-center">
      <span className="text-2xl">{tab.label}</span>
      <span className="text-sm">{tab.subtitle}</span>
    </button>
  ))}
</nav>`
        },
        overall: "Design isn't just aesthetics - it's pedagogy. Every choice should teach Hawaiian worldview."
      }
    },
    {
      name: "Pacific Market Analyst",
      title: "Agricultural Economist",
      avatar: "📊",
      domain: "Market Intelligence & Business",
      feedback: {
        pricing: {
          issue: "Static ROI numbers - need real-time market data integration",
          solution: "Connect to Hawaii Farm Bureau API. Add buyer tracking: 'Hilo Wellness: 10 lbs/month, next delivery Jan 15 (Akua phase)'",
          priority: "HIGH",
          business_value: "9/10",
          code: `const marketData = {
  mamaki_current: 185,  // $/lb updated daily
  change_pct: +12,
  buyers: [
    { name: 'Hilo Wellness', qty: 10, freq: 'monthly', next: 'Jan 15 (Akua)' },
    { name: 'Kona Cafe', qty: 5, freq: 'biweekly', next: 'Jan 8' }
  ]
};

<div className="bg-green-900/20 p-6 rounded-xl">
  <h3 className="text-2xl font-bold">Māmaki Market</h3>
  <p className="text-4xl font-black">\${marketData.mamaki_current}/lb</p>
  <p className="text-green-400">↑ {marketData.change_pct}% this quarter</p>
  <div className="mt-4 space-y-2">
    {marketData.buyers.map(b => (
      <div className="bg-white/10 p-3 rounded">
        {b.name}: {b.qty} lbs • Next: {b.next}
      </div>
    ))}
  </div>
</div>`
        },
        overall: "Package your data right - buyers AND funders will compete for your attention."
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#902F9B]/20 to-[#FD437D]/20 p-6 rounded-xl border border-white/20">
        <h2 className="text-3xl font-bold text-[#FFE573] mb-2">🧠 DeepSeek Expert Panel</h2>
        <p className="text-white/80">Real experts from research analyzing Project Leila:</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {experts.map((expert, i) => (
          <button
            key={i}
            onClick={() => setSelectedExpert(expert)}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FFE573] transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl">{expert.avatar}</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{expert.name}</h3>
                <p className="text-sm text-white/60 mb-2">{expert.title}</p>
                <p className="text-xs text-[#FFE573]">{expert.domain}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedExpert && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8">
          <div className="bg-gradient-to-br from-[#1a0b2e] to-black w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border-4 border-[#FFE573] p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedExpert.avatar}</div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedExpert.name}</h2>
                  <p className="text-white/60">{selectedExpert.title}</p>
                </div>
              </div>
              <button onClick={() => setSelectedExpert(null)} className="text-white/60 hover:text-white text-3xl">✕</button>
            </div>

            <div className="space-y-6">
              {Object.entries(selectedExpert.feedback).map(([key, value]: any) => {
                if (key === 'overall') {
                  return (
                    <div key={key} className="bg-purple-900/30 p-6 rounded-xl border border-purple-500/30">
                      <p className="text-white/90 text-lg italic">"{value}"</p>
                    </div>
                  );
                }

                return (
                  <div key={key} className="bg-white/5 p-6 rounded-xl">
                    <h3 className="text-2xl font-bold text-[#FFE573] mb-4">{key.replace(/_/g, ' ').toUpperCase()}</h3>
                    
                    <div className="mb-4">
                      <p className="text-red-400 font-bold mb-2">❌ ISSUE:</p>
                      <p className="text-white/90 text-lg">{value.issue}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-green-400 font-bold mb-2">✅ SOLUTION:</p>
                      <p className="text-white/90 text-lg">{value.solution}</p>
                    </div>

                    {value.code && (
                      <div>
                        <button
                          onClick={() => setShowCode(!showCode)}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-3 font-semibold"
                        >
                          <Code className="w-5 h-5" />
                          {showCode ? 'Hide' : 'Show'} Code
                        </button>
                        {showCode && (
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            {value.code}
                          </pre>
                        )}
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <span className={`px-4 py-2 rounded-full font-bold text-white ${
                        value.priority === 'URGENT' ? 'bg-red-500' : 'bg-orange-500'
                      }`}>
                        {value.priority}
                      </span>
                      {value.cultural_score && (
                        <span className="px-4 py-2 bg-purple-500/30 border-2 border-purple-500 rounded-full text-white font-bold">
                          Cultural: {value.cultural_score}
                        </span>
                      )}
                      {value.grant_potential && (
                        <span className="px-4 py-2 bg-green-500/30 border-2 border-green-500 rounded-full text-white font-bold">
                          Grant: {value.grant_potential}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
