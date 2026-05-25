'use client'
import Footer from '@/components/layout/Footer'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'growth' | 'learn'>('growth')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

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
            <Link href="/waitlist" className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition">
              Join Waitlist
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/images/konbit-hero-port-au-prince-2050.png')"}} />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[100px]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="text-green-500">Konekte.</span><br />
            <span className="text-white">T&#232;t ansanm.</span><br />
            <span className="text-white/80">Pou nou vanse.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Invest in Haitian businesses. Learn from Haitian experts. Build the future together &#8212; all on one platform.
          </p>

          {/* Platform Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 rounded-xl p-1 flex gap-1">
              <button
                onClick={() => setActiveTab('growth')}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  activeTab === 'growth'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                KONBIT Growth
              </button>
              <button
                onClick={() => setActiveTab('learn')}
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  activeTab === 'learn'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                KONBIT Learn
              </button>
            </div>
          </div>

          {/* Waitlist Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
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
                <h3 className="text-2xl font-bold text-green-500 mb-2">You&apos;re on the list!</h3>
                <p className="text-gray-400">We&apos;ll notify you when KONBIT launches.</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-green-500">12</div>
              <div className="text-gray-500 text-sm">Sectors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500">1</div>
              <div className="text-gray-500 text-sm">Platform</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500">All</div>
              <div className="text-gray-500 text-sm">Nations</div>
            </div>
          </div>
        </div>
      </section>

      {/* KONBIT Growth Section */}
      <section id="growth" className="py-24 px-6 bg-gradient-to-b from-black to-gray-950">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { title: 'Real Estate', desc: 'Vacation rentals, apartments, commercial' },
              { title: 'Music', desc: 'Studios, venues, streaming' },
              { title: 'Art', desc: 'Galleries, exhibitions, collectives' },
              { title: 'Food', desc: 'Restaurants, artisanal products, exports' },
            ].map((sector) => (
              <div key={sector.title} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition">
                <h3 className="text-xl font-bold mb-2">{sector.title}</h3>
                <p className="text-gray-400 text-sm">{sector.desc}</p>
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
      <section id="learn" className="py-24 px-6 bg-gray-950">
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
      <section id="about" className="py-24 px-6 bg-black">
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