'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getCurrentUser, signOut } from '@/lib/auth'

interface DashboardStats {
  totalInvested: string
  portfolioValue: string
  coursesCompleted: number
  learningStreak: number
  activeDeals: number
  pendingReturns: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalInvested: '$0',
    portfolioValue: '$0',
    coursesCompleted: 0,
    learningStreak: 0,
    activeDeals: 0,
    pendingReturns: '$0',
  })

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (!u) {
        router.push('/signin')
        return
      }
      setUser(u)
      setLoading(false)
    })
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
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

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-black mb-2">
              Welcome back,{' '}
              <span className="text-green-500">{user?.user_metadata?.full_name || 'User'}</span>
            </h1>
            <p className="text-gray-400">
              Your KONBIT portfolio at a glance
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Link
              href="/growth"
              className="group p-6 bg-gradient-to-br from-green-900/30 to-green-950/50 border border-green-500/20 rounded-2xl hover:border-green-500/50 transition-all"
            >
              <div className="text-3xl mb-3">📈</div>
              <div className="text-lg font-bold text-white group-hover:text-green-400 transition">
                Invest
              </div>
              <div className="text-sm text-gray-500">Browse opportunities</div>
            </Link>

            <Link
              href="/learn"
              className="group p-6 bg-gradient-to-br from-blue-900/30 to-blue-950/50 border border-blue-500/20 rounded-2xl hover:border-blue-500/50 transition-all"
            >
              <div className="text-3xl mb-3">🎓</div>
              <div className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                Learn
              </div>
              <div className="text-sm text-gray-500">Continue learning</div>
            </Link>

            <Link
              href="/deals"
              className="group p-6 bg-gradient-to-br from-amber-900/30 to-amber-950/50 border border-amber-500/20 rounded-2xl hover:border-amber-500/50 transition-all"
            >
              <div className="text-3xl mb-3">💰</div>
              <div className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                Deals
              </div>
              <div className="text-sm text-gray-500">Quick investments</div>
            </Link>

            <Link
              href="/jobs"
              className="group p-6 bg-gradient-to-br from-purple-900/30 to-purple-950/50 border border-purple-500/20 rounded-2xl hover:border-purple-500/50 transition-all"
            >
              <div className="text-3xl mb-3">💼</div>
              <div className="text-lg font-bold text-white group-hover:text-purple-400 transition">
                Jobs
              </div>
              <div className="text-sm text-gray-500">Find opportunities</div>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Total Invested */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-gray-400 text-sm mb-2">Total Invested</div>
              <div className="text-3xl font-bold text-green-500">{stats.totalInvested}</div>
              <div className="text-xs text-gray-500 mt-2">Across all campaigns</div>
            </div>

            {/* Portfolio Value */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-gray-400 text-sm mb-2">Portfolio Value</div>
              <div className="text-3xl font-bold text-blue-400">{stats.portfolioValue}</div>
              <div className="text-xs text-gray-500 mt-2">Current value</div>
            </div>

            {/* Pending Returns */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-gray-400 text-sm mb-2">Pending Returns</div>
              <div className="text-3xl font-bold text-amber-400">{stats.pendingReturns}</div>
              <div className="text-xs text-gray-500 mt-2">Awaiting distribution</div>
            </div>

            {/* Courses Completed */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-gray-400 text-sm mb-2">Courses Completed</div>
              <div className="text-3xl font-bold text-white">{stats.coursesCompleted}</div>
              <div className="text-xs text-gray-500 mt-2">Keep learning!</div>
            </div>

            {/* Learning Streak */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-gray-400 text-sm mb-2">Learning Streak</div>
              <div className="text-3xl font-bold text-orange-400">{stats.learningStreak} 🔥</div>
              <div className="text-xs text-gray-500 mt-2">Days in a row</div>
            </div>

            {/* Active Deals */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-gray-400 text-sm mb-2">Active Deals</div>
              <div className="text-3xl font-bold text-purple-400">{stats.activeDeals}</div>
              <div className="text-xs text-gray-500 mt-2">Open positions</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { icon: '📈', text: 'Portfolio value increased by 12%', time: '2 days ago' },
                { icon: '🎓', text: 'Completed "Caribbean Business Essentials"', time: '5 days ago' },
                { icon: '💰', text: 'Received returns from Real Estate Pool A', time: '1 week ago' },
                { icon: '🔥', text: '7 day learning streak!', time: '1 week ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{activity.text}</div>
                    <div className="text-gray-500 text-sm">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}