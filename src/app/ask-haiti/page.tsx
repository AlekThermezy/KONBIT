'use client'

/**
 * ASK HAITI — Source-Backed Knowledge Assistant
 * ===========================================
 * RAG-powered Q&A over Haitian legal, business,
 * health, and cultural documents.
 */

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import LeftSidebar from '@/components/layout/LeftSidebar'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

type Message = {
  id?: string
  role: 'user' | 'assistant'
  content: string
  citations?: string[]
  sources?: Source[]
  timestamp?: string
}

type Source = {
  document_id: string
  title: string
  source: string
  url: string
  excerpt: string
}

type Session = {
  id: string
  title: string
  category: string
  last_message_at: string
}

const CATEGORIES = [
  { key: 'general', label: 'General', icon: '💬' },
  { key: 'legal', label: 'Legal & Constitution', icon: '⚖️' },
  { key: 'business', label: 'Business & Investment', icon: '💼' },
  { key: 'health', label: 'Health & Public Health', icon: '🏥' },
  { key: 'customs', label: 'Customs & Trade', icon: '🚢' },
  { key: 'cultural', label: 'Culture & History', icon: '🏛️' },
]

const EXAMPLE_QUESTIONS: Record<string, string[]> = {
  general: [
    'How do I start a business in Haiti?',
    'What documents do I need to work legally?',
  ],
  legal: [
    'What does the 1987 constitution say about property rights?',
    'What are the labor law requirements for hiring employees?',
  ],
  business: [
    'What forms do I need to create a société anonyme?',
    'What tax obligations does an SME have in Haiti?',
  ],
  health: [
    'What are the main public health priorities in Haiti?',
    'What is the cholera situation based on official reports?',
  ],
  customs: [
    'What documents are required to import goods into Haiti?',
    'What are the customs tariff rates for common goods?',
  ],
  cultural: [
    'What are the main Haitian national holidays?',
    'How do I navigate Haitian business culture as a diaspora member?',
  ],
}

export default function AskHaitiPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeCategory, setActiveCategory] = useState('general')
  const [sessionsOpen, setSessionsOpen] = useState(false)
  const [showExamples, setShowExamples] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u)
      setLoading(false)
      if (u) loadSessions()
    })
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadSessions() {
    const { data } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('last_message_at', { ascending: false })
      .limit(20)
    setSessions(data || [])
  }

  async function loadSessionMsgs(sid: string) {
    setSessionId(sid)
    setShowExamples(false)
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sid)
      .order('created_at', { ascending: true })
    if (data) {
      setMessages(data.map(m => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        citations: m.citations,
        sources: (m.context_doc_ids || []).map((docId: string, i: number) => ({
          document_id: docId,
          title: '',
          source: m.citations?.[i] || '',
          url: '',
          excerpt: m.context_excerpts?.[i] || '',
        })),
        timestamp: m.created_at,
      })))
    }
  }

  async function sendMessage(question?: string) {
    const q = (question || input).trim()
    if (!q || sending) return

    setShowExamples(false)
    if (!question) setInput('')
    setSending(true)

    // Add user message immediately
    const userMsg: Message = { role: 'user', content: q }
    setMessages(prev => [...prev, userMsg])

    try {
      const res = await fetch('/api/ask-haiti/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, sessionId, category: activeCategory }),
      })

      const data = await res.json()

      if (data.answer) {
        const assistantMsg: Message = {
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
          citations: data.sources?.map((s: Source) => `${s.title} — ${s.source}`) || [],
        }
        setMessages(prev => [...prev, assistantMsg])
        if (data.sessionId) setSessionId(data.sessionId)
        loadSessions()
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Erreur de connexion. Réessayez dans un moment.',
      }])
    }

    setSending(false)
  }

  function newConversation() {
    setMessages([])
    setSessionId(null)
    setShowExamples(true)
    setSessionsOpen(false)
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
      <LeftSidebar />
      <Navbar />

      <main className="ml-64 pt-16 h-screen flex flex-col">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border border-green-700/40 rounded-full text-green-400 text-xs font-bold mb-3">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                ASK HAITI — β BETA
              </div>
              <h1 className="text-2xl font-black">
                <span className="text-green-500">Ask</span>
                <span className="text-white"> Haiti</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Réponses ancrées dans les sources · Réponses with source citations
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSessionsOpen(!sessionsOpen)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white transition"
              >
                💬 History
              </button>
              <button
                onClick={newConversation}
                className="px-3 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-sm text-white transition"
              >
                + New
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); if (messages.length === 0) setShowExamples(true) }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  activeCategory === cat.key
                    ? 'bg-green-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto border border-white/10 rounded-2xl bg-white/3 mb-4">

            {/* Session history sidebar */}
            {sessionsOpen && (
              <div className="border-b border-white/10 p-4">
                <div className="text-xs text-gray-500 font-bold uppercase mb-3">Past Conversations</div>
                <div className="space-y-1">
                  {sessions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => loadSessionMsgs(s.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        sessionId === s.id ? 'bg-green-900/30 text-green-400' : 'hover:bg-white/5 text-gray-400'
                      }`}
                    >
                      <div className="truncate">{s.title}</div>
                      <div className="text-xs text-gray-600">{new Date(s.last_message_at).toLocaleDateString()}</div>
                    </button>
                  ))}
                  {sessions.length === 0 && (
                    <div className="text-gray-600 text-sm text-center py-4">No conversations yet</div>
                  )}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="p-6 space-y-4">
              {messages.length === 0 && !showExamples && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🏛️</div>
                  <h3 className="text-white font-bold text-lg mb-2">Ask Haiti</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Get answers backed by Haitian legal, business, health, and cultural documents.
                  </p>
                </div>
              )}

              {/* Example questions */}
              {showExamples && (
                <div className="mb-4">
                  <div className="text-xs text-gray-500 font-bold uppercase mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Try asking
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(EXAMPLE_QUESTIONS[activeCategory] || EXAMPLE_QUESTIONS.general).map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="text-left p-3 bg-white/5 border border-white/10 rounded-xl hover:border-green-500/30 transition text-sm text-gray-300"
                      >
                        {q}
                        <span className="block text-xs text-gray-600 mt-1">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message list */}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-green-700 text-white'
                      : 'bg-white/8 border border-white/10'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>

                    {/* Sources / Citations */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="text-xs text-gray-500 font-bold uppercase mb-2">📄 Sources</div>
                        {msg.sources.map((src, j) => (
                          <div key={j} className="text-xs mb-2">
                            <div className="text-green-400">{src.title || 'Document'}</div>
                            <div className="text-gray-500">{src.source}</div>
                            {src.url && (
                              <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">
                                View original →
                              </a>
                            )}
                            {src.excerpt && (
                              <div className="text-gray-600 italic mt-1 line-clamp-2 border-l-2 border-green-900 pl-2">
                                "{src.excerpt}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.citations && msg.citations.length > 0 && !msg.sources && (
                      <div className="mt-2 text-xs text-gray-500">
                        Based on: {msg.citations.join(' · ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white/8 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Ask about Haitian laws, business rules, health documents..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 resize-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || sending}
                className="absolute right-3 bottom-3 w-8 h-8 bg-green-600 hover:bg-green-500 disabled:bg-white/10 disabled:text-gray-600 rounded-xl flex items-center justify-center transition"
              >
                {sending ? '...' : '→'}
              </button>
            </div>
          </div>

          {/* Trust notice */}
          <div className="text-center text-xs text-gray-600 mt-3">
            Responses are source-grounded. If no relevant documents are found, the assistant will say so.
          </div>
        </div>
      </main>
    </div>
  )
}