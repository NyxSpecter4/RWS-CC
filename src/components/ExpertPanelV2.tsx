'use client';
import { useState } from 'react';
import { Database, Camera, Leaf, Globe, Lock, Smartphone, TrendingUp } from 'lucide-react';

export default function ExpertPanelV2() {
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);

  const experts = [
    {
      id: 'silva',
      name: 'Dr. Joshua Silva',
      title: 'Database Architect',
      institution: 'UH Mānoa CTAHR',
      icon: Database,
      priority: 'URGENT',
      color: 'blue',
      score: { before: '3/10', after: '9/10' },
      issue: 'Lunar calendar events disconnected from plant growth records.',
      solution: 'Unified plant_lifecycle database schema with moon phase as first-class entity.',
      metric: 'Generate yield correlation report in <5 seconds'
    },
    {
      id: 'musurlian',
      name: 'Prof. Angela Musurlian',
      title: 'Computer Vision / Agricultural AI',
      institution: 'Santa Clara University',
      icon: Camera,
      priority: 'HIGH',
      color: 'purple',
      score: { before: '2/10', after: '8/10' },
      issue: 'Manual growth logging tedious. Visual "mana" not quantified.',
      solution: 'CV-powered growth stage classifier. Photo → auto-identify species, stage, log with confidence.',
      metric: '>85% accurate automated growth stage classification'
    },
    {
      id: 'wang',
      name: 'Dr. Koon-Hui Wang',
      title: 'TEK + Modern Tech Integrator',
      institution: 'UH Mānoa CTAHR',
      icon: Leaf,
      priority: 'HIGH',
      color: 'green',
      score: { before: '4/10', after: '9/10' },
      issue: 'Moon phase treated as folklore, not testable variable.',
      solution: 'Treat moon phase at planting as core experimental variable with A/B testing.',
      metric: 'Quantified yield difference between moon phases'
    },
    {
      id: 'hawaiian-nlp',
      name: 'Hawaiian Language Specialist',
      title: 'ʻŌlelo Hawaiʻi NLP Developer',
      institution: 'UH Kawaihuelani Center',
      icon: Globe,
      priority: 'MEDIUM',
      color: 'yellow',
      score: { before: '4/10', after: '9/10' },
      issue: 'Hawaiian words used as decorative labels without educational context.',
      solution: 'Bilingual UI framework. Voice commands in Hawaiian.',
      metric: '100% core app navigation functional in ʻŌlelo Hawaiʻi'
    },
    {
      id: 'blockchain',
      name: 'AgTech Traceability Strategist',
      title: 'Blockchain / Supply Chain',
      institution: 'Independent Consultant',
      icon: Lock,
      priority: 'MEDIUM',
      color: 'indigo',
      score: { before: '0/10', after: '10/10' },
      issue: 'Cannot prove unique crop story to buyers.',
      solution: '"Farm Story" NFT Certificate. Blockchain-verified moon phase + KNF data.',
      metric: 'Buyers pay 40% premium for verified vanilla'
    },
    {
      id: 'ar-developer',
      name: 'Senior AR/UX Developer',
      title: 'Mobile/AR for Agriculture',
      institution: 'AgTech Development Firm',
      icon: Smartphone,
      priority: 'HIGH',
      color: 'pink',
      score: { before: '3/10', after: '9/10' },
      issue: 'Farmer in field, insights on separate screen.',
      solution: 'AR "Farm View". Point phone → see plant IDs, harvest days, mana scores.',
      metric: '80% of farmers use AR mode weekly'
    },
    {
      id: 'vc',
      name: 'Impact AgTech Investor',
      title: 'Venture Capitalist / Business',
      institution: 'Regenerative Ag Fund',
      icon: TrendingUp,
      priority: 'URGENT',
      color: 'emerald',
      score: { before: '2/10', after: '10/10' },
      issue: 'Valuable data risks extraction from community.',
      solution: '"Data Sovereignty Cooperative". Farmers own data. Revenue: licenses + marketplace fees.',
      metric: '$500K ARR while maintaining farmer data sovereignty'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-md rounded-2xl p-6 md:p-8 border-2 border-blue-500/40">
        <h2 className="text-2xl md:text-4xl font-bold text-blue-400 mb-4">🚀 Phase 2: Advanced Features</h2>
        <p className="text-white/80 text-sm md:text-base mb-6">Next-generation capabilities: Database, AI vision, blockchain, AR, sustainable business</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {experts.map((expert) => {
            const Icon = expert.icon;
            const isSelected = selectedExpert === expert.id;
            return (
              <button
                key={expert.id}
                onClick={() => setSelectedExpert(isSelected ? null : expert.id)}
                className={`p-4 md:p-6 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'bg-blue-900/40 border-blue-500 scale-105'
                    : 'bg-white/5 border-blue-500/30 hover:border-blue-500/60'
                }`}
              >
                <div className="flex items-start gap-3 md:gap-4 mb-3">
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-sm md:text-lg mb-1">{expert.name}</h3>
                    <p className="text-xs text-white/60 mb-2">{expert.title}</p>
                    <p className="text-xs text-white/40">{expert.institution}</p>
                  </div>
                </div>
                
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                  expert.priority === 'URGENT' ? 'bg-red-600 text-white' :
                  expert.priority === 'HIGH' ? 'bg-orange-600 text-white' :
                  'bg-yellow-600 text-white'
                }`}>
                  {expert.priority}
                </div>
                
                <div className="flex gap-4 text-xs">
                  <div>
                    <p className="text-white/40">Before</p>
                    <p className="text-red-400 font-bold">{expert.score.before}</p>
                  </div>
                  <div>
                    <p className="text-white/40">After</p>
                    <p className="text-green-400 font-bold">{expert.score.after}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedExpert && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border-2 border-white/20">
          {experts.filter(e => e.id === selectedExpert).map(expert => {
            const Icon = expert.icon;
            return (
              <div key={expert.id}>
                <div className="flex items-center gap-4 mb-6">
                  <Icon className="w-10 h-10 md:w-12 md:h-12 text-blue-400" />
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{expert.name}</h3>
                    <p className="text-white/60 text-sm md:text-base">{expert.title}</p>
                  </div>
                </div>

                <div className="mb-6 bg-red-900/30 border-2 border-red-500/40 rounded-xl p-4 md:p-6">
                  <h4 className="text-lg md:text-xl font-bold text-red-400 mb-3">❌ ISSUE</h4>
                  <p className="text-white/90 text-sm md:text-base">{expert.issue}</p>
                </div>

                <div className="mb-6 bg-green-900/30 border-2 border-green-500/40 rounded-xl p-4 md:p-6">
                  <h4 className="text-lg md:text-xl font-bold text-green-400 mb-3">✅ SOLUTION</h4>
                  <p className="text-white/90 mb-4 text-sm md:text-base">{expert.solution}</p>
                  <p className="text-xs md:text-sm text-green-400 font-semibold">Success: {expert.metric}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
