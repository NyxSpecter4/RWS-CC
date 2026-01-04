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
    { path: '/test-crops', name: '🌱 Crops' },
    { path: '/choose-leila', name: '👑 Leila' }
  ];

  const currentDimensions = devices[device][orientation];
  const scale = device === 'phone' ? 0.8 : device === 'tablet' ? 0.6 : 0.4;

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

      {/* MOBILE PREVIEW - NOW SCROLLABLE! */}
      <div className="bg-gray-900 p-8 rounded-xl flex items-start justify-center" style={{ height: '700px', overflow: 'auto' }}>
        <div
          className="bg-black rounded-3xl shadow-2xl relative flex-shrink-0"
          style={{
            width: `${currentDimensions.width * scale}px`,
            height: `${currentDimensions.height * scale}px`,
            border: '8px solid #1a1a1a'
          }}
        >
          {/* PHONE NOTCH */}
          {device === 'phone' && orientation === 'portrait' && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl z-50"></div>
          )}
          
          {/* IFRAME - FULLY SCROLLABLE */}
          <div className="w-full h-full overflow-auto rounded-3xl">
            <iframe
              src={currentPage}
              className="w-full border-0"
              style={{
                width: `${currentDimensions.width}px`,
                height: `${currentDimensions.height}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left'
              }}
            />
          </div>
        </div>
      </div>

      {/* TIPS */}
      <div className="mt-4 bg-yellow-900/40 p-4 rounded-lg border-2 border-yellow-500/40">
        <p className="text-yellow-400 font-bold mb-2">💡 Tips:</p>
        <ul className="text-white/80 text-sm space-y-1">
          <li>• Scroll the OUTER frame to see full page</li>
          <li>• Scroll INSIDE the phone to test scrolling</li>
          <li>• Click buttons and test interactions</li>
          <li>• Rotate to test landscape mode</li>
          <li>• Test all pages to check mobile formatting</li>
        </ul>
      </div>
    </div>
  );
}
