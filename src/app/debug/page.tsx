"use client";
import { useState } from 'react';
import LeilaGoddess from '@/components/LeilaGoddess';

export default function DebugPage() {
  const [apiTest, setApiTest] = useState('');
  const [envCheck, setEnvCheck] = useState('');

  const testAPI = async () => {
    try {
      const res = await fetch('/api/ai/design-feedback', { method: 'POST' });
      const data = await res.json();
      setApiTest(JSON.stringify(data, null, 2));
    } catch (e) {
      setApiTest('ERROR: ' + e);
    }
  };

  const checkEnv = async () => {
    try {
      const res = await fetch('/api/env-check');
      const data = await res.json();
      setEnvCheck(JSON.stringify(data, null, 2));
    } catch (e) {
      setEnvCheck('ERROR: ' + e);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-4xl font-bold text-[#FFE573] mb-8">🔧 LEILA DEBUG DASHBOARD</h1>
      
      {/* Component Tests */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="text-2xl text-white mb-4">Goddess Component Test</h2>
          <div className="flex justify-center bg-black/50 p-8 rounded-lg">
            <LeilaGoddess isSpeaking={true} size="lg" showMana={true} />
          </div>
          <p className="text-green-400 mt-4">✓ LeilaGoddess renders</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl">
          <h2 className="text-2xl text-white mb-4">API Tests</h2>
          <button 
            onClick={testAPI}
            className="w-full mb-4 py-3 bg-[#902F9B] text-white rounded-lg hover:bg-[#FD437D]"
          >
            Test Design Feedback API
          </button>
          <button 
            onClick={checkEnv}
            className="w-full py-3 bg-[#FFE573] text-black rounded-lg hover:bg-[#FD437D]"
          >
            Check Environment Variables
          </button>
          {apiTest && (
            <pre className="mt-4 p-4 bg-black/50 text-green-400 text-xs overflow-auto max-h-40">
              {apiTest}
            </pre>
          )}
          {envCheck && (
            <pre className="mt-4 p-4 bg-black/50 text-green-400 text-xs overflow-auto">
              {envCheck}
            </pre>
          )}
        </div>
      </div>

      {/* File Status */}
      <div className="bg-white/10 p-6 rounded-xl mb-8">
        <h2 className="text-2xl text-white mb-4">Component Status</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-900/30 p-4 rounded-lg">
            <p className="text-green-400 font-bold">✓ LeilaGoddess.tsx</p>
            <p className="text-xs text-white/60">Component exists and renders</p>
          </div>
          <div className="bg-yellow-900/30 p-4 rounded-lg">
            <p className="text-yellow-400 font-bold">? AIDesignPanel.tsx</p>
            <p className="text-xs text-white/60">Check if exists</p>
          </div>
          <div className="bg-blue-900/30 p-4 rounded-lg">
            <p className="text-blue-400 font-bold">ℹ API Routes</p>
            <p className="text-xs text-white/60">Test above</p>
          </div>
        </div>
      </div>

      {/* Deployment Info */}
      <div className="bg-white/10 p-6 rounded-xl">
        <h2 className="text-2xl text-white mb-4">Deployment Info</h2>
        <div className="space-y-2 text-white/80">
          <p>• Built at: {new Date().toISOString()}</p>
          <p>• Environment: {process.env.NODE_ENV}</p>
          <p className="text-[#FFE573]">• If you see this page, deployment is working!</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 flex gap-4">
        <a href="/leila" className="px-6 py-3 bg-[#902F9B] text-white rounded-lg hover:bg-[#FD437D]">
          Go to /leila
        </a>
        <a href="/" className="px-6 py-3 bg-[#FFE573] text-black rounded-lg hover:bg-[#FD437D]">
          Go to Home
        </a>
      </div>
    </div>
  );
}
