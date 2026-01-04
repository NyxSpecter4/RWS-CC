"use client";
import { useState, useEffect } from 'react';
import ExpertPanel from '@/components/ExpertPanel';
import ExpertPanelV2 from '@/components/ExpertPanelV2';
import { Brain, Rocket, Wrench, Lock, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';

export default function DebugPage() {
  const [showExpertsV1, setShowExpertsV1] = useState(false);
  const [showExpertsV2, setShowExpertsV2] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // LEILA TESTER
  const [leilaImage, setLeilaImage] = useState('');
  const [leilaLoading, setLeilaLoading] = useState(false);
  const [ratings, setRatings] = useState<{url: string, rating: 'up' | 'down', timestamp: string}[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem('debug_auth');
    if (auth === 'CB') {
      setAuthenticated(true);
      // Load ratings
      const saved = localStorage.getItem('leila_ratings');
      if (saved) setRatings(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'CB') {
      localStorage.setItem('debug_auth', 'CB');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('debug_auth');
    setAuthenticated(false);
    setPassword('');
  };

  const generateLeila = async () => {
    setLeilaLoading(true);
    try {
      const res = await fetch('/api/generate-goddess', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setLeilaImage(data.imageUrl);
      }
    } catch (e) {
      console.error('Error:', e);
    } finally {
      setLeilaLoading(false);
    }
  };

  const rateLeila = (rating: 'up' | 'down') => {
    if (!leilaImage) return;
    
    const newRating = {
      url: leilaImage,
      rating: rating,
      timestamp: new Date().toISOString()
    };
    
    const updated = [...ratings, newRating];
    setRatings(updated);
    localStorage.setItem('leila_ratings', JSON.stringify(updated));
    
    alert(`${rating === 'up' ? '👍 Liked!' : '👎 Disliked'} - Leila is learning your preferences!`);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-blue-500/40">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Lock className="w-12 h-12 text-blue-400" />
              <h1 className="text-3xl font-black text-white">DEBUG ACCESS</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2 font-bold">Password Required</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white font-bold text-center text-2xl focus:outline-none focus:border-blue-400"
                  placeholder="Enter password"
                  autoFocus
                />
              </div>
              {error && (
                <div className="bg-red-900/40 border-2 border-red-500 rounded-xl p-3">
                  <p className="text-red-400 font-bold text-center">{error}</p>
                </div>
              )}
              <button type="submit" className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-xl hover:scale-105 transition-all">
                🔓 Unlock Debug
              </button>
            </form>
            <div className="mt-6">
              <a href="/" className="block text-center px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all">
                🏝️ Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wrench className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B]">
              🔧 DEBUG PAGE
            </h1>
          </div>
          <div className="flex gap-3">
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700">
              🔒 Lock
            </button>
            <a href="/" className="px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all">
              🏝️ Home
            </a>
          </div>
        </div>

        {/* LEILA TESTER */}
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-2 border-purple-500/40 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">👑 Leila Goddess Tester</h2>
          <p className="text-white/80 mb-6">Generate different versions of Leila and rate them. She'll learn your preferences!</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                {leilaImage ? (
                  <img src={leilaImage} alt="Leila" className="w-full h-96 object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-white/40">Generate a Leila to test</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={generateLeila}
                  disabled={leilaLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-5 h-5 ${leilaLoading ? 'animate-spin' : ''}`} />
                  {leilaLoading ? 'Generating...' : 'Generate New Leila'}
                </button>
              </div>
              
              {leilaImage && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => rateLeila('up')}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <ThumbsUp className="w-5 h-5" />
                    Like This
                  </button>
                  <button
                    onClick={() => rateLeila('down')}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <ThumbsDown className="w-5 h-5" />
                    Dislike
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="text-xl font-bold text-white mb-4">📊 Rating History</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {ratings.length === 0 ? (
                  <p className="text-white/60">No ratings yet. Start rating Leilas!</p>
                ) : (
                  ratings.slice().reverse().map((r, i) => (
                    <div key={i} className="bg-white/5 p-3 rounded-lg flex items-center gap-3">
                      {r.rating === 'up' ? (
                        <ThumbsUp className="w-5 h-5 text-green-400" />
                      ) : (
                        <ThumbsDown className="w-5 h-5 text-red-400" />
                      )}
                      <div className="flex-1">
                        <p className="text-white/80 text-sm">{new Date(r.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 bg-blue-900/40 p-3 rounded-lg">
                <p className="text-blue-400 font-bold">Total Ratings: {ratings.length}</p>
                <p className="text-green-400">👍 Likes: {ratings.filter(r => r.rating === 'up').length}</p>
                <p className="text-red-400">👎 Dislikes: {ratings.filter(r => r.rating === 'down').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* REST OF DEBUG PAGE */}
        <div className="space-y-4">
          <button onClick={() => setShowExpertsV2(!showExpertsV2)} className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
            <Rocket className="w-8 h-8" />
            {showExpertsV2 ? 'HIDE' : 'SHOW'} PHASE 2: Advanced Features
          </button>
          {showExpertsV2 && <ExpertPanelV2 />}

          <button onClick={() => setShowExpertsV1(!showExpertsV1)} className="w-full px-6 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold text-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
            <Brain className="w-8 h-8" />
            {showExpertsV1 ? 'HIDE' : 'SHOW'} PHASE 1: Implemented Features
          </button>
          {showExpertsV1 && <ExpertPanel />}
        </div>

        <div className="mt-8 bg-white/10 p-6 rounded-xl border-2 border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4">🧪 Testing Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/test-crops" className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-center hover:scale-105 transition-all">🌱 Test Crop Images</a>
            <a href="/choose-leila" className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-center hover:scale-105 transition-all">👑 Choose Leila</a>
            <a href="/api/test-connection" target="_blank" className="px-6 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-bold text-center hover:scale-105 transition-all">🔌 Test APIs</a>
            <a href="/dashboard" className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-center hover:scale-105 transition-all">📊 Dashboard</a>
          </div>
        </div>
      </div>
    </div>
  );
}
