'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth'

type VerificationTier = 'none' | 'basic' | 'accredited' | 'institutional'
type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected'

interface VerificationState {
  tier: VerificationTier
  status: VerificationStatus
  submittedAt?: string
  approvedAt?: string
  documents?: string[]
}

export default function VerifyPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [verifyState, setVerifyState] = useState<VerificationState>({
    tier: 'none',
    status: 'none',
  })
  const [selectedTier, setSelectedTier] = useState<VerificationTier>('basic')
  const [agreements, setAgreements] = useState({
    accredited: false,
    risk: false,
    terms: false,
  })

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (!u) {
        router.push('/signin')
        return
      }
      setUser(u)
      setLoading(false)
    })
  }, [router])

  const handleSubmit = async () => {
    if (selectedTier === 'accredited' && !agreements.accredited) {
      alert('Please confirm your accredited investor status')
      return
    }
    if (!agreements.risk || !agreements.terms) {
      alert('Please agree to the required terms')
      return
    }

    setSubmitting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 2000))
    setVerifyState({
      tier: selectedTier,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      documents: [],
    })
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 text-xl">Loading...</div>
      </div>
    )
  }

  const tiers = [
    {
      id: 'basic' as VerificationTier,
      name: 'Basic KYC',
      description: 'Identity verification for standard accounts',
      requirements: ['Government ID', 'Selfie verification', 'Basic info'],
      processing: 'Instant to 24 hours',
      color: 'green',
    },
    {
      id: 'accredited' as VerificationTier,
      name: 'Accredited Investor',
      description: 'Unlocks investment opportunities for accredited investors only',
      requirements: ['Basic KYC', 'Income verification ($200K+ annually)', 'Net worth verification', 'Broker letter OR tax returns'],
      processing: '1-3 business days',
      color: 'blue',
    },
    {
      id: 'institutional' as VerificationTier,
      name: 'Institutional',
      description: 'For funds, family offices, and legal entities',
      requirements: ['Basic KYC', 'Entity verification', 'Accreditation proof', 'AML/KYC package', 'Legal opinion'],
      processing: '5-10 business days',
      color: 'purple',
    },
  ]

  const statusColors: Record<VerificationStatus, string> = {
    none: 'text-gray-400',
    pending: 'text-amber-400',
    approved: 'text-green-400',
    rejected: 'text-red-400',
  }

  const statusBgColors: Record<VerificationStatus, string> = {
    none: 'bg-gray-900/50 border-gray-700',
    pending: 'bg-amber-900/20 border-amber-500/30',
    approved: 'bg-green-900/20 border-green-500/30',
    rejected: 'bg-red-900/20 border-red-500/30',
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4">Investor Verification</h1>
            <p className="text-gray-400 text-lg">
              Complete verification to unlock investment opportunities on KONBIT
            </p>
          </div>

          {/* Current Status */}
          {verifyState.status !== 'none' && (
            <div className={`border rounded-2xl p-6 mb-8 ${statusBgColors[verifyState.status]}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Verification Status</div>
                  <div className={`text-2xl font-bold capitalize ${statusColors[verifyState.status]}`}>
                    {verifyState.status}
                  </div>
                  {verifyState.submittedAt && (
                    <div className="text-gray-500 text-sm mt-1">
                      Submitted {new Date(verifyState.submittedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="text-4xl">
                  {verifyState.status === 'pending' ? '⏳' : verifyState.status === 'approved' ? '✅' : '❌'}
                </div>
              </div>
            </div>
          )}

          {/* Tier Selection */}
          <h2 className="text-xl font-bold text-white mb-6">Select Verification Level</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`p-6 rounded-2xl border-2 text-left transition ${
                  selectedTier === tier.id
                    ? `border-${tier.color}-500 bg-${tier.color}-900/20`
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className={`text-lg font-bold mb-2 ${
                  selectedTier === tier.id ? `text-${tier.color}-400` : 'text-white'
                }`}>
                  {tier.name}
                </div>
                <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                <div className="text-gray-500 text-xs">
                  Processing: {tier.processing}
                </div>
              </button>
            ))}
          </div>

          {/* Requirements for Selected Tier */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-white mb-4">
              Requirements for {tiers.find((t) => t.id === selectedTier)?.name}
            </h3>
            <ul className="space-y-3">
              {tiers.find((t) => t.id === selectedTier)?.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5">☐</span>
                  <span className="text-gray-300">{req}</span>
                </li>
              ))}
            </ul>

            {/* Upload Area */}
            <div className="mt-6 p-6 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-green-500/30 transition cursor-pointer">
              <div className="text-3xl mb-2">📄</div>
              <div className="text-white font-medium mb-1">Upload Documents</div>
              <div className="text-gray-400 text-sm">
                Drag & drop or click to upload. PDF, JPG, PNG up to 10MB
              </div>
            </div>
          </div>

          {/* Agreements */}
          {selectedTier === 'accredited' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Accredited Investor Certification</h3>
              <p className="text-gray-400 text-sm mb-4">
                By checking the box below, I certify that I am an accredited investor as defined by
                the SEC under Regulation D, Rule 501(a), specifically:
              </p>
              <ul className="text-gray-300 text-sm space-y-2 mb-4">
                <li>• Income of $200,000+ per year (individual) or $300,000+ (joint)</li>
                <li>• Net worth of $1,000,000+ (individual) excluding primary residence</li>
                <li>• In good standing as a Series 7, 65, or 82 licensed professional</li>
              </ul>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.accredited}
                  onChange={(e) => setAgreements({ ...agreements, accredited: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-gray-600 bg-white/10 text-green-500 focus:ring-green-500"
                />
                <span className="text-gray-300 text-sm">
                  I certify that I meet the accredited investor definition and understand that
                  providing false information is a federal violation.
                </span>
              </label>
            </div>
          )}

          {/* Risk Disclosure */}
          <div className="bg-amber-900/10 border border-amber-500/30 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold text-amber-400 mb-4">⚠️ Investment Risk Disclosure</h3>
            <p className="text-gray-300 text-sm mb-4">
              All investments involve substantial risk, including potential loss of principal.
              Haitian business investments may be particularly volatile due to:
            </p>
            <ul className="text-gray-400 text-sm space-y-1 mb-4">
              <li>• Currency fluctuations</li>
              <li>• Political and economic instability</li>
              <li>• Limited liquidity</li>
              <li>• Regulatory changes</li>
            </ul>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreements.risk}
                onChange={(e) => setAgreements({ ...agreements, risk: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-gray-600 bg-white/10 text-green-500 focus:ring-green-500"
              />
              <span className="text-gray-300 text-sm">
                I understand and accept the investment risks involved.
              </span>
            </label>
          </div>

          {/* Terms Agreement */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreements.terms}
                onChange={(e) => setAgreements({ ...agreements, terms: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-gray-600 bg-white/10 text-green-500 focus:ring-green-500"
              />
              <span className="text-gray-300 text-sm">
                I agree to KONBIT's{' '}
                <a href="/terms" className="text-green-400 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-green-400 hover:underline">Privacy Policy</a>
                , and consent to the processing of my personal information for verification purposes.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting || (selectedTier === 'accredited' && !agreements.accredited)}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-black transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Verification'}
          </button>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-medium mb-2">Why do I need verification?</h3>
                <p className="text-gray-400 text-sm">
                  Securities regulations require investor verification for certain investment products.
                  Verification helps us ensure compliance and protect both investors and businesses.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-medium mb-2">Is my information secure?</h3>
                <p className="text-gray-400 text-sm">
                  Yes. We use bank-level encryption and never sell your personal information.
                  Documents are stored securely and only accessed by our compliance team.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-medium mb-2">How long does verification take?</h3>
                <p className="text-gray-400 text-sm">
                  Basic KYC is typically instant or within 24 hours. Accredited and institutional
                  verification may take 1-10 business days depending on the tier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}