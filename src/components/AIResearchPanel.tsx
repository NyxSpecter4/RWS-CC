'use client';
import { useState } from 'react';
import { Brain, X, Search, Sparkles } from 'lucide-react';

export default function AIResearchPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleResearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/ai-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category: 'agtech' })
      });
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2"
      >
        <Brain className="w-6 h-6" />
        <span className="font-semibold">AI Research</span>
        <Sparkles className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
          
          <div className="fixed top-0 right-0 h-screen w-full max-w-2xl bg-white/90 backdrop-blur-2xl z-50 shadow-2xl p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#902F9B] to-[#FD437D] bg-clip-text text-transparent">
                Leila AI Research
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Research Query</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
                  placeholder="Ask about agtech, Hawaiian culture, hydroponics..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#902F9B]"
                />
                <button
                  onClick={handleResearch}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  Research
                </button>
              </div>
            </div>

            {results && (
              <div className="space-y-6">
                <div className="bg-white/50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Findings</h3>
                  {results.research_findings?.map((f: any, i: number) => (
                    <div key={i} className="mb-4 p-4 bg-white rounded-lg">
                      <p className="font-semibold">{f.summary}</p>
                      <p className="text-sm text-gray-600 mt-2">Source: {f.source}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {results.recommendations?.map((r: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-3">Cultural Context</h3>
                  <p className="italic">"{results.cultural_context}"</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Authenticity:</span>
                    <span className="px-3 py-1 bg-[#FFE573] rounded-full font-bold">{results.authenticity_score}/10</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
