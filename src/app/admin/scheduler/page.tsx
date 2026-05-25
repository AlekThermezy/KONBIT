'use client'
import Navbar from '@/components/layout/Navbar'
import SlideSidebar from '@/components/layout/SlideSidebar'
import LeftSidebar from '@/components/layout/LeftSidebar'
import Footer from '@/components/layout/Footer'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const mockBusinesses = [
  {
    id: 'biz-001',
    name: 'Kay Ix Construction',
    tier: 'verified',
    city: 'Jacmel',
    lastInspection: 'May 18, 2026',
    nextDue: 'June 15, 2026',
    windowStart: 'June 13, 2026',
    windowEnd: 'June 17, 2026',
    pendingJobs: 0,
    avgRating: 4.3,
    streak: 3,
  },
  {
    id: 'biz-002',
    name: 'Manje Lakay',
    tier: 'growth',
    city: 'Delmas, PAP',
    lastInspection: 'May 10, 2026',
    nextDue: 'May 25, 2026',
    windowStart: 'May 23, 2026',
    windowEnd: 'May 27, 2026',
    pendingJobs: 1,
    avgRating: 4.6,
    streak: 5,
  },
  {
    id: 'biz-003',
    name: 'Ixora Collective',
    tier: 'anchor',
    city: 'Port-au-Prince',
    lastInspection: 'May 20, 2026',
    nextDue: 'May 27, 2026',
    windowStart: 'May 25, 2026',
    windowEnd: 'May 29, 2026',
    pendingJobs: 0,
    avgRating: 4.9,
    streak: 8,
  },
  {
    id: 'biz-004',
    name: 'Haitian Brew Co.',
    tier: 'verified',
    city: 'Thiotte',
    lastInspection: 'April 30, 2026',
    nextDue: 'June 28, 2026',
    windowStart: 'June 26, 2026',
    windowEnd: 'June 30, 2026',
    pendingJobs: 0,
    avgRating: 4.1,
    streak: 2,
  },
  {
    id: 'biz-005',
    name: 'Sejour Haven',
    tier: 'growth',
    city: 'Jacmel',
    lastInspection: 'May 5, 2026',
    nextDue: 'May 20, 2026',
    windowStart: 'May 18, 2026',
    windowEnd: 'May 22, 2026',
    pendingJobs: 0,
    avgRating: 4.4,
    streak: 4,
  },
]

const mockInspectors = [
  { id: 'insp-001', name: 'Jean M.', city: 'Jacmel', available: true, rating: 4.8, activeJobs: 0 },
  { id: 'insp-002', name: 'Marie L.', city: 'Delmas, PAP', available: true, rating: 4.2, activeJobs: 1 },
  { id: 'insp-003', name: 'Pierre T.', city: 'Port-au-Prince', available: true, rating: 4.9, activeJobs: 0 },
  { id: 'insp-004', name: 'Claudine F.', city: 'Thiotte', available: false, rating: 4.5, activeJobs: 1 },
]

const stats = {
  totalBusinesses: 47,
  activeJobs: 12,
  completedThisWeek: 8,
  pendingApproval: 5,
  avgRating: 4.4,
}

const tierColors: Record<string, string> = {
  free: 'text-gray-400',
  verified: 'text-blue-400',
  growth: 'text-green-400',
  anchor: 'text-purple-400',
}

const tierBg: Record<string, string> = {
  free: 'bg-gray-900/50',
  verified: 'bg-blue-900/20',
  growth: 'bg-green-900/20',
  anchor: 'bg-purple-900/20',
}

