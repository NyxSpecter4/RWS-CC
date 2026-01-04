"use client";
import { useState } from 'react';

export default function TestCrops() {
  const [loading, setLoading] = useState<string | null>(null);
  const [images, setImages] = useState<Record<string, string>>({});

  const crops = [
    {
      id: 'mamaki',
      name: 'Māmaki',
      prompt: 'Close-up agricultural photograph of māmaki plants GROWING from rich dark volcanic Hawaiian soil. Multiple plants with thick green stems emerging from dark earth, broad ovate leaves with PROMINENT BRIGHT RED VEINS clearly visible, serrated leaf edges, dark green tops and silvery-white undersides. Plants 2-3 feet tall. Ground level perspective showing roots meeting soil. Shot on Canon EOS R5, f/2.8, natural Hawaiian sunlight, sharp focus on red veins, volcanic soil texture visible.'
    },
    {
      id: 'fingerlimes',
      name: 'Finger Limes',
      prompt: 'Close-up of finger lime tree GROWING from Hawaiian volcanic soil. Young citrus tree with gnarled trunk emerging from dark earth, multiple branches with thorns, elongated cylindrical finger lime fruits (4-8cm, dark green with pebbled bumpy skin) hanging heavily from branches. Ground level view showing tree base in soil. Canon EOS R5, 50mm f/2.8, diffused greenhouse light.'
    },
    {
      id: 'vanilla',
      name: 'Vanilla',
      prompt: 'Vanilla orchid vine GROWING up wooden trellis from Hawaiian volcanic soil. Thick fleshy green climbing vine with aerial roots clinging to support post, glossy bright green oval leaves (8-25cm) arranged alternately, MULTIPLE long slender dark green vanilla bean pods (15-25cm) hanging down like small bananas, ONE creamy yellow-green orchid flower with distinctive TRUMPET-SHAPED FRINGED LABELLUM blooming. Vine base emerging from soil. Canon EOS R5, 85mm f/2.8.'
    },
    {
      id: 'ginger',
      name: 'Ginger',
      prompt: 'Ginger plant GROWING from rich dark Hawaiian volcanic soil. Tall green pseudostems (3-4 feet) with long narrow lance-shaped glossy leaves emerging from dark earth, fresh KNOBBY GOLDEN-BROWN GINGER RHIZOMES partially EXPOSED at soil surface showing irregular branched fingers with growth nodes and warty texture. Ground level perspective showing rhizomes breaking through soil. Canon EOS R5, 50mm f/2.8.'
    },
    {
      id: 'turmeric',
      name: 'Turmeric',
      prompt: 'Turmeric plant GROWING from rich volcanic Hawaiian soil. Tall green leafy plants (2-3 feet) with large broad lance-shaped leaves emerging from dark earth, BRIGHT ORANGE-YELLOW TURMERIC RHIZOMES partially exposed at soil surface showing knobby irregular fingers with thin roots. Deep golden-orange flesh visible on broken rhizome. Ground level agricultural perspective. Canon EOS R5, 50mm f/2.8, natural light.'
    }
  ];

  const generateCropImage = async (crop: typeof crops[0]) => {
    setLoading(crop.id);
    try {
      const res = await fetch('/api/generate-crop-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cropName: crop.name, prompt: crop.prompt })
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setImages(prev => ({ ...prev, [crop.id]: data.imageUrl }));
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const generateAllCrops = async () => {
    for (const crop of crops) {
      await generateCropImage(crop);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };

  const saveAllImages = () => {
    const blob = new Blob([JSON.stringify(images, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crop-images.json';
    a.click();
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-4 overflow-hidden flex flex-col">
      
      {/* HEADER - COMPACT */}
      <div className="mb-4">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B]">
          �� Crop Image Test
        </h1>
      </div>

      {/* BUTTONS - COMPACT */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={generateAllCrops}
          disabled={loading !== null}
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:scale-105 transition-all disabled:opacity-50"
        >
          {loading ? '⏳' : '🎨'} Generate All
        </button>
        <button
          onClick={saveAllImages}
          disabled={Object.keys(images).length === 0}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:scale-105 transition-all disabled:opacity-50"
        >
          💾 Save URLs
        </button>
        <a href="/" className="px-6 py-2 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-lg font-bold hover:scale-105 transition-all">
          🏝️ Home
        </a>
      </div>

      {/* SCROLLABLE CROPS GRID */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
          {crops.map((crop) => (
            <div key={crop.id} className="bg-white/10 backdrop-blur-md rounded-lg p-3 border-2 border-white/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">{crop.name}</h3>
                <button
                  onClick={() => generateCropImage(crop)}
                  disabled={loading === crop.id}
                  className="px-3 py-1 bg-purple-600 text-white rounded font-bold text-sm hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading === crop.id ? '⏳' : '🎨'}
                </button>
              </div>

              {images[crop.id] ? (
                <div>
                  <img 
                    src={images[crop.id]} 
                    alt={crop.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <div className="bg-green-900/40 p-2 rounded">
                    <p className="text-green-400 font-bold text-xs">✅ Done!</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-40 bg-gray-800 rounded flex items-center justify-center">
                  <p className="text-white/40 text-xs">Not generated</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
