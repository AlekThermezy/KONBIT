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
              Konbit Pool
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Pre-Fab <span className="text-green-500">Rewards</span> Pool
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Back projects at discounted prices and receive real products when campaigns complete. No revenue share — just great deals on quality goods.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-12">
            {[
              { id: 'how' as PoolTab, label: 'How It Works' },
              { id: 'calculator' as PoolTab, label: 'Pricing Tiers' },
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
              {/* How it works */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">How Pre-Fab Rewards Work</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      step: 1,
                      icon: '🔍',
                      title: 'Browse Projects',
                      desc: 'Explore pre-fab products from accredited Haitian businesses. Every product is vetted and verified.',
                    },
                    {
                      step: 2,
                      icon: '💰',
                      title: 'Back at Discount',
                      desc: 'Secure your reward at 20-40% below retail price. Early backers get the best deals.',
                    },
                    {
                      step: 3,
                      icon: '📦',
                      title: 'Receive Product',
                      desc: 'When campaign hits its goal, your product ships directly to you. No ongoing fees.',
                    },
                  ].map((s) => (
                    <div key={s.step} className="p-5 bg-white/5 rounded-xl text-center">
                      <div className="text-3xl mb-3">{s.icon}</div>
                      <div className="text-green-400 text-sm font-bold mb-1">STEP {s.step}</div>
                      <div className="text-white font-bold mb-2">{s.title}</div>
                      <div className="text-gray-400 text-sm">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* The 4 Pricing Tiers */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Four Pricing Tiers</h2>
                <p className="text-gray-400 mb-6">Prices increase as more people back — reward early supporters</p>
                <div className="space-y-4">
                  {[
                    { tier: 1, name: 'Pioneer', range: 'First 25%', color: 'green', discount: '40% OFF', icon: '🚀' },
                    { tier: 2, name: 'Growth', range: '25-50%', color: 'amber', discount: '25% OFF', icon: '📈' },
                    { tier: 3, name: 'Acceleration', range: '50-75%', color: 'orange', discount: '15% OFF', icon: '⚡' },
                    { tier: 4, name: 'Final Push', range: 'Last 25%', color: 'red', discount: '10% OFF', icon: '🔥' },
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
                            <div className="text-gray-500 text-sm">{t.range} of backers</div>
                          </div>
                        </div>
                        <div className={`text-2xl font-black ${
                          t.color === 'green' ? 'text-green-400' :
                          t.color === 'amber' ? 'text-amber-400' :
                          t.color === 'orange' ? 'text-orange-400' :
                          'text-red-400'
                        }`}>{t.discount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Examples */}
              <div className="bg-gradient-to-br from-green-900/20 to-green-950/50 border border-green-500/30 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">What You Can Back</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'Pre-fab Coffee Farm Share', biz: 'Haitian Brew Co.', retail: '$120', backing: '$72', savings: '40%' },
                    { name: 'Artisan Cacao Box', biz: 'Ixora Collective', retail: '$85', backing: '$51', savings: '40%' },
                    { name: 'Handwoven Textile Set', biz: 'Se文本 Artisans', retail: '$200', backing: '$130', savings: '35%' },
                    { name: 'Pre-fab Housing Materials', biz: 'Kay Lakay Const.', retail: '$5000', backing: '$3500', savings: '30%' },
                  ].map((p, i) => (
                    <div key={i} className="p-4 bg-black/50 rounded-xl">
                      <div className="text-white font-bold mb-1">{p.name}</div>
                      <div className="text-gray-500 text-sm mb-3">by {p.biz}</div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-gray-400 text-xs line-through">Retail ${p.retail}</div>
                          <div className="text-green-400 font-bold text-lg">${p.backing}</div>
                        </div>
                        <div className="text-green-400 text-sm font-bold">Save {p.savings}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Link href="/dashboard/onboard" className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-lg text-black transition-all">
                  List Your Product →
                </Link>
              </div>
            </div>
          )}

          {/* Pricing Tiers */}
          {activeTab === 'calculator' && (
            <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Product Pricing Calculator</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Product Retail Price (USD)</label>
                    <input type="number" placeholder="100" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Production Cost (USD)</label>
                    <input type="number" placeholder="45" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Minimum Backers Needed</label>
                    <input type="number" placeholder="50" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-white font-bold mb-4">Your Tier Pricing</h3>
                <div className="space-y-3">
                  {[
                    { tier: 'Pioneer (40% off)', price: '$60' },
                    { tier: 'Growth (25% off)', price: '$75' },
                    { tier: 'Acceleration (15% off)', price: '$85' },
                    { tier: 'Final Push (10% off)', price: '$90' },
                  ].map((t, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-300">{t.tier}</span>
                      <span className="text-green-400 font-bold">{t.price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Price</span>
                    <span className="text-white font-bold">$78.75</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-400">Margin (avg)</span>
                    <span className="text-green-400 font-bold">42%</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link href="/dashboard/onboard" className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-lg text-black transition-all">
                  Create Your Campaign →
                </Link>
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              {[
                { q: 'How is this different from revenue share?', a: 'Instead of owning a piece of the business and receiving ongoing revenue, you simply buy products at a discount. When the campaign succeeds, you receive your product. No ongoing financial relationship.' },
                { q: 'What happens if a campaign does not reach its goal?', a: 'You are not charged. Campaigns must hit 100% of their target to unlock. If they fall short, all backers are automatically refunded — no credit card charges.' },
                { q: 'When do I get charged?', a: 'Your card is authorized when you back, but only charged when the campaign succeeds. If it fails, the authorization is released.' },
                { q: 'How do I know the products are quality?', a: 'All products come from accredited Haitian businesses. We verify business registration, quality standards, and shipping capability before allowing campaigns.' },
                { q: 'What if the product never ships?', a: 'We hold funds in escrow until delivery confirmation. If a business fails to deliver, backers get full refunds. We also have a dispute resolution team.' },
                { q: 'Can I back multiple tiers?', a: 'Yes. You can back at multiple price points if you want to secure more products or give gifts to friends and family.' },
                { q: 'Is there a maximum number of backers?', a: 'Yes. Each product has a maximum capacity based on the businesses production capability. Once that is reached, the campaign closes.' },
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