export default function AdminScheduler() {
  const [user, setUser] = useState<any>(null)
  const [businesses, setBusinesses] = useState(mockBusinesses)
  const [inspectors] = useState(mockInspectors)
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const now = new Date()

  const isOverdue = (dueDate: string) => new Date(dueDate) < now
  const isDueSoon = (dueDate: string) => {
    const d = new Date(dueDate)
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 5
  }

  const sortedBusinesses = [...businesses].sort((a, b) => {
    if (isOverdue(a.nextDue) && !isOverdue(b.nextDue)) return -1
    if (!isOverdue(a.nextDue) && isOverdue(b.nextDue)) return 1
    return new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime()
  })

  const filtered = filter === 'all'
    ? sortedBusinesses
    : sortedBusinesses.filter(b => {
        if (filter === 'overdue') return isOverdue(b.nextDue)
        if (filter === 'due_soon') return isDueSoon(b.nextDue)
        if (filter === 'pending') return b.pendingJobs > 0
        return b.tier === filter
      })

  const assignInspector = (business: any, inspector: any) => {
    setBusinesses(prev => prev.map(b =>
      b.id === business.id ? { ...b, pendingJobs: b.pendingJobs + 1 } : b
    ))
    setShowAssignModal(false)
    setSelectedBusiness(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl font-bold text-green-400">Loading scheduler...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <h2 className="text-2xl font-bold mb-2">Admin Access Only</h2>
          <p className="text-gray-400 mb-6">Sign in to manage verification schedule</p>
          <a href="/signin" className="px-6 py-3 bg-green-600 rounded-xl font-bold">Sign In</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <LeftSidebar />
            <SlideSidebar />

      <main className="pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📅</span>
              <div>
                <h1 className="text-3xl font-black">Verification Scheduler</h1>
                <p className="text-gray-400">Manage inspection cadence across all businesses</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Businesses', value: stats.totalBusinesses, color: 'text-white' },
              { label: 'Active Jobs', value: stats.activeJobs, color: 'text-yellow-400' },
              { label: 'Completed This Week', value: stats.completedThisWeek, color: 'text-green-400' },
              { label: 'Pending Approval', value: stats.pendingApproval, color: 'text-blue-400' },
              { label: 'Avg Rating', value: stats.avgRating, color: 'text-yellow-400' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className={`text-2xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Batch Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                { id: 'all', label: 'All Business' },
                { id: 'overdue', label: '🔴 Overdue' },
                { id: 'due_soon', label: '🟡 Due Soon' },
                { id: 'pending', label: '⏳ Pending Jobs' },
                { id: 'verified', label: '💙 Verified' },
                { id: 'growth', label: '💚 Growth' },
                { id: 'anchor', label: '💜 Anchor' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                    filter === f.id ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition text-sm">
              📅 Generate Next Cycle
            </button>
          </div>

          {/* Business Table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Business</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Tier</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Location</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Last Verified</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Next Due</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Window</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Rating</th>
                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(biz => {
                    const overdue = isOverdue(biz.nextDue)
                    const dueSoon = isDueSoon(biz.nextDue)
                    return (
                      <tr key={biz.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="p-4">
                          <div className="font-medium">{biz.name}</div>
                          <div className="text-gray-500 text-xs">{biz.streak}🔥 streak</div>
                        </td>
                        <td className="p-4">
                          <span className={`font-bold text-sm ${tierColors[biz.tier]}`}>
                            {biz.tier.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300 text-sm">{biz.city}</td>
                        <td className="p-4 text-gray-300 text-sm">{biz.lastInspection}</td>
                        <td className="p-4">
                          <span className={`font-medium text-sm ${
                            overdue ? 'text-red-400' : dueSoon ? 'text-yellow-400' : 'text-gray-300'
                          }`}>
                            {biz.nextDue}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 text-xs">
                          <div>{biz.windowStart}</div>
                          <div>to {biz.windowEnd}</div>
                        </td>
                        <td className="p-4">
                          {overdue ? (
                            <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-lg text-xs font-bold">OVERDUE</span>
                          ) : dueSoon ? (
                            <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-lg text-xs font-bold">DUE SOON</span>
                          ) : biz.pendingJobs > 0 ? (
                            <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded-lg text-xs font-bold">IN PROGRESS</span>
                          ) : (
                            <span className="px-2 py-1 bg-white/10 text-gray-400 rounded-lg text-xs">SCHEDULED</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-yellow-400 font-bold">{biz.avgRating}</span>
                          <span className="text-gray-500 text-xs">/5</span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setSelectedBusiness(biz); setShowAssignModal(true) }}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold transition"
                              disabled={biz.pendingJobs > 0}
                            >
                              📋 Assign
                            </button>
                            <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition">
                              ✏️ Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-4">📋</div>
                <p>No businesses in this category</p>
              </div>
            )}
          </div>

          {/* Inspector Pool */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Inspector Pool</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {inspectors.map(insp => (
                <div key={insp.id} className={`bg-white/5 border rounded-2xl p-4 ${insp.available ? 'border-green-500/30' : 'border-white/10 opacity-60'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                      {insp.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{insp.name}</div>
                      <div className="text-gray-400 text-sm">{insp.city}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${insp.available ? 'bg-green-900/30 text-green-400' : 'bg-white/10 text-gray-400'}`}>
                      {insp.available ? 'AVAILABLE' : 'BUSY'}
                    </span>
                    <span className="text-yellow-400">⭐ {insp.rating}</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-2">
                    Active jobs: {insp.activeJobs}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Assign Inspector Modal */}
      {showAssignModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Assign Inspector</h2>
              <button onClick={() => { setShowAssignModal(false); setSelectedBusiness(null) }} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="font-bold text-lg">{selectedBusiness.name}</div>
              <div className="text-gray-400 text-sm">{selectedBusiness.city} · {selectedBusiness.tier.toUpperCase()}</div>
              <div className="text-gray-500 text-sm mt-1">Window: {selectedBusiness.windowStart} — {selectedBusiness.windowEnd}</div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-sm font-medium text-gray-400 mb-2">SELECT INSPECTOR</div>
              {inspectors.filter(i => i.available).map(insp => (
                <button
                  key={insp.id}
                  onClick={() => assignInspector(selectedBusiness, insp)}
                  className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-green-900/20 border border-white/10 hover:border-green-500/30 rounded-xl transition text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
                    {insp.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{insp.name}</div>
                    <div className="text-gray-400 text-sm">{insp.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold">⭐ {insp.rating}</div>
                    <div className="text-gray-500 text-xs">{insp.activeJobs} active</div>
                  </div>
                </button>
              ))}
              {inspectors.filter(i => i.available).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No inspectors available. Check back later.
                </div>
              )}
            </div>

            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
              <div className="text-sm">
                <span className="text-green-400 font-medium">💡 Pro tip:</span>
                <span className="text-gray-400"> Assigning creates the job. Inspector will receive notification and must complete within the window. Business will NOT be notified in advance.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}