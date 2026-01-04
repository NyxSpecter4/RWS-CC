"use client";
import { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';

export const AIDesignPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string>('');

  const analyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai/design-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analyze: true })
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult('Error: ' + e);
    }
    setAnalyzing(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[#902F9B] to-[#FD437D] 
                   shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Sparkles className="w-8 h-8 text-[#FFE573]" />
        </button>
      ) : (
        <div className="w-96 h-[500px] bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 
                      shadow-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-[#FFE573]" />
              <h2 className="text-xl font-bold text-white">AI Design Feedback</h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">✕</button>
          </div>
          
          <button
            onClick={analyze}
            disabled={analyzing}
            className="w-full py-3 mb-4 rounded-xl bg-gradient-to-r from-[#902F9B] to-[#FD437D] 
                     text-white font-bold disabled:opacity-50"
          >
            {analyzing ? 'Analyzing...' : 'Analyze Design'}
          </button>
          
          <div className="flex-1 overflow-y-auto bg-white/5 rounded-lg p-4">
            <pre className="text-xs text-white/80 whitespace-pre-wrap">{result || 'Click analyze to get AI feedback'}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
