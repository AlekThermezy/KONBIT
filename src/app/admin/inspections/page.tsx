'use client'
import Navbar from '@/components/layout/Navbar'
import SlideSidebar from '@/components/layout/SlideSidebar'
import LeftSidebar from '@/components/layout/LeftSidebar'
import Footer from '@/components/layout/Footer'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const sampleReports = [
  {
    id: 'rep-001',
    inspector: 'Jean M.',
    inspectorRating: 4.8,
    jobType: 'company_visit',
    business: 'Kay Ix Construction',
    location: 'Jacmel',
    submittedAt: 'May 24, 2026 · 3:45 PM',
    videoUrl: null,
    summary: 'Construction site looks active. 4 workers on site, foundation poured, walls going up next week. Materials stored properly. Site manager very cooperative.',
    rating: 4,
    findings: { workers: 4, materials: 'organized', quality: 4, communication: 5 },
    photos: [],
    payoutAmount: 3500,
    inspectorBalance: 12500,
    status: 'pending',
  },
  {
    id: 'rep-002',
    inspector: 'Marie L.',
    inspectorRating: 4.2,
    jobType: 'food_review',
    business: 'Manje Lakay',
    location: 'Delmas, PAP',
    submittedAt: 'May 23, 2026 · 7:30 PM',
    videoUrl: null,
    summary: 'Restaurant clean, food arrived in 25 minutes. Griyo was well seasoned. Staff friendly. Only issue: bathroom could be cleaner. Overall recommend.',
    rating: 4,
    findings: { foodQuality: 4, serviceSpeed: 3, cleanliness: 3, staff: 5 },
    photos: [],
    payoutAmount: 2500,
    inspectorBalance: 8000,
    status: 'pending',
  },
  {
    id: 'rep-003',
    inspector: 'Pierre T.',
    inspectorRating: 4.9,
    jobType: 'delivery_verify',
    business: 'Ixora Collective',
    location: 'Port-au-Prince',
    submittedAt: 'May 22, 2026 · 2:15 PM',
    videoUrl: null,
    summary: 'Delivery confirmed. 50 boxes received, all in good condition. Packaging intact. Signature obtained. Batch ready for distribution.',
    rating: 5,
    findings: { itemCount: 50, condition: 'perfect', packaging: 'intact', signature: true },
    photos: [],
    payoutAmount: 2000,
    inspectorBalance: 5500,
    status: 'approved',
  },
]

const pendingStats = {
  awaitingReview: 8,
  approved: 24,
  rejected: 3,
  paidOut: 19,
}

