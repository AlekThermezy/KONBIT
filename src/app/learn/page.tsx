'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeftSidebar from '@/components/layout/LeftSidebar'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'

const SB_URL = 'https://dubaqsooeuvfmaxwanwv.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YmFxc29vZXV2Zm1heHdhbnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MTk3NTYsImV4cCI6MjA5NTE5NTc1Nn0.DFJXG3Xf4SxtByzObx54m8gStxl8LDxLMitb9EFmfR8'

const categoryEmojis: Record<string, string> = {
  language: '🗣️', business: '📊', tech: '💻', creative: '🎨',
  music: '🎵', culinary: '🍳', agriculture: '🌱', fashion: '👗',
  real_estate: '🏠', other: '🌍',
}

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

export default function LearnPage() {
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    getCurrentUser().then(u => setUser(u))
    fetchCourses()
  }, [])

  async function fetchCourses() {
    setLoading(true)
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/courses?is_published=eq.true&select=*,users(name)`,
        {
          headers: {
            apikey: SB_KEY,
            Authorization: `Bearer ${SB_KEY}`,
          },
        }
      )
      const data = await res.json()
      setCourses(data || [])
    } catch (err) {
      console.error('Failed to fetch courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = activeFilter === 'all'
    ? courses
    : courses.filter((c: any) => c.category === activeFilter)

  const totalCourses = courses.length
  const totalStudents = courses.reduce((sum: number, c: any) => sum + (c.students_count || 0), 0)

  return (
    <div className="min-h-screen bg-black text-white">
      <LeftSidebar />
      <Navbar />

      <main className="ml-64 pt-16 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Learn <span className="text-blue-400">Courses</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Courses taught by Haitian experts. AI-powered learning tools to help you succeed.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Total Courses', value: totalCourses },
              { label: 'Expert Instructors', value: '18' },
              { label: 'Students Enrolled', value: totalStudents > 0 ? totalStudents : '6.2K' },
              { label: 'Course Hours', value: '150+' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-blue-400 mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {skillFilters.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-white mb-2">No courses published yet</h3>
              <p className="text-gray-400">Instructors: apply to teach on KONBIT Learn.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course: any) => (
                <Link
                  key={course.id}
                  href={`/learn/courses/${course.id}`}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                    <span className="text-6xl">{categoryEmojis[course.category] || '🌍'}</span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                        {course.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      by {course.users?.name || 'Instructor'}
                    </p>

                    <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-3">
                        <span>📚 {course.lessons_count || 0} lessons</span>
                        <span>⏱️ {course.duration_minutes ? Math.round(course.duration_minutes / 60) : 0}h</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        {course.original_price && course.price_cents < (course.original_price * 100) ? (
                          <>
                            <span className="text-gray-500 text-sm line-through">
                              ${Number(course.original_price).toLocaleString()}
                            </span>
                            <span className="text-xl font-black text-white ml-2">
                              ${(course.price_cents / 100).toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-black text-white">
                            {course.price_cents === 0 ? 'Free' : `$${(course.price_cents / 100).toLocaleString()}`}
                          </span>
                        )}
                      </div>
                      {course.rating_avg > 0 && (
                        <div className="flex items-center gap-1 text-amber-400 text-sm">
                          ⭐ {Number(course.rating_avg).toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
