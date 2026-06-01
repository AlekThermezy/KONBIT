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

const sectorEmojis: Record<string, string> = {
  real_estate: '🏠',
  music: '🎵',
  art: '🎨',
  food: '🍳',
  artisan: '🧵',
  tech: '💻',
  agriculture: '🌱',
  film: '🎬',
  tourism: '✈️',
}

export default function DealsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [user, setUser] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then(u => setUser(u))
    fetchCampaigns()
  }, [])

  async function fetchCampaigns() {
    setLoading(true)
    try {
      const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const res = await fetch(
        `${SB_URL}/rest/v1/campaigns?status=eq.live&select=*,businesses(name,sector,city,country)&order=raised_cents.desc`,
        {
          headers: {
            apikey: SB_KEY,
            Authorization: `Bearer ${SB_KEY}`,
          },
        }
      )
      const data = await res.json()
      setCampaigns(data || [])
    } catch (err) {
      console.error('Failed to fetch campaigns:', err)
    } finally {
      setLoading(false)
    }
  }

  // Map Supabase campaigns to card format
  const mappedCampaigns = campaigns.map((c: any) => {
    const pct = c.raise_goal_cents > 0
      ? Math.round((c.raised_cents / c.raise_goal_cents) * 100)
      : 0
    return {
      id: c.id,
      name: c.title,
      business: c.businesses?.name || 'Unknown',
      sector: c.businesses?.sector || 'other',
      location: [c.businesses?.city, c.businesses?.country].filter(Boolean).join(', ') || 'Haiti',
      target: c.raise_goal_cents,
      raised: c.raised_cents,
      percentage: pct,
      tokens: c.token_symbol,
      returns: c.token_type === 'revenue_share' && c.revenue_share_pct
        ? `${c.revenue_share_pct}% revenue share`
        : c.token_type === 'equity' && c.equity_pct
        ? `${c.equity_pct}% equity`
        : c.token_type,
      daysLeft: c.ends_at
        ? Math.max(0, Math.ceil((new Date(c.ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : null,
      image: sectorEmojis[c.businesses?.sector] || '🌍',
      type: 'growth' as const,
    }
  })

  const filteredCampaigns = activeFilter === 'All'
    ? mappedCampaigns
    : mappedCampaigns.filter((c: any) => {
        const map: Record<string, string> = {
          'Real Estate': 'real_estate',
          'Music': 'music',
          'Art': 'art',
          'Food': 'food',
          'Artisan': 'artisan',
          'Tech': 'tech',
        }
        return c.sector === map[activeFilter]
      })

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return 0
      case 'ending':
        return (a.daysLeft || 999) - (b.daysLeft || 999)
      case 'price_low':
        return (a.raised || 0) - (b.raised || 0)
      case 'price_high':
        return (b.raised || 0) - (a.raised || 0)
      case 'popular':
      default:
        return (b.percentage || 0) - (a.percentage || 0)
    }
  })

  const totalRaised = campaigns.reduce((sum: number, c: any) => sum + (c.raised_cents || 0), 0) / 100
  const totalBackers = campaigns.reduce((sum: number, c: any) => sum + (c.investor_count || 0), 0)

  return (
    <div className="min-h-screen bg-black text-white">
      <LeftSidebar />
      <Navbar />

      <main className="ml-64 pt-16 pb-16 px-6">
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
              { label: 'Active Campaigns', value: String(mappedCampaigns.length) },
              { label: 'Products Delivered', value: '847' },
              { label: 'Backers', value: totalBackers > 0 ? String(totalBackers) : '2.4K' },
              { label: 'Money Saved', value: '$42K' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-4 text-center border border-[var(--border-subtle)]">
                <div className="text-3xl font-black text-glow-green mb-1 font-mono">{stat.value}</div>
                <div className="text-[var(--text-secondary)] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                  activeFilter === tab.id
                    ? 'bg-[#15803d] text-white shadow-[0_0_20px_rgba(34,197,94,0.35)] border border-green-500/40'
                    : 'bg-[rgba(255,255,255,0.03)] text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] border border-transparent'
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
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                    <div className="h-2 bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedCampaigns.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-white mb-2">No campaigns live yet</h3>
              <p className="text-gray-400">Check back soon — new campaigns launch regularly.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {sortedCampaigns.map((campaign: any) => (
                <Link
                  key={campaign.id}
                  href={`/deals/${campaign.id}`}
                  className="group glass-card rounded-2xl overflow-hidden hover:border-[var(--border-glow)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-6xl">{campaign.image}</span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full">
                        {campaign.sector?.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-xs rounded-full">
                        Growth
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green-400 transition">
                      {campaign.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">by {campaign.business}</p>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">
                          ${((campaign.raised || 0) / 100).toLocaleString()} raised
                        </span>
                        <span className="text-green-400 font-bold">{campaign.percentage}%</span>
                      </div>
                      <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#15803d] to-[#22c55e] rounded-full progress-glow"
                          style={{ width: `${Math.min(campaign.percentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-500 text-sm">Target </span>
                        <span className="text-lg font-black text-white">
                          ${((campaign.target || 0) / 100).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400 text-xs">Returns</div>
                        <div className="text-green-400 text-sm font-bold">{campaign.returns}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          {!user && (
            <div className="glass-card bg-gradient-to-br from-[#15803d]/20 to-[#0a0a0a] border border-[var(--border-glow)] rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Have a Product to Offer?</h2>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Haitian businesses can apply to list their products on Konbit Pool. We handle vetting, payment processing, and delivery coordination.
              </p>
              <Link
                href="/dashboard/onboard"
                className="inline-block px-8 py-4 btn-neon rounded-xl font-bold text-lg text-black transition-all"
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
