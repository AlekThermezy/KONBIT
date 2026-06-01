'use client'
import Navbar from '@/components/layout/Navbar'
import SlideSidebar from '@/components/layout/SlideSidebar'
import Footer from '@/components/layout/Footer'
import LeftSidebar from '@/components/layout/LeftSidebar'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const jobTypes = [
  { id: 'food_review', label: '🍽️ Food Review', icon: '🍽️', pay: '$25-35', desc: 'Mystery diner visits' },
  { id: 'company_visit', label: '🏢 Company Visit', icon: '🏢', pay: '$30-45', desc: 'Business verification' },
  { id: 'delivery_verify', label: '📦 Delivery Check', icon: '📦', pay: '$20-30', desc: 'Confirm receipt' },
  { id: 'quality_check', label: '✅ Quality Check', icon: '✅', pay: '$25-40', desc: 'Product inspection' },
  { id: 'compliance', label: '📋 Compliance', icon: '📋', pay: '$35-50', desc: 'Standards review' },
]

const sampleJobs = [
  {
    id: 'job-001',
    type: 'company_visit',
    business: 'Kay Ix Construction',
    location: 'Jacmel, HT',
    description: 'Verify construction progress on pre-fab housing project. Take video of site, current build status.',
    instructions: ['Video walkthrough of property', 'Count materials on site', 'Rate construction quality 1-5', 'Interview site manager'],
    payment: 3500,
    distance: '8 km',
    priority: 'high',
    expires: '2 days',
  },
  {
    id: 'job-002',
    type: 'food_review',
    business: 'Manje Lakay Restaurant',
    location: 'Delmas, PAP',
    description: 'Mystery diner visit. Order traditional dishes, rate food quality, service speed, cleanliness.',
    instructions: ['Order 2-3 dishes', 'Rate food quality 1-5', 'Time service speed', 'Photo of meals', 'Rate ambiance'],
    payment: 2500,
    distance: '3 km',
    priority: 'normal',
    expires: '5 days',
  },
  {
    id: 'job-003',
    type: 'delivery_verify',
    business: 'Ixora Collective',
    location: 'Port-au-Prince',
    description: 'Verify artisan cacao delivery batch. Count items, check packaging condition.',
    instructions: ['Count delivered boxes', 'Check for damage', 'Photo packaging', 'Confirm signature'],
    payment: 2000,
    distance: '5 km',
    priority: 'urgent',
    expires: '1 day',
  },
]

const sampleMyJobs = [
  {
    id: 'my-001',
    type: 'company_visit',
    business: 'Haitian Brew Co.',
    location: 'Thiotte, HT',
    status: 'in_progress',
    started: '2 hours ago',
    due: 'Tomorrow',
    payment: 3500,
    progress: 40,
  },
]

