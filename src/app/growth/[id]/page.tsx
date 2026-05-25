'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SlideSidebar from '@/components/layout/SlideSidebar'
import LeftSidebar from '@/components/layout/LeftSidebar'
import { getCurrentUser } from '@/lib/auth'

// Mock campaign data (would come from Supabase in production)
const mockCampaigns: Record<string, any> = {
  'kay-ix': {
    id: 'kay-ix',
    name: 'Kay Ix',
    sector: 'Real Estate',
    emoji: '🏠',
    description: 'Sustainable housing development project in Cap-Haïtien. Build affordable, earthquake-resistant homes for Haitian families while earning returns from rental income.',
    location: 'Cap-Haïtien, Haiti',
    raiseGoal: 75000,
    raised: 48750,
    tokenPrice: 25,
    tokenName: 'Kay Ix Revenue Token',
    tokenSymbol: 'KAY001',
    revenueShare: 8,
    minInvestment: 25,
    status: 'live',
    endDate: '2026-06-30',
    images: ['🏠', '🌴', '🏗️'],
    highlights: [
      'Earthquake-resistant construction',
      'Solar-powered homes',
      'Community development focus',
      '8% annual revenue share',
    ],
    business: {
      name: 'Kay Ix Construction',
      established: '2022',
      team: '12 employees',
      trackRecord: '50+ homes built',
    },
  },
  'mzero': {
    id: 'mzero',
    name: 'Mzero Studios',
    sector: 'Music',
    emoji: '🎵',
    description: 'State-of-the-art recording studio in Port-au-Prince. Launch the next generation of Haitian music globally while earning from studio bookings and music rights.',
    location: 'Port-au-Prince, Haiti',
    raiseGoal: 50000,
    raised: 38500,
    tokenPrice: 10,
    tokenName: 'Mzero Studios Rights',
    tokenSymbol: 'MZR001',
    revenueShare: 6,
    minInvestment: 10,
    status: 'live',
    endDate: '2026-06-15',
    images: ['🎵', '🎤', '🎹'],
    highlights: [
      'World-class equipment',
      'Streaming-ready productions',
      'Music rights revenue',
      '6% annual returns',
    ],
    business: {
      name: 'Mzero Productions',
      established: '2021',
      team: '8 employees',
      trackRecord: '200+ tracks recorded',
    },
  },
  'atis': {
    id: 'atis',
    name: 'Atis Rezistans',
    sector: 'Art',
    emoji: '🎨',
    description: 'Collective of Haitian street artists creating murals, gallery pieces, and digital art. Invest in art that tells our stories to the world.',
    location: 'Jacmel, Haiti',
    raiseGoal: 25000,
    raised: 25000,
    tokenPrice: 5,
    tokenName: 'Atis Art Rights',
    tokenSymbol: 'ART001',
    revenueShare: 5,
    minInvestment: 5,
    status: 'funded',
    endDate: '2026-05-30',
    images: ['🎨', '🖼️', '🎭'],
    highlights: [
      'Internationally exhibited artists',
      'Gallery partnerships in Miami & Paris',
      'Digital art certifications',
      '5% revenue share',
    ],
    business: {
      name: 'Atis Rezistans Collective',
      established: '2020',
      team: '15 artists',
      trackRecord: '30+ exhibitions',
    },
  },
  'manje': {
    id: 'manje',
    name: 'Manje Lakay',
    sector: 'Food',
    emoji: '🍳',
    description: 'Authentic Haitian food brand bringing traditional recipes to diaspora kitchens worldwide. Expand production and distribution of premium Haitian hot sauces and spices.',
    location: 'Delmas, Haiti',
    raiseGoal: 40000,
    raised: 15200,
    tokenPrice: 10,
    tokenName: 'Manje Lakay Revenue',
    tokenSymbol: 'MNL001',
    revenueShare: 7,
    minInvestment: 10,
    status: 'live',
    endDate: '2026-07-15',
    images: ['🍳', '🌶️', '📦'],
    highlights: [
      'USDA-approved production',
      'Diaspora distribution network',
      'Authentic family recipes',
      '7% annual returns',
    ],
    business: {
      name: 'Manje Lakay Foods',
      established: '2023',
      team: '6 employees',
      trackRecord: '10,000+ bottles sold',
    },
  },
}

