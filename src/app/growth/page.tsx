'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

import { useState } from 'react'
import Link from 'next/link'

const sectors = [
  {
    title: 'Real Estate',
    icon: '🏠',
    desc: 'Vacation rentals, apartments & commercial properties',
    color: 'from-green-500/20 to-green-600/5',
    borderColor: 'hover:border-green-500/50',
    returns: '8-14%',
    invested: '$2.4M'
  },
  {
    title: 'Music',
    icon: '🎵',
    desc: 'Recording studios, venues & streaming rights',
    color: 'from-purple-500/20 to-purple-600/5',
    borderColor: 'hover:border-purple-500/50',
    returns: '12-22%',
    invested: '$890K'
  },
  {
    title: 'Art',
    icon: '🎨',
    desc: 'Galleries, exhibitions & artist collectives',
    color: 'from-amber-500/20 to-amber-600/5',
    borderColor: 'hover:border-amber-500/50',
    returns: '6-18%',
    invested: '$450K'
  },
  {
    title: 'Food',
    icon: '🍳',
    desc: 'Restaurants, artisanal products & exports',
    color: 'from-orange-500/20 to-orange-600/5',
    borderColor: 'hover:border-orange-500/50',
    returns: '10-16%',
    invested: '$1.1M'
  }
]

const campaigns = [
  {
    name: 'Kay Ix是一个人',
    sector: 'Real Estate',
    location: 'Jacmel, Haiti',
    target: '$125,000',
    raised: '$87,500',
    percentage: 70,
    tokens: 'KAY001',
    returns: '11%',
    daysLeft: 14
  },
  {
    name: 'Mzero Studios',
    sector: 'Music',
    location: 'Port-au-Prince',
    target: '$75,000',
    raised: '$52,500',
    percentage: 70,
    tokens: 'MZS001',
    returns: '15%',
    daysLeft: 21
  },
  {
    name: 'Atis Rezistans',
    sector: 'Art',
    location: 'Savann Pist',
    target: '$40,000',
    raised: '$24,000',
    percentage: 60,
    tokens: 'AR001',
    returns: '9%',
    daysLeft: 28
  },
  {
    name: 'Manje Lakay',
    sector: 'Food',
    location: 'Delmas, PAP',
    target: '$60,000',
    raised: '$42,000',
    percentage: 70,
    tokens: 'MLK001',
    returns: '12%',
    daysLeft: 18
  }
]

const steps = [
  {
    number: '01',
    title: 'Browse Opportunities',
    desc: 'Explore vetted Haitian businesses seeking growth capital across real estate, music, art, and food sectors.'
  },
  {
    number: '02',
    title: 'Purchase Revenue Tokens',
    desc: 'Buy revenue-sharing tokens starting at $25. Each token represents your share of future business revenue.'
  },
  {
    number: '03',
    title: 'Earn Automatic Returns',
    desc: 'Smart contracts auto-distribute revenue shares directly to your wallet. Track everything on-chain.'
  }
]

