'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'

export default function InvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inviteData, setInviteData] = useState<any>(null)

  useEffect(() => {
    const referralCode = searchParams.get('code') || searchParams.get('ref')

    if (!referralCode) {
      setError('Invalid invite link')
      setLoading(false)
      return
    }

    // Look up the invite
    supabase
      .from('invites')
      .select('*, inviter:inviter_id(name)')
      .eq('referral_code', referralCode)
      .eq('status', 'pending')
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError('This invite link is invalid or has expired')
          setLoading(false)
          return
        }

        setInviteData(data)
        setLoading(false)
      })
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 text-xl">Loading invite...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-black text-white mb-4">Invite Not Found</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 rounded-xl text-lg font-bold text-black hover:from-green-500 hover:to-green-400 transition"
          >
            Join KONBIT Instead
          </Link>
        </div>
      </div>
    )
  }

  const inviterName = inviteData?.inviter?.name || 'A friend'

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Header */}
          <div className="mb-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-4xl">
              🎉
            </div>
            <h1 className="text-4xl font-black mb-4">You're Invited!</h1>
            <p className="text-xl text-gray-400">
              <span className="text-green-500">{inviterName}</span> wants you to join KONBIT
            </p>
          </div>

          {/* What is KONBIT */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 text-left">
            <h2 className="text-xl font-bold text-white mb-4 text-center">What is KONBIT?</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-xl">
                <div className="text-2xl mb-2">📈</div>
                <div className="font-bold text-white mb-1">Invest</div>
                <div className="text-gray-400 text-sm">Invest in Haitian businesses across Real Estate, Music, Art & Food</div>
              </div>
              <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl">
                <div className="text-2xl mb-2">🎓</div>
                <div className="font-bold text-white mb-1">Learn</div>
                <div className="text-gray-400 text-sm">AI flashcards, smart resume, certificates and study streaks</div>
              </div>
              <div className="p-4 bg-amber-900/20 border border-amber-500/20 rounded-xl">
                <div className="text-2xl mb-2">💰</div>
                <div className="font-bold text-white mb-1">Earn</div>
                <div className="text-gray-400 text-sm">Quick deals with profit returns and batch investments</div>
              </div>
              <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl">
                <div className="text-2xl mb-2">🌿</div>
                <div className="font-bold text-white mb-1">Grow</div>
                <div className="text-gray-400 text-sm">Environmental initiatives and sustainable projects</div>
              </div>
            </div>
          </div>

          {/* Referral Benefit */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-950/50 border border-green-500/20 rounded-2xl p-6 mb-8">
            <div className="text-green-500 font-bold mb-2">Your friend used a referral link!</div>
            <div className="text-white text-lg">
              Join now and you may get special benefits when you invest.
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl text-lg font-bold text-black transition-all shadow-lg shadow-green-500/25"
            >
              Create Free Account
            </Link>
            <Link
              href="/signin"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-lg font-medium text-white transition"
            >
              Already have account? Sign In
            </Link>
          </div>

          {/* Referral Code Display */}
          <div className="mt-10 p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-gray-400 text-sm mb-2">Referral Code</div>
            <code className="text-green-500 text-xl font-mono">{inviteData?.referral_code}</code>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}