'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeftSidebar from '@/components/layout/LeftSidebar'
import { getCurrentUser } from '@/lib/auth'
import { createInvite, getUserInvites, getInviteLink, getShareText, Invite } from '@/lib/referral'

interface InviteFormProps {
  onSuccess: () => void
}

function InviteForm({ onSuccess }: InviteFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const result = await createInvite(user.id, email, name || undefined)
      if (result) {
        setEmail('')
        setName('')
        onSuccess()
      } else {
        setError('Failed to send invite. Please try again.')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Friend's Name (optional)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition"
          placeholder="Marie Charles"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Friend's Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition"
          placeholder="marie@example.com"
        />
      </div>
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl text-sm font-bold text-black transition-all shadow-lg shadow-green-500/25 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Invite'}
      </button>
    </form>
  )
}

function InviteCard({ invite }: { invite: Invite }) {
  const isExpired = new Date(invite.expires_at) < new Date()
  const statusColors = {
    pending: 'text-amber-400 bg-amber-900/20 border-amber-500/30',
    accepted: 'text-green-400 bg-green-900/20 border-green-500/30',
    expired: 'text-gray-400 bg-gray-900/20 border-gray-500/30',
  }

  return (
    <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-white font-medium">{invite.invitee_name || invite.invitee_email}</div>
          <div className="text-gray-500 text-sm">{invite.invitee_email}</div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[invite.status]}`}>
          {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <code className="text-green-500 text-sm font-mono">{invite.referral_code}</code>
        <span className={`text-xs ${isExpired ? 'text-gray-500' : 'text-amber-400'}`}>
          {isExpired ? 'Expired' : `Expires ${new Date(invite.expires_at).toLocaleDateString()}`}
        </span>
      </div>
    </div>
  )
}

function ShareButtons({ referralCode }: { referralCode: string }) {
  const link = getInviteLink(referralCode)
  const text = getShareText(referralCode)

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: '🔗',
      action: () => navigator.clipboard.writeText(link),
      color: 'bg-white/5 hover:bg-white/10',
    },
    {
      name: 'Email',
      icon: '📧',
      action: () => window.open(`mailto:?subject=Join me on KONBIT&body=${encodeURIComponent(text)}`),
      color: 'bg-white/5 hover:bg-white/10',
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`),
      color: 'bg-green-900/30 hover:bg-green-900/50 border-green-500/30',
    },
    {
      name: 'Twitter',
      icon: '𝕏',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`),
      color: 'bg-white/5 hover:bg-white/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {shareOptions.map((option) => (
        <button
          key={option.name}
          onClick={option.action}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-sm font-medium text-gray-300 transition ${option.color}`}
        >
          <span>{option.icon}</span>
          {option.name}
        </button>
      ))}
    </div>
  )
}

export default function ReferPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [invites, setInvites] = useState<Invite[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (!u) {
        router.push('/signin')
        return
      }
      setUser(u)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [router])

  useEffect(() => {
    if (user) {
      getUserInvites(user.id)
        .then(setInvites)
        .catch(() => setInvites([]))
    }
  }, [user, refreshKey])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 text-xl">Loading...</div>
      </div>
    )
  }

  const referralCode = `KONBIT-${user?.id?.slice(0, 4).toUpperCase()}-${Date.now().toString(36)}`
  const inviteLink = `https://konbit.io/invite/${referralCode}`

  return (
    <div className="min-h-screen bg-black text-white">
      <LeftSidebar />
      <Navbar />

      {/* Hero Section with Background Image */}
      <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden ml-64">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/images/konbit-refer-solarpunk-horizon.png')"}} />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-[80px]" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 pt-24 pb-12">
          <div className="text-5xl mb-4">👥</div>
          <h1 className="text-4xl font-black mb-3 text-white">Grow the Community</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Share KONBIT with fellow Haitian professionals. Earn rewards for every verified member who joins.
          </p>
        </div>
      </div>

      <main className="pb-16 px-6 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Share Link Section */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-950/50 border border-green-500/20 rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Your Referral Link</h2>
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-green-400 font-mono text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(inviteLink)}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-bold text-black transition"
              >
                Copy
              </button>
            </div>

            <h3 className="text-sm font-medium text-gray-300 mb-3">Share via</h3>
            <ShareButtons referralCode={referralCode} />
          </div>


          {/* Invite Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">✉️</div>
              <h2 className="text-xl font-bold text-white">Send Email Invite</h2>
            </div>
            <InviteForm onSuccess={() => setRefreshKey((k) => k + 1)} />
          </div>

          {/* Invite History */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Your Referrals ({invites.length})</h2>
            {invites.length === 0 ? (
              <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-4xl mb-4">📬</div>
                <p className="text-gray-400">No invites sent yet</p>
                <p className="text-gray-500 text-sm mt-2">Send your first invite above!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {invites.map((invite) => (
                  <InviteCard key={invite.id} invite={invite} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}