'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import LeftSidebar from '@/components/layout/LeftSidebar'
import Footer from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const categoryEmojis: Record<string, string> = {
  language: '🗣️', business: '📊', tech: '💻', creative: '🎨',
  music: '🎵', culinary: '🍳', agriculture: '🌱', fashion: '👗',
  real_estate: '🏠', other: '🌍',
}

const categoryGradients: Record<string, string> = {
  language: 'from-blue-600 to-blue-400',
  business: 'from-amber-600 to-amber-400',
  tech: 'from-purple-600 to-purple-400',
  creative: 'from-pink-600 to-pink-400',
  music: 'from-red-600 to-red-400',
  culinary: 'from-orange-600 to-orange-400',
  agriculture: 'from-green-600 to-green-400',
  fashion: 'from-rose-600 to-rose-400',
  real_estate: 'from-emerald-600 to-emerald-400',
  other: 'from-gray-600 to-gray-400',
}

function formatDuration(minutes: number): string {
  if (!minutes) return 'N/A'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h} hours`
}

function formatLevel(durationMinutes: number): string {
  if (durationMinutes <= 120) return 'Beginner'
  if (durationMinutes <= 480) return 'Intermediate'
  if (durationMinutes <= 960) return 'Advanced'
  return 'Expert'
}

// Group lessons into artificial modules (every 5 lessons)
function groupLessonsIntoModules(lessons: any[]): { title: string; lessons: any[] }[] {
  const modules: { title: string; lessons: any[] }[] = []
  const chunkSize = 5
  for (let i = 0; i < lessons.length; i += chunkSize) {
    const chunk = lessons.slice(i, i + chunkSize)
    modules.push({
      title: `Module ${modules.length + 1}: ${chunk[0]?.title?.split(' ').slice(0, 2).join(' ') || 'Lessons'}`,
      lessons: chunk,
    })
  }
  return modules
}

function getLessonType(lesson: any): string {
  if (lesson.video_url) return 'video'
  return 'reading'
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [user, setUser] = useState<any>(null)
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [enrollment, setEnrollment] = useState<any>(null)
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [certificate, setCertificate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeModule, setActiveModule] = useState(0)
  const [activeTab, setActiveTab] = useState<'content' | 'flashcards'>('content')
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // ─── Load everything ───────────────────────────────────────────
  useEffect(() => {
    getCurrentUser().then(setUser)
    loadCourseData()
  }, [courseId])

  useEffect(() => {
    if (user && course) {
      loadUserData()
    }
  }, [user, course])

  async function loadCourseData() {
    setLoading(true)
    setError(null)
    try {
      // Fetch course with instructor info
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*, users!instructor_id(name, avatar_url, bio)')
        .eq('id', courseId)
        .single()

      if (courseError) {
        if (courseError.code === 'PGRST116') {
          setError('not_found')
        } else {
          console.error('Failed to fetch course:', courseError)
          setError('fetch_failed')
        }
        setLoading(false)
        return
      }

      setCourse(courseData)

      // Fetch lessons
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('position')

      if (lessonError) {
        console.error('Failed to fetch lessons:', lessonError)
      }
      setLessons(lessonData || [])
    } catch (err) {
      console.error('Error loading course:', err)
      setError('fetch_failed')
    } finally {
      setLoading(false)
    }
  }

  async function loadUserData() {
    if (!user) return
    try {
      // Fetch enrollment
      const { data: enrollData } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle()

      setEnrollment(enrollData)

      if (enrollData) {
        // Fetch flashcards
        const { data: flashData } = await supabase
          .from('flashcards')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .order('created_at', { ascending: false })

        setFlashcards(flashData || [])

        // Fetch certificate
        const { data: certData } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle()

        setCertificate(certData)
      }
    } catch (err) {
      console.error('Error loading user data:', err)
    }
  }

  // ─── Enroll ─────────────────────────────────────────────────────
  async function handleEnroll() {
    if (!user) {
      router.push('/signin')
      return
    }
    setActionLoading('enroll')
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress_percent: 0,
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          // Already enrolled — reload
          await loadUserData()
        } else {
          console.error('Enroll error:', error)
        }
        return
      }

      setEnrollment(data)
      // Update course student count optimistically
      setCourse((prev: any) => ({
        ...prev,
        students_count: (prev.students_count || 0) + 1,
      }))
    } catch (err) {
      console.error('Enroll failed:', err)
    } finally {
      setActionLoading(null)
    }
  }

  // ─── Mark lesson complete ───────────────────────────────────────
  async function handleMarkComplete(lessonId: string) {
    if (!user || !enrollment) return
    setActionLoading(`complete-${lessonId}`)

    const newCompleted = new Set(completedLessonIds)
    let isAdding = true

    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId)
      isAdding = false
    } else {
      newCompleted.add(lessonId)
    }

    const totalLessons = lessons.length
    const completedCount = newCompleted.size
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

    try {
      const updates: any = {
        progress_percent: progressPercent,
        last_lesson_id: lessonId,
      }

      if (progressPercent >= 100) {
        updates.completed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('enrollments')
        .update(updates)
        .eq('id', enrollment.id)

      if (error) {
        // Rollback on error
        if (isAdding) newCompleted.delete(lessonId)
        else newCompleted.add(lessonId)
        console.error('Failed to update progress:', error)
        return
      }

      setCompletedLessonIds(newCompleted)
      setEnrollment((prev: any) => ({
        ...prev,
        progress_percent: progressPercent,
        last_lesson_id: lessonId,
        ...(progressPercent >= 100 ? { completed_at: new Date().toISOString() } : {}),
      }))

      // If course completed, check for certificate
      if (progressPercent >= 100) {
        await issueCertificate()
      }
    } catch (err) {
      console.error('Mark complete failed:', err)
    } finally {
      setActionLoading(null)
    }
  }

  async function issueCertificate() {
    if (!user || certificate) return
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          user_id: user.id,
          course_id: courseId,
        })
        .select()
        .single()

      if (error) {
        // May already exist (unique constraint)
        if (error.code === '23505') {
          const { data: existing } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .maybeSingle()
          setCertificate(existing)
        }
        return
      }
      setCertificate(data)
    } catch (err) {
      console.error('Certificate issue failed:', err)
    }
  }

  // ─── Generate Flashcards ────────────────────────────────────────
  async function handleGenerateFlashcards() {
    if (!user || !enrollment) return
    setGeneratingFlashcards(true)
    try {
      // Build template flashcards from lesson content
      // Full AI generation comes later — this creates the infrastructure
      const templateCards = lessons.slice(0, 10).map((lesson) => ({
        user_id: user.id,
        course_id: courseId,
        lesson_id: lesson.id,
        front: `What is the main topic of "${lesson.title}"?`,
        back: lesson.description || `Review lesson: ${lesson.title}`,
      }))

      const { data, error } = await supabase
        .from('flashcards')
        .insert(templateCards)
        .select()

      if (error) {
        console.error('Failed to generate flashcards:', error)
        return
      }

      // Reload flashcards
      const { data: freshCards } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })

      setFlashcards(freshCards || [])
    } catch (err) {
      console.error('Flashcard generation failed:', err)
    } finally {
      setGeneratingFlashcards(false)
    }
  }

  // ─── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-4 bg-gray-800 rounded w-32 mb-6" />
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gray-800" />
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-800 rounded w-2/3" />
              </div>
            </div>
            <div className="h-24 bg-white/5 rounded-2xl mb-8" />
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-white/5 rounded-2xl" />
                ))}
              </div>
              <div className="lg:col-span-2">
                <div className="h-80 bg-white/5 rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ─── Error state ────────────────────────────────────────────────
  if (error === 'not_found') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="text-gray-400 mb-6">This course may have been removed or the link is incorrect.</p>
          <Link
            href="/learn"
            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-medium text-black transition inline-block"
          >
            ← Back to Learn
          </Link>
        </div>
      </div>
    )
  }

  if (error === 'fetch_failed') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-6">We couldn&apos;t load this course. Please try again.</p>
          <button
            onClick={() => loadCourseData()}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-medium text-black transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // ─── Derived values ─────────────────────────────────────────────
  const totalLessons = lessons.length
  const progressPercent = enrollment?.progress_percent || 0
  const completedCount = Math.round((progressPercent / 100) * totalLessons)
  const isEnrolled = !!enrollment
  const isCompleted = progressPercent >= 100
  const modules = groupLessonsIntoModules(lessons)
  const courseEmoji = categoryEmojis[course?.category] || '📚'
  const gradient = categoryGradients[course?.category] || 'from-green-600 to-green-400'
  const formattedDuration = formatDuration(course?.duration_minutes || 0)
  const courseLevel = formatLevel(course?.duration_minutes || 0)
  const instructor = course?.users || {}

  return (
    <div className="min-h-screen bg-black text-white">
      <LeftSidebar />
      <Navbar />

      <main className="ml-64 pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <Link
            href="/learn"
            className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition w-fit"
          >
            ← Back to Learn
          </Link>

          {/* ── Course Header ────────────────────────────────── */}
          <div className="flex items-start gap-6 mb-8">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-4xl flex-shrink-0`}
            >
              {courseEmoji}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black mb-2">{course.title}</h1>
              <p className="text-gray-400 mb-3">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-gray-400">
                  By {instructor.name || 'Unknown Instructor'}
                </span>
                {course.rating_avg > 0 && (
                  <span className="text-amber-400">
                    ★ {Number(course.rating_avg).toFixed(1)}
                    {course.rating_count > 0 && (
                      <span className="text-gray-500 ml-1">({course.rating_count})</span>
                    )}
                  </span>
                )}
                <span className="text-gray-400">
                  {course.students_count || 0} students
                </span>
                <span className="text-gray-400">{formattedDuration}</span>
                <span className="px-2 py-1 bg-green-900/30 border border-green-500/30 rounded text-green-400 text-xs">
                  {courseLevel}
                </span>
                {course.category && (
                  <span className="px-2 py-1 bg-blue-900/20 border border-blue-500/20 rounded text-blue-400 text-xs capitalize">
                    {course.category.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Progress Bar (only if enrolled) ─────────────── */}
          {isEnrolled && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex justify-between mb-3">
                <span className="text-gray-400">Your Progress</span>
                <span className="text-white font-medium">
                  {completedCount} / {totalLessons} lessons ({progressPercent}%)
                </span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {isCompleted && (
                <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
                  <span>🎉</span>
                  <span>Course completed! Great job!</span>
                </div>
              )}
            </div>
          )}

          {/* ── Tabs: Content / Flashcards ──────────────────── */}
          {isEnrolled && (
            <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === 'content'
                    ? 'bg-green-600 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📖 Content
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === 'flashcards'
                    ? 'bg-green-600 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🃏 Flashcards ({flashcards.length})
              </button>
            </div>
          )}

          {/* ── Main Content Area ───────────────────────────── */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* ── Content Tab: Modules & Lessons ────────────── */}
            {activeTab === 'content' && (
              <div className="lg:col-span-3 space-y-4">
                <h2 className="text-xl font-bold text-white">
                  Course Content
                  {!isEnrolled && lessons.length > 0 && (
                    <span className="text-gray-400 text-sm font-normal ml-2">
                      ({lessons.length} lessons)
                    </span>
                  )}
                </h2>

                {modules.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                    <p className="text-gray-400">No lessons published yet for this course.</p>
                  </div>
                ) : (
                  modules.map((module, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                    >
                      <button
                        onClick={() => setActiveModule(activeModule === i ? -1 : i)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition"
                      >
                        <div>
                          <div className="font-bold text-white">{module.title}</div>
                          <div className="text-gray-500 text-sm">
                            {module.lessons.length} lessons
                          </div>
                        </div>
                        <span
                          className={`text-gray-400 transition-transform ${
                            activeModule === i ? 'rotate-180' : ''
                          }`}
                        >
                          ▼
                        </span>
                      </button>

                      {activeModule === i && (
                        <div className="border-t border-white/10">
                          {module.lessons.map((lesson: any, j: number) => {
                            const lessonType = getLessonType(lesson)
                            const isCompleted = completedLessonIds.has(lesson.id)
                            const isCompleting = actionLoading === `complete-${lesson.id}`

                            return (
                              <div
                                key={lesson.id || j}
                                className={`flex items-center gap-4 p-4 hover:bg-white/5 transition border-b border-white/5 last:border-0 ${
                                  isCompleted ? 'bg-green-900/10' : ''
                                }`}
                              >
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center text-gray-400 flex-shrink-0 ${
                                    isCompleted ? 'bg-green-600/20 text-green-400' : 'bg-white/10'
                                  }`}
                                >
                                  {isCompleted ? '✅' : lessonType === 'video' ? '▶️' : '📖'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={`text-white truncate ${isCompleted ? 'line-through opacity-60' : ''}`}>
                                    {lesson.title}
                                  </div>
                                  <div className="text-gray-500 text-sm">
                                    {lesson.duration_minutes
                                      ? formatDuration(lesson.duration_minutes)
                                      : 'N/A'}
                                    {lesson.is_free && (
                                      <span className="ml-2 px-1.5 py-0.5 bg-green-900/30 text-green-400 text-xs rounded">
                                        Free
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {isEnrolled ? (
                                  <button
                                    onClick={() => handleMarkComplete(lesson.id)}
                                    disabled={isCompleting}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition flex-shrink-0 ${
                                      isCompleted
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                        : 'bg-green-600 hover:bg-green-500 text-black'
                                    }`}
                                  >
                                    {isCompleting ? '...' : isCompleted ? 'Undo' : 'Complete'}
                                  </button>
                                ) : (
                                  <button
                                    onClick={handleEnroll}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-black transition flex-shrink-0"
                                  >
                                    {actionLoading === 'enroll' ? '...' : 'Enroll'}
                                  </button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── Flashcards Tab ────────────────────────────── */}
            {activeTab === 'flashcards' && (
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    Flashcards ({flashcards.length})
                  </h2>
                  <button
                    onClick={handleGenerateFlashcards}
                    disabled={generatingFlashcards}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg text-sm font-medium text-white transition"
                  >
                    {generatingFlashcards ? '⏳ Generating...' : '✨ Generate Flashcards'}
                  </button>
                </div>

                {flashcards.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                    <div className="text-4xl mb-3">🃏</div>
                    <p className="text-gray-400 mb-4">
                      No flashcards yet. Generate them from your course content!
                    </p>
                    <button
                      onClick={handleGenerateFlashcards}
                      disabled={generatingFlashcards}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg text-sm font-medium text-white transition"
                    >
                      {generatingFlashcards ? 'Generating...' : 'Generate Flashcards'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {flashcards.map((card) => (
                      <div
                        key={card.id}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-purple-400 text-lg mt-1">🃏</span>
                          <div className="flex-1">
                            <div className="text-white font-medium mb-2">{card.front}</div>
                            <div className="text-gray-400 text-sm pl-4 border-l-2 border-purple-500/30">
                              {card.back}
                            </div>
                            {card.lesson_id && (
                              <div className="mt-2 text-xs text-gray-500">
                                From: {lessons.find((l: any) => l.id === card.lesson_id)?.title || 'Unknown lesson'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Sidebar ───────────────────────────────────── */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24 space-y-6">
                {/* Instructor */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Instructor</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl font-bold text-black flex-shrink-0">
                      {(instructor.name || 'I').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {instructor.name || 'Unknown Instructor'}
                      </div>
                      {instructor.bio && (
                        <div className="text-gray-400 text-sm line-clamp-2">
                          {instructor.bio}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lessons</span>
                    <span className="text-white">{totalLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{formattedDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level</span>
                    <span className="text-white">{courseLevel}</span>
                  </div>
                  {course.price_cents > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price</span>
                      <span className="text-white">
                        ${(course.price_cents / 100).toFixed(2)} {course.currency || 'USD'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sign-in prompt */}
                {!user && (
                  <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-xl">
                    <p className="text-amber-400 text-sm mb-3">
                      Sign in to track your progress and earn certificates.
                    </p>
                    <Link
                      href="/signin"
                      className="block w-full text-center py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-black transition"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                {/* Enroll / Continue button */}
                {user && !isEnrolled && (
                  <button
                    onClick={handleEnroll}
                    disabled={actionLoading === 'enroll'}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-xl font-bold text-black transition text-center"
                  >
                    {actionLoading === 'enroll' ? 'Enrolling...' : '🎓 Enroll Now'}
                  </button>
                )}

                {isEnrolled && !isCompleted && (
                  <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <span>🧠</span>
                      <span className="font-medium text-sm">Smart Resume</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Your progress is saved automatically.
                      {enrollment?.last_lesson_id && (
                        <span className="block mt-1 text-blue-400">
                          Last lesson: {lessons.find((l: any) => l.id === enrollment.last_lesson_id)?.title || 'Unknown'}
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Certificate */}
                {certificate && (
                  <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <span>🏆</span>
                      <span className="font-medium text-sm">Certificate Earned</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      Congratulations! You&apos;ve earned your certificate.
                    </p>
                    <div className="text-green-400 text-xs font-mono bg-black/30 rounded-lg px-3 py-2 break-all">
                      {certificate.certificate_id || certificate.id}
                    </div>
                    {certificate.issued_at && (
                      <p className="text-gray-500 text-xs mt-2">
                        Issued: {new Date(certificate.issued_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {/* AI Flashcards promo */}
                {isEnrolled && !isCompleted && (
                  <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-purple-400 mb-2">
                      <span>🃏</span>
                      <span className="font-medium text-sm">AI Flashcards</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Generate smart flashcards from course content to reinforce your learning.
                    </p>
                    <button
                      onClick={() => { setActiveTab('flashcards'); handleGenerateFlashcards() }}
                      disabled={generatingFlashcards}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg text-sm font-medium text-white transition"
                    >
                      {generatingFlashcards ? 'Generating...' : 'Generate Flashcards'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
