import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { name, choice, city, country } = await req.json()

    const { data, error } = await supabase
      .from('lita_responses')
      .insert([{
        name: name || 'Lita',
        choice,
        city: city || 'Unknown',
        country: country || 'Unknown',
        responded_at: new Date().toISOString(),
        notified: false
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data.id })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 })
  }
}
