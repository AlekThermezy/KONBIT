'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeftSidebar from '@/components/layout/LeftSidebar'

const tiers = [
  { tier: 1, name: 'Pioneer', range: 'First 25%', discount: 40, color: 'green', desc: 'Best price — you believe early' },
  { tier: 2, name: 'Growth', range: '25-50%', discount: 25, color: 'amber', desc: 'Campaign gaining momentum' },
  { tier: 3, name: 'Acceleration', range: '50-75%', discount: 15, color: 'orange', desc: 'Proven model — time to join' },
  { tier: 4, name: 'Final Push', range: 'Last 25%', discount: 10, color: 'red', desc: 'Limited spots remaining' },
]

const sampleCampaign = {
  id: 'kay-ix-prefab',
  business: 'Kay Ix Construction',
  sector: 'Real Estate',
  location: 'Jacmel, Haiti',
  status: 'live',
  product: 'Pre-fab Housing Kit (2-room)',
  description: 'Modern pre-fab housing kit made from locally sourced materials. Easy to assemble, hurricane-resistant, and built by Haitian craftspeople. Each kit includes all materials, hardware, and assembly guide.',
  retailPrice: 5000,
  productionCost: 2800,
  quantity: 50,
  quantitySold: 18,
  shipping: 450,
  deliveryTimeline: '3-4 months',
  images: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop'],
  businessStory: 'Kay Ix Construction has been building quality homes in Haiti for 15 years. This pre-fab line allows us to scale our operations and bring affordable housing to more families.',
  founder: 'Jean Marc Toussaint',
  launchedAt: '2026-05-01',
  endsAt: '2026-06-15',
}

export default function CampaignDetailPage() {
  const params = useParams()
  const [selectedTier, setSelectedTier] = useState<number>(1)
  const [quantity, setQuantity] = useState(1)
  const [backing, setBacking] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const campaign = sampleCampaign // In production: fetch from Supabase by params.id

  const selectedTierData = tiers.find(t => t.tier === selectedTier)!
  const discountedPrice = Math.round(campaign.retailPrice * (1 - selectedTierData.discount / 100))
  const totalPrice = (discountedPrice * quantity) + (campaign.shipping * quantity)

  // Calculate progress
  const progress = Math.round((campaign.quantitySold / campaign.quantity) * 100)
  const backersCount = Math.round(campaign.quantitySold * 0.7) // Estimate

  // Determine current tier based on progress
  const currentTier = progress < 25 ? 1 : progress < 50 ? 2 : progress < 75 ? 3 : 4

  const handleBack = () => {
    setBacking(true)
    setTimeout(() => {
      setBacking(false)
      setShowConfirm(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <LeftSidebar />

      <main className="pt-16 ml-64 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Link */}
          <Link href="/deals" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
            <span>←</span> Back to Deals
          </Link>

          {/* Campaign Header */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Image */}
            <div className="bg-gray-800 rounded-2xl aspect-video flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="text-6xl mb-2">🏠</div>
                <div className="text-gray-400">Product Image</div>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-xs font-bold">
                  LIVE
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-gray-400 text-xs">
                  {campaign.sector}
                </span>
              </div>

              <h1 className="text-3xl font-black mb-2">{campaign.product}</h1>
              <p className="text-gray-400 mb-4">by <span className="text-white">{campaign.business}</span> · {campaign.location}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{campaign.quantitySold} of {campaign.quantity} claimed</span>
                  <span className="text-green-400 font-bold">{progress}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Tier Indicator */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-sm">Current pricing tier</span>
                    <div className="text-white font-bold">Tier {currentTier} — {tiers.find(t => t.tier === currentTier)?.name}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-green-400 font-bold text-lg">{tiers.find(t => t.tier === currentTier)?.discount}% OFF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">About This Product</h2>
                <p className="text-gray-300 leading-relaxed">{campaign.description}</p>
              </div>

              {/* Business Story */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">About the Business</h2>
                <p className="text-gray-300 leading-relaxed mb-4">{campaign.businessStory}</p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center text-green-400 font-bold">
                    {campaign.founder.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{campaign.founder}</div>
                    <div className="text-gray-500 text-sm">Founder</div>
                  </div>
                </div>
              </div>

              {/* Campaign Timeline */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Campaign Timeline</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Launched</div>
                    <div className="text-white font-bold">{new Date(campaign.launchedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Ends</div>
                    <div className="text-white font-bold">{new Date(campaign.endsAt).toLocaleDateString()}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Est. Delivery</div>
                    <div className="text-white font-bold">{campaign.deliveryTimeline}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-gray-400 text-sm mb-1">Backers</div>
                    <div className="text-white font-bold">{backersCount}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Back This Project */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-green-500/30 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">Back This Project</h3>

                {/* Tier Selection */}
                <div className="space-y-3 mb-6">
                  {tiers.map((t) => {
                    const price = Math.round(campaign.retailPrice * (1 - t.discount / 100))
                    const available = t.tier <= currentTier ? 'available' : 'upcoming'
                    return (
                      <button
                        key={t.tier}
                        onClick={() => setSelectedTier(t.tier)}
                        disabled={t.tier > currentTier}
                        className={`w-full p-4 rounded-xl border text-left transition ${
                          selectedTier === t.tier
                            ? 'border-green-500 bg-green-900/20'
                            : t.tier > currentTier
                            ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={`text-xs font-bold ${
                              t.color === 'green' ? 'text-green-400' :
                              t.color === 'amber' ? 'text-amber-400' :
                              t.color === 'orange' ? 'text-orange-400' :
                              'text-red-400'
                            }`}>TIER {t.tier}</span>
                            <div className="text-white font-bold">{t.name}</div>
                            <div className="text-gray-500 text-sm">{t.range}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black text-white">${price.toLocaleString()}</div>
                            <div className={`text-sm ${
                              t.discount >= 25 ? 'text-green-400' : 'text-gray-400'
                            }`}>{t.discount}% OFF</div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-white w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 bg-black/50 rounded-xl mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Unit price</span>
                    <span className="text-white">${discountedPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Quantity</span>
                    <span className="text-white">×{quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping (each)</span>
                    <span className="text-white">${campaign.shipping}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-green-400 font-bold text-xl">${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Back Button */}
                <button
                  onClick={handleBack}
                  disabled={backing}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-bold text-lg text-black transition-all disabled:opacity-50"
                >
                  {backing ? 'Processing...' : 'Back This Project →'}
                </button>

                <p className="text-gray-500 text-xs text-center mt-3">
                  You won't be charged until campaign succeeds
                </p>
              </div>

              {/* Share */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-white font-bold mb-3">Share this project</div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition">Twitter</button>
                  <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition">Facebook</button>
                  <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition">Copy</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-black text-white mb-2">You're In!</h2>
              <p className="text-gray-400 mb-6">
                Your backing of {quantity}× {campaign.product} at <span className="text-green-400 font-bold">${discountedPrice.toLocaleString()}</span> each has been reserved. You'll be charged when the campaign reaches its goal.
              </p>
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${(discountedPrice * quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">${(campaign.shipping * quantity).toLocaleString()}</span>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="block w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-black transition text-center"
              >
                View Your Backings →
              </Link>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3 text-gray-400 hover:text-white mt-3 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}