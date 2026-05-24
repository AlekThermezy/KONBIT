'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Nature() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleJoin = async (e: React.FormEvent) => {
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
          interests: ['nature'],
          source: 'nature_page',
          newsletter: true
        })
      })
      if (response.ok) setSubmitted(true)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const initiatives = [
    {
      title: 'Reforestation',
      desc: 'Tree planting programs across Haiti to restore forests and combat erosion.',
      icon: '🌳',
      impact: '50,000+ trees planted'
    },
    {
      title: 'Clean Water',
      desc: 'Solar-powered water filtration systems for rural communities.',
      icon: '💧',
      impact: '200+ villages served'
    },
    {
      title: 'Solar Energy',
      desc: 'Off-grid renewable energy solutions for homes and businesses.',
      icon: '☀️',
      impact: '1MW capacity installed'
    },
    {
      title: 'Waste to Wealth',
      desc: 'Turning agricultural waste into compost, biochar, and building materials.',
      icon: '♻️',
      impact: '10,000 tons recycled'
    }
  ]

  const partners = [
    { name: 'Conservation Intl', type: 'Environmental NGO' },
    { name: 'SolarAid Haiti', type: 'Renewable Energy' },
    { name: 'FONDAMA', type: 'Grassroots Network' },
    { name: 'EarthSpark', type: 'Clean Energy' }
  ]

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-stone-950 to-amber-900/10" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-amber-600/10 rounded-full blur-[100px]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-700/40 rounded-full text-green-400 text-sm mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            KONBIT Nature
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-green-400">Protect.</span><br />
            <span className="text-stone-100">Restore.</span><br />
            <span className="text-amber-500">Prosper.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-400 mb-12 max-w-2xl mx-auto">
            Environmental initiatives that create sustainable livelihoods. Join Haiti's green transformation — invest in projects that heal the land and strengthen communities.
          </p>

          {/* Join Form */}
          <div className="bg-stone-900/50 border border-stone-700/40 rounded-2xl p-8 max-w-md mx-auto">
            {!submitted ? (
              <form onSubmit={handleJoin} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/40 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-green-500 transition"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/40 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-green-500 transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-green-700 hover:bg-green-600 rounded-lg font-bold text-lg transition disabled:opacity-50"
                >
                  {loading ? 'Joining...' : 'Join the Green Movement'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🌿</div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">You're part of the solution!</h3>
                <p className="text-stone-400">We'll notify you when nature projects launch.</p>
              </div>
            )}
          </div>

          {/* Impact Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-400">50K+</div>
              <div className="text-stone-500 text-sm">Trees Planted</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-500">200+</div>
              <div className="text-stone-500 text-sm">Villages</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-400">1MW</div>
              <div className="text-stone-500 text-sm">Solar Capacity</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A <span className="text-green-400">New Green Deal</span> for Haiti
            </h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              We believe environmental sustainability and economic growth go hand in hand. Every project on KONBIT Nature balances ecological restoration with community prosperity.
            </p>
          </div>

          {/* Initiatives Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {initiatives.map((item) => (
              <div key={item.title} className="bg-stone-900/50 border border-stone-700/40 rounded-xl p-8 hover:border-green-700/60 transition group">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-stone-100">{item.title}</h3>
                    <p className="text-stone-400 text-sm mb-3">{item.desc}</p>
                    <div className="inline-flex items-center px-3 py-1 bg-green-900/30 border border-green-700/40 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                      <span className="text-green-400 text-xs font-medium">{item.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-stone-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Invest in the <span className="text-amber-500">Earth</span>
            </h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              Own revenue-sharing tokens tied to verified environmental impact. Earn returns while restoring Haiti.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-700 to-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-green-900/50">🌱</div>
              <h4 className="font-bold mb-2 text-lg">Browse Projects</h4>
              <p className="text-stone-400 text-sm">Explore reforestation, solar, water, and waste projects across Haiti.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-amber-900/50">🪙</div>
              <h4 className="font-bold mb-2 text-lg">Invest Tokens</h4>
              <p className="text-stone-400 text-sm">Buy impact tokens starting at $25. Revenue shares fund restoration.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-700 to-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-emerald-900/50">📈</div>
              <h4 className="font-bold mb-2 text-lg">Track Impact</h4>
              <p className="text-stone-400 text-sm">Satellite verification. On-chain tracking. Real environmental results.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 px-6 bg-stone-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-green-400">Partners</span>
            </h2>
            <p className="text-stone-400">Working with trusted organizations across Haiti</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partners.map((partner) => (
              <div key={partner.name} className="bg-stone-800/50 border border-stone-700/40 rounded-xl p-6 text-center hover:border-green-700/40 transition">
                <h4 className="font-bold text-sm mb-1">{partner.name}</h4>
                <p className="text-stone-500 text-xs">{partner.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-stone-900/50 to-stone-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to <span className="text-green-400">Grow</span> the Future?
          </h2>
          <p className="text-lg text-stone-400 mb-8 max-w-xl mx-auto">
            Be first to invest in Haiti's greenest opportunities. Join the waitlist and get early access when projects launch.
          </p>
          <Link href="#" className="inline-block px-8 py-4 bg-green-700 hover:bg-green-600 rounded-xl font-bold text-lg transition">
            Join the Waitlist →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-stone-950 border-t border-stone-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-bold">
            <span className="text-green-500">KON</span>BIT
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-stone-400 hover:text-stone-100 transition text-sm">Home</Link>
            <a href="#" className="text-stone-400 hover:text-stone-100 transition text-sm">About</a>
            <a href="#" className="text-stone-400 hover:text-stone-100 transition text-sm">Contact</a>
          </div>
          <div className="text-stone-600 text-sm">
            © 2025 KONBIT. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}