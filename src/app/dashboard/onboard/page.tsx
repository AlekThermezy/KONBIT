'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth'

type BusinessStep = 'info' | 'financials' | 'team' | 'review'
type BusinessSector = 'Real Estate' | 'Agriculture' | 'Music' | 'Film & Media' | 'Art' | 'Food' | 'Reforestation' | 'Tech' | 'Tourism' | 'Health' | 'Education' | 'Infrastructure' | 'Other'

const sectorOptions: BusinessSector[] = [
  'Real Estate', 'Agriculture', 'Music', 'Film & Media', 'Art', 'Food',
  'Reforestation', 'Tech', 'Tourism', 'Health', 'Education', 'Infrastructure', 'Other'
]

const businessSizeOptions = ['Just me (Sole Prop)', '2-5 employees', '6-15 employees', '16-50 employees', '50+ employees']
const fundingStageOptions = ['Pre-revenue', 'Early revenue (< 1 year)', 'Growing (1-3 years)', 'Established (3+ years)']
const useOfFundsOptions = [
  'Equipment & Inventory',
  'Hiring & Payroll',
  'Marketing & Growth',
  'Location / Expansion',
  'Technology Development',
  'Working Capital',
  'Debt Refinancing',
  'Other'
]

export default function BusinessOnboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<BusinessStep>('info')

  // Step 1: Basic Info
  const [businessName, setBusinessName] = useState('')
  const [businessSector, setBusinessSector] = useState<BusinessSector>('Food')
  const [businessDescription, setBusinessDescription] = useState('')
  const [businessLocation, setBusinessLocation] = useState('')
  const [businessSize, setBusinessSize] = useState('')
  const [fundingStage, setFundingStage] = useState('')
  const [website, setWebsite] = useState('')

  // Step 2: Financials
  const [fundingGoal, setFundingGoal] = useState('')
  const [minInvestment, setMinInvestment] = useState('25')
  const [targetReturns, setTargetReturns] = useState('')
  const [revenueShare, setRevenueShare] = useState('')
  const [useOfFunds, setUseOfFunds] = useState<string[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState('')

  // Step 3: Team
  const [founderName, setFounderName] = useState('')
  const [founderEmail, setFounderEmail] = useState('')
  const [founderPhone, setFounderPhone] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [founderBio, setFounderBio] = useState('')
  const [linkedin, setLinkedin] = useState('')

  // Step 4: Review & Docs
  const [documents, setDocuments] = useState<string[]>([])
  const [agreeTerms, setAgreeTerms] = useState(false)

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

  const steps: { id: BusinessStep; label: string }[] = [
    { id: 'info', label: 'Business Info' },
    { id: 'financials', label: 'Financials' },
    { id: 'team', label: 'Team' },
    { id: 'review', label: 'Review & Submit' },
  ]

  const handleSubmit = async () => {
    if (!agreeTerms) {
      alert('Please agree to the terms')
      return
    }
    setSubmitting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 2000))
    // In production: POST to Supabase businesses table
    setSubmitting(false)
    alert('Application submitted! We\'ll review within 48 hours and get back to you.')
    router.push('/dashboard')
  }

  const toggleUseOfFunds = (option: string) => {
    setUseOfFunds(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4">List Your Business</h1>
            <p className="text-gray-400 text-lg">
              Apply to raise capital on KONBIT. We review applications within 48 hours.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10" />
            <div className="absolute top-4 h-0.5 bg-green-500 transition-all" style={{ width: `${(steps.findIndex(s => s.id === currentStep) + 1) / steps.length * 100}%` }} />
            {steps.map((step, i) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  steps.findIndex(s => s.id === currentStep) >= i
                    ? 'bg-green-500 text-black'
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {i + 1}
                </div>
                <div className="text-xs text-gray-400 mt-2">{step.label}</div>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            
            {/* Step 1: Business Info */}
            {currentStep === 'info' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Business Information</h2>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Business Name *</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Haitian Brew Coffee Co."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Sector *</label>
                  <select
                    value={businessSector}
                    onChange={(e) => setBusinessSector(e.target.value as BusinessSector)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50 transition"
                  >
                    {sectorOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Location *</label>
                  <input
                    type="text"
                    value={businessLocation}
                    onChange={(e) => setBusinessLocation(e.target.value)}
                    placeholder="e.g. Port-au-Prince, Haiti"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Business Description *</label>
                  <textarea
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    placeholder="Tell us about your business — what you do, how you make money, what makes you unique..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Company Size</label>
                    <select
                      value={businessSize}
                      onChange={(e) => setBusinessSize(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50 transition"
                    >
                      <option value="">Select size</option>
                      {businessSizeOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Funding Stage</label>
                    <select
                      value={fundingStage}
                      onChange={(e) => setFundingStage(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50 transition"
                    >
                      <option value="">Select stage</option>
                      {fundingStageOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Website (optional)</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Financials */}
            {currentStep === 'financials' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Financial Details</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Funding Goal (USD) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        value={fundingGoal}
                        onChange={(e) => setFundingGoal(e.target.value)}
                        placeholder="50,000"
                        className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Minimum Investment (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        value={minInvestment}
                        onChange={(e) => setMinInvestment(e.target.value)}
                        placeholder="25"
                        className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Target Returns (%)</label>
                    <input
                      type="number"
                      value={targetReturns}
                      onChange={(e) => setTargetReturns(e.target.value)}
                      placeholder="12"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Revenue Share (%)</label>
                    <input
                      type="number"
                      value={revenueShare}
                      onChange={(e) => setRevenueShare(e.target.value)}
                      placeholder="8"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Monthly Revenue (USD) — Approximate</label>
                  <input
                    type="number"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(e.target.value)}
                    placeholder="10,000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Use of Funds *</label>
                  <p className="text-gray-500 text-sm mb-3">Select all that apply</p>
                  <div className="grid grid-cols-2 gap-3">
                    {useOfFundsOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => toggleUseOfFunds(option)}
                        className={`p-3 rounded-xl border text-left text-sm transition ${
                          useOfFunds.includes(option)
                            ? 'border-green-500 bg-green-900/20 text-green-400'
                            : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pool Pricing Preview */}
                <div className="p-6 bg-gradient-to-br from-green-900/20 to-green-950/50 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 mb-4">
                    <span>📊</span>
                    <span className="font-bold">Konbit Pool Pricing</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Your tokens will be priced in tiers — early investors get lower prices, creating momentum for your campaign.
                  </p>
                  <div className="bg-black/50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tier 1 (First 25%)</span>
                      <span className="text-green-400 font-mono">Base Price</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tier 2 (25-50%)</span>
                      <span className="text-amber-400 font-mono">+20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tier 3 (50-75%)</span>
                      <span className="text-orange-400 font-mono">+40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tier 4 (Final 25%)</span>
                      <span className="text-red-400 font-mono">+60%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Team */}
            {currentStep === 'team' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Founder Information</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      placeholder="Jean Pierre Toussaint"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      value={founderEmail}
                      onChange={(e) => setFounderEmail(e.target.value)}
                      placeholder="jean@company.ht"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Phone (WhatsApp)</label>
                    <input
                      type="tel"
                      value={founderPhone}
                      onChange={(e) => setFounderPhone(e.target.value)}
                      placeholder="+509 3700 0000"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">LinkedIn (optional)</label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="linkedin.com/in/..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Team Size</label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50 transition"
                  >
                    <option value="">Select team size</option>
                    <option value="1">Just me</option>
                    <option value="2-5">2-5 people</option>
                    <option value="6-10">6-10 people</option>
                    <option value="11-20">11-20 people</option>
                    <option value="20+">20+ people</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">About You *</label>
                  <textarea
                    value={founderBio}
                    onChange={(e) => setFounderBio(e.target.value)}
                    placeholder="Tell investors who you are — your background, why you started this business, and what success looks like to you..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 'review' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Review & Submit</h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Business Summary</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Name</span>
                      <div className="text-white font-medium">{businessName || '—'}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Sector</span>
                      <div className="text-white font-medium">{businessSector}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Location</span>
                      <div className="text-white font-medium">{businessLocation || '—'}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Funding Goal</span>
                      <div className="text-green-400 font-bold">${parseInt(fundingGoal || '0').toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Revenue Share</span>
                      <div className="text-white font-medium">{revenueShare || '—'}%</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Min Investment</span>
                      <div className="text-white font-medium">${minInvestment}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Documents</h3>
                  <p className="text-gray-400 text-sm">Upload documents to support your application</p>
                  
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-green-500/30 transition cursor-pointer">
                    <div className="text-3xl mb-2">📄</div>
                    <div className="text-white font-medium mb-1">Upload Documents</div>
                    <div className="text-gray-400 text-sm">
                      Business registration, financial statements, or any proof of operations
                    </div>
                    <div className="text-gray-500 text-xs mt-2">PDF, JPG, PNG up to 10MB each</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['Business Registration.pdf', 'Financials 2025.pdf'].map(doc => (
                      <div key={doc} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg text-sm">
                        <span>📎</span>
                        <span className="text-gray-300">{doc}</span>
                        <button className="text-gray-500 hover:text-red-400">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-amber-900/10 border border-amber-500/30 rounded-xl">
                  <h3 className="text-amber-400 font-bold mb-2">⚠️ What Happens Next</h3>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Our team reviews your application within 48 hours</li>
                    <li>• We may reach out for additional documents or clarification</li>
                    <li>• Once approved, you'll set up your campaign and launch on Konbit Pool</li>
                    <li>• You'll get access to investor analytics and dashboard tools</li>
                  </ul>
                </div>

                <label className="flex items-start gap-3 cursor-pointer p-4 bg-white/5 border border-white/10 rounded-xl">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-600 bg-white/10 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-gray-300 text-sm">
                    I certify that all information provided is accurate and I agree to KONBIT's{' '}
                    <a href="/terms" className="text-green-400 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-green-400 hover:underline">Business Listing Agreement</a>.
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep !== 'info' ? (
              <button
                onClick={() => {
                  const idx = steps.findIndex(s => s.id === currentStep)
                  setCurrentStep(steps[idx - 1].id)
                }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {currentStep !== 'review' ? (
              <button
                onClick={() => {
                  const idx = steps.findIndex(s => s.id === currentStep)
                  setCurrentStep(steps[idx + 1].id)
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-black transition"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-black transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}