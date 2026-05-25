'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const sectors = [
  { id: 'all', label: 'All', icon: '🌐' },
  { id: 'Real Estate', label: 'Real Estate', icon: '🏠' },
  { id: 'Agriculture', label: 'Agriculture', icon: '🌱' },
  { id: 'Music', label: 'Music', icon: '🎵' },
  { id: 'Film & Media', label: 'Film', icon: '🎬' },
  { id: 'Art', label: 'Art', icon: '🎨' },
  { id: 'Food', label: 'Food', icon: '🍳' },
  { id: 'Reforestation', label: 'Nature', icon: '🌳' },
  { id: 'Tech', label: 'Tech', icon: '💻' },
  { id: 'Tourism', label: 'Tourism', icon: '✈️' },
]

const campaigns = [
  {
    id: 'kay-ix-prefab',
    name: 'Pre-fab Housing Kit (2-room)',
    business: 'Kay Ix Construction',
    sector: 'Real Estate',
    location: 'Jacmel, Haiti',
    retailPrice: 5000,
    discount: 40,
    currentPrice: 3000,
    quantity: 50,
    sold: 18,
    delivery: '3-4 months',
    image: '🏠',
    status: 'live',
  },
  {
    id: 'coffee-batch',
    name: 'Haitian Premium Coffee Bundle',
    business: 'Haitian Brew Co.',
    sector: 'Agriculture',
    location: 'Thiotte, Haiti',
    retailPrice: 120,
    discount: 40,
    currentPrice: 72,
    quantity: 200,
    sold: 85,
    delivery: '2-3 months',
    image: '☕',
    status: 'live',
  },
  {
    id: 'artisan-textiles',
    name: 'Handwoven Textile Collection',
    business: 'SeText Artisans',
    sector: 'Art',
    location: 'Savann Pist',
    retailPrice: 200,
    discount: 35,
    currentPrice: 130,
    quantity: 75,
    sold: 42,
    delivery: '1-2 months',
    image: '🧵',
    status: 'live',
  },
  {
    id: 'cacao-box',
    name: 'Artisan Cacao Gift Box',
    business: 'Ixora Collective',
    sector: 'Food',
    location: 'Damascin, Haiti',
    retailPrice: 85,
    discount: 40,
    currentPrice: 51,
    quantity: 150,
    sold: 67,
    delivery: '2-4 weeks',
    image: '🍫',
    status: 'live',
  },
  {
    id: 'film-doc',
    name: 'Haiti Rising Documentary',
    business: 'Mzero Studios',
    sector: 'Film & Media',
    location: 'Port-au-Prince',
    retailPrice: 75,
    discount: 25,
    currentPrice: 56,
    quantity: 500,
    sold: 180,
    delivery: 'Digital delivery',
    image: '🎬',
    status: 'live',
  },
  {
    id: 'reforestation',
    name: 'Reforest Haiti Bundle (10 trees)',
    business: 'Green Haiti Initiative',
    sector: 'Reforestation',
    location: 'MIDI, Haiti',
    retailPrice: 150,
    discount: 30,
    currentPrice: 105,
    quantity: 300,
    sold: 95,
    delivery: 'Certificate delivery',
    image: '🌳',
    status: 'live',
  },
]

const batchInvestments = [
  {
    id: 'agri-batch-001',
    title: 'Agriculture Batch A',
    desc: 'Coffee, cacao, and mango projects across 3 farms',
    retailPrice: 5000,
    discount: 30,
    currentPrice: 3500,
    filled: 45,
    icon: '🌱',
  },
  {
    id: 'art-batch-001',
    title: 'Artisan Collective Batch',
    desc: 'Textiles, paintings, and crafts from 12 Haitian artists',
    retailPrice: 2000,
    discount: 35,
    currentPrice: 1300,
    filled: 62,
    icon: '🎨',
  },
]

export default function DealsPage() {
  const [activeSector, setActiveSector] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  const filteredCampaigns = activeSector === 'all'
    ? campaigns
    : campaigns.filter(c => c.sector === activeSector)

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Pre-Fab <span className="text-green-500">Rewards</span> Pool
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Back Haitian businesses and receive quality products at 25-40% below retail. No revenue share — just great deals.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Active Campaigns', value: '6' },
              { label: 'Products Delivered', value: '847' },
              { label: 'Backers', value: '2.4K' },
              { label: 'Money Saved', value: '$42K' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-green-400 mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Sector Filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {sectors.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSector(s.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                  activeSector === s.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Campaign Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredCampaigns.map((campaign) => {
              const progress = Math.round((campaign.sold / campaign.quantity) * 100)
              const tier = progress < 25 ? 1 : progress < 50 ? 2 : progress < 75 ? 3 : 4
              const discount = progress < 25 ? 40 : progress < 50 ? 25 : progress < 75 ? 15 : 10

              return (
                <Link
                  key={campaign.id}
                  href={`/deals/${campaign.id}`}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all"
                >
                  {/* Image Area */}
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-6xl">{campaign.image}</span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full">
                        {campaign.sector}
                      </span>
                      <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-xs rounded-full">
                        {campaign.location}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green-400 transition">
                      {campaign.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">by {campaign.business}</p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{campaign.sold}/{campaign.quantity} claimed</span>
                        <span className="text-green-400 font-bold">{discount}% OFF</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-500 text-sm line-through">${campaign.retailPrice}</span>
                        <span className="text-2xl font-black text-white ml-2">${campaign.currentPrice}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400 text-xs">Est. delivery</div>
                        <div className="text-white text-sm font-medium">{campaign.delivery}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Batch Investments Section */}
          <div className="border-t border-white/10 pt-12 mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">QuickStarter Batches</h2>
                <p className="text-gray-400">Bundled opportunities — lower risk, diversified exposure</p>
              </div>
              <span className="px-4 py-2 bg-amber-900/30 border border-amber-500/30 rounded-full text-amber-400 text-sm font-bold">
                BETA
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {batchInvestments.map((batch) => (
                <div key={batch.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-green-900/30 rounded-xl flex items-center justify-center text-3xl">
                      {batch.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{batch.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{batch.desc}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-500 text-sm line-through">${batch.retailPrice}</span>
                          <span className="text-2xl font-black text-green-400 ml-2">${batch.currentPrice}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-400 text-xs">{batch.filled}% filled</div>
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${batch.filled}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-green-900/20 to-green-950/50 border border-green-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Have a Product to Offer?</h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Haitian businesses can apply to list their products on Konbit Pool. We handle vetting, payment processing, and delivery coordination.
            </p>
            <Link
              href="/dashboard/onboard"
              className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-lg text-black transition-all"
            >
              Apply to List Your Product →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}