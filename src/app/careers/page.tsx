'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function CareersPage() {
  const [email, setEmail] = useState('')
  const [showForm, setShowForm] = useState(false)

  const openings = [
    {
      title: 'Blockchain Developer',
      type: 'Full-time',
      location: 'Remote (Worldwide)',
      description: 'Build smart contracts and DeFi integrations for KONBIT Growth platform.',
      requirements: ['Solidity', 'React/Next.js', 'Web3.js', '3+ years experience'],
    },
    {
      title: 'Marketing Lead',
      type: 'Full-time',
      location: 'Miami / Remote',
      description: 'Drive user acquisition and brand awareness across diaspora communities.',
      requirements: ['Digital marketing', 'Social media', 'Community building', 'Bilingual (EN/HT)'],
    },
    {
      title: 'Business Development',
      type: 'Full-time',
      location: 'Port-au-Prince / Remote',
      description: 'Identify and onboard Haitian businesses for the Growth platform.',
      requirements: ['Business networks in Haiti', 'Financial modeling', 'Negotiation skills'],
    },
    {
      title: 'Education Content Creator',
      type: 'Contract',
      location: 'Remote',
      description: 'Create courses and learning content for the KONBIT Learn platform.',
      requirements: ['Subject matter expertise', 'Teaching experience', 'Video editing'],
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4">Join Our Team</h1>
            <p className="text-gray-400 text-lg">
              Help us build the future of diaspora investment and education. Remote-first, globally distributed.
            </p>
          </div>

          {/* Values */}
          <div className="bg-gradient-to-br from-green-900/20 to-green-950/50 border border-green-500/20 rounded-2xl p-8 mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Why KONBIT?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <span className="text-green-500">🌍</span>
                <div>
                  <div className="font-medium text-white">Global Impact</div>
                  <div className="text-gray-400 text-sm">Your work directly helps diaspora communities</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-500">⚡</span>
                <div>
                  <div className="font-medium text-white">Remote-First</div>
                  <div className="text-gray-400 text-sm">Work from anywhere in the world</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-500">📈</span>
                <div>
                  <div className="font-medium text-white">High Growth</div>
                  <div className="text-gray-400 text-sm">Early team = big equity upside</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-500">🤝</span>
                <div>
                  <div className="font-medium text-white">Great Culture</div>
                  <div className="text-gray-400 text-sm">Mission-driven, high-trust team</div>
                </div>
              </div>
            </div>
          </div>

          {/* Openings */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Open Positions</h2>
            <div className="space-y-4">
              {openings.map((job, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{job.title}</h3>
                      <div className="flex gap-3 mt-1">
                        <span className="text-green-400 text-sm">{job.type}</span>
                        <span className="text-gray-500 text-sm">•</span>
                        <span className="text-gray-400 text-sm">{job.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-black transition"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-gray-400 mb-4">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((r, j) => (
                      <span key={j} className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Application */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-4">Don't See Your Role?</h2>
            <p className="text-gray-400 mb-6">
              We're always looking for talented people. Send us your info and we'll reach out when something opens up.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert('Thanks! We\'ll keep your info on file.')
                setEmail('')
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
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
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-black transition-all"
              >
                Keep in Touch
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}