"use client";
import { useState, useEffect } from 'react';
import ExpertPanel from '@/components/ExpertPanel';
import ExpertPanelV2 from '@/components/ExpertPanelV2';
import { Brain, Rocket, Lock, ThumbsUp, ThumbsDown, RefreshCw, Sparkles } from 'lucide-react';

export default function DebugPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showV1, setShowV1] = useState(false);
  const [showV2, setShowV2] = useState(false);
  const [leilaImg, setLeilaImg] = useState('');
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<any[]>([]);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [pendingRating, setPendingRating] = useState<'up' | 'down' | null>(null);
  const [improvedPrompt, setImprovedPrompt] = useState('');

  useEffect(() => {
    if (localStorage.getItem('debug_auth') === 'CB') {
      setAuthenticated(true);
      const saved = localStorage.getItem('leila_ratings');
      if (saved) setRatings(JSON.parse(saved));
    }
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'CB') {
      localStorage.setItem('debug_auth', 'CB');
      setAuthenticated(true);
    } else {
      setError('Wrong password');
      setPassword('');
    }
  };

  const logout = () => {
    localStorage.removeItem('debug_auth');
    setAuthenticated(false);
  };

  const generate = async () => {
    setLoading(true);
    try {
      // If we have an improved prompt, use it
      const endpoint = improvedPrompt 
        ? '/api/generate-leila-smart'
        : '/api/generate-goddess';
      
      const res = await fetch(endpoint, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          improvedPrompt: improvedPrompt || undefined,
          previousRatings: ratings.slice(-5) // Send last 5 ratings for context
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setLeilaImg(data.imageUrl);
        if (data.promptUsed) {
          setImprovedPrompt(data.promptUsed);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const startRating = (r: 'up' | 'down') => {
    setPendingRating(r);
    setShowNotes(true);
  };

  const submitRating = async () => {
    if (!leilaImg || !pendingRating) return;

    const newRating = { 
      url: leilaImg, 
      rating: pendingRating, 
      notes: notes.trim(),
      time: new Date().toISOString() 
    };
    
    const updated = [...ratings, newRating];
    setRatings(updated);
    localStorage.setItem('leila_ratings', JSON.stringify(updated));

    // If user provided notes, analyze and improve the prompt
    if (notes.trim()) {
      await analyzeAndImprovePrompt(updated);
    }

    alert(pendingRating === 'up' ? '👍 Saved! AI learning your preferences...' : '👎 Saved! AI will avoid this style...');
    
    setNotes('');
    setShowNotes(false);
    setPendingRating(null);
  };

  const analyzeAndImprovePrompt = async (allRatings: any[]) => {
    try {
      const res = await fetch('/api/analyze-leila-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ratings: allRatings })
      });

      const data = await res.json();
      if (data.success && data.improvedPrompt) {
        setImprovedPrompt(data.improvedPrompt);
        console.log('✨ Prompt improved based on your feedback!');
      }
    } catch (error) {
      console.error('Error analyzing feedback:', error);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] flex items-center justify-center p-4">
        <div className="bg-white/10 rounded-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lock className="w-12 h-12 text-blue-400" />
            <h1 className="text-3xl font-black text-white">DEBUG</h1>
          </div>
          <form onSubmit={login}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 rounded-xl text-white text-center text-2xl font-bold mb-4"
              placeholder="Password"
              autoFocus
            />
            {error && <p className="text-red-400 text-center mb-4">{error}</p>}
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl">
              🔓 Unlock
            </button>
          </form>
          <a href="/" className="block text-center mt-6 bg-purple-600 text-white py-3 rounded-xl font-bold">
            🏝️ Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-white">🔧 DEBUG</h1>
          <div className="flex gap-3">
            <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold">🔒 Lock</button>
            <a href="/" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold">🏝️ Home</a>
          </div>
        </div>

        <div className="bg-purple-900/40 rounded-2xl p-6 mb-6 border-2 border-purple-500/40">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-purple-400">👑 Leila Tester</h2>
            {improvedPrompt && (
              <div className="flex items-center gap-2 bg-green-900/40 px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-bold">AI Learning Active</span>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                {leilaImg ? (
                  <img src={leilaImg} className="w-full h-80 object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-80 bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-white/40">Click Generate</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={generate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold mb-3 flex items-center justify-center gap-2"
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} />
                {loading ? 'Generating...' : improvedPrompt ? 'Generate (AI Improved)' : 'Generate New'}
              </button>
              
              {leilaImg && !showNotes && (
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => startRating('up')} 
                    className="bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700"
                  >
                    <ThumbsUp /> Like
                  </button>
                  <button 
                    onClick={() => startRating('down')} 
                    className="bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700"
                  >
                    <ThumbsDown /> Dislike
                  </button>
                </div>
              )}

              {showNotes && (
                <div className="bg-white/10 rounded-xl p-4 border-2 border-yellow-500/40">
                  <p className="text-yellow-400 font-bold mb-3">
                    {pendingRating === 'up' ? '👍 What do you LIKE?' : '👎 What do you DISLIKE?'}
                  </p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white/20 text-white p-3 rounded-lg mb-3 min-h-24"
                    placeholder="e.g., 'Love the hair and eyes, but face is too angular. Want softer features and warmer smile.'"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={submitRating}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
                    >
                      ✅ Submit & Learn
                    </button>
                    <button
                      onClick={() => {
                        setShowNotes(false);
                        setPendingRating(null);
                        setNotes('');
                      }}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-bold hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-white/60 text-xs mt-2">
                    💡 AI will analyze your notes and improve future generations!
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="text-xl font-bold text-white mb-4">📊 Ratings & Notes</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
                {ratings.length === 0 ? (
                  <p className="text-white/60">No ratings yet</p>
                ) : (
                  ratings.slice().reverse().map((r, i) => (
                    <div key={i} className="bg-white/5 p-3 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        {r.rating === 'up' ? <ThumbsUp className="text-green-400 w-5 h-5" /> : <ThumbsDown className="text-red-400 w-5 h-5" />}
                        <p className="text-white/80 text-sm">{new Date(r.time).toLocaleString()}</p>
                      </div>
                      {r.notes && (
                        <p className="text-white/70 text-sm italic bg-white/5 p-2 rounded">
                          "{r.notes}"
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="bg-blue-900/40 p-3 rounded">
                <p className="text-white font-bold">Total: {ratings.length}</p>
                <p className="text-green-400">👍 Likes: {ratings.filter(r => r.rating === 'up').length}</p>
                <p className="text-red-400">👎 Dislikes: {ratings.filter(r => r.rating === 'down').length}</p>
                <p className="text-yellow-400">📝 With Notes: {ratings.filter(r => r.notes).length}</p>
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => setShowV2(!showV2)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mb-4 flex items-center justify-center gap-3">
          <Rocket /> {showV2 ? 'HIDE' : 'SHOW'} PHASE 2
        </button>
        {showV2 && <div className="mb-6"><ExpertPanelV2 /></div>}

        <button onClick={() => setShowV1(!showV1)} className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold mb-4 flex items-center justify-center gap-3">
          <Brain /> {showV1 ? 'HIDE' : 'SHOW'} PHASE 1
        </button>
        {showV1 && <div className="mb-6"><ExpertPanel /></div>}

        <div className="bg-white/10 p-6 rounded-xl">
          <h3 className="text-2xl font-bold text-white mb-4">🧪 Test Tools</h3>
          <div className="grid grid-cols-4 gap-4">
            <a href="/test-crops" className="bg-green-600 text-white py-4 rounded-xl font-bold text-center">🌱 Crops</a>
            <a href="/choose-leila" className="bg-purple-600 text-white py-4 rounded-xl font-bold text-center">👑 Choose</a>
            <a href="/api/test-connection" className="bg-yellow-600 text-white py-4 rounded-xl font-bold text-center">🔌 APIs</a>
            <a href="/dashboard" className="bg-blue-600 text-white py-4 rounded-xl font-bold text-center">📊 Dashboard</a>
          </div>
        </div>
      </div>
    </div>
  );
}
