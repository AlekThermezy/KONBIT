'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

import { useState } from 'react'
import Link from 'next/link'

const jobCategories = [
  { id: 'all', label: 'All Jobs', icon: '💼', count: 156 },
  { id: 'tech', label: 'Tech & Digital', icon: '💻', count: 42 },
  { id: 'business', label: 'Business & Finance', icon: '📊', count: 28 },
  { id: 'creative', label: 'Creative & Media', icon: '🎨', count: 35 },
  { id: 'services', label: 'Services & Trade', icon: '🔧', count: 51 },
]

const jobTypes = [
  { id: 'all', label: 'All Types' },
  { id: 'fulltime', label: 'Full-time' },
  { id: 'parttime', label: 'Part-time' },
  { id: 'contract', label: 'Contract' },
  { id: 'gig', label: 'Gig Work' },
  { id: 'remote', label: 'Remote' },
]

const featuredJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'HaitiTech Solutions',
    location: 'Port-au-Prince, Haiti',
    type: 'Full-time',
    salary: '$800 - $1,200/mo',
    tags: ['React', 'TypeScript', 'Remote OK'],
    featured: true,
    posted: '2 days ago',
    logo: 'HT'
  },
  {
    id: 2,
    title: 'Graphic Designer',
    company: 'Kreyo Studio',
    location: 'Remote',
    type: 'Freelance',
    salary: '$25 - $40/hr',
    tags: ['Figma', 'Illustrator', 'Branding'],
    featured: true,
    posted: '1 day ago',
    logo: 'KS'
  },
  {
    id: 3,
    title: 'Bookkeeping Specialist',
    company: 'Biznèz Ayiti',
    location: 'Delmas, PAP',
    type: 'Part-time',
    salary: '$400 - $600/mo',
    tags: ['QuickBooks', 'French', 'Excel'],
    featured: false,
    posted: '3 days ago',
    logo: 'BA'
  },
  {
    id: 4,
    title: 'Mobile App Developer',
    company: 'Ayiti Apps',
    location: 'Remote',
    type: 'Contract',
    salary: '$1,500 - $2,500/mo',
    tags: ['Flutter', 'iOS', 'Android'],
    featured: true,
    posted: '5 hours ago',
    logo: 'AA'
  },
  {
    id: 5,
    title: 'Content Writer',
    company: 'Medya Lakay',
    location: 'Jacmel, Haiti',
    type: 'Part-time',
    salary: '$300 - $500/mo',
    tags: ['French', 'English', 'Social Media'],
    featured: false,
    posted: '1 week ago',
    logo: 'ML'
  },
  {
    id: 6,
    title: 'Electrician',
    company: 'Enèji Plus',
    location: 'Cap-Haïtien',
    type: 'Full-time',
    salary: '$500 - $800/mo',
    tags: ['Electrical', 'Solar', 'Certified'],
    featured: false,
    posted: '4 days ago',
    logo: 'EP'
  },
  {
    id: 7,
    title: 'Data Analyst',
    company: 'Done Done Data',
    location: 'Remote',
    type: 'Full-time',
    salary: '$1,000 - $1,500/mo',
    tags: ['Python', 'SQL', 'Tableau'],
    featured: false,
    posted: '6 days ago',
    logo: 'DD'
  },
  {
    id: 8,
    title: 'Delivery Driver',
    company: 'Rapid Ayiti',
    location: 'Port-au-Prince',
    type: 'Gig',
    salary: '$15 - $25/hr',
    tags: ['Motorcycle', 'Car', 'Flexible'],
    featured: false,
    posted: '2 days ago',
    logo: 'RA'
  },
]

const gigOpportunities = [
  {
    title: 'Event Photography',
    location: 'Port-au-Prince',
    pay: '$100 - $300/event',
    clients: 24,
    rating: 4.8
  },
  {
    title: 'Translation Services',
    location: 'Remote',
    pay: '$0.05 - $0.10/word',
    clients: 18,
    rating: 4.9
  },
  {
    title: 'Logo Design',
    location: 'Remote',
    pay: '$50 - $200/project',
    clients: 42,
    rating: 4.7
  },
  {
    title: 'Data Entry',
    location: 'Remote',
    pay: '$8 - $12/hr',
    clients: 31,
    rating: 4.6
  },
]

