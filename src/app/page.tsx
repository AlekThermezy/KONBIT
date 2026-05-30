'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/auth'
import { User } from '@supabase/supabase-js'
import dynamic from 'next/dynamic'
import Footer from '@/components/layout/Footer'

const HaitiGlobe = dynamic(() => import('@/components/globe/HaitiGlobeWrapper'), { ssr: false })

// ── Animated counter ──────────────────────────────────────────────────
function Counter({ end, prefix = '', suffix = '', duration = 2000 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(eased * end))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// ── Floating badge ────────────────────────────────────────────────────
function Badge({ children, glow = 'green' }: { children: React.ReactNode; glow?: 'green' | 'gold' | 'blue' }) {
  const colors = {
    green: 'bg-green-950/60 border-green-500/30 text-green-400',
    gold: 'bg-amber-950/60 border-amber-500/30 text-amber-400',
    blue: 'bg-blue-950/60 border-blue-500/30 text-blue-400',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider backdrop-blur-sm ${colors[glow]}`}>
      {children}
    </span>
  )
}

// ── Glassmorphic card ─────────────────────────────────────────────────
function GlassCard({ children, className = '', hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`
      relative rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#141f16] backdrop-blur-sm
      ${hover ? 'hover:bg-[#1a2b1d] hover:border-green-500/40 transition-all duration-500 group' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

// ── Star field (CSS-only, no canvas) ─────────────────────────────────
function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: `${Math.random() * 2 + 0.5}px`,
            height: `${Math.random() * 2 + 0.5}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
            animation: `twinkle ${Math.random() * 4 + 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  )
}

// ── Diaspora Arc Label ────────────────────────────────────────────────
const DIASPORA_CITIES = [
  { name: 'Miami', pop: '350K+', flag: '🇺🇸' },
  { name: 'New York', pop: '800K+', flag: '🇺🇸' },
  { name: 'Montréal', pop: '120K+', flag: '🇨🇦' },
  { name: 'Paris', pop: '100K+', flag: '🇫🇷' },
  { name: 'Boston', pop: '95K+', flag: '🇺🇸' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<'growth' | 'learn'>('growth')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [cityIdx, setCityIdx] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, _s) => {
      supabase.auth.getUser().then(({ data }) => setUser(data.user))
    })
    const timer = setInterval(() => setCityIdx(i => (i + 1) % DIASPORA_CITIES.length), 2500)
    return () => { subscription.unsubscribe(); clearInterval(timer) }
  }, [])

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, name, interests: [activeTab], source: 'landing_page', newsletter: true }),
      })
      if (res.ok) setSubmitted(true)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const city = DIASPORA_CITIES[cityIdx]

  return (
    <div className="min-h-screen bg-[#080f0a] text-white overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: '100vh', minHeight: '700px' }}>
        <StarField />

        {/* Ambient bg glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <div style={{
            position: 'absolute', top: '-10%', left: '30%',
            width: '900px', height: '600px',
            background: 'radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 65%)',
            filter: 'blur(80px)',
          }} />
        </div>

        {/* ── GLOBE: full right half, vertically centered ── */}
        <div className="absolute pointer-events-auto" style={{
          zIndex: 2,
          right: '-8%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'min(68vw, 860px)',
          aspectRatio: '1/1',
        }}>
          <HaitiGlobe />
        </div>

        {/* Left-to-center gradient — lets globe bleed through but text stays readable */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 3,
          background: 'linear-gradient(100deg, #080f0a 28%, rgba(8,15,10,0.80) 48%, rgba(8,15,10,0.18) 68%, transparent 84%)',
        }} />
        {/* Bottom fade */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 3,
          background: 'linear-gradient(to top, #080f0a 0%, transparent 28%)',
        }} />

        {/* ── NAVBAR ── */}
        <nav className="absolute top-0 left-0 right-0 px-6 pt-5" style={{ zIndex: 20 }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-2xl font-black tracking-tight select-none">
              <span style={{ color: '#22c55e', textShadow: '0 0 20px rgba(34,197,94,0.4)' }}>KON</span>
              <span className="text-white">BIT</span>
            </div>
            <div className="hidden md:flex items-center gap-7">
              <a href="#growth" className="text-sm text-white/50 hover:text-white transition-colors font-medium">Growth</a>
              <a href="#learn"  className="text-sm text-white/50 hover:text-white transition-colors font-medium">Learn</a>
              <a href="/about"  className="text-sm text-white/50 hover:text-white transition-colors font-medium">About</a>
            </div>
            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <Link href="/signin"
                    className="px-4 py-2 text-sm font-medium text-white/55 hover:text-white border border-white/12 hover:border-white/25 rounded-lg transition-all">
                    Sign In
                  </Link>
                  <Link href="/waitlist"
                    className="px-5 py-2 text-sm font-bold rounded-lg text-black transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 20px rgba(34,197,94,0.35)' }}>
                    Join Waitlist
                  </Link>
                </>
              ) : (
                <Link href="/dashboard"
                  className="px-5 py-2 text-sm font-bold rounded-lg text-black transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 20px rgba(34,197,94,0.35)' }}>
                  Dashboard →
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* ── HERO COPY — left column ── */}
        <div className="absolute inset-0 flex items-center" style={{ zIndex: 10 }}>
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div style={{ maxWidth: 520 }}>

              {/* Live badge + diaspora ticker */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Badge glow="green">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live Globe
                </Badge>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm text-xs">
                  <span style={{ lineHeight: 1 }}>{city.flag}</span>
                  <span className="font-semibold text-white/75">{city.name}</span>
                  <span className="text-white/40">{city.pop} diaspora</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="font-black leading-[1.02] tracking-tight mb-5"
                style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4.2rem)' }}>
                <span className="text-white">Invest in Haiti.</span><br />
                <span style={{
                  background: 'linear-gradient(125deg, #22c55e 0%, #4ade80 40%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Build Wealth.<br />Build Home.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-white/50 leading-relaxed mb-8"
                style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)', maxWidth: 420 }}>
                The diaspora-to-homeland investment platform. Every arc on that globe is a real connection — every city, a community ready to invest in Haiti&apos;s future.
              </p>

              {/* Platform tabs */}
              <div className="inline-flex rounded-full p-1 mb-5 border border-white/10"
                style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
                {(['growth', 'learn'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="px-6 py-2.5 rounded-full text-sm font-bold transition-all capitalize"
                    style={activeTab === tab ? {
                      background: tab === 'growth'
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: '#000',
                      boxShadow: tab === 'growth'
                        ? '0 0 18px rgba(34,197,94,0.45)'
                        : '0 0 18px rgba(59,130,246,0.45)',
                    } : { color: 'rgba(255,255,255,0.45)' }}>
                    KONBIT {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Waitlist form */}
              {!user && !submitted && (
                <form onSubmit={handleWaitlist} className="flex flex-col gap-2.5" style={{ maxWidth: 360 }}>
                  <input type="text" placeholder="Your name" value={name}
                    onChange={e => setName(e.target.value)} required
                    className="px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none border transition-all"
                    style={{ background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
                    onFocus={e => { e.target.style.borderColor='#22c55e'; e.target.style.boxShadow='0 0 0 3px rgba(34,197,94,0.12)' }}
                    onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }} />
                  <input type="email" placeholder="Your email" value={email}
                    onChange={e => setEmail(e.target.value)} required
                    className="px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none border transition-all"
                    style={{ background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
                    onFocus={e => { e.target.style.borderColor='#22c55e'; e.target.style.boxShadow='0 0 0 3px rgba(34,197,94,0.12)' }}
                    onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }} />
                  <button type="submit" disabled={loading}
                    className="py-3.5 rounded-xl font-bold text-sm text-black transition-all disabled:opacity-50 hover:scale-[1.02]"
                    style={{
                      background: activeTab === 'growth'
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      boxShadow: activeTab === 'growth'
                        ? '0 0 28px rgba(34,197,94,0.4)'
                        : '0 0 28px rgba(59,130,246,0.4)',
                    }}>
                    {loading ? 'Joining...' : `Join the ${activeTab === 'growth' ? 'Growth' : 'Learn'} Waitlist`}
                  </button>
                </form>
              )}

              {submitted && (
                <div className="flex items-center gap-3 px-5 py-4 rounded-xl border border-green-500/25 bg-green-950/30 backdrop-blur-sm">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-bold text-green-400 text-sm">You&apos;re on the list!</p>
                    <p className="text-white/55 text-xs mt-0.5">We&apos;ll notify you at launch.</p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-7 mt-8">
                {[
                  { val: <Counter end={12} prefix="$" suffix="M+" />, label: 'Capital Raised', color: '#22c55e', glow: 'rgba(34,197,94,0.5)' },
                  { val: <Counter end={2847} />,                      label: 'Investors',      color: '#ffffff', glow: 'none' },
                  { val: <Counter end={23} />,                        label: 'Funded',         color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl font-black font-mono" style={{ color: s.color, textShadow: `0 0 16px ${s.glow}` }}>{s.val}</div>
                    <div className="text-white/30 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5">
          <div className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5">
            <div className="w-0.5 h-2 rounded-full bg-white/35" style={{ animation: 'scrollDot 2s ease-in-out infinite' }} />
          </div>
          <span className="text-white/20 text-[10px] tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* ── WHY KONBIT ──────────────────────────────────────────────── */}
      <section className="py-28 px-6" style={{ background: 'linear-gradient(180deg, #080f0a 0%, #0a1410 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge glow="green" >Why KONBIT</Badge>
            <h2 className="text-4xl md:text-5xl font-black mt-5 mb-4 leading-tight">
              The Platform <span style={{ color: '#22c55e' }}>Built for<br />Diaspora Investors</span>
            </h2>
            <p className="text-white/65 max-w-xl mx-auto leading-relaxed">
              No other platform connects the diaspora directly to Haitian economic development with verified impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🌍', title: 'Diaspora-to-Homeland Bridge', desc: 'Built specifically for the diaspora\'s unique position as both investors and stakeholders in Haiti\'s future.' },
              { icon: '📖', title: 'Cultural Narrative', desc: 'We showcase opportunity, heritage, and the vibrant businesses being built — not crisis optics.' },
              { icon: '🎯', title: 'Geographic Deep Focus', desc: 'KONBIT goes deep on Haiti — local markets, regulations, and opportunities no generalist platform understands.' },
              { icon: '📈', title: 'Financial + Social Returns', desc: 'Pre-fab rewards model: invest at 25-40% below retail. Your capital builds real businesses and real communities.' },
              { icon: '🔐', title: 'Trust & Transparency', desc: 'Every investment on-chain. Every distribution automatic via smart contracts. Fully verifiable, always.' },
              { icon: '🤝', title: 'Built with Haitian Expertise', desc: 'Advisor-backed by diaspora economists, entrepreneurs, and community leaders who know both sides of the bridge.' },
            ].map((item) => (
              <GlassCard key={item.title} className="p-8">
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3 className="font-black text-lg mb-3 text-white group-hover:text-green-400 transition-colors">{item.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{item.desc}</p>
                {/* Corner accent on hover */}
                <div className="absolute bottom-0 right-0 w-12 h-12 rounded-br-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-br-xl" style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(34,197,94,0.15) 50%)' }} />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST LAYER ─────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#0a1410', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge glow="gold">🇭🇹 Trusted by the Diaspora</Badge>
            <h2 className="text-4xl md:text-5xl font-black mt-5 mb-4">
              Built with <span style={{ color: '#22c55e' }}>Haitian Expertise</span>
            </h2>
            <p className="text-white/65 max-w-xl mx-auto">
              KONBIT is advisor-backed by Haitian diaspora leaders, community organizers, and economic development professionals.
            </p>
          </div>

          {/* Partner logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { name: 'Haitian American Caucus', desc: 'Economic Development', initial: 'HAC' },
              { name: 'HPA Network', desc: 'Professional Diaspora', initial: 'HPA' },
              { name: 'Haitian Bridge Alliance', desc: 'Advocacy & Community', initial: 'HBA' },
              { name: 'Konbit Santé', desc: 'Healthcare Investment', initial: 'KS' },
            ].map((p) => (
              <GlassCard key={p.name} className="p-6 flex flex-col items-center text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg mb-3 group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #166534, #15803d)', boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}
                >
                  {p.initial}
                </div>
                <p className="font-bold text-white text-sm">{p.name}</p>
                <p className="text-white/55 text-xs mt-1">{p.desc}</p>
              </GlassCard>
            ))}
          </div>

          {/* Three pillars */}
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              { icon: '⚖️', title: 'Regulated Infrastructure', desc: 'SEC-compliant, blockchain-verified smart contracts, transparent on-chain distributions.' },
              { icon: '🏛️', title: 'Haitian Advisory Council', desc: 'Diaspora economists, entrepreneurs, and community leaders guiding every investment decision.' },
              { icon: '📊', title: 'Verified Impact Metrics', desc: 'Every campaign tracks jobs created, capital deployed, and community impact — not just returns.' },
            ].map((p) => (
              <GlassCard key={p.title} className="p-8 text-center">
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="font-black text-lg mb-2">{p.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{p.desc}</p>
              </GlassCard>
            ))}
          </div>

          {/* Press */}
          <div className="text-center mb-14">
            <p className="text-white/25 text-xs uppercase tracking-[0.2em] mb-8">Featured In</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
              {['Haiti Libre', 'The Haitian Times', 'Miami Herald', 'Le Nouvelliste', 'PRI'].map(pub => (
                <span key={pub} className="text-white/25 font-medium hover:text-white/50 transition-colors cursor-default">{pub}</span>
              ))}
            </div>
          </div>

          {/* Partnership CTA */}
          <div className="rounded-2xl p-8 text-center border border-green-500/20" style={{ background: 'linear-gradient(135deg, rgba(22,101,52,0.25), rgba(20,83,45,0.1))' }}>
            <h3 className="text-2xl font-black mb-2">Are you a Haitian diaspora organization?</h3>
            <p className="text-white/65 mb-6">Partner with KONBIT to bring exclusive investment opportunities to your community.</p>
            <a
              href="mailto:partnerships@konbit.io"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 30px rgba(34,197,94,0.25)' }}
            >
              Request Partnership →
            </a>
          </div>
        </div>
      </section>

      {/* ── GROWTH SECTION ──────────────────────────────────────────── */}
      <section id="growth" className="py-28 px-6" style={{ background: 'linear-gradient(180deg, #0a1410 0%, #0f1a12 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge glow="green">KONBIT Growth</Badge>
            <h2 className="text-4xl md:text-5xl font-black mt-5 mb-4">
              Invest in <span style={{ color: '#22c55e' }}>Business Growth</span>
            </h2>
            <p className="text-white/65 max-w-xl mx-auto">
              From vacation rentals to recording studios — pre-order real Haitian products at 25–40% below retail while funding the businesses that make them.
            </p>
          </div>

          {/* Sector grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {[
              { title: 'Real Estate', desc: 'Vacation rentals, apartments, commercial spaces', icon: '🏠', color: '#22c55e' },
              { title: 'Music', desc: 'Studios, venues, streaming, Rara productions', icon: '🎵', color: '#f59e0b' },
              { title: 'Art', desc: 'Galleries, exhibitions, artist collectives', icon: '🎨', color: '#3b82f6' },
              { title: 'Food', desc: 'Restaurants, artisanal products, coffee exports', icon: '🍳', color: '#ef4444' },
            ].map((s) => (
              <GlassCard key={s.title} className="p-6">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-black text-base mb-2" style={{ color: s.color }}>{s.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{s.desc}</p>
                <div className="mt-5 pt-4 border-t border-white/5">
                  <Link href="/deals" className="text-xs font-bold text-white/30 group-hover:text-white/60 transition-colors flex items-center gap-1">
                    Browse campaigns
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="group-hover:translate-x-0.5 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* How it works */}
          <GlassCard hover={false} className="p-10">
            <h3 className="text-2xl font-black text-center mb-10">How KONBIT Growth Works</h3>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(34,197,94,0.3), transparent)' }} />
              {[
                { n: 1, title: 'Browse Businesses', desc: 'Explore Haitian businesses seeking capital across all 12 sectors.' },
                { n: 2, title: 'Pre-Order at a Discount', desc: 'Back campaigns and receive real products at 25–40% below retail price.' },
                { n: 3, title: 'Earn & Track Impact', desc: 'Receive products on delivery. Track every business you\'ve helped build.' },
              ].map((step) => (
                <div key={step.n} className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-5 relative z-10"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 24px rgba(34,197,94,0.35)', color: '#000' }}
                  >
                    {step.n}
                  </div>
                  <h4 className="font-black mb-2">{step.title}</h4>
                  <p className="text-white/65 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── LEARN SECTION ───────────────────────────────────────────── */}
      <section id="learn" className="py-28 px-6" style={{ background: 'linear-gradient(180deg, #0f1a12 0%, #0a0f18 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge glow="blue">KONBIT Learn</Badge>
            <h2 className="text-4xl md:text-5xl font-black mt-5 mb-4">
              Learn from <span style={{ color: '#60a5fa' }}>Haitian Experts</span>
            </h2>
            <p className="text-white/65 max-w-xl mx-auto">
              Courses taught by professionals from Haiti and the diaspora. Smart learning features that actually help you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[
              { title: 'AI Flashcards', desc: 'Auto-generated spaced repetition for maximum retention', icon: '🧠' },
              { title: 'Smart Resume', desc: 'Pick up exactly where you left off — never lose your place', icon: '▶️' },
              { title: 'Certificates', desc: 'LinkedIn-verified credentials that prove your skills', icon: '🏆' },
              { title: 'Study Streaks', desc: 'Build habits, earn badges, stay motivated daily', icon: '🔥' },
              { title: 'Gift & Track', desc: 'Sponsor someone\'s education and watch their progress', icon: '🎁' },
              { title: 'Learning Paths', desc: 'Multi-course journeys designed for specific careers', icon: '🗺️' },
            ].map((f) => (
              <GlassCard key={f.title} className="p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-black mb-2">{f.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{f.desc}</p>
              </GlassCard>
            ))}
          </div>

          {/* Gift model highlight */}
          <div className="rounded-2xl p-10 text-center border border-blue-500/20" style={{ background: 'linear-gradient(135deg, rgba(30,58,138,0.2), rgba(22,101,52,0.15))' }}>
            <div className="text-5xl mb-5">🎁</div>
            <h3 className="text-2xl font-black mb-3">Gift Knowledge</h3>
            <p className="text-white/65 max-w-xl mx-auto mb-8 leading-relaxed">
              Sponsor someone in Haiti — or anywhere in the world — to take a course. They learn, you track their progress, and the community grows stronger together.
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 0 30px rgba(59,130,246,0.25)' }}
            >
              Explore Courses →
            </Link>
          </div>
        </div>
      </section>

      {/* ── GLOBAL SECTION ──────────────────────────────────────────── */}
      <section className="py-28 px-6" style={{ background: '#080f0a' }}>
        <div className="max-w-4xl mx-auto text-center">
          <Badge glow="gold">All Nations, All People</Badge>
          <h2 className="text-4xl md:text-5xl font-black mt-5 mb-6 leading-tight">
            Built for <span style={{ color: '#22c55e' }}>Every Haitian,<br />Everywhere</span>
          </h2>
          <p className="text-white/65 text-lg mb-14 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re in Miami, Montréal, Paris, or Port-au-Prince — you&apos;re welcome here. KONBIT connects the global diaspora with Haiti&apos;s future.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-14">
            {[
              { icon: '🌐', title: 'Global', desc: 'Haitians in 140+ countries can participate' },
              { icon: '⛓️', title: 'On-Chain', desc: 'Transparent, verifiable transactions on Polygon' },
              { icon: '🧠', title: 'Smart', desc: 'AI-powered learning that actually works' },
            ].map((item) => (
              <GlassCard key={item.title} className="p-8 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="font-black mb-2">{item.title}</h4>
                <p className="text-white/65 text-sm">{item.desc}</p>
              </GlassCard>
            ))}
          </div>

          {/* Final CTA */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/waitlist"
              className="px-10 py-4 rounded-xl font-black text-black transition-all hover:scale-105 text-base"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 40px rgba(34,197,94,0.3)' }}
            >
              Join the Waitlist
            </Link>
            <Link
              href="/about"
              className="px-10 py-4 rounded-xl font-bold text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-all text-base"
            >
              Learn More
            </Link>
          </div>

          {/* Slogan */}
          <p className="mt-10 text-white/20 text-sm italic">
            Konekte. Tèt ansanm. Pou nou vanse.
          </p>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(8px); opacity: 0.2; }
          100% { transform: translateY(0); opacity: 0.6; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
