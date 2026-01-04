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
        body: JSON.stringify({ 
          cropName: crop.name,
          prompt: crop.prompt 
        })
      });

      if (!res.ok) {
        throw new Error(`API failed: ${res.status}`);
      }

      const data = await res.json();
      console.log('Response:', data);

      if (data.success && data.imageUrl) {
        setImages(prev => ({ ...prev, [crop.id]: data.imageUrl }));
      } else {
        alert(`Failed to generate ${crop.name}: ${data.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error(`Error generating ${crop.name}:`, error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const generateAllCrops = async () => {
    for (const crop of crops) {
      await generateCropImage(crop);
      // Wait 2 seconds between requests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };

  const saveAllImages = () => {
    const imageData = JSON.stringify(images, null, 2);
    const blob = new Blob([imageData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crop-images.json';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020103] via-[#1a0b2e] to-[#020103] p-8">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE573] via-[#FD437D] to-[#902F9B] mb-8">
          🧪 Crop Image Generation Test
        </h1>

        <div className="bg-yellow-900/40 border-2 border-yellow-500 rounded-xl p-6 mb-8">
          <p className="text-yellow-300 font-bold text-lg mb-2">⚠️ TEST PAGE</p>
          <p className="text-white/80">Generate DALL-E 3 images for all crops. Test them here before adding to production!</p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={generateAllCrops}
            disabled={loading !== null}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Generating...' : '🎨 Generate All Crops'}
          </button>

          <button
            onClick={saveAllImages}
            disabled={Object.keys(images).length === 0}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-xl hover:scale-105 transition-all disabled:opacity-50"
          >
            💾 Save Image URLs
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crops.map((crop) => (
            <div key={crop.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{crop.name}</h3>
                <button
                  onClick={() => generateCropImage(crop)}
                  disabled={loading === crop.id}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading === crop.id ? '⏳' : '🎨 Generate'}
                </button>
              </div>

              {images[crop.id] ? (
                <div>
                  <img 
                    src={images[crop.id]} 
                    alt={crop.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <div className="bg-green-900/40 p-3 rounded-lg">
                    <p className="text-green-400 font-bold mb-2">✅ Generated!</p>
                    <p className="text-white/60 text-xs break-all">{images[crop.id]}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-white/40">Not generated yet</p>
                </div>
              )}

              <div className="mt-4 bg-blue-900/30 p-3 rounded-lg">
                <p className="text-blue-400 text-xs mb-2">DALL-E Prompt:</p>
                <p className="text-white/60 text-xs">{crop.prompt}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <a href="/" className="px-6 py-3 bg-gradient-to-r from-[#902F9B] to-[#FD437D] text-white rounded-xl font-bold hover:scale-105 transition-all inline-block">
            🏝️ Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
