"use client";
import { useState } from 'react';
import ExpertPanel from '@/components/ExpertPanel';
import ExpertPanelV2 from '@/components/ExpertPanelV2';
import { Brain, Rocket, Wrench } from 'lucide-react';

export default function DebugPage() {
  const [showExpertsV1, setShowExpertsV1] = useState(false);
  const [showExpertsV2, setShowExpertsV2] = useState(false);

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
          <a href="/" className="px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all">
            🏝️ Home
          </a>
        </div>

        <div className="bg-blue-900/30 border-2 border-blue-500/40 rounded-xl p-6 mb-6">
          <p className="text-blue-300 font-bold text-lg">🛠️ Technical Development Panel</p>
          <p className="text-white/80">Expert AI feedback, feature planning, and testing tools</p>
        </div>

        {/* EXPERT PANELS */}
        <div className="space-y-4">
          <button
            onClick={() => setShowExpertsV2(!showExpertsV2)}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <Rocket className="w-8 h-8" />
            {showExpertsV2 ? 'HIDE' : 'SHOW'} PHASE 2: Advanced Features (Database, AI, AR, Blockchain)
          </button>

          {showExpertsV2 && (
            <div className="mb-6">
              <ExpertPanelV2 />
            </div>
          )}

          <button
            onClick={() => setShowExpertsV1(!showExpertsV1)}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold text-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <Brain className="w-8 h-8" />
            {showExpertsV1 ? 'HIDE' : 'SHOW'} PHASE 1: Implemented Features (Run for Fresh Feedback)
          </button>

          {showExpertsV1 && (
            <div className="mb-6">
              <ExpertPanel />
            </div>
          )}
        </div>

        {/* TEST LINKS */}
        <div className="mt-8 bg-white/10 p-6 rounded-xl border-2 border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4">🧪 Testing Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/test-crops" className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-center hover:scale-105 transition-all">
              🌱 Test Crop Images
            </a>
            <a href="/choose-leila" className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-center hover:scale-105 transition-all">
              👑 Choose Leila
            </a>
            <a href="/api/test-connection" target="_blank" className="px-6 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-bold text-center hover:scale-105 transition-all">
              🔌 Test APIs
            </a>
            <a href="/dashboard" className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-center hover:scale-105 transition-all">
              📊 Dashboard
            </a>
          </div>
        </div>

        <div className="mt-6">
          <a href="/" className="px-8 py-4 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all inline-block">
            🏝️ Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
