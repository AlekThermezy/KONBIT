'use client'
import Navbar from '@/components/layout/Navbar'
import SlideSidebar from '@/components/layout/SlideSidebar'
import Footer from '@/components/layout/Footer'
import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const tiers: Record<string, { name: string; color: string; inspections: number; price: string }> = {
  free: { name: 'Free', color: 'gray', inspections: 0, price: '$0/mo' },
  verified: { name: 'Verified', color: 'blue', inspections: 1, price: '$29/mo' },
  growth: { name: 'Growth', color: 'green', inspections: 2, price: '$99/mo' },
  anchor: { name: 'Anchor', color: 'purple', inspections: 4, price: '$299/mo' },
}

// ── Mock data kept as fallback ──────────────────────────────────────────────
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
    videoUrl: null as string | null,
  },
  {
    id: 'insp-002',
    date: 'April 20, 2026',
    type: 'company_visit',
    inspector: 'Marie L.',
    rating: 5,
    status: 'completed',
    findings: { workers: 5, materials: 5, cleanliness: 4, safety: 5 },
    videoUrl: null as string | null,
  },
  {
    id: 'insp-003',
    date: 'March 15, 2026',
    type: 'delivery_verify',
    inspector: 'Pierre T.',
    rating: 4,
    status: 'completed',
    findings: { delivery: 5, condition: 4, documentation: 4 },
    videoUrl: null as string | null,
  },
]

const mockNotifications = [
  {
    id: 'notif-001',
    type: 'inspection_scheduled',
    title: 'Next Verification Scheduled',
    message:
      "Our inspector will visit between May 28 – June 3. No advance notice will be given — just be ready.",
    time: '2 days ago',
    read: false,
  },
  {
    id: 'notif-002',
    type: 'badge_updated',
    title: 'Badge Upgraded',
    message:
      'Your business is now Verified status. Great work maintaining quality standards.',
    time: '1 week ago',
    read: true,
  },
]

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** e.g. 2026-06-02T12:00:00Z → "2 hours ago" */
function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function getBadgeColor(level: string): string {
  switch (level) {
    case 'verified':
    case 'verified':
      return 'from-blue-600 to-blue-400'
    case 'growth':
      return 'from-green-600 to-green-400'
    case 'anchor':
      return 'from-purple-600 to-purple-400'
    default:
      return 'from-gray-600 to-gray-400'
  }
}

function getRatingStars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

