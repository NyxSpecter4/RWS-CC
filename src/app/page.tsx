"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GoddessFace = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-70">
    <svg width="1000" height="1000" viewBox="0 0 200 200" className="translate-x-32 scale-110">
      <defs>
        <filter id="divineAura"><feGaussianBlur stdDeviation="1.5" /><feColorMatrix type="matrix" values="0 0 0 0 0.56 0 0 0 0 0.18 0 0 0 0 0.61 0 0 0 1 0"/></filter>
      </defs>
      {/* HIGH-ART PROFILE: Forehead, Nose, Lips, Chin */}
      <path 
        d="M100 20 C85 20 78 35 78 55 C78 60 80 65 82 70 C75 80 72 95 72 110 C72 135 85 160 100 175 C115 160 128 135 128 110 C128 95 125 80 118 70 C120 65 122 60 122 55 C122 35 115 20 100 20 Z" 
        fill="#1a0b2e" filter="url(#divineAura)" 
      />
      {/* Eye and Lip Detail */}
      <path d="M85 55 Q78 65 82 85" stroke="#FFE573" strokeWidth="0.2" fill="none" opacity="0.4" />
      <path d="M90 140 Q100 145 110 140" stroke="#FD437D" strokeWidth="0.5" fill="none" opacity="0.6" />
      {/* Flowing Hair */}
      <path d="M78 55 Q50 80 60 150 M122 55 Q150 80 140 150" stroke="#902F9B" strokeWidth="0.3" fill="none" opacity="0.4" />
    </svg>
  </div>
);

const CrateredMoon = () => (
  <div className="relative z-20">
    <svg width="450" height="450" viewBox="0 0 400 400" className="filter drop-shadow-[0_0_120px_rgba(255,229,115,0.35)]">
      <defs>
        <filter id="moonCraterShader">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="6" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#fdfde7" surfaceScale="8">
            <feDistantLight azimuth="45" elevation="65" />
          </feDiffuseLighting>
          <feComposite in="SourceGraphic" operator="in" />
        </filter>
        <radialGradient id="moonBody" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#d5d8dc" /></radialGradient>
      </defs>
      <circle cx="200" cy="200" r="185" fill="url(#moonBody)" filter="url(#moonCraterShader)" />
    </svg>
  </div>
);

export default function Home() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("Leila is sensing the farm...");

  const runEval = async () => {
    setOpen(true);
    const res = await fetch("/api/ai/chat", { method: "POST" });
    const data = await res.json();
    setText(data.response);
  };

  return (
    <main className="fixed inset-0 h-screen w-screen bg-[#020104] flex items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(144,47,155,0.15)_0%,transparent_70%)]" />
      <GoddessFace />
      <div className="flex flex-col items-center">
        <CrateredMoon />
        <div className="mt-12 text-center">
          <h1 className="text-6xl font-black tracking-[0.8em] text-[#FFE573] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-[#FFE573]">AKUA</h1>
          <p className="text-[10px] tracking-[1.2em] text-white/30 uppercase mt-4">Peak Mana • January 4, 2026</p>
        </div>
      </div>
      <button onClick={runEval} className="fixed bottom-10 left-10 z-50 px-10 py-5 bg-gradient-to-r from-[#902F9B] to-[#FD437D] rounded-full font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-transform">
        Evaluate Mana
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed top-0 left-0 h-full w-[450px] bg-black/95 backdrop-blur-3xl border-r border-white/10 z-[100] p-12 flex flex-col">
            <div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-bold text-[#FFE573] tracking-tighter">DIVINE AUDIT</h2><button onClick={() => setOpen(false)} className="text-white/20 text-3xl">✕</button></div>
            <p className="text-xl font-light italic leading-relaxed text-purple-100">"{text}"</p>
            <div className="mt-auto opacity-20 text-[9px] tracking-widest uppercase">OpenAI GPT-4o Brain Active</div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-10 right-10 z-40 text-right space-y-4 opacity-40">
        <div><p className="text-[9px] uppercase tracking-[0.4em]">Vanilla Orchid</p><p className="text-xs font-bold text-[#FFE573]">Rising Mana</p></div>
        <div><p className="text-[9px] uppercase tracking-[0.4em]">Māmaki Tea</p><p className="text-xs font-bold text-[#FFE573]">Akua Peak</p></div>
      </div>
    </main>
  );
}
