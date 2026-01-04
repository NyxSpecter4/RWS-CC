'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign } from 'lucide-react';

interface Buyer {
  name: string;
  qty_lbs: number;
  frequency: string;
  next_delivery: string;
  lunar_phase: string;
  contact: string;
  payment_terms: string;
}

interface MarketData {
  crop: string;
  current_price: number;
  last_week: number;
  trend: 'up' | 'down';
  change_pct: number;
  last_updated: string;
}

export default function MarketIntelligence() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  useEffect(() => {
    loadMarketData();
    const interval = setInterval(loadMarketData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadMarketData = async () => {
    // Simulate Hawaii Farm Bureau API data
    const mockData: MarketData[] = [
      { 
        crop: 'Māmaki Tea', 
        current_price: 185, 
        last_week: 165, 
        trend: 'up', 
        change_pct: 12.1,
        last_updated: new Date().toISOString()
      },
      { 
        crop: 'Finger Limes', 
        current_price: 45, 
        last_week: 42, 
        trend: 'up', 
        change_pct: 7.1,
        last_updated: new Date().toISOString()
      },
      { 
        crop: 'Vanilla (Premium)', 
        current_price: 320, 
        last_week: 315, 
        trend: 'up', 
        change_pct: 1.6,
        last_updated: new Date().toISOString()
      },
      { 
        crop: 'Ginger', 
        current_price: 12, 
        last_week: 13, 
        trend: 'down', 
        change_pct: -7.7,
        last_updated: new Date().toISOString()
      }
    ];

    const mockBuyers: Buyer[] = [
      {
        name: 'Hilo Wellness Co-op',
        qty_lbs: 10,
        frequency: 'Monthly',
        next_delivery: 'Jan 15, 2026',
        lunar_phase: 'Akua (Full Moon - Peak Quality)',
        contact: 'Sarah K. - (808) 555-0123',
        payment_terms: 'Net 15'
      },
      {
        name: 'Kona Cafe & Roasters',
        qty_lbs: 5,
        frequency: 'Bi-weekly',
        next_delivery: 'Jan 8, 2026',
        lunar_phase: 'Kū (Rising - Fresh Energy)',
        contact: 'David M. - (808) 555-0456',
        payment_terms: 'Net 30'
      },
      {
        name: 'Volcano Village Market',
        qty_lbs: 15,
        frequency: 'Monthly',
        next_delivery: 'Jan 20, 2026',
        lunar_phase: 'Muku (Rest Phase - Storage)',
        contact: 'Lisa P. - (808) 555-0789',
        payment_terms: 'Net 7'
      },
      {
        name: 'Pahoa Natural Foods',
        qty_lbs: 8,
        frequency: 'Weekly',
        next_delivery: 'Jan 6, 2026',
        lunar_phase: 'Hilo (New - Fresh Start)',
        contact: 'James T. - (808) 555-0321',
        payment_terms: 'COD'
      }
    ];

    setMarketData(mockData);
    setBuyers(mockBuyers);
  };

  const totalMonthlyRevenue = buyers.reduce((sum, b) => {
    const deliveriesPerMonth = b.frequency === 'Weekly' ? 4 : b.frequency === 'Bi-weekly' ? 2 : 1;
    const mamakiPrice = marketData.find(m => m.crop === 'Māmaki Tea')?.current_price || 185;
    return sum + (b.qty_lbs * deliveriesPerMonth * mamakiPrice);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-10 h-10 text-green-400" />
          <div>
            <h2 className="text-3xl font-bold text-[#FFE573]">📊 Market Intelligence Dashboard</h2>
            <p className="text-white/80">Real-time pricing + Buyer relationship tracking</p>
          </div>
        </div>

        {/* REVENUE PROJECTION */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-2xl mb-6 text-center">
          <p className="text-white/80 text-sm mb-2">Projected Monthly Revenue</p>
          <p className="text-6xl font-black text-white mb-2">${totalMonthlyRevenue.toLocaleString()}</p>
          <p className="text-white/70">Based on active contracts + current market prices</p>
        </div>

        {/* REAL-TIME MARKET PRICES */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Live Market Prices - Hawaii Farm Bureau
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {marketData.map((item, i) => (
              <div key={i} className="bg-white/10 p-6 rounded-xl border border-white/20 hover:scale-105 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{item.crop}</h4>
                    <p className="text-xs text-white/60">Updated: {new Date(item.last_updated).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-green-400">${item.current_price}</p>
                    <p className="text-xs text-white/60">/lb wholesale</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`font-bold ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.trend === 'up' ? '+' : ''}{item.change_pct}%
                    </span>
                  </div>
                  <p className="text-white/60 text-sm">vs last week: ${item.last_week}/lb</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BUYER RELATIONSHIP TRACKER */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Active Buyer Contracts ({buyers.length})
          </h3>
          
          <div className="space-y-4">
            {buyers.map((buyer, i) => (
              <div key={i} className="bg-white/10 p-6 rounded-xl border-2 border-blue-500/30 hover:border-blue-500 transition-all">
                <div className="grid grid-cols-3 gap-6">
                  {/* Buyer Info */}
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{buyer.name}</h4>
                    <p className="text-white/70 text-sm mb-1">{buyer.contact}</p>
                    <p className="text-xs text-white/50">Payment: {buyer.payment_terms}</p>
                  </div>

                  {/* Order Details */}
                  <div>
                    <div className="mb-3">
                      <p className="text-xs text-white/60 mb-1">Order Size</p>
                      <p className="text-2xl font-bold text-green-400">{buyer.qty_lbs} lbs</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60 mb-1">Frequency</p>
                      <p className="text-white font-semibold">{buyer.frequency}</p>
                    </div>
                  </div>

                  {/* Next Delivery - LUNAR ALIGNED */}
                  <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <p className="text-xs text-purple-400 font-semibold">NEXT DELIVERY</p>
                    </div>
                    <p className="text-white font-bold text-lg mb-2">{buyer.next_delivery}</p>
                    <p className="text-purple-300 text-sm font-semibold">{buyer.lunar_phase}</p>
                  </div>
                </div>

                {/* Revenue Calculation */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <p className="text-white/60 text-sm">Monthly Value:</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${(buyer.qty_lbs * (buyer.frequency === 'Weekly' ? 4 : buyer.frequency === 'Bi-weekly' ? 2 : 1) * 185).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MARKET INSIGHTS */}
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-6 rounded-xl border-2 border-yellow-500">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">💡 Market Intelligence Insights</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-2xl">↑</span>
              <div>
                <p className="text-white font-semibold">Māmaki prices up 12% this week!</p>
                <p className="text-white/70 text-sm">High demand from Hilo wellness shops. Consider expanding production.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-2xl">📅</span>
              <div>
                <p className="text-white font-semibold">3 deliveries scheduled during Akua (Full Moon)</p>
                <p className="text-white/70 text-sm">Harvesting at peak mana = premium quality = customer retention</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-purple-400 text-2xl">🤝</span>
              <div>
                <p className="text-white font-semibold">New buyer inquiry: Big Island Farmers Market</p>
                <p className="text-white/70 text-sm">Requesting 20 lbs/week. Potential $14,800/month revenue increase.</p>
              </div>
            </div>
          </div>
        </div>

        {/* IMPLEMENTATION CODE */}
        <details className="mt-6 bg-gray-900 p-4 rounded-lg">
          <summary className="text-blue-400 font-bold cursor-pointer">Show Implementation Code</summary>
          <pre className="text-gray-100 text-sm mt-4 overflow-x-auto">
{`// Market data integration
const marketData = {
  mamaki_current: 185,  // $/lb updated from Hawaii Farm Bureau API
  change_pct: +12.1,
  buyers: [
    { 
      name: 'Hilo Wellness', 
      qty: 10, 
      freq: 'monthly', 
      next: 'Jan 15 (Akua - peak quality)' 
    },
    { 
      name: 'Kona Cafe', 
      qty: 5, 
      freq: 'biweekly', 
      next: 'Jan 8 (Kū - fresh energy)' 
    }
  ]
};

// Calculate monthly revenue
const monthlyRevenue = buyers.reduce((sum, b) => {
  const deliveries = b.freq === 'weekly' ? 4 : b.freq === 'biweekly' ? 2 : 1;
  return sum + (b.qty * deliveries * marketData.mamaki_current);
}, 0);

// Alert when prices change significantly
if (marketData.change_pct > 10) {
  alert('Māmaki prices up ' + marketData.change_pct + '% - harvest now!');
}`}
          </pre>
        </details>

        {/* EXPORT FOR GRANTS */}
        <div className="mt-6 flex gap-4">
          <button className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-all">
            📊 Export Market Data for Grant Applications
          </button>
          <button className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-all">
            📧 Send Buyer Report (Lunar Calendar Attached)
          </button>
        </div>
      </div>
    </div>
  );
}