export default function GrowthPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedSector, setSelectedSector] = useState<string | null>(null)

  const filteredCampaigns = selectedSector
    ? campaigns.filter(c => c.sector === selectedSector)
    : campaigns

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email,
          name,
          interests: ['growth'],
          source: 'growth_page',
          newsletter: true
        })
      })
      
      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Error:', error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-green-600/10 rounded-full blur-[100px]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-6">
            📈 KONBIT Growth — Invest in Haitian Business
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-green-500">Grow</span> Haitian<br />
            <span className="text-white">Business Together</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Invest in vetted Haitian businesses. Earn revenue shares. Build communities — all on-chain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a 
              href="#sectors"
              className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
            >
              Explore Sectors
            </a>
            <a 
              href="#campaigns"
              className="px-8 py-4 bg-white/5 border border-white/20 hover:border-green-500/50 rounded-xl font-bold text-lg transition-all duration-200"
            >
              View Campaigns
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: '4', label: 'Sectors' },
              { value: '$4.8M', label: 'Total Raised' },
              { value: '2,400+', label: 'Investors' },
              { value: '12%', label: 'Avg Returns' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-3xl md:text-4xl font-black text-green-500 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="sectors" className="py-24 px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-4">
              Investment Sectors
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Four Ways to <span className="text-green-500">Grow Haiti</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From vacation rentals to recording studios — invest in real Haitian businesses across these sectors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectors.map((sector) => (
              <div 
                key={sector.title} 
                className={`bg-gradient-to-br ${sector.color} border border-white/10 ${sector.borderColor} rounded-2xl p-6 transition-all duration-300 group cursor-pointer`}
              >
                <div className="text-4xl mb-4">{sector.icon}</div>
                <h3 className="text-xl font-bold mb-2">{sector.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{sector.desc}</p>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Avg Returns</div>
                    <div className="text-green-500 font-bold">{sector.returns}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Invested</div>
                    <div className="text-white font-bold">{sector.invested}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section id="campaigns" className="py-24 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-4">
              Active Campaigns
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Invest in <span className="text-green-500">Live Opportunities</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Browse active campaigns seeking capital. Each includes smart contract-backed revenue sharing.
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedSector(null)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                selectedSector === null
                  ? 'bg-green-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              All Sectors
            </button>
            {sectors.map((sector) => (
              <button
                key={sector.title}
                onClick={() => setSelectedSector(sector.title)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                  selectedSector === sector.title
                    ? 'bg-green-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {sector.icon} {sector.title}
              </button>
            ))}
          </div>

          {/* Campaign Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCampaigns.map((campaign) => (
              <div 
                key={campaign.tokens}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{campaign.name}</h3>
                    <p className="text-gray-500 text-sm">📍 {campaign.location}</p>
                  </div>
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg px-3 py-1">
                    <span className="text-green-400 text-sm font-medium">{campaign.tokens}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{campaign.raised} raised</span>
                    <span className="text-green-500 font-medium">{campaign.percentage}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${campaign.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Target</div>
                    <div className="text-white font-medium">{campaign.target}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Returns</div>
                    <div className="text-green-500 font-medium">{campaign.returns}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Days Left</div>
                    <div className="text-white font-medium">{campaign.daysLeft}</div>
                  </div>
                </div>

                <Link
                  href={`/growth/campaign/${campaign.tokens.toLowerCase()}`}
                  className="block w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-semibold text-center transition"
                >
                  View Campaign
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-24 px-6 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-4">
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              How <span className="text-green-500">KONBIT Growth</span> Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Invest in Haitian businesses in three simple steps. No complicated finance jargon.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full hover:border-green-500/30 transition-all duration-300">
                  <div className="text-6xl font-black text-green-500/20 mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-green-500/50">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {[
              { title: 'Low Minimum', desc: 'Start investing from $25' },
              { title: 'Auto Distributions', desc: 'Revenue paid automatically' },
              { title: 'Full Transparency', desc: 'Track everything on-chain' },
              { title: 'KYC Verified', desc: 'All businesses vetted' }
            ].map((feature) => (
              <div key={feature.title} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <h4 className="font-bold mb-1">{feature.title}</h4>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-black to-green-900/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[150px]" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-green-900/40 to-green-950/40 border border-green-500/30 rounded-3xl p-10 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to <span className="text-green-500">Invest?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
              Join the waitlist to get early access to campaigns before they go live. Be among the first investors.
            </p>

            {!submitted ? (
              <form onSubmit={handleWaitlist} className="max-w-md mx-auto space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg transition disabled:opacity-50 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                >
                  {loading ? 'Joining...' : 'Join Growth Waitlist'}
                </button>
                <p className="text-gray-500 text-sm">
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div className="py-12">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-500 mb-2">You&apos;re on the list!</h3>
                <p className="text-gray-400">We&apos;ll notify you when campaigns go live.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}