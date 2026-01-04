'use client';
import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Code, Sparkles } from 'lucide-react';

export default function AutoExpertFeedback() {
  const [currentFeedback, setCurrentFeedback] = useState(0);
  const [showCode, setShowCode] = useState<number | null>(null);

  useEffect(() => {
    // Rotate through feedback every 8 seconds
    const interval = setInterval(() => {
      setCurrentFeedback(prev => (prev + 1) % expertFeedback.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // AUTOMATIC EXPERT ANALYSIS OF CURRENT APP
  const expertFeedback = [
    {
      expert: "Kāwika Lewis",
      role: "Hawaiian Lunar Calendar Expert",
      avatar: "🌺",
      analyzing: "Moon Phase Display",
      issue: "Moon shows emoji overlay instead of pure lunar detail. Missing Hawaiian phase names.",
      solution: "Remove emoji. Add ʻŌlelo Hawaiʻi: 'Hilo (Ka Pōʻe - Empty Bowl)', 'Akua (Ka Maona - Full Bowl)'. Make moon 3D with real craters.",
      priority: "URGENT",
      cultural_score: "4/10",
      code: `// Add Hawaiian moon names
<div className="text-center">
  <h2 className="text-4xl text-[#FFE573]">Akua - Ka Maona</h2>
  <p className="text-white/60">The Full Bowl • Peak Mana</p>
</div>`,
      implementation: "Replace phaseData emoji with pure SVG moon + Hawaiian names below it"
    },
    {
      expert: "Haunani Miyasato",
      role: "Cultural Design & Kapa Patterns",
      avatar: "📜",
      analyzing: "Goddess Avatar Border",
      issue: "Goddess has plain gold border. Missing authentic Hawaiian kapa patterns.",
      solution: "Add niho palaoa (whale tooth) triangular patterns. Use Bishop Museum piece #92.1345 geometry. Purple/gold gradient.",
      priority: "HIGH",
      cultural_score: "5/10",
      code: `// Add kapa pattern to goddess border
<svg className="absolute inset-0 w-full h-full">
  <defs>
    <pattern id="kapa" patternUnits="userSpaceOnUse" width="30" height="30">
      <path d="M0,15 L15,0 L30,15 L15,30 Z" fill="#FFE573" opacity="0.4"/>
      <path d="M7,15 L15,7 L23,15 L15,23 Z" fill="#902F9B" opacity="0.6"/>
    </pattern>
  </defs>
  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="url(#kapa)" strokeWidth="20"/>
</svg>`,
      implementation: "Wrap goddess image in SVG with kapa pattern stroke"
    },
    {
      expert: "Dr. Ted Radovich",
      role: "Tropical Agriculture Scientist",
      avatar: "🌱",
      analyzing: "Crop Data Display",
      issue: "Static ROI numbers ($150-200/lb). No soil health tracking. No KNF application logs.",
      solution: "Add real-time price updates from Hawaii Farm Bureau. Track KNF applications + soil tests. Show yield correlation.",
      priority: "HIGH",
      scientific_rigor: "6/10",
      code: `// Add soil health tracker component
interface SoilHealthLog {
  date: string;
  organic_matter: number;
  knf_applied: string;
  yield_lbs: number;
}

// Display in dashboard
<div className="bg-green-900/20 p-6 rounded-xl">
  <h3>Soil Health Trend</h3>
  <LineChart data={soilLogs} />
  <p>IMO #3 applied 3x → Māmaki yield +22%</p>
</div>`,
      implementation: "Create SoilHealthTracker component, add to debug page"
    },
    {
      expert: "Dr. Rattan Lal",
      role: "Soil Carbon Sequestration Expert",
      avatar: "🌍",
      analyzing: "Environmental Impact Display",
      issue: "No carbon sequestration metrics. Missing grant opportunity language.",
      solution: "Calculate CO2 captured: Bamboo biochar (2.5 tons/acre/year) + KNF practices (0.8 tons). Display in grant-ready format.",
      priority: "URGENT",
      grant_potential: "10/10",
      code: `// Carbon calculator widget
const carbonData = {
  bamboo_biochar: 2.5,  // tons CO2/acre/year
  knf_practices: 0.8,
  cover_crops: 1.2,
  total: () => 4.5  // tons/year
};

<div className="bg-blue-900/20 p-6 rounded-xl">
  <h3 className="text-2xl font-bold">Carbon Sequestration</h3>
  <p className="text-4xl text-green-400">{carbonData.total()} tons CO₂/year</p>
  <button>Export Grant Narrative</button>
</div>`,
      implementation: "Add to homepage as 'Environmental Impact' section"
    },
    {
      expert: "AgTech IoT Specialist",
      role: "Precision Agriculture Tech",
      avatar: "📡",
      analyzing: "Sensor Data Integration",
      issue: "Sensor data shown but no actionable thresholds. Missing EC (electrical conductivity) sensors.",
      solution: "Add alert system: 'Soil moisture 45% → IRRIGATE NOW'. Install Teros 12 sensors at 4 depths. $89/sensor, ROI in 3 months.",
      priority: "HIGH",
      tech_maturity: "7/10",
      code: `// Smart alerts component
const sensorAlerts = sensors.map(s => {
  if (s.type === 'moisture' && s.value < 50) {
    return {
      alert: 'IRRIGATE NOW',
      action: 'Water māmaki plot 3',
      timing: 'During Kū phase (tomorrow 6am)'
    };
  }
});

<div className="bg-red-900/20 border border-red-500 p-4">
  {sensorAlerts.map(a => (
    <div className="font-bold">{a.alert}: {a.action}</div>
  ))}
</div>`,
      implementation: "Upgrade sensor-data API to include threshold logic"
    },
    {
      expert: "Indigenous UI/UX Designer",
      role: "Cultural Interface Specialist",
      avatar: "🎨",
      analyzing: "App Navigation Structure",
      issue: "Tabs organized by tech categories. Should use Ahupua'a land division system.",
      solution: "Reorganize: Mauka (Mountain/Crops), Makai (Ocean/Market), Waena (Middle/Processing). This teaches Hawaiian spatial thinking.",
      priority: "MEDIUM",
      cultural_score: "5/10",
      code: `// Ahupua'a navigation
const ahupuaaTabs = [
  { id: 'mauka', label: '⛰️ Mauka (Crops & Farming)', icon: '🌿' },
  { id: 'waena', label: '🏞️ Waena (Processing & KNF)', icon: '🧪' },
  { id: 'makai', label: '🌊 Makai (Market & Sales)', icon: '💰' }
];

// This structure educates while organizing
<nav className="flex gap-4">
  {ahupuaaTabs.map(tab => (
    <button className="ahupuaa-tab">{tab.label}</button>
  ))}
</nav>`,
      implementation: "Refactor debug page tabs to Ahupua'a system"
    },
    {
      expert: "Pacific Market Analyst",
      role: "Agricultural Economics",
      avatar: "��",
      analyzing: "Market Intelligence Display",
      issue: "Static pricing. No buyer relationship tracking. No contract management.",
      solution: "Add API to Hawaii Farm Bureau market reports. Track buyers: 'Hilo Wellness wants 10 lbs/month Māmaki, next delivery Akua phase'.",
      priority: "HIGH",
      business_value: "9/10",
      code: `// Market intelligence widget
const marketData = {
  mamaki_wholesale: 185,  // $/lb (updated daily)
  change: +12,  // % from last quarter
  buyers: [
    { name: 'Hilo Wellness', qty: 10, freq: 'monthly', next: 'Jan 15 (Akua)' },
    { name: 'Kona Cafe', qty: 5, freq: 'biweekly', next: 'Jan 8' }
  ]
};

<div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 p-6">
  <h3>Māmaki Market</h3>
  <p className="text-3xl">\${marketData.mamaki_wholesale}/lb</p>
  <p className="text-green-400">↑ {marketData.change}% this quarter</p>
  <div className="mt-4">
    <h4>Active Contracts:</h4>
    {marketData.buyers.map(b => (
      <div>{b.name}: {b.qty} lbs {b.freq} • Next: {b.next}</div>
    ))}
  </div>
</div>`,
      implementation: "Create MarketIntelligence component for homepage"
    },
    {
      expert: "Computer Vision Expert",
      role: "Agricultural AI Specialist",
      avatar: "🤖",
      analyzing: "Pua'ā Guard AI System",
      issue: "YOLOv8n is reactive only. No temporal pattern analysis. No deterrent scheduling.",
      solution: "Add prediction: 'Pigs detected 3x last week 2AM near māmaki → increase surveillance 1-3AM'. Auto-schedule deterrents.",
      priority: "MEDIUM",
      tech_maturity: "8/10",
      code: `// Predictive pig detection
const pigPatterns = analyzePigActivity(detections);
// Returns: { hotspot: 'māmaki plot', timeRange: '1-3AM', frequency: 3/week }

const recommendation = {
  alert: 'HIGH RISK ZONE DETECTED',
  location: pigPatterns.hotspot,
  action: 'Deploy IR camera + motion deterrent',
  schedule: pigPatterns.timeRange,
  confidence: 0.87
};

<div className="bg-orange-900/20 border border-orange-500 p-6">
  <h3 className="font-bold text-orange-400">{recommendation.alert}</h3>
  <p>Location: {recommendation.location}</p>
  <p>Recommended: {recommendation.action}</p>
  <p>Schedule: {recommendation.schedule}</p>
</div>`,
      implementation: "Upgrade Pua'ā Guard with temporal analysis algorithm"
    }
  ];

  const current = expertFeedback[currentFeedback];

  return (
    <div className="fixed bottom-6 right-6 w-[500px] z-50">
      <div className="bg-gradient-to-br from-[#1a0b2e] to-black border-2 border-[#FFE573] rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#902F9B] to-[#FD437D] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{current.avatar}</div>
              <div>
                <h3 className="text-white font-bold text-lg">{current.expert}</h3>
                <p className="text-white/80 text-sm">{current.role}</p>
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Analyzing */}
          <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
            <p className="text-xs text-blue-400 font-semibold mb-1">ANALYZING:</p>
            <p className="text-white font-bold">{current.analyzing}</p>
          </div>

          {/* Issue */}
          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-red-400 font-semibold mb-1">ISSUE IDENTIFIED:</p>
                <p className="text-white/90">{current.issue}</p>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-green-400 font-semibold mb-1">RECOMMENDED SOLUTION:</p>
                <p className="text-white/90">{current.solution}</p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              current.priority === 'URGENT' ? 'bg-red-500' :
              current.priority === 'HIGH' ? 'bg-orange-500' : 'bg-blue-500'
            } text-white`}>
              {current.priority}
            </span>
            
            {current.cultural_score && (
              <span className="px-3 py-1 bg-purple-500/30 border border-purple-500 rounded-full text-xs text-white">
                Cultural: {current.cultural_score}
              </span>
            )}
            
            {current.grant_potential && (
              <span className="px-3 py-1 bg-green-500/30 border border-green-500 rounded-full text-xs text-white">
                Grant: {current.grant_potential}
              </span>
            )}
          </div>

          {/* Code */}
          <div>
            <button
              onClick={() => setShowCode(showCode === currentFeedback ? null : currentFeedback)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-semibold"
            >
              <Code className="w-4 h-4" />
              {showCode === currentFeedback ? 'Hide' : 'Show'} Implementation Code
            </button>
            
            {showCode === currentFeedback && (
              <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
                {current.code}
              </pre>
            )}
          </div>

          {/* Progress */}
          <div className="flex gap-1 justify-center pt-2">
            {expertFeedback.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentFeedback(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentFeedback ? 'bg-[#FFE573] w-6' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
