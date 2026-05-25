'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { getCurrentUser, signOut } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deals, setDeals] = useState<any[]>([])
  const [myBackings, setMyBackings] = useState<any[]>([])
  const [myCourses, setMyCourses] = useState<any[]>([])

  useEffect(() => {
    getCurrentUser().then(async (u) => {
      if (!u) {
        router.push('/signin')
        return
      }
      setUser(u)

      // Fetch active campaigns (deals)
      const { data: campaigns } = await supabase
        .from('product_campaigns')
        .select('*')
        .in('status', ['live'])
        .limit(4)

      if (campaigns) setDeals(campaigns)

      // Fetch my backings
      const { data: backings } = await supabase
        .from('campaign_backings')
        .select('*, product_campaigns(business_name, product_name)')
        .eq('user_id', u.id)
        .limit(5)

      if (backings) setMyBackings(backings)

      // Fetch my enrollments
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*, courses(title, thumbnail_url)')
        .eq('user_id', u.id)
        .limit(3)

      if (enrollments) setMyCourses(enrollments)

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

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">
                Hey, <span className="text-green-500">{userName}</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">Here's what's happening</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/deals"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white text-sm font-medium transition"
              >
                Back a Project
              </Link>
              <Link
                href="/dashboard/onboard"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-gray-300 text-sm font-medium transition"
              >
                Start a Campaign
              </Link>
            </div>
          </div>

          {/* My Backings / Portfolio */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">My Backings</h2>
              {myBackings.length > 0 && (
                <Link href="/dashboard/backings" className="text-green-500 text-sm hover:underline">
                  View all →
                </Link>
              )}
            </div>

            {myBackings.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="text-3xl mb-3">💰</div>
                <div className="text-white font-medium mb-2">No backings yet</div>
                <div className="text-gray-400 text-sm mb-4">Find a product to back and start investing</div>
                <Link
                  href="/deals"
                  className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white text-sm font-medium transition"
                >
                  Browse Deals
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myBackings.map((backing) => (
                  <Link
                    key={backing.id}
                    href={`/deals/${backing.campaign_id}`}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition"
                  >
                    <div className="text-white font-medium">
                      {backing.product_campaigns?.product_name || 'Campaign'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {backing.product_campaigns?.business_name || 'Business'}
                    </div>
                    <div className="mt-2 text-green-500 font-bold">
                      ${Number(backing.total_price).toFixed(2)}
                    </div>
                    <div className="text-gray-500 text-xs capitalize mt-1">{backing.status}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Active Deals */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Active Deals</h2>
              <Link href="/deals" className="text-green-500 text-sm hover:underline">
                View all →
              </Link>
            </div>

            {deals.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="text-3xl mb-3">📦</div>
                <div className="text-white font-medium mb-2">No live campaigns yet</div>
                <div className="text-gray-400 text-sm">Check back soon — new campaigns launch regularly</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {deals.map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/deals/${deal.id}`}
                    className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:border-green-500/30 transition"
                  >
                    <div className="text-white font-medium group-hover:text-green-400 transition truncate">
                      {deal.product_name}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">{deal.business_name}</div>
                    <div className="text-gray-500 text-xs mt-2 capitalize">{deal.business_sector}</div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{deal.quantity_sold || 0} / {deal.quantity_available} claimed</span>
                        <span className="text-green-500">
                          {deal.quantity_available > 0
                            ? Math.round(((deal.quantity_sold || 0) / deal.quantity_available) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${
                              deal.quantity_available > 0
                                ? Math.min(100, ((deal.quantity_sold || 0) / deal.quantity_available) * 100)
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* My Courses */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">My Courses</h2>
              {myCourses.length > 0 && (
                <Link href="/learn" className="text-green-500 text-sm hover:underline">
                  Continue learning →
                </Link>
              )}
            </div>

            {myCourses.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="text-3xl mb-3">🎓</div>
                <div className="text-white font-medium mb-2">No courses started</div>
                <div className="text-gray-400 text-sm mb-4">Learn something new today</div>
                <Link
                  href="/learn"
                  className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm font-medium transition"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {myCourses.map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    href={`/learn/courses/${enrollment.course_id}`}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition"
                  >
                    <div className="text-white font-medium">{enrollment.courses?.title}</div>
                    <div className="mt-3">
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${enrollment.progress_percent || 0}%` }}
                        />
                      </div>
                      <div className="text-gray-500 text-xs mt-2">
                        {enrollment.progress_percent || 0}% complete
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="border-t border-white/10 pt-6 mt-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-400 hover:text-white text-sm transition"
              >
                Sign Out
              </button>
              <Link href="/refer" className="px-4 py-2 text-gray-400 hover:text-white text-sm transition">
                Invite Friends
              </Link>
              <Link href="/pool" className="px-4 py-2 text-gray-400 hover:text-white text-sm transition">
                How Pricing Works
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}