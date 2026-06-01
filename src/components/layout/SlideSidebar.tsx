'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

type Panel = 'main' | 'campaigns' | 'deals' | 'courses'

const CAMPAIGNS = [
  { label: '🏗️ Start New Campaign', href: '/dashboard/onboard' },
  { label: '📊 My Campaigns', href: '/dashboard' },
  { label: '📈 Performance', href: '/dashboard' },
  { label: '💳 Payouts', href: '/dashboard' },
  { label: '🎁 Rewards Tiers', href: '/growth' },
  { label: '📋 Campaign Guidelines', href: '/resources' },
]

const DEALS = [
  { label: '💰 Browse All Deals', href: '/deals' },
  { label: '🏆 Top Rated', href: '/deals?sort=rating' },
  { label: '🆕 New This Week', href: '/deals?sort=new' },
  { label: '🎯 Ending Soon', href: '/deals?sort=ending' },
  { label: '🌱 By Sector', href: '/deals' },
]

const COURSES = [
  { label: '🎓 My Courses', href: '/learn' },
  { label: '📚 Course Library', href: '/learn' },
  { label: '📝 Assessments', href: '/learn' },
  { label: '🏅 Certificates', href: '/learn' },
  { label: '📖 Vocabulary', href: '/dictionary' },
]

export default function SlideSidebar() {
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [panel, setPanel] = useState<Panel>('main')
  const [stats, setStats] = useState({ backings: 0, courses: 0, streak: 0 })

  useEffect(() => {
    getCurrentUser().then(async (u) => {
      if (!u) return
      setUser(u)

      const [{ count: backings }, { count: courses }] = await Promise.all([
        supabase.from('campaign_backings').select('*', { count: 'exact', head: true }).eq('user_id', u.id),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('user_id', u.id),
      ])

      setStats({ backings: backings || 0, courses: courses || 0, streak: 0 })
    })
  }, [])

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'
  const firstInitial = userName.charAt(0).toUpperCase()
  const router = useRouter()

  const handleSignOut = () => { signOut(); router.push('/') }

  const openPanel = (p: Panel) => { setPanel(p); setIsOpen(true) }
  const backToMain = () => setPanel('main')

  // Panel slide direction: main enters from right, sub-panels enter from right too,
  // but we track which direction the MAIN overlay is sliding
  const mainVisible = isOpen

  return (
    <>
      {/* ── Hamburger toggle — always visible top-right ── */}
      <button
        onClick={() => { setIsOpen(!isOpen); setPanel('main') }}
        className="fixed top-4 right-4 z-[60] w-12 h-12 rounded-xl bg-black/90 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:border-green-500/50 hover:bg-black transition-all duration-200 shadow-lg"
        aria-label="Toggle menu"
      >
        <div className="relative w-5 h-4 flex flex-col justify-between">
          <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block h-0.5 bg-white rounded-full transition-all duration-200 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
        </div>
      </button>

      {/* ── Backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm"
          onClick={() => { setIsOpen(false); setPanel('main') }}
        />
      )}

      {/* ── Sidebar shell ── */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-black/95 backdrop-blur-md border-l border-white/10 z-[60] transform transition-transform duration-300 ease-out overflow-hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full">
          {/* ── Main Panel ── */}
          <div
            className={`w-80 flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out ${
              panel === 'main'
                ? 'opacity-100 translate-x-0'
                : panel === 'campaigns' || panel === 'deals' || panel === 'courses'
                ? 'opacity-0 -translate-x-full'
                : 'opacity-100 translate-x-0'
            }`}
            style={{ minWidth: '20rem' }}
          >
            <div className="p-4">
              {/* Profile */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {firstInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm truncate">{userName}</div>
                  <Link href="/dashboard" className="text-green-500 text-xs hover:underline" onClick={() => setIsOpen(false)}>
                    View Profile →
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { v: stats.backings, l: 'Backings' },
                  { v: stats.courses, l: 'Courses' },
                  { v: stats.streak, l: '🔥 Streak' },
                ].map(({ v, l }) => (
                  <div key={l} className="text-center p-2 bg-white/5 rounded-lg">
                    <div className="text-white font-bold text-sm">{v}</div>
                    <div className="text-gray-500 text-xs">{l}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 mb-4" />

              {/* Quick Actions */}
              <div className="space-y-1 mb-4">
                {[
                  { icon: '📊', label: 'Campaigns', panel: 'campaigns' as Panel, badge: null },
                  { icon: '💰', label: 'Browse Deals', panel: 'deals' as Panel, badge: null },
                  { icon: '🎓', label: 'My Courses', panel: 'courses' as Panel, badge: null },
                  { icon: '🔗', label: 'Referrals', href: '/refer', badge: null },
                  { icon: '🔍', label: 'Inspector Hub', href: '/inspector', badge: null },
                ].map(item => (
                  item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-gray-300">{item.label}</span>
                      {item.badge && <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded text-gray-500">{item.badge}</span>}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => openPanel(item.panel!)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm text-left"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-gray-300 flex-1">{item.label}</span>
                      <span className="text-gray-600 text-xs">→</span>
                    </button>
                  )
                ))}
              </div>

              <div className="border-t border-white/10 mb-4" />

              {/* Messages & Notifications */}
              {[
                { icon: '💬', label: 'Messages', href: '/messages', badge: 0 },
                { icon: '🔔', label: 'Notifications', href: '/notifications', badge: 0, green: true },
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm mb-1"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-gray-300">{item.label}</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded ${item.green ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-500'}`}>{item.badge}</span>
                </Link>
              ))}

              <div className="border-t border-white/10 mb-4" />

              {/* Settings */}
              <div className="space-y-1">
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm" onClick={() => setIsOpen(false)}>
                  <span className="text-lg">⚙️</span>
                  <span className="text-gray-300">Settings</span>
                </Link>
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm text-left text-gray-400">
                  <span className="text-lg">🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Sub-Panels (stacked behind main, slide in from right) ── */}
          {/* Campaigns sub-panel */}
          <div
            className={`absolute inset-y-0 right-0 w-80 flex-shrink-0 overflow-y-auto bg-black/95 backdrop-blur-md border-l border-white/10 transition-all duration-300 ease-in-out ${
              panel === 'campaigns' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="p-4">
              <button onClick={backToMain} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-5 transition">
                <span>←</span> Back
              </button>
              <div className="text-green-500 font-bold text-base mb-4">📊 Campaigns</div>
              <div className="space-y-1">
                {CAMPAIGNS.map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-gray-400">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Deals sub-panel */}
          <div
            className={`absolute inset-y-0 right-0 w-80 flex-shrink-0 overflow-y-auto bg-black/95 backdrop-blur-md border-l border-white/10 transition-all duration-300 ease-in-out ${
              panel === 'deals' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="p-4">
              <button onClick={backToMain} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-5 transition">
                <span>←</span> Back
              </button>
              <div className="text-green-500 font-bold text-base mb-4">💰 Browse Deals</div>
              <div className="space-y-1">
                {DEALS.map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-gray-400">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Courses sub-panel */}
          <div
            className={`absolute inset-y-0 right-0 w-80 flex-shrink-0 overflow-y-auto bg-black/95 backdrop-blur-md border-l border-white/10 transition-all duration-300 ease-in-out ${
              panel === 'courses' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            <div className="p-4">
              <button onClick={backToMain} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-5 transition">
                <span>←</span> Back
              </button>
              <div className="text-green-500 font-bold text-base mb-4">🎓 My Courses</div>
              <div className="space-y-1">
                {COURSES.map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-gray-400">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}