import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const BG_DIR = join(process.cwd(), 'public/images/backgrounds')
const CURRENT_FILE = join(BG_DIR, 'current.txt')
const MANIFEST_FILE = join(BG_DIR, 'manifest.json')

interface BackgroundImage {
  filename: string
  title?: string
  source_url?: string
  thumb_url?: string
  added_at?: string
}

interface Manifest {
  version: number
  images: BackgroundImage[]
  current: string | null
  last_sync: string | null
}

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let current = 'Haitian_Carnival'
    if (existsSync(CURRENT_FILE)) {
      current = readFileSync(CURRENT_FILE, 'utf-8').trim()
    }

    const imagePath = `/images/backgrounds/${current}`
    const imageUrl  = `https://konbit.io${imagePath}`

    let manifest: Manifest = { version: 1, images: [], current: null, last_sync: null }
    if (existsSync(MANIFEST_FILE)) {
      try {
        manifest = JSON.parse(readFileSync(MANIFEST_FILE, 'utf-8'))
      } catch {}
    }

    const currentImage: BackgroundImage | undefined =
      (manifest as Manifest).images.find(i => i.filename === current)

    return NextResponse.json({
      image:       current,
      imageUrl,
      imagePath,
      title:       currentImage?.title     || current,
      sourceUrl:   currentImage?.source_url || null,
      imageCount:  (manifest as Manifest).images.length,
      lastSync:    (manifest as Manifest).last_sync || null,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load background' }, { status: 500 })
  }
}
