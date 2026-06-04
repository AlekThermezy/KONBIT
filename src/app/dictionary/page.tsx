'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import SlideSidebar from '@/components/layout/SlideSidebar'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'greetings', label: '👋 Greetings' },
  { key: 'everyday', label: '🏠 Everyday' },
  { key: 'food', label: '🍚 Food' },
  { key: 'business', label: '💼 Business' },
  { key: 'numbers', label: '🔢 Numbers' },
  { key: 'questions', label: '❓ Questions' },
  { key: 'family', label: '👨‍👩‍👧 Family' },
  { key: 'time', label: '⏰ Time' },
]

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-green-400 bg-green-400/10',
  intermediate: 'text-amber-400 bg-amber-400/10',
  advanced: 'text-red-400 bg-red-400/10',
}

const POS_LABELS: Record<string, string> = {
  noun: 'n',
  verb: 'v',
  adj: 'adj',
  adverb: 'adv',
  pronoun: 'pron',
  preposition: 'prep',
  conjunction: 'conj',
  interjection: 'interj',
  phrase: 'phr',
  expression: 'expr',
  idiom: 'idiom',
}

type Word = {
  id: string
  word: string
  word_creole: string
  pronunciation: string
  translation_english: string
  translation_french: string
  translation_spanish: string
  part_of_speech: string
  gender: string
  example_sentence: string
  example_translation: string
  synonyms: string[]
  category: string
  difficulty: string
  tags: string[]
  audio_url: string
  created_at: string
}

