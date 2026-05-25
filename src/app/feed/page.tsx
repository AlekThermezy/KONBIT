'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import SlideSidebar from '@/components/layout/SlideSidebar'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

type FeedItem = {
  id: string
  type: 'deal' | 'course_complete' | 'campaign_update' | 'new_campaign' | 'story' | 'referral'
  data: any
  created_at: string
}

const SAMPLE_STORIES = [
  { id: 's1', business: 'M kayisans', episode: 3, title: 'From kitchen to 500 orders/week', teaser: 'How a home cook scaled into Haiti\'s fastest-growing sauce brand', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop' },
  { id: 's2', business: 'Haiti Thread Co.', episode: 1, title: 'Weaving a new future', teaser: 'Traditional artistry meets modern demand — follow our first 90 days', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop' },
  { id: 's3', business: 'Bassins Potagers', episode: 7, title: 'Growing through the drought', teaser: 'How we adapted irrigation to survive Haiti\'s dry season', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480c13?w=600&h=400&fit=crop' },
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

export default function FeedPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [filter, setFilter] = useState<'all' | 'deals' | 'courses' | 'stories'>('all')

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (user) loadFeed()
  }, [user, filter])

  async function loadFeed() {
    const items: FeedItem[] = []

    if (filter === 'all' || filter === 'deals') {
      // Live campaigns
      const { data: campaigns } = await supabase
        .from('product_campaigns')
        .select('*')
        .in('status', ['live', 'funded'])
        .order('created_at', { ascending: false })
        .limit(5)
      if (campaigns) {
        campaigns.forEach((c: any) => {
          items.push({
            id: `deal-${c.id}`,
            type: 'new_campaign',
            data: c,
            created_at: c.created_at,
          })
        })
      }

      // Recent backings (deals being backed)
      const { data: backings } = await supabase
        .from('campaign_backings')
        .select('*, product_campaigns(*), users(name)')
        .order('created_at', { ascending: false })
        .limit(5)
      if (backings) {
        backings.forEach((b: any) => {
          items.push({
            id: `backing-${b.id}`,
            type: 'deal',
            data: b,
            created_at: b.created_at,
          })
        })
      }
    }

    if (filter === 'all' || filter === 'courses') {
      // Course completions
      const { data: completions } = await supabase
        .from('enrollments')
        .select('*, courses(title, thumbnail_url), users(name)')
        .gt('progress_percent', 0)
        .order('updated_at', { ascending: false })
        .limit(5)
      if (completions) {
        completions.forEach((e: any) => {
          items.push({
            id: `course-${e.id}`,
            type: 'course_complete',
            data: e,
            created_at: e.updated_at,
          })
        })
      }
    }

    if (filter === 'all' || filter === 'stories') {
      // Campaign updates
      const { data: updates } = await supabase
        .from('campaign_updates')
        .select('*, product_campaigns(business_name, product_name)')
        .order('created_at', { ascending: false })
        .limit(5)
      if (updates) {
        updates.forEach((u: any) => {
          items.push({
            id: `update-${u.id}`,
            type: 'campaign_update',
            data: u,
            created_at: u.created_at,
          })
        })
      }
    }

    // Sort by date
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    setFeed(items.slice(0, 20))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Feed</h1>
            <p className="text-gray-400 text-sm mt-1">What's happening across KONBIT</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {(['all', 'deals', 'courses', 'stories'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {f === 'all' ? 'All' : f === 'deals' ? 'Deals' : f === 'courses' ? 'Courses' : 'Stories'}
              </button>
            ))}
          </div>

          {/* Stories Section */}
          {filter === 'all' && (
            <div className="mb-6">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {SAMPLE_STORIES.map((story) => (
                  <Link
                    key={story.id}
                    href={`/stories/${story.id}`}
                    className="flex-shrink-0 w-28 group"
                  >
                    <div className="relative w-28 h-36 rounded-xl overflow-hidden mb-2">
                      <img
                        src={story.image}
                        alt={story.business}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-xs text-green-400 mb-0.5">EP {story.episode}</div>
                        <div className="text-white text-xs font-medium leading-tight">{story.business}</div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs leading-tight line-clamp-2 group-hover:text-white transition">{story.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Feed Items */}
          <div className="space-y-4">
            {feed.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="text-3xl mb-3">📭</div>
                <div className="text-white font-medium mb-2">Feed is quiet</div>
                <div className="text-gray-400 text-sm">
                  {filter === 'all'
                    ? 'Be the first to back a campaign or complete a course'
                    : `No ${filter} activity yet — check back soon`}
                </div>
              </div>
            ) : (
              feed.map((item) => (
                <FeedCard key={item.id} item={item} />
              ))
            )}
          </div>
        </div>
      </main>

      <SlideSidebar />
    </div>
  )
}

function FeedCard({ item }: { item: FeedItem }) {
  const [imgError, setImgError] = useState(false)

  if (item.type === 'new_campaign') {
    const c = item.data
    const progress = c.quantity_available > 0 ? ((c.quantity_sold || 0) / c.quantity_available) * 100 : 0
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded font-medium">LIVE</span>
              <span className="text-gray-500 text-xs">{timeAgo(item.created_at)}</span>
            </div>
            <div className="text-white font-medium">{c.product_name}</div>
            <div className="text-gray-400 text-sm">{c.business_name} · {c.business_sector}</div>
          </div>
        </div>

        {c.product_description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{c.product_description}</p>
        )}

        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{c.quantity_sold || 0} / {c.quantity_available} claimed</span>
            <span className="text-green-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
          </div>
        </div>

        <Link
          href={`/deals/${c.id}`}
          className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white text-sm font-medium transition"
        >
          Back this Campaign →
        </Link>
      </div>
    )
  }

  if (item.type === 'deal') {
    const b = item.data
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">💰</span>
          <div>
            <div className="text-white text-sm font-medium">
              {b.users?.name || 'Someone'} backed a campaign
            </div>
            <div className="text-gray-500 text-xs">{timeAgo(item.created_at)}</div>
          </div>
        </div>
        <Link
          href={`/deals/${b.campaign_id}`}
          className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition"
        >
          <div className="text-white font-medium text-sm">
            {b.product_campaigns?.product_name}
          </div>
          <div className="text-gray-400 text-xs">
            {b.product_campaigns?.business_name}
          </div>
          <div className="text-green-500 font-bold text-sm mt-2">
            ${Number(b.total_price).toFixed(2)}
          </div>
        </Link>
      </div>
    )
  }

  if (item.type === 'course_complete') {
    const e = item.data
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {(e.users?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-white text-sm font-medium">
              {e.users?.name || 'Someone'} completed a course
            </div>
            <div className="text-gray-500 text-xs">{timeAgo(item.created_at)}</div>
          </div>
        </div>
        <Link
          href={`/learn/courses/${e.course_id}`}
          className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition"
        >
          <div className="text-white font-medium text-sm flex items-center gap-2">
            🎓 {e.courses?.title}
          </div>
          <div className="text-gray-400 text-xs mt-1">100% complete</div>
        </Link>
      </div>
    )
  }

  if (item.type === 'campaign_update') {
    const u = item.data
    const typeColors: Record<string, string> = {
      milestone: 'text-green-400',
      shipping: 'text-blue-400',
      delay: 'text-amber-400',
      complete: 'text-purple-400',
    }
    const typeLabels: Record<string, string> = {
      milestone: '🎯 Milestone',
      shipping: '📦 Shipping',
      delay: '⚠️ Update',
      complete: '✅ Complete',
    }
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition">
        <div className="text-gray-500 text-xs mb-2">{timeAgo(item.created_at)}</div>
        <div className="text-white text-sm font-medium mb-1">
          {u.product_campaigns?.business_name}
        </div>
        <div className={`text-xs font-medium mb-2 ${typeColors[u.update_type] || 'text-gray-400'}`}>
          {typeLabels[u.update_type] || u.update_type}
        </div>
        <div className="text-white font-medium text-sm mb-1">{u.title}</div>
        <p className="text-gray-400 text-sm">{u.content}</p>
      </div>
    )
  }

  return null
}