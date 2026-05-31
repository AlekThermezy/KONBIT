'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeftSidebar from '@/components/layout/LeftSidebar'
import { getCurrentUser, supabase } from '@/lib/auth'

const sectorEmojis: Record<string, string> = {
  real_estate: '🏠', music: '🎵', art: '🎨', food: '🍳',
  artisan: '🧵', tech: '💻', agriculture: '🌱', film: '🎬', tourism: '✈️',
}

export default function CampaignDetailPage() {
  const params = useParams()
  const [campaign, setCampaign] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [investAmount, setInvestAmount] = useState('')
  const [investing, setInvesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [investedAmount, setInvestedAmount] = useState<number | null>(null)

  useEffect(() => {
    if (!params.id) return
    getCurrentUser().then(setUser)
    fetchCampaign()
  }, [params.id])

  async function fetchCampaign() {
    setLoading(true)
    const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/campaigns?id=eq.${params.id}&select=*,businesses(*)&limit=1`,
        { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
      )
      const data = await res.json()
      if (!data || data.length === 0) { setNotFound(true); setLoading(false); return }
      setCampaign(data[0])
      setBusiness(data[0].businesses)
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleInvest() {
    if (!user) {
      window.location.href = '/signin'
      return
    }
    const amountNum = Number(investAmount)
    const minInvest = (campaign.min_investment_cents || 2500) / 100
    if (!amountNum || amountNum < minInvest) {
      setError(`Minimum investment is $${minInvest}`)
      return
    }

    setInvesting(true)
    setError(null)

    const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const amountCents = Math.round(amountNum * 100)
    const tokenPriceCents = campaign.token_price_cents || 1000
    const tokenAmount = Math.floor(amountCents / tokenPriceCents)
    const campaignId = campaign.id

    try {
      // Get user session for auth
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError('Please sign in again to invest.')
        setInvesting(false)
        return
      }

      // Insert investment
      const insertRes = await fetch(`${SB_URL}/rest/v1/investments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SB_KEY,
          'Authorization': `Bearer ${session.access_token}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          user_id: user.id,
          campaign_id: campaignId,
          amount_cents: amountCents,
          token_amount: tokenAmount,
        }),
      })

      if (!insertRes.ok) {
        const errData = await insertRes.json()
        // Unique constraint violation = already invested
        if (insertRes.status === 409 || errData?.message?.includes('unique')) {
          setError('You have already invested in this campaign.')
        } else {
          setError('Investment could not be processed. Please try again.')
        }
        setInvesting(false)
        return
      }

      const investedData = await insertRes.json()

      // Update campaign raised amount + investor count
      const newRaisedCents = (campaign.raised_cents || 0) + amountCents
      const newInvestorCount = (campaign.investor_count || 0) + 1

      await fetch(`${SB_URL}/rest/v1/campaigns?id=eq.${campaignId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SB_KEY,
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          raised_cents: newRaisedCents,
          investor_count: newInvestorCount,
          status: newRaisedCents >= campaign.raise_goal_cents ? 'funded' : 'live',
        }),
      })

      setInvestedAmount(amountNum)
      setSuccess(true)

      // Refresh campaign data to show updated totals
      fetchCampaign()
    } catch (e) {
      setError('Connection error. Please try again.')
    } finally {
      setInvesting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-gray-400 animate-pulse">Loading campaign...</div>
    </div>
  )

  if (notFound || !campaign) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-white mb-2">Campaign not found</h2>
        <Link href="/deals" className="text-green-500 hover:underline">← Back to Deals</Link>
      </div>
    </div>
  )

  const pct = campaign.raise_goal_cents > 0
    ? Math.round((campaign.raised_cents / campaign.raise_goal_cents) * 100)
    : 0
  const daysLeft = campaign.ends_at
    ? Math.max(0, Math.ceil((new Date(campaign.ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null
  const returns = campaign.token_type === 'revenue_share' && campaign.revenue_share_pct
    ? `${campaign.revenue_share_pct}% revenue share`
    : campaign.token_type === 'equity' && campaign.equity_pct
    ? `${campaign.equity_pct}% equity`
    : campaign.token_name

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <LeftSidebar />

      <main className="pt-16 ml-64 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/deals" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
            ← Back to Deals
          </Link>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
              <span className="text-8xl">{sectorEmojis[business?.sector] || '🌍'}</span>
            </div>

            {/* Campaign Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full">
                  {business?.sector?.replace('_', ' ')}
                </span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  campaign.status === 'live' ? 'bg-green-900/30 text-green-400' :
                  campaign.status === 'funded' ? 'bg-blue-900/30 text-blue-400' :
                  'bg-white/10 text-gray-400'
                }`}>
                  {campaign.status}
                </span>
              </div>

              <h1 className="text-3xl font-black text-white mb-2">{campaign.title}</h1>
              <p className="text-gray-400 mb-4">by {business?.name || 'Unknown'}</p>
              <p className="text-gray-300 text-sm mb-6">{campaign.description || 'No description available.'}</p>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">
                    ${((campaign.raised_cents || 0) / 100).toLocaleString()} raised of ${((campaign.raise_goal_cents || 0) / 100).toLocaleString()}
                  </span>
                  <span className="text-green-400 font-black">{pct}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                    style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-black text-green-400">{(campaign.investor_count || 0)}</div>
                  <div className="text-gray-500 text-xs">Backers</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-black text-white">{daysLeft !== null ? `${daysLeft}d` : '—'}</div>
                  <div className="text-gray-500 text-xs">Days Left</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl font-black text-white">${((campaign.min_investment_cents || 2500) / 100).toLocaleString()}</div>
                  <div className="text-gray-500 text-xs">Min. Invest</div>
                </div>
              </div>

              {/* Returns */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-4">
                <div className="text-green-400 font-bold text-lg">{returns}</div>
                <div className="text-gray-400 text-sm">Token: {campaign.token_symbol}</div>
              </div>

              {/* Invest Form */}
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Investment amount (USD)</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={investAmount}
                    onChange={e => { setInvestAmount(e.target.value); setError(null) }}
                    placeholder={`Min $${(campaign.min_investment_cents || 2500) / 100}`}
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                  />
                  <button
                    onClick={handleInvest}
                    disabled={investing || !investAmount}
                    className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-xl font-bold text-black transition"
                  >
                    {investing ? 'Processing...' : user ? 'Invest →' : 'Sign In to Invest'}
                  </button>
                </div>
                {error && (
                  <p className="text-red-400 text-sm mt-2">{error}</p>
                )}
              </div>

              <p className="text-gray-600 text-xs">
                {campaign.token_name} • {campaign.revenue_share_pct || campaign.equity_pct}% returns • Backed on KONBIT
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-2">Investment Confirmed!</h3>
            <p className="text-gray-300 mb-2">
              You invested <span className="text-green-400 font-bold">${investedAmount}</span> in {campaign.title}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              {Math.floor((investedAmount! * 100) / (campaign.token_price_cents || 1000))} tokens added to your dashboard
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard" className="px-6 py-3 bg-green-600 rounded-xl font-bold text-black">
                My Dashboard
              </Link>
              <Link href="/deals" className="px-6 py-3 border border-white/20 rounded-xl font-bold text-white">
                ← Back to Deals
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
