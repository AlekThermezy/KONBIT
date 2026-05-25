'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth'

const mockCourses: Record<string, any> = {
  'haitian-creole': {
    id: 'haitian-creole',
    title: 'Haitian Creole Mastery',
    description: 'Learn the language of Haiti from basic phrases to fluent conversation. Perfect for diaspora wanting to reconnect with their heritage.',
    sector: 'Language',
    emoji: '🗣️',
    instructor: 'Marie Saint-Fleur',
    instructorTitle: 'Linguist & Cultural Educator',
    duration: '12 hours',
    lessons: 24,
    students: 847,
    rating: 4.9,
    level: 'Beginner to Advanced',
    image: '🗣️',
    modules: [
      {
        title: 'Foundation',
        lessons: [
          { id: 'f1', title: 'Greetings & Introductions', duration: '25 min', type: 'video' },
          { id: 'f2', title: 'Numbers 1-100', duration: '20 min', type: 'video' },
          { id: 'f3', title: 'Colors & Shapes', duration: '15 min', type: 'video' },
          { id: 'f4', title: 'Days & Months', duration: '15 min', type: 'video' },
          { id: 'f5', title: 'Flashcards: Foundation Quiz', duration: '10 min', type: 'quiz' },
        ],
      },
      {
        title: 'Daily Conversations',
        lessons: [
          { id: 'd1', title: 'At the Market', duration: '30 min', type: 'video' },
          { id: 'd2', title: 'Family & Relationships', duration: '25 min', type: 'video' },
          { id: 'd3', title: 'Food & Cooking', duration: '30 min', type: 'video' },
          { id: 'd4', title: 'Directions & Travel', duration: '20 min', type: 'video' },
          { id: 'd5', title: 'Flashcards: Conversations Quiz', duration: '10 min', type: 'quiz' },
        ],
      },
      {
        title: 'Cultural Depth',
        lessons: [
          { id: 'c1', title: 'Haitian History Basics', duration: '35 min', type: 'video' },
          { id: 'c2', title: 'Proverbs & Wisdom', duration: '25 min', type: 'video' },
          { id: 'c3', title: 'Music & Expressions', duration: '30 min', type: 'video' },
          { id: 'c4', title: 'Final Assessment', duration: '20 min', type: 'quiz' },
        ],
      },
    ],
  },
  'caribbean-business': {
    id: 'caribbean-business',
    title: 'Caribbean Business Essentials',
    description: 'Master the fundamentals of doing business in the Caribbean. From market analysis to regulatory compliance.',
    sector: 'Business',
    emoji: '💼',
    instructor: 'Jean-Pierre Toussaint',
    instructorTitle: 'MBA, Caribbean Trade Expert',
    duration: '16 hours',
    lessons: 18,
    students: 523,
    rating: 4.7,
    level: 'Intermediate',
    image: '💼',
    modules: [
      {
        title: 'Market Fundamentals',
        lessons: [
          { id: 'm1', title: 'Caribbean Economic Landscape', duration: '40 min', type: 'video' },
          { id: 'm2', title: 'Market Research Methods', duration: '35 min', type: 'video' },
          { id: 'm3', title: 'Target Audience Analysis', duration: '30 min', type: 'video' },
        ],
      },
      {
        title: 'Regulatory & Legal',
        lessons: [
          { id: 'r1', title: 'Business Registration', duration: '45 min', type: 'video' },
          { id: 'r2', title: 'Tax & Compliance', duration: '40 min', type: 'video' },
          { id: 'r3', title: 'Banking & Finance', duration: '35 min', type: 'video' },
        ],
      },
    ],
  },
  'digital-marketing': {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    description: 'Build your brand online. Learn social media, content marketing, and digital advertising for global audiences.',
    sector: 'Marketing',
    emoji: '📱',
    instructor: 'Chenicia Hyppolite',
    instructorTitle: 'Digital Strategist',
    duration: '10 hours',
    lessons: 15,
    students: 312,
    rating: 4.8,
    level: 'All Levels',
    image: '📱',
    modules: [
      {
        title: 'Social Media Foundations',
        lessons: [
          { id: 's1', title: 'Platform Strategy', duration: '30 min', type: 'video' },
          { id: 's2', title: 'Content Creation', duration: '35 min', type: 'video' },
          { id: 's3', title: 'Community Building', duration: '25 min', type: 'video' },
        ],
      },
    ],
  },
  'tech-entrepreneurship': {
    id: 'tech-entrepreneurship',
    title: 'Tech Entrepreneurship',
    description: 'Build and scale tech startups in emerging markets. From idea validation to funding.',
    sector: 'Technology',
    emoji: '💻',
    instructor: 'Marc-Andre Dumulot',
    instructorTitle: 'Tech Founder & Angel Investor',
    duration: '20 hours',
    lessons: 22,
    students: 189,
    rating: 4.9,
    level: 'Advanced',
    image: '💻',
    modules: [
      {
        title: 'Ideation & Validation',
        lessons: [
          { id: 't1', title: 'Finding Problem-Solution Fit', duration: '45 min', type: 'video' },
          { id: 't2', title: 'Customer Discovery', duration: '40 min', type: 'video' },
          { id: 't3', title: 'MVP Development', duration: '50 min', type: 'video' },
        ],
      },
    ],
  },
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeModule, setActiveModule] = useState(0)

  const courseId = params.courseId as string
  const course = mockCourses[courseId]

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <button
            onClick={() => router.push('/learn')}
            className="px-6 py-3 bg-green-600 rounded-xl font-medium text-black"
          >
            Back to Learn
          </button>
        </div>
      </div>
    )
  }

  const totalLessons = course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)
  const completedLessons = 0 // Would come from user progress tracking

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => router.push('/learn')}
            className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition"
          >
            ← Back to Learn
          </button>

          {/* Course Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-4xl flex-shrink-0">
              {course.emoji}
            </div>
            <div>
              <h1 className="text-3xl font-black mb-2">{course.title}</h1>
              <p className="text-gray-400 mb-3">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-gray-400">By {course.instructor}</span>
                <span className="text-amber-400">★ {course.rating}</span>
                <span className="text-gray-400">{course.students} students</span>
                <span className="text-gray-400">{course.duration}</span>
                <span className="px-2 py-1 bg-blue-900/30 border border-blue-500/30 rounded text-blue-400 text-xs">
                  {course.level}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-gray-400">Your Progress</span>
              <span className="text-white font-medium">{completedLessons} / {totalLessons} lessons</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all"
                style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
              />
            </div>
          </div>

          {/* Learning Path */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Modules */}
            <div className="lg:col-span-3 space-y-4">
              <h2 className="text-xl font-bold text-white">Course Content</h2>
              {course.modules.map((module: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setActiveModule(activeModule === i ? -1 : i)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition"
                  >
                    <div>
                      <div className="font-bold text-white">{module.title}</div>
                      <div className="text-gray-500 text-sm">{module.lessons.length} lessons</div>
                    </div>
                    <span className={`text-gray-400 transition-transform ${activeModule === i ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {activeModule === i && (
                    <div className="border-t border-white/10">
                      {module.lessons.map((lesson: any, j: number) => (
                        <div
                          key={j}
                          className="flex items-center gap-4 p-4 hover:bg-white/5 transition cursor-pointer border-b border-white/5 last:border-0"
                        >
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400">
                            {lesson.type === 'quiz' ? '📝' : '▶️'}
                          </div>
                          <div className="flex-1">
                            <div className="text-white">{lesson.title}</div>
                            <div className="text-gray-500 text-sm">{lesson.duration}</div>
                          </div>
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-black transition">
                            {user ? 'Start' : 'Preview'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">Instructor</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl font-bold text-black">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{course.instructor}</div>
                    <div className="text-gray-400 text-sm">{course.instructorTitle}</div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lessons</span>
                    <span className="text-white">{totalLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level</span>
                    <span className="text-white">{course.level}</span>
                  </div>
                </div>

                {!user && (
                  <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/30 rounded-xl">
                    <p className="text-amber-400 text-sm">Sign in to track your progress and earn certificates.</p>
                    <Link
                      href="/signin"
                      className="block mt-3 text-center py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-black transition"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                {/* Smart Resume Feature */}
                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <span>🧠</span>
                    <span className="font-medium text-sm">Smart Resume</span>
                  </div>
                  <p className="text-gray-400 text-sm">Pick up exactly where you left off. Your progress is automatically saved.</p>
                </div>

                {/* AI Flashcards */}
                <div className="mt-4 p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <span>🃏</span>
                    <span className="font-medium text-sm">AI Flashcards</span>
                  </div>
                  <p className="text-gray-400 text-sm">Generate smart flashcards from course content using AI.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}