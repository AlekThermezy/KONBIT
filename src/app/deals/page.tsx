'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeftSidebar from '@/components/layout/LeftSidebar'
import { getCurrentUser } from '@/lib/auth'

const filterTabs = [
  { id: 'All', label: 'All', icon: '🌐' },
  { id: 'Real Estate', label: 'Real Estate', icon: '🏠' },
  { id: 'Music', label: 'Music', icon: '🎵' },
  { id: 'Art', label: 'Art', icon: '🎨' },
  { id: 'Food', label: 'Food', icon: '🍳' },
  { id: 'Artisan', label: 'Artisan', icon: '🧵' },
  { id: 'Tech', label: 'Tech', icon: '💻' },
]

const sortOptions = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'newest', label: 'Newest' },
  { id: 'ending', label: 'Ending Soon' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
]

// Combined campaigns from deals and growth pages
const dealsCampaigns = [
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

const growthCampaigns = [
  {
    id: 'kay-ix-growth',
    name: 'Kay Ix',
    business: 'Kay Ix Construction',
    sector: 'Real Estate',
    location: 'Jacmel, Haiti',
    retailPrice: 125000,
    currentPrice: 87500,
    target: '$125,000',
    raised: '$87,500',
    percentage: 70,
    tokens: 'KAY001',
    returns: '11%',
    daysLeft: 14,
    image: '🏠',
    status: 'live',
  },
  {
    id: 'mzero-growth',
    name: 'Mzero Studios',
    business: 'Mzero Studios',
    sector: 'Music',
    location: 'Port-au-Prince',
    retailPrice: 75000,
    currentPrice: 52500,
    target: '$75,000',
    raised: '$52,500',
    percentage: 70,
    tokens: 'MZS001',
    returns: '15%',
    daysLeft: 21,
    image: '🎵',
    status: 'live',
  },
  {
    id: 'atis-growth',
    name: 'Atis Rezistans',
    business: 'Atis Rezistans',
    sector: 'Art',
    location: 'Savann Pist',
    retailPrice: 40000,
    currentPrice: 24000,
    target: '$40,000',
    raised: '$24,000',
    percentage: 60,
    tokens: 'AR001',
    returns: '9%',
    daysLeft: 28,
    image: '🎨',
    status: 'live',
  },
  {
    id: 'manje-growth',
    name: 'Manje Lakay',
    business: 'Manje Lakay',
    sector: 'Food',
    location: 'Delmas, PAP',
    retailPrice: 60000,
    currentPrice: 42000,
    target: '$60,000',
    raised: '$42,000',
    percentage: 70,
    tokens: 'MLK001',
    returns: '12%',
    daysLeft: 18,
    image: '🍳',
    status: 'live',
  },
  {
    id: 'bassins-growth',
    name: 'Bassins Potagers',
    business: 'Bassins Potagers',
    sector: 'Agriculture',
    location: 'MIDI, Haiti',
    retailPrice: 45000,
    currentPrice: 31500,
    target: '$45,000',
    raised: '$31,500',
    percentage: 70,
    tokens: 'BP001',
    returns: '14%',
    daysLeft: 12,
    image: '🌱',
    status: 'live',
  },
  {
    id: 'eco-lodges-growth',
    name: 'Eco Lodges HT',
    business: 'Eco Lodges HT',
    sector: 'Tourism',
    location: 'Cayes, Haiti',
    retailPrice: 200000,
    currentPrice: 140000,
    target: '$200,000',
    raised: '$140,000',
    percentage: 70,
    tokens: 'ELH001',
    returns: '13%',
    daysLeft: 35,
    image: '✈️',
    status: 'live',
  },
]

// Normalize campaigns to a common format
const normalizeCampaign = (campaign: any, source: 'deals' | 'growth') => {
  if (source === 'deals') {
    return {
      ...campaign,
      type: 'deals' as const,
      returns: campaign.discount ? `${campaign.discount}% OFF` : undefined,
      daysLeft: campaign.delivery,
      percentage: Math.round((campaign.sold / campaign.quantity) * 100),
    }
  }
  return {
    ...campaign,
    type: 'growth' as const,
    sold: undefined,
    quantity: undefined,
    discount: undefined,
    delivery: campaign.daysLeft ? `${campaign.daysLeft} days left` : undefined,
  }
}

const allCampaigns = [
  ...dealsCampaigns.map(c => normalizeCampaign(c, 'deals')),
  ...growthCampaigns.map(c => normalizeCampaign(c, 'growth')),
]

export default function DealsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getCurrentUser().then(u => setUser(u))
  }, [])

  const filteredCampaigns = activeFilter === 'All'
    ? allCampaigns
    : allCampaigns.filter(c => c.sector === activeFilter)

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return 0 // maintain original order for now
      case 'ending':
        return (a.daysLeft || '').localeCompare(b.daysLeft || '')
      case 'price_low':
        return (a.currentPrice || 0) - (b.currentPrice || 0)
      case 'price_high':
        return (b.currentPrice || 0) - (a.currentPrice || 0)
      case 'popular':
      default:
        return (b.percentage || 0) - (a.percentage || 0)
    }
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <LeftSidebar />
      <Navbar />

      <main className="ml-64 pt-16 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Your <span className="text-green-500">Portfolio</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore vetted investment opportunities and reward-based campaigns from Haitian entrepreneurs. Invest with confidence.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Active Campaigns', value: String(allCampaigns.length) },
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

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                  activeFilter === tab.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-400 text-sm">
              Showing <span className="text-white font-medium">{sortedCampaigns.length}</span> campaigns
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-400 text-sm">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Campaign Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sortedCampaigns.map((campaign) => (
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
                      {campaign.type === 'deals' ? 'Deal' : 'Growth'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green-400 transition">
                    {campaign.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">by {campaign.business}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      {campaign.type === 'deals' ? (
                        <span className="text-gray-400">{campaign.sold}/{campaign.quantity} claimed</span>
                      ) : (
                        <span className="text-gray-400">{campaign.raised} raised</span>
                      )}
                      <span className="text-green-400 font-bold">
                        {campaign.type === 'deals' ? campaign.returns : `${campaign.percentage}%`}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                        style={{ width: `${campaign.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 text-sm line-through">${campaign.retailPrice?.toLocaleString()}</span>
                      <span className="text-2xl font-black text-white ml-2">${campaign.currentPrice?.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      {campaign.type === 'deals' ? (
                        <>
                          <div className="text-gray-400 text-xs">Est. delivery</div>
                          <div className="text-white text-sm font-medium">{campaign.delivery}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-gray-400 text-xs">Returns</div>
                          <div className="text-green-400 text-sm font-bold">{campaign.returns}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          {!user && (
            <div className="bg-gradient-to-br from-green-900/20 to-green-950/50 border border-green-500/30 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Have a Product to Offer?</h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Haitian businesses can apply to list their products on Konbit Pool. We handle vetting, payment processing, and delivery coordination.
              </p>
              <Link
                href="/dashboard/onboard"
                className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-lg text-black transition-all"
              >
                Launch Your Campaign →
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}