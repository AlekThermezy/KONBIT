'use client'

/**
 * REDESIGNED FEED — Benchmarking Analysis
 * =========================================
 * LinkedIn: Filter tabs (All/Posts/Articles), Stories carousel, post input box,
 *           engagement (like/comment/share), "People you may know" sidebar
 * Twitter/X: Two tabs (For You / Following), real-time indicators, trending sidebar,
 *            emoji reactions inline, quote-tweet sharing
 * Discord:  Server list → channel list → message feed, unread indicators,
 *            emoji reactions, thread channels, collapsible categories
 * Telegram: Chat list sidebar, message bubbles, forwarded messages,
 *            reactions, unread badges, pinned messages
 *
 * KEY PRINCIPLES for KONBIT feed:
 * - ONE place for all activity (deals, courses, inspections, investments)
 * - Filter tabs: All / Growth / Learn / Inspect / My Activity
 * - Quick action cards (back a campaign, continue course, view report)
 * - Notification-style updates with action buttons
 * - Stories-style business highlights
 * - "Your" content vs "Trending" content
 * - Time-sensitive alerts at top
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import LeftSidebar from '@/components/layout/LeftSidebar'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

type FeedItem = {
  id: string
  type: 'deal' | 'course_complete' | 'campaign_update' | 'new_campaign' | 'inspection_assigned' | 'verification_complete' | 'investment_return' | 'referral' | 'story'
  priority: 'high' | 'normal' | 'low'
  data: any
  created_at: string
}

type Tab = 'all' | 'growth' | 'learn' | 'inspect' | 'mine'

const SAMPLE_STORIES = [
  { id: 's1', business: 'M kayisans', episode: 3, title: 'From kitchen to 500 orders/week', teaser: 'How a home cook scaled into Haiti\'s fastest-growing sauce brand', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop' },
  { id: 's2', business: 'Haiti Thread Co.', episode: 1, title: 'Weaving a new future', teaser: 'Traditional artistry meets modern demand — follow our first 90 days', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop' },
  { id: 's3', business: 'Bassins Potagers', episode: 7, title: 'Growing through the drought', teaser: 'How we adapted irrigation to survive Haiti\'s dry season', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480c13?w=600&h=400&fit=crop' },
  { id: 's4', business: 'Haitian Brew Co.', episode: 2, title: 'From bean to export', teaser: 'Our journey to bringing Haitian coffee to international markets', image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&h=400&fit=crop' },
]

// Quick action cards — shown at top of feed for immediate engagement
const QUICK_ACTIONS = [
  { id: 'qa1', label: 'Explore Portfolio', desc: 'Invest in Haitian businesses', icon: '💰', href: '/deals', color: 'green' },
  { id: 'qa2', label: 'Continue Learning', desc: 'Pick up where you left off', icon: '🎓', href: '/learn', color: 'blue' },
  { id: 'qa3', label: 'Inspector Hub', desc: 'Check your assigned jobs', icon: '🔍', href: '/inspector', color: 'amber' },
  { id: 'qa4', label: 'View Portfolio', desc: 'Track your investments', icon: '📈', href: '/dashboard', color: 'purple' },
]

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function timeAgoShort(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

export default function FeedPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [tab, setTab] = useState<Tab>('all')
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (user) loadFeed()
  }, [user, tab])

  async function loadFeed() {
    const items: FeedItem[] = []

    if (tab === 'all' || tab === 'growth') {
      // Live campaigns
      const { data: campaigns } = await supabase
        .from('product_campaigns')
        .select('*')
        .in('status', ['live', 'funded'])
        .order('created_at', { ascending: false })
        .limit(5)
      if (campaigns) {
        campaigns.forEach((c: any) => {
          items.push({ id: `deal-${c.id}`, type: 'new_campaign', priority: 'normal', data: c, created_at: c.created_at })
        })
      }

      // Recent backings
      const { data: backings } = await supabase
        .from('campaign_backings')
        .select('*, product_campaigns(*), users(name)')
        .order('created_at', { ascending: false })
        .limit(5)
      if (backings) {
        backings.forEach((b: any) => {
          items.push({ id: `backing-${b.id}`, type: 'deal', priority: 'normal', data: b, created_at: b.created_at })
        })
      }

      // Campaign updates
      const { data: updates } = await supabase
        .from('campaign_updates')
        .select('*, product_campaigns(business_name, product_name)')
        .order('created_at', { ascending: false })
        .limit(5)
      if (updates) {
        updates.forEach((u: any) => {
          items.push({ id: `update-${u.id}`, type: 'campaign_update', priority: 'normal', data: u, created_at: u.created_at })
        })
      }
    }

    if (tab === 'all' || tab === 'learn') {
      // Course completions + progress
      const { data: completions } = await supabase
        .from('enrollments')
        .select('*, courses(title, thumbnail_url), users(name)')
        .gt('progress_percent', 0)
        .order('updated_at', { ascending: false })
        .limit(5)
      if (completions) {
        completions.forEach((e: any) => {
          const priority = e.progress_percent === 100 ? 'high' : 'normal'
          items.push({ id: `course-${e.id}`, type: 'course_complete', priority, data: e, created_at: e.updated_at })
        })
      }
    }

    if (tab === 'all' || tab === 'inspect') {
      // Inspector job assignments (placeholder — jobs table)
      const { data: jobs } = await supabase
        .from('inspector_jobs')
        .select('*, businesses(name), users(name)')
        .order('created_at', { ascending: false })
        .limit(3)
      if (jobs) {
        jobs.forEach((j: any) => {
          items.push({ id: `inspect-${j.id}`, type: 'inspection_assigned', priority: j.status === 'pending' ? 'high' : 'normal', data: j, created_at: j.created_at })
        })
      }
    }

    if (tab === 'all' || tab === 'mine') {
      // Investment returns (from user's own backing history)
      if (user) {
        const { data: myBackings } = await supabase
          .from('campaign_backings')
          .select('*, product_campaigns(*), users(name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)
        if (myBackings) {
          myBackings.forEach((b: any) => {
            items.push({ id: `mine-${b.id}`, type: 'investment_return', priority: 'normal', data: b, created_at: b.created_at })
          })
        }
      }
    }

    // Sort: high priority first, then by date
    items.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1
      if (b.priority === 'high' && a.priority !== 'high') return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    setFeed(items.slice(0, 25))
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '🔥' },
    { id: 'growth', label: 'Growth', icon: '📈' },
    { id: 'learn', label: 'Learn', icon: '🎓' },
    { id: 'inspect', label: 'Inspect', icon: '🔍' },
    { id: 'mine', label: 'My Activity', icon: '👤' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 text-xl animate-pulse">Loading your feed...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <LeftSidebar />
      <Navbar />

      <main className="ml-64 pt-16 pb-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">
              {user ? `Good to see you, ${user.name?.split(' ')[0] || 'there'} 👋` : 'Activity Feed'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">Track your investments, learning, and opportunities</p>
          </div>

          {/* Quick Actions — LinkedIn/Discord style shortcut bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {QUICK_ACTIONS.map((qa) => (
              <Link
                key={qa.id}
                href={qa.href}
                className="group bg-white/5 border border-white/10 rounded-xl p-3 hover:border-white/20 transition-all hover:-translate-y-0.5"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg mb-2 ${
                  qa.color === 'green' ? 'bg-green-900/40 text-green-400' :
                  qa.color === 'blue' ? 'bg-blue-900/40 text-blue-400' :
                  qa.color === 'amber' ? 'bg-amber-900/40 text-amber-400' :
                  'bg-purple-900/40 text-purple-400'
                }`}>
                  {qa.icon}
                </div>
                <div className="text-white text-xs font-semibold mb-0.5 group-hover:text-green-400 transition">{qa.label}</div>
                <div className="text-gray-500 text-xs">{qa.desc}</div>
              </Link>
            ))}
          </div>

          {/* Filter Tabs — LinkedIn/Twitter style */}
          <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 border border-white/10">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Stories Carousel — Instagram/LinkedIn style */}
          {tab === 'all' && (
            <div className="mb-6">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {SAMPLE_STORIES.map((story) => (
                  <Link
                    key={story.id}
                    href={`/stories/${story.id}`}
                    className="flex-shrink-0 w-28 group"
                  >
                    <div className="relative w-28 h-36 rounded-xl overflow-hidden mb-2 ring-2 ring-transparent group-hover:ring-green-500/50 transition">
                      <img
                        src={story.image}
                        alt={story.business}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute top-1.5 left-1.5">
                        <div className="bg-green-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded">EP {story.episode}</div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-white text-xs font-semibold leading-tight">{story.business}</div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs leading-tight line-clamp-2 group-hover:text-white transition">{story.title}</div>
                  </Link>
                ))}
                {/* See All */}
                <Link href="/stories" className="flex-shrink-0 w-28 group">
                  <div className="w-28 h-36 rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center mb-2 group-hover:border-white/40 transition">
                    <div className="text-2xl mb-1">+</div>
                    <div className="text-gray-400 text-xs">See All</div>
                  </div>
                  <div className="text-gray-500 text-xs text-center">Stories</div>
                </Link>
              </div>
            </div>
          )}

          {/* Feed Items */}
          <div className="space-y-3">
            {feed.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="text-3xl mb-3">📭</div>
                <div className="text-white font-semibold mb-2">Nothing here yet</div>
                <div className="text-gray-400 text-sm">
                  {tab === 'all' ? 'Back a campaign or complete a course to get started' :
                   tab === 'mine' ? 'Sign in to see your personal activity' :
                   `No ${tab} activity yet — check back soon`}
                </div>
                <Link href="/deals" className="inline-block mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white text-sm font-medium transition">
                  Explore Portfolio →
                </Link>
              </div>
            ) : (
              feed.map((item) => (
                <FeedCard key={item.id} item={item} user={user} />
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

function FeedCard({ item, user }: { item: FeedItem; user: any }) {
  const isOwn = item.type === 'investment_return'

  if (item.type === 'new_campaign') {
    const c = item.data
    const progress = c.quantity_available > 0 ? ((c.quantity_sold || 0) / c.quantity_available) * 100 : 0
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-green-500/30 transition-all">
        {/* Card header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Live</span>
              <span className="text-gray-500 text-xs">{timeAgo(item.created_at)}</span>
              <span className="text-gray-600 text-xs">·</span>
              <span className="text-gray-500 text-xs">{c.business_sector}</span>
            </div>
            <div className="text-white font-bold text-base">{c.product_name}</div>
            <div className="text-gray-400 text-sm">{c.business_name}</div>
          </div>
          {/* Quick stats */}
          <div className="text-right hidden sm:block">
            <div className="text-green-400 font-black text-lg">${c.current_price || c.target_amount || '—'}</div>
            <div className="text-gray-500 text-xs">{c.quantity_sold || 0} sold</div>
          </div>
        </div>

        {c.product_description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{c.product_description}</p>
        )}

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{c.quantity_sold || 0} / {c.quantity_available || '—'} claimed</span>
            <span className="text-green-400 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2">
          <Link href={`/deals/${c.id}`} className="flex-1 text-center px-4 py-2.5 bg-green-600 hover:bg-green-700 rounded-xl text-white text-sm font-bold transition">
            Invest in this Campaign →
          </Link>
          <button className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition">
            <span>🔖</span>
          </button>
        </div>
      </div>
    )
  }

  if (item.type === 'deal') {
    const b = item.data
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-sm font-bold">
            {(b.users?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-semibold">{b.users?.name || 'Someone'} backed a campaign</div>
            <div className="text-gray-500 text-xs flex items-center gap-1">
              <span>{timeAgo(item.created_at)}</span>
              <span>·</span>
              <span className="text-green-400 font-medium">{b.quantity || 1} unit{b.quantity !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="text-green-400 font-black text-lg">${Number(b.total_price || 0).toFixed(0)}</div>
        </div>
        <Link href={`/deals/${b.campaign_id}`} className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
          <div className="text-white font-semibold text-sm">{b.product_campaigns?.product_name}</div>
          <div className="text-gray-400 text-xs mt-0.5">{b.product_campaigns?.business_name} · {b.product_campaigns?.business_sector}</div>
        </Link>
      </div>
    )
  }

  if (item.type === 'course_complete') {
    const e = item.data
    const isComplete = e.progress_percent === 100
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-blue-500/30 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
            {(e.users?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-semibold flex items-center gap-1.5">
              {isComplete ? '🎓' : '📖'} {e.users?.name || 'Someone'} {isComplete ? 'completed' : 'is learning'}
            </div>
            <div className="text-gray-500 text-xs">{timeAgo(item.created_at)}</div>
          </div>
          {isComplete && (
            <span className="bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs px-2 py-1 rounded-full font-bold">DONE</span>
          )}
        </div>
        <Link href={`/learn/courses/${e.course_id}`} className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
          <div className="text-white font-semibold text-sm">{e.courses?.title}</div>
          {!isComplete && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{e.progress_percent || 0}% complete</span>
                <Link href={`/learn/courses/${e.course_id}`} className="text-green-400 hover:text-green-300 font-medium">Continue →</Link>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${e.progress_percent || 0}%` }} />
              </div>
            </div>
          )}
        </Link>
      </div>
    )
  }

  if (item.type === 'campaign_update') {
    const u = item.data
    const typeConfig: Record<string, { color: string; bg: string; icon: string }> = {
      milestone: { color: 'text-green-400', bg: 'bg-green-900/30', icon: '🎯' },
      shipping: { color: 'text-blue-400', bg: 'bg-blue-900/30', icon: '📦' },
      delay: { color: 'text-amber-400', bg: 'bg-amber-900/30', icon: '⚠️' },
      complete: { color: 'text-purple-400', bg: 'bg-purple-900/30', icon: '✅' },
    }
    const config = typeConfig[u.update_type] || { color: 'text-gray-400', bg: 'bg-white/5', icon: '📢' }
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all">
        <div className="flex items-start gap-3 mb-2">
          <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center text-sm flex-shrink-0`}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-semibold text-sm">{u.product_campaigns?.business_name}</span>
              <span className="text-gray-600 text-xs">·</span>
              <span className="text-gray-500 text-xs">{timeAgo(item.created_at)}</span>
            </div>
            <div className={`inline-flex items-center gap-1 text-xs font-medium ${config.color}`}>
              <span>{u.update_type?.charAt(0).toUpperCase() + u.update_type?.slice(1)}</span>
            </div>
          </div>
        </div>
        <div className="text-white font-semibold text-sm mb-1 ml-11">{u.title}</div>
        <p className="text-gray-400 text-sm ml-11 line-clamp-2">{u.content}</p>
        {u.product_campaigns && (
          <Link href={`/deals/${u.product_campaigns.id}`} className="inline-flex items-center gap-1 text-green-400 text-xs font-medium mt-2 ml-11 hover:text-green-300">
            View campaign →
          </Link>
        )}
      </div>
    )
  }

  if (item.type === 'inspection_assigned') {
    const j = item.data
    const statusColors: Record<string, string> = {
      pending: 'bg-amber-900/30 border-amber-500/30 text-amber-400',
      in_progress: 'bg-blue-900/30 border-blue-500/30 text-blue-400',
      completed: 'bg-green-900/30 border-green-500/30 text-green-400',
    }
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-amber-500/30 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white text-sm">
            🔍
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-semibold">New inspection assigned</div>
            <div className="text-gray-500 text-xs">{timeAgo(item.created_at)}</div>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-bold border ${statusColors[j.status] || statusColors.pending}`}>
            {j.status?.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <Link href={`/jobs`} className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
          <div className="text-white font-semibold text-sm">{j.businesses?.name || j.title || 'Inspection Job'}</div>
          <div className="text-gray-400 text-xs mt-0.5 flex items-center gap-2">
            <span>{j.location || 'Haiti'}</span>
            {j.due_date && <span>· Due {j.due_date}</span>}
          </div>
        </Link>
        <div className="flex gap-2 mt-2 ml-0">
          <Link href={`/jobs`} className="flex-1 text-center px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-xl text-white text-xs font-bold transition">
            View Job →
          </Link>
        </div>
      </div>
    )
  }

  if (item.type === 'investment_return') {
    const b = item.data
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-purple-500/30 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white text-sm font-bold">
            💰
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-semibold">Your investment</div>
            <div className="text-gray-500 text-xs">{timeAgo(item.created_at)}</div>
          </div>
          <div className="text-green-400 font-black text-sm">+${Number(b.total_price || 0).toFixed(0)}</div>
        </div>
        <Link href={`/deals/${b.campaign_id}`} className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition">
          <div className="text-white font-semibold text-sm">{b.product_campaigns?.product_name}</div>
          <div className="text-gray-400 text-xs mt-0.5">{b.product_campaigns?.business_name}</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500">Track delivery</span>
            <span className="text-green-400 text-xs font-medium hover:text-green-300">View →</span>
          </div>
        </Link>
      </div>
    )
  }

  return null
}
