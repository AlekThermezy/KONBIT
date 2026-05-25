'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import SlideSidebar from '@/components/layout/SlideSidebar'
import { getCurrentUser } from '@/lib/auth'

const LANGUAGES = [
  { code: 'en', label: '🇺🇸 English', flag: 'EN' },
  { code: 'kreyol', label: '🇭🇹 Kreyòl', flag: 'HT' },
  { code: 'fr', label: '🇫🇷 Français', flag: 'FR' },
  { code: 'es', label: '🇪🇸 Español', flag: 'ES' },
]

type DocFormat = 'txt' | 'pdf' | 'docx' | 'srt' | 'html'

export default function TranslatePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('kreyol')
  const [translating, setTranslating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileFormat, setFileFormat] = useState<DocFormat>('txt')
  const [history, setHistory] = useState<{input: string, output: string, from: string, to: string, time: string}[]>([])
  const [charCount, setCharCount] = useState(0)
  const outputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  // Swap languages
  function swapLangs() {
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
    setOutputText('')
  }

  // Translate text via API
  async function translateText() {
    if (!inputText.trim()) return

    setTranslating(true)
    setOutputText('')

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          source: sourceLang,
          target: targetLang,
        }),
      })

      const data = await response.json()
      if (data.translation) {
        setOutputText(data.translation)
        setHistory(prev => [{
          input: inputText.slice(0, 200),
          output: data.translation.slice(0, 200),
          from: sourceLang,
          to: targetLang,
          time: new Date().toLocaleTimeString(),
        }, ...prev.slice(0, 9)])
      } else {
        setOutputText('[Translation error — try again]')
      }
    } catch {
      setOutputText('[Network error — check connection and try again]')
    }

    setTranslating(false)
  }

  // Download translated text as file
  function downloadOutput(format: DocFormat) {
    const langNames: Record<string, string> = {
      en: 'English',
      kreyol: 'Kreyol',
      fr: 'French',
      es: 'Spanish',
    }

    let content = outputText
    let filename = `translation_${sourceLang}_${targetLang}`
    let mimeType = 'text/plain'

    if (format === 'srt') {
      // Convert to SRT subtitle format
      const lines = outputText.split('\n')
      let srt = ''
      let i = 1
      for (const line of lines) {
        if (line.trim()) {
          srt += `${i}\n00:${String((i - 1) * 3).padStart(2, '0')}:00 --> 00:${String(i * 3).padStart(2, '0')}:00\n${line}\n\n`
          i++
        }
      }
      content = srt
      filename += '.srt'
      mimeType = 'text/plain'
    } else if (format === 'html') {
      content = `<!DOCTYPE html>
<html lang="${targetLang}">
<head><meta charset="UTF-8"><title>Translation ${langNames[sourceLang]} → ${langNames[targetLang]}</title></head>
<body>
<p>${outputText.replace(/\n/g, '</p><p>')}</p>
</body>
</html>`
      filename += '.html'
      mimeType = 'text/html'
    } else {
      filename += `.${format}`
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Handle file upload
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (['pdf', 'docx', 'doc', 'txt', 'srt', 'html'].includes(ext || '')) {
      setFileFormat(ext as DocFormat)
    }

    // Read file content
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setInputText(ev.target.result as string)
        setCharCount((ev.target.result as string).length)
      }
    }
    reader.readAsText(file)
  }

  // Copy output to clipboard
  function copyOutput() {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
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
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-black">
              <span className="text-green-500">Konbit</span>
              <span className="text-white"> Translator</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Translate between English, Haitian Kreyòl, French & Spanish
            </p>
          </div>

          {/* Language Selector Row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-2">FROM</label>
              <select
                value={sourceLang}
                onChange={e => setSourceLang(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} className="bg-gray-900">{l.label}</option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              onClick={swapLangs}
              className="mt-6 w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition text-xl"
              title="Swap languages"
            >
              ⇄
            </button>

            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-2">TO</label>
              <select
                value={targetLang}
                onChange={e => setTargetLang(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} className="bg-gray-900">{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Translator — Two Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Input Panel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-400">
                  {LANGUAGES.find(l => l.code === sourceLang)?.label}
                </div>
                <div className="text-xs text-gray-600">{charCount.toLocaleString()} chars</div>
              </div>
              <textarea
                value={inputText}
                onChange={e => { setInputText(e.target.value); setCharCount(e.target.value.length) }}
                placeholder="Paste text here to translate... or drop a file below"
                className="w-full h-72 bg-transparent resize-none text-white placeholder-gray-600 focus:outline-none text-base leading-relaxed"
              />
              <div className="flex items-center gap-3 mt-2 pt-3 border-t border-white/10">
                <button
                  onClick={translateText}
                  disabled={translating || !inputText.trim()}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition"
                >
                  {translating ? 'Translating...' : 'Translate →'}
                </button>
                <button
                  onClick={() => { setInputText(''); setOutputText(''); setCharCount(0) }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-400 transition"
                >
                  Clear
                </button>
                <label className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-400 cursor-pointer transition">
                  📎 Upload File
                  <input type="file" className="hidden" accept=".txt,.srt,.html,.pdf,.doc,.docx" onChange={handleFileUpload} />
                </label>
              </div>
              {selectedFile && (
                <div className="mt-2 text-xs text-green-500">
                  📄 {selectedFile.name} ({selectedFile.size.toLocaleString()} bytes)
                </div>
              )}
            </div>

            {/* Output Panel */}
            <div className="bg-white/5 border border-green-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-green-400">
                  {LANGUAGES.find(l => l.code === targetLang)?.label}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyOutput}
                    disabled={!outputText}
                    className="text-xs text-gray-500 hover:text-white disabled:opacity-30 transition"
                    title="Copy to clipboard"
                  >
                    📋 Copy
                  </button>
                  <div className="relative group">
                    <button
                      disabled={!outputText}
                      className="text-xs text-gray-500 hover:text-white disabled:opacity-30 transition"
                    >
                      ⬇️ Download ▾
                    </button>
                    <div className="hidden group-hover:block absolute bottom-full right-0 mb-1 bg-gray-900 border border-white/10 rounded-xl overflow-hidden z-10">
                      {(['txt', 'srt', 'html'] as DocFormat[]).map(fmt => (
                        <button
                          key={fmt}
                          onClick={() => downloadOutput(fmt)}
                          className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 text-left transition"
                        >
                          .{fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <textarea
                ref={outputRef}
                value={translating ? 'Translating, please wait...' : outputText}
                readOnly
                placeholder="Translation will appear here..."
                className="w-full h-72 bg-transparent resize-none text-white placeholder-gray-600 focus:outline-none text-base leading-relaxed"
              />
            </div>
          </div>

          {/* Quick Examples */}
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-3">⚡ Quick translate (click to load)</div>
            <div className="flex flex-wrap gap-2">
              {[
                { text: 'Hello, how are you today?', from: 'en', to: 'kreyol' },
                { text: 'Bonswa! Kijan ou ye?', from: 'kreyol', to: 'en' },
                { text: 'Mwen bezwen edikasyon pou timoun yo.', from: 'kreyol', to: 'en' },
                { text: 'Thank you for your patience and commitment.', from: 'en', to: 'kreyol' },
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => { setInputText(example.text); setSourceLang(example.from); setTargetLang(example.to); setCharCount(example.text.length) }}
                  className="text-xs bg-white/5 border border-white/10 hover:border-green-500/30 text-gray-400 hover:text-white px-3 py-2 rounded-lg transition text-left max-w-xs truncate"
                >
                  {example.text}
                </button>
              ))}
            </div>
          </div>

          {/* Format Support Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { fmt: 'TXT', desc: 'Plain text', icon: '📄' },
              { fmt: 'SRT', desc: 'Subtitles', icon: '🎬' },
              { fmt: 'HTML', desc: 'Web page', icon: '🌐' },
              { fmt: 'PDF', desc: 'Coming soon', icon: '📕', disabled: true },
            ].map(f => (
              <div key={f.fmt} className={`p-4 rounded-xl border text-center ${f.disabled ? 'border-white/5 opacity-40' : 'border-white/10'}`}>
                <div className="text-2xl mb-1">{f.icon}</div>
                <div className="text-white text-sm font-medium">.{f.fmt}</div>
                <div className="text-gray-500 text-xs">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Recent History */}
          {history.length > 0 && (
            <div className="mt-8">
              <div className="text-sm text-gray-500 mb-3">🕐 Recent translations</div>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span>{LANGUAGES.find(l => l.code === h.from)?.flag}</span>
                      <span>→</span>
                      <span>{LANGUAGES.find(l => l.code === h.to)?.flag}</span>
                      <span className="ml-auto">{h.time}</span>
                    </div>
                    <div className="text-gray-300 line-clamp-1">"{h.input}"</div>
                    <div className="text-green-400 line-clamp-1 mt-1">→ {h.output}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <SlideSidebar />
    </div>
  )
}