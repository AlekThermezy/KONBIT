'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SlideSidebar from '@/components/layout/SlideSidebar'

import Link from 'next/link'

const pillars = [
  {
    id: 'grow',
    title: 'GROW',
    subtitle: 'Invest in Haitian Business',
    icon: '📈',
    color: 'green',
    description: 'Put your capital to work in real Haitian businesses. From vacation rentals in Jacmel to recording studios in Port-au-Prince, invest in vetted opportunities and earn revenue shares.',
    features: [
      'Browse vetted investment campaigns',
      'Purchase revenue-sharing tokens',
      'Track returns on your dashboard',
      'Auto-distributed earnings monthly'
    ]
  },
  {
    id: 'learn',
    title: 'LEARN',
    subtitle: 'Learn from Haitian Experts',
    icon: '🎓',
    color: 'blue',
    description: 'Access courses taught by Haitian professionals from around the world. AI-powered tools like smart flashcards and spaced repetition help you actually remember what you learn.',
    features: [
      'Courses in Haitian Creole, business, tech, and more',
      'AI-generated flashcards for retention',
      'LinkedIn-verified certificates',
      'Study streaks and progress tracking'
    ]
  },
  {
    id: 'gift',
    title: 'GIFT',
    subtitle: 'Gift Knowledge to Haiti',
    icon: '🎁',
    color: 'purple',
    description: 'Sponsor someone\'s education and watch them grow. Whether it\'s a student in Hinche or a professional in the diaspora, you can gift courses and track their progress.',
    features: [
      'Gift any course to anyone',
      'Track recipient\'s progress',
      'Celebrate milestones together',
      'Build community through learning'
    ]
  },
  {
    id: 'trust',
    title: 'TRUST',
    subtitle: 'Verified by Inspectors',
    icon: '✅',
    color: 'amber',
    description: 'Every business on KONBIT is verified by our inspector network. Local inspectors visit locations, record video reports, and verify claims — so you know what you\'re investing in.',
    features: [
      'Video verification of every business',
      'On-the-ground inspector network',
      'Transparent on-chain records',
      'KYC-verified businesses'
    ]
  }
]

const problems = [
  {
    title: 'Diaspora Can\'t Invest',
    desc: 'Haitians in Miami, Montreal, Paris want to invest back home but don\'t know where to find opportunities or trust the claims.'
  },
  {
    title: 'Businesses Can\'t Access Capital',
    desc: 'Talented Haitian entrepreneurs have great ideas but can\'t get loans from traditional banks or investors.'
  },
  {
    title: 'Knowledge Stays Siloed',
    desc: 'Haitian professionals worldwide have knowledge to share but no platform to teach and earn from it.'
  },
  {
    title: 'No Trust Infrastructure',
    desc: 'Without verification, investors can\'t separate real opportunities from scams. Trust is the missing piece.'
  }
]

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <SlideSidebar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-6">
              Our Mission
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              <span className="text-green-500">Konekte.</span><br />
              <span className="text-white">T&#232;t ansanm.</span><br />
              <span className="text-amber-400">Pou nou vanse.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We believe the Haitian diaspora has the capital, knowledge, and passion to transform Haiti&apos;s economy. 
              KONBIT is the platform that makes it possible — connecting those who have with those who need.
            </p>
          </div>

          {/* Why KONBIT Exists */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why <span className="text-green-500">KONBIT</span> Exists
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Four problems we&apos;re solving for the Haitian community.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {problems.map((problem) => (
                <div key={problem.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="text-2xl mb-3">⚡</div>
                  <h3 className="text-lg font-bold mb-2 text-white">{problem.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The Solution - 4 Pillars */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our <span className="text-green-500">Solution</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Four pillars that make KONBIT work for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {pillars.map((pillar) => (
                <div 
                  key={pillar.id} 
                  className={`bg-gradient-to-br ${
                    pillar.color === 'green' ? 'from-green-900/30 to-green-950/20 border-green-500/30' :
                    pillar.color === 'blue' ? 'from-blue-900/30 to-blue-950/20 border-blue-500/30' :
                    pillar.color === 'purple' ? 'from-purple-900/30 to-purple-950/20 border-purple-500/30' :
                    'from-amber-900/30 to-amber-950/20 border-amber-500/30'
                  } border rounded-2xl p-8`}
                >
                  <div className="text-5xl mb-4">{pillar.icon}</div>
                  <div className={`text-sm font-bold mb-1 ${
                    pillar.color === 'green' ? 'text-green-400' :
                    pillar.color === 'blue' ? 'text-blue-400' :
                    pillar.color === 'purple' ? 'text-purple-400' :
                    'text-amber-400'
                  }`}>
                    {pillar.title}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{pillar.subtitle}</h3>
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">{pillar.description}</p>
                  <ul className="space-y-2">
                    {pillar.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                        <span className={
                          pillar.color === 'green' ? 'text-green-400' :
                          pillar.color === 'blue' ? 'text-blue-400' :
                          pillar.color === 'purple' ? 'text-purple-400' :
                          'text-amber-400'
                        }>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Who It's For */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Who <span className="text-green-500">KONBIT</span> Is For
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-lg font-bold mb-2">Diaspora Investors</h3>
                <p className="text-gray-400 text-sm">
                  Haitians in Miami, Montreal, Paris, or anywhere else who want to invest back home but need a trusted platform.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">🏪</div>
                <h3 className="text-lg font-bold mb-2">Haitian Businesses</h3>
                <p className="text-gray-400 text-sm">
                  Entrepreneurs in Port-au-Prince, Jacmel, or anywhere in Haiti who need capital to grow but can&apos;t access traditional funding.
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-bold mb-2">Learners & Teachers</h3>
                <p className="text-gray-400 text-sm">
                  Anyone who wants to learn from Haitian experts or teach their knowledge to the global Haitian community.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-green-900/30 to-green-950/50 border border-green-500/30 rounded-3xl p-10">
              <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-8">
                Whether you want to invest, learn, teach, or grow a business — there&apos;s a place for you on KONBIT.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/waitlist" 
                  className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg transition"
                >
                  Join the Waitlist
                </Link>
                <Link 
                  href="/growth" 
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl font-bold text-lg transition"
                >
                  Explore Growth
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}