'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'

const quickDeals = [
  {
    id: 'QD001',
    name: 'Prime Jacmel Lots',
    type: 'Real Estate',
    location: 'Jacmel, Haiti',
    price: 5000,
    returns: '14%',
    term: '12 mo',
    filled: 78,
    icon: '🏠'
  },
  {
    id: 'QD002',
    name: 'Studio Recording Package',
    type: 'Music',
    location: 'Port-au-Prince',
    price: 2500,
    returns: '18%',
    term: '6 mo',
    filled: 92,
    icon: '🎵'
  },
  {
    id: 'QD003',
    name: 'Artisan Collective Batch',
    type: 'Art',
    location: 'Savann Pist',
    price: 1000,
    returns: '12%',
    term: '9 mo',
    filled: 45,
    icon: '🎨'
  },
  {
    id: 'QD004',
    name: 'Mango Export Series',
    type: 'Food',
    location: 'Léogâne',
    price: 3500,
    returns: '16%',
    term: '8 mo',
    filled: 66,
    icon: '🍳'
  },
  {
    id: 'QD005',
    name: 'Boutique Hotel Rooms',
    type: 'Real Estate',
    location: 'Cap-Haïtien',
    price: 7500,
    returns: '11%',
    term: '18 mo',
    filled: 34,
    icon: '🏨'
  },
  {
    id: 'QD006',
    name: 'Fashion Line Expansion',
    type: 'Art',
    location: 'Delmas, PAP',
    price: 4000,
    returns: '15%',
    term: '10 mo',
    filled: 55,
    icon: '👗'
  }
]

const batchInvestments = [
  {
    title: 'Real Estate Pool A',
    desc: 'Diversified across 5 vacation rental properties',
    minimum: 500,
    apy: '10-14%',
    investors: 234,
    volume: '$1.2M',
    icon: '🏠'
  },
  {
    title: 'Music Rights Bundle',
    desc: 'Streaming royalties from 12 Haitian artists',
    minimum: 250,
    apy: '15-22%',
    investors: 412,
    volume: '$890K',
    icon: '🎵'
  },
  {
    title: 'Art Gallery Network',
    desc: 'Collective gallery exhibitions and sales',
    minimum: 100,
    apy: '8-16%',
    investors: 189,
    volume: '$420K',
    icon: '🎨'
  },
  {
    title: 'Agri-Food Export',
    desc: 'Mango, coffee, and cocoa export contracts',
    minimum: 750,
    apy: '12-18%',
    investors: 156,
    volume: '$1.5M',
    icon: '🍳'
  }
]

const profitReturns = [
  { month: 'Jan', return: 2.4 },
  { month: 'Feb', return: 1.8 },
  { month: 'Mar', return: 3.2 },
  { month: 'Apr', return: 2.9 },
  { month: 'May', return: 4.1 },
  { month: 'Jun', return: 3.7 },
  { month: 'Jul', return: 3.5 },
  { month: 'Aug', return: 2.1 },
  { month: 'Sep', return: 4.8 },
  { month: 'Oct', return: 3.9 },
  { month: 'Nov', return: 2.7 },
  { month: 'Dec', return: 5.2 }
]

const topPerformers = [
  { name: 'Kay Ix是一个人', returns: '+18.4%', tokens: 'KAY001', sector: 'Real Estate' },
  { name: 'Mzero Studios', returns: '+22.1%', tokens: 'MZS001', sector: 'Music' },
  { name: 'Atis Rezistans', returns: '+14.7%', tokens: 'AR001', sector: 'Art' },
  { name: 'Manje Lakay', returns: '+16.2%', tokens: 'MLK001', sector: 'Food' },
  { name: 'Café Kokoye', returns: '+19.8%', tokens: 'CK001', sector: 'Food' }
]

