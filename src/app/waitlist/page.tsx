'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

import { useState } from 'react'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function WaitlistPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    if (!isSupabaseConfigured()) {
      // Demo mode - simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStatus('success')
      setMessage('You\'re on the list! We\'ll be in touch soon.')
      setName('')
      setEmail('')
      return
    }

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({
          name,
          email
        })

      if (error) {
        if (error.code === '23505') {
          setStatus('error')
          setMessage('This email is already on the waitlist!')
        } else {
          throw error
        }
      } else {
        setStatus('success')
        setMessage('You\'re on the list! We\'ll be in touch soon.')
        setName('')
        setEmail('')
      }
    } catch (err) {
      console.error('Waitlist error:', err)
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center justify-center px-6 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-green-600/10 rounded-full blur-[100px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-6">
            ✨ Join the KONBIT Community
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-green-500">Be First</span> to<br />
            <span className="text-white">Invest in Haiti</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join our waitlist to get early access to investment opportunities, 
            exclusive updates, and insider insights from Haitian entrepreneurs.
          </p>

          {/* Waitlist Form */}
          <div className="max-w-md mx-auto">
            {status === 'success' ? (
              <div className="bg-gradient-to-br from-green-900/40 to-green-950/40 border border-green-500/30 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-500 mb-2">You&apos;re on the list!</h3>
                <p className="text-gray-400 mb-6">{message}</p>
                <p className="text-gray-500 text-sm">
                  Check your inbox for a confirmation email.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition"
                >
                  Add another email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="text-left">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Jean Pierre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                    />
                  </div>
                  
                  <div className="text-left">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="jean@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Joining...
                      </span>
                    ) : (
                      'Join the Waitlist'
                    )}
                  </button>
                </div>

                <p className="text-gray-500 text-sm text-center">
                  No spam. Unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Why <span className="text-green-500">Join Now?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Get ahead of the curve and be part of something transformative.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🚀',
                title: 'Early Access',
                desc: 'Be the first to see new investment campaigns before they go public.'
              },
              {
                icon: '📊',
                title: 'Exclusive Insights',
                desc: 'Receive detailed market reports and analysis from Haitian experts.'
              },
              {
                icon: '🤝',
                title: 'Direct Connection',
                desc: 'Connect with entrepreneurs and fellow investors in the KONBIT community.'
              }
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white/5 border border-white/10 hover:border-green-500/30 rounded-2xl p-8 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '2,400+', label: 'Waitlist Members' },
              { value: '$4.8M', label: 'Committed Capital' },
              { value: '12%', label: 'Avg Projected Returns' },
              { value: '4', label: 'Sectors Open' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-2xl md:text-3xl font-black text-green-500 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-black to-green-900/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px]" />
        
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Still Have <span className="text-green-500">Questions?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Learn more about how KONBIT works and what it means to invest in Haitian businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/growth"
              className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
            >
              Explore Opportunities
            </Link>
            <Link
              href="/learn"
              className="px-8 py-4 bg-white/5 border border-white/20 hover:border-green-500/50 rounded-xl font-bold text-lg transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}