'use client'
import Footer from '@/components/layout/Footer'

import { useState } from 'react'
import Link from 'next/link'

export default function LearnPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [streak, setStreak] = useState(7)
  const [coursesCompleted, setCoursesCompleted] = useState(3)

  const features = [
    {
      id: 'flashcards',
      title: 'AI Flashcards',
      icon: '🧠',
      description: 'Auto-generated flashcards with spaced repetition for maximum retention. Our AI analyzes course content to create smart cards that adapt to your learning pace.',
      benefits: ['Spaced repetition algorithm', 'AI-generated from course content', 'Progress tracking'],
      color: 'blue'
    },
    {
      id: 'resume',
      title: 'Smart Resume',
      icon: '📑',
      description: 'Pick up exactly where you left off — always. Smart Resume remembers your position across all courses and syncs instantly across devices.',
      benefits: ['Cross-device sync', 'Automatic position saving', 'Learning analytics'],
      color: 'blue'
    },
    {
      id: 'certificates',
      title: 'Certificates',
      icon: '🏆',
      description: 'Earn LinkedIn-verified credentials that prove your skills. Share your achievements with employers and the global Haitian community.',
      benefits: ['LinkedIn integration', 'Blockchain verification', 'Shareable digital badges'],
      color: 'blue'
    },
    {
      id: 'streaks',
      title: 'Study Streaks',
      icon: '🔥',
      description: 'Build habits, earn badges, and stay motivated. Study streaks gamify your learning journey and reward consistency.',
      benefits: ['Daily streak tracking', 'Achievement badges', 'Leaderboard rankings'],
      color: 'blue'
    },
    {
      id: 'gift',
      title: 'Gift & Track',
      icon: '🎁',
      description: 'Sponsor someone\'s learning journey and watch them grow. Track their progress, celebrate milestones together, build community.',
      benefits: ['Gift courses to others', 'Progress tracking dashboard', 'Milestone celebrations'],
      color: 'blue'
    },
    {
      id: 'paths',
      title: 'Learning Paths',
      icon: '🛤️',
      description: 'Multi-course journeys designed for specific careers. Follow curated paths from beginner to professional with structured milestones.',
      benefits: ['Career-focused curricula', 'Expert-designed paths', 'Industry certification prep'],
      color: 'blue'
    }
  ]

  const learningPaths = [
    {
      title: 'Haitian Creole Mastery',
      courses: 8,
      duration: '12 weeks',
      level: 'Beginner',
      description: 'From basic phrases to fluent conversations. Learn Haitian Creole from native speakers with cultural context built into every lesson.'
    },
    {
      title: 'Caribbean Business Essentials',
      courses: 6,
      duration: '8 weeks',
      level: 'Intermediate',
      description: 'Start and scale businesses in the Caribbean market. Learn about regulations, cultural nuances, and digital presence.'
    },
    {
      title: 'Digital Marketing Mastery',
      courses: 10,
      duration: '16 weeks',
      level: 'Advanced',
      description: 'Master social media, SEO, and e-commerce strategies tailored for Caribbean and diaspora audiences.'
    },
    {
      title: 'Tech Entrepreneurship',
      courses: 12,
      duration: '20 weeks',
      level: 'Advanced',
      description: 'Build tech startups from Haiti to Silicon Valley. Learn product development, funding, and scaling globally.'
    }
  ]

  const testimonials = [
    {
      name: 'Marie-Claire T.',
      role: 'Diaspora Professional',
      avatar: '👩🏾‍💼',
      text: 'Study streaks kept me accountable. I earned my Haitian Creole certificate in 3 months!'
    },
    {
      name: 'Jean-Pierre L.',
      role: 'Small Business Owner',
      avatar: '👨🏾‍💼',
      text: 'The Gift & Track feature let me sponsor my cousin\'s courses. Watching her progress from Montreal is amazing.'
    },
    {
      name: 'Sarah M.',
      role: 'Career Switcher',
      avatar: '👩🏻‍💼',
      text: 'AI Flashcards made learning Creole actually stick. Best language app I\'ve ever used.'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-6">
              🎓 KONBIT Learn
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Learn from <span className="text-blue-400">Haitian Experts</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Courses taught by professionals from Haiti and the diaspora. New-age smart learning features that actually help you succeed.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{streak}</div>
              <div className="text-gray-400 text-sm">Day Streak 🔥</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{coursesCompleted}</div>
              <div className="text-gray-400 text-sm">Courses Completed</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">24</div>
              <div className="text-gray-400 text-sm">Expert Instructors</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">150+</div>
              <div className="text-gray-400 text-sm">Course Hours</div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/waitlist"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-bold text-lg text-white transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Start Learning Free
            </Link>
            <Link
              href="#paths"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition"
            >
              Browse Learning Paths
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Smart Learning <span className="text-blue-400">Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our AI-powered tools make learning Haitian culture, language, and business easier than ever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                className={`bg-white/5 border border-white/10 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-500/50 ${
                  activeFeature === feature.id ? 'border-blue-500 bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
                
                {activeFeature === feature.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Key Benefits:</h4>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="text-blue-400">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section id="paths" className="py-24 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Learning <span className="text-blue-400">Paths</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Follow expert-designed journeys from beginner to professional. Each path builds on the last.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {learningPaths.map((path, index) => (
              <div
                key={path.title}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-blue-400 text-sm font-medium">Path {index + 1}</span>
                    <h3 className="text-xl font-bold mt-1">{path.title}</h3>
                  </div>
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">
                    {path.level}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-4">{path.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <span>📚</span>
                    <span>{path.courses} courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{path.duration}</span>
                  </div>
                </div>
                
                <button className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg font-medium transition">
                  View Path →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Learners <span className="text-blue-400">Say</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-sm">{testimonial.name}</div>
                  <div className="text-gray-500 text-xs">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-blue-950/30">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/10 border border-blue-500/30 rounded-2xl p-8 md:p-12 text-center">
            <div className="text-5xl mb-6">🎁</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gift Knowledge, Build Community
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto">
              Sponsor someone in Haiti (or anywhere) to take a course. They learn, you track their progress, and together we build stronger communities.
            </p>
            <Link
              href="/waitlist"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-bold text-lg text-white transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              Gift a Course Today
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your <span className="text-blue-400">Journey</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands learning from Haitian experts. Start free, learn at your own pace.
          </p>
          <Link
            href="/waitlist"
            className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-bold text-xl text-white transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            Join the Waitlist →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}