'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Brain, BarChart3, Map, Zap, Cloud, Droplets, Thermometer, Wind, Sun } from 'lucide-react';

const OrchestrationPanel = ({ isOpen, onClose }) => {
  const [thoughtStream, setThoughtStream] = useState([]);
  const [sensorData, setSensorData] = useState([
    { label: 'Soil Moisture', value: '68%', icon: <Droplets className="w-4 h-4" />, color: 'bg-green-500', trend: '+2%' },
    { label: 'Sunlight', value: '72%', icon: <Sun className="w-4 h-4" />, color: 'bg-amber-500', trend: 'steady' },
    { label: 'Rainfall', value: '0.2"', icon: <Cloud className="w-4 h-4" />, color: 'bg-blue-500', trend: 'light' },
    { label: 'Temperature', value: '72°F', icon: <Thermometer className="w-4 h-4" />, color: 'bg-red-500', trend: '+1°' },
    { label: 'Humidity', value: '65%', icon: <Droplets className="w-4 h-4" />, color: 'bg-cyan-500', trend: '-3%' },
    { label: 'Wind Speed', value: '5 mph', icon: <Wind className="w-4 h-4" />, color: 'bg-purple-500', trend: 'gentle' },
  ]);
  const [mapPoints] = useState([
    { x: 30, y: 40, label: 'Māmaki Grove', color: '#14BB5C' },
    { x: 60, y: 25, label: 'Vanilla Orchids', color: '#902F9B' },
    { x: 45, y: 70, label: 'Bamboo Shelter', color: '#FFB347' },
    { x: 75, y: 55, label: 'Rainwater Catch', color: '#4A90E2' },
    { x: 20, y: 60, label: 'Compost Zone', color: '#8B4513' },
  ]);
  const thoughtStreamRef = useRef(null);

  // Simulate AI thought stream
  useEffect(() => {
    if (isOpen) {
      const thoughts = [
        "Initializing Leila's cognitive matrix...",
        "Accessing Akua Moon lunar database...",
        "Syncing with Puna weather satellites...",
        "Analyzing soil sensor network across 1‑acre grid...",
        "Detecting Māmaki leaf chlorophyll levels: optimal.",
        "Vanilla orchid pollination window: 3 days remaining.",
        "Bamboo growth rate: 12 inches per week.",
        "Calculating water retention in volcanic soil...",
        "Integrating traditional Hawaiian moon calendar with modern agronomy...",
        "Formulating divine‑precision guidance for Kahu...",
        "Recommendation: Harvest upper Māmaki leaves at dawn tomorrow.",
        "Alert: Light rainfall expected in 6 hours – adjust irrigation.",
        "Sacred geometry of farm layout aligns with Mauna Kea ley lines.",
        "Oracle synthesis complete. Ready for Kahu's command.",
      ];
      
      setThoughtStream([]);
      
      thoughts.forEach((thought, index) => {
        setTimeout(() => {
          setThoughtStream(prev => [...prev, thought]);
        }, index * 600);
      });
    } else {
      setThoughtStream([]);
    }
  }, [isOpen]);

  // Auto-scroll thought stream
  useEffect(() => {
    if (thoughtStreamRef.current) {
      thoughtStreamRef.current.scrollTop = thoughtStreamRef.current.scrollHeight;
    }
  }, [thoughtStream]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-xl transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-3xl border-l border-white/20 z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#902F9B] to-[#14BB5C] rounded-2xl flex items-center justify-center shadow-2xl">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-white tracking-wide">Orchestration Altar</h2>
              <p className="text-white/60 text-sm">Real‑time divine intelligence for the 1‑acre farm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="h-full overflow-y-auto p-8 space-y-8 internal-panel-scroll">
          {/* Mana Stream */}
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-[#14BB5C]" />
              <h3 className="text-xl font-medium text-white">Mana Stream</h3>
              <span className="text-xs px-3 py-1 bg-[#902F9B]/40 text-white/90 rounded-full ml-auto">Live</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {sensorData.map((sensor, idx) => (
                <div key={idx} className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-[#14BB5C]/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${sensor.color} bg-opacity-20`}>
                        {sensor.icon}
                      </div>
                      <span className="text-white/80 text-sm">{sensor.label}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${sensor.color}`} />
                  </div>
                  <div className="text-3xl font-light text-white mb-2">{sensor.value}</div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${sensor.color} rounded-full`}
                      style={{ width: `${Math.random() * 60 + 40}%` }}
                    />
                  </div>
                  <div className="mt-3 text-white/50 text-xs">
                    Trend: <span className="text-white">{sensor.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 text-white/50 text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Optimal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span>Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>Attention</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Thought Stream */}
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-[#902F9B]" />
              <h3 className="text-xl font-medium text-white">Thought Stream</h3>
              <span className="text-xs px-3 py-1 bg-[#14BB5C]/40 text-white/90 rounded-full ml-auto">Thinking</span>
            </div>
            <div 
              ref={thoughtStreamRef}
              className="h-80 overflow-y-auto space-y-4 p-4 bg-black/30 rounded-2xl internal-panel-scroll"
            >
              {thoughtStream.map((thought, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-xl border ${
                    thought.includes('Recommendation') || thought.includes('Alert')
                      ? 'bg-[#14BB5C]/20 border-[#14BB5C]/40'
                      : thought.includes('Oracle')
                      ? 'bg-[#902F9B]/20 border-[#902F9B]/40'
                      : 'bg-white/10 border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      thought.includes('Recommendation') ? 'bg-[#14BB5C]' : 
                      thought.includes('Oracle') ? 'bg-[#902F9B]' : 
                      'bg-white/60'
                    }`} />
                    <div className="flex-1">
                      <p className="text-white/95 text-sm leading-relaxed">{thought}</p>
                      <p className="text-white/40 text-xs mt-2">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {thoughtStream.length === 0 && (
                <div className="text-center py-12 text-white/50">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Awaiting cognitive activation...</p>
                  <p className="text-sm mt-2">The oracle will speak when the panel opens.</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between text-white/50 text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#14BB5C] rounded-full" />
                  <span>Actionable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#902F9B] rounded-full" />
                  <span>Oracle</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white/60 rounded-full" />
                  <span>Analysis</span>
                </div>
              </div>
              <div className="text-white/70">
                {thoughtStream.length} thoughts
              </div>
            </div>
          </div>
          
          {/* Sacred Map */}
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Map className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-medium text-white">Sacred Map</h3>
              <span className="text-xs px-3 py-1 bg-amber-500/40 text-white/90 rounded-full ml-auto">1‑Acre Grid</span>
            </div>
            <div className="relative h-80 bg-gradient-to-br from-black/40 to-[#0a1f1a]/60 rounded-2xl border border-white/20 overflow-hidden">
              {/* Grid */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-white/20" style={{ left: `${i * 10}%` }} />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-white/20" style={{ top: `${i * 10}%` }} />
                ))}
              </div>
              
              {/* Boundary */}
              <div className="absolute inset-8 border border-white/40 rounded-xl" />
              
              {/* Points */}
              {mapPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-white/60 backdrop-blur-md flex items-center justify-center cursor-pointer group"
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  <div 
                    className="w-6 h-6 rounded-full animate-pulse"
                    style={{ backgroundColor: point.color }}
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
                    {point.label}
                  </div>
                </div>
              ))}
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-lg rounded-xl p-4 text-white/80 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#14BB5C]" />
                  <span>Māmaki</span>
                  <div className="w-4 h-4 rounded-full bg-[#902F9B] ml-3" />
                  <span>Vanilla</span>
                  <div className="w-4 h-4 rounded-full bg-[#FFB347] ml-3" />
                  <span>Bamboo</span>
                </div>
              </div>
              
              {/* Coordinates */}
              <div className="absolute top-4 right-4 text-white/50 text-xs bg-black/50 px-3 py-2 rounded-lg">
                Puna, HI • 19°37'N 155°04'W
              </div>
            </div>
            <div className="mt-6 text-white/50 text-sm">
              <p>Each sacred node represents a convergence of plant energy, lunar cycles, and ancestral wisdom.</p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center text-white/40 text-sm pt-8 border-t border-white/10">
            <p>Akua Moon • January 3, 2026 • Leila's Watch Active</p>
            <p className="text-xs mt-2">Grant‑Ready: Transparent Precision Agriculture Interface</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrchestrationPanel;