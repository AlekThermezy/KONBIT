'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SlideSidebar from '@/components/layout/SlideSidebar'
import LeftSidebar from '@/components/layout/LeftSidebar'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const sectorEmojis: Record<string, string> = {
  real_estate: '🏠', music: '🎵', art: '🎨', food: '🍳',
  artisan: '🧵', tech: '💻', agriculture: '🌱', film: '🎬', tourism: '✈️',
}

export default function CampaignPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<any>(null)
  const [business, setBusiness] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [amount, setAmount] = useState('')
  const [investing, setInvesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [investedAmount, setInvestedAmount] = useState<number | null>(null)

  useEffect(() => {
    getCurrentUser().then(setUser)
    fetchCampaign()
  }, [])

  async function fetchCampaign() {
    if (!params.id) return
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
    } catch { setNotFound(true) }
    finally { setLoading(false) }
  }

  async function handleInvest() {
    if (!user) { router.push('/signin'); return }
    const amountNum = Number(amount)
    const minInvest = (campaign?.min_investment_cents || 2500) / 100
    if (!amountNum || amountNum < minInvest) { setError(`Minimum investment is $${minInvest}`); return }

    setInvesting(true)
    setError(null)

    const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const amountCents = Math.round(amountNum * 100)
    const tokenAmount = Math.floor(amountCents / (campaign?.token_price_cents || 1000))

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) { setError('Please sign in again.'); setInvesting(false); return }

      const insertRes = await fetch(`${SB_URL}/rest/v1/investments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SB_KEY,
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ user_id: user.id, campaign_id: campaign.id, amount_cents: amountCents, token_amount: tokenAmount }),
      })

      if (!insertRes.ok) {
        if (insertRes.status === 409) setError('You have already invested in this campaign.')
        else setError('Investment could not be processed.')
        setInvesting(false)
        return
      }

      await fetch(`${SB_URL}/rest/v1/campaigns?id=eq.${campaign.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY, 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({
          raised_cents: (campaign.raised_cents || 0) + amountCents,
          investor_count: (campaign.investor_count || 0) + 1,
          status: (campaign.raised_cents || 0) + amountCents >= campaign.raise_goal_cents ? 'funded' : 'live',
        }),
      })

      setInvestedAmount(amountNum)
      setSuccess(true)
      fetchCampaign()
    } catch { setError('Connection error. Please try again.') }
    finally { setInvesting(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-gray-400 animate-pulse">Loading...</div>
    </div>
  )

  if (notFound || !campaign) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Campaign Not Found</h1>
        <button onClick={() => router.push('/deals')} className="px-6 py-3 bg-green-600 rounded-xl font-medium text-black">
          Back to Growth
        </button>
      </div>
    </div>
  )

  const progress = Math.min((campaign.raised_cents / campaign.raise_goal_cents) * 100, 100)
  const tokensToBuy = Math.floor(parseInt(amount || '0') / ((campaign.token_price_cents || 1000) / 100))
  const potentialReturn = tokensToBuy * ((campaign.revenue_share_pct || 0) / 100)

  const sectorColors: Record<string, string> = {
    real_estate: 'from-green-600 to-green-400',
    music: 'from-purple-600 to-purple-400',
    art: 'from-pink-600 to-pink-400',
    food: 'from-amber-600 to-amber-400',
    artisan: 'from-orange-600 to-orange-400',
    tech: 'from-blue-600 to-blue-400',
  }

  const statusStyle = campaign.status === 'live'
    ? 'bg-green-900/50 text-green-400 border border-green-500/30'
    : campaign.status === 'funded'
    ? 'bg-blue-900/50 text-blue-400 border border-blue-500/30'
    : 'bg-gray-700 text-gray-300'

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <LeftSidebar />
      <SlideSidebar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.push('/deals')} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition">
            ← Back to Growth
          </button>

          <div className="flex items-start gap-6 mb-8">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${sectorColors[business?.sector] || 'from-green-600 to-green-400'} flex items-center justify-center text-3xl flex-shrink-0`}>
              {sectorEmojis[business?.sector] || '🌍'}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black">{campaign.title}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
                  {campaign.status === 'live' ? '● Live' : campaign.status === 'funded' ? '✓ Funded' : campaign.status}
                </span>
              </div>
              <p className="text-gray-400">
                {business?.name} • {[business?.city, business?.country].filter(Boolean).join(', ') || 'Haiti'}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Raised</span>
                  <span className="font-bold text-white">
                    ${(campaign.raised_cents / 100).toLocaleString()} / ${(campaign.raise_goal_cents / 100).toLocaleString()}
                  </span>
                </div>
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${sectorColors[business?.sector] || 'from-green-600 to-green-400'} rounded-full`} style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">{Math.round(progress)}% funded</span>
                  <span className="text-gray-500">{campaign.ends_at ? `Ends ${new Date(campaign.ends_at).toLocaleDateString()}` : ''}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">About This Opportunity</h2>
                <p className="text-gray-300 leading-relaxed">{campaign.description || 'No description available.'}</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Campaign Details</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Token', campaign.token_name],
                    ['Symbol', campaign.token_symbol],
                    ['Returns', campaign.token_type === 'revenue_share' ? `${campaign.revenue_share_pct}% revenue share` : campaign.token_type],
                    ['Min. Investment', `$${(campaign.min_investment_cents / 100).toLocaleString()}`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-300"><span className="text-gray-500 text-sm">{label}: </span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Business Profile</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    ['Est.', campaign.business?.established || '—'],
                    ['Backers', `${campaign.investor_count || 0}`],
                    ['Status', campaign.status],
                  ].map(([label, value]) => (
                    <div key={label} className="text-center p-4 bg-white/5 rounded-xl">
                      <div className="text-gray-500 text-sm mb-1">{label}</div>
                      <div className="text-white font-bold text-sm">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-4">Invest Now</h2>

                <div className="bg-black/50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Token Price</span>
                    <span className="text-white font-bold">${(campaign.token_price_cents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Token Name</span>
                    <span className="text-white text-sm">{campaign.token_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Symbol</span>
                    <span className="text-green-400 font-mono">{campaign.token_symbol}</span>
                  </div>
                </div>

                {success ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="text-xl font-bold text-white mb-2">Investment Confirmed!</h3>
                    <p className="text-gray-400 text-sm mb-4">${investedAmount} invested in {campaign.title}</p>
                    <button onClick={() => router.push('/dashboard')} className="w-full py-3 bg-green-600 rounded-xl font-bold text-black">
                      View Dashboard
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm text-gray-300 mb-2">Investment Amount (USD)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setError(null) }}
                          placeholder={`Min $${(campaign.min_investment_cents / 100)}`}
                          className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition" />
                      </div>
                    </div>

                    {tokensToBuy > 0 && (
                      <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Tokens</span>
                          <span className="text-green-400 font-bold">{tokensToBuy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Est. Return</span>
                          <span className="text-green-400 font-bold">${potentialReturn.toFixed(2)}/yr</span>
                        </div>
                      </div>
                    )}

                    {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                    <button onClick={handleInvest} disabled={investing || !amount}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-black transition-all disabled:opacity-50">
                      {investing ? 'Processing...' : user ? 'Invest Now' : 'Sign In to Invest'}
                    </button>

                    <p className="text-gray-500 text-xs text-center mt-4">
                      ${(campaign.min_investment_cents / 100)} min • {campaign.revenue_share_pct || campaign.equity_pct}% returns
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
