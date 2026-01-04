"use client";
import { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function ChooseLeila() {
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [moods, setMoods] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState<'generate' | 'choose' | 'moods'>('generate');

  const baseLeilaPrompt = `Photorealistic portrait of a stunning Hawaiian-Japanese goddess, medium format photograph shot on Hasselblad camera with 80mm f/2.8 lens. Beautiful mixed-heritage woman in her early 30s with warm golden-brown skin, elegant almond-shaped eyes with gentle upward tilt, high cheekbones, delicate nose bridge, full graceful lips. Long flowing black hair with soft natural waves, adorned with traditional Hawaiian lei po'o of white plumeria flowers and vibrant green maile leaves. Contemporary interpretation of Hawaiian kīhei shoulder garment made from fine undyed kapa cloth with subtle geometric patterns, draped elegantly. Simple gold necklace with Hawaiian ipu gourd pendant. Cinematic Rembrandt lighting, soft natural glow. Background is soft misty Hawaiian rainforest at dawn. Hyper-detailed with realistic skin texture, individual hair strands catching light, lifelike moisture on flowers. National Geographic quality, 8k resolution, natural skin, authentic details.`;

  const moodPrompts = {
    wise: `${baseLeilaPrompt} Expression: Serene, wise, gentle knowing smile, eyes showing deep understanding and compassion. Embodying spirit of Laka goddess of growth.`,
    happy: `${baseLeilaPrompt} Expression: Warm bright smile, joyful eyes, radiant happiness, celebrating a bountiful harvest. Pure aloha spirit.`,
    concerned: `${baseLeilaPrompt} Expression: Gentle concern, slightly furrowed brow, caring worried look, motherly protective energy. Nurturing caution.`,
    excited: `${baseLeilaPrompt} Expression: Excited anticipation, wide bright eyes, energetic smile, enthusiasm about new growth. Dynamic positive energy.`,
    calm: `${baseLeilaPrompt} Expression: Perfect tranquility, peaceful meditation, soft serene smile, eyes closed or half-closed. Deep inner peace.`,
    playful: `${baseLeilaPrompt} Expression: Mischievous playful smile, twinkling eyes, lighthearted joy, teasing gentle expression. Youthful spirit.`
  };

  const generateCandidates = async () => {
    setGenerating(true);
    const newCandidates: string[] = [];

    try {
      for (let i = 0; i < 4; i++) {
        const res = await fetch('/api/generate-goddess', { method: 'POST' });
        const data = await res.json();
        
        if (data.success && data.imageUrl) {
          // Convert to base64
          const base64 = await urlToBase64(data.imageUrl);
          newCandidates.push(base64);
        }
        
        // Wait between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      setCandidates(newCandidates);
      setStep('choose');
    } catch (error) {
      console.error('Error generating candidates:', error);
      alert('Error generating candidates');
    } finally {
      setGenerating(false);
    }
  };

  const generateMoods = async () => {
    if (!selectedCandidate) return;

    setGenerating(true);
    setStep('moods');
    const newMoods: Record<string, string> = {};

    try {
      for (const [mood, prompt] of Object.entries(moodPrompts)) {
        const res = await fetch('/api/generate-goddess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customPrompt: prompt })
        });
        
        const data = await res.json();
        
        if (data.success && data.imageUrl) {
          const base64 = await urlToBase64(data.imageUrl);
          newMoods[mood] = base64;
          setMoods({...newMoods}); // Update UI progressively
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      setMoods(newMoods);
    } catch (error) {
      console.error('Error generating moods:', error);
      alert('Error generating moods');
    } finally {
      setGenerating(false);
    }
  };

  const urlToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const saveLeilaSet = () => {
    const leilaData = {
      baseImage: selectedCandidate,
      moods: moods,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('leila_goddess_set', JSON.stringify(leilaData));
    alert('✅ Leila saved! She will now appear on the main page with different moods!');
  };

  const downloadJSON = () => {
    const data = {
      baseImage: selectedCandidate,
      moods: moods
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leila-goddess-moods.json';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B] mb-4">
            👑 Choose Your Leila Goddess
          </h1>
          <p className="text-white/80 text-lg">Step 1: Pick the perfect goddess • Step 2: Generate her moods</p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex gap-4 mb-8">
          <div className={`flex-1 p-4 rounded-xl border-2 ${step === 'generate' ? 'bg-purple-900/40 border-purple-500' : 'bg-white/10 border-white/20'}`}>
            <p className="text-white font-bold">1. Generate Candidates</p>
          </div>
          <div className={`flex-1 p-4 rounded-xl border-2 ${step === 'choose' ? 'bg-purple-900/40 border-purple-500' : 'bg-white/10 border-white/20'}`}>
            <p className="text-white font-bold">2. Choose Your Favorite</p>
          </div>
          <div className={`flex-1 p-4 rounded-xl border-2 ${step === 'moods' ? 'bg-purple-900/40 border-purple-500' : 'bg-white/10 border-white/20'}`}>
            <p className="text-white font-bold">3. Generate Moods</p>
          </div>
        </div>

        {/* STEP 1: GENERATE */}
        {step === 'generate' && (
          <div className="text-center">
            <button
              onClick={generateCandidates}
              disabled={generating}
              className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-2xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-4 mx-auto"
            >
              <Sparkles className="w-10 h-10" />
              {generating ? 'Generating 4 Goddesses...' : 'Generate 4 Candidate Goddesses'}
            </button>
            {generating && (
              <p className="text-white/60 mt-4">This takes ~10 seconds. Please wait...</p>
            )}
          </div>
        )}

        {/* STEP 2: CHOOSE */}
        {step === 'choose' && candidates.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              💖 Which goddess speaks to your heart?
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {candidates.map((candidate, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`cursor-pointer rounded-2xl overflow-hidden border-4 transition-all ${
                    selectedCandidate === candidate
                      ? 'border-yellow-400 scale-105 shadow-2xl'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <img src={candidate} alt={`Candidate ${idx + 1}`} className="w-full h-96 object-cover" />
                  {selectedCandidate === candidate && (
                    <div className="bg-yellow-400 p-4 text-center">
                      <Heart className="w-8 h-8 mx-auto text-purple-900" />
                      <p className="font-bold text-purple-900">SELECTED!</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setStep('generate')}
                className="px-8 py-4 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700"
              >
                ← Generate New Candidates
              </button>
              <button
                onClick={generateMoods}
                disabled={!selectedCandidate || generating}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50"
              >
                Generate 6 Moods for This Goddess →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MOODS */}
        {step === 'moods' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              🎭 Leila's Different Moods
            </h2>

            {generating && (
              <div className="text-center mb-8">
                <p className="text-yellow-400 font-bold text-xl">Generating moods... This takes ~15 seconds</p>
                <p className="text-white/60">Creating: wise, happy, concerned, excited, calm, playful</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-6 mb-8">
              {Object.entries(moodPrompts).map(([mood]) => (
                <div key={mood} className="bg-white/10 rounded-xl overflow-hidden border-2 border-white/20">
                  {moods[mood] ? (
                    <>
                      <img src={moods[mood]} alt={mood} className="w-full h-64 object-cover" />
                      <div className="p-4 text-center">
                        <p className="text-white font-bold capitalize">{mood}</p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                      <p className="text-white/40">Generating {mood}...</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {Object.keys(moods).length === 6 && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={saveLeilaSet}
                  className="px-12 py-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-2xl hover:scale-105 transition-all"
                >
                  ✅ Save Leila & Use on Main Page
                </button>
                <button
                  onClick={downloadJSON}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  💾 Download JSON
                </button>
                <button
                  onClick={() => {
                    setStep('generate');
                    setCandidates([]);
                    setSelectedCandidate(null);
                    setMoods({});
                  }}
                  className="px-8 py-4 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700"
                >
                  🔄 Start Over
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <a href="/" className="px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all inline-block">
            🏝️ Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
