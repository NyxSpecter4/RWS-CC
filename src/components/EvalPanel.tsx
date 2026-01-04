"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EvalPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EvalPanel({ isOpen, onClose }: EvalPanelProps) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const runAudit = async () => {
    setLoading(true);
    const res = await fetch("/api/ai/evaluate", { method: "POST" });
    const data = await res.json();
    setText(data.critique);
    setLoading(false);
  };

  React.useEffect(() => { if (isOpen) runAudit(); }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          className="fixed top-0 right-0 h-screen w-full md:w-[500px] bg-black/90 backdrop-blur-3xl border-l border-white/10 z-[100] p-10 flex flex-col"
        >
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-[#FFE573] tracking-tighter uppercase">Divine Audit</h2>
            <button onClick={onClose} className="text-white/40 text-2xl">✕</button>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-32 bg-white/5 rounded w-full"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <p className="text-xl font-light italic leading-relaxed text-purple-100">"{text}"</p>
              
              {/* MANA STREAM (CROP DATA) */}
              <div className="pt-10 border-t border-white/5 space-y-6">
                <p className="text-[10px] uppercase tracking-widest text-white/30">Mana Stream (1-Acre Vitals)</p>
                {['Vanilla Orchid', 'Māmaki Tea'].map(crop => (
                  <div key={crop}>
                    <div className="flex justify-between text-xs mb-2"><span>{crop}</span><span className="text-[#FFE573]">88% Mana</span></div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full w-[88%] bg-[#FFE573]"></div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="mt-auto text-[10px] uppercase tracking-widest text-white/10">OpenAI GPT-4o Intelligence Core</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
