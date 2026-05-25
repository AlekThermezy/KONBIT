'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeftSidebar from '@/components/layout/LeftSidebar'

const categories = [
  { id: 'all', label: 'All', icon: '💼', count: 156 },
  { id: 'tech', label: 'Tech & Digital', icon: '💻', count: 42 },
  { id: 'business', label: 'Business', icon: '📊', count: 28 },
  { id: 'creative', label: 'Creative', icon: '🎨', count: 35 },
  { id: 'services', label: 'Services', icon: '🔧', count: 51 },
]

const featuredJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'HaitiDev Labs',
    location: 'Port-au-Prince, Haiti',
    type: 'Full-time',
    salary: '$60K–$90K',
    posted: '2 days ago',
    tags: ['React', 'TypeScript', 'Remote OK'],
    featured: true,
  },
  {
    id: 2,
    title: 'Investment Analyst',
    company: 'KONBIT Capital',
    location: 'Remote',
    type: 'Full-time',
    salary: '$45K–$65K',
    posted: '1 week ago',
    tags: ['Finance', 'Excel', 'Research'],
    featured: true,
  },
  {
    id: 3,
    title: 'Brand Designer',
    company: 'Studio Ayiti',
    location: 'Jacmel, Haiti',
    type: 'Contract',
    salary: '$25–$40/hr',
    posted: '3 days ago',
    tags: ['Figma', 'Branding', 'Illustrator'],
    featured: true,
  },
  {
    id: 4,
    title: 'Operations Manager',
    company: 'Logistics Pro HT',
    location: 'Port-au-Prince',
    type: 'Full-time',
    salary: '$35K–$50K',
    posted: '5 days ago',
    tags: ['Management', 'Logistics', 'French'],
    featured: false,
  },
  {
    id: 5,
    title: 'Content Creator',
    company: 'Haiti Media Co.',
    location: 'Remote',
    type: 'Freelance',
    salary: '$20–$30/hr',
    posted: '1 day ago',
    tags: ['Video', 'Kreyòl', 'Social Media'],
    featured: false,
  },
  {
    id: 6,
    title: 'Finance Associate',
    company: ' diasporaInvest',
    location: 'Remote',
    type: 'Part-time',
    salary: '$30K–$40K',
    posted: '2 weeks ago',
    tags: ['Accounting', 'QuickBooks', 'English'],
    featured: false,
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Full-time': return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'Part-time': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'Contract': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    case 'Freelance': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

export default function JobsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFeatured, setShowFeatured] = useState(true)

  const filteredJobs = showFeatured
    ? featuredJobs.filter(job => job.featured)
    : featuredJobs

  return (
    <div className="min-h-screen bg-black text-white">
      <LeftSidebar />
      <Navbar />

      <main className="pt-16 ml-64 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-4">
              💼 Opportunities
            </div>
            <h1 className="text-4xl font-black mb-2">Career <span className="text-green-500">Opportunities</span></h1>
            <p className="text-gray-400">Connect with Haitian businesses and global remote work.</p>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-xs opacity-60">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setShowFeatured(true)}
              className={`text-sm font-medium transition ${showFeatured ? 'text-green-400' : 'text-gray-500'}`}
            >
              Featured
            </button>
            <button
              onClick={() => setShowFeatured(false)}
              className={`text-sm font-medium transition ${!showFeatured ? 'text-green-400' : 'text-gray-500'}`}
            >
              All Opportunities
            </button>
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white/[3%] border border-white/10 rounded-2xl p-6 hover:bg-white/[6%] transition">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/30 flex items-center justify-center text-lg font-black text-green-400">
                      {job.company[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-0.5">{job.title}</h3>
                      <p className="text-gray-400 text-sm">{job.company} · {job.location}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(job.type)}`}>
                    {job.type}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-bold">{job.salary}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{job.posted}</span>
                    <button className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-bold transition">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gray-400">No opportunities match your filters.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}