export default function DictionaryPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [words, setWords] = useState<Word[]>([])
  const [filtered, setFiltered] = useState<Word[]>([])
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeDifficulty, setActiveDifficulty] = useState('all')
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const [stats, setStats] = useState({ total: 0, categories: 0, day: 1 })

  // Study mode state
  const [mode, setMode] = useState<'browse' | 'study'>('browse')
  const [studyDeck, setStudyDeck] = useState<Word[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studiedCount, setStudiedCount] = useState(0)
  const [masteredCount, setMasteredCount] = useState(0)
  const [masteredWordIds, setMasteredWordIds] = useState<Set<string>>(new Set())
  const [studyStarted, setStudyStarted] = useState(false)

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    loadWords()
  }, [])

  // Load mastered words when user loads
  useEffect(() => {
    if (user) {
      loadMasteredWords()
    } else {
      setMasteredWordIds(new Set())
    }
  }, [user])

  useEffect(() => {
    // Filter logic
    let result = words

    if (activeCategory !== 'all') {
      result = result.filter(w => w.category === activeCategory)
    }

    if (activeDifficulty !== 'all') {
      result = result.filter(w => w.difficulty === activeDifficulty)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(w =>
        w.word.toLowerCase().includes(q) ||
        w.word_creole.toLowerCase().includes(q) ||
        w.translation_english.toLowerCase().includes(q)
      )
    }

    setFiltered(result)
  }, [search, activeCategory, activeDifficulty, words])

  async function loadWords() {
    const { data } = await supabase
      .from('dictionary_words')
      .select('*')
      .order('day_added', { ascending: true })
      .order('word', { ascending: true })

    if (data) {
      // Deduplicate — keep first occurrence of each unique word
      const seen = new Set<string>()
      const unique = data.filter((w: Word) => {
        if (seen.has(w.word)) return false
        seen.add(w.word)
        return true
      })
      setWords(unique)
      setFiltered(unique)
      setStats({
        total: unique.length,
        categories: new Set(unique.map((w: any) => w.category)).size,
        day: Math.max(...unique.map((w: any) => w.day_added ?? 1)),
      })
    }
  }

  async function loadMasteredWords() {
    if (!user) return
    const { data } = await supabase
      .from('user_dictionary')
      .select('word_id')
      .eq('user_id', user.id)
    if (data) {
      setMasteredWordIds(new Set(data.map((d: any) => d.word_id)))
    }
  }

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  function startStudy() {
    let deck = words
    if (activeCategory !== 'all') deck = deck.filter(w => w.category === activeCategory)
    if (activeDifficulty !== 'all') deck = deck.filter(w => w.difficulty === activeDifficulty)
    if (search.trim()) {
      const q = search.toLowerCase()
      deck = deck.filter(w =>
        w.word.toLowerCase().includes(q) ||
        w.word_creole.toLowerCase().includes(q) ||
        w.translation_english.toLowerCase().includes(q)
      )
    }
    // Exclude already-mastered words
    deck = deck.filter(w => !masteredWordIds.has(w.id))
    const shuffled = shuffleArray(deck)
    setStudyDeck(shuffled)
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setStudiedCount(0)
    setMasteredCount(0)
    setStudyStarted(true)
  }

  async function handleGotIt() {
    const word = studyDeck[currentCardIndex]
    if (!word) return
    // Upsert to user_dictionary to save progress
    if (user) {
      await supabase.from('user_dictionary').upsert({
        user_id: user.id,
        word_id: word.id,
      })
      const next = new Set(masteredWordIds)
      next.add(word.id)
      setMasteredWordIds(next)
    }
    setMasteredCount(prev => prev + 1)
    setStudiedCount(prev => prev + 1)
    advanceCard()
  }

  function handleStillLearning() {
    setStudiedCount(prev => prev + 1)
    advanceCard()
  }

  function advanceCard() {
    if (currentCardIndex < studyDeck.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
      setIsFlipped(false)
    } else {
      // Deck complete — reset to start screen
      setStudyStarted(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-black">
              <span className="text-green-500">Kreyòl</span>
              <span className="text-white"> / English</span>
              <span className="text-gray-500 text-lg ml-3">Dictionnaire</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {stats.total} words · {stats.categories} categories · Day {stats.day} batch
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-6 flex justify-center">
            <div className="bg-white/5 border border-white/10 rounded-full p-1 inline-flex relative">
              <button
                onClick={() => { setMode('browse'); setStudyStarted(false); }}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  mode === 'browse'
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                📖 Browse
              </button>
              <button
                onClick={() => { setMode('study'); }}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  mode === 'study'
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                🃏 Study
              </button>
              {/* Animated pill background */}
              <div
                className={`absolute top-1 bottom-1 rounded-full bg-green-600 transition-all duration-300 ease-out ${
                  mode === 'browse' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
                }`}
              />
            </div>
          </div>

          {/* Browse Mode */}
          {mode === 'browse' && (
            <>
              {/* Progress Bar — Day Progress */}
          <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">Daily Goal: 50 words</div>
              <div className="text-sm text-green-500 font-medium">{stats.total} / 50 today</div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all"
                style={{ width: `${Math.min(100, (stats.total / 50) * 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Next batch: Day {stats.day + 1} · {stats.total < 50 ? `${50 - stats.total} words remaining today` : '✅ Day complete'}
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search in Kreyòl or English..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-2 mb-6">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    activeCategory === cat.key
                      ? 'bg-green-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Difficulty */}
            <div className="flex gap-2 ml-auto">
              {['all', 'beginner', 'intermediate', 'advanced'].map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDifficulty(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                    activeDifficulty === d
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-gray-500 hover:bg-white/10'
                  }`}
                >
                  {d === 'all' ? 'All Levels' : d}
                </button>
              ))}
            </div>
          </div>

          {/* Word Count + Reset */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-500 text-sm">
              Showing {filtered.length} of {words.length} words
            </div>
            {(search || activeCategory !== 'all' || activeDifficulty !== 'all') && (
              <button
                onClick={() => { setSearch(''); setActiveCategory('all'); setActiveDifficulty('all'); }}
                className="text-green-500 text-sm hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Word Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(word => (
              <button
                key={word.id}
                onClick={() => setSelectedWord(word)}
                className="text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:border-green-500/30 hover:bg-white/8 transition group"
              >
                {/* Word */}
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="text-white font-bold text-lg leading-tight">{word.word}</div>
                    <div className="text-green-400 text-sm">{word.word_creole}</div>
                  </div>
                  {word.part_of_speech && (
                    <span className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded mt-0.5">
                      {POS_LABELS[word.part_of_speech] || word.part_of_speech}
                    </span>
                  )}
                </div>

                {/* Translation */}
                <div className="text-gray-400 text-sm mb-2">{word.translation_english}</div>

                {/* Example */}
                {word.example_sentence && (
                  <div className="text-gray-600 text-xs italic line-clamp-1 mb-2">
                    "{word.example_sentence}"
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center gap-2">
                  {word.difficulty && (
                    <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${DIFFICULTY_COLORS[word.difficulty] || ''}`}>
                      {word.difficulty}
                    </span>
                  )}
                  {word.category && (
                    <span className="text-xs text-gray-600 capitalize">
                      {word.category}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-3xl mb-3">📖</div>
              <div className="text-white font-medium mb-2">No words found</div>
              <div className="text-gray-400 text-sm">
                {search ? `No matches for "${search}" — try a different search` : 'Words are loading... check back soon'}
              </div>
            </div>
          )}
            </>
          )}

          {/* Study Mode */}
          {mode === 'study' && (
            <>
              {/* Search — also filters study deck */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setStudyStarted(false); }}
                    placeholder="Search in Kreyòl or English..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                </div>
              </div>

              {/* Filters Row — filters study deck */}
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => { setActiveCategory(cat.key); setStudyStarted(false); }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        activeCategory === cat.key
                          ? 'bg-green-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 ml-auto">
                  {['all', 'beginner', 'intermediate', 'advanced'].map(d => (
                    <button
                      key={d}
                      onClick={() => { setActiveDifficulty(d); setStudyStarted(false); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                        activeDifficulty === d
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      {d === 'all' ? 'All Levels' : d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Content */}
              {!studyStarted ? (
                /* Start Studying Screen */
                <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
                  <div className="text-5xl mb-4">🃏</div>
                  <h2 className="text-2xl font-black text-white mb-2">Flashcard Study Mode</h2>
                  <p className="text-gray-400 mb-2">
                    Practice {words.filter(w => {
                      if (activeCategory !== 'all' && w.category !== activeCategory) return false
                      if (activeDifficulty !== 'all' && w.difficulty !== activeDifficulty) return false
                      if (search.trim()) {
                        const q = search.toLowerCase()
                        if (!w.word.toLowerCase().includes(q) && !w.word_creole.toLowerCase().includes(q) && !w.translation_english.toLowerCase().includes(q)) return false
                      }
                      return !masteredWordIds.has(w.id)
                    }).length} words with interactive flashcards
                  </p>
                  {user && masteredWordIds.size > 0 && (
                    <p className="text-green-500 text-sm mb-4">
                      ✅ {masteredWordIds.size} words already mastered — excluded from deck
                    </p>
                  )}
                  {!user && (
                    <p className="text-amber-400 text-sm mb-4">
                      ⚠️ Log in to save your study progress
                    </p>
                  )}
                  <button
                    onClick={startStudy}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-bold text-lg transition-all hover:scale-105 active:scale-95"
                  >
                    🚀 Start Studying
                  </button>
                </div>
              ) : (
                /* Active Flashcard Session */
                <div className="space-y-6">
                  {/* Progress Display */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-400 text-sm">
                        Card {currentCardIndex + 1} of {studyDeck.length}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-500">✅ {masteredCount} mastered today</span>
                        {user && <span className="text-gray-500">🔥 Streak active</span>}
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${studyDeck.length > 0 ? ((currentCardIndex) / studyDeck.length) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {studiedCount} reviewed · {studyDeck.length - currentCardIndex - 1} remaining
                    </div>
                  </div>

                  {/* Flashcard */}
                  <div
                    className="flex justify-center"
                    style={{ perspective: '1000px' }}
                  >
                    <div
                      className="relative w-full max-w-md cursor-pointer select-none"
                      style={{ minHeight: '280px' }}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <div
                        className="relative w-full h-full transition-all duration-500"
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          minHeight: '280px',
                        }}
                      >
                        {/* Front Face — Kreyol Word */}
                        <div
                          className="absolute inset-0 rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col items-center justify-center"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          {/* Category + Difficulty Badges */}
                          <div className="flex gap-2 mb-4">
                            {studyDeck[currentCardIndex]?.category && (
                              <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full capitalize">
                                {studyDeck[currentCardIndex].category}
                              </span>
                            )}
                            {studyDeck[currentCardIndex]?.difficulty && (
                              <span className={`text-xs px-2 py-1 rounded-full capitalize ${DIFFICULTY_COLORS[studyDeck[currentCardIndex].difficulty] || ''}`}>
                                {studyDeck[currentCardIndex].difficulty}
                              </span>
                            )}
                          </div>

                          {/* Kreyol Word */}
                          <div className="text-5xl font-black text-green-400 mb-3 text-center">
                            {studyDeck[currentCardIndex]?.word_creole}
                          </div>

                          {/* Pronunciation */}
                          {studyDeck[currentCardIndex]?.pronunciation && (
                            <div className="text-gray-500 text-lg">
                              [{studyDeck[currentCardIndex].pronunciation}]
                            </div>
                          )}

                          {/* Tap hint */}
                          <div className="mt-6 text-gray-600 text-xs">
                            👆 Tap to reveal
                          </div>
                        </div>

                        {/* Back Face — Translation */}
                        <div
                          className="absolute inset-0 rounded-2xl bg-white/5 border border-green-500/20 p-8 flex flex-col items-center justify-center"
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          {/* Translation */}
                          <div className="text-3xl font-bold text-white mb-4 text-center">
                            {studyDeck[currentCardIndex]?.translation_english}
                          </div>

                          {/* Part of speech */}
                          {studyDeck[currentCardIndex]?.part_of_speech && (
                            <span className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded mb-3">
                              {POS_LABELS[studyDeck[currentCardIndex].part_of_speech] || studyDeck[currentCardIndex].part_of_speech}
                            </span>
                          )}

                          {/* Example Sentence */}
                          {studyDeck[currentCardIndex]?.example_sentence && (
                            <div className="text-center">
                              <div className="text-gray-500 text-xs mb-1">📝 Example</div>
                              <div className="text-gray-300 text-sm italic">
                                "{studyDeck[currentCardIndex].example_sentence}"
                              </div>
                              {studyDeck[currentCardIndex]?.example_translation && (
                                <div className="text-gray-500 text-xs mt-1">
                                  → {studyDeck[currentCardIndex].example_translation}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Tap hint */}
                          <div className="mt-4 text-gray-600 text-xs">
                            👆 Tap to flip back
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Answer Buttons */}
                  {isFlipped && (
                    <div className="flex gap-3 max-w-md mx-auto">
                      <button
                        onClick={handleStillLearning}
                        className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-gray-300 font-medium transition-all active:scale-95"
                      >
                        🔄 Still Learning
                      </button>
                      <button
                        onClick={handleGotIt}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-bold transition-all active:scale-95"
                      >
                        ✅ Got It!
                      </button>
                    </div>
                  )}

                  {/* Tap to flip hint when not flipped */}
                  {!isFlipped && (
                    <div className="text-center text-gray-600 text-sm">
                      Tap the card to reveal the answer
                    </div>
                  )}
                </div>
              )}

              {/* Study Deck Summary — show after session complete */}
              {!studyStarted && studiedCount > 0 && (
                <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <h3 className="text-xl font-bold text-white mb-1">Session Complete!</h3>
                  <p className="text-gray-400 mb-3">
                    You reviewed <span className="text-white font-bold">{studiedCount}</span> cards and mastered{' '}
                    <span className="text-green-400 font-bold">{masteredCount}</span> words this session.
                  </p>
                  <button
                    onClick={startStudy}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium transition-all"
                  >
                    🔄 Study Again
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <SlideSidebar />

      {/* Word Detail Modal */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedWord(null)}>
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedWord(null)} />
          <div
            className="relative bg-gray-950 border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedWord(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl"
            >
              ✕
            </button>

            {/* Main word */}
            <div className="mb-4">
              <div className="text-4xl font-black text-white mb-1">{selectedWord.word}</div>
              <div className="text-green-400 text-xl">{selectedWord.word_creole}</div>
              {selectedWord.pronunciation && (
                <div className="text-gray-500 text-sm mt-1">[{selectedWord.pronunciation}]</div>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedWord.part_of_speech && (
                <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded capitalize">
                  {POS_LABELS[selectedWord.part_of_speech] || selectedWord.part_of_speech}
                </span>
              )}
              {selectedWord.difficulty && (
                <span className={`text-xs px-2 py-1 rounded capitalize ${DIFFICULTY_COLORS[selectedWord.difficulty] || ''}`}>
                  {selectedWord.difficulty}
                </span>
              )}
              {selectedWord.category && (
                <span className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded capitalize">
                  {selectedWord.category}
                </span>
              )}
            </div>

            {/* Translations */}
            <div className="space-y-3 mb-5">
              <div className="border-b border-white/10 pb-3">
                <div className="text-xs text-gray-500 mb-1">🇺🇸 English</div>
                <div className="text-white font-medium">{selectedWord.translation_english}</div>
              </div>
              {selectedWord.translation_french && (
                <div className="border-b border-white/10 pb-3">
                  <div className="text-xs text-gray-500 mb-1">🇫🇷 Français</div>
                  <div className="text-white font-medium">{selectedWord.translation_french}</div>
                </div>
              )}
              {selectedWord.translation_spanish && (
                <div className="border-b border-white/10 pb-3">
                  <div className="text-xs text-gray-500 mb-1">🇪🇸 Español</div>
                  <div className="text-white font-medium">{selectedWord.translation_spanish}</div>
                </div>
              )}
            </div>

            {/* Example */}
            {selectedWord.example_sentence && (
              <div className="mb-5">
                <div className="text-xs text-gray-500 mb-2">📝 Example</div>
                <div className="text-white italic mb-1">"{selectedWord.example_sentence}"</div>
                {selectedWord.example_translation && (
                  <div className="text-gray-400 text-sm">→ {selectedWord.example_translation}</div>
                )}
              </div>
            )}

            {/* Synonyms */}
            {selectedWord.synonyms && selectedWord.synonyms.length > 0 && (
              <div className="mb-5">
                <div className="text-xs text-gray-500 mb-2">🔗 Synonyms</div>
                <div className="flex flex-wrap gap-2">
                  {selectedWord.synonyms.map((s: string) => (
                    <span key={s} className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button (if logged in) */}
            {user && (
              <button
                onClick={() => {
                  // Save to user dictionary
                  supabase.from('user_dictionary').upsert({
                    user_id: user.id,
                    word_id: selectedWord.id,
                  })
                  alert('Word saved to your dictionary!')
                }}
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium transition"
              >
                💾 Save to My Dictionary
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}