// ── Loading skeleton ────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <SlideSidebar />
      <main className="pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto animate-pulse space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/5" />
              <div className="space-y-2">
                <div className="h-8 w-64 rounded-lg bg-white/5" />
                <div className="h-4 w-40 rounded-lg bg-white/5" />
              </div>
            </div>
            <div className="h-10 w-32 rounded-xl bg-white/5" />
          </div>
          {/* Next inspection banner */}
          <div className="h-32 rounded-2xl bg-white/5" />
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-white/5" />
            ))}
          </div>
          {/* Tabs */}
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-28 rounded-xl bg-white/5" />
            ))}
          </div>
          {/* Content cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 rounded-2xl bg-white/5" />
            <div className="h-64 rounded-2xl bg-white/5" />
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Onboarding state ────────────────────────────────────────────────────────

function OnboardingState({ onReturn }: { onReturn: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <SlideSidebar />
      <main className="pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">🏪</div>
          <h1 className="text-3xl font-black mb-4">Set Up Your Business</h1>
          <p className="text-gray-400 mb-2 max-w-md mx-auto">
            You haven't created a business profile yet. Get verified, build trust,
            and unlock access to the KONBIT marketplace.
          </p>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Once you're onboarded, our community inspectors will verify your
            operations and award you a trust badge.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard/onboard"
              className="px-8 py-3.5 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition text-center"
            >
              🚀 Set Up Your Business
            </a>
            <button
              onClick={onReturn}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Benefits teasers */}
          <div className="grid sm:grid-cols-3 gap-4 mt-12 text-left">
            {[
              { emoji: '🔍', title: 'Get Verified', desc: 'Earn a trust badge through community inspections.' },
              { emoji: '📈', title: 'Attract Investors', desc: 'Verified businesses rank higher in the marketplace.' },
              { emoji: '🌍', title: 'Go Global', desc: 'Get discovered by diaspora investors worldwide.' },
            ].map((b) => (
              <div
                key={b.title}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center sm:text-left"
              >
                <div className="text-2xl mb-2">{b.emoji}</div>
                <div className="font-bold text-sm mb-1">{b.title}</div>
                <div className="text-gray-400 text-xs">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Data types ──────────────────────────────────────────────────────────────

interface BusinessData {
  id: string
  name: string
  sector: string
  city: string
  tier: string
  badge: string
  lastVerified: string
  nextInspection: string
  windowStart: string
  windowEnd: string
  totalInspections: number
  streak: number
  avgRating: number
}

interface InspectionData {
  id: string
  date: string
  type: string
  inspector: string
  rating: number
  status: string
  findings: Record<string, any>
  videoUrl: string | null
}

interface NotificationData {
  id: string
  type: string
  title: string
  message: string
  time: string
  read: boolean
}

// ── Main component ──────────────────────────────────────────────────────────

export default function BusinessDashboard() {
  const [user, setUser] = useState<any>(null)
  const [business, setBusiness] = useState<BusinessData | null>(null)
  const [inspections, setInspections] = useState<InspectionData[]>([])
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotif, setShowNotif] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [noBusiness, setNoBusiness] = useState(false)
  /** user explicitly dismissed onboarding to view mock data */
  const [dismissedOnboarding, setDismissedOnboarding] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      const u = await getCurrentUser()
      if (cancelled) return
      setUser(u)
      if (!u) {
        setLoading(false)
        return
      }

      // 1. Fetch business
      const { data: biz, error: bizError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', u.id)
        .maybeSingle()

      if (cancelled) return

      if (bizError) {
        // Real error — fall back to mock entirely
        console.warn('Error fetching business, falling back to mock:', bizError.message)
        setBusiness(mockBusiness)
        setInspections(mockInspections)
        setNotifications(mockNotifications)
        setLoading(false)
        return
      }

      if (!biz) {
        // No business yet
        setNoBusiness(true)
        setLoading(false)
        return
      }

      // 2. Build business data from the record
      const businessData: BusinessData = {
        ...mockBusiness,
        id: biz.id,
        name: biz.name ?? mockBusiness.name,
        sector: biz.sector ?? mockBusiness.sector,
        city: biz.city ?? mockBusiness.city,
      }

      // 3. Fetch verification schedule (tier + next inspection)
      try {
        const { data: schedule, error: schedErr } = await supabase
          .from('verification_schedules')
          .select('*')
          .eq('business_id', biz.id)
          .maybeSingle()

        if (!cancelled && !schedErr && schedule) {
          businessData.tier = schedule.tier ?? 'free'
          if (schedule.last_inspection_at) {
            businessData.lastVerified = formatDate(schedule.last_inspection_at)
          }
          if (schedule.next_inspection_at) {
            businessData.nextInspection = formatDate(schedule.next_inspection_at)
            businessData.windowStart = formatDate(
              schedule.inspection_window_start ?? schedule.next_inspection_at
            )
            businessData.windowEnd = formatDate(
              schedule.inspection_window_end ?? schedule.next_inspection_at
            )
          }
        }
      } catch {
        // schedule table might not exist — keep mock values
      }

      // 4. Fetch badge (streak, rating, total inspections)
      try {
        const { data: badge, error: badgeErr } = await supabase
          .from('verification_badges')
          .select('*')
          .eq('business_id', biz.id)
          .maybeSingle()

        if (!cancelled && !badgeErr && badge) {
          businessData.badge = badge.badge_level !== 'none' ? badge.badge_level : 'free'
          businessData.totalInspections = badge.total_inspections ?? mockBusiness.totalInspections
          businessData.streak = badge.inspection_streak ?? mockBusiness.streak
          businessData.avgRating = Number(badge.avg_rating) || mockBusiness.avgRating
          if (badge.last_verified_at) {
            businessData.lastVerified = formatDate(badge.last_verified_at)
          }
        }
      } catch {
        // badge table might not exist
      }

      if (cancelled) return
      setBusiness(businessData)

      // 5. Fetch notifications
      try {
        const { data: notifs, error: notifErr } = await supabase
          .from('business_notifications')
          .select('*')
          .eq('business_id', biz.id)
          .order('created_at', { ascending: false })

        if (!cancelled && !notifErr && notifs && notifs.length > 0) {
          setNotifications(
            notifs.map((n: any) => ({
              id: n.id,
              type: n.notification_type ?? 'general',
              title: n.title ?? 'Notification',
              message: n.message ?? '',
              time: formatTimeAgo(n.created_at),
              read: !!n.read_at,
            }))
          )
        } else if (!cancelled) {
          setNotifications(mockNotifications)
        }
      } catch {
        if (!cancelled) setNotifications(mockNotifications)
      }

      // 6. Fetch inspections (jobs → assignments → reports → inspectors)
      try {
        const { data: jobs } = await supabase
          .from('inspection_jobs')
          .select('id, job_type, status')
          .eq('business_id', biz.id)

        if (cancelled) return

        if (jobs && jobs.length > 0) {
          const jobIds = jobs.map((j: any) => j.id)
          const jobMap = new Map(jobs.map((j: any) => [j.id, j]))

          const { data: assignments } = await supabase
            .from('inspection_assignments')
            .select('id, job_id, inspector_id, completed_at, status')
            .in('job_id', jobIds)

          if (cancelled) return

          if (assignments && assignments.length > 0) {
            const assignmentIds = assignments.map((a: any) => a.id)
            const inspectorIds = Array.from(new Set(assignments.map((a: any) => a.inspector_id).filter(Boolean)))
            const assignmentMap = new Map(assignments.map((a: any) => [a.id, a]))

            const { data: reports } = await supabase
              .from('inspection_reports')
              .select('*')
              .in('assignment_id', assignmentIds)
              .order('created_at', { ascending: false })

            if (cancelled) return

            // Fetch inspector names
            let inspectorMap = new Map<string, string>()
            if (inspectorIds.length > 0) {
              const { data: inspectorRows } = await supabase
                .from('inspectors')
                .select('id, full_name')
                .in('id', inspectorIds)
              if (inspectorRows) {
                for (const ir of inspectorRows as any[]) {
                  inspectorMap.set(ir.id, ir.full_name ?? 'Inspector')
                }
              }
            }

            if (reports && reports.length > 0) {
              const mappedInspections: InspectionData[] = reports.map((r: any) => {
                const assignment = assignmentMap.get(r.assignment_id)
                const job = jobMap.get(assignment?.job_id)
                return {
                  id: r.id,
                  date: r.created_at ? formatDate(r.created_at) : 'Unknown date',
                  type: job?.job_type ?? 'company_visit',
                  inspector: inspectorMap.get(assignment?.inspector_id) ?? 'Inspector',
                  rating: r.rating ?? 0,
                  status: 'completed',
                  findings: typeof r.findings === 'object' && r.findings !== null ? r.findings : {},
                  videoUrl: r.video_url ?? null,
                }
              })

              if (!cancelled) {
                setInspections(mappedInspections)
              }
            } else if (!cancelled) {
              setInspections(mockInspections)
            }
          } else if (!cancelled) {
            setInspections(mockInspections)
          }
        } else if (!cancelled) {
          setInspections(mockInspections)
        }
      } catch {
        if (!cancelled) setInspections(mockInspections)
      }

      if (!cancelled) setLoading(false)
    }

    loadData()
    return () => {
      cancelled = true
    }
  }, [])

  // ── Early-return states ─────────────────────────────────────────────────

  if (loading) return <DashboardSkeleton />

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold mb-2">Business Dashboard</h2>
          <p className="text-gray-400 mb-6">Sign in to manage your business profile</p>
          <a href="/signin" className="px-6 py-3 bg-green-600 rounded-xl font-bold">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  if (noBusiness && !dismissedOnboarding) {
    return (
      <OnboardingState
        onReturn={() => {
          setDismissedOnboarding(true)
          setBusiness(mockBusiness)
          setInspections(mockInspections)
          setNotifications(mockNotifications)
        }}
      />
    )
  }

  // If onboarding dismissed but no real business, fallback to mock is already in state

  // ── Derived values ──────────────────────────────────────────────────────

  const b = business!
  const tierInfo = tiers[b.tier] ?? tiers.free
  const unreadCount = notifications.filter((n) => !n.read).length

  // ── Render ──────────────────────────────────────────────────────────────

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
                  <h1 className="text-3xl font-black">{b.name}</h1>
                  <p className="text-gray-400">
                    {b.city} · {b.sector.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div
              className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getBadgeColor(b.badge)} text-white font-bold text-sm flex items-center gap-2`}
            >
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
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-xl mb-2 ${
                    notif.read
                      ? 'bg-white/5'
                      : 'bg-green-900/20 border border-green-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{notif.title}</span>
                    {!notif.read && (
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
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
                <div className="text-green-400 text-sm font-medium mb-1">
                  NEXT VERIFICATION
                </div>
                <div className="text-2xl font-black mb-1">{b.nextInspection}</div>
                <p className="text-gray-400 text-sm">
                  Window: {b.windowStart} — {b.windowEnd}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl">🔍</div>
                <p className="text-gray-400 text-xs mt-1">Unannounced visit</p>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              ℹ️ No advance notice will be given. Our inspector may arrive any time
              during the window.
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-green-400">
                {b.totalInspections}
              </div>
              <div className="text-gray-400 text-sm">Total Inspections</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-green-400">
                {b.streak}🔥
              </div>
              <div className="text-gray-400 text-sm">Inspection Streak</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-yellow-400">
                {b.avgRating}
              </div>
              <div className="text-gray-400 text-sm">
                Avg Rating {getRatingStars(Math.round(b.avgRating))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-blue-400">
                {tierInfo.inspections}
              </div>
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
            ].map((tab) => (
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
                      <div className="text-gray-400 text-sm">
                        {b.tier.charAt(0).toUpperCase() + b.tier.slice(1)}
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getBadgeColor(b.badge)} text-white text-sm font-bold`}
                    >
                      {tierInfo.name}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <div className="font-medium">Last Verified</div>
                      <div className="text-gray-400 text-sm">{b.lastVerified}</div>
                    </div>
                    <div className="text-green-400 text-sm">✓ Complete</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <div className="font-medium">Next Visit</div>
                      <div className="text-gray-400 text-sm">
                        {b.windowStart} — {b.windowEnd}
                      </div>
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
                    {
                      tier: 'verified',
                      name: 'Verified',
                      inspections: 1,
                      price: '$29/mo',
                      current: true,
                    },
                    {
                      tier: 'growth',
                      name: 'Growth',
                      inspections: 2,
                      price: '$99/mo',
                      current: false,
                    },
                    {
                      tier: 'anchor',
                      name: 'Anchor',
                      inspections: 4,
                      price: '$299/mo',
                      current: false,
                    },
                  ].map((t) => (
                    <div
                      key={t.tier}
                      className={`p-4 rounded-xl border ${
                        t.current
                          ? 'border-green-500/30 bg-green-900/10'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">{t.name}</div>
                          <div className="text-gray-400 text-sm">
                            {t.inspections} inspection
                            {t.inspections > 1 ? 's' : ''}/month
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-lg">{t.price}</div>
                          {t.current && (
                            <span className="text-green-400 text-xs">Current</span>
                          )}
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
              {inspections.length === 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="font-bold text-lg mb-1">No inspections yet</h3>
                  <p className="text-gray-400 text-sm">
                    Your first verification visit will appear here once completed.
                  </p>
                </div>
              )}
              {inspections.map((insp) => (
                <div
                  key={insp.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5"
                >
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
                      <div className="text-yellow-400 font-bold">
                        {getRatingStars(insp.rating)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {insp.rating}/5 Rating
                      </div>
                    </div>
                  </div>

                  {Object.keys(insp.findings).length > 0 && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-xs text-gray-500 mb-3">KEY FINDINGS</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(insp.findings).map(([key, val]) => (
                          <div
                            key={key}
                            className="bg-white/5 rounded-lg p-2 text-center"
                          >
                            <div className="text-gray-400 text-xs capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </div>
                            <div className="font-bold text-green-400">
                              {val}
                              {typeof val === 'number' ? '/5' : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                    <div className="font-medium text-lg">{b.name}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Sector</label>
                    <div className="font-medium">
                      {b.sector.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Location</label>
                    <div className="font-medium">{b.city}, Haiti</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">
                      Verification Badge
                    </label>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r ${getBadgeColor(b.badge)} text-white text-sm font-bold mt-1`}
                    >
                      ✓ KONBIT {tierInfo.name.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Last Inspection</label>
                    <div className="font-medium">{b.lastVerified}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Inspection Streak</label>
                    <div className="font-medium">
                      {b.streak} consecutive ✓
                    </div>
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
                  <label className="text-gray-400 text-sm mb-1 block">
                    Business Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 focus:outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Phone (for notifications)
                  </label>
                  <input
                    type="tel"
                    placeholder="+509 xxx xxxxx"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">
                    Notification Preferences
                  </label>
                  <div className="space-y-2">
                    {[
                      'Inspection schedule updates',
                      'Report results',
                      'Badge changes',
                    ].map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition"
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 accent-green-500"
                        />
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
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {[
                {
                  name: 'Growth',
                  price: '$99/mo',
                  inspections: 2,
                  features: [
                    '2 inspections/month',
                    'Featured placement',
                    'Full investor deck',
                  ],
                },
                {
                  name: 'Anchor',
                  price: '$299/mo',
                  inspections: 4,
                  features: [
                    '4 inspections/month',
                    'Priority placement',
                    'Dedicated support',
                  ],
                },
              ].map((tier) => (
                <div
                  key={tier.name}
                  className="bg-white/5 border border-white/10 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">{tier.name}</h3>
                    <div className="font-black text-green-400 text-lg">
                      {tier.price}
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm mb-3">
                    {tier.inspections} inspections/month
                  </div>
                  <div className="space-y-1 mb-4">
                    {tier.features.map((f) => (
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
              Payment integration coming soon. Your upgrade will be activated once
              billing is connected.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
