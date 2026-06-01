import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _require = (m: string) => { try { return require(m) } catch { return null } }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Chunk size for RAG (characters)
const CHUNK_SIZE = 800
const CHUNK_OVERLAP = 100

// ── Helpers ─────────────────────────────────────────────

function chunkText(text: string, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  const chunks: string[] = []
  let start = 0
  text = text.replace(/\s+/g, ' ').trim()
  if (text.length === 0) return chunks

  while (start < text.length) {
    let end = start + chunkSize
    // Try to break at sentence boundary
    if (end < text.length) {
      const sentenceBreak = text.lastIndexOf('. ', end)
      const lineBreak = text.lastIndexOf('\n', end)
      const breakPoint = Math.max(sentenceBreak, lineBreak)
      if (breakPoint > start + chunkSize * 0.5) {
        end = breakPoint + 1
      }
    }
    chunks.push(text.slice(start, end).trim())
    start = end - overlap
  }
  return chunks
}

function detectLanguage(text: string): string {
  const frenchIndicators = ['é', 'è', 'ê', 'à', 'ç', 'un', 'une', 'les', 'des', 'est', 'sont', 'pour', 'dans', 'avec', 'sur']
  const kreyolIndicators = ['ap', 'pou', 'nan', 'yo', 'se', 'li', 'la', 'pa', 'ki', 'ak', 'sa a', 'ou']
  const englishIndicators = ['the', 'is', 'are', 'and', 'for', 'with', 'this', 'that']

  let fr = 0, ht = 0, en = 0
  const sample = text.toLowerCase().slice(0, 500)
  frenchIndicators.forEach(w => { if (sample.includes(w)) fr++ })
  kreyolIndicators.forEach(w => { if (sample.includes(w)) ht++ })
  englishIndicators.forEach(w => { if (sample.includes(w)) en++ })

  if (ht > fr && ht > en) return 'ht'
  if (fr > en) return 'fr'
  return 'en'
}

async function fetchAndParsePDF(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KONBIT/1.0)' }
  })
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  const buffer = await response.arrayBuffer()

  // Try pdf-parse dynamically (server-only, optional dependency)
  try {
    const pdfParse = _require('pdf-parse')
    const data = await pdfParse(Buffer.from(buffer))
    return data.text || ''
  } catch {
    // Fallback: return placeholder text with metadata if parsing fails
    return `[Document from ${url}] — Full text extraction requires pdf-parse package. Document metadata stored; full content available at source URL.`
  }
}

async function fetchAndParseHTML(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KONBIT/1.0)' }
  })
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
  const html = await response.text()

  // Strip HTML tags, keep text
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim()
}

// ── Ingest a single document ────────────────────────────

async function ingestDocument(url: string, metadata: {
  title: string
  description?: string
  source_name: string
  source_type: string
  category: string
  subcategory?: string
  language?: string
  file_type: string
  trust_tier?: string
  publication_date?: string
}) {
  // Check if already exists
  const { data: existing } = await supabase
    .from('documents')
    .select('id')
    .eq('source_url', url)
    .single()

  if (existing) return { status: 'skipped', reason: 'already exists', docId: existing.id }

  // Fetch content
  let text = ''
  if (metadata.file_type === 'pdf' || url.endsWith('.pdf')) {
    text = await fetchAndParsePDF(url)
  } else {
    text = await fetchAndParseHTML(url)
  }

  if (text.length < 100) {
    return { status: 'failed', reason: 'content too short or unreadable', url }
  }

  // Auto-detect language
  const language = metadata.language || detectLanguage(text)

  // Insert document
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .insert({
      title: metadata.title,
      description: metadata.description || text.slice(0, 300),
      source_url: url,
      source_name: metadata.source_name,
      source_type: metadata.source_type,
      category: metadata.category,
      subcategory: metadata.subcategory,
      language,
      file_url: url,
      file_type: metadata.file_type,
      is_parsed: true,
      trust_tier: metadata.trust_tier || 'medium',
      publication_date: metadata.publication_date ? new Date(metadata.publication_date) : null,
    })
    .select()
    .single()

  if (docError) return { status: 'failed', reason: docError.message, url }

  // Chunk text
  const chunks = chunkText(text)
  const chunkRecords = chunks.map((chunk_text, i) => ({
    document_id: doc.id,
    chunk_text,
    chunk_index: i,
    source_segment: chunk_text.slice(0, 200),
    embedding_status: 'pending',
  }))

  const { error: chunkError } = await supabase
    .from('document_chunks')
    .insert(chunkRecords)

  if (chunkError) return { status: 'failed', reason: chunkError.message, url }

  return {
    status: 'done',
    docId: doc.id,
    chunksCreated: chunks.length,
    language,
    textLength: text.length,
  }
}

// ── Route handlers ──────────────────────────────────────

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)

  // Batch mode: seed from verified links file
  if (body?.action === 'seed_batch') {
    const { documents } = body
    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json({ error: 'Missing documents array' }, { status: 400 })
    }

    const results = []
    for (const doc of documents.slice(0, 20)) {
      try {
        const result = await ingestDocument(doc.url, doc.metadata)
        results.push({ title: doc.metadata.title, ...result })
        await new Promise(r => setTimeout(r, 1000)) // Rate limit
      } catch (e: any) {
        results.push({ title: doc.metadata.title, status: 'failed', reason: e.message })
      }
    }

    return NextResponse.json({ seeded: results.length, results })
  }

  // Single document ingest
  if (body?.url && body?.metadata) {
    try {
      const result = await ingestDocument(body.url, body.metadata)
      return NextResponse.json(result)
    } catch (e: any) {
      return NextResponse.json({ status: 'failed', reason: e.message }, { status: 500 })
    }
  }

  // Get stats
  const { count: docCount } = await supabase
    .from('documents').select('*', { count: 'exact', head: true })

  const { count: chunkCount } = await supabase
    .from('document_chunks').select('*', { count: 'exact', head: true })

  const { count: pendingChunks } = await supabase
    .from('document_chunks')
    .select('*', { count: 'exact', head: true })
    .eq('embedding_status', 'pending')

  return NextResponse.json({
    documents: docCount || 0,
    chunks: chunkCount || 0,
    chunksPendingEmbedding: pendingChunks || 0,
    hint: 'POST { url, metadata } to ingest a document, or POST { action: "seed_batch", documents: [...] } for batch'
  })
}

export async function GET() {
  // List recent documents
  const { data: docs } = await supabase
    .from('documents')
    .select('id, title, source_name, category, language, is_parsed, created_at')
    .order('created_at', { ascending: false })
    .limit(20)

  return NextResponse.json({ documents: docs || [] })
}