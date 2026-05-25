'use client'

/**
 * RESOURCES PAGE — TODO/Future Features:
 * =======================================
 * - Video Translation Pipeline: download videos → translate to Kreyòl → AI avatar (Haitian voice/face) → class in Kreyòl
 *   This would enable: YouTube video lessons → Haitian Kreyòl dubbed courses
 *   Tech stack: yt-dlp → Whisper (transcribe) → OpenAI/LLaMA (translate to Kreyòl) → ElevenLabs (Kreyòl voice) → D-ID/Synthesia (avatar)
 *
 * CURRENT RESOURCES:
 * ==================
 * - Translator (AI-powered Haitian Kreyòl translation)
 * - Dictionary (Kreyòl word definitions & etymology)
 * - Law & Customs (Haitian legal framework, labor laws, business registration, property rights)
 * - Constitution (1987 Haitian Constitution summary and key articles)
 * - Business Guides ("How to start a business in Haiti", tax basics, etc.)
 * - Cultural Guides (holidays, etiquette, business culture)
 */

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SlideSidebar from '@/components/layout/SlideSidebar'

const resources = [
  {
    category: 'Tools',
    items: [
      {
        id: 'translator',
        title: 'AI Translator',
        desc: 'Translate between Haitian Kreyòl, French, and English. Powered by AI for accurate, context-aware translations.',
        icon: '🌍',
        href: '/translate',
        color: 'green',
        badge: 'Popular',
        badgeColor: 'green',
      },
      {
        id: 'dictionary',
        title: 'Kreyòl Dictionary',
        desc: 'Search thousands of Haitian Kreyòl words with definitions, pronunciation guides, and usage examples.',
        icon: '📖',
        href: '/dictionary',
        color: 'blue',
        badge: null,
        badgeColor: null,
      },
    ],
  },
  {
    category: 'Legal & Government',
    items: [
      {
        id: 'law',
        title: 'Law & Customs',
        desc: 'Haitian legal framework: labor laws, business registration (ONAPI), property rights, and contract basics.',
        icon: '⚖️',
        href: '/resources/law',
        color: 'purple',
        badge: 'Coming Soon',
        badgeColor: 'amber',
      },
      {
        id: 'constitution',
        title: 'Constitution',
        desc: 'Summary of the 1987 Haitian Constitution — key articles on citizenship, government structure, and rights.',
        icon: '📜',
        href: '/resources/constitution',
        color: 'amber',
        badge: 'Coming Soon',
        badgeColor: 'amber',
      },
    ],
  },
  {
    category: 'Business & Career',
    items: [
      {
        id: 'business-guides',
        title: 'Business Guides',
        desc: 'Step-by-step guides: how to start a business in Haiti, tax basics for SMEs, export procedures, and more.',
        icon: '💼',
        href: '/resources/business-guides',
        color: 'blue',
        badge: null,
        badgeColor: null,
      },
      {
        id: 'cultural-guides',
        title: 'Cultural Guides',
        desc: 'Navigate Haitian business culture — holidays, etiquette, communication styles, and relationship building.',
        icon: '🤝',
        href: '/resources/cultural-guides',
        color: 'green',
        badge: null,
        badgeColor: null,
      },
      {
        id: 'jobs-guides',
        title: 'Job & Career',
        desc: 'Career guides for diaspora professionals: credential recognition, job market insights, and interview tips.',
        icon: '🎯',
        href: '/resources/jobs-guides',
        color: 'red',
        badge: 'Coming Soon',
        badgeColor: 'amber',
      },
    ],
  },
  {
    category: 'Education & Community',
    items: [
      {
        id: 'learning',
        title: 'Learning Hub',
        desc: 'Courses on Haitian history, culture, Creole language, and investment fundamentals for the diaspora.',
        icon: '🎓',
        href: '/learn',
        color: 'blue',
        badge: null,
        badgeColor: null,
      },
      {
        id: 'community',
        title: 'Community Forum',
        desc: 'Connect with other members — ask questions, share experiences, and network with Haitian professionals.',
        icon: '👥',
        href: '/community',
        color: 'green',
        badge: null,
        badgeColor: null,
      },
    ],
  },
]