const careerResources = [
  {
    title: 'Resume Writing Guide',
    desc: 'Tips for creating a professional resume',
    icon: '📄',
    color: 'from-green-500/20 to-green-600/5'
  },
  {
    title: 'Interview Prep',
    desc: 'Common questions and best answers',
    icon: '🎯',
    color: 'from-blue-500/20 to-blue-600/5'
  },
  {
    title: 'Salary Calculator',
    desc: 'Know your worth in the Haitian market',
    icon: '💰',
    color: 'from-green-500/20 to-green-600/5'
  },
  {
    title: 'Career Counseling',
    desc: 'Book a 1-on-1 session with experts',
    icon: '👥',
    color: 'from-blue-500/20 to-blue-600/5'
  }
]

export default function JobsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [showFeatured, setShowFeatured] = useState(true)

  const filteredJobs = showFeatured 
    ? featuredJobs.filter(job => job.featured)
    : featuredJobs

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Part-time': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Contract': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'Freelance': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'Gig': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center justify-center px-6 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-blue-900/20" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-6">
            💼 KONBIT Jobs — Career Opportunities for Haitians
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-green-500">Find Your</span><br />
            <span className="text-white">Next Opportunity</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Job listings, gig work, and career opportunities. Connect with Haitian businesses and global remote work.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a 
              href="#jobs"
              className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
            >
              Browse Jobs
            </a>
            <a 
              href="#gigs"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Find Gig Work
            </a>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: '156+', label: 'Active Jobs' },
              { value: '89', label: 'Companies' },
              { value: '2.4K', label: 'Applications' },
              { value: '65%', label: 'Remote Rate' }
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-3xl md:text-4xl font-black text-green-500 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-center">
            Browse by <span className="text-green-500">Category</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {jobCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-6 rounded-2xl border transition-all duration-300 text-left ${
                  selectedCategory === cat.id
                    ? 'bg-green-600/20 border-green-500/50 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-green-500/30 hover:text-white'
                }`}
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <div className="font-bold mb-1">{cat.label}</div>
                <div className="text-sm opacity-60">{cat.count} jobs</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section id="jobs" className="py-24 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-4">
                Job Listings
              </div>
              <h2 className="text-4xl md:text-5xl font-black">
                <span className="text-green-500">Open</span> Positions
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Type Filter */}
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                {jobTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedType === type.id
                        ? 'bg-green-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Featured Toggle */}
              <button
                onClick={() => setShowFeatured(!showFeatured)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
                  showFeatured
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-blue-500/50'
                }`}
              >
                ⭐ Featured Only
              </button>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div 
                key={job.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold text-lg">
                      {job.logo}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-green-400 transition">{job.title}</h3>
                      <p className="text-gray-400">{job.company}</p>
                    </div>
                  </div>
                  {job.featured && (
                    <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-lg text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">📍 {job.location}</span>
                  <span className={`px-3 py-1 rounded-lg border ${getTypeColor(job.type)}`}>
                    {job.type}
                  </span>
                  <span className="text-green-500 font-medium">{job.salary}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-gray-500 text-sm">Posted {job.posted}</span>
                  <button className="px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl font-semibold text-sm transition">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white/5 border border-white/20 hover:border-green-500/50 rounded-xl font-semibold transition">
              Load More Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Gig Opportunities */}
      <section id="gigs" className="py-24 px-6 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-4">
              Quick Gigs
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-blue-500">Gig</span> Opportunities
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Fast-paying gigs you can start immediately. Perfect for supplemental income.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gigOpportunities.map((gig, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300"
              >
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-bold mb-2">{gig.title}</h3>
                <p className="text-gray-400 text-sm mb-4">📍 {gig.location}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-400 font-bold">{gig.pay}</span>
                  <span className="text-gray-500 text-sm">⭐ {gig.rating}</span>
                </div>

                <div className="text-sm text-gray-400 mb-4">
                  <span className="text-green-500">{gig.clients}</span> clients available
                </div>

                <button className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-xl font-semibold text-sm transition">
                  View Gigs
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Resources */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm mb-4">
              Career Support
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Tools for Your <span className="text-green-500">Success</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careerResources.map((resource, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${resource.color} border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300 cursor-pointer group`}
              >
                <div className="text-4xl mb-4">{resource.icon}</div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition">{resource.title}</h3>
                <p className="text-gray-400 text-sm">{resource.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Post Job CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-black to-blue-900/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[150px]" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-green-900/40 to-blue-900/40 border border-green-500/30 rounded-3xl p-10 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Hiring <span className="text-green-500">Haitian</span> Talent?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
              Post your job to reach thousands of qualified Haitian professionals. Reach both local and diaspora candidates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg transition shadow-lg shadow-green-500/25">
                Post a Job — Free
              </button>
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-500/25">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}