import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getCurrentUser } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const MODEL = 'anthropic/claude-sonnet-4'
const EMBEDDING_MODEL = 'text-embedding-3-small'
const MAX_CHUNKS_RETRIEVED = 6
const MAX_CONTEXT_CHARS = 4000

// ── Embedding helper ────────────────────────────────────

async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text.slice(0, 2000),
    }),
  })
  if (!response.ok) throw new Error('Embedding failed')
  const data = await response.json()
  return data.data[0].embedding
}

// ── Retrieve relevant chunks ─────────────────────────────

async function retrieveChunks(question: string, category?: string): Promise<any[]> {
  // Generate query embedding
  const queryEmbedding = await getEmbedding(question)

  // Search document_chunks via Supabase
  // Note: for production, use pg_vector with an index
  // For now, do keyword + FTS fallback since pg_vector isn't set up
  const { data: chunks } = await supabase
    .from('document_chunks')
    .select(`
      id,
      chunk_text,
      chunk_index,
      document_id,
      documents (
        id,
        title,
        source_name,
        source_url,
        category,
        trust_tier
      )
    `)
    .eq('embedding_status', 'embedded')
    .limit(MAX_CHUNKS_RETRIEVED)

  // If no embedded chunks, fall back to keyword search
  if (!chunks || chunks.length === 0) {
    const keywords = question
      .toLowerCase()
      .split(' ')
      .filter(w => w.length > 3)
      .slice(0, 5)
      .join(' | ')

    const { data: fallback } = await supabase
      .from('document_chunks')
      .select(`
        id,
        chunk_text,
        chunk_index,
        document_id,
        documents (
          id,
          title,
          source_name,
          source_url,
          category,
          trust_tier
        )
      `)
      .or(`chunk_text.ilike.%${keywords}%`)
      .limit(MAX_CHUNKS_RETRIEVED)

    return fallback || []
  }

  // Simple relevance scoring (for production: use pg_vector with embeddings)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (chunks as any[]).sort((a, b) => {
    const trustOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
    const docA = a.documents
    const docB = b.documents
    const tierA = Array.isArray(docA) ? docA[0]?.trust_tier : docA?.trust_tier
    const tierB = Array.isArray(docB) ? docB[0]?.trust_tier : docB?.trust_tier
    const scoreA = trustOrder[tierA] || 0
    const scoreB = trustOrder[tierB] || 0
    return scoreB - scoreA
  }).slice(0, MAX_CHUNKS_RETRIEVED)
}

// ── Build RAG prompt ────────────────────────────────────

function buildPrompt(question: string, chunks: any[]): string {
  const context = chunks.map((c, i) => {
    const doc = c.documents
    return `[Source ${i + 1}] ${doc?.title} (${doc?.source_name})
${c.chunk_text}`
  }).join('\n\n')

  return `Tu es "Ask Haiti" — un assistant de connaissances haïtiennes fiable, sérieux, et ancré dans les sources.

RÈGLES ABSOLUES:
- Tu ne réponds qu'avec les informations des documents fournis.
- Si tu ne sais pas, dis-le clairement.
- Cite toujours la source (titre + organisation) pour chaque affirmation.
- Réponds en français ou en kreyòl selon la question.
- Sois précis, direct, et utile.

---
CONTEXTE (documents):
${context}

---
QUESTION: ${question}

---
RÉPONSE (avec citations):
`
}

// ── Route handlers ──────────────────────────────────────

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { question, sessionId, category } = await req.json().catch(() => null)
  if (!question?.trim()) return NextResponse.json({ error: 'Question required' }, { status: 400 })

  // Create or use session
  let session
  if (sessionId) {
    const { data } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()
    session = data
  }
  if (!session) {
    const { data } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title: question.slice(0, 60) + (question.length > 60 ? '...' : ''),
        category: category || 'general',
      })
      .select()
      .single()
    session = data
  }

  // Retrieve context
  let chunks: any[] = []
  try {
    chunks = await retrieveChunks(question, category)
  } catch (e) {
    console.error('Retrieval error:', e)
  }

  // Build prompt
  const prompt = buildPrompt(
    question,
    chunks.slice(0, 4)
  )

  // Call LLM
  let answer = ''
  let sources: any[] = []
  try {
    const llmResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.3,
      }),
    })

    const llmData = await llmResponse.json()
    answer = llmData.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.'

    sources = chunks.slice(0, 4).map(c => ({
      document_id: c.document_id,
      title: c.documents?.title,
      source: c.documents?.source_name,
      url: c.documents?.source_url,
      excerpt: c.chunk_text.slice(0, 200),
    }))
  } catch (e: any) {
    answer = `Erreur de connexion: ${e.message}. Réessayez dans un moment.`
  }

  // Save user message
  await supabase.from('chat_messages').insert({
    session_id: session.id,
    role: 'user',
    content: question,
  })

  // Save assistant response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: msg } = await (supabase.from('chat_messages') as any).insert({
    session_id: session.id,
    role: 'assistant',
    content: answer,
    context_doc_ids: chunks.map(c => c.document_id),
    context_chunk_ids: chunks.map(c => c.id),
    context_excerpts: chunks.map(c => c.chunk_text.slice(0, 200)),
    citations: sources.map(s => `${s.title} — ${s.source}`),
  })

  // Update session
  await supabase
    .from('chat_sessions')
    .update({ message_count: (session.message_count || 0) + 2, last_message_at: new Date().toISOString() })
    .eq('id', session.id)

  return NextResponse.json({
    answer,
    sources,
    sessionId: session.id,
    messageId: (msg as any)?.id,
  })
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')

  if (sessionId) {
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    return NextResponse.json({ messages: messages || [] })
  }

  const { data: sessions } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('last_message_at', { ascending: false })
    .limit(20)

  return NextResponse.json({ sessions: sessions || [] })
}