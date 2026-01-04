'use client';
import { useState } from 'react';
import { Smartphone, Tablet, Monitor, RotateCw } from 'lucide-react';

export default function MobileTester() {
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('phone');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [currentPage, setCurrentPage] = useState('/');

  const devices = {
    phone: {
      portrait: { width: 375, height: 667 },
      landscape: { width: 667, height: 375 }
    },
    tablet: {
      portrait: { width: 768, height: 1024 },
      landscape: { width: 1024, height: 768 }
    },
    desktop: {
      portrait: { width: 1920, height: 1080 },
      landscape: { width: 1920, height: 1080 }
    }
  };

  const pages = [
    { path: '/', name: '🏝️ Home' },
    { path: '/dashboard', name: '📊 Dashboard' },
    { path: '/test-crops', name: '🌱 Test Crops' },
    { path: '/choose-leila', name: '👑 Choose Leila' }
  ];

  const currentDimensions = devices[device][orientation];
  const scale = device === 'phone' ? 1 : device === 'tablet' ? 0.7 : 0.5;

  return (
    <div className="bg-white/10 p-6 rounded-xl border-2 border-blue-500/40">
      <h3 className="text-2xl font-bold text-blue-400 mb-4">📱 Mobile Tester</h3>
      
      {/* DEVICE SELECTOR */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setDevice('phone')}
          className={`flex-1 px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${
            device === 'phone' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60'
          }`}
        >
          <Smartphone className="w-5 h-5" />
          Phone
        </button>
        <button
          onClick={() => setDevice('tablet')}
          className={`flex-1 px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${
            device === 'tablet' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60'
          }`}
        >
          <Tablet className="w-5 h-5" />
          Tablet
        </button>
        <button
          onClick={() => setDevice('desktop')}
          className={`flex-1 px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${
            device === 'desktop' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60'
          }`}
        >
          <Monitor className="w-5 h-5" />
          Desktop
        </button>
        <button
          onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
          className="px-4 py-3 bg-purple-600 text-white rounded-lg font-bold flex items-center gap-2"
        >
          <RotateCw className="w-5 h-5" />
          Rotate
        </button>
      </div>

      {/* PAGE SELECTOR */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {pages.map((page) => (
          <button
            key={page.path}
            onClick={() => setCurrentPage(page.path)}
            className={`px-3 py-2 rounded-lg font-bold text-sm ${
              currentPage === page.path ? 'bg-green-600 text-white' : 'bg-white/10 text-white/60'
            }`}
          >
            {page.name}
          </button>
        ))}
      </div>

      {/* DEVICE INFO */}
      <div className="bg-blue-900/40 p-3 rounded-lg mb-4 flex items-center justify-between">
        <div>
          <p className="text-blue-400 font-bold">
            {device.toUpperCase()} - {orientation}
          </p>
          <p className="text-white/60 text-sm">
            {currentDimensions.width} × {currentDimensions.height}px
          </p>
        </div>
        <p className="text-white/60 text-sm">Scale: {(scale * 100).toFixed(0)}%</p>
      </div>

      {/* MOBILE PREVIEW */}
      <div className="bg-gray-900 p-8 rounded-xl flex items-center justify-center overflow-auto" style={{ minHeight: '600px' }}>
        <div
          className="bg-black rounded-3xl shadow-2xl overflow-hidden relative"
          style={{
            width: `${currentDimensions.width * scale}px`,
            height: `${currentDimensions.height * scale}px`,
            border: '8px solid #1a1a1a'
          }}
        >
          {/* PHONE NOTCH */}
          {device === 'phone' && orientation === 'portrait' && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50"></div>
          )}
          
          {/* IFRAME */}
          <iframe
            src={currentPage}
            className="w-full h-full"
            style={{
              transform: `scale(1)`,
              transformOrigin: 'top left'
            }}
          />
        </div>
      </div>

      {/* TIPS */}
      <div className="mt-4 bg-yellow-900/40 p-4 rounded-lg border-2 border-yellow-500/40">
        <p className="text-yellow-400 font-bold mb-2">💡 Tips:</p>
        <ul className="text-white/80 text-sm space-y-1">
          <li>• Scroll inside the preview to test long pages</li>
          <li>• Click buttons and test interactions</li>
          <li>• Rotate to test landscape mode</li>
          <li>• Phone = iPhone 8 size (375×667)</li>
          <li>• Tablet = iPad size (768×1024)</li>
        </ul>
      </div>
    </div>
  );
}
