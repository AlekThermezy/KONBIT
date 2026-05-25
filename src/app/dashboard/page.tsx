'use client'
import Navbar from '@/components/layout/Navbar'
import SlideSidebar from '@/components/layout/SlideSidebar'
import Footer from '@/components/layout/Footer'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const tiers = {
  free: { name: 'Free', color: 'gray', inspections: 0, price: '$0/mo' },
  verified: { name: 'Verified', color: 'blue', inspections: 1, price: '$29/mo' },
  growth: { name: 'Growth', color: 'green', inspections: 2, price: '$99/mo' },
  anchor: { name: 'Anchor', color: 'purple', inspections: 4, price: '$299/mo' },
}

const mockBusiness = {
  id: 'biz-001',
  name: 'Kay Ix Construction',
  sector: 'real_estate',
  city: 'Jacmel',
  tier: 'verified',
  badge: 'verified',
  lastVerified: 'May 18, 2026',
  nextInspection: 'Within 2 weeks',
  windowStart: 'May 28, 2026',
  windowEnd: 'June 3, 2026',
  totalInspections: 3,
  streak: 2,
  avgRating: 4.3,
}

const mockInspections = [
  {
    id: 'insp-001',
    date: 'May 18, 2026',
    type: 'company_visit',
    inspector: 'Jean M.',
    rating: 4,
    status: 'completed',
    findings: { workers: 4, materials: 5, cleanliness: 4, safety: 4 },
    videoUrl: null,
  },
  {
    id: 'insp-002',
    date: 'April 20, 2026',
    type: 'company_visit',
    inspector: 'Marie L.',
    rating: 5,
    status: 'completed',
    findings: { workers: 5, materials: 5, cleanliness: 4, safety: 5 },
    videoUrl: null,
  },
  {
    id: 'insp-003',
    date: 'March 15, 2026',
    type: 'delivery_verify',
    inspector: 'Pierre T.',
    rating: 4,
    status: 'completed',
    findings: { delivery: 5, condition: 4, documentation: 4 },
    videoUrl: null,
  },
]

const mockNotifications = [
  {
    id: 'notif-001',
    type: 'inspection_scheduled',
    title: 'Next Verification Scheduled',
    message: "Our inspector will visit between May 28 - June 3. No advance notice will be given — just be ready.",
    time: '2 days ago',
    read: false,
  },
  {
    id: 'notif-002',
    type: 'badge_updated',
    title: 'Badge Upgraded',
    message: 'Your business is now Verified status. Great work maintaining quality standards.',
    time: '1 week ago',
    read: true,
  },
]

