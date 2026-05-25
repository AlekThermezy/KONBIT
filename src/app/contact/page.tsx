'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const contactOptions = [
    { icon: '📧', label: 'Email', value: 'hello@konbit.io', href: 'mailto:hello@konbit.io' },
    { icon: '💬', label: 'WhatsApp', value: '+1 (888) KON-BIT', href: '#' },
    { icon: '𝕏', label: 'Twitter', value: '@konbit_io', href: 'https://twitter.com/konbit_io' },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4">Contact Us</h1>
            <p className="text-gray-400 text-lg">We'd love to hear from you. Reach out anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Options */}
            <div className="space-y-4">
              {contactOptions.map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-xl hover:border-green-500/30 transition"
                >
                  <div className="text-3xl">{c.icon}</div>
                  <div>
                    <div className="text-gray-400 text-sm">{c.label}</div>
                    <div className="text-white font-medium">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              {sent ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50 transition"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50 transition"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Subject</label>
                    <select
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50 transition"
                    >
                      <option value="">Select a topic</option>
                      <option value="invest">Investment Inquiry</option>
                      <option value="learn">Learning Platform</option>
                      <option value="partner">Partnership</option>
                      <option value="press">Press/Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50 transition"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-black transition-all"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}