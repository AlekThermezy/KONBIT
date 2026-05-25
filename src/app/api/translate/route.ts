import { NextRequest, NextResponse } from 'next/server'

const LANG_NAMES: Record<string, string> = {
  en: 'English',
  kreyol: 'Haitian Kreyòl',
  fr: 'French',
  es: 'Spanish',
}

const KREYOL_HINTS = `
IMPORTANT - Haitian Kreyòl translation rules:
- Kreyòl uses "ou" for "you" (formal) and "tu" (very informal)
- Common Kreyòl phrases: "Bonswa" (hello), "Mesi" (thank you), "Kijan ou ye?" (how are you?)
- Kreyòl verbs are simpler than French - often just the infinitive form used directly
- Use "mwen", "ou", "li", "nou", "yo" for I, you, he/she, we, they
- Sentence structure is typically Subject-Verb-Object like English
- Numbers: "yon" (1), "de" (2), "twa" (3), "kat" (4), "senk" (5)...
- Kreyòl does NOT use gender for adjectives - same word for male/female
- Example: "The woman is beautiful" = "Fanm nan bèl" (not "bèl" matching gender)
- "Ap" marks ongoing action: "Mwen ap manje" = "I am eating"
- "Te" marks past: "Mwen te ale" = "I went"
- "Pral" marks future: "Mwen pral ale" = "I will go"
`

export async function POST(req: NextRequest) {
  try {
    const { text, source, target } = await req.json()

    if (!text?.trim()) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: 'Text too long (max 5000 characters)' }, { status: 400 })
    }

    const sourceName = LANG_NAMES[source] || source
    const targetName = LANG_NAMES[target] || target

    let systemPrompt = `You are a professional translator. Translate the following text from ${sourceName} to ${targetName} accurately and naturally.`
    let context = ''

    if (target === 'kreyol') {
      systemPrompt += KREYOL_HINTS
      context = `Translate to Haitian Kreyòl (Kreyòl Ayisyen). Use common everyday Kreyòl, not formal or archaic forms.`
    }
    if (source === 'kreyol') {
      context = `The following text is in Haitian Kreyòl (Kreyòl Ayisyen). Translate it to ${targetName}.`
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Translation service not configured' }, { status: 500 })
    }

    const response = await fetch(`${process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${context}\n\nTranslate this:\n\n${text}` },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('DeepSeek error:', error)
      return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
    }

    const data = await response.json()
    const translation = data.choices?.[0]?.message?.content?.trim() || ''

    return NextResponse.json({ translation, from: source, to: target })
  } catch (err) {
    console.error('Translate error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}