'use client'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/auth'
import HaitiMapWrapper from '@/components/map/HaitiMapWrapper'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'growth' | 'learn'>('growth')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, _session) => {
      supabase.auth.getUser().then(({ data }) => setUser(data.user))
    })
    return () => subscription.unsubscribe()
  }, [])

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
          interests: [activeTab],
          source: 'landing_page',
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
    <div className="min-h-screen bg-[var(--bg-void)] text-white">
      {/* Hero Section - Haiti Map */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Full-screen map */}
        <div className="absolute inset-0 z-0">
          <HaitiMapWrapper />
        </div>

        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Top nav - transparent on map */}
        <nav className="relative z-20 pt-6 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-2xl font-black tracking-tight">
              <span className="text-[var(--green-primary)]">KON</span><span className="text-white">BIT</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#growth" className="text-sm text-white/70 hover:text-white transition">Growth</a>
              <a href="#learn" className="text-sm text-white/70 hover:text-white transition">Learn</a>
              <a href="/about" className="text-sm text-white/70 hover:text-white transition">About</a>
              {!user ? (
                <div className="flex items-center gap-3">
                  <Link href="/signin" className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition border border-white/20 rounded-lg hover:border-white/40">
                    Sign In
                  </Link>
                  <Link href="/waitlist" className="px-4 py-2 btn-neon rounded-lg text-sm font-medium transition text-black">
                    Join Waitlist
                  </Link>
                </div>
              ) : (
                <Link href="/dashboard" className="px-4 py-2 btn-neon rounded-lg text-sm font-medium transition text-black">
                  Dashboard →
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Hero content overlaid on map */}
        <div className="relative z-20 flex items-end justify-center min-h-screen pb-24 px-6">
          <div className="max-w-4xl mx-auto text-center">

            {/* Slogan */}
            <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)] text-[var(--green-primary)] text-xs font-bold rounded-full uppercase tracking-widest">
                🌍 Live Map
              </span>
              {['Regulated', 'On-Chain', 'Diaspora-Owned'].map((badge) => (
                <div key={badge} className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                  <span className="w-1.5 h-1.5 bg-[var(--green-primary)] rounded-full shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                  <span className="text-white/70 text-xs font-medium">{badge}</span>
                </div>
              ))}
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.02] tracking-tight">
              <span className="text-white">Invest in Haiti.</span><br />
              <span className="text-[var(--green-primary)] text-glow-green">Build Wealth. Build Home.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              The diaspora-to-homeland investment platform. Watch Haitian businesses come alive across the map — every pin a story, every investment a future built together.
            </p>

            {/* Platform Tabs */}
            <div className="flex justify-center mb-10">
              <div className="glass rounded-full p-1.5 flex gap-1.5 border border-[var(--border-subtle)]">
                <button
                  onClick={() => setActiveTab('growth')}
                  className={`px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'growth'
                      ? 'bg-[var(--green-primary)] text-black shadow-[var(--glow-green-md)]'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  KONBIT Growth
                </button>
                <button
                  onClick={() => setActiveTab('learn')}
                  className={`px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                    activeTab === 'learn'
                      ? 'bg-blue-500 text-black shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  KONBIT Learn
                </button>
              </div>
            </div>

            {/* Waitlist Form */}
            {!user && (
              <div className="glass-card rounded-2xl p-6 max-w-md mx-auto border border-[var(--border-glow)]">
                {!submitted ? (
                  <form onSubmit={handleWaitlist} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[var(--border-subtle)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--green-primary)] transition"
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-[var(--border-subtle)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--green-primary)] transition"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 btn-neon rounded-lg font-bold text-base transition disabled:opacity-50"
                    >
                      {loading ? 'Joining...' : `Join the ${activeTab === 'growth' ? 'Growth' : 'Learn'} Waitlist`}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-3">🎉</div>
                    <h3 className="text-xl font-bold text-[var(--green-primary)] mb-1">You're on the list!</h3>
                    <p className="text-white/50 text-sm">We'll notify you when KONBIT launches.</p>
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="mt-14 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-14">
              <div className="text-center">
                <div className="text-3xl font-black font-mono text-[var(--green-primary)] text-glow-green">$12M+</div>
                <div className="text-white/40 text-xs mt-1">Capital Raised</div>
              </div>
              <div className="hidden sm:block w-px bg-white/10 h-8" />
              <div className="text-center">
                <div className="text-3xl font-black font-mono text-white">2,847</div>
                <div className="text-white/40 text-xs mt-1">Diaspora Investors</div>
              </div>
              <div className="hidden sm:block w-px bg-white/10 h-8" />
              <div className="text-center">
                <div className="text-3xl font-black font-mono text-[var(--gold-accent)]">23</div>
                <div className="text-white/40 text-xs mt-1">Businesses Funded</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-white/30 text-xs">Scroll to explore</span>
          <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Why KONBIT Section - 5 Gaps from Competitive Research */}
      <section className="py-28 px-6 bg-[#030807]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-4">
              Why KONBIT
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Platform <span className="text-green-500">Built for Diaspora Investors</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              No other platform connects the diaspora directly to Haitian economic development with verified impact metrics.
            </p>
          </div>

          {/* 5 Gaps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Diaspora-to-Homeland Bridge',
                desc: 'Traditional platforms ignore the diaspora&apos;s unique position as both investors and stakeholders in Haiti&apos;s future. KONBIT is built specifically for this connection.',
                icon: '🌍'
              },
              {
                title: 'Cultural Narrative',
                desc: 'Most investment platforms frame Haiti through crisis optics. We showcase opportunity, heritage, and the vibrant businesses being built right now.',
                icon: '📖'
              },
              {
                title: 'Geographic Deep Focus',
                desc: 'Generalist platforms spread thin across emerging markets. KONBIT goes deep on Haiti &#8212; understanding local markets, regulations, and opportunities.',
                icon: '🎯'
              },
              {
                title: 'Financial + Social Returns',
                desc: 'KONBIT tokens offer revenue-sharing AND document your contribution to jobs created, businesses funded, and economic output in Haiti.',
                icon: '📈'
              },
              {
                title: 'Trust & Transparency',
                desc: 'Every investment is on-chain. Every distribution is automatic via smart contracts. Your capital and returns are fully verifiable, always.',
                icon: '🔐'
              },
            ].map((gap) => (
              <div key={gap.title} className="bg-white/[3%] border border-white/[8%] rounded-2xl p-8 hover:bg-white/[6%] hover:border-green-500/40 transition-all duration-300">
                <div className="text-4xl mb-6">{gap.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{gap.title}</h3>
                <p className="text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: gap.desc.replace(/&apos;/g, "'") }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Haiti Trust Layer - Diaspora Organizations & Partners */}
      <section className="py-24 px-6 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-4">
              🇨🇩 Trusted by the Diaspora
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built with <span className="text-green-500">Haitian Expertise</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              KONBIT is advisor-backed by Haitian diaspora leaders, community organizers, and economic development professionals who understand both sides of the bridge.
            </p>
          </div>

          {/* Partner/Organization Logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { name: 'Haitian American Caucus', desc: 'Economic Development', initial: 'HAC' },
              { name: 'HPA Network', desc: 'Professional Diaspora Org', initial: 'HPA' },
              { name: 'Haitian Bridge Alliance', desc: 'Advocacy & Community', initial: 'HBA' },
              { name: 'Konbit Sante', desc: 'Healthcare Investment', initial: 'KS' },
            ].map((partner) => (
              <div key={partner.name}
                className="bg-white/[3%] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-green-500/30 transition group">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center text-white font-black text-lg mb-3 group-hover:scale-110 transition">
                  {partner.initial}
                </div>
                <p className="font-semibold text-white text-sm">{partner.name}</p>
                <p className="text-gray-500 text-xs mt-1">{partner.desc}</p>
              </div>
            ))}
          </div>

          {/* Three Pillars of Trust */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/[3%] border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold mb-2">Regulated Infrastructure</h3>
              <p className="text-gray-400 text-sm">Compliant with SEC regulations, blockchain-verified smart contracts, and transparent on-chain distributions.</p>
            </div>
            <div className="bg-white/[3%] border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold mb-2">Haitian Advisory Council</h3>
              <p className="text-gray-400 text-sm">Board of diaspora economists, entrepreneurs, and community leaders guiding every investment decision.</p>
            </div>
            <div className="bg-white/[3%] border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Verified Impact Metrics</h3>
              <p className="text-gray-400 text-sm">Every campaign tracks jobs created, capital deployed, and community impact — not just financial returns.</p>
            </div>
          </div>

          {/* Press / Media Mentions */}
          <div className="text-center mb-12">
            <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">Featured In</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {['Haiti Libre', 'The Haitian Times', 'Miami Herald', 'Le Nouvelliste', 'PRI'].map((pub) => (
                <span key={pub} className="text-gray-600 text-lg font-medium hover:text-gray-400 transition cursor-default">
                  {pub}
                </span>
              ))}
            </div>
          </div>

          {/* Partnership CTA */}
          <div className="bg-gradient-to-r from-green-900/40 via-green-800/20 to-green-900/40 border border-green-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Are you a Haitian diaspora organization?</h3>
            <p className="text-gray-400 mb-6">Partner with KONBIT to bring exclusive investment opportunities to your community.</p>
            <a href="mailto:partnerships@konbit.io"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl text-base font-bold text-black transition">
              Request Partnership →
            </a>
          </div>
        </div>
      </section>

      {/* KONBIT Growth Section */}
      <section id="growth" className="py-28 px-6 bg-[#050807]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-4">
              KONBIT Growth
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Invest in <span className="text-green-500">Business Growth</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From vacation rentals to recording studios &#8212; invest in real Haitian businesses and earn returns while building communities.
            </p>
          </div>

          {/* Sectors */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
            {[
              { title: 'Real Estate', desc: 'Vacation rentals, apartments, commercial', icon: '🏠' },
              { title: 'Music', desc: 'Studios, venues, streaming', icon: '🎵' },
              { title: 'Art', desc: 'Galleries, exhibitions, collectives', icon: '🎨' },
              { title: 'Food', desc: 'Restaurants, artisanal products, exports', icon: '🍳' },
            ].map((sector) => (
              <div key={sector.title} className="group bg-white/[3%] border border-white/[8%] rounded-2xl p-6 hover:bg-white/[6%] hover:border-green-500/40 transition-all duration-300 cursor-pointer">
                <div className="text-3xl mb-4">{sector.icon}</div>
                <h3 className="text-lg font-bold mb-2">{sector.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{sector.desc}</p>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-8 text-center">How KONBIT Growth Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">1</div>
                <h4 className="font-bold mb-2">Browse Businesses</h4>
                <p className="text-gray-400 text-sm">Explore Haitian businesses seeking capital across real estate, music, art, and food.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">2</div>
                <h4 className="font-bold mb-2">Invest with Tokens</h4>
                <p className="text-gray-400 text-sm">Buy revenue-sharing tokens starting at $25. Smart contracts auto-distribute returns.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">3</div>
                <h4 className="font-bold mb-2">Earn and Track</h4>
                <p className="text-gray-400 text-sm">Receive automatic distributions. Track everything on-chain with full transparency.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KONBIT Learn Section */}
      <section id="learn" className="py-28 px-6 bg-[#020508]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-4">
              KONBIT Learn
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Learn from <span className="text-blue-400">Haitian Experts</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Courses taught by professionals from Haiti and the diaspora. New-age smart learning features that actually help you succeed.
            </p>
          </div>

          {/* Smart Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { title: 'AI Flashcards', desc: 'Auto-generated cards with spaced repetition for maximum retention' },
              { title: 'Smart Resume', desc: 'Pick up exactly where you left off -- never lose your place' },
              { title: 'Certificates', desc: 'LinkedIn-verified credentials that prove your skills' },
              { title: 'Study Streaks', desc: 'Build habits, earn badges, stay motivated' },
              { title: 'Gift and Track', desc: 'Sponsor someone&apos;s learning and watch their progress' },
              { title: 'Learning Paths', desc: 'Multi-course journeys designed for specific careers' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition">
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: feature.desc.replace(/&apos;/g, "'") }} />
              </div>
            ))}
          </div>

          {/* Gift Model */}
          <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-white/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Gift Knowledge</h3>
            <p className="text-gray-300 max-w-xl mx-auto">
              Sponsor someone in Haiti (or anywhere) to take a course. They learn, you track their progress, community grows stronger.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-28 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Built for <span className="text-green-500">All Nations, All People</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            KONBIT connects the global Haitian diaspora with opportunities to invest, learn, and build. Whether you&apos;re in Miami, Montreal, Paris, or Port-au-Prince &#8212; you&apos;re welcome here.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="font-bold mb-2">Global</h4>
              <p className="text-gray-400 text-sm">Haitians everywhere can participate</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="font-bold mb-2">On-Chain</h4>
              <p className="text-gray-400 text-sm">Transparent, verifiable transactions</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="font-bold mb-2">Smart</h4>
              <p className="text-gray-400 text-sm">Learning that actually works</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}