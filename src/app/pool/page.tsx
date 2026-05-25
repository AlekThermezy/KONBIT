'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

type PoolTab = 'how' | 'calculator' | 'faq'

export default function KonbitPoolPage() {
  const [activeTab, setActiveTab] = useState<PoolTab>('how')

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-6">
              Pool
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Dynamic Pricing for <span className="text-green-500">Better Campaigns</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our Konbit Pool pricing automatically adjusts token prices as funding grows — rewarding early investors and creating momentum.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-12">
            {[
              { id: 'how' as PoolTab, label: 'How It Works' },
              { id: 'calculator' as PoolTab, label: 'Pricing Calculator' },
              { id: 'faq' as PoolTab, label: 'FAQ' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* How It Works */}
          {activeTab === 'how' && (
            <div className="space-y-8">
              {/* The 4 Tiers */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Four Pricing Tiers</h2>
                <div className="space-y-4">
                  {[
                    { tier: 1, name: 'Pioneer', range: 'First 25%', color: 'green', price: 'Base Price', icon: '🚀' },
                    { tier: 2, name: 'Growth', range: '25-50%', color: 'amber', price: '+20%', icon: '📈' },
                    { tier: 3, name: 'Acceleration', range: '50-75%', color: 'orange', price: '+40%', icon: '⚡' },
                    { tier: 4, name: 'Final Push', range: 'Last 25%', color: 'red', price: '+60%', icon: '🔥' },
                  ].map((t) => (
                    <div key={t.tier} className={`p-5 rounded-xl border ${
                      t.color === 'green' ? 'border-green-500/30 bg-green-900/20' :
                      t.color === 'amber' ? 'border-amber-500/30 bg-amber-900/20' :
                      t.color === 'orange' ? 'border-orange-500/30 bg-orange-900/20' :
                      'border-red-500/30 bg-red-900/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{t.icon}</span>
                          <div>
                            <span className={`text-xs font-bold ${
                              t.color === 'green' ? 'text-green-400' :
                              t.color === 'amber' ? 'text-amber-400' :
                              t.color === 'orange' ? 'text-orange-400' :
                              'text-red-400'
                            }`}>TIER {t.tier}</span>
                            <div className="text-white font-bold">{t.name}</div>
                            <div className="text-gray-500 text-sm">{t.range} of raise</div>
                          </div>
                        </div>
                        <div className={`text-2xl font-black ${
                          t.color === 'green' ? 'text-green-400' :
                          t.color === 'amber' ? 'text-amber-400' :
                          t.color === 'orange' ? 'text-orange-400' :
                          'text-red-400'
                        }`}>{t.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stable Process */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🛡️</span>
                  <h2 className="text-2xl font-bold text-white">Stable Process</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-black/50 rounded-xl">
                    <div className="text-green-400 font-bold mb-2">📊 Konbit Pool</div>
                    <div className="text-gray-400 text-sm">Dynamic 4-tier pricing. Creates urgency and higher final valuations.</div>
                  </div>
                  <div className="p-4 bg-black/50 rounded-xl">
                    <div className="text-blue-400 font-bold mb-2">🏁 Fixed Price</div>
                    <div className="text-gray-400 text-sm">Same price throughout. Best for established businesses.</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Link href="/dashboard/onboard" className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-lg text-black transition-all">
                  List Your Business →
                </Link>
              </div>
            </div>
          )}

          {/* Calculator */}
          {activeTab === 'calculator' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Estimate Your Campaign</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Funding Goal (USD)</label>
                  <input type="number" placeholder="50,000" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Token Base Price (USD)</label>
                  <input type="number" placeholder="10" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50" />
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl text-center">
                <p className="text-green-400 font-medium">Enter values above to see tier pricing breakdown</p>
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              {[
                { q: 'Why does price increase as more people invest?', a: 'It creates urgency and rewards early supporters. When investors see the price rising, they are more likely to commit sooner.' },
                { q: 'What if my campaign does not reach 100%?', a: 'You keep whatever you raise. With dynamic pricing, campaigns tend to perform better because the structure motivates earlier commitment.' },
                { q: 'How are tiers calculated?', a: 'Based on percentage of funding goal reached. Tier 1 = 0-25%, Tier 2 = 25-50%, Tier 3 = 50-75%, Tier 4 = 75-100%.' },
              ].map((faq, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-2">{faq.q}</h3>
                  <p className="text-gray-400">{faq.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}