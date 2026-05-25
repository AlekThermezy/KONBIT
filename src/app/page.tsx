'use client'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/auth'

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
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">
            <span className="text-green-500">KON</span>BIT
          </div>
          <div className="flex items-center gap-6">
            <a href="#growth" className="text-sm text-gray-300 hover:text-white transition">Growth</a>
            <a href="#learn" className="text-sm text-gray-300 hover:text-white transition">Learn</a>
            <a href="#about" className="text-sm text-gray-300 hover:text-white transition">About</a>
            {!user ? (
              <div className="flex items-center gap-3">
                <Link href="/signin" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition border border-white/20 rounded-lg hover:border-white/40">
                  Sign In
                </Link>
                <Link href="/waitlist" className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition">
                  Join Waitlist
                </Link>
              </div>
            ) : (
              <Link href="/dashboard" className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition">
                Dashboard →
              </Link>
            )}
          </div>
        </div>
      </nav>

"|      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
        {/* Background Image - lighter overlay for sophistication */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/images/konbit-hero-port-au-prince-2050.png')"}} />
        {/* Subtle gradient - image should be visible */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        {/* Warm accent glow — adds panache */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px]" />
        
"|        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Elegant eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-green-500/30 rounded-full text-green-400/80 text-sm mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span>The Haitian Investment Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black mb-8 leading-[1.05] tracking-tight">
            <span className="text-green-500">Konekte.</span><br />
            <span className="text-white">T&#232;t ansanm.</span><br />
            <span className="text-white/60">Pou nou vanse.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300/80 mb-14 max-w-xl mx-auto leading-relaxed">
            Invest in Haitian businesses. Learn from Haitian experts. Build the future &#8212; all on one platform.
          </p>

"|          {/* Platform Tabs */}
          <div className="flex justify-center mb-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-full p-1 flex gap-1">
              <button
                onClick={() => setActiveTab('growth')}
                className={`px-8 py-3 rounded-full font-semibold text-sm transition ${
                  activeTab === 'growth'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                KONBIT Growth
              </button>
              <button
                onClick={() => setActiveTab('learn')}
                className={`px-8 py-3 rounded-full font-semibold text-sm transition ${
                  activeTab === 'learn'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                KONBIT Learn
              </button>
            </div>
          </div>

          {/* Waitlist Form - hidden when logged in */}
          {!user && (
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
              {!submitted ? (
                <form onSubmit={handleWaitlist} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Joining...' : `Join the ${activeTab === 'growth' ? 'Growth' : 'Learn'} Waitlist`}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">&#127881;</div>
                  <h3 className="text-2xl font-bold text-green-500 mb-2">You're on the list!</h3>
                  <p className="text-gray-400">We'll notify you when KONBIT launches.</p>
                </div>
              )}
            </div>
          )}

"|          {/* Stats */}
          <div className="mt-20 flex justify-center gap-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 tracking-tight">12</div>
              <div className="text-gray-500 text-sm mt-1">Sectors</div>
            </div>
            <div className="w-px bg-white/10 self-stretch" />
            <div className="text-center">
              <div className="text-4xl font-bold text-white tracking-tight">1</div>
              <div className="text-gray-500 text-sm mt-1">Platform</div>
            </div>
            <div className="w-px bg-white/10 self-stretch" />
            <div className="text-center">
              <div className="text-4xl font-bold text-white tracking-tight">All</div>
              <div className="text-gray-500 text-sm mt-1">Nations</div>
            </div>
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

"|          {/* Sectors */}
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