'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeftSidebar from '@/components/layout/LeftSidebar'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'

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
  { id: 'Health', label: 'Health', icon: '🏥' },
  { id: 'Education', label: 'Education', icon: '📚' },
  { id: 'Infrastructure', label: 'Infra', icon: '🏗️' },
]

const campaigns = [
  { name: 'Kay Ix', sector: 'Real Estate', location: 'Jacmel, Haiti', target: '$125,000', raised: '$87,500', percentage: 70, tokens: 'KAY001', returns: '11%', daysLeft: 14, image: '🏠' },
  { name: 'Mzero Studios', sector: 'Music', location: 'Port-au-Prince', target: '$75,000', raised: '$52,500', percentage: 70, tokens: 'MZS001', returns: '15%', daysLeft: 21, image: '🎵' },
  { name: 'Atis Rezistans', sector: 'Art', location: 'Savann Pist', target: '$40,000', raised: '$24,000', percentage: 60, tokens: 'AR001', returns: '9%', daysLeft: 28, image: '🎨' },
  { name: 'Manje Lakay', sector: 'Food', location: 'Delmas, PAP', target: '$60,000', raised: '$42,000', percentage: 70, tokens: 'MLK001', returns: '12%', daysLeft: 18, image: '🍳' },
  { name: 'Bassins Potagers', sector: 'Agriculture', location: 'MIDI, Haiti', target: '$45,000', raised: '$31,500', percentage: 70, tokens: 'BP001', returns: '14%', daysLeft: 12, image: '🌱' },
  { name: 'Eco Lodges HT', sector: 'Tourism', location: 'Cayes, Haiti', target: '$200,000', raised: '$140,000', percentage: 70, tokens: 'ELH001', returns: '13%', daysLeft: 35, image: '✈️' },
]

export default function GrowthPage() {
  const [selectedSector, setSelectedSector] = useState('all')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getCurrentUser().then(u => setUser(u))
  }, [])

  const filteredCampaigns = selectedSector === 'all'
    ? campaigns
    : campaigns.filter(c => c.sector === selectedSector)

  return (
    <div className="min-h-screen bg-black text-white">
      <LeftSidebar />
      <Navbar />

      <main className="ml-64 pt-16 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Investment <span className="text-green-500">Campaigns</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover high-growth investment opportunities in Haitian businesses. Browse vetted campaigns and become a part of their story.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Active Campaigns', value: '6' },
              { label: 'Total Raised', value: '$4.8M' },
              { label: 'Investors', value: '2,400+' },
              { label: 'Avg Returns', value: '12%' },
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
                onClick={() => setSelectedSector(s.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                  selectedSector === s.id
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
            {filteredCampaigns.map((campaign) => (
              <Link
                key={campaign.tokens}
                href={`/growth/${campaign.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all"
              >
                {/* Image Area */}
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-6xl">{campaign.image}</span>
                </div>

                {/* Content */}
                <div className="p-5">
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

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{campaign.raised} raised</span>
                      <span className="text-green-400 font-bold">{campaign.percentage}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                        style={{ width: `${campaign.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 text-sm">Target</span>
                      <span className="text-white font-medium ml-2">{campaign.target}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 text-xs">Returns</span>
                      <span className="text-green-400 font-bold ml-2">{campaign.returns}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Batch Investments */}
          <div className="border-t border-white/10 pt-12">
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
              {[
                { title: 'Agriculture Batch A', desc: 'Coffee, cacao, and mango projects across 3 farms', retailPrice: 5000, currentPrice: 3500, filled: 45, icon: '🌱' },
                { title: 'Artisan Collective Batch', desc: 'Textiles, paintings, and crafts from 12 Haitian artists', retailPrice: 2000, currentPrice: 1300, filled: 62, icon: '🎨' },
              ].map((batch) => (
                <div key={batch.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
        </div>
      </main>

      <Footer />
    </div>
  )
}