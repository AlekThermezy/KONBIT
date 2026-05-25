'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function SlideSidebar() {
  const [user, setUser] = useState<any>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState({ backings: 0, courses: 0, streak: 0 })

  useEffect(() => {
    getCurrentUser().then(async (u) => {
      if (!u) return
      setUser(u)

      // Fetch user stats
      const { count: backings } = await supabase
        .from('campaign_backings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', u.id)

      const { count: courses } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', u.id)

      setStats({
        backings: backings || 0,
        courses: courses || 0,
        streak: 0,
      })
    })
  }, [])

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'
  const firstInitial = userName.charAt(0).toUpperCase()

  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push('/')
  }

  return (
    <>
      {/* Hover Zone — right edge trigger */}
      <div
        className="fixed right-0 top-0 h-screen w-12 z-50"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      />

      {/* Backdrop (closes on click) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-72 bg-black/95 backdrop-blur-md border-l border-white/10 z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="p-4">
          {/* Profile Mini Card */}
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {firstInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm truncate">{userName}</div>
              <Link
                href="/dashboard"
                className="text-green-500 text-xs hover:underline"
              >
                View Profile →
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-white font-bold text-sm">{stats.backings}</div>
              <div className="text-gray-500 text-xs">Backings</div>
            </div>
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-white font-bold text-sm">{stats.courses}</div>
              <div className="text-gray-500 text-xs">Courses</div>
            </div>
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-white font-bold text-sm">{stats.streak}</div>
              <div className="text-gray-500 text-xs">🔥 Streak</div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-4" />

          {/* Quick Actions */}
          <div className="space-y-1 mb-4">
            <Link
              href="/dashboard/onboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm"
            >
              <span className="text-lg">📊</span>
              <span className="text-gray-300">Start a Campaign</span>
            </Link>
            <Link
              href="/deals"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm"
            >
              <span className="text-lg">💰</span>
              <span className="text-gray-300">Browse Deals</span>
            </Link>
            <Link
              href="/learn"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm"
            >
              <span className="text-lg">🎓</span>
              <span className="text-gray-300">My Courses</span>
            </Link>
            <Link
              href="/refer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm"
            >
              <span className="text-lg">🔗</span>
              <span className="text-gray-300">My Referral Code</span>
            </Link>
            <Link
              href="/inspector"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm"
            >
              <span className="text-lg">🔍</span>
              <span className="text-gray-300">Inspector Hub</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-4" />

          {/* Messaging (placeholder) */}
          <Link
            href="/messages"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm mb-1"
          >
            <span className="text-lg">💬</span>
            <span className="text-gray-300">Messages</span>
            <span className="ml-auto text-xs bg-white/10 px-2 py-0.5 rounded text-gray-500">0</span>
          </Link>

          {/* Notifications (placeholder) */}
          <Link
            href="/notifications"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm mb-4"
          >
            <span className="text-lg">🔔</span>
            <span className="text-gray-300">Notifications</span>
            <span className="ml-auto text-xs bg-green-600 px-2 py-0.5 rounded text-white">0</span>
          </Link>

          {/* Divider */}
          <div className="border-t border-white/10 mb-4" />

          {/* Settings */}
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm text-left">
              <span className="text-lg">⚙️</span>
              <span className="text-gray-300">Settings</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition text-sm text-left text-gray-400"
            >
              <span className="text-lg">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}