export default function DealsPage() {
  const [filter, setFilter] = useState<string | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null)

  const filteredDeals = filter
    ? quickDeals.filter(d => d.type === filter)
    : quickDeals

  const maxReturn = Math.max(...profitReturns.map(r => r.return))

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-black to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-yellow-600/10 rounded-full blur-[100px]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-amber-900/30 border border-amber-500/30 rounded-full text-amber-400 text-sm mb-6">
            💰 KONBIT Deals — Marketplace
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-amber-500">Quick Deals,</span><br />
            <span className="text-white">Batch Investments</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Browse flash deals, join batch investment pools, and track profit returns — all in one marketplace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a 
              href="#deals"
              className="px-8 py-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
            >
              Browse Deals
            </a>
            <a 
              href="#pools"
              className="px-8 py-4 bg-white/5 border border-white/20 hover:border-amber-500/50 rounded-xl font-bold text-lg transition-all duration-200"
            >
              Investment Pools
            </a>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: '24', label: 'Active Deals' },
              { value: '$4.2M', label: 'Total Volume' },
              { value: '1,800+', label: 'Investors' },
              { value: '15.3%', label: 'Avg Returns' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-3xl md:text-4xl font-black text-amber-500 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Deals Section */}
      <section id="deals" className="py-24 px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-amber-900/30 border border-amber-500/30 rounded-full text-amber-400 text-sm mb-4">
              Flash Deals
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-amber-500">Quick</span> Deals
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Time-sensitive opportunities with fixed returns. Act fast — these fill up quickly.
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setFilter(null)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                filter === null
                  ? 'bg-amber-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              All
            </button>
            {['Real Estate', 'Music', 'Art', 'Food'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                  filter === type
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Deals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <div 
                key={deal.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-900/30 rounded-xl flex items-center justify-center text-2xl">
                      {deal.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{deal.name}</h3>
                      <p className="text-gray-500 text-sm">📍 {deal.location}</p>
                    </div>
                  </div>
                  <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg px-2 py-1">
                    <span className="text-amber-400 text-xs font-mono">{deal.id}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{deal.filled}% filled</span>
                    <span className="text-amber-500 font-medium">{deal.returns} returns</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full transition-all duration-500"
                      style={{ width: `${deal.filled}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Price</div>
                    <div className="text-white font-bold">${deal.price.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Returns</div>
                    <div className="text-amber-500 font-medium">{deal.returns}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Term</div>
                    <div className="text-white font-medium">{deal.term}</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDeal(deal.id)}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold transition"
                >
                  Invest Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Batch Investment Pools */}
      <section id="pools" className="py-24 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-amber-900/30 border border-amber-500/30 rounded-full text-amber-400 text-sm mb-4">
              Batch Investments
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Investment <span className="text-amber-500">Pools</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Diversified batch investments across multiple deals. Lower risk, steady returns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {batchInvestments.map((pool, index) => (
              <div 
                key={pool.title}
                className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 border border-amber-500/30 rounded-2xl p-8 hover:border-amber-500/60 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-amber-600/20 rounded-2xl flex items-center justify-center text-3xl">
                    {pool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{pool.title}</h3>
                    <p className="text-gray-400 text-sm">{pool.desc}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-black/40 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">Min</div>
                    <div className="text-amber-500 font-bold">${pool.minimum}</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">APY</div>
                    <div className="text-amber-500 font-bold">{pool.apy}</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">Investors</div>
                    <div className="text-white font-bold">{pool.investors}</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">Volume</div>
                    <div className="text-white font-bold">{pool.volume}</div>
                  </div>
                </div>

                <button className="w-full py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold transition">
                  Join Pool
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profit Returns Chart */}
      <section id="returns" className="py-24 px-6 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-amber-900/30 border border-amber-500/30 rounded-full text-amber-400 text-sm mb-4">
              Performance
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Profit <span className="text-amber-500">Returns</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Monthly returns across the KONBIT ecosystem. Consistent growth through all sectors.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-gray-500 text-sm mb-1">Total Annual Return</div>
                <div className="text-4xl font-black text-amber-500">+38.3%</div>
              </div>
              <div className="flex gap-6">
                <div className="text-right">
                  <div className="text-gray-500 text-sm">Best Month</div>
                  <div className="text-white font-bold">December (+5.2%)</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-sm">Avg Monthly</div>
                  <div className="text-white font-bold">+3.2%</div>
                </div>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between h-48 gap-2">
              {profitReturns.map((r) => (
                <div key={r.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-36">
                    <div 
                      className="w-full max-w-8 bg-gradient-to-t from-amber-600 to-yellow-500 rounded-t-lg transition-all duration-500"
                      style={{ height: `${(r.return / maxReturn) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-500 text-xs">{r.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6">Top Performing Investments</h3>
            <div className="space-y-4">
              {topPerformers.map((item, index) => (
                <div 
                  key={item.tokens}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-amber-600/20 rounded-lg flex items-center justify-center text-amber-500 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-500 text-sm">{item.tokens} · {item.sector}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-500 font-bold text-lg">{item.returns}</div>
                    <div className="text-gray-500 text-sm">all time</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investment Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Invest in Deal</h3>
              <button 
                onClick={() => setSelectedDeal(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {(() => {
              const deal = quickDeals.find(d => d.id === selectedDeal)
              if (!deal) return null
              return (
                <>
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{deal.icon}</span>
                      <div>
                        <div className="font-bold">{deal.name}</div>
                        <div className="text-gray-500 text-sm">{deal.id} · {deal.type}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Returns</span>
                        <div className="text-amber-500 font-bold">{deal.returns}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Term</span>
                        <div className="text-white font-bold">{deal.term}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-400 text-sm mb-2">Investment Amount</label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder={`Min $${deal.price}`}
                      min={deal.price}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <button className="w-full py-4 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold text-lg transition">
                    Confirm Investment
                  </button>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-950 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-black">
            <span className="text-amber-500">KON</span>BIT
          </div>
          <div className="text-gray-500 text-sm">
            Konekte. Tèt ansanm. Pou nou vanse.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  )
}