export default function AdminInspections() {
  const [user, setUser] = useState<any>(null)
  const [reports, setReports] = useState(sampleReports)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const approveReport = (reportId: string) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'approved' } : r
    ))
    setSelectedReport(null)
  }

  const rejectReport = (reportId: string) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'rejected' } : r
    ))
    setSelectedReport(null)
  }

  const markPaid = (reportId: string) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'paid' } : r
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl font-bold text-green-400">Loading admin panel...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Admin Access Only</h2>
          <p className="text-gray-400 mb-6">Sign in to access the admin panel</p>
          <a href="/signin" className="px-6 py-3 bg-green-600 rounded-xl font-bold">Sign In</a>
        </div>
      </div>
    )
  }

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter)

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
              <span className="text-3xl">🛡️</span>
              <div>
                <h1 className="text-3xl font-black">Accreditor Admin</h1>
                <p className="text-gray-400">Review video reports · Trigger payments</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Awaiting Review', value: pendingStats.awaitingReview, color: 'yellow' },
              { label: 'Approved', value: pendingStats.approved, color: 'green' },
              { label: 'Rejected', value: pendingStats.rejected, color: 'red' },
              { label: 'Paid Out', value: pendingStats.paidOut, color: 'blue' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className={`text-2xl font-black ${
                  stat.color === 'yellow' ? 'text-yellow-400' :
                  stat.color === 'green' ? 'text-green-400' :
                  stat.color === 'red' ? 'text-red-400' : 'text-blue-400'
                } mb-1`}>{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
            {['pending', 'approved', 'rejected', 'paid', 'all'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl font-medium capitalize transition ${
                  filter === f ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Report List */}
          <div className="space-y-4">
            {filtered.map(report => (
              <div key={report.id} className={`bg-white/5 border rounded-2xl p-5 hover:border-green-500/30 transition-all cursor-pointer ${
                report.status === 'pending' ? 'border-yellow-500/30' :
                report.status === 'approved' ? 'border-green-500/30' :
                report.status === 'rejected' ? 'border-red-500/30' :
                'border-white/10'
              }`}>
                <div className="flex items-start justify-between mb-3" onClick={() => setSelectedReport(report)}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                      {report.jobType === 'company_visit' ? '🏢' :
                       report.jobType === 'food_review' ? '🍽️' :
                       report.jobType === 'delivery_verify' ? '📦' : '📋'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{report.business}</h3>
                      <p className="text-gray-400 text-sm">
                        🔍 {report.inspector} · 📍 {report.location} · {report.submittedAt}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Inspector Rating: ⭐ {report.inspectorRating} · Balance: ${(report.inspectorBalance/100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase mb-1 ${
                      report.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                      report.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                      report.status === 'rejected' ? 'bg-red-900/30 text-red-400' :
                      'bg-blue-900/30 text-blue-400'
                    }`}>{report.status}</div>
                    {report.status !== 'paid' && (
                      <div className="text-green-400 font-black text-lg">${(report.payoutAmount/100).toFixed(0)}</div>
                    )}
                  </div>
                </div>

                {/* Video thumbnail placeholder */}
                <div className="bg-gray-900 border border-white/10 rounded-xl p-4 mb-4 flex items-center gap-4" onClick={() => setSelectedReport(report)}>
                  <div className="w-20 h-14 bg-white/5 rounded-lg flex items-center justify-center text-2xl">▶️</div>
                  <div>
                    <div className="font-medium">Video Report (ready to review)</div>
                    <div className="text-gray-400 text-sm">Tap to expand full details</div>
                  </div>
                </div>

                {/* Findings grid */}
                <div className="bg-white/5 rounded-xl p-3 mb-4" onClick={() => setSelectedReport(report)}>
                  <div className="text-xs text-gray-500 mb-2">KEY FINDINGS</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(report.findings).map(([key, val]: [string, any]) => (
                      <div key={key} className="bg-white/5 rounded-lg p-2">
                        <div className="text-gray-500 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                        <div className="font-medium text-sm">{typeof val === 'boolean' ? (val ? '✓' : '✗') : val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <p className="text-gray-300 text-sm mb-4 border-l-2 border-green-500/30 pl-3 italic" onClick={() => setSelectedReport(report)}>
                  "{report.summary}"
                </p>

                {/* Actions */}
                {report.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => rejectReport(report.id)}
                      className="flex-1 py-2.5 bg-white/5 hover:bg-red-900/30 border border-red-500/30 rounded-xl font-semibold transition text-red-400"
                    >
                      ✗ Reject
                    </button>
                    <button
                      onClick={() => approveReport(report.id)}
                      className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition"
                    >
                      ✓ Approve
                    </button>
                  </div>
                )}

                {report.status === 'approved' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => markPaid(report.id)}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition"
                    >
                      💰 Mark as Paid
                    </button>
                  </div>
                )}

                {report.status === 'paid' && (
                  <div className="text-center text-blue-400 font-medium text-sm py-2">✓ Payment completed</div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-4">📋</div>
                <p>No reports in this category</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Report Details</h2>
              <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="font-bold text-lg">{selectedReport.business}</div>
                <div className="text-gray-400 text-sm">{selectedReport.jobType} · {selectedReport.location}</div>
                <div className="text-gray-400 text-sm">By {selectedReport.inspector} · {selectedReport.submittedAt}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-green-400">{selectedReport.rating}/5</div>
                  <div className="text-gray-400 text-sm">Rating</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-green-400">${(selectedReport.payoutAmount/100).toFixed(0)}</div>
                  <div className="text-gray-400 text-sm">Payout</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-yellow-400">${(selectedReport.inspectorBalance/100).toFixed(0)}</div>
                  <div className="text-gray-400 text-sm">Balance</div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-sm font-medium mb-2">📹 Video</div>
                <div className="aspect-video bg-black rounded-xl flex items-center justify-center text-3xl cursor-pointer hover:bg-gray-900 transition">
                  ▶️ Tap to play
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-sm font-medium mb-2">Summary</div>
                <p className="text-gray-300 italic">"{selectedReport.summary}"</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-sm font-medium mb-3">Key Findings</div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedReport.findings).map(([key, val]: [string, any]) => (
                    <div key={key} className="bg-black/50 rounded-lg p-3">
                      <div className="text-gray-500 text-xs capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="font-medium">{typeof val === 'number' ? `${val}/5` : String(val)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { rejectReport(selectedReport.id); setSelectedReport(null) }}
                  className="flex-1 py-3 bg-white/5 hover:bg-red-900/30 border border-red-500/30 rounded-xl font-semibold transition text-red-400"
                >
                  ✗ Reject Report
                </button>
                <button
                  onClick={() => { approveReport(selectedReport.id); setSelectedReport(null) }}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition"
                >
                  ✓ Approve Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}