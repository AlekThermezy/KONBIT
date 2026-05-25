'use client'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeftSidebar from '@/components/layout/LeftSidebar'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'

const skillFilters = [
  { id: 'all', label: 'All', icon: '🌐' },
  { id: 'language', label: 'Language', icon: '🗣️' },
  { id: 'business', label: 'Business', icon: '📊' },
  { id: 'tech', label: 'Tech', icon: '💻' },
  { id: 'creative', label: 'Creative', icon: '🎨' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'culinary', label: 'Culinary', icon: '🍳' },
  { id: 'agriculture', label: 'Agriculture', icon: '🌱' },
]

const courses = [
  {
    id: 'ht-creole-101',
    title: 'Haitian Creole Fundamentals',
    instructor: 'Marie-Claire J.',
    sector: 'language',
    level: 'Beginner',
    students: 1240,
    rating: 4.9,
    price: 49,
    originalPrice: 99,
    image: '🇭🇹',
    progress: 65,
    duration: '8 weeks',
    lessons: 24
  },
  {
    id: 'biz-essentials',
    title: 'Caribbean Business Essentials',
    instructor: 'Jean-Pierre L.',
    sector: 'business',
    level: 'Intermediate',
    students: 867,
    rating: 4.8,
    price: 79,
    originalPrice: 149,
    image: '📊',
    progress: 30,
    duration: '10 weeks',
    lessons: 32
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    instructor: 'Sarah M.',
    sector: 'business',
    level: 'Advanced',
    students: 543,
    rating: 4.7,
    price: 99,
    originalPrice: 199,
    image: '📱',
    progress: 0,
    duration: '12 weeks',
    lessons: 36
  },
  {
    id: 'creole-conversation',
    title: 'Haitian Creole Conversation',
    instructor: 'Michael T.',
    sector: 'language',
    level: 'Intermediate',
    students: 789,
    rating: 4.9,
    price: 59,
    originalPrice: 119,
    image: '💬',
    progress: 0,
    duration: '6 weeks',
    lessons: 18
  },
  {
    id: 'tech-startup',
    title: 'Tech Entrepreneurship',
    instructor: 'David K.',
    sector: 'tech',
    level: 'Advanced',
    students: 412,
    rating: 4.6,
    price: 149,
    originalPrice: 299,
    image: '🚀',
    progress: 0,
    duration: '16 weeks',
    lessons: 48
  },
  {
    id: 'haitian-art',
    title: 'Haitian Art & Culture',
    instructor: 'Antoine R.',
    sector: 'creative',
    level: 'Beginner',
    students: 623,
    rating: 4.8,
    price: 39,
    originalPrice: 79,
    image: '🎨',
    progress: 100,
    duration: '4 weeks',
    lessons: 12
  },
  {
    id: 'comp-kreol',
    title: 'Computer Programming in Kreol',
    instructor: 'Christophe D.',
    sector: 'tech',
    level: 'Intermediate',
    students: 334,
    rating: 4.5,
    price: 89,
    originalPrice: 179,
    image: '💻',
    progress: 0,
    duration: '14 weeks',
    lessons: 42
  },
  {
    id: 'haitian-cuisine',
    title: 'Haitian Culinary Arts',
    instructor: 'Marie F.',
    sector: 'culinary',
    level: 'Beginner',
    students: 891,
    rating: 4.9,
    price: 69,
    originalPrice: 129,
    image: '🍳',
    progress: 0,
    duration: '8 weeks',
    lessons: 24
  },
  {
    id: 'music-production',
    title: 'Music Production for Beginners',
    instructor: 'Wyclef P.',
    sector: 'music',
    level: 'Beginner',
    students: 445,
    rating: 4.7,
    price: 79,
    originalPrice: 159,
    image: '🎵',
    progress: 0,
    duration: '10 weeks',
    lessons: 30
  },
]

const learningPaths = [
  {
    title: 'Haitian Business Owner',
    courses: 4,
    desc: 'Essential business skills for the Haitian market',
    icon: '💼'
  },
  {
    title: 'Tech Professional',
    courses: 6,
    desc: 'From coding basics to advanced development',
    icon: '💻'
  },
  {
    title: 'Creative Artist',
    courses: 3,
    desc: 'Art, music, and culinary arts mastery',
    icon: '🎨'
  },
]

export default function LearnPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getCurrentUser().then(u => setUser(u))
  }, [])

  const filteredCourses = activeFilter === 'all'
    ? courses
    : courses.filter(c => c.sector === activeFilter)

  return (
    <div className="min-h-screen bg-black text-white">
      <LeftSidebar />
      <Navbar />

      <main className="ml-64 pt-16 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Learning <span className="text-blue-400">Center</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Master new skills with courses taught by Haitian experts. AI-powered tools to accelerate your growth.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Total Courses', value: '24' },
              { label: 'Expert Instructors', value: '18' },
              { label: 'Students Enrolled', value: '6.2K' },
              { label: 'Course Hours', value: '150+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-blue-400 mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Skill Filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {skillFilters.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveFilter(s.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                  activeFilter === s.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                href={`/learn/courses/${course.id}`}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all"
              >
                {/* Image Area */}
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                  <span className="text-6xl">{course.image}</span>
                  {course.progress > 0 && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-green-600/90 text-white text-xs rounded-full">
                      {course.progress}% done
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                      {course.sector}
                    </span>
                    <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-xs rounded-full">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">by {course.instructor}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-3">
                      <span>📚 {course.lessons} lessons</span>
                      <span>⏱️ {course.duration}</span>
                    </div>
                  </div>

                  {/* Progress Bar - if course in progress */}
                  {course.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Your progress</span>
                        <span className="text-blue-400 font-bold">{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 text-sm line-through">${course.originalPrice}</span>
                      <span className="text-xl font-black text-white ml-2">${course.price}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-sm">
                      ⭐ {course.rating}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Learning Paths */}
          <div className="border-t border-white/10 pt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Learning Paths</h2>
              <p className="text-gray-400">Structured journeys from beginner to professional</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {learningPaths.map((path) => (
                <div key={path.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
                  <div className="text-4xl mb-4">{path.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{path.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{path.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">📚 {path.courses} courses</span>
                    <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-sm font-medium transition">
                      Begin Your Journey →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}