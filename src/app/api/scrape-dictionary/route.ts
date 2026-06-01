import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const LETTERS = ['a', 'b', 'ch', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'v', 'w', 'y', 'z']
const PAGES_PER_LETTER = 51 // from haiti-reference.info

async function scrapeWordDetail(id: string): Promise<any | null> {
  try {
    const res = await fetch(`https://www.haiti-reference.info/pages/creole/diction/display.php?action=view&id=${id}`)
    const html = await res.text()
    
    // Extract word, translations, part of speech
    const wordMatch = html.match(/<h2[^>]*class="result_title"[^>]*id="mot"[^>]*>([^<]+)<\/h2>/)
    const kreMatch = html.match(/Kreyòl[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i)
    const engMatch = html.match(/English[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i)
    const freMatch = html.match(/Français[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i)
    const posMatch = html.match(/<span[^>]*class="pos"[^>]*>([^<]+)<\/span>/i)
    const exampleMatch = html.match(/<p[^>]*class="example"[^>]*>([\s\S]*?)<\/p>/i)
    const synonymMatch = html.match(/<span[^>]*class="synonyms"[^>]*>([\s\S]*?)<\/span>/i)
    
    const word = wordMatch ? wordMatch[1].trim().replace(/&egrave;/g, 'è').replace(/&eacute;/g, 'é').replace(/&ograve;/g, 'ò').replace(/&ocirc;/g, 'ô').replace(/&ccedil;/g, 'ç') : null
    
    if (!word) return null
    
    // Extract Kreyòl text from HTML tags
    const stripHtml = (s: string) => s?.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, '').trim() || ''
    
    return {
      word,
      word_creole: stripHtml(kreMatch?.[1]) || word,
      translation_english: stripHtml(engMatch?.[1]) || '',
      translation_french: stripHtml(freMatch?.[1]) || '',
      part_of_speech: posMatch ? posMatch[1].trim().toLowerCase() : 'unknown',
      example_sentence: stripHtml(exampleMatch?.[1]) || '',
      synonyms: synonymMatch ? stripHtml(synonymMatch[1]).split(',').map(s => s.trim()).filter(Boolean) : [],
      audio_url: '',
      category: 'diaspora-archive',
      difficulty: 'beginner',
      tags: ['haiti-reference', 'scraped'],
    }
  } catch {
    return null
  }
}

async function scrapeIndexPage(letter: string, page: number): Promise<string[]> {
  try {
    const url = `https://www.haiti-reference.info/pages/creole/diction/alpha.php?search=${letter}&page=${page}`
    const res = await fetch(url)
    const html = await res.text()
    
    // Extract word IDs from <a href="display.php?action=view&id=XXX"
    const ids: string[] = []
    const regex = /display\.php\?action=view&id=(\d+)/g
    let match
    while ((match = regex.exec(html)) !== null) {
      if (!ids.includes(match[1])) ids.push(match[1])
    }
    return ids
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { letter, page } = await req.json().catch(() => ({ letter: null, page: null }))

  // If no letter/page specified, do a full scrape
  if (!letter || !page) {
    return NextResponse.json({ 
      message: 'Start full scrape',
      letters: LETTERS,
      pagesPerLetter: PAGES_PER_LETTER,
      estimatedTotal: LETTERS.length * PAGES_PER_LETTER * 20,
      hint: 'POST with { letter: "a", page: 1 } to scrape a single page'
    })
  }

  // Scrape a single index page
  const ids = await scrapeIndexPage(letter, page)
  
  let inserted = 0
  let skipped = 0

  // Process in batches of 5 (rate limiting)
  for (const id of ids.slice(0, 20)) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('dictionary_words')
      .select('id')
      .eq('source_id', id)
      .single()
    
    if (existing) { skipped++; continue }
    
    const wordData = await scrapeWordDetail(id)
    if (!wordData) { skipped++; continue }
    
    const { error } = await supabase.from('dictionary_words').insert({
      ...wordData,
      source_id: id,
      source_url: `https://www.haiti-reference.info/pages/creole/diction/display.php?action=view&id=${id}`,
      day_added: 1,
      gender: '',
    })
    
    if (!error) inserted++
    else skipped++
    
    // Rate limit between requests
    await new Promise(r => setTimeout(r, 500))
  }

  return NextResponse.json({
    letter,
    page,
    idsFound: ids.length,
    inserted,
    skipped,
    nextHint: `POST { letter: "${letter}", page: ${page + 1} } for next page`
  })
}

export async function GET() {
  // Get current stats
  const { count } = await supabase
    .from('dictionary_words')
    .select('*', { count: 'exact', head: true })

  return NextResponse.json({
    totalWords: count || 0,
    target: 15028,
    coverage: count ? Math.round((count / 15028) * 100) : 0,
    letters: LETTERS,
    pagesPerLetter: PAGES_PER_LETTER,
  })
}