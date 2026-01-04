'use client';
import { useState, useEffect } from 'react';
import { Brain, AlertCircle, CheckCircle, Code } from 'lucide-react';

export default function ExpertPanel() {
  const [experts, setExperts] = useState<any>(null);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    fetch('/api/expert-panel', { method: 'POST', body: JSON.stringify({}) })
      .then(r => r.json())
      .then(setExperts);
  }, []);

  if (!experts) return <div className="text-white">Loading expert panel...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#902F9B]/20 to-[#FD437D]/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-[#FFE573] mb-4">🧠 AI Expert Panel Analysis</h2>
        <p className="text-white/80 mb-4">Real experts from DeepSeek research analyzing Project Leila:</p>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 p-4 rounded-lg text-center">
            <p className="text-sm text-white/60">Cultural Authenticity</p>
            <p className="text-3xl font-bold text-[#FFE573]">{experts.panel_summary.avg_cultural_authenticity}/10</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg text-center">
            <p className="text-sm text-white/60">Tech Maturity</p>
            <p className="text-3xl font-bold text-[#FD437D]">{experts.panel_summary.avg_tech_maturity}/10</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg text-center">
            <p className="text-sm text-white/60">Grant Potential</p>
            <p className="text-3xl font-bold text-[#902F9B]">{experts.panel_summary.avg_grant_potential}/10</p>
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            URGENT PRIORITIES ({experts.panel_summary.urgent_priorities.length})
          </h3>
          {experts.panel_summary.urgent_priorities.map((p: any, i: number) => (
            <div key={i} className="mb-3 pb-3 border-b border-red-500/20 last:border-0">
              <p className="text-white font-semibold">{p.expert}: {p.issue}</p>
              <p className="text-green-400 text-sm mt-1">→ {p.solution}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {experts.experts.map((expert: any, i: number) => (
          <button
            key={i}
            onClick={() => setSelectedExpert(expert)}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-[#FFE573] transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{expert.avatar}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{expert.name}</h3>
                <p className="text-sm text-white/60 mb-2">{expert.title}</p>
                <p className="text-xs text-[#FFE573]">{expert.domain}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedExpert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-gradient-to-br from-[#1a0b2e] to-black w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-[#FFE573] p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedExpert.avatar}</div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedExpert.name}</h2>
                  <p className="text-white/60">{selectedExpert.title}</p>
                  <p className="text-[#FFE573] font-semibold mt-1">{selectedExpert.domain}</p>
                </div>
              </div>
              <button onClick={() => setSelectedExpert(null)} className="text-white/60 hover:text-white text-2xl">✕</button>
            </div>

            <div className="space-y-6">
              {Object.entries(selectedExpert.feedback).map(([key, value]: [string, any]) => {
                if (key === 'overall') {
                  return (
                    <div key={key} className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
                      <p className="text-white/90 text-lg italic">"{value}"</p>
                      <p className="text-right text-white/60 mt-2">— {selectedExpert.name}</p>
                    </div>
                  );
                }

                return (
                  <div key={key} className="bg-white/5 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-[#FFE573] mb-3 capitalize">{key.replace(/_/g, ' ')}</h3>
                    
                    <div className="mb-4">
                      <p className="text-sm text-red-400 font-semibold mb-2">❌ ISSUE:</p>
                      <p className="text-white/80">{value.issue}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-green-400 font-semibold mb-2">✅ SOLUTION:</p>
                      <p className="text-white/80">{value.solution}</p>
                    </div>

                    {value.code && (
                      <div>
                        <button
                          onClick={() => setShowCode(!showCode)}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-2"
                        >
                          <Code className="w-4 h-4" />
                          {showCode ? 'Hide' : 'Show'} Implementation Code
                        </button>
                        {showCode && (
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            {value.code}
                          </pre>
                        )}
                      </div>
                    )}

                    <div className="flex gap-4 mt-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        value.priority === 'URGENT' ? 'bg-red-500' :
                        value.priority === 'HIGH' ? 'bg-orange-500' : 'bg-blue-500'
                      } text-white`}>
                        {value.priority} PRIORITY
                      </span>
                      
                      {value.cultural_authenticity && (
                        <span className="px-3 py-1 bg-purple-500/30 border border-purple-500 rounded-full text-xs text-white">
                          Cultural: {value.cultural_authenticity}/10
                        </span>
                      )}
                      
                      {value.grant_potential && (
                        <span className="px-3 py-1 bg-green-500/30 border border-green-500 rounded-full text-xs text-white">
                          Grant Potential: {value.grant_potential}/10
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