export default function InspectorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('available')
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [showVideoUpload, setShowVideoUpload] = useState(false)
  const [videoDesc, setVideoDesc] = useState('')
  const [videoRating, setVideoRating] = useState(3)
  const [uploading, setUploading] = useState(false)
  const [inspectorProfile, setInspectorProfile] = useState<any>(null)
  const [earnings, setEarnings] = useState({ balance: 12500, pending: 3500, total: 25000 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u)
      if (!u) {
        // redirect to sign in
      }
      setLoading(false)
    })
  }, [])

  const acceptJob = (job: any) => {
    setSelectedJob(job)
  }

  const submitReport = async () => {
    setUploading(true)
    await new Promise(r => setTimeout(r, 1500))
    setUploading(false)
    setShowVideoUpload(false)
    setSelectedJob(null)
    setActiveTab('active')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl font-bold text-green-400">Loading inspector dashboard...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Inspector Access Only</h2>
          <p className="text-gray-400 mb-6">Sign in to access your inspector dashboard</p>
          <a href="/signin" className="px-6 py-3 bg-green-600 rounded-xl font-bold">Sign In</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <SlideSidebar />

      <main className="pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🔍</span>
              <div>
                <h1 className="text-3xl font-black">Inspector Hub</h1>
                <p className="text-gray-400">Verify. Report. Get Paid.</p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-green-400">${(earnings.balance / 100).toFixed(2)}</div>
              <div className="text-gray-400 text-sm">Available Balance</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-yellow-400">${(earnings.pending / 100).toFixed(2)}</div>
              <div className="text-gray-400 text-sm">Pending Payout</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">12</div>
              <div className="text-gray-400 text-sm">Inspections Done</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
            {[
              { id: 'available', label: '📋 Available Jobs', count: sampleJobs.length },
              { id: 'active', label: '🔄 Active Jobs', count: sampleMyJobs.length },
              { id: 'history', label: '✅ Completed', count: 5 },
              { id: 'earnings', label: '💰 Earnings', count: null },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 px-2 py-0.5 bg-white/10 rounded-full text-xs">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'available' && (
            <div className="space-y-4">
              {sampleJobs.map(job => (
                <div key={job.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-green-500/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        job.priority === 'urgent' ? 'bg-red-900/30' :
                        job.priority === 'high' ? 'bg-orange-900/30' : 'bg-white/10'
                      }`}>
                        {jobTypes.find(t => t.id === job.type)?.icon || '📋'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{job.business}</h3>
                        <p className="text-gray-400 text-sm">📍 {job.location} · {job.distance} away</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-black text-lg">${(job.payment / 100).toFixed(0)}</div>
                      {job.priority !== 'normal' && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          job.priority === 'urgent' ? 'bg-red-900/30 text-red-400' : 'bg-orange-900/30 text-orange-400'
                        }`}>
                          {job.priority.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{job.description}</p>

                  <div className="bg-white/5 rounded-xl p-3 mb-4">
                    <div className="text-xs text-gray-500 mb-2 font-medium">WHAT TO VERIFY:</div>
                    <div className="flex flex-wrap gap-2">
                      {job.instructions.map((inst: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-300">✓ {inst}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">⏰ Expires in {job.expires}</span>
                    <button
                      onClick={() => acceptJob(job)}
                      className="px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition"
                    >
                      Accept Job →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-4">
              {sampleMyJobs.map(job => (
                <div key={job.id} className="bg-white/5 border border-green-500/30 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-green-900/30 flex items-center justify-center text-2xl">
                        {jobTypes.find(t => t.id === job.type)?.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{job.business}</h3>
                        <p className="text-gray-400 text-sm">📍 {job.location}</p>
                      </div>
                    </div>
                    <div className="text-green-400 font-black text-lg">${(job.payment / 100).toFixed(0)}</div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-green-400">{job.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${job.progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-gray-500 text-sm">Started {job.started}</span>
                    <span className="text-gray-500 text-sm">📅 Due {job.due}</span>
                  </div>

                  <button
                    onClick={() => { setSelectedJob(job); setShowVideoUpload(true) }}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition"
                  >
                    📹 Submit Video Report
                  </button>
                </div>
              ))}

              {sampleMyJobs.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-lg">No active jobs</p>
                  <p className="text-sm">Browse available jobs to get started</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-lg">5 completed inspections</p>
              <p className="text-sm mt-2">Total earned: $125.00</p>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6 text-center mb-6">
                <div className="text-4xl font-black text-green-400 mb-2">${(earnings.balance / 100).toFixed(2)}</div>
                <p className="text-gray-400">Ready to withdraw</p>
                <button className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition disabled:opacity-50" disabled>
                  Withdraw (Coming Soon)
                </button>
              </div>

              {[
                { date: 'May 20, 2026', job: 'Kay Ix Visit', amount: 3500, status: 'paid' },
                { date: 'May 15, 2026', job: 'Manje Review', amount: 2500, status: 'paid' },
                { date: 'May 10, 2026', job: 'Cacao Delivery', amount: 2000, status: 'paid' },
                { date: 'May 25, 2026', job: 'Thiotte Visit', amount: 3500, status: 'pending' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                  <div>
                    <div className="font-medium">{item.job}</div>
                    <div className="text-gray-500 text-sm">{item.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${item.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                      +${(item.amount / 100).toFixed(2)}
                    </div>
                    <div className="text-gray-500 text-xs uppercase">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Video Upload Modal */}
      {showVideoUpload && selectedJob && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">📹 Submit Video Report</h2>
              <button onClick={() => setShowVideoUpload(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-5">
              <div className="font-bold mb-1">{selectedJob.business}</div>
              <div className="text-gray-400 text-sm">{selectedJob.location}</div>
              <div className="text-green-400 font-bold mt-2">Earn: ${(selectedJob.payment / 100).toFixed(2)}</div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Video File</label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-green-500/50 transition cursor-pointer">
                <div className="text-4xl mb-2">📹</div>
                <p className="text-gray-400">Tap to record or upload video</p>
                <p className="text-gray-500 text-sm mt-1">MP4, MOV — max 5 minutes</p>
                <input type="file" accept="video/*" className="hidden" />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">Written Summary</label>
              <textarea
                value={videoDesc}
                onChange={e => setVideoDesc(e.target.value)}
                placeholder="Describe what you observed. Be specific about condition, quality, cleanliness..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none resize-none"
                rows={4}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Business Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setVideoRating(n)}
                    className={`w-12 h-12 rounded-xl font-bold text-xl transition ${
                      n <= videoRating ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <button
              onClick={submitReport}
              disabled={uploading || !videoDesc}
              className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition disabled:opacity-50"
            >
              {uploading ? '⏳ Submitting...' : '✅ Submit Report for Review'}
            </button>

            <p className="text-center text-gray-500 text-sm mt-3">
              Payment released after admin approval
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}