const featuredGuides = [
  {
    id: 'fg1',
    title: 'How to Register a Business in Haiti',
    excerpt: 'A complete walkthrough of ONAPI registration, required documents, timelines, and costs.',
    icon: '📋',
    category: 'Business',
    readTime: '8 min read',
    href: '/resources/business-guides/register-business',
  },
  {
    id: 'fg2',
    title: 'Understanding Haitian Labor Law',
    excerpt: 'Key rights and obligations for employers and employees under Haitian law.',
    icon: '⚖️',
    category: 'Legal',
    readTime: '12 min read',
    href: '/resources/law/labor-law',
  },
  {
    id: 'fg3',
    title: 'Tax Obligations for Haitian SMEs',
    excerpt: 'Overview of IBC, taxes on income, and how to stay compliant with DGI.',
    icon: '💰',
    category: 'Business',
    readTime: '10 min read',
    href: '/resources/business-guides/tax-basics',
  },
  {
    id: 'fg4',
    title: 'Haitian Holidays & Business Calendar',
    excerpt: 'Plan around annual holidays, festival periods, and optimal business timing.',
    icon: '📅',
    category: 'Cultural',
    readTime: '5 min read',
    href: '/resources/cultural-guides/holidays',
  },
]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredResources = searchQuery
    ? resources.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.items.length > 0)
    : resources

  const allCategories = ['Tools', 'Legal & Government', 'Business & Career', 'Education & Community']

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border border-green-700/40 rounded-full text-green-400 text-xs font-bold mb-4">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              KNOWLEDGE HUB
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">
              <span className="text-white">KONBIT</span>
              <span className="text-green-500"> Resources</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Everything you need to navigate Haitian business, culture, and law — from AI translation to legal guides.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="text-gray-400 text-lg">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search guides, laws, words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category quick filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                activeCategory === null
                  ? 'bg-green-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              All Resources
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                  activeCategory === cat
                    ? 'bg-green-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Resource Cards Grid */}
          {filteredResources.map((category) => (
            (!activeCategory || activeCategory === category.category) && (
              <div key={category.category} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-bold text-white">{category.category}</h2>
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-gray-500 text-sm">{category.items.length} resources</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`group bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-green-500/30 transition-all hover:-translate-y-0.5 ${
                        item.badge === 'Coming Soon' ? 'opacity-70' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                          item.color === 'green' ? 'bg-green-900/40' :
                          item.color === 'blue' ? 'bg-blue-900/40' :
                          item.color === 'purple' ? 'bg-purple-900/40' :
                          item.color === 'amber' ? 'bg-amber-900/40' :
                          item.color === 'red' ? 'bg-red-900/40' : 'bg-white/10'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold group-hover:text-green-400 transition">{item.title}</h3>
                            {item.badge && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                item.badgeColor === 'green' ? 'bg-green-900/40 text-green-400 border border-green-700/40' :
                                item.badgeColor === 'amber' ? 'bg-amber-900/40 text-amber-400 border border-amber-700/40' :
                                'bg-white/10 text-gray-400'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm line-clamp-2">{item.desc}</p>
                        </div>
                        <div className="text-gray-500 group-hover:text-green-400 transition mt-1">
                          →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          ))}

          {/* Featured Guides Section */}
          {!searchQuery && !activeCategory && (
            <div className="mt-16">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold text-white">Featured Guides</h2>
                <span className="px-3 py-1 bg-green-900/30 border border-green-700/40 rounded-full text-green-400 text-xs font-bold">MOST READ</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {featuredGuides.map((guide) => (
                  <Link
                    key={guide.id}
                    href={guide.href}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-green-900/30 transition">
                        {guide.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-500 bg-white/10 px-2 py-0.5 rounded-full">{guide.category}</span>
                          <span className="text-xs text-gray-600">·</span>
                          <span className="text-xs text-gray-500">{guide.readTime}</span>
                        </div>
                        <h3 className="text-white font-semibold text-sm group-hover:text-green-400 transition mb-1">{guide.title}</h3>
                        <p className="text-gray-400 text-xs line-clamp-2">{guide.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* TODO: Video Translation Feature Box */}
          {!searchQuery && (
            <div className="mt-16 bg-gradient-to-br from-green-900/20 to-green-950/40 border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-900/40 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🎬
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-bold">Video Translation Pipeline</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-900/40 text-amber-400 border border-amber-700/40">FUTURE</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    Coming soon: Upload any YouTube video, translate it to Haitian Kreyòl using AI, and generate a dubbed version with a Haitian avatar. Perfect for bringing global knowledge into Kreyòl language education.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-white/10 px-2 py-1 rounded">yt-dlp</span>
                    <span>→</span>
                    <span className="bg-white/10 px-2 py-1 rounded">Whisper</span>
                    <span>→</span>
                    <span className="bg-white/10 px-2 py-1 rounded">LLaMA</span>
                    <span>→</span>
                    <span className="bg-white/10 px-2 py-1 rounded">ElevenLabs</span>
                    <span>→</span>
                    <span className="bg-white/10 px-2 py-1 rounded">D-ID</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {searchQuery && filteredResources.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-white font-bold text-xl mb-2">No results found</h3>
              <p className="text-gray-400 mb-4">No resources match "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition"
              >
                Clear search
              </button>
            </div>
          )}

        </div>
      </main>

      <SlideSidebar />
      <Footer />
    </div>
  )
}