export default function BusinessDashboard() {
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState(mockBusiness)
  const [inspections, setInspections] = useState(mockInspections)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotif, setShowNotif] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const tierInfo = tiers[business.tier as keyof typeof tiers]
  const unreadCount = notifications.filter(n => !n.read).length

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'verified': return 'from-blue-600 to-blue-400'
      case 'growth': return 'from-green-600 to-green-400'
      case 'anchor': return 'from-purple-600 to-purple-400'
      default: return 'from-gray-600 to-gray-400'
    }
  }

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl font-bold text-green-400">Loading dashboard...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold mb-2">Business Dashboard</h2>
          <p className="text-gray-400 mb-6">Sign in to manage your business profile</p>
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
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">🏪</span>
                <div>
                  <h1 className="text-3xl font-black">{business.name}</h1>
                  <p className="text-gray-400">{business.city} · {business.sector.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getBadgeColor(business.badge)} text-white font-bold text-sm flex items-center gap-2`}>
              <span>✓</span>
              <span>KONBIT {tierInfo.name.toUpperCase()}</span>
            </div>
          </div>

          {/* Notification Bell */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-3 bg-white/5 rounded-xl hover:bg-white/10 transition"
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notifications Dropdown */}
          {showNotif && (
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 mb-6 max-w-md ml-auto">
              <h3 className="font-bold mb-3">Notifications</h3>
              {notifications.map(notif => (
                <div key={notif.id} className={`p-3 rounded-xl mb-2 ${notif.read ? 'bg-white/5' : 'bg-green-900/20 border border-green-500/30'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{notif.title}</span>
                    {!notif.read && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                  </div>
                  <p className="text-gray-400 text-xs">{notif.message}</p>
                  <span className="text-gray-500 text-xs">{notif.time}</span>
                </div>
              ))}
            </div>
          )}

          {/* Next Inspection Banner */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-950/50 border border-green-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-green-400 text-sm font-medium mb-1">NEXT VERIFICATION</div>
                <div className="text-2xl font-black mb-1">{business.nextInspection}</div>
                <p className="text-gray-400 text-sm">
                  Window: {business.windowStart} — {business.windowEnd}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl">🔍</div>
                <p className="text-gray-400 text-xs mt-1">Unannounced visit</p>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              ℹ️ No advance notice will be given. Our inspector may arrive any time during the window.
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-green-400">{business.totalInspections}</div>
              <div className="text-gray-400 text-sm">Total Inspections</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-green-400">{business.streak}🔥</div>
              <div className="text-gray-400 text-sm">Inspection Streak</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-yellow-400">{business.avgRating}</div>
              <div className="text-gray-400 text-sm">Avg Rating {getRatingStars(Math.round(business.avgRating))}</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-blue-400">{tierInfo.inspections}</div>
              <div className="text-gray-400 text-sm">Inspections/mo</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'inspections', label: '🔍 Inspection History' },
              { id: 'profile', label: '👤 Business Profile' },
              { id: 'settings', label: '⚙️ Settings' },
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
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Verification Status */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Verification Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <div className="font-medium">Current Tier</div>
                      <div className="text-gray-400 text-sm">{business.tier.charAt(0).toUpperCase() + business.tier.slice(1)}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getBadgeColor(business.badge)} text-white text-sm font-bold`}>
                      {tierInfo.name}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <div className="font-medium">Last Verified</div>
                      <div className="text-gray-400 text-sm">{business.lastVerified}</div>
                    </div>
                    <div className="text-green-400 text-sm">✓ Complete</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <div className="font-medium">Next Visit</div>
                      <div className="text-gray-400 text-sm">{business.windowStart} — {business.windowEnd}</div>
                    </div>
                    <div className="text-yellow-400 text-sm">⏳ Pending</div>
                  </div>
                </div>
              </div>

              {/* Tier Upgrade */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Upgrade Your Plan</h3>
                <div className="space-y-3">
                  {[
                    { tier: 'verified', name: 'Verified', inspections: 1, price: '$29/mo', current: true },
                    { tier: 'growth', name: 'Growth', inspections: 2, price: '$99/mo', current: false },
                    { tier: 'anchor', name: 'Anchor', inspections: 4, price: '$299/mo', current: false },
                  ].map(t => (
                    <div key={t.tier} className={`p-4 rounded-xl border ${
                      t.current ? 'border-green-500/30 bg-green-900/10' : 'border-white/10 bg-white/5'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">{t.name}</div>
                          <div className="text-gray-400 text-sm">{t.inspections} inspection{t.inspections > 1 ? 's' : ''}/month</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-lg">{t.price}</div>
                          {t.current && <span className="text-green-400 text-xs">Current</span>}
                        </div>
                      </div>
                      {!t.current && (
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="mt-3 w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-sm transition"
                        >
                          Upgrade to {t.name}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inspections' && (
            <div className="space-y-4">
              {inspections.map(insp => (
                <div key={insp.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                        {insp.type === 'company_visit' ? '🏢' : '📦'}
                      </div>
                      <div>
                        <h3 className="font-bold">{insp.date}</h3>
                        <p className="text-gray-400 text-sm">🔍 {insp.inspector}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">{getRatingStars(insp.rating)}</div>
                      <div className="text-gray-500 text-xs">{insp.rating}/5 Rating</div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-3">KEY FINDINGS</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(insp.findings).map(([key, val]: [string, any]) => (
                        <div key={key} className="bg-white/5 rounded-lg p-2 text-center">
                          <div className="text-gray-400 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                          <div className="font-bold text-green-400">{val}/5</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Report approved · Video on file</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6">Public Business Profile</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Business Name</label>
                    <div className="font-medium text-lg">{business.name}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Sector</label>
                    <div className="font-medium">{business.sector.replace('_', ' ').toUpperCase()}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Location</label>
                    <div className="font-medium">{business.city}, Haiti</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Verification Badge</label>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r ${getBadgeColor(business.badge)} text-white text-sm font-bold mt-1`}>
                      ✓ KONBIT {tierInfo.name.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Last Inspection</label>
                    <div className="font-medium">{business.lastVerified}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Inspection Streak</label>
                    <div className="font-medium">{business.streak} consecutive ✓</div>
                  </div>
                </div>
              </div>
              <button className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition">
                ✏️ Edit Profile
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6">Account Settings</h3>
              <div className="space-y-6 max-w-md">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Business Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 focus:outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Phone (for notifications)</label>
                  <input
                    type="tel"
                    placeholder="+509 xxx xxxxx"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Notification Preferences</label>
                  <div className="space-y-2">
                    {['Inspection schedule updates', 'Report results', 'Badge changes'].map(opt => (
                      <label key={opt} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-green-500" />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition">
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Upgrade Your Plan</h2>
              <button onClick={() => setShowUpgradeModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6">
              {[
                { name: 'Growth', price: '$99/mo', inspections: 2, features: ['2 inspections/month', 'Featured placement', 'Full investor deck'] },
                { name: 'Anchor', price: '$299/mo', inspections: 4, features: ['4 inspections/month', 'Priority placement', 'Dedicated support'] },
              ].map(tier => (
                <div key={tier.name} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{tier.name}</h3>
                    <div className="font-black text-green-400 text-lg">{tier.price}</div>
                  </div>
                  <div className="text-gray-400 text-sm mb-3">{tier.inspections} inspections/month</div>
                  <div className="space-y-1 mb-4">
                    {tier.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-gray-300">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition">
                    Select {tier.name}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-500 text-sm">
              Payment integration coming soon. Your upgrade will be activated once billing is connected.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}