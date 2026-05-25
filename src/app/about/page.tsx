'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function AboutPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Thanks! We'll be in touch at ${email}`)
    setEmail('')
  }

  const team = [
    {
      name: 'Founding Team',
      role: 'Diaspora Entrepreneurs',
      bio: 'Built by Haitian professionals who understand both the homeland and the diaspora market.',
      emoji: '🌍',
    },
    {
      name: 'Technical Advisory',
      role: 'Web3 & Fintech',
      bio: 'Experienced builders from blockchain, payments, and emerging markets.',
      emoji: '⚡',
    },
    {
      name: 'Business Development',
      role: 'Haiti Operations',
      bio: 'On-the-ground partners with deep networks in Haitian business ecosystem.',
      emoji: '🇭🇹',
    },
  ]

  const values = [
    { title: 'Transparency', desc: 'Full visibility into where money goes and how returns are distributed.', icon: '🔍' },
    { title: 'Community First', desc: 'Decisions made with community input, not top-down mandates.', icon: '👥' },
    { title: 'Sustainable Growth', desc: 'Building businesses that last, not quick flips.', icon: '🌱' },
    { title: 'Access For All', desc: 'Low minimums so everyone can participate, regardless of wealth.', icon: '🚀' },
  ]

  const milestones = [
    { year: '2024', event: 'KONBIT founded with initial concept and community research' },
    { year: '2025', event: 'Platform development begins with first investment partners' },
    { year: '2026', event: 'Launch of Growth and Learn platforms for diaspora community' },
    { year: '2027', event: 'Planned expansion into additional sectors and regions' },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-6">
              <span className="text-green-500">KONBIT</span> — Konekte. Tèt ansanm. Pou nou vanse.
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We're building the bridge between Haitian diaspora and homeland opportunity.
              Invest in businesses. Learn from experts. Build the future together.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-gradient-to-br from-green-900/20 to-green-950/50 border border-green-500/20 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              To unlock investment and education opportunities for Haitian diaspora worldwide,
              while channeling capital and knowledge back to Haiti. We believe in the power
              of connected communities to create sustainable growth that benefits everyone.
            </p>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">What We Stand For</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <div className="text-3xl mb-4">{v.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-gray-400">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Who We Are</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((t, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-xl text-center">
                  <div className="text-5xl mb-4">{t.emoji}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{t.name}</h3>
                  <p className="text-green-400 text-sm mb-3">{t.role}</p>
                  <p className="text-gray-400 text-sm">{t.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Journey</h2>
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-20 text-green-500 font-bold text-lg">{m.year}</div>
                  <div className="flex-1 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-white">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-gray-400 mb-6">
              Have questions about KONBIT? Want to partner with us? We'd love to hear from you.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl text-sm font-bold text-black transition-all"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}