export default function CampaignPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const campaignId = params.id as string
  const campaign = mockCampaigns[campaignId]

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  if (!campaign) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Campaign Not Found</h1>
          <button
            onClick={() => router.push('/growth')}
            className="px-6 py-3 bg-green-600 rounded-xl font-medium text-black"
          >
            Back to Growth
          </button>
        </div>
      </div>
    )
  }

  const progress = Math.min((campaign.raised / campaign.raiseGoal) * 100, 100)
  const tokensToBuy = Math.floor(parseInt(amount || '0') / campaign.tokenPrice)
  const potentialReturn = tokensToBuy * (campaign.revenueShare / 100)

  const handleInvest = async () => {
    if (!user) {
      router.push('/signin')
      return
    }
    setLoading(true)
    // Simulate investment processing
    await new Promise((r) => setTimeout(r, 1500))
    setSuccess(true)
    setLoading(false)
  }

  const sectorColors: Record<string, string> = {
    'Real Estate': 'from-green-600 to-green-400',
    'Music': 'from-purple-600 to-purple-400',
    'Art': 'from-pink-600 to-pink-400',
    'Food': 'from-amber-600 to-amber-400',
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <LeftSidebar />
            <SlideSidebar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => router.push('/growth')}
            className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition"
          >
            ← Back to Growth
          </button>

          {/* Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sectorColors[campaign.sector] || 'from-green-600 to-green-400'} flex items-center justify-center text-3xl flex-shrink-0`}>
              {campaign.emoji}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black">{campaign.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'live'
                    ? 'bg-green-900/50 text-green-400 border border-green-500/30'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {campaign.status === 'live' ? '● Live' : '✓ Funded'}
                </span>
              </div>
              <p className="text-gray-400">
                {campaign.sector} • {campaign.location}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Progress */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Raised</span>
                  <span className="font-bold text-white">
                    ${campaign.raised.toLocaleString()} / ${campaign.raiseGoal.toLocaleString()}
                  </span>
                </div>
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${sectorColors[campaign.sector] || 'from-green-600 to-green-400'} rounded-full transition-all`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">{Math.round(progress)}% funded</span>
                  <span className="text-gray-500">Ends {campaign.endDate}</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">About This Opportunity</h2>
                <p className="text-gray-300 leading-relaxed">{campaign.description}</p>
              </div>

              {/* Highlights */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Highlights</h2>
                <div className="grid grid-cols-2 gap-3">
                  {campaign.highlights.map((h: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-300">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Business Profile</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-gray-500 text-sm mb-1">Established</div>
                    <div className="text-white font-bold">{campaign.business.established}</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-gray-500 text-sm mb-1">Team</div>
                    <div className="text-white font-bold">{campaign.business.team}</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-gray-500 text-sm mb-1">Track Record</div>
                    <div className="text-white font-bold text-sm">{campaign.business.trackRecord}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">Invest Now</h2>

                {/* Token Info */}
                <div className="bg-black/50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Token Price</span>
                    <span className="text-white font-bold">${campaign.tokenPrice}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Token Name</span>
                    <span className="text-white text-sm">{campaign.tokenName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Symbol</span>
                    <span className="text-green-400 font-mono">{campaign.tokenSymbol}</span>
                  </div>
                </div>

                {success ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="text-xl font-bold text-white mb-2">Investment Submitted!</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Your investment is being processed. You'll receive a confirmation email shortly.
                    </p>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="w-full py-3 bg-green-600 rounded-xl font-bold text-black"
                    >
                      View Dashboard
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm text-gray-300 mb-2">Investment Amount (USD)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          min={campaign.minInvestment}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder={`Min $${campaign.minInvestment}`}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50 transition"
                        />
                      </div>
                    </div>

                    {tokensToBuy > 0 && (
                      <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Tokens You'll Receive</span>
                          <span className="text-green-400 font-bold">{tokensToBuy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Est. Annual Return</span>
                          <span className="text-green-400 font-bold">${potentialReturn.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleInvest}
                      disabled={loading || !parseInt(amount || '0')}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-black transition-all disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : user ? 'Invest Now' : 'Sign In to Invest'}
                    </button>

                    <p className="text-gray-500 text-xs text-center mt-4">
                      Min: ${campaign.minInvestment} • {campaign.revenueShare}